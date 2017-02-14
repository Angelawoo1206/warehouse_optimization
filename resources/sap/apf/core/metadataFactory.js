/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.metadataFactory");(function(){'use strict';sap.apf.core.MetadataFactory=function(i){this.type="metadataFactory";var t=this;var m=i.instances.messageHandler;var H=i.constructors.Hashtable;var M=i.constructors.Metadata;var E=i.constructors.EntityTypeMetadata;var a=i.constructors.MetadataFacade;delete i.constructors.Metadata;delete i.constructors.EntityTypeMetadata;delete i.constructors.MetadataFacade;delete i.instances.configurationFactory;var o=new H(m);this.getMetadata=function(A){var b;if(o.hasItem(A)===false){b=new M(i,A);if(!b.failed){o.setItem(A,{metadata:b});}else{return undefined;}}return o.getItem(A).metadata;};this.getEntityTypeMetadata=function(A,e){var b;var c=this.getMetadata(A);if(!c){return undefined;}b=o.getItem(A).entityTypes;if(!b){b=new H(m);o.getItem(A).entityTypes=b;}if(!b.getItem(e)){b.setItem(e,new E(m,e,c));}return b.getItem(e);};this.getMetadataFacade=function(A){return new a({constructors:{MetadataProperty:i.constructors.MetadataProperty},instances:{messageHandler:m,metadataFactory:t}},A);};this.getServiceDocuments=function(){return i.functions.getServiceDocuments();};this.getEntitySets=function(s){var b=this.getMetadata(s);return b.getEntitySets();};this.getEntityTypes=function(s){var b=this.getMetadata(s);return b.getEntityTypes();};};}());