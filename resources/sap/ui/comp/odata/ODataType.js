/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/model/odata/type/Boolean','sap/ui/model/odata/type/Byte','sap/ui/model/odata/type/DateTime','sap/ui/model/odata/type/DateTimeOffset','sap/ui/model/odata/type/Decimal','sap/ui/model/odata/type/Double','sap/ui/model/odata/type/Single','sap/ui/model/odata/type/Guid','sap/ui/model/odata/type/Int16','sap/ui/model/odata/type/Int32','sap/ui/model/odata/type/Int64','sap/ui/model/odata/type/SByte','sap/ui/model/odata/type/String','sap/ui/model/odata/type/Time'],function(B,a,D,b,c,d,S,G,I,e,f,g,h,T){"use strict";var u={"Edm.Boolean":B,"Edm.Byte":a,"Edm.DateTime":D,"Edm.DateTimeOffset":b,"Edm.Decimal":c,"Edm.Double":d,"Edm.Float":S,"Edm.Guid":G,"Edm.Int16":I,"Edm.Int32":e,"Edm.Int64":f,"Edm.SByte":g,"Edm.Single":S,"Edm.String":h,"Edm.Time":T};var n={"Edm.Decimal":true,"Edm.Double":true,"Edm.Float":true,"Edm.Int16":true,"Edm.Int32":true,"Edm.Int64":true,"Edm.Single":true};var m={"Edm.DateTime":true,"Edm.DateTimeOffset":true,"Edm.Time":true};var O={getType:function(t,F,C){var o=null,_;_=u[t];if(_){o=new _(F,C);}return o;},isNumeric:function(t){return n[t]?true:false;},isDateOrTime:function(t){return m[t]?true:false;}};return O;},true);
