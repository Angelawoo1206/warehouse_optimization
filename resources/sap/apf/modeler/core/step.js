/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.step");(function(){'use strict';sap.apf.modeler.core.Step=function(s,a,d){var r,b,c,f,e,g,t,n,k,h,l,j,m,o,p,q,u;u=a.instances.messageHandler;if(!d){r=new a.constructors.ElementContainer(s+"-Representation",a.constructors.Representation,a);b={};c=new a.constructors.ElementContainer("SelectProperty",undefined,a);f=new a.constructors.ElementContainer("FilterProperty",undefined,a);e={};g=new a.constructors.ElementContainer("SelectPropertyForFilterMapping",undefined,a);t=new a.constructors.ElementContainer("TargetPropertyForFilterMapping",undefined,a);k=false;n=new a.constructors.ElementContainer("NavigationTarget",undefined,a);}else{r=d.representationContainer;b=d.request;c=d.selectProperties;f=d.filterProperties;e=d.requestForFilterMapping;g=d.selectPropertiesForFilterMapping;t=d.targetPropertiesForFilterMapping;k=d.keepSourceForFilterMapping;n=d.navigationTargets;h=d.titleId;l=d.longTitleId;j=d.leftUpperCornerTextKey;m=d.rightUpperCornerTextKey;o=d.leftLowerCornerTextKey;p=d.rightLowerCornerTextKey;q=d.topNSettings;}this.getId=function(){return s;};this.setTopN=function(i,y){if(y&&y instanceof Array&&y.length>0){this.resetTopN();q={};q.top=i;q.orderby=y;}else{u.putMessage(u.createMessageObject({code:11016}));return;}r.getElements().forEach(function(z){z.setTopN(i);q.orderby.forEach(function(y){z.addOrderbySpec(y.property,y.ascending);});});};this.setTopNValue=function(i){if(!q){q={};}q.top=i;if(q.orderby){v();}};this.setTopNSortProperties=function(i){if(!q){q={};}if(i&&i.length>0){i.forEach(function(y){if(y.ascending==="true"){y.ascending=true;}});}q.orderby=i;if(q.top){v();}};function v(){r.getElements().forEach(function(i){i.setTopN(q.top);i.removeAllOrderbySpecs();q.orderby.forEach(function(y){i.addOrderbySpec(y.property,y.ascending);});});}this.getTopN=function(){if(q&&q.top>0){if(jQuery.isArray(q.orderby)){var c=this.getSelectProperties();var i;for(i=q.orderby.length-1;i>=0;i--){if(jQuery.inArray(q.orderby[i].property,c)<0){q.orderby.splice(i,1);v();}}}return jQuery.extend({},true,q);}};this.resetTopN=function(){q=undefined;r.getElements().forEach(function(i){if(i.getTopN()){i.setTopN(undefined);}});};this.getService=function(){return b.service;};this.setService=function(i){b.service=i;};this.getEntitySet=function(){return b.entitySet;};this.setEntitySet=function(i){b.entitySet=i;};this.setTitleId=function(i){h=i;};this.getTitleId=function(){return h;};this.setLongTitleId=function(i){l=i;};this.getLongTitleId=function(){return l;};this.getSelectProperties=function(){var i=[];var y=c.getElements();y.forEach(function(z){i.push(z.getId());});return i;};this.addSelectProperty=function(i){c.createElementWithProposedId(undefined,i);};this.removeSelectProperty=function(i){c.removeElement(i);};this.getFilterProperties=function(){var i=[];var y=f.getElements();y.forEach(function(z){i.push(z.getId());});return i;};this.addFilterProperty=function(i){return f.createElementWithProposedId(undefined,i).getId();};this.removeFilterProperty=function(i){f.removeElement(i);};this.setFilterMappingService=function(i){e.service=i;};this.getFilterMappingService=function(){return e.service;};this.setFilterMappingEntitySet=function(i){e.entitySet=i;};this.getFilterMappingEntitySet=function(){return e.entitySet;};this.addFilterMappingTargetProperty=function(i){t.createElementWithProposedId(undefined,i);};this.getFilterMappingTargetProperties=function(){var i=[];var y=t.getElements();y.forEach(function(z){i.push(z.getId());});return i;};this.removeFilterMappingTargetProperty=function(i){t.removeElement(i);};this.addNavigationTarget=function(i){n.createElementWithProposedId(undefined,i);};this.getNavigationTargets=function(){var i=[];var y=n.getElements();y.forEach(function(z){i.push(z.getId());});return i;};this.removeNavigationTarget=function(i){n.removeElement(i);};this.setFilterMappingKeepSource=function(i){k=i;};this.getFilterMappingKeepSource=function(){return k;};this.getRepresentations=r.getElements;this.getRepresentation=r.getElement;this.createRepresentation=function(i){var y=r.createElement(i);if(q&&q.top){y.setTopN(q.top);q.orderby.forEach(function(z){y.addOrderbySpec(z.property,z.ascending);});}return y;};this.removeRepresentation=r.removeElement;this.copyRepresentation=r.copyElement;this.moveRepresentationBefore=function(i,y){return r.moveBefore(i,y);};this.moveRepresentationUpOrDown=function(i,y){return r.moveUpOrDown(i,y);};this.moveRepresentationToEnd=function(i){return r.moveToEnd(i);};this.setLeftUpperCornerTextKey=function(i){j=i;};this.getLeftUpperCornerTextKey=function(){return j;};this.setRightUpperCornerTextKey=function(i){m=i;};this.getRightUpperCornerTextKey=function(){return m;};this.setLeftLowerCornerTextKey=function(i){o=i;};this.getLeftLowerCornerTextKey=function(){return o;};this.setRightLowerCornerTextKey=function(i){p=i;};this.getRightLowerCornerTextKey=function(){return p;};this.getConsumablePropertiesForTopN=function(){var i=jQuery.Deferred();x.call(this).done(function(y){var z=[];if(q&&q.orderby&&q.orderby.length>0){q.orderby.forEach(function(A){z.push(A.property);});}i.resolve(w(y,z));});return i.promise();};this.getConsumablePropertiesForRepresentation=function(i){var y=jQuery.Deferred();x.call(this).done(function(z){var A=[];var B=r.getElement(i);jQuery.merge(A,B.getDimensions());jQuery.merge(A,B.getMeasures());jQuery.merge(A,B.getProperties());y.resolve(w(z,A));});return y.promise();};this.getConsumableSortPropertiesForRepresentation=function(i){var y=jQuery.Deferred();x.call(this).done(function(z){var A=[];var B=r.getElement(i);var C=B.getOrderbySpecifications();C.forEach(function(D){A.push(D.property);});y.resolve(w(z,A));});return y.promise();};function w(i,y){var z=[];i.forEach(function(A){if(jQuery.inArray(A,y)===-1){z.push(A);}});return{available:i,consumable:z};}function x(){var i=jQuery.Deferred();var y=[];if(b.service&&b.entitySet){var z=a.instances.metadataFactory.getMetadata(b.service);if(z){var A=z.getAllPropertiesOfEntitySet(b.entitySet);var B=this.getSelectProperties();B.forEach(function(C){if(jQuery.inArray(C,A)!==-1){y.push(C);}});}i.resolve(y);}else{i.resolve([]);}return i.promise();}this.copy=function(i){var y={request:b,selectProperties:c,filterProperties:f,requestForFilterMapping:e,selectPropertiesForFilterMapping:g,targetPropertiesForFilterMapping:t,navigationTargets:n,keepSourceForFilterMapping:k,titleId:h,longTitleId:l,leftUpperCornerTextKey:j,rightUpperCornerTextKey:m,leftLowerCornerTextKey:o,rightLowerCornerTextKey:p,topNSettings:q};var d=sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(y);d.representationContainer=r.copy((i||this.getId())+"-Representation");return new sap.apf.modeler.core.Step((i||this.getId()),a,d);};};}());