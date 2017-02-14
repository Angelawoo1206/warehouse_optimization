jQuery.sap.declare("sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");jQuery.sap.require("sap.rules.ui.parser.resources.dependencies.lib.constantsBase");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseModel");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseUtils");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.parameterRuntimeServices");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.IDPLexer");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.IDPParser");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.autoCompleteUtils");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parserTokens");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.antlr3_all_min");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.conversionUtils");sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator=sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator||{};sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator.lib=(function(){var p=sap.rules.ui.parser.businessLanguage.lib.parseUtils.lib;var a=new p.parseUtilsLib();var c=sap.rules.ui.parser.businessLanguage.lib.constants.lib;var d=sap.rules.ui.parser.resources.dependencies.lib.constantsBase.lib;var b=sap.rules.ui.parser.businessLanguage.lib.parseModel.lib;var e=new b.parseModelLib();var f=sap.rules.ui.parser.resources.vocabulary.lib.parameterRuntimeServices;var g=sap.rules.ui.parser.businessLanguage.lib.autoCompleteUtils.lib;var h=new g.autoCompleteUtilsLib();var v=sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory.lib;var r=new v.vocaDataProviderFactoryLib();var I=sap.rules.ui.parser.businessLanguage.lib.IDPLexer.lib;var i=sap.rules.ui.parser.businessLanguage.lib.IDPParser.lib;var j=sap.rules.ui.parser.businessLanguage.lib.conversionUtils.lib;var k=new j.conversionUtilsLib();var o=sap.rules.ui.parser.businessLanguage.lib.antlr3_all_min.lib;var l=sap.rules.ui.parser.businessLanguage.lib.parserTokens.lib;function m(){}m.prototype.getRELType=function getRELType(n,q){var t;t=(n===undefined||n===null)?c.TYPE_ALL:n;if(q!==null&&q!==undefined&&q[c.propertiesEnum.isCollection]===true){t=a.getCollectionRelTypeFromBusinessDT(t);}return t;};m.prototype.parseExpression=function(q,s,t,u,w,x,y){function z(D,y){var A="";var B=y&&y.hasOwnProperty(c.propertiesEnum.locale);var O=y&&y.hasOwnProperty(c.propertiesEnum.locale)&&y[c.propertiesEnum.locale].hasOwnProperty(c.propertiesEnum.convert)&&y[c.propertiesEnum.locale][c.propertiesEnum.convert].hasOwnProperty(c.propertiesEnum.source)&&y[c.propertiesEnum.locale][c.propertiesEnum.convert].hasOwnProperty(c.propertiesEnum.target)&&(y[c.propertiesEnum.locale][c.propertiesEnum.convert][c.propertiesEnum.source]===c.CODE_TEXT)&&(y[c.propertiesEnum.locale][c.propertiesEnum.convert][c.propertiesEnum.target]===c.DISPLAY_TEXT);if(!B||O){var P=false;var Q=false;var R="";var S='';if(typeof D!=='string'){A=D;}else{for(S in D){if(D.hasOwnProperty(S)){if(!D[S]){continue;}Q=false;switch(D[S]){case"'":P=!P;break;case",":if(P===false){Q=true;}break;}if(Q===true){R+=';';}else{R+=D[S];}}}A=R;}}else{A=D;}return A;}try{jQuery.sap.log.debug("ParsingBackendMediator expression to parse: "+q);var C=e.createModelManger();C.vocaRTServ=t;C.vocabulary=x;C.mode=s;C.paramServ=u;C.flags=(y===undefined||y===null)?{}:y;w=this.getRELType(w,y);q=z(q,y);var D=q;if(q!==null&&(q!==undefined)){q=q.toString();q=q.replace(/(\r\n|\n|\r)/gm," ");q=q.replace(/\\/g,"\\\\");}if(q===null||q===undefined||a.isBlank(q)){var E={};E.status=c.statusEnum.SUCCESS;if(s===c.TOKEN_TYPES||(C.flags.hasOwnProperty(c.propertiesEnum.tokens)&&C.flags[c.propertiesEnum.tokens]===true)){E.tokens=[];if(q!==null&&q!==undefined){var n=D.length;var F=new a.TokenInfo(D,c.tokenTypesEnum.whitespace,null,0,n);E.tokens.push(F);}}if(s===c.VALIDATE_MODE||s===c.PARSE_MODE){E.errorDetails=null;E.model=null;E.cursorPosition=null;E.actualReturnType=c.TYPE_ALL;if((C.flags.hasOwnProperty(c.propertiesEnum.conversionOutput)&&((C.flags[c.propertiesEnum.conversionOutput]===c.conversionOutputEnum.toKeys)||(C.flags[c.propertiesEnum.conversionOutput]===c.conversionOutputEnum.toDescriptions)))||(y&&y.hasOwnProperty(c.propertiesEnum.locale)&&y[c.propertiesEnum.locale].hasOwnProperty(c.propertiesEnum.convert))){E.convertedExpression=D;}return E;}else if(s===c.TOKEN_TYPES){return E;}}C.expression=q;var G=new o.antlr.runtime.ANTLRStringStream(q);var H=new I(G);H.displayRecognitionError=function(A,B){var O=H.getErrorHeader(B);var P=H.getErrorMessage(B,A);a.handleWarning(O+" "+P);};var J=new o.antlr.runtime.CommonTokenStream(H);var K=new i(J);K.mode=s;K.displayRecognitionError=function(A,B){var O=K.getErrorHeader(B);var P=K.getErrorMessage(B,A);a.handleWarning(O+" "+P);};var L={};var M={};switch(s){case c.AUTOCOMPLETE_MODE:case c.AUTOCOMPLETE_MODE_LOWERCASE:jQuery.sap.log.debug("mode autocomplete");L.suggs=JSON.parse(h.getNextSuggestions(q,H,K,t,w));if(C.flags.hasOwnProperty(c.propertiesEnum.tokens)&&C.flags[c.propertiesEnum.tokens]===true){L.tokens=a.buildTokenTypes(K,D,C);}jQuery.sap.log.debug("ParsingBackendMediator: autocomplete responseObject: "+L);return L;case c.PARSE_MODE:case c.VALIDATE_MODE:jQuery.sap.log.debug("mode validate");a.parseWithValidation(H,K,w,e.getModelManger());L=e.getModelManger().parseResult.getParseResults();if(C.flags.hasOwnProperty(c.propertiesEnum.tokens)&&C.flags[c.propertiesEnum.tokens]===true){L.tokens=a.buildTokenTypes(K,D,C);}if(k.needsConversion(C)){M=L.tokens||a.buildTokenTypes(K,D,C);L.convertedExpression=k.convert(t,x,C,M,D);}if(C.flags.hasOwnProperty(c.propertiesEnum.rootObjectContext)&&C.flags[c.propertiesEnum.rootObjectContext]===true){L.rootObjectContext=null;if(L.status===c.statusEnum.SUCCESS){L.rootObjectContext={};L.rootObjectContext.name=C[c.propertiesEnum.rootObjectContext].name;L.rootObjectContext.associations=C[c.propertiesEnum.rootObjectContext].assocs;}}return L;case c.TOKEN_TYPES:jQuery.sap.log.debug("mode token types");a.parseWithValidation(H,K,w,e.getModelManger());L.tokens=a.buildTokenTypes(K,D,C);L.status=c.statusEnum.SUCCESS;return L;default:a.handleError("Unknown mode",null,e.getModelManger());L=e.getModelManger().parseResult.getParseResults();return L;}}catch(N){e.getModelManger().parseResult.status=c.statusEnum.ERROR;jQuery.sap.log.error("ParsingBackendMediator error: "+N);return e.getModelManger().parseResult.getParseResults();}};m.prototype.convertExpressionToKeys=function(n,q,s,t,u,w){var x={};if(w){x=w;}x[c.propertiesEnum.conversionOutput]=c.conversionOutputEnum.toKeys;return this.parseExpression(n,c.VALIDATE_MODE,q,s,t,u,x);};m.prototype.convertExpressionToDescriptions=function(n,q,s,t,u,w){var x={};if(w){x=w;}x[c.propertiesEnum.conversionOutput]=c.conversionOutputEnum.toDescriptions;return this.parseExpression(n,c.VALIDATE_MODE,q,s,t,u,x);};m.prototype.parseInputRT=function(n,q,s,t,u,w,x){var y=null;if(t){y=new f.ParameterRuntimeServices(t,s,w);}return this.parseExpression(n,q,s,y,u,w,x);};m.prototype.parseInput=function(n,q,s,t,u,w,x){var y=null;y=r.getVocabularyDataProvider();return this.parseInputRT(n,q,y,t,u,w,x);};m.prototype.isReservedWord=function(s){var n=e.getModelManger();n.clearModelData();n.parseResult.clear();s=s.split(' ')[0];var q=new o.antlr.runtime.ANTLRStringStream(s);var t=new I(q);var u=new o.antlr.runtime.CommonTokenStream(t);var w=new i(u);var x=true;w.reportError=function(A){if((w.input.tokens.length>0)&&(w.input.tokens[0].type===l.NAVIGATION||w.input.tokens[0].type===l.TYPEATTRIBUTE||w.input.tokens[0].type===l.INT||w.input.tokens[0].type===l.STRING||w.input.tokens[0].type===l.ANYCHAR||w.input.tokens[0].type===undefined||w.input.tokens[0].type===null)){x=false;}};t.reportError=function(A){if((w.input.tokens.length>0)&&(w.input.tokens[0].type===l.NAVIGATION||w.input.tokens[0].type===l.TYPEATTRIBUTE||w.input.tokens[0].type===l.INT||w.input.tokens[0].type===l.STRING||w.input.tokens[0].type===undefined||w.input.tokens[0].type===null)){x=false;}};w.dummyRule();return x;};m.prototype.validateAndGetExpressionActualReturnTypeRT=function(n,q,s,t,u,w){var x={type:null,dataObject:null,businessDataType:null,unknownTokens:{},isCollection:false,errorDetails:null,isValid:false,dependenciesOutput:{}};if(t===undefined){t=null;}var y;if(w){y=w;}else{y={};y[c.propertiesEnum.unknownTokens]=true;y[d.PROPERTY_NAME_DEPENDENCIES_OUTPUT]=true;}if(u!==undefined&&u===false){y[c.propertiesEnum.raiseError]=false;}var z=this.parseExpression(q,c.VALIDATE_MODE,n,t,c.TYPE_ALL,s,y);if(z.actualReturnType){jQuery.sap.log.debug(z.actualReturnType);}if(z.status===c.statusEnum.ERROR){x.errorDetails=z.errorDetails;x.unknownTokens=z[c.propertiesEnum.unknownTokens];return x;}x.type=z.actualReturnType;x.dataObject=(z.hasOwnProperty(c.attributesNamesEnum.dataObject)?z.dataObject:null);x.isValid=true;var A=a.getBusinessDTFromRelType(x.type);x.isCollection=A[c.propertiesEnum.isCollection];x.businessDataType=A[c.propertiesEnum.businessType];x.dependenciesOutput=(z.hasOwnProperty(d.PROPERTY_NAME_DEPENDENCIES_OUTPUT)?z.dependenciesOutput:{});if(z.hasOwnProperty(c.propertiesEnum.convertedExpression)){x.convertedExpression=z.convertedExpression;}return x;};m.prototype.validateAndGetExpressionActualReturnType=function(n,q,s,t,u,w){var x=null;var y=null;x=r.getVocabularyDataProvider();if(n){if(t){y=new f.ParameterRuntimeServices(t,x,s);}}return this.validateAndGetExpressionActualReturnTypeRT(x,q,s,y,u,w);};m.prototype.validateExpression=function(n,q,s,t,u,w){var x=this.parseInput(q,t,n,w,u,s);var y={status:x.status,errorDetails:x.errorDetails};return y;};m.prototype.validateAndGetExpressionModel=function(n,q,s,t,u,w){var x=this.parseInput(q,t,n,w,u,s);return x.model;};m.prototype.getRELDependencies=function(n,q,s,t){var u={};u[d.PROPERTY_NAME_DEPENDENCIES_OUTPUT]=true;var w=this.parseInput(q,c.VALIDATE_MODE,n,t,c.TYPE_ALL,s,u);return w[d.PROPERTY_NAME_DEPENDENCIES_OUTPUT];};m.prototype.handleParse=function(n){if(!n.hasOwnProperty("expression")){return e.getModelManger().parseResult.getParseResults();}if(!n.hasOwnProperty("vocabulary")){n.vocabulary=null;}if(!n.hasOwnProperty("mode")){n.mode=c.VALIDATE_MODE;}if(!n.hasOwnProperty("returnType")){n.returnType=c.TYPE_ALL;}if(!n.hasOwnProperty("parameters")){n.parameters=null;}if(!n.hasOwnProperty(c.propertiesEnum.flags)){n.flags={};}return this.parseInput(n.expression,n.mode,n.connection,n.parameters,n.returnType,n.vocabulary,n.flags);};return{parsingBackendMediatorLib:m};}());
