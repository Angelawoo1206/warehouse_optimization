/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/EventProvider"],function(q,E){"use strict";var T=E.extend("sap.ui.vk.InputDeviceSAPUI5",{metadata:{publicMethods:["isSupported","enable","disable"]},constructor:function(L){this._loco=L;this._points=0;}});T.prototype._eventToInput=function(e){var a={x:0,y:0,z:0,d:0,n:e.touches.length,buttons:0,scroll:0,points:[],handled:false};for(var i=0;i<a.n;i++){var b=e.touches[i];a.points.push({x:b.pageX,y:b.pageY,z:0});}return a;};T.prototype._ontouchdown=function(e){var i=this._eventToInput(e);if(this._points!=0&&this._points!=i.n){this._loco.endGesture(i,this._control);}this._points=i.n;i.handled=false;this._loco.beginGesture(i,this._control);if(i.handled){e._sapui_handledByControl=true;e.preventDefault();}};T.prototype._ontouchup=function(e){var i=this._eventToInput(e);this._loco.endGesture(i,this._control);this._points=0;if(i.handled){e._sapui_handledByControl=true;e.preventDefault();}};T.prototype._ontouchmove=function(e){var i=this._eventToInput(e);if(this._points!=i.n){this._loco.endGesture(i,this._control);i.handled=false;this._loco.beginGesture(i,this._control);this._points=i.n;}else{this._loco.move(i,this._control);}if(i.handled){e._sapui_handledByControl=true;e.preventDefault();}};T.prototype.isSupported=function(){return typeof window.ontouchstart!=='undefined';};T.prototype.enable=function(c){this._points=0;this._touchdownProxy=this._ontouchdown.bind(this);this._touchupProxy=this._ontouchup.bind(this);this._touchmoveProxy=this._ontouchmove.bind(this);this._control=c;if(!this._control){return;}c.attachBrowserEvent("saptouchstart",this._touchdownProxy,false);c.attachBrowserEvent("saptouchend",this._touchupProxy,false);c.attachBrowserEvent("saptouchmove",this._touchmoveProxy,false);c.attachBrowserEvent("touchstart",this._touchdownProxy,false);c.attachBrowserEvent("touchend",this._touchupProxy,false);c.attachBrowserEvent("touchmove",this._touchmoveProxy,false);};T.prototype.disable=function(){if(!this._control){return;}this._control.detachBrowserEvent("saptouchstart",this._touchdownProxy,false);this._control.detachBrowserEvent("saptouchend",this._touchupProxy,false);this._control.detachBrowserEvent("saptouchmove",this._touchmoveProxy,false);this._control.detachBrowserEvent("touchstart",this._touchdownProxy,false);this._control.detachBrowserEvent("touchend",this._touchupProxy,false);this._control.detachBrowserEvent("touchmove",this._touchmoveProxy,false);};return T;},true);
