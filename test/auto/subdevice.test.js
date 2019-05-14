const Buffer = require('buffer').Buffer;
const aliyunIot = require('../../lib');
const fixtures = require('../fixtures');

const sub_device3 = fixtures.sub_device3;
let gateway;
let sub1;
let postPropsSucceedStat = false;

beforeAll(() => {
  return new Promise((resolve, reject) => {
    gateway = aliyunIot.gateway({
      ...fixtures.sdk_gateway2
    });
    gateway.on('message', function(topic, payload){
      console.log(">>>>gateway message:",topic.toString(),payload.toString());
    });
    gateway.on('connect', () => {
      //子设备登录ok
      sub1 = gateway.login(
        sub_device3,
        (res) => {
          console.log('>>>>>login', res);
        }
      );
      // 子设备连接状态
      sub1.on('connect', () => {
        console.log(">>>>sub connected!");
        sub1.postProps({
          stat:0
        }, (res) => {
          console.log(">>>>sub device postProps!");
          console.log(res);
          postPropsSucceedStat = true;
        });
        resolve();
      });
      sub1.on('message', function(topic, payload){
        console.log(">>>>sub1 message:",topic.toString(),payload.toString());
      });
    });
  })
}, 5000)

afterAll(() => {
  setTimeout(()=>{
    gateway.end();
    sub1.end();
  },5000);
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
    
    setTimeout(()=>{
      console.log("postPropsSucceedStat",postPropsSucceedStat);
      if(postPropsSucceedStat){
        done();
      }
    },3000)
    
  });

  // test('sub device logout should be ok', done => {
  //   try {
  //     //登出ok
  //     gateway.logout(
  //       sub_device1,
  //       (res) => {
  //         console.log('>>>>>logout', res);
  //         console.log('>>>>>logout .code', res.code);
  //         // 速度太快有时会相应520 subDevice is already in offline status, subDevice must online first
  //         // expect('res.code').toBe('200');
  //         done();
  //       }
  //     );
  //   } catch (e) {
  //     console.error(e)
  //   }
  // })
});
