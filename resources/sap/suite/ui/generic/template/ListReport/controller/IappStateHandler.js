sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/ui/generic/app/navigation/service/SelectionVariant"],function(q,B,S){"use strict";var d="sap.suite.ui.generic.template.customData",a="sap.suite.ui.generic.template.genericData";var I=["INIT","DATA_SUITE","CANCEL","RESET","SET_VM_ID"];function n(o){if(o){for(var p in o){o[p]=null;}}}function N(o,O){var k=Object.keys(o);if(k.length!==Object.keys(O).length){return true;}for(var i=0;i<k.length;i++){var K=k[i];var p=o[K];var P=O[K];if(p.length!==P.length){return true;}for(var j=0;j<p.length;j++){if(p[j]!==P[j]){return true;}}}return false;}function g(s,c,o){var b=c.getOwnerComponent().getSmartVariantManagement();var e=Promise.resolve({appStateKey:"",urlParams:{},selectionVariant:"",tableVariantId:""});var D=false;var O=0;var f=0;var A=false;var E=c.byId("editStateFilter");var h=(function(){var i;return function(){i=i||s.oSmartFilterbar.getNonVisibleCustomFilterNames();return i;};})();function j(){return D;}function k(){var L={};L[d]={};var V=[];var M=h();for(var i=0;i<M.length;i++){var Q=M[i];if(s.oSmartFilterbar.isVisibleInFilterBarByName(Q)){V.push(Q);}}L[a]={suppressDataSelection:!D,visibleCustomFields:V};if(E){L[a].editStateFilter=E.getSelectedKey();}c.getCustomAppStateDataExtension(L[d]);return L;}function l(){var L=s.oSmartFilterbar.getDataSuiteFormat();var M=new S(L);var V=c.getVisibleSelectionsWithDefaults();for(var i=0;i<V.length;i++){if(!M.getValue(V[i])){M.addSelectOption(V[i],"I","EQ","");}}var Q={selectionVariant:M.toJSONString(),tableVariantId:(!b&&s.oSmartTable.getCurrentVariantId())||"",customData:k()};return Q;}function r(){f--;}function m(){A=false;f++;var i;try{i=o.storeInnerAppState(l());}catch(L){q.sap.log.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: "+L);}if(i){i.then(r,r);}else{f--;}}function R(L,M){if(L&&L.editStateFilter!==undefined){if(E){E.setSelectedKey((L.editStateFilter===null)?0:L.editStateFilter);}}var V=L&&L.visibleCustomFields;if(V&&V.length>0){var Q=s.oSmartFilterbar.getAllFilterItems();for(var i=0;i<Q.length;i++){var T=Q[i];var U=T.getName();if(V.indexOf(U)!==-1){T.setVisibleInFilterBar(true);}}}D=M&&!(L&&L.suppressDataSelection);if(D){s.oSmartFilterbar.search();}}function p(i){c.restoreCustomAppStateDataExtension(i||{});}function t(i,L){i=i||{};if(i.hasOwnProperty(d)&&i.hasOwnProperty(a)){p(i[d]);R(i[a],L);}else{if(i._editStateFilter!==undefined){R({editStateFilter:i._editStateFilter});delete i._editStateFilter;}p(i);}}function u(){return e.then(function(i){if(i.appStateKey){return{"sap-iapp-state":[i.appStateKey]};}return i.urlParams;});}function v(i,L){if(O===0&&(i||L!==D)){D=L;if(!A){A=true;if(!s.oSmartFilterbar.isDialogOpen()){setTimeout(m,0);}}}}function w(L,M,Q,U,T){var V=Q.appStateKey||"";var W=Q.selectionVariant||"";var X=(!b&&Q.tableVariantId)||"";var Y=(!V&&U)||{};if((L.appStateKey!==V||L.selectionVariant!==W||L.tableVariantId!==X||N(L.urlParams,Y))&&T!==sap.ui.generic.app.navigation.service.NavType.initial){if(f===0){var Z=Q&&Q.bNavSelVarHasDefaultsOnly;if(Q.oSelectionVariant&&L.selectionVariant!==W){var $=Q.oSelectionVariant.getParameterNames().concat(Q.oSelectionVariant.getSelectOptionsPropertyNames());for(var i=0;i<$.length;i++){s.oSmartFilterbar.addFieldToAdvancedArea($[i]);}}if(!Z||s.oSmartFilterbar.isCurrentVariantStandard()){s.oSmartFilterbar.clearVariantSelection();s.oSmartFilterbar.clear();s.oSmartFilterbar.setDataSuiteFormat(W,true);}if(X!==L.tableVariantId){s.oSmartTable.setCurrentVariantId(X);}t(Q.customData,true);}e=Promise.resolve({appStateKey:V,urlParams:Y,selectionVariant:W,tableVariantId:X});}M();}function x(i,L,U,M){var Q=e;Q.then(function(T){if(Q!==e){x(i,L,U,M);return;}w(T,i,L,U,M);});}function y(){O--;}function P(){O++;var i=new Promise(function(L,M){var Q=o.parseNavigation();Q.done(x.bind(null,L));Q.fail(M);});i.then(y,y);return i;}function z(i){var L=l();s.oSmartFilterbar.setFilterData({_CUSTOM:L.customData});}function C(){v(true,D);}function F(i){var L=i.getParameter("context");var M=s.oSmartFilterbar.getFilterData();if(M._CUSTOM!==undefined){t(M._CUSTOM);}else{var Q=k();n(Q[d]);n(Q[a]);t(Q);}D=i.getParameter("executeOnSelect");if(I.indexOf(L)<0){v(true,D);}}function G(){if(!b){v(true,D);}}function H(){if(!b){v(true,D);}}function J(){if(f>0){P();return true;}return false;}function K(){s.oSmartFilterbar.attachFiltersDialogClosed(m);}s.getCurrentAppState=l;return{areDataShownInTable:j,parseUrlAndApplyAppState:P,getUrlParameterInfo:u,changeIappState:v,onSmartFilterBarInitialise:K,onBeforeSFBVariantSave:z,onAfterSFBVariantSave:C,onAfterSFBVariantLoad:F,onAfterTableVariantSave:G,onAfterApplyTableVariant:H,isStateChange:J};}return B.extend("sap.suite.ui.generic.template.lib.IappStateHandler",{constructor:function(s,c,o){q.extend(this,g(s,c,o));}});});