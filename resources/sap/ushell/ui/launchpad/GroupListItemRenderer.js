// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.require("sap.ushell.resources");jQuery.sap.declare("sap.ushell.ui.launchpad.GroupListItemRenderer");jQuery.sap.require("sap.m.ListItemBaseRenderer");sap.ushell.ui.launchpad.GroupListItemRenderer=sap.ui.core.Renderer.extend(sap.m.ListItemBaseRenderer);sap.ushell.ui.launchpad.GroupListItemRenderer.renderLIAttributes=function(r){r.addClass("sapUshellGroupLI");r.addClass("sapUshellGroupListItem");};sap.ushell.ui.launchpad.GroupListItemRenderer.renderLIContent=function(r,l){r.write("<div");r.addClass("sapMSLIDiv");r.addClass("sapMSLITitleDiv");r.writeClasses();if(!l.getVisible()){r.addStyle("display","none");r.writeStyles();}r.write(">");r.write("<div");r.addClass("sapMSLITitleOnly");r.writeClasses();r.write(">");r.writeEscaped(l.getTitle());r.write("</div>");r.write("</div>");};}());
