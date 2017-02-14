/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// ----------------------------------------------------------------------------------
// Provides base class sap.suite.ui.generic.template.lib.AppComponent for all generic app components
// ----------------------------------------------------------------------------------
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/UIComponent", "sap/m/NavContainer", "sap/ui/generic/app/ApplicationController",
	"sap/suite/ui/generic/template/lib/BusyHelper",
	"sap/suite/ui/generic/template/lib/NavigationController",
	"sap/suite/ui/generic/template/lib/TemplateAssembler",
	"sap/m/MessageBox",
	"sap/suite/ui/generic/template/lib/CRUDHelper",
	"sap/m/DraftIndicatorState",
	"sap/suite/ui/generic/template/library"
], function(jQuery, UIComponent, NavContainer, ApplicationController, BusyHelper, NavigationController, TemplateAssembler, MessageBox, CRUDHelper, DraftIndicatorState) {
	"use strict";

	function getMethods(oAppComponent, oTemplateContract) {

		var oApplicationController;
		var oNavigationController;

		function pagesMap2Array(input) {
			var output = Object.keys(input).map(function(key) {
				var page = input[key];
				//add the key to the array for reference
				//page["id"] = key;
				//Recursive call for nested pages
				if (page.pages) {
					page.pages = pagesMap2Array(page.pages);
				}
				return input[key];
			});
			return output;
		}

		var oConfig; // initialized on demand
		function getConfig() {
			if (!oConfig) {
				var oMeta = oAppComponent.getMetadata();
				oConfig = oMeta.getManifestEntry("sap.ui.generic.app");
				//Version 1.3.0 is made only to have a map in the app. descriptor with the runtime that accepts only pages
				//Background for the map are appdescriptor variants which are based on changes on an app. descriptor
				//Arrays don't work for changes as they do not have a stable identifier besides the position (index)
				//Once we have a runtime that accepts a map we need to increase the version to higher than 1.3.0 e.g. 1.4.0
				if (oConfig._version === "1.3.0" && oConfig.pages && jQuery.isPlainObject(oConfig.pages)) {
					oConfig.pages = pagesMap2Array(oConfig.pages);
				}
			}
			return oConfig;
		}

		var oInternalManifest;  // initialized on demand
		function getInternalManifest() {
			if (!oInternalManifest) {
				//We need to copy the original manifest due to read-only settings of the object
				oInternalManifest = jQuery.extend({}, oAppComponent.getMetadata().getManifest());
				//Overwrite the part with our app. descriptor (see getConfig)
				oInternalManifest["sap.ui.generic.app"] = getConfig();
			}
			return oInternalManifest;
		}

		function createGlobalTemplateModel(){
			oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic", {
					draftIndicatorState: DraftIndicatorState.Clear,
					hasOwnTitle: false,
					paginatorInfo: {}
			});
			oAppComponent.setModel(oTemplateContract.oTemplatePrivateGlobalModel, "_templPrivGlobal");
			oTemplateContract.oNoOwnTitlePromise.then(function(bNoOwnTitle){
				oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/hasOwnTitle", !bNoOwnTitle);	
			});
		}

		function attachToApplicationController(oApplicationController) {
			oApplicationController.attachEvent("beforeSideEffectExecution", function (oEvent) {
				if (oEvent.getParameter("valueChange") || oEvent.getParameter("fieldControl")) {
					var oPromise = oEvent.getParameter("promise");
					oTemplateContract.oBusyHelper.setBusy(oPromise);
				}
			});

			var oTemplatePrivateGlobal = oAppComponent.getModel("_templPrivGlobal");
			var sDraftIndicatorState = "/generic/draftIndicatorState";

			oApplicationController.attachBeforeQueueItemProcess(function (oEvent) {
				if (oEvent.draftSave) {
					oTemplatePrivateGlobal.setProperty(sDraftIndicatorState, DraftIndicatorState.Saving);
				}
			});
			oApplicationController.attachOnQueueCompleted(function () {
				if (oTemplatePrivateGlobal.getProperty(sDraftIndicatorState) === DraftIndicatorState.Saving) {
					oTemplatePrivateGlobal.setProperty(sDraftIndicatorState, DraftIndicatorState.Saved);
				}
			});
			oApplicationController.attachOnQueueFailed(function () {
				if (oTemplatePrivateGlobal.getProperty(sDraftIndicatorState) === DraftIndicatorState.Saving) {
					oTemplatePrivateGlobal.setProperty(sDraftIndicatorState, DraftIndicatorState.Clear);
				}
			});
		}

		function attachToModelPropertyChange(oModel){
			oModel.attachPropertyChange(function(oEvent){
				CRUDHelper.propertyChange(oEvent.getParameter("path"), oEvent.getParameter("context"), oTemplateContract, oAppComponent);
			});
		}

		return {
			init: function() {
				var oModel = oAppComponent.getModel();
				if (oModel) {
					// workaround until Modules Factory is available
					oApplicationController = new ApplicationController(oModel);
					createGlobalTemplateModel();
					oNavigationController = new NavigationController(oAppComponent, oTemplateContract);

					attachToApplicationController(oApplicationController);
					attachToModelPropertyChange(oModel);

					// Error handling for erroneous metadata request
					// TODO replace access to oModel.oMetadata with official API call when available (recheck after 03.2016)
					// TODO move error handling to central place (e.g. create new MessageUtil.js)
					if ( (!oModel.oMetadata || !oModel.oMetadata.isLoaded()) || oModel.oMetadata.isFailed()) {
						oModel.attachMetadataFailed(function() {
							oNavigationController.navigateToMessagePage({
								title: oTemplateContract.getText("ST_GENERIC_ERROR_TITLE"),
								text: oTemplateContract.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE"),
								icon: "sap-icon://message-error",
								description: oTemplateContract.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE_DESC")
							});
							/* When the application's OData service's metadata document
							 * can't be retrieved or loaded, then none of children components
							 * can load. It is therefore important to look through those components
							 * and resolve their promises to register themselves with a view. */
							for (var childComponent in oTemplateContract.componentRegistry) {
								oTemplateContract.componentRegistry[childComponent].fnViewRegisteredResolve();
							}
						});
					}
				}
				oTemplateContract.oBusyHelper.setBusyReason("initAppComponent", false);
			},
			exit: function() {
				if (oTemplateContract.oNavContainer) {
					oTemplateContract.oNavContainer.destroy();
				}
				if (oApplicationController) {
					oApplicationController.destroy();
				}
				if (oNavigationController) {
					oNavigationController.destroy();
				}
			},
			publicMethods: {
				createContent: function() {
					// Method must only be called once
					if (oTemplateContract.oNavContainer){
						return "";
					}

					oTemplateContract.oNavContainer = new NavContainer({
						id: oAppComponent.getId() + "-appContent"
					});
					oTemplateContract.oBusyHelper = new BusyHelper(oTemplateContract);
					oTemplateContract.oBusyHelper.setBusyReason("initAppComponent", true, true);
					// done
					oTemplateContract.oNavContainer.attachAfterNavigate(oTemplateContract.oApplicationProxy.onAfterNavigate);
					return oTemplateContract.oNavContainer;
				},

				getConfig: getConfig,
				getInternalManifest: getInternalManifest,

				getTransactionController: function() {
					return oApplicationController.getTransactionController();
				},

				getApplicationController: function() {
					return oApplicationController;
				},

				/*
				 * Returns the reference to the navigation controller instance that has been created by AppComponent.
				 *
				 * @returns {sap.suite.ui.generic.template.lib.NavigationController} the navigation controller instance
				 * @public
				 */
				getNavigationController: function() {
					return oNavigationController;
				}
			}
		};
	}

	var AppComponent = TemplateAssembler.getAppComponent(getMethods, UIComponent, "sap.suite.ui.generic.template.lib.AppComponent", {
		metadata: {
			config: {
				"title": "SAP UI Application Component", // TODO: This should be set from App descriptor
				fullWidth: true
			},
			events: {
				pageDataLoaded: {}
			},
			routing: {
				config: {
					routerClass: "sap.m.routing.Router",
					viewType: "XML",
					viewPath: "",
					clearTarget: false
				},
				routes: [],
				targets: []
			},
			library: "sap.suite.ui.generic.template"
		}
	});
	delete TemplateAssembler.getAppComponent; // this method is used exactly once (in order to instantiate this class)
	return AppComponent;
});