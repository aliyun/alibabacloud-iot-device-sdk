const aliyunIot = require('../lib');

const registerDeviceInfo = {
  productKey:"a15YDgQGhU0",
  productSecret:"AP4HnuqhNqqArIkH",
  deviceName:"device1"
}

aliyunIot.register(registerDeviceInfo,(error,res)=>{
  if(error){console.log("register faild",error);return}
  console.log("register succeed,data:",res);
})

