sap.ui.define(["sap/ui/base/Object","./AnnotationHelper","sap/ui/model/odata/AnnotationHelper","sap/ui/model/Context"],function(B,Q,O,C){"use strict";var a=B.extend("sap.suite.ui.generic.template.js.QuickTemplates.ODataModelHelper");a.createKeyFromPath=function(s,t,T){try{var b=a.parseEntityKeysFromContextPath(s);var c=a.getKeyInfoForEntitySet(t,T);if(c.entitySet===b.entitySet&&b.keys.length===c.keys.length){if(s.startsWith("/")){return s.substring(1);}return s;}var r=""+c.entitySet+"(";jQuery.each(c.keys,function(i,d){if(!d.mapped){jQuery.each(b.keys,function(j,f){if(f.property===d.property&&f.type===d.type){d.value=f.value;d.mapped=true;return false;}return true;});}if(!d.mapped){jQuery.each(b.keys,function(j,f){var g=f.property.toLowerCase();var h=d.property.toLowerCase();if(h.indexOf(g)>=0&&f.type===d.type){d.value=f.value;d.mapped=true;return false;}return true;});}if(!d.mapped){jQuery.each(b.keys,function(j,f){if(f.property===d.property){if(f.type==="Edm.String"&&d.type!=="Edm.String"){d.value=f.value.substring(1,f.value.length-1);}else if(f.type!=="Edm.String"&&d.type==="Edm.String"){d.value="'"+f.value+"'";}else{d.value=f.value;}d.mapped=true;return false;}return true;});}if(!d.mapped){jQuery.each(b.keys,function(j,f){if(f.type===d.type){d.value=f.value;d.mapped=true;return false;}return true;});}r+=d.property+"="+d.value;if(i<c.keys.length-1){r+=",";}});r+=")";return r;}catch(e){if(s&&s.startsWith("/")){return s.substring(1);}return s;}};a.parseEntityKeysFromContextPath=function(p){var b=p;var r={entitySet:"",keys:[]};if(!b){return r;}if(b.startsWith("/")){b=b.substring(1);}var c=b.split("(");if(c.length>1){r.entitySet=c[0];var k=c[1].split(")")[0];if(k){var d=k.split(",");jQuery.each(d,function(i,e){if(e){var f=e.split("=");var g={};if(f.length==1){g.value=f[0];g.property="";}else if(f.length==2){g.property=f[0];g.value=f[1];}if(g.value){if(g.value.indexOf("guid")==0&&g.value.length==42){g.type="Edm.Guid";}else if(g.value.charAt(0)==="'"&&g.value.charAt(g.value.length-1)==="'"){g.type="Edm.String";}else if(g.value=="true"||g.value=="false"){g.type="Edm.Boolean";}else if(jQuery.isNumeric(g.value)){g.type="Edm.Int";}else{g.type="";}r.keys.push(g);}}});}}return r;};a.getKeyInfoForEntitySet=function(m,e){var r={entitySet:"",keys:[]};var k={};if(m&&e){var b=m.getODataEntitySet(e);r.entitySet=b.name;var c=m.getODataEntityType(b.entityType);jQuery.each(c.key.propertyRef,function(i,p){k[p.name]="1";});jQuery.each(c.property,function(i,p){if(k[p.name]){var d={property:p.name,value:a.getDefaultKeyValueForProperty(p),type:(p.type.indexOf("Edm.Int")>=0?"Edm.Int":p.type)};r.keys.push(d);}});}return r;};a.getDefaultKeyValueForProperty=function(p){if(p.name.indexOf("IsActive")>=0&&p.type==="Edm.Boolean"){return"true";}else{switch(p.type){case"Edm.String":{return"''";}case"Edm.Guid":{return"guid'00000000-0000-0000-0000-000000000000'";}case"Edm.Boolean":{return"false";}default:{if(p.type.indexOf("Int")>=0){return"0";}return"''";}}}};a.initializeObjectProperties=function(o,p,c){var t=[];var k=o.getModel().getKey(o.getObject());var b=o.getModel().oData[k];if(b){t.push(b);}var d=o.getModel().mChangedEntities[k];if(d){t.push(d);}var e=Q.getMetaDataForContext(o);var i=0;if(p&&Array.isArray(p)){jQuery.each(p,function(f,g){var h=g.split("/");var j=h[0];var l=null;if(h.length>1){l=h.slice(1).join("/");}if(jQuery.isNumeric(j)&&l){a.initializeObjectProperties(o,[l],c);return;}i=0;var m=false;if(e.entityType.navigationProperty){for(;i<e.entityType.navigationProperty.length;i++){if(e.entityType.navigationProperty[i].name===j){m=true;break;}}}if(!m){jQuery.each(t,function(i,q){q[j]="";});}else if(!b[j]){var n=o.getModel().createEntry(o.getPath()+"/"+j,c);b[j]={__deferred:{}};a.restoreNavigationPropertyReferences(o,j,n);if(l){a.initializeObjectProperties(n,[l],c);}}});}};a.restoreLineItemReferences=function(e,c){var i=Q.createFormatterInterface(c);var m=Q.getMetaModelContextForFacetType(i,e,"LineItem");if(m){var s=O.getNavigationPath(m);s=s.replace(/[{}]/g,'');a.restoreNavigationPropertyReferences(c,s);}};a.restoreNavigationPropertyReferences=function(p,n,c){if(!n){return;}if(!p.getObject()){return;}var m=p.getModel().getMetaModel();var o=p.getModel().getKey(p.getObject());var b=p.getModel().oData[o];var e=m.getODataEntityType(b.__metadata.type);var N=m.getODataAssociationEnd(e,n);var s=null;var E=m.getProperty(m.getODataEntityContainer(N.type)).entitySet;jQuery.each(E,function(i,g){if(g.entityType===N.type){s=g.name;}});if(!b[n]){b[n]={};}if(b[n].__list){b[n].__list=[];}var d=function(k){if(b[n].__deferred){delete b[n].__deferred;}if(N.multiplicity==="*"){if(!b[n].__list){b[n].__list=[];}b[n].__list.push(k);}else{b[n].__ref=k;}};if(!c){var f=Object.keys(p.getModel().oData);jQuery.each(f,function(i,k){if(k.indexOf(s)>=0){d(k);}});}else{var k=c.getPath().substring(1);d(k);}};a.findObjects=function(){var p,b,c;if(arguments.length===3){p=arguments[0];b=arguments[1];c=arguments[2];}else if(arguments.length==2){b=arguments[0];c=arguments[1];}var k=c.key||undefined,m=c.matchCallback||undefined,n=c.noMatchCallback||undefined,d=c.maxNestedLevel||3;var e=true;if(!d){d=3;}if(!a.findObjects._recursionCount){a.findObjects._recursionCount=0;}a.findObjects._recursionCount++;if(a.findObjects._recursionCount>d){a.findObjects._recursionCount--;return;}var f=function(o){var s=Object.prototype.toString.call(o);return(s==='[object Array]'||s==='[object Object]');};var h=Object.prototype.hasOwnProperty.bind(b);if(b){for(var i in b){if(h(i)){var I=f(b[i]);if(b[i]&&I){b[i].__nestedKey=i;}e=true;if(i===k&&m){e=m(p,b,b[i]);}else if(n){e=n(p,b,b[i]);}if(e&&I){a.findObjects(b,b[i],{key:k,matchCallback:m,noMatchCallback:n,maxNestedLevel:d});}if(b[i]&&I){delete b[i].__nestedKey;}}}}a.findObjects._recursionCount--;};return a;},true);