// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";sap.ui.getCore().loadLibrary("sap.m");jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.ushell.components.tiles.utils");jQuery.sap.require("sap.ushell.components.tiles.utilsRT");sap.ui.controller("sap.ushell.components.tiles.cdm.applauncher.StaticTile",{_getConfiguration:function(){var v=this.getView().getViewData(),c={};c.configuration=v.configuration;c.properties=v.properties;var s=c.configuration["sap-system"];var t=c.properties.targetURL;if(t&&s){t+=((t.indexOf("?")<0)?"?":"&")+"sap-system="+s;c.properties.targetURL=t;}return c;},onInit:function(){var v=this.getView();var m=new sap.ui.model.json.JSONModel();m.setData(this._getConfiguration());v.setModel(m);},onPress:function(e){var t=this.getView().getModel().getProperty("/properties/targetURL");if(!t){return;}if(t[0]==='#'){hasher.setHash(t);}else{window.open(t,'_blank');}},updatePropertiesHandler:function(n){var p=this.getView().getModel().getProperty("/properties");var c=false;if(typeof n.title!=='undefined'){p.title=n.title;c=true;}if(typeof n.subtitle!=='undefined'){p.subtitle=n.subtitle;c=true;}if(typeof n.icon!=='undefined'){p.icon=n.icon;c=true;}if(c){this.getView().getModel().setProperty("/properties",p);}}});}());
