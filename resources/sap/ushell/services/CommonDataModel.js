// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.services.CommonDataModel");sap.ushell.services.CommonDataModel=function(a,c,p,s){jQuery.sap.require("sap.ushell.services.CommonDataModel.PersonalizationProcessor");jQuery.sap.require("sap.ushell.services.ClientSideTargetResolution");var t=this,S=new jQuery.Deferred();function f(m){S.reject(m);}this._oAdapter=a;this._oPersonalizationProcessor=new sap.ushell.services.CommonDataModel.PersonalizationProcessor();this._oSitePromise=S.promise();a.getSite().done(function(o){t._oOriginalSite=jQuery.extend(true,{},o);a.getPersonalization().done(function(P){t._oPersonalizationProcessor.mixinPersonalization(o,P).done(function(b){t._oPersonalizedSite=b;S.resolve(t._oPersonalizedSite);}).fail(f);}).fail(f);}).fail(f);};sap.ushell.services.CommonDataModel.prototype.getHomepageGroups=function(){var d=new jQuery.Deferred();this._oSitePromise.then(function(s){var g=(s&&s.site&&s.site.payload&&s.site.payload.groupsOrder)?s.site.payload.groupsOrder:[];d.resolve(g);});return d.promise();};sap.ushell.services.CommonDataModel.prototype.getGroups=function(){var d=new jQuery.Deferred();this._oSitePromise.then(function(s){var g=[];Object.keys(s.groups).forEach(function(k){g.push(s.groups[k]);});d.resolve(g);});return d.promise();};sap.ushell.services.CommonDataModel.prototype.getGroup=function(i){var d=new jQuery.Deferred();this._oSitePromise.then(function(s){var g=s.groups[i];if(g){d.resolve(g);}else{d.reject("Group "+i+" not found");}});return d.promise();};sap.ushell.services.CommonDataModel.prototype.getSite=function(){return this._oSitePromise;};sap.ushell.services.CommonDataModel.prototype.getGroupFromOriginalSite=function(g){var d=new jQuery.Deferred();if(typeof g==="string"&&this._oOriginalSite&&this._oOriginalSite.groups&&this._oOriginalSite.groups[g]){d.resolve(jQuery.extend(true,{},this._oOriginalSite.groups[g]));}else{d.reject("Group does not exist in original site.");}return d.promise();};sap.ushell.services.CommonDataModel.prototype.save=function(){var d=new jQuery.Deferred(),t=this;this._oPersonalizationProcessor.extractPersonalization(this._oPersonalizedSite,this._oOriginalSite).done(function(e){if(e){t._oAdapter._storePersonalizationData(e).done(function(){d.resolve();}).fail(function(m){d.reject(m);});}else{d.resolve();}});return d.promise();};sap.ushell.services.CommonDataModel.prototype.hasNoAdapter=false;}());