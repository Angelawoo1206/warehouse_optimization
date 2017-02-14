// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";sap.ui.getCore().loadLibrary("sap.m");jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.ui.thirdparty.datajs");jQuery.sap.require("sap.ushell.components.tiles.utils");sap.ui.controller("sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",{timer:null,oDataRequest:null,_getConfiguration:function(){var v=this.getView().getViewData(),c={};c.configuration=v.configuration;c.properties=v.properties;c.properties.info=c.properties.info||"";c.properties.number_value='...';c.properties.number_value_state='Neutral';c.properties.number_state_arrow='None';c.properties.number_factor='';c.properties.number_unit='';var s=c.configuration["sap-system"];var t=c.properties.targetURL;if(t&&s){t+=((t.indexOf("?")<0)?"?":"&")+"sap-system="+s;c.properties.targetURL=t;}return c;},onInit:function(){var v=this.getView();var m=new sap.ui.model.json.JSONModel();m.setData(this._getConfiguration());v.setModel(m);this.initUpdateDynamicData();},refreshHandler:function(){this.loadData(0);},visibleHandler:function(i){if(i){if(!this.oDataRequest){this.refreshHandler(this);}}else{this.stopRequests();}},updateVisualPropertiesHandler:function(n){var p=this.getView().getModel().getProperty("/properties");var c=false;if(typeof n.title!=='undefined'){p.title=n.title;c=true;}if(typeof n.subtitle!=='undefined'){p.subtitle=n.subtitle;c=true;}if(typeof n.icon!=='undefined'){p.icon=n.icon;c=true;}if(c){this.getView().getModel().setProperty("/properties",p);}},stopRequests:function(){if(this.timer){clearTimeout(this.timer);}if(this.oDataRequest){try{this.oDataRequest.abort();}catch(e){jQuery.sap.log.warning(e.name,e.message);}}},onPress:function(){var t=this.getView().getModel().getProperty("/properties/targetURL");if(!t){return;}else if(t[0]==='#'){hasher.setHash(t);}else{window.open(t,'_blank');}},initUpdateDynamicData:function(){var v=this.getView(),s=v.getModel().getProperty("/configuration/serviceUrl"),S=v.getModel().getProperty("/configuration/serviceRefreshInterval");if(!S){S=0;}else if(S<10){jQuery.sap.log.warning("Refresh Interval "+S+" seconds for service URL "+s+" is less than 10 seconds, which is not supported. Increased to 10 seconds automatically.",null,"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile.controller");S=10;}if(s){this.loadData(S);}},extractData:function(d){var n,k=["results","icon","title","number","numberUnit","info","infoState","infoStatus","targetParams","subtitle","stateArrow","numberState","numberDigits","numberFactor"];if(typeof d==="object"&&Object.keys(d).length===1){n=Object.keys(d)[0];if(jQuery.inArray(n,k)===-1){return d[n];}}return d;},successHandleFn:function(r){var c=this.getView().getModel().getProperty("/configuration");var d=r;this.oDataRequest=undefined;if(typeof r==="object"){var u=jQuery.sap.getUriParameters(c.serviceUrl).get("$inlinecount");if(u&&u==="allpages"){d={number:r.__count};}else{d=this.extractData(d);}}else if(typeof r==="string"){d={number:r};}this.updatePropertiesHandler(d);},errorHandlerFn:function(m){this.oDataRequest=undefined;var M=m&&m.message?m.message:m,r=sap.ushell.components.tiles.utils.getResourceBundleModel().getResourceBundle(),u=this.getView().getModel().getProperty("/configuration/serviceUrl");if(m.response){M+=" - "+m.response.statusCode+" "+m.response.statusText;}jQuery.sap.log.error("Failed to update data via service "+u+": "+M,null,"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile");this.updatePropertiesHandler({number:"???",info:r.getText("dynamic_data.error")});},loadData:function(s){var u=this.getView().getModel().getProperty("/configuration/serviceUrl");if(!u){return;}if(s>0){jQuery.sap.log.info("Wait "+s+" seconds before calling "+u+" again",null,"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile.controller");this.timer=setTimeout(this.loadData.bind(this,s,false),(s*1000));}if(!this.oDataRequest){this.oDataRequest=OData.read({requestUri:u,headers:{"Cache-Control":"no-cache, no-store, must-revalidate","Pragma":"no-cache","Expires":"0"}},this.successHandleFn.bind(this),this.errorHandlerFn.bind(this));}},onExit:function(){this.stopRequests();},addParamsToUrl:function(u,t){var p="",U=u.indexOf("?")!==-1,i;if(t&&t.length>0){for(i=0;i<t.length;i=i+1){p+=t[i];if(i<t.length-1){p+="&";}}}if(p.length>0){if(!U){u+="?";}else{u+="&";}u+=p;}return u;},_normalizeNumber:function(n,m,a,N){var b;if(isNaN(n)){b=n;}else{var o=sap.ui.core.format.NumberFormat.getFloatInstance({maxFractionDigits:N});if(!a){if(n>=1000000000){a='B';n/=1000000000;}else if(n>=1000000){a='M';n/=1000000;}else if(n>=1000){a='K';n/=1000;}}b=o.format(n);}var d=b;var c=d[m-1];m-=(c==='.'||c===',')?1:0;d=d.substring(0,m);return{displayNumber:d,numberFactor:a};},updatePropertiesHandler:function(d){var a=0,i,n,c,C,p=this.getView().getModel().getProperty("/properties"),u={title:d.title||p.title||"",subtitle:d.subtitle||p.subtitle||"",icon:d.icon||p.icon||"",info:d.info||p.info||"",targetURL:d.targetURL||p.targetURL||"",number_value:!isNaN(d.number)?d.number:"...",number_digits:d.numberDigits>=0?d.numberDigits:4,number_unit:d.numberUnit||p.number_unit||"",number_state_arrow:d.stateArrow||p.number_state_arrow||"None",number_value_state:d.numberState||p.number_value_state||"Neutral",number_factor:d.numberFactor||p.number_factor||""};var t=[];if(d.targetParams){t.push(d.targetParams);}if(d.results){for(i=0,n=d.results.length;i<n;i=i+1){c=d.results[i].number||0;if(typeof c==="string"){c=parseInt(c,10);}a=a+c;C=d.results[i].targetParams;if(C){t.push(C);}}u.number_value=a;}if(t.length>0){u.targetURL=this.addParamsToUrl(u.targetURL,t);}if(!isNaN(d.number)){if(typeof d.number==="string"){d.number=d.number.trim();}jQuery.sap.require("sap.ui.core.format.NumberFormat");var s=this._shouldProcessDigits(d.number,d.numberDigits),m=u.icon?4:5;if(d.number&&d.number.length>=m||s){var N=this._normalizeNumber(d.number,m,d.numberFactor,d.numberDigits);u.number_factor=N.numberFactor;u.number_value=N.displayNumber;}else{var o=sap.ui.core.format.NumberFormat.getFloatInstance({maxFractionDigits:m});u.number_value=o.format(d.number);}}if(u.number_value_state){switch(u.number_value_state){case"Positive":u.number_value_state="Good";break;case"Negative":u.number_value_state="Error";break;}}this.getView().getModel().setProperty("/properties",u);},_shouldProcessDigits:function(d,D){var n;d=typeof(d)!=='string'?d.toString():d;if(d.indexOf('.')!==-1){n=d.split(".")[1].length;if(n>D){return true;}}return false;}});}());
