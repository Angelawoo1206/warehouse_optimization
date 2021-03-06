/* global jQuery,sap */
// iteration 0 ok

(function() {
    "use strict";

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchResultListFormatter');
    var module = sap.ushell.renderers.fiori2.search.SearchResultListFormatter = function() {
        this.init.apply(this, arguments);
    };

    module.prototype = {
        init: function() {

        },

        format: function(searchResultSet, terms) {

            return this._doFormat(searchResultSet.getElements(), terms);
        },

        _getImageUrl: function(result) {

            var imageAttr = {
                imageUrl: '',
                name: ''
            };

            // loop at all properties
            for (var prop in result) {

                var attribute = result[prop];

                // check for image
                var isImage = false;
                try {
                    if (attribute.value &&
                        (attribute.$$MetaData$$.presentationUsage.indexOf('Image') >= 0 ||
                            attribute.$$MetaData$$.presentationUsage.indexOf('Thumbnail') >= 0)) {
                        isImage = true;
                    }
                } catch (e) {
                    /* eslint no-empty:0 */
                }
                if (!isImage) {
                    continue;
                }

                // image found -> set return value + return
                imageAttr.imageUrl = attribute.value;
                imageAttr.name = prop;
                return imageAttr;

            }
            return imageAttr;
        },

        _moveWhyFound2ResponseAttr: function(whyfounds, property) {
            var l = whyfounds.length;
            while (l--) {
                if (whyfounds[l].labelRaw === property.labelRaw && property !== undefined) {
                    property.value = whyfounds[l].value;
                    property.whyfound = true;
                    whyfounds.splice(l, 1);
                }
            }
        },

        _appendRemainingWhyfounds2FormattedResultItem: function(whyfounds, aItemAttributes) {
            var l = whyfounds.length;
            while (l--) {
                if (whyfounds[l].labelRaw !== undefined) {
                    var oItemAttribute = {};
                    oItemAttribute.name = whyfounds[l].label;
                    oItemAttribute.value = whyfounds[l].value;
                    oItemAttribute.whyfound = true;
                    aItemAttributes.push(oItemAttribute);
                    whyfounds.splice(l, 1);
                }
            }
        },

        _doFormat: function(results, terms) {
            //sort against displayOrder
            var sortDisplayOrder = function(a, b) {
                return a.displayOrder - b.displayOrder;
            };
            var client, connectorName, thumbnailLink, titleLink, suvlink;
            var formattedResults = [];
            for (var i = 0; i < results.length; i++) {
                var result = results[i];

                //fileloader
                if (result.$$DataSourceMetaData$$.semanticObjectType === 'fileprocessorurl') {
                    client = result.$$DataSourceMetaData$$.client;
                    connectorName = 'UIA000~EPM_FILE_PROC_U_DEMO~';
                    if (result.$$DataSourceMetaData$$.objectName && result.$$DataSourceMetaData$$.objectName.value) {
                        connectorName = result.$$DataSourceMetaData$$.objectName.value;
                    }
                    thumbnailLink = '/sap/es/fl_get_files?sap-client=' + client + '&connector=' + connectorName + '&filetype=ThumbNail&PHIO_ID=' + result.PHIO_ID.valueRaw;
                    result.thumbnail = {
                        $$MetaData$$: {
                            accessUsage: [],
                            correspondingSearchAttributeName: "thumbnail",
                            dataType: "String",
                            description: "Thumbnail",
                            displayOrder: 0,
                            isKey: false,
                            isSortable: false,
                            isTitle: false,
                            presentationUsage: ["Thumbnail"]
                        },
                        label: "Thumbnail",
                        labelRaw: "Thumbnail",
                        value: thumbnailLink,
                        valueRaw: thumbnailLink
                    };

                    titleLink = '/sap/es/fl_get_files?sap-client=' + client + '&connector=' + connectorName + '&filetype=BinaryContent&PHIO_ID=' + result.PHIO_ID.valueRaw;
                    result.titlelink = {
                        $$MetaData$$: {
                            accessUsage: [],
                            correspondingSearchAttributeName: "titlelink",
                            dataType: "String",
                            description: "Display original document",
                            displayOrder: 0,
                            isKey: false,
                            isSortable: false,
                            isTitle: false,
                            presentationUsage: ["Titlelink"]
                        },
                        label: "Display original document",
                        labelRaw: "Display original document",
                        value: titleLink,
                        valueRaw: titleLink
                    };

                    suvlink = '/sap/es/fl_get_files?sap-client=' + client + '&connector=' + connectorName + '&filetype=SUVFile&PHIO_ID=' + result.PHIO_ID.valueRaw;
                    suvlink = '/ui/processSteps/Pdf2Text/pdfjs/web/viewer.html?file=' + encodeURIComponent(suvlink);
                    result.suvlink = {
                        $$MetaData$$: {
                            accessUsage: [],
                            correspondingSearchAttributeName: "suvlink",
                            dataType: "String",
                            description: "Display suv file",
                            displayOrder: 0,
                            isKey: false,
                            isSortable: false,
                            isTitle: false,
                            presentationUsage: ["Link"]
                        },
                        label: "Display suv file",
                        labelRaw: "suvlink",
                        value: suvlink,
                        valueRaw: suvlink
                    };
                }

                //get uri of factsheet
                var uri = '';
                var relatedActions = result.$$RelatedActions$$;
                for (var relatedAction in relatedActions) {
                    if (relatedActions[relatedAction].type === "Navigation" || relatedActions[relatedAction].type === "Link") {
                        uri = encodeURI(relatedActions[relatedAction].uri);
                    }
                }

                //
                var whyfounds = result.$$WhyFound$$ || [];
                var summaryAttrs = [];
                var detailAttrs = [];
                var titleAttrs = [];
                var title = '';
                var semanticObjectTypeAttrs = {};

                for (var prop in result) {
                    //ignore prop without label and metadata
                    if (!result[prop].label || !result[prop].$$MetaData$$) {
                        continue;
                    }

                    var presentationUsage = result[prop].$$MetaData$$.presentationUsage || [];
                    if (presentationUsage && presentationUsage.length > 0) {
                        if (presentationUsage.indexOf("Title") > -1 && result[prop].value) {
                            this._moveWhyFound2ResponseAttr(whyfounds, result[prop]);
                            title = title + " " + result[prop].value;
                        }
                        if (presentationUsage.indexOf("Summary") > -1) {
                            summaryAttrs.push({
                                property: prop,
                                displayOrder: result[prop].$$MetaData$$.displayOrder
                            });
                        } else if (presentationUsage.indexOf("Detail") > -1) {
                            detailAttrs.push({
                                property: prop,
                                displayOrder: result[prop].$$MetaData$$.displayOrder
                            });
                        } else if (presentationUsage.indexOf("Title") > -1) {
                            titleAttrs.push({
                                property: prop,
                                displayOrder: result[prop].$$MetaData$$.displayOrder
                            });
                        }
                    }


                    var semanticObjectType = result[prop].$$MetaData$$.semanticObjectType;
                    if (semanticObjectType && semanticObjectType.length > 0) {
                        semanticObjectTypeAttrs[semanticObjectType] = result[prop].valueRaw;
                    }
                }

                summaryAttrs.sort(sortDisplayOrder);
                detailAttrs.sort(sortDisplayOrder);
                titleAttrs.sort(sortDisplayOrder);

                var displayRelevantAttrs = summaryAttrs.concat(detailAttrs);
                var formattedResult = {};
                formattedResult.key = result.key;
                formattedResult.keystatus = result.keystatus;
                formattedResult.semanticObjectTypeAttrs = semanticObjectTypeAttrs;
                var imageAttr = this._getImageUrl(result);
                formattedResult.imageUrl = imageAttr.imageUrl;
                formattedResult.dataSourceName = result.$$DataSourceMetaData$$.label;
                formattedResult.dataSource = result.$$DataSourceMetaData$$;
                formattedResult.uri = uri;
                formattedResult.semanticObjectType = result.$$DataSourceMetaData$$.semanticObjectType || "";
                formattedResult.$$Name$$ = '';
                formattedResult.systemId = result.$$DataSourceMetaData$$.systemId || "";
                formattedResult.client = result.$$DataSourceMetaData$$.client || "";
                formattedResult.suvlink = result.suvlink;


                var propDisplay;
                var oItemAttribute = {};

                var aItemAttributes = [];
                for (var z = 0; z < displayRelevantAttrs.length; z++) {
                    propDisplay = displayRelevantAttrs[z].property;
                    oItemAttribute = {};
                    // image attribute shall not be displayed as a normal key value pair
                    if (propDisplay !== imageAttr.name) {
                        this._moveWhyFound2ResponseAttr(whyfounds, result[propDisplay]);
                        oItemAttribute.name = result[propDisplay].label;
                        oItemAttribute.value = result[propDisplay].value;
                        oItemAttribute.key = propDisplay;
                        oItemAttribute.isTitle = false; // used in table view
                        oItemAttribute.isSortable = result[propDisplay].$$MetaData$$.isSortable; // used in table view
                        oItemAttribute.attributeIndex = z; // used in table view
                        if (result[propDisplay].whyfound) {
                            oItemAttribute.whyfound = result[propDisplay].whyfound;
                        }
                        aItemAttributes.push(oItemAttribute);
                    }
                }

                var aTitleAttributes = [];
                for (var y = 0; y < titleAttrs.length; y++) {
                    propDisplay = titleAttrs[y].property;
                    oItemAttribute = {};
                    if (propDisplay !== imageAttr.name) {
                        oItemAttribute.name = result[propDisplay].label;
                        oItemAttribute.value = result[propDisplay].value;
                        oItemAttribute.key = propDisplay;
                        oItemAttribute.isTitle = false; // used in table view
                        oItemAttribute.isSortable = result[propDisplay].$$MetaData$$.isSortable; // used in table view
                        // oItemAttribute.attributeIndex = y; // used in table view
                        aTitleAttributes.push(oItemAttribute);
                    }
                }

                formattedResult.$$Name$$ = title.trim();
                formattedResult.numberofattributes = displayRelevantAttrs.length;
                formattedResult.title = result.title;
                formattedResult.itemattributes = aItemAttributes;
                formattedResult.titleattributes = aTitleAttributes;

                formattedResult.selected = formattedResult.selected || false;
                formattedResult.expanded = formattedResult.expanded || false;

                this._appendRemainingWhyfounds2FormattedResultItem(whyfounds, formattedResult.itemattributes);
                formattedResults.push(formattedResult);
            }


            return formattedResults;

        }
    };

})();
