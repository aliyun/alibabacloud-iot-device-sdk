const aliyunIot = require('../');

// init device and connect linkplatform
const device = aliyunIot.device({
  "productKey": "a1ouyopKiEU",
  "deviceName": "device1",
  "deviceSecret": "mi9FfuIN28blO1n4oSytBi2kvcWoJzTj"
});

device.on('connect', () => {
  console.log('>>>>>device connect succeed');
  device.getShadow();
  device.postShadow({
    a: "avalue11"
  });
  setTimeout(()=>{
    device.deleteShadow("a");
  },5000)
});
//subscribe platform response 
device.onShadow((res) => {
  console.log('获取最新设备影子,%o', res);
})
