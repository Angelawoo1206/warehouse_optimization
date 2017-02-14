/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./TransformationMatrix","./DvlException"],function(q,T,D){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.vk",dependencies:["sap.ui.core"],types:["sap.ui.vk.ContentResourceSourceCategory","sap.ui.vk.TransformationMatrix"],interfaces:[],controls:["sap.ui.vk.NativeViewport","sap.ui.vk.Overlay","sap.ui.vk.Viewer","sap.ui.vk.Viewport","sap.ui.vk.SceneTree","sap.ui.vk.StepNavigation","sap.ui.vk.Toolbar","sap.ui.vk.ContainerBase","sap.ui.vk.ContainerContent","sap.ui.vk.MapContainer","sap.ui.vk.ListPanelStack","sap.ui.vk.ListPanel","sap.ui.vk.LegendItem","sap.ui.vk.DockManager","sap.ui.vk.DockContainer","sap.ui.vk.DockPane"],elements:["sap.ui.vk.OverlayArea"],noLibraryCSS:false,version:"1.44.5"});sap.ui.vk.GraphicsCoreApi={LegacyDvl:"LegacyDvl"};sap.ui.vk.ContentResourceSourceCategory={"3D":"3D","2D":"2D"};sap.ui.vk.ContentResourceSourceTypeToCategoryMap={"vds":sap.ui.vk.ContentResourceSourceCategory["3D"],"vdsl":sap.ui.vk.ContentResourceSourceCategory["3D"],"cgm":sap.ui.vk.ContentResourceSourceCategory["3D"],"png":sap.ui.vk.ContentResourceSourceCategory["2D"],"jpg":sap.ui.vk.ContentResourceSourceCategory["2D"],"gif":sap.ui.vk.ContentResourceSourceCategory["2D"],"bmp":sap.ui.vk.ContentResourceSourceCategory["2D"],"tiff":sap.ui.vk.ContentResourceSourceCategory["2D"],"tif":sap.ui.vk.ContentResourceSourceCategory["2D"],"svg":sap.ui.vk.ContentResourceSourceCategory["2D"]};var d="sap.ve.dvl";sap.ui.vk.dvl={checkResult:function(r){if(r<0){var m=sap.ve.dvl.DVLRESULT.getDescription?sap.ve.dvl.DVLRESULT.getDescription(r):"";q.sap.log.error(m,JSON.stringify({errorCode:r}),d);throw new D(r,m);}return r;},getPointer:function(p){if(p.indexOf("errorcode")===0){var c=parseInt(p.substr(15),16)-0x100;var m=sap.ve.dvl.DVLRESULT.getDescription?sap.ve.dvl.DVLRESULT.getDescription(c):"";q.sap.log.error(m,JSON.stringify({errorCode:c}),d);throw new D(c,m);}return p;},getJSONObject:function(o){if(q.type(o)==="number"){var m=sap.ve.dvl.DVLRESULT.getDescription?sap.ve.dvl.DVLRESULT.getDescription(o):"";q.sap.log.error(m,JSON.stringify({errorCode:o}),d);throw new D(o,m);}return o;}};sap.ui.vk.getResourceBundle=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.vk.i18n");sap.ui.vk.getResourceBundle=function(){return r;};return r;};sap.ui.vk.utf8ArrayBufferToString=function(a){return decodeURIComponent(escape(String.fromCharCode.apply(null,new Uint8Array(a))));};sap.ui.vk.Redline={ElementType:{Rectangle:"rectangle",Ellipse:"ellipse",Freehand:"freehand"},svgNamespace:"http://www.w3.org/2000/svg"};sap.ui.vk.VisibilityMode={Complete:"complete",Differences:"differences"};return sap.ui.vk;});