
class Callback {
  
  constructor(thing){
    // service callback
    this._onShadow;
    this._onConfig;
    // 子设备
    if(thing.gateway) {
      
    }
  }
  _isSubDevice(){
    if(thing.gateway) {
      return true;
    }
    return false;
  }

  getOnShadow() {
    if()
  }

  setOnShadow(cb) {
    this._onShadow = cb;
  }
}