sap.ui.define(["sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/m/FlexItemData", "sap/m/ToolbarDesign",
		"sap/ui/core/mvc/Controller"
	],
    function(OverflowToolbar, ToolbarSpacer, FlexItemData, ToolbarDesign, Controller) {
		"use strict";
		var cController = Controller.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.SmartChartController", {
			setState: function(oState) {
				this.triggeredByTableSort = false;
				this.tableSortSelection;
				this.allowMultiSelect = true;
				this._selectFilterByMeasure = false; // else will filter by all dimensions/measures at the selection
				this.oState = oState;

				// Whitelist column and combination chart types, all other types are not available to the end user due to additional support effort, e.g. event data structure differrences
				// var chartTypes = sap.chart.api.getChartTypes();
				// var ignoreTypeList = [];
				// for (var type in chartTypes) {
				// 	if (type == "column" || type == "combination") // whitelist column and combination (the two formally supported)
				// 		continue;
				// 	ignoreTypeList.push(type);
				// }

				// oState.oSmartChart.setIgnoredChartTypes(ignoreTypeList.join(","));

				// Attach the init method to e.g., hook into the data selection event
				oState.oSmartChart.attachInitialise(this._onSmartChartInit, this);
				oState.oSmartChart.attachBeforeRebindChart(this._onBeforeRebindChart, this);

				this.oState.detailController.attachAutoHideToggle(this._onAutoHideToggle, this);
				this.oState.detailController.attachInitComplete(this._onDetailInitComplete, this);
				this.oState.detailController.attachTableChange(this._onTableChange, this);

				this.oState.attachSearchButtonPressed(this._onSearchButtonPressed, this);
			},
			/**
			 * onBeforeRebindChart binds the table query params
			 * @param  {Object} oEvent Event object
			 */
			_onBeforeRebindChart: function (oEvent) {
				// modifying chart binding params to sort chart based on table data
				if (this.triggeredByTableSort && this.tableSortSelection) {
					var variant = this.oState.oSmartChart.fetchVariant();
					if (this.tableSortSelection.length > 0) {
						variant.sort = {};
						variant.sort.sortItems = [];
						for (var i = 0; i < (this.tableSortSelection.length); i++) {
							oEvent.mParameters.bindingParams.sorter.push(this.tableSortSelection[i]);
							variant.sort.sortItems.push({
								columnKey: this.tableSortSelection[i].sPath,
								operation: this.tableSortSelection[i].bDescending ? "Descending" : "Ascending"
							});
						}
					} else {
						oEvent.mParameters.bindingParams.sorter = this.tableSortSelection;
						// to set data in personalization dailog
						if (variant.sort) {
							delete variant.sort;
						}
					}

					// apply variant so that P13n is also updated, rebind chart does not update p13n
					this.oState.oSmartChart.applyVariant(variant);
					this.triggeredByTableSort = false;
				}

				//Make sure views with paramters are working
				if (this.oState.oSmartFilterbar && this.oState.oSmartFilterbar.getAnalyticBindingPath && this.oState.oSmartFilterbar.getConsiderAnalyticalParameters()) {
					try {
						var sAnalyticalPath = this.oState.oSmartFilterbar.getAnalyticBindingPath();
						if (sAnalyticalPath) {
							this.oState.oSmartChart.setChartBindingPath(sAnalyticalPath);
						}
					} catch (e) {
						jQuery.sap.log.warning("Mandatory parameters have no values", "", "AnalyticalListPage");
					}
				}

				this.oState.oController.onBeforeRebindChartExtension(oEvent);
			},
			_onSmartChartInit: function() {
				var oState = this.oState;

				this.oChart = oState.oSmartChart.getChart();

				// TODO: check if need to handle chart type change
				this.oChart.attachSelectData(this._onChartSelectData, this);
				this.oChart.attachDeselectData(this._onChartDeselectData, this);
				// by commeting this we are removing the chart drill down on table data.
				// this.oChart.attachDrilledUp(this._onChartDrilledUp, this);
				// this.oChart.attachDrilledDown(this._onChartDrilledDown, this);

				// TODO: Shouldn't be necessary, was not able to set this in the XML View, bug?  (Tried settting selectionMode="sap.chart.SelectionMode.Multi" and selectionMode="MULTIPLE")
				var selMode = this.allowMultiSelect ? sap.chart.SelectionMode.Multi : sap.chart.SelectionMode.Single;
				oState.oSmartChart.setSelectionMode(selMode);
				this.oChart.setSelectionMode(selMode);

				if (this.oState._pendingChartToolbarInit && (this.oState._containerView == "chart" || this.oState._containerView == "charttable")) {
					this.oState.oSmartChart.getToolbar().addContent(this.oState.alr_fullScreenButton);
					this.oState.oSmartChart.getToolbar().addContent(this.oState.alr_viewSwitchButton);
				}
				delete this.oState._pendingChartToolbarInit;

				this.oState.oSmartChart.getChart().setVizProperties({
					"valueAxis":{
						"title":{
							"visible":false
						}
					},
					"legendGroup":{
						"layout":{
							"position":"bottom"
						}
					}
				});

				if (this.oState.oSmartChart._oPersController)
					this.oState.oSmartChart._oPersController.attachAfterP13nModelDataChange(jQuery.proxy(this._onAfterP13nModelDataChange, this));

				jQuery.sap.log.info("Smart Chart Annotation initialized");
			},
			_onChartSelectData: function(ev) {
				var chart = this.oState.oSmartChart.getChart();
				if (chart._getVizFrame().vizSelection()) { // workaround for bug in chart, will get null pointer exception if vizSelection is not checked
					var selList = chart.getSelectedDataPoints().dataPoints;
					this._lastSelected = this._getLastSel(selList, this._lastSelectedList);
					this._lastSelectedList = selList;
				}

				// get the set of filter critera based on the selection, could be differences based on type, so get in a different function
				this._updateTable("selection");
			},
			_getLastSel: function(newList, oldList) {
				var chart = this.oState.oSmartChart.getChart();
				var newSelList = this._getSelParamsFromDPList(newList);
				var oldSelList = this._getSelParamsFromDPList(oldList);

				for (var i = 0; i < newSelList.length; i++) {
					var newSel = newSelList[i];
					var match = false;
					for (var j = 0; j < oldSelList.length; j++) {
						var oldSel = oldSelList[j];

						match = true;
						for (var a in oldSel) {
							if (a.indexOf("__") != -1)
								continue;

							if (newSel[a] != oldSel[a]) {
								match = false;
								break;
							}
						}

						if (match)
							break;
					}

					if (!match) {
						var dimList = chart.getVisibleDimensions();
						var newSelOnlyDim = {};
						for (var j = 0; j < dimList.length; j++) {
							var name = dimList[j];
							newSelOnlyDim[name] = newSel[name];
						}

						return newSelOnlyDim;
					}
				}

				return null;
			},
			_onChartDeselectData: function(ev) {
				var me = this;
				this._lastSelected = null;
				setTimeout(function() { // due to the selection data points not being updated during the deselectData event, must check again asynchronously
					var chart = me.oState.oSmartChart.getChart();
					if (chart.getSelectedDataPoints().count == 0) // Clear the filter if no selections remain.  If a selection exists it would have come through the SelectData event
						me._updateTable("selection");
					else if (chart.getSelectionMode() == "MULTIPLE") // Treat an unselect with remaining selection points as a select
						me._onChartSelectData(ev);
				}, 1);

				// A drilldown via the breadcrumb (no other event to listen to drilldown events), the drilledUp event doesn't get triggered in this case
				var evtSrc = ev.getParameter("oSource");
				if (evtSrc && evtSrc instanceof sap.m.Link && evtSrc.getParent() instanceof sap.m.Breadcrumbs)
					me._onChartDrilledUp(ev);
			},
			_onChartDrilledUp: function(ev) {
				this._updateTable();
			},
			_onChartDrilledDown: function(ev) {
				this._updateTable();
			},
			_onAfterP13nModelDataChange: function(ev) {
				var allSortRemoved = (ev.getParameter && ev.getParameter("changeData").sort && ev.getParameter("changeData").sort.sortItems.length === 0) ? true : false,
					sortList = ev.getParameter && ev.getParameter("persistentData").sort && ev.getParameter("persistentData").sort.sortItems,
					sortData = {
						allSortRemoved: allSortRemoved,
						sortList: sortList
					};
				this._updateTable(undefined, sortData);
			},
			_onSearchButtonPressed: function() {
				this._updateTable();
			},
			updateTable: function() {
				var variant = this.oState.oSmartChart.fetchVariant(),
				sortData = {};

				if (variant.sort && variant.sort.sortItems) {
					sortData.sortList = variant.sort.sortItems;
					sortData.allSortRemoved = false;
				} else {
					sortData.sortList = undefined;
					sortData.allSortRemoved = true;
				}

				this._updateTable(undefined, sortData);
			},
			_updateTable: function(updateType, sortData) {

				var chart = this.oState.oSmartChart.getChart();
				if (!chart) {
					return;
				}

				var paramList = this._getSelParamsFromChart(chart);
				var dimList = chart.getVisibleDimensions();
				var groupList = chart.getVisibleDimensions();

				var dpList = [];
				if (chart._getVizFrame().vizSelection()) // workaround for bug in chart, will get null pointer exception if vizSelection is not checked
					dpList = chart.getSelectedDataPoints().dataPoints;
				if (!dpList || dpList.length == 0)
					this._lastSelected = null;

				this.oState.detailController.applyParamsToTable(paramList, this._lastSelected, dimList, groupList, sortData, updateType);
			},
			_getSelParamsFromChart: function(chart) {
				var dpList = [];

				if (chart._getVizFrame().vizSelection()) // workaround for bug in chart, will get null pointer exception if vizSelection is not checked
					dpList = chart.getSelectedDataPoints().dataPoints;

				return this._getSelParamsFromDPList(dpList);
			},
			_getSelParamsFromDPList: function(dpList) {
				if (!dpList)
					return [];

				var paramList = [];
				for (var i = 0; i < dpList.length; i++) {
					var dp = dpList[i];
					var ctxt = dp.context;
					if (!ctxt) // happens when drill down state has changed, chart is inconsistent at this point
						continue;

					var ctxtObj = ctxt.getProperty(ctxt.sPath);
					var param = {};
					if (this._selectFilterByMeasure) {
						for (var j = 0; j < dp.measures.length; j++) {
							var name = dp.measures[j];
							var val = ctxtObj[name];
							param[name] = val;
						}
					}
					else { // Filter by all measures/dimensions at the context path of the selected data point
						for (var name in ctxtObj)
							param[name] = ctxtObj[name];
					}
					paramList.push(param);
				}

				return paramList;
			},
			_onAutoHideToggle: function(ev) {
				var tbc = this.oState.toolbarController;

				tbc.switchContainerView(this.oState._containerView);

				this._updateTable();
			},
			_onDetailInitComplete: function(ev) {
				this._updateTable();
			},
			_onTableChange: function(ev) {
				// set the grouping
				var groupList = ev.getParameter("groupList"),
					sortList = ev.getParameter("sortList"),
					allTableSortRemoved = ev.getParameter("allTableSortRemoved"),
					smartChart = this.oState.oSmartChart,
					chart, chartDim;
				if (groupList) {
					// update the drilldown state to reflect the grouping
					var smartChart = this.oState.oSmartChart;
					var chart = smartChart.getChart();

					var chartDim = chart.getVisibleDimensions();
					if (groupList.length != chartDim.length) {
						chart._getVizFrame().vizSelection([], {}); // clear the selection
						this._lastSelected = null;
					}

					chart.setVisibleDimensions(groupList);
					smartChart._updateDrillBreadcrumbs();
				}

				if (sortList || allTableSortRemoved) {
					this.triggeredByTableSort = true;
					this.tableSortSelection = (sortList && sortList.length > 0) ? sortList : [];
					// instead of rebind if we try to apply variant
					// chart is not sorted it only sets P13n
					// hence we do reind here and then apply variant in onBeforeRebind
					smartChart.rebindChart();
				}
			}
		});
		return cController;
	});
