sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast"
], function(Controller, History, BusyIndicator, MessageToast) {
	"use strict";
	return Controller.extend("com.perezjquim.iglivemode.pwa.controller.util.BaseController", {

		_oFetchPromises: [],

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
		getConfig: function(sKey) {
			const oConfigModel = this.getModel("config");
			const oConfig = oConfigModel.getProperty(`/${sKey}`);
			return oConfig;
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
		getStorage: function() {
			return window.localStorage;
		},
		clearModel: function(sName) {
			const oModel = this.getModel(sName);
			const oData = oModel.getData();
			for (var sKey in oData) {
				oData[sKey] = "";
			}
			oModel.setData(oData);
		},


		fetchAvatar: async function(sUserName) {
			if (sUserName) {
				const oUserInfo = await this._getUserInfo(sUserName);
				if (oUserInfo) {
					const sAvatarUrlProperty = "profile_pic_content";
					const sAvatarUrl = oUserInfo[sAvatarUrlProperty];
					return sAvatarUrl;
				}
			}
		},

		fetchFullName: async function(sUserName) {
			if (sUserName) {
				const oUserInfo = await this._getUserInfo(sUserName);
				if (oUserInfo) {
					const sFullNameProperty = "full_name";
					const sFullName = oUserInfo[sFullNameProperty];
					return sFullName;
				}
			}
		},

		_getUserInfo: async function(sUserName) {
			const oUserInfoModel = this.getModel("ig_user_info");
			const sProperty = `/${sUserName}`;
			var oUserInfo = oUserInfoModel.getProperty(sProperty);
			if (oUserInfo) {
				return oUserInfo;
			} else {
				oUserInfo = await this._fetchUserInfo(sUserName);
				oUserInfoModel.setProperty(sProperty, oUserInfo);
				return oUserInfo;
			}
		},

		_fetchUserInfo: async function(sUserName) {
			if (!this._oFetchPromises[sUserName]) {
				this._oFetchPromises[sUserName] = fetch(`${this.API_BASE_URL}/get-user-info/${sUserName}`, {
					method: "GET"
				});
			}
			const oFetchPromise = this._oFetchPromises[sUserName];
			const oResponse = await oFetchPromise;
			if (oResponse.ok) {
				const oUserInfo = await oResponse.json();
				return oUserInfo;
			} else {
				return {};
			}
		}
	});
});