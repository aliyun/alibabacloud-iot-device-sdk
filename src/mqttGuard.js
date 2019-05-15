
class mqttGuard {

  constructor() {
    this.mqttClientList = []
  }

  check(deviceSecret) {
    const mqtt = this._findMqttClient(deviceSecret);
    if(mqtt && mqtt.end){
      mqtt.end();
    }
  }

  push(deviceSecret,mqttClient){
    const mqtt = this._findMqttClient(deviceSecret);
    if(!mqtt){
      mqttClient.deviceSecret = deviceSecret;
      this.mqttClientList.push(mqttClient);
    }
  }
  _findMqttClient(deviceSecret) {
    for (let i = 0; i < this.mqttClientList.length; i++) {
      const item = this.mqttClientList[i] || "";
      if (item && item.deviceSecret && item.deviceSecret == deviceSecret) {
        return item
      }
    }
    return undefined;
  }
}

// 全局对象
const guard = new mqttGuard();
module.exports = guard;
