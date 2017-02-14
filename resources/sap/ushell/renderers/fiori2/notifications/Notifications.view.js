// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.require("sap.m.NotificationListItem");sap.ui.jsview("sap.ushell.renderers.fiori2.notifications.Notifications",{createContent:function(c){var t=this;this.oBusyIndicator=new sap.m.BusyIndicator('notificationsByTypeBusyIndicator',{size:"1rem"});this.oPreviousTabKey="sapUshellNotificationIconTabByDate";this.oPreviousByDateSorting=undefined;this.oActionListItemTemplate=new sap.m.Button({text:"{ActionText}",type:{parts:["Nature"],formatter:function(n){switch(n){case"POSITIVE":return"Accept";case"NEGATIVE":return"Reject";default:return"Default";}}},press:function(e){var n=this.getBindingContext().getPath(),N=this.getModel().getProperty(n),p=n.split("/"),T=t.oIconTabBar.getSelectedKey(),P=T==='sapUshellNotificationIconTabByType'?"/"+p[1]+"/"+p[2]+"/"+p[3]+"/"+p[4]:"/"+p[1]+"/"+p[2]+"/"+p[3],b=this.getModel().getProperty(P),s=b.Id;this.getModel().setProperty(P+"/Busy",true);c.executeAction(s,N.ActionId).done(function(r){if(r&&r.isSucessfull){if(r.message&&r.message.length){sap.m.MessageToast.show(r.message,{duration:4000});}c.removeNotificationFromModel(s);c.cleanModel();}else{sap.ushell.Container.getService('Message').error(r.message);}this.getModel().setProperty(P+"/Busy",false);}.bind(this)).fail(function(){this.getModel().setProperty(P+"/Busy",false);sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedExecuteAction'));}.bind(this));}});this.oActionGroupItemTemplate=new sap.m.Button({text:"{GroupActionText}",type:{parts:["Nature"],formatter:function(n){switch(n){case"POSITIVE":return"Accept";case"NEGATIVE":return"Reject";default:return"Default";}}},press:function(e){var n=this.getBindingContext().getPath(),N=this.getModel().getProperty(n),p=n.split("/"),P="/"+p[1]+"/"+p[2],b=this.getModel().getProperty(P),d=[];b.notifications.forEach(function(f,g){d.push(f.Id);this.getModel().setProperty(P+"/Busy",true);}.bind(this));this.getModel().setProperty(n+"/Busy",true);c.executeBulkAction(d,N.ActionId,this.getProperty("text"),b,n,P);}});this.addStyleClass('sapUshellNotificationsView');this.oNotificationListItemTemplate=new sap.m.NotificationListItem({press:function(e){var b=this.getBindingContext(),m=b.sPath,M=this.getModel().getProperty(m),s=M.NavigationTargetObject,A=M.NavigationTargetAction,p=M.NavigationTargetParams,n=M.Id;c.onListItemPress(n,s,A,p).bind(c);},datetime:{path:"CreatedAt",formatter:sap.ushell.utils.formatDate.bind(c)},title:{parts:["SensitiveText","Text"],formatter:function(s,b){return s?s:b;}},buttons:{path:"Actions",templateShareable:true,sorter:new sap.ui.model.Sorter('Nature',true),template:this.oActionListItemTemplate},unread:{parts:["IsRead"],formatter:function(b){return!b;}},close:function(e){var n=this.getBindingContext().getPath(),N=this.getModel().getProperty(n),s=N.Id;c.dismissNotification(s);},busy:{parts:["Busy"],formatter:function(b){if(b){return b;}return false;}},priority:{parts:["Priority"],formatter:function(p){if(p){p=p.charAt(0)+p.substr(1).toLowerCase();return sap.ui.core.Priority[p];}}}}).addStyleClass("sapUshellNotificationsListItem").addStyleClass('sapContrastPlus').addStyleClass('sapContrast');this.oNotificationGroupTemplate=new sap.m.NotificationListGroup({title:"{GroupHeaderText}",description:"{GroupHeaderText}",collapsed:true,showEmptyGroup:true,datetime:{path:"CreatedAt",formatter:sap.ushell.utils.formatDate.bind(c)},buttons:{path:"Actions",templateShareable:true,sorter:new sap.ui.model.Sorter('Nature',true),template:this.oActionGroupItemTemplate},items:{path:"notifications",template:this.oNotificationListItemTemplate},onCollapse:function(e){var g=e.getSource(),b=g.getId();if(!g.getCollapsed()){c.collapseOtherGroups(b);}},close:function(e){var n=this.getBindingContext().getPath(),p=n.split("/"),P="/"+p[1]+"/"+p[2],N=this.getModel().getProperty(P),b=[];N.notifications.forEach(function(d,f){b.push(d.Id);});c.dismissBulkNotifications(b,N);},priority:{parts:["Priority"],formatter:function(p){if(p){p=p.charAt(0)+p.substr(1).toLowerCase();return sap.ui.core.Priority[p];}}},busy:{parts:["Busy"],formatter:function(b){if(b){return b;}return false;}}});this.oNotificationsListDate=new sap.m.List({id:"sapUshellNotificationsListDate",mode:sap.m.ListMode.None,noDataText:sap.ushell.resources.i18n.getText('noNotificationsMsg'),items:{path:"/notificationsByDateDescending/aNotifications",template:this.oNotificationListItemTemplate,templateShareable:true},growing:true,growingThreshold:400,growingScrollToLoad:true}).addStyleClass("sapUshellNotificationsList");this.oNotificationsListDate.onAfterRendering=function(){c.handleEmptyList();this.oNotificationsListDate.$().parent().parent().scroll(this._triggerRetrieveMoreData.bind(t));if(c._oTopNotificationData){c.scrollToItem(c._oTopNotificationData);}}.bind(this);this.oNotificationsListPriority=new sap.m.List({id:"sapUshellNotificationsListPriority",mode:sap.m.ListMode.None,noDataText:sap.ushell.resources.i18n.getText('noNotificationsMsg'),items:{path:"/notificationsByPriorityDescending/aNotifications",template:this.oNotificationListItemTemplate,templateShareable:true},growing:true,growingThreshold:400,growingScrollToLoad:true}).addStyleClass("sapUshellNotificationsList");this.oNotificationsListPriority.onAfterRendering=function(){c.handleEmptyList();this.oNotificationsListPriority.$().parent().parent().scroll(this._triggerRetrieveMoreData.bind(t));if(c._oTopNotificationData){c.scrollToItem(c._oTopNotificationData);}}.bind(this);this.triggerRetrieveMoreData=function(p){if(!this.getModel().getProperty("/"+p+"/inUpdate")){var n=this.getController().getItemsFromModel(p),b=n?n.length:0,d=b?this.getController().getBasicBufferSize():0,e=d*2/3,f=Math.floor(b-e),l=p==="notificationsByPriorityDescending"?this.oNotificationsListPriority.getItems()[f]:this.oNotificationsListDate.getItems()[f],g=this.getController().getTopOffSet();if(l.getDomRef()&&jQuery(l.getDomRef()).offset().top<=g){this.getController().getNextBuffer(p);}}};this._triggerRetrieveMoreData=function(){this.triggerRetrieveMoreData(c.sCurrentSorting);};this.oNotificationsListType=new sap.m.List({id:"sapUshellNotificationsListType",mode:sap.m.ListMode.SingleSelect,noDataText:sap.ushell.resources.i18n.getText('noNotificationsMsg'),items:{path:"/aNotificationsByType",template:t.oNotificationGroupTemplate,templateShareable:true,growing:true,growingThreshold:400,growingScrollToLoad:true}}).addStyleClass("sapUshellNotificationsList").addStyleClass('sapContrastPlus').addStyleClass('sapContrast');var i=new sap.m.IconTabFilter({id:"sapUshellNotificationIconTabByDate",key:"sapUshellNotificationIconTabByDate",text:sap.ushell.resources.i18n.getText('notificationsSortByDate'),tooltip:sap.ushell.resources.i18n.getText('notificationsSortByDateDescendingTooltip')});var I=new sap.m.IconTabFilter({id:"sapUshellNotificationIconTabByType",key:"sapUshellNotificationIconTabByType",text:sap.ushell.resources.i18n.getText('notificationsSortByType'),tooltip:sap.ushell.resources.i18n.getText('notificationsSortByTypeTooltip'),content:this.oNotificationsListType});var o=new sap.m.IconTabFilter({id:"sapUshellNotificationIconTabByPrio",key:"sapUshellNotificationIconTabByPrio",text:sap.ushell.resources.i18n.getText('notificationsSortByPriority'),tooltip:sap.ushell.resources.i18n.getText('notificationsSortByPriorityTooltip')});this.oIconTabBar=new sap.m.IconTabBar('notificationIconTabBar',{backgroundDesign:sap.m.BackgroundDesign.Transparent,expandable:false,selectedKey:"sapUshellNotificationIconTabByDate",items:[i,I,o],select:function(e){var k=e.getParameter("key"),b=e.getParameter("item");if(k==="sapUshellNotificationIconTabByDate"){if(((t.oPreviousTabKey==="sapUshellNotificationIconTabByDate")&&((t.oPreviousByDateSorting===t.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING)||t.oPreviousByDateSorting===undefined))||((t.oPreviousTabKey!=="sapUshellNotificationIconTabByDate")&&(t.oPreviousByDateSorting===t.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING))){t.oController.sCurrentSorting=t.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING;b.setTooltip(sap.ushell.resources.i18n.getText('notificationsSortByDateAscendingTooltip'));t.oNotificationsListDate.bindItems("/notificationsByDateAscending/aNotifications",t.oNotificationListItemTemplate);if(c.getItemsFromModel(c.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING).length===0){c.getNextBuffer(c.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING);}t.oPreviousByDateSorting=t.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING;}else{t.oController.sCurrentSorting=t.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING;b.setTooltip(sap.ushell.resources.i18n.getText('notificationsSortByDateDescendingTooltip'));t.oNotificationsListDate.bindItems("/notificationsByDateDescending/aNotifications",t.oNotificationListItemTemplate);if(c.getItemsFromModel(c.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING).length===0){c.getNextBuffer(c.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING);}t.oPreviousByDateSorting=t.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING;}t.oPreviousTabKey="sapUshellNotificationIconTabByDate";}else if(k==="sapUshellNotificationIconTabByType"){if(t.oPreviousTabKey!=="sapUshellNotificationIconTabByType"){t.oController.sCurrentSorting=t.oController.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING;t.getController().getNotificationsByTypeWithGroupHeaders();b.removeAllContent();b.addContent(t.oBusyIndicator);t.oIconTabBar.addStyleClass('sapUshellNotificationIconTabByTypeWithBusyIndicator');t.oPreviousTabKey="sapUshellNotificationIconTabByType";}}else{t.oController.sCurrentSorting=t.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING;if(c.getItemsFromModel(c.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING).length===0){c.getNextBuffer(c.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING);}t.oPreviousTabKey="sapUshellNotificationIconTabByPrio";}t.oPreviousTabKey=k;}}).addStyleClass('sapUshellNotificationTabBar');this.oIconTabBar.addEventDelegate({onsaptabprevious:function(e){var O=e.originalEvent,s=O.srcElement,C=s.classList,b;b=jQuery.inArray('sapMITBFilter',C)>-1;if(b===true){e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(e);}}});var a=this.oIconTabBar.onAfterRendering;this.oIconTabBar.onAfterRendering=function(){if(a){a.apply(this,arguments);}var T=sap.ui.getCore().byId('notificationIconTabBar--header');if(T){T.addStyleClass('sapContrastPlus');T.addStyleClass('sapUshellTabBarHeader');}};return[this.oIconTabBar];},getMoreCircle:function(t){var m=new sap.m.Text({text:sap.ushell.resources.i18n.getText('moreNotifications')}),n=new sap.m.Text({text:""}).addStyleClass("sapUshellNotificationsMoreCircleCount"),M=new sap.m.VBox({items:[n,m],alignItems:sap.m.FlexAlignItems.Center}).addStyleClass("sapUshellNotificationsMoreCircle"),b=new sap.m.Text({text:sap.ushell.resources.i18n.getText('moreNotificationsAvailable_message'),textAlign:"Center"}).addStyleClass("sapUshellNotificationsMoreHelpingText"),B=new sap.m.Text({text:sap.ushell.resources.i18n.getText('processNotifications_message'),textAlign:"Center"}).addStyleClass("sapUshellNotificationsMoreHelpingText"),v=new sap.m.VBox({items:[M,b,B]}).addStyleClass("sapUshellNotificationsMoreVBox"),l=new sap.m.CustomListItem({type:sap.m.ListType.Inactive,content:v}).addStyleClass("sapUshellNotificationsMoreListItem").addStyleClass('sapContrastPlus');n.setModel(this.getModel());n.bindText("/"+t+"/moreNotificationCount");this.oMoreListItem=l;return l;},getControllerName:function(){return"sap.ushell.renderers.fiori2.notifications.Notifications";}});}());
