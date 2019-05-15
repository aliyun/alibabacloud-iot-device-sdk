const iot = require('../lib');

// init device and geteway for linkplatform
const sub1Info = {
  "ProductKey": "a1ouyopKiEU",
  "DeviceName": "sub1",
  "DeviceSecret": "SpT5OQsX4LZi5CsQIb6OS8hVt8qFRw7o"
}
const sub2Info = {
  "ProductKey": "a1ouyopKiEU",
  "DeviceName": "sub2",
  "DeviceSecret": "9Nh3fE6xZiMrMKSaRiiIpYCf6uPpHkav"
}

const gateway = iot.gateway({
  "ProductKey": "a1NuvAIZXv7",
  "DeviceName": "gateway1",
  "DeviceSecret": "S6X7MBsy5zjP07lwzoq1VNgAT81EYw2n"
});

gateway.on('connect', () => {
  console.log('>>>>>gateway connect succeed');

  //subdevice login
  const sub1 = gateway.login(
    sub1Info,
    (res) => {
      console.log('>>>>>sub1 login', res);
    }
  );
  // subdevice on connected
  sub1.on('connect', () => {
    console.log(">>>>sub1 connected!");
    // set device props
    sub1.postProps({
      state: 1
    })
  });
  

  //subdevice login
  const sub2= gateway.login(
    sub2Info,
    (res) => {
      console.log('>>>>>sub2 login', res);
    }
  );
  // subdevice on connected
  sub2.on('connect', () => {
    console.log(">>>>sub2 connected!");
    // set device props
    sub2.postProps({
      state: 1
    })
  });
});