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

		_currentFragment: undefined,
		onInit: function () {

			let {Spots} = oLocationModel.getData()
			for (let i=0; i < Spots.length; i++){
				Spots[i].id=1000+i
				Spots[i].state = Spots[i].type
				if(Spots[i].state === "Inactive"){
					Spots[i].state = "None"
				}
			}

			oLocationModel.getData().AlertAmount = oLocationModel.getData().Alerts.length

			this.getView().setModel(oLocationModel)

			this.getView().setModel(new JSONModel, "view");

			this.getRouter().getRoute("list").attachMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function(oEvent){
			this._loadFragment("ch.nic.mapsample.view.LoginList")
		},

		onPress: function(oEvent) {
			const id = oEvent.getSource().getBindingContext().getProperty("id")
			this.navTo("detail", {spotId: id}, false)
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
				// this._applySearch(aTableSearchState);
			}
		},

		onTitlePress: function(){
			var {Alerts} = oLocationModel.getData()
			var ids = 2000

			Alerts.forEach(alert => {
				alert.id=ids++
				alert.state = alert.type
				if(alert.state === "Inactive"){
					alert.state = "None"
				}
			})
			this._loadFragment("ch.nic.mapsample.view.AlertsList")
			this.byId("checkoutButton").setVisible(true)
		},

		onSelectionChange: function(oEvent){
			this.byId("checkoutButton").setEnabled(true)
		},

		onCheckout: function(oEvent){
			var aContexts = this.byId("alertsTable").getSelectedContexts();

			for(var i = aContexts.length-1; i>=0; i--){
				var sPath = aContexts[i].getPath()
				var sIndex = sPath.slice(-1)
				oLocationModel.getData().Alerts[sIndex].checked = true

				oLocationModel.getData().Alerts.splice(i,1)
				sIndex = parseFloat(sIndex)
				this.byId("alertsTable").removeItem(sIndex);
			}

			this.byId("alertsTable").removeSelections()
			this.byId("checkoutButton").setEnabled(false)
		},

		/**
		 * @override
		 */
		onNavBack: function() {
			var aCurrentFragmentName = this._currentFragment.getId().split("--")
			
			switch (aCurrentFragmentName[aCurrentFragmentName.length-1]){
				case "loginTable" :
					BaseController.prototype.onNavBack.apply(this, arguments);
					break;
				case "alertsTable" :
					this._loadFragment("ch.nic.mapsample.view.LoginList")
					break;
				default :
					BaseController.prototype.onNavBack.apply(this, arguments);
					break;
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

		_loadFragment(fragmentName) {
			if(this._currentFragment){
				this._currentFragment.destroy();
				this._currentFragment = undefined;
			}
			this.loadFragment({
				name: fragmentName,
				type: "XML"
			}).then(function (oFragment){
				this._currentFragment = oFragment;

				const oTab = this.byId("idListView")
				this.getView().addDependent(oFragment);
				oTab.destroyContent(oFragment);
				oTab.setContent(oFragment);	
			}.bind(this));
		},
	});
});