const Thing = require('./thing');

class Device extends Thing {
  constructor(config = {}) {
    super(config);
    // create mqttclient
    this._createClient(this.model);
    // subcribe client event and preset topic
    this._subscribeClientEvent();
  }
}
module.exports = Device; 