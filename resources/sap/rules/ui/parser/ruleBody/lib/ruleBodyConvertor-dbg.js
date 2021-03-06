jQuery.sap.declare("sap.rules.ui.parser.ruleBody.lib.ruleBodyConvertor");

jQuery.sap.require("sap.rules.ui.parser.ruleBody.lib.ruleBodyValidator");
jQuery.sap.require("sap.rules.ui.parser.ruleBody.lib.constants");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");
jQuery.sap.require("sap.rules.ui.parser.infrastructure.util.utilsBase");

/** 
 * This class is a for rule body conversions:
 * @constructor
 */

sap.rules.ui.parser.ruleBody.lib.ruleBodyConvertor = sap.rules.ui.parser.ruleBody.lib.ruleBodyConvertor|| {}; 
sap.rules.ui.parser.ruleBody.lib.ruleBodyConvertor.lib = (function() {
	
	var ruleBodyValidatorLib = sap.rules.ui.parser.ruleBody.lib.ruleBodyValidator.lib;
	var constants = sap.rules.ui.parser.ruleBody.lib.constants.lib;
	var parserConstants = sap.rules.ui.parser.businessLanguage.lib.constants.lib;
	var utilsBaseLib = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
	
	function RuleBodyConvertor(oDataRule) {
	
		jQuery.sap.log.debug("CTOR - Rule Convertor");
		this.oDataRule = oDataRule;
		ruleBodyValidatorLib.RuleBodyValidator.call(this); 
		
		this.convertedRuleBody = null;
		this.decisionTableData = oDataRule ? JSON.parse(JSON.stringify(oDataRule)): null;
	}
	
	RuleBodyConvertor.prototype = Object.create(ruleBodyValidatorLib.RuleBodyValidator.prototype); //Inherit rule body validator properties and functions
	RuleBodyConvertor.prototype.constructor = RuleBodyConvertor; 								   //Change the reference of the constructor
	
	
	/****************************************************************************************************************************************
	*		Helper methods
	*****************************************************************************************************************************************/
	
	/**
	 * 
	 */
	RuleBodyConvertor.prototype.getConvertedData = function getConvertedData(converted, convertedExpression, expressionPart){
		converted[expressionPart] = convertedExpression;
		return converted;
	};
	
	/**
	 * addDecisionTableDataInstance to the odata
	 * @param status
	 * @param actualType
	 * @param path
	 * @param converted
	 */
	RuleBodyConvertor.prototype.addParserResults = function addParserResults(path, converted, status){
		var parserResults = {};
		
		parserResults.status = status;
		if (converted){
			parserResults.converted = converted;
		}
		utilsBaseLib.setJsonValueAccordingPath(this.decisionTableData, path, constants.decisionTableDataOutputPropEnum.parserResults, parserResults); 
	};
	
	/**
	 * Return true if the parser did the conversion
	 */
	RuleBodyConvertor.prototype.hasParserConvertedExpression = function hasParserConvertedExpression(){
		
		if (this.currentParserResult.status === parserConstants.statusEnum.SUCCESS){
			
		   if (!this.currentParserResult.hasOwnProperty(constants.parserResultEnum.convertedExpression)){
			   if (!this.flags[constants.outputFlagsEnum.ASTOutput]){
				   this.status = constants.RULE_ERROR;
			   }
		   } else {
			   return true;
		   }
		}
		
		return false;
	};
	
	/**
	 * gets the converted expression returned from the parser
	 */
	RuleBodyConvertor.prototype.getParserConvertedExpression = function getParserConvertedExpression(){
		
		return this.currentParserResult[constants.parserResultEnum.convertedExpression];
	};
	
	
	/****************************************************************************************************************************************
	*		Overriden Text Handles
	*****************************************************************************************************************************************/
	
	/**
	 * handles Text Condition
	 */
	RuleBodyConvertor.prototype.handleTextCondition = function handleTextCondition(condition, result, pathPrefix) {
		
		ruleBodyValidatorLib.RuleBodyValidator.prototype.handleTextCondition.call(this, condition, result, pathPrefix);
		
		if (this.status === constants.RULE_SUCCESS && this.hasParserConvertedExpression()){
		
			//The conversion here need to be done using the ruleBody itself,
			//in order to copy by reference and not by value
			this.convertedRuleBody.content.condition = this.getParserConvertedExpression();
		}
	};
	
	
	/**
	 * handles Text Output Parameter
	 * @param currentOutput
	 */
	RuleBodyConvertor.prototype.handleTextOutputParameter = function handleTextOutputParameter(currentOutput, result, pathPrefix) {
		
		ruleBodyValidatorLib.RuleBodyValidator.prototype.handleTextOutputParameter.call(this, currentOutput, result, pathPrefix);
		
		if (this.status === constants.RULE_SUCCESS && this.hasParserConvertedExpression()){
			currentOutput.content = this.getParserConvertedExpression();
		}
	};
	
	
	/**
	 * handles Text Action Parameter
	 * @param currentParam
	 */
	RuleBodyConvertor.prototype.handleTextActionParameter = function handleTextActionParameter(currentParam, result, index, pathPrefix) {
		
		ruleBodyValidatorLib.RuleBodyValidator.prototype.handleTextActionParameter.call(this, currentParam, result, index, pathPrefix);
		
		if (this.status === constants.RULE_SUCCESS && this.hasParserConvertedExpression()){
			currentParam.content = this.getParserConvertedExpression();
		}
	};
	
	/****************************************************************************************************************************************
	*		Overriden DT Handles
	*****************************************************************************************************************************************/
	/**
	 * handles condition
	 * @param header
	 * @param currentRow
	 * @param colIndex
	 * @param rowResult
	 * @returns
	 */
	RuleBodyConvertor.prototype.handleDecisionTableCondition = function handleDecisionTableCondition(header, currentRow, colIndex, rowResult) {
		var convertedCondition, convertedCellExpression;
		var converted = {};
		
		rowResult = ruleBodyValidatorLib.RuleBodyValidator.prototype.handleDecisionTableCondition.call(this, header, currentRow, colIndex, rowResult);
		
		if (this.hasParserConvertedExpression() && this.invalidHeaders[header.colID] !== true){
			
			convertedCondition = this.getParserConvertedExpression();
	
			//split the cell from the converted condition that includes header + cell
			var operator = header.hasOwnProperty(constants.afterConversionParts.fixedOperator)? header.fixedOperator.operator : null;
			convertedCellExpression = this.splitDecisionTableCondition(header.convertedExpression, convertedCondition, operator);
	
			if (this.flags[constants.outputFlagsEnum.oDataOutput]){ 
				converted = this.getConvertedData(converted, convertedCellExpression, constants.decisionTableExpressionParts.content);
				this.addParserResults(currentRow.row[colIndex].inputModelPath, converted, this.currentParserResult.status);
			} else if (this.status === constants.RULE_SUCCESS){
					//overwrite the header expression 
					header.expression = header.convertedExpression;
					currentRow.row[colIndex].content = convertedCellExpression;
			}
		} else if (this.flags[constants.outputFlagsEnum.oDataOutput]){ 
			this.addParserResults(currentRow.row[colIndex].inputModelPath, null, parserConstants.statusEnum.ERROR);
		}
		//if ASTOutput flag is true and the validation succeeded, add the AST to the parserResults 
		if (this.flags[constants.outputFlagsEnum.ASTOutput] && this.currentParserResult.status === parserConstants.statusEnum.SUCCESS){
			converted = this.getConvertedData(converted, this.currentParserResult.model, constants.decisionTableExpressionParts.astOutput);
			this.addParserResults(currentRow.row[colIndex].inputModelPath, converted, this.currentParserResult.status);
		}
		
		return rowResult;
	};
	
	/**
	 * handles action parameter
	 * @param header
	 * @param currentRow
	 * @param colIndex
	 * @param rowResult
	 * @returns
	 */
	RuleBodyConvertor.prototype.handleDecisionTableActionParameter = function handleDecisionTableActionParameter(header, currentRow, colIndex, rowResult) {
		
		rowResult = ruleBodyValidatorLib.RuleBodyValidator.prototype.handleDecisionTableActionParameter.call(this, header, currentRow, colIndex, rowResult);
		
		if (this.status === constants.RULE_SUCCESS && this.hasParserConvertedExpression()){
			currentRow.row[colIndex].content = this.getParserConvertedExpression();
		}
		
		return rowResult;
	};
	
	/**
	 * handles output parameter
	 * @param header
	 * @param currentRow
	 * @param colIndex
	 * @param rowResult
	 * @returns
	 */
	RuleBodyConvertor.prototype.handleDecisionTableOutputParameter = function handleDecisionTableOutputParameter(header, currentRow, colIndex, rowResult) {
		var converted = {};
		var convertedExpression;

		rowResult = ruleBodyValidatorLib.RuleBodyValidator.prototype.handleDecisionTableOutputParameter.call(this, header, currentRow, colIndex, rowResult);
		
		if (this.hasParserConvertedExpression() && this.invalidHeaders[header.colID] !== true){
			convertedExpression = this.getParserConvertedExpression();

			if( this.flags[constants.outputFlagsEnum.oDataOutput]){ 
				converted = this.getConvertedData(converted, convertedExpression, constants.decisionTableExpressionParts.content);
				this.addParserResults(currentRow.row[colIndex].inputModelPath, converted, this.currentParserResult.status);
			}
			else if (this.status === constants.RULE_SUCCESS){
				currentRow.row[colIndex].content = convertedExpression;
			}
		} else if (this.flags[constants.outputFlagsEnum.oDataOutput]){ 
			this.addParserResults(currentRow.row[colIndex].inputModelPath, null, parserConstants.statusEnum.ERROR);
		}
		//if ASTOutput flag is true and the validation succeeded, add the AST to the parserResults
		if (this.flags[constants.outputFlagsEnum.ASTOutput] && this.currentParserResult.status === parserConstants.statusEnum.SUCCESS){
			converted = this.getConvertedData(converted, this.currentParserResult.model, constants.decisionTableExpressionParts.astOutput);
			this.addParserResults(currentRow.row[colIndex].inputModelPath, converted, this.currentParserResult.status);
		}
		
		
		return rowResult;
	};
	
	/**
	 * handles condition header
	 */
	RuleBodyConvertor.prototype.handleConditionHeader = function handleConditionHeader(header){
		var converted = {};
		var convertedExpression;
		
		ruleBodyValidatorLib.RuleBodyValidator.prototype.handleConditionHeader.call(this, header);
		
		if (this.hasParserConvertedExpression()){
			convertedExpression = this.getParserConvertedExpression();
			
			if (this.flags[constants.outputFlagsEnum.oDataOutput]){ 
				converted = this.getConvertedData(converted, convertedExpression, constants.decisionTableExpressionParts.expression);
				this.addParserResults(header.inputModelPath, converted, this.currentParserResult.status);
				header.convertedExpression = convertedExpression; 
			}
			else if (this.status === constants.RULE_SUCCESS){ //Native
				// Adding property for the converted expression, 
				// because it is the only case we need to keep the original header for its cell conversion
				header.convertedExpression = convertedExpression; 
			}
		}
		else if (this.flags[constants.outputFlagsEnum.oDataOutput]){ 
			this.addParserResults(header.inputModelPath, null, this.currentParserResult.status);
		}
		//if ASTOutput flag is true and the validation succeeded, add the AST to the parserResults	
		if (this.flags[constants.outputFlagsEnum.ASTOutput] && this.currentParserResult.status === parserConstants.statusEnum.SUCCESS){
			converted = this.getConvertedData(converted, this.currentParserResult.model, constants.decisionTableExpressionParts.astOutput);
			this.addParserResults(header.inputModelPath, converted, this.currentParserResult.status);
		}
	};
	
	/**
	 * finalizing DT traversal result. In this case should delete from condition headers the converted expression prop. 
	 */
	RuleBodyConvertor.prototype.finalizeResult = function finalizeResult(ruleBody) {
		var i;
		
		if (!this.flags[constants.outputFlagsEnum.oDataOutput]){
			
			for (i = 0; i < ruleBody.content.headers.length; i++){
				
				if (ruleBody.content.headers[i].hasOwnProperty(constants.parserResultEnum.convertedExpression)){
					
					//deleting the unnecessary property
					delete ruleBody.content.headers[i].convertedExpression;
				}
			}
		}
	};
	
	/**
	 * 
	 */
	RuleBodyConvertor.prototype.initFlags = function initFlags(flags) {
	
		ruleBodyValidatorLib.RuleBodyValidator.prototype.initFlags.call(this, flags);
		
		if (flags !== null && flags !== undefined) {
	
			//init conversion flag
			if (flags.hasOwnProperty(constants.outputFlagsEnum.conversionOutput)) {
				this.flags[constants.outputFlagsEnum.conversionOutput] = flags[constants.outputFlagsEnum.conversionOutput];
			} else if(flags.hasOwnProperty(constants.outputFlagsEnum.locale) && 
		            flags[constants.outputFlagsEnum.locale].hasOwnProperty(constants.localeEnum.convert) &&
		            flags[constants.outputFlagsEnum.locale][constants.localeEnum.convert]){
				this.flags[constants.outputFlagsEnum.locale] = flags[constants.outputFlagsEnum.locale];
			}
			
			//Update oData flag
			if (this.oDataRule){
				this.flags[constants.outputFlagsEnum.oDataOutput] = true;
			} else {
				this.flags[constants.outputFlagsEnum.oDataOutput] = false;
			}
			
			//Update ASToutput flags
			this.flags[constants.outputFlagsEnum.ASTOutput] = flags.hasOwnProperty(constants.outputFlagsEnum.ASTOutput) ?  flags[constants.outputFlagsEnum.ASTOutput] : false;

		}
	};
	
	/****************************************************************************************************************************************
	*		Main access point - convert method
	*****************************************************************************************************************************************/
	
	RuleBodyConvertor.prototype.convert = function convert(ruleBody, vocabulary, vocaRTServ, flags, output, pathPrefixMap, traversalParts) {
		this.convertedRuleBody = JSON.parse(JSON.stringify(ruleBody));
		
		// Validation
		var result = this.validateBusinessRule(this.convertedRuleBody, vocabulary, vocaRTServ, flags, output, pathPrefixMap, traversalParts);
		 
		// Adding converted data to result
		if (this.flags[constants.outputFlagsEnum.oDataOutput]){ // oData 
			result.decisionTableData = this.decisionTableData;
		} else{
			if (this.status === constants.RULE_SUCCESS){ // (old) ruleBody
				result.convertedRuleBody = this.convertedRuleBody;
			} else {
				result.convertedRuleBody = null;
			}
		}
		
		return result;
	};
	return {
		RuleBodyConvertor: RuleBodyConvertor
	};
}());
