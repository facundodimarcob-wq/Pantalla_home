sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Core" // <-- Inyectamos el Core de forma segura
], function (Controller, JSONModel, MessageToast, Core) {
    "use strict";

    return Controller.extend("pantallahome.controller.home", {
        onInit: function () {
            // Modelo de datos con tus dominios, cantidades e íconos SAP
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

            // Asignamos el modelo a la vista
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "domainModel");
        },

        // Función corregida usando la API modular del Core
        onToggleDarkMode: function () {
            var sCurrentTheme = Core.getConfiguration().getTheme();
            var oButton = this.byId("themeButton");

            if (sCurrentTheme.includes("dark")) {
                Core.applyTheme("sap_horizon");
                oButton.setIcon("sap-icon://night-mode");
                MessageToast.show("Modo Claro activado");
            } else {
                Core.applyTheme("sap_horizon_dark");
                oButton.setIcon("sap-icon://light-mode");
                MessageToast.show("Modo Oscuro activado");
            }
        },

        // Evento al clickear un tile
        onTilePress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("domainModel");
            var sTitle = oContext.getProperty("title");
            
            MessageToast.show("Abriendo módulo: " + sTitle);
        }
    });
});