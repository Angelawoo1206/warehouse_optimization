/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/base/EventProvider","sap/ui/base/ObjectPool","./BaseNodeProxy","./NodeProxy","./LayerProxy","./Messages"],function(q,l,E,O,B,N,L,M){"use strict";var g=sap.ui.vk.dvl.getJSONObject;var a=E.extend("sap.ui.vk.NodeHierarchy",{metadata:{publicMethods:["attachChanged","createLayerProxy","createNodeProxy","destroyLayerProxy","destroyNodeProxy","detachChanged","enumerateAncestors","enumerateChildren","fireChanged","getChildren","getAncestors","getGraphicsCore","getLayers","getScene"]},_baseNodeProxyPool:new O(B),constructor:function(s){this._messages=new M();E.apply(this);this._graphicsCore=s.getGraphicsCore();this._scene=s;this._dvlSceneId=this._scene._getDvlSceneId();this._dvl=this._graphicsCore._getDvl();this._nodeProxies=[];this._layerProxies=[];this._searchDictionary={modeDictionary:{equals:function(i){return i?sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL:sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL_CASE_INSENSITIVE;},contains:function(i){return i?sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_SUBSTRING:sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_SUBSTRING_CASE_INSENSITIVE;},startsWith:function(i){return i?sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_STARTS_WITH:sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_STARTS_WITH_CASE_INSENSITIVE;}}};}});a.prototype.destroy=function(){this._layerProxies.slice().forEach(this.destroyLayerProxy,this);this._nodeProxies.slice().forEach(this.destroyNodeProxy,this);this._dvl=null;this._dvlSceneId=null;this._scene=null;this._graphicsCore=null;this._searchDictionary=null;E.prototype.destroy.apply(this);};a.prototype.getGraphicsCore=function(){return this._graphicsCore;};a.prototype.getScene=function(){return this._scene;};a.prototype._getDvlSceneId=function(){return this._dvlSceneId;};a.prototype.enumerateChildren=function(n,c,s,p){if(typeof n==="function"){p=s;s=c;c=n;n=undefined;}var b;if(n){if(s||(g(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS)).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_CLOSED)===0){b=g(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_CHILDREN)).ChildNodes;}else{b=[];}}else{b=g(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId,sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN)).ChildNodes;}if(p){b.forEach(c);}else{var d=this._baseNodeProxyPool.borrowObject();try{b.forEach(function(n){d.init(this,n);c(d);d.reset();}.bind(this));}finally{this._baseNodeProxyPool.returnObject(d);}}return this;};a.prototype.enumerateAncestors=function(n,c,p){var b=g(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_PARENTS)).ParentNodes;if(p){b.forEach(c);}else{var d=this._baseNodeProxyPool.borrowObject();try{b.forEach(function(n){d.init(this,n);c(d);d.reset();}.bind(this));}finally{this._baseNodeProxyPool.returnObject(d);}}return this;};a.prototype.createNodeProxy=function(n){var b=new N(this,n);this._nodeProxies.push(b);return b;};a.prototype.destroyNodeProxy=function(n){var i=this._nodeProxies.indexOf(n);if(i>=0){this._nodeProxies.splice(i,1)[0].destroy();}return this;};a.prototype.getChildren=function(n,s){if(typeof n==="boolean"){s=n;n=undefined;}if(n){if(s||(g(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS)).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_CLOSED)===0){return g(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_CHILDREN)).ChildNodes;}else{return[];}}else{return g(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId,sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN)).ChildNodes;}};a.prototype.getAncestors=function(n){return g(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_PARENTS)).ParentNodes;};a.prototype.findNodesById=function(b){if(b.fields.some(function(h){return!h.caseSensitive;})){b=q.extend(true,{},b);b.fields.forEach(function(h){if(!h.caseSensitive){h.value=h.value.toLowerCase();}});}var c=function(p,h,v,j){var m;p=p||"equals";j=j||"";var k=h?v:v.toLowerCase();switch(p){case"equals":m=(k===j);break;case"contains":m=(k.indexOf(j)!==-1);break;case"startsWith":m=(k.indexOf(j)===0);break;default:m=false;q.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT8.summary),this._messages.messages.VIT8.code,"sap.ui.vk.NodeHierarchy");}return m;};var i=function(h,j){return!h.some(function(v){return j.name===v.name?c(j.predicate,j.caseSensitive,v.value,j.value):false;});};var f=function(b,v){return b.source===v.source&&b.type===v.type&&!b.fields.some(i.bind(undefined,v.fields));};var d=this.findNodesByName();var e=d.filter(function(n){var h=this.createNodeProxy(n);var v=h.getVeIds();this.destroyNodeProxy(h);return v.some(f.bind(undefined,b));}.bind(this));return e;};a.prototype.findNodesByName=function(b){var s=sap.ve.dvl.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME,c=[],d,e;if(b===undefined||b===null||q.isEmptyObject(b)){d=this._searchDictionary.modeDictionary.contains(false);e=[""];}else{if(b.value===undefined||b.value===null||b.value===""){q.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT6.summary),this._messages.messages.VIT6.code,"sap.ui.vk.NodeHierarchy");}var p=b.hasOwnProperty("predicate")?b.predicate:"equals";if(p===undefined||p===null||p===""){q.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT7.summary),this._messages.messages.VIT7.code,"sap.ui.vk.NodeHierarchy");}else if(["equals","contains","startsWith"].indexOf(p)===-1){q.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT8.summary),this._messages.messages.VIT8.code,"sap.ui.vk.NodeHierarchy");}d=this._searchDictionary.modeDictionary[p](b.caseSensitive);e=(typeof b.value==="string")?[b.value]:b.value;}for(var i=0;i<e.length;i++){c=c.concat(g(this._dvl.Scene.FindNodes(this._dvlSceneId,s,d,e[i])).nodes);}return q.sap.unique(c);};a.prototype.findNodesByMetadata=function(b){var c=function(m,k,n,v,i,j){if(m.hasOwnProperty(k)){var o=m[k];if(o.hasOwnProperty(n)){var s=o[n];if(!j){s=s.toLowerCase();}return v.some(i.bind(undefined,s));}}return false;};var d=function(m,k){return m.hasOwnProperty(k);};var e=function(f,h,k,m,v,i,j){var n=this._baseNodeProxyPool.borrowObject();var r=f.filter(function(o){n.init(this,o);var s=n.getNodeMetadata();var t=h(s,k,m,v,i,j);n.reset();return t;}.bind(this));this._baseNodeProxyPool.returnObject(n);return r;};var f=this.findNodesByName(),r=[];if(b===undefined||b===null||q.isEmptyObject(b)){r=f;}else if(b.category!==null&&b.category!==undefined&&b.category!==""){var h,v,p,i,j=!!(b&&b.caseSensitive);if(b.key===undefined||b.key===null){h=d;}else{v=b.value;p=b.predicate||"equals";if(v===undefined||v===null){v="";p="contains";}if(!Array.isArray(v)){v=[v];}if(!j){v=v.map(function(k){return k.toLowerCase();});}switch(p){case"equals":i=function(m,k){return m===k;};break;case"contains":i=function(m,k){return m.indexOf(k)!==-1;};break;case"startsWith":i=function(m,k){return m.indexOf(k)===0;};break;default:q.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT9.summary),this._messages.messages.VIT9.code,"sap.ui.vk.NodeHierarchy");}h=c;}r=e.bind(this)(f,h,b.category,b.key,v,i,j);}else{q.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT10.summary),this._messages.messages.VIT10.code,"sap.ui.vk.NodeHierarchy");}return q.sap.unique(r);};a.prototype.createLayerProxy=function(b){var c=new L(this,b);this._layerProxies.push(c);return c;};a.prototype.destroyLayerProxy=function(b){var i=this._layerProxies.indexOf(b);if(i>=0){this._layerProxies.splice(i,1)[0].destroy();}return this;};a.prototype.getLayers=function(){return g(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId,sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_LAYERS)).Layers;};a.prototype.getHotspotNodeIds=function(){var h=g(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId,sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_HOTSPOTS).ChildNodes);return h.length>0?h:this._getLegacyHotspotNodeIds();};a.prototype._getLegacyHotspotNodeIds=function(){var b=this.getLayers(),h=[];for(var i=0;i<b.length;i++){var c=this.createLayerProxy(b[i]),d=c.getName();if(d.toLowerCase()==="hotspots"){h=c.getNodes();this.destroyLayerProxy(c);break;}this.destroyLayerProxy(c);}return h;};a.prototype.attachChanged=function(f,b){return this.attachEvent("changed",f,b);};a.prototype.detachChanged=function(f,b){return this.detachEvent("changed",f,b);};a.prototype.fireChanged=function(){return this.fireEvent("changed");};return a;});
