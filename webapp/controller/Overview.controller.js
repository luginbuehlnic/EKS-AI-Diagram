sap.ui.define([
	"./BaseController",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/Text"
],

	function (Controller,
	UIComponent,
	JSONModel,
	MessageToast,
	Dialog,
	DialogType,
	Button,
	Text) {
		"use strict";

		var oLocationModel = new JSONModel("./Data.json");
		var _aValidTabKeys = ["main", "map","geomap", "setting"];
		

		return Controller.extend("ch.nic.mapsample.controller.MainView", {
			_sMapTypes: undefined,
			_currentFragment: undefined,
			/**
			 * @override
			 */

			onInit: function () {
				this.getView().setModel(oLocationModel)

				this.getView().setModel(new JSONModel, "view");
				this.getRouter().getRoute("overview").attachMatched(this._onRouteMatched, this);

				this.getView().setModel(new JSONModel(), "maps")
				this._sMapTypes = [
					{text: "AnalyticMap", key: 1},
					{text: "GeoMap", key :2}
				]
				this.getModel("maps").setProperty("/types", this._sMapTypes)

				this._loadMapFragment('ch.nic.mapsample.view.Mapfragment');

			},

			_onRouteMatched: function(oEvent){
				let oArgs, oView, oQuery;
				oArgs = oEvent.getParameter("arguments");
				oView = this.getView();
				oQuery = oArgs["?query"];

				if(oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1){
					oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
				} else {
					this.getRouter().navTo("overview", {
						employeeId : oArgs.employeeId,

						"?query": {
							tab: _aValidTabKeys[0]
						}
					}, true)
				}
			},


			onTabSelect: function(oEvent){
				this.getRouter().navTo("overview", {

					"?query" : {
						
						tab: oEvent.getParameter("selectedKey")
					}
				});
			},
            

			onLogOns : function() {
				this.getRouter().navTo("logon");
			},

			onLogOuts : function() {
				this.getRouter().navTo("logout")
			},

			onMapTile : function() {
                this.getRouter().navTo("overview", {"query": {tab: "map"}});
			},

			onSettings : function() {
                this.getRouter().navTo("overview", {"query": {tab: "setting"}});
			},

			onActionSelect() {
				this._oPeriods = this.byId("select").mProperties.selectedKey;
				let fragmentName;
				switch(this._oPeriods) {
					case "1": 
						fragmentName = 'ch.nic.mapsample.view.Mapfragment'
						break;
					case "2":
						fragmentName= 'ch.nic.mapsample.view.GeoMap'
						break;
					default:
						fragmentName= 'ch.nic.mapsample.view.Mapfragment'
				}

				this._loadMapFragment(fragmentName)
			},

			_loadMapFragment(fragmentName) {
				if(this._currentFragment){
					this._currentFragment.destroy();
					this._currentFragment = undefined;
				}
				this.loadFragment({
					name: fragmentName,
					type: "XML"
				}).then(function (oFragment){
					this._currentFragment = oFragment;

					const oTab = this.byId("mapFilter")
					this.getView().addDependent(oFragment);

					oTab.removeContent(oFragment);
					oTab.addContent(oFragment);				
				}.bind(this));
			},

			onClickSpot: function(oEvent) {
				const tooltip = oEvent.getSource().getBindingContext().getProperty("tooltip")
				const text = oEvent.getSource().getBindingContext().getProperty("text")
				const pos = oEvent.getSource().getBindingContext().getProperty("pos")
				const time = oEvent.getSource().getBindingContext().getProperty("time")
				const state = oEvent.getSource().getBindingContext().getProperty("type")
				
				console.log(oEvent.getSource())
				this.oSpotDialog = new Dialog({
					type : DialogType.Message,
					title: "Login Spot Information",
					content : new Text({text:
						"Type: "+text+
						"\n Date: "+time+
						"\n Location: "+tooltip+
						"\n Coordinates: "+pos+
						"\n Status: "+state}),
					beginButton : new Button({
						text: "OK",
						press: function() {
							this.oSpotDialog.close()
						}.bind(this)
					})
				}).open()

				let analyticMap = this.byId("analyticmap")
				let geoMap = this.byId("geomap")
				if (analyticMap){
					analyticMap.setInitialPosition(pos)
					analyticMap.setZoomlevel(7);
					analyticMap = undefined;
				} else if(geoMap){
					geoMap.setInitialPosition(pos)
					geoMap.setZoomlevel(8);
					geoMap = undefined;
				}
				
			},

			onClickItem: function() {
				console.log("idk")
			},

			onCluster: function(oEvent){
				console.log(oEvent)
				let rule = this.getView().byId("clusterTree").getRule()
				let color = this.getView().byId("clusterTree").getAreaColor()

				console.log(rule+ " "+ color)
			}

		});
	});
