sap.ui.define([
	"./util/BaseController",
	"sap/ui/core/Fragment"
], function(BaseController, Fragment) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.ToggleLiveMode", {

		onPressEnableLive: function(oEvent) {
			this._executeAction("enable-live");
		},

		onPressDisableLive: function(oEvent) {
			this._executeAction("disable-live");
		},

		_executeAction: async function(sEndpoint) {
			this.setBusy(true);

			try {

				const oResponse = await fetch(`${this.API_BASE_URL}/${sEndpoint}`, {
					method: "POST",
					headers: this._getHeaders()
				});

				if (oResponse.ok) {
					const sText = this.getText("action_success");
					this.toast(sText);
				} else {
					const sErrorMsg = await oResponse.text();
					console.warn(sErrorMsg);
					this.toast(sErrorMsg);
				}

			} catch (oException) {
				console.warn(oException);
				this.toast(oException);
			}

			this.setBusy(false);
		}
	});
});