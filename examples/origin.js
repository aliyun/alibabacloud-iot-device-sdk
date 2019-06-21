// origin usage
const iot = require('../');

// init device and connect linkplatform
const device = iot.device({
  "ProductKey": "a1YPDpMvd5t",
  "DeviceName": "base_sdk_device4",
  "DeviceSecret": "2Df8xOQC1yfBeAZhRkYHJV4YuuXF4H08"
});




device.on('message', (topic, payload) => {
  console.log('topic:',topic);
  if(payload){
    console.log('payload',payload.toString());
  }
});

device.on('connect', () => {
  console.log('>>>>>connect');
  device.subscribe('/a1YPDpMvd5t/base_sdk_device2/get');
  setInterval(()=>{
    device.publish('/a1YPDpMvd5t/base_sdk_device2/update', "hello");
  },2000)
});
