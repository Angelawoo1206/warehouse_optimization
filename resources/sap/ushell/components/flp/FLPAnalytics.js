(function(){"use strict";jQuery.sap.declare("sap.ushell.components.flp.FLPAnalytics");var o=["appOpened","deleteTile","createGroup","actionModeActive","catalogTileClick","dashboardTileClick","dashboardTileLinkClick"],E=sap.ui.getCore().getEventBus(),t=this,l={};function s(c){var m=sap.ushell.services.AppConfiguration.getMetadata();l[c]={};l[c].startTime=new Date();l[c].title=m.title;}function a(c){var d=0;try{d=(new Date()-l[c].startTime)/1000;sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Time in Application (sec)",d,[l[c].title]);}catch(e){jQuery.sap.log.warning("Duration in application "+c+" could not be calculated",null,"sap.ushell.components.flp.FLPAnalytics");}}function h(c,d,D){var A=hasher.getHash(),f;window.swa.custom1={ref:A};switch(d){case'appOpened':s(A);sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Opened","Direct Launch",[l[A].title]);E.unsubscribe("launchpad","appOpened",h);break;case'bookmarkTileAdded':f=window.document.title;sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Personalization","Save as Tile",[f,D&&D.group&&D.group.title?D.group.title:"",D&&D.group&&D.group.id?D.group.id:"",D&&D.tile&&D.tile.title?D.tile.title:f]);break;case'actionModeActive':sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Personalization","Enter Action Mode",[D.source]);break;case'catalogTileClick':sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Launch point","Catalog",[]);break;case'dashboardTileClick':sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Launch point","Homepage",[]);break;case'dashboardTileLinkClick':window.swa.custom1={ref:D.targetHash.substr(1)};sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Launch point","Tile Group Link",[]);break;default:break;}}function b(c){var f,T,d;if(c.getParameter("from")&&c.getParameter("to")){f=c.getParameter("from").getId().replace("application-","").replace("applicationShellPage-","");window.swa.custom1={ref:f};a(f);d=c.getParameter("to");T=d.getId().replace("application-","").replace("applicationShellPage-","");s(T);window.swa.custom1={ref:T};sap.ushell.Container.getService("UsageAnalytics").logCustomEvent("FLP: Application Opened","Fiori Navigation",[l[T].title]);}}jQuery(window).unload(function(c){var d=window.location.hash.substr(1);a(d);});try{sap.ui.getCore().byId('viewPortContainer').attachAfterNavigate(b,t);}catch(e){jQuery.sap.log.warning("Failure when subscribing to viewPortContainer 'AfterNavigate' event",null,"sap.ushell.components.flp.FLPAnalytics");}E.subscribe("sap.ushell.services.Bookmark","bookmarkTileAdded",h,t);o.forEach(function(c,i,d){E.subscribe("launchpad",c,h,t);});})();
