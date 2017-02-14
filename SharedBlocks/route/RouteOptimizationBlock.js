sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var RouteOptimizationBlock = BlockBase.extend("sap.m.sample.SemanticPage.SharedBlocks.route.RouteOptimizationBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.route.RouteOptimizationBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.route.RouteOptimizationBlock",
					type: "XML"
				}
			}
		}
	});
	return RouteOptimizationBlock;
}, true);
