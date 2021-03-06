/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
/* global window, clearTimeout, setTimeout */
/**
*@class stepContainer
*@name  stepContainer
*@memberOf sap.apf.ui.reuse.controller
*@description controller of view.stepContainer
*/
(function() {
	"use strict";
	var oCoreApi, oUiApi, oActiveStep, bIsZoom = false;
	function _getCurrentRepresentation() {
		var representationInstance = oActiveStep.getSelectedRepresentation();
		if (_isToggleInstance()) {
			representationInstance = oActiveStep.getSelectedRepresentation().toggleInstance;
		}
		return representationInstance;
	}
	function _isTableRepresentation() {
		var oRepresentation = oActiveStep.getSelectedRepresentation();
		if (oRepresentation.type === sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) {
			return true;
		}
		return false;
	}
	function _isToggleInstance() {
		if (oActiveStep.getSelectedRepresentation().bIsAlternateView === undefined || oActiveStep.getSelectedRepresentation().bIsAlternateView === false) {
			return false;
		}
		return true;
	}
	function _getRequiredFilter() {
		var oRepresentation = _getCurrentRepresentation();
		var aRequiredFilters = oRepresentation.getParameter().requiredFilters;
		if (aRequiredFilters === undefined || aRequiredFilters.length === 0) {
			return undefined;
		}
		return aRequiredFilters[0];
	}
	function _getPropertyMetadata(requiredFilterLabel) {
		if (!requiredFilterLabel) {
			return undefined;
		}
		var oRepresentation = _getCurrentRepresentation();
		var oMetaData = oRepresentation.getMetaData();
		if (!oMetaData) {
			return null;
		}
		var oPropertyMetaData = oMetaData.getPropertyMetadata(requiredFilterLabel);
		if (!oPropertyMetaData) {
			return null;
		}
		var sFilterLabel = oPropertyMetaData.label;
		return sFilterLabel !== undefined ? sFilterLabel : null;
	}
	function _setHeightAndWidth(oController, oChartContent) {
		var oChartContainer = oController.byId("idChartContainer");
		var containerHeight = "0";
		var containerWidth = jQuery(window).width();
		var chartContainerID = oChartContainer.getId();
		if (jQuery("#" + chartContainerID).length !== 0) {
			containerHeight = jQuery("#" + chartContainerID + " > div:first-child > div:nth-child(2)").offset().top;
			containerWidth = jQuery("#" + chartContainerID + " > div:first-child > div:nth-child(2)").width();
		}
		var cHeight = (jQuery(window).height() - containerHeight) - jQuery(".applicationFooter").height();
		var cWidth = containerWidth;
		oChartContent.setHeight(cHeight + "px");
		oChartContent.setWidth(cWidth + "px");
	}
	function _setChartContainerContent(oController) {
		var oChartContainer = oController.byId("idChartContainer");
		var oRepresentation = _getCurrentRepresentation();
		var oTitle = oActiveStep.longTitle && !oCoreApi.isInitialTextKey(oActiveStep.longTitle.key) ? oActiveStep.longTitle : oActiveStep.title;
		var oStepTitle = oCoreApi.getTextNotHtmlEncoded(oTitle);
		var oChartContent = oRepresentation.getMainContent(oStepTitle);
		var fnSetHeightAndWidth = {
			onBeforeRendering : function() {
				_setHeightAndWidth(oController, oChartContent);
			}
		};
		oChartContent.addEventDelegate(fnSetHeightAndWidth);
		oChartContainer.removeAllContent();
		var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
			content : oChartContent
		});
		oChartContainer.addContent(oChartContainerContent);
	}
	function _setSelectionPropertyCountText(oController, oChartContainerToolbar) {
		var oSelectedText = oController.byId("idSelectedText");
		var selectionCount = _getSelectionCount();
		var selectedDimension = _getRequiredFilter() !== undefined ? _getPropertyMetadata(_getRequiredFilter()) : null;
		var selectedText = selectedDimension + " (" + selectionCount + ") ";
		var oSelectionContainer = oController.byId("idSelPropertyAndCount");
		if (!oSelectionContainer) {
			oSelectionContainer = new sap.m.Link({
				id : oController.createId("idSelPropertyAndCount"),
				press : oController.handlePressSelectedPropertyCountLink.bind(oController)
			});
			oSelectionContainer.addAriaLabelledBy(oSelectedText.getId());
		}
		oSelectionContainer.setVisible(true);
		oSelectionContainer.setText(selectedText);
		oChartContainerToolbar.addContent(oSelectionContainer);
		oChartContainerToolbar.onAfterRendering = function() {
			var oControl = this;
			if (oControl.getContent().length >= 5) {
				oControl.getContent()[4].focus(); //Focus the selection count link
			}
		};
	}
	function _setCustomIconContent(oController) {
		var oChartContainer = oController.byId("idChartContainer");
		oChartContainer.removeAllCustomIcons();
		_setChartIcon(oController);
		_setAlternateRepIcon(oController);
		_setViewSettingsIcon(oController);
	}
	function _setChartIcon(oController) {
		var oChartContainer = oController.byId("idChartContainer");
		var representationInfo = oActiveStep.getSelectedRepresentationInfo();
		var sortDescription;
		if (representationInfo.parameter && representationInfo.parameter.orderby) {
			sortDescription = new sap.apf.ui.utils.Helper(oCoreApi).getRepresentationSortInfo(representationInfo);
		}
		var toolTipText = oCoreApi.getTextNotHtmlEncoded(representationInfo.label) + "\n" + ((sortDescription !== undefined) ? oCoreApi.getTextNotHtmlEncoded("sortBy") + ": " + sortDescription : "");
		var selectedRepresentationIcon = new sap.ui.core.Icon({
			src : representationInfo.picture,
			tooltip : toolTipText,
			press : function(oEvent) {
				oController.handlePressChartIcon(oEvent);
			}
		});
		oChartContainer.addCustomIcon(selectedRepresentationIcon);
	}
	function _setAlternateRepIcon(oController) {
		if (_isTableRepresentation()) {
			return;
		}
		var oChartContainer = oController.byId("idChartContainer");
		var toolTipText = oCoreApi.getTextNotHtmlEncoded("listView");
		var alternateTableIcon = new sap.ui.core.Icon({
			src : "sap-icon://table-view",
			tooltip : toolTipText,
			press : oController.handlePressAlternateRepIcon.bind(oController)
		});
		oChartContainer.addCustomIcon(alternateTableIcon);
	}
	function _setViewSettingsIcon(oController) {
		if ((_getCurrentRepresentation().topN !== undefined) || (!_isToggleInstance() && !_isTableRepresentation())) {
			return;
		}
		var oChartContainer = oController.byId("idChartContainer");
		var toolTipText = oCoreApi.getTextNotHtmlEncoded("view-Settings-Button");
		var oViewSettingDialog = _getCurrentRepresentation().createViewSettingDialog(); //dialog is created once and opened on press of view setting icon
		var sortButton = new sap.ui.core.Icon({
			src : "sap-icon://drop-down-list",
			tooltip : toolTipText,
			press : function() {
				oViewSettingDialog.open();
			}
		});
		oChartContainer.addCustomIcon(sortButton);
	}
	function _setSelectedText(oController, oChartContainerToolbar) {
		var oSelectedText = oController.byId("idSelectedText");
		if (!oSelectedText) {
			oSelectedText = new sap.m.Label({
				id : oController.createId("idSelectedText"),
				text : oCoreApi.getTextNotHtmlEncoded("selectedValue")
			});
		}
		oSelectedText.setVisible(true);
		oChartContainerToolbar.addContent(oSelectedText);
	}
	function _setResetLink(oController, oChartContainerToolbar) {
		var oResetLink = oController.byId("idReset");
		if (!oResetLink) {
			oResetLink = new sap.m.Button({
				text : oCoreApi.getTextNotHtmlEncoded("reset"),
				id : oController.createId("idReset"),
				type : "Transparent",
				press : oController.handlePressResetButton.bind(oController)
			});
		}
		oResetLink.setVisible(true);
		oChartContainerToolbar.addContent(oResetLink);
	}
	function _setSelectionsAndTexts(oController, oChartContainerToolbar) {
		var selectionCount = _getSelectionCount();
		if (selectionCount > 0 && _getRequiredFilter() !== undefined) {
			_setSelectedText(oController, oChartContainerToolbar);
			_setSelectionPropertyCountText(oController, oChartContainerToolbar);
			_setResetLink(oController, oChartContainerToolbar);
		}
	}
	function _setChartToolbarContent(oController) {
		var oChartContainer = oController.byId("idChartContainer");
		var oChartContainerToolbar = oChartContainer.getToolbar();
		if (oChartContainerToolbar) {
			oChartContainerToolbar.removeAllContent();
		} else {
			oChartContainerToolbar = new sap.m.OverflowToolbar();
		}
		// add text to the left
		var oCurrentStepLabel = new sap.m.Label({
			text : oCoreApi.getTextNotHtmlEncoded("currentStep")
		});
		oChartContainerToolbar.addContent(oCurrentStepLabel);
		// add spacing
		var oSpacer = new sap.m.ToolbarSpacer();
		oChartContainerToolbar.addContent(oSpacer);
		// add selections and texts
		_setSelectionsAndTexts(oController, oChartContainerToolbar);
		oChartContainerToolbar.addContent(new sap.suite.ui.commons.ChartContainerToolbarPlaceholder());
		oChartContainer.setToolbar(oChartContainerToolbar);
	}
	function _drawChartContainer(oController) {
		if (oActiveStep === undefined) {
			return;
		}
		_setChartContainerContent(oController);
		_setCustomIconContent(oController);
		_setChartToolbarContent(oController);
	}
	function _getSelectionCount() {
		var selectedRepresentation = _getCurrentRepresentation();
		var selectionCount = selectedRepresentation.getSelections().length;
		return selectionCount;
	}
	function _drawPopOverContent(oController, oControlreference) {
		var oAllChartList = new sap.m.List({
			mode : sap.m.ListMode.SingleSelectMaster,
			showSeparators : sap.m.ListSeparators.None,
			includeItemInSelection : true,
			selectionChange : oController.handleSelectionChartSwitchIcon.bind(oController)
		});
		var sortDescription;
		var oRepresentation;
		for( var j = 0; j < oActiveStep.representationtypes.length; j++) {
			oRepresentation = oActiveStep.representationtypes[j];
			sortDescription = undefined;
			if (oRepresentation.parameter && oRepresentation.parameter.orderby) { //if orderby has a value then only get the sort description
				sortDescription = new sap.apf.ui.utils.Helper(oCoreApi).getRepresentationSortInfo(oRepresentation);
			}
			var sDescriptionText = sortDescription !== undefined ? oCoreApi.getTextNotHtmlEncoded("sortBy") + ": " + sortDescription : "";
			var oItem = new sap.m.StandardListItem({
				description : sDescriptionText,
				icon : oRepresentation.picture,
				title : oCoreApi.getTextNotHtmlEncoded(oRepresentation.label),
				customData : [ new sap.ui.core.CustomData({
					key : 'data',
					value : {
						oRepresentationType : oRepresentation,
						icon : oRepresentation.picture
					}
				}) ]
			});
			oAllChartList.addItem(oItem);
		}
		if (!oController.byId("idAllChartPopover")) {
			var oShowAllChartPopover = new sap.m.Popover({
				id : oController.createId("idAllChartPopover"),
				placement : sap.m.PlacementType.Bottom,
				showHeader : false,
				content : [ oAllChartList ],
				afterClose : function() {
					oShowAllChartPopover.destroy();
				}
			});
		}
		oController.byId("idAllChartPopover").openBy(oControlreference);
	}
	function _setVisibleOfPropertyCountText(oController, bIsVisible) {
		oController.byId("idReset").setVisible(bIsVisible);
		oController.byId("idSelPropertyAndCount").setVisible(bIsVisible);
		oController.byId("idSelectedText").setVisible(bIsVisible);
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.stepContainer", {
		/**
		*@this {sap.apf.ui.reuse.controller.stepContainer}
		*/
		onInit : function() {
			var oController = this;
			oCoreApi = oController.getView().getViewData().oCoreApi;
			oUiApi = oController.getView().getViewData().uiApi;
			oActiveStep = oCoreApi.getActiveStep();
		},
		onAfterRendering : function() {
			var oController = this;
			jQuery(window).resize(function() {
				var offesetHeightForFilter = 90;// height of footer and facet filter needs to be adjusted in page size
				if (oCoreApi.getSmartFilterBarConfiguration()) {
					offesetHeightForFilter = 165; // height of footer and smart filter bar needs to be adjusted in page size
				}
				var windowHeight = jQuery(window).height() - offesetHeightForFilter;
				jQuery('.layoutView').css({
					"height" : windowHeight
				});
				oController.drawStepContent();
			});
		},
		handlePressSelectedPropertyCountLink : function() {
			var oController = this;
			oController.oCoreApi = oCoreApi;
			var selectionDisplayDialog = new sap.ui.jsfragment("idSelectionDisplayFragment", "sap.apf.ui.reuse.fragment.selectionDisplay", oController);
			selectionDisplayDialog.open();
		},
		handlePressResetButton : function() {
			var oController = this;
			if (_isToggleInstance()) {
				_getCurrentRepresentation().removeAllSelection();
			}
			_getCurrentRepresentation().removeAllSelection();
			_setVisibleOfPropertyCountText(oController, false);
		},
		createToggleRepresentationInstance : function() {
			oActiveStep = oCoreApi.getActiveStep();
			var oRepresentation = oActiveStep.getSelectedRepresentation();
			var toggleInstance = {};
			function addAdditionalFields(param) {
				var dimensions = param.dimensions;
				var metadata = oRepresentation.getMetaData();
				if (metadata === undefined) {
					return param;
				}
				var i;
				for(i = 0; i < dimensions.length; i++) {
					var bSapTextExists = metadata.getPropertyMetadata(dimensions[i].fieldName).hasOwnProperty('text');
					if (bSapTextExists) {
						var newField = {};
						newField.fieldName = metadata.getPropertyMetadata(dimensions[i].fieldName).text;
						param.dimensions.push(newField);
					}
				}
				param.isAlternateRepresentation = true;
				return param;
			}
			var parameter = jQuery.extend(true, {}, oRepresentation.getParameter());
			delete parameter.alternateRepresentationTypeId;
			delete parameter.alternateRepresentationType;
			parameter = addAdditionalFields(parameter);
			// Using the APF Core method to create alternate representation instance
			toggleInstance = oCoreApi.createRepresentation(oRepresentation.getParameter().alternateRepresentationType.constructor, parameter);
			var data = oRepresentation.getData(), metadata = oRepresentation.getMetaData();
			if (data !== undefined && metadata !== undefined) {
				toggleInstance.setData(data, metadata);
			}
			return toggleInstance;
		},
		handlePressAlternateRepIcon : function() {
			var oController = this;
			var currentRepresentation = oActiveStep.getSelectedRepresentation();
			var activeStepIndex = oCoreApi.getSteps().indexOf(oActiveStep);
			currentRepresentation.bIsAlternateView = true;
			if (_isToggleInstance()) {
				currentRepresentation.toggleInstance = oController.createToggleRepresentationInstance();
			}
			currentRepresentation.toggleInstance.adoptSelection(currentRepresentation);
			bIsZoom = false;
			oController.drawStepContent();
			oUiApi.getAnalysisPath().getCarousel().getStepView(activeStepIndex).getController().drawThumbnailContent(true);
		},
		handlePressChartIcon : function(oEvent) {
			var oController = this;
			var currentRepresentation = oActiveStep.getSelectedRepresentation();
			var activeStepIndex = oCoreApi.getSteps().indexOf(oActiveStep);
			oActiveStep.representationtypes = oActiveStep.getRepresentationInfo();
			if (oActiveStep.representationtypes.length > 1) {
				var oControlreference = oEvent.getParameter("controlReference");
				_drawPopOverContent(oController, oControlreference);
			} else {
				currentRepresentation.bIsAlternateView = false;
				oUiApi.getAnalysisPath().getCarousel().getStepView(activeStepIndex).getController().drawThumbnailContent(true);
				oController.drawStepContent();
			}
		},
		handleSelectionChartSwitchIcon : function(oEvent) {
			var oController = this;
			oController.byId("idAllChartPopover").close();
			var oSelectedItem = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			var activeStepIndex = oCoreApi.getSteps().indexOf(oActiveStep);
			var previousSelectedRepresentation = oActiveStep.getSelectedRepresentationInfo().representationId;
			var currentSelectedRepresentation = oSelectedItem.oRepresentationType.representationId;
			if (previousSelectedRepresentation === currentSelectedRepresentation && oActiveStep.getSelectedRepresentation().bIsAlternateView === false) {
				return;
			}
			bIsZoom = false;
			oActiveStep.getSelectedRepresentation().bIsAlternateView = false;
			oActiveStep.setSelectedRepresentation(oSelectedItem.oRepresentationType.representationId);
			oUiApi.getAnalysisPath().getController().refresh(oSelectedItem.nActiveStepIndex);
			oCoreApi.updatePath(oUiApi.getAnalysisPath().getController().callBackForUpdatePath.bind(oUiApi.getAnalysisPath().getController()));
			oUiApi.getAnalysisPath().getCarousel().getStepView(activeStepIndex).getController().drawThumbnailContent(true);
		},
		handleZoomInPress : function() {
			bIsZoom = true;
		},
		handleZoomOutPress : function() {
			bIsZoom = true;
		},
		drawStepContent : function() {
			var oController = this, bIsActiveStepChanged = false;
			var oPreviousActiveStep = oActiveStep;
			oActiveStep = oCoreApi.getActiveStep();
			if (oPreviousActiveStep !== oActiveStep) {
				bIsActiveStepChanged = true;
			}
			var nActiveStepIndex = oCoreApi.getSteps().indexOf(oActiveStep);
			var oStep = oUiApi.getAnalysisPath().getCarousel().getStepView(nActiveStepIndex);
			if (oStep === undefined) {
				return;
			}
			var bThumbnailRefreshing = oStep.oThumbnailChartLayout.isBusy();
			if (bThumbnailRefreshing) {
				oController.byId("idStepLayout").setBusy(true);
			}
			if (!bIsZoom || bIsActiveStepChanged) {
				_drawChartContainer(oController);
			} else {
				_setChartToolbarContent(oController);
			}
			oController.byId("idStepLayout").setBusy(false);
		}
	});
}());