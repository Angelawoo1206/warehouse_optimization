// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains miscellaneous utility functions.
 * they are for exclusive use within teh unified shell unless otherwise noted
 */

(function () {
    "use strict";
    /*global dispatchEvent, document, jQuery, localStorage, sap, clearTimeout, setTimeout */

    // ensure that sap.ushell exists
    jQuery.sap.declare("sap.ushell.ui.launchpad.TileContainerUtils");

    sap.ushell.ui.launchpad.TileContainerUtils = {};

    /**
     * Tells whether the given value is an array.
     *
     * @param {object} o
     *   any value
     * @returns {boolean}
     *   <code>true</code> if and only if the given value is an array
     * @private
     * @since 1.34.0
     */

    sap.ushell.ui.launchpad.TileContainerUtils.showHideTilesAndHeaders = function (indexingMaps, onScreenItems) {
        var scrPathKey,
            realItem,
            entry,
        //number of elements displayed.
            nCountVisibElelemnts = 0,
        //number of elements that were visible and we have change to hidden.
            nCountFilteredElement = 0;

        for (scrPathKey in indexingMaps.onScreenPathIndexMap) {
            if (indexingMaps.onScreenPathIndexMap.hasOwnProperty(scrPathKey)) {
                entry = indexingMaps.onScreenPathIndexMap[scrPathKey];
                realItem = onScreenItems[entry.aItemsRefrenceIndex];

                //count element is visible and we filter it, we will use in to reallocate units for the pagination.
                if (realItem.getVisible() && !entry.isVisible) {
                    nCountFilteredElement++;
                }
                realItem.setVisible(entry.isVisible);

                if (entry.isVisible) {
                    nCountVisibElelemnts++;
                }
            }
        }

        return {
            nCountVisibElelemnts: nCountVisibElelemnts,
            nCountFilteredElement: nCountFilteredElement
        };
    };

    sap.ushell.ui.launchpad.TileContainerUtils.applyFilterOnItem = function (elementsToDisplay, filters) {
        var filter;

        for (filter in filters) {
            if (filters.hasOwnProperty(filter)) {
                filters[filter](elementsToDisplay);
//                    this.indexingMaps.onScreenPathIndexMap[oOnScreenElement].isVisible = false;
            }
        }
    };

    sap.ushell.ui.launchpad.TileContainerUtils.createNewItem = function (elementToDisplay, sName) {
        var oBindingInfo = this.mBindingInfos[sName],
            fnFactory = oBindingInfo.factory,
            addNewItem = jQuery.proxy(function (oContext) {
                var sId = this.getId() + "-" + jQuery.sap.uid(),
                    oClone = fnFactory(sId, oContext);
                oClone.setBindingContext(oContext, oBindingInfo.model);
                return oClone;
            }, this);

        return addNewItem(elementToDisplay);
    };

    sap.ushell.ui.launchpad.TileContainerUtils.addNewItem = function (oClone, sName) {
        var oAggregationInfo = this.getMetadata().getJSONKeys()[sName];

        this[oAggregationInfo._sMutator](oClone);

        return true
    };



    sap.ushell.ui.launchpad.TileContainerUtils.createMissingElementsInOnScreenElements = function (indexingMaps, elementsToDisplay, indexSearchMissingFilteredElem, fnaddNewItem, aItems, filters, sName) {
        var path,
            iNewItemIndex = 0,
            j,
            elementsToDisplayLength = elementsToDisplay.length;

        for (j = indexSearchMissingFilteredElem; j < elementsToDisplayLength; j++) {
            iNewItemIndex++;
            path = elementsToDisplay[j].getPath();
            //is aBindingContexts[j] not displayed
            if (!indexingMaps.onScreenPathIndexMap[path]) {
                //if add new item did not successed stop the createion, this is used when we do not have any more allocated unites.
                // indexing can be done in the ad new item function.
                if (fnaddNewItem(elementsToDisplay[j], sName) == false) {
                    //return indication the we have not successfully added all the elements, this is because we do not have allocated units.
                    return false;
                }

                //update indexing
                sap.ushell.ui.launchpad.TileContainerUtils.applyFilterOnItem(elementsToDisplay[j], filters);
            } else {
                //order problem needs to refresh.
                throw true;
            }
        }

        return true;
    };


    sap.ushell.ui.launchpad.TileContainerUtils.applyFilterOnAllItems = function (oBindingInfo, filters) {
        var iBindingcontextIndex;

        var oBinding = oBindingInfo.binding,
            aBindingContexts;


        if (!oBinding) {
            return;
        }
        aBindingContexts = oBinding.getContexts();

        for (iBindingcontextIndex = 0; iBindingcontextIndex < aBindingContexts.length; iBindingcontextIndex++) {
            //invoke all filters with that element
            sap.ushell.ui.launchpad.TileContainerUtils.applyFilterOnItem(aBindingContexts[iBindingcontextIndex], filters);

        }
    };


    sap.ushell.ui.launchpad.TileContainerUtils.validateOrder = function (aBindingContexts, aItems, indexSearchMissingFilteredElem ) {
        var lastDomPath, firstFltrPath, pathIndex,
            aLastDomPathParts, aFirstFltrPathParts, nPartsIndex,
            sLastDomPathFrag, sFirstFltrPathFrag;

        if (aBindingContexts[indexSearchMissingFilteredElem] && aItems.length > 0) {
            lastDomPath = aItems[aItems.length - 1].getBindingContext().getPath();
            firstFltrPath = aBindingContexts[indexSearchMissingFilteredElem].getPath();

            aLastDomPathParts = lastDomPath.split("/");
            aFirstFltrPathParts = firstFltrPath.split("/");

            for (nPartsIndex = 0; nPartsIndex < aLastDomPathParts.length && nPartsIndex < aFirstFltrPathParts.length; nPartsIndex++) {
                //check numbers.
                sLastDomPathFrag = aLastDomPathParts[nPartsIndex];
                sFirstFltrPathFrag = aFirstFltrPathParts[nPartsIndex];

                if (!!parseInt(sLastDomPathFrag, 10) && !!parseInt(sFirstFltrPathFrag, 10)) {
                    //number compare as number
                    if (parseInt(sLastDomPathFrag, 10) > parseInt(sFirstFltrPathFrag, 10)) {
                        return false;
                    } else if (parseInt(sLastDomPathFrag, 10) < parseInt(sFirstFltrPathFrag, 10)){
                        return true;
                    }
                } else {
                    //strings comparison.
                    for (pathIndex = 0; pathIndex < sFirstFltrPathFrag.length && pathIndex < sLastDomPathFrag.length; pathIndex++) {
                        if (sLastDomPathFrag[pathIndex].charCodeAt() > sFirstFltrPathFrag[pathIndex].charCodeAt()) {
                            return false;
                        } else if (sLastDomPathFrag[pathIndex].charCodeAt() < sFirstFltrPathFrag[pathIndex].charCodeAt()) {
                            return true;
                        }
                    }
                }
            }
        }

        return true;
    };

    sap.ushell.ui.launchpad.TileContainerUtils.markVisibleOnScreenElements = function (elementsToDisplay, indexingMaps, bUpdateVisibility) {
        var indexSearchMissingFilteredElem = 0,
            path,
            elementsToDisplayLength = elementsToDisplay.length;

        for (indexSearchMissingFilteredElem = 0; indexSearchMissingFilteredElem < elementsToDisplayLength; indexSearchMissingFilteredElem++) {
            path = elementsToDisplay[indexSearchMissingFilteredElem].getPath();
            //is aBindingContexts[j] not displayed
            if (indexingMaps.onScreenPathIndexMap[path]) {
                //entry exists and should be display.
                if (bUpdateVisibility) {
                    indexingMaps.onScreenPathIndexMap[path].isVisible = true;
                }
            } else {
                return indexSearchMissingFilteredElem;
            }
        }

        return indexSearchMissingFilteredElem;
    };

    sap.ushell.ui.launchpad.TileContainerUtils.indexOnScreenElements = function (onScreenItems, bIsVisible) {
        var path,
            indexOnScreen,
            indexingMaps = {onScreenPathIndexMap: {}},
            onScreenItemsLength = onScreenItems.length,
            curOnScreenItem,
            bVisibility = true;

        if (bIsVisible === false) {
            bVisibility = false;
        }

        for (indexOnScreen = 0; indexOnScreen < onScreenItemsLength; indexOnScreen++) {
            curOnScreenItem = onScreenItems[indexOnScreen];
            if (curOnScreenItem.getBindingContext()) {
                path = curOnScreenItem.getBindingContext().getPath();
                if (!indexingMaps.onScreenPathIndexMap[path]) {
                    indexingMaps.onScreenPathIndexMap[path] = {aItemsRefrenceIndex: indexOnScreen, isVisible: bVisibility};
                }
            }
        }

        return indexingMaps;
    };

}());