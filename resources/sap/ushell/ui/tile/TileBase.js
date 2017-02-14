/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
jQuery.sap.declare("sap.ushell.ui.tile.TileBase");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ushell.ui.tile.TileBase",{metadata:{library:"sap.ushell",properties:{"title":{type:"string",group:"Data",defaultValue:null},"subtitle":{type:"string",group:"Data",defaultValue:null},"icon":{type:"string",group:"Data",defaultValue:null},"info":{type:"string",group:"Data",defaultValue:null},"infoState":{type:"sap.ushell.ui.tile.State",group:"",defaultValue:sap.ushell.ui.tile.State.Neutral},"targetURL":{type:"string",group:"Behavior",defaultValue:null},"highlightTerms":{type:"any",group:"Appearance",defaultValue:[]}},aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},events:{"press":{}}}});sap.ushell.ui.tile.TileBase.M_EVENTS={'press':'press'};(function(){"use strict";sap.ushell.ui.tile.TileBase.prototype.ontap=function(e){this.firePress({});};sap.ushell.ui.tile.TileBase.prototype.onsapenter=function(e){this.firePress({});};sap.ushell.ui.tile.TileBase.prototype.onsapspace=function(e){this.firePress({});};}());
