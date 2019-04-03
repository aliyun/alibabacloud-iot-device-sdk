const aliyunIot = require('../');

// init device and connect linkplatform
const device = aliyunIot.device({
  "productKey": "a1ouyopKiEU",
  "deviceName": "device1",
  "deviceSecret": "mi9FfuIN28blO1n4oSytBi2kvcWoJzTj"
});

device.on('connect', () => {
  console.log('>>>>>device connect succeed');
  // 设备主动获取影子
  device.getShadow();
  // 设备上报实际值
  device.postShadow({
    a: "avalue11"
  });
  setTimeout(()=>{
    device.deleteShadow("a");
  },5000)
});

//订阅影子设备返回值
device.onShadow((res) => {
  console.log('获取最新设备影子,%o', res);
})
