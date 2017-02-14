/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.Fiori2LoadingDialog.
jQuery.sap.declare("sap.ushell.ui.launchpad.Fiori2LoadingDialog");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ui/launchpad/Fiori2LoadingDialog.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getText text} : sap.ui.core.URI</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Displays a fiori2 app navigation loading dialog with an indicator that an app is loading
 * @extends sap.ui.core.Control
 * @version 1.44.6
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.Fiori2LoadingDialog
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ushell.ui.launchpad.Fiori2LoadingDialog", { metadata : {

	library : "sap.ushell",
	properties : {

		/**
		 * the text to be displayed
		 */
		"text" : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.ushell.ui.launchpad.Fiori2LoadingDialog with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.ushell.ui.launchpad.Fiori2LoadingDialog.extend
 * @function
 */


/**
 * Getter for property <code>text</code>.
 * the text to be displayed
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>text</code>
 * @public
 * @name sap.ushell.ui.launchpad.Fiori2LoadingDialog#getText
 * @function
 */

/**
 * Setter for property <code>text</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sText  new value for property <code>text</code>
 * @return {sap.ushell.ui.launchpad.Fiori2LoadingDialog} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.Fiori2LoadingDialog#setText
 * @function
 */

// Start of sap/ushell/ui/launchpad/Fiori2LoadingDialog.js
(function () {
    "use strict";
    /*global jQuery, sap, window */
    /*jslint nomen: true*/

    /**
     * Fiori2LoadingDialog
     *
     * @name sap.ushell.ui.launchpad.Fiori2LoadingDialog
     * @private
     * @since 1.38.0
     */

    sap.ushell.ui.launchpad.Fiori2LoadingDialog.prototype.init = function () {
        var body = document.getElementsByTagName("body")[0],
            elLoadingOverlay = document.createElement("DIV"),
            elBusyIndicator = document.createElement("DIV"),
            elLoadingDialog = document.createElement("DIV"),
            elAccessibilityHelper = document.createElement("DIV"),
            elAccessibilityAppInfo = document.createElement("DIV"),
            elAccessibilityLoadingComplete = document.createElement("DIV"),
            elLoadingArea = document.createElement("DIV");

        this._oBusyIndicator = new sap.m.BusyIndicator("fiori2LoadingDialogBusyIndicator");
        this._oBusyIndicator.setBusyIndicatorDelay(100);
        this._firstLoading = true;
        this._start = 0;
        this._end = 0;


        elLoadingArea.setAttribute("id", "sapUshellFiori2LoadingArea");
        elLoadingArea.setAttribute("class", "sapUshellFiori2LoadingDialogArea");
        elLoadingArea.setAttribute("style", "height: 0px; width: 0px; overflow: hidden; float: left;");
        body.insertBefore(elLoadingArea, body.firstChild);

        elAccessibilityHelper.setAttribute("id", "sapUshellLoadingAccessibilityHelper");
        elAccessibilityHelper.setAttribute("class", "sapUshellLoadingAccessibilityHelper");

        elAccessibilityAppInfo.setAttribute("id", "sapUshellLoadingAccessibilityHelper-appInfo");
        elAccessibilityAppInfo.setAttribute("aria-atomic", "true");
        elAccessibilityHelper.appendChild(elAccessibilityAppInfo);

        elAccessibilityLoadingComplete.setAttribute("id", "sapUshellLoadingAccessibilityHelper-loadingComplete");
        elAccessibilityLoadingComplete.setAttribute("aria-atomic", "true");
        elAccessibilityLoadingComplete.setAttribute("aria-live", "polite");
        elAccessibilityHelper.appendChild(elAccessibilityLoadingComplete);

        elLoadingArea.appendChild(elAccessibilityHelper);

        elLoadingDialog.setAttribute("id", "sapUshellFiori2LoadingDialog");
        elLoadingDialog.setAttribute("style", "z-index: 8;visibility: visible;");
        elLoadingDialog.setAttribute("class", "sapUshellShellHidden");

        elLoadingOverlay.setAttribute("id", "sapUshellFiori2LoadingOverlay");
        elLoadingOverlay.setAttribute("class", "sapUshellFiori2LoadingDialogOverlayStyle");
        elLoadingDialog.appendChild(elLoadingOverlay);

        elBusyIndicator.setAttribute("id", "sapUshellFiori2LoadingBusyIndicator");
        elLoadingDialog.appendChild(elBusyIndicator);

        body.insertBefore(elLoadingDialog, elLoadingArea);

        this._oBusyIndicator.placeAt("sapUshellFiori2LoadingBusyIndicator");

    };

    sap.ushell.ui.launchpad.Fiori2LoadingDialog.prototype.openLoadingScreen = function (sAnimationMode) {
        this.start = new Date().getTime();
        var jqLoadingDialog = jQuery("#sapUshellFiori2LoadingOverlay");

        sAnimationMode = sAnimationMode || "full";

        jQuery("#sapUshellFiori2LoadingDialog").toggleClass("sapUshellShellHidden", false);

        // opening the overlay with/without animation accordingly
        if (this._firstLoading) {
            // Update flag.
            this._firstLoading = false;

            if (sAnimationMode === 'minimal') {
                jqLoadingDialog.toggleClass("sapUshellInitialLoadingDialogOverlayNoAnimation", true);
            } else {
                /* Should check for the third mode when implemented */
                /* currently only minimal and full. */
                jqLoadingDialog.toggleClass("sapUshellInitialLoadingDialogOverlayAnimation", true);
            }
        } else {
            if (sAnimationMode === 'minimal') {
                jqLoadingDialog.toggleClass("sapUshellLoadingDialogOverlayNoAnimation", true);
            } else {
                /* Should check for the third mode when implemented */
                /* currently only minimal and full. */
                jqLoadingDialog.toggleClass("sapUshellLoadingDialogOverlayAnimation", true);
            }
        }

        // opening the busy indicator
        jQuery("#fiori2LoadingDialogBusyIndicator").toggleClass("sapUshellLoadingDialogBusyIndicatorAnimation", true);
    };

    sap.ushell.ui.launchpad.Fiori2LoadingDialog.prototype.isOpen = function () {
        return !jQuery("#sapUshellFiori2LoadingDialog").hasClass("sapUshellShellHidden");
    };

    sap.ushell.ui.launchpad.Fiori2LoadingDialog.prototype.closeLoadingScreen = function () {
        this.end = new Date().getTime();
        var time = this.end - this.start;//time in milliseconds from openLoadingScreen call

        if (time < 350) {
            jQuery("#sapUshellFiori2LoadingDialog").toggleClass("sapUshellShellHidden", true);
            jQuery("#sapUshellFiori2LoadingOverlay").toggleClass("sapUshellLoadingDialogOverlayNoAnimation", false);
            jQuery("#sapUshellFiori2LoadingOverlay").toggleClass("sapUshellLoadingDialogOverlayAnimation", false);
            jQuery("#sapUshellFiori2LoadingOverlay").toggleClass("sapUshellInitialLoadingDialogOverlayAnimation", false);
            jQuery("#fiori2LoadingDialogBusyIndicator").toggleClass("sapUshellLoadingDialogBusyIndicatorAnimation", false);
        } else {
            setTimeout (function () {
                jQuery("#sapUshellFiori2LoadingDialog").toggleClass("sapUshellShellHidden", true);
                jQuery("#sapUshellFiori2LoadingOverlay").toggleClass("sapUshellLoadingDialogOverlayNoAnimation", false);
                jQuery("#sapUshellFiori2LoadingOverlay").toggleClass("sapUshellLoadingDialogOverlayAnimation", false);
                jQuery("#sapUshellFiori2LoadingOverlay").toggleClass("sapUshellInitialLoadingDialogOverlayAnimation", false);
                jQuery("#fiori2LoadingDialogBusyIndicator").toggleClass("sapUshellLoadingDialogBusyIndicatorAnimation", false);
            }, 800 - time);
        }

   };

    sap.ushell.ui.launchpad.Fiori2LoadingDialog.prototype.exit= function () {
        this._oBusyIndicator.destroy();
    }

}());
