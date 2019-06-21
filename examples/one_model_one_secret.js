const iot = require('../lib');

const registerDeviceInfo = {
  productKey:"a15YDgQGhU0",
  productSecret:"AP4HnuqhNqqArIkH",
  deviceName:"device1"
}

iot.register(registerDeviceInfo,(res)=>{
  if(res.code != 200){
    console.log("register faild",res);
    return;
  }
  console.log("register succeed");
  console.log("res is:",res);
})

