sap.ui.define(["./util/BaseController","sap/ui/core/routing/History","sap/ui/core/Fragment","sap/ui/util/Storage","sap/ui/Device","./util/SWHelper"],function(t,e,o,s,n,i){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.App",{onInit:function(t){const e=new i(this);e.init();this._checkLogin()},onHomeButtonPress:function(t){const e=t.getSource();const o=e.getParent();const s=o.getSideContent();const n=s.getItem();const i=n.getItems();const c=i.find(function(t){const e=t.getKey();return e=="Home"});n.fireItemSelect({item:c})},onMenuButtonPress:function(t){const e=t.getSource();const o=e.getParent();const s=o.getSideExpanded();o.setSideExpanded(!s)},onNavigationItemSelect:function(t){const e=t.getParameter("item");const o=e.getKey();this.navTo(o);const s=n.system.phone;if(s){const e=t.getSource();const o=e.getParent();o.setSideExpanded(false)}},onNavButtonPress:function(t){this.navBack()},_checkLogin:function(){const t=Boolean(localStorage.getItem("ig_settings"));if(t){(async function(){this._fetchData()}).bind(this)()}else{this._askForLogin()}},_fetchData:function(){this._fetchUserInfo();this._fetchConfig()},_fetchUserInfo:async function(){this.setBusy(true);try{const t=await fetch(`${this.API_BASE_URL}/get-user-info`,{method:"GET",headers:this._getHeaders()});if(t.ok){const e=await t.json();const o=this.getModel("ig_user_info");o.setData(e)}}catch(t){console.warn(t);this.toast(t)}this.setBusy(false)},_fetchConfig:async function(){try{const t=await fetch(`${this.API_BASE_URL}/get-config`,{method:"GET",headers:this._getHeaders()});if(t.ok){const e=await t.json();const o=this.getModel("config");o.setData(e);const s=this._copy(e);const n=this.getModel("config_draft");n.setData(s);this._listenConfigChanges()}}catch(t){console.warn(t);this.toast(t)}const t=this.getModel("misc");t.setProperty("/is_config_loaded",true)},_askForLogin:function(){if(!this._oLoginPromptDialog){this.setBusy(true);o.load({name:"com.perezjquim.iglivemode.pwa.view.fragment.LoginPrompt",controller:this}).then(function(t){this.setBusy(false);const e=this.getView();e.addDependent(t);t.open();this._oLoginPromptDialog=t}.bind(this))}else{this._oLoginPromptDialog.open()}},onBeforeOpenLoginPrompt:function(t){this.clearModel("login_prompt")},onAfterCloseLoginPrompt:function(t){this.clearModel("login_prompt")},onConfirmLogin:async function(t){this.setBusy(true);const e=this.getModel("login_prompt");const o=e.getData();const s=o["user"];const n=o["pw"];const i="Basic "+btoa(s+":"+n);if(o&&i){try{const t=await fetch(`${this.API_BASE_URL}/login`,{method:"POST",headers:{Authorization:i}});if(t.ok){const e=await t.json();const o=JSON.stringify(e);localStorage.setItem("ig_settings",o);this._fetchData();const s=this.getText("action_success");this.toast(s);this._oLoginPromptDialog.close()}else{const t=this.getText("action_error");this.toast(t)}}catch(t){console.warn(t);this.toast(t)}this.setBusy(false)}else{this.setBusy(false);const t=this.getText("incomplete_data");this.toast(t)}},dummyEscapeHandler:function(t){t.reject()},onAvatarPress:function(t){const e=t.getSource();if(!this._oUserDetailsPopover){this.setBusy(true);o.load({name:"com.perezjquim.iglivemode.pwa.view.fragment.UserDetailsPopover",controller:this}).then(function(t){this.setBusy(false);const o=this.getView();o.addDependent(t);t.openBy(e);this._oUserDetailsPopover=t}.bind(this))}else{if(this._oUserDetailsPopover.isOpen()){this._oUserDetailsPopover.close()}else{this._oUserDetailsPopover.openBy(e)}}},onLogoff:function(t){this.setBusy(true);localStorage.removeItem("ig_settings");location.reload()}})});