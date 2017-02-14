sap.ui
	.define(["jquery.sap.global", "sap/ui/core/mvc/View", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel",
			"sap/suite/ui/generic/template/lib/TemplateViewController",
			"sap/suite/ui/generic/template/lib/TemplateComponent", "sap/suite/ui/generic/template/lib/Application",
			"sap/suite/ui/generic/template/lib/CRUDManager", "sap/suite/ui/generic/template/lib/CommonUtils",
			"sap/suite/ui/generic/template/lib/ComponentUtils", "sap/suite/ui/generic/template/lib/CommonEventHandlers",
			"sap/suite/ui/generic/template/lib/ViewDependencyHelper", "sap/suite/ui/generic/template/lib/testableHelper"
		],
		function(jQuery, View, JSONModel, ResourceModel, TemplateViewController, TemplateComponent, Application, CRUDManager, CommonUtils,
			ComponentUtils, CommonEventHandlers, ViewDependencyHelper, testableHelper) {
			"use strict";

			var fnAppInit; // used for temporary storage

			var mAppRegistry = {};
			var mControllerRegistry = {};

			var oRB; // initialized on demand
			function getText() {
				oRB = oRB || new ResourceModel({
					bundleName: "sap/suite/ui/generic/template/lib/i18n/i18n"
				}).getResourceBundle();
				return oRB.getText.apply(oRB, arguments);
			}

			function getAppRegistryEntry(oAppComponent) {
				var sId = oAppComponent.getId();
				var oRet = mAppRegistry[sId];
				return oRet;
			}

			function getComponentRegistryEntry(oComponent) {
				return getAppRegistryEntry(oComponent.getAppComponent()).oTemplateContract.componentRegistry[oComponent.getId()];
			}

			function fnFindView(oControl) {
				while (oControl && !(oControl instanceof View)) {
					oControl = oControl.getParent();
				}
				return oControl;
			}

			function fnGetComponentRegistryEntryForControl(oControl) {
				while (oControl) {
					var oView = fnFindView(oControl);
					var oController = oView && oView.getController();
					var oComponent = oController && oController.getOwnerComponent();
					if (oComponent instanceof TemplateComponent) {
						var oComponentRegistryEntry = getComponentRegistryEntry(oComponent);
						return oComponentRegistryEntry;
					} else {
						oControl = oComponent && oComponent.oContainer;
					}
				}
			}

			function getTemplateViewController(getMethods, sControllerName, oControllerDefinition, oTemplateUtils, oAppRegistryEntry) {
				oControllerDefinition = oControllerDefinition || {};

				oControllerDefinition.constructor = function() {
					TemplateViewController.prototype.constructor.apply(this, arguments);
					var oMethods = getMethods(oTemplateUtils, this);
					this._templateEventHandlers = Object.freeze(oMethods.handlers || {});
					this._templateFormatters = Object.freeze(oMethods.formatters || {});
					this.extensionAPI = Object.freeze(oMethods.extensionAPI || {});
					this.fnGenericOnInit = function(oController) {
						var oView = oController.getView();
						var sId = oView.getId();
						jQuery.sap.log.info("Init view " + sId + " of template " + sControllerName);
						var oComponent = oController.getOwnerComponent();
						var oComponentRegistryEntry = getComponentRegistryEntry(oComponent);
						mControllerRegistry[sId] = {
							onExit: oMethods.onExit || jQuery.noop,
							oTemplateUtils: oTemplateUtils,
							oAppRegistryEntry: oAppRegistryEntry
						};
						oTemplateUtils.oServices.oApplicationController.registerView(oView);
						oTemplateUtils.oCommonUtils = new CommonUtils(oController, oTemplateUtils.oServices, oTemplateUtils.oComponentUtils);
						oTemplateUtils.oServices.oCRUDManager = new CRUDManager(oController,
							oTemplateUtils.oComponentUtils, oTemplateUtils.oServices, oTemplateUtils.oCommonUtils, oAppRegistryEntry.oTemplateContract.oBusyHelper
						);
						oTemplateUtils.oCommonEventHandlers = new CommonEventHandlers(oController,
							oTemplateUtils.oComponentUtils, oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
						oView.addStyleClass(oTemplateUtils.oCommonUtils.getContentDensityClass());
						(oMethods.onInit || jQuery.noop)();
						// Note: This relies on the fact, that there is a 1-1 relationship between TemplateView and
						// TemplateComponent.
						// If we introduce Templates using more then one view, this must be reworked.
						oComponentRegistryEntry.oController = this;
						oComponentRegistryEntry.fnViewRegisteredResolve();
						delete oComponentRegistryEntry.fnViewRegisteredResolve;
					};
				};

				oControllerDefinition.onInit = function() {
					this.fnGenericOnInit(this);
					delete this.fnGenericOnInit;
				};
				oControllerDefinition.onExit = function() {
					var sViewId = this.getView().getId();
					var oControllerRegistryEntry = mControllerRegistry[sViewId];
					oControllerRegistryEntry.oAppRegistryEntry.oTemplateContract.oApplicationProxy.destroyView(sViewId);
					oControllerRegistryEntry.onExit();
					delete mControllerRegistry[sViewId];
					jQuery.sap.log.info("View " + sViewId + " of template " + sControllerName + " exited");
				};

				return TemplateViewController.extend(sControllerName, oControllerDefinition);
			}

			function fnGetViewControllerCreator(oComponentRegistryEntry) {
				var oControllerSpecification = oComponentRegistryEntry.methods.oControllerSpecification;
				return oControllerSpecification && function(){
					var oAppComponent = oComponentRegistryEntry.oComponent.getAppComponent();
					var oAppRegistryEntry = getAppRegistryEntry(oAppComponent);
					var oTransactionController = oAppComponent.getTransactionController();					
					var oTemplateUtils = {
						oComponentUtils: oComponentRegistryEntry.utils,
						oServices: {
							oTemplateCapabilities: {}, // Templates will add their capabilities which are used by the framework into this object
							oApplicationController: oAppComponent.getApplicationController(),
							oTransactionController: oTransactionController,
							oNavigationController: oAppComponent.getNavigationController(),
							oDraftController: oTransactionController.getDraftController(),
							oApplication: oAppRegistryEntry.application,
							oViewDependencyHelper: oAppRegistryEntry.oViewDependencyHelper
						}
					};
					return getTemplateViewController(oControllerSpecification.getMethods, oComponentRegistryEntry.oComponent.getTemplateName(), oControllerSpecification.oControllerDefinition, oTemplateUtils, oAppRegistryEntry);
				};
			}

			return {
				getTemplateComponent: function(getMethods, sComponentName, oComponentDefinition) {
					oComponentDefinition = oComponentDefinition || {};

					oComponentDefinition.init = function() {
						var oComponentRegistryEntry = this.getComponentData().registryEntry;
						var oViewRegisteredPromise = new Promise(function(fnResolve) {
							oComponentRegistryEntry.fnViewRegisteredResolve = fnResolve;
						});
						(TemplateComponent.prototype.init || jQuery.noop).apply(this, arguments);
						oComponentRegistryEntry.componentName = sComponentName;
						oComponentRegistryEntry.oComponent = this;
						oComponentRegistryEntry.activationTakt = 0;
						oComponentRegistryEntry.utils = new ComponentUtils(this, oComponentRegistryEntry);
						oComponentRegistryEntry.methods = getMethods(this, oComponentRegistryEntry.utils) || {};
						oComponentRegistryEntry.viewRegisterd = oViewRegisteredPromise;
						oComponentRegistryEntry.oGenericData = {
							mRefreshInfos: {}
						};
						(oComponentRegistryEntry.methods.init || jQuery.noop)();
					};

					oComponentDefinition.exit = function() {
						var sId = this.getId();
						var oComponentRegistryEntry = getComponentRegistryEntry(this);
						var oAppRegistryEntry = getAppRegistryEntry(this.getAppComponent());
						var oMethods = oComponentRegistryEntry.methods;
						(oMethods.exit || jQuery.noop)();
						delete oAppRegistryEntry.oTemplateContract.componentRegistry[sId];
						(TemplateComponent.prototype.exit || jQuery.noop).apply(this, arguments);
					};

					oComponentDefinition.onBeforeRendering = function() {
						var oComponentRegistryEntry = getComponentRegistryEntry(this);
						(TemplateComponent.prototype.onBeforeRendering || jQuery.noop).bind(this, oComponentRegistryEntry).apply(this, arguments);
						var oMethods = oComponentRegistryEntry.methods;
						(oMethods.onBeforeRendering || jQuery.noop)();
					};

					oComponentDefinition.onActivate = function(sBindingPath, bIsComponentCurrentlyActive) {
						var oComponentRegistryEntry = getComponentRegistryEntry(this);
						oComponentRegistryEntry.sCurrentBindingPath = sBindingPath;
						var fnActivate = function() {
							oComponentRegistryEntry.utils.bindComponent(oComponentRegistryEntry.sCurrentBindingPath, bIsComponentCurrentlyActive);
							var bUnconditionalRefresh = this.getIsRefreshRequired();
							if (bUnconditionalRefresh || !jQuery.isEmptyObject(oComponentRegistryEntry.oGenericData.mRefreshInfos)) {
								(oComponentRegistryEntry.methods.refreshBinding || jQuery.noop)(bUnconditionalRefresh,
									bUnconditionalRefresh ? {} :
									oComponentRegistryEntry.oGenericData.mRefreshInfos);
								this.setIsRefreshRequired(false);
								oComponentRegistryEntry.oGenericData.mRefreshInfos = {};
							}
							return (oComponentRegistryEntry.methods.onActivate || jQuery.noop)(sBindingPath);
						}.bind(this);
						// If view is not registered yet ( == oComponentRegistryEntry.fnViewRegisteredResolve still available) perform fnActivate asyncronously, otherwise synchronosly
						return oComponentRegistryEntry.fnViewRegisteredResolve ? oComponentRegistryEntry.viewRegisterd.then(fnActivate) : (fnActivate() || Promise.resolve());
					};

					oComponentDefinition.setContainer = function() {
						TemplateComponent.prototype.setContainer.apply(this, arguments);
						var sId = this.getId();
						var oAppComponent = this.getAppComponent();
						var oAppRegistryEntry = getAppRegistryEntry(oAppComponent);

						if (!oAppRegistryEntry.oTemplateContract.componentRegistry[sId]) {
							var oComponentRegistryEntry = this.getComponentData().registryEntry;
							oComponentRegistryEntry.componentCreateResolve(this);
							delete oComponentRegistryEntry.componentCreateResolve;
							oAppRegistryEntry.oTemplateContract.componentRegistry[sId] = oComponentRegistryEntry;

							oAppRegistryEntry.oTemplateContract.oBusyHelper.setBusy(oComponentRegistryEntry.viewRegisterd, true);
							oComponentRegistryEntry.oApplication = oAppRegistryEntry.application;
							oComponentRegistryEntry.createViewController = fnGetViewControllerCreator(oComponentRegistryEntry);
							(oComponentRegistryEntry.methods.setContainer || jQuery.noop)();
						}
					};

					oComponentDefinition.onDeactivate = jQuery.noop;

					return TemplateComponent.extend(sComponentName, oComponentDefinition);
				},

				getAppComponent: function(getMethods, baseClass, sAppComponentName, oComponentDefinition) {
					oComponentDefinition = oComponentDefinition || {};

					oComponentDefinition.constructor = function() {
						var oAppId = testableHelper.startApp(); // suppress access to private methods in productive coding
						var oAppRegistryEntry = {
							appId: oAppId,
							appComponent: this,
							oTemplateContract: {
								componentRegistry: {},
								getText: getText,
								mRouteToTemplateComponentPromise: {},
								oTemplatePrivateGlobalModel: new JSONModel(),
								aStateChangers: []
							}
						};

						oAppRegistryEntry.oTemplateContract.oTemplatePrivateGlobalModel.setDefaultBindingMode("TwoWay");
						oAppRegistryEntry.application = new Application(oAppRegistryEntry.oTemplateContract);
						oAppRegistryEntry.methods = getMethods(this, oAppRegistryEntry.oTemplateContract);
						oAppRegistryEntry.oViewDependencyHelper = new ViewDependencyHelper(oAppRegistryEntry.oTemplateContract);

						var oPublicMethods = jQuery.extend({}, oAppRegistryEntry.methods.publicMethods);
						delete oPublicMethods.init;
						delete oPublicMethods.exit;
						jQuery.extend(this, oPublicMethods);
						var oShellServiceFactory = sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.ShellUIService");
						var oShellServicePromise = oShellServiceFactory && oShellServiceFactory.createInstance();
						oAppRegistryEntry.oTemplateContract.oNoOwnTitlePromise = oShellServicePromise ? oShellServicePromise.then(function(oService) {
							oAppRegistryEntry.oTemplateContract.oShellService = oService;
							return oService.getUxdVersion() === 2;
						}) : Promise.resolve(false);
						fnAppInit = oAppRegistryEntry.methods.init || jQuery.noop;
						(baseClass.prototype.constructor || jQuery.noop).apply(this, arguments);
						oAppRegistryEntry.oTemplateContract.oBusyHelper.setBusy(oAppRegistryEntry.oTemplateContract.oNoOwnTitlePromise);
						mAppRegistry[this.getId()] = oAppRegistryEntry;
					};

					oComponentDefinition.init = function() {
						(baseClass.prototype.init || jQuery.noop).apply(this, arguments);
						fnAppInit();
						fnAppInit = null;
					};

					oComponentDefinition.exit = function() {
						var oRegistryEntry = getAppRegistryEntry(this);
						(oRegistryEntry.methods.exit || jQuery.noop)();
						(baseClass.prototype.exit || jQuery.noop).apply(this, arguments);
						delete mAppRegistry[this.getId()];
						testableHelper.endApp(oRegistryEntry.appId); // end of productive App
					};

					return baseClass.extend(sAppComponentName, oComponentDefinition);
				},

				getExtensionAPIPromise: function(oControl) {
					var oComponentRegistryEntry = fnGetComponentRegistryEntryForControl(oControl);
					if (!oComponentRegistryEntry) {
						return Promise.reject();
					}
					return oComponentRegistryEntry.viewRegisterd.then(function() {
						return oComponentRegistryEntry.oController.extensionAPI;
					});
				},

				getExtensionAPI: function(oControl) {
					var oComponentRegistryEntry = fnGetComponentRegistryEntryForControl(oControl);
					return oComponentRegistryEntry && oComponentRegistryEntry.oController && oComponentRegistryEntry.oController.extensionAPI;
				}
			};
		});
		