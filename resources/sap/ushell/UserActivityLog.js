// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.UserActivityLog");jQuery.sap.require("sap.ushell.utils");var U=function(){};U.prototype={_maxLoggedMessages:30,_maxMessageByteSize:2048,_maxQueueByteSize:30720,_isActive:false,_observedLaunchpadActions:["createGroup","deleteGroup","resetGroup","changeGroupTitle","moveGroup","addTile","deleteTile","moveTile","externalSearch","appOpened","addBookmarkTile"],_observedGeneralActions:["showCatalog","openApp"],messageType:{ACTION:0,ERROR:1},_tileOntapOrigFunc:undefined,activate:function(c){if(this._isActive){return;}this._isActive=true;var e=sap.ui.getCore().getEventBus(),t=this;this._observedLaunchpadActions.forEach(function(a,i,b){e.subscribe("launchpad",a,t._handleAction,t);});this._observedGeneralActions.forEach(function(a,i,b){e.subscribe(a,t._handleAction,t);});jQuery.sap.log.addLogListener(this);jQuery.sap.log.debug("requiring sap.ushell.ui.launchpad.Tile",new Error().stack,"sap.ushell.UserActivityLog");jQuery.sap.require("sap.ushell.ui.launchpad.Tile");t._tileOntapOrigFunc=sap.ushell.ui.launchpad.Tile.prototype.ontap;sap.ushell.ui.launchpad.Tile.prototype.ontap=t._tileOnTapDecorator(t._tileOntapOrigFunc);},deactivate:function(){if(!this._isActive){return;}this._isActive=false;var e=sap.ui.getCore().getEventBus(),t=this;this._observedLaunchpadActions.forEach(function(a,i,b){e.unsubscribe("launchpad",a,t._handleAction,t);});this._observedGeneralActions.forEach(function(a,i,b){e.unsubscribe(a,t._handleAction,t);});jQuery.sap.log.removeLogListener(this);sap.ushell.ui.launchpad.Tile.prototype.ontap=this._tileOntapOrigFunc;},addMessage:function(t,m,a){if(this._isActive){this._addMessageInternal(t,m,a);}},getLog:function(){return this._getLoggingQueueFromStorage();},getMessageInfo:function(u){var r={userDetails:this._getUserDetails(),shellState:this._getShellState(),navigationData:this._getLastNavActionFromStorage(),userLog:this.getLog(),formFactor:sap.ushell.utils.getFormFactor()};return r;},getMessageInfoAsString:function(u){return JSON.stringify(this.getMessageInfo(u));},onLogEntry:function(d){var e=(typeof d.details!="undefined"&&(d.details!==""))?(d.message+" , "+d.details):d.message;this.addMessage(this.messageType.ERROR,e);},onAttachToLog:function(){},onDetachFromLog:function(){},_tileOnTapDecorator:function(o){var t=this,n,l,a,b,c,d;return function(e,u){var f=this.getMetadata().getName();if(f=="sap.ushell.ui.launchpad.PlusTile"){t.addMessage(t.messageType.ACTION,"Open Catalog for empty group "+this.getGroupId());}else if(f=="sap.ushell.ui.launchpad.Tile"){n=hasher.getHash();if(n){var g=sap.ushell.Container.getService("URLParsing");var h=g.parseShellHash(n);n='#'+g.constructShellHash({target:{semanticObject:h.semanticObject,action:h.action}});}l=t._getLastNavActionFromStorage();l.time=new Date();l.navigationHash=n;l.tileDebugInfo=this.getDebugInfo();a=sap.ui.getCore().byId(this.getId());b=a.getModel();c=this.getBindingContext();d=c.getPath();l.tileTitle=c.getModel().getProperty(d).title;t._putInLocalStorage("sap.ushell.UserActivityLog.lastNavigationActionData",JSON.stringify(l));t.addMessage(t.messageType.ACTION,"Click on Tile: "+b.getData().title+" Tile debugInfo: "+this.getDebugInfo());}o.apply(this,arguments);};},_addMessageInternal:function(t,m,a){var l=this._getLoggingQueueFromStorage(),b={type:null},p;for(p in this.messageType){if(t==this.messageType[p]){b.type=p;break;}}if(b.type===null){return;}jQuery.extend(b,{messageID:a,messageText:m,time:new Date(),toString:function(){var c=[this.type,this.time];if(typeof this.messageID!=="undefined"){c.push(this.messageID);}c.push(this.messageText);return c.join(" :: ");}});l.push(b);if(l.length>this._maxLoggedMessages){l.shift();}this._putInLocalStorage("sap.ushell.UserActivityLog.loggingQueue",JSON.stringify(l));},_handleAction:function(c,e,d){var m;switch(e){case'deleteTile':m="Delete Tile "+(d.tileId||"");break;case'moveTile':m="Move Tile "+(d.sTileId||"")+" to Group "+(d.toGroupId||"");break;case'createGroup':m="Create Group";break;case'changeGroupTitle':m="Change Group Title of "+(d.groupId||"")+" to "+(d.newTitle||"");break;case'deleteGroup':m="Delete Group "+(d.groupId||"");break;case'addTile':var t=d.catalogTileContext.oModel.oData,T=d.catalogTileContext.sPath,a=this._findInModel(T,t),b=a.id,g=d.groupContext.oModel.oData,G=d.groupContext.sPath,f=this._findInModel(G,g),h=f.groupId;m="Add Tile "+(b||"")+" to Group "+(h||"");break;case'moveGroup':m="Move Group from index "+(d.fromIndex||"")+" to index "+(d.toIndex||"");break;case'appOpened':m="Open application "+d.action;var l=this._getLastNavActionFromStorage();l.applicationInformation={};["applicationType","ui5ComponentName","url","additionalInformation","text"].forEach(function(p){l.applicationInformation[p]=d[p];});if(!this._hashSegmentsEqual(l.navigationHash,d.sShellHash)){l.tileDebugInfo="";}l.navigationHash=d.sShellHash;this._putInLocalStorage("sap.ushell.UserActivityLog.lastNavigationActionData",JSON.stringify(l));break;case'addBookmarkTile':m="Add Bookmark "+(d.title||"")+" "+(d.subtitle||"")+" for URL: "+(d.url||"");break;case'showCatalog':m="Show Catalog";break;default:break;}this.addMessage(this.messageType.ACTION,m);},_findInModel:function(p,m){var a,b=m,i,c;try{a=p.split("/");for(i=0;i<a.length;i=i+1){if(c!==a[i]){continue;}b=b[c];}}catch(e){return undefined;}return b;},_getUserDetails:function(u){var a=sap.ushell.Container.getUser();return{fullName:a.getFullName()||"",userId:a.getId()||"",eMail:a.getEmail()||"",Language:a.getLanguage()||""};},_getShellState:function(){var v=sap.ui.getCore().byId("viewPortContainer"),m,r="";if(v!==undefined){m=v.getModel();r=m.getProperty("/currentState/stateName");}return r;},_getLoggingQueueFromStorage:function(){var l=this._getFromLocalStorage("sap.ushell.UserActivityLog.loggingQueue");var q=[];if(l){try{q=JSON.parse(l);}catch(e){}}return q;},_getLastNavActionFromStorage:function(){var l=this._getFromLocalStorage("sap.ushell.UserActivityLog.lastNavigationActionData");return(l?JSON.parse(l):{});},_hashSegmentsEqual:function(u,a){if((!u)||(!a)){return false;}return(this._getHashSegment(u)==this._getHashSegment(a))?true:false;},_getHashSegment:function(u){var i=u.indexOf("~"),a;if(i>-1){return u.substring(0,i);}a=u.indexOf("?");if(a>-1){return u.substring(0,a);}return u;},_getFromLocalStorage:function(k){var r=null;try{r=localStorage.getItem(k);}catch(e){}return r;},_putInLocalStorage:function(k,v){try{localStorage.setItem(k,v);}catch(e){}}};sap.ushell.UserActivityLog=new U();})();