// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.ui.launchpad.LoadingDialogRenderer");sap.ushell.ui.launchpad.LoadingDialogRenderer={};sap.ushell.ui.launchpad.LoadingDialogRenderer.render=function(r,c){var t=c.getTooltip_AsString();c._oLabel.addStyleClass("sapUshellLoadingDialogLabel");r.write("<div");r.writeControlData(c);r.addClass("sapUshellLoadingDialogControl");r.writeClasses();if(t){r.writeAttributeEscaped("title",t);}r.write(">");if(jQuery.os.ios||!c._isPlatformDependent){this.renderAppInfo(r,c);this.renderFioriFlower(r,c);}else{this.renderFioriFlower(r,c);this.renderAppInfo(r,c);}r.write("</div>");};sap.ushell.ui.launchpad.LoadingDialogRenderer.renderAppInfo=function(r,c){r.write("<div").addClass("sapUshellLoadingDialogAppData").writeClasses().write(">");if(c.getIconUri()){r.renderControl(c.oIcon);}r.write("<span");r.writeAttribute("id",c.getId()+"accessibility-helper");r.addClass("sapUshellAccessibilityHelper");r.writeClasses();r.writeAccessibilityState(c,{live:"rude","relevant":"additions text"});r.write(">");r.write("</span>");r.renderControl(c._oLabel);r.write("</div>");};sap.ushell.ui.launchpad.LoadingDialogRenderer.renderFioriFlower=function(r,c){var i,R=false,u=[/Android\s4\.2.+GT-I9505.+Chrome\/18/];if(navigator.userAgent){for(i=0;i<u.length;i=i+1){if(u[i].test(navigator.userAgent)){R=true;break;}}}if(jQuery.support.cssAnimations&&!R){r.write("<div id='fiori2-loader'>");r.write("<div class='fiori2-blossom'>");for(i=1;i<6;i=i+1){r.write("<div class='fiori2-leafContainer fiori2-leafContainer"+i+"'>");r.write("<div class='fiori2-leaf fiori2-leaf"+i+"'></div>");r.write("</div>");}r.write("</div>");r.write("</div>");}};}());
