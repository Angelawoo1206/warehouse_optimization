(function(){"use strict";jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchNavigationObject');var _=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");sap.ushell.renderers.fiori2.search.SearchNavigationObject.extend("sap.ushell.renderers.fiori2.search.SearchNavigationIntentObject",{constructor:function(p){sap.ushell.renderers.fiori2.search.SearchNavigationObject.prototype.constructor.apply(this,arguments);this._externalTarget=p.externalTarget;},performNavigation:function(){if(_){_.toExternal(this._externalTarget);}else{sap.ushell.renderers.fiori2.search.SearchNavigationObject.prototype.performNavigation.apply(this,arguments);}}});})();
