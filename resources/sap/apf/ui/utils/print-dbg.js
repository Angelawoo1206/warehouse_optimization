/*
 * ! SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/* global window */
jQuery.sap.declare("sap.apf.ui.utils.print");
jQuery.sap.require("sap.apf.ui.utils.formatter");
jQuery.sap.require("sap.viz.ui5.types.legend.Common");
/**
 * @class PrintHelper
 * @memberOf sap.apf.ui.utils
 * @description has functions to perform printing of Analysis Path
 */
sap.apf.ui.utils.PrintHelper = function(oInject) {
	"use strict";
	var oCoreApi = oInject.oCoreApi;
	var oUiApi = oInject.uiApi;
	var aAllSteps = null;
	var oFilterIdHandler = oInject.oFilterIdHandler;
	var nStepRenderCount, oChartSelectionPromise, nNoOfSteps;
	this.oPrintLayout = {};
	/**
	 * @method _increaseStepRenderCount increases the step render count as and when each step is rendered
	 */
	function _increaseStepRenderCount() {
		++nStepRenderCount;
		if (nNoOfSteps === nStepRenderCount) {
			oChartSelectionPromise.resolve();
		}
	}
	/**
	 * @method _createDivForPrint removes the existing div apfPrintArea. Later creates the div apfPrintArea
	 */
	function _createDivForPrint(oContext) {
		if (!jQuery.isEmptyObject(oContext.oPrintLayout)) {
			oContext.oPrintLayout.removeContent();
		}
		jQuery('#apfPrintArea').remove(); // removing the div which holds the printable content
		jQuery("body").append('<div id="printbuttondiv"></div><div id="apfPrintArea"></div>'); // div which holds the printable content
		oUiApi.createApplicationLayout(false).setBusy(true);// sets the Local Busy Indicator for the print
	}
	/**
	 * @method _getHeaderForFirstPage creates a header for the first page of print
	 * @returns header for first page of print
	 */
	function _getHeaderForFirstPage() {
		var date = new Date();
		var sAppName = oCoreApi.getApplicationConfigProperties().appName;
		var sAnalysisPathTitle = oUiApi.getAnalysisPath().oSavedPathName.getTitle();
		var headerForFirstPage = new sap.ui.core.HTML({
			id : 'idAPFHeaderForFirstPage',
			content : [ '<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> ' + oCoreApi.getTextHtmlEncoded(sAppName) + ' : ' + jQuery.sap.encodeHTML(sAnalysisPathTitle) + '</p>',
					'<p class="printHeaderDate"> ' + date.toTimeString() + ' </p></div><div class="clear"></div>' ].join(""),
			sanitizeContent : true
		});
		return headerForFirstPage;
	}
	/**
	 * @method _getPrintLayoutForFacetFiltersAndFooters creates a layout for facet filter and footers page
	 * @description Gets application specific filters and formats them for printing. Gets facet filter values for printing.
	 * @returns print layout for facet filters and footers
	 */
	function _getPrintLayoutForFacetFiltersAndFooters() {
		var i, j, nIndex, oFacetFilterLists, oAppSpecificFilter, aFiltersForPrining, filterObj, oFormatter, oFacetFilter, aSelectedItems;
		var aAppSpecificFilterExp = [], aAppSpecificFilters = [], sFilterName = "", aSelectedFilters = [], filterValues = [], aAppSpecificFormattedFilters = [], aFacetFilters = [], oFilterValue = {};
		// First : Get application specific filter values
		var callback = oUiApi.getEventCallback(sap.apf.core.constants.eventTypes.printTriggered);
		var callbackContext = {
			getTextNotHtmlEncoded : oCoreApi.getTextNotHtmlEncoded
		};
		var aAllAppSpecificFilterIds = oFilterIdHandler.getAllInternalIds(); // get application specific filters
		// Get the filter expression for the application specific filters(footers)
		if (aAllAppSpecificFilterIds.length > 0) {
			for(i = 0; i < aAllAppSpecificFilterIds.length; i++) {
				oAppSpecificFilter = oFilterIdHandler.get(aAllAppSpecificFilterIds[i]).getExpressions();
				aAppSpecificFilterExp.push(oAppSpecificFilter[0]);
			}
		}
		// Returns formatted filter values from APF for application specific filters
		function getAppSpecificFormattedFilters() {
			function prepareFormattedFilterValues(oPropertyMetadata) {
				sFilterName = "";
				filterValues = [];
				oFormatter = new sap.apf.ui.utils.formatter({
					getEventCallback : oUiApi.getEventCallback.bind(oUiApi),
					getTextNotHtmlEncoded : oCoreApi.getTextNotHtmlEncoded
				}, oPropertyMetadata);
				sFilterName = oPropertyMetadata.label;
				filterValues.push(oFormatter.getFormattedValue(oPropertyMetadata.name, aAppSpecificFilterExp[i][j].value));
			}
			for(i = 0; i < aAppSpecificFilterExp.length; i++) {
				for(j = 0; j < aAppSpecificFilterExp[i].length; j++) {
					filterObj = aAppSpecificFilterExp[i][j];
					oCoreApi.getMetadataFacade().getProperty(aAppSpecificFilterExp[i][j].name, prepareFormattedFilterValues);
					filterObj["sName"] = sFilterName;
					filterObj["value"] = filterValues;
					aAppSpecificFilters.push(filterObj);
				}
			}
			return aAppSpecificFilters;
		}
		if (callback !== undefined) { // If application has a print functionality on its own use it otherwise get formatted filter values for application specific filters from APF
			aAppSpecificFormattedFilters = callback.apply(callbackContext, aAppSpecificFilterExp) || [];
			aAppSpecificFormattedFilters = (aAppSpecificFormattedFilters.length > 0) ? aAppSpecificFormattedFilters : getAppSpecificFormattedFilters();
		} else { // APF default formatting
			aAppSpecificFormattedFilters = getAppSpecificFormattedFilters();
		}
		// Second : Get all the configured facet filters from APF
		oFacetFilter = oUiApi.getFacetFilterForPrint();
		// calling api for fething smart filters
		function getTextsFromSelectedItems(aSelectedItems) {
			aSelectedFilters = [];
			aSelectedItems.forEach(function(oItem) {
				aSelectedFilters.push(oItem.getText());
			});
		}
		if (oFacetFilter) {// If there is a facet filter
			oFacetFilterLists = oFacetFilter.getLists();
			for(nIndex = 0; nIndex < oFacetFilterLists.length; nIndex++) {
				aSelectedItems = [];
				oFilterValue = {};
				oFilterValue.sName = oFacetFilterLists[nIndex].getTitle();
				if (!oFacetFilterLists[nIndex].getSelectedItems().length) {
					aSelectedItems = oFacetFilterLists[nIndex].getItems();
				} else {
					aSelectedItems = oFacetFilterLists[nIndex].getSelectedItems();
				}
				getTextsFromSelectedItems(aSelectedItems);
				oFilterValue.value = aSelectedFilters;
				aFacetFilters.push(oFilterValue);
			}
		}
		// Later : Merge the APF filters and application specific filters for printing; Application specific filters if available are printed first
		aFiltersForPrining = aAppSpecificFormattedFilters.length > 0 ? aAppSpecificFormattedFilters.concat(aFacetFilters) : aFacetFilters;
		return _getViewLayoutForFilters(aFiltersForPrining);
	}
	/**
	 * @method _getSmartFiltersFromUiApi
	 * @param none
	 * @returns the array of obejct for smart filters
	 */
	function _getSmartFiltersFromUiApi() {
		var oSmartFilter = oUiApi.getSmartFilterForPrint();
		if (oSmartFilter !== undefined && oSmartFilter !== null) {
			var oSmartFilterData = JSON.parse(oSmartFilter.getFilterDataAsString());
			var oOutputSmartArrayFormat = {};
			var filterName;
			for(filterName in oSmartFilterData) {
				var tokenText = '';
				var localArraryForRanges = oSmartFilterData[filterName]['ranges'];
				for( var valueCount = 0; valueCount < localArraryForRanges.length; valueCount++) {
					tokenText += localArraryForRanges[valueCount]['tokenText'];
				}
				oOutputSmartArrayFormat[filterName] = tokenText;
			}
		}
		return oOutputSmartArrayFormat;
	}
	/**
	 * @method _getViewLayoutForFilters
	 * @param array
	 *            of facet filters for printing
	 * @returns layout for printing filters either smart or facet
	 */
	function _getViewLayoutForFilters(aFiltersForPrining) {
		var mFilterName, mFilterValue;
		var sFilterName = "";
		var sFilterValue = "";
		var oFacetAndFooterLayout = new sap.ui.layout.VerticalLayout({
			id : 'idAPFFacetAndFooterLayout'
		});
		// Formatting the filter array
		for( var i = 0; i < aFiltersForPrining.length; i++) {
			sFilterName = aFiltersForPrining[i].sName;
			for( var j = 0; j < aFiltersForPrining[i].value.length; j++) {
				if (j !== aFiltersForPrining[i].value.length - 1) {
					sFilterValue += aFiltersForPrining[i].value[j] + ", ";
				} else {
					sFilterValue += aFiltersForPrining[i].value[j];
				}
			}
			mFilterName = new sap.m.Text({
				text : sFilterName
			}).addStyleClass("printFilterName");
			mFilterValue = new sap.m.Text({
				text : sFilterValue
			}).addStyleClass("printFilterValue");
			// Facet UI Layout
			oFacetAndFooterLayout.addContent(mFilterName);
			oFacetAndFooterLayout.addContent(mFilterValue);
			// Reset the filter value
			sFilterValue = "";
		}
		// appending text for smart filter
		var oOutputSmartArrayFormat = _getSmartFiltersFromUiApi();
		if (oOutputSmartArrayFormat != undefined && oOutputSmartArrayFormat != null) {
			for( var filterKey in oOutputSmartArrayFormat) {
				mFilterName = new sap.m.Text({
					text : filterKey
				}).addStyleClass("printFilterName");
				mFilterValue = new sap.m.Text({
					text : oOutputSmartArrayFormat[filterKey]
				}).addStyleClass("printFilterValue");
				// Facet UI Layout
				oFacetAndFooterLayout.addContent(mFilterName);
				oFacetAndFooterLayout.addContent(mFilterValue);
			}
		}
		return oFacetAndFooterLayout;
	}
	/**
	 * @method _getHeaderForEachStep creates a header for each step page
	 * @returns header for step page
	 */
	function _getHeaderForEachStep(nIndex, nStepsLength) {
		var oMessageObject;
		var date = new Date();
		var sAppName = oCoreApi.getApplicationConfigProperties().appName;
		var sAnalysisPathTitle = oUiApi.getAnalysisPath().oSavedPathName.getTitle();
		if (!sAppName) {
			oMessageObject = oCoreApi.createMessageObject({
				code : "6003",
				aParameters : [ "sAppName" ]
			});
			oCoreApi.putMessage(oMessageObject);
		}
		var headerForEachStep = new sap.ui.core.HTML({
			id : 'idAPFHeaderForEachStep' + nIndex,
			content : [ '<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> ' + oCoreApi.getTextHtmlEncoded(sAppName) + ' : ' + jQuery.sap.encodeHTML(sAnalysisPathTitle) + '</p>',
					'<p class="printHeaderDate"> ' + date.toTimeString() + ' </p></div><div class="clear"></div>', '<br /><div class="printChipName"><p>' + oCoreApi.getTextHtmlEncoded("print-step-number", [ nIndex, nStepsLength ]) + '</p></div>' ]
					.join(""),
			sanitizeContent : true
		});
		return headerForEachStep;
	}
	/**
	 * @method _getRepresentationForPrint
	 * @param oStep
	 *            is used to get the step information
	 * @returns the representation for printing
	 */
	function _getRepresentationForPrint(oStep) {
		var data, metadata, oPrintContent, bIsLegendVisible = false, oRepresentation = {};
		var oStepTitle = oCoreApi.getTextNotHtmlEncoded(oStep.title);
		var oSelectedRepresentation = oStep.getSelectedRepresentation();
		var oStepRepresentation = oSelectedRepresentation.bIsAlternateView ? oSelectedRepresentation.toggleInstance : oSelectedRepresentation;
		// If alternate view(table representation)
		if (oSelectedRepresentation.bIsAlternateView) {
			data = oStep.getSelectedRepresentation().getData();
			metadata = oStep.getSelectedRepresentation().getMetaData();
			oStepRepresentation.setData(data, metadata);
		}
		if (oStepRepresentation.type === sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) {
			oPrintContent = oStepRepresentation.getPrintContent(oStepTitle);
			oRepresentation = oPrintContent.oTableForPrint.getContent()[0];
			var aSelectedItems = oPrintContent.aSelectedListItems;
			aSelectedItems.forEach(function(item) {
				oRepresentation.addSelectionInterval(item, item);
			});
			_increaseStepRenderCount();
			oRepresentation.setWidth("1000px");
		} else {// If not a table representation
			oPrintContent = oStepRepresentation.getPrintContent(oStepTitle);
			oRepresentation = oPrintContent.oChartForPrinting;
			// If the chart is vizFrame make selections after rendering of chart and update the step render count
			if (oRepresentation.vizSelection) {
				oRepresentation.attachRenderComplete(function() {
					oRepresentation.vizSelection(oPrintContent.aSelectionOnChart);
					_increaseStepRenderCount();
				});
			} else {// If the chart is Viz make selections after initialization of chart and update the step render count
				oRepresentation.attachInitialized(function() {
					oRepresentation.selection(oPrintContent.aSelectionOnChart);
					_increaseStepRenderCount();
				});
			}
		}
		// Show/Hide Legend for print content
		if (oStepRepresentation.bIsLegendVisible === undefined || oStepRepresentation.bIsLegendVisible === true) {
			bIsLegendVisible = true;
		}
		if (oRepresentation.setVizProperties) { // Check if it is Viz Frame Charts
			oRepresentation.setVizProperties({
				legend : {
					visible : bIsLegendVisible
				},
				sizeLegend : {
					visible : bIsLegendVisible
				}
			});
		} else {// fall back for viz charts
			if (oRepresentation.setLegend !== undefined) {
				oRepresentation.setLegend(new sap.viz.ui5.types.legend.Common({
					visible : bIsLegendVisible
				}));
			}
			if (oRepresentation.setSizeLegend !== undefined) {
				oRepresentation.setSizeLegend(new sap.viz.ui5.types.legend.Common({
					visible : bIsLegendVisible
				}));
			}
		}
		return oRepresentation;
	}
	/**
	 * @method _getPrintLayoutForEachStep defines layout used by each step when being printed
	 * @usage _getPrintLayoutForEachStep has to be used to get the layout for individual steps in analysis path.
	 * @param oStep
	 *            is used to get the step information
	 * @param nIndex
	 *            is index of the step being printed
	 * @param nStepsLength
	 *            is the total number of steps in an Analysis Path
	 * @returns the printLayout for a step in an Analysis Path.
	 */
	function _getPrintLayoutForEachStep(oStep, nIndex, nStepsLength) {
		var oChartLayout = new sap.ui.layout.VerticalLayout({
			id : 'idAPFChartLayout' + nIndex
		});
		oChartLayout.addContent(_getRepresentationForPrint(oStep));
		var oStepLayout = new sap.ui.layout.VerticalLayout({
			id : 'idAPFStepLayout' + nIndex,
			content : [ _getHeaderForEachStep(nIndex, nStepsLength), oChartLayout ]
		}).addStyleClass("representationContent"); // @comment : apfoPrintLayout class not provided in css
		return oStepLayout;
	}
	/**
	 * @method Print used to print all the steps in Analysis Path.
	 * @usage PrintHelper().doPrint has to be used for printing Analysis Path
	 */
	this.doPrint = function() {
		var j, nIndex, oPrintFirstPageLayout;
		var pTimer = 2000, self = this;
		nStepRenderCount = 0;
		aAllSteps = oCoreApi.getSteps();
		nNoOfSteps = aAllSteps.length;
		this.oPrintLayout = new sap.ui.layout.VerticalLayout({
			id : "idAPFPrintLayout"
		});
		_createDivForPrint(this);
		oChartSelectionPromise = jQuery.Deferred();
		if (nNoOfSteps === 0) {
			oChartSelectionPromise.resolve();
		}
		// Facet Filter and footers are printed in the initial page along with the header
		oPrintFirstPageLayout = new sap.ui.layout.VerticalLayout({
			id : 'idAPFPrintFirstPageLayout',
			content : [ _getHeaderForFirstPage(), _getPrintLayoutForFacetFiltersAndFooters() ]
		}).addStyleClass("representationContent");
		this.oPrintLayout.addContent(oPrintFirstPageLayout);
		// Consecutive pages with one step each is printed
		for(j = 0; j < aAllSteps.length; j++) {
			nIndex = parseInt(j, 10) + 1;
			this.oPrintLayout.addContent(_getPrintLayoutForEachStep(aAllSteps[j], nIndex, aAllSteps.length));
		}
		this.oPrintLayout.placeAt("apfPrintArea");
		if (jQuery(".v-geo-container").length) {// set the timer if geomap exists
			pTimer = 4000;
		}
		// adding print button ipad
		var printButton = new sap.m.Button({
			text : oCoreApi.getTextNotHtmlEncoded("print")
		});
		var buttonLayout = new sap.ui.layout.VerticalLayout({
			id : "printButtonLayout"
		});
		buttonLayout.insertContent(printButton);
		buttonLayout.placeAt("printbuttondiv");
		_printChainOfPromises(self.oPrintLayout, pTimer, buttonLayout);
	};
	function _printChainOfPromises(oPrintLayout, pTimer, buttonLayout) {
		// timeout for safari
		if (sap.ui.Device.browser.safari) {
			window.setTimeout(function() {
				oUiApi.createApplicationLayout(false).setBusy(false); // Removes the Local Busy Indicator after the print
			}, pTimer - 150);
			window.setTimeout(function() { // Set Timeout to load the content on to dom
				_prepareDomForPrinting(oPrintLayout);
				// Wait until all the have been rendered with selections and then print
				oChartSelectionPromise.then(function() {
					_processWindowPrint();
				});
				window.setTimeout(function() {
					_processPostPrintingTask(oPrintLayout, buttonLayout);
				}, 10);
			}, pTimer);
		} else {
			// condition for other browsers
			// creating code for promise and resolve
			(function() {
				var deferredObject = jQuery.Deferred();
				setTimeout(function() {
					_prepareDomForPrinting(oPrintLayout);
					deferredObject.resolve();
				}, pTimer);
				return deferredObject;
			})().then(function() {
				_processWindowPrint();
			}).then(function() {
				_processPostPrintingTask(oPrintLayout, buttonLayout);
			}).then(function() {
				oUiApi.createApplicationLayout(false).setBusy(false);
			});// second done ends
		}
	}
	function _processPostPrintingTask(oPrintLayout, buttonLayout) {
		buttonLayout.destroy();
		buttonLayout = null;
		var oSelectedRepresentation, oChart;
		for( var i = 0; i < jQuery("#apfPrintArea").siblings().length; i++) {
			jQuery("#apfPrintArea").siblings()[i].hidden = false;
		}
		jQuery('#printbuttondiv').remove();
		for( var stepNo = 0; stepNo < aAllSteps.length; stepNo++) {
			oSelectedRepresentation = aAllSteps[stepNo].getSelectedRepresentation();
			oSelectedRepresentation = oSelectedRepresentation.bIsAlternateView ? oSelectedRepresentation.toggleInstance : oSelectedRepresentation;
			// Check if the representation is not a table representation; if not destroy the chart instance
			if (oSelectedRepresentation.type !== sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) {
				// Access layout content to retrieve the chart; Destroy the chart to prevent memory leaks
				oChart = oPrintLayout.getContent()[stepNo + 1].getContent()[1].getContent()[0];
				oChart.destroy();
				oChart = null;
			}
		}
		oPrintLayout.destroy(); // Destroy the reference & remove from dom
		oPrintLayout = null;
		// deleting manually using jquery because deleting UI5 object was deleting objects internally
		jQuery("div[id^=idAPFStepLayout]").remove();
		jQuery("#apfPrintArea").remove();		
	}
	function _processWindowPrint() {
		jQuery(jQuery("#printbuttondiv").find('button')).attr('onclick', 'jQuery( "#printbuttondiv" ).remove();window.print();window.close();');
		var ifTablet = sap.ui.Device.system.tablet;
		var ifOsIos = sap.ui.Device.os.ios;
		if (ifTablet == true && ifOsIos == true) {
			var htmlCopy = jQuery("html").clone();
			var bodyDomObject = jQuery(htmlCopy).find('body');
			jQuery(bodyDomObject).children("div").each(function(index, element) {
				if (jQuery(element).attr('id') != 'apfPrintArea' && jQuery(element).attr('id') != 'printbuttondiv') {
					jQuery(element).remove();
				} else {
					jQuery(element).show();
				}
				if (jQuery(element).attr('id') == "#printbuttondiv") {
					jQuery(element).show();
				}
			});
			jQuery(jQuery(htmlCopy).find('body')).html(jQuery(bodyDomObject.html()));
			var tempWholePage = "<html>" + jQuery(htmlCopy).html() + "</html>";
			var myWindow = window.open("", "_blank", "width=300,height=300");
			myWindow.document.write(tempWholePage);
		} else {
			window.print();
		}
	}
	function _prepareDomForPrinting(oPrintLayout) {
		var colCount;
		jQuery("#" + oPrintLayout.sId + " > div:not(:last-child)").after("<div class='page-break'> </div>");
		var domContent = oPrintLayout.getDomRef(); // Get the DOM Reference
		var table = jQuery('#apfPrintArea .sapUiTable');
		if (table.length) {
			colCount = jQuery('#apfPrintArea .printTable .sapMListTblHeader .sapMListTblCell').length;
			if (colCount > 11) {
				jQuery("#setPrintMode").remove();
				jQuery("<style id='setPrintMode' > @media print and (min-resolution: 300dpi) { @page {size : landscape;}}</style>").appendTo("head");
			} else {
				jQuery("#setPrintMode").remove();
				jQuery("<style id='setPrintMode'>@media print and (min-resolution: 300dpi) { @page {size : portrait;}}</style>").appendTo("head");
			}
		}
		jQuery("#apfPrintArea").empty(); // Clear the apfPrintArea
		// jQuery("#sap-ui-static > div").hide(); // Hide popup
		jQuery("#apfPrintArea").append(jQuery(domContent).html()); // Push it to apfPrintArea
		_breakTheTableIntoMultipleTables();
		for( var i = 0; i < jQuery("#apfPrintArea").siblings().length; i++) {
			// alternate way of hiding the content and printing only the representations
			jQuery("#apfPrintArea").siblings()[i].hidden = true; // hiding the content apart from apfPrintArea div
		}
	}
	function _breakTheTableIntoMultipleTables() {
		// converting all the DIVs which has table to inline, in order to fix firefox problem
		// find all idAPFChartLayout with table , loop those many times
		// loop through rows and set the checkbox
		var chartLayoutArray = jQuery("div[id^=idAPFChartLayout]");
		var tableSelectionArray = [];
		var tableLabelArray = [];
		var validChartCount = 0;
		// retrive the table and respective checkboxes, create map of checkboxes
		for( var chartCount = 0; chartCount < chartLayoutArray.length; chartCount++) {
			// Here also there can be bug because it is not localized
			if (jQuery(chartLayoutArray[chartCount]).find('table').length > 0) {
				var localSelectionArray = [];
				jQuery(chartLayoutArray[chartCount]).find("div[id$=sapUiTableRowHdrScr]").find('div').each(function(index, element) {
					localSelectionArray[index] = jQuery(element).attr('aria-selected');
				});
				tableSelectionArray[validChartCount] = localSelectionArray;
				localSelectionArray = null;
				tableLabelArray[validChartCount] = jQuery(chartLayoutArray[chartCount]).find('label');
				validChartCount++;
			}
		}
		jQuery("#apfPrintArea").find("table").each(function(index, element) {
			jQuery(element).find('*').removeAttr('class');
			// find the parent of this table element and put it inside it after splitting
			var tableParent = jQuery(element).parent();
			jQuery(tableParent).empty();
			var thisTable = element;
			var rowCount = jQuery(element).find('tbody').find('tr').length;
			// logic for calculating gap between tables for page break
			var theBodyElement = jQuery(element).find('tbody');
			var allTheRows = jQuery(theBodyElement).find('tr');
			// clean the head from input box
			jQuery(element).find('thead').unwrap();
			jQuery(thisTable).empty();
			jQuery(thisTable).unwrap();
			var i = 0;
			var localTableHTML = '<table class="printtable"><thead><tr>';
			var insideLoopHTML = '';
			// create th for this table
			for( var thc = 0; thc < tableLabelArray[index].length; thc++) {
				if (tableSelectionArray[index][0] != undefined) {
					if (thc == 0) {
						localTableHTML += '<th></th>';
					} else {
						localTableHTML += '<th>' + jQuery(tableLabelArray[index][thc]).html() + '</th>';
					}
				} else {
					if (tableLabelArray[index][thc + 1]) {
						localTableHTML += '<th>' + jQuery(tableLabelArray[index][thc + 1]).html() + '</th>';
					}
				}
			}
			localTableHTML += '</tr></thead><tbody>';
			// creating empty head for rest of the tables
			var emptyHeadTableHtml = '<table class="printtable"><thead>';
			emptyHeadTableHtml += '</thead><tbody>';
			var localCount = 0;
			var numberOfColumns = jQuery((jQuery(element).find('tbody').find('tr'))[0]).find('td').length;
			var widthOfColumns = Math.ceil(95 / numberOfColumns) - 1;
			jQuery(jQuery(element).find('tbody').find('td')).css('width', widthOfColumns + '%');
			// find the table html, let it break and then run the loop to insert to insert that checkbox
			for(i = 0; i < Math.ceil(rowCount / 20); i++) {
				if (i == 0) {
					insideLoopHTML = localTableHTML;
				} else {
					insideLoopHTML = emptyHeadTableHtml;
				}
				jQuery(allTheRows).each(function(localindex, elem) {
					if (localindex >= i * 20 && localindex < (i + 1) * 20) {
						var selectChoiceChecked = '';
						if (tableSelectionArray[index][localindex] == "true") {
							selectChoiceChecked = 'checked';
						}
						if (tableSelectionArray[index][localindex] != undefined) {
							jQuery(jQuery(elem).children()[0]).append('<input type="checkbox" ' + selectChoiceChecked + ' />');
							jQuery(jQuery(elem).find('td')[0]).css('width', '5%');
						}
						insideLoopHTML += jQuery(elem).wrap('<p/>').parent().html();
						jQuery(elem).unwrap();
					}
					localCount++;
				});
				insideLoopHTML += '</tbody></table>';
				jQuery(tableParent).append(insideLoopHTML);
				insideLoopHTML = '';
			}// end of for loop
			// now let us delete all extra divs and put all the tables inside
		});
		// delete all the content of idAPFChartLayout and insert this table
		var validChartCountIndex = 0;
		for( var chartLayoutCount = 0; chartLayoutCount < chartLayoutArray.length; chartLayoutCount++) {
			var keepAllTheBrokenTables = jQuery(chartLayoutArray[chartLayoutCount]).find('table');
			if (keepAllTheBrokenTables.length > 0) {
				var findTheColumnCount = jQuery(jQuery(jQuery(keepAllTheBrokenTables[0]).find('tbody')).find('tr')[0]).find('td').length;
				jQuery(chartLayoutArray[chartLayoutCount]).empty();
				if (findTheColumnCount <= 9) {
					jQuery(chartLayoutArray[chartLayoutCount]).css('display', 'inline');
				}
				var htmlForTableHead = '<div class="tableheaderdiv">' + jQuery(tableLabelArray[validChartCountIndex][0]).html() + '</div>';
				for( var tcount = 0; tcount < keepAllTheBrokenTables.length; tcount++) {
					if (tcount != 0) {
						htmlForTableHead = '';
					}
					if (findTheColumnCount > 9) {
						jQuery(chartLayoutArray[chartLayoutCount]).append('<div  class="rotationDiv">' + htmlForTableHead + '<table  class="printtable">' + jQuery(keepAllTheBrokenTables[tcount]).html() + '</table></div>');
					} else {
						jQuery(chartLayoutArray[chartLayoutCount]).append(htmlForTableHead + '<table  class="printtable">' + jQuery(keepAllTheBrokenTables[tcount]).html() + '</table>');
					}
				}
				validChartCountIndex++;
			}
		}
		createRotationOfTableLayout(chartLayoutArray);
		chartLayoutArray = null;
	}
	function createRotationOfTableLayout(chartLayoutArray) {
		for( var chartLayoutCount = 0; chartLayoutCount < chartLayoutArray.length; chartLayoutCount++) {
			var keepAllTheBrokenTables = jQuery(chartLayoutArray[chartLayoutCount]).find('table');
			var findTheColumnCount = jQuery(jQuery(jQuery(keepAllTheBrokenTables[0]).find('tbody')).find('tr')[0]).find('td').length;
			if (keepAllTheBrokenTables.length > 0 && findTheColumnCount > 9) {
				// create as many copy of root element as table count and delete other tables from that copy
				// find the main node
				var mainNode = jQuery(chartLayoutArray[chartLayoutCount]).parent().parent().parent();
				var pageBreakString = '<div class="page-break"> </div>';
				var collectAllTheString = '';
				for( var tcount = 0; tcount < keepAllTheBrokenTables.length; tcount++) {
					var mainNodeClone = jQuery(mainNode).clone();
					var tableContainerObject = jQuery(mainNodeClone).find('table');
					for( var jcount = 0; jcount < keepAllTheBrokenTables.length; jcount++) {
						if (jcount != tcount) {
							jQuery(jQuery((tableContainerObject)[jcount]).parent()).remove();
						}
					}
					var theOuterHtmlClone = jQuery(mainNodeClone).wrap('<p/>').parent().html();
					jQuery(mainNodeClone).unwrap();
					if (tcount < keepAllTheBrokenTables.length - 1) {
						collectAllTheString += theOuterHtmlClone + pageBreakString;
					} else {
						collectAllTheString += theOuterHtmlClone;
					}
				}
				jQuery(mainNode).after(collectAllTheString);
				jQuery(mainNode).remove();
			}
		}
	}
};
