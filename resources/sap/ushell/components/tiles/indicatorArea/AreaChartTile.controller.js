(function(){"use strict";jQuery.sap.require("sap.ushell.components.tiles.generic");sap.ushell.components.tiles.generic.extend("sap.ushell.components.tiles.indicatorArea.AreaChartTile",{onInit:function(){this.KPI_VALUE_REQUIRED=false;},doProcess:function(r,i){this.onAfterFinalEvaluation(r,i);},scheduleJob:function(d){if(this.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(this.oConfig)){sap.ushell.components.tiles.indicatorTileUtils.util.scheduleFetchDataJob.call(this,this.oTileApi.visible.isVisible());}},onAfterFinalEvaluation:function(r,d){var t=this;var u=this.DEFINITION_DATA.EVALUATION.ODATA_URL;var E=this.DEFINITION_DATA.EVALUATION.ODATA_ENTITYSET;var m=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.DEFINITION_DATA.EVALUATION_FILTERS,this.DEFINITION_DATA.ADDITIONAL_FILTERS);var f=this.DEFINITION_DATA.TILE_PROPERTIES.dimension;if(f==undefined){this.logError();return;}var g=this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;var h=this.DEFINITION_DATA.EVALUATION_VALUES;var j=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);var k=t.oTileApi.configuration.getParameterValueAsString("timeStamp");var l=sap.ushell.components.tiles.indicatorTileUtils.util.isCacheValid(t.oConfig.TILE_PROPERTIES.id,k,t.chipCacheTime,t.chipCacheTimeUnit,t.tilePressed);var n=m;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE=="MEASURE"){switch(g){case"MI":t.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");t.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");if(t.sWarningHigh&&t.sCriticalHigh&&t.sTarget){n+=","+t.sWarningHigh+","+t.sCriticalHigh+","+t.sTarget;}break;case"MA":t.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");t.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");if(t.sWarningLow&&t.sCriticalLow&&t.sTarget){n+=","+t.sWarningLow+","+t.sCriticalLow+","+t.sTarget;}break;case"RA":t.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");t.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");t.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");t.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");if(t.sWarningLow&&t.sCriticalLow&&t.sTarget&&t.sWarningHigh&&t.sCriticalHigh){n+=","+t.sWarningLow+","+t.sCriticalLow+","+t.sTarget+","+t.sWarningHigh+","+t.sCriticalHigh;}break;}}var o=sap.ushell.components.tiles.indicatorTileUtils.util.getBoolValue(r);if(!j||(!l&&t.oTileApi.visible.isVisible())||o||(d&&t.oTileApi.visible.isVisible())||t.getView().getViewData().refresh){if(t.kpiValueFetchDeferred){t.kpiValueFetchDeferred=false;var q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oTileApi.url.addSystemToServiceUrl(u),E,n,f,v);if(q){this.queryUriForTrendChart=q.uri;var w={};try{this.trendChartODataReadRef=q.model.read(q.uri,null,null,true,function(a){t.kpiValueFetchDeferred=true;if(a&&a.results&&a.results.length){if(q.unit[0]){t.unit=a.results[0][q.unit[0].name];t.CURRENCY_CODE=t.unit;w.unit=q.unit[0];w.unit.name=q.unit[0].name;}t.queryUriResponseForTrendChart=a;f=sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(t.oTileApi.url.addSystemToServiceUrl(u),E,f);a.results.splice(3);a.firstXlabel=a.results[0][f];a.lastXlabel=a.results[a.results.length-1][f];w.data=a;if(w&&w.data&&w.data.results&&w.data.results.length){for(var i=0;i<w.data.results.length;i++){delete w.data.results[i].__metadata;}}w.isCurM=t.isCurrencyMeasure(t.oConfig.EVALUATION.COLUMN_NAME);w.dimensionName=f;_(a,t.DEFINITION_DATA.EVALUATION.VALUES_SOURCE);var c={};t.cacheTime=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();c.ChipId=t.oConfig.TILE_PROPERTIES.id;c.Data=JSON.stringify(w);c.CacheMaxAge=Number(t.chipCacheTime);c.CacheMaxAgeUnit=t.chipCacheTimeUnit;c.CacheType=1;var b=t.getLocalCache(c);if(t.DEFINITION_DATA.TILE_PROPERTIES.frameType==sap.suite.ui.commons.FrameType.TwoByOne){var x=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(x){if(!x.CachedTime){x.CachedTime=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();}var y=x.Data;if(y){y=JSON.parse(y);y.rightData=w;}x.Data=JSON.stringify(y);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,x);}else{var y={};y.rightData=w;b.Data=JSON.stringify(y);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,b);}t.cacheWriteData=w;t.getView().getViewData().deferredObj.resolve();}else{sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,b);var U=false;if(j){U=true;}if(t.chipCacheTime){sap.ushell.components.tiles.indicatorTileUtils.util.writeFrontendCacheByChipAndUserId(t.oTileApi,t.oConfig.TILE_PROPERTIES.id,c,U,function(a){if(a){t.cacheTime=a&&a.CachedTime;sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,a);t.setTimeStamp();}if(t.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){jQuery.proxy(t.setTimeStamp(t.cacheTime),t);}});}var z=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);t.oKpiTileView.oGenericTile.$().wrap("<a href ='"+z+"'/>");t.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);t.updateDatajobScheduled=false;var A=t.oConfig.TILE_PROPERTIES.id+"data";var B=sap.ushell.components.tiles.indicatorTileUtils.util.getScheduledJob(A);if(B){clearTimeout(B);B=undefined;}jQuery.proxy(t.scheduleJob(t.cacheTime),t);}}else{t.setNoData();}},function(a){t.kpiValueFetchDeferred=true;if(a&&a.response){t.logError("Data call failed");}});}catch(e){t.kpiValueFetchDeferred=true;t.logError(e);}}else{t.kpiValueFetchDeferred=true;t.logError();}}}else{if(j&&j.Data){try{var p;var s=t.oConfig&&t.oConfig.TILE_PROPERTIES&&t.oConfig.TILE_PROPERTIES.tileType;if(s.indexOf("DT-")==-1){p=j.Data&&JSON.parse(j.Data);}else{p=j.Data&&JSON.parse(j.Data);p=p.rightData;}if(p.unit){t.unit=p.data.results[0][p.unit.name];t.CURRENCY_CODE=t.unit;}t.cacheTime=j.CachedTime;if(t.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){jQuery.proxy(t.setTimeStamp(t.cacheTime),t);}t.queryUriResponseForTrendChart=p.data;f=p.dimensionName;_(p.data,t.DEFINITION_DATA.EVALUATION.VALUES_SOURCE);if(t.oConfig.TILE_PROPERTIES.frameType==sap.suite.ui.commons.FrameType.OneByOne){t.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);}else{t.getView().getViewData().deferredObj.resolve();}jQuery.proxy(t.scheduleJob(t.cacheTime),t);}catch(e){t.logError(e);}}else{t.setNoData();}}function _(x,y){var z=[];var A=[];var B=[];var C=[];var D=[];var F=[];var G=x.firstXlabel;var H,I,J,K,L;var M=x.lastXlabel;var N=Number(x.results[0][m]);var O=Number(x.results[x.results.length-1][m]);var i;for(i in x.results){x.results[i][f]=Number(i);x.results[i][m]=Number(x.results[i][m]);t.sWarningHigh?x.results[i][t.sWarningHigh]=Number(x.results[i][t.sWarningHigh]):"";t.sCriticalHigh?x.results[i][t.sCriticalHigh]=Number(x.results[i][t.sCriticalHigh]):"";t.sCriticalLow?x.results[i][t.sCriticalLow]=Number(x.results[i][t.sCriticalLow]):"";t.sWarningLow?x.results[i][t.sWarningLow]=Number(x.results[i][t.sWarningLow]):"";t.sTarget?x.results[i][t.sTarget]=Number(x.results[i][t.sTarget]):"";t.sWarningHigh?B.push(x.results[i][t.sWarningHigh]):"";t.sCriticalHigh?C.push(x.results[i][t.sCriticalHigh]):"";t.sCriticalLow?D.push(x.results[i][t.sCriticalLow]):"";t.sWarningLow?F.push(x.results[i][t.sWarningLow]):"";z.push(x.results[i][f]);A.push(x.results[i][m]);}try{G=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(G);M=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(M);}catch(e){t.logError(e);}var P=Number(N);if(t.oConfig.EVALUATION.SCALING==-2){P*=100;}var Q=Math.min.apply(Math,A);var c=t.isCurrencyMeasure(t.oConfig.EVALUATION.COLUMN_NAME);var R=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(P,t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION,c,t.CURRENCY_CODE);if(t.oConfig.EVALUATION.SCALING==-2){R+=" %";}var S=R.toString();var T=Number(O);if(t.oConfig.EVALUATION.SCALING==-2){T*=100;}var U=Math.max.apply(Math,A);c=t.isCurrencyMeasure(t.oConfig.EVALUATION.COLUMN_NAME);var V=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(T,t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION,c,t.CURRENCY_CODE);if(t.oConfig.EVALUATION.SCALING==-2){V+=" %";}var W=V.toString();try{var X=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(Math.min.apply(Math,z));var Y=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(Math.max.apply(Math,z));}catch(e){t.logError(e);}if(y=="MEASURE"){(B.length!=0)?(t.firstwH=B[X])&&(t.lastwH=B[Y]):"";(C.length!=0)?(t.firstcH=C[X])&&(t.lastcH=C[Y]):"";(D.length!=0)?(t.firstcL=D[X])&&(t.lastcL=D[Y]):"";(F.length!=0)?(t.firstwL=F[X])&&(t.lastwL=F[Y]):"";}var Z={width:"100%",height:"100%",unit:t.unit||"",chart:{color:"Neutral",data:x.results},size:"Auto",minXValue:X,maxXValue:Y,minYValue:Q,maxYValue:U,firstXLabel:{label:G+"",color:"Neutral"},lastXLabel:{label:M+"",color:"Neutral"},firstYLabel:{label:S+"",color:"Neutral"},lastYLabel:{label:W+"",color:"Neutral"},minLabel:{},maxLabel:{}};switch(g){case"MA":for(i in h){if(h[i].TYPE=="CL"){Z.minThreshold={color:"Error"};var $={};$[f]="";$[m]=Number(h[i].FIXED);t.cl=Number(h[i].FIXED);Z.minThreshold.data=(y=="MEASURE")?x.results:[$];H=(y=="MEASURE")?t.sCriticalLow:m;}else if(h[i].TYPE=="WL"){Z.maxThreshold={color:"Good"};var $={};$[f]="";$[m]=Number(h[i].FIXED);Z.maxThreshold.data=(y=="MEASURE")?x.results:[$];I=(y=="MEASURE")?t.sWarningLow:m;t.wl=Number(h[i].FIXED);}else if(h[i].TYPE=="TA"){var $={};$[f]="";$[m]=Number(h[i].FIXED);Z.target={color:"Neutral"};Z.target.data=(y=="MEASURE")?x.results:[$];L=(y=="MEASURE")?t.sTarget:m;}}Z.innerMinThreshold={data:[]};Z.innerMaxThreshold={data:[]};if(y=="FIXED"){Z.firstYLabel.color=N<t.cl?"Error":((t.cl<=N)&&(N<=t.wl))?"Critical":(N>t.wl)?"Good":"Neutral";Z.lastYLabel.color=O<t.cl?"Error":((t.cl<=O)&&(O<=t.wl))?"Critical":(O>t.wl)?"Good":"Neutral";}else if(y=="MEASURE"&&t.firstwL&&t.lastwL&&t.firstcL&&t.lastcL){Z.firstYLabel.color=N<t.firstcL?"Error":((t.firstcL<=N)&&(N<=t.firstwL))?"Critical":(N>t.firstwL)?"Good":"Neutral";Z.lastYLabel.color=O<t.lastcL?"Error":((t.lastcL<=O)&&(O<=t.lastwL))?"Critical":(O>t.lastwL)?"Good":"Neutral";}break;case"MI":for(i in h){if(h[i].TYPE=="CH"){var $={};$[f]="";$[m]=Number(h[i].FIXED);t.ch=Number(h[i].FIXED);Z.maxThreshold={color:"Error"};Z.maxThreshold.data=(y=="MEASURE")?x.results:[$];I=(y=="MEASURE")?t.sCriticalHigh:m;}else if(h[i].TYPE=="WH"){var $={};$[f]="";$[m]=Number(h[i].FIXED);t.wh=Number(h[i].FIXED);Z.minThreshold={color:"Good"};Z.minThreshold.data=(y=="MEASURE")?x.results:[$];H=(y=="MEASURE")?t.sWarningHigh:m;}else if(h[i].TYPE=="TA"){var $={};$[f]="";$[m]=Number(h[i].FIXED);Z.target={color:"Neutral"};Z.target.data=(y=="MEASURE")?x.results:[$];L=(y=="MEASURE")?t.sTarget:m;}}if(y=="FIXED"){Z.firstYLabel.color=N>t.ch?"Error":((t.wh<=N)&&(N<=t.ch))?"Critical":(N<t.wh)?"Good":"Neutral";Z.lastYLabel.color=O>t.ch?"Error":((t.wh<=O)&&(O<=t.ch))?"Critical":(O<t.wh)?"Good":"Neutral";}else if(y=="MEASURE"&&t.firstwH&&t.lastwH&&t.firstcH&&t.lastcH){Z.firstYLabel.color=N>t.firstcH?"Error":((t.firstwH<=N)&&(N<=t.firstcH))?"Critical":(N<t.firstwH)?"Good":"Neutral";Z.lastYLabel.color=O>t.lastcH?"Error":((t.lastwH<=O)&&(O<=t.lastcH))?"Critical":(O<t.lastwH)?"Good":"Neutral";}Z.innerMaxThreshold={data:[]};Z.innerMinThreshold={data:[]};break;case"RA":for(i in h){if(h[i].TYPE=="CH"){var $={};$[f]="";$[m]=Number(h[i].FIXED);t.ch=Number(h[i].FIXED);Z.maxThreshold={color:"Error"};Z.maxThreshold.data=(y=="MEASURE")?x.results:[$];I=(y=="MEASURE")?t.sCriticalHigh:m;}else if(h[i].TYPE=="WH"){var $={};$[f]="";$[m]=Number(h[i].FIXED);t.wh=Number(h[i].FIXED);Z.innerMaxThreshold={color:"Good"};Z.innerMaxThreshold.data=(y=="MEASURE")?x.results:[$];K=(y=="MEASURE")?t.sWarningHigh:m;}else if(h[i].TYPE=="WL"){var $={};$[f]="";$[m]=Number(h[i].FIXED);t.wl=Number(h[i].FIXED);Z.innerMinThreshold={color:"Good"};Z.innerMinThreshold.data=(y=="MEASURE")?x.results:[$];J=(y=="MEASURE")?t.sWarningLow:m;}else if(h[i].TYPE=="CL"){var $={};$[f]="";$[m]=Number(h[i].FIXED);t.cl=Number(h[i].FIXED);Z.minThreshold={color:"Error"};Z.minThreshold.data=(y=="MEASURE")?x.results:[$];H=(y=="MEASURE")?t.sCriticalLow:m;}else if(h[i].TYPE=="TA"){var $={};$[f]="";$[m]=Number(h[i].FIXED);Z.target={color:"Neutral"};Z.target.data=(y=="MEASURE")?x.results:[$];L=(y=="MEASURE")?t.sTarget:m;}}if(y=="FIXED"){Z.firstYLabel.color=(N>t.ch||N<t.cl)?"Error":((t.wh<=N)&&(N<=t.ch))||((t.cl<=N)&&(N<=t.wl))?"Critical":((N>=t.wl)&&(N<=t.wh))?"Good":"Neutral";Z.lastYLabel.color=(O>t.ch||O<t.cl)?"Error":((t.wh<=O)&&(O<=t.ch))||((t.cl<=O)&&(O<=t.wl))?"Critical":((O>=t.wl)&&(O<=t.wh))?"Good":"Neutral";}else if(y=="MEASURE"&&t.firstwL&&t.lastwL&&t.firstcL&&t.lastcL&&t.firstwH&&t.lastwH&&t.firstcH&&t.lastcH){Z.firstYLabel.color=(N>t.firstcH||N<t.firstcL)?"Error":((t.firstwH<=N)&&(N<=t.firstcH))||((t.firstcL<=N)&&(N<=t.firstwL))?"Critical":((N>=t.firstwL)&&(N<=t.firstwH))?"Good":"Neutral";Z.lastYLabel.color=(O>t.lastcH||O<t.lastcL)?"Error":((t.lastwH<=O)&&(O<=t.lastcH))||((t.lastcL<=O)&&(O<=t.lastwL))?"Critical":((O>=t.lastwL)&&(O<=t.lastwH))?"Good":"Neutral";}break;}var a1=function(c1,a,b,y){return new sap.suite.ui.commons.MicroAreaChartItem({color:"{/"+c1+"/color}",points:{path:"/"+c1+"/data",template:new sap.suite.ui.commons.MicroAreaChartPoint({x:"{"+a+"}",y:"{"+b+"}"})}});};var b1=t.getView().oNVConfContS;b1.setTarget(a1("target",f,L));b1.setInnerMinThreshold(a1("innerMinThreshold",f,J));b1.setInnerMaxThreshold(a1("innerMaxThreshold",f,K));b1.setMinThreshold(a1("minThreshold",f,H));b1.setMaxThreshold(a1("maxThreshold",f,I));b1.setChart(a1("chart",f,m));t.setTextInTile();if(t.getView().getViewData().parentController){t.getView().getViewData().parentController._updateTileModel(Z);}else{t._updateTileModel(Z);}}},doDummyProcess:function(){var t=this;this.setTextInTile();t._updateTileModel({footer:"",description:"",width:"100%",height:"100%",chart:{color:"Good",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:20},{day:100,balance:80}]},target:{color:"Error",data:[{day:0,balance:0},{day:30,balance:30},{day:60,balance:40},{day:100,balance:90}]},maxThreshold:{color:"Good",data:[{day:0,balance:0},{day:30,balance:40},{day:60,balance:50},{day:100,balance:100}]},innerMaxThreshold:{color:"Error",data:[]},innerMinThreshold:{color:"Neutral",data:[]},minThreshold:{color:"Error",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:30},{day:100,balance:70}]},minXValue:0,maxXValue:100,minYValue:0,maxYValue:100,firstXLabel:{label:"June 123",color:"Error"},lastXLabel:{label:"June 30",color:"Error"},firstYLabel:{label:"0M",color:"Good"},lastYLabel:{label:"80M",color:"Critical"},minLabel:{},maxLabel:{}});this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);}});}());