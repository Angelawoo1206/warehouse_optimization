/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare("sap.apf.ui.utils.constants");
/**
* @class CONSTANTS
* @name CONSTANTS
* @memberOf sap.apf.ui.utils
* @description defines application constants for UI classes
*/
sap.apf.ui.utils.CONSTANTS = {
	step : {
		OPEN_OVERLAY_IMAGE_HEIGHT : 15,
		DROP_MARKER_HEIGHT : 1
	},
	representationTypes : {
		FORM_REPRESENTATION : "FormRepresentation",
		TABLE_REPRESENTATION : "TableRepresentation",
		COLUMN_CHART : "ColumnChart",
		LINE_CHART : "LineChart",
		PIE_CHART : "PieChart",
		GEO_MAP : "GeoMap",
		STACKED_COLUMN_CHART : "StackedColumnChart",
		SCATTERPLOT_CHART : "ScatterPlotChart",
		PERCENTAGE_STACKED_COLUMN_CHART : "PercentageStackedColumnChart",
		BUBBLE_CHART : "BubbleChart",
		BAR_CHART : "BarChart",
		STACKED_BAR_CHART : "StackedBarChart",
		PERCENTAGE_STACKED_BAR_CHART : "PercentageStackedBarChart",
		HEATMAP_CHART : "HeatmapChart",
		LINE_CHART_WITH_TWO_VERTICAL_AXES : "LineChartWithTwoVerticalAxes",
		LINE_CHART_WITH_TIME_AXIS : "LineChartWithTimeAxis"
	},
	vizChartTypes : {
		COLUMN : "Column",
		LINE : "Line",
		PIE : "Pie",
		STACKED_COLUMN : "StackedColumn",
		PERCENTAGE_STACKED_COLUMN : "StackedColumn100",
		SCATTERPLOT : "Scatter",
		BUBBLE : "Bubble"
	},
	vizFrameChartTypes : {
		COLUMN : "column",
		LINE : "line",
		PIE : "pie",
		STACKED_COLUMN : "stacked_column",
		PERCENTAGE_STACKED_COLUMN : "100_stacked_column",
		SCATTERPLOT : "scatter",
		BUBBLE : "bubble",
		BAR : "bar",
		STACKED_BAR : "stacked_bar",
		PERCENTAGE_STACKED_BAR : "100_stacked_bar",
		HEATMAP : "heatmap",
		LINE_CHART_WITH_TWO_VERTICAL_AXES : "dual_line",
		LINE_CHART_WITH_TIME_AXIS : "timeseries_line"
	},
	axisTypes : {
		AXIS : "axis",
		GROUP : "group"
	},
	thumbnailDimensions : {
		HEIGHT : "75px",
		WIDTH : "180px",
		STEP_WIDTH : "202px",
		STEP_HEIGHT : "170px",
		STEP_MARGIN : "20px",
		SEPARATOR_HEIGHT : "25px",
		REMOVE_ICON_HEIGHT : "20px",
		TOTAL_STEP_HEIGHT : 215
	// Step height + margin + separator.
	},
	printChartDimensions : {
		WIDTH : "0.89",
		POTRAITWIDTH : "793.700787402",
		LANDSCAPEWIDTH : "1122.519685039"
	},
	analysisPathArea : {
		HEADERHEIGHT : 140
	},
	chartArea : {
		CHARTHEADERHEIGHT : 120
	},
	carousel : {
		SCROLLCONTAINER : 275,
		DNDBOX : 280
	},
	landingPage : "landingPage"
};
