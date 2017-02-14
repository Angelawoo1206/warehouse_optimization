/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.ExpressionAdvanced.
sap.ui.define([
	"jquery.sap.global",
	"./library",
	"sap/rules/ui/ExpressionAdvanced"
],	function(jQuery, library, ExpressionAdvanced) {
		"use strict";

		/**
		 * Constructor for a new DecisionTableCellExpressionAdvanced sap.rules.ui.ExpressionAdvanced.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * The <code>sap.rules.ui.DecisionTableCellExpressionAdvanced</code> control provides the ability to define expressions for complex rules in a decision table.
		 * @extends  sap.rules.ui.ExpressionAdvanced
		 *
		 * @author SAP SE
		 * @version 1.44.3
		 *
		 * @constructor
		 * @private
		 * @alias sap.rules.ui.DecisionTableCellExpressionAdvanced
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var DecisionTableCellExpressionAdvanced = ExpressionAdvanced.extend("sap.rules.ui.DecisionTableCellExpressionAdvanced", {
			metadata: {

				library: "sap.rules.ui",
				properties: {
					/**
					 * Defines the header value of the control.
					 */
					headerValue: {
						type: "string",
						defaultValue: "",
						bindable: "bindable"
					},
					/**
					 * Defines the fixed operator value of the control.
					 */
					fixedOperator: {
						type: "string",
						defaultValue: "",
						bindable: "bindable"
					},
					type: {
						type: "sap.rules.ui.ExpressionType",
						defaultValue: sap.rules.ui.ExpressionType.BooleanEnhanced,
						bindable: "bindable"
					}
				}
			}
		});

		DecisionTableCellExpressionAdvanced.prototype.validateExpression = function() {
			var expressionValue = this.codeMirror ? this.codeMirror.getValue() : this.getValue();
			if (expressionValue) {
				var sValue = this.getHeaderValue() + " " + this.getFixedOperator() + " " + expressionValue;
				sap.rules.ui.ExpressionAdvanced.prototype.validateExpression.apply(this, [sValue]);
			} else {
				this.setValueStateText("");
			}

		};

		DecisionTableCellExpressionAdvanced.prototype.onAfterRendering = function() {
			sap.rules.ui.ExpressionAdvanced.prototype.onAfterRendering.apply(this, arguments);
			this.codeMirror.options.fixedOperator = this.getFixedOperator();
			this.codeMirror.options.headerValue = this.getHeaderValue();
			this.codeMirror.options.filterOutStructuredCond = true;      //Structured conditions should not appear in decision table. (e.g "any of the following...")
			this._handleValidation();
			this._handleCellSize();
            if (jQuery.sap.byId(this.getId()).closest('td').next().width()) {
				this._showPopUp();
			}
			

		};

		DecisionTableCellExpressionAdvanced.prototype._handleCellSize = function() {
			this.addStyleClass("sapRULDecisionTableSCellFocus");
			var nextCell = jQuery.sap.byId(this.getId()).closest('td').next();
			var myCell = jQuery.sap.byId(this.getId()).closest('td');
			var sWidth;
			var myWidth = myCell.width();
			if (nextCell.width() != null) {
				sWidth = Math.round(myWidth + (nextCell.width() * 0.75));
				myWidth = Math.round(myWidth * 0.95);
			} else {
				myWidth =Math.round( myWidth * 0.95);
				sWidth = myWidth;
			}
			jQuery('.sapRULDecisionTableSCellFocus').css('min-width',myWidth);
			jQuery('.sapRULDecisionTableSCellFocus').css('max-width', sWidth);
		};
		

		//.css("fontSize");
		DecisionTableCellExpressionAdvanced.prototype._handleValidation = function() {
			this.validateExpression();
			this._showErrorMessage();
			if ((this.getProperty("valueStateText"))) {
				this.codeMirror.options.expressionEditor._showPopUp();
			}

		};

		return DecisionTableCellExpressionAdvanced;

	}, /* bExport= */ true);
