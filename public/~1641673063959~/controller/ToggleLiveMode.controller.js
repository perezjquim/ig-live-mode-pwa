sap.ui.define(["./util/BaseController","sap/ui/core/Fragment"],function(t,e){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.ToggleLiveMode",{onPressEnableLive:function(t){this._executeAction("enable-live")},onPressDisableLive:function(t){this._executeAction("disable-live")},_executeAction:function(t){this.setBusy(true);const e=this._getAuthenticatedBody();if(oConfigData&&oIGSettings&&e){fetch(`${this.API_BASE_URL}/${t}`,{method:"POST",body:e}).then(t=>{if(t.ok){const t=this.getText("action_success");this.toast(t)}else{const t=this.getText("action_error");this.toast(t)}}).catch(()=>{const t=this.getText("action_error");this.toast(t)}).finally(()=>{this.setBusy(false)})}else{this.setBusy(false);const t=this.getText("incomplete_data");this.toast(t)}}})});