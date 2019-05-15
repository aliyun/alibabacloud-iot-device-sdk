const Buffer = require('buffer').Buffer;
const util = require('util');
const iot = require('../../lib');
const Device = require('../../lib/device');
const fixtures = require('../fixtures');

let device;
beforeAll(()=> {
  return new Promise((resolve, reject)=>{
    device = iot.device({
      ...fixtures.sdk_device3
    });
    device.on('connect', () => {
      resolve();
    });
  })
},3000)

afterAll(() => {
  device.end();
});

describe('device tags ability test', () => {
  let tags = [
    {"attrKey": "Temperature", "attrValue": "311"},
    {"attrKey": "a","attrValue": "avalue"},
    {"attrKey": "b","attrValue": "bvalue"},
    {"attrKey": "c","attrValue": "bvalue"}
  ];

  test('add tags should be ok', done => {
    try {
      device.postTags(
        tags,
        (res) => {
          console.log(`add tag ok res:${res.id}`);
          done()
        }
      );
    } 
    catch (e) {console.error(e);}
  });
  
  test('delete tags should be ok', done => {
    try {
      device.deleteTags(
        ['a'],
        (res) => {
          console.log(`tagid:${res.id}^ delete succeed`);
          done()
        }
      );
    }
    catch (e) {console.error(e);}
  });

});

// 远程配置功能
// remote configuration
describe('device remote configuration ability test', () => {
  test('get remote configuration should be ok', done => {
    try {
      // 获取远程配置功能
      device.getConfig((res) => {
        console.log("getConfig:%o,",res.data);
        done()
      });
    } 
    catch (e) {console.error(e);}
  });
});


// 远程配置功能
// remote configuration
describe('device shadow ability test', () => {
  const random = Math.random().toString(36).substr(2);
  test('shadow get should be ok', done => {
    try {
      device.onShadow((res) => {
        // { method: 'reply',
        //   payload:{ status: 'success',
        //   state: { reported: { a: 'avalue11' } },}
        console.log('@@getShadow:,%o', res);
        done()
      })
      device.getShadow();
    } 
    catch (e) {console.error(e);}
  });
  test('shadow post should be ok', done => {
    try {
      device.onShadow((res) => {
        console.log('@@postShadow,%o', res);
        done()
      })
      device.postShadow({
        a: "random"
      });
    } 
    catch (e) {console.error(e);}
  });
  test('shadow delete should be ok', done => {
    try {
      device.onShadow((res) => {
        console.log('@@deleteShadow,%o', res);
        done()
      })
      device.deleteShadow("a");
    } 
    catch (e) {console.error(e);}
  });
},5000);