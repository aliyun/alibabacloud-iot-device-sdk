const Buffer = require('buffer').Buffer;
const iot = require('../../lib');
const Device = require('../../lib/device');
const fixtures = require('../fixtures');

let device;
let gateway;
beforeAll(()=> {
  return new Promise((resolve, reject)=>{
    device = iot.device({
      ...fixtures.sdk_device2
    });
    device.on('connect', () => {
      resolve();
    });
  })
},3000)

afterAll(() => {
  device.end();
  gateway.end();
});

const registerDeviceInfo = {
  productKey:"a15YDgQGhU0",
  productSecret:"AP4HnuqhNqqArIkH",
  deviceName:"device1"
}

describe('device dynamic register test', () => {

  test('direct devices register should be ok', done => {
    // 动态注册ok
    iot.register(registerDeviceInfo,(res)=>{
      console.log("direct devices register should be ok",res)
      if(res.code == '200'){
        done();
      }
    })
  });

  test('direct devices register use wrong info shold be error', done => {
    // 动态注册ok
    iot.register({
      productKey:"xxxxx",
      productSecret:"xxx",
      deviceName:"xxx"
    },(res)=>{
      console.log("direct devices register should be wrong",res)
      if(res.code != '200'){
        done();
      }
    })
  });


  test('gateway subdevice register should be ok', done => {   
    // 测试网关动态注册子设备 ok
    gateway = iot.gateway({...fixtures.sdk_gateway1});
    gateway.on('connect', () => {
      gateway.regiestSubDevice([{
        "deviceName": "device3",
        "productKey": "a15YDgQGhU0"
      }],(res)=>{
        if(res.message == 'success'){
          done();
        }
      });
    });
  });

});



