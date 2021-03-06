// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/*global jQuery, sap*/
/**
 * @class AnchorNavigationBar renderer.
 * @static
 *
 * @private
 */

(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.ui.launchpad.AnchorNavigationBarRenderer");

    sap.ushell.ui.launchpad.AnchorNavigationBarRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRm the RenderManager that can be used for writing to the render
     *            output buffer
     * @param {sap.ui.core.Control}
     *            oControl an object representation of the control that should be
     *            rendered
     */
    sap.ushell.ui.launchpad.AnchorNavigationBarRenderer.render = function (oRm, oControl) {
        oRm.write("<div");
        oRm.addClass("sapUshellAnchorNavigationBar");
        oRm.writeClasses();
        oRm.writeControlData(oControl);
        oRm.write(">");

        oRm.write("<div");
        oRm.addClass("sapUshellAnchorNavigationBarInner");
        oRm.writeClasses();
        oRm.write(">");

        //left overflow arrow
        oRm.write("<div");
        oRm.addClass("sapUshellAnchorLeftOverFlowButton");
        oRm.writeClasses();
        oRm.write(">");
        oRm.renderControl(oControl._getOverflowLeftArrowButton());
        oRm.write("</div>");

        //anchor items
        oRm.write("<div");
        oRm.addClass("sapUshellAnchorNavigationBarItems");
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl, {role: "list"});
        oRm.write(">");

        oRm.write("<ul");
        oRm.addClass("sapUshellAnchorNavigationBarItemsScroll");
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl, {role: "listbox"});
        oRm.write(">");
        this.renderAnchorNavigationItems(oRm, oControl);
        oRm.write("</ul>");

        oRm.write("</div>");

        //right overflow arrow
        oRm.write("<div");
        oRm.addClass("sapUshellAnchorRightOverFlowButton");
        oRm.writeClasses();
        oRm.write(">");
        oRm.renderControl(oControl._getOverflowRightArrowButton());
        oRm.write("</div>");

        //overflow popover button
        oRm.write("<div");
        oRm.addClass("sapUshellAnchorItemOverFlow");
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl._getOverflowButton(), {"aria-hidden": true});
        oRm.write(">");
        oRm.renderControl(oControl._getOverflowButton());
        oRm.write("</div>");

        oRm.write("</div>");

        oRm.write("</div>");
    };

    sap.ushell.ui.launchpad.AnchorNavigationBarRenderer.renderAnchorNavigationItems = function (oRm, oControl) {
        var aGroups = oControl.getGroups();

        jQuery.each(aGroups, function (index, aGroup) {
            oRm.renderControl(this);
        });
    };
    sap.ushell.ui.launchpad.AnchorNavigationBarRenderer.shouldAddIBarContext = function () {
        return false;
    };
}());
