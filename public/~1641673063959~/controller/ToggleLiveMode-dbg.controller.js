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

		_executeAction: function(sEndpoint) {
			this.setBusy(true);

			const sBody = this._getAuthenticatedBody();

			if (oConfigData && oIGSettings && sBody) {

				fetch(`${this.API_BASE_URL}/${sEndpoint}`, {
					method: "POST",
					body: sBody
				}).then((oResponse) => {
					if (oResponse.ok) {
						const sText = this.getText("action_success");
						this.toast(sText);
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
		}

	});
});