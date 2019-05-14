import {
  ALIYUN_BROKER_METHODS_TEMPLATE as METHODS_TEMPLATE,
  ALIYUN_BROKER_TOPICS as BROKER_TOPICS
} from './const'
const {
  hmacSign,
  getRTEvn
} = require('./utils');
const util = require('util');

const isBrowser =
  (typeof window !== 'undefined' && typeof window.document !== 'undefined') ||
  (typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope);
const DEFAULT_REGION = 'cn-shanghai';
const BROKER_URL = '%s%s.iot-as-mqtt.%s.aliyuncs.com:%s/';
const tlsPrefix = ['tls://', 'mqtts://', 'wss://','wxs://','alis://'];

export default class Model {

  constructor(config) {
    //初始化参数
    this.init(config)
    //参数校验合法
    this.configchecking();
  }

  // 获取通配订阅topic
  getWildcardTopic() {
    return util.format("/sys/%s/%s/thing", this.productKey, this.deviceName);
  }

  // 获取三元组
  triple() {
    const {
      productKey,
      deviceName,
      deviceSecret
    } = this;
    return {
      productKey,
      deviceName,
      deviceSecret
    }
  }

  getPostEventMethod(eventName) {
    return util.format(METHODS_TEMPLATE.POST_EVENT, eventName);
  }
  getPostEvenTopic(eventName) {
    return util.format(BROKER_TOPICS.EVENT_POST_TOPIC, this.productKey, this.deviceName, eventName);
  }
  getWildcardEvenTopic() {
    return util.format(BROKER_TOPICS.EVENT_WILDCARD_TOPIC, this.productKey, this.deviceName);
  }
  getPostEvenReplyTopic(eventName) {
    return util.format(BROKER_TOPICS.EVENT_POST_REPLY_TOPIC, this.productKey, this.deviceName, eventName);
  }
  getServiceTopic(serviceName) {
    let serviceNameReplace = serviceName;
    if (serviceName.indexOf('/') != -1) {
      serviceNameReplace = serviceName.replace('.', '/')
    }
    return util.format(BROKER_TOPICS.SERVICE_TOPIC, this.productKey, this.deviceName, serviceNameReplace)
  }
  getWildcardServiceTopic(){
    return util.format(BROKER_TOPICS.SERVICE_TOPIC, this.productKey, this.deviceName, '#')
  }
  getWildcardConfigTopic(){
    return util.format(BROKER_TOPICS.CONFIG_WILDCARD_TOPIC, this.productKey, this.deviceName)
  }

  getServiceRespTopic(serviceName) {
    let serviceNameReplace = serviceName;
    if (serviceName.indexOf('/') != -1) {
      serviceNameReplace = serviceName.replace('.', '/')
    }
    return util.format(BROKER_TOPICS.SERVICE_REPLY_TOPIC, this.productKey, this.deviceName, serviceNameReplace)
  }

  getRRPCRespTopic(msgId){
    return util.format(BROKER_TOPICS.RRPC_RESP_TOPIC, this.productKey, this.deviceName, msgId)
  }

  //生成alink协议内容
  genAlinkContent(method, params, id="", version = '1.0') {
    const msg = {
      id,
      version,
      params,
      method
    };
    return msg;
  }

  /**
   * 连接参数生成规则
   * broker:${YourProductKey}.iot-as-mqtt.${Region}.aliyuncs.com:1883 
   *    Region:https://help.aliyun.com/document_detail/40654.html?spm=a2c4g.11186623.2.14.6cba65fekp352N
   * ClientId: 表示客户端ID，建议使用设备的MAC地址或SN码，64字符内 ，clientId+"|securemode=3,signmethod=hmacsha1,timestamp=132323232|"
   * Username: deviceName+"&"+productKey 
   * Password: sign_hmac(deviceSecret,content)
   * securemode：表示目前安全模式，可选值有2 （TLS直连模式）和3（TCP直连模式）
   * signmethod：签名算法，支持hmacmd5，hmacsha1，hmacsha256和 sha256，默认为hmacmd5。
   * timestamp: 可选
   */
  genConnectPrarms() {
    let params =  {
      clientId: `${this.clientId}|securemode=${
            this.securemode
        },
        signmethod=hmac${this.signAlgorithm},
        timestamp=${this.timestamp}|`,
      username: `${this.deviceName}&${this.productKey}`,
      password: hmacSign(
        this.signAlgorithm,
        this.deviceSecret,
        `clientId${this.clientId}deviceName${this.deviceName}productKey${
            this.productKey
            }timestamp${this.timestamp}`
      ),
      keepalive: this.keepalive,
      clean: this.clean,
    }
    // 支付宝小程序api全局对象my
    if(getRTEvn()==='alipay-min'){
      params.my = my;
    }
    return params;
  }

