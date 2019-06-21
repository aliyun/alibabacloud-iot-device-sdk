
// const Device = require('./device');
const Thing = require('./thing');
const SubDevice = require('./subdevice');

const {
  createDebug,
  signUtil,
  tripleExpectNotNull,
  tripleIgnoreCase,
  mqttMatch,
  mqttNotMatch,
  isJsonString
} = require('./utils');
const debug = createDebug('gateway');

class Gateway extends Thing {
  constructor(config) {
    super(config);
    // create mqttclient
    this._createClient(this.model);
    // subcribe client event and preset topic
    this._subscribeClientEvent();
    // 子设备管理
    this.subDevices = [];
    // 调试模式标识
    debug('debugger mode');
  }
  // 入参，设备三元组组成的数组
  addTopo(devices, cb) {
    const signed = devices.map((device) => signUtil(device));
    this._publishAlinkMessage({
        method: this.model.ADD_TOPO_METHOD,
        pubTopic: this.model.ADD_TOPO_TOPIC,
        params: signed,
      },
      cb
    );
  }

  getTopo(cb) {
    this._publishAlinkMessage({
        method: this.model.GET_TOPO_METHOD,
        pubTopic: this.model.GET_TOPO_TOPIC,
        params: {},
      },
      cb
    );
  }
  /*
  {"id" : "123",
    "version":"1.0",
    "params" : [{
        "deviceName" : "deviceName1234",
        "productKey" : "1234556554"
    }],
    "method":"thing.topo.delete" } 
  */
  removeTopo(devices, cb) {
    this._publishAlinkMessage({
        method: this.model.DELETE_TOPO_METHOD,
        pubTopic: this.model.DELETE_TOPO_TOPIC,
        params: devices,
      },
      cb
    );
  }
  login(device, cb) {
    // 忽略三元组大小写
    tripleIgnoreCase(device);
    //  校验三元组非空
    tripleExpectNotNull(device);
    // 创建subdevice
    const subDevice = new SubDevice(device,this); 
  
    this._addSubDevices(subDevice);
    // 通过网关登录
    this._publishAlinkMessage({
        params: signUtil(device),
        pubTopic: this.model.LOGIN_TOPIC,
      },(resp)=>{
        cb(resp);
        if (resp.code === 200) {
          // gateway subscribe subDevice Topic
          // subdevice subscribe topic must until subdevice login succeed!
          this._subscribePresetTopic(subDevice);
          subDevice.emit("connect");
        } else {
          subDevice.emit("error",resp);
        }
      }
    );
    
    return subDevice;
  }
  logout(params, cb) {
    this._publishAlinkMessage({
        params: params,
        pubTopic: this.model.LOGOUT_TOPIC,
      },
      cb
    );
  }

  /*
   * 网关动态注册子设备
    "params": [
      {
        "deviceName": "deviceName1234",
        "productKey": "1234556554"
      }
    ]
  */
  regiestSubDevice(data, cb) {
    let params;
    if (data instanceof Array) {
      params = data;
    } else if (data instanceof Object) {
      params = [data];
    }
    this._publishAlinkMessage({
        method: this.model.SUBDEVICE_REGISTER_METHOD,
        params,
        pubTopic: this.model.SUBDEVICE_REGISTER_TOPIC,
      },
      cb
    );
  }

  /*
  * 重写device message方法，因为消息只发送到网关，所以要通过网关转发到子设备
  */ 
  _mqttCallbackHandler(topic,message) {

    // 情况1:返回值为非结构化数据（非结构化可能是：基础版产品或是用户自定义topic）
    if(isJsonString(message.toString())==false){  
      return;
    }

    // 开始处理返回值
    try {
      let res = JSON.parse(message.toString());
      let subDevice;
      // console.log('gateway _mqttCallbackHandler',topic,res);

      //处理On Props Set回调 todo
      // topic /sys/<pk>/<dn>/thing/service/property/set
      subDevice = this._searchMqttMatchOnSetPropsTopicWithSubDevice(topic);
      if(subDevice){
        subDevice._onPropsCB(res);
        return; 
      }
      
      //处理子设备服务返回数据,同步或者异步方式
      subDevice = this._searchMqttMatchServiceTopicWithSubDevice(topic);
      if(subDevice){
        // console.log("gateway _searchMqttMatchServiceTopicWithSubDevice",topic);
        subDevice._onReceiveService(topic,res);
        return; 
      }
      // 处理子设备影子服务回调
      subDevice = this._searchMqttMatchShadowTopicWithSubDevice(topic);
      if(subDevice){
        // console.log("_searchMqttMatchShadowTopicWithSubDevice");
        subDevice._onShadowCB(res);
        return; 
      }

      // 远程配置回调
      subDevice = this._searchMqttMatchConfigTopicWithSubDevice(topic);
      if(subDevice){
        // console.log("_searchMqttMatchConfigTopicWithSubDevice");
        subDevice._onConfigCB(res);
        return; 
      }
    
      //其他通用回调
      const {id: cbID} = res;
      const callback = this._getAllSubDevicesCallback(cbID);
      // console.log("gateway通用回调",topic,callback,message);
      if(callback){callback(res);}

    } catch (e) {
      console.log('_mqttCallbackHandler error',e)
    }

    // device 、gateway message handler
    super._mqttCallbackHandler(topic,message);
  }

  // 子设备On Set Porps topic
  _searchMqttMatchOnSetPropsTopicWithSubDevice(topic){
    return this._getSubDevices().find( subDevice => 
      mqttMatch(subDevice.model.ONSET_PROPS_TOPIC,topic)
    );
  }
  // 子设备的服务topic
  _searchMqttMatchServiceTopicWithSubDevice(topic){
    return this._getSubDevices().find(subDevice => 
      mqttMatch(subDevice.model.getWildcardServiceTopic(),topic) || mqttMatch(subDevice.model.RRPC_REQ_TOPIC,topic)
    );
  }
   // 子设备影子设备topic 
  _searchMqttMatchShadowTopicWithSubDevice(topic){
    return this._getSubDevices().find(subDevice => 
      mqttMatch(subDevice.model.SHADOW_SUBSCRIBE_TOPIC,topic)
    );
  }
  // 子设备的远程配置topic
  _searchMqttMatchConfigTopicWithSubDevice(topic){
    return this._getSubDevices().find(subDevice => {
      return mqttMatch(subDevice.model.getWildcardConfigTopic(),topic) && 
      (mqttNotMatch(subDevice.model.CONFIG_REPLY_TOPIC,topic) === true)
    });
  }

  _getSubDevices(){
    if(!this.subDevices) {
      this.subDevices = [];
    }
    return this.subDevices;
  }
  _addSubDevices(subDevice){
    this._getSubDevices().push(subDevice);
  }

  _getAllSubDevicesCallback(cbID) {
    let callback;
    this._getSubDevices().forEach(subDevice => {
      // console.log('>>>subDevice',subDevice);
      let cb = subDevice._popCallback(cbID);
      if(cb) {
        callback = cb;
      }
      return;      
    }); 
    return callback;
  }
}

module.exports = Gateway;
