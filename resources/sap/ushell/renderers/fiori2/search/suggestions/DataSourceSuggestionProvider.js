(function(){"use strict";jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');var S=sap.ushell.renderers.fiori2.search.SearchHelper;jQuery.sap.require('sap.ushell.renderers.fiori2.search.suggestions.SuggestionProvider');var a=sap.ushell.renderers.fiori2.search.suggestions.SuggestionProvider;jQuery.sap.require('sap.ushell.renderers.fiori2.search.suggestions.SuggestionTypeProps');var b=sap.ushell.renderers.fiori2.search.suggestions.SuggestionTypeProps;var s=window.sinabase;jQuery.sap.declare('sap.ushell.renderers.fiori2.search.suggestions.DataSourceSuggestionProvider');var m=sap.ushell.renderers.fiori2.search.suggestions.DataSourceSuggestionProvider=function(){this.init.apply(this,arguments);};m.prototype=jQuery.extend(new a(),{init:function(p){a.prototype.init.apply(this,arguments);this.suggestDataSources=S.refuseOutdatedRequests(this.suggestDataSources);},abortSuggestions:function(){this.suggestDataSources.abort();},getSuggestions:function(){if(!this.model.isBusinessObjSearchEnabled()){return jQuery.when([]);}if(!this.model.getDataSource().equals(this.model.allDataSource)){return jQuery.when([]);}return this.suggestDataSources();},suggestDataSources:function(){var t=this;return t.model.getServerDataSources().then(function(d){if(jQuery.inArray(t.model.appDataSource,d)<0){d.unshift(t.model.appDataSource);}if(jQuery.inArray(t.model.allDataSource,d)<0){d.unshift(t.model.allDataSource);}var c=t.model.getProperty('/uiFilter/searchTerms');var e=c.replace(/\*/g,'');var T=new S.Tester(e);var o;var f;var g=[];for(var i=0;i<d.length;++i){var h=d[i];if(h.equals(t.model.getDataSource())){continue;}o=T.test(h.label);if(o.bMatch===true){f={};f.label='<i>'+sap.ushell.resources.i18n.getText("searchInPlaceholder",o.sHighlightedText)+'</i>';f.labelRaw='';f.dataSource=h;f.type=s.SuggestionType.DATASOURCE;f.position=b[s.SuggestionType.DATASOURCE].position;g.push(f);if(g.length===b[s.SuggestionType.DATASOURCE].limit){break;}}}return g;});}});})();
