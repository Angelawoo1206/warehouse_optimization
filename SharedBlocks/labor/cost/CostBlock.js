sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var CostBlock = BlockBase.extend("sap.m.sample.SemanticPage.SharedBlocks.labor.cost.CostBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.labor.cost.CostBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.labor.cost.CostBlock",
					type: "XML"
				}
			}
		}
	});
	return CostBlock;
}, true);
