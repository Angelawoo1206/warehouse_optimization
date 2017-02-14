/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

// Provides control sap.ui.vbm.GeoMap.
sap.ui.define([
	'./VBI', './library'
], function(VBI, library) {
	"use strict";

	/**
	 * Constructor for a new GeoMap.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class Map control with the option to position multiple visual objects on top of a map. The GeoMap control shows an image based map loaded from
	 *        one or more configurable external providers. Per default a map from <a href="http://www.mapquest.com">MapQuest</a> is used. Other map
	 *        providers can be configured via property <i>mapConfiguration</i>. Multiple maps can be mashed up into one map layer stack. If multiple
	 *        map layer stacks are provided via configuration it is possible to switch between them during runtime. The control supports the display
	 *        of copyright information for the visible maps.<br>
	 *        On top of the map the GeoMap control provides a navigation control, a scale, and a legend. Each of them can be switched off separately.<br>
	 *        It is possible to set the initial position and zoom for the map display. Further the control allows to restrict the potentially visible
	 *        map area and zoom range.<br>
	 *        Different visual objects can be placed on the map. Visual objects are grouped in VO aggregations and an arbitrary number of VO
	 *        aggregations can be assigned to the <i>vos</i> aggregation.<br>
	 *        The second aggregation <i>featureCollections</i> allows the use of GeoJSON as source for visual objects.
	 * @extends sap.ui.vbm.VBI
	 * @constructor
	 * @public
	 * @alias sap.ui.vbm.GeoMap
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GeoMap = VBI.extend("sap.ui.vbm.GeoMap", /** @lends sap.ui.vbm.GeoMap.prototype */
	{
		metadata: {

			library: "sap.ui.vbm",
			properties: {

				/**
				 * This is the map configuration for the geo map. The map configuration defines the used maps, the layering of the maps and the
				 * servers that can be used to request the map tiles.
				 */
				mapConfiguration: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Toggles the visibility of the legend
				 */
				legendVisible: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				},

				/**
				 * Defines the visibility of the scale. Only supported on initialization!
				 */
				scaleVisible: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				},

				/**
				 * Defines the visibility of the navigation control. Only supported on initialization!
				 */
				navcontrolVisible: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				},

				/**
				 * Initial position of the Map. Set is only supported on initialization! Format is "&lt;longitude&gt;;&lt;latitude&gt;;0".
				 */
				initialPosition: {
					type: "string",
					group: "Behavior",
					defaultValue: "0;0;0"
				},

				/**
				 * Initial zoom. Value needs to be positive whole number. Set is only supported on initialization!
				 */
				initialZoom: {
					type: "string",
					group: "Behavior",
					defaultValue: "2"
				},

				/**
				 * Center position of the Map. Format is "&lt;longitude&gt;;&lt;latitude&gt;".
				 */
				centerPosition: {
					type: "string",
					group: "Behavior",
					defaultValue: "0;0"
				},

				/**
				 * Zoomlevel for the Map. Value needs to be positive whole number.
				 */
				zoomlevel: {
					type: "int",
					group: "Behavior",
					defaultValue: 2
				},

				/**
				 * Name of the map layer stack (provided in mapConfiguration) which is used for map rendering. If not set the layer stack with the
				 * name 'Default' is chosen. Property can be changed at runtime to switch between map layer stack.
				 */
				refMapLayerStack: {
					type: "string",
					group: "Appearance",
					defaultValue: "Default"
				},

				/**
				 * Visual Frame object. Defining a frame {minX, maxX, minY, maxY, maxLOD, minLOD} to which the scene display is restricted.
				 */
				visualFrame: {
					type: "object",
					group: "Behavior",
					defaultValue: null
				},

				/**
				 * @deprecated This property should not longer be used. Its functionality has been replaced by the <code>clusters</code>
				 *             aggregation.
				 */
				clustering: {
					type: "object",
					group: "Behavior",
					defaultValue: null
				},

				/**
				 * Disable Map Zooming. This setting works only upon initialization and cannot be changed later on.
				 */
				disableZoom: {
					type: "boolean",
					group: "Behavior",
					defaultValue: false
				},

				/**
				 * Disable Map Paning. This setting works only upon initialization and cannot be changed later on.
				 */
				disablePan: {
					type: "boolean",
					group: "Behavior",
					defaultValue: false
				},

				/**
				 * Enable Animation of Map Zoom. Works in combination of setZoomlevel.
				 */
				enableAnimation: {
					type: "boolean",
					group: "Behavior",
					defaultValue: false
				}

			},
			defaultAggregation: "vos",
			aggregations: {
				/**
				 * Aggregation of visual object types. A VO aggregation can be considered to be a table of VOs of a common type.
				 */
				vos: {
					type: "sap.ui.vbm.VoAbstract",
					multiple: true,
					singularName: "vo"
				},

				/**
				 * Aggregation of GeoJSON layers. Object from a GeoJSON layer will be behind all other Visual Objects from the <code>vos</code>
				 * aggregation. In case of multiple GeoJSON layers the objects are orderer with the layers they belong to.
				 */
				geoJsonLayers: {
					type: "sap.ui.vbm.GeoJsonLayer",
					multiple: true,
					singularName: "geoJsonLayer"
				},

				/**
				 * @deprecated This aggregation should not longer be used. Its functionality has been replaced by the more generic<code>geoJsonLayers</code>
				 *             aggregation.
				 */
				featureCollections: {
					type: "sap.ui.vbm.FeatureCollection",
					multiple: true,
					singularName: "featureCollection"
				},

				/**
				 * Aggregation of resources. The images for e.g. Spots have to be provided as resources.
				 */
				resources: {
					type: "sap.ui.vbm.Resource",
					multiple: true,
					singularName: "resource"
				},

				/**
				 * Legend for the Map
				 */
				legend: {
					type: "sap.ui.vbm.Legend",
					multiple: false
				},

				/**
				 * Aggregation of clusters.
				 */
				clusters: {
					type: "sap.ui.vbm.ClusterBase",
					multiple: true,
					singularName: "cluster"
				}
			},
			events: {

				/**
				 * Raised when the map is clicked.
				 */
				click: {
					parameters: {

						/**
						 * Geo coordinates in format "&lt;longitude&gt;;&lt;latitude&gt;;0"
						 */
						pos: {
							type: "string"
						}
					}
				},

				/**
				 * Raised when the map is right clicked/longPressed(tap and hold).
				 */
				contextMenu: {
					parameters: {

						/**
						 * Client coordinate X
						 */
						clientX: {
							type: "int"
						},

						/**
						 * Client coordinate Y
						 */
						clientY: {
							type: "int"
						},

						/**
						 * Geo coordinates in format "&lt;longitude&gt;;&lt;latitude&gt;;0"
						 */
						pos: {
							type: "string"
						}
					}
				},

				/**
				 * Raised when something is dropped on the map.
				 */
				drop: {
					parameters: {

						/**
						 * Geo coordinates in format "&lt;longitude&gt;;&lt;latitude&gt;;0"
						 */
						pos: {
							type: "string"
						}
					}
				},

				/**
				 * This event is raised when a multi selection of visual objects has occurred
				 */
				select: {},

				/**
				 * this event is raised on zoom in or zoom out.
				 */
				zoomChanged: {
					parameters: {

						/**
						 * Center point of the map. Format : Lon;Lat;0.0.
						 */
						centerPoint: {
							type: "string"
						},

						/**
						 * Viewport bounding box's upperLeft and lowerRight coordinates. Format : Lon;Lat;0.0.
						 */
						viewportBB: {
							type: "object"
						},

						/**
						 * Level of detail.
						 */
						zoomLevel: {
							type: "int"
						}
					}
				},

				/**
				 * this event is raised on map move.
				 */
				centerChanged: {
					parameters: {

						/**
						 * Center point of the map. Format : Lon;Lat;0.0.
						 */
						centerPoint: {
							type: "string"
						},

						/**
						 * Viewport bounding box's upperLeft and lowerRight coordinates. Format : Lon;Lat;0.0.
						 */
						viewportBB: {
							type: "object"
						},

						/**
						 * Level of detail.
						 */
						zoomLevel: {
							type: "int"
						}
					}
				}
			}
		}
	});

	// /**
	// * This file defines behavior for the control,
	// */

	// Author: Ulrich Roegelein

	// ...........................................................................//
	// Define static class members................................................//
	// ...........................................................................//

	GeoMap.bEncodedSpotImagesAvailable = false;
	GeoMap.bEncodeSpotImageData = null;

	GeoMap.oBaseApp = {
		SAPVB: {
			version: "2.0",
			MapProviders: {
				Set: {
					MapProvider: {
						name: "404",
						type: "",
						description: "",
						tileX: "256",
						tileY: "256",
						maxLOD: "19",
						copyright: "Map Provider is not configured, please read this {LINK|SCN Article} to configure your own Map Provider.",
						copyrightLink: "//scn.sap.com/docs/DOC-74221",
						copyrightImage: "",
						Source: [
							{
								id: "s1",
								url: "data:image/jpeg;base64,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"
							}
						]
					}
				}
			},
			MapLayerStacks: {
				Set: {
					MapLayerStack: {
						name: "Default",
						MapLayer: {
							name: "layer1",
							refMapProvider: "404",
							opacity: "1.0",
							colBkgnd: "rgb(255,255,255)"
						}
					}
				}
			}
		}
	};

	// sap.ui.vbm.GeoMap.prototype.init = function(){
	// // do something for initialization...
	// };

	// ...........................................................................//
	// This section defines behavior for the control,............................//
	// ...........................................................................//

	GeoMap.prototype.exit = function() {
		VBI.prototype.exit.apply(this, arguments);

		// detach the event.......................................................//
		this.detachSubmit(this.onGeoMapSubmit, this);
		this.detachContainerCreated(this.onGeoMapContainerCreated, this);
		this.detachContainerDestroyed(this.onGeoMapContainerDestroyed, this);


	};

	// ...........................................................................//
	// track modifications on resources..........................................//

	GeoMap.prototype.destroyResources = function() {
		this.m_bResourcesDirty = true;
		return this.destroyAggregation("resources");
	};

	GeoMap.prototype.addResource = function(o) {
		this.m_bResourcesDirty = true;
		return this.addAggregation("resources", o);
	};

	GeoMap.prototype.insertResource = function(o, index) {
		this.m_bResourcesDirty = true;
		return this.insertAggregation("resources", o, index);
	};

	GeoMap.prototype.removeResource = function(o) {
		this.m_bResourcesDirty = true;
		return this.removeAggregation("resources", o);
	};

	GeoMap.prototype.removeAllResources = function(o) {
		this.m_bResourcesDirty = true;
		return this.removeAllAggregation("resources");
	};

	// ...........................................................................//
	// track modifications on vos................................................//

	GeoMap.prototype.destroyVos = function() {
		this.m_bVosDirty = true;
		return this.destroyAggregation("vos");
	};

	GeoMap.prototype.addVo = function(o) {
		this.m_bVosDirty = true;
		this.addAggregation("vos", o);
		o.m_bAggRenew = true;
		return this;
	};

	GeoMap.prototype.insertVo = function(o, index) {
		this.m_bVosDirty = true;
		this.insertAggregation("vos", o, index);
		o.m_bAggRenew = true;
		return this;
	};

	GeoMap.prototype.removeVo = function(o) {
		this.m_bVosDirty = true;
		return this.removeAggregation("vos", o);
	};

	GeoMap.prototype.removeAllVos = function(o) {
		this.m_bVosDirty = true;
		return this.removeAllAggregation("vos");
	};

	// ...........................................................................//
	// track modifications on geoJsonLayers.................................//

	GeoMap.prototype.destroyGeoJsonLayers = function() {
		this.m_bGJLsDirty = true;
		return this.destroyAggregation("geoJsonLayers");
	};

	GeoMap.prototype.addGeoJsonLayer = function(o) {
		this.m_bGJLsDirty = true;
		return this.addAggregation("geoJsonLayers", o);
	};

	GeoMap.prototype.insertGeoJsonLayer = function(o, index) {
		this.m_bGJLsDirty = true;
		return this.insertAggregation("geoJsonLayers", o, index);
	};

	GeoMap.prototype.removeGeoJsonLayer = function(o) {
		this.m_bGJLsDirty = true;
		return this.removeAggregation("geoJsonLayers", o);
	};

	GeoMap.prototype.removeAllGeoJsonLayers = function(o) {
		this.m_bGJLsDirty = true;
		return this.removeAllAggregation("geoJsonLayers");
	};

	// ...........................................................................//
	// track modifications on featureCollections.................................//

	GeoMap.prototype.destroyFeatureCollections = function() {
		this.m_bFCsDirty = true;
		return this.destroyAggregation("featureCollections");
	};

	GeoMap.prototype.addFeatureCollection = function(o) {
		this.m_bFCsDirty = true;
		return this.addAggregation("featureCollections", o);
	};

	GeoMap.prototype.insertFeatureCollection = function(o, index) {
		this.m_bFCsDirty = true;
		return this.insertAggregation("featureCollections", o, index);
	};

	GeoMap.prototype.removeFeatureCollection = function(o) {
		this.m_bFCsDirty = true;
		return this.removeAggregation("featureCollections", o);
	};

	GeoMap.prototype.removeAllFeatureCollections = function(o) {
		this.m_bFCsDirty = true;
		return this.removeAllAggregation("featureCollections");
	};

	// ...........................................................................//
	// track modifications on clusters............................................//

	GeoMap.prototype.destroyClusters = function() {
		this.m_bClustersDirty = true;
		return this.destroyAggregation("clusters");
	};

	GeoMap.prototype.addCluster = function(o) {
		this.m_bClustersDirty = true;
		return this.addAggregation("clusters", o);
	};

	GeoMap.prototype.insertCluster = function(o, index) {
		this.m_bClustersDirty = true;
		return this.insertAggregation("clusters", o, index);
	};

	GeoMap.prototype.removeCluster = function(o) {
		this.m_bClustersDirty = true;
		return this.removeAggregation("clusters", o);
	};

	GeoMap.prototype.removeAllClusters = function(o) {
		this.m_bClustersDirty = true;
		return this.removeAllAggregation("clusters");
	};

	// ...........................................................................//
	// track modifications on mapConfiguration...................................//

	/**
	 * Set Map configuration data. Map Configurations contain a set of Map Providers and Map Layer Stacks refering to those providers. The GeoMap
	 * property refMapLayerStack defines, which Map Layer Stack becomes visible.
	 * 
	 * @param {object} oMapConfiguration Map Configuration object
	 * @param {array} oMapConfiguration.MapProvider Array of Map Provider definitions.
	 * @param {string} oMapConfiguration.MapProvider.name Name for the provider. Needed in Map Layer Stack as reference.
	 * @param {string} oMapConfiguration.MapProvider.tileX X-pixel dimension of map tile. Typical 256.
	 * @param {string} oMapConfiguration.MapProvider.tileY Y-pixel dimension of map tile. Typical 256.
	 * @param {string} oMapConfiguration.MapProvider.minLOD Minimal supported Level Of Detail.
	 * @param {string} oMapConfiguration.MapProvider.maxLOD Maximal supported Level Of Detail.
	 * @param {string} oMapConfiguration.MapProvider.copyright Copyright Information to be shown with the map.
	 * @param {array} oMapConfiguration.MapProvider.Source Array of source definitions. At least on Source has to be given. Multiple sources can be
	 *        used for load distribution.
	 * @param {string} oMapConfiguration.MapProvider.Source.id Source id.
	 * @param {string} oMapConfiguration.MapProvider.Source.url Source URL for map tile service. URL includes place holders for variable informations
	 *        set at runtime, e.g. {LOD}.
	 * @param {array} oMapConfiguration.MapLayerStacks Array of Map Layer Stacks
	 * @param {string} oMapConfiguration.MapLayerStacks.name Name of Map Layer Stack. Use with the GeoMap refMapLayerStack property.
	 * @param {array} oMapConfiguration.MapLayerStacks.MapLayer Array of Map Layers. Each Layer refers to a Map Proveride. Map Layers get overlayed in
	 *        the given sequence.
	 * @param {string} oMapConfiguration.MapLayerStacks.MapLayer.name Name of Map Layer.
	 * @param {string} oMapConfiguration.MapLayerStacks.MapLayer.refMapProvider Name of referenced Map Provider.
	 * @param {string} oMapConfiguration.MapLayerStacks.MapLayer.opacity Opacity of Map Layer. Value range 0 to 1.
	 * @param {sap.ui.core.CSSColor} oMapConfiguration.MapLayerStacks.MapLayer.colBkgnd Background color for Map Layer. Only meaningful if opacity is
	 *        below 1.
	 * @returns {sap.ui.vbm.GeoMap} This allows method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */

	GeoMap.prototype.setMapConfiguration = function(o) {
		this.m_bMapConfigurationDirty = true;
		this.setProperty("mapConfiguration", o);
		return this;
	};

	/**
	 * Set clustering definitions.
	 * 
	 * @param {object} oClustering Cluster Definition object
	 * @returns {sap.ui.vbm.GeoMap} This allows method chaining
	 * @public
	 * @deprecated This property should not longer be used. Its functionality has been replaced by the <code>clusters</code> aggregation.
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.setClustering = function(oClustering) {
		this.m_bClusteringDirty = true;
		this.setProperty("clustering", oClustering);
		return this;
	};

	GeoMap.prototype.setRefMapLayerStack = function(o) {
		if (o === this.getRefMapLayerStack()) {
			return this;
		}
		this.m_bRefMapLayerStackDirty = this.m_bSceneDirty = true;
		this.setProperty("refMapLayerStack", o);
		return this;
	};

	/**
	 * Set Visual Frame definition.
	 * 
	 * @param {object} oVisFrame Visual Frame definition object
	 * @param {float} oVisFrame.minLon Minimal longitude of visual frame
	 * @param {float} oVisFrame.maxLon Maximal longitude of visual frame
	 * @param {float} oVisFrame.minLat Minimal latitude of visual frame
	 * @param {float} oVisFrame.maxLat Maximal latitude of visual frame
	 * @param {float} oVisFrame.minLOD Minimal Level of Detail for visual frame
	 * @param {float} oVisFrame.maxLOD Maximal Level of Detail for visual frame
	 * @param {float} oVisFrame.maxFraction Maximal fraction [0..1] of minLOD which is acceptable, otherwise minLOD is rounded upwards
	 * @returns {sap.ui.vbm.GeoMap} This allows method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.setVisualFrame = function(oVisFrame) {
		this.m_bVisualFrameDirty = true;
		this.setProperty("visualFrame", oVisFrame);
		return this;
	};

	/**
	 * Set Tracking Mode for Rectangular Selection on/off.
	 * 
	 * @param {boolean} bSet to start or stop tracking mode
	 * @returns {sap.ui.vbm.GeoMap} This allows method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.setRectangularSelection = function(bSet) {
		VBI.prototype.setRectangularSelection.apply(this, arguments);
		return this;
	};

	/**
	 * Set Tracking Mode for Lasso Selection on/off.
	 * 
	 * @param {boolean} bSet to start or stop tracking mode
	 * @returns {sap.ui.vbm.GeoMap} This allows method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.setLassoSelection = function(bSet) {
		VBI.prototype.setLassoSelection.apply(this, arguments);
		return this;
	};

	/**
	 * Set Tracking Mode for Rectangular Zoom on/off.
	 * 
	 * @param {boolean} bSet to start or stop tracking mode
	 * @returns {sap.ui.vbm.GeoMap} This allows method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.setRectZoom = function(bSet) {
		VBI.prototype.setRectZoom.apply(this, arguments);
		return this;
	};

	/**
	 * Trigger the interactive creation mode to get a position or position array.
	 * 
	 * @param {boolean} bPosArray Indicator if a single position or an array is requested
	 * @param {function} callback Callback function func( sPosArray ) to be called when done. Position(array) sPosArray is provided in format
	 *        "lon;lat;0;..."
	 * @returns {boolean} Indicator whether the creation mode could be triggered successfully or not.
	 * @public
	 * @experimental Since 1.30.0 This method is experimental and might be modified or removerd in future versions.
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.getPositionInteractive = function(bPosArray, callback) {
		var isCreationModeTriggered;
		if (!this.mIACreateCB && callback && typeof callback === "function") {
			this.mIACreateCB = callback;

			var sType = bPosArray ? "POSARRAY" : "POS";

			// trigger interactive creation mode by defining an automation call
			var oLoad = {
				"SAPVB": {
					"Automation": {
						"Call": {
							"handler": "OBJECTCREATIONHANDLER",
							"name": "CreateObject",
							"object": "MainScene",
							"scene": "MainScene",
							"instance": "",
							"Param": {
								"name": "data",
								"#": "{" + sType + "}"
							}
						}
					}
				}
			};
			this.load(oLoad);
			isCreationModeTriggered = true;
		} else {
			// callback function registered -> other create still pending!
			isCreationModeTriggered = false;
		}
		return isCreationModeTriggered;
	};

	/**
	 * Retrieves the center position of the current map.
	 * @returns {string} centerPosition A string representing the center position; it is retrieved in the form of "x;y".
	 * @public
	 */
	GeoMap.prototype.getCenterPosition = function() {
		var oScene = this.mVBIContext.GetMainScene(),
			centerPosition;
		//If the main scene exists, we calculate the center position of the scene.
		if (oScene) {
			//converting radians to degrees
			var aCoords = window.VBI.MathLib.RadToDeg(oScene.GetCenterPos());
			centerPosition = aCoords[0] + ";" + aCoords[1];
		} else {
			//If there is no main scene, we return the value of the centerPosition public property.
			centerPosition = this.getProperty("centerPosition");
		}
		return centerPosition;
	};

	GeoMap.prototype.isNumeric = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	GeoMap.prototype.setCenterPosition = function(sPosition) {
		var aCoords = sPosition ? sPosition.split(";") : undefined;
		if (!aCoords || aCoords.length <= 1 || !this.isNumeric(aCoords[0]) || !this.isNumeric(aCoords[1])) {
			jQuery.sap.log.error(sap.ui.vbm.getResourceBundle().getText("GEOMAP_INVALID_CENTER_POSITION") + ":'" + sPosition + "'", "setCenterPosition", "sap.ui.vbm.GeoMap");
		} else {
			var sPositionInternal = aCoords[0] + ";" + aCoords[1] + ";0";
			this.setProperty("centerPosition", sPositionInternal);
			if (this.isRendered()) {
				// Control already rendered -> need to call function zoom to geopos
				aCoords = sPositionInternal.split(";");
				this.zoomToGeoPosition(aCoords[0], aCoords[1], this.getZoomlevel());
			}
			// else: Control not yet rendered -> position will be taken for initial rendering
		}
		return this;
	};

	// this setter is required for legacy support!
	GeoMap.prototype.setInitialPosition = function(sPosition) {
		this.setCenterPosition(sPosition);
	};

	GeoMap.prototype.getZoomlevel = function() {
		var oScene = this.mVBIContext.GetMainScene();
		if (oScene) {
			return parseInt(oScene.GetCurrentZoomlevel(), 10);
		}
		return this.getProperty("zoomlevel");
	};

	GeoMap.prototype.setZoomlevel = function(iZoom) {
		if (!this.getDisableZoom()) {
			if (iZoom >= 0) {
				if (this.isRendered()) {
					var aCoords = this.getCenterPosition().split(";");
					if (this.getEnableAnimation()) {
						var oScene = this.mVBIContext.GetMainScene();
						oScene.AnimateZoomToGeo(oScene.GetCenterPos(), iZoom, 5);
					} else {
						this.zoomToGeoPosition(aCoords[0], aCoords[1], iZoom);
					}
				}
				this.setProperty("zoomlevel", iZoom);
			} else {
				jQuery.sap.log.error(sap.ui.vbm.getResourceBundle().getText("GEOMAP_INVALID_ZOOM_LEVEL") + ": " + iZoom.toString(), "setZoomlevel", "sap.ui.vbm.GeoMap");
			}
		}
	};

	// this setter is required for legacy support!
	GeoMap.prototype.setInitialZoom = function(sZoom) {
		this.setZoomlevel(parseInt(sZoom, 10));
	};

	/**
	 * Open Detail window
	 * 
	 * @param {string} sPosition Postion for the Detail Window in format "lon;lat;0"
	 * @param {object} [oParams] Parameter Objects
	 * @param {string} [oParams.caption] Caption of the Detail Window
	 * @returns {void}
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.openDetailWindow = function(sPosition, oParams) {
		// set detail window context. The actual opening happens in getWindowsObject()

		this.mDTWindowCxt.key = "";
		this.mDTWindowCxt.open = true;
		this.mDTWindowCxt.bUseClickPos = true;
		this.mDTWindowCxt.params = oParams ? oParams : null;
		this.mDTWindowCxt.src = {
			mClickGeoPos: sPosition
		};
		this.invalidate(this);
		this.m_bWindowsDirty = true;
	};

	/**
	 * Go to Initial Start Position with Initial Zoom Level
	 * 
	 * @returns {void}
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.goToStartPosition = function() {
		if (this.isRendered()) {
			this.mVBIContext.GetMainScene().GoToInitialStart();
		}
	};

	/**
	 * Close any open Detail window
	 * 
	 * @returns {void}
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.closeAnyDetailWindow = function() {
		// set detail window open to false and invalide control -> actual closing is triggered in getWindowsObject()
		this.mDTWindowCxt.open = false;
		this.invalidate(this);
		this.m_bWindowsDirty = true;
	};

	/**
	 * Get an aggregated VO instance by its internal ID returned by e.g. function <code>getInfoForCluster</code>.
	 *
	 * @param {string} [voIdentifier] Internal VO Identifier
	 * @returns {sap.ui.vbm.VoBase} VO instance element or null if nothing found
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	GeoMap.prototype.getVoByInternalId = function(voIdentifier) {
		var voElement = null;
		var aSplitID = voIdentifier.split(/\./);
		var oAggregation = this.getAggregatorContainer(aSplitID[0]);
		if (oAggregation && oAggregation.findInstance) {
			voElement = oAggregation.findInstance(aSplitID[1]);
		}
		return voElement;
	};

	/**
	 * Retrieves all spot instances of a {sap.ui.vbm.ClusterContainer}
	 * @param {sap.ui.vbm.ClusterContainer} clusterContainer The cluster container whose spots we want to retrieve.
	 * @returns {sap.ui.vbm.Spot[]} spots An array of sap.ui.vbm.Spot instances.
	 * @public
	 */
	GeoMap.prototype.getClusteredSpots = function(clusterContainer) {
		//get the list of all internat spot ids belonging to the cluster container passed as argument
		var spotIds = this.getInfoForCluster(clusterContainer.getKey(), sap.ui.vbm.ClusterInfoType.ContainedVOs),
		//find and retrieved all spot instances based on their internat spot id
		spots = spotIds.map(function (spotId) {
			return this.getVoByInternalId(spotId);
		}.bind(this));
		return spots;
	};

	// ..............................................................................................//
	// write selection property back to model and fire select event on aggregation ..................//
	GeoMap.prototype.setSelectionPropFireSelect = function(dat) {
		var aN = dat.N;
		for (var nJ = 0; nJ < aN.length; ++nJ) {
			var oAgg = aN[nJ];
			var aEl = oAgg.E;
			var cont;
			if ((cont = this.getAggregatorContainer(oAgg.name)) && cont.handleSelectEvent) {
				cont.handleSelectEvent(aEl);
			}
		}
	};

	// ...........................................................................//
	// central event handler.....................................................//

	GeoMap.prototype.onGeoMapSubmit = function(e) {
		// analyze the event......................................................//
		var datEvent = JSON.parse(e.mParameters.data);

		// write changed data back to aggregated elements
		if (datEvent.Data && datEvent.Data.Merge) {
			this.handleChangedData(datEvent.Data.Merge.N);
		}

		// get the container......................................................//
		// and delegate the event to the container first..........................//
		var cont;
		if ((cont = this.getAggregatorContainer(datEvent.Action.object))) {
			cont.handleEvent(datEvent);
			if (datEvent.Action.name == "click" && datEvent.Data && datEvent.Data.Merge) {
				this.setSelectionPropFireSelect(datEvent.Data.Merge); // set selection property on model and call select and deselect on Aggregation
			}
		} else {
			/*
			 * TO DO:
			 * other events might be important later
			 */
			switch (datEvent.Action.name) {
				case "click":
					// fire the click..................................................//
					this.fireClick({
						pos: datEvent.Action.AddActionProperties.AddActionProperty[0]['#']
					});
					break;
				case "contextMenu":
					// fire the contextMenu..................................................//
					this.fireContextMenu({
						clientX: datEvent.Action.Params.Param[0]['#'],
						clientY: datEvent.Action.Params.Param[1]['#'],
						pos: datEvent.Action.AddActionProperties.AddActionProperty[0]['#']
					});
					break;
				case "drop":
					// fire the drop..................................................//
					this.fireDrop({
						pos: datEvent.Action.AddActionProperties.AddActionProperty[0]['#']
					});
					break;
				case "zoomChanged":
					// fire the zoomChanged..................................................//
					this.fireZoomChanged({
						zoomLevel: datEvent.Action.AddActionProperties.AddActionProperty[0]['#'],
						centerPoint: datEvent.Action.AddActionProperties.AddActionProperty[1]['#'],
						viewportBB: {
							upperLeft: datEvent.Action.Params.Param[3]['#'],
							lowerRight: datEvent.Action.Params.Param[4]['#']
						}
					});
					break;
				case "centerChanged":
					// fire the centerChanged..................................................//
					this.fireCenterChanged({
						zoomLevel: datEvent.Action.AddActionProperties.AddActionProperty[0]['#'],
						centerPoint: datEvent.Action.AddActionProperties.AddActionProperty[1]['#'],
						viewportBB: {
							upperLeft: datEvent.Action.Params.Param[3]['#'],
							lowerRight: datEvent.Action.Params.Param[4]['#']
						}
					});
					break;
				case "select":
					if (datEvent.Data && datEvent.Data.Merge.N) {
						var aSelected = this.getSelectedItems(datEvent.Data.Merge.N);
						// fire the select ...............................................//
						this.fireSelect({
							selected: aSelected
						});
						this.setSelectionPropFireSelect(datEvent.Data.Merge); // set selection property on model and call select and deselect on
						// Aggregation
					}
					break;
				case "GetPosComplete":
					// Interactive Position gathering finished
					if (this.mIACreateCB) {
						try {
							this.mIACreateCB(datEvent.Action.Params.Param[0]['#']);
							this.mIACreateCB = null;
						} catch (exc) {
							// clear callback function in any case
							this.mIACreateCB = null;
							throw exc;
						}
					}
					break;
				default:
					break;
			}
		}
	};

	GeoMap.prototype.onGeoMapContainerCreated = function(e) {
		// get the id of the div area where to place the control..................//
		var div = e.getParameter("contentarea");
		if (div.m_ID) {
			// get the container...................................................//
			// and delegate the event to the container first.......................//
			var cont;
			if ((cont = this.getAggregatorContainer(div.m_ID)) && cont.handleContainerCreated) {
				cont.handleContainerCreated(e);
			}
		}
	};



	GeoMap.prototype.onGeoMapContainerDestroyed = function(e) {
		// get the id of the div area where to place the control..................//
		var div = e.getParameter("contentarea");
		if (div.m_ID) {
			// get the container..................................................//
			// and delegate the event to the container first......................//
			var cont;
			if ((cont = this.getAggregatorContainer(div.m_ID)) && cont.handleContainerDestroyed) {
				cont.handleContainerDestroyed(e);
			}
		}
		if (this.mDTWindowCxt.open && e.getParameter("id") === "Detail") {
			// detail window gets closed
			this.mDTWindowCxt.open = false;
			this.mDTWindowCxt.src = null; // release VO
			this.m_bWindowsDirty = true;
		}
	};

	GeoMap.prototype.init = function() {
		// attach the event
		this.attachSubmit(this.onGeoMapSubmit, this);
		this.attachContainerCreated(this.onGeoMapContainerCreated, this);
		this.attachContainerDestroyed(this.onGeoMapContainerDestroyed, this);


		// initially set dirty state for all elements............................//
		this.m_bVosDirty = true;
		this.m_bFCsDirty = true;
		this.m_bGJLsDirty = true;
		this.m_bClustersDirty = true;
		this.m_bMapConfigurationDirty = true;
		this.m_bClusteringDirty = true;
		this.m_bVisualFrameDirty = true;
		this.m_bRefMapLayerStackDirty = true;
		this.m_bResourcesDirty = true;
		this.m_bMapProvidersDirty = true;
		this.m_bMapLayerStacksDirty = true;
		this.m_bWindowsDirty = true;
		this.m_bMapconfigDirty = true;
		this.m_bLegendDirty = true;
		this.m_bSceneDirty = true;

		this.mbForceDataUpdate = false;
		this.bDataDeltaUpdate = false;
		this.bHandleChangedDataActive = false;

		// Initialize Detail Window Context object
		this.mDTWindowCxt = {
			open: false,
			src: null,
			key: "",
			params: null
		};

		// call base class first
		VBI.prototype.init.apply(this, arguments);
	};

	// ...........................................................................//
	// common helper functions...................................................//

	GeoMap.prototype.getSelectedItems = function(data) {
		var cont, aContSel, aSel = [];
		if (!data) {
			return null;
		}
		if (jQuery.type(data) === "object") {
			cont = this.getAggregatorContainer(data.name);
			aContSel = cont.findSelected(true, data.E);
			aSel = aSel.concat(aContSel);
		} else if (jQuery.type(data) === "array") {
			for (var nJ = 0; nJ < data.length; ++nJ) {
				cont = this.getAggregatorContainer(data[nJ].name);
				aContSel = cont.findSelected(true, data[nJ].E);
				if (aContSel && aContSel.length) {
					aSel = aSel.concat(aContSel);
				}
			}
		}

		return aSel;

	};

	GeoMap.prototype.getWindowsObject = function() {
		// determine the windows object..........................................//
		// Main window -> needs always to be defined
		var oWindows = {
			"Set": [
				{
					"name": "Main",
					"Window": {
						"id": "Main",
						"caption": "MainWindow",
						"type": "geo",
						"refParent": "",
						"refScene": "MainScene",
						"modal": "true"
					}
				}
			],
			"Remove": []
		};

		// Legend window ........................................................//
		var oLegend = this.getLegend();
		if (oLegend) {
			var legendDiv;
			if ((legendDiv = this.getDomRef(oLegend.getId()))) {
				this.m_curLegendPos = {
					right: parseInt(legendDiv.style.right, 10),
					top: parseInt(legendDiv.style.top, 10)
				};
			}

			var oLegendWindows = oLegend.getTemplateObject();

			// concat the sets
			if (oLegendWindows.Set) {
				oWindows.Set = oWindows.Set.concat(oLegendWindows.Set);
			}
			// concat the removes
			if (oLegendWindows.Remove) {

				oWindows.Remove = oWindows.Remove.concat(oLegendWindows.Remove);

			}
		}

		// Detail window..........................................................//
		if (this.mDTWindowCxt.src) {
			// Make sure any detail window opened before is closed
			var oRemove, oDTWindows;

			oRemove = [
				{
					"name": "Detail"
				}
			];

			// Check if given source element is still valid
			if (this.mDTWindowCxt.key) {
				var oCurrentSourceInst = this.getChildByKey(this.mDTWindowCxt.src, this.mDTWindowCxt.key);
				if (!oCurrentSourceInst) {
					// related source object does not longer exist -> reset context
					this.mDTWindowCxt.open = false;
					this.mDTWindowCxt.src = null;
					this.mDTWindowCxt.key = "";
					this.mDTWindowCxt.params = null;
				} else {
					// Note: Instances are not stable related to keys -> update source instance to match instance for given key
					this.mDTWindowCxt.src = oCurrentSourceInst;
				}
			}
			if (this.mDTWindowCxt.open) {
				oDTWindows = {
					"Set": [
						{
							"name": "Detail",
							"Window": {
								"id": "Detail",
								"type": "callout",
								"refParent": "Main",
								"refScene": "",
								"modal": "true",
								"caption": this.mDTWindowCxt.params.caption ? this.mDTWindowCxt.params.caption : "",
								"offsetX": this.mDTWindowCxt.params.offsetX ? this.mDTWindowCxt.params.offsetX : "0",
								"offsetY": this.mDTWindowCxt.params.offsetY ? this.mDTWindowCxt.params.offsetY : "0"
							}
						}
					]
				};
				// set window position
				if (this.mDTWindowCxt.bUseClickPos == true && this.mDTWindowCxt.src.mClickGeoPos) {
					oDTWindows.Set[0].Window.pos = this.mDTWindowCxt.src.mClickGeoPos;
				} else {
					oDTWindows.Set[0].Window['pos.bind'] = this.mDTWindowCxt.src.getParent().sId + "." + this.mDTWindowCxt.src.UniqueId + ".P";
				}

				// Add detail window to the list of windows
				oWindows.Set = oWindows.Set.concat(oDTWindows.Set);
			}

			oWindows.Remove = oWindows.Remove.concat(oRemove);
		}

		return oWindows;
	};

	GeoMap.prototype.getActionArray = function() {
		var aActions = [];
		// subscribe for map event
		// Note: We register Action only if event are subscribed..............................//
		if (this.mEventRegistry["click"]) {
			aActions.push({
				"id": "GMap1",
				"name": "click",
				"refScene": "MainScene",
				"refVO": "Map",
				"refEvent": "Click",
				"AddActionProperty": [
					{
						"name": "pos"
					}
				]
			});
		}
		if (this.mEventRegistry["contextMenu"]) {
			aActions.push({
				"id": "GMap2",
				"name": "contextMenu",
				"refScene": "MainScene",
				"refVO": "Map",
				"refEvent": "ContextMenu",
				"AddActionProperty": [
					{
						"name": "pos"
					}
				]
			});
		}
		if (this.mEventRegistry["drop"]) {
			aActions.push({
				"id": "GMap3",
				"name": "drop",
				"refScene": "MainScene",
				"refVO": "Map",
				"refEvent": "Drop",
				"AddActionProperty": [
					{
						"name": "pos"
					}
				]
			});
		}
		if (this.mEventRegistry["submit"]) {
			aActions.push({
				"id": "GMap4",
				"name": "zoomChanged",
				"refScene": "MainScene",
				"refVO": "Map",
				"refEvent": "ZoomChanged",
				"AddActionProperty": [
					{
						"name": "zoom"
					}, {
						"name": "centerpoint"
					}, {
						"name": "pos"
					}
				]
			});
		}
		if (this.mEventRegistry["submit"]) {
			aActions.push({
				"id": "GMap5",
				"name": "centerChanged",
				"refScene": "MainScene",
				"refVO": "Map",
				"refEvent": "CenterChanged",
				"AddActionProperty": [
					{
						"name": "zoom"
					}, {
						"name": "centerpoint"
					}, {
						"name": "pos"
					}
				]
			});
		}
		if (this.mEventRegistry["submit"]) {
			aActions.push({
				"id": "GMap6",
				"name": "select",
				"refScene": "MainScene",
				"refVO": "General",
				"refEvent": "Select"
			});
		}
		aActions.push({
			"id": "GMap7",
			"name": "GetPosComplete",
			"refScene": "MainScene",
			"refVO": "General",
			"refEvent": "CreateComplete"
		});

		return aActions;
	};

	GeoMap.prototype.getSceneVOdelta = function(oCurrent, oNew) {
		var aVO = [];
		var aRemove = [];
		// build map of current VOs
		var oVOMap = {};
		for (var nI = 0, len = oCurrent.length; nI < len; ++nI) {
			oVOMap[oCurrent[nI].id] = oCurrent[nI];
		}
		for (var nJ = 0; nJ < oNew.length; ++nJ) {
			if (oVOMap[oNew[nJ].id]) { // VO already exists ...
				if (JSON.stringify(oNew[nJ]) != JSON.stringify(oVOMap[oNew[nJ].id])) { // ... but is different
					aRemove.push({
						"id": oNew[nJ].id,
						"type": "VO"
					}); // remove old VO version from scene and
					aVO.push(oNew[nJ]); // add new VO version
					// window.VBI.m_bTrace && window.VBI.Trace( "Scene update VO " + oNew[nI].id );
				} // else {} // nothing to do

			} else { // new VO -> add it
				aVO.push(oNew[nJ]);
				// window.VBI.m_bTrace && window.VBI.Trace( "Scene add VO " + oNew[nI].id );
			}
			delete oVOMap[oNew[nJ].id]; // remove processed VOs from map
		}
		// remove VOs remaining on map
		for ( var id in oVOMap) {
			aRemove.push({
				"id": id,
				"type": "VO"
			});
			// window.VBI.m_bTrace && window.VBI.Trace( "Scene remove VO " + id );
		}
		var retVal = {
			"Merge": {
				"name": "MainScene",
				"type": "SceneGeo",
				"SceneGeo": {
					"id": "MainScene",
					"refMapLayerStack": this.getRefMapLayerStack()
				}
			}
		};
		if (aRemove.length) {
			retVal.Merge.SceneGeo.Remove = aRemove;
		}
		if (aVO.length) {
			retVal.Merge.SceneGeo.VO = aVO;
		}

		return retVal;
	};

	// ...........................................................................//
	// diagnostics...............................................................//

	GeoMap.prototype.minimizeApp = function(oApp) {
		/*
		 * TO DO:
		 * calculate a hash instead of caching the json string
		 */

		// remove windows section when not necessary..............................//
		var t, s;
		s = null;
		if (!this.m_bWindowsDirty) {
			(t = oApp) && (t = t.SAPVB) && (t = t.Windows) && (s = JSON.stringify(t)) && (s == this.m_curWindows) && (delete oApp.SAPVB.Windows) || (this.m_curWindows = s ? s : this.m_curWindows);
		} else {
			this.m_bWindowsDirty = false;
		}

		// remove unmodified scenes...............................................//
		s = null;
		(t = oApp) && (t = t.SAPVB) && (t = t.Scenes) && (s = JSON.stringify(t)) && (s == this.m_curScenes) && (delete oApp.SAPVB.Scenes) || (this.m_curScenes = s ? s : this.m_curScenes);

		// remove unmodified actions..............................................//
		s = null;
		(t = oApp) && (t = t.SAPVB) && (t = t.Actions) && (s = JSON.stringify(t)) && (s == this.m_curActions) && (delete oApp.SAPVB.Actions) || (this.m_curActions = s ? s : this.m_curActions);

		// remove unmodified datatypes............................................//
		s = null;
		(t = oApp) && (t = t.SAPVB) && (t = t.DataTypes) && (s = JSON.stringify(t)) && (s == this.m_curDataTypes) && (delete oApp.SAPVB.DataTypes) || (this.m_curDataTypes = s ? s : this.m_curDataTypes);

		// remove unmodified data.................................................//
		if (!this.mbForceDataUpdate) {
			s = null;
			(t = oApp) && (t = t.SAPVB) && (t = t.Data) && (s = JSON.stringify(t)) && (s == this.m_curData) && (delete oApp.SAPVB.Data) || (this.m_curData = s ? s : this.m_curData);
		} else {
			this.mbForceDataUpdate = false; // reset
		}

		return oApp;
	};

	// ...........................................................................//
	// helper functions..........................................................//

	GeoMap.prototype.getAggregatorContainer = function(id) {
		if (id !== "MainScene") { // don't search for preserved ids
			// find the right aggregation instance to delegate the event..............//
			var aCluster = this.getClusters();
			for (var nL = 0; nL < aCluster.length; ++nL) {
				if (aCluster[nL].sId === id) {
					return aCluster[nL];
				}
			}
			var aVO = this.getVos();
			for (var nJ = 0, len = aVO.length; nJ < len; ++nJ) {
				if (aVO[nJ].sId === id) {
					return aVO[nJ];
				}
			}
			var aGJL = this.getGeoJsonLayers();
			for (var nI = 0; nI < aGJL.length; ++nI) {
				if (id.indexOf(aGJL[nI].sId) === 0) { // id starts with sId
					return aGJL[nI];
				}
			}
			var aFC = this.getFeatureCollections();
			for (var nK = 0; nK < aFC.length; ++nK) {
				if (id.indexOf(aFC[nK].sId) === 0) { // id starts with sId
					return aFC[nK];
				}
			}
			var legend = this.getLegend();
			if (legend && legend.sId == id) {
				return legend;
			}
		}
		return null;
	};

	GeoMap.prototype.update = function() {
		// get the frame application..............................................//
		var oApp = jQuery.extend(true, {}, GeoMap.oBaseApp);

		// update the resource data...............................................//
		if (this.m_bResourcesDirty) {
			this.updateResourceData(oApp);
		}
		var oClusterRefVOs = {};
		if (this.m_bClusteringDirty || this.m_bClustersDirty) {
			this.updateClustering(oApp, oClusterRefVOs);
			this.mCurClusterRefVOs = jQuery.extend(true, {}, oClusterRefVOs); // deep copy!
		} else {
			oClusterRefVOs = jQuery.extend(true, {}, this.mCurClusterRefVOs); // deep copy!
		}
		// update the scene data.....................................................//
		if (this.m_bSceneDirty) {
			this.updateScene(oApp, oClusterRefVOs);
		}
		// new resources may have been added ( e.g. images for vo ) .................//
		if (this.m_bResourcesDirty) {
			this.updateResourceData(oApp);
		}
		if (this.m_bMapConfigurationDirty) {
			this.updateMapConfiguration(oApp);
		}

		this.updateMapProviders(oApp);
		this.updateMapLayerStacks(oApp);
		this.updateWindows(oApp);

		// add non VO related actions
		// legend events
		var legend;
		if ((legend = this.getLegend())) {
			if (oApp.SAPVB.Actions) {
				Array.prototype.push.apply(oApp.SAPVB.Actions.Set.Action, legend.getActionArray());
			}
// } else {
// var saAction = [];
// Array.prototype.push.apply( saAction, legend.getActionArray() );
// ((oApp.SAPVB.Actions = {}).Set = {}).Action = saAction;
		}

		if (oApp.SAPVB.Actions) {
			Array.prototype.push.apply(oApp.SAPVB.Actions.Set.Action, this.getActionArray());
		}

		// remove unnecessary sections and return application JSON...................//
		return this.minimizeApp(oApp);
	};

	GeoMap.prototype.updateMapProviders = function(oApp) {
		if (!this.m_bMapProvidersDirty) {
			delete oApp.SAPVB.MapProviders; // remove MapProviders from app
		}
		this.m_bMapProvidersDirty = false;
	};

	GeoMap.prototype.updateMapLayerStacks = function(oApp) {
		if (!this.m_bMapLayerStacksDirty) {
			delete oApp.SAPVB.MapLayerStacks; // remove MapLayerStacks from app
		}
		this.m_bMapLayerStacksDirty = false;
	};

	GeoMap.prototype.updateWindows = function(oApp) {
		oApp.SAPVB.Windows = this.getWindowsObject();
	};

	GeoMap.prototype.updateScene = function(oApp, oClusterRefVOs) {
		var saVO = []; // visual object array in the scene..................//
		var saData = (oClusterRefVOs.Data) ? oClusterRefVOs.Data : []; // data array in the data section....................//
		var saRemoveData = [];
		var saType = []; // type array in the type section ...................//
		var saAction = (oClusterRefVOs.Actions) ? oClusterRefVOs.Actions : []; // actions...........................................//

		// Insert GeoJSON layers and Feature Collection before VOs to get them rendered behind the VOs
		var bUseDelta = !this.m_bFCsDirty && !this.m_bGJLsDirty && !this.m_bVosDirty;
		this.updateGJLData(saVO, saData, saRemoveData, saType, saAction, bUseDelta);
		this.updateFCData(saVO, saData, saRemoveData, saType, saAction, bUseDelta);
		this.updateVOData(saVO, saData, saRemoveData, saType, saAction, bUseDelta);

		// Insert Cluster Viz VO definitions last to make sure they get painted on top
		if (oClusterRefVOs.VO) {
			saVO = saVO.concat(oClusterRefVOs.VO);
		}

		if (this.m_bLegendDirty) {
			// process legend.........................................................//
			var oLegend = this.getLegend();
			if (oLegend) {
				saRemoveData.push({
					name: oLegend.sId,
					type: "N"
				});

				saData.push(oLegend.getDataObject());
				saType.push(oLegend.getTypeObject());
			}
		}

		// check if an update of the scene is necessary...........................//
		// failsafe but data has to be created first..............................//
		var _saVO = JSON.stringify(saVO);
		var bMetaUpdate = true; // might be reset in else part
		if (!this.m_saVO) { // no prior VO data -> initial scene definition
			((((oApp.SAPVB.Scenes = {}).Set = {}).SceneGeo = {
				"id": "MainScene",
				"refMapLayerStack": this.getRefMapLayerStack(),
				"initialZoom": this.getProperty("zoomlevel"),
				"initialStartPosition": this.getProperty("centerPosition"),
				"scaleVisible": this.getScaleVisible().toString(),
				"navControlVisible": this.getNavcontrolVisible().toString(),
				"rectSelect": this.getRectangularSelection().toString(),
				"lassoSelect": this.getLassoSelection().toString(),
				"rectZoom": this.getRectZoom().toString(),
				"VisualFrame": this.getVisualFrame(),
				"NavigationDisablement": {
					"zoom": this.getDisableZoom().toString(),
					"move": this.getDisablePan().toString()
				}
			}).VO = saVO);
		} else if (this.m_bRefMapLayerStackDirty || !(this.m_saVO === _saVO)) {
			// prior VO data exists -> calculate delta and preserve scene
			(oApp.SAPVB.Scenes = this.getSceneVOdelta(JSON.parse(this.m_saVO), saVO));
			// bMetaUpdate = false;
		} else {
			bMetaUpdate = false;
		}
		this.m_saVO = _saVO;

		// now we should have data, data types and instance information...........//
		// merge it into the app..................................................//
		var nI;

		if (this.bDataDeltaUpdate) {
			oApp.SAPVB.Data = {};
			oApp.SAPVB.Data.Set = [];
			for (nI = 0; nI < saData.length; ++nI) {
				oApp.SAPVB.Data.Set.push({
					name: saData[nI].name,
					type: "N",
					N: saData[nI]
				});
			}
		} else {
			oApp.SAPVB.Data = {};
			if (saRemoveData.length) {
				oApp.SAPVB.Data.Remove = [];
				for (nI = 0; nI < saRemoveData.length; ++nI) {
					oApp.SAPVB.Data.Remove.push(saRemoveData[nI]);
				}
			}
			oApp.SAPVB.Data.Set = [];
			for (nI = 0; nI < saData.length; ++nI) {
				oApp.SAPVB.Data.Set.push({
					name: saData[nI].name,
					type: "N",
					N: saData[nI]
				});
			}

		}

		if (bMetaUpdate) {
			(((oApp.SAPVB.DataTypes = {}).Set = {}).N = saType);
		}
		// Update Actions always, since handler could be added or removed at any time!
		(((oApp.SAPVB.Actions = {}).Set = {}).Action = saAction);

		// reset dirty states
		this.resetDirtyStates();
	};

	GeoMap.prototype.resetDirtyStates = function() {
		this.m_bRefMapLayerStackDirty = this.m_bSceneDirty = this.m_bFCsDirty = this.m_bGJLsDirty = this.m_bVosDirty = false;
	};

	GeoMap.prototype.updateMapConfiguration = function(oApp) {
		if (!this.m_bMapConfigurationDirty) {
			return;
		}

		// reset dirty state......................................................//
		this.m_bMapConfigurationDirty = false;
		var aConfig = this.getMapConfiguration();

		// set the map providers
		if (aConfig) {
			oApp.SAPVB.MapProviders = {
				Set: {
					MapProvider: aConfig.MapProvider
				}
			};
			oApp.SAPVB.MapLayerStacks = {
				Set: {
					MapLayerStack: aConfig.MapLayerStacks
				}
			};
		}

		return;
	};

	GeoMap.prototype.updateClustering = function(oApp, oClusterRefVOs) {
		var aClusters = this.getClusters();
		var oClustering = null;

		if (aClusters.length) {
			oClustering = {
				Cluster: []
			};
			oClusterRefVOs.VO = [];
			oClusterRefVOs.Actions = [];
			oClusterRefVOs.Data = [];
			for (var nI = 0, oCluster; nI < aClusters.length; ++nI) {
				oCluster = aClusters[nI];
				// add ref VO for display
				oClusterRefVOs.VO.push(oCluster.getTemplateObject());
				// Note: Do not add a DataType or Data for the VizVO, it is not needed.
				// DataTypes array does not support delta logic and an update destroys the relation to the Data!
				oClusterRefVOs.Actions = oClusterRefVOs.Actions.concat(oCluster.getActionArray());
				oClustering.Cluster.push(oCluster.getClusterDefinition());
			}
		} else if (this.m_bClusteringDirty) {
			// cluster aggregation empty -> check for clustering prperty (to be removed later)
			oClustering = this.getClustering();
		}
		if (oClustering) {
			oApp.SAPVB.Clustering = {
				Set: oClustering
			};
		} else if (this.mCurClusterRefVOs && this.mCurClusterRefVOs.VO.length > 0) {
			// there was clustering before and now it is switched off
			oApp.SAPVB.Clustering = {
				Set: []
			};
		}
		this.m_bClusteringDirty = this.m_bClustersDirty = false;
	};

	GeoMap.prototype.updateResourceData = function(oApp) {
		if (!this.m_bResourcesDirty) {
			return;
		}

		// reset dirty state......................................................//
		this.m_bResourcesDirty = false;
		var aRes = this.getResources();

		((oApp.SAPVB.Resources = {}).Set = {}).Resource = [];

		// update function for delayed loaded resources...........................//
		function ResUpdate() {
			var oApp = this.update();
			this.load(oApp);
		}

		// image load callback..............................................//
		var funcLoaded = function(res) {
			// check if given resource is still alive and valid
			if (!res.m_Img) {
				return;
			}

			var canvas = document.createElement('canvas');
			canvas.width = res.m_Img.width;
			canvas.height = res.m_Img.height;
			var context = canvas.getContext('2d');
			context.drawImage(res.m_Img, 0, 0);
			res.mProperties.value = canvas.toDataURL();
			delete res.m_Img;
			// mark resources as dirty and apply them again..................//
			this.m_bResourcesDirty = true;
			window.setTimeout(ResUpdate.bind(this), 10);
		};

		// read the resources and update them.....................................//
		for (var nJ = 0, len = aRes.length; nJ < len; ++nJ) {
			// get the control.....................................................//
			var res = aRes[nJ];

			// load the data from an url, when done we replace the value...........//
			if (!res.mProperties.value && res.mProperties.src) {
				var img = document.createElement('img');
				img.crossOrigin = 'anonymous'; //enable CORS images rendered on canvas
				res.m_Img = img;
				img.onload = funcLoaded.bind(this, res);
				// we set the data url..............................................//
				img.src = res.mProperties.src;
			} else {
				// when a name is specified, use it. In all other cases use id.........//
				oApp.SAPVB.Resources.Set.Resource.push({
					"name": (res.mProperties.name ? res.mProperties.name : res.sId),
					"value": res.mProperties.value
				});
			}
		}

		return;
	};

	GeoMap.prototype.updateVOData = function(saVO, saData, saRemoveData, saType, saAction, bUseDelta) {
		var aVO = this.getVos();
		// process visual objects.................................................//
		// we collect the different arrays from the vo instances...................//

		for (var nJ = 0, len = aVO.length; nJ < len; ++nJ) {
			// get the control.....................................................//
			var oVO = aVO[nJ];
			var aDiff = oVO.aDiff;
			saVO.push(oVO.getTemplateObject());
			saType.push(oVO.getTypeObject());
			Array.prototype.push.apply(saAction, oVO.getActionArray());
			if (aDiff && aDiff.length && oVO.m_bAggChange && bUseDelta) {
				var oDelta = oVO.getDataDeltaObject(aDiff);
				if (oDelta.oData && oDelta.oData.E && oDelta.oData.E.length) {
					saData.push(oDelta.oData);
				}
				if (oDelta.aRemoveData) {
					for (var nK = 0; nK < oDelta.aRemoveData.length; ++nK) {
						saRemoveData.push(oDelta.aRemoveData[nK]);
					}
				}
			} else if (!bUseDelta || oVO.m_bAggRenew) {
				// renew all data
				saRemoveData.push(oVO.getDataRemoveObject());
				if (oVO instanceof sap.ui.vbm.VoAggregation) {
					oVO.resetIndices();
				}
				saData.push(oVO.getDataObject());
			}
			if (oVO instanceof sap.ui.vbm.VoAggregation) {
				oVO.aDiff = [];
				oVO.updateIdxArray();
				oVO.m_bAggRenew = oVO.m_bAggChange = false;
			}
		}

	};

	/*
	 * @private
	 */
	GeoMap.prototype.updateGJLData = function(saVO, saData, saRemoveData, saType, saAction, bUseDelta) {
		var aLayers = this.getGeoJsonLayers();

		// process feature collections.................................................//
		// we collect the different arrays from the fc instances...................//

		for (var nJ = 0, len = aLayers.length; nJ < len; ++nJ) {
			// get the control.....................................................//
			var oLayer = aLayers[nJ];

			// add the control objects description..................................//
			// Note: A feature collection may return multiple VOs!
			Array.prototype.push.apply(saVO, oLayer.getTemplateObjects());
			Array.prototype.push.apply(saType, oLayer.getTypeObjects());
			Array.prototype.push.apply(saAction, oLayer.getActionArray());
			// add the control data
			Array.prototype.push.apply(saRemoveData, oLayer.getDataRemoveObjects());
			Array.prototype.push.apply(saData, oLayer.getDataObjects());
		}
	};

	/*
	 * @private
	 */
	GeoMap.prototype.updateFCData = function(saVO, saData, saRemoveData, saType, saAction, bUseDelta) {
		var aFC = this.getFeatureCollections();

		// process feature collections.................................................//
		// we collect the different arrays from the fc instances...................//

		for (var nJ = 0, len = aFC.length; nJ < len; ++nJ) {
			// get the control.....................................................//
			var oFC = aFC[nJ];

			// add the control objects description..................................//
			// Note: A feature collection may return multiple VOs!
			Array.prototype.push.apply(saVO, oFC.getTemplateObjects());
			Array.prototype.push.apply(saType, oFC.getTypeObjects());
			Array.prototype.push.apply(saAction, oFC.getActionArray());
			// add the control data
			Array.prototype.push.apply(saRemoveData, oFC.getDataRemoveObjects());
			Array.prototype.push.apply(saData, oFC.getDataObjects());
		}
	};

	GeoMap.prototype.invalidate = function(oSource) {
		// invalidate scene in any case to trigger updateScene
		this.m_bSceneDirty = true;
		// set the vos dirty state when the aggregations have changed
		if (oSource instanceof sap.ui.vbm.VoAggregation) {
			this.m_bWindowsDirty = true;
			// if invalidate results from internal data change we allow delta update for data
			this.bDataDeltaUpdate = this.bHandleChangedDataActive;
		} else if (oSource instanceof sap.ui.vbm.Legend) {
			this.m_bLegendDirty = true;
		} else if (oSource instanceof sap.ui.vbm.GeoJsonLayer) {
			if (oSource instanceof sap.ui.vbm.FeatureCollection) {
				this.m_bFCsDirty = true;
			} else {
				this.m_bGJLsDirty = true;
			}
		} else if (oSource instanceof sap.ui.vbm.ClusterBase) {
			this.m_bClustersDirty = true;
		}

		sap.ui.core.Control.prototype.invalidate.apply(this, arguments);
	};

	GeoMap.prototype.openContextMenu = function(typ, inst, menu) {
		if (menu && menu.vbi_data && menu.vbi_data.VBIName == "DynContextMenu") {
			if (!this.mVBIContext.m_Menus) {
				this.mVBIContext.m_Menus = new window.VBI.Menus();
			}
			this.mVBIContext.m_Menus.m_menus.push(menu);
			var oAutomation = {

				"SAPVB": {
					"version": "2.0",
					"Automation": {
						"Call": {
							"earliest": "0",
							"handler": "CONTEXTMENUHANDLER",
							"instance": inst.sId,
							"name": "SHOW",
							"object": typ,
							"refID": "CTM",
							"Param": [
								{
									"name": "x",
									"#": inst.mClickPos[0]
								}, {
									"name": "y",
									"#": inst.mClickPos[1]
								}, {
									"name": "scene",
									"#": "MainScene"
								}
							]
						}
					}
				}
			};
			this.loadHtml(oAutomation);
		}
	};

	GeoMap.prototype.addResourceIfNeeded = function(resource) {
		var aRes = this.getResources();
		for (var nJ = 0, len = aRes.length; nJ < len; ++nJ) {
			if (aRes[nJ].getName() === resource) {
				// resource allready loaded
				return;
			}
		}
		if (GeoMap.bEncodedSpotImagesAvailable == false) {
			var aPathImgJSON = sap.ui.resource("sap.ui.vbm", "themes/base/img/Pin_images.json");
			var oResponse = jQuery.sap.syncGetJSON(aPathImgJSON);
			GeoMap.bEncodedSpotImageData = oResponse.data;
			GeoMap.bEncodedSpotImagesAvailable = true;
		}
		if (GeoMap.bEncodedSpotImageData) {
			for ( var key in GeoMap.bEncodedSpotImageData) {
				if (resource == key) {
					this.addResource(new sap.ui.vbm.Resource({
						name: key,
						value: GeoMap.bEncodedSpotImageData[key]
					}));
				}
			}
		} else {
			// resource not found
			this.addResource(new sap.ui.vbm.Resource({
				name: resource,
				src: sap.ui.resource("sap.ui.vbm", "themes/base/img/" + resource)
			}));
		}
		this.m_bResourcesDirty = true;
	};

	GeoMap.prototype.handleChangedData = function(aNodes) {
		try {
			this.bHandleChangedDataActive = true;
			if (aNodes && aNodes.length) {
				for (var nI = 0, oNode, oCont; nI < aNodes.length; ++nI) {
					oNode = aNodes[nI];
					oCont = this.getAggregatorContainer(oNode.name);
					if (oCont) {
						oCont.handleChangedData(oNode.E);
					}
				}
			}
			this.bHandleChangedDataActive = false;
		} catch (exc) {
			this.bHandleChangedDataActive = false;
			throw exc;
		}

	};

	GeoMap.prototype.getChildByKey = function(oChild, sKey) {
		var cont, oChildInst = null;
		if ((cont = oChild.getParent())) {
			if (cont instanceof sap.ui.vbm.VoAggregation) {
				if ((this.getAggregatorContainer(cont.getId()))) {
					oChildInst = cont.findInstanceByKey(sKey);
				}
			} else {
				oChildInst = cont.findInstance(sKey);
			}
		}
		return oChildInst;
	};

	return GeoMap;

}, /* bExport= */true);
