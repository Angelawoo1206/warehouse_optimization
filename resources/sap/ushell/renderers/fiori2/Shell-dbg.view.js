// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function() {
    "use strict";
    /*global jQuery, sap, location, window, clearTimeout, setTimeout */
    jQuery.sap.require("sap.ushell.renderers.fiori2.Navigation");
    jQuery.sap.require("sap.ushell.ui.shell.ShellLayout");
    jQuery.sap.require("sap.ushell.UserActivityLog");
    jQuery.sap.require("sap.ushell.ui.launchpad.ActionItem");
    jQuery.sap.require("sap.ushell.ui.launchpad.ViewPortContainer");
    jQuery.sap.require("sap.ushell.ui.shell.FloatingContainer");
    jQuery.sap.require("sap.ushell.ui.shell.NavigationMiniTile");
    jQuery.sap.require("sap.ushell.ui.launchpad.Fiori2LoadingDialog");

    sap.ui.jsview("sap.ushell.renderers.fiori2.Shell", {
        /**
         * Most of the following code acts just as placeholder for new Unified Shell Control.
         *
         * @param oController
         * @returns {sap.ushell.ui.Shell}
         * @public
         */
        createContent: function (oController) {
            var that = this,
                oViewData = this.getViewData() || {},
                oConfig = oViewData.config || {},
                bStateEmbedded = (oConfig.appState === "embedded") ? true : false,
                fnShellUpdateAggItem = function (sId, oContext) {
                    return sap.ui.getCore().byId(oContext.getObject());
                },
                oFiori2LoadingDialog = new sap.ushell.ui.launchpad.Fiori2LoadingDialog({
                    id: "Fiori2LoadingDialog",
                    text: ""
                }),
                oConfigButton = new sap.ushell.ui.shell.ShellHeadItem({
                    id: "configBtn",
                    tooltip: "{i18n>showGrpsBtn_tooltip}",
                    ariaLabel: "{i18n>showGrpsBtn_tooltip}",
                    icon: sap.ui.core.IconPool.getIconURI("menu2"),
                    selected: {
                        path: "/currentState/showPane"
                    },
                    press: [oController.togglePane, oController]
                }),
                sBackButtonIcon = sap.ui.getCore().getConfiguration().getRTL() ? "feeder-arrow" : "nav-back",
                oHomeButton = new sap.ushell.ui.shell.ShellHeadItem({
                    id: "homeBtn",
                    tooltip: "{i18n>homeBtn_tooltip}",
                    ariaLabel: "{i18n>homeBtn_tooltip}",
                    icon: sap.ui.core.IconPool.getIconURI("home"),
                    target: oConfig.rootIntent ? "#" + oConfig.rootIntent : "#"
                }),
                oBackButton = new sap.ushell.ui.shell.ShellHeadItem({
                    id: "backBtn",
                    tooltip: "{i18n>backBtn_tooltip}",
                    ariaLabel: "{i18n>backBtn_tooltip}",
                    icon: sap.ui.core.IconPool.getIconURI(sBackButtonIcon),
                    press: oController._navBack.bind(oController)
                }),
                oViewPortContainer;

            oBackButton.setShowSeparator(false);
            oHomeButton.setShowSeparator(false);
            oHomeButton.addEventDelegate({
                onsapskipback: function (oEvent) {
                    if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                    }
                },
                onsapskipforward: function (oEvent) {
                    if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                    }
                }
            });
            oConfigButton.addEventDelegate({
                onsapskipforward: function (oEvent) {
                    if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                    }
                },
                onfocusin: function () {
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = true;
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = true;
                }
            });

            this.aDanglingControls = [];

            var oActionsUserButton,
                origNotificationsToggleAfterRender,
                oNotificationToggle,
                oMeAreaToggle,
                origMeAreaToggleAfterRender;

            oViewPortContainer = this.initViewPortContainer(oController);

            if (oConfig.enableNotificationsUI === true) {

                // Define the notifications counter ShellHeadItem control
                oNotificationToggle = new sap.ushell.ui.shell.ShellHeadItem({
                    id: "NotificationsCountButton",
                    icon: sap.ui.core.IconPool.getIconURI("ui-notifications"),
                    floatingNumber: {
                        parts: ["/notificationsCount"],
                        formatter: function (notificationsCount) {
                            //set aria label
                            var jsButton = this.getDomRef(),
                                ariaLabelValue = "";

                            if (jsButton) {
                                if (notificationsCount > 0) {
                                    ariaLabelValue = sap.ushell.resources.i18n.getText("NotificationToggleButtonCollapsed", notificationsCount);
                                } else {
                                    ariaLabelValue = sap.ushell.resources.i18n.getText("NotificationToggleButtonCollapsedNoNotifications");
                                }
                                jsButton.setAttribute("aria-label", ariaLabelValue);
                            }

                            return notificationsCount;
                        }
                    },
                    visible: "{/enableNotifications}",
                    selected: {
                        path: "/currentViewPortState",
                        formatter: function (viewPortState) {
                            if (viewPortState === 'RightCenter') {
                                return true;
                            }
                            return false;
                        }
                    },
                    press: [oController.toggleNotificationsView, oController],
                    showSeparator: false,
                    tooltip: sap.ushell.resources.i18n.getText("NotificationToggleButtonExpanded")
                });

                origNotificationsToggleAfterRender = oNotificationToggle.onAfterRendering;
                oNotificationToggle.onAfterRendering = function () {
                    if (origNotificationsToggleAfterRender) {
                        origNotificationsToggleAfterRender.apply(this, arguments);
                    }
                    jQuery(this.getDomRef()).attr("aria-pressed", oController.bNotificationsSelected);
                    if (this.getDisplayFloatingNumber() > 0) {
                        jQuery(this.getDomRef()).attr("aria-label", sap.ushell.resources.i18n.getText("NotificationToggleButtonCollapsed", this.getDisplayFloatingNumber()));
                    } else {
                        jQuery(this.getDomRef()).attr("aria-label", sap.ushell.resources.i18n.getText("NotificationToggleButtonCollapsedNoNotifications"));
                    }
                };

                oNotificationToggle.addEventDelegate({
                    onsapskipforward: function (oEvent) {
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bForwardNavigation = true;
                        oEvent.preventDefault();
                        jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                    },
                    onsaptabnext: function (oEvent) {
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bForwardNavigation = true;
                        oEvent.preventDefault();
                        jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                    },
                    onsapskipback: function (oEvent) {
                        if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                        }
                    }
                });
                this.aDanglingControls.push(oNotificationToggle);
            }

            oMeAreaToggle = new sap.ushell.ui.shell.ShellHeadItem({
                id: "meAreaHeaderButton",
                tooltip: sap.ushell.Container.getUser().getFullName(),
                icon: 'sap-icon://person-placeholder',
                selected: {
                    path: "/currentViewPortState",
                    formatter: function (viewPortState) {
                        if (viewPortState === 'LeftCenter') {
                            return true;
                        }
                        return false;
                    }
                },
                press: [oController.toggleMeAreaView, oController],
                visible: true,
                showSeparator: false,
                ariaLabel: "{i18n>MeAreaToggleButtonAria}"
            });

            origMeAreaToggleAfterRender = oMeAreaToggle.onAfterRendering;
            oMeAreaToggle.onAfterRendering = function () {
                if (origMeAreaToggleAfterRender) {
                    origMeAreaToggleAfterRender.apply(this, arguments);
                }
                jQuery(this.getDomRef()).attr("aria-pressed", oController.bMeAreaSelected);
            };

            oMeAreaToggle.addEventDelegate({
                onsapskipforward: function (oEvent) {
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bForwardNavigation = true;
                    oEvent.preventDefault();
                    jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                },
                onsaptabprevious: function (oEvent) {
                    var viewPort = sap.ui.getCore().byId('viewPortContainer'),
                        sCurrentState = viewPort.getCurrentState(),
                        oRecentItemsList;

                    switch (sCurrentState) {
                    case "LeftCenter":
                        oRecentItemsList = jQuery("#meAreaIconTabBar-content li:first");
                        if (oRecentItemsList.length > 0) {
                            oRecentItemsList[0].focus();
                        } else {
                            if (oConfig.enableRecentActivity) {
                                jQuery("#meAreaIconTabBar .sapMITBText")[0].focus();
                            } else {
                                oEvent.preventDefault();
                                jQuery('.sapUshellActionItem:last')[0].focus();
                            }
                        }
                        break;
                    case "RightCenter":
                        // TODO
                        break;
                    case "Center":
                        if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                        }
                        break;
                    }
                },
                onsapskipback: function (oEvent) {

                    // When the focus is on the MeArea icon and MeArea is opened (i.e. case "LeftCenter") -
                    // SHIFT+F6 should move the focus to the Recently Used list

                    var viewPort = sap.ui.getCore().byId('viewPortContainer'),
                        sCurrentState = viewPort.getCurrentState(),
                        oNextElement;

                    switch (sCurrentState) {
                    case "LeftCenter":
                        oEvent.preventDefault();
                        oNextElement = jQuery("#meAreaIconTabBar .sapMITBSelected");
                        if (oNextElement.length === 0) {
                            oNextElement = jQuery(".sapUshellActionItem");
                        }
                        oNextElement[0].focus();
                        break;
                    case "RightCenter":
                        // TODO
                        break;
                    case "Center":
                        if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                        }
                        break;
                    }
                }
            });
            this.aDanglingControls.push(oMeAreaToggle);

            //handle open catalog
            if (oConfig.enablePersonalization !== false) {
                var oOpenCatalogItem = new sap.ushell.ui.launchpad.ActionItem("openCatalogBtn", {
                    text: sap.ushell.resources.i18n.getText("open_appFinderBtn"),
                    icon: 'sap-icon://sys-find',
                    actionType: 'action',
                    press: function () {
                        jQuery.sap.measure.start("FLP:AppFinderLoadingStartToEnd", "AppFinderLoadingStartToEnd","FLP");

                        // perform the navigation only after the viewport animation ends and the center vireport is active
                        setTimeout(function() {
                            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                            oCrossAppNavigator.toExternal({
                                target: {
                                    shellHash: "#Shell-home&/appFinder/catalog"
                                }
                            });
                        }, !!sap.ui.Device.system.desktop ? 0 : 500);
                    },
                    visible: !oConfig.disableAppFinder
                });

                // if xRay is enabled
                if (oConfig.enableHelp) {
                    oOpenCatalogItem.addStyleClass('help-id-openCatalogActionItem');// xRay help ID
                }
                this.aDanglingControls.push(oOpenCatalogItem);
            }

            /**
             * create EndItem overflow button in case me area is on
             * this will open an action sheet in case we there is not
             * enough space to show all button in the header
             */
            var oEndItemsOverflowBtn = new sap.ushell.ui.shell.ShellHeadItem({
                id: "endItemsOverflowBtn",
                tooltip: "{i18n>shellHeaderOverflowBtn_tooltip}",
                ariaLabel: "{i18n>shellHeaderOverflowBtn_tooltip}",
                icon: "sap-icon://overflow",
                press: [oController.pressEndItemsOverflow, oController],
                visible: true,
                showSeparator: false
            });
            this.aDanglingControls.push(oEndItemsOverflowBtn);

            var oShellSplitContainer = new sap.ushell.ui.shell.SplitContainer({
                id: 'shell-split',
                showSecondaryContent: {
                    path: "/currentState/showPane"
                },
                secondaryContent: {
                    path: "/currentState/paneContent",
                    factory: fnShellUpdateAggItem
                },
                content: oViewPortContainer,
                subHeader: {
                    path: "/currentState/subHeader",
                    factory: fnShellUpdateAggItem
                }
            });
            var oShellToolArea = new sap.ushell.ui.shell.ToolArea({
                id: 'shell-toolArea',
                toolAreaItems: {
                    path: "/currentState/toolAreaItems",
                    factory: fnShellUpdateAggItem
                }
            });
            var oRightFloatingContainer = new sap.ushell.ui.shell.RightFloatingContainer({
                id: 'right-floating-container',
                top: '6.875', // header 2.875rem + dashboard notifications preview margin top 4rem
                hideItemsAfterPresentation: true,
                visible: '{/currentState/showRightFloatingContainer}',
                floatingContainerItems: {
                    path: "/currentState/RightFloatingContainerItems",
                    factory: fnShellUpdateAggItem
                }
            });
            var oShellFloatingContainer = new sap.ushell.ui.shell.FloatingContainer({
                id: 'shell-floatingContainer',
                content: {
                    path: "/currentState/floatingContainerContent",
                    factory: fnShellUpdateAggItem
                }
            });
            var oShellHeaderTitle = new sap.ushell.ui.shell.ShellTitle("shellTitle", {
                text: {
                    path: "/title"
                }
            });

            var oShellHeaderAppTitle;


            var oHierarchyTemplateFunction = function(sId, oContext) {

                // default icon behavior
                var sIcon = oContext.getProperty("icon");
                var sTitle = oContext.getProperty("title");
                var sSubtitle = oContext.getProperty("subtitle");
                var sIntent = oContext.getProperty("intent");
                if (!sIcon) {
                    sIcon = "sap-icon://circle-task-2";
                }

                var oLi =  (new sap.m.StandardListItem({
                    type: sap.m.ListType.Active,
                    title: sTitle,
                    description: sSubtitle,
                    icon: sIcon,
                    customData: [new sap.ui.core.CustomData({
                        key: "intent",
                        value: sIntent
                    })],
                    press: function(oEvent) {
                        var oData = oEvent.getSource().getCustomData();
                        if (oData && oData.length > 0) {
                            for (var i=0; i<oData.length; i++) {
                                if (oData[i].getKey() === "intent") {

                                    var sListItemIntent = oData[i].getValue();
                                    if (sListItemIntent && sListItemIntent[0] === "#") {
                                        oController.navigateFromShellApplicationNavigationMenu(sListItemIntent);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                })).addStyleClass("sapUshellNavigationMenuListItems");

                return oLi;
            };

            var oRelatedAppsTemplateFunction = function(sId, oContext) {

                // default icon behavior
                var sIcon = oContext.getProperty("icon");
                var sTitle = oContext.getProperty("title");
                var sSubtitle = oContext.getProperty("subtitle");
                var sIntent = oContext.getProperty("intent");
                if (!sSubtitle && !sIcon) {
                    sIcon = "sap-icon://documents";
                }

                return new sap.ushell.ui.shell.NavigationMiniTile({
                    title: sTitle,
                    subtitle: sSubtitle,
                    icon: sIcon,
                    intent: sIntent,
                    //layoutData: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
                    press: function() {
                        var sTileIntent = this.getIntent();
                        if (sTileIntent && sTileIntent[0] === '#') {
                            oController.navigateFromShellApplicationNavigationMenu(sTileIntent);
                        }
                    }
                });
            };


            var oShellNavigationMenu = new sap.ushell.ui.shell.ShellNavigationMenu("shellNavigationMenu", {
                title: "{/currentState/application/title}",
                icon: "{/currentState/application/icon}",
                showTitle: {
                    path: "/currentState/application/showNavMenuTitle"
                },
                items: {
                    path: "/currentState/application/hierarchy",
                    factory: oHierarchyTemplateFunction.bind(this)
                },
                miniTiles: {
                    path: "/currentState/application/relatedApps",
                    factory: oRelatedAppsTemplateFunction.bind(this)
                }
            });
            // we save it also on the view object itself, as once the Model is loaded (on the controller side)
            // we need to set it as the shell-navigation-menu's Model
            // as the navigation-menu is used as an association member of the ShellAppTitle object in which
            // it does not inherit the Model from its parent
            this.oShellNavigationMenu = oShellNavigationMenu;

            oShellHeaderAppTitle = new sap.ushell.ui.shell.ShellAppTitle({
                id: "shellAppTitle",
                text: "{/currentState/application/title}",
                tooltip: sap.ushell.resources.i18n.getText("shellNavMenu_openMenuTooltip"),
                navigationMenu: oShellNavigationMenu
            });

            oShellHeaderAppTitle.addEventDelegate({
                onsapskipforward: function(oEvent) {
                    if (sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler()) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                    }
                }
            });

            // filter for the headEndItems in the header
            // to filter overflow items in case overflow is on
            var oFilter = new sap.ui.model.Filter('', 'EQ', 'a'),
                oShellHeader,
                oUnifiedShell,
                oShellFloatingActions;

            oFilter.fnTest = oController.isHeadEndItemNotInOverflow.bind(oController);

            oShellHeader = new sap.ushell.ui.shell.ShellHeader({
                id: 'shell-header',
                showLogo: {
                    path: "/currentState/showLogo"
                },
                headItems: {
                    path: "/currentState/headItems",
                    factory: fnShellUpdateAggItem
                },
                headEndItems: {
                    path: "/currentState/headEndItems",
                    factory: fnShellUpdateAggItem,
                    filters: [oFilter]
                },
                title: oShellHeaderTitle,
                appTitle: oShellHeaderAppTitle,
                showSeparators: false
            });

            oShellFloatingActions = new sap.ushell.ui.shell.ShellFloatingActions({
                id: 'shell-floatingActions',
                floatingActions: {
                    path: "/currentState/floatingActions",
                    factory: fnShellUpdateAggItem
                }
            });
            oUnifiedShell = new sap.ushell.ui.shell.ShellLayout({
                id: "shell",
                header: oShellHeader,
                toolArea: oShellToolArea,
                rightFloatingContainer: oRightFloatingContainer,
                floatingContainerVisible: false,
                floatingContainer: oShellFloatingContainer,
                canvasSplitContainer: oShellSplitContainer,
                toolAreaVisible: {
                    path: "/currentState/toolAreaVisible"
                },
                floatingActionsContainer: oShellFloatingActions,
                headerHiding: {
                    path: "/currentState/headerHiding"
                },
                headerVisible: {
                    path: "/currentState/headerVisible"
                },
                backgroundColorForce: false,
                showBrandLine: false,
                showAnimation: false,
                enableCanvasShapes: oConfig.enableBackGroundShapes === undefined ? true : oConfig.enableBackGroundShapes
            });
            oUnifiedShell._setStrongBackground(true);
            this.setOUnifiedShell(oUnifiedShell);
            if (oActionsUserButton) {
                oShellHeader.setUser(oActionsUserButton);
            }
            // set the model to the floating container (when we create the control the model still doesn't exists, so
            // we will do it in the onAfterRendering)
            if (oShellFloatingContainer) {
                var origContainerAfterRender = oShellFloatingContainer.onAfterRendering;
                oShellFloatingContainer.onAfterRendering = function() {
                    if (origContainerAfterRender) {
                        origContainerAfterRender.apply(this, arguments);
                    }

                    var oShell = sap.ui.getCore().byId("shell"),
                        oModel = oShell.getModel();

                    this.setModel(oModel);
                }
            }
            // modifying the header on after rendering so it will add the relevant identifiers
            // to the Elements which are related to the xRay help scenarios
            if (oShellHeader) {
                var origHeadAfterRender = oShellHeader.onAfterRendering;
                oShellHeader.onAfterRendering = function () {
                    if (origHeadAfterRender) {
                        origHeadAfterRender.apply(this, arguments);
                    }
                    // if xRay is enabled
                    if (this.getModel().getProperty("/enableHelp")) {
                        jQuery('#actionsBtn').addClass('help-id-actionsBtn'); // xRay help ID
                        jQuery('#configBtn').addClass('help-id-configBtn'); // xRay help ID
                        jQuery('#homeBtn').addClass('help-id-homeBtn'); // xRay help ID
                    }
                    // remove tabindex for keyboard navigation
                    jQuery(".sapUshellHeadTitle").removeAttr("tabindex", 0);

                    // handle keyboard navigation when different viewports are active
                    var oHeaderAccHelper = jQuery("#sapUshellHeaderAccessibilityHelper");

                    oHeaderAccHelper.focusin(function (oEvent) {
                        var viewPort = sap.ui.getCore().byId('viewPortContainer'),
                            sCurrentState = viewPort.getCurrentState(),
                            nextFocusElement;

                        // navigation direction is forward
                        if (sap.ushell.renderers.fiori2.AccessKeysHandler.bForwardNavigation) {
                            switch (sCurrentState) {
                                case "Center":
                                    var handler = sap.ushell.renderers.fiori2.AccessKeysHandler;
                                    if (handler.getAppKeysHandler()) {
                                        setTimeout(function() {
                                            handler.fnExternalKeysHandler(oEvent, handler.bFocusPassedToExternalHandlerFirstTime);
                                            handler.bFocusOnShell = false;
                                        },0)
                                    } else {
                                        // set the focus on the next focusable element in the dom to avoid double tab clicks
                                        // to get there
                                        var jqAllFocusableElements = jQuery(":focusable").filter("[tabindex!='-1']"),
                                            iCurrentFocusIndex = jqAllFocusableElements.index(document.activeElement),
                                            nextFocusElement = jqAllFocusableElements.eq(iCurrentFocusIndex + 1);

                                        //go to first focusable item
                                        if (!nextFocusElement.length) {
                                            nextFocusElement = jqAllFocusableElements[0];
                                        }
                                    }
                                    break;
                                case "LeftCenter":
                                    // If the MeArea is opened, then the focus will be located either on the logout button,
                                    // or on the status-opener button, since only one of those two button may exist
                                    nextFocusElement = jQuery("#logoutBtn");
                                    if (nextFocusElement.length === 0) {
                                        nextFocusElement = jQuery("#userStatusOpener");
                                    }
                                    break;
                                case "RightCenter":
                                    nextFocusElement = jQuery("#sapUshellNotificationIconTabByDate");
                                    sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false ;
                                    break;
                            }
                            // navigation direction is backward
                        } else {
                            var oHeader = sap.ui.getCore().byId("shell-header"),
                                aHeaderEndItems = oHeader.getHeadEndItems(),
                                oLastHeaderItem = aHeaderEndItems[aHeaderEndItems.length - 1];

                            nextFocusElement = oLastHeaderItem;
                        }

                        setTimeout(function() {
                            // set the focus in timeout in order to support screen reader. Otherwise the screen reader
                            // will not read the target element
                            if (nextFocusElement) {
                                nextFocusElement.focus();
                            }
                        }, 0);
                    });
                };
            }

            this.oShellPage = this.pageFactory("shellPage", oUnifiedShell, true);
            if (bStateEmbedded) {
                oShellHeader.setLogo(sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif'));
            } else {
                this.initShellBarLogo(oShellHeader);
            }
            this.setDisplayBlock(true);
            this.aDanglingControls = this.aDanglingControls.concat([sap.ui.getCore().byId('shell-floatingContainer'), sap.ui.getCore().byId('viewPortContainer'), this.oShellPage, oFiori2LoadingDialog, oHomeButton, oBackButton, oConfigButton]);

            oUnifiedShell.updateAggregation = this.updateShellAggregation;
            oShellHeader.updateAggregation = this.updateShellAggregation;
            oShellToolArea.updateAggregation = this.updateShellAggregation;
            oRightFloatingContainer.updateAggregation = this.updateShellAggregation;
            oShellFloatingActions.updateAggregation = this.updateShellAggregation;
            oShellSplitContainer.updateAggregation = this.updateShellAggregation;

            var bSearchEnable = (oConfig.enableSearch !== false);

            if (bSearchEnable) {
                //Search Icon
                that.oShellSearchBtn = new sap.ushell.ui.shell.ShellHeadItem({
                    id: "sf",
                    tooltip: "{i18n>searchbox_tooltip}",
                    text: "{i18n>searchBtn}",
                    ariaLabel: "{i18n>searchbox_tooltip}",
                    icon: sap.ui.core.IconPool.getIconURI("search"),
                    // visible: {path: "/searchAvailable"},
                    visible: true,
                    showSeparator: false,
                    press: function(event) {
                        if (!that.searchShellHelper) {
                            jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchShellHelper');
                            that.searchShellHelper = sap.ushell.renderers.fiori2.search.SearchShellHelper;
                        }
                        that.searchShellHelper.onShellSearchButtonPressed(event);
                    }
                });

                if (oConfig.openSearchAsDefault) {
                    if (!that.searchShellHelper) {
                        jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchShellHelper');
                        that.searchShellHelper = sap.ushell.renderers.fiori2.search.SearchShellHelper;
                        that.searchShellHelper.init();
                    }
                    that.searchShellHelper.setDefaultOpen(true);
                    that.searchShellHelper.openSearch(false, false);
                }

                that.oShellSearchBtn.addEventDelegate({
                    onsapskipforward: function(oEvent) {
                        oEvent.preventDefault();
                        jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                    },
                    onsapskipback: function(oEvent) {
                        oEvent.preventDefault();
                        jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                    },
                    onAfterRendering: function() {
                        jQuery("#sf").attr("aria-pressed", false);
                    }
                });

                that.aDanglingControls.push(that.oShellSearchBtn);
            }
            //This property is needed for a special scenario when a remote Authentication is required.
            // IFrame src is set by UI2 Services
            this.logonIFrameReference = null;

            return new sap.m.App({
                pages: this.oShellPage
            });
        },

        getOUnifiedShell: function() {
            return this.oUnifiedShell;
        },
        setOUnifiedShell: function(oUnifiedShell) {
            this.oUnifiedShell = oUnifiedShell;
        },

        loadUserImage: function() {
            /*
             in case user image URI is set we try to get it,
             only if request was successful, we set it on the
             oActionsButton icon.
             In case of success, 2 get requests will be executed
             (one here and the second by the control) however
             the second one will be taken from the cache
             */
            var oUser = sap.ushell.Container.getUser(),
                imageURI = oUser.getImage();

            if (imageURI) {
                this._setUserImage(imageURI);
            }
            oUser.attachOnSetImage(this._setUserImage);
        },

        _setUserImage: function(param) {
            var sUrl = (typeof param) === 'string' ? param : param.mParameters,
                oActionsUserButton = sap.ui.getCore().byId('actionsBtn'),
                oMeAreaHeaderButton = sap.ui.getCore().byId('meAreaHeaderButton'),
                oHeaders = {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                };

            //Using jQuery.ajax instead of jQuery.get in-order to be able to control the caching.
            jQuery.ajax({
                url: sUrl,
                //"cache: false" didn't work as expected hence, turning off the cache vie explicit headers.
                headers: oHeaders,
                success: function() {
                    if (oActionsUserButton) {
                        oActionsUserButton.setImage(sUrl);
                    }
                    if (oMeAreaHeaderButton) {
                        oMeAreaHeaderButton.setIcon(sUrl);
                    }
                },
                error: function() {
                    jQuery.sap.log.error("Could not load user image from: " + sUrl, "", "sap.ushell.renderers.fiori2.Shell.view");
                }
            });
        },

        _getIconURI: function(ico) {
            var result = null;
            if (ico) {
                var match = /url[\s]*\('?"?([^\'")]*)'?"?\)/.exec(ico);
                if (match) {
                    result = match[1];
                }
            }
            return result;
        },

        initShellBarLogo: function(oShellHeader) {
            var sModulePath = jQuery.sap.getModulePath("sap.ushell");

            jQuery.sap.require("sap.ui.core.theming.Parameters");
            var ico = sap.ui.core.theming.Parameters.get("sapUiGlobalLogo");
            if (ico) {
                ico = this._getIconURI(ico);
                if (!ico) {
                    oShellHeader.setLogo(sModulePath + '/themes/base/img/sap_55x27.png');
                }
            }
            //Change the Theme icon once it is changed (in the theme designer)
            var that = this;
            sap.ui.getCore().attachThemeChanged(function() {
                if (oShellHeader.bIsDestroyed) {
                    return;
                }
                var newIco = sap.ui.core.theming.Parameters.get("sapUiGlobalLogo");
                if (newIco) {
                    newIco = that._getIconURI(newIco);
                    if (newIco) {
                        oShellHeader.setLogo(newIco);
                    } else {
                        oShellHeader.setLogo(sModulePath + '/themes/base/img/sap_55x27.png');
                    }
                } else {
                    oShellHeader.setLogo(sModulePath + '/themes/base/img/sap_55x27.png');
                }
            });
        },

        initViewPortContainer: function(oController) {
            var oViewPortContainer = new sap.ushell.ui.launchpad.ViewPortContainer({
                id: "viewPortContainer",
                defaultState: sap.ushell.ui.launchpad.ViewPortState.Center,
                afterNavigate: jQuery.proxy(oController.onAfterNavigate, oController),
                afterSwitchState: jQuery.proxy(oController.onAfterViewPortSwitchState, oController)
            });

            return oViewPortContainer;
        },

        updateShellAggregation: function(sName) {
            /*jslint nomen: true */
            var oBindingInfo = this.mBindingInfos[sName],
                oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
                oClone;

            jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function(i, v) {
                this[oAggregationInfo._sRemoveMutator](v);
            }, this));
            jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function(i, v) {
                oClone = oBindingInfo.factory(this.getId() + "-" + i, v) ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model) : "";
                this[oAggregationInfo._sMutator](oClone);
            }, this));
        },

        // Disable bouncing outside of the boundaries
        disableBouncing: function(oPage) {
            /*jslint nomen: true */
            oPage.onBeforeRendering = function() {
                sap.m.Page.prototype.onBeforeRendering.apply(oPage);
                var oScroller = this._oScroller,
                    oOriginalAfterRendering = oScroller.onAfterRendering;

                oScroller.onAfterRendering = function() {
                    oOriginalAfterRendering.apply(oScroller);
                    if (oScroller._scroller) {
                        oScroller._scroller.options.bounce = false;
                    }
                };
            };

            return oPage;
        },

        getControllerName: function() {
            return "sap.ushell.renderers.fiori2.Shell";
        },


        pageFactory: function(sId, oControl, bDisableBouncing) {
            var oPage = new sap.m.Page({
                    id: sId,
                    showHeader: false,
                    content: oControl,
                    enableScrolling: !!sap.ui.Device.system.desktop
                }),
                aEvents = ["onAfterHide", "onAfterShow", "onBeforeFirstShow", "onBeforeHide", "onBeforeShow"],
                oDelegates = {};

            // Pass navigation container events to children.
            jQuery.each(aEvents, function(iIndex, sEvent) {
                oDelegates[sEvent] = jQuery.proxy(function(evt) {
                    jQuery.each(this.getContent(), function(iIndex, oControl) {
                        /*jslint nomen: true */
                        oControl._handleEvent(evt);
                    });
                }, oPage);
            });

            oPage.addEventDelegate(oDelegates);
            if (bDisableBouncing && sap.ui.Device.system.desktop) {
                this.disableBouncing(oPage);
            }

            return oPage;
        },

        createIFrameDialog: function() {
            var oDialog = null,
                oLogonIframe = this.logonIFrameReference,
                bContactSupportEnabled;

            var _getIFrame = function() {
                //In order to assure the same iframe for SAML authentication is not reused, we will first remove it from the DOM if exists.
                if (oLogonIframe) {
                    oLogonIframe.remove();
                }
                //The src property is empty by default. the caller will set it as required.
                return jQuery('<iframe id="SAMLDialogFrame" src="" frameborder="0" height="100%" width="100%"></iframe>');
            };

            var _hideDialog = function() {
                oDialog.addStyleClass('sapUshellSamlDialogHidden');
                jQuery('#sap-ui-blocklayer-popup').addClass('sapUshellSamlDialogHidden');
            };

            //A new dialog wrapper with a new inner iframe will be created each time.
            this.destroyIFrameDialog();

            var closeBtn = new sap.m.Button({
                text: sap.ushell.resources.i18n.getText("samlCloseBtn"),
                press: function() {
                    sap.ushell.Container.cancelLogon(); // Note: calls back destroyIFrameDialog()!
                }
            });

            var oHTMLCtrl = new sap.ui.core.HTML("SAMLDialogFrame");
            //create new iframe and add it to the Dialog HTML control
            this.logonIFrameReference = _getIFrame();
            oHTMLCtrl.setContent(this.logonIFrameReference.prop('outerHTML'));
            oDialog = new sap.m.Dialog({
                id: "SAMLDialog",
                title: sap.ushell.resources.i18n.getText("samlDialogTitle"),
                contentWidth: "50%",
                contentHeight: "50%",
                rightButton: closeBtn
            }).addStyleClass("sapUshellIframeDialog");
            bContactSupportEnabled = sap.ushell.Container.getService("SupportTicket").isEnabled();
            if (bContactSupportEnabled) {
                jQuery.sap.require("sap.ushell.ui.footerbar.ContactSupportButton");
                var oContactSupportBtn = new sap.ushell.ui.footerbar.ContactSupportButton();
                oContactSupportBtn.setWidth('150px');
                oContactSupportBtn.setIcon('');
                oDialog.setLeftButton(oContactSupportBtn);
            }
            oDialog.addContent(oHTMLCtrl);
            oDialog.open();
            //Make sure to manipulate css properties after the dialog is rendered.
            _hideDialog();
            this.logonIFrameReference = jQuery('#SAMLDialogFrame');
            return this.logonIFrameReference[0];
        },

        destroyIFrameDialog: function() {
            var dialog = sap.ui.getCore().byId('SAMLDialog');
            if (dialog) {
                dialog.destroy();
            }
            this.logonIFrameReference = null;
        },

        showIFrameDialog: function() {
            //remove css class of dialog
            var oDialog = sap.ui.getCore().byId('SAMLDialog');

            if (oDialog) {
                oDialog.removeStyleClass('sapUshellSamlDialogHidden');
                jQuery('#sap-ui-blocklayer-popup').removeClass('sapUshellSamlDialogHidden');
            }
        }
    });
}());