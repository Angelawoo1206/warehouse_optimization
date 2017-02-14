/*!
 * ${copyright}
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device','sap/ui/core/Control','sap/ushell/library','./ShellHeader','./SplitContainer','./ToolArea','./RightFloatingContainer','./FloatingContainer','./ShellFloatingActions'],function(q,D,C,S,a,T,b){"use strict";var c=C.extend("sap.ushell.ui.shell.ShellLayout",{metadata:{properties:{headerHiding:{type:"boolean",group:"Appearance",defaultValue:false},headerVisible:{type:"boolean",group:"Appearance",defaultValue:true},toolAreaVisible:{type:"boolean",group:"Appearance",defaultValue:false},floatingContainerVisible:{type:"boolean",group:"Appearance",defaultValue:false},backgroundColorForce:{type:"boolean",group:"Appearance",defaultValue:true},showBrandLine:{type:"boolean",group:"Appearance",defaultValue:true},showAnimation:{type:"boolean",group:"Appearance",defaultValue:true},enableCanvasShapes:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{header:{type:"sap.ushell.ui.shell.ShellHeader",multiple:false},toolArea:{type:"sap.ushell.ui.shell.ToolArea",multiple:false},rightFloatingContainer:{type:"sap.ushell.ui.shell.RightFloatingContainer",multiple:false},canvasSplitContainer:{type:"sap.ushell.ui.shell.SplitContainer",multiple:false},floatingActionsContainer:{type:"sap.ushell.ui.shell.ShellFloatingActions",multiple:false}},associations:{floatingContainer:{type:"sap.ushell.ui.shell.FloatingContainer",multiple:false}}}});c._SIDEPANE_WIDTH_PHONE=13;c._SIDEPANE_WIDTH_TABLET=13;c._SIDEPANE_WIDTH_DESKTOP=15;c._HEADER_ALWAYS_VISIBLE=true;c._HEADER_AUTO_CLOSE=true;c._HEADER_TOUCH_TRESHOLD=15;if(D.browser.chrome&&D.browser.version<36){c._HEADER_TOUCH_TRESHOLD=10;}c.prototype.init=function(){this._rtl=sap.ui.getCore().getConfiguration().getRTL();this._showHeader=true;this._iHeaderHidingDelay=3000;this._useStrongBG=false;D.media.attachHandler(this._handleMediaChange,this,D.media.RANGESETS.SAP_STANDARD);};c.prototype.exit=function(){D.media.detachHandler(this._handleMediaChange,this,D.media.RANGESETS.SAP_STANDARD);};c.prototype.onAfterRendering=function(){var t=this;function h(B){var e=q.event.fix(B);if(q.sap.containsOrEquals(t.getDomRef("hdr"),e.target)){t._timedHideHeader(e.type==="focus");}}if(window.addEventListener&&!c._HEADER_ALWAYS_VISIBLE){var H=this.getDomRef("hdr");H.addEventListener("focus",h,true);H.addEventListener("blur",h,true);}this.getCanvasSplitContainer()._applySecondaryContentSize();this._setSidePaneWidth();this.renderFloatingContainer();};c.prototype.renderFloatingContainer=function(){var o=sap.ui.getCore().byId(this.getFloatingContainer()),f=document.getElementById("sapUshellFloatingContainerWrapper"),d=document.getElementsByTagName('body');if(!f){f=document.createElement("DIV");f.setAttribute("id",'sapUshellFloatingContainerWrapper');f.setAttribute("class",'sapUshellShellFloatingContainerWrapper');d[0].appendChild(f);}if(o&&!o.getDomRef()){q('#sapUshellFloatingContainerWrapper').toggleClass("sapUshellShellHidden",true);o.placeAt("sapUshellFloatingContainerWrapper");}};c.prototype.onThemeChanged=function(){this._refreshAfterRendering();};(function(){function _(s){if(s._startY===undefined||s._currY===undefined){return;}var y=s._currY-s._startY;if(Math.abs(y)>c._HEADER_TOUCH_TRESHOLD){s._doShowHeader(y>0);s._startY=s._currY;}}if(D.support.touch){c._HEADER_ALWAYS_VISIBLE=false;c.prototype.ontouchstart=function(e){this._startY=e.touches[0].pageY;if(this._startY>2*48){this._startY=undefined;}this._currY=this._startY;};c.prototype.ontouchend=function(){_(this);this._startY=undefined;this._currY=undefined;};c.prototype.ontouchcancel=c.prototype.ontouchend;c.prototype.ontouchmove=function(e){this._currY=e.touches[0].pageY;_(this);};}})();c.prototype.setHeaderHiding=function(e){e=!!e;return this._modifyAggregationOrProperty(function(r){return this.setProperty("headerHiding",e,r);},function(){this._doShowHeader(!e?true:this._showHeader);});};c.prototype.setHeaderHidingDelay=function(d){this._iHeaderHidingDelay=d;return this;};c.prototype.getHeaderHidingDelay=function(){return this._iHeaderHidingDelay;};c.prototype.setToolAreaVisible=function(v){this.setProperty("toolAreaVisible",!!v,true);this.getToolArea().$().toggleClass("sapUshellShellHidden",!v);this.getCanvasSplitContainer()._applySecondaryContentSize();return this;};c.prototype.setFloatingContainerVisible=function(v){this.setProperty("floatingContainerVisible",!!v,true);if(this.getDomRef()){q('.sapUshellShellFloatingContainerWrapper').toggleClass("sapUshellShellHidden",!v);}return this;};c.prototype.setFloatingContainer=function(o){this.setAssociation('floatingContainer',o,true);};c.prototype.setHeaderVisible=function(h){this.setProperty("headerVisible",!!h,true);this.$().toggleClass("sapUshellShellNoHead",!h);return this;};c.prototype._setStrongBackground=function(u){this._useStrongBG=!!u;this.$("strgbg").toggleClass("sapUiStrongBackgroundColor",this._useStrongBG);};c.prototype._modifyAggregationOrProperty=function(u,d){var r=!!this.getDomRef();var e=u.apply(this,[r]);if(r&&d){if(d instanceof sap.ushell.ui.shell.shell_ContentRenderer){d.render();}else{d.apply(this);}}return e;};c.prototype._doShowHeader=function(s){var w=this._showHeader;this._showHeader=this._isHeaderHidingActive()?!!s:true;this.$().toggleClass("sapUshellShellHeadHidden",!this._showHeader).toggleClass("sapUshellShellHeadVisible",this._showHeader);if(this._showHeader){this._timedHideHeader();}if(w!==this._showHeader&&this._isHeaderHidingActive()){q.sap.delayedCall(500,this,function(){try{var r=document.createEvent("UIEvents");r.initUIEvent("resize",true,false,window,0);window.dispatchEvent(r);}catch(e){q.sap.log.error(e);}});}};c.prototype._timedHideHeader=function(d){if(this._headerHidingTimer){q.sap.clearDelayedCall(this._headerHidingTimer);this._headerHidingTimer=null;}if(d||!c._HEADER_AUTO_CLOSE||!this._isHeaderHidingActive()||this._iHeaderHidingDelay<=0){return;}this._headerHidingTimer=q.sap.delayedCall(this._iHeaderHidingDelay,this,function(){if(this._isHeaderHidingActive()&&this._iHeaderHidingDelay>0&&!q.sap.containsOrEquals(this.getDomRef("hdr"),document.activeElement)){this._doShowHeader(false);}});};c.prototype._isHeaderHidingActive=function(){if(c._HEADER_ALWAYS_VISIBLE||!this.getHeaderHiding()||sap.ushell.ui.shell.shell_iNumberOfOpenedShellOverlays>0||!this.getHeaderVisible()){return false;}return true;};c.prototype._setSidePaneWidth=function(r){var s=this.getCanvasSplitContainer();if(s){if(!r){r=D.media.getCurrentRange(D.media.RANGESETS.SAP_STANDARD).name;}var w=c["_SIDEPANE_WIDTH_"+r.toUpperCase()]+"rem";s.setSecondaryContentSize(w);}};c.prototype._handleMediaChange=function(p){if(!this.getDomRef()){return false;}this._setSidePaneWidth(p.name);this.getCanvasSplitContainer()._applySecondaryContentSize();};c.prototype._refreshAfterRendering=function(){var d=this.getDomRef();if(!d){return false;}this._timedHideHeader();return true;};return c;},true);
