sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var MinimumProcessingTimeBlock = BlockBase.extend("sap.m.sample.SemanticPage.SharedBlocks.labor.ProcessingTime.MinimumProcessingTimeBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.labor.ProcessingTime.MinimumProcessingTimeBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.labor.ProcessingTime.MinimumProcessingTimeBlock",
					type: "XML"
				}
			}
		}
	});
	return MinimumProcessingTimeBlock;
}, true);
