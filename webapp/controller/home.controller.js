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
    "sap/m/PlacementType",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, Theming, Filter, FilterOperator, Popover, VBox, HBox, Avatar, Text, List, StandardListItem, Button, PlacementType, Fragment) {
    "use strict";

    return Controller.extend("pantallahome.controller.home", {
        onInit: function () {
            var sSavedTheme = localStorage.getItem("userPreferredTheme");
            if (sSavedTheme) {
                if (sSavedTheme.startsWith("custom_")) {
                    this.applyCustomImageTheme(sSavedTheme);
                } else {
                    Theming.setTheme(sSavedTheme);
                }
            }
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var oData = { Tiles: [
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
            ]};
            this.getView().setModel(new JSONModel(oData), "domainModel");
            var oUserData = { name: "Facundo Dimarco Bravo", email: "facundo.dimarco@qactionsystem.com" };
            this.getView().setModel(new JSONModel(oUserData), "userModel");
            var oMenuData = { items: [
                { title: oBundle.getText("menu.settings"), icon: "sap-icon://action-settings", active: true },
                { title: oBundle.getText("menu.subscriptions"), icon: "sap-icon://money-bills", active: false },
                { title: oBundle.getText("menu.calendars"), icon: "sap-icon://calendar", active: false },
                { title: oBundle.getText("menu.help"), icon: "sap-icon://sys-help", active: false }
            ]};
            this.getView().setModel(new JSONModel(oMenuData), "sideMenu");
        },

        applyCustomImageTheme: function(sThemeId) {
            Theming.setTheme("sap_fiori_3"); 
            document.body.classList.add("custom-background-theme");
            var sImageUrl = (sThemeId === "custom_forest") ? "images/forest.jpg" : "images/ocean.jpg";
            document.body.style.backgroundImage = "url('" + sImageUrl + "')";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundPosition = "center";
        },

        onOpenSettings: function () {
            if (!this._oSettingsDialog) {
                Fragment.load({ id: this.getView().getId(), name: "pantallahome.view.SettingsDialog", controller: this })
                .then(function (oDialog) { this._oSettingsDialog = oDialog; this.getView().addDependent(this._oSettingsDialog); this._oSettingsDialog.open(); }.bind(this));
            } else { this._oSettingsDialog.open(); }
        },

        onCloseSettingsDialog: function () { this._oSettingsDialog.close(); },

        onSidebarItemPress: function (oEvent) {
            var sTitle = oEvent.getParameter("listItem").getTitle();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            sTitle === oBundle.getText("menu.settings") ? this.onOpenSettings() : MessageToast.show("Desarrollo: " + sTitle);
        },

        onThemeMenuPress: function (oEvent) {
            var oButton = oEvent.getSource();
            if (!this._oThemePopover) {
                var oList = new List({
                    mode: "SingleSelectMaster",
                    selectionChange: function(oEvt) { this._sSelectedTheme = oEvt.getParameter("listItem").data("themeId"); }.bind(this),
                    items: [
                        new StandardListItem({ title: "SAP Quartz Light" }).data("themeId", "sap_fiori_3"),
                        new StandardListItem({ title: "SAP Quartz Dark" }).data("themeId", "sap_fiori_3_dark"),
                        new StandardListItem({ title: "SAP Morning Horizon" }).data("themeId", "sap_horizon"),
                        new StandardListItem({ title: "SAP Evening Horizon" }).data("themeId", "sap_horizon_dark"),
                        new StandardListItem({ title: "Custom Morning Forest" }).data("themeId", "custom_forest"),
                        new StandardListItem({ title: "Custom Evening Ocean" }).data("themeId", "custom_ocean")
                    ]
                });
                var oButtonBox = new HBox({ width: "100%", justifyContent: "End", class: "sapUiSmallMarginTop" });
                var oSaveButton = new Button({ text: "Save", type: "Emphasized", press: function() {
                    if (this._sSelectedTheme) {
                        localStorage.setItem("userPreferredTheme", this._sSelectedTheme);
                        this._sSelectedTheme.startsWith("custom_") ? this.applyCustomImageTheme(this._sSelectedTheme) : Theming.setTheme(this._sSelectedTheme);
                        this._oThemePopover.close();
                        MessageToast.show("Tema guardado");
                    }
                }.bind(this)});
                oButtonBox.addItem(oSaveButton);
                this._oThemePopover = new Popover({ title: "Seleccionar Tema", contentWidth: "250px", content: [oList, oButtonBox], placement: "Bottom" });
                this.getView().addDependent(this._oThemePopover);
            }
            this._oThemePopover.openBy(oButton);
        },

        onAvatarPress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            if (!this._oUserPopover) {
                var oPopoverContent = new VBox({ alignItems: "Center", width: "280px", class: "sapUiContentPadding" });
                var oActionList = new List({ showSeparators: "None", items: [
                    new StandardListItem({ title: oBundle.getText("popover.settings"), icon: "sap-icon://action-settings", type: "Active", press: function () { 
                        this._oUserPopover.close(); this.onOpenSettings(); 
                    }.bind(this)})
                ]});
                oPopoverContent.addItem(new Avatar({ icon: "sap-icon://customer", displaySize: "M", class: "sapUiSmallMarginBottom" }));
                oPopoverContent.addItem(new Text({ text: "{userModel>/name}", class: "sapUiTinyMarginBottom sapMTitle" }));
                oPopoverContent.addItem(new Text({ text: "{userModel>/email}", class: "sapUiSmallMarginBottom" }));
                oPopoverContent.addItem(oActionList);
                this._oUserPopover = new Popover({ showHeader: false, placement: PlacementType.Bottom, content: [oPopoverContent] });
                this.getView().addDependent(this._oUserPopover);
            }
            this._oUserPopover.isOpen() ? this._oUserPopover.close() : this._oUserPopover.openBy(oSource);
        },

        onTilePress: function (oEvent) {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var oContext = oEvent.getSource().getBindingContext("domainModel");
            MessageToast.show(oBundle.getText("toast.openModule") + oContext.getProperty("title"));
        }
    });
});