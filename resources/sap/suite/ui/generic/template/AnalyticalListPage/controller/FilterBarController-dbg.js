
sap.ui.define(["sap/m/SegmentedButtonItem", "sap/m/Button", "sap/m/ButtonType", "sap/m/Text", "sap/m/Dialog", "../control/VariantSegmentedButton",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController",
		"sap/ui/core/mvc/Controller"
	],
	function(SegmentedButtonItem, Button, ButtonType, Text, Dialog, VariantSegmentedButton, VisualFilterDialogController, Controller) {
		"use strict";

		var FILTER_MODE_VISUAL = "visual",
			FILTER_MODE_COMPACT = "compact";

		var fbController = Controller.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.FilterBarController", {
			init: function(oState) {
				var me = this;
				
				//if any default variant is present then get the selected key from variant persisted data
				//else get the selected key from manifest settings
				//TODO: to check app-state and fetch the defaultFilterMode
				if (oState.oSmartFilterbar.getCurrentVariantId()) {
					var _oPersistanceObject = oState.oSmartFilterbar._oVariantManagement._oControlPersistence.getChange(oState.oSmartFilterbar.getCurrentVariantId()).getContent();
					var defaultFilterMode = _oPersistanceObject.alr_filter_segmentedButton.selectedKey;
				} else {
					var defaultFilterMode = oState.oController.getOwnerComponent().getDefaultFilterMode();
				}
				
				//Null or Undefined check as setting may not be defined in AppDescriptor
				if (!defaultFilterMode) {
					defaultFilterMode = FILTER_MODE_VISUAL;
				}

				me.oState = oState;

				//If the App Developer wants to hide Visual Filter, switch to Compact Filter
				if (defaultFilterMode === FILTER_MODE_VISUAL && me.oState.hideVisualFilter) {
					jQuery.sap.log.error("Visual filter is hidden defaulting to compact");
					defaultFilterMode = FILTER_MODE_COMPACT;
				}

				var bShowGoButtonOnFilterBar = me.oState.oController.getOwnerComponent().getShowGoButtonOnFilterBar() ? true : false;
				oState.oSmartFilterbar.setShowGoOnFB(bShowGoButtonOnFilterBar);
				if (!bShowGoButtonOnFilterBar) {
					//Filter change event handler. Overlay is removed manually when auto-filter is enabled
					var fireFilterChange = function(){
						var supressOverlay = function(ev){
							if (ev.getParameter("overlay"))
								ev.getParameter("overlay").show = false;
						};
						oState.oSmartTable.attachShowOverlay(supressOverlay);
						oState.oSmartChart.attachShowOverlay(supressOverlay);
						oState.oSmartFilterbar.search();
						setTimeout( function() {
							oState.oSmartTable.detachShowOverlay(supressOverlay);
							oState.oSmartChart.detachShowOverlay(supressOverlay);
						}, 0);
					};
					oState.oSmartFilterbar.attachFilterChange(fireFilterChange);
					//Enabling auto-binding only when Go button is removed
					oState.oSmartTable.setEnableAutoBinding(!bShowGoButtonOnFilterBar);
				}
				//TODO:Hiding "AdaptFilter" button using private API , public API to be used when available
				me.oState.oSmartFilterbar._oFiltersButton.setVisible(false);

				oState.oHeader = oState.oPage.getHeader();
				oState.oTitle = oState.oPage.getTitle();
				//Title press handler
				var hideFilterSwitch = function(){
					if (!this.oState.oPage.getHeaderExpanded())
						this.oState.alr_visualFilterToolbar.addContent(this.filterSwitch);
					else
						this.oState.alr_visualFilterToolbar.removeContent(this.filterSwitch);
					oState.oTitle.detachEvent("_titlePress",hideFilterSwitch);
				};

				oState.oTitle.attachEvent("_titlePress",hideFilterSwitch,this);


				if (oState.oSmartFilterbar) {
					oState.oSmartFilterbar.addStyleClass("alrFilterbar");
				}

				me.transferFooterShareButton();

				if (oState.oKpiTagContainer) {
				  oState.alr_filterContainer.removeContent(oState.oKpiTagContainer);
				  oState.oKpiTagContainer.addStyleClass("alrKpiTagContainer");
				}

				me.setDefaultFilter(defaultFilterMode);
			},
			setDefaultFilter:function(mode) {
				this.handleFilterSwitch(mode, true); // Don't want to trigger a mode change event, this will cause the data to be reloaded too earlier, the reload will happen when variants are processed
			},
			createFilterSwitch:function() {
				var me = this,
					filterSwitchItems = [
						new SegmentedButtonItem({icon:"sap-icon://filter-fields", width:"inherit", key:FILTER_MODE_COMPACT, tooltip:"{i18n>FILTER_COMPACT}"})
					];

				if (!me.oState.hideVisualFilter) {
					filterSwitchItems.push(
						new SegmentedButtonItem({icon:"sap-icon://filter-analytics", width:"inherit", key:FILTER_MODE_VISUAL, tooltip:"{i18n>FILTER_VISUAL}"})
					);
				}

				var filterSwitch = new VariantSegmentedButton({
					width:"inherit",
					persistencyKey: "alr_filter_segmentedButton",
					smartVariant: this.oState.oController.byId("alrPageVariant"),
					selectedKey:me.oState._filterMode,
					items: filterSwitchItems
				}).addStyleClass("alr_filterSwitchButton");

				filterSwitch.attachSelect(function(ev){
					//Show error messages only when the filter mode is compact and Go button is visible to suppress too many popups in the application
					//Code change implemented for the BCP incidents 1670566554 and 1670553373
					if (ev.getParameter('key') === FILTER_MODE_COMPACT && me.oState.oController.getOwnerComponent().getShowGoButtonOnFilterBar()) {
						me.oState.oSmartFilterbar.setShowMessages(true);
					} else {
						me.oState.oSmartFilterbar.setShowMessages(false);
					}
					me.showFilterSwitchWarning(ev);
				});
				return filterSwitch;
			},
			/**
			 * @private
			 * This function check whether a warning dialog is required or not.
			 * @param  {object} oFilterData contains a list of the selections.
			 * @return {boolean} return true if some selections will loss when switching from compact mode to visual mode.
			 */
			_requireWarning:function(oFilterData) {
				if (this.oState._filterMode !== FILTER_MODE_VISUAL) {
					for (var key in oFilterData) {
						if ( oFilterData[key].ranges !== undefined && oFilterData[key].ranges.length > 0) {
							return true;
						}
					}
				}
				return false;
			},
			/**
			 * @private
			 * This function handle the "Continue" button press event of the warning dialog.
			 * @return {void}
			 */
			_handleEventSwitch:function() {
				this.handleFilterSwitch(this.oState.filterSwitch.getSelectedKey());
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = undefined;
			},
			/**
			 * @private
			 * This function handle the "Cancel" button press event of the warning dialog.
			 * @return {void}
			 */
			_restoreSwitchButtonState:function() {
				this.oState.filterSwitch.setSelectedKey(this.oState._filterMode);
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = undefined;
			},
			/**
			 * This function handle the switching between compact mode and visual mode
			 * @param  {event} oEvent the button press event
			 * @return {void}
			 */
			showFilterSwitchWarning: function(oEvent) {
				var oFilterData = this.oState.oSmartFilterbar.getFilterData();
				var oMe = this;
				if (!this._requireWarning(oFilterData) || oEvent.oSource._bApplyingVariant){
					this.handleFilterSwitch(oEvent.getParameter("key"), undefined, true, oEvent.oSource._bApplyingVariant); //silent is undefined but search shouldnt be fired
					return;
				}
				var _oRM = this.oState.oController.getView().getModel("i18n");
				if (!this._oDialog) {
					this._oDialog = new Dialog({
						title: _oRM.getResourceBundle().getText("FILTER_SWITCH_WARNING_HEADER"),
						type: "Message",
						state: "Warning",
						content: new Text({
							text: _oRM.getResourceBundle().getText("FILTER_SWITCH_WARNING_MESSAGE")
							}),
						beginButton: new Button({
							text: _oRM.getResourceBundle().getText("YES"),
							press: [oMe._handleEventSwitch, oMe]
							}),
						endButton: new Button({
							text: _oRM.getResourceBundle().getText("NO"),
							press: [oMe._restoreSwitchButtonState, oMe]
							})}).addStyleClass("sapUiPopupWithPadding").addStyleClass("sapUiSizeCompact").addStyleClass("sapUiCompAddRemoveFilterDialog").setVerticalScrolling(true);
					this.oState.oController.getView().addDependent(this._oDialog);
				}
				this._oDialog.open();
			},
			/**
			 * press handler for filter switch button 
			 *  
			 * @param {string} mode - compact or visual
			 * @param {boolean} silent - whether to fire filter change to listening control or not
			 * @param {boolean} bStopFireFilter - do not fire filter search query
			 * @param {boolean} bApplyingVariant - true is variant is being applied 
			 *
			 * @returns {void}
			 */
			handleFilterSwitch:function(mode, silent, bStopFireFilter, bApplyingVariant) {
				var me = this,
					oCompactFilterData;
				me.oState._filterMode = mode;
				//TODO-DPL - completed code - all the below code are new
				if (!me.oState.filterSwitch && !me.oState.hideVisualFilter) {
					me.oState.filterSwitch = me.createFilterSwitch();
					me.oState.alr_visualFilterToolbar.addContent(me.oState.filterSwitch);
				}
				if (me.oState._filterMode == FILTER_MODE_VISUAL) {
					me.oState.alr_compactFilterContainer.addStyleClass("sapUiHidden");
					me.oState.alr_visualFilterContainer.removeStyleClass("sapUiHidden");
					// merge compact filter with visual filter
					if (!silent) {
						oCompactFilterData = this.oState.oSmartFilterbar.getFilterData();
						if (!bApplyingVariant) {
							this.oState.alr_visualFilterBar.mergeCompactFilters(oCompactFilterData);
						}
					}
		
				}
				else if (me.oState._filterMode == FILTER_MODE_COMPACT) {
					if (!silent) {
						oCompactFilterData = me.oState.alr_visualFilterBar.getFilterDataForCompactFilter();
						this.oState.oSmartFilterbar.setFilterData(oCompactFilterData, true);
					}
					if (me.oState.oSmartFilterbar._oToolbar)
						me.oState.oSmartFilterbar._oToolbar.addStyleClass("sapUiHidden");
					if (!me.oState.hideVisualFilter) {
						me.oState.alr_visualFilterContainer.addStyleClass("sapUiHidden");
					}
					me.oState.alr_compactFilterContainer.removeStyleClass("sapUiHidden");
				}

				me.oState.oSmartFilterbar.setMode(mode, silent || (bStopFireFilter && mode === FILTER_MODE_VISUAL)); // Wait until everything is ready to update the mode

				this.updateFilterCount();
			},
			//check the filter mode and then show the corresponding filter dialog
			showDialog: function(){
				var me = this;
				if (me.oState._filterMode == FILTER_MODE_COMPACT)
					me.oState.oSmartFilterbar._showFilterDialog();
				else if (me.oState._filterMode == FILTER_MODE_VISUAL)
					me.oState.visualFilterDialogContainer.launchDialog.call(me.oState.visualFilterDialogContainer);
			},
			clearFilters:function(){
				var me = this;
				if (me.oState._filterMode == FILTER_MODE_COMPACT) {
					//Clear all filters
					var oFilterData = me.oState.oSmartFilterbar.getFilterData();
					for (var prop in oFilterData) {
						if (oFilterData.hasOwnProperty( prop ) ) {
							delete oFilterData[prop];
						}
					}
					me.oState.oSmartFilterbar.setFilterData(oFilterData, true);
					//me.oState.oSmartFilterbar._clearFilterFields();
				} else if (me.oState._filterMode == FILTER_MODE_VISUAL) {
					me.oState.alr_visualFilterBar.clearFilters();
				}
				//clear the table selections
				this.oState.chartController.updateTable();
			},
			transferFooterShareButton:function() {
				var me = this;
				if (me.oState.oPage._getSegmentedFooter) {
					var footer = me.oState.oPage._getSegmentedFooter();
					if (footer && footer._oContainer) {
						for (var i = 0; i < footer._oContainer.getContent().length; i++) {
							var footerCtrl = footer._oContainer.getContent()[i];
							if (footerCtrl instanceof sap.m.Button) {
								me.footerShareBtn = footer._oContainer.removeContent(footerCtrl);
								me.footerShareBtn.setType(ButtonType.Transparent);
							}
						}
					}
					var sharedMenu = me.oState.oPage._getSegmentedShareMenu();
					if (sharedMenu && sharedMenu._oContainer && sharedMenu._oContainer._oActionSheet) {
						sharedMenu._oContainer._oActionSheet.setPlacement(sap.m.PlacementType.Bottom);
					}
				}
			},
			updateFilterCount: function() {
				var i18nModel = this.oState.oController.oView.getModel("i18n");
				if (!i18nModel)
					return;

				var rb = i18nModel.getResourceBundle();

				var count = this.oState.oSmartFilterbar.getFilterCount();

				var filterText = count == 0 ? rb.getText("VISUAL_FILTER_FILTERS") : rb.getText("VISUAL_FILTER_FILTERS_WITH_COUNT", [count]);

				this.oState.alr_visualFilterFiltersBtn.setText(filterText);
			}
		});
		return fbController;
	});
