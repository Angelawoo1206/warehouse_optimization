/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ProcessFlowConnection");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ProcessFlowConnection",{metadata:{library:"sap.suite.ui.commons",properties:{"drawData":{type:"object[]",group:"Misc",defaultValue:null},"zoomLevel":{type:"sap.suite.ui.commons.ProcessFlowZoomLevel",group:"Misc",defaultValue:sap.suite.ui.commons.ProcessFlowZoomLevel.Two},"type":{type:"sap.suite.ui.commons.ProcessFlowConnectionType",group:"Appearance",defaultValue:sap.suite.ui.commons.ProcessFlowConnectionType.Normal,deprecated:true},"state":{type:"sap.suite.ui.commons.ProcessFlowConnectionState",group:"Appearance",defaultValue:sap.suite.ui.commons.ProcessFlowConnectionState.Regular,deprecated:true}},defaultAggregation:"_labels",aggregations:{"_labels":{type:"sap.suite.ui.commons.ProcessFlowConnectionLabel",multiple:true,singularName:"_label",visibility:"hidden"}}}});sap.suite.ui.commons.ProcessFlowConnection.prototype._oResBundle=null;sap.suite.ui.commons.ProcessFlowConnection.prototype._showLabels=false;sap.suite.ui.commons.ProcessFlowConnection.prototype._oStateOrderMapping=null;
sap.suite.ui.commons.ProcessFlowConnection.prototype.init=function(){if(!this._oResBundle){this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");}this._oStateOrderMapping={};this._oStateOrderMapping[sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral]=1;this._oStateOrderMapping[sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive]=2;this._oStateOrderMapping[sap.suite.ui.commons.ProcessFlowConnectionLabelState.Critical]=3;this._oStateOrderMapping[sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative]=4;};
sap.suite.ui.commons.ProcessFlowConnection.prototype._getAriaText=function(t){var a="";var A=" "+this._oResBundle.getText('PF_CONNECTION_ENDS');if(this._isHorizontalLine(t)){a=this._oResBundle.getText('PF_CONNECTION_HORIZONTAL_LINE');if(t.arrow){a+=A;}}else if(this._isVerticalLine(t)){a=this._oResBundle.getText('PF_CONNECTION_VERTICAL_LINE');if(t.arrow){a+=A;}}else{a=this._oResBundle.getText('PF_CONNECTION_BRANCH');if(t.arrow){a+=A;}}return a;};
sap.suite.ui.commons.ProcessFlowConnection.prototype._getVisibleLabel=function(){var v=null;if(this.getAggregation("_labels")){var l=this.getAggregation("_labels");for(var i=0;i<l.length;i++){var c=l[i];if(c instanceof sap.suite.ui.commons.ProcessFlowConnectionLabel){if(v){if(this._oStateOrderMapping[v.getState()]<this._oStateOrderMapping[c.getState()]){v=c;}else if(this._oStateOrderMapping[v.getState()]===this._oStateOrderMapping[c.getState()]){if(v.getPriority()<c.getPriority()){v=c;}}}else{v=c;}}}}return v;};
sap.suite.ui.commons.ProcessFlowConnection.prototype._getShowLabels=function(){return sap.suite.ui.commons.ProcessFlowConnection.prototype._showLabels;};
sap.suite.ui.commons.ProcessFlowConnection.prototype._setShowLabels=function(s){sap.suite.ui.commons.ProcessFlowConnection.prototype._showLabels=s;};
sap.suite.ui.commons.ProcessFlowConnection.prototype._traverseConnectionData=function(){var c=this.getDrawData();if(!c){return{};}var t=this._createConnection(c);if(this.getAggregation("_labels")){t.labels=this.getAggregation("_labels");}return t;};
sap.suite.ui.commons.ProcessFlowConnection.prototype._isVerticalLine=function(c){if(c.hasOwnProperty("left")&&!c.left.draw&&c.hasOwnProperty("right")&&!c.right.draw&&c.hasOwnProperty("top")&&c.top.draw&&c.hasOwnProperty("bottom")&&c.bottom.draw){return true;}else{return false;}};
sap.suite.ui.commons.ProcessFlowConnection.prototype._isHorizontalLine=function(c){if(c.hasOwnProperty("left")&&c.left.draw&&c.hasOwnProperty("right")&&c.right.draw&&c.hasOwnProperty("top")&&!c.top.draw&&c.hasOwnProperty("bottom")&&!c.bottom.draw){return true;}else{return false;}};
sap.suite.ui.commons.ProcessFlowConnection.prototype._createConnection=function(c){var l={draw:false,type:"",state:""};var C={right:l,top:l,left:l,bottom:l,arrow:false};for(var i=0;i<c.length;i++){C.right=this._createLine(c[i],"r",C.right);C.top=this._createLine(c[i],"t",C.top);C.left=this._createLine(c[i],"l",C.left);C.bottom=this._createLine(c[i],"b",C.bottom);if(c[i].flowLine.indexOf("r")>=0){if(c[i].hasArrow){C.arrow=true;}}}return C;};
sap.suite.ui.commons.ProcessFlowConnection.prototype._createLine=function(c,d,l){var L={draw:l.draw,type:l.type,state:l.state};if(c.flowLine.indexOf(d)>=0){L.draw=true;if(c.targetNodeState===sap.suite.ui.commons.ProcessFlowNodeState.Neutral||c.targetNodeState===sap.suite.ui.commons.ProcessFlowNodeState.Positive||c.targetNodeState===sap.suite.ui.commons.ProcessFlowNodeState.Negative||c.targetNodeState===sap.suite.ui.commons.ProcessFlowNodeState.Critical){L.type=sap.suite.ui.commons.ProcessFlowConnectionType.Normal;}else if(c.targetNodeState===sap.suite.ui.commons.ProcessFlowNodeState.Planned||c.targetNodeState===sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative){if(L.type!==sap.suite.ui.commons.ProcessFlowConnectionType.Normal){L.type=sap.suite.ui.commons.ProcessFlowConnectionType.Planned;}}if(c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.Selected||c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.SelectedHighlighted||c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.SelectedHighlightedFocused||c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.SelectedFocused){L.state=sap.suite.ui.commons.ProcessFlowConnectionState.Selected;}else if(c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted||c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.HighlightedFocused){if(L.state!==sap.suite.ui.commons.ProcessFlowConnectionState.Selected){L.state=sap.suite.ui.commons.ProcessFlowConnectionState.Highlighted;}}else if(c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.Regular||c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.RegularFocused){if(L.state!==sap.suite.ui.commons.ProcessFlowConnectionState.Highlighted&&L.state!==sap.suite.ui.commons.ProcessFlowConnectionState.Selected){L.state=sap.suite.ui.commons.ProcessFlowConnectionState.Regular;}}else if(c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed||c.displayState===sap.suite.ui.commons.ProcessFlowDisplayState.DimmedFocused){if(L.state!==sap.suite.ui.commons.ProcessFlowConnectionState.Highlighted&&L.state!==sap.suite.ui.commons.ProcessFlowConnectionState.Regular&&L.state!==sap.suite.ui.commons.ProcessFlowConnectionState.Selected){L.state=sap.suite.ui.commons.ProcessFlowConnectionState.Dimmed;}}}return L;};
sap.suite.ui.commons.ProcessFlowConnection.prototype.addConnectionData=function(s){var t=this.getDrawData();if(!t){t=[];}t.push(s);this.setDrawData(t);return t;};
sap.suite.ui.commons.ProcessFlowConnection.prototype.destroyAggregation=function(a,s){this.removeAllAggregation("_labels",true);};
