sap.ui.define(["sap/ui/model/resource/ResourceModel"],function(R){'use strict';var r={};r.lib=(function(){var a=new R({bundleName:"sap/rules/ui/parser/i18n.messages_descriptions"});var b=new R({bundleName:"sap/rules/ui/parser/i18n.op_messages_descriptions"});return{getString:function(m,p,f){var B;var c=f.split(".");c=f.split(".")[c.length-1];if(f&&c==="op_messages_descriptions"){B=b.getResourceBundle();}else{B=a.getResourceBundle();}var M=B.getText(m);var i;if(p){for(i=0;i<p.length;i++){if(M.indexOf("{"+i+"}")>-1){M=M.replace("{"+i+"}",p[i]);}}}jQuery.sap.log.debug("code: "+m+", params: "+p+"\nMessage: "+M);return M;}};}());return r;},true);
