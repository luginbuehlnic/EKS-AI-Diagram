sap.ui.define([
	"./BaseController",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/vbm/ClusterTree",
	"sap/ui/vbm/Cluster"
],

	function (Controller,
	UIComponent,
	JSONModel,
	MessageToast,
	Dialog,
	DialogType,
	Button,
	Text,
	ClusterTree,
	Cluster) {
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
				this.getView().getModel().setProperty("/amounts", oLocationModel.getData().Spots.length)

				this.getView().setModel(new JSONModel, "view");
				this.getRouter().getRoute("overview").attachMatched(this._onRouteMatched, this);

				this.getView().setModel(new JSONModel(), "maps")
				this._sMapTypes = [
					{text: "AnalyticMap", key: 1},
					{text: "GeoMap", key :2}
				]
				this.getModel("maps").setProperty("/types", this._sMapTypes)

				this._loadMapFragment('ch.nic.mapsample.view.Mapfragment');

				const rangeSlider = this.byId("rangeSlider")
				rangeSlider.setMax(90)
				rangeSlider.setMin(0)
				rangeSlider.setValue(1)

			},

			_onRouteMatched: function(oEvent){

				let unSortPos = [
					{
						posNr : 1,
						descr : "eins",
						sort : "T1"
					},
					{
						posNr : 2,
						descr : "zwei",
						sort : "T3"
					},
					{
						posNr : 3,
						descr : "drei",
						sort : "T1"
					},
					{
						posNr : 4,
						descr : "vier",
						sort : ""
					},
					{
						posNr : 5,
						descr : "fünf",
						sort : "T2"
					},
					{
						posNr : 6,
						descr : "sechs",
						sort : "T4"
					},
				]

				const length = unSortPos.length
				for(let i = length-1; i>=0; i--){
					for(let j = 1; j <=i; j++){
						if(unSortPos[j-1].sort > unSortPos[j].sort){
							let temp = unSortPos[j-1]
							unSortPos[j-1] = unSortPos[j]
							unSortPos[j] = temp
						}
					}
				}

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
				this.getRouter().navTo("list");
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
				this._oPeriods = this.byId("mapSegment").mProperties.selectedKey;
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
				this.byId("switch").setProperty("state", false)
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

			onSwitch: function() {
				let loadedMap
				const analyticMap = this.byId("analyticmap")
				const geoMap = this.byId("geomap")
				if(analyticMap){
					loadedMap = analyticMap
				} else {
					loadedMap = geoMap
				}

				let sState = this.byId("switch").getProperty("state")
				if(sState){
					// if(!this.ocurrentClustering){
						this.ocurrentClustering = new ClusterTree({
							click: this.onClickCluster.bind(this),
							vizTemplate : new Cluster({
								type: "Error",
								icon: "sap-icon://visits"
							})
						})
					// }
					loadedMap.addCluster(this.ocurrentClustering)
				} else {
					loadedMap.removeCluster(this.ocurrentClustering)
					this.ocurrentClustering.destroy()
				}
			},

			onClickCluster: function(oEvent){
				let loadedMap
				const analyticMap = this.byId("analyticmap")
				const geoMap = this.byId("geomap")
				if(analyticMap){
					loadedMap = analyticMap
				} else {
					loadedMap = geoMap
				}

				let clusterKey = oEvent.getParameter("instance").getKey()
				let clusterType = sap.ui.vbm.ClusterInfoType.ContainedVOs;
				let clusterInfo = loadedMap.getInfoForCluster(clusterKey, clusterType)
				
				let cluster = []
				clusterInfo.forEach(info => {
					let spot = 	loadedMap.getVoByInternalId(info)
					if(spot){
						cluster.push(
							{
								name: spot.getTooltip(),
								pos: spot.getPosition()+";0",
								text: spot.getText(),
								state: spot.getType()
							}
						)
					}
				});
				// console.log(cluster)
				let zoom = loadedMap.getZoomlevel()
				loadedMap.setInitialPosition(cluster[0].pos)
				loadedMap.setZoomlevel(zoom+2)
				
			},

			onRangeSlider: function(oEvent) {
				let {Spots} = oLocationModel.getData()
				let key = this.byId("rangeSelection").getSelectedKey()
				let aSpot = []
				let currentTimestamp = Math.round(new Date().getTime()/1000)
				const oRange = this._getRangeTimestamp(key)

				Spots.forEach(spot => {
					let [date, time] = spot.time.split(" ");
					let [day, month, year] = date.split(".")
					let [hour, min] = time.split(":")
					month = month-1
					let timestamp = Math.round(new Date(year, month, day, hour, min).getTime()/1000)
					if(timestamp >= currentTimestamp-oRange){
						aSpot.push(spot)
					}
				});

				oLocationModel.getData().Spots = aSpot
				this.onActionSelect()
				
			},

			onRangeSelection: function(oEvent){
				const key = oEvent.getSource().getSelectedKey();
				
				let maxIndex;
				switch (key) {
					case "1" :
						maxIndex = 59
						break;
					case "2" :
						maxIndex = 23
						break;
					case "3" :
						maxIndex = 90
						break;
				}

				this.onRangeSlider(oEvent)
				this.byId("rangeSlider").setMax(maxIndex)
				
			},

			_getRangeTimestamp: function(selectedKey){
				let oRange = parseFloat(this.byId("rangeSlider").getValue()) 
				let operator;
				switch (selectedKey) {
					case "1" :
						operator = 60
					case "2" :
						operator = 3600
					case "3" :
						operator = 86400
				}

				oRange = oRange*operator
				return oRange
			},

		});
	});
