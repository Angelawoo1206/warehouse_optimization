(function(){"use strict";jQuery.sap.declare("sap.ushell.components.flp.CustomRouter");sap.ui.core.routing.Router.extend("sap.ushell.components.flp.CustomRouter",{constructor:function(){sap.ui.core.routing.Router.apply(this,arguments);this.attachRouteMatched(this._onHandleRouteMatched,this);},navTo:function(){if(!this._bIsInitialized){this.initialize();}sap.ui.core.routing.Router.prototype.navTo.apply(this,arguments);},destroy:function(){sap.ui.core.routing.Router.prototype.destroy.apply(this,arguments);},_onHandleRouteMatched:function(e){var p=e.getParameters(),t=sap.ui.getCore().byId(p.config.controlId);var r=this.getTarget(p.config.target).display();t.to(r.oTargetParent);setTimeout(function(){sap.ui.getCore().getEventBus().publish("launchpad","launchpadCustomRouterRouteMatched");},0);}});})();
