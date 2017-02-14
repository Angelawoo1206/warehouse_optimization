/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ViewRepeaterRenderer");jQuery.sap.require("sap.ui.commons.RowRepeaterRenderer");sap.suite.ui.commons.ViewRepeaterRenderer=sap.ui.core.Renderer.extend(sap.ui.commons.RowRepeaterRenderer);
sap.suite.ui.commons.ViewRepeaterRenderer.render=function(r,c){if(!c.getVisible()){return;}var t=c.getTooltip_AsString();r.write("<div");r.writeControlData(c);if(t){r.writeAttributeEscaped("title",t);}r.addClass("sapUiRrDesign"+c.getDesign());if(c.getResponsive()&&c.getShowMoreSteps()==0){r.addClass("suiteUiVrResp");}r.writeClasses();if(c.getResponsive()&&c.getShowMoreSteps()==0){r.write(" style='height:"+c.getHeight()+"'");}r.write(">");if(c.getDesign()!==sap.ui.commons.RowRepeaterDesign.BareShell){this.renderHeader(r,c);}if(c.getExternal()!==true){this.renderBody(r,c);if(c.getDesign()!==sap.ui.commons.RowRepeaterDesign.BareShell){this.renderFooter(r,c);}}else{r.renderControl(sap.ui.getCore().byId(c.getAssociation("externalRepresentation")));}r.write("</div>");};
sap.suite.ui.commons.ViewRepeaterRenderer.renderHeader=function(r,c){this.renderViewSwitcher(r,c);if(c.getExternal()!==true){sap.ui.commons.RowRepeaterRenderer.renderHeader.call(this,r,c);}};
sap.suite.ui.commons.ViewRepeaterRenderer.renderFooter=function(r,c){if(c.getExternal()!==true){sap.ui.commons.RowRepeaterRenderer.renderFooter.call(this,r,c);}};
sap.suite.ui.commons.ViewRepeaterRenderer.renderViewSwitcher=function(r,c){if(c.getShowViews()||c.getShowSearchField()){r.write("<div");r.addClass("suiteUiVrViewSwHolder");r.writeClasses();r.write(">");if(c.getShowViews()){r.write("<div");r.addClass("suiteUiVrViewSw");r.writeClasses();r.write(">");r.renderControl(c._oSegBtn);r.write("</div>");}if(c.getShowSearchField()){r.write("<div");r.addClass("suiteUiVrSearchFld");r.writeClasses();r.write(">");r.renderControl(c._oSearchField);r.write("</div>");}r.write("</div>");}r.write("<div style='clear:both;'/>");};
