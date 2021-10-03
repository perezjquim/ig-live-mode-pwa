sap.ui.define([
	"./util/BaseController",
	"sap/ui/util/Storage"
], function(BaseController, Storage) {
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

			const oToolbar = oSource.getParent();
			const oTable = oToolbar.getParent();
			const oBinding = oTable.getBinding("items");
			const oModel = oBinding.getModel();

			const sPath = oBinding.getPath();
			const oOldData = oModel.getProperty(sPath);
			const oNewData = oOldData.concat([{}]);

			oModel.setProperty(sPath, oNewData);
		},

		onRemoveEntry: function(oEvent) {
			const oSource = oEvent.getSource();

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