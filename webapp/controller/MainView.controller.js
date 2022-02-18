sap.ui.define([
	"ch/nic/mapsample/controller/BaseController",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/Label"
],

	function (BaseController,
	UIComponent,
	JSONModel,
	MessageToast,
	Dialog,
	DialogType,
	Button,
	Text,
	TextArea,
	Label) {
		"use strict";

		var oLocationModel = new JSONModel("./Data.json");

		return BaseController.extend("ch.nic.mapsample.controller.MainView", {
			onInit: function () {
				this.getView().setModel(oLocationModel)

				

			},

			onTile : function(tile) {
				let password
				let username
				if(this.getStatus() === true){
					this.getRouter().navTo("overview", {"query": {tab: tile}});
				}else{
					this.oLoginDialog = new Dialog({
						type: DialogType.Message,
						title: "Login",
						content: [
							new Label({
								text: "Type in your Username:",
								labelFor: "nameArea"
							}),
							new TextArea("nameArea",{
								width: "100%",
								rows: 1,
								placeholder: "username",
								liveChange: function (oEvent) {
									username = oEvent.getParameter("value");
								}.bind(this)
							}),
							new Label({
								text: "\nType in your Password:",
								labelFor: "pwArea"
							}),
							new TextArea("pwArea",{
								width: "100%",
								rows: 1,
								placeholder: "password",
								liveChange: function (oEvent) {
									password = oEvent.getParameter("value");
								}.bind(this)
							})
						],
						beginButton: new Button({
							text: "Login",
							press : function(){
								if(username === "admin" && password === "123"){
									this.getRouter().navTo("overview", {"query": {tab: tile}});
									this.oLoginDialog.destroy()		
									this.setStatus();				
								} else {
									this.getRouter().navTo("overview", {"query": {tab: tile}});
									MessageToast.show("Wrong login data");
									this.oLoginDialog.close();
									this.oLoginDialog.destroy();
								}
							}.bind(this)
						}),
						endButton: new Button({
							text: "Cancel",
							press: function(){
								this.oLoginDialog.close();
								this.oLoginDialog.destroy();
							}.bind(this)
						})
					}).open()
				}
			},
		});
	});
