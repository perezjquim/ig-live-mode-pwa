sap.ui.define([
	"./util/BaseController",
	"sap/ui/util/Storage"
], function(BaseController, Storage) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.Config", {
		onConfigChange: function() {
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