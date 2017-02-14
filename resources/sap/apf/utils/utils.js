/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.utils');jQuery.sap.require('sap.ui.core.format.DateFormat');(function(){'use strict';var f;sap.apf.utils.renderHeaderOfTextPropertyFile=function(a,m){var t=a.toLowerCase();var c=/^[0-9a-f]+$/;var i=c.test(t);if(!i||a.length!==32){m.putMessage(m.createMessageObject({code:"5409",aParameters:[a]}));t="<please enter valid translation uuid, if you want to upload into a SAP translation system>";}else{t=t.substring(0,8)+'-'+t.substring(8,12)+'-'+t.substring(12,16)+'-'+t.substring(16,20)+'-'+t.substring(20);}return"#FIORI: insert Fiori-Id\n"+"# __ldi.translation.uuid="+t+"\n"+"#ApfApplicationId="+a+"\n\n";};sap.apf.utils.getUriParameters=function(){return jQuery.sap.getUriParameters().mParams;};sap.apf.utils.renderTextEntries=function(h,m){f=false;var k=h.getKeys();k.sort(function(a,b){var v=h.getItem(a);var c=h.getItem(b);if(v.LastChangeUTCDateTime<c.LastChangeUTCDateTime){return-1;}if(v.LastChangeUTCDateTime>c.LastChangeUTCDateTime){return 1;}return 0;});var l=k.length;var r='';var i;for(i=0;i<l;i++){r=r+sap.apf.utils.renderEntryOfTextPropertyFile(h.getItem(k[i]),m);}return r;};sap.apf.utils.renderEntryOfTextPropertyFile=function(t,m){var d,D;if(!f&&(!t.TextElementType||!t.MaximumLength)){f=true;m.putMessage(m.createMessageObject({code:"5408",aParameters:[t.TextElement]}));}var e="#"+(t.TextElementType||"<Add text type>")+","+(t.MaximumLength||"<Add maximum length>");if(t.TranslationHint&&t.TranslationHint!==""){e=e+':'+t.TranslationHint;}e=e+"\n"+t.TextElement+"="+t.TextElementDescription+"\n";var o=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"yyyy/MM/dd HH:mm:ss"});if(t.LastChangeUTCDateTime&&t.LastChangeUTCDateTime!==""){d=t.LastChangeUTCDateTime.replace(/\/Date\(/,'').replace(/\)\//,'');D=new Date(parseInt(d,10));}else{D=new Date();}e=e+"# LastChangeDate="+o.format(D)+'\n\n';return e;};sap.apf.utils.eliminateDuplicatesInArray=function(m,w){m.check((w!==undefined&&typeof w==='object'&&w.hasOwnProperty('length')===true),'Error - aArray is undefined');var r=[];var i,j;for(i=0;i<w.length;i++){for(j=i+1;j<w.length;j++){if(w[i]===w[j]){j=++i;}}r.push(w[i]);}return r;};sap.apf.utils.hashCode=function(v){var n=0;var i;var a=0;v=v.toString();var l=v.length;for(i=0;i<l;i++){a=v.charCodeAt(i);n=(17*n+a)<<0;}return n;};sap.apf.utils.escapeOdata=function(v){if(typeof v==="string"){return v.replace("'","''");}return v;};sap.apf.utils.json2javascriptFormat=function(v,t){var i;switch(t){case"Edm.Boolean":if(typeof v==="boolean"){return v;}if(typeof v==="string"){return v.toLowerCase()==="true";}return false;case"Edm.Decimal":case"Edm.Guid":case"Edm.Int64":case"Edm.String":return v;case"Edm.Int16":case"Edm.Int32":return parseInt(v,10);case"Edm.Single":case"Edm.Float":return parseFloat(v);case"Edm.Time":return v;case"Edm.DateTime":i=v.replace('/Date(','').replace(')/','');i=parseFloat(i);return new Date(i);case"Edm.DateTimeOffset":i=v.replace('/Date(','');i=i.replace(')/','');i=parseFloat(i);return new Date(i);default:return v;}return v;};sap.apf.utils.formatValue=function(a,t){function c(v){var b;if(v instanceof Date){return v;}if(typeof v==='string'){if(v.substring(0,6)==='/Date('){b=v.replace('/Date(','');b=b.replace(')/','');b=parseInt(b,10);return new Date(b);}return new Date(v);}}var d;var F="";if(a===null||a===undefined){return"null";}switch(t){case"Edm.String":F="'"+String(a).replace(/'/g,"''")+"'";break;case"Edm.Time":if(typeof a==='number'){d=new Date();d.setTime(a);var h=d.getUTCHours();if(h<10){h='0'+h;}var m=d.getUTCMinutes();if(m<10){m='0'+m;}var s=d.getUTCSeconds();if(s<10){s='0'+s;}F="time'"+h+':'+m+':'+s+"'";}else{F="time'"+a+"'";}break;case"Edm.DateTime":if(!sap.apf.utils.formatValue.oDateTimeFormat){sap.apf.utils.formatValue.oDateTimeFormat=sap.ui.core.format.DateFormat.getDateInstance({pattern:"'datetime'''yyyy-MM-dd'T'HH:mm:ss''"});}d=c(a);F=sap.apf.utils.formatValue.oDateTimeFormat.format(d,true);break;case"Edm.DateTimeOffset":if(!sap.apf.utils.formatValue.oDateTimeOffsetFormat){sap.apf.utils.formatValue.oDateTimeOffsetFormat=sap.ui.core.format.DateFormat.getDateInstance({pattern:"'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''"});}d=c(a);F=sap.apf.utils.formatValue.oDateTimeOffsetFormat.format(d,true);break;case"Edm.Guid":F="guid'"+a+"'";break;case"Edm.Decimal":F=a+"M";break;case"Edm.Int64":F=String(a)+"L";break;case"Edm.Single":F=a+"f";break;case"Edm.Binary":F="binary'"+a+"'";break;default:F=a;break;}return F;};sap.apf.utils.extractFunctionFromModulePathString=function(F){if(jQuery.isFunction(F)){return F;}var d,n,s;n=F.split('.');d=window;var i;for(i=0;i<n.length-1;i++){d=d[n[i]];if(!d){return undefined;}}s=n[n.length-1];return d[s];};sap.apf.utils.isValidGuid=function(a){return/^[0-9A-F]{32}$/.test(a);};sap.apf.utils.isValidPseudoGuid=function(a){return/^[0-9A-F]{32}$/.test(a);};sap.apf.utils.createPseudoGuid=function(l){if(!l){l=32;}var a=Date.now().toString();var d=l-a.length;a+=g(d);return a;};function g(l){var r="";var a,m;while(r.length<l){a=Math.min(10,l-r.length);m=Math.pow(10,a);r+=Math.floor((Math.random()*m));}return r;}sap.apf.utils.migrateConfigToCategoryStepAssignment=function(a,i){var H=(i.constructors&&i.constructors.Hashtable)||sap.apf.utils.Hashtable;var c=new H(i.instances.messageHandler);if(a.steps){a.steps.forEach(function(s){if(s.categories){s.categories.forEach(function(b){var d=c.getItem(b.id);if(!d){d={category:b.id,steps:[{type:"step",id:s.id}]};c.setItem(b.id,d);}else{d.steps.push({type:"step",id:s.id});}});delete s.categories;}});}if(a.categories){a.categories.forEach(function(b){if(!b.steps){var d=c.getItem(b.id);if(d){b.steps=d.steps;}else{b.steps=[];}}});}};sap.apf.utils.executeFilterMapping=function(i,m,t,c,M){m.sendGetInBatch(i,a);function a(r){var F;if(r&&r.type&&r.type==="messageObject"){M.putMessage(r);c(undefined,r);}else{F=new sap.apf.core.utils.Filter(M);r.data.forEach(function(d){var o=new sap.apf.core.utils.Filter(M);t.forEach(function(T){o.addAnd(new sap.apf.core.utils.Filter(M,T,sap.apf.core.constants.FilterOperators.EQ,d[T]));});F.addOr(o);});c(F,undefined);}}};sap.apf.utils.getComponentNameFromManifest=function(m){var n;if(m["sap.ui5"]&&m["sap.ui5"].componentName){n=m["sap.ui5"].componentName;}else{n=m["sap.app"].id;}if(n.search('Component')>-1){return n;}return n+'.Component';};sap.apf.utils.validateSelectedValues=function(s,a){var r={valid:[],invalid:[]};if(!s||!jQuery.isArray(s)||s.length===0){return r;}if(!a||!jQuery.isArray(a)||a.length===0){r.invalid=s;return r;}s.forEach(function(b){if(jQuery.inArray(b,a)===-1){r.invalid.push(b);}else{r.valid.push(b);}});return r;};sap.apf.utils.extractPathnameFromUrl=function(u){var e='a';var p;var a=document.createElement(e);a.href=u;if(a.pathname){p=a.pathname;if(p&&p[0]!=='/'){p='/'+p;}return p;}return u;};sap.apf.utils.extractOdataErrorResponse=function(r){var a;if(typeof r==='string'){a=JSON.parse(r);}else{a=r;}var m=(a&&a.error&&a.error.message&&a.error.message.value)||(a&&a.error&&a.error.message&&a.error.message)||r;if(a&&a.error&&a.error.innererror&&a.error.innererror.errordetails){m=m+'\n';a.error.innererror.errordetails.forEach(function(d){m=m+d.message+'\n';});}else if(a&&a.error&&a.error.details){m=m+'\n';a.error.details.forEach(function(d){m=m+d.message+'\n';});}return m;};}());
