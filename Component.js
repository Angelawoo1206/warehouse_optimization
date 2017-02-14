sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.m.sample.SemanticPage.Component", {

		metadata : {          
            manifest:"json"
//			rootView : "sap.m.sample.SemanticPage.view.Page",
//			dependencies : {
//				libs : [
//					"sap.m"
//				]
//			},
//            manifest:"json",
//			config : {
//				sample : {
//					stretch : true,
//					files : [
//						"Page.view.xml",
//						"Page.controller.js"
//					]
//				}
//			}
		},
        
        init:function(){
        UIComponent.prototype.init.apply(this, arguments);
        }
	});
    
	return Component;

});
