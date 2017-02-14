(function(){"use strict";sap.ui.controller("tiles.indicatorDualTrend.DualTrend",{onInit:function(){var t=this;this.firstTimeVisible=false;this.oDualTrendView=this.getView();this.oViewData=this.oDualTrendView.getViewData();this.oTileApi=this.oViewData.chip;if(this.oTileApi.visible){this.oTileApi.visible.attachVisible(this.visibleHandler.bind(this));}this.system=this.oTileApi.url.getApplicationSystem();this.oDualTrendView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loading);if(this.oTileApi.preview.isEnabled()){this.setTextInTile();this._updateTileModel({value:8888,size:sap.suite.ui.commons.InfoTileSize.Auto,frameType:"TwoByOne",state:sap.suite.ui.commons.LoadState.Loading,valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,indicator:sap.suite.ui.commons.DeviationIndicator.None,title:"Liquidity Structure",footer:"Current Quarter",description:"Apr 1st 2013 (B$)",width:"100%",height:"100%",chart:{color:"Good",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:20},{day:100,balance:80}]},target:{color:"Error",data:[{day:0,balance:0},{day:30,balance:30},{day:60,balance:40},{day:100,balance:90}]},maxThreshold:{color:"Good",data:[{day:0,balance:0},{day:30,balance:40},{day:60,balance:50},{day:100,balance:100}]},innerMaxThreshold:{color:"Error",data:[]},innerMinThreshold:{color:"Neutral",data:[]},minThreshold:{color:"Error",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:30},{day:100,balance:70}]},minXValue:0,maxXValue:100,minYValue:0,maxYValue:100,firstXLabel:{label:"June 123",color:"Error"},lastXLabel:{label:"June 30",color:"Error"},firstYLabel:{label:"0M",color:"Good"},lastYLabel:{label:"80M",color:"Critical"},minLabel:{},maxLabel:{}});this.oDualTrendView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);}else{try{sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(this.oTileApi.configuration.getParameterValueAsString("tileConfiguration"),function(c){t.oConfig=c;t.setTextInTile();t.oDualTrendView.oGenericTile.attachPress(function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(t.trendChartODataReadRef);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,null);window.location.hash=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);});if(Number(t.oTileApi.configuration.getParameterValueAsString("isSufficient"))){sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();}else{t.flowWithDesignTimeCall();}});}catch(e){this.logError(e);}}},getTile:function(){return this.oDualTrendView.oGenericTile;},_setLocalModelToTile:function(){if(!this.getTile().getModel()){this.getTile().setModel(new sap.ui.model.json.JSONModel({}));}},_updateTileModel:function(n){var m=this.getTile().getModel().getData();jQuery.extend(m,n);this.getTile().getModel().setData(m);},setThresholdValues:function(){var t=this;try{var T={};T.fullyFormedMeasure=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE=="MEASURE"){switch(this.DEFINITION_DATA.EVALUATION.GOAL_TYPE){case"MI":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"MA":T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"RA":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;}}else{T.criticalHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","FIXED");T.criticalLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","FIXED");T.warningHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","FIXED");T.warningLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","FIXED");T.targetValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","FIXED");T.trendValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","FIXED");}return T;}catch(e){t.logError(e);}},getTrendIndicator:function(t,v){var a=this;t=Number(t);try{var b=sap.suite.ui.commons.DeviationIndicator.None;if(t>v){b=sap.suite.ui.commons.DeviationIndicator.Down;}else if(t<v){b=sap.suite.ui.commons.DeviationIndicator.Up;}return b;}catch(e){a.logError(e);}},formSelectStatement:function(o){var t=Object.keys(o);var f="";for(var i=0;i<t.length;i++){if((o[t[i]]!==undefined)&&(o.fullyFormedMeasure)){f+=","+o[t[i]];}}return f;},getTrendColor:function(t){var a=this;try{var i=this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;var r=sap.suite.ui.commons.InfoTileValueColor.Neutral;if(i==="MI"){if(t.criticalHighValue&&t.warningHighValue){t.criticalHighValue=Number(t.criticalHighValue);t.warningHighValue=Number(t.warningHighValue);if(this.CALCULATED_KPI_VALUE<t.warningHighValue){r=sap.suite.ui.commons.InfoTileValueColor.Good;}else if(this.CALCULATED_KPI_VALUE<=t.criticalHighValue){r=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{r=sap.suite.ui.commons.InfoTileValueColor.Error;}}}else if(i==="MA"){if(t.criticalLowValue&&t.warningLowValue){t.criticalLowValue=Number(t.criticalLowValue);t.warningLowValue=Number(t.warningLowValue);if(this.CALCULATED_KPI_VALUE<t.criticalLowValue){r=sap.suite.ui.commons.InfoTileValueColor.Error;}else if(this.CALCULATED_KPI_VALUE<=t.warningLowValue){r=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{r=sap.suite.ui.commons.InfoTileValueColor.Good;}}}else{if(t.warningLowValue&&t.warningHighValue&&t.criticalLowValue&&t.criticalHighValue){t.criticalHighValue=Number(t.criticalHighValue);t.warningHighValue=Number(t.warningHighValue);t.warningLowValue=Number(t.warningLowValue);t.criticalLowValue=Number(t.criticalLowValue);if(this.CALCULATED_KPI_VALUE<t.criticalLowValue||this.CALCULATED_KPI_VALUE>t.criticalHighValue){r=sap.suite.ui.commons.InfoTileValueColor.Error;}else if((this.CALCULATED_KPI_VALUE>=t.criticalLowValue&&this.CALCULATED_KPI_VALUE<=t.warningLowValue)||(this.CALCULATED_KPI_VALUE>=t.warningHighValue&&this.CALCULATED_KPI_VALUE<=t.criticalHighValue)){r=sap.suite.ui.commons.InfoTileValueColor.Critical;}else{r=sap.suite.ui.commons.InfoTileValueColor.Good;}}}return r;}catch(e){a.logError(e);}},onAfterFinalEvaluation:function(){var t=this;var u=this.DEFINITION_DATA.EVALUATION.ODATA_URL;var E=this.DEFINITION_DATA.EVALUATION.ODATA_ENTITYSET;var m=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.DEFINITION_DATA.EVALUATION_FILTERS,this.DEFINITION_DATA.ADDITIONAL_FILTERS);var d=this.DEFINITION_DATA.TILE_PROPERTIES.dimension;if(d==undefined){this.logError();return;}var g=this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;var c=this.DEFINITION_DATA.EVALUATION_VALUES;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE=="MEASURE"){var f=m;switch(g){case"MI":t.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");t.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");if(t.sWarningHigh&&t.sCriticalHigh&&t.sTarget){f+=","+t.sWarningHigh+","+t.sCriticalHigh+","+t.sTarget;}break;case"MA":t.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");t.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");if(t.sWarningLow&&t.sCriticalLow&&t.sTarget){f+=","+t.sWarningLow+","+t.sCriticalLow+","+t.sTarget;}break;case"RA":t.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");t.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");t.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");t.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");if(t.sWarningLow&&t.sCriticalLow&&t.sTarget&&t.sWarningHigh&&t.sCriticalHigh){f+=","+t.sWarningLow+","+t.sCriticalLow+","+t.sTarget+","+t.sWarningHigh+","+t.sCriticalHigh;}break;}var q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oTileApi.url.addSystemToServiceUrl(u),E,f,d,v);}else{var q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oTileApi.url.addSystemToServiceUrl(u),E,m,d,v);}var h=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(!h){if(q){this.queryUriForTrendChart=q.uri;t.writeData={};try{this.trendChartODataReadRef=q.model.read(q.uri,null,null,true,function(a){if(a&&a.results&&a.results.length){if(q.unit[0]){t.unit=a.results[0][q.unit[0].name];t.writeData.unit=q.unit[0];t.writeData.unit.name=q.unit[0].name;}t.queryUriResponseForTrendChart=a;d=sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(t.oTileApi.url.addSystemToServiceUrl(u),E,d);a.firstXlabel=a.results[0][d];a.lastXlabel=a.results[a.results.length-1][d];t.writeData.data=a;t.writeData.dimensionName=d;sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);var n=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);t.oDualTrendView.oGenericTile.$().wrap("<a href ='"+n+"'/>");t.oDualTrendView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);_(a,t.DEFINITION_DATA.EVALUATION.VALUES_SOURCE);}else{t.logError("no Response from QueryServiceUri");}},function(a){if(a&&a.response){t.logError("Data call failed");}});}catch(e){t.logError(e);}}else{t.logError();}var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(t.DEFINITION_DATA.EVALUATION_FILTERS,t.DEFINITION_DATA.ADDITIONAL_FILTERS);var q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oTileApi.url.addSystemToServiceUrl(u),E,m,null,v);if(q){t.QUERY_SERVICE_MODEL=q.model;t.queryUriForKpiValue=q.uri;t.numericODataReadRef=t.QUERY_SERVICE_MODEL.read(q.uri,null,null,true,function(a){if(a&&a.results&&a.results.length){var s="";var j=a.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];t.writeData.numericData=a;if(t.oConfig.EVALUATION.SCALING==-2){j*=100;}s=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(j),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){t._updateTileModel({scale:"%"});}var k=t.getTrendIndicator(t.setThresholdValues().trendValue,j);t._updateTileModel({value:s.toString(),valueColor:t.getTrendColor(t.setThresholdValues()),indicator:k});}else{fnError.call(t,"no Response from QueryServiceUri");}});}}else{try{if(h.unit!==undefined){t.unit=h.data.results[0][h.unit.name];}t.queryUriResponseForTrendChart=h.data;d=h.dimensionName;var j=h.numericData.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];var k=t.getTrendIndicator(t.setThresholdValues().trendValue,h.data.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME]);var s=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(j),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);t.oDualTrendView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);_(h.data,t.DEFINITION_DATA.EVALUATION.VALUES_SOURCE);t._updateTileModel({value:s.toString(),valueColor:t.getTrendColor(t.setThresholdValues()),indicator:k});}catch(e){t.logError(e);}}function _(l,n){var o=[];var p=[];var w=[];var r=[];var x=[];var y=[];var z=l.firstXlabel;var A,B,C,D,F;var G=l.lastXlabel;var H=Number(l.results[0][m]);var I=Number(l.results[l.results.length-1][m]);var i;for(i in l.results){l.results[i][d]=Number(i);l.results[i][m]=Number(l.results[i][m]);t.sWarningHigh?l.results[i][t.sWarningHigh]=Number(l.results[i][t.sWarningHigh]):"";t.sCriticalHigh?l.results[i][t.sCriticalHigh]=Number(l.results[i][t.sCriticalHigh]):"";t.sCriticalLow?l.results[i][t.sCriticalLow]=Number(l.results[i][t.sCriticalLow]):"";t.sWarningLow?l.results[i][t.sWarningLow]=Number(l.results[i][t.sWarningLow]):"";t.sTarget?l.results[i][t.sTarget]=Number(l.results[i][t.sTarget]):"";t.sWarningHigh?w.push(l.results[i][t.sWarningHigh]):"";t.sCriticalHigh?r.push(l.results[i][t.sCriticalHigh]):"";t.sCriticalLow?x.push(l.results[i][t.sCriticalLow]):"";t.sWarningLow?y.push(l.results[i][t.sWarningLow]):"";o.push(l.results[i][d]);p.push(l.results[i][m]);}try{z=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(z);G=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(G);}catch(e){t.logError(e);}var J=Number(H);if(t.oConfig.EVALUATION.SCALING==-2){J*=100;}var K=Math.min.apply(Math,p);var L=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(J,t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){L+=" %";}var M=L.toString();var N=Number(I);if(t.oConfig.EVALUATION.SCALING==-2){N*=100;}var O=Math.max.apply(Math,p);var P=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(N,t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){P+=" %";}var Q=P.toString();try{var R=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(Math.min.apply(Math,o));var S=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(Math.max.apply(Math,o));}catch(e){t.logError(e);}if(n=="MEASURE"){(w.length!=0)?(t.firstwH=w[R])&&(t.lastwH=w[S]):"";(r.length!=0)?(t.firstcH=r[R])&&(t.lastcH=r[S]):"";(x.length!=0)?(t.firstcL=x[R])&&(t.lastcL=x[S]):"";(y.length!=0)?(t.firstwL=y[R])&&(t.lastwL=y[S]):"";}var T={width:"100%",height:"100%",unit:t.unit||"",chart:{color:"Neutral",data:l.results},size:"Auto",minXValue:R,maxXValue:S,minYValue:K,maxYValue:O,firstXLabel:{label:z+"",color:"Neutral"},lastXLabel:{label:G+"",color:"Neutral"},firstYLabel:{label:M+"",color:"Neutral"},lastYLabel:{label:Q+"",color:"Neutral"},minLabel:{},maxLabel:{}};switch(g){case"MA":for(i in c){if(c[i].TYPE=="CL"){T.minThreshold={color:"Error"};var U={};U[d]="";U[m]=Number(c[i].FIXED);t.cl=Number(c[i].FIXED);T.minThreshold.data=(n=="MEASURE")?l.results:[U];A=(n=="MEASURE")?t.sCriticalLow:m;}else if(c[i].TYPE=="WL"){T.maxThreshold={color:"Good"};var U={};U[d]="";U[m]=Number(c[i].FIXED);T.maxThreshold.data=(n=="MEASURE")?l.results:[U];B=(n=="MEASURE")?t.sWarningLow:m;t.wl=Number(c[i].FIXED);}else if(c[i].TYPE=="TA"){var U={};U[d]="";U[m]=Number(c[i].FIXED);T.target={color:"Neutral"};T.target.data=(n=="MEASURE")?l.results:[U];F=(n=="MEASURE")?t.sTarget:m;}}T.innerMinThreshold={data:[]};T.innerMaxThreshold={data:[]};if(n=="FIXED"){T.firstYLabel.color=H<t.cl?"Error":((t.cl<=H)&&(H<=t.wl))?"Critical":(H>t.wl)?"Good":"Neutral";T.lastYLabel.color=I<t.cl?"Error":((t.cl<=I)&&(I<=t.wl))?"Critical":(I>t.wl)?"Good":"Neutral";}else if(n=="MEASURE"&&t.firstwL&&t.lastwL&&t.firstcL&&t.lastcL){T.firstYLabel.color=H<t.firstcL?"Error":((t.firstcL<=H)&&(H<=t.firstwL))?"Critical":(H>t.firstwL)?"Good":"Neutral";T.lastYLabel.color=I<t.lastcL?"Error":((t.lastcL<=I)&&(I<=t.lastwL))?"Critical":(I>t.lastwL)?"Good":"Neutral";}break;case"MI":for(i in c){if(c[i].TYPE=="CH"){var U={};U[d]="";U[m]=Number(c[i].FIXED);t.ch=Number(c[i].FIXED);T.maxThreshold={color:"Error"};T.maxThreshold.data=(n=="MEASURE")?l.results:[U];B=(n=="MEASURE")?t.sCriticalHigh:m;}else if(c[i].TYPE=="WH"){var U={};U[d]="";U[m]=Number(c[i].FIXED);t.wh=Number(c[i].FIXED);T.minThreshold={color:"Good"};T.minThreshold.data=(n=="MEASURE")?l.results:[U];A=(n=="MEASURE")?t.sWarningHigh:m;}else if(c[i].TYPE=="TA"){var U={};U[d]="";U[m]=Number(c[i].FIXED);T.target={color:"Neutral"};T.target.data=(n=="MEASURE")?l.results:[U];F=(n=="MEASURE")?t.sTarget:m;}}if(n=="FIXED"){T.firstYLabel.color=H>t.ch?"Error":((t.wh<=H)&&(H<=t.ch))?"Critical":(H<t.wh)?"Good":"Neutral";T.lastYLabel.color=I>t.ch?"Error":((t.wh<=I)&&(I<=t.ch))?"Critical":(I<t.wh)?"Good":"Neutral";}else if(n=="MEASURE"&&t.firstwH&&t.lastwH&&t.firstcH&&t.lastcH){T.firstYLabel.color=H>t.firstcH?"Error":((t.firstwH<=H)&&(H<=t.firstcH))?"Critical":(H<t.firstwH)?"Good":"Neutral";T.lastYLabel.color=I>t.lastcH?"Error":((t.lastwH<=I)&&(I<=t.lastcH))?"Critical":(I<t.lastwH)?"Good":"Neutral";}T.innerMaxThreshold={data:[]};T.innerMinThreshold={data:[]};break;case"RA":for(i in c){if(c[i].TYPE=="CH"){var U={};U[d]="";U[m]=Number(c[i].FIXED);t.ch=Number(c[i].FIXED);T.maxThreshold={color:"Error"};T.maxThreshold.data=(n=="MEASURE")?l.results:[U];B=(n=="MEASURE")?t.sCriticalHigh:m;}else if(c[i].TYPE=="WH"){var U={};U[d]="";U[m]=Number(c[i].FIXED);t.wh=Number(c[i].FIXED);T.innerMaxThreshold={color:"Good"};T.innerMaxThreshold.data=(n=="MEASURE")?l.results:[U];D=(n=="MEASURE")?t.sWarningHigh:m;}else if(c[i].TYPE=="WL"){var U={};U[d]="";U[m]=Number(c[i].FIXED);t.wl=Number(c[i].FIXED);T.innerMinThreshold={color:"Good"};T.innerMinThreshold.data=(n=="MEASURE")?l.results:[U];C=(n=="MEASURE")?t.sWarningLow:m;}else if(c[i].TYPE=="CL"){var U={};U[d]="";U[m]=Number(c[i].FIXED);t.cl=Number(c[i].FIXED);T.minThreshold={color:"Error"};T.minThreshold.data=(n=="MEASURE")?l.results:[U];A=(n=="MEASURE")?t.sCriticalLow:m;}else if(c[i].TYPE=="TA"){var U={};U[d]="";U[m]=Number(c[i].FIXED);T.target={color:"Neutral"};T.target.data=(n=="MEASURE")?l.results:[U];F=(n=="MEASURE")?t.sTarget:m;}}if(n=="FIXED"){T.firstYLabel.color=(H>t.ch||H<t.cl)?"Error":((t.wh<=H)&&(H<=t.ch))||((t.cl<=H)&&(H<=t.wl))?"Critical":((H>=t.wl)&&(H<=t.wh))?"Good":"Neutral";T.lastYLabel.color=(I>t.ch||I<t.cl)?"Error":((t.wh<=I)&&(I<=t.ch))||((t.cl<=I)&&(I<=t.wl))?"Critical":((I>=t.wl)&&(I<=t.wh))?"Good":"Neutral";}else if(n=="MEASURE"&&t.firstwL&&t.lastwL&&t.firstcL&&t.lastcL&&t.firstwH&&t.lastwH&&t.firstcH&&t.lastcH){T.firstYLabel.color=(H>t.firstcH||H<t.firstcL)?"Error":((t.firstwH<=H)&&(H<=t.firstcH))||((t.firstcL<=H)&&(H<=t.firstwL))?"Critical":((H>=t.firstwL)&&(H<=t.firstwH))?"Good":"Neutral";T.lastYLabel.color=(I>t.lastcH||I<t.lastcL)?"Error":((t.lastwH<=I)&&(I<=t.lastcH))||((t.lastcL<=I)&&(I<=t.lastwL))?"Critical":((I>=t.lastwL)&&(I<=t.lastwH))?"Good":"Neutral";}break;}var V=function(W,a,b,n){return new sap.suite.ui.commons.MicroAreaChartItem({color:"{/"+W+"/color}",points:{path:"/"+W+"/data",template:new sap.suite.ui.commons.MicroAreaChartPoint({x:"{"+a+"}",y:"{"+b+"}"})}});};t.getTile().getTileContent()[1].getContent().setTarget(V("target",d,F));t.getTile().getTileContent()[1].getContent().setInnerMinThreshold(V("innerMinThreshold",d,C));t.getTile().getTileContent()[1].getContent().setInnerMaxThreshold(V("innerMaxThreshold",d,D));t.getTile().getTileContent()[1].getContent().setMinThreshold(V("minThreshold",d,A));t.getTile().getTileContent()[1].getContent().setMaxThreshold(V("maxThreshold",d,B));t.getTile().getTileContent()[1].getContent().setChart(V("chart",d,m));t._updateTileModel(T);}},flowWithoutDesignTimeCall:function(){this.DEFINITION_DATA=this.oConfig;this._updateTileModel(this.DEFINITION_DATA);if(this.oTileApi.visible.isVisible()&&!this.firstTimeVisible){this.firstTimeVisible=true;}this.onAfterFinalEvaluation();},flowWithDesignTimeCall:function(){var t=this;try{var a=sap.ushell.components.tiles.indicatorTileUtils.cache.getEvaluationById(this.oConfig.EVALUATION.ID);if(a){t.oConfig.EVALUATION_FILTERS=a.EVALUATION_FILTERS;t.flowWithoutDesignTimeCall();}else{sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(this.oConfig,function(f){t.oConfig.EVALUATION_FILTERS=f;sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();});}}catch(e){this.logError(e);}},setTextInTile:function(){var t=this;this._updateTileModel({header:t.oTileApi.preview.getTitle()||sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(t.oConfig),subheader:t.oTileApi.preview.getDescription()||sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(t.oConfig)});},logError:function(e){this.oDualTrendView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);this.oDualTrendView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);sap.ushell.components.tiles.indicatorTileUtils.util.logError(e);},refreshHandler:function(c){if(!c.firstTimeVisible){if(Number(this.oTileApi.configuration.getParameterValueAsString("isSufficient"))){c.flowWithoutDesignTimeCall();}else{c.flowWithDesignTimeCall();}}},visibleHandler:function(i){if(!i){this.firstTimeVisible=false;sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.trendChartODataReadRef);}if(i){this.refreshHandler(this);}},onExit:function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.trendChartODataReadRef);}});}());
