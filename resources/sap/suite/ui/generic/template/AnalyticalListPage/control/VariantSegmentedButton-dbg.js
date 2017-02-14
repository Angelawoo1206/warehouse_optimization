sap.ui.define(["sap/m/SegmentedButton", "sap/ui/comp/smartvariants/PersonalizableInfo", "sap/ui/comp/smartvariants/SmartVariantManagement"
], function(SegmentedButton, PersonalizableInfo, SmartVariantManagement) {
	"use strict";

	var VariantSegmentedButton = SegmentedButton.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.VariantSegmentedButton", {
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

	VariantSegmentedButton.prototype.init = function() {
		var me = this;

		if (SegmentedButton.prototype.init) {
			SegmentedButton.prototype.init.call(me);
		}

		me.attachSelect(me._handleSelection);
		me._bApplyingVariant = false;
	};

	VariantSegmentedButton.prototype.setSmartVariant = function(oSmartVariantId) {
		var me = this;

		me.setAssociation("smartVariant", oSmartVariantId);

		if (oSmartVariantId) {
	        var oPersInfo = new PersonalizableInfo({
	            type: "alr_segmentedbutton",
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
				jQuery.sap.log.error("[VariantSegmentedButton] Variant with id=" + oSmartVariantId + " cannot be found");
			} else if (oSmartVariantId instanceof sap.ui.core.Control) {
				jQuery.sap.log.error("[VariantSegmentedButton] Variant with id=" + oSmartVariantId.getId() + " cannot be found");
			}
		} else {
			jQuery.sap.log.error("[VariantSegmentedButton] Missing SmartVariant");
		}
	};

	VariantSegmentedButton.prototype.applyVariant = function(oVariantJSON, sContext) {
		var me = this;

		me._bApplyingVariant = true;

		me._oCurrentVariant = oVariantJSON;
		if (me._oCurrentVariant === "STANDARD") {
			me._oCurrentVariant = null;
		}

		if (me._oCurrentVariant && me._oCurrentVariant.selectedKey != "" && me._oCurrentVariant.selectedKey != me.getSelectedKey()) {
			me.setSelectedKey(me._oCurrentVariant.selectedKey);
			me.fireSelect({
				button: null,
				id: null,
				key: me._oCurrentVariant.selectedKey
			});
		}

		me._bApplyingVariant = false;
	};

	VariantSegmentedButton.prototype.fetchVariant = function() {
		var me = this;
		if (me._oCurrentVariant === "STANDARD" || me._oCurrentVariant === null) {
			me._oCurrentVariant = {selectedKey:me.getProperty("selectedKey")};
		}

		return me._oCurrentVariant;
	};

	VariantSegmentedButton.prototype._variantInitialised = function() {
		if (!this._oCurrentVariant) {
			this._oCurrentVariant = "STANDARD";
		}
	};

	VariantSegmentedButton.prototype._getVariantManagementControl = function(oSmartVariantId) {
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

	VariantSegmentedButton.prototype._handleSelection = function(ev) {
		var me = this;
		me._oCurrentVariant = {selectedKey:me.getSelectedKey()};

		if (me._oVariantManagement && !me._bApplyingVariant) {
			me._oVariantManagement.currentVariantSetModified(true);
		}
	};

	return VariantSegmentedButton;
}, /* bExport= */true);


