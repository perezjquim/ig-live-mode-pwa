sap.ui.define(["./util/BaseController","sap/ui/core/Fragment"],function(e,t){"use strict";return e.extend("com.perezjquim.iglivemode.pwa.controller.ToggleLiveMode",{onPressEnableLive:function(e){this._executeAction("enable-live")},onPressDisableLive:function(e){this._executeAction("disable-live")},_executeAction:async function(e){this.setBusy(true);try{const t=await fetch(`${this.API_BASE_URL}/${e}`,{method:"POST",headers:this._getHeaders()});if(t.ok){const e=this.getText("action_success");this.toast(e)}else{const e=await t.text();console.warn(e);this.toast(e)}}catch(e){console.warn(e);this.toast(e)}this.setBusy(false)}})});