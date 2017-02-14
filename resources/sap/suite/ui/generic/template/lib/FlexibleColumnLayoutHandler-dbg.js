sap.ui.define(["sap/ui/base/Object"],
	function(BaseObject) {
		"use strict";

		function getMethods(oFlexibleColumnLayout, oNavigationControllerProxy) {

			var oRouteConfigs = {}; //TODO1: Comment this
			var oLastRoute;
			
			var oTemplateContract =	oNavigationControllerProxy.oTemplateContract,
				oRouter = oNavigationControllerProxy.oRouter;

			function fnSetColumns(oEvent) {
				var iViewLevel = oEvent.getParameter("config").viewLevel;

				// first we handle the case beyond FlexibleColumnLayout
				if (iViewLevel > 2) {
					oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/flexibleColumnCount", 0);
					oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/isFullscreen", false);
					return 0;
				}

				oTemplateContract.oNavContainer.to(oFlexibleColumnLayout);
				var iFlexibleColumnCount = iViewLevel + 1;
				oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/flexibleColumnCount", iFlexibleColumnCount);

				switch (iViewLevel) {
					case 0:
						oFlexibleColumnLayout.setMidColumn(null);
						break;
					case 1:
						oFlexibleColumnLayout.setEndColumn(null);
						break;
					case 2:
						oRouteConfigs.endColumn = oEvent.getParameter("config");
				}

				var oQuery = oEvent.getParameter("arguments")["?query"];
				var bIsFullscreen = !!oQuery && oQuery.FCLfullscreen === "true";
				oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/isFullscreen", bIsFullscreen);
			
				var sFullscreenColumnId = null;
				if (bIsFullscreen) {
					switch (iViewLevel) {
						case 0:
							sFullscreenColumnId = oFlexibleColumnLayout.getBeginColumn().getId();
							break;
						case 1:
							sFullscreenColumnId = oFlexibleColumnLayout.getMidColumn().getId();
							break;
						case 2: 
							sFullscreenColumnId = oFlexibleColumnLayout.getEndColumn().getId();
					}
				}

				oFlexibleColumnLayout.setFullScreenColumn(sFullscreenColumnId);
				return iFlexibleColumnCount;
			}

			function activateView(oActivationInfo, sPath, sRouteName) {
				var oPromise = oTemplateContract.mRouteToTemplateComponentPromise[sRouteName];
				if (oPromise) {
					return oPromise.then(function(oComponent) {
						return oNavigationControllerProxy.activateOneComponent(sPath, oActivationInfo, oComponent);
					});
				}
				return Promise.resolve();
			}

			function removeQueryInRouteName(sRouteName) {
				// remove query in sRouteName
				var checkForQuery = sRouteName.substring(sRouteName.length - 5, sRouteName.length);
				if (checkForQuery === "query") {
					sRouteName = sRouteName.substring(0, sRouteName.length - 5);
				}
				return sRouteName;
			}
			
			function fnAfterActivation(aActivationPromises){
				Promise.all(aActivationPromises).then(oNavigationControllerProxy.afterActivation);
			}

			function fnDetermineAndSetContextPath(oEvent, oActivationInfo, iFlexibleColumnCount) {
				var oRouteConfig, sRouteName, sPath;
				// create a deep copyy of oEvent, since we will use it in an asynchronous call
				oEvent = jQuery.extend(true, {}, oEvent);
				oRouteConfig = oEvent.getParameter("config");
				sRouteName = oEvent.getParameter("name");
				var aActivationPromises = [];
				if (iFlexibleColumnCount > 0){
					aActivationPromises.push(activateView(oActivationInfo, null, "root"));
				}
				if (iFlexibleColumnCount === 1){
					fnAfterActivation(aActivationPromises);	
				} else {

					sap.ui.require(["sap/suite/ui/generic/template/lib/routingHelper"], function(routingHelper) {

						sPath = routingHelper.determinePath(oRouteConfig, oEvent);

						sRouteName = removeQueryInRouteName(sRouteName);

						// Bind the view from the path
						aActivationPromises.push(activateView(oActivationInfo, sPath, sRouteName));

						// activate view in midColumn if we show endColumn
						if (iFlexibleColumnCount === 3) {
							sPath = routingHelper.determinePath(oRouteConfig, oEvent, oTemplateContract.routeViewLevel1.pattern);
							aActivationPromises.push(activateView(oActivationInfo, sPath, oTemplateContract.routeViewLevel1.name));
						}
						
						fnAfterActivation(aActivationPromises);
					});
				}
			}

			function fnHandleRouteMatchedFlexibleColumnLayout(oEvent, oActivationInfo) {
				var iFlexibleColumnCount = fnSetColumns(oEvent);
				fnDetermineAndSetContextPath(oEvent, oActivationInfo, iFlexibleColumnCount);
				oLastRoute = {
					name: oEvent.getParameter("name"),
					arguments: oEvent.getParameter("arguments")
				};
			}

			function fnAddUrlParameterInfo(sRoute, oAppStates) {
				return new Promise(function(fnResolve){
					var oComponentPromise = oTemplateContract.mRouteToTemplateComponentPromise[sRoute];
					oComponentPromise.then(function(oComponent){
						var oComponentRegistryEntry = oTemplateContract.componentRegistry[oComponent.getId()];
						if (oComponentRegistryEntry.methods.getUrlParameterInfo) {
							oComponentRegistryEntry.methods.getUrlParameterInfo().then(function(oNewPars) {
								jQuery.extend(oAppStates, oNewPars);
								fnResolve();
							});	
						} else {
							fnResolve();	
						}
					});
				});
			}
			
			function fnAddLevel0InfoAndReturnParStringPromise(oAppStates){
				return fnAddUrlParameterInfo("root", oAppStates).then(function(){
					var sDelimiter = "";
					var sRet = "";
					for (var sPar in oAppStates){
						var aValues = oAppStates[sPar];
						for (var i = 0; i < aValues.length; i++){
							var sValue = aValues[i];	
							sRet = sRet + sDelimiter + sPar + "=" + sValue;
							sDelimiter = "&";
						}
					}								
					return sRet;					
				});
			}
			
			function getAppStateParStringForLevel(iLevel) {
				if (iLevel > 2 || iLevel === 0) {
					return Promise.resolve("");
				}
				var oAppStates = {
					FCLfullscreen: [oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/FCL/isFullscreen")]
				};
				// Promises that resolve to the component of the given level if this level is 
				var oLevel1Promise = (iLevel === 2) ? fnAddUrlParameterInfo(oTemplateContract.routeViewLevel1.name, oAppStates) : Promise.resolve();
				return new Promise(function(fnResolve){
					oLevel1Promise.then(function(){
						fnAddLevel0InfoAndReturnParStringPromise(oAppStates).then(fnResolve);	
					});	
				});
			}
			
			function getTargetLevel(oTarget) {
				var oTargetTreeNode = oTarget && oTemplateContract.mEntityTree[oTarget.entitySet];
				var iTargetLevel = oTargetTreeNode ? oTargetTreeNode.level : 1;
				return iTargetLevel;
			}
			
			// returns a Promise that resolves to the parameter string for the given target context
			function getAppStateParStringForNavigation(oTarget) {
				return getAppStateParStringForLevel(getTargetLevel(oTarget));
			}

			/******************************************
			 * begin: Event Handlers for common FCL Action Buttons
			 ******************************************/

			function onCloseMidColumnPressed() {
				fnAddLevel0InfoAndReturnParStringPromise({}).then(function(sPars){
					var sHash = sPars ? "?" + sPars : "";
					oNavigationControllerProxy.navigate(sHash, true);
				});		
			}

			function onCloseEndColumnPressed() {
				var oLevel1Promise = oTemplateContract.mRouteToTemplateComponentPromise[oTemplateContract.routeViewLevel1.name];
				oLevel1Promise.then(function(oComponent){
					var oComponentContainer = oComponent.getComponentContainer();
					var oBindingContext = oComponentContainer.getBindingContext();
					oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/FCL/isFullscreen", false);
					oNavigationControllerProxy.navigateToContext(oBindingContext, null, true);
				});
			}

			function setFullscreen(isFullscreen){
								// check wether we are in a query route
				if (oLastRoute.name.lastIndexOf("query") === oLastRoute.name.length - "query".length) {
					oLastRoute.arguments.query = oLastRoute.arguments["?query"];
					oLastRoute.arguments.query.FCLfullscreen = isFullscreen;
				} else {
					oLastRoute.name = oLastRoute.name + "query";
					oLastRoute.arguments.query = {
						FCLfullscreen : isFullscreen
					};
				}
				
				var sHash = oRouter.getURL(oLastRoute.name, oLastRoute.arguments);
				// router put unwanted / to the end of the route
				sHash = sHash.replace("/?", "?");
				oNavigationControllerProxy.navigate(sHash, false);
			}

			function onFullscreenColumnPressed() {
				setFullscreen(true);
			}

			function onExitFullscreenColumnPressed() {
				setFullscreen(false);
			}
			
			function getActionButtonHandlers(iViewLevel) {
				if (iViewLevel > 2){
					return null;
				}
				
				return {
					onCloseColumnPressed: iViewLevel === 1 ? onCloseMidColumnPressed : onCloseEndColumnPressed,
					onFullscreenColumnPressed: onFullscreenColumnPressed,
					onExitFullscreenColumnPressed: onExitFullscreenColumnPressed
				};
			}

			/******************************************
			 * end: Event Handlers for common FCL Action Buttons
			 *******************************************/
			 
			 function getDraftSibling(oContext) {
				return new Promise(function(fnResolve, fnReject) {
					// var oEntity = oContext.getObject();
					var oModel = oContext.getModel();
					oModel.read(oContext.getPath() + "/SiblingEntity", {
						success: function(oResponseData) {
							var oDraft = oModel.getContext("/" + oModel.getKey(oResponseData));
							fnResolve(oDraft);
						},
						error: function(oError) {
							fnReject(oError);
						}
					});
				});
			}
			
			 function fnNavigateToDraft(oDraftContextRootEntity) {
				// navigate to draft
				if (oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/FCL/flexibleColumnCount") === 3){
					var oComponentPromise = oTemplateContract.mRouteToTemplateComponentPromise[removeQueryInRouteName(oRouteConfigs.endColumn.name)];
					oComponentPromise.then(function(oComponent){
						var oBindingContextEndColumn = oComponent.getBindingContext();
						var oDraftSiblingPromise = getDraftSibling(oBindingContextEndColumn, true);
						oDraftSiblingPromise.then(function(oDraftContext){
							sap.ui.require(["sap/suite/ui/generic/template/lib/routingHelper"], function(routingHelper) {
								var sNavigationProperty = oRouteConfigs.endColumn.navigationProperty;
								var sContextPath = oDraftContextRootEntity.getPath() + "/" + routingHelper.determineNavigationPath(oDraftContext, sNavigationProperty).path;
								oNavigationControllerProxy.navigateToContext(sContextPath, null, true, 2);
							});
						});
					});
				} else {
					oNavigationControllerProxy.navigateToContext(oDraftContextRootEntity, null, true, 2);
				}
			 }
			
			// function convertLayoutToObject(sLayout) {
			// 	var aLayout = sLayout.split("-");
			// 	return {
			// 		beginColumnWidth: aLayout[0],
			// 		midColumnWidth: aLayout[1],
			// 		endColumnWidth: aLayout[2]
			// 	};
			//  }

			// function convertLayoutToString(oLayout) {
			// 	var sLayout = oLayout.beginColumnWidth + "-" + oLayout.miColumnWidth + "-" + oLayout.endColumnWidth;
			// 	return sLayout;
			// }

			oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/FCL", {
				flexibleColumnCount: 1,
				isFullscreen: false
			});
			
			return {
				handleRouteMatchedFlexibleColumnLayout: fnHandleRouteMatchedFlexibleColumnLayout,
				getAppStateParStringForNavigation: getAppStateParStringForNavigation,
				getActionButtonHandlers: getActionButtonHandlers,
				navigateToDraft: fnNavigateToDraft,
				getTargetLevel: getTargetLevel
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHandler", {
			constructor: function(oFlexibleColumnLayout, oNavigationControllerProxy) {
				jQuery.extend(this, getMethods(oFlexibleColumnLayout, oNavigationControllerProxy));
			}
		});
	});