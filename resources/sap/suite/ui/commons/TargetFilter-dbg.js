/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.suite.ui.commons.TargetFilter.
jQuery.sap.declare("sap.suite.ui.commons.TargetFilter");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new TargetFilter.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getEntitySet entitySet} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getColumns columns} : sap.suite.ui.commons.TargetFilterColumn[]</li>
 * <li>{@link #getMeasureColumn measureColumn} : sap.suite.ui.commons.TargetFilterMeasureColumn</li></ul>
 * </li>
 * <li>Associations
 * <ul>
 * <li>{@link #getSelectedColumns selectedColumns} : string | sap.suite.ui.commons.TargetFilterColumn</li></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.TargetFilter#event:search search} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.TargetFilter#event:filterChange filterChange} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.TargetFilter#event:cancel cancel} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The analytical filter control. The control works only with the OData model connected to the analytical OData service (for example, HANA XS Analytical view exposed as an OData service).
 * @extends sap.ui.core.Control
 * @version 1.44.5
 *
 * @constructor
 * @public
 * @deprecated Since version 1.34. 
 * Deprecated.
 * @name sap.suite.ui.commons.TargetFilter
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.TargetFilter", { metadata : {

	deprecated : true,
	publicMethods : [
		// methods
		"getFilters", "getParameters", "search"
	],
	library : "sap.suite.ui.commons",
	properties : {

		/**
		 * The name of the entity set from OData service metadata. The filtering applies to this entity set.
		 */
		"entitySet" : {type : "string", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * The list of the columns.
		 */
		"columns" : {type : "sap.suite.ui.commons.TargetFilterColumn", multiple : true, singularName : "column"}, 

		/**
		 * The hidden aggregation for the internal control that displays the number of entries in the filtered set.
		 */
		"_countDisplay" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 

		/**
		 * The hidden aggregation for the internal control that represents the right top quadrant.
		 */
		"_quad0" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 

		/**
		 * The hidden aggregation for the internal control that represents the left top quadrant.
		 */
		"_quad1" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 

		/**
		 * The hidden aggregation for the internal control that represents the left bottom quadrant.
		 */
		"_quad2" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 

		/**
		 * The hidden aggregation for the internal control that represents the right bottom quadrant.
		 */
		"_quad3" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 

		/**
		 * The measure column.
		 */
		"measureColumn" : {type : "sap.suite.ui.commons.TargetFilterMeasureColumn", multiple : false}
	},
	associations : {

		/**
		 * The list of selected columns. The index of the columns in this list corresponds to the quadrant.
		 */
		"selectedColumns" : {type : "sap.suite.ui.commons.TargetFilterColumn", multiple : true, singularName : "selectedColumn"}
	},
	events : {

		/**
		 * This event is fired if the user chooses the Show Selected link.
		 */
		"search" : {}, 

		/**
		 * This event is fired if the user changes a selected filter set.
		 */
		"filterChange" : {}, 

		/**
		 * This event is fired if the user changes a selected filter set to the filter set used for the last search.
		 */
		"cancel" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.TargetFilter with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.suite.ui.commons.TargetFilter.extend
 * @function
 */

sap.suite.ui.commons.TargetFilter.M_EVENTS = {'search':'search','filterChange':'filterChange','cancel':'cancel'};


/**
 * Getter for property <code>entitySet</code>.
 * The name of the entity set from OData service metadata. The filtering applies to this entity set.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>entitySet</code>
 * @public
 * @name sap.suite.ui.commons.TargetFilter#getEntitySet
 * @function
 */

/**
 * Setter for property <code>entitySet</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sEntitySet  new value for property <code>entitySet</code>
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#setEntitySet
 * @function
 */


/**
 * Getter for aggregation <code>columns</code>.<br/>
 * The list of the columns.
 * 
 * @return {sap.suite.ui.commons.TargetFilterColumn[]}
 * @public
 * @name sap.suite.ui.commons.TargetFilter#getColumns
 * @function
 */


/**
 * Inserts a column into the aggregation named <code>columns</code>.
 *
 * @param {sap.suite.ui.commons.TargetFilterColumn}
 *          oColumn the column to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the column should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the column is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the column is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#insertColumn
 * @function
 */

/**
 * Adds some column <code>oColumn</code> 
 * to the aggregation named <code>columns</code>.
 *
 * @param {sap.suite.ui.commons.TargetFilterColumn}
 *            oColumn the column to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#addColumn
 * @function
 */

/**
 * Removes an column from the aggregation named <code>columns</code>.
 *
 * @param {int | string | sap.suite.ui.commons.TargetFilterColumn} vColumn the column to remove or its index or id
 * @return {sap.suite.ui.commons.TargetFilterColumn} the removed column or null
 * @public
 * @name sap.suite.ui.commons.TargetFilter#removeColumn
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>columns</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.TargetFilterColumn[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.TargetFilter#removeAllColumns
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.TargetFilterColumn</code> in the aggregation named <code>columns</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.TargetFilterColumn}
 *            oColumn the column whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.TargetFilter#indexOfColumn
 * @function
 */
	

/**
 * Destroys all the columns in the aggregation 
 * named <code>columns</code>.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#destroyColumns
 * @function
 */


/**
 * Getter for aggregation <code>measureColumn</code>.<br/>
 * The measure column.
 * 
 * @return {sap.suite.ui.commons.TargetFilterMeasureColumn}
 * @public
 * @name sap.suite.ui.commons.TargetFilter#getMeasureColumn
 * @function
 */


/**
 * Setter for the aggregated <code>measureColumn</code>.
 * @param {sap.suite.ui.commons.TargetFilterMeasureColumn} oMeasureColumn
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#setMeasureColumn
 * @function
 */
	

/**
 * Destroys the measureColumn in the aggregation 
 * named <code>measureColumn</code>.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#destroyMeasureColumn
 * @function
 */


/**
 * The list of selected columns. The index of the columns in this list corresponds to the quadrant.
 * 
 * @return {string[]}
 * @public
 * @name sap.suite.ui.commons.TargetFilter#getSelectedColumns
 * @function
 */

	
/**
 *
 * @param {string | sap.suite.ui.commons.TargetFilterColumn} vSelectedColumn
 *    Id of a selectedColumn which becomes an additional target of this <code>selectedColumns</code> association.
 *    Alternatively, a selectedColumn instance may be given. 
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#addSelectedColumn
 * @function
 */

/**
 * @param {int | string | sap.suite.ui.commons.TargetFilterColumn} vSelectedColumn the selectedColumn to remove or its index or id
 * @return {string} the id of the removed selectedColumn or null
 * @public
 * @name sap.suite.ui.commons.TargetFilter#removeSelectedColumn
 * @function
 */

/**
 * @return {string[]} an array with the ids of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.TargetFilter#removeAllSelectedColumns
 * @function
 */

	
/**
 * This event is fired if the user chooses the Show Selected link.
 *
 * @name sap.suite.ui.commons.TargetFilter#search
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'search' event of this <code>sap.suite.ui.commons.TargetFilter</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.TargetFilter</code>.<br/> itself. 
 *  
 * This event is fired if the user chooses the Show Selected link.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.TargetFilter</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#attachSearch
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'search' event of this <code>sap.suite.ui.commons.TargetFilter</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#detachSearch
 * @function
 */

/**
 * Fire event search to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.TargetFilter#fireSearch
 * @function
 */


/**
 * This event is fired if the user changes a selected filter set.
 *
 * @name sap.suite.ui.commons.TargetFilter#filterChange
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'filterChange' event of this <code>sap.suite.ui.commons.TargetFilter</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.TargetFilter</code>.<br/> itself. 
 *  
 * This event is fired if the user changes a selected filter set.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.TargetFilter</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#attachFilterChange
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'filterChange' event of this <code>sap.suite.ui.commons.TargetFilter</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#detachFilterChange
 * @function
 */

/**
 * Fire event filterChange to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.TargetFilter#fireFilterChange
 * @function
 */


/**
 * This event is fired if the user changes a selected filter set to the filter set used for the last search.
 *
 * @name sap.suite.ui.commons.TargetFilter#cancel
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'cancel' event of this <code>sap.suite.ui.commons.TargetFilter</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.TargetFilter</code>.<br/> itself. 
 *  
 * This event is fired if the user changes a selected filter set to the filter set used for the last search.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.TargetFilter</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#attachCancel
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'cancel' event of this <code>sap.suite.ui.commons.TargetFilter</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.TargetFilter#detachCancel
 * @function
 */

/**
 * Fire event cancel to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.TargetFilter} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.TargetFilter#fireCancel
 * @function
 */


/**
 * Returns a selected filter set.
 *
 * @name sap.suite.ui.commons.TargetFilter#getFilters
 * @function
 * @type any
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Returns the binding parameters for the controls that use this control.
 *
 * @name sap.suite.ui.commons.TargetFilter#getParameters
 * @function
 * @type any
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Triggers filtering in the controls that use this control. Returns this control for the method chaining.
 *
 * @name sap.suite.ui.commons.TargetFilter#search
 * @function
 * @type sap.suite.ui.commons.TargetFilter
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/suite/ui/commons/TargetFilter.js
///**
// * This file defines behavior for the control,
// */
sap.m.ComboBox.extend("sap.suite.ui.commons.TargetFilterComboBox", {
	metadata : {
		properties : {
			popoverPlacement : {
				type : "sap.m.PlacementType",
				group : "Misc",
				defaultValue : sap.m.PlacementType.Bottom
			}
		}
	},

	_createPopover : function() {
		var oPicker = new sap.m.Popover({
			showHeader : false,
			placement : this.getPopoverPlacement(),
			offsetX : 0,
			offsetY : 0,
			initialFocus : this,
			bounce : false
		});
		oPicker.addStyleClass("TFComboBox");

		this._decoratePopover(oPicker);
		return oPicker;
	},
	
	renderer : function(oRm, oControl) {
		sap.m.ComboBoxRenderer.render.apply(this, arguments);
	}
});

sap.m.Link.extend("sap.suite.ui.commons.TargetFilterLink", {
	metadata : {
		properties : {
			count : {
				type : "sap.ui.core/int"
			},
			key: {
				type : "sap.ui.core/string"
			}
		}
	},
	onmouseover : function (oEvent) {
		if (this.$()[0].scrollWidth > this.$().innerWidth()) { // line truncated - popover needed
			this.firePress();
		}
	},
	renderer : function(oRm, oControl) {
		sap.m.LinkRenderer.render.apply(this, arguments);
	}
});

sap.m.StandardListItem.extend("sap.suite.ui.commons.TargetFilterListItem", {
	metadata : {
		properties : {
			index : {
				type : "sap.ui.core/int"
			},
			key: {
				type : "sap.ui.core/string"
			}
		}
	},
	ontap: function(oEvent){
		if( !jQuery(oEvent.target).hasClass("sapMCbMarkChecked")){
			this.setSelected(!this.getSelected());
			this.informList("Select", !this.getSelected());
		} 
		this.firePress();
	},
	onkeyup: function(oEvent) {
	    if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
	        this.firePress();
	    }
	},
	renderer : function(oRm, oControl) {
		sap.m.StandardListItemRenderer.render.apply(this, arguments);
	}
});

sap.ui.core.Control.extend(
				"sap.suite.ui.commons.TargetFilterLinksCloud",
				{
					metadata : {
						properties : {
							index : {
								type : "sap.ui.core/int"
							}
						},
						aggregations : {
							links : {
								cardinality : "0..n",
								type : "sap.suite.ui.commons.TargetFilterLink"
							}
						}
					},

					init: function() {
						var that = this;
						this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");
						this._oOthersLink = new sap.suite.ui.commons.TargetFilterLink(this.getId() + "-others-link", {
							text: "+000 " + that._oRb.getText("TARGETFILTER_MORE_TEXT"),
							press: function() {
								var oTfQuadrant = that.getParent();
								var aFilterNames = Object.getOwnPropertyNames(oTfQuadrant._oFilters);
								
								var iDeleted = 0;
								for (var i = 0; i < aFilterNames.length; i++) {
									if (!oTfQuadrant._oFilters[aFilterNames[i]].linkId) {
										delete oTfQuadrant._oFilters[aFilterNames[i]];
										iDeleted++;
									}
								}
								this.setCount(this.getCount() - iDeleted);
								oTfQuadrant.fireFiltersChanged();
							}
						});
						this._oOthersLink.addStyleClass("sapSuiteUiTFOthersLine");
						this._oOthersLink.setEmphasized(true).setSubtle(false);
						
						this._oOthersLink.setCount = function(iCount) {
							this.setProperty("count", iCount, true);
							if (iCount > 0) {
								this.$().removeClass("Hidden");
								this.setText("+" + iCount + " " + that._oRb.getText("TARGETFILTER_MORE_TEXT"));
							} else {
								this.$().addClass("Hidden");
							}
						};
					},
	
					 exit: function() {
						 this._oOthersLink.destroy();
					 },
					
					_setFontSizes : function(aLinks) {
						var aLabelSizes = [ "Large", "Medium", "Small", "Smallest"];
						var aOccurrencies = jQuery.unique(aLinks.map(function(o) {	return o.getCount(); })); // Unique values of occurrence
						switch (aOccurrencies.length) {
						case 1:
							for (var iLine = 0; iLine < aLinks.length; iLine++) {
								aLinks[iLine].addStyleClass(aLabelSizes[1]);
							}

							break; // for a single occurrence value - use font in the middle
						case 2:
							for (var iLine = 0; iLine < aLinks.length; iLine++) {
								if (aOccurrencies[0] == aLinks[iLine]
										.getCount()) {
									aLinks[iLine].addStyleClass(aLabelSizes[1]);
								} else {
									aLinks[iLine].addStyleClass(aLabelSizes[2]);
								}
							}
							break;
						default:
							var iOccMin = Math.min.apply(null, aOccurrencies);
							var iOccMax = Math.max.apply(null, aOccurrencies);
							for (var iLine = 0; iLine < aLinks.length; iLine++) {
								var iSize = Math.floor(3.99	* (iOccMax - aLinks[iLine].getCount()) / (iOccMax - iOccMin));
								aLinks[iLine].addStyleClass(aLabelSizes[iSize]); // Apply label sizes (0..3) by occurrence
							}
						}
					},

					renderer : function(oRm, oControl) {
						var aLinks = oControl.getLinks();
						oRm.write("<div");
						oRm.writeControlData(oControl);
						oRm.addClass("sapSuiteUiTFLinksCloud");
						oRm.writeClasses();
						oRm.write(">");
						oControl._setFontSizes(aLinks);
						for (var i = 0; i < aLinks.length; i++) {
							if (!!aLinks[i].getText()) 	oRm.renderControl(aLinks[i]);
						}
						
						oControl._oOthersLink.addStyleClass("Quad" + oControl.getIndex()).addStyleClass("Hidden");
						oRm.renderControl(oControl._oOthersLink);
						
						oRm.write("</div>");
					},
					
					updateVisibleLinks: function() {
						var oTfQuadrant = this.getParent();
						
						var oLinks = this.$().find(".sapSuiteUiTFLine:not(.Hidden)");
						var iVisibleFilters = 0;
						
						var aFilterNames = Object.getOwnPropertyNames(oTfQuadrant._oFilters);
						for (var i = 0; i < aFilterNames.length; i++) {
							delete oTfQuadrant._oFilters[aFilterNames[i]].linkId;
						}
						
						oLinks.each(function() { 
							var oLink = sap.ui.getCore().byId(this.id);
							var oFilter = oTfQuadrant._oFilters[oLink.getKey()];
							if (oFilter) {
								oLink.setEmphasized(true).setSubtle(false);
								oFilter.linkId = oLink.getId();
								iVisibleFilters++;
							} else {
								oLink.setEmphasized(false).setSubtle(true);
							}
						});
						
						this._oOthersLink.setCount(aFilterNames.length - iVisibleFilters);
					},

					onAfterRendering : function() {
						if(this.getLinks().length != 0){
							this.drawCloudCircle();
							this.updateVisibleLinks();
						}
					},
					
					drawCloudCircle : function() {
						var bRtl = sap.ui.getCore().getConfiguration().getRTL();
						var iOuterCircleRadius = Math.ceil(parseFloat(jQuery(".sapSuiteUiTFOuterCircle").width() / 2)) - 5;
						var iCentralCircleRadius = Math.ceil(parseFloat(jQuery(".sapSuiteUiTFCentralCircle").outerWidth() / 2));
						var iVisibleHeight = Math.ceil(parseFloat(jQuery(".sapSuiteUiTFOuterCont").outerHeight() / 2));
						var bIsPhone = jQuery("html").hasClass("sapUiMedia-Std-Phone");
						var iBoxHeight = Math.ceil(parseFloat(jQuery(".sapSuiteUiTFBox").outerHeight()));
						var iBoxWidth = Math.ceil(parseFloat(jQuery(".sapSuiteUiTFBox").outerWidth()));
						if (!bIsPhone) {
							iBoxWidth += Math.ceil(parseFloat(jQuery(".sapSuiteUiTFBox.Quad0").css("right")));
						}
						var iMargin = 8;
						this.initQuadArea(iOuterCircleRadius - iMargin, iVisibleHeight, iCentralCircleRadius + iMargin,	iBoxHeight, iBoxWidth, iMargin);
						
						var that = this;
						var iQuad = this.getIndex();
						var sXoffset = ((iQuad == 0 || iQuad == 3) != bRtl) ? "left" : "right";
						var sYoffset = (iQuad == 0 || iQuad == 1) ? "bottom" : "top";
						var aLinks = this.getLinks();
						
						for (var i=0; i<aLinks.length; i++) {
							var oLine = aLinks[i].$();
							if (oLine.length > 0) {
								var iRealWidth = oLine[0].scrollWidth;
								if(aLinks.length <= 5 && this.isCompact()){ // << isCompact
									var iIndexVerticalLine = [0,2,[1,3][i],[1,2,3][i],[0,1,2,3][i],[0,1,2,3,4][i]][aLinks.length];
									if(oLine.width() > this._bgArea[iIndexVerticalLine].width){
										oLine.width(this._bgArea[iIndexVerticalLine].width);
									}
									this._bgArea[iIndexVerticalLine].placed.push(oLine);
								}else if(aLinks.length <= 3 && !this.isCompact()){
									var iIndexVerticalLine = [0,1,[0,2][i],[0,1,2][i]][aLinks.length];
									if(oLine.width() > this._bgArea[iIndexVerticalLine].width){
										oLine.width(this._bgArea[iIndexVerticalLine].width);
									}
									this._bgArea[iIndexVerticalLine].placed.push(oLine);
								}else{
									var iMinWidth = 48; //oLine.width();	// This is to calculate 3em for each line
									if (aLinks[i].getText().length < 3) {
										iRealWidth = Math.ceil(aLinks[i].getText().length * iMinWidth / 3);
									}
									oLine.width(iRealWidth); // And here we set back the real width to try placing without truncation
									var iOuterWidth = oLine.outerWidth();
									var iMinPosExcessRow = -1;
									var iMinPosExcess = 1000;
									var iMaxNegExcessRow = -1;
									var iMaxNegExcess = 0;
									for (var iRow = 0; iRow < that._bgArea.length; iRow++) {
										var iExcess = that._bgArea[iRow].width - iOuterWidth;
										if (iExcess >= 0 && iExcess < iMinPosExcess) {
											iMinPosExcess = iExcess;
											iMinPosExcessRow = iRow;
										}
										if (iExcess < 0 && iExcess < iMaxNegExcess) {
											iMaxNegExcess = iExcess;
											iMaxNegExcessRow = iRow;
										}
									}
									if (iMinPosExcessRow != -1) { // place without truncation
										this._bgArea[iMinPosExcessRow].placed.push(oLine);
										this._bgArea[iMinPosExcessRow].width -= iOuterWidth;
										
									} else if (iMaxNegExcessRow != -1 && that._bgArea[iMaxNegExcessRow].width >= iMinWidth) { // truncate
										if(oLine.width() > this._bgArea[iMaxNegExcessRow].width){
											oLine.width(this._bgArea[iMaxNegExcessRow].width);
										}
										// oLine.width(iMinWidth);
										iOuterWidth = oLine.outerWidth();
										this._bgArea[iMaxNegExcessRow].width -=iOuterWidth;
										this._bgArea[iMaxNegExcessRow].placed.push(oLine);
										
									} else {
										oLine.addClass("Hidden");
									}
							
								}
							}
						}
						for (var iRow = 0; iRow < this._bgArea.length; iRow++) { // Draw words placed in a row
							var iXoffset = this._bgArea[iRow].start;
							var iPlaced = this._bgArea[iRow].placed.length;
							var iRemainingWidth = Math.max(0, this._bgArea[iRow].width);
							for (var iKeyword = 0; iKeyword < iPlaced; iKeyword++) {
								var fWidthPerWord = 2.0 * iRemainingWidth / iPlaced;
								var oKeyword = this._bgArea[iRow].placed[iKeyword];
								oKeyword.css(sYoffset, this._bgArea[iRow].offset + "px");
								oKeyword.css(sXoffset, iXoffset + "px");
								iXoffset += oKeyword.outerWidth() + Math.ceil(fWidthPerWord * Math.random());
							}
						}
						this.initItemNavigation();
					},
					
					onsappageup: function() { // Workaround for the problem when item navigation hits negative index or undefined element
						var iNewIndex = this.oItemNavigation.getFocusedIndex() - this.oItemNavigation.iPageSize;
						if (iNewIndex < 0 || !this.oItemNavigation.getItemDomRefs()[iNewIndex]) {
							for (var i = 0; i < this.oItemNavigation.getItemDomRefs().length; i++) {
								if (this.oItemNavigation.getItemDomRefs()[i]) {
									this.oItemNavigation.setFocusedIndex(i);
									jQuery.grep(this.oItemNavigation.getItemDomRefs(), function (oObj) { return oObj; })[0].focus();
									return;
								}
							}
						}
					},
					
					initItemNavigation: function() {
						var iQuad = this.getIndex();
						//Collect the dom references of the items
						var oFocusRef = this.getDomRef();
						var aLinks = this.getLinks();
						if (aLinks) {
							var aDomRefs = new Array(aLinks.length);
									if (this._bgArea) {
										var aRows = (iQuad == 0 || iQuad == 1) ? this._bgArea.reverse() : this._bgArea; 
										aRows.forEach(function(oAreaRow) {
											var aPlaced = oAreaRow.placed;
											if (aPlaced) {
												aPlaced = (iQuad == 1 || iQuad == 2) ? aPlaced.reverse() : aPlaced;
												aPlaced.forEach(function(oLink) {
													aDomRefs.push(oLink);
												});
											}
										});
									}
							
							//initialize the delegate add apply it to the control (only once)
							if (!this.oItemNavigation) {
						       	 this.oItemNavigation = new sap.ui.core.delegate.ItemNavigation();
						       	 this.addDelegate(this.oItemNavigation);
						    }
						    //set the root dom node that surrounds the items
						    this.oItemNavigation.setRootDomRef(oFocusRef);
						
						    //set the array of dom nodes representing the items.
						    this.oItemNavigation.setItemDomRefs(aDomRefs);
						
						    //turn of the cycling
						    this.oItemNavigation.setCycling(false);
						
						    //set the page size
						    this.oItemNavigation.setPageSize(5);
						    
						    //set the selected index
						    //this.oItemNavigation.setSelectedIndex(this.getSelectedIndex());
						} 
					},
					
					isCompact : function() {
						return this.$().closest(".sapUISizeCompact").length > 0;
					},
					
					initQuadArea : function(iOuterRadius, iVisibleHeight, iInnerRadius, iBoxHeight, iBoxWidth, iAxisMargin) {
						var bIsPhone = jQuery("html").hasClass("sapUiMedia-Std-Phone");
						if (iVisibleHeight < 0) {
							iVisibleHeight = 0;
						}
						var iRowsCount = this.isCompact() ? 5 : 3;  
						this._bgArea = new Array(iRowsCount);
						var iYstep = (iVisibleHeight - iAxisMargin - iBoxHeight) / iRowsCount;
						var iOffset = iBoxHeight;
						for (var iRow = 0; iRow < iRowsCount; iRow++) {
							var fSquareX = iInnerRadius * iInnerRadius - iOffset * iOffset;
							var iStart = ((fSquareX > 0) ? Math.ceil(parseFloat(Math.sqrt(fSquareX))) : 0 ) + iAxisMargin;
							this._bgArea[iRow] = {
								start : iStart,  // for Quad0 - left x coordinate
								width : (bIsPhone ? iOuterRadius : Math.ceil(parseFloat(Math.sqrt(iOuterRadius	* iOuterRadius - (iOffset + iYstep) * (iOffset + iYstep))))) - iStart,
								offset :  iOffset, // for Quad0 - bottom Y coordinate
								placed : []
							}; 
							iOffset += Math.ceil(iYstep);
						}
					}
				});

sap.ui.core.Control.extend("sap.suite.ui.commons.TargetFilterQuadrant", {
	metadata: {
		properties : {
			index : {type : "sap.ui.core/int"}
		},
		aggregations: {
			linkClouds : {cardinality : "0..n", type : "sap.suite.ui.commons.TargetFilterLinksCloud"},
			dialog : {cardinality : "0..n", type : "sap.m.SelectDialog"}
		},
		events: {
			filtersChanged:{}
		}
	 },
	 
	 init: function() {
		var that = this;
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");
		
		this._oFilters = {};
		this._assignedFilters = [];
		
		this._oFilterCb = new sap.suite.ui.commons.TargetFilterComboBox(this.getId() + "-cb", {
			selectionChange : function() {
				that.setColumn(this.getSelectedKey(), true);
			},
		});
		
		this._oValueHelpBtn = new sap.m.Button(this.getId() + "-btn", {
			icon : "sap-icon://search",
			press : function() {
				that.fnShowValueHelper();
			}
		});
		
		this.addLinkCloud(new sap.suite.ui.commons.TargetFilterLinksCloud(this.getId() + "-links"));
		
		this._oSelectDialog = new sap.m.SelectDialog(this.getId() + "-browser", {
			multiSelect : true,
			liveChange : function(oEvent) {
				var sSearchValue = oEvent.getParameter("value");
				var itemsBinding = oEvent.getParameter("itemsBinding");

				var aFilters = [];
				try {
					if (sSearchValue !== undefined && sSearchValue.length) {
						aFilters.push(new sap.ui.model.Filter(that._oColumn.getPath(), 
							that._oColumn.getType().getName() == "String" ? sap.ui.model.FilterOperator.Contains : sap.ui.model.FilterOperator.EQ,
							that._oColumn.getType().parseValue(sSearchValue, "string")));
					}
					itemsBinding.filter(aFilters);
				} catch(err) {
					jQuery.sap.log.warning("'" + sSearchValue + "' is not valid " + that._oColumn.getType().getName(), this);
					this.removeAllItems();
				}
			},
			confirm: function(oEvent) {
				var aSelectedFilters = oEvent.getParameter("selectedContexts");
				that._oFilters = {};
				for (var sValue in that.oSelectedDialogSaveItems) {
					if(that.oSelectedDialogSaveItems[sValue]){
						that._oFilters[sValue] = {
							filter: new sap.ui.model.Filter(that._oColumn.getPath(), sap.ui.model.FilterOperator.EQ, sValue),
							text: that._oColumn.getType().formatValue(sValue, "string")
						};
					}
				}
				that.oSelectedDialogSaveItems = {};				
				that.fireFiltersChanged();
				that.getLinkClouds()[0].updateVisibleLinks();
			},
			cancel: function(oEvent){
				that.oSelectedDialogSaveItems = {};
			}
		});
		
		this.addAggregation("dialog", this._oSelectDialog);
	 },
	 
	 hasFilters: function() {
		 return Object.getOwnPropertyNames(this._oFilters).length != 0;
	 },
	 
	 hasFilter: function(sValue) {
		 return this._oFilters.hasOwnProperty(sValue);
	 },
	 
	 getFiltersSet: function() {
		var aFiltersSet = [];
		var aFilterNames = Object.getOwnPropertyNames(this._oFilters);
		for (var i = 0; i < aFilterNames.length; i++) {
			aFiltersSet.push({
				key: aFilterNames[i],
				text: this._oFilters[aFilterNames[i]].text
			});
		}
		 return aFiltersSet;
	 },
	 
	 getFilters: function() {
		var aFilters = [];
		var aFilterNames = Object.getOwnPropertyNames(this._oFilters);
		for (var i = 0; i < aFilterNames.length; i++) {
			aFilters.push(this._oFilters[aFilterNames[i]].filter);
		}
		
		if (aFilters.length) {
			return new sap.ui.model.Filter(aFilters, false);
		}
	},

	filter: function(aFilters) {
		this._assignedFilters = aFilters;
		this._oFilters = {};
		
		var oBinding = this.getLinkClouds()[0].getBinding("links");
		oBinding.filter(this._assignedFilters);
	},

	 removeFilter: function(sValue) {
		 var oFilter = this._oFilters[sValue];
		 
		 if (oFilter.linkId) {
			 sap.ui.getCore().byId(oFilter.linkId).setEmphasized(false).setSubtle(true);
		 } else {
			 this.getLinkClouds()[0]._oOthersLink.setCount(this.getLinkClouds()[0]._oOthersLink.getCount() - 1);
		 }
		 delete this._oFilters[sValue];
		 this.fireFiltersChanged();
	 },
	 
	 setProperty : function(sPropertyName, iValue, bSuppressInvalidate) {
		sap.ui.core.Element.prototype.setProperty.apply(this, arguments);
		if (sPropertyName === "index") {
			if (iValue == 0 || iValue == 1) {
				this._oFilterCb.setPopoverPlacement(sap.m.PlacementType.VerticalPreferedTop)
					.addStyleClass("sapSuiteTFCBTop");
			} else {
				this._oFilterCb.setPopoverPlacement(sap.m.PlacementType.VerticalPreferedBottom);
			}
			
			if (iValue == 0 || iValue == 3) {
				this._oFilterCb.addStyleClass("sapSuiteTFCBArrowBeforeVal");
			}
			
			this.getLinkClouds()[0].setIndex(iValue);
		}
	},
	
//	calcBrowseFilterOperator: function(vVal) {
//		if (!this._sBrowseFilterOperator) {
//			if (this._oColumn.getBrowseFilterOperator()) {
//				this._sBrowseFilterOperator = this._oColumn.getBrowseFilterOperator();
//			} else {
//				this._sBrowseFilterOperator = typeof vVal == "string" ? "Contains" : "EQ";
//			}
//		}
//	},
	
	setColumn: function(sColumnId, bDontUpdateFilter) {
		this._oColumn = sap.ui.getCore().byId(sColumnId);
		
		if (this._oColumn) {
			if (!bDontUpdateFilter) {
				this._oFilterCb.setSelectedKey(sColumnId);
			}
			
			var oTf = this.getParent();
			var that = this;
			var oRowTmpl = new sap.suite.ui.commons.TargetFilterLink({
				key: "{" + this._oColumn.getPath() + "}",
				text : {
					path: this._oColumn.getPath(),
					type: this._oColumn.getType()
//					formatter: function(vVal) {
////						that.calcBrowseFilterOperator(vVal);
//						return that._oColumn.formatter(vVal);
//					}
				},
				count : {
					path: oTf.getMeasureColumn().getPath()
				},
				
				
				press : function(oEvent) {
					if (this.$()[0].scrollWidth > this.$().innerWidth()) { // line truncated - popover needed
						var oPress = this;
						var sId = this.getParent().getParent().getId(); 
						if (sap.ui.getCore().byId(sId + "-popover")) that._selectPopover.destroy();
						that._selectPopover = new sap.m.Popover(sId + "-popover", {
							title : sap.ui.getCore().byId(sId + "-cb").getValue(),								
							content : [ new sap.m.Text({
											text: this.getText(),
						        	        wrapping: true 
						        	    }).addStyleClass("sapSuiteUiTFPopoverText")					        			
							],
						    footer : [ new sap.m.Bar({
									     contentRight: [new sap.m.Button({
													    	 text: that._oRb.getText(this.getEmphasized() ? "TARGETFILTER_BUTTON_DESELECT" :  "TARGETFILTER_BUTTON_SELECT"),
													    	 type: "Emphasized",
													    	 press: function(){
													    		 that.toggleLinkSelection(oPress);	
													 		     that._selectPopover.close();
													    	 }
									     			   }),
													   new sap.m.Button({
															text: that._oRb.getText("TARGETFILTER_BUTTON_CANCEL"),
															press: function () {
																that._selectPopover.close();
															}
												        })
						     			]
									})
							],						        
							placement: sap.m.PlacementType.Vertical,
							afterClose: function(oEvt){
								if (oEvt) oEvt.getSource().destroy();							
							}
						}).addStyleClass("sapSuiteUiTFPopover");
						that._selectPopover.openBy(this);	
						that._selectPopover.$().attr("role", "alert").removeAttr("aria-label");				
						return;
					}
				    that.toggleLinkSelection(this);	
				}
			});		
					
			oRowTmpl.addStyleClass("sapSuiteUiTFLine");
			oRowTmpl.addStyleClass("Quad" + this.getIndex());
		
			this.getLinkClouds()[0].bindAggregation("links", {
				path : "/" + oTf.getEntitySet(),
				parameters : {
					select : this._oColumn.getPath() + "," + oTf.getMeasureColumn().getPath()
				},
				template : oRowTmpl,
				length : this._oColumn.getLength(),
				sorter : [ new sap.ui.model.Sorter(oTf.getMeasureColumn().getPath(), true),
						new sap.ui.model.Sorter(this._oColumn.getPath(), false) ],
				filters: this._assignedFilters
			});
			
			var bFireEvent = this.hasFilters();
			
			this._oFilters = {};
			
			if (bFireEvent) {
				this.fireFiltersChanged();
			}
		} else {
			this.getLinkClouds()[0].removeAllLinks();
		}
	},

	toggleLinkSelection: function(oPress) {
		if (this._oFilters[oPress.getKey()]) {
			delete this._oFilters[oPress.getKey()];
			oPress.setEmphasized(false).setSubtle(true);
		} else {
			this._oFilters[oPress.getKey()] = {
				filter: new sap.ui.model.Filter(this._oColumn.getPath(), sap.ui.model.FilterOperator.EQ, oPress.getKey()),
				linkId: oPress.getId(),
				text: oPress.getText()
			};
				
			oPress.setEmphasized(true).setSubtle(false);
		}
		
		this.fireFiltersChanged();
	},
		
	fnShowValueHelper: function() {
		var oTf = this.getParent();
		var that = this;
		var sEntries = " " + that._oRb.getText("TARGETFILTER_ENTRIES_TEXT");
		this._oSelectDialog.bindAggregation("items", {
			path : "/" + oTf.getEntitySet(),
			parameters : {
				select : this._oColumn.getPath() + "," + oTf.getMeasureColumn().getPath()
			},
			sorter : [ new sap.ui.model.Sorter(oTf.getMeasureColumn().getPath(), true),
					new sap.ui.model.Sorter(this._oColumn.getPath(), false) ],
			filters: this._assignedFilters,
			factory: function(sId, oContext) {
				var oItem = new sap.suite.ui.commons.TargetFilterListItem({
					key : {
						path: that._oColumn.getPath()
					},
					title : {
						type: that._oColumn.getType(),
						path: that._oColumn.getPath()
					},
					description : {
						path : oTf.getMeasureColumn().getPath(),
						formatter : function(iNum) {
							return iNum + sEntries;
						}
					},
					selected : that.fnSelectDialogItemSelection(oContext),
					press: function(oEvent){
						that.oSelectedDialogSaveItems[this.getProperty("key")] = this.getSelected();
					}
				});
				
				return oItem;
			}
		});
	
		this._oSelectDialog.setTitle(this._oColumn.getTitle()),
		this._oSelectDialog.open();
	},
	oSelectedDialogSaveItems: {},
	fnSelectDialogItemSelection: function(oContext) {
		var sCtxPath = oContext.getProperty(this._oColumn.getPath());
		if( this.oSelectedDialogSaveItems[sCtxPath] == undefined ){
			this.oSelectedDialogSaveItems[sCtxPath] = this.hasFilter(sCtxPath);	
		}
		return this.oSelectedDialogSaveItems[sCtxPath];
	},
	rebindColumns: function() {
		var oTf = this.getParent();
		this._oFilterCb.removeAllItems();

		for (var i = 0; i < oTf.getColumns().length; i++) {
			var oColumn = oTf.getColumns()[i];

			var oItem = new sap.ui.core.Item({
				key : oColumn.getId(),
				text : oColumn.getTitle()
			});
			this._oFilterCb.addItem(oItem);
		}

		if (oTf.getSelectedColumns() && oTf.getSelectedColumns()[this.getIndex()]) {
			this.setColumn(oTf.getSelectedColumns()[this.getIndex()]);
		} else if (oTf.getColumns()[this.getIndex()]) {
			this.setColumn(oTf.getColumns()[this.getIndex()].getId());
		} else {
			this.setColumn();
		}
     },
	 exit: function() {
		 if (this.oItemNavigation) {
			 this.removeDelegate(this.oItemNavigation);
			 this.oItemNavigation.destroy();
		 }
		 this._oFilterCb.destroy();
		 this._oValueHelpBtn.destroy();
	 },
	 
	renderer : function(oRm, oControl) {
		var iQuad = oControl.getIndex();
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapSuiteUiTFQuadrant");
		oRm.addClass("Quad" + iQuad);
		oRm.writeClasses();
			oRm.write(">");

			 oRm.write("<div");
			 oRm.addClass("sapSuiteUiTFBox");
			 oRm.addClass("Quad" + iQuad);
			 oRm.writeClasses();
			 oRm.write(">");

				 oRm.write("<div");
				 oRm.addClass("sapSuiteUiTFParCont");
				 oRm.addClass("Quad" + iQuad);
				 oRm.writeClasses();
				 oRm.write(">");
				 	oRm.renderControl(oControl._oFilterCb);
				 oRm.write("</div>");
	
				 oRm.write("<div");
				 oRm.addClass("sapSuiteUiTFValHel");
				 oRm.addClass("Quad" + iQuad);
				 oRm.writeClasses();
				 oRm.write(">");
				 	oRm.renderControl(oControl._oValueHelpBtn);
				 oRm.write("</div>");

			 oRm.write("</div>");

			 oRm.write("<div");
			 oRm.addClass("sapSuiteUiTFHorizontalLineBg");
			 oRm.addClass("Quad" + iQuad);
			 oRm.writeClasses();
			 oRm.write(">");
				 oRm.write("<div");
				 oRm.addClass("sapSuiteUiTFHorizontalLine");
				 oRm.addClass("Quad" + iQuad);
				 oRm.writeClasses();
				 oRm.write(">");
				 oRm.write("</div>");
			 oRm.write("</div>");

			 oRm.renderControl(oControl.getLinkClouds()[0]);
		oRm.write("</div>");
	}
 });

sap.ui.core.Control.extend("sap.suite.ui.commons.TargetFilterCountDisplay", {
	metadata : {
		aggregations : {
			counts : {
				cardinality : "0..n",
				type : "sap.suite.ui.commons.TargetFilterCount"
			}
		}
	},
	
	init: function() {
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");
	},

	renderer : function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapSuiteUiTFCentralLabel");
		oRm.writeClasses();
		oRm.write(">");
		if (oControl.getCounts().length) {
			oRm.write(oControl.getCounts()[0].getCount());
		}
		oRm.write("</div>");
	},
	
	filter: function(aFilters) {
		this.getBinding("counts").filter(aFilters);
		this.getParent()._oShowSelectedLink.setText(this._oRb.getText((this.getParent().iCountFilters > 0)? "TARGETFILTER_SHOW_SELECTED_TEXT" : "TARGETFILTER_SHOW_ALL_TEXT"));
	}
});

sap.ui.core.Element.extend("sap.suite.ui.commons.TargetFilterCount", {
	metadata : {
		properties : {
			count : {
				type : "string"
			}
		},
		events : {
			countUpdated : {}
		}
	},

	setProperty : function(sPropertyName, oValue, bSuppressInvalidate) {
		sap.ui.core.Element.prototype.setProperty.apply(this, arguments);
		if (sPropertyName === "count") {
			this.fireCountUpdated({});
		}
	}
});

sap.suite.ui.commons.TargetFilter.prototype.init = function() {
	sap.ui.Device.media.attachHandler(this.rerender, this,
			sap.ui.Device.media.RANGESETS.SAP_STANDARD);
	this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");
	var that = this;
	
	this._aQuadrants = [];
	this._aSelectionHistory = [];
	for (var i = 0; i < 4; i++) {
		var oQuad = new sap.suite.ui.commons.TargetFilterQuadrant(this.getId() + "-quad" + i, {
			index: i,
			filtersChanged: function() {
				that._handleFiltersChange(this.getIndex());
			}
		});
		this._aQuadrants.push(oQuad);
		this.setAggregation("_quad" + i, oQuad);
	}	
	this._aQuadrants[0].getLinkClouds()[0].addDelegate({
		onAfterRendering: function(e) {
			that._setVariantsFilterItems(0);
		}
	});
	
	this._aQuadrants[1].getLinkClouds()[0].addDelegate({
		onAfterRendering: function(e) {
			that._setVariantsFilterItems(1);
		}
	});
	
	this._aQuadrants[2].getLinkClouds()[0].addDelegate({
		onAfterRendering: function(e) {
			that._setVariantsFilterItems(2);
		}
	});
	
	this._aQuadrants[3].getLinkClouds()[0].addDelegate({
		onAfterRendering: function(e) {
			that._setVariantsFilterItems(3);
		}
	});
	this._oSearchBtn = new sap.m.Button(this.getId() + "-search", {
		icon : "sap-icon://initiative",
		press : function() {
			that.search();
		}
	}).addStyleClass("sapSuiteUiTFSearchBtn");

	this._oSettingsBtn = new sap.m.Button(this.getId()
			+ "-master-settings-button", {
		icon : "sap-icon://action-settings"
	});

	this._oSelLstLbl = new sap.m.Label(this.getId() + "-selection-list-label", {
		text : this._oRb.getText("TARGETFILTER_YOUR_SELECTION_TEXT") + " (0)", 
		labelFor : this.getId() + "-selection-list"
	}).addStyleClass("sapSuiteUiTFSelLstLbl");

	this._oSelLst = new sap.m.List(this.getId() + "-selection-list", {
		mode : "Delete",
		"delete" : function(oEvent) {
			// after deletion put the focus back to the list
			this.attachEventOnce("updateFinished", this.focus, this);
			var oItem = oEvent.getParameter("listItem");
			that._aQuadrants[oItem.getIndex()].removeFilter(oItem.getKey());
		},
		growing : true
	});

	this._oScrollCont = new sap.m.ScrollContainer(this.getId() + "-scrl-cntnr", {
		horizontal : false,
		vertical : true,
		height : "17rem",
		content : this._oSelLst
	}).addStyleClass("sapSuiteUiTFScroll");
	
	this._oShowSelLbl = new sap.m.Link(this.getId() + "-show-selected-label", {
		press: function() {
			that.search();
		}
	}).addStyleClass("sapSuiteUiTFShowSelLbl");

	this._oShowSelBox = new sap.m.HBox(this.getId() + "-selection-box", {
		items : [ this._oSearchBtn, this._oShowSelLbl ]
	}).addStyleClass("sapSuiteUiTFShowSelBox");

	this._oRightPanel = new sap.m.VBox(this.getId() + "-right-panel-box", {
		items : [ this._oSelLstLbl,	this._oScrollCont, this._oShowSelBox ]
	}).addStyleClass("sapSuiteUiTFRightPanelBox");

	this._oCountDisplay = new sap.suite.ui.commons.TargetFilterCountDisplay();
	this.setAggregation("_countDisplay", this._oCountDisplay);
	
	this._oShowSelectedLink = new sap.m.Link(this.getId() + "-show-selected-link", {
		text: this._oRb.getText("TARGETFILTER_SHOW_ALL_TEXT"),
		press: function() {
			that.search();
		}
	});
	
	this._oSavedFiltersSet = {};
	this._oVariants = {};

	jQuery.sap.require("sap.ui.comp.variants.VariantManagement");

	this.oVariantManagement = new sap.ui.comp.variants.VariantManagement({
		enabled: true,
		showExecuteOnSelection: true,
		showShare: true,
		save: function(oEvent) {
			that._oVariants.sSelectedId = oEvent.getParameters().key;
			that._oVariants[oEvent.getParameters().key] = {
				links: that._getFiltersSet(),
				aQuadrantsHistory: [],
				aQuadrantsCBSelected: []
			};
			for(var i = 0; i < 4; i++){
				that._oVariants[oEvent.getParameters().key].aQuadrantsCBSelected.push(that._aQuadrants[i]._oColumn.getPath());
			}
			if(that._aSelectionHistory.length != 0){
				for(var i in that._aSelectionHistory){
					that._oVariants[oEvent.getParameters().key].aQuadrantsHistory[i] = that._aSelectionHistory[i];
				}
			}
		},
		select: function(oEvent) {
			that._oVariants.sSelectedId = oEvent.getParameters().key; 
			that._oVariants[that._oVariants.sSelectedId].iQHIndex = 0;
			var aQuadrantsHistory = that._oVariants[that._oVariants.sSelectedId].aQuadrantsHistory;
			if (aQuadrantsHistory.length != 0) {
				that._oVariants.steps = [];
				for (var i in aQuadrantsHistory) {
					that._oVariants.steps[aQuadrantsHistory[i]] = 2;
				}
				that._setVariantsFilterItems(aQuadrantsHistory[0]);				
			} else {
				// update ComboBox for all quadrants
				var aCBSelected = that._oVariants[that._oVariants.sSelectedId].aQuadrantsCBSelected;
				for (var i = 0; i < aCBSelected.length; i++) {
					that.setQuadCBoxItem(i, aCBSelected[i]);
				}
				var iQuad = that._aSelectionHistory[0];
				if( that._aSelectionHistory.length != 0){
					that._aQuadrants[iQuad]._oFilters = {};
					that._aQuadrants[iQuad].getLinkClouds()[0].updateVisibleLinks();
					that._handleFiltersChange(iQuad);
				}
			}
		}
	});
	sap.ui.Device.resize.attachHandler(this._calcWidthTargetWidthRPanel);
	this.addDelegate({
		onAfterRendering: function(e) {
			that._calcWidthTargetWidthRPanel();
		}
	});
    this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
};

sap.suite.ui.commons.TargetFilter.prototype._calcWidthTargetWidthRPanel = function(oEvent){
	/*
	 *  -	Widen center up to 4 rem, then widen side margins 
	 */
	var iStartResizing = 1024;
	var iOneRem = 16;
	var iRemWidth = Math.min(3,Math.max(0, (parseInt(jQuery('.sapMFlexItem').css("width")) - iStartResizing) / iOneRem));
	jQuery('.sapUiMedia-Std-Desktop .sapSuiteUiTFRightPanel').css("margin-left", iRemWidth+"rem");
}

sap.suite.ui.commons.TargetFilter.prototype._setVariantsFilterItems = function(iQuad) {
	if(this._oVariants.steps && this._oVariants.steps[iQuad] != null){
		if( this._oVariants[this._oVariants.sSelectedId].iQHIndex>4 ||
			this._aQuadrants[iQuad].getLinkClouds()[0].getLinks().length == 0 ||
			this._oVariants[this._oVariants.sSelectedId].aQuadrantsHistory[this._oVariants[this._oVariants.sSelectedId].iQHIndex] != iQuad){
			return;
		}
		switch (this._oVariants.steps[iQuad]){
			case 2: // ComboBox Update
				this._oVariants.steps[iQuad] = 1;
				if(!this.setQuadCBoxItem(iQuad, this._oVariants[this._oVariants.sSelectedId].aQuadrantsCBSelected[iQuad])){
					this._setVariantsFilterItems(iQuad);
				}
				break;
			
			case 1: // setup Filters from saved variant
				this._oVariants.steps[iQuad] = null;
				this._oVariants[this._oVariants.sSelectedId].iQHIndex++;
				var oLinks = this._oVariants[this._oVariants.sSelectedId].links[this._oVariants[this._oVariants.sSelectedId].aQuadrantsCBSelected[iQuad]];
				if(!oLinks){
					break;
				}
				this._aQuadrants[iQuad]._oFilters = {};
				var aQuadLinks = this._aQuadrants[iQuad].getLinkClouds()[0].getLinks();
				
				for(var sLink in oLinks){
					for(var i in aQuadLinks) {
						if(aQuadLinks[i].getKey() == sLink){
							this._aQuadrants[iQuad]._oFilters[sLink] = {
								filter: new sap.ui.model.Filter(this._aQuadrants[iQuad]._oColumn.getPath(), sap.ui.model.FilterOperator.EQ, sLink),
								linkId: aQuadLinks[i].getId(),
								text: aQuadLinks[i].getText()
							};
							aQuadLinks[i].setEmphasized(true).setSubtle(false);
						}
					}
				}
				this._aQuadrants[iQuad].getLinkClouds()[0].updateVisibleLinks();		
				this._handleFiltersChange(iQuad);
				break;
		}
	}
}

sap.suite.ui.commons.TargetFilter.prototype.setQuadCBoxItem = function (iQuad, sName) {
	if(this._aQuadrants[iQuad]._oColumn.getPath() == sName){
		return false;
	}
	var oNamesCBox = {};
	var aItemsCB = this._aQuadrants[iQuad]._oFilterCb.getItems(); 
	for(var i=0; i < aItemsCB.length; i++) {
		oNamesCBox[sap.ui.getCore().byId(aItemsCB[i].getKey()).getPath()] = aItemsCB[i].getKey();
	}
	if(oNamesCBox[sName]){
		this._aQuadrants[iQuad].setColumn(oNamesCBox[sName]);
		return true;
	}
	return false;
}

sap.suite.ui.commons.TargetFilter.prototype.search = function() {
	this.fireSearch();
	this._oSavedFiltersSet = this._getFiltersSet();
	return this;
};

sap.suite.ui.commons.TargetFilter.prototype._getFiltersSet = function() {
	var oFiltersSet = {};
	
	for (var i = 0; i < this._aQuadrants.length; i++) {
		var aFilters = this._aQuadrants[i].getFiltersSet();
		var oQuadFiltersSet = {};
		
		for (var y = 0; y < aFilters.length; y++) {
			oQuadFiltersSet[aFilters[y].key] = {};
		}
		
		if (aFilters.length) {
			oFiltersSet[this._aQuadrants[i]._oColumn.getPath()] = oQuadFiltersSet;
		}
	}
	
	return oFiltersSet;
};

sap.suite.ui.commons.TargetFilter.prototype.getParameters = function() {
	return {};
};

sap.suite.ui.commons.TargetFilter.prototype.getFilters = function() {
	var aFilters = [];
	
	for (var i = 0; i < this._aSelectionHistory.length; i++) {
		var oFilter = this._aQuadrants[this._aSelectionHistory[i]].getFilters();
		if(oFilter){
			aFilters.push(oFilter);
		}
	}

	if (aFilters.length) {
		return [new sap.ui.model.Filter(aFilters, true)];
	} else {
		return aFilters;
	}	
};

sap.suite.ui.commons.TargetFilter.prototype._handleFiltersChange = function(iQuad) {
	this.iCountFilters = 0;
	
	var iQuadHistoryIndex = this._aSelectionHistory.indexOf(iQuad);
	if (iQuadHistoryIndex == -1) {
		this._aSelectionHistory.push(iQuad);
	} else {
		this._aSelectionHistory.splice(this._aQuadrants[iQuad].hasFilters() ? iQuadHistoryIndex + 1 : iQuadHistoryIndex);
	}
	
	this._oSelLst.removeAllItems();
	
	for (var i = 0; i < this._aSelectionHistory.length; i++) {
		var aFilters = this._aQuadrants[this._aSelectionHistory[i]].getFiltersSet();
		
		if (aFilters.length) {
			var oItem = new sap.m.GroupHeaderListItem({
				title : this._aQuadrants[this._aSelectionHistory[i]]._oColumn.getTitle(),
				upperCase: false
			});
			
			this._oSelLst.addItem(oItem);
			
			for (var y = 0; y < aFilters.length; y++) {
				var oItem = new sap.suite.ui.commons.TargetFilterListItem({
					title : aFilters[y].text,
					key: aFilters[y].key,
					index: this._aSelectionHistory[i]
				});
				this._oSelLst.addItem(oItem);
				this.iCountFilters++;
			}			
		}
	}
	this._oSelLst.rerender();
	
	var aFilters = this.getFilters();
	for (var i = 0; i < this._aQuadrants.length; i++) {
		iQuadHistoryIndex = this._aSelectionHistory.indexOf(i);
		if (iQuadHistoryIndex == -1 && iQuad != i) {
			this._aQuadrants[i].filter(aFilters);			
		}
	}
	this._oCountDisplay.filter(aFilters);
	
	this.fireFilterChange();
	
	var oCurrentFiltersSet = this._getFiltersSet();
	
	if (this.equalFiltersSet(oCurrentFiltersSet, this._oSavedFiltersSet)) {
		this.fireCancel();
	}
	
	this._oSelLstLbl.setText(this._oRb.getText("TARGETFILTER_YOUR_SELECTION_TEXT") + " (" + this.iCountFilters +")");
};

sap.suite.ui.commons.TargetFilter.prototype.equalFiltersSet = function(oFilterSet1, oFilterSet2) {
	var aFilterNames1 = Object.getOwnPropertyNames(oFilterSet1);
	var aFilterNames2 = Object.getOwnPropertyNames(oFilterSet2);
	
	if (aFilterNames1.length != aFilterNames2.length) {
		return false;
	}
	
	for (var i = 0; i < aFilterNames1.length; i++) {
		var sFilterName = aFilterNames1[i];
		
		if (!oFilterSet2.hasOwnProperty(sFilterName) || 
				!this.equalFiltersSet(oFilterSet1[sFilterName], oFilterSet2[sFilterName])) {
			return false;
		}
	}
	
	return true;
};

sap.suite.ui.commons.TargetFilter.prototype._bindModel = function() {
	if (this._bBindModel) {
		this._bBindModel = false;


		for (var i = 0; i < this._aQuadrants.length; i++) {
			this._aQuadrants[i].rebindColumns();
		}
		
		var that = this;
		this._oCountDisplay.bindAggregation("counts", {
			path : "/" + this.getEntitySet(),
			parameters : {
				select : this.getMeasureColumn().getPath()
			},
			length : 1,
			template : new sap.suite.ui.commons.TargetFilterCount({
				count: {
					path: this.getMeasureColumn().getPath(),
					type: this.getMeasureColumn().getType()
				},
				countUpdated: function() {
					that._oShowSelLbl.setText(that._oRb.getText((that.iCountFilters > 0)? "TARGETFILTER_SHOW_SELECTED_TEXT" : "TARGETFILTER_SHOW_ALL_TEXT") + " (" + this.getCount() +")");
				}
			})
		});
	}
};

sap.suite.ui.commons.TargetFilter.prototype._callMethodInManagedObject = function(
		sFunctionName, sEntityName) {
	if (sEntityName === "columns" || sEntityName === "entitySet"
			|| sEntityName === "measureColumnName") {
		this._bBindModel = true;
	}
	var args = Array.prototype.slice.call(arguments);
	return sap.ui.core.Control.prototype[sFunctionName].apply(this, args
			.slice(1));
};

sap.suite.ui.commons.TargetFilter.prototype.setProperty = function(sProp,
		oValue, bSuppressInvalidate) {
	this._callMethodInManagedObject("setProperty", sProp, oValue,
			bSuppressInvalidate);
	return this;
};

sap.suite.ui.commons.TargetFilter.prototype.insertAggregation = function(
		sAggregationName, oObject, iIndex, bSuppressInvalidate) {
	this._callMethodInManagedObject("insertAggregation", sAggregationName,
			oObject, iIndex, bSuppressInvalidate);
	return this;
};

sap.suite.ui.commons.TargetFilter.prototype.addAggregation = function(
		sAggregationName, oObject, bSuppressInvalidate) {
	this._callMethodInManagedObject("addAggregation", sAggregationName,
			oObject, bSuppressInvalidate);
	return this;
};

sap.suite.ui.commons.TargetFilter.prototype.removeAggregation = function(
		sAggregationName, oObject, bSuppressInvalidate) {
	return this._callMethodInManagedObject("removeAggregation",
			sAggregationName, oObject, bSuppressInvalidate);
};

sap.suite.ui.commons.TargetFilter.prototype.removeAllAggregation = function(
		sAggregationName, bSuppressInvalidate) {
	return this._callMethodInManagedObject("removeAllAggregation",
			sAggregationName, bSuppressInvalidate);
};

sap.suite.ui.commons.TargetFilter.prototype.destroyAggregation = function(
		sAggregationName, bSuppressInvalidate) {
	this._callMethodInManagedObject("destroyAggregation", sAggregationName,
			bSuppressInvalidate);
	return this;
};

sap.suite.ui.commons.TargetFilter.prototype.onBeforeRendering = function() {
	this._bindModel();
};

sap.suite.ui.commons.TargetFilter.prototype.onAfterRendering = function() {
	var that = this;
	this._oShowSelBox.$().attr("tabindex", "0");
	this._oShowSelBox.addDelegate({
		onkeypress: function(oEvent) {
			if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
				that._oSearchBtn.firePress();
				oEvent.preventDefault();
			}
		}
	});
	this._oShowSelLbl.$().attr("tabindex", "-1");
	this._oSearchBtn.$().attr("tabindex", "-1");
};

sap.suite.ui.commons.TargetFilter.prototype.exit = function() {
	sap.ui.Device.media.detachHandler(this.rerender, this,
			sap.ui.Device.media.RANGESETS.SAP_STANDARD);
			
	this._oSearchBtn.destroy();
	this._oSettingsBtn.destroy();
	this._oSelLstLbl.destroy();
	this._oSelLst.destroy();
	this._oScrollCont.destroy();
	this._oShowSelLbl.destroy();
	this._oShowSelBox.destroy();
	this._oRightPanel.destroy();
	this._oShowSelectedLink.destroy();
};
