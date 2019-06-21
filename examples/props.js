const iot = require('../lib');

let count = 0;
const device = iot.device({
  "ProductKey": "a1ouyopKiEU",
  "DeviceName": "device6",
  "DeviceSecret": "yoyXdmII3xcT9udR1DLQRzMGjkRRtkgc"
});

device.on('connect', () => {
  console.log('>>>>>connect');
  // setInterval(() => {
  //   device.postProps({
  //     state: count++%2
  //   }, (res) => {
  //     console.log(`postProps:`,res);
  //   });
  // }, 10000);
  device.postProps({
    state: count++%2
  }, (res) => {
    console.log(`postProps:>>>>>>>>>>`,res);
  });
});

device.onProps((res)=>{
  console.log('>>>onProps',res);
})