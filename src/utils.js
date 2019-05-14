const crypto = require('crypto');
const os = require('os');
const axios = require('axios');
const qs = require('qs');

function hmacSign(type, secret, content) {
  return crypto
    .createHmac(type, secret)
    .update(content) 
    .digest('hex');
}

function mqttMatch(filter, topic) {
  const filterArray = filter.split('/')
  const length = filterArray.length
  const topicArray = topic.split('/')
  for (var i = 0; i < length; ++i) {
    var left = filterArray[i]
    var right = topicArray[i]
    if (left === '#') return topicArray.length >= length - 1
    if (left !== '+' && left !== right) return false
  }
  return length === topicArray.length
}

function mqttNotMatch(filter, topic){
  return !mqttMatch(filter, topic)
}

function createGuid() {
  let id = 1;
  return function () {
    return String(id++);
  };
}

function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {
    
  }
  return false;
}

function signUtil(deviceConfig, signMethod = 'sha1') {
  const timestamp = Date.now();
  // 忽略三元组大小写
  tripleIgnoreCase(deviceConfig);
  const device = {
    productKey: deviceConfig.productKey,
    deviceName: deviceConfig.deviceName,
    clientId: `${deviceConfig.productKey}&${deviceConfig.deviceName}`,
    timestamp
  };
  device.signMethod = `hmac${signMethod}`;
  const signcontent = `clientId${device.clientId}deviceName${
    device.deviceName
  }productKey${device.productKey}timestamp${timestamp}`;
  device.sign = hmacSign(signMethod, deviceConfig.deviceSecret, signcontent);
  return device;
}

function deviceRegisterSign(productKey, productSecret, deviceName, random, signMethod = 'sha1') {
  // 忽略三元组大小写
  const config = { productKey,productSecret,deviceName};
  tripleIgnoreCase(config);
  // signMethod = `hmac${signMethod}`;
  const signcontent = `deviceName${config.deviceName}productKey${config.productKey}random${random}`;
  // console.log("deviceRegisterSign",signMethod,signcontent)
  const sign = hmacSign("sha1", config.productSecret, signcontent);

  return sign;
}

function createDebug(mod) {
  return (...args) => { 
    const debugMod = process.env.DEBUG;
    if (debugMod && (debugMod === '*' || mod.indexOf(debugMod) > -1)) {
        const _args = [`${mod}:`, ...args];
        console.log(..._args);
    }
  };
}

function getIP() {
  var ifaces = os.networkInterfaces();
  let ip = "";
  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      if (details.family == 'IPv4' && dev === 'en0') {
        ip = details.address;
      }
    });
  }
  return ip;
}

/*
 *  设备动态注册
 *    子设备注册+直连设备使用一型一密动态注册
 */
function register({
  productKey,
  productSecret,
  deviceName,
  random,
  signMethod,
  registerURL
}, cb) {
  const rd = random || Math.random().toString(36).substr(2);
  const sm = signMethod || "hmacsha1";
  const url = registerURL || "https://iot-auth.cn-shanghai.aliyuncs.com/auth/register/device";
  const sign = deviceRegisterSign(productKey, productSecret, deviceName, rd, sm);
  const data = qs.stringify({
    productKey,
    deviceName,
    random: rd,
    sign,
    signMethod: sm
  });
  axios.post(url, data).then(function (res) {
    const data = res.data;
    if (data.code != 200) {
      throw data
    }
    cb(data);
  }).catch(function (error) {
    cb(error);
  })
}
// 三元组不为空
function tripleExpectNotNull(triple) {
  if (typeof triple.productKey === 'undefined') {
    throw new Error('productKey should not be empty');
  }
  if (typeof triple.deviceName === 'undefined') {
    throw new Error('deviceName should not be empty');
  }
  if (typeof triple.deviceSecret === 'undefined') {
    throw new Error('deviceSecret should not be empty');
  }
}

// 三元组忽略大小写 triple ignore case
function tripleIgnoreCase(config){
  Object.keys(config).forEach((originKey) => {
    let key = originKey.toLowerCase();
    switch (key) {
      case "productkey":
        config.productKey = config[originKey];
        break;
      case "devicename":
        config.deviceName = config[originKey];
        break;
      case "devicesecret":
        config.deviceSecret = config[originKey];
        break;
    }
  });
  return config;
}

// 获取当前sdk版本
// 支付宝小程序:JS|Ali
// 微信小程序:JS|WX
// 浏览器：JS|Broswer  
// node环境：NodeJS
// 命令行:JS|CLI
// 未知：JS|UNKNOW
let LANG = 'JS|UNKNOW';

function getSDKLanguage(){
  // 支付宝小程序运行环境 不完全可靠
  if(typeof my !== 'undefined' && (my.navigateToMiniProgram || my.navigateBackMiniProgram)){
    return "JS|Ali";
  }
  // 微信小程序判断 不完全可靠
  if(typeof wx !== 'undefined' && (wx.navigateToMiniProgram || wx.navigateBackMiniProgram)){
    return "JS|WX";
  }
  // 浏览器环境判断
  if(
      (typeof window !== 'undefined' && typeof window.document !== 'undefined') || 
      (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    )
  {
    return "JS|Broswer ";
  }
  // node环境
  if(typeof module !== 'undefined' && module.exports){
    return "NodeJS";
  }

  // 返回主动设置的环境值
  return LANG;

}
function setSDKLanguage(lang){
  LANG = lang;
}


exports.tripleIgnoreCase = tripleIgnoreCase;
exports.tripleExpectNotNull = tripleExpectNotNull;
exports.getIP = getIP;
exports.hmacSign = hmacSign;
exports.mqttMatch = mqttMatch;
exports.mqttNotMatch = mqttNotMatch;
exports.createGuid = createGuid;
exports.signUtil = signUtil;
exports.createDebug = createDebug;
exports.register = register;
exports.isJsonString = isJsonString;
exports.getSDKLanguage = getSDKLanguage;
exports.setSDKLanguage = setSDKLanguage;
