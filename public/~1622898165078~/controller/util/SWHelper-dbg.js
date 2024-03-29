sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	return Object.extend("com.perezjquim.iglivemode.pwa.controller.util.SWHelper", {
		_oController: null,
		constructor: function(oController) {
			this._oController = oController;
		},
		init: function() {
			this._cleanup();
			this._registerSW();

			window.addEventListener("beforeunload", this._cleanup.bind(this));
		},
		_registerSW: function() {
			if (navigator.serviceWorker) {
				navigator.serviceWorker.register('/sw.js');
			}
		},
		_cleanup: function() {
			if (navigator.serviceWorker) {
				navigator.serviceWorker
					.getRegistrations()
					.then(function(registrations) {
						for (let registration of registrations) {
							registration.unregister();
						}
					});
			}
		}
	});
});