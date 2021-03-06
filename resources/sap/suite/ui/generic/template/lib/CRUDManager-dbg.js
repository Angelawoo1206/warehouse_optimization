sap.ui.define(["jquery.sap.global", "sap/ui/base/Object", "sap/m/MessageToast", "sap/ui/generic/app/util/ModelUtil", "sap/ui/generic/app/util/ActionUtil",
		"sap/suite/ui/generic/template/lib/MessageUtils", "sap/m/MessageBox"
		, "sap/suite/ui/generic/template/lib/CRUDHelper", "sap/suite/ui/generic/template/lib/testableHelper",
		"sap/m/Table", "sap/ui/table/AnalyticalTable"
	],
	function(jQuery, BaseObject, MessageToast, ModelUtil, ActionUtil, MessageUtils, MessageBox, CRUDHelper, testableHelper, Table, AnalyticalTable ) {
		"use strict";

		var oRejectedPromise = Promise.reject();
		oRejectedPromise.catch(jQuery.noop);

		function getMethods(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper) {

			function handleError(sOperation, reject, oError, mParameters) {
				MessageUtils.handleError(sOperation, oController, oServices, oError, mParameters);
				return (reject || jQuery.noop)(oError);
			}

			function handleSuccess() {
				MessageUtils.handleTransientMessages(oServices.oApplication.getDialogFragmentForView.bind(null, null));
			}

			var fnEditEntityImpl; // declare function already here, to avoid usage before declaration
			// This method is called to check about drafts of other users for the entity to be edited.
			// It returns a promise that is settled when this question has been clarified.
			// Actually there are two scenarios in which this method can be called:
			// - If oError is faulty the method is called at the beginning of the editing process. In this case this method
			//   must find out whether
			//   a) Another user possesses a locking draft for the entity -> promise is rejected
			//   b) Another user possesses a non-locking draft for the entity -> promise is resolved as described for function editEntity (see below)
			//   c) No draft exists for this object -> promise is resolved to an empty object
			// - If oError is truthy the back-end has already been called in order to create an edit draft. Thereby the preserveChange-mode was used (see below).
			//   This backend call returned the information that another user possesses a (locking or non-locking) draft for the entity.
			//   oError is the object that was returned from the backend. In this case this method must find out whether
			//   a) The corresponding draft is locking -> promise is rejected
			//   b) The corresponding draft is non-locking -> promise is resolved as described for function editEntity (see below)
			//   c) The draft has meanwhile disappeared (edge case) -> in this case the promise should also resolve as described for function editEntity. Therefore, the function is called once more.
			// In both scenarios in case a) this method is also responsible for error handling. Note that there is a subtle difference between these scenarios in this case.
			// In the second scenario the error message that should be presented to the user can be taken from oError (and thus comes from the backend)
			// In the first scenario the error message is created locally.
			function checkForForeignUserLock(oError) {
				return new Promise(function(resolve, reject) {
					var oComponent = oController.getOwnerComponent();
					// check whether Draft exists
					var oBindingContext = oComponent.getBindingContext();
					var oModel = oComponent.getModel();
					oModel.read(oBindingContext.getPath(), {
						urlParameters: {
							"$expand": "DraftAdministrativeData"
						},
						success: function(oResponseData) {
							if (!oResponseData.DraftAdministrativeData) { // no draft exists for the object at all
								if (oError) { // It seems that the draft that was responsible for producing oError has meanwhile vanished -> Restart the process (edge case)
									//return fnEditEntityImpl(false).then(resolve);
									return handleError(MessageUtils.operations.editEntity, reject, oError);
								}
								return resolve({});
							}
							if (oResponseData.DraftAdministrativeData.InProcessByUser) { // locked by other user
								var sUserDescription = oResponseData.DraftAdministrativeData.InProcessByUserDescription || oResponseData.DraftAdministrativeData.InProcessByUser;
								oError = oError || new Error(oCommonUtils.getText("ST_GENERIC_DRAFT_LOCKED_BY_USER", [" ", sUserDescription]));
								return handleError(MessageUtils.operations.editEntity, reject, oError, oError);
							}
							return resolve({
								draftAdministrativeData: oResponseData.DraftAdministrativeData
							}); // draft for other user exists but is no lock anymore
						},
						error: handleError.bind(null, MessageUtils.operations.editEntity, reject)
					});
				});
			}

			// This method is called in order to call method editEntity on the TransactionController. It returns a promise as described
			// in the description of method editEntity (see below).
			// Parameter oPrereadData is an object that possily contains administrative data which have already been retrieved.
			// More precisely this object is either empty or contains a property draftAdministrativeData.
			// In this second case the promise returned by this method should just resolve to oPrereadData.
			function fnCallEdit(bIsDraftEnabled, bUnconditional, oPrereadData) {
				if (oPrereadData.draftAdministrativeData) {
					return Promise.resolve(oPrereadData);
				}
				return new Promise(
					function(resolve, reject) {
						oServices.oTransactionController.editEntity(oController.getView().getBindingContext(), !bUnconditional)
							.then(
								function(oResponse) { //success
									oComponentUtils.rebindHeaderData(oResponse.context.getPath());
									handleSuccess(oResponse);
									return resolve({
										context: oResponse.context
									});
								},
								function(oResponse) { // error handler
									if (oResponse && oResponse.response && oResponse.response.statusCode === "409" && bIsDraftEnabled && !bUnconditional) { //there might be unsaved changes
										//remove transient message associated with rc 409 in order to prevent message pop-up
											MessageUtils.removeTransientMessages();
										// var oMesssageManager = sap.ui.getCore().getMessageManager();
										// var aMessages =  oMesssageManager.getMessageModel().getData();
										// var aMessagesToBeRemoved = [];
										// for (var i = 0; i < aMessages.length; i++) {
										// 	 if (aMessages[i].getCode() === "SDRAFT_COMMON/000") {
										// 		 aMessagesToBeRemoved.push(aMessages[i]);
										// 	 }
										// }
										// if (aMessagesToBeRemoved.length > 0) {
										// 	oMesssageManager.removeMessages(aMessagesToBeRemoved);
										// }
										return checkForForeignUserLock(oResponse).then(resolve, reject);
									} else {
										handleError(MessageUtils.operations.editEntity, reject, oResponse, oResponse);
									}
								}
							);
					}
				);
			}

			// This method implements main functionality of  editEntity (see below). Only busy handling is not done in this function.
			fnEditEntityImpl = function(bUnconditional) {
				var bIsDraftEnabled = oCommonUtils.isDraftEnabled();
				if (bIsDraftEnabled && !bUnconditional) {
					// In this case we must ensure that a non-locking draft of another user is not overwritten without notice.
					// There are two strategies for that:
					// - First read the draft administrative data in order to check for this information
					// - Call backend to create draft in a mode where every draft of another user is consideres as a lock
					// The second possibility is preferred. However it is only suitable when the OData Service supports this mode (called preserveChange-mode)
					var oDraftContext = oServices.oDraftController.getDraftContext();
					var oComponent = oController.getOwnerComponent();
					var oBindingContext = oComponent.getBindingContext();
					var bPreserveChanges = oDraftContext.hasPreserveChanges(oBindingContext);
					if (!bPreserveChanges) { // Must use strategy 1 -> first check for Foreign user locks then start editing
						return checkForForeignUserLock().then(fnCallEdit.bind(null, true, true));
					}
				}
				// In non-draft case and in draft cases with strategy 2 call edit functionality directly
				return fnCallEdit(bIsDraftEnabled, bUnconditional, {});
			};

			// This method is called when a user starts to edit the active entity.
			// This method deals with busy handling and sensing error messages, but not with other dialogs.
			// Parameter bUnconditional specifies whether the user has already confirmed that he is willing to overwrite other users non-locking drafts.
			// The method returns a promise.
			// The promise is rejected when the user must not edit the object (which may be caused by tecnical or semantical problems).
			// In this case error handling has been performed by this method.
			// The promise is resolved to an object with property 'draftAdministrativeData' when there exists a non-locking draft of another user (this can only be the case when bUnconditional is false)
			// In this case this property contains the draft administrative data of the non-locking draft.
			// The promise is resolved to an object with property 'context' when the editing can start.
			// In this case this property contains the context of the entity to e edited.
			function editEntity(bUnconditional) {
				if (oBusyHelper.isBusy()) {
					return oRejectedPromise;
				}
				var oRet = fnEditEntityImpl(bUnconditional);
				oBusyHelper.setBusy(oRet);
				return oRet;
			}

			/*
			 * Deletes current OData entity. The entity can either be a
			 * non-draft document or a draft document. *
			 *
			 * @param {boolean}
			 *          bDeleteDraftForActiveEntity Can be set to
			 *          <code>true</code> in order to delete the draft entity,
			 *          although the current binding context belongs to the
			 *          active entity
			 * @returns {Promise} A <code>Promise</code> for asynchronous
			 *          execution
			 * @public
			 */
			function deleteEntity(bDeleteDraftForActiveEntity, bNoMessageToast) {
				if (oBusyHelper.isBusy()) {
					return oRejectedPromise;
				}
				var oContext = oController.getView().getBindingContext();
				var bIsActiveEntity = oServices.oDraftController.isActiveEntity(oContext);
				var bHasActiveEntity = oServices.oDraftController.hasActiveEntity(oContext);

				var oRet =  new Promise(
					function(resolve, reject) {
						var fnError = function(oError) {
							oController.getOwnerComponent().getComponentContainer().bindElement(oContext.getPath());
							return handleError(MessageUtils.operations.deleteEntity, reject, oError);
						};
						if (bIsActiveEntity && bDeleteDraftForActiveEntity) {
							// Current context is the active document. But we have to
							// delete the draft of this active document.
							oServices.oDraftController.getDraftForActiveEntity(oContext).then(
								function(oResponse) {
									oServices.oTransactionController.deleteEntity(oResponse.context).then(
										function() {
											if (!bNoMessageToast) {
												oServices.oApplication.showMessageToast(oCommonUtils.getText("ST_GENERIC_DRAFT_WITH_ACTIVE_DOCUMENT_DELETED"));
											}
											return resolve();
										});
								}, fnError);
						} else {
							oServices.oTransactionController.deleteEntity(oContext).then(
								function() {
									var sEntitySet = ModelUtil.getEntitySetFromContext(oContext);
									var oDraftContext = oServices.oDraftController.getDraftContext();
									var bRoot = oDraftContext.isDraftRoot(sEntitySet);
									var sMessageText = oCommonUtils.getText("ST_GENERIC_OBJECT_DELETED");

									// replace the message only for the root.
									if (!bIsActiveEntity && bRoot) {
										sMessageText = oCommonUtils.getText(bHasActiveEntity ? "ST_GENERIC_DRAFT_WITH_ACTIVE_DOCUMENT_DELETED" :
											"ST_GENERIC_DRAFT_WITHOUT_ACTIVE_DOCUMENT_DELETED");
									}
									if (!bNoMessageToast) {
										oServices.oApplication.showMessageToast(sMessageText);
									}
									return resolve();
								},
								fnError);
						}
					}
				);
				oBusyHelper.setBusy(oRet);
				return oRet;
			}

			/**
			 * Deletes current OData entity. The entity can either be a non-draft document or a draft document. *
			 *
			 * @param {array} aPath Binding contexts or paths (strings) which identify the entities
			 * @returns {Promise} A <code>Promise</code> that receives an array with the responses of the delete requests
			 * @public
			 */
			function deleteEntities(aPath) {

				return new Promise(function(resolve, reject) {
					oServices.oTransactionController.deleteEntities(aPath).then(
						function(aDeleteResults) {
							var aFailedPath = []; // Failed paths
							var aODataMessage = sap.ui.getCore().getMessageManager().getMessageModel().getData(); // OData error messages

							// Find the failed entity paths by comparing aPath and the paths from the OData error messages
							for (var i = 0; i < aODataMessage.length; i++) {
								var sMessageObjectPath = aODataMessage[i].getTarget(); // entity path

								for (var j = 0; j < aPath.length; j++) {
									if (sMessageObjectPath.indexOf(aPath[j]) > -1 /*&& aFailedPath.indexOf(sMessageObjectPath) === -1*/ ) { // match entity path
										aFailedPath.push(sMessageObjectPath);
										break;
									}
								}
							}
							return resolve(aFailedPath);
						},
						function(oError) {
							return reject(oError);
						}
					);
				});
			}

			/*
			 * Saves current OData entity. Only used in non-draft scenario.
			 *
			 * @returns {Promise} A <code>Promise</code> for asynchronous execution
			 * @public
			 */
			function saveEntity() {
				if (oBusyHelper.isBusy()) {
					return oRejectedPromise;
				}
				var oRet = new Promise(function(resolve, reject) {
					oServices.oTransactionController.triggerSubmitChanges().then(function(oResponse) {
						handleSuccess();
						return resolve(oResponse.context);
					}, handleError.bind(null, MessageUtils.operations.saveEntity, reject));
				});
				oBusyHelper.setBusy(oRet);
				return oRet;
			}

			/*
			 * Activates a draft OData entity. Only the root entity can be activated.
			 *
			 * @returns {Promise} A <code>Promise</code> for asynchronous execution
			 * @public
			 */
			function activateDraftEntity() {
				if (oBusyHelper.isBusy()) {
					return oRejectedPromise;
				}
				var oRet =  new Promise(function(resolve, reject) {
					oServices.oDraftController.activateDraftEntity(oController.getView().getBindingContext()).then(function(oResponse) {
						var oComponent = oController.getOwnerComponent();
						var oComponentContainer = oComponent.getComponentContainer();
						var sPath = oResponse.context.getPath();
						function fnRebind() {
							oComponentContainer.unbindElement();
							oComponentUtils.rebindHeaderData(sPath);
						}
						var aExpand = oComponent.getComponentData().preprocessorsData.rootContextExpand;
						if (aExpand) {
							oController.getView().getModel().read( sPath, {
								urlParameters: {
									"$select" : aExpand.join(","),
									"$expand": aExpand.join(",")
								},
								success: fnRebind,
								error: fnRebind
							});
						} else {
							fnRebind();
						}
						handleSuccess();
						return resolve(oResponse);
					}, handleError.bind(null, MessageUtils.operations.activateDraftEntity, reject));
				});
				oBusyHelper.setBusy(oRet);
				return oRet;
			}

			/*
			 * Calls an OData action (also called OData function import). Afterwards the message handling
			 * is triggered for the returned messages.
			 *
			 * @param {object} mParameters Parameters which are used to identify and fire action
			 * @param {array} mParameters.contexts Contexts relevant for action
			 * @param {string} mParameters.functionImportPath Path to the OData function import
			 * @param {object} [mParameters.sourceControl] Control where a navigation starts (e.g. table)
			 * @param {object} [mParameters.navigationProperty] Property to navigate after action
			 * @param {string} [mParameters.label] Text for the confirmation popup
			 *
			 * @returns {Promise} A Promise that resolves if the action has been executed successfully
			 *
			 * @public
			 */
			function callAction(mParameters, oState) {
				if (oBusyHelper.isBusy()) {
					return oRejectedPromise;
				}

				var sFunctionImportPath = mParameters.functionImportPath;
				var aCurrentContexts = mParameters.contexts;
				var oSourceControl = mParameters.sourceControl;
				var sFunctionImportLabel = mParameters.label;
				var sNavigationProperty = mParameters.navigationProperty;
				var sOperationGrouping = mParameters.operationGrouping;

				var oActionProcessor = new ActionUtil({
					controller: oController,
					contexts: aCurrentContexts,
					applicationController: oServices.oApplicationController,
					operationGrouping : sOperationGrouping
				});

				var fnObjectPageExistsForEntitySet = function(oPage, sEntitySet) {
					if (oPage.pages) {
						for (var i in oPage.pages) {
							var oSubPage = oPage.pages[i];
							if (oSubPage.component.list != true && oSubPage.entitySet === sEntitySet) {
								return true;
							} else {
								var bResult = fnObjectPageExistsForEntitySet(oSubPage, sEntitySet);
								if (bResult) {
									return true;
								}
							}
						}
					}
					return false;
				};

				var fnNavigationAllowed = function(oComponent, oResponseContext) {
					var oConfig = oComponent.getAppComponent().getConfig();
					if (oResponseContext && oResponseContext.sPath) {
						var sResponseEntitySet = oResponseContext.sPath.split("(")[0].replace("/", "");
						return fnObjectPageExistsForEntitySet(oConfig.pages[0], sResponseEntitySet);
					}
					return false;
				};

				var fnActionCallResolve = function(aResponses) {
					var oResponse, oResponseContext, oComponent, bNavigationAllowed;

					if (jQuery.isArray(aResponses) && aResponses.length === 1) {
						// only one context, handle as single action call
						oResponse = aResponses[0];
					} else {
						oResponse = {
								response: {
									context: aResponses.context
								}
						};
					}
					oResponseContext = oResponse.response && oResponse.response.context;

					oComponent = oController.getOwnerComponent();

					bNavigationAllowed = fnNavigationAllowed(oComponent, oResponseContext);

					if (bNavigationAllowed && oResponseContext && oResponseContext !== oResponse.actionContext && oResponseContext.getPath() !== "/undefined") {
						if (oSourceControl) {
							oCommonUtils.navigateFromListItem(oResponseContext, oSourceControl);
						} else {
							oServices.oNavigationController.navigateToContext(oResponseContext, sNavigationProperty, false);
						}
					}
					
					
					// -> part of method onSelectionChange in each controller
					if (aResponses.length > 0) {
							var oTableBinding = oCommonUtils.getTableBinding(oSourceControl);
							var oListBinding = oTableBinding && oTableBinding.binding;
							if (oListBinding && oListBinding.oEntityType) {
								 // update the enablement of toolbar buttons
								oCommonUtils.setEnabledToolbarButtons(oSourceControl);
								
								// update the enablement of footer button if on the List Report
								var oComponentContainer = oComponent.getComponentContainer();
								var oSettings = oComponentContainer && oComponentContainer.getSettings();
								var oRouteConfig = oSettings && oSettings.routeConfig;
								if (oRouteConfig) {
									if (sap.suite.ui.generic.template.js.AnnotationHelper.isListReportTemplate(oRouteConfig)) { // check if on List Report
										oCommonUtils.setEnabledFooterButtons(oSourceControl, oController);
									}
								}
							}
					}
					
					return aResponses;
				};

				var fnActionCallReject = function(oError) {
					if (jQuery.isArray(oError)) {
						if (oError.length === 1) {
							oError = oError[0].error;
						} else {
							oError = null;
						}
					}
					var mErrorParameters = {
							context: aCurrentContexts
					};
					handleError(MessageUtils.operations.callAction, null, oError, mErrorParameters);
				};

				var oRet = oActionProcessor.call(sFunctionImportPath, sFunctionImportLabel).then(fnActionCallResolve, fnActionCallReject);
				oBusyHelper.setBusy(oRet);
				return oRet;
			}

			/*
			 * Adds an entry to a table.
			 *
			 * @param {sap.ui.table.Table|sap.m.Table|sap.ui.comp.smarttable.SmartTable} oTable The table to which an entry has been added
			 */
			function addEntry(oTable) {

				if (!oTable) {
					throw new Error("Unknown Table");
				}

				var sBindingPath = "";
				var sTableBindingPath = "";
				var sEntitySet = oController.getOwnerComponent().getEntitySet();
				var oEntityType, oEntitySet, oNavigationEnd, oMetaModel;
				var oView = oController.getView();
				var oModel = oView.getModel();

				var oViewContext = oView.getBindingContext();
				if (oViewContext) {
					// Detail screen
					sTableBindingPath = oCommonUtils.getTableBinding(oTable).path;

					// get entityset of navigation property
					oMetaModel = oModel.getMetaModel();
					oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
					oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
					oNavigationEnd = oMetaModel.getODataAssociationSetEnd(oEntityType, sTableBindingPath);
					if (oNavigationEnd) {
						sEntitySet = oNavigationEnd.entitySet;
					}

					// create binding path
					sTableBindingPath = "/" + sTableBindingPath;
					sBindingPath = oViewContext.getPath() + sTableBindingPath;
				} else {
					// on list, support only one entityset mapped to the root component
					sBindingPath = "/" + sEntitySet;
				}

				var oCreatePromise = CRUDHelper.create(oServices.oDraftController, sEntitySet, sBindingPath, oModel, oServices.oApplication.setEditableNDC);
				oServices.oApplication.getBusyHelper().setBusy(oCreatePromise);
				
				return oCreatePromise.then(
						function(oContext){
							return {
								newContext: oContext,
								tableBindingPath: sTableBindingPath
							};
						},
						handleError.bind(null, MessageUtils.operations.addEntry, function(oError){throw oError;})
				);
			}

			/* eslint-disable */
			var handleError = testableHelper.testable(handleError, "handleError");
			/* eslint-enable */

			return {
				editEntity: editEntity,
				deleteEntity: deleteEntity,
				deleteEntities: deleteEntities,
				saveEntity: saveEntity,
				activateDraftEntity: activateDraftEntity,
				callAction: callAction,
				addEntry: addEntry
			};
		}

		return BaseObject.extend(
			"sap.suite.ui.generic.template.lib.CRUDManager.js", {
				constructor: function(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper) {
					jQuery.extend(this, getMethods(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper));
				}
			});
	});
