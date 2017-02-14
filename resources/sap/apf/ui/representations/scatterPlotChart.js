/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");jQuery.sap.require("sap.apf.core.constants");jQuery.sap.declare("sap.apf.ui.representations.scatterPlotChart");(function(){"use strict";sap.apf.ui.representations.scatterPlotChart=function(a,p){sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.SCATTERPLOT_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.SCATTERPLOT;this.bIsGroupTypeChart=true;this._addDefaultKind();};sap.apf.ui.representations.scatterPlotChart.prototype=Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);sap.apf.ui.representations.scatterPlotChart.prototype.constructor=sap.apf.ui.representations.scatterPlotChart;sap.apf.ui.representations.scatterPlotChart.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(m,i){if(m.kind===undefined){m.kind=i===0?sap.apf.core.constants.representationMetadata.kind.XAXIS:sap.apf.core.constants.representationMetadata.kind.YAXIS;}});this.parameter.dimensions.forEach(function(d,i){if(d.kind===undefined){d.kind=i===0?sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR:sap.apf.core.constants.representationMetadata.kind.REGIONSHAPE;}});};sap.apf.ui.representations.scatterPlotChart.prototype.setVizPropsForSpecificRepresentation=function(){this.chart.setVizProperties({valueAxis2:{visible:true,title:{visible:true},label:{visible:true}},sizeLegend:{visible:true},plotArea:{adjustScale:true}});};sap.apf.ui.representations.scatterPlotChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation=function(){this.thumbnailChart.setVizProperties({sizeLegend:{visible:false},valueAxis2:{visible:false,title:{visible:false}},plotArea:{markerSize:4,marker:{visible:true,size:4},adjustScale:true}});};sap.apf.ui.representations.scatterPlotChart.prototype.getAxisFeedItemId=function(k){var s=sap.apf.core.constants.representationMetadata.kind;var a;switch(k){case s.XAXIS:a=sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS;break;case s.YAXIS:a=sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS2;break;case s.REGIONCOLOR:a=sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;break;case s.REGIONSHAPE:a=sap.apf.core.constants.vizFrame.feedItemTypes.SHAPE;break;default:break;}return a;};}());
