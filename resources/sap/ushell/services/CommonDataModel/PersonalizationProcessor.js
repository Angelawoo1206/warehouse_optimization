// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.services.CommonDataModel.PersonalizationProcessor");sap.ushell.services.CommonDataModel.PersonalizationProcessor=function(){};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._getItemIndex=function(i,I){var r;for(r=0;r<i.length;r++){if(i[r].id===I){break;}}r=(r>=i.length)?-1:r;return r;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyRenameGroup=function(g,n,o){var G,b=false;if(!n){return false;}if(g&&o&&o.groups&&o.groups[g]){G=o.groups[g];if(G.identification&&G.identification.title){o.groups[g].identification.title=n;b=true;}}return b;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyGroupVisibility=function(g,G,o){var b=false;if(G===undefined){return false;}if(g&&o&&o.groups&&o.groups[g]){o.groups[g].identification.isVisible=G;b=true;}return b;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype.mixinPersonalization=function(o,p){var d=new jQuery.Deferred(),t=this;if(!p||jQuery.isEmptyObject(p)){return d.resolve(o).promise();}if(p.groups){Object.keys(p.groups).forEach(function(g){var G=p.groups[g];if(o.groups[g]){if(G.identification){if(G.identification.title){t._applyRenameGroup(g,G.identification.title,o);}if(G.identification.hasOwnProperty("isVisible")&&G.identification.isVisible===false){t._applyGroupVisibility(g,false,o);}}}});}this._applyAddGroups(o,p);if(p.removedGroups&&jQuery.isArray(p.removedGroups)){p.removedGroups.forEach(function(g){t._applyRemoveGroup(o,g);});}this._applyMoveGroup(o,p);this._applyItemChanges(o,p);this._applyTileSettings(o,p);return d.resolve(o).promise();};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyAddGroups=function(o,p){var n=[];o.site=o.site||{};o.site.payload=o.site.payload||{};o.site.payload.groupsOrder=o.site.payload.groupsOrder||[];o.groups=o.groups||{};if(jQuery.isArray(p.groupOrder)){o.site.payload.groupsOrder.forEach(function(g){if(p.groupOrder.indexOf(g)===-1){if((p.removedGroups&&p.removedGroups.indexOf(g)===-1)||!p.removedGroups){n.push(g);}}});}if(jQuery.isArray(p.groupOrder)&&p.addedGroups&&Object.keys(p.addedGroups).length>0){Object.keys(p.addedGroups).forEach(function(g){o.groups[g]=p.addedGroups[g];o.groups[g].payload.isPreset=false;});o.site.payload.groupsOrder=p.groupOrder;}n.forEach(function(N){o.site.payload.groupsOrder.push(N);});};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._checkRenameGroup=function(g,p,o,P){if(g&&p&&o){if(o[g]){if(p[g].identification.title!==o[g].identification.title){P=P||{};P.groups=P.groups||{};P.groups[g]=P.groups[g]||{};P.groups[g].identification=P.groups[g].identification||{};P.groups[g].identification.title=p[g].identification.title;}}}return P;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._checkTileSettings=function(p,P){if(!p.modifiedTiles){return;}P.modifiedTiles=p.modifiedTiles;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyTileSettings=function(s,p){var g,m;if(!p.modifiedTiles){return;}g=Object.keys(s.groups).map(function(k){return this[k];},s.groups);m=Object.keys(p.modifiedTiles).map(function(k){return this[k];},p.modifiedTiles);g.some(function(G){G.payload.tiles.some(function(t){var P;m.some(function(u,i){if(u.id===t.id){if(u.title!==undefined){t.title=u.title;}if(u.subTitle!==undefined){t.subTitle=u.subTitle;}P=i;return true;}return false;});if(P!==undefined){m.splice(P,1);}return m.length===0;});return m.length===0;});s.modifiedTiles=p.modifiedTiles;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._checkGroupVisibility=function(g,p,o,P){if(g&&p&&o){if(o[g]){if(p[g].identification.isVisible!==o[g].identification.isVisible&&typeof p[g].identification.isVisible==="boolean"){P=P||{};P.groups=P.groups||{};P.groups[g]=P.groups[g]||{};P.groups[g].identification=P.groups[g].identification||{};P.groups[g].identification.isVisible=p[g].identification.isVisible;}}}return P;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._addGroupToPersonalizationDelta=function(p,P,g){var s=false,G,n;if(p&&p.site&&p.site.payload&&p.site.payload.groupsOrder&&p.groups&&g&&p.groups[g]&&P){G=p.site.payload.groupsOrder;n=p.groups[g];P.addedGroups=P.addedGroups||{};P.addedGroups[g]={};P.addedGroups[g].identification=jQuery.extend({},n.identification);P.addedGroups[g].payload=jQuery.extend({},n.payload);P.addedGroups[g].payload.tiles=[];P.groupOrder=G;s=true;}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype.extractPersonalization=function(p,o){var d=new jQuery.Deferred(),P,a={},O,e,t=this;if(p&&p.groups&&o&&o.groups){P=p.groups;O=o.groups;e=this._getExtractHelperObject(o,p,a);Object.keys(O).forEach(function(g){t._checkRemoveGroup(p,a,g);t._extractFromOriginalSiteOneGroup(o,e,g,"tiles");});Object.keys(P).forEach(function(g){if(O[g]){t._checkRenameGroup(g,P,O,a);t._checkGroupVisibility(g,P,O,a);}else{t._addGroupToPersonalizationDelta(p,a,g);}t._extractFromPersonalizedSiteOneGroup(p,e,g,"tiles");});this._checkMoveGroup(p,o,a);this._checkTileSettings(p,a);this._cleanupRemovedGroups(o,a);if(e.oPersonalizationDelta.movedTiles&&jQuery.isEmptyObject(e.oPersonalizationDelta.movedTiles)){delete(e.oPersonalizationDelta.movedTiles);}}return d.resolve(a).promise();};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._checkRemoveGroup=function(p,P,o){var s=false;if(p&&p.groups&&P&&o){if(!p.groups[o]){P.removedGroups=P.removedGroups||[];P.groupOrder=P.groupOrder||[];if(P.removedGroups.indexOf(o)===-1){P.removedGroups.push(o);}if(p.site&&p.site.payload&&p.site.payload.groupsOrder&&jQuery.isArray(p.site.payload.groupsOrder)){P.groupOrder=p.site.payload.groupsOrder.slice(0);}}s=true;}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyRemoveGroup=function(o,g){var O,G,i;if(o&&o.groups&&o.site&&o.site.payload&&o.site.payload.groupsOrder&&g){O=o.groups;G=o.site.payload.groupsOrder;i=G.indexOf(g);if(!(i===-1)){G.splice(i,1);delete(O[g]);return true;}}return false;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._checkMoveGroup=function(p,o,P){var a,O,b=false,s=false;if(p.site&&p.site.payload&&jQuery.isArray(p.site.payload.groupsOrder)&&o.site&&o.site.payload&&jQuery.isArray(o.site.payload.groupsOrder)){a=p.site.payload.groupsOrder;O=o.site.payload.groupsOrder;if(a.length===O.length){b=(function(){var S=false,i;for(i=0;i<O.length;i++){if(O[i]!==a[i]){S=true;break;}}return S;})();if(b){P.groupOrder=a;s=true;}}}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyMoveGroup=function(o,p){var s=false;if(jQuery.isArray(p.groupOrder)){o.site=o.site||{};o.site.payload=o.site.payload||{};if(!jQuery.isArray(o.site.payload.groupsOrder)){o.site.payload.groupsOrder=[];}if(o.site.payload.groupsOrder.length===p.groupOrder.length){o.site.payload.groupsOrder=p.groupOrder;s=true;}}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._getHashedItemsFromSite=function(s){var r=null;if(s&&s.groups){if(Object.keys(s.groups).length>0){r={};Object.keys(s.groups).forEach(function(g){var G=s.groups[g],a;r[g]={};if(G.payload&&jQuery.isArray(G.payload.tiles)){a=G.payload.tiles;a.forEach(function(i,I){var b;if(i.id){b=i.id;r[g][b]={};r[g][b].iIndex=I;r[g][b].oItem=i;}});}});}}return r;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._getExtractHelperObject=function(o,p,P){var r=null;r={};r.oHashedItemsOriginal=this._getHashedItemsFromSite(o);r.oHashedItemsPersonalized=this._getHashedItemsFromSite(p);r.oPersonalizationDelta=P;return r;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._extractFromOriginalSiteOneGroup=function(o,e,g,i){var s=false,O,m,M;i=i?i:"tiles";M=function(a,f){m[a]=m[a]?m[a]:{};m[a].fromGroup=f;m[a].toGroup=null;};if(e&&e.oHashedItemsPersonalized&&e.oPersonalizationDelta&&o&&o.groups&&o.groups[g]&&o.groups[g].payload&&jQuery.isArray(o.groups[g].payload[i])){O=o.groups[g].payload[i];e.oPersonalizationDelta.movedTiles=e.oPersonalizationDelta.movedTiles?e.oPersonalizationDelta.movedTiles:{};m=e.oPersonalizationDelta.movedTiles;if(e.oHashedItemsPersonalized[g]){O.forEach(function(I){if(!e.oHashedItemsPersonalized[g][I.id]){M(I.id,g);}});s=true;}else{O.forEach(function(I){M(I.id,g);});s=true;}}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._handleItemChangeExtract=function(e,g,i){return false;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._extractFromPersonalizedSiteOneGroup=function(p,e,g,i){var s=false,m,t,T=false,P,a=this;i=i?i:"tiles";if((i!=="tiles")&&(i!=="links")){return s;}if(e&&e.oHashedItemsOriginal&&e.oPersonalizationDelta&&p&&p.groups&&p.groups[g]&&p.groups[g].payload&&jQuery.isArray(p.groups[g].payload[i])){P=p.groups[g].payload[i];e.oPersonalizationDelta.movedTiles=e.oPersonalizationDelta.movedTiles?e.oPersonalizationDelta.movedTiles:{};m=e.oPersonalizationDelta.movedTiles;t=[];P.forEach(function(I,b){t.push(I.id);if(e.oHashedItemsOriginal[g]&&e.oHashedItemsOriginal[g][I.id]){if(m[I.id]){delete(m[I.id]);}if(e.oHashedItemsOriginal[g][I.id].iIndex!==b){T=true;}a._handleItemChangeExtract(e,g,i);}else{T=true;if(m[I.id]){if(m[I.id].fromGroup&&(m[I.id].fromGroup!==g)){if(!m[I.id].toGroup){m[I.id].toGroup=g;a._handleItemChangeExtract(e,g,i);}}}else{m[I.id]={};m[I.id].fromGroup=null;m[I.id].toGroup=g;m[I.id].item=I;}}});if(T){e.oPersonalizationDelta.groups=e.oPersonalizationDelta.groups||{};e.oPersonalizationDelta.groups[g]=e.oPersonalizationDelta.groups[g]||{};e.oPersonalizationDelta.groups[g].payload=e.oPersonalizationDelta.groups[g].payload||{};e.oPersonalizationDelta.groups[g].payload.tileOrder=t;}s=true;}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._cleanupRemovedGroups=function(o,p){var t,m;if(p.removedGroups&&p&&jQuery.isArray(p.removedGroups)&&(p.removedGroups.length>0)){p.removedGroups.forEach(function(g){if(o&&o.groups&&o.groups[g]&&o.groups[g].payload&&jQuery.isArray(o.groups[g].payload.tiles)){t=o.groups[g].payload.tiles;t.forEach(function(T){if(p.movedTiles){m=p.movedTiles[T.id];if(m&&m.fromGroup&&(m.fromGroup===g)&&!m.toGroup){delete(p.movedTiles[T.id]);}}});}});}};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._setItemOrderOnSiteCollection=function(o,i){var s=true,S=o.length,a,b={},I,c,C,f;if(!jQuery.isArray(o)||!jQuery.isArray(o)||(o.length!==i.length)){return false;}a=o.splice(0,o.length);for(I=0;I<i.length;I++){C=i[I];c=a.shift();if(c&&C===c.id){o.push(c);}else if(b[C]){o.push(b[C]);delete(b[C]);if(c){b[c.id]=c;}}else if(c){b[c.id]=c;f=false;while(a.length>0){c=a.shift();if(C===c.id){o.push(c);f=true;break;}else{b[c.id]=c;}}if(!f){s=false;}}}if(o.length!==S){s=false;}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._setItemOrderOnSiteGroupForItemType=function(o,d,i){var s=true,t,I;if((i==="tiles")||(i==="links")){I=(i==="tiles")?"tileOrder":"linkOrder";}else{return false;}if(d.payload&&jQuery.isArray(d.payload[I])&&(d.payload[I].length>0)){if(o.payload&&jQuery.isArray(o.payload[i])&&(o.payload[i].length>0)){t=this._setItemOrderOnSiteCollection(o.payload[i],d.payload[I]);if(!t){s=false;}}else{s=false;}}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._setItemOrderOnSite=function(o,p){var s=true,t,a=this;if(o.groups&&p.groups){Object.keys(p.groups).forEach(function(g){if(p.groups[g]&&o.groups[g]){t=a._setItemOrderOnSiteGroupForItemType(o.groups[g],p.groups[g],"tiles");if(!t){s=false;}t=a._setItemOrderOnSiteGroupForItemType(o.groups[g],p.groups[g],"links");if(!t){s=false;}}});}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyMoveItemsWithoutOrder=function(o,p,i){var s=true,t,T,I="tileOrder",d,a,b,O=[],c=this;function f(C,g){var s=true;if(o.groups[g]&&o.groups[g].payload&&p.groups&&p.groups[g]&&p.groups[g].payload&&jQuery.isArray(p.groups[g].payload[I])&&(p.groups[g].payload[I].length>0)){if(!jQuery.isArray(o.groups[g].payload[i])){o.groups[g].payload[i]=[];}o.groups[g].payload[i].push(C);}else{s=false;}return s;}if((i==="tiles")||(i==="links")){T=(i==="tiles")?"movedTiles":"movedLinks";I=(i==="tiles")?"tileOrder":"linkOrder";}else{return false;}if(!o||!o.groups||!o.site||!o.site.payload||!jQuery.isArray(o.site.payload.groupsOrder)||!p){return false;}if(p[T]){Object.keys(p[T]).forEach(function(e){d=p[T][e];if(d.fromGroup){if(d.toGroup){if(d.fromGroup!==d.toGroup){if(o.groups[d.fromGroup]&&o.groups[d.fromGroup].payload&&jQuery.isArray(o.groups[d.fromGroup].payload[i])){O=o.groups[d.fromGroup].payload[i];a=c._getItemIndex(O,e);if(a>=0){b=O.splice(a,1);t=f(b[0],d.toGroup);if(!t){s=false;}}else{s=false;}}else{s=false;}}else{s=false;}}else{if(o.groups[d.fromGroup]&&o.groups[d.fromGroup].payload&&jQuery.isArray(o.groups[d.fromGroup].payload[i])){O=o.groups[d.fromGroup].payload[i];a=c._getItemIndex(O,e);if(a>=0){O.splice(a,1);}else{s=false;}}else{s=false;}}}else if(d.toGroup){if(d.item&&!jQuery.isEmptyObject(d.item)){t=f(d.item,d.toGroup);if(!t){s=false;}}else{s=false;}}else{s=false;}});}return s;};sap.ushell.services.CommonDataModel.PersonalizationProcessor.prototype._applyItemChanges=function(o,p){var s=true,S;S=this._applyMoveItemsWithoutOrder(o,p,"tiles");if(!S){s=false;}S=this._applyMoveItemsWithoutOrder(o,p,"links");if(!S){s=false;}if(p.groups){S=this._setItemOrderOnSite(o,p);if(!S){s=false;}}return s;};}());
