// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.services.Bookmark");sap.ushell.services.Bookmark=function(){var l=sap.ushell.Container.getService("LaunchPage");this._isMatchingRemoteCatalog=function(c,r){var C=l.getCatalogData(c);return C.remoteId===r.remoteId&&C.baseUrl.replace(/\/$/,"")===r.baseUrl.replace(/\/$/,"");};this.addBookmark=function(p,g){var P=l.addBookmark(p,g);P.done(function(t){var d={tile:t,group:g};sap.ui.getCore().getEventBus().publish("sap.ushell.services.Bookmark","bookmarkTileAdded",d);});return P;};this._doAddCatalogTileToGroup=function(d,c,C,g){var e,f=d.reject.bind(d);function a(G){l.getCatalogTiles(C).fail(f).done(function(b){var g=l.getGroupId(G),t=b.some(function(o){if(l.getCatalogTileId(o)===c){l.addTile(o,G).fail(f).done(function(){d.resolve();sap.ui.getCore().getEventBus().publish("sap.ushell.services.Bookmark","catalogTileAdded",g);});return true;}});if(!t){e="No tile '"+c+"' in catalog '"+l.getCatalogId(C)+"'";jQuery.sap.log.error(e,null,"sap.ushell.services.Bookmark");f(e);}});}if(g){l.getGroups().fail(f).done(function(G){var b=G.some(function(o){if(l.getGroupId(o)===g){a(o);return true;}});if(!b){e="Group '"+g+"' is unknown";jQuery.sap.log.error(e,null,"sap.ushell.services.Bookmark");f(e);}});}else{l.getDefaultGroup().fail(f).done(a);}return d.promise();};this.addCatalogTileToGroup=function(c,g,C){var d=new jQuery.Deferred(),e,f=d.reject.bind(d),m,L="X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG",t=this;function i(o){return l.getCatalogId(o)===L;}m=C?this._isMatchingRemoteCatalog:i;C=C||{id:L};l.onCatalogTileAdded(c);l.getCatalogs().fail(f).done(function(a){var s;a.forEach(function(o){if(m(o,C)){if(!s){s=o;}else{jQuery.sap.log.warning("More than one matching catalog: "+JSON.stringify(C),null,"sap.ushell.services.Bookmark");}}});if(s){t._doAddCatalogTileToGroup(d,c,s,g);}else{e="No matching catalog found: "+JSON.stringify(C);jQuery.sap.log.error(e,null,"sap.ushell.services.Bookmark");d.reject(e);}});return d.promise();};this.countBookmarks=function(u){return l.countBookmarks(u);};this.deleteBookmarks=function(u){var p=l.deleteBookmarks(u);p.done(function(){sap.ui.getCore().getEventBus().publish("sap.ushell.services.Bookmark","bookmarkTileDeleted",u);});return p;};this.updateBookmarks=function(u,p){return l.updateBookmarks(u,p);};};sap.ushell.services.Bookmark.hasNoAdapter=true;}());