  getLogoutTopic(pk,dn) {
    
  }

  // 初始化连接参数
  init(config) {
    // 判断是否使用加密模式
    if (
      (config.brokerUrl && tlsPrefix.some(prefix => config.brokerUrl.startsWith(prefix))) ||
      (config.protocol && tlsPrefix.some(prefix => config.protocol.startsWith(prefix))) ||
      config.tls 
    ) {
      this.securemode = 2;
      this.tls = true;
    } else {
      this.securemode = 3;
    }
    // 浏览器使用433端口，非浏览器使用1883端口
    if (isBrowser) {
      if (this.tls) {
        this.brokerProtocol = 'wss://';
      } else {
        this.brokerProtocol = 'ws://';
      }
      this.brokerPort = 443;
    } else {
      if (this.tls) {
        this.brokerProtocol = 'mqtts://';
      } else {
        this.brokerProtocol = 'mqtt://';
      }
      this.brokerPort = 1883;
    }

    // 补充自定义protocol，支持微信小程序wxs://和阿里小程序alis://
    if (config.protocol && (config.protocol.startsWith('wxs') || config.protocol.startsWith('alis'))) {
      // 支持wxs://和wxs两种传入模式
      this.brokerProtocol = config.protocol.indexOf('://')!=-1?config.protocol:config.protocol+"://";
      this.brokerPort = 443;
    } 

    //三元组忽略大小写
    Object.keys(config).forEach((originKey) => {
      let key = originKey.toLowerCase();
      switch (key) {
        case "productkey":
          this.productKey = config[originKey];
          break;
        case "devicename":
          this.deviceName = config[originKey];
          break;
        case "devicesecret":
          this.deviceSecret = config[originKey];
          break;
      }
    });
    this.region = config.region || config.regionId;
    this.keepalive = config.keepalive || 60; //keepalive，默认60
    this.clean = config.clean || false; //cleanSession配置选项
    this.signAlgorithm = config.signAlgorithm || 'sha1';
    this.config = config || {};
    if (config.brokerUrl) {
      this.brokerUrl = config.brokerUrl;
    } else {
      this.brokerUrl = util.format(
        BROKER_URL,
        this.brokerProtocol,
        this.productKey,
        this.region || DEFAULT_REGION,
        this.brokerPort
      );
    }
    this.timestamp = Date.now();
    this.clientId = config.clientId ?
      `${config.clientId}_aliyun-iot-device-sdk-js` :
      `${this.productKey}&${this.deviceName}_aliyun-iot-device-sdk-js`;

    /* 初始化topic */
    //methods
    this.POST_PROPERY_METHOD = METHODS_TEMPLATE.POST_PROPERY
    // this.POST_EVENT = util.format(METHODS_TEMPLATE.POST_EVENT, eventName);
    this.POST_TAGS_METHOD = METHODS_TEMPLATE.POST_TAGS;
    this.DELETE_TAGS_METHOD = METHODS_TEMPLATE.DELETE_TAGS;
    this.GET_CONFIG_METHOD = METHODS_TEMPLATE.GET_CONFIG;
    this.ADD_TOPO_METHOD = METHODS_TEMPLATE.ADD_TOPO;
    this.DELETE_TOPO_METHOD = METHODS_TEMPLATE.DELETE_TOPO;
    this.GET_TOPO_METHOD = METHODS_TEMPLATE.GET_TOPO;
    this.SUBDEVICE_REGISTER_METHOD = METHODS_TEMPLATE.SUBDEVICE_REGISTER;

    //topic
    const _formatWithPKDN = template => util.format(template, this.productKey, this.deviceName);
    this.POST_PROPS_TOPIC = _formatWithPKDN(BROKER_TOPICS.PROPERTY_POST_TOPIC)
    this.POST_PROPS_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.PROPERTY_POST_REPLY_TOPIC)
    // this.POST_EVENT_TOPIC = _formatWithPKDN(BROKER_TOPICS.EVENT_POST_TOPIC)
    // this.POST_EVENT_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.EVENT_POST_REPLY_TOPIC)
    this.SERVICE_TOPIC = _formatWithPKDN(BROKER_TOPICS.SERVICE_TOPIC)
    this.TAG_TOPIC = _formatWithPKDN(BROKER_TOPICS.TAG_TOPIC)
    this.TAG_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.TAG_REPLY_TOPIC)
    this.TAG_DELETE_TOPIC = _formatWithPKDN(BROKER_TOPICS.TAG_DELETE_TOPIC)
    this.TAG_DELETE_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.TAG_DELETE_REPLY_TOPIC)
    this.CONFIG_TOPIC = _formatWithPKDN(BROKER_TOPICS.CONFIG_TOPIC)
    this.CONFIG_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.CONFIG_REPLY_TOPIC)
    this.CONFIG_SUBSCRIBE_TOPIC = _formatWithPKDN(BROKER_TOPICS.CONFIG_SUBSCRIBE_TOPIC)
    this.CONFIG_SUBSCRIBE_RESP_TOPIC = _formatWithPKDN(BROKER_TOPICS.CONFIG_SUBSCRIBE_RESP_TOPIC)
    this.SHADOW_SUBSCRIBE_TOPIC = _formatWithPKDN(BROKER_TOPICS.SHADOW_SUBSCRIBE_TOPIC)
    this.SHADOW_GET_TOPIC = _formatWithPKDN(BROKER_TOPICS.SHADOW_GET_TOPIC)
    this.SHADOW_POST_TOPIC = _formatWithPKDN(BROKER_TOPICS.SHADOW_POST_TOPIC)
    this.RRPC_REQ_TOPIC = _formatWithPKDN(BROKER_TOPICS.RRPC_REQ_TOPIC)

    // gateway
    this.ADD_TOPO_TOPIC = _formatWithPKDN(BROKER_TOPICS.ADD_TOPO_TOPIC)
    this.ADD_TOPO_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.ADD_TOPO_REPLY_TOPIC)
    this.DELETE_TOPO_TOPIC = _formatWithPKDN(BROKER_TOPICS.DELETE_TOPO_TOPIC)
    this.DELETE_TOPO_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.DELETE_TOPO_REPLY_TOPIC)
    this.GET_TOPO_TOPIC = _formatWithPKDN(BROKER_TOPICS.GET_TOPO_TOPIC)
    this.GET_TOPO_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.GET_TOPO_REPLY_TOPIC)
    this.LOGIN_TOPIC = _formatWithPKDN(BROKER_TOPICS.LOGIN_TOPIC)
    this.LOGIN_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.LOGIN_REPLY_TOPIC)
    this.LOGOUT_TOPIC = _formatWithPKDN(BROKER_TOPICS.LOGOUT_TOPIC)
    this.LOGOUT_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.LOGOUT_REPLY_TOPIC)
    this.SUBDEVICE_REGISTER_TOPIC = _formatWithPKDN(BROKER_TOPICS.SUBDEVICE_REGISTER_TOPIC)
    this.SUBDEVICE_REGISTER_REPLY_TOPIC = _formatWithPKDN(BROKER_TOPICS.SUBDEVICE_REGISTER_REPLY_TOPIC)
  }

  configchecking() {
    if (typeof this.productKey === 'undefined') {
      throw new Error('productKey should not be empty');
    }
    if (typeof this.deviceName === 'undefined') {
      throw new Error('deviceName should not be empty');
    }
    if (typeof this.deviceSecret === 'undefined') {
      throw new Error('deviceSecret should not be empty');
    }
  }
}

module.exports = Model;