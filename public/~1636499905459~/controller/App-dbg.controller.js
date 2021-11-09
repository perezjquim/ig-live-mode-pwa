sap.ui.define([
	"./util/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/util/Storage",
	"sap/ui/Device",
	"./util/SWHelper"
], function(BaseController, History, Fragment, Storage, Device, SWHelper) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.App", {

		onInit: function(oEvent) {
			const oSWHelper = new SWHelper(this);
			oSWHelper.init();

			this._reloadConfig();
			this._checkLogin();
		},

		onHomeButtonPress: function(oEvent) {
			const oBar = oEvent.getSource();
			const oToolPage = oBar.getParent();
			const oSideContent = oToolPage.getSideContent();
			const oNavigationList = oSideContent.getItem();
			const oNavigationItems = oNavigationList.getItems();
			const oHomeItem = oNavigationItems.find(function(oItem) {
				const sKey = oItem.getKey();
				return sKey == "Home";
			});
			oNavigationList.fireItemSelect({
				item: oHomeItem
			});
		},

		onMenuButtonPress: function(oEvent) {
			const oBar = oEvent.getSource();
			const oToolPage = oBar.getParent();
			const bIsExpanded = oToolPage.getSideExpanded();
			oToolPage.setSideExpanded(!bIsExpanded);
		},

		onNavigationItemSelect: function(oEvent) {
			const oSelectedItem = oEvent.getParameter("item");
			const sKey = oSelectedItem.getKey();
			this.navTo(sKey);

			const bIsPhone = Device.system.phone;
			if (bIsPhone) {
				const oSideNavigation = oEvent.getSource();
				const oToolPage = oSideNavigation.getParent();
				oToolPage.setSideExpanded(false);
			}
		},

		onNavButtonPress: function(oEvent) {
			this.navBack();
		},

		_reloadConfig: function() {
			const oStorage = this.getStorage();
			const sConfig = oStorage.getItem("config");
			if (sConfig) {
				const oConfig = JSON.parse(sConfig);
				const oModel = this.getModel("config");
				oModel.setData(oConfig);
			}
		},

		_checkLogin: function() {
			const oModel = this.getModel("config");
			const bIsLoggedIn = localStorage.getItem("is_logged_in") == "true";

			if (!bIsLoggedIn) {
				this._askForLogin();
			}
		},

		_askForLogin: function() {
			if (!this._oLoginPromptDialog) {
				this.setBusy(true);
				Fragment.load({
					name: "com.perezjquim.iglivemode.pwa.view.fragment.LoginPrompt",
					controller: this
				}).then(function(oDialog) {
					this.setBusy(false);

					const oView = this.getView();
					oView.addDependent(oDialog);
					oDialog.open();

					this._oLoginPromptDialog = oDialog;
				}.bind(this));
			} else {
				this._oLoginPromptDialog.open();
			}
		},

		onBeforeOpenLoginPrompt: function(oEvent) {
			this.clearModel("login_prompt");
		},

		onAfterCloseLoginPrompt: function(oEvent) {
			this.clearModel("login_prompt");
		},

		onConfirmLogin: function(oEvent) {
			this.setBusy(true);

			const oLoginPromptModel = this.getModel("login_prompt");
			const oLoginPromptData = oLoginPromptModel.getData();

			const oBody = {
				auth: oLoginPromptData
			};
			const sBody = JSON.stringify(oBody);

			if (oLoginPromptData && sBody) {

				fetch(`${this.API_BASE_URL}/login`, {
					method: "POST",
					body: sBody
				}).then((oResponse) => {
					if (oResponse.ok) {
						localStorage.setItem("is_logged_in", "true");
						const sText = this.getText("action_success");
						this.toast(sText);
						this._oLoginPromptDialog.close();
					} else {
						const sText = this.getText("action_error");
						this.toast(sText);
					}
				}).catch(() => {
					const sText = this.getText("action_error");
					this.toast(sText);
				}).finally(() => {
					this.setBusy(false);
				});

			} else {
				this.setBusy(false);

				const sText = this.getText("incomplete_data");
				this.toast(sText);
			}
		},

		dummyEscapeHandler: function(oPromise) {
			oPromise.resolve();
		}

	});
});