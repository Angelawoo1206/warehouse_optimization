sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/ui/model/json/JSONModel","sap/m/ObjectIdentifier","sap/m/Table","sap/m/Text","sap/ui/comp/smartfield/SmartField","sap/ui/generic/app/navigation/service/SelectionVariant","sap/suite/ui/generic/template/ListReport/extensionAPI/ExtensionAPI","sap/m/MessageBox","sap/suite/ui/generic/template/js/AnnotationHelper","sap/suite/ui/generic/template/lib/MessageUtils","sap/suite/ui/generic/template/ListReport/controller/IappStateHandler","sap/ui/table/Table","sap/ui/table/AnalyticalTable"],function(q,B,J,O,T,a,S,b,E,M,A,c,I,U,d){"use strict";return{getMethods:function(v,t,C){var s={};var o;var e=true;function f(){var i=C.getOwnerComponent();var l=i.getModel("_templPriv");l.setProperty("/listReport/isLeaf",i.getIsLeaf());}function g(){var G=q.sap.getObject("sap.ushell.Container.getUser");var m=C.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");var i=(m&&m.icons&&m.icons.icon)||"";var l={bookmarkIcon:i,bookmarkCustomUrl:function(){var H=hasher.getHash();return H?("#"+H):window.location.href;},bookmarkServiceUrl:function(){var p=s.oSmartTable.getTable();var r=p.getBinding("rows")||p.getBinding("items");return r?r.getDownloadUrl()+"&$top=0&$inlinecount=allpages":"";},isShareInJamActive:!!G&&G().isJamActive()};var n=C.getOwnerComponent().getModel("_templPriv");n.setProperty("/listReport/share",l);}function h(i){C.onInitSmartFilterBarExtension(i);o.onSmartFilterBarInitialise();}function j(){var i=o.parseUrlAndApplyAppState();i.then(function(){e=false;},function(l){if(l instanceof Error){l.showMessageBox();e=false;}});}function k(){if(!e){o.changeIappState(true,false);}}return{onInit:function(){s.oSmartFilterbar=C.byId("listReportFilter");s.oSmartTable=C.byId("listReport");o=new I(s,C,t.oCommonUtils.getNavigationHandler());t.oServices.oApplication.registerStateChanger({isStateChange:o.isStateChange});v.getUrlParameterInfo=o.getUrlParameterInfo;v.onComponentActivate=function(){if(!e){o.parseUrlAndApplyAppState();}};v.refreshBinding=function(){if(o.areDataShownInTable()){s.oSmartTable.rebindTable();}};f();g();var i=C.getOwnerComponent();C.byId("template::FilterText").attachBrowserEvent("click",function(){C.byId("page").setHeaderExpanded(true);});var l=i.getModel("_templPriv");l.setProperty("/listReport/isHeaderExpanded",true);l.setProperty("/listReport/deleteEnabled",false);i.getService("ShellUIService").then(function(x){x.setTitle(t.oCommonUtils.getText("PAGEHEADER"));});var m=s.oSmartTable.getTable();var n="sapUiSizeCozy",p="sapUiSizeCompact",r="sapUiSizeCondensed";if(m instanceof U||m instanceof d){var V=C.getView();var u=q(document.body);if(u.hasClass(n)||V.hasStyleClass(n)){s.oSmartTable.addStyleClass(n);}else if(u.hasClass(p)||V.hasStyleClass(p)){var w=i.getComponentContainer().getSettings().condensedTableLayout;if(w===true){s.oSmartTable.addStyleClass(r);}else{s.oSmartTable.addStyleClass(p);}}}},handlers:{onBack:function(){t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){t.oServices.oNavigationController.navigateBack();},q.noop,s);},addEntry:function(i){var l=i.getSource();t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){t.oCommonEventHandlers.addEntry(l,false,s.oSmartFilterbar).then(function(){if(!l.data("CrossNavigation")){t.oComponentUtils.addDataForNextPage({isObjectRoot:true});}},q.noop);},q.noop,s);},deleteEntries:function(i){t.oCommonEventHandlers.deleteEntries(i);},onSelectionChange:function(l){var m=l.getSource(),n=m.getModel(),p=m.getModel("_templPriv");var r=n.getMetaModel(),u=r.getODataEntitySet(this.getOwnerComponent().getEntitySet()),D=u["Org.OData.Capabilities.V1.DeleteRestrictions"];var w=false;if(sap.suite.ui.generic.template.js.AnnotationHelper.areDeleteRestrictionsValid(r,u.entityType,D)){var x=(D&&D.Deletable&&D.Deletable.Path)?D.Deletable.Path:"";var y=true;var z=(x&&x!=="");var F=t.oCommonUtils.getSelectedContexts(m);if(F.length>0){for(var i=0;i<F.length;i++){var G=n.getObject(F[i].getPath());if(!(G.IsActiveEntity&&G.HasDraftEntity&&G.DraftAdministrativeData&&G.DraftAdministrativeData.InProcessByUser)){y=false;}if(z){if(n.getProperty(x,F[i])){z=false;}}if(!y&&!z){w=true;break;}}}}p.setProperty("/listReport/deleteEnabled",w);t.oCommonUtils.setEnabledToolbarButtons(m);t.oCommonUtils.setEnabledFooterButtons(m,this);},onChange:function(i){t.oCommonEventHandlers.onChange(i);},onSmartFieldUrlPressed:function(i){t.oCommonEventHandlers.onSmartFieldUrlPressed(i,s);},onBreadCrumbUrlPressed:function(i){t.oCommonEventHandlers.onBreadCrumbUrlPressed(i,s);},onContactDetails:function(i){t.oCommonEventHandlers.onContactDetails(i);},onSmartFilterBarInitialise:h,onSmartFilterBarInitialized:j,onBeforeSFBVariantSave:function(){o.onBeforeSFBVariantSave();},onAfterSFBVariantSave:function(){o.onAfterSFBVariantSave();},onAfterSFBVariantLoad:function(i){o.onAfterSFBVariantLoad(i);},onBeforeRebindTable:function(i){t.oCommonEventHandlers.onBeforeRebindTable(i,t.oCommonUtils);C.onBeforeRebindTableExtension(i);},onShowDetails:function(i){t.oCommonEventHandlers.onShowDetails(i.getSource(),s);},onListNavigate:function(i){if(!C.onListNavigationExtension(i)){t.oCommonEventHandlers.onListNavigate(i.getSource(),s);}},onCallActionFromToolBar:function(i){t.oCommonEventHandlers.onCallActionFromToolBar(i,s);},onDataFieldForIntentBasedNavigation:function(i){t.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(i,s);},onBeforeSemanticObjectLinkPopoverOpens:function(i){var l=i.getParameters();t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var n=t.oCommonUtils.getNavigationHandler();if(n){var m=s.oSmartFilterbar.getDataSuiteFormat();n.processBeforeSmartLinkPopoverOpens(l,m);}else{l.open();}},q.noop,s,q.noop);},onDraftLinkPressed:function(i){var l=i.getSource();var m=l.getBindingContext();t.oCommonUtils.showDraftPopover(m,l);},onAssignedFiltersChanged:function(i){if(i.getSource()){C.byId("template::FilterText").setText(i.getSource().retrieveFiltersWithValuesAsText());}},onFilterChange:k,onToggleFiltersPressed:function(){var i=C.getOwnerComponent();var l=i.getModel("_templPriv");l.setProperty("/listReport/isHeaderExpanded",!l.getProperty("/listReport/isHeaderExpanded"));},onSearchButtonPressed:function(){var m=C.getOwnerComponent().getModel();var r=function(i){c.handleError("getCollection",this,t.oServices,i.getParameters());s.oSmartTable.getTable().setBusy(false);c.handleTransientMessages(t.oServices.oApplication.getDialogFragmentForView.bind(null,null));}.bind(this);o.changeIappState(false,true);m.attachEvent('requestFailed',r);m.attachEventOnce('requestCompleted',function(){m.detachEvent('requestFailed',r);});},onSemanticObjectLinkPopoverLinkPressed:function(i){t.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(i,s);},onAfterTableVariantSave:function(){o.onAfterTableVariantSave();},onAfterApplyTableVariant:function(){o.onAfterApplyTableVariant();},onShareListReportActionButtonPress:function(i){var l=t.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ListReport.view.fragments.ShareSheet",{shareEmailPressed:function(){sap.m.URLHelper.triggerEmail(null,t.oCommonUtils.getText("EMAIL_HEADER",[t.oCommonUtils.getText("PAGEHEADER")]),document.URL);},shareJamPressed:function(){var p=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:document.URL,share:t.oCommonUtils.getText("PAGEHEADER")}}});p.open();}},"share",function(F,p){var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");p.setProperty("/emailButtonText",r.getText("SEMANTIC_CONTROL_SEND_EMAIL"));p.setProperty("/jamButtonText",r.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));p.setProperty("/bookmarkButtonText",r.getText("SEMANTIC_CONTROL_SAVE_AS_TILE"));var G=q.sap.getObject("sap.ushell.Container.getUser");p.setProperty("/jamVisible",!!G&&G().isJamActive());});l.openBy(i.getSource());var m=this.getView().byId("template::Share");var n=this.getView().byId("bookmarkButton");n.setBeforePressHandler(function(){m.focus();});},onInlineDataFieldForAction:function(i){var l=i.getSource();var m=t.oCommonUtils.getElementCustomData(l);var n=t.oCommonUtils.getOwnerControl(l);var p=n.getParent().getTableBindingPath();var r=[l.getBindingContext()];t.oCommonUtils.triggerAction(r,p,m,n,s);},onInlineDataFieldForIntentBasedNavigation:function(i){t.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(i.getSource(),s);},onDeterminingDataFieldForAction:function(i){var l=s.oSmartTable.getTable();var m=t.oCommonUtils.getSelectedContexts(l);if(m.length===0){M.error(t.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"),{styleClass:t.oCommonUtils.getContentDensityClass()});}else{var n=i.getSource();var p=t.oCommonUtils.getElementCustomData(n);var r=s.oSmartTable.getTableBindingPath();t.oCommonUtils.triggerAction(m,r,p,l);}},onDeterminingDataFieldForIntentBasedNavigation:function(i){var l=i.getSource();var m=t.oCommonUtils.getElementCustomData(l);var n=s.oSmartTable.getTable();var p=t.oCommonUtils.getSelectedContexts(n);var r=!(m.RequiresContext&&m.RequiresContext==="false");if(r&&p.length===0){M.error(t.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"),{styleClass:t.oCommonUtils.getContentDensityClass()});}else if(r&&p.length>1){M.error(t.oCommonUtils.getText("ST_GENERIC_MULTIPLE_ITEMS_SELECTED"),{styleClass:t.oCommonUtils.getContentDensityClass()});}else{var u=r?p[0]:null;t.oCommonEventHandlers.onDataFieldForIntentBasedNavigationSelectedContext(u,m,s);}}},formatters:{formatDraftType:function(D,i,H){if(D&&D.DraftUUID){if(!i){return sap.m.ObjectMarkerType.Draft;}else if(H){return D.InProcessByUser?sap.m.ObjectMarkerType.Locked:sap.m.ObjectMarkerType.Unsaved;}}return sap.m.ObjectMarkerType.Flagged;},formatDraftVisibility:function(D,i){if(D&&D.DraftUUID){if(!i){return sap.m.ObjectMarkerVisibility.TextOnly;}}return sap.m.ObjectMarkerVisibility.IconAndText;},formatDraftLineItemVisible:function(D){if(D&&D.DraftUUID){return true;}return false;},formatDraftOwner:function(D,H){var i="";if(D&&D.DraftUUID&&H){var u=D.InProcessByUserDescription||D.InProcessByUser||D.LastChangedByUserDescription||D.LastChangedByUser;if(u){i=t.oCommonUtils.getText("ST_DRAFT_OWNER",[u]);}else{i=t.oCommonUtils.getText("ST_DRAFT_ANOTHER_USER");}}return i;}},extensionAPI:new E(t,C,s)};}};});