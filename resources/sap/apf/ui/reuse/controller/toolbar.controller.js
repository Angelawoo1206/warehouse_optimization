/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){"use strict";sap.ui.controller("sap.apf.ui.reuse.controller.toolbar",{resetAnalysisPath:function(){this.oUiApi.getAnalysisPath().getCarousel().getController().removeAllSteps();this.oCoreApi.resetPath();this.oUiApi.getAnalysisPath().getController().isNewPath=true;this.oStartFilterHandler.resetAll();this.oUiApi.contextChanged(true);this.oUiApi.getAnalysisPath().getController().refreshAnalysisPath();this.oCoreApi.setDirtyState(false);this.oCoreApi.setPathName('');this.oUiApi.getAnalysisPath().getController().setPathTitle();this.oUiApi.getAnalysisPath().getCarousel().rerender();},onInit:function(){this.view=this.getView();if(sap.ui.Device.system.desktop){this.view.addStyleClass("sapUiSizeCompact");}this.oViewData=this.getView().getViewData();this.oCoreApi=this.oViewData.oCoreApi;this.oSerializationMediator=this.oViewData.oSerializationMediator;this.oUiApi=this.oViewData.uiApi;this.oStartFilterHandler=this.oViewData.oStartFilterHandler;this.oPrintHelper=new sap.apf.ui.utils.PrintHelper(this.oViewData);this.bIsPathGalleryWithDelete=false;this.oPathGalleryDialog={};},addCompactStyleClassForDialog:function(d){if(sap.ui.Device.system.desktop){d.addStyleClass("sapUiSizeCompact");}},onSaveAndSaveAsPress:function(s){var a=this;if(a.oCoreApi.getSteps().length!==0){a.oUiApi.getLayoutView().setBusy(true);a.oCoreApi.readPaths(function(r,b,c){var p=r.paths;if(b!==undefined){a.getView().maxNumberOfSteps=b.getEntityTypeMetadata().maximumNumberOfSteps;a.getView().maxNumberOfPaths=b.getEntityTypeMetadata().maxOccurs;}if(c===undefined&&(typeof r==="object")){a.getSaveDialog(s,function(){},p);}else{var m=a.oCoreApi.createMessageObject({code:"6005",aParameters:[]});m.setPrevious(c);a.oCoreApi.putMessage(m);}a.oUiApi.getLayoutView().setBusy(false);});}else{var m=a.oCoreApi.createMessageObject({code:"6012",aParameters:[]});a.oCoreApi.putMessage(m);}},openPathGallery:function(I){var j={};var s=this;var i,m;s.oCoreApi.readPaths(function(d,a,b){if(b===undefined&&(typeof d==="object")){var g=d.paths;for(i=0;i<g.length;i++){var n=g[i].StructuredAnalysisPath.steps.length;var u=g[i].LastChangeUTCDateTime;var c=/\d+/g;var t=parseInt(u.match(c)[0],10);var e=((new Date(t)).toString()).split(' ');var f=e[1]+"-"+e[2]+"-"+e[3];g[i].title=g[i].AnalysisPathName;g[i].guid=g[i].AnalysisPath;g[i].StructuredAnalysisPath.noOfSteps=n;g[i].description=f+"  -   ("+s.oCoreApi.getTextNotHtmlEncoded("no-of-steps",[n])+")";g[i].summary=g[i].AnalysisPathName+"- ("+f+") - ("+s.oCoreApi.getTextNotHtmlEncoded("no-of-steps",[n])+")";}j={GalleryElements:g};if(I){s.openSavedPathGallery(j,s,"deleteAnalysisPath");}else{s.openSavedPathGallery(j,s,"pathGallery");}s.oUiApi.getLayoutView().setBusy(false);}else{m=s.oCoreApi.createMessageObject({code:"6005",aParameters:[]});m.setPrevious(b);s.oCoreApi.putMessage(m);s.oUiApi.getLayoutView().setBusy(false);}});},openSavedPathGallery:function(j,c,v){if(c.oPathGalleryDialog[v]===undefined||(c.oPathGalleryDialog[v]&&c.oPathGalleryDialog[v].bIsDestroyed)){c.oPathGalleryDialog[v]=new sap.ui.view({type:sap.ui.core.mvc.ViewType.JS,viewName:"sap.apf.ui.reuse.view."+v,viewData:{oInject:c.oViewData}});}c.oPathGalleryDialog[v].getViewData().jsonData=j;var p=c.oPathGalleryDialog[v].getController().oDialog;if((!p)||(p&&!p.isOpen())){c.oPathGalleryDialog[v].getController().openPathGallery();}},doPrint:function(){var p=this.oPrintHelper;p.doPrint();},getSaveDialog:function(s,r,p){var a=this;var h=this.oCoreApi.getTextNotHtmlEncoded("saveName");var b=this.oUiApi.getAnalysisPath().oSavedPathName.getTitle();var m=new sap.ui.model.json.JSONModel();m.setData(p);if(b){if(this.oCoreApi.isDirty()){b=b.split('*')[1];}}this.oInput=new sap.m.Input({type:sap.m.InputType.Text,placeholder:h,showSuggestion:true,suggestionItems:{path:"/",template:new sap.ui.core.Item({text:"{AnalysisPathName}",additionalText:"{AnalysisPath}"})}}).addStyleClass("saveStyle");this.oInput.setModel(m);if(!s){this.oInput.destroySuggestionItems();}this.oInput.attachEvent("click",function(e){jQuery(e.currentTarget).attr('value','');});this.oInput.attachLiveChange(function(d){var v=this.getValue();var c=a.saveDialog;var e=new RegExp("[*]","g");if(v===""){c.getBeginButton().setEnabled(false);}if((v.match(e)!==null)){c.getBeginButton().setEnabled(false);c.setSubHeader(new sap.m.Bar({contentMiddle:new sap.m.Text({text:this.oCoreApi.getTextNotHtmlEncoded('invalid-entry')})}));this.setValueState(sap.ui.core.ValueState.Error);}else{c.getBeginButton().setEnabled(true);c.destroySubHeader();this.setValueState(sap.ui.core.ValueState.None);}if(v.trim()!==""){c.getBeginButton().setEnabled(true);c.destroySubHeader();}else{c.getBeginButton().setEnabled(false);c.setSubHeader(new sap.m.Bar({contentMiddle:new sap.m.Text({text:a.oCoreApi.getTextNotHtmlEncoded('enter-valid-path-name')})}));}});if(b!==(a.oCoreApi.getTextNotHtmlEncoded("unsaved"))){this.oInput.setValue(b);}this.analysisPathName=(a.oInput.getValue()).trim();if(a.saveDialog===undefined||(a.saveDialog&&a.saveDialog.bIsDestroyed)){a.saveDialog=new sap.m.Dialog({type:sap.m.DialogType.Standard,title:a.oCoreApi.getTextNotHtmlEncoded("save-analysis-path"),beginButton:new sap.m.Button({text:a.oCoreApi.getTextNotHtmlEncoded("ok"),enabled:false,press:function(){a.saveDialog.getBeginButton().setEnabled(false);a.saveDialog.getEndButton().setEnabled(false);var c=(a.oInput.getValue()).trim();a.saveAnalysisPath(c,r,s);a.saveDialog.close();}}),endButton:new sap.m.Button({text:a.oCoreApi.getTextNotHtmlEncoded("cancel"),press:function(){a.saveDialog.close();}}),afterClose:function(){a.oUiApi.getLayoutView().setBusy(false);a.saveDialog.destroy();}});a.saveDialog.setInitialFocus(a.saveDialog);a.saveDialog.addContent(this.oInput);this.addCompactStyleClassForDialog(a.saveDialog);if(this.oInput.getValue()===b){a.saveDialog.getBeginButton().setEnabled(true);}}if(a.oCoreApi.getSteps().length>=1){if(!s&&b===(a.oCoreApi.getTextNotHtmlEncoded("unsaved"))){if(!a.saveDialog||(a.saveDialog&&!a.saveDialog.isOpen())){a.saveDialog.open();}}else if(s){if(!a.saveDialog||(a.saveDialog&&!a.saveDialog.isOpen())){a.saveDialog.open();}}else{a.saveAnalysisPath(b,r,s);}}},doOkOnNewAnalysisPath:function(){var s=this;this.isOpen=false;s.oCoreApi.readPaths(function(r,m,a){var S=true;var p=r.paths;if(m!==undefined){s.getView().maxNumberOfSteps=m.getEntityTypeMetadata().maximumNumberOfSteps;s.getView().maxNumberOfPaths=m.getEntityTypeMetadata().maxOccurs;}if(a===undefined&&(typeof r==="object")){s.getSaveDialog(S,function(){s.resetAnalysisPath();},p);}else{var M=s.oCoreApi.createMessageObject({code:"6005",aParameters:[]});M.setPrevious(a);s.oCoreApi.putMessage(M);}});},doOkOnOpenAnalysisPath:function(i){var s=this;this.isOpen=true;this.bIsPathGalleryWithDelete=i;s.oCoreApi.readPaths(function(r,m,a){var S=true;var p=r.paths;if(m!==undefined){s.getView().maxNumberOfSteps=m.getEntityTypeMetadata().maximumNumberOfSteps;s.getView().maxNumberOfPaths=m.getEntityTypeMetadata().maxOccurs;}if(a===undefined&&(typeof r==="object")){s.getSaveDialog(S,function(){return;},p);}else{var M=s.oCoreApi.createMessageObject({code:"6005",aParameters:[]});M.setPrevious(a);s.oCoreApi.putMessage(M);}});},getNewAnalysisPathDialog:function(){var s=this;if(this.oCoreApi.isDirty()&&s.oCoreApi.getSteps().length!==0){s.newDialog=new sap.m.Dialog({type:sap.m.DialogType.Standard,title:s.oCoreApi.getTextNotHtmlEncoded("newPath"),content:new sap.m.Text({text:s.oCoreApi.getTextNotHtmlEncoded("analysis-path-not-saved")}).addStyleClass("textStyle"),beginButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("yes"),press:function(){s.doOkOnNewAnalysisPath();s.newDialog.close();}}),endButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("no"),press:function(){s.resetAnalysisPath();s.newDialog.close();}}),afterClose:function(){s.oUiApi.getLayoutView().setBusy(false);s.newDialog.destroy();}});this.addCompactStyleClassForDialog(s.newDialog);s.newDialog.setInitialFocus(s.newDialog);s.newDialog.open();}else{this.resetAnalysisPath();}},getOpenDialog:function(i){var s=this;s.newOpenDialog=new sap.m.Dialog({type:sap.m.DialogType.Standard,title:s.oCoreApi.getTextNotHtmlEncoded("newPath"),content:new sap.m.Text({text:s.oCoreApi.getTextNotHtmlEncoded("analysis-path-not-saved")}).addStyleClass("textStyle"),beginButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("yes"),press:function(){s.doOkOnOpenAnalysisPath(s.bIsPathGalleryWithDelete);s.newOpenDialog.close();}}),endButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("no"),press:function(){s.resetAnalysisPath();s.openPathGallery(s.bIsPathGalleryWithDelete);s.newOpenDialog.close();}}),afterClose:function(){s.oUiApi.getLayoutView().setBusy(false);s.newOpenDialog.destroy();}});this.addCompactStyleClassForDialog(s.newOpenDialog);s.newOpenDialog.setInitialFocus(s.newOpenDialog);s.newOpenDialog.open();},getConfirmDelDialog:function(l){var s=this;var p=l.sPathName;s.delConfirmDialog=new sap.m.Dialog({type:sap.m.DialogType.Standard,title:s.oCoreApi.getTextNotHtmlEncoded("delPath"),content:new sap.m.Text({text:s.oCoreApi.getTextNotHtmlEncoded("do-you-want-to-delete-analysis-path",["'"+p+"'"])}).addStyleClass("textStyle"),beginButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("yes"),press:function(){s.oUiApi.getAnalysisPath().getPathGalleryWithDeleteMode().getController().deleteSavedPath(p,l);s.delConfirmDialog.close();}}),endButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("no"),press:function(){s.delConfirmDialog.close();}}),afterClose:function(){s.oUiApi.getLayoutView().setBusy(false);s.delConfirmDialog.destroy();}});this.addCompactStyleClassForDialog(s.delConfirmDialog);s.delConfirmDialog.open();},getConfirmDialog:function(p){var s=this;var o=p||{};var a={success:o.success||function(){return;},fail:o.fail||function(){return;},msg:o.msg||""};s.confirmDialog=new sap.m.Dialog({title:s.oCoreApi.getTextNotHtmlEncoded("caution"),type:sap.m.DialogType.Standard,content:new sap.m.Text({text:a.msg}).addStyleClass("textStyle"),beginButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("yes"),press:function(){s.overWriteAnalysisPath();s.confirmDialog.close();}}),endButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("no"),press:function(){var S=true;var d=s.oInput.getModel().getData();s.getSaveDialog(S,function(){return;},d);s.confirmDialog.close();}}),afterClose:function(){s.oUiApi.getLayoutView().setBusy(false);s.confirmDialog.destroy();}});this.addCompactStyleClassForDialog(s.confirmDialog);s.confirmDialog.open();},callbackforSave:function(f){f();},onOpenPathGallery:function(i){if(this.oCoreApi.isDirty()&&this.oCoreApi.getSteps().length!==0){this.getOpenDialog(i);}else{this.openPathGallery(i);}this.isOpen=false;},saveAnalysisPath:function(a,f,s){var b=this;this.saveCallback=f;this.analysisPathName=a;this.aData=b.oInput.getModel().getData();var c=false;this.guid="";var d=b.oCoreApi.getSteps();if(this.aData.length>this.getView().maxNumberOfPaths){b.oCoreApi.putMessage(b.oCoreApi.createMessageObject({code:"6014"}));return false;}else if(d.length>this.getView().maxNumberOfSteps){b.oCoreApi.putMessage(b.oCoreApi.createMessageObject({code:"6015"}));return false;}var i;for(i=0;i<this.aData.length;i++){var e=this.aData[i].AnalysisPathName;if(this.analysisPathName===e){c=true;this.guid=this.aData[i].AnalysisPath;break;}}if(!c){b.oSerializationMediator.savePath(b.analysisPathName,function(r,m,g){if(g===undefined&&(typeof r==="object")){b.oCoreApi.setDirtyState(false);b.oUiApi.getAnalysisPath().getController().setPathTitle();b.getSuccessToast(b.analysisPathName,false);if(typeof b.saveCallback==="function"){b.saveCallback();}}else{var M=b.oCoreApi.createMessageObject({code:"6006",aParameters:[b.analysisPathName]});M.setPrevious(g);b.oCoreApi.putMessage(M);}});}else{var p;if(this.oCoreApi.isDirty()&&this.oCoreApi.getSteps().length!==0){p=b.oUiApi.getAnalysisPath().oSavedPathName.getTitle().slice(1,b.oUiApi.getAnalysisPath().oSavedPathName.getTitle().length);}else{p=b.oUiApi.getAnalysisPath().oSavedPathName.getTitle();}if(!s&&p===b.analysisPathName){b.overWriteAnalysisPath();}else{this.getConfirmDialog({msg:b.oCoreApi.getTextNotHtmlEncoded("path-exists",["'"+b.analysisPathName+"'"])});}c=false;}},getSuccessToast:function(p,i){var s=this;var m=s.oCoreApi.createMessageObject({code:i?"6017":"6016",aParameters:[p]});s.oCoreApi.putMessage(m);if(s.isOpen&&s.bIsPathGalleryWithDelete){s.openPathGallery(s.bIsPathGalleryWithDelete);}else if(s.isOpen){s.openPathGallery();}},overWriteAnalysisPath:function(){var s=this;var p=this.analysisPathName;var g=this.guid;s.oSerializationMediator.savePath(g,p,function(r,m,a){if(a===undefined&&(typeof r==="object")){s.oCoreApi.setDirtyState(false);s.oUiApi.getAnalysisPath().getController().setPathTitle();if(s.saveDialog&&s.saveDialog.isOpen()){s.saveDialog.close();}s.getSuccessToast(p,true);if(typeof s.saveCallback==="function"){s.saveCallback();}}else{var M=s.oCoreApi.createMessageObject({code:"6007",aParameters:[p]});M.setPrevious(a);s.oCoreApi.putMessage(M);}});}});}());
