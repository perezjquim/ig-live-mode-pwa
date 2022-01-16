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

		_checkLogin: function() {
			const bIsLoggedIn = Boolean(localStorage.getItem("ig_settings"));

			if (bIsLoggedIn) {
				(async function() {
					this._fetchData();
				}.bind(this))();
			} else {
				this._askForLogin();
			}
		},

		_fetchData: function() {
			this._fetchUserInfo();
			this._fetchConfig();
		},

		_fetchUserInfo: async function() {
			this.setBusy(true);

			try {
				const oResponse = await fetch(`${this.API_BASE_URL}/get-user-info`, {
					method: 'GET',
					headers: this._getHeaders()
				});
				if (oResponse.ok) {
					const oUserInfo = await oResponse.json();

					const oUserInfoModel = this.getModel("ig_user_info");
					oUserInfoModel.setData(oUserInfo);
				}
			} catch (oException) {
				console.warn(oException);
				this.toast(oException);
			}

			this.setBusy(false);
		},

		_fetchConfig: async function() {
			try {
				const oResponse = await fetch(`${this.API_BASE_URL}/get-config`, {
					method: 'GET',
					headers: this._getHeaders()
				});
				if (oResponse.ok) {
					const oConfig = await oResponse.json();
					const oConfigModel = this.getModel("config");
					oConfigModel.setData(oConfig);

					const oConfigDraft = this._copy(oConfig);
					const oConfigDraftModel = this.getModel("config_draft");
					oConfigDraftModel.setData(oConfigDraft);

					this._listenConfigChanges();
				}

			} catch (oException) {
				console.warn(oException);
				this.toast(oException);
			}

			const oMiscModel = this.getModel("misc");
			oMiscModel.setProperty("/is_config_loaded", true);
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

		onConfirmLogin: async function(oEvent) {
			this.setBusy(true);

			const oLoginPromptModel = this.getModel("login_prompt");
			const oLoginPromptData = oLoginPromptModel.getData();

			const sUsername = oLoginPromptData["user"];
			const sPassword = oLoginPromptData["pw"];

			const sAuth = "Basic " + btoa(sUsername + ":" + sPassword);

			if (oLoginPromptData && sAuth) {

				try {
					const oResponse = await fetch(`${this.API_BASE_URL}/login`, {
						method: "POST",
						headers: {
							"Authorization": sAuth
						}
					});
					if (oResponse.ok) {
						const oIGSettings = await oResponse.json();
						const sIGSettings = JSON.stringify(oIGSettings);

						localStorage.setItem("ig_settings", sIGSettings);

						this._fetchData();

						const sText = this.getText("action_success");
						this.toast(sText);

						this._oLoginPromptDialog.close();
					} else {
						const sText = this.getText("action_error");
						this.toast(sText);
					}

				} catch (oException) {
					console.warn(oException);
					this.toast(oException);
				}

				this.setBusy(false);

			} else {
				this.setBusy(false);

				const sText = this.getText("incomplete_data");
				this.toast(sText);
			}
		},

		dummyEscapeHandler: function(oPromise) {
			oPromise.reject();
		},

		onAvatarPress: function(oEvent) {
			const oButton = oEvent.getSource();
			if (!this._oUserDetailsPopover) {
				this.setBusy(true);
				Fragment.load({
					name: "com.perezjquim.iglivemode.pwa.view.fragment.UserDetailsPopover",
					controller: this
				}).then(function(oPopover) {
					this.setBusy(false);

					const oView = this.getView();
					oView.addDependent(oPopover);
					oPopover.openBy(oButton);

					this._oUserDetailsPopover = oPopover;
				}.bind(this));
			} else {
				if (this._oUserDetailsPopover.isOpen()) {
					this._oUserDetailsPopover.close();
				} else {
					this._oUserDetailsPopover.openBy(oButton);
				}
			}
		},

		onLogoff: function(oEvent) {
			this.setBusy(true);
			localStorage.removeItem("ig_settings");
			location.reload();
		}
	});
});