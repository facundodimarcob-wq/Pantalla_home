sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Core",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Popover",
    "sap/m/VBox",
    "sap/m/Avatar",
    "sap/m/Text",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
    "sap/m/PlacementType"
], function (Controller, JSONModel, MessageToast, Core, Filter, FilterOperator, Popover, VBox, Avatar, Text, List, StandardListItem, Button, PlacementType) {
    "use strict";

    return Controller.extend("pantallahome.controller.home", {
        onInit: function () {
            var oData = {
                Tiles: [
                    { title: "Seguridad e Integraciones", count: 8, icon: "sap-icon://shield" },
                    { title: "Herramientas Clínicas", count: 7, icon: "sap-icon://stethoscope" },
                    { title: "Clínica Médica", count: 11, icon: "sap-icon://customer-and-supplier" }, 
                    { title: "Administración", count: 6, icon: "sap-icon://suitcase" },
                    { title: "Gestión", count: 10, icon: "sap-icon://action-settings" },
                    { title: "Apoyo Sanitario", count: 8, icon: "sap-icon://pharmacy" },
                    { title: "Finanzas", count: 15, icon: "sap-icon://lead" },
                    { title: "Servicios", count: 8, icon: "sap-icon://customer-and-contacts" },
                    { title: "Compras", count: 14, icon: "sap-icon://cart" },
                    { title: "Stock", count: 14, icon: "sap-icon://shipping-status" },
                    { title: "Ventas", count: 17, icon: "sap-icon://trend-up" },
                    { title: "Reportes", count: 9, icon: "sap-icon://document-text" }
                ]
            };
            this.getView().setModel(new JSONModel(oData), "domainModel");

            var oUserData = {
                name: "Facundo Dimarco Bravo",
                email: "facundo.dimarco@qactionsystem.com"
            };
            this.getView().setModel(new JSONModel(oUserData), "userModel");

            // MENÚ LATERAL ACTUALIZADO (Español y filtrado)
            var oMenuData = {
                items: [
                    { title: "Ajustes", icon: "sap-icon://action-settings", active: true }, // Activo por defecto
                    { title: "Suscripciones", icon: "sap-icon://money-bills", active: false },
                    { title: "Agendas", icon: "sap-icon://calendar", active: false },
                    { title: "Ayuda Online", icon: "sap-icon://sys-help", active: false }
                ]
            };
            this.getView().setModel(new JSONModel(oMenuData), "sideMenu");
        },

        
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                // Filtra ignorando mayúsculas/minúsculas
                aFilters.push(new Filter("title", FilterOperator.Contains, sQuery));
            }
            // Actualizado para apuntar al FlexBox y a la propiedad "items"
            this.byId("tilesFlexBox").getBinding("items").filter(aFilters);
        },

        onToggleDarkMode: function () {
            var sCurrentTheme = Core.getConfiguration().getTheme();
            if (sCurrentTheme.includes("dark")) {
                Core.applyTheme("sap_horizon");
                MessageToast.show("Modo Claro activado");
            } else {
                Core.applyTheme("sap_horizon_dark");
                MessageToast.show("Modo Oscuro activado");
            }
        },

        onAvatarPress: function (oEvent) {
            var oSource = oEvent.getSource();
            if (!this._oUserPopover) {
                var oPopoverContent = new VBox({ alignItems: "Center", width: "280px", class: "sapUiContentPadding" });
                var oMenuAvatar = new Avatar({ icon: "sap-icon://customer", displaySize: "M", class: "sapUiSmallMarginBottom" });
                var oNameText = new Text({ text: "{userModel>/name}", class: "sapUiTinyMarginBottom" }).addStyleClass("sapUiSelectable").addStyleClass("sapMTitle");
                var oEmailText = new Text({ text: "{userModel>/email}", class: "sapUiSmallMarginBottom" });
                
                var oActionList = new List({
                    showSeparators: "None",
                    items: [
                        new StandardListItem({ title: "Settings", icon: "sap-icon://action-settings", type: "Active", press: function () { MessageToast.show("Abriendo configuración..."); }})
                    ]
                });

                var oSignOutBox = new VBox({ width: "100%", alignItems: "End", class: "sapUiSmallMarginTop" });
                var oSignOutButton = new Button({ text: "Sign Out", icon: "sap-icon://log", type: "Transparent", press: function () { MessageToast.show("Cerrando sesión..."); } });
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
            var oContext = oEvent.getSource().getBindingContext("domainModel");
            MessageToast.show("Abriendo módulo: " + oContext.getProperty("title"));
        }
    });
});