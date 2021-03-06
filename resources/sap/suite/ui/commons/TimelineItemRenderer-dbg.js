/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
 
 
jQuery.sap.declare("sap.suite.ui.commons.TimelineItemRenderer");
jQuery.sap.require("sap.ui.core.Renderer");

/**
 * @class TimelineItem renderer. 
 * @static
 */
sap.suite.ui.commons.TimelineItemRenderer = {
};

/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
 
 sap.suite.ui.commons.TimelineItemRenderer.render = function(oRm, oControl) {
	if (oControl._orientation === "V") {
		this.renderLIContentV(oRm, oControl);
	} else {
		this.renderLIContentH(oRm, oControl);
	}
};
 


sap.suite.ui.commons.TimelineItemRenderer.renderLIContentH = function(oRm, oLI) {
	oRm.write("<li ");
//	oRm.writeAttribute("role", "option");
	oRm.writeAttribute("role", "listbox");
	oRm.writeControlData(oLI);
	oRm.addClass("sapSuiteUiCommonsTimelineItemLiWrapperV");
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("<div ");
	oRm.addClass("sapSuiteUiCommonsTimelineItemWrapperV");
	oRm.writeClasses();
	oRm.write(">");

	oRm.write("<div ");
	oRm.addClass("sapSuiteUiCommonsTimelineItemBarV");
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("</div>");

	if (!oLI._showIcons) {
		oRm.write("<div ");
		oRm.addClass("sapSuiteUiCommonsTimelineItemNoIcon");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");
	} else {
		oRm.renderControl(oLI._getImageControl());
	}

	oRm.write("<div ");
	oRm.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerV");
	oRm.writeClasses();
	oRm.write(">");

	oRm.write("<div ");
	oRm.addClass("sapSuiteUiCommonsTimelineItemBubble");
	oRm.writeClasses();
	oRm.write(">");
	
	oRm.write("<div ");
	oRm.addClass("sapSuiteUiCommonsTimelineItemArrow");
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("</div>");

	oRm.write("<div ");
	oRm.addClass("sapSuiteUiCommonsTimelineItemBox");
	oRm.writeClasses();
	oRm.write(">");
	if (this.renderItemShell) {
		this.renderItemShell(oRm, oLI);
	}
	oRm.write("</div>"); // close box
	oRm.write("</div>"); // close bubble
	oRm.write("</div>"); // close spacer
	oRm.write("</div>");
	oRm.write("</li>");
};

