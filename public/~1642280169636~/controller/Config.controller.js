sap.ui.define(["./util/BaseController","sap/m/MessageBox","sap/ui/core/Fragment"],function(t,s,e){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.Config",{onSaveConfig:async function(t){this.setBusy(true);const s=this.getModel("config_draft");const e=s.getData();const o=JSON.stringify(e);try{const t=await fetch(`${this.API_BASE_URL}/update-config`,{method:"POST",headers:this._getHeaders(),body:o});if(t.ok){const s=await t.json();const e=this.getModel("config");e.setData(this._copy(s));this._listenConfigChanges();const o=this.getModel("misc");o.setProperty("/is_config_changed",false);const i=this.getText("action_success");this.toast(i)}else{const t=this.getText("action_error");this.toast(t)}}catch(t){console.warn(t);this.toast(t)}this.setBusy(false)},onDiscardConfig:function(t){this.setBusy(true);const s=this.getModel("config");const e=s.getData();const o=this.getModel("config_draft");o.setData(this._copy(e));this._listenConfigChanges();const i=this.getModel("misc");i.setProperty("/is_config_changed",false);this.setBusy(false)}})});