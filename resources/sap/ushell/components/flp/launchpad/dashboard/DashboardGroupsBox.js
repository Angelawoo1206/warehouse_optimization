// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox");sap.ui.base.Object.extend("sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox",{metadata:{publicMethods:["createGroupsBox"]},constructor:function(i,s){if(sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox&&sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox()){return sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox();}sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox=jQuery.sap.getter(this.getInterface());this.oController=undefined;this.oGroupsContainer=undefined;this.bTileContainersContentAdded=false;sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeActive",this._addTileContainersContent,this);},destroy:function(){sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeActive",this._addTileContainersContent,this);sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox=undefined;},createGroupsBox:function(c,m){this.oController=c;var t=this,a,g,T=this._getTileContainerTemplate(c,m),E=function(){return t.oModel.getProperty('/enableLockedGroupsCompactLayout')&&!t.oModel.getProperty('/tileActionModeActive');},b=function(G){var d,p;if(G&&(d=G.getDomRef())){p=d.querySelector('.sapUshellPlusTile');if(p){return p;}}return null;},r=function(l){var p=b(l.currentGroup),d=b(l.endGroup),i=(l.tiles[l.tiles.length-2]===l.item)||(l.endGroup.getTiles().length===0);if(i){t._hidePlusTile(d);}else{t._showPlusTile(d);}if(l.currentGroup!==l.endGroup){t._showPlusTile(p);}};a=function(){sap.ushell.Layout.getLayoutEngine().setExcludedControl(sap.ushell.ui.launchpad.PlusTile);sap.ushell.Layout.getLayoutEngine().setReorderTilesCallback.call(sap.ushell.Layout.layoutEngine,r);};g=function(){if(!sap.ushell.Layout.isInited){sap.ushell.Layout.init({getGroups:this.getGroups.bind(this),isLockedGroupsCompactLayoutEnabled:E,animationsEnabled:(t.oModel.getProperty('/animationMode')==='full')}).done(a);sap.ui.Device.media.attachHandler(function(){if(!this.bIsDestroyed){sap.ushell.Layout.reRenderGroupsLayout(null);}},this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);var d=this.getDomRef();c.getView().sDashboardGroupsWrapperId=!jQuery.isEmptyObject(d)&&d.parentNode?d.parentNode.id:'';}sap.ushell.Layout.reRenderGroupsLayout(null);if(this.getGroups().length){if(c.bModelInitialized){c._initializeUIActions();}sap.ui.getCore().getEventBus().publish("launchpad","contentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRefresh");c._addBottomSpace();if(this.getModel().getProperty("/tilesOpacity")){sap.ushell.utils.handleTilesOpacity(this.getModel());}}var f=new sap.ui.model.Filter("isGroupSelected",sap.ui.model.FilterOperator.EQ,true);var G=t.oModel.getProperty('/homePageGroupDisplay'),h=t.oModel.getProperty("/tileActionModeActive");if(G&&G==="tabs"&&!h){this.getBinding("groups").filter([f]);}else{this.getBinding("groups").filter([]);}try{sap.ushell.utils.handleTilesVisibility();}catch(e){}};jQuery.sap.require("sap.ushell.ui.launchpad.DashboardGroupsContainer");this.oGroupsContainer=new sap.ushell.ui.launchpad.DashboardGroupsContainer("dashboardGroups",{accessibilityLabel:sap.ushell.resources.i18n.getText("DashboardGroups_label"),groups:{path:"/groups",template:T},displayMode:"{/homePageGroupDisplay}",afterRendering:g});this.oGroupsContainer.addEventDelegate({onsapskipback:function(e){e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);var j=jQuery(".sapUshellAnchorItem:visible:first");if(!j.length){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);}else{sap.ushell.components.flp.ComponentKeysHandler.goToSelectedAnchorNavigationItem();}},onsapskipforward:function(e){e.preventDefault();var f=jQuery("#sapUshellDashboardFooterDoneBtn:visible");if(f.length){f.focus();}else{sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);}},onsaptabnext:function(e){if(t.oModel.getProperty("/tileActionModeActive")){var j=jQuery(document.activeElement).closest(".sapUshellTileContainerHeader");if(!j||j.length===0){e.preventDefault();var f=jQuery("#sapUshellDashboardFooterDoneBtn:visible");if(f.length){f.focus();}}else{var d=jQuery(document.activeElement).closest(".sapUshellTileContainer");var i=jQuery(document.activeElement).hasClass("sapUshellContainerTitle");var h=d.find('.sapUshellHeaderActionButton');var k=h&&h.length>0;var l=false;if(k){l=document.activeElement.id===h.last()[0].id;}if((i&&!k)||(l)){e.preventDefault();var H=d.find(".sapUshellTile:visible, sapUshellLink:visible").length>0;if(H){sap.ushell.components.flp.ComponentKeysHandler.goToLastVisitedTile(d,true);}else{var f=jQuery("#sapUshellDashboardFooterDoneBtn:visible");if(f.length){f.focus();}else{sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);}}}}}else{e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);}},onsaptabprevious:function(e){sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);var j=jQuery(":focus");if(!t.oModel.getProperty("/tileActionModeActive")||j.hasClass("sapUshellTileContainerHeader")){e.preventDefault();var d=jQuery(".sapUshellAnchorItem:visible:first"),f=jQuery(".sapUshellAnchorItemOverFlow");if(!f&&!d.length){sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);}if(f.hasClass("sapUshellShellHidden")){sap.ushell.components.flp.ComponentKeysHandler.goToSelectedAnchorNavigationItem();}else{f.find("button").focus();}}else if(t.oModel.getProperty("/tileActionModeActive")){var h=jQuery(document.activeElement);if(h.hasClass('sapUshellTile')){e.preventDefault();var i=h.closest(".sapUshellTileContainer");var k=i.find('.sapUshellHeaderActionButton:visible').last();if(k.length>0){k.focus();}else{i.find('.sapUshellContainerTitle').focus();}}}}});this.oModel=m;return this.oGroupsContainer;},_getTileContainerTemplate:function(c,m){var t=this,T=new sap.ushell.ui.launchpad.TileContainer({headerText:"{title}",tooltip:"{title}",tileActionModeActive:'{/tileActionModeActive}',ieHtml5DnD:c.getView().ieHtml5DnD,enableHelp:'{/enableHelp}',groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",isLastGroup:"{isLastGroup}",isGroupLocked:"{isGroupLocked}",isGroupSelected:"{isGroupSelected}",showHeader:true,editMode:"{editMode}",titleChange:function(e){sap.ui.getCore().getEventBus().publish("launchpad","changeGroupTitle",{groupId:e.getSource().getGroupId(),newTitle:e.getParameter("newTitle")});},showPlaceholder:{parts:["/tileActionModeActive","tiles/length"],formatter:function(a){return(a||!this.groupHasTiles())&&!this.getIsGroupLocked();}},visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(a,i,v){if(!v[a?1:0]){return false;}return i||a;}},links:this._getLinkTemplate(),tiles:this._getTileTemplate(),add:function(e){t.oController.getView().parentComponent.getRouter().navTo('appFinder',{'menu':'catalog',filters:JSON.stringify({targetGroup:encodeURIComponent(e.getSource().getBindingContext().sPath)})});},afterRendering:jQuery.proxy(this._tileContainerAfterRenderingHandler,t)});return T;},_getLinkTemplate:function(){var f=new sap.ui.model.Filter("isTileIntentSupported",sap.ui.model.FilterOperator.EQ,true);if(window.location.search.indexOf("new_links_container=true")===-1){return{path:"links",templateShareable:true,template:new sap.ushell.ui.launchpad.LinkTileWrapper({uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",target:"{target}",isLocked:"{isLocked}",tileActionModeActive:"{/tileActionModeActive}",animationRendered:false,debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,tileViews:{path:"content",factory:function(i,c){return c.getObject();}},afterRendering:function(e){var j=jQuery(this.getDomRef().getElementsByTagName("a"));j.attr("tabindex",-1);}}),filters:[f]};}else{return{path:"links",factory:function(i,c){return c.getObject().content[0];},filters:[f]};}},_getTileTemplate:function(){var f=new sap.ui.model.Filter("isTileIntentSupported",sap.ui.model.FilterOperator.EQ,true);var t=new sap.ushell.ui.launchpad.Tile({"long":"{long}",uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",target:"{target}",isLocked:"{isLocked}",tileActionModeActive:"{/tileActionModeActive}",showActionsIcon:"{showActionsIcon}",rgba:"{rgba}",animationRendered:false,debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,afterRendering:function(e){var c=e.getSource().getBindingContext(),T;if(c){T=c.getObject();sap.ui.getCore().getEventBus().publish("launchpad","tileRendered",{tileId:T.originalTileId,tileDomElementId:e.getSource().getId()});}},tileViews:{path:"content",factory:function(i,c){return c.getObject();}},coverDivPress:function(e){if(!e.oSource.getBindingContext().getObject().tileIsBeingMoved){sap.ushell.components.flp.ActionMode._openActionsMenu(e);}},showActions:function(e){sap.ushell.components.flp.ActionMode._openActionsMenu(e);},deletePress:function(e){var T=e.getSource(),t=T.getBindingContext().getObject().object,d={originalTileId:sap.ushell.Container.getService("LaunchPage").getTileId(t)};sap.ui.getCore().getEventBus().publish("launchpad","deleteTile",d,this);},press:[this.oController.dashboardTilePress,this.oController]});var v=sap.ui.getCore().byId("viewPortContainer");t.addEventDelegate({onclick:function(e){jQuery.sap.measure.start("FLP:DashboardGroupsBox.onclick","Click on tile","FLP");function a(){jQuery.sap.measure.end("FLP:DashboardGroupsBox.onclick");v.detachAfterNavigate(a);}v.attachAfterNavigate(a);}});return{path:"tiles",templateShareable:true,template:t,filters:[f]};},_tileContainerAfterRenderingHandler:function(e){e.oSource.bindProperty("showBackground","/tileActionModeActive");e.oSource.bindProperty("showDragIndicator",{parts:['/tileActionModeActive','/enableDragIndicator'],formatter:function(I,d){return I&&d&&!this.getIsGroupLocked()&&!this.getDefaultGroup();}});e.oSource.bindProperty("showMobileActions",{parts:['/tileActionModeActive'],formatter:function(I){return I&&!this.getDefaultGroup();}});e.oSource.bindProperty("showIcon",{parts:['/isInDrag','/tileActionModeActive'],formatter:function(I,b){return(this.getIsGroupLocked()&&(I||b));}});e.oSource.bindProperty("deluminate",{parts:['/isInDrag'],formatter:function(I){return this.getIsGroupLocked()&&I;}});if(this.bTileContainersContentAdded&&!e.oSource.getBeforeContent().length){var g=e.oSource.getModel().getProperty("/groups"),i;for(i=0;i<g.length;i++){if(g[i].groupId===e.oSource.getGroupId()){break;}}this._addTileContainerContent(i);}sap.ushell.Layout.reRenderGroupsLayout(null);this._updateFirstGroupHeaderVisibility(e.oSource.getProperty('tileActionModeActive'),e.oSource.getModel().getProperty('/homePageGroupDisplay')!=="tabs");},_updateFirstGroupHeaderVisibility:function(I,e){var g=this.oGroupsContainer.getGroups(),f=undefined,v=0;for(var i=g.length-1;i>=0;--i){g[i].setShowGroupHeader(I||e);if(g[i].getProperty("visible")){v++;f=i;}}if(f!==undefined)g[f].setShowGroupHeader(I||(v==1&&e));},_addTileContainersContent:function(){if(!this.bTileContainersContentAdded){var g=this.oGroupsContainer.getGroups();g.forEach(function(a,b){this._addTileContainerContent(b);}.bind(this));this.bTileContainersContentAdded=true;}},_addTileContainerContent:function(g){var G=this.oGroupsContainer.getGroups()[g],b;if(G){b=G.getBindingContext().getPath()+'/';G.addBeforeContent(this._getBeforeContent(this.oController,b));G.addAfterContent(this._getAfterContent(this.oController,b));G.addHeaderAction(this._getHeaderAction(this.oController,b));}},_getBeforeContent:function(c){var a=new sap.m.Button({icon:"sap-icon://add",text:sap.ushell.resources.i18n.getText("add_group_at"),visible:{parts:["/tileActionModeActive"],formatter:function(t){return(!this.getParent().getIsGroupLocked()&&!this.getParent().getDefaultGroup()&&t);}},enabled:{parts:["/editTitle"],formatter:function(i){return!i;}},type:sap.m.ButtonType.Transparent,press:[this.oController._addGroupHandler]}).addStyleClass("sapUshellAddGroupButton");a.addDelegate({onAfterRendering:function(){jQuery(".sapUshellAddGroupButton").attr("tabindex",-1);}});return a;},_getAfterContent:function(c){var a=new sap.m.Button({icon:"sap-icon://add",text:sap.ushell.resources.i18n.getText("add_group_at"),visible:{parts:["isLastGroup","/tileActionModeActive","/isInDrag"],formatter:function(i,t,b){return(i&&t);}},enabled:{parts:["/editTitle"],formatter:function(i){return!i;}},type:sap.m.ButtonType.Transparent,press:[this.oController._addGroupHandler]}).addStyleClass("sapUshellAddGroupButton");a.addDelegate({onAfterRendering:function(){jQuery(".sapUshellAddGroupButton").attr("tabindex",-1);}});return a;},_getHeaderActions:function(){var s=new sap.m.Button({text:{path:'isGroupVisible',formatter:function(i){if(sap.ui.Device.system.phone){this.setIcon(i?"sap-icon://hide":"sap-icon://show");}return sap.ushell.resources.i18n.getText(i?'HideGroupBtn':'ShowGroupBtn');}},type:sap.m.ButtonType.Transparent,visible:{parts:['/tileActionModeActive','/enableHideGroups','isGroupLocked','isDefaultGroup'],formatter:function(i,I,b,a){return i&&I&&!b&&!a;}},press:function(e){var S=e.getSource(),g=S.getBindingContext();this.oController._changeGroupVisibility(g);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton");var d=new sap.m.Button({text:{path:'removable',formatter:function(i){if(sap.ui.Device.system.phone){if(i){this.setIcon("sap-icon://delete");}else{this.setIcon("sap-icon://refresh");}}return sap.ushell.resources.i18n.getText(i?'DeleteGroupBtn':'ResetGroupBtn');}},type:sap.m.ButtonType.Transparent,visible:{parts:['/tileActionModeActive','isDefaultGroup'],formatter:function(i,I){return i&&!I;}},enabled:{parts:["/editTitle"],formatter:function(i){return!i;}},press:function(e){var S=e.getSource(),g=S.getBindingContext();this.oController._handleGroupDeletion(g);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton");return[s,d];},_getHeaderAction:function(c,b){jQuery.sap.require("sap.ushell.ui.launchpad.GroupHeaderActions");return new sap.ushell.ui.launchpad.GroupHeaderActions({content:this._getHeaderActions(),tileActionModeActive:{parts:['/tileActionModeActive',b+'isDefaultGroup'],formatter:function(i,I){return i&&!I;}},isOverflow:'{/isPhoneWidth}'}).addStyleClass("sapUshellOverlayGroupActionPanel");},_hidePlusTile:function(p){if(p){p.className+=" sapUshellHidePlusTile";}},_showPlusTile:function(p){if(p){p.className=p.className.split(' '+'sapUshellHidePlusTile').join('');}}});}());