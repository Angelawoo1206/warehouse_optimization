/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ProcessFlowNode");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ProcessFlowNode",{metadata:{library:"sap.suite.ui.commons",properties:{"title":{type:"string",group:"Misc",defaultValue:null},"isTitleClickable":{type:"boolean",group:"Behavior",defaultValue:false,deprecated:true},"laneId":{type:"string",group:"Misc",defaultValue:null},"nodeId":{type:"string",group:"Misc",defaultValue:null},"state":{type:"sap.suite.ui.commons.ProcessFlowNodeState",group:"Appearance",defaultValue:sap.suite.ui.commons.ProcessFlowNodeState.Neutral},"type":{type:"sap.suite.ui.commons.ProcessFlowNodeType",group:"Appearance",defaultValue:sap.suite.ui.commons.ProcessFlowNodeType.Single},"children":{type:"any[]",group:"Misc",defaultValue:null},"titleAbbreviation":{type:"string",group:"Data",defaultValue:null},"stateText":{type:"string",group:"Data",defaultValue:null},"texts":{type:"string[]",group:"Misc",defaultValue:null},"highlighted":{type:"boolean",group:"Appearance",defaultValue:false},"focused":{type:"boolean",group:"Appearance",defaultValue:false},"tag":{type:"object",group:"Misc",defaultValue:null},"selected":{type:"boolean",group:"Appearance",defaultValue:false}},associations:{"parents":{type:"sap.suite.ui.commons.ProcessFlowNode",multiple:true,singularName:"parent"}},events:{"titlePress":{deprecated:true,parameters:{"oEvent":{type:"object"}}},"press":{parameters:{"oEvent":{type:"object"}}}}}});sap.suite.ui.commons.ProcessFlowNode.M_EVENTS={'titlePress':'titlePress','press':'press'};jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.m.Text");sap.suite.ui.commons.ProcessFlowNode.prototype._zoomLevel=sap.suite.ui.commons.ProcessFlowZoomLevel.Two;sap.suite.ui.commons.ProcessFlowNode.prototype._tag=null;sap.suite.ui.commons.ProcessFlowNode.prototype._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.Regular;sap.suite.ui.commons.ProcessFlowNode.prototype._oResBundle=null;sap.suite.ui.commons.ProcessFlowNode.prototype._mergedLaneId=null;sap.suite.ui.commons.ProcessFlowNode.prototype._foldedCorner=false;sap.suite.ui.commons.ProcessFlowNode.prototype._foldedCornerControl=null;sap.suite.ui.commons.ProcessFlowNode.prototype._parent=null;sap.suite.ui.commons.ProcessFlowNode.prototype._headerControl=null;sap.suite.ui.commons.ProcessFlowNode.prototype._stateTextControl=null;sap.suite.ui.commons.ProcessFlowNode.prototype._iconControl=null;sap.suite.ui.commons.ProcessFlowNode.prototype._text1Control=null;sap.suite.ui.commons.ProcessFlowNode.prototype._text2Control=null;sap.suite.ui.commons.ProcessFlowNode.prototype._navigationFocus=false;sap.suite.ui.commons.ProcessFlowNode.prototype._sMouseEvents=" mousedown mouseup mouseenter mouseleave ";sap.suite.ui.commons.ProcessFlowNode.prototype._sMouseTouchEvents=(sap.ui.Device.support.touch)?'saptouchstart saptouchcancel touchstart touchend':'';if(sap.ui.Device.browser.msie){sap.suite.ui.commons.ProcessFlowNode.prototype._grabCursorClass="sapSuiteUiGrabCursorIEPF";sap.suite.ui.commons.ProcessFlowNode.prototype._grabbingCursorClass="sapSuiteUiGrabbingCursorIEPF";}else{sap.suite.ui.commons.ProcessFlowNode.prototype._grabCursorClass="sapSuiteUiGrabCursorPF";sap.suite.ui.commons.ProcessFlowNode.prototype._grabbingCursorClass="sapSuiteUiGrabbingCursorPF";}sap.suite.ui.commons.ProcessFlowNode.prototype._nodeHoverClass="sapSuiteUiCommonsProcessFlowNodeHover";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeActiveClass="sapSuiteUiCommonsProcessFlowNodeActive";sap.suite.ui.commons.ProcessFlowNode.prototype._nodePlannedClass="sapSuiteUiCommonsProcessFlowNodeStatePlanned";sap.suite.ui.commons.ProcessFlowNode.prototype._nodePlannedClassIdentifier="."+sap.suite.ui.commons.ProcessFlowNode.prototype._nodePlannedClass;sap.suite.ui.commons.ProcessFlowNode.prototype._nodeFCHoverClass="sapSuiteUiCommonsProcessFlowFoldedCornerNodeHover";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeFCActiveClass="sapSuiteUiCommonsProcessFlowFoldedCornerNodeActive";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeFCIconHoverClass="sapSuiteUiCommonsProcessFlowFoldedCornerNodeIconHover";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedClass="sapSuiteUiCommonsProcessFlowNodeAggregated";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedHoveredClass="sapSuiteUiCommonsProcessFlowNodeAggregatedHovered";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedDimmedClass="sapSuiteUiCommonsProcessFlowNodeAggregatedDimmed";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedFocusedClass="sapSuiteUiCommonsProcessFlowNodeAggregatedFocused";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedPressedClass="sapSuiteUiCommonsProcessFlowNodeAggregatedPressed";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedDimmedPressedClass="sapSuiteUiCommonsProcessFlowNodeAggregatedDimmedPressed";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedDimmedHoveredClass="sapSuiteUiCommonsProcessFlowNodeAggregatedDimmedHovered";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedClassZoomLevel4="sapSuiteUiCommonsProcessFlowNodeAggregatedZoomLevel4";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedHoveredClassZoomLevel4="sapSuiteUiCommonsProcessFlowNodeAggregatedHoveredZoomLevel4";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedPressedClassZoomLevel4="sapSuiteUiCommonsProcessFlowNodeAggregatedPressedZoomLevel4";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedDimmedClassZoomLevel4="sapSuiteUiCommonsProcessFlowNodeAggregatedDimmedZoomLevel4";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedFocusedClassZoomLevel4="sapSuiteUiCommonsProcessFlowNodeAggregatedFocusedZoomLevel4";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedDimmedPressedClassZoomLevel4="sapSuiteUiCommonsProcessFlowNodeAggregatedDimmedPressedZoomLevel4";sap.suite.ui.commons.ProcessFlowNode.prototype._nodeAggregatedDimmedHoveredClassZoomLevel4="sapSuiteUiCommonsProcessFlowNodeAggregatedDimmedHoveredZoomLevel4";
sap.suite.ui.commons.ProcessFlowNode.prototype.init=function(){sap.ui.core.IconPool.addIcon("context-menu","businessSuite","PFBusinessSuiteInAppSymbols","e02b",true);if(!this._oResBundle){this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");}};
sap.suite.ui.commons.ProcessFlowNode.prototype.exit=function(){if(this._foldedCornerControl){this._foldedCornerControl.destroy();this._foldedCornerControl=null;}if(this._headerControl){this._headerControl.destroy();this._headerControl=null;}if(this._stateTextControl){this._stateTextControl.destroy();this._stateTextControl=null;}if(this._iconControl){this._iconControl.destroy();this._iconControl=null;}if(this._text1Control){this._text1Control.destroy();this._text1Control=null;}if(this._text2Control){this._text2Control.destroy();this._text2Control=null;}this.$().unbind(this._sMouseEvents,this._handleEvents);if(sap.ui.Device.support.touch){this.$().unbind(this._sMouseTouchEvents,this._handleEvents);}};
sap.suite.ui.commons.ProcessFlowNode.prototype.onBeforeRendering=function(){this.$().unbind(this._sMouseEvents,this._handleEvents);if(sap.ui.Device.support.touch){this.$().unbind(this._sMouseTouchEvents,this._handleEvents);}};
sap.suite.ui.commons.ProcessFlowNode.prototype.onAfterRendering=function(){this._sMouseEvents=this._sMouseEvents.concat(' ',this._sMouseTouchEvents);this.$().bind(this._sMouseEvents,jQuery.proxy(this._handleEvents,this));};
sap.suite.ui.commons.ProcessFlowNode.prototype._handleClick=function(e){if(this._getDisplayState()===sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed||this._getDisplayState()===sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused){jQuery.sap.log.info("Event ignored, node in dimmend state.");}else{if(this._parent){if(e.target.id.indexOf("title")>=0&&this.getIsTitleClickable()){this._parent.fireNodeTitlePress(this);}else{this._parent.fireNodePress(this);}this.getParent()._changeNavigationFocus(this.getParent()._getLastNavigationFocusElement(),this);}}if(e&&!e.isPropagationStopped()){e.stopPropagation();}if(e&&!e.isImmediatePropagationStopped()){e.stopImmediatePropagation();}};
sap.suite.ui.commons.ProcessFlowNode.prototype.onclick=function(e){if(e&&!e.isDefaultPrevented()){e.preventDefault();}this._handleClick(e);};
sap.suite.ui.commons.ProcessFlowNode.prototype._handleEvents=function(e){var t=this.$().find('*');var T=this.$().attr('id');var i=this._getFoldedCorner();var s=this.getParent();if(e&&!e.isDefaultPrevented()){e.preventDefault();}if(this.getType()===sap.suite.ui.commons.ProcessFlowNodeType.Aggregated){this._adjustClassesForAggregation(e);}switch(e.type){case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseDown:this.$().removeClass(this._nodeHoverClass).addClass(this._nodeActiveClass);t.removeClass(this._nodeHoverClass).addClass(this._nodeActiveClass);if(i){jQuery('#'+T).removeClass(this._nodeFCHoverClass+' '+this._nodeActiveClass).addClass(this._nodeFCActiveClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeFCIconHoverClass+' '+this._nodeActiveClass).addClass(this._nodeFCActiveClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeFCIconHoverClass+' '+this._nodeActiveClass).addClass(this._nodeFCActiveClass);}break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseUp:if(s.$().hasClass(this._grabbingCursorClass)){s.$().removeClass(this._grabbingCursorClass);}this.$().removeClass(this._nodeActiveClass).addClass(this._nodeHoverClass);t.removeClass(this._nodeActiveClass).addClass(this._nodeHoverClass);if(i){jQuery('#'+T).removeClass(this._nodeHoverClass+' '+this._nodeFCActiveClass).addClass(this._nodeFCHoverClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeHoverClass+' '+this._nodeFCActiveClass).addClass(this._nodeFCIconHoverClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeHoverClass+' '+this._nodeFCActiveClass).addClass(this._nodeFCIconHoverClass);}break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseEnter:if(!s.$().hasClass(this._grabbingCursorClass)){this.$().addClass(this._nodeHoverClass);t.addClass(this._nodeHoverClass);this.$().find(this._nodePlannedClassIdentifier).find("*").addClass(this._nodePlannedClass);if(i){jQuery('#'+T).removeClass(this._nodeHoverClass).addClass(this._nodeFCHoverClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeHoverClass).addClass(this._nodeFCIconHoverClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeHoverClass).addClass(this._nodeFCIconHoverClass);}}break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseLeave:this.$().removeClass(this._nodeActiveClass+' '+this._nodeHoverClass);t.removeClass(this._nodeActiveClass+' '+this._nodeHoverClass);if(i){jQuery('#'+T).removeClass(this._nodeFCActiveClass+' '+this._nodeFCHoverClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeFCActiveClass+' '+this._nodeFCIconHoverClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeFCActiveClass+' '+this._nodeFCIconHoverClass);}if(!s.$().hasClass(this._grabbingCursorClass)){s.$().addClass(this._grabCursorClass);}break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.touchStart:if(sap.ui.Device.support.touch){this.$().addClass(this._nodeActiveClass);t.addClass(this._nodeActiveClass);if(i){jQuery('#'+T).removeClass(this._nodeActiveClass).addClass(this._nodeFCActiveClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeActiveClass).addClass(this._nodeFCActiveClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeActiveClass).addClass(this._nodeFCActiveClass);}}break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.sapTouchStart:this.$().removeClass(this._nodeHoverClass).addClass(this._nodeActiveClass);t.removeClass(this._nodeHoverClass).addClass(this._nodeActiveClass);if(i){jQuery('#'+T).removeClass(this._nodeFCHoverClass+' '+this._nodeActiveClass).addClass(this._nodeFCActiveClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeFCIconHoverClass+' '+this._nodeActiveClass).addClass(this._nodeFCActiveClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeFCIconHoverClass+' '+this._nodeActiveClass).addClass(this._nodeFCActiveClass);}break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.touchEnd:if(sap.ui.Device.support.touch){this.$().removeClass(this._nodeActiveClass+' '+this._nodeHoverClass);t.removeClass(this._nodeActiveClass+' '+this._nodeHoverClass);if(i){jQuery('#'+T).removeClass(this._nodeFCActiveClass+' '+this._nodeFCHoverClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeFCActiveClass+' '+this._nodeFCIconHoverClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeFCActiveClass+' '+this._nodeFCIconHoverClass);}}this._handleClick(e);break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.sapTouchCancel:this.$().removeClass(this._nodeActiveClass).addClass(this._nodeHoverClass);t.removeClass(this._nodeActiveClass).addClass(this._nodeHoverClass);if(i){jQuery('#'+T).removeClass(this._nodeFCActiveClass+' '+this._nodeHoverClass).addClass(this._nodeFCHoverClass);jQuery('div[id^='+T+'][id$=-corner-container]').removeClass(this._nodeFCActiveClass+' '+this._nodeHoverClass).addClass(this._nodeFCIconHoverClass);jQuery('span[id^='+T+'][id$=-corner-icon]').removeClass(this._nodeFCActiveClass+' '+this._nodeHoverClass).addClass(this._nodeFCIconHoverClass);}break;}};
sap.suite.ui.commons.ProcessFlowNode.prototype._setMergedLaneId=function(l){this._mergedLaneId=l;};
sap.suite.ui.commons.ProcessFlowNode.prototype._setParentFlow=function(c){this._parent=c;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getFoldedCornerControl=function(){if(this._foldedCornerControl){this._foldedCornerControl.destroy();}this._foldedCornerControl=new sap.ui.core.Icon({id:this.getId()+"-corner-icon",src:sap.ui.core.IconPool.getIconURI("context-menu","businessSuite"),visible:true});this._foldedCornerControl.addStyleClass("sapUiIconPointer");switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:this._foldedCornerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode1ZoomLevel1");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:this._foldedCornerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode1ZoomLevel2");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:this._foldedCornerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode1ZoomLevel3");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:this._foldedCornerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode1ZoomLevel4");break;}this._foldedCornerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode1");return this._foldedCornerControl;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getHeaderControl=function(){if(this._headerControl){this._headerControl.destroy();}var l=0;var w="";var v=true;var t=this.getTitle();switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:l=3;break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:l=3;break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:l=2;t=this.getTitleAbbreviation();break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:t="";l=0;w="0px";v=false;break;}this._headerControl=new sap.m.Text({id:this.getId()+"-nodeid-anchor-title",text:t,visible:v,wrapping:true,width:w,maxLines:l});if(this.getIsTitleClickable()){this._headerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TitleClickable");}switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:this._headerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TitleZoomLevel1");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:this._headerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TitleZoomLevel2");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:this._headerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TitleZoomLevel3");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:this._headerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TitleZoomLevel4");break;}this._headerControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3Title");return this._headerControl;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getIconControl=function(){if(this._iconControl){this._iconControl.destroy();}var s=null;var v=true;switch(this.getState()){case sap.suite.ui.commons.ProcessFlowNodeState.Positive:s="sap-icon://message-success";break;case sap.suite.ui.commons.ProcessFlowNodeState.Negative:case sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative:s="sap-icon://message-error";break;case sap.suite.ui.commons.ProcessFlowNodeState.Planned:s=null;break;case sap.suite.ui.commons.ProcessFlowNodeState.Neutral:s="sap-icon://process";break;case sap.suite.ui.commons.ProcessFlowNodeState.Critical:s="sap-icon://message-warning";break;}this._iconControl=new sap.ui.core.Icon({id:this.getId()+"-icon",src:s,visible:v});this._iconControl.addStyleClass("sapUiIconPointer");var r=sap.ui.getCore().getConfiguration().getRTL();if(r){this._iconControl.addStyleClass("sapUiIconSuppressMirrorInRTL");}switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:var i="sapSuiteUiCommonsProcessFlowNode3StateIconLeft";if(r){i="sapSuiteUiCommonsProcessFlowNode3StateIconRight";}this._iconControl.addStyleClass(i);break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:this._iconControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateIconCenter");break;}switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:this._iconControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateIconZoomLevel1");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:this._iconControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateIconZoomLevel2");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:this._iconControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateIconZoomLevel3");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:this._iconControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateIconZoomLevel4");break;}this._iconControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateIcon");return this._iconControl;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getStateTextControl=function(){if(this._stateTextControl){this._stateTextControl.destroy();}var l=2;var w="";var v=true;var s=this.getState();var t=(s===sap.suite.ui.commons.ProcessFlowNodeState.Planned)?"":this.getStateText();if(s===sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative&&t.length===0){t="Planned Negative";}switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:l=2;break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:t="";l=0;w="0px";v=false;break;}this._stateTextControl=new sap.m.Text({id:this.getId()+"-stateText",text:t,visible:v,wrapping:true,width:w,maxLines:l});switch(s){case sap.suite.ui.commons.ProcessFlowNodeState.Positive:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StatePositive");break;case sap.suite.ui.commons.ProcessFlowNodeState.Negative:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNodeStateNegative");break;case sap.suite.ui.commons.ProcessFlowNodeState.Planned:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StatePlanned");break;case sap.suite.ui.commons.ProcessFlowNodeState.Neutral:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateNeutral");break;case sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StatePlanned");break;case sap.suite.ui.commons.ProcessFlowNodeState.Critical:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateCritical");break;}switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateTextZoomLevel1");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateTextZoomLevel2");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateTextZoomLevel3");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateTextZoomLevel4");break;}this._stateTextControl.addStyleClass("sapSuiteUiCommonsProcessFlowNode3StateText");return this._stateTextControl;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getZoomLevel=function(){return this._zoomLevel;};
sap.suite.ui.commons.ProcessFlowNode.prototype._setZoomLevel=function(z){this._zoomLevel=z;};
sap.suite.ui.commons.ProcessFlowNode.prototype._setNavigationFocus=function(n){this._navigationFocus=n;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getNavigationFocus=function(){return this._navigationFocus;};
sap.suite.ui.commons.ProcessFlowNode.prototype._setFoldedCorner=function(f){this._foldedCorner=f;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getFoldedCorner=function(){return this._foldedCorner;};
sap.suite.ui.commons.ProcessFlowNode.prototype._setTag=function(n){this._tag=n;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getTag=function(){return this._tag;};
sap.suite.ui.commons.ProcessFlowNode.prototype._setDimmedState=function(){var i=this.getFocused();var I=this.getHighlighted();var b=this.getSelected();if(I||b){throw new Error("Cannot set highlighed or selected node to dimmed state"+this.getNodeId());}this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed;if(i){this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused;}};
sap.suite.ui.commons.ProcessFlowNode.prototype._setRegularState=function(){this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.Regular;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getLane=function(){var p=this.getParent();var l=null;if(p){l=p._getLane(this.getLaneId());}return l;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getDimmed=function(){if(this._displayState===sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed||this._displayState===sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused){return true;}else{return false;}};
sap.suite.ui.commons.ProcessFlowNode.prototype._getAriaText=function(){var p=this.getParents().length;var c=0;if(this._hasChildren()){c=this.getChildren().length;}var l="";var L=this._getLane();if(L){l=L.getText();if(!l){l=this._oResBundle.getText('PF_VALUE_UNDEFINED');}}var C="";var a=this.getTexts();if(a){for(var i in a){if(a[i]){var v=a[i].concat(", ");C=C.concat(v);}}C=C.slice(0,-1);}var t=this.getTitle();if(!t){t=this._oResBundle.getText('PF_VALUE_UNDEFINED');}var s=this.getState();if(!s){s=this._oResBundle.getText('PF_VALUE_UNDEFINED');}var S=this.getStateText();if(this.getState()===sap.suite.ui.commons.ProcessFlowNodeState.Planned){S="";}var A="";if(this.getType()===sap.suite.ui.commons.ProcessFlowNodeType.Aggregated){A=this._oResBundle.getText("PF_ARIA_TYPE");}var b=this._oResBundle.getText('PF_ARIA_NODE',[t,s,S,l,C,p,c,A]);return b;};
sap.suite.ui.commons.ProcessFlowNode.prototype._getDisplayState=function(){var i=this.getFocused();var I=this.getHighlighted();var b=this.getSelected();if(this._displayState===sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed||this._displayState===sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused){return this._displayState;}if(b){if(I){if(i){this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.SelectedHighlightedFocused;}else{this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.SelectedHighlighted;}}else if(i){this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.SelectedFocused;}else{this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.Selected;}}else if(i&&I){this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.HighlightedFocused;}else if(i){this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.RegularFocused;}else if(I){this._displayState=sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted;}else{if(this._displayState==sap.suite.ui.commons.ProcessFlowDisplayState.HighlightedFocused||this._displayState==sap.suite.ui.commons.ProcessFlowDisplayState.RegularFocused||this._displayState==sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted||this._displayState==sap.suite.ui.commons.ProcessFlowDisplayState.Selected){this._setRegularState();}}return this._displayState;};
sap.suite.ui.commons.ProcessFlowNode.prototype._createTextControlInternal=function(t,a,c){if(c){c.destroy();}var l=2;var w="";var v=true;var T=a;switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:l=2;break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:l=0;w="0px";v=false;break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:T="";l=0;w="0px";v=false;break;}if(this.getState){c=new sap.m.Text({id:this.getId()+t,text:T,visible:v,wrapping:true,width:w,maxLines:l});}return c;};
sap.suite.ui.commons.ProcessFlowNode.prototype._createText1Control=function(){var t=this.getTexts();if(t&&t.length>0){t=t[0];}this._text1Control=this._createTextControlInternal("-text1-control",t,this._text1Control);switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:this._text1Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextWithGapZoomLevel1");this._text1Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel1");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:this._text1Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextWithGapZoomLevel2");this._text1Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel2");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:this._text1Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel3");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:this._text1Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel4");break;}this._text1Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3Text");return this._text1Control;};
sap.suite.ui.commons.ProcessFlowNode.prototype._createText2Control=function(){var t=this.getTexts();if(t&&t.length>1){t=t[1];}else{t="";}this._text2Control=this._createTextControlInternal("-text2-control",t,this._text2Control);switch(this._getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:this._text2Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel1");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:this._text2Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel2");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:this._text2Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel3");break;case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:this._text2Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3TextZoomLevel4");break;}this._text2Control.addStyleClass("sapSuiteUiCommonsProcessFlowNode3Text");return this._text2Control;};
sap.suite.ui.commons.ProcessFlowNode.prototype._adjustClassesForAggregation=function(e){var f=[sap.suite.ui.commons.ProcessFlowDisplayState.RegularFocused,sap.suite.ui.commons.ProcessFlowDisplayState.HighlightedFocused,sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused];var d=[sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused,sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed];switch(e.type){case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseDown:case sap.suite.ui.commons.ProcessFlow._mouseEvents.touchStart:case sap.suite.ui.commons.ProcessFlow._mouseEvents.sapTouchStart:a(this);break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseUp:r(this);break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.sapTouchCancel:case sap.suite.ui.commons.ProcessFlow._mouseEvents.touchEnd:r(this);c(this);break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseEnter:b(this);break;case sap.suite.ui.commons.ProcessFlow._mouseEvents.mouseLeave:r(this);c(this);break;}function a(t){if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){if((jQuery.inArray(t._getDisplayState(),d))>=0){t.$().removeClass(t._nodeAggregatedDimmedHoveredClassZoomLevel4).addClass(t._nodeAggregatedDimmedPressedClassZoomLevel4);}else{t.$().removeClass(t._nodeAggregatedClassZoomLevel4).removeClass(t._nodeAggregatedHoveredClassZoomLevel4).addClass(t._nodeAggregatedPressedClassZoomLevel4);}}else{if((jQuery.inArray(t._getDisplayState(),d))>=0){t.$().removeClass(t._nodeAggregatedDimmedHoveredClass).addClass(t._nodeAggregatedDimmedPressedClass);}else{t.$().removeClass(t._nodeAggregatedClass).removeClass(t._nodeAggregatedHoveredClass).addClass(t._nodeAggregatedPressedClass);}}}function r(t){if((jQuery.inArray(t._getDisplayState(),f))>=0&&(t.$().hasClass(t._nodeAggregatedPressedClass)||t.$().hasClass(t._nodeAggregatedPressedClassZoomLevel4))){if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){t.$().removeClass(t._nodeAggregatedPressedClassZoomLevel4).addClass(t._nodeAggregatedFocusedClassZoomLevel4);}else{t.$().removeClass(t._nodeAggregatedPressedClass).addClass(t._nodeAggregatedFocusedClass);}}else if(t.$().hasClass(t._nodeAggregatedDimmedPressedClass)||t.$().hasClass(t._nodeAggregatedDimmedPressedClassZoomLevel4)){if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){t.$().removeClass(t._nodeAggregatedDimmedPressedClassZoomLevel4).addClass(t._nodeAggregatedDimmedHoveredClassZoomLevel4);}else{t.$().removeClass(t._nodeAggregatedDimmedPressedClass).addClass(t._nodeAggregatedDimmedHoveredClass);}}else if(t.$().hasClass(t._nodeAggregatedPressedClass)||t.$().hasClass(t._nodeAggregatedPressedClassZoomLevel4)){if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){t.$().removeClass(t._nodeAggregatedPressedClassZoomLevel4).addClass(t._nodeAggregatedClassZoomLevel4);}else{t.$().removeClass(t._nodeAggregatedPressedClass).addClass(t._nodeAggregatedClass);}}}function b(t){if((jQuery.inArray(t._getDisplayState(),d))>=0){if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){t.$().removeClass(t._nodeAggregatedDimmedClassZoomLevel4).addClass(t._nodeAggregatedDimmedHoveredClassZoomLevel4);}else{t.$().removeClass(t._nodeAggregatedDimmedClass).addClass(t._nodeAggregatedDimmedHoveredClass);}}else{if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){t.$().addClass(t._nodeAggregatedHoveredClassZoomLevel4);}else{t.$().addClass(t._nodeAggregatedHoveredClass);}}}function c(t){if((jQuery.inArray(t._getDisplayState(),d))>=0){if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){t.$().removeClass(t._nodeAggregatedDimmedHoveredClassZoomLevel4).addClass(t._nodeAggregatedDimmedClassZoomLevel4);}else{t.$().removeClass(t._nodeAggregatedDimmedHoveredClass).addClass(t._nodeAggregatedDimmedClass);}}else{if(t._getZoomLevel()===sap.suite.ui.commons.ProcessFlowZoomLevel.Four){t.$().removeClass(t._nodeAggregatedHoveredClassZoomLevel4);}else{t.$().removeClass(t._nodeAggregatedHoveredClass);}}}};
sap.suite.ui.commons.ProcessFlowNode.prototype._hasChildren=function(){var c=this.getChildren();if(c&&c.length>0){return true;}return false;};
sap.suite.ui.commons.ProcessFlowNode.prototype._hasChildrenWithNodeId=function(c){var C=this.getChildren();if(C&&C.length>0){for(var i=0;i<C.length;i++){if((typeof C[i]==='object'&&C[i].nodeId===c)||C[i]===c){return true;}}}return false;};
sap.suite.ui.commons.ProcessFlowNode.prototype.getLaneId=function(){if(this._mergedLaneId){return this._mergedLaneId;}else{return this.getProperty("laneId");}};
