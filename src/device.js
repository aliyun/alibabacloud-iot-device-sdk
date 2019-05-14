const mqtt = require('mqtt');
const EventEmitter = require('events');
const util = require('util');

const {
  createGuid,
  createDebug,
  getIP,
  isJsonString,
  mqttMatch,
  mqttNotMatch
} = require('./utils');
const debug = createDebug('device');
const guid = createGuid();
const packagejson = require('../package.json');
const Model = require('./model');
const nilFn = ()=>{};

class Device extends EventEmitter {

  constructor(config = {},mqttClient) {
    super();
    //init model
    this.model = new Model(config);
    // init mqttClient
    if (mqttClient === undefined) {
      this._createClient(this.model);
    } else {
      this._mqttClient = mqttClient;
    }
    // subcribe client event and preset topic
    this._subscribeClientEvent();
  
    //上报客户端sdk信息 todo:
    // this._reportSDKInfo();
    this.serveCB = [];
    this._onShadowCB;
    this._onConfigCB = nilFn;
    //兼容旧版本
    this._compatibleoverdue();
  }

  // 发布消息到topic
  publish(...args) {
    this._mqttClient.publish(...args);
  }
  // 订阅消息
  subscribe(...args) {
    this._mqttClient.subscribe(...args);
  }
  // 取消订阅消息
  unsubscribe(...args) {
    this._mqttClient.unsubscribe(...args);
  }
  end(...args) {
    this._mqttClient.end(...args);
  }

  // 属性快捷获取
  get connected() {
    return this._mqttClient.connected;
  }
  get mqttClient() {
    return this._mqttClient;
  }
 

  /*
    高级版设备属性上报：详细文档地址：https://help.aliyun.com/document_detail/89301.html?spm=a2c4g.11186623.6.660.3ad223dcF1jjSU
    "params": {"key": "key","value": "value"}
  */
  postProps(props = {}, cb) {
    this._publishAlinkMessage({
      method: this.model.POST_PROPERY_METHOD,
      pubTopic: this.model.POST_PROPS_TOPIC,
      params: props
    }, cb);
  }
  /*
    高级版设备事件上报：详细文档地址：https://help.aliyun.com/document_detail/89301.html?spm=a2c4g.11186623.6.660.3ad223dcF1jjSU
    "params": {"key": "key","value": "value"}
  */
  postEvent(eventName, params = {}, cb = () => {}) {
    this._publishAlinkMessage({
      method: this.model.getPostEventMethod(eventName),
      pubTopic: this.model.getPostEvenTopic(eventName),
      params
    }, cb);
  }

  /*
    高级版设备服务监听：详细文档地址：https://help.aliyun.com/document_detail/89301.html?spm=a2c4g.11186623.6.660.3ad223dcF1jjSU
    "params": 
      serviceName，cb
  */
  onService(serviceName, cb) {
    if (this._addServiceListenerFn == undefined) {
      this._addServiceListenerFn = this._wrapServiceSubscribe(serviceName, cb);
    }
    const reply = this._wrapReplyServiceFn(serviceName);
    const newCb = (res)=>{
      cb(res,reply)
    }
    this._addServiceListenerFn();
    this._pushReceiveServiceCallback(serviceName, newCb);
  }

  // 封装服务响应的reply函数
  _wrapReplyServiceFn(serviceName){
    /*
      回应云端调用服务的接口
      params的数据结构:{
        id:xxx
        "code": 200,
        "data": {
          output:xxx
        }
    */
    const fn =  (params,type='async') => {
      if(params.id == undefined) { params.id = guid() }
      let topic;
      // 同步调用和异步调用
      if(type=='async'){
        topic = this.model.getServiceRespTopic(serviceName);
      } else {
        const rrpcid = this._getServiceRRPCID(serviceName);
        topic =  this.model.getRRPCRespTopic(rrpcid);
      }
      // console.log('topic:',topic);
      // console.log('params',params);
      this._publishMessage(topic,params);
    }
    return fn;
  }


  /*
    设备标签上报：详细文档地址：https://help.aliyun.com/document_detail/89304.html?spm=a2c4g.11174283.6.662.7e9d16685aIS1k
    "params": [{"attrKey": "key","attrValue": "value"},{},{}]
    每次上报不会清除上一次的tag
  */
  postTags(tags = [], cb = () => {}) {
    this._publishAlinkMessage({
      method: this.model.POST_TAGS_METHOD,
      pubTopic: this.model.TAG_TOPIC,
      params: tags
    }, cb);
  }
  // 删除设备标签
  deleteTags(tags = [], cb) {
    let params = tags.map((tag) => {
      return {
        attrKey: tag
      }
    })
    this._publishAlinkMessage({
      method: this.model.DELETE_TAGS_METHOD,
      pubTopic: this.model.TAG_DELETE_TOPIC,
      params: params
    }, cb);
  }

  /*
   * 获取远程配置
   * 技术文档地址：https://help.aliyun.com/document_detail/89308.html?spm=a2c4g.11186623.6.666.53e168d0joDPCn
   * 返回数据格式 example
  { 
    code: 200,
    data:
    { configId: '3cfda5091d5b4f53b51621cf4bbf86ec',
      configSize: 16,
      getType: 'file',
      sign: 'xxx',
      signMethod: 'Sha256',
      url: 'https://otx-devicecenter-thing-config-cn-shanghai-online.oss-cn-shanghai.aliyuncs.com/xxxxxx' },
    id: '3',
    method: 'thing.config.get',
    version: '1.0' 
  }
  */
  getConfig(cb = () => {}) {
    // 目前只支持产品维度和文件类型
    const params = {
      "configScope": "product",
      "getType": "file"
    }
    this._publishAlinkMessage({
      method: this.model.GET_CONFIG_METHOD,
      pubTopic: this.model.CONFIG_TOPIC,
      params: params
    }, cb);
  }

  //当远程配置下发到设备触发 todo
  onConfig(cb) {
    this._onConfigCB = cb;
  }

  // 获取设备影子数据
  getShadow() {
    const msg = {
      "method": "get"
    }
    this._publishMessage(this.model.SHADOW_GET_TOPIC, msg);
  }

  // 设备上报实际值
  postShadow(reported) {
    const msg = {
      "method": "update",
      "state": {
        "reported": reported
      },
      "version": Date.now()
    }
    this._publishMessage(this.model.SHADOW_POST_TOPIC, msg)
  }

  // 删除影子设备
  deleteShadow(keys) {
    let reported = {};
    if (typeof keys == 'string') {
      const key = keys;
      reported[key] = "null"
    }
    if (typeof keys == "object") {
      keys.forEach((key) => {
        reported[key] = "null"
      });

    }
    if (keys == undefined) {
      reported = "null"
    }
    const msg = {
      "method": "delete",
      "state": {
        reported
      },
      "version": Date.now()
    }
    this._publishMessage(this.model.SHADOW_POST_TOPIC, msg)

  }
  // 注册影子设备监听
  onShadow(cb) {
    this._onShadowCB = cb;
  }

  // 发送普通消息
  _publishMessage(pubTopic, msg = {}, qos = 0) {
    const payload = JSON.stringify(msg);
    this.publish(pubTopic, payload, {
      qos
    }, (err, res) => {
      if (err) {
        // console.log('publish error', pubTopic, msg.id, err, res)
      }
    });
  }

  // 发送alink协议消息
  _publishAlinkMessage({
    method = "",
    pubTopic,
    params,
    timeout
  }, cb) {
    const id = guid();
    //暂存回调函数
    this._pushCallback(id, cb);
    const msg = this.model.genAlinkContent(method, params, id);
    const payload = JSON.stringify(msg);
    // console.log("_publishAlinkMessage:",payload,pubTopic);
    this.publish(pubTopic, payload, (err, res) => {
      debug('pub callback', pubTopic, msg.id, err, res);
      // console.log('pub callback', pubTopic, msg.id, err, res);
      if (err) {
        debug('publish error', pubTopic, msg.id, err, res)
      }
    });
  }

