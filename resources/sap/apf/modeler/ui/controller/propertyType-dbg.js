/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
(function() {
	"use strict";
	var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var oConstants = sap.apf.modeler.ui.utils.CONSTANTS.events;
	var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.REPRESENTATION_LABEL;
	function _setDisplayTextForProperty(oController) {
		var sRepresentationType = oController.oRepresentation.getRepresentationType();
		var sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
		var sPropertyText = oController.getView().getViewData().oRepresentationTypeHandler.getLabelsForChartType(oController.oTextReader, sRepresentationType, sKind);
		oController.byId("idPropertyTypeLabel").setText(sPropertyText);
		oController.byId("idPropertyTypeLabel").setTooltip(sPropertyText);
	}
	function _setInvisibleTexts(oController) {
		oController.byId("idAriaPropertyForAdd").setText(oController.oTextReader("ariaTextForAddIcon"));
		oController.byId("idAriaPropertyForDelete").setText(oController.oTextReader("ariaTextForDeleteIcon"));
	}
	function _setProperty(oController) {
		var oModelForProperties;
		oController.getAllPropertiesAsPromise().done(function(oResponse) {
			oModelForProperties = optionsValueModelBuilder.convert(oResponse.aAllProperties);
			oController.byId("idPropertyType").setModel(oModelForProperties);
			oController.byId("idPropertyType").setSelectedKey(oResponse.sSelectedKey);
		});
	}
	function _setDisplayTextForPropertyLabel(oController) {
		var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);
		var sTextForLabel = oController.getPropertyTextLabelKey(sPropertyName) ? oController.oTextReader("label") : oController.oTextReader("label") + " (" + oController.oTextReader("default") + ")";
		oController.byId("idPropertyLabel").setText(sTextForLabel);
		oController.byId("idPropertyLabel").setTooltip(sTextForLabel);
	}
	function _setPropertyLabelText(oController) {
		var sPropertyLabelText;
		var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);
		var sPropertyLabelKey = oController.getPropertyTextLabelKey(sPropertyName);
		if (nullObjectChecker.checkIsNotUndefined(sPropertyLabelKey)) {
			sPropertyLabelText = oController.getView().getViewData().oConfigurationHandler.getTextPool().get(sPropertyLabelKey).TextElementDescription;
		} else {
			sPropertyLabelText = oController.oStepPropertyMetadataHandler.getDefaultLabel(sPropertyName);
		}
		oController.byId("idPropertyLabelText").setValue(sPropertyLabelText);
	}
	function _setDisplayTooltipForAddAndRemoveIcons(oController) {
		oController.byId("idAddPropertyIcon").setTooltip(oController.oTextReader("addButton"));
		oController.byId("idRemovePropertyIcon").setTooltip(oController.oTextReader("deleteButton"));
	}
	function _setVisibilityForAddAndRemoveIcons(oController) {
		var sPropertyType = oController.getView().getViewData().sPropertyType;
		var sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
		var bShowAddIcon = oController.oRepresentationTypeHandler.isAdditionToBeEnabled(oController.oRepresentation.getRepresentationType(), sPropertyType, sKind);
		var bShowRemoveIcon = bShowAddIcon;
		var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
		var nIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
		if (nIndex === 0) {
			bShowRemoveIcon = false;
		} else if (nIndex > 0) {
			var oPreviousPropertyView = oPropertyTypeState.getViewAt(nIndex - 1);
			var sPreviousRowKind = oPreviousPropertyView.getViewData().oPropertyTypeData.sContext;
			if (sKind !== sPreviousRowKind) {
				bShowRemoveIcon = false;
			}
		}
		oController.byId("idAddPropertyIcon").setVisible(bShowAddIcon);
		oController.byId("idRemovePropertyIcon").setVisible(bShowRemoveIcon);
	}
	function _attachEvent(oController) {
		oController.byId("idAddPropertyIcon").attachEvent(oConstants.SETFOCUSONADDICON, oController.setFocusOnAddIcons.bind(oController));
	}
	sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.propertyType", {
		oConfigurationEditor : {},
		oRepresentation : {},
		oStepPropertyMetadataHandler : {},
		oRepresentationTypeHandler : {},
		oTextReader : {},
		oTextPool : {},
		onInit : function() {
			var oController = this;
			oController.oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
			oController.oRepresentation = oController.getView().getViewData().oParentObject;
			oController.oStepPropertyMetadataHandler = oController.getView().getViewData().oStepPropertyMetadataHandler;
			oController.oRepresentationTypeHandler = oController.getView().getViewData().oRepresentationTypeHandler;
			oController.oTextReader = oController.getView().getViewData().oCoreApi.getText;
			oController.oTextPool = oController.getView().getViewData().oTextPool;
			_setProperty(oController);
			oController.setDetailData();
		},
		onAfterRendering : function() {
			var oController = this;
			oController.enableDisableLabelDisplayOptionType();
			oController.byId("idAddPropertyIcon").fireEvent(oConstants.SETFOCUSONADDICON);
		},
		setDetailData : function() {
			var oController = this;
			oController.setLabelDisplayOptionType(optionsValueModelBuilder);
			_setPropertyLabelText(oController);
			_setInvisibleTexts(oController);
			_setDisplayTextForPropertyLabel(oController);
			_setDisplayTextForProperty(oController);
			_setDisplayTooltipForAddAndRemoveIcons(oController);
			_setVisibilityForAddAndRemoveIcons(oController);
		},
		handleChangeForPropertyType : function() {
			var oController = this;
			var nCurrentViewIndex = oController.getView().getViewData().oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			var sOldSortProperty = oController.getView().getViewData().oPropertyTypeState.getPropertyValueState()[nCurrentViewIndex];
			var sNewProperty = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);
			oController.getView().fireEvent(oConstants.UPDATEPROPERTYVALUESTATE, {
				"sProperty" : sNewProperty
			});
			oController.updatePropertyType(sNewProperty);
			oController.setDetailData();
			oController.enableDisableLabelDisplayOptionType();
			oController.getView().fireEvent(oConstants.UPDATEPROPERTY, {
				"sOldProperty" : sOldSortProperty
			});
			oController.oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForLabelDisplayOptionType : function() {
			var oController = this;
			var sProperty = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);
			var sLabelDisplayOption = oController.byId("idLabelDisplayOptionType").getSelectedKey();
			oController.oRepresentation.setLabelDisplayOption(sProperty, sLabelDisplayOption);
			oController.oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForLabelText : function() {
			var oController = this, sLabelTextKey;
			var sLabelText = oController.byId("idPropertyLabelText").getValue();
			var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE);
			if (sLabelText.trim().length === 0) {
				sLabelTextKey = undefined;
			} else {
				sLabelTextKey = oController.getView().getViewData().oConfigurationHandler.getTextPool().setText(sLabelText, oTranslationFormat);
			}
			oController.setPropertyTextLabelKey(sPropertyName, sLabelTextKey);
			_setDisplayTextForPropertyLabel(oController);
			_setPropertyLabelText(oController);
			oController.oConfigurationEditor.setIsUnsaved();
		},
		setFocusOnAddIcons : function() {
			var oController = this;
			oController.byId("idAddPropertyIcon").focus();
		},
		setFocusOnRemoveIcons : function() {
			var oController = this;
			oController.byId("idPropertyType").focus();
		},
		handlePressOfAddPropertyIcon : function() {
			var oController = this;
			_attachEvent(oController);
			oController.addProperty();
		},
		handlePressOfRemovePropertyIcon : function() {
			var oController = this;
			oController.getView().fireEvent(oConstants.FOCUSONREMOVE);
			oController.getView().fireEvent(oConstants.REMOVEPROPERTY);
			oController.oConfigurationEditor.setIsUnsaved();
			oController.getView().destroy();
		},
		updatePropertyType : function(sNewProperty) {
			var oController = this;
			var aPropertiesInformation = [], oNewPropertyInfo = {};
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			oNewPropertyInfo = oController.createNewPropertyInfo(sNewProperty);
			aCurrentPropertiesState.forEach(function(sProperty, nIndex) {
				if (nCurrentViewIndex === nIndex) {
					aPropertiesInformation.push(oNewPropertyInfo);
				} else {
					aPropertiesInformation.push(oController.createCurrentProperiesInfo(sProperty));
				}
			});
			oController.updateProperties(aPropertiesInformation);
		},
		// handler for suggestions
		handleSuggestions : function(oEvent) {
			var oController = this;
			var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oController.oTextPool);
			oSuggestionTextHandler.manageSuggestionTexts(oEvent, oTranslationFormat);
		},
		getSelectedProperty : function() {
			var oController = this;
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentSortPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			return aCurrentSortPropertiesState[nCurrentViewIndex];
		},
		// Stubs to be implemented in sub views depending on sub view logic
		updateProperties : function(aPropertiesInformation) {
		},
		createNewPropertyInfo : function(sNewProperty) {
		},
		createCurrentProperiesInfo : function(sProperty, oNewPropertyInfo) {
		},
		setPropertyInParentObject : function() {
		},
		setLabelDisplayOptionType : function(optionsValueModelBuilder) {
		},
		getAllPropertiesAsPromise : function() {
		},
		getPropertyTextLabelKey : function(sPropertyName) {
		},
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
		},
		enableDisableLabelDisplayOptionType : function() {
		},
		removePropertyFromParentObject : function() {
		},
		addProperty : function() {
		}
	});
}());
