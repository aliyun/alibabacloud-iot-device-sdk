const Buffer = require('buffer').Buffer;
const util = require('util');
const aliyunIot = require('../../lib');
const fixtures = require('../fixtures');

// const device = aliyunIot.device({...fixtures.sdk_device1});

const device = aliyunIot.device({
  "ProductKey": "a1ouyopKiEU",
  // "ProductKey": "a1ouyopKiEU123",
  "DeviceName": "sub1",
  "DeviceSecret": "SpT5OQsX4LZi5CsQIb6OS8hVt8qFRw7o"
})

// const device = aliyunIot.device({
//   productKey: 'a1BOOa9HG6Z',
//   deviceName: 'sdk_network1',
//   deviceSecret: 'SgNxAqaav9URfVuHpnxmq9vDFZbwmZ7H'
// });

// base_sdk_device2
// const device = aliyunIot.device({ ...fixtures.base_sdk_device2})

// const deviceConfig = {
//     "productKey": "a1FVHNuAmvq",
//     "deviceName": "testdevice1",
//     "deviceSecret": "QNNcinhgbY5VgpnQT0DtIUXAlV4jYthO",
//     "region":"cn-shanghai"
//   }
// const device = aliyunIot.device(deviceConfig);

// device.subscribe(`${device.productKey}/${device.deviceName}/user/get`);
// device.on('message', (topic, payload) => {
//     console.log(topic, payload);
//     console.log("^:message",topic);
//     device.end();
// });

// 测试上报一条设备标签数据
device.on('connect', () => {
  // devicebeok() //测试动态注册
  console.log('>>>>>connect');
  // 上报设备属性
  device.postProps({
    state: 0
  }, (res) => {
    console.log('1postProps');
  });

  // 获取远程配置功能ok 
  device.getConfig((res) => {
    console.log(`2getConfig:${res.data.toString()}`);
  });
  //订阅影子设备返回值
  device.onShadow((res) => {
    console.log('3onShadow,%o', res);
  })
  // 设备主动获取影子 ok
  device.getShadow();

});



// device.on('message', (topic,message) => {
//   console.log('topic:',topic);
//   console.log('message:',message.toString());
// });

// 测试直连设备动态注册功能 ok
function testDirectRegiest(){
  const registerDeviceInfo = {
    productKey:"a15YDgQGhU0",
    productSecret:"AP4HnuqhNqqArIkH",
    deviceName:"device1"
  }
  // 动态注册ok
  aliyunIot.register(registerDeviceInfo,(error,res)=>{
    if(error){console.log("register faild",error);return}
    console.log("register succeed,data:",res);
  })
}


// 测试直连设备动态注册功能 ok
function testSubDeivceRegiest(){
  const registerDeviceInfo = {
    productKey:"a15YDgQGhU0",
    productSecret:"AP4HnuqhNqqArIkH",
    deviceName:"device1"
  }
  // 动态注册ok
  aliyunIot.register(registerDeviceInfo,(error,res)=>{
    if(error){console.log("register faild",error);return}
    console.log("register succeed,data:",res);
  })
}


// 测试ok的
function devicebeok() {
  //连接ok
  console.log('>>>>>connect');
  
  // 上报设备属性
  device.postProps({
    LightSwitch: 0
  }, (res) => {
    console.log(res);
  });
  //订阅可以收到服务调用下发
  device.onService('wakeup_async', function (res) {
    // 处理服务参数
    console.log('1^:device.serve res',res);
  });
  //重复订阅不会多次执行回调函数
  device.onService('wakeup_async', function (res) {
    // 处理服务参数
    console.log('1^:device.serve');
  });

  // 异步方式回复
  device.onService('wakeup_async', function (res,reply) {
    // 处理服务参数
    console.log('^onService',res);

    reply({
      "code": 200,
      "data": {out:1}
    });
  })

  // 同步方式回复
  device.onService('wakeup_sync', function (res,reply) {
    // 处理服务参数
    console.log('^onService',res);
    reply({
      "code": 200,
      "data": {out:1}
    },'sync');
  })

  // postevent 事件上班 ok
  device.postEvent("lowpower", {
    power: 10,
  }, (res) => {
    console.log(`1postEvent:${res}`);
  })
  //回调函数不重复
  device.postEvent("lowpower", {
    power: 20,
  }, (res) => {
    console.log(`2postEvent:${res}`);
  })

  //删除标签ok
  device.deleteTags(['a'], (res) => {
    console.log(`tagid:${res.id}^ delete succeed`);
  });
  //删除多个标签回调函数不冲突
  device.deleteTags(['b'], (res) => {
    console.log(`tagid:${res.id}^ delete succeed`);
  });
  // 添加标签ok
  device.postTags(
    [{
        "attrKey": "Temperature",
        "attrValue": "311"
      },
      {
        "attrKey": "a",
        "attrValue": "avalue"
      },
      {
        "attrKey": "b",
        "attrValue": "bvalue"
      }
    ],
    (res) => {
      console.log(res);
    }
  );
  
  // 获取远程配置功能ok 
  device.getConfig((res) => {
    console.log(`getConfig:${res.data.toString()}`);
  });
  // 订阅远程配置
  device.onConfig((res) => {
    console.log("onConfig,res:",res);
  });

  // 获取远程接收云端下发 todo
  device.onConfig((res) => {
    console.log(`onConfig:${res.data.toString()}`);
  });


  //订阅影子设备返回值
  device.onShadow((res) => {
    console.log('获取最新设备影子,%o', res);
  })
  // 设备主动获取影子 ok
  device.getShadow();
  // 设备上报实际值
  device.postShadow({
    a: "avalue11"
  });

  // 删除影子属性 ok
  // 参数 属性key，若为空则删除全部
  device.deleteShadow("a");
  device.deleteShadow(["a","b"]);
  device.deleteShadow()
  
}
