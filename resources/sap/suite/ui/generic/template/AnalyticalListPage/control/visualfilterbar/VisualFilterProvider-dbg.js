// -----------------------------------------------------------------------------
// Generates the data-model required for SmartFilter using SAP-Annotations metadata
// -----------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/comp/odata/MetadataAnalyser"
], function(MetadataAnalyser) {
	"use strict";

	var VisualFilterProvider = function(filter) {
		this._filter = filter;
		this._oMetadataAnalyser = new MetadataAnalyser(filter.getModel());

		this._groupList = [];
		this._groupListByName = {};
		this._groupMap = {};
		this._measureList = [];
		this._measureMap = {};
		this._dimensionMap = {};
		this._selectionFieldsLength = 0;
		this._selectionFieldsParsed = 0;
		this._annotationData = {Filters: []};
		this._recordTypeInParameter = 'com.sap.vocabularies.Common.v1.ValueListParameterIn';
		this._recordTypeOutParameter = 'com.sap.vocabularies.Common.v1.ValueListParameterOut';
		this._recordTypeInOutParameter = 'com.sap.vocabularies.Common.v1.ValueListParameterInOut';
		this._allSelectionFields;

		this._initMetadata();
	};

	VisualFilterProvider.prototype._initMetadata = function() {
		var entitySet = this._filter.getEntitySet();
		var entityNameFull = this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(entitySet);

		this._getFieldAnnotations(entitySet, entityNameFull);

		this._getVisualFilterAnnotation(entityNameFull);
	};

	VisualFilterProvider.prototype.getVisualFilterConfig = function() {
		return this._filterConfig;
	};

	// Group Related
	VisualFilterProvider.prototype._getFieldAnnotations = function(entitySet, entityNameFull) {
		if (!entitySet)
			return;

		var entityType = this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(entitySet);
		if (!entityType)
			return;

		var model = this._filter.getModel();
		var metaModel = model.getMetaModel();
		if (!entityNameFull || !metaModel)
			return;

		// Go through the field group list and build up the group map
		var groupMapByField = {};
		var groupByName = {};

		var fieldGroupList = this._oMetadataAnalyser.getFieldGroupAnnotation(entityType);
		for (var i = 0; i < fieldGroupList.length; i++) {
			var fieldGroup = fieldGroupList[i];

			var group = {
				name: fieldGroup.groupName,
				label: fieldGroup.groupLabel,
				fieldList: fieldGroup.fields
			};

			groupByName[group.name] = group;

			for (var j = 0; j < fieldGroup.fields.length; j++)
				groupMapByField[fieldGroup.fields[j]] = group;
		}


		// Get all the selection fields, if selected and not part of a group, then in the _BASIC group
		var entityDef = metaModel.getODataEntityType(entityNameFull);
		var selFieldList = entityDef["com.sap.vocabularies.UI.v1.SelectionFields"];
		var selFieldMap = {};
		if (selFieldList) {
			for (var i = 0; i < selFieldList.length; i++) {
				var selField = selFieldList[i];
				selFieldMap[selField.PropertyPath] = selField;
			}
		}

		// Go through all the fields, check if they are dimensions or measures and add them to the groups for later sorting
		var measureList = [];
		//var measureMap = {};
		//var dimensionMap = {};
		
		var usedGroupsByName = {};
		//var entityTypeName = this._oMetadataAnalyser.removeNamespace(entityType);
		var fieldList = this._oMetadataAnalyser.getFieldsByEntityTypeName(entityType);
		for (var i = 0; i < fieldList.length; i++) {
			var field = fieldList[i];
			var name = field.name;

			var prop = metaModel.getODataProperty(entityDef, name);
			var role = prop["sap:aggregation-role"];

			if (role == "dimension") { // only add dimensions to the possible groups
				var dim = { // Dimension definition
					name: name,
					fieldInfo: field,
					propInfo: prop
				};

				// Add to group for ordering purposes, e.g. in the dialog and display order in the filterbar
				var group = groupMapByField[name];

				if (group) {
					// if the field is stored as a string, replace it with the dim structure
					for (var j = 0; j < group.fieldList.length; j++) {
						if (group.fieldList[j] == name) {
							group.fieldList[j] = dim;
							break;
						}
					}
				} else {
					var groupName = selFieldMap[name] ? "_BASIC" : (entityDef['sap:label'] || entityDef.name); // _BASIC is the standard used by the smart filter bar

					var group = groupByName[groupName];
					if (!group) { // if no group, then either use the _BASIC (if field in the selection list) or fallback EntityType.
						group = {
							name: groupName,
							label: groupName == "_BASIC" ? this._filter.getModel("i18n").getResourceBundle().getText("VIS_FILTER_GRP_BASIC_TITLE") : groupName,
							fieldList: []
						};

						groupByName[groupName] = group;
					}

					group.fieldList.push(dim);
					groupMapByField[name] = group;
				}

				usedGroupsByName[group.name] = true;

				//dimensionMap[name] = dim;
			}
			else if (role == "measure") {
				var measure = {
					name: name,
					label: field.fieldLabel,
					fieldInfo: field,
					propInfo: prop
				};
				
				measureList.push(measure);
				
				//measureMap[name] = measure;
			}
		}

		// Reorder the fields by the group list
		var groupList = [];
		if (usedGroupsByName["_BASIC"]) { // Make sure _BASIC is always first
			groupList.push(groupByName["_BASIC"]);
			delete groupByName["_BASIC"];
		}

		// Preferred order based on group list  Will need to check once getting group information from annotation
		for (var i = 0; i < fieldGroupList.length; i++) {
			var groupName = fieldGroupList[i].groupName;

			if (groupName == "_BASIC") // already accounted for
				continue;
				
			if (usedGroupsByName[groupName])
				groupList.push(groupByName[groupName]);

			delete groupByName[groupName];
		}

		// Now add the remaining, e.g. the entity type
		for (var groupName in groupByName) {
			if (usedGroupsByName[groupName])
				groupList.push(groupByName[groupName]);

			delete groupByName[groupName];
		}

		// Rebuild the group by name based on the used groupNames
		groupByName = {};
		for (var i = 0; i < groupList.length; i++) {
			var group = groupList[i];
			groupByName[group.name] = group;
		}

		//this._groupList = groupList;
		//this._groupMap = groupByName;
		this._measureList = measureList;
		//this._measureMap = measureMap;
		//this._dimensionMap = dimensionMap;
	};

	VisualFilterProvider.prototype.getGroupList = function() {
		return this._groupList ? this._groupList : [];
	};

	VisualFilterProvider.prototype.getGroupMap = function() {
		return this._groupMap ? this._groupMap : {};
	};

	VisualFilterProvider.prototype.getMeasureList = function() {
		return this._measureList;
	};

	VisualFilterProvider.prototype.getMeasureMap = function() {
		return this._measureMap;
	};

	VisualFilterProvider.prototype.getDimensionMap = function() {
		return this._dimensionMap;
	};

	VisualFilterProvider.prototype.getEntityType = function(entitySet) {
		return this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(entitySet);
	};

	VisualFilterProvider.prototype._updateGroupList = function(entityFullName, entityTypePath, parentProperty, dimension) {
		var isPartOfSelectionFields = function (element) {
			return element.PropertyPath === parentProperty;
		};
		var isPartOfSelectionField = this._allSelectionFields.filter(isPartOfSelectionFields);
		isPartOfSelectionField = (isPartOfSelectionField.length > 0) ? true : false;	

		var metaModel = this._filter.getModel().getMetaModel();
		var mainEntityType = metaModel.getODataEntityType(entityFullName);
			mainEntityType = mainEntityType['sap:label'] ? mainEntityType['sap:label'] : mainEntityType.name;

		var updateGroup = function (groupName, context) {
			for (var key in context._groupList) {
				var group = context._groupList[key],
					dimExistsInGroup = false;

				if (group.name === groupName) {
					var fieldList = group.fieldList;
					for (var fieldKey in fieldList) {
						if (fieldList[fieldKey].name === dimension) {
							dimExistsInGroup = true;
						} else {
							continue;
						}
					}

					if (!dimExistsInGroup) {

						var entityType = metaModel.getODataEntityType(entityTypePath);
						var allProps = context._oMetadataAnalyser.getFieldsByEntityTypeName(entityTypePath);

						for (var key in allProps) {

							if (allProps[key].name === dimension) {
								var prop = metaModel.getODataProperty(entityType, allProps[key].name);

								fieldList.push({ // Dimension definition
									name: allProps[key].name,
									fieldInfo: allProps[key],
									propInfo: prop
								});
								//dimMap[allProps[key].name] = dim;
								//dimMap[allProps[key].name] = dim;
							}
						}

						/*fieldList.push({
							name: dimension
						});*/
					}
				} else {
					continue;
				}
			}			
		};

		// TODO: need to take care of field group
		if (isPartOfSelectionField) {
			updateGroup('_BASIC', this);
		} else {
			updateGroup(mainEntityType, this);	
		}

	};

	VisualFilterProvider.prototype._createDimensionMap = function(entitySet, entityTypePath) {
		//if (!this._dimensionMap[entitySet]) {
			var allProps,
				model = this._filter.getModel(),
				metaModel = model.getMetaModel(),
				entityType,
				dimMap = {},
				prop,
				dim,
				measure,
				measureMap = {};

			if (!metaModel)
				return false;

			entityType = metaModel.getODataEntityType(entityTypePath);
			allProps = this._oMetadataAnalyser.getFieldsByEntityTypeName(entityTypePath);

			for (var key in allProps) {

				prop = metaModel.getODataProperty(entityType, allProps[key].name);
				if (allProps[key]['aggregationRole'] === 'dimension') {

					dim = { // Dimension definition
						name: allProps[key].name,
						fieldInfo: allProps[key],
						propInfo: prop
					};
					dimMap[allProps[key].name] = dim;
					//dimMap[allProps[key].name] = dim;
				} else if (allProps[key]['aggregationRole'] === 'measure') {
					measure = {
						name: allProps[key].name,
						label: allProps[key].fieldLabel,
						fieldInfo: allProps[key],
						propInfo: prop
					};
					measureMap[allProps[key].name] = measure;
				}
			}



			if (Object.keys(dimMap).length > 0) {
				this._dimensionMap[entitySet] = dimMap;
			}

			if (Object.keys(measureMap).length > 0) {
				this._measureMap[entitySet] = measureMap;
			}
		/*} else {
			return false;
		}*/
	};

	VisualFilterProvider.prototype._createGroupList = function(fieldInfo, propInfo, isBasic, entityGroupName) {

		var groupLabel;
		// if property is part of seelction fields then it should be in BASIC group
		if (isBasic) {
			groupLabel = this._filter.getModel("i18n").getResourceBundle().getText("VIS_FILTER_GRP_BASIC_TITLE");
			this._addToGroupListByName('_BASIC', groupLabel, fieldInfo, propInfo);
		} else {
			// TODO: Take care of Field Group as well. Field Group has to be added to the group
			groupLabel = entityGroupName;
			this._addToGroupListByName(entityGroupName, groupLabel, fieldInfo, propInfo);
		}

	};

	VisualFilterProvider.prototype._addToGroupListByName = function (groupName, groupLabel, fieldInfo, propInfo) {
		if (this._groupListByName[groupName] === undefined) {
			this._groupListByName[groupName] = [];
			this._groupListByName[groupName].push({
				name: groupName,
				label: groupLabel,//
				fieldList: []
			});

			this._groupListByName[groupName][0].fieldList.push({
				name: fieldInfo.name,
				fieldInfo: fieldInfo,
				propInfo: propInfo
			});
		} else {
			this._groupListByName[groupName][0].fieldList.push({
				name: fieldInfo.name,
				fieldInfo: fieldInfo,
				propInfo: propInfo
			});				
		}
	};

	/**
	 * @private
	 * This function sets the field groups to be displayed in the visual filter dialog
	 * @param  {string} sEntityGroupName - entity type name
	 * @return {void}
	 */
	VisualFilterProvider.prototype._setGroupListForDialog = function(sEntityGroupName) {
		// check if basic exists or not
		if (this._groupListByName['_BASIC'] !== undefined) {
			// Basic is first in order
			//[0] has been hardcoded to create object hierarchy that can be used to access
			//the list of the fields under basic group, the group label and group name
			this._groupList.push(this._groupListByName['_BASIC'][0]);
			delete this._groupListByName['_BASIC'];
		}

		// check if any groups exists or not
		if (Object.keys(this._groupListByName).length > 0) {
			//properties grouped under entity type are held in aProps
			var aProps = [];
			for (var key in this._groupListByName) {
				if (key != sEntityGroupName) {
					this._groupList.push(this._groupListByName[key][0]);
				} else {
					//variable prop holds each property that is grouped under the entity type
					aProps.push(key);
				}
			}
			//push the properties under entity type after the field groups
			aProps.forEach(function(val) {
				this._groupList.push(this._groupListByName[val][0]);
			}.bind(this));
		}
		var groupByName = {};
		for (var i = 0; i < this._groupList.length; i++) {
			var group = this._groupList[i];
			groupByName[group.name] = group;
		}

		this._groupMap = groupByName;
	};

	/**
	* @private
	* This function checks if the current property that is being iterated over (currentPropName in 
	* _getVisualFilterAnnotation function) is part of the fieldgroup in annotation
	* @param {object} oEntityType - entity type object referred to in the annotation
	* @param {string} sCurrentPropName - current property being considered
	* @return {string} sFieldLabel if current property is part of field group
	**/
	VisualFilterProvider.prototype._getFieldGroupForProperty = function(oEntityType,sCurrentPropName){
		var sFieldLabel;
		//obtain each property object in entity type object
		for (var oObj in oEntityType) {
			sFieldLabel = null;
			//check if property has a field group defined in annotation
			if (oObj.indexOf("com.sap.vocabularies.UI.v1.FieldGroup") > -1) {
				sFieldLabel = oObj.split("#");
				if (sFieldLabel.length === 2) {
					//obtain field group qualifier
					sFieldLabel = sFieldLabel[1];
				}
				//sFieldLabel = (oEntityType[oObj].Label && oEntityType[oObj].Label.String) ? oEntityType[oObj].Label.String : "";
				var oElem = oEntityType[oObj];
				if (oElem.Data) {
					for (var obj in oElem.Data) {
						//obtain property path under field group
						//'Data' objects have the hierarchy Value.Path
						var sfield = oElem.Data[obj].Value.Path;
						//check if the current property considered is the same as the one under field group
						if (sfield === sCurrentPropName) {
							//check if the field group has qualifier as '_Basic'
							if (sFieldLabel === '_BASIC') {
								return sFieldLabel;
							}
							//return the label of the field group
							return ((oEntityType[oObj].Label && oEntityType[oObj].Label.String) ? oEntityType[oObj].Label.String : "");
						}
					}
				}
			}
		}
		return;
	};
	/**@private
	 *This function is to obtain scale factor from annotations 
	 *@param  {object} oEntityType  entity object
	 *@param  {string} sAnnotationPath  Annotation path containing scale factor
	 *@return {string} [scale factor value]
	 */

	VisualFilterProvider.prototype._getScaleFactor = function(oEntityType,sAnnotationPath){
		//check if property has a Data point defined in annotation
		if (sAnnotationPath.indexOf("com.sap.vocabularies.UI.v1.DataPoint") > -1) {
			sAnnotationPath =  sAnnotationPath.toString();
			if (sAnnotationPath.charAt(0) === "@"){
				sAnnotationPath = sAnnotationPath.slice(1);
			}
			var oElem = oEntityType[sAnnotationPath];
			return oElem.ValueFormat.ScaleFactor.Decimal;
		}
	};
	/**
	 * @private
	 * This function read the filter annotation for visual filter and set the filter configuration
	 * @param  {string} sEntityNameFull full name of the entity
	 * @return {void}
	 */
	VisualFilterProvider.prototype._getVisualFilterAnnotation = function(sEntityNameFull) {
		var model = this._filter.getModel();
		var metaModel = model.getMetaModel();

		if (!sEntityNameFull || !metaModel)
			return null;

		var entityType = metaModel.getODataEntityType(sEntityNameFull);
		if (!entityType)
			return null;

		var allProperties = this._oMetadataAnalyser.getFieldsByEntityTypeName(sEntityNameFull),//entityType.property,
			isSelected,
			//sFieldLabel,
			sFieldLabel,
			valueList,
			currentPropName,
			bisMandatoryProp,
			pVQualifier,
			propInfo,
			entityGroupName,
			filterRestriction;
			this._allSelectionFields = entityType["com.sap.vocabularies.UI.v1.SelectionFields"];
			//entity type name 
			var sEntityName = entityType['com.sap.vocabularies.Common.v1.Label'] ? entityType['com.sap.vocabularies.Common.v1.Label'].String :
			entityType.name;
		var isPartOfSelectionFields = function (element) {
			return element.PropertyPath === currentPropName;
		};
		// find entity properties that have a valueList
		for (var key in allProperties) {
			valueList = allProperties[key]["com.sap.vocabularies.Common.v1.ValueList"];

			// only propcess properties that are filterable true (filterable is true by default)
			if ((allProperties[key]["filterRestriction"] !== "interval") && (allProperties[key]['sap:filterable'] === undefined || allProperties[key]['sap:filterable'] === "true")) {

			// find all value lists for properties
				for (var propKey in allProperties[key]) {
					if (propKey.indexOf("com.sap.vocabularies.Common.v1.ValueList") > -1) {
						valueList = allProperties[key][propKey];
						pVQualifier = valueList.PresentationVariantQualifier;


						if (currentPropName !== allProperties[key].name && valueList && pVQualifier) {
							//sPath = "/"+entitySetName+"/"+allProperties[key].name;
							currentPropName = allProperties[key].name;
							isSelected = this._allSelectionFields.filter(isPartOfSelectionFields);
							// check if property is a mandatory filter
							bisMandatoryProp = (allProperties[key]['sap:required-in-filter'] && allProperties[key]['sap:required-in-filter'] === "true");
							//get field group of the property
							sFieldLabel = this._getFieldGroupForProperty(entityType,currentPropName);
							//check if property is a selected property
							isSelected = ((isSelected.length > 0) || bisMandatoryProp || (sFieldLabel === '_BASIC'));
							propInfo = metaModel.getODataProperty(entityType, allProperties[key].name);
							//add filter restiction if exist, otherwise set it as undefined
							if (allProperties[key]["filterRestriction"]){ 
								filterRestriction = allProperties[key]["filterRestriction"];
							} else {
								filterRestriction = undefined;
							}
							//check if property is present under field group
							if (sFieldLabel) {
								entityGroupName = sFieldLabel;
							} else {
								entityGroupName = sEntityName;
							}
							this._createGroupList(allProperties[key], propInfo, isSelected, entityGroupName);
							this._getAnnotationFromValueList(sEntityNameFull, isSelected, valueList, currentPropName, filterRestriction);
						}
					}
				}
			}
		}
		this._setGroupListForDialog(sEntityName);
		this._filterConfig = this._getConfig(this._annotationData);
	};

	/* 	Success Callback for valueList promise 
		Checks if valueList and presentationVariantQaulifier exists
		then and only then add chart to the config
	*/
	VisualFilterProvider.prototype._getAnnotationFromValueList = function (entityFullName, isSelected, valueListProperties, parentProperty, filterRestriction, entityType) {
		var sPath = entityFullName;
		if (valueListProperties !== undefined) {
			//valueListProperties = valueListProperties[""] ? valueListProperties[""] : undefined;
			
			var annotationData = {Filters: []},
				presentationVariantQualifier = (valueListProperties && valueListProperties.PresentationVariantQualifier) ? valueListProperties.PresentationVariantQualifier : undefined,
				presentationVariantQualifierString = (presentationVariantQualifier && presentationVariantQualifier.String) ? presentationVariantQualifier.String : undefined,
				collectionPath = (valueListProperties && valueListProperties.CollectionPath) ? valueListProperties.CollectionPath : undefined,
				parameters = (valueListProperties && valueListProperties.Parameters) ? valueListProperties.Parameters : undefined,
				collectionPathString = (collectionPath && collectionPath.String) ? collectionPath.String : undefined,
				sPath = this.getEntityType(collectionPathString);

			if (presentationVariantQualifierString) {
				var sQualifier			 			= presentationVariantQualifierString,
					presentationVariantAnnotation 	= this._oMetadataAnalyser.getPresentationVariantAnnotation(sPath, sQualifier),
					annotationObject 				= {};

				if (presentationVariantAnnotation !== undefined) {

					this._createDimensionMap(collectionPath.String, sPath);

					var dimension = presentationVariantAnnotation.chartAnnotation.annotation.Dimensions[0].PropertyPath;

					this._updateGroupList(entityFullName, sPath, parentProperty, dimension);

					// TODO: Saurabh, below function acts as a parser bewteen here and  _getConfig()
					// maybe change logic in _getConfig() to parse presentationVariant Object and form config
					// Needs to be done
					annotationObject = this._createConsumeableObjectFromAnnotation(presentationVariantAnnotation, collectionPath, isSelected, parameters, parentProperty, filterRestriction, entityType);
					annotationData.Filters.push(annotationObject);
					this._annotationData.Filters.push(annotationObject);
				}

				// only update filter bar if annotation data is set
				/*if (annotationData.Filters.length > 0 ) {
					this._filterConfig = this._getConfig(annotationData);
					this._filter.bIsInitialised = true;
					this._filter._updateFilterBar();
				}*/
			}
		}
			
		// check if all selection fields have been parsed
		// and the annotation data is stored	
		/*if (this._selectionFieldsParsed === this._selectionFieldsLength && this._annotationData.Filters.length > 0) {

			this._filterConfig = this._getConfig(this._annotationData);
			this._filter.bIsInitialised = true;
			this._filter._updateFilterBar();
		}*/

	};
	/**
	*Function returns the order of sorting, ie. whether ascending (descending = false) or descending (descending = true)
	*params {aSortOrderFields} the SortOrder Property object from presentationVariantAnnotation
	*params {aSortOrderType} PropertyPath of the SortOrder Property
	*return {bSortOrder} Boolean value to denote either descending / ascending sort order.
	*/
	VisualFilterProvider.prototype._getDescendingFromSortOrder = function(aSortOrderFields, sSortOrderType) {
		var bSortOrder;
		aSortOrderFields.filter(function(element, index, array) {
			if (element.Property.PropertyPath == sSortOrderType) {
				// default sort order is descending true
				bSortOrder = !(element.Descending.Bool === "false");
			}
		});
		return bSortOrder;
	};
	/**
	 * @private
	 * This function check whether the field name is valid or not
	 * @param  {string} sEntityFullName full name of the entity
	 * @param  {string} sFieldName field name
	 * @return {boolean} return true if the field is valid
	 */
	VisualFilterProvider.prototype._fieldExist = function(sEntityFullName, sFieldName) {
		var fieldList = this._oMetadataAnalyser.getFieldsByEntityTypeName(sEntityFullName);
		for ( var i = 0; i < fieldList.length;i++ ) {
			if (fieldList[i].name === sFieldName) {
				return true;
			}
		}
		return false;
	};
	/**
	 * @private
	 * This function create a SortOrderObject
	 * @param  {object} oPresentationVariantAnnotation PresentationVariantAnnotation from annotation
	 * @return {object} SortOrder object with property Field and Descending
	 */
	VisualFilterProvider.prototype._createSortObject = function(oPresentationVariantAnnotation) {
		var sSortOrderType, oSortObject = {};
		if (oPresentationVariantAnnotation.chartAnnotation.chartType === "com.sap.vocabularies.UI.v1.ChartType/Line") {
			sSortOrderType = oPresentationVariantAnnotation.chartAnnotation.annotation.Dimensions[0].PropertyPath;
		}
		else {
			sSortOrderType = oPresentationVariantAnnotation.chartAnnotation.annotation.Measures[0].PropertyPath;
		}
		//To include Field and Descending  Property to sortOrder
		oSortObject.Field = {
			"String" : sSortOrderType
		};
		oSortObject.Descending = {
			"Boolean" : true
		};
		return oSortObject;
	};
	/**
	 * @private
	 * This function returns annotationObject with a new property SortOrder
	 * @param  {object} oPresentationVariantAnnotation  PresentationVariantAnnotation from annotation
	 * @param  {string} sEntityFullName  full name of entity set 
	 * @return {object} returns annotationObject with property SortOrder
	*/
	VisualFilterProvider.prototype._createSortOrderFromAnnotation = function(oPresentationVariantAnnotation, sEntityFullName) {
		var oAnnotationObject = {};
		oAnnotationObject.SortOrder = [];
		var aSortOrderFields = oPresentationVariantAnnotation.annotation.SortOrder;
		//Assuming there will be multiple sortOrders
		if (aSortOrderFields !== undefined && aSortOrderFields.length > 0) {
			for (var i = 0; i < aSortOrderFields.length; i++) {
				var sSortOrderType = aSortOrderFields[i].Property.PropertyPath;
				if (sSortOrderType) {
					var oSortObject = {};
					//To include Field and Descending  Property to sortOrder
					if (this._fieldExist(sEntityFullName, sSortOrderType)) {
						oSortObject.Field = {
							"String" : sSortOrderType
						};
						oSortObject.Descending = {
							"Boolean" : this._getDescendingFromSortOrder(aSortOrderFields, sSortOrderType)
						};
					}
					else {
						oSortObject = this._createSortObject(oPresentationVariantAnnotation);
					}
					oAnnotationObject.SortOrder.push(oSortObject);
				}
			}
		}
		else {
			oAnnotationObject.SortOrder.push(this._createSortObject(oPresentationVariantAnnotation));
		}
		return oAnnotationObject;
	};
	/*
		Function to parse new annotation format
		and create object similar to experimental annotation so that it can be consumed here.
		TODO: Saurabh, It would be good to change logic in _getConfig() to parse the presentationVariantAnnotation object
		and form the config.
	*/
	VisualFilterProvider.prototype._createConsumeableObjectFromAnnotation = function (presentationVariantAnnotation, collectionPath, isSelected, parameters, parentProperty, filterRestriction, entityType) {
		//commenting the unused variables due to the eslint issue
		//	var annotationData = {Filters: []};
		//	var allMeasureFields = presentationVariantAnnotation.chartAnnotation.mesaureFields;
		//	var allDimensionFields = presentationVariantAnnotation.chartAnnotation.dimensionFields;
		var annotationObject = {};

		var sortOrderFields = presentationVariantAnnotation.sortOrderFields;
		//To add the new propert SortOrder in annotationObject
		annotationObject = this._createSortOrderFromAnnotation(presentationVariantAnnotation, this.getEntityType(collectionPath.String));
		// TODO: Saurabh check if there is a chart then proceed
		var parts = presentationVariantAnnotation.chartAnnotation.annotation.ChartType.EnumMember.split("/");
		var chartType = parts[parts.length - 1];

		if (chartType) {
			annotationObject.Type = {
				"String": chartType
			};
		}

		var sDataPoint = presentationVariantAnnotation.chartAnnotation.annotation.DataPoint;
		//adding scaleFactor property to annotationObject
		if (sDataPoint){
			var annotationPath = sDataPoint[0].AnnotationPath;
			var scaleFactor = this._getScaleFactor(entityType,annotationPath);
			annotationObject.scaleFactor = {
				"String": scaleFactor
			};
		} else {
			annotationObject.scaleFactor = {
				"String": undefined
			};
		}
		//adding filterRestiction property to annotationObject
		if (filterRestriction){
			annotationObject.filterRestriction = {
			"String" : filterRestriction
			};
		} else {
			annotationObject.filterRestriction = {
			"String" : undefined
			};
		}

		// assuming there will be only one dimension
		var dimension = presentationVariantAnnotation.chartAnnotation.annotation.Dimensions[0].PropertyPath;

		if (dimension) {
			annotationObject.Dimensions = [];
			var dimObject = {};

			dimObject.Field = {
				"String": dimension
			};

			sortOrderFields.filter(function(element, index, array) {
				if (element.name == dimension) {
					dimObject.Descending = {
						"Boolean": element.descending
					};
				}
			});

			annotationObject.Dimensions.push(dimObject);
		}

		// assuming there will be only one measure
		var measure = presentationVariantAnnotation.chartAnnotation.annotation.Measures[0].PropertyPath;

		if (measure) {
			annotationObject.Measures = [];
			var measureObject = {};

			measureObject.Field = {
				"String": measure
			};

			var measureSortOrder = (presentationVariantAnnotation.annotation.SortOrder 
				&& presentationVariantAnnotation.annotation.SortOrder.length > 0) ? presentationVariantAnnotation.annotation.SortOrder[0] : undefined;

			if (measureSortOrder) {

				measureSortOrder = ((measureSortOrder.Descending) && (measureSortOrder.Descending.Boolean)) ? measureSortOrder.Descending.Boolean : undefined;
				
			}

			if (measureSortOrder) {
				measureObject.Descending = {
					"Boolean": measureSortOrder
				};
			} else {
				measureObject.Descending = {
					"Boolean": "true"
				};
			}
			/*sortOrderFields.find(function(element, index, array) {
				if (element.name == measure) {
					measureObject.Descending = {
						"Boolean": element.descending
					};
				}
			});*/

			annotationObject.Measures.push(measureObject);
		}

		if (isSelected) {
			annotationObject.Selected = {
				"Boolean" : "true"
			};
		} else {
			annotationObject.Selected = {
				"Boolean" : "false"
			};
		}

		if (collectionPath) {
			annotationObject.CollectionPath = collectionPath;
		}

		if (parameters && parameters.length > 0) {
			annotationObject.InParameters = [];

			for (var key in parameters) {
				var param = parameters[key] ? parameters[key] : undefined,
					recordType = (param && param.RecordType) ? param.RecordType : undefined,
					valueListProperty = (param.ValueListProperty && param.ValueListProperty.String) ? param.ValueListProperty.String : undefined,
					localDataProperty = (param.LocalDataProperty && param.LocalDataProperty.PropertyPath) ? param.LocalDataProperty.PropertyPath : undefined;
				
				if (param && recordType && valueListProperty && localDataProperty) {
					// take the parameter where valueListproperty matches the dimension
					if (annotationObject.OutParameter === undefined && (recordType === this._recordTypeOutParameter || recordType === this._recordTypeInOutParameter) && valueListProperty === dimension && localDataProperty === parentProperty) {
						annotationObject.OutParameter = localDataProperty;
						//break;
					}

					if (recordType === this._recordTypeInParameter || recordType === this._recordTypeInOutParameter) {
						var metaModel 		= this._filter.getModel().getMetaModel(),
							entityFullName 	= this.getEntityType(collectionPath.String),
							entityDef 		= metaModel.getODataEntityType(entityFullName),
							entityProperty 	= metaModel.getODataProperty(entityDef, valueListProperty);
						
						if (entityProperty['sap:filterable'] === undefined || entityProperty['sap:filterable'] == "true") {
							annotationObject.InParameters.push({
								localDataProperty: localDataProperty,
								valueListProperty: valueListProperty
							});
						} else {
							jQuery.sap.log.error('IN Parameter valueListProperty: ' + valueListProperty + ' is not sap:filterable');
						}
					}
				}
			}

			if (annotationObject.InParameters.length === 0) {
				annotationObject.InParameters = undefined;
			}
		}

		if (parentProperty) {
			annotationObject.ParentProperty = parentProperty;
		}

		return annotationObject;
	};
	VisualFilterProvider.prototype._getConfig = function(annotationData) {
		var config = {filterList: []};
		if (!annotationData)
			return config;

		// Convert into the configuration format for the Visual Filter Bar
		var filterByDimName = {};
		var filterByParentPropName = {};
		var filterList = annotationData.Filters;
		for (var i = 0; i < filterList.length; i++) {
			var filter = filterList[i];

			var parentProperty = filter.ParentProperty;

			var dimField = filter.Dimensions[0].Field.String;
			var entitySet = filter.CollectionPath.String;
			var dim = this._dimensionMap[entitySet][dimField];
			if (!dim) {
				jQuery.sap.log.error("Unknown Dimension :" + dimField);
				continue;
			}

			var measureField = filter.Measures[0].Field.String;
			var measure = this._measureMap[entitySet][measureField];
			if (!measure) {
				jQuery.sap.log.error("Unknown Measure :" + measureField);
				continue;
			}

			var dispField = dim.fieldInfo.description; // Use the description/sap:text annotation to determine the display value for the field.  E.g. Want to display "Sales Northern Region", not "100-00010"
			if (!dispField)
				dispField = dimField; // if no display field, just use the technical field as a fallback


			if (!filterByDimName[dimField])
				filterByDimName[dimField] = [];

			if (!filterByParentPropName[parentProperty])
				filterByParentPropName[parentProperty] = [];

			var configObject = {
				type: filter.Type.String,
				selected: filter.Selected.Boolean == "true",
				dimension: { // for now only supporting a single dimension (although the annotations allow for a collection)
					field: dimField,
					fieldDisplay: dispField
				},
				measure: { // for now only supporting a single measure (although the annotations allow for a collection)
					field: filter.Measures[0].Field.String,
					descending: filter.Measures[0].Descending.Boolean == "true"
				},
				sortOrder : filter.SortOrder,
				scaleFactor : filter.scaleFactor.String

			};

			configObject.collectionPath = filter.CollectionPath.String;
			configObject.outParameter = filter.OutParameter;
			configObject.inParameters = filter.InParameters;
			configObject.parentProperty = filter.ParentProperty;

			//adding filterRestriction property to configObject
			configObject.filterRestriction = filter.filterRestriction.String;

			filterByParentPropName[parentProperty].push(configObject);
			filterByDimName[dimField].push(configObject);
		}
		// Now add the filter to the config's filterList
		// Special note: groups determine the 1st level order of the filters.
		// E.g. If ordered in the VisualFilterSet as A B C, and B is part of the 1st group, then the order will show like: B A C
		// The second level ordering is based on the order within the VisualFilterSet
		var usedGroupsByName = {};
		for (var i = 0; i < this._groupList.length; i++) {
			var group = this._groupList[i];
			for (var j = 0; j < group.fieldList.length; j++) {
				var field = group.fieldList[j];
				var filterList = filterByParentPropName[field.name]; // One dimension can have multiple filters

				if (!filterList) // Then no visual filters defined for that dimension
					continue;

				usedGroupsByName[group.name] = true;
				for (var k = 0; k < filterList.length; k++)
					config.filterList.push(filterList[k]);
			}
		}

		// Remove unused groups
		for (var i = this._groupList.length - 1; i >= 0; i--) {
			var group = this._groupList[i];
			if (usedGroupsByName[group.name])
				continue;

			// Unused
			this._groupList.splice(i, 1);
			delete this._groupMap[group.name];
		}
		return config;
	};

	return VisualFilterProvider;

}, /* bExport= */true);

