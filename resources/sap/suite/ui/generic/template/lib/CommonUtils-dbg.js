sap.ui.define(["jquery.sap.global", "sap/ui/base/Object", "sap/ui/Device", "sap/ui/model/json/JSONModel",
		"sap/ui/comp/smarttable/SmartTable", "sap/ui/table/Table", "sap/m/Table", "sap/m/ListBase", "sap/m/MessageBox",
		"sap/ui/generic/app/navigation/service/NavigationHandler", "sap/ui/generic/app/navigation/service/NavError", 
		"sap/suite/ui/generic/template/lib/testableHelper"], 
		function(jQuery, BaseObject, Device, JSONModel, SmartTable, UiTable, ResponsiveTable, ListBase, MessageBox, 
				NavigationHandler, NavError, testableHelper) {
	"use strict";

	function getNavigationProperty(oPageEntries, sEntitySet) {
		for (var i in oPageEntries) {
			var oEntry = oPageEntries[i];
			if (oEntry.entitySet === sEntitySet && oEntry.component.list && oEntry.navigationProperty) {
				return oEntry.navigationProperty;
			} else if (oEntry.pages) {
				var result = getNavigationProperty(oEntry.pages, sEntitySet);
				if (result) {
					return result;
				}
			}
		}
	}

	function getMethods(oController, oServices, oComponentUtils) {

		var oNavigationHandler; // initialized on demand

		// defines a dependency from oControl to the view
		function fnAttachControlToView(oControl) {
		    oServices.oApplication.attachControlToParent(oControl, oController.getView());
		}

		// See documentation of
		// sap.suite.ui.generic.template.lib.CommonUtils.prototype.getSelectedContexts.getDialogFragment below
		function getDialogFragment(sName, oFragmentController, sModel, fnOnFragmentCreated) {
		    return oServices.oApplication.getDialogFragmentForView(oController.getView(), sName, oFragmentController, sModel, fnOnFragmentCreated);
		}

		var oResourceBundle; // initialized on first use
		function getText() {
			oResourceBundle = oResourceBundle || oController.getOwnerComponent().getModel("i18n").getResourceBundle();
			return oResourceBundle.getText.apply(oResourceBundle, arguments);
		}

		function isDraftEnabled() {
			var oDraftContext = oServices.oDraftController.getDraftContext();
			return oDraftContext.isDraftEnabled(oController.getOwnerComponent().getEntitySet());
		}

		function getSelectedContexts(oControl) {
			var aSelectedContexts = [];
			if (oControl instanceof SmartTable) {
				oControl = oControl.getTable();
			} else if (oControl instanceof sap.ui.comp.smartchart.SmartChart) {
				oControl = oControl.getChart();
				if (oControl instanceof sap.chart.Chart) {
					var mDataPoints = oControl.getSelectedDataPoints();
					if (mDataPoints.count > 0) {
						var aDataPoints = mDataPoints.dataPoints;
						for (var i = 0; i < aDataPoints.length; i++) {
							aSelectedContexts.push(aDataPoints[i].context);
						}
					}
				}
			}
			if (oControl instanceof ListBase) {
				aSelectedContexts = oControl.getSelectedContexts();
			} else if (oControl instanceof UiTable) {
				var aIndex = oControl.getSelectedIndices();
				for (var i = 0; i < aIndex.length; i++) {
					aSelectedContexts.push(oControl.getContextByIndex(aIndex[i]));
				}
			}
			return aSelectedContexts;
		}
		
		/*
		 * Sets the enabled value for Toolbar buttons
		 * @param {object} oSubControl
		 */
		function fnSetEnabledToolbarButtons (oSubControl) {
			var aToolbarControls, aButtons, oToolbarControl, sLocalButtonId, bEnabled, mCustomData;
			var oControl = this.getOwnerControl(oSubControl);  // look for parent table or chart
			var sControlName = oControl.getMetadata().getName();
			if (sControlName !==  "sap.ui.comp.smarttable.SmartTable" && sControlName !== "sap.ui.comp.smartchart.SmartChart") {
				oControl = oControl.getParent();
				sControlName = oControl.getMetadata().getName();
			}
			var aContexts = this.getSelectedContexts(oControl);
			var oModel = oControl.getModel();
			var oMetaModel = oModel.getMetaModel();
			var oView = oController.getView();
			
			if (sControlName === "sap.ui.comp.smarttable.SmartTable") {
				aToolbarControls = oControl.getCustomToolbar() && oControl.getCustomToolbar().getContent();
				
				// Breakout Action buttons
				// for now the breakout actions is only for SmartTable and use a different approach to update the private model
				aButtons = this.getBreakoutActionsForTable(oControl);
				this.fillEnabledMapForBreakoutActions(aButtons, aContexts, oModel);
			} else if (sControlName === "sap.ui.comp.smartchart.SmartChart") {
				aToolbarControls = oControl.getToolbar() && oControl.getToolbar().getContent();
			}
			
			// loop through the array of controls inside the toolbar
			if (aToolbarControls && aToolbarControls.length > 0) {
				for (var i = 0; i < aToolbarControls.length; i++) {
					bEnabled = undefined;
					oToolbarControl = aToolbarControls[i];
					
					if (oToolbarControl.getMetadata().getName() === "sap.m.Button" && oToolbarControl.getVisible()) {
						// we determine the type of button (e.g. Delete button, Annotated Action button etc...) via the CustomData "Type"
						mCustomData = this.getElementCustomData(oToolbarControl);
						if (mCustomData && mCustomData.Type) {
							// get the partial id, instead of the full id generated by ui5
							// partial id is used when initially building the expression - see method buildAnnotatedActionButtonEnablementExpression in AnnotationHelper.js
							sLocalButtonId = oView.getLocalId(oToolbarControl.getId());
							
							// 1. Type = "CRUDActionDelete" -> Delete button
							// 2. Type = "com.sap.vocabularies.UI.v1.DataFieldForAction" or "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" -> Annotated Action button
							if (mCustomData.Type === "CRUDActionDelete") {
								bEnabled = fnShouldDeleteButtonGetEnabled(oModel, oMetaModel, aContexts, oControl);
							} else if (mCustomData.Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || mCustomData.Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
								bEnabled = fnShouldAnnotatedActionButtonGetEnabled(oModel, oMetaModel, aContexts, mCustomData.Type, mCustomData.Action);
							}							
						}
						
						// check if "enabled" is bound to the path '/generic/controlProperties/' in the model - otherwise it's bound to another path or has a hard coded true/false
						if (/generic\/controlProperties/.test(oToolbarControl.getBindingPath("enabled")) && bEnabled !== undefined) {
							fnSetPrivateModelControlProperty(sLocalButtonId, "enabled", bEnabled);
						}
					}
				}
			}
			// TODO: do we still need to check the table binding? or can we remove it?
			// var oTableBinding =  getTableBinding(oTable);
			// var oListBinding = oTableBinding && oTableBinding.binding;
			// if (oListBinding && oListBinding.oEntityType) {
			//	var oEntityType = oModel.getMetaModel().getODataEntityType(oListBinding.oEntityType.entityType);
			//	fillFunctionEnabledMap(aContexts, oModel, oEntityType);
			// }
		}
		
		function fnSetEnabledFooterButtons (oTable, oController) {
			var aButtons = this.getBreakoutActionsForFooter(oController);
			var aContexts = this.getSelectedContexts(oTable);
			var oModel = oTable.getModel();
			this.fillEnabledMapForBreakoutActions(aButtons, aContexts, oModel);
		}
		
		/*
		 * Updates the private model control property
		 * @param {string} sId - the id of the button in the private model
		 * @param {string} sProperty - the name of the property in the private model
		 * @param {string} sValue - the value of the property
		 */
		function fnSetPrivateModelControlProperty (sId, sProperty, sValue) {
			var oTemplatePrivateModel = oController.getView().getModel("_templPriv");
			var mModelProperty = oTemplatePrivateModel.getProperty("/generic/controlProperties/" + sId);
			// check if the id exists in the model
			if (!mModelProperty) {
				mModelProperty = {};
				mModelProperty[sProperty] = sValue;
				oTemplatePrivateModel.setProperty("/generic/controlProperties/" + sId, mModelProperty);
			} else {
				oTemplatePrivateModel.setProperty("/generic/controlProperties/" + sId + "/" + sProperty, sValue);
			}
		}
		
		/*
		 * Determines whether an Annotated Action should be enabled or disabled
		 * @private
		 */
		function fnShouldAnnotatedActionButtonGetEnabled (oModel, oMetaModel, aContexts, sType, sAction) {
			var mFunctionImport, mData, sActionFor, sApplicablePath;
			var bEnabled = false;
			
			if (sType === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
				mFunctionImport = oMetaModel.getODataFunctionImport(sAction);
				sActionFor = mFunctionImport && mFunctionImport["sap:action-for"];
				// check if 'sap:action-for' is defined
				if (sActionFor && sActionFor !== "" && sActionFor !== " ") {
					if (aContexts.length > 0) {
						sApplicablePath = mFunctionImport["sap:applicable-path"];
						// check if 'sap:applicable-path' is defined
						if (sApplicablePath && sApplicablePath !== "" && sApplicablePath !== " ") {
							for (var j = 0; j < aContexts.length; j++) {
								mData = oModel.getObject(aContexts[j].getPath()); // get the data
								if (mData && mData[sApplicablePath] === true) {
									bEnabled = true;  //  'sap:action-for' defined, 'sap:applicable-path' defined, 'sap-applicable-path' value is true, more than 1 selection -> enable button
									break;
								}
							}
						} else {
							bEnabled = true; // 'sap:action-for' defined, 'sap:applicable-path' not defined, more than 1 selection -> enable button
						}						
					}
				} else {
					bEnabled = true; // 'sap:action-for' not defined, no selection required -> enable button
				}
			} else if (sType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && aContexts.length > 0) { // to enable UI.DataFieldForIntentBasedNavigation action button at least one selection is required
				bEnabled = true;
			}
			
			return bEnabled;
		}
		
		/*
		 * Determines whether the Delete button should be enabled or disabled
		 * @private
		 */
		function fnShouldDeleteButtonGetEnabled (oModel, oMetaModel, aContexts, oControl) {
			// Get the DeleteRestrictions for the entity set
			var mDeleteRestrictions = fnGetDeleteRestrictions(oControl);

			// 1- Make Delete button disabled and assume all items are NOT deletable
			// 2- Check if the DeleteRestrictions are valid. if not-> Delete button disabled
			// 3- Check if the Deletable-path is defined. if not-> Delete button enabled.
			// if there is no DeleteRestrictions, this means the entities are deletable
			var bEnabled = false;
			var mRelatedEntitySet = oMetaModel.getODataEntitySet(oControl.getEntitySet());
			if (sap.suite.ui.generic.template.js.AnnotationHelper.areDeleteRestrictionsValid(oMetaModel, mRelatedEntitySet.entityType, mDeleteRestrictions)) {
				if (aContexts.length > 0) {
					var sDeletablePath = mDeleteRestrictions && mDeleteRestrictions.Deletable && mDeleteRestrictions.Deletable.Path;
					if (sDeletablePath) {
						for (var i = 0; i < aContexts.length; i++) {
							if (oModel.getProperty(sDeletablePath, aContexts[i])) {
								bEnabled = true;
								break;
							}
						}
					} else {
						bEnabled = true;
					}
				}
			}
			
			return bEnabled;
		}
		
		/*
		 * Returns the Deletable Restrictions
		 * @param {object} oControl - must be of a Smart Control (e.g. SmartTable, SmartChart)
		 */
		function fnGetDeleteRestrictions(oControl) {
			var oMetaModel = oControl.getModel() && oControl.getModel().getMetaModel();
			var mEntitySet = oMetaModel && oMetaModel.getODataEntitySet(oControl.getEntitySet());
			var mDeleteRestrictions = mEntitySet && mEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"];
			return mDeleteRestrictions;
		}
		
		/*
		* Update map /generic/listCommons/functionEnabled from selected context,
		* considering the applicable path and action-for
		*/
		function fillEnabledMapForBreakoutActions(aButtons, aContexts, oModel) {
			var oBreakoutActions = fnGetBreakoutActionsFromManifest(oModel);
			var oTemplatePrivateModel = oController.getView().getModel("_templPriv");
			var oBreakOutActionEnabled = oTemplatePrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled");
			if (oBreakoutActions) {
				fnUpdateBreakoutEnablement(oBreakOutActionEnabled, oBreakoutActions, aButtons, aContexts, oModel);
			}
			oTemplatePrivateModel.setProperty("/generic/listCommons/breakoutActionsEnabled", oBreakOutActionEnabled);
		}
		
		function fnUpdateBreakoutEnablement(oBreakOutActionEnabled, oBreakoutActions, aButtons, aContexts, oModel) {
			var bEnabled;
			for (var sAction in oBreakoutActions) {
				if (jQuery.inArray(oBreakoutActions[sAction].id, aButtons) !== -1) {
					bEnabled = true;
					if (oBreakoutActions[sAction].requiresSelection) {
						if (aContexts.length > 0) { // context selected
							if (oBreakoutActions[sAction].applicablePath !== undefined && oBreakoutActions[sAction].applicablePath !== "") {
								// loop on all selected contexts: at least one must be selected with applicablePath = true
								bEnabled = false;
								for (var iContext = 0; iContext < aContexts.length; iContext++) {
									// check if applicablePath is true
									var sNavigationPath = "";
									var aPaths = oBreakoutActions[sAction].applicablePath.split("/");
									if (aPaths.length > 1) {
										for (var iPathIndex = 0; iPathIndex < aPaths.length - 1; iPathIndex++) {
											sNavigationPath +=  "/" + aPaths[iPathIndex];
										}
									}
									var oObject = oModel.getObject(aContexts[iContext].getPath() + sNavigationPath);
									var sApplicablePath = aPaths[aPaths.length - 1];
									if (oObject[sApplicablePath] === true) {
										bEnabled = true;
										break;
									}	
								} 
							} 
						} else {
							// requiresSelection is defined, but no row is selected
							bEnabled = false;
						}
					}
					oBreakOutActionEnabled[oBreakoutActions[sAction].id] = {
							enabled: bEnabled
					};
				}
			}
		}

		function fnGetBreakoutActionsForTable(oTable) {
			var aButtons = [];
			var aTableToolbarContent = jQuery.grep(oTable.getCustomToolbar().getContent(), function(oControl) {
				return oControl.getMetadata().getName() === "sap.m.Button";
			});
			for (var iTableToolbarContent = 0; iTableToolbarContent < aTableToolbarContent.length; iTableToolbarContent++) {
				var aSplitId = aTableToolbarContent[iTableToolbarContent].getId().split("--");
				aButtons.push(aSplitId[aSplitId.length - 1]);
			}
			return aButtons;
		}

		function fnGetBreakoutActionsForFooter(oController) {
			var aButtons = [];
			var aFooterToolbarContent = [];
			var oPage = oController.getView().byId("page");
			if (oPage && oPage.getFooter()) {
				aFooterToolbarContent = jQuery.grep(oPage.getFooter().getContent(), function(oControl) {
					return oControl.getMetadata().getName() === "sap.m.Button";
				});
			}
			for (var iFooterToolbarContent = 0; iFooterToolbarContent < aFooterToolbarContent.length; iFooterToolbarContent++) {
				var aSplitId = aFooterToolbarContent[iFooterToolbarContent].getId().split("--");
				aButtons.push(aSplitId[aSplitId.length - 1]);
			}
			return aButtons;
		}

		function fnGetBreakoutActionsFromManifest(oModel) {
			// Loop on manifest for breakout actions
			var oManifest = oController.getOwnerComponent().getAppComponent().getManifestEntry("sap.ui5");
			var oExtensions = oManifest.extends && oManifest.extends.extensions && oManifest.extends.extensions["sap.ui.controllerExtensions"];
			if (oExtensions) {
				var	oTemplateExtensions = (oExtensions[oController.getOwnerComponent().getTemplateName()] || {})["sap.ui.generic.app"] || {};
				var oMetaModel = oModel.getMetaModel();
				var oBreakoutActions = (oTemplateExtensions[oMetaModel.getODataEntitySet(oController.getOwnerComponent().getEntitySet()).name] || {})["Actions"];
				if (!oBreakoutActions) {
					oBreakoutActions = {};
					var oSections = (oTemplateExtensions[oMetaModel.getODataEntitySet(oController.getOwnerComponent().getEntitySet()).name] || {})["Sections"];
					if (oSections) {
						for (var sSection in oSections) {
							oBreakoutActions = jQuery.extend(oBreakoutActions, oSections[sSection]["Actions"]);
						}
					}
				}
				return oBreakoutActions;
			}
		}

		/*
		 * Returns a parental table of the given element or null
		 *
		 * @param {sap.ui.core.Element} oSourceControl The element where to start searching for a parental table
		 * @returns {sap.ui.table.Table|sap.m.Table|sap.ui.comp.smarttable.SmartTable} The parent table or null
		 * @public
		 */
		function getOwnerControl(oSourceControl){
			var oCurrentControl = oSourceControl;
			while (oCurrentControl) {
					if (oCurrentControl instanceof ResponsiveTable || oCurrentControl instanceof UiTable || oCurrentControl instanceof SmartTable || oCurrentControl instanceof sap.ui.comp.smartchart.SmartChart) {
						return oCurrentControl;
					}

					if (oCurrentControl.getParent){
						oCurrentControl = oCurrentControl.getParent();
					} else {
						return null;
					}

				}
			return null;
		}

		/*
		 * Returns the binding of the given table
		 *
		 * @param {sap.ui.table.Table|sap.m.Table|sap.ui.comp.smarttable.SmartTable} oTable The table which's binding is to returned
		 * @returns {object} The found binding or null
		 * @public
		 */
		function getTableBinding(oTable) {
			if (oTable instanceof SmartTable) {
				oTable = oTable.getTable(); // get SmartTable's inner table first
			}

			if (oTable instanceof UiTable) {
				return oTable.getBindingInfo("rows");
			} else if (oTable instanceof ResponsiveTable) {
				return oTable.getBindingInfo("items");
			}

			return null;
		}

		/*
		 * Triggers navigation from a given list item.
		 *
		 * @param {sap.ui.model.context} selected context for navigation
		 * @param {object} oTable The table from which navigation was triggered
		 *        control in the table
		 * @public
		 */
		function fnNavigateFromListItem(oContext, oTable) {
			var sSelectedPath = oContext.getPath();
			var oComponent = oController.getOwnerComponent();

			// binding path of component - either binding path of list (list screen e.g. /SalesOrder) or binding path of details screen (e.g.
			// /SalesOrder(123) )
			// var sPath = oComponent.getBindingContext().getPath();
			var sPath = "";
			if (oComponent.getComponentContainer().getElementBinding()) {
				sPath = oComponent.getComponentContainer().getElementBinding().getPath();
			}

			// check whether it is a navigation property binding or just a collection
			var sNavigationProperty = null;

			if (sSelectedPath.indexOf(sPath) !== 0) {
				// relative binding - table bound to navigation property e.g. Item - get binding of embedded table in details screen
				sNavigationProperty = getTableBinding(oTable).path;
			}
			
			var bReplace = !oServices.oApplication.isNewHistoryEntryRequired(oContext, sNavigationProperty);
			var iDisplayMode;
			if (isDraftEnabled()){
				iDisplayMode = oServices.oDraftController.isActiveEntity(oContext) ? 1 : 6;
			} else {
				iDisplayMode = oController.getOwnerComponent().getModel("ui").getProperty("/editable") ? 6 : 1;
			}
			oServices.oNavigationController.navigateToContext(oContext, sNavigationProperty, bReplace, iDisplayMode);
		}

		/*
		 * Triggers navigation to the specified context.
		 *
		 * @param {sap.ui.model.Context} context for navigation
		 * @param {object} [oNavigationData] object containing navigation data
		 */
		function fnNavigateToContext(oContext, oNavigationData) {
			var sNavigationProperty;
			if (oNavigationData && oNavigationData.navigationProperty) {
				sNavigationProperty = oNavigationData.navigationProperty;
			}
			oServices.oNavigationController.navigateToContext(oContext, sNavigationProperty, false);
		}

		function fnHandleError(oError) {
			if (oError instanceof NavError) {
				MessageBox.show(oError.getErrorCode(), {
					title: getText("ST_GENERIC_ERROR_TITLE")
				});
			}
		}

		function fnNavigateExternal(oOutbound, oState) {
			fnProcessDataLossConfirmationIfNonDraft(function() {
				oNavigationHandler = getNavigationHandler();
				oNavigationHandler.navigate(oOutbound.semanticObject, oOutbound.action, oNavigationHandler
						.mixAttributesAndSelectionVariant(oOutbound.parameters).toJSONString(), oState.getCurrentAppState
						&& oState.getCurrentAppState() || {}, fnHandleError);
			}, jQuery.noop, oState, "LeavePage");
		}
		
		function formatDraftLockText(IsActiveEntity, HasDraftEntity, LockedBy) {
			if (!IsActiveEntity) {
				// current assumption: is my Draft as I don't see other's draft -> TODO: to be checked
				return getText("DRAFT_OBJECT");
			} else if (HasDraftEntity) {
				return getText(LockedBy ? "LOCKED_OBJECT" : "UNSAVED_CHANGES");
			} else {
				return ""; // not visible
			}
		}

		function getDraftPopover() {
			var oDraftPopover = getDialogFragment("sap.suite.ui.generic.template.fragments.DraftAdminDataPopover", {
				formatText: function() {
					var aArgs = Array.prototype.slice.call(arguments, 1);
					var sKey = arguments[0];
					if (!sKey) {
						return "";
					}
					if (aArgs.length > 0 && (aArgs[0] === null || aArgs[0] === undefined || aArgs[0] === "")) {
						if (aArgs.length > 3 && (aArgs[3] === null || aArgs[3] === undefined || aArgs[3] === "")) {
							return (aArgs.length > 2 && (aArgs[1] === null || aArgs[1] === undefined || aArgs[1] === ""))
									? ""
									: aArgs[2];
						} else {
							return getText(sKey, aArgs[3]);
						}
					} else {
						return getText(sKey, aArgs[0]);
					}
				},
				closeDraftAdminPopover: function() {
					oDraftPopover.close();
				},
				formatDraftLockText: formatDraftLockText
			}, "admin");
			return oDraftPopover;
		}
		
		function fnProcessDataLossConfirmationIfNonDraft(fnProcessFunction, fnCancelFunction, oState, sMode, bNoBusyCheck) {
			var oBusyHelper = oServices.oApplication.getBusyHelper();
			if (!bNoBusyCheck && oBusyHelper.isBusy()) {
				return; // do not navigate away from a page that is currently busy 
			}
			// DataLost Popup only for Non-Draft
			if ( !isDraftEnabled() ) {
				//Test all registered UnsavedDataCheckFunctions
				var bHasExternalChanges = false;
				if (oState && oState.aUnsavedDataCheckFunctions){
					bHasExternalChanges = oState.aUnsavedDataCheckFunctions.some(function(fnUnsavedCheck) {
						return fnUnsavedCheck();
					});
				}
				if ( bHasExternalChanges || oController.getView().getModel().hasPendingChanges() ) { 
					var oExecutionPromise;
					fnDataLossConfirmation(
							function() { 
								oController.getView().getModel().resetChanges();
								//Notification for reuse components and extensions
								oComponentUtils.fire(oController, "AfterCancel", {});
								oExecutionPromise = fnProcessFunction();
							}, 
							function(){
								oExecutionPromise = fnCancelFunction();
							}, 
							sMode );
					return oExecutionPromise;
				}
			}
			return fnProcessFunction();
		}
		
		var fnOnDataLossConfirmed; // the current handler for data loss confirmation
		function fnDataLossConfirmation(onDataLossConfirmed, onDataLossCancel, sMode) {
			// note that we must pass the event handler to a global variable, since always the version of onDataLossOK will be
			// executed which was created, when fnDataLossConfirmation was called for the first time 
			// (see documentation of getDialogFragment).
			fnOnDataLossConfirmed = onDataLossConfirmed;
			if (!sMode){
				sMode = "LeavePage";
			}
			var oDataLossPopup = getDialogFragment("sap.suite.ui.generic.template.fragments.DataLoss", {
				onDataLossOK: function() {
					oDataLossPopup.close();
					fnOnDataLossConfirmed(); // call the version of onDataLossConfirmed which is currently valid
				},
				onDataLossCancel: function() {
					oDataLossPopup.close();
					onDataLossCancel();
				}
			}, "dataLoss");
			
			var oDataLossModel = oDataLossPopup.getModel("dataLoss");
			oDataLossModel.setProperty("/mode", sMode);
			oDataLossPopup.open();
		}

		function fnSecuredExecution(fnFunction, mParameters, oState) {
			// set default values for parameters
			mParameters = jQuery.extend(true, {
				busy: {set: true, check: true},
				dataloss: {popup: true, navigation: false}
			}, mParameters);
			
			var oBusyHelper = oServices.oApplication.getBusyHelper();

			var oResultPromise = new Promise(function(resolve, reject) {
				if (mParameters.busy.check && oBusyHelper.isBusy()) {reject(); return;}
				
				var oPromise = (mParameters.dataloss.popup ? fnProcessDataLossConfirmationIfNonDraft(fnFunction, reject,
						oState, (mParameters.dataloss.navigation ? "LeavePage" : "Proceed"), true) : fnFunction());
				
				if (oPromise instanceof Promise) {
					oPromise.then(function(oResult) {resolve(oResult);}, function(oResult) {reject(oResult);});
				} else {
					resolve();
				}
			});
			
			if (mParameters.busy.set) {
				oBusyHelper.setBusy(oResultPromise);
			}
			return oResultPromise;
		}
		
		function getNavigationHandler() {
			oNavigationHandler = oNavigationHandler || new NavigationHandler(oController);
			return oNavigationHandler;
		}

		/* eslint-disable */
		var getNavigationHandler = testableHelper.testable(getNavigationHandler, "getNavigationHandler");
		var isDraftEnabled = testableHelper.testable(isDraftEnabled, "isDraftEnabled");
		/* eslint-enable */

		return {
			getNavigationProperty: getNavigationProperty,
			getText: getText,
			isDraftEnabled: isDraftEnabled,
			getNavigationHandler: getNavigationHandler,

			executeGlobalSideEffect: function() {
				if (isDraftEnabled()) {
					var oView = oController.getView();
					oView.attachBrowserEvent(
							"keyup",
							function(oBrowswerEvent) {
								if (oBrowswerEvent.keyCode === 13 && oView.getModel("ui").getProperty("/editable")) {
									oServices.oApplicationController.executeSideEffects(oView.getBindingContext());
								}
							});
				}
			},
			setEnabledToolbarButtons: fnSetEnabledToolbarButtons,
			setEnabledFooterButtons: fnSetEnabledFooterButtons,
			fillEnabledMapForBreakoutActions: fillEnabledMapForBreakoutActions,
			getBreakoutActionsForTable: fnGetBreakoutActionsForTable,
			getBreakoutActionsForFooter: fnGetBreakoutActionsForFooter,
			getBreakoutActionsFromManifest: fnGetBreakoutActionsFromManifest,
			getSelectedContexts: getSelectedContexts,
			getDeleteRestrictions: fnGetDeleteRestrictions,
			
			setPrivateModelControlProperty: fnSetPrivateModelControlProperty,
			
			navigateFromListItem: fnNavigateFromListItem,
			navigateToContext: fnNavigateToContext,
			navigateExternal: fnNavigateExternal,

			getCustomData: function(oEvent) {
				var aCustomData = oEvent.getSource().getCustomData();
				var oCustomData = {};
				for (var i = 0; i < aCustomData.length; i++) {
					oCustomData[aCustomData[i].getKey()] = aCustomData[i].getValue();
				}
				return oCustomData;
			},

			formatDraftLockText: formatDraftLockText,

			showDraftPopover: function(oBindingContext, oTarget) {
				var oPopover = getDraftPopover();
				var oAdminModel = oPopover.getModel("admin");
				oAdminModel.setProperty("/IsActiveEntity", oBindingContext.getProperty("IsActiveEntity"));
				oAdminModel.setProperty("/HasDraftEntity", oBindingContext.getProperty("HasDraftEntity"));
				oPopover.bindElement({
					path: oBindingContext.getPath() + "/DraftAdministrativeData"
				});
				if (oPopover.getBindingContext()) {
					oPopover.openBy(oTarget);
				} else {
					oPopover.getObjectBinding().attachDataReceived(function() {
						oPopover.openBy(oTarget);
					});
					// Todo: Error handling
				}
			},

			// provide the density class that should be used according to the environment (may be "")
			getContentDensityClass: function() {
				return oServices.oApplication.getContentDensityClass();
			},

			// defines a dependency from oControl to the view
			attachControlToView: fnAttachControlToView,

			/**
			 *
			 * @function
			 * @name sap.suite.ui.generic.template.lib.CommonUtils.prototype.getSelectedContexts.getDialogFragment(sName,
			 *       oFragmentController, sModel)
			 * @param sName name of a fragment defining a dialog for the current view
			 * @param oFragmentController controller for the fragment containing event handlers and formatters used by the
			 *          fragment
			 * @param sModel optional, name of a model. If this parameter is truthy a JSON model with the given name will be
			 *          attached to the dialog
			 * @return an instance of the specififed fragment which is already attached to the current view. Note that each
			 *         fragment will only be instantiated once. Hence, when the method is called several times for the same
			 *         name the same fragment will be returned in each case. <b>Attention:</b> The parameters
			 *         <code>oFragmentController</code> and <code>sModel</code> are only evaluated when the method is
			 *         called for the first time for the specified fragment. Therefore, it is essential that the functions in
			 *         <code>oFragmentController</code> do not contain 'local state'.
			 */
			getDialogFragment: getDialogFragment,
			processDataLossConfirmationIfNonDraft: fnProcessDataLossConfirmationIfNonDraft,
			securedExecution: fnSecuredExecution,
			getOwnerControl: getOwnerControl,
			getTableBinding: getTableBinding,
			getElementCustomData: function(oElement) {
				var oCustomData = {};
				if (oElement instanceof sap.ui.core.Element) {
					oElement.getCustomData().forEach(function(oCustomDataElement) {
						oCustomData[oCustomDataElement.getKey()] = oCustomDataElement.getValue();
					});
				}
				return oCustomData;
			},
			triggerAction: function(aContexts, sBindingPath, oCustomData, oControl, oState) {
				// Assuming that this action is triggered from an action inside a table row.
				// Also this action is intended for triggering an OData operation.
				// i.e: Action, ActionImport, Function, FunctionImport
				// We require some properties to be defined in the Button's customData:
				//   Action: Fully qualified name of an Action, ActionImport, Function or FunctionImport to be called
				//   Label: Used to display in error messages
				// Once the CRUDManager callAction promise is resolved, if we received a context back from the OData call
				// we check to see if the context that was sent (actionContext) and the context that is returned (oResponse.reponse.context).
				// If they are the same we do nothing. If they are different we trigger any required navigations and set the newly navigated
				// page to dirty using the setMeToDirty function of the NavigationController so as to enter into edit mode and set the page
				// to edit mode.
				fnProcessDataLossConfirmationIfNonDraft(function() {
					oServices.oCRUDManager.callAction({
						functionImportPath: oCustomData.Action,
						contexts: aContexts,
						sourceControl: oControl,
						label: oCustomData.Label,
						operationGrouping: "",
						navigationProperty: ""
					}).then(function(aResponses) {
						if (aResponses && aResponses.length > 0) {
							var oResponse = aResponses[0];
	
							if (oResponse.response && oResponse.response.context && (!oResponse.actionContext || oResponse.actionContext && oResponse.response.context.getPath() !== oResponse.actionContext.getPath())) {
								oServices.oViewDependencyHelper.setMeToDirty(oController.getOwnerComponent(), sBindingPath);
							}
						}
					});
				}, jQuery.noop, oState, "Proceed");
			}
			/*
			//use CommonEventHandler->fnNavigateIntent if possible
			triggerIntentBasedNavigationWithSelectionVariant: function(oContext, oInnerAppData, oCustomData) {
				// Assuming that this action is triggered from an action inside a table row.
				// Also this action is intended for triggering an intent based navigation.
				// We require some properties to be defined in the Button's customData:
				//   Action: The view to be displayed within the application
				//   Label: Used to display in error messages
				//   SemanticOject: Application to navigate to
				var oNavigationHandler = this.getNavigationHandler();
				if (oNavigationHandler) {
					var mSemanticAttributes = {};
					if (oContext) {
						mSemanticAttributes = oContext;
						delete mSemanticAttributes.__metadata;
					}
					mSemanticAttributes = this.extractODataEntityPropertiesFromODataJSONFormattedEntity(mSemanticAttributes);
					var mOutboundParameters = oNavigationHandler.mixAttributesAndSelectionVariant(mSemanticAttributes, oInnerAppData.selectionVariant).toJSONString();
					var that = this;
					oNavigationHandler.navigate(oCustomData.SemanticObject, oCustomData.Action, mOutboundParameters, oInnerAppData, function(oError) {
						if (oError instanceof sap.ui.generic.app.navigation.service.NavError) {
							sap.m.MessageBox.show(oError.getErrorCode(), {
								title: that.getText("ST_GENERIC_ERROR_TITLE")
							});
						}
					});
				}
			},
			//use CommonEventHandler->fnNavigateIntent if possible
			triggerIntentBasedNavigation: function(oContext, oCustomData) {
				// Assuming that this action is triggered from an action inside a table row.
				// Also this action is intended for triggering an intent based navigation.
				// We require some properties to be defined in the Button's customData:
				//   Action: The view to be displayed within the application
				//   Label: Used to display in error messages
				//   SemanticOject: Application to navigate to
				var oNavigationHandler = this.getNavigationHandler();
				if (oNavigationHandler) {
					var mSemanticAttributes = {};
					if (oContext) {
						mSemanticAttributes = oContext;
						delete mSemanticAttributes.__metadata;
						jQuery.extend(mSemanticAttributes, oController.getView().getBindingContext().getObject());
					}
					var mOutboundParameters = this.extractODataEntityPropertiesFromODataJSONFormattedEntity(mSemanticAttributes);
					mOutboundParameters = JSON.stringify(mOutboundParameters);
					var that = this;
					oNavigationHandler.navigate(oCustomData.SemanticObject, oCustomData.Action, mOutboundParameters, {}, function(oError) {
						if (oError instanceof sap.ui.generic.app.navigation.service.NavError) {
							sap.m.MessageBox.show(oError.getErrorCode(), {
								title: that.getText("ST_GENERIC_ERROR_TITLE")
							});
						}
					});
				}
			},
			extractODataEntityPropertiesFromODataJSONFormattedEntity: function(mEntity) {
				var mExtractedODataEntityProperties = {};
				for (var sPropertyName in mEntity) {
					var vAttributeValue = mEntity[sPropertyName];
					if (jQuery.type(vAttributeValue) !== "object") {
						mExtractedODataEntityProperties[sPropertyName] = vAttributeValue;
					}
				}
				return mExtractedODataEntityProperties;
			},*/

		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.CommonUtils", {
		constructor: function(oController, oServices, oComponentUtils) {

			jQuery.extend(this, getMethods(oController, oServices, oComponentUtils));
		}
	});
});