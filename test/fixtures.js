const { hmacSign } = require('../lib/utils');

exports.lightDevice = {
  productKey: 'a',
  deviceName: 'b',
  deviceSecret: 'c',
  brokerUrl: 'tcp://127.0.0.1:1883/'
};

// pn:高级版_sdk开发测试设备
exports.sdk_device1 = {
  productKey: 'a1aq9sQk2JE',
  deviceName: 'sdk_device1',
  deviceSecret: 'shvvZGkq4mM641WUhpfJpyInVeJhAH2y',
};
exports.sdk_device2 = {
  productKey: 'a1aq9sQk2JE',
  deviceName: 'sdk_device2',
  deviceSecret: '9MjBATSaS9RVditKYamlTtIGwqhuiQeB',
};
exports.sdk_device3 = {
  productKey: 'a1aq9sQk2JE',
  deviceName: 'sdk_device3',
  deviceSecret: 'ZXdtUJ1nlGxy1v2ZHjq5cTTt3RTVicoX',
};
exports.sdk_device4 = {
  "ProductKey": "a1aq9sQk2JE",
  "DeviceName": "sdk_device4",
  "DeviceSecret": "oHnUgLkqzv4jlEcqMkukjedXxRWE51Gg"
};

// 高级版sdk网关高级版
exports.sdk_gateway1 = {
  productKey: 'a1BOOa9HG6Z',
  deviceName: 'sdk_gateway1',
  deviceSecret: 'foepBtCT0Jl6x640KKQCPeYi9Kv8NdSV'
};
exports.sdk_gateway2 = {
  productKey: 'a1BOOa9HG6Z',
  deviceName: 'sdk_gateway2',
  deviceSecret: 'w6EXjFLT44VH0T5BUn0xplqW47Ye9Uze'
};

// 网关测试子设备
exports.sub_device1 = {
  productKey: 'a1aq9sQk2JE',
  deviceName: 'sub_device1',
  deviceSecret: 'ZlpbIRlTJQSzt8LegT5ALBvHbgEZK6Av'
};
exports.sub_device2 = {
  productKey: 'a1aq9sQk2JE',
  deviceName: 'sub_device2',
  deviceSecret: 'qp5ZAHBffAjKgqjDQ2bgiReNWE5uBKDW'
};
exports.sub_device3 ={
  "ProductKey": "a1aq9sQk2JE",
  "DeviceName": "sub_device3",
  "DeviceSecret": "yl2qWGfww43eXrePsHCDhKH5y8URJyJK"
};


// 基础版sdk开发
exports.base_sdk_device1 = {
  productKey: 'a1YPDpMvd5t',
  deviceName: 'base_sdk_device1',
  deviceSecret: 'ePvXtVsndoeocd8zDSLC1BDDsCtPLBos'
};

exports.base_sdk_device2 = {
  productKey: 'a1YPDpMvd5t',
  deviceName: 'base_sdk_device2',
  deviceSecret: 'WnuQaINuj8oJva7R2vJGwds5w9PqF9VT'
};

// 不存在或错误的三元组
exports.wrong_device1 = {
  productKey: 'xxxxx',
  deviceName: 'xxxxx_base_sdk_device1',
  deviceSecret: 'xxxxxx'
};

// 其他模拟设备
exports.airBox = {
  productKey: 'a',
  deviceName: 'b',
  deviceSecret: 'c',
  brokerUrl: 'tcp://127.0.0.1:1883/'
};

exports.gateway = {
  productKey: 'a',
  deviceName: 'b',
  deviceSecret: 'c',
  brokerUrl: 'tcp://127.0.0.1:1883/'
};

exports.gateway2 = {
  productKey: 'a',
  deviceName: 'b',
  deviceSecret: 'c',
  brokerUrl: 'tcp://127.0.0.1:1883/'
};

exports.testDevices = [
  {
    productKey: 'a',
    deviceName: 'b',
    deviceSecret: 'c',
    brokerUrl: 'tcp://127.0.0.1:1883/'
  }
];

