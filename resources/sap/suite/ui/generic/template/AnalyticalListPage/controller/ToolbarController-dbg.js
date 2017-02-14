sap.ui.define(["sap/m/SegmentedButtonItem", "sap/m/Button", "sap/m/ButtonType", "sap/ui/base/EventProvider", "../control/VariantSegmentedButton",
		"sap/ui/core/mvc/Controller"
    ],
    function(SegmentedButtonItem, Button, ButtonType, EventProvider, VariantSegmentedButton, Controller) {
        "use strict";

		var	CONTAINER_VIEW_TABLE = "table",
			CONTAINER_VIEW_CROSSTAB = "crosstab",
			CONTAINER_VIEW_CHART = "chart",
			CONTAINER_VIEW_CHARTTABLE = "charttable",
			FILTER = "Filter";

		//var masterDetailViewInit = false;
		var eventProvider = new EventProvider();

		/**
		 *  @private
		 * this is a helper method to show or hide footer bar contents
		 * [_setFooterBarItemsVisibleHelper A function to to show or hide footer bar contents]
		 * @param  {Object} oFooterBar [Footer bar of the page]
		 * @param  {String} sItem  [custom data item]
		 * @param  {String} sContainerView  [content area]
		 * @return {boolean}   [to break the loop once set the item to be visible]
		 */
		function _setFooterBarItemsVisibleHelper(oFooterBar, sItem, sContainerView){
			var sCustomData = sItem.data(FILTER);
			if (sCustomData && sContainerView === CONTAINER_VIEW_CHARTTABLE){
				sItem.setVisible(true);
				return true;
			} else {
				if (sCustomData && (sCustomData).toLowerCase() === sContainerView){
					oFooterBar.setVisible(true);
					sItem.setVisible(true);
					return true;
				} else if (sCustomData && (sCustomData).toLowerCase() !== sContainerView){
					sItem.setVisible(false);
					return true;
				}
			}
		}

		/**
		 *  @private
		 * this Method is to hide the determining buttons based on content area
		 * [_hideDeterminingButtons A function to hide the determining buttons based on content area]
		 * @param  {Object} oFooterBar [Footer bar of the page]
		 * @param  {String} sViewMode  [content area]
		 */
		function _hideDeterminingButtons(oFooterBar, sViewMode) {
			oFooterBar.setVisible(false);
			if (sViewMode === CONTAINER_VIEW_TABLE) {
				var aItems = oFooterBar.findElements(false);
				for (var nIndex = 0; nIndex < aItems.length; nIndex++){
					_setFooterBarItemsVisibleHelper(oFooterBar,aItems[nIndex],CONTAINER_VIEW_TABLE);
				}
			} else if (sViewMode == CONTAINER_VIEW_CROSSTAB) {
				oFooterBar.setVisible(false);
			} else if (sViewMode == CONTAINER_VIEW_CHART) {
				var aItems = oFooterBar.findElements(false);
				for (var nIndex = 0; nIndex < aItems.length; nIndex++){
					_setFooterBarItemsVisibleHelper(oFooterBar,aItems[nIndex],CONTAINER_VIEW_CHART);
				}
			}
			else if (sViewMode == CONTAINER_VIEW_CHARTTABLE) {
				oFooterBar.setVisible(true);
				var aItems = oFooterBar.findElements(false);
				for (var nIndex = 0; nIndex < aItems.length; nIndex++){
					_setFooterBarItemsVisibleHelper(oFooterBar,aItems[nIndex],CONTAINER_VIEW_CHARTTABLE);
				}
			}
		}

		var tbController = Controller.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.ToolbarController", {
			setState:function(oState) {
				var me = this;
				me.oState = oState;
				me._uiCompRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");

				var defaultView = oState.oController.getOwnerComponent().getDefaultContentView();
				if (!defaultView)
					defaultView = CONTAINER_VIEW_CHART;

				// delay insertion out custom toolbar buttons until the
				// smartTable and smartChart are properly initialized
				me.oState._pendingTableToolbarInit = true;
				me.oState._pendingChartToolbarInit = true;

				//Check if dsh option is turned on and then call this page.
				var oComponent = this.oState.oController.getOwnerComponent();
				var appName = oComponent.getDsAppName();
				if (appName) {	//Do not initialize DSH if there is no appName
					jQuery.sap.require("sap.suite.ui.generic.template.AnalyticalListPage.control.DshExt");
					me.initDSHPage();
				}

				me.setDefaultView(defaultView);
			},
			switchContainerView:function(mode) {
				var me = this;

				me.oState._containerView = mode;
				me.updateToolbarContent(mode);

				if (mode == CONTAINER_VIEW_TABLE) {
					//Cross Table can be optional
					if (me.oState.alr_dshContainer) {
						me.oState.alr_dshContainer.setVisible(false);
					}
					me.oState.alr_chartContainer.setVisible(false);
					me.oState.alr_detailContainer.setVisible(true);
				} else if (mode == CONTAINER_VIEW_CROSSTAB) {
					me.oState.alr_chartContainer.setVisible(false);
					me.oState.alr_detailContainer.setVisible(false);
					//This shouldnt be needed as the button wouldn't be shown but putting condition anyway.
					if (me.oState.alr_dshContainer) {
						me.oState.alr_dshContainer.setVisible(true);
					}
				} else if (mode == CONTAINER_VIEW_CHART) {
					//Cross Table can be optional
					if (me.oState.alr_dshContainer) {
						me.oState.alr_dshContainer.setVisible(false);
					}
					me.oState.alr_detailContainer.setVisible(false);
					me.oState.alr_chartContainer.setVisible(true);
					if (!me.oState.oSmartChart._oChartViewMetadata) {
						jQuery.sap.log.error("Missing Chart Annotation");
					}
				} else if (mode == CONTAINER_VIEW_CHARTTABLE) {
					//Cross Table can be optional
					if (me.oState.alr_dshContainer) {
						me.oState.alr_dshContainer.setVisible(false);
					}
					me.oState.alr_chartContainer.setVisible(true);

					me.oState.alr_detailContainer.setVisible(true);
				}
				//Show / hide Determining buttons based on Content View
				_hideDeterminingButtons(me.oState.alr_pageFooterBar, mode);

				// Inform others that the container view has changed
				me.fireContainerViewChange();
			},
			setDefaultView: function (mode) {
				var me = this;
				me.switchContainerView(mode);
				if (mode == "crosstab") {
					me.createDSHPage();
				}
			},
			attachContainerViewChange: function(oData, fnFunction, oListener) {
				return eventProvider.attachEvent("ContainerViewChange", oData, fnFunction, oListener);
			},
			detachContainerViewChange: function(fnFunction, oListener) {
				return eventProvider.detachEvent("ContainerViewChange", fnFunction, oListener);
			},
			fireContainerViewChange: function(mArguments) {
				return eventProvider.fireEvent("ContainerViewChange", mArguments);
			},
			updateToolbarContent: function() {
				var me = this;
				var view = me.oState._containerView;

				if (!me.oState.alr_viewSwitchButton) {
					me.oState.alr_viewSwitchButton = me.createViewSwitchButton();
				}

				if (!me.oState.alr_fullScreenButton) {
					me.oState.alr_fullScreenButton = me.createFullScreenToggleButton();
				}

				// this block gets the position of the eye icon in the toolbar i.e just before the settins icon


				if (view == CONTAINER_VIEW_CHART) {
					if (me.oState._lastContentView != CONTAINER_VIEW_CHARTTABLE) {
						if (me.oState._lastContentViewToolbar) {
							me.oState._lastContentViewToolbar.removeContent(me.oState.alr_viewSwitchButton);
							me.oState._lastContentViewToolbar.removeContent(me.oState.alr_fullScreenButton);
						}

						if (!me.oState._pendingChartToolbarInit) {
							me.oState.oSmartChart.getToolbar().addContent(me.oState.alr_fullScreenButton);
							me.oState.oSmartChart.getToolbar().addContent(me.oState.alr_viewSwitchButton);
						}
					}
					me.oState._lastContentViewToolbar = me.oState.oSmartChart.getToolbar();
				} else if (view == CONTAINER_VIEW_TABLE) {
					if (me.oState._lastContentViewToolbar) {
						me.oState._lastContentViewToolbar.removeContent(me.oState.alr_viewSwitchButton);
						me.oState._lastContentViewToolbar.removeContent(me.oState.alr_fullScreenButton);
					}

					if (!me.oState._pendingTableToolbarInit) {
						me.oState.oSmartTable._oToolbar.addContent(me.oState.alr_fullScreenButton);
						me.oState.oSmartTable._oToolbar.addContent(me.oState.alr_viewSwitchButton);
					}
					me.oState._lastContentViewToolbar = me.oState.oSmartTable.getCustomToolbar();
				} else if (view == CONTAINER_VIEW_CHARTTABLE) {
					if (me.oState._lastContentView != CONTAINER_VIEW_CHART) {
						if (me.oState._lastContentViewToolbar) {
							me.oState._lastContentViewToolbar.removeContent(me.oState.alr_viewSwitchButton);
							me.oState._lastContentViewToolbar.removeContent(me.oState.alr_fullScreenButton);
						}

						if (!me.oState._pendingChartToolbarInit) {
							me.oState.oSmartChart.getToolbar().addContent(me.oState.alr_fullScreenButton);
							me.oState.oSmartChart.getToolbar().addContent(me.oState.alr_viewSwitchButton);
						}
					}
					me.oState._lastContentViewToolbar = me.oState.oSmartChart.getToolbar();
				} else if (view == CONTAINER_VIEW_CROSSTAB) {
					if (me.oState._lastContentViewToolbar) {
						me.oState._lastContentViewToolbar.removeContent(me.oState.alr_fullScreenButton);
						me.oState._lastContentViewToolbar.removeContent(me.oState.alr_viewSwitchButton);
					}
					me.oState.alr_dshToolbar.addContent(me.oState.alr_fullScreenButton);
					me.oState.alr_dshToolbar.addContent(me.oState.alr_viewSwitchButton);
					me.oState._lastContentViewToolbar = me.oState.alr_dshToolbar;
				}
				me.oState._lastContentView = view;
			},
			_addComponentInstanceToUI:function(oComponentInstance) {
				var me = this;
				var oMainVBox = me.oState.alr_detailContainer;
				sap.ui.core.ResizeHandler.register(
					oMainVBox,
					function() {
						oComponentContainer.setHeight(oMainVBox.getDomRef().clientHeight + "px");
					});

				//var metaModel = oComponentInstance.getModel().getMetaModel();

				oMainVBox.removeAllItems();

				if (oComponentInstance.getRouter() && !oComponentInstance.getRouter()._bIsInitialized) {
					oComponentInstance.getRouter().initialize();
				}

				var oComponentContainer = new sap.ui.core.ComponentContainer({
					component: oComponentInstance
				});

				if (oMainVBox.getDomRef()) {
					oComponentContainer.setHeight(oMainVBox.getDomRef().clientHeight + "px");
				}

				oMainVBox.addItem(oComponentContainer);
			},
			createViewSwitchButton:function() {
				var oComponent = this.oState.oController.getOwnerComponent();
				var appName = oComponent.getDsAppName();

				var buttonItems = [
					new sap.m.SegmentedButtonItem({
						tooltip:"{i18n>CONTAINER_VIEW_CHARTTABLE}",
						key:CONTAINER_VIEW_CHARTTABLE,
						icon:"sap-icon://chart-table-view"
					}),
					new sap.m.SegmentedButtonItem({
						tooltip:"{i18n>CONTAINER_VIEW_CHART}",
						key:CONTAINER_VIEW_CHART,
						icon:"sap-icon://vertical-bar-chart-2"
					}),
					new sap.m.SegmentedButtonItem({
						tooltip:"{i18n>CONTAINER_VIEW_CROSSTAB}",
						key:CONTAINER_VIEW_CROSSTAB,
						icon:"sap-icon://table-chart"
					}),
					new sap.m.SegmentedButtonItem({
						tooltip:"{i18n>CONTAINER_VIEW_TABLE}",
						key:CONTAINER_VIEW_TABLE,
						icon:"sap-icon://table-view"
					})
				];

				if (!appName) {
					buttonItems.splice(2, 1);
				}

				var me = this;
				var segBtn = new VariantSegmentedButton("alr_contentSegmentedBtn",{
					persistencyKey: "alr_viewmode_segmentedButton",
					smartVariant: me.oState.alr_pageVariant,
					select: jQuery.proxy(me.onToolbarSegBtnPressed, me),
					layoutData: new sap.m.OverflowToolbarLayoutData({
							priority:sap.m.OverflowToolbarPriority.NeverOverflow
						}),
					items:buttonItems,
					selectedKey: me.oState._containerView
				});

				return segBtn;
			},
			onToolbarSegBtnPressed : function(btn, id, key) {
				var me = this;
				if (!key && btn) {
					key = btn.getParameter("key");
				}

				if (key) {
					me.switchContainerView(key);
					if (key == CONTAINER_VIEW_CROSSTAB) {
						me.createDSHPage();
					}
					//Uncomment if the table should be refreshed when the view is switched
					//if (key == CONTAINER_VIEW_CHARTTABLE) {
					//	this.oState.chartController.updateTable();
					//}
				}
			},
			createFullScreenToggleButton:function() {
				return new sap.m.ToggleButton({
					icon:"sap-icon://full-screen",
					visible:true,
					pressed:false,
					press: function() {
						this.onFullScreenToggle(!this.bFullScreen);
					}.bind(this)
				});
			},
			onFullScreenToggle : function(bValue, bForced) {
				var me = this;
				if (!me.oState.alr_fullScreenButton || (bValue === me.bFullScreen && !bForced)) {
					return;
				}
				me.bFullScreen = bValue;
				if (!me._oFullScreenUtil) {
					me._oFullScreenUtil = sap.ui.requireSync("sap/ui/comp/util/FullScreenUtil");
				}

				me._oFullScreenUtil.toggleFullScreen(me.oState.oContentContainer, me.bFullScreen);
				if (me.oState._containerView == CONTAINER_VIEW_CROSSTAB) {
					me.oState.oController.oDsh.refreshCrosstab(true, true);
				}

				me.oState.alr_fullScreenButton.setTooltip(me.bFullScreen ? me._uiCompRb.getText("CHART_MINIMIZEBTN_TOOLTIP") : me._uiCompRb.getText("CHART_MAXIMIZEBTN_TOOLTIP"));
				me.oState.alr_fullScreenButton.setIcon(me.bFullScreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen");
			},
			initDSHPage:function() {
				var me = this;

				sap.zen.dsh.scriptLoaded = true;
				var useHybridHandlers = false;

				var oComponent = me.oState.oController.getOwnerComponent();
				var appName = oComponent.getDsAppName();
				var xQueryValue = oComponent.getDsQueryName();

				var appComponent = me.oState.oController.getOwnerComponent().getAppComponent();
				var config = me.oState.oController.getOwnerComponent().getAppComponent().getMetadata().getConfig();
				var componentData = appComponent.getComponentData();
				if (!componentData) {
					componentData = { startupParameters: {} };
				}
				var nav_params = {};

				if (config) {
					if (config.appName) {
						appName = config.appName;
					}
					if (config.useHybridHandlers) {
						useHybridHandlers = true;
					}
				}

				//startup parameters for appName and proxy overrides the configured settings
				if (componentData.startupParameters) {
					if (componentData.startupParameters.appName) {
						appName = componentData.startupParameters.appName;
					}
					if (componentData.startupParameters.useHybridHandlers) {
						useHybridHandlers = true;
					}
				}

				var oDsh = me.oState.oController.oDsh = new sap.suite.ui.generic.template.AnalyticalListPage.control.DshExt({
					height:"100%",
					width:"100%",
					deployment:"bw",
					useWebproxy : useHybridHandlers,
					dshAppName : appName,
					appComponent : appComponent,
					deferCreation: true,
					smartVariant: me.oState.alr_pageVariant,
					persistencyKey:"alr_dsh_crosstab",
					//TODO: We need a way to determine the client. Currently the Dsh relies on the client field to determine if it is HANA or ABAP
					//or we just ask DSH if there is a better way to say what system that is
					client: "000"
				});

				oDsh.setViewController(me.oState.oController, me.oState);

				oDsh.addParameter("XQUERY", xQueryValue);

				if (sap.ushell.Container) {
					sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(me.oState.oController.getOwnerComponent().getAppComponent()
						).always(function(oStartupData) {
							oDsh.initializeAppState.call(oDsh, oStartupData, nav_params);
							if (config.navigationSourceObjects) {
								oDsh.addParameter("NAV_SOURCES", JSON.stringify(config.navigationSourceObjects));
							}
					});
				}

				var innerDshContainer = me.oState.oController.getView().byId("alr_InnerDshContainer");
				if (innerDshContainer) {
					innerDshContainer.addItem(oDsh);
					me.oState.oController.oDsh = oDsh;
					me.oState.oController.oDshContainer = innerDshContainer;
				}
			},
			createDSHPage:function() {
				var me = this;
				var dshPage = me.oState.oController.oDsh.getPage();
				if (!dshPage) {
					jQuery(me.oState.oController.oDsh.getDomRef()).css("height", me.oState.oController.oDsh.calculateDshContainerHeight());
					me.oState.oController.oDsh.createPage();
					me.oState.oController.oDsh.addCrosstabPersonalisationToToolbar(me.oState);

					if (!me.oState.oToolbarCrosstabGroup) {
						me.oState.oToolbarCrosstabGroup = me.oState.oController.byId("alr_contentContainerToolbar_crosstabGroup");
					}

					var insertIndex = me.oState.alr_dshToolbar.indexOfContent(me.oState.alr_fullScreenButton);

					// For testing only - can be deleted

					// jQuery.sap.require('sap.m.Label');
					// jQuery.sap.require('sap.m.ComboBox');
					// var curr_label = new sap.m.Label({text:'Testing only, to be removed->'});
					// var curr_combo = new sap.m.ComboBox({
						// width:"8rem",
						// items:[
							// new sap.ui.core.Item({key:"EUR", text:"EUR"}),
							// new sap.ui.core.Item({key:"USD", text:"USD"}),
							// new sap.ui.core.Item({key:"JPY", text:"YEN"})
						// ]
					// });
					// curr_combo.attachSelectionChange(function(ev) {
						// var selectedKey = ev.getParameter('selectedItem').getKey();
						// window.putInQueue(
							// function() {
								// me.oState.oController.oDsh.getPage().exec('DISPLAY_ACTION.SET_CURRENCY_CODE(\'' + selectedKey + '\')');
							// }
						// );
					// });
					// if (insertIndex >= 0)	{
						// me.oState.alr_dshToolbar.insertContent(me.oState.oController.oDsh._oDshPersonalisationButton, insertIndex);
						// me.oState.alr_dshToolbar.insertContent(curr_combo, insertIndex);
						// me.oState.alr_dshToolbar.insertContent(curr_label, insertIndex);
					// }

					if (insertIndex >= 0)	{
						me.oState.alr_dshToolbar.insertContent(me.oState.oController.oDsh._oDshPersonalisationButton, insertIndex);
					}
				}
			}
		});

		return tbController;
});