  _subscribeClientEvent(client = this._mqttClient){
    ['connect', 'error', 'close', 'reconnect', 'offline', 'message'].forEach(evtName => {
      this._mqttClient.on(evtName, (...args) => {
        debug(`mqtt client ${evtName}`);
        if (evtName === 'connect') {
          debug('mqtt connected');
          this._subscribePresetTopic();
        }
        // 事件流到设备端开发者lib中的方式有2中，通过subscribe和通过callback
        if (evtName === 'message') {
          // 1：处理subscribe通知
          this.emit(evtName,...args);
          // 2：处理callback通知
          this._mqttCallbackHandler(...args);
          return;
        }
        if (evtName === 'close') {
          // console.log("on close");
        }
        // 其他事件 'connect', 'error', 'close', 'reconnect', 'offline'处理
        this.emit(evtName,args);
      });
    });
  }

  _createClient() {
    this._mqttClient = mqtt.connect(this.model.brokerUrl, this.model.genConnectPrarms());
  }

  _subscribePresetTopic(thing=this) {
    //初始化只需要订阅 属性返回的topic和标签删除返回的topic，事件topic需要跟进event动态订阅，所以初始化不需要订阅
    [
      // "/sys/#",
      // "/shadow/#",
      // "/ext/#"
      // devices
      thing.model.POST_PROPS_REPLY_TOPIC,
      thing.model.getWildcardEvenTopic(),
      thing.model.TAG_REPLY_TOPIC,
      thing.model.TAG_DELETE_REPLY_TOPIC,
      thing.model.CONFIG_REPLY_TOPIC,
      thing.model.SHADOW_SUBSCRIBE_TOPIC,
      thing.model.CONFIG_SUBSCRIBE_TOPIC,
      thing.model.CONFIG_SUBSCRIBE_RESP_TOPIC,
      // gateway
      thing.model.ADD_TOPO_REPLY_TOPIC,
      thing.model.DELETE_TOPO_REPLY_TOPIC,
      thing.model.GET_TOPO_REPLY_TOPIC,
      thing.model.LOGIN_REPLY_TOPIC,
      thing.model.LOGOUT_REPLY_TOPIC,
      thing.model.SUBDEVICE_REGISTER_REPLY_TOPIC,
      thing.model.RRPC_REQ_TOPIC
    ].forEach((replyTopic) => {
      // console.log("subscribe topic>>>>>>", replyTopic);
      this.subscribe(replyTopic, {
        "qos": 1
      }, (error, res) => {
        // console.log(">>>>>> subscribe topic resp",error,res);
        if (error) {
          debug('sub error:', error.toString); 
        }
      })
    })
  }
  // 处理内部message以及各种方法的回调
  _mqttCallbackHandler(topic,message) {
    // console.log('device _mqttCallbackHandler',topic,message);
    // 几种不处理的情况
    // 情况1:回调函数为空
    if (this._cb==[] && this._serviceCB==[] && this._onShadowCB == undefined && this._onConfigCB == undefined ){
      return;
    }
    // 情况2:返回值为非结构化数据（非结构化可能是：基础版产品或是用户自定义topic）
    if(isJsonString(message.toString())==false){  
      return;
    }
    // 开始处理返回值
    try {
      let res = JSON.parse(message.toString());
      //处理物模型服务订阅返回数据,同步或者异步方式
      if((mqttMatch(this.model.getWildcardServiceTopic(),topic) || mqttMatch(this.model.RRPC_REQ_TOPIC,topic)) && this._onReceiveService!=undefined){
        this._onReceiveService(topic,res);
        return; 
      }
      // 影子设备reply和云端或应用下发影子配置通知,很久之前cmp定义的方法名称，所以格式与其他名称不太相同
      if(mqttMatch(this.model.SHADOW_SUBSCRIBE_TOPIC,topic) && this._onShadowCB!=undefined){
        this._onShadowCB(res);
        return;
      }
      // 远程配置回调
      if(
          mqttMatch(this.model.getWildcardConfigTopic(),topic) &&
          mqttNotMatch(this.model.CONFIG_REPLY_TOPIC,topic) &&
          this._onConfigCB!=undefined
        ){
        this._onConfigCB(res);
        return;
      }
       //其他通用回调
      const {id: cbID} = res;
      const callback = this._popCallback(cbID);
      if(callback){callback(res);}

    } catch (e) {
      // console.log('_mqttCallbackHandler error',e)
    }
  }
  // 查找回调函数,找到后使
  _popCallback(cbID) {
    const cb = this._getCallbackById(cbID);
    delete this._cb[cbID];
    return cb;
  }

