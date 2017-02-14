/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape","sap/gantt/misc/Utility","sap/gantt/misc/Format"],function(S,U,F){"use strict";var L=S.extend("sap.gantt.shape.Line",{metadata:{properties:{tag:{type:"string",defaultValue:"line"},isDuration:{type:"boolean",defaultValue:true},x1:{type:"float"},y1:{type:"float"},x2:{type:"float"},y2:{type:"float"}}}});L.prototype.init=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",r.getText("ARIA_LINE"));};L.prototype.getX1=function(d,r){if(this.mShapeConfig.hasShapeProperty("x1")){return this._configFirst("x1",d);}return this.getAxisTime().timeToView(F.abapTimestampToDate(this.getTime(d,r)));};L.prototype.getY1=function(d,r){if(this.mShapeConfig.hasShapeProperty("y1")){return this._configFirst("y1",d,true);}return this.getRowYCenter(d,r);};L.prototype.getX2=function(d,r){if(this.mShapeConfig.hasShapeProperty("x2")){return this._configFirst("x2",d);}return this.getAxisTime().timeToView(F.abapTimestampToDate(this.getEndTime(d,r)));};L.prototype.getY2=function(d,r){if(this.mShapeConfig.hasShapeProperty("y2")){return this._configFirst("y2",d,true);}return this.getRowYCenter(d,r);};return L;},true);
