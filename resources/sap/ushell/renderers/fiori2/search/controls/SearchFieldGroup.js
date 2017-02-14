(function(){"use strict";jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchSelect');jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchInput');jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchButton');sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.SearchFieldGroup",{metadata:{properties:{"selectActive":{defaultValue:true,type:"boolean"},"inputActive":{defaultValue:true,type:"boolean"},"buttonActive":{defaultValue:true,type:"boolean"},"cancelButtonActive":{defaultValue:true,type:"boolean"}},aggregations:{"_flexBox":{type:"sap.m.FlexBox",multiple:false,visibility:"hidden"}}},constructor:function(){sap.ui.core.Control.prototype.constructor.apply(this,arguments);var t=this;t.initSelect();t.initInput();t.initButton();t.initCancelButton();t.initFlexBox();},setCancelButtonActive:function(a){if(a===this.getProperty('cancelButtonActive')){return;}this.setProperty('cancelButtonActive',a);this.initFlexBox();},initFlexBox:function(){if(!this.select){return;}var a=[];if(this.getSelectActive()){this.select.setLayoutData(new sap.m.FlexItemData({growFactor:0}));a.push(this.select);}if(this.getInputActive()){this.input.setLayoutData(new sap.m.FlexItemData({growFactor:1}));a.push(this.input);}if(this.getButtonActive()){this.button.setLayoutData(new sap.m.FlexItemData({growFactor:0}));a.push(this.button);}if(this.getCancelButtonActive()){this.cancelButton.setLayoutData(new sap.m.FlexItemData({growFactor:0}));a.push(this.cancelButton);}var f=this.getAggregation('_flexBox');if(!f){f=new sap.m.FlexBox({alignItems:sap.m.FlexAlignItems.Start,items:a});this.setAggregation('_flexBox',f);}else{f.removeAllAggregation('items');for(var i=0;i<a.length;++i){f.addItem(a[i]);}}},initSelect:function(){var t=this;t.select=new sap.ushell.renderers.fiori2.search.controls.SearchSelect(t.getId()+'-select',{});t.select.attachChange(function(){if(t.getAggregation("input")){var i=t.getAggregation("input");i.destroySuggestionRows();}});},initInput:function(){var t=this;t.input=new sap.ushell.renderers.fiori2.search.controls.SearchInput(t.getId()+'-input',{});},initButton:function(){var t=this;t.button=new sap.ushell.renderers.fiori2.search.controls.SearchButton(t.getId()+'-button',{tooltip:"{i18n>searchbox_tooltip}",ariaLabel:"{i18n>searchbox_tooltip}",press:function(e){var m=t.button.getModel();if(t.input.getValue()===""&&m.getDataSource().equals(m.getDefaultDataSource())){return;}m.invalidateQuery();t.input.destroySuggestionRows();t.input.triggerSearch(e);}});},initCancelButton:function(){this.cancelButton=new sap.m.Button({text:'{i18n>cancelBtn}'});this.cancelButton.addStyleClass("sapUshellSearchCancelButton");},setModel:function(m){this.select.setModel(m);this.input.setModel(m);this.button.setModel(m);this.cancelButton.setModel(m);},renderer:function(r,c){r.write('<div');r.writeControlData(c);r.addClass("SearchFieldGroup");r.writeClasses();r.write('>');r.renderControl(c.getAggregation('_flexBox'));r.write('</div>');}});}());