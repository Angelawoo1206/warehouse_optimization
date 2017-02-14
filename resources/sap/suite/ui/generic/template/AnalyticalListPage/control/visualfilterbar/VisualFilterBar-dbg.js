sap.ui.define([
	"sap/suite/ui/commons/HeaderContainer", "sap/suite/ui/commons/HeaderContainerRenderer"
], function(HeaderContainer, HeaderContainerRenderer) {
	"use strict";

	var VisualFilterBar = HeaderContainer.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.VisualFilterBar", {
		metadata: {
			properties: {
				entitySet: { type: "string", group: "Misc", defaultValue: null }
			},
			events: {
				filterChange: {}
			}
		},

		renderer: HeaderContainerRenderer.render
	});

	VisualFilterBar.prototype.init = function() {
		if (HeaderContainer.prototype.init)
			HeaderContainer.prototype.init.apply(this, arguments);

		this.addStyleClass("sapSuiteVisualFilterBar");
	};

	return VisualFilterBar;
}, /* bExport= */true);
