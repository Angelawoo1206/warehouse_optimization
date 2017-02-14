/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// ------------------------------------------------------------------------------------------------------------
// This class handles inner app navigation for Smart Template based apps.
// The class exposes its services in two ways:
// 1. There is a public API providing the navigation methods navigateToRoot, navigateToContext, navigateToMessagePage, and navigateBack
//    to Template developers and even Breakout developers.
// 2. A richer object oNavigationControllerProxy is created (see constructor) which is used by the core classes of the SmartTemplate framework.
//    This object allows more detailed interaction with navigation.

// Within this class we differentiate between a number of different scenarios for url-changes:
// 1. A state change is a change of the url which does not lead to a new route, but just modifies the encoding of the internal state of one view in the
//    url. Whenever a route matched event occurs it is first checked, whether this corresponds to a state change.
//    If this is true, we do not consider it as a navigation and all further handling of the url within this class is stopped. 
//    It is assumed that the state change is totally controlled by the component that has initiated the state change.
//    Note that agents might register themselves as possible state changers via sap.suite.ui.generic.template.lib.Application.registerStateChanger.
//    A new url is passed to the registered state changers one after the other (method isStateChange). If any of those returns true the processing
//    of the url is stopped.
// 2. Illegal urls: The user enters a url which belongs to this App but not to a legal route. This is not considered as a navigation. 
// 3. Back navigation: Back navigation can be triggered by the user pressing the browser-back button (then we have no control), the user pressing the
//    back button within the App, or programmatically (e.g. after cancelling an action).
// 3. Programmatic (forward) navigation: The program logic often demands the navigation to be triggerd programmatically. Such navigation is always forwarded to
//    function fnNavigate. Note that this function automatically performs a back navigation, when the navigation target is the same as the last history entry.
//    Note that it is also possible to navigate programmatically to the MessagePage. However, this does not change the url and is therefore not considered as 
// 5. Manual navigation: The user can navigate inside the running App by modifying the url manually (more probable: by selecting a bookmark/history entry
//    which leads to some other place within the App). Note that in this case the navigation may be totally uncontrolled within the App.
// ------------------------------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/base/Object", "sap/ui/core/ComponentContainer", "sap/ui/core/routing/HashChanger", "sap/ui/core/routing/History", "sap/ui/core/routing/HistoryDirection",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox", "sap/m/MessagePage", "sap/m/Link",
	"sap/suite/ui/generic/template/lib/routingHelper", "sap/suite/ui/generic/template/lib/testableHelper"
], function(BaseObject, ComponentContainer, HashChanger, History, HistoryDirection, Filter, FilterOperator, MessageBox, MessagePage, Link, routingHelper,
	testableHelper) {
	"use strict";
	
	var oHistory = History.getInstance();

	// Private static methods

	function fnTruncateHash(sHash, sMatch, iDelta) {
		var iIndex;
		if (sHash && sMatch) {
			if (isNaN(iDelta)) {
				iDelta = 0;
			}
			iIndex = sHash.indexOf(sMatch);
			if (iIndex > -1) {
				sHash = sHash.substring(0, iIndex - iDelta);
			}
		}
		return sHash;
	}

	/*
	 * Creates a new ComponentContainer with template from routing configuration
	 * @param {Object}oAppComponentg - the application component
	 * @param {Object} oRouteConfig - the route configuration
	 * @returns {sap.ui.core.ComponentContainer} instance of the component container
	 */
	function fnCreateComponentInstance(oAppComponent, oRouteConfig, fnComponentCreateResolve) {
		var sTemplate, sEntitySet, oComponentContainer, oSettings;
		sTemplate = oRouteConfig.template;
		sEntitySet = oRouteConfig.entitySet;

		oSettings = {
			appComponent: oAppComponent,
			isLeaf: !oRouteConfig.pages || !oRouteConfig.pages.length,
			subPages: oRouteConfig.pages,
			entitySet: sEntitySet,
			navigationProperty: oRouteConfig.navigationProperty,
			routeConfig: oRouteConfig,
			componentData: {
				preprocessorsData: {},
				registryEntry: {
					componentCreateResolve: fnComponentCreateResolve,
					viewLevel: oRouteConfig.viewLevel
				}
			}
		};

		if (oRouteConfig.component.settings) {
			// consider component specific settings from app descriptor
			jQuery.extend(oSettings, oRouteConfig.component.settings);
		}

		oAppComponent.runAsOwner(function() {
			try {
				oComponentContainer = new ComponentContainer({
					name: sTemplate,
					propagateModel: true,
					width: "100%",
					height: "100%",
					handleValidation: true,
					settings: oSettings
				});
			} catch (e) {
				throw new Error("Component " + sTemplate + " could not be loaded");
			}
		});
		return oComponentContainer;
	}

	// Definition of instance methods
	function getMethods(oAppComponent, oTemplateContract, oNavigationControllerProxy) {

		var sTargetContextPath = null; // this instance variable is used to transfer the context path from navigateToContext to handleRouteMatched
		
		var oNextHash = {	// this variable contains some information about the current navigation state. A new instance is created each navigation step (when the url is caught)
			iHashChangeCount: 0 // the value of this property is increased with each navigation step
		};
		
		// This method is called when all views have been set to their places
		function fnAfterActivation(){
			for (var sComponentId in oTemplateContract.componentRegistry){
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				if (oRegistryEntry.activationTakt < oNextHash.iHashChangeCount){ // component is currently not active
					oRegistryEntry.utils.suspendBinding();
				}
			}
		}
		
		// Start: navigation methods

		function fnNavigateBack(){
			oNextHash.back = true;
			window.history.back();			
		}
		
		/*
		 * Sets/Replaces the hash via the router/hash changer
		 * @param {string} sHash - the hash string
		 * @param {boolean} bReplace - whether the hash should be replaced
		 */
		function fnNavigate(sHash, bReplace) {
			sHash = sHash || ""; // normalization (to avoid an 'undefined' in the url)
			oNextHash.hash = sHash;
			if (bReplace) {
				oNavigationControllerProxy.oHashChanger.replaceHash(sHash);
			} else {
				oNavigationControllerProxy.oHashChanger.setHash(sHash);
			}
		}

		function fnNavigateToRoot(bReplace) {
			fnNavigate("", bReplace);
		}
		
		function getTargetComponentPromises(oTarget){
			var sRouteName = oTemplateContract.mEntityTree[oTarget.entitySet].sRouteName;
			var oComponentPromise = oTemplateContract.mRouteToTemplateComponentPromise[sRouteName];
			return [oComponentPromise];
		}
		
		function fnPresetDisplayMode(aTargetComponentPromises, iDisplayMode){
			var iCurrentTakt = oNextHash.iHashChangeCount;
			var fnPreset = function(oComponent){
				var oRegistryEntry = oTemplateContract.componentRegistry[oComponent.getId()];
				(oRegistryEntry.methods.presetDisplayMode || jQuery.noop)(iDisplayMode, iCurrentTakt === oRegistryEntry.activationTakt);                         
			};
			for (var i = 0; i < aTargetComponentPromises.length; i++){
				var oTargetPromise = aTargetComponentPromises[i];
				oTargetPromise.then(fnPreset);
			}
		}

		function fnNavigateToContext(vTargetContext, sNavigationProperty, bReplace, iDisplayMode) {
			var sHash = oNavigationControllerProxy.oHashChanger.getHash(),
				sPath;

			var oTarget;
			var aTargetComponentPromises = []; 
			if (vTargetContext) {
				if (typeof vTargetContext === "string"){
					sPath = vTargetContext;
					sTargetContextPath = null;
				} else {
				// get the navigation path from binding context
					oTarget = routingHelper.determineNavigationPath(vTargetContext, sNavigationProperty);
					sPath = oTarget.path;
				// Store the context path and use it in _handleNavigation, so no data retrieval is done!
					sTargetContextPath = vTargetContext.getPath();
					aTargetComponentPromises = getTargetComponentPromises(oTarget);
				}
			} else {
				sPath = sNavigationProperty;
			}
			if (sPath) {
				if (sNavigationProperty) {
					// add a leading "/" is none exists
					if (sNavigationProperty.indexOf("/") < 0) {
						sNavigationProperty = "/" + sNavigationProperty;
					}
					// hash contains EntitySet(Key)/NavProp() -> only EntitySet(Key) is required
					sHash = fnTruncateHash(sHash, sNavigationProperty);
					// get hash path until "?"
					sHash = fnTruncateHash(sHash, "?");

					// just concatenate current hash with selected path e.g. Root(Key) + / + NavProp(Key)
					if (sHash) {
						// Note: Sometimes sHash already contains an ending '/'. This depends on whether we have navigated to the current
						// url via low level (HashChanger) or high-level (Router) means.
						if (sHash.substr(sHash.length - 1, 1) !== "/"){
							sHash = sHash + "/";
						}
						sPath = sHash + sPath;
					}
				}
				fnPresetDisplayMode(aTargetComponentPromises, iDisplayMode || 0);
				// navigate to context
				if (oTemplateContract.oFlexibleColumnLayoutHandler){
					var oAppStatePromise = oTemplateContract.oFlexibleColumnLayoutHandler.getAppStateParStringForNavigation(oTarget);
					oAppStatePromise.then(function(sPars){
						if (sPars){
							sPath = sPath + "?" + sPars;
						}
						fnNavigate(sPath, bReplace);
					});
				} else {
					fnNavigate(sPath, bReplace);
				}
			}
		}

		var oMessagePage; // initialized on demand
		function fnNavigateToMessagePage(mParameters) {
			var sEntitySet, sTitle, sText, oEntitySet, oEntityType, oHeaderInfo, sIcon = null,
				oMetaModel, sDescription;
			if (mParameters) {
				sEntitySet = mParameters.entitySet;
				sTitle = mParameters.title;
				sText = mParameters.text;
				sIcon = mParameters.icon;
				sDescription = mParameters.description;
			}

			if (sEntitySet) {
				oMetaModel = oAppComponent.getModel().getMetaModel();
				if (oMetaModel) {
					oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
					oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
					oHeaderInfo = oEntityType["com.sap.vocabularies.UI.v1.HeaderInfo"];
				}
				if (oHeaderInfo && oHeaderInfo.TypeImageUrl && oHeaderInfo.TypeImageUrl.String) {
					sIcon = oHeaderInfo.TypeImageUrl.String;
				}
			}

			oTemplateContract.oNoOwnTitlePromise.then(function(bNoOwnTitle) {
				if (!oMessagePage) {
					oMessagePage = new MessagePage({
						showNavButton: true,
						navButtonPress: oTemplateContract.oNavContainer.back,
						showHeader: !bNoOwnTitle
					});
					oTemplateContract.oNavContainer.addPage(oMessagePage);
				}
				if (bNoOwnTitle) {
					oTemplateContract.oShellService.setTitle(sTitle);
					oTemplateContract.oShellService.setBackNavigation(undefined);
				} else {
					oMessagePage.setTitle(sTitle);
				}
				oMessagePage.setText(sText);
				oMessagePage.setIcon(sIcon);
				oMessagePage.setDescription(sDescription);
				oTemplateContract.oNavContainer.to(oMessagePage);
				oNextHash = {
					iHashChangeCount: oNextHash.iHashChangeCount + 1 
				};
				fnAfterActivation();
			});
		}

		// End: Navigation methods

		// Start: Handling url-changes
		
		/*
		 * calls onActivate on the specified view, if it exists
		 * @param {Object} oView - the view
		 * @param {string} sPath - the path in the model
		 * @param {boolean} bDelayedActivate - optional boolean flag, true if activate is (re-)triggered delayed
		 */
		function fnActivateOneComponent(sPath, oActivationInfo, oComponent) {
			var oRegistryEntry = oTemplateContract.componentRegistry[oComponent.getId()] || {};
			var bIsComponentCurrentlyActive = (oRegistryEntry.activationTakt === oActivationInfo.iHashChangeCount - 1);
			oRegistryEntry.activationTakt = oActivationInfo.iHashChangeCount;
			// trigger onActivate on the component instance
			// if Component is assembled without TemplateAssembler it could be that oComponent.onActivate is undefined
			// e.g. an application has an own implementation of Component
			var oRet;
			if (oComponent && oComponent.onActivate) {
				oRet = oComponent.onActivate(sPath, bIsComponentCurrentlyActive);
			}
			return oRet || oRegistryEntry.viewRegisterd;
		}		

		/*
		 * calls onActivate on the specified view, if it exists
		 * @param {Object} oView - the view
		 * @param {string} sPath - the path in the model
		 * @param {boolean} bDelayedActivate - optional boolean flag, true if activate is (re-)triggered delayed
		 */
		function fnActivateComponent(sPath, oActivationInfo, oComponent) {
			fnActivateOneComponent(sPath, oActivationInfo, oComponent).then(fnAfterActivation);
		}

		function fnAdaptPaginatorInfoAfterNavigation(oEvent, bIsProgrammatic, bIsBack){
			var oNewPaginatorInfo = {};
			if (bIsProgrammatic || bIsBack){
				var iViewLevel = oEvent.getParameter("config").viewLevel;
				var oCurrentPaginatorInfo = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/paginatorInfo");
				for (var iLevel = 0; iLevel < iViewLevel; iLevel++){
					oNewPaginatorInfo[iLevel] = oCurrentPaginatorInfo[iLevel];	
				}
			}
			oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/paginatorInfo", oNewPaginatorInfo);
		}
		
		// Event handler fired by router once it finds a match
		function fnHandleRouteMatched(oEvent) {
			// State changers may identify the hash change as something which can be handled by them internally. In this case we do not need to run the whole mechanism
			for (var i = 0; i < oTemplateContract.aStateChangers.length; i++){
				var oStateChanger = oTemplateContract.aStateChangers[i];
				if (oStateChanger.isStateChange(oEvent)){
					return;
				}
			}

			var iHashChangeCount = oNextHash.iHashChangeCount;
			var sHash = oNavigationControllerProxy.oHashChanger.getHash() || "";
			var bIsProgrammatic = (sHash === oNextHash.hash);
			var bIsBack = !!(oNextHash.back || (!bIsProgrammatic && (oHistory.getDirection() === HistoryDirection.Backwards)));
			oNextHash = { 
				iHashChangeCount: iHashChangeCount + 1
			};
			fnAdaptPaginatorInfoAfterNavigation(oEvent, bIsProgrammatic, bIsBack);
			var oActivationInfo = {
				bIsProgrammatic: bIsProgrammatic,
				bIsBack: bIsBack,
				iHashChangeCount: iHashChangeCount + 1
			};
			if (oTemplateContract.oFlexibleColumnLayoutHandler){
				oTemplateContract.oFlexibleColumnLayoutHandler.handleRouteMatchedFlexibleColumnLayout(oEvent, oActivationInfo);
				return;
			}
			oTemplateContract.oApplicationProxy.onRouteMatched(oEvent);
			var oRouteConfig, sPath;

			oRouteConfig = oEvent.getParameter("config");
			if (oRouteConfig.viewLevel === 0 || !(bIsProgrammatic || bIsBack)){
				oTemplateContract.oApplicationProxy.setEditableNDC(false);           	
			}

			// remove all messages before setting a new binding context
			// sap.ui.getCore().getMessageManager().removeAllMessages();

			// If the path from a binding context exists --> use it instead of checking for operation in route config
			if (sTargetContextPath) {
				sPath = sTargetContextPath; // use the stored context path
				// ensure that it is not used again
				sTargetContextPath = null;
				//
			} else {
				sPath = routingHelper.determinePath(oRouteConfig, oEvent);
			}

			var sRoute = oRouteConfig.target;   // Note: Route and targetnames are identical
			var oComponentPromise = oTemplateContract.mRouteToTemplateComponentPromise[sRoute];
			oComponentPromise.then(fnActivateComponent.bind(null, sPath, oActivationInfo));
		}

		// Event handler fired by router when no matching route is found
		function fnHandleBypassed() {
			oTemplateContract.oApplicationProxy.onBypassed();
			fnNavigateToMessagePage({
				title: oTemplateContract.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),
				replaceURL: true
			});
		}

		oNavigationControllerProxy.oRouter.attachRouteMatched(fnHandleRouteMatched);
		oNavigationControllerProxy.oRouter.attachBypassed(fnHandleBypassed);
		// End: Handling url-changes
		
		// Expose methods via NavigationController proxy
		oNavigationControllerProxy.navigate = fnNavigate;
		oNavigationControllerProxy.activateOneComponent = fnActivateOneComponent;
		oNavigationControllerProxy.afterActivation = fnAfterActivation;

		// Expose selected private functions to unit tests
		/* eslint-disable */
		var fnNavigateToMessagePage = testableHelper.testable(fnNavigateToMessagePage, "navigateToMessagePage");
		/* eslint-enable */
		// allow tests to access private instance variable sTargetContextPath
		testableHelper.testable(function(){ return sTargetContextPath; }, "getTargetContextPath");
		testableHelper.testable(function(sPath){ sTargetContextPath = sPath; }, "setTargetContextPath");

		return {
			/**
			* Navigates to the root view.
			*
			* @public
			* @param {boolean} bReplace If this is true the navigation/hash will be replaced
			*/
			navigateToRoot: fnNavigateToRoot,

			/**
			 * Navigates to the specified context.
			 *
			 * @public
			 * @param {Object} oTargetContext - The context to navigate to (or null - e.g. when the navigationProperty should be appended to the current path)
			 * @param {string} sNavigationProperty - The navigation property
			 * @param {boolean} bReplace If this is true the navigation/hash will be replaced
			 */
			navigateToContext: fnNavigateToContext,
			/**
			 * Navigates to the message page and shows the specified content.
			 *
			 * @public
			 * @param {Object} mParameters - The parameters for message page
			 */
			navigateToMessagePage: fnNavigateToMessagePage,

			/**
			 * Navigate back
			 *
			 * @public
			 */			
			navigateBack: fnNavigateBack
		};
	}

	/*
	 * Handles all navigation and routing-related tasks for the application.
	 *
	 * @class The NavigationController class creates and initializes a new navigation controller with the given
	 *        {@link sap.suite.ui.generic.template.lib.AppComponent AppComponent}.
	 * @param {sap.suite.ui.generic.template.lib.AppComponent} oAppComponent The AppComponent instance
	 * @public
	 * @extends sap.ui.base.Object
	 * @version 1.44.5
	 * @since 1.30.0
	 * @alias sap.suite.ui.generic.template.lib.NavigationController
	 */
	var NavigationController = BaseObject.extend("sap.suite.ui.generic.template.lib.NavigationController", {
		metadata: {
			library: "sap.suite.ui.generic.template"
		},
		constructor: function(oAppComponent, oTemplateContract) {
			// inherit from base object.
			BaseObject.apply(this, arguments);

			var oNavigationControllerProxy = {
				oAppComponent: oAppComponent,
				oRouter: oAppComponent.getRouter(),
				oTemplateContract: oTemplateContract,
				oHashChanger: HashChanger.getInstance(),
				mRouteToComponentResolve: {}
			};
			var oFinishedPromise = new Promise(function(fnResolve){
				// remark: In case of inbound navigation with edit-mode and an existing draft, this promise will be resolved
				// before the initialization is actually finished.
				// This is necessary to be able to show the unsavedChanges-Dialog
				oNavigationControllerProxy.fnInitializationResolve = fnResolve;
			});
			oTemplateContract.oBusyHelper.setBusy(oFinishedPromise);
			jQuery.extend(this, getMethods(oAppComponent, oTemplateContract, oNavigationControllerProxy));
			jQuery.extend(oNavigationControllerProxy, this);
			var mViews = {};

			// TODO: this has to be clarified and fixed
			oNavigationControllerProxy.oRouter._oViews._getViewWithGlobalId = function(oView) {
				// Test only
				if (!mViews[oView.viewName]){
					var oRoute = oNavigationControllerProxy.oRouter.getRoute(oView.viewName);
					var oContainer;
					if (oRoute && oRoute._oConfig) {
						oContainer = fnCreateComponentInstance(oAppComponent, oRoute._oConfig, oNavigationControllerProxy.mRouteToComponentResolve[oView.viewName]);
					} else {
						oContainer = sap.ui.view({
							viewName: oView.viewName,
							type: oView.type,
							height: "100%"
						});
					}
					mViews[oView.viewName] = oContainer;
					if (oView.viewName === "root") {
						oTemplateContract.rootContainer = oContainer;
					}					
				}
				return mViews[oView.viewName];
			};
			routingHelper.startupRouter(oNavigationControllerProxy);
		}
	});

	NavigationController._sChanges = "Changes";
	return NavigationController;
});