jQuery.sap.require("sap.ushell.components.tiles.generic");(function(){"use strict";sap.ushell.components.tiles.generic.extend("sap.ushell.components.tiles.indicatorcontribution.ContributionTile",{onInit:function(){this.KPI_VALUE_REQUIRED=false;},doProcess:function(r,i){var t=this;this.DEFINITION_DATA=this.oConfig;this._updateTileModel(this.DEFINITION_DATA);this.setTextInTile();this.fetchChartData(r,i,function(k){this.CALCULATED_KPI_VALUE=k;this._updateTileModel({data:this.CALCULATED_KPI_VALUE});if(t.oConfig.TILE_PROPERTIES.frameType==sap.suite.ui.commons.FrameType.TwoByOne){t.oKpiTileView.oGenericTile.setFrameType(sap.suite.ui.commons.FrameType.TwoByOne);t.oKpiTileView.oGenericTile.removeAllTileContent();t.getView().getViewData().parentController._updateTileModel(this.getTile().getModel().getData());t.getView().getViewData().deferredObj.resolve();}else{t.oKpiTileView.oGenericTile.setFrameType(sap.suite.ui.commons.FrameType.OneByOne);t.oKpiTileView.oGenericTile.removeAllTileContent();t.oKpiTileView.oGenericTile.addTileContent(t.oKpiTileView.oNVConfS);var n=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);t.oKpiTileView.oGenericTile.$().wrap("<a href ='"+n+"'/>");this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);}this.setToolTip(null,this.CALCULATED_KPI_VALUE,"CONT");if(this.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(this.oConfig)){sap.ushell.components.tiles.indicatorTileUtils.util.scheduleFetchDataJob.call(this,this.oTileApi.visible.isVisible());}},this.logError);},fetchChartData:function(r,i,s,E){var t=this;try{var u=this.oConfig.EVALUATION.ODATA_URL;var a=this.oConfig.EVALUATION.ODATA_ENTITYSET;t.setThresholdValues();if(this.oConfig.TILE_PROPERTIES.semanticMeasure){var m=this.oConfig.EVALUATION.COLUMN_NAME+","+this.oConfig.TILE_PROPERTIES.semanticMeasure;}else{var m=this.oConfig.EVALUATION.COLUMN_NAME;}var b=null;var d=this.oConfig.TILE_PROPERTIES.dimension;this.oConfig.EVALUATION_VALUES;var c=sap.ushell.components.tiles.indicatorTileUtils.util.getBoolValue(r);var f=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);var g=t.oTileApi.configuration.getParameterValueAsString("timeStamp");var h=sap.ushell.components.tiles.indicatorTileUtils.util.isCacheValid(t.oConfig.TILE_PROPERTIES.id,g,t.chipCacheTime,t.chipCacheTimeUnit,t.tilePressed);if(!f||(!h&&t.oTileApi.visible.isVisible())||c||(i&&t.oTileApi.visible.isVisible())||t.getView().getViewData().refresh){if(t.kpiValueFetchDeferred){t.kpiValueFetchDeferred=false;var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);var o={};o["0"]=m+",asc";o["1"]=m+",desc";o["2"]=d+",asc";o["3"]=d+",desc";var j=o[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");var k=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oRunTimeODataModel,a,m,d,v,3);if(this.oConfig.TILE_PROPERTIES.semanticMeasure){k.uri+="&$top=3&$orderby="+j[0]+" "+j[2];}else{k.uri+="&$top=3&$orderby="+j[0]+" "+j[1];}this.comparisionChartODataRef=k.model.read(k.uri,null,null,true,function(p){t.kpiValueFetchDeferred=true;var w={};if(p&&p.results&&p.results.length){if(k.unit[0]){t._updateTileModel({unit:p.results[0][k.unit[0].name]});b=k.unit[0].name;w.unit=k.unit[0];w.unit.name=k.unit[0].name;}d=sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(t.oTileApi.url.addSystemToServiceUrl(u),a,d);w.dimension=d;t.oConfig.TILE_PROPERTIES.FINALVALUE=p;t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,m.split(",")[0],d,b);w.data=t.oConfig.TILE_PROPERTIES.FINALVALUE;w.isCurM=t.isACurrencyMeasure(t.oConfig.EVALUATION.COLUMN_NAME);if(k.unit[0]){if(w&&w.data&&w.data.length){w.data[0][k.unit[0].name]=p.results[0][k.unit[0].name];}}var q={};t.cacheTime=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();q.ChipId=t.oConfig.TILE_PROPERTIES.id;q.Data=JSON.stringify(w);q.CacheMaxAge=Number(t.chipCacheTime);q.CacheMaxAgeUnit=t.chipCacheTimeUnit;q.CacheType=1;var x=t.getLocalCache(q);t.updateDatajobScheduled=false;var y=t.oConfig.TILE_PROPERTIES.id+"data";var z=sap.ushell.components.tiles.indicatorTileUtils.util.getScheduledJob(y);if(z){clearTimeout(z);z=undefined;}if(!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,x);var U=false;if(f){U=true;}if(t.chipCacheTime){sap.ushell.components.tiles.indicatorTileUtils.util.writeFrontendCacheByChipAndUserId(t.oTileApi,t.oConfig.TILE_PROPERTIES.id,q,U,function(p){if(p){t.cacheTime=p&&p.CachedTime;sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,p);}if(t.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){jQuery.proxy(t.setTimeStamp(t.cacheTime),t);}});}}else{var A=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(A){if(!A.CachedTime){A.CachedTime=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();}var B=A.Data;if(B){B=JSON.parse(B);if(t.oKpiTileView.getViewName()=="tiles.indicatornumeric.NumericTile"){B.leftData=w;}else{B.rightData=w;}}A.Data=JSON.stringify(B);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,A);}else{var B={};B.rightData=w;x.Data=JSON.stringify(B);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,x);}t.cacheWriteData=w;}s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(p.results.length==0){t.oConfig.TILE_PROPERTIES.FINALVALUE=p;if(sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id)){w=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);w.data=p;}else{w.data=p;}sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,w);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);t.setNoData();}else{sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,{empty:"empty"});t.setNoData();}},function(p){t.kpiValueFetchDeferred=true;if(p&&p.response){jQuery.sap.log.error(p.message+" : "+p.request.requestUri);E.call(t,p);}});}}else{if(f&&f.Data){var l;var n=t.oConfig&&t.oConfig.TILE_PROPERTIES&&t.oConfig.TILE_PROPERTIES.tileType;if(n.indexOf("DT-")==-1){l=f.Data&&JSON.parse(f.Data);}else{l=f.Data&&JSON.parse(f.Data);l=l.rightData;}t.cacheTime=f.CachedTime;if(t.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){jQuery.proxy(t.setTimeStamp(t.cacheTime),t);}if(l.data&&l.data.length){if(l.unit){t._updateTileModel({unit:l.data[0][l.unit.name]});}d=l.dimension;t.oConfig.TILE_PROPERTIES.FINALVALUE=l.data;s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(l&&l.data&&l.data instanceof Array&&l.data.length==0){t.oConfig.TILE_PROPERTIES.FINALVALUE=l.data;s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);t.setNoData();}else{t.setNoData();}}else{t.setNoData();}}}catch(e){t.kpiValueFetchDeferred=true;E.call(t,e);}},_processDataForComparisonChart:function(d,m,a,u){var s=this.oConfig.TILE_PROPERTIES.semanticColorContribution;var f=[];var t;var b;for(var i=0;i<d.results.length;i++){var g=d.results[i];var h={};try{h.title=g[a].toString();}catch(e){h.title="";}h.value=Number(g[m]);var j=Number(g[m]);if(this.oConfig.EVALUATION.SCALING==-2){j*=100;}var c=this.isCurrencyMeasure(m);b=g[u];t=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(j,this.oConfig.EVALUATION.SCALING,this.oConfig.EVALUATION.DECIMAL_PRECISION,c,b);h.displayValue=t.toString();if(typeof s==='undefined'){h.color="Neutral";}else{h.color=s;}if(h&&u){h[u]=b;}f.push(h);}return f;},doDummyProcess:function(){var t=this;t.setTextInTile();t._updateTileModel({value:8888,size:sap.suite.ui.commons.InfoTileSize.Auto,frameType:sap.suite.ui.commons.FrameType.OneByOne,state:sap.suite.ui.commons.LoadState.Loading,valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,indicator:sap.suite.ui.commons.DeviationIndicator.None,title:"US Profit Margin",footer:"Current Quarter",description:"Maximum deviation",data:[{title:"Americas",value:10,color:"Neutral"},{title:"EMEA",value:50,color:"Neutral"},{title:"APAC",value:-20,color:"Neutral"}]});this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);}});}());
