//@ui5-bundle com/perezjquim/iglivemode/pwa/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"com/perezjquim/iglivemode/pwa/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device"],function(i,e){"use strict";return i.extend("com.perezjquim.iglivemode.pwa.Component",{metadata:{manifest:"json"},init:function(){i.prototype.init.apply(this,arguments);this.getRouter().initialize()}})});
},
	"com/perezjquim/iglivemode/pwa/controller/App.controller.js":function(){sap.ui.define(["./util/BaseController","sap/ui/core/routing/History","sap/ui/core/Fragment","sap/ui/util/Storage","sap/ui/Device","./util/SWHelper"],function(t,e,o,s,n,i){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.App",{onInit:function(t){const e=new i(this);e.init();this._checkLogin()},onHomeButtonPress:function(t){const e=t.getSource();const o=e.getParent();const s=o.getSideContent();const n=s.getItem();const i=n.getItems();const c=i.find(function(t){const e=t.getKey();return e=="Home"});n.fireItemSelect({item:c})},onMenuButtonPress:function(t){const e=t.getSource();const o=e.getParent();const s=o.getSideExpanded();o.setSideExpanded(!s)},onNavigationItemSelect:function(t){const e=t.getParameter("item");const o=e.getKey();this.navTo(o);const s=n.system.phone;if(s){const e=t.getSource();const o=e.getParent();o.setSideExpanded(false)}},onNavButtonPress:function(t){this.navBack()},_checkLogin:function(){const t=Boolean(localStorage.getItem("ig_settings"));if(t){(async function(){this._fetchData()}).bind(this)()}else{this._askForLogin()}},_fetchData:function(){this._fetchUserInfo();this._fetchConfig()},_fetchUserInfo:async function(){this.setBusy(true);try{const t=await fetch(`${this.API_BASE_URL}/get-user-info`,{method:"GET",headers:this._getHeaders()});if(t.ok){const e=await t.json();const o=this.getModel("ig_user_info");o.setData(e)}}catch(t){console.warn(t);this.toast(t)}this.setBusy(false)},_fetchConfig:async function(){try{const t=await fetch(`${this.API_BASE_URL}/get-config`,{method:"GET",headers:this._getHeaders()});if(t.ok){const e=await t.json();const o=this.getModel("config");o.setData(e);const s=this._copy(e);const n=this.getModel("config_draft");n.setData(s);this._listenConfigChanges()}}catch(t){console.warn(t);this.toast(t)}const t=this.getModel("misc");t.setProperty("/is_config_loaded",true)},_askForLogin:function(){if(!this._oLoginPromptDialog){this.setBusy(true);o.load({name:"com.perezjquim.iglivemode.pwa.view.fragment.LoginPrompt",controller:this}).then(function(t){this.setBusy(false);const e=this.getView();e.addDependent(t);t.open();this._oLoginPromptDialog=t}.bind(this))}else{this._oLoginPromptDialog.open()}},onBeforeOpenLoginPrompt:function(t){this.clearModel("login_prompt")},onAfterCloseLoginPrompt:function(t){this.clearModel("login_prompt")},onConfirmLogin:async function(t){this.setBusy(true);const e=this.getModel("login_prompt");const o=e.getData();const s=o["user"];const n=o["pw"];const i="Basic "+btoa(s+":"+n);if(o&&i){try{const t=await fetch(`${this.API_BASE_URL}/login`,{method:"POST",headers:{Authorization:i}});if(t.ok){const e=await t.json();const o=JSON.stringify(e);localStorage.setItem("ig_settings",o);this._fetchData();const s=this.getText("action_success");this.toast(s);this._oLoginPromptDialog.close()}else{const t=this.getText("action_error");this.toast(t)}}catch(t){console.warn(t);this.toast(t)}this.setBusy(false)}else{this.setBusy(false);const t=this.getText("incomplete_data");this.toast(t)}},dummyEscapeHandler:function(t){t.reject()},onAvatarPress:function(t){const e=t.getSource();if(!this._oUserDetailsPopover){this.setBusy(true);o.load({name:"com.perezjquim.iglivemode.pwa.view.fragment.UserDetailsPopover",controller:this}).then(function(t){this.setBusy(false);const o=this.getView();o.addDependent(t);t.openBy(e);this._oUserDetailsPopover=t}.bind(this))}else{if(this._oUserDetailsPopover.isOpen()){this._oUserDetailsPopover.close()}else{this._oUserDetailsPopover.openBy(e)}}},onLogoff:function(t){this.setBusy(true);localStorage.removeItem("ig_settings");location.reload()}})});
},
	"com/perezjquim/iglivemode/pwa/controller/Config.controller.js":function(){sap.ui.define(["./util/BaseController","sap/m/MessageBox","sap/ui/core/Fragment","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(t,e,s,n,o){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.Config",{onSaveConfig:async function(t){this.setBusy(true);const e=this.getModel("config_draft");const s=e.getData();const n=JSON.stringify(s);try{const t=await fetch(`${this.API_BASE_URL}/update-config`,{method:"POST",headers:this._getHeaders(),body:n});if(t.ok){const e=await t.json();const s=this.getModel("config");s.setData(this._copy(e));this._listenConfigChanges();const n=this.getModel("misc");n.setProperty("/is_config_changed",false);const o=this.getText("action_success");this.toast(o)}else{const t=this.getText("action_error");this.toast(t)}}catch(t){console.warn(t);this.toast(t)}this.setBusy(false)},onDiscardConfig:function(t){this.setBusy(true);const e=this.getModel("config");const s=e.getData();const n=this.getModel("config_draft");n.setData(this._copy(s));this._listenConfigChanges();const o=this.getModel("misc");o.setProperty("/is_config_changed",false);this.setBusy(false)},onFollowerSearch:function(t){const e=[];const s=t.getParameter("newValue");if(s){const t=new n({filters:[new n("full_name",o.Contains,s),new n("username",o.Contains,s)],and:true});e.push(t)}const i=t.getSource();const a=i.getParent();const c=a.getParent();const r=c.getBinding("items");r.filter(e,"Application")}})});
},
	"com/perezjquim/iglivemode/pwa/controller/Home.controller.js":function(){sap.ui.define(["./util/BaseController"],function(e){"use strict";return e.extend("com.perezjquim.iglivemode.pwa.controller.Home",{})});
},
	"com/perezjquim/iglivemode/pwa/controller/ToggleLiveMode.controller.js":function(){sap.ui.define(["./util/BaseController","sap/ui/core/Fragment"],function(e,t){"use strict";return e.extend("com.perezjquim.iglivemode.pwa.controller.ToggleLiveMode",{onPressEnableLive:function(e){this._executeAction("enable-live")},onPressDisableLive:function(e){this._executeAction("disable-live")},_executeAction:function(e){this.setBusy(true);fetch(`${this.API_BASE_URL}/${e}`,{method:"POST",headers:this._getHeaders()}).then(e=>{if(e.ok){const e=this.getText("action_success");this.toast(e)}else{const e=this.getText("action_error");this.toast(e)}}).catch(()=>{const e=this.getText("action_error");this.toast(e)}).finally(()=>{this.setBusy(false)})}})});
},
	"com/perezjquim/iglivemode/pwa/controller/UserInfo.controller.js":function(){sap.ui.define(["./util/BaseController"],function(e){"use strict";return e.extend("com.perezjquim.iglivemode.pwa.controller.Home",{})});
},
	"com/perezjquim/iglivemode/pwa/controller/util/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/ui/core/BusyIndicator","sap/m/MessageToast"],function(t,e,n,o){"use strict";return t.extend("com.perezjquim.iglivemode.pwa.controller.util.BaseController",{API_BASE_URL:"https://perezjquim-ig-live-mode.herokuapp.com",toast:function(t){o.show(t)},setBusy:function(t){if(t){n.show(0)}else{n.hide()}},getModel:function(t){const e=this.getOwnerComponent();const n=e.getModel(t);return n},attachPatternMatched(t,e){const n=this.getOwnerComponent();const o=n.getRouter();const s=o.getRoute(t);s.attachPatternMatched(e)},navTo:function(t,e,n){const o=this.getOwnerComponent();const s=o.getRouter();s.navTo(t,e,n)},getText:function(t){const e=this.getModel("i18n");const n=e.getResourceBundle();const o=n.getText(t);return o},navBack:function(){const t=e.getInstance();const n=t.getPreviousHash();if(n){window.history.go(-1)}else{this.navTo("Home",{},true)}},clearModel:function(t){const e=this.getModel(t);const n=e.getData();for(var o in n){n[o]=""}e.setData(n)},_getHeaders:function(){const t=new Headers;const e=encodeURIComponent(localStorage.getItem("ig_settings"));t.append("ig_settings",e);return t},_listenConfigChanges:function(){const t=this.getModel("misc");const e=this.getModel("config_draft");e.attachEventOnce("propertyChange",function(e){t.setProperty("/is_config_changed",true)})},_copy:function(t){return JSON.parse(JSON.stringify(t))}})});
},
	"com/perezjquim/iglivemode/pwa/controller/util/SWHelper.js":function(){sap.ui.define(["sap/ui/base/Object"],function(e){return e.extend("com.perezjquim.iglivemode.pwa.controller.util.SWHelper",{_oController:null,constructor:function(e){this._oController=e},init:function(){this._cleanup();this._registerSW();window.addEventListener("beforeunload",this._cleanup.bind(this))},_registerSW:function(){if(navigator.serviceWorker){navigator.serviceWorker.register("/sw.js")}},_cleanup:function(){if(navigator.serviceWorker){navigator.serviceWorker.getRegistrations().then(function(e){for(let r of e){r.unregister()}})}}})});
},
	"com/perezjquim/iglivemode/pwa/i18n/i18n.properties":'appTitle=IG Live Mode\nappDescription=IG Live Mode\n\nenable_live=Enable Live Mode\ndisable_live=Disable Live Mode\n\nHome=Home\n\nToggleLiveMode=Enable/Disable Live Mode\n\nConfig=Configuration\nuser=IG User\npw=IG Password\nfollowers=IG Followers\ngenerally_blacklisted=None\nmode=IG Mode\nlive_blacklisted=IG Stories only\nlive_whitelisted=IG Stories + IG Lives\n\nincomplete_data=Incomplete data!\n\nconfirm=Confirm\ncancel=Cancel\n \naction_success=Done!\naction_error=Error!\n\nupdating=Update available! Reloading...\n\nconfirm_remove_user=Are you sure you want to remove this user?\nuser_removed=User removed!\n\nlogin=Login\nlogoff=Logoff\nuser_details=IG User Details\n\nUserInfo=User information\n\n',
	"com/perezjquim/iglivemode/pwa/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"com.perezjquim.iglivemode.pwa","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{}},"sap.ui":{"technology":"UI5","icons":{"icon":"images/icon.png","favIcon":"images/icon.png","phone":"images/icon.png","phone@2":"images/icon.png","tablet":"images/icon.png","tablet@2":"images/icon.png"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"com.perezjquim.iglivemode.pwa.view.App","type":"XML","async":true},"dependencies":{"minUI5Version":"1.52.16","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.perezjquim.iglivemode.pwa.i18n.i18n"}},"navigation":{"type":"sap.ui.model.json.JSONModel","uri":"model/navigation.json"},"misc":{"type":"sap.ui.model.json.JSONModel","uri":"model/misc.json"},"ig_user_info":{"type":"sap.ui.model.json.JSONModel"},"config":{"type":"sap.ui.model.json.JSONModel"},"config_draft":{"type":"sap.ui.model.json.JSONModel"},"login_prompt":{"type":"sap.ui.model.json.JSONModel"},"ig_modes":{"type":"sap.ui.model.json.JSONModel","uri":"https://perezjquim-ig-live-mode.herokuapp.com/get-modes"}},"resources":{"css":["css/extra.css"]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"controlId":"app","viewPath":"com.perezjquim.iglivemode.pwa.view","controlAggregation":"pages"},"routes":[{"name":"Home","pattern":"","target":["Home"]},{"name":"Config","pattern":"Config","target":["Config"]},{"name":"ToggleLiveMode","pattern":"ToggleLiveMode","target":["ToggleLiveMode"]},{"name":"UserInfo","pattern":"UserInfo","target":["UserInfo"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"Home"},"Config":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"Config"},"ToggleLiveMode":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"ToggleLiveMode"},"UserInfo":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"UserInfo"}}}}}',
	"com/perezjquim/iglivemode/pwa/sw.js":function(){self.addEventListener("fetch",function(e){});
},
	"com/perezjquim/iglivemode/pwa/view/App.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.App"\n    xmlns="sap.m"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:tnt="sap.tnt"><tnt:ToolPage><tnt:header><f:ShellBar \n            \thomeIcon="./images/icon.png" \n            \thomeIconPressed="onHomeButtonPress" \n                showMenuButton="true"                 \n            \tmenuButtonPressed="onMenuButtonPress" \n                showNavButton="true"\n                navButtonPressed="onNavButtonPress"\n            \ttitle="{i18n>appTitle}"><f:profile><Avatar\n                            src="{ig_user_info>/profile_pic_content}"\n                            displaySize="S"\n                            showBorder="true"\n                            press="onAvatarPress"/></f:profile></f:ShellBar></tnt:header><tnt:sideContent><tnt:SideNavigation \n            \texpanded="false" \n            \titemSelect="onNavigationItemSelect" \n            \tselectedKey="{navigation>/selected}"><tnt:NavigationList \n                \titems="{navigation>/items}"><tnt:NavigationListItem \n                    \ticon="{navigation>icon}" \n                    \tkey="{navigation>key}" \n                    \ttext="{ path: \'navigation>key\', formatter: \'.getText\' }"/></tnt:NavigationList></tnt:SideNavigation></tnt:sideContent><tnt:mainContents><App \n            \tid="app"/></tnt:mainContents></tnt:ToolPage></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/Config.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.Config" \n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"><Page \n        title="{i18n>Config}"\n        floatingFooter="true"><f:SimpleForm \n            editable="true"><f:content><Label \n                    text="{i18n>followers}" /><Table\n                    fixedLayout="false"\n                    items="{config_draft>/followers_config}"\n                    growing="true"\n                    growingThreshold="500"\n                    busy="{= !${misc>/is_config_loaded} }"\n                    busyIndicatorDelay="0"><headerToolbar><Toolbar><SearchField liveChange="onFollowerSearch" width="100%" /></Toolbar></headerToolbar><columns><Column><Label text="{i18n>user}" /></Column><Column><Label /></Column><Column><Label text="{i18n>mode}"/></Column></columns><items><ColumnListItem><customData><core:CustomData key="z_ig_mode" value="{config_draft>ig_mode}" writeToDom="true"/></customData><cells><Avatar \n                                    src="{config_draft>profile_pic_content}"\n                                    displaySize="XS"\n                                    showBorder="true"\n                                    width="5vw" /><Text    \n                                    text="{= ${config_draft>full_name} || \'-\' }{= \'\\n\' }({config_draft>username})"\n                                    width="10vw"/><Select\n                                    forceSelection="true"\n                                    selectedKey="{config_draft>ig_mode}"\n                                    items="{ path: \'ig_modes>/\', templateShareable : true }"><core:Item key="{ig_modes>key}" text="{ig_modes>text}" /></Select></cells></ColumnListItem></items></Table></f:content></f:SimpleForm><footer><OverflowToolbar visible="{misc>/is_config_changed}"><ToolbarSpacer/><Button type="Emphasized" text="Save" press="onSaveConfig" /><Button type="Reject" text="Cancel" press="onDiscardConfig" /></OverflowToolbar></footer></Page></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/Home.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.Home" \n    xmlns="sap.m"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc"><Page \n    \ttitle="{i18n>Home}"><f:GridContainer  \n            items="{ \n                path: \'navigation>/items\', \n                filters:\n                [\n                    { path: \'key\', operator: \'NE\', value1: \'Home\' }\n                ]\n            }"><f:items><GenericTile \n                    class="sapUiSmallMargin"\n                    header="{ path: \'navigation>key\', formatter: \'.getText\' }"\n                    press=".navTo(${ path: \'navigation>key\' })"><layoutData><f:GridContainerItemLayoutData minRows="2" columns="2" /></layoutData><TileContent><ImageContent src="{navigation>icon}" /></TileContent></GenericTile></f:items></f:GridContainer></Page></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/ToggleLiveMode.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.ToggleLiveMode" \n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc"><Page \n    \ttitle="{i18n>ToggleLiveMode}"><f:SimpleForm \n        \teditable="false"><f:content><HBox justifyContent="SpaceBetween"><Button \n                    \ticon="sap-icon://play" \n                    \tpress="onPressEnableLive" \n                    \ttext="{i18n>enable_live}" \n                    \ttype="Accept" /><Button\n                    \ticon="sap-icon://stop" \n                    \tpress="onPressDisableLive" \n                    \ttext="{i18n>disable_live}" \n                    \ttype="Reject" /></HBox></f:content></f:SimpleForm></Page></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/UserInfo.view.xml":'<mvc:View \n    controllerName="com.perezjquim.iglivemode.pwa.controller.UserInfo" \n    xmlns="sap.m"\n    xmlns:code="sap.ui.codeeditor"\n    xmlns:mvc="sap.ui.core.mvc"><Page \n    \ttitle="{i18n>UserInfo}"><code:CodeEditor\n            type="json"\n            editable="false"\n            value="{= JSON.stringify(${ig_user_info>/}, null, 4) }"\n            /></Page></mvc:View>',
	"com/perezjquim/iglivemode/pwa/view/fragment/LoginPrompt.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form"><Dialog\n\t\tbeforeOpen="onBeforeOpenLoginPrompt"\n\t\tafterClose="onAfterCloseLoginPrompt"\n\t\tescapeHandler=".dummyEscapeHandler"\n\t\ttitle="{i18n>login}"><content><VBox fitContainer="true" justifyContent="Center" alignItems="Center" alignContent="Center"><items><Input width="80vw" placeholder="{i18n>user}" value="{login_prompt>/user}"/><Input width="80vw" placeholder="{i18n>pw}" type="Password" value="{login_prompt>/pw}"/><Button\n\t\t\t\t\t\twidth="80vw"\n\t\t\t\t\t\ttext="{i18n>login}"\n\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\tpress="onConfirmLogin"/></items></VBox></content></Dialog></core:FragmentDefinition>',
	"com/perezjquim/iglivemode/pwa/view/fragment/UserDetailsPopover.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><Popover\n\t\ttitle="{Name}"\n\t\tplacement="Bottom" ><customHeader><OverflowToolbar><Title \n\t\t\t\t\ttext="{i18n>user_details}"/><ToolbarSpacer/><Button \n\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\ttext="{i18n>logoff}"\n\t\t\t\t\tpress="onLogoff"/></OverflowToolbar></customHeader><content><VBox\n\t\t\t\talignItems="Center"\n\t\t\t\talignContent="Center"\n\t\t\t\tjustifyContent="SpaceBetween"><items><Avatar\n\t\t\t\t\t\tclass="sapUiTinyMargin"\n\t                            \t\tsrc="{ig_user_info>/profile_pic_content}"\n\t\t                            \tdisplaySize="L"\n\t\t                            \tshowBorder="true"/><Title \n\t\t\t\t\t\ttext="{ig_user_info>/full_name}" /><Text \n\t\t\t\t\t\tclass="sapUiTinyMargin"\n\t\t\t\t\t\ttext="({ig_user_info>/username})" /></items></VBox></content></Popover></core:FragmentDefinition>'
}});
