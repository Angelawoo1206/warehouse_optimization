// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, window, document, setTimeout, hasher, confirm*/

    jQuery.sap.require("sap.ui.core.IconPool");

    /* dont delay these cause they are needed for direct bookmarks */

    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.services.Message");
    jQuery.sap.require("sap.ushell.services.ShellNavigation");
    jQuery.sap.require("sap.ushell.services.UsageAnalytics");
    jQuery.sap.require("sap.ushell.services.AppConfiguration");
    jQuery.sap.require("sap.ushell.services.Notifications");
    jQuery.sap.require("sap.ushell.ui.launchpad.Fiori2LoadingDialog");
    jQuery.sap.require("sap.ushell.renderers.fiori2.AccessKeysHandler");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Lifecycle");
    jQuery.sap.require("sap.ushell.renderers.fiori2.ShellModel");
    jQuery.sap.require("sap.ushell.utils");
    jQuery.sap.require("sap.ushell.CanvasShapesManager");
    jQuery.sap.require("sap.ushell.ui5service.UserStatus");
    jQuery.sap.require("sap.ushell.UIActions");
    // create global model and add some demo data
    var closeAllDialogs = true,
        enableHashChange = true,
        bBackGroundPainted = false,
        oUserRecentsService,
        oShellModel,
        oModel,
        oNavigationMode = {
            embedded: "embedded",
            newWindowThenEmbedded: "newWindowThenEmbedded",
            newWindow: "newWindow",
            replace: "replace"
        },
        oConfig = {},
        fnBackNavigationHander,

    //allowed application state list that are allowed to be configured by oConfig.appState property
        allowedAppStates = ['minimal', 'app', 'standalone', 'embedded', 'headerless', 'merged', 'home', 'blank'];
    
    //noinspection JSClosureCompilerSyntax
    /**
     * @name sap.ushell.renderers.fiori2.Shell
     * @extends sap.ui.core.mvc.Controller
     * @public
     */
    sap.ui.controller("sap.ushell.renderers.fiori2.Shell", {

        oCoreExtLoadingDeferred: undefined,

        /**
         * SAPUI5 lifecycle hook.
         * @public
         */
        onInit: function () {
            enableHashChange = true;
            bBackGroundPainted = false;
            closeAllDialogs = true;
            var oConfig = (this.getView().getViewData() ? this.getView().getViewData().config : {}) || {};

            this.bMeAreaSelected = false;
            this.oEndUserFeedbackConfiguration = {
                showAnonymous: true,
                anonymousByDefault: true,
                showLegalAgreement: true,
                showCustomUIContent: true,
                feedbackDialogTitle: true,
                textAreaPlaceholder: true,
                customUIContent: undefined
            };
            this.bUserImageAlreadyLoaded = undefined;
            this.bMeAreaLoaded = false;
            this.bNotificationsSelected = false;
            oConfig["enableBackGroundShapes"] = oConfig.enableBackGroundShapes === undefined ? true : oConfig.enableBackGroundShapes;
            fnBackNavigationHander = this._historyBackNavigation;
            // Add global model to view
            this.initShellModel(oConfig);
            this.getView().setModel(oModel);
            // Bind the translation model to this view
            this.getView().setModel(sap.ushell.resources.i18nModel, "i18n");

            sap.ui.getCore().getEventBus().subscribe("externalSearch", this.externalSearchTriggered, this);
            // handling of configuration should is done before the code block below otherwise the doHashChange is
            // triggered before the personalization flag is disabled (URL may contain hash value which invokes navigation)
            this._setConfigurationToModel();
            sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRendered", this._loadCoreExt, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.loadUserImage, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.setBackGroundShapes, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "coreExtLoaded", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "coreExtLoaded", this.loadMeAreaView, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.delayedCloseLoadingScreen, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "toggleContentDensity", this.toggleContentDensity, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this._loadCoreExtNWBC, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications", "onNewNotifications", this._handleAlerts, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "appClosed", this.logApplicationUsage, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "launchpadCustomRouterRouteMatched", this._centerViewPort, this);

            // make sure service instance is alive early, no further action needed for now
            sap.ushell.Container.getService("AppLifeCycle");

            sap.ushell.Container.getService("UsageAnalytics").init(sap.ushell.resources.i18n.getText("usageAnalytics"),
                sap.ushell.resources.i18n.getText("i_agree"),
                sap.ushell.resources.i18n.getText("i_disagree"),
                sap.ushell.resources.i18n.getText("remind_me_later"));

            oUserRecentsService = sap.ushell.Container.getService("UserRecents");

            if (sap.ushell.Container.getService("Notifications").isEnabled() === true) {
                oModel.setProperty("/enableNotifications", true);
                sap.ushell.Container.getService("Notifications").init();
                if (oConfig.enableNotificationsUI === true) {
                    oModel.setProperty("/enableNotificationsUI", true);
                    sap.ushell.Container.getService("Notifications").registerDependencyNotificationsUpdateCallback(this.notificationsCountUpdateCallback.bind(this), true);
                }
            }

            this.history = new sap.ushell.renderers.fiori2.History();
            this.oViewPortContainer = sap.ui.getCore().byId("viewPortContainer");
            this.oNotificationsCountButton = sap.ui.getCore().byId("NotificationsCountButton");

            this.oFiori2LoadingDialog = sap.ui.getCore().byId("Fiori2LoadingDialog");

            this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
            this.oShellNavigation.registerNavigationFilter(jQuery.proxy(this._handleEmptyHash, this));
            // must be after event registration (for synchronous navtarget resolver calls)
            this.oShellNavigation.init(jQuery.proxy(this.doHashChange, this));

            this.oShellNavigation.registerNavigationFilter(jQuery.proxy(this.handleDataLoss, this));
            sap.ushell.Container.getService("Message").init(jQuery.proxy(this.doShowMessage, this));
            sap.ushell.Container.setLogonFrameProvider(this._getLogonFrameProvider()); // TODO: TBD??????????
            this.bContactSupportEnabled = sap.ushell.Container.getService("SupportTicket").isEnabled();
            sap.ushell.renderers.fiori2.AccessKeysHandler.init(oModel);

            window.onbeforeunload = function () {
                if (sap.ushell.Container && sap.ushell.Container.getDirtyFlag()) {
                    if (!sap.ushell.resources.browserI18n) {
                        sap.ushell.resources.browserI18n = sap.ushell.resources.getTranslationModel(window.navigator.language).getResourceBundle();
                    }
                    return sap.ushell.resources.browserI18n.getText("dataLossExternalMessage");
                }
            };

            if (oModel.getProperty("/contentDensity")) {
                // do not call _applyContentDensity,
                // no promiss that the component-preload is fully loaded and _applyContentDensity loades the root application.
                // we only want to display the shell in its default state, once the root application will be loaded then the _applyContentDensity will be called with promiss that component-preload loaded.
                this._applyContentDensityClass();
            }

            if (oModel.getProperty("/enableNotificationsUI") === true) {
                // Add the notifications counter to the shell header
                //Last arg - bDoNotPropagate is truethy otherwise changes will redundantly applay to other states as well (e.g. - 'embedded-home').
                oShellModel.addHeaderEndItem(["NotificationsCountButton"], false, ["home", "app", "minimal"], true);
            }

            //in case meArea is on we need to listen to size changes to support
            //overflow behavior for end items in case there is not enough space
            //to show all in the header, and making sure that logo is displayed currectly
            sap.ui.Device.media.attachHandler(this.onScreenSizeChange.bind(this), null, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
            this.onScreenSizeChange(sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD));

            this.initShellUIService();

            // we do this setModel here, as in the View, the shell-navigation-menu is used as an association member
            // of the ShellAppTitle object in which it does not inherit the Model from its parent
            if (this.getView().oShellNavigationMenu) {
                this.getView().oShellNavigationMenu.setModel(oModel);
            }

            sap.ui.getCore().attachThemeChanged(this.redrawBackGroundShapes);
        },

        initShellModel: function (oConfig) {
            oShellModel = sap.ushell.renderers.fiori2.ShellModel;
            oShellModel.init(oConfig);
            oModel = oShellModel.getModel();
        },

        redrawBackGroundShapes: function () {
            if (oConfig.enableBackGroundShapes) {
                sap.ushell.CanvasShapesManager.drawShapes();
            }
        },

        setBackGroundShapes: function () {
            if (!bBackGroundPainted && oConfig.enableBackGroundShapes) {
                bBackGroundPainted = true;
                sap.ushell.CanvasShapesManager.drawShapes();
            }
        },
        initShellUIService: function () {
            jQuery.sap.require("sap.ushell.ui5service.ShellUIService");
            this.oShellUIService = new sap.ushell.ui5service.ShellUIService({
                scopeObject: this.getOwnerComponent(),
                scopeType: "component"
            });

            this.oShellUIService._attachHierarchyChanged(this.onHierarchyChange.bind(this));
            this.oShellUIService._attachTitleChanged(this.onTitleChange.bind(this));
            this.oShellUIService._attachRelatedAppsChanged(this.onRelatedAppsChange.bind(this));
            this.oShellUIService._attachBackNavigationChanged(this.onBackNavigationChange.bind(this));

            this.oUserStatus = new sap.ushell.ui5service.UserStatus({
                scopeObject: this.getOwnerComponent(),
                scopeType: "component"
            });

            /**
             * this feature is turned off due to legal issues, it would be on again once
             * we will get DPPO approval for it!

            this.oUserStatus.attachEnabledStatusChanged(function (oEvent) {
                this.getModel().setProperty("/userStatusEnabled",oEvent.mParameters.data);
            }.bind(this));

            this.oUserStatus.attachStatusChanged(function (oEvent) {
                this.getModel().setProperty("/userStatus",oEvent.mParameters.data);
            }.bind(this));
             */

        },

        onHierarchyChange: function (oEvent) {
            this.isHierarchyChanged = true;
            var oHierarchy = oEvent.getParameters().data,
                oHierarchyDefaultValue,
                oExtendedHierarchy,
                oCurrentState;

            if (!oHierarchy) {
                oHierarchy = [];
            }
            // we take the default value and save it with the data recived
            oHierarchyDefaultValue = this.getHierarchyDefaultValue();
            oExtendedHierarchy = oHierarchy.concat(oHierarchyDefaultValue);

            oCurrentState = oModel.getProperty("/currentState");
            if (oCurrentState && oCurrentState.stateName === "home") {
                oShellModel.updateStateProperty("application/hierarchy", oExtendedHierarchy, false, ["home"]);
            }
            oShellModel.updateStateProperty("application/hierarchy", oExtendedHierarchy, true);
        },

        onTitleChange: function (oEvent) {
            this.isTitleChanged = true;
            var sTitle = oEvent.getParameters().data,
                oCurrentState;

            if (!sTitle) {
                sTitle = this.getTitleDefaultValue();
            }
            oCurrentState = oModel.getProperty("/currentState");
            if (oCurrentState && oCurrentState.stateName === "home") {
                oShellModel.updateStateProperty("application/title", sTitle, false, ["home"]);
            }
            oShellModel.updateStateProperty("application/title", sTitle, true);
            window.document.title = sTitle;
        },

        /*
         * This method change the back navigation handler with custom logic in
         * the shell header when the ShellUIService#setBackNavigation method is
         * called.
         * - this method currently assumes that the
         * application is displayed in the "minimal" state (no home button
         * present).
         */
        onBackNavigationChange: function (oEvent) {
            this.isBackNavigationChanged = true;
            var fnCallback = oEvent.getParameters().data,
                oModel = this.getModel(),
                oCurrentStateModel = oModel.getProperty('/currentState/');

            if (fnCallback){
                fnBackNavigationHander = fnCallback;
                if (oCurrentStateModel.stateName === 'minimal' || oCurrentStateModel.stateName === 'standalone' || oCurrentStateModel.stateName === 'embedded') {
                    sap.ushell.Container.getRenderer('fiori2').showHeaderItem('backBtn', true);
                }


            } else {
                //if no callback is provided we set the default handler: history back
                fnBackNavigationHander = this._historyBackNavigation;
            }

        },

        onRelatedAppsChange: function (oEvent) {
            this.isRelatedAppsChanged = true;
            var oRelatedApps = oEvent.getParameters().data,
                oCurrentState;

            if (!oRelatedApps) {
                oRelatedApps = [];
            }
            oCurrentState = oModel.getProperty("/currentState");
            if (oCurrentState && oCurrentState.stateName === "home") {
                oShellModel.updateStateProperty("application/relatedApps", oRelatedApps, false, ["home"]);
            }
            oShellModel.updateStateProperty("application/relatedApps", oRelatedApps, true);
        },

        getHierarchyDefaultValue: function () {
            var oHierarchy = [],
                oCurrentState = oModel.getProperty("/currentState");

            //If we navigate for a page with state == app add home to it
            if (oCurrentState && (oCurrentState.stateName === "app" || oCurrentState.stateName === "embedded")) {
                //add home entry to hierarchy
                oHierarchy = [
                    {
                        icon: "sap-icon://home",
                        title: sap.ushell.resources.i18n.getText("actionHomePage"),
                        // Intent is set to root directly to avoid multiple hash changes.
                        intent: oConfig.rootIntent ? "#" + oConfig.rootIntent : "#"
                    }
                ];
            }
            return oHierarchy;
        },

        getTitleDefaultValue: function () {
            var sTitle = "",
                appMetaData = sap.ushell.services.AppConfiguration.getMetadata();

            if (appMetaData && appMetaData.title) {
                sTitle = appMetaData.title;
            }
            return sTitle;
        },

        getAppIcon: function () {
            var sIcon = "sap-icon://folder",
                appMetaData = sap.ushell.services.AppConfiguration.getMetadata();

            if (appMetaData && appMetaData.icon) {
                sIcon = appMetaData.icon;
            }
            return sIcon;
        },

        _handleAlerts: function (sChannelId, sEventId, aNewNotifications) {
            var iNotificationsIndex,
                isOnHomeAndCenter = (this.getModel().getProperty("/currentState").stateName === "home" && this.oViewPortContainer.getCurrentState() === 'Center'),
                isPhone = sap.ui.Device.system.phone;

            //do not display notifications on Dashboard center view port (home and center) and on RightCenter Notification screen/ This is a hack untill the shell model will handle the viewport.
            if (this.oViewPortContainer.getCurrentState() !== 'RightCenter' && (!isOnHomeAndCenter || isPhone)) {
                for (iNotificationsIndex = 0; iNotificationsIndex < aNewNotifications.length; iNotificationsIndex++) {
                    this.handleNotification(aNewNotifications[iNotificationsIndex]);
                }
            }
        },
        handleNotification: function (oNotification) {
            //create an element of RightFloatingContainer
            var oAlertEntry = sap.ushell.Container.getRenderer("fiori2").addRightFloatingContainerItem(
                {
                    press: function (oEvent) {
                        var viewPortContainer = sap.ui.getCore().byId('viewPortContainer');

                        if (hasher.getHash() === oNotification.NavigationTargetObject + "-" + oNotification.NavigationTargetAction) {
                            viewPortContainer.switchState("Center");
                        } else {
                            sap.ushell.utils.toExternalWithParameters(
                                oNotification.NavigationTargetObject,
                                oNotification.NavigationTargetAction,
                                oNotification.NavigationTargetParams
                            );
                        }
                        sap.ushell.Container.getService("Notifications").markRead(oNotification.Id);
                    },
                    datetime: sap.ushell.resources.i18n.getText("notification_arrival_time_now"),
                    title: oNotification.SensitiveText ? oNotification.SensitiveText : oNotification.Text,
                    unread: oNotification.IsRead,
                    priority: "High",
                    hideShowMoreButton: true
                },
                true,
                true
            );

            setTimeout(function () {
                sap.ushell.Container.getRenderer("fiori2").removeRightFloatingContainerItem(oAlertEntry.getId(), true);
            }, 3500);
        },
        _createActionButtons: function () {
            var oContactSupport,
                oEndUserFeedback,
                oEndUserFeedbackEnabled,
                oUserPrefButton = sap.ui.getCore().byId("userSettingsBtn"),
                oAboutButton = sap.ui.getCore().byId("aboutBtn") || new sap.ushell.ui.footerbar.AboutButton("aboutBtn");

            if (!oUserPrefButton) {
                oUserPrefButton = new sap.ushell.ui.launchpad.ActionItem("userSettingsBtn", {
                    id: "userSettingsBtn",
                    text: sap.ushell.resources.i18n.getText("userSettings"),
                    icon: 'sap-icon://action-settings'
                });
            }

            jQuery.sap.require('sap.ushell.ui.footerbar.ContactSupportButton');
            jQuery.sap.require('sap.ushell.ui.footerbar.EndUserFeedback');
            oContactSupport = sap.ui.getCore().byId("ContactSupportBtn") || new sap.ushell.ui.footerbar.ContactSupportButton("ContactSupportBtn", {
                visible: this.bContactSupportEnabled
            });
            oEndUserFeedbackEnabled = oModel.getProperty('/showEndUserFeedback');

            if (oEndUserFeedbackEnabled) {
                oEndUserFeedback = sap.ui.getCore().byId("EndUserFeedbackBtn") || new sap.ushell.ui.footerbar.EndUserFeedback("EndUserFeedbackBtn", {
                    showAnonymous: this.oEndUserFeedbackConfiguration.showAnonymous,
                    anonymousByDefault: this.oEndUserFeedbackConfiguration.anonymousByDefault,
                    showLegalAgreement: this.oEndUserFeedbackConfiguration.showLegalAgreement,
                    showCustomUIContent: this.oEndUserFeedbackConfiguration.showCustomUIContent,
                    feedbackDialogTitle: this.oEndUserFeedbackConfiguration.feedbackDialogTitle,
                    textAreaPlaceholder: this.oEndUserFeedbackConfiguration.textAreaPlaceholder,
                    customUIContent: this.oEndUserFeedbackConfiguration.customUIContent
                });
            }
            // if xRay is enabled
            if (oModel.getProperty("/enableHelp")) {
                oUserPrefButton.addStyleClass('help-id-loginDetails');// xRay help ID
                oAboutButton.addStyleClass('help-id-aboutBtn');// xRay help ID
                if (oEndUserFeedbackEnabled) {
                    oEndUserFeedback.addStyleClass('help-id-EndUserFeedbackBtn'); // xRay help ID
                }
                oContactSupport.addStyleClass('help-id-contactSupportBtn');// xRay help ID
            }
            this.getView().aDanglingControls.push(oContactSupport, oUserPrefButton, oAboutButton);
            if (oEndUserFeedbackEnabled) {
                this.getView().aDanglingControls.push(oEndUserFeedback);
            }
        },
        _isCompactContentDensity: function () {
            var isCompact,
                oUser,
                userInfoService;
            if (!sap.ui.Device.support.touch) {
                isCompact = true;
            } else if (!sap.ui.Device.system.combi) {
                isCompact = false;
            } else {
                try {
                    userInfoService = sap.ushell.Container.getService("UserInfo");
                    oUser = userInfoService.getUser();
                } catch (e) {
                    jQuery.sap.log.error("Getting UserInfo service failed.");
                    oUser = sap.ushell.Container.getUser();
                }
                isCompact = (oUser.getContentDensity() === 'compact') ? true : false;
            }

            return isCompact;
        },

        _applyContentDensity: function (isCompact) {
            if (isCompact === undefined) {
                isCompact = this._isCompactContentDensity();
            }

            var appMetaData = sap.ushell.services.AppConfiguration.getMetadata(),
                bAppMetaDataDensity;
            //compactContentDensity should be true by default
            bAppMetaDataDensity = appMetaData.compactContentDensity === undefined ? true : appMetaData.compactContentDensity;

            if (isCompact && !bAppMetaDataDensity) {
                isCompact = false;
            } else if (bAppMetaDataDensity && !appMetaData.cozyContentDensity) {
                isCompact = true;
            }

            this._applyContentDensityClass(isCompact);
        },

        _applyContentDensityClass: function (isCompact) {
            if (isCompact === undefined) {
                isCompact = this._isCompactContentDensity();
            }
            if (isCompact) {
                jQuery('body').removeClass('sapUiSizeCozy');
                jQuery('body').addClass('sapUiSizeCompact');
            } else {
                jQuery('body').removeClass('sapUiSizeCompact');
                jQuery('body').addClass('sapUiSizeCozy');
            }
        },

            toggleContentDensity: function (sChannelId, sEventId, oData) {
            var isCompact = oData.contentDensity === "compact";

            this._applyContentDensity(isCompact);
        },

        checkEUFeedback: function () {
            if (!this.bFeedbackServiceChecked) {
                this.bFeedbackServiceChecked = true;
                try {
                    sap.ushell.Container.getService("EndUserFeedback").isEnabled()
                        .done(function () {
                            oModel.setProperty('/showEndUserFeedback', true);
                        })
                        .fail(function () {
                            oModel.setProperty('/showEndUserFeedback', false);
                        });
                } catch (e) {
                    jQuery.sap.log.error("EndUserFeedback adapter is not found", e.message || e);
                    oModel.setProperty('/showEndUserFeedback', false);
                }
            }
        },
        loadMeAreaView: function () {
            if (!sap.ui.getCore().byId('meArea') && !this.bMeAreaLoaded) {
                this.bMeAreaLoaded = true;
                var oMeAreaView = sap.ui.view("meArea", {
                    viewName: "sap.ushell.renderers.fiori2.meArea.MeArea",
                    type: 'JS',
                    viewData: this.getView().getViewData()
                });

                // create buttons & adjust model BEFORE the me area is added to the view-port
                // otherwise the first buttons of open-catalog and user-settings render
                // before rest of the actions are instantiated thus causing a glitch in the UI
                this._createActionButtons();
                this._setUserPrefModel();

                this.oViewPortContainer.addLeftViewPort(oMeAreaView);
                this.oViewPortContainer.navTo('leftViewPort', oMeAreaView.getId());
            }
        },

        /**
         * Notifications count (badge) callback function for notifications update.
         * Called by Notifications service after fetching new notifications data.
         * The update of the badge number depends on the given oDependencyPromise only in case of RightCenter viewport,
         * because in this case we would like to synchronize between badge update and the notifications list
         *
         * @param oDependencyPromise deferred.promise object that can be used for waiting
         *  until some other relevant functionality finishes execution.
         */
        notificationsCountUpdateCallback: function (oDependencyPromise) {
            var that = this,
                sViewPort = this.oViewPortContainer.getCurrentState(),
                bIsRightCenterViewPort = sViewPort === "RightCenter" ? true : false;

            if ((oDependencyPromise === undefined) || (!bIsRightCenterViewPort)) {
                this._updateBadge();
            } else {
                // Update the badge only after the deferred object of oDependencyPromise is resolved.
                // this way we sync between the (late) update of the list and the update of the badge
                oDependencyPromise.done(function () {
                    that._updateBadge();
                });
            }
        },

        _updateBadge : function () {
            var notificationsCounterValue;

            sap.ushell.Container.getService("Notifications").getUnseenNotificationsCount().done(function (iNumberOfNotifications) {
                notificationsCounterValue = parseInt(iNumberOfNotifications, 10);
                oModel.setProperty('/notificationsCount', notificationsCounterValue);
            }).fail(function (data) {
                jQuery.sap.log.error("Shell.controller - call to notificationsService.getCount failed: ", data, "sap.ushell.renderers.lean.Shell");
            });
        },

        _handleEmptyHash: function (sHash) {
            sHash = (typeof sHash === "string") ? sHash : "";
            sHash = sHash.split("?")[0];
            if (sHash.length === 0) {
                var oViewData = this.getView() ? this.getView().getViewData() : {};
                oConfig = oViewData.config || {};
                //Migration support:  we have to set rootIntent empty
                //And continue navigation in order to check if  empty hash is resolved locally
                if (oConfig.migrationConfig) {
                    return this.oShellNavigation.NavigationFilterStatus.Continue;
                }
                if (oConfig.rootIntent) {
                    setTimeout(function () {
                        hasher.setHash(oConfig.rootIntent);
                    }, 0);
                    return this.oShellNavigation.NavigationFilterStatus.Abandon;
                }
            }
            return this.oShellNavigation.NavigationFilterStatus.Continue;
        },

        _setConfigurationToModel: function () {
            var oViewData = this.getView().getViewData(),
                stateEntryKey,
                curStates;

            if (oViewData) {
                oConfig = oViewData.config || {};
            }
            if (oConfig) {
                if (oConfig.states) {
                    curStates = oModel.getProperty('/states');
                    for (stateEntryKey in oConfig.states) {
                        if (oConfig.states.hasOwnProperty(stateEntryKey)) {
                            curStates[stateEntryKey] = oConfig.states[stateEntryKey];
                        }
                    }
                    oModel.setProperty('/states', curStates);
                }

                if (oConfig.appState === "headerless" || oConfig.appState === "merged" || oConfig.appState === "blank") {
                    // when appState is headerless we also remove the header in home state and disable the personalization.
                    // this is needed in case headerless mode will be used to navigate to the dashboard and not directly to an application.
                    // As 'home' is the official state for the dash board, we change the header visibility property of this state
                    oModel.setProperty("/personalization", false);
                    //update the configuration as well for the method "getModelConfiguration"
                    oConfig.enablePersonalization = false;
                } else if (oConfig.enablePersonalization !== undefined) {
                    oModel.setProperty("/personalization", oConfig.enablePersonalization);
                }

                //EU Feedback flexable configuration
                if (oConfig.changeEndUserFeedbackTitle !== undefined) {
                    this.oEndUserFeedbackConfiguration.feedbackDialogTitle = oConfig.changeEndUserFeedbackTitle;
                }

                if (oConfig.changeEndUserFeedbackPlaceholder !== undefined) {
                    this.oEndUserFeedbackConfiguration.textAreaPlaceholder = oConfig.changeEndUserFeedbackPlaceholder;
                }

                if (oConfig.showEndUserFeedbackAnonymousCheckbox !== undefined) {
                    this.oEndUserFeedbackConfiguration.showAnonymous = oConfig.showEndUserFeedbackAnonymousCheckbox;
                }

                if (oConfig.makeEndUserFeedbackAnonymousByDefault !== undefined) {
                    this.oEndUserFeedbackConfiguration.anonymousByDefault = oConfig.makeEndUserFeedbackAnonymousByDefault;
                }

                if (oConfig.showEndUserFeedbackLegalAgreement !== undefined) {
                    this.oEndUserFeedbackConfiguration.showLegalAgreement = oConfig.showEndUserFeedbackLegalAgreement;
                }
                //EU Feedback configuration end.
                if (oConfig.enableSetTheme !== undefined) {
                    oModel.setProperty("/setTheme", oConfig.enableSetTheme);
                }
                // Compact Cozy mode
                oModel.setProperty("/contentDensity", oConfig.enableContentDensity === undefined ? true : oConfig.enableContentDensity);

                // check for title
                if (oConfig.title) {
                    oModel.setProperty("/title", oConfig.title);
                }
                //Check if the configuration is passed by html of older version(1.28 and lower)
                if (oConfig.migrationConfig !== undefined) {
                    oModel.setProperty("/migrationConfig", oConfig.migrationConfig);
                }
                //User default parameters settings
                if (oConfig.enableUserDefaultParameters !== undefined) {
                    oModel.setProperty("/userDefaultParameters", oConfig.enableUserDefaultParameters);
                }

                if (oConfig.disableHomeAppCache !== undefined) {
                    oModel.setProperty("/disableHomeAppCache", oConfig.disableHomeAppCache);
                }
                // xRay enablement configuration
                oModel.setProperty("/enableHelp", !!oConfig.enableHelp);
                oModel.setProperty("/searchAvailable", (oConfig.enableSearch !== false));

                // enable/disable animations
                if (oConfig.animationMode) {
                    oModel.setProperty("/animationMode", oConfig.animationMode);
                }

                // in Fiori2.0 should disable the header-hiding (automatically collapsing of header)
                oShellModel.updateStateProperty("headerHiding", false, false, ["home", "app"]);
            }
        },

        getModelConfiguration: function () {
            var oViewData = this.getView().getViewData(),
                oConfiguration,
                oShellConfig;

            if (oViewData) {
                oConfiguration = oViewData.config || {};
                oShellConfig = jQuery.extend({}, oConfiguration);
            }
            delete oShellConfig.applications;
            return oShellConfig;
        },
        /**
         * This method will be used by the Container service in order to create, show and destroy a Dialog control with an
         * inner iframe. The iframe will be used for rare scenarios in which additional authentication is required. This is
         * mainly related to SAML 2.0 flows.
         * The api sequence will be managed by UI2 services.
         * @returns {{create: Function, show: Function, destroy: Function}}
         * @private
         */
        _getLogonFrameProvider: function () {
            var oView = this.getView();

            return {
                /* @returns a DOM reference to a newly created iFrame. */
                create: function () {
                    return oView.createIFrameDialog();
                },

                /* make the current iFrame visible to user */
                show: function () {
                    oView.showIFrameDialog();
                },

                /* hide, close, and destroy the current iFrame */
                destroy: function () {
                    oView.destroyIFrameDialog();
                }
            };
        },

        onExit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("externalSearch", this.externalSearchTriggered, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "contentRendered", this._loadCoreExt, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "toggleContentDensity", this.toggleContentDensity, this);
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.loadUserImage, this);
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.setBackGroundShapes, this);
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.delayedCloseLoadingScreen, this);
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this._loadCoreExtNWBC, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "coreExtLoaded", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "coreExtLoaded", this.loadMeAreaView, this);
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", this._handleAlerts, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "appClosed", this.logApplicationUsage, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "launchpadCustomRouterRouteMatched", this._centerViewPort, this);
            sap.ui.Device.media.detachHandler(this.onScreenSizeChange.bind(this), null, sap.ui.Device.media.RANGESETS.SAP_STANDARD);

            this.oShellNavigation.hashChanger.destroy();
            this.getView().aDanglingControls.forEach(function (oControl) {
                if (oControl.destroyContent) {
                    oControl.destroyContent();
                }
                oControl.destroy();
            });
            sap.ushell.UserActivityLog.deactivate(); // TODO:
            if (sap.ushell.Container) {
                if (sap.ushell.Container.getService("Notifications").isEnabled() === true) {
                    sap.ushell.Container.getService("Notifications").destroy();
                }
            }
            oShellModel.destroy();
            oShellModel = undefined;
        },


        getAnimationType: function () {
            //return sap.ui.Device.os.android ? "show" : "fade";
            return "show";
        },

        onCurtainClose: function (oEvent) {
            jQuery.sap.log.warning("Closing Curtain", oEvent);


        },

        /**
         * Navigation Filter function registered with ShellNavigation service.
         * Triggered on each navigation.
         * Aborts navigation if there are unsaved data inside app(getDirtyFlag returns true).
         * @param {string} newHash new hash
         * @param {string} oldHash old hash
         * @private
         */
        handleDataLoss: function (newHash, oldHash) {
            if (!enableHashChange) {
                enableHashChange = true;
                this.closeLoadingScreen();
                return this.oShellNavigation.NavigationFilterStatus.Custom;
            }

            if (sap.ushell.Container.getDirtyFlag()) {
                if (!sap.ushell.resources.browserI18n) {
                    sap.ushell.resources.browserI18n = sap.ushell.resources.getTranslationModel(window.navigator.language).getResourceBundle();
                }
                /*eslint-disable no-alert*/
                if (confirm(sap.ushell.resources.browserI18n.getText("dataLossInternalMessage"))) {
                    /*eslint-enable no-alert*/
                    sap.ushell.Container.setDirtyFlag(false);
                    return this.oShellNavigation.NavigationFilterStatus.Continue;
                }
                //when browser back is performed the browser pops the hash from the history, we push it back.
                enableHashChange = false;
                hasher.setHash(oldHash);
                return this.oShellNavigation.NavigationFilterStatus.Custom;
            }

            return this.oShellNavigation.NavigationFilterStatus.Continue;
        },
        /**
         * Callback registered with Message service. Triggered on message show request.
         *
         * @private
         */
        doShowMessage: function (iType, sMessage, oParameters) {
            jQuery.sap.require("sap.m.MessageToast");
            jQuery.sap.require("sap.m.MessageBox");
            if (iType === sap.ushell.services.Message.Type.ERROR) {
                //check that SupportTicket is enabled and verify that we are not in a flow in which Support ticket creation is failing,
                // if this is the case we don't want to show the user the contact support button again
                if (sap.ushell.Container.getService("SupportTicket").isEnabled() && sMessage !== sap.ushell.resources.i18n.getText("supportTicketCreationFailed")) {
                    try {
                        jQuery.sap.require("sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage");
                        var errorMsg = new sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage("EmbeddedSupportErrorMessage", {
                            title: oParameters.title || sap.ushell.resources.i18n.getText("error"),
                            content: new sap.m.Text({
                                text: sMessage
                            })
                        });
                        errorMsg.open();
                    } catch (e) {
                        sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR,
                            oParameters.title || sap.ushell.resources.i18n.getText("error"));
                    }
                } else {
                    sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR,
                        oParameters.title || sap.ushell.resources.i18n.getText("error"));
                }
            } else if (iType === sap.ushell.services.Message.Type.CONFIRM) {
                if (oParameters.actions) {
                    sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.QUESTION, oParameters.title, oParameters.actions, oParameters.callback);
                } else {
                    sap.m.MessageBox.confirm(sMessage, oParameters.callback, oParameters.title);
                }
            } else {
                sap.m.MessageToast.show(sMessage, {duration: oParameters.duration || 3000});
            }
        },

        /**
         * Callback registered with NavService. Triggered on navigation requests
         *
         * A cold start state occurs whenever the user has previously opened the window.
         * - page is refreshed
         * - URL is pasted in an existing window
         * - user opens the page and pastes a URL
         *
         * @return {boolean} whether the application is in a cold start state
         */
        _isColdStart: function () {
            if (this.history.getHistoryLength() <= 1) {  // one navigation: coldstart!
                return true;
            }
            this._isColdStart = function () {
                return false;
            };
            return false;
        },

        _setEnableHashChange : function(bValue) {
            enableHashChange  = bValue;
        },

        _logRecentActivity: function (oRecentActivity) {
            if (oConfig && oConfig.enableRecentActivity) {
                // Triggering the app usage mechanism to log this openApp action.
                // Using setTimeout in order not to delay the openApp action
                setTimeout(function () {
                    if (sap.ushell.Container) {
                        sap.ushell.services.AppConfiguration.addActivity(oRecentActivity);
                    }
                }, 700);
            }
        },

        _logOpenAppAction: function (sFixedShellHash) {
            if (oConfig && oConfig.enableTilesOpacity && oConfig.enableRecentActivity) {
                // Triggering the app usage mechanism to log this openApp action.
                // Using setTimeout in order not to delay the openApp action
                setTimeout(function () {
                    if (sap.ushell.Container) {
                        oUserRecentsService.addAppUsage(sFixedShellHash);
                    }
                }, 700);
            }
        },

        /**
         * Sets application container based on information in URL hash.
         *
         * This is a callback registered with NavService. It's triggered
         * whenever the url (or the hash fragment in the url) changes.
         *
         * NOTE: when this method is called, the new URL is already in the
         *       address bar of the browser. Therefore back navigation is used
         *       to restore the URL in case of wrong navigation or errors.
         *
         * @public
         */
        doHashChange: function (sShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError) {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController.doHashChange", "doHashChange","FLP");
            var that = this,
                iOriginalHistoryLength,
                sFixedShellHash;
            sap.ushell.utils.addTime("ShellControllerHashChange");
            this.lastApplicationFullHash = sOldAppPart ? sOldShellHash + sOldAppPart : sOldShellHash;
            if (!enableHashChange) {
                enableHashChange = true;
                this.closeLoadingScreen();
                return;
            }

            if (oParseError) {
                this.hashChangeFailure(this.history.getHistoryLength(), oParseError.message, null, "sap.ushell.renderers.fiori2.Shell.controller", false);
                return;
            }
            if (sap.m.InstanceManager && closeAllDialogs) {
                sap.m.InstanceManager.closeAllDialogs();
                sap.m.InstanceManager.closeAllPopovers();
            }

            closeAllDialogs = true;
            // navigation begins
            this.openLoadingScreen();

            if (sap.ushell.utils.getParameterValueBoolean("sap-ushell-no-ls")) {
                this.closeLoadingScreen();
            }

            // save current history length to handle errors (in case)
            iOriginalHistoryLength = this.history.getHistoryLength();

            sFixedShellHash = this.fixShellHash(sShellHash);

            // track hash change
            this.history.hashChange(sFixedShellHash, sOldShellHash);

            // we save the current-application before resolving the next navigation's fragment,
            // as in cases of navigation in a new window we need to set it back
            // for the app-configuration to be consistent
            this.currentAppBeforeNav = sap.ushell.services.AppConfiguration.getCurrentAppliction();

            this._resolveHashFragment(sFixedShellHash).done(function (oResolvedHashFragment, oParsedShellHash) {
                var sIntent = oParsedShellHash ? oParsedShellHash.semanticObject + "-" + oParsedShellHash.action : "",
                    oConfig = that._getConfig(),
                    oExistingPage,
                // for SAPUI5 apps, the application type is still "URL" due to backwards compatibility, but the NavTargetResolution
                // service already extracts the component name, so this can directly be used as indicator
                    sTargetUi5ComponentName = oResolvedHashFragment && oResolvedHashFragment.ui5ComponentName,
                    bTargetIsUi5App = !!sTargetUi5ComponentName,
                    bComponentLoaded = oResolvedHashFragment && oResolvedHashFragment.componentHandle;

                // calculate effective Navigation Mode
                // With resolution result and current Application, we will determine the next navigation mode.
                oResolvedHashFragment = that._calculateNavigationMode(oParsedShellHash, sFixedShellHash, oResolvedHashFragment);
                // if new window, open the window immediately
                if (oResolvedHashFragment &&
                        (oResolvedHashFragment.navigationMode === oNavigationMode.newWindow ||
                         sap.ushell.utils.isNativeWebGuiNavigation(oResolvedHashFragment))
                ) {
                    that._openAppInNewWindowAndRestore(oResolvedHashFragment);
                    return;
                }

                // In case of empty hash, if there is a resolved target, set the flag to false, from now on the rootIntent will be an empty hash.
                // Otherwise, change hash to rootIntent to triger normal resolution
                if (that.getModel().getProperty("/migrationConfig")) {
                    oConfig.migrationConfig = false;
                    that.getModel().setProperty("/migrationConfig", false);

                    if (oResolvedHashFragment && sFixedShellHash === '#') {
                        oConfig.rootIntent = "";
                    } else if (sFixedShellHash === '#') {
                        setTimeout(function () {
                            hasher.setHash(oConfig.rootIntent);
                        }, 0);
                        return;
                    }
                }

                /*
                 * Pre-navigation logic for library loading
                 *
                 * Before navigating to an app, we need to make sure:
                 *
                 * Since 1.38, the loading of a target app's UI5 Component including it's
                 * dependencies and the core-ext-light.js preload module has been factored out
                 * into a new shell service called "Ui5ComponentLoader". This service deals
                 * with most aspects (see the call below).
                 *
                 * There are 3 exceptions:
                 * 1. platforms can optimize the direct application start by triggering the loading earlier. In this case,
                 *      the corresponding bootstrap code can define a promise in variable
                 *      window["sap-ushell-async-libs-promise-directstart"] which resolves to a navtarget resolution result;
                 *      for UI5 components, the loading can also be triggered early. If the component is already loaded,
                 *      the nav target resolution result contains a property "componentHandle", so that loading can be omitted here.
                 * 2. loading of the core-ext-light.js module is explicitly skipped for the FLP component; in this case, the
                 *      lazy loading is triggered via the contentRendered method
                 * 3. the home page component might be cached; when the navigation target is the home page (see "oExistingPage" below),
                 *      component loading os also skipped as the cached component is used
                 */
                if (bComponentLoaded) {
                    that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                    return;
                }

                // for non-UI5 apps, we can directly initiate the navigation
                if (!bTargetIsUi5App) {
                    that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                    return;
                }

                // add application config to the application properties
                if (oConfig && oConfig.applications && oConfig.applications[sIntent]) {
                    oResolvedHashFragment.applicationConfiguration = oConfig.applications[sIntent];
                }

                oExistingPage = that._getExistingAppAndDestroyIfNotRoot(sIntent);
                if (oExistingPage) {
                    // root intent (home): directly navigate to the app
                    that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                    return;
                } else {
                    // normal application:
                    // fire the _prior.newUI5ComponentInstantion event before creating the new component instance, so that
                    // the ApplicationContainer can stop the router of the current app (avoid inner-app hash change notifications)
                    // TODO: this dependency to the ApplicationContainer is not nice, but we need a fast fix now; we should refactor
                    // the ApplicationContainer code, because most of the logic has to be done by the shell controller; maybe rather introduce
                    // a utility module
                    sap.ui.getCore().getEventBus().publish("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion",
                        {
                            name : sTargetUi5ComponentName
                        }
                    );
                    //Performance Debug
                    jQuery.sap.measure.start("FLP:ShellController.UI5createComponent", "UI5 createComponent","FLP");
                    // load ui5 component via shell service; core-ext-light will be loaded as part of the asyncHints
                    sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
                        oResolvedHashFragment, oParsedShellHash, that._createWaitForRendererCreatedPromise()
                    ).done(function (oResolutionResultWithComponentHandle) {
                            jQuery.sap.measure.end("FLP:ShellController.UI5createComponent");
                            that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                        }).fail(function (vError) {
                            that.hashChangeFailure(iOriginalHistoryLength, "Failed to load U5 component for navigation intent " + sFixedShellHash,
                                vError, "sap.ushell.renderers.fiori2.Shell.controller", false);
                        });
                }
            }).fail(function (sMsg) {
                that.hashChangeFailure(iOriginalHistoryLength, "Failed to resolve navigation target: \"" + sFixedShellHash + "\"",
                    sMsg, "sap.ushell.renderers.fiori2.Shell.controller", false);
            });
            jQuery.sap.measure.end("FLP:ShellController.doHashChange");

        },

        _initiateApplication: function (oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength) {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController._initiateApplication", "_initiateApplication","FLP");
            var oMetadata = sap.ushell.services.AppConfiguration.getMetadata(oResolvedHashFragment);

            window.document.title = oMetadata.title;

            // the activation of user activity logging must be done after the app component is fully loaded
            // otherwise the module loading sequence causes race conditions on firefox
            if (this.bContactSupportEnabled) {
                sap.ushell.UserActivityLog.activate();
            }

            this._logOpenAppAction(sFixedShellHash);

            try {
                this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
            } catch (oExc) {
                if (oExc.stack) {
                    jQuery.sap.log.error("Application initialization (Intent: \n" + sFixedShellHash + "\n failed due to an Exception:\n" + oExc.stack);
                }
                this.hashChangeFailure(iOriginalHistoryLength, oExc.name, oExc.message, oMetadata ? oMetadata.title : "", false);
            } finally {
                // always load UI plug-ins after navigation, except when the core resources are not yet fully loaded
                // this flag is false or undefined if core-ext loading was explicitly switched off (homepage case)
                // or the resolved target is not a UI5 app; in that case, the plug-in loading is triggered by the AppOpened event
                if (oResolvedHashFragment && oResolvedHashFragment.coreResourcesFullyLoaded && !this._pluginLoadingTriggered) {
                    this._pluginLoadingTriggered = true;
                    jQuery.sap.log.info("Triggering load of 'RendererExtension' plug-ins after application initialization",
                        null, "sap.ushell.renderers.fiori2.Shell");
                    sap.ushell.Container.getService("PluginManager").loadPlugins("RendererExtensions");
                }
            }
            jQuery.sap.measure.end("FLP:ShellController._initiateApplication");
        },

        /**
         * Callback registered with NavService. Triggered on navigation requests
         *
         * @param {string} sShellHash
         *     the hash fragment to parse (must start with "#")
         *
         * @returns {jQuery.Deferred.promise}
         *     a promise resolved with an object containing the resolved hash
         *     fragment (i.e., the result of
         *     {@link sap.ushell.services.NavTargetResolution#resolveHashFragment}),
         *     the parsed shell hash obtained via
         *     {@link sap.ushell.services.URLParsing#parseShellHash},
         *     and a boolean value indicating whether application dependencies <b>and</b> core-ext-light were loaded earlier.
         *     The promise is rejected with an error message in case errors occur.
         */
        _resolveHashFragment: function (sShellHash) {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController._resolveHashFragment", "_resolveHashFragment","FLP");
            var oResolvedHashFragment,
                oParsedShellHashParams,
                oParsedShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sShellHash),
                oDeferred = new jQuery.Deferred(),
                oConfig = this._getConfig(); // for testing

            /*
             * Optimization: reconstruct the result of resolveHashFragment if
             * navResCtx is found in the hash fragment.
             */
            oParsedShellHashParams = oParsedShellHash && oParsedShellHash.params || {};
            if (oParsedShellHash && oParsedShellHash.contextRaw && oParsedShellHash.contextRaw === "navResCtx"
                    // be robust
                && oParsedShellHashParams
                && oParsedShellHashParams.additionalInformation && (oParsedShellHashParams.additionalInformation[0] || oParsedShellHashParams.additionalInformation[0] === "")
                && oParsedShellHashParams.applicationType && oParsedShellHashParams.applicationType[0]
                && oParsedShellHashParams.url && oParsedShellHashParams.url[0]
                && oParsedShellHashParams.navigationMode && (oParsedShellHashParams.navigationMode[0] || oParsedShellHashParams.additionalInformation[0] === "")
            //&& oParsedShellHashParams.title            && oParsedShellHashParams.title[0]
            ) {
                oParsedShellHashParams = oParsedShellHash.params || {};

                oResolvedHashFragment = {
                    additionalInformation: oParsedShellHashParams.additionalInformation[0],
                    applicationType: oParsedShellHashParams.applicationType[0],
                    url: oParsedShellHashParams.url[0],
                    navigationMode: oParsedShellHashParams.navigationMode[0]
                };

                if (oParsedShellHashParams.title) {
                    oResolvedHashFragment.text = oParsedShellHashParams.title[0];
                }

                oDeferred.resolve(oResolvedHashFragment, oParsedShellHash);
            } else {
                // Check and use resolved hash fragment from direct start promise if it's there
                if (window["sap-ushell-async-libs-promise-directstart"]) {
                    window["sap-ushell-async-libs-promise-directstart"]
                        .then(function (oDirectstartPromiseResult) {
                            oDeferred.resolve(
                                oDirectstartPromiseResult.resolvedHashFragment,
                                oParsedShellHash
                            );
                            delete window["sap-ushell-async-libs-promise-directstart"];
                        },
                        function (sMsg) {
                            oDeferred.reject(sMsg);
                            delete window["sap-ushell-async-libs-promise-directstart"];
                        });
                    return oDeferred.promise();
                }

                // Perform target resolution as normal...
                sap.ushell.Container.getService("NavTargetResolution").resolveHashFragment(sShellHash)
                    .done(function (oResolvedHashFragment) {
                        /*
                         * Override navigation mode for root intent.  Shell
                         * home should be opened in embedded mode to allow a
                         * new window to be opened from GUI applications.
                         */
                        if (oParsedShellHash && (oParsedShellHash.semanticObject + "-" + oParsedShellHash.action) === oConfig.rootIntent) {
                            oResolvedHashFragment.navigationMode = "embedded";
                        }
                        jQuery.sap.measure.end("FLP:ShellController._resolveHashFragment");
                        oDeferred.resolve(oResolvedHashFragment, oParsedShellHash);
                    })
                    .fail(function (sMsg) {
                        oDeferred.reject(sMsg);
                    });
            }
            return oDeferred.promise();
        },

        /**
         * Adjust Navigation mode
         * based on current state of the Shell and application and
         * the ResolveHashFragment bo be started
         *
         * This operation mutates oResolvedHashFragment
         *
         *
         * {@link #navigate}.
         *
         * @param {object} oParsedShellHash
         *     the parsed shell hash obtained via
         *     {@link sap.ushell.services.URLParsing} service
         * @param {string} sFixedShellHash
         *     the hash fragment to navigate to. It must start with "#" (i.e., fixed).<br />
         * @param {object} oResolvedHashFragment
         *     the hash fragment resolved via
         *     {@link sap.ushell.services.NavTargetResolution#resolveHashFragment}
         *
         * @returns {object} a new, potentially altered resolution result
         * Note that url and navigation mode may have been changed!
         * @private
         */
        _calculateNavigationMode : function (oParsedShellHash, sFixedShellHash, oResolvedHashFragment) {
            if (!oResolvedHashFragment) {
                return undefined; // happens in tests
            }
            var sNavigationMode = oResolvedHashFragment.navigationMode;

            if (sNavigationMode === oNavigationMode.newWindowThenEmbedded) {
                /*
                 * Implement newWindowThenEmbedded based on current state.
                 */
                if (this._isColdStart()
                 || (oParsedShellHash.contextRaw && oParsedShellHash.contextRaw === "navResCtx")
                 || this.history.backwards) {
                    /*
                     * coldstart -> always open in place because the new window
                     *              was opened by the user
                     *
                     * navResCtx -> url was generated by us and opened in a new
                     *              window or pasted in an existing window
                     *
                     * history.backwards -> url was was previously opened in
                     *              embedded mode (at any point in the
                     *              history), and we need to navigate back to
                     *              it in the same mode.
                     */
                    oResolvedHashFragment.navigationMode = oNavigationMode.embedded;
                } else {
                    oResolvedHashFragment.navigationMode = oNavigationMode.newWindow;
                    // if its a non-native navigation, we resolve again
                    if (!sap.ushell.utils.isNativeWebGuiNavigation(oResolvedHashFragment)) {
                        oResolvedHashFragment.url = encodeURI(sFixedShellHash);
                    }
                }
                return oResolvedHashFragment;
            }

            if (sNavigationMode === oNavigationMode.newWindow && this._isColdStart()) {
                /*
                 * Replace the content of the current window if the user has
                 * already opened one.
                 */
                oResolvedHashFragment.navigationMode = oNavigationMode.replace;
                return oResolvedHashFragment;
            }
            return oResolvedHashFragment;
        },

        /**
         * Handles navigation modes that depend on current state such as the
         * history. In these cases of conditional navigation, this method calls
         * {@link #navigate}.
         *
         * @param {object} oParsedShellHash
         *     the parsed shell hash obtained via
         *     {@link sap.ushell.services.URLParsing} service
         * @param {string} sFixedShellHash
         *     the hash fragment to navigate to. It must start with "#" (i.e., fixed).<br />
         * @param {object} oMetadata
         *     the metadata object obtained via
         *     {@link sap.ushell.services.AppConfiguration#parseShellHash}
         * @param {object} oResolvedHashFragment
         *     the hash fragment resolved via
         *     {@link sap.ushell.services.NavTargetResolution#resolveHashFragment}
         *
         * @returns {boolean} whether conditional navigation was handled
         * @private
         */
        _handleConditionalNavigation: function (oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment) {
            var sNavigationMode = oResolvedHashFragment.navigationMode;

            if (sNavigationMode === oNavigationMode.newWindowThenEmbedded) {
                /*
                 * Implement newWindowThenEmbedded based on current state.
                 */
                if (this._isColdStart()
                        || (oParsedShellHash.contextRaw && oParsedShellHash.contextRaw === "navResCtx")
                        || this.history.backwards) {
                    /*
                     * coldstart -> always open in place because the new window
                     *              was opened by the user
                     *
                     * navResCtx -> url was generated by us and opened in a new
                     *              window or pasted in an existing window
                     *
                     * history.backwards -> url was was previously opened in
                     *              embedded mode (at any point in the
                     *              history), and we need to navigate back to
                     *              it in the same mode.
                     */
                    oResolvedHashFragment.navigationMode = oNavigationMode.embedded;
                    this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

                } else {
                    // simplified processing in 1.34
                    // always resolve original hash in new window
                    // (with ClientSideTargetResolution the resolution overhead is marginal)
                    // and the former ~navResCtx injection has security, complexity and other issues,
                    // e.g. navigation has side effects, thus it is not optional
                    // e.g. NavTargetResolution.getCurrentResolutionResult()
                    oResolvedHashFragment.navigationMode = oNavigationMode.newWindow;
                    oResolvedHashFragment.url = encodeURI(sFixedShellHash);
                    this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
                }

                return true;
            }

            if (sNavigationMode === oNavigationMode.newWindow && this._isColdStart()) {
                /*
                 * Replace the content of the current window if the user has
                 * already opened one.
                 */
                oResolvedHashFragment.navigationMode = oNavigationMode.replace;
                this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

                return true;
            }

            return false;
        },

        _usesNavigationRedirect : function(oComponentHandle) {
            if (!oComponentHandle) {
                return new jQuery.Deferred().reject().promise();
            }
            var that = this,
                oComponent = oComponentHandle.getInstance({});
            if (oComponent && typeof oComponent.navigationRedirect === "function") {
                var oDeferred = new jQuery.Deferred();
                var oNavRedirPromise = oComponent.navigationRedirect();
                if (oNavRedirPromise
                    && typeof oNavRedirPromise.then === "function" ) {
                    oNavRedirPromise.then(function(sNextHash) {
                        jQuery.sap.log.warning("Performing navigation redirect to hash " + sNextHash);
                        oComponent.destroy();
                        that.history.pop();
                        sap.ushell.Container.getService("ShellNavigation").toExternal( { target : { shellHash : sNextHash } }, undefined, false);
                        oDeferred.resolve(true);
                    }, function() {
                        oDeferred.reject();
                    });
                    return oDeferred.promise();
                }
            }
            return new jQuery.Deferred().reject().promise();
        },
        /**
         * Performs navigation based on the given resolved hash fragment.
         *
         * @param {object} oParsedShellHash
         *     the parsed shell hash obtained via
         *     {@link sap.ushell.services.URLParsing} service
         * @param {string} sFixedShellHash
         *     the hash fragment to navigate to. It must start with "#" (i.e., fixed).<br />
         * @param {object} oMetadata
         *     the metadata object obtained via
         *     {@link sap.ushell.services.AppConfiguration#parseShellHash}
         * @param {object} oResolvedHashFragment
         *     the hash fragment resolved via
         *     {@link sap.ushell.services.NavTargetResolution#resolveHashFragment}
         */
        navigate: function (oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment) {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController.navigate", "navigate","FLP");
            var sNavigationMode = (jQuery.isPlainObject(oResolvedHashFragment) ? oResolvedHashFragment.navigationMode : null),
                that = this;

            /*
             * A null navigationMode is a no-op, it indicates no navigation
             * should occur. However, we need to restore the current hash to
             * the previous one. If coldstart happened (history has only one
             * entry), we go to the shell home.
             */
            if (sNavigationMode === null) {
                if (this._isColdStart()) {
                    hasher.setHash("");
                    return;
                }

                enableHashChange = false;
                this.history.pop();
                this._windowHistoryBack(1);
                return;
            }

            oResolvedHashFragment = this._calculateNavigationMode(oParsedShellHash, sFixedShellHash, oResolvedHashFragment);
            sNavigationMode = (jQuery.isPlainObject(oResolvedHashFragment) ? oResolvedHashFragment.navigationMode : null);

            if (sNavigationMode === oNavigationMode.embedded) {
                var oDeferred = this._usesNavigationRedirect(oResolvedHashFragment.componentHandle);
                oDeferred.fail(function() {
                    that._handleEmbeddedNavMode(sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment);
                    // maybe restore hash...
                    if (oParsedShellHash && oParsedShellHash.contextRaw === "navResCtx") {
                        jQuery.sap.log.error(" This path will no longer be supported in 1.40");
                        // historical invocation pattern no longer used which allowed
                        // injectiong foreign urls via url parameter
                        // -> prone to url injection
                        //
                        // invication via this mechanism is flawed as it does not resolve
                        // the target in the new window, thus leading to
                        // states which are not consistent (e.g. NavTargetResolution.getCurrentResolutionResult) is wrong.
                        //
                        // should be removed from product for security and complexity considerations
                        //
                        enableHashChange = false;
                        //replace tiny hash in window
                        // PLEASE don't only treat the sunny side of the beach:
                        // just use the intent X-Y~navResCtx without the fancy stuff and see how it crashes.
                        if (oParsedShellHash
                            && oParsedShellHash.params
                            && oParsedShellHash.params.original_intent
                            && oParsedShellHash.params.original_intent[0]) {
                            hasher.replaceHash(oParsedShellHash.params.original_intent[0]);
                            // replace tiny hash in our history model
                            that.history._history[0] = oParsedShellHash.params.original_intent[0];
                        }
                    }
                });
                jQuery.sap.measure.end("FLP:ShellController.navigate");
                return;
            }

            if (sNavigationMode === oNavigationMode.replace) {
                // restore hash
                enableHashChange = false;
                this._changeWindowLocation(oResolvedHashFragment.url);
                return;
            }

            if (sNavigationMode === oNavigationMode.newWindow) {
                this._openAppInNewWindowAndRestore(oResolvedHashFragment);
                return;
            }

            // the navigation mode doesn't match any valid one.
            // In this case an error message is logged and previous hash is fetched
            this.hashChangeFailure(this.history.getHistoryLength(), "Navigation mode is not recognized", null, "sap.ushell.renderers.fiori2.Shell.controller", false);
        },

        _openAppInNewWindowAndRestore : function(oResolvedHashFragment) {
            // restore hash
            enableHashChange = false;
            // if NWBC native application, start immediately
            if (sap.ushell.utils.isNativeWebGuiNavigation(oResolvedHashFragment)) {
                try {
                    var sUrlWithSapUser = sap.ushell.utils.appendUserIdToUrl("sap-user", oResolvedHashFragment.url);
                    var oEpcm =  sap.ushell.utils.getPrivateEpcm();
                    oEpcm.doNavigate(sUrlWithSapUser);
                } catch (e) {
                    if (e.stack) {
                        jQuery.sap.log.error("Application initialization failed due to an Exception:\n" + e.stack);
                    }
                    this.hashChangeFailure(this.history.getHistoryLength(), e.name, e.message, oResolvedHashFragment.text, false);
                }
            } else {
                this._openAppNewWindow(oResolvedHashFragment.url);
            }
            this.history.pop();
            var oVarInstance = oResolvedHashFragment.componentHandle && oResolvedHashFragment.componentHandle.getInstance && 
            oResolvedHashFragment.componentHandle.getInstance({});
            if (oVarInstance) {
                oVarInstance.destroy();
            }
            this._windowHistoryBack(1);
            // set back the current application to be the one before this navigation occured as current application
            // is opened in a new window
            sap.ushell.services.AppConfiguration.setCurrentApplication(this.currentAppBeforeNav);
            return;
        },

        _handleEmbeddedNavMode: function (sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment) {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController._handleEmbeddedNavMode", "_handleEmbeddedNavMode","FLP");
            var sAppId,
                oInnerControl,
                bLegacyApp,
                bIsNavToHome,
                sIntent;

            this.resetShellUIServiceHandlers();

            this.setAppIcons(oMetadata);

            // obtain a unique id for the app (or the component)
            sAppId = '-' + oParsedShellHash.semanticObject + '-' + oParsedShellHash.action;

            bLegacyApp = (oResolvedHashFragment.applicationType === "NWBC" || oResolvedHashFragment.applicationType === "TR");
            bIsNavToHome = sFixedShellHash === "#" ||
            (oConfig.rootIntent && oConfig.rootIntent === oParsedShellHash.semanticObject + "-" + oParsedShellHash.action);

            if (bIsNavToHome && !this.oHomeApp && !oConfig.disableHomeAppCache) {
                //save the "home app" component so that we will be able to initialize its router
                //when navigating back to it
                this._saveHomePageComponent();
            }
            //Support migration from version 1.28 or lower in case local resolution for empty hash was used
            sIntent = oParsedShellHash ? oParsedShellHash.semanticObject + "-" + oParsedShellHash.action : "";

            if (bLegacyApp && !oResolvedHashFragment.explicitNavMode) {
                if (oResolvedHashFragment.applicationType === "NWBC" && oConfig.appState && oConfig.appState === "headerless") {
                    this.switchViewState("headerless");
                } else {
                    this.switchViewState("minimal");
                }
            } else if (bIsNavToHome) {
                this.switchViewState("home");
                //in case we navigate to home, we need to reset the back navigation handler
                //as the onAppAfterRendering is not called, all other properties (title, hierarchy navigation etc.)
                //are stored in the model and therefore we would like to keep their existing state
                this.oShellUIService.setBackNavigation();
            } else {
                this.switchViewState("app");
            }
            oInnerControl = this.getWrappedApplication(
                sIntent,
                oMetadata,             // metadata
                oResolvedHashFragment, // the resolved Navigation Target
                sAppId,
                oResolvedHashFragment.fullWidth || oMetadata.fullWidth || bLegacyApp
            );
            //set the NavContainer intialPage
            if (bIsNavToHome && !oConfig.disableHomeAppCache) {
                if (!this.oViewPortContainer.getInitialCenterViewPort()) {
                    this.oViewPortContainer.setInitialCenterViewPort(oInnerControl);
                }
            }
            //Perform switch:
            this.oViewPortContainer.navTo('centerViewPort', oInnerControl.getId(), 'show');
            this._centerViewPort();
            jQuery.sap.measure.end("FLP:ShellController._handleEmbeddedNavMode");
        },

        _centerViewPort: function () {
            this.oViewPortContainer.switchState("Center");
        },

        _getExistingAppAndDestroyIfNotRoot: function (sIntent) {
            var oExistingPage;

            oExistingPage = this.oViewPortContainer && (this.oViewPortContainer.getViewPortControl('centerViewPort', "application" + '-' + sIntent)
            || this.oViewPortContainer.getViewPortControl('centerViewPort', "applicationShellPage" + '-' + sIntent));
            //if the page/app we are about to create already exists, we need to destroy it before
            //we go on with the flow. we have to destroy the existing page since we need to avoid
            //duplicate ID's
            //in case that we are navigating to the root intent, we do not destroy the page.
            if (oExistingPage && sIntent !== oConfig.rootIntent) {
                this.oViewPortContainer.removeCenterViewPort(oExistingPage.getId(), true);
                oExistingPage.destroy();
                return null;
            } else if (oExistingPage) {
                return oExistingPage;
            }
        },

        getWrappedApplication: function (sIntent, oMetadata, oResolvedNavigationTarget, sAppId, bFullWidth) {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController.getWrappedApplication", "getWrappedApplication","FLP");

            var oInnerControl,
                oExistingPage,
                oAppContainer,
                that = this;

            oExistingPage = this._getExistingAppAndDestroyIfNotRoot(sIntent, sAppId);
            if (oExistingPage) {
                this.closeLoadingScreen();//In order to prevent unnecessary opening of the loading screen
                return oExistingPage;
            }

            jQuery.sap.require('sap.ushell.components.container.ApplicationContainer');
            setTimeout(function () {

                setTimeout(function () {
                    //set the focus to shell

                    //If we navigate for a page with state == app set focus on shell app title, otherwise continue
                    // as default behavior
                    var arg;
                    if (oModel.getProperty("/currentState/stateName") === "app") {
                        arg = "shellAppTitle";
                    }

                    sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(arg);

                    setTimeout(function () {
                        //Screen reader: "Loading Complete"
                        that.readNavigationEnd();
                    },500);
                },100);

                sap.ui.getCore().getEventBus().publish("launchpad", "appOpening", oResolvedNavigationTarget);
                jQuery.sap.log.info('app is being opened');
            }, 0);
            if (oConfig.applications) {
                oResolvedNavigationTarget.applicationConfiguration = oConfig.applications[sIntent];
            }

            oAppContainer = this._getAppContainer(sAppId, oResolvedNavigationTarget);

            // adding intent as this published application info is required for the contact-support scenario
            oResolvedNavigationTarget.sShellHash = sIntent;
            this.publishNavigationStateEvents(oAppContainer, oResolvedNavigationTarget);

            if (bFullWidth) {
                if (!oMetadata.hideLightBackground) {
                    //temporary solution for setting the light background for applications
                    oAppContainer.addStyleClass('sapMShellGlobalInnerBackground');
                }
                oInnerControl = oAppContainer;
            } else {
                jQuery.sap.require("sap.m.Shell");
                oInnerControl = new sap.m.Shell("applicationShellPage" + sAppId, {
                    logo: sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif'),
                    title: oMetadata.title,
                    showLogout: false,
                    app: oAppContainer
                }).addStyleClass("sapUshellApplicationPage");
                if (!oMetadata.title) {
                    oInnerControl.addStyleClass("sapUshellApplicationPageNoHdr");
                }
            }

            this._applyContentDensity();

            oAppContainer.onfocusin = function () {
                //focus not in the shell
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = false;
            };
            oAppContainer.onfocusout = function () {
                //focus in the shell
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = true;
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = true;
            };

            // Add inner control for next request
            this.oViewPortContainer.addCenterViewPort(oInnerControl);

            setTimeout(function () {
                that.closeLoadingScreen();//In order to prevent unnecessary opening of the loading screen, we close it after the app rendered
            }, 0);

            jQuery.sap.measure.end("FLP:ShellController.getWrappedApplication");
            return oInnerControl;
        },

        //Set booleans to false which indicate whether shellUIService was called or not
        resetShellUIServiceHandlers: function () {
            this.isHierarchyChanged = false;
            this.isTitleChanged = false;
            this.isRelatedAppsChanged = false;
            this.isBackNavigationChanged = false;
        },

        /**
         * Creates a new object Expose a minimal set of values to public external stakeholders
         * only expose what you can guarantee under any evolution of the unified shell on all platforms
         * @param {object} oApplication an internal result of NavTargetResolution
         * @returns {object} an object exposing certain information to external stakeholders
         */
        _publicEventDataFromResolutionResult : function(oApplication) {
            var oPublicEventData = {};
            if (!oApplication) {
                return oApplication;
            }
            ["applicationType","ui5ComponentName","url","additionalInformation","text"].forEach(function(sProp) {
                oPublicEventData[sProp] = oApplication[sProp];
            });
            Object.freeze(oPublicEventData);
            return oPublicEventData;
        },

        onAppAfterRendering: function (oApplication) {

            //wrapped in setTimeout since "pubilsh" is not async
            setTimeout(function () {
                sap.ui.getCore().getEventBus().publish("launchpad", "appOpened", oApplication);
                jQuery.sap.log.info('app was opened');
            }, 0);

            //publish the event externally
            // TODO: cloned, frozen object!
            var oAppOpenedEventData = this._publicEventDataFromResolutionResult(oApplication);
            sap.ushell.renderers.fiori2.utils.publishExternalEvent("appOpened", oAppOpenedEventData);

            //Call setHierarchy, setTitle, setRelatedApps with default values in case handlers were not called yet
            if (this.oShellUIService) {
                if (!this.isHierarchyChanged) {
                    this.oShellUIService.setHierarchy();
                }
                if (!this.isTitleChanged) {
                    this.oShellUIService.setTitle();
                }
                if (!this.isRelatedAppsChanged) {
                    this.oShellUIService.setRelatedApps();
                }
                if (!this.isBackNavigationChanged) {
                    this.oShellUIService.setBackNavigation();
                }
            }
            oShellModel.updateStateProperty("application/icon", this.getAppIcon(), true);
            oShellModel.updateStateProperty("application/showNavMenuTitle", this.bNavMenuTitleVisible, true);
        },

        _getAppContainer: function (sAppId, oResolvedNavigationTarget) {
            if (!this.oShellUIService) {
                this.initShellUIService();
            }
            oResolvedNavigationTarget.shellUIService = this.oShellUIService.getInterface();

            var oApplicationContainer = new sap.ushell.components.container.ApplicationContainer("application" + sAppId, oResolvedNavigationTarget);
            return oApplicationContainer;
        },

        /**
         * adds a listener to the "componentCreated" Event that is published by the
         * "sap.ushell.components.container.ApplicationContainer".
         * once the "home app" Component is saved, the listener is removed, and this function
         * will not do anything.
         */
        _saveHomePageComponent: function () {
            if (this.oHomeApp) {
                return;
            }
            var that = this,
                sContainerNS = "sap.ushell.components.container.ApplicationContainer",
                fListener = function (oEvent, sChannel, oData) {
                    that.oHomeApp = oData.component;
                    sap.ui.getCore().getEventBus().unsubscribe(sContainerNS, 'componentCreated', fListener);
                };
            sap.ui.getCore().getEventBus().subscribe(sContainerNS, 'componentCreated', fListener);
        },

        /**
         * Shows an error message and navigates to the previous page.
         *
         * @param {number} iHistoryLength the length of the history
         *    <b>before</b> the navigation occurred.
         * @param {string} sMessage the error message
         * @param {string} sDetails the detailed error message
         * @param {string} sComponent the component that generated the error message
         */
        hashChangeFailure: function (iHistoryLength, sMessage, sDetails, sComponent, bEnableHashChange) {
            this.reportError(sMessage, sDetails, sComponent);
            this.closeLoadingScreen();
            //use timeout to avoid "MessageService not initialized.: error
            this.delayedMessageError(sap.ushell.resources.i18n.getText("fail_to_start_app_try_later"));
            closeAllDialogs = false;

            if (iHistoryLength === 0) {
                // if started with an illegal shell hash (deep link), we just remove the hash
                hasher.setHash("");
            } else {
                // navigate to the previous URL since in this state the hash that has failed to load is in the URL.
                if (jQuery.sap.getUriParameters().get("bFallbackToShellHome")) {
                    // The previous url is not valid navigation
                    hasher.setHash("");
                } else {
                    enableHashChange = bEnableHashChange;
                    this._windowHistoryBack(1);
                }
            }
        },

        reportError: function (sMessage, sDetails, sComponent) {
            jQuery.sap.log.error(sMessage, sDetails, sComponent);
        },

        delayedMessageError: function (sMsg) {
            setTimeout(function () {
                if (sap.ushell.Container !== undefined) {
                    sap.ushell.Container.getService("Message").error(sMsg);
                }
            }, 0);
        },

        fixShellHash: function (sShellHash) {
            if (!sShellHash) {
                sShellHash = '#';
            } else if (sShellHash.charAt(0) !== '#') {
                sShellHash = '#' + sShellHash;
            }
            return sShellHash;
        },

        publishNavigationStateEvents: function (oAppContainer, oApplication) {
            //after the app container is rendered, publish an event to notify
            //that an app was opened
            var origExit,
                sId = oAppContainer.getId ? oAppContainer.getId() : "",
                that = this;
            var appMetaData = sap.ushell.services.AppConfiguration.getMetadata(),
                sIcon = appMetaData.icon,
                sTitle = appMetaData.title;

            //Attach an event handler which will be called onAfterRendering
            oAppContainer.addEventDelegate({onAfterRendering: this.onAppAfterRendering.bind(this, oApplication)});

            //after the app container exit, publish an event to notify
            //that an app was closed
            origExit = oAppContainer.exit;
            oAppContainer.exit = function () {
                if (origExit) {
                    origExit.apply(this, arguments);
                }
                //apply the original density settings
                that._applyContentDensity();

                //wrapped in setTimeout since "publish" is not async
                setTimeout(function () {
                    // TODO: do not mutate an internal structure (in a Timeout!),
                    // create a new object
                    var oEventData = jQuery.extend(true, {},oApplication);
                    delete oEventData.componentHandle;
                    oEventData["appId"] = sId;
                    oEventData["usageIcon"] = sIcon;
                    oEventData["usageTitle"] = sTitle;
                    sap.ui.getCore().getEventBus().publish("launchpad", "appClosed", oEventData);
                    jQuery.sap.log.info('app was closed');
                }, 0);

                // the former code leaked an *internal* data structure, making it part of a public API
                // restrict hte public api to the minimal set of precise documented properties which can be retained under
                // under future evolutions
                var oPublicEventData = that._publicEventDataFromResolutionResult(oApplication);
                //publish the event externally
                sap.ushell.renderers.fiori2.utils.publishExternalEvent("appClosed", oPublicEventData);
            };
        },

        _openAppNewWindow: function (sUrl) {
            var newWin = window.open(sUrl);

            if (!newWin) {
                var msg = sap.ushell.resources.i18n.getText("fail_to_start_app_popup_blocker");
                this.delayedMessageError(msg);
            }
        },

        _windowHistoryBack: function (iStepsBack) {
            window.history.back(iStepsBack);
        },

        _changeWindowLocation: function (sUrl) {
            window.location.href = sUrl;
        },

        setAppIcons: function (oMetadataConfig) {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController.setAppIcons", "setAppIcons","FLP");

            var sModulePath = jQuery.sap.getModulePath("sap.ushell"),
                oLaunchIconPhone = (oMetadataConfig && oMetadataConfig.homeScreenIconPhone) ||
                    (sModulePath + '/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png'),
                oLaunchIconPhone2 = (oMetadataConfig && oMetadataConfig["homeScreenIconPhone@2"]) ||
                    (sModulePath + '/themes/base/img/launchicons/114_iPhone-Retina_Web_Clip.png'),
                oLaunchIconTablet = (oMetadataConfig && oMetadataConfig.homeScreenIconTablet) ||
                    (sModulePath + '/themes/base/img/launchicons/72_iPad_Desktop_Launch.png'),
                oLaunchIconTablet2 = (oMetadataConfig && oMetadataConfig["homeScreenIconTablet@2"]) ||
                    (sModulePath + '/themes/base/img/launchicons/144_iPad_Retina_Web_Clip.png'),
                oFavIcon = (oMetadataConfig && oMetadataConfig.favIcon) || (this._getDefaultFavIcon()),
                sCurrentFavIconHref = this.getFavIconHref();
            if (sap.ui.Device.os.ios) {
                jQuery.sap.setIcons({
                    'phone': oLaunchIconPhone,
                    'phone@2': oLaunchIconPhone2,
                    'tablet': oLaunchIconTablet,
                    'tablet@2': oLaunchIconTablet2,
                    'favicon': oFavIcon,
                    'precomposed': true
                });
            } else if (sCurrentFavIconHref !== oFavIcon) {
                jQuery.sap.setIcons({
                    'phone': '',
                    'phone@2': '',
                    'tablet': '',
                    'tablet@2': '',
                    'favicon': oFavIcon,
                    'precomposed': true
                });
            }

            jQuery.sap.measure.end("FLP:ShellController.setAppIcons");
        },

        /**
         * Helper function to get the favIcon image URL based on a given theme parameter.
         */
        _getDefaultFavIcon: function() {
            jQuery.sap.require("sap.ui.core.theming.Parameters");
            var favIcon = sap.ui.core.theming.Parameters.get('@sapFavicon');
            if (favIcon) {
                var match = /url[\s]*\('?"?([^\'")]*)'?"?\)/.exec(favIcon);
                if (match) {
                    favIcon = match[1];
                } else if (favIcon === "''" || favIcon === "none") {
                    favIcon = null;
                }
            }

            if (!favIcon) {
                var sModulePath = jQuery.sap.getModulePath("sap.ushell");
                return sModulePath + '/themes/base/img/launchpad_favicon.ico';
            }

            return favIcon;

        },

        /**
         * sizeChange handler, trigger by the sap.ui.Device.media.attachHandler
         * to handle header end ites overflow scenario
         * @param oParams
         */
        handleEndItemsOverflow: function(oParams){
            var aEndItems = this.getModel().getProperty("/currentState/headEndItems");

            if (oParams.name === 'Phone') {
                if ( aEndItems.indexOf("endItemsOverflowBtn") === -1) {
                    //we need to add the endItemsOverflowBtn to the model in case we are
                    //not in desktop mode and in case it does not exists
                    oShellModel.addHeaderEndItem(["endItemsOverflowBtn"], false, ["home", "app"]);
                }
            } else {
                if (aEndItems.indexOf("endItemsOverflowBtn") > -1) {
                    //we need to remove the endItemsOverflowBtn from the model in case we are
                    //in desktop mode and in case it exists
                    oShellModel.removeHeaderEndItem(["endItemsOverflowBtn"], false, ["home", "app"]);
                }
                var oPopover = sap.ui.getCore().byId('headEndItemsOverflow');
                if (oPopover) {
                    //we have to destroy the popover in order to make sure the enditems will
                    //be rendered currectly in the header and to avoid duplicate elements
                    //ids in the dom
                    oPopover.destroy();
                }
            }
        },

        /**
         * returns true if we are in overflow mode
         * we enter the overflow mode in case:
         *  - meArea is on
         *  - current width of the screen is not desktop (as recived from the sap.ui.Device.media
         *  - we have 3 buttons in the header (exluding the endItemsOverflowBtn)
         * @returns {boolean} result
         */
        isHeadEndItemOverflow: function () {
            var aEndItems = this.getModel().getProperty("/currentState/headEndItems");
            if (aEndItems.indexOf("endItemsOverflowBtn") === -1) {
                return false;
            } else {
                return aEndItems.length > 3;
            }
        },

        /**
         * return true for buttons that should go in the overflow and not in the header
         * @param {string} sButtonNameInUpperCase button name
         * @returns {boolean} isHeadEndItemInOverflow
         */
        isHeadEndItemInOverflow: function (sButtonNameInUpperCase) {
            return sButtonNameInUpperCase !== "ENDITEMSOVERFLOWBTN" && !this.isHeadEndItemNotInOverflow(sButtonNameInUpperCase);
        },

        /**
         * return true for buttons that should be in the header and not in oveflow
         * In case overflow mode is on @see isHeadEndItemOverflow only the
         * NotificationsCountButton and the endItemsOverflowButtons should be in the header
         * in case overflow mode is off all buttons except endItemsOverflowButtons
         * should be in the header
         *
         * @param sButtonNameInUpperCase
         * @returns {boolean} isHeadEndItemNotInOverflow
         */
        isHeadEndItemNotInOverflow: function (sButtonNameInUpperCase) {
            if (this.isHeadEndItemOverflow()) {
                if (sButtonNameInUpperCase === "NOTIFICATIONSCOUNTBUTTON" || sButtonNameInUpperCase === "ENDITEMSOVERFLOWBTN") {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (sButtonNameInUpperCase === "ENDITEMSOVERFLOWBTN") {
                    return false;
                } else {
                    return true;
                }
            }
        },

        /**
         * in case the endItemsOverflowButtons was pressed we need to show
         * all overflow items in the action sheet
         * @param oEvent
         */
        pressEndItemsOverflow: function (oEvent) {
            // don't hide the shell header when the action sheet is open on mobile devices only
            if (!sap.ui.Device.system.desktop) {
                //keep original header hiding value for reset after action sheet close
                var origHeaderHiding = oModel.getProperty("/currentState").headerHiding;
                if (origHeaderHiding) {
                    //if the header hiding is false -> no need to update the property
                    oModel.setProperty("/currentState/headerHiding", false);
                }
            }

            var oPopover = sap.ui.getCore().byId('headEndItemsOverflow');

            function closePopover() {
                oPopover.close();
            }

            var oItemsLayout;
            if (oPopover) {
                oItemsLayout = oPopover.getContent()[0];
            } else {
                var oFilter = new sap.ui.model.Filter('', 'EQ', 'a');
                oFilter.fnTest = this.isHeadEndItemInOverflow.bind(this);

                oItemsLayout = new sap.ui.layout.VerticalLayout({
                        content: {
                            path: "/currentState/headEndItems",
                            filters: [oFilter],
                            factory: function (sId, oContext) {
                                var oCtrl = sap.ui.getCore().byId(oContext.getObject());
                                //we don't want to add the evnet listener more then once
                                oCtrl.detachPress(closePopover);
                                oCtrl.attachPress(closePopover);
                                return oCtrl;
                            }
                        }
                    }
                );

                oPopover = new sap.m.Popover("headEndItemsOverflow", {
                    placement: sap.m.PlacementType.Bottom,
                    showHeader: false,
                    showArrow: false,
                    content: oItemsLayout
                }).addStyleClass("sapUshellPopupContainer");
                oItemsLayout.updateAggregation = this.getView().updateShellAggregation;
                oPopover.setModel(oModel);
                this.getView().aDanglingControls.push(oPopover);
                oPopover.attachAfterClose(oPopover, function () {
                    // reset header hiding according to the current state (on mobile devices only)
                    if (!sap.ui.Device.system.desktop) {
                        if (origHeaderHiding) {
                            //set the orig header hiding only if it was changed
                            oModel.setProperty("/currentState/headerHiding", origHeaderHiding);
                        }
                    }
                });
            }
            if (oPopover.isOpen()) {
                oPopover.close();
            } else {
                oItemsLayout.updateAggregation("content");
                oPopover.openBy(oEvent.getSource());
            }
        },


        getFavIconHref: function () {
            return jQuery('link').filter('[rel="shortcut icon"]').attr('href') || '';
        },

        externalSearchTriggered: function (sChannelId, sEventId, oData) {
            oModel.setProperty("/searchTerm", oData.searchTerm);
            oData.query = oData.searchTerm;
        },
        onAfterNavigate: function (oEvent) {
            this.closeLoadingScreen();

            var sHome = this.oViewPortContainer.getInitialCenterViewPort(), //DashboardPage
                sFrom = oEvent.getParameter("fromId"),
                oFrom = oEvent.getParameter("from");

            if (sFrom && sFrom !== sHome) {
                //this.oViewPortContainer.removeAggregation("centerViewPort", sFrom, true);
                this.oViewPortContainer.removeCenterViewPort(sFrom, true);
                oFrom.destroy();
            }

            sap.ushell.utils.addTime("ShellController.onAfterNavigate");
            if (oEvent.mParameters && oEvent.mParameters.toId === sHome) {
                sap.ui.getCore().byId("configBtn").focus();
                if (this.oHomeApp && this.oHomeApp.setInitialConfiguration) {
                    this.oHomeApp.setInitialConfiguration();
                }
            }
        },
        logApplicationUsage: function (oEvent, oName, oApplication) {
            if (oConfig && oConfig.enableRecentActivity) {
                var sId = oApplication.appId,
                    sIntent = sId,
                    oRecentEntry = {};

                oRecentEntry.title =  oApplication.usageTitle;
                oRecentEntry.appType = sap.ushell.services.AppType.APP; // default app type the shell adds is 'Application'
                oRecentEntry.url = '#' + this.lastApplicationFullHash;

                if (sId.indexOf('-') > 0) {
                    sIntent = sId.substr(sId.indexOf('-') + 1);
                }

                oRecentEntry.appId = '#' + sIntent;

                // this is a special case for search - in case th intent opened was 'Action-search'
                // we know this is the search app and would set the appType accordingly
                if (sIntent === "Action-search") {
                    oRecentEntry.appType = sap.ushell.services.AppType.SEARCH;
                }

                this._logRecentActivity(oRecentEntry);
            }
        },

        openLoadingScreen: function () {
            //Performance Debug
            jQuery.sap.measure.start("FLP:ShellController.openLoadingScreen", "openLoadingScreen","FLP");

            if (this.oFiori2LoadingDialog){

                var sAnimationMode = oModel.getProperty('/animationMode');
                // in case not supplied by configuration (might happen) default is 'full' e.g. all animations as normal
                var sAnimationMode = sAnimationMode || 'full';

                this.oFiori2LoadingDialog.openLoadingScreen(sAnimationMode);
            }
            jQuery.sap.measure.end("FLP:ShellController.openLoadingScreen");
        },

        closeLoadingScreen: function () {
            if (this.oFiori2LoadingDialog) {
                this.oFiori2LoadingDialog.closeLoadingScreen();
            }
        },

        readNavigationEnd: function () {
            var oAccessibilityHelperLoadingComplete = document.getElementById("sapUshellLoadingAccessibilityHelper-loadingComplete");

            if (oAccessibilityHelperLoadingComplete) {
                oAccessibilityHelperLoadingComplete.setAttribute("aria-live","polite");
                oAccessibilityHelperLoadingComplete.innerHTML =  sap.ushell.resources.i18n.getText("loadingComplete");
                setTimeout(function(){
                    oAccessibilityHelperLoadingComplete.setAttribute("aria-live","off");
                    oAccessibilityHelperLoadingComplete.innerHTML = "";
                },0);
            }
        },

        delayedCloseLoadingScreen: function () {
            setTimeout(function () {
                this.closeLoadingScreen();
            }.bind(this), 600);
        },

        togglePane: function (oEvent) {
            var oSource = oEvent.getSource(),
                bState = oSource.getSelected();

            sap.ui.getCore().getEventBus().publish("launchpad", "togglePane", {currentContent: oSource.getModel().getProperty("/currentState/paneContent")});

            if (oEvent.getParameter("id") === "categoriesBtn") {
                oSource.getModel().setProperty("/currentState/showCurtainPane", !bState);
            } else {
                oSource.getModel().setProperty("/currentState/showPane", !bState);
            }
        },

        /**
         * OnClick handler of the notifications counter button, on the shell header right side
         */
        toggleNotificationsView: function (oEvent) {
            var oSource = oEvent.getSource(),
                oNotificationView,
                oNotificationsService = sap.ushell.Container.getService("Notifications"),
                oNotificationsPreviewContainer = sap.ui.getCore().byId("notifications-preview-container");

            this.bMeAreaSelected = false;
            // disable meArea toggle if active
            var oMeAreaButton = sap.ui.getCore().byId("meAreaHeaderButton");
            if (oMeAreaButton) {
                oMeAreaButton.setSelected(false);
                jQuery(oMeAreaButton.getDomRef()).attr("aria-pressed", "false");
            }

            if (!sap.ui.getCore().byId('notificationsView')) {
                // Create notifications view
                oNotificationView = sap.ui.view("notificationsView", {
                    viewName: "sap.ushell.renderers.fiori2.notifications.Notifications",
                    type: 'JS',
                    viewData: {}
                });
                // Add the notifications view to the right pane of the viewPort
                this.oViewPortContainer.addRightViewPort(oNotificationView);
            }

            // If button is already selected (pressed)
            this.bNotificationsSelected = oSource.getSelected();
            if (this.bNotificationsSelected) {
                this._switchViewPortStateByControl(oSource, "Center");
            } else {

                this.getView().getModel().setProperty("/notificationsCount", 0);
                //TODO : REMOVE THE CALL FOR THIS CONTROL FROM THE SHELL!!!! (oNotificationsPreviewContainer)
                if (oNotificationsPreviewContainer) {
                    oNotificationsPreviewContainer.setFloatingContainerItemsVisiblity(false);
                    var itemsCount = oNotificationsPreviewContainer.getFloatingContainerItems().length;

                    setTimeout(function () {
                        this.oViewPortContainer.navTo('rightViewPort', "notificationsView", 'show');
                        this._switchViewPortStateByControl(oSource, "RightCenter");
                        sap.ui.getCore().getEventBus().publish("launchpad", "notificationViewOpened");
                    }.bind(this), 300 + (itemsCount * 100));
                } else {
                    this.oViewPortContainer.navTo('rightViewPort', "notificationsView", 'show');
                    this._switchViewPortStateByControl(oSource, "RightCenter");
                    sap.ui.getCore().getEventBus().publish("launchpad", "notificationViewOpened");
                }
            }

            this.bNotificationsSelected = !this.bNotificationsSelected;
            oSource.setSelected(this.bNotificationsSelected);

            oNotificationsService.notificationsSeen();
            this.getView().getModel().setProperty("/notificationsCount", 0);
            jQuery(oSource.getDomRef()).attr("aria-pressed", this.bNotificationsSelected);
            jQuery(oSource.getDomRef()).attr("aria-label", sap.ushell.resources.i18n.getText("NotificationToggleButtonCollapsedNoNotifications"));
        },
        /**
         * OnClick handler of the me area header button
         */
        toggleMeAreaView: function (oEvent) {
            var oSource = oEvent.getSource(),
                bButtonSelected = oSource.getSelected(),
                oModel = this.getModel(),
                sCurrentShellState = oModel.getProperty('/currentState/stateName');

            this.bMeAreaSelected = !bButtonSelected;
            if (sCurrentShellState === 'embedded' || sCurrentShellState === 'embedded-home' || sCurrentShellState === 'standalone' || sCurrentShellState === 'blank-home'  || sCurrentShellState === 'blank') {
                //Present Actions in a Popover.
                // If button is already selected (pressed)
                if (!bButtonSelected) {
                    this.loadMeAreaView();
                }
                this._showActionsInPopOver(oSource);
            } else {
                //Present meArea view.
                this._switchToMeAreaView(oSource);
            }
            // disable notification toggle if active
            var oNotificationButton = sap.ui.getCore().byId("NotificationsCountButton");
            if (oNotificationButton && this.bNotificationsSelected) {
                this.bNotificationsSelected = false;
                oNotificationButton.setSelected(false);
                jQuery(oNotificationButton.getDomRef()).attr("aria-pressed", "false");
            }

            jQuery(oSource.getDomRef()).attr("aria-pressed", this.bMeAreaSelected);
        },

        _showActionsInPopOver: function (oOpenByControl) {
            var oModel = this.getModel(),
                aCurrentStateActions = oModel.getProperty('/currentState/actions');
            if (!this.oActionsPopover) {
                //this._createActionButtons();
                this.oActionsLayout = new sap.ui.layout.VerticalLayout();
                this.oActionsPopover = new sap.m.Popover("sapUshellActionsPopover", {//here
                    showHeader: false,
                    placement: sap.m.PlacementType.Bottom,
                    content: this.oActionsLayout
                }).addStyleClass("sapUshellPopupContainer");

            }
            this.oActionsLayout.removeAllContent();
            this._createActionButtons();
            aCurrentStateActions.forEach(function (sActionId, iIndex) {
                var oAction = sap.ui.getCore().byId(sActionId);

                if (oAction && oAction.setActionType) {
                    /*since the factory can be called many times,
                     we need to add the press handler only once.
                     the method below makes sure it is added only once per control
                     the press handler is attached to all actions, and switches the
                     viewport state to "Center" as requested by UX*/
                    //TODO: COMPLETE THIS LOGIC!!
                    //oController._addPressHandlerToActions(oCtrl);
                    this.oActionsLayout.addContent(oAction);
                    oAction.setActionType('standard');
                    oAction.addStyleClass('sapUshellStandardActionItem');
                }
            }.bind(this));
            this.oActionsPopover.openBy(oOpenByControl);
            this.oActionsPopover.setModel(oModel);
        },

        _switchToMeAreaView: function (oOpenByControl) {
            var bButtonSelected = oOpenByControl.getSelected();

            // If button is already selected (pressed)
            if (bButtonSelected) {
                this._switchViewPortStateByControl(oOpenByControl, "Center");
            } else {
                this._switchViewPortStateByControl(oOpenByControl, "LeftCenter");
                //create the Me Area view only after the animation starts
                //this give an immediate visual feedback when the user clicks on the Me Area button
                this.loadMeAreaView();
            }
        },

        /*
         * Switch the view port state.
         * To be used in a scenario where clicking on some control invokes the view-port switch state.
         * Currently in the toggle-Me-Area and toggle-Notifications-view scenario.
         *
         * This method disabled the control during the view-port state switch animtaion, and only when animation
         * is finished enabled it back
         */
        _switchViewPortStateByControl: function(oOpenByControl, sState) {

            var bControlValid = false, oViewPortContainer = this.oViewPortContainer;

            if (oOpenByControl && oOpenByControl.setEnabled && typeof oOpenByControl.setEnabled === "function") {
                bControlValid = true;
            }

            // in case we can - set the control as disabled
            if (bControlValid) {
                oOpenByControl.addStyleClass("sapUshellShellHeadItemOverrideDisableStyle");
                oOpenByControl.setEnabled(false);
            }

            // CB function which enabled back the control
            function fAfterAnimationFinishedCB() {
                oOpenByControl.setEnabled(true);
                oOpenByControl.removeStyleClass("sapUshellShellHeadItemOverrideDisableStyle");
                // detach the callback
                oViewPortContainer.detachAfterSwitchStateAnimationFinished(fAfterAnimationFinishedCB);
            }

            // attach the CB for after animations finished
            if (bControlValid) {
                oViewPortContainer.attachAfterSwitchStateAnimationFinished(fAfterAnimationFinishedCB);
            }
            // call to switch state
            oViewPortContainer.switchState(sState);
        },

        onScreenSizeChange: function (oParams) {
            this.validateShowLogo(oParams);
            this.handleNavMenuTitleVisibility(oParams);
            this._handleHomeAndBackButtonsVisibility(oParams);
            this.handleEndItemsOverflow(oParams);
        },

        /**
         * Home button should be invisible (in the shell header) in case of navigating to the MeArea on smart phone,
         * or in MeArea on other media, when opening the MeArea from the dashboard
         */
        _handleHomeAndBackButtonsVisibility: function (oParams) {
            var oModel = sap.ushell.renderers.fiori2.ShellModel.getModel(),
                bIsInCenterViewPort = oModel.getProperty('/currentViewPortState') === 'Center',
                deviceType = sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name,
                oHomeBtn = sap.ui.getCore().byId("homeBtn"),
                oBackBtn = sap.ui.getCore().byId("backBtn"),
                bHomeBtnVisible = deviceType === "Desktop",
                bBackBtnVisible = deviceType !== "Phone" || bIsInCenterViewPort;

            if (oHomeBtn) {
                oHomeBtn.setVisible(bHomeBtnVisible);
            }
            if (oBackBtn) {
                oBackBtn.setVisible(bBackBtnVisible);
            }
        },

        validateShowLogo: function (oParams) {
            var deviceType;
            var sCurrentState = this.getModel().getProperty('/currentState/stateName');
            var bIsHeaderLessState = sCurrentState === 'merged' || sCurrentState === 'headerless' || sCurrentState === 'headerless-home' || sCurrentState === 'merged-home';
            if (oParams) {
                deviceType = oParams.name;
            } else {
                deviceType = sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;
            }
            var bShellLogoVisible = true;
            if (deviceType === "Phone" && !this.bMeAreaSelected || bIsHeaderLessState) {
                bShellLogoVisible = false;
            }
            ///Last arg - bDoNotPropagate is truethy otherwise changes will redundantly apply also to other states (e.g. - headerless should always be presented without logo)
            oShellModel.updateStateProperty("showLogo", bShellLogoVisible, false, ["home", "app", "blank", "blank-home"], true);
        },

        handleNavMenuTitleVisibility: function (oParams) {
            this.bNavMenuTitleVisible = false;

            if (oParams.name !== "Desktop") {
                this.bNavMenuTitleVisible = true;
            }
            oShellModel.updateStateProperty("application/showNavMenuTitle", this.bNavMenuTitleVisible, true);
        },

        /*
         * method used for navigation from items of the Shell-Application-Navigation-Menu.
         * this method makes sure the view-port is centered before triggering navigation
         * (as the notifications or me-area might be open, and in addition
         * fire an event to closes the popover which opens the navigation menu
         */
        navigateFromShellApplicationNavigationMenu: function (sIntent) {

            // we must make sure the view-port is centered before triggering navigation from shell-app-nav-menu
            this.oViewPortContainer.switchState("Center");

            // trigger the navigation
            hasher.setHash(sIntent);

            // close the popover which holds the navigation menu
            var oShellAppTitle = sap.ui.getCore().byId("shellAppTitle");
            if (oShellAppTitle) {
                oShellAppTitle.close();
            }

        },

        loadUserImage: function () {
            if (!this.bUserImageAlreadyLoaded) {
                this.getView().loadUserImage();
                this.bUserImageAlreadyLoaded = true;
            }
        },

        _loadCoreExtNWBC: function (sSender, sEventName, oAppTarget) {
            if (oAppTarget && oAppTarget.applicationType == "NWBC") {
                setTimeout(this._loadCoreExt, 2000);
            }
        },

        _loadCoreExt: function () {
            //if sap.fiori.core or sap.fiori.core-ext-light are loaded, we do not need to load core-ext-light
            var bAlreadyLoaded = jQuery.sap.isDeclared('sap.fiori.core', true) || jQuery.sap.isDeclared('sap.fiori.core-ext-light', true),
                sModuleName = window['sap-ui-debug'] === true ? 'sap/fiori/core-ext-light-dbg.js' : 'sap/fiori/core-ext-light.js',
                that = this;

            function loadRendererExtensionPlugins() {
                if (!that._pluginLoadingTriggered) {
                    that._pluginLoadingTriggered = true;
                    jQuery.sap.log.info("Triggering load of 'RendererExtension' plug-ins after loading core-ext module (after home page content rendered)",
                        null, "sap.ushell.renderers.fiori2.Shell");
                    sap.ushell.Container.getService("PluginManager").loadPlugins("RendererExtensions");
                }
            }

            if (bAlreadyLoaded) {
                loadRendererExtensionPlugins();
                return;
            }

            this.oCoreExtLoadingDeferred = new jQuery.Deferred();
            jQuery.sap._loadJSResourceAsync(sModuleName)
                .then(function () {
                    loadRendererExtensionPlugins();
                    that.oCoreExtLoadingDeferred.resolve();
                    that._publishCoreExtLoadedEvent();
                })
                .catch(function () {
                    loadRendererExtensionPlugins();
                    jQuery.sap.log.warning('failed to load sap.fiori.core-ext-light');
                    that.oCoreExtLoadingDeferred.reject();
                });
        },

        _publishCoreExtLoadedEvent: function () {
            setTimeout(function () {
                sap.ui.getCore().getEventBus().publish("launchpad", "coreExtLoaded");
            }, 0);
        },

        getCurrentViewportState: function () {
            var sViewPortState = oModel.getProperty('/currentViewPortState');
            return sViewPortState;
        },

        makeEndUserFeedbackAnonymousByDefault: function (bEndUserFeedbackAnonymousByDefault) {
            this.oEndUserFeedbackConfiguration.anonymousByDefault = bEndUserFeedbackAnonymousByDefault;
        },

        showEndUserFeedbackLegalAgreement: function (bShowEndUserFeedbackLegalAgreement) {
            this.oEndUserFeedbackConfiguration.showLegalAgreement = bShowEndUserFeedbackLegalAgreement;
        },

        setFloatingContainerDragSelector: function (sElementToCaptureSelector) {
            jQuery(sElementToCaptureSelector).addClass("sapUshellShellFloatingContainerSelector");

            if (this.oFloatingUIActions) {
                this.oFloatingUIActions.delete();
            }
            this.oFloatingUIActions = new sap.ushell.UIActions({
                containerSelector: ".sapUiBody",
                wrapperSelector: '.sapUshellShellFloatingContainerWrapper',
                draggableSelector: '.sapUshellShellFloatingContainerWrapper',//the element that we drag
                rootSelector: ".sapUiBody",
                cloneClass: "sapUshellFloatingContainer-clone",
                dragCallback: this._handleFloatingContainerUIStart.bind(this), //for hide the original item while dragging
                endCallback: this._handleFloatingContainerDrop.bind(this),
                moveTolerance: 3,
                switchModeDelay: 1000,
                isLayoutEngine: false,
                isTouch: false,//that.isTouch,
                elementToCapture: sElementToCaptureSelector,
                debug: jQuery.sap.debug()
            }).enable();

        },

        _handleFloatingContainerDrop: function (oEvent, floatingContainerWrapper, oDelta) {
            var oFloatingContainer = floatingContainerWrapper.firstChild ? sap.ui.getCore().byId(floatingContainerWrapper.firstChild.id) : undefined,
                storage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer"),
                iWindowWidth = jQuery(window).width(),
                iWindowHeight = jQuery(window).height(),
                iPosLeft = oDelta.deltaX / iWindowWidth,
                iPosTop = oDelta.deltaY / iWindowHeight,
                sOrigContainerVisibility = floatingContainerWrapper.style.visibility,
                sOrigContainerDisplay = floatingContainerWrapper.style.display,
                iContainerLeft = parseFloat(floatingContainerWrapper.style.left.replace("%", "")),
                iContainerTop = parseFloat(floatingContainerWrapper.style.top.replace("%", ""));

            floatingContainerWrapper.style.visibility = 'hidden';
            floatingContainerWrapper.style.display = 'block';

            if (typeof (iContainerLeft) === 'number') {
                iPosLeft = iContainerLeft + 100 * oDelta.deltaX / iWindowWidth;
            }

            if (typeof (iContainerTop) === 'number') {
                iPosTop = iContainerTop + 100 * oDelta.deltaY / iWindowHeight;
            }

            floatingContainerWrapper.setAttribute("style", "left:" + iPosLeft + "%;top:" + iPosTop + "%;position:absolute;");
            floatingContainerWrapper.visibility = sOrigContainerVisibility;
            floatingContainerWrapper.display = sOrigContainerDisplay;
            storage.put("floatingContainerStyle", floatingContainerWrapper.getAttribute("style"));
            //Call resizeHandler to adjust the size and position of the floating container in case it was droped out of the window size boundries.
            if (oFloatingContainer) {
                oFloatingContainer.handleDrop();
            }
        },

        _handleFloatingContainerUIStart: function (evt, ui) {
            var floatingContainer = ui;

            floatingContainer.style.display = "none";
            if (window.getSelection) {
                var selection = window.getSelection();
                // for IE
                try {
                    selection.removeAllRanges();
                } catch (e) {
                    // continue regardless of error
                }
            }
        },

        setFloatingContainerVisibility: function (bVisible) {
            this.getView().getOUnifiedShell().setFloatingContainerVisible(bVisible);
        },

        getFloatingContainerVisibility: function () {
            return this.getView().getOUnifiedShell().getFloatingContainerVisible();
        },

        setFloatingContainerContent: function (sPropertyString, aIds, bCurrentState, aStates) {
            var floatingContainerWrapper = document.querySelector(".sapUshellShellFloatingContainerWrapper"),
                storage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer");

            if (storage.get("floatingContainerStyle")) {
                floatingContainerWrapper.setAttribute("style", storage.get("floatingContainerStyle"));
            } else {
                var emSize = jQuery(".sapUshellShellHeadItm").position() ? jQuery(".sapUshellShellHeadItm").position().left : 0;
                var iLeftPos = (jQuery(window).width() - jQuery("#shell-floatingContainer").width() - emSize) * 100 / jQuery(window).width();
                var iTopPos = jQuery(".sapUshellShellHeadContainer").height() * 100 / jQuery(window).height();
                floatingContainerWrapper.setAttribute("style", "left:" + iLeftPos + "%;" + "top:" + iTopPos + "%;position:absolute;");
            }

            oShellModel.setFloatingContainerContent(sPropertyString, aIds, bCurrentState, aStates);
        },

        getRightFloatingContainerVisibility: function () {
            var oRightFloatingContainer = this.getView().getOUnifiedShell().getRightFloatingContainer(),
                bRightFloatingContainerVisible = oRightFloatingContainer && oRightFloatingContainer.getVisible();

            return bRightFloatingContainerVisible;
        },

        setHeaderTitle: function (sTitle, oInnerControl) {
            if (typeof sTitle !== "string") {
                throw new Error("sTitle type is invalid");
            }

            this.getView().getOUnifiedShell().getHeader().setTitleControl(sTitle, oInnerControl);
        },

        addEndUserFeedbackCustomUI: function (oCustomUIContent, bShowCustomUIContent) {
            if (oCustomUIContent) {
                this.oEndUserFeedbackConfiguration.customUIContent = oCustomUIContent;
            }
            if (bShowCustomUIContent === false) {
                this.oEndUserFeedbackConfiguration.showCustomUIContent = bShowCustomUIContent;
            }
        },

        setFooter: function (oFooter) {
            if (typeof oFooter !== "object" || !oFooter.getId) {
                throw new Error("oFooter value is invalid");
            }
            if (this.getView().oShellPage.getFooter() !== null) { //there can be only 1 footer
                jQuery.sap.log.warning("You can only set one footer. Replacing existing footer: " + this.getView().oShellPage.getFooter().getId() + ", with the new footer: " + oFooter.getId() + ".");
            }
            this.getView().oShellPage.setFooter(oFooter);
        },

        removeFooter: function () {
            if (this.getView().oShellPage.getFooter() === null) {
                jQuery.sap.log.warning("There is no footer to remove.");
                return;
            }
            this.getView().oShellPage.setFooter(null);
        },

        addUserPreferencesEntry: function (entryObject) {
            this._validateUserPrefEntryConfiguration(entryObject);
            this._updateUserPrefModel(entryObject);
        },

        addUserProfilingEntry: function (entryObject) {
            this._validateUserPrefEntryConfiguration(entryObject);
            this._updateProfilingModel(entryObject);
        },

        _validateUserPrefEntryConfiguration: function (entryObject) {
            if ((!entryObject) || (typeof entryObject !== "object")) {
                throw new Error("object oConfig was not provided");
            }
            if (!entryObject.title) {
                throw new Error("title was not provided");
            }

            if (!entryObject.value) {
                throw new Error("value was not provided");
            }

            if (typeof entryObject.entryHelpID !== "undefined") {
                if (typeof entryObject.entryHelpID !== "string") {
                    throw new Error("entryHelpID type is invalid");
                } else {
                    if (entryObject.entryHelpID === "") {
                        throw new Error("entryHelpID type is invalid");
                    }
                }
            }

            if (entryObject.title && typeof entryObject.title !== "string") {
                throw new Error("title type is invalid");
            }

            if (typeof entryObject.value !== "function" && typeof entryObject.value !== "string" && typeof entryObject.value !== "number") {
                throw new Error("value type is invalid");
            }

            if (entryObject.onSave && typeof entryObject.onSave !== "function") {
                throw new Error("onSave type is invalid");
            }

            if (entryObject.content && typeof entryObject.content !== "function") {
                throw new Error("content type is invalid");
            }

            if (entryObject.onCancel && typeof entryObject.onCancel !== "function") {
                throw new Error("onCancel type is invalid");
            }
        },

        switchViewState: function (sState, bSaveLastState) {
            var sActualState = sState;

            if (sState === 'home' && (oConfig.appState === 'embedded' || oConfig.appState == 'headerless' || oConfig.appState == 'merged'  || oConfig.appState == 'blank')) {
                sActualState = oConfig.appState + '-home';
            } else if (sState === 'app' && allowedAppStates.indexOf(oConfig.appState) >= 0) {
                sActualState = oConfig.appState;
            }
            var oState = oShellModel.switchState(sActualState, bSaveLastState);

            if (sState === "searchResults") {
                oModel.setProperty("/lastSearchScreen", '');
                if (!hasher.getHash().indexOf("Action-search") === 0) {
                    var searchModel = sap.ui.getCore().getModel("searchModel");
                    hasher.setHash("Action-search&/searchTerm=" + searchModel.getProperty("/uiFilter/searchTerms") + "&dataSource=" + JSON.stringify(searchModel.getProperty("/uiFilter/dataSource").getJson()));
                }
            }
            //We need to call _handleHomeAndBackButtonsVisibility for the case in which we navigate from 'Home' to 'App'.
            this._handleHomeAndBackButtonsVisibility();
            sap.ui.getCore().getEventBus().publish("launchpad", "shellViewStateChanged", oState);
        },

        _navBack: function () {
            // set meAria as closed when navigating back
            this.bMeAreaSelected = false;
            fnBackNavigationHander();
        },

        _historyBackNavigation: function () {
            window.history.back();
        },

        _updateUserPrefModel: function (entryObject) {
            var newEntry = this._getModelEntryFromEntryObject(entryObject),
                userPreferencesEntryArray = oModel.getProperty("/userPreferences/entries");

            userPreferencesEntryArray.push(newEntry);
            // Re-order the entries array to have the Home Page entry right after the Appearance entry (if both exist)
            userPreferencesEntryArray = this._reorderUserPrefEntries(userPreferencesEntryArray);
            oModel.setProperty("/userPreferences/entries", userPreferencesEntryArray);
        },

        _updateProfilingModel: function (entryObject) {
            var newEntry = this._getModelEntryFromEntryObject(entryObject),
                userProfilingArray = oModel.getProperty("/userPreferences/profiling") || [];

            userProfilingArray.push(newEntry);
            oModel.setProperty("/userPreferences/profiling", userProfilingArray);
        },

        _getModelEntryFromEntryObject: function (entryObject) {
            return {
                "entryHelpID": entryObject.entryHelpID,
                "title": entryObject.title,
                "editable": entryObject.content ? true : false,
                "valueArgument": entryObject.value,
                "valueResult": null,
                "onSave": entryObject.onSave,
                "onCancel": entryObject.onCancel,
                "contentFunc": entryObject.content,
                "contentResult": null,
                "icon": entryObject.icon
            };
        },

        pressActionBtn: function (oEvent) {
            // don't hide the shell header when the action sheet is open on mobile devices only
            if (!sap.ui.Device.system.desktop) {
                //keep original header hiding value for reset after action sheet close
                var origHeaderHiding = oModel.getProperty("/currentState").headerHiding;
                if (origHeaderHiding) {
                    //if the header hiding is false -> no need to update the property
                    oModel.setProperty("/currentState/headerHiding", false);
                }
            }
            var oActionSheet = sap.ui.getCore().byId('headActions');
            if (!oActionSheet) {
                this._createActionButtons();
                // Filtering out buttons that does not exist.
                // i.e. when the button's name is included in the array /currentState/actions but the actual control was not created.
                // For example EndUserFeedback button is not created when EndUserFeedbackAdapter is not implemented,
                //  but its name ("EndUserFeedbackBtn") appears in the actions array for several states.
                var oFilter = new sap.ui.model.Filter('', 'EQ', 'a');
                oFilter.fnTest = function (sButtonNameInUpperCase) {
                    var aButtonsNames = oModel.getProperty("/currentState/actions"),
                        sButtonName,
                        index;
                    for (index = 0; index < aButtonsNames.length; index++) {
                        sButtonName = aButtonsNames[index];
                        if (sButtonName.toUpperCase() == sButtonNameInUpperCase) {
                            return !!sap.ui.getCore().byId(sButtonName);
                        }
                    }
                };

                oActionSheet = new sap.m.ActionSheet("headActions", {
                    placement: sap.m.PlacementType.Bottom,
                    buttons: {
                        path: "/currentState/actions",
                        filters: [oFilter],
                        factory: function (sId, oContext) {
                            var oCtrl = sap.ui.getCore().byId(oContext.getObject());
                            if (oCtrl && oCtrl.setActionType) {
                                oCtrl.setActionType("standart");
                            }
                            return oCtrl;
                        }
                    }
                });
                oActionSheet.updateAggregation = this.getView().updateShellAggregation;
                oActionSheet.setModel(oModel);
                this.getView().aDanglingControls.push(oActionSheet);
                oActionSheet.attachAfterClose(oActionSheet, function () {
                    // reset header hiding according to the current state (on mobile devices only)
                    if (!sap.ui.Device.system.desktop) {
                        if (origHeaderHiding) {
                            //set the orig header hiding only if it was changed
                            oModel.setProperty("/currentState/headerHiding", origHeaderHiding);
                        }
                    }
                });
            }
            oActionSheet.updateAggregation("buttons");
            oActionSheet.openBy(oEvent.getSource());
        },
        _setUserPrefModel: function () {
            var userPreferencesEntryArray = oModel.getProperty("/userPreferences/entries");
            var oDefaultUserPrefModel = this._getUserPrefDefaultModel();
            oDefaultUserPrefModel.entries = oDefaultUserPrefModel.entries.concat(userPreferencesEntryArray);
            // Re-order the entries array to have the Home Page entry right after the Appearance entry (if both exist)
            oDefaultUserPrefModel.entries = this._reorderUserPrefEntries(oDefaultUserPrefModel.entries)

            oModel.setProperty("/userPreferences", oDefaultUserPrefModel);
        },

        _reorderUserPrefEntries: function(aEntries) {
            var flpSettingsEntryIndex,
                themesEntryIndex;
            // Go through all entries to find the Home Page and the Appearance entries
            for (var i = 0; i < aEntries.length; i++) {
                if (aEntries[i].entryHelpID === "flpSettingsEntry") {
                    flpSettingsEntryIndex = i;
                } else if (aEntries[i].entryHelpID === "themes") {
                    themesEntryIndex = i;
                }
                // Only if both were found perform the change
                if (flpSettingsEntryIndex != undefined && themesEntryIndex != undefined) {
                    // Remove the flp setting (Home Page) entry from the array
                    // The flp settings entry is always located after the themes entry in the array
                    // so even after removing it, the themes entry index is still correct
                    var flpSettingsEntry = aEntries.splice(flpSettingsEntryIndex, 1);
                    // Add it back right after the themes (Appearance) entry
                    aEntries.splice(themesEntryIndex + 1, 0, flpSettingsEntry[0]);
                    break;
                }
            }
            return aEntries;
        },

        _getUserPrefDefaultModel: function () {
            var that = this;
            var oUser = sap.ushell.Container.getUser();

            // search preferences (user profiling, concept of me)
            // entry is added async only if search is active
            jQuery.sap.require('sap.ushell.renderers.fiori2.search.userpref.SearchPrefs');
            var SearchPreferences = sap.ushell.renderers.fiori2.search.userpref.SearchPrefs;
            var searchPreferencesEntry = SearchPreferences.getEntry();
            searchPreferencesEntry.isSearchPrefsActive().done(function (isSearchPrefsActive) {
                if (!isSearchPrefsActive) {
                    return;
                }
                // Add search as a profile entry
                that.addUserProfilingEntry(searchPreferencesEntry);
            });

            function GeneralEntry(viewId, viewFullName, viewType, entryHelpID, title, onSaveFunc, onCancelFunc, getContentFunc, getValueFunc, isEditableFunc, oModel, entryIcon, defaultVisibility) {
                this.view = null;
                this.getView = function () {
                    if (!this.view || !sap.ui.getCore().byId(viewId)) {
                        if (viewType === "xml") {
                            this.view = sap.ui.xmlview(viewId, viewFullName);
                        } else {
                            this.view = sap.ui.jsview(viewId, viewFullName);
                        }
                    }
                    if (oModel) {
                        this.view.setModel(oModel);
                    }
                    return this.view;
                };

                return {
                    entryHelpID: entryHelpID,
                    title: title,
                    valueResult: null,
                    onSave: onSaveFunc ? onSaveFunc.bind(this) : function () {
                        if (this.getView().getController().onSave) {
                            return this.getView().getController().onSave();
                        }
                        return;
                    }.bind(this),
                    onCancel: onCancelFunc ? onCancelFunc.bind(this) : function () {
                        if (this.getView().getController().onCancel) {
                            return this.getView().getController().onCancel();
                        }
                        return;
                    }.bind(this),
                    contentFunc: getContentFunc ? getContentFunc.bind(this) : function () {
                        if (this.getView().getController().getContent) {
                            return this.getView().getController().getContent();
                        }
                        return;
                    }.bind(this),
                    valueArgument: getValueFunc ? getValueFunc.bind(this) : function () {
                        var dfd = jQuery.Deferred(),
                            that = this;

                        setTimeout(function() {
                            if (that.getView().getController().getValue) {
                                that.getView().getController().getValue().done(function(value) {
                                   dfd.resolve(value);
                                });
                            }
                        }, 0);

                        return dfd.promise();
                    }.bind(this),
                    editable: typeof isEditableFunc === "function" ? isEditableFunc() : isEditableFunc,
                    contentResult: null,
                    icon: entryIcon,
                    defaultVisibility : defaultVisibility
                };
            }

            // Create user preference entries for:
            // - themeSelector
            // - usageAnalytics
            // - DefaultParameters
            // - userProfiling
            // - CompactCozySelector

            var themeSelectorEntry = new GeneralEntry(
                "userPrefThemeSelector",
                "sap.ushell.renderers.fiori2.theme_selector.ThemeSelector",
                "xml",
                "themes",
                sap.ushell.resources.i18n.getText("Appearance"),
                function () {
                    var dfd = this.getView().getController().onSave();
                    dfd.done(function () {
                        // re-calculate tiles background color according to the selected theme
                        if (oModel.getProperty("/tilesOpacity") === true) {
                            sap.ushell.utils.handleTilesOpacity();
                        }
                    });
                    return dfd;
                },
                undefined,
                undefined,
                undefined,
                function () {
                    if (oModel.getProperty("/setTheme") !== undefined) {
                        return oModel.getProperty("/setTheme") && oUser.isSetThemePermitted();
                    } else {
                        return oUser.isSetThemePermitted();
                    }
                },
                this.getView().getModel(),
                "sap-icon://palette"
            );

            var usageAnalyticsEntry = new GeneralEntry(
                "userPrefUsageAnalyticsSelector",
                "sap.ushell.renderers.fiori2.usageAnalytics_selector.UsageAnalyticsSelector",
                "js",
                "usageAnalytics",
                sap.ushell.resources.i18n.getText("usageAnalytics"),
                undefined,
                undefined,
                undefined,
                undefined,
                sap.ushell.Container.getService("UsageAnalytics").isSetUsageAnalyticsPermitted()
                );

            var defaultParametersEntry = new GeneralEntry(
                "defaultParametersSelector",
                "sap.ushell.renderers.fiori2.defaultParameters_selector.DefaultParameters",
                "js",
                undefined,
                sap.ushell.resources.i18n.getText("defaultsValuesEntry"),
                undefined,
                undefined,
                undefined,
                undefined,
                true,
                undefined,
                undefined,
                false
            );

            var userProfilingEntry = new GeneralEntry(
                "userProfilingView",
                "sap.ushell.renderers.fiori2.profiling.UserProfiling",
                "js",
                "userProfiling",
                sap.ushell.resources.i18n.getText("userProfiling"),
                undefined,
                undefined,
                undefined,
                undefined,
                false,
                this.getView().getModel(),
                "sap-icon://user-settings",
                false
            );

            function LanguageRegionEntry() {
                this.view = null;

                this.getView = function getView() {
                    if (!this.languageRegionSelector) {
                        this.languageRegionSelector = sap.ui.jsview("languageRegionSelector", "sap.ushell.renderers.fiori2.userPreferences.LanguageRegionSelector");
                    }
                    return this.languageRegionSelector;
                };

                var onSaveFunc = function () {
                    var dfd = this.getView().getController().onSave();
                    return dfd;
                }.bind(this);

                var onCancelFunc = function () {
                    return this.getView().getController().onCancel();
                }.bind(this);

                var getContentFunc = function () {
                    return this.getView().getController().getContent();
                }.bind(this);

                var getValueFunc = function () {
                    return this.getView().getController().getValue();
                }.bind(this);

                return {
                    entryHelpID: "language",
                    title: sap.ushell.resources.i18n.getText("languageRegionTit"),
                    editable: true,
                    valueArgument: getValueFunc,// the function which will be called to get the entry value
                    valueResult: null,
                    onSave: onSaveFunc,
                    onCancel: onCancelFunc, // the function which will be called when canceling entry changes
                    contentFunc: getContentFunc,// the function which will be called to get the content of the detailed entry
                    contentResult: null,
                    icon: "sap-icon://globe"
                };
            }

            function UserAccountEntry() {
                this.view = null;

                this.getView = function getView() {
                    if (!this.userAccountSelector) {
                        this.userAccountSelector = sap.ui.jsview("UserAccountSelector", "sap.ushell.renderers.fiori2.userAccount.UserAccountSelector");
                    }
                    return this.userAccountSelector;
                };

                var onSaveFunc = function () {
                    var dfd = this.getView().getController().onSave();
                    return dfd;
                }.bind(this);

                var onCancelFunc = function () {
                    return this.getView().getController().onCancel();
                }.bind(this);

                var getContentFunc = function () {
                    return this.getView().getController().getContent();
                }.bind(this);

                var getValueFunc = function () {
                    return this.getView().getController().getValue();
                }.bind(this);

                return {
                    entryHelpID: "userAccountEntry",
                    title: sap.ushell.resources.i18n.getText("UserAccountFld"),
                    editable: true,
                    valueArgument: getValueFunc,// the function which will be called to get the entry value
                    valueResult: null,
                    onSave: onSaveFunc,
                    onCancel: onCancelFunc, // the function which will be called when canceling entry changes
                    contentFunc: getContentFunc,// the function which will be called to get the content of the detailed entry
                    contentResult: null,
                    icon: "sap-icon://account"
                };
            }


            var entries =
                    [
                        new UserAccountEntry(),
                        themeSelectorEntry,
                        new LanguageRegionEntry()
                    ],
                profilingEntries = [];

            profilingEntries.push(usageAnalyticsEntry);
            entries.push(userProfilingEntry);

            // User setting entry for notification setting UI
            // Added only if both notifications AND notification settings are enabled
            if (oModel.getProperty("/enableNotifications") === true) {

                var oNotificationSettingsAvalabilityPromise = sap.ushell.Container.getService("Notifications")._getNotificationSettingsAvalability(),
                    notificationSettingsEntry;

                notificationSettingsEntry = new GeneralEntry(
                    "notificationSettings",
                    "sap.ushell.renderers.fiori2.notifications.Settings",
                    "js",
                    undefined,
                    sap.ushell.resources.i18n.getText("notificationSettingsEntry_title"),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    true,
                    undefined,
                    "sap-icon://ui-notifications",
                    false
                );
                entries.push(notificationSettingsEntry);

                oNotificationSettingsAvalabilityPromise.done(function (oStatuses) {
                    if (oStatuses.settingsAvailable) {
                        notificationSettingsEntry.visible = true;// in case the notification entry did not enter already to the model, we should change the
                        oModel.getProperty("/userPreferences/entries").every(function (entry, index) {
                            if (entry.title === sap.ushell.resources.i18n.getText("notificationSettingsEntry_title")) {
                                oModel.setProperty("/userPreferences/entries/" + index + "/visible", true);
                                return false;
                            }
                            return true;
                        });
                    }
                });
            }

            if (oModel.getProperty("/userDefaultParameters")) {
                entries.push(defaultParametersEntry);
            }

            return {
                dialogTitle: sap.ushell.resources.i18n.getText("userSettings"),
                isDetailedEntryMode: false,
                activeEntryPath: null, //the entry that is currently modified
                entries: entries,
                profiling: profilingEntries
            };
        },

        onAfterViewPortSwitchState: function (oEvent) {
            var toState = oEvent.getParameter("to");
            var oShellAppTitle = sap.ui.getCore().byId("shellAppTitle");
            oModel.setProperty("/currentViewPortState", toState);
            if (this.applicationKeyHandler) {
                sap.ushell.renderers.fiori2.AccessKeysHandler.registerAppKeysHandler(this.applicationKeyHandler);
                this.applicationKeyHandler = undefined;
            }
            //Propagate the event 'afterSwitchState' for launchpad consumers.
            sap.ui.getCore().getEventBus().publish("launchpad", "afterSwitchState", oEvent);
            if (toState === "Center") {
                oShellAppTitle.setVisible(true);

                // as this parameter is ONLY set on toggleMeArea method
                // there are many cases in which the me-area closes automatically
                // thus making this property inconsistent.
                // as going to Center (Or Right) we must reset this value for further consistency
                // (otherwise going Left - is only by the toggleMeArea method, so for 'Left' we keep normal behavior)
                this.bMeAreaSelected = false;
            } else {
                oShellAppTitle.setVisible(false);

                if (toState === "Right") {
                    // as this parameter is ONLY set on toggleMeArea method
                    // there are many cases in which the me-area closes automatically
                    // thus making this property inconsistent.
                    // as going to Center (Or Right) we must reset this value for further consistency
                    // (otherwise going Left - is only by the toggleMeArea method, so for 'Left' we keep normal behavior)
                    this.bMeAreaSelected = false;
                } else if (toState == "RightCenter") {
                    this.applicationKeyHandler = sap.ushell.renderers.fiori2.AccessKeysHandler.getAppKeysHandler();
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                    sap.ushell.renderers.fiori2.AccessKeysHandler.registerAppKeysHandler(sap.ui.getCore().byId("notificationsView").getController().keydownHandler.bind(sap.ui.getCore().byId("notificationsView")));
                }
            }
            this.validateShowLogo();
            this._handleHomeAndBackButtonsVisibility();
        },
        getModel: function () {
            return oModel;
        },

        _getConfig: function () {
            return oConfig ? oConfig : {};
        },

        _createWaitForRendererCreatedPromise: function () {
            var oPromise,
                oRenderer;

            oRenderer = sap.ushell.Container.getRenderer();
            if (oRenderer) {
                // should always be the case except initial start; in this case, we return an empty array to avoid delays by an additional async operation
                jQuery.sap.log.debug("Shell controller._createWaitForRendererCreatedPromise: shell renderer already created, return empty array.");
                return [];
            } else {
                oPromise = new Promise(function (resolve, reject) {
                    var fnOnRendererCreated;

                    fnOnRendererCreated = function () {
                        jQuery.sap.log.info("Shell controller: resolving component waitFor promise after shell renderer created event fired.");
                        resolve();
                        sap.ushell.Container.detachRendererCreatedEvent(fnOnRendererCreated);
                    };
                    oRenderer = sap.ushell.Container.getRenderer();
                    if (oRenderer) {
                        // unlikely to happen, but be robust
                        jQuery.sap.log.debug("Shell controller: resolving component waitFor promise immediately (shell renderer already created");
                        resolve();
                    } else {
                        sap.ushell.Container.attachRendererCreatedEvent(fnOnRendererCreated);
                    }
                });
                return [oPromise];
            }
        }
    });
}());
