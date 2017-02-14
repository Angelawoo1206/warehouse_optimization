/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");sap.ui.define(["sap/apf/modeler/ui/controller/propertyType"],function(B){"use strict";var t=new sap.apf.modeler.ui.utils.TextManipulator();return B.extend("sap.apf.modeler.ui.controller.representationProperty",{onBeforeRendering:function(){var c=this;if(c.byId("idLabelDisplayOptionType")){c.byId("idLabelDisplayOptionType").destroy();}c.byId("idPropertyTypeLayout").setSpan("L4 M4 S4");},getAllPropertiesAsPromise:function(){var c=this,s,p,P=[];var S=c.oStepPropertyMetadataHandler.oStep;var d=jQuery.Deferred();S.getConsumablePropertiesForRepresentation(c.oRepresentation.getId()).done(function(r){r.consumable.forEach(function(a){c.oStepPropertyMetadataHandler.getProperties().forEach(function(b){if(a===b){P.push(a);}});});s=c.getSelectedProperty();if(s!==undefined){p=P.indexOf(s)!==-1?P:P.concat(s);P=r.available.indexOf(s)!==-1?p:P.concat(t.addPrefixText([s],sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));s=r.available.indexOf(s)!==-1?s:t.addPrefixText([s],sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)[0];}d.resolve({aAllProperties:P,sSelectedKey:s});});return d.promise();},getPropertyTextLabelKey:function(p){var c=this;return c.oRepresentation.getPropertyTextLabelKey(p);},updateProperties:function(p){var c=this;c.oRepresentation.getProperties().forEach(function(m){c.oRepresentation.removeProperty(m);});p.forEach(function(P){c.oRepresentation.addProperty(P.sProperty);c.oRepresentation.setPropertyKind(P.sProperty,P.sKind);c.oRepresentation.setPropertyTextLabelKey(P.sProperty,P.sTextLabelKey);});},createNewPropertyInfo:function(n){var c=this,N={};N.sProperty=n;N.sKind=c.getView().getViewData().oPropertyTypeData.sContext;N.sTextLabelKey=undefined;return N;},createCurrentProperiesInfo:function(p){var c={},C=this;c.sProperty=p;c.sKind=C.oRepresentation.getPropertyKind(p);c.sTextLabelKey=C.oRepresentation.getPropertyTextLabelKey(p);return c;},setPropertyTextLabelKey:function(p,l){var c=this;c.oRepresentation.setPropertyTextLabelKey(p,l);},setNextPropertyInParentObject:function(){var c=this;var p=c.getView().getViewData().oPropertyTypeData.sProperty;var k=c.getView().getViewData().oPropertyTypeData.sContext;c.oRepresentation.addProperty(p);c.oRepresentation.setPropertyKind(p,k);c.setPropertyTextLabelKey(p,undefined);c.setDetailData();},removePropertyFromParentObject:function(){var c=this;c.oRepresentation.removeProperty(t.removePrefixText(c.byId("idPropertyType").getSelectedKey(),sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));},addProperty:function(){var c=this,p=[];var s=c.oStepPropertyMetadataHandler.oStep;var C=sap.apf.modeler.ui.utils.CONSTANTS;s.getConsumablePropertiesForRepresentation(c.oRepresentation.getId()).done(function(r){r.consumable.forEach(function(P){c.oStepPropertyMetadataHandler.getProperties().forEach(function(S){if(P===S){p.push(P);}});});c.getView().fireEvent(C.events.ADDPROPERTY,{"sProperty":p[0],"sContext":c.getView().getViewData().oPropertyTypeData.sContext});c.oConfigurationEditor.setIsUnsaved();});},addRemovedProperty:function(e){var c=this;var p=e.getParameter("sProperty");var i=new sap.ui.core.Item({key:p,text:p});c.byId("idPropertyType").addItem(i);},removeAddedProperty:function(e){var c=this;var p=e.getParameter("sProperty");var i=c.byId("idPropertyType").getItems();i.forEach(function(I){if(I.getKey()===p){c.byId("idPropertyType").removeItem(I);}});}});});