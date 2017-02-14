(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.declare("sap.ovp.cards.map.Component");
	jQuery.sap.require("sap.ovp.cards.generic.Component");

	sap.ovp.cards.generic.Component.extend("sap.ovp.cards.map.Component", {
		// use inline declaration instead of component.json to save 1 round trip
		metadata: {
			properties: {
				"contentFragment": {
					"type": "string",
					"defaultValue": "sap.ovp.cards.map.GeographicalMap"
				},
				"geoLocationAnnotationPath": {
					"type": "string",
					"defaultValue": "com.sap.vocabularies.UI.v1.GeoLocation"
				}
			},

			version: "1.44.6",

			library: "sap.ovp",

			includes: [],

			dependencies: {
				libs: ["sap.m"],
				components: []
			},
			config: {},
			customizing: {
				"sap.ui.controllerExtensions": {
					"sap.ovp.cards.generic.Card": {
						controllerName: "sap.ovp.cards.map.GeographicalMap"
					}
				}
			}
		}
	});
})();