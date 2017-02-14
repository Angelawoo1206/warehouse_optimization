sap.ui.define([
    "sap/ui/comp/smartfilterbar/SmartFilterBar"
], function(SmartFilterBar) {
    "use strict";

	var FILTER_MODE_COMPACT = "compact";
	var FILTER_MODE_VISUAL = "visual";

	// Need to integrate with the existing smart filter bar integration with the SmartChart and SmartTable.
	// Since we have no control over changing the SmartFilterBar, SmartTable and SmartChart, and we need the
	//   SmartVisualFilterBar to integrate with the SmartChart and SmartTable, it makes sense to extend the SmartFilterBar to act as a fascade.
	//   This fascade will return the correct set of filters when in either Visual Filter mode or the standard Compact filter mode.
	var SmartFilterBarExt = SmartFilterBar.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt", {
		metadata: {
			properties: {
				mode: { type: "string", group: "Misc", defaultValue: FILTER_MODE_COMPACT },
				smartVisualFilterBarId: { type: "string", group: "Misc", defaultValue: null }
			}
		},
		renderer: {}
	});

	SmartFilterBarExt.prototype.setMode = function(mode, silent) {
		var oldMode = this.getProperty("mode");
		this.setProperty("mode", mode);

		// TODO: decide if this should be done automatically on mode switch, could delay until new filter is applied, but might be confusing
		if (mode == FILTER_MODE_VISUAL && !this._initVisualFilterBar) {

			var vfb = this._getSmartVisualFilterBar();
			vfb.attachFilterChange(this._onVisualFilterChange, this);

			this._initVisualFilterBar = true;
		}
		
		if (oldMode !== mode && !silent)
			this.fireSearch(); // trigger listening controls to apply the new filters
	};

	SmartFilterBarExt.prototype.getFilters = function() {
		if (this.getMode() == FILTER_MODE_COMPACT) // default behavior for the compact filter
			return SmartFilterBar.prototype.getFilters.apply(this, arguments);

		var vfb = this._getSmartVisualFilterBar();
		return vfb ? vfb.getFilters() : [];
	};

	SmartFilterBarExt.prototype.getFilterData = function() {
		if (this.getMode() == FILTER_MODE_COMPACT) // default behavior for the compact filter
			return SmartFilterBar.prototype.getFilterData.apply(this, arguments);

		var vfb = this._getSmartVisualFilterBar();
		return vfb ? vfb.getFilterData() : {};
	};

	SmartFilterBarExt.prototype.getParameters = function() {
		if (this.getMode() == FILTER_MODE_COMPACT) // default behavior for the compact filter
			return SmartFilterBar.prototype.getParameters.apply(this, arguments);

		// Not supported for the Visual Filter Bar yet, but used by the SmartTable/SmartChart, so placeholder
		return;
	};

	SmartFilterBarExt.prototype.isPending = function() {
		if (this.getMode() == FILTER_MODE_COMPACT) // default behavior for the compact filter
			return SmartFilterBar.prototype.isPending.apply(this, arguments);

		// Not supported for the Visual Filter Bar yet, but used by the SmartTable/SmartChart, so placeholder
		return;
	};

	SmartFilterBarExt.prototype.search = function() {
		//if (this.getMode() == FILTER_MODE_COMPACT) // default behavior for the compact filter
			return SmartFilterBar.prototype.search.apply(this, arguments);

		// Not supported for the Visual Filter Bar yet, but used by the SmartTable/SmartChart, so placeholder
		//return;
	};

	SmartFilterBarExt.prototype.getFilterCount = function() {
		if (this.getMode() == FILTER_MODE_COMPACT) { // default behavior for the compact filter
			var filters = SmartFilterBar.prototype.retrieveFiltersWithValues.apply(this, arguments);
			return filters ? filters.length : 0;
		}

		var vfb = this._getSmartVisualFilterBar();
		return vfb ? vfb.getFilterCount() : 0;
	};

	SmartFilterBarExt.prototype._onVisualFilterChange = function() {
		this.fireFilterChange();
		this.fireSearch();
	};

	SmartFilterBarExt.prototype._getSmartVisualFilterBar = function() {
		return this._findControl(this.getSmartVisualFilterBarId());
	};

	SmartFilterBarExt.prototype._findControl = function(id) {
		if (!id)
			return null;

		var control = sap.ui.getCore().byId(id); // Global lookup
		if (control)
			return control;

		// not found globally, so lookup in scope of the view
		var view = this._getView();

		if (view)
			return view.byId(id);

		return null;
	};

	SmartFilterBarExt.prototype._getView = function() {
		if (this._view)
			return this._view;

		var p = this.getParent();
		while (p) {
			if (p instanceof sap.ui.core.mvc.View) {
				this._view = p;
				break;
			}
			p = p.getParent();
		}

		return this._view;
	};
});
