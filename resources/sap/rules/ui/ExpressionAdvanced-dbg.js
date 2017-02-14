/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides the sap.rules.ui.ExpressionAdvanced control
sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Button",
	"sap/m/TextArea",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/ui/layout/HorizontalLayout",
	"sap/rules/ui/Utils",
	"sap/ui/core/Popup",
	"jquery.sap.global",
    "sap/rules/ui/ExpressionBase",
	"sap/rules/ui/codemirror/lib/codemirror",
	"sap/rules/ui/codemirror/addon/hint/show-hint",
	"sap/rules/ui/codemirror/mode/hdf/hdf",
	"sap/rules/ui/codemirror/addon/display/placeholder",
	"sap/rules/ui/codemirror/addon/mh/mark-selection",
	"sap/rules/ui/codemirror/addon/hint/hdf-hint",
	"sap/rules/ui/codemirror/addon/closeBrackets/closebrackets",
	"sap/rules/ui/codemirror/addon/search/search"
], function (Control, Button, TextArea, Text, MessageBox, HorizontalLayout, Utils, Popup, jQ, ExpressionBase) {
    "use strict";

    /**
    * Constructor for a new ExpressionAdvanced.
    *
    * @param {string} [sId] ID for the new control, generated automatically if no ID is given
    * @param {object} [mSettings] Initial settings for the new control
    *
    * @class
    * The <code>sap.rules.ui.ExpressionAdvanced</code> control provides the ability to define expressions for complex rules in a decision table.
    * @extends sap.ui.core.Control
    *
    * @author SAP SE
    * @version 1.44.3
    *
    * @constructor
    * @private
    * @experimental Only for internal use.
    * 
    * @alias sap.rules.ui.ExpressionAdvanced
    * @ui5-metamodel This control also will be described in the UI5 (legacy) designtime metamodel
    */

    var ExpressionAdvanced = ExpressionBase.extend("sap.rules.ui.ExpressionAdvanced", {

        metadata: {
            properties: {

                /**
                * The business data type of the expression (e.g. String, Number, Boolean).
                * The default value <code>sap.rules.ui.ExpressionType.All</code> means that all valid business data types are permitted.
                */
                type: {
                    type: "sap.rules.ui.ExpressionType",
                    defaultValue: sap.rules.ui.ExpressionType.All,
                    bindable: "bindable"
                },

                /**
                * Defines weather the expression evaluates to a collection of values or to a single value.
                */
                collection: {
                    type: "boolean",
                    defaultValue: false
                },

                /**
                * Defines a short hint intended to aid the user with data entry when the control has no value.
                */
                placeholder: {
                    type: "string",
                    defaultValue: null
                },

                /**
                * Defines whether the focus is set to the control upon loading.
                */
                focusOnLoad: {
                    type: "boolean",
                    defaultValue: false
                },

                /**
                * Defines the text that appears in the value state message pop-up.
                */
                valueStateText: {
                    type: "string",
                    defaultValue: null,
                    bindable: "bindable"
                }
            },
            aggregations: {

                // A hidden text area is provided for the codemirror rendering.
                _expressionArea: {
                    type: "sap.m.TextArea",
                    multiple: false,
                    visibility: "hidden"
                }
            },
            events: {

                /**
                * This event is fired when the text in the input field has changed and the focus leaves the input field or the enter key is pressed.
                */
                "change": {},

                /**
                * This event is fired when the value of the input is changed - e.g. at each keypress
                */
                "liveChange": {}
            },
            publicMethosds: ["validate"]
        }
    });

    ExpressionAdvanced.prototype.init = function () {
        ExpressionBase.prototype.init.apply(this, arguments);
        var codeMirrorCSS = jQuery.sap.getModulePath("sap.rules.ui.codemirror.lib") + "/codemirror.css";
        var showHintCSS = jQuery.sap.getModulePath("sap.rules.ui.codemirror.addon.hint") + "/show-hint.css";
        jQuery.sap.includeStyleSheet(codeMirrorCSS);
        jQuery.sap.includeStyleSheet(showHintCSS);

        this.pop = new Popup(jQ('<span></span>')[0], false, false, false);
        this.errorWidgets = [];
        this.expressionTokens = [];
        this._liveValue = "";
        this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
        this.dataModel = this.initControlDataModel();

        // Expression area
        this.oTextArea = new TextArea({
            width: "100%"
        });
        this.setAggregation("_expressionArea", this.oTextArea, true);
    };

    ExpressionAdvanced.prototype.validateExpression = function (sInput) {
        for (var i = 0; i < this.errorWidgets.length; i++) {
            this.codeMirror.removeLineWidget(this.errorWidgets[i]);
        }
        this.errorWidgets = [];
        var expressionValue = this.codeMirror ? this.codeMirror.getValue() : this.getValue();
        var result = {};
        var incomingdata = {};
        var oEL = sap.ui.getCore().byId(this.getExpressionLanguage());
        if (oEL) {
            incomingdata = oEL.validateExpression(
				sInput ? sInput : expressionValue,
				this.getProperty("type"),
				this.getCollection()
			);
            if (incomingdata && this.isActive()) {
                result = incomingdata;
                if (typeof (incomingdata) !== 'object') {
                    result = JSON.parse(incomingdata);
                }
                if (result.status === sap.rules.ui.ValidationStatus.Error) {
                    var msg = Utils.parseUTFToString(result.errorDetails /* || "unknown message"  */);
                    msg = msg.replace(/\r\n/g, " ").replace(/\r/g, " ").replace(/\n/g, " ");
                    this.errorCursorPosition = result.cursorPosition;
                    this.setValueStateText(msg);
                } else {
                    this.oTextArea.setValueState("None");
                    this.oTextArea.setValueStateText("");
                    this.setValueStateText("");
                    jQuery(this.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner');
                }
            }
        }
        return incomingdata;
    };

    ExpressionAdvanced.prototype._showPopUp = function () {
        var errorState = "Error"; //this.getProperty("errorMessage");
        var errorMessage = this.getProperty("valueStateText");
        var thisId = this.getId() + '-message';
        var pop = this.pop; //new Popup(jQ('<span></span>')[0], false, false, false);
        pop.attachClosed(function () {
            jQ.sap.byId(thisId).remove();
        });
        var dock = Popup.Dock;
        var cssClass = 'sapMInputBaseMessage' + errorState + ' sapMFocus';
        var T = 'sapMValueStateMessageError sapMText';
        var r = sap.ui.getCore().getLibraryResourceBundle('sap.m');

        if (errorState === sap.ui.core.ValueState.Success) {
            cssClass = 'sapUiInvisibleText';
            errorMessage = '';
        }
        var $ = jQ('<div>', {
            'id': thisId,
            'class': cssClass,
            'role': 'tooltip',
            'aria-live': 'assertive'
        }).append(jQ('<span>', {
            'aria-hidden': true,
            'class': 'sapUiHidden',
            'text': r.getText('INPUTBASE_VALUE_STATE_' + errorState.toUpperCase())
        })).append(jQ('<span>', {
            'id': thisId + '-text',
            'class': T,
            'text': errorMessage
        }));
        pop.setContent($[0]);
        pop.close(0);
        pop.open(0, dock.BeginTop, dock.BeginBottom, jQuery(this.codeMirror.getWrapperElement()), null, null, true);
        var sPopUpWidth = this.pop.oContent.clientWidth;
        var sExpressionAdvancedWidth = document.getElementById(this.getAggregation("_expressionArea").sId).clientWidth;
        if (sPopUpWidth > sExpressionAdvancedWidth) {
            jQuery(".sapMText").css('width',sExpressionAdvancedWidth);
        }
        
    };

    ExpressionAdvanced.prototype._closePopUp = function () {
        if (this.pop) {
            this.pop.close(0);
        }
    };

    ExpressionAdvanced.prototype._showErrorMessage = function () {
        if (this.getValueStateText()) {
            this._setExpressionErrorStyle();
        }
    };

    ExpressionAdvanced.prototype.initControlDataModel = function () {
        var oDataModel = new sap.ui.model.json.JSONModel();
        var data = {};
        oDataModel.setData(data);
        return oDataModel;
    };

    ExpressionAdvanced.prototype.setExpressionTokens = function (tokens) {
        var maxLineEnd = 0,
			newLineExist = false;
        this.expressionTokens = [];
        if (tokens instanceof Array) {
            for (var i = 0; i < tokens.length; i++) {
                var tokenMetaData = tokens[i];
                //minimize the number of cached tokens
                var newLineReg = /\n/;
                if (newLineReg.test(tokenMetaData.token)) {
                    maxLineEnd = tokenMetaData.start + tokenMetaData.token.lastIndexOf('\n') + 1;
                    newLineExist = true;
                    continue;
                }
                if (newLineExist) {
                    tokenMetaData.start = tokenMetaData.start - maxLineEnd;
                    tokenMetaData.end = tokenMetaData.end - maxLineEnd + 1;
                } else {
                    tokenMetaData.end = tokenMetaData.end + 1;
                }
                this.expressionTokens.push(tokenMetaData);
            }
        }
    };

    ExpressionAdvanced.prototype.getExpressionTokens = function () {
        return this.expressionTokens;
    };

    /** INTERFACE */

    ExpressionAdvanced.prototype.getValue = function () {
        if (this.codeMirror !== undefined) {
            return this.codeMirror.getValue();
        }
        return this.getProperty("value");
    };
    ExpressionAdvanced.prototype.setValue = function (value) {
        if (value === undefined || value === null) {
            value = "";
        }
        this._liveValue = value;
        this.oTextArea.setValue(value);
        if (this.getProperty("value") === value) {
            return;
        }
        this.setProperty("value", value, true);
        if (this.codeMirror !== undefined) {
            this.codeMirror.setValue(value);
        }
    };

    ExpressionAdvanced.prototype.setPlaceholder = function (value) {
        this.setProperty("placeholder", value);
        var modelValue = (this.getEditable()) ? value : "";
        this.dataModel.setProperty("/placeholder", modelValue);
    };

    ExpressionAdvanced.prototype.getPlaceholder = function () {
        return this.dataModel.getProperty("/placeholder");
    };

    ExpressionAdvanced.prototype.setValueStateText = function (message) {
        this.setProperty("valueStateText", message, true);
        this._showErrorMessage(message);
    };

    ExpressionAdvanced.prototype.setEditable = function (value) {
        this.setProperty("editable", value);
        if (this.codeMirror) {
            jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-rules-Not-Editable');
        }
        // placeholder is relevant only for editable field
        var _placeholder = (value) ? this.getProperty("placeholder") : "";
        this.dataModel.setProperty("/placeholder", _placeholder);
        this.invalidate();
    };

    ExpressionAdvanced.prototype.setType = function (type) {
        this.setProperty("type", type);
        if (this.codeMirror) {
            this.codeMirror.options.returnType = type;
        }
    };

    ExpressionAdvanced.prototype.setCollection = function (isCollection) {
        this.setProperty("collection", isCollection, true);
        if (this.codeMirror) {
            this.codeMirror.options.collection = isCollection;
        }
    };

    /* end INTERFACE section */

    /* Public methods section */

    /**
    * validates the current value of the control.
    * @internal
    * @return {object}  [oResult] validation object.
    */
    ExpressionAdvanced.prototype.validate = function () {
        return this.validateExpression();
    };

    ExpressionAdvanced.prototype.setFocusOnLoad = function (value) {
        this.dataModel.setProperty("/focus", value);
        this.setProperty("focusOnLoad", value, true);
    };

    ExpressionAdvanced.prototype.focus = function () {
        if (this.codeMirror) {
            var lastLine = this.codeMirror.getLine(this.codeMirror.lastLine());
            var cursorPos = lastLine.length;
            this.codeMirror.setCursor({
                line: this.codeMirror.lastLine(),
                ch: cursorPos
            });
            this.codeMirror.focus();
        }
        // else {
        // 	this.dataModel.setProperty("/focus", value);
        // }
    };

    ExpressionAdvanced.prototype.onAliasLinkPress = function (aliasName) {
        var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
        if (expressionLanguage) {
            expressionLanguage.onAliasLinkPress(aliasName);
            expressionLanguage.attachEvent("aliasDialogClosed", this.aliasClickCancel, this);
        }
    };

    ExpressionAdvanced.prototype.onCreateAliasLinkForText = function (text) {
        var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
        if (expressionLanguage) {
            expressionLanguage.attachEvent("aliasDialogClosed", this.replaceTextWithAlias, this);
            expressionLanguage.onCreateAliasLinkForText(text);
        }
    };

    ExpressionAdvanced.prototype.replaceTextWithAlias = function (oEvent) {
        if (oEvent.getParameter("isSave")) {
            this.codeMirror.replaceSelection(oEvent.getParameter("savedAliasName"));
        }
    };

    ExpressionAdvanced.prototype.aliasClickCancel = function (oEvent) {
        this.codeMirror.focus();
        this.codeMirror.execCommand("goLineEnd");
        this.fireDialog({
            dialogStatus: sap.rules.ui.ValueListDialogMode.Close
        });
    };

    ExpressionAdvanced.prototype.onAfterRendering = function () {

        this.timer = null;
        // needAutoComplete tells us whether an auto complete action is required.
        // we need it since we execute the popup opening in a delayed manner. sometimes it should not open (case 2):
        // case 1. press key -> ... -> delayed open of popup (need to open)
        // case 2. press key -> ... -> press Enter (to select form list) -> ... -> delayed open of popup (need not open)
        this.needAutoComplete = false;
        this.endCompletion = false;
        this._setCodeMirror();
        this._setEditorStyle();
        this._handleMousedown();
        this._handleChange();
        this._handleFocusLeave(); //blur
        this._handleEndCodeCompletion();
        this._handleKeyPress();
        this._handleEditableProperty();
        this._handleOnLoadValidation();
        this._refreshOnNavigationEnd();
        this._handleFocus();
        this._handleValueListSelect();
    };

    /****
    * Invoke this function once user select on 'Select value from list' suggestion
    * This is listener to 'onValueListSelect' code mirror event/signal.
    ***/
    ExpressionAdvanced.prototype._handleValueListSelect = function () {
        // this.codeMirror.on('onValueListSelect', function (){
        //     var me = this;
        //     var enumText = sap.rules.ui.VocabularyEnum.SelectValueList;
        //     var enumType = sap.ui.getCore().byId(me.getExpressionLanguage()).getEnumType(enumText);
        //     me.onEnumLinkPress(enumText, enumType);
        // });
    };

    /*
    * Callback fucntion event which fired once user clicked on 'ValueList' token link.
    * onEnumLinkPress : create code mirror search cursor based on the 'ValueList' token which has been clicked.
    * Create Select Dialog display all 'ValueList' suggestions.
    * Generate callback function for 'Search' value list , and confirm.
    * @param enumText : 'ValueList' token text value.
    * @param enumType : 'ValueList' token type.
    */
    ExpressionAdvanced.prototype.onEnumLinkPress = function (enumText, enumType) {
        this.blurEvent = false;
        var expressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
        var cursorPos = jQuery.extend(true, {}, this.codeMirror.getCursor());
        var cursor = this._createSearchCursor(enumText);

        if (cursor.find(enumText) || enumText === sap.rules.ui.VocabularyEnum.SelectValueList) {
            var callBackFuncs = this._selectDialogCallback();
            this.oSelectDialog = new sap.m.SelectDialog({
                title: this.oBundle.getText('ENUM_SELECT_DIALOG_TITLE'),
                noDataText: this.oBundle.getText('ENUM_SELECT_DIALOG_MESSAGE'),
                contentHeight: "15rem",
                contentWidth: "10rem",
                search: callBackFuncs.searchFn,
                liveChange: callBackFuncs.searchFn
            });
            this.oSelectDialog.attachConfirm({
                cmCursor: cursor,
                enumText: enumText,
                cursorPos: cursorPos
            }, callBackFuncs.confirm, this);
            expressionLanguage.vocabularyProxy.getEnumList(enumType, this._setSelectDialogModel, this);
            // open dialog
            this.oSelectDialog.open();
        }
    };

    /*
    * Callback function for read 'ValueList' response.
    * Bind the 'ValueList' response to SelectDialog model.
    * @param incomingData: 'ValueList' read response.
    */
    ExpressionAdvanced.prototype._setSelectDialogModel = function (incomingData) {
        var oListItem = new sap.m.StandardListItem({
            title: "{}"
        });
        var oDialogModel = new sap.ui.model.json.JSONModel();
        oDialogModel.setJSON(JSON.stringify(incomingData));

        this.oSelectDialog.setModel(oDialogModel);
        this.oSelectDialog.bindAggregation("items", "/", oListItem);
    };

    ExpressionAdvanced.prototype._createSearchCursor = function (enumText) {
        var cm = this.codeMirror;
        cm.getCursor().ch = cm.getCursor().ch + enumText.length;
        var cursor = cm.getSearchCursor(enumText, cm.getCursor(), typeof enumText == "string" && enumText == enumText.toLowerCase());
        return cursor;
    };

    /*
    * Generate SelectDialog callback functions for confirm,and search  events.
    */
    ExpressionAdvanced.prototype._selectDialogCallback = function () {
        var funObj = {};
        funObj.searchFn = function (oEvent) {
            var aFilters = [],
				sSearchValue = oEvent.getParameter("value"),
				itemsBinding = oEvent.getParameter("itemsBinding");

            // create the local filter to apply
            if (sSearchValue !== undefined && sSearchValue.length > 0) {
                aFilters.push(new sap.ui.model.Filter('', sap.ui.model.FilterOperator.Contains, sSearchValue));
            }
            // apply the filter to the bound items, and the Select Dialog will update
            itemsBinding.filter(aFilters, "Application");
        };

        funObj.confirm = function (oEvent, oData) {
            if (oEvent.getParameter('selectedItem')) {
                var selectedEnum = oEvent.getParameter('selectedItem').getTitle();
                if (oData.enumText !== sap.rules.ui.VocabularyEnum.SelectValueList) {
                    // replacement of existing value
                    oData.cmCursor.replace(selectedEnum);
                } else {
                    // inserting a new selection
                    var cursorPos = oData.cursorPos;
                    this.codeMirror.replaceRange(selectedEnum, cursorPos); // insert the selection
                    cursorPos = this.codeMirror.findPosH(cursorPos, selectedEnum.length, "char", true);
                    this.codeMirror.setCursor(cursorPos); // set the cursor past the new selection
                }
                this.oSelectDialog.destroy();
                this.oSelectDialog = null;
                this.codeMirror.focus();
                this.blurEvent = true;
                this.fireDialog({
                    dialogStatus: sap.rules.ui.ValueListDialogMode.Close
                });
            }
        };
        return funObj;
    };

    ExpressionAdvanced.prototype._setCodeMirror = function () {
        var editable = this.getEditable();
        function autoComplete(cm, commandName, timeout) {
            var oAdvancedExpressionEditor = cm.options.expressionEditor;
            if ((oAdvancedExpressionEditor.getEditable() !== false) && sap.ui.getCore().byId(oAdvancedExpressionEditor.getExpressionLanguage())) {
                window.clearTimeout(oAdvancedExpressionEditor.timer);
                oAdvancedExpressionEditor.timer = window.setTimeout(function () {
                    cm.execCommand(commandName);
                }, timeout);
                return window.CodeMirror.Pass; // tell CodeMirror we didn't handle the key
            }
            return null;
        }

        function ordinaryKeyCallback(cm) {
            var oAdvancedExpressionEditor = cm.options.expressionEditor;
            if (oAdvancedExpressionEditor.getEditable() !== false) {
                window.clearTimeout(oAdvancedExpressionEditor.timer);
                oAdvancedExpressionEditor.needAutoComplete = true;
                oAdvancedExpressionEditor.timer = window.setTimeout(function () {
                    if (oAdvancedExpressionEditor.needAutoComplete && sap.ui.getCore().byId(oAdvancedExpressionEditor.getExpressionLanguage())) {
                        cm.execCommand("autocomplete");
                    }
                }, 500);
                return window.CodeMirror.Pass; // tell CodeMirror we didn't handle the key
            }
            return null;
        }

        function enterKeyCallback(cm) {
            return autoComplete(cm, "enterAutocomplete", 500);
        }

        function colonKeyCallback(cm) {
            return autoComplete(cm, "colonAutocomplete", 500);
        }

        function ctrlSpaceKeysCallback(cm) {
            autoComplete(cm, "autocomplete", 0);
        }

        /*
        * SPACE is use for both opening the hints, and closing them if writing a non-existent expression.
        * As such, it is separated from the common ordinaryKeyCallback() key handling.
        * If not so, it alternately opens the hints every 2nd press. Example flow:
        * press SPACE:
        * 1. ordinaryKeyCallback() sets the timeout
        * 2. ordinaryKeyCallback() delayed opening of hints
        * press SPACE (not in one of the hints):
        * 1. ordinaryKeyCallback() sets the timeout
        * 2. _handleEndCodeCompletion sets needAutoComplete as false (event coming from CodeMirror hints)
        * 3. ordinaryKeyCallback() delayed opening of hints - not opening the hints as needAutoComplete is false
        * **/
        function spaceKeyCallback(cm) {
            return autoComplete(cm, "autocomplete", 500);
        }

        this.keyMap = {
            "Tab": false,
            "Shift-Tab": false,
            "Ctrl-Space": ctrlSpaceKeysCallback,
            "Backspace": ordinaryKeyCallback,
            "Enter": enterKeyCallback,
            "':'": colonKeyCallback,
            "'+'": ordinaryKeyCallback,
            "'-'": ordinaryKeyCallback,
            "'*'": ordinaryKeyCallback,
            "'/'": ordinaryKeyCallback,
            "'_'": ordinaryKeyCallback,
            "'o'": ordinaryKeyCallback,
            "'q'": ordinaryKeyCallback,
            "'w'": ordinaryKeyCallback,
            "'e'": ordinaryKeyCallback,
            "'r'": ordinaryKeyCallback,
            "'t'": ordinaryKeyCallback,
            "'y'": ordinaryKeyCallback,
            "'u'": ordinaryKeyCallback,
            "'i'": ordinaryKeyCallback,
            "'p'": ordinaryKeyCallback,
            "'.'": ordinaryKeyCallback,
            "'a'": ordinaryKeyCallback,
            "'s'": ordinaryKeyCallback,
            "'d'": ordinaryKeyCallback,
            "'f'": ordinaryKeyCallback,
            "'g'": ordinaryKeyCallback,
            "'h'": ordinaryKeyCallback,
            "'j'": ordinaryKeyCallback,
            "'k'": ordinaryKeyCallback,
            "'l'": ordinaryKeyCallback,
            "'z'": ordinaryKeyCallback,
            "'x'": ordinaryKeyCallback,
            "'c'": ordinaryKeyCallback,
            "'v'": ordinaryKeyCallback,
            "'b'": ordinaryKeyCallback,
            "'n'": ordinaryKeyCallback,
            "'m'": ordinaryKeyCallback,
            "'O'": ordinaryKeyCallback,
            "'Q'": ordinaryKeyCallback,
            "'W'": ordinaryKeyCallback,
            "'E'": ordinaryKeyCallback,
            "'R'": ordinaryKeyCallback,
            "'T'": ordinaryKeyCallback,
            "'Y'": ordinaryKeyCallback,
            "'U'": ordinaryKeyCallback,
            "'I'": ordinaryKeyCallback,
            "'P'": ordinaryKeyCallback,
            "'A'": ordinaryKeyCallback,
            "'S'": ordinaryKeyCallback,
            "'D'": ordinaryKeyCallback,
            "'F'": ordinaryKeyCallback,
            "'G'": ordinaryKeyCallback,
            "'H'": ordinaryKeyCallback,
            "'J'": ordinaryKeyCallback,
            "'K'": ordinaryKeyCallback,
            "'L'": ordinaryKeyCallback,
            "'Z'": ordinaryKeyCallback,
            "'X'": ordinaryKeyCallback,
            "'C'": ordinaryKeyCallback,
            "'V'": ordinaryKeyCallback,
            "'B'": ordinaryKeyCallback,
            "'N'": ordinaryKeyCallback,
            "'M'": ordinaryKeyCallback,
            "'0'": false,
            "'1'": false,
            "'2'": false,
            "'3'": false,
            "'4'": false,
            "'5'": false,
            "'6'": false,
            "'7'": false,
            "'8'": false,
            "'9'": false,
            "' '": spaceKeyCallback
        };

        function keyMapping(oAdvancedExpressionEditor) {
            return oAdvancedExpressionEditor.keyMap;
        }

        if (this.expressionTokens.length === 0) {
            var oEL = sap.ui.getCore().byId(this.getExpressionLanguage());
            if (oEL) {
				var tokens = [];
				var exprssionMetadata = oEL.getExpressionMetadata(this._liveValue);
				if (exprssionMetadata) {
					tokens = exprssionMetadata.tokens;
				}
                this.setExpressionTokens(tokens);
            }
        }
        var keyMap = keyMapping(this);
        var textAreaId = this.oTextArea.getId() + '-inner';
        var isMSIE = (Utils.msieversion() >= 0);
        if (isMSIE) {
            jQuery('#' + textAreaId).attr('placeholder', this.getProperty('placeholder'));
        }
        this.codeMirror = window.CodeMirror.fromTextArea(document.getElementById(textAreaId), {
            mode: "text/hdf",
            lineNumbers: false,
            lineWrapping: true,
            matchBrackets: editable === true ? true : false,
            highlightSelectionMatches: editable === true ? {
                showToken: /\w/
            } : {},
            relDelegate: sap.ui.getCore().byId(this.getExpressionLanguage()),
            returnType: this.getProperty("type"),
            collection: this.getProperty("collection"),
            expressionEditor: this,
            stillNeedShowHint: true,
            shouldValidate: true,
            styleSelectedText: true,
            smartIndent: true,
            autoCloseBrackets: true,
            indentUnit: 6
        });
        this.codeMirror.addKeyMap(keyMap, true);

        //	//In order to support aliases - we must reset the aliases after initialization of codeMirror object
        //	if (window.CodeMirror.mimeModes.hasOwnProperty('text/hdf'))
        //		window.CodeMirror.mimeModes['text/hdf'].aliases = me.getRelDelegate().vocabualryAliasesNames;
    };

    ExpressionAdvanced.prototype._setEditorStyle = function () {
        //We added to the codeMirror code (see codeMirror.js) styles class derived from SAPUI5
        //Set CSS style to the new added codemirror control - according to SAPUI5 textField CSS
        //sapUiTf sapUiTfBack sapUiTfBrd sapUiTfStd sapUiTxtA

        //We need to mimic the way input control is being used in sapui5 which means:
        //level 1: sapMInput sapMInputBase
        //level 2: sapMInputBaseInner
        if (this.getValueStateText()) {
            jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-error');
            jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseStateInner sapMInputBaseErrorInner');
            jQuery('#' + this.oTextArea.getId()).addClass('sapMInputBaseError');
        }
        jQuery('#' + this.oTextArea.getId()).removeClass().addClass('sapMInput'); //sapMInputBase
        jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseInner CodeMirror-rules');
        if (!this.getEditable()) {
            jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-rules-Not-Editable');
        }

        // bug fix - without it the height of codeMirror to big --> cause to wrong cursor positioning
        if (this.codeMirror) {
            this.codeMirror.refresh();
        }
    };

    ExpressionAdvanced.prototype._handleOnLoadValidation = function () {
        if (this.getValidateOnLoad()) {
            this.validateExpression();
            this.setValidateOnLoad(false);
        }
    };

    ExpressionAdvanced.prototype._handleEditableProperty = function () {
        if (this.getEditable() === false) {
            this.codeMirror.setOption("readOnly", "true");
            this.codeMirror.setOption("theme", "read-only");
        }
    };

    ExpressionAdvanced.prototype._handleFocus = function () {
        var oCodeMirror = this.codeMirror;
        if (this.getFocusOnLoad()) {
            this.focus();
        }
        this.codeMirror.on("focus", function (cm, change) {
            var errorMessage = cm.options.expressionEditor.getProperty("valueStateText");
            if ((errorMessage)) {
                cm.options.expressionEditor._showPopUp();
            }
            cm.options.stillNeedShowHint = true;
            jQuery('#' + cm.options.expressionEditor.oTextArea.getId()).addClass('sapMInputFocused');
            jQuery(cm.getWrapperElement()).removeClass('CodeMirror-errorBackground');
        });

        if (this.dataModel.getProperty("/focus") === true) {
            window.setTimeout(function () {
                var lastLine = oCodeMirror.getLine(oCodeMirror.lastLine());
                var cursorPos = lastLine.length;
                oCodeMirror.setCursor({
                    line: oCodeMirror.lastLine(),
                    ch: cursorPos
                });
                //oCodeMirror.focus();
            }, 10);
        }
    };

    ExpressionAdvanced.prototype._refreshOnNavigationEnd = function () {
        jQuery(".sapMNav").on('webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd', function () {
            if (this.codeMirror) {
                this.codeMirror.refresh();
            }
        });
    };

    ExpressionAdvanced.prototype._handleKeyPress = function () {
        this.codeMirror.on("keyHandled", function (cm, key, event) {
            if (event.keyCode === 27 && this && this.endCompletion === true) {
                event.stopPropagation();
                this.endCompletion = false;
            }
            if (event.ctrlKey === true && key === "Ctrl-A") {
                event.stopPropagation();
            }
        });
    };

    ExpressionAdvanced.prototype._handleEndCodeCompletion = function () {
        this.codeMirror.on("endCompletion", function (cm) {
            cm.options.expressionEditor.needAutoComplete = false;
            cm.options.expressionEditor.endCompletion = !cm.options.expressionEditor.endCompletion;
        });
    };

    ExpressionAdvanced.prototype._handleMousedown = function () {
        this.codeMirror.on("mousedown", function (cm, event) {
            event.stopPropagation();
            /*            var target = event.target || event.srcElement;

            if (target && event.button === 0){
            var classList = target.className.split(/\s+/);

            for (var i = 0; i < classList.length; i++){
            if (classList[i] === 'cm-link'){
            cm.options.expressionEditor.fireDialog({
            dialogStatus: sap.rules.ui.ValueListDialogMode.Open
            });
            cm.options.expressionEditor.onAliasLinkPress(target.textContent);
            }
            //Once user click on 'ValueList' token
            if (classList[i] === 'cm-hrf-enum'){
            cm.options.expressionEditor.fireDialog({
            dialogStatus: sap.rules.ui.ValueListDialogMode.Open
            });
            //get 'ValueList' type
            var enumType = classList[++i].split('-')[1];
            jQuery('#' + cm.options.expressionEditor.oTextArea.getId()).delay(50).queue(function (){
            //Get complete token value
            var valueListToken = cm.options.expressionEditor._getValueListToken(target.textContent, cm.options.expressionEditor);
            cm.options.expressionEditor.onEnumLinkPress(valueListToken, enumType);
            jQuery.dequeue(this);
            });
            }
            }
            }*/
        });
    };
    /*
    /!*
    * Get complete token string from tokens cached array
    * @param selectedValueList - selected html element outerHTML, contain only partaily token value
    * @param oControll expression editor instance
    * @returns complete token string
    *!/
    ExpressionAdvanced.prototype._getValueListToken = function (selectedValueList, oControll){
    var tokens = oControll.getExpressionTokens();
    var tokensLength = tokens.length;
    for (var index = 0; index < tokensLength; index++){
    if (tokens[index].token.indexOf(selectedValueList) > -1){
    return tokens[index].token;
    }
    }
    return null;
    };*/

    ExpressionAdvanced.prototype._handleChange = function () {
        this.codeMirror.on("change", function (cm, change) {
            var oAdvancedExpressionEditor = cm.options.expressionEditor;
            if (oAdvancedExpressionEditor.codeMirror.state.completionActive && oAdvancedExpressionEditor.keyMap["'" + change.text[0] + "'"] ===
				false) {
                oAdvancedExpressionEditor.codeMirror.state.completionActive.close();
            }

            jQuery(oAdvancedExpressionEditor.codeMirror.getWrapperElement()).removeClass('CodeMirror-error');
            jQuery(oAdvancedExpressionEditor.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner');
            oAdvancedExpressionEditor._liveValue = cm.getValue();
            
            var oEL = sap.ui.getCore().byId(oAdvancedExpressionEditor.getExpressionLanguage());
            if (oEL) {
				var tokens = [];
				var exprssionMetadata = oEL.getExpressionMetadata(oAdvancedExpressionEditor._liveValue);
				if (exprssionMetadata) {
					tokens = exprssionMetadata.tokens;
				}
                oAdvancedExpressionEditor.setExpressionTokens(tokens);
            }
            
            oAdvancedExpressionEditor.codeMirror.options.shouldValidate = true;
            oAdvancedExpressionEditor.fireLiveChange({
                newValue: cm.getValue()
            });
            // we dont indent on delete
            if (change.origin !== "+delete") {
                cm.operation(function () {
                    for (var line = 0, end = cm.lineCount(); line < end; ++line) {
                        cm.indentLine(line, "smart");
                    }
                });
            }
        });
    };

    ExpressionAdvanced.prototype._handleFocusLeave = function () {
        this.codeMirror.on("blur", function (cm) {
            var oAdvancedExpressionEditor = cm.options.expressionEditor;
            oAdvancedExpressionEditor._closePopUp();
            oAdvancedExpressionEditor.codeMirror.options.stillNeedShowHint = false;

            // shouldValidate flag indicates:
            //	-	this is real focus leave, not because of click on Hint
            //	-	value was changed while the control was in focus
            if (oAdvancedExpressionEditor.codeMirror.options.shouldValidate) {
				oAdvancedExpressionEditor.setValue(oAdvancedExpressionEditor.codeMirror.getValue());
                //if (oAdvancedExpressionEditor.getProperty("automaticValidation")){
                oAdvancedExpressionEditor.validate();
                oAdvancedExpressionEditor._closePopUp();
                //}
                oAdvancedExpressionEditor.fireChange({
                    newValue: cm.getValue()
                });
                oAdvancedExpressionEditor.codeMirror.options.shouldValidate = false;
            }
            jQuery('#' + oAdvancedExpressionEditor.oTextArea.getId()).removeClass('sapMInputFocused');
            oAdvancedExpressionEditor.dataModel.setProperty("/focus", false);
        });
    };

    ExpressionAdvanced.prototype._setExpressionErrorStyle = function () {
        var errorMsg = this.getProperty("valueStateText");
        if (errorMsg !== "" && errorMsg !== undefined && this.codeMirror) {
            jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-error');
            jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseStateInner sapMInputBaseErrorInner');
            jQuery('#' + this.oTextArea.getId()).addClass('sapMInputBaseError');
            //this._showPopUp();

            // Position the cursor within the control
            var cursorPos;
            if (this.errorCursorPosition < 0) {
                var lastLine = this.codeMirror.getLine(this.codeMirror.lastLine());
                cursorPos = lastLine.length;
                //this.codeMirror.setCursor({line: lastLine, ch: cursorPos});
                jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-errorBackground');
            } else {
                var idx = errorMsg.lastIndexOf("'");
                if (idx > 0) {
                    var offendingText = errorMsg.substring(0, idx);
                    idx = offendingText.lastIndexOf("'");
                    if (idx > 0) {
                        offendingText = offendingText.substring(idx + 1);
                    }
                    var found = false;
                    for (var lineNum = this.codeMirror.lastLine(); !found && lineNum >= 0; lineNum--) {
                        var exp = this.codeMirror.getLine(lineNum);
                        cursorPos = exp.lastIndexOf(offendingText);
                        if (cursorPos >= 0) {
                            found = true;
                            this.codeMirror.setSelection({
                                line: lineNum,
                                ch: cursorPos
                            }, {
                                line: lineNum,
                                ch: cursorPos + offendingText.length
                            });
                        }
                    }
                }
            }
        }
    };

    /*    ExpressionAdvanced.prototype.createAliasFromTextMenu = function (e){

    // build context menu
    this.oContextMenu = new sap.m.ActionSheet();

    //Create the items and add them to the menu
    var oMenuItemSaveAsAlias = new Button({
    text: this.oBundle.getText("SAVE_AS_ALIAS")
    });
    oMenuItemSaveAsAlias.attachPress(function (){
    // concat text of all elements
    var text = this.getSelectedText();
    this.onCreateAliasLinkForText(text);
    });
    this.oContextMenu.addButton(oMenuItemSaveAsAlias);
    };*/

    ExpressionAdvanced.prototype.getSelectedText = function () {
        return this.codeMirror.getSelection();
    };

    /*    ExpressionAdvanced.prototype.openAliasFromTextMenu = function (e){
    window.setTimeout(function (){
    if (this.codeMirror.getSelection() !== ""){
    if (!this.oContextMenu){
    this.createAliasFromTextMenu(e);
    }
    this.oContextMenu.openBy(jQuery('#' + this.getId() + " .CodeMirror .CodeMirror-selectedtext")[0]);
    } else if (this.oContextMenu && this.oContextMenu.isOpen()){
    this.oContextMenu.close();
    }
	           
    }, 300);
    };*/
    return ExpressionAdvanced;

}, /* bExport= */true);
