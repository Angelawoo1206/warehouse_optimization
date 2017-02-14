/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides element sap.rules.ui.services.ExpressionLanguage
sap.ui.define(["jquery.sap.global",
        "sap/ui/core/Element",
        "sap/rules/ui/parser/businessLanguage/lib/parsingBackendMediator",
        "sap/rules/ui/parser/ruleBody/lib/ruleServices",
        "sap/rules/ui/parser/resources/common/lib/resourcesConvertor",
        "sap/rules/ui/parser/resources/vocabulary/lib/vocabularyDataProviderInitiator",
        "sap/rules/ui/parser/infrastructure/messageHandling/lib/responseCollector",
        "sap/ui/core/Locale",
        "sap/ui/core/LocaleData",
        "sap/rules/ui/library"
    ],
    function (jQuery, Element, ParsingBackendMediator, RuleServices, resourcesConvertor, RtsInitiator, responseCollector, Locale, LocaleData) {
        "use strict";
        /**
         * Constructor for a new ExpressionLanguage element.
         *
         * @class
         * Provides the ExpressionLanguage service functionality, such as expression validations, expression parsing, auto-complete suggestions, retrieving expression metadata and tokens, and performing runtime services (fetching data objects, outputs, etc).
         * @extends  Element
         *
         * @author SAP SE
         * @version 1.44.3
         *
         * @constructor
         * @public
         * @alias sap.rules.ui.services.ExpressionLanguage
         * @ui5-metamodel This element also will be described in the UI5 (legacy) designtime metamodel
         */
        var ExpressionLanguage = Element.extend("sap.rules.ui.services.ExpressionLanguage", {
            metadata: {
                library: "sap.rule.ui",
                properties: {

                },
                publicMethods: [
                    "setData",
                    "validateExpression",
                    "getSuggestions",
                    "getExpressionMetadata"
                ],
                events: {
                    "dataChange": {}
                }
            }
        });

        /*
         * @private
         * @return
         */
        ExpressionLanguage.prototype._isDataExist = function () {

            if (!this._data) {
                return false;
            }
            return true;
        };

        /*
         * @private
         * @return
         */
        ExpressionLanguage.prototype._removeOdataTags = function (data) {

            var i;
            if (!data) {
                return {};
            }
            var convertedData = JSON.parse(JSON.stringify(data));

            //Vocabulary conversion
            if (convertedData.DataObjects && convertedData.DataObjects.results) {
                convertedData.DataObjects = convertedData.DataObjects.results;

                for (i = 0; i < convertedData.DataObjects.length; i++) {
                    if (convertedData.DataObjects[i].Attributes && convertedData.DataObjects[i].Attributes.results) {
                        convertedData.DataObjects[i].Attributes = convertedData.DataObjects[i].Attributes.results;
                    }
                    if (convertedData.DataObjects[i].Associations && convertedData.DataObjects[i].Associations.results) {
                        convertedData.DataObjects[i].Associations = convertedData.DataObjects[i].Associations.results;
                    }
                }
            }
            //Rule conversion
            if (convertedData.DecisionTable) {
                if (convertedData.DecisionTable.DecisionTableColumns && convertedData.DecisionTable.DecisionTableColumns.results) {
                    convertedData.DecisionTable.DecisionTableColumns = convertedData.DecisionTable.DecisionTableColumns.results;
                }
                if (convertedData.DecisionTable.DecisionTableRows && convertedData.DecisionTable.DecisionTableRows.results) {
                    convertedData.DecisionTable.DecisionTableRows = convertedData.DecisionTable.DecisionTableRows.results;

                    for (i = 0; i < convertedData.DecisionTable.DecisionTableRows.length; i++) {
                        if (convertedData.DecisionTable.DecisionTableRows[i].Cells && convertedData.DecisionTable.DecisionTableRows[i].Cells.results) {
                            convertedData.DecisionTable.DecisionTableRows[i].Cells = convertedData.DecisionTable.DecisionTableRows[i].Cells.results;
                        }
                    }
                }
            }
            return convertedData;
        };

        /*
         * @private
         */
        ExpressionLanguage.prototype._initRuntimeService = function () {

            if (!this._runtimeService) {
                //generate uid for vocabulary name
                //this._vocabularyName = jQuery.sap.uid();

                var vocaContent = this._removeOdataTags(this._data);
                this._vocabularyName = vocaContent.Id;
                var inputParamObj = {
                    "connection": null,
                    "vocaLoadingType": "json",
                    "resourceID": this._vocabularyName,
                    "resourceContent": vocaContent
                    //,
                    //"termModes": ["byName", "byDescription"]
                };

                var runtimeServiceLib = RtsInitiator.lib;

                var runtimeServiceLibInstance = new runtimeServiceLib.vocaDataProviderInitiatorLib(); // eslint-disable-line new-cap

                this._runtimeService = runtimeServiceLibInstance.init(inputParamObj);
            }
        };

        /*
         * @private
         * @return
         */
        ExpressionLanguage.prototype._initBackendParser = function () {

            if (!this._backendParser) {

                var backendParserLib = ParsingBackendMediator.lib;

                this._backendParser = new backendParserLib.parsingBackendMediatorLib(); // eslint-disable-line  new-cap
            }
        };

        /*
         * @private
         * @return
         */
        ExpressionLanguage.prototype._initLocale = function () {

            if (!this._localeSettings) {
                var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(); 
                
                //oLocaleData = new sap.ui.core.LocaleData(oLocale);
                
               //oFormat.oLocale = oLocale;
                var oLocaleData = LocaleData.getInstance(oLocale);

                var dateFormatted = oLocaleData.getDatePattern('short');
                var timeFormat = oLocaleData.getTimePattern('medium');
				var timeZoneOffset = - (new Date().getTimezoneOffset());
                var decimalSeparator = oLocaleData.getNumberSymbol('decimal');
                var groupSeparator = oLocaleData.getNumberSymbol('group');

                this._localeSettings = {
                    "dateFormat": dateFormatted,
                    "timeFormat": timeFormat,
                    "timeZoneOffset": timeZoneOffset,
                    "number": {
                        "groupSeparator": groupSeparator,
                        "decimalSeparator": decimalSeparator
                    }
                };
            }
        };

        /*
         * @private
         * @return
         */
        ExpressionLanguage.prototype._init = function () {

            this._initRuntimeService();

            this._initBackendParser();

            this._initLocale();
        };

        /*
         * @private
         * @return
         */
        ExpressionLanguage.prototype._reset = function () {

            this._runtimeService = null;

            this._backendParser = null;

            this._initBackendParser();
        };

        /**
         * Sets the expression language data (vocabulary and metadata).
         * @param {object}   [oData] Contains the language data
         * @public
         **/
        ExpressionLanguage.prototype.setData = function (oData) {

            this._data = oData;

            this._reset();

            this.fireDataChange({data: oData});
        };

        /**
         * Sets the expression language data (vocabulary and metadata).
         * @param {string}   [sSubject] Contains the subject of following parsing call.
         * @return {object}  [oResCollector] The initiated response collector instance.
         * @private
         **/
        ExpressionLanguage.prototype._initResponseCollector = function (sSubject) {

            var ResponseCollector = responseCollector.lib.ResponseCollector;
            var oResCollector = ResponseCollector.getInstance();
            oResCollector.clear();
            oResCollector.addSubject(sSubject);

            return ResponseCollector;
        };


        /**
         * Convert a rule to display values
         * @param {object}   [oRule] The rule to be validated.
         * @return {object}  [oResult] The result of the formattrd rule.
         * @private
         **/
        ExpressionLanguage.prototype.convertRuleToDisplayValues = function(oRule) {
			
			var oConvert = { "source": "codeText", "target": "displayText" };
            var flags = this._buildFlagsObject(oConvert);

			return this._validateRule(oRule, flags);
		};


        /**
         * Validates a rule
         * @param {object}   [oRule] The rule to be validated.
         * @return {object}  [oResult] The result of the validation.
         * @private
         **/
        ExpressionLanguage.prototype.validateRule = function (oRule) {
			return this._validateRule(oRule);
        };

        ExpressionLanguage.prototype._validateRule = function (oRule, flags) {

            if (!this._isDataExist()) {
                return null;
            }
            
			flags = flags || {};
			flags.isCollection = false;
			flags.tokensOutput = true;
			
            this._init();
            var oConvertedRule = this._removeOdataTags(oRule);

            var ResponseCollector = this._initResponseCollector("Rule Validation");
            var resCollectorInstance = ResponseCollector.getInstance();

            var msg = "************* RULE: " + JSON.stringify(oConvertedRule) + "\n\n\n\n" +
                "*************    VOCABULARY: " + JSON.stringify(this._data) + "\n\n\n\n";

            resCollectorInstance.trace(ResponseCollector.severity().debug, msg);

            resCollectorInstance.setOpMessage("RuleValidation", "failure");

            var result = RuleServices.lib.validateRule(oConvertedRule, this._vocabularyName, this._runtimeService, flags);

            if (result.status == "Success") {
                resCollectorInstance.setOpMessage("RuleValidation", "success");
            }
            this._addOdataTags(result);
            resCollectorInstance.setOutput(result);
            var finalResponse = resCollectorInstance.build();

            return finalResponse;
        };

        /**
         * Validates a given rule expression according to a specific business data type.
         * @param {string}   [sExpression] The expression to be validated.
         * @param {sap.rules.ui.ExpressionType}   [eType] The expected data type of the expression.
         * @param {boolean}   [bCollection] Indicates whether the expression is a collection.
         * @param {boolean}   [bToken] Indicates whether to return tokenizing sementics.
         * @return {object}  [oResult] Sends the validation status. In case of success, returns the actual data type of the whole expression). In case of error, returns error details and cursor position of error. If tokenizing was requested, returns the semantics of the tokens identified in the whole expression.
         * @public
         **/
        ExpressionLanguage.prototype.validateExpression = function (sExpression, eType, bCollection, bToken) {

            if (!this._isDataExist()) {
                return null;
            }

            this._init();

            this._initResponseCollector("Parsing");

            var flags = this._buildFlagsObject(null, bCollection, bToken);
			
            var parserResult = this._backendParser.parseExpression(sExpression, sap.rules.ui.BackendParserRequest.Validate, this._runtimeService, null, eType, this._vocabularyName, flags);

            var result = {};

            result.status = parserResult.status;

            if (result.status === "Error") {
                result.errorDetails = parserResult.errorDetails;
                result.cursorPosition = parserResult.cursorPosition;
            } else {
                result.actualReturnType = parserResult.actualReturnType;
            }

            if (parserResult.tokens) {
                result.tokens = parserResult.tokens;
            }

            return result;
        };

        ExpressionLanguage.prototype._buildFlagsObject = function (oConvert, bCollection, bToken) {
			
			//Default value for bCollection
            if (!bCollection) {
                bCollection = false;
            }

            //Default value for bToken
            if (bToken === undefined || bToken === null) {
                bToken = true;
            }
			
            var flags = { "isCollection": bCollection,
                          "tokensOutput": bToken
			};
            
            //handle locale flag (workaround to enable tests to run with default locale)
            if (this._localeSettings){
                flags.locale = { localeSettings: this._localeSettings };
            }
            
            if (oConvert){
				//handle locale flag
				flags.locale = {
					localeSettings: this._localeSettings,
					convert: oConvert
				};
				
				//handle termMode flag
				//flags.termMode = {
				//	convert: oConvert
				//};
            }
        
            return flags;
        };

        /**
         * Provides a context-sensitive suggestion list that assists the business user with the completion of the input of an expression using the rule expression language.
         * @param {string}   [sExpression] The rule expression to be completed.
         * @param {sap.rules.ui.ExpressionType}   [eType] The expected business data type of the expression.
         * @param {boolean}   [bCollection] Indicates whether the final expression is a collection.
         * @param {boolean}   [bToken] Indicates whether to return tokenizing sementics.
         * @return {object}  [oResult] Returns valid suggestions for the expression that needs to be completed. If tokenizing was requested, returns the semantics of the tokens identified in the whole expression.
         * @public
         **/
        ExpressionLanguage.prototype.getSuggestions = function (sExpression, eType, bCollection, bToken) {

            if (!this._isDataExist()) {
                return null;
            }

            this._init();

            this._initResponseCollector("Parsing");

            var flags = this._buildFlagsObject(null, bCollection, bToken);
            
            var parserResult = this._backendParser.parseExpression(sExpression, sap.rules.ui.BackendParserRequest.Suggests, this._runtimeService, null, eType, this._vocabularyName, flags);

            var result = {};

            result.suggs = parserResult.suggs;

            if (parserResult.tokens) {
                result.tokens = parserResult.tokens;
            }

            return result;
        };
        
        /**
         * Returns the fixed operators contained in the expression.
         * @param {string}   [sExpression] The expression to be completed.
         * @param {object}   [oFilter] The category types for filtering the result (enums from library.js file).
         * @private
         * @return {object}  [oResult] The fixed operators in the expression.
         **/
        ExpressionLanguage.prototype.getSuggestionsByCategories = function (sExpression, oFilter) {
            sExpression = sExpression ? sExpression : "";
            var suggs = this.getSuggestions(sExpression, sap.rules.ui.ExpressionType.BooleanEnhanced, false).suggs;
            suggs = suggs ? suggs : [];

            if (!oFilter) {
                return suggs;
            }

            var oResult = [];

            for (var i = 0; i < oFilter.length; i++) {
                var filter = oFilter[i];
                for (var j = 0; j < suggs.length; j++) {

                    if (filter.tokenType === undefined ||
                        filter.tokenType === suggs[j].tokenType ||
                        filter.hasOwnProperty('tokenType') === false) {

                        if (suggs[j].hasOwnProperty('info') === false) {

                            if ((filter.hasOwnProperty('tokenCategory') === false && filter.hasOwnProperty('tokenBusinessType') === false) ||
                                (filter.tokenCategory === undefined && filter.tokenBusinessType === undefined)) {
                                oResult.push(suggs[j]);
                            }

                        } else if ((filter.tokenCategory === undefined ||
                            filter.tokenCategory === suggs[j].info.category ||
                            filter.hasOwnProperty('tokenCategory') === false)
                            &&
                            (filter.tokenBusinessType === undefined ||
                            filter.tokenBusinessType === suggs[j].info.type ||
                            filter.hasOwnProperty('tokenBusinessType') === false)) {
                            oResult.push(suggs[j]);
                        }
                    }
                }
            }
            return oResult;
        };
        /**
         * Separates the expression into individual tokens.
         * @param {string}   [sExpression] The expression that has to be tokenized.
         * @return {object}  [oResult] Returns the tokens and their semantic information.
         * @public
         **/
        ExpressionLanguage.prototype.getExpressionMetadata = function (sExpression) {     //always return status Success

            if (!this._isDataExist()) {
                return null;
            }
            this._init();

            this._initResponseCollector("Parsing");

            var parserResult = this._backendParser.parseExpression(sExpression, sap.rules.ui.BackendParserRequest.GetMetadata, this._runtimeService, null, null, this._vocabularyName, null);

            var result = {};

            result.tokens = parserResult.tokens;

            return result;
        };

        /**
         * Returns the information of a given result
         * @param {string}   [sResult] the result
         * @private
         * @return {object}  [oResultInfo] ....
         **/
        ExpressionLanguage.prototype.getResultInfo = function (sResult) {

            if (!this._isDataExist()) {
                return null;
            }
            this._init();

            var oResultInfo = null;
            oResultInfo = this._runtimeService.getOutput(this._vocabularyName, sResult, null);

            //workaround that adds the paramId
            if (oResultInfo && oResultInfo.name) {
                this._getResultRequiredParamIds(oResultInfo);
            }

            return oResultInfo;
        };

        /**
         * Returns the information of a given result
         * @param {string}   [oResultInfo] the result Info
         * @private
         **/
        ExpressionLanguage.prototype._getResultRequiredParamIds = function (oResultInfo) {
            var i, j, k;
            var convertedData = JSON.parse(JSON.stringify(this._data));

            //Result conversion
            if (convertedData.DataObjects && convertedData.DataObjects.results) {
                convertedData.DataObjects = convertedData.DataObjects.results;

                for (i = 0; i < convertedData.DataObjects.length; i++) {
                    if (convertedData.DataObjects[i].Attributes
                        && convertedData.DataObjects[i].Attributes.results
                        && (convertedData.DataObjects[i].Name == oResultInfo.name)
                        && (convertedData.DataObjects[i].Usage == "RESULT")
                        && oResultInfo.requiredParams) {
                        convertedData.DataObjects[i].Attributes = convertedData.DataObjects[i].Attributes.results;
                        for (j = 0; j < convertedData.DataObjects[i].Attributes.length; j++) {
                            for (k = 0; k < oResultInfo.requiredParams.length; k++) {
                                if (oResultInfo.requiredParams[k].name === convertedData.DataObjects[i].Attributes[j].Name) {
                                    oResultInfo.requiredParams[k].paramId = convertedData.DataObjects[i].Attributes[j].Id;
                                }
                            }
                        }
                        // paramId updated
                        return;
                    }
                }
            }
            //not found
            return;
        };

        ExpressionLanguage.prototype._setConfigurationForBasic = function() {

            this.suggestAfterMap = {
                // initial should be taken from configuration
                "initial": [
                    "vocabulary,undefined"
                ],
                "vocabulary,undefined": [
                    "reservedword,comparisonOp",
                    "reservedword,comparisonBetweenOp",
                    "reservedword,comparisonExistOp"
                ],
                "reservedword,comparisonOp": [
                    "constant,dynamic",
                    "constant,fixed",
                    "reservedword,value"
                ],
                "reservedword,comparisonBetweenOp": [
                    "constant,dynamic",
                    "reservedword,value"
                ],
                "reservedword,comparisonExistOp": [
                    "constant,dynamic",
                    "constant,fixed",
                    "reservedword,value"
                ],
                "reservedword,UOM": [
                    "reservedword,null",
                    "reservedword,conjunctionOp"
                ],
                "reservedword,function": [
                    "vocabulary,undefined"
                ],
                "reservedword,conjunctionOp": [
                    "initial"
                ],
                "reservedword,value": [
                    "reservedword,null",
                    "reservedword,conjunctionOp"
                ],
                "reservedword,null": [
                    "reservedword,conjunctionOp"
                ],
                "constant.dynamic": [
                    "reservedword,UOM",
                    "reservedword,null",
                    "reservedword,conjunctionOp"
                ],
                "constant.fixed": [
                    "reservedword,null",
                    "reservedword,conjunctionOp"
                ],
                "unknown,undefined": []
            };

            this.filterByTypeMap = {
                "vocabulary,undefined": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.vocabulary
                }],
                "reservedword,comparisonOp": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.comparisonOp
                }],
                "reservedword,comparisonBetweenOp": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.comparisonBetweenOp
                }],
                "reservedword,comparisonExistOp": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.comparisonExistOp
                }],
                "reservedword,UOM": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.UOM
                }],
                "reservedword,function": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.func
                }],
                "reservedword,conjunctionOp": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.conjunctionOp
                }],
                "reservedword,value": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.value
                }],
                "reservedword,null": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: null
                }],
                "constant.dynamic": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.constant,
                    tokenCategory: sap.rules.ui.ExpressionCategory.dynamic
                }],
                "constant.fixed": [{
                    tokenType: sap.rules.ui.ExpressionTokenType.constant,
                    tokenCategory: sap.rules.ui.ExpressionCategory.fixed
                }],
            };
        };

        ExpressionLanguage.prototype.getSuggestionsForBasic = function(sExpression, eType, bCollection) {
            var suggestions = [];
            var result = this.getSuggestions(sExpression, eType, bCollection, true);

            if (!result || !result.suggs || !result.suggs.length) {
                return suggestions;
            }

            suggestions = this._filterSuggestionsForBasic(result);

            return suggestions;
        };

        ExpressionLanguage.prototype._filterSuggestionsForBasic = function(aSuggs) {
            var tokens = this._groupTokensByTokenType(aSuggs.tokens);
            var lastToken = null;

            if (tokens && tokens.length > 0) {
                lastToken = tokens[tokens.length - 1];
            }

            var category = this._getCategoryForToken(lastToken);
            var allowedSuggTypes = this.suggestAfterMap[category];
            var filters = this._getFilterForTokenTypes(allowedSuggTypes);

            var allowedSuggs = this._filterSuggestionsByCategories(aSuggs, filters);

            return {
                suggs: allowedSuggs,
                afterTokenType: lastToken && lastToken.tokenType
            };
        };

        ExpressionLanguage.prototype._getCategoryForToken = function(token) {

            if (!token) {
                return "initial";
            }

            var tokenType = token.tokenType;
            var infoCategory = token.info && token.info.category;

            return tokenType + "," + infoCategory;

            // switch (tokenType) {
            //     case sap.rules.ui.ExpressionTokenType.vocabulary:
            //         internalCategory = "term";
            //         break;
            //
            //     case sap.rules.ui.ExpressionTokenType.reservedWord:
            //         if (sap.rules.ui.ExpressionCategory.value === infoCategory) {
            //             internalCategory = "value";
            //         } else if (sap.rules.ui.ExpressionCategory.conjunctionOp === infoCategory) {
            //             internalCategory = "conjunctionOp";
            //         } else if (sap.rules.ui.ExpressionCategory.comparisonOp === infoCategory) {
            //             internalCategory = "comparisonOp";
            //         } else if (sap.rules.ui.ExpressionCategory.comparisonBetweenOp === infoCategory) {
            //             internalCategory = "comparisonBetweenOp";
            //         } else if (sap.rules.ui.ExpressionCategory.comparisonExistOp === infoCategory) {
            //             internalCategory = "comparisonExistOp";
            //         } else if (sap.rules.ui.ExpressionCategory.UOM === infoCategory) {
            //             internalCategory = "UOM";
            //         } else if (sap.rules.ui.ExpressionCategory.func === infoCategory) {
            //             internalCategory = "func";
            //         } else if (null === infoCategory) {
            //             internalCategory = "reservedword";
            //         }  else {
            //             internalCategory = "unknown";
            //         }
            //         break;
            //
            //     case sap.rules.ui.ExpressionTokenType.constant:
            //     case sap.rules.ui.ExpressionTokenType.parameter:
            //         internalCategory = "constant";
            //         break;
            //
            //     default:
            //         internalCategory = "unknown";
            //
            // }

            // return internalCategory;
        };

        ExpressionLanguage.prototype._getFilterForTokenTypes = function(aTypes) {
            var filters = [];

            for (var i = 0; i < aTypes.length; i++) {
                var type = aTypes[i];

                var filter = this.filterByTypeMap[type];
                if (filter) {
                    filters.push(filter);
                }
            }

            return filters;
        };

        /**
         *
         * @param {array}   [aSuggs] array of all suggestions for some expression.
         * @param {object}   [oFilter] The category types for filtering the result (enums from library.js file).
         * @return {array} results
         * @private
         **/
        ExpressionLanguage.prototype._filterSuggestionsByCategories = function (aSuggs, oFilter) {

            var oResult = [];

            if (!aSuggs || !oFilter) {
                return oResult;
            }

            for (var i = 0; i < oFilter.length; i++) {
                var filter = oFilter[i];
                for (var j = 0; j < suggs.length; j++) {

                    if (filter.tokenType === undefined ||
                        filter.tokenType === suggs[j].tokenType ||
                        filter.hasOwnProperty('tokenType') === false) {

                        if (suggs[j].hasOwnProperty('info') === false) {

                            if ((filter.hasOwnProperty('tokenCategory') === false && filter.hasOwnProperty('tokenBusinessType') === false) ||
                                (filter.tokenCategory === undefined && filter.tokenBusinessType === undefined)) {
                                oResult.push(suggs[j]);
                            }

                        } else if ((filter.tokenCategory === undefined ||
                            filter.tokenCategory === suggs[j].info.category ||
                            filter.hasOwnProperty('tokenCategory') === false)
                            &&
                            (filter.tokenBusinessType === undefined ||
                            filter.tokenBusinessType === suggs[j].info.type ||
                            filter.hasOwnProperty('tokenBusinessType') === false)) {
                            oResult.push(suggs[j]);
                        }
                    }
                }
            }
            return oResult;
        };

        ExpressionLanguage.prototype._groupTokensByTokenType = function(aTokens) {
            var tokenGroups = [];

            if (!aTokens || !aTokens.length) {
                return tokenGroups;
            }

            var previousType = "";

            for (var i = 0; i < aTokens.length; i++) {
                var token = aTokents[i];
                if (token.tokenType === sap.rules.ui.ExpressionTokenType.whitespace) {
                    continue;
                } else if (token.tokenType !== sap.rules.ui.ExpressionTokenType.vocabulary) {
                    tokenGroups.push(token);
                    previousType = token.tokenType;
                } else {
                    if (previousType !== sap.rules.ui.ExpressionTokenType.vocabulary) {
                        tokenGroups.push(token);
                    } else {
                        tokenGroups[tokenGroups.length - 1].token += " " + token.token;
                        tokenGroups[tokenGroups.length - 1].end = token.end;
                    }
                    previousType = token.tokenType;
                }
            }

            return tokenGroups;
        };


        ExpressionLanguage.prototype._getSubExpressions = function(aTokens) {
            var aExpressions = [];

            var compTokens = aTokens.tokens.filter(function( obj ) { //comp expression
                var oTokenInfo = obj.info;
                if (oTokenInfo) {
                    return oTokenInfo.category === sap.rules.ui.ExpressionCategory.comparisonOp || oTokenInfo.category === sap.rules.ui.ExpressionCategory.comparisonBetweenOp || oTokenInfo.category === sap.rules.ui.ExpressionCategory.comparisonExistOp;
                }
            });

            aExpressions.push({
                exp: ""
            });

            var i = 0
            while (aTokens.tokens[i] !== compTokens[0]) {
                aExpressions[0].exp += aTokens.tokens[i].token;
                i++;
            } //left expression

            aExpressions[0].exp = aExpressions[0].exp.replace(/  +/g, ' '); // remove multiple spaces with one
            if (!aExpressions[0].exp) {
                return aExpressions;
            }

            if (aExpressions[0].exp.slice(-1) === " ") { //if last character of right side is white space - delete it!
                aExpressions[0].exp = aExpressions[0].exp.slice("", -1);
            }

            i++; //skip the comp we found

            if (!compTokens[0]) {
                return aExpressions;
            }

            aExpressions.push({
                exp: compTokens[compTokens.length - 1].token.replace(/  +/g, ' '), // remove multiple spaces with one
                type: this._getCompType(this.exp)
            }); //if we have only left side, then comp expression need to be "" for creating the control

            if (i < aTokens.tokens.length) {
                aExpressions.push({
                    exp: ""
                }); //if we have only left side and comp, then right expression need to be "" for creating the control

                for ( ; i < aTokens.tokens.length ; i ++) { //right expression
                    aExpressions[2].exp += aTokens.tokens[i].token;
                }
            }

            return aExpressions;
        };

        ExpressionLanguage.prototype._getBasicSuggestions = function(expression, ePart) {
            if (!ePart) {
                ePart = sap.rules.ui.SuggestionsPart.all;
            }
            var oTokens = this.validateExpression(expression); //get tokens for getting sub expression

            var oSuggestions = []; // array of suggestions (return variable)

            var aExpression = this._getSubExpressions(oTokens) // get the sub expression

            var sLeftExpression = (aExpression[0] && aExpression[0].exp) ? aExpression[0].exp : "";
            if (ePart === sap.rules.ui.SuggestionsPart.all) { // pus the left suggestions 
                oSuggestions.push(this._getLeft("", sLeftExpression)); // push the left suggestion

                if (sLeftExpression === "") { //if we have only left side
                    return oSuggestions;
                }
            }

            var sCompExpression = (aExpression[1] && aExpression[1].exp) ? aExpression[1].exp : "";
            var sCompType = "" || (aExpression[1] && aExpression[1].type);
            if (ePart === sap.rules.ui.SuggestionsPart.all || ePart === sap.rules.ui.SuggestionsPart.compPart) {
                oSuggestions.push(this._getComp(sLeftExpression, sCompExpression, sCompType)); // push the comp suggestion

                if (aExpression.length === 1) { //if we have only left side and comp
                    return oSuggestions;
                }
            }

            if (ePart === sap.rules.ui.SuggestionsPart.all || ePart === sap.rules.ui.SuggestionsPart.rightPart) {
                var sRightExpression = (aExpression[2] && aExpression[2].exp) ? aExpression[2].exp : "";
                sCompType = (ePart === sap.rules.ui.SuggestionsPart.all) ? oSuggestions[1].type : null;
                var oRightSuggestions = this._getRight(sLeftExpression, sCompExpression, sRightExpression, sCompType, oTokens); // get the right suggestionS

                oSuggestions.push.apply(oSuggestions, oRightSuggestions);
            }
            return oSuggestions;
        };

        ExpressionLanguage.prototype._getLeft = function(sEmptyString, currentValue) {

            var oSuggestion = this._createEmptySuggestion(1)[0]; //the return suggestion

            var oFilters = [{tokenType : sap.rules.ui.ExpressionTokenType.vocabulary}]; //the filter for getSuggestionsByCategories

            var oSuggestions = this.getSuggestionsByCategories(sEmptyString, oFilters);

            for (var i = 0 ; i < oSuggestions.length ; i++) {
                oSuggestion.sugg.push(oSuggestions[i].text); //put the suggestions by categories into sugg property
            }

            oSuggestion.currentValue = currentValue; //put current value

            oSuggestion.tokenCategory = sap.rules.ui.ExpressionTokenType.vocabulary;

            return oSuggestion;
        };

        ExpressionLanguage.prototype._getComp = function(sLeftSide, currentValue, sCompType) {

            var oSuggestion = this._createEmptySuggestion(1)[0]; //the return suggestion

            var oFilters = [{
                tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                tokenCategory: sap.rules.ui.ExpressionCategory.comparisonOp
            }, {
                tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                tokenCategory: sap.rules.ui.ExpressionCategory.comparisonBetweenOp
            }, {
                tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                tokenCategory: sap.rules.ui.ExpressionCategory.comparisonExistOp
            }]; //the filter for getSuggestionsByCategories

            var oSuggestions = this.getSuggestionsByCategories(sLeftSide, oFilters);

            oSuggestion.type = sCompType || this._getCompType(currentValue); //get comparison type (can't get expressionMetadata for empty string)

            for (var i = 0 ; i < oSuggestions.length ; i++) {
                oSuggestion.sugg.push(oSuggestions[i].text); //put the suggestions by categories into sugg property
            }

            //oSuggestion.sugg.sort();

            oSuggestion.currentValue = currentValue; //put current value

            //oSuggestion.tokenCategory = sap.rules.ui.ExpressionTokenType.vocabulary;

            return oSuggestion;
        };

        ExpressionLanguage.prototype._getRight = function(sLeft, sComp, currentValue, sCompType, oTokens) {
            var aSuggestion;
            var sLefAndCompExprerssion = sLeft + " " + sComp; //calculate left side + comp
            var sLeftBusinessDataType = this._getLeftBusinessDataType(sLeft); //get business left data type
            if (!sCompType) { //true if we not in get all parts
                sCompType = this._getCompType(sComp); //get comparison type (can't get expressionMetadata for empty string)
            }
            switch (sCompType) {
                case sap.rules.ui.ExpressionCategory.comparisonOp: //in case simple comparison
                    aSuggestion = this._geRightForComparisonOp(sLeftBusinessDataType, sLefAndCompExprerssion, currentValue);
                    break;
                case sap.rules.ui.ExpressionCategory.comparisonBetweenOp: //in case simple comparison
                    aSuggestion = this._geRightForBetweenOp(sLeftBusinessDataType, sLefAndCompExprerssion, currentValue);
                    break;
                case sap.rules.ui.ExpressionCategory.comparisonExistOp: //in case exist comparison
                    //aSuggestion = this._geRightForExistOp(sLeftBusinessDataType, sLefAndCompExprerssion, currentValue, oTokens);
                    break;
            }
            if (!aSuggestion) {
                return [{}];
            }
            return aSuggestion;
        };

        ExpressionLanguage.prototype._geRightForComparisonOp = function(sLeftBusinessDataType, sLefAndCompExprerssion, currentValue) {
            var oSuggestion = this._createEmptySuggestion(1); //the return right suggestions
            var aSuggestions
            oSuggestion[0].BDT = sLeftBusinessDataType;

            if (sLeftBusinessDataType === sap.rules.ui.ExpressionType.TimeSpan) { // sLeftBusinessDataType = TimeSpan (duration)
                oSuggestion.push.apply(oSuggestion, this._createEmptySuggestion(1)); // add more suggestion {value}
                var oFilters = [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.UOM
                }];

                var filtered = this._splitStringBySeperator(currentValue, " "); // remove space for example "3 days" --> ["3", "days"]

                oSuggestion[0].currentValue = filtered[0];
                oSuggestion[1].currentValue = filtered[1];

                aSuggestions = this.getSuggestionsByCategories(sLefAndCompExprerssion + " 5", oFilters);
                for (var i = 0 ; i < aSuggestions.length ; i++) {
                    oSuggestion[1].sugg.push(aSuggestions[i].text);
                }

            } else if (sLeftBusinessDataType === sap.rules.ui.ExpressionType.Date) { // sLeftBusinessDataType = Date (birthdate) 
                var oFilters = [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.value
                }, {
                    tokenType: sap.rules.ui.ExpressionTokenType.constant,
                    tokenCategory: sap.rules.ui.ExpressionCategory.dynamic
                }];

                aSuggestions = this.getSuggestionsByCategories(sLefAndCompExprerssion + " ", oFilters);
                for (var i = 0 ; i < aSuggestions.length ; i++) {
                    oSuggestion[0].sugg.push(aSuggestions[i].text);
                }
                oSuggestion[0].currentValue = jQuery.trim(currentValue); //remove extra spaces before and after string [duplicate]

            } else { //sLeftBusinessDataType = number/string/etc...

                oSuggestion[0].currentValue = jQuery.trim(currentValue); //remove extra spaces before and after string [duplicate]
            }
            return oSuggestion;
        };

        ExpressionLanguage.prototype._geRightForBetweenOp = function(sLeftBusinessDataType, sLefAndCompExprerssion, currentValue) {
            var oSuggestion = this._createEmptySuggestion(1); //the return right suggestions
            var aSuggestions;
            var filtered;
            oSuggestion[0].BDT = sLeftBusinessDataType;
            if (sLeftBusinessDataType !== sap.rules.ui.ExpressionType.TimeSpan && sLeftBusinessDataType !== sap.rules.ui.ExpressionType.Date) {
                filtered = this._getRightExpressionsForTimeStamp(currentValue); //get expression for non Timespan or Date right side
            } else {
                var filtered = this._splitStringBySeperator(currentValue, " "); // remove space, for example "3 days to 10 years" --> ["3", "days", "to", "10", "years"]
            }

            if (sLeftBusinessDataType === sap.rules.ui.ExpressionType.TimeSpan) { // sLeftBusinessDataType = TimeSpan (for example duration) 

                oSuggestion.push.apply(oSuggestion, this._createEmptySuggestion(4)); //create new suggestions = [{units} To {value units}]
                oSuggestion[3].BDT = sLeftBusinessDataType;

                var oFilters = [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.UOM
                }];

                aSuggestions = this.getSuggestionsByCategories(sLefAndCompExprerssion + " 5", oFilters);
                for (var i = 0 ; i < aSuggestions.length ; i++) {
                    oSuggestion[1].sugg.push(aSuggestions[i].text);
                    oSuggestion[4].sugg.push(aSuggestions[i].text);
                }

            } else if (sLeftBusinessDataType === sap.rules.ui.ExpressionType.Date) { // sLeftBusinessDataType = Date (for example birthdate)
                oSuggestion.push.apply(oSuggestion, this._createEmptySuggestion(2)); //create new suggestions = [To {date}]
                oSuggestion[2].BDT = sLeftBusinessDataType

                var oFilters = [{
                    tokenType: sap.rules.ui.ExpressionTokenType.reservedWord,
                    tokenCategory: sap.rules.ui.ExpressionCategory.value
                }, {
                    tokenType: sap.rules.ui.ExpressionTokenType.constant,
                    tokenCategory: sap.rules.ui.ExpressionCategory.dynamic
                }];

                aSuggestions = this.getSuggestionsByCategories(sLefAndCompExprerssion + " ", oFilters);
                for (var i = 0 ; i < aSuggestions.length ; i++) {
                    oSuggestion[0].sugg.push(aSuggestions[i].text);
                    oSuggestion[2].sugg.push(aSuggestions[i].text);
                }

            } else { //sLeftBusinessDataType = number/string/etc...
                oSuggestion.push.apply(oSuggestion, this._createEmptySuggestion(2)); //create new suggestions = [To {value}]
                oSuggestion[2].BDT = sLeftBusinessDataType;

            }

            for (var i = 0 ; i < oSuggestion.length ; i ++) { //put value in suggestions and set the 'to' suggestion
                if (filtered[i] === "to" || (i === 2 && sLeftBusinessDataType === sap.rules.ui.ExpressionType.TimeSpan) //logic for putting the 'to'\'and' at currentValue
                    || (i === 1 && sLeftBusinessDataType === sap.rules.ui.ExpressionType.Date)
                    || ((i === 1 && sLeftBusinessDataType !== sap.rules.ui.ExpressionType.Date) && (i === 1 && sLeftBusinessDataType != sap.rules.ui.ExpressionType.TimeSpan))) {
                    oSuggestion[i].tokenCategory = "reservedword.undefined";
                    oSuggestion[i].currentValue = (filtered[i] === "to" || filtered[i] === "and") ? filtered[i] : "to";
                } else {
                    oSuggestion[i].currentValue = jQuery.trim(filtered[i]); //remove extra spaces before and after string [duplicate]
                }
            }
            return oSuggestion;
        };

        ExpressionLanguage.prototype._geRightForExistOp = function(sLeftBusinessDataType, sLefAndCompExprerssion, sRight, aTokens) {
            var oSuggestion = this._createEmptySuggestion(1); //the return right suggestions
            oSuggestion[0].BDT = sLeftBusinessDataType;
            if (sLeftBusinessDataType === sap.rules.ui.ExpressionType.TimeSpan) {
                var aResults = aTokens.tokens.filter(function( obj ) { //comp expression
                    if (obj.info) {
                        return obj.info.category === sap.rules.ui.ExpressionCategory.UOM || obj.tokenType === sap.rules.ui.ExpressionTokenType.constant;
                    }
                });
                aResults.forEach(function(value, i) {

                });
            } else if (sLeftBusinessDataType === sap.rules.ui.ExpressionType.Date) {
                var aResults = aTokens.tokens.filter(function( obj ) { //comp expression
                    if (obj.info) {
                        return obj.info.category === sap.rules.ui.ExpressionCategory.value;
                    }
                });

                aResults.forEach(function(value, i) {

                });

            }
            return oSuggestion;

        };

        ExpressionLanguage.prototype._getLeftBusinessDataType = function(sLeftExpression) {
            return this.validateExpression(sLeftExpression).actualReturnType;
        };

        ExpressionLanguage.prototype._splitStringBySeperator = function(sExpression, sSeperator) {
            return sExpression.split(sSeperator).filter((function removeEmptyStrings(str) { // remove empty strings
                return str !== "";
            }));
        };

        ExpressionLanguage.prototype._getCompType = function(sComp) {
            if (sComp) {
                return this.getExpressionMetadata(sComp).tokens[0].info.category //get comparison type (can't get expressionMetadata for empty string)
            } else {
                return null;
            }
        };

        ExpressionLanguage.prototype._createEmptySuggestion = function(iAmount) { //create empty suggestion
            var aSuggestions = [];
            for (var i = 0 ; i < iAmount ; i++) {
                aSuggestions.push({
                    sugg: []
                });
            }
            return aSuggestions;
        };

        ExpressionLanguage.prototype._getRightExpressionsForTimeStamp = function(expression) {

            if (!String.prototype.includes) {
                String.prototype.includes = function() {
                    'use strict';
                    return String.prototype.indexOf.apply(this, arguments) !== -1;
                };
            }

            if (expression.indexOf("to") !== -1) { //if expression have 'to'
                var filtered = this._splitStringBySeperator(expression, "to"); //split expression by 'to'
                filtered.splice(1, 0, "to"); // put 'to' in the array
                console.log(filtered);
                return filtered;
            } else if (expression.indexOf("and") !== -1) { //if expression have 'and'
                var filtered = this._splitStringBySeperator(expression, "and"); //split expression by 'and'
                filtered.splice(1, 0, "and"); // put 'and' in the array
                return filtered;
            }
            return [expression, "to"];
        };

        ExpressionLanguage.prototype._addOdataTags = function(oConvertParserResults) {
            var oRule = oConvertParserResults.decisionTableData;

            if (oRule) {

                // Convert columns
                var colArr = oRule.DecisionTable.DecisionTableColumns;
                oRule.DecisionTable.DecisionTableColumns = {
                    results: colArr
                };

                // Convert cells
                if (oRule.DecisionTable.DecisionTableRows) {
                    oRule.DecisionTable.DecisionTableRows.forEach( function(row) {
                        var cellArr = row.Cells;

                        row.Cells = {
                            results: cellArr
                        };
                    });
                }
            }
        };

        ExpressionLanguage.prototype.convertDecisionTableExpressionToDisplayValue = function (sHeaderExpression, sFixedOpr, sCellExpression,
                                                                                              eExpressionType) {

            this._init();
            var oConvert = { "source": "codeText", "target": "displayText" };
            var flags = this._buildFlagsObject(oConvert);
            
            var ResponseCollector = this._initResponseCollector("RuleServiceValidation");
            var resCollectorInstance = ResponseCollector.getInstance();

            resCollectorInstance.setOpMessage("RuleServiceValidation", "failure");

            var result = RuleServices.lib.validateDecisionTableExpression(sHeaderExpression, sFixedOpr, sCellExpression, eExpressionType, this._vocabularyName,
                this._runtimeService, flags);
            if (result.status == "Success") {
                resCollectorInstance.setOpMessage("RuleServiceValidation", "success");
            }
            resCollectorInstance.setOutput(result);
            var finalResponse = resCollectorInstance.build();

            return finalResponse;
        };
        ExpressionLanguage.prototype.convertDecisionTableExpressionToModelValue = function (sHeaderExpression, sFixedOpr, sCellExpression,
                                                                                            eExpressionType) {

            this._init();
            var oConvert = { "source": "displayText", "target": "codeText" };
            var flags = this._buildFlagsObject(oConvert);

            var ResponseCollector = this._initResponseCollector("RuleServiceValidation");
            var resCollectorInstance = ResponseCollector.getInstance();

            resCollectorInstance.setOpMessage("RuleServiceValidation", "failure");
            var result = RuleServices.lib.validateDecisionTableExpression(sHeaderExpression, sFixedOpr, sCellExpression, eExpressionType, this._vocabularyName,
                this._runtimeService, flags);

            if (result.status == "Success") {
                resCollectorInstance.setOpMessage("RuleServiceValidation", "success");
            }
            resCollectorInstance.setOutput(result);
            var finalResponse = resCollectorInstance.build();

            return finalResponse;
        };
        
        ExpressionLanguage.prototype.getExpressionLanguageVersion = function () {
			return RuleServices.lib.getParserExprLangVersion();
        };

        return ExpressionLanguage;
    }, /* bExport= */true);