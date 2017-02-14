/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// This control displays the history of values as a line mini chart or an area mini chart.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";

	/**
	 * This control contains data for the point.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Contains the data for the point.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.44.6
	 * @since 1.34
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.AreaMicroChartPoint
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var AreaMicroChartPoint = Element.extend("sap.suite.ui.microchart.AreaMicroChartPoint", /** @lends sap.suite.ui.microchart.AreaMicroChartPoint.prototype */ {
			metadata : {
				library : "sap.suite.ui.microchart",
				properties : {
					/**
					 * X value for the given point.
					 */
					x: { type : "float", group : "Misc", defaultValue : null },

					/**
					 * Y value for the given point.
					 */
					y: { type : "float", group : "Misc", defaultValue : null }
				}
		}
	});

	AreaMicroChartPoint.prototype.setX = function(value, bSuppressInvalidate) {
		this._isXValue = this._isNumber(value);

		return this.setProperty("x", this._isXValue ? value : NaN, bSuppressInvalidate);
	};


	AreaMicroChartPoint.prototype.setY = function(value, bSuppressInvalidate) {
		this._isYValue = this._isNumber(value);

		return this.setProperty("y", this._isYValue ? value : NaN, bSuppressInvalidate);
	};
	//

	/**
	 * Returns the x value. It returns 'undefined', if the x property was not set or an invalid number was set.
	 *
	 * @public
	 * @returns {string}
	 */
	AreaMicroChartPoint.prototype.getXValue = function() {
		return this._isXValue ? this.getX() : undefined;
	};

	/**
	 * Returns the y value. It returns 'undefined', if the y property was not set or an invalid number was set.
	 *
	 * @public
	 * @returns {float}
	 */
	AreaMicroChartPoint.prototype.getYValue = function() {
		return this._isYValue ? this.getY() : undefined;
	};

	AreaMicroChartPoint.prototype._isNumber = function(n) {
	    return typeof n == 'number' && !isNaN(n) && isFinite(n);
	};

	/**
	 * Overrides Control.clone to clone additional internal state.
	 *
	 * @param {string} sIdSuffix? a suffix to be appended to the cloned element id
	 * @param {string[]} aLocalIds? an array of local IDs within the cloned hierarchy (internally used)
	 * @param {object} oOptions
	 * @returns {sap.ui.core.Control} reference to the newly created clone
	 */
	AreaMicroChartPoint.prototype.clone = function(sIdSuffix, aLocalIds, oOptions) {
		var oClone = sap.ui.core.Control.prototype.clone.apply(this, arguments);
		oClone._isXValue = this._isXValue;
		oClone._isYValue = this._isYValue;
		return oClone;
	};

	return AreaMicroChartPoint;
});