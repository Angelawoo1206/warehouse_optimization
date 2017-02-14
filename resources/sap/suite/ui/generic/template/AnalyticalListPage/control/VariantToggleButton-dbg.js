sap.ui.define(["sap/m/ToggleButton", "sap/ui/comp/smartvariants/PersonalizableInfo", "sap/ui/comp/smartvariants/SmartVariantManagement"
], function(ToggleButton, PersonalizableInfo, SmartVariantManagement) {
	"use strict";

	var VariantToggleButton = ToggleButton.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.VariantToggleButton", {
		renderer:{},
		metadata:{
			properties: {
				persistencyKey: {
					type: "string",
					group: "Misc",
					defaultValue: null
				}
			},
			associations: {
				smartVariant: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			}
		}
	});

	VariantToggleButton.prototype.init = function() {
		var me = this;

		if (ToggleButton.prototype.init) {
			ToggleButton.prototype.init.call(me);
		}

		me.attachPress(me._handlePress);
		me._bApplyingVariant = false;
	};

	VariantToggleButton.prototype.setSmartVariant = function(oSmartVariantId) {
		var me = this;

		me.setAssociation("smartVariant", oSmartVariantId);

		if (oSmartVariantId) {
	        var oPersInfo = new PersonalizableInfo({
	            type: "alr_togglebutton",
	            keyName: "persistencyKey",
	            dataSource: "TODO"
	        });
			oPersInfo.setControl(me);
		}

		me._oVariantManagement = me._getVariantManagementControl(oSmartVariantId);
		if (me._oVariantManagement) {
			me._oVariantManagement.addPersonalizableControl(oPersInfo);
			me._oVariantManagement.initialise(me._variantInitialised, me);
		} else if (oSmartVariantId) {
			if (typeof oSmartVariantId === "string") {
				jQuery.sap.log.error("[VariantToggleButton] Variant with id=" + oSmartVariantId + " cannot be found");
			} else if (oSmartVariantId instanceof sap.ui.core.Control) {
				jQuery.sap.log.error("[VariantToggleButton] Variant with id=" + oSmartVariantId.getId() + " cannot be found");
			}
		} else {
			jQuery.sap.log.error("[VariantToggleButton] Missing SmartVariant");
		}
	};

	VariantToggleButton.prototype.applyVariant = function(oVariantJSON, sContext) {
		var me = this;

		me._bApplyingVariant = true;

		me._oCurrentVariant = oVariantJSON;
		if (me._oCurrentVariant === "STANDARD") {
			me._oCurrentVariant = null;
		}

		if (me._oCurrentVariant && me._oCurrentVariant.pressed != "" && me._oCurrentVariant.pressed !== me.getPressed()) {
			me.setPressed(me._oCurrentVariant.pressed);
			me.firePress({ pressed: me.getPressed() });
		}

		me._bApplyingVariant = false;
	};

	VariantToggleButton.prototype.fetchVariant = function() {
		var me = this;
		if (me._oCurrentVariant === "STANDARD" || me._oCurrentVariant === null) {
			me._oCurrentVariant = {pressed:me.getPressed()};
		}

		return me._oCurrentVariant;
	};

	VariantToggleButton.prototype._variantInitialised = function() {
		if (!this._oCurrentVariant) {
			this._oCurrentVariant = "STANDARD";
		}
	};

	VariantToggleButton.prototype._getVariantManagementControl = function(oSmartVariantId) {
		var oSmartVariantControl = null;
		if (oSmartVariantId) {
			if (typeof oSmartVariantId === "string") {
				oSmartVariantControl = sap.ui.getCore().byId(oSmartVariantId);
			} else {
				oSmartVariantControl = oSmartVariantId;
			}

			if (oSmartVariantControl) {
				if (!(oSmartVariantControl instanceof SmartVariantManagement)) {
					jQuery.sap.log.error("Control with the id=" + oSmartVariantId.getId ? oSmartVariantId.getId() : oSmartVariantId + " not of expected type");
					return null;
				}
			}
		}

		return oSmartVariantControl;
	};

	VariantToggleButton.prototype._handlePress = function(ev) {
		var me = this;
		me._oCurrentVariant = {pressed:me.getPressed()};

		if (me._oVariantManagement && !me._bApplyingVariant) {
			me._oVariantManagement.currentVariantSetModified(true);
		}
	};

	return VariantToggleButton;
}, /* bExport= */true);


