/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.controller.sortPropertyType");(function(){"use strict";sap.apf.modeler.ui.controller.sortPropertyType.extend("sap.apf.modeler.ui.controller.stepSortPropertyType",{onBeforeRendering:function(){var c=this;c.byId("idGridSortLabel").setSpan("L4 M4 S4");c.byId("idGridSortProperty").setSpan("L2 M2 S2");c.byId("idGridSortDirectionLabel").setSpan("L2 M2 S2");c.byId("idGridSortDirection").setSpan("L2 M2 S2");c.byId("idGridIconLayout").setSpan("L2 M2 S2");},updateSortProperties:function(s){var c=this;c.oParentObject.setTopNSortProperties(s);},getAllPropertiesAsPromise:function(){var c=this,a,s,p;var t=new sap.apf.modeler.ui.utils.TextManipulator();var d=jQuery.Deferred();c.oParentObject.getConsumablePropertiesForTopN().done(function(r){a=r.consumable;s=c.getSelectedSortProperty();if(s!==undefined){p=a.indexOf(s)!==-1?a:a.concat(s);a=r.available.indexOf(s)!==-1?p:a.concat(t.addPrefixText([s],sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));s=r.available.indexOf(s)!==-1?s:t.addPrefixText([s],sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)[0];}d.resolve({aAllProperties:a,sSelectedKey:s});});return d.promise();},getOrderBy:function(){var c=this;return c.oParentObject.getTopN().orderby;},setNextPropertyInParentObject:function(){var c=this;c.updateSortProperty(c.getView().getViewData().oPropertyTypeData.sProperty,c.getView().getViewData().oPropertyTypeData.sContext);c.byId("idSortDirection").setSelectedKey("true");},removePropertyFromParentObject:function(){var c=this;c.updateSortProperty(c.getView().getViewData().oPropertyTypeData.sProperty,c.getView().getViewData().oPropertyTypeData.sContext);},addProperty:function(){var c=this;var C=sap.apf.modeler.ui.utils.CONSTANTS.events;c.oParentObject.getConsumablePropertiesForTopN().done(function(r){c.getView().fireEvent(C.ADDPROPERTY,{"sProperty":r.consumable[0],"sContext":c.getView().getViewData().oPropertyTypeData.sContext});c.oConfigurationEditor.setIsUnsaved();});},addRemovedProperty:function(e){var c=this;var p=e.getParameter("sProperty");var i=new sap.ui.core.Item({key:p,text:p});c.byId("idSortProperty").addItem(i);},removeAddedProperty:function(e){var c=this;var p=e.getParameter("sProperty");var i=c.byId("idSortProperty").getItems();i.forEach(function(I){if(I.getKey()===p){c.byId("idSortProperty").removeItem(I);}});}});}());
