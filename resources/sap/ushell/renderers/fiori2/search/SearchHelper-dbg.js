// iteration 0 ok
/* global jQuery,sap, $, window, setTimeout, clearTimeout, document */

(function() {
    "use strict";

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchHelper');
    var module = sap.ushell.renderers.fiori2.search.SearchHelper = {};

    jQuery.sap.require('jquery.sap.storage');
    jQuery.sap.require('sap.ui.core.format.NumberFormat');

    // =======================================================================
    // Regex Tester
    // =======================================================================
    module.Tester = function() {
        this.init.apply(this, arguments);
    };
    module.Tester.prototype = {

        init: function(sSearchTerms, highlightStyle) {

            // normalize searchterms in string format
            sSearchTerms = sSearchTerms || "*";

            // escape special chars
            sSearchTerms = sSearchTerms.replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1");

            // store tokenized search terms array
            this.aSearchTerms = this.tokenizeSearchTerms(sSearchTerms);
            for (var j = 0; j < this.aSearchTerms.length; ++j) {
                // * has special meaning in enterprise search context
                // (use [^\s]* and not [^\s]+ because sap* shall match sap)
                this.aSearchTerms[j] = this.aSearchTerms[j].replace(/\*/g, "[^\\s]*");
                // check if search term is Chinese (in unicode Chinese characters interval).
                var bIsChinese = this.aSearchTerms[j].match(/[\u3400-\u9faf]/) !== null ? true : false;
                if (bIsChinese) {
                    // match any place of the word, case insensitive
                    // \b \w are evil regarding unicode
                    this.aSearchTerms[j] = new RegExp(this.aSearchTerms[j], 'gi');
                } else {
                    // only match beginnings of the word, case insensitive
                    // \b \w are evil regarding unicode
                    this.aSearchTerms[j] = new RegExp('(?:^|\\s)' + this.aSearchTerms[j], 'gi');
                }
            }

            this.highlightStyle = highlightStyle;

        },

        // If the text to be searched contains all of search terms,
        // return object with match flag and highlighted text or space in case of not match
        test: function(sText2BeSearched) {
            var oReturn = {
                bMatch: false,
                sHighlightedText: ''
            };

            if (!sText2BeSearched) {
                return oReturn;
            }

            this.initializeBoldArray(sText2BeSearched);

            // global flag is there is any bold char
            this.globalBold = false;
            var oRegSearchTerm;
            var bMatch = false;
            var aMatchResult;


            for (var j = 0; j < this.aSearchTerms.length; ++j) {
                // only match beginnings of the word, case insensitive
                oRegSearchTerm = this.aSearchTerms[j];

                // check for wildcard * search -> wildcard always matches -> continue with next term
                if (oRegSearchTerm.toString() === '/(?:^|\\s)[^\\s]*/gi' ||
                    oRegSearchTerm.toString() === '/[^\\s]*/gi') {
                    continue;
                }

                bMatch = false;
                // match?
                var lastIndex = -1;
                while ((aMatchResult = oRegSearchTerm.exec(sText2BeSearched)) !== null) {
                    bMatch = true;

                    // prevent endless loop, should not happen but who knows...
                    if (oRegSearchTerm.lastIndex === lastIndex) {
                        break;
                    }
                    lastIndex = oRegSearchTerm.lastIndex;

                    //aMatchResult.index: the start position of matching term
                    //oRegSearchTerm.lastIndex: the start position of next search
                    var startIndex = this.indexOfFirstNoneWhiteSpaceChar(sText2BeSearched, aMatchResult.index);
                    if (startIndex < 0) {
                        continue;
                    }
                    this.markBoldArray(startIndex, oRegSearchTerm.lastIndex);

                }

                if (bMatch === false) {
                    return oReturn;
                }

            }

            // search terms have logical "and" relation, all of them must be available in text
            oReturn.bMatch = true;
            oReturn.sHighlightedText = this.render(sText2BeSearched);

            return oReturn;

        },

        indexOfFirstNoneWhiteSpaceChar: function(text, startIndex) {
            text = text.substring(startIndex);
            var match = /[^\s]/.exec(text);
            if (!match) {
                return -1;
            }
            return match.index + startIndex;
        },

        //tokenize search terms splitted by spaces
        tokenizeSearchTerms: function(terms) {
            var termsSeparatedBySpace = terms.split(" ");
            var newTerms = [];
            //Split search terms with space and wildcard into array
            $.each(termsSeparatedBySpace, function(i, termSpace) {
                termSpace = $.trim(termSpace);
                if (termSpace.length > 0 && termSpace !== '.*') {
                    //                var termsSeparatedByWildcard = termSpace.split("*");
                    //                $.each(termsSeparatedByWildcard, function (i, term) {
                    //                    if (term.length > 0) {
                    //                        newTerms.push(term);
                    //                    }
                    //                });
                    newTerms.push(termSpace);
                }
            });
            return newTerms;
        },

        // initialize the bold array
        initializeBoldArray: function(sText) {
            // create array which stores flag whether character is bold or not
            this.bold = new Array(sText.length);
            for (var i = 0; i < this.bold.length; ++i) {
                this.bold[i] = false;
            }
        },

        // mark bold array
        markBoldArray: function(nStartIndex, nEndIndexPlus1) {
            // mark bold characters in global array
            for (var i = nStartIndex; i < nEndIndexPlus1; i++) {
                this.bold[i] = true;
                this.globalBold = true;
            }
        },

        // render original text with <b> tag
        render: function(sOriginalText) {

            // short cut if there is nothing to do
            if (!this.globalBold) {
                return sOriginalText;
            }

            // highlight sOriginalText according to information in this.bold
            var bold = false;
            var result = [];
            var start = 0;
            var i;
            for (i = 0; i < sOriginalText.length; ++i) {
                if ((!bold && this.bold[i]) || // check for begin of bold sequence
                    (bold && !this.bold[i])) { // check for end of bold sequence
                    result.push(sOriginalText.substring(start, i));
                    if (bold) {
                        // bold section ends
                        result.push("</b>");
                    } else {
                        // bold section starts
                        if (this.highlightStyle) {
                            result.push('<b class="' + this.highlightStyle + '">');
                        } else {
                            result.push("<b>");
                        }

                    }
                    bold = !bold;
                    start = i;
                }
            }

            // add last part
            result.push(sOriginalText.substring(start, i));
            if (bold) {
                result.push("</b>");
            }
            return result.join("");
        }
    };


    // =======================================================================
    // decorator for delayed execution
    // =======================================================================
    module.delayedExecution = function(originalFunction, delay) {
        var timerId = null;
        var decorator = function() {
            var args = arguments;
            var that = this;
            if (timerId) {
                window.clearTimeout(timerId);
            }
            timerId = window.setTimeout(function() {
                timerId = null;
                originalFunction.apply(that, args);
            }, delay);
        };
        decorator.abort = function() {
            if (timerId) {
                window.clearTimeout(timerId);
            }
        };
        return decorator;
    };

    // =======================================================================
    // decorator for refusing outdated requests
    // =======================================================================
    module.refuseOutdatedRequests = function(originalFunction, requestGroupId) {
        /* eslint new-cap:0 */
        var lastRequestId = 0;
        var decorator = function() {
            var args = arguments;
            var that = this;
            var requestId = ++lastRequestId;
            var deferred = new jQuery.Deferred();
            //console.log(requestGroupId + ' start ', requestId);
            originalFunction.apply(that, args).done(function() {
                if (requestId !== lastRequestId) {
                    //console.log(requestGroupId + ' throw ', requestId, ' because max', maxRequestId);
                    return; // throw away outdated requests
                }
                //console.log(requestGroupId + ' accept ', requestId);
                deferred.resolve.apply(deferred, arguments);
            }).fail(function() {
                if (requestId !== lastRequestId) {
                    return;
                } // throw away outdated requests
                deferred.reject.apply(deferred, arguments);
            });
            return deferred;
        };
        decorator.abort = function() {
            ++lastRequestId;
            //console.log(id + ' abort', maxRequestId);
        };
        if (requestGroupId) {
            module.outdatedRequestAdministration.registerDecorator(requestGroupId, decorator);
        }
        return decorator;
    };

    // =======================================================================
    // abort all requests for a given requestGroupId
    // =======================================================================
    module.abortRequests = function(requestGroupId) {
        var decorators = module.outdatedRequestAdministration.getDecorators(requestGroupId);
        for (var i = 0; i < decorators.length; ++i) {
            var decorator = decorators[i];
            decorator.abort();
        }
    };

    // =======================================================================
    // administration of outdated request decorators
    // =======================================================================
    module.outdatedRequestAdministration = {

        decoratorMap: {},

        registerDecorator: function(requestGroupId, decorator) {
            var decorators = this.decoratorMap[requestGroupId];
            if (!decorators) {
                decorators = [];
                this.decoratorMap[requestGroupId] = decorators;
            }
            decorators.push(decorator);
        },

        getDecorators: function(requestGroupId) {
            var decorators = this.decoratorMap[requestGroupId];
            if (!decorators) {
                decorators = [];
            }
            return decorators;
        }

    };

    // =======================================================================
    // <b>, <i> tag unescaper
    // =======================================================================
    module.boldTagUnescaper = function(domref, highlightStyle) {
        var innerhtml = domref.innerHTML;

        var boldStartES = '';
        var boldStart = '';
        if (highlightStyle) {
            boldStartES = '&lt;b class="' + highlightStyle + '"&gt;';
            boldStart = '<b class="' + highlightStyle + '">';
        } else {
            boldStartES = '&lt;b&gt;';
            boldStart = '<b>';
        }

        var boldEndES = '&lt;/b&gt;';
        var boldEnd = '</b>';

        while (innerhtml.indexOf(boldStartES) + innerhtml.indexOf(boldEndES) >= -1) { // while these tags are found
            innerhtml = innerhtml.replace(boldStartES, boldStart);
            innerhtml = innerhtml.replace(boldEndES, boldEnd);
        }

        while (innerhtml.indexOf('&lt;i&gt;') + innerhtml.indexOf('&lt;/i&gt;') >= -1) { // while these tags are found
            innerhtml = innerhtml.replace('&lt;i&gt;', '<i>');
            innerhtml = innerhtml.replace('&lt;/i&gt;', '</i>');
        }
        while (innerhtml.indexOf('&lt;span&gt;') + innerhtml.indexOf('&lt;/span&gt;') >= -1) { // while these tags are found
            innerhtml = innerhtml.replace('&lt;span&gt;', '<span>');
            innerhtml = innerhtml.replace('&lt;/span&gt;', '</span>');
        }
        domref.innerHTML = innerhtml;
    };

    // =======================================================================
    // <b> tag unescaper with the help of text()
    // =======================================================================
    module.boldTagUnescaperByText = function(domref) {
        var $d = $(domref);

        // Security check, whether $d.text() contains tags other than <b> and </b>
        var s = $d.text().replace(/<b>/gi, '').replace(/<\/b>/gi, ''); /// Only those two HTML tags are allowed.

        // If not
        if (s.indexOf('<') === -1) {
            $d.html($d.text());
        }
    };

    // =======================================================================
    // emphasize whyfound in case of ellipsis
    // =======================================================================
    module.forwardEllipsis4Whyfound = function(domref) {
        var $d = $(domref);

        var posOfWhyfound = $d.html().indexOf("<b>");
        if (posOfWhyfound > 2 && domref.offsetWidth + 3 < domref.scrollWidth) {
            var emphasizeWhyfound = "..." + $d.html().substring(posOfWhyfound);
            $d.html(emphasizeWhyfound);
        }
    };

    // =======================================================================
    // get url hash
    // http://stackoverflow.com/questions/1703552/encoding-of-window-location-hash
    // =======================================================================
    module.getHashFromUrl = function() {
        return '#' + (window.location.href.split("#")[1] || "");
    };

    module.getUrlParameters = function() {
        var urlSearchPart;
        if (sap && sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("URLParsing")) {
            var oURLParsing = sap.ushell.Container.getService("URLParsing");
            var appSpecificRoute = oURLParsing.splitHash(module.getHashFromUrl()).appSpecificRoute;
            urlSearchPart = appSpecificRoute.substring(2);
        } else {
            // we are not running in a ushell
            urlSearchPart = module.getHashFromUrl();
        }
        var urlParameters = module.parseUrlParameters(urlSearchPart);
        return urlParameters;
    };

    module.parseUrlParameters = function(unescapedSearchUrl) {
        // workaround for url ushells broken url escaping if special chars
        // like [] are used in urls (like in app tiles with search filters).
        // limitation of this workaround:
        // - tiles with searchterms like the names of the parameters dont
        //   work (for example a tile with searchterm "top=")
        var oParametersLowerCased = {};
        var knownSearchUrlParameters = [{
            "name": "filter",
            "pos": -1,
            "value": ""
        }, {
            "name": "top",
            "pos": -1,
            "value": ""
        }, {
            "name": "datasource",
            "pos": -1,
            "value": ""
        }, {
            "name": "searchterm",
            "pos": -1,
            "value": ""
        }];
        // find the parameters:
        for (var i = 0; i < knownSearchUrlParameters.length; i++) {
            knownSearchUrlParameters[i].pos = unescapedSearchUrl.toLowerCase().indexOf(knownSearchUrlParameters[i].name + "=");
        }
        knownSearchUrlParameters.sort(function(a, b) {
            return a.pos - b.pos;
        });
        // find the parameter boundaries:
        for (var j = 0; j < knownSearchUrlParameters.length; j++) {
            if (knownSearchUrlParameters[j].pos !== -1) {
                if (knownSearchUrlParameters[j + 1] && knownSearchUrlParameters[j + 1].pos !== -1) {
                    knownSearchUrlParameters[j].value = unescapedSearchUrl.substring(knownSearchUrlParameters[j].pos, knownSearchUrlParameters[j + 1].pos);
                } else {
                    knownSearchUrlParameters[j].value = unescapedSearchUrl.substring(knownSearchUrlParameters[j].pos);
                }
                // remove the parameter name and "=":
                knownSearchUrlParameters[j].value = knownSearchUrlParameters[j].value.substring(knownSearchUrlParameters[j].name.length + 1);
                if (knownSearchUrlParameters[j].value.charAt(knownSearchUrlParameters[j].value.length - 1) === "&") {
                    knownSearchUrlParameters[j].value = knownSearchUrlParameters[j].value.substring(0, knownSearchUrlParameters[j].value.length - 1);
                }
                knownSearchUrlParameters[j].value = decodeURIComponent(knownSearchUrlParameters[j].value);
                oParametersLowerCased[knownSearchUrlParameters[j].name] = knownSearchUrlParameters[j].value;
            }
        }
        return oParametersLowerCased;
    };

    // =======================================================================
    // check if search app is running
    // =======================================================================
    module.isSearchAppActive = function() {
        if (module.getHashFromUrl().substr(1, 13) === 'Action-search') {
            return true;
        } else {
            return false;
        }
    };

    // =======================================================================
    // Hasher
    // using window.hasher does not work because
    // hasher always use encodeURL for the whole hash but for example we need
    // - to encode '=' in a value (of name value pair)
    // but not the '=' separating name and value
    // =======================================================================
    module.hasher = {

        hash: null,

        setHash: function(hash) {
            // compare using decodeURIComponent because encoding may slightly differ
            // (Saved tiles scramble the URL. The URL of a saved tile is different
            //  to the URL serialized by search app)
            if (decodeURIComponent(module.getHashFromUrl()) !== decodeURIComponent(hash)) {
                try {
                    window.location.hash = hash;
                } catch (error) {
                    // in IE url cannot be update if longer than 2083 chars -> show error message to the user
                    this.showUrlUpdateError(error);
                }
            }
            this.hash = hash;
        },

        reset: function() {
            this.hash = null;
        },

        hasChanged: function() {
            if (decodeURIComponent(this.hash) !== decodeURIComponent(module.getHashFromUrl())) {
                return true;
            }
            return false;
        },

        showUrlUpdateError: function(error) {

            // display error only one times
            if (this.urlError) {
                return;
            }
            this.urlError = true;

            // show message box
            jQuery.sap.require("sap.m.MessageBox");
            var message = sap.ushell.resources.i18n.getText('searchUrlErrorMessage', error.toString());
            sap.m.MessageBox.alert(message, {
                title: sap.ushell.resources.i18n.getText('searchUrlErrorTitle'),
                icon: sap.m.MessageBox.Icon.ERROR
            });
        }

    };

    // =======================================================================
    // Check which type is the result view type set
    // =======================================================================
    module.loadResultViewType = function() {
        if (jQuery.sap.storage && jQuery.sap.storage.isSupported()) {
            var resultViewType = jQuery.sap.storage.get("resultViewType");
            if (!resultViewType || resultViewType !== "searchResultTable") {
                return "searchResultList";
            } else {
                return "searchResultTable";
            }
        } else {
            return "searchResultList";
        }
    };

    // =======================================================================
    // Set result view type status in sap storage
    // =======================================================================
    module.saveResultViewType = function(resultViewType) {
        if (jQuery.sap.storage.isSupported()) {
            jQuery.sap.storage.put("resultViewType", resultViewType);
        }
    };

    // =======================================================================
    // Subscribe the given event only once
    // =======================================================================
    module.idMap = {};

    module.subscribeOnlyOnce = function(id, eventName, callBack, selfControl) {
        if (module.idMap[id]) {
            module.idMap[id].unsubscribe();
        }
        var wrapper = function() {
            callBack.apply(selfControl);
            sap.ui.getCore().getEventBus().unsubscribe(eventName, wrapper, selfControl);
        };
        sap.ui.getCore().getEventBus().subscribe(eventName, wrapper, selfControl);
        module.idMap[id] = {
            unsubscribe: function() {
                sap.ui.getCore().getEventBus().unsubscribe(eventName, wrapper, selfControl);
            }
        };
    };

    // =======================================================================
    // check if control is displayed
    // =======================================================================
    module._isDisplayed = function(control) {
        if (control && control.getDomRef && control.getDomRef()) {
            return true;
        }
        return false;
    };

    // =======================================================================
    // Focus Handler
    // =======================================================================
    module.SearchFocusHandler = function() {
        this.init.apply(this, arguments);
    };
    module.SearchFocusHandler.prototype = {

        init: function(oSearchView) {
            this.oSearchView = oSearchView;
        },

        // get the controlDomRef to be focused
        get2BeFocusedControlDomRef: function() {
            if (!this.oModel) {
                this.oModel = this.oSearchView.getModel();
            }

            var index = 0;
            var control = null;
            var controlDomRef = null;
            var isTableDisplayed = false;

            if (!this.oModel.getDataSource().equals(this.oModel.appDataSource)) {

                // 1. mixed result list

                if (this.oModel.getProperty('/boCount') > 0 && this.oModel.getProperty('/appCount') > 0) {
                    // 1.1 bos + apps
                    index = this.oModel.getProperty('/focusIndex');
                    index = (index > 0) ? index + 1 : index;
                    control = this.oSearchView.resultList.getItems()[index];
                    if (control && control.getDomRef) {
                        controlDomRef = control.getDomRef();
                    }
                } else if (this.oModel.getProperty('/boCount') > 0 && this.oModel.getProperty('/appCount') === 0) {
                    // 1.2 only bos
                    index = this.oModel.getProperty('/focusIndex');
                    isTableDisplayed = this.oModel.getResultToDisplay() === "searchResultTable";
                    if (!isTableDisplayed) {
                        // 1.2.1 list view
                        control = this.oSearchView.resultList.getItems()[index];
                    } else {
                        // 1.2.2 table view
                        control = this.oSearchView.searchResultTable.getItems()[index];
                    }
                    if (control && control.getDomRef) {
                        controlDomRef = control.getDomRef();
                    }
                } else if (this.oModel.getProperty('/boCount') === 0 && this.oModel.getProperty('/appCount') > 0) {
                    // 1.3 only apps
                    var firstItem = this.oSearchView.resultList.getItems()[0];
                    if (!module._isDisplayed(firstItem)) {
                        return null;
                    }
                    var tilesContainer = firstItem.getContent()[0];
                    if (!module._isDisplayed(tilesContainer)) {
                        return null;
                    }
                    control = tilesContainer.getTiles()[0];
                    if (!module._isDisplayed(control)) {
                        return null;
                    }
                    controlDomRef = module.getFocusableTileDomRef(control.getDomRef());
                }
            } else {

                // 2. pure apps result list (tile matrix)

                var oTilesContainer = this.oSearchView.appSearchResult;
                if (oTilesContainer.getDomRef() === null) {
                    return null;
                }
                index = this.oModel.getProperty('/focusIndex');

                control = oTilesContainer.getTiles()[index];
                if (module._isDisplayed(control)) {
                    controlDomRef = module.getFocusableTileDomRef(control.getDomRef());
                }

            }

            return controlDomRef;
        },

        // set focus
        // ===================================================================
        setFocus: function() {
            /* eslint no-lonely-if:0 */

            // this method is called
            // 1) after event allSearchFinished (see registration in Search.controller)
            // 2) after event afterNavigate (see registration in searchshellhelper)
            // 3) after event appComponentLoaded (see registration in searchshellhelper)

            var that = this;
            var retries = 10;

            // method for setting the focus with periodic retry
            var doSetFocus = function() {

                that.focusSetter = null;

                var controlDomRef = that.get2BeFocusedControlDomRef();

                // check that all conditions for setting the focus are fullfilled
                if (!controlDomRef || // condition 1
                    sap.ui.getCore().getUIDirty() || // condition 2
                    sap.ui.getCore().byId('Fiori2LoadingDialog').isOpen() || // condition 3
                    jQuery('.sapUshellSearchTileContainerDirty').length > 0 || // condition 4
                    jQuery('.sapMBusyDialog').length > 0) { // condition 5

                    /*console.log('--focus failed',
                        controlDomRef,
                        sap.ui.getCore().getUIDirty(),
                        sap.ui.getCore().byId('Fiori2LoadingDialog').isOpen(),
                        jQuery('.sapUshellSearchTileContainerDirty').length > 0,
                        jQuery('.sapMBusyDialog').length > 0);*/

                    if (--retries) {
                        that.focusSetter = setTimeout(doSetFocus, 100);
                    }
                    return;
                }

                // condition 1:
                // control and its domref do need to exist
                // condition 2:
                // no rendering process is running
                // focus can only be set after ui5 rendering is finished because ui5 preserves the focus
                // condition 3:
                // loading dialog (app loading) is closed
                // loading dialog restores old focus (using timeout 300ms) so we need to wait until loading dialog has finished
                // condition 4:
                // wait that app tile container has finished rendering
                // app tile container has two rendering steps. First step is just for calculating number of tiles.
                // condition 5:
                // wait that buys indicators are finished

                // set focus
                controlDomRef.focus();
                //console.log('--set');

                /*var meButton = document.getElementById('meAreaHeaderButton');
                if (!meButton.isDecorated) {
                    var originalFocus = meButton.focus;
                    meButton.focus = function() {
                        //console.log('--reset');
                        //   debugger;
                        originalFocus.apply(this, arguments);
                    };
                    meButton.isDecorated = true;
                }*/


                // automatic expand only the first result líst item
                if (that.oModel.getProperty('/focusIndex') === 0) {
                    var control = sap.ui.getCore().byId(controlDomRef.getAttribute('id'));
                    if (control && control.getContent && control.getContent()[0]) {
                        var resultListItem = control.getContent()[0];
                        if (resultListItem.showDetails) {
                            resultListItem.showDetails();
                        }
                    }
                }

                // Fix Result List Keyboard Navigation
                that.oSearchView.resultList.collectListItemsForNavigation();
            };

            // cancel any scheduled focusSetter
            if (this.focusSetter) {
                clearTimeout(this.focusSetter);
                this.focusSetter = null;
            }

            // set focus
            doSetFocus();

        }

    };

    // =======================================================================
    // looks into a tile and return the first focusable child element
    // =======================================================================
    module.getFocusableTileDomRef = function(tileDomRef) {
        return jQuery(tileDomRef).find('[tabindex], button')[0]; // find element which has tabindex or is a button
        //return jQuery(tileDomRef).find(".sapUshellTileBase, .sapUiCockpitReportTile, .sapUshellSearchShowMoreTileButton")[0];
    };

    // =======================================================================
    // format integer
    // =======================================================================    
    module.formatInteger = function(value) {

        // lazy create integerShortFormatter
        if (!module._integerShortFormatter) {
            module._integerShortFormatter = sap.ui.core.format.NumberFormat.getIntegerInstance({
                style: 'short',
                precision: 3,
                groupingEnabled: true
            });

        }

        // lazy create integerStandardFormatter
        if (!module._integerStandardFormatter) {
            module._integerStandardFormatter = sap.ui.core.format.NumberFormat.getIntegerInstance({
                style: 'standard',
                precision: 3,
                groupingEnabled: true
            });
        }

        // 99950 is the first number (with precision 3 rounding) that will map to 100000; same as "parseFloat((Math.abs(number)).toPrecision(3)) >= 100000"
        if (Math.abs(value) >= 99950) {
            return module._integerShortFormatter.format(value);
        } else {
            return module._integerStandardFormatter.format(value);
        }

    };

})();
