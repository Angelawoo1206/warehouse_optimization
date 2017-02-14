/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.TimelineItemRenderer");jQuery.sap.require("sap.ui.core.Renderer");sap.suite.ui.commons.TimelineItemRenderer={};
sap.suite.ui.commons.TimelineItemRenderer.render=function(r,c){if(c._orientation==="V"){this.renderLIContentV(r,c);}else{this.renderLIContentH(r,c);}};
sap.suite.ui.commons.TimelineItemRenderer.renderLIContentH=function(r,l){r.write("<li ");r.writeAttribute("role","listbox");r.writeControlData(l);r.addClass("sapSuiteUiCommonsTimelineItemLiWrapperV");r.writeClasses();r.write(">");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemWrapperV");r.writeClasses();r.write(">");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBarV");r.writeClasses();r.write(">");r.write("</div>");if(!l._showIcons){r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemNoIcon");r.writeClasses();r.write(">");r.write("</div>");}else{r.renderControl(l._getImageControl());}r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerV");r.writeClasses();r.write(">");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBubble");r.writeClasses();r.write(">");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemArrow");r.writeClasses();r.write(">");r.write("</div>");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBox");r.writeClasses();r.write(">");if(this.renderItemShell){this.renderItemShell(r,l);}r.write("</div>");r.write("</div>");r.write("</div>");r.write("</div>");r.write("</li>");};
sap.suite.ui.commons.TimelineItemRenderer.renderLIContentV=function(r,l){r.write("<li ");r.writeAttribute("role","listbox");r.writeAttribute("groupID",l._groupID);r.writeControlData(l);r.addClass("sapSuiteUiCommonsTimelineItem");if(l.getText()==='GroupHeader'){r.addStyle("height",'2rem');r.writeAttribute("nodeType","GroupHeader");r.addStyle("max-width",'100%');r.writeStyles();}else{r.writeAttribute("nodeType","GroupItem");}r.writeClasses();r.write(">");r.write("<div ");if(l.getText()==='GroupHeader'){r.addClass("sapSuiteUiCommonsTimelineItemWrapperGrp");}else{r.addClass("sapSuiteUiCommonsTimelineItemWrapper");}r.writeClasses();r.write(">");r.write("<div ");if(l._position==sap.suite.ui.commons.TimelineItemPosition.Bottom){r.addClass("sapSuiteUiCommonsTimelineItemBarBottom");}else{r.addClass("sapSuiteUiCommonsTimelineItemBar");}r.writeClasses();r.write(">");r.write("</div>");if(!l._showIcons){if(l.getText()==='GroupHeader'){r.renderControl(l._getGroupButtonControl('',l._groupID));}else{r.write("<div ");r.writeAttribute("id",l.getId()+"noIcon");r.addClass("sapSuiteUiCommonsTimelineItemNoIcon");r.writeClasses();r.write(">");r.write("</div>");}}else{if(l.getText()==='GroupHeader'){r.renderControl(l._getGroupButtonControl('',l._groupID));}else{r.renderControl(l._getImageControl('',l._groupID));}}if(l.getText()==='GroupHeader'){r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacer");r.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerLeft");r.writeClasses();r.write(">");r.write("<span");r.addClass("sapSuiteUiCommonsTimelineItemShellHdr");r.addStyle("left",'324px');r.addStyle("position",'absolute');r.writeClasses();r.write(">");r.writeEscaped(" "+l.getTitle());r.write("</span>");r.write("</div>");}else{r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacer");r.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerLeft");if(l._position==sap.suite.ui.commons.TimelineItemPosition.Bottom){r.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerBottom");}r.writeClasses();r.write(">");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBubble");r.writeClasses();r.write(">");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemArrow");r.writeClasses();r.write(">");r.write("</div>");r.write("<div ");r.addClass("sapSuiteUiCommonsTimelineItemBox");r.writeClasses();r.write(">");if(this.renderItemShell){this.renderItemShell(r,l);}r.write("</div>");r.write("</div>");r.write("</div>");}r.write("</div>");r.write("</li>");};
sap.suite.ui.commons.TimelineItemRenderer._writeCollapsedText=function(r,c,m){if(c._bTextExpanded){r.writeEscaped(c._sFullText,true);r.write('</span>');r.write('<span id="'+m+'-threeDots" class ="sapMFeedListItemTextString sapUiSelectable">');r.write("&#32");r.write('</span>');}else{r.writeEscaped(c._getCollapsedText(),true);r.write('</span>');r.write('<span id="'+m+'-threeDots" class ="sapMFeedListItemTextString sapUiSelectable">');r.write("&#32&#46&#46&#46&#32");r.write('</span>');}var l=c._getLinkExpandCollapse();l.addStyleClass("sapMFeedListItemLinkExpandCollapse");r.renderControl(l);};
sap.suite.ui.commons.TimelineItemRenderer.renderItemShell=function(r,c){r.write("<div");r.writeAttribute("id",c.getId()+"-shell");r.addClass("sapSuiteUiCommonsTimelineItemShell");r.writeAttribute("tabindex","-1");r.writeClasses();r.write(">");r.renderControl(c._replyInfoBar);if(c.getUserPicture()){r.write("<div");r.writeAttribute("id",c.getId()+"-userpicture");r.addClass("sapSuiteUiCommonsTimelineItemUserPicture");r.writeClasses();r.write(">");r.renderControl(c._getUserPictureControl());r.write("</div>");}r.write("<div");r.writeAttribute("title",jQuery.sap.encodeHTML(c.getUserName())+" "+jQuery.sap.encodeHTML(c.getTitle()));r.writeAttribute("id",c.getId()+"-header");r.addClass("sapSuiteUiCommonsTimelineItemHeader");r.addClass("sapSuiteUiCommonsTimelineItemTextLineClamp");r.addStyle("-webkit-line-clamp",2);r.writeClasses();r.writeStyles();r.write(">");r.write("<span");r.writeAttribute("id",c.getId()+"-username");r.addClass("sapSuiteUiCommonsTimelineItemShellUser");r.addClass("sapUiSelectable");r.writeClasses();r.write(">");if(c.getUserNameClickable()){c._userNameLink.setText(c.getUserName());c._userNameLink.setTooltip(c.getUserName());r.renderControl(c._userNameLink);}else{r.writeEscaped(c.getUserName());}r.write("</span>");r.write("<span");r.addClass("sapSuiteUiCommonsTimelineItemShellHdr");r.addClass("sapUiSelectable");r.writeClasses();r.write(">");r.writeEscaped(" "+c.getTitle());r.write("</span>");r.write("</div>");r.write("<div");r.addClass("sapSuiteUiCommonsTimelineItemShellDateTime");r.addClass("sapUiSelectable");r.writeClasses();r.write(">");r.writeEscaped(c._formatDateValue(c.getDateTime()));r.write("</div>");r.write("<div");r.addClass("sapSuiteUiCommonsTimelineItemShellBody");r.writeClasses();r.write(">");if(c.getEmbeddedControl()!==null){r.renderControl(c.getEmbeddedControl());}else{if(c._textBox){r.write("<span");r.writeAttribute("id",c.getId()+"-realtext");r.addClass("sapUiSelectable");r.writeClasses();r.write(">");if(!!c._checkTextIsExpandable()){this._writeCollapsedText(r,c,c.getId());}else{r.writeEscaped(c._textBox,true);}}}r.write("</div>");if(c.getParent()&&c.getParent()._aFilterList&&(c.getParent().getEnableSocial()||c.getCustomAction().length>0)){r.write("<div");r.addClass("sapSuiteUiCommonsTimelineItemShellBottom");r.writeClasses();r.write(">");r.renderControl(c._jamBar);r.write("</div>");}r.write("</div>");};