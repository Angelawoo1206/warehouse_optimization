// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, setTimeout, clearTimeout */
    /*jslint plusplus: true, nomen: true */
    sap.ui.controller("sap.ushell.renderers.fiori2.userPreferences.LanguageRegionSelector", {

        onInit: function () {
            var oView = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            var oUser = sap.ushell.Container.getUser();
            var sLanguage = oUser.getLanguage();
            var modelData = {
                languageList: [{text: sLanguage, key: sLanguage}],
                selectedLanguage: this._getFormatedLanguage(sLanguage)
            };

            var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),
                oLocaleData = sap.ui.core.LocaleData.getInstance(oLocale);
            var sDatePattern = oLocaleData.getDatePattern("medium");
            var sTimePattern = oLocaleData.getTimePattern("medium");
            modelData.datePatternList = [{text: sDatePattern, key: sDatePattern}];
            modelData.selectedDatePattern = sDatePattern;

            var hourButtons = oView.hourFormatSegmentedButton.getButtons();
            var selectedButton = (sTimePattern.indexOf("H") === -1) ? hourButtons[0] : hourButtons[1];
            oView.hourFormatSegmentedButton.setSelectedButton(selectedButton);

            oModel.setData(modelData);
            this.oModel = oModel;
            oView.setModel(oModel);

        },

        getContent: function () { 
            var oDfd = jQuery.Deferred();
            oDfd.resolve(this.getView());
            return oDfd.promise();
        },

        getValue: function () {
            var oDfd = jQuery.Deferred();
            oDfd.resolve(this.oModel.getProperty("/selectedLanguage"));
            return oDfd.promise();
        },

        onCancel: function () {
        },

        onSave: function () {
            var oDfd = jQuery.Deferred();
            oDfd.resolve();
            return oDfd.promise();
        },

        _getFormatedLanguage: function (sLanguage) {
            //In case the language value is with region - for example 'en-us', the value would be 'EN (us)'. Otherwise, the value will be 'EN'.
            if (sLanguage && sLanguage.indexOf('-') > -1) {
                sLanguage = sLanguage.replace('-', ' (').concat(')').toUpperCase();
            } else if (sLanguage) {
                sLanguage = sLanguage.toUpperCase();
            }

            return sLanguage;
        }
    });
}());