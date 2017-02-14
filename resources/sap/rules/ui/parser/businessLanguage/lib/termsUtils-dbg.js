jQuery.sap.declare("sap.rules.ui.parser.businessLanguage.lib.termsUtils");



jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseUtils");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseModel");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.utils");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parserTokens");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.vocabularyUtils");
jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");


sap.rules.ui.parser.businessLanguage.lib.termsUtils = sap.rules.ui.parser.businessLanguage.lib.termsUtils|| {}; 
sap.rules.ui.parser.businessLanguage.lib.termsUtils.lib = (function() {
    var parseUtils =  sap.rules.ui.parser.businessLanguage.lib.parseUtils.lib;
    var parseUtilsLib = new parseUtils.parseUtilsLib();
    var constantsLib = sap.rules.ui.parser.businessLanguage.lib.constants.lib;
    var parseModel =  sap.rules.ui.parser.businessLanguage.lib.parseModel.lib;
    var parseModelLib = new parseModel.parseModelLib();
    var utilsLib = new sap.rules.ui.parser.businessLanguage.lib.utils.lib();
    var parserTokens = sap.rules.ui.parser.businessLanguage.lib.parserTokens.lib;
    var vocabularyUtil = sap.rules.ui.parser.businessLanguage.lib.vocabularyUtils.lib;
    var vocabularyUtilLib = new vocabularyUtil.vocabularyUtilsLib();
    
    function termsUtils() {

    }
    /**********************************************************************
     * TermInfo Class
     *********************************************************************/

    termsUtils.prototype.TermInfo = function() {
        try {

            this.init = function() {
                this.start = null; // start index 0
                this.end = null; // end index 15
                this.type = parserTokens.NAVIGATION; // number - 11
                this.key = null; // 'age    of player'
                this.term = null; // 'age of player'
                this.expression = null; // 'player.age'
                this.isCalculatedType = false;
                this.isSet = function() {
                    return this.isCalculatedType;
                };

            };


            this.init();

            this.setKey = function() {
                var modelManager = parseModelLib.getModelManger();
                this.key = modelManager.expression.substring(this.start, this.end);
                this.key = utilsLib.removeInvertedCommas(this.key);
            };

            this.calculateTermType = function() {
                var modelManager = parseModelLib.getModelManger();
                if (!modelManager.vocaRTServ) { //For isReservedWord
                    return;
                }
                
                this.term = utilsLib.removeInvertedCommas(this.term);
                this.isCalculatedType = true;
                this.setKey();
                //this.setExpression();
                
                var returneNavdObj = modelManager.getCurrentNavigationObject(this.key);
                if (returneNavdObj === null) {
                     returneNavdObj = parseUtilsLib.getNavigationObjectFromPath(this.term, this.key, modelManager);    
                }
                var type = parseUtilsLib.getNavigationObjectType(returneNavdObj);
                if (type !== null) {
                     this.type = type;
                } else {
                    if (modelManager[constantsLib.propertiesEnum.unknownTokens].hasOwnProperty(this.key)) {
                            modelManager[constantsLib.propertiesEnum.unknownTokens][this.key] ++;
                    } else {
                        modelManager[constantsLib.propertiesEnum.unknownTokens][this.key] = 1;
                    }
                }   
            };
            
        } catch (error) {
            jQuery.sap.log.error("TermnInfo failure - \n" + error);
        }
    };



    /****************************************************************
     * Set term
     ****************************************************************/
    termsUtils.prototype.setTerm = function() {
        var modelManager = parseModelLib.getModelManger();
        var terms = modelManager.terms;
        terms[terms.length - 1].calculateTermType();
        modelManager.clearCurrentTerm();
    };

    /****************************************************************
     * Create term
     ****************************************************************/
    termsUtils.prototype.createTerm = function(start, end, term) {
        var modelManager = parseModelLib.getModelManger();
        modelManager.setCurrentTerm(term);

        var termInfo = new this.TermInfo();
        termInfo.start = start;
        termInfo.end = end;
        termInfo.term = term;

        modelManager.terms.push(termInfo);
    };

    /****************************************************************
     * Update term
     ****************************************************************/
    termsUtils.prototype.updateTerm = function(end, term) {
        var modelManager = parseModelLib.getModelManger();
        modelManager.setCurrentTerm(term);
        var terms = modelManager.terms;
        terms[terms.length - 1].term = term;
        terms[terms.length - 1].end = end;
    };


    /****************************************************************
     * Get navigation object
     ****************************************************************/
    termsUtils.prototype.updateTermsTokenType = function(tokens) {

        var modelManager = parseModelLib.getModelManger();
        var terms = modelManager.terms;

        if (utilsLib.isEmptyArray(terms)) {
            return;
        }

        if (!terms[terms.length - 1].isSet()) {
            this.setTerm();
            parseUtilsLib.updateTokenType(terms[terms.length-1], modelManager);
        }

    var i,j = 0;
    for (i = 0; i < tokens.length && j < terms.length; i++) {
        if (tokens[i].start === terms[j].start) {
            tokens[i].type = terms[j].type;
            tokens[i].setText(terms[j].key);
            j++;
        }
    }


        modelManager.clearTermsArray();

    };
    
    

    /****************************************************************
     * Update term
     ****************************************************************/
    termsUtils.prototype.isTermPrefix = function(term) {
        var modelManager = parseModelLib.getModelManger();
        return vocabularyUtilLib.isTermPrefix(term, modelManager.vocaRTServ, modelManager.vocabulary);
    };
    return {termsUtilsLib:termsUtils};
}());