// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
sap.ui.define(["sap/suite/ui/generic/template/AnalyticalListPage/util/KpiUtil"],function(K){"use strict";jQuery.sap.declare("sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter");sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter={};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.formatFunctions={count:0};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.NumberFormatFunctions={};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.criticalityConstants={StateValues:{None:"None",Negative:"Error",Critical:"Warning",Positive:"Success"},ColorValues:{None:"Neutral",Negative:"Error",Critical:"Critical",Positive:"Good"}};function c(i,C){var S;if(C){S=C.None;if(i&&i.EnumMember){var v=i.EnumMember;if(e(v,"Negative")){S=C.Negative;}else if(e(v,"Critical")){S=C.Critical;}else if(e(v,"Positive")){S=C.Positive;}}}return S;}function e(S,i){return S&&S.indexOf(i,S.length-i.length)!==-1;}function a(v,i,m,n,t,o,C){var p={};p.EnumMember="None";if(v!==undefined){v=Number(v);if(e(i,"Minimize")||e(i,"Minimizing")){p.EnumMember="None";if(o||n){if(v<=o){p.EnumMember="Positive";}else if(v>n){p.EnumMember="Negative";}else{p.EnumMember="Critical";}}}else if(e(i,"Maximize")||e(i,"Maximizing")){p.EnumMember="None";if(t||m){if(v>=t){p.EnumMember="Positive";}else if(v<m){p.EnumMember="Negative";}else{p.EnumMember="Critical";}}}else if(e(i,"Target")){p.EnumMember="None";if(t&&o){if(v>=t&&v<=o){p.EnumMember="Positive";}else if(v<m||v>n){p.EnumMember="Negative";}else{p.EnumMember="Critical";}}}}return c(p,C);}function b(i,r,u,m){if(!i||!r){return;}i=Number(i);if(!u&&(i-r>=0)){return"Up";}if(!m&&(i-r<=0)){return"Down";}if(r&&u&&(i-r>=u)){return"Up";}if(r&&m&&(i-r<=m)){return"Down";}}function d(v,n,S,u){var i=true;var V=K.formatNumberForPresentation(v,i,n,S);return V+" "+(u?u:"");}function f(i,n,t,S,u){var m=true;if(!i){return;}i=Number(i);var D=i-t;var o=K.formatNumberForPresentation(D,m,n,S);return o+" "+(u?u:"");}function g(v,r,i){if(!r){return;}r=Number(r);if(i){return r+"%";}return r;}function h(v,t,n,S,u){var i=true;if(!t){return;}else{t=Number(t);var m=K.formatNumberForPresentation(t,i,n,S);return m+" "+(u?u:"");}}sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForKpiTargetValue=function(C,D){if(!D||!D.Value||!D.TargetValue){return"";}var S=C.getSetting("settings").getData();var v=K.getPathOrPrimitiveValue(S.model,D.Value);var t=K.getPathOrPrimitiveValue(S.model,D.TargetValue);var m=C.getSetting("dataModel");var M=m.getMetaModel();var E=M.getODataEntitySet(S.entitySet);var o=M.getODataEntityType(E.entityType);var i=M.getODataProperty(o,D.Value.Path);var u=K.getUnitofMeasure(S.model,i);var I=K.isBindingValue(t);var n=K.isBindingValue(v);var p=0;var q;if(D.ValueFormat){p=K.getPathOrPrimitiveValue(S.model,D.ValueFormat.NumberOfFractionalDigits);q=K.getPathOrPrimitiveValue(S.model,D.ValueFormat.ScaleFactor);}var r=K.isBindingValue(u);var w=false;var P="parts: ["+(n?v:"{path: 'DUMMY'}");P+=I?","+t:"";P+=r?","+u:"";P+="]";if(u==="%"){w=true;}if(p===""||p===undefined){p=0;if(w){p=1;}}q=q==""?undefined:q;var x=function(){var y=1;return h(n?arguments[0]:v,I?arguments[y++]:t,p,q,r?arguments[y++]:u);};var F=s(x,"formatReferenceValueCalculation");return"{"+P+", formatter: '"+F+"'}";};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForKpiReferenceValue=function(C,D){var S=C.getSetting("settings").getData();var v=K.getPathOrPrimitiveValue(S.model,D.Value);var r=K.getPathOrPrimitiveValue(S.model,D.TrendCalculation.ReferenceValue);var i=K.isRelative(D);var I=K.isBindingValue(r);var p="parts: ["+v;p+=I?","+r:"";p+="]";var m=function(){var n=1;return g(arguments[0],I?arguments[n++]:r,i);};var F=s(m,"formatReferenceValueCalculation");return"{"+p+", formatter: '"+F+"'}";};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForKpiValue=function(C,D){if(!D||!D.Value){return"";}var S=C.getSetting("settings").getData();var m=C.getSetting("dataModel");var M=m.getMetaModel();var E=M.getODataEntitySet(S.entitySet);var o=M.getODataEntityType(E.entityType);var i=M.getODataProperty(o,D.Value.Path);var u=K.getUnitofMeasure(S.model,i);var S=C.getSetting("settings").getData();var v=K.getPathOrPrimitiveValue(S.model,D.Value);var I=K.isBindingValue(u);var n=K.isBindingValue(v);var p="parts: ["+(n?v:"{path: 'DUMMY'}");p+=I?","+u:"";p+="]";var q=false;if(u==="%"){q=true;}var r=0;var t;if(D.ValueFormat){r=K.getPathOrPrimitiveValue(S.model,D.ValueFormat.NumberOfFractionalDigits);t=K.getPathOrPrimitiveValue(S.model,D.ValueFormat.ScaleFactor);}if(r===""||r===undefined){r=0;if(q){r=1;}}t=t==""?undefined:t;var w=function(){var x=1;return d(n?arguments[0]:v,r,t,I?arguments[x++]:u);};var F=s(w,"formatFieldWithScaleCalculation");return"{"+p+", formatter: '"+F+"'}";};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolveKpiHeaderState=function(C,D){return j(C,D,sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.criticalityConstants.ColorValues);};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForDeviation=function(C,D){if(!D||!D.Value||!D.TargetValue){return"";}var S=C.getSetting("settings").getData();var v=K.getPathOrPrimitiveValue(S.model,D.Value);var t=K.getPathOrPrimitiveValue(S.model,D.TargetValue);var m=C.getSetting("dataModel");var M=m.getMetaModel();var E=M.getODataEntitySet(S.entitySet);var o=M.getODataEntityType(E.entityType);var i=M.getODataProperty(o,D.Value.Path);var u=K.getUnitofMeasure(S.model,i);var I=K.isBindingValue(t);var n=K.isBindingValue(u);var p=K.isBindingValue(v);var q=false;var r=0;var w;if(D.ValueFormat){r=K.getPathOrPrimitiveValue(S.model,D.ValueFormat.NumberOfFractionalDigits);w=K.getPathOrPrimitiveValue(S.model,D.ValueFormat.ScaleFactor);}var P="parts: ["+(p?v:"{path: 'DUMMY'}");P+=I?","+t:"";P+=n?","+u:"";P+="]";if(u==="%"){q=true;}if(r===""||r===undefined){r=0;if(q){r=1;}}w=w==""?undefined:w;var x=function(){var y=1;return f(p?arguments[0]:v,r,I?arguments[y++]:t,w,n?arguments[y++]:u);};var F=s(x,"formatDeviationCalculation");return"{"+P+", formatter: '"+F+"'}";};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForTrendIcon=function(C,D){if(!D||!D.Value||!D.Value.Path||!D.TrendCalculation){return"";}var S=C.getSetting("settings").getData();if(D.Trend){var t=K.getPathOrPrimitiveValue(S.model,D.Trend);return t;}var v=K.getPathOrPrimitiveValue(S.model,D.Value);var r=K.getPathOrPrimitiveValue(S.model,D.TrendCalculation.ReferenceValue);var i=K.getPathOrPrimitiveValue(S.model,D.TrendCalculation.DownDifference);var u=K.getPathOrPrimitiveValue(S.model,D.TrendCalculation.UpDifference);var I=K.isBindingValue(r);var m=K.isBindingValue(i);var n=K.isBindingValue(u);var p="parts: ["+v;p+=I?","+r:"";p+=m?","+i:"";p+=n?","+u:"";p+="]";var o=function(){var q=1;return b(arguments[0],I?arguments[q++]:r,m?arguments[q++]:i,n?arguments[q++]:u);};var F=s(o,"formatTrendDirection");return"{"+p+", formatter: '"+F+"'}";};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForScale=function(C,D){var S=C.getSetting("settings").getData();var m=C.getSetting("dataModel");var M=m.getMetaModel();var E=M.getODataEntitySet(S.entitySet);var o=M.getODataEntityType(E.entityType);var i=M.getODataProperty(o,D.Value.Path);var r="";if(i["Org.OData.Measures.V1.Unit"]){var u=i["Org.OData.Measures.V1.Unit"];if(u.Path){r=r+" {path: '"+u.Path+"'}";}else if(u.String){r=r+u.String;}}return r;};function j(C,D,o){var S=o.None;if(D.Criticality){var i=D.Criticality?D.Criticality.EnumMember.split("/")[1]:undefined;var I=K.isBindingValue(i);if(I){S=i;}else{S=c(D.Criticality,o);}}else if(D.CriticalityCalculation&&D.Value&&D.Value){S=k(C,D,o);}return S;}function k(C,D,o){var S=C.getSetting("settings").getData();var v=K.getPathOrPrimitiveValue(S.model,D.Value);var i=K.isBindingValue(v);var I=D.CriticalityCalculation.ImprovementDirection.EnumMember;var m=D.CriticalityCalculation.DeviationRangeLowValue?K.getPathOrPrimitiveValue(S.model,D.CriticalityCalculation.DeviationRangeLowValue):undefined;var n=D.CriticalityCalculation.DeviationRangeHighValue?K.getPathOrPrimitiveValue(S.model,D.CriticalityCalculation.DeviationRangeHighValue):undefined;var t=D.CriticalityCalculation.ToleranceRangeLowValue?K.getPathOrPrimitiveValue(S.model,D.CriticalityCalculation.ToleranceRangeLowValue):undefined;var p=D.CriticalityCalculation.ToleranceRangeHighValue?K.getPathOrPrimitiveValue(S.model,D.CriticalityCalculation.ToleranceRangeHighValue):undefined;var q=K.isBindingValue(m);var r=K.isBindingValue(n);var u=K.isBindingValue(t);var w=K.isBindingValue(p);var P="parts: ["+(i?v:"{path:'DUMMY'}");P+=q?","+m:"";P+=r?","+n:"";P+=u?","+t:"";P+=w?","+p:"";P+="]";var x=function(){var y=1;return a(i?arguments[0]:v,I,q?arguments[y++]:m,r?arguments[y++]:n,u?arguments[y++]:t,w?arguments[y++]:p,o);};var F=s(x,"formatCriticalityCalculation");return"{"+P+", formatter: '"+F+"'}";}function s(i,n){if(!sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.formatFunctions[n]){sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.formatFunctions[n]=0;}sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.formatFunctions[n]++;var F=n+sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.formatFunctions[n];sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.formatFunctions[F]=i;return"sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.formatFunctions."+F;}sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.getAggregateNumber=function(C,E,D,S,o){var m=D.Value.Path;var r="";var i="";r+="{path: '"+o.model+">/"+E.name+"'";r+=", length: 1";var E=o.metaModel.getODataEntitySet(o.entitySet);var n=o.metaModel.getODataEntityType(E.entityType,false);var u=l(m,n);var p=[];p.push(m);if(u){p.push(u);}if(D.TrendCalculation&&D.TrendCalculation.ReferenceValue&&D.TrendCalculation.ReferenceValue.Path){p.push(D.TrendCalculation.ReferenceValue.Path);}return r+", parameters:{select:'"+p.join(",")+"'}"+i+"}";};sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.getAggregateNumber.requiresIContext=true;sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolveKpiHeaderState.requiresIContext=true;sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForTrendIcon.requiresIContext=true;sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForKpiValue.requiresIContext=true;sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForDeviation.requiresIContext=true;sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForKpiTargetValue.requiresIContext=true;sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter.resolvePathForScale.requiresIContext=true;function l(m,E){var p=E.property;for(var i=0,n=p.length;i<n;i++){if(p[i].name==m){if(p[i].hasOwnProperty("sap:unit")){return p[i]["sap:unit"];}break;}}return null;}return sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter;},true);
