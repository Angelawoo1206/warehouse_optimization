/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");jQuery.sap.require('sap.apf.modeler.ui.utils.constants');jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");(function(){"use strict";var t=new sap.apf.modeler.ui.utils.TextManipulator();var n=new sap.apf.modeler.ui.utils.NullObjectChecker();var o=new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();var c=sap.apf.modeler.ui.utils.CONSTANTS.events;var T=sap.apf.modeler.ui.utils.TranslationFormatMap.REPRESENTATION_LABEL;function _(C){var r=C.oRepresentation.getRepresentationType();var k=C.getView().getViewData().oPropertyTypeData.sContext;var p=C.getView().getViewData().oRepresentationTypeHandler.getLabelsForChartType(C.oTextReader,r,k);C.byId("idPropertyTypeLabel").setText(p);C.byId("idPropertyTypeLabel").setTooltip(p);}function a(C){C.byId("idAriaPropertyForAdd").setText(C.oTextReader("ariaTextForAddIcon"));C.byId("idAriaPropertyForDelete").setText(C.oTextReader("ariaTextForDeleteIcon"));}function b(C){var m;C.getAllPropertiesAsPromise().done(function(r){m=o.convert(r.aAllProperties);C.byId("idPropertyType").setModel(m);C.byId("idPropertyType").setSelectedKey(r.sSelectedKey);});}function d(C){var p=t.removePrefixText(C.byId("idPropertyType").getSelectedKey(),sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);var s=C.getPropertyTextLabelKey(p)?C.oTextReader("label"):C.oTextReader("label")+" ("+C.oTextReader("default")+")";C.byId("idPropertyLabel").setText(s);C.byId("idPropertyLabel").setTooltip(s);}function e(C){var p;var P=t.removePrefixText(C.byId("idPropertyType").getSelectedKey(),sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);var s=C.getPropertyTextLabelKey(P);if(n.checkIsNotUndefined(s)){p=C.getView().getViewData().oConfigurationHandler.getTextPool().get(s).TextElementDescription;}else{p=C.oStepPropertyMetadataHandler.getDefaultLabel(P);}C.byId("idPropertyLabelText").setValue(p);}function f(C){C.byId("idAddPropertyIcon").setTooltip(C.oTextReader("addButton"));C.byId("idRemovePropertyIcon").setTooltip(C.oTextReader("deleteButton"));}function g(C){var p=C.getView().getViewData().sPropertyType;var k=C.getView().getViewData().oPropertyTypeData.sContext;var s=C.oRepresentationTypeHandler.isAdditionToBeEnabled(C.oRepresentation.getRepresentationType(),p,k);var S=s;var P=C.getView().getViewData().oPropertyTypeState;var i=P.indexOfPropertyTypeViewId(C.getView().getId());if(i===0){S=false;}else if(i>0){var j=P.getViewAt(i-1);var l=j.getViewData().oPropertyTypeData.sContext;if(k!==l){S=false;}}C.byId("idAddPropertyIcon").setVisible(s);C.byId("idRemovePropertyIcon").setVisible(S);}function h(C){C.byId("idAddPropertyIcon").attachEvent(c.SETFOCUSONADDICON,C.setFocusOnAddIcons.bind(C));}sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.propertyType",{oConfigurationEditor:{},oRepresentation:{},oStepPropertyMetadataHandler:{},oRepresentationTypeHandler:{},oTextReader:{},oTextPool:{},onInit:function(){var C=this;C.oConfigurationEditor=C.getView().getViewData().oConfigurationEditor;C.oRepresentation=C.getView().getViewData().oParentObject;C.oStepPropertyMetadataHandler=C.getView().getViewData().oStepPropertyMetadataHandler;C.oRepresentationTypeHandler=C.getView().getViewData().oRepresentationTypeHandler;C.oTextReader=C.getView().getViewData().oCoreApi.getText;C.oTextPool=C.getView().getViewData().oTextPool;b(C);C.setDetailData();},onAfterRendering:function(){var C=this;C.enableDisableLabelDisplayOptionType();C.byId("idAddPropertyIcon").fireEvent(c.SETFOCUSONADDICON);},setDetailData:function(){var C=this;C.setLabelDisplayOptionType(o);e(C);a(C);d(C);_(C);f(C);g(C);},handleChangeForPropertyType:function(){var C=this;var i=C.getView().getViewData().oPropertyTypeState.indexOfPropertyTypeViewId(C.getView().getId());var O=C.getView().getViewData().oPropertyTypeState.getPropertyValueState()[i];var N=t.removePrefixText(C.byId("idPropertyType").getSelectedKey(),sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);C.getView().fireEvent(c.UPDATEPROPERTYVALUESTATE,{"sProperty":N});C.updatePropertyType(N);C.setDetailData();C.enableDisableLabelDisplayOptionType();C.getView().fireEvent(c.UPDATEPROPERTY,{"sOldProperty":O});C.oConfigurationEditor.setIsUnsaved();},handleChangeForLabelDisplayOptionType:function(){var C=this;var p=t.removePrefixText(C.byId("idPropertyType").getSelectedKey(),sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);var l=C.byId("idLabelDisplayOptionType").getSelectedKey();C.oRepresentation.setLabelDisplayOption(p,l);C.oConfigurationEditor.setIsUnsaved();},handleChangeForLabelText:function(){var C=this,l;var L=C.byId("idPropertyLabelText").getValue();var p=t.removePrefixText(C.byId("idPropertyType").getSelectedKey(),sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);if(L.trim().length===0){l=undefined;}else{l=C.getView().getViewData().oConfigurationHandler.getTextPool().setText(L,T);}C.setPropertyTextLabelKey(p,l);d(C);e(C);C.oConfigurationEditor.setIsUnsaved();},setFocusOnAddIcons:function(){var C=this;C.byId("idAddPropertyIcon").focus();},setFocusOnRemoveIcons:function(){var C=this;C.byId("idPropertyType").focus();},handlePressOfAddPropertyIcon:function(){var C=this;h(C);C.addProperty();},handlePressOfRemovePropertyIcon:function(){var C=this;C.getView().fireEvent(c.FOCUSONREMOVE);C.getView().fireEvent(c.REMOVEPROPERTY);C.oConfigurationEditor.setIsUnsaved();C.getView().destroy();},updatePropertyType:function(N){var C=this;var p=[],i={};var P=C.getView().getViewData().oPropertyTypeState;var j=P.getPropertyValueState();var k=P.indexOfPropertyTypeViewId(C.getView().getId());i=C.createNewPropertyInfo(N);j.forEach(function(s,l){if(k===l){p.push(i);}else{p.push(C.createCurrentProperiesInfo(s));}});C.updateProperties(p);},handleSuggestions:function(E){var C=this;var s=new sap.apf.modeler.ui.utils.SuggestionTextHandler(C.oTextPool);s.manageSuggestionTexts(E,T);},getSelectedProperty:function(){var C=this;var p=C.getView().getViewData().oPropertyTypeState;var i=p.getPropertyValueState();var j=p.indexOfPropertyTypeViewId(C.getView().getId());return i[j];},updateProperties:function(p){},createNewPropertyInfo:function(N){},createCurrentProperiesInfo:function(p,N){},setPropertyInParentObject:function(){},setLabelDisplayOptionType:function(o){},getAllPropertiesAsPromise:function(){},getPropertyTextLabelKey:function(p){},setPropertyTextLabelKey:function(p,l){},enableDisableLabelDisplayOptionType:function(){},removePropertyFromParentObject:function(){},addProperty:function(){}});}());
