// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

/**
 * @fileOverview Enhanced provider of application navigation, and available
 * navigation targets.
 *
 * Defines a service that provides a `getLinks()` method which complements
 * the one provided by CrossApplicationNavigation service by sorting the
 * resulting list in the order of relevance to the calling application.
 *
 * Note that in order to effectively leverage the enhanced `getLinks()` method
 * provided by this service, it is pertinent that the API user employs this
 * service's version of `toExternal()` for cross application navigation (instead)
 * of using the one provided by CrossApplicationNavigation service.
 */

/* global sap, jQuery */

(function (sap, jQuery) {
    "use strict";

    var fnGetHashCode = (function () {
        var oCache = Object.create(null, { "": { value: 0 | 0 } });

        return getHashCode;

        function getHashCode(sShellHash) {
            var iHash, iShellHashLength;

            if (oCache[sShellHash]) {
                return oCache[sShellHash];
            }

            iHash = 0 | 0;
            iShellHashLength = sShellHash.length;

            while (iShellHashLength--) {
                iHash = (iHash << 5) - iHash + (sShellHash.charCodeAt(iShellHashLength) | 0);
                iHash |= 0;
            }

            oCache[sShellHash] = iHash;

            return iHash;
        }
    })();

    SmartNavigation.hasNoAdapter = true;

    sap.ui.define(
        [
            "sap/ushell/services/AppConfiguration",
            "sap/ushell/services/Personalization",
            "sap/ushell/services/URLParsing",
            "sap/ushell/services/CrossApplicationNavigation"
        ],
        function (oAppConfiguration) {
            return new SmartNavigation(oAppConfiguration);
        }
    );

    sap.ushell.services.SmartNavigation = SmartNavigation;

    /**
     * Constructs an instance of SmartNavigation.
     *
     * The constructed services provides an enhancement on {@link CrossApplicationNavigation#getLinks}
     * and {@link CrossApplicationNavigation#toExternal}. In order for an application
     * to leverage this enhancement, it is pertinent that the application uses
     * @{link SmartNavigation#toExternal} for naviagtion. Hence the caller can
     * subsequently use @{link SmartNavigation#getLinks} with the outcome that
     * it sorts the resulting list in the orde of frequency of <i>Attempted</i> naviagtion
     * from the application to respective links.
     *
     * <i>Attempted</i> in the previous paragraph is emphasized due to the fact
     * that a click on the link will cause an increment of the frequency count,
     * regardless of wether the navigation was successful or not.
     *
     * @param {object} oAppConfiguration Instance of app configuration service.
     *
     * @class
     */
    function SmartNavigation(oAppConfiguration) {
        var oActivityCache;

        if (SmartNavigation.instance) {
            return SmartNavigation.instance;
        }

        oActivityCache = Object.create(null);

        Object.defineProperty(SmartNavigation, "instance", {
            value: Object.create(null, {
                /**
                 * Resolves the given semantic object (or action) and business
                 * parameters to a list of links available to the user, sorted
                 * according their relevance to the calling application.
                 *
                 * The relevance of link is defined by the frequency with which
                 * a navigation activity from the calling application to that
                 * link occurs.
                 *
                 * Internally, this method delegates to {@link sap.ushell.services.CrossApplicationNavigation#getLinks}
                 * and then sorts the resulting list accordingly.
                 *
                 * @returns {Promise}
                 *   A promise that resolves with an array of link objects
                 *   sorted according to their relevance to the calling application.
                 *
                 * @see {@link sap.ushell.services.CrossApplicationNavigation#getLinks}
                 *
                 * @memberof SmartNavigation#
                 * @since 1.44.0
                 * @private
                 */
                getLinks: {
                    value: function (oQuery) {
                        var sPersContainerKey, oActivity;

                        var oCrossAppNavService = sap.ushell.Container
                                .getService("CrossApplicationNavigation");
                        var oPersService = sap.ushell.Container
                                .getService("Personalization");

                        var aAllLinks = oCrossAppNavService.getLinks(oQuery);

                        var sCurrentShellHash = oAppConfiguration
                                .getCurrentAppliction().sShellHash;
                        if (!sCurrentShellHash) {
                            // Possibly the application (the calling
                            // component belongs to) has not initialised
                            // fully.
                            jQuery.sap.log.warning(
                                "Call to SmartNavigation#getLinks() simply "
                                + "delegated to CrossApplicationNavigation#getLinks()"
                                + " because oAppConfiguration#getCurrentAppliction()#sShellHash"
                                + " evaluates to undefined."
                            );

                            return aAllLinks;
                        }

                        sCurrentShellHash = "#" + sCurrentShellHash;
                        sPersContainerKey = getPersContainerKey(sCurrentShellHash);

                        oActivity = getActivityForKey(
                            sPersContainerKey,
                            oActivityCache,
                            oPersService
                        );

                        return jQuery
                            .when(aAllLinks, oActivity.getFrequentItems())
                            .then(function (aLinks, aFrequentItems) {
                                var oURLParsingService;

                                if (aFrequentItems.length === 0){
                                    return aLinks;
                                }

                                oURLParsingService = sap.ushell.Container.getService("URLParsing");

                                prepareLinksForSorting(aLinks, aFrequentItems, oURLParsingService);

                                return aLinks.sort(function (oLink, oOtherLink) {
                                    return oOtherLink.clickCount - oLink.clickCount;
                                });
                            });
                    }
                },
                /**
                 * Usage of this method in place of {@link sap.ushell.services.CrossApplicationNavigation#toExternal}
                 * drives the smartness of the results returned by {@link sap.ushell.services.SmartNavigation#getLinks}.
                 *
                 * @see {@link sap.ushell.services.CrossApplicationNavigation#toExternal}
                 *
                 * @memberof SmartNavigation#
                 * @since 1.44.0
                 * @private
                 */
                toExternal: {
                    value: function (oArgs) {
                        var _arguments = arguments;

                        var sDestinationShellHash;
                        var oTarget = oArgs.target;

                        var fnToExternal = function () {
                            var oCrossAppNavService = sap.ushell.Container
                                .getService("CrossApplicationNavigation");
                            return oCrossAppNavService.toExternal
                                .apply(oCrossAppNavService, _arguments);
                        };

                        var sCurrentShellHash = oAppConfiguration
                            .getCurrentAppliction().sShellHash;
                        if (!sCurrentShellHash) {
                            // Possibly the application (the calling
                            // component belongs to) has not initialised
                            // fully.
                            jQuery.sap.log.warning(
                                "Call to SmartNavigation#toExternal() simply "
                                + "delegated to CrossApplicationNavigation#toExternal()"
                                + " because oAppConfiguration#getCurrentAppliction()#sShellHash"
                                + " evaluates to undefined."
                            );

                            return jQuery.when(fnToExternal());
                        }

                        sCurrentShellHash = "#" + sCurrentShellHash;

                        if (oTarget.shellHash) {
                            sDestinationShellHash = getBaseHashPart(
                                sap.ushell.Container.getService("URLParsing"),
                                oTarget.shellHash
                            );
                        } else {
                            sDestinationShellHash = "#" + oTarget.semanticObject
                                + "-" + oTarget.action;
                        }

                        return trackNavigationActivity(
                            sCurrentShellHash,
                            sDestinationShellHash,
                            oActivityCache,
                            sap.ushell.Container.getService("Personalization")
                        ).then(fnToExternal);
                    }
                },
                constructor: {
                    value: SmartNavigation
                }
            })
        });

        return SmartNavigation.instance;
    }

    function trackNavigationActivity(sCurrentShellHash, sDestinationShellHash,
        oActivityCache, oPersService) {

        var sPersContainerKey = getPersContainerKey(sCurrentShellHash);

        // Update count for destination app in the current one's related links.
        return getActivityForKey(sPersContainerKey, oActivityCache, oPersService)
            .newItem({appId: sDestinationShellHash});
    }

    function prepareLinksForSorting(aLinks, aFrequentItems, oURLParsingService) {
        mapClickCountsIntoLinkItems(aLinks, aFrequentItems, oURLParsingService);
    }

    function mapClickCountsIntoLinkItems(aLinks, aFrequentItems, oURLParsingService) {
        var mFrequentItems = Object.create(null);

        aFrequentItems.forEach(function (oActivityItem) {
            mFrequentItems[oActivityItem.appId] = oActivityItem;
        });

        aLinks.forEach(function (oLink) {
            var sFrequentItemBaseHashPart = getBaseHashPart(oURLParsingService, oLink.intent);
            var oLinkActivity = mFrequentItems[sFrequentItemBaseHashPart];

            oLink.clickCount = oLinkActivity ? oLinkActivity.count : 0;
        });
    }

    function getActivityForKey(sPersContainerKey, oActivityCache, oPersService) {
        var oPersContainer;
        var oActivity = oActivityCache[sPersContainerKey];

        if (!oActivity) {
            oPersContainer = oPersService.getPersonalizer(
                {
                    container: sPersContainerKey,
                    item: "data"
                },
                {
                    keyCategory: oPersService.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersService.constants.writeFrequency.HIGH,
                    clientStorageAllowed: true
                }
            );

            oActivity = new RecentActivity(
                500,
                equalActivityEntriesPredictate,
                moreRelevantActivityEntryPredicate,
                // Load function.
                oPersContainer.getPersData.bind(oPersContainer),
                // Save function.
                oPersContainer.setPersData.bind(oPersContainer)
            );

            oActivityCache[sPersContainerKey] = oActivity;
        }

        return oActivity;
    }

    function equalActivityEntriesPredictate(oActivity, oOtherActivity) {
        return oActivity.appId === oOtherActivity.appId;
    }

    function moreRelevantActivityEntryPredicate(oActivity, oOtherActivity) {
        return oOtherActivity.iCount - oActivity.iCount ||
            oOtherActivity.iTimestamp - oActivity.iTimestamp;
    }

    function getPersContainerKey(sShellHash) {
        return "ushell.smartnav." + fnGetHashCode(sShellHash);
    }

    function getBaseHashPart(oURLParsingService, sIntent) {
        var oTarget = oURLParsingService.parseShellHash(sIntent);

        return "#" + oTarget.semanticObject + "-" + oTarget.action;
    }

    function RecentActivity(iMaxLength, fnEquals, fnCompare, fnLoad, fnSave) {
        var iMaximumDays = 30, oRecentActivities;

        var fnUpdateIfAlreadyIn = function (oItem, iTimestampNow) {
            return oRecentActivities.recentUsageArray.some(function (oRecentEntry) {
                if (!fnEquals(oRecentEntry.oItem, oItem)) {
                    return false;
                }

                jQuery.extend(oRecentEntry.oItem, oItem);
                oRecentEntry.iTimestamp = iTimestampNow;
                oRecentEntry.oItem.timestamp = iTimestampNow;

                // update both the usage array's last day and the global entry counter
                oRecentEntry.aUsageArray[oRecentEntry.aUsageArray.length - 1] += 1;
                oRecentEntry.iCount += 1;

                // BEGIN::EXTENSION
                oRecentEntry.oItem.count = oRecentEntry.iCount;
                // END::EXTENSION

                oRecentActivities.recentUsageArray.sort(fnCompare);

                return true;
            });
        };

        var fnInsertNew = function (oItem, iTimestampNow) {
            var oNewEntry = {
                oItem: oItem,
                iTimestamp: iTimestampNow,
                aUsageArray: [1],
                iCount: 1
            };

            oItem.timestamp = iTimestampNow;

            if (oRecentActivities.recentUsageArray.length === iMaxLength) {
                oRecentActivities.recentUsageArray.pop();
            }

            oRecentActivities.recentUsageArray.unshift(oNewEntry);
        };

        this.newItem = function (oItem) {
            var oDeferred = new jQuery.Deferred();

            var iTimestampNow = Date.now(),
                bAlreadyIn,
                that = this,
                currentDay = this.getDayFromDateObj(new Date());
            fnLoad().done(function (aLoadedRecents) {
                oRecentActivities = that.getRecentActivitiesFromLoadedData(aLoadedRecents);
                // If the current day is different than the recent one -
                // add a new entry (for the current day's usage) to each usage array
                if (currentDay !== oRecentActivities.recentDay) {
                    that.addNewDay();
                    oRecentActivities.recentDay = currentDay;
                }

                bAlreadyIn = fnUpdateIfAlreadyIn(oItem, iTimestampNow);
                if (!bAlreadyIn) {
                    fnInsertNew(oItem, iTimestampNow);
                }

                fnSave(oRecentActivities)
                    .done(function (data) {
                        oDeferred.resolve(data);
                    })
                    .fail(function () {
                        oDeferred.reject();
                    });
            });

            return oDeferred.promise();
        };

        /*
         * getRecentItems return last 30 activities.
         * - persist data.
         * - return the last <maxNumOfActivities> entries or all entries (if maxNumOfActivities was not provided).
         */
        this.getRecentItemsHelper = function (maxNumOfActivities) {
            var that = this,
                oDeferred = new jQuery.Deferred(),
                currentDay = this.getDayFromDateObj(new Date()),
                // Helper function that returns the last <maxNumOfActivities> recent activities.
                getRecentItems = function (aLoadedRecents) {
                    var aRecentItems = [],
                        iActivityCounter = 0,
                        iRecentActivityCounter;

                    for (
                        iRecentActivityCounter = 0;
                        iRecentActivityCounter < aLoadedRecents.recentUsageArray.length &&
                        (!maxNumOfActivities || iActivityCounter < maxNumOfActivities);
                        iRecentActivityCounter++
                    ) {
                        aRecentItems
                            .push(aLoadedRecents.recentUsageArray[iRecentActivityCounter]);
                        iActivityCounter++;
                    }

                    oDeferred.resolve(aRecentItems);
                };

            fnLoad().done(function (aLoadedRecents) {
                oRecentActivities = that.getRecentActivitiesFromLoadedData(aLoadedRecents);
                // If the current day is different than the recent one -
                // add a new entry (for the current day's usage) to each usage array
                var newDayAdded = false;
                if (currentDay !== oRecentActivities.recentDay) {
                    that.addNewDay();
                    oRecentActivities.recentDay = currentDay;
                    newDayAdded = true;
                }

                if (newDayAdded) {
                    // If a new day was added, persist it.
                    fnSave(oRecentActivities).done(function (data) {
                        oDeferred.resolve(getRecentItems(oRecentActivities));
                    }).fail(function () {
                        oDeferred.reject();
                    });
                } else {
                    oDeferred.resolve(getRecentItems(oRecentActivities));
                }
            });

            return oDeferred.promise();
        };

        this.getFrequentItems = function () {
            var oDeferred = new jQuery.Deferred();
            this.getRecentItemsHelper().done(function (recentItems) {
                var activityIndex,
                    iWorkingDaysCounter = 0,
                    aFrequentActivity = [],
                    oActivity,
                    previousActivityDate = recentItems[0] ? new Date(recentItems[0].iTimestamp) : undefined,
                    currentActivityDate;
                //Go through the recent activities list and leave only activities from the last 30 working days
                for (activityIndex = 0; activityIndex < recentItems.length && iWorkingDaysCounter < 30; activityIndex++) {
                    oActivity = recentItems[activityIndex];
                    //Add only activities that happened more than once
                    if (oActivity.iCount > 0) {
                        aFrequentActivity.push(oActivity);
                    }
                    currentActivityDate = new Date(oActivity.iTimestamp);
                    if (previousActivityDate.toDateString() !== currentActivityDate.toDateString()) {
                        //If found an activity with a different date than the previous one, increase the days counter
                        iWorkingDaysCounter++;
                        previousActivityDate = currentActivityDate;
                    }
                }
                //Sort in descending order according to the count
                aFrequentActivity.sort(function (a, b) {
                    return b.iCount - a.iCount;
                });
                //Take only first 30 items (30 most frequent items)
                aFrequentActivity = aFrequentActivity.slice(0, 30);
                oDeferred.resolve(jQuery.map(aFrequentActivity, function (oRecentEntry) {
                    // BEGIN::EXTENSION
                    oRecentEntry.oItem.count = oRecentEntry.iCount;
                    // END::EXTENSION
                    return oRecentEntry.oItem;
                }));
            });
            return oDeferred.promise();
        };

        this.addNewDay = function () {
            var activityIndex, aCurrentActivityArray;

            for (activityIndex = 0; activityIndex < oRecentActivities.recentUsageArray.length; activityIndex++) {
                // Get the array of app usage
                aCurrentActivityArray = oRecentActivities.recentUsageArray[activityIndex].aUsageArray;
                if (!aCurrentActivityArray) {
                    // If no array exists, add an empty array and also set iCount to 0
                    aCurrentActivityArray = [];
                    oRecentActivities.recentUsageArray[activityIndex].aUsageArray = aCurrentActivityArray;
                    oRecentActivities.recentUsageArray[activityIndex].iCount = 0;
                }

                // Add an item in the Array for the new day
                aCurrentActivityArray.push(0);

                // If the array size is > iMaximumDays, remove the first (oldest) entry and update the count accordingly
                if (aCurrentActivityArray.length > iMaximumDays) {
                    oRecentActivities.recentUsageArray[activityIndex].iCount -= aCurrentActivityArray[0];
                    aCurrentActivityArray.shift();
                }
            }
        };

        this.getDayFromDateObj = function (dateObj) {
            return (dateObj.getUTCFullYear() + "/" + (dateObj.getUTCMonth() + 1) + "/" + dateObj.getUTCDate());
        };

        this.getRecentActivitiesFromLoadedData = function (loadedRecents) {
            var recentActivities;
            if (jQuery.isArray(loadedRecents)) {
                recentActivities = {
                    recentDay: null,
                    recentUsageArray: loadedRecents
                };
            } else {
                recentActivities = loadedRecents || {
                    recentDay: null,
                    recentUsageArray: []
                };
            }
            return recentActivities;
        };
    }
})(sap, jQuery);