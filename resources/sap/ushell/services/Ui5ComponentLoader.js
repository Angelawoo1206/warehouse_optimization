// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.services.Ui5ComponentLoader");var U=function(c){this._oComponent=c;};U.onBeforeApplicationInstanceCreated=function(){jQuery.sap.require("sap.ushell.Fiori20AdapterTest");};U.prototype.getInstance=function(){return this._oComponent;};U.prototype.getMetadata=function(){return this._oComponent.getMetadata();};sap.ushell.services.Ui5ComponentLoader=function(c,p,C){this._oConfig=(C&&C.config)||{};function g(u){var P=jQuery.sap.getUriParameters(u).mParams,x=P["sap-xapp-state"],r;delete P["sap-xapp-state"];r={startupParameters:P};if(x){r["sap-xapp-state"]=x;}return r;}this.createComponent=function(a,P,w){var d=new jQuery.Deferred(),s=window["sap-ui-debug"]===true?"sap/fiori/core-ext-light-dbg.js":"sap/fiori/core-ext-light.js",b=a&&a.url,o,l=true,e=jQuery.sap.isDeclared('sap.fiori.core',true)||jQuery.sap.isDeclared('sap.fiori.core-ext-light',true),L=true,A=a&&a.applicationDependencies||{},i,u,f,h=(this._oConfig&&this._oConfig.hasOwnProperty("amendedLoading"))?this._oConfig.amendedLoading:true,j=false;if(jQuery.isArray(A.messages)){A.messages.forEach(function(m){var S=String.prototype.toLowerCase.call(m.severity||"");S=["trace","debug","info","warning","error","fatal"].indexOf(S)!==-1?S:"error";jQuery.sap.log[S](m.text,m.details,A.name);});}if(a&&a.ui5ComponentName){o=jQuery.extend(true,{},a.applicationDependencies);f=jQuery.extend(true,{startupParameters:{}},a.componentData);if(b){i=b.indexOf("?");if(i>=0){u=g(b);f.startupParameters=u.startupParameters;if(u["sap-xapp-state"]){f["sap-xapp-state"]=u["sap-xapp-state"];}b=b.slice(0,i);}}if(a.applicationConfiguration){f.config=jQuery.extend(true,{},a.applicationConfiguration);}o.componentData=f;if(a.hasOwnProperty("loadDefaultDependencies")){L=a.loadDefaultDependencies;delete a.loadDefaultDependencies;}if(this._oConfig&&this._oConfig.hasOwnProperty("loadDefaultDependencies")){L=L&&this._oConfig.loadDefaultDependencies;}L=L&&h;if(!o.asyncHints){o.asyncHints=L?{"libs":["sap.ca.scfld.md","sap.ca.ui","sap.me","sap.ui.unified"]}:{};}if(a.hasOwnProperty("loadCoreExt")){l=a.loadCoreExt;delete a.loadCoreExt;}if(l&&h&&!e){o.asyncHints.preloadBundles=o.asyncHints.preloadBundles||[];o.asyncHints.preloadBundles.push(s);}j=l&&(l||e||(h===false));if(w){o.asyncHints.waitFor=w;}if(!o.name){o.name=a.ui5ComponentName;}if(b){o.url=b;}o.async=true;if(P){o.id="application-"+P.semanticObject+"-"+P.action+"-component";U.onBeforeApplicationInstanceCreated(o);}sap.ui.component(o).then(function(k){a.componentHandle=new U(k);if(j){a.coreResourcesFullyLoaded=true;}d.resolve(a);},function(E){var m="Failed to load UI5 component with properties '"+JSON.stringify(o)+"'.",D;if(typeof E==="object"&&E.stack){D=E.stack;}else{D=E;}jQuery.sap.log.error(m,D,"sap.ushell.services.Ui5ComponentLoader");d.reject(E);});}else{d.resolve(a);}return d.promise();};};sap.ushell.services.Ui5ComponentLoader.hasNoAdapter=true;})();
