sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var TimeBlock = BlockBase.extend("sap.m.sample.SemanticPage.SharedBlocks.labor.time.TimeBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.labor.time.TimeBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.m.sample.SemanticPage.SharedBlocks.labor.time.TimeBlock",
					type: "XML"
				}
			}
		}
	});
	return TimeBlock;
}, true);
