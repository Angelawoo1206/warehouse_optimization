/* global hasher sap */
sap.ui.define(["jquery.sap.global", "sap/ui/base/Object", "sap/ui/model/json/JSONModel", "sap/m/ObjectIdentifier", "sap/m/Table",
		"sap/m/Text", "sap/ui/comp/smartfield/SmartField", "sap/ui/generic/app/navigation/service/SelectionVariant",
		"sap/ui/base/EventProvider",
		"sap/suite/ui/generic/template/AnalyticalListPage/extensionAPI/ExtensionAPI", "sap/ui/core/ResizeHandler",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/SmartChartController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/DetailController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/FilterBarController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/ToolbarController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/KpiTagController",
		"sap/suite/ui/generic/template/AnalyticalListPage/control/KpiTag",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterBarController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController",
		"sap/suite/ui/generic/template/lib/MessageUtils",
		"sap/m/MessageBox", "sap/ui/table/Table", "sap/ui/table/AnalyticalTable"
	],
    function(jQuery, BaseObject, JSONModel, ObjectIdentifier, Table, Text, SmartField, SelectionVariant, EventProvider, ExtensionAPI, ResizeHandler, SmartChartController, DetailController,
			FilterBarController, ToolbarController, KpiTagController, KpiTag, VisualFilterBarController, VisualFilterDialogController,MessageUtils, MessageBox, UiTable, AnalyticalTable) {
		"use strict";

		// Constants which are used as property names for storing custom filter data and generic filter data
		var customDataPropertyName = "sap.suite.ui.generic.template.customData",
			genericDataPropertyName = "sap.suite.ui.generic.template.genericData",
			CONTAINER_VIEW_CHART = "Chart",
			FILTER_MODE_COMPACT = "compact";

		function fnNullify(oObject) {
			if (oObject) {
				for (var sProp in oObject) {
					oObject[sProp] = null;
				}
			}
		}

		return {
			getMethods: function(oTemplateUtils, oController) {
				var eventProvider = new EventProvider();
				// Action sheet for share button
				var oShareActionSheet;
				var oState = { // contains attributes oSmartFilterbar and oSmartTable. Initialized in onInit.
					attachSearchButtonPressed: function(oData, fnFunction, oListener) {
						return eventProvider.attachEvent("SearchButtonPressed", oData, fnFunction, oListener);
					},
					detachSearchButtonPressed: function(fnFunction, oListener) {
						return eventProvider.detachEvent("SearchButtonPressed", fnFunction, oListener);
					},
					fireSearchButtonPressed: function(mArguments) {
						return eventProvider.fireEvent("SearchButtonPressed", mArguments);
					}
				};

				// Helper Functions

				function getFilterState() {
					var oCustomAndGenericData = {};
					oCustomAndGenericData[customDataPropertyName] = {};
					oCustomAndGenericData[genericDataPropertyName] = {};
					var oEditStateFilter = oController.byId("editStateFilter");
					if (oEditStateFilter) {
						oCustomAndGenericData[genericDataPropertyName].editStateFilter = oEditStateFilter.getSelectedKey();
					}
					// extension is responsible for retrieving custom filter state. The method has a more generic name
					// for historical reasons (change would be incompatible).
					oController.getCustomAppStateDataExtension(oCustomAndGenericData[customDataPropertyName]);
					return oCustomAndGenericData;
				}

				function getCurrentAppState() {
					/*
					 * Special handling for selection fields, for which defaults are defined: If a field is visible in the
					 * SmartFilterBar and the user has cleared the input value, the field is not included in the selection
					 * variant, which is returned by getDataSuiteFormat() of the SmartFilterBar. But since it was cleared by
					 * purpose, we have to store the selection with the value "", in order to set it again to an empty value,
					 * when restoring the selection after a back navigation. Otherwise, the default value would be set.
					 */
					var oSelectionVariant = new SelectionVariant(oState.oSmartFilterbar.getDataSuiteFormat());
					var aVisibleFields = oController.getVisibleSelectionsWithDefaults();
					for (var i = 0; i < aVisibleFields.length; i++) {
						if (!oSelectionVariant.getValue(aVisibleFields[i])) {
							oSelectionVariant.addSelectOption(aVisibleFields[i], "I", "EQ", "");
						}
					}
					return {
						selectionVariant: oSelectionVariant.toJSONString(),
						tableVariantId: oState.oSmartTable.getCurrentVariantId(),
						customData: getFilterState()
					};
				}

                /*function alr_crosstab_update_filter(oCurrentAppState) {
                    oCurrentAppState = oCurrentAppState || getCurrentAppState();

                    if (oState.oController.oDsh) {
						var dshPage = oState.oController.oDsh.getPage();
	                    if (oState.oSmartFilterbar) {
	                        try {
	                            if (dshPage) {
	                                oState.oController.oDsh.execApplyFilter();
	                            }
	                        } catch (ex) {
	                            jQuery.sap.log.error("AnalyticalListPage.alr_crosstab_update_filter: " + ex);
	                        }
	                    }
	                }
                }*/

				function fnStoreCurrentAppStateAndAdjustURL(oCurrentAppState) {
					// oCurrentAppState is optional
					// - nothing, if NavigationHandler not available
					// - adjusts URL immediately
					// - stores appState for this URL (asynchronously)
					oCurrentAppState = oCurrentAppState || getCurrentAppState();
					// currently NavigationHandler raises an exception when ushellContainer is not available, should be changed
					// by
					// Denver
					try {
						oTemplateUtils.oCommonUtils.getNavigationHandler().storeInnerAppState(oCurrentAppState);
					} catch (err) {
						jQuery.sap.log.error("AnalyticalListPage.fnStoreCurrentAppStateAndAdjustURL: " + err);
					}
				}

				// -- Begin of methods that are used in onInit only
				function fnSetIsLeaf() {
					var oComponent = oController.getOwnerComponent();
					var oTemplatePrivateModel = oComponent.getModel("_templPriv");
					oTemplatePrivateModel.setProperty("/listReport/isLeaf", oComponent.getIsLeaf());
				}
				
				function fnSetShareModel() {
					var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser");
					var oManifest = oController.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");
					var sBookmarkIcon = (oManifest && oManifest.icons && oManifest.icons.icon) || "";
					// share Model: holds all the sharing relevant texts and info used in the XML view
					var oShareInfo = {
						// BOOKMARK
						bookmarkIcon: sBookmarkIcon,
						bookmarkCustomUrl: function() {
							fnStoreCurrentAppStateAndAdjustURL();
							return hasher.getHash() ? ("#" + hasher.getHash()) : window.location.href;
						},
						bookmarkServiceUrl: function() {
							var oTable = oState.oSmartTable.getTable();
							var oBinding = oTable.getBinding("rows") || oTable.getBinding("items");
							return oBinding ? oBinding.getDownloadUrl() + "&$top=0&$inlinecount=allpages" : "";
						},
						// JAM
						isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive()
					};
					var oTemplatePrivateModel = oController.getOwnerComponent().getModel("_templPriv");
					oTemplatePrivateModel.setProperty("/listReport/share", oShareInfo);
				}
				// -- End of used in onInit only

				function fnRestoreGenericFilterState(oGenericData) {
					if (oGenericData && oGenericData.editStateFilter !== undefined) {
						var oEditStateFilter = oController.byId("editStateFilter");
						if (oEditStateFilter) {
							oEditStateFilter.setSelectedKey((oGenericData.editStateFilter === null) ? 0 : oGenericData.editStateFilter);
						}
					}
				}

				// method is responsible for retrieving custom filter state. The correspomding extension-method has a more generic name
				// for historical reasons (change would be incompatible).
				function fnRestoreCustomFilterState(oCustomData) {
					oController.restoreCustomAppStateDataExtension(oCustomData || {});
				}

				// This method is responsible for restoring the data which have been stored via getFilterState.
				// However, it must be taken care of data which have been stored with another (historical) format.
				// Therefore, it is checked whether oCustomAndGenericData possesses two properties with the right names.
				// If this is this case it is assumed that the data have been stored according to curreent logic. Otherwise, it is
				// assumed that the data have been stored with the current logic. Otherwise, it is assumed that the properties have been
				// stored with a logic containing only custom properties (with possible addition of _editStateFilter).
				function fnRestoreFilterState(oCustomAndGenericData) {
					oCustomAndGenericData = oCustomAndGenericData || {};
					if (oCustomAndGenericData.hasOwnProperty(customDataPropertyName) && oCustomAndGenericData.hasOwnProperty(genericDataPropertyName)) {
						fnRestoreGenericFilterState(oCustomAndGenericData[genericDataPropertyName]);
						fnRestoreCustomFilterState(oCustomAndGenericData[customDataPropertyName]);
					} else { // historic format. May still have property _editStateFilter which was used generically.
						if (oCustomAndGenericData._editStateFilter !== undefined) {
							fnRestoreGenericFilterState({
								editStateFilter: oCustomAndGenericData._editStateFilter
							});
							delete oCustomAndGenericData._editStateFilter;
						}
						fnRestoreCustomFilterState(oCustomAndGenericData);
					}
				}

				var oParseNavigationPromise;

				function onSmartFilterBarInitialise(oEvent){
					oController.onInitSmartFilterBarExtension(oEvent);
					oParseNavigationPromise = oTemplateUtils.oCommonUtils.getNavigationHandler().parseNavigation();
				}

				function onSmartFilterBarInitialized(){
					oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
						if (sNavType !== sap.ui.generic.app.navigation.service.NavType.initial) {
							var bHasOnlyDefaults = oAppData && oAppData.bNavSelVarHasDefaultsOnly;
							var oSelectionVariant = new SelectionVariant(oAppData.selectionVariant);
							var aSelectionVariantProperties = oSelectionVariant.getParameterNames().concat(
								oSelectionVariant.getSelectOptionsPropertyNames());
							for (var i = 0; i < aSelectionVariantProperties.length; i++) {
								oState.oSmartFilterbar.addFieldToAdvancedArea(aSelectionVariantProperties[i]);
							}
							//according to BCP 1670373497 and 1670406892 '|| oState.oSmartFilterbar.getCurrentVariantId() === ""' is needed
							if (!bHasOnlyDefaults || oState.oSmartFilterbar.getCurrentVariantId() === "") {
								// A default variant could be loaded.
								// Do not clear oSmartFilterbar.clearVariantSelection and oSmartFilterbar.clear due to BCP 1680012595 is not valid anymore
								// with BCP 1670406892 it was made clear that both clear are needed when this GIT change 1941921 in navigation handler is available
								oState.oSmartFilterbar.clearVariantSelection();
								oState.oSmartFilterbar.clear();
								oState.oSmartFilterbar.setDataSuiteFormat(oAppData.selectionVariant, true);
							}
							if (oAppData.tableVariantId) {
								oState.oSmartTable.setCurrentVariantId(oAppData.tableVariantId);
							}
							fnRestoreFilterState(oAppData.customData);
							if (!bHasOnlyDefaults || oState.oSmartFilterbar.getMode() === "visual") {
								oState.oSmartFilterbar.search();
							}
						} else if (oState.oSmartFilterbar.getMode() === "visual") {
							oState.oSmartFilterbar.search();
						}
					});
					// todo: check for better error handling
					oParseNavigationPromise.fail(function(oError) {
						if (oError instanceof Error) {
							oError.showMessageBox();
						}
					});
				}

				// Generation of Event Handlers
				return {
					onInit: function() {
						var oComponent = oController.getOwnerComponent();
						
						oState.hideVisualFilter = oComponent.getHideVisualFilter();
						oState.hideVisualFilter = (oState.hideVisualFilter === undefined || oState.hideVisualFilter !== true) ? false : true;

						oState.oSmartFilterbar = oController.byId("analyticalListPageFilter");
						oState.oSmartTable = oController.byId("table");
						oState.oPage = oController.byId("page");
						oState.oSmartChart = oController.byId("chart");
						oState.oContentContainer = oController.byId("alr_contentContainer");
						oState.alr_dshContainer = oController.byId("alr_dshContainer");
						oState.alr_chartContainer = oController.byId("alr_chartContainer");
						oState.alr_detailContainer = oController.byId("alr_detailContainer");
						oState.alr_compactFilterContainer = oController.byId("alr_compactFilterContainer");
						oState.alr_visualFilterContainer = oController.byId("alr_visualFilterContainer");
						oState.alr_dshToolbar = oController.byId("alr_dshToolbar");
						oState.alr_visualFilterToolbar = oController.byId("alr_visualFilterToolbar");
						oState.alr_visualFilterBar = oController.byId("alr_visualFilterBar");
						oState.alr_visualFilterFiltersBtn = oController.byId("alr_visualFilterFiltersButton1");
						oState.alr_filterContainer = oController.byId("alr_filterContainer");
						oState.alr_pageFooterBar = oController.byId("alr_pageFooterBar");
						//Keep page variant as null when the smart variant is true
						oState.alr_pageVariant = oComponent.getProperty('smartVariantManagement') || oComponent.getProperty('smartVariantManagement') === undefined ? oController.byId("alrPageVariant") : null;
						oState.oKpiTagContainer = oController.byId("alrKpiTagContainer");
						
						oState.chartController = new SmartChartController();
						oState.detailController = new DetailController();
						oState.toolbarController = new ToolbarController();
						oState.oController = oController;

						oState.fiterBarController = new FilterBarController();
						oState.fiterBarController.init(oState);
						oState.toolbarController.setState(oState);
						oState.chartController.setState(oState);
						oState.detailController.setState(oState);
						oState.detailController.setDetailViewController(oController);
						KpiTagController.init(oState);
						if (!oState.hideVisualFilter) {
							oState.visualFilterBarContainer = new VisualFilterBarController();
							oState.visualFilterBarContainer.init(oState);
							oState.visualFilterDialogContainer = new VisualFilterDialogController();
							oState.visualFilterDialogContainer.init(oState);
						}
						
						fnSetIsLeaf();
						fnSetShareModel();
						
						//Event handler for the Dynamic page title press to hide and show the filterSwitch button
						oState.oTitle.attachEvent("_titlePress",function() {
							if (!oState.oPage.getHeaderExpanded()) {
								oState.alr_visualFilterToolbar.addContent(oState.filterSwitch);
							} else {
								//calling public api of compact filter to set the filter by text when we are in compact mode
								//the text is already updated in case of visual filter.
								if (oState.oSmartFilterbar.getMode() === FILTER_MODE_COMPACT) {
									var filterText = oState.oSmartFilterbar.retrieveFiltersWithValuesAsText();
									oState.oController.byId("template::FilterText").setText(filterText);
								}
								oState.alr_visualFilterToolbar.removeContent(oState.filterSwitch);
							}
						});

						oController.byId("template::FilterText").attachBrowserEvent("click", function () {
							oController.byId("page").setHeaderExpanded(true);
							oState.alr_visualFilterToolbar.addContent(oState.filterSwitch);
						});
						var oTemplatePrivateModel = oComponent.getModel("_templPriv");
						oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", true);

						oComponent.getService("ShellUIService").then(
							function (oService) {
								oService.setTitle(oTemplateUtils.oCommonUtils.getText("PAGEHEADER"));
							}
						);
						//TODO: ShareActionSheet is not expected to initialized here but to resolve BCP:1680275658, it is done here for now
						oShareActionSheet = oTemplateUtils.oCommonUtils.getDialogFragment(
							"sap.suite.ui.generic.template.fragments.ShareSheet", {
								shareEmailPressed: function() {
									fnStoreCurrentAppStateAndAdjustURL();
									sap.m.URLHelper.triggerEmail(null, oTemplateUtils.oCommonUtils.getText("EMAIL_HEADER", [oTemplateUtils.oCommonUtils.getText(
										"PAGEHEADER")]), document.URL);
									},
									shareJamPressed: function() {
										fnStoreCurrentAppStateAndAdjustURL();
										var oShareDialog = sap.ui.getCore().createComponent({
											name: "sap.collaboration.components.fiori.sharing.dialog",
											settings: {
												object: {
													id: document.URL,
													share: oTemplateUtils.oCommonUtils.getText("PAGEHEADER")
												}
											}
										});
										oShareDialog.open();
									}
								}, "share", function(oFragment, oShareModel) {
									var oResource = sap.ui.getCore().getLibraryResourceBundle("sap.m");
									oShareModel.setProperty("/emailButtonText", oResource.getText("SEMANTIC_CONTROL_SEND_EMAIL"));
									oShareModel.setProperty("/jamButtonText", oResource.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));
									oShareModel.setProperty("/bookmarkButtonText", oResource.getText("SEMANTIC_CONTROL_SAVE_AS_TILE"));
									var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser");
									oShareModel.setProperty("/jamVisible", !!fnGetUser && fnGetUser().isJamActive());
								});
						//Making Condense is the default mode in ALP,but in List Report Compact is the default
						//compare the following logic with Application.js->getContentDensityClass:
						var oTable = oState.oSmartTable.getTable();
						var sCompactClass = "sapUiSizeCompact", sCondensedClass = "sapUiSizeCondensed";
						if ( oTable instanceof UiTable || oTable instanceof AnalyticalTable) {
							var oView = oController.getView();
							var oBody = jQuery(document.body);
							if (oBody.hasClass(sCompactClass) || oView.hasStyleClass(sCompactClass)) {
								var bCondensedTableLayout = oComponent.getComponentContainer().getSettings().condensedTableLayout;
								if (bCondensedTableLayout === false) {
									oState.oSmartTable.addStyleClass(sCompactClass);
								} else {
									oState.oSmartTable.addStyleClass(sCondensedClass);
								}
							}
						}

					},

					handlers: {
						onBack: function() {
							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function() {
								window.history.back();
							}, jQuery.noop, oState);
						},
						addEntry: function(oEvent) {
							var oEventSource = oEvent.getSource();
							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, false, oState.oSmartFilterbar).then(
										function() {
											if (!oEventSource.data("CrossNavigation")) {
												oTemplateUtils.oComponentUtils.addDataForNextPage({
													isObjectRoot: true
												});
											}
										}, jQuery.noop);
							}, jQuery.noop, oState);
						},
						deleteEntries: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.deleteEntries(oEvent);
						},
						onSelectionChange: function(oEvent) {
							var oTable = oEvent.getSource(),
								oModel = oTable.getModel(),
								oPrivModel = oTable.getModel("_templPriv");

							var oMetaModel = oModel.getMetaModel(),
								oEntitySet = oMetaModel.getODataEntitySet(this.getOwnerComponent().getEntitySet()),
								oDeleteRestrictions = oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"];

							var sDeletablePath = (oDeleteRestrictions && oDeleteRestrictions.Deletable && oDeleteRestrictions.Deletable.Path) ? oDeleteRestrictions.Deletable.Path : "";
							var bDeleteEnabled = false;

							var bAllLocked = true;
							var bAllNotDeletable = (sDeletablePath && sDeletablePath !== ""); // if Deletable-Path is undefined, then the items are deletable.

							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
							if (aContexts.length > 0) {
								for (var i = 0; i < aContexts.length; i++) {
									var oObject = oModel.getObject(aContexts[i].getPath());

									// check if item is locked
									if (!(oObject.IsActiveEntity && oObject.HasDraftEntity && oObject.DraftAdministrativeData && oObject.DraftAdministrativeData.InProcessByUser)) {
										bAllLocked = false;
									}
									// check if item is deletable
									if (bAllNotDeletable) {
										if (oModel.getProperty(sDeletablePath, aContexts[i])) {
											bAllNotDeletable = false;
										}
									}
									if (!bAllLocked && !bAllNotDeletable) {
										bDeleteEnabled = true;
										break;
									}
								}
							}
							oPrivModel.setProperty("/listReport/deleteEnabled", bDeleteEnabled);

						},
						onChange: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onChange(oEvent);
						},
						onSmartFieldUrlPressed: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onSmartFieldUrlPressed(oEvent, oState);
						},
						onContactDetails: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onContactDetails(oEvent);
						},
						onSmartFilterBarInitialise: onSmartFilterBarInitialise,
						onSmartFilterBarInitialized: onSmartFilterBarInitialized,

						onEditStateFilterChanged: function(oEvent) {
							oEvent.getSource().fireChange();
						},
						onFilterPress: function(oEvent){
							oState.fiterBarController.showDialog();
						},
						onClearPress: function(oEvent){
							oState.fiterBarController.clearFilters();
							oController.onClearFilterExtension(oEvent);
						},
						onSetHeaderState: function(oEvent){
							oState.oPage.setHeaderExpanded(!oState.oPage.getHeaderExpanded());

							if (oState.oPage.getHeaderExpanded()) {
								oEvent.getSource().setText(oTemplateUtils.oCommonUtils.getText("VISUAL_FILTER_HIDE"));
							} else {
								oEvent.getSource().setText(oTemplateUtils.oCommonUtils.getText("VISUAL_FILTER_SHOW"));
							}
						},

						onVisualFilterToggle: function (oEvent) {
							oState.alr_visualFilterBar.setVisible(!oState.alr_visualFilterBar.getVisible());
							if (oState.alr_visualFilterBar.getVisible()) {
								oEvent.getSource().setText(oTemplateUtils.oCommonUtils.getText("VISUAL_FILTER_HIDE"));
							} else {
								oEvent.getSource().setText(oTemplateUtils.oCommonUtils.getText("VISUAL_FILTER_SHOW"));
							}
							// setTimeout is used here to reduce the visual 'jump' of adding/removing style class
							setTimeout(function(){
								oState.alr_visualFilterToolbar.toggleStyleClass("closed");
							},0);
						},

						onBeforeSFBVariantSave: function() {
							/*
							 * When the app is started, the VariantManagement of the SmartFilterBar saves the initial state in the
							 * STANDARD (=default) variant and therefore this event handler is called. So, even though the name of
							 * the event handler is confusing, we need to provide the initial state to allow the SmartFilterBar to
							 * restore it when needed (i.e. when the user clicks on restore). Thus, no check against STANDARD
							 * context is needed!
							 */
							var oCurrentAppState = getCurrentAppState();
							oState.oSmartFilterbar.setFilterData({
								_CUSTOM: oCurrentAppState.customData
							});
							fnStoreCurrentAppStateAndAdjustURL(oCurrentAppState);
						},
						onAfterSFBVariantLoad: function() {
							var oData = oState.oSmartFilterbar.getFilterData();
							if (oData._CUSTOM !== undefined) {
								fnRestoreFilterState(oData._CUSTOM);
							} else {
								// make sure that the custom data are nulled for the STANDARD variant
								var oCustomAndGenericData = getFilterState();
								fnNullify(oCustomAndGenericData[customDataPropertyName]);
								fnNullify(oCustomAndGenericData[genericDataPropertyName]);
								fnRestoreFilterState(oCustomAndGenericData);
							}
							// store navigation context
							fnStoreCurrentAppStateAndAdjustURL();
						},
						onBeforeRebindTable: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onBeforeRebindTable(oEvent);
							oController.onBeforeRebindTableExtension(oEvent);
						},
						onBeforeRebindChart: function(oEvent) {
							//oState.oSmartChart.oModels = oState.oSmartChart.getChart().oPropagatedProperties.oModels;
						},
						onShowDetails: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onShowDetails(oEvent.getSource(), oState);
						},
						onListNavigate: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onListNavigate(oEvent.getSource(), oState);
						},
						onCallActionFromToolBar: function(oEvent) {
							// Since our content toolbar is detached from the SmartTable, the standard util function getParentTable
							// would not work in our case.  We need to override this function when this action is triggered from our table

							var getParentTable_orig = oTemplateUtils.oCommonUtils.getParentTable;
							oTemplateUtils.oCommonUtils.getParentTable = function(){return oState.oSmartTable;};
							oTemplateUtils.oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);
							oTemplateUtils.oCommonUtils.getParentTable = getParentTable_orig;
							getParentTable_orig = null;
						},
						onShowDetailsIntent: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onShowDetailsIntent(oEvent, oState.oSmartFilterbar);
						},
						onCallActionFromList: function(oEvent) {
							
						},
						onDataFieldForIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);
						},
						onBeforeSemanticObjectLinkPopoverOpens: function(oEvent) {

							var oEventParameters = oEvent.getParameters();

							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								//Success function
								var oNavigationHandler = oTemplateUtils.oCommonUtils.getNavigationHandler();
								if (oNavigationHandler) {
									var sSelectionVariant = oState.oSmartFilterbar.getDataSuiteFormat();
									oNavigationHandler.processBeforeSmartLinkPopoverOpens(oEventParameters, sSelectionVariant);
								} else {
									oEventParameters.open();
								}
							}, jQuery.noop, oState, jQuery.noop);
						},
						onAssignedFiltersChanged: function(oEvent) {
							if (oEvent && oEvent.getSource()) {
								oController.byId("template::FilterText").setText(oEvent.getSource().retrieveFiltersWithValuesAsText());
								if (oState && oState.fiterBarController) {
									oState.fiterBarController.updateFilterCount();
								}
							}
						},
						//TODO: VFB - snapping header text
						onAssignedVisualFiltersChanged : function(filterText){
							oController.byId("template::FilterText").setText(filterText);
						},
						onToggleFiltersPressed: function() {
							var oComponent = oController.getOwnerComponent();
							var oTemplatePrivateModel = oComponent.getModel("_templPriv");
							oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", (oTemplatePrivateModel.getProperty("/listReport/isHeaderExpanded") === true) ? false : true);
						},

						// ---------------------------------------------
						// store navigation context
						// note: function itself is handled by the corresponding control
						// ---------------------------------------------
						onSearchButtonPressed: function() {
							var oModel = oController.getOwnerComponent().getModel();
							oModel.attachEventOnce("requestSent", function() {
								fnStoreCurrentAppStateAndAdjustURL();
							});
							var fnRequestFailed = function(oEvent) {
								MessageUtils.handleError("getCollection", this, oTemplateUtils.oServices, oEvent.getParameters());
								var oSmartTable = this.getView().byId("table");
								oSmartTable.getTable().setBusy(false);
								MessageUtils.handleTransientMessages(oTemplateUtils.oServices.oApplication.getDialogFragmentForView.bind(null, null));
							}.bind(this);
							oModel.attachEvent("requestFailed", fnRequestFailed);
							oModel.attachEventOnce("requestCompleted", function(oEvent) {
								if (oEvent.getParameter("success")) {
									oModel.detachEvent("requestFailed", fnRequestFailed);
								}
							});

							//TODO: VFB - snapping header text
							if (oState._filterMode == 'visual') {
								this._templateEventHandlers.onAssignedVisualFiltersChanged(oState.alr_visualFilterBar.retrieveFiltersWithValuesAsText());
							}

							oState.fireSearchButtonPressed();

							//alr_crosstab_update_filter();
						},
						onSemanticObjectLinkPopoverLinkPressed: function(oEvent) {
							fnStoreCurrentAppStateAndAdjustURL();
							oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(oEvent, oState);
						},
						onAfterTableVariantSave: function() {
							fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterApplyTableVariant: function() {
							fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterChartVariantSave: function() {
						    fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterApplyChartVariant: function() {
						    fnStoreCurrentAppStateAndAdjustURL();
						},
						// ---------------------------------------------
						// END store navigation context
						// ---------------------------------------------

						onShareListReportActionButtonPress: function (oEvent) {
							oShareActionSheet.openBy(oEvent.getSource());
						},
						/**
						 * Called from Determining Button belonging to Chart's Annotaation of type DataFieldForAction
						 * @param  {Object} oEvent object
						 */
						onChartDeterminingDataFieldForAction: function(oEvent) {
							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oState.oSmartChart);
							var oButton = oEvent.getSource();
							var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oButton);
							var sBindingPath = this.getView().getBindingPath();
							oTemplateUtils.oCommonUtils.triggerAction(aContexts, sBindingPath, oCustomData);
						},
						/**
						 * Called from Determining Button belonging to Table's Annotation of type DataFieldForAction
						 * @param  {object} oEvent
						 */
						onDeterminingDataFieldForAction: function(oEvent) {
							var oTable = oState.oSmartTable.getTable();
							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
							if (aContexts.length === 0) {
								MessageBox.error(oTemplateUtils.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"), {
									styleClass: oTemplateUtils.oCommonUtils.getContentDensityClass()
								});
							} else {
								var oButton = oEvent.getSource();
								var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oButton);
								var sTableBindingPath = oState.oSmartTable.getTableBindingPath();
								oTemplateUtils.oCommonUtils.triggerAction(aContexts, sTableBindingPath, oCustomData, oTable);
							}
						},
						/**
						 * Called from Determining Button belonging to Table and Chart Annotation of type DataFieldForIntentBasedNavigation
						 * @param  {object} oEvent
						 */
						onDeterminingDataFieldForIntentBasedNavigation: function(oEvent) {
							var oButton = oEvent.getSource();
							var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oButton);
							var oTable = oState.oSmartTable.getTable();
							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
							if (oCustomData.Filter === CONTAINER_VIEW_CHART){
								aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oState.oSmartChart);
							}
							var bRequiresContext = !(oCustomData.RequiresContext && oCustomData.RequiresContext === "false");
							if (bRequiresContext && aContexts.length === 0) {
								MessageBox.error(oTemplateUtils.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"), {
									styleClass: oTemplateUtils.oCommonUtils.getContentDensityClass()
								});
							} else if (bRequiresContext && aContexts.length > 1) {
								MessageBox.error(oTemplateUtils.oCommonUtils.getText("ST_GENERIC_MULTIPLE_ITEMS_SELECTED"), {
									styleClass: oTemplateUtils.oCommonUtils.getContentDensityClass()
								});
							} else {
								var oContext = bRequiresContext ? aContexts[0] : null;
								oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigationSelectedContext(oContext, oCustomData, oState);
							}
						}
					},
					extensionAPI: new ExtensionAPI(oTemplateUtils, oController, oState)
				};
			}
		};

	});
