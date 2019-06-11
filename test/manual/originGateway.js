// origin usage
const iot = require('../../');
const fixtures = require('../fixtures');

const gateway = iot.gateway(fixtures.sdk_gateway2);

gateway.subscribe('/a1BOOa9HG6Z/sdk_gateway2/user/get');

gateway.on('message', (topic, payload) => {
  console.log('topic:',topic);
  if(payload){
    console.log('payload',payload.toString());
  }
});

gateway.on('connect', () => {
  console.log('>>>>>connect');
  // setInterval(()=>{
  //   device.publish('/a1YPDpMvd5t/base_sdk_device2/update', "hello");
  // },2000)
});
