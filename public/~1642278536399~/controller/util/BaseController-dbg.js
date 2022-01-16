sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast"
], function(Controller, History, BusyIndicator, MessageToast) {
	"use strict";
	return Controller.extend("com.perezjquim.iglivemode.pwa.controller.util.BaseController", {

		API_BASE_URL: "https://perezjquim-ig-live-mode.herokuapp.com",

		toast: function(sText) {
			MessageToast.show(sText);
		},
		setBusy: function(bBusy) {
			if (bBusy) {
				BusyIndicator.show(0);
			} else {
				BusyIndicator.hide();
			}
		},
		getModel: function(sName) {
			const oComponent = this.getOwnerComponent();
			const oModel = oComponent.getModel(sName);
			return oModel;
		},
		attachPatternMatched(sRoute, fFunction) {
			const oComponent = this.getOwnerComponent();
			const oRouter = oComponent.getRouter();
			const oRoute = oRouter.getRoute(sRoute);
			oRoute.attachPatternMatched(fFunction);
		},
		navTo: function(sRoute, oParams, bReplace) {
			const oComponent = this.getOwnerComponent();
			const oRouter = oComponent.getRouter();
			oRouter.navTo(sRoute, oParams, bReplace);
		},
		getText: function(sKey) {
			const oI18n = this.getModel("i18n");
			const oBundle = oI18n.getResourceBundle();
			const sText = oBundle.getText(sKey);
			return sText;
		},
		navBack: function() {
			const oHistory = History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash) {
				window.history.go(-1);
			} else {
				this.navTo("Home", {}, true);
			}
		},
		clearModel: function(sName) {
			const oModel = this.getModel(sName);
			const oData = oModel.getData();
			for (var sKey in oData) {
				oData[sKey] = "";
			}
			oModel.setData(oData);
		},
		_getHeaders: function() {
			const oHeaders = new Headers();

			const sIGSettings = localStorage.getItem("ig_settings");

			oHeaders.append("ig_settings", sIGSettings);

			return oHeaders;
		},
		_listenConfigChanges: function() {
			const oMiscModel = this.getModel("misc");
			const oConfigDraftModel = this.getModel("config_draft");

			oConfigDraftModel.attachEventOnce("propertyChange", function(oEvent) {
				oMiscModel.setProperty("/is_config_changed", true);
			});
		},
		_copy: function(oData) {
			return JSON.parse(JSON.stringify(oData));
		}
	});
});