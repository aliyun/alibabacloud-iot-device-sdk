const util = require('util');
// const Device = require('./device');
const Device = require('./device');
const SubDevice = require('./subdevice');

const {
  createDebug,
  signUtil,
  tripleExpectNotNull,
  tripleIgnoreCase,
  mqttMatch,
  mqttNotMatch
} = require('./utils');
const debug = createDebug('gateway');

class Gateway extends Device {
  constructor(...args) {
    super(...args);
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
    const subDevice = new SubDevice(this,device); 
    console.log(">>> subdevice _subscribePresetTopic")
    this._subscribePresetTopic(subDevice);
    this._addSubDevices(subDevice);
    // 通过网关登录
    this._publishAlinkMessage({
        params: signUtil(device),
        pubTopic: this.model.LOGIN_TOPIC,
      },(resp)=>{
        cb(resp);
        if (resp.code === 200) {
          subDevice.emit("connect");
        } else {
          subDevice.emit("errorerror",resp);
        }
      }
      
    );
    
    return subDevice;

    // return this._careteSubDevice(device);
    // const sub = this.careteSubDevice(device);
    // return sub;
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
    // 开始处理返回值
    try {
      let res = JSON.parse(message.toString());
      let subDevice;
      console.log('gateway _mqttCallbackHandler',topic,res);

      //处理子设备服务返回数据,同步或者异步方式
      subDevice = this._searchMqttMatchServiceTopicWithSubDevice(topic);
      if(subDevice){
        console.log("_searchMqttMatchServiceTopicWithSubDevice");
        subDevice._onReceiveService(topic,res);
        return; 
      }
      // 处理子设备影子服务回调
      subDevice = this._searchMqttMatchShadowTopicWithSubDevice(topic);
      if(subDevice){
        console.log("_searchMqttMatchShadowTopicWithSubDevice");
        subDevice._onShadowCB(res);
        return; 
      }

      // 远程配置回调
      subDevice = this._searchMqttMatchConfigTopicWithSubDevice(topic);
      if(subDevice){
        console.log("_searchMqttMatchConfigTopicWithSubDevice");
        subDevice._onConfigCB(res);
        return; 
      }
    
      //其他通用回调
      const {id: cbID} = res;
      const callback = this._getAllSubDevicesCallback(cbID);
      console.log("gateway通用回调",topic,callback,message);
      if(callback){callback(res);}

    } catch (e) {
      console.log('_mqttCallbackHandler error',e)
    }
 
    // device 、gateway message handler
    super._mqttCallbackHandler(topic,message);
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
      // console.log('>>>topic',topic);
      // console.log('>>>subDevice.model.CONFIG_REPLY_TOPIC',subDevice.model.CONFIG_REPLY_TOPIC);
      // console.log('>>>mqttMatch(subDevice.model.getWildcardConfigTopic(),topic)',mqttMatch(subDevice.model.getWildcardConfigTopic(),topic));
      // console.log('>>>mqttNotMatch(subDevice.model.CONFIG_REPLY_TOPIC,topic)',mqttNotMatch(subDevice.model.CONFIG_REPLY_TOPIC,topic));
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
      // console.log('>>>subDevice cbID',subDevice._cb);
      // console.log('>>>subDevice cb',subDevice._cb);
      // console.log('>>>find subDevice cb!!!',cb);
      
    }); 
    return callback;
  }
}

module.exports = Gateway;
