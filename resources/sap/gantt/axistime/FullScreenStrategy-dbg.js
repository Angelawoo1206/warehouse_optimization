sap.gantt.axistime.FullScreenTimeLineOptions = sap.gantt.config.DEFAULT_TIME_ZOOM_STRATEGY;

sap.ui.define([
	"./AxisTimeStrategyBase","sap/gantt/misc/Utility", "sap/gantt/misc/Format", "sap/ui/core/Locale", "sap/ui/core/Core",
	"sap/gantt/config/TimeHorizon", "sap/gantt/misc/AxisTime"
], function (AxisTimeStrategyBase, Utility, Format, Locale, Core, TimeHorizon, AxisTime) {
	"use strict";


	/**
	 * A zoom strategy that sets the value of <code>totalHorizon</code> to the value of <code>visibleHorizon</code>. 
	 * When this strategy is implemented, <code>visibleHorizon</code> is fixed. Because of this, when you scroll the 
	 * splitter to expand or shrink the chart area, the value of <code>visibleHorizon</code> remains intact, which makes 
	 * shapes look larger or smaller accordingly. Moreover, the horizontal scroll bar never appears and the zoom control 
	 * is deactivated.
	 */
	var FullScreenStrategy = AxisTimeStrategyBase.extend("sap.gantt.axistime.FullScreenStrategy");

	FullScreenStrategy.prototype.init = function () {
		this.setProperty("totalHorizon", sap.gantt.config.DEFAULT_PLAN_HORIZON, true);
		this.setProperty("visibleHorizon", sap.gantt.config.DEFAULT_PLAN_HORIZON, true);
		this.setProperty("coarsestTimeLineOption", sap.gantt.axistime.FullScreenTimeLineOptions["1month"], true);
		this.setProperty("finestTimeLineOption", sap.gantt.axistime.FullScreenTimeLineOptions["5min"], true);
		this.setProperty("timeLineOptions", sap.gantt.axistime.FullScreenTimeLineOptions, true);
		this.setProperty("timeLineOption", sap.gantt.axistime.FullScreenTimeLineOptions["4day"], true);
		this.setProperty("zoomLevel", 0, true);
		this.setProperty("zoomLevels", 0, true);
	};

	FullScreenStrategy.prototype.setVisibleHorizon = function (oVisibleHorizon) {
		//redraw will call syncContent(), in there rate will be updated
		AxisTimeStrategyBase.prototype.setVisibleHorizon.apply(this, arguments);
		this.setTotalHorizon(oVisibleHorizon);
		this.fireRedrawRequest(true, "visibleHorizonUpdated");
		return this;
	};

	FullScreenStrategy.prototype.syncContext = function (nClientWidth) {
		var bAxisTimeNeedChange = false;

		var oRetVal = {
			zoomLevelChanged : false,
			axisTimeChanged : false
		};

		var fSuitableRate = this._calSuitableRateByChartWidth(nClientWidth);

		if (fSuitableRate !== undefined) {
			var fLastRate = this._oZoom.rate || -1;

			this._oZoom.rate = fSuitableRate;
			this.getAxisTime().setZoomRate(this._oZoom.rate);
			this._adjustRateByBoundary();

			bAxisTimeNeedChange = !Utility.floatEqual(fLastRate, this._oZoom.rate);
			if (bAxisTimeNeedChange) {
				oRetVal.axisTimeChanged = true;
			}
		}

		this._updateTimeLineOption();
		return oRetVal;
	};

	FullScreenStrategy.prototype._adjustRateByBoundary = function () {
		this._oZoom.rate = Math.max(this._oZoom.rate, this._oZoom.minRate);
		this._oZoom.rate = Math.min(this._oZoom.rate, this._oZoom.maxRate);
	};

	FullScreenStrategy.prototype._calSuitableRateByChartWidth = function (nClientWidth) {
		var oInitHorizon = this.getVisibleHorizon(),
			fSuitableRate;

		// calculate suitable zoom rate by init horizon against svg container width
		if (oInitHorizon && oInitHorizon.getStartTime() && oInitHorizon.getEndTime()) {
			var fSuitableScale = this.calZoomScaleByDate(
				Format.abapTimestampToDate(oInitHorizon.getStartTime()),
				Format.abapTimestampToDate(oInitHorizon.getEndTime()),
				nClientWidth);
			fSuitableRate = this._oZoom.base.scale / fSuitableScale;
		}

		return fSuitableRate;
	};

	FullScreenStrategy.prototype._updateTimeLineOption = function(){
		var startTime = Format.getTimeStampFormatter().parse("20000101000000"),
		iCurrentTickKey, 
		i,
		oTimeLineOptions = this.getTimeLineOptions(),
		oTimeLineOption = this.getProperty("timeLineOption");

		var oAxisTime = this.getAxisTime();
		if (oAxisTime) {
			var start = oAxisTime.timeToView(startTime);

			for (i in oTimeLineOptions) {
				var interval = oTimeLineOptions[i].innerInterval;
				var end = oAxisTime.timeToView(jQuery.sap.getObject(interval.unit).offset(startTime, interval.span));
				var r = Math.abs(Math.ceil((end - start)));
				if (r >= interval.range) {
					iCurrentTickKey = i;
					break;
				}
			}
			oTimeLineOption = iCurrentTickKey ? oTimeLineOptions[iCurrentTickKey] : oTimeLineOptions[i];
			this.setProperty("timeLineOption", oTimeLineOption, true);
		}
	};

	return FullScreenStrategy;
}, true);