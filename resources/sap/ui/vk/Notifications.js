/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/model/json/JSONModel","./Messages"],function(q,l,C,J,M){"use strict";var N=C.extend("sap.ui.vk.Notifications",{metadata:{library:"sap.ui.vk",aggregations:{_messagePopover:{type:"sap.m.MessagePopover",multiple:false,visibility:"hidden"},_messagePopoverItem:{type:"sap.m.MessagePopoverItem",multiple:false,visibility:"hidden"},_messagePopoverToggleButton:{type:"sap.m.ToggleButton",multiple:false,visibility:"hidden"}},events:{allMessagesCleared:{},messageAdded:{}},publicMethods:["clearAllMessages"]}});N.prototype.clearAllMessages=function(m,a){m.removeAllItems();a.setText(m.getItems().length);this.fireAllMessagesCleared();m.close();return this;};N.prototype.init=function(){this._messages=new M();this._listener={};this._messagePopover=new sap.m.MessagePopover();this._messagePopover.addStyleClass("sapVizKitNotificationPopover");this._messagePopoverToggleButton=new sap.m.ToggleButton({icon:"sap-icon://message-popup",type:sap.m.ButtonType.Emphasized,tooltip:sap.ui.vk.getResourceBundle().getText("MESSAGEPOPOVERBUTTON"),text:"0",press:function(e){if(e.getSource().getPressed()){this._messagePopover.openBy(e.getSource());}else{this._messagePopover.close();}}.bind(this)});this._messagePopoverToggleButton.addStyleClass("messagePopoverButton");this._messagePopover.attachAfterClose(function(e){this._messagePopoverToggleButton.setPressed(false);}.bind(this));var h=new sap.m.Button({text:sap.ui.vk.getResourceBundle().getText("MESSAGEPOPOVER_CLEARBUTTON"),type:sap.m.ButtonType.Emphasized,tooltip:sap.ui.vk.getResourceBundle().getText("MESSAGEPOPOVER_CLEARBUTTON"),press:this.clearAllMessages.bind(this,this._messagePopover,this._messagePopoverToggleButton)});this._messagePopover.setHeaderButton(h);this.setAggregation("_messagePopover",this._messagePopover);this.setAggregation("_messagePopoverToggleButton",this._messagePopoverToggleButton);this._listener.onLogEntry=function(e){if(/^sap\.ui\.vk/.test(e.component)){var m=e.details,c,r,a;if(this._messages.messages[e.details]){m=sap.ui.vk.getResourceBundle().getText(this._messages.messages[e.details].summary);c=sap.ui.vk.getResourceBundle().getText(this._messages.messages[e.details].cause);r=sap.ui.vk.getResourceBundle().getText(this._messages.messages[e.details].resolution);a=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_CODE");}var b=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_COMPONENT");var d=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_DATE");var t=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_TIME");var f=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_LEVEL");var g=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_MESSAGE");var i=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_CAUSE");var j=sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_RESOLUTION");var k="<div><b>"+b+":</b><br>"+e.component+"</div><br>"+"<div><b>"+d+":</b><br>"+e.date+"</div><br>"+(a?"<div><b>"+a+":</b><br>"+e.details+"</div><br>":"")+"<div><b>"+t+":</b><br>"+e.time.slice(0,e.time.indexOf("."))+"</div><br>"+"<div><b>"+f+":</b><br>"+e.level+"</div><br>"+"<div><b>"+g+":</b><br>"+m+"</div><br>"+(c?"<div><b>"+i+":</b><br>"+c+"</div><br>":"")+(r?"<div><b>"+j+":</b><br>"+r+"</div>":"");var I=new sap.m.MessagePopoverItem({markupDescription:true,title:e.message,description:k});this._messagePopover.addItem(I);this._messagePopoverToggleButton.setText(this._messagePopover.getItems().length);this.fireMessageAdded();}}.bind(this);q.sap.log.addLogListener(this._listener);};N.prototype.attachAllMessagesCleared=function(d,f,a){return this.attachEvent("allMessagesCleared",d,f,a);};N.prototype.detachAllMessagesCleared=function(f,a){return this.detachEvent("allMessagesCleared",f,a);};N.prototype.fireAllMessagesCleared=function(p,a,e){return this.fireEvent("allMessagesCleared",p,a,e);};N.prototype.attachMessageAdded=function(d,f,a){return this.attachEvent("messageAdded",d,f,a);};N.prototype.detachMessageAdded=function(f,a){return this.detachEvent("messageAdded",f,a);};N.prototype.fireMessageAdded=function(p,a,e){return this.fireEvent("messageAdded",p,a,e);};return N;});