sap.ui.define([
	"sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterBar", "sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController",
	"sap/suite/ui/commons/HeaderCell", "sap/suite/ui/commons/HeaderCellItem", "sap/m/Label",
	"sap/ui/comp/odata/ODataModelUtil",
	"sap/ui/comp/smartfilterbar/FilterProvider", "sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterProvider",
	"sap/ui/comp/smartvariants/PersonalizableInfo", "sap/ui/comp/smartvariants/SmartVariantManagement",
	"sap/ui/model/Filter",
	"sap/m/OverflowToolbar", "sap/m/ToolbarSpacer", "sap/m/Link", "sap/ui/comp/odata/MetadataAnalyser",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil"
], function(VisualFilterBar, VisualFilterDialogController,
		HeaderCell, HeaderCellItem, Label,
		ODataModelUtil,
		FilterProvider, VisualFilterProvider,
		PersonalizableInfo, SmartVariantManagement,
		Filter,
		OverflowToolbar, ToolbarSpacer, Link, MetadataAnalyser, FilterUtil) {
	"use strict";

	var SmartVisualFilterBar = VisualFilterBar.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar", {
		metadata: {
			properties: {
				config: { type: "object", group: "Misc", defaultValue: null },
				persistencyKey: { type: "string", group: "Misc", defaultValue: null }
			},
			associations: {
				smartVariant: { type: "sap.ui.core.Control", multiple: false }
			}
		},
		renderer: {}
	});

	SmartVisualFilterBar.prototype.init = function() {
		if (VisualFilterBar.prototype.init)
			VisualFilterBar.prototype.init.apply(this, arguments);

		// Default settings
		this.labelHeight = 2.0;
		this.compHeight = 7.9;
		this.cellHeightPadding = 1;
		this.cellHeight = (this.labelHeight + this.compHeight + this.cellHeightPadding) + "rem";  // Add cell padding due to the focus on the chart being clipped by the outer cell container, shouldn't have to do this
		this.cellWidth = 320;

		this._globalFilters = {};
		this._dialogFilters = {};
		this._compactFilters = {};
		this._hiddenFilters = {};
	};

	/**
	 * It could happen that the entity type information is set already in the view, but there is no model attached yet. This method is called once the
	 * model is set on the parent and can be used to initialise the metadata, from the model, and finally create the visual filter bar.
	 *
	 * @private
	 */
	SmartVisualFilterBar.prototype.propagateProperties = function() {
		VisualFilterBar.prototype.propagateProperties.apply(this, arguments);
		this._initMetadata();
	};

	/**
	 * Initialises the OData metadata necessary to create the visual filter bar
	 *
	 * @private
	 */
	SmartVisualFilterBar.prototype._initMetadata = function() {
		if (!this.bIsInitialised)
			ODataModelUtil.handleModelInit(this, this._onMetadataInit);
	};

	/**
	 * Called once the necessary Model metadata is available
	 *
	 * @private
	 */
	SmartVisualFilterBar.prototype._onMetadataInit = function() {
		if (this.bIsInitialised)
			return;

		this._annoProvider = this._createVisualFilterProvider();
		if (!this._annoProvider)
			return;

		this.bIsInitialised = true;
		this._updateFilterBar();
	};

	/**
	 * Creates an instance of the visual filter provider
	 *
	 * @private
	 */
	SmartVisualFilterBar.prototype._createVisualFilterProvider = function() {
		var model = this.getModel();
		var entitySet = this.getEntitySet();

		if (!model || !entitySet) // Model and entity set must be available
			return null;

		return new VisualFilterProvider(this);
	};

	/*
	* @private
	* obtains the string for '_BASIC' group from i18n property
	* @return {string}
	*/
	SmartVisualFilterBar.prototype._getBasicGroupTitle = function() {
		return this.getModel("i18n").getResourceBundle().getText("VIS_FILTER_GRP_BASIC_TITLE");
	};

	SmartVisualFilterBar.prototype._getFieldGroupForProperty = function(oEntityType,sCurrentPropName) {
		return this._annoProvider ? this._annoProvider._getFieldGroupForProperty(oEntityType,sCurrentPropName) : undefined;
	};

	SmartVisualFilterBar.prototype._getGroupList = function() {
		return this._annoProvider ? this._annoProvider.getGroupList() : [];
	};

	SmartVisualFilterBar.prototype._getGroupMap = function() {
		return this._annoProvider ? this._annoProvider.getGroupMap() : {};
	};

	SmartVisualFilterBar.prototype._getMeasureList = function() {
		return this._annoProvider ? this._annoProvider.getMeasureList() : [];
	};

	SmartVisualFilterBar.prototype._getMeasureMap = function() {
		return this._annoProvider ? this._annoProvider.getMeasureMap() : {};
	};

	SmartVisualFilterBar.prototype._getDimensionMap = function() {
		return this._annoProvider ? this._annoProvider.getDimensionMap() : {};
	};

	SmartVisualFilterBar.prototype._updateFilterBar = function() {
		// Centrally handle the various settings: Application Configuration, OData Annotations, Variant settings...
		// Order of precedence, highest to lowest, highest precedence overwrites the lower precedence:
		//   1. Variant
		//   2. OData Annotations

		// Variants have a higher precedence than the application settings and annotations
		var variantJSON = this._getVariantConfig();
		if (variantJSON && variantJSON.config) {

			if (variantJSON.hiddenFilters) {
				this._hiddenFilters = variantJSON.hiddenFilters;
			}
			this.setConfig(variantJSON.config);
			return;
		}

		// Annotations have the lowest precedence
		var annoSettings = this._getAnnotationSettings();
		if (annoSettings && annoSettings.filterList) {
			var config = this._convertSettingsToConfig(annoSettings);
			this.setConfig(config);
			return;
		}

		// Default, no filters
		this.setConfig({
			filterCompList: []
		});
	};

	SmartVisualFilterBar.prototype._getAnnotationSettings = function() {
		return this._annoProvider ? this._annoProvider.getVisualFilterConfig() : null;
	};

	SmartVisualFilterBar.prototype._convertSettingsToConfig = function(settings) {
		var config = {
			filterCompList: []
		};

		// Include group information, prepare the group information by field
		var groupList = this._getGroupList();
		var groupByFieldName = {};
		for (var i = 0; i < groupList.length; i++) {
			var group = groupList[i];

			for (var j = 0; j < group.fieldList.length; j++) {
				var field = group.fieldList[j];
				groupByFieldName[field.name] = {
					name: group.name,
					label: group.label
				};
			}
		}

		// By default the basic group is all available in the filter dialog, so get all field names and in the shownInFilterDialog, set the value to true if in this list
		var groupMap = this._getGroupMap();
		var basicGroup = groupMap["_BASIC"];
		var basicFieldNameList = [];
		if (basicGroup && basicGroup.fieldList) {
			for (var i = 0; i < basicGroup.fieldList.length; i++)
				basicFieldNameList.push(basicGroup.fieldList[i].name);
		}

		var measureMap = this._getMeasureMap();
		var filterList = settings.filterList;
		for (var i = 0; i < filterList.length; i++) {
			var filterCfg = filterList[i];

			var dimField = filterCfg.dimension.field;

			var measureField = measureMap[filterCfg.collectionPath][filterCfg.measure.field];

			// convert the filter properties from the configuration (variant, annotation) into the control specific properties
			config.filterCompList.push({
				shownInFilterBar: filterCfg.selected,
				shownInFilterDialog: filterCfg.selected || basicFieldNameList.indexOf(dimField) != -1,
				cellHeight: this.cellHeight,
				group: groupByFieldName[filterCfg.parentProperty],
				component: {
					type: filterCfg.type,
					cellHeight: this.compHeight + "rem",
					properties: {
						sortOrder : filterCfg.sortOrder,
						scaleFactor : filterCfg.scaleFactor,
						filterRestriction: filterCfg.filterRestriction,
						width: this.cellWidth + "px",
						height: this.compHeight + "rem",
						entitySet: filterCfg.collectionPath ? filterCfg.collectionPath : this.getEntitySet(),
						dimensionField: dimField,
						dimensionFieldDisplay: filterCfg.dimension.fieldDisplay,
						dimensionFilter: filterCfg.dimensionFilter,
						measureField: filterCfg.measure.field,
						measureSortDescending: filterCfg.measure.descending === true || filterCfg.measure.descending == "true",
						unitField: measureField ? measureField.fieldInfo.unit : "",
						outParameter: filterCfg.outParameter ? filterCfg.outParameter : undefined,
						inParameters: filterCfg.inParameters ? filterCfg.inParameters : undefined,
						parentProperty: filterCfg.parentProperty ? filterCfg.parentProperty : undefined
					}
				}
			});
		}

		return config;
	};

	SmartVisualFilterBar.prototype._setVariantModified = function() {
		if (this._oVariantManagement)
			this._oVariantManagement.currentVariantSetModified(true);
	};

	SmartVisualFilterBar.prototype._onFilterChange = function(ev) {
		this._setVariantModified();


		// Propagate to the other filters and the Smart Chart/Table
		var itemList = this.getItems();
		var filterItemList = [];
		for (var i = 0; i < itemList.length; i++)
			filterItemList.push(itemList[i].getSouth().getContent());


		// remove filter from global filters
		this._removeGlobalFilters(ev.getParameter('removeGlobalFilter'), ev.getParameter('removeGlobalFilterValue'), true);

		this._updateFilterItemList(filterItemList);

		// Fire the external filter change event
		this.fireFilterChange();

	};
	/**
	 * Remove Global Filters
	 * @param  {string} removeGlobalFilter      [description]
	 * @param  {string} removeGlobalFilterValue [description]
	 * @param  {boolean} bSilent                 Dont fire filter change as it would be done at later stage
	 */
	SmartVisualFilterBar.prototype._removeGlobalFilters = function (removeGlobalFilter, removeGlobalFilterValue, bSilent) {
		var propertyFilters,
			newPropertyFilters = [];
		if (removeGlobalFilter && removeGlobalFilterValue) {
			var propertyFilters = this._globalFilters[removeGlobalFilter];
			delete this._globalFilters[removeGlobalFilter];

			for (var i = 0 ; i < propertyFilters.length; i++) {
				if (propertyFilters[i] !== removeGlobalFilterValue) {
					newPropertyFilters.push(propertyFilters[i]);
				}
			}

			if (newPropertyFilters.length > 0) {
				this._globalFilters[removeGlobalFilter] = newPropertyFilters;
			}
		}
		if (!bSilent) {
			// Fire the external filter change event
			this.fireFilterChange();
		}
	};

	SmartVisualFilterBar.prototype._applyDialogFilters = function(filterItemList) {
		this._setDialogFilters(filterItemList);
		this._globalFilters = this._dialogFilters;
		this._dialogFilters = {};
	};

	SmartVisualFilterBar.prototype._setDialogFilters = function(filterItemList) {
		this._dialogFilters = {};
		for (var i = 0; i < filterItemList.length; i++) {
			var filterItem = filterItemList[i];

			var filterList = filterItem.getDimensionFilter();
			if (!filterList)
				filterList = [];

			
			var outParam = filterItem.getOutParameter();
			if (outParam && filterList.length > 0) {
				if (this._dialogFilters[outParam] === undefined) {
					this._dialogFilters[outParam] = [];
				}

				for (var j = 0; j < filterList.length; j++) {
					if (this._dialogFilters[outParam].indexOf(filterList[j].dimValue) === -1) {
						this._dialogFilters[outParam].push(filterList[j].dimValue);
					}
				}
			}
		}		
	};

	/*
	* @private
	* groups hidden filters accordingly
	*/
	SmartVisualFilterBar.prototype.groupHiddenFilters = function(mandatoryParams) {
		var oHidFils = jQuery.extend(true, [], this._hiddenFilters);
		this._groupByFieldName = [];
		var metadataAnalyser = new MetadataAnalyser(this.getModel());
		var fullEntityTypeName = metadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet());
		var metaModel = this.getModel().getMetaModel();
		var entityType = metaModel.getODataEntityType(fullEntityTypeName);
		this._allSelectionFields = entityType["com.sap.vocabularies.UI.v1.SelectionFields"];
		var sEntityName = entityType['com.sap.vocabularies.Common.v1.Label'] ? entityType['com.sap.vocabularies.Common.v1.Label'].String :
			entityType.name;
		var parProp;
		var isPartOfSelectionFields = function(element) {
				return element.PropertyPath === ob;
		};
		for (var ob in oHidFils) {
			//if a mandatory parameter exists then the parameter's label is assigned to parProp
			for (var param in mandatoryParams) {
				if (mandatoryParams[param].fieldName === ob) {
					parProp = mandatoryParams[param].label;
					break;
				}
			}
			for (var key in entityType.property) {
				if (entityType.property[key].name === ob) {
					//parProp holds the label of the hidden filter property
					parProp = entityType.property[key]['com.sap.vocabularies.Common.v1.Label'] ? entityType.property[key]['com.sap.vocabularies.Common.v1.Label'].String : entityType.property[key].name;
					break;
				}
			}
			for (var i = 0; i < oHidFils[ob].length; i++) {
				oHidFils[ob][i].parentProperty = parProp;
			}
			var sfieldlabel = this._getFieldGroupForProperty(entityType, ob);
			var isSelected = this._allSelectionFields.filter(isPartOfSelectionFields);
			//oHidFils[ob] is pushed to this._groupByFieldName[groupname][propertyname][0]
			if (isSelected.length > 0) {
				//hidden filter under selection field, group under basic
				if (this._groupByFieldName['_BASIC'] && this._groupByFieldName['_BASIC'][ob]) {
					this._groupByFieldName['_BASIC'][ob].push(oHidFils[ob]);
					continue;
				}
				if (this._groupByFieldName['_BASIC'] && !this._groupByFieldName['_BASIC'][ob]) {
					this._groupByFieldName['_BASIC'][ob] = [];
					this._groupByFieldName['_BASIC'][ob].push(oHidFils[ob]);
					continue;
				}
				this._groupByFieldName['_BASIC'] = [];
				this._groupByFieldName['_BASIC'][ob] = [];
				this._groupByFieldName['_BASIC'][ob].push(oHidFils[ob]);
			} else if (sfieldlabel) {
				//hidden filter under field group, group under field group
				if (this._groupByFieldName[sfieldlabel] && this._groupByFieldName[sfieldlabel][ob]) {
					this._groupByFieldName[sfieldlabel][ob].push(oHidFils[ob]);
					continue;
				}
				if (this._groupByFieldName[sfieldlabel] && !this._groupByFieldName[sfieldlabel][ob]) {
					this._groupByFieldName[sfieldlabel][ob] = [];
					this._groupByFieldName[sfieldlabel][ob].push(oHidFils[ob]);
					continue;
				}
				this._groupByFieldName[sfieldlabel] = [];
				this._groupByFieldName[sfieldlabel][ob] = [];
				this._groupByFieldName[sfieldlabel][ob].push(oHidFils[ob]);
			} else {
				//group hidden filter under entity type name
				if (this._groupByFieldName[sEntityName] && this._groupByFieldName[sEntityName][ob]) {
					this._groupByFieldName[sEntityName][ob].push(oHidFils[ob]);
					continue;
				}
				if (this._groupByFieldName[sEntityName] && !this._groupByFieldName[sEntityName][ob]) {
					this._groupByFieldName[sEntityName][ob] = [];
					this._groupByFieldName[sEntityName][ob].push(oHidFils[ob]);
					continue;
				}
				this._groupByFieldName[sEntityName] = [];
				this._groupByFieldName[sEntityName][ob] = [];
				this._groupByFieldName[sEntityName][ob].push(oHidFils[ob]);
			}
		}
	};

	/*
	* @private
	* this function is used to check if a group is a field group or an entity type group
	* @param {String} gName - group name of hidden filter
	* @return {int} returns 0 if field group else 1
	*/
	SmartVisualFilterBar.prototype._getGroupType = function(gName) {
		var metadataAnalyser = new MetadataAnalyser(this.getModel());
		var fullEntityTypeName = metadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet());
		var metaModel = this.getModel().getMetaModel();
		var entityType = metaModel.getODataEntityType(fullEntityTypeName);
		for (var oObj in entityType) {
			var sFieldLabel = null;
			//check if property has a field group defined in annotation
			if (oObj.indexOf("com.sap.vocabularies.UI.v1.FieldGroup") > -1) {
				sFieldLabel = (entityType[oObj].Label && entityType[oObj].Label.String) ? entityType[oObj].Label.String : "";
				if (sFieldLabel === gName) {
					return 0;
				}
			}
		}
		return 1;
	};
	/**
	 * @private
	 * Create filter query for each filter Item based on the
	 * filter item config after merge. Also updated selected indicator for filter item
	 *  
	 * @param {array} aAllFilterConfig updated filter item config after merge (includes all filter items
	 * whether in the bar or the visual filter dialog)
	 * @returns {void}
	 */
	SmartVisualFilterBar.prototype._updateFilterItemListOnMerge = function(aAllFilterConfig) {
		var aFilterItemWithFilters = [];

		for (var i = 0; i < aAllFilterConfig.length; i++) {
			var oFilterItemProps = aAllFilterConfig[i].component.properties,
				sOutParameter = oFilterItemProps.outParameter,
				aFilterList = oFilterItemProps.dimensionFilter;

			// if filter item has outParameter
			// set it as global filter with filter key
			if (sOutParameter) {

				if (!this._globalFilters[sOutParameter] && aFilterList && aFilterList.length > 0) {
					this._globalFilters[sOutParameter] = [];
					for (var j = 0; j < aFilterList.length; j++) {
						if (this._globalFilters[sOutParameter].indexOf(aFilterList[j].dimValue) === -1) {
							this._globalFilters[sOutParameter].push(aFilterList[j].dimValue);
						}
					}
				}
			}

			if (!aFilterList)
				aFilterList = [];

			aFilterItemWithFilters.push({
				dimensionField: oFilterItemProps.dimensionField,
				inParameters: oFilterItemProps.inParameters,
				parentProperty: oFilterItemProps.parentProperty,
				filterList: aFilterList
			});
		}

		var aItemList = this.getItems(),
			aFilterItemList = [];

		for (var i = 0; i < aItemList.length; i++) {
			aFilterItemList.push(aItemList[i].getSouth().getContent());
		}
			
		// iterate through each item on the visual filter bar
		// and determine filters to be applied to it
		for (var i = 0; i < aFilterItemList.length; i++) {
			var oFilterItem = aFilterItemList[i],
				sParentProp = oFilterItem.getParentProperty(),
				iExcludeIndex,
				aFilter,
				aDimensionFilters;

			// iterate through config of filter item 
			// to create filters for the current filter item and
			// ignoring the current filter item in the filter config 
			for (var j = 0; j < aFilterItemWithFilters.length; j++) {
				aDimensionFilters = aFilterItemWithFilters[j].filterList;
				if (sParentProp === aFilterItemWithFilters[j].parentProperty) {
					iExcludeIndex = j;
					break;
				}
			}

			// set external filter property of the filter item
			// which will further be used by the filter item
			// as a filter query and trigger a render of the chart
			if (iExcludeIndex >= 0) {
				aFilter = this._combineFilterLists(aFilterItemWithFilters, iExcludeIndex);
				oFilterItem.setProperty('dimensionFilter', aDimensionFilters);
				oFilterItem.setDimensionFilterExternal(aFilter, true);
			}
		}

		this._updateSelectedIndicator();
	};

	/**
	 * @private
	 * Create filter query for each filter Item based on the
	 * filter item in the bar. Also updated selected indicator for filter item
	 *  
	 * @param {array} filterItemList - list of al filter item instances in the bar
	 * @returns {void}
	 */
	SmartVisualFilterBar.prototype._updateFilterItemList = function(filterItemList) {
		var filterItemWithFilters = [];

		for (var i = 0; i < filterItemList.length; i++) {
			var filterItem = filterItemList[i];

			var filterList = filterItem.getDimensionFilter(),
				outParameter = filterItem.getOutParameter();

			// if filter item has outParameter
			// set it as global filter with filter key
			if (outParameter) {

				if (filterList && filterList.length > 0) {
					if (!this._globalFilters[outParameter]) { 
						this._globalFilters[outParameter] = [];
					}

					for (var j = 0; j < filterList.length; j++) {
						if (this._globalFilters[outParameter].indexOf(filterList[j].dimValue) === -1) {
							this._globalFilters[outParameter].push(filterList[j].dimValue);
						}
					}
				}
			}

			if (!filterList)
				filterList = [];

			filterItemWithFilters.push({
				dimensionField: filterItem.getDimensionField(),
				inParameters: filterItem.getInParameters(),
				parentProperty: filterItem.getParentProperty(),
				filterList: filterList,
				filterItem: filterItem
			});
		}

		for (var i = 0; i < filterItemWithFilters.length; i++) {
			var filterItem = filterItemWithFilters[i].filterItem;

			var filter = this._combineFilterLists(filterItemWithFilters, i);
			filterItem.setDimensionFilterExternal(filter);
		}

		this._updateSelectedIndicator();
	};

	SmartVisualFilterBar.prototype._combineFilterLists = function(filterItemList, excludeIndex) {
		// Get all of the filter values, at the same time join filter values from different filter items which have the same dimension field
		var filterByDim = {},
			inParams = (filterItemList.length > 0 && filterItemList[excludeIndex] && filterItemList[excludeIndex].inParameters) ? filterItemList[excludeIndex].inParameters : undefined,
			parentProperty = (filterItemList.length > 0 && filterItemList[excludeIndex] && filterItemList[excludeIndex].parentProperty) ? filterItemList[excludeIndex].parentProperty : undefined,
			mappedLocalDataProperty = [];

		if (excludeIndex == -1) {
			// Only for Out Params
			for (var i = 0; i < filterItemList.length; i++) {
				if (i == excludeIndex)
					continue;

				var item = filterItemList[i],
					valList = item.filterList;

				var dimField = item.dimensionField;

				if (!filterByDim[dimField])
					filterByDim[dimField] = [];
				/*if (!this._globalFilters[dimField])
					this._globalFilters[dimField] = [];*/

				if (valList) {
					for (var j = 0; j < valList.length; j++) {
						filterByDim[dimField].push(valList[j].dimValue);
						/*if (this._globalFilters[dimField].indexOf(valList[j].dimValue) === -1) {
							this._globalFilters[dimField].push(valList[j].dimValue);
						}*/
					}
				}
			}
		} else {
			if (inParams) {
				var mappedLocalDataProperty = [],
					propFilters;
				for (var key = (inParams.length - 1); key > -1; key--) {
					var localDataProperty = inParams[key].localDataProperty,
						valueListProperty = inParams[key].valueListProperty;

					if (Object.keys(this._dialogFilters).length > 0) {
						propFilters = this._dialogFilters;
					} else {
						propFilters = this._globalFilters;
					}

					if (localDataProperty !== parentProperty && mappedLocalDataProperty.indexOf(localDataProperty) === -1) {
						if (propFilters[localDataProperty] !== undefined) {
							if (filterByDim[valueListProperty] === undefined) {
								filterByDim[valueListProperty] = propFilters[localDataProperty];
								mappedLocalDataProperty.push(localDataProperty);
							}
						}

						// consider hidden filter for in params
						var filterList = [];
						// check if in parameter is present in hidden filter
						if (Object.keys(this._hiddenFilters).length > 0 && this._hiddenFilters[localDataProperty]) {
							var hiddenProp = this._hiddenFilters[localDataProperty];
							if (!filterByDim[localDataProperty]) {
								for (var k = 0 ; k < hiddenProp.length ; k++) {
									filterList.push(hiddenProp[k].dimValue);
								}
								filterByDim[localDataProperty] = filterList;
							}
						}
					}
				}
			}
		}

		// Build the set of filters
		var filter = new sap.ui.model.Filter({
			aFilters: [],
			and: true
		});

		for (var dimField in filterByDim) {
			var valList = filterByDim[dimField];

			valList.sort(); // sort so duplicates can be removed, if not we get an exception from the backend

			// Remove duplicate values
			var prevVal = null;
			for (var i = valList.length - 1; i >= 0; i--) {
				if (valList[i] == prevVal)
					valList.splice(i, 1);
				else
					prevVal = valList[i];
			}

			// Don't create a filter if no values
			if (valList.length == 0)
				continue;

			var filterValList = [];
			for (var i = 0; i < valList.length; i++) {
				filterValList.push(new Filter({
					path: dimField,
					operator: sap.ui.model.FilterOperator.EQ,
					value1: valList[i]
				}));
			}

			// create the OR filter on this dimension
			filter.aFilters.push(new sap.ui.model.Filter({
				aFilters: filterValList,
				and: false
			}));
		}

		return filter;
	};

	SmartVisualFilterBar.prototype._updateSelectedIndicator = function() {
		var itemList = this.getItems();
		var rb = this.getModel("i18n").getResourceBundle();
		for (var i = 0; i < itemList.length; i++) {
			var filterItem = itemList[i].getSouth().getContent();

			var dimFilterList = filterItem.getDimensionFilter();
			var filterCount = dimFilterList ? dimFilterList.length : 0;

			var selectedBtn = itemList[i].getNorth().getContent().getContent()[2];

			selectedBtn.setVisible(filterCount > 0);
			selectedBtn.setText(rb.getText("VISUAL_FILTER_SELECTED_FILTERS", [filterCount]));
		}
	};

	SmartVisualFilterBar.prototype._createTitleToolbar = function(props, filterItem) {
		var title = new Label({
			text: {
				path: "i18n>VIS_FILTER_TITLE_MD",
				formatter: function() {
					return filterItem.getTitle();
				}
			}
		});

		var selectedBtn = new Link({
			text: "",
			visible: false,
			press: function(ev) {
				VisualFilterDialogController.launchAllFiltersPopup(selectedBtn, filterItem, ev.getSource().getModel('i18n'));
			},
			layoutData: new sap.m.ToolbarLayoutData({
				shrinkable: false
			})
		});

		var toolbar = new OverflowToolbar({
			design: sap.m.ToolbarDesign.Transparent,
			width: this.cellWidth + "px",
			content: [
				title,
				new ToolbarSpacer(),
				selectedBtn
			]
		});

		toolbar.addStyleClass("alr_visualFilterTitleToolbar");

		return toolbar;
	};

	SmartVisualFilterBar.prototype.getTitleByFilterItemConfig = function(filterConfig, unitValue, scaleValue) { // used when the filter item + data is not present, ideally called on the filter item iteslf
		var props = filterConfig.component.properties;
		var entitySet = props.entitySet;
		var model = this.getModel();

		if (!model)
			return "";

		var basePath = "/" + entitySet + "/";
		var measureLabel = model.getData(basePath + props.measureField + "/#@sap:label");
		var dimLabel = model.getData(basePath + props.dimensionField + "/#@sap:label");

		// Get the Unit
		if (!unitValue)
			unitValue = "";

		// Get the Scale factor
		if (!scaleValue)
			 scaleValue = "";

		var titleText = "";
		var rb = this.getModel("i18n").getResourceBundle();
		if (scaleValue && unitValue)
			titleText = rb.getText("VIS_FILTER_TITLE_MD_UNIT_CURR", [measureLabel, dimLabel, scaleValue, unitValue]);
		else if (unitValue)
			titleText = rb.getText("VIS_FILTER_TITLE_MD_UNIT", [measureLabel, dimLabel, unitValue]);
		else if (scaleValue)
			titleText = rb.getText("VIS_FILTER_TITLE_MD_UNIT", [measureLabel, dimLabel, scaleValue]);
		else
			titleText = rb.getText("VIS_FILTER_TITLE_MD", [measureLabel, dimLabel]);

		return titleText;
	};

	SmartVisualFilterBar.prototype._onTitleChange = function(ev) {
		var source = ev.getSource();

		var itemList = this.getItems();
		for (var i = 0; i < itemList.length; i++) {
			var item = itemList[i];

			var filterItem = item.getSouth().getContent();
			if (filterItem == source) {
				var labelItem = item.getNorth().getContent().getContent()[0];
				labelItem.setText(filterItem.getTitle());
				labelItem.setTooltip(filterItem.getTitle());
				break;
			}
		}
	};

	SmartVisualFilterBar.prototype._getSupportedFilterItemList = function() {
		// predefined set of controls, order preserved
		if (!this._supportedFilterItemList) {
			this._supportedFilterItemList = [{
					type: "Bar",
					className: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemChartBar",
					iconLink: "sap-icon://horizontal-bar-chart",
					textKey: "VISUAL_FILTER_CHART_TYPE_BAR"
				}, {
					type: "Donut",
					className: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemChartDonut",
					iconLink: "sap-icon://donut-chart",
					textKey: "VISUAL_FILTER_CHART_TYPE_Donut"
				}, {
					type: "Line",
					className: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemChartLine",
					iconLink: "sap-icon://line-charts",
					textKey: "VISUAL_FILTER_CHART_TYPE_Line"
				}
			];
		}

		return this._supportedFilterItemList;
	};

	SmartVisualFilterBar.prototype._getSupportedFilterItemMap = function() {
		if (!this._supportedFilterItemMap) {
			this._supportedFilterItemMap = {};

			var compList = this._getSupportedFilterItemList();
			for (var i = 0; i < compList.length; i++) {
				var comp = compList[i];
				this._supportedFilterItemMap[comp.type] = comp;
			}
		}

		return this._supportedFilterItemMap;
	};

	// Will be called after all annotations + variants + application settings have been combined, will create the visual filters
	SmartVisualFilterBar.prototype.setConfig = function(config) {
		var lastConfig = this.getProperty("config");
		this.setProperty("config", config);

		this.removeAllItems();

		if (!config.filterCompList) {
			jQuery.sap.log.warning("Expecting a filterCompList as part of the configuration");
			return;
		}

		var dimMap = this._getDimensionMap();

		var filterItemList = [];
		for (var i = 0; i < config.filterCompList.length; i++) {
			var cellConfig = config.filterCompList[i];
			if (!cellConfig.shownInFilterBar) // check if should be rendered in the filterbar, or only shown in the dialog
				continue;

			var compConfig = cellConfig.component;
			compConfig.type = this._resolveChartType(compConfig.type);

			// Setup the properties
			var properties = jQuery.extend({}, compConfig.properties); // make a copy so changes can be made

			// Dealing with DateTime some charts require a different chart or axis type
			var dimField = dimMap[properties.entitySet][properties.dimensionField];
			properties.dimensionFieldIsDateTime = dimField ? dimField.fieldInfo.type == "Edm.DateTime" : false;

			// Component initialization
			var compInst = this._createFilterItemOfType(compConfig.type, properties);
			compInst.setModel(this.getModel());

			// Attach events
			if (compInst.attachFilterChange)
				compInst.attachFilterChange(this._onFilterChange, this);

			if (compInst.attachTitleChange)
				compInst.attachTitleChange(this._onTitleChange, this);

			// Label initialization, part of the title is derived from the component properties
			var toolbar = this._createTitleToolbar(properties, compInst);

			// Add the label and component to the Header cell
			var cell = new HeaderCell({
				height: cellConfig.cellHeight,
				north: new HeaderCellItem({
					height: this.labelHeight + "rem",
					content: toolbar
				}),
				south: new HeaderCellItem({
					height: compConfig.cellHeight,
					content: compInst
				})
			});

			filterItemList.push(compInst);

			this.addItem(cell);
		}

		this._updateFilterItemList(filterItemList);

		if (lastConfig)
			this.fireFilterChange();
	};

	SmartVisualFilterBar.prototype._resolveChartType = function(type) {
		var compMap = this._getSupportedFilterItemMap();

		var compInfo = compMap[type];
		if (!compInfo) {
			var aType;
			for (aType in compMap) {
				compInfo = compMap[aType];
				break;
			}

			jQuery.sap.log.error("Could not resolve the filter component type: \"" + type + "\", falling back to " + aType);
			type = aType;
		}

		return type;
	};

	SmartVisualFilterBar.prototype._createFilterItemOfType = function(type, properties) {
		var compMap = this._getSupportedFilterItemMap();
		var compInfo = compMap[type];

		var className = compInfo.className;

		jQuery.sap.require(className);
		var compClass = jQuery.sap.getObject(className);

		var compInst = new compClass(properties); // Instantiate and apply properties
		return compInst;
	};

	SmartVisualFilterBar.prototype.getConfig = function() {
		var config = this.getProperty("config"),
			outParameter;

		if (!config)
			return {filterCompList: []};

		var itemIndex = 0;
		var itemList = this.getItems();
		for (var i = 0; i < config.filterCompList.length; i++) {
			var compConfig = config.filterCompList[i];
			if (!compConfig.shownInFilterBar) // If not shown, then no changes to collect, so go to the next
				continue;

			// there will be a corresponding UI entry, ask for the latest configuration from each
			var item = itemList[itemIndex];
			if (!item) {
				jQuery.sap.log.error("The configured selected filter bar items do not correspond to the actual filter bar items.  Could be an error during initialization, e.g. a chart class not found");
				return {filterCompList: []};
			}

			itemIndex++;

			var compInst = item.getSouth().getContent();

			outParameter = compConfig.component.properties.outParameter;
			compConfig.component.properties = compInst.getP13NConfig();
			compConfig.component.properties.outParameter = outParameter;
		}

		return config;
	};

	/////////////////////
	// Variant handling
	/////////////////////
	SmartVisualFilterBar.prototype.setSmartVariant = function(oSmartVariantId) {
		this.setAssociation("smartVariant", oSmartVariantId);

		if (oSmartVariantId) {
	        var oPersInfo = new PersonalizableInfo({
	            type: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",
	            keyName: "persistencyKey"
	        });
			oPersInfo.setControl(this);
		}

		this._oVariantManagement = this._getVariantManagementControl(oSmartVariantId);
		if (this._oVariantManagement) {
			this._oVariantManagement.addPersonalizableControl(oPersInfo);
			this._oVariantManagement.initialise(this._variantInitialised, this);
			this._oVariantManagement.attachSave(this._onVariantSave, this);
		}
		else if (oSmartVariantId) {
			if (typeof oSmartVariantId === "string")
				jQuery.sap.log.error("Variant with id=" + oSmartVariantId + " cannot be found");
			else if (oSmartVariantId instanceof sap.ui.core.Control)
				jQuery.sap.log.error("Variant with id=" + oSmartVariantId.getId() + " cannot be found");
		}
		else {
			jQuery.sap.log.error("Missing SmartVariant");
		}
	};

	SmartVisualFilterBar.prototype._getVariantManagementControl = function(oSmartVariantId) {
		var oSmartVariantControl = null;
		if (oSmartVariantId) {
			oSmartVariantControl = typeof oSmartVariantId == "string" ? sap.ui.getCore().byId(oSmartVariantId) : oSmartVariantId;

			if (oSmartVariantControl && !(oSmartVariantControl instanceof SmartVariantManagement)) {
				jQuery.sap.log.error("Control with the id=" + oSmartVariantId.getId ? oSmartVariantId.getId() : oSmartVariantId + " not of expected type");
				return null;
			}
		}

		return oSmartVariantControl;
	};

	SmartVisualFilterBar.prototype._variantInitialised = function() {
		if (!this._oCurrentVariant)
			this._oCurrentVariant = "STANDARD";
	};

	SmartVisualFilterBar.prototype._onVariantSave = function() {
		if (this._oCurrentVariant == "STANDARD") // changes were made, so get the current configuration
			this._oCurrentVariant = {
				config: this.getConfig(),
				hiddenFilters: this._hiddenFilters,
				compactFilters: this._compactFilters
			};
	};


	SmartVisualFilterBar.prototype.applyVariant = function(oVariantJSON, sContext) {
		this._oCurrentVariant = oVariantJSON;
		if (this._oCurrentVariant == "STANDARD")
			this._oCurrentVariant = null;

		if (this._oCurrentVariant && this._oCurrentVariant.config == null) { // then STANDARD, but STANDARD variant was requested before annotations were ready
			var annoSettings = this._getAnnotationSettings();
			if (annoSettings && annoSettings.filterList) {
				this._oCurrentVariant.config = this._convertSettingsToConfig(annoSettings);
			}
		}

		this._updateFilterBar();

		//Need to unmark the dirty flag because this is framework
		//applying the variant and firing filter to update table/chart
		if (this._oVariantManagement) {
			this._oVariantManagement.currentVariantSetModified(false);
		}
	};

	SmartVisualFilterBar.prototype._getVariantConfig = function() {
		return this._oCurrentVariant;
	};

	SmartVisualFilterBar.prototype.fetchVariant = function() {
		if (!this._oCurrentVariant || this._oCurrentVariant == "STANDARD") {
			var annoSettings = this._getAnnotationSettings();
			if (annoSettings && annoSettings.filterList) {
				this._oCurrentVariant = {
					config: this._convertSettingsToConfig(annoSettings),
					hiddenFilters: this._hiddenFilters,
					compactFilters: this._compactFilters
				};
				return this._oCurrentVariant;
			}
			else {
				return {
					config: null,
					hiddenFilters: this._hiddenFilters,
					compactFilters: this._compactFilters
				};
			}
		}

		return {
			config: this.getConfig(),
			hiddenFilters: this._hiddenFilters,
			compactFilters: this._compactFilters
		};
	};

	//Equivalent of clear filters in compact filter
	SmartVisualFilterBar.prototype.clearFilters = function(){
		//var config = this.getConfig();
		var config = this.getProperty('config');
		for (var i = 0; i < config.filterCompList.length; i++){
			var filterItem = config.filterCompList[i];
			filterItem.component.properties.dimensionFilter = [];
		}
		this.setConfig(config);
		this.fireFilterChange();
	};

	/**
	* Generates filter data for compact filter by replacing/appending filters
	* to already existing compact single-vaule/multi-value compact filters
	*
	* @returns {object} json object to set compact filters
	*/
	SmartVisualFilterBar.prototype.getFilterDataForCompactFilter = function (){
		var oConfig = this.getConfig(),
			oCompactFilters,
			aFilterItemList = (oConfig.filterCompList.length) ? oConfig.filterCompList : [];
		if (aFilterItemList.length) {
			for (var i = 0; i < aFilterItemList.length; i++) {
				var oFilterItem = aFilterItemList[i],
					oProperties = oFilterItem.component.properties,
					aFilterList = oProperties.dimensionFilter,
					sParentProperty = oProperties.parentProperty,
					filterRestriction = oProperties.filterRestriction,
					userTypedInValue,
					userTypedInValueExists = false;
				// if compact filters do not exist
				// then create new object
				if (!this._compactFilters[sParentProperty]) {
					if (filterRestriction === 'single-value') { // single-value
						this._compactFilters[sParentProperty] = "";								  
					} else { // multi-value
						this._compactFilters[sParentProperty] = {};
					}
				} else {
					// if compact filter exists
					// then only items should be reset for multi-value, and
					// key value pair should reset for single-value
					if (filterRestriction !== 'single-value') { // multi-value
						this._compactFilters[sParentProperty].items = [];
						userTypedInValue = this._compactFilters[sParentProperty].value;
					} else { // single-value
						this._compactFilters[sParentProperty] = "";
					}
				}
				if (aFilterList && aFilterList.length) {
					// since single-value is a string and not an object
					// hence ignoring for single-value
					if (filterRestriction !== 'single-value' && !this._compactFilters[sParentProperty].items) {
						this._compactFilters[sParentProperty].items = [];
					}
					for (var j = 0 ; j < aFilterList.length; j++) {
						var oFilter = aFilterList[j],
						sKey = oFilter.dimValue,
						sText = FilterUtil.createTitle(oFilter.dimValueDisplay, oFilter.dimValue);
						if (filterRestriction === 'single-value') { // single-value
							this._compactFilters[sParentProperty] = sKey;							
						} else { // multi-value
							// if user typed-in value in also in filter list
							// we ignore it
							if (userTypedInValue === sText) {
								userTypedInValueExists = true;
							} else {
								this._compactFilters[sParentProperty].items.push({
									key: sKey,
									text: sText
								});
							}
						}
					}
				}
				// if there is no user typed in value set it to null
				// single value is a string and not an object
				if (filterRestriction !== 'single-value' && !userTypedInValueExists) {
					this._compactFilters[sParentProperty].value = null;
				}
			}
		}
		// reset hidden and compact filters so that it does not interfere with variant management
		oCompactFilters = jQuery.extend(true, {}, this._compactFilters);
		this._compactFilters = {};
		this._hiddenFilters = {};
		return oCompactFilters;
	};
	/**
	 * Takes fitler data from compact filter and updates config for visual filter items
	 * Also triggers changes to other visual filter items and main content area.
	 *  
	 * @param {object} compactpactFilters - compact filter data to be merged with visual filter
	 * @returns {void}
	 */
	SmartVisualFilterBar.prototype.mergeCompactFilters = function(compactFilters){
		this._compactFilters = {};
		this._hiddenFilters = {};
		this._globalFilters = {};
		//this.clearFilters();
		if (!compactFilters) {
			return;
		}
		this._compactFilters = compactFilters;
		var aCompactFilterKeys = Object.keys(this._compactFilters),
			aAllFilterConfig,
			oDimensionFilterByParentProp = {},
			aPropertiesMergedFromCompact = [];

		var oConfig = this.getConfig();

		// check if config exists
		if (oConfig && oConfig.filterCompList.length > 0) {
			aAllFilterConfig = oConfig.filterCompList;

			for (var i = 0; i < aAllFilterConfig.length; i++) {
				var oFilterItemProps = aAllFilterConfig[i].component.properties,
					sOutParameter = oFilterItemProps.outParameter,
					sParentProperty = oFilterItemProps.parentProperty,
					aDimFilterList = [];

				// clearing all filters
				oFilterItemProps.dimensionFilter = [];

				if (sOutParameter) {
					var aDimFilterList = [];

					// check compact filters for out parameter
					// because out parameter is responsible for interaction between
					// visual filter and main area
					if (this._compactFilters[sOutParameter]) {
						aPropertiesMergedFromCompact.push(sOutParameter);
						aDimFilterList = this._addToFiltersFromCompact(sOutParameter);
					}
				}

				oFilterItemProps.dimensionFilter = aDimFilterList;

				oDimensionFilterByParentProp[sParentProperty] = aDimFilterList;
			}
		}


		this._createHiddenFilters(aCompactFilterKeys, aPropertiesMergedFromCompact);

		this._updateFilterItemListOnMerge(aAllFilterConfig);

		// fire internal change event to other charts
		//this._updateFilterItemList(filterItemList);

		// Fire the external filter change event
		this.fireFilterChange();
	};

	/**
	 * @private
	 * Sets hidden filters to be shown in the visual filter dialog
	 *  
	 * @param {array} aCompactFilterKeys - array of all keys in compact filter
	 * @param {array} aExcludeProperties - properties to be exluded while forming hidden filters
	 * @returns {void}
	 */
	SmartVisualFilterBar.prototype._createHiddenFilters = function (aCompactFilterKeys, aExcludeProperties) {
			this._hiddenFilters = {};

			if (!aCompactFilterKeys || aCompactFilterKeys.length === 0) {
				return;
			}

			// consider hidden filters coming from compact filter
			for (var i = 0; i < aCompactFilterKeys.length; i++) {
				var sProperty = aCompactFilterKeys[i],
					aFilters = [];

				if (aExcludeProperties.indexOf(sProperty) === -1) {
					// ignore _CUSTOM filters, visual filter does not support _CUSTOM filters
					if (sProperty !== '_CUSTOM') {
						aFilters = this._addToFiltersFromCompact(sProperty);
						if (aFilters.length > 0) {
							this._hiddenFilters[sProperty] = aFilters;
						}
					}
				}
				// consider only non merged properties of compact filter

			}
	};

	/**
	 * @private
	 * creates filters from compact filter data
	 *  
	 * @param {string} sProperty - property from compact filter data to be added to filter
	 * @returns {array} array of filters for one property with key and display value
	 */
	SmartVisualFilterBar.prototype._addToFiltersFromCompact = function (sProperty) {
		var aFilters = [],
			aFilterValues = this._compactFilters[sProperty].items;
			
		if (aFilterValues) { // for sap:filter-restriction="multi-value"
			for (var j = 0; j < aFilterValues.length; j++) {
				//filterByDim[property].push(filterValues[j].key);
				aFilters.push({
					dimValue: aFilterValues[j].key,
					dimValueDisplay: aFilterValues[j].text
				});
			}

			if (this._compactFilters[sProperty].value) { // if user typed in value
				aFilters.push({
					dimValue: this._compactFilters[sProperty].value,
					dimValueDisplay: this._compactFilters[sProperty].value
				});
			}// The below check is to add all type of filters other than the object and undefined ones to the  filter dialog from Compact filter
		} else if (this._compactFilters[sProperty] && (typeof this._compactFilters[sProperty] !== 'object')) { // for sap:filter-restriction="single-value"
			//filterByDim[property].push(this._compactFilters[property]);
			aFilters.push({
				dimValue: this._compactFilters[sProperty],
				dimValueDisplay: this._compactFilters[sProperty]
			});
		}
		return aFilters;
	};

	//TODO: VFB - snapping header text
	/**
	 * This function create a label from filter items, to be displayed when we hide the visual filter.
	 * @return {string} the filter text, to be displayed when we hide the visual filter.
	 */
	SmartVisualFilterBar.prototype.retrieveFiltersWithValuesAsText = function(){
		var filterText, _filterTexts = [], filterList = this.getFilters();
		var i18nModel = this.getModel('i18n');
		//Sometime the call is too early and doesnt wait for i18n model to be present
		if (!i18nModel) {
			return;
		}

		var rb = this.getModel('i18n').getResourceBundle();

		if (!filterList || filterList.length === 0) {
			filterText = rb.getText("FILTER_BAR_ASSIGNED_FILTERS_ZERO");
		} else {
			var filterItems = this.getItems();
			for (var i = 0; i < filterItems.length; i++) {
				var filterItem = filterItems[i].getSouth().getContent();
				var isFilterPresent = (filterItem.getDimensionFilter() !== undefined && filterItem.getDimensionFilter().length  !== 0) ? true : false;
				if (isFilterPresent) {
					_filterTexts.push(filterItem.getTitle());
				}
			}
			if (this._hiddenFilters) {
				for (var key in this._hiddenFilters) {
					_filterTexts.push(key);
				}
			}
			filterText = rb.getText("FILTER_BAR_ASSIGNED_FILTERS", [_filterTexts.length, _filterTexts.join(", ")]);
		}
		return filterText;
	};


	////////////////////////////////////////////////////////////////////////////////////////////
	// Equivalent of the SmartFilterBar methods for interfacing with the SmartTable/SmartChart
	////////////////////////////////////////////////////////////////////////////////////////////
	SmartVisualFilterBar.prototype.getFilters = function() {
		var config = this.getConfig();

		if (!config && !config.filterCompList)
			return [];

		var filterItemList = [];
		for (var i = 0; i < config.filterCompList.length; i++) {
			var compProps = config.filterCompList[i].component.properties;
			if (!compProps.dimensionFilter || compProps.dimensionFilter.length == 0)
				continue;

			// Get filterList by filterItem

			if (compProps.outParameter !== undefined) {
				filterItemList.push({
					dimensionField: compProps.outParameter,
					filterList: compProps.dimensionFilter
				});
			}
			/*
				filterItemList.push({
					dimensionField: compProps.dimensionField,
					filterList: compProps.dimensionFilter
				});
			*/
		}

		// consider hidden filters
		var filterList = [];
		if (Object.keys(this._hiddenFilters).length > 0) {
			for (var key in this._hiddenFilters) {

				// ignore all Parameter property while creating filter query
				if (key.indexOf('$Parameter') < 0) {
					var hiddenProp = this._hiddenFilters[key];

					for (var k = 0 ; k < hiddenProp.length ; k++) {
						filterList.push(hiddenProp[k]);
					}

					filterItemList.push({
						dimensionField: key,
						filterList: filterList
					});
				}
			}
		}

		var filter = this._combineFilterLists(filterItemList, -1); // join the filters without any exclusion (-1)

		return (filter && filter.aFilters && filter.aFilters.length > 0) ? [filter] : [];
	};

	SmartVisualFilterBar.prototype.getFilterData = function() {
		var filter = this.getFilters();

		var metadataAnalyser 	= new MetadataAnalyser(this.getModel());
		var fullEntityTypeName	= metadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet());
		var metaModel 			= this.getModel().getMetaModel();		
		var entityDef			= metaModel.getODataEntityType(fullEntityTypeName);

		// convert from the sap.ui.model.Filter class to generic objects referencing the SmartFilterBar's lead
		if (filter.length == 0)
			return {};

		filter = filter[0]; // The filter is wrapped in an array, always length 1
		var data = {};
		for (var i = 0; i < filter.aFilters.length; i++) {
			var dimFilterList = filter.aFilters[i].aFilters;

			var rangeList = [];

			var dimFilter = dimFilterList[0];
			data[dimFilter.sPath] = {ranges: rangeList};

			var property = metaModel.getODataProperty(entityDef, dimFilter.sPath);
			var isDateTime = property.type == "Edm.DateTime";

			for (var j = 0; j < dimFilterList.length; j++) {
				var dimFilter = dimFilterList[j];

				var value1 = dimFilter.oValue1;
				if (isDateTime) {
					value1 = new Date(dimFilter.oValue1);
					value1 = new Date(value1.getUTCFullYear(), value1.getUTCMonth(), value1.getUTCDate());

					rangeList.push({
						exclude: false,
						keyField: dimFilter.sPath,
						operation: "EQ",
						value1: value1
					});
				}
				else {
					rangeList.push({
						exclude: false,
						keyField: dimFilter.sPath,
						operation: dimFilter.sOperator,
						value1: value1
					});
				}
			}

		}

		return data;
	};

	/**
	 * Determines the number of filter items where which filter was applied
	 *  
	 * @returns {number} count of filter items for which a filter was applied
	 */

	SmartVisualFilterBar.prototype.getFilterCount = function() {
		var count = 0,
			hiddenFiltersCount,
			config = this.getConfig();

		if (!config && !config.filterCompList)
			return count;

		for (var i = 0; i < config.filterCompList.length; i++) {
			var compFilterList = config.filterCompList[i].component.properties.dimensionFilter;
			count += compFilterList && compFilterList.length > 0 ? 1 : 0; // count is by filter item
		}

		// check if hidden filters are applied
		hiddenFiltersCount = (Object.keys(this._hiddenFilters).length > 0) ? Object.keys(this._hiddenFilters).length : 0;
		count += hiddenFiltersCount; 

		return count;
	};

	return SmartVisualFilterBar;

}, /* bExport= */true);