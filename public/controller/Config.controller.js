sap.ui.define(["./util/BaseController","sap/m/MessageBox","sap/m/MessageToast","sap/ui/core/Fragment"],function(e,t,o,n){"use strict";return e.extend("com.perezjquim.iglivemode.pwa.controller.Config",{onInit:function(){const e=this.getModel("config");e.attachPropertyChange(this.onConfigChange.bind(this))},onConfigChange:function(){this.setBusy(true);const e=this.getModel("config");const t=e.getData();const o=JSON.stringify(t);const n=this.getStorage();n.setItem("config",o);this.setBusy(false)},onAddEntry:function(e){const t=e.getSource();this._oNewUserSource=t;if(!this._oNewUserPopover){this.setBusy(true);const e=this.getView();n.load({name:"com.perezjquim.iglivemode.pwa.view.fragment.NewUserPopover",controller:this}).then(function(o){this.setBusy(false);e.addDependent(o);o.openBy(t);this._oNewUserPopover=o}.bind(this))}else{if(this._oNewUserPopover.isOpen()){this._oNewUserPopover.close()}else{this._oNewUserPopover.openBy(t)}}},onConfirmNewUser:function(e){const t=this.getModel("new_user_prompt");const o=t.getProperty("/user_name");this._addEntry(this._oNewUserSource,o);this._closePopover(e)},onCancelNewUser:function(e){this._closePopover(e)},_closePopover:function(e){const t=e.getSource();const o=t.getParent();const n=o.getParent();n.close()},onBeforeOpenNewUserPopover:function(e){this.clearModel("new_user_prompt")},onAfterCloseNewUserPopover:function(e){this.clearModel("new_user_prompt")},_addEntry:function(e,t){const o=e.getParent();const n=o.getParent();const s=n.getBinding("items");const r=s.getModel();const i=s.getPath();const c=r.getProperty(i);const a=c.concat([{user_name:t}]);r.setProperty(i,a)},onRemoveEntry:function(e){const n=e.getSource();const s=this.getText("confirm_remove_user");t.confirm(s,{actions:[t.Action.OK,t.Action.CANCEL],emphasizedAction:t.Action.OK,onClose:function(e){if(e==t.Action.OK){this._removeEntry(n);const e=this.getText("user_removed");o.show(e)}}.bind(this)})},_removeEntry:function(e){const t=e.getParent();const o=t.getParent();const n=o.getParent();const s=n.getItems();const r=s.findIndex(function(e){return e==o});const i=n.getBinding("items");const c=i.getModel();const a=i.getPath();const f=c.getProperty(a);const g=f;g.splice(r,1);c.setProperty(a,g);this.onConfigChange()},fetchAvatar:async function(e){if(e){const t=await this._getUserInfo(e);if(t){const e="profile_pic_content";const o=t[e];return o}}},fetchFullName:async function(e){if(e){const t=await this._getUserInfo(e);if(t){const e="full_name";const o=t[e];return o}}},_getUserInfo:async function(e){const t=this.getModel("ig_user_info");const o=`/${e}`;var n=t.getProperty(o);if(n){return n}else{n=await this._fetchUserInfo(e);t.setProperty(o,n);return n}},_fetchUserInfo:async function(e){const t=await fetch(`${this.API_BASE_URL}/get-user-info/${e}`,{method:"GET"});if(t.ok){const e=await t.json();return e}else{return{}}}})});