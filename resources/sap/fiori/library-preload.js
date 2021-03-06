/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *
 * (c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/fiori/library',['jquery.sap.global','sap/ui/core/Core','sap/ui/core/library','jquery.sap.resources'],function(q,C,l){"use strict";sap.ui.getCore().initLibrary({name:"sap.fiori",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],version:"1.44.7"});var c=sap.ui.getCore().getConfiguration(),L=c.getLanguage(),d=c.getLanguagesDeliveredWithCore(),a=q.sap.resources._getFallbackLocales(L,d);L=a[0];if(L&&!window["sap-ui-debug"]){q.sap.require("sap.fiori.messagebundle-preload_"+L);}return sap.fiori;});
jQuery.sap.registerPreloadedModules({
"name":"sap/fiori/library-preload",
"version":"2.0",
"modules":{
	"sap/fiori/manifest.json":'{\n  "_version": "1.2.0",\n  "sap.app": {\n    "_version": "1.2.0",\n    "id": "sap.fiori",\n    "type": "library",\n    "embeds": [],\n    "applicationVersion": {\n      "version": "1.44.7"\n    },\n    "title": "A hybrid UILibrary merged from the most common UILibraries that are used in Fiori apps",\n    "description": "A hybrid UILibrary merged from the most common UILibraries that are used in Fiori apps",\n    "resources": "resources.json",\n    "offline": true\n  },\n  "sap.ui": {\n    "_version": "1.1.0",\n    "technology": "UI5",\n    "supportedThemes": [\n      "base",\n      "sap_belize",\n      "sap_belize_plus",\n      "sap_bluecrystal",\n      "sap_hcb"\n    ]\n  },\n  "sap.ui5": {\n    "_version": "1.1.0",\n    "dependencies": {\n      "minUI5Version": "1.44",\n      "libs": {\n        "sap.ui.core": {\n          "minVersion": "1.44.6"\n        }\n      }\n    }\n  }\n}'
}});
//# sourceMappingURL=library-preload.js.map