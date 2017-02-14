/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.HeaderContainer");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.HeaderContainer",{metadata:{deprecated:true,interfaces:["sap.m.ObjectHeaderContainer"],library:"sap.suite.ui.commons",properties:{"scrollStep":{type:"int",group:"Misc",defaultValue:300},"scrollTime":{type:"int",group:"Misc",defaultValue:500},"showDividers":{type:"boolean",group:"Misc",defaultValue:true},"view":{type:"sap.suite.ui.commons.HeaderContainerView",group:"Misc",defaultValue:sap.suite.ui.commons.HeaderContainerView.Horizontal},"backgroundDesign":{type:"sap.m.BackgroundDesign",group:"Misc",defaultValue:sap.m.BackgroundDesign.Transparent}},aggregations:{"scrollContainer":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},"items":{type:"sap.ui.core.Control",multiple:true,singularName:"item"},"buttonPrev":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},"buttonNext":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}}}});jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.ui.core.Icon");jQuery.sap.require("sap.ui.core.delegate.ItemNavigation");
sap.suite.ui.commons.HeaderContainer.prototype.init=function(){this._iSelectedCell=0;this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this._oScrollCntr=new sap.m.ScrollContainer(this.getId()+"-scrl-cntnr",{width:"100%",horizontal:!jQuery.device.is.desktop,height:"100%"});this.setAggregation("scrollContainer",this._oScrollCntr);var t=this;if(jQuery.device.is.desktop){jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");this._oArrowPrev=new sap.m.Button({id:this.getId()+"-scrl-prev-button",tooltip:this._rb.getText("HEADERCONTAINER_BUTTON_PREV_SECTION"),press:function(e){e.cancelBubble();this._scroll(-this.getScrollStep(),this.getScrollTime());}.bind(this)}).addStyleClass("sapSuiteHdrCntrBtn").addStyleClass("sapSuiteHdrCntrLeft");this.setAggregation("buttonPrev",this._oArrowPrev);this._oArrowNext=new sap.m.Button({id:this.getId()+"-scrl-next-button",tooltip:this._rb.getText("HEADERCONTAINER_BUTTON_NEXT_SECTION"),press:function(e){e.cancelBubble();this._scroll(this.getScrollStep(),this.getScrollTime());}.bind(this)}).addStyleClass("sapSuiteHdrCntrBtn").addStyleClass("sapSuiteHdrCntrRight");this.setAggregation("buttonNext",this._oArrowNext);this._oScrollCntr.addDelegate({onAfterRendering:function(){if(jQuery.device.is.desktop){var f=jQuery.sap.domById(t.getId()+"-scrl-cntnr-scroll");var F=jQuery.sap.byId(t.getId()+"-scrl-cntnr-scroll");var d=F.find(".sapSuiteHrdrCntrInner").attr("tabindex","0");if(!t._oItemNavigation){t._oItemNavigation=new sap.ui.core.delegate.ItemNavigation();t.addDelegate(t._oItemNavigation);t._oItemNavigation.attachEvent(sap.ui.core.delegate.ItemNavigation.Events.BorderReached,t._handleBorderReached,t);t._oItemNavigation.attachEvent(sap.ui.core.delegate.ItemNavigation.Events.AfterFocus,t._handleBorderReached,t);}t._oItemNavigation.setRootDomRef(f);t._oItemNavigation.setItemDomRefs(d);t._oItemNavigation.setTabIndex0();t._oItemNavigation.setCycling(false);}},onBeforeRendering:function(){if(jQuery.device.is.desktop){t._oScrollCntr._oScroller=new sap.ui.core.delegate.ScrollEnablement(t._oScrollCntr,t._oScrollCntr.getId()+"-scroll",{horizontal:true,vertical:true,zynga:false,preventDefault:false,nonTouchScrolling:true});}}});}};
sap.suite.ui.commons.HeaderContainer.prototype._scroll=function(d,D){this.bScrollInProcess=true;var t=this;setTimeout(function(){t.bScrollInProcess=false;},D+300);if(this.getView()=="Horizontal"){this._hScroll(d,D);}else{this._vScroll(d,D);}};
sap.suite.ui.commons.HeaderContainer.prototype._vScroll=function(d,D){var o=jQuery.sap.domById(this.getId()+"-scrl-cntnr");var s=o.scrollTop;var S=s+d;this._oScrollCntr.scrollTo(0,S,D);};
sap.suite.ui.commons.HeaderContainer.prototype._hScroll=function(d,D){var o=jQuery.sap.domById(this.getId()+"-scrl-cntnr");var s;if(!this._bRtl){var S=o.scrollLeft;s=S+d;this._oScrollCntr.scrollTo(s,0,D);}else{s=jQuery(o).scrollRightRTL()+d;this._oScrollCntr.scrollTo((s>0)?s:0,0,D);}};
sap.suite.ui.commons.HeaderContainer.prototype._checkOverflow=function(){if(this.getView()=="Horizontal"){this._checkHOverflow();}else{this._checkVOverflow();}};
sap.suite.ui.commons.HeaderContainer.prototype._checkVOverflow=function(){var b=this._oScrollCntr.getDomRef();var s=false;if(b){if(b.scrollHeight>b.clientHeight){s=true;}}this._lastVScrolling=s;if(b){var S=b.scrollTop;var a=false;var c=false;var r=b.scrollHeight;var d=b.clientHeight;if(Math.abs(r-d)===1){r=d;}if(S>0){a=true;}if((r>d)&&(S+d<r)){c=true;}if(!a){this._oArrowPrev.$().hide();}else{this._oArrowPrev.$().show();}if(!c){this._oArrowNext.$().hide();}else{this._oArrowNext.$().show();}}};
sap.suite.ui.commons.HeaderContainer.prototype._checkHOverflow=function(){var b=this._oScrollCntr.getDomRef();var B=this.$("scroll-area");var s=false;if(b){if(b.scrollWidth-5>b.clientWidth){s=true;}}this._lastScrolling=s;if(b){var S=b.scrollLeft;var a=false;var c=false;var r=b.scrollWidth;var d=b.clientWidth;if(Math.abs(r-d)===1){r=d;}if(this._bRtl){var i=jQuery(b).scrollLeftRTL();if(i>(sap.ui.Device.browser.internet_explorer?1:0)){c=true;}}else{if(S>1){a=true;}}var R=function(){var p=parseFloat(B.css("padding-right"));return sap.ui.Device.browser.internet_explorer?p+1:p;};if(r-5>d){if(this._bRtl){if(jQuery(b).scrollRightRTL()>1){a=true;}}else{if(Math.abs(S+d-r)>R()){c=true;}}}var o=this._oArrowPrev.$().is(":visible");if(o&&!a){this._oArrowPrev.$().hide();}if(!o&&a){this._oArrowPrev.$().show();}var O=this._oArrowNext.$().is(":visible");if(O&&!c){this._oArrowNext.$().hide();}if(!O&&c){this._oArrowNext.$().show();}}};
sap.suite.ui.commons.HeaderContainer.prototype._handleBorderReached=function(o){if(sap.ui.Device.browser.internet_explorer&&this.bScrollInProcess){return;}var i=o.getParameter("index");if(i===0){this._scroll(-this.getScrollStep(),this.getScrollTime());}else if(i===this.getItems().length-1){this._scroll(this.getScrollStep(),this.getScrollTime());}};
sap.suite.ui.commons.HeaderContainer.prototype.addItem=function(i,s){var r=this._oScrollCntr.addContent(i.addStyleClass("sapSuiteHrdrCntrInner"),s);return r;};
sap.suite.ui.commons.HeaderContainer.prototype.insertItem=function(i,I,s){var r=this._oScrollCntr.insertContent(i.addStyleClass("sapSuiteHrdrCntrInner"),I,s);return r;};
sap.suite.ui.commons.HeaderContainer.prototype._callMethodInManagedObject=function(f,a){var b=Array.prototype.slice.call(arguments);if(a==="items"){b[1]="content";return this._oScrollCntr[f].apply(this._oScrollCntr,b.slice(1));}else{return sap.ui.base.ManagedObject.prototype[f].apply(this,b.slice(1));}};
sap.suite.ui.commons.HeaderContainer.prototype.onBeforeRendering=function(){if(jQuery.device.is.desktop){sap.ui.getCore().attachIntervalTimer(this._checkOverflow,this);this._oArrowPrev.setIcon(this.getView()=="Horizontal"?"sap-icon://navigation-left-arrow":"sap-icon://navigation-up-arrow");this._oArrowNext.setIcon(this.getView()=="Horizontal"?"sap-icon://navigation-right-arrow":"sap-icon://navigation-down-arrow");this.$().unbind("click",this.handleSwipe);}};
sap.suite.ui.commons.HeaderContainer.prototype.onAfterRendering=function(){jQuery.sap.byId(this.getId()+"-scrl-next-button").attr("tabindex","-1");jQuery.sap.byId(this.getId()+"-scrl-prev-button").attr("tabindex","-1");if(jQuery.device.is.desktop){this.$().bind("swipe",jQuery.proxy(this.handleSwipe,this));}};
sap.suite.ui.commons.HeaderContainer.prototype.handleSwipe=function(e){e.preventDefault();e.stopPropagation();this._isDragEvent=true;};
sap.suite.ui.commons.HeaderContainer.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();}if(this._sScrollResizeHandlerId){sap.ui.core.ResizeHandler.deregister(this._sScrollResizeHandlerId);}};
sap.suite.ui.commons.HeaderContainer.prototype.onclick=function(e){if(this._isDragEvent){e.preventDefault();e.stopPropagation();this._isDragEvent=false;}};
sap.suite.ui.commons.HeaderContainer.prototype.setView=function(v){this.setProperty("view",v,true);if(v===sap.suite.ui.commons.HeaderContainerView.Horizontal&&!jQuery.device.is.desktop){this._oScrollCntr.setHorizontal(true);this._oScrollCntr.setVertical(false);}else if(!jQuery.device.is.desktop){this._oScrollCntr.setHorizontal(false);this._oScrollCntr.setVertical(true);}return this;};
sap.suite.ui.commons.HeaderContainer.prototype.validateAggregation=function(a,o,m){return this._callMethodInManagedObject("validateAggregation",a,o,m);};
sap.suite.ui.commons.HeaderContainer.prototype.getAggregation=function(a,o,s){return this._callMethodInManagedObject("getAggregation",a,o,s);};
sap.suite.ui.commons.HeaderContainer.prototype.setAggregation=function(a,o,s){this._callMethodInManagedObject("setAggregation",a,o,s);return this;};
sap.suite.ui.commons.HeaderContainer.prototype.indexOfAggregation=function(a,o){return this._callMethodInManagedObject("indexOfAggregation",a,o);};
sap.suite.ui.commons.HeaderContainer.prototype.insertAggregation=function(a,o,i,s){this._callMethodInManagedObject("insertAggregation",a,o,i,s);return this;};
sap.suite.ui.commons.HeaderContainer.prototype.addAggregation=function(a,o,s){this._callMethodInManagedObject("addAggregation",a,o,s);return this;};
sap.suite.ui.commons.HeaderContainer.prototype.removeAggregation=function(a,o,s){return this._callMethodInManagedObject("removeAggregation",a,o,s);};
sap.suite.ui.commons.HeaderContainer.prototype.removeAllAggregation=function(a,s){return this._callMethodInManagedObject("removeAllAggregation",a,s);};
sap.suite.ui.commons.HeaderContainer.prototype.destroyAggregation=function(a,s){this._callMethodInManagedObject("destroyAggregation",a,s);return this;};
sap.suite.ui.commons.HeaderContainer.prototype._getParentCell=function(d){return jQuery(d).parents(".sapSuiteHrdrCntrInner").andSelf(".sapSuiteHrdrCntrInner").get(0);};
sap.suite.ui.commons.HeaderContainer.prototype.onsaptabnext=function(e){this._iSelectedCell=this._oItemNavigation.getFocusedIndex();var f=this.$().find(":focusable");var t=f.index(e.target);var n=f.eq(t+1).get(0);var F=this._getParentCell(e.target);var T;if(n){T=this._getParentCell(n);}if(F&&T&&F.id!==T.id||n&&n.id===this.getId()+"-after"){var l=f.last().get(0);if(l){this._bIgnoreFocusIn=true;l.focus();}}};
sap.suite.ui.commons.HeaderContainer.prototype.onsaptabprevious=function(e){var f=this.$().find(":focusable");var t=f.index(e.target);var p=f.eq(t-1).get(0);var F=this._getParentCell(e.target);this._iSelectedCell=this._oItemNavigation.getFocusedIndex();var T;if(p){T=this._getParentCell(p);}if(!T||F&&F.id!==T.id){var s=this.$().attr("tabindex");this.$().attr("tabindex","0");this.$().focus();if(!s){this.$().removeAttr("tabindex");}else{this.$().attr("tabindex",s);}}};
sap.suite.ui.commons.HeaderContainer.prototype.onfocusin=function(e){if(this._bIgnoreFocusIn){this._bIgnoreFocusIn=false;return;}if(e.target.id===this.getId()+"-after"){this._restoreLastFocused();}else{return;}};
sap.suite.ui.commons.HeaderContainer.prototype._restoreLastFocused=function(){if(!this._oItemNavigation){return;}var n=this._oItemNavigation.getItemDomRefs();var l=this._oItemNavigation.getFocusedIndex();var L=jQuery(n[l]);var r=L.control(0)||{};var t=r.getTabbables?r.getTabbables():L.find(":sapTabbable");t.eq(-1).add(L).eq(-1).focus();};