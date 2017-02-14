// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.services.PluginManager");var S="sap.ushell.services.PluginManager",a="sap-ushell-plugin-type",b="RendererExtensions",s=[b,"UserDefaults"];sap.ushell.services.PluginManager=function(){var t=this;this._oPluginCollection={};this._oCategoryLoadingProgress={};this._mInitializedComponentPromise={};s.forEach(function(p){t._oPluginCollection[p]={};t._oCategoryLoadingProgress[p]=new jQuery.Deferred();});this._handlePluginCreation=function(c,p,P){var t=this,o=(t._oPluginCollection[c])[p];try{if(o.hasOwnProperty("component")){if(t._mInitializedComponentPromise.hasOwnProperty(o.component)){t._mInitializedComponentPromise[o.component].then(function(){t._instantiateComponent(o,P);},function(){t._instantiateComponent(o,P);});}else{t._mInitializedComponentPromise[o.component]=t._instantiateComponent(o,P);}}else{jQuery.sap.log.error("Invalid plugin configuration. The plugin "+p+" must contain a <component> key",S);}}catch(e){jQuery.sap.log.error("Error while loading bootstrap plugin: "+o.component||"",S);if(P){P.reject(e);}}};this._instantiateComponent=function(p,P){var c=jQuery.extend(true,{},p),A={ui5ComponentName:c.component,url:c.url};c.name=c.component;delete c.component;A.applicationDependencies=c;if(c.config){A.applicationConfiguration=c.config;delete c.config;}A.loadDefaultDependencies=false;return sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(A).done(function(l){if(P){P.resolve();}}).fail(function(e){e=e||"";jQuery.sap.log.error("Cannot create UI5 plugin component: (componentId/appdescrId :"+A.ui5ComponentName+")\n"+e+" properties "+JSON.stringify(A)+"\n This indicates a plugin misconfiguration, see e.g. Note 2316443.",e.stack,S);if(P){P.reject(e);}});};this.getSupportedPluginCategories=function(){return jQuery.extend(true,[],s);};this.getRegisteredPlugins=function(){return jQuery.extend(true,{},this._oPluginCollection);};this.registerPlugins=function(p){var t=this,c,P;if(!p){return;}sap.ushell.utils.addTime("PluginManager.registerPlugins");Object.keys(p).sort().forEach(function(d){c=p[d]||{};P=c.config||{};if(c&&c.hasOwnProperty("module")){jQuery.sap.log.error("Plugin "+d+" cannot get registered, because the module mechanism for plugins is not valid anymore. Plugins need to be defined as SAPUI5 components.",S);jQuery.sap.require(c.module);return;}if(P&&P.hasOwnProperty(a)){if(jQuery.inArray(P[a],s)!==-1){(t._oPluginCollection[P[a]])[d]=jQuery.extend(true,{},p[d]);}else{jQuery.sap.log.warning("Plugin "+d+" will not be inserted into the plugin collection of the PluginManager, because of unsupported category "+P[a],S);}}else{(t._oPluginCollection[b])[d]=jQuery.extend(true,{},p[d]);}});};this.getPluginLoadingPromise=function(p){if(this._oCategoryLoadingProgress.hasOwnProperty(p)){return this._oCategoryLoadingProgress[p].promise();}};this.loadPlugins=function(p){var t=this,P,o;sap.ushell.utils.addTime("PluginManager.startLoadPlugins["+p+"]");if(jQuery.inArray(p,s)!==-1){if(t._oCategoryLoadingProgress[p].pluginLoadingTriggered!==undefined){return t._oCategoryLoadingProgress[p].promise();}else{t._oCategoryLoadingProgress[p].pluginLoadingTriggered=true;}if(Object.keys(t._oPluginCollection[p]).length>0){P=[];Object.keys(t._oPluginCollection[p]).forEach(function(c){o=new jQuery.Deferred();P.push(o.promise());t._handlePluginCreation(p,c,o);});jQuery.when.apply(undefined,P).done(function(){sap.ushell.utils.addTime("PluginManager.endLoadPlugins["+p+"]");t._oCategoryLoadingProgress[p].resolve();}).fail(t._oCategoryLoadingProgress[p].reject.bind());}else{t._oCategoryLoadingProgress[p].resolve();}}else{jQuery.sap.log.error("Plugins with category "+p+" cannot be loaded by the PluginManager",S);t._oCategoryLoadingProgress[p].reject("Plugins with category "+p+" cannot be loaded by the PluginManager");}return t._oCategoryLoadingProgress[p].promise();};};sap.ushell.services.PluginManager.hasNoAdapter=true;}());
