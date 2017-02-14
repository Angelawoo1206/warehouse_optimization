// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, document, self, hasher*/
    /*jslint plusplus: true, nomen: true, vars: true */

    sap.ui.jsview("sap.ushell.renderers.fiori2.meArea.MeArea", {

        createContent: function (oController) {
            jQuery.sap.require('sap.m.Button');
            jQuery.sap.require('sap.m.OverflowToolbar');
            jQuery.sap.require('sap.ushell.resources');
            jQuery.sap.require('sap.ushell.ui.launchpad.UserStatusItem');
            jQuery.sap.require("sap.ushell.ui.launchpad.AccessibilityCustomData");
            this.addStyleClass('sapUshellMeAreaView');
            this.aDanglingControls = [];

            var sUserName = sap.ushell.Container.getUser().getFullName(),
                oPopover,
                translationBundle = sap.ushell.resources.i18n,
                oConfig = (this.getViewData() ? this.getViewData().config : {}) || {},
                sCurrentShellState = oConfig.appState,
                bCreateDetachedLogoutButton = (sCurrentShellState === 'embedded' || sCurrentShellState === 'embedded-home' || sCurrentShellState === 'standalone' || sCurrentShellState === 'blank-home'  || sCurrentShellState === 'blank'),
                aUserStatusItems,
                oService = sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.UserStatus"),
                oServiceInstance = oService.createInstance(),
                fnStatusChangeHandle = function (newStatus) {
                    oServiceInstance.then(
                        function (oService) {
                            oService.setStatus(newStatus);
                            oPopover.close();
                        }
                    );
                }.bind(this);

            aUserStatusItems = [
                new sap.ushell.ui.launchpad.UserStatusItem({
                    status: sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.AVAILABLE,
                    id: "userStatusItem1",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.AVAILABLE);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer'),
                new sap.ushell.ui.launchpad.UserStatusItem({
                    status: sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.AWAY,
                    id: "userStatusItem2",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.AWAY);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer'),
                new sap.ushell.ui.launchpad.UserStatusItem({
                    status: sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.BUSY,
                    id: "userStatusItem3",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.BUSY);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer'),
                new sap.ushell.ui.launchpad.UserStatusItem({
                    status: sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.APPEAR_OFFLINE,
                    id: "userStatusItem4",
                    isOpener: false,
                    press: function (oEvent) {
                        fnStatusChangeHandle(sap.ushell.ui5service.UserStatus.prototype.AvailableStatus.APPEAR_OFFLINE);
                    }.bind(this)
                }).addStyleClass('sapUserStatusContainer')

            ];

            if (!oConfig.disableSignOut) {
                aUserStatusItems.push(new sap.ushell.ui.launchpad.UserStatusItem({
                    status: sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM.SIGNOUT,
                    id: "userStatusLogout",
                    isOpener: false,
                    press: [oController.logout, oController]
                }).addStyleClass('sapUserStatusSignOutContainer'));
            }

            var oUserStatusItemList = new sap.m.List({
                id: "sapUshellUserStatusItemList",
                showSeparators: "None",
                items: aUserStatusItems
            });
            //"aria-labelledBy", cannot be added in the constructor
            oUserStatusItemList.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "aria-labelledBy",
                value: "userStatusItem1",
                writeToDom: true
            }));

            oPopover = new sap.m.Popover("statuses", {
                placement: sap.m.PlacementType.Bottom,
                showArrow: false,
                showHeader: false,
                content: oUserStatusItemList
            }).addStyleClass('sapUserStatusPopOver');
            oPopover.addStyleClass("sapContrastPlus");
            oPopover.setOffsetX(-3);

            aUserStatusItems = [
                new sap.m.Text({text: sUserName}).addStyleClass('sapUshellMeAreaUserName')
            ];

            var statusOpener = new sap.ushell.ui.launchpad.UserStatusItem({
                id: "userStatusOpener",
                visible: {
                    path: "/userStatusEnabled",
                    formatter: function (bUserStatusEnabled) {
                        if (bUserStatusEnabled) {
                            return true;
                        } else {
                            return false;
                        }
                    }.bind(this)
                },
                status: {
                    path: "/userStatus",
                    formatter: function (sUserStatus) {
                        return sap.ushell.ui.launchpad.UserStatusItem.prototype.STATUS_ENUM[sUserStatus];
                    }
                },
                tooltip: translationBundle.getText("userStatus_tooltip"),
                image: sap.ui.core.IconPool.getIconURI("account"),
                press: function (oEvent) {
                    var oButton = sap.ui.getCore().byId(oEvent.mParameters.id);
                    if (oPopover.isOpen()) {
                        oPopover.close();
                    } else {
                        oPopover.openBy(oButton);
                    }
                }.bind(this),
                contentList: oPopover
            }).addStyleClass('sapUserStatusOpener');

            statusOpener.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "tabindex",
                value: "0",
                writeToDom: true
            }));
            //"aria-label", cannot be added in the constructor
            statusOpener.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "aria-label",
                value: sap.ushell.resources.i18n.getText("OnlineStatus") + " " + translationBundle.getText("userStatus_tooltip"),
                writeToDom: true
            }));
            //"role", cannot be added in the constructor
            statusOpener.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "role",
                value: "listbox",
                writeToDom: true
            }));

            aUserStatusItems.push(statusOpener);

            if (!oConfig.disableSignOut) {
                var oLogoutBtn;
                if (!bCreateDetachedLogoutButton) {
                    oLogoutBtn = new sap.m.Button("logoutBtn", {
                        visible: {
                            parts: ["/userStatusEnabled","/userStatusUserEnabled"],
                            formatter: function (bStatusEnabled, bUserStatusEnabled) {
                                if (bStatusEnabled && bUserStatusEnabled) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }.bind(this)
                        },
                        type: sap.m.ButtonType.Transparent,
                        icon: 'sap-icon://log',
                        text: sap.ushell.resources.i18n.getText("signoutBtn_title"),
                        press: [oController.logout, oController]
                    });
                    aUserStatusItems.push(oLogoutBtn);
                } else {
                    oLogoutBtn = new sap.ushell.ui.launchpad.ActionItem("logoutBtn", {
                        visible: true,
                        type: sap.m.ButtonType.Transparent,
                        icon: 'sap-icon://log',
                        text: sap.ushell.resources.i18n.getText("signoutBtn_title"),
                        press: [oController.logout, oController]
                    });
                }
            }

            var oUserName = new sap.m.VBox({
                tabindex: "0",
                items: [aUserStatusItems]
            }).addStyleClass("sapUshellUserArea");

            var userImage = sap.ushell.Container.getUser().getImage(),
                userBoxItem;

            if (!userImage) {
                userBoxItem = new sap.ui.core.Icon({
                    src: sap.ui.core.IconPool.getIconURI("person-placeholder"),
                    size: '4rem'
                });
            } else {
                userBoxItem = new sap.m.Image({
                    src: userImage
                });
            }
            userBoxItem.addStyleClass("sapUshellMeAreaUserImage");

            var oUserHBox = new sap.m.HBox({
                items: [
                    userBoxItem,
                    oUserName
                ]
            });
            oUserHBox.addStyleClass('sapUshellMeAreaUserInfo');
            oUserHBox.addStyleClass('sapContrastPlus');
            var saveButton = oController.createSaveButton(),
                cancelButton = oController.createCancelButton();
            this.oSettingsDialog = new sap.m.Dialog({
                id: "userSettingsDialog",
                showHeader: false,
                content: null,
                buttons: [saveButton, cancelButton],
                afterClose: function () {
                    sap.ushell.Container.getUser().resetChangedProperties();
                },
                stretch: sap.ui.Device.system.phone
            }).addStyleClass("sapUshellUserSetting");

            this.oSettingsDialog.addContent(oController.getSettingsDialogContent());
            this.aDanglingControls.push(cancelButton, saveButton, this.oSettingsDialog);
            oUserHBox.addEventDelegate({
                                           onsapskipback: function (oEvent) {
                                               oEvent.preventDefault();
                                               sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                                               sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                                           },
                                           onsaptabprevious: function (oEvent) {
                                               oEvent.preventDefault();
                                               sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                                               sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                                           }
                                       });

            var oActionsHBox = new sap.m.OverflowToolbar({
                id: "overflowActions",
                design: sap.m.ToolbarDesign.Transparent,
                content: {
                    path: "/currentState/actions",
                    factory: function (sId, oContext) {
                        var oCtrl = sap.ui.getCore().byId(oContext.getObject());
                        if (oCtrl) {
                            if (oCtrl.setActionType) {
                                oCtrl.setActionType("action");
                            }
                            /*since the factory can be called many times,
                             we need to add the press handler only once.
                             the method below makes sure it is added only once per control
                             the press handler is attached to all actions, and switches the
                             viewport state to "Center" as requested by UX*/
                            oController._addPressHandlerToActions(oCtrl);
                        }
                        return oCtrl;
                    }
                }
            }).addStyleClass('sapContrastPlus');

            //since we customized the control items, we need to override this priveate method, as suggested in
            //internal ticket #1670374902 by UI5 colleague Vladislav Tasev.
            oActionsHBox._getOverflowButtonSize = function() {
                // item width is 4.65rem + 0.25rem left margin + 0.25rem right margin => 5.15rem=82.4px
                return 82.4;
            }

            if (oActionsHBox._getOverflowButton) {
                var overflowButton = oActionsHBox._getOverflowButton();
                if (overflowButton) {
                    var orig = overflowButton.onAfterRendering;
                    overflowButton.onAfterRendering = function () {
                        if (orig) {
                            orig.apply(this, arguments);
                        }
                        this.addStyleClass('sapUshellActionItem');
                        this.setText(sap.ushell.resources.i18n.getText('meAreaMoreActions'));
                    };
                }
            }

            oActionsHBox.updateAggregation = function (sName) {
                /*jslint nomen: true */
                var oBindingInfo = this.mBindingInfos[sName],
                    oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
                    oClone;

                jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function (i, v) {
                    this[oAggregationInfo._sRemoveMutator](v);
                }, this));
                jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function (i, v) {
                    oClone = oBindingInfo.factory(this.getId() + "-" + i, v) ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model) : "";
                    this[oAggregationInfo._sMutator](oClone);
                }, this));
            };

            if (oConfig.enableRecentActivity) {
                var oIconTabBar = new sap.m.IconTabBar('meAreaIconTabBar', {
                    backgroundDesign: sap.m.BackgroundDesign.Transparent,
                    expandable: false,
                    items: [this.createIconTab("recentActivities", true, oController), //Recent activities show timestamp in info property
                        this.createIconTab("frequentActivities", false, oController)] //Frequent activities have no info
                }).addStyleClass('sapUshellMeAreaTabBar');

                oIconTabBar.addEventDelegate({
                    onsaptabnext: function (oEvent) {
                        var oOriginalElement = oEvent.originalEvent,
                            oSourceElement = oOriginalElement.srcElement,
                            aClassList = oSourceElement.classList,
                            bIncludesClass;

                        // Check if the element currently in focus is an actual item in a list such as the Recently Used list
                        bIncludesClass = jQuery.inArray('sapUshellMeAreaActivityItem', aClassList) > -1;
                        if (bIncludesClass === true) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    },
                    // When using F6 - the focus should go from the IconTabBar's header (i.e. the "Recently Used" text) straight to the MeArea header icon
                    onsapskipforward: function (oEvent) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    }
                });

                var origTabBarAfterRendering = oIconTabBar.onAfterRendering;
                oIconTabBar.onAfterRendering = function () {
                    if (origTabBarAfterRendering) {
                        origTabBarAfterRendering.apply(this, arguments);
                    }
                    var oTabBarHeader = sap.ui.getCore().byId('meAreaIconTabBar--header');
                    if (oTabBarHeader) {
                        oTabBarHeader.addStyleClass('sapContrastPlus');
                        oTabBarHeader.addStyleClass('sapUshellTabBarHeader');
                    }
                };

                this.actionBox = oActionsHBox;
                return new sap.m.ScrollContainer({
                    vertical: true,
                    horizontal: false,
                    height: "100%",
                    content: new sap.m.VBox("sapUshellMeAreaContent", {
                        items: [oUserHBox, oActionsHBox, oIconTabBar]
                    })
                });
            } else {
                //if recent activity is disabled then we need to move the accessibility support from oIconTabBar
                //to oActionsHBox
                oActionsHBox.addEventDelegate({
                    onsaptabnext: function (oEvent) {
                        var oOriginalElement = oEvent.originalEvent,
                            oSourceElement = oOriginalElement.srcElement,
                            lastElementId = jQuery('.sapUshellActionItem:last')[0].id,
                            isLastElement;

                        // Check if the element currently in focus is the last action item, if yes go to top
                        isLastElement = lastElementId === oSourceElement.id;
                        if (isLastElement === true) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    },
                    // When using F6 - the focus should go from the ActionsHBox's header straight to the MeArea header icon
                    onsapskipforward: function (oEvent) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    }
                });
            }

            return new sap.m.ScrollContainer({
                vertical: true,
                horizontal: false,
                height: "100%",
                content: new sap.m.VBox("sapUshellMeAreaContent", {
                    items: [oUserHBox, oActionsHBox]
                })
            });
        },

        //This function creates each tab in the IconTabBar.
        //The parameter iconTabName will be used for IDs, for the path in the model and to get the
        //strings from the resource bundle (both the tab and the no-data strings). So they all have to match.
        //showInfo will control if to use the info property to present timestamp.
        createIconTab: function (iconTabName, showInfo, oController) {
            jQuery.sap.require('sap.m.StandardListItem');
            var oActivityTemplateFunction = function (sId, oContext) {
                var sIcon = oContext.getProperty("icon");
                var sTitle = oContext.getProperty("title");

                var sDescription = sap.ushell.services.AppType.getDisplayName(
                    oContext.getProperty("appType"));

                var oLiProperties = {
                    title: sTitle,
                    description: sDescription,
                    icon: sIcon,
                    type: sap.m.ListType.Active
                };
                if (showInfo) {
                    oLiProperties.info = oContext.getProperty("timestamp");
                }
                var oLi = new sap.m.StandardListItem(oLiProperties).addStyleClass('sapUshellMeAreaActivityItem');

                //"aria-label", cannot be added in the constructor
                oLi.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                    key: "aria-describedby",
                    value: oIconTabFilter.getId(),
                    writeToDom: true
                }));

                if (!sIcon) {
                    //fix padding in case no icon exist
                    oLi.addStyleClass('sapUshellMeAreaActivityItemNoIcon');
                }
                return oLi;
            };

            var oIconTabFilter = new sap.m.IconTabFilter({
                id: "sapUshellIconTabBar" + iconTabName,
                text: sap.ushell.resources.i18n.getText(iconTabName)
            });

            var oActivityList = new sap.m.List({
                id: "sapUshellActivityList" + iconTabName,
                showSeparators: "None",
                items: {
                    path: "meAreaModel>/apps/" + iconTabName,
                    factory: oActivityTemplateFunction.bind(this)
                },
                noDataText: sap.ushell.resources.i18n.getText(iconTabName + 'NoDataText'),
                //mode: sap.m.ListMode.SingleSelectMaster,
                itemPress: function (oEvent) {
                    var oModel = this.getModel('meAreaModel'),
                        oViewPort = sap.ui.getCore().byId("viewPortContainer");

                    if (oViewPort) {//added in order to make loading dialog open after view switch
                        oViewPort.switchState("Center");
                    }

                    var sPath = oEvent.getParameter('listItem').getBindingContextPath();
                    oController.setLastVisited(oModel.getProperty(sPath).url);
                    setTimeout(function () {//timeOut is needed in cases in which the app loads fast. This way we get smoother navigation
                        hasher.setHash(oModel.getProperty(sPath).url);
                    }, 200);
                }
            });
            oIconTabFilter.addContent(oActivityList);
            return oIconTabFilter;
        },

        onViewStateShow: function () {
            this.getController().refreshRecentActivities();
            this.getController().refreshFrequentActivities();
            if (this.actionBox) {
                this.actionBox.updateAggregation("content");
            }
            this.getController().updateScrollBar(hasher.getHash());
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.meArea.MeArea";
        }

    });

}());