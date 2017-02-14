/* Ephox Spell Checker Pro
 *
 * Copyright 2010-2016 Ephox Corporation.  All rights reserved.
 *
 * Version: 0.9.5-51
 */
!function(){var a={},b=function(b){for(var c=a[b],e=c.deps,f=c.defn,g=e.length,h=new Array(g),i=0;i<g;++i)h[i]=d(e[i]);var j=f.apply(null,h);if(void 0===j)throw"module ["+b+"] returned undefined";c.instance=j},c=function(b,c,d){if("string"!=typeof b)throw"module id must be a string";if(void 0===c)throw"no dependencies for "+b;if(void 0===d)throw"no definition function for "+b;a[b]={deps:c,defn:d,instance:void 0}},d=function(c){var d=a[c];if(void 0===d)throw"module ["+c+"] was undefined";return void 0===d.instance&&b(c),d.instance},e=function(a,b){for(var c=a.length,e=new Array(c),f=0;f<c;++f)e.push(d(a[f]));b.apply(null,b)},f={};f.bolt={module:{api:{define:c,require:e,demand:d}}};var g=c,h=function(a,b){g(a,[],function(){return b})};h("7",tinymce.util.JSON),g("8",["7"],function(a){var b="tinyMCESpellingCache",c=function(){function c(){var c=sessionStorage.getItem(b);return c?a.parse(c):{}}function d(c){var d=a.serialize(c);sessionStorage.setItem(b,d)}function e(a,b){var d=c(),e=d[a],f=void 0!==e?e:{};return b(f)}function f(a,b){var e=c(),f=e[a];void 0===f&&(e[a]={},f=e[a]);var g=b(f);return d(e),g}return{read:e,use:f}},d=function(){var a={},b=function(b,c){var d=void 0!==a[b]?a[b]:{};return a[b]=d,c(d)},c=function(b,c){var d=void 0!==a[b]?a[b]:{};return c(d)};return{read:c,use:b}};return{supported:c,unsupported:d}}),g("1",["7","8"],function(a,b){return function(a){function c(){return"undefined"!=typeof Storage&&null!==sessionStorage}function d(a){return a.replace(/\uFEFF/g,"")}function e(a,b,c,e){k.use(a,function(a){var f=d(b);a[f]={misspelled:c,suggestions:e}})}function f(a){a.suggestions=a.suggestions.slice(0,l)}function g(a,b){return k.read(a,function(a){var c=d(b),e=a[c];return void 0!==e&&e.suggestions&&e.suggestions.length>l&&f(e),e})}function h(b){for(var c={},e=[],f=[],h=0;h<b.length;h++){var i=g(a.settings.spellchecker_language,b[h]);i&&i.misspelled&&(c[b[h]]=i),i||(e.push({original:b[h],cleaned:d(b[h])}),f.push(d(b[h])))}return{cachedData:c,wordsToCheck:e,cleanedWordsForServer:f}}function i(b){for(var c=0;c<b.length;c++){var d=g(a.settings.spellchecker_language,b[c].cleaned);d||e(a.settings.spellchecker_language,b[c].cleaned,!1,[])}}function j(b,c,d){var f={};for(var g in b)b[g]&&b[g].misspelled&&(f[g]=b[g].suggestions);for(var h in c){e(a.settings.spellchecker_language,h,!0,c[h]);for(var j=0;j<d.length;j++)if(d[j].cleaned===h){f[d[j].original]=c[h];break}}return i(d),f}var k=c()?b.supported():b.unsupported(),l=5;return{addWordToCache:e,retrieveWordFromCache:g,getCachedCleanedWords:h,cacheAndCombineResults:j,cacheCorrectlySpelledWords:i}}}),g("9",[],function(){function a(a){return a&&1==a.nodeType&&"false"===a.contentEditable}return function(b,c){function d(a,b){if(!a[0])throw"findAndReplaceDOMText cannot handle zero-length matches";return{start:a.index,end:a.index+a[0].length,text:a[0],data:b}}function e(b){var c;if(3===b.nodeType)return b.data;if(q[b.nodeName]&&!p[b.nodeName])return"";if(a(b))return"\n";if(c="",(p[b.nodeName]||r[b.nodeName])&&(c+="\n"),b=b.firstChild)do c+=e(b);while(b=b.nextSibling);return c}function f(a){function b(a,b){for(var c=0;c<a.length;c++)if(a[c]===b)return!0;return!1}for(var c=[],d=0;d<a.length;d++)b(c,a[d])||c.push(a[d]);return c}function g(a){var b=e(a).match(c);return b?f(b):[]}function h(b,c,d){var e,f,g,h,i,j=[],k=0,l=b,m=0;c=c.slice(0),c.sort(function(a,b){return a.start-b.start}),i=c.shift();a:for(;;){if((p[l.nodeName]||r[l.nodeName]||a(l))&&k++,3===l.nodeType&&(!f&&l.length+k>=i.end?(f=l,h=i.end-k):e&&j.push(l),!e&&l.length+k>i.start&&(e=l,g=i.start-k),k+=l.length),e&&f){for(var n=!1,o=e;o!=b;o=o.parentNode)o.className===t&&(n=!0);if(n||(l=d({startNode:e,startNodeIndex:g,endNode:f,endNodeIndex:h,innerNodes:j,match:i.text,matchIndex:m}),k-=f.length-h),e=null,f=null,j=[],i=c.shift(),m++,!i)break}else if(q[l.nodeName]&&!p[l.nodeName]||!l.firstChild){if(l.nextSibling){l=l.nextSibling;continue}}else if(!a(l)){l=l.firstChild;continue}for(;;){if(l.nextSibling){l=l.nextSibling;break}if(l.parentNode===b)break a;l=l.parentNode}}}function i(a,b){function c(c,d){var e=a[d];e.stencil||(e.stencil=b(e));var f=e.stencil.cloneNode(!1);return f.setAttribute("data-mce-index",d),c&&f.appendChild(s.doc.createTextNode(c)),f}return function(a){var b,d,e,f=a.startNode,g=a.endNode,h=a.matchIndex,i=s.doc;if(f===g){var j=f;e=j.parentNode,a.startNodeIndex>0&&(b=i.createTextNode(j.data.substring(0,a.startNodeIndex)),e.insertBefore(b,j));var k=c(a.match,h);return e.insertBefore(k,j),a.endNodeIndex<j.length&&(d=i.createTextNode(j.data.substring(a.endNodeIndex)),e.insertBefore(d,j)),j.parentNode.removeChild(j),k}b=i.createTextNode(f.data.substring(0,a.startNodeIndex)),d=i.createTextNode(g.data.substring(a.endNodeIndex));for(var l=c(f.data.substring(a.startNodeIndex),h),m=[],n=0,o=a.innerNodes.length;n<o;++n){var p=a.innerNodes[n],q=c(p.data,h);p.parentNode.replaceChild(q,p),m.push(q)}var r=c(g.data.substring(0,a.endNodeIndex),h);return e=f.parentNode,e.insertBefore(b,f),e.insertBefore(l,f),e.removeChild(f),e=g.parentNode,e.insertBefore(r,g),e.insertBefore(d,g),e.removeChild(g),r}}function j(a,b){for(var c=a.length;c--;)if(a[c]===b)return c;return-1}function k(a,b){var c=[];return l(a,function(a,d){b(a,d)&&c.push(a)}),a=c,c}function l(a,b){for(var c=0,d=a.length;c<d&&b(a[c],c)!==!1;c++);return this}function m(a,b,c){return a.length&&h(c,a,i(a,b)),this}function n(a,b,c){var f=[],g=e(c);if(g&&a.global)for(;o=a.exec(g);)f.push(d(o,b));return f}var o,p,q,r,s=b.dom,t="mce-spellchecker-ignore";return p=b.schema.getBlockElements(),q=b.schema.getWhiteSpaceElements(),r=b.schema.getShortEndedElements(),{getText:e,getWords:g,each:l,filter:k,find:n,wrap:m,indexOf:j}}}),h("h",tinymce.util.XHR),h("i",tinymce.util.URI),g("a",["h","i","7"],function(a,b,c){return function(d,e){function f(a){return"function"==typeof a}function g(a){for(var b=0,c=0,e=[],f=0;f<a.length;f++)b+=a[f].length,b>q&&(e.push({words:a.slice(c,f+1),language:d.settings.spellchecker_language}),c=f+1,b=0);return c!=a.length&&e.push({words:a.slice(c,a.length),language:d.settings.spellchecker_language}),p=e.length,o=[],e}function h(f,g,h){var i={url:new b(e).toAbsolute(d.settings.spellchecker_rpc_url+r),type:"post",content_type:"application/json",data:c.serialize(f),success:function(a){var b=c.parse(a);b?g(b):h("Server response wasn't valid json.")},error:function(){h(tinymce.translate(["The spelling service was not found: ({0})",d.settings.spellchecker_rpc_url]))}},j=n();return j&&(i.requestheaders=[{key:"tiny-api-key",value:j}]),d.settings.spellchecker_rpc_url?void a.send(i):void h("You need to specify the spellchecker_rpc_url setting.")}function i(a,b,c){var e=d.settings.spellchecker_handler,g=f(e)?e:h;g(a,b,c)}function j(a,b,c,d,e){var f=d.getCachedCleanedWords(e.filter(a));if(!(s>t)){var h=function(a){l(a,f,b,c,d)},j=function(a){m(a)};if(f.wordsToCheck.length>0)for(var k=g(f.cleanedWordsForServer),n=0;n<k.length;n++)i(k[n],h,j);else{var o=d.cacheAndCombineResults(f.cachedData,[],f.wordsToCheck);c(o,b)}}}function k(a){for(var b={},c=0;c<a.length;c++)for(var d in a[c].spell)b[d]=a[c].spell[d];return b}function l(a,b,c,d,e){if(o.push(a),o.length===p){var f=k(o),g=e.cacheAndCombineResults(b.cachedData,f,b.wordsToCheck);d(g,c)}}function m(a){d.setProgressState(!1),d.notificationManager.open({text:a,type:"error"}),s++}function n(){return d.settings.api_key||d.settings.spellchecker_api_key}var o,p,q=15e3,r="/1/correction",s=0,t=5;return{spellcheck:j}}}),h("6",tinymce.util.Tools),g("b",["6"],function(a){return function(b,c){function d(a){var b=a.getAttribute("data-mce-index");return"number"==typeof b?""+b:b}function e(b,c){var e,f=[];if(e=a.toArray(c.getElementsByTagName("span")),e.length)for(var g=0;g<e.length;g++){var h=d(e[g]);null!==h&&h.length&&h===b.toString()&&f.push(e[g])}return f}function f(a,d,e,f){h(d,e);var g=f.find(c,void 0,d);g=f.filter(g,function(b){return!!a[b.text]}),f.wrap(g,function(a){return b.dom.create("span",{"class":e,"data-mce-bogus":1,"data-mce-word":a.text})},d)}function g(a){for(var b=a.parentNode,c=a.childNodes;c.length>0;)b.insertBefore(c[0],a);a.parentNode.removeChild(a)}function h(a,c){for(var d=b.dom.select("span."+c,a),e=0;e<d.length;e++)g(d[e])}return{getElmIndex:d,findSpansByIndex:e,markErrors:f,unwrapWordNode:g,clearWordMarks:h}}}),h("d",tinymce.dom.DOMUtils),g("c",["6","d"],function(a,b){var c=b.DOM,d=function(a,b){for(var c=[];(a=a.parentNode)&&a!==b;)c.push(a);return c},e=function(b,e){a.each(e,function(e){var f=d(e,b);c.remove(e),a.each(f,function(a){c.isEmpty(a)&&c.remove(a,!0)})})},f=function(b,c,d){if(c.length>0){var f=document.createTextNode(d);return c[0].parentNode.replaceChild(f,c[0]),e(b,a.grep(c).slice(1)),f}return null};return{replace:f}}),h("e",tinymce.ui.Menu),h("f",setTimeout),g("2",["9","a","b","c","6","d","e","f"],function(a,b,c,d,e,f,g,h){return function(i,j,k,l,m){function n(a,b){var c=i.selection.getBookmark();Q.markErrors(a,b,N,o()),i.selection.moveToBookmark(c)}function o(){return M.textMatcher||(M.textMatcher=new a(i,m)),M.textMatcher}function p(a,b,c){i.selection.collapse(),c?(k.addWord(a),e.each(i.dom.select("span."+N),function(b){b.getAttribute(P)===a&&i.dom.remove(b,!0)})):e.each(b,function(a){a.className=O})}function q(a,b){var c=a.dom.createRng();return c.setStart(b,0),c.setEnd(b,b.data.length),c}function r(a,b){var c=[],h=j.retrieveWordFromCache(i.settings.spellchecker_language,a).suggestions;e.each(h,function(a){c.push({text:a,onclick:function(){var c=d.replace(i.getBody(),b,a);c&&i.selection.setRng(q(i,c))}})}),c.push({text:"-"}),c.push.apply(c,[{text:"Ignore",onclick:function(){p(a,b)}},{text:"Ignore all",onclick:function(){p(a,b,!0)}}]),I=new g({items:c,context:"contextmenu",onautohide:function(a){a.target.className.indexOf("spellchecker")!=-1&&a.preventDefault()},onhide:function(){I.remove(),I=null}}),I.renderTo(document.body);var k=f.DOM.getPos(i.getContentAreaContainer()),l=i.dom.getPos(b[0]),m=i.dom.getRoot();"BODY"==m.nodeName?(l.x-=m.ownerDocument.documentElement.scrollLeft||m.scrollLeft,l.y-=m.ownerDocument.documentElement.scrollTop||m.scrollTop):(l.x-=m.scrollLeft,l.y-=m.scrollTop),k.x+=l.x,k.y+=l.y,I.moveTo(k.x,k.y+b[0].offsetHeight)}function s(a){for(var b=i.getBody(),c=b,d=i.schema.getBlockElements();a!=b&&(null!==a&&void 0!==a);a=a.parentNode)if(d[a.nodeName]){c=a;break}return c}function t(){R?(D(),Q.clearWordMarks(i.getBody(),N)):(C(),v(i.getBody(),N)),R=!R,K&&K.active(R),L&&L.active(R)}function u(a){S.spellcheck(o().getWords(a),a,n,j,k)}function v(a){u(a),i.focus()}function w(){I&&(I.remove(),I=void 0)}function x(a){if(37!==(a.which||a.keyCode)&&38!==(a.which||a.keyCode)&&39!==(a.which||a.keyCode)&&40!==(a.which||a.keyCode)){var b=i.selection.getNode();if(f.DOM.hasClass(b,N)||f.DOM.hasClass(b,O)){var c=s(b),d=Q.getElmIndex(b),e=Q.findSpansByIndex(d,c);if(e.length>0){for(var g=i.selection.getBookmark(),h=0;h<e.length;h++)Q.unwrapWordNode(e[h]);i.selection.moveToBookmark(g)}}}}function y(a){var b=i.selection.getNode(),c=s(b);32===(a.which||a.keyCode)&&v(c)}function z(a,b){return i.$.contains(a,b)||a===b}function A(a){if(!a.selectionChange){var b=J;z(i.getBody(),a.element)&&(J=s(a.element),b!==J&&b&&v(b))}}function B(a){var b=a.target;if(f.DOM.hasClass(b,N)){var c=Q.getElmIndex(b),d=Q.findSpansByIndex(c,s(b));if(d.length>0){var e=i.dom.createRng();e.setStartBefore(d[0]),e.setEndAfter(d[d.length-1]),i.selection.setRng(e),r(b.getAttribute(P),d,a)}a.preventDefault(),a.stopImmediatePropagation()}}function C(){i.on("remove",w),i.on("keydown",x),i.on("keyup",y),i.on("nodechange",A)}function D(){i.off("remove",w),i.off("keydown",x),i.off("keyup",y),i.off("nodechange",A)}function E(a){i.settings.spellchecker_language=a,R&&v(i.getBody())}function F(a){K=a.control,K.active(R)}function G(a){L=a.control,a.control.on("show",function(){this.active(R)}),L.active(R)}function H(){i.settings.spellchecker_on_load&&h(function(){var a=i.getBody();a&&u(a)},1e3)}var I,J,K,L,M=this,N="mce-spellchecker-word",O="mce-spellchecker-ignore",P="data-mce-word",Q=new c(i,m),R=!0,S=new b(i,l);return i.on("contextmenu",B,!0),i.on("init",H),C(),{languageMenuItemClick:E,spellcheck:t,spellcheckButtonPostRender:F,spellcheckMenuItemPostRender:G}}}),g("g",[],function(){function a(a,b){return a.windowManager.open({layout:"flex",align:"stretch",direction:"column",title:"Spellcheck",spacing:10,padding:10,callbacks:b,minWidth:350,items:[{type:"label",name:"textlabel",text:"Misspelled word"},{type:"textbox",name:"text",spellcheck:!1},{type:"label",name:"suggestionslabel",text:"Suggestions"},{type:"container",layout:"flex",direction:"row",align:"stretch",spacing:10,items:[{type:"selectbox",name:"suggestions",minWidth:150,flex:1,size:6,border:1},{type:"container",layout:"flex",flex:1,spacing:5,direction:"column",pack:"center",align:"stretch",items:[{type:"button",subtype:"primary",name:"change",text:"Change",onclick:"change"},{type:"button",name:"ignore",text:"Ignore",onclick:"ignore"},{type:"button",name:"ignoreall",text:"Ignore all",onclick:"ignoreall"}]}]}],onsubmit:function(a){a.preventDefault(),b.submit()},buttons:[{text:"Close",onclick:"close"}]})}return{open:a}}),g("3",["9","a","b","g","c","6"],function(a,b,c,d,e,f){return function(g,h,i,j,k){function l(a,b){G.markErrors(a,b,D,m()),g.setProgressState(!1),q()}function m(){return C.textMatcher||(C.textMatcher=new a(g,k)),C.textMatcher}function n(a){return h.retrieveWordFromCache(g.settings.spellchecker_language,a).suggestions}function o(){var a,b=s(),c=t(b),d=u(b),f=z.find("#text")[0].value(),h=z.find("#suggestions")[0].getEl().value;f!==c?a=f:h&&(a=h),a&&(e.replace(g.getBody(),d,a),r())}function p(a){var b=s(),c=t(b),d=u(b);g.selection.collapse(),a?(i.addWord(c),f.each(g.dom.select("span."+D),function(a){a.getAttribute(F)==c&&g.dom.remove(a,!0)})):g.dom.remove(d,!0),r()}function q(){var a=s();if(a){A&&A.active(!0),B&&B.active(!0);var b=t(a),c=n(b),e=u(a);g.dom.addClass(e,E),z=d.open(g,I),z.find("#text")[0].value(b),z.find("#suggestions")[0].options(c),z.find("#suggestions")[0].getEl().selectedIndex=0,z.find("#suggestions")[0].getEl().focus(),z.on("close",function(){A&&A.active(!1),B&&B.active(!1),z=void 0,G.clearWordMarks(g.getBody(),D)})}else{var f=tinymce.translate("No misspellings found.");g.notificationManager.open({text:f,type:"info",timeout:3e3})}}function r(){var a=s();if(a){var b=t(a);z.find("#text").value(b);var c=n(b),d=z.find("#suggestions")[0];d.options(c),d.getEl().selectedIndex=0,d.getEl().focus();var e=u(a);g.dom.addClass(e,E)}else z&&z.close()}function s(){return g.dom.select("span."+D)[0]}function t(a){return a.getAttribute(F)}function u(a){var b=G.getElmIndex(a);return G.findSpansByIndex(b,g.getBody())}function v(a){g.settings.spellchecker_language=a}function w(){g.setProgressState(!0),H.spellcheck(m().getWords(g.getBody()),g.getBody(),l,h,i)}function x(a){A=a.control}function y(a){B=a.control}var z,A,B,C=this,D="mce-match-marker",E="mce-match-marker-selected",F="data-mce-word",G=new c(g,k),H=new b(g,j),I={change:o,submit:o,ignore:function(){p(!1)},ignoreall:function(){p(!0)},close:function(){z.close()}};return{languageMenuItemClick:v,spellcheck:w,spellcheckButtonPostRender:x,spellcheckMenuItemPostRender:y}}}),g("4",["6"],function(a){return function(){var b={},c=function(a){b[a.toLowerCase()]=!0},d=function(b){a.each(b,c)},e=function(c){return a.grep(c,function(a){return!b[a.toLowerCase()]})};return{addWord:c,addWords:d,filter:e}}}),h("5",tinymce.PluginManager),g("0",["1","2","3","4","5","6"],function(a,b,c,d,e,f){return e.requireLangPack("tinymcespellchecker","ar,ca,cs,da,de,el,es,fa,fi,fr_FR,he_IL,hr,hu_HU,it,ja,kk,ko_KR,nb_NO,nl,pl,pt_BR,pt_PT,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,zh_CN,zh_TW"),e.add("tinymcespellchecker",function(e,g){function h(a){var b=e.settings.spellchecker_language;f.each(a.control.items(),function(a){a.active(a.data.data===b)})}function i(a){a.control.on("show",function(a){h(a)})}function j(a){var b=a.split(",");return f.map(b,function(a){var b=a.split("=");return{selectable:!0,text:b[0],data:b[1],onclick:function(){q.languageMenuItemClick(b[1])}}})}var k="[\\w'\\-\\u00C0-\\u00FF\\uFEFF\\u2018\\u2019]+",l=e.getParam("spellchecker_wordchar_pattern")||new RegExp(k,"g");e.settings.spellchecker_language=e.settings.spellchecker_language||"en";var m=e.settings.spellchecker_languages||"US English=en,UK English=en_gb,Danish=da,Dutch=nl,Finnish=fi,French=fr,German=de,Italian=it,Norwegian=nb,Brazilian Portuguese=pt,Iberian Portuguese=pt_pt,Spanish=es,Swedish=sv",n=new a(e),o=new d;o.addWords(e.settings.spellchecker_whitelist);var p=e.getParam("spellchecker_dialog"),q=p?new c(e,n,o,g,l,m):new b(e,n,o,g,l,m),r=j(m),s={tooltip:"Spellcheck",onclick:q.spellcheck,onPostRender:q.spellcheckButtonPostRender};r.length>1&&(s.type="splitbutton",s.menu=r,s.onshow=h),e.addButton("spellchecker",s),e.addCommand("mceSpellCheck",q.spellcheck),e.addMenuItem("spellchecker",{text:"Spellcheck",context:"tools",onclick:q.spellcheck,onPostRender:q.spellcheckMenuItemPostRender,selectable:!0}),e.addMenuItem("spellcheckerlanguage",{text:"Spellcheck Language",context:"tools",menu:r,onPostRender:i})}),function(){}}),d("0")()}();
