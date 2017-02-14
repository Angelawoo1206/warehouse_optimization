(function(){"use strict";jQuery.sap.declare("sap.ovp.ui.UIActions");sap.ovp.ui.UIActions=function(c){if(!c||!c.rootSelector||!c.containerSelector||!c.draggableSelector){throw new Error("No configuration object to initialize User Interaction module.");}this.captureStart=null;this.captureMove=null;this.captureEnd=null;this.clickCallback=null;this.clickEvent=null;this.clickHandler=null;this.clone=null;this.cloneClass=null;this.container=null;this.contextMenuEvent=null;this.debug=false;this.dragMoveCallback=null;this.dragAndScrollDuration=null;this.dragAndScrollTimer=null;this.draggable=null;this.placeHolderClass=null;this.draggableSelector=null;this.doubleTapCallback=null;this.doubleTapDelay=null;this.element=null;this.swapTargetElement=null;this.endX=null;this.endY=null;this.isTouch=null;this.lastElement=null;this.lastTapTime=null;this.lockMode=null;this.log=null;this.mode=null;this.mouseDownEvent=null;this.mouseMoveEvent=null;this.mouseUpEvent=null;this.moveTolerance=null;this.moveX=null;this.moveY=null;this.noop=null;this.preventClickFlag=false;this.preventClickTimeoutId=null;this.scrollContainer=null;this.scrollContainerSelector=null;this.scrollEvent=null;this.scrollTimer=null;this.startX=null;this.startY=null;this.switchModeDelay=null;this.tapsNumber=null;this.timer=null;this.scrollHandler=null;this.touchCancelEvent=null;this.dragStartCallback=null;this.dragEndCallback=null;this.endCallback=null;this.touchEndEvent=null;this.touchMoveEvent=null;this.beforeDragCallback=null;this.touchStartEvent=null;this.wrapper=null;this.wrapperRect=null;this.scrollEdge=100;this.resizeStartCallback=null;this.resizeMoveCallback=null;this.resizeEndCallback=null;this.isResize=null;this.resizeHandleDistance=null;this.layoutDetails=null;this.init=function(c){this.startX=-1;this.startY=-1;this.moveX=-1;this.moveY=-1;this.endX=-1;this.endY=-1;this.resizeHandleDistance=16;this.isResize=false;this.noop=function(){};this.isTouch=c.isTouch?!!c.isTouch:false;this.container=document.querySelector(c.containerSelector);this.scrollContainerSelector=c.scrollContainerSelector||c.containerSelector;this.switchModeDelay=c.switchModeDelay||1500;this.dragAndScrollDuration=c.dragAndScrollDuration||230;this.moveTolerance=c.moveTolerance===0?0:c.moveTolerance||10;this.draggableSelector=c.draggableSelector;this.mode='normal';this.debug=c.debug||false;this.root=document.querySelector(c.rootSelector);this.tapsNumber=0;this.lastTapTime=0;this.log=this.debug?this.logToConsole:this.noop;this.lockMode=false;this.placeHolderClass=c.placeHolderClass||"";this.cloneClass=c.cloneClass||"";this.wrapper=c.wrapperSelector?document.querySelector(c.wrapperSelector):this.container.parentNode;this.clickCallback=typeof c.clickCallback==='function'?c.clickCallback:this.noop;this.beforeDragCallback=typeof c.beforeDragCallback==='function'?c.beforeDragCallback:this.noop;this.doubleTapCallback=typeof c.doubleTapCallback==='function'?c.doubleTapCallback:this.noop;this.dragEndCallback=typeof c.dragEndCallback==='function'?c.dragEndCallback:this.noop;this.endCallback=typeof c.endCallback==='function'?c.endCallback:this.noop;this.dragStartCallback=typeof c.dragStartCallback==='function'?c.dragStartCallback:this.noop;this.dragMoveCallback=typeof c.dragMoveCallback==='function'?c.dragMoveCallback:this.noop;this.doubleTapDelay=c.doubleTapDelay||500;this.wrapperRect=this.wrapper.getBoundingClientRect();this.scrollEvent='scroll';this.touchStartEvent='touchstart';this.touchMoveEvent='touchmove';this.touchEndEvent='touchend';this.mouseDownEvent='mousedown';this.mouseMoveEvent='mousemove';this.mouseUpEvent='mouseup';this.contextMenuEvent='contextmenu';this.touchCancelEvent='touchcancel';this.clickEvent='click';this.layoutDetails=c.layout?c.layout.dashboardLayoutUtil:null;this.resizeStartCallback=typeof c.resizeStartCallback==='function'?c.resizeStartCallback:this.noop;this.resizeMoveCallback=typeof c.resizeMoveCallback==='function'?c.resizeMoveCallback:this.noop;this.resizeEndCallback=typeof c.resizeEndCallback==='function'?c.resizeEndCallback:this.noop;if(this.wrapper){jQuery(this.wrapper).css({"position":"relative","top":0,"left":0,"right":0,"bottom":0,"-webkit-transform":"translateZ(0)","transform":"translateZ(0)"});}};this.forEach=function(s,a){return Array.prototype.forEach.call(s,a);};this.indexOf=function(s,i){return Array.prototype.indexOf.call(s,i);};this.insertBefore=function(s,i,r){var a,b,d;d=Array.prototype.splice;a=this.indexOf(s,i);b=this.indexOf(s,r);d.call(s,b-(a<b?1:0),0,d.call(s,a,1)[0]);};this.logToConsole=function(){window.console.log.apply(console,arguments);};this.getDraggableElement=function(a){var e;this.draggable=jQuery(this.draggableSelector,this.container);while(typeof e==='undefined'&&a!==this.root){if(this.indexOf(this.draggable,a)>=0){e=a;}a=a.parentNode;}return e;};this.captureStart=function(e){var a;if(e.type==='touchstart'&&e.touches.length===1){a=e.touches[0];}else if(e.type==='mousedown'){a=e;if(e.which!==1){return;}}if(a){this.element=this.getDraggableElement(a.target);this.startX=a.pageX;this.startY=a.pageY;this.lastMoveX=0;this.lastMoveY=0;if(this.element){var $=jQuery(this.element);var b=$.offset().left;var d=$.offset().top;var f=$.height();var g=$.width();if(this.layoutDetails){if(this.startX-b<this.resizeHandleDistance||(b+g-this.startX)<this.resizeHandleDistance||this.startY-d<this.resizeHandleDistance||(d+f-this.startY)<this.resizeHandleDistance){this.isResize=true;}}else{var x=b+g-this.startX;var y=d+f-this.startY;if(x<this.resizeHandleDistance&&y<this.resizeHandleDistance){this.isResize=true;}}}if(this.lastTapTime&&this.lastElement&&this.element&&(this.lastElement===this.element)&&Math.abs(Date.now()-this.lastTapTime)<this.doubleTapDelay){this.lastTapTime=0;this.tapsNumber=2;}else{this.lastTapTime=Date.now();this.tapsNumber=1;this.lastElement=this.element;}this.log('captureStart('+this.startX+', '+this.startY+')');}};this.startHandler=function(e){this.log('startHandler');this.captureStart(e);if(this.element){this.beforeDragCallback(e,this.element);if(this.lockMode===false){if(this.tapsNumber===2){this.mode='double-tap';return;}if(e.type==="touchstart"){this.timer=setTimeout(function(){if(this.isResize){this.log("mode switched to resize");this.mode="resize";this.resizeStartCallback(e,this.element);}else{this.log('mode switched to drag');this.mode='drag';this.createClone();this.dragStartCallback(e,this.element);}}.bind(this),this.switchModeDelay);}}}}.bind(this);this.captureMove=function(e){var a;if(e.type==='touchmove'&&e.touches.length===1){a=e.touches[0];}else if(e.type==='mousemove'){a=e;}if(a){this.moveX=a.pageX;this.moveY=a.pageY;this.log('captureMove('+this.moveX+', '+this.moveY+')');}};this.moveHandler=function(e){var i;this.log('moveHandler');this.captureMove(e);switch(this.mode){case'normal':if((Math.abs(this.startX-this.moveX)>this.moveTolerance||Math.abs(this.startY-this.moveY)>this.moveTolerance)){if(e.type==="touchmove"){this.log('-> normal');clearTimeout(this.timer);delete this.timer;}else if(this.element){if(this.isResize){this.log("mode switched to resize");this.mode="resize";}else{this.log('mode switched to drag');this.mode='drag';this.createClone();}}}break;case'drag':e.preventDefault();this.log('-> drag');this.mode='drag-and-scroll';window.addEventListener(this.mouseUpEvent,this.endHandler,true);this.translateClone();this.scrollContainer=document.querySelector(this.scrollContainerSelector);this.dragAndScroll();if(e.type==="mousemove"){this.dragStartCallback(e,this.element);}break;case'drag-and-scroll':e.stopPropagation();e.preventDefault();this.log('-> drag-and-scroll');i=this.dragAndScroll();this.translateClone();this.dragMoveCallback({evt:e,clone:this.clone,element:this.element,draggable:this.draggable,isScrolling:i,moveX:this.moveX,moveY:this.moveY});break;case"resize":e.preventDefault();this.log('-> resize');this.mode='resize-and-scroll';window.addEventListener(this.mouseUpEvent,this.endHandler,true);this.scrollContainer=document.querySelector(this.scrollContainerSelector);this.dragAndScroll();if(e.type==="mousemove"){this.resizeStartCallback(e,this.element);}break;case"resize-and-scroll":e.stopPropagation();e.preventDefault();this.log('-> resize-and-scroll');i=this.dragAndScroll();this.resizeMoveCallback({evt:e,element:this.element,draggable:this.draggable,isScrolling:i,moveX:this.moveX,moveY:this.moveY});break;default:break;}}.bind(this);this.captureEnd=function(e){var a;if((e.type==='touchend'||e.type==='touchcancel')&&(e.changedTouches.length===1)){a=e.changedTouches[0];}else if(e.type==='mouseup'){a=e;}if(a){this.endX=a.pageX;this.endY=a.pageY;this.log('captureEnd('+this.endX+', '+this.endY+')');}};this.contextMenuHandler=function(e){if(this.isTouch){e.preventDefault();}}.bind(this);this.clickHandler=function(e){if(this.preventClickFlag){this.preventClickFlag=false;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();clearTimeout(this.preventClickTimeoutId);}this.clickCallback();}.bind(this);this.preventClick=function(){this.preventClickFlag=true;this.preventClickTimeoutId=setTimeout(function(){this.preventClickFlag=false;}.bind(this),100);};this.endHandler=function(e){this.log('endHandler');this.captureEnd(e);switch(this.mode){case'normal':this.log('-> normal');break;case'drag':this.log('-> drag');this.removeClone();this.dragEndCallback(e,this.element);this.preventClick();break;case'drag-and-scroll':this.log('-> drag-and-scroll');window.removeEventListener(this.mouseUpEvent,this.endHandler,true);this.removeClone();this.dragEndCallback(e,this.element);this.preventClick();e.stopPropagation();e.preventDefault();break;case'double-tap':this.log('-> double-tap');this.doubleTapCallback(e,this.element);break;case"resize":this.log("-> resize");this.isResize=false;this.resizeEndCallback(e,this.element);this.preventClick();break;case"resize-and-scroll":this.log("-> resize-and-scroll");window.removeEventListener(this.mouseUpEvent,this.endHandler,true);this.isResize=false;this.resizeEndCallback(e,this.element);this.preventClick();e.stopPropagation();e.preventDefault();break;default:break;}if(this.element){this.endCallback(e,this.element);}clearTimeout(this.timer);delete this.timer;this.lastMoveX=0;this.lastMoveY=0;this.swapTargetElement=null;this.element=null;this.mode='normal';}.bind(this);this.defaultDragStartHandler=function(e){e.preventDefault();};this.scrollHandler=function(){clearTimeout(this.scrollTimer);this.lockMode=true;this.scrollTimer=setTimeout(function(){this.lockMode=false;}.bind(this),500);}.bind(this);this.createClone=function(){var s,r;if(this.clone){this.removeClone();}r=this.element.getBoundingClientRect();this.clone=this.element.cloneNode(true);this.clone.className+=(' '+this.cloneClass);this.element.className+=(' '+'easyScanLayoutItemWrapper-placeHolder');s=this.clone.style;s.position='absolute';s.display='block';s.top=(r.top-this.root.getBoundingClientRect().top)+'px';s.left=(r.left-this.root.getBoundingClientRect().left)+'px';s.width=r.width+'px';s.zIndex='100';s.webkitTransition='-webkit-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';s.mozTransition='-moz-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';s.msTransition='-ms-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';s.transition='transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';s.webkitTransform='translate3d(0px, 0px, 0px) ';s.mozTransform='translate3d(0px, 0px, 0px) ';s.msTransform='translate3d(0px, 0px, 0px) ';s.transform='translate3d(0px, 0px, 0px) ';this.root.appendChild(this.clone);this.log('createClone');};this.removeClone=function(){if(this.element!==null&&typeof(this.element)!=="undefined"){this.element.className=this.element.className.split(' '+this.placeHolderClass).join('');}if(this.clone!==null){this.clone.parentElement.removeChild(this.clone);this.clone=null;this.log("removeClone");}};this.translateClone=function(){var d,a;d=this.moveX-this.startX;a=this.moveY-this.startY;this.clone.style.webkitTransform='translate3d('+d+'px, '+a+'px, 0px)';this.clone.style.mozTransform='translate3d('+d+'px, '+a+'px, 0px)';this.clone.style.msTransform='translate('+d+'px, '+a+'px)';this.clone.style.transform='translate3d('+d+'px, '+a+'px, 0px)';this.log('translateClone ('+d+', '+a+')');this.clone.style.opacity='0.5';};this.dragAndScroll=function(){var d=this.dragAndScrollDuration,s,t=this;function a(h){s.webkitTransition='-webkit-transform '+d+'ms linear';s.transition='transform '+d+'ms linear';s.mozTransition='-moz-transform '+d+'ms linear';s.msTransition='-ms-transform '+d+'ms linear';s.webkitTransform='translate(0px, '+h+'px) scale(1) translateZ(0px)';s.mozTransform='translate(0px, '+h+'px) scale(1) translateZ(0px)';s.msTransform='translate(0px, '+h+'px) scale(1) translateZ(0px)';s.transform='translate(0px, '+h+'px) scale(1) translateZ(0px)';}function b(h){s.webkitTransition='';s.mozTransition='';s.msTransition='';s.transition='';s.webkitTransform='';s.mozTransform='';s.msTransform='';s.transform='';t.wrapper.scrollTop-=h;}function g(){var w=t.wrapper.getBoundingClientRect();var h=t.moveY-w.top-t.scrollEdge;if(h<0){return Math.abs(h);}var i=w.bottom-t.moveY-t.scrollEdge;if(i<0){return i;}return 0;}function e(h){var p;var n=h*2;if(h<0){p=(t.wrapper.offsetHeight+t.wrapper.scrollTop)-t.wrapper.scrollHeight;return n<p?p:n;}else if(h>0){p=t.wrapper.scrollTop;return n<p?n:p;}return 0;}function f(h){a(h);t.dragAndScrollTimer=setTimeout(function(o){b(o);t.dragAndScrollTimer=undefined;var n=e(g());if(n){f(n);}}.bind(t,h),d);}var n=e(g());if(n&&!this.dragAndScrollTimer){this.scrollContainer=this.scrollContainer||document.querySelector(this.scrollContainerSelector);s=this.scrollContainer.style;f(n);}this.log('dragAndScroll ('+n+')');return!!n;};this.enable=function(){this.log('enable');this.root.addEventListener(this.touchStartEvent,this.startHandler,false);this.root.addEventListener(this.touchMoveEvent,this.moveHandler,true);this.root.addEventListener(this.touchEndEvent,this.endHandler,false);this.root.addEventListener(this.touchCancelEvent,this.endHandler,false);this.root.addEventListener(this.mouseMoveEvent,this.moveHandler,true);this.root.addEventListener(this.mouseDownEvent,this.startHandler,false);this.root.addEventListener(this.mouseUpEvent,this.endHandler,false);this.root.addEventListener(this.contextMenuEvent,this.contextMenuHandler,false);this.root.addEventListener(this.clickEvent,this.clickHandler,true);this.wrapper.addEventListener(this.scrollEvent,this.scrollHandler,false);return this;};this.disable=function(){this.log('disable');this.root.removeEventListener(this.touchStartEvent,this.startHandler,false);this.root.removeEventListener(this.touchMoveEvent,this.moveHandler,true);this.root.removeEventListener(this.touchEndEvent,this.endHandler,false);this.root.removeEventListener(this.mouseDownEvent,this.startHandler,false);this.root.removeEventListener(this.mouseMoveEvent,this.moveHandler,true);this.root.removeEventListener(this.mouseUpEvent,this.endHandler,false);this.root.removeEventListener(this.contextMenuEvent,this.contextMenuHandler,false);this.root.removeEventListener(this.clickEvent,this.clickHandler,true);this.root.removeEventListener(this.touchCancelEvent,this.endHandler,false);this.wrapper.removeEventListener(this.scrollEvent,this.scrollHandler,false);return this;};this.init(c);this.getMove=function(){return{x:this.moveX,y:this.moveY};};};})();