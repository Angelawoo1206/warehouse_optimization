jQuery.sap.require("sap.ushell.components.tiles.generic");

(function () {
    "use strict";
    sap.ushell.components.tiles.generic.extend("sap.ushell.components.tiles.indicatorcontribution.ContributionTile", {
        onInit :  function(){
            this.KPI_VALUE_REQUIRED = false;
        },
        doProcess : function(bRefreshClick, isAutoRefresh){
            var that = this;
            this.DEFINITION_DATA = this.oConfig;
            this._updateTileModel(this.DEFINITION_DATA);
            this.setTextInTile();
            this.fetchChartData(bRefreshClick, isAutoRefresh, function(kpiValue){
                this.CALCULATED_KPI_VALUE = kpiValue;
                this._updateTileModel({
                    data : this.CALCULATED_KPI_VALUE
                });
                if (that.oConfig.TILE_PROPERTIES.frameType == sap.suite.ui.commons.FrameType.TwoByOne) {
                    that.oKpiTileView.oGenericTile.setFrameType(sap.suite.ui.commons.FrameType.TwoByOne);
                    that.oKpiTileView.oGenericTile.removeAllTileContent();
                    that.getView().getViewData().parentController._updateTileModel(this.getTile().getModel().getData());
                    that.getView().getViewData().deferredObj.resolve();
                } else {
                    that.oKpiTileView.oGenericTile.setFrameType(sap.suite.ui.commons.FrameType.OneByOne);
                    that.oKpiTileView.oGenericTile.removeAllTileContent();
                    that.oKpiTileView.oGenericTile.addTileContent(that.oKpiTileView.oNVConfS);
                    var navTarget = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
                    that.oKpiTileView.oGenericTile.$().wrap("<a href ='" + navTarget + "'/>");
                    this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
                }

                this.setToolTip(null,this.CALCULATED_KPI_VALUE,"CONT");
                if (this.chipCacheTime &&
                        !sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(this.oConfig)) {
                    sap.ushell.components.tiles.indicatorTileUtils.util.scheduleFetchDataJob.call(this, this.oTileApi.visible.isVisible());
                }
            }, this.logError);
        },

        fetchChartData : function(bRefreshClick, isAutoRefresh, fnSuccess, fnError){

            var that = this;

            try {
                /* Preparing arguments for the prepareQueryServiceUri function */
                var sUri = this.oConfig.EVALUATION.ODATA_URL;
                var entitySet = this.oConfig.EVALUATION.ODATA_ENTITYSET;
                /*var sThresholdObject =*/ that.setThresholdValues();
                if (this.oConfig.TILE_PROPERTIES.semanticMeasure){
                    /*
                     * Semantic Measure Inclusion (for Future use)
                     * var measure = [];
                     * measure.push(this.oConfig.EVALUATION.COLUMN_NAME);
                     * measure.push(this.oConfig.TILE_PROPERTIES.semanticMeasure);
                     * */
                    var measure = this.oConfig.EVALUATION.COLUMN_NAME + "," + this.oConfig.TILE_PROPERTIES.semanticMeasure;
                } else {
                    var measure = this.oConfig.EVALUATION.COLUMN_NAME;
                }
                var unitProperty = null;
                var dimension = this.oConfig.TILE_PROPERTIES.dimension;
                /*var data =*/ this.oConfig.EVALUATION_VALUES;
                var isRefreshClick = sap.ushell.components.tiles.indicatorTileUtils.util.getBoolValue(bRefreshClick);
                var cachedValue = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
                var chipUpdateTime = that.oTileApi.configuration.getParameterValueAsString("timeStamp");
                var isCacheValid = sap.ushell.components.tiles.indicatorTileUtils.util.isCacheValid(that.oConfig.TILE_PROPERTIES.id, chipUpdateTime, that.chipCacheTime, that.chipCacheTimeUnit, that.tilePressed);
                if (!cachedValue || (!isCacheValid && that.oTileApi.visible.isVisible()) || isRefreshClick || (isAutoRefresh && that.oTileApi.visible.isVisible()) || that.getView().getViewData().refresh) {
                    if (that.kpiValueFetchDeferred) {
                        that.kpiValueFetchDeferred = false;
                        var variants = sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);
                        var orderByObject = {};
                        orderByObject["0"] = measure + ",asc";
                        orderByObject["1"] = measure + ",desc";
                        orderByObject["2"] = dimension + ",asc";
                        orderByObject["3"] = dimension + ",desc";
                        var orderByElement = orderByObject[this.oConfig.TILE_PROPERTIES.sortOrder || "0"].split(",");
                        var finalQuery = sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(that.oRunTimeODataModel, entitySet, measure, dimension, variants, 3);
                        if (this.oConfig.TILE_PROPERTIES.semanticMeasure) {
                            finalQuery.uri += "&$top=3&$orderby=" + orderByElement[0] + " " + orderByElement[2];
                        } else {
                            finalQuery.uri += "&$top=3&$orderby=" + orderByElement[0] + " " + orderByElement[1];
                        }

                        this.comparisionChartODataRef = finalQuery.model.read(finalQuery.uri, null, null, true, function(data) {
                            that.kpiValueFetchDeferred = true;
                            var writeData = {};
                            if (data && data.results && data.results.length) {
                                if (finalQuery.unit[0]) {
                                    that._updateTileModel({
                                        unit : data.results[0][finalQuery.unit[0].name]
                                    });
                                    unitProperty = finalQuery.unit[0].name;
                                    writeData.unit = finalQuery.unit[0];
                                    writeData.unit.name = finalQuery.unit[0].name;
                                }
                                dimension = sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(that.oTileApi.url.addSystemToServiceUrl(sUri), entitySet, dimension);
                                writeData.dimension = dimension;
                                that.oConfig.TILE_PROPERTIES.FINALVALUE = data;
                                that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE,measure.split(",")[0],dimension, unitProperty);
//                              if (sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id)){
//                              writeData = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
//                              writeData.data = data;
//                              } else {
                                writeData.data = that.oConfig.TILE_PROPERTIES.FINALVALUE;
                                writeData.isCurM = that.isACurrencyMeasure(that.oConfig.EVALUATION.COLUMN_NAME);
                                if (finalQuery.unit[0]) {
                                     if (writeData && writeData.data && writeData.data.length) {
                                         writeData.data[0][finalQuery.unit[0].name] = data.results[0][finalQuery.unit[0].name];
                                     }
                                }
                                var cacheData = {};
//                              cacheData.DATA = JSON.stringify(writeData);
//                              cacheData.CHIPID = that.oConfig.TILE_PROPERTIES.id;
//                              cacheData.CHIP_CHANGED_TIME = new Date();
//                              cacheData.EVALUATION_CHANGED_TIME  = new Date();
//                              cacheData.EVALUATIONID = that.oConfig.EVALUATION.ID;
//                              cacheData.CACHEDTIME = new Date();
//                              cacheData.USERID = sap.ushell.Container.getUser().getId();
                                that.cacheTime = sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();

                                cacheData.ChipId = that.oConfig.TILE_PROPERTIES.id;
                                cacheData.Data = JSON.stringify(writeData);
                                cacheData.CacheMaxAge = Number(that.chipCacheTime);
                                cacheData.CacheMaxAgeUnit = that.chipCacheTimeUnit;
                                cacheData.CacheType = 1;

                                var localCache = that.getLocalCache(cacheData);

                                that.updateDatajobScheduled = false;
                                var key = that.oConfig.TILE_PROPERTIES.id + "data";
                                var runningJob = sap.ushell.components.tiles.indicatorTileUtils.util.getScheduledJob(key);
                                if (runningJob) {
                                    clearTimeout(runningJob);
                                    runningJob = undefined;
                                }
                                if (!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(that.oConfig)) {
                                    sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, localCache);
                                    var bUpdate = false;
                                    if (cachedValue) {
                                        bUpdate = true;
                                    }
                                    if (that.chipCacheTime) {
                                        sap.ushell.components.tiles.indicatorTileUtils.util.writeFrontendCacheByChipAndUserId(that.oTileApi, that.oConfig.TILE_PROPERTIES.id, cacheData,
                                                bUpdate, function(data){
                                            if (data) {
                                                that.cacheTime = data && data.CachedTime;
                                                sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, data);
                                            }
                                            if (that.chipCacheTime &&
                                                    !sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(that.oConfig)) {
                                                jQuery.proxy(that.setTimeStamp(that.cacheTime), that);
                                            }
                                        });
                                    }
                                } else {
                                    var tempCacheData = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
                                    if (tempCacheData) {
                                        if (!tempCacheData.CachedTime) {
                                            tempCacheData.CachedTime = sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();
                                        }
                                        var avilableCacheData = tempCacheData.Data;
                                        if (avilableCacheData) {
                                            avilableCacheData = JSON.parse(avilableCacheData);
                                            if (that.oKpiTileView.getViewName() == "tiles.indicatornumeric.NumericTile") {
                                                avilableCacheData.leftData = writeData;
                                            } else {
                                                avilableCacheData.rightData = writeData;
                                            }
                                        }
                                        tempCacheData.Data = JSON.stringify(avilableCacheData);
                                        sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, tempCacheData);
                                    } else {
                                        var avilableCacheData = {};
                                        avilableCacheData.rightData = writeData;
                                        localCache.Data = JSON.stringify(avilableCacheData);
                                        sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, localCache);
                                    }
                                    that.cacheWriteData = writeData;
                                }
                                fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                            } else if (data.results.length == 0) {
                                that.oConfig.TILE_PROPERTIES.FINALVALUE = data;
                                if (sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id)){
                                    writeData = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
                                    writeData.data = data;
                                } else {
                                    writeData.data = data;
                                }
                                sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, writeData);
                                fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                                that.setNoData();
                            } else {
                                sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, {empty:"empty"});
                                that.setNoData();
                            }
                        },function(eObject) {
                            that.kpiValueFetchDeferred = true;
                            if (eObject && eObject.response) {
                                jQuery.sap.log.error(eObject.message + " : " + eObject.request.requestUri);
                                fnError.call(that, eObject);
                            }
                        });
                    }
                } else {
                    if (cachedValue && cachedValue.Data) {
                        var kpiData;
                        var tileType = that.oConfig && that.oConfig.TILE_PROPERTIES && that.oConfig.TILE_PROPERTIES.tileType;
                        if (tileType.indexOf("DT-") == -1) {
                            kpiData = cachedValue.Data && JSON.parse(cachedValue.Data);
                        } else {
                            kpiData =  cachedValue.Data && JSON.parse(cachedValue.Data);
                            kpiData = kpiData.rightData;
                        }
                        that.cacheTime = cachedValue.CachedTime;
                        if (that.chipCacheTime &&
                                !sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(that.oConfig)) {
                            jQuery.proxy(that.setTimeStamp(that.cacheTime), that);
                        }
                        if (kpiData.data && kpiData.data.length) {
                            if (kpiData.unit){
                                that._updateTileModel({
                                    unit : kpiData.data[0][kpiData.unit.name]
                                });
                                //kpiData = kpiData.unit.name;
                            }
                            dimension = kpiData.dimension;
                            that.oConfig.TILE_PROPERTIES.FINALVALUE = kpiData.data;
                            //that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE,measure.split(",")[0],dimension, unitProperty);

                            fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                        } else if (kpiData && kpiData.data && kpiData.data instanceof Array && kpiData.data.length == 0){
                            that.oConfig.TILE_PROPERTIES.FINALVALUE = kpiData.data;
                            fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                            that.setNoData();
                        } else {
                            that.setNoData();
                        }
                    } else {
                        that.setNoData();
                    }
                }
            } catch(e) {
                that.kpiValueFetchDeferred = true;
                fnError.call(that,e);
            }
        },

        _processDataForComparisonChart : function(data,measure,dimension, unitProperty){
            var semanticColor = this.oConfig.TILE_PROPERTIES.semanticColorContribution;
            var finalOutput = [];
            var tempVar;
            var unitValue;
            for (var i = 0; i < data.results.length; i++) {
                var eachData = data.results[i];
                var temp = {};
                try {
                    temp.title = eachData[dimension].toString();
                } catch(e) {
                    temp.title = "";
                }

                temp.value = Number(eachData[measure]);
                var calculatedValueForScaling = Number(eachData[measure]);
                if (this.oConfig.EVALUATION.SCALING == -2) {
                    calculatedValueForScaling *= 100;
                }
                var c = this.isCurrencyMeasure(measure);
                unitValue = eachData[unitProperty];
                tempVar = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(calculatedValueForScaling,this.oConfig.EVALUATION.SCALING,this.oConfig.EVALUATION.DECIMAL_PRECISION, c, unitValue);
//              if (this.oConfig.EVALUATION.SCALING == -2) {
//              tempVar += " %";
//              }
                temp.displayValue = tempVar.toString();

                if (typeof semanticColor === 'undefined'){
                    temp.color = "Neutral";
                } else {
                    temp.color = semanticColor;
                    /*   if(this.oConfig.EVALUATION.GOAL_TYPE === "MA"){
                        if(temp.value > eachData[semanticMeasure]){
                            temp.color= "Good";
                        }
                        else {
                            temp.color= "Error";
                        }
                    }
                    else if(this.oConfig.EVALUATION.GOAL_TYPE === "MI"){
                        if(temp.value < eachData[semanticMeasure]){
                            temp.color= "Good";
                        }
                        else {
                            temp.color= "Error";
                        }
                    }
                    else {
                        temp.color= "Neutral";
                    }*/
                }
                if (temp && unitProperty) {
                    temp[unitProperty] = unitValue;
                }
                finalOutput.push(temp);
            }
            return finalOutput;
        },

        doDummyProcess : function(){
            var that = this;
            that.setTextInTile();
            that._updateTileModel({
                value: 8888,
                size: sap.suite.ui.commons.InfoTileSize.Auto,
                frameType: sap.suite.ui.commons.FrameType.OneByOne,
                state: sap.suite.ui.commons.LoadState.Loading,
                valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,
                indicator: sap.suite.ui.commons.DeviationIndicator.None,
                title : "US Profit Margin",
                footer : "Current Quarter",
                description: "Maximum deviation",
                data: [
                       { title: "Americas", value: 10, color: "Neutral" },
                       { title: "EMEA", value: 50, color: "Neutral" },
                       { title: "APAC", value: -20, color: "Neutral" }
                       ]

            });
            this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
        }


    });
}());
