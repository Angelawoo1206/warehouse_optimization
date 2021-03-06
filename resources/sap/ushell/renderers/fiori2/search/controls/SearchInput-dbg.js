/* global $, jQuery, sap, window */
(function() {
    "use strict";

    jQuery.sap.require('sap.m.Input');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    var searchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchConfiguration');
    //    sap.ushell.Container.getService("Search").getSina(); //ensure that sina is loaded
    var config = sap.ushell.renderers.fiori2.search.SearchConfiguration.getInstance();
    config.getSina();
    var sinaBaseModule = window.sinabase;

    sap.m.Input.extend('sap.ushell.renderers.fiori2.search.controls.SearchInput', {

        constructor: function(sId, oOptions) {
            var that = this;
            oOptions = jQuery.extend({}, {
                width: '100%',
                showValueStateMessage: false,
                showTableSuggestionValueHelp: false,
                showSuggestion: true,
                filterSuggests: false,
                suggestionColumns: [new sap.m.Column({})],
                placeholder: {
                    path: '/searchTermPlaceholder',
                    mode: sap.ui.model.BindingMode.OneWay
                },
                liveChange: this.handleLiveChange.bind(this),
                suggestionItemSelected: this.handleSuggestionItemSelected.bind(this)
            }, oOptions);

            // ugly hack disable fullscreen input on phone - start
            var phone = sap.ui.Device.system.phone;
            sap.ui.Device.system.phone = false;
            sap.m.Input.prototype.constructor.apply(this, [sId, oOptions]);
            sap.ui.Device.system.phone = phone;
            // ugly hack - end

            this.bindAggregation("suggestionRows", "/suggestions", function(sId, oContext) {
                return that.suggestionItemFactory(sId, oContext);
            });

            //this.attachLiveChange(this.handleLiveChange.bind(this))
            this.addStyleClass('searchInput');

            //disable fullscreen input on phone
            this._bUseDialog = false;
            this._bFullScreen = false;

            this._ariaDescriptionIdNoResults = sId + "-No-Results-Description";
        },

        renderer: 'sap.m.InputRenderer',

        onsapenter: function(event) {
            if (!(this._oSuggestionPopup && this._oSuggestionPopup.isOpen() && this._iPopupListSelectedIndex >= 0)) {
                // check that enter happened in search input box and not on a suggestion item
                // enter on a suggestion is not handled in onsapenter but in handleSuggestionItemSelected
                this.getModel().invalidateQuery();
                this.triggerSearch(event);
            }
            sap.m.Input.prototype.onsapenter.apply(this, arguments);
        },

        triggerSearch: function(oEvent) {
            var that = this;
            searchHelper.subscribeOnlyOnce('triggerSearch', 'allSearchFinished', function() {
                that.getModel().autoStartApp();
            }, that);
            var searchBoxTerm = that.getValue();
            if (searchBoxTerm.trim() === '') {
                searchBoxTerm = '*';
            }
            that.getModel().setSearchBoxTerm(searchBoxTerm, false);
            that.navigateToSearchApp();
            that.destroySuggestionRows();
            that.getModel().abortSuggestions();
        },

        handleLiveChange: function(oEvent) {
            var suggestTerm = this.getValue();
            var oModel = this.getModel();
            oModel.setSearchBoxTerm(suggestTerm, false);
            if (oModel.getSearchBoxTerm().length > 0) {
                oModel.doSuggestion();
            } else {
                this.destroySuggestionRows();
                oModel.abortSuggestions();
            }
        },

        handleSuggestionItemSelected: function(oEvent) {
            var oModel = this.getModel();
            var searchBoxTerm = oModel.getSearchBoxTerm();
            var suggestion = oEvent.getParameter('selectedRow').getBindingContext().getObject();
            var searchTerm = suggestion.labelRaw;
            var dataSource = suggestion.dataSource;
            var targetURL = suggestion.url;
            var type = suggestion.type;

            switch (type) {
                case sinaBaseModule.SuggestionType.APPS:
                    // app suggestions -> start app
                    oModel.analytics.logCustomEvent('FLP: Search', 'Suggestion Select App', [suggestion.title, targetURL, searchBoxTerm]);
                    oModel.analytics.logCustomEvent('FLP: Application Launch point', 'Search Suggestions', [suggestion.title, targetURL, searchBoxTerm]);
                    if (targetURL[0] === '#') {
                        if (window.hasher) {
                            window.hasher.setHash(targetURL);
                        } else {
                            window.location.href = targetURL;
                        }
                    } else {
                        window.open(targetURL, '_blank');
                        oModel.setSearchBoxTerm('', false);
                        this.setValue('');
                        this.focus();
                    }
                    break;
                case sinaBaseModule.SuggestionType.DATASOURCE:
                    // data source suggestions
                    // -> change datasource in dropdown
                    // -> do not start search
                    oModel.analytics.logCustomEvent('FLP: Search', 'Suggestion Select Datasource', [dataSource.key, searchBoxTerm]);
                    oModel.setDataSource(dataSource, false);
                    oModel.setSearchBoxTerm('', false);
                    this.setValue('');
                    this.focus();
                    break;
                case sinaBaseModule.SuggestionType.OBJECTDATA:
                    // object data suggestion
                    // -> change search term + change datasource + start search
                    oModel.analytics.logCustomEvent('FLP: Search', 'Suggestion Select Object Data', [searchTerm, dataSource.key, searchBoxTerm]);
                    oModel.setDataSource(dataSource, false);
                    oModel.setSearchBoxTerm(searchTerm, false);
                    this.navigateToSearchApp();
                    this.setValue(searchTerm);
                    break;
                case sinaBaseModule.SuggestionType.HISTORY:
                    // history
                    // -> change search term + change datasource + start search
                    oModel.analytics.logCustomEvent('FLP: Search', 'Suggestion Select History', [searchTerm, dataSource.key, searchBoxTerm]);
                    oModel.setDataSource(dataSource, false);
                    oModel.setSearchBoxTerm(searchTerm, false);
                    this.navigateToSearchApp();
                    this.setValue(searchTerm);
                    break;
                default:
                    break;
            }
        },

        suggestionItemFactory: function(sId, oContext) {

            // static prefix app only for app suggestions
            var that = this;
            var app = new sap.m.Label({
                text: {
                    path: "icon",
                    formatter: function(sValue) {
                        if (sValue) {
                            return "<i>" + sap.ushell.resources.i18n.getText("label_app") + "</i>";
                        }
                        return "";
                    }
                }
            }).addStyleClass('suggestText').addStyleClass('suggestNavItem').addStyleClass('suggestListItemCell');
            app.addEventDelegate({
                onAfterRendering: function() {
                    searchHelper.boldTagUnescaper(this.getDomRef());
                }
            }, app);

            // suggestion icon (only filled for app suggestions)
            var icon = new sap.ui.core.Icon({
                src: "{icon}"
            }).addStyleClass('suggestIcon').addStyleClass('sapUshellSearchSuggestAppIcon').addStyleClass('suggestListItemCell');

            // create label with suggestions term
            var label = new sap.m.Label({
                text: "{label}"
            }).addStyleClass('suggestText').addStyleClass('suggestNavItem').addStyleClass('suggestListItemCell');
            label.addEventDelegate({
                onAfterRendering: function() {
                    searchHelper.boldTagUnescaper(this.getDomRef());
                }
            }, label);

            // combine app, icon and label into cell
            var cell = new sap.m.CustomListItem({
                type: sap.m.ListType.Active,
                content: [app, icon, label]
            });
            var suggestion = oContext.oModel.getProperty(oContext.sPath);
            cell.getText = function() {
                return (typeof suggestion.labelRaw) === 'string' ? suggestion.labelRaw : that.getValue();
            };
            var listItem = new sap.m.ColumnListItem({
                cells: [cell],
                type: "Active"
            });
            if (suggestion.title && suggestion.title.indexOf("combinedAppSuggestion") !== -1) {
                listItem.addStyleClass('searchBOSuggestion');
            } else if (suggestion.type === sinaBaseModule.SuggestionType.APPS) {
                listItem.addStyleClass('searchAppSuggestion');
            }
            if (suggestion.type === sinaBaseModule.SuggestionType.DATASOURCE) {
                listItem.addStyleClass('searchDataSourceSuggestion');
            }
            if (suggestion.type === sinaBaseModule.SuggestionType.OBJECTDATA) {
                listItem.addStyleClass('searchBOSuggestion');
            }
            if (suggestion.type === sinaBaseModule.SuggestionType.HISTORY) {
                listItem.addStyleClass('searchHistorySuggestion');
            }
            listItem.addStyleClass('searchSuggestion');
            listItem.addEventDelegate({
                onAfterRendering: function(e) {
                    var cells = listItem.$().find('.suggestListItemCell');
                    var totalWidth = 0;
                    cells.each(function(index) {
                        totalWidth += $(this).outerWidth(true);
                    });
                    if (totalWidth > listItem.$().find('li').get(0).scrollWidth) { // is truncated
                        listItem.setTooltip($(cells[0]).text() + " " + $(cells[2]).text());
                    }
                }
            });
            return listItem;
        },

        navigateToSearchApp: function() {

            if (searchHelper.isSearchAppActive()) {
                // app running -> just fire query
                this.getModel()._firePerspectiveQuery();
            } else {
                // app not running -> start via hash
                // change hash:
                // -do not use Searchhelper.hasher here
                // -this is starting the search app from outside
                var sHash = this.getModel().createSearchURL();
                window.location.hash = sHash;
            }

        },

        getAriaDescriptionIdForNoResults: function() {
            return this._ariaDescriptionIdNoResults;
        },

        onAfterRendering: function(oEvent) {
            var $input = $(this.getDomRef()).find("#searchFieldInShell-input-inner");
            $(this.getDomRef()).find('input').attr('autocomplete', 'off');
            $(this.getDomRef()).find('input').attr('autocorrect', 'off');
            // additional hacks to show the "search" button on ios keyboards:
            $(this.getDomRef()).find('input').attr('type', 'search');
            $(this.getDomRef()).find('input').attr('name', 'search');
            var $form = jQuery('<form action="" onsubmit="return false;"></form>');
            $(this.getDomRef()).children('input').parent().append($form);
            $(this.getDomRef()).children('input').detach().appendTo($form);
            // end of iOS hacks
            $input.attr("aria-describedby", $input.attr("aria-describedby") + " " + this._ariaDescriptionIdNoResults);
        },

        onValueRevertedByEscape: function(sValue) {
            // this method is called if ESC was pressed and
            // the value in it was not empty
            if (searchHelper.isSearchAppActive()) {
                // dont delete the value if search app is active
                return;
            }
            this.setValue(" "); // add space as a marker for following ESC handler
        }


    });

})();
