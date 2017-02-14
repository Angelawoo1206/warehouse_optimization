sap.ui.define(["sap/m/DraftIndicatorState", "sap/suite/ui/generic/template/lib/TemplateAssembler",
	"sap/suite/ui/generic/template/lib/TemplateComponent", "sap/suite/ui/generic/template/ObjectPage/controller/ControllerImplementation"
], function(DraftIndicatorState, TemplateAssembler, TemplateComponent, ControllerImplementation) {
	"use strict";

	function getMethods(oComponent, oComponentUtils) {
		var oViewProxy = {};

		// helper functions
		function fnBindBreadCrumbs() {
			if (!oViewProxy.bindBreadCrumbs) {
				return;
			}
			var oRouter = oComponent.getRouter();
			var sPath = oRouter && oRouter.oHashChanger && oRouter.oHashChanger.getHash();

			if (!sPath) {
				return;
			}

			// remove query part if there's one
			sPath = sPath.split("?")[0];
			var aSections = sPath.split("/");

			if (aSections[0] === "" || aSections[0] === "#") {
				// Path started with a / - remove first section
				aSections.splice(0, 1);
			}

			// remove the last one - this is the current shown section
			aSections.pop();

			oViewProxy.bindBreadCrumbs(aSections);
		}

		return {
			oControllerSpecification: {
				getMethods: ControllerImplementation.getMethods.bind(null, oViewProxy),
				oControllerDefinition: {
					// ---------------------------------------------
					// Extensions
					// ---------------------------------------------
					onBeforeRebindTableExtension: function(oEvent) {}
				}
			},
			init: function(){
				var oTemplatePrivateModel = oComponentUtils.getTemplatePrivateModel();
				oTemplatePrivateModel.setProperty("/objectPage", {
					displayMode: 0 // 0 = unknown, 1 = display, 2 = edit, 4 = add, 6 = change (edit or add)
				});
			},
			onActivate: function(sBindingPath) {
				// preliminary: in draft case maybe on first time property is not set
				var oUIModel = oComponent.getModel("ui");
				var oTemplatePrivateModel = oComponentUtils.getTemplatePrivateModel();
				if (oComponentUtils.getEditableNDC()) {
					oUIModel.setProperty("/editable", true);
					var bCreateMode = oComponentUtils.getCreateMode();
					oUIModel.setProperty("/createMode", bCreateMode);
					oTemplatePrivateModel.setProperty("/objectPage/displayMode", bCreateMode ? 4 : 2);
				} else if (!oViewProxy.isDraftEnabled()) {
					oUIModel.setProperty("/editable", false);
					oUIModel.setProperty("/createMode", false);
					oTemplatePrivateModel.setProperty("/objectPage/displayMode", 1);
				}
				oViewProxy.onComponentActivate(sBindingPath);
			},
			refreshBinding: function(bUnconditional, mRefreshInfos) {
				// default implementation: refresh element binding
				if (bUnconditional) {
					var oElementBinding = oComponent.getComponentContainer().getElementBinding();
					if (oElementBinding) {
						oElementBinding.refresh(true);
					}
				} else {
					oViewProxy.refreshFacets(mRefreshInfos);
				}
			},
			presetDisplayMode: function(iDisplayMode, bIsAlreadyDisplayed){
				if (bIsAlreadyDisplayed){
					return; // wait for the data to come for the case that the view is already displayed
				}
				var oTemplateModel = oComponentUtils.getTemplatePrivateModel();
				oTemplateModel.setProperty("/objectPage/displayMode", iDisplayMode);
			},			
			updateBindingContext: function() {

				var oBindingContext = oComponent.getBindingContext();
				if (oBindingContext) {

					var oTemplatePrivateModel = oComponentUtils.getTemplatePrivateModel();

					// set draft status to blank according to UI decision
					oTemplatePrivateModel.setProperty("/generic/draftIndicatorState", DraftIndicatorState.Clear);

					//call the rebindTable explicitly since the smart table enableAutoBinding=true 
					//didn't trigger GET of 1:n all cases
					oViewProxy.refreshFacets(null, true);
					
					var oActiveEntity = oBindingContext.getObject();
					if (oActiveEntity) {
						var oUIModel = oComponent.getModel("ui");
						var oDraftController = oComponent.getAppComponent().getTransactionController().getDraftController();
						var oDraftContext = oDraftController.getDraftContext();
						var bIsDraft = oDraftContext.hasDraft(oBindingContext) && !oActiveEntity.IsActiveEntity;
						var bHasActiveEntity = oActiveEntity.HasActiveEntity;
						if (oComponentUtils.getCreateMode()) {
							oUIModel.setProperty("/createMode", true);
							oUIModel.setProperty("/editable", true);
							oUIModel.setProperty("/enabled", true);
							oTemplatePrivateModel.setProperty("/objectPage/displayMode", 4);
						} else if (bIsDraft) {
							oUIModel.setProperty("/editable", true);
							oUIModel.setProperty("/enabled", true);
							if (bHasActiveEntity) {
								oUIModel.setProperty("/createMode", false);
								oTemplatePrivateModel.setProperty("/objectPage/displayMode", 2);
							} else {
								oUIModel.setProperty("/createMode", true);
								oTemplatePrivateModel.setProperty("/objectPage/displayMode", 4);
							}
						} else {
							oUIModel.setProperty("/createMode", false);
							var bIsEditable = oComponentUtils.getEditableNDC();
							oUIModel.setProperty("/editable", bIsEditable);
							oTemplatePrivateModel.setProperty("/objectPage/displayMode", bIsEditable ? 2 : 1);
							if (oActiveEntity.hasOwnProperty("HasDraftEntity") && oActiveEntity.HasDraftEntity &&
								oDraftContext.hasSiblingEntity(oComponent.getEntitySet())) {
								oUIModel.setProperty("/enabled", false);
								var oModel = oComponent.getModel();
								var oReadDraftInfoPromise = new Promise(function(fnResolve, fnReject) {
									oModel.read(
										oBindingContext.getPath(), {
											urlParameters: {
												"$expand": "SiblingEntity,DraftAdministrativeData"
											},
											success: fnResolve,
											error: fnReject
										});
								});
								var oBusyHelper = oComponentUtils.getBusyHelper();
								oBusyHelper.setBusy(oReadDraftInfoPromise);
								oReadDraftInfoPromise.then(
									function(oResponseData) {
										var oSiblingContext = oModel.getContext(
											"/" + oModel.getKey(oResponseData.SiblingEntity));
										if (oSiblingContext) {
											oViewProxy.draftResume(oSiblingContext, oActiveEntity,
												oResponseData.DraftAdministrativeData);
										}
										// enable the buttons
										oUIModel.setProperty("/enabled", true);
									},
									function(oError) {
										// open: error handling
									}
								);
							} else {
								// enable the buttons
								oUIModel.setProperty("/enabled", true);
							}
						}
					}
					fnBindBreadCrumbs();
				}
			}
		};
	}

	return TemplateAssembler.getTemplateComponent(getMethods,
		"sap.suite.ui.generic.template.ObjectPage.Component", {

			metadata: {
				library: "sap.suite.ui.generic.template",
				properties: {
					// reference to smart template
					"templateName": {
						"type": "string",
						"defaultValue": "sap.suite.ui.generic.template.ObjectPage.view.Details"
					},
					// shall button "Related Apps" be visible on the object page?
					"showRelatedApps": {
						"type": "boolean",
						"defaultValue": "false"
					},
					// shall it be possible to edit the contents of the header?
					"editableHeaderContent": {
						"type": "boolean",
						"defaultValue": "false"
					},
					"gridTable": "boolean",
					"sections": "object"
				},
				// app descriptor format
				"manifest": "json"
			}
		});
});