// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.utils");sap.ushell.utils={};sap.ushell.utils.isArray=function(o){return Object.prototype.toString.apply(o)==='[object Array]';};sap.ushell.utils.getMember=function(o,a){var p=a.split("."),n=o;if(!o){return undefined;}p.forEach(function(s){if(typeof n!=="object"){return undefined;}n=n[s.replace(/[|]/g,".")];});return n;};sap.ushell.utils.addTime=function(i,I,e){if(!window["sap-ushell-startTime"]){window["sap-ushell-startTime"]=Date.now();}var s=window["sap-ushell-startTime"];e=e||Date.now();if(e<s){e=s+1;}jQuery.sap.measure.add("sap.ushell.fromStart."+i,I,s,e,e-s,e-s);};sap.ushell.utils.Error=function(m,c){this.name="sap.ushell.utils.Error";this.message=m;jQuery.sap.log.error(m,null,c);};sap.ushell.utils.Error.prototype=new Error();sap.ushell.utils.localStorageSetItem=function(k,v,l){var E;try{localStorage.setItem(k,v);if(l){E=document.createEvent("StorageEvent");E.initStorageEvent("storage",false,false,k,"",v,"",localStorage);dispatchEvent(E);}}catch(e){jQuery.sap.log.warning("Error calling localStorage.setItem(): "+e,null,"sap.ushell.utils");}};sap.ushell.utils.getLocalStorage=function(){return window.localStorage;};sap.ushell.utils.generateUniqueId=function(t){var u,e,i;if(jQuery.isArray(t)){e=t;i=function(g){return e.indexOf(g)===-1;};}else{i=t;}do{u=jQuery.sap.uid();}while(!i(u));return u;};sap.ushell.utils.reload=function(){location.reload();};sap.ushell.utils.calculateOrigin=function(d){var u;if(d.origin){return d.origin;}if(d.protocol&&d.hostname){return d.protocol+"//"+d.hostname+(d.port?':'+d.port:'');}if(d.href){u=new URI(d.href);return u.protocol()+"://"+u.hostname()+(u.port()?':'+u.port():'');}};sap.ushell.utils.getPrivateEpcm=function(){if(window.external&&window.external&&typeof window.external.getPrivateEpcm!=="undefined"){return window.external.getPrivateEpcm();}return undefined;};sap.ushell.utils.hasNativeNavigationCapability=function(){return sap.ushell.utils.isFeatureBitEnabled(1);};sap.ushell.utils.hasNativeLogoutCapability=function(){return sap.ushell.utils.isFeatureBitEnabled(2);};sap.ushell.utils.isFeatureBitEnabled=function(f){var F="0",p;p=sap.ushell.utils.getPrivateEpcm();if(p){try{F=p.getNwbcFeatureBits();jQuery.sap.log.debug("Detected epcm getNwbcFeatureBits returned feature bits: "+F);}catch(e){jQuery.sap.log.error("failed to get feature bit vector via call getNwbcFeatureBits on private epcm object",e.stack,"sap.ushell.utils");}}return(parseInt(F,16)&f)>0;};sap.ushell.utils.isApplicationTypeNWBCRelated=function(a){return a==="NWBC"||a==="TR";};sap.ushell.utils.appendUserIdToUrl=function(p,u){var U=sap.ushell.Container.getService("UserInfo").getUser().getId(),s=u.indexOf("?")>=0?"&":"?";return u+s+p+"="+U;};sap.ushell.utils.isNativeWebGuiNavigation=function(r){if(this.hasNativeNavigationCapability()&&r&&r.applicationType==="TR"){return true;}return false;};sap.ushell.utils.Map=function(){this.entries={};};sap.ushell.utils.Map.prototype.put=function(k,v){var o=this.get(k);this.entries[k]=v;return o;};sap.ushell.utils.Map.prototype.containsKey=function(k){if(typeof k!=="string"){throw new sap.ushell.utils.Error("Not a string key: "+k,"sap.ushell.utils.Map");}return Object.prototype.hasOwnProperty.call(this.entries,k);};sap.ushell.utils.Map.prototype.get=function(k){if(this.containsKey(k)){return this.entries[k];}};sap.ushell.utils.Map.prototype.keys=function(){return Object.keys(this.entries);};sap.ushell.utils.Map.prototype.remove=function(k){delete this.entries[k];};sap.ushell.utils.Map.prototype.toString=function(){var r=['sap.ushell.utils.Map('];r.push(JSON.stringify(this.entries));r.push(')');return r.join('');};sap.ushell.utils.getParameterValueBoolean=function(p,P){var a=jQuery.sap.getUriParameters(P).mParams&&jQuery.sap.getUriParameters(P).mParams[p],t=["true","x"],f=["false",""],v;if(!a||a.length===0){return undefined;}v=a[0].toLowerCase();if(t.indexOf(v)>=0){return true;}if(f.indexOf(v)>=0){return false;}return undefined;};sap.ushell.utils.call=function(s,f,a){var m;if(a){setTimeout(function(){sap.ushell.utils.call(s,f,false);},0);return;}try{s();}catch(e){m=e.message||e.toString();jQuery.sap.log.error("Call to success handler failed: "+m,e.stack,"sap.ushell.utils");if(f){f(m);}}};sap.ushell.utils.handleTilesVisibility=function(){var s=new Date(),t=sap.ushell.utils.getVisibleTiles(),d,l;if(t&&t.length){l=sap.ushell.Container.getService("LaunchPage");t.forEach(function(T){var a=sap.ushell.utils.getTileObject(T);if(a!==null){l.setTileVisible(a,T.isDisplayedInViewPort);}});jQuery.sap.log.debug("Visible Tiles: "+t.filter(function(T){return T.isDisplayedInViewPort;}).length);jQuery.sap.log.debug("NonVisible Tiles: "+t.filter(function(T){return!T.isDisplayedInViewPort;}).length);}d=new Date()-s;jQuery.sap.log.debug("Start time is: "+s+" and duration is: "+d);};sap.ushell.utils.refreshTiles=function(){var t=sap.ushell.utils.getVisibleTiles(),l;if(t&&t.length){l=sap.ushell.Container.getService("LaunchPage");t.forEach(function(T){var a=sap.ushell.utils.getTileObject(T);if(a!==null){l.refreshTile(a);}});}};sap.ushell.utils.setTilesNoVisibility=function(){var t=sap.ushell.utils.getVisibleTiles(),l;if((typeof t!=="undefined")&&t.length>0){l=sap.ushell.Container.getService("LaunchPage");t.forEach(function(T){l.setTileVisible(sap.ushell.utils.getTileObject(T),false);});jQuery.sap.log.debug("Visible Tiles: "+t.filter(function(T){return T.isDisplayedInViewPort;}).length);jQuery.sap.log.debug("NonVisible Tiles: "+t.filter(function(T){return!T.isDisplayedInViewPort;}).length);}};sap.ushell.utils.getBasicHash=function(h){if(!sap.ushell.utils.validHash(h)){jQuery.sap.log.debug("Utils ; getBasicHash ; Got invalid hash");return false;}var u=sap.ushell.Container.getService("URLParsing"),s=u.parseShellHash(h);return s?s.semanticObject+"-"+s.action:h;};sap.ushell.utils.validHash=function(h){return(h&&h.constructor===String&&jQuery.trim(h)!=="");};sap.ushell.utils.handleTilesOpacity=function(m){jQuery.sap.require("sap.ui.core.theming.Parameters");var t,c,a,C=sap.ui.core.theming.Parameters.get("sapUshellTileBackgroundColor"),r=this.hexToRgb(C),j,b,R,d,s,e,o,p,g,f,i,u=sap.ushell.Container.getService("UserRecents");if(r){R="rgba("+r.r+","+r.g+","+r.b+",{0})";a=u.getAppsUsage();a.done(function(h){t=h.usageMap;j=jQuery('.sapUshellTile').not('.sapUshellTileFooter');var k=m.getProperty("/groups");m.setProperty('/animationRendered',true);for(i=0;i<j.length;i++){d=jQuery(j[i]);s=this.getBasicHash(d.find('.sapUshellTileBase').attr('data-targeturl'));if(s){b=this.convertToRealOpacity(t[s],h.maxUsage);e=R.replace("{0}",b);c=sap.ui.getCore().byId(d.attr('id'));o=c.getBindingContext();p=o.sPath.split('/');g=p[2];f=p[4];k[g].tiles[f].rgba=e;}}m.setProperty("/groups",k);}.bind(this));}};sap.ushell.utils.convertToRealOpacity=function(a,m){var o=[1,0.95,0.9,0.85,0.8],O=Math.floor(m/o.length),i;if(!a){return o[0];}if(!m){return o[o.length-1];}i=Math.floor((m-a)/O);return i<o.length?o[i]:o[o.length-1];};sap.ushell.utils.getCurrentHiddenGroupIds=function(m){var l=sap.ushell.Container.getService("LaunchPage"),g=m.getProperty('/groups'),h=[],G,a,b;for(a in g){b=g[a].isGroupVisible;if(g[a].object){G=l.getGroupId(g[a].object);}if(!b&&G!==undefined){h.push(G);}}return h;};sap.ushell.utils.hexToRgb=function(h){var i=!h||h[0]!='#'||(h.length!=4&&h.length!=7),r;h=!i&&h.length===4?'#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3]:h;r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);return r?{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)}:null;};sap.ushell.utils.getFormFactor=function(){var s=sap.ui.Device.system;if(s.desktop){return s.SYSTEMTYPE.DESKTOP;}if(s.tablet){return s.SYSTEMTYPE.TABLET;}if(s.phone){return s.SYSTEMTYPE.PHONE;}};sap.ushell.utils.getVisibleTiles=function(){var n=document.body.clientHeight,c=sap.ui.getCore().byId("dashboardGroups"),N=sap.ui.getCore().byId("viewPortContainer"),g,t,a,b,T,d,e,f,h,s=jQuery('#shell-hdr').height(),i=[],G,I,j;if(c&&c.getGroups()&&N){G=jQuery(c.getDomRef());I=G?G.is(":visible"):false;j=c.getGroups();for(g=0;g<j.length;g=g+1){a=j[g];b=a.getTiles();if(b){for(t=0;t<b.length;t=t+1){T=b[t];if(!I||window.document.hidden){T.isDisplayedInViewPort=false;i.push(T);}else{d=jQuery(T.getDomRef());e=d.offset();if(e){f=d.offset().top;h=f+d.height();T.isDisplayedInViewPort=a.getVisible()&&(h>s)&&(f<n);i.push(T);}}}}}}return i;};sap.ushell.utils.getTileObject=function(u){var b=u.getBindingContext();return b.getObject()?b.getObject().object:null;};sap.ushell.utils.addBottomSpace=function(){var j=jQuery('#dashboardGroups').find('.sapUshellTileContainer:visible');var l=j.last(),h=jQuery(".sapUshellShellHead > div").height(),a=l.parent().height(),g=parseInt(l.find(".sapUshellContainerTitle").css("margin-top"),10),b=parseInt(jQuery('.sapUshellDashboardGroupsContainer').css("padding-bottom"),10),n;if(j.length===1){n=0;}else{n=jQuery(window).height()-h-a-g-b;n=(n<0)?0:n;}jQuery('.sapUshellDashboardGroupsContainer').css("margin-bottom",n+"px");};sap.ushell.utils.calcVisibilityModes=function(g,p){var i=true,I=true,h=sap.ushell.utils.groupHasVisibleTiles(g.tiles,g.links);if(!h&&(!p||(g.isGroupLocked)||(g.isDefaultGroup))){i=false;}if(!h&&(!p)){I=false;}return[i,I];};sap.ushell.utils.groupHasVisibleTiles=function(g,a){var v=false,t,b,c=!g?[]:g,l=!a?[]:a;c=c.concat(l);if(c.length===0){return false;}for(t=0;t<c.length;t=t+1){b=c[t];if(b.isTileIntentSupported){v=true;break;}}return v;};sap.ushell.utils.invokeUnfoldingArrayArguments=function(f,A){var b,d,p,r,t;if(!jQuery.isArray(A[0])){return f.apply(this,A);}b=A[0];if(b.length===0){return new jQuery.Deferred().resolve([]).promise();}d=new jQuery.Deferred();p=[];r=[];t=new jQuery.Deferred().resolve();b.forEach(function(n,i){if(!jQuery.isArray(n)){jQuery.sap.log.error("Expected Array as nTh Argument of multivalue invokation: first Argument must be array of array of arguments: single valued f(p1,p2), f(p1_2,p2_2), f(p1_3,p2_3) : multivalued : f([[p1,p2],[p1_2,p2_2],[p1_3,p2_3]]");throw new Error("Expected Array as nTh Argument of multivalue invokation: first Argument must be array of array of arguments: single valued f(p1,p2), f(p1_2,p2_2), f(p1_3,p2_3) : multivalued : f([[p1,p2],[p1_2,p2_2],[p1_3,p2_3]]");}var c=f.apply(this,n),e=new jQuery.Deferred();c.done(function(){var a=Array.prototype.slice.call(arguments);r[i]=a;e.resolve();}).fail(e.reject.bind(e));p.push(e.promise());t=jQuery.when(t,e);});jQuery.when.apply(jQuery,p).done(function(){d.resolve(r);}).fail(function(){d.reject("failure");});return d.promise();};sap.ushell.utils.isClientSideNavTargetResolutionEnabled=function(){var d=true,l;if(jQuery.sap.storage===undefined){l=window.localStorage.getItem("targetresolution-client");l=(l===false||l==="false"||l==="")?false:true;}else{l=jQuery.sap.storage(jQuery.sap.getObject("jQuery.sap.storage.Type.local"),"targetresolution").get("client");}if(l===""||l===false||sap.ushell.utils.getParameterValueBoolean("sap-ushell-nav-cs")===false){return false;}return d;};sap.ushell.utils._getCurrentDate=function(){return new Date();};sap.ushell.utils._convertToUTC=function(d){var u=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds(),d.getUTCMilliseconds());return u;};sap.ushell.utils.formatDate=function(c){var C,n,t,d,h,m;C=sap.ushell.utils._convertToUTC(new Date(c));n=sap.ushell.utils._convertToUTC(sap.ushell.utils._getCurrentDate());t=n-C;d=parseInt(t/(1000*60*60*24),10);if(d>0){if(d===1){return sap.ushell.resources.i18n.getText("time_day",d);}return sap.ushell.resources.i18n.getText("time_days",d);}h=parseInt(t/(1000*60*60),10);if(h>0){if(h===1){return sap.ushell.resources.i18n.getText("time_hour",h);}return sap.ushell.resources.i18n.getText("time_hours",h);}m=parseInt(t/(1000*60),10);if(m>0){if(m===1){return sap.ushell.resources.i18n.getText("time_minute",m);}return sap.ushell.resources.i18n.getText("time_minutes",m);}return sap.ushell.resources.i18n.getText("just_now");};sap.ushell.utils.toExternalWithParameters=function(s,a,p){var c=sap.ushell.Container.getService("CrossApplicationNavigation"),t={},P={},i,T,b;t.target={semanticObject:s,action:a};if(p&&p.length>0){P={};for(i=0;i<p.length;i++){T=p[i].Key;b=p[i].Value;P[T]=b;}t.params=P;}c.toExternal(t);};sap.ushell.utils.moveElementInsideOfAnArray=function(a,n,b){var e,c;if(!a||n<0||b<0||typeof n!=="number"||typeof b!=="number"||n>a.length||b>a.length){return undefined;}else if(n===b){return a;}e=a[n];if(n<b){for(c=n;c<b;c++){a[c]=a[c+1];}}else if(n>b){for(c=n;c>b;c--){a[c]=a[c-1];}}a[b]=e;return a;};}());
