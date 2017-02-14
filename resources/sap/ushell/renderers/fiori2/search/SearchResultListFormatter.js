(function(){"use strict";jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchResultListFormatter');var m=sap.ushell.renderers.fiori2.search.SearchResultListFormatter=function(){this.init.apply(this,arguments);};m.prototype={init:function(){},format:function(s,t){return this._doFormat(s.getElements(),t);},_getImageUrl:function(r){var i={imageUrl:'',name:''};for(var p in r){var a=r[p];var b=false;try{if(a.value&&(a.$$MetaData$$.presentationUsage.indexOf('Image')>=0||a.$$MetaData$$.presentationUsage.indexOf('Thumbnail')>=0)){b=true;}}catch(e){}if(!b){continue;}i.imageUrl=a.value;i.name=p;return i;}return i;},_moveWhyFound2ResponseAttr:function(w,p){var l=w.length;while(l--){if(w[l].labelRaw===p.labelRaw&&p!==undefined){p.value=w[l].value;p.whyfound=true;w.splice(l,1);}}},_appendRemainingWhyfounds2FormattedResultItem:function(w,i){var l=w.length;while(l--){if(w[l].labelRaw!==undefined){var I={};I.name=w[l].label;I.value=w[l].value;I.whyfound=true;i.push(I);w.splice(l,1);}}},_doFormat:function(r,t){var s=function(a,b){return a.displayOrder-b.displayOrder;};var c,d,e,f,g;var h=[];for(var i=0;i<r.length;i++){var j=r[i];if(j.$$DataSourceMetaData$$.semanticObjectType==='fileprocessorurl'){c=j.$$DataSourceMetaData$$.client;d='UIA000~EPM_FILE_PROC_U_DEMO~';if(j.$$DataSourceMetaData$$.objectName&&j.$$DataSourceMetaData$$.objectName.value){d=j.$$DataSourceMetaData$$.objectName.value;}e='/sap/es/fl_get_files?sap-client='+c+'&connector='+d+'&filetype=ThumbNail&PHIO_ID='+j.PHIO_ID.valueRaw;j.thumbnail={$$MetaData$$:{accessUsage:[],correspondingSearchAttributeName:"thumbnail",dataType:"String",description:"Thumbnail",displayOrder:0,isKey:false,isSortable:false,isTitle:false,presentationUsage:["Thumbnail"]},label:"Thumbnail",labelRaw:"Thumbnail",value:e,valueRaw:e};f='/sap/es/fl_get_files?sap-client='+c+'&connector='+d+'&filetype=BinaryContent&PHIO_ID='+j.PHIO_ID.valueRaw;j.titlelink={$$MetaData$$:{accessUsage:[],correspondingSearchAttributeName:"titlelink",dataType:"String",description:"Display original document",displayOrder:0,isKey:false,isSortable:false,isTitle:false,presentationUsage:["Titlelink"]},label:"Display original document",labelRaw:"Display original document",value:f,valueRaw:f};g='/sap/es/fl_get_files?sap-client='+c+'&connector='+d+'&filetype=SUVFile&PHIO_ID='+j.PHIO_ID.valueRaw;g='/ui/processSteps/Pdf2Text/pdfjs/web/viewer.html?file='+encodeURIComponent(g);j.suvlink={$$MetaData$$:{accessUsage:[],correspondingSearchAttributeName:"suvlink",dataType:"String",description:"Display suv file",displayOrder:0,isKey:false,isSortable:false,isTitle:false,presentationUsage:["Link"]},label:"Display suv file",labelRaw:"suvlink",value:g,valueRaw:g};}var u='';var k=j.$$RelatedActions$$;for(var l in k){if(k[l].type==="Navigation"||k[l].type==="Link"){u=encodeURI(k[l].uri);}}var w=j.$$WhyFound$$||[];var n=[];var o=[];var p=[];var q='';var v={};for(var x in j){if(!j[x].label||!j[x].$$MetaData$$){continue;}var A=j[x].$$MetaData$$.presentationUsage||[];if(A&&A.length>0){if(A.indexOf("Title")>-1&&j[x].value){this._moveWhyFound2ResponseAttr(w,j[x]);q=q+" "+j[x].value;}if(A.indexOf("Summary")>-1){n.push({property:x,displayOrder:j[x].$$MetaData$$.displayOrder});}else if(A.indexOf("Detail")>-1){o.push({property:x,displayOrder:j[x].$$MetaData$$.displayOrder});}else if(A.indexOf("Title")>-1){p.push({property:x,displayOrder:j[x].$$MetaData$$.displayOrder});}}var B=j[x].$$MetaData$$.semanticObjectType;if(B&&B.length>0){v[B]=j[x].valueRaw;}}n.sort(s);o.sort(s);p.sort(s);var C=n.concat(o);var D={};D.key=j.key;D.keystatus=j.keystatus;D.semanticObjectTypeAttrs=v;var E=this._getImageUrl(j);D.imageUrl=E.imageUrl;D.dataSourceName=j.$$DataSourceMetaData$$.label;D.dataSource=j.$$DataSourceMetaData$$;D.uri=u;D.semanticObjectType=j.$$DataSourceMetaData$$.semanticObjectType||"";D.$$Name$$='';D.systemId=j.$$DataSourceMetaData$$.systemId||"";D.client=j.$$DataSourceMetaData$$.client||"";D.suvlink=j.suvlink;var F;var I={};var G=[];for(var z=0;z<C.length;z++){F=C[z].property;I={};if(F!==E.name){this._moveWhyFound2ResponseAttr(w,j[F]);I.name=j[F].label;I.value=j[F].value;I.key=F;I.isTitle=false;I.isSortable=j[F].$$MetaData$$.isSortable;I.attributeIndex=z;if(j[F].whyfound){I.whyfound=j[F].whyfound;}G.push(I);}}var T=[];for(var y=0;y<p.length;y++){F=p[y].property;I={};if(F!==E.name){I.name=j[F].label;I.value=j[F].value;I.key=F;I.isTitle=false;I.isSortable=j[F].$$MetaData$$.isSortable;T.push(I);}}D.$$Name$$=q.trim();D.numberofattributes=C.length;D.title=j.title;D.itemattributes=G;D.titleattributes=T;D.selected=D.selected||false;D.expanded=D.expanded||false;this._appendRemainingWhyfounds2FormattedResultItem(w,D.itemattributes);h.push(D);}return h;}};})();