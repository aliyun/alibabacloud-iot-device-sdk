const mqtt = require('mqtt');
const { register } = require('./utils');

const aliyunIot = {
  device: config => {
    const Device = require('./device');;
    return new Device(config);
  },
  gateway: config => {
    const Gateway = require('./gateway');
    return new Gateway(config);
  },
  register,
  mqtt
};

module.exports = aliyunIot;