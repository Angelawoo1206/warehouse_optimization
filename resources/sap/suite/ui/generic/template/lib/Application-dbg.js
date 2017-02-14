sap.ui.define(["jquery.sap.global", "sap/ui/base/Object", "sap/ui/Device", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History",
		"sap/ui/core/routing/HistoryDirection", "sap/m/MessageToast", "sap/m/ActionSheet", "sap/m/Dialog", "sap/m/Popover",
		"sap/suite/ui/generic/template/lib/routingHelper", "sap/suite/ui/generic/template/lib/testableHelper"
	],
	function(jQuery, BaseObject, Device, JSONModel, History, HistoryDirection, MessageToast, ActionSheet, Dialog, Popover, routingHelper, testableHelper) {
		"use strict";

		var sContentDensityClass = (testableHelper.testableStatic(function(bTouch, oBody) {
			var sCozyClass = "sapUiSizeCozy",
				sCompactClass = "sapUiSizeCompact";
			if (oBody.hasClass(sCozyClass) || oBody.hasClass(sCompactClass)) { // density class is already set by the FLP
				return "";
			} else {
				return bTouch ? sCozyClass : sCompactClass;
			}
		}, "Application_determineContentDensityClass")(Device.support.touch, jQuery(document.body)));

		// defines a dependency from oControl to a parent
		function fnAttachControlToParent(oControl, oParent) {
			jQuery.sap.syncStyleClass(sContentDensityClass, oParent, oControl);
			oParent.addDependent(oControl);
		}

		// Expose selected private static functions to unit tests
		/* eslint-disable */
		var fnAttachControlToParent = testableHelper.testableStatic(fnAttachControlToParent, "Application_attachControlToParent");
		/* eslint-enable */

		/* An instance of this class represents a Smart Template based application. Thus, there is a one-to-one relationship between
		 * instances of this class and instances of sap.suite.ui.generic.template.lib.AppComponent.
		 * However, this class is only used inside the sap.suite.ui.generic.template.lib package. It is not accessible to template developers
		 * or breakout developers.
		 * Instances of this class are generated in sap.suite.ui.generic.template.lib.TemplateAssembler.
		 * Note that TemplateAssembler also possesses a reference to the instance of this class which represents the app currently
		 * running.
		 * oTemplateContract: An object which is used for communication between this class and the AppComponent and its helper classes.
		 * Note that this class injects its api to these classes into the template contract object.
		 * Currently this class supports two use cases:
		 * 1. For non-draft apps it contains the information whether the app is currently in display or in edit state (methods set/getEditableNDC)
		 * 2. A 'navigation' model is supported. Thereby, we consider navigation to take place each time a route name or a route pattern is changed (but not when only the parameters added to the route are changed)
		 */
		function getMethods(oTemplateContract) {

			var oCurrentDisplay = { // an object containing information about the view currently displayed
				// note that an attribute fnResolve will be added to this object. It contains the function that resolves the promise contained in attribute api.promise
				api: {
					promise: Promise.resolve()
				} // this object is exposed via method getCurrentDisplayObject
			};
			var oDataForNextPage = {}; // data bag that is transferred to the next page

			// this function is called as soon as the navigation to the current view is finished.
			function fnDisplayedPageReached() {
				oCurrentDisplay.fnResolve(); // resolve the promise that waits for the navigation to be finished
			}

			var oRouteParameters = {}; // parameters of the routing event for the view currently displayed. Handled by function isNewRoute.
			// this function is called when a route is matched. It returns the information whether this is a new route in the sense
			// of the navigation model realized by this class.
			function isNewRoute(oEvent) {
				var oNewRouteParameters = oEvent.getParameters();
				if (oNewRouteParameters.name !== oRouteParameters.name) {
					oRouteParameters = oNewRouteParameters;
					return true;
				}
				var oMerged = jQuery.extend({}, oRouteParameters.arguments, oNewRouteParameters.arguments);
				for (var sId in oMerged) {
					if (sId.indexOf("?") !== 0 && oMerged[sId] !== oRouteParameters.arguments[sId]) {
						oRouteParameters = oNewRouteParameters;
						return true;
					}
				}
				return false;
			}

			function getCurrentDisplayObject() {
				return oCurrentDisplay.api || {}; //TODO: ensure there is always something to return
			}

			function addDataForNextPage(oDataBag) {
				jQuery.extend(oDataForNextPage, oDataBag);
			}

			function getCurrentView() {
				return oCurrentDisplay.currentView ||
				(function(){
					var oComponentContainer = oTemplateContract.oNavContainer && oTemplateContract.oNavContainer.getPages()[0];
					if (oComponentContainer && oComponentContainer instanceof sap.ui.core.ComponentContainer){
						var oRegistryEntry = oTemplateContract.componentRegistry[oComponentContainer.getComponent()];
						return oRegistryEntry && oRegistryEntry.oController && oRegistryEntry.oController.getView();
					}
				})() || oTemplateContract.oNavContainer;
			}

			function fnMakeBusyAware(oControl) {
				var sOpenFunction;
				if (oControl instanceof Dialog) {
					sOpenFunction = "open";
				} else if (oControl instanceof Popover || oControl instanceof ActionSheet) {
					sOpenFunction = "openBy";
				}
				if (sOpenFunction) {
					var fnOpenFunction = oControl[sOpenFunction];
					oControl[sOpenFunction] = function() {
						if (!oTemplateContract.oBusyHelper.isBusy()) { // suppress dialogs while being busy
							var myArguments = arguments;
							oTemplateContract.oBusyHelper.getUnbusy().then(function() { // but the busy dialog may still not have been removed
								fnOpenFunction.apply(oControl, myArguments);
							});
						}
					};
				}
			}

			var mFragmentStores = {};

			function getDialogFragmentForView(oView, sName, oFragmentController, sModel, fnOnFragmentCreated) {
				oView = oView || getCurrentView();
				var sViewId = oView.getId();
				var mFragmentStore = mFragmentStores[sViewId] || (mFragmentStores[sViewId] = {});
				var oFragment = mFragmentStore[sName];
				if (!oFragment) {
					oFragment = sap.ui.xmlfragment(sViewId, sName, oFragmentController);
					fnAttachControlToParent(oFragment, oView);
					var oModel;
					if (sModel) {
						oModel = new JSONModel();
						oFragment.setModel(oModel, sModel);
					}
					(fnOnFragmentCreated || jQuery.noop)(oFragment, oModel);
					mFragmentStore[sName] = oFragment;
					fnMakeBusyAware(oFragment);
				}
				return oFragment;
			}

			function getOperationEndedPromise() {
				return new Promise(function(fnResolve) {
					oTemplateContract.oBusyHelper.getUnbusy().then(function() {
						oCurrentDisplay.api.promise.then(fnResolve);
					});
				});
			}

			function setBackNavigation(fnBackNavigation) {
				if (oTemplateContract.oShellService) {
					oTemplateContract.oShellService.setBackNavigation(fnBackNavigation);
				}
			}

			function setTitle(sTitle) {
				if (oTemplateContract.oShellService) {
					oTemplateContract.oShellService.setTitle(sTitle);
				}

			}
			
			function getFclProxy(iViewLevel) {
				if (!oTemplateContract.oFlexibleColumnLayoutHandler){
					return {};
				}
				
				return {
					oActionButtonHandlers: oTemplateContract.oFlexibleColumnLayoutHandler.getActionButtonHandlers(iViewLevel),
					navigateToDraft: oTemplateContract.oFlexibleColumnLayoutHandler.navigateToDraft
				};
			}

			var bIsEditable = false;
			
			function setEditableNDC(isEditable) {
				bIsEditable = isEditable;
			}
			
			function isNewHistoryEntryRequired(oTargetContext, sNavigationProperty){
				if (!oTemplateContract.oFlexibleColumnLayoutHandler){
					return true;
				}
				var iColumnCount = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/FCL/flexibleColumnCount");
				var oTarget = routingHelper.determineNavigationPath(oTargetContext, sNavigationProperty);
				var iTargetLevel = oTemplateContract.oFlexibleColumnLayoutHandler.getTargetLevel(oTarget);
				
				return iTargetLevel >= iColumnCount;
			}
			
			function fnRegisterStateChanger(oStateChanger){
				oTemplateContract.aStateChangers.push(oStateChanger);
			}
			
			var oHistory = History.getInstance();
			var sCurrentlyDisplayed; // id of the component container currently displayed, updated when navigation is finished
			var sGoingToBeDisplayed; // like CurrentlyDisplayed, but already updated when route is matched
			oTemplateContract.oApplicationProxy = { // inject own api for AppComponent into the Template Contract. Other classes (NavigationController, BusyHelper) will call these functions accordingly.
				onAfterNavigate: function(oEvent) { // called when navigation has finished
					sCurrentlyDisplayed = oEvent.getParameter("toId");
					var oComponentContainer = oEvent.getParameter("to");
					var sComponent = oComponentContainer && oComponentContainer.getComponent && oComponentContainer.getComponent();
					var oComponentRegistryEntry = sComponent && oTemplateContract.componentRegistry[sComponent];
					oCurrentDisplay.currentView = oComponentRegistryEntry &&  oComponentRegistryEntry.oController.getView();
					fnDisplayedPageReached();
				},

				onBypassed: function() {
					oRouteParameters = {};
					oCurrentDisplay.api.outdated = true;
					oCurrentDisplay.api = {
						promise: Promise.reject() // prevent promises pending forever
					};
					oCurrentDisplay.fnResolve = jQuery.noop;
				},

				onRouteMatched: function(oEvent) {
					if (!isNewRoute(oEvent)) {
						return; // ignore route changes which are not cosidered as navigation for our model
					}
					oCurrentDisplay.api.outdated = true; // mark the old object as outdated
					oCurrentDisplay.api = { // and create a new one
						isBack: oHistory.getDirection() === HistoryDirection.Backwards,
						dataFromLastPage: oDataForNextPage,
						promise: new Promise(function(fnResolve) {
							oCurrentDisplay.fnResolve = fnResolve;
						})
					};
					oDataForNextPage = {}; // create a new data bag for next page
					var sRoute = oEvent.getParameter("config").target;   // Note: Route and targetnames are identical
					var oComponentPromise = oTemplateContract.mRouteToTemplateComponentPromise[sRoute];
					oComponentPromise.then(function(oComponent){
						sGoingToBeDisplayed = oComponent.getComponentContainer().getId();
						if (!sCurrentlyDisplayed || sGoingToBeDisplayed === sCurrentlyDisplayed) { // no view navigation will take place -> page is reached
							sCurrentlyDisplayed = sGoingToBeDisplayed;
							fnDisplayedPageReached();
						}						
					});
				},

				getCurrentDisplayObject: getCurrentDisplayObject,
				// Returns either the view that is currently displayed or (if no view is yet loaded) the hosting NavContainer for this App
				getCurrentView: getCurrentView,
				addDataForNextPage: addDataForNextPage,
				setEditableNDC: setEditableNDC,
				getDialogFragment: getDialogFragmentForView.bind(null, null),
				destroyView: function(sViewId){
					delete mFragmentStores[sViewId];
				}
			};

			return {
				setEditableNDC: setEditableNDC,
				getEditableNDC: function() {
					return bIsEditable;
				},
				// Return an object containing information about the current page. It contains the following attributes:
				// isBack: has this view been reached via back navigation
				// dataFromLastPage: data bag containing data provided by the previous view
				// promise: a promise that is resolved as soon as the navigation to the view has been finished
				// outdated: this attribute is added (value: true) as soon as a new navigation to another view is started.
				// Note that this is the point in time getCurrentDisplayObject will already return another object.
				// Hence, only clients are affected that have stored a reference to the object returned by this function in their memory.
				getCurrentDisplayObject: getCurrentDisplayObject,
				// add data to the data bag that will be handed over to the next page. Note that this method can be called several times.
				addDataForNextPage: addDataForNextPage,
				getContentDensityClass: function() {
					return sContentDensityClass;
				},
				attachControlToParent: fnAttachControlToParent,
				getDialogFragmentForView: getDialogFragmentForView,
				getBusyHelper: function() {
					return oTemplateContract.oBusyHelper;
				},
				isTemplateComponentActive: function(oTemplateComponent) {
					return oTemplateComponent.getComponentContainer().getId() === sGoingToBeDisplayed;
				},
				showMessageToast: function() {
					var myArguments = arguments;
					var messageToast = function() {
						MessageToast.show.apply(MessageToast, myArguments);
					};
					getOperationEndedPromise().then(messageToast);
				},
				setBackNavigation: setBackNavigation,
				setTitle: setTitle,
				getFclProxy: getFclProxy,
				isNewHistoryEntryRequired: isNewHistoryEntryRequired,
				registerStateChanger: fnRegisterStateChanger
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.lib.Application", {
			constructor: function(oTemplateContract) {
				jQuery.extend(this, getMethods(oTemplateContract));
			}
		});
	});