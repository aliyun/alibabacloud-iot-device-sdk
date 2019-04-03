const aliyunIot = require('../');

// init device and connect linkplatform
const device = aliyunIot.device({
  "PRODUCTKEY": "a1ouyopKiEU",
  "DeviceName": "device1",
  "DeviceSecret": "mi9FfuIN28blO1n4oSytBi2kvcWoJzTj"
});

device.on('connect', () => {
  console.log('>>>>>device connect succeed');
  // post device tag
  const tagsInfo = [
    {"attrKey": "Temperature","attrValue": "36.8"},
    {"attrKey": "Room","attrValue": "avalu301e"}];
  device.postTags(
    tagsInfo,
    (res) => {
      console.log("post tags result:",res);
    });
  // delete tag after ten seconds
  setTimeout(()=>{
    device.deleteTags(['Temperature','Room'], (res) => {
      console.log(`tag delete succeed`);
    });
  },10000)
});