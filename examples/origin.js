// origin usage
const aliyunIot = require('../');

// init device and connect linkplatform
const device = aliyunIot.device({
  "ProductKey": "a1YPDpMvd5t",
  "DeviceName": "base_sdk_device2",
  "DeviceSecret": "WnuQaINuj8oJva7R2vJGwds5w9PqF9VT"
});


device.subscribe('/a1YPDpMvd5t/base_sdk_device2/get');

device.on('message', (topic, payload) => {
  console.log('topic:',topic);
  if(payload){
    console.log('payload',payload.toString());
  }
});

device.on('connect', () => {
  console.log('>>>>>connect');
  setInterval(()=>{
    device.publish('/a1YPDpMvd5t/base_sdk_device2/update', "hello");
  },2000)
});
