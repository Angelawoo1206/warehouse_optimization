(function(){"use strict";jQuery.sap.require('sap.ushell.renderers.fiori2.search.userpref.SearchPrefsModel');var S=sap.ushell.renderers.fiori2.search.userpref.SearchPrefsModel;jQuery.sap.declare('sap.ushell.renderers.fiori2.search.userpref.SearchPrefs');var m=sap.ushell.renderers.fiori2.search.userpref.SearchPrefs={};jQuery.extend(m,{model:new S(),getEntry:function(){var t=this;return{title:sap.ushell.resources.i18n.getText('sp.userProfiling'),editable:true,isSearchPrefsActive:t.model.isSearchPrefsActive.bind(t.model),value:function(){t.model.reset();return t.model.asyncInit().then(function(){return t.model.getProperty('/sessionUserActive')?sap.ushell.resources.i18n.getText('sp.on'):sap.ushell.resources.i18n.getText('sp.off');});},onSave:function(){return t.model.savePreferences();},onCancel:function(){},content:function(){return t.model.asyncInit().then(function(){var u=sap.ui.view({id:'searchPrefsView',type:sap.ui.core.mvc.ViewType.JS,viewName:'sap.ushell.renderers.fiori2.search.userpref.SearchPrefsDialog'});u.setModel(t.model);return u;});}};}});})();