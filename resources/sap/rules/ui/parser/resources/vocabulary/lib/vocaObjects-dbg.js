jQuery.sap.declare("sap.rules.ui.parser.resources.vocabulary.lib.vocaObjects");

jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.runtimeServicesUtils");
jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.constants");


//**************************************************************************************************/
//**************************************************************************************************/
sap.rules.ui.parser.resources.vocabulary.lib.vocaObjects = sap.rules.ui.parser.resources.vocabulary.lib.vocaObjects|| {}; 
sap.rules.ui.parser.resources.vocabulary.lib.vocaObjects.lib = (function() {
	
	var utils = sap.rules.ui.parser.resources.vocabulary.lib.runtimeServicesUtils.lib;
	utils = new utils.runtimeServicesUtilsLib();
	
	var vocabularyConstants = sap.rules.ui.parser.resources.vocabulary.lib.constants.lib;
	
	function VocaInfo (id, name, suffix, scope, isWritable, isPrivate, isValueListConverted, vocaPackage, vocaShortName, versionId) {
		this.id = id;
		this.name = name;
		this.suffix = suffix;
		this.isWritable = utils.getIsWritable(isWritable);
		this.objects = null;
		this.actions = null;
		this.outputs = null;
		this.aliases = null;
		this.valueLists = null;
		this.terms = null;
		this.advancedFunctions = null;
		this.scope = utils.getScope(scope, isPrivate, name);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
		this.isValueListConverted = utils.getIsValueListConverted(isValueListConverted);
		this.vocaPackage = vocaPackage;
		this.vocaShortName = vocaShortName;
		this.versionId = versionId;
	}
	
	//************************************************************************************************
	//************************************************************************************************
	function ObjectInfo (vocaId, vocaName, source, id, name, runtimeName, schema, scope, isPrivate, description, runtimeType) {
		this.vocaId = vocaId;
		this.vocaName = vocaName;
		this.source = source;
		this.id = id;
		this.name = name;
		this.runtimeName = runtimeName;
		this.schema = schema;
		this.associations = null;
		this.attributes = null;
		this.origSource = runtimeName;
		this.description = description;
		this.runtimeType = runtimeType;
		this.scope = utils.getScope(scope, isPrivate, vocaName);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
	}	
	
	//************************************************************************************************
	//************************************************************************************************
	function ActionInfo (vocaId, vocaName, id, name, libPath, libName, scope, isPrivate, isValueListConverted, description) {
		this.vocaId = vocaId;
		this.vocaName = vocaName;
		this.id = id;
		this.name = name;
		this.libPath = libPath;
		this.libName = libName;
		this.staticParams = null;
		this.requiredParams = null;
		this.description = description;
		this.scope = utils.getScope(scope, isPrivate, vocaName);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
		this.isValueListConverted = utils.getIsValueListConverted(isValueListConverted);
	}	
	
	//************************************************************************************************
	//************************************************************************************************
	function OutputInfo (vocaId, vocaName, id, name, scope, isPrivate, isValueListConverted, description) {
		this.vocaId = vocaId;
		this.vocaName = vocaName;
		this.id = id;
		this.name = name;
		this.staticParams = null;
		this.requiredParams = null;
		this.description = description;
		this.scope = utils.getScope(scope, isPrivate, vocaName);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
		this.isValueListConverted = utils.getIsValueListConverted(isValueListConverted);
	}	
	
	//************************************************************************************************
	//************************************************************************************************
	function AliasInfo (vocaId, vocaName, id, name, content, businessDT, isCollection, scope, isPrivate, type, description, externalMetadata, renderingData, isValueListConverted) {
		this.vocaId = vocaId;
		this.vocaName = vocaName;
		this.id = id;
		this.name = name;
		this.businessDT = businessDT;
		this.isCollection = utils.getFromDigitToBoolean(isCollection);
		this.content = utils.getContent(content, type);
		this.scope = utils.getScope(scope, isPrivate, vocaName);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
		this.type = utils.getAliasType(type);
		this.description = description;
		this.externalMetadata = JSON.parse(externalMetadata);
		this.renderingData = JSON.parse(renderingData);
		this.isValueListConverted = utils.getIsValueListConverted(isValueListConverted);
	}
	
	//************************************************************************************************
	//************************************************************************************************
	function ValueListInfo (vocaId, vocaName, id, name, schema, runtimeName, dataType, businessDataType, size, valueColumn, descriptionColumn, scope, isPrivate, runtimeType) {
		this.vocaId = vocaId;
		this.vocaName = vocaName;
		this.id = id;
		this.name = name;
		this.schema = schema;
		this.runtimeName = runtimeName;
		this.dataType = dataType;
		this.businessDataType = businessDataType;
		this.size = size;
		this.valueColumn = valueColumn;
		this.descriptionColumn = descriptionColumn;
		this.runtimeType = runtimeType;
		this.scope = utils.getScope(scope, isPrivate, vocaName);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
	}
	
	//************************************************************************************************
	//************************************************************************************************
	function TermInfo (vocaId, vocaName, termId, description, expression, businessDataType, isCollection, isConditionalContext, context, scope, isPrivate, isDeprecated) {
		this.vocaName = vocaName;
		this.vocaId = vocaId;
		this.termId = termId;
		this.description = description;
		this.expression = expression;
		this.businessDataType = businessDataType;
		this.context = context;
		this.scope = utils.getScope(scope, isPrivate, vocaName);
		this.isCollection = utils.getFromDigitToBoolean(isCollection);
		this.isConditionalContext = utils.getFromDigitToBoolean(isConditionalContext);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
		this.isDeprecated = utils.getIsDeprecatedFromDigit(isDeprecated);
	}	
	
	//************************************************************************************************
	//************************************************************************************************
	function TermModifierInfo (termId, modifier, id) {
		this.termId = termId;
		this.modifier = modifier;
		this.id = id;
	}	
	
	//************************************************************************************************
	//************************************************************************************************
	function AttrInfo (objId, name, objName, runtimeName, description, dataType, businessDataType, size, sourceType, objectRuntimeName, vocaName, scope, isPrivate, valueListName,id) {
		this.objId = objId;
		this.name = name;
		this.objectName = objName;
		this.runtimeName = runtimeName;
		this.description = description;
		this.dataType = dataType;
		this.businessDataType = businessDataType;
		this.size = size;
		this.sourceType = sourceType;
		this.objectRuntimeName = objectRuntimeName;
		this.origSource = runtimeName;
		this.vocaName = vocaName;
		this.scope = utils.getScope(scope, isPrivate, name);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
		this.valueListName = valueListName;
		this.id = id;
	}
	//************************************************************************************************
	//************************************************************************************************
	function AssocInfo (objId, id, name, target, cardinality, vocaName) {
		this.objId = objId;
		this.id = id;
		this.name = name;
		this.target = target;
		this.cardinality = cardinality;
		this.vocaName = vocaName;
		this.attrs = null;
	}
	
	//************************************************************************************************
	//************************************************************************************************
	function AssocAttrInfo (assocId, source, target, objId, id) {
		this.assocId = assocId;
		this.source = source;
		this.target = target;
		this.objId = objId;
		this.id = id;
	}
	

	function ParameterInfo (vocabularyID, vocaName, source, omID, omName, runtimeName, schema, parameters, rtAll, scope, isPrivate, omDescription, runtimeType) {

		/*		"associations": [{
            "targetDataObject": "player",
            "attributes": [{
                  "parameterName": "client",
                  "targetAttribute": "id",
                  "parameterType": "filter"
            }]
      }, {
            "targetDataObject": "payment",
            "attributes": [{
                  "parameterName": "client",
                  "targetAttribute": "id",
                  "parameterType": "filter"
            }]
      }]*/
		
		var i;
		if (!parameters.hasOwnProperty(vocabularyConstants.PROPERTY_NAME_OM_MAPPING_INFO_PARAMETERS_FILTERS)){
			return;
		}
	var attrObj;
	this.targetDataObject = omName;
	for (i = 0; i < parameters[vocabularyConstants.PROPERTY_NAME_OM_MAPPING_INFO_PARAMETERS_FILTERS].length; i++) {

		if (!this.attributes){
			this.attributes = [];
		}
		attrObj = {};
		attrObj.parameterName = parameters[vocabularyConstants.PROPERTY_NAME_OM_MAPPING_INFO_PARAMETERS_FILTERS][i].parameterName;
		attrObj.targetAttribute = parameters[vocabularyConstants.PROPERTY_NAME_OM_MAPPING_INFO_PARAMETERS_FILTERS][i].column;
		attrObj.parameterType = vocabularyConstants.parameterType.FILTER;
		this.attributes.push(attrObj);

	}
	
}
	

	//************************************************************************************************
	//************************************************************************************************
	function AdvancedFunctionInfo (id, name, vocaId, vocaName, scope, isPrivate) {
		this.id = id;
		this.name = name;
		this.vocaId = vocaId;
		this.vocaName = vocaName;
		this.scope = utils.getScope(scope, isPrivate, vocaName);
		this.isPrivate = utils.getIsPrivate(scope, isPrivate);
	}	
	
	//************************************************************************************************
	//************************************************************************************************
	function ActionStaticParams (actionId, name, mapping, id) {
		this.id = id;
		this.actionId = actionId;
		this.name = name;
		this.mapping = mapping;
	}
	
	//************************************************************************************************
	//************************************************************************************************
	function ActionRequiredParams (actionId, name, dataType, size, businessDataType, id) {
		this.id = id;
		this.actionId = actionId;
		this.name = name;
		this.dataType = dataType;
		this.size = size;
		this.businessDataType = businessDataType;
	}

	//************************************************************************************************
	//************************************************************************************************
	function OutputStaticParams (outputId, name, mapping, id) {
		this.id = id;
		this.outputId = outputId;
		this.name = name;
		this.mapping = mapping;
	}

	//************************************************************************************************
	//************************************************************************************************
	function OutputRequiredParams (outputId, name, dataType, size, businessDataType, isCollection, id) {
		this.id = id;
		this.outputId = outputId;
		this.name = name;
		this.dataType = dataType;
		this.size = size;
		this.businessDataType = businessDataType;
		this.isCollection = utils.getFromNullOrDigitToBoolean(isCollection);
	}	
	
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************
	//************************************************************************************************

	return {
		
		VocaInfo: VocaInfo,
		ObjectInfo :ObjectInfo,
		ActionInfo : ActionInfo,
		OutputInfo : OutputInfo,
		AliasInfo : AliasInfo,
		ValueListInfo : ValueListInfo,
		TermInfo : TermInfo,
		TermModifierInfo : TermModifierInfo,
		AttrInfo : AttrInfo,
		AssocInfo : AssocInfo,
		AssocAttrInfo : AssocAttrInfo,
		AdvancedFunctionInfo: AdvancedFunctionInfo,
		ActionStaticParams : ActionStaticParams,
		ActionRequiredParams : ActionRequiredParams,
		OutputStaticParams: OutputStaticParams,
		OutputRequiredParams : OutputRequiredParams, 
		ParameterInfo : ParameterInfo
	};	
	

}());

