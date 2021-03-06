(function() {
	"use strict";
	/*global sap, jQuery */

	/**
	 * @fileOverview Application component to display information on entities from the GWSAMPLE_BASIC
	 *   OData service.
	 * @version 1.44.6
	 */
	jQuery.sap.declare("sap.ovp.app.Component");
	jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");

	sap.ui.core.UIComponent.extend("sap.ovp.app.Component", {
		// use inline declaration instead of component.json to save 1 round trip
		metadata: {
			routing: {
				config: {
					routerClass: sap.ui.core.routing.Router
				},
				targets: {},
				routes: []
			},

			properties: {
				"cardContainerFragment": {
					"type": "string",
					"defaultValue": "sap.ovp.app.CardContainer"
				},
				"dashboardLayoutUtil": {
					"type": "sap.ovp.ui.DashboardLayoutUtil"
				}
			},

			version: "1.44.6",

			library: "sap.ovp.app",

			dependencies: {
				libs: ["sap.m",
					"sap.ui.comp",
					"sap.uxap"
				],
				components: []
			},
			config: {
				fullWidth: true,
				hideLightBackground: true
			}
		},

		_addModelsMeasurements: function() {
			var oModels = this.oModels;
			var oModel, sModel;
			for (sModel in oModels) {
				oModel = this.getModel(sModel);
				if (oModel.getMetaModel()) {
					this._addModelMeasurements(oModel, sModel);
				}
			}
		},

		_addModelMeasurements: function(oModel, sModel) {
			var sId = "ovp:ModelLoading-" + sModel;
			var sIdBatch = "ovp:ModelBatchCall-" + sModel + ":";
			jQuery.sap.measure.start(sId, "Component createContent -> MetaData loaded", "ovp");
			oModel.getMetaModel().loaded().then(function() {
				jQuery.sap.measure.end(sId);
			});

			oModel.attachBatchRequestSent(function(oEvent) {
				jQuery.sap.measure.start(sIdBatch + oEvent.getParameter("ID"), "BatchRequestSent -> BatchRequestCompleted", "ovp");
			});
			oModel.attachBatchRequestCompleted(function(oEvent) {
				jQuery.sap.measure.end(sIdBatch + oEvent.getParameter("ID"));
			});

		},

		/**
		 * get the merged sap.ovp section from all component hierarchy
		 * @returns merged sap.ovp section from manifes files
		 */
		getOvpConfig: function() {
			var oOvpConfig;
			var aExtendArgs = [];
			var oManifest = this.getMetadata();
			//loop over the manifest hierarchy till we reach the current generic component
			while (oManifest && oManifest.getComponentName() !== "sap.ovp.app") {
				oOvpConfig = oManifest.getManifestEntry("sap.ovp");
				if (oOvpConfig) {
					//as the last object is the dominant one we use unshift and not push
					aExtendArgs.unshift(oOvpConfig);
				}
				oManifest = oManifest.getParent();
			}
			//add an empty object for the merged config as we don't whant to change the actual manifest objects
			aExtendArgs.unshift({});
			//add deep flag so the merge would be recurcive
			aExtendArgs.unshift(true);
			oOvpConfig = jQuery.extend.apply(jQuery, aExtendArgs);
			return oOvpConfig;
		},

		createXMLView: function(ovpConfig) {
			jQuery.sap.measure.start("ovp:AppCreateContent", "OVP app Component createContent", "ovp");
			this._addModelsMeasurements();

			this.getRouter().initialize();
			var appConfig = this.getMetadata().getManifestEntry("sap.app");
			var uiConfig = this.getMetadata().getManifestEntry("sap.ui");
			var sIcon = jQuery.sap.getObject("icons.icon", undefined, uiConfig);

			var sComponentName = this.getMetadata().getComponentName();
			ovpConfig.baseUrl = jQuery.sap.getModulePath(sComponentName);
            if (ovpConfig.smartVariantRequired === undefined || ovpConfig.smartVariantRequired === null) {
                ovpConfig.smartVariantRequired = true;
            }
            if (ovpConfig.enableLiveFilter === undefined || ovpConfig.enableLiveFilter === null) {
                ovpConfig.enableLiveFilter = true;
            }

            var uiModel = new sap.ui.model.json.JSONModel(ovpConfig);

			uiModel.setProperty("/title", jQuery.sap.getObject("title", undefined, appConfig));
			uiModel.setProperty("/description", jQuery.sap.getObject("description", undefined, appConfig));

			if (sIcon) {
				if (sIcon.indexOf("sap-icon") < 0 && sIcon.charAt(0) !== '/') {
					sIcon = ovpConfig.baseUrl + "/" + sIcon;
				}
				uiModel.setProperty("/icon", sIcon);
			}

			//convert cards object into sorted array
			var oCards = ovpConfig.cards;
			var aCards = [];
			var oCard;
			for (var cardKey in oCards) {
				if (oCards.hasOwnProperty(cardKey) && oCards[cardKey]) {
					oCard = oCards[cardKey];
					oCard.id = cardKey;
					aCards.push(oCard);
				}
			}

			aCards.sort(function(card1, card2) {
				if (card1.id < card2.id) {
					return -1;
				} else if (card1.id > card2.id) {
					return 1;
				} else {
					return 0;
				}
			});

			uiModel.setProperty("/cards", aCards);

			// Layout switch: read 'containerLayout' property from manifest
			if (ovpConfig.containerLayout && ovpConfig.containerLayout === "resizable") {
                jQuery.sap.require("sap.ovp.ui.DashboardLayoutUtil");
				uiModel.setProperty("/cardContainerFragment", "sap.ovp.app.DashboardCardContainer");
                //Read all the property "/resizableLayout" from the manifest and set it to "/dashboardLayout" property
                uiModel.setProperty("/dashboardLayout",ovpConfig.resizableLayout);
				var oDblUtil = new sap.ovp.ui.DashboardLayoutUtil(uiModel);
				this.setDashboardLayoutUtil(oDblUtil);
			} else {
				// default + compatibility --> EasyScanLayout
				uiModel.setProperty("/cardContainerFragment", this.getCardContainerFragment());
			}
            var oValueHelpEntityMap = this.createMapForValueHelpEntity(ovpConfig);
            uiModel.setProperty("/ValueHelpEntityMap", oValueHelpEntityMap);
            this.setModel(uiModel, "ui");
            var oFilterModel = this.getModel(ovpConfig.globalFilterModel);
            this.setModel(oFilterModel);
            var oEntityType = oFilterModel.getMetaModel().getODataEntityType(oFilterModel.getMetaModel().getODataEntityContainer().namespace +
                "." + ovpConfig.globalFilterEntityType, true);
            var oView = sap.ui.view({
                height: "100%",
                preprocessors: {
                    xml: {
                        bindingContexts: {
                            ui: uiModel.createBindingContext("/"),
                            meta: oFilterModel.getMetaModel().createBindingContext(oEntityType)
                        },
                        models: {
                            ui: uiModel,
                            meta: oFilterModel.getMetaModel()
                        }
                    }
                },
				type: sap.ui.core.mvc.ViewType.XML,
				viewName: "sap.ovp.app.Main"
			});

			jQuery.sap.measure.end("ovp:AppCreateContent");

			return oView;
		},

		setContainer: function() {
			var ovpConfig = this.getOvpConfig();
			var oFilterModel = this.getModel(ovpConfig.globalFilterModel);
			// call overwritten setContainer (sets this.oContainer)
			sap.ui.core.UIComponent.prototype.setContainer.apply(this, arguments);

			if (oFilterModel) {
				oFilterModel.getMetaModel().loaded().then(function() {
					// Do the templating once the metamodel is loaded
					this.runAsOwner(function() {
						var oView = this.createXMLView(ovpConfig);
						this.setAggregation("rootControl", oView);
						this.oContainer.invalidate();
					}.bind(this));
				}.bind(this));
			}

		},

        createMapForEntityContainer: function (oEntityContainer) {
            var oEntitySetMap = {};
            var oEntitySets = oEntityContainer.entitySet;
            for (var i = 0; i < oEntitySets.length; i++) {
                oEntitySetMap[oEntitySets[i].name] = oEntitySets[i].entityType;
            }
            return oEntitySetMap;

        },

        createMapForValueHelpEntity: function (oOvpConfig) {
            var oFilterModel = this.getModel(oOvpConfig.globalFilterModel);
            var oValueHelpEntityMap = [];
            var oFilterEntityType = oFilterModel.getMetaModel().getODataEntityType(oFilterModel.getMetaModel().getODataEntityContainer().namespace +
                "." + oOvpConfig.globalFilterEntityType);
            if (!oFilterEntityType) {
                return oValueHelpEntityMap;
            }
            var oEntityCollection = [];
            oEntityCollection.push(oFilterEntityType);
            var counter = 0;
            var bNavigationProperty = false;
            var oEntitySetMap = this.createMapForEntityContainer(oFilterModel.getMetaModel().getODataEntityContainer());
            if (oFilterEntityType.navigationProperty) {
                bNavigationProperty = true;
            }
            while (oEntityCollection.length != 0) {
                var oEntityType = oEntityCollection.shift();
                for (var i = 0; i < oEntityType.property.length; i++) {
                    var oProp = oEntityType.property[i];
                    if (oProp["com.sap.vocabularies.Common.v1.ValueList"]) {
                        oValueHelpEntityMap.push(oEntitySetMap[oProp["com.sap.vocabularies.Common.v1.ValueList"].CollectionPath.String]);
                    }
                }
                if (!bNavigationProperty || !(oFilterEntityType.navigationProperty[counter])) {
                    break;
                }
                //get association
                var sAssociationEntity = oFilterModel.getMetaModel().getODataAssociationEnd(oFilterEntityType, oFilterEntityType.navigationProperty[counter].name).type;
                var oNavigationEntityType = oFilterModel.getMetaModel().getODataEntityType(sAssociationEntity);
                oEntityCollection.push(oNavigationEntityType);
                counter++;
            }
            return oValueHelpEntityMap;
        }

	});
}());