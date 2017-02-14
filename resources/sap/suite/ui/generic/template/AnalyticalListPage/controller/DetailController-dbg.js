/* global $ */
sap.ui.define([
		"sap/ui/base/EventProvider",
		"sap/ui/comp/personalization/Util",
		"sap/suite/ui/generic/template/AnalyticalListPage/control/VariantToggleButton",
		"sap/ui/table/AnalyticalTable",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/FilterType"
	],
    function(EventProvider, PersonalizationControllerUtil, VariantToggleButton, AnalyticalTable, Controller, FilterType) {
		"use strict";
		var eventProvider = new EventProvider();

		var CHARTTABLE_MODE_MIRROR = "mirror";
		var CHARTTABLE_MODE_MASTERDETAIL = "masterDetail";
		var CHARTTABLE_MODES = [
			CHARTTABLE_MODE_MIRROR,
			CHARTTABLE_MODE_MASTERDETAIL
		];

		var tController = Controller.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.DetailController", {
			setState: function(oState) {
				var me = this;
				this.oState = oState;

				this._enableExpandByFilter = true;
				this._enableUpdateExpandLevelInfo = false;
				this._isRebindTriggeredByChart = false;
				this._enableStrictFilter = false; // Disabled as per BCP ticket: 1670330838

				var smartTable = this.oState.oSmartTable;
				var table = smartTable.getTable();
				table.attachEvent("_rowsUpdated", function(ev) {
					me._updateRows("_rowsUpdated");
				});

				var oComponent = this.oState.oController.getOwnerComponent();
				//Default to filter behavior instead of highlight
				this._autoHide = oComponent.getAutoHide() != undefined ? oComponent.getAutoHide() : true;

				smartTable.attachInitialise(this._onSmartTableInit, this);
				smartTable.attachDataReceived(this._onDataReceived, this);
				smartTable.attachBeforeRebindTable(this._onBeforeRebindTable, this);

				// Since the SmartTable in this detail area is not directly connected to the SmartFilterBar, we need to intercept some of the regular events which
				// would cause an overlay to show on the SmartTable and simulate a direct connection.
				/*var origTableShowOverlay = this.oState.oSmartTable._showOverlay;
				this.oState.oSmartTable._showOverlay = function() {
					origTableShowOverlay.apply(me.oState.oSmartTable, arguments);
					smartTable._showOverlay.apply(smartTable, arguments);
				};*/
			},
			_onSmartTableInit: function() {
				// The personalization controller is only available at this point
				// Create the mirror/masterDetail toggle button
				var toggleBtn = new VariantToggleButton("", {
					icon:"sap-icon://hide",
					pressed: this._autoHide,
					persistencyKey: "alr_charttablemode_toggleButton",
					smartVariant: this.oState.alr_pageVariant,
					press:$.proxy(this._onAutoHideToggle, this),
					visible: this.oState.oController.getOwnerComponent().getShowAutoHide() == true
				});

				//Initialize the chart table mode settings
				//TODO RC Find better way to do this
				this._getChartTableMode();

				this.oState._autoHideToggleBtn = toggleBtn;

				//Add additional toolbar buttons in table only mode
				if (this.oState._pendingTableToolbarInit && this.oState._containerView == "table") {
					this.oState.oSmartTable._oToolbar.addContent(this.oState.alr_fullScreenButton);
					this.oState.oSmartTable._oToolbar.addContent(this.oState.alr_viewSwitchButton);
				}
				// Add to the SmartTable's toolbar to the left of the settings button.
				if ( this.oState._pendingTableToolbarInit ){
						var smartTable = this.oState.oSmartTable;
						var toolbar = smartTable.getCustomToolbar();
						var oToolBarcontent = toolbar.getContent();
						var nSettingsLength ;
						// this block gets the position of the eye icon in the toolbar i.e just before the settins icon
						for (var i = 0; i < oToolBarcontent.length ;  i++) {
							if (oToolBarcontent[i].mProperties.text === "Settings") {
								nSettingsLength = i ;
                                                        }
						}
						toolbar.insertContent(this.oState._autoHideToggleBtn, nSettingsLength);
						delete this.oState._pendingTableToolbarInit;
				}
				this._updateToggleTooltip();
				if (this.oState.oSmartTable._oPersController)
					this.oState.oSmartTable._oPersController.attachAfterP13nModelDataChange(jQuery.proxy(this._onAfterP13nModelDataChange, this));
			},
			_onAfterP13nModelDataChange: function(ev) {
				this._lastFilter = "";
				this.oState.chartController.updateTable();
			},
			_onBindingDataReceived: function() {
				var table = this.oState.oSmartTable.getTable();

				// check if table is analytical
				if (table instanceof AnalyticalTable) {
					// new data has arrived, expand if needed
					this._expandByFilter("bindingDataReceived");
				}
			},
			_onDataReceived: function() {
				this.oState.oSmartTable.detachDataReceived(this._onDataReceived, this);
				this.fireInitComplete();
			},
			_onAutoHideToggle: function(ev) {
				// update the auto hide mode, if it is pressed auto hide is ON, apply filter else only selected
				this._autoHide = this.oState._autoHideToggleBtn.getPressed();

				// update the tooltip
				this._updateToggleTooltip();
				//trigger table update so show the changes
				this.oState.chartController.updateTable();
				//ToDo: Remove it after the above behavior is final
				// TODO RC Check with Vincent
				//Do we need this here, because chart is anyway invoking the method to filter/selection
				/*if (this._autoHide) { // then clear filters, could have been previously set
					var entitySet = this.oState.oController.getOwnerComponent().getEntitySet();

					this._applyParamsToTableAsFilter(entitySet, null, [], [], []);
				}*/
				//Informs the chart about mode change (There should be better way to do this).
				//Chart then collects its dimensions and perform filter / selection on table.
				this.fireAutoHideToggle();
			},
			_updateToggleTooltip: function() {
				var tooltipId = this._autoHide ? "CHARTTABLE_AUTOHIDE_ON" : "CHARTTABLE_AUTOHIDE_OFF";
				var tooltip = this.oController.oView.getModel("i18n").getResourceBundle().getText(tooltipId);
				this.oState._autoHideToggleBtn.setTooltip(tooltip);
			},
			/**
			 * Called before rebinding table
			 * @param  {Object} oEvent Event Object
			 */
			_onBeforeRebindTable: function(oEvent) {
				var variant = this.oState.oSmartTable.fetchVariant(),
					lastVariant = variant,
					changeObject = {};
				if (!variant)
					return;

				// Update the chart with the personalization state
				// Get the list of grouped columns
				var groupList = [];
				var colList = this.oState.oSmartTable.getTable().getColumns();
				for (var i = 0; i < colList.length; i++) {
					var col = colList[i];
					//getGrouped is only available for Analytical Table
					if (col.getGrouped && col.getGrouped())
						groupList.push(col.getLeadingProperty ? col.getLeadingProperty() : PersonalizationControllerUtil.getColumnKey(col));
				}

				this._updateExpandLevelInfo(groupList);

				var sortList = [];
				if (variant.sort && variant.sort.sortItems) {
					for (var i = 0; i < variant.sort.sortItems.length; i++) {
						var isDescending = variant.sort.sortItems[i].operation === "Descending" ? true : false;
						sortList.push(new sap.ui.model.Sorter(variant.sort.sortItems[i].columnKey, isDescending));
					}
				} else if (!lastVariant.sort) { // check if last variant had sort, if not -> all sort removed from table
					changeObject.allTableSortRemoved = true;
				}

				if (!this._isRebindTriggeredByChart && this.isMirrorMode()) { // only inform the outside (chart) if in mirror mode
					this._paramListFiltered = [];
					this._lastSelected = null;

					if (groupList.length > 0) {
						changeObject.groupList = groupList;
					}

					if (sortList.length > 0) {
						changeObject.sortList = sortList;
					}
					this.fireTableChange(changeObject);
				} else {
					this._isRebindTriggeredByChart = false;
				}

				//Make sure views with paramters are working and change the tableBindingPath to the pattern parameterSet(params)/resultNavProp
				if (this.oState.oSmartFilterbar && this.oState.oSmartFilterbar.getAnalyticBindingPath && this.oState.oSmartFilterbar.getConsiderAnalyticalParameters()) {
					//catching an exception if no values are yet set.
					//TODO: This event actually shoudn't be called before mandatory fields are populated
					try {
						var sAnalyticalPath = this.oState.oSmartFilterbar.getAnalyticBindingPath();
						if (sAnalyticalPath) {
							this.oState.oSmartTable.setTableBindingPath(sAnalyticalPath);
						}
					} catch (e) {
						jQuery.sap.log.warning("Mandatory parameters have no values", "", "AnalyticalListPage");
					}
				}

				//Call controller extension
				this.oState.oController.onBeforeRebindTableExtension(oEvent);
			},
			////////////////////////////////
			// EVENT: AutoHideToggle
			////////////////////////////////
			attachAutoHideToggle: function(oData, fnFunction, oListener) {
				return eventProvider.attachEvent("AutoHideToggle", oData, fnFunction, oListener);
			},
			detachAutoHideToggle: function(fnFunction, oListener) {
				return eventProvider.detachEvent("AutoHideToggle", fnFunction, oListener);
			},
			fireAutoHideToggle: function(mArguments) {
				return eventProvider.fireEvent("AutoHideToggle", mArguments);
			},
			///////////////////////
			// EVENT: TableChange
			///////////////////////
			attachTableChange: function(oData, fnFunction, oListener) {
				return eventProvider.attachEvent("TableChange", oData, fnFunction, oListener);
			},
			detachTableChange: function(fnFunction, oListener) {
				return eventProvider.detachEvent("TableChange", fnFunction, oListener);
			},
			fireTableChange: function(mArguments) {
				return eventProvider.fireEvent("TableChange", mArguments);
			},
			////////////////////////
			// EVENT: InitComplete
			////////////////////////
			attachInitComplete: function(oData, fnFunction, oListener) {
				return eventProvider.attachEvent("InitComplete", oData, fnFunction, oListener);
			},
			detachInitComplete: function(fnFunction, oListener) {
				return eventProvider.detachEvent("InitComplete", fnFunction, oListener);
			},
			fireInitComplete: function(mArguments) {
				return eventProvider.fireEvent("InitComplete", mArguments);
			},
			setDetailViewController: function(oController) {
				this.oController = oController;
			},
			isMasterDetailMode: function() {
				return this._getChartTableMode() == CHARTTABLE_MODE_MASTERDETAIL;
			},
			isMirrorMode: function() {
				return this._getChartTableMode() == CHARTTABLE_MODE_MIRROR;
			},
			_getChartTableMode: function() {
				if (this._chartTableMode) // use the already set setting
					return this._chartTableMode;

				this._chartTableMode = CHARTTABLE_MODE_MASTERDETAIL; // Default to MasterDetail mode

				// get from the manifest
				var mode = this.oState.oController.getOwnerComponent().getChartTableMode();

				//The mode choice is a design time configuration and hence
				if (mode) { // defined in the configuration
					if (CHARTTABLE_MODES.indexOf(mode) == -1)
						throw new Error("Unsupported chartTableMode: " + mode);

					this._chartTableMode = mode;
				}

				return this._chartTableMode;
			},
			applyParamsToTable: function(paramList, lastSelected, dimNameList, groupList, sortData, updateType) {
				var entitySet = this.oState.oController.getOwnerComponent().getEntitySet();

				this._isRebindTriggeredByChart = true;
				// Handle the table action based on the chartTable autoHide mode we are in, i.e. filter for autoHide on, select for off
				if (this._autoHide) {
					if (this._enableStrictFilter)
						this._applyParamsToTableAsFilter_strict(entitySet, paramList, dimNameList, groupList, updateType);
					else
						this._applyParamsToTableAsFilter(entitySet, paramList, dimNameList, groupList, sortData, updateType);
				}
				else {
					this._applyParamsToTableAsHighlight(entitySet, paramList, lastSelected, dimNameList, groupList, sortData, updateType);
				}
			},
			_applyParamsToTableAsFilter: function(entitySet, paramList, dimNameList, groupList, sortData, updateType) {
				if (!this.oState)
					return;

				var table = this.oState.oSmartTable.getTable();
				var binding = this._getTableBinding(table);
				if (!binding) { // if columns haven't been choosen then binding is undefined
					jQuery.sap.log.error("No table binding to apply the filter(s) to");
					return;
				}

				this._updateGrouping(table, groupList);
				if (sortData !== undefined && this.isMirrorMode()) {
					this._updateSorting(table, sortData);
				}

				var filterList = [];

				for (var i = 0; i < paramList.length; i++) {
					var param = paramList[i];

					for (var name in param) {
						// Check if the filter exits
						if (dimNameList.indexOf(name) == -1 || !this._getBindingProperty(binding, name)) {
							jQuery.sap.log.warning("Could not apply filter with name \"" + name + "\" as that field does not exist in the entity type");
							continue;
						}

						filterList.push(new sap.ui.model.Filter({
							path: name,
							operator: sap.ui.model.FilterOperator.EQ,
							value1: param[name]
						}));
					}
				}

				// Also apply the global filters
				this.filterList = filterList;

				var finalFilter;
				if (filterList.length > 0) {// overwrite all filters, based on actual selection from the chart
					//finalFilter holds all the chart selections
					finalFilter = filterList;
					if (this._getPageFilters(binding).length > 0) {
						//push the filters of compact so that table gets updated based on both chart selection and the filters
						finalFilter.push(this._getPageFilters(binding)[0]);
					}
				} else {
					finalFilter = this._getPageFilters(binding);
				}

				if (!this._lastFilter) {
					this._lastFilter = binding.aApplicationFilter;
				}

				if (this._isFilterDiff(this._lastFilter, finalFilter)) {
					binding.filter(finalFilter, FilterType.Application);
					this._lastFilter = finalFilter;
				}

				this._updateRows(updateType);
			},
			_updateSorting: function (table, sortData) {

				var colList = table.getColumns(),
					colMap = {},
					variant = this.oState.oSmartTable.fetchVariant(),
					variantJson = {};
				var colMap = {};
				for (var i = 0; i < colList.length; i++) {
					var col = colList[i];
					if (!PersonalizationControllerUtil.isSortable(col)) // Only group those that are groupable
						continue;

					var colKey = col.getLeadingProperty ? col.getLeadingProperty() : PersonalizationControllerUtil.getColumnKey(col);
					colMap[colKey] = col;
				}

				if (sortData.allSortRemoved) {
					// removing sort from table variant and reapplying
					for (var key in variant) {
						if (key !== "sort") {
							variantJson[key] = variant[key];
						}
					}

					this.oState.oSmartTable.applyVariant(variantJson);
					//this.oState.oSmartTable.rebindTable(true);
				} else {
					variant.sort = {};
					variant.sort.sortItems = [];

					for (var i = 0; i < sortData.sortList.length; i++) { // set grouping in the order as specified in the groupList (coming from the Chart)
						var name = sortData.sortList[i].columnKey;

						var col = colMap[name];
						if (!col)
							continue;

						//col.setSortProperty(name);
						//col.setSortOrder(sortList[i].operation);
						/*col.setShowSortMenuEntry(true);
						col.setSorted(true);
						col.setSortOrder(sortList[i].operation);*/
						/*	TODO: Saurabh - col.sort() has been deprecated as per documentation an it is recommended
							to use table.sort(), however the problem with both is that they sort on one and only one column
							and  set the personalization data accordingly for one column only. However the sorlist being passed from the chart
							can have multiple columns to sort on. Will have to further debug to see how does smart table maintain this behaviour
						*/
						//col.sort(sortList[i].operation === 'Descending');

						//table.sort(col, sortData.sortList[i].operation);
						variant.sort.sortItems.push({
							columnKey: name,
							operation: sortData.sortList[i].operation
						});

						//this.oState.oSmartTable.applyVariant(variantJson);

						delete colMap[name]; // remove from map so that it can be marked as not grouped
					}
					this.oState.oSmartTable.applyVariant(variant);
				}
			},
			_getBindingProperty: function(binding, name) {
				if (binding.getProperty) {
					return binding.getProperty(name);
				}
				else {
					var propList = binding.oEntityType.property;
					for (var i = 0; i < propList.length; i++) {
						if (propList[i].name == name)
							return propList[i];
					}

					return null;
				}
			},
			// This method is an implementation of strict filtering, but is currently not used due to an ABAP OData limitation.
			// BCP ticket: 1670330838
			// Jira item: FIORITECHP1-2298
			_applyParamsToTableAsFilter_strict: function(entitySet, paramList, dimNameList, groupList, updateType) {
				if (!this.oState)
					return;

				var table = this.oState.oSmartTable.getTable();
				var binding = this._getTableBinding(table);
				if (!binding) { // if columns haven't been choosen then binding is undefined
					jQuery.sap.log.error("No table binding to apply the filter(s) to");
					return;
				}

				var filterList = [];

				for (var i = 0; i < paramList.length; i++) {
					var param = paramList[i];

					var subFilterList = [];
					for (var name in param) {
						// Check if the filter exits
						if (!binding.getProperty(name) || dimNameList.indexOf(name) == -1) {
							jQuery.sap.log.warning("Could not apply filter with name \"" + name + "\" as that field does not exist in the entity type");
							continue;
						}

						subFilterList.push(new sap.ui.model.Filter({
							path: name,
							operator: sap.ui.model.FilterOperator.EQ,
							value1: param[name]
						}));
					}

					filterList.push(new sap.ui.model.Filter({
							aFilters: subFilterList,
							and: true
						}));
				}

				// Also apply the global filters
				this.filterList = filterList;

				var filter = new sap.ui.model.Filter({
					aFilters: filterList,
					and: true
				});

				var finalFilter;
				if (filterList.length > 0) {// overwrite all filters, based on actual selection from the chart
					finalFilter = filter;
				} else {
					finalFilter = this._getPageFilters(binding);
				}

				if (!this._lastFilter) {
					this._lastFilter = binding.aApplicationFilter;
				}

				if (this._isFilterDiff(this._lastFilter, finalFilter)) {
					binding.filter(finalFilter, FilterType.Application);
					this._lastFilter = finalFilter;
				}
			},
			_isFilterDiff: function(f1, f2) {
				if ($.isArray(f1) != $.isArray(f2))
					return true;

				if ($.isArray(f1))
					return this._isFilterListDiff(f1, f2);
				else
					return this._isFilterObjDiff(f1, f2);
			},
			_isFilterObjDiff: function(f1, f2) {
				if (!f1 || !f2)
					return true;
				for (var a in f1) {
					if (a == "aFilters") {
						if (this._isFilterListDiff(f1.aFilters, f2.aFilters))
							return true;
					}
					else if (f1[a] != f2[a])
						return true;
				}

				return false;
			},
			_isFilterListDiff: function(fList1, fList2) {
				if (!fList1 || !fList2)
					return true;
				if (fList1.length != fList2.length)
					return true;

				for (var i = 0; i < fList1.length; i++) {
					var f1 = fList1[i];
					var f2 = fList2[i];

					if (this._isFilterObjDiff(f1, f2))
						return true;
				}

				return false;
			},
			_getPageFilters: function(oBinding) {
				var pageFilterList = this.oState.oSmartFilterbar.getFilters();

				for (var i = 0; i < pageFilterList.length; i++) {
					// in case there are more than one value in the filter
					// or the filter property is sap:filter-restriction="multi-value"
					if (pageFilterList[i].aFilters !== undefined) {

						var filterList = pageFilterList[i].aFilters;

						for (var j = 0; j < filterList.length; j++) {
							var filter = filterList[j];
							var name = filter.sPath;

							// Check if the filter exits
							if (!oBinding.getProperty(name)) {
								jQuery.sap.log.warning("Could not apply filter with name \"" + name + "\" as that field does not exist in the entity type");
								continue;
							}

							filter.sPath = name;
						}
					} else {
						// in case property with sap:filter-restriction="single-value" is the only value in the filter
						// if there are multiple properties with sap:filter-restriction="single-value" then it goes to if condition above
						var filter = pageFilterList[i];
						var name = filter.sPath;

						// Check if the filter exits
						if (!oBinding.getProperty(name)) {
							jQuery.sap.log.warning("Could not apply filter with name \"" + name + "\" as that field does not exist in the entity type");
							continue;
						}

						filter.sPath = name;

					}
				}

				return pageFilterList;
			},
			_applyParamsToTableAsHighlight: function(entitySet, paramList, lastSelected, dimNameList, groupList, sortData, updateType) {
				if (!this.oState)
					return;

				var table = this.oState.oSmartTable.getTable();
				var binding = this._getTableBinding(table);
				if (!binding) { // if columns haven't been choosen then binding is undefined
					jQuery.sap.log.error("No table binding to apply the selection(s) to");
					return;
				}

				// Update the grouping
				var bLevelUpdate = this._updateGrouping(table, groupList);
				if (sortData !== undefined && this.isMirrorMode()) {
					this._updateSorting(table, sortData);
				}

				// get only those with actual binding values, filter out those without matching properties
				var paramListFiltered = [];
				for (var i = 0; i < paramList.length; i++) {
					var param = paramList[i];

					var paramMap = {};
					for (var name in param) { // all parameters must match
						// parameter must exist in the binding and the name must be in the dimension list
						if (dimNameList.indexOf(name) == -1 || !this._getBindingProperty(binding, name))
							continue;

						paramMap[name] = param[name];
					}

					paramListFiltered.push(paramMap);
				}

				if (!this._lastFilter) {
					this._lastFilter = binding.aApplicationFilter;
				}

				var pageFilters = this._getPageFilters(binding);
				if (this._isFilterDiff(this._lastFilter, pageFilters)) {
					binding.filter(pageFilters, FilterType.Application);
					this._lastFilter = pageFilters;
				} else if (bLevelUpdate) {
					binding.refresh();
				}

				this._paramListFiltered = paramListFiltered;
				this._lastSelected = lastSelected;

				this._updateRows(updateType);
			},
			_updateGrouping: function(table, groupList) {
				if (!this.isMirrorMode()) // Only copy the grouping from the chart in mirror mode
					return;

				var colList = table.getColumns();
				var colMap = {};
				for (var i = 0; i < colList.length; i++) {
					var col = colList[i];
					if (!PersonalizationControllerUtil.isGroupable(col)) // Only group those that are groupable
						continue;

					var colKey = col.getLeadingProperty ? col.getLeadingProperty() : PersonalizationControllerUtil.getColumnKey(col);
					colMap[colKey] = col;
				}

				var groupUpdate = false;
				for (var i = 0; i < groupList.length; i++) { // set grouping in the order as specified in the groupList (coming from the Chart)
					var name = groupList[i];

					var col = colMap[name];
					if (!col)
						continue;

					if (col.getGrouped && !col.getGrouped()) {
						col.setGrouped(true);
						col.isGroupableByMenu(true);
						col.setShowIfGrouped(true);
						groupUpdate = true;
					}

					delete colMap[name]; // remove from map so that it can be marked as not grouped
				}

				for (var name in colMap) { // ungroup the remaining columns
					var col = colMap[name];
					if (col.getGrouped && col.getGrouped()) {
						col.setGrouped(false);
						col.isGroupableByMenu(false);
						col.setShowIfGrouped(false);
						groupUpdate = true;
					}
				}

				if (groupUpdate) {
					var groupedColList = table.getGroupedColumns();
					table.fireGroup({column: groupedColList[0], groupedColumns: groupedColList, type: sap.ui.table.GroupEventType.group});
				}

				return this._updateExpandLevelInfo(groupList);
			},
			_expandByFilter: function(updateType) {
				if (!this._enableExpandByFilter)
					return;

				var table = this.oState.oSmartTable.getTable();

				var binding = this._getTableBinding(table);
				if (binding && this._lastBinding != binding) {
					var me = this;

					binding.attachDataReceived(this._onBindingDataReceived, this);
					binding.attachEvent("change", function(ev) {
						if (me._expandingProgrammatically) // then expansion triggered through the chart selection or data load, keep the current mode
							return;

						var reason = ev.getParameter("reason");
						if (reason == "expand" ||  reason == "collapse") // User triggered expansion, so don't sync Chart+Table
							me._inUserChartSelectMode = false;
					});
					this._lastBinding = binding;
				}

				// no way to distinquish rowUpdate events that are data driven or user driven, but these must be distinquished in order to properly handle setting the first visible row of the table.
				// For example, the two events of end user scrolling, or the expansion completion cannot be distinguished.  But the first visible row should only be set if the expansion operation has completed (may require a backend call).
				if (updateType == "selection" || updateType == "bindingDataReceived")
					this._firstVisibleRelevantEventTS = new Date().getTime();

				if (updateType == "selection") // User triggered selection in the chart, so sync Chart+Table
					this._inUserChartSelectMode = true;

				if (!this._inUserChartSelectMode)
					return;

				var rowList = this._getTableRows();
				for (var i = 0; i < rowList.length; i++) {
					var row = rowList[i];

					// see if the row should be expanded
					var bindingCtxt = row.getBindingContext();
					if (!bindingCtxt)
						continue;

					var rowIndex = table.getFirstVisibleRow() + i;
					if (this._isRowHighlighted(bindingCtxt.getObject())) { // Row should be expanded
						if (table.isExpanded(rowIndex)) // already expanded
							continue;

						// Row should be expanded and is currently not expanded.
						if (!row._bHasChildren) // not expandable
							continue;

						if (!binding.findNode(rowIndex)) // Not ready yet
							continue;

						this._expandingProgrammatically = true;
						table.expand(rowIndex);
						this._expandingProgrammatically = false;
					}
					else { // Row should be collapsed
						if (!table.isExpanded(rowIndex)) // already collapsed
							continue;

						// Row should be collapsed and is currently not expanded.
						if (!row._bHasChildren) // not collapsible
							continue;

						if (!binding.findNode(rowIndex)) // Not ready yet
							continue;

						this._expandingProgrammatically = true;
						table.collapse(rowIndex);
						this._expandingProgrammatically = false;
					}
				}

				// determine the first visible row, find the first highlightable row
				this._updateFirstVisibleRow(updateType);
			},
			_updateFirstVisibleRow: function(updateType) {
				var table = this.oState.oSmartTable.getTable();

				var binding = this._getTableBinding(table);
				var count = binding.getTotalSize();
				if (count == 0 || (new Date().getTime() - this._firstVisibleRelevantEventTS) > 250)
					return;

				var table = this.oState.oSmartTable.getTable();
				if (updateType == "selection" && (!this._paramListFiltered || this._paramListFiltered.length == 0)) { // deselect all
					table.setFirstVisibleRow(0);
					return;
				}

				var bindingCtxtList = binding.getContexts(0, count);
				for (var i = 0; i < bindingCtxtList.length; i++) {
					// see if the row should be expanded
					var rowObj = bindingCtxtList[i].getObject();

					if (!this._isRowHighlighted(rowObj))
						continue;

					if (this._lastSelected && !this._rowMatch(this._lastSelected, rowObj)) // if a lastSelected, then use that to determine the firstVisibleRow
						continue;

					var lastIndex = table.getFirstVisibleRow();
					if (updateType == "selection" || this._autoHide) {
						table.setFirstVisibleRow(i);
					}
					else {
						if (i > lastIndex)
							table.setFirstVisibleRow(i);
					}

					break;
				}
			},
			_rowMatch: function(selObj, rowObj) {
				for (var name in selObj) {
					if (name.indexOf("__") != -1)
						continue;

					if (!rowObj.hasOwnProperty(name)) // support for node level highlighting
						continue;

					if (selObj[name] != rowObj[name])
						return false;
				}

				return true;
			},
			_updateExpandLevelInfo: function(groupList) {
				if (!this._enableUpdateExpandLevelInfo) // New design: don't autoexpand, keep code in case this is re-enabled
					return false;

				var oTable = this.oState.oSmartTable.getTable();
				if (!oTable.getNumberOfExpandedLevels)
					return false;

				var oBinding = oTable.getBinding();
				if (!oBinding)
					return false;

				var expandLevels = groupList.length;

				var bLevelUpdate = false;
				if (expandLevels >= oBinding.aMaxAggregationLevel.length) {
					bLevelUpdate = true;
					expandLevels = oBinding.aMaxAggregationLevel.length - 1; // else null pointer exception
					this.wasAtMaxLevel = true;
				}
				else {
					bLevelUpdate = oTable.getNumberOfExpandedLevels() != expandLevels || this.wasAtMaxLevel;
					this.wasAtMaxLevel = false;
				}

				if (bLevelUpdate) {
					if (expandLevels >= 0) {
						oTable.setNumberOfExpandedLevels(expandLevels);
						oTable.bindRows(oTable.getBindingInfo("rows")); // trigger an update of the AnalyticalBinding's numberOfExpandedLevels property
					}

					// Firing the group event updates the personalization dialog, without this the table grouping state and personalization state would become inconsistent
					var groupedColList = oTable.getGroupedColumns();
					oTable.fireGroup({column: groupedColList[0], groupedColumns: groupedColList, type: sap.ui.table.GroupEventType.group});
				}

				return bLevelUpdate;
			},
			_updateRows: function(updateType) {
				var allHighlighted = this._autoHide && this.filterList && this.filterList.length > 0;

				var rowList = this._getTableRows();
				for (var i = 0; i < rowList.length; i++) {
					var row = rowList[i];

					var isHighlighted = false;
					var bindingCtxt = row.getBindingContext();
					if (bindingCtxt) {
						var rowObj = bindingCtxt.getObject();

						// based on the mode we are in different rules apply for the row highlighting
						// autoHide mode on acts as a filter, so if any filters applied then all are highlighted
						// autoHide mode off acts as a highlight only with no filter, so need to check each row's data
						if (this._autoHide)
							isHighlighted = allHighlighted;
						else
							isHighlighted = this._isRowHighlighted(rowObj);
					}

					var domRef = row.getDomRefs ? row.getDomRefs(true) : row.getDomRef();
					if (!domRef)
						continue;
					if (domRef.row)
						domRef.row.toggleClass("alr_rowHighlighted", isHighlighted);
					else
						$(domRef).toggleClass("alr_rowHighlighted", isHighlighted);
				}

				var table = this.oState.oSmartTable.getTable();

				// check if table is analytical
				if (table instanceof AnalyticalTable) {
					// expand corresponding nodes
					this._expandByFilter(updateType);
				}
			},
			_getTableRows: function() {
				var table = this.oState.oSmartTable.getTable();
				if (table.getRows)
					return table.getRows();
				else
					return table.getItems();
			},
			_isRowHighlighted: function(rowObj) {
				if (this._autoHide && this._lastFilter && this._lastFilter.length > 0) // in auto mode the paramListFieldered is not set, but if a filter exists then the row should be highlighted
					return true;

				var paramListFiltered = this._paramListFiltered;
				if (!paramListFiltered)
					return false;

				// perform this operation for the number of data records present
				for (var i = 0; i < paramListFiltered.length; i++) { // go through all parameter lists, each could correspond to a selected segment, if one segment matches, then the row should be selected
					var bMatch = true;
					var paramMap = paramListFiltered[i];

					// verify the rowObj has all parameters
					for (var name in paramMap) { // all parameters must match
						if (!rowObj.hasOwnProperty(name)) // support for node level highlighting
							continue;

						if (paramMap[name] != rowObj[name]) { // if one doesnt' match then skip to the next segement
							bMatch = false;
							break;
						}
					}

					if (bMatch) // first match of a segment is enough to select the row, not all segments must match
						return true;
				}

				return false;
			},
			_getTableBinding: function (table) {
				//In case of ResponsiveTable, the aggregation is items, else it is either rows or blank
				return table.getBinding() ? table.getBinding() : table.getBinding("items");
			}
		});

		return tController;
	});
