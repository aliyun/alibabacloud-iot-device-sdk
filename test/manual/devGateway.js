const Buffer = require('buffer').Buffer;
const util = require('util');
const iot = require('../../lib');
const fixtures = require('../../test/fixtures');

const sub_device1 = fixtures.sub_device1;
const sub_device2 = fixtures.sub_device2;


// sdk_gateway1
const gateway = iot.gateway({
  ...fixtures.sdk_gateway1
});
// 测试上报一条设备标签数据
gateway.on('connect', () => {

});

// 测试ok的
function getewaybeok() {

  //网关获子设备 ok, iot.gateway#getTopo()
  gateway.getTopo(
    (res) => {
      console.log('>>>>>getTopo')
      console.log(res.message)
      console.log(res.data)
    }
  );
  // 添加topo ok  iot.gateway#addTopo()
  gateway.addTopo(
    [sub_device1, sub_device2],
    (res) => {
      console.log('>>>>>getTopo', res.message, res.data);
    }
  );
  gateway.addTopo(
    [sub_device1, sub_device2],
    (res) => {
      console.log('>>>>>getTopo', res.message, res.data);
    }
  );
  //删除设备ok
  gateway.removeTopo(
    [sub_device1, sub_device2],
    (res) => {
      console.log('>>>>>getTopo')
      console.log(res.message)
      console.log(res.data)
    }
  );

  //子设备登录ok
  gateway.login(
    sub_device1,
    (res) => {
      console.log('>>>>>login', res);
    }
  );

  // 子设备连接状态
  sub.on('connect', () => {
    console.log(">>>>sub connected!");
    // doSomething
  });

  //登录后登出ok
  const sub = gateway.login(
    sub_device1,
    (res) => {
      console.log('>>>>>login', res);
    }
  );

  // logout beok
  setTimeout(() => {
    gateway.logout(
      sub_device1,
      (res) => {
        console.log('>>>>>logout', res);
      }
    );
  }, 5000);

  // 子设备属性上报
  sub.postProps({
    LightSwitch: 0
  }, (res) => {
    console.log(">>>>sub postProps!");
    console.log(res);
  });

  // 测试网关动态注册子设备 ok
  gateway.on('connect', () => {
    gateway.regiestSubDevice([{
      "deviceName": "device3",
      "productKey": "a15YDgQGhU0"
    }], (res) => {
      console.log("regiestSubDevice res:", res);
    });
  });

}