sap.suite.ui.commons.TimelineItemRenderer.renderLIContentV = function(oRm, oLI) {

  oRm.write("<li ");
//oRm.writeAttribute("role", "option");
  oRm.writeAttribute("role", "listbox");
  oRm.writeAttribute("groupID",oLI._groupID);
  oRm.writeControlData(oLI);
  
	oRm.addClass("sapSuiteUiCommonsTimelineItem");
	
	 if (oLI.getText() === 'GroupHeader') {
       oRm.addStyle("height", '2rem');
       oRm.writeAttribute("nodeType","GroupHeader");
       oRm.addStyle("max-width", '100%');
       oRm.writeStyles();
	} else {
		oRm.writeAttribute("nodeType","GroupItem");
	}
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("<div ");
	 if (oLI.getText() === 'GroupHeader') {
		 oRm.addClass("sapSuiteUiCommonsTimelineItemWrapperGrp");
	 } else {
		 oRm.addClass("sapSuiteUiCommonsTimelineItemWrapper");
	 }
	
	oRm.writeClasses();
	oRm.write(">");

	oRm.write("<div ");
//	if (oLI.getPosition() == sap.suite.ui.commons.TimelineItemPosition.Bottom) {
	if (oLI._position == sap.suite.ui.commons.TimelineItemPosition.Bottom) {
		oRm.addClass("sapSuiteUiCommonsTimelineItemBarBottom");//TODO : check if you really need this..
		  //oRm.addClass("sapSuiteUiCommonsTimelineItemBar");
	} else {
	    oRm.addClass("sapSuiteUiCommonsTimelineItemBar");
	}
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("</div>");

	if (!oLI._showIcons){
		 if (oLI.getText() === 'GroupHeader') {
			  oRm.renderControl(oLI._getGroupButtonControl('',oLI._groupID));
		 } else {
	    oRm.write("<div ");
         oRm.writeAttribute("id", oLI.getId() + "noIcon");
           oRm.addClass("sapSuiteUiCommonsTimelineItemNoIcon");
        oRm.writeClasses();
        oRm.write(">");
	    oRm.write("</div>");
		 }
	} else {
	
		 if (oLI.getText() === 'GroupHeader') {
			  oRm.renderControl(oLI._getGroupButtonControl('',oLI._groupID));
		 } else {
			 oRm.renderControl(oLI._getImageControl('',oLI._groupID));
			}
    }
    
    if (oLI.getText() === 'GroupHeader') {
      oRm.write("<div ");
      oRm.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacer");
    
      oRm.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerLeft"); //arrow on the left.. get it dynamically.
      oRm.writeClasses();
      oRm.write(">");
      oRm.write("<span");
	 //oRm.writeControlData(oControl);
      oRm.addClass("sapSuiteUiCommonsTimelineItemShellHdr");
      oRm.addStyle("left", '324px');	
      oRm.addStyle("position", 'absolute');
			 oRm.writeClasses();
			 oRm.write(">"); 
			 oRm.writeEscaped(" " + oLI.getTitle());
			 oRm.write("</span>");
			  oRm.write("</div>"); // close bubble
    } else {

    oRm.write("<div ");
    oRm.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacer");
    oRm.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerLeft"); //arrow on the left.. get it dynamically.

//    if (oLI.getPosition() == sap.suite.ui.commons.TimelineItemPosition.Bottom) {
    if (oLI._position == sap.suite.ui.commons.TimelineItemPosition.Bottom) {
    	oRm.addClass("sapSuiteUiCommonsTimelineItemBubbleSpacerBottom");
    }
    
    oRm.writeClasses();
    oRm.write(">");
    
    oRm.write("<div ");
    oRm.addClass("sapSuiteUiCommonsTimelineItemBubble");
//    oRm.writeAttribute("tabindex", "-1");

    oRm.writeClasses();
    oRm.write(">");
		oRm.write("<div ");
		oRm.addClass("sapSuiteUiCommonsTimelineItemArrow");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		oRm.write("<div ");
		oRm.addClass("sapSuiteUiCommonsTimelineItemBox");
		oRm.writeClasses();
		oRm.write(">");
    if (this.renderItemShell) {
        this.renderItemShell(oRm, oLI);
    }
    oRm.write("</div>"); // close box
    oRm.write("</div>"); // close bubble
    oRm.write("</div>"); // close spacer
    
    }
	oRm.write("</div>");
	
	oRm.write("</li>");

};

 
	sap.suite.ui.commons.TimelineItemRenderer._writeCollapsedText = function(rm, oControl, sMyId) {
		// 'oFeedListItem._bTextExpanded' is true if the text had been expanded and rendering needs to be done again.
		if (oControl._bTextExpanded) {
			rm.writeEscaped(oControl._sFullText, true);
			rm.write('</span>');
			rm.write('<span id="' + sMyId + '-threeDots" class ="sapMFeedListItemTextString sapUiSelectable">');
			rm.write("&#32"); // space
			rm.write('</span>');
		} else {
			rm.writeEscaped(oControl._getCollapsedText(), true);
			rm.write('</span>');
			rm.write('<span id="' + sMyId + '-threeDots" class ="sapMFeedListItemTextString sapUiSelectable">');
			rm.write("&#32&#46&#46&#46&#32"); // space + three dots + space
			rm.write('</span>');
		}
		var oLinkExpandCollapse = oControl._getLinkExpandCollapse();
		oLinkExpandCollapse.addStyleClass("sapMFeedListItemLinkExpandCollapse");
		rm.renderControl(oLinkExpandCollapse);
	};


sap.suite.ui.commons.TimelineItemRenderer.renderItemShell = function(oRm, oControl){
	 oRm.write("<div");
//	 oRm.writeControlData(oControl);
	 oRm.writeAttribute("id", oControl.getId() + "-shell");
	 oRm.addClass("sapSuiteUiCommonsTimelineItemShell");
	 oRm.writeAttribute("tabindex", "-1");
	 oRm.writeClasses();
	 oRm.write(">");
	 oRm.renderControl(oControl._replyInfoBar);

	 if (oControl.getUserPicture()) {
		 oRm.write("<div");
		 oRm.writeAttribute("id", oControl.getId() + "-userpicture");
		 oRm.addClass("sapSuiteUiCommonsTimelineItemUserPicture");
		 oRm.writeClasses();
	   oRm.write(">");
	   oRm.renderControl(oControl._getUserPictureControl());
	   oRm.write("</div>");
	 }

	 oRm.write("<div");
	 oRm.writeAttribute("title", jQuery.sap.encodeHTML(oControl.getUserName()) + " " + jQuery.sap.encodeHTML(oControl.getTitle()));
	 //added yy
	 oRm.writeAttribute("id", oControl.getId() + "-header");
	 oRm.addClass("sapSuiteUiCommonsTimelineItemHeader");
	 oRm.addClass("sapSuiteUiCommonsTimelineItemTextLineClamp");
	 oRm.addStyle("-webkit-line-clamp", 2);
	 oRm.writeClasses();
	 oRm.writeStyles();
	 //oRm.writeControlData(oControl);
	 oRm.write(">");

	 oRm.write("<span");
	 //oRm.writeControlData(oControl);
	 oRm.writeAttribute("id", oControl.getId() + "-username");
	 oRm.addClass("sapSuiteUiCommonsTimelineItemShellUser");
	 oRm.addClass("sapUiSelectable");
	 oRm.writeClasses();
	 oRm.write(">");
	 if (oControl.getUserNameClickable()) {
	   oControl._userNameLink.setText(oControl.getUserName());
	   oControl._userNameLink.setTooltip(oControl.getUserName());
	   oRm.renderControl(oControl._userNameLink);
	 } else {
		 oRm.writeEscaped(oControl.getUserName());
	 }
	 oRm.write("</span>");

	 oRm.write("<span");
	 //oRm.writeControlData(oControl);
	 oRm.addClass("sapSuiteUiCommonsTimelineItemShellHdr");
	 oRm.addClass("sapUiSelectable");
	 oRm.writeClasses();
	 oRm.write(">");
	 oRm.writeEscaped(" " + oControl.getTitle());
	 oRm.write("</span>");

	 oRm.write("</div>");

	 oRm.write("<div");
	 //oRm.writeControlData(oControl);
	 oRm.addClass("sapSuiteUiCommonsTimelineItemShellDateTime");
	 oRm.addClass("sapUiSelectable");
	 oRm.writeClasses();
	 oRm.write(">");
	 oRm.writeEscaped( oControl._formatDateValue( oControl.getDateTime() ) );
	 oRm.write("</div>");

	 oRm.write("<div");
	 //oRm.writeControlData(oControl);
	 oRm.addClass("sapSuiteUiCommonsTimelineItemShellBody");
	// oRm.writeAttribute("id", oControl.getId() + "-sapSuiteUiCommonsTimelineItemShellBody");
	 oRm.writeClasses();
	 oRm.write(">");
	 if (oControl.getEmbeddedControl() !== null ) {
		 oRm.renderControl(oControl.getEmbeddedControl());
	 } else {
		 //oRm.writeEscaped(oControl.getText());
		 if(oControl._textBox) {
			oRm.write("<span");
			oRm.writeAttribute("id", oControl.getId() + "-realtext");
			oRm.addClass("sapUiSelectable");
			oRm.writeClasses();
			oRm.write(">");
			if (!!oControl._checkTextIsExpandable()) {
				this._writeCollapsedText(oRm, oControl, oControl.getId());
			} else {
				oRm.writeEscaped(oControl._textBox, true);
			}
		 }
	 }
	 oRm.write("</div>");

	 // here we should do the bottom bar
	 if (oControl.getParent() && oControl.getParent()._aFilterList && (oControl.getParent().getEnableSocial() || oControl.getCustomAction().length > 0)) {  //Check if there is Timeline as parent
		 oRm.write("<div");
		 oRm.addClass("sapSuiteUiCommonsTimelineItemShellBottom");
		 oRm.writeClasses();
		 oRm.write(">");
		 oRm.renderControl(oControl._jamBar);
		 oRm.write("</div>");
	 }
	 oRm.write("</div>");
};
