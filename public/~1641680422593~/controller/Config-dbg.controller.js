sap.ui.define([
	"./util/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function(BaseController, MessageBox, Fragment) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.Config", {

		getGeneralBlacklist: function(oFollowers) {
			const oConfigModel = this.getModel("config");
			const oGeneralBlacklist = oConfigModel.getProperty("/general_blacklist");

			return oFollowers.filter(function(oFollower) {
				return oGeneralBlacklist.includes(oFollower["username"]);
			})
		},

		getLiveWhitelist: function(oFollowers) {
			const oConfigModel = this.getModel("config");
			const oLiveWhitelist = oConfigModel.getProperty("/live_whitelist");

			return oFollowers.filter(function(oFollower) {
				return oLiveWhitelist.includes(oFollower["username"]);
			})
		},

		onToggleUserInGeneralBlacklist: function(oEvent) {
			this._toggleUser(oEvent, "/general_blacklist");
		},

		onToggleUserInLiveWhitelist: function(oEvent) {
			this._toggleUser(oEvent, "/live_whitelist");
		},

		_toggleUser: function(oEvent, sListPath) {
			const oCheckBox = oEvent.getSource();
			const oContext = oCheckBox.getBindingContext("ig_user_info");

			const sUsername = oContext.getProperty("username");

			const oConfigModel = this.getModel("config");
			var oList = oConfigModel.getProperty(sListPath);

			if (oList.includes(sUsername)) {
				oList.splice(oList.indexOf(sUsername), 1);
			} else {
				oList.push(sUsername);
			}

			oConfigModel.setProperty(sListPath, oList);

			this._saveConfig();
		},

		_saveConfig: function() {
			this.setBusy(true);

			const oModel = this.getModel("config");
			const oConfig = oModel.getData();
			const sConfig = JSON.stringify(oConfig);

			const oStorage = this.getStorage();
			oStorage.setItem("config", sConfig);

			this.setBusy(false);
		}
	});
});