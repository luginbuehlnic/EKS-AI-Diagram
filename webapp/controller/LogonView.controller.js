sap.ui.define([
	"ch/nic/mapsample/controller/BaseController",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(
	BaseController,
	UIComponent,
	JSONModel,
	MessageToast
) {
	"use strict";

	return BaseController.extend("ch.nic.mapsample.controller.LogonView", {
		onInit: function () {
			// this.getView().setModel(oLocationModel)

			this.getView().setModel(new JSONModel, "view");
			// this.getRouter().getRoute("main").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent){
			// let oArgs, oView, oQuery;
			// oArgs = oEvent.getParameter("arguments");
			// oView = this.getView();
			// oQuery = oArgs["?query"];

			// if(oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1){
			// 	oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
			// } else {
			// 	this.getRouter().navTo("detail", {
			// 		employeeId : oArgs.employeeId,

			// 		"?query": {
			// 			tab: _aValidTabKeys[0]
			// 		}
			// 	}, true)
			// }
		},
	});
});