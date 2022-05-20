sap.ui.define([
	"./util/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, MessageBox, Fragment, Filter, FilterOperator) {
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
					const sErrorMsg = await oResponse.text();
					console.warn(sErrorMsg);
					this.toast(sErrorMsg);
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
		},

		onFollowerSearch: function(oEvent) {
			const oFilters = [];
			const sQuery = oEvent.getParameter("newValue");
			if (sQuery) {
				const oFilter = new Filter({
					filters: [new Filter("full_name", FilterOperator.Contains, sQuery), new Filter("username", FilterOperator.Contains, sQuery)],
					and: true
				});
				oFilters.push(oFilter);
			}

			const oSearchField = oEvent.getSource();
			const oToolbar = oSearchField.getParent();
			const oTable = oToolbar.getParent();
			const oBinding = oTable.getBinding("items");
			oBinding.filter(oFilters, "Application");
		}
	});
});