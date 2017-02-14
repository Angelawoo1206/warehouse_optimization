/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./P13nConditionPanel','./P13nPanel','./library','sap/ui/core/Control'],function(q,P,a,l,C){"use strict";var c=a.extend("sap.m.P13nGroupPanel",{metadata:{library:"sap.m",properties:{maxGroups:{type:"string",group:"Misc",defaultValue:'-1'},containerQuery:{type:"boolean",group:"Misc",defaultValue:false},layoutMode:{type:"string",group:"Misc",defaultValue:null}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content",visibility:"hidden"},groupItems:{type:"sap.m.P13nGroupItem",multiple:true,singularName:"groupItem",bindable:"bindable"}},events:{addGroupItem:{parameters:{}},removeGroupItem:{},updateGroupItem:{}}},renderer:function(r,o){r.write("<section");r.writeControlData(o);r.addClass("sapMGroupPanel");r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapMGroupPanelContent");r.addClass("sapMGroupPanelBG");r.writeClasses();r.write(">");var b=o.getAggregation("content");var L=b.length;for(var i=0;i<L;i++){r.renderControl(b[i]);}r.write("</div>");r.write("</section>");}});c.prototype.setMaxGroups=function(m){this.setProperty("maxGroups",m);if(this._oGroupPanel){this._oGroupPanel.setMaxConditions(m);}};c.prototype._getConditions=function(){return this._oGroupPanel.getConditions();};c.prototype.setContainerQuery=function(b){this.setProperty("containerQuery",b);this._oGroupPanel.setContainerQuery(b);};c.prototype.setLayoutMode=function(m){this.setProperty("layoutMode",m);this._oGroupPanel.setLayoutMode(m);};c.prototype.validateConditions=function(){return this._oGroupPanel.validateConditions();};c.prototype.removeInvalidConditions=function(){this._oGroupPanel.removeInvalidConditions();};c.prototype.removeValidationErrors=function(){this._oGroupPanel.removeValidationErrors();};c.prototype.onBeforeNavigationFrom=function(){return this.validateConditions();};c.prototype.onAfterNavigationFrom=function(){return this.removeInvalidConditions();};c.prototype.setOperations=function(o){this._aOperations=o;if(this._oGroupPanel){this._oGroupPanel.setOperations(this._aOperations);}};c.prototype.init=function(){this.setType(sap.m.P13nPanelType.group);this.setTitle(sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("GROUPPANEL_TITLE"));sap.ui.getCore().loadLibrary("sap.ui.layout");q.sap.require("sap.ui.layout.Grid");sap.ui.layout.Grid.prototype.init.apply(this);this._aKeyFields=[];this.addStyleClass("sapMGroupPanel");if(!this._aOperations){this.setOperations([sap.m.P13nConditionOperation.GroupAscending,sap.m.P13nConditionOperation.GroupDescending]);}this._oGroupPanel=new P({maxConditions:this.getMaxGroups(),autoReduceKeyFieldItems:true,layoutMode:this.getLayoutMode(),dataChange:this._handleDataChange(),validationExecutor:q.proxy(this._callValidationExecutor,this)});this._oGroupPanel.setOperations(this._aOperations);this._oGroupPanel._sAddRemoveIconTooltipKey="GROUP";this.addAggregation("content",this._oGroupPanel);};c.prototype.exit=function(){var d=function(o){if(o&&o.destroy){o.destroy();}return null;};this._aKeyFields=d(this._aKeyFields);this._aOperations=d(this._aOperations);};c.prototype.onBeforeRendering=function(){if(this._bUpdateRequired){this._bUpdateRequired=false;var k=[];var m=(this.getBindingInfo("items")||{}).model;var g=function(n,o,i){var B=i.getBinding(n);if(B&&o){return o.getObject()[B.getPath()];}return i.getMetadata().getProperty(n)?i.getProperty(n):i.getAggregation(n);};this.getItems().forEach(function(i){var o=i.getBindingContext(m);if(i.getBinding("key")){o.getObject()[i.getBinding("key").getPath()]=i.getKey();}k.push({key:i.getColumnKey(),text:g("text",o,i),tooltip:g("tooltip",o,i)});});k.splice(0,0,{key:null,text:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_SELECTION_NONE")});this._oGroupPanel.setKeyFields(k);var b=[];m=(this.getBindingInfo("groupItems")||{}).model;this.getGroupItems().forEach(function(G){var o=G.getBindingContext(m);if(G.getBinding("key")){o.getObject()[G.getBinding("key").getPath()]=G.getKey();}b.push({key:G.getKey(),keyField:g("columnKey",o,G),operation:g("operation",o,G),showIfGrouped:g("showIfGrouped",o,G)});});this._oGroupPanel.setConditions(b);}};c.prototype.addItem=function(i){a.prototype.addItem.apply(this,arguments);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}};c.prototype.removeItem=function(i){a.prototype.removeItem.apply(this,arguments);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}};c.prototype.destroyItems=function(){this.destroyAggregation("items");if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};c.prototype.addGroupItem=function(g){this.addAggregation("groupItems",g,true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}};c.prototype.insertGroupItem=function(g,i){this.insertAggregation("groupItems",g,i,true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};c.prototype.updateGroupItems=function(r){this.updateAggregation("groupItems");if(r=="change"&&!this._bIgnoreBindCalls){this._bUpdateRequired=true;}};c.prototype.removeGroupItem=function(g){g=this.removeAggregation("groupItems",g,true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return g;};c.prototype.removeAllGroupItems=function(){var g=this.removeAllAggregation("groupItems",true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return g;};c.prototype.destroyGroupItems=function(){this.destroyAggregation("groupItems");if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};c.prototype._handleDataChange=function(){var t=this;return function(e){var n=e.getParameter("newData");var o=e.getParameter("operation");var k=e.getParameter("key");var i=e.getParameter("index");var g;if(o==="update"){g=t.getGroupItems()[i];if(g){g.setColumnKey(n.keyField);g.setOperation(n.operation);g.setShowIfGrouped(n.showIfGrouped);}t.fireUpdateGroupItem({key:k,index:i,groupItemData:g});t._notifyChange();}if(o==="add"){g=new sap.m.P13nGroupItem({key:k,columnKey:n.keyField,operation:n.operation,showIfGrouped:n.showIfGrouped});t._bIgnoreBindCalls=true;t.fireAddGroupItem({key:k,index:i,groupItemData:g});t._bIgnoreBindCalls=false;t._notifyChange();}if(o==="remove"){t._bIgnoreBindCalls=true;t.fireRemoveGroupItem({key:k,index:i});t._bIgnoreBindCalls=false;t._notifyChange();}};};c.prototype.getOkPayload=function(){if(!this.getModel()){return null;}var s=[];this._oGroupPanel._oConditionsGrid.getContent().forEach(function(o){var b=o.keyField;s.push(b.getSelectedKey());});return{selectedColumnKeys:s};};c.prototype._callValidationExecutor=function(){var v=this.getValidationExecutor();if(v){v();}};c.prototype._updateValidationResult=function(v){this._oGroupPanel._oConditionsGrid.getContent().forEach(function(o){var b=o.keyField;b.setValueStateText("");b.setValueState("None");var s=b.getSelectedKey();v.forEach(function(r){if(r.columnKey===s){b.setValueStateText(r.messageText);b.setValueState(r.messageType);}});});};c.prototype.setValidationListener=function(L){this.setProperty("validationListener",L);if(L){L(this,q.proxy(this._updateValidationResult,this));}};c.prototype._notifyChange=function(){var L=this.getChangeNotifier();if(L){L(this);}};return c;},true);
