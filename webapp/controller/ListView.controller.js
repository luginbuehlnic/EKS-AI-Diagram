sap.ui.define([
	"ch/nic/mapsample/controller/BaseController",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/vbm/Spots",
	"sap/ui/vbm/Spot"
], function(
	BaseController,
	UIComponent,
	JSONModel,
	MessageToast,
	Spots,
	Spot
) {
	"use strict";

	var oLocationModel = new JSONModel("./Data.json");
	return BaseController.extend("ch.nic.mapsample.controller.ListView", {
		onInit: function () {

			let {Spots} = oLocationModel.getData()
			for (let i=0; i < Spots.length; i++){
				Spots[i].id=1000+i
				Spots[i].state = Spots[i].type
				if(Spots[i].state === "Inactive"){
					Spots[i].state = "None"
				}
			}

			this.getView().setModel(oLocationModel)

			this.getView().setModel(new JSONModel, "view");

			this.getRouter().getRoute("main").attachMatched(this._onRouteMatched, this);
			//this.getRouter().getRoute("detail").attachMatched(this._onDetailLoaded, this);
		},

		onPress: function(oEvent) {
			const id = oEvent.getSource().getBindingContext().getProperty("id")
			this.navTo("detail", {spotId: id}, false)
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

		_onDetailLoaded: function(oEvent){
			const id = parseFloat(oEvent.getParameter("arguments").spotId)
			
			var oLocation = new JSONModel(oLocationModel.getData().Spots.find((Spot) => Spot.id === id))
			
			switch (oLocation.getData().state){
				case "None":
					oLocation.getData().icon=""
					break;
				case "Warning":
					oLocation.getData().icon="sap-icon://message-warning"
					break;
				case "Error":
					oLocation.getData().icon="sap-icon://message-error"
					break;
				case "Success":
					oLocation.getData().icon="sap-icon://message-success"
					break;
			}

			let pos = oLocation.getData().pos
			this.byId("detailMap").setInitialPosition(pos)
			this.byId("detailMap").setZoomlevel(7);
				

			this.getView().setModel(oLocation, "location")
			
		},

		onSearch: function(oEvent){
			let {Spots} = oLocationModel.getData()
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("ProductName", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}
		},

		_applySearch: function(){
			var oTable = this.byId("loginTable")
			var {Spots} = oLocationModel.getData()
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oLocationModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
	});
});