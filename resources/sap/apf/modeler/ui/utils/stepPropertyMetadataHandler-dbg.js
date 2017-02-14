/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.stepPropertyMetadataHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
(function() {
	'use strict';
	var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler = function(oCoreApi, oStep) {
		this.oCoreApi = oCoreApi;
		this.oStep = oStep;
	};
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.prototype.constructor = sap.apf.modeler.ui.utils.StepPropertyMetadataHandler;
	function _filterPropertiesByAggRole(oStepPropertyMetadataHandler, sAggRoleToBeFiltered) {
		var aProperties = [], sAggRole;
		var aSelectProperties = oStepPropertyMetadataHandler.oStep.getSelectProperties();
		aSelectProperties.forEach(function(sProperty) {
			if (oStepPropertyMetadataHandler.getPropertyMetadata(sProperty)) {
				sAggRole = oStepPropertyMetadataHandler.getPropertyMetadata(sProperty)["aggregation-role"];
				if (sAggRole === sAggRoleToBeFiltered) {
					aProperties.push(sProperty);
				}
			}
		});
		return aProperties;
	}
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.prototype.getDimensions = function() {
		return _filterPropertiesByAggRole(this, oConstants.aggregationRoles.DIMENSION);
	};
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.prototype.getMeasures = function() {
		return _filterPropertiesByAggRole(this, oConstants.aggregationRoles.MEASURE);
	};
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.prototype.getProperties = function() {
		return this.oStep.getSelectProperties();
	};
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.prototype.getPropertyMetadata = function(sProperty) {
		var sAbsolutePathToServiceDocument = this.oStep.getService();
		var sEntitySet = this.oStep.getEntitySet();
		var oEntityMetadata = this.oCoreApi.getEntityTypeMetadata(sAbsolutePathToServiceDocument, sEntitySet);
		if (!oEntityMetadata) {
			return undefined;
		}
		return oEntityMetadata.getPropertyMetadata(sProperty);
	};
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.prototype.getDefaultLabel = function(sProperty) {
		var oStepPropertyMetadataHandler = this;
		var oPropertyMetadata = oStepPropertyMetadataHandler.getPropertyMetadata(sProperty);
		if (!oPropertyMetadata) {
			return "";
		}
		return oPropertyMetadata.label || oPropertyMetadata.name;
	};
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.prototype.hasTextPropertyOfDimension = function(dimension) {
		var isPresent = false, aSelectProperties, oStepPropertyMetadataHandler = this;
		var oDimensionMetadata = oStepPropertyMetadataHandler.getPropertyMetadata(dimension);
		if (!oDimensionMetadata) {
			return isPresent;
		}
		if (oDimensionMetadata.text) {
			aSelectProperties = this.oStep.getSelectProperties();
			isPresent = aSelectProperties.indexOf(oDimensionMetadata.text) === -1 ? false : true;
		}
		return isPresent;
	};
})();