/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
jQuery.sap.declare("sap.ushell.ui.launchpad.ViewPortContainer");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ushell.ui.launchpad.ViewPortContainer",{metadata:{library:"sap.ushell",properties:{"height":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"defaultState":{type:"sap.ushell.ui.launchpad.ViewPortState",group:"Appearance",defaultValue:sap.ushell.ui.launchpad.ViewPortState.Center}},aggregations:{"leftViewPort":{type:"sap.ui.core.Control",multiple:true,singularName:"leftViewPort"},"centerViewPort":{type:"sap.ui.core.Control",multiple:true,singularName:"centerViewPort"},"rightViewPort":{type:"sap.ui.core.Control",multiple:true,singularName:"rightViewPort"}},associations:{"initialCenterViewPort":{type:"sap.ui.core.Control",multiple:false},"initialRightViewPort":{type:"sap.ui.core.Control",multiple:false},"initialLeftViewPort":{type:"sap.ui.core.Control",multiple:false}},events:{"navigate":{},"afterSwitchState":{parameters:{"from":{type:"sap.ui.core.Control"},"to":{type:"sap.ui.core.Control"}}},"afterSwitchStateAnimationFinished":{parameters:{"from":{type:"sap.ui.core.Control"},"to":{type:"sap.ui.core.Control"}}},"afterNavigate":{parameters:{"from":{type:"sap.ui.core.Control"},"to":{type:"sap.ui.core.Control"}}}}}});sap.ushell.ui.launchpad.ViewPortContainer.M_EVENTS={'navigate':'navigate','afterSwitchState':'afterSwitchState','afterSwitchStateAnimationFinished':'afterSwitchStateAnimationFinished','afterNavigate':'afterNavigate'};(function(){"use strict";jQuery.sap.require("sap.ushell.resources");jQuery.sap.declare("sap.ushell.ui.launchpad.ViewPortContainer");jQuery.sap.require('sap.ui.core.theming.Parameters');sap.ushell.ui.launchpad.ViewPortContainer.prototype.init=function(){this.bShiftCenterTransition=true;this.bShiftCenterTransitionEnabled=false;var c=sap.ui.getCore().getConfiguration();this.bIsRTL=!jQuery.isEmptyObject(c)&&c.getRTL?c.getRTL():false;this._oViewPortsNavigationHistory={leftViewPort:{visitedControls:[],indexOfCurrentlyDisplayedControl:null},centerViewPort:{visitedControls:[],indexOfCurrentlyDisplayedControl:null},rightViewPort:{visitedControls:[],indexOfCurrentlyDisplayedControl:null}};this._states={Left:{translateX:'',visibleViewPortsData:[{viewPortId:'leftViewPort',className:"leftClass",isActive:true}]},Center:{translateX:'',visibleViewPortsData:[{viewPortId:'centerViewPort',className:"centerClass",isActive:true}]},Right:{translateX:'',visibleViewPortsData:[{viewPortId:'rightViewPort',className:"rightClass",isActive:true}]},LeftCenter:{translateX:'',visibleViewPortsData:[{viewPortId:'leftViewPort',className:"front",isActive:true},{viewPortId:'centerViewPort',className:"backLeft",isActive:false}]},CenterLeft:{translateX:'',visibleViewPortsData:[{viewPortId:'centerViewPort',className:"frontLeft",isActive:true},{viewPortId:'leftViewPort',className:"back",isActive:false}]},RightCenter:{translateX:'',visibleViewPortsData:[{viewPortId:'rightViewPort',className:"front",isActive:true},{viewPortId:'centerViewPort',className:"backRight",isActive:false}]},CenterRight:{translateX:'',visibleViewPortsData:[{viewPortId:'centerViewPort',className:"frontRight",isActive:true},{viewPortId:'rightViewPort',className:"back",isActive:false}]}};sap.ui.Device.media.attachHandler(this._handleSizeChange.bind(this),null,sap.ui.Device.media.RANGESETS.SAP_STANDARD);sap.ui.Device.orientation.attachHandler(this._handleSizeChange,this);jQuery(window).bind("resize",function(){this._handleSizeChange();}.bind(this));};sap.ushell.ui.launchpad.ViewPortContainer.prototype.removeCenterViewPort=function(c,s){this.removeAggregation('centerViewPort',c,s);this._popFromViewPortNavigationHistory('centerViewPort',c);};sap.ushell.ui.launchpad.ViewPortContainer.prototype._popFromViewPortNavigationHistory=function(v,c){var n=this._oViewPortsNavigationHistory[v],V=n?n.visitedControls:[],i=V.indexOf(c);if(V.length>0){n.visitedControls=V.slice(i+1,n.visitedControls.length);n.indexOfCurrentlyDisplayedControl=n.visitedControls.length-1;}};sap.ushell.ui.launchpad.ViewPortContainer.prototype.addCenterViewPort=function(c){jQuery.sap.measure.start("FLP:ViewPortContainer.addCenterViewPort","addCenterViewPort","FLP");var i=this._isInCenterViewPort(c);c.toggleStyleClass("hidden",true);c.addStyleClass("sapUshellViewPortItemSlideFrom");if(!i){this.addAggregation('centerViewPort',c,true);}if(this.domRef&&!i){this.getRenderer().renderViewPortPart(c,this.domRef,'centerViewPort');}jQuery.sap.measure.end("FLP:ViewPortContainer.addCenterViewPort");};sap.ushell.ui.launchpad.ViewPortContainer.prototype.addLeftViewPort=function(c){c.toggleStyleClass("hidden",true);if(this.domRef){this.getRenderer().renderViewPortPart(c,this.domRef,'leftViewPort');}this.addAggregation('leftViewPort',c,true);};sap.ushell.ui.launchpad.ViewPortContainer.prototype.addRightViewPort=function(c){c.toggleStyleClass("hidden",true);if(this.domRef){this.getRenderer().renderViewPortPart(c,this.domRef,'rightViewPort');}this.addAggregation('rightViewPort',c,true);};sap.ushell.ui.launchpad.ViewPortContainer.prototype.setInitialCenterViewPort=function(c){var C=this._getCurrentlyDispalyedControl('centerViewPort'),i=this._isInCenterViewPort(c);c.addStyleClass("sapUshellViewPortItemSlideFrom");if(this.domRef&&!i){this.getRenderer().renderViewPortPart(c,this.domRef,'centerViewPort');}this._setCurrentlyDisplayedControl('centerViewPort',c);if(!i){this.addAggregation('centerViewPort',c,true);}this.setAssociation('initialCenterViewPort',c,true);if(C&&C!==c.getId()){this.fireAfterNavigate({fromId:C,from:sap.ui.getCore().byId(C),to:sap.ui.getCore().byId(c),toId:c.getId()});}};sap.ushell.ui.launchpad.ViewPortContainer.prototype.setInitialLeftViewPort=function(c){var C=this._getCurrentlyDispalyedControl('leftViewPort');this.addAggregation('leftViewPort',c,true);this._setCurrentlyDisplayedControl('leftViewPort',c);if(this.domRef){this.getRenderer().renderViewPortPart(c,this.domRef,'leftViewPort');}this.setAssociation('initialLeftViewPort',c,true);if(C&&C!==c.getId()){this.fireAfterNavigate({fromId:C,from:sap.ui.getCore().byId(C),to:sap.ui.getCore().byId(c),toId:c.getId()});}};sap.ushell.ui.launchpad.ViewPortContainer.prototype.setInitialRightViewPort=function(c){var C=this._getCurrentlyDispalyedControl('rightViewPort');this.addAggregation('rightViewPort',c,true);this._setCurrentlyDisplayedControl('rightViewPort',c);if(this.domRef){this.getRenderer().renderViewPortPart(c,this.domRef,'rightViewPort');}this.setAssociation('initialRightViewPort',c,true);if(C&&C!==c.getId()){this.fireAfterNavigate({fromId:C,from:sap.ui.getCore().byId(C),to:sap.ui.getCore().byId(c),toId:c.getId()});}};sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInViewPort=function(v,c){var V=this.getAggregation(v),i=V?V.indexOf(c)>-1:false;return i;};sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInCenterViewPort=function(c){return this._isInViewPort('centerViewPort',c);};sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInLeftViewPort=function(c){return this._isInViewPort('leftViewPort',c);};sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInRightViewPort=function(c){return this._isInViewPort('rightViewPort',c);};sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentCenterPage=function(){return this._getCurrentlyDispalyedControl('centerViewPort');};sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentRightPage=function(){return this._getCurrentlyDispalyedControl('rightViewPort');};sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentLeftPage=function(){return this._getCurrentlyDispalyedControl('leftViewPort');};sap.ushell.ui.launchpad.ViewPortContainer.prototype.navTo=function(v,c,t,d,T){jQuery.sap.measure.start("FLP:ShellController.navTo","navTo","FLP");var C=this._getCurrentlyDispalyedControl(v),V=this.getAggregation(v),b=V.some(function(a,i){if(a.getId()===c){return true;}});if(!b){jQuery.sap.log.error("ViewPort Container Error: Couldn't find target control");}else if(!C||C!==c){var o=sap.ui.getCore().byId(c);o.toggleStyleClass("hidden",false);var O=function(){this.fireAfterNavigate({toId:c,to:c?sap.ui.getCore().byId(c):null,fromId:C,from:C?sap.ui.getCore().byId(C):null});}.bind(this);this._setCurrentlyDisplayedControl(v,o,t,O);}jQuery.sap.measure.end("FLP:ShellController.navTo");};sap.ushell.ui.launchpad.ViewPortContainer.prototype._getCurrentlyDispalyedControl=function(v){var n=this._oViewPortsNavigationHistory[v];return n.visitedControls[n.indexOfCurrentlyDisplayedControl];};sap.ushell.ui.launchpad.ViewPortContainer.prototype._setCurrentlyDisplayedControl=function(v,c,t,o){jQuery.sap.measure.start("FLP:ViewPortContainer._setCurrentlyDisplayedControl","_setCurrentlyDisplayedControl","FLP");var n=this._oViewPortsNavigationHistory[v],V=n.visitedControls,C=this._getCurrentlyDispalyedControl(v),a=C?sap.ui.getCore().byId(C):null,T=(v==='centerViewPort'&&t)?t:'show';V.push(c.getId());n.indexOfCurrentlyDisplayedControl=jQuery.isNumeric(n.indexOfCurrentlyDisplayedControl)?n.indexOfCurrentlyDisplayedControl+1:0;this._handleViewPortTransition(v,T,c,a,o);if(v==="rightViewPort"&&T==="show"){this._setStateVisibility("rightViewPort","start");}this._updateTranslateXvalues();jQuery.sap.measure.end("FLP:ViewPortContainer._setCurrentlyDisplayedControl");};sap.ushell.ui.launchpad.ViewPortContainer.prototype._handleSizeChange=function(){this._updateTranslateXvalues();var t=this._getTranslateXValue(this.sCurrentState),c=this._getTranslateXValue("Center"),f=c.replace("-","");if(this.getDomRef()){jQuery(this.getDomRef()).css(this.bIsRTL?'right':'left',t);}var p=this.bIsRTL?'right':'left';if(jQuery(window).width()<600){jQuery(".sapUshellViewPortWrapper").css(p,f);}else{jQuery(".sapUshellViewPortWrapper").css(p,'');}this.fixViewportScrollbars();};sap.ushell.ui.launchpad.ViewPortContainer.prototype._applyTransitionToViewPort=function(j,t,T){var d=jQuery.Deferred();if(!j||t===undefined||T===undefined){d.resolve();return;}var o={'transform':"translateX("+T+") translateY(0) translateZ(0)",'transition':t?"transform "+t+"s":"initial"};if(t!==0){j.on('transitionend',function(e){if(e.target!==j.get(0)){return;}j.off('transitionend');d.resolve();});}else{d.resolve();}o.offsetHeight;j.css(o);if(sap.ui.Device.browser.internet_explorer){setTimeout(function(){j.trigger('transitionend');},300);}return d.promise();};sap.ushell.ui.launchpad.ViewPortContainer.prototype._updateTranslateXvalues=function(){var t=sap.ui.core.theming.Parameters,l,r;if(window.matchMedia('(min-width: 1920px)').matches){l=t.get('sapUshellLeftViewPortWidthLarge');r=t.get('sapUshellRightViewPortWidthXXXLarge');}else if(window.matchMedia('(min-width: 1600px)').matches){l=t.get('sapUshellLeftViewPortWidthMedium');r=t.get('sapUshellRightViewPortWidthXXLarge');}else if(window.matchMedia('(min-width: 1440px)').matches){l=t.get('sapUshellLeftViewPortWidthMedium');r=t.get('sapUshellRightViewPortWidthXLarge');}else if(window.matchMedia('(min-width: 1280px)').matches){l=t.get('sapUshellLeftViewPortWidthMedium');r=t.get('sapUshellRightViewPortWidthLarge');}else if(window.matchMedia('(min-width: 1024px)').matches){l=t.get('sapUshellLeftViewPortWidthSmall');r=t.get('sapUshellRightViewPortWidthMedium');}else if(window.matchMedia('(min-width: 601px)').matches){l=t.get('sapUshellLeftViewPortWidthSmall');r=t.get('sapUshellRightViewPortWidthSmall');}else if(window.matchMedia('(max-width : 600px)').matches){l=jQuery(window).width()/parseFloat(jQuery("body").css("font-size"));r=jQuery(window).width()/parseFloat(jQuery("body").css("font-size"));}this._updateStatesWithTranslateXvalues(l,r);};sap.ushell.ui.launchpad.ViewPortContainer.prototype._updateStatesWithTranslateXvalues=function(l,r){var t=0,L;if(l!==null&&r!==null){this._states.Center.translateX='-'+parseFloat(l)+'rem';this._states.LeftCenter.translateX="0";t=-1*(parseFloat(l)+parseFloat(r));this._states.RightCenter.translateX=t.toString()+'rem';L=this._calculateRightViewPortLeftPosotion();jQuery(".sapUshellViewPortRight").css("left",L);}};sap.ushell.ui.launchpad.ViewPortContainer.prototype._calculateRightViewPortLeftPosotion=function(){var l=0,w,L,b=jQuery(".sapUshellViewPortLeft").hasClass("sapUshellShellHidden");w=jQuery(window).width();jQuery(".sapUshellViewPortLeft").removeClass("sapUshellShellHidden");L=jQuery(".sapUshellViewPortLeft").width();if(b){jQuery(".sapUshellViewPortLeft").addClass("sapUshellShellHidden");}l=w+L;return l;};sap.ushell.ui.launchpad.ViewPortContainer.prototype._handleViewPortTransition=function(v,t,T,c,o){var a=this;if(v!=='centerViewPort'){return;}if(!c){t='show';}switch(t){case'show':T.toggleStyleClass("hidden",false);if(c){c.toggleStyleClass("hidden");}if(o){o();}break;case'slide':T.toggleStyleClass("hidden",false);var j=jQuery(T);a._applyTransitionToViewPort(j,0.4,"-100%").then(function(){return a._applyTransitionToViewPort(j,0,0);}).then(function(){c.toggleStyleClass("hidden",true);if(o){o();}});break;case'slideBack':var b=jQuery('#'+this.getCurrentCenterPage());a._applyTransitionToViewPort(b,0.7,"100%").then(function(){T.toggleStyleClass("hidden",false);}).then(function(){if(c){return a._applyTransitionToViewPort(b,0,0);}}).then(function(){c.toggleStyleClass("hidden",true);}).done(function(){c.toggleStyleClass("hidden",true);if(o){o();}});break;case'fade':var j=jQuery(T);if(c){var d=jQuery(c.getDomRef());d.fadeToggle(250);}j.fadeIn(500,o?o:null);break;}};sap.ushell.ui.launchpad.ViewPortContainer.prototype.onAfterRendering=function(){this.domRef=this.getDomRef();if(this.sCurrentState.indexOf("Center")==0){var r=this._states["Right"].visibleViewPortsData[0].viewPortId;jQuery(document.getElementById(r)).css("display","none");}this._handleSizeChange;};sap.ushell.ui.launchpad.ViewPortContainer.prototype.onBeforeRendering=function(){this._updateTranslateXvalues();};sap.ushell.ui.launchpad.ViewPortContainer.prototype.setDefaultState=function(s){this.setCurrentState(s);this.setProperty("defaultState",s,true);};sap.ushell.ui.launchpad.ViewPortContainer.prototype.endOfAnimationEventHandler=function(){var t=this._states[this.sTargetState].translateX,j=jQuery(this.domRef);this._setStateVisibility(this.sTargetState,"end");return this._applyTransitionToViewPort(j,0,0).then(function(){j.css(this.bIsRTL?'right':'left',t);}.bind(this));};sap.ushell.ui.launchpad.ViewPortContainer.prototype.switchState=function(s){var a,t=[],f=[],b;this.sTargetState=s;if(s!==this.sCurrentState){this._setStateVisibility(s,"start");var T=this._getTranslateXValue(s),v=this._states[this.sCurrentState].visibleViewPortsData,V=this._states[s].visibleViewPortsData,j=jQuery(this.domRef),c=this;if(s.indexOf("Right")==0){var r=V[0].viewPortId;jQuery(document.getElementById(r)).css("display","block");}v.forEach(function(e){j.find('#'+e.viewPortId).removeClass(e.className);});if(this.bIsRTL){T=(-1*parseInt(T,10)).toString()+"rem";}this._handleCenterViewPortAnimation(s);this._applyTransitionToViewPort(j,0.47,T).then(function(){return c.endOfAnimationEventHandler();}).then(function(){for(b=0;b<c._states[c.sCurrentState].visibleViewPortsData.length;b++){f.push(c._states[c.sCurrentState].visibleViewPortsData[b].viewPortId);}for(b=0;b<c._states[s].visibleViewPortsData.length;b++){t.push(c._states[s].visibleViewPortsData[b].viewPortId);}}).then(function(){var e=0,k;if(c.sCurrentState.indexOf("Center")==0){var r=c._states["Right"].visibleViewPortsData[0].viewPortId;jQuery(document.getElementById(r)).css("display","none");}for(k=0;k<f.length;k++){a=c.getAggregation(f[k]);for(e=0;e<a.length;e++){if(a[e].onViewStateHide){a[e].onViewStateHide();}}}c.fixViewportScrollbars();for(k=0;k<t.length;k++){a=c.getAggregation(t[k]);for(e=0;e<a.length;e++){if(a[e].onViewStateShow){a[e].onViewStateShow();}}}V.forEach(function(l){j.find('#'+l.viewPortId).addClass(l.className);});c.fireAfterSwitchStateAnimationFinished({to:s,from:c.sCurrentState});});jQuery('#'+v[0].viewPortId).removeClass("active");var S=function(){this.switchState('Center');}.bind(this);var d=function(e){var k=parseInt(window.getComputedStyle(e.currentTarget).width,10);if(e.offsetX>k){this.switchState('Center');}}.bind(this);var g=jQuery(this.domRef).find('.sapUshellViewPortWrapper');var h=jQuery(this.domRef).find('.sapUshellViewPortLeft');var i=jQuery(this.domRef).find('.sapUshellViewPortCursorPointerArea');if(s!=='Center'){if(s==='LeftCenter'){i.on('click',S);}else if(s==='RightCenter'){g.on('click',S);g.addClass('sapUshellViewPortWrapperClickable');}h.on('click',d);}else{if(this.sCurrentState==='LeftCenter'){i.off('click',d);}else if(this.sCurrentState==='RightCenter'){g.off('click',S);g.removeClass('sapUshellViewPortWrapperClickable');}h.off('click',d);}this.setCurrentState(s);}};sap.ushell.ui.launchpad.ViewPortContainer.prototype._setStateVisibility=function(s,t){var e=["leftViewPort","rightViewPort"],v;v=s!=="Center";if((t==="start"&&v)||(t==="end"&&!v)){for(var i=0;i<e.length;i++){jQuery("#"+e[i]).toggleClass("sapUshellShellHidden",!v);}}};sap.ushell.ui.launchpad.ViewPortContainer.prototype.fixViewportScrollbars=function(){var a=this.getCurrentState(),v=this._states[a].visibleViewPortsData;jQuery('#'+v[0].viewPortId).css("height","100%");if(v[0].viewPortId==="leftViewPort"){if(this.bIsRTL){var p=window.innerWidth-jQuery("#leftViewPort").width();jQuery("#leftViewPort").css("padding-left",p);jQuery("#viewPortCursorPointerArea").css("width",p);jQuery("#viewPortCursorPointerArea").css("left","0");}else{var b=window.innerWidth-jQuery("#leftViewPort").width();jQuery("#leftViewPort").css("padding-right",b);jQuery("#viewPortCursorPointerArea").css("width",b);jQuery("#viewPortCursorPointerArea").css("right","0");}}jQuery('#'+v[0].viewPortId).addClass("active");};sap.ushell.ui.launchpad.ViewPortContainer.prototype.setCurrentState=function(s){var f=this.sCurrentState;this.sCurrentState=s;this.fireAfterSwitchState({to:s,from:f});};sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentState=function(){return this.sCurrentState;};sap.ushell.ui.launchpad.ViewPortContainer.prototype.getViewPortControl=function(v,d){var V=this.getAggregation(v),i;if(V){for(i=0;i<V.length;i++){if(V[i]&&(V[i].getId()===d)){return V[i];}}}return null;};sap.ushell.ui.launchpad.ViewPortContainer.prototype.getViewPort=function(p){var P=this.getCenterViewPort(),i;for(i=0;i<P.length;i++){if(P[i]&&(P[i].getId()===p)){return P[i];}}return null;};sap.ushell.ui.launchpad.ViewPortContainer.prototype._handleCenterViewPortAnimation=function(n){var m=this.getModel();if(m){var a=m.getProperty('/animationMode');var a=a||'full';if(a!=='full'){return;}}var c=this._getCenterViewPortJQueryObject(),s=this._shiftCenterTransition();if(this.sCurrentState==="Center"){if(n==="RightCenter"){if(s===true){c.addClass('sapUshellScaledShiftedCenterWhenInRightViewPort');}else{c.addClass('sapUshellScaledCenterWhenInRightViewPort');}}else if(n==="LeftCenter"){c.addClass('sapUshellScaledCenterWhenInLeftViewPort');}}else if(n==="Center"){if(this.sCurrentState==="RightCenter"){c.removeClass('sapUshellScaledCenterWhenInRightViewPort');c.removeClass('sapUshellScaledShiftedCenterWhenInRightViewPort');}else if(this.sCurrentState==="LeftCenter"){c.removeClass('sapUshellScaledCenterWhenInLeftViewPort');}}else if((this.sCurrentState==="LeftCenter")&&(n==="RightCenter")){if(s===true){c.addClass('sapUshellScaledShiftedCenterWhenInRightViewPort');}else{c.addClass('sapUshellScaledCenterWhenInRightViewPort');}c.removeClass('sapUshellScaledCenterWhenInLeftViewPort');}else if((this.sCurrentState==="RightCenter")&&(n==="LeftCenter")){c.addClass('sapUshellScaledCenterWhenInLeftViewPort');c.removeClass('sapUshellScaledCenterWhenInRightViewPort');c.removeClass('sapUshellScaledShiftedCenterWhenInRightViewPort');}};sap.ushell.ui.launchpad.ViewPortContainer.prototype.shiftCenterTransitionEnabled=function(e){this.bShiftCenterTransitionEnabled=e;};sap.ushell.ui.launchpad.ViewPortContainer.prototype.shiftCenterTransition=function(s){this.bShiftCenterTransition=s;};sap.ushell.ui.launchpad.ViewPortContainer.prototype._shiftCenterTransition=function(){return sap.ushell.Container.getService("Notifications").isEnabled()&&this.bShiftCenterTransitionEnabled&&this.bShiftCenterTransition;};sap.ushell.ui.launchpad.ViewPortContainer.prototype._getCenterViewPortJQueryObject=function(){var j=jQuery(this.domRef),c=this._states.Center.visibleViewPortsData[0].viewPortId,a=j.find('#'+c);return a;};sap.ushell.ui.launchpad.ViewPortContainer.prototype._getTranslateXValue=function(t,g){var T=this._states[t].translateX,c,i,C;if(g!==undefined){c=this._states[g].translateX;}else{c=this._states[this.sCurrentState].translateX;}C=parseInt(c,10);i=parseInt(T,10);if(!g&&(t===this.sCurrentState)){return T;}return(i-C).toString()+"rem";};sap.ushell.ui.launchpad.ViewPortContainer.transitions=sap.ushell.ui.launchpad.ViewPortContainer.transitions||{};}());
