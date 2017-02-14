// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, setTimeout, clearTimeout */
    /*jslint plusplus: true, nomen: true */
    sap.ui.controller("sap.ushell.renderers.fiori2.userAccount.UserAccountSelector", {

        onInit: function () {
            var oView = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            var oUser = sap.ushell.Container.getUser();
            var sName = oUser.getFullName();
            var sMail = oUser.getEmail();
            var modelData = {
                name: sName,
                mail: sMail,
                server: window.location.host
            };
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
            oDfd.resolve(sap.ushell.Container.getUser().getFullName());
            return oDfd.promise();
        },

        onCancel: function () {
        },

        onSave: function () {
            var oDfd = jQuery.Deferred();
            oDfd.resolve();
            return oDfd.promise();
        }
    });
}());