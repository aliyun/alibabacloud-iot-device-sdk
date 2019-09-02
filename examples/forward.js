/**
 * 
 * 操作步骤： 
 * 1:首先进入产品详情，在对应设备上创建2个自定义topic
 *    1.1: 一个是用户转发的topic， 如 /a1aq9sQk2JE/${deviceName}/user/forward
 *    1.2: 另一个用户接受数据上传，通过规则引擎扭转到forward的topic，示例：/a1aq9sQk2JE/sdk_device3/user/userpost
 * 2:进入设备详情的topic，查看设备topic，如： /a1aq9sQk2JE/sdk_device3/user/forward
 * 3:使用规则引擎，创建一个新的规则引擎，将用户topic转发到这个自定义topic中
 *    处理数据的sql:SELECT * FROM "/a1aq9sQk2JE/sdk_device3/user/userpost"
 *    转发数据-数据目的地:该方法将数据发到另一个Topic中：/a1aq9sQk2JE/sdk_device3/user/forward
 * 结果：执行下面代码段，通过订阅forward的topic，就可以接收到发送到userpost topic的消息
 */


 // origin usage
const iot = require('../');

// init device and connect linkplatform
const device = iot.device({
  productKey: 'a1aq9sQk2JE',
  deviceName: 'sdk_device3',
  deviceSecret: 'ZXdtUJ1nlGxy1v2ZHjq5cTTt3RTVicoX',
});


device.on('message', (topic, payload) => {
  console.log('topic:',topic);
  if(payload){
    console.log('payload',payload.toString());
  }
});

device.on('connect', () => {
  console.log('>>>>>connect');
  device.subscribe('/a1aq9sQk2JE/sdk_device3/user/forward');
  setInterval(()=>{
    let jsonString = JSON.stringify({ "a":"hello"});
    device.publish('/a1aq9sQk2JE/sdk_device3/user/userpost',jsonString );
  },2000)
});
