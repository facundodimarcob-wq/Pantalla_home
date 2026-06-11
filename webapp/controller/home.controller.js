sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Theming",
    "sap/m/Popover",
    "sap/m/VBox",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, Theming, Popover, VBox, List, StandardListItem, Button, Fragment) {
    "use strict";

    return Controller.extend("pantallahome.controller.home", {
        onInit: function () {
            // Aplicar tema guardado
            var sSavedTheme = localStorage.getItem("userPreferredTheme");
            if (sSavedTheme) { Theming.setTheme(sSavedTheme); }
            
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            
            // Modelos
            this.getView().setModel(new JSONModel({ Tiles: [
                { title: oBundle.getText("tile.security"), count: 8, icon: "sap-icon://shield" },
                { title: oBundle.getText("tile.tools"), count: 7, icon: "sap-icon://stethoscope" },
                { title: oBundle.getText("tile.medical"), count: 11, icon: "sap-icon://customer-and-supplier" },
                { title: oBundle.getText("tile.admin"), count: 6, icon: "sap-icon://suitcase" },
                { title: oBundle.getText("tile.management"), count: 10, icon: "sap-icon://action-settings" },
                { title: oBundle.getText("tile.health"), count: 8, icon: "sap-icon://pharmacy" },
                { title: oBundle.getText("tile.finance"), count: 15, icon: "sap-icon://lead" },
                { title: oBundle.getText("tile.services"), count: 8, icon: "sap-icon://customer-and-contacts" },
                { title: oBundle.getText("tile.purchases"), count: 14, icon: "sap-icon://cart" },
                { title: oBundle.getText("tile.stock"), count: 14, icon: "sap-icon://shipping-status" },
                { title: oBundle.getText("tile.sales"), count: 17, icon: "sap-icon://trend-up" },
                { title: oBundle.getText("tile.reports"), count: 9, icon: "sap-icon://document-text" }
            ]}), "domainModel");

            this.getView().setModel(new JSONModel({ name: "Facundo Dimarco Bravo", email: "facundo.dimarco@qactionsystem.com" }), "userModel");
            
            this.getView().setModel(new JSONModel({ items: [
                { title: oBundle.getText("menu.settings"), icon: "sap-icon://action-settings", active: true },
                { title: oBundle.getText("menu.subscriptions"), icon: "sap-icon://money-bills", active: false },
                { title: oBundle.getText("menu.calendars"), icon: "sap-icon://calendar", active: false },
                { title: oBundle.getText("menu.help"), icon: "sap-icon://sys-help", active: false }
            ]}), "sideMenu");
        },

        // --- GESTIÓN DE CONFIGURACIÓN ---
        onOpenSettings: function () {
            if (!this._oSettingsDialog) {
                Fragment.load({ id: this.getView().getId(), name: "pantallahome.view.SettingsDialog", controller: this })
                .then(function (oDialog) { this._oSettingsDialog = oDialog; this.getView().addDependent(this._oSettingsDialog); this._oSettingsDialog.open(); }.bind(this));
            } else { this._oSettingsDialog.open(); }
        },
        onCloseSettingsDialog: function () { this._oSettingsDialog.close(); },

        // --- GESTIÓN DE IA (GEMINI) ---
        onOpenAIDialog: function () {
            if (!this._oAIDialog) {
                Fragment.load({ id: this.getView().getId(), name: "pantallahome.view.AIDialog", controller: this })
                .then(function (oDialog) { this._oAIDialog = oDialog; this.getView().addDependent(this._oAIDialog); this._oAIDialog.open(); }.bind(this));
            } else { this._oAIDialog.open(); }
        },
        onCloseAIDialog: function () { this._oAIDialog.close(); },

        onCallAI: async function () {
            var oInput = this.byId("aiInput"), oResponseText = this.byId("aiResponse"), sPrompt = oInput.getValue();
            if (!sPrompt) { MessageToast.show("Escribí una pregunta."); return; }
            oResponseText.setText("Pensando...");

            var sContexto = "Eres asistente de SAP HIS. Usuario: " + this.getView().getModel("userModel").getProperty("/name") + ". Datos: " + JSON.stringify(this.getView().getModel("domainModel").getProperty("/Tiles")) + ". Responde natural: " + sPrompt;
            var API_KEY = "api ia key aquí"; // REEMPLAZAR CON TU API KEY
            
            try {
                var response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY, { 
                    method: "POST", headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify({ contents: [{ parts: [{ text: sContexto }] }] }) 
                });
                var data = await response.json();
                data.candidates ? oResponseText.setText(data.candidates[0].content.parts[0].text) : oResponseText.setText("Error: " + JSON.stringify(data));
            } catch (e) { oResponseText.setText("Error de conexión."); }
        },

        // --- EVENTOS INTERFAZ ---
        onThemeMenuPress: function (oEvent) {
            if (!this._oThemePopover) {
                var oList = new List({ mode: "SingleSelectMaster", selectionChange: function(e) { this._sSelectedTheme = e.getParameter("listItem").data("themeId"); }.bind(this),
                    items: [
                        new StandardListItem({ title: "SAP Quartz Light" }).data("themeId", "sap_fiori_3"),
                        new StandardListItem({ title: "SAP Quartz Dark" }).data("themeId", "sap_fiori_3_dark"),
                        new StandardListItem({ title: "SAP Morning Horizon" }).data("themeId", "sap_horizon"),
                        new StandardListItem({ title: "SAP Evening Horizon" }).data("themeId", "sap_horizon_dark")
                    ]
                });
                var oSaveButton = new Button({ text: "Guardar Tema", type: "Emphasized", width: "90%", press: function() {
                    if (this._sSelectedTheme) { localStorage.setItem("userPreferredTheme", this._sSelectedTheme); Theming.setTheme(this._sSelectedTheme); this._oThemePopover.close(); }
                }.bind(this)});
                oSaveButton.addStyleClass("sapUiSmallMargin");
                this._oThemePopover = new Popover({ title: "Temas", contentWidth: "250px", content: [oList, oSaveButton], placement: "Bottom" });
                this.getView().addDependent(this._oThemePopover);
            }
            this._oThemePopover.openBy(oEvent.getSource());
        },

        onAvatarPress: function (oEvent) {
            if (!this._oUserPopover) {
                this._oUserPopover = new Popover({ showHeader: false, placement: "Bottom", content: [
                    new VBox({ class: "sapUiContentPadding", items: [
                        new Avatar({ icon: "sap-icon://customer", displaySize: "M" }),
                        new Text({ text: "{userModel>/name}", class: "sapUiSmallMarginTop" }),
                        new Button({ text: "Settings", icon: "sap-icon://action-settings", press: function() { this._oUserPopover.close(); this.onOpenSettings(); }.bind(this) })
                    ]})
                ]});
                this.getView().addDependent(this._oUserPopover);
            }
            this._oUserPopover.isOpen() ? this._oUserPopover.close() : this._oUserPopover.openBy(oEvent.getSource());
        },

        onSearch: function (oEvent) {
            this.byId("tilesFlexBox").getBinding("items").filter(oEvent.getParameter("newValue") ? [new Filter("title", "Contains", oEvent.getParameter("newValue"))] : []);
        },

        onSidebarItemPress: function (oEvent) {
            var sTitle = oEvent.getParameter("listItem").getTitle();
            sTitle === "Ajustes" ? this.onOpenSettings() : MessageToast.show("Desarrollo: " + sTitle);
        },

        onTilePress: function (oEvent) {
            MessageToast.show("Módulo: " + oEvent.getSource().getBindingContext("domainModel").getProperty("title"));
        }
    });
});