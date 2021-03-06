// Oliver+Jian //TODO
// iteration 0 //TODO
/* global window, jQuery, sap, $, document */
// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function(global) {
    "use strict";

    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchLayout");
    jQuery.sap.require("sap.m.BusyDialog");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchNoResultScreen");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.DivContainer");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultList");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultTable");
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchFilterBar');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchLabel');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchLink');
    jQuery.sap.require("sap.ushell.services.Personalization");
    jQuery.sap.require("sap.m.TablePersoController");
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchLogger');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchResultListItem');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.CustomSearchResultListItem');
    jQuery.sap.require("sap.ui.vbm.AnalyticMap");
    jQuery.sap.require("sap.ui.vbm.Spot");




    var SearchLayout = sap.ushell.renderers.fiori2.search.controls.SearchLayout;
    var SearchResultListContainer = sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer;
    var SearchResultList = sap.ushell.renderers.fiori2.search.controls.SearchResultList;
    var SearchResultTable = sap.ushell.renderers.fiori2.search.controls.SearchResultTable;
    var SearchNoResultScreen = sap.ushell.renderers.fiori2.search.controls.SearchNoResultScreen;
    var searchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;
    var SearchLabel = sap.ushell.renderers.fiori2.search.controls.SearchLabel;
    var SearchLink = sap.ushell.renderers.fiori2.search.controls.SearchLink;
    var SearchLogger = sap.ushell.renderers.fiori2.search.SearchLogger;
    var SearchResultListItem = sap.ushell.renderers.fiori2.search.controls.SearchResultListItem;
    var CustomSearchResultListItem = sap.ushell.renderers.fiori2.search.controls.CustomSearchResultListItem;


    sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.Search", {

        // create content
        // ===================================================================
        createContent: function(oController) {
            var that = this;

            // center area
            that.centerArea = that.assembleCenterArea();

            // did you mean message bar
            var didYouMeanBar = new sap.m.MessageStrip({
                text: sap.ushell.resources.i18n.getText('did_you_mean', '{/queryFilter/searchTerms}'),
                showIcon: true,
                class: 'sapUiMediumMarginBottom',
                visible: {
                    parts: [{
                        path: '/fuzzy'
                    }, {
                        path: '/boCount'
                    }],
                    formatter: function(fuzzyFlag, boCount) {
                        if (fuzzyFlag === true &&
                            boCount > 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            });

            // main result list
            var resultListContainer = new SearchResultListContainer({
                centerAreaHeader: null,
                centerArea: that.centerArea,
                didYouMeanBar: didYouMeanBar,
                totalCountBar: that.assembleCountLabel(),
                noResultScreen: new SearchNoResultScreen({
                    searchBoxTerm: {
                        parts: [{
                            path: '/queryFilter/searchTerms'
                        }],
                        formatter: function(searchTerms) {
                            return searchTerms;
                        }
                    },
                    visible: {
                        parts: [{
                            path: '/count'
                        }, {
                            path: '/isBusy'
                        }],
                        formatter: function(count, isBusy) {
                            return count === 0 && !isBusy;
                        }
                    }
                })
            });

            // container for normal search result list + facets
            that.searchLayout = new SearchLayout({
                resultListContainer: resultListContainer,
                busyIndicator: new sap.m.BusyDialog(),
                isBusy: '{/isBusy}',
                showFacets: {
                    parts: [{
                        path: '/count'
                    }, {
                        path: '/facetVisibility'
                    }, {
                        path: '/uiFilter/defaultConditionGroup'
                    }],
                    formatter: function(count, facetVisibility, filterConditions) {
                        if (!facetVisibility) {
                            return false;
                        }
                        var filterExists = filterConditions && filterConditions.conditions &&
                            filterConditions.conditions.length > 0;
                        if (count === 0 && !filterExists) {
                            return false;
                        }
                        return true;
                    }
                },
                vertical: false,
                facets: new sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter()
            });
            that.searchLayout.addStyleClass('sapUshellSearchLayout');

            // top container
            that.searchContainer = new sap.ushell.renderers.fiori2.search.controls.DivContainer({
                content: [that.searchLayout],
                cssClass: 'sapUshellSearchContainer'
            });

            // init search focus handler
            that.oFocusHandler = new searchHelper.SearchFocusHandler(that);

            return that.searchContainer;

        },

        // assemble filter button
        // ===================================================================
        assembleFilterButton: function() {
            var that = this;
            var filterBtn = new sap.m.ToggleButton({
                icon: sap.ui.core.IconPool.getIconURI("filter"),
                tooltip: {
                    parts: [{
                        path: '/facetVisibility'
                    }],
                    formatter: function(facetVisibility) {
                        return facetVisibility ? sap.ushell.resources.i18n.getText("hideFacetBtn_tooltip") :
                            sap.ushell.resources.i18n.getText("showFacetBtn_tooltip");
                    }
                },
                pressed: '{/facetVisibility}',
                press: function() {
                    if (this.getPressed()) {
                        // show facet
                        that.getModel().setFacetVisibility(true);
                        //filterBtn.setTooltip(sap.ushell.resources.i18n.getText("hideFacetBtn_tooltip"));
                    } else {
                        //hide facet
                        that.getModel().setFacetVisibility(false);
                        //filterBtn.setTooltip(sap.ushell.resources.i18n.getText("showFacetBtn_tooltip"));
                    }
                },
                visible: {
                    parts: [{
                        path: '/businessObjSearchEnabled'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(businessObjSearchEnabled, count) {
                        if (count === 0) {
                            return false;
                        }
                        return !sap.ui.Device.system.phone && businessObjSearchEnabled;
                    }
                }
            });
            filterBtn.addStyleClass('searchBarFilterButton');
            return filterBtn;
        },

        // visibility of search toolbar entry
        // ===================================================================
        searchToolbarEntryVisibility: {
            parts: [{
                path: '/count'
            }],
            formatter: function(count) {
                return count !== 0 && !sap.ui.Device.system.phone;
            }
        },

        // assemble count label
        // ===================================================================
        assembleCountLabel: function() {

            var label = new sap.m.Label({
                visible: {
                    parts: [{
                        path: '/count'
                    }],
                    formatter: function(count) {
                        return count !== 0;
                    }
                },
                text: {
                    parts: [{
                        path: '/count'
                    }],
                    formatter: function(count) {
                        if (typeof count !== 'number') {
                            return "";
                        }
                        var countAsStr = searchHelper.formatInteger(count);
                        return sap.ushell.resources.i18n.getText("results") + ' (' + countAsStr + ')';
                    }
                }
            });
            label.addStyleClass('sapUshellSearchTotalCountSelenium');
            return label;
        },

        // search toolbar
        // ===================================================================
        assembleSearchToolbar: function(bWithoutShareButton) {
            var that = this;

            // display switch tap strips
            var displaySwitchTapStrips = that.assembleDisplaySwitchTapStrips();

            // table sort button
            var tableSortButton = new sap.m.Button({
                icon: "sap-icon://sort",
                tooltip: "{i18n>sortTable}",
                type: sap.m.ButtonType.Transparent,
                enabled: {
                    parts: [{
                        path: '/displaySwitchVisibility'
                    }, {
                        path: '/count'
                    }, {
                        path: '/tableSortableColumns'
                    }],
                    formatter: function(displaySwitchVisibility, count, columns) {
                        return displaySwitchVisibility && count !== 0 && columns.length > 1;
                    }
                },
                press: function(evt) {
                    that.tableSortDialog.open();
                },
                visible: jQuery.extend({}, this.searchToolbarEntryVisibility) // UI5 needs deep copy
            });

            // table personalize button
            var tablePersonalizeButton = new sap.m.Button("tablePersonalizeButton", {
                icon: "sap-icon://action-settings",
                tooltip: "{i18n>personalizeTable}",
                type: sap.m.ButtonType.Transparent,
                enabled: {
                    parts: [{
                        path: '/resultToDisplay'
                    }],
                    formatter: function(resultToDisplay) {
                        return resultToDisplay === "searchResultTable";
                    }
                },
                press: function(evt) {
                    that.oTablePersoController.openDialog();
                },
                visible: jQuery.extend({}, this.searchToolbarEntryVisibility) // UI5 needs deep copy
            });

            //            //Fix bug: oTablePersoController is undefined when UI shows search result table back from fact sheet
            //            tablePersonalizeButton.addEventDelegate({
            //                onAfterRendering: function() {
            //                    that.updatePersoServiceAndController();
            //                }
            //            });

            if (!bWithoutShareButton) {
                var shareButton = this.assembleShareButton();
                return [displaySwitchTapStrips, tableSortButton, tablePersonalizeButton, shareButton];
            } else {
                return [displaySwitchTapStrips, tableSortButton, tablePersonalizeButton];
            }
        },

        // share button
        // ===================================================================
        assembleShareButton: function() {

            var that = this;

            // create bookmark button (entry in action sheet)
            var oBookmarkButton = new sap.ushell.ui.footerbar.AddBookmarkButton({
                beforePressHandler: function() {
                    var oAppData = {
                        url: document.URL,
                        title: that.getModel().getDocumentTitle(),
                        icon: sap.ui.core.IconPool.getIconURI("search")
                    };
                    oBookmarkButton.setAppData(oAppData);
                }
            });
            oBookmarkButton.setWidth('auto');

            var oEmailButton = new sap.m.Button();
            oEmailButton.setIcon("sap-icon://email");
            oEmailButton.setText(sap.ushell.resources.i18n.getText("eMailFld"));
            oEmailButton.attachPress(function() {
                sap.m.URLHelper.triggerEmail(null, that.getModel().getDocumentTitle(), document.URL);
            });
            oEmailButton.setWidth('auto');

            // add these two jam buttons when we know how to configure jam in fiori  //TODO
            //var oJamShareButton = new sap.ushell.ui.footerbar.JamShareButton();
            //var oJamDiscussButton = new sap.ushell.ui.footerbar.JamDiscussButton();

            // create action sheet
            var oActionSheet = new sap.m.ActionSheet({
                placement: 'Bottom',
                buttons: [oBookmarkButton, oEmailButton]
            });

            // button which opens action sheet
            var oShareButton = new sap.m.Button({
                icon: 'sap-icon://action',
                tooltip: sap.ushell.resources.i18n.getText('shareBtn'),
                press: function() {
                    oActionSheet.openBy(oShareButton);
                }
            });
            return oShareButton;
        },


        // datasource tap strips
        // ===================================================================
        assembleDataSourceTapStrips: function() {

            var that = this;

            var tabBar = new sap.m.OverflowToolbar({
                design: sap.m.ToolbarDesign.Transparent,
                visible: {
                    parts: [{
                        path: '/facetVisibility'
                    }, {
                        path: '/count'
                    }, {
                        path: '/businessObjSearchEnabled'
                    }],
                    formatter: function(facetVisibility, count, bussinesObjSearchEnabled) {
                        return !facetVisibility && count > 0 && bussinesObjSearchEnabled;
                    }
                }
            });
            // define group for F6 handling
            tabBar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */ );
            tabBar.addStyleClass('searchTabStrips');
            that.tabBar = tabBar;

            var tabBarAriaLabel = new sap.ui.core.InvisibleText({
                text: "Data Sources"
            }).toStatic();
            tabBar.addDependent(tabBarAriaLabel);
            tabBar.addAriaLabelledBy(tabBarAriaLabel);

            tabBar.bindAggregation('content', '/tabStrips/strips', function(sId, oContext) {
                var button = new sap.m.ToggleButton({
                    text: '{labelPlural}',
                    type: {
                        parts: [{
                            path: '/tabStrips/selected'
                        }],
                        formatter: function(selectedDS) {
                            var myDatasource = this.getBindingContext().getObject();
                            if (myDatasource.equals(selectedDS) === true) {
                                return sap.m.ButtonType.Transparent; // changed
                            } else {
                                return sap.m.ButtonType.Transparent;
                            }
                        }
                    },
                    pressed: {
                        parts: [{
                            path: '/tabStrips/selected'
                        }],
                        formatter: function(selectedDS) {
                            var myDatasource = this.getBindingContext().getObject();
                            return myDatasource.equals(selectedDS);
                        }
                    },
                    press: function(event) {
                        this.setType(sap.m.ButtonType.Transparent); // changed

                        // clicking on the already selected button has neither UI effect(button stays pressed status) nor reloading of search
                        if (this.getBindingContext().getObject().equals(that.getModel().getProperty('/tabStrips/selected'))) {
                            this.setPressed(true);
                            return;
                        }
                        var aButtons = that.tabBar.getContent();

                        for (var i = 0; i < aButtons.length; i++) {
                            if (aButtons[i].getId() !== this.getId()) {
                                aButtons[i].setType(sap.m.ButtonType.Transparent);
                                if (aButtons[i].getPressed() === true) {
                                    aButtons[i].setPressed(false);
                                }
                            }
                        }

                        // set Datasource to current datasource;
                        that.getModel().setDataSource(this.getBindingContext().getObject());
                    }
                });
                var buttonAriaLabel = new sap.ui.core.InvisibleText({
                    text: oContext.getProperty("labelPlural") + ", " + sap.ushell.resources.i18n.getText("dataSource")
                }).toStatic();
                button.addAriaLabelledBy(buttonAriaLabel);
                button.addDependent(buttonAriaLabel);

                return button;
            });

            tabBar._setupItemNavigation = function() {
                if (!this.theItemNavigation) {
                    this.theItemNavigation = new sap.ui.core.delegate.ItemNavigation();
                    this.addDelegate(this.theItemNavigation);
                }
                this.theItemNavigation.setCycling(false);
                this.theItemNavigation.setRootDomRef(this.getDomRef());
                var itemDomRefs = [];
                var content = this.getContent();
                for (var i = 0; i < content.length; i++) {
                    if (!$(content[i].getDomRef()).attr("tabindex")) {
                        var tabindex = "-1";
                        if (content[i].getPressed && content[i].getPressed()) {
                            tabindex = "0";
                        }
                        $(content[i].getDomRef()).attr("tabindex", tabindex);
                    }
                    itemDomRefs.push(content[i].getDomRef());
                }

                var overflowButton = this.getAggregation("_overflowButton");
                if (overflowButton && overflowButton.getDomRef) {
                    var _overflowButton = overflowButton.getDomRef();
                    itemDomRefs.push(_overflowButton);
                    $(_overflowButton).attr("tabindex", "-1");
                }

                this.theItemNavigation.setItemDomRefs(itemDomRefs);
            };

            tabBar.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    var that = this;

                    that.getAggregation("_overflowButton").addEventDelegate({
                        onAfterRendering: function(oEvent) {
                            that._setupItemNavigation();
                        }
                    }, that.getAggregation("_overflowButton"));

                    that._setupItemNavigation();
                }
            }, tabBar);

            return tabBar;
        },

        reorgTabBarSequence: function() {
            if (!this.tabBar) {
                return;
            }
            var highLayout = new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.High
            });
            var neverOverflowLayout = new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.NeverOverflow
            });

            var aButtons = this.tabBar.getContent();
            for (var i = 0; i < aButtons.length; i++) {
                if (this.getModel().getProperty('/tabStrips/selected').equals(aButtons[i].getBindingContext().getObject())) {
                    aButtons[i].setLayoutData(neverOverflowLayout);
                } else {
                    aButtons[i].setLayoutData(highLayout);
                }

            }

        },

        // display switch tap strips
        // ===================================================================
        assembleDisplaySwitchTapStrips: function() {
            var that = this;
            var oSegmentedButton = new sap.m.SegmentedButton('ResultViewType', {
                selectedKey: {
                    parts: [{
                        path: '/resultToDisplay'
                    }],
                    formatter: function(resultToDisplay) {
                        if (resultToDisplay === "searchResultTable") {
                            return "table";
                        } else if (resultToDisplay === "searchResultList") {
                            return "list";
                        } else if (resultToDisplay === "searchResultMap") {
                            return "map";
                        }
                    }
                },
                items: [
                    new sap.m.SegmentedButtonItem({
                        icon: "sap-icon://list",
                        tooltip: sap.ushell.resources.i18n.getText("displayList"),
                        key: "list"
                    }),
                    new sap.m.SegmentedButtonItem({
                        icon: "sap-icon://table-view",
                        tooltip: sap.ushell.resources.i18n.getText("displayTable"),
                        key: "table"
                    }),
                    new sap.m.SegmentedButtonItem({
                        icon: "sap-icon://map",
                        tooltip: sap.ushell.resources.i18n.getText("displayMap"),
                        key: "map",
                        visible: false
                    })

                ],
                enabled: {
                    parts: [{
                        path: '/displaySwitchVisibility'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(displaySwitchVisibility, count) {
                        return displaySwitchVisibility && count !== 0;
                    }
                },
                /*eslint-disable no-extra-bind*/
                select: function(eObj) {
                    var key = eObj.mParameters.key;
                    var model = that.getModel();
                    switch (key) {
                        case "list":
                            model.setProperty('/resultToDisplay', "searchResultList");
                            //                            that.showMoreFooter.setVisible(true);
                            that.searchResultMap.setVisible(false);
                            break;
                        case "table":
                            model.setProperty('/resultToDisplay', "searchResultTable");
                            //                            that.showMoreFooter.setVisible(true);
                            that.searchResultMap.setVisible(false);
                            break;
                        case "map":
                            model.setProperty('/resultToDisplay', "searchResultMap");
                            that.searchResultMap.setVisible(true);
                            //                            that.showMoreFooter.setVisible(false);
                            break;
                        default:
                            model.setProperty('/resultToDisplay', "searchResultList");
                            //                            that.showMoreFooter.setVisible(true);
                    }
                    model.enableOrDisableMultiSelection();
                }.bind(this),
                /*eslint-enable no-extra-bind*/
                visible: jQuery.extend({}, this.searchToolbarEntryVisibility) // UI5 needs deep copy
            });

            oSegmentedButton.addEventDelegate({
                onBeforeRendering: function(oEvent) {
                    if (that.getModel().config.maps) {
                        oSegmentedButton.getItems()[2].setVisible(true);
                    }
                }
            });

            return oSegmentedButton;
        },

        // center area
        // ===================================================================
        assembleCenterArea: function() {
            var that = this;

            // sort dialog
            that.tableSortDialog = that.assembleSearchResultSortDialog();

            // search result list
            var searchResultList = that.assembleSearchResultList();
            // search result table
            that.searchResultTable = that.assembleSearchResultTable();
            that.searchResultTable.addDelegate({
                onBeforeRendering: function() {
                    that.updateTableLayout();
                }
            });
            that.searchResultMap = that.assembleSearchResultMap();
            // app search result
            that.appSearchResult = that.assembleAppSearch();
            // show more footer
            that.showMoreFooter = that.assembleShowMoreFooter();

            return [that.tableSortDialog, searchResultList, that.searchResultTable, that.searchResultMap, that.appSearchResult, that.showMoreFooter];
        },

        // sort dialog
        // ===================================================================
        assembleSearchResultSortDialog: function() {
            var that = this;
            var tableSortDialog = new sap.m.ViewSettingsDialog({
                sortDescending: {
                    parts: [{
                        path: "/orderBy"
                    }],
                    formatter: function(orderBy) {
                        return jQuery.isEmptyObject(orderBy) || orderBy.sortOrder === "DESC";
                    }
                },
                confirm: function(evt) {
                    var mParams = [];
                    mParams = evt.getParameters();
                    if (mParams.sortItem) {
                        var oCurrentModel = that.getModel();
                        if (mParams.sortItem.getKey() === "ushellSearchDefaultSortItem") {
                            oCurrentModel.resetOrderBy();
                            tableSortDialog.setSortDescending(true);
                        } else {
                            oCurrentModel.setOrderBy({
                                orderBy: mParams.sortItem.getKey(),
                                sortOrder: mParams.sortDescending === true ? "DESC" : "ASC"
                            });
                        }
                    }
                },
                cancel: function(evt) {
                    // reset slected value to the last sort column item
                    var lastSortColumnKey = that.getModel().getOrderBy().orderBy === undefined ? "ushellSearchDefaultSortItem" : that.getModel().getOrderBy().orderBy;
                    this.setSelectedSortItem(lastSortColumnKey);
                }
            });

            tableSortDialog.bindAggregation("sortItems", "/tableSortableColumns", function(path, bData) {
                return new sap.m.ViewSettingsItem({
                    key: "{key}",
                    text: "{name}",
                    selected: "{selected}" // Not binding because of setSlected in ItemPropertyChanged event
                });
            });

            return tableSortDialog;
        },

        // main result table
        // ===================================================================
        assembleSearchResultTable: function() {
            var that = this;
            var resultTable = new SearchResultTable("ushell-search-result-table", {
                mode: {
                    parts: [{
                        path: '/multiSelectionEnabled'
                    }],
                    formatter: function(multiSelectionEnabled) {
                        return multiSelectionEnabled === true ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
                    }
                },
                //                fixedLayout: false,
                noDataText: '{i18n>noCloumnsSelected}',
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(resultToDisplay, count) {
                        return resultToDisplay === "searchResultTable" && count !== 0;
                    }
                },
                rememberSelections: false
                    //                ,
                    //                selectionChange: function(event) {
                    //                    // write "selected" into model
                    //                    // UI5 has issue of two way binding
                    //                    var items = event.getParameters().listItems;
                    //                    var i;
                    //                    if (event.getParameters().selected) {
                    //                        for (i = 0; i < items.length; i++) {
                    //                            items[i].getBindingContext().getObject().selected = true;
                    //                        }
                    //                    } else {
                    //                        for (i = 0; i < items.length; i++) {
                    //                            items[i].getBindingContext().getObject().selected = false;
                    //                        }
                    //                    }
                    //                }
            });

            //            resultTable.addDelegate({
            //                onAfterRendering: function() {
            //                    // update "selected" from model
            //                    // UI5 has issue of two way binding
            //                    if (resultTable.getMode() === sap.m.ListMode.MultiSelect) {
            //                        var selectedTableItems = resultTable.getItems();
            //                        for (var i = 0; i < selectedTableItems.length; i++) {
            //                            if (selectedTableItems[i].getBindingContext().getObject().selected === true) {
            //                                selectedTableItems[i].setSelected(true);
            //                            } else {
            //                                selectedTableItems[i].setSelected(false);
            //                            }
            //                        }
            //                    }
            //                }
            //            });

            resultTable.bindAggregation("columns", "/tableColumns", function(path, bData) {
                var tableColumn = bData.getObject();
                var column = new sap.m.Column(tableColumn.key, {
                    header: new sap.m.Label({
                        text: "{name}",
                        tooltip: "{name}"
                    }),
                    visible: {
                        parts: [{
                            path: 'index'
                        }],
                        formatter: function(index) {
                            return index < 5; // first 5 attributes are visible, including title
                        }
                    }
                });
                return column;
            });

            resultTable.bindAggregation("items", "/tableResults", function(path, bData) {
                return that.assembleTableItems(bData);
            });

            resultTable.addEventDelegate({
                onAfterRendering: function() {
                    that.updatePersoServiceAndController();
                }
            });

            return resultTable;
        },

        // assemble search result table item
        // ===================================================================
        assembleTableItems: function(bData) {
            var that = this;
            var oData = bData.getObject();
            if (oData.type === 'footer') {
                //                that.showMoreFooter.setVisible(true);
                return new sap.m.CustomListItem({
                    visible: false
                }); // return empty list item
            } else {
                return that.assembleTableMainItems(oData, bData.getPath());
            }
        },

        assembleTableMainItems: function(oData, path) {
            var that = this;
            that.oCrossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
            var subPath = path + "/itemattributes";
            var columnListItem = new sap.m.ColumnListItem({
                // one way binding of "selected"
                // UI5 has issue of two way binding
                selected: "{selected}"
                    //                selected: {
                    //                    parts: [{
                    //                        path: 'selected'
                    //                    }],
                    //                    formatter: function(selected) {
                    //                        return selected;
                    //                    }
                    //                    ,
                    //                    mode: sap.ui.model.BindingMode.OneWay
                    //                }
            });
            columnListItem.bindAggregation("cells", subPath, function(subPath, bData) {
                if (bData.getObject().isTitle) {
                    // build title cell
                    var titleUrl = "";
                    var target;
                    var titleNavigation = bData.getObject().titleNavigation;
                    if (titleNavigation) {
                        titleUrl = titleNavigation.getHref();
                        target = titleNavigation.getTarget();
                    }
                    var enabled = (titleUrl && titleUrl.length > 0) ? true : false;
                    var titleLink = new SearchLink({
                        text: "{value}",
                        tooltip: {
                            parts: [{
                                path: 'value'
                            }],
                            formatter: function(value) {
                                return $("<div>" + value + "</div>").text();
                            }
                        },
                        enabled: enabled,
                        href: titleUrl,
                        press: function() {
                            var titleUrl = "";
                            var titleNavigation = bData.getObject().titleNavigation;
                            if (titleNavigation) {
                                titleUrl = titleNavigation.getHref();
                            }
                            // logging for enterprise search concept of me
                            var oNavEventLog = new SearchLogger.NavigationEvent();
                            oNavEventLog.addUserHistoryEntry(titleUrl);
                            // logging for usage analytics
                            var model = sap.ushell.renderers.fiori2.search.getModelSingleton();
                            model.analytics.logCustomEvent('FLP: Search', 'Launch Object', [titleUrl]);
                        }
                    });
                    if (target) {
                        titleLink.setTarget(target);
                    }
                    return titleLink;
                } else if ((bData.getObject().isNavigationObjects)) {
                    // build related objects aka navigation objects cell
                    var navigationObjects = bData.getObject().navigationObjects;
                    var navigationButtons = [];
                    var navigationButton = {};
                    /*eslint-disable no-loop-func*/
                    for (var i = 0; i < navigationObjects.length; i++) {
                        var navigationObject = navigationObjects[i];
                        navigationButton = new sap.m.Button({
                            text: navigationObject.getText(),
                            tooltip: navigationObject.getText(),
                            press: function() {
                                navigationObject.performNavigation();
                            }
                        });
                        navigationButtons.push(navigationButton);
                    }
                    /*eslint-enable no-loop-func*/

                    return new sap.m.Button({
                        icon: "sap-icon://action",
                        press: function() {
                            var actionSheet = new sap.m.ActionSheet({
                                buttons: navigationButtons
                            });
                            actionSheet.openBy(this);
                        }
                    });
                } else {
                    // build other cells
                    return new SearchLabel({
                        text: "{value}",
                        tooltip: {
                            parts: [{
                                path: 'value'
                            }],
                            formatter: function(value) {
                                return $("<div>" + value + "</div>").text();
                            }
                        }
                    });
                }
            });

            return columnListItem;
        },
        // assemble show more table
        // ===================================================================

        onRegionClick: function(e) {
            //alert("onRegionClick " + e.getParameter("code"));
        },

        onRegionContextMenu: function(e) {
            //alert("onRegionContextMenu: " + e.getParameter("code"));
        },
        assembleSearchResultMap: function() {
            //var that = this;
            var oSearchResultMap;

            var appId = "yPAjYBbnvu87r-bURAc-";
            var appCode = "m3WAJo5rFmc5BG1IxJ3d2w";
            var oMapConfig = {
                "MapProvider": [{
                    "name": "HEREMAPS",
                    "type": "",
                    "description": "",
                    "tileX": "256",
                    "tileY": "256",
                    "maxLOD": "20",
                    "copyright": "Tiles Courtesy of HERE Maps",
                    "Source": [{
                        "id": "s1",
                        "url": "http://1.maps.nlp.nokia.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png?app_code=" + appCode + "&app_id=" + appId
                    }, {
                        "id": "s2",
                        "url": "http://2.maps.nlp.nokia.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png?app_code=" + appCode + "&app_id=" + appId
                    }]
                }],
                "MapLayerStacks": [{
                    "name": "DEFAULT",
                    "MapLayer": {
                        "name": "layer1",
                        "refMapProvider": "HEREMAPS",
                        "opacity": "1.0",
                        "colBkgnd": "RGB(255,255,255)"
                    }
                }]
            };


            oSearchResultMap = new sap.ui.vbm.GeoMap({
                legendVisible: false,
                scaleVisible: false.$anchorScroll,
                refMapLayerStack: 'DEFAULT',
                mapConfiguration: oMapConfig,
                visible: false
            });

            oSearchResultMap.setMapConfiguration(oMapConfig);
            /*
                        oSearchResultMap.addEventDelegate({
                            onBeforeRendering: function(oEvent) {
                                that.doDataCall(oSearchResultMap);
                            }
                        });
            */
            //that.doDataCall(oSearchResultMap);
            return oSearchResultMap;
        },
        doDataCall: function(oSearchResultMap) {


            $.get('/es/map').then(function(result) {
                //result = JSON.parse(result);
                var spotList = [];
                for (var i = 0; i < result.length; ++i) {
                    var city = result[i].City;
                    var loc = JSON.parse(result[i].LOC_4326_GEOJSON);
                    var long = loc.coordinates[0];
                    var lat = loc.coordinates[1];
                    var spot = new sap.ui.vbm.Spot({
                        position: long + ';' + lat + ';0',
                        text: city
                    });
                    //spot.setContentColor("RGB(255,0,0)");
                    spotList.push(spot);
                }
                var spots = new sap.ui.vbm.Spots({
                    items: spotList
                });
                oSearchResultMap.addVo(spots);
            });

            /*
                        jQuery.ajax({
                            url: '/es/map',
                            success: function(result) {
                                if (result.isOk === false) {
                                    alert(result.message);
                                } else {
                                    var spotList = [];
                                    for (var i = 0; i < result.length; ++i) {
                                        var city = result[i].City;
                                        var loc = JSON.parse(result[i].LOC_4326_GEOJSON);
                                        var long = loc.coordinates[0];
                                        var lat = loc.coordinates[1];
                                        var spot = new sap.ui.vbm.Spot({
                                            position: long + ';' + lat + ';0',
                                            text: city
                                        });
                                        spotList.push(spot);
                                    }
                                    var spots = new sap.ui.vbm.Spots({
                                        items: spotList
                                    });
                                    oSearchResultMap.addVo(spots);
                                    //return oSearchResultMap;



                                }
                            },
                            async: false
                        });
            			*/
        },
        // assemble show more footer
        // ===================================================================
        assembleShowMoreFooter: function() {
            var that = this;
            var button = new sap.m.Button({
                text: "{i18n>showMore}",
                type: sap.m.ButtonType.Transparent,
                press: function() {
                    var oCurrentModel = that.getModel();
                    oCurrentModel.setProperty('/focusIndex', oCurrentModel.getTop());
                    var newTop = oCurrentModel.getTop() + oCurrentModel.pageSize;
                    oCurrentModel.setTop(newTop);
                }
            });
            button.addStyleClass('sapUshellResultListMoreFooter');
            var container = new sap.m.FlexBox({ /* footer item in model no longer needed -> remove*/
                visible: {
                    parts: [{
                        path: '/boCount'
                    }, {
                        path: '/boResults'
                    }],
                    formatter: function(boCount, boResults) {
                        //                        switch (resultToDisplay) {
                        //                            case 'searchResultTable':
                        //                                return tableResults.length < boCount;
                        //                            case 'searchResultList':
                        //                                return boResults.length < boCount;
                        //                        }
                        return boResults.length < boCount;
                    }
                },
                justifyContent: sap.m.FlexJustifyContent.Center
            });
            container.addStyleClass('sapUshellResultListMoreFooterContainer');
            container.addItem(button);
            return container;
        },

        // main result list
        // ===================================================================
        assembleSearchResultList: function() {

            var that = this;

            that.resultList = new SearchResultList({
                mode: sap.m.ListMode.None,
                width: "auto",
                showNoData: false,
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(resultToDisplay, count) {
                        return resultToDisplay === "searchResultList" && count !== 0;
                    }
                }
            });

            that.resultList.bindAggregation("items", "/results", function(path, oContext) {
                return that.assembleListItem(oContext);
            });

            return that.resultList;
        },

        // app search area
        // ===================================================================
        assembleAppSearch: function() {

            var that = this;

            // tiles container
            var tileContainer = new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({
                maxRows: 99999,
                totalLength: '{/appCount}',
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(resultToDisplay, count) {
                        return resultToDisplay === "appSearchResult" && count !== 0;
                    }
                },
                highlightTerms: '{/uiFilter/searchTerms}',
                showMore: function() {
                    var model = that.getModel();
                    model.setProperty('/focusIndex', tileContainer.getNumberDisplayedTiles() - 1);
                    var newTop = model.getTop() + model.pageSize * tileContainer.getTilesPerRow();
                    model.setTop(newTop);
                }
            });

            tileContainer.bindAggregation('tiles', '/appResults', function(sId, oContext) {
                return that.getTileView(oContext.getObject().tile);
            });
            tileContainer.addStyleClass('sapUshellSearchTileResultList');

            sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged', function() {
                tileContainer.delayedRerender();
            }, this);

            return tileContainer;
        },

        // assemble title item
        // ===================================================================
        assembleTitleItem: function(oData) {
            var item = new sap.m.CustomListItem();
            var title = new sap.m.Label({
                text: "{title}"
            });
            title.addStyleClass('bucketTitle');
            item.addStyleClass('bucketTitleContainer');
            item.addContent(new sap.m.HBox({
                items: [title]
            }));
            return item;
        },

        // assemble app container result list item
        // ===================================================================
        assembleAppContainerResultListItem: function(oData, path) {
            var that = this;
            var container = new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({
                maxRows: sap.ui.Device.system.phone ? 2 : 1,
                totalLength: '{/appCount}',
                highlightTerms: '{/uiFilter/searchTerms}',
                enableKeyHandler: false,
                resultList: that.resultList,
                showMore: function() {
                    var model = that.getModel();
                    model.setDataSource(model.appDataSource);
                }
            });
            container.bindAggregation('tiles', 'tiles', function(sId, oContext) {
                return that.getTileView(oContext.getObject().tile);
            });

            var listItem = new sap.m.CustomListItem({
                content: container
            });
            listItem.addStyleClass('sapUshellSearchResultListItem');
            listItem.addStyleClass('sapUshellSearchResultListItemApps');

            listItem.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    var $listItem = $(listItem.getDomRef());
                    $listItem.removeAttr("tabindex");
                    $listItem.removeAttr("role");
                    $listItem.attr("aria-hidden", "true");
                }
            }, listItem);

            sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged', function() {
                container.delayedRerender();
            }, this);

            return listItem;
        },

        // assemble search result list item
        // ===================================================================
        assembleResultListItem: function(oData, path) {
            /* eslint new-cap:0 */
            var dataSourceConfig = this.getModel().config.getDataSourceConfig(oData.dataSource);

            var searchResultListItemSettings = {
                title: "{$$Name$$}",
                titleUrl: "{uri}",
                titleNavigation: "{titleNavigation}",
                type: "{dataSource/label}",
                imageUrl: "{imageUrl}",
                attributes: "{itemattributes}",
                navigationObjects: "{navigationObjects}",
                selected: "{selected}",
                expanded: "{expanded}"
            };

            var item;
            if (dataSourceConfig.searchResultListItemControl) {
                item = new dataSourceConfig.searchResultListItemControl(searchResultListItemSettings);
            } else if (dataSourceConfig.searchResultListItemContentControl) {
                searchResultListItemSettings.content = new dataSourceConfig.searchResultListItemContentControl();
                item = new CustomSearchResultListItem(searchResultListItemSettings);
            } else {
                item = new SearchResultListItem(searchResultListItemSettings);
            }

            var listItem = new sap.m.CustomListItem({
                content: item
            });
            listItem.addStyleClass('sapUshellSearchResultListItem');

            if (item.setParentListItem) {
                item.setParentListItem(listItem);
            }

            return listItem;
        },

        // assemble search result list item
        // ===================================================================
        assembleListItem: function(oContext) {
            var that = this;
            var oData = oContext.getObject();
            if (oData.type === 'title') {
                return that.assembleTitleItem(oData);
            } else if (oData.type === 'footer') {
                //                that.showMoreFooter.setVisible(true);
                return new sap.m.CustomListItem(); // return empty list item
            } else if (oData.type === 'appcontainer') {
                return that.assembleAppContainerResultListItem(oData, oContext.getPath());
            } else {
                return that.assembleResultListItem(oData, oContext.getPath());
            }
        },


        // get tile view
        // ===================================================================
        getTileView: function(tile) {
            // try to set render mode as tile
            try {
                var typesContract = tile.getContract('types');
                typesContract.setType('tile');
            } catch (e) { /* nothing to do.. */ }
            // create view
            var view = sap.ushell.Container.getService('LaunchPage').getCatalogTileView(tile);
            // set title for usage analytics logging
            if (tile.getTitle) {
                view.usageAnalyticsTitle = tile.getTitle();
            } else {
                view.usageAnalyticsTitle = 'app';
            }
            return view;
        },

        // event handler search started
        // ===================================================================
        onAllSearchStarted: function() {
            //            var that = this;
            //            that.showMoreFooter.setVisible(false);
        },

        // event handler search finished
        // ===================================================================
        onAllSearchFinished: function() {
            var that = this;
            that.reorgTabBarSequence();
            that.oFocusHandler.setFocus();
            //that.updatePersoServiceAndController();
            var viewPortContainer = sap.ui.getCore().byId('viewPortContainer');
            if (viewPortContainer && viewPortContainer.switchState) {
                viewPortContainer.switchState('Center');
            }
        },

        updatePersoServiceAndController: function() {
            var that = this;
            var model = that.getModel();
            var dsKey = model.getDataSource().key;

            if (!that.oTablePersoController) {
                var personalizationStorageInstance = model.getPersonalizationStorageInstance();
                that.oTablePersoController = new sap.m.TablePersoController({
                    table: sap.ui.getCore().byId("ushell-search-result-table"),
                    persoService: personalizationStorageInstance.getPersonalizer('search-result-table-state-' + dsKey)
                }).activate();
                that.oTablePersoController.refresh();
            }
            if (that.oTablePersoController &&
                that.oTablePersoController.getPersoService().getKey() !== 'search-result-table-state-' + dsKey) {
                that.oTablePersoController.setPersoService(model.getPersonalizationStorageInstance().getPersonalizer('search-result-table-state-' + dsKey));
                that.oTablePersoController.refresh();
            }
        },

        // set table layout
        // fixed or NOT fixed
        // ===================================================================
        updateTableLayout: function() {
            var that = this;
            if (that.searchResultTable) {
                var columns = that.searchResultTable.getColumns();
                var visibleCloumns = 0;
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].getVisible()) {
                        visibleCloumns++;
                    }
                }
                if (visibleCloumns <= 3) {
                    that.searchResultTable.setFixedLayout(false);
                } else {
                    that.searchResultTable.setFixedLayout(true);
                }
            }
        },


        // set appview container
        // ===================================================================
        setAppView: function(oAppView) {
            var that = this;
            that.oAppView = oAppView;
            if (that.oTilesContainer) {
                that.oTilesContainer.setAppView(oAppView);
            }
        },

        // get controller name
        // ===================================================================
        getControllerName: function() {
            return "sap.ushell.renderers.fiori2.search.container.Search";
        }
    });


}(window));
