/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides this._validatecontrol sap.rules.ui. 
sap.ui.define([
	"jquery.sap.global",
	"./library",
	"sap/rules/ui/DecisionTableCell",
	"sap/rules/ui/RuleBase",
	"sap/rules/ui/Utils",
	"sap/ui/table/Table",
	"sap/ui/table/Column",
	"sap/m/Toolbar",
	"sap/m/Popover",
	"sap/ui/unified/Menu",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/ToolbarSpacer",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ObjectIdentifier",
	"sap/m/Link",
	"sap/m/Label",
	"sap/m/BusyIndicator",
	"sap/m/DisplayListItem",
	"sap/ui/unified/MenuItem",
	"sap/m/FlexBox",
	"sap/m/MessageStrip",
	"sap/rules/ui/type/DecisionTableHeader"
], function(jQuery, library, DecisionTableCell, RuleBase, Utils, Table, Column, Toolbar,
	Popover, Menu, Dialog, Button, ToolbarSpacer, Text, Input, ObjectIdentifier,
	Link, Label, BusyIndicator, DisplayListItem, MenuItem, FlexBox, MessageStrip, DecisionTableHeaderFormatter) {
	"use strict";

	/**
	 * Constructor for a new DecisionTable Control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Some class description goes here.
	 * @extends  Control
	 *
	 * @author SAP SE
	 * @version 1.44.3
	 *
	 * @constructor
	 * @private
	 * @alias sap.rules.ui.DecisionTable
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) design time meta model
	 */
	
	var dataPartName = {
		vocabulary: "vocabulary",
		rule: "rule",
		columns: "columns",
		rows: "rows"
	};
	
	var visibleRowCount = {
		emptyTable: 3,
		max: 10
	};
	
	var oDecisionTable = RuleBase.extend("sap.rules.ui.DecisionTable", {
		metadata: {
			properties: {

				enableSettings: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				hitPolicies: {
					type: "sap.rules.ui.RuleHitPolicy[]",
					defaultValue: [sap.rules.ui.RuleHitPolicy.FirstMatch, sap.rules.ui.RuleHitPolicy.AllMatch]
				}
			},
			aggregations: {

				"_toolbar": {
					type: "sap.m.Toolbar",
					multiple: false,
					singularName: "_toolbar"
				},

				"_table": {
					type: "sap.ui.core.Control",
					multiple: false,
					singularName: "_table"
				},

				"_errorsText": {
					type: "sap.m.MessageStrip",//"sap.m.Text",
					multiple: false,
					singularName: "_errorsText"
				}
			}
		},

		_addErrorLabel: function() {

			//var oErrorLabel = new sap.m.Text().addStyleClass("sapThemeCriticalText").addStyleClass("sapUiSmallMargin");
			var oErrorLabel = new MessageStrip({
				showCloseButton: true,
				showIcon: true,
				type: sap.ui.core.MessageType.Error,
				visible: false
			}).addStyleClass("sapUiTinyMargin");
			this.setAggregation("_errorsText", oErrorLabel, true);
		},
		
		init: function() {
            
            this.multiHeaderFlag = false; //flag for calculate only once header span for multi header in columnFactory function
			this.resetContent = true;

			this._initInternalModel();
			this._initDisplayModel();
			this._initDataBucket();
			
			this.bindProperty("busy", "dtModel>/busyState");
			
			this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");

			this._addToolBar();
			this._addTable();
			this._addErrorLabel();
			this._decisionTableHeaderFormatter = new DecisionTableHeaderFormatter();
			this.setBusyIndicatorDelay(0);
		},

		/** Control's properties getters/setters */

		setEditable: function(value) {
            
			this.setProperty("editable", value, true);
			this._internalModel.setProperty("/editable", value);
            var oTable = this.getAggregation("_table");
            var oToolbar = this.getAggregation("_toolbar");
            if (value === false) {
                oTable.addStyleClass("sapRULDecisionTableEdit");
                oToolbar.removeStyleClass("sapRULDecisionTableToolBar"); 
            } else {
                oTable.removeStyleClass("sapRULDecisionTableEdit");
                oToolbar.addStyleClass("sapRULDecisionTableToolBar"); 
            }

/*			if (value === true) {
				this.validate();
			} else {
				this._clearErrorMessages();
			}*/

			return this;
		},

		setExpressionLanguage: function(value) {

			this.setAssociation("expressionLanguage", value, true);

			this._decisionTableHeaderFormatter.setExpressionLanguage(this.getExpressionLanguage());
			
			var expressionLanguage = (value instanceof Object)? value : sap.ui.getCore().byId(value);
			if (!expressionLanguage) {
				return this;
			}
			
			// if table has been built already - refresh it
			var oTable = this.getAggregation("_table");
			if (oTable) {
				var columnBinding = oTable.getBinding("columns");
				if (columnBinding) {
					columnBinding.refresh();
				}
			}
			
			if (expressionLanguage._isDataExist()) {
				var oEvent = new sap.ui.base.Event("", "", {
					data: true
				});
				this._handleVocabularyDataChanged(oEvent);
			}
			
			expressionLanguage.attachDataChange(this._handleVocabularyDataChanged.bind(this));

			return this;
		},

		setEnableSettings: function(value) {

			this.setProperty("enableSettings", value, true);
			this._internalModel.setProperty("/enableSettings", value);

			return this;
		},

		setHitPolicies: function(value) {

			this.setProperty("hitPolicies", value, true);
			this._internalModel.setProperty("/hitPolicies", value);

			return this;
		},

		_initInternalModel: function() {

			var data = {};

			data.editable = this.getEditable();

			data.newTable = true;
			
			data.busyState = true;
			data.busyTableState = true;

			data.hitPolicies = this.getHitPolicies();
			data.enableSettings = this.getEnableSettings();
			data.isAtLeastOneRowSelected = false;
			data.validationStatus = {};

			this._internalModel = new sap.ui.model.json.JSONModel(data);
			this.setModel(this._internalModel, "dtModel");
		},
		
		_initDisplayModel: function() {
			this._displayModel = new sap.ui.model.json.JSONModel();
			this.setModel(this._displayModel, "displayModel");	
		},
		
		_initDataBucket: function() {
			var vocaDataReceived = false;
		
			var oEL = sap.ui.getCore().byId(this.getExpressionLanguage());
			if (oEL && oEL._isDataExist()) {
				vocaDataReceived = true;
			}
			
			this.dataBucket = {
				dataReceived: {
					vocabulary: vocaDataReceived,
					rule: false,
					rows: false,
					columns: false
				},
				rows: {},
				columns: {},
				collectRowsMode: "replace" // "append"
			};
		},
		
		_setDataLoadedPromise: function() {
			if (!this._dataLoaded || this._dataLoaded.state() !== "pending") {
				this._dataLoaded = new jQuery.Deferred();
			}	
		},
		
		_getDataLoadedPromise: function() {
			
			if (!this._dataLoaded) {
				this._setDataLoadedPromise();
			}
			
			return this._dataLoaded.promise();
		},
		
		setBindingContextPath: function(value) {
			var oldValue = this.getBindingContextPath();
			if (oldValue !== value) {
				this._unbindRule();
				this._unbindRows();
				this._unbindColumns();
				this.setProperty("bindingContextPath", value);
				this.resetContent = true;
				
				// reset dataBucket now (don't wait for onBeforeRendering), 
				// attemption for preventing possible convertAndFormat with wrong data
				this._initDataBucket();
			}

			return this;
		},

		setModelName: function(value) {
			this.setProperty("modelName", value);
			this.resetContent = true;

			return this;
		},
		
		resetControl: function() {
			
			this._unbindRule();
			this._unbindRows();
			this._unbindColumns();
			
			this._clearErrorMessages();
			this._initDataBucket();
			this._initDisplayModel();
			
			this._updateBusyState();
						
			var oModel = this._getModel();
			var bindingContextPath = this.getBindingContextPath();

			if (!bindingContextPath || !oModel) {
				return;
			}
			var oContext = new sap.ui.model.Context(oModel, bindingContextPath);
			this.setBindingContext(oContext);	
			
			this._bindRule();
			this._bindRows();
			this._bindColumns();
		},

		/*
		 * @private
		 */
		_openTableSettings: function() {

			var oDialog = this._createDialog();

			oDialog.open();

			// performance improvements, avoid unnecessary table updates & rerenderings
			this._unbindColumns();
		},

		_createDialog: function() {

			var oDecisionTableSettings = new sap.rules.ui.DecisionTableSettings({
				expressionLanguage: this.getExpressionLanguage(),
				hitPolicies: "{dtModel>/hitPolicies}",
				newDecisionTable: this._internalModel.getProperty("/newTable")
			});

			var oModel = this._getModel();
			oDecisionTableSettings.setModel(oModel);
			oDecisionTableSettings.setModel(this._internalModel, "dtModel");

			var oContext = this.getBindingContext();
			oDecisionTableSettings.setBindingContext(oContext);

			var oDialog = new Dialog({
				contentWidth: "70%",
				title: this.oBundle.getText("tableSettings")
			});

			oDialog.addContent(oDecisionTableSettings);

			oDialog.attachBeforeClose(function() {

				// Workaround: we submit changes, because if we change a cell and then open this dialog and close it,
				// the cell display value will not be the same as the cell value when in-focus
				this.getModel().submitChanges();
				oDialog.destroy();
				
				this._initDisplayModel();
				this._bindColumns();
				
				this._refreshBinding();
			}, this);

			var oCloseButton = new Button({
				text: this.oBundle.getText("applyChangesBtn")
			}).setTooltip(this.oBundle.getText("applyChangesBtn"));

			oCloseButton.attachPress(function() {
                this.multiHeaderFlag = false; //flag for calculate only once header span for multi header in columnFactory function
				oDialog.close();
			}, this);

			oDialog.addButton(oCloseButton);

			return oDialog;
		},

		_getBindModelName: function() {
			var path = "";
			var modelName = this.getModelName();

			if (modelName) {
				path = modelName + ">";
			}

			return path;
		},

		_getModel: function() {
			var modelName = this.getModelName();
			if (modelName) {
				return this.getModel(modelName);
			}

			return this.getModel();
		},

		// a: function() {
		// 	this.getBinding("rows").attachChange(function(someParams) {

		// 	});

		// 	// or

		// 	this.bindRows({path: "", factory: function(){}, events: {change: function(){}}});
		// },

		columnFactory: function(sId, oContext) {
            
            if (this.multiHeaderFlag) {
                this.multiHeaderFlag = false;
            }
            
            var relativePath = this._getBindModelName();
            
			var column = new Column(sId, {
				width: "auto",
				multiLabels: [
					this._createColIfThenHeader(oContext), // The order of the labels is important!
					this._createColDescriptionHeader(oContext)
				],
				template: this._createCell(oContext)//, headerSpan: columnType === sap.rules.ui.DecisionTableColumn.Condition ? [this.iNumOfCondition, 1] : [this.iNumOfResults, 1]
			});

			column.isConditionOrFirstResultColumn = !this.firstResultColumnBound;

			var relativePath = this._getBindModelName();
			this.firstResultColumnBound = oContext.getProperty(relativePath + "Type") === sap.rules.ui.DecisionTableColumn.Result;
			return column;
		},

		_createColDescriptionHeader: function(oContext) {

			var relativePath = this._getBindModelName(),
				columnType = oContext.getProperty(relativePath + "Type"),
				coId = oContext.getProperty(relativePath + "Id"),
				ruleId = oContext.getProperty(relativePath + "RuleId"),
				version = oContext.getProperty(relativePath + "Version");

			var headerPath;

			var oHeaderKey = {
				RuleId : ruleId,
				Id : coId,
				Version: version
			};
			
			var numOfLines = document.getElementsByClassName("sapUiSizeCozy").length > 0 ? 3 : 1;
			
			var oText = new Text({
					maxLines: numOfLines
				}).addStyleClass("sapRULDecisionTableColumnHeaderLabel");
			
			//Condition header text
			if (columnType === sap.rules.ui.DecisionTableColumn.Condition){
				headerPath = relativePath + oContext.getModel().createKey("/DecisionTableColumnConditions", oHeaderKey);
				oText.bindText({
					parts:[{path: headerPath + "/Expression"}, {path: headerPath + "/FixedOperator"}],
					type: this._decisionTableHeaderFormatter
				});
				
				oText.bindProperty("tooltip", {
					parts:[{path: headerPath + "/Expression"}, {path: headerPath + "/FixedOperator"}],
					type: this._decisionTableHeaderFormatter
				});				
			
			//Result header text
			} else if (columnType === sap.rules.ui.DecisionTableColumn.Result) {
				headerPath = relativePath + oContext.getModel().createKey("/DecisionTableColumnResults", oHeaderKey);
				oText.bindText({
					path: headerPath + "/DataObjectAttributeName"
				});
				
				oText.bindProperty("tooltip", {
					path: headerPath + "/DataObjectAttributeName"
				});					
			}
			
			return oText;
		},


		_createColIfThenHeader: function(oContext) {
			//var model = oContext.getModel();
			var relativePath = this._getBindModelName();
			var oBundle = this.oBundle;

			return new Label({
				text: {
					parts: [{
						path: relativePath + "Type"
					}, {
						path: relativePath + "Id"
					}],
					formatter: function(sType, iColId) {
						if (iColId === 1) {
							return oBundle.getText("conditionIfColumn");
						} else if (sType === sap.rules.ui.DecisionTableColumn.Result && this.getParent().isConditionOrFirstResultColumn) {
							return oBundle.getText("resultThenColumn");
						} else {
							return "";
						}
					}
				},
				design: "Bold"
			});
		},

		_createCell: function(oContext) {
			var colID = oContext.getProperty("Id");
			var colType = oContext.getProperty("Type");

			return new DecisionTableCell({
				editable: "{dtModel>/editable}",
				expressionLanguage: this.getExpressionLanguage(),
				displayModelName: "displayModel"
				//	type: sap.rules.ui.ExpressionType.BooleanEnhanced

			}).data({
				colId: colID,
				colType: colType,
				table: this.getAggregation("_table")
			});
		},

		_updateTableCell: function(oCell, oRowContext, dtDomElement, rowIndex) {

			var path = "null";

			if (oRowContext) {
				var colId = oCell.data("colId");
				var rowId = oRowContext.getProperty("Id");
				var ruleId = oRowContext.getProperty("RuleId");
				var version = oRowContext.getProperty("Version");

				var headerPath = '';
				// NOTE: we assume that colId represents also the order of Columns and starts from 1
				var cellBindingPath =  "DecisionTableRowCells(RuleId='"+ruleId+"',Version='"+version+"',RowId="+rowId+",ColId="+colId+")"

				//var bindModelName = oCell.data("bindModelName");

				var cellKeyProperties = {
							RuleId: ruleId,
							Id: colId,
							Version: version
				};
				
				path = "/" +
					cellBindingPath +
					"/Content";

				switch (oCell.data("colType")) {
					case "CONDITION":
						headerPath = "/" + oRowContext.getModel().createKey("DecisionTableColumnConditions", cellKeyProperties);
						oCell.setHeaderValuePath(headerPath + '/Expression');
						oCell.setFixedOperatorPath(headerPath + '/FixedOperator');
						break;
					case "RESULT":
						headerPath =  "/" + oRowContext.getModel().createKey("DecisionTableColumnResults", cellKeyProperties);
						oCell.setTypePath(headerPath + '/BusinessDataType');
						break;

					default:

						break;
				}

				oCell.setValueStateTextPath("dtModel>/validationStatus/" + "RowId=" + rowId + ",ColId=" + colId);
			}

			oCell.setValuePath(path);
		},
		
		_bindRule: function() {
			var bindingPath = [this._getBindModelName(), this.getBindingContextPath()].join("");
			this.bindElement({
				path: bindingPath,
				parameters: {
					expand: "DecisionTable"
				}
			});
			
			this.getElementBinding().attachDataRequested(this._handleRuleDataRequested, this);
			this.getElementBinding().attachDataReceived(this._handleRuleDataReceived, this);
			
			// force data load (otherwise if data exists there is no data fetch)
			this.getElementBinding().refresh();
		},
		
		_unbindRule: function() {
			this.unbindElement();
		},
		
		_bindColumns: function() {
			var oTable = this.getAggregation("_table");
			var bindingPath = [this._getBindModelName(), this.getBindingContextPath(), "/DecisionTable/DecisionTableColumns"].join("");
			//var bindingPath = [this._getBindModelName(), "DecisionTable/DecisionTableColumns"].join("");
            console.log("Hi");
			oTable.bindColumns({
				path: bindingPath,
				parameters: {
					expand: "Condition,Result"
				},
				factory: this.columnFactory.bind(this)
			});	

			oTable.getBinding("columns").attachDataRequested(this._handleColumnsDataRequested, this);
			oTable.getBinding("columns").attachDataReceived(this._handleColumnsDataReceived, this);			
		},

		_unbindColumns: function() {
			var oTable = this.getAggregation("_table");
			oTable.unbindColumns();
		},

		_bindRows: function() {
			var oTable = this.getAggregation("_table");
			var bindingPath = [this._getBindModelName(), this.getBindingContextPath(), "/DecisionTable/DecisionTableRows"].join("");
			//var bindingPath = [this._getBindModelName(), "DecisionTable/DecisionTableRows"].join("");
	
			oTable.bindRows({
				path: bindingPath,
				parameters: {
					expand: "Cells"
				}
			});
			
			oTable.getBinding("rows").attachDataRequested(this._handleRowsDataRequested, this);
			oTable.getBinding("rows").attachDataReceived(this._handleRowsDataReceived, this);
		},

		_unbindRows: function() {
			var oTable = this.getAggregation("_table");
			oTable.unbindRows();
		},
		
		_refreshBinding: function() {
			var oTable = this.getAggregation("_table");
			
			var ruleBinding = this.getElementBinding();
			if (ruleBinding) {
				ruleBinding.refresh();
			}
		
			var columnBinding = oTable.getBinding("columns");
			if (columnBinding) {
				columnBinding.refresh();
			}
			
			var rowBinding = oTable.getBinding("rows");
			if (rowBinding) {
				rowBinding.refresh();
			}
		},
		
		// rule		
		_handleRuleDataRequested: function() {
			this._dataPartRequested(dataPartName.rule);
		},
		
		_handleRuleDataReceived: function(data) {
			if (data) {
				this._dataPartReceived(dataPartName.rule);
			}
		},
		
		// cols
		_handleColumnsDataRequested: function(oEvent) {
			this._dataPartRequested(dataPartName.columns);
		},
		
		_handleColumnsDataReceived: function(oEvent) {			
			var data = oEvent.getParameter("data");
			
			if (!data) {
				return;
			}
			
			// change newTable flag			
			// set table.noData according to newTable flag			
			var oTable = this.getAggregation("_table");			
			if (data.results && data.results.length > 0) {				
				
				this._internalModel.setProperty("/newTable", false);
				oTable.setNoData(null);
				
			} else {
				
				this._internalModel.setProperty("/newTable", true);
				var blankContent = this._getBlankContent();
				oTable.setNoData(blankContent);
			}
			
			this.dataBucket[dataPartName.columns] = data;
			
			this._dataPartReceived(dataPartName.columns);
            
            this._handleHeaderSpan();
		},
		
		// rows
		_handleRowsDataRequested: function(oEvent) {
			this._dataPartRequested(dataPartName.rows);			
		},
		
		_handleRowsDataReceived: function(oEvent) {
			
			var data = oEvent.getParameter("data");
			if (data) {	
				if (this.dataBucket.collectRowsMode === "replace") {
					this.dataBucket[dataPartName.rows] = data;
					this.dataBucket.collectRowsMode = "append";
				} else {
					// "append"
					var previousData = this.dataBucket[dataPartName.rows];
					var newData = {
						results: (previousData.results) ? previousData.results.concat(data.results) : data.results
					};
					
					this.dataBucket[dataPartName.rows] = newData;
				} 
				
				
				this._dataPartReceived(dataPartName.rows);
			}
			
			this._setTableRows();
		},
		
		// vocabulary
		_handleVocabularyDataChanged: function(oEvent) {
			var data = oEvent.getParameter("data");
			if (data) {
				this._handleVocabularyDataReceived(data);
			} else {
				this._handleVocabularyDataRequested();
			}
		},
		
		_handleVocabularyDataRequested: function() {
			this._dataPartRequested(dataPartName.vocabulary);			
		},
		
		_handleVocabularyDataReceived: function(data) {
			if (data) {
				this._dataPartReceived(dataPartName.vocabulary);
			}
		},
		
		// dataBucket		
		_dataPartRequested: function(partName) {
			this.dataBucket.dataReceived[partName] = false;
			this._setDataLoadedPromise();
			this._updateBusyState();
		},
		
		_dataPartReceived: function(partName) {
			this.dataBucket.dataReceived[partName] = true;
			
			if (!this._isAllDataReceived()) {					
				return;
			}
			
			var isNewTable = this._internalModel.getProperty("/newTable");
			if (isNewTable) {
				this._updateBusyState();
				return;
			}
			
			try {
				this._convertAndValidate();
				this.dataBucket.collectRowsMode = "replace";
			} catch (sError) {
				// show message Toast
				window.console.log(sError);
			}
			this._updateBusyState();
			
			this._dataLoaded.resolve();
		},
		
		_isAllDataReceived: function() {
			var dataParts = this.dataBucket.dataReceived;
			return dataParts.rule && dataParts.rows && dataParts.columns && dataParts.vocabulary;
		},
		
		_updateBusyState: function() {
			var dataParts = this.dataBucket.dataReceived;
			var dataReceived = dataParts.rule && dataParts.columns && dataParts.vocabulary;
			var isBusy = !dataReceived;
			
			this._internalModel.setProperty("/busyState", isBusy);
			
			var tableIsBusy = !dataParts.rows;
			this._internalModel.setProperty("/busyTableState", tableIsBusy);
		},
		
		// ---------------------

		_decideSettingsEnablement: function(enableSettings, editable) {
			return enableSettings && editable;
		},

		_decideDeleteRowEnablement: function(newTable, isAtLeastOneRowSelected) {
			return newTable === false && isAtLeastOneRowSelected;
		},

		_decideAddRowEnablement: function(newTable) {
			return !newTable;
		},


		/*
		 * @private
		 */
		_addToolBar: function() {

			var oToolbar = new Toolbar({
				design: "Transparent",
				enabled: "{dtModel>/editable}"
			}); 
            
            var oTitle = new sap.m.Title({
                text: this.oBundle.getText("decisionTable")
            })

			var oSettingsButton = new Button({
				text: "",
				press: this._openTableSettings.bind(this),
				visible: {
					parts: [{
						path: "dtModel>/enableSettings"
					}, {
						path: "dtModel>/editable"
					}],
					formatter: this._decideSettingsEnablement
					},
				enabled: {
					parts: [{
						path: "dtModel>/enableSettings"
					}, {
						path: "dtModel>/editable"
					}],
					formatter: this._decideSettingsEnablement
				}//,
				// type: {
				// 	path: "dtModel>/validationStatus/errorInColumnHeader",
				// 	formatter: function(bValue) {
				// 		if (bValue) {
				// 			return sap.m.ButtonType.Reject;
				// 		} else {
				// 			return sap.m.ButtonType.Transparent;
				// 		}
				// 	}
				// }
			}).setTooltip(this.oBundle.getText("tableSettings"));

			oSettingsButton.setIcon("sap-icon://action-settings");
			
			var oDeleteLink = new Link({

				text: this.oBundle.getText("deleteRow"),
				// press: [this._deleteRow, this],
				press: [this._deleteRowWorkaround, this],
				visible: "{dtModel>/editable}",
				enabled: {
					parts: [{
						path: "dtModel>/newTable"
					}, {
						path: "dtModel>/isAtLeastOneRowSelected"
					}],
					formatter: this._decideDeleteRowEnablement
				}
			}).setTooltip(this.oBundle.getText("deleteRow"));
			
			var oAddLink = new Link({
				text: this.oBundle.getText("addRow"),
				visible: "{dtModel>/editable}",
				enabled: {
					parts: [{
						path: "dtModel>/newTable"
					}],
					formatter: this._decideAddRowEnablement
				},
				press: function(oEvent) {
					// do not use oParent. find another way
					this.oMenu = new Menu({
						items: this._getMenuItems()
					});
					var eDock = sap.ui.core.Popup.Dock;
					this.oMenu.open("keyup", oAddLink, eDock.CenterTop, eDock.CenterBottom, oAddLink);
				}.bind(this)
			}).setTooltip(this.oBundle.getText("addRow"));

			//var objectIdentifier = new ObjectIdentifier({
			//	title: this.oBundle.getText("decisionTable"),
			//	text: ""
			//});
			oToolbar.addContent(new ToolbarSpacer({
				width: "1em"
			}));

			//oToolbar.addContent(objectIdentifier);
			//oToolbar.addContent(new ToolbarSpacer({
			//	width: "1em"
			//}));

			oToolbar.addContent(oTitle);
			oToolbar.addContent(new ToolbarSpacer({}));
			oToolbar.addContent(oAddLink);
			oToolbar.addContent(new ToolbarSpacer({
				width: "1em"
			}));
			oToolbar.addContent(oDeleteLink);
			oToolbar._delete = oDeleteLink;
			oToolbar.addContent(new ToolbarSpacer({
				width: "1em"
			}));
			
			oToolbar.addContent(oSettingsButton);
			oToolbar.addContent(new ToolbarSpacer({
				width: "1em"
			}));

			this.setAggregation("_toolbar", oToolbar, true);
		},

		_addNewRowWorkaround: function(selectedRow, bFirst) {
			this._addNewRow(selectedRow, bFirst);
			this._saveWorkAround();
		},

		_addNewRow: function(selectedRow, bFirst) {
			var oMenu = this.oMenu;
			if (oMenu) {
				oMenu.close();
			}

			var oModel = this._getModel();
			var columns = this.dataBucket.columns && this.dataBucket.columns.results;

			if (!oModel || !columns) {
				return;
			}

			var oTable = this.getAggregation("_table"),
				oContext = this.getBindingContext(),
				sRuleId = oContext.getProperty("Id"),
				sVersion = oContext.getProperty("Version");
				
			var oRowData = {
				RuleId: sRuleId,
				Version: sVersion
			};
			if (bFirst) {
				oRowData.Id = 1;
			} else if (selectedRow || selectedRow === 0) {
				oRowData.Id = selectedRow + 2;
			}

			// create row
			oModel.createEntry("/DecisionTableRows", {
				properties: oRowData
			});

			// create cells
			for (var i = 0; i < columns.length; i++) {

				var sColId = columns[i].Id;

				var oCellData = {
					RuleId: sRuleId,
					Version: sVersion,
					RowId: oRowData.Id,
					ColId: sColId,
					Content: ""
				};

				oModel.createEntry("/DecisionTableRowCells", {
					properties: oCellData
				});
			}

			oTable.setSelectedIndex(-1);
			this._clearErrorMessages();
		},

		_deleteRowWorkaround: function() {
			var oModel = this._getModel();

			if (oModel.hasPendingChanges()) {
				// save all model's changes before row removal
				this._saveWorkAround({
					success: function() {
						this._deleteRow();
					}.bind(this)
				});
			} else {
				this._deleteRow();
			}
		},

		_deleteRow: function() {

			var oModel = this._getModel();
			if (!oModel) {
				return;
			}

			var oTable = this.getAggregation("_table"),
			oContext = this.getBindingContext(),
			sRuleId = oContext.getProperty("Id"),
			sVersion = oContext.getProperty("Version");

			var oRowData = {
				RuleId: sRuleId,
				Version: sVersion
			};
			
			var oSelectedRows = [];

			if (oTable) {
				oSelectedRows = oTable.getSelectedIndices();
			}
			if (oSelectedRows.length === 0) {
				return;
			}

			var rowsLength = oSelectedRows.length;

			for (var i = 0; i < rowsLength; i++) {
				oRowData.Id = oSelectedRows[i] + 1;
				var rowPath = oModel.createKey("/DecisionTableRows", oRowData);

				// remove row
				oModel.remove(rowPath);
			}

			oTable.setSelectedIndex(-1);
			this._clearErrorMessages();
		},
		
		_setTableRows: function() {
			var oTable = this.getAggregation("_table");
			var oRowBinding = oTable.getBinding("rows");

			var iVisibleRowCount = visibleRowCount.emptyTable;
			if (oRowBinding && oRowBinding.getLength()) {
				iVisibleRowCount = Math.min(oRowBinding.getLength(), visibleRowCount.max);
			}
			
			var currVisibleRowCount = oTable.getVisibleRowCount();
			if (currVisibleRowCount !== iVisibleRowCount){
				oTable.setVisibleRowCount(iVisibleRowCount);
			}
            if (this.dataBucket.rows.results.length === 0 || !this.getEditable()) {
                oTable.setSelectionMode(sap.ui.table.SelectionMode.None)
            } else {
                oTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle)
            }
		},

		_getMenuItems: function() {
			var oTable = this.getAggregation("_table");
			var oSelectedRows = [];
			if (oTable) {
				oSelectedRows = oTable.getSelectedIndices();
			}

			var oMenuItems = [
				new MenuItem({
					text: this.oBundle.getText("insertFirst"),
					enabled: true,
					// select: this._addNewRow.bind(this, oSelectedRows[0], true)
					select: this._addNewRowWorkaround.bind(this, oSelectedRows[0], true)
				}),
				new MenuItem({
					text: this.oBundle.getText("insertAfter"),
					enabled: oSelectedRows.length === 1 ? true : false,
					// select: this._addNewRow.bind(this, oSelectedRows[0], false)
					select: this._addNewRowWorkaround.bind(this, oSelectedRows[0], false)
				})
			];
			return oMenuItems;
		},
		_rowSelectionChange: function() {
			var oTable = this.getAggregation("_table");
			var oSelectedRows = [];
			if (oTable) {
				oSelectedRows = oTable.getSelectedIndices();
			}

			if (oSelectedRows.length > 0) {
				this._internalModel.setProperty("/isAtLeastOneRowSelected", true);
			} else {
				this._internalModel.setProperty("/isAtLeastOneRowSelected", false);
			}
		},
		_getBlankContent: function() {

			var oLabelContent = new Label({
				text: this.oBundle.getText("start")
			});

			var oSpaceTextContent = new Text();

			oSpaceTextContent.setText("\u00a0");

			var oLinkToSettingsFromBlank = new Link({
				enabled: {
					parts: [{
						path: "dtModel>/enableSettings"
					}, {
						path: "dtModel>/editable"
					}],
					formatter: this._decideSettingsEnablement
				},
				text: " " + this.oBundle.getText("settings"),
				press: [this._openTableSettings, this]
			}).addStyleClass("sapRULDecisionTableLink");

			var oFlexBox = new FlexBox({
				justifyContent: "Center",
				items: [oLabelContent, oSpaceTextContent, oLinkToSettingsFromBlank],
				visible: {
					parts: [{
						path: "dtModel>/enableSettings"
					}, {
						path: "dtModel>/editable"
					}],
					formatter: this._decideSettingsEnablement
					}
			}).addStyleClass("sapUiMediumMargin");

			return oFlexBox;
		},

		_decideSelectionMode: function(editable) {

			return editable ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.None;
		},

		_addTable: function() {
			var oTable = new Table({
				visibleRowCount: visibleRowCount.emptyTable,
				visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Fixed,
				threshold: 20,
				selectionMode: {
					parts: [{
						path: "dtModel>/editable"
					}],
					formatter: this._decideSelectionMode
				},
				rowSelectionChange: function() {
					this.oParent._rowSelectionChange();
				},
				enableColumnReordering: false,
				busy: "{dtModel>/busyTableState}"
			});
			oTable._updateTableCell = this._updateTableCell;
			oTable.setBusyIndicatorDelay(0);

			this.setAggregation("_table", oTable, true);
		},



		_buildMessagesStructure: function(validateResults, columnErrorsMap, headerErrorArray) {

			var detail;
			var additionalInfo;
			var description;
			var errorKey;
		//	var columnErrorsMap = {};

			if (!validateResults.details) {
				return columnErrorsMap;
			}

			for (var w = 0; w < validateResults.details.length; w++) {

				detail = validateResults.details[w];

				if (!detail.messages) {
					continue;
				}

				for (var i = 0; i < detail.messages.length; i++) {

					description = detail.messages[i].description;

					additionalInfo = detail.messages[i].additionalInfo;

					if (additionalInfo.type === "ruleResult") {

						headerErrorArray.push(description);
						errorKey = "genericError"; //ColId=" + additionalInfo.colId;
						columnErrorsMap[errorKey] = headerErrorArray;

					} else if (additionalInfo.type === "column") {
						errorKey = "errorInColumnHeader"; //ColId=" + additionalInfo.colId;
						columnErrorsMap[errorKey] = true;

					} else if (additionalInfo.type === "cell") {
						errorKey = "RowId=" + additionalInfo.rowId + ",ColId=" + additionalInfo.colId;
						columnErrorsMap[errorKey] = description;
					}
				}
			}

			return columnErrorsMap;

		},

		_concatinateHeaderErrors: function(headerErrorsArray) {

			var errorMessage = "";

			for (var i = 0; i < headerErrorsArray.length; i++) {

				errorMessage += "\n" + headerErrorsArray[i];
			}

			return errorMessage;

		},

		_concatinateColumnsHeaderErrors: function(columnErrorsMap) {

			var errorMessage = "";

			for (var column in columnErrorsMap) {
				if (columnErrorsMap.hasOwnProperty(column)) {

					if (columnErrorsMap[column].header) {
						errorMessage += "In Col: " + column + " - " + columnErrorsMap[column].header + "\n";
					}
				}
			}

			return errorMessage;

		},

		// _concatinateRowsErrors: function (columnErrorsMap){

		// 	var errorMessage = "";

		// 	for (var column in columnErrorsMap){
		// 	    if (columnErrorsMap.hasOwnProperty(column)) {
		// 			if (columnErrorsMap[column].rows){
		// 				for (var row in columnErrorsMap[column].rows){
		// 					if (columnErrorsMap[column].rows.hasOwnProperty(row)) {
		// 						errorMessage += "In Row: " + row + " ,Col: " + column + " - " + row.description;
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}

		// 	return errorMessage;
		// },

		_displayHeaderErrorMessages: function(headerErrorsArray, columnErrorsMap) {

			var oText = this.getAggregation("_errorsText");

			this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");

			var errorHeaderMessage = this._concatinateHeaderErrors(headerErrorsArray);

			//	var errorColumnsHeaderMessage = this._concatinateColumnsHeaderErrors(columnErrorsMap);

			oText.setText(this.oBundle.getText("errorInTableHeader") + errorHeaderMessage); // + "\n" +	errorColumnsHeaderMessage);
			oText.setVisible(true);
		},

		_clearErrorMessages: function() {

			//Clear header message
			var oText = this.getAggregation("_errorsText");
			oText.setText("");
			oText.setVisible(false);

			//this._columnErrorsMap  = {};
			this._internalModel.setProperty("/validationStatus", {}, null, true);
		},

		_displayErrorMessages: function(headerErrorsArray, columnErrorsMap) {
			// I commnted this call in order to remove the header error message, next we'll add here a different errors control
			//this._displayHeaderErrorMessages(headerErrorsArray, columnErrorsMap);
		},

		/**
		 * @private
		 * Gets a rule in deep format (as returned from the parser), and flats the rule to the format of the oDataModel.
		 * e.g. DecisionTableRowCell(RuleId='0050569181751ED683EFEEC6AA2B73C5', Version='000001', RowId='1', ColId='1')
		 * @param {oRule} oRule in deep format
		 * @returns {object} rule in oDataModel flatted format
		 */
		_flatRule: function(oRule) {
				var oModel = this._getModel();
				var oRuleFlat = {};
				var createEntry = function(oData, entryName, properties) {
					var key = oModel.createKey(entryName, properties);
					oData[key] = properties;
				};
				
				// Flat columns
				oRule.DecisionTable.DecisionTableColumns.results.forEach( function(col, index) {
					if (col.Type === "CONDITION") {
						var condition = col.Condition;
						if (condition.parserResults && condition.parserResults.status === "Success") {
							condition.Expression = condition.parserResults.converted.Expression;
							condition.FixedOperator = condition.parserResults.converted.FixedOperator;
						}
						delete condition.parserResults;
						createEntry(oRuleFlat, "DecisionTableColumnConditions", condition);
					} else if (col.Type === "RESULT") {
						var result = col.Result;
						createEntry(oRuleFlat, "DecisionTableColumnResults", result);
					}
				});
				
				// Flat cells
				oRule.DecisionTable.DecisionTableRows.forEach( function(row) {
					var cellArr = row.Cells;
					cellArr.results.forEach( function(cell) {
						if (cell.parserResults && cell.parserResults.status === "Success") {
							cell.Content = cell.parserResults.converted.Content;
						}
						delete cell.parserResults;
						createEntry(oRuleFlat, "DecisionTableRowCells", cell);
					});
				});
				
				return oRuleFlat;
		},

		_convertAndValidate: function() {
			
			var ruleData = this._getRuleData();
			
			var oExpressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());

			var validateResults = {};
			if (oExpressionLanguage && ruleData) {
				validateResults = oExpressionLanguage.convertRuleToDisplayValues(ruleData);
			}

			if (validateResults && validateResults.output) {

				if (validateResults.output.status === "Error") {
					var headerErrorsArray = [];
					var columnErrorsMap = this._internalModel.getProperty("/validationStatus");
					columnErrorsMap = this._buildMessagesStructure(validateResults, columnErrorsMap, headerErrorsArray);
					this._displayErrorMessages(headerErrorsArray, columnErrorsMap);

					this._internalModel.setProperty("/validationStatus", columnErrorsMap, null, true);	
				}
				
				var flatData = this._flatRule(validateResults.output.decisionTableData);
				this._displayModel.setData(flatData, true);
			}
		},
		
		_getRuleData: function() {

			var contextPath = this.getBindingContextPath();

			var oModel = this._getModel();
			
			var ruleData = jQuery.extend({}, true, oModel.getProperty(contextPath, null, true));
			var dtData = ruleData.DecisionTable;
			dtData.DecisionTableColumns = this.dataBucket.columns;
			dtData.DecisionTableRows = this.dataBucket.rows;
            
            
			
			return ruleData;
		},

		onBeforeRendering: function() {
            
			 if (this.resetContent) {
				this.resetControl();
				this.resetContent = false;
			 }
		},
        
        _handleHeaderSpan: function() {
            
            if (!this.multiHeaderFlag) {
                this.multiHeaderFlag = true;
                var aColumns = this.dataBucket.columns.results;
                this.iNumOfCondition = 0;
                this.iNumOfResults = 0;
                for (var i = 0 ; i < aColumns.length ; i++) {
                    if (aColumns[i].Type === sap.rules.ui.DecisionTableColumn.Condition) {
                        this.iNumOfCondition++;
                    } else if (aColumns[i].Type === sap.rules.ui.DecisionTableColumn.Result) {
                        this.iNumOfResults++;
                    }
                } 
                var oTable = this.getAggregation('_table');
                aColumns =  oTable.getAggregation('columns');
                var i = 0;
                for ( ; i < this.iNumOfCondition ; i++) {
                    aColumns[i].setHeaderSpan([this.iNumOfCondition, 1]);
                }
                for ( ; i < aColumns.length ; i++) {
                    aColumns[i].setHeaderSpan([this.iNumOfResults, 1]);
                }
            }
            
        },

		exit: function() {
			var oMenu = this.oMenu;
			if (oMenu) {
				oMenu.destroy();
			}
		}
	});

	/**
	 * @private
	 *  @param {map} mParameters? -
	 */
	sap.rules.ui.DecisionTable.prototype._saveWorkAround = function(mParameters) {
		var oModel = this._getModel();
		oModel.submitChanges(mParameters);
	};

	return oDecisionTable;

}, /* bExport= */ true);
