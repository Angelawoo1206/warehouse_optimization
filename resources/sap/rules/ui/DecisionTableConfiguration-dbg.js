/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.DecisionTableConfiguration
sap.ui.define([
	"jquery.sap.global", 
	"./library", 
	"sap/ui/core/Element"
], function(jQuery, library, Element) {
	"use strict";

	/**
	 * Constructor for a new DecisionTableConfiguration.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The <code>sap.rules.ui.DecisionTableConfiguration</code>  element provides the ability to define specific properties that will be applied when rendering the <code>sap.rules.ui.RuleBuilder</code> in decision table mode.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.44.3
	 *
	 * @constructor
	 * @public
	 * @since 1.4
	 * @alias sap.rules.ui.DecisionTableConfiguration
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DecisionTableConfiguration = Element.extend("sap.rules.ui.DecisionTableConfiguration", { 
	
		metadata : {
			library : "sap.rules.ui",
			properties : {
				/**
				 * Specifies how a cell in a decision table is formulated by the user creating the rule.
				 */
				cellFormat: {
					type: "sap.rules.ui.DecisionTableCellFormat",
					defaultValue: sap.rules.ui.DecisionTableCellFormat.Both
				},
			    /**
				 * Specifies how the output of the determination process is handled in decision tables in cases where more than one rule in the table is matched for a given set of inputs.
				 */
				hitPolicies: {
					type: "sap.rules.ui.RuleHitPolicy[]",
					defaultValue: [sap.rules.ui.RuleHitPolicy.FirstMatch, sap.rules.ui.RuleHitPolicy.AllMatch]
				},
//Specifies if the 'Settings' button is available in the toolbar of the decision table; the Settings button launches the Settings popup which allows the user creating the rule to configure the layout and columns of the decision table. 
				/**
				 * @experimental Currently released as an experimental property and support only false mode.
				 */
				enableSettings: {
					type: "boolean",
					defaultValue: false 
				}
			},
			events:{
				change:{
					parameters :{
						name:{},
						value:{}
					}
				}
			}
		},
		
		_handlePropertySetter: function(sPropertyName, value){
			var result = this.setProperty(sPropertyName, value, true);
			this.fireChange({name: sPropertyName, value: value});
			return result;
		},
		
		setCellFormat: function (sValue){
			return this._handlePropertySetter("cellFormat", sValue);	
		},
		
		setHitPolicies: function (aValue){
			return this._handlePropertySetter("hitPolicies", aValue);	
		},
		
		setEnableSettings: function(bValue){
			return this._handlePropertySetter("enableSettings", bValue);
		}
	});

	return DecisionTableConfiguration;

}, /* bExport= */ true);