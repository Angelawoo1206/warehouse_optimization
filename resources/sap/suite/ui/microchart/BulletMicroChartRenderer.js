/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global'],function(){"use strict";var B={};B.render=function(r,c){if(!c._bThemeApplied){return;}var C=c._calculateChartData();var f=+C.forecastValuePct;var s;if(c.getIsResponsive()){s="sapSuiteBMCResponsive";}else{s="sapSuiteBMCSize"+c.getSize();}var S=c.getScale();var R=sap.ui.getCore().getConfiguration().getRTL();var o=R?"right":"left";var m="sapSuiteBMCModeType"+c.getMode();var d=("sapSuiteBMCModeType"+sap.suite.ui.microchart.BulletMicroChartModeType.Delta==m)?c._calculateDeltaValue():0;var I=c.getActual()&&c.getActual()._isValueSet;var a="sapSuiteBMCSize"+sap.m.Size.XS;var b=c.getShowActualValue()&&(a!==s)&&("sapSuiteBMCModeType"+sap.suite.ui.microchart.BulletMicroChartModeType.Actual===m);var e=c.getShowDeltaValue()&&(a!==s)&&("sapSuiteBMCModeType"+sap.suite.ui.microchart.BulletMicroChartModeType.Delta===m);var g=c.getShowTargetValue()&&(a!==s);var A=c.getActualValueLabel();var D=c.getDeltaValueLabel();var t=c.getTargetValueLabel();var h=c.getThresholds();var T=c.getTooltip_AsString();if(typeof T!=="string"){T="";}var j;if(I){j="sapSuiteBMCSemanticColor"+c.getActual().getColor();}r.write("<div");r.writeControlData(c);r.addClass("sapSuiteBMC");r.addClass("sapSuiteBMCContent");r.addClass(jQuery.sap.encodeHTML(s));if(c.hasListeners("press")){r.addClass("sapSuiteUiMicroChartPointer");r.writeAttribute("tabindex","0");}r.writeAttribute("role","presentation");r.writeAttributeEscaped("aria-label",c.getAltText().replace(/\s/g," ")+(sap.ui.Device.browser.firefox?"":" "+T));if(!c.getIsResponsive()){r.writeAttributeEscaped("title",T);}r.writeClasses();if(c.getWidth()){r.addStyle("width",c.getWidth());r.writeStyles();}r.writeAttribute("id",c.getId()+"-bc-content");r.write(">");r.write("<div");r.addClass("sapSuiteBMCVerticalAlignmentContainer");r.addClass("sapSuiteBMCWholeControl");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapSuiteBMCChart");r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.writeAttribute("id",c.getId()+"-bc-chart");if(c.getIsResponsive()){r.writeAttributeEscaped("title",T);}r.write(">");var v="";r.write("<div");r.addClass("sapSuiteBMCTopLabel");r.writeClasses();r.write(">");if(I&&b){var k=(A)?A:""+c.getActual().getValue();v=k+S;r.write("<div");r.addClass("sapSuiteBMCItemValue");r.addClass(jQuery.sap.encodeHTML(j));r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.writeStyles();r.writeAttribute("id",c.getId()+"-bc-item-value");r.write(">");r.writeEscaped(v);r.write("</div>");}else if(I&&c._isTargetValueSet&&e){var l=(D)?D:""+d;v=l+S;r.write("<div");r.addClass("sapSuiteBMCItemValue");r.addClass(jQuery.sap.encodeHTML(j));r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.writeStyles();r.writeAttribute("id",c.getId()+"-bc-item-value");r.write(">");r.write("&Delta;");r.writeEscaped(v);r.write("</div>");}r.write("</div>");r.write("<div");r.addClass("sapSuiteBMCChartCanvas");r.writeClasses();r.write(">");for(var i=0;i<C.thresholdsPct.length;i++){if(h[i]._isValueSet){this.renderThreshold(r,c,C.thresholdsPct[i]);}}r.write("<div");r.writeAttribute("id",c.getId()+"-chart-bar");r.addClass("sapSuiteBMCBar");r.addClass(jQuery.sap.encodeHTML(s));r.addClass("sapSuiteBMCScaleColor"+c.getScaleColor());r.writeClasses();r.write(">");r.write("</div>");if(I){if(c._isForecastValueSet&&m=="sapSuiteBMCModeTypeActual"){r.write("<div");r.addClass("sapSuiteBMCForecastBarValue");r.addClass(jQuery.sap.encodeHTML(j));r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.addStyle("width",f+"%");r.writeStyles();r.writeAttribute("id",c.getId()+"-forecast-bar-value");r.write("></div>");}r.write("<div");r.addClass("sapSuiteBMCBarValueMarker");r.addClass(m);if(!c.getShowValueMarker()){r.addClass("sapSuiteBMCBarValueMarkerHidden");}r.addClass(jQuery.sap.encodeHTML(j));r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.addStyle(jQuery.sap.encodeHTML(o),jQuery.sap.encodeHTML(parseFloat(C.actualValuePct)+parseFloat(1)+"%"));if(m=="sapSuiteBMCModeTypeDelta"&&C.actualValuePct<=C.targetValuePct){r.addStyle("margin","0");}r.writeStyles();r.writeAttribute("id",c.getId()+"-bc-bar-value-marker");r.write("></div>");if(m=="sapSuiteBMCModeTypeActual"&&C.actualValuePct!==0){r.write("<div");r.addClass("sapSuiteBMCBarValue");r.addClass(jQuery.sap.encodeHTML(j));r.addClass(jQuery.sap.encodeHTML(s));if(c._isForecastValueSet){r.addClass("sapSuiteBMCForecast");}r.writeClasses();r.addStyle("width",jQuery.sap.encodeHTML(C.actualValuePct+"%"));r.writeStyles();r.writeAttribute("id",c.getId()+"-bc-bar-value");r.write("></div>");}else if(c._isTargetValueSet&&m=="sapSuiteBMCModeTypeDelta"){r.write("<div");r.addClass("sapSuiteBMCBarValue");r.addClass(jQuery.sap.encodeHTML(j));r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.addStyle("width",jQuery.sap.encodeHTML(Math.abs(C.actualValuePct-C.targetValuePct)+"%"));r.addStyle(jQuery.sap.encodeHTML(o),jQuery.sap.encodeHTML(1+Math.min(C.actualValuePct,C.targetValuePct)+"%"));r.writeStyles();r.writeAttribute("id",c.getId()+"-bc-bar-value");r.write("></div>");}}if(c._isTargetValueSet){r.write("<div");r.addClass("sapSuiteBMCTargetBarValue");r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.addStyle(jQuery.sap.encodeHTML(o),jQuery.sap.encodeHTML(parseFloat(C.targetValuePct).toFixed(2)+"%"));r.writeStyles();r.writeAttribute("id",c.getId()+"-bc-target-bar-value");r.write("></div>");r.write("</div>");if(g){r.write("<div");r.addClass("sapSuiteBMCBottomLabel");r.writeClasses();r.write(">");var n=(t)?t:""+c.getTargetValue();var p=n+S;r.write("<div");r.addClass("sapSuiteBMCTargetValue");r.addClass(jQuery.sap.encodeHTML(s));r.writeClasses();r.writeStyles();r.writeAttribute("id",c.getId()+"-bc-target-value");r.write(">");r.writeEscaped(p);r.write("</div>");r.write("</div>");}}else{r.write("</div>");}r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-info");r.writeAttribute("aria-hidden","true");r.addStyle("display","none");r.writeStyles();r.write(">");r.writeEscaped(T);r.write("</div>");r.write("</div>");r.write("</div>");};B.renderThreshold=function(r,c,t){var o=sap.ui.getCore().getConfiguration().getRTL()?"right":"left";var v=0.98*t.valuePct+1;var C="sapSuiteBMCSemanticColor"+t.color;var s;if(c.getIsResponsive()){s="sapSuiteBMCResponsive";}else{s="sapSuiteBMCSize"+c.getSize();}if(C==="sapSuiteBMCSemanticColor"+sap.m.ValueColor.Error){r.write("<div");r.addClass("sapSuiteBMCDiamond");r.addClass(jQuery.sap.encodeHTML(s));r.addClass(jQuery.sap.encodeHTML(C));r.writeClasses();r.addStyle(jQuery.sap.encodeHTML(o),jQuery.sap.encodeHTML(v+"%"));r.writeStyles();r.write("></div>");}r.write("<div");r.addClass("sapSuiteBMCThreshold");r.addClass(jQuery.sap.encodeHTML(s));r.addClass(jQuery.sap.encodeHTML(C));r.writeClasses();r.addStyle(jQuery.sap.encodeHTML(o),jQuery.sap.encodeHTML(v+"%"));r.writeStyles();r.write("></div>");};return B;},true);