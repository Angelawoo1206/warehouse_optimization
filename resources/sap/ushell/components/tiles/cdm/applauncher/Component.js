// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.components.tiles.cdm.applauncher.Component");sap.ui.define(["sap/ui/core/UIComponent"],function(U){return U.extend("sap.ushell.components.tiles.cdm.applauncher.Component",{metadata:{"manifest":"json"},createContent:function(){var c=this.getComponentData();var m=this.getManifestEntry("/sap.ui5/config")||{};var p=c.properties.tilePersonalization||{};var M=jQuery.extend(m,p);var s=c.startupParameters;if(s&&s["sap-system"]){M["sap-system"]=s["sap-system"][0];}var t=sap.ui.view({type:sap.ui.core.mvc.ViewType.JS,viewName:"sap.ushell.components.tiles.cdm.applauncher.StaticTile",viewData:{properties:c.properties,configuration:M}});this._oController=t.getController();return t;},tileSetVisualProperties:function(n){if(this._oController){this._oController.updatePropertiesHandler(n);}},tileRefresh:function(){},tileSetVisible:function(i){},exit:function(){this._oController=null;}});});}());
