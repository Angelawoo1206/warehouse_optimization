// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/*global jQuery, sap*/
/**
 * @class AnchorItem renderer.
 * @static
 *
 * @private
 */

(function () {
    "use strict";
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ui.core.Control");
    jQuery.sap.declare("sap.ushell.ui.appfinder.AppBoxRenderer");

    sap.ushell.ui.appfinder.AppBoxRenderer = sap.ui.core.Renderer.extend(sap.ui.core.Control);
    sap.ushell.ui.appfinder.AppBoxRenderer.render = function (rm, oAppBox) {
        var oCatalogContainer = oAppBox.getParent(),
            oAppBoxes = oCatalogContainer.getAppBoxesContainer ? oCatalogContainer.getAppBoxesContainer() : [],
            oVisibleAppBoxes = oAppBoxes.filter(function (oAppBox) {
                return oAppBox.getVisible();
            }),
            iCurrentItemIndex = oVisibleAppBoxes.indexOf(oAppBox) > -1 ? oVisibleAppBoxes.indexOf(oAppBox) + 1 : "",
            sAriaLabelText = oAppBox.getTitle();

        sAriaLabelText = oAppBox.getSubtitle() ? sAriaLabelText + " " + oAppBox.getSubtitle() : sAriaLabelText;

        rm.write("<li");
        rm.writeControlData(oAppBox);
        rm.addClass("sapUshellAppBox");
        rm.writeAccessibilityState(oAppBox, {role: "option", posinset : iCurrentItemIndex, setsize : oVisibleAppBoxes.length});
        rm.writeAttribute("aria-label", sAriaLabelText);
        rm.writeAttribute("aria-describedby", oAppBox.getParent().getId() + "-groupheader");
        rm.writeClasses();
        rm.write(">");
        rm.write("<div");
        rm.addClass("sapUshellAppBoxInner");
        rm.writeClasses();
        rm.write(">");

        // icon
        var bHasIcon = oAppBox.getIcon();
        if (bHasIcon) {
            var oIcon = new sap.ui.core.Icon({src: oAppBox.getIcon()});
            oIcon.addStyleClass("sapUshellAppBoxIcon");
            rm.renderControl(oIcon);
        }

        rm.write("<div");
        if (bHasIcon) {
            rm.addClass("sapUshellAppBoxHeader");
        } else {
            rm.addClass("sapUshellAppBoxHeaderNoIcon");
        }
        rm.writeClasses();
        rm.write(">");

        // title
        rm.write("<div");
        rm.addClass("sapUshellAppBoxTitle");
        rm.writeClasses();
        rm.write(">");
        rm.writeEscaped(oAppBox.getTitle());
        rm.write("</div>");

        // subtitle
        if (oAppBox.getSubtitle()) {
            rm.write("<div");
            rm.addClass("sapUshellAppBoxSubtitle");
            rm.writeClasses();
            rm.write(">");
            rm.writeEscaped(oAppBox.getSubtitle());
            rm.write("</div>");
        }

        rm.write("</div>");

        rm.renderControl(oAppBox.getPinButton());
        rm.write("</div>");
        rm.write("</li>");

    };
}());
