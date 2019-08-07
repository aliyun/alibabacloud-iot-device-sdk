# alibabacloud IoT Device SDK for Javascript
> 阿里云IoT官方版本

alibabacloud IoT Device SDK提供设备接入阿里云IoT物联网平台(LinkPlatform)的JavaScript版本的sdk，可以运行在node,broswer，微信小程序，支付宝小程序环境，封装LinkPlatform物联网平台的设备端能力，如设备连接云平台，数据pub，sub的上下行通讯。还有许多高级功能，如影子设备，远程配置，基于设备物模型（属性、服务、事件）的开发模式，网关和子设备的能力等，基于SDK的设备端开发或设备应用开发，可以极大简化开发门槛。

如果有使用问题可以反馈到xuanyan.lyw@alibaba-inc.com，关于IoT物联网平台更多功能和功能详细说明，参考官网文档 [https://help.aliyun.com/product/30520.html](https://help.aliyun.com/product/30520.html)


## 优点

- 阿里云物联网平台js版本官方sdk
- 支持node、broswer、微信小程序、支付宝小程序环境运行
- 体积小，压缩版本仅有418k

## 安装

> 安装 Node.js 运行环境，版本 `>=4.0.0` 。

通过 npm 包管理工具安装：

```bash
npm install alibabacloud-iot-device-sdk --save
```

当前稳定版本 1.2.4
当前最新版本 1.2.5

## 快速开始

```javascript
// node引入包名
const iot = require('alibabacloud-iot-device-sdk');
// 浏览器、微信小程序，支付宝小程序引入./dist编译的js文件
// const iot = require('./dist/alibabacloud-iot-device-sdk.js');
// js版本下载地址：
//    https://github.com/aliyun/alibabacloud-iot-device-sdk/tree/master/dist  或
//    alibabacloud-iot-device-sdk.js 下载地址 https://unpkg.com/alibabacloud-iot-device-sdk@1.2.4/dist/alibabacloud-iot-device-sdk.js  或
//    alibabacloud-iot-device-sdk.min.js 下载地址 https://unpkg.com/alibabacloud-iot-device-sdk@1.2.4/dist/alibabacloud-iot-device-sdk.min.js  
//  

const device = iot.device({
  productKey: '<productKey>',
  deviceName: '<deviceName>',
  deviceSecret: '<deviceSecret>',
  // 支付宝小程序和微信小程序额外需要配置协议参数
  // "protocol": 'alis://', "protocol": 'wxs://',
});
device.subscribe('/<productKey>/<deviceName>/get');
device.on('connect', () => {
  console.log('connect successfully!');
  device.publish('/<productKey>/<deviceName>/update', 'hello world!');
});
device.on('message', (topic, payload) => {
  console.log(topic, payload.toString());
});
```

## 物模型使用

LinkPlatform 封装了物模型定义与 Alink 异步协议，SDK 封装使得设备与云端通信时不需要关心 MQTT topic，只需要调用属性上报（<a href="#postProps"><code>iot.device#<b>postProps()</b></code></a>）、服务监听（<a href="#onService"><code>iot.device#<b>onService()</b></code></a>）、事件上报（<a href="#postEvent"><code>iot.device#<b>postEvent()</b></code></a>）等相关 API。

### 设备属性上报

```javascript
device.on('connect', () => {
  device.postProps({
    LightSwitch: 0
  }, (res) => {
    console.log(`postProps:`,res);
  });
});

```

调用 `device.postProps()` 等同于执行以下代码：
```javascript
// 发布属性上报 topic
device.publish('/sys/<productKey>/<deviceName>/thing/event/property/post', JSON.stringify({
  {
    id: msgId,
    version: '1.0',
    params: {
      'LightSwitch': 25,
    },
    method: 'thing.event.property.post'
  }
}));

// 监听属性上报响应 topic
device.subscribe('/sys/<productKey>/<deviceName>/thing/event/property/post_reply');
device.on('message', function(topic, message){
  const res = message.toString();
  if (res.id === msgId) {
    // 在这里处理服务端响应
    console.log(res.data);
  }
});
```

### 监听云端下发的服务调用消息

```javascript
// 监听云端设置属性wakeup_async服务消息
device.onService('wakeup_async', function (res,reply) {
  // 处理服务参数
  console.log('wakeup_async',res);
  // 返回云端异步服务处理消息
  reply({
    "code": 200,
    "data": {out:1}
  });
});
```

其他更多功能，请查api列表，值得注意的是，更多示例，见源码example文件夹
  - device继承自mqtt.js的EventEmitter，可以使用其全部方法
  - gateway可以使用device的全部api
  - subDevice也可以使用device的全部api


## API

设备相关
* <a href="#device"><code>iot.<b>device()</b></code></a>
* <a href="#publish"><code>iot.device#<b>publish()</b></code></a>
* <a href="#subscribe"><code>iot.device#<b>subscribe()</b></code></a>
* <a href="#unsubscribe"><code>iot.device#<b>unsubscribe()</b></code></a>
* <a href="#postProps"><code>iot.device#<b>postProps()</b></code></a>
* <a href="#postEvent"><code>iot.device#<b>postEvent()</b></code></a>
* <a href="#onService"><code>iot.device#<b>onService()</b></code></a>
* <a href="#end"><code>iot.device#<b>end()</b></code></a>
* <a href="#postTags"><code>iot.postTags#<b>postTags()</b></code></a>
* <a href="#deleteTags"><code>iot.deleteTags#<b>deleteTags()</b></code></a>
* <a href="#getConfig"><code>iot.getConfig#<b>getConfig()</b></code></a>
* <a href="#onConfig"><code>iot.onConfig#<b>onConfig</b></code></a>
* <a href="#onShadow"><code>iot.onShadow#<b>onShadow()</b></code></a>

* <a href="#getShadow"><code>iot.getShadow#<b>getShadow()</b></code></a>
* <a href="#postShadow"><code>iot.postShadow#<b>postShadow()</b></code></a>
* <a href="#deleteShadow"><code>iot.deleteShadow#<b>deleteShadow()</b></code></a>

网关相关（网关也可以使用设备相关的api）
* <a href="#gateway"><code>iot.<b>gateway()</b></code></a>
* <a href="#addTopo"><code>iot.gateway#<b>addTopo()</b></code></a>
* <a href="#getTopo"><code>iot.gateway#<b>getTopo()</b></code></a>
* <a href="#removeTopo"><code>iot.gateway#<b>removeTopo()</b></code></a>
* <a href="#login"><code>iot.gateway#<b>login()</b></code></a>
* <a href="#logout"><code>iot.gateway#<b>logout()</b></code></a>


子设备
* 与设备api相同，通过网关的login()方法返回子设备实例

动态注册
* <a href="#register"><code>iot(<b>register()</b></code></a>
* <a href="#regiestSubDevice"><code>iot.gateway#<b>regiestSubDevice()</b></code></a>


<a name="device"></a>

### iot.device(options)

和云端建立连接，返回一个 `Device` 连接实例，入参：

* `options`
  * `productKey`   (`String`)
  * `deviceName`   (`String`)
  * `deviceSecret` (`String`)
  * `region`     (`String`) 阿里云 region，默认值:cn-shanghai
  * `tls`          (`Bool`)   是否开启 TLS 加密，Node.js 中如果开启将使用 TLS 协议进行连接，浏览器如果开启将上使用 WSS 协议
  * `keepalive`    (`int`)   心跳报文时间间隔,默认值60秒
  * `clean`    (`bool`)   cleansession，是否清除连接session设置,默认值false

````js
const device = iot.device({
  productKey: '<productKey>',
  deviceName: '<deviceName>',
  deviceSecret: '<deviceSecret>'
});
````

### Event `'connect'`

`function(connack) {}`

当连接到云端成功时触发。

````javascript
const iot = require('alibabacloud-iot-device-sdk');

const device = iot.device({
  productKey: '<productKey>',
  deviceName: '<deviceName>',
  deviceSecret: '<deviceSecret>'
});

device.on('connect', () => {
  console.log('connected!');
});
````

### Event `'message'`

`function(topic, message) {}`

当接受到云端消息时触发，回调函数参数：

* `topic`  消息主题
* `message` 消息 payload


````js
device.on('message', (res) => {
  console.log('msg:',res);
});
````

### Event `'error'`

<font color="#dd0000">注意：由于nodejs的event机制，如果未监听error事件，当出现错误时会throw一个error，未try catch会导致程序终止，建议error事件需要监听</font><br /> 

node对于这个error处理的解释：
When an error occurs within an EventEmitter instance, the typical action is for an 'error' event to be emitted. These are treated as special cases within Node.js. If an EventEmitter does not have at least one listener registered for the 'error' event, and an 'error' event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits. 原文地址：https://nodejs.org/api/events.html

````js
device.on('error', (err) => {
  console.log('error:',err);
});
````

当连接出错触发

<a name="publish"></a>

### iot.device#publish(topic, message, [options], [callback])

* `topic` ：topic值 `String` 类型
* `message` 需要发送的消息, 数据格式为`Buffer or String` 类型
* `options` 
  * `qos` qos级别 `number` 类型 ，默认值0 
  * `retain` 
  * `dup`
* `callback`

````js
device.publish('/<productKey>/<deviceName>/update', 'hello world!');
device.publish('/<productKey>/<deviceName>/update', 'hello world!',{
  qos:1 // default 0
});
````

<a name="subscribe"></a>

### iot.device#subscribe(topic, [callback])

订阅消息，等同于 [mqtt.Client#subscribe()](https://github.com/mqttjs/MQTT.js/blob/master/README.md#subscribe) 方法。

<a name="unsubscribe"></a>

### iot.device#unsubscribe(topic, [callback])

取消订阅消息等同于 [mqtt.Client#unsubscribe()](https://github.com/mqttjs/MQTT.js/blob/master/README.md#unsubscribe) 方法。

<a name="postProps"></a>

### iot.device#postProps(params, [callback])

上报物模型属性：

* `params` 属性参数，`Object` 类型
* `callback`
  * `res` 服务端 reply 消息内容

<a name="postEvent"></a>

````js
// 上报设备属性
device.postProps({
  LightSwitch: 0
}, (res) => {
  console.log(res);
});
````

### iot.device#postEvent(eventIdentifier, params, [callback])

上报物模型事件：

* `eventName` 事件名称 `String` 类型
* `params` 事件参数，`Object` 类型
* `callback`
  * `err` 错误，比如超时
  * `res` 服务端 reply 消息内容

````js
// 上报设备事件
device.postEvent("lowpower", {
  power: 10,
}, (res) => {
  console.log(`postEvent:${res}`);
})
````


<a name="onService"></a>

### iot.device#onService(seviceIdentifier, [callback])

监听物模型服务：

* `seviceName` 服务名称,`String` 类型
* `callback`
  * `res` 服务端返回参数
  * `reply` 响应服务的函数，可以使用同步可以异步方式响应

relpy(params,[async or sync]) 
  * `params` 响应返回的数据
     * `id` 返回服务端的消息id，可以不填会自动生成
     * `code` 响应服务端的code，200为成功
     * `data` 响应服务端的数据
  * `type` 响应服务的类型，根据选择物模型服务的类型，同步或异步，选填 'async' or 'sync'


```javascript
// 假设物模型中有 wakeup_async的异步服务和wakeup_sync的同步服务，输出值都为out 
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
```


<a name="end"></a>

### iot.device#end([force], [options], [callback])

设备或网关断开连接，等同于 [mqtt.Client#end()](https://github.com/mqttjs/MQTT.js/blob/master/README.md#end) 方法。

<a name="postTags"></a>

### iot.device#postTags(params, [callback])

上报设备标签：

* `params` 属性对象数组，`array` 类型，内容格式示例 [ {attrKey:'xxx',attrValue:'xxx'},{}...]
  * `attrKey` 错误，比如超时或者 `res.code !== 200`
  * `attrValue` 服务端 reply 消息内容
* `callback`
  * `res` 服务端 reply 消息内容

- 每次重新上报设备标签相同key会覆盖内容，不同key会增加标签
- params 示例：

````js
const tags = [
  {
    "attrKey": "Temperature",
    "attrValue": "36.8"
  }
]
device.postTags(
  tags,
  (res) => {
    console.log(`add tag ok res:${res.id}`);
    done()
  }
);
````

<a name="deleteTags"></a>

### iot.device#deleteTags(tags)

删除设备标签：

* `tags` 属性参数，`array` 类型，内容格式 [ 'string','string',....]
  * `string` 内外为tag的标签名称

- 示例：
```javascript
device.deleteTags(['tagA','tagB']);
```

<a name="getConfig"></a>

### iot.device#getConfig(callback)

获取设备远程配置：

* `callback` 回调函数
  * res:当前设备的远程配置

- 示例：
````javascript
device.getConfig((res) => {
  console.log("getConfig:",res);
});
````

<a name="onConfig"></a>

### iot.device#onConfig(callback)

订阅设备远程配置，当云端修改远程配置时，设备端会收到消息：

* `callback` 回调函数
  * res:当前设备的远程配置

- 示例：
````javascript
device.onConfig((res) => {
  console.log("onConfig,res:",res);
});
````

<a name="onShadow"></a>

### iot.device#onShadow(callback)

订阅设备影子回调函数方法：

* `callback` 回调函数
  * res当影子设备变化或获取影子设备消息，上报影子消息时回调

- 示例：
````javascript
device.onShadow((res) => {
  console.log('获取最新设备影子,%o', res);
})
````

<a name="getShadow"></a>

### iot.device#getShadow()

获取设备影子最新：


- 示例：
````javascript
// 设备主动获取影子,回调函数会触发onShadow方法，返回设备影子信息
device.getShadow();
````

<a name="postShadow"></a>

### iot.device#postShadow(params)

上报设备影子数据

* `params` 上报影子设备的实际值

- 示例：
````javascript
// 上报成功或错误都会触发onShadow方法，返回设备影子信息
device.postShadow({
  a: "avalue"
});
````

<a name="deleteShadow"></a>

### iot.device#deleteShadow(keys)

删除影子设备的属性值

* `keys` 需要删除设备影子的属性的key数组 
* 除了数组外，如果传入单个key，可以删除单个属性，传入空会删除全部属性

- 示例：

````javascript
// 删除单个影子设备属性
device.deleteShadow("a");
// 删除多个影子设备属性
device.deleteShadow(["a","b"]);
// 删除所有影子设备属性
device.deleteShadow()
````

<a name="gateway"></a>

### iot.gateway(options)

和云端建立连接，返回一个网关 `Gateway` 类连接实例，继承自 `Device`  类。网关可以使用设备的所有方法

* `options`
  * `productKey`   (`String`)
  * `deviceName`   (`String`)
  * `deviceSecret` (`String`)
  * `region`     (`String`) 阿里云 region，默认值:cn-shanghai
  * `tls`          (`Bool`)   是否开启 TLS 加密，Node.js 中如果开启将使用 TLS 协议进行连接，浏览器如果开启将上使用 WSS 协议
  * `keepalive`    (`int`)   心跳报文时间间隔,默认值60秒
  * `clean`    (`bool`)   cleansession，是否清除连接session设置,默认值false


````js
const device = iot.gateway({
  productKey: '<productKey>',
  deviceName: '<deviceName>',
  deviceSecret: '<deviceSecret>'
});
````

<a name="addTopo"></a>

### iot.gateway#addTopo(deviceSign, [callback])

添加子设备到拓扑

* `params` 子设备三元组数组，[{productKey,deviceName,deviceSecret},{productKey,deviceName,deviceSecret},]
* `callback`
  * `res` 服务端 reply 消息内容

````js
gateway.addTopo(
  [sub_device1,sub_device2],
  (res)=>{console.log('>>>>>getTopo',res.message,res.data);}
);
````

<a name="getTopo"></a>

### iot.gateway#getTopo(callback)

添加子设备到拓扑关系

* `callback`
  * `res` 服务端 reply 消息内容

````js
gateway.getTopo(
  (res)=>{
    console.log(res)
  }
);
````

<a name="removeTopo"></a>

### iot.gateway#removeTopo(params, [callback])

从拓扑关系里移除子设备

* `params` 移除设备参数的数组，示例:[{"productKey": "xx","deviceName": "xx"},{"productKey": "xx","deviceName": "xx"},....]
  * `productKey`
  * `deviceName`
* `callback`
  * `res` 服务端 reply 消息内容

````js
gateway.removeTopo(
  [{"productKey": "xx","deviceName": "xx"},{"productKey": "xx","deviceName": "xx"}],
  (res)=>{
    console.log('>>>>>getTopo')
    console.log(res.message)
    console.log(res.data)
  }
);
````


<a name="login"></a>

### iot.gateway#login(params, [callback])

子设备上线

* `params` 登录的设备信息示例：{"productKey": "xx","deviceName": "xx",}
  * `productKey`   (`String`)
  * `deviceName`   (`String`)
  * `deviceSecret` (`String`)
* `callback`
  * `res` 服务端 reply 消息内容
* `返回值` 返回一个子设备，子设备可以使用设备的api，做相关的操作

````js

gateway.on('connect', () => {
  //子设备登录ok
  sub1 = gateway.login(
    {"productKey":"xx","deviceName":"xx","deviceSecret":"xxx"},
    (res) => {
      console.log('>>>>>login', res);
    }
  );
  // 子设备连接状态
  sub1.on('connect', () => {
    console.log(">>>>sub connected!");
    // do something 
    sub1.postProps({
      LightSwitch: 0
    },(res)=>{
      console.log(">>>>sub postProps!");
      console.log(res);
    });
  });
});
````

<a name="logout"></a>

### iot.gateway#logout(params, [callback])

子设备下线

* `params` 子设备身份
  * `productKey`   (`String`)
  * `deviceName`   (`String`)
* `callback`
  * `res` 服务端 reply 消息内容

````js
gateway.logout(
  {"productKey": "xxxxx","deviceName": "xxxxx"},
  (res) => {
    console.log('>>>>>logout', res);
  }
````
  
<a name="register"></a>

### iot#register(params, [callback])

直连设备动态注册

* `params` 子设备身份 object 实例  productKey:"a15YDgQGhU0",
  * `productKey`
  * `productSecret`
  * `deviceName`
* `callback`
  * `res` 服务端 reply 消息内容，包含设备三元组

````js
const params = {
  productKey:"xxxxxx",
  productSecret:"xxxxxx",
  deviceName:"xxxxxx"
}
iot.register(params,(res)=>{
  console.log("register:",res);
  if(res.code == '200'){
    // 注册成功请保存设备三元组，只会返回一次
  }
})
````
  
<a name="regiestSubDevice"></a>

### iot.gateway#regiestSubDevice(params, [callback])

通过网关注册子设备

* `params` 子设备身份信息,可以是单个`{productKey,deviceName}`或者是一组`[{productKey,deviceName},{productKey2,deviceName2}]`进行批量注册
  * `productKey`
  * `deviceName`
* `callback`
  * `res` 服务端 reply 消息内容

````js
const gateway = iot.gateway({
  productKey: '<productKey>',
  deviceName: '<deviceName>',
  deviceSecret: '<deviceSecret>'}
);
gateway.on('connect', () => {
  gateway.regiestSubDevice([{"deviceName": "xxx","productKey": "xxx"}],(res)=>{
    if(res.code == '200'){
      // 注册成功请保存设备三元组，只会返回一次
    }
  });
});
````

## 平台返回res统一格式
  * `id` 发送请求的消息id，sdk中会自动生成
  * `message` 返回的消息
  * `data` 返回的数据
  * `code` 服务端返回消息的状态码，常见code如下
      * `200` 成功
      * `400` 内部服务错误， 处理时发生内部错误
      * `429` 请求过于频繁，设备端处理不过来时可以使用
      * `460` 请求参数错误
      * `520` 子设备会话不存在


## example说明
> 注意： example中的iot引用，const iot = require('../lib');，如果在github工程以外使用，需要换成  const iot = require('alibabacloud-iot-device-sdk');

example见github开源工程中example目录 https://github.com/aliyun/alibabacloud-iot-device-sdk

- broswer 浏览器中使用demo 路径 /example/broswer/index.html
- quickstart 快速开始demo 路径 /example/quickstart
- props 物模型-属性demo   路径 /example/props.js
- event 物模型-事件demo 路径 /example/event.js
- service_async 物模型-异步服务demo 路径 /example/service_async.js
- service_sync 物模型-同步服务demo 路径 /example/service_sync.js
- origin 基础mqtt pub，sub使用 路径 /example/origin.js
- remote_confit_get 远程配置-主动获取 路径 /example/remote_confit_get.js
- remote_confit_sub 远程配置-订阅获取 路径 /example/remote_confit_sub.js
- tag 设备标签获取 路径 /example/tag.js
- shadow 设备影子 路径 /example/shadow.js
- one_model_one_secret 一型一密使用demo 路径 /example/one_model_one_secret.js






## 版本更新说明

#### 1.2.8
- 使用crypto-js替代原生的crypto做设备签名加密功能，浏览器和微信支付宝小程序的编译大小，min压缩版从661k减少到418k，体积减少37%


#### 1.2.7
- 增加onProps方法，用于监听云端对物模型属性设置的监听
- 解决postEvent和postProps回调中内容不正确的问题

#### 1.2.5
- 修复网关使用mqtt pub和sub时字符转译报错的警告

#### 1.2.4 稳定版本

- 包名的修改，从 aliyun-iot-device-sdk 正式改名为 alibabacloud-iot-device-sdk
- 增加对微信小程序，支付宝小程序的支持，浏览器的支持 [教程连接 ./docs](./docs)
- 增加onService中reply函数,并支持同步和异步调用
```javascript
// 假设物模型中有 wakeup_async的异步服务和wakeup_sync的同步服务，输出值都为out 
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
```

- 增加onConfig方法用于订阅云端远程配置更新
- 增加部分功能的example
- 重写了网关子设备subdevice的实现

#### 1.0.1版本更新

- 对核心代码进行了重构
- 增加设备标签上报功能
- 增加删除标签功能
- 增加了设备动态注册功能
- 增加设备影子相关功能
- 增加获取设备配置功能
- [非兼容性升级]网关设备之前的删除topo方法名和文档不一致，去掉了deleteTopo方法，统一使用removeTopo
- [非兼容性升级]网关类方法，入参需要signUtil的逻辑去除，直接传入设备信息
- [非兼容性升级]去掉signUtil方法导出
- [非兼容性升级]初始化device和gateway时候签名方法参数从signAlgorithm改为signmethod
- [非兼容性升级]设备的serve方法改成onService
- [非兼容性升级]修改返回函数的res格式，取消err作为第一个参数，code,mssage都会放在res里面
- [非兼容性升级]去掉网关设备的方法 postSubDeviceProps，postSubDeviceEvent，serveSubDeviceService，改成使用子设备调用
````
// iot.gateway#postSubDeviceProps()
// iot.gateway#postSubDeviceEvent()
// iot.gateway#serveSubDeviceService()

const sub = gateway.login(
  sub_device1,
  (res)=>{console.log('>>>>>login',res);}
);

sub.on('connect', () => {
  console.log(">>>>sub connected!");
  sub.postProps({
    LightSwitch: 0
  },(res)=>{
      console.log(">>>>sub postProps!");
      console.log(res);
  });
}); 
setTimeout(()=>{
  gateway.logout(
      sub_device1,
      (res)=>{console.log('>>>>>logout',res);}
  );
},5000)
````

#### 0.3.1版本更新
- productKey，deviceName，deviceSecret大小写经常容易忽略，新版本支持忽略大小写，也可以连接上

#### 0.3.0版本更新
1:初始化连接option选择增加支持keepalive和clean（cleansession）配置
2:修改regionId为region，并兼容之前的regionId参数


#### 研发中常见的问题

1：onMessage多次回调，示例如下

````js
// 错误示例
const device = iot.device({...,...});
device.on('connect', (res) => {
  device.on('message',(topic,payload) => {
      // you biz logic at here
  });
});

// 错误原因  device.on('message')委托放在 device.on('connecnt')中会导致多次绑定，产生message中的函数多次重复触发

// 正确示例
const device = iot.device({...,...});
device.on('connect', (res) => {
 
});
device.on('message',(topic,payload) => {
    // you biz logic at here
});
````

