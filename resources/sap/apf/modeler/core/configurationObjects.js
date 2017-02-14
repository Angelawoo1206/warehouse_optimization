/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.configurationObjects");(function(){'use strict';sap.apf.modeler.core.ConfigurationObjects=function(i){var t=this;var H,a,p,m;if(i.constructors&&i.constructors.Hashtable){H=i.constructors.Hashtable;}if(i.instances.textPool){a=i.instances.textPool;}if(i.instances.persistenceProxy){p=i.instances.persistenceProxy;}if(i.instances.messageHandler){m=i.instances.messageHandler;}function c(k,l){var P=[];if(l){P.push(l);}m.putMessage(m.createMessageObject({code:k,aParameters:P}));}function b(l){var r=l&&l.type&&l.type==="label"&&l.kind&&l.kind==="text"&&l.key&&typeof l.key==="string";if(!r){c(11030,l.key);}return r;}this.serializeLabelKey=function(k){return{type:"label",kind:"text",key:a.getPersistentKey(k)};};this.serializeAndAddThumbnail=function(k,l){var n=k.getLeftLowerCornerTextKey();var o=k.getLeftUpperCornerTextKey();var r=k.getRightUpperCornerTextKey();var q=k.getRightLowerCornerTextKey();var u={type:"thumbnail"};if(o){u.leftUpper=this.serializeLabelKey(o);}if(n){u.leftLower=this.serializeLabelKey(n);}if(r){u.rightUpper=this.serializeLabelKey(r);}if(q){u.rightLower=this.serializeLabelKey(q);}if(u.leftLower||u.leftUpper||u.rightLower||u.rightUpper){l.thumbnail=u;}};this.serializeCategory=function(k,l){var T=a.get(k.labelKey);var n=[];if(l){l.forEach(function(q){n.push({type:"step",id:q});});}var o=(T&&T.TextElementDescription)||"";return{type:"category",description:o,id:k.getId(),label:t.serializeLabelKey(k.labelKey),steps:n};};this.validateCategory=function(k){var r=k&&k.type&&k.type==="category"&&k.id&&k.steps&&b(k.label);if(r){k.steps.forEach(function(o){if(!o.type||o.type!=="step"||!o.id){r=false;}});}if(!r){c(11031,k.id);}return r;};this.validateRequest=function(r){var k=r&&r.id&&r.type==="request"&&r.service&&typeof r.service==="string"&&((r.entityType&&typeof r.entityType==="string")||(r.entitySet&&typeof r.entitySet==="string"))&&r.selectProperties&&r.selectProperties&&r.selectProperties instanceof Array&&r.selectProperties.length>=0;if(!k){c(11032,r.id);}return k;};this.validateBinding=function(k){var r=k&&k.id&&k.type==="binding"&&k.requiredFilters&&k.requiredFilters instanceof Array&&k.requiredFilters.length>=0&&k.representations&&k.representations instanceof Array;if(!r){c(11033,k.id);}return r;};this.validateFacetFilter=function(k){var r=k&&k.id&&k.property&&k.type==="facetFilter";if(!r){c(11034,k.id);}return r;};this.validateNavigationTarget=function(n){var r=n&&n.id&&n.semanticObject&&n.action&&n.type==="navigationTarget"&&n.hasOwnProperty("isStepSpecific");if(!r){c(11040,n.id);}return r;};this.validateStep=function(k){var r=k&&k.id&&k.type==="step"&&b(k.title)&&b(k.longTitle)&&k.hasOwnProperty("navigationTargets");if(!r){c(11035,k.id);}return r;};this.validateConfiguration=function(k){var r=k&&k.applicationTitle&&k.applicationTitle.key&&typeof k.applicationTitle.key==='string'&&k.steps&&k.steps instanceof Array&&k.steps.length>=0&&k.requests&&k.requests instanceof Array&&k.requests.length>=0&&k.bindings&&k.bindings instanceof Array&&k.bindings.length>=0&&k.representationTypes&&k.representationTypes instanceof Array&&k.representationTypes.length>=0&&k.categories&&k.categories instanceof Array&&k.categories.length>=0;if(!r){c(11036);}return r;};function s(k){var r=[];var l,n;var o,q;var u;var v;var w;var x;var y=k.getRepresentations();y.forEach(function(z){l=[];n=z.getDimensions();n.forEach(function(A){var B={fieldName:A};if(z.getDimensionKind(A)){B.kind=z.getDimensionKind(A);}if(z.getDimensionTextLabelKey(A)){B.fieldDesc={type:'label',kind:'text',key:z.getDimensionTextLabelKey(A)};}if(z.getLabelDisplayOption(A)){B.labelDisplayOption=z.getLabelDisplayOption(A);}l.push(B);});o=[];q=z.getMeasures();q.forEach(function(A){var B={fieldName:A};if(z.getMeasureKind(A)){B.kind=z.getMeasureKind(A);}if(z.getMeasureTextLabelKey(A)){B.fieldDesc={type:'label',kind:'text',key:z.getMeasureTextLabelKey(A)};}o.push(B);});u=[];z.getProperties().forEach(function(A){var B={fieldName:A};if(z.getPropertyKind(A)){B.kind=z.getPropertyKind(A);}if(z.getPropertyTextLabelKey(A)){B.fieldDesc={type:'label',kind:'text',key:z.getPropertyTextLabelKey(A)};}u.push(B);});v=[];z.getOrderbySpecifications().forEach(function(A){v.push({property:A.property,ascending:A.ascending});});w={id:z.getId(),representationTypeId:z.getRepresentationType(),parameter:{dimensions:l,measures:o,properties:u,alternateRepresentationTypeId:z.getAlternateRepresentationType()}};if(z.getWidthProperties()){w.parameter.width=z.getWidthProperties();}if(v.length>0){w.parameter.orderby=v;}x=z.getTopN();if(x&&x>0){w.parameter.top=x;}t.serializeAndAddThumbnail(z,w);r.push(w);});return r;}this.serializeBinding=function(k,l){var n="binding-for-"+k.getId();var T=a.get(k.getTitleId());var o=(T&&T.TextElementDescription)||"";l.bindings.push({type:"binding",id:n,stepDescription:o,requiredFilters:k.getFilterProperties(),representations:s(k)});return n;};this.serializeRequest=function(k,l){var r;var n="request-for-"+k.getId();r={type:"request",id:n,service:k.getService(),entitySet:k.getEntitySet(),selectProperties:k.getSelectProperties()};l.requests.push(r);return n;};this.serializeFilterMappingRequest=function(o,k){var r="request-for-FilterMapping"+o.getId();var l={type:"request",id:r,service:o.getFilterMappingService(),entitySet:o.getFilterMappingEntitySet(),selectProperties:o.getFilterMappingTargetProperties()};k.requests.push(l);return r;};this.serializeStep=function(k,l){var r=t.serializeRequest(k,l);var n=t.serializeBinding(k,l);var T=a.get(k.getTitleId());var o=(T&&T.TextElementDescription)||"";var q=k.getLongTitleId();var u;var v={type:"step",description:o,request:r,binding:n,id:k.getId(),title:t.serializeLabelKey(k.getTitleId()),navigationTargets:[]};if(k.getFilterMappingService()){v.filterMapping={requestForMappedFilter:t.serializeFilterMappingRequest(k,l),target:k.getFilterMappingTargetProperties(),keepSource:k.getFilterMappingKeepSource()?"true":"false"};}u=k.getTopN();if(u){v.topNSettings=u;}if(q!==""&&q!==undefined){v.longTitle=t.serializeLabelKey(k.getLongTitleId());}this.serializeAndAddThumbnail(k,v);k.getNavigationTargets().forEach(function(w){v.navigationTargets.push({type:"navigationTarget",id:w});});return v;};this.serializeFacetFilter=function(k,l){var r,n,v;if(k.getServiceOfFilterResolution()){r=q("FilterResolution",k,l);}if(k.getUseSameRequestForValueHelpAndFilterResolution()){n=r;}else if(k.getServiceOfValueHelp()){n=q("ValueHelp",k,l);}var T=a.get(k.getLabelKey());var o=(T&&T.TextElementDescription)||"";if(k.getValueList().length>0){v=k.getValueList();}return{type:"facetFilter",description:o,id:k.getId(),alias:k.getAlias(),property:k.getProperty(),multiSelection:k.isMultiSelection()+"",preselectionFunction:k.getPreselectionFunction(),preselectionDefaults:u(),valueList:v,label:t.serializeLabelKey(k.getLabelKey()),invisible:!k.isVisible(),filterResolutionRequest:r,valueHelpRequest:n,hasAutomaticSelection:k.getAutomaticSelection()+"",useSameRequestForValueHelpAndFilterResolution:k.getUseSameRequestForValueHelpAndFilterResolution()+""};function q(w,k,l){var x;var y;var z;var A;switch(w){case"ValueHelp":y=k.getServiceOfValueHelp();z=k.getEntitySetOfValueHelp();A=k.getSelectPropertiesOfValueHelp();break;case"FilterResolution":y=k.getServiceOfFilterResolution();z=k.getEntitySetOfFilterResolution();A=k.getSelectPropertiesOfFilterResolution();break;}var B=w+"-request-for-"+k.getId();x={type:"request",id:B,service:y,entitySet:z,selectProperties:A};l.requests.push(x);return B;}function u(){if(k.getNoneSelection()===true){return null;}return k.getPreselectionDefaults();}};this.serializeNavigationTarget=function(n,k){var r={type:"navigationTarget",id:n.getId(),semanticObject:n.getSemanticObject(),action:n.getAction(),isStepSpecific:n.isStepSpecific()};if(n.getFilterMappingService()){r.filterMapping={requestForMappedFilter:t.serializeFilterMappingRequest(n,k),target:n.getFilterMappingTargetProperties()};}return r;};this.serializeSmartFilterBar=function(k){if(k){return{id:k.getId(),type:'smartFilterBar',service:k.getService(),entityType:k.getEntityType()};}};this.serializeConfiguration=function(k){var l={analyticalConfigurationName:k.getConfigurationName(),applicationTitle:t.serializeLabelKey(k.getApplicationTitle()),steps:[],requests:[],bindings:[],representationTypes:[],categories:[],navigationTargets:[]};var n={requests:l.requests,bindings:l.bindings};k.getCategories().forEach(function(o){var q=k.getCategoryStepAssignments(o.getId());l.categories.push(t.serializeCategory(o,q));});k.getSteps().forEach(function(o){var q=t.serializeStep(o,n);l.steps.push(q);});k.getFacetFilters().forEach(function(o){var q=t.serializeFacetFilter(o,n);if(l.facetFilters===undefined){l.facetFilters=[];}l.facetFilters.push(q);});if(k.getFilterOption().facetFilter===true&&l.facetFilters===undefined){l.facetFilters=[];}k.getNavigationTargets().forEach(function(o){var q=t.serializeNavigationTarget(o,n);l.navigationTargets.push(q);});var S=this.serializeSmartFilterBar(k.getSmartFilterBar());if(S!==undefined){l.smartFilterBar=S;}return l;};function d(k,l){var n=k.thumbnail;if(!n){return;}if(n.leftLower){l.setLeftLowerCornerTextKey(n.leftLower.key);}if(n.leftUpper){l.setLeftUpperCornerTextKey(n.leftUpper.key);}if(n.rightLower){l.setRightLowerCornerTextKey(n.rightLower.key);}if(n.rightUpper){l.setRightUpperCornerTextKey(n.rightUpper.key);}}function e(k,r,l){var n=l.createStepWithId(k.id);var o=l.getStep(n);var q=r.getItem(k.request);if(q.entityType){q.entitySet=q.entityType;delete q.entityType;}if(q.service){l.registerService(q.service);}o.setService(q.service);o.setEntitySet(q.entitySet);o.setTitleId(k.title.key);if(k.longTitle&&k.longTitle.key){o.setLongTitleId(k.longTitle.key);}if(k.navigationTargets){k.navigationTargets.forEach(function(v){o.addNavigationTarget(v.id);});}d(k,o);q.selectProperties.forEach(function(v){o.addSelectProperty(v);});var u=r.getItem(k.binding);u.requiredFilters.forEach(function(v){o.addFilterProperty(v);});u.representations.forEach(function(v){var w;var x=o.getRepresentation(o.createRepresentation().getId());x.setRepresentationType(v.representationTypeId);x.setAlternateRepresentationType(v.parameter.alternateRepresentationTypeId);v.parameter.dimensions.forEach(function(y){x.addDimension(y.fieldName);if(y.fieldDesc){x.setDimensionTextLabelKey(y.fieldName,y.fieldDesc.key);}if(y.kind){x.setDimensionKind(y.fieldName,y.kind);}if(y.labelDisplayOption){x.setLabelDisplayOption(y.fieldName,y.labelDisplayOption);}});v.parameter.measures.forEach(function(y){x.addMeasure(y.fieldName);if(y.fieldDesc){x.setMeasureTextLabelKey(y.fieldName,y.fieldDesc.key);}if(y.kind){x.setMeasureKind(y.fieldName,y.kind);}});if(v.parameter.properties){v.parameter.properties.forEach(function(y){x.addProperty(y.fieldName);if(y.fieldDesc){x.setPropertyTextLabelKey(y.fieldName,y.fieldDesc.key);}if(y.kind){x.setPropertyKind(y.fieldName,y.kind);}});}if(v.parameter.width){for(w in v.parameter.width){if(v.parameter.width.hasOwnProperty(w)){x.setWidthProperty(w,v.parameter.width[w]);}}}if(v.parameter.orderby&&!v.parameter.topN){v.parameter.orderby.forEach(function(y){x.addOrderbySpec(y.property,y.ascending);});}d(v,x);});if(k.filterMapping){h(k.filterMapping,o,r);}if(k.topNSettings){o.setTopN(k.topNSettings.top,k.topNSettings.orderby);}}function f(k,r,l){var n=l.createFacetFilterWithId(k.id);var o=l.getFacetFilter(n);o.setLabelKey(k.label.key);o.setAlias(k.alias);o.setProperty(k.property);if(k.preselectionFunction&&k.preselectionFunction!==""){o.setPreselectionFunction(k.preselectionFunction);}else if(k.preselectionDefaults===null){o.setNoneSelection(true);}else{o.setPreselectionDefaults(k.preselectionDefaults);}if(k.valueList){o.setValueList(k.valueList);}if(k.useSameRequestForValueHelpAndFilterResolution&&k.useSameRequestForValueHelpAndFilterResolution==="true"){o.setUseSameRequestForValueHelpAndFilterResolution(true);}else{o.setUseSameRequestForValueHelpAndFilterResolution(false);}if(k.multiSelection==="true"){o.setMultiSelection(true);}if(k.invisible===true){o.setInvisible();}if(k.hasAutomaticSelection==="true"){o.setAutomaticSelection(true);}else{o.setAutomaticSelection(false);}if(k.valueHelpRequest){var q=r.getItem(k.valueHelpRequest);if(q.entityType){q.entitySet=q.entityType;delete q.entityType;}if(q.service){l.registerService(q.service);o.setServiceOfValueHelp(q.service);}if(q.entitySet){o.setEntitySetOfValueHelp(q.entitySet);}q.selectProperties.forEach(function(v){o.addSelectPropertyOfValueHelp(v);});}if(k.filterResolutionRequest){var u=r.getItem(k.filterResolutionRequest);if(u.entityType){u.entitySet=u.entityType;delete u.entityType;}if(u.service){l.registerService(u.service);o.setServiceOfFilterResolution(u.service);}if(u.entitySet){o.setEntitySetOfFilterResolution(u.entitySet);}u.selectProperties.forEach(function(v){o.addSelectPropertyOfFilterResolution(v);});}}function g(k,r,l){var n=l.createNavigationTargetWithId(k.id);var o=l.getNavigationTarget(n);o.setSemanticObject(k.semanticObject);o.setAction(k.action);if(k.isStepSpecific===true){o.setStepSpecific();}else{o.setGlobal();}if(k.filterMapping){h(k.filterMapping,o,r);}}function h(k,l,r){var n=r.getItem(k.requestForMappedFilter);if(n.entityType){n.entitySet=n.entityType;delete n.entityType;}l.setFilterMappingService(n.service);l.setFilterMappingEntitySet(n.entitySet);k.target.forEach(function(o){l.addFilterMappingTargetProperty(o);});if(k.hasOwnProperty("keepSource")){if(k.keepSource==="true"){l.setFilterMappingKeepSource(true);}else{l.setFilterMappingKeepSource(false);}}}function j(r,k){var l=r.getItem("SmartFilterBar-1");if(l){k.setFilterOption({smartFilterBar:true});var n=k.getSmartFilterBar();n.setService(l.service);n.setEntityType(l.entityType);return true;}return false;}this.mapToDesignTime=function(r,k){var l;var n=false;var o=false;k.setApplicationTitle(r.getItem('applicationTitle').key);r.getSteps().forEach(function(q){e(q,r,k);});r.getCategories().forEach(function(q){k.createCategoryWithId({labelKey:q.label.key},q.id);q.steps.forEach(function(u){k.addCategoryStepAssignment(q.id,u.id);});});l=r.getFacetFilters();if(l.emptyArray===true){n=true;k.setFilterOption({facetFilter:true});}else{l.forEach(function(q){n=true;k.setFilterOption({facetFilter:true});f(q,r,k);});}r.getNavigationTargets().forEach(function(q){g(q,r,k);});o=j(r,k);if(!n&&!o){k.setFilterOption({none:true});}};this.loadAllConfigurations=function(k,l){var n=new sap.apf.core.utils.Filter(m,'Application','eq',k);p.readCollection("configuration",function(r,o,q){l(r,o,q);},undefined,undefined,n,true);};this.getTextKeysFromAllConfigurations=function(k,l){this.loadAllConfigurations(k,function(n,o,q){var r=new H(m);if(q){l(undefined,q);return;}n.forEach(function(u){var v=JSON.parse(u.SerializedAnalyticalConfiguration);var w=sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration(v);w.forEach(function(x){r.setItem(x,x);});});l(r,undefined);});};};sap.apf.modeler.core.ConfigurationObjects.deepDataCopy=function deepDataCopy(i){var r;if(!i){r=i;}else if(i.copy&&typeof i.copy==="function"){r=i.copy();}else if(i&&typeof i==="object"){if(i instanceof Array){r=[];i.forEach(function(a){r.push(deepDataCopy(a));});}else{r={};for(var a in i){if(!i.hasOwnProperty(a)){continue;}r[a]=deepDataCopy(i[a]);}}}else{r=i;}return r;};sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration=function getTextKeysFromConfiguration(c){var r=[];if(!c){return;}if(c.type&&c.type==="label"&&c.kind&&c.kind==="text"&&c.key){return[c.key];}for(var i in c){if(typeof c[i]!=="object"||!c.hasOwnProperty(i)){continue;}Array.prototype.push.apply(r,getTextKeysFromConfiguration(c[i]));}return r;};}());
