//define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.components.factsheet.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

sap.ui.core.UIComponent.extend("sap.ushell.components.factsheet.Component", {
    oMainView : null,

    // use inline declaration instead of component.json to save 1 round trip
    metadata: {
        version : "1.44.6",
        library : "sap.ushell.components.factsheet",
        dependencies : {
            libs : [ "sap.m", "sap.ui.vbm", "sap.suite.ui.commons", "sap.ui.layout", "sap.viz" ],
            components : []
        }
    },

    createContent: function () {
        "use strict";
        var oComponentData = this.getComponentData();
        // startup parameters are passed as a property bag as componentData.startupParameters
        var oStartupParameters = ( oComponentData && oComponentData.startupParameters) || {};
        // factsheet component needs 100% height otherwise it does not work
        this.oMainView = sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName:  "sap.ushell.components.factsheet.views.ThingViewer",
            viewData: oStartupParameters,
            height: "100%"
        }).addStyleClass("ThingViewer");

        return this.oMainView;
    },

    exit: function () {
        "use strict";
        window.console.log("On Exit of factsheet Component.js called : this.getView().getId()" + this.getId());
    },

    // this event does not exist !?
    onExit: function () {
        "use strict";
        window.console.log("On Exit of factsheet Component.js called : this.getView().getId()" + this.getId());
    }
});

jQuery.sap.setObject("factsheet.Component", sap.ushell.components.factsheet.Component);