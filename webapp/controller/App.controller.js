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
		}

	});
});