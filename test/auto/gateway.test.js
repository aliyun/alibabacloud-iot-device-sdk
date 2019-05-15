const Buffer = require('buffer').Buffer;
const iot = require('../../lib');
const fixtures = require('../fixtures');

let gateway;
const sub_device1 = fixtures.sub_device1;
const sub_device2 = fixtures.sub_device2;

beforeAll(()=> {
  return new Promise((resolve, reject)=>{
    gateway = iot.gateway({...fixtures.sdk_gateway1});
    gateway.on('connect', () => {
      resolve();
    });
  })
},3000)

afterAll(() => {
  gateway.end();
});

describe('device test', () => {
  test('gateway connect linkPlatform should be ok', done => {
    if(gateway.connected){
      done();
    }
  });

  test('get topo should not be ok', done => {
    try {
        //网关获子设备 ok, iot.gateway#getTopo()
        gateway.getTopo(
          (res)=>{
            console.log('>>>>>getTopo',res)
            done();
          }
      );
    } catch (e) { console.error(e)}
  });

  test('add topo should not be ok', done => {
    try {
      // 添加topo ok 
      gateway.addTopo(
        [sub_device1,sub_device2],
        (res)=>{
          console.log('>>>>>addTopo',res.message,res.data);
          done();
        }
      );
    } catch (e) { console.error(e)}
  });

  test('delete topo should not be ok', done => {
    try {
      // 删除设备ok
      gateway.removeTopo( 
        [sub_device2],
        (res)=>{
            console.log('>>>>>removeTopo')
            console.log(res)
            done();
        }
    );
    } catch (e) { console.error(e)}
  });

  

});

