/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides class sap.ui.rta.plugin.RTAElementMover.
sap.ui.define([
  'sap/ui/dt/plugin/ElementMover',
	'sap/ui/dt/OverlayUtil',
	'sap/ui/dt/ElementUtil',
	'sap/ui/fl/Utils',
	'sap/ui/rta/Utils',
	'sap/ui/rta/command/CommandFactory'
],
function(ElementMover, OverlayUtil, ElementUtil, FlexUtils, Utils, CommandFactory) {
	"use strict";

	/**
	 * Constructor for a new RTAElementMover.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The RTAElementMover is responsible for the RTA specific adaption of element movements.
	 *
	 * @author SAP SE
	 * @version 1.44.6
	 *
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.plugin.RTAElementMover
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var RTAElementMover = ElementMover.extend("sap.ui.rta.plugin.RTAElementMover", /** @lends sap.ui.rta.plugin.RTAElementMover.prototype */ {
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.rta",
			properties : {
				commandFactory : {
					type : "any",
					defaultValue : CommandFactory
				},
				movableTypes : {
					type : "string[]",
					defaultValue : ["sap.ui.core.Element"]
				}
			},
			associations : {
			},
			events : {
			}
		}
	});

	function fnGetRelevantContainer(oOverlay, bIsParentOverlay) {
		var oRelevantContainer;
		if (oOverlay.isInHiddenTree() && oOverlay.getPublicParentElementOverlay()) {
			oRelevantContainer = oOverlay.getPublicParentElementOverlay().getElementInstance();
		} else if (!oOverlay.isInHiddenTree()) {
			var oElement = oOverlay.getElementInstance();
			var oDesignTimeMetadata = oOverlay.getDesignTimeMetadata();
			if (bIsParentOverlay && !oDesignTimeMetadata.getData().getRelevantContainer) {
				oRelevantContainer = oElement;
			} else {
				oRelevantContainer = oDesignTimeMetadata.getRelevantContainer(oElement);
			}
		}
		return oRelevantContainer;
	}

	function fnHasParentAggregationMoveAction(oOverlay, oElement) {
		var oPublicParentAggregationOverlay = oOverlay.getPublicParentAggregationOverlay();
		if (oPublicParentAggregationOverlay){
			return fnHasMoveAction(oPublicParentAggregationOverlay, oElement);
		}
		return false;
	}

	function fnHasMoveAction(oAggregationOverlay, oElement) {
		var oPublicAggregationDTMetadata = oAggregationOverlay.getDesignTimeMetadata();
		return !!oPublicAggregationDTMetadata.getMoveAction(oElement);
	}

	/**
	 * Predicate to compute movability of an type
	 * @param {any} oElement given element
	 * @public
	 * @return {boolean} true if type is movable, false otherwise
	 */
	ElementMover.prototype.isMovableType = function(oElement) {
		//real check is part of checkMovable which has the overlay
		return true;
	};

	/**
	 * @param  {sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {boolean}          true if embedded, false if not
	 * @override
	 */
	RTAElementMover.prototype.checkMovable = function(oOverlay) {
		var bMovable = ElementMover.prototype.checkMovable.apply(this, arguments);
		var oElement;

		if (bMovable) {
			oElement = oOverlay.getElementInstance();
			bMovable = Utils.isEditable(oOverlay);

			if (bMovable){
				bMovable = fnHasParentAggregationMoveAction(oOverlay, oElement);
			}
		}
		return bMovable && Utils.hasParentStableId(oOverlay);
	};

	/**
	 * Checks droppability for aggregation overlays
	 * @param  {sap.ui.dt.Overlay} oAggregationOverlay aggregation overlay object
	 * @return {boolean}                     true if aggregation overlay is droppable, false if not
	 * @override
	 */
	RTAElementMover.prototype.checkTargetZone = function(oAggregationOverlay) {
		var bTargetZone = ElementMover.prototype.checkTargetZone.call(this, oAggregationOverlay);
		var bEditable, bMovable = false;
		var oMovedOverlay, oTargetOverlay;
		var oMovedElement, oTargetElement, oMovedElementContainer, oTargetZoneRelevantContainer;

		if (bTargetZone) {
			// check for same container
			oMovedOverlay = this.getMovedOverlay();
			oTargetOverlay = oAggregationOverlay.getParent();
			oMovedElementContainer = fnGetRelevantContainer(oMovedOverlay, false);
			oTargetZoneRelevantContainer = fnGetRelevantContainer(oTargetOverlay, true);

			if (!oMovedElementContainer || !oTargetZoneRelevantContainer) {
				return false;
			} else {
				oMovedElement = oMovedOverlay.getElementInstance();
				oTargetElement = oTargetOverlay.getElementInstance();

				bEditable = Utils.isEditable(oTargetOverlay, oMovedElement);

				if (oTargetElement === oTargetZoneRelevantContainer) {
					bMovable = fnHasMoveAction(oAggregationOverlay, oMovedElement);
				} else {
					bMovable = fnHasParentAggregationMoveAction(oTargetOverlay, oMovedElement);
				}

				bTargetZone = (oMovedElementContainer === oTargetZoneRelevantContainer) && bEditable && bMovable;
			}
		}

		return bTargetZone;
	};

//	RTAElementMover.Default = new RTAElementMover();

	return RTAElementMover;
}, /* bExport= */ true);
