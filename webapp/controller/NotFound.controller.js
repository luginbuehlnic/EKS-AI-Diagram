sap.ui.define([
	"ch/nic/mapsample/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("ch.nic.mapsample.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */

		onLinkPressed: function() {
			this.getRouter().navTo("main")
		}

	});

});