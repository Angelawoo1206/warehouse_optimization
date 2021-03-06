sap.ui.define(["sap/ui/core/Control", "sap/ui/model/Filter"],
	function(Control) {
	"use strict";

	/* all visual filters should extend this class */
	var FilterItem = Control.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItem", {
		metadata: {
			properties: {
				filterRestriction : { type: "string", group: "Misc", defaultValue: null },
				entitySet: { type: "string", group: "Misc", defaultValue: null },
				dimensionField: { type: "string", group: "Misc", defaultValue: null },
				dimensionFieldIsDateTime: { type: "boolean", group: "Misc", defaultValue: false },
				dimensionFieldDisplay: { type: "string", group: "Misc", defaultValue: null },
				dimensionFilter: { type: "object[]", group: "Misc", defaultValue: null },
				dimensionFilterExternal: { type: "sap.ui.model.Filter", group: "Misc", defaultValue: null },
				measureField: { type: "string", group: "Misc", defaultValue: null },
				measureSortDescending: { type: "boolean", group: "Misc", defaultValue: false },
				unitField: { type: "string", group: "Misc", defaultValue: null },
				width: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue : null},
				height: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue : null},
				title: { type: "string", group: "Misc", defaultValue: "" },
				outParameter: { type: "string", group: "Misc", defaultValue: null },
				inParameters: { type: "object[]", group: "Misc", defaultValue: null},
				parentProperty: { type: "string", group: "Misc", defaultValue: null },
				sortOrder: { type: "object[]", group: "Misc", defaultValue: null},
				scaleFactor : {type: "string", group: "Misc", defaultValue: null}
			},
			aggregations: {
				control: {type: "sap.ui.core.Control", multiple: false}
			},
			events: {
				filterChange: {},
				titleChange: {}
			}
		},
		renderer: {}
	});

	return FilterItem;

}, /* bExport= */ true);
