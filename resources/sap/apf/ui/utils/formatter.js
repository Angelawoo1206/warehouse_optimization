/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.utils.formatter");(function(){"use strict";sap.apf.ui.utils.formatter=function(f,m,d){var s=this;this.metadata=m;this.dataResponse=d;this.getPropertyMetadata=function(a){if(this.metadata&&this.metadata.getPropertyMetadata){return this.metadata.getPropertyMetadata(a);}return this.metadata;};this.getFormattedValue=function(a,o){var b,y,q,c,e,w,g;var M=this.getPropertyMetadata(a);if(M.isCalendarYearMonth||M["sap:semantics"]==="yearmonth"||M["sap:semantics"]&&M["sap:semantics"].String==="yearmonth"&&M.dataType&&M.dataType.type==="Edm.String"){if(o!==null){b=this.doYearMonthFormat(o);}else{b="";}}else if(M.dataType&&M.dataType.type==="Edm.DateTime"){if(o!==null){if(o instanceof Date&&M["sap:display-format"]==="Date"){var h=sap.ui.core.format.DateFormat.getDateInstance();g=h.format(o,false);}else if(o instanceof Date){g=o;}else{g=new Date(parseInt(o.slice(6,o.length-2),10));g=g.toLocaleDateString();}if(g==="Invalid Date"){b="-";}else{b=g;}}else{b="-";}}else if(M.unit){if(o!==null){var i=s.getPropertyMetadata(M.unit);if(i.semantics==="currency-code"){var p=isNaN(M.scale)?this.dataResponse[0][M.scale]:M.scale;o=parseFloat(o).toFixed(p).toString();var j=o.split(".");var k=parseFloat(j[0]).toLocaleString();var l=0.1;l=l.toLocaleString();if(k.split(l.substring(1,2)).length>1){k=k.split(l.substring(1,2))[0];}k=k.concat(l.substring(1,2),j[1]);b=k;}else{b=o;}}else{b="-";}}else if(M.isCalendarDate||M["sap:semantics"]==="yearmonthday"||M["sap:semantics"]&&M["sap:semantics"].String==="yearmonthday"&&M.dataType&&M.dataType.type==="Edm.String"){if(o!==null){y=o.substr(0,4);var n=parseInt(o.substr(4,2),10)-1;var r=o.substr(6,2);g=new Date(y,n,r);g=g.toLocaleDateString();if(g==="Invalid Date"){b="-";}else{b=g;}}else{b="-";}}else if(M.isCalendarYearQuarter){if(o!==null){y=o.substr(0,4);q=o.substr(4,1);c=new Date(y);e=c.getFullYear();var t;t="Q"+q;var u=t+" "+e;b=u;}else{b="";}}else if(M.isCalendarYearWeek){if(o!==null){y=o.substr(0,4);w=o.substr(4,2);c=new Date(y);e=c.getFullYear();var v;v="CW"+w;var x=v+" "+e;b=x;}else{b="";}}else{if(o===null){b="null";}else{b=o;}}var z=jQuery.extend({},this.getPropertyMetadata(a));b=this._applyCustomFormatting(z,a,o,b);return b;};this.doYearMonthFormat=function(a){var j=f.getTextNotHtmlEncoded("month-1-shortName");var b=f.getTextNotHtmlEncoded("month-2-shortName");var c=f.getTextNotHtmlEncoded("month-3-shortName");var e=f.getTextNotHtmlEncoded("month-4-shortName");var g=f.getTextNotHtmlEncoded("month-5-shortName");var h=f.getTextNotHtmlEncoded("month-6-shortName");var i=f.getTextNotHtmlEncoded("month-7-shortName");var k=f.getTextNotHtmlEncoded("month-8-shortName");var l=f.getTextNotHtmlEncoded("month-9-shortName");var o=f.getTextNotHtmlEncoded("month-10-shortName");var n=f.getTextNotHtmlEncoded("month-11-shortName");var p=f.getTextNotHtmlEncoded("month-12-shortName");var q=[j,b,c,e,g,h,i,k,l,o,n,p];var y=a.substr(0,4);var r=q[a.substr(4,6)-1];return r+" "+y;};this.getPrecision=function(a){var M=this.getPropertyMetadata(a);if(M!==undefined&&this.dataResponse!==undefined&&this.dataResponse[0]!==undefined){return isNaN(M.scale)?this.dataResponse[0][M.scale]:M.scale;}};this.getFormatStringTooltip=function(a){var s=this;var b=sap.viz.ui5.format.ChartFormatter.getInstance();sap.viz.ui5.api.env.Format.numericFormatter(b);var F="";var c=a.fieldName;var p=0;p=this.getPrecision(c);b.registerCustomFormatter("numberTooltip",function(v){var e=sap.ui.core.format.NumberFormat.getFloatInstance({style:'standard',minFractionDigits:p});var o=e.format(v);var g=o;var h=jQuery.extend({},s.getPropertyMetadata(c));g=s._applyCustomFormatting(h,c,o,g);return g;});F="numberTooltip";return F;},this.getFormatString=function(a){var b=sap.viz.ui5.format.ChartFormatter.getInstance();sap.viz.ui5.api.env.Format.numericFormatter(b);var F="";var c=a.fieldName;var p=0;p=this.getPrecision(c);b.registerCustomFormatter("number",function(v){var e=sap.ui.core.format.NumberFormat.getFloatInstance({style:'standard',minFractionDigits:p});return e.format(v);});F="number";return F;};this.getFormattedValueForTextProperty=function(a,t){var F;if(t.key){F=t.text+" ("+t.key+")";}else{F=t.text;}var b=jQuery.extend({},this.getPropertyMetadata(a));F=this._applyCustomFormatting(b,a,t.text,F);return F;};this._applyCustomFormatting=function(a,b,o,c){var e=f.getEventCallback(sap.apf.core.constants.eventTypes.format);if(typeof e==="function"){var g=e.apply(f,[a,b,o,c]);if(g!==undefined){c=g;}if(g===null){c="";}}return c;};this.destroy=function(){s.metadata=null;s.dataResponse=null;};};}());