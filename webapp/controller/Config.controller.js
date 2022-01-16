sap.ui.define([
	"./util/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function(BaseController, MessageBox, Fragment) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.Config", {

		onSaveConfig: async function(oEvent) {
			this.setBusy(true);

			const oConfigDraftModel = this.getModel("config_draft");
			const oConfigDraft = oConfigDraftModel.getData();
			const sConfigDraft = JSON.stringify(oConfigDraft);

			try {
				const oResponse = await fetch(`${this.API_BASE_URL}/update-config`, {
					method: "POST",
					headers: this._getHeaders(),
					body: sConfigDraft
				});
				if (oResponse.ok) {
					const oConfig = await oResponse.json();

					const oConfigModel = this.getModel("config");
					oConfigModel.setData(this._copy(oConfig));

					this._listenConfigChanges();

					const oMiscModel = this.getModel("misc");
					oMiscModel.setProperty("/is_config_changed", false);

					const sText = this.getText("action_success");
					this.toast(sText);
				} else {
					const sText = this.getText("action_error");
					this.toast(sText);
				}

			} catch (oException) {
				console.warn(oException);
				this.toast(oException);
			}

			this.setBusy(false);
		},

		onDiscardConfig: function(oEvent) {
			this.setBusy(true);

			const oConfigModel = this.getModel("config");
			const oOriginalConfig = oConfigModel.getData();

			const oConfigDraftModel = this.getModel("config_draft");
			oConfigDraftModel.setData(this._copy(oOriginalConfig));
			this._listenConfigChanges();

			const oMiscModel = this.getModel("misc");
			oMiscModel.setProperty("/is_config_changed", false);

			this.setBusy(false);
		}
	});
});