sap.ui.define(["./util/BaseController"],function(t){"use strict";return t.extend("com.perezjquim.ytc.pwa.controller.Home",{API_BASE_URL:"https://perezjquim-ytc.herokuapp.com",onPressDownload:function(){this.setBusy(true);const t=this.getModel("config");const e=t.getData();const o=new URLSearchParams(e);const s=o.toString();const n=`${this.API_BASE_URL}/crop-video?${s}`;window.open(n);this.setBusy(false)}})});