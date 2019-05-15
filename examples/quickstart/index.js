const iot = require('aliyun-iot-device-sdk');
const deviceConfig = require('./device_id_password.json');

const device = iot.device(deviceConfig);

device.on('connect', () => {
  console.log('Connect successfully!');
  console.log('Post properties every 5 seconds...');
  setInterval(() => {
    const params = {
      Status: 1,
      Data: 'Hello, world!'
    };
    console.log(`Post properties: ${JSON.stringify(params)}`);
    device.postProps(params);
  }, 5000);
  
  device.serve('property/set', (data) => {
    console.log('Received a message: ', JSON.stringify(data));
  });
});

device.on('error', err => {
  console.error(err);
});
