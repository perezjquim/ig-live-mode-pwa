sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/ui/core/BusyIndicator","sap/m/MessageToast"],function(t,e,o,n){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.util.BaseController",{_oFetchPromises:[],API_BASE_URL:"https://perezjquim-ig-live-mode.herokuapp.com",toast:function(t){n.show(t)},setBusy:function(t){if(t){o.show(0)}else{o.hide()}},getModel:function(t){const e=this.getOwnerComponent();const o=e.getModel(t);return o},attachPatternMatched(t,e){const o=this.getOwnerComponent();const n=o.getRouter();const s=n.getRoute(t);s.attachPatternMatched(e)},getConfig:function(t){const e=this.getModel("config");const o=e.getProperty(`/${t}`);return o},navTo:function(t,e,o){const n=this.getOwnerComponent();const s=n.getRouter();s.navTo(t,e,o)},getText:function(t){const e=this.getModel("i18n");const o=e.getResourceBundle();const n=o.getText(t);return n},navBack:function(){const t=e.getInstance();const o=t.getPreviousHash();if(o){window.history.go(-1)}else{this.navTo("Home",{},true)}},getStorage:function(){return window.localStorage},clearModel:function(t){const e=this.getModel(t);const o=e.getData();for(var n in o){o[n]=""}e.setData(o)},fetchAvatar:async function(t){if(t){const e=await this._getUserInfo(t);if(e){const t="profile_pic_content";const o=e[t];return o}}},fetchFullName:async function(t){if(t){const e=await this._getUserInfo(t);if(e){const t="full_name";const o=e[t];return o}}},_getUserInfo:async function(t){const e=this.getModel("ig_user_info");const o=`/${t}`;var n=e.getProperty(o);if(n){return n}else{n=await this._fetchUserInfo(t);e.setProperty(o,n);return n}},_fetchUserInfo:async function(t){if(!this._oFetchPromises[t]){this._oFetchPromises[t]=fetch(`${this.API_BASE_URL}/get-user-info/${t}`,{method:"GET"})}const e=this._oFetchPromises[t];const o=await e;if(o.ok){const t=await o.json();return t}else{return{}}}})});