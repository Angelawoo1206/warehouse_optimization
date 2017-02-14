sap.ui.controller("tiles.indicatorDualContribution.DualContribution",{onInit:function(){var t=this;t.writeData={};this.firstTimeVisible=false;this.oDualContributionView=this.getView();this.oChip=this.oDualContributionView.getViewData().chip;if(this.oChip.visible){this.oChip.visible.attachVisible(this.visibleHandler.bind(this));}this.system=this.oChip.url.getApplicationSystem();this.oDualContributionView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loading);try{sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(this.oChip.configuration.getParameterValueAsString("tileConfiguration"),function(c){t.oConfig=c;if(t.oChip.preview){t.oChip.preview.setTargetUrl(sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system));}if(t.oChip.preview.isEnabled()){t.setTitle();t._updateTileModel({value:8888,size:sap.suite.ui.commons.InfoTileSize.Auto,frameType:"TwoByOne",state:sap.suite.ui.commons.LoadState.Loading,valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,indicator:sap.suite.ui.commons.DeviationIndicator.None,title:"US Profit Margin",footer:"Current Quarter",description:"Maximum deviation",data:[{title:"Americas",value:10,color:"Neutral",displayValue:""},{title:"EMEA",value:50,color:"Neutral",displayValue:""},{title:"APAC",value:-20,color:"Neutral",displayValue:""}]});t.oDualContributionView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);}else{t.oConfig.TILE_PROPERTIES.FINALVALUE;t.setTitle();t.oDualContributionView.oGenericTile.attachPress(function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(t.comparisionChartODataRef);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,null);window.location.hash=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);});if(Number(t.oChip.configuration.getParameterValueAsString("isSufficient"))){sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();}else{t.flowWithDesignTimeCall();}}});}catch(e){this.logError(e);}},getTile:function(){return this.oDualContributionView.oGenericTile;},setTitle:function(){var t=this;var a=sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.oChip);this._updateTileModel({header:a.title||sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(t.oConfig),subheader:a.subTitle||sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(t.oConfig)});},_updateTileModel:function(n){var m=this.getTile().getModel().getData();jQuery.extend(m,n);this.getTile().getModel().setData(m);this.getTile().getModel().updateBindings();},flowWithoutDesignTimeCall:function(){var t=this;this.DEFINITION_DATA=this.oConfig;this._updateTileModel(this.DEFINITION_DATA);if(this.oChip.visible.isVisible()&&!this.firstTimeVisible){this.firstTimeVisible=true;this.fetchKpiValue(function(k,c){this.CALCULATED_KPI_VALUE=k;if(t.oConfig.TILE_PROPERTIES.frameType=="TwoByOne"){t.oDualContributionView.oGenericTile.setFrameType("TwoByOne");t.oDualContributionView.oGenericTile.removeAllTileContent();t.oDualContributionView.oGenericTile.addTileContent(t.oDualContributionView.oNumericTile);t.oDualContributionView.oGenericTile.addTileContent(t.oDualContributionView.oComparisonTile);}else{t.oDualContributionView.oGenericTile.setFrameType("OneByOne");t.oDualContributionView.oGenericTile.removeAllTileContent();t.oDualContributionView.oGenericTile.addTileContent(t.oDualContributionView.oComparisonTile);}var d=this.CALCULATED_KPI_VALUE;var a=this.DEFINITION_DATA.TILE_PROPERTIES.semanticColorContribution;for(var i=0;i<this.CALCULATED_KPI_VALUE.length;i++){d[i].color=a;}this._updateTileModel({data:d});var T=t.setThresholdValues();var n=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);t.oDualContributionView.oGenericTile.$().wrap("<a href ='"+n+"'/>");this.oDualContributionView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);var s="";if(a=="Error"){s="sb.error";}if(a=="Neutral"){s="sb.neutral";}if(a=="Critical"){s="sb.critical";}if(a=="Good"){s="sb.good";}var T=t.setThresholdValues();var m,b,e,v,f,g,h,j,l;if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[0]){m=this.CALCULATED_KPI_VALUE[0].title;v=this.CALCULATED_KPI_VALUE[0].value;h=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[0].color);}if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[1]){b=this.CALCULATED_KPI_VALUE[1].title;f=this.CALCULATED_KPI_VALUE[1].value;j=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[1].color);}if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[2]){e=this.CALCULATED_KPI_VALUE[2].title;g=this.CALCULATED_KPI_VALUE[2].value;l=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[2].color);}var o={status:s,actual:c,target:T.targetValue,cH:T.criticalHighValue,wH:T.warningHighValue,wL:T.warningLowValue,cL:T.criticalLowValue};var p={m1:m,v1:v,c1:h,m2:b,v2:f,c2:j,m3:e,v3:g,c3:l};var C=t.oDualContributionView.oGenericTile.getTileContent()[0].getContent();var q=t.oDualContributionView.oGenericTile.getTileContent()[1].getContent();sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(C,"NT",o);sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(q,"CONT",p);},this.logError);}},flowWithDesignTimeCall:function(){var t=this;try{var a=sap.ushell.components.tiles.indicatorTileUtils.cache.getEvaluationById(this.oConfig.EVALUATION.ID);if(a){t.oConfig.EVALUATION_FILTERS=a.EVALUATION_FILTERS;t.flowWithoutDesignTimeCall();}else{sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(this.oConfig,function(f){t.oConfig.EVALUATION_FILTERS=f;sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();});}}catch(e){this.logError(e);}},fetchKpiValue:function(s,E){var t=this;try{var u=this.oConfig.EVALUATION.ODATA_URL;var a=this.oConfig.EVALUATION.ODATA_ENTITYSET;if(this.oConfig.TILE_PROPERTIES.semanticMeasure){var m=this.oConfig.EVALUATION.COLUMN_NAME+","+this.oConfig.TILE_PROPERTIES.semanticMeasure;}else{var m=this.oConfig.EVALUATION.COLUMN_NAME;}var d=this.oConfig.TILE_PROPERTIES.dimension;var b=this.oConfig.EVALUATION_VALUES;var c=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(!c){var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);var o={};o["0"]=m+",asc";o["1"]=m+",desc";o["2"]=d+",asc";o["3"]=d+",desc";var f=o[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");var g=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oChip.url.addSystemToServiceUrl(u),a,m,d,v,3);if(this.oConfig.TILE_PROPERTIES.semanticMeasure){g.uri+="&$top=3&$orderby="+f[0]+" "+f[2];}else{g.uri+="&$top=3&$orderby="+f[0]+" "+f[1];}this.comparisionChartODataRef=g.model.read(g.uri,null,null,true,function(b){if(g.unit[0]){t._updateTileModel({unitContribution:b.results[0][g.unit[0].name]});t.writeData.unitContribution=g.unit[0];t.writeData.unitContribution.name=g.unit[0].name;}if(b&&b.results&&b.results.length){d=sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(t.oChip.url.addSystemToServiceUrl(u),a,d);t.writeData.dimension=d;t.oConfig.TILE_PROPERTIES.FINALVALUE=b;t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,m.split(",")[0],d);t.writeData.data=b;sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(b.results.length==0){t.oConfig.TILE_PROPERTIES.FINALVALUE=b;t.writeData.data=b;sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);}else{E.call(t,"no Response from QueryServiceUri");}},function(k){if(k&&k.response){jQuery.sap.log.error(k.message+" : "+k.request.requestUri);E.call(t,k);}});var h=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(t.DEFINITION_DATA.EVALUATION_FILTERS,t.DEFINITION_DATA.ADDITIONAL_FILTERS);var q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oChip.url.addSystemToServiceUrl(u),a,m,null,h);if(q){t.QUERY_SERVICE_MODEL=q.model;t.queryUriForKpiValue=q.uri;t.numericODataReadRef=t.QUERY_SERVICE_MODEL.read(q.uri,null,null,true,function(b){if(b&&b.results&&b.results.length){if(q.unit){t._updateTileModel({unitNumeric:b.results[0][q.unit.name]});t.writeData.unitNumeric=q.unit;t.writeData.unitNumeric.name=q.unit.name;}t.writeData.numericData=b;var S="";var i=b.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];var j=t.getTrendIndicator(t.setThresholdValues().trendValue,i);if(t.oConfig.EVALUATION.SCALING==-2){i*=100;t.getView().oNumericContent.setFormatterValue(false);}t.DEFINITION_DATA.value=i;S=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(i),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){t._updateTileModel({scale:"%"});}t._updateTileModel({value:S.toString(),valueColor:t.DEFINITION_DATA.TILE_PROPERTIES.semanticColorContribution,indicator:j});s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE,i);}else{E.call(t,"no Response from QueryServiceUri");}});}}else{var T=t.setThresholdValues();var i;if(c.unitContribution){t._updateTileModel({unitContribution:c.data.results[0][c.unitContribution.name]});}if(c.unitNumeric){t._updateTileModel({unitNumeric:c.numericData.results[0][c.unitNumeric.name]});}if(c.data&&c.data.results&&c.data.results.length){d=c.dimension;t.oConfig.TILE_PROPERTIES.FINALVALUE=c.data;t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,m.split(",")[0],d);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(b.results.length==0){t.oConfig.TILE_PROPERTIES.FINALVALUE=c.data;}else{E.call(t,"no Response from QueryServiceUri");}if(c.numericData&&c.numericData.results&&c.numericData.results.length){i=c.numericData.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];if(t.oConfig.EVALUATION.SCALING==-2){i*=100;t.getView().oNumericContent.setFormatterValue(false);}var S=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(i),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){t._updateTileModel({scale:"%"});}var j=t.getTrendIndicator(T.trendValue,i);t._updateTileModel({value:S.toString(),indicator:j,valueColor:t.DEFINITION_DATA.TILE_PROPERTIES.semanticColorContribution});s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE,i);}else{E.call(t,"no Response from QueryServiceUri");}}}catch(e){E.call(t,e);}},setThresholdValues:function(){var t=this;try{var T={};T.fullyFormedMeasure=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE=="MEASURE"){switch(this.DEFINITION_DATA.EVALUATION.GOAL_TYPE){case"MI":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"MA":T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"RA":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;}}else{T.criticalHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","FIXED");T.criticalLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","FIXED");T.warningHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","FIXED");T.warningLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","FIXED");T.targetValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","FIXED");T.trendValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","FIXED");}return T;}catch(e){t.logError(e);}},formSelectStatement:function(o){var t=Object.keys(o);var f="";for(var i=0;i<t.length;i++){if((o[t[i]]!==undefined)&&(o.fullyFormedMeasure)){f+=","+o[t[i]];}}return f;},getTrendIndicator:function(t,v){var a=this;t=Number(t);try{var b=sap.suite.ui.commons.DeviationIndicator.None;if(t>v){b=sap.suite.ui.commons.DeviationIndicator.Down;}else if(t<v){b=sap.suite.ui.commons.DeviationIndicator.Up;}return b;}catch(e){a.logError(e);}},_processDataForComparisonChart:function(d,m,a){var s=this.oConfig.TILE_PROPERTIES.semanticMeasure;var f=[];var t;for(var i=0;i<d.results.length;i++){var b=d.results[i];var c={};try{c.title=b[a].toString();}catch(e){c.title="";}c.value=Number(b[m]);var g=Number(b[m]);if(this.oConfig.EVALUATION.SCALING==-2){g*=100;}t=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(g,this.oConfig.EVALUATION.SCALING,this.oConfig.EVALUATION.DECIMAL_PRECISION);c.displayValue=t.toString();if(typeof s==='undefined'){c.color="Neutral";}else{if(this.oConfig.EVALUATION.GOAL_TYPE==="MA"){if(c.value>b[s]){c.color="Good";}else{c.color="Error";}}else if(this.oConfig.EVALUATION.GOAL_TYPE==="MI"){if(c.value<b[s]){c.color="Good";}else{c.color="Error";}}else{c.color="Neutral";}}f.push(c);}return f;},logError:function(e){this.oDualContributionView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);this.oDualContributionView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);sap.ushell.components.tiles.indicatorTileUtils.util.logError(e);},refreshHandler:function(c){if(!c.firstTimeVisible){if(Number(this.oChip.configuration.getParameterValueAsString("isSufficient"))){c.flowWithoutDesignTimeCall();}else{c.flowWithDesignTimeCall();}}},visibleHandler:function(i){if(!i){this.firstTimeVisible=false;sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);}if(i){this.refreshHandler(this);}},onExit:function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);}});
