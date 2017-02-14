/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/Popup','sap/ui/Device','sap/m/library'],function(q,l,C,I,P,D,m){"use strict";var a=C.extend("sap.ui.vk.ContainerBase",{metadata:{library:"sap.ui.vk",properties:{"showFullScreen":{type:"boolean",group:"Misc",defaultValue:true},"showSettings":{type:"boolean",group:"Misc",defaultValue:true},"showSelection":{type:"boolean",group:"Misc",defaultValue:true},"fullScreen":{type:"boolean",group:"Misc",defaultValue:false},"title":{type:"string",group:"Misc",defaultValue:''},"autoAdjustHeight":{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.vk.ContainerContent",multiple:true,singularName:"content"},"toolbar":{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"}},associations:{},events:{"contentChange":{parameters:{selectedItemId:"string"}},"settingsPressed":{}}}});a.prototype.switchContent=function(c){this.setSelectedContent(c);this.rerender();};a.prototype.updateContainer=function(){this._contentChanged=true;this.rerender();};a.prototype.setSelectedContent=function(c){this._oSelectedContent=c;};a.prototype.getSelectedContent=function(){return this._oSelectedContent;};a.prototype.init=function(){this._firstTime=true;this._aContentIcons=[];this._selectedContent=null;this._oSelectedContent=null;this._bSegmentedButtonSaveSelectState=false;this._oMenu=null;var L=new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.High});var b=sap.m.ButtonType.Transparent;this._oFullScreenButton=new sap.m.OverflowToolbarButton({layoutData:L,type:b,icon:"sap-icon://full-screen",text:sap.ui.vk.getResourceBundle().getText("CONTAINERBASE_FULLSCREEN"),tooltip:sap.ui.vk.getResourceBundle().getText("CONTAINERBASE_FULLSCREEN"),press:function(){this._bSegmentedButtonSaveSelectState=true;this._toggleFullScreen();}.bind(this)});this._oSettingsButton=new sap.m.OverflowToolbarButton({layoutData:L.clone(),type:b,icon:"sap-icon://action-settings",text:sap.ui.vk.getResourceBundle().getText("CONTAINERBASE_SETTINGS"),tooltip:sap.ui.vk.getResourceBundle().getText("CONTAINERBASE_SETTINGS"),press:function(){this._bSegmentedButtonSaveSelectState=true;this.fireSettingsPressed();}.bind(this)});this._oSelectionButtonSingle=new sap.m.SegmentedButtonItem({icon:"sap-icon://map-container/selection-single",tooltip:sap.ui.vk.getResourceBundle().getText("CONTAINERBASE_MENU_SINGLE"),press:this._handleSelection.bind(this,"SINGLE")});this._oSelectionButtonRectangle=new sap.m.SegmentedButtonItem({icon:"sap-icon://map-container/selection-rectangle",tooltip:sap.ui.vk.getResourceBundle().getText("CONTAINERBASE_MENU_RECT"),press:this._handleSelection.bind(this,"RECT")});this._oSelectionButtonLasso=new sap.m.SegmentedButtonItem({icon:"sap-icon://map-container/selection-lasso",tooltip:sap.ui.vk.getResourceBundle().getText("CONTAINERBASE_MENU_LASSO"),press:this._handleSelection.bind(this,"LASSO")});this._selectionMenu=new sap.m.SegmentedButton({items:[this._oSelectionButtonSingle,this._oSelectionButtonRectangle,this._oSelectionButtonLasso]});this._oPopup=new P({modal:true,shadow:false,autoClose:false});this._oContentSegmentedButton=new sap.m.SegmentedButton({layoutData:L.clone(),select:this._onContentButtonSelect.bind(this)});this._oContTitle=new sap.m.Label();this._oToolbar=new sap.m.OverflowToolbar({width:"auto"}).addStyleClass("sapUiVkContainerBaseToolbar");this.setAggregation("toolbar",this._oToolbar);this.sResizeListenerId=null;if(D.system.desktop){this.sResizeListenerId=sap.ui.core.ResizeHandler.register(this,q.proxy(this._performHeightChanges,this));}else{D.orientation.attachHandler(this._performHeightChanges,this);D.resize.attachHandler(this._performHeightChanges,this);}q.sap.require("sap.ui.thirdparty.URI");var c=[{name:"selection-lasso",unicode:"E000"},{name:"selection-rectangle",unicode:"E001"},{name:"selection-single",unicode:"E002"}],d="map-container",f="map-container";c.forEach(function(i){sap.ui.core.IconPool.addIcon(i.name,d,f,i.unicode);});};a.prototype.exit=function(){if(this._oFullScreenButton){this._oFullScreenButton.destroy();this._oFullScreenButton=undefined;}if(this._oPopup){this._oPopup.destroy();this._oPopup=undefined;}if(this._oContentSegmentedButton){this._oContentSegmentedButton.destroy();this._oContentSegmentedButton=undefined;}if(this._oSelectedContent){this._oSelectedContent.destroy();this._oSelectedContent=undefined;}if(this._oToolbar){this._oToolbar.destroy();this._oToolbar=undefined;}if(D.system.desktop&&this.sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}else{D.orientation.detachHandler(this._performHeightChanges,this);D.resize.detachHandler(this._performHeightChanges,this);}};a.prototype.setFullScreen=function(f){if(this._firstTime){return;}if(this.getFullScreen()==f){return;}var b=this.getProperty("fullScreen");if(b!==f){this._toggleFullScreen();}};a.prototype.onAfterRendering=function(){var t=this;if((this.sResizeListenerId===null)&&(D.system.desktop)){this.sResizeListenerId=sap.ui.core.ResizeHandler.register(this,q.proxy(this._performHeightChanges,this));}if(this.getAutoAdjustHeight()||this.getFullScreen()){q.sap.delayedCall(500,this,function(){t._performHeightChanges();});}this._firstTime=false;};a.prototype.onBeforeRendering=function(){if(this._contentChanged){this._contentChange();}this._oToolbar.removeAllContent();this._addToolbarContent();};a.prototype.setTitle=function(v){this._oContTitle.setText(v);this.setProperty("title",v,true);};a.prototype.addContent=function(o){this.addAggregation("content",o);this._contentChanged=true;};a.prototype.insertContent=function(o,i){this.insertAggregation("content",o,i);this._contentChanged=true;};a.prototype.updateContent=function(){this.updateAggregation("content");this._contentChanged=true;};a.prototype._toggleFullScreen=function(){var f=this.getProperty("fullScreen");var s;var h;var c;if(f){this._closeFullScreen();this.setProperty("fullScreen",false,true);c=this.getSelectedContent().getContent();s=c.getId();c.setWidth("100%");h=this._contentHeight[s];if(h){c.setHeight(h);}this.invalidate();}else{var o=this.getAggregation("content");this._contentHeight={};if(o){for(var i=0;i<o.length;i++){c=o[i].getContent();s=c.getId();if(q.isFunction(c.getHeight)){h=c.getHeight();}else{h=0;}this._contentHeight[s]=h;}}this._openFullScreen(true);this.setProperty("fullScreen",true,true);}var b=(f?"sap-icon://full-screen":"sap-icon://exit-full-screen");this._oFullScreenButton.setIcon(b);this._oFullScreenButton.focus();};a.prototype._openFullScreen=function(n){if((n!==null)&&(n===true)){this._oScrollEnablement=new sap.ui.core.delegate.ScrollEnablement(this,this.getId()+"-wrapper",{horizontal:true,vertical:true});}this.$content=this.$();if(this.$content){this.$tempNode=q("<div></div>");this.$content.before(this.$tempNode);this._$overlay=q("<div id='"+q.sap.uid()+"'></div>");this._$overlay.addClass("sapUiVkContainerBaseOverlay");this._$overlay.append(this.$content);this._oPopup.setContent(this._$overlay);}else{q.sap.log.warn("Overlay: content does not exist or contains more than one child");}this._oPopup.open(200,undefined,undefined,q("body"));};a.prototype._closeFullScreen=function(){if(this._oScrollEnablement!==null){this._oScrollEnablement.destroy();this._oScrollEnablement=null;}this.$tempNode.replaceWith(this.$content);this._oToolbar.setDesign(sap.m.ToolbarDesign.Auto);this._oPopup.close();this._$overlay.remove();};a.prototype._performHeightChanges=function(){if(this.getAutoAdjustHeight()||this.getFullScreen()){var $=this.$();if(($.find('.sapUiVkContainerBaseToolbarArea').children()[0])&&($.find('.sapUiVkContainerBaseContentArea').children()[0])){var o=this.getSelectedContent().getContent();if(o.getDomRef().offsetWidth!==this.getDomRef().clientWidth){this.rerender();}}}};a.prototype._switchContent=function(c){var o=this._findContentById(c);this.setSelectedContent(o);this.fireContentChange({selectedItemId:c});this.rerender();};a.prototype._contentChange=function(){var c=this.getContent();this._oContentSegmentedButton.removeAllButtons();this._destroyButtons(this._aContentIcons);this._aContentIcons=[];if(c.length===0){this._oContentSegmentedButton.removeAllButtons();this._setDefaultOnSegmentedButton();this.switchContent(null);}if(c){for(var i=0;i<c.length;i++){var b=c[i].getContent();if(b.setWidth){b.setWidth("100%");}var B=new sap.m.SegmentedButtonItem({icon:c[i].getIcon(),tooltip:c[i].getTitle(),key:b.getId()});this._aContentIcons.push(B);this._oContentSegmentedButton.addItem(B);if(i===0){this.setSelectedContent(c[i]);}}}this._contentChanged=false;};a.prototype._onContentButtonSelect=function(e){var c=e.getParameter("key");this._switchContent(c);};a.prototype._findContentById=function(s){var c=null;var o=this.getAggregation("content");if(o){for(var i=0;!c&&i<o.length;i++){if(o[i].getContent().getId()===s){c=o[i];}}}return c;};a.prototype._addToolbarContent=function(){this._oToolbar.addContent(new sap.m.ToolbarSpacer());if(this._aContentIcons.length>1){this._oToolbar.addContent(this._oContentSegmentedButton);}if(this.getShowSelection()){this._oToolbar.addContent(this._selectionMenu);}if(this.getShowSettings()){this._oToolbar.addContent(this._oSettingsButton);}if(!D.system.phone&&this.getShowFullScreen()){this._oToolbar.addContent(this._oFullScreenButton);}};a.prototype._setDefaultOnSegmentedButton=function(){if(!this._bSegmentedButtonSaveSelectState){this._oContentSegmentedButton.setSelectedButton(null);}this._bSegmentedButtonSaveSelectState=false;};a.prototype._destroyButtons=function(b){b.forEach(function(B){B.destroy();});};a.prototype._handleSelection=function(b){var c=this.getSelectedContent().getContent();if(c instanceof sap.ui.vbm.GeoMap){if(b=="LASSO"){c.setLassoSelection(true);}else if(b=="RECT"){c.setRectangularSelection(true);}else{c.setRectangularSelection(false);c.setLassoSelection(false);}}};return a;});
