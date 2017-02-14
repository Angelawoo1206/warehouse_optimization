sap.ui.define([
	"sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";

	var SlottingOptimizationBlock = BlockBase.extend("sap.m.sample.SemanticPage.SharedBlocks.slotting.SlottingOptimizationBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.slotting.SlottingOptimizationBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.slotting.SlottingOptimizationBlock",
					type: "XML"
				}
			}
		}
	});
	return SlottingOptimizationBlock;
}, true);
