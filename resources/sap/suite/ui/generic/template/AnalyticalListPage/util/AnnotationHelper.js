(function(){"use strict";jQuery.sap.require("sap.ui.comp.smartfield.SmartField");jQuery.sap.require("sap.suite.ui.generic.template.extensionAPI.UIMode");jQuery.sap.require("sap/ui/model/Context");sap.ui.require("sap/suite/ui/generic/template/extensionAPI/UIMode");jQuery.sap.declare("sap.suite.ui.generic.template.AnalyticalListPage.util.AnnotationHelper");sap.suite.ui.generic.template.AnalyticalListPage.util.AnnotationHelper={getDetailEntitySet:function(c){var o=c.getObject();var m=c.getModel();var M=m.getProperty("/metaModel");return M.createBindingContext(M.getODataEntitySet(o,true));},resolveMetaModelPath:function(c){var p=c.getObject();var m=c.getModel();var M=m.getProperty("/metaModel");return M.createBindingContext(p);},createWorkingContext:function(c){var p=c.getObject(),s=p.settings,m=c.getModel(),M=m.getProperty("/metaModel"),E=M.getODataEntitySet(p.entitySet),o=M.getODataEntityType(E.entityType),a="",w={};a=o.$path+"/com.sap.vocabularies.UI.v1.PresentationVariant"+(s&&s.qualifier?"#"+s.qualifier:"");w.presentationVariant=M.getObject(a);w.presentationVariantPath=a;w.presentationVariantQualifier=a.split("#")[1]||"";if(s.qualifier&&!w.presentationVariant){var e=new Error("Error in manifest.json: No PresentationVariant found for qualifier: "+s.qualifier,"./manifest.json");throw e;}if(w.presentationVariant&&w.presentationVariant.Visualizations){w.presentationVariant.Visualizations.forEach(function(v){var P="/"+v.AnnotationPath.slice(1);if(P.indexOf("com.sap.vocabularies.UI.v1.LineItem")>-1){a=o.$path+P;w.lineItem=M.getObject(a);w.lineItemPath=a;w.lineItemQualifier=a.split("#")[1]||"";}if(P.indexOf("com.sap.vocabularies.UI.v1.Chart")>-1){a=o.$path+P;w.chart=M.getObject(a);w.chartPath=a;w.chartQualifier=a.split("#")[1]||"";}});}if(!w.lineItem){a=o.$path+"/com.sap.vocabularies.UI.v1.LineItem";w.lineItem=M.getObject(a);w.lineItemPath=a;w.lineItemQualifier="";}if(!w.chart){a=o.$path+"/com.sap.vocabularies.UI.v1.Chart";w.chart=M.getObject(a);w.chartPath=a;w.chartQualifier="";}m.setProperty("/workingContext",w);return"/workingContext";},hasDeterminingActionsForALP:function(t,c,e,m){if(e&&m&&m["sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage"]&&sap.suite.ui.generic.template.js.AnnotationHelper._hasCustomDeterminingActionsInListReport(e,m["sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage"]["sap.ui.generic.app"])){return true;}for(var r=0;r<t.length;r++){if((t[r].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"||t[r].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")&&t[r].Determining&&t[r].Determining.Bool==="true"){return true;}}for(var r=0;r<c.length;r++){if((c[r].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"||c[r].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")&&c[r].Determining&&c[r].Determining.Bool==="true"){return true;}}return false;}};sap.suite.ui.generic.template.AnalyticalListPage.util.AnnotationHelper.getDetailEntitySet.requiresIContext=true;})();