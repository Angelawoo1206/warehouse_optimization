sap.ui.define([
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/format/ChartFormatter", "sap/viz/ui5/api/env/Format",
	"sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItem",
	"sap/ui/model/Sorter"
],
function(VizFrame,
		ChartFormatter, Format,
		FilterItem,
		Sorter) {
	"use strict";

	var FilterItemChart = FilterItem.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemChart", {
		metadata: {
			aggregations: {
				control: {type: "sap.viz.ui5.controls.VizFrame", multiple: false}
			}
		},

		renderer: function(oRm, oControl) {
			oRm.renderControl(oControl.getAggregation("control"));
		}
	});

	FilterItemChart.prototype._formattingId = "__UI5__ShortIntegerMaxFraction2";
	FilterItemChart.prototype._maxFractionalDigits = 1;
	FilterItemChart.prototype._maxFractionalDigitsValsLessThanZero = 7; // limit to 7 decimal places, e.g. if scale is B and value is 700 will show 0.0000007, if value is 70, the shortened value will be 0.
	FilterItemChart.prototype._minFractionalDigits = 1;
	FilterItemChart.prototype._shortRefNumber = undefined;
	FilterItemChart.prototype._thousandsRefNumber = undefined;
	FilterItemChart.prototype._isTriggeredBySync = false;

	FilterItemChart.prototype.init = function() {
		this._registerChartFormatters();

		this._attachChartEvents();
	};
	/**
	*Function returns two arrays, an array of contructors for sorting and an array of sort order properties
	*params {[objects]} aSortOrder array of sortOrder property from annotations
	*return {object} oSorters Object that consists of array of construcotrs for sortig and array of sort order properties
	*/
	FilterItemChart._getSorter = function(aSortOrder) {
		var aSortFields = [], aSortDescending = [], aSorters = [];
		//For each type of sortOrder, we save the sortOrder Type and Ascending/descending values into  two arrays. Elements of these arrays are then passed into Sorter()
		for (var i = 0; i < aSortOrder.length; i++) {
			aSortFields[i] = aSortOrder[i].Field.String;
			aSortDescending[i] = aSortOrder[i].Descending.Boolean;
			aSorters.push(new Sorter(aSortFields[i], aSortDescending[i]));
		}
		var oSorter = {sorter : aSorters, sortFields: aSortFields};
		return oSorter;
	};

	FilterItemChart.prototype._getNumberFormatter = function(showScale, maxFractionalDigits) {
		var fixedInteger = sap.ui.core.format.NumberFormat.getIntegerInstance({
			style: "short",
			minFractionDigits: this._minFractionalDigits,
			maxFractionDigits: maxFractionalDigits,
			showScale: showScale,
			shortRefNumber: this._shortRefNumber
		});

		return fixedInteger;
	};

	FilterItemChart.prototype._registerChartFormatters = function() {
		var chartFormatter = ChartFormatter.getInstance();
		var me = this;
		chartFormatter.registerCustomFormatter(this._formattingId,
			function(value) {
				var maxFractionDigits = me._maxFractionalDigits;
				var shiftedVal = Math.abs(value) / me._thousandsRefNumber;
				if (me._thousandsRefNumber != undefined && shiftedVal < 1) {
					// if a shortRefNumber is set and the value is well below, then we need to preserve the lowest most digit and not round to 0.
					// E.g. if the shortRefNumber is 1000 (meaning the scale is K) and the value is 70, we want to display 0.07, not 0.0 to not give the impression that the actual value is 0.
					var i = 0;
					for (; i < me._maxFractionalDigitsValsLessThanZero && shiftedVal < 1; i++)
						shiftedVal *= 10;

					maxFractionDigits = i;
				}

				var fixedInteger = me._getNumberFormatter(false, maxFractionDigits);
				return fixedInteger.format(value);
		});

		Format.numericFormatter(chartFormatter);
	};

	FilterItemChart.prototype._attachChartEvents = function() {
		if (this._chart.onAfterRendering) {
			var origOnAfterRendering = this._chart.onAfterRendering;
			var me = this;

			this._chart.onAfterRendering = function() {
				me._registerChartFormatters(); // have to re-register, ChartFormatter gets overwritten when opening the Chart KPI

				origOnAfterRendering.apply(this, arguments);

				// apply selection
				me._applyDimensionFilter();
				me._chart.setBusy(false);
			};
		}

		this._chart.attachSelectData(this._onChartSelectData, this);
		this._chart.attachDeselectData(this._onChartDeselectData, this);
	};

	FilterItemChart.prototype.setWidth = function(width) {
		this.setProperty("width", width);
		this._chart.setWidth(width);
	};

	FilterItemChart.prototype.setHeight = function(height) {
		this.setProperty("height", height);
		this._chart.setHeight(height);
	};

	FilterItemChart.prototype.setEntitySet = function(sEntitySetName) {
		this.setProperty("entitySet", sEntitySetName);
		this._updateBinding();
	};

	FilterItemChart.prototype.setDimensionField = function(dimensionField) {
		this.setProperty("dimensionField", dimensionField);
		this._updateBinding();
	};

	FilterItemChart.prototype.setDimensionFieldIsDateTime = function(dimensionFieldIsDateTime) {
		this._isDateTimeChanged = this.getDimensionFieldIsDateTime() != dimensionFieldIsDateTime;
		this.setProperty("dimensionFieldIsDateTime", dimensionFieldIsDateTime);
		this._updateBinding();
		this._isDateTimeChanged = false;
	};

	FilterItemChart.prototype.setDimensionFieldDisplay = function(dimensionFieldDisplay) {
		this.setProperty("dimensionFieldDisplay", dimensionFieldDisplay);
		this._updateBinding();
	};

	FilterItemChart.prototype.setMeasureField = function(measureField) {
		this.setProperty("measureField", measureField);
		this._updateBinding();
	};

	FilterItemChart.prototype.setMeasureSortDescending = function(measureSortDescending) {
		this.setProperty("measureSortDescending", measureSortDescending);
		this._updateBinding();
	};

	FilterItemChart.prototype.setUnitField = function(unitField) {
		this.setProperty("unitField", unitField);
		this._updateBinding();
	};
	/**
	*Set Sortorder property so that chart data can be sorted
	*@param{array} sortOrder - Array of sortOrder Property objects from annotations
	*@return{void}
	*/
	FilterItemChart.prototype.setSortOrder = function(sortOrder) {
		this.setProperty("sortOrder",sortOrder);
		this._updateBinding();
	};
	/**
	 * Set external dimension Filters so that the filter item can be rendered
	 *  
	 * @param {array} filter - array of filters
	 * @param {boolean} bIsTriggeredBySync - whether filter was triggered by sync or not
	 * @returns {void}
	 */
	FilterItemChart.prototype.setDimensionFilterExternal = function(filter, bIsTriggeredBySync) {
		this.setProperty("dimensionFilterExternal", filter);
		// if triggered by sync do not reset
		// until reset is done by filter item interaction
		if (!this._isTriggeredBySync) {
			this._isTriggeredBySync = (bIsTriggeredBySync != undefined && bIsTriggeredBySync);
		}
		this._updateBinding();
	};

	/**
	 * Triggered on selection of chart data point also triggers change to content area on chart selection
	 *  
	 * @param {event} ev - event triggered by selecting data point
	 * @returns {void}
	 *
	 * @private
	 */
	FilterItemChart.prototype._onChartSelectData = function(ev) {
		var dimFilterList = this.getDimensionFilter(),
			dataList = ev.getParameter("data");
		if (this._ignoreNextSelectionChange) { // don't act on programmatic setting of the selection
			this._ignoreNextSelectionChange = false;
			/*if (this._isTriggeredBySync) {
				this._isTriggeredBySync = false;
			} else {*/
				return;
			//}
		}

		var dimFieldDisplay = this.getDimensionFieldDisplay();
		var filterRestriction = this.getFilterRestriction();
		var dimFilterList = this.getDimensionFilter();

		//if the dimension filter list is null/udefined or filterRestriction is "single-value" then set dimension filter list as an empty array
		if (!dimFilterList || filterRestriction == "single-value")
		{
			dimFilterList = [];
		}

		var fnCheckIfValueExists = function (element) {
			return element.dimValue === this;
		};

		for (var i = 0; i < dataList.length; i++) {
			var data = dataList[i].data;

			var valueExists = dimFilterList.filter(fnCheckIfValueExists, data[dimFieldDisplay]);
			
			if (valueExists.length === 0) {
				dimFilterList.push({
					dimValue: data[dimFieldDisplay],
					dimValueDisplay: data[dimFieldDisplay + ".d"] // VizFrame puts the display value in the <field>.d attribute
				});
			}
		}

		this.setProperty("dimensionFilter", dimFilterList); // set without calling setDimensionFilter so that the selected points don't get reapplied

		this.fireFilterChange({filterList: dimFilterList});
	};

	FilterItemChart.prototype._onChartDeselectData = function(ev) {
		if (this._ignoreNextSelectionChange) { // don't act on programmatic setting of the selection
			this._ignoreNextSelectionChange = false;
			return;
		}

		var dimFieldDisplay = this.getDimensionFieldDisplay();

		// Get the unselected data points
		var valList = [];
		var dataList = ev.getParameter("data");
		for (var i = 0; i < dataList.length; i++) {
			var data = dataList[i].data;
			valList.push({
				dimValue: data[dimFieldDisplay],
				dimValueDisplay: data[dimFieldDisplay + ".d"] // VizFrame puts the display value in the <field>.d attribute
			});
		}

		var dimFilterList = this.getDimensionFilter();
		if (!dimFilterList)
			dimFilterList = [];

		// Remove from the unselected from the selected
		for (var i = 0; i < valList.length; i++) {
			var val = valList[i].dimValue;
			for (var j = 0; j < dimFilterList.length; j++) {
				if (val == dimFilterList[j].dimValue)
					dimFilterList.splice(j, 1);
			}
		}
		this.setProperty("dimensionFilter", dimFilterList); // set without calling setDimensionFilter so that the selected points don't get reapplied

		this.fireFilterChange({
			filterList: dimFilterList,
			removeGlobalFilter: this.getOutParameter(),
			removeGlobalFilterValue: data[dimFieldDisplay]
		});
	};

	/**
	*Function returns config object with all the below mentioned properties.
	*return {object} Config object is returned by the object.
	*/
	FilterItemChart.prototype.getP13NConfig = function() {
		var aPropList = [
			"width", "height","filterRestriction","sortOrder","scaleFactor",
			"entitySet", "dimensionField", "dimensionFieldDisplay", "dimensionFieldIsDateTime", "dimensionFilter", "measureField", "measureSortDescending", "unitField", "outParameter", "inParameters", "parentProperty"
		];

		// simple properties
		var oConfig = {};
		for (var i = 0; i < aPropList.length; i++) {
			var name = aPropList[i];
			oConfig[name] = this.getProperty(name);
			if ((name == 'outParameter' || name == 'inParameters') && oConfig[name] == "") {
				oConfig[name] = undefined;
			}
		}

		return oConfig;
	};

	FilterItemChart.prototype.setDimensionFilter = function(dimFilter) {
		this.setProperty("dimensionFilter", dimFilter);

		this._applyDimensionFilter();
	};
	/**
	 * @private
	 * This function apply the dimension filter.
	 * @return {void}
	 */
	FilterItemChart.prototype._applyDimensionFilter = function() {
		// apply to the underlying chart
		var points = [];
		var dimFilter = this.getDimensionFilter();

		if (dimFilter) {
			this._ignoreNextSelectionChange = this._ignoreNextSelectionChange || dimFilter.length > 0; // Then change will be triggered, so ignore since this is the programmatic setting

			// Although requesting the display field, the chart control stores the techincal value in this field.  The display value is stored in the <this.getDimensionFieldDisplay()> + '.d'
			var dimField = this.getDimensionFieldDisplay();
			for (var i = 0; i < dimFilter.length; i++) {
				var data = {};

				data[dimField] = dimFilter[i].dimValue;
				points.push({
					data: data
				});
			}
		}

		// convert dimFilter into actual points
		this._chart.vizSelection(points, {});

		var aChartSelections = this._chart.vizSelection();

		// if chart has filters but there are 
		// no selections on the chart
		// set ignoreNextSelectionChange to false
		if (this._ignoreNextSelectionChange === true && (aChartSelections && aChartSelections.length === 0) && dimFilter.length > 0) {
			this._ignoreNextSelectionChange = false;
		}

	};

	FilterItemChart.prototype._onDataReceived = function(ev) {
		var data = ev.getParameter("data");
		if (!data || !data.results)
			return;

		// Unit determination
		var unitField = this.getUnitField();
		if (unitField) {
			var prevUnit = "";
			var mixedUnits = false;
			for (var i = 0; i < data.results.length; i++) {
				var unit = data.results[i][unitField];
				if (!unit || (prevUnit && unit != prevUnit)) {
					mixedUnits = true;
					break;
				}

				prevUnit = unit;
			}

			this._applyUnitValue(mixedUnits ? "" : prevUnit);
		}
		else { // no unit field, so no unit displayed in title
			this._applyUnitValue("");
		}

		// Scaling determination
		if (this.getControl().getVizType() != "donut") { // doesn't apply to donut since always percentage based
			var measureField = this.getMeasureField();
			var minVal = null;
			var maxVal = null;
			for (var i = 0; i < data.results.length; i++) {
				var val = Math.abs(parseFloat(data.results[i][measureField]));
				minVal = i == 0 ? val : Math.min(minVal, val);
				maxVal = i == 0 ? val : Math.max(maxVal, val);
			}

			if (!minVal) // NaN, null, 0
				minVal = 0;
			if (!maxVal) // NaN, null, 0
				maxVal = 0;

			this._applyMinMaxValue(minVal, maxVal);
		}
	};

	FilterItemChart.prototype._applyUnitValue = function(val) {
		if (this._lastUnitValue != val) {
			this._lastUnitValue = val;
			this.fireTitleChange();
		}
	};

	FilterItemChart.prototype._applyMinMaxValue = function(min, max) {
		if (this._lastMinValue != min || this._lastMaxValue != max) {
			this._lastMinValue = min;
			this._lastMaxValue = max;

			this._scaleValue = "";
			this._shortRefNumber = undefined; // reset

			var absMax = Math.max(Math.abs(min), Math.abs(max)); // use absolute maximum to determine the scale
			if (absMax) {
				// Determine the scale, to get scaleFactor from annotations or from locally defined values
				var scaleFactor = this.getScaleFactor() ? this.getScaleFactor() : this._getScaleFactor(absMax);
				this._shortRefNumber = scaleFactor;
				this._determineThousandsRefNumber(scaleFactor);

				var fixedInteger = this._getNumberFormatter(true, this.maxFractionalDigits);
				var format = fixedInteger.oLocaleData.getDecimalFormat("short", scaleFactor, "other");

				if (format) { // for numbers less than 1000 the returned format is undefined, so handle that
					// remove 0's
					for (var i = 0; i < format.length; i++) {
						if (format[i] != "0")
							this._scaleValue += format[i];
					}
				}
			}

			this.fireTitleChange();
		}
	};

	FilterItemChart.prototype._determineThousandsRefNumber = function(scaleFactor) {
		var shiftedFactor = scaleFactor;

		if (scaleFactor >= 1000) {
			var thousandsCount = 0;
			while (shiftedFactor >= 1000) {
				shiftedFactor /= 1000;
				thousandsCount++;
			}

			this._thousandsRefNumber = thousandsCount == 0 ? undefined : thousandsCount * 1000;
		}
		else {
			this._thousandsRefNumber = undefined;
		}
	};

	FilterItemChart.prototype._getScaleFactor = function(val) {
		var val = parseFloat(val);
		var precision = this._minFractionalDigits;
		for (var i = 0; i < 14; i++) {
			var scaleFactor = Math.pow(10, i);
			if (Math.round(Math.abs(val) / scaleFactor, precision - 1) < 10)
				return scaleFactor;
		}

		return undefined;
	};

	FilterItemChart.prototype.getTitle = function() {
		var model = this.getModel();

		if (!model)
			return "";

		var basePath = "/" + this.getEntitySet() + "/";
		var measureLabel = model.getData(basePath + this.getMeasureField() + "/#@sap:label");
		var dimLabel = model.getData(basePath + this.getDimensionField() + "/#@sap:label");

		// Get the Unit
		var unitValue = this._lastUnitValue ? this._lastUnitValue : "";

		// Get the Scale factor
		var scaleValue = this._scaleValue ? this._scaleValue : "";

		var i18nModel = this.getModel("i18n");
		if (!i18nModel)
			return "";

		var rb = i18nModel.getResourceBundle();

		var title = "";
		if (scaleValue && unitValue)
			title = rb.getText("VIS_FILTER_TITLE_MD_UNIT_CURR", [measureLabel, dimLabel, scaleValue, unitValue]);
		else if (unitValue)
			title = rb.getText("VIS_FILTER_TITLE_MD_UNIT", [measureLabel, dimLabel, unitValue]);
		else if (scaleValue)
			title = rb.getText("VIS_FILTER_TITLE_MD_UNIT", [measureLabel, dimLabel, scaleValue]);
		else
			title = rb.getText("VIS_FILTER_TITLE_MD", [measureLabel, dimLabel]);

		return title;
	};

	return FilterItemChart;
}, /* bExport= */true);
