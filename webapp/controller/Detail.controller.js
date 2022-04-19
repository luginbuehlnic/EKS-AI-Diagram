sap.ui.define([
	"ch/nic/mapsample/controller/BaseController",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/vbm/Spots"
], function(
	BaseController,
	UIComponent,
	JSONModel,
	MessageToast,
	Spots
) {
	"use strict";

	var oLocationModel = new JSONModel("./Data.json");
	return BaseController.extend("ch.nic.mapsample.controller.ListView", {
		onInit: function () {

			this.getView().setModel(oLocationModel)

			let {Spots} = oLocationModel.getData()
			for (let i=0; i < Spots.length; i++){
				Spots[i].id=1000+i
				Spots[i].state = Spots[i].type
				if(Spots[i].state === "Inactive"){
					Spots[i].state = "None"
				}
			}

			this.getView().setModel(new JSONModel, "view");

			this.getRouter().getRoute("detail").attachMatched(this._onRouteMatched, this);
			//this.getRouter().getRoute("detail").attachMatched(this._onDetailLoaded, this);
		},

		onPress: function(oEvent) {
			const id = oEvent.getSource().getBindingContext().getProperty("id")
			this.navTo("detail", {spotId: id}, false)
		},
		_onRouteMatched: function(oEvent){
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
	});
});