const Thing = require('./thing');

class SubDevice extends Thing {
  constructor(config = {},gateway) {
    super(config);
    this.gateway = gateway;
    this._mqttClient = gateway._mqttClient;
  }
}
module.exports = SubDevice;