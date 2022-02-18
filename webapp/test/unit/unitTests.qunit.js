/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"chnic./mapsample/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
