const iot = require('../../');
const fixtures = require('../fixtures');


const gateway = iot.gateway(fixtures.sdk_gateway2);
// const dsad = iot.device(fixtures.sub_device3);
let sub1; 
gateway.on('message', function(topic, payload){
  console.log("message>>>" , topic.toString(),payload.toString());
});

gateway.on('error', (err)=>{
  console.log('gateway error:',err);
});

// setInterval(() => {
//   console.log("login")
//   gateway.login(
//     fixtures.sub_device5,
//     (res) => {
//     console.log('>>>>> sub1 login ...');
//   });
// }, 5000);

gateway.on('connect', () => {
  //子设备1上线
  sub1 = gateway.login(
    fixtures.sub_device5,
    (res) => {
    console.log('>>>>> sub1 login ...');
  });
 

  sub1.on('error', (resp) => {
    console.log(">>>>sub1 error!!!",resp);
  });
  
  sub1.on('connect', () => {
    console.log(">>>>sub1 connected!");


    // sub1.postProps({
    //   state: 0
    // },(res)=>{
    //   console.log(">>>>sub1 postProps!",res);
    // });
    // sub1.postProps({
    //   state: 0
    // },(res)=>{
    //   console.log(">>>>sub1 postProps!",res);
    // });
    // sub1.postEvent("lowpower", {
    //   power: 10,
    // }, (res) => {
    //   console.log('1postEvent:',res);
    // })

    // 添加标签ok
    // sub1.postTags(
    //   [{
    //       "attrKey": "Temperature",
    //       "attrValue": "311"
    //     },
    //     {
    //       "attrKey": "a",
    //       "attrValue": "avalue"
    //     },
    //     {
    //       "attrKey": "b",
    //       "attrValue": "bvalue"
    //     }
    //   ],
    //   (res) => {
    //     console.log(res);
    //   }
    // );

    // sub1.getConfig((res) => {
    //   console.log('>>>> getConfig:',res.data);
    // });
    // // 订阅远程配置 todo:be some problem
    // sub1.onConfig((res) => {
    //   console.log("onConfig,res:",res);
    // });
    
    // //订阅影子设备返回值
    // sub1.onShadow((res) => {
    //   console.log('获取最新设备影子,%o', res);
    // })
    // // 设备主动获取影子 ok
    // sub1.getShadow();
  });


  //订阅可以收到服务调用下发
  // sub1.onService('wakeup_async', function (res,reply) {
  //   // 处理服务参数
  //   console.log('1^:sub1 wakeup_async',res);
  //   reply({
  //     "code": 200,
  //     "data": {out:0}
  //   });
  // });

  // sub1.onService('wakeup_sync', function (res,reply) {
  //   // 处理服务参数
  //   console.log('1^:sub1 wakeup_sync',res);
  //   reply({
  //     "code": 200,
  //     "data": {out:1}
  //   },'sync');
  // });

 

  //删除标签ok
  // sub1.deleteTags(['a'], (res) => {
  //   console.log(`tagid:${res.id}^ delete succeed`);
  // });
  // //删除多个标签回调函数不冲突
  // sub1.deleteTags(['b'], (res) => {
  //   console.log(`tagid:${res.id}^ delete succeed`);
  // });
  // 添加标签ok
  // sub1.postTags(
  //   [{
  //       "attrKey": "Temperature",
  //       "attrValue": "311"
  //     },
  //     {
  //       "attrKey": "a",
  //       "attrValue": "avalue"
  //     },
  //     {
  //       "attrKey": "b",
  //       "attrValue": "bvalue"
  //     }
  //   ],
  //   (res) => {
  //     console.log(res);
  //   }
  // );

  //子设备2上线
  // const sub2 = gateway.login(
  //   fixtures.sub_device2,
  //   (res) => {
  //   console.log('>>>>> sub2 login ...');
  // });

  // sub2.on('error', (resp) => {
  //   console.log(">>>>sub2 error!!!",resp);
  // });
  
  // sub2.on('connect', () => {
  //   console.log(">>>>sub2 connected!");
    
  // });



    // setTimeout(() => {
    //    gateway.logout(
    //    {"productKey": "a1FTDuODs4g","deviceName": "subdevice1"},
    //    (res) => {
    //     //sub1.end();
    //      console.log('>>>>>sub logout', res);
    //      sub1.postProps({
    //   LightSwitch: 0
    // },(res)=>{
    //   console.log(">>>>sub1 postProps!");
    //   console.log(res);
    // });
    //    });
    // }, 10000);

    
  //子设备连接状态
  // sub1.on('connect', () => {
  //   console.log(">>>>sub1 connected!");
  //   sub1.postProps({
  //     LightSwitch: 0
  //   },(res)=>{
  //     console.log(">>>>sub1 postProps!");
  //     console.log(res);
  //   });
  // });

  // sub1.on('message', function(topic, payload){
  //   console.log('SUB1 message:',topic.toString(),payload.toString());
  // });
  
  // sub1.on('error', (err)=>{
  //   console.log('SUB error:',err);
  // });

    //设置延迟使主网关离线
  //   setTimeout(() => {
  //     gateway.end();
  //     console.log('gateway END!');
  //  }, 5000);    

  //  子设备能否正常登出
  // setTimeout(() => {
  //   gateway.logout(
  //     fixtures.sub_device2,
  //     (res) => {
  //       console.log('>>>>>sub2 logout', res);
  //     }); 
  //   // gateway.logout(sub1);
  // }, 5000);
});

// // 退出登录
setTimeout(() => {
  // sub1._unsubscribePresetTopic();
  // gateway._unsubscribePresetTopic();
  gateway.logout(fixtures.sub_device5)
}, 5000);