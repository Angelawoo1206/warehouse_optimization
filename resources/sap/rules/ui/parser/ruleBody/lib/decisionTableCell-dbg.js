jQuery.sap.declare("sap.rules.ui.parser.ruleBody.lib.decisionTableCell");

jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator");
jQuery.sap.require("sap.rules.ui.parser.infrastructure.errorHandling.hrfException");
jQuery.sap.require("sap.rules.ui.parser.infrastructure.messageHandling.lib.responseCollector");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");
jQuery.sap.require("sap.rules.ui.parser.ruleBody.lib.constants");

sap.rules.ui.parser.ruleBody.lib.decisionTableCell = sap.rules.ui.parser.ruleBody.lib.decisionTableCell|| {}; 
sap.rules.ui.parser.ruleBody.lib.decisionTableCell.lib = (function() {
	
	var parser = new sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator.lib.parsingBackendMediatorLib();
	var hrfException = sap.rules.ui.parser.infrastructure.errorHandling.hrfException.lib;
	var responseCollector = sap.rules.ui.parser.infrastructure.messageHandling.lib.responseCollector.lib.ResponseCollector;
	var parserConstants = sap.rules.ui.parser.businessLanguage.lib.constants.lib;
	var ruleBodyconstants = sap.rules.ui.parser.ruleBody.lib.constants.lib;
	
	/**
	 * C'tor
	 */
	function DecisionTableCell(headerExpression, fixedOperator, cellExpression, businessDataType, vocabulary, vocaDataProvider){	
		this.cellExpression = cellExpression;
		this.headerExpression = headerExpression;
		this.operator = fixedOperator;
		this.businessDataType = businessDataType;
		
		this.vocabulary = vocabulary;
		this.vocaDataProvider = vocaDataProvider; 
		
		this.status = parserConstants.statusEnum.SUCCESS;
		this.convertedHeader = null;
		this.convertedCell = null;
		this.convertedCondition = null;
		
		this.currCursorInfo = {};
	}
	
	/**
	 * Concatenating DT condition
	 * @param header's expression
	 * @param cell's expression
	 */
	var concatToDecisionTableCondition = function concatToDecisionTableCondition(header, expression, operator) {
		var condition = '';
		
		if (header) {
			condition += header;
		}
		if (operator){
			condition += " " + operator;
		}
		if (expression){
			condition += " " + expression;
		}
		
		return condition;
	};
	
	/**
	 * Splitting the header and cell from DT condition, returning the cell
	 * @param header (after conversion if needed)
	 * @param condition (header + operator + cell) 
	 * @param operator (optional)
	 */
	var splitDecisionTableCondition = function splitDecisionTableCondition(header, condition, operator) {
		var cell, cellStartIndex = 0, cellLength = condition.length;
		
		if(header){
			cellStartIndex = header.length + 1;
			cellLength = condition.length - header.length - 1;
		
			//updating cellStartIndex and cellLength if has operator
			if(operator){
				cellStartIndex += operator.length + 1;
				cellLength -= (operator.length + 1);
			}
		}
		
		cell = condition.substr(cellStartIndex, cellLength);
		
		return cell;
	};
	
	/**
	 * Gets the parsed expression from the parser, if not valid throws exception
	 * @param expression
	 * @param parserMode
	 * @param variables
	 * @param contentType
	 * @param flags
	 */
	DecisionTableCell.prototype.getParserAST = function getParserAST(expression, parserMode, variables, contentType, flags) {
		
		function expressionEmpty (expression) {
			if (expression === null || expression === undefined || expression === "") {
				return true;
			}
			return false;
		}
		
		var parsedBusinessRule = parser.parseInputRT(expression, parserMode, this.vocaDataProvider, variables, contentType, this.vocabulary, flags);
		
		if (parsedBusinessRule === undefined ||
			(parsedBusinessRule === null && expressionEmpty(expression) === false)) {
			responseCollector.getInstance().addMessage("error_in_parsing_expression", [expression]);
			throw new hrfException.HrfException ("error_in_parsing_expression: " + expression, false);
		}
	
		if (parserMode === parser.PARSE_MODE) {
			if (parsedBusinessRule !== null && parsedBusinessRule.status === parserConstants.statusEnum.ERROR) {
				throw new hrfException.HrfException ('', false);
			}
		}
		
		return parsedBusinessRule;
	};
	
	/**
	 * gets the converted expression returned from the parser
	 */
	DecisionTableCell.prototype.getParserConvertedExpression = function getParserConvertedExpression(parserResult){	
		return parserResult[ruleBodyconstants.parserResultEnum.convertedExpression];
	};
	
	/**
	 * Return true if the parser did the conversion
	 */
	DecisionTableCell.prototype.hasParserConvertedExpression = function hasParserConvertedExpression(parserResult){
		if(parserResult.status === parserConstants.statusEnum.SUCCESS){
			
		   if(!parserResult.hasOwnProperty(parserConstants.propertiesEnum.convertedExpression)){
			   this.status = parserConstants.statusEnum.ERROR;
		   }
		   else{
			   return true;
		   }
		}
		
		return false;
	};
	
	/**
	 * validateAndConvert according flags
	 * @param flags
	 */
	DecisionTableCell.prototype.validateAndConvert = function validateAndConvert(flags) {
		var condition;
		var parserType;
		var result;
		
		// Updating cursor position of header or cell, according first error.  
		function updateCursorInfo(cursorPosition){
			var updatedCursorInfo = {};
			
			if (this.convertedHeader && cursorPosition > this.convertedHeader.length){
				updatedCursorInfo.position = cursorPosition - this.convertedHeader.length - this.operator.length - 2;
				updatedCursorInfo.expressionPart = ruleBodyconstants.expressionParts.cell;
			}
			else{
				updatedCursorInfo.position = cursorPosition;
				updatedCursorInfo.expressionPart = ruleBodyconstants.expressionParts.header;
			}	
			return updatedCursorInfo;
		}
		
		// Adding parser message with the updated cursor position
		function handleParserMessage(parserResult) {
			var additionalInfo = {};
			
			if (parserResult) {
				if (parserResult.hasOwnProperty('cursorPosition') && 
					parserResult.cursorPosition !== undefined && 
					parserResult.cursorPosition !== null){
					additionalInfo.cursorInfo = updateCursorInfo.call(this, parserResult.cursorPosition);
				}
				responseCollector.getInstance().addMessage(parserResult.errorID, undefined, null, additionalInfo, parserResult.errorDetails);
			}
		}
		
		// Building the results
		function buildResult(){
			var result = {};
		
			result.status = this.status;
			
			if (this.status === parserConstants.statusEnum.SUCCESS){
				if(this.convertedCell || this.convertedHeader){
					result.converted = {};
					result.converted.header = this.convertedHeader;
					result.converted.fixedOperator = this.operator;
					result.converted.cell = this.convertedCell;
				}	
				result.actualReturnType = this.actualReturnType;
			}		
			return result;
		}
		
		// Validates header/condition/result
		function validateExpressionPart(expressionPart, parserType, flags){
			var parserResult, convertedExpressionPart = null;
			
			//flags[parserConstants.propertiesEnum.raiseError] = false;
			parserResult = this.getParserAST(expressionPart, parserConstants.VALIDATE_MODE, null, parserType, flags);
			
			if (this.hasParserConvertedExpression(parserResult)){ // Success & Converted
				convertedExpressionPart = this.getParserConvertedExpression(parserResult);
				this.actualReturnType = parserResult.actualReturnType;
			}
			else{ // Error
				handleParserMessage.call(this, parserResult);
				this.status = parserConstants.statusEnum.ERROR;
			}
			
			return convertedExpressionPart;
		}
		
		// Validates & Converts cell info
		//********************************	
		if(this.headerExpression){ // HEADER: When it is condition with header or just a header		
			this.convertedHeader = validateExpressionPart.call(this, this.headerExpression, parserConstants.TYPE_SINGLE_EXPRESSION, flags);
		}
		
		// When there is no problem with header validation or conversion
		if (this.status === parserConstants.statusEnum.SUCCESS && this.cellExpression){
			condition = concatToDecisionTableCondition(this.headerExpression, this.cellExpression, this.operator);
			parserType = this.businessDataType || parserConstants.TYPE_BOOLEAN_ENHANCED;
			this.convertedCondition = validateExpressionPart.call(this, condition, parserType, flags);
			if (this.status === parserConstants.statusEnum.SUCCESS){
				this.convertedCell = splitDecisionTableCondition(this.convertedHeader, this.convertedCondition, this.operator);
			}
		}
		
		result = buildResult.call(this);
		return result;
	};
	
	return {
		DecisionTableCell 				: DecisionTableCell,
		
		concatToDecisionTableCondition	: concatToDecisionTableCondition,
		splitDecisionTableCondition 	: splitDecisionTableCondition
	};

}());