// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";sap.ui.controller("sap.ushell.renderers.fiori2.theme_selector.ThemeSelector",{onInit:function(){try{this.userInfoService=sap.ushell.Container.getService("UserInfo");this.oUser=this.userInfoService.getUser();}catch(e){jQuery.sap.log.error("Getting UserInfo service failed.");this.oUser=sap.ushell.Container.getUser();}this.currentThemeId=this.oUser.getTheme();this.origThemeId=this.currentThemeId;this.aThemeList=null;this.isContentLoaded=false;this.aSapThemeMap={"base":"sapUshellBaseIconStyle","sap_bluecrystal":"sapUshellBlueCrystalIconStyle","sap_hcb":"sapUshellHCBIconStyle","sap_belize":"sapUshellBelizeIconStyle","sap_belize_plus":"sapUshellPlusIconStyle"};},getConfigurationModel:function(){var c=new sap.ui.model.json.JSONModel({});c.setData({isRTL:sap.ui.getCore().getConfiguration().getRTL(),sapUiContentIconColor:sap.ui.core.theming.Parameters.get('sapUiContentIconColor'),isContentDensitySwitchEnable:this.isContentDensitySwitchEnable(),flexAlignItems:sap.ui.Device.system.phone?'Stretch':'Center',textAlign:sap.ui.Device.system.phone?'Left':'Right',textDirection:sap.ui.Device.system.phone?'Column':'Row',labelWidth:sap.ui.Device.system.phone?"auto":"12rem"});return c;},_getIsChangeThemePermitted:function(){return this.oUser.isSetThemePermitted();},onAfterRendering:function(){var l=sap.ui.getCore().byId("userPrefThemeSelector--themeList"),i=l.getItems(),I,t,a=this;l.toggleStyleClass("sapUshellThemeListDisabled",!this.isListActive());i.forEach(function(L){t=L.getCustomData()[0].getValue();I=L.getContent()[0].getItems()[0].getItems()[0];if(!a.isListActive()){L.isSelectable=function(){return false;};}if(t===a.currentThemeId){L.setSelected(true);if(!a.isListActive()){L.toggleStyleClass("sapUshellThemeListItemSelected",true);}}else{L.setSelected(false);}I.addStyleClass(a.aSapThemeMap[t]);});if(this.isContentDensitySwitchEnable()){var c=sap.ui.getCore().byId("userPrefThemeSelector--contentDensitySwitch");if(c){c.setState(this.currentContentDensity==="cozy");}}},getContent:function(){var t=this;var d=jQuery.Deferred();var r=sap.ushell.resources.getTranslationModel();this.getView().setModel(r,"i18n");this.getView().setModel(this.getConfigurationModel(),"config");if(this.isContentDensitySwitchEnable()){this.origContentDensity=this.currentContentDensity;if(this.oUser.getContentDensity()){this.currentContentDensity=this.oUser.getContentDensity();}else{this.currentContentDensity="cozy";}}if(this.isContentLoaded===true){d.resolve(this.getView());}else{var a=this._getThemeList();a.done(function(T){if(T.length>0){T.sort(function(b,c){var e=b.name,f=c.name;if(e<f){return-1;}if(e>f){return 1;}return 0;});for(var i=0;i<T.length;i++){if(T[i].id==t.currentThemeId){T[i].isSelected=true;}else{T[i].isSelected=false;}}t.getView().getModel().setProperty("/options",T);d.resolve(t.getView());}else{d.reject();}});a.fail(function(){d.reject();});}return d.promise();},getValue:function(){var d=jQuery.Deferred();var t=this._getThemeList();var a=this;var b;t.done(function(T){a.aThemeList=T;b=a._getThemeNameById(a.currentThemeId);d.resolve(b);});t.fail(function(e){d.reject(e);});return d.promise();},onCancel:function(){this.currentThemeId=this.oUser.getTheme();if(this.isContentDensitySwitchEnable()){this.currentContentDensity=this.oUser.getContentDensity();}},onSave:function(){var r=jQuery.Deferred(),w,p=[],t=0,s=0,f=0,F=[],a=function(){s++;r.notify();},b=function(e){F.push({entry:"currEntryTitle",message:e});f++;r.notify();};var T=this.onSaveThemes();T.done(a);T.fail(b);p.push(T);if(this.isContentDensitySwitchEnable()){var c=this.onSaveContentDensity();c.done(a);c.fail(b);p.push(c);}w=jQuery.when.apply(null,p);w.done(function(){r.resolve();});r.progress(function(){if(f>0&&(f+s===t)){r.reject("At least one save action failed");}});return r.promise();},onSaveThemes:function(){var d=jQuery.Deferred();var u;if(this.oUser.getTheme()!=this.currentThemeIprofilingEntriesd){if(this.currentThemeId){this.oUser.setTheme(this.currentThemeId);u=this.userInfoService.updateUserPreferences(this.oUser);u.done(function(){this.origThemeId=this.currentThemeId;this.oUser.resetChangedProperties();d.resolve();}.bind(this));u.fail(function(e){this.oUser.setTheme(this.origThemeId);this.oUser.resetChangedProperties();this.currentThemeId=this.origThemeId;jQuery.sap.log.error(e);d.reject(e);}.bind(this));}else{d.reject("Could not find theme: "+this.currentThemeId);}}else{d.resolve();}return d.promise();},_getThemeList:function(){var d=jQuery.Deferred();if(this.aThemeList==null){if(this._getIsChangeThemePermitted()==true){var g=this.userInfoService.getThemeList();g.done(function(D){d.resolve(D.options);});g.fail(function(){d.reject("Failed to load theme list.");});}else{d.resolve([this.currentThemeId]);}}else{d.resolve(this.aThemeList);}return d.promise();},getCurrentThemeId:function(){return this.currentThemeId;},setCurrentThemeId:function(n){this.currentThemeId=n;},_getThemeNameById:function(t){if(this.aThemeList){for(var i=0;i<this.aThemeList.length;i++){if(this.aThemeList[i].id==t){return this.aThemeList[i].name;}}}return t;},onSaveContentDensity:function(){var d=jQuery.Deferred();var u;if(this.oUser.getContentDensity()!=this.currentContentDensity){if(this.currentContentDensity){this.oUser.setContentDensity(this.currentContentDensity);u=this.userInfoService.updateUserPreferences(this.oUser);u.done(function(){this.oUser.resetChangedProperties();this.origContentDensity=this.currentContentDensity;sap.ui.getCore().getEventBus().publish("launchpad","toggleContentDensity",{contentDensity:this.currentContentDensity});d.resolve();}.bind(this));u.fail(function(e){this.oUser.setContentDensity(this.origContentDensity);this.oUser.resetChangedProperties();this.currentContentDensity=this.origContentDensity;jQuery.sap.log.error(e);d.reject(e);}.bind(this));}else{d.reject("Could not find mode: "+this.currentContentDensity);}}else{d.resolve();}return d.promise();},getCurrentContentDensity:function(){return this.currentContentDensity;},setCurrentContentDensity:function(e){var n=e.getSource().getState()?"cozy":"compact";this.currentContentDensity=n;},getIconFormatter:function(t){if(this.aSapThemeMap[t]){return"";}else{return"sap-icon://palette";}},onSelectHandler:function(e){var i=e.getParameters().listItem;this.setCurrentThemeId(i.getBindingContext().getProperty("id"));},isContentDensitySwitchEnable:function(){return sap.ui.Device.system.combi&&this.getView().getModel().getProperty("/contentDensity");},isListActive:function(){return this.getView().getModel().getProperty("/setTheme");}});}());
