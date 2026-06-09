sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Theming",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Popover",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Avatar",
    "sap/m/Text",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
    "sap/m/PlacementType"
], function (Controller, JSONModel, MessageToast, Theming, Filter, FilterOperator, Popover, VBox, HBox, Avatar, Text, List, StandardListItem, Button, PlacementType) {
    "use strict";

    return Controller.extend("pantallahome.controller.home", {
        onInit: function () {
            var sSavedTheme = localStorage.getItem("userPreferredTheme");
            if (sSavedTheme) {
                Theming.setTheme(sSavedTheme);
            }

            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

            var oData = {
                Tiles: [
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
                ]
            };
            this.getView().setModel(new JSONModel(oData), "domainModel");

            var oUserData = {
                name: "Facundo Dimarco Bravo",
                email: "facundo.dimarco@qactionsystem.com"
            };
            this.getView().setModel(new JSONModel(oUserData), "userModel");

            var oMenuData = {
                items: [
                    { title: oBundle.getText("menu.settings"), icon: "sap-icon://action-settings", active: true },
                    { title: oBundle.getText("menu.subscriptions"), icon: "sap-icon://money-bills", active: false },
                    { title: oBundle.getText("menu.calendars"), icon: "sap-icon://calendar", active: false },
                    { title: oBundle.getText("menu.help"), icon: "sap-icon://sys-help", active: false }
                ]
            };
            this.getView().setModel(new JSONModel(oMenuData), "sideMenu");
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                aFilters.push(new Filter("title", FilterOperator.Contains, sQuery));
            }
            this.byId("tilesFlexBox").getBinding("items").filter(aFilters);
        },

        onThemeMenuPress: function (oEvent) {
            var oButton = oEvent.getSource();

            if (!this._oThemePopover) {
                var oList = new List({
                    mode: "SingleSelectMaster",
                    selectionChange: function(oEvt) {
                        this._sSelectedTheme = oEvt.getParameter("listItem").data("themeId");
                    }.bind(this),
                    items: [
                        new StandardListItem({ title: "SAP Quartz Light" }).data("themeId", "sap_fiori_3"),
                        new StandardListItem({ title: "SAP Quartz Dark" }).data("themeId", "sap_fiori_3_dark"),
                        new StandardListItem({ title: "SAP Morning Horizon" }).data("themeId", "sap_horizon"),
                        new StandardListItem({ title: "SAP Evening Horizon" }).data("themeId", "sap_horizon_dark")
                    ]
                });

                // HBox con margen lateral definido para despegarlo del borde derecho
                var oButtonBox = new HBox({
                    width: "100%",
                    justifyContent: "End",
                    // Agregamos margen superior y margen derecho definido en px para que respire
                    class: "sapUiSmallMarginTop" 
                });
                
                // Aplicamos el margen derecho mediante estilos inline para mayor control
                oButtonBox.addStyleClass("sapUiSmallMarginTop");
                oButtonBox.addStyleClass("sapUiTinyMarginEnd"); // Margen pequeño a la derecha
                
                // Si aún lo ves pegado, ajustamos el margen derecho del botón mismo:
                var oSaveButton = new Button({
                    text: "Save",
                    type: "Emphasized",
                    class: "sapUiSmallMarginEnd", // Margen extra para el botón
                    press: function() {
                        if (this._sSelectedTheme) {
                            Theming.setTheme(this._sSelectedTheme);
                            localStorage.setItem("userPreferredTheme", this._sSelectedTheme);
                            this._oThemePopover.close();
                            MessageToast.show("Tema guardado");
                        }
                    }.bind(this)
                });

                oButtonBox.addItem(oSaveButton);

                this._oThemePopover = new Popover({
                    title: "Seleccionar Tema",
                    contentWidth: "250px",
                    content: [oList, oButtonBox],
                    placement: "Bottom"
                });
                this.getView().addDependent(this._oThemePopover);
            }
            this._oThemePopover.openBy(oButton);
        },

        onAvatarPress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            if (!this._oUserPopover) {
                var oPopoverContent = new VBox({ alignItems: "Center", width: "280px", class: "sapUiContentPadding" });
                var oMenuAvatar = new Avatar({ icon: "sap-icon://customer", displaySize: "M", class: "sapUiSmallMarginBottom" });
                var oNameText = new Text({ text: "{userModel>/name}", class: "sapUiTinyMarginBottom" }).addStyleClass("sapUiSelectable").addStyleClass("sapMTitle");
                var oEmailText = new Text({ text: "{userModel>/email}", class: "sapUiSmallMarginBottom" });
                
                var oActionList = new List({
                    showSeparators: "None",
                    items: [
                        new StandardListItem({ 
                            title: oBundle.getText("popover.settings"), 
                            icon: "sap-icon://action-settings", 
                            type: "Active", 
                            press: function () { MessageToast.show(oBundle.getText("toast.openSettings")); }
                        })
                    ]
                });

                var oSignOutBox = new VBox({ width: "100%", alignItems: "End", class: "sapUiSmallMarginTop" });
                var oSignOutButton = new Button({ 
                    text: oBundle.getText("popover.signOut"), 
                    icon: "sap-icon://log", 
                    type: "Transparent", 
                    press: function () { MessageToast.show(oBundle.getText("toast.signingOut")); } 
                });
                
                oSignOutBox.addItem(oSignOutButton);
                oPopoverContent.addItem(oMenuAvatar);
                oPopoverContent.addItem(oNameText);
                oPopoverContent.addItem(oEmailText);
                oPopoverContent.addItem(oActionList);
                oPopoverContent.addItem(oSignOutBox);

                this._oUserPopover = new Popover({ showHeader: false, placement: PlacementType.Bottom, content: [oPopoverContent] });
                this.getView().addDependent(this._oUserPopover);
            }
            if (this._oUserPopover.isOpen()) { this._oUserPopover.close(); } 
            else { this._oUserPopover.openBy(oSource); }
        },

        onTilePress: function (oEvent) {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var oContext = oEvent.getSource().getBindingContext("domainModel");
            MessageToast.show(oBundle.getText("toast.openModule") + oContext.getProperty("title"));
        }
    });
});