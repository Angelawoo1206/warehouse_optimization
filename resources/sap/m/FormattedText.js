/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','./FormattedTextAnchorGenerator'],function(q,l,C,F){"use strict";var a=C.extend("sap.m.FormattedText",{metadata:{library:"sap.m",properties:{htmlText:{type:"string",group:"Misc",defaultValue:""},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},convertLinksToAnchorTags:{type:"sap.m.LinkConversion",group:"Behavior",defaultValue:sap.m.LinkConversion.None},convertedLinksDefaultTarget:{type:"string",group:"Behavior",defaultValue:"_blank"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null}}}});var _={};_.ATTRIBS={'style':1,'class':1,'a::href':1,'a::target':1};_.ELEMENTS={'a':{cssClass:'sapMLink'},'abbr':1,'blockquote':1,'br':1,'cite':1,'code':1,'em':1,'h1':{cssClass:'sapMTitle sapMTitleStyleH1'},'h2':{cssClass:'sapMTitle sapMTitleStyleH2'},'h3':{cssClass:'sapMTitle sapMTitleStyleH3'},'h4':{cssClass:'sapMTitle sapMTitleStyleH4'},'h5':{cssClass:'sapMTitle sapMTitleStyleH5'},'h6':{cssClass:'sapMTitle sapMTitleStyleH6'},'p':1,'pre':1,'strong':1,'span':1,'u':1,'dl':1,'dt':1,'dd':1,'ol':1,'ul':1,'li':1};a.prototype.init=function(){};function s(t,c){var w;var d,v,e=t==="a";var f=_.ELEMENTS[t].cssClass||"";for(var i=0;i<c.length;i+=2){d=c[i];v=c[i+1];if(!_.ATTRIBS[d]&&!_.ATTRIBS[t+"::"+d]){w='FormattedText: <'+t+'> with attribute ['+d+'="'+v+'"] is not allowed';q.sap.log.warning(w,this);c[i+1]=null;continue;}if(d=="href"){if(!q.sap.validateUrl(v)){q.sap.log.warning("FormattedText: incorrect href attribute:"+v,this);c[i+1]="#";e=false;}}if(d=="target"){e=false;}if(f&&d.toLowerCase()=="class"){c[i+1]=f+" "+v;f="";}}if(e){c.push("target");c.push("_blank");}if(f){c.push("class");c.push(f);}return c;}function p(t,c){if(_.ELEMENTS[t]){return s(t,c);}else{var w='<'+t+'> is not allowed';q.sap.log.warning(w,this);}}function b(t){return q.sap._sanitizeHTML(t,{tagPolicy:p,uriRewriter:function(u){if(q.sap.validateUrl(u)){return u;}}});}function o(e){var n=window.open();n.opener=null;n.location=e.currentTarget.href;e.preventDefault();}a.prototype.onAfterRendering=function(){this.$().find('a[target="_blank"]').on("click",o);};a.prototype._getDisplayHtml=function(){var t=this.getHtmlText(),A=this.getConvertLinksToAnchorTags();if(A===l.LinkConversion.None){return t;}t=F.generateAnchors(t,A,this.getConvertedLinksDefaultTarget());return b(t);};a.prototype.setHtmlText=function(t){return this.setProperty("htmlText",b(t));};return a;},true);