sap.ui.define(["sap/zen/dsh/Dsh", "sap/suite/ui/generic/template/AnalyticalListPage/control/AlrDshRenderer", "sap/ui/comp/smartvariants/PersonalizableInfo",
				"sap/ui/comp/smartvariants/SmartVariantManagement"
], function(Dsh, AlrDshRenderer, PersonalizableInfo, SmartVariantManagement) {
	"use strict";

	var DshExt = Dsh.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.DshExt", {
		renderer:AlrDshRenderer,
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

    DshExt.prototype.init = function() {
        var me = this;
        sap.zen.dsh.Dsh.prototype.init.apply(me);

        me.DSH_ROOT_NODE_ID = me.getId() + "sapbi_snippet_ROOT";
		me._scriptReady = false;
		me.DATASOURCE_ID = "DS_1";
		me.dimensionsExternalNameMap = {};
    };

    DshExt.prototype.doInit = function() {
		var me = this;
		sap.zen.dsh.Dsh.prototype.doInit.apply(this);
		me._scriptReady = true;

		if (me._pendingCreatePage) {
			me._pendingCreatePage = false;
			me._filterVariantLoaded = true;
			me.createPage();
			me.updateDshContainerHeight();
			me.rb = me.oState.oController.getView().getModel("i18n").getResourceBundle();
		}
		me.oState.oSmartFilterbar.attachAfterVariantLoad(jQuery.proxy(me.handleFilterAfterVariantLoad, me));
	};

	DshExt.prototype.handleFilterAfterVariantLoad = function(oContext) {
		var me = this;
		me._filterVariantLoaded = true;

		// The Crosstab variant loading has dependency on SmartFilterBar variant but
		// SmartVariantManagemet doesn't support dependency among control variants
		// Therefore we check to ensure SmartFilterBar Variant is loaded before
		// Crosstab variant is loaded

		if (me._pendingApplyVariant) {
			me.applyVariant(me._oCurrentVariant);
			me._filterVariantLoaded = false;
			me._pendingApplyVariant = false;

		} else if (me._pendingApplyFilter) {
			me.execApplyFilter();
			me._filterVariantLoaded = false;
			me._pendingApplyFilter = false;
		}
	};

    DshExt.prototype.setViewController = function(oController, oState) {
		var me = this;
        me.oController = oController;
        me.oState = oState;
    };

	DshExt.prototype.setSmartVariant = function(oSmartVariantId) {
		var me = this;

		me.setAssociation("smartVariant", oSmartVariantId);

		if (oSmartVariantId) {
	        var oPersInfo = new PersonalizableInfo({
	            type: "alr_designstudio_app",
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
				jQuery.sap.log.error("Variant with id=" + oSmartVariantId + " cannot be found");
			} else if (oSmartVariantId instanceof sap.ui.core.Control) {
				jQuery.sap.log.error("Variant with id=" + oSmartVariantId.getId() + " cannot be found");
			}
		} else {
			jQuery.sap.log.error("Missing SmartVariant");
		}
	};

	DshExt.prototype._variantInitialised = function() {
		if (!this._oCurrentVariant) {
			this._oCurrentVariant = "STANDARD";
		}
	};

	DshExt.prototype._getVariantManagementControl = function(oSmartVariantId) {
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

    DshExt.prototype.applyVariant = function(oVariantJSON, sContext) {
        var me = this;
        me._oCurrentVariant = oVariantJSON;
        if (me._oCurrentVariant === "STANDARD") {
            me._oCurrentVariant = null;
        }

        var dshPage = me.getPage();
        if (dshPage) {
	        if (oVariantJSON) {
				if (oVariantJSON.content) {
					if (me._filterVariantLoaded) {
		                var newContent = me.overrideBookmarkFilterValues(oVariantJSON);
		                if (newContent) {
							var that = this;
			                window.putInQueue(function() {
								dshPage.exec("BOOKMARK_ACTION.LOAD_BOOKMARK('" + btoa(newContent.newBookmarkContent) + "','" + newContent.msgContent + "')");
								that._filterVariantLoaded = false;
			                });
		                }
					} else {
						me._pendingApplyVariant = true;
					}
				} else {
					// If current variant has been saved before crosstab page is created, the content property (payload)
					// in oVariantJSON would be null. (e.g. A user loads
					// an ALR application which defaults to table view, saves a new variant.)
					// If content property is null, we would not invoke BOOKMARK_ACTION.LOAD_BOOKMARK because there is no
					// payload, therefore, we need to apply filter manually.
					if (me._filterVariantLoaded) {
						me._filterVariantLoaded = false;
						me.execApplyFilter();
					} else {
						me._pendingApplyFilter = true;
					}
				}
	        }
        }
	};

    DshExt.prototype._createISODate = function(pDate) {
		function pad(number) {
			if (number < 10) {
				return "0" + number;
			}
			return number;
		}

		if (pDate) {
			return pDate.getUTCFullYear() +
				"-" + pad(pDate.getUTCMonth() + 1) +
				"-" + pad(pDate.getUTCDate());
		} else {
			return null;
		}
	};

    DshExt.prototype._checkConditionDateType = function(value) {
		// Design Studio expects date in ISO Format
		// or SAP Date Format.  We chose ISO
		var me = this;
		var retValue = value;
		if (value && value instanceof Date) {
			retValue = me._createISODate(value);
		}
		return retValue;
	};

    DshExt.prototype.execApplyFilter = function() {
		var me = this;

		if (me._pendingApplyVariant)
			return;

		var filterData = me.oState.oSmartFilterbar.getFilterData();

		var dsFilterJSON = {fields:{}, msg:[]};
		var unsupportedConditions = [];

		if (me.dimensionsExternalNameMap) {
			for (var fieldKey in filterData) {

                // _CUSTOM is not a regular filter field, not sure what this is, ignore for now.
                if (fieldKey == "_CUSTOM")
					continue;

				var fieldKeyObj = filterData[fieldKey];
				var mappedDimName = "";
				if (me.dimensionsExternalNameMap[fieldKey]) {
					mappedDimName = me.dimensionsExternalNameMap[fieldKey]["name"];
				}
				if (mappedDimName == "") {
					jQuery.sap.log.error("Cannot map ODATA field name \"" + fieldKey + "\" to any external names of BEx query fields");
					mappedDimName = fieldKey; // resort to using odata field name
				}

				/////////////////////////////////////////////////////////////////////
				//
				//  The following mapping is to prepare data to be set
				//  on Design Studio datasource using "setFilter" API function.
				//
				//	"setFilter" DOES NOT distinguish between "GT" & "GE",  "LT" & "LE"!
				//
				//  Design Studio does not support 'contains', 'starts with',
				//  'ends with', 'less than', 'greater than' and 'exclude'
				//
				//////////////////////////////////////////////////////////////////////

				var dimFilterValueArray = [];

				if (fieldKeyObj.ranges && fieldKeyObj.ranges.length > 0) {
					var dimFilterValue = "";

					for (var i = 0; i < fieldKeyObj.ranges.length; i++) {
						var range = fieldKeyObj.ranges[i];

						if (range.operation == "EQ" && range.exclude != true) {
							dimFilterValue = range.value1;
						} else if (range.operation == "GE" && range.exclude != true) {
							dimFilterValue = {low : range.value1};
						} else if (range.operation == "LE" && range.exclude != true) {
							dimFilterValue = {high : range.value1};
						} else if (range.operation == "BT" && range.exclude != true) {
							dimFilterValue = {low : range.value1, high : range.value2};
						} else {
							unsupportedConditions.push(range);
							continue;
						}

						// Design Studio expects date in ISO Format
						if (dimFilterValue && dimFilterValue instanceof Date) {
							dimFilterValue = me._createISODate(dimFilterValue);
						}
						if (dimFilterValue.low && dimFilterValue.low instanceof Date) {
							dimFilterValue.low = me._createISODate(dimFilterValue.low);
						}
						if (dimFilterValue.high && dimFilterValue.high instanceof Date) {
							dimFilterValue.high = me._createISODate(dimFilterValue.high);
						}

						dimFilterValueArray.push(dimFilterValue);
					}
				}

				if (fieldKeyObj.items && fieldKeyObj.items.length > 0) {
					// these are validated entries, treats as 'equals'
					var dimFilterValue = "";

					for (var i = 0; i < fieldKeyObj.items.length; i++) {
						var item = fieldKeyObj.items[i];

						dimFilterValue = item.key;
						if (dimFilterValue && dimFilterValue instanceof Date) {
							dimFilterValue = me._createISODate(dimFilterValue);
						}
						dimFilterValueArray.push(dimFilterValue);
					}
				}

				if (fieldKeyObj.value != null) {
					// treats as 'equals'
					var dimFilterValue = fieldKeyObj.value;
					if (dimFilterValue && dimFilterValue instanceof Date) {
						dimFilterValue = me._createISODate(dimFilterValue);
					}
					dimFilterValueArray.push(dimFilterValue);
				}

				if (dimFilterValueArray.length == 1) {
					dsFilterJSON.fields[mappedDimName] = dimFilterValueArray[0];
				} else if (dimFilterValueArray.length > 1) {
					dsFilterJSON.fields[mappedDimName] = dimFilterValueArray;
				}
			}

			if (unsupportedConditions.length > 0) {
				dsFilterJSON.msg.push(me._createUnsupportedConditionMsg(unsupportedConditions));
			}

			var searchWarningMsg = me._checkBasicSearchUsage();
			if (searchWarningMsg) {
				dsFilterJSON.msg.push(searchWarningMsg);
			}
		}

		if (me.getPage()) {
			window.putInQueue(function() {
				me.getPage().exec("FILTER_ACTION.APPLY_FILTER('" + JSON.stringify(dsFilterJSON) + "')");
			});
		}
    };

	DshExt.prototype._getFilterLabelByKey = function(filterKey) {
		var me = this;
		var label = filterKey;
		var filters = me.oState.oSmartFilterbar.getFiltersWithValues();
		if (filters) {
			for (var i = 0; i < filters.length; i++) {
				if (filters[i].getName() === filterKey) {
					label = filters[i].getLabel();
					break;
				}
			}
		}
		return label;
	};

	DshExt.prototype._checkBasicSearchUsage = function() {
		var me = this;
		var retValue;
		if (me.oState.oSmartFilterbar.getBasicSearchControl() &&
			me.oState.oSmartFilterbar.getBasicSearchControl().getValue() != "") {
				retValue = me.rb.getText("CROSSTAB_UNSUPPORTED_SEARCH", me.oState.oSmartFilterbar.getBasicSearchControl().getValue());
			}
		return retValue;
	};

	DshExt.prototype._createUnsupportedConditionMsg = function(conditionsArray) {
		var me = this;
		var retValue = "";
		if (conditionsArray && conditionsArray.length > 0) {
			retValue += (me.rb.getText("CROSSTAB_UNSUPPORTED_FILTER_CONDITION") + "  ");
			retValue += (me.rb.getText("CROSSTAB_UNSUPPORTED_FILTER_CONDITION2") + "\\n\\n");
			for (var i = 0; i < conditionsArray.length; i++) {
				var cond = conditionsArray[i];
				var msg = me._getFilterLabelByKey(cond.keyField) + " " + cond.tokenText + " " +
							me.rb.getText("CROSSTAB_FILTER_CONDITION_NOT_APPLIED") + "\\n";
				retValue += msg;
			}
		}
		return retValue;
	};

    DshExt.prototype.overrideBookmarkFilterValues = function(oVariantJSON) {
        var me = this;
        var retValue = "";
        var msgContent = "";
        try {
            if (oVariantJSON && oVariantJSON.content) {
                var convertedContent = me.getBookmarkContentAsJSON(oVariantJSON.content);
                var bmContentJSON = convertedContent.content;

                var subSelections = [];
				var messages = [];
                var currentFilterbarValues = me.oState.oSmartFilterbar.getFilterData();
                for (var fieldKey in currentFilterbarValues) {

                    // _CUSTOM is not a regular filter field, not sure what this is, ignore for now.
                    if (fieldKey == "_CUSTOM")
						continue;

                    var dimFieldKey = "";
                    if (me.dimensionsExternalNameMap && me.dimensionsExternalNameMap[fieldKey]) {
						dimFieldKey = me.dimensionsExternalNameMap[fieldKey]["keyField"];
                    }

					if (dimFieldKey == "") {
						dimFieldKey = fieldKey;
						jQuery.sap.log.error("Cannot map ODATA field name \"" + fieldKey + "\" to any external names of BEx query fields");
					}
                    var subSelection = {"SetOperand":{"Elements":[], "FieldName":dimFieldKey}};
                    if (currentFilterbarValues.hasOwnProperty(fieldKey)) {
                        var c_filter = me.convertFilter_ODATA_TO_INA(currentFilterbarValues[fieldKey]);
                        if (c_filter) {
							subSelection.SetOperand.Elements = c_filter.inaModel;
							if (c_filter.xconditionMsg)
								messages.push(c_filter.xconditionMsg);
                        }
                    }
                    subSelections.push(subSelection);
                }

                // // apply measure selection if set
                if (me._oMeasureSelection && me._oMeasureSelection.selection != "") {
                    var subSelection = {"SetOperand":{"Elements":[], "FieldName":me._oMeasureSelection.key}};

                    var ranges = [];
                    for (var fieldKey in me._oMeasureSelection.selection) {
                        ranges.push({operation:"EQ", value1:fieldKey});
                    }
                    var inaModel = me.convertFilter_ODATA_TO_INA({ranges:ranges});
                    subSelection.SetOperand.Elements = inaModel;
                    subSelections.push(subSelection);
				}

				if (!bmContentJSON.Filter) {
                    bmContentJSON.Filter = {"Selection":{"Operator":{"SubSelections":{}}}};
				}

				if (bmContentJSON.Filter && bmContentJSON.Filter.Selection && bmContentJSON.Filter.Selection.Operator &&
					bmContentJSON.Filter.Selection.Operator.SubSelections) {
					bmContentJSON.Filter.Selection.Operator.SubSelections = subSelections;
				}
				retValue = me.getUpdatedBookmarkContentString(convertedContent.xml, bmContentJSON);

				var searchWarningMsg = me._checkBasicSearchUsage();
				if (searchWarningMsg) {
					messages.msg.push(searchWarningMsg);
				}

				if (messages.length > 0) {
					msgContent = JSON.stringify({msg:messages});
				}
            }
            return {newBookmarkContent:retValue, msgContent:msgContent};
        } catch (ex) {
            return {newBookmarkContent:oVariantJSON.content};
        }
    };

    DshExt.prototype.getBookmarkContentAsJSON = function(bmContent, xmlDoc) {
        var bmJSON;
        if (!xmlDoc) {
            xmlDoc = jQuery.sap.parseXML(bmContent);
        }
        var inaModelNode = xmlDoc.getElementsByName("INA_MODEL");
        if (inaModelNode && inaModelNode.length == 1) {
            var valueNode = inaModelNode[0].getElementsByTagName("value");
            if (valueNode && valueNode.length == 1) {
                var bmContent = valueNode[0].innerHTML;
                var CDataStartStr = "<![CDATA[";
                var CDataEndStr = "]]>";
                var CDataStartStrIdx = bmContent.indexOf(CDataStartStr);
                if (CDataStartStrIdx >= 0) {
                    bmContent = bmContent.substring(CDataStartStr.length);
                    var CDataEndStrIdx = bmContent.indexOf(CDataEndStr);
                    if (CDataEndStrIdx >= 0) {
                        bmContent = bmContent.substring(0, bmContent.length - CDataEndStr.length);
                        bmJSON = JSON.parse(bmContent);
                    }
                }
            }
        }
        return {content:bmJSON, xml:xmlDoc};
    };

    DshExt.prototype.getUpdatedBookmarkContentString = function(xmlDoc, bmContentJSON) {
        var retValue = "";
        if (xmlDoc) {
            var CDataStartStr = "<![CDATA[";
            var CDataEndStr = "]]>";
            var inaModelNode = xmlDoc.getElementsByName("INA_MODEL");
            if (inaModelNode && inaModelNode.length == 1) {
                var valueNode = inaModelNode[0].getElementsByTagName("value");
                retValue = valueNode[0].innerHTML = CDataStartStr + JSON.stringify(bmContentJSON) + CDataEndStr;
                retValue = jQuery.sap.serializeXML(xmlDoc);
            }
        }
        return retValue;
    };

    DshExt.prototype.removeBookmarkFilterValues = function(bookmarkContent) {
        var me = this;
        var convertedContent = me.getBookmarkContentAsJSON(bookmarkContent);
        var bmContentJSON = convertedContent.content;
        if (bmContentJSON.Filter && bmContentJSON.Filter.Selection && bmContentJSON.Filter.Selection.Operator &&
            bmContentJSON.Filter.Selection.Operator.SubSelections) {
            bmContentJSON.Filter.Selection.Operator.SubSelections = [];
        }
        if (bmContentJSON.FixedFilter && bmContentJSON.FixedFilter.Selection && bmContentJSON.FixedFilter.Selection.Operator &&
            bmContentJSON.FixedFilter.Selection.Operator.SubSelections) {
            bmContentJSON.FixedFilter.Selection.Operator.SubSelections = [];
        }
        return me.getUpdatedBookmarkContentString(convertedContent.xml, bmContentJSON);
    };

    DshExt.prototype.convertFilter_ODATA_TO_INA = function(filterModel) {
		var me = this;
        var inaFilterModel = [];
		var unsupportedConditions = [];
		var xconditionMsg = "";

		if (filterModel && filterModel.ranges && filterModel.ranges.length > 0) {
            for (var r = 0; r < filterModel.ranges.length; r++) {
                var range = filterModel.ranges[r];

                // 	UI5 Smart FilterBar supports'contains', 'between', 'starts with', 'ends with', 'less than', 'less than eq to',
                //	'greater than', 'greater than equal to'
                //
                //  Design Studio does not support 'contains', 'starts with', 'ends with' and 'exclude'

				var inaFilterJson = {};
                if (range.operation == "GT") {
                    inaFilterJson = {"Comparison":">", "Low":range.value1};
				} else if (range.operation == "GE") {
                    inaFilterJson = {"Comparison":">=", "Low":range.value1};
				} else if (range.operation == "LT") {
                    inaFilterJson = {"Comparison":"<", "Low":range.value1};
				} else if (range.operation == "LE") {
                    inaFilterJson = {"Comparison":"<=", "Low":range.value1};
				} else if (range.operation == "BT") {
                    inaFilterJson = {"Comparison":"BETWEEN", "High": range.value2, "Low":range.value1};
				} else if (range.operation == "EQ") {
                    inaFilterJson = {"Comparison":"=", "Low":range.value1};
				} else {
					unsupportedConditions.push(range);
				}

				if (range.exclude) {
					unsupportedConditions.push(range);
					inaFilterJson.isExcluding = true;
				}

				inaFilterModel.push(inaFilterJson);
            }
		}

		if (filterModel && filterModel.items && filterModel.items.length > 0) {
			// these are validated entries, treats as EQ
			for (var r = 0; r < filterModel.items.length; r++) {
				var item = filterModel.items[r];
				var inaFilterJson = {};
				inaFilterJson = {"Comparison":"=", "Low":item.key};
				inaFilterModel.push(inaFilterJson);
			}
		}

		if (filterModel.value != null) {
			// treats as EQ
			inaFilterJson = {"Comparison":"=", "Low":filterModel.value};
			inaFilterModel.push(inaFilterJson);
		}

		if (unsupportedConditions.length > 0) {
			xconditionMsg = me._createUnsupportedConditionMsg(unsupportedConditions);
		}

        return {inaModel:inaFilterModel, xconditionMsg:xconditionMsg};
    };

    DshExt.prototype.createDimensionsExternalNameMap = function() {
	var me = this;

		if (me.dimensionsExternalNameMap) {
			var ds = me.getPage().getDataSource(me.DATASOURCE_ID);
			if (ds) {
				for (var i = 0; i < ds.getDimensions().length; i++ ) {
					var dim = ds.getDimensionByName((ds.getDimensions()[i]).getName());
					me.dimensionsExternalNameMap[dim.getExternalName()] = {name:dim.getName()};
					if (dim.getKeyField()) {
					me.dimensionsExternalNameMap[dim.getExternalName()]["keyField"] = dim.getKeyField().getName();
					}
				}
			}
		}
    };

    DshExt.prototype.fetchVariant = function() {
        var me = this;
        var variantContent = {};
        var bookmarkContent = "<bookmark>";

        var page = me.getPage();

		// The following code should only be run when there is a change to
		// crosstab's configuration but since there isn't an event from dsh
		// that we can listen to, we assume it's always changed.

        if (page) {
	        var dataSource = page.getDataSources(me.DATASOURCE_ID);
	        if (dataSource) {
				var _ds = dataSource.m_native.DS_1;
				var dsBookmarkContent = _ds.getBookmarkContent();
                // we want to always use the filter values from the smart filterbar
                dsBookmarkContent = me.removeBookmarkFilterValues(dsBookmarkContent);
                bookmarkContent = (bookmarkContent + dsBookmarkContent);
	        }

	        var appPropsComponent = page.getApplicationPropertiesComponent();
	        var propsBookmarkContent = appPropsComponent.getBookmarkContent();
	        bookmarkContent = (bookmarkContent + propsBookmarkContent);
	        bookmarkContent = (bookmarkContent + "</bookmark>");

	        if (bookmarkContent) {
	            variantContent.content = bookmarkContent;
	        }
        }

        return variantContent;
    };

    DshExt.prototype.addCrosstabPersonalisationToToolbar = function() {
        var me = this;
        var sButtonLabel;
        if (!me._oDshPersonalisationButton) {
            sButtonLabel = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("TABLE_PERSOBTN_TOOLTIP");
            me._oDshPersonalisationButton = new sap.m.OverflowToolbarButton(this.getId() + "-btnPersonalisation", {
                icon: "sap-icon://action-settings",
                text: sButtonLabel,
                tooltip: sButtonLabel,
                press: function(oEvent) {
                    me.openP13nDialog();
                }
            });
        }
    };

    DshExt.prototype.p13nHandleDialogOk = function(event) {
        var me = this;
        var payload = event.getParameter("payload");

        // retrieve dimensions config
        var payloadDimMeasure;
        if (payload && payload.dimeasure && payload.dimeasure.dimMeasureItems) {
            payloadDimMeasure = payload.dimeasure.dimMeasureItems;
        }

        var dimConfig = {row:[], column:[], measureSelection:{}};
        for (var i = 0; payloadDimMeasure && i < payloadDimMeasure.length; i++) {
            var dimItem = payloadDimMeasure[i];
            if (dimItem.getVisible()) {
                if (dimItem.getRole() == "row") {
                    dimConfig.row.push({key:dimItem.getColumnKey(),index:dimItem.getIndex()});
                } else if (dimItem.getRole() == "column") {
                    dimConfig.column.push({key:dimItem.getColumnKey(),index:dimItem.getIndex()});
                }
            }
        }

        function sortByIndex(a,b) {
            if (a.index > b.index) {
                return 1;
            } else if (a.index < b.index) {
                return -1;
            } else {
                return 0;
            }
        }

        dimConfig.row.sort(sortByIndex);
        dimConfig.column.sort(sortByIndex);

        // retrieve measure selection
        if (payload && payload.columns && payload.columns.tableItems) {
            for (var i = 0; i < payload.columns.tableItems.length; i++) {
                var sel = payload.columns.tableItems[i];
                if (sel.visible) {
                    dimConfig.measureSelection[sel.columnKey] = true;
                }
            }
        }

        if (me._oVariantManagement) {
			me._oVariantManagement.currentVariantSetModified(true);
        }

        var dshPage = me.getPage();
        if (dshPage) {
            me._oMeasureSelection.selection = dimConfig.measureSelection;
            window.putInQueue(function() {dshPage.exec("DISPLAY_ACTION.CONFIG_DIM('" + JSON.stringify(dimConfig) + "')");});
        }
        me.dmDialog.detachOk(me.p13nHandleDialogOk, me);
        me.dmDialog.close();
    };

    DshExt.prototype.p13nHandleDialogCancel = function(event) {
        var me = this;
        me.dmDialog.detachCancel(me.p13nHandleDialogCancel, me);
        me.dmDialog.close();
    };

    DshExt.prototype.openP13nDialog = function() {
        var me = this;

        var page = me.getPage();

        if (page) {
            if (!me._oMeasureSelection) {
                me._oMeasureSelection = {key:"",selection:""};
            }

            var measureKeyFieldName = "";
            var ds = page.getDataSource(me.DATASOURCE_ID);
            if (ds) {
                var dimensions = {collection:[], selectedCollection:[], measures:[], selectedMeasures:[]};
                for (var i = 0; i < ds.getDimensions().length; i++) {
                    var dim = ds.getDimensions()[i];
                    dimensions.collection.push({
                        text: dim.getText(),
                        path: dim.getName(),
                        type: dim.isMeasuresDimension ? "Measure" : "Dimension"
                    });
                    if (dim.isMeasuresDimension) {
                        measureKeyFieldName = dim.dimension.getKeyField().getName(); // has .key at the end
                        //me._oMeasureSelection.key = dim.getName();
                        me._oMeasureSelection.key = measureKeyFieldName;
                        var keyfigures = dim.dimension.getAllDimensionMembers();
                        if (keyfigures) {
                            var iterator = keyfigures.getIterator();
                            var kfIndex = 0;
                            while (iterator.hasNext()) {
                                var kf = iterator.next();
                                dimensions.measures.push({
                                    columnKey : kf.getName(),
                                    text: kf.getText(),
                                    visible: true,
                                    index: kfIndex
                                });
                                kfIndex++;
                            }
                        }
                    }
                }

                jQuery.sap.require("sap.suite.ui.generic.template.AnalyticalListPage.control.P13nDimMeasurePanelExt");
                jQuery.sap.require("sap.m.P13nItem");
                jQuery.sap.require("sap.m.P13nDimMeasureItem");
                jQuery.sap.require("sap.m.P13nDialog");

                var dmPanel = new sap.suite.ui.generic.template.AnalyticalListPage.control.P13nDimMeasurePanelExt();
                dmPanel.setTitle(me.rb.getText("CROSSTAB_SETTING_CONFIG_DIM"));

                var listTemplate = new sap.m.P13nItem({
                    columnKey : "{path}",
                    text : "{text}",
                    aggregationRole: "{type}"
                });

                //read current crosstab configuration
                var convertedContent = me.getBookmarkContentAsJSON(ds.getBookmarkContent());
                var bmContentJSON = convertedContent.content;
                if (bmContentJSON.Dimensions) {
                    for (var i = 0; i < bmContentJSON.Dimensions.length; i++) {
                        var dim = bmContentJSON.Dimensions[i];
                        var role = "none";
                        if (dim.Axis == "None") {
                            continue;
                        } else if (dim.Axis == "Columns") {
                            role = "column";
                        } else if (dim.Axis == "Rows") {
                            role = "row";
                        }
                        dimensions.selectedCollection.push({
                            columnKey: dim.Name,
                            visible:true,
                            index: i,
                            role: role
                        });
                    }
                }

                // read currently selected measure selection
                if (bmContentJSON.Filter && bmContentJSON.Filter.Selection && bmContentJSON.Filter.Selection.Operator &&
                    bmContentJSON.Filter.Selection.Operator.SubSelections) {
                    var measureFilterFound = false;
                    for (var i = 0; i < bmContentJSON.Filter.Selection.Operator.SubSelections.length; i++) {
                        var filterSel = bmContentJSON.Filter.Selection.Operator.SubSelections[i];
                        if (filterSel.SetOperand && filterSel.SetOperand.FieldName == measureKeyFieldName) {
                            measureFilterFound = true;
                            for (var j = 0; j < filterSel.SetOperand.Elements.length; j++) {
                                var kf = filterSel.SetOperand.Elements[j];
                                if (kf.Comparison == "=") {
                                    dimensions.selectedMeasures.push({
                                        columnKey : kf.Low,
                                        visible: true
                                    });
                                }
                            }
                            break;
                        }
                    }
                    if (!measureFilterFound) {
                        dimensions.selectedMeasures = dimensions.measures;
                    }
                } else {
                    dimensions.selectedMeasures = dimensions.measures;
                }


                var dimListTemplate = new sap.m.P13nDimMeasureItem({
                    columnKey : "{columnKey}",
                    visible: "{visible}",
                    role: "{role}",
                    index: "{index}"
                });

                var dimensionJSONModel = new sap.ui.model.json.JSONModel(dimensions);

                dmPanel.bindItems({path: "/collection", template:listTemplate});
                dmPanel.bindDimMeasureItems({path: "/selectedCollection", template:dimListTemplate});
                dmPanel.setModel(dimensionJSONModel);

                me.dmDialog = new sap.m.P13nDialog({
                    stretch: sap.ui.Device.system.phone
                });
                me.dmDialog.attachOk(me.p13nHandleDialogOk, me);
                me.dmDialog.attachCancel(me.p13nHandleDialogCancel, me);

                me.dmDialog.addPanel(dmPanel);
                me.dmDialog.setTitle("Define Crosstab Dimensions");

                ///////////////////////
                ///// Measure Panel
                ///////////////////////

                var measurePanel = new sap.m.P13nColumnsPanel();
                measurePanel.setTitle(me.rb.getText("CROSSTAB_SETTING_SEL_MEASURE"));
                var listTemplate = new sap.m.P13nItem({
                    columnKey : "{columnKey}",
                    text : "{text}"
                });

                var colListTemplate = new sap.m.P13nColumnsItem({
                    columnKey : "{columnKey}",
                    text: "{text}",
                    visible: "{visible}",
                    index: "{index}"
                });

                measurePanel.bindItems({path: "/measures", template:listTemplate});
                measurePanel.bindColumnsItems({path: "/selectedMeasures", template:colListTemplate});
                me.dmDialog.addPanel(measurePanel);
                measurePanel.setModel(dimensionJSONModel);
            }


            // Set compact style class if the table is compact too
            me.dmDialog.toggleStyleClass("sapUiSizeCompact", !!jQuery(me.oState.oSmartTable.getTable().getDomRef()).closest(".sapUiSizeCompact").length);
            me.dmDialog.open();
        }
    };

    DshExt.prototype.getPage = function() {
        var me = this;
        if (!me.page) {
            me.page = window[me.getId() + "Buddha"];
        }
        return me.page;
    };

    DshExt.prototype.createPage = function() {
        var me = this;

        if (me._scriptReady) {
	        me.doIt();
	        me.addResizeHandler();

	        me.createDimensionsExternalNameMap();

			if (me._oCurrentVariant === "STANDARD" || (me._oCurrentVariant && !me._oCurrentVariant.content)) {
				if (me.oState.oSmartFilterbar) {
					// Filter selection might have already been applied before
					// crosstab view is activated.  Initialize filter selection on crosstab
					//
					// If current variant has been saved before crosstab page is created, the content property (payload)
					// in oCurrentVariant would be null. (e.g. A user loads
					// an ALR application which defaults to table view, saves a new variant.)
					// If content property is null, we would not invoke BOOKMARK_ACTION.LOAD_BOOKMARK because there is no
					// payload, therefore, we need to apply filter manually.
					setTimeout(function(){
						me.execApplyFilter();
					},1000);
				}
			} else {
					// This condition is only relevant if the default variant (not STANDARD)
					// has 'crosstab' as the view mode.
					//
					// Filter selection is included in the loading of variant/bookmark.
					// We introduce a delay before loading the variant because the design studio app
					// has just been initialized and loading of design studio bookmark is ignored if it is
					// done immediately. The delay is a workaround.
					//
					// TODO request an event to be fired from design studio when the app is properly
					// initialized

					setTimeout(function(){
						me.applyVariant(me._oCurrentVariant);
					},1000);
			}

        } else {
			me._pendingCreatePage = true;
        }
    };

    DshExt.prototype.addResizeHandler = function() {
        var me = this;
        if (me._dshResizeHandlerId) {
            sap.ui.core.ResizeHandler.deregister(me._dshResizeHandlerId);
        }

        me._dshResizeHandlerId = sap.ui.core.ResizeHandler.register(me.oState.oContentContainer.getDomRef(), function(){
            me.updateDshContainerHeight();
            me.refreshCrosstab();
        });
    };

    DshExt.prototype.updateDshContainerHeight = function() {
		var me = this;
		jQuery(me.getDomRef()).css("height", me.calculateDshContainerHeight());
    };

    DshExt.prototype.calculateDshContainerHeight = function() {
        var me = this;

        var dshHeight = jQuery(me.oState.oContentContainer.getDomRef()).height() - jQuery(me.oState.alr_dshToolbar.getDomRef()).outerHeight(true);

        return dshHeight;
    };

    DshExt.prototype.getNavPanelControl = function() {
        var me = this;
        var nvComp = me.getPage().getComponentsByType("NAVIGATIONPANEL_COMPONENT");
        if (nvComp && nvComp.m_list && nvComp.m_list.length == 1) {
            nvComp = nvComp.m_list[0];
        }
        var nvId = me.getId() + nvComp.getId();
        if (nvComp.getPostfixId()) {
            nvId += nvComp.getPostfixId();
        }
        var nvCtrl = sap.ui.getCore().byId(nvId);
        return nvCtrl;
    };

    DshExt.prototype.getCrosstabControl = function() {
        var me = this;
        var ctComp = me.getPage().getComponentsByType("CROSSTAB_COMPONENT");
        if (ctComp && ctComp.m_list && ctComp.m_list.length == 1) {
            ctComp = ctComp.m_list[0];
        }
        var crosstabId = me.getId() + ctComp.getId();
        var crossTabCtrl = sap.ui.getCore().byId(crosstabId);
        return crossTabCtrl;
    };

    DshExt.prototype.refreshCrosstab = function(bforce, updateHeight) {
        var me = this;
        if (me.getPage()) {
            var crossTabCtrl = me.getCrosstabControl();
            var nvCtrl = me.getNavPanelControl();
            if (crossTabCtrl) {
                if (bforce) {
					if (updateHeight) {
						me.updateDshContainerHeight();
					}

                    var ctMeasuring = crossTabCtrl.getRenderEngine().getMeasuringHelper();
                    ctMeasuring.orig_hasCrosstabSizeChanged = ctMeasuring.hasCrosstabSizeChanged;
                    ctMeasuring.hasCrosstabSizeChanged = function(){return true;};
                    var fHandler = function(){
                        ctMeasuring.hasCrosstabSizeChanged = ctMeasuring.orig_hasCrosstabSizeChanged;
                        crossTabCtrl.getRenderEngine().removeAfterFinishRenderingHandler(fHandler);
                    };
                    crossTabCtrl.getRenderEngine().addAfterFinishRenderingHandler(fHandler);
                }

                crossTabCtrl.invalidate();
                crossTabCtrl.doRendering();
            }
            if (nvCtrl) {
                nvCtrl.invalidate();
                //nvCtrl.rerender();
            }
        }
    };

    DshExt.prototype.logoff = function() {
		var me = this;
		if (me.getPage()) {
			sap.zen.dsh.Dsh.prototype.logoff.apply(me);
		}
    };

    return DshExt;
}, /* bExport= */true);
