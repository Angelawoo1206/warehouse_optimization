/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.DecisionTableCell.
sap.ui.define([
		"jquery.sap.global",
		"./library", 
		"sap/rules/ui/DecisionTableCellExpressionAdvanced",
		"sap/rules/ui/type/DecisionTableCell",
	],
	function(jQuery, library, DecisionTableCellExpressionAdvanced, DecisionTableCellFormatter) {
		"use strict";

		/**
		 * Constructor for a new DecisionTableCellExpressionAdvanced sap.rules.ui.DecisionTableCell.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * Some class description goes here.
		 * @extends  sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.44.3
		 *
		 * @constructor
		 * @public
		 * @alias sap.rules.ui.DecisionTableCellExpressionAdvanced
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var DecisionTableCell = sap.ui.core.Control.extend("sap.rules.ui.DecisionTableCell", {
			metadata: {

				library: "sap.rules.ui",
				properties: {
					/**
					 * Defines the value of the control.
					 */
					valuePath: {
						type: "string",
						defaultValue: "",
						bindable: "bindable"
					},
					/**
					 * Defines the header value of the control.
					 */
					headerValuePath: {
						type: "string",
						defaultValue: "",
						bindable: "bindable"
					},
					/**
					 * Defines the fixed operator value of the control.
					 */
					fixedOperatorPath: {
						type: "string",
						defaultValue: "",
						bindable: "bindable"
					},
					/**
					 * The business data type of the expression (e.g. String, Number, Boolean).
					 * The default value <code>sap.rules.ui.ExpressionType.All</code> means that all valid business data types are permitted.
					 */
					typePath: {
						typePath: "string", // "sap.rules.ui.ExpressionType",
						//defaultValue: sap.rules.ui.ExpressionType.All,
						bindable: "bindable"
					},
					/**
					 * Defines the text that appears in the value state message pop-up.
					 */
					valueStateTextPath: {
						type: "string",
						defaultValue: "null",
						bindable: "bindable"
					},
					/**
					 * Defines the name of the value model - which contains the cell value when focus-in (ODataModel)
					 */
					valueModelName: {
						type: "string",
						defaultValue: "",
						bindable: "bindable"
					},
					/**
					 * Defines the name of the display model - which contains the cell value when focus-out
					 */
					displayModelName: {
						type: "string",
						defaultValue: "",
						bindable: "bindable"
					},
					/**
					 * Defines whether the control can be modified by the user or not.
					 * <b>Note:<b> A user can tab to a non-editable control, highlight it, and copy the text from it.
					 */
					editable: {
						type: "boolean",
						defaultValue: true
					},
					// valueState: {
					// 	type: "sap.ui.core.ValueState",
					// 	defaultValue: sap.ui.core.ValueState.None
					// },
					// /**
					//  * Defines the text that appears in the value state message pop-up.
					//  */
					// valueStateText: {
					// 	type: "string",
					// 	defaultValue: null
					// },
					inFocus: {
						type: "boolean",
						defaultValue: false
					}
				},
				aggregations: {

					// A hidden text area is provided for the codemirror rendering.
					_displayedControl: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					}
				},
				associations: {

					/**
					 * Association to the expression language element.
					 */
					expressionLanguage: {
						type: "sap.rules.ui.services.ExpressionLanguage",
						multiple: false,
						validateOnLoad: true,
						singularName: "expressionLanguage"
					}
				}
			}
		});

			DecisionTableCell.prototype.onFocusOut = function() {
			this.setInFocus(false);
		};
		
		DecisionTableCell.prototype.onClick = function() {
			this.setInFocus(true);
		};

		DecisionTableCell.prototype.onFocusIn = function() {
			this.setInFocus(true);
		};
		DecisionTableCell.prototype.onBeforeRendering = function() {
			//this._setErrorStatus();
			this._setDisplayedControl();
		};
		DecisionTableCell.prototype.onAfterRendering = function() {

		//	jQuery(".sapRULDecisionTableSCell .sapMInputBaseErrorInner").css("border-style", "solid");
		/*	if (this.getInFocus()) {
				$(".sapRULDecisionTableSCell").css("position", "absolute");
				$(".sapRULDecisionTableSCell").css("top", "0px");
			}*/

		};
		
		DecisionTableCell.prototype.init =  function() {
			this._decisionTableCellFormatter = new DecisionTableCellFormatter();
		}
			
		DecisionTableCell.prototype._setDisplayedControl = function() {
			var oDisplayedControl = this.getAggregation("_displayedControl");
            var oRB = this.getParent().getParent().getParent();
			if (this.getInFocus() && oRB.getEditable()) {
				oDisplayedControl = this._createExpressionEditor();
			} else {
				oDisplayedControl = this._createStaticControl();
			}
			this.setAggregation("_displayedControl", oDisplayedControl, true);
		};

		DecisionTableCell.prototype._createStaticControl = function() {
			/*eslint consistent-this: ["error", "me"]*/
			var me = this;
			var oDisplayedControl = this.getAggregation("_displayedControl");
			if (!(oDisplayedControl instanceof sap.m.Input)) {
				if (oDisplayedControl) {
					oDisplayedControl.destroy();
				}
				oDisplayedControl = new sap.m.Input({
					editable: false
				});
				oDisplayedControl.addStyleClass("sapRULDecisionTableSCellTextOverflow");

				oDisplayedControl.addDelegate({
					onfocusin: function() {
						me.onFocusIn();
					}
				});
				oDisplayedControl.addDelegate({
					onclick: function(oEvent) {
						me.onFocusIn();
					}
				});
			}
			
			var valuePath = this.getDisplayModelName() + ">" + this.getValuePath();
			if (valuePath && valuePath !== "null") {
				oDisplayedControl.bindValue(valuePath);
				oDisplayedControl.bindProperty("tooltip", {
					path: valuePath,
					formatter: function(sValue) {
						return  sValue;
					}
				});	
			}
			
			var valueStatePath = this.getValueStateTextPath();
			if (valueStatePath && valueStatePath !== "null") {
				oDisplayedControl.bindProperty("valueState", {
					path: valueStatePath,
					formatter: function(sValue) {
						if (sValue) {
							oDisplayedControl.addStyleClass("sapMInputBaseErrorInner");
							//oDisplayedControl.addStyleClass("sapMInputBaseStateInner sapMInputBaseErrorInner");
							return sap.ui.core.ValueState.Error;
						}
						
						oDisplayedControl.removeStyleClass("sapMInputBaseErrorInner");
						return sap.ui.core.ValueState.None; 
					}
				});	
			}
				
			return oDisplayedControl;
		};

		DecisionTableCell.prototype._createExpressionEditor = function() {
			var oExpressionEditor = new DecisionTableCellExpressionAdvanced({
				editable: this.getEditable(),
				expressionLanguage: this.getExpressionLanguage(),
				focusOnLoad: true
				//valueStateText: "{" + this.getValueStateTextPath() + "}"
			});
			
			var displayValuePath = this.getDisplayModelName() + ">" + this.getValuePath();
			var valuePath = this.getValueModelName() ? this.getValueModelName() + ">" + this.getValuePath() : this.getValuePath();
			var displayHeaderPath = this.getDisplayModelName() ? this.getDisplayModelName() + ">" + this.getHeaderValuePath() : this.getHeaderValuePath();
			if (valuePath && valuePath !== "null") {
				if (!this.getTypePath()){
					oExpressionEditor.bindValue({
						parts: [{
							path: displayHeaderPath
						}, {
							path: this.getFixedOperatorPath()
						}, {
							path: valuePath
						}, {
							path: displayValuePath
						}],
						type: this._decisionTableCellFormatter
					});
				} else {
					oExpressionEditor.bindValue({
						parts: [{
							path: valuePath
						}, {
							path: this.getTypePath()
						}, {
							path: displayValuePath
						}],
						type: this._decisionTableCellFormatter
					});
				}
			}
			
			if (this.getTypePath()) {
				oExpressionEditor.bindType(this.getTypePath());
			}
			
			if (displayHeaderPath) {
				oExpressionEditor.bindHeaderValue(displayHeaderPath);
				if (this.getFixedOperatorPath()) {
					oExpressionEditor.bindFixedOperator(this.getFixedOperatorPath());
				}
			}
			
			var valueStatePath = this.getValueStateTextPath();
			if (valueStatePath && valueStatePath !== "null") {
				oExpressionEditor.bindValueStateText(valueStatePath);
			}

			oExpressionEditor.addDelegate({
				onfocusout: (function(oEvent) {
					var oExpressionAdvanced = this.getAggregation("_displayedControl"); // Displayed controled is EA when focus out
					if (!oExpressionAdvanced.codeMirror || 
						(oExpressionAdvanced.codeMirror.state &&
						oExpressionAdvanced.codeMirror.state.completionActive)) {
						return;
					} 
                    var relatedTarget = oEvent.relatedTarget;
	                var ua = window.navigator.userAgent;
	                var msie = ua.indexOf("MSIE ");
	                if (relatedTarget) {
	                    if (relatedTarget.id && (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) && relatedTarget.id === "content") { // If Internet Explorer and user click on the same Expression Advanced
	                        return;
	                    }
	                }
					this.onFocusOut();
				}).bind(this)
			});
			
			return oExpressionEditor;
		};
		
		DecisionTableCell.prototype.setExpressionLanguage = function (oExpressionLanguage){
			this._decisionTableCellFormatter.setExpressionLanguage(oExpressionLanguage);
			return this.setAssociation("expressionLanguage", oExpressionLanguage, true);
		};
		
		return DecisionTableCell;

	}, /* bExport= */ true);