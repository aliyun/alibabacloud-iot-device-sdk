
const iot = require('../');

const device = iot.device({
  "ProductKey": "a1ouyopKiEU",
  "DeviceName": "device6",
  "DeviceSecret": "yoyXdmII3xcT9udR1DLQRzMGjkRRtkgc"
});
 
device.on('connect', () => {
  console.log('>>>>>connect');
  device.postEvent("error", {
    power: 10,
  }, (res) => {
    console.log(`postEvent:`,res);
  })
});
