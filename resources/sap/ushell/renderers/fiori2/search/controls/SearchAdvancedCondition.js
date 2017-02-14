(function(){"use strict";jQuery.sap.require('sap.ui.layout.HorizontalLayout');jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchFacetDialogHelper');var s=sap.ushell.renderers.fiori2.search.SearchFacetDialogHelper;sap.ui.layout.HorizontalLayout.extend('sap.ushell.renderers.fiori2.search.controls.SearchAdvancedCondition',{metadata:{properties:{"type":""}},constructor:function(o){var t=this;o=jQuery.extend({},{allowWrapping:true,content:t.contentFactory(o.type)},o);sap.ui.layout.HorizontalLayout.prototype.constructor.apply(this,[o]);t.addStyleClass('sapUshellSearchFacetDialogDetailPageCondition');},renderer:'sap.ui.layout.HorizontalLayoutRenderer',contentFactory:function(t){var a=this;var A=new sap.m.CheckBox({select:function(e){if(t==="string"||t==="text"){s.updateCountInfo(e.getSource().getParent().getParent().getParent().getParent().getParent().getParent());}else{s.updateCountInfo(e.getSource().getParent().getParent().getParent());}}}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionCheckBox');var o=sap.ui.getCore().byId("operatorLabel");if(!o){o=new sap.ui.core.InvisibleText("operatorLabel",{text:sap.ushell.resources.i18n.getText("operator")});}var i,b,I,S;switch(t){case'date':i=new sap.m.DateRangeSelection({width:'86%',change:function(e){a.onDateRangeSelectionChange(e);}}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');break;case'string':A.setVisible(false);I=new sap.m.Input({width:'57%',placeholder:sap.ushell.resources.i18n.getText("filterCondition"),liveChange:function(e){a.onAdvancedInputChange(e);}}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');S=new sap.m.Select({width:'40%',tooltip:sap.ushell.resources.i18n.getText("operator"),items:[new sap.ui.core.Item({text:sap.ushell.resources.i18n.getText("equals"),key:'eq'}),new sap.ui.core.Item({text:sap.ushell.resources.i18n.getText("beginsWith"),key:'bw'}),new sap.ui.core.Item({text:sap.ushell.resources.i18n.getText("endsWith"),key:'ew'}),new sap.ui.core.Item({text:sap.ushell.resources.i18n.getText("contains"),key:'co'})]}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionSelect');S.addAriaLabelledBy("operatorLabel");i=new sap.ui.layout.HorizontalLayout({allowWrapping:true,content:[S,I]});b=new sap.m.Button({icon:"sap-icon://sys-cancel",type:sap.m.ButtonType.Transparent,tooltip:sap.ushell.resources.i18n.getText("removeButton"),press:function(e){a.onDeleteButtonPress(e);}});break;case'text':A.setVisible(false);I=new sap.m.Input({width:'57%',placeholder:sap.ushell.resources.i18n.getText("filterCondition"),liveChange:function(e){a.onAdvancedInputChange(e);}}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');S=new sap.m.Select({width:'40%',tooltip:sap.ushell.resources.i18n.getText("operator"),items:[new sap.ui.core.Item({text:sap.ushell.resources.i18n.getText("containsWords"),key:'co'})]}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionSelect');S.addAriaLabelledBy("operatorLabel");i=new sap.ui.layout.HorizontalLayout({allowWrapping:true,content:[S,I]});b=new sap.m.Button({icon:"sap-icon://sys-cancel",type:sap.m.ButtonType.Transparent,tooltip:sap.ushell.resources.i18n.getText("removeButton"),press:function(e){a.onDeleteButtonPress(e);}});break;case'number':var c=new sap.m.Input({width:'46.5%',placeholder:sap.ushell.resources.i18n.getText("fromPlaceholder"),liveChange:function(e){a.onAdvancedNumberInputChange(e);}}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');var d=new sap.m.Input({width:'46.5%',placeholder:sap.ushell.resources.i18n.getText("toPlaceholder"),liveChange:function(e){a.onAdvancedNumberInputChange(e);}}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');var l=new sap.m.Label({text:'...'}).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionLabel');i=new sap.ui.layout.HorizontalLayout({allowWrapping:true,content:[c,l,d]});i.addEventDelegate({onAfterRendering:function(e){var f=e.srcControl.getParent().getParent().getContent().length;var g=e.srcControl.getParent().getParent().indexOfAggregation("content",e.srcControl.getParent());if(g===f-2){var v=e.srcControl.getContent()[2].getValue();e.srcControl.getContent()[2].setValue();e.srcControl.getContent()[2].setValue(v);}}});break;default:break;}return[A,i,b];},onDateRangeSelectionChange:function(e){var d=e.getSource();var a=d.getParent();var A=a.getContent()[0];if(d.getDateValue()&&d.getSecondDateValue()){A.setSelected(true);s.insertNewAdvancedCondition(a,"date");s.updateCountInfo(a.getParent().getParent());}else{A.setSelected(false);}},onAdvancedInputChange:function(e){var i=e.getSource();var a=i.getParent().getParent();var A=a.getContent()[0];if(i.getValue()){A.setSelected(true);s.updateCountInfo(a.getParent().getParent().getParent().getParent().getParent());}else{A.setSelected(false);}},onDeleteButtonPress:function(e){var a=e.getSource().getParent();s.deleteAdvancedCondition(a);},onAdvancedNumberInputChange:function(e){var i=e.getSource();var a=i.getParent().getParent();var A=a.getContent()[0];if(i.getParent().getContent()[0].getValue()&&i.getParent().getContent()[2].getValue()){A.setSelected(true);s.insertNewAdvancedCondition(a,"number");s.updateCountInfo(a.getParent().getParent());}else{A.setSelected(false);}}});})();
