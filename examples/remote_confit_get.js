const aliyunIot = require('../');

// init device and connect linkplatform
const device = aliyunIot.device({
  "PRODUCTKEY": "a1ouyopKiEU",
  "DeviceName": "device1",
  "DeviceSecret": "mi9FfuIN28blO1n4oSytBi2kvcWoJzTj"
});

device.on('connect', () => {
  console.log('>>>>>device connect succeed');
  // get remote Configuration
  device.getConfig((res) => {
    console.log(`remote Configuration is:`,res);
  });
});