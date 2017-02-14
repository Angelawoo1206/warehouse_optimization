sap.ui.define(['jquery.sap.global'],function(q){"use strict";var O={};O.render=function(r,c){if(!c.getVisible()){return;}r.write("<div");r.writeControlData(c);r.writeAccessibilityState(undefined,{role:"dialog"});r.writeAccessibilityState(c,{label:c.getTitle()});r.addClass("sapOvpObjectStream");r.writeClasses();r.write(">");r.write("<div");r.writeAccessibilityState(undefined,{role:"heading"});r.writeAccessibilityState(c,{label:c.getTitle().getText()});r.writeClasses();r.write(">");var t=c.getTitle();if(t){r.renderControl(t);}r.write("</div>");r.write('<div tabindex="0" ');r.addClass("sapOvpObjectStreamClose");r.writeAccessibilityState(undefined,{role:"button"});r.writeAccessibilityState(c,{label:"close"});r.writeClasses();r.write(">");r.renderControl(c._closeIcon);r.write("</div>");r.write('<div id="'+c.getId()+'-cont" class="sapOvpObjectStreamCont"');r.write(">");r.write('<div id="'+c.getId()+'-scroll"');r.writeAccessibilityState(undefined,{role:"list"});r.addClass("sapOvpObjectStreamScroll");r.writeClasses();r.write(">");var C=c.getContent();C.forEach(function(a,i){r.write("<div class='sapOvpObjectStreamItem' ");if(i==0){r.write("tabindex='0' ");}else{r.write("tabindex='-1' ");}r.writeAccessibilityState(undefined,{role:"listitem"});r.write("aria-setsize = "+(C.length+1)+" aria-posinset = "+(i+1));r.write(">");r.renderControl(a);r.write("</div>");});var p=c.getPlaceHolder();if(p){r.write("<div class='sapOvpObjectStreamItem' ");if(!C.length){r.write("tabindex='0'");}else{r.write("tabindex='-1'");}r.writeAccessibilityState(undefined,{role:"listitem"});r.write("aria-setsize = "+(C.length+1)+" aria-posinset = "+(C.length+1));r.write(">");r.renderControl(p);r.write("</div>");}r.write("</div>");r.write('<div id="'+c.getId()+'-leftedge" class="sapOvpOSEdgeLeft">');r.renderControl(new sap.ui.core.Icon({src:"sap-icon://slim-arrow-left",useIconTooltip:false}));r.write('</div>');r.write('<div id="'+c.getId()+'-rightedge" class="sapOvpOSEdgeRight">');r.renderControl(new sap.ui.core.Icon({src:"sap-icon://slim-arrow-right",useIconTooltip:false}));r.write('</div>');r.write("</div>");r.write("</div>");};O.renderFooterContent=function(r,c){};return O;},true);