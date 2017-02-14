// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, document, self */
    /*jslint plusplus: true, nomen: true, vars: true */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Label");

    sap.ui.jsview("sap.ushell.renderers.fiori2.usageAnalytics_selector.UsageAnalyticsSelector", {

        createContent: function (oController) {
            var sFBoxAlignItems = sap.ui.Device.system.phone ? 'Start' : 'Center',
                sFlexWrap = sap.ui.Device.system.phone ? 'Wrap' : 'NoWrap',
                sFBoxDirection = sap.ui.Device.system.phone ? 'Column' : 'Row',
                sTextAlign = sap.ui.Device.system.phone ? 'Left' : 'Right';

            this.oLabel = new sap.m.Label({
                width: "11.75rem",
                textAlign: sTextAlign,
                text: sap.ushell.resources.i18n.getText("allowTracking") + ":"
            }).addStyleClass('sapUshellUsageAnalyticsSelectorLabel');

            this.oSwitchButton = new sap.m.Switch("usageAnalyticsSwitchButton", {
                type: sap.m.SwitchType.Default
            }).addStyleClass('sapUshellUsageAnalyticsSelectorSwitchButton');

            this.oMessage = new sap.m.Text({
                text: sap.ushell.Container.getService("UsageAnalytics").getLegalText()
            }).addStyleClass('sapUshellUsageAnalyticsSelectorLegalTextMessage');

            this.fBox = new sap.m.FlexBox({
                alignItems: sFBoxAlignItems,
                wrap: sFlexWrap,
                direction: sFBoxDirection,
                items: [
                    this.oLabel,
                    this.oSwitchButton
                ]
            });

            this.vBox = new sap.m.VBox({
                items: [this.fBox, this.oMessage]
            });

            return this.vBox;
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.usageAnalytics_selector.UsageAnalyticsSelector";
        }
    });
}());