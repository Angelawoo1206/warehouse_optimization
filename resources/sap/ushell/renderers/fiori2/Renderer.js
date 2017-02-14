// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.renderers.fiori2.Renderer");jQuery.sap.require("sap.ui.core.UIComponent");jQuery.sap.require("sap.ushell.resources");jQuery.sap.require("sap.ushell.renderers.fiori2.RendererExtensions");sap.ui.core.UIComponent.extend("sap.ushell.renderers.fiori2.Renderer",{metadata:{version:"1.44.6",dependencies:{version:"1.44.6",libs:["sap.ui.core","sap.m"],components:[]}}});sap.ushell.renderers.fiori2.Renderer.prototype.createContent=function(){var p=jQuery.sap.getUriParameters().get("appState")||jQuery.sap.getUriParameters().get("sap-ushell-config"),v=this.getComponentData()||{},P,a={applications:{"Shell-home":{}},rootIntent:"Shell-home"},V;if(p){if(!v.config){v.config={};}v.config.appState=p;}if(v.config){P=["enablePersonalization","enableTagFiltering","enableLockedGroupsCompactLayout","enableCatalogSelection","enableSearchFiltering","enableTilesOpacity","enableDragIndicator","enableActionModeMenuButton","enableActionModeMenuButton","enableActionModeFloatingButton","enableTileActionsIcon","enableHideGroups"];if(v.config.rootIntent===undefined){v.config.migrationConfig=true;}v.config=jQuery.extend(a,v.config);if(v.config.applications["Shell-home"]){P.forEach(function(s){var b=v.config[s];if(b!==undefined){v.config.applications["Shell-home"][s]=b;}if(s!=="enablePersonalization"){delete v.config[s];}});}}if(v.config&&v.config.customViews){Object.keys(v.config.customViews).forEach(function(s){var V=v.config.customViews[s];sap.ui.view(s,{type:V.viewType,viewName:V.viewName,viewData:V.componentData});});}V=sap.ui.view('mainShell',{type:sap.ui.core.mvc.ViewType.JS,viewName:"sap.ushell.renderers.fiori2.Shell",viewData:v});sap.ushell.renderers.fiori2.utils.init(V.getController());this.shellCtrl=V.oController;this.oShellModel=sap.ushell.renderers.fiori2.ShellModel;return V;};sap.ushell.renderers.fiori2.Renderer.prototype.createExtendedShellState=function(s,c){return this.oShellModel.createExtendedShellState(s,c);};sap.ushell.renderers.fiori2.Renderer.prototype.applyExtendedShellState=function(s,c){this.oShellModel.applyExtendedShellState(s,c);};sap.ushell.renderers.fiori2.Renderer.prototype.showLeftPaneContent=function(i,c,s){if(typeof i==="string"){this.oShellModel.addLeftPaneContent([i],c,s);}else{this.oShellModel.addLeftPaneContent(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.showHeaderItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.addHeaderItem([i],c,s);}else{this.oShellModel.addHeaderItem(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.showRightFloatingContainerItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.addRightFloatingContainerItem([i],c,s);}else{this.oShellModel.addRightFloatingContainerItem(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.showRightFloatingContainer=function(s){this.oShellModel.showRightFloatingContainer(s);};sap.ushell.renderers.fiori2.Renderer.prototype.showToolAreaItem=function(i,c,s){this.oShellModel.addToolAreaItem(i,c,s);};sap.ushell.renderers.fiori2.Renderer.prototype.showActionButton=function(i,c,s,I){var b=[],a=[],B;if(typeof i==="string"){i=[i];}b=i.filter(function(d){B=sap.ui.getCore().byId(d);return B instanceof sap.m.Button&&!(B instanceof sap.ushell.ui.launchpad.ActionItem);});a=i.filter(function(d){B=sap.ui.getCore().byId(d);return B instanceof sap.ushell.ui.launchpad.ActionItem;});if(b.length){this.convertButtonsToActions(b,c,s,I);}if(a.length){this.oShellModel.addActionButton(a,c,s,I);}};sap.ushell.renderers.fiori2.Renderer.prototype.showFloatingActionButton=function(i,c,s){if(typeof i==="string"){this.oShellModel.addFloatingActionButton([i],c,s);}else{this.oShellModel.addFloatingActionButton(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.showHeaderEndItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.addHeaderEndItem([i],c,s);}else{this.oShellModel.addHeaderEndItem(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.setHeaderVisibility=function(v,c,s){this.oShellModel.setHeaderVisibility(v,c,s);};sap.ushell.renderers.fiori2.Renderer.prototype.showSubHeader=function(i,c,s){if(typeof i==="string"){this.oShellModel.addSubHeader([i],c,s);}else{this.oShellModel.addSubHeader(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.showSignOutItem=function(c,s){this.oShellModel.showSignOutButton(c,s);};sap.ushell.renderers.fiori2.Renderer.prototype.showSettingsItem=function(c,s){this.oShellModel.showSettingsButton(c,s);};sap.ushell.renderers.fiori2.Renderer.prototype.setFooter=function(f){this.shellCtrl.setFooter(f);};sap.ushell.renderers.fiori2.Renderer.prototype.setFooterControl=function(c,C){var f=function(C){var V;if(c){jQuery.sap.require(c);V=jQuery.sap.getObject(c);}else{jQuery.sap.log.warning("You must specify control type in order to create it");}return new V(C);},i;i=this.createItem(C,undefined,undefined,f);if(this.lastFooterId){this.removeFooter();}this.lastFooterId=i.getId();this.shellCtrl.setFooter(i);return i;};sap.ushell.renderers.fiori2.Renderer.prototype.hideHeaderItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeHeaderItem([i],c,s);}else{this.oShellModel.removeHeaderItem(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.removeToolAreaItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeToolAreaItem([i],c,s);}else{this.oShellModel.removeToolAreaItem(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.removeRightFloatingContainerItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeRightFloatingContainerItem([i],c,s);}else{this.oShellModel.removeRightFloatingContainerItem(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.hideActionButton=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeActionButton([i],c,s);}else{this.oShellModel.removeActionButton(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.hideLeftPaneContent=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeLeftPaneContent([i],c,s);}else{this.oShellModel.removeLeftPaneContent(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.hideFloatingActionButton=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeFloatingActionButton([i],c,s);}else{this.oShellModel.removeFloatingActionButton(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.hideHeaderEndItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeHeaderEndItem([i],c,s);}else{this.oShellModel.removeHeaderEndItem(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.hideSubHeader=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeSubHeader([i],c,s);}else{this.oShellModel.removeSubHeader(i,c,s);}};sap.ushell.renderers.fiori2.Renderer.prototype.removeFooter=function(){this.shellCtrl.removeFooter();if(this.lastFooterId){var f=sap.ui.getCore().byId(this.lastFooterId);if(f){f.destroy();}this.lastFooterId=undefined;}};sap.ushell.renderers.fiori2.Renderer.prototype.getCurrentViewportState=function(){return this.shellCtrl.getCurrentViewportState();};sap.ushell.renderers.fiori2.Renderer.prototype.addSubHeader=function(c,C,i,b,s){var f=function(C){var V;if(c){jQuery.sap.require(c);V=jQuery.sap.getObject(c);}else{jQuery.sap.log.warning("You must specify control type in order to create it");}return new V(C);},I;I=this.createItem(C,b,s,f);if(i){this.showSubHeader(I.getId(),b,s);}return I;};sap.ushell.renderers.fiori2.Renderer.prototype.addActionButton=function(c,C,i,b,s,I){var f=function(C){var V;if(c&&c!=="sap.m.Button"){jQuery.sap.require(c);V=jQuery.sap.getObject(c);}else{V=jQuery.sap.getObject("sap.ushell.ui.launchpad.ActionItem");}return new V(C);},o;o=this.createItem(C,b,s,f);if(i){this.showActionButton(o.getId(),b,s,I);}return o;};sap.ushell.renderers.fiori2.Renderer.prototype.addFloatingActionButton=function(c,C,i,b,s){var f=function(C){var V;if(c){jQuery.sap.require(c);V=jQuery.sap.getObject(c);}else{V=jQuery.sap.getObject(sap.m.Button);}return new V(C);},I;I=this.createItem(C,b,s,f);if(i){this.showFloatingActionButton(I.getId(),b,s);}return I;};sap.ushell.renderers.fiori2.Renderer.prototype.addLeftPaneContent=function(c,C,i,b,s){var f=function(C){var V;if(c){jQuery.sap.require(c);V=jQuery.sap.getObject(c);}else{jQuery.sap.log.warning("You must specify control type in order to create it");}return new V(C);},I;I=this.createItem(C,b,s,f);if(i){this.showLeftPaneContent(I.getId(),b,s);}return I;};sap.ushell.renderers.fiori2.Renderer.prototype.addHeaderItem=function(c,C,i,b,s){if(typeof(arguments[0])==='object'&&typeof(arguments[1])==='boolean'){C=arguments[0];i=arguments[1];b=arguments[2];s=arguments[3];}else{jQuery.sap.log.warning("sap.ushell.renderers.fiori2.Renderer: The parameter 'controlType' of the function 'addHeaderItem' is deprecated. Usage will be ignored!");}var p=C;p.showSeparator=false;var f=function(C){return new sap.ushell.ui.shell.ShellHeadItem(C);},I=this.createItem(p,b,s,f);if(i){this.showHeaderItem(I.getId(),b,s);}return I;};sap.ushell.renderers.fiori2.Renderer.prototype.addRightFloatingContainerItem=function(c,i,C,s){var f=function(c){return new sap.m.NotificationListItem(c);},I=this.createItem(c,C,s,f);if(i){this.showRightFloatingContainerItem(I.getId(),C,s);}return I;};sap.ushell.renderers.fiori2.Renderer.prototype.addToolAreaItem=function(c,i,C,s){var f=function(c){return new sap.ushell.ui.shell.ToolAreaItem(c);},I=this.createItem(c,C,s,f);if(i){this.showToolAreaItem(I.getId(),C,s);}return I;};sap.ushell.renderers.fiori2.Renderer.prototype.addHeaderEndItem=function(c,C,i,b,s){var p=C;p.showSeparator=false;var f=function(C){return new sap.ushell.ui.shell.ShellHeadItem(C);},I=this.createItem(p,b,s,f);if(i){this.showHeaderEndItem(I.getId(),b,s);}return I;};sap.ushell.renderers.fiori2.Renderer.prototype.getModelConfiguration=function(){return this.shellCtrl.getModelConfiguration();};sap.ushell.renderers.fiori2.Renderer.prototype.addEndUserFeedbackCustomUI=function(c,s){this.shellCtrl.addEndUserFeedbackCustomUI(c,s);};sap.ushell.renderers.fiori2.Renderer.prototype.addUserPreferencesEntry=function(e){return this.shellCtrl.addUserPreferencesEntry(e);};sap.ushell.renderers.fiori2.Renderer.prototype.setHeaderTitle=function(t,c,C){var i=null,l=sap.ushell.renderers.fiori2.Renderer.prototype.LaunchpadState;if(c){var f=function(C){var o;jQuery.sap.require(c);o=jQuery.sap.getObject(c);return new o(C);};i=this.createItem(C,false,[l.Home,l.App],f);}this.shellCtrl.setHeaderTitle(t,i);};sap.ushell.renderers.fiori2.Renderer.prototype.setLeftPaneVisibility=function(l,v){this.oShellModel.showShellItem("/showPane",l,v);};sap.ushell.renderers.fiori2.Renderer.prototype.showToolArea=function(l,v){this.oShellModel.showShellItem("/toolAreaVisible",l,v);};sap.ushell.renderers.fiori2.Renderer.prototype.setHeaderHiding=function(h){return this.oShellModel.setHeaderHiding(h);};sap.ushell.renderers.fiori2.Renderer.prototype.setFloatingContainerContent=function(c,C,s){this.shellCtrl.setFloatingContainerContent("floatingContainerContent",[c.getId()],C,s);};sap.ushell.renderers.fiori2.Renderer.prototype.setFloatingContainerVisibility=function(v){this.shellCtrl.setFloatingContainerVisibility(v);};sap.ushell.renderers.fiori2.Renderer.prototype.getFloatingContainerVisiblity=function(){return this.shellCtrl.getFloatingContainerVisibility();};sap.ushell.renderers.fiori2.Renderer.prototype.getRightFloatingContainerVisibility=function(){return this.shellCtrl.getRightFloatingContainerVisibility();};sap.ushell.renderers.fiori2.Renderer.prototype.setFloatingContainerDragSelector=function(e){this.shellCtrl.setFloatingContainerDragSelector(e);};sap.ushell.renderers.fiori2.Renderer.prototype.makeEndUserFeedbackAnonymousByDefault=function(e){this.shellCtrl.makeEndUserFeedbackAnonymousByDefault(e);};sap.ushell.renderers.fiori2.Renderer.prototype.showEndUserFeedbackLegalAgreement=function(s){this.shellCtrl.showEndUserFeedbackLegalAgreement(s);};sap.ushell.renderers.fiori2.Renderer.prototype.LaunchpadState={App:"app",Home:"home"};sap.ushell.renderers.fiori2.Renderer.prototype.createInspection=function(a,c,C,s){this.oShellModel.createInspection(a,c,C,s);};sap.ushell.renderers.fiori2.Renderer.prototype.createTriggers=function(t,c,s){this.oShellModel.createTriggers(t,c,s);};sap.ushell.renderers.fiori2.Renderer.prototype.convertButtonsToActions=function(i,c,s,I){var p={},b,t=this;i.forEach(function(a){b=sap.ui.getCore().byId(a);p.id=b.getId();p.text=b.getText();p.icon=b.getIcon();p.tooltip=b.getTooltip();if(b.mEventRegistry&&b.mEventRegistry.press){p.press=b.mEventRegistry.press[0].fFunction;}b.destroy();t.addActionButton("sap.ushell.ui.launchpad.ActionItem",p,true,c,s,I);});};sap.ushell.renderers.fiori2.Renderer.prototype.createItem=function(c,C,s,f){var i;if(c.id){i=sap.ui.getCore().byId(c.id);}if(!i){i=f(c);if(C){this.oShellModel.addElementToManagedQueue(i);}}return i;};sap.ushell.renderers.fiori2.Renderer.prototype.addEntryInShellStates=function(n,e,a,r,s){this.oShellModel.addEntryInShellStates(n,e,a,r,s);};sap.ushell.renderers.fiori2.Renderer.prototype.removeCustomItems=function(s,i,c,S){if(typeof i==="string"){this.oShellModel.removeCustomItems(s,[i],c,S);}else{this.oShellModel.removeCustomItems(s,i,c,S);}};sap.ushell.renderers.fiori2.Renderer.prototype.addCustomItems=function(s,i,c,S){if(typeof i==="string"){this.oShellModel.addCustomItems(s,[i],c,S);}else{this.oShellModel.addCustomItems(s,i,c,S);}};}());