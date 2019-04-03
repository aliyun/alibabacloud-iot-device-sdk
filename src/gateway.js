const util = require('util');
// const Device = require('./device');
const Device = require('./device');

const {
  createDebug,
  signUtil
} = require('./utils');
const debug = createDebug('gateway');

class Gateway extends Device {
  constructor(...args) {
    super(...args);
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
    this._publishAlinkMessage({
        params: signUtil(device),
        pubTopic: this.model.LOGIN_TOPIC,
      },
      cb
    );
    return this._careteSubDevice(device);
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

  // 内部方法，创建一个子设备
  _careteSubDevice(device) {
    const subDevice = new Device(device);
    subDevice._type = "subdevice";
    subDevice._parent = this;
    //子设备标识
    subDevice._isSubdevice = true;
    const subArrayKey = `${device.productKey}&${device.deviceName}`
    // 初始化subdevices数组
    if (this._subDevices == undefined) {
      this._subDevices = {};
    }
    //保存子设备
    if (this._getSubDevice(device) == undefined) {
      this._subDevices.subArrayKey = subDevice;
    }
    return subDevice;
  }

  // 找到子设备
  _getSubDevice(device) {
    const subArrayKey = `${device.productKey}&${device.deviceName}`;
    if (this._subDevices == undefined) return;
    return this._subDevices.subArrayKey
  }

}

module.exports = Gateway;
