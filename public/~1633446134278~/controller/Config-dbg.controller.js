sap.ui.define([
	"./util/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function(BaseController, MessageBox, Fragment) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.Config", {
		onInit: function() {
			const oModel = this.getModel("config");
			oModel.attachPropertyChange(this.onConfigChange.bind(this));
		},

		onConfigChange: function() {
			this.setBusy(true);

			const oModel = this.getModel("config");
			const oConfig = oModel.getData();
			const sConfig = JSON.stringify(oConfig);

			const oStorage = this.getStorage();
			oStorage.setItem("config", sConfig);

			this.setBusy(false);
		},

		onAddEntry: function(oEvent) {
			const oSource = oEvent.getSource();

			this._oNewUserSource = oSource;

			if (!this._oNewUserPopover) {
				this.setBusy(true);

				const oView = this.getView();
				Fragment.load({
					name: "com.perezjquim.iglivemode.pwa.view.fragment.NewUserPopover",
					controller: this
				}).then(function(oPopover) {
					this.setBusy(false);
					oView.addDependent(oPopover);
					oPopover.openBy(oSource);
					this._oNewUserPopover = oPopover;
				}.bind(this));

			} else {

				if (this._oNewUserPopover.isOpen()) {
					this._oNewUserPopover.close();
				} else {
					this._oNewUserPopover.openBy(oSource);
				}
			}
		},

		onConfirmNewUser: function(oEvent) {
			const oModel = this.getModel("new_user_prompt");
			const sUserName = oModel.getProperty("/user_name");

			this._addEntry(this._oNewUserSource, sUserName);

			this._closePopover(oEvent);
		},

		onCancelNewUser: function(oEvent) {
			this._closePopover(oEvent);
		},

		_closePopover: function(oEvent) {
			const oButton = oEvent.getSource();
			const oToolbar = oButton.getParent();
			const oPopover = oToolbar.getParent();
			oPopover.close();
		},

		onBeforeOpenNewUserPopover: function(oEvent) {
			this.clearModel("new_user_prompt");
		},

		onAfterCloseNewUserPopover: function(oEvent) {
			this.clearModel("new_user_prompt");
		},

		_addEntry: function(oSource, sUserName) {
			const oToolbar = oSource.getParent();
			const oTable = oToolbar.getParent();
			const oBinding = oTable.getBinding("items");
			const oModel = oBinding.getModel();

			const sPath = oBinding.getPath();
			const oOldData = oModel.getProperty(sPath);
			const oNewData = oOldData.concat([{
				user_name: sUserName
			}]);

			oModel.setProperty(sPath, oNewData);
		},

		onRemoveEntry: function(oEvent) {
			const oRemoveSource = oEvent.getSource();

			const sConfirmText = this.getText("confirm_remove_user");
			MessageBox.confirm(sConfirmText, {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function(sAction) {
					if (sAction == MessageBox.Action.OK) {
						this._removeEntry(oRemoveSource);
						const sToastText = this.getText("user_removed");
						this.toast(sToastText);
					}
				}.bind(this)
			});
		},

		_removeEntry: function(oSource) {
			const oHBox = oSource.getParent();
			const oSelectedItem = oHBox.getParent();

			const oTable = oSelectedItem.getParent();
			const oItems = oTable.getItems();

			const iSelectedItemIndex = oItems.findIndex(function(oItem) {
				return oItem == oSelectedItem;
			});

			const oBinding = oTable.getBinding("items");
			const oModel = oBinding.getModel();

			const sPath = oBinding.getPath();
			const oOldData = oModel.getProperty(sPath);

			const oNewData = oOldData;
			oNewData.splice(iSelectedItemIndex, 1);

			oModel.setProperty(sPath, oNewData);

			this.onConfigChange();
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
			const oResponse = await fetch(`${this.API_BASE_URL}/get-user-info/${sUserName}`, {
				method: "GET"
			});
			if (oResponse.ok) {
				const oUserInfo = await oResponse.json();
				return oUserInfo;
			} else {
				return {};
			}
		}
	});
});