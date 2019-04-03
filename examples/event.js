
const aliyunIot = require('../');



const device = aliyunIot.device({
  "ProductKey": "a1ouyopKiEU",
  "DeviceName": "device6",
  "DeviceSecret": "yoyXdmII3xcT9udR1DLQRzMGjkRRtkgc"
});
 
// 测试上报一条设备标签数据
device.on('connect', () => {
  // devicebeok() //测试动态注册
  console.log('>>>>>connect');
  // 上报设备属性
  device.postEvent("error", {
    power: 10,
  }, (res) => {
    console.log(`postEvent:`,res);
  })
});
