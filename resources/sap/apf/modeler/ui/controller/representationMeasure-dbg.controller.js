/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.propertyType");
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
(function() {
	"use strict";
	var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	sap.apf.modeler.ui.controller.propertyType.extend("sap.apf.modeler.ui.controller.representationMeasure", {
		onBeforeRendering : function() {
			var oController = this;
			if (oController.byId("idLabelDisplayOptionType")) {
				oController.byId("idLabelDisplayOptionType").destroy();
			}
			oController.byId("idPropertyTypeLayout").setSpan("L4 M4 S4");
		},
		getAllPropertiesAsPromise : function() {
			var oController = this, aAllProperties, sSelectedKey, aPropertiesWithSelectedKey, sAggRole, aMeasures = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			var deferred = jQuery.Deferred();
			oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
				aAllProperties = oResponse.consumable;
				aAllProperties.forEach(function(sProperty) {
					if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(sProperty)) {
						sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(sProperty)["aggregation-role"];
						if (sAggRole === oConstants.aggregationRoles.MEASURE) {
							aMeasures.push(sProperty);
						}
					}
				});
				sSelectedKey = oController.getSelectedProperty();
				if (sSelectedKey !== undefined) {
					aPropertiesWithSelectedKey = aMeasures.indexOf(sSelectedKey) !== -1 ? aMeasures : aMeasures.concat(sSelectedKey);
					aMeasures = oResponse.available.indexOf(sSelectedKey) !== -1 ? aPropertiesWithSelectedKey : aMeasures.concat(oTextManipulator.addPrefixText([ sSelectedKey ], sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
					sSelectedKey = oResponse.available.indexOf(sSelectedKey) !== -1 ? sSelectedKey : oTextManipulator.addPrefixText([ sSelectedKey ], sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)[0];
				}
				deferred.resolve({
					aAllProperties : aMeasures,
					sSelectedKey : sSelectedKey
				});
			});
			return deferred.promise();
		},
		getPropertyTextLabelKey : function(sPropertyName) {
			var oController = this;
			return oController.oRepresentation.getMeasureTextLabelKey(sPropertyName);
		},
		updateProperties : function(aPropertiesInformation) {
			var oController = this;
			oController.oRepresentation.getMeasures().forEach(function(sMeasure) {
				oController.oRepresentation.removeMeasure(sMeasure);
			});
			aPropertiesInformation.forEach(function(oPropertiesInformation) {
				oController.oRepresentation.addMeasure(oPropertiesInformation.sProperty);
				oController.oRepresentation.setMeasureKind(oPropertiesInformation.sProperty, oPropertiesInformation.sKind);
				oController.oRepresentation.setMeasureTextLabelKey(oPropertiesInformation.sProperty, oPropertiesInformation.sTextLabelKey);
			});
		},
		createNewPropertyInfo : function(sNewProperty) {
			var oController = this, oNewPropertyInfo = {};
			oNewPropertyInfo.sProperty = sNewProperty;
			oNewPropertyInfo.sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
			oNewPropertyInfo.sTextLabelKey = undefined;
			return oNewPropertyInfo;
		},
		createCurrentProperiesInfo : function(sMeasure, oNewPropertyInfo) {
			var oCurrentPropertiesInformation = {}, oController = this;
			oCurrentPropertiesInformation.sProperty = sMeasure;
			oCurrentPropertiesInformation.sKind = oController.oRepresentation.getMeasureKind(sMeasure);
			oCurrentPropertiesInformation.sTextLabelKey = oController.oRepresentation.getMeasureTextLabelKey(sMeasure);
			return oCurrentPropertiesInformation;
		},
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
			var oController = this;
			oController.oRepresentation.setMeasureTextLabelKey(sPropertyName, sLabelTextKey);
		},
		setNextPropertyInParentObject : function() {
			var oController = this;
			var sProperty = oController.getView().getViewData().oPropertyTypeData.sProperty;
			var sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
			oController.oRepresentation.addMeasure(sProperty);
			oController.oRepresentation.setMeasureKind(sProperty, sKind);
			oController.setPropertyTextLabelKey(sProperty, undefined);
			oController.setDetailData();
		},
		removePropertyFromParentObject : function() {
			var oController = this;
			oController.oRepresentation.removeMeasure(oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
		},
		addProperty : function() {
			var oController = this, sAggRole, aMeasures = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
				oResponse.consumable.forEach(function(sProperty) {
					if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(sProperty)) {
						sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(sProperty)["aggregation-role"];
						if (sAggRole === oConstants.aggregationRoles.MEASURE) {
							aMeasures.push(sProperty);
						}
					}
				});
				oController.getView().fireEvent(oConstants.events.ADDPROPERTY, {
					"sProperty" : aMeasures[0],
					"sContext" : oController.getView().getViewData().oPropertyTypeData.sContext
				});
				oController.oConfigurationEditor.setIsUnsaved();
			});
		},
		addRemovedProperty : function(oEvent) {
			var oController = this;
			var sProperty = oEvent.getParameter("sProperty");
			var oItem = new sap.ui.core.Item({
				key : sProperty,
				text : sProperty
			});
			oController.byId("idPropertyType").addItem(oItem);
		},
		removeAddedProperty : function(oEvent) {
			var oController = this;
			var sProperty = oEvent.getParameter("sProperty");
			var aItems = oController.byId("idPropertyType").getItems();
			aItems.forEach(function(oItem) {
				if (oItem.getKey() === sProperty) {
					oController.byId("idPropertyType").removeItem(oItem);
				}
			});
		}
	});
}());
