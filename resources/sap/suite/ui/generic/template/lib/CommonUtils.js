sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/ui/Device","sap/ui/model/json/JSONModel","sap/ui/comp/smarttable/SmartTable","sap/ui/table/Table","sap/m/Table","sap/m/ListBase","sap/m/MessageBox","sap/ui/generic/app/navigation/service/NavigationHandler","sap/ui/generic/app/navigation/service/NavError","sap/suite/ui/generic/template/lib/testableHelper"],function(q,B,D,J,S,U,R,L,M,N,a,t){"use strict";function g(p,e){for(var i in p){var E=p[i];if(E.entitySet===e&&E.component.list&&E.navigationProperty){return E.navigationProperty;}else if(E.pages){var r=g(E.pages,e);if(r){return r;}}}}function b(c,s,C){var n;function A(i){s.oApplication.attachControlToParent(i,c.getView());}function d(i,j,Y,Z){return s.oApplication.getDialogFragmentForView(c.getView(),i,j,Y,Z);}var r;function e(){r=r||c.getOwnerComponent().getModel("i18n").getResourceBundle();return r.getText.apply(r,arguments);}function f(){var i=s.oDraftController.getDraftContext();return i.isDraftEnabled(c.getOwnerComponent().getEntitySet());}function h(j){var Y=[];if(j instanceof S){j=j.getTable();}else if(j instanceof sap.ui.comp.smartchart.SmartChart){j=j.getChart();if(j instanceof sap.chart.Chart){var Z=j.getSelectedDataPoints();if(Z.count>0){var $=Z.dataPoints;for(var i=0;i<$.length;i++){Y.push($[i].context);}}}}if(j instanceof L){Y=j.getSelectedContexts();}else if(j instanceof U){var _=j.getSelectedIndices();for(var i=0;i<_.length;i++){Y.push(j.getContextByIndex(_[i]));}}return Y;}function k(j){var Y,Z,$,_,a1,b1;var c1=this.getOwnerControl(j);var d1=c1.getMetadata().getName();if(d1!=="sap.ui.comp.smarttable.SmartTable"&&d1!=="sap.ui.comp.smartchart.SmartChart"){c1=c1.getParent();d1=c1.getMetadata().getName();}var e1=this.getSelectedContexts(c1);var f1=c1.getModel();var g1=f1.getMetaModel();var h1=c.getView();if(d1==="sap.ui.comp.smarttable.SmartTable"){Y=c1.getCustomToolbar()&&c1.getCustomToolbar().getContent();Z=this.getBreakoutActionsForTable(c1);this.fillEnabledMapForBreakoutActions(Z,e1,f1);}else if(d1==="sap.ui.comp.smartchart.SmartChart"){Y=c1.getToolbar()&&c1.getToolbar().getContent();}if(Y&&Y.length>0){for(var i=0;i<Y.length;i++){a1=undefined;$=Y[i];if($.getMetadata().getName()==="sap.m.Button"&&$.getVisible()){b1=this.getElementCustomData($);if(b1&&b1.Type){_=h1.getLocalId($.getId());if(b1.Type==="CRUDActionDelete"){a1=p(f1,g1,e1,c1);}else if(b1.Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"||b1.Type==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){a1=o(f1,g1,e1,b1.Type,b1.Action);}}if(/generic\/controlProperties/.test($.getBindingPath("enabled"))&&a1!==undefined){m(_,"enabled",a1);}}}}}function l(i,c){var j=this.getBreakoutActionsForFooter(c);var Y=this.getSelectedContexts(i);var Z=i.getModel();this.fillEnabledMapForBreakoutActions(j,Y,Z);}function m(i,j,Y){var Z=c.getView().getModel("_templPriv");var $=Z.getProperty("/generic/controlProperties/"+i);if(!$){$={};$[j]=Y;Z.setProperty("/generic/controlProperties/"+i,$);}else{Z.setProperty("/generic/controlProperties/"+i+"/"+j,Y);}}function o(i,Y,Z,$,_){var a1,b1,c1,d1;var e1=false;if($==="com.sap.vocabularies.UI.v1.DataFieldForAction"){a1=Y.getODataFunctionImport(_);c1=a1&&a1["sap:action-for"];if(c1&&c1!==""&&c1!==" "){if(Z.length>0){d1=a1["sap:applicable-path"];if(d1&&d1!==""&&d1!==" "){for(var j=0;j<Z.length;j++){b1=i.getObject(Z[j].getPath());if(b1&&b1[d1]===true){e1=true;break;}}}else{e1=true;}}}else{e1=true;}}else if($==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"&&Z.length>0){e1=true;}return e1;}function p(j,Y,Z,$){var _=G($);var a1=false;var b1=Y.getODataEntitySet($.getEntitySet());if(sap.suite.ui.generic.template.js.AnnotationHelper.areDeleteRestrictionsValid(Y,b1.entityType,_)){if(Z.length>0){var c1=_&&_.Deletable&&_.Deletable.Path;if(c1){for(var i=0;i<Z.length;i++){if(j.getProperty(c1,Z[i])){a1=true;break;}}}else{a1=true;}}}return a1;}function G(i){var j=i.getModel()&&i.getModel().getMetaModel();var Y=j&&j.getODataEntitySet(i.getEntitySet());var Z=Y&&Y["Org.OData.Capabilities.V1.DeleteRestrictions"];return Z;}function u(i,j,Y){var Z=y(Y);var $=c.getView().getModel("_templPriv");var _=$.getProperty("/generic/listCommons/breakoutActionsEnabled");if(Z){v(_,Z,i,j,Y);}$.setProperty("/generic/listCommons/breakoutActionsEnabled",_);}function v(i,j,Y,Z,$){var _;for(var a1 in j){if(q.inArray(j[a1].id,Y)!==-1){_=true;if(j[a1].requiresSelection){if(Z.length>0){if(j[a1].applicablePath!==undefined&&j[a1].applicablePath!==""){_=false;for(var b1=0;b1<Z.length;b1++){var c1="";var d1=j[a1].applicablePath.split("/");if(d1.length>1){for(var e1=0;e1<d1.length-1;e1++){c1+="/"+d1[e1];}}var f1=$.getObject(Z[b1].getPath()+c1);var g1=d1[d1.length-1];if(f1[g1]===true){_=true;break;}}}}else{_=false;}}i[j[a1].id]={enabled:_};}}}function w(i){var j=[];var Y=q.grep(i.getCustomToolbar().getContent(),function(_){return _.getMetadata().getName()==="sap.m.Button";});for(var Z=0;Z<Y.length;Z++){var $=Y[Z].getId().split("--");j.push($[$.length-1]);}return j;}function x(c){var i=[];var j=[];var Y=c.getView().byId("page");if(Y&&Y.getFooter()){j=q.grep(Y.getFooter().getContent(),function(_){return _.getMetadata().getName()==="sap.m.Button";});}for(var Z=0;Z<j.length;Z++){var $=j[Z].getId().split("--");i.push($[$.length-1]);}return i;}function y(i){var j=c.getOwnerComponent().getAppComponent().getManifestEntry("sap.ui5");var Y=j.extends&&j.extends.extensions&&j.extends.extensions["sap.ui.controllerExtensions"];if(Y){var Z=(Y[c.getOwnerComponent().getTemplateName()]||{})["sap.ui.generic.app"]||{};var $=i.getMetaModel();var _=(Z[$.getODataEntitySet(c.getOwnerComponent().getEntitySet()).name]||{})["Actions"];if(!_){_={};var a1=(Z[$.getODataEntitySet(c.getOwnerComponent().getEntitySet()).name]||{})["Sections"];if(a1){for(var b1 in a1){_=q.extend(_,a1[b1]["Actions"]);}}}return _;}}function z(i){var j=i;while(j){if(j instanceof R||j instanceof U||j instanceof S||j instanceof sap.ui.comp.smartchart.SmartChart){return j;}if(j.getParent){j=j.getParent();}else{return null;}}return null;}function E(i){if(i instanceof S){i=i.getTable();}if(i instanceof U){return i.getBindingInfo("rows");}else if(i instanceof R){return i.getBindingInfo("items");}return null;}function F(i,j){var Y=i.getPath();var Z=c.getOwnerComponent();var $="";if(Z.getComponentContainer().getElementBinding()){$=Z.getComponentContainer().getElementBinding().getPath();}var _=null;if(Y.indexOf($)!==0){_=E(j).path;}var a1=!s.oApplication.isNewHistoryEntryRequired(i,_);var b1;if(f()){b1=s.oDraftController.isActiveEntity(i)?1:6;}else{b1=c.getOwnerComponent().getModel("ui").getProperty("/editable")?6:1;}s.oNavigationController.navigateToContext(i,_,a1,b1);}function H(i,j){var Y;if(j&&j.navigationProperty){Y=j.navigationProperty;}s.oNavigationController.navigateToContext(i,Y,false);}function I(i){if(i instanceof a){M.show(i.getErrorCode(),{title:e("ST_GENERIC_ERROR_TITLE")});}}function K(i,j){Q(function(){n=X();n.navigate(i.semanticObject,i.action,n.mixAttributesAndSelectionVariant(i.parameters).toJSONString(),j.getCurrentAppState&&j.getCurrentAppState()||{},I);},q.noop,j,"LeavePage");}function O(i,j,Y){if(!i){return e("DRAFT_OBJECT");}else if(j){return e(Y?"LOCKED_OBJECT":"UNSAVED_CHANGES");}else{return"";}}function P(){var i=d("sap.suite.ui.generic.template.fragments.DraftAdminDataPopover",{formatText:function(){var j=Array.prototype.slice.call(arguments,1);var Y=arguments[0];if(!Y){return"";}if(j.length>0&&(j[0]===null||j[0]===undefined||j[0]==="")){if(j.length>3&&(j[3]===null||j[3]===undefined||j[3]==="")){return(j.length>2&&(j[1]===null||j[1]===undefined||j[1]===""))?"":j[2];}else{return e(Y,j[3]);}}else{return e(Y,j[0]);}},closeDraftAdminPopover:function(){i.close();},formatDraftLockText:O},"admin");return i;}function Q(i,j,Y,Z,$){var _=s.oApplication.getBusyHelper();if(!$&&_.isBusy()){return;}if(!f()){var a1=false;if(Y&&Y.aUnsavedDataCheckFunctions){a1=Y.aUnsavedDataCheckFunctions.some(function(c1){return c1();});}if(a1||c.getView().getModel().hasPendingChanges()){var b1;V(function(){c.getView().getModel().resetChanges();C.fire(c,"AfterCancel",{});b1=i();},function(){b1=j();},Z);return b1;}}return i();}var T;function V(i,j,Y){T=i;if(!Y){Y="LeavePage";}var Z=d("sap.suite.ui.generic.template.fragments.DataLoss",{onDataLossOK:function(){Z.close();T();},onDataLossCancel:function(){Z.close();j();}},"dataLoss");var $=Z.getModel("dataLoss");$.setProperty("/mode",Y);Z.open();}function W(i,j,Y){j=q.extend(true,{busy:{set:true,check:true},dataloss:{popup:true,navigation:false}},j);var Z=s.oApplication.getBusyHelper();var $=new Promise(function(_,a1){if(j.busy.check&&Z.isBusy()){a1();return;}var b1=(j.dataloss.popup?Q(i,a1,Y,(j.dataloss.navigation?"LeavePage":"Proceed"),true):i());if(b1 instanceof Promise){b1.then(function(c1){_(c1);},function(c1){a1(c1);});}else{_();}});if(j.busy.set){Z.setBusy($);}return $;}function X(){n=n||new N(c);return n;}var X=t.testable(X,"getNavigationHandler");var f=t.testable(f,"isDraftEnabled");return{getNavigationProperty:g,getText:e,isDraftEnabled:f,getNavigationHandler:X,executeGlobalSideEffect:function(){if(f()){var i=c.getView();i.attachBrowserEvent("keyup",function(j){if(j.keyCode===13&&i.getModel("ui").getProperty("/editable")){s.oApplicationController.executeSideEffects(i.getBindingContext());}});}},setEnabledToolbarButtons:k,setEnabledFooterButtons:l,fillEnabledMapForBreakoutActions:u,getBreakoutActionsForTable:w,getBreakoutActionsForFooter:x,getBreakoutActionsFromManifest:y,getSelectedContexts:h,getDeleteRestrictions:G,setPrivateModelControlProperty:m,navigateFromListItem:F,navigateToContext:H,navigateExternal:K,getCustomData:function(j){var Y=j.getSource().getCustomData();var Z={};for(var i=0;i<Y.length;i++){Z[Y[i].getKey()]=Y[i].getValue();}return Z;},formatDraftLockText:O,showDraftPopover:function(i,j){var Y=P();var Z=Y.getModel("admin");Z.setProperty("/IsActiveEntity",i.getProperty("IsActiveEntity"));Z.setProperty("/HasDraftEntity",i.getProperty("HasDraftEntity"));Y.bindElement({path:i.getPath()+"/DraftAdministrativeData"});if(Y.getBindingContext()){Y.openBy(j);}else{Y.getObjectBinding().attachDataReceived(function(){Y.openBy(j);});}},getContentDensityClass:function(){return s.oApplication.getContentDensityClass();},attachControlToView:A,getDialogFragment:d,processDataLossConfirmationIfNonDraft:Q,securedExecution:W,getOwnerControl:z,getTableBinding:E,getElementCustomData:function(i){var j={};if(i instanceof sap.ui.core.Element){i.getCustomData().forEach(function(Y){j[Y.getKey()]=Y.getValue();});}return j;},triggerAction:function(i,j,Y,Z,$){Q(function(){s.oCRUDManager.callAction({functionImportPath:Y.Action,contexts:i,sourceControl:Z,label:Y.Label,operationGrouping:"",navigationProperty:""}).then(function(_){if(_&&_.length>0){var a1=_[0];if(a1.response&&a1.response.context&&(!a1.actionContext||a1.actionContext&&a1.response.context.getPath()!==a1.actionContext.getPath())){s.oViewDependencyHelper.setMeToDirty(c.getOwnerComponent(),j);}}});},q.noop,$,"Proceed");}};}return B.extend("sap.suite.ui.generic.template.lib.CommonUtils",{constructor:function(c,s,C){q.extend(this,b(c,s,C));}});});
