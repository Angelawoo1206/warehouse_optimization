/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.SemanticObjectController.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element', './Factory', 'sap/ui/model/json/JSONModel'
], function(jQuery, library, Element, Factory, JSONModel) {
	"use strict";

	/**
	 * Constructor for a new navpopover/SemanticObjectController.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SemanticObjectController allows the user to register against semantic object navigation events as well as define semantic objects
	 *        which should be ignored.
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.SemanticObjectController
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SemanticObjectController = Element.extend("sap.ui.comp.navpopover.SemanticObjectController", /** @lends sap.ui.comp.navpopover.SemanticObjectController.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Comma-separated list of field names that must not be displayed as links.
				 * 
				 * @since 1.28.0
				 */
				ignoredFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to <code>true</code>, the SemanticObjectController will retrieve all navigation targets once and will disable links for
				 * which no targets were found. Setting this value to <code>true</code> will trigger an additional roundtrip.
				 * 
				 * @deprecated Since 1.42.0. The property <code>prefetchNavigationTargets</code> is obsolete as navigation targets are determined
				 *             automatically. The SmartLink controls are re-rendered as soon as the asynchronous determination of navigation targets
				 *             has been completed.
				 * @since 1.28.0
				 */
				prefetchNavigationTargets: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Maps the field names to the related semantic objects. When accessing this property for the first time, the mapping will be
				 * calculated from the metadata within the provided model.
				 * 
				 * @since 1.28.0
				 */
				fieldSemanticObjectMap: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The name of the entity set used. If <code>entitySet</code> has not been defined, the SemanticObjectController tries to retrieve
				 * the name from its parents. <b>Note:</b> This is not a dynamic UI5 property.
				 * 
				 * @since 1.28.0
				 */
				entitySet: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Navigation property that points from the current to the related entity type where the com.sap.vocabularies.Communication.v1.Contact
				 * annotation is defined, for example, <code> '\{"Supplier":"to_Supplier", "CompanyName":"to_Company"\}' </code>. An empty string
				 * means that the related entity type is the current one.
				 * 
				 * @since 1.40.0
				 */
				contactAnnotationPaths: {
					type: "object",
					defaultValue: null
				},

				/**
				 * Determines whether the personalization link is shown inside the NavigationPopover control. For example,
				 * <code> '\{"Supplier":false, "CompanyName":true\}' </code>.
				 * 
				 * @since 1.44.0
				 */
				enableAvailableActionsPersonalization: {
					type: "object",
					defaultValue: null
				}
			},
			events: {

				/**
				 * After the navigation targets have been retrieved, <code>navigationTargetsObtained</code> is fired and makes it possible you to
				 * change the targets.
				 * 
				 * @since 1.28.0
				 */
				navigationTargetsObtained: {
					parameters: {
						/**
						 * The main navigation object.
						 */
						mainNavigation: {
							type: "sap.ui.comp.navpopover.LinkData"
						},

						/**
						 * Array of available navigation target objects.
						 */
						actions: {
							type: "sap.ui.comp.navpopover.LinkData[]"
						},

						/**
						 * The navigation object for the own application. This navigation option is by default not visible on the popover.
						 */
						ownNavigation: {
							type: "sap.ui.comp.navpopover.LinkData"
						},

						/**
						 * Array containing contact data.
						 */
						popoverForms: {
							type: "sap.ui.layout.form.SimpleForm[]"
						},

						/**
						 * The semantic object for which the navigation targets have been retrieved.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * The ID of the control that fires this event. If <code>navigationTargetsObtained</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is also the SmartLink's ID. If
						 * <code>navigationTargetsObtained</code> is registered on the SemanticObjectController, <code>originalId</code> helps to
						 * identify the original SmartLink control which triggered the event.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function shows the actual navigation popover. If the <code>navigationTargetsObtained</code> has been
						 * registered, the <code>show</code> function has to be called manually in order to open the navigation popover. Signatures:
						 * <code>show()</code>
						 * <code>show(oMainNavigation, aAvailableActions, oAdditionalContent)</code> Parameters:
						 * <ul>
						 * <li>{sap.ui.comp.navpopover.LinkData | null | undefined} oMainNavigation The main navigation object. With
						 * <code>null</code> the main navigation object will be removed. With <code>undefined</code> the old object will remain.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData[] | [] | undefined} aAvailableActions Array containing the cross application
						 * navigation links. With empty array all available links will be removed. With <code>undefined</code> the old links will
						 * remain.</li>
						 * <li>{sap.ui.core.Control | null | undefined} oAdditionalContent Control that will be displayed in extra content section on
						 * the popover. With <code>null</code> the main extra content object will be removed. With <code>undefined</code> the old
						 * object still remains.</li>
						 * </ul>
						 * <code>show(sMainNavigationId, oMainNavigation, aAvailableActions, oAdditionalContent)</code> Parameters:
						 * <ul>
						 * <li>{string | null | undefined} sMainNavigationId The visible description for the main navigation link. With
						 * <code>null</code>, the description for the main navigation link is calculated using binding context of given source
						 * object (for example SmartLink). With <code>undefined</code> the old description will remain.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData | null | undefined} oMainNavigation The main navigation object. With
						 * <code>null</code> the main navigation object will be removed. With <code>undefined</code> the old object will remain.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData[] | [] | undefined} aAvailableActions Array containing the cross application
						 * navigation links. With empty array all available links will be removed. With <code>undefined</code> the old links will
						 * remain.</li>
						 * <li>{sap.ui.core.Control | null | undefined} oAdditionalContent Control that will be displayed in extra content section on
						 * the popover. With <code>null</code> the main extra content object will be removed. With <code>undefined</code> the old
						 * object still remains.</li>
						 * </ul>
						 */
						show: {
							type: "function"
						}
					}
				},

				/**
				 * Event is fired before the navigation popover opens and before navigation target links are retrieved. Event can be used to change
				 * the parameters used to retrieve the navigation targets. In case of SmartLink, <code>beforePopoverOpens</code> is fired after the
				 * link has been clicked.
				 * 
				 * @since 1.28.0
				 */
				beforePopoverOpens: {
					parameters: {
						/**
						 * The semantic object for which the navigation targets will be retrieved.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes calculated from the binding that will be used to retrieve the navigation targets.
						 * 
						 * @deprecated Since 1.42.0. The parameter <code>semanticAttributes</code> is obsolete. Instead use the parameter
						 *             <code>semanticAttributesOfSemanticObjects</code>.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * A map of semantic objects for which the navigation targets will be retrieved and it's semantic attributes calculated from
						 * the binding context. The semantic attributes will be used as parameters in order to retrieve the navigation targets.
						 * 
						 * @since 1.42.0
						 */
						semanticAttributesOfSemanticObjects: {
							type: "object"
						},

						/**
						 * This callback function enables you to define a changed semantic attributes map. Signatures:
						 * <code>setSemanticAttributes(oSemanticAttributesMap)</code> Parameter:
						 * <ul>
						 * <li>{object} oSemanticAttributesMap New map containing the semantic attributes</li>
						 * <li>{string} sSemanticObject Semantic Object for which the oSemanticAttributesMap belongs</li>
						 * </ul>
						 */
						setSemanticAttributes: {
							type: "function"
						},

						/**
						 * This callback function sets an application state key that is used over the cross-application navigation. Signatures:
						 * <code>setAppStateKey(sAppStateKey)</code> Parameter:
						 * <ul>
						 * <li>{string} sAppStateKey</li>
						 * </ul>
						 */
						setAppStateKey: {
							type: "function"
						},

						/**
						 * The ID of the control that fires this event. If <code>beforePopoverOpens</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is also the SmartLink's ID. If the
						 * <code>beforePopoverOpens</code> is registered on the SemanticObjectController, <code>originalId</code> helps to
						 * identify the original SmartLink control which triggered the event.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function triggers the retrieval of navigation targets and leads to the opening of the navigation popover.
						 * Signatures: <code>open()</code> If <code>beforePopoverOpens</code> has been registered, <code>open</code> function
						 * has to be called manually in order to open the navigation popover.
						 */
						open: {
							type: "function"
						}
					}
				},

				/**
				 * This event is fired after a navigation link on the navigation popover has been clicked. This event is only fired, if the user
				 * left-clicks the link. Right-clicking the link and selecting 'Open in New Window' etc. in the context menu does not fire the event.
				 * 
				 * @since 1.28.0
				 */
				navigate: {
					parameters: {
						/**
						 * The UI text shown in the clicked link.
						 */
						text: {
							type: "string"
						},

						/**
						 * The navigation target of the clicked link.
						 */
						href: {
							type: "string"
						},

						/**
						 * The semantic object used to retrieve this target.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes used to retrieve this target.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * The ID of the control that fires this event. If <code>navigate</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is the SmartLink's ID. If <code>navigate</code> is
						 * registered on the SemanticObjectController, <code>originalId</code> helps to identify the original SmartLink control
						 * which triggered the event.
						 */
						originalId: {
							type: "string"
						}
					}
				},

				/**
				 * If the property <code>prefetchNavigationTargets</code> is set to <code>true</code>, event <code>prefetchDone</code> is fired
				 * after all navigation targets have been retrieved.
				 * 
				 * @deprecated Since 1.42.0. The event <code>prefetchDone</code> is obsolete because it depends on the property
				 *             <code>prefetchNavigationTargets</code> which has been deprecated.
				 * @since 1.28.0
				 */
				prefetchDone: {
					parameters: {
						/**
						 * A map containing all semantic objects as keys for which at least one navigation target has been found. The value for each
						 * semantic object key is an array containing the available actions found for this semantic object.
						 */
						semanticObjects: {
							type: "object"
						}
					}
				}
			}
		}
	});

	// Fill 'oSemanticObjects' as soon as possible
	SemanticObjectController.oSemanticObjects = {};
	SemanticObjectController.oNavigationTargetActions = {};
	SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = false;
	SemanticObjectController.bHasPrefetchedNavigationTargetActions = false;
	SemanticObjectController.oPromise;
	SemanticObjectController.oPromiseActions;

	SemanticObjectController.prototype.init = function() {
		SemanticObjectController.prefetchDistinctSemanticObjects();

		this._proxyOnBeforePopoverOpens = jQuery.proxy(this._onBeforePopoverOpens, this);
		this._proxyOnTargetsObtained = jQuery.proxy(this._onTargetsObtained, this);
		this._proxyOnNavigate = jQuery.proxy(this._onNavigate, this);
		this._aRegisteredControls = [];
	};

	/**
	 * Returns whether the given control has been registered by the SemanticObjectController.
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink | sap.ui.comp.navpopover.NavigationPopoverHandler} oControl
	 * @returns {boolean}
	 * @public
	 */
	SemanticObjectController.prototype.isControlRegistered = function(oControl) {
		return this._aRegisteredControls.indexOf(oControl) > -1;
	};

	/**
	 * Adds the given control to the SemanticObjectController and registers all relevant events.
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink | sap.ui.comp.navpopover.NavigationPopoverHandler} oControl
	 * @public
	 */
	SemanticObjectController.prototype.registerControl = function(oControl) {
		if (!(oControl instanceof sap.ui.comp.navpopover.SmartLink || oControl instanceof sap.ui.comp.navpopover.NavigationPopoverHandler)) {
			jQuery.sap.log.warning("sap.ui.comp.navpopover.SemanticObjectController: " + (oControl.getMetadata ? oControl.getMetadata() : "parameter") + " is neither of SmartLink nor of NavigationPopoverHandler instance");
			return;
		}
		if (this.isControlRegistered(oControl)) {
			return;
		}
		if (oControl.attachBeforePopoverOpens) {
			oControl.attachBeforePopoverOpens(this._proxyOnBeforePopoverOpens);
		}
		if (oControl.attachNavigationTargetsObtained) {
			oControl.attachNavigationTargetsObtained(this._proxyOnTargetsObtained);
		}

		if (oControl.attachInnerNavigate) {
			oControl.attachInnerNavigate(this._proxyOnNavigate);
		}

		this._aRegisteredControls.push(oControl);
	};

	/**
	 * Removes the given control from the SemanticObjectController and unregisters all relevant events.
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink | sap.ui.comp.navpopover.NavigationPopoverHandler} oControl
	 * @public
	 */
	SemanticObjectController.prototype.unregisterControl = function(oControl) {
		if (!oControl) {
			return;
		}
		if (!this.isControlRegistered(oControl)) {
			return;
		}
		if (oControl.detachBeforePopoverOpens) {
			oControl.detachBeforePopoverOpens(this._proxyOnBeforePopoverOpens);
		}
		if (oControl.detachNavigationTargetsObtained) {
			oControl.detachNavigationTargetsObtained(this._proxyOnTargetsObtained);
		}

		if (oControl.detachInnerNavigate) {
			oControl.detachInnerNavigate(this._proxyOnNavigate);
		}

		this._aRegisteredControls.splice(this._aRegisteredControls.indexOf(oControl), 1);
	};

	/**
	 * Eventhandler before navigation popover opens
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onBeforePopoverOpens = function(oEvent) {
		var oParameters = oEvent.getParameters();

		if (this.hasListeners("beforePopoverOpens")) {
			this.fireBeforePopoverOpens({
				semanticObject: oParameters.semanticObject,
				semanticAttributes: oParameters.semanticAttributes,
				semanticAttributesOfSemanticObjects: oParameters.semanticAttributesOfSemanticObjects,
				setSemanticAttributes: oParameters.setSemanticAttributes,
				setAppStateKey: oParameters.setAppStateKey,
				originalId: oParameters.originalId,
				open: oParameters.open
			});
		} else {
			oParameters.open();
		}
	};

	/**
	 * Eventhandler after navigation targets have been retrieved.
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onTargetsObtained = function(oEvent) {
		var oParameters = oEvent.getParameters();
		if (!this.hasListeners("navigationTargetsObtained")) {
			oParameters.show();
			return;
		}
		this.fireNavigationTargetsObtained({
			mainNavigation: oParameters.mainNavigation,
			actions: oParameters.actions,
			ownNavigation: oParameters.ownNavigation,
			popoverForms: oParameters.popoverForms,
			semanticObject: oParameters.semanticObject,
			semanticAttributes: oParameters.semanticAttributes,
			originalId: oParameters.originalId,
			show: oParameters.show
		});
	};

	/**
	 * Eventhandler after navigation has been triggered.
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onNavigate = function(oEvent) {
		var oParameters = oEvent.getParameters();
		this.fireNavigate({
			text: oParameters.text,
			href: oParameters.href,
			originalId: oParameters.originalId,
			semanticObject: oParameters.semanticObject,
			semanticAttributes: oParameters.semanticAttributes
		});
	};

	/**
	 * Checks if the given SmartLink has to be enabled or disabled and sets the state.
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink} oSmartLink the SmartLink which should be enabled or disabled.
	 * @public
	 * @deprecated Since 1.42.0. The method <code>setIgnoredState</code> is obsolete as SmartLink is processing the internal state on its own.
	 */
	SemanticObjectController.prototype.setIgnoredState = function(oSmartLink) {
		if (oSmartLink instanceof sap.ui.comp.navpopover.SmartLink) {
			oSmartLink._updateEnabled();
		}
	};

	SemanticObjectController.prototype.setIgnoredFields = function(sIgnoredFields) {
		this.setProperty("ignoredFields", sIgnoredFields);

		this._aRegisteredControls.forEach(function(oRegisteredControl) {
			if (oRegisteredControl._updateEnabled) {
				oRegisteredControl._updateEnabled();
			}
		});
		return this;
	};

	// @deprecated
	SemanticObjectController.prototype.setPrefetchNavigationTargets = function(bPrefetch) {
		this.setProperty("prefetchNavigationTargets", bPrefetch);

		if (bPrefetch !== true) {
			return this;
		}

		jQuery.sap.log.error("sap.ui.comp.navpopover.SemanticObjectController: Please be aware that in case of a large amount of semantic objects the performance may suffer significantly and the received links will be created out of context");

		var that = this;
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
			SemanticObjectController.getNavigationTargetActions(oSemanticObjects).then(function(oNavigationTargetActions) {
				that.firePrefetchDone({
					semanticObjects: oNavigationTargetActions
				});
			});
		});

		return this;
	};

	SemanticObjectController.prototype.getFieldSemanticObjectMap = function() {
		var oMap = this.getProperty("fieldSemanticObjectMap");
		if (oMap) {
			return oMap;
		}

		if (!this.getEntitySet()) {
			jQuery.sap.log.warning("sap.ui.comp.navpopover.SemanticObjectController: FieldSemanticObjectMap is not set on SemanticObjectController, retrieval without EntitySet not possible");
			return null;
		}

		jQuery.sap.require("sap.ui.comp.odata.MetadataAnalyser");
		var oMetadataAnalyzer = new sap.ui.comp.odata.MetadataAnalyser(this.getModel());
		oMap = oMetadataAnalyzer.getFieldSemanticObjectMap(this.getEntitySet());
		if (oMap) {
			this.setProperty("fieldSemanticObjectMap", oMap, true);
		}

		return oMap;
	};

	SemanticObjectController.prototype.getEntitySet = function() {
		var sEntitySet = this.getProperty("entitySet");
		if (sEntitySet) {
			return sEntitySet;
		}

		var oParent = this.getParent();
		while (oParent) {
			if (oParent.getEntitySet) {
				sEntitySet = oParent.getEntitySet();
				if (sEntitySet) {
					this.setProperty("entitySet", sEntitySet, true);
					break;
				}
			}
			oParent = oParent.getParent();
		}

		return sEntitySet;
	};

	/**
	 * Checks if the given semantic object name has a navigation link. <b>Note</b>: this method returns a valid value only after the event
	 * <code>prefetchDone</code> has been raised. The event <code>prefetchDone</code> is raised if the property
	 * <code>prefetchNavigationTargets</code> is set to <code>true</code>.
	 * 
	 * @param {string} sSemanticObject
	 * @returns {boolean} true if the semantic object has any navigation links
	 * @public
	 * @deprecated Since 1.42.0. The method <code>hasSemanticObjectLinks</code> is obsolete because it depends on the property
	 *             <code>prefetchNavigationTargets</code> which has been deprecated.
	 */
	SemanticObjectController.prototype.hasSemanticObjectLinks = function(sSemanticObject) {
		return SemanticObjectController.hasDistinctSemanticObject(sSemanticObject, SemanticObjectController.oSemanticObjects);
	};

	/**
	 * @private
	 */
	SemanticObjectController.prefetchDistinctSemanticObjects = function() {
		SemanticObjectController.getJSONModel();
		if (!SemanticObjectController.bHasPrefetchedDistinctSemanticObjects) {
			SemanticObjectController.getDistinctSemanticObjects();
		}
	};

	/**
	 * Static method which calls asynchronous CrossApplicationNavigation.
	 * 
	 * @returns {Promise} A <code>Promise</code> for asynchronous execution
	 * @private
	 */
	SemanticObjectController.getDistinctSemanticObjects = function() {
		if (SemanticObjectController.bHasPrefetchedDistinctSemanticObjects) {
			return new Promise(function(resolve) {
				return resolve(SemanticObjectController.oSemanticObjects);
			});
		}
		if (!SemanticObjectController.oPromise) {
			SemanticObjectController.oPromise = new Promise(function(resolve) {
				var oCrossAppNav = Factory.getService("CrossApplicationNavigation");
				if (!oCrossAppNav) {
					jQuery.sap.log.error("sap.ui.comp.navpopover.SemanticObjectController: Service 'CrossApplicationNavigation' could not be obtained");
					SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = true;
					return resolve({});
				}
				oCrossAppNav.getDistinctSemanticObjects().then(function(aSemanticObjects) {
					aSemanticObjects.forEach(function(sSemanticObject_) {
						SemanticObjectController.oSemanticObjects[sSemanticObject_] = {};
					});
					var oModel = SemanticObjectController.getJSONModel();
					oModel.setProperty("/distinctSemanticObjects", SemanticObjectController.oSemanticObjects);
					SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = true;
					return resolve(SemanticObjectController.oSemanticObjects);
				}, function(oError) {
					jQuery.sap.log.error("sap.ui.comp.navpopover.SemanticObjectController: getDistinctSemanticObjects() of service 'CrossApplicationNavigation' failed");
					SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = true;
					return resolve({});
				});
			});
		}
		return SemanticObjectController.oPromise;
	};

	/**
	 * Static method which calls asynchronous CrossApplicationNavigation.
	 * 
	 * @returns {Promise} A <code>Promise</code> for asynchronous execution
	 * @private
	 */
	SemanticObjectController.getNavigationTargetActions = function(oSemanticObjects) {
		if (SemanticObjectController.bHasPrefetchedNavigationTargetActions) {
			return new Promise(function(resolve) {
				return resolve(SemanticObjectController.oNavigationTargetActions);
			});
		}
		if (!SemanticObjectController.oPromiseLinks) {
			SemanticObjectController.oPromiseLinks = new Promise(function(resolve) {
				var oCrossAppNav = Factory.getService("CrossApplicationNavigation");
				var oURLParsing = Factory.getService("URLParsing");
				if (!oCrossAppNav || !oURLParsing) {
					jQuery.sap.log.error("sap.ui.comp.navpopover.SemanticObjectController: Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained");
					SemanticObjectController.bHasPrefetchedNavigationTargetActions = true;
					return resolve({});
				}
				var aSemanticObjects = Object.keys(oSemanticObjects);
				var aParams = aSemanticObjects.map(function(sSemanticObject) {
					// we put just one argument into an array (according to FLP API
					return [
						{
							semanticObject: sSemanticObject
						}
					];
				});
				oCrossAppNav.getLinks(aParams).then(function(aLinksOfSemanticObjects) {
					aSemanticObjects.forEach(function(sSemanticObject, iIndex) {
						SemanticObjectController.oNavigationTargetActions[sSemanticObject] = [];
						aLinksOfSemanticObjects[iIndex][0].forEach(function(oLink) {
							var oShellHash = oURLParsing.parseShellHash(oLink.intent);
							if (oShellHash && oShellHash.semanticObject === sSemanticObject) {
								SemanticObjectController.oNavigationTargetActions[sSemanticObject].push(oShellHash.action);
							}
						});
					});
					var oModel = SemanticObjectController.getJSONModel();
					oModel.setProperty("/navigationTargetActions", SemanticObjectController.oNavigationTargetActions);
					SemanticObjectController.bHasPrefetchedNavigationTargetActions = true;
					return resolve(SemanticObjectController.oNavigationTargetActions);
				}, function(oError) {
					jQuery.sap.log.error("sap.ui.comp.navpopover.SemanticObjectController: getLinks() of service 'CrossApplicationNavigation' failed");
					SemanticObjectController.bHasPrefetchedNavigationTargetActions = true;
					return resolve({});
				});
			});
		}
		return SemanticObjectController.oPromiseLinks;
	};

	/**
	 * @private
	 */
	SemanticObjectController.hasDistinctSemanticObject = function(sSemanticObject, oSemanticObjects) {
		return !!oSemanticObjects[sSemanticObject];
	};

	/**
	 * @private
	 */
	SemanticObjectController.getJSONModel = function() {
		var oModel = sap.ui.getCore().getModel("$sapuicompSemanticObjectController_DistinctSemanticObjects");
		if (oModel && !jQuery.isEmptyObject(oModel.getData())) {
			return oModel;
		}
		oModel = new JSONModel({
			distinctSemanticObjects: {}
		});
		oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
		oModel.setSizeLimit(1000);
		sap.ui.getCore().setModel(oModel, "$sapuicompSemanticObjectController_DistinctSemanticObjects");
		return oModel;
	};

	/**
	 * @private
	 */
	SemanticObjectController.destroyDistinctSemanticObjects = function() {
		SemanticObjectController.oSemanticObjects = {};
		SemanticObjectController.oNavigationTargetActions = {};
		SemanticObjectController.oPromise = null;
		SemanticObjectController.oPromiseActions = null;
		SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = false;
		SemanticObjectController.bHasPrefetchedNavigationTargetActions = false;

		// destroy model and its data
		var oModel = sap.ui.getCore().getModel("$sapuicompSemanticObjectController_DistinctSemanticObjects");
		if (oModel) {
			oModel.destroy();
		}
	};

	return SemanticObjectController;

}, /* bExport= */true);