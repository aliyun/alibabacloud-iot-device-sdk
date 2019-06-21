// 阿里云LinkPlatform平台功能topic方法参数模块
export const ALIYUN_BROKER_METHODS_TEMPLATE = {
  /* device methods */
  POST_PROPERY: 'thing.event.property.post',
  POST_EVENT: 'thing.event.%s.post',
  POST_TAGS: 'thing.deviceinfo.update',
  DELETE_TAGS: 'thing.deviceinfo.delete',
  GET_CONFIG: 'thing.config.get',
  /* gateway methods */
  ADD_TOPO: 'thing.topo.add',
  DELETE_TOPO: 'thing.topo.delete',
  GET_TOPO: 'thing.topo.get',
  SUBDEVICE_REGISTER: 'thing.sub.register'
};
 
export const ALIYUN_BROKER_TOPICS = {
  /* device topic */
  SERVICE_TOPIC: '/sys/%s/%s/thing/service/%s',
  SERVICE_REPLY_TOPIC: '/sys/%s/%s/thing/service/%s_reply',
  PROPERTY_POST_TOPIC: '/sys/%s/%s/thing/event/property/post',
  PROPERTY_POST_REPLY_TOPIC: '/sys/%s/%s/thing/event/property/post_reply',
  ONSET_PROPS_TOPIC :'/sys/%s/%s/thing/service/property/set',
  // EVENT_WILDCARD_TOPIC:'/sys/%s/%s/thing/event/#',
  EVENT_WILDCARD_TOPIC:'/sys/%s/%s/thing/event/+/post_reply',
  EVENT_POST_TOPIC: '/sys/%s/%s/thing/event/%s/post',
  EVENT_POST_REPLY_TOPIC: '/sys/%s/%s/thing/event/%s/post_reply',
  REPORT_SDK_INFO_TOPIC: '/sys/%s/%s/thing/deviceinfo/update',
  //设备标签上报topic。参数：{productKey}/{deviceName} 
  TAG_TOPIC: '/sys/%s/%s/thing/deviceinfo/update',
  //设备标签上报reply的topic。参数：{productKey}/{deviceName} 
  TAG_REPLY_TOPIC: '/sys/%s/%s/thing/deviceinfo/update_reply',
  //删除设备标签topic。参数：{productKey}/{deviceName} 
  TAG_DELETE_TOPIC: '/sys/%s/%s/thing/deviceinfo/delete',
  //删除设备标签reply的topic。参数：{productKey}/{deviceName} 
  TAG_DELETE_REPLY_TOPIC: '/sys/%s/%s/thing/deviceinfo/delete_reply',
  // 远程配置通用topic
  CONFIG_WILDCARD_TOPIC: '/sys/%s/%s/thing/config/#',
  // 远程配置topic 参数：{productKey}/{deviceName} 
  CONFIG_TOPIC: '/sys/%s/%s/thing/config/get',
  // 远程配置reply topic 参数：{productKey}/{deviceName} 
  CONFIG_REPLY_TOPIC: '/sys/%s/%s/thing/config/get_reply',
  // 远程配置订阅变化topic 参数：{productKey}/{deviceName} 
  CONFIG_SUBSCRIBE_TOPIC: '/sys/%s/%s/thing/config/push',
  // 远程配置reply topic 参数：{productKey}/{deviceName} 
  CONFIG_SUBSCRIBE_RESP_TOPIC: '/sys/%s/%s/thing/config/push_reply',
  // 设备影子订阅topic
  SHADOW_SUBSCRIBE_TOPIC: '/shadow/get/%s/%s',
  // 设备影子获取topic
  SHADOW_GET_TOPIC: '/shadow/update/%s/%s',
  // 设备影子更新topic
  SHADOW_POST_TOPIC: '/shadow/update/%s/%s',
  // RRPC云端请求消息通用Topic
  RRPC_REQ_TOPIC:'/sys/%s/%s/rrpc/request/+',
  // RRPC响应消息Topic
  RRPC_RESP_TOPIC:'/sys/%s/%s/rrpc/response/%s',

  /* gateway topic */
  ADD_TOPO_TOPIC: '/sys/%s/%s/thing/topo/add',
  ADD_TOPO_REPLY_TOPIC: '/sys/%s/%s/thing/topo/add_reply',
  DELETE_TOPO_TOPIC: '/sys/%s/%s/thing/topo/delete',
  DELETE_TOPO_REPLY_TOPIC: '/sys/%s/%s/thing/topo/delete_reply',
  GET_TOPO_TOPIC: '/sys/%s/%s/thing/topo/get',
  GET_TOPO_REPLY_TOPIC: '/sys/%s/%s/thing/topo/get_reply',
  LOGIN_TOPIC: '/ext/session/%s/%s/combine/login',
  LOGIN_REPLY_TOPIC: '/ext/session/%s/%s/combine/login_reply',
  LOGOUT_TOPIC: '/ext/session/%s/%s/combine/logout',
  LOGOUT_REPLY_TOPIC: '/ext/session/%s/%s/combine/logout_reply',
  SUBDEVICE_REGISTER_TOPIC: '/sys/%s/%s/thing/sub/register',
  SUBDEVICE_REGISTER_REPLY_TOPIC: '/sys/%s/%s/thing/sub/register_reply',
};
