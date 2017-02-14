/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
jQuery.sap.declare("sap.ushell.ui.launchpad.Tile");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ushell.ui.launchpad.Tile",{metadata:{library:"sap.ushell",properties:{"long":{type:"boolean",group:"Misc",defaultValue:false},"uuid":{type:"string",group:"Misc",defaultValue:null},"tileCatalogId":{type:"string",group:"Misc",defaultValue:null},"target":{type:"string",group:"Misc",defaultValue:null},"visible":{type:"boolean",group:"Misc",defaultValue:true},"debugInfo":{type:"string",group:"Misc",defaultValue:null},"rgba":{type:"string",group:"Misc",defaultValue:null},"animationRendered":{type:"boolean",group:"Misc",defaultValue:false},"isLocked":{type:"boolean",group:"Misc",defaultValue:false},"showActionsIcon":{type:"boolean",group:"Misc",defaultValue:false},"tileActionModeActive":{type:"boolean",group:"Misc",defaultValue:false},"ieHtml5DnD":{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{"tileViews":{type:"sap.ui.core.Control",multiple:true,singularName:"tileView"},"pinButton":{type:"sap.ui.core.Control",multiple:true,singularName:"pinButton"}},events:{"press":{},"coverDivPress":{},"afterRendering":{},"showActions":{},"deletePress":{}}}});sap.ushell.ui.launchpad.Tile.M_EVENTS={'press':'press','coverDivPress':'coverDivPress','afterRendering':'afterRendering','showActions':'showActions','deletePress':'deletePress'};(function(){"use strict";jQuery.sap.require("sap.ushell.override");jQuery.sap.require("sap.ushell.ui.launchpad.AccessibilityCustomData");sap.ushell.ui.launchpad.Tile.prototype.getActionSheetIcon=function(){if(!this.getTileActionModeActive()){return undefined;}if(!this.actionSheetIcon){this.actionSheetIcon=new sap.ui.core.Icon({src:"sap-icon://overflow"});this.actionSheetIcon.setTooltip(sap.ushell.resources.i18n.getText("configuration.category.tile_actions"));this.actionSheetIcon.addStyleClass('sapUshellTileActionIconDivBottomInner');}return this.actionSheetIcon;};sap.ushell.ui.launchpad.Tile.prototype.ontap=function(e,u){jQuery.sap.log.info("Tile clicked:",this.getDebugInfo(),"sap.ushell.ui.launchpad.Tile");this.firePress();return;};sap.ushell.ui.launchpad.Tile.prototype.destroy=function(s){this.destroyTileViews();sap.ui.core.Control.prototype.destroy.call(this,s);};sap.ushell.ui.launchpad.Tile.prototype.addTileView=function(o,s){o.setParent(null);sap.ui.base.ManagedObject.prototype.addAggregation.call(this,"tileViews",o,s);};sap.ushell.ui.launchpad.Tile.prototype.destroyTileViews=function(){if(this.mAggregations["tileViews"]){this.mAggregations["tileViews"].length=0;}};sap.ushell.ui.launchpad.Tile.prototype.onAfterRendering=function(){var r;r=this.getRgba();if(r){this._redrawRGBA();}this.fireAfterRendering();};sap.ushell.ui.launchpad.Tile.prototype._launchTileViaKeyboard=function(e){if(this.getTileActionModeActive()){this.fireCoverDivPress({id:this.getId()});}else{if(e.target.tagName!=="BUTTON"){var t=this.getTileViews()[0],p=false;if(t.firePress){t.firePress({id:this.getId()});}else{while(t.getContent&&!p){t=t.getContent()[0];if(t.firePress){t.firePress({id:this.getId()});p=true;}}}}}};sap.ushell.ui.launchpad.Tile.prototype.onsapenter=function(e){this._launchTileViaKeyboard(e);if(!this.getTileActionModeActive()){this._announceLoadingApplication();}};sap.ushell.ui.launchpad.Tile.prototype.onsapspace=function(e){this._launchTileViaKeyboard(e);if(!this.getTileActionModeActive()){this._announceLoadingApplication();}};sap.ushell.ui.launchpad.Tile.prototype.onfocusin=function(e){var c=this.getDomRef().getAttribute("class"),p;p=c?c.indexOf("sapUshellPlusTile")!==-1:false;if(!p){var j=jQuery(this.getDomRef()).prevUntil("h3"),a,C="",t,b;if(j.length>0){a=j[j.length-1].previousSibling;}else{a=this.getDomRef().previousSibling;}if(a){C=a.getAttribute('id');}b=this.getDomRef().querySelector(".sapUshellTileInner");var d=this.getDomRef().querySelector(".sapUshellTileDeleteClickArea .sapUiIcon");var f=d?d.id:"";if(b){var A=(C&&C!=="")?"sapUshellCatalogAccessibilityTileText":"sapUshellDashboardAccessibilityTileText";t=b.children[0].getAttribute('id');var l=[A,t,f,C];this.getDomRef().setAttribute("aria-labelledby",l.join(" "));}}};sap.ushell.ui.launchpad.Tile.prototype.onclick=function(e){if(this.getTileActionModeActive()){var s=e.originalEvent.srcElement;if(jQuery(s).closest('.sapUshellTileDeleteClickArea').length>0){this.fireDeletePress();}else{this.fireCoverDivPress({id:this.getId()});}}else{this._announceLoadingApplication();}};sap.ushell.ui.launchpad.Tile.prototype._announceLoadingApplication=function(){var a=document.getElementById("sapUshellLoadingAccessibilityHelper-appInfo"),l=sap.ushell.resources.i18n.getText("screenReaderNavigationLoading");if(a){a.setAttribute("role","alert");a.innerHTML=l;setTimeout(function(){a.removeAttribute("role");a.innerHTML="";},0);}};sap.ushell.ui.launchpad.Tile.prototype._initDeleteAction=function(){var t=this;if(!this.deleteIcon){this.deleteIcon=new sap.ui.core.Icon({src:"sap-icon://decline",tooltip:sap.ushell.resources.i18n.getText("removeButtonTItle")});this.deleteIcon.addEventDelegate({onclick:function(e){t.fireDeletePress();e.stopPropagation();}});this.deleteIcon.addStyleClass("sapUshellTileDeleteIconInnerClass");this.deleteIcon.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({key:"aria-label",value:sap.ushell.resources.i18n.getText("removeButtonLabel"),writeToDom:true}));}return this.deleteIcon;};sap.ushell.ui.launchpad.Tile.prototype.setShowActionsIcon=function(s){var t=this,i;if(s){i=new sap.ui.core.Icon({size:"1rem",src:"sap-icon://overflow",press:function(e){t.fireShowActions();t.addStyleClass('showTileActionsIcon');var E=sap.ui.getCore().getEventBus(),a=function(n,b,c){c.removeStyleClass('showTileActionsIcon');E.unsubscribe("dashboard","actionSheetClose",a);};E.subscribe("dashboard","actionSheetClose",a);}});i.addStyleClass("sapUshellTileActionsIconClass");this.actionIcon=i;}else if(this.actionIcon){this.actionIcon.destroy(true);}this.setProperty("showActionsIcon",s);};sap.ushell.ui.launchpad.Tile.prototype.setVisible=function(v){this.setProperty("visible",v,true);return this.toggleStyleClass("sapUshellHidden",!v);};sap.ushell.ui.launchpad.Tile.prototype.setRgba=function(v){this.setProperty("rgba",v,true);this._redrawRGBA(arguments);};sap.ushell.ui.launchpad.Tile.prototype.setAnimationRendered=function(v){this.setProperty('animationRendered',v,true);};sap.ushell.ui.launchpad.Tile.prototype._handleTileShadow=function(j,a){if(j.length){j.unbind('mouseenter mouseleave');var u,t=j.css("border").split("px")[0],m=this.getModel();if(t>0){u=j.css("border-color");}else{u=this.getRgba();}j.hover(function(){if(!m.getProperty('/tileActionModeActive')){var o=jQuery(j).css('box-shadow'),T=o?o.split(') ')[1]:null,U;if(T){U=T+" "+u;jQuery(this).css('box-shadow',U);}}},function(){jQuery(this).css('box-shadow','');});}};sap.ushell.ui.launchpad.Tile.prototype._redrawRGBA=function(a){var r=this.getRgba(),j,i;if(r){j=jQuery.sap.byId(this.getId());i=(jQuery.browser.msie&&(parseInt(jQuery.browser.version,9)===9));if(!j){return;}if(!this.getModel().getProperty('/animationRendered')){if(i){j.animate({backgroundColor:r},2000);}else{j.css('transition','background-color 2s');j.css('background-color',r);}}else{j.css('background-color',r);}this._handleTileShadow(j,a);}};sap.ushell.ui.launchpad.Tile.prototype.setLong=function(l){this.setProperty("long",l,true);return this.toggleStyleClass("sapUshellLong",l);};sap.ushell.ui.launchpad.Tile.prototype.setUuid=function(u){this.setProperty("uuid",u,true);return this;};}());
