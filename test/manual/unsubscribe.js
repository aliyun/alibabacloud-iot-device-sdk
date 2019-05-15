const iot =  require('../../lib');

const device = iot.device({
    "productKey": "a1M2kvfkVYF",
    "deviceName": "network1",
    "deviceSecret": "3gA9Lwkn7v8r8gxTd1uhHVb131J4LuIG",
    keepalive: 60,
    clean: false
  });

  device.publish('/a1MquU83rKN/gateway/usr/update', 'Hello');

  
  device.on('connect', () => {
    console.log('connected successfully!');
    // device.subscribe('/a1M2kvfkVYF/network1/user/get');
    device.unsubscribe('/a1M2kvfkVYF/network1/user/get');
  });
  
  device.on('message', function(topic, payload){
    console.log(topic.toString(),payload.toString());
  });