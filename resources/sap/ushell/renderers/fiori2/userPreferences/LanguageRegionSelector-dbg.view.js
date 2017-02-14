// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, document, self */
    /*jslint plusplus: true, nomen: true, vars: true */

    sap.ui.jsview("sap.ushell.renderers.fiori2.userPreferences.LanguageRegionSelector", {
        createContent: function (oController) {
            var itemTemplate = new sap.ui.core.Item({
                text: "{text}",
                key: "{key}"
            });
            var i18n = sap.ushell.resources.i18n;
            var sFlexDirection = sap.ui.Device.system.phone ? 'Column' : 'Row';
            var sFlexAlignItems = sap.ui.Device.system.phone ? 'Stretch' : 'Center';
            var sTextAlign = sap.ui.Device.system.phone ? 'Left' : 'Right';
            var sLabelWidth = sap.ui.Device.system.phone ? "auto" : "12rem";
            var sComboBoxWidth = sap.ui.Device.system.phone ? "100%" : undefined;
            var languageLabel = new sap.m.Label('languageSelectionLabel', {
                text: {
                    path: "/selectedLanguage",
                    formatter: function (sSelectedLanguage) {
                        //If the language value has region - for example 'en(us)', the label should be 'Language and Region'. Otherwise, it should be 'Language'.
                        return i18n.getText(sSelectedLanguage.indexOf('(') > -1 ? "languageAndRegionTit" : "languageRegionFld") + ':';
                    }
                },
                width: sLabelWidth,
                textAlign: sTextAlign
            });

            var fboxLanguage = new sap.m.FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    languageLabel,
                    new sap.m.Input('languageSelectionInput', {
                        value: "{/selectedLanguage}",
                        editable: false
                    }).addAriaLabelledBy(languageLabel)
                ]
            });
            var dateLabel = new sap.m.Label({
                text: i18n.getText("dateFormatFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });
            var fboxDate = new sap.m.FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    dateLabel,
                    new sap.m.ComboBox({
                        width: sComboBoxWidth,
                        items: {
                            path: "/datePatternList",
                            template: itemTemplate
                        },
                        selectedKey: "{/selectedDatePattern}",
                        editable: false
                    }).addAriaLabelledBy(dateLabel)
                ]
            });

            this.hourFormatSegmentedButton = new sap.m.SegmentedButton({
                enabled: false,
                width: "10rem",
                buttons: [
                    new sap.m.Button({
                        text: i18n.getText("btn12h")
                    }),
                    new sap.m.Button({
                        text: i18n.getText("btn24h")
                    })
                ]
            });

            var fboxTime = new sap.m.FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    new sap.m.Label({
                        text: i18n.getText("timeFormatFld") + ":",
                        width: sLabelWidth,
                        textAlign: sTextAlign
                    }),
                    this.hourFormatSegmentedButton
                ]
            });

            var vbox = new sap.m.VBox({
                items: [fboxLanguage, fboxDate, fboxTime]
            });
            vbox.addStyleClass("sapUiSmallMargin");

            return vbox;
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.userPreferences.LanguageRegionSelector";
        }
    });

}());