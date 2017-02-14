// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.adapters.local.PersonalizationAdapter");jQuery.sap.require("sap.ushell.utils");var m;sap.ushell.adapters.local.PersonalizationAdapter=function(u,P,a){this._sStorageType=jQuery.sap.getObject("config.storageType",undefined,a)||sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.LOCAL_STORAGE;switch(this._sStorageType){case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.LOCAL_STORAGE:jQuery.sap.require("jquery.sap.storage");break;case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.MEMORY:m=jQuery.sap.getObject("config.personalizationData",undefined,a)||{};break;default:throw new sap.ushell.utils.Error("Personalization Adapter Local Platform: unsupported storage type '"+this._sStorageType+"'");}};sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants={"storage":{"MEMORY":"MEMORY","LOCAL_STORAGE":"LOCAL_STORAGE"}};sap.ushell.adapters.local.PersonalizationAdapter.prototype.getAdapterContainer=function(C){return new sap.ushell.adapters.local.AdapterContainer(C,this._sStorageType);};sap.ushell.adapters.local.PersonalizationAdapter.prototype.delAdapterContainer=function(C){return this.getAdapterContainer(C).del();};sap.ushell.adapters.local.AdapterContainer=function(C,S){this._sContainerKey=C;this._sStorageType=S;this._oItemMap=new sap.ushell.utils.Map();};function g(){return jQuery.sap.storage(jQuery.sap.storage.Type.local,"com.sap.ushell.adapters.sandbox.Personalization");}function p(j){try{return JSON.parse(j);}catch(e){return undefined;}}function s(j){return JSON.stringify(j);}function c(j){if(j===undefined){return undefined;}try{return JSON.parse(JSON.stringify(j));}catch(e){return undefined;}}sap.ushell.adapters.local.AdapterContainer.prototype.load=function(){var d=new jQuery.Deferred(),l,i,t=this;switch(this._sStorageType){case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.LOCAL_STORAGE:l=g();setTimeout(function(){i=l.get(t._sContainerKey);t._oItemMap.entries=p(i)||{};d.resolve(t);},0);break;case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.MEMORY:setTimeout(function(){t._oItemMap.entries=c(m[t._sContainerKey])||{};d.resolve(t);},0);break;default:setTimeout(function(){d.reject("unknown storage type");},0);}return d.promise();};sap.ushell.adapters.local.AdapterContainer.prototype.save=function(){var d=new jQuery.Deferred(),l,i,t=this;switch(this._sStorageType){case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.LOCAL_STORAGE:l=g();setTimeout(function(){i=s(t._oItemMap.entries);l.put(t._sContainerKey,i);d.resolve();},0);break;case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.MEMORY:setTimeout(function(){m[t._sContainerKey]=c(t._oItemMap.entries);d.resolve();},0);break;default:setTimeout(function(){d.reject("unknown storage type");},0);}return d.promise();};sap.ushell.adapters.local.AdapterContainer.prototype.del=function(){var d=new jQuery.Deferred(),l,t=this;switch(this._sStorageType){case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.LOCAL_STORAGE:l=g();setTimeout(function(){l.remove(t._sContainerKey);t._oItemMap.entries={};d.resolve();},0);break;case sap.ushell.adapters.local.PersonalizationAdapter.prototype.constants.storage.MEMORY:setTimeout(function(){if(m&&m[t._sContainerKey]){delete m[t._sContainerKey];}t._oItemMap.entries={};d.resolve();},0);break;default:setTimeout(function(){d.reject("unknown storage type");},0);}return d.promise();};sap.ushell.adapters.local.AdapterContainer.prototype.getItemKeys=function(){return this._oItemMap.keys();};sap.ushell.adapters.local.AdapterContainer.prototype.containsItem=function(i){return this._oItemMap.containsKey(i);};sap.ushell.adapters.local.AdapterContainer.prototype.getItemValue=function(i){return this._oItemMap.get(i);};sap.ushell.adapters.local.AdapterContainer.prototype.setItemValue=function(i,I){this._oItemMap.put(i,I);};sap.ushell.adapters.local.AdapterContainer.prototype.delItem=function(i){this._oItemMap.remove(i);};}());
