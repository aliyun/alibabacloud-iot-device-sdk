const Buffer = require('buffer').Buffer;
const aliyunIot = require('../../lib');
const fixtures = require('../fixtures');

let device;
beforeAll(()=> {
  return new Promise((resolve, reject)=>{
    device = aliyunIot.device({
      ...fixtures.sdk_device1
    });
    device.on('connect', () => {
      resolve();
    });
  })
},3000)

afterAll(() => {
  device.end();
});

describe('device test', () => {
  test('device connect linkPlatform should be ok', done => {
    if(device.connected){
      done();
    }
  });

  test('productKey should not be empty', done => {
    try {
      const device = aliyunIot.device();
    } catch (e) {
      done();
    }
  });

  test('deviceName should not be empty', done => {
    try {
      const device = aliyunIot.device({
        productKey: '1'
      });
    } catch (e) {
      done();
    }
  });

  test('deviceSecret should not be empty', done => {
    try {
      const device = aliyunIot.device({
        productKey: '1',
        deviceName: '2'
      });
    } catch (e) {
      done();
    }
  });

  test('postProps should not be ok', done => {
    try {
      // 上报设备属性
      device.postProps({
        LightSwitch: 0
      }, (res) => {
        done();
      });
    } catch (e) {}
  });

  test('postEvent should not be ok', done => {
    try {
      // 上报设备事件ok
      device.postEvent("lowpower", {
        power: 20,
      }, (res) => {
        console.log(`postEvent:${res}`);
        done();
      })
    } catch (e) {}
  });

});

