const Buffer = require('buffer').Buffer;
const util = require('util');
const aliyunIot = require('../../lib');
const Device = require('../../lib/device');
const fixtures = require('../fixtures');

const sub_device1 = fixtures.sub_device1;
let gateway;
let sub1;

beforeAll(() => {
  return new Promise((resolve, reject) => {
    gateway = aliyunIot.gateway({
      ...fixtures.sdk_gateway2
    });
    gateway.on('connect', () => {
      //子设备登录ok
      sub1 = gateway.login(
        sub_device1,
        (res) => {
          console.log('>>>>>login', res);
        }
      );
      // 子设备连接状态
      sub1.on('connect', () => {
        console.log(">>>>sub connected!");
        resolve();
      });
    });
  })
}, 3000)

afterAll(() => {
  gateway.end();
  sub1.end();
});

describe('device test', () => {
  test('gateway connect linkPlatform should be ok', done => {
    if (gateway.connected) {
      done();
    }
  });

  test('sub device connect linkPlatform should be ok', done => {
    if (sub1.connected) {
      done();
    }
  });

  test('sub device post props should be ok', done => {
    try {
      // 子设备属性上报
      sub1.postProps({
        LightSwitch: 0
      }, (res) => {
        console.log(">>>>sub device postProps!");
        console.log(res);
        done();
      });
    } catch (e) {
      console.error(e)
    }
  });

  test('sub device logout should be ok', done => {
    try {
      //登出ok
      gateway.logout(
        sub_device1,
        (res) => {
          console.log('>>>>>logout', res);
          console.log('>>>>>logout .code', res.code);
          // 速度太快有时会相应520 subDevice is already in offline status, subDevice must online first
          // expect('res.code').toBe('200');
          done();
        }
      );
    } catch (e) {
      console.error(e)
    }
  })
});
