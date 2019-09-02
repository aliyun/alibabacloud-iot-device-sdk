// origin usage
const iot = require('../lib');

// init device and connect linkplatform
// ipv6链接 ipv6 server，需要链接的全链路都支持ipv6服务，才能成功连接
// 测试链接成功环境：alibaba-inc-ipv6test
const device = iot.device({
  "ProductKey": "a1ouyopKiEU",
  "DeviceName": "device6",
  "DeviceSecret": "yoyXdmII3xcT9udR1DLQRzMGjkRRtkgc",
  "brokerUrl":"mqtt://ipv6.itls.cn-shanghai.aliyuncs.com:1883"
});

device.on('message', (topic, payload) => {
  console.log('topic:',topic);
  if(payload){
    console.log('payload',payload.toString());
  }
});


device.on('connect', () => {
  console.log('>>>>>connect');
});

// 当出现错误时回调
device.on('error', (err) => {
  console.log('error:', err);
});