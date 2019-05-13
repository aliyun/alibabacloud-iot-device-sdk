## 支付宝小程序中使用 aliyun-iot-device-sdk

注意: aliyun-iot-device-sdk 1.1.0版本以上才支持

## 支付宝小程序开发环境

详细参考：https://docs.alipay.com/mini/developer/getting-started

## 如何集成

##### lib下载
下载 aliyun-iot-device-sdk代码 [连接地址](https://github.com/aliyun/aliyun-iot-device-sdk)
在dist文件夹中有支持浏览器和微信或支付宝运行环境编译完成的js文件，
  - aliyun-iot-device-sdk.js	源码版
  - aliyun-iot-device-sdk.min.js 压缩版


#### 项目中集成
1：将aliyun-iot-device-sdk.js或aliyun-iot-device-sdk.min.js导入支付宝小程序工程目录 例如 放在工程目录下的dist文件夹，那么js的文件地址为 /dist/aliyun-iot-device-sdk.js

2：在需要使用到sdk地方
````js
// 引入包
var aliyunIot = require('/dist/aliyun-iot-device-sdk.js');
// 定义云端创建的设备三元组信息，并使用协议声明，使用 "protocol": 'alis://'
const sdk_device = {
  "productKey": "<your productKey>",
  "deviceName": "<your deviceName>", 
  "deviceSecret": "<your deviceSecret>",
  "protocol": 'alis://',
} 
// 连接云平台
let device = aliyunIot.device(sdk_device);
// 当连接成功进入回调
device.on('connect', () => {
  console.log('连接成功....');
});
// 当收到云端消息下发
device.on('message', (topic, payload) => {
  console.log('topic:', topic);
  if (payload) {
    console.log('payload', payload);
    console.log('payload.toString()', payload.toString());
  }
});
// 当出现错误时回调
device.on('error', (err) => {
  console.log('error:', err);
});

// 其他更多功能参考api说明，地址：https://github.com/aliyun/aliyun-iot-device-sdk
````


## 特别注意，必读

1：aliyun-iot-device-sdk 1.1.0版本以上才支持, 1.1.0版本计划6月初发布
2: 支付宝模拟器无法成功连接，需要使用真机调试（编辑器右上角调试按钮，生成二维码，支付宝app扫描进入真机模式）
3：配置信任服务器地址
    日常环境可以点击小程序ide右上角详情，勾选 “忽略 httpRequest 域名合法性检查（仅限调试时，且支付宝 10.1.35 版本以上）” 选项
    线上环境必须配置信任地址， 加上productKey为 aaaaaaaabbbbbbbcccccc, cn-shanghai 那配置可信服务器地址为 aaaaaaaabbbbbbbcccccc.iot-as-mqtt.cn-shanghai.aliyuncs.com
4：支付宝小程序的数据都会被处理为Uint8Array格式，这部分需要使用者自行处理