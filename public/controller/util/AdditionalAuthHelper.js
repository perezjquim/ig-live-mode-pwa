sap.ui.define(["sap/ui/base/Object"],function(t){return t.extend("com.perezjquim.iglivemode.pwa.controller.util.AdditionalAuthHelper",{_oController:null,constructor:function(t){this._oController=t},onAfterCloseAdditionalAuthPrompt:function(t){this._oController.clearModel("additional_auth_prompt")},onConfirmAdditionalAuth:async function(t){this._oController.setBusy(true);const o=t.getSource();const e=o.getParent();const n=e.getParent();const i=this._oController.getModel("additional_auth_prompt");const r=i.getProperty("/verification_code");if(r){try{const t=new Headers;const o=i.getProperty("/settings");const e=encodeURIComponent(JSON.stringify(o));t.append("ig_settings",e);t.append("Authorization",i.getProperty("/authorization"));var s="";const l=i.getProperty("/two_factor_info");if(l){l["verification_code"]=r;s="login_2fa";t.append("two_factor_info",JSON.stringify(l))}else{const o=i.getProperty("/checkpoint_info");if(o){o["verification_code"]=r;s="login_checkpoint";t.append("checkpoint_info",JSON.stringify(o))}}const a=await fetch(`${this._oController.API_BASE_URL}/${s}`,{method:"POST",headers:t});if(a.ok){const t=await a.json();const o=JSON.stringify(t);localStorage.setItem("ig_settings",o);this._oController.fetchData();const e=this._oController.getText("action_success");this._oController.toast(e);n.close()}else{const t=await a.text();console.warn(t);this._oController.toast(t)}}catch(t){console.warn(t);this._oController.toast(t)}this._oController.setBusy(false)}else{this._oController.setBusy(false);const t=this._oController.getText("incomplete_data");this._oController.toast(t)}}})});