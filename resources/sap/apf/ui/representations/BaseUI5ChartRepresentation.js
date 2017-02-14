/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.representations.utils.UI5ChartHelper');jQuery.sap.require('sap.apf.ui.utils.formatter');jQuery.sap.require('sap.ui.layout.HorizontalLayout');jQuery.sap.require('sap.m.Text');jQuery.sap.require('sap.ui.model.json.JSONModel');jQuery.sap.require('sap.apf.ui.representations.utils.UI5ChartHelper');jQuery.sap.declare("sap.apf.ui.representations.BaseUI5ChartRepresentation");(function(){'use strict';sap.apf.ui.representations.BaseUI5ChartRepresentation=function(a,p){this.oMessageObject="";this.legendBoolean=true;this.aDataResponse=undefined;this.dataset={};this.oModel=new sap.ui.model.json.JSONModel();this.bDataHasBeenSelected=false;this.parameter=p;this.orderby=p.orderby;this.dimension=p.dimensions;this.measure=p.measures;this.alternateRepresentation=p.alternateRepresentationType;this.requiredFilters=p.requiredFilters;this.UI5ChartHelper=new sap.apf.ui.representations.utils.UI5ChartHelper(a,this.parameter);this.chartInstance={};this.chartParam="";this.thumbnailChartParam="";this.disableSelectEvent=false;this.oApi=a;this.showXaxisLabel=true;this.axisType=sap.apf.ui.utils.CONSTANTS.axisTypes.AXIS;this.topN=p.top;};sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype={getParameter:function(){return this.parameter;},setData:function(d,m){this.bIsGroupTypeChart=this.getIsGroupTypeChart();this.oDataSetHelper=this.getDataSetHelper();this.formatter=new sap.apf.ui.utils.formatter({getEventCallback:this.oApi.getEventCallback.bind(this.oApi),getTextNotHtmlEncoded:this.oApi.getTextNotHtmlEncoded},m,d);this.UI5ChartHelper.init(d,m,this.bIsGroupTypeChart,this.oDataSetHelper,this.formatter);this.aDataResponse=d||[];this.metadata=m;if(!this.metadata){this.oMessageObject=this.oApi.createMessageObject({code:"6004",aParameters:[this.oApi.getTextNotHtmlEncoded("step")]});this.oApi.putMessage(this.oMessageObject);}},attachSelectionAndFormatValue:function(s){var a=this;if(!s){this.oMessageObject=this.oApi.createMessageObject({code:"6002",aParameters:["title",this.oApi.getTextNotHtmlEncoded("step")]});this.oApi.putMessage(this.oMessageObject);}if(this.dimension.length===0){this.oMessageObject=this.oApi.createMessageObject({code:"6002",aParameters:["dimensions",s]});this.oApi.putMessage(this.oMessageObject);}if(this.measure.length===0){this.oMessageObject=this.oApi.createMessageObject({code:"6002",aParameters:["measures",s]});this.oApi.putMessage(this.oMessageObject);}if(!this.aDataResponse||this.aDataResponse.length===0){this.oMessageObject=this.oApi.createMessageObject({code:"6000",aParameters:[s]});this.oApi.putMessage(this.oMessageObject);}this.fnHandleSelection=this.handleSelection.bind(a);this.chart.attachSelectData(this.fnHandleSelection);this.fnHandleDeselection=this.handleDeselection.bind(a);this.chart.attachDeselectData(this.fnHandleDeselection);},getFormatStringForMeasure:function(m){var f=this.formatter.getFormatString(m);return f;},getFormatStringForMeasureTooltip:function(m){var f=this.formatter.getFormatStringTooltip(m);return f;},getIsAllMeasureSameUnit:function(){var a=true;var s=this;var f=this.metadata.getPropertyMetadata(this.measure[0].fieldName).unit?this.metadata.getPropertyMetadata(this.metadata.getPropertyMetadata(this.measure[0].fieldName).unit).semantics:undefined;var m;this.measure.forEach(function(b,i){m=s.metadata.getPropertyMetadata(s.measure[i].fieldName).unit?s.metadata.getPropertyMetadata(s.metadata.getPropertyMetadata(b.fieldName).unit).semantics:undefined;if(a&&f!==undefined&&m&&(f!==m)){a=false;}});return a;},createThumbnailLayout:function(){this.thumbnailLayout=new sap.ui.layout.HorizontalLayout().addStyleClass('thumbnailLayout');this.thumbnailLayout.removeAllContent();if(this.aDataResponse!==undefined&&this.aDataResponse.length!==0){this.thumbnailChart.setModel(this.oModel);this.thumbnailLayout.addContent(this.thumbnailChart);this.thumbnailChart.removeStyleClass('thumbnailNoData');}else{var n=new sap.m.Text({text:this.oApi.getTextNotHtmlEncoded("noDataText")}).addStyleClass('noDataText');this.thumbnailLayout.addContent(n);this.thumbnailLayout.addContent(this.thumbnailChart);this.thumbnailChart.addStyleClass('thumbnailNoData');}},getAlternateRepresentation:function(){return this.alternateRepresentation;},getMetaData:function(){return this.metadata;},getData:function(){return this.aDataResponse;},getRequestOptions:function(){var o={};if(this.orderby&&this.orderby.length){var O=this.orderby.map(function(a){return{property:a.property,descending:!a.ascending};});o.orderby=O;}if(this.topN&&this.topN>0){o.paging={};o.paging.top=this.topN;}return o;},createDataset:function(){this.dataset=this.UI5ChartHelper.getDataset();this.oModel=this.UI5ChartHelper.getModel();},drawSelectionOnMainChart:function(){var s=this.UI5ChartHelper.getSelectionFromFilter(this.filter);if(s.length>0){this.disableSelectEvent=true;this.setSelectionOnMainChart(s);}},drawSelectionOnThumbnailChart:function(){var s=this.UI5ChartHelper.getSelectionFromFilter(this.filter);if(s.length>0){this.clearSelectionFromThumbnailChart();this.setSelectionOnThumbnailChart(s);}},handleSelection:function(e){if(!this.disableSelectEvent){var s=this.getSelectionFromChart();var c=this.UI5ChartHelper.getHighlightPointsFromSelectionEvent(s);this.setSelectionOnThumbnailChart(c);this.setSelectionOnMainChart(c);this.bDataHasBeenSelected=true;this.oApi.selectionChanged();}else{this.disableSelectEvent=false;}},handleDeselection:function(e){if(!this.disableSelectEvent){this.disableSelectEvent=true;var s=this.getSelectionFromChart();var n=this.UI5ChartHelper.getHighlightPointsFromDeselectionEvent(s);this.removeAllSelection();this.setSelectionOnThumbnailChart(n);this.setSelectionOnMainChart(n);if(!n.length){this.disableSelectEvent=false;}this.bDataHasBeenSelected=true;this.oApi.selectionChanged();}else{this.disableSelectEvent=false;}},getSelections:function(){return this.UI5ChartHelper.getFilters();},getSelectionCount:function(){return this.UI5ChartHelper.getFilterCount();},hasSelection:function(){return this.bDataHasBeenSelected;},removeAllSelection:function(){this.clearSelectionFromThumbnailChart();this.clearSelectionFromMainChart();},getFilterMethodType:function(){return sap.apf.core.constants.filterMethodTypes.filter;},getFilter:function(){this.filter=this.UI5ChartHelper.getFilterFromSelection();return this.filter;},setFilter:function(f){this.filter=f;this.bDataHasBeenSelected=false;},adoptSelection:function(s){if(s&&s.getFilter){this.UI5ChartHelper.filterValues=s.getFilter().getInternalFilter().getFilterTerms().map(function(t){return[t.getValue()];});}},serialize:function(){return{oFilter:this.UI5ChartHelper.filterValues,bIsAlternateView:this.bIsAlternateView};},deserialize:function(s){this.UI5ChartHelper.filterValues=s.oFilter;this.bIsAlternateView=s.bIsAlternateView;},getPrintContent:function(s){var c,v=this.chartType,a={};var o=this.getMainContent(s);if(o.setVizProperties){a=o.getVizProperties();c=o.clone();c.setVizType(v);c.setVizProperties(a);}else{a=jQuery.extend(true,{},this.chartParam);delete a.dataset;jQuery.sap.require('sap.viz.ui5.'+v);c=new sap.viz.ui5[v](a);}c.setWidth("1000px");c.setHeight("600px");this.createDataset();c.setDataset(this.dataset);c.setModel(this.oModel);return{oChartForPrinting:c,aSelectionOnChart:this.getSelectionFromChart()};},destroy:function(){this.dataset=null;this.oModel.destroy();this.oDataSetHelper=null;if(this.formatter){this.formatter.destroy();this.formatter=null;}this.UI5ChartHelper.destroy();this.UI5ChartHelper=null;if(this.chart){this.chart.detachSelectData(this.fnHandleSelection);this.fnHandleSelection=null;this.chart.detachDeselectData(this.fnHandleDeselection);this.fnHandleDeselection=null;this.chart.destroy();this.chart=null;}if(this.thumbnailChart){this.thumbnailChart.destroy();this.thumbnailChart=null;}if(this.thumbnailLayout){this.thumbnailLayout.removeAllContent();}}};}());
