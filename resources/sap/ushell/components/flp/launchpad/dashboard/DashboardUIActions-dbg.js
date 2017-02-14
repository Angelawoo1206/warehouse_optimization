// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview A module that is responsible for initializing the dashboard UIActions (i.e. drag and drop) of groups and tiles.<br>
 * Extends <code>sap.ui.base.Object</code><br>
 * Exposes the public function <code>initializeUIActions</code>
 * @version 1.44.6
 * @name sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions
 *
 * @since 1.35.0
 * @private
 */
(function () {
    "use strict";

    /*global jQuery, sap, window */
    /*jslint nomen: true */
    jQuery.sap.declare("sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions");
    sap.ui.base.Object.extend("sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions", {
        metadata: {
            publicMethods: ["initializeUIActions"]
        },
        constructor: function (sId, mSettings) {
            // Make this class only available once
            if (sap.ushell.components.flp.launchpad.dashboard.getDashboardUIActions && sap.ushell.components.flp.launchpad.dashboard.getDashboardUIActions()) {
                return sap.ushell.components.flp.launchpad.dashboard.getDashboardUIActions();
            }
            sap.ushell.components.flp.launchpad.dashboard.getDashboardUIActions = jQuery.sap.getter(this.getInterface());

            this.oTileUIActions = undefined;
            this.oGroupUIActions = undefined;
            this.oController = undefined;
            this.UIActionsInitialized = false;

            // Enabling and disabling drag and drop of groups (groupsUIAction) depends of activation and activation of ActionMode
            sap.ui.getCore().getEventBus().subscribe('launchpad', 'actionModeActive', this._enableGroupUIActions, this);
            sap.ui.getCore().getEventBus().subscribe('launchpad', 'actionModeInactive', this._disableGroupUIActions, this);
        },
        destroy: function () {
            sap.ui.getCore().getEventBus().unsubscribe('launchpad', 'actionModeActive', this._enableGroupUIActions, this);
            sap.ui.getCore().getEventBus().unsubscribe('launchpad', 'actionModeInactive', this._disableGroupUIActions, this);
            sap.ushell.components.flp.launchpad.dashboard.getDashboardUIActions = undefined;
            this.oGroupUIActions = null;
            this.oTileUIActions = null;
        },
        /**
         * Creating UIAction objects for tiles and groups in order to allow dashboard drag and drop actions
         *
         * @param {object} The DashboardContent.controller instance
         *
         * @since 1.35
         *
         * @private
         */
        initializeUIActions : function (oController) {
            this.oController = oController;

            var sDashboardGroupsWrapperId = oController.getView().sDashboardGroupsWrapperId,
                bActionModeActive,
                bRightToLeft = sap.ui.getCore().getConfiguration().getRTL(),

                // Object that contains the common attributed required of the creation of oTileUIActions and oGroupUIActions in Win8 use-case
                oCommonUIActionsDataForWin8 = {
                    containerSelector: '#dashboardGroups',
                    wrapperSelector: sDashboardGroupsWrapperId ? "#" + sDashboardGroupsWrapperId : undefined, // The id of the <section> that wraps dashboardGroups div: #__page0-cont
                    rootSelector : "#dashboardGroups"
                },
                // Object that contains the common attributed required of the creation of oTileUIActions and oGroupUIActions, including Win8 attributes 
                oCommonUIActionsData = jQuery.extend(true, {}, oCommonUIActionsDataForWin8, {
                    switchModeDelay: 1000,
                    isTouch: oController.getView().isTouch,
                    isCombi: oController.getView().isCombi,
                    debug: false
                }),
                oTileUIActionsData = {
                    draggableSelector: ".sapUshellTile",
                    draggableSelectorExclude: ".sapUshellPlusTile",
                    placeHolderClass: "sapUshellTile-placeholder",
                    cloneClass: "sapUshellTile-clone",
                    deltaTop: -44,
                    scrollContainerSelector: undefined, // @TODO remove this
                    startCallback: this._handleTileUIStart.bind(this),
                    endCallback: this._handleTileDrop.bind(this),
                    dragCallback: this._handleStartDragTile.bind(this),
                    dragAndScrollCallback: this._handleTileDragMove.bind(this),
                    moveTolerance: oController.getView().isTouch || oController.getView().isCombi ? 10 : 3,
                    isLayoutEngine: true,
                    disabledDraggableSelector: 'sapUshellLockedTile',
                    onDragStartUIHandler: this._markDisableGroups.bind(this),
                    onDragEndUIHandler: this._endUIHandler.bind(this),
                    offsetLeft: bRightToLeft ? jQuery(".sapUshellViewPortLeft").width() : -jQuery(".sapUshellViewPortLeft").width()
                },
                oGroupUIActionsData = {
                    draggableSelector: ".sapUshellDashboardGroupsContainerItem:not(.sapUshellDisableDragAndDrop)",
                    draggableSelectorBlocker: ".sapUshellTilesContainer-sortable, .sapUshellTileContainerBeforeContent, .sapUshellTileContainerAfterContent",
                    draggableSelectorExclude: ".sapUshellHeaderActionButton",
                    placeHolderClass: "sapUshellDashboardGroupsContainerItem-placeholder",
                    cloneClass: "sapUshellDashboardGroupsContainerItem-clone",
                    startCallback: this._handleGroupsUIStart.bind(this),
                    endCallback: this._handleGroupDrop.bind(this),
                    dragCallback: this._handleGroupStartDrag.bind(this),
                    moveTolerance: oController.getView().isTouch || oController.getView().isCombi ? 10 : 0.1,
                    isLayoutEngine: false,
                    isVerticalDragOnly: true,
                    draggableElement: ".sapUshellTileContainerHeader"
                },
                oWin8TileUIActionsData = {
                    draggableSelector: ".sapUshellTile",
                    placeHolderClass : "sapUshellTile-placeholder",
                    startCallback : this._handleTileUIStart.bind(this),
                    endCallback : this._handleTileDrop.bind(this),
                    dragCallback : this._handleStartDragTile.bind(this),
                    dragAndScrollCallback : this._handleTileDragMove.bind(this),
                    onDragStartUIHandler : this._markDisableGroups.bind(this),
                    onDragEndUIHandler : this._endUIHandler.bind(this),
                    offsetLeft: bRightToLeft ? jQuery(".sapUshellViewPortLeft").width() : -jQuery(".sapUshellViewPortLeft").width()
                },
                oWin8GroupUIActionsData = {
                    forGroups: true,
                    draggableSelector: ".sapUshellTileContainerHeader",
                    placeHolderClass : "sapUshellDashboardGroupsContainerItem-placeholder",
                    _publishAsync: oController._publishAsync
                };

            // Creating the sap.ushell.UIActions objects for tiles and groups
            if (oController.getView().oDashboardGroupsBox.getGroups().length) {
                if (oController.getView().getModel().getProperty("/personalization")) {
                    if (!oController.getView().ieHtml5DnD) {
                        jQuery.sap.require('sap.ushell.UIActions');
                        // Disable the previous instances of UIActions
                        this._disableTileUIActions();
                        this._disableGroupUIActions();

                        // Create and enable tiles UIActions
                        this.oTileUIActions = new sap.ushell.UIActions(jQuery.extend(true, {}, oCommonUIActionsData, oTileUIActionsData)).enable();
                        // Create groups UIActions, enabling happens according to ActionMode
                        this.oGroupUIActions = new sap.ushell.UIActions(jQuery.extend(true, {}, oCommonUIActionsData, oGroupUIActionsData));
                        bActionModeActive = oController.getView().getModel().getProperty("/tileActionModeActive");
                        if (bActionModeActive) {
                            this.oGroupUIActions.enable();
                        }
                    } else {
                        jQuery.sap.require('sap.ushell.UIActionsWin8');
                        this._disableTileUIActions();
                        this._disableGroupUIActions();
                        // Create and enable tiles and groups UIActions
                        this.oTileUIActions = sap.ushell.UIActionsWin8.getInstance(jQuery.extend(true, {}, oCommonUIActionsDataForWin8, oWin8TileUIActionsData)).enable();
                        this.oGroupUIActions = sap.ushell.UIActionsWin8.getInstance(jQuery.extend(true, {}, oCommonUIActionsDataForWin8, oWin8GroupUIActionsData)).enable();
                    }
                }
            }
        },
        _enableGroupUIActions: function () {
            if (this.oGroupUIActions) {
                this.oGroupUIActions.enable();
            }
        },
        _disableTileUIActions : function () {
            if (this.oTileUIActions) {
                this.oTileUIActions.disable();
                //this.oTileUIActions = null;
            }
        },
        _disableGroupUIActions : function () {
            if (this.oGroupUIActions) {
                this.oGroupUIActions.disable();
                //this.oGroupUIActions = null;
            }
        },

       // ****************************************************************************************
       // *************************** Tile UIActions functions - Begin ***************************

        _handleTileDragMove : function (cfg) {
            if (!cfg.isScrolling) {
                sap.ushell.Layout.getLayoutEngine().moveDraggable(cfg.moveX, cfg.moveY);
            }
        },
        _handleTileUIStart : function (evt, ui) {
            if ((sap.ui.Device.browser.msie) &&
                    ((navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0))) {
                //Remove title so tooltip will not be displayed while dragging tile (IE10 and above)
                this.titleElement = ui.querySelector("[title]");
                if (this.titleElement) {
                    //it solves issue with IE and android, when browsers automatically show tooltip
                    this.titleElement.setAttribute("data-title", this.titleElement.getAttribute("title"));
                    this.titleElement.removeAttribute("title");
                }
            }
        },
        _changeTileDragAndDropAnimate : function (evt, ui) {
            var dashboardPageScrollTop = this.dragNDropData.jqDashboard.scrollTop(),
                jqTile,
                tile,
                currentTilePosition,
                currentTileOffset,
                tileLeftOffset,
                iTileTopOffset,
                i,
                oClonedTile;

            for (i = 0; i < this.dragNDropData.jqDraggableElements.length; i++) {
                jqTile = this.dragNDropData.jqDraggableElements.eq(i);
                tile = jqTile[0];
                //Get the original tile and its clone
                currentTilePosition = jqTile.position();
                currentTileOffset = jqTile.offset();
                if ((currentTileOffset.left === tile.offset.left) && (currentTileOffset.top === tile.offset.top)) {
                    continue;
                }
                tile.position = currentTilePosition;
                tile.offset = currentTileOffset;
                oClonedTile = jqTile.data("clone");
                if (!oClonedTile) {
                    continue;
                }

                //Get the invisible tile that has snapped to the new
                //location, get its position, and animate the visible
                //clone to it
                tileLeftOffset = tile.position.left + this.dragNDropData.containerLeftMargin;
                iTileTopOffset = this._getTileTopOffset(jqTile, tile.position, dashboardPageScrollTop);

                //Stop currently running animations
                //Without this, animations would queue up
                oClonedTile.stop(true, false).animate({left: tileLeftOffset, top: iTileTopOffset}, {duration: 250}, {easing: "swing"});
            }
        },
       /**
        *
        * @param ui : tile DOM reference
        * @private
        */
        _handleStartDragTile : function (evt, tileElement) {
            //Prevent selection of text on tiles and groups
            if (window.getSelection) {
                var selection = window.getSelection();
                // fix IE9 issue (CSS 1580181391)
                try {
                    selection.removeAllRanges();
                } catch (e) {
                    // continue regardless of error
                }
            }
            sap.ushell.Layout.getLayoutEngine().layoutStartCallback(tileElement);
            if (sap.ushell.Layout.isAnimationsEnabled()) {
                sap.ushell.Layout.initDragMode();
            }
            //Prevent the tile to be launched after drop
            jQuery(tileElement).find("a").removeAttr('href');
            this.placeHolderElement = jQuery(".sapUshellTile-placeholder");
            sap.ui.getCore().getEventBus().publish("launchpad", "sortableStart");
        },
        /**
        *
        * @param ui : tile DOM reference
        * @private
        */
        _handleTileDrop : function (evt, tileElement, oAdditionalParams) {

            var handleTileDropInternal = function (evt, tileElement) {
                if (sap.ushell.Layout.isAnimationsEnabled()) {
                    sap.ushell.Layout.endDragMode();
                }
                jQuery('#dashboardGroups .sapUshellHidePlusTile').removeClass('sapUshellHidePlusTile');
                if ((sap.ui.Device.browser.msie) &&
                    ((navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0)) && this.titleElement) {
                    //it solves issue with IE and android, when browsers automatically show tooltip
                    this.titleElement.setAttribute("title", this.titleElement.getAttribute("data-title"));
                }
                this.oController._handleDrop.call(this.oController, evt, tileElement);
                if (sap.ui.Device.desktop) {
                    jQuery('body').removeClass("sapUshellDisableUserSelect");
                }
            };

            if (sap.ushell.Layout.isAnimationsEnabled() && oAdditionalParams && oAdditionalParams.clone) {
                var deferred = jQuery.Deferred();
                var jqClone = jQuery(oAdditionalParams.clone);
                var cloneRect = oAdditionalParams.clone.getBoundingClientRect();
                var placeholderRect = tileElement.getBoundingClientRect();
                var splittedTransform = jqClone.css("transform").split(",");
                var diffY = placeholderRect.top - cloneRect.top;
                var diffX = placeholderRect.left - cloneRect.left;
                var translateX = parseInt(splittedTransform[4], 10) + diffX;
                var translateY = parseInt(splittedTransform[5], 10) + diffY;
                jqClone.css({
                    "transform": "translate3d(" + translateX + "px, " + translateY + "px, 0px)",
                    "transition": "transform 0.3s cubic-bezier(0.46, 0, 0.44, 1)"
                });
                setTimeout(function () {
                    deferred.resolve();
                    handleTileDropInternal.call(this, evt, tileElement);
                }.bind(this), 300);
                return deferred.promise();
            } else {
                handleTileDropInternal.apply(this, arguments);
            }

        },
        _getTileTopOffset : function (oTile, position, dashboardScrollTop) {
            var i = 0,
                iTileTopOffset = i + dashboardScrollTop;

            iTileTopOffset += oTile.closest(".sapUshellDashboardGroupsContainerItem").position().top;
            iTileTopOffset += position.top;
            return iTileTopOffset;
        },
        //During drag action, locked groups should be mark with a locked icon and group opacity should be changed to grayish
        _markDisableGroups : function () {
            if (this.oController.getView().getModel()) {
                this.oController.getView().getModel().setProperty('/isInDrag', true);
            }
        },
        //once d&d ends, restore locked groups appearance and remove locked icons and grayscale
        _endUIHandler : function () {
            if (sap.ushell.Layout.isAnimationsEnabled()) {
                sap.ushell.Layout.endDragMode();
            }
            if (this.oController.getView().getModel()) {
                this.oController.getView().getModel().setProperty('/isInDrag', false);
            }
        },
        // **************************** Tile UIActions functions - End ****************************
        // ****************************************************************************************
        // *************************** Group UIActions functions - Begin **************************

        _handleGroupStartDrag : function (evt, ui) {
            this.oTileUIActions.disable();
            var groupContainerClone = jQuery(".sapUshellDashboardGroupsContainerItem-clone"),
                groupContainerCloneTitle = groupContainerClone.find(".sapUshellContainerTitle"),
                titleHeight = groupContainerCloneTitle.height(),
                titleWidth = groupContainerCloneTitle.width(),
                groupsTop,
                groupPlaceholder,
                groupClone,
                scrollY,
                bRightToLeft = sap.ui.getCore().getConfiguration().getRTL();

            if (!sap.ui.Device.system.phone) {
                groupContainerClone.find(".sapUshellTileContainerEditMode").offset({
                    top: this.oGroupUIActions.getMove().y - titleHeight,
                    left: bRightToLeft ? jQuery(".sapUshellViewPortCenter").width() + this.oGroupUIActions.getMove().x + titleWidth :
                    this.oGroupUIActions.getMove().x - (titleWidth / 2)
                });
                jQuery(".sapUshellTileContainerBeforeContent").addClass("sapUshellTileContainerHidden");
            } else {
                jQuery(".sapUshellTilesContainer-sortable").addClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellLineModeContainer, .sapUshellLinksContainer").addClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellTileContainerBeforeContent").addClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellContainerHeaderActions").addClass("sapUshellTileContainerHidden");
            }
            jQuery(".sapUshellTileContainerAfterContent").addClass("sapUshellTileContainerRemoveContent");
            jQuery(ui).find(".sapUshellContainerHeaderActions").addClass("sapUshellTileContainerHidden");

            this.oController.getView().getModel().setProperty('/isInDrag', true);
            jQuery(ui).attr('startPos', jQuery(ui).index());

            jQuery.sap.log.info('startPos - ' + jQuery(ui).index());
            setTimeout(function () {
                sap.ui.getCore().getEventBus().publish("launchpad", "sortableStart");
            }, 0);

            //scroll to group
            groupsTop = jQuery("#dashboardGroups").offset().top;
            groupPlaceholder = jQuery(".sapUshellDashboardGroupsContainerItem-placeholder").offset().top;
            groupClone = jQuery(".sapUshellDashboardGroupsContainerItem-clone").offset().top;
            scrollY = groupPlaceholder - groupsTop - groupClone;
            jQuery('.sapUshellDashboardView section').animate({scrollTop : scrollY}, 0);

        },
        _handleGroupsUIStart : function (evt, ui) {
            jQuery(ui).find(".sapUshellTileContainerContent").css("outline-color", "transparent");
        },

        _handleGroupDrop : function (evt, ui) {

            var oBus = sap.ui.getCore().getEventBus(),
                jQueryObj = jQuery(ui),
                firstChildId = jQuery(jQueryObj.children()[0]).attr("id"),
                oGroup = sap.ui.getCore().byId(firstChildId),
                oDashboardGroups = sap.ui.getCore().byId("dashboardGroups"),
                oData = {group : oGroup, groupChanged : false, focus : false},
                nNewIndex = jQueryObj.index();

            jQueryObj.startPos = window.parseInt(jQueryObj.attr('startPos'), 10);
            oDashboardGroups.removeAggregation('groups', oGroup, true);
            oDashboardGroups.insertAggregation('groups', oGroup, nNewIndex, true);

            this._handleGroupMoved(evt, {item : jQueryObj});
            jQueryObj.removeAttr('startPos');
            sap.ui.getCore().getEventBus().publish("launchpad", "sortableStop");

            // avoid tile to be clicked after group was dropped
            setTimeout(function () {
                jQuery(".sapUshellContainerHeaderActions").removeClass("sapUshellTileContainerHidden");
                jQuery(".sapUshellTileContainerBeforeContent").removeClass("sapUshellTileContainerHidden");
                jQuery(".sapUshellTileContainerBeforeContent").removeClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellTileContainerAfterContent").removeClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellTilesContainer-sortable").removeClass("sapUshellTileContainerRemoveContent");
                jQuery(".sapUshellLineModeContainer, .sapUshellLinksContainer").removeClass("sapUshellTileContainerRemoveContent");
            }, 0);

            window.setTimeout(jQuery.proxy(oBus.publish, oBus, "launchpad", "scrollToGroup", oData), 1);
            this.oTileUIActions.enable();
        },
        _handleGroupMoved : function (evt, ui) {
            var fromIndex = ui.item.startPos,
                toIndex = ui.item.index(),
                oModel = this.oController.getView().getModel();

            if (toIndex !== -1) {
                this.oController._publishAsync("launchpad", "moveGroup", {
                    fromIndex  : fromIndex,
                    toIndex    : toIndex
                });
                setTimeout(function () {
                    oModel.setProperty('/isInDrag', false);
                }, 100);
            }
        },
        // **************************** Group UIActions functions - End ****************************
        // *****************************************************************************************

        _setController : function (oController) {
            this.oController = oController;
        }
    });
}());
