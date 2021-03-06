jQuery.sap.declare("sap.rules.ui.parser.resources.common.lib.resourcesConvertor");

/*******************************************************************************
 * Import relevant libraries
 ******************************************************************************/
jQuery.sap.require("sap.rules.ui.parser.resources.common.lib.oDataHandler");
jQuery.sap.require("sap.rules.ui.parser.infrastructure.util.utilsBase");
/*******************************************************************************
 ******************************************************************************/

/*******************************************************************************
 * Exposed object
 *******************************************************************************/
sap.rules.ui.parser.resources.common.lib.resourcesConvertor = sap.rules.ui.parser.resources.common.lib.resourcesConvertor|| {}; 
sap.rules.ui.parser.resources.common.lib.resourcesConvertor.lib = (function() {

	var oDataHandlerLib = sap.rules.ui.parser.resources.common.lib.oDataHandler.lib;
	var utilsBaseLib = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
	
	// Use help methods from oData handler
	var getOdataPropName = oDataHandlerLib.getOdataPropName;
	var getOdataPropertyValue = oDataHandlerLib.getOdataPropertyValue;
	var getEnumPropertyValue = oDataHandlerLib.getEnumPropertyValue;
	
	/*******************************************************************************
	 * Help methods
	 *******************************************************************************/

	/**
	 * This method receives an oData format column and returns a new column object in our
	 * internal model format
	 * 
	 * @param oDColumn - column object in its oData format
	 * @param fixedOperatorsMap - a map from column ids to a relevant fixed operator (if exist), to be
	 *        filled by reference here - for the given column
	 * @returns - a new internal model format column object
	 */
	function createInternalModelColumn(oDColumn, fixedOperatorsMap, headerTypesMap, jsonPathPrefix) {
		var imHeader, resultPropName, conditionPropName, fixedOperator;
		var columnId = getOdataPropertyValue(oDColumn, oDataHandlerLib.PROPERTY_NAME_ID);
		
		if (getOdataPropertyValue(oDColumn, oDataHandlerLib.PROPERTY_NAME_TYPE) === oDataHandlerLib.TYPE_CONDITION) {
			imHeader = {
				colID : columnId,
				type : "condition",
				expression : "",
				alias : ""
			};

			conditionPropName = getOdataPropName(oDColumn, oDataHandlerLib.PROPERTY_NAME_CONDITION);
			jsonPathPrefix = utilsBaseLib.buildJsonPath(jsonPathPrefix, conditionPropName);
			imHeader.inputModelPath = jsonPathPrefix;
			
			imHeader.expression = getOdataPropertyValue(oDColumn[conditionPropName], oDataHandlerLib.PROPERTY_NAME_EXPRESSION);
			
			// ********************************************
			// Workaround to support boolean header = true, till parser fix
			if (imHeader.expression === 'true') {
				imHeader.expression = '';
			}
			// ********************************************

			// Map current fixed operator value to column id
			fixedOperator = getOdataPropertyValue(oDColumn[conditionPropName], oDataHandlerLib.PROPERTY_NAME_FIXED_OPERATOR);
			
			if (fixedOperator) {
				imHeader.fixedOperator = {};
				imHeader.fixedOperator.operator = fixedOperator;
				fixedOperatorsMap[columnId] = fixedOperator + ' ';
			}
		} else if (getOdataPropertyValue(oDColumn, oDataHandlerLib.PROPERTY_NAME_TYPE) === oDataHandlerLib.TYPE_RESULT) {
			imHeader = {
				colID : columnId,
				name : "",
				type : "output",
				businessDataType : ""
			};
			
			resultPropName = getOdataPropName(oDColumn, oDataHandlerLib.PROPERTY_NAME_RESULT);
			
			imHeader.businessDataType = getOdataPropertyValue(oDColumn[resultPropName], oDataHandlerLib.PROPERTY_NAME_BUSINESS_DATA_TYPE);
			imHeader.name = getOdataPropertyValue(oDColumn[resultPropName], oDataHandlerLib.PROPERTY_NAME_DO_ATTRIBUTE_NAME);
//			var propName;
//			propName = getOdataPropName(oDColumn[resultPropName], oDataHandlerLib.PROPERTY_NAME_IS_COLLECTION);
//			if (propName) {
//				// If isCollection is given - convert it
//				imHeader.isCollection = oDColumn[resultPropName][propName];
//			}
		}
		
		//Map header type to column id
		headerTypesMap[columnId] = imHeader.type; 
		
		return imHeader;
	}

	/**
	 * This method receives an oData format row and returns a new row object in our
	 * internal model format
	 * 
	 * @param oDRow - row object in its oData format
	 * @param fixedOperatorsMap - a map from column ids to a relevant fixed operator (if exist), to concatenate the
	 *        current cell column's fixed operator, to the cell's expression 
	 * @returns - a new internal model format row object
	 */
	function createInternalModelRow(oDRow, fixedOperatorsMap, headerTypesMap, jsonPathPrefix) {
		var jsonPath, imCells, imCell, fixedOperator, headerType, cellContent, cellsPropName, isEmptyRow = true;
		var imRow = {
			rowID : 0,
			row : []
		};
		imRow.rowID = getOdataPropertyValue(oDRow, oDataHandlerLib.PROPERTY_NAME_ID);
		// Rule decision table cells
		cellsPropName = getOdataPropName(oDRow, oDataHandlerLib.PROPERTY_NAME_CELLS);
		imCells = getOdataPropertyValue(oDRow, oDataHandlerLib.PROPERTY_NAME_CELLS);
		
		if (imCells) {
			imCells.forEach(function(oODCell, index) {
				jsonPath = utilsBaseLib.buildJsonPath(jsonPathPrefix, cellsPropName, index);
				imCell = {
					colID : 0,
					content : ""
				};

				imCell.colID = getOdataPropertyValue(oODCell, oDataHandlerLib.PROPERTY_NAME_COLUMN_ID);
				fixedOperator = fixedOperatorsMap[imCell.colID] || "";
				cellContent = getOdataPropertyValue(oODCell, oDataHandlerLib.PROPERTY_NAME_CONTENT);
				headerType = headerTypesMap[imCell.colID];
				
				// Updating indicator for empty row
				if (isEmptyRow && cellContent) {
					isEmptyRow = false;
				}
				
				// Handling output empty cells with null
				imCell.inputModelPath = jsonPath;
				imCell.content = (headerType === 'output' && !cellContent)? null: fixedOperator + cellContent;
				
				// Removing condition empty cells 
				if(!(headerType === 'condition' && !cellContent)){
					imRow.row.push(imCell);
				}
			});
		}
		
		if(isEmptyRow){
			return null;
		}
		
		return imRow;
	}

	function getDataObjectNameById(oDataVocaDOarr, dataObjId){
		
		var propName = null;
		var dataObjName = null;
		
		oDataVocaDOarr.forEach(function(dataObj){
			propName = getOdataPropName(dataObj, oDataHandlerLib.PROPERTY_NAME_USAGE);
			if(propName && dataObj[propName] === oDataHandlerLib.TYPE_DO){
				propName = getOdataPropName(dataObj, oDataHandlerLib.PROPERTY_NAME_ID);
				if(propName && dataObj[propName] === dataObjId){
					dataObjName = getOdataPropertyValue(dataObj, oDataHandlerLib.PROPERTY_NAME_NAME);
				}
			}
		});
		
		return dataObjName;
	}

	function convertTheAttributeMappingsObj(oDataAttributeMappingsObj, hrfAttributeMappingsArr) {
		var newAttrMappingObj = {};

		newAttrMappingObj.source = getOdataPropertyValue(oDataAttributeMappingsObj,
				oDataHandlerLib.PROPERTY_NAME_ATTRIBUTE_MAPPINGS_SOURCE);

		newAttrMappingObj.target = getOdataPropertyValue(oDataAttributeMappingsObj,
				oDataHandlerLib.PROPERTY_NAME_ATTRIBUTE_MAPPINGS_TARGET);

		hrfAttributeMappingsArr.push(newAttrMappingObj);
	}

	function convertToDataObjectAttribute(attrObj, convertedAttributesArr) {

		var propName = null;
		var newConvertedAttrObj = {};

		newConvertedAttrObj.name = getOdataPropertyValue(attrObj, oDataHandlerLib.PROPERTY_NAME_NAME);

		newConvertedAttrObj.businessDataType = getOdataPropertyValue(attrObj,
				oDataHandlerLib.PROPERTY_NAME_BUSINESS_DATA_TYPE);

		newConvertedAttrObj.dataType = getOdataPropertyValue(attrObj, oDataHandlerLib.PROPERTY_NAME_DATA_TYPE);

		propName = getOdataPropName(attrObj, oDataHandlerLib.PROPERTY_NAME_SIZE);
		if (propName) {
			// Size isn't mandatory for all data types
			newConvertedAttrObj.size = attrObj[propName];			
		}

		propName = getOdataPropName(attrObj, oDataHandlerLib.PROPERTY_NAME_MAPPING_INFO);
		if (propName) {
			// Mapping info is optional for an attribute
			newConvertedAttrObj.dataMapping = {};
			newConvertedAttrObj.dataMapping.column = getOdataPropertyValue(attrObj[propName],
					oDataHandlerLib.PROPERTY_NAME_NAME);
		}

		// Add hard coded sourceType 
		newConvertedAttrObj.sourceType = oDataHandlerLib.SOURCE_TYPE_DATA;
		convertedAttributesArr.push(newConvertedAttrObj);
	}

	function convertToDataObjectAssociation(oDataVocaDOarr, assocObj, convertedAssociationsArr) {

		var propName = null;
		var newConvertedAssocObj = {};

		newConvertedAssocObj.name = getOdataPropertyValue(assocObj, oDataHandlerLib.PROPERTY_NAME_NAME);

		propName = getOdataPropName(assocObj, oDataHandlerLib.PROPERTY_NAME_TARGET_DATA_OBJECT_ID);
		newConvertedAssocObj.target = getDataObjectNameById(oDataVocaDOarr, assocObj[propName]);

		newConvertedAssocObj.cardinality = getEnumPropertyValue(assocObj, oDataHandlerLib.PROPERTY_NAME_CARDINALITY);

		// Convert the attributeMappings
		newConvertedAssocObj.attributeMappings = [];
		propName = getOdataPropName(assocObj, oDataHandlerLib.PROPERTY_NAME_ATTRIBUTE_MAPPINGS);
		if (propName && assocObj[propName] && Array.isArray(assocObj[propName])) {
			assocObj[propName].forEach(function(attrMappingsObj) {
				convertTheAttributeMappingsObj(attrMappingsObj, newConvertedAssocObj.attributeMappings);
			});
		}

		convertedAssociationsArr.push(newConvertedAssocObj);
	}

	function convertToOutput(attrObj, convertedOutputInputParamsArr) {
		var newConvertedInputParam = {};

		newConvertedInputParam.name = getOdataPropertyValue(attrObj, oDataHandlerLib.PROPERTY_NAME_NAME);
		newConvertedInputParam.businessDataType = getOdataPropertyValue(attrObj,
				oDataHandlerLib.PROPERTY_NAME_BUSINESS_DATA_TYPE);
		newConvertedInputParam.dataType = getOdataPropertyValue(attrObj, oDataHandlerLib.PROPERTY_NAME_DATA_TYPE);
		newConvertedInputParam.size = getOdataPropertyValue(attrObj, oDataHandlerLib.PROPERTY_NAME_SIZE);

		convertedOutputInputParamsArr.push(newConvertedInputParam);
	}

	function convertMappingInfoObj(oDataMappingInfoObj, hrfMappingInfoObj){
		var propName = null;

		hrfMappingInfoObj.name = getOdataPropertyValue(oDataMappingInfoObj, oDataHandlerLib.PROPERTY_NAME_NAME);
		hrfMappingInfoObj.type = getOdataPropertyValue(oDataMappingInfoObj, oDataHandlerLib.PROPERTY_NAME_TYPE);

		// Schema is optional
		propName = getOdataPropName(oDataMappingInfoObj, oDataHandlerLib.PROPERTY_NAME_SCHEMA);
		hrfMappingInfoObj.schema = "";
		if (oDataMappingInfoObj[propName]) {
			hrfMappingInfoObj.schema = oDataMappingInfoObj[propName];
		}

		// parameters in mapping info are optional
		propName = getOdataPropName(oDataMappingInfoObj, oDataHandlerLib.PROPERTY_NAME_PARAMETERS); 
		//hrfMappingInfoObj.parameters = "";
		if (oDataMappingInfoObj[propName]) {
			hrfMappingInfoObj.parameters = oDataMappingInfoObj[propName];
		}
	}

	function convertoDataDO(oDataVocaDOarr, oDataDO, convertedVocaJson) {

		var propName = null;
		var newHRF_Entity = {};
		// Check the type of the given oDataDO (HRF_DataObject or HRF_Output)
		propName = getOdataPropName(oDataDO, oDataHandlerLib.PROPERTY_NAME_USAGE);
		if (propName) {
			newHRF_Entity.name = getOdataPropertyValue(oDataDO, oDataHandlerLib.PROPERTY_NAME_NAME);
			if (oDataDO[propName] === oDataHandlerLib.TYPE_DO) {
				// Convert the DO attributes
				propName = getOdataPropName(oDataDO, oDataHandlerLib.PROPERTY_NAME_ATTRIBUTES);
				if (propName) {
					newHRF_Entity.attributes = [];
					var attributesArr = oDataDO[propName];
					attributesArr.forEach(function(attrObj) {
						convertToDataObjectAttribute(attrObj, newHRF_Entity.attributes);
					});
				}
				// Convert the DO associations
				propName = getOdataPropName(oDataDO, oDataHandlerLib.PROPERTY_NAME_ASSOCIATIONS);
				if (propName) {
					var associationsArr = oDataDO[propName];
					newHRF_Entity.associations = [];
					associationsArr.forEach(function(assocObj) {
						convertToDataObjectAssociation(oDataVocaDOarr, assocObj, newHRF_Entity.associations);
					});
				}
				// Convert the DO mapping info
				propName = getOdataPropName(oDataDO, oDataHandlerLib.PROPERTY_NAME_MAPPING_INFO);
				if (propName) {
					var oDataMappingInfoObj = oDataDO[propName];
					newHRF_Entity.mappingInfo = {};
					convertMappingInfoObj(oDataMappingInfoObj, newHRF_Entity.mappingInfo);
				}
				// Add the new converted HRF_DataObject to the converted vocabulary
				convertedVocaJson.dataObjects.push(newHRF_Entity);
			} else if (oDataDO[propName] === oDataHandlerLib.TYPE_RESULT) {
				newHRF_Entity.id = getOdataPropertyValue(oDataDO, oDataHandlerLib.PROPERTY_NAME_ID);

				propName = getOdataPropName(oDataDO, oDataHandlerLib.PROPERTY_NAME_ATTRIBUTES);
				// Convert the inputParams of the output
				if (propName) {
					newHRF_Entity.inputParams = [];
					var inputParamsArr = oDataDO[propName];
					inputParamsArr.forEach(function(attrObj) {
						convertToOutput(attrObj, newHRF_Entity.inputParams);
					});
				}
				// Add the new converted HRF_Output to the converted vocabulary
				convertedVocaJson.outputs.push(newHRF_Entity);
			}
		}
	}

	/*******************************************************************************
	 * Exposed methods implementation
	 *******************************************************************************/

	/**
	 * Method: convertRuleODataToInternalModel
	 *         Converts a rule in oData JSON format into HRF internal model format 
	 *         Assumption: Given rule is of decision table type
	 * 
	 * @param oDataObj - oData (in JSON format) of the rule that needs conversion
	 * 
	 * @returns - the converted rule
	 */
	var convertRuleODataToInternalModel = function(oDataObj, jsonPathPrefix) {

		var convertedJson = {
			"id" : "",
			"output" : "",
			"ruleBody" : {
				"content" : {
					"headers" : [],
					"rows" : []
				},
				"type" : "",
				"hitPolicy" : "",
				"ruleFormat" : ""
			}

		};

		// Fill flat attributes
		var dtPropName = getOdataPropName(oDataObj, oDataHandlerLib.PROPERTY_NAME_DECISION_TABLE);
		var jsonPath = utilsBaseLib.buildJsonPath(jsonPathPrefix, dtPropName);
		var fixedOperatorsMap = {};
		var headerTypesMap = {};
		convertedJson.id = getOdataPropertyValue(oDataObj, oDataHandlerLib.PROPERTY_NAME_ID);
		convertedJson.ruleBody.ruleFormat = getEnumPropertyValue(oDataObj, oDataHandlerLib.PROPERTY_NAME_RULE_FORMAT);
		convertedJson.output = getOdataPropertyValue(oDataObj, oDataHandlerLib.PROPERTY_NAME_RESULT_DO_NAME);
		convertedJson.ruleBody.type = getEnumPropertyValue(oDataObj, oDataHandlerLib.PROPERTY_NAME_TYPE);
		convertedJson.ruleBody.hitPolicy = getEnumPropertyValue(oDataObj[dtPropName],
				oDataHandlerLib.PROPERTY_NAME_HIT_POLICY);

		var dtColumns = getOdataPropertyValue(oDataObj[dtPropName], oDataHandlerLib.PROPERTY_NAME_DT_COLUMNS);
		var dtColumnsPropName = getOdataPropName(oDataObj[dtPropName], oDataHandlerLib.PROPERTY_NAME_DT_COLUMNS);
		
		var dtRows = getOdataPropertyValue(oDataObj[dtPropName], oDataHandlerLib.PROPERTY_NAME_DDT_ROWS);
		var dtRowsPropName = getOdataPropName(oDataObj[dtPropName], oDataHandlerLib.PROPERTY_NAME_DDT_ROWS);
		
		// Decision table headers (columns)
		if (dtColumns) {
			var internalModelColumn;
			dtColumns.forEach(function(oDColumn, index) {
				jsonPathPrefix = utilsBaseLib.buildJsonPath(jsonPath, dtColumnsPropName, index);
				internalModelColumn = createInternalModelColumn(oDColumn, fixedOperatorsMap, headerTypesMap, jsonPathPrefix);
				convertedJson.ruleBody.content.headers.push(internalModelColumn);
			});
		}

		// Decision table rows
		if (dtRows) {
			var internalModelRow;
			dtRows.forEach(function(oDRow, index) {
				jsonPathPrefix = utilsBaseLib.buildJsonPath(jsonPath, dtRowsPropName, index);
				internalModelRow = createInternalModelRow(oDRow, fixedOperatorsMap, headerTypesMap, jsonPathPrefix);
				if(internalModelRow){
					convertedJson.ruleBody.content.rows.push(internalModelRow);
				}
			});
		}

		return convertedJson;
	};

	/**
	 * Method: convertVocabularyODataToInternalModel
	 *         Convert a vocabulary in oData JSON format into HRF internal schema format
	 * 
	 * @param oDataObj - oData (in JSON format) of the vocabulary that needs conversion
	 * 
	 * @returns - the converted rule
	 */
	var convertVocabularyODataToInternalModel = function(oDataObj) {

		var propName = null;
		var convertedVocaJson = {
			"dataObjects" : [],
			"outputs" : []
		};

		propName = getOdataPropName(oDataObj, oDataHandlerLib.PROPERTY_NAME_DATA_OBJECTS);
		if (propName) {
			oDataObj[propName].forEach(function(oDataDO) {
				convertoDataDO(oDataObj[propName], oDataDO, convertedVocaJson);
			});
		}

		return convertedVocaJson;
	};

	/*******************************************************************************
	 * Public Area
	******************************************************************************/
	return {
		"convertRuleODataToInternalModel": convertRuleODataToInternalModel,
		"convertVocabularyODataToInternalModel": convertVocabularyODataToInternalModel
	};

}());
