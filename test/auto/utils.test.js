
const {isJsonString,mqttMatch} = require('../../lib/utils');

describe('util test', () => {
  test('test isJsonString funciton with string should be pass ', done => {
    console.log("isJsonString('aaa')",isJsonString("aaa"));
    expect(isJsonString("aaa")).toBeFalsy();  
    done();
  });
  test('test isJsonString funciton with jsonstring should be pass ', done => {
    const jsonObj = {'a':'aaa'};
    const jsonStr = JSON.stringify(jsonObj);
    console.log("jsonStr:%s,result:",jsonStr,isJsonString(jsonStr));
    expect(isJsonString(jsonStr)).toBeTruthy();  
    done()
  });
  test('test mqttMatch funciton should be pass ', done => {
    const filter1 = '/sys/a1ouyopKiEU/device1/thing/service/#'
    const filter2 = '/sys/a1ouyopKiEU/device1/thing/service/+'
    const filter3 = '/sys/a1ouyopKiEU/device1/thing/#'
    const topic = '/sys/a1ouyopKiEU/device1/thing/service/add_async';
    expect(mqttMatch(filter1,topic)).toBeTruthy();  
    expect(mqttMatch(filter2,topic)).toBeTruthy();  
    expect(mqttMatch(filter3,topic)).toBeTruthy();  
    done()
  });
});