  _wrapServiceSubscribe(serviceName, cb) {
    let subscription;
    const fn = () => {
      //初始化
      if (subscription == undefined) {
        subscription = {}
      };
      // 查找是否存在
      if (subscription.serviceName == undefined) {
        this.subscribe(this.model.getServiceTopic(serviceName), (error, res) => {
          if (error) {
            debug('sub error:', res);
          }
        });
        subscription.serviceName = true;
      }
    }
    return fn;
  }

  //处理接收云端下发服务调用
  _onReceiveService(topic,res) {
    const {
      method
    } = res;
    let serviceName = method.split('.').pop();
    let cb = this._serviceCB[serviceName] || (() => {});
    // 如果是rrpc的方式产生的服务同步调用，需要记录服务的id
    if(mqttMatch(this.model.RRPC_REQ_TOPIC,topic)){
      const rrpcid = topic.split('/').pop();
      this._pushReceiveServiceRRPCID(serviceName,rrpcid);
    }
    cb(res);
  }
  _pushCallback(msgid, fn) {
    // 初始化回调函数数组
    if (this._cb == undefined) {
      this._cb = []
    };
    this._cb[msgid] = fn;
  }
  _getCallbackById(msgid) {
    // 初始化回调函数数组
    if (this._cb == undefined) {
      this._cb = []
    };
    return this._cb[msgid];
  }
  _pushReceiveServiceCallback(serviceName, fn) {
    // 初始化回调函数数组
    if (this._serviceCB == undefined) {
      this._serviceCB = []
    };
    this._serviceCB[serviceName] = fn;
  }
  _pushReceiveServiceRRPCID(serviceName, rrpdid) {
    // 初始化回调函数数组
    if (this._serviceRRPCID == undefined) {
      this._serviceRRPCID = []
    };
    this._serviceRRPCID[serviceName] = rrpdid;
  }
  _getServiceRRPCID(serviceName) {
    if(this._serviceRRPCID && this._serviceRRPCID[serviceName]){
      return this._serviceRRPCID[serviceName]
    }
    return undefined;
  }

    //上报sdk版本信息
  _reportSDKInfo() {
    const networkInfo = `WiFi|` + getIP();
    let sdkInfo = [];
    const KVS = {
      'SYS_SDK_LANGUAGE': 'NodeJS',
      'SYS_LP_SDK_VERSION': packagejson.version,
      'SYS_SDK_IF_INFO': networkInfo,
    };
    Object.keys(KVS).forEach(function (key) {
      sdkInfo.push({
        "attrKey": key,
        "attrValue": KVS[key],
        "domain": "SYSTEM"
      })
    });
    this.postTags(sdkInfo);
    // console.log('publish sdk info',sdkInfo);
  }

  _compatibleoverdue() {
    //兼容老版本serve 方法 0.5版本去掉
    // this.serve = this.onService;
  }
}



module.exports = Device;