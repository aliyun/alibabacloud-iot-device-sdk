const iot = require('../');

// init device and connect linkplatform
const device = iot.device({
  "PRODUCTKEY": "a1ouyopKiEU",
  "DeviceName": "device1",
  "DeviceSecret": "mi9FfuIN28blO1n4oSytBi2kvcWoJzTj"
});

device.on('connect', () => {
  console.log('>>>>>device connect succeed');
});
// subscribe wakeup_async service
device.onService('add_sync', function (res,reply) {
  console.log('add_sync called,res:',res);
  const { params:{x,y}={}} = res;
  const result = addFunc(x,y);
  console.log('result',result);
  reply(result,'sync');
});

function addFunc(x,y){
  let err;
  if(x==undefined || y==undefined){
    err = 'x or y invail value';
    return {err,code:10001}
  }

  return {
    data:{
      z:x+y
    },
    code:200
  }
}