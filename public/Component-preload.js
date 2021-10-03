//@ui5-bundle com/perezjquim/iglivemode/pwa/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"com/perezjquim/iglivemode/pwa/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device"],function(i,e){"use strict";return i.extend("com.perezjquim.iglivemode.pwa.Component",{metadata:{manifest:"json"},init:function(){i.prototype.init.apply(this,arguments);this.getRouter().initialize()}})});
},
	"com/perezjquim/iglivemode/pwa/controller/App.controller.js":function(){sap.ui.define(["./util/BaseController","sap/ui/core/routing/History","sap/ui/core/Fragment","sap/ui/util/Storage","sap/ui/Device","./util/SWHelper"],function(t,e,n,o,i,s){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.App",{onInit:function(t){const e=new s(this);e.init();this._reloadConfig()},onHomeButtonPress:function(t){const e=t.getSource();const n=e.getParent();const o=n.getSideContent();const i=o.getItem();const s=i.getItems();const c=s.find(function(t){const e=t.getKey();return e=="Home"});i.fireItemSelect({item:c})},onMenuButtonPress:function(t){const e=t.getSource();const n=e.getParent();const o=n.getSideExpanded();n.setSideExpanded(!o)},onNavigationItemSelect:function(t){const e=t.getParameter("item");const n=e.getKey();this.navTo(n);const o=i.system.phone;if(o){const e=t.getSource();const n=e.getParent();n.setSideExpanded(false)}},onNavButtonPress:function(t){this.navBack()},_reloadConfig:function(){const t=this.getStorage();const e=t.getItem("config");if(e){const t=JSON.parse(e);const n=this.getModel("config");n.setData(t)}}})});
},
	"com/perezjquim/iglivemode/pwa/controller/Config.controller.js":function(){sap.ui.define(["./util/BaseController","sap/ui/util/Storage"],function(t,n){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.Config",{onInit:function(){const t=this.getModel("config");t.attachPropertyChange(this.onConfigChange.bind(this))},onConfigChange:function(){this.setBusy(true);const t=this.getModel("config");const n=t.getData();const e=JSON.stringify(n);const o=this.getStorage();o.setItem("config",e);this.setBusy(false)},onAddEntry:function(t){const n=t.getSource();const e=n.getParent();const o=e.getParent();const s=o.getBinding("items");const c=s.getModel();const i=s.getPath();const r=c.getProperty(i);const g=r.concat([{}]);c.setProperty(i,g)},onRemoveEntry:function(t){const n=t.getSource();const e=n.getParent();const o=e.getParent();const s=o.getParent();const c=s.getItems();const i=c.findIndex(function(t){return t==o});const r=s.getBinding("items");const g=r.getModel();const a=r.getPath();const f=g.getProperty(a);const u=f;u.splice(i,1);g.setProperty(a,u);this.onConfigChange()},fetchAvatar:async function(t){if(t){const n=await this._getUserInfo(t);if(n){const t="profile_pic_content";const e=n[t];return e}}},fetchFullName:async function(t){if(t){const n=await this._getUserInfo(t);if(n){const t="full_name";const e=n[t];return e}}},_getUserInfo:async function(t){const n=this.getModel("ig_user_info");const e=`/${t}`;var o=n.getProperty(e);if(o){return o}else{o=await this._fetchUserInfo(t);n.setProperty(e,o);return o}},_fetchUserInfo:async function(t){const n=await fetch(`${this.API_BASE_URL}/get-user-info/${t}`,{method:"GET"});if(n.ok){const t=await n.json();return t}else{return{}}}})});
},
	"com/perezjquim/iglivemode/pwa/controller/Home.controller.js":function(){sap.ui.define(["./util/BaseController","sap/ui/core/Fragment"],function(t,e){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.Home",{onPressEnableLive:function(t){this._executeAction("enable-live")},onPressDisableLive:function(t){this._executeAction("disable-live")},_executeAction:function(t){this.setBusy(true);this._sEndpoint=t;const o=this.getView();e.load({name:"com.perezjquim.iglivemode.pwa.view.fragment.ActionPrompt",controller:this}).then(function(t){this.setBusy(false);o.addDependent(t);t.open();this._oPromptDialog=t;return t}.bind(this))},onConfirmAction:function(){this.setBusy(true);const t=this.getModel("config");const e=t.getData();const o=this.getModel("prompt");const i=o.getData();const s={...e,...i};const n=JSON.stringify(s);if(e&&i&&n){fetch(`${this.API_BASE_URL}/${this._sEndpoint}`,{method:"POST",body:n}).then(t=>{if(t.ok){const t=this.getText("action_success");this.toast(t);this._oPromptDialog.close()}else{const t=this.getText("action_error");this.toast(t)}}).catch(()=>{const t=this.getText("action_error");this.toast(t)}).finally(()=>{this.setBusy(false)})}else{this.setBusy(false);const t=this.getText("incomplete_data");this.toast(t)}},onCancelAction:function(t){const e=t.getSource();const o=e.getParent();o.close()},onBeforeOpenPromptDialog:function(t){this.clearModel("prompt")},onAfterClosePromptDialog:function(t){this.clearModel("prompt")}})});
},
	"com/perezjquim/iglivemode/pwa/controller/util/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/ui/core/BusyIndicator","sap/m/MessageToast"],function(t,e,o,n){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.util.BaseController",{API_BASE_URL:"https://perezjquim-ig-live-mode.herokuapp.com",toast:function(t){n.show(t)},setBusy:function(t){if(t){o.show(0)}else{o.hide()}},getModel:function(t){const e=this.getOwnerComponent();const o=e.getModel(t);return o},attachPatternMatched(t,e){const o=this.getOwnerComponent();const n=o.getRouter();const s=n.getRoute(t);s.attachPatternMatched(e)},getConfig:function(t){const e=this.getModel("config");const o=e.getProperty(`/${t}`);return o},navTo:function(t,e,o){const n=this.getOwnerComponent();const s=n.getRouter();return s.navTo(t,e,o)},getText:function(t){const e=this.getModel("i18n");const o=e.getResourceBundle();const n=o.getText(t);return n},navBack:function(){const t=e.getInstance();const o=t.getPreviousHash();if(o){window.history.go(-1)}else{this.navTo("Home",{},true)}},getStorage:function(){return window.localStorage},clearModel:function(t){const e=this.getModel(t);const o=e.getData();for(var n in o){o[n]=""}e.setData(o)}})});
},
	"com/perezjquim/iglivemode/pwa/controller/util/SWHelper.js":function(){sap.ui.define(["sap/ui/base/Object"],function(e){return e.extend("com.perezjquim.iglivemode.pwa.controller.util.SWHelper",{_oController:null,constructor:function(e){this._oController=e},init:function(){this._cleanup();this._registerSW();window.addEventListener("beforeunload",this._cleanup.bind(this))},_registerSW:function(){if(navigator.serviceWorker){navigator.serviceWorker.register("/sw.js")}},_cleanup:function(){if(navigator.serviceWorker){navigator.serviceWorker.getRegistrations().then(function(e){for(let r of e){r.unregister()}})}}})});
},
	"com/perezjquim/iglivemode/pwa/i18n/i18n.properties":'appTitle=IG Live Mode\nappDescription=IG Live Mode\n\nenable_live=Enable Live Mode\ndisable_live=Disable Live Mode\n\nHome=Home\n\nConfig=Config\nuser=IG User\npw=IG Password\ngeneral_blacklist=General blacklist \ngeneral_blacklist_tip=IG followers blocked in general\nlive_whitelist=Live whitelist\nlive_whitelist_tip=IG followers allowed to see my IG lives\n\nincomplete_data=Incomplete data!\n\nconfirm=Confirm\ncancel=Cancel\n\naction_success=Done!\naction_error=Error!\n\nupdating=Update available! Reloading...\n\n',
	"com/perezjquim/iglivemode/pwa/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"com.perezjquim.iglivemode.pwa","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{}},"sap.ui":{"technology":"UI5","icons":{"icon":"images/icon.png","favIcon":"images/icon.png","phone":"images/icon.png","phone@2":"images/icon.png","tablet":"images/icon.png","tablet@2":"images/icon.png"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"com.perezjquim.iglivemode.pwa.view.App","type":"XML","async":true},"dependencies":{"minUI5Version":"1.52.16","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.perezjquim.iglivemode.pwa.i18n.i18n"}},"misc":{"type":"sap.ui.model.json.JSONModel","uri":"model/dummy.json"},"config":{"type":"sap.ui.model.json.JSONModel","uri":"model/config.json"},"prompt":{"type":"sap.ui.model.json.JSONModel","uri":"model/prompt.json"},"navigation":{"type":"sap.ui.model.json.JSONModel","uri":"model/navigation.json"},"ig_user_info":{"type":"sap.ui.model.json.JSONModel"}},"resources":{},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"controlId":"app","viewPath":"com.perezjquim.iglivemode.pwa.view","controlAggregation":"pages"},"routes":[{"name":"Home","pattern":"","target":["Home"]},{"name":"Config","pattern":"Config","target":["Config"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"Home"},"Config":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"Config"}}}}}',
	"com/perezjquim/iglivemode/pwa/sw.js":function(){self.addEventListener("fetch",function(e){});
},
	"com/perezjquim/iglivemode/pwa/view/App.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.App"\n    xmlns="sap.m"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:tnt="sap.tnt"><tnt:ToolPage><tnt:header><f:ShellBar \n            \thomeIcon="./images/icon.png" \n            \thomeIconPressed="onHomeButtonPress" \n                showMenuButton="true"                 \n            \tmenuButtonPressed="onMenuButtonPress" \n                showNavButton="true"\n                navButtonPressed="onNavButtonPress"\n            \ttitle="{i18n>appTitle}"/></tnt:header><tnt:sideContent><tnt:SideNavigation \n            \texpanded="false" \n            \titemSelect="onNavigationItemSelect" \n            \tselectedKey="{navigation>/selected}"><tnt:NavigationList \n                \titems="{navigation>/items}"><tnt:NavigationListItem \n                    \ticon="{navigation>icon}" \n                    \tkey="{navigation>key}" \n                    \ttext="{ path: \'navigation>key\', formatter: \'.getText\' }"/></tnt:NavigationList></tnt:SideNavigation></tnt:sideContent><tnt:mainContents><App \n            \tid="app"/></tnt:mainContents></tnt:ToolPage></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/Config.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.Config" \n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"><Page \n        title="{i18n>Config}"><f:SimpleForm \n            editable="true"><f:content><Label \n                    text="{i18n>user}" /><Input\n                    value="{config>/user}"/><Label \n                    text="{i18n>general_blacklist}" /><Table\n                    items="{config>/general_blacklist}"><headerToolbar><OverflowToolbar><content><core:Icon\n                                    src="sap-icon://private"\n                                    color="Negative"/><ObjectStatus\n                                    state="Error"\n                                    text="{i18n>general_blacklist_tip}"/><ToolbarSpacer /><Button\n                                    icon="sap-icon://add"\n                                    type="Accept"\n                                    press="onAddEntry" /></content></OverflowToolbar></headerToolbar><columns><Column><Label text="{i18n>user}" /></Column></columns><items><ColumnListItem><cells><HBox\n                                    justifyContent="SpaceAround"><Avatar \n                                        busyIndicatorDelay="0"\n                                        src="{ path: \'config>user_name\', formatter: \'.fetchAvatar\' }"\n                                        displaySize="S"\n                                        showBorder="true" /><Input \n                                        width="8rem"\n                                        value="{config>user_name}"/><Text \n                                        busyIndicatorDelay="0"\n                                        width="3rem"                      \n                                        text="{ path: \'config>user_name\', formatter: \'.fetchFullName\' }"/><Button\n                                        icon="sap-icon://delete"\n                                        type="Reject"\n                                        press="onRemoveEntry"/></HBox></cells></ColumnListItem></items></Table><Label \n                    text="{i18n>live_whitelist}" /><Table\n                    items="{config>/live_whitelist}"><headerToolbar><OverflowToolbar><content><core:Icon\n                                    src="sap-icon://role"\n                                    color="Positive"/><ObjectStatus\n                                    state="Success"\n                                    text="{i18n>live_whitelist_tip}"/><ToolbarSpacer /><Button\n                                    icon="sap-icon://add"\n                                    type="Accept"\n                                    press="onAddEntry" /></content></OverflowToolbar></headerToolbar><columns><Column><Label text="{i18n>user}" /></Column></columns><items><ColumnListItem><cells><HBox\n                                    justifyContent="SpaceAround"><Avatar \n                                        busyIndicatorDelay="0"\n                                        src="{ path: \'config>user_name\', formatter: \'.fetchAvatar\' }"\n                                        displaySize="S"\n                                        showBorder="true" /><Input \n                                        width="8rem"\n                                        value="{config>user_name}"/><Text \n                                        busyIndicatorDelay="0"\n                                        width="3rem"                                        \n                                        wrapping="false"                  \n                                        text="{ path: \'config>user_name\', formatter: \'.fetchFullName\' }"/><Button\n                                        icon="sap-icon://delete"\n                                        type="Reject"\n                                        press="onRemoveEntry"/></HBox></cells></ColumnListItem></items></Table></f:content></f:SimpleForm></Page></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/Home.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.Home" \n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc"><Page \n    \ttitle="{i18n>Home}"><f:SimpleForm \n        \teditable="false"><f:content><HBox justifyContent="SpaceBetween"><Button \n                    \ticon="sap-icon://play" \n                    \tpress="onPressEnableLive" \n                    \ttext="{i18n>enable_live}" \n                    \ttype="Accept" /><Button\n                    \ticon="sap-icon://stop" \n                    \tpress="onPressDisableLive" \n                    \ttext="{i18n>disable_live}" \n                    \ttype="Reject" /></HBox></f:content></f:SimpleForm></Page></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/fragment/ActionPrompt.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form"><Dialog\n\t\tbeforeOpen="onBeforeOpenPromptDialog"\n\t\tafterClose="onAfterClosePromptDialog"\n\t\ttitle="{i18n>confirm}"><content><f:SimpleForm \n\t\t            editable="true"><f:content><Label \n\t\t                    text="{i18n>pw}"/><Input\n\t\t                    value="{prompt>/pw}"\n\t\t                    type="Password"/></f:content></f:SimpleForm></content><beginButton><Button\n\t\t\t\ttext="{i18n>confirm}"\n\t\t\t\ttype="Emphasized"\n\t\t\t\tpress="onConfirmAction"/></beginButton><endButton><Button\n\t\t\t\ttext="{i18n>cancel}"\n\t\t\t\ttype="Reject"\n\t\t\t\tpress="onCancelAction"/></endButton></Dialog></core:FragmentDefinition>'
}});
