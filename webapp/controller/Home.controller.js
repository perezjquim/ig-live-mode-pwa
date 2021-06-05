sap.ui.define([
	"./util/BaseController",
	"sap/ui/core/Fragment"
], function(BaseController, Fragment) {
	"use strict";
	return BaseController.extend("com.perezjquim.iglivemode.pwa.controller.Home", {

		API_BASE_URL: "https://perezjquim-ig-live-mode.herokuapp.com",

		onPressEnableLive: function(oEvent) {
			this._executeAction("enable-live");
		},

		onPressDisableLive: function(oEvent) {
			this._executeAction("disable-live");
		},

		_executeAction: function(sEndpoint) {
			this.setBusy(true);

			this._sEndpoint = sEndpoint;

			const oView = this.getView();
			Fragment.load({
				name: "com.perezjquim.iglivemode.pwa.view.fragment.ActionPrompt",
				controller: this
			}).then(function(oDialog) {
				this.setBusy(false);
				oView.addDependent(oDialog);
				oDialog.open();
				this._oPromptDialog = oDialog;
				return oDialog;
			}.bind(this));
		},

		onConfirmAction: function() {
			this.setBusy(true);

			const oConfigModel = this.getModel("config");
			const oConfigData = oConfigModel.getData();

			const oPromptModel = this.getModel("prompt");
			const oPromptData = oPromptModel.getData();

			const oBody = { ...oConfigData,
				...oPromptData
			};
			const sBody = JSON.stringify(oBody);

			if (oConfigData && oPromptData && sBody) {

				fetch(`${this.API_BASE_URL}/${this._sEndpoint}`, {
					method: "POST",
					body: sBody
				}).then((oResponse) => {
					if (oResponse.ok) {
						const sText = this.getText("action_success");
						this.toast(sText);
						this._oPromptDialog.close();
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

		onCancelAction: function(oEvent) {
			const oButton = oEvent.getSource();
			const oDialog = oButton.getParent();
			oDialog.close();
		},

		onBeforeOpenPromptDialog: function(oEvent) {
			this.clearModel("prompt");
		},

		onAfterClosePromptDialog: function(oEvent) {
			this.clearModel("prompt");
		}

	});
});