// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.require("sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox");jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");jQuery.sap.require("sap.ushell.ui.launchpad.Tile");jQuery.sap.require("sap.ushell.override");jQuery.sap.require("sap.ushell.resources");jQuery.sap.require("sap.ushell.Layout");jQuery.sap.require("sap.ushell.ui.launchpad.AnchorItem");jQuery.sap.require("sap.ushell.ui.shell.RightFloatingContainer");sap.ui.jsview("sap.ushell.components.flp.launchpad.dashboard.DashboardContent",{createContent:function(c){var d,V=sap.ui.getCore().byId("viewPortContainer"),C,t=this;this.isTouch=sap.ui.Device.system.combi?false:(sap.ui.Device.system.phone||sap.ui.Device.system.tablet);this.isCombi=sap.ui.Device.system.combi;this.parentComponent=sap.ui.core.Component.getOwnerComponentFor(this);this.oModel=this.parentComponent.getModel();this.addStyleClass("sapUshellDashboardView");this.ieHtml5DnD=!!(this.oModel.getProperty("/personalization")&&(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge)&&sap.ui.Device.browser.version>=11&&(sap.ui.Device.system.combi||sap.ui.Device.system.tablet));sap.ui.getCore().getEventBus().subscribe("launchpad","contentRendered",this._onAfterDashboardShow,this);sap.ui.getCore().getEventBus().subscribe("launchpad","initialConfigurationSet",this._onAfterDashboardShow,this);sap.ui.getCore().getEventBus().subscribe("launchpad",'actionModeInactive',this._handleEditModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad",'actionModeActive',this._handleEditModeChange,this);sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications","enablePreviewNotificationChanged",this._enablePreviewNotificationChanged,this);sap.ui.getCore().byId('navContainerFlp').attachAfterNavigate(this.onAfterNavigate,this);this.addEventDelegate({onBeforeFirstShow:function(){var D=sap.ushell.components.flp.launchpad.getDashboardManager();D.loadPersonalizedGroups();this.onAfterNavigate();}.bind(this),onAfterShow:function(){this.getController()._addBottomSpace();this.getController()._updateShellHeader();}.bind(this),onAfterHide:function(e){}});this.oAnchorNavigationBar=this._getAnchorNavigationBar(c);d=new sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox();this.oDashboardGroupsBox=d.createGroupsBox(c,this.oModel);C=this._previewNotificationEnabled();if(V){V.shiftCenterTransitionEnabled(C);}var u=function(n){var b=this.mBindingInfos[n],a=this.getMetadata().getJSONKeys()[n],o;jQuery.each(this[a._sGetter](),jQuery.proxy(function(i,v){this[a._sRemoveMutator](v);},this));jQuery.each(b.binding.getContexts(),jQuery.proxy(function(i,v){o=b.factory(this.getId()+"-"+i,v)?b.factory(this.getId()+"-"+i,v).setBindingContext(v,b.model):"";this[a._sMutator](o);},this));};this.oPreviewNotificationsContainerPlaceholder=new sap.ushell.ui.shell.RightFloatingContainer({id:'notifications-preview-container-placeholder',visible:{path:'/enableNotificationsPreview',formatter:function(v){return t._handleNotificationsPreviewVisibility.apply(t,[v]);}}}).addStyleClass('sapUshellPreviewNotificationsConainer');this.oPreviewNotificationsContainer=new sap.ushell.ui.shell.RightFloatingContainer({id:'notifications-preview-container',top:4,right:'1rem',floatingContainerItems:{path:"/previewNotificationItems",factory:function(f,o){return sap.ui.getCore().byId(o.getObject().previewItemId);}},visible:{path:'/enableNotificationsPreview',formatter:this._handleNotificationsPreviewVisibility.bind(this)}}).addStyleClass('sapContrastPlus').addStyleClass('sapContrast');this.oPreviewNotificationsContainer.updateAggregation=u;this.oFilterSelectedGroup=new sap.ui.model.Filter("isGroupSelected",sap.ui.model.FilterOperator.EQ,true);this.oDoneBtn=new sap.m.Button('sapUshellDashboardFooterDoneBtn',{type:sap.m.ButtonType.Emphasized,text:sap.ushell.resources.i18n.getText("doneBtnText"),tooltip:sap.ushell.resources.i18n.getText("doneBtnTooltip"),press:function(){var a=this.oDashboardGroupsBox.getGroups();sap.ushell.components.flp.ActionMode.toggleActionMode(this.oModel,"Menu Item",a);this.oAnchorNavigationBar.updateVisibility();if(this.oModel.getProperty("/homePageGroupDisplay")&&this.oModel.getProperty("/homePageGroupDisplay")==="tabs"){this.getController()._deactivateActionModeInTabsState();}}.bind(this)});this.oDoneBtn.addEventDelegate({onsapskipforward:function(e){e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);},onsapskipback:function(e){e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.flp.ComponentKeysHandler.goToFirstVisibleTileContainer();},onsaptabprevious:function(e){e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.flp.ComponentKeysHandler.goToFirstVisibleTileContainer();},onsaptabnext:function(e){e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);}});this.oFooter=new sap.m.OverflowToolbar('sapUshellDashboardFooter',{visible:{parts:['/tileActionModeActive','/viewPortState'],formatter:function(a,s){return a&&s==='Center';}},layoutData:new sap.m.OverflowToolbarLayoutData({moveToOverflow:false}),content:[new sap.m.ToolbarSpacer(),this.oDoneBtn]});this.oPage=new sap.m.Page('sapUshellDashboardPage',{customHeader:this.oAnchorNavigationBar,content:[this.oDashboardGroupsBox],floatingFooter:true,footer:this.oFooter});return[this.oPage,this.oPreviewNotificationsContainerPlaceholder,this.oPreviewNotificationsContainer];},_handleNotificationsPreviewVisibility:function(e){var r=sap.ushell.Container.getRenderer('fiori2'),c=r.getCurrentViewportState(),i=c==='Center',n=sap.ushell.Container.getService('Notifications');this.oDashboardGroupsBox.toggleStyleClass('sapUshellDashboardGroupsContainerSqueezed',e);this.oAnchorNavigationBar.toggleStyleClass('sapUshellAnchorNavigationBarSqueezed',e);e=e&&i;if(e){if(!this.bNotificationsRegistered){n.registerNotificationsUpdateCallback(this.oController._notificationsUpdateCallback.bind(this.oController));this.bNotificationsRegistered=true;}if(n.isFirstDataLoaded()){setTimeout(function(){if(this.oController&&this.oController._notificationsUpdateCallback){this.oController._notificationsUpdateCallback();}}.bind(this),300);}if(!this.bSubscribedToViewportStateSwitch){this.bHeadsupNotificationsInitialyVisible=r.getRightFloatingContainerVisibility();sap.ui.getCore().getEventBus().subscribe("launchpad","afterSwitchState",this._handleViewportStateSwitch,this);this.bSubscribedToViewportStateSwitch=true;}}return e;},_fOnAfterAnchorBarRenderingHandler:function(e){var x=this.getModel()&&this.getModel().getProperty('/enableHelp');if(this.getDefaultGroup()){if(x){this.addStyleClass("help-id-homeAnchorNavigationBarItem");}}else{if(x){this.addStyleClass("help-id-anchorNavigationBarItem");}}},_getAnchorItemTemplate:function(){var a=new sap.ushell.ui.launchpad.AnchorItem({index:"{index}",title:"{title}",groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",selected:false,isGroupRendered:"{isRendered}",visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(t,i,v){if(!v[t?1:0]){return false;}return i||t;}},afterRendering:this._fOnAfterAnchorBarRenderingHandler});return a;},_getAnchorNavigationBar:function(c){var a=this._getAnchorItemTemplate(),A=new sap.ushell.ui.launchpad.AnchorNavigationBar("anchorNavigationBar",{selectedItemIndex:"{/topGroupInViewPortIndex}",itemPress:[function(e){this._handleAnchorItemPress(e);},c],groups:{path:"/groups",template:a}});A=this._extendAnchorNavigationBar(A);A.addStyleClass("sapContrastPlus");return A;},_extendAnchorNavigationBar:function(a){var e=jQuery.extend(a,{onsapskipforward:function(E){E.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.flp.ComponentKeysHandler.goToTileContainer(E,this.bGroupWasPressed);this.bGroupWasPressed=false;},onsaptabnext:function(E){E.preventDefault();var j=jQuery(":focus");if(!j.parent().parent().siblings().hasClass("sapUshellAnchorItemOverFlow")||(j.parent().parent().siblings().hasClass("sapUshellAnchorItemOverFlow")&&j.parent().parent().siblings().hasClass("sapUshellShellHidden"))){sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.flp.ComponentKeysHandler.goToTileContainer(E);this.bGroupWasPressed=false;}else{var b=jQuery(".sapUshellAnchorItemOverFlow button");b.focus();}},onsapskipback:function(E){E.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(E);},onsaptabprevious:function(E){E.preventDefault();var j=jQuery(":focus");if(!j.parent().hasClass("sapUshellAnchorItemOverFlow")){sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(E);}else{var b=jQuery(".sapUshellAnchorItem:visible:first");if(!b.length){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(E);}else{sap.ushell.components.flp.ComponentKeysHandler.goToSelectedAnchorNavigationItem();}}},onsapenter:function(E){E.srcControl.getDomRef().click();},onsapspace:function(E){E.srcControl.getDomRef().click();}});return e;},_addActionModeButtonsToDashboard:function(){if(sap.ushell.components.flp.ActionMode){sap.ushell.components.flp.ActionMode.init(this.getModel());}},_createActionModeMenuButton:function(){this.oTileActionsButton=sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem",{id:"ActionModeBtn",text:sap.ushell.resources.i18n.getText("activateEditMode"),icon:'sap-icon://edit',press:function(){var d=this.oDashboardGroupsBox.getGroups();sap.ushell.components.flp.ActionMode.toggleActionMode(this.oModel,"Menu Item",d);this.oAnchorNavigationBar.updateVisibility();if(this.oModel.getProperty("/homePageGroupDisplay")&&this.oModel.getProperty("/homePageGroupDisplay")==="tabs"){if(this.oModel.getProperty("/tileActionModeActive")){this.oDashboardGroupsBox.getBinding("groups").filter([]);var g=this.oModel.getProperty("/groups"),s;for(var i=0;i<g.length;i++){if(g[i].isGroupSelected){s=i;break;}}this.getController()._scrollToGroup("launchpad","scrollToGroup",{group:{getGroupId:function(){return g[s].groupId}},groupChanged:false,focus:true});}else{this.getController()._deactivateActionModeInTabsState();}}}.bind(this)},false,true);if(this.oModel.getProperty("/enableHelp")){this.oTileActionsButton.addStyleClass('help-id-ActionModeBtn');}sap.ushell.Container.getRenderer("fiori2").showActionButton(this.oTileActionsButton.getId(),true);},_handleEditModeChange:function(){if(this.oTileActionsButton){this.oTileActionsButton.toggleStyleClass('sapUshellAcionItemActive');}},_enablePreviewNotificationChanged:function(c,e,d){this.oModel.setProperty("/userEnableNotificationsPreview",d.bPreviewEnabled);},_previewNotificationEnabled:function(){var c=this.oModel.getProperty("/configEnableNotificationsPreview"),u=this.oModel.getProperty("/userEnableNotificationsPreview");return(c&&u);},_createActionButtons:function(){var e=this.oModel.getProperty("/personalization");if(e){if(this.oModel.getProperty("/actionModeMenuButtonEnabled")){this._createActionModeMenuButton();}}},onAfterNavigate:function(e){var n=sap.ui.getCore().byId('navContainerFlp'),c=n?n.getCurrentPage().getViewName():undefined,i=c=="sap.ushell.components.flp.launchpad.dashboard.DashboardContent",r=sap.ushell.Container.getRenderer("fiori2");if(i){r.createExtendedShellState("dashboardExtendedShellState",function(){this._createActionButtons();r.setHeaderHiding(false);}.bind(this));this.getController()._setCenterViewPortShift();this._addActionModeButtonsToDashboard();setTimeout(function(){if(sap.ushell.Container){r.applyExtendedShellState("dashboardExtendedShellState");}},0);if(this.oAnchorNavigationBar&&this.oAnchorNavigationBar.anchorItems){this.oAnchorNavigationBar.setNavigationBarItemsVisibility();this.oAnchorNavigationBar.adjustItemSelection(this.oAnchorNavigationBar.getSelectedItemIndex());}if(document.activeElement&&document.activeElement.tagName==="BODY"){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell();}}},_handleViewportStateSwitch:function(c,e,d){var C=d.getParameter('to');if(C=='Center'){var n=sap.ui.getCore().byId("notifications-preview-container");if(n&&n.setFloatingContainerItemsVisiblity){n.setFloatingContainerItemsVisiblity(true);}}},_handleHeadsupNotificationsPresentation:function(c){var r=sap.ushell.Container.getRenderer('fiori2'),i=c==='Center',p=this.oPreviewNotificationsContainer.getDomRef(),h=p&&p.getBoundingClientRect(),P=h?h.bottom<0:false,s=i?P:this.bHeadsupNotificationsInitialyVisible;r.showRightFloatingContainer(s);},_onAfterDashboardShow:function(e){var j=jQuery('.sapUshellTileContainer:visible'),n=sap.ui.getCore().byId('navContainerFlp'),c=n?n.getCurrentPage().getViewName():undefined,i=c=="sap.ushell.components.flp.launchpad.dashboard.DashboardContent",t=this.oModel.getProperty('/tileActionModeActive'),v,p;if(i){if(!t){sap.ushell.utils.handleTilesVisibility();sap.ushell.utils.refreshTiles();var T=this.oModel.getProperty('/topGroupInViewPortIndex'),a=jQuery(j[T]),b=j.find("li[class*='sapUshellTile']li[tabindex=0]"),d=a.find('.sapUshellTile:first'),f;if(b.length){f=b;}else if(d.length){f=d;}else{f=jQuery("#configBtn");}p=this.oModel.getProperty('/enableNotificationsPreview');v=sap.ui.getCore().byId("viewPortContainer");if(v){v.shiftCenterTransition(p);}setTimeout(function(){f.focus();},0)}this.onAfterNavigate();}},getControllerName:function(){return"sap.ushell.components.flp.launchpad.dashboard.DashboardContent";},_isInDeashboard:function(){var n=sap.ui.getCore().byId("viewPortContainer"),c=sap.ui.getCore().byId("dashboardGroups");return((n.getCurrentCenterPage()==="application-Shell-home")&&(c.getModel().getProperty("/currentViewName")==="home"));},exit:function(){if(this.oAnchorNavigationBar){this.oAnchorNavigationBar.handleExit();}if(this.oTileActionsButton){this.oTileActionsButton.destroy();}sap.ui.core.mvc.View.prototype.exit.apply(this,arguments);sap.ui.getCore().getEventBus().unsubscribe("launchpad","contentRendered",this._onAfterDashboardShow,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","initialConfigurationSet",this._onAfterDashboardShow,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad",'actionModeInactive',this._handleEditModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad",'actionModeActive',this._handleEditModeChange,this);if(this.bSubscribedToViewportStateSwitch){sap.ui.getCore().getEventBus().unsubscribe("launchpad","afterSwitchState",this._handleViewportStateSwitch,this);this.bSubscribedToViewportStateSwitch=false;}}});}());