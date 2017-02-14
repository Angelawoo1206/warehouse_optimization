jQuery.sap.declare("sap.rules.ui.parser.resources.vocabulary.lib.termGeneration");

jQuery.sap.require("sap.rules.ui.parser.infrastructure.util.utilsBase");
jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.constants");
jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.vocaObjects");
jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory");


sap.rules.ui.parser.resources.vocabulary.lib.termGeneration = sap.rules.ui.parser.resources.vocabulary.lib.termGeneration|| {}; 
sap.rules.ui.parser.resources.vocabulary.lib.termGeneration.lib = (function() { 
	
	var infraUtilsBase = sap.rules.ui.parser.infrastructure.util.utilsBase.lib;
	var infraUtilsBaseLib = new infraUtilsBase.utilsBaseLib();
	var vocabularyConstants = sap.rules.ui.parser.resources.vocabulary.lib.constants.lib;
	var vocaObjects = sap.rules.ui.parser.resources.vocabulary.lib.vocaObjects.lib;
	
	function termGenerationLib() {
		//Constructor to enable usage of public method on the client side.
		//This mechanism was used in HRF to enable association to corresponding namespace in the client side.
	}
	
	termGenerationLib.prototype.generate = function(rtAll, dataObjectArrContent, vocaName, vocabularyId, dbConn, isPrivate, resourceID, scope, writeDependecies) {
		
		var dependencyUtilsLib = null;
		var dependecyManager = null;
		var runtimeServicesLib = null;
		var dependencyConstantsLib = null;

		var vocaRuntimeServicesFactory = sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory.lib;
		runtimeServicesLib = new vocaRuntimeServicesFactory.vocaDataProviderFactoryLib();
		
		//Avoid from importing the following libs in case this run in client side, by checking the writeDependecies flag
		if(writeDependecies){
			jQuery.sap.require("sap.rules.ui.parser.resources.dependencies.lib.constants");
			dependencyConstantsLib = sap.rules.ui.parser.resources.dependencies.lib.constants.lib;
			jQuery.sap.require("sap.rules.ui.parser.resources.dependencies.lib.dependenciesUtils");
			dependencyUtilsLib = sap.rules.ui.parser.resources.dependencies.lib.dependenciesUtils;
			jQuery.sap.require("sap.rules.ui.parser.resources.dependencies.lib.dependencyManager");
			dependecyManager = sap.rules.ui.parser.resources.dependencies.lib.dependencyManager.DependencyManager;
		}
		
		
		function getTermExpression(startObjectName, visitedAssociationsMap, attrName) {
		
			var assocInfo;
			var assocId = null;
			var termExpression = null;
			
			termExpression = startObjectName;	
			for (assocId in visitedAssociationsMap) {	
				if (visitedAssociationsMap.hasOwnProperty(assocId)) {
					assocInfo = visitedAssociationsMap[assocId];
					termExpression = termExpression + '.' + assocInfo.name;
				}
			}
			if (attrName) {
				termExpression = termExpression + '.' + attrName;
			}	
			return termExpression;
		}	
		
		function isStartWithVowel(string) {
		
			if (string.indexOf('i') === 0 || string.indexOf('I') === 0 ||
				string.indexOf('a') === 0 || string.indexOf('A') === 0 ||
				string.indexOf('e') === 0 || string.indexOf('E') === 0 ||
				string.indexOf('o') === 0 || string.indexOf('O') === 0 ||
				string.indexOf('u') === 0 || string.indexOf('U') === 0) {
				return true;
			}
			return false;
		}
		
		function endsWith(str, suffix) {
			
			return str.indexOf(suffix, str.length - suffix.length) !== -1;
		}
		
		function getTheSforPlural(string) {
		
			if (endsWith(string, 's')) {
				return 'es';
			}
			return 's';
		}
		
		function isDeprecatedPlural(string) {
			
			if ( (string.slice(-1).toLowerCase() !== string.slice(-1)) ||
					// endsWith(string, 'S') ||
				endsWith(string.toLowerCase(), 'z') ||
				(endsWith(string.toLowerCase(), 'y') && !isStartWithVowel(string.slice(-2))) || 
				endsWith(string.toLowerCase(), 'ch') || 
				endsWith(string.toLowerCase(), 'sh') ||
				endsWith(string.toLowerCase(), 'x') || 
				endsWith(string.toLowerCase(), 'f') || 
				endsWith(string.toLowerCase(), 'fe') 
				) {
				return true;
			}
			return false;
		}
		
		function pluralize(string){
			
			if (endsWith(string, 'y') && !isStartWithVowel(string.slice(-2))) {
				//country -> countries
				return string.slice(0, -1) + 'ies';
			} 
			if (endsWith(string, 'Y') && !isStartWithVowel(string.slice(-2))) {
				//country -> countries
				return string.slice(0, -1) + 'IES';
			} 
			if (endsWith(string, 's') || endsWith(string, 'z') || endsWith(string, 'ch') || endsWith(string, 'Ch') || endsWith(string, 'sh') || endsWith(string, 'Sh') || endsWith(string, 'x')) {
				//atlas   -> atlases; church  -> churches; wish -> wishes; box -> boxes
				return string + 'es';
			}
			if (endsWith(string, 'S') || endsWith(string, 'Z') || endsWith(string, 'CH') || endsWith(string, 'cH') || endsWith(string, 'SH') || endsWith(string, 'sH') || endsWith(string, 'X')) {
				//atlas   -> atlases; church  -> churches; wish -> wishes; box -> boxes
				return string + 'ES';
			}
			if (endsWith(string, 'f')) {
				//wolf -> wolves 
				return string.slice(0, -1) + 'ves';
			}
			if (endsWith(string, 'F')) {
				return string.slice(0, -1) + 'VES';
			}
			if (endsWith(string, 'fe')) {
				//life -> lives
				return string.slice(0, -2) + 'ves';
			}
			if (endsWith(string, 'FE')) {
				return string.slice(0, -2) + 'VES';
			}
			if (endsWith(string, 'Fe')) {
				//life -> lives
				return string.slice(0, -2) + 'Ves';
			}
			return (string.slice(-1).toLowerCase() === string.slice(-1)) ? string + 's' : string + 'S';
			
		}
		
		function getTermContext(startObjectName, visitedAssociationsMap) {
		
			var assocId = null;
			var assocInfo;
			var finalContext;
			var fullContext;
		
			fullContext = startObjectName;
			finalContext = fullContext;
			for (assocId in visitedAssociationsMap) {
				if (visitedAssociationsMap.hasOwnProperty(assocId)) {
					assocInfo = visitedAssociationsMap[assocId];
					fullContext = fullContext + '.' + assocInfo.name;
					//finalContext will include only one-to-many associations - for example - in 'player.country' will contain only 'player' 
					if (assocInfo.cardinality === vocabularyConstants.CARDINALITY_ONE_TO_MANY) {
						finalContext = fullContext;
					}
				}
			}
			return finalContext;
		}
		
		function calculateIsCollection(currentAssocCardinality, isSoFarCollection) {
		
			var isCollection = false;
		
			//If the route above us is already a collection then we definitely a collection
			if (isSoFarCollection) {
				isCollection = true;
			} else {
				//If cardinality is one to many then we are a collection
				if (currentAssocCardinality === vocabularyConstants.CARDINALITY_ONE_TO_MANY) {
					isCollection = true;
				} else {
					isCollection = false;
				}
			}
			return isCollection;
		}
		
		function pushTermParamArray(description, expression, modifiers, businessDataType, isCollection, isConditionalContext, context, vocabularyId, isDeprecated) {
			
			var termInfo, modifier, termsModifiersInfo;
			var termId = infraUtilsBaseLib.createUUID();
		    
			termInfo = new vocaObjects.TermInfo(
					vocabularyId,
					vocaName,
					termId,
					description,
					expression,
					businessDataType,
					isCollection ? '1' : '0',
					isConditionalContext ? '1' : '0',
					context,
					scope, 
					isPrivate ? '1' : '0',
					isDeprecated ? '1' : '0');
			
			//Add the term to the runtime cache.
			rtAll.allTerms = rtAll.allTerms ? rtAll.allTerms.concat([termInfo]) : [termInfo];
			
			for (modifier in modifiers) {
			    if (modifiers.hasOwnProperty(modifier) && modifiers[modifier] === true) {
			    	termsModifiersInfo  = new vocaObjects.TermModifierInfo(
			    			termId,
			    			modifier,
			    			infraUtilsBaseLib.createUUID());
			    	
			    	//Add the term modifier to the runtime cache.
			    	rtAll.allTermsModifiers = rtAll.allTermsModifiers ? rtAll.allTermsModifiers.concat([termsModifiersInfo]) : [termsModifiersInfo];
			    }
			}
		}
		
		function addTermParamArray(termDescriptions, expression, modifiers, businessDataType, isCollection, isConditionalContext, context, vocabularyId) {
			
			pushTermParamArray(termDescriptions.description, expression, modifiers, businessDataType, isCollection, isConditionalContext, context, vocabularyId, false);
			var i;
			for (i = 0; i < termDescriptions.deprecated.length; i++) {
				pushTermParamArray(termDescriptions.deprecated[i], expression, modifiers, businessDataType, isCollection, isConditionalContext, context, vocabularyId, true);
			}
		}
		
		//Generates a new "modifiers" object
		function createModifiersObj(isAllFlag, isNotFlag, isCurrentFlag){
			
			var modifiers = {};
			
			modifiers[vocabularyConstants.TERM_MODIFIER_ALL] = isAllFlag;
			modifiers[vocabularyConstants.TERM_MODIFIER_NOT] = isNotFlag;
			modifiers[vocabularyConstants.TERM_MODIFIER_CURRENT] = isCurrentFlag;
			return modifiers;
		}
		
		//Generates the Term for the deprecated versions (e.g. DeprecatedPlural)
		function generateDeprecatedPlural(deprecatedArr, prefix, noun, suffix, isOneToMany){
			
			//currently we have only the 'DeprecatedPlural', it will be maintained in the first item (string) of the deprecatedArr (i.e deprecatedArr[0])
			if(isOneToMany){
				deprecatedArr[0] = prefix + noun + getTheSforPlural(noun) + suffix;
			}
			else{
				deprecatedArr[0] = prefix + noun + suffix;
			}
		}
		
		//Generate the Association Chain string for Term prefix/suffix
		function generateAssociationChain(visitedAssociationsMap, createConditionalContextTerm, isAllModifier){
			
			var deprecated = [];
			var assocId = null;
			var assocInfo = null;
			var assoChainStr = '';
			var tmpAssoChainStr = '';
			var associationChain = {"description": "", "deprecated": []};
			var prefix_of_the = vocabularyConstants.TERM_OF_THE_STRING;
			var prefix_of_all = vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_ALL_STRING;
			
			for (assocId in visitedAssociationsMap) {
				if (visitedAssociationsMap.hasOwnProperty(assocId)) {
					assocInfo = visitedAssociationsMap[assocId];
					if (assocInfo.cardinality === vocabularyConstants.CARDINALITY_ONE_TO_MANY && !createConditionalContextTerm) {
						tmpAssoChainStr = assoChainStr;
						//Concatenate  'all' + <association>s + chain
						assoChainStr = prefix_of_all + pluralize(assocInfo.name) + tmpAssoChainStr; 
						if (deprecated.length > 0){		          
							generateDeprecatedPlural(deprecated, prefix_of_all, assocInfo.name, deprecated[0], true);
						} else if (isDeprecatedPlural(assocInfo.name) && !isAllModifier) {
							generateDeprecatedPlural(deprecated, prefix_of_all, assocInfo.name, tmpAssoChainStr, true);
						}
					}
					else{
						if (!isAllModifier){
							//Concatenate  'the' + <association> + chain
							assoChainStr = prefix_of_the + assocInfo.name + assoChainStr;
							if (deprecated.length > 0){		          
								generateDeprecatedPlural(deprecated, prefix_of_the, assocInfo.name, deprecated[0], false);
							}
						} else{
							//Concatenate  'the' + <association>s + chain. For ALL modifier Term.
							assoChainStr = prefix_of_the + pluralize(assocInfo.name) + assoChainStr;
						}
					}
				}
			}
			associationChain.description = assoChainStr;
			associationChain.deprecated = deprecated;
			return associationChain;
		}
		
		//Remove prefixes from associationChain string
		function removePrefixesFromAssociationChain(associationChain, numOfWordsToRemove){
			
			var i;
			var description = associationChain.description;
			var deprecatedArr = associationChain.deprecated;
		
			//The description begins with the space. For example: you need to remove 3 times from " all the countries" to get " countries".
			numOfWordsToRemove += 1; 
			for (i=0; i < numOfWordsToRemove; i++){
				if(description.indexOf(' ') > -1){
					description = description.substr(description.indexOf(' ') + 1 );
				} else {  
					//The last word need to be deleted
					description = '';
					deprecatedArr = [];
					break;
				}
				if(deprecatedArr.length && deprecatedArr[0].indexOf(' ') > -1){
					deprecatedArr[0] = deprecatedArr[0].substr(deprecatedArr[0].indexOf(' ') + 1 );
				}
			}
			associationChain.description = description;
			associationChain.deprecated = deprecatedArr;
		}
		
		//Generate base Term for DO Association.
		function generateBaseTermForAssociation(startDOName, visitedAssociationsMap, termExpression, attrInfo, termContext, isCollection, vocabularyId){
			
			var suffix = '';
			var deprecatedArr = [];
			var description = "";
			var associationChain = {};
			var termDescription = null;	
			var contextualAssociationChain = {};
			var modifiers = createModifiersObj(false, false, false);
			
			//Prepare the suffix. For example 'of a/an' + <startDOName>
			if (isStartWithVowel(startDOName)){
				suffix = vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_AN_STRING + startDOName;
			} else {
				suffix = vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_A_STRING + startDOName;
			}
			associationChain = generateAssociationChain(visitedAssociationsMap, false, false);
			//Generate Term for the DO Association.    For example: payments of a player.
			if (attrInfo === null && isCollection){
				//Remove the prefix 'of the/all' from the beginning of the associationChain
				removePrefixesFromAssociationChain(associationChain, 2);
				description = associationChain.description + suffix;
				if(associationChain.deprecated && associationChain.deprecated[0]){
					deprecatedArr[0] = associationChain.deprecated[0] + suffix;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, null, isCollection, false, termContext, vocabularyId); 
			} else if (attrInfo !== null && attrInfo.businessDataType !== vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN){
				//Generate base Term for the non-boolean Association Attribute.    For example: <attr> + of the/all <assoc> + of a player.
				description = attrInfo.name + associationChain.description + suffix;
				if(associationChain.deprecated && associationChain.deprecated[0]){
					deprecatedArr[0] = attrInfo.name + associationChain.deprecated[0] + suffix;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, isCollection, false, termContext, vocabularyId);
				//Generate also ConditionalContextTerm for the non-boolean Association Attribute.
				if (isCollection){
					//Generate contextual AssociationChain
					contextualAssociationChain = generateAssociationChain(visitedAssociationsMap, true, false);
					description = attrInfo.name + contextualAssociationChain.description + suffix;
					termDescription = {"description": description, "deprecated": []};
					addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, false, true, termContext, vocabularyId);
				}
			}  else if (attrInfo !== null && attrInfo.businessDataType === vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN){
				contextualAssociationChain = generateAssociationChain(visitedAssociationsMap, true, false);
				//Remove the prefix 'of the/all' from the beginning of the associationChain
				removePrefixesFromAssociationChain(contextualAssociationChain, 2);   
				description = contextualAssociationChain.description + suffix + vocabularyConstants.TERM_IS_STRING + attrInfo.name;
				if(contextualAssociationChain.deprecated && contextualAssociationChain.deprecated[0]){
					deprecatedArr[0] = contextualAssociationChain.deprecated[0] + suffix + vocabularyConstants.TERM_IS_STRING + attrInfo.name;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				if (isCollection){
					//Generate base Term for the boolean Association Attribute (1:n), in context.    For example: <assoc> + of a <DO> + is + <attr>.
					addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, false, true, termContext, vocabularyId);
				} else{
					//Generate base Term for the boolean Association Attribute (1:1).    or example: <assoc> + of a <DO> + is + <attr>.
					addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, false, false, termContext, vocabularyId);
				}
			}
		}
		
		//Generate Term with ALL modifier for DO Association.
		function generateTermForAllModifierForAssociation(startDOName, assocName, visitedAssociationsMap, termExpression, attrInfo, termContext, vocabularyId){
			
			var suffix = "";
			var deprecatedArr = [];
			var description = "";
			var termDescription = null;
			var modifiers = createModifiersObj(true, false, false);
			var associationChain = generateAssociationChain(visitedAssociationsMap, false, true);
			
			//Prepare the suffix. Always will end with "... of all <startDOName>s"
			suffix = vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_ALL_STRING + pluralize(startDOName);
			//Generate Term with ALL modifier for the DO Association.     For example: <attr>s of all <DO>.
			if (attrInfo === null){
				//Remove the prefix 'of the/all <last Association>' from the associationChain
				removePrefixesFromAssociationChain(associationChain, 3);
				associationChain.description = associationChain.description.length ? ' ' + associationChain.description : associationChain.description;
				description = pluralize(assocName) + associationChain.description + suffix;
				if(associationChain.deprecated && associationChain.deprecated[0]){
					deprecatedArr[0] = pluralize(assocName) + associationChain.deprecated[0] + suffix;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, null, true, false, null, vocabularyId);
			} else if(attrInfo !== null && attrInfo.businessDataType !== vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN){
				//Generate Term with ALL modifier for the non-boolean DO Association Attribute (1:1 and 1:n).    For example: <attr> + of all/the + <assoc> + of all + <DO>s.
				description = attrInfo.name + associationChain.description + suffix;
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, true, false, termContext, vocabularyId);
			}
		}
		
		//Generate Term with NOT modifier for DO Association.
		function generateTermForNotModifierForAssociation(startDOName, visitedAssociationsMap, termExpression, attrInfo, termContext, isCollection, vocabularyId){
			
			var suffix = '';
			var description = "";
			var termDescription = null;	
			var contextualAssociationChain = {};
			var modifiers = createModifiersObj(false, true, false);
			
			//Prepare the suffix. For example 'of a/an' + <startDOName>
			if (isStartWithVowel(startDOName)){
				suffix = vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_AN_STRING + startDOName;
			} else {
				suffix = vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_A_STRING + startDOName;
			}
			//Generate Term with Not modifier for the DO Association. 
			if (attrInfo !== null && attrInfo.businessDataType === vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN){
				//Generate the contextual association chain
				contextualAssociationChain = generateAssociationChain(visitedAssociationsMap, true, false);
				//Remove the prefix 'of the/all' from the beginning of the associationChain
				removePrefixesFromAssociationChain(contextualAssociationChain, 2);   
				description = contextualAssociationChain.description + suffix + vocabularyConstants.TERM_IS_NOT_STRING + attrInfo.name;
				termDescription = {"description": description, "deprecated": []};
				if (isCollection){
					//Generate base Term for the boolean Association Attribute (1:n), in context.    For example: <assoc> + of a <DO> + is + <attr>.
					addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, false, true, termContext, vocabularyId);
				} else{
					//Generate base Term for the boolean Association Attribute (1:1).    or example: <assoc> + of a <DO> + is + <attr>.
					addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, false, false, termContext, vocabularyId);
				}
			}
		}
		
		//Generate Term with CURRENT modifier for DO Association.
		function generateTermForCurrentModifierForAssociation(startDOName, assocName, visitedAssociationsMap, termExpression, attrInfo, termContext, isCollection, vocabularyId){
			var suffix = "";
			var deprecatedArr = [];
			var description = "";
			var termDescription = null;
			var modifiers = createModifiersObj(false, false, true);
			var associationChain = generateAssociationChain(visitedAssociationsMap, false, false);
			
			//Prepare the suffix. Always will end with "... of current <startDOName>"
			suffix = vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_CURRENT_STRING + startDOName;
			//Generate Term with CURRENT modifier for the DO Association.     For example: payments of current player.
			if (attrInfo === null && isCollection){
				//Remove the prefix 'of the/all <last Association>' from the associationChain.
				removePrefixesFromAssociationChain(associationChain, 3);
				associationChain.description = associationChain.description.length ? ' ' + associationChain.description : associationChain.description;
				description = pluralize(assocName) + associationChain.description + suffix;
				if((associationChain.deprecated && associationChain.deprecated[0]) || isDeprecatedPlural(assocName)){
					assocName = isDeprecatedPlural(assocName) ? assocName + getTheSforPlural(assocName) : assocName;
					deprecatedArr[0] = associationChain.deprecated && associationChain.deprecated[0] && associationChain.deprecated[0].length ? ' ' + associationChain.deprecated[0] : associationChain.description;
					deprecatedArr[0] = assocName + deprecatedArr[0] + suffix;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, null, true, true, null, vocabularyId);
			} else if (attrInfo !== null && attrInfo.businessDataType !== vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN){
				//Generate a Term with CURRENT modifier for non-boolean Association Attribute (1:1 and 1:n).    For example: <attr> + of the/all + <assoc> + of current + <DO>.
				description = attrInfo.name + associationChain.description + suffix;
				if(associationChain.deprecated && associationChain.deprecated[0]){
					deprecatedArr[0] = attrInfo.name + associationChain.deprecated[0] + suffix;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, isCollection, true, termContext, vocabularyId);
			} else if (attrInfo !== null && attrInfo.businessDataType === vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN && !isCollection){
				//Generate a Term with CURRENT modifier for boolean Association Attribute (1:1).    For example: <boolean_assoc> + of current + <DO> + is/not + <attr>.
				removePrefixesFromAssociationChain(associationChain, 2); //Remove the first 'of the' from the associationChain.
				description = associationChain.description + suffix + vocabularyConstants.TERM_IS_STRING + attrInfo.name;
				if(associationChain.deprecated && associationChain.deprecated[0]){
					deprecatedArr[0] = associationChain.deprecated[0] + suffix + vocabularyConstants.TERM_IS_STRING + attrInfo.name;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, isCollection, true, termContext, vocabularyId);
				//Generate the same Term with the NOT modifier.
				modifiers = createModifiersObj(false, true, true);
				description = associationChain.description + suffix + vocabularyConstants.TERM_IS_NOT_STRING + attrInfo.name;
				if(associationChain.deprecated && associationChain.deprecated[0]){
					deprecatedArr[0] = associationChain.deprecated[0] + suffix + vocabularyConstants.TERM_IS_NOT_STRING + attrInfo.name;
				}
				termDescription = {"description": description, "deprecated": deprecatedArr};
				addTermParamArray(termDescription, termExpression, modifiers, attrInfo.businessDataType, isCollection, true, termContext, vocabularyId);
			}
		}
		
		//Generates Terms for a DO Association Attribute.
		function generateTermsForDOAssociationAttribute(startDOName, visitedAssociationsMap, assocName, attrInfo, isCollection, vocabularyId){
			
			var termContext = '';
			var termExpression = '';
			
			//Calculate termContext if attrInfo exists For example: for 'player.country.name' => context = 'player'
			if (attrInfo !== null ){
				termContext = getTermContext(startDOName, visitedAssociationsMap);
			}
			//Generate a TermExpression for the association attribute.    For example: 'player.payment.id'.
			termExpression = getTermExpression(startDOName, visitedAssociationsMap, attrInfo.name);
			//Generate a base Term for Association Attribute 
			generateBaseTermForAssociation(startDOName, visitedAssociationsMap, termExpression, attrInfo, termContext, isCollection, vocabularyId);
			//Generate a Term with ALL modifier for Association Attribute.
			generateTermForAllModifierForAssociation(startDOName, assocName, visitedAssociationsMap, termExpression, attrInfo, termContext, vocabularyId);
			//Generate a Term with NOT modifier for DO Association Attribute.
			generateTermForNotModifierForAssociation(startDOName, visitedAssociationsMap, termExpression, attrInfo, termContext, isCollection, vocabularyId);
			//Generate a Term with CURRENT modifier for DO Association Attribute.
			generateTermForCurrentModifierForAssociation(startDOName, assocName, visitedAssociationsMap, termExpression, attrInfo, termContext, isCollection, vocabularyId);
		}
		
		//Generates Terms for a DO Association.
		function generateTermsForDOAssociation(startDOName, visitedAssociationsMap, assocInfo, vocabularyFullName, isSoFarCollection, vocabularyId, dbConn, dependenciesList) {
			var i,j;
			var attrArr;
			var attrInfo;
			var assocArr;
			var termExpression;
			var isCollection;
			var vocabularyDataProvider = runtimeServicesLib.getVocabularyDataProvider(dbConn);
		
			//Don't re-visit an association (avoid endless loop)
			if (visitedAssociationsMap.hasOwnProperty(assocInfo.id) === false) {
				//Save current association + its cardinality in the visitedAssociationsMap
				visitedAssociationsMap[assocInfo.id] = assocInfo;
				isCollection = calculateIsCollection(assocInfo.cardinality, isSoFarCollection);
				//For example: 'player.payment'
				termExpression = getTermExpression(startDOName, visitedAssociationsMap);
				//Generate Term for the DO Association.     For example: payments of a player.
				generateBaseTermForAssociation(startDOName, visitedAssociationsMap, termExpression, null, null, isCollection, vocabularyId); 
				//Generate Term with ALL modifier for the DO Association.      For example: servers of all player.
				generateTermForAllModifierForAssociation(startDOName, assocInfo.name, visitedAssociationsMap, termExpression, null, null, vocabularyId);
				//Generate Term with CURRENT modifier for the DO Association.      For example: servers of all player.
				generateTermForCurrentModifierForAssociation(startDOName, assocInfo.name, visitedAssociationsMap, termExpression, null, null, isCollection, vocabularyId);
				//Get association attributes
				attrArr = vocabularyDataProvider.getAttributes(vocabularyFullName, assocInfo.target);
				//Generate Terms for each association attribute
				for (i = 0, j = attrArr.length; i < j; i++) {
					attrInfo = attrArr[i];
					generateTermsForDOAssociationAttribute(startDOName, visitedAssociationsMap, assocInfo.name, attrInfo, isCollection, vocabularyId);
				}
				//Run recursively on all existing association of this association.
				assocArr = vocabularyDataProvider.getAssociations(vocabularyFullName, assocInfo.target);
				for (i = 0, j = assocArr.length; i < j; i++) {
					generateTermsForDOAssociation(startDOName, visitedAssociationsMap, assocArr[i], vocabularyFullName, isCollection, vocabularyId, dbConn, dependenciesList);
				}
				//Create dependency between terms to the associasion's target object attributes. So in case the base vcabulary was change, the activation of  
				//the vocabularies poited to it will be called and there terms will be regenerated
				if (writeDependecies && assocInfo.vocaName !== vocabularyFullName){
					dependenciesList[vocabularyConstants.PROPERTY_NAME_DATA_OBJECTS + '.' + assocInfo.target + '.' + vocabularyConstants.PROPERTY_NAME_OM_ATTRIBUTES] = 
					                                                                                {"category" : dependencyConstantsLib.CATEGORY_VOCA_DO_ATTRIBUTES,
					                                                                                 "DOName"   : assocInfo.target,
					                                                                                 "vocaName" : assocInfo.vocaName};
				}
				
				delete visitedAssociationsMap[assocInfo.id];
			}
		}
		
		//Generates a base Terms for a DO (without modifiers)
		function generateBaseTerm(dataObjectName, attrInfo, termExpression, vocabularyId){
			
			var attName = null;
			var attDatatype = null;
			var modifiers = null;
			var description = "";
			var deprecatedArr = [];
			var termDescription = {"description": "", "deprecated": []};  
			
			//check if there is an attribute
			if(attrInfo === null || !attrInfo.hasOwnProperty("name")){
				//Generate a basic Term for the DO.    For example: "players"
				description = pluralize(dataObjectName);
				if (isDeprecatedPlural(dataObjectName)){
					deprecatedArr.push(dataObjectName + getTheSforPlural(dataObjectName));
				}
				termDescription.description = description;
				termDescription.deprecated = deprecatedArr;
				modifiers = createModifiersObj(true, false, false);
				addTermParamArray(termDescription, termExpression, modifiers, null, true, false, null, vocabularyId);
			}
			else{
				attName = attrInfo.name;
				attDatatype = attrInfo.businessDataType;
				modifiers = createModifiersObj(false, false, false);
				//check if attribute type is boolean
				if (attDatatype === vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN) {
					//Generate a Term for the boolean attribute.    For example: Player is whale.
					description = dataObjectName + vocabularyConstants.TERM_IS_STRING + attName;
					termDescription.description = description;
					addTermParamArray(termDescription, termExpression, modifiers, attDatatype, false, false, dataObjectName, vocabularyId);
					
				} else {  //for non-boolean attributes
					//Generate a Term for the non-boolean attribute. For example:    Name of the player.
					description = attName + vocabularyConstants.TERM_OF_THE_STRING + dataObjectName; 
					termDescription.description = description;
					addTermParamArray(termDescription, termExpression, modifiers, attDatatype, false, false, dataObjectName, vocabularyId); 
				}
			}
		}
		
		//Generates a Term with ALL modifier for a DO Attribute
		function generateTermForAllModifier(startDOName, attrInfo, termExpression, vocabularyId){
			
			var attName = attrInfo.name;
			var attDatatype = attrInfo.businessDataType;
			var modifiers = createModifiersObj(true, false, false);
			var termDescription = {"description": "", "deprecated": []};
																		  
			if(attrInfo !== null || attrInfo.hasOwnProperty("name")){
				termDescription.description = attName + vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_ALL_STRING + pluralize(startDOName);
				addTermParamArray(termDescription, termExpression, modifiers, attDatatype, true, false, startDOName, vocabularyId); 
			}
		}
		
		//Generates a Term with NOT modifier for a DO Attribute
		function generateTermForNotModifier(startDOName, attrInfo, termExpression, vocabularyId){
			
			var attName = attrInfo.name;
			var attDatatype = attrInfo.businessDataType;
			var modifiers = createModifiersObj(false, true, false);
			var termDescription = {"description": "", "deprecated": []}; 
			if(attrInfo !== null || attrInfo.hasOwnProperty("name")){
				//Generate a Term with the 'not' modifier for the boolean attribute.    For example: player is not whale.
				termDescription.description = startDOName + vocabularyConstants.TERM_IS_NOT_STRING + attName;
				addTermParamArray(termDescription, termExpression, modifiers, attDatatype, false, false, startDOName, vocabularyId);
			}
		}
		
		//Generates a Term with Current modifier for a DO Attribute
		function generateTermForCurrentModifier(startDOName, attrInfo, termExpression, vocabularyId){
			var attName = null;
			var attDatatype = null;
			var modifiers = null;
			var termDescription = {"description": "", "deprecated": []};  
			
			//Generate a basic Term for the DO.    For example: "players"
			if(attrInfo !== null || attrInfo.hasOwnProperty("name")){
				attName = attrInfo.name;
				attDatatype = attrInfo.businessDataType;
				//check if attribute type is boolean
				if (attDatatype === vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN) {
					//Generate a Term with the 'current' modifier for the boolean attribute.    For example: current player is whale.    
					modifiers = createModifiersObj(false, false, true);	
					termDescription.description = vocabularyConstants.TERM_CURRENT_STRING + startDOName + vocabularyConstants.TERM_IS_STRING + attName;
					addTermParamArray(termDescription, termExpression, modifiers, attDatatype, false, true, startDOName, vocabularyId);
					
					//Generate a Term with 'current' and 'not' modifiers for the boolean attribute.    For example: Current player is not whale.
					modifiers = createModifiersObj(false, true, true);
					termDescription.description = vocabularyConstants.TERM_CURRENT_STRING + startDOName + vocabularyConstants.TERM_IS_NOT_STRING + attName;
					addTermParamArray(termDescription, termExpression, modifiers, attDatatype, false, true, startDOName, vocabularyId);
				} else {  //for non-boolean attributes
					//Generate a Term with the 'current' modifier for the non-boolean attribute.    For example: Name of current player.
					modifiers = createModifiersObj(false, false, true);
					termDescription.description = attName + vocabularyConstants.TERM_OF_STRING + vocabularyConstants.TERM_CURRENT_STRING + startDOName;
					addTermParamArray(termDescription, termExpression, modifiers, attDatatype, false, true, startDOName, vocabularyId); 
				}
			}
		}
		
		//Generates Terms for a DO Attribute.
		function generateTermsForDOAttribute(startDOName, attrInfo, termExpression, vocabularyId){
			
			//Generate a Term for the boolean attribute.    For example: Player is whale.
			generateBaseTerm(startDOName, attrInfo, termExpression, vocabularyId);
			//Generate a Term with the 'current' modifier.    For example: name of current player.   current player is whale.   current player is not whale.   
			generateTermForCurrentModifier(startDOName, attrInfo, termExpression, vocabularyId);
			//check if attribute type is boolean
			if (attrInfo.businessDataType === vocabularyConstants.BUSINESS_DATA_TYPE_BOOLEAN) {
				//Generate a Term with the 'not' modifier for the boolean attribute.    For example: player is not whale.
				generateTermForNotModifier(startDOName, attrInfo, termExpression, vocabularyId);
			} else {  //for non-boolean attributes
				//Generate a Term with the 'all' modifier for the non-boolean attribute.    For example: Name of all players.
				generateTermForAllModifier(startDOName, attrInfo, termExpression, vocabularyId);
			}  
		}
		
		//Generates Terms for a DO.
		function generateTermsForDO(dataObject, vocabularyFullName, vocabularyId, dbConn, dependenciesList){
		
			var i,j;
			var attrArr;
			var assocArr;
			var attrInfo;
			var termExpression;
			var dataObjectName = dataObject[vocabularyConstants.PROPERTY_NAME_OM_NAME];
			var vocabularyDataProvider = runtimeServicesLib.getVocabularyDataProvider(dbConn);
		
			//Generate term for the data object name (for example: "players")
			termExpression = getTermExpression(dataObjectName, {}, null);
			generateBaseTerm(dataObjectName, null, termExpression, vocabularyId);
		
			//Generate Terms for Do's attributes
			attrArr = vocabularyDataProvider.getAttributes(vocabularyFullName, dataObjectName);
			for (i = 0, j = attrArr.length; i < j; i++) {
				attrInfo = attrArr[i];
				termExpression = getTermExpression(dataObjectName, {}, attrInfo.name);
				generateTermsForDOAttribute(dataObjectName, attrInfo, termExpression, vocabularyId);
			}
		
			//Generate Terms for Do's Associations
			assocArr = vocabularyDataProvider.getAssociations(vocabularyFullName, dataObjectName);
			for (i = 0, j = assocArr.length; i < j; i++) {
				generateTermsForDOAssociation(dataObjectName, {}, assocArr[i], vocabularyFullName, false, vocabularyId, dbConn, dependenciesList);
			}
		}
		
		//Generates Vocabulary Terms.
		function generateTerms(dataObjectArrContent, vocabularyFullName, vocabularyId, dbConn, isPrivate, resourceID) {
			
			var i,j;
			var dependency;
			var dependenciesList = {};
			
			//Going over each DO and creating it's Terms
			for (i=0, j=dataObjectArrContent.length; i<j; ++i) {
				generateTermsForDO(dataObjectArrContent[i], vocabularyFullName, vocabularyId, dbConn, dependenciesList);
			}
			if(writeDependecies){
				dependency = dependencyUtilsLib.createDependenciesInVocabulary(dependencyConstantsLib.CATEGORY_VOCA_TERMS, vocabularyFullName, dependenciesList, isPrivate, dbConn);
			    if (Object.keys(dependenciesList).length !== 0) {
					dependecyManager.getInstance(dbConn).setDependencies(resourceID, dependency);
				}
			}
		}
		
		generateTerms(dataObjectArrContent, vocaName, vocabularyId, dbConn, isPrivate, resourceID);
		
	};

	
	
	return {
		termGenerationLib: termGenerationLib
	}; 
	
	
}());