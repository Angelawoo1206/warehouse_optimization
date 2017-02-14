/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.utils.constants");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var oRepresentationInstance, oRepresentation, oParentStep, oConfigurationHandler, oTextReader, oRepresentationHandler, oStepPropertyMetadataHandler, oRepresentationTypeHandler;
	var oTableRepresentation = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
	function _drawMainChart(oController) {
		var sStepTitleId = !oConfigurationHandler.getTextPool().isInitialTextKey(oParentStep.getLongTitleId()) ? oParentStep.getLongTitleId() : oParentStep.getTitleId();
		var oMainChart = oRepresentationInstance.getMainContent(_checkForTexts(sStepTitleId), 480, 330);
		oController.byId("idMainChart").addItem(oMainChart);
	}
	function _checkForTexts(oSampleTextId) {
		var oSampleText = oSampleTextId && oConfigurationHandler.getTextPool().get(oSampleTextId), sSampleText;
		if (oSampleText !== undefined) {
			sSampleText = oSampleText.TextElementDescription;
		}
		return sSampleText;
	}
	function _getCornerText(sMethodName) {
		var mPreviewCornerText = _checkForTexts(oRepresentation[sMethodName]());
		if (mPreviewCornerText === undefined) {
			mPreviewCornerText = _checkForTexts(oParentStep[sMethodName]());
		}
		return mPreviewCornerText;
	}
	function _drawThumbnailContent(oController) {
		var sStepTitle = _checkForTexts(oParentStep.getTitleId());
		oController.byId("idStepTitleText").setText(sStepTitle);
		oController.byId("idThumbnailChartLayout").addItem(oRepresentationInstance.getThumbnailContent());
		oController.byId("idLeftUpperCornerText").setText(_getCornerText("getLeftUpperCornerTextKey"));
		oController.byId("idRightUpperCornerText").setText(_getCornerText("getRightUpperCornerTextKey"));
		oController.byId("idLeftLowerCornerText").setText(_getCornerText("getLeftLowerCornerTextKey"));
		oController.byId("idRightLowerCornerText").setText(_getCornerText("getRightLowerCornerTextKey"));
	}
	// Draws main chart and thumb nail content and Adds necessary style classes to view.
	function _drawContent(oController) {
		_drawMainChart(oController);
		_drawThumbnailContent(oController);
	}
	// Uses the Array#sort method to sort data.
	function _sortData(aData, aSortProperties) {
		return aData.sort(function(oRow1, oRow2) {
			var nResult, i;
			for(i = 0; i < aSortProperties.length; i++) {
				if (oRow1[aSortProperties[i].property] < oRow2[aSortProperties[i].property]) {
					nResult = -1;
				} else if (oRow1[aSortProperties[i].property] > oRow2[aSortProperties[i].property]) {
					nResult = 1;
				}
				nResult = nResult * [ 1, -1 ][+!aSortProperties[i].ascending];
				if (nResult !== 0) {
					return nResult;
				}
			}
		});
	}
	function _getSelectedPropertyRowsOfBasicData(sLabelTextKeyMethod, oActualProperties, aProperty) {
		var sPropertyLabelText, sLabelTextKey, aProperties = [];
		oActualProperties.forEach(function(oData) {
			if (oData.sProperty === "") {
				oData.sProperty = aProperty[0];
			}
			if (oData.sProperty !== oTextReader("none")) {
				sLabelTextKey = sLabelTextKeyMethod(oData.sProperty);
				if (sLabelTextKey !== undefined) {
					sPropertyLabelText = oConfigurationHandler.getTextPool().get(sLabelTextKey).TextElementDescription;
				} else {
					sPropertyLabelText = oStepPropertyMetadataHandler.getDefaultLabel(oData.sProperty);
				}
				aProperties.push({
					fieldName : oData.sProperty,
					sAggregationRole : oStepPropertyMetadataHandler.getPropertyMetadata(oData.sProperty)["aggregation-role"],
					fieldDesc : sPropertyLabelText,
					kind : oData.sContext
				});
			}
		});
		return aProperties;
	}
	function _getPropertyDataset(aPropertyType) {
		var aPropertyRows = [];
		if (aPropertyType === "properties" && oRepresentation.getRepresentationType() === oTableRepresentation) {
			aPropertyRows = _getSelectedPropertyRowsOfBasicData(oRepresentation.getPropertyTextLabelKey, oRepresentationHandler.getActualProperties(), oStepPropertyMetadataHandler.getProperties());
		} else if (aPropertyType === "dimensions" && oRepresentation.getRepresentationType() !== oTableRepresentation) {
			aPropertyRows = _getSelectedPropertyRowsOfBasicData(oRepresentation.getDimensionTextLabelKey, oRepresentationHandler.getActualDimensions().concat(oRepresentationHandler.getActualLegends()), oStepPropertyMetadataHandler.getDimensions());
		} else if (aPropertyType === "measures" && oRepresentation.getRepresentationType() !== oTableRepresentation) {
			aPropertyRows = _getSelectedPropertyRowsOfBasicData(oRepresentation.getMeasureTextLabelKey, oRepresentationHandler.getActualMeasures(), oStepPropertyMetadataHandler.getMeasures());
		}
		return aPropertyRows;
	}
	/*          Generates dynamic data based on the dimensions and measures.
	            Data grows exponentially based on the number of dimensions available.
	            Each dimension will have (nSamplesPerDimension) data with random values for measures.*/
	function _generateSampleData() {
		var aSampleData = [], aSort = [], i = 0, nSamplesPerDimension = 3; //Change the value of nSamplePerDimension to control the amount of data
		var aProperties = oStepPropertyMetadataHandler.getProperties();
		var aDimensions = oStepPropertyMetadataHandler.getDimensions();
		var aMeasures = oStepPropertyMetadataHandler.getMeasures();
		var sChartType = oRepresentation.getRepresentationType();
		var len = sChartType !== oTableRepresentation ? Math.pow(nSamplesPerDimension, aDimensions.length) : 7;
		for(i = 0; i < len; i++) {
			var oRow = {};
			if (sChartType === oTableRepresentation) {
				aProperties.forEach(function(sProperty) {
					var sPropertyValue = sProperty + " - " + Math.round(Math.random() * 500);
					oRow[sProperty] = sPropertyValue;
				});
			} else {
				aDimensions.forEach(function(sDimension, nIndex) {
					var sDimensionValue = sDimension + " - " + (Math.floor(i / Math.pow(nSamplesPerDimension, nIndex)) % nSamplesPerDimension + 1);
					oRow[sDimension] = sDimensionValue;
				});
				aMeasures.forEach(function(sMeasure) {
					var sMeasureValue = Math.round(Math.random() * 500);
					oRow[sMeasure] = sMeasureValue;
				});
			}
			aSampleData.push(oRow);
		}
		aSort = oRepresentation.getOrderbySpecifications();
		if (aSort && aSort.length) {
			aSampleData = _sortData(aSampleData, aSort);
		}
		return aSampleData;
	}
	//Prepares the representationInstance from the constructor and host it on 'oRepresentationInstance'. Invokes 'setData' on the instance by passing sample data and dummy meta data.
	function _prepareRepresentationInstance() {
		var sRepresentationConstructor = oRepresentationTypeHandler.getConstructorOfRepresentationType(oRepresentation.getRepresentationType());
		jQuery.sap.require(sRepresentationConstructor);
		var oRepresentationConstructor = sap.apf.utils.extractFunctionFromModulePathString(sRepresentationConstructor);
		function _getText(sText) {
			return sText;
		}
		function oEmptyStub() {
		}
		var oApiStub = {
			getTextNotHtmlEncoded : _getText,
			getTextHtmlEncoded : _getText,
			getEventCallback : oEmptyStub,
			createFilter : function() {
				return {
					getOperators : function() {
						return {
							EQ : true
						};
					},
					getTopAnd : function() {
						return {
							addOr : oEmptyStub
						};
					},
					getInternalFilter : function() {
						return {
							getProperties : function() {
								return [];
							}
						};
					}
				};
			},
			createMessageObject : oEmptyStub,
			putMessage : oEmptyStub,
			updatePath : oEmptyStub,
			selectionChanged : oEmptyStub,
			getActiveStep : function() {
				return {
					getSelectedRepresentation : function() {
						return {
							bIsAlternateView : true
						};
					}
				};
			}
		};
		var oPropertyRows = {
			dimensions : _getPropertyDataset("dimensions"),
			measures : _getPropertyDataset("measures"),
			properties : _getPropertyDataset("properties")
		};
		oRepresentationInstance = new oRepresentationConstructor(oApiStub, oPropertyRows);
		var oMetadataStub = {
			getPropertyMetadata : function() {
				return {
					label : undefined
				};
			}
		};
		oRepresentationInstance.setData(_generateSampleData(), oMetadataStub);
	}
	function _setDisplayText(oController) {
		var oPreviewContentDialog = oController.byId("idPreviewContentDialog");
		oPreviewContentDialog.setTitle(oTextReader("preview"));
		oPreviewContentDialog.getEndButton().setText(oTextReader("close"));
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.previewContent", {
		onInit : function() {
			var oController = this;
			var oPreviewContentDialog = oController.byId("idPreviewContentDialog");
			oRepresentation = oController.getView().getViewData().oRepresentation;
			oParentStep = oController.getView().getViewData().oParentStep;
			oConfigurationHandler = oController.getView().getViewData().oConfigurationHandler;
			oTextReader = oController.getView().getViewData().oCoreApi.getText;
			oRepresentationHandler = oController.getView().getViewData().oRepresentationHandler;
			oStepPropertyMetadataHandler = oController.getView().getViewData().oStepPropertyMetadataHandler;
			oRepresentationTypeHandler = oController.getView().getViewData().oRepresentationTypeHandler;
			_setDisplayText(oController);
			_prepareRepresentationInstance();
			_drawContent(oController);
			oPreviewContentDialog.open();
		},
		handleCloseButtonOfDialog : function() {
			var oController = this;
			oController.byId("idPreviewContentDialog").destroy();
			oController.getView().destroy();
		}
	});
}());
