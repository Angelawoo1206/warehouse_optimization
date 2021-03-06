/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.ajax");jQuery.sap.require("sap.apf.core.utils.checkForTimeout");(function(){'use strict';sap.apf.core.ajax=function(i){var m=i.instances&&i.instances.messageHandler;var a=jQuery.extend(true,{},i);if(a.functions&&a.functions.ajax){delete a.functions.ajax;}if(a.instances&&a.instances.messageHandler){delete a.instances.messageHandler;}var b=a.beforeSend;var s=a.success;var e=a.error;var o;var r;a.beforeSend=function(j,c){if(b){b(j,c);}};a.success=function(c,t,j){var M;try{M=sap.apf.core.utils.checkForTimeout(j);if(M){e(c,"error",undefined,M);}else{s(c,t,j);}}catch(f){d(f);}};a.error=function(j,t,c){var M;try{M=sap.apf.core.utils.checkForTimeout(j);if(M){e(j,t,c,M);}else{e(j,t,c);}}catch(f){d(f);}};if(i.functions&&i.functions.ajax){r=i.functions.ajax(a);}else{r=jQuery.ajax(a);}if(a.async!==undefined&&a.async===false&&m&&m.isOwnException(o)){throw new Error(o&&o.message||"");}return r;function d(c){var f;var M;o=c;if(!m.isOwnException(c)){f=c&&c.message||"";M=m.createMessageObject({code:"5042",aParameters:[f]});m.putMessage(M);}}};}());
