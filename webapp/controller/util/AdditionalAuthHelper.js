sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	return Object.extend("com.perezjquim.iglivemode.pwa.controller.util.AdditionalAuthHelper", {
		_oController: null,

		constructor: function(oController) {
			this._oController = oController;
		},

		onAfterCloseAdditionalAuthPrompt: function(oEvent) {
			this._oController.clearModel("additional_auth_prompt");
		},

		onConfirmAdditionalAuth: async function(oEvent) {
			this._oController.setBusy(true);

			const oSource = oEvent.getSource();
			const oVBox = oSource.getParent();
			const oDialog = oVBox.getParent();

			const oAdditionalAuthPromptModel = this._oController.getModel("additional_auth_prompt");

			const sVerificationCode = oAdditionalAuthPromptModel.getProperty("/verification_code");

			if (sVerificationCode) {

				try {

					const oHeaders = new Headers();

					const oIGSettings = oAdditionalAuthPromptModel.getProperty("/settings");
					const sIGSettings = encodeURIComponent(JSON.stringify(oIGSettings));
					oHeaders.append("ig_settings", sIGSettings);

					oHeaders.append("Authorization", oAdditionalAuthPromptModel.getProperty("/authorization"));

					var sEndpoint = "";

					const oTwoFactorInfo = oAdditionalAuthPromptModel.getProperty("/two_factor_info");
					if (oTwoFactorInfo) {
						oTwoFactorInfo["verification_code"] = sVerificationCode;
						sEndpoint = "login_2fa";
						oHeaders.append("two_factor_info", JSON.stringify(oTwoFactorInfo));
					} else {
						const oCheckpointInfo = oAdditionalAuthPromptModel.getProperty("/checkpoint_info");
						if (oCheckpointInfo) {
							oCheckpointInfo["verification_code"] = sVerificationCode;
							sEndpoint = "login_checkpoint";
							oHeaders.append("checkpoint_info", JSON.stringify(oCheckpointInfo));
						}
					}

					const oResponse = await fetch(`${this._oController.API_BASE_URL}/${sEndpoint}`, {
						method: "POST",
						headers: oHeaders
					});

					if (oResponse.ok) {

						const oIGSettings = await oResponse.json();
						const sIGSettings = JSON.stringify(oIGSettings);

						localStorage.setItem("ig_settings", sIGSettings);

						this._oController.fetchData();

						const sText = this._oController.getText("action_success");
						this._oController.toast(sText);

						oDialog.close();

					} else {

						const sErrorMsg = await oResponse.text();
						console.warn(sErrorMsg);
						this._oController.toast(sErrorMsg);

					}

				} catch (oException) {
					console.warn(oException);
					this._oController.toast(oException);
				}

				this._oController.setBusy(false);

			} else {
				this._oController.setBusy(false);

				const sText = this._oController.getText("incomplete_data");
				this._oController.toast(sText);
			}
		}
	});
});