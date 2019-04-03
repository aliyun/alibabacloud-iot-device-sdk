const aliyunIot = require('../../lib');
const fixtures = require('../../test/fixtures');

// const device = aliyunIot.device({clean:false,...fixtures.sdk_device1});

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
  // devicebeok() //测试动态注册
  console.log('>>>>>connect');
  device.publish('/a1YPDpMvd5t/base_sdk_device2/update', "hello");

});


// device.publish('/a1YPDpMvd5t/base_sdk_device1/update', 'hello world!');

// device.subscribe('/a1YPDpMvd5t/base_sdk_device1/get');

// device.on('message', (topic, payload) => {
//   console.log(topic, payload.toString());
// });

// device.subscribe('/a1aq9sQk2JE/sdk_device1/user/get');
// device.on('connect', () => {
//   // devicebeok() //测试动态注册
//   console.log('>>>>>connect');
//   // 上报设备属性
//   device.postProps({
//     LightSwitch: 0
//   }, (res) => {
//     console.log('1postProps');
//   });

//   // 获取远程配置功能ok 
//   device.getConfig((res) => {
//     console.log(`2getConfig:${res.data.toString()}`);
//   });
//   //订阅影子设备返回值
//   device.onShadow((res) => {
//     console.log('3onShadow,%o', res);
//   })
//   // 设备主动获取影子 ok
//   device.getShadow();

// });



// device.postProps({
//   color: {red:1,green:2,blue:3}
// }, (res) => {
//   console.log(res);
// });

// device.on('error', (error) => {
//   console.log("error",error);
// });