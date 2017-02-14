sap.ui.define(["jquery.sap.global", "sap/ui/base/Object"], function(jQuery, BaseObject) {
	"use strict";

	function getMethods(oComponent, oComponentRegistryEntry) {

		// This promise if resolved when the element binding for the header data have been read. Note that the promise
		// stored in this variable is replaced each time the function fnRebindHeaderData is called.
		// Thus, the promise allways represents the loading of the currently relevant header data.
		var oHeaderDataAvailablePromise;
		var fnHeaderDataAvailableResolve = null; // function to resolve the promise (or null if it is resolved)
		var sCurrentRequestHeaderReason;
		var iRequestCount = 0;

		// Registry for the event handling facility (see fnAttach, fnDetach, and fnFire)
		var aEventHandlerRegistry = [];

		function getODataLoadFailedTexts() {
			var oRB = oComponent.getModel("i18n").getResourceBundle();
			return {
				dataLoadFailedTitle: oRB.getText("ST_GENERIC_ERROR_LOAD_DATA_TITLE"),
				dataLoadFailedText: oRB.getText("ST_GENERIC_ERROR_LOAD_DATA_TEXT")
			};
		}

		function fnAttach(sTemplate, sEvent, fnFunction) {
			if (typeof fnFunction !== "function") {
				throw new Error("Event handler must be a function");
			}
			aEventHandlerRegistry.push({
				template: sTemplate,
				event: sEvent,
				handler: fnFunction
			});
		}

		function fnDetach(sTemplate, sEvent, fnFunction) {
			for (var i = aEventHandlerRegistry.length; i--;) {
				if (aEventHandlerRegistry[i].handler === fnFunction && aEventHandlerRegistry[i].event === sEvent && aEventHandlerRegistry[i].template ===
					sTemplate) {
					aEventHandlerRegistry.splice(i, 1);
				}
			}
		}

		function fnFire(sTemplate, sEvent, oEvent) {
			for (var i = 0; i < aEventHandlerRegistry.length; i++) {
				if (aEventHandlerRegistry[i].event === sEvent && aEventHandlerRegistry[i].template === sTemplate) {
					aEventHandlerRegistry[i].handler(oEvent);
				}
			}
		}

		function getTemplateName(oController) {
			return oController.getMetadata().getName();
		}

		// for external consumers
		function fnFirePageDataLoadedExternal() {
			var oAppComponent = oComponent.getAppComponent();
			oAppComponent.firePageDataLoaded();
		}

		function fnPreparePageDataLoaded(oCurrentDisplay) {
			oHeaderDataAvailablePromise.then(function(oContext) {
				if (oContext && !oCurrentDisplay.outdated) {
					oCurrentDisplay.promise.then(function() {
						fnFire(getTemplateName(oComponentRegistryEntry.oController), "PageDataLoaded", {
							context: oContext
						});
						fnFirePageDataLoadedExternal();
					});
				}
			});
		}

		function fnDataRequested(sHeaderRequestReason) {
			if (!fnHeaderDataAvailableResolve) { // the current HeaderDataAvailablePromise was already resoled -> create a new one
				oHeaderDataAvailablePromise = new Promise(function(fnResolve) {
					fnHeaderDataAvailableResolve = fnResolve;
				});
			}
			if (!oComponent.getComponentContainer().getElementBinding().isSuspended()) {
				oComponentRegistryEntry.oApplication.getBusyHelper().setBusyReason(sHeaderRequestReason, true, false);
			}
		}
		
		
		function fnDataReceived(sHeaderRequestReason){
			oComponentRegistryEntry.oApplication.getBusyHelper().setBusyReason(sHeaderRequestReason, false);	
		}

		function fnChange(sHeaderRequestReason, oEvent) {
			var oContext = oEvent.getSource().getBoundContext();
			if (oContext) {
				if (fnHeaderDataAvailableResolve) {
					fnHeaderDataAvailableResolve(oContext);
				}
				(oComponentRegistryEntry.methods.updateBindingContext || jQuery.noop)();
			} else {
				// When not data parameter is received there is usually an exception
				// TODO: show backend error messages
				var oDataLoadFailedTexts = getODataLoadFailedTexts();
				var oNavigationController = oComponent.getAppComponent().getNavigationController();
				oNavigationController.navigateToMessagePage({
					title: oDataLoadFailedTexts.dataLoadFailedTitle,
					text: oDataLoadFailedTexts.dataLoadFailedText
				});
			}
			fnHeaderDataAvailableResolve = null;
			oComponentRegistryEntry.oApplication.getBusyHelper().setBusyReason(sHeaderRequestReason, false);
		}

		function fnRebindHeaderData(sBindingPath) {
			var oParameter = {};
			var oComponentData = oComponent.getComponentData();
			if (oComponentData && oComponentData.preprocessorsData && oComponentData.preprocessorsData.rootContextExpand && oComponentData.preprocessorsData
				.rootContextExpand.length) {
				oParameter.expand = oComponentData.preprocessorsData.rootContextExpand.join(",");
			}
			if (sCurrentRequestHeaderReason) {
				oComponentRegistryEntry.oApplication.getBusyHelper().setBusyReason(sCurrentRequestHeaderReason, false);
			}
			iRequestCount++;
			sCurrentRequestHeaderReason = "HeaderRequest::" + oComponent.getId() + "::" + iRequestCount;
			oHeaderDataAvailablePromise = new Promise(function(fnResolve) {
				fnHeaderDataAvailableResolve = fnResolve;
				oComponent.getComponentContainer().bindElement({
					path: sBindingPath,
					events: {
						dataRequested: fnDataRequested.bind(null, sCurrentRequestHeaderReason),
						dataReceived: fnDataReceived.bind(null, sCurrentRequestHeaderReason),
						change: fnChange.bind(null, sCurrentRequestHeaderReason)
					},
					parameters: oParameter,
					batchGroupId: "Changes", // get navigation controller constant?
					changeSetId: "Changes"
				});
			});
		}

		function fnBindComponent(sBindingPath, bIsComponentCurrentlyActive) {
			var oCurrentDisplay;
			if (sBindingPath) {
				var oComponentContainer = oComponent.getComponentContainer();
				if (oComponentContainer) {
					if (oComponentRegistryEntry.utils.getCreateMode(sBindingPath)) {
						oComponentContainer.unbindElement();
						oComponentContainer.setBindingContext(oComponentContainer.getModel().getContext(sBindingPath));
					} else {
						oCurrentDisplay = oComponentRegistryEntry.oApplication.getCurrentDisplayObject();
						var oElementBinding = oComponentContainer.getElementBinding();
						if (oElementBinding){
							if (oElementBinding.getPath() === sBindingPath) {
								/*
								* component is already bound to this object - no rebound to avoid that 1:1, 1:N and expands are read
								* again
								*/
								if (oElementBinding.isSuspended()) {
									oElementBinding.resume();
								}
								if (fnHeaderDataAvailableResolve) { // still loading data
									oComponentRegistryEntry.oApplication.getBusyHelper().setBusyReason(sCurrentRequestHeaderReason, true, false);
								}
								fnPreparePageDataLoaded(oCurrentDisplay);
								return;
							} else if (!bIsComponentCurrentlyActive){
								oComponentContainer.unbindElement();	
							}
						}
						// set the UI model to not editable / enabled as long as the binding data is read
						var oUIModel = oComponent.getModel("ui");
						oUIModel.setProperty("/enabled", false);
						oUIModel.setProperty("/editable", false);
						// and read the header data if necessary
						fnRebindHeaderData(sBindingPath);

						fnPreparePageDataLoaded(oCurrentDisplay);
					}
				}
			} else {
				oCurrentDisplay = oComponentRegistryEntry.oApplication.getCurrentDisplayObject();
				oCurrentDisplay.promise.then(fnFirePageDataLoadedExternal);
			}
		}
		
		function fnSuspendBinding(){
			var oComponentContainer = oComponent.getComponentContainer();
			var oElementBinding = oComponentContainer.getElementBinding();
			if (oElementBinding && !oElementBinding.isSuspended()){ // suspend element bindings of inactive components
				oElementBinding.suspend();
				oComponentRegistryEntry.oApplication.getBusyHelper().setBusyReason(sCurrentRequestHeaderReason, false);
			}			
		}

		function setBackNavigation(fnBackNavigation) {
			oComponentRegistryEntry.oApplication.setBackNavigation(fnBackNavigation);
		}

		function setTitle(sTitle) {
			oComponentRegistryEntry.oApplication.setTitle(sTitle);
		}

		function getTemplatePrivateModel() {
			return oComponent.getModel("_templPriv");
		}

		return {
			setEditableNDC: function(bIsEditable) {
				oComponentRegistryEntry.oApplication.setEditableNDC(bIsEditable);
			},
			getEditableNDC: function() {
				return oComponentRegistryEntry.oApplication.getEditableNDC();
			},

			getBusyHelper: function() {
				return oComponentRegistryEntry.oApplication.getBusyHelper();
			},

			getCreateMode: function(sBindingPath) {
				var oEntity;
				var oModel = oComponent.getModel();

				if (sBindingPath) {
					if (oModel) {
						oEntity = oModel.getProperty(sBindingPath);
					}
				} else {
					var oContext = oComponent.getBindingContext();
					if (oContext) {
						oEntity = oContext.getObject();
					}
				}

				// workaround until ODataModel provides method
				return !!(oEntity && oEntity.__metadata && oEntity.__metadata.created);
			},

			attach: function(oController, sEvent, fnFunction) {
				fnAttach(getTemplateName(oController), sEvent, fnFunction);
			},
			detach: function(oController, sEvent, fnFunction) {
				fnDetach(getTemplateName(oController), sEvent, fnFunction);
			},
			fire: function(oController, sEvent, oEvent) {
				fnFire(getTemplateName(oController), sEvent, oEvent);
			},

			addDataForNextPage: function(oDataBag) {
				oComponentRegistryEntry.oApplication.addDataForNextPage(oDataBag);
			},

			getCurrentDisplayObject: function() {
				return oComponentRegistryEntry.oApplication.getCurrentDisplayObject();
			},

			rebindHeaderData: fnRebindHeaderData,
			bindComponent: fnBindComponent,
			suspendBinding: fnSuspendBinding,
			setBackNavigation: setBackNavigation,
			setTitle: setTitle,
			getTemplatePrivateModel: getTemplatePrivateModel
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.ComponentUtils.js", {
		constructor: function(oComponent, oComponentRegistryEntry) {
			jQuery.extend(this, getMethods(oComponent, oComponentRegistryEntry));
		}
	});
});