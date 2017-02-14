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

// Provides control sap.suite.ui.commons.Timeline.
jQuery.sap.declare("sap.suite.ui.commons.Timeline");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new Timeline.
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
 * <li>{@link #getData data} : object</li>
 * <li>{@link #getSortOldestFirst sortOldestFirst} : boolean (default: false)</li>
 * <li>{@link #getAxisOrientation axisOrientation} : sap.suite.ui.commons.TimelineAxisOrientation (default: sap.suite.ui.commons.TimelineAxisOrientation.Vertical)</li>
 * <li>{@link #getAlignment alignment} : sap.suite.ui.commons.TimelineAlignment (default: sap.suite.ui.commons.TimelineAlignment.Right)</li>
 * <li>{@link #getShowIcons showIcons} : boolean (default: true)</li>
 * <li>{@link #getNoDataText noDataText} : string</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize (default: '100%')</li>
 * <li>{@link #getEnableBusyIndicator enableBusyIndicator} : boolean (default: true)</li>
 * <li>{@link #getShowHeaderBar showHeaderBar} : boolean (default: true)</li>
 * <li>{@link #getGrowing growing} : boolean (default: true)</li>
 * <li>{@link #getGrowingThreshold growingThreshold} : int (default: 5)</li>
 * <li>{@link #getVisible visible} : boolean (default: true)</li>
 * <li>{@link #getEnableBackendFilter enableBackendFilter} : boolean (default: false)</li>
 * <li>{@link #getEnableAllInFilterItem enableAllInFilterItem} : boolean (default: true)</li>
 * <li>{@link #getEnableSocial enableSocial} : boolean (default: false)</li>
 * <li>{@link #getShowSuggestion showSuggestion} : boolean (default: true)</li>
 * <li>{@link #getEnableScroll enableScroll} : boolean (default: true)</li>
 * <li>{@link #getForceGrowing forceGrowing} : boolean (default: false)</li>
 * <li>{@link #getSort sort} : boolean (default: true)</li>
 * <li>{@link #getShowFilterBar showFilterBar} : boolean (default: true)</li>
 * <li>{@link #getShowSearch showSearch} : boolean (default: true)</li>
 * <li>{@link #getGroup group} : boolean (default: false)</li>
 * <li>{@link #getGroupBy groupBy} : string</li>
 * <li>{@link #getEnableDoubleSided enableDoubleSided} : boolean (default: false)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getContent content} : sap.suite.ui.commons.TimelineItem[]</li>
 * <li>{@link #getFilterList filterList} : sap.suite.ui.commons.TimelineFilterListItem[]</li>
 * <li>{@link #getSuggestionItems suggestionItems} : sap.m.StandardListItem[]</li>
 * <li>{@link #getCustomFilter customFilter} : sap.ui.core.Control</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.Timeline#event:filterSelectionChange filterSelectionChange} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.Timeline#event:select select} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.Timeline#event:addPost addPost} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.Timeline#event:suggest suggest} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.Timeline#event:suggestionItemSelected suggestionItemSelected} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.Timeline#event:grow grow} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.suite.ui.commons.Timeline#event:filterOpen filterOpen} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Timeline Control for sFin.
 * @extends sap.ui.core.Control
 * @version 1.44.5
 *
 * @constructor
 * @public
 * @name sap.suite.ui.commons.Timeline
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.Timeline", { metadata : {

	publicMethods : [
		// methods
		"getCurrentFilter", "setCurrentFilter", "setSuspendSocialFeature", "getSuspendSocailFeature", "setCustomMessage", "getHeaderBar", "getMessageStrip", "adjustUI"
	],
	library : "sap.suite.ui.commons",
	properties : {

		/**
		 * Data for Timeline Control..
		 */
		"data" : {type : "object", group : "Misc", defaultValue : null},

		/**
		 * Whether the oldest item will be displayed first.
		 */
		"sortOldestFirst" : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * Timeline axis orientation.
		 */
		"axisOrientation" : {type : "sap.suite.ui.commons.TimelineAxisOrientation", group : "Misc", defaultValue : sap.suite.ui.commons.TimelineAxisOrientation.Vertical},

		/**
		 * Timeline item alignment.
		 */
		"alignment" : {type : "sap.suite.ui.commons.TimelineAlignment", group : "Misc", defaultValue : sap.suite.ui.commons.TimelineAlignment.Right},

		/**
		 * Show icon on each Timeline item.
		 */
		"showIcons" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * This text is displayed when the control has no data.
		 */
		"noDataText" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Sets the width of the Timeline.
		 */
		"width" : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

		/**
		 * When this property is set to "true", Timeline will display a busy indicator when data is being loaded.This BusyIndicator blocks the interaction with the items until data loading is finished.
		 */
		"enableBusyIndicator" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Show header tool bar
		 */
		"showHeaderBar" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Sets the growing(paging) feature of control. This feature only works with model binding for aggregation "content".
		 */
		"growing" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Number of items requested from the server. To activate this you should set "growing" property to "true".
		 */
		"growingThreshold" : {type : "int", group : "Misc", defaultValue : 5},

		/**
		 * Set Timeline control visibility
		 */
		"visible" : {type : "boolean", group : "Appearance", defaultValue : true},

		/**
		 * This flag enables to get data from backend instead of deriving filter values from front-end values(displayed list).
		 */
		"enableBackendFilter" : {type : "boolean", group : "", defaultValue : false},

		/**
		 * This flag enables to add 'All' in the begining of filter list
		 */
		"enableAllInFilterItem" : {type : "boolean", group : "Behavior", defaultValue : true},

		/**
		 * enable Jam Integration
		 */
		"enableSocial" : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * If this is set to true, suggest event is fired when user types in the input. Changing the suggestItems aggregation in suggest event listener will show suggestions within a popup.
		 * @since 1.26.1
		 */
		"showSuggestion" : {type : "boolean", group : "Behavior", defaultValue : true},

		/**
		 * Enable scroll bar display
		 */
		"enableScroll" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * If set to true, the "More" button will always show.
		 */
		"forceGrowing" : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * Allow only latest first sort when Sort is checked, otherwise display order in which data is received.
		 */
		"sort" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Set timeline filterbar visibility
		 */
		"showFilterBar" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Set timeline search field visibility
		 */
		"showSearch" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Set if timeline items need to be grouped by year
		 */
		"group" : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * Set timeline group by field - Supports Date field only
		 */
		"groupBy" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * If set to true, timeline items will render on both sides
		 */
		"enableDoubleSided" : {type : "boolean", group : "Misc", defaultValue : false}
	},
	aggregations : {

		/**
		 * List of Timeline Items.
		 */
		"content" : {type : "sap.suite.ui.commons.TimelineItem", multiple : true, singularName : "content"}, 

		/**
		 * sap.suite.ui.commons/TimelineFilterListItem
		 */
		"filterList" : {type : "sap.suite.ui.commons.TimelineFilterListItem", multiple : true, singularName : "filterList"}, 

		/**
		 * Items for suggestions
		 */
		"suggestionItems" : {type : "sap.m.StandardListItem", multiple : true, singularName : "suggestionItem"}, 

		/**
		 * Provide Custom Filter here
		 */
		"customFilter" : {type : "sap.ui.core.Control", multiple : false}
	},
	events : {

		/**
		 * This event is getting triggered after selecting an item from filter list.
		 */
		"filterSelectionChange" : {
			parameters : {

				/**
				 * filterClose event returns selected key value from filterList
				 */
				"selectedItem" : {type : "sap.suite.ui.commons.TimelineFilterListItem"}
			}
		}, 

		/**
		 * Select Timeline Item
		 */
		"select" : {
			parameters : {

				/**
				 * Selected TimelineItem
				 */
				"selectedItem" : {type : "sap.suite.ui.commons.TimelineItem"}
			}
		}, 

		/**
		 * Event fire when user add a new post
		 */
		"addPost" : {
			parameters : {

				/**
				 * post message
				 */
				"value" : {type : "string"}
			}
		}, 

		/**
		 * This event is fired when user types in the input and showSuggestion is set to true. Changing the suggestItems aggregation will show the suggestions within a popup.
		 * @since 1.26.1
		 */
		"suggest" : {
			parameters : {

				/**
				 * The current value which has been typed in the input.
				 */
				"suggestValue" : {type : "string"}
			}
		}, 

		/**
		 * This event is fired when suggestionItem shown in suggestion popup are selected. This event is only fired when showSuggestion is set to true and there are suggestionItems shown in the suggestion popup.
		 * @since 1.26.1
		 */
		"suggestionItemSelected" : {
			parameters : {

				/**
				 * This is the item selected in the suggestion popup.
				 */
				"selectedItem" : {type : "sap.ui.core.Item"}
			}
		}, 

		/**
		 * this event is fired when "More" button is clicked.
		 */
		"grow" : {}, 

		/**
		 * event is fired when filter icon is clicked and filter open
		 */
		"filterOpen" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.Timeline with name <code>sClassName</code> 
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
 * @name sap.suite.ui.commons.Timeline.extend
 * @function
 */

sap.suite.ui.commons.Timeline.M_EVENTS = {'filterSelectionChange':'filterSelectionChange','select':'select','addPost':'addPost','suggest':'suggest','suggestionItemSelected':'suggestionItemSelected','grow':'grow','filterOpen':'filterOpen'};


/**
 * Getter for property <code>data</code>.
 * Data for Timeline Control..
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>data</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getData
 * @function
 */

/**
 * Setter for property <code>data</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oData  new value for property <code>data</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setData
 * @function
 */


/**
 * Getter for property <code>sortOldestFirst</code>.
 * Whether the oldest item will be displayed first.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>sortOldestFirst</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getSortOldestFirst
 * @function
 */

/**
 * Setter for property <code>sortOldestFirst</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bSortOldestFirst  new value for property <code>sortOldestFirst</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setSortOldestFirst
 * @function
 */


/**
 * Getter for property <code>axisOrientation</code>.
 * Timeline axis orientation.
 *
 * Default value is <code>Vertical</code>
 *
 * @return {sap.suite.ui.commons.TimelineAxisOrientation} the value of property <code>axisOrientation</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getAxisOrientation
 * @function
 */

/**
 * Setter for property <code>axisOrientation</code>.
 *
 * Default value is <code>Vertical</code> 
 *
 * @param {sap.suite.ui.commons.TimelineAxisOrientation} oAxisOrientation  new value for property <code>axisOrientation</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setAxisOrientation
 * @function
 */


/**
 * Getter for property <code>alignment</code>.
 * Timeline item alignment.
 *
 * Default value is <code>Right</code>
 *
 * @return {sap.suite.ui.commons.TimelineAlignment} the value of property <code>alignment</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getAlignment
 * @function
 */

/**
 * Setter for property <code>alignment</code>.
 *
 * Default value is <code>Right</code> 
 *
 * @param {sap.suite.ui.commons.TimelineAlignment} oAlignment  new value for property <code>alignment</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setAlignment
 * @function
 */


/**
 * Getter for property <code>showIcons</code>.
 * Show icon on each Timeline item.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showIcons</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getShowIcons
 * @function
 */

/**
 * Setter for property <code>showIcons</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowIcons  new value for property <code>showIcons</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setShowIcons
 * @function
 */


/**
 * Getter for property <code>noDataText</code>.
 * This text is displayed when the control has no data.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>noDataText</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getNoDataText
 * @function
 */

/**
 * Setter for property <code>noDataText</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sNoDataText  new value for property <code>noDataText</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setNoDataText
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * Sets the width of the Timeline.
 *
 * Default value is <code>100%</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is <code>100%</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setWidth
 * @function
 */


/**
 * Getter for property <code>enableBusyIndicator</code>.
 * When this property is set to "true", Timeline will display a busy indicator when data is being loaded.This BusyIndicator blocks the interaction with the items until data loading is finished.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>enableBusyIndicator</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getEnableBusyIndicator
 * @function
 */

/**
 * Setter for property <code>enableBusyIndicator</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bEnableBusyIndicator  new value for property <code>enableBusyIndicator</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setEnableBusyIndicator
 * @function
 */


/**
 * Getter for property <code>showHeaderBar</code>.
 * Show header tool bar
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showHeaderBar</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getShowHeaderBar
 * @function
 */

/**
 * Setter for property <code>showHeaderBar</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowHeaderBar  new value for property <code>showHeaderBar</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setShowHeaderBar
 * @function
 */


/**
 * Getter for property <code>growing</code>.
 * Sets the growing(paging) feature of control. This feature only works with model binding for aggregation "content".
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>growing</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getGrowing
 * @function
 */

/**
 * Setter for property <code>growing</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bGrowing  new value for property <code>growing</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setGrowing
 * @function
 */


/**
 * Getter for property <code>growingThreshold</code>.
 * Number of items requested from the server. To activate this you should set "growing" property to "true".
 *
 * Default value is <code>5</code>
 *
 * @return {int} the value of property <code>growingThreshold</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getGrowingThreshold
 * @function
 */

/**
 * Setter for property <code>growingThreshold</code>.
 *
 * Default value is <code>5</code> 
 *
 * @param {int} iGrowingThreshold  new value for property <code>growingThreshold</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setGrowingThreshold
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 * Set Timeline control visibility
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setVisible
 * @function
 */


/**
 * Getter for property <code>enableBackendFilter</code>.
 * This flag enables to get data from backend instead of deriving filter values from front-end values(displayed list).
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>enableBackendFilter</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getEnableBackendFilter
 * @function
 */

/**
 * Setter for property <code>enableBackendFilter</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bEnableBackendFilter  new value for property <code>enableBackendFilter</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setEnableBackendFilter
 * @function
 */


/**
 * Getter for property <code>enableAllInFilterItem</code>.
 * This flag enables to add 'All' in the begining of filter list
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>enableAllInFilterItem</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getEnableAllInFilterItem
 * @function
 */

/**
 * Setter for property <code>enableAllInFilterItem</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bEnableAllInFilterItem  new value for property <code>enableAllInFilterItem</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setEnableAllInFilterItem
 * @function
 */


/**
 * Getter for property <code>enableSocial</code>.
 * enable Jam Integration
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>enableSocial</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getEnableSocial
 * @function
 */

/**
 * Setter for property <code>enableSocial</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bEnableSocial  new value for property <code>enableSocial</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setEnableSocial
 * @function
 */


/**
 * Getter for property <code>showSuggestion</code>.
 * If this is set to true, suggest event is fired when user types in the input. Changing the suggestItems aggregation in suggest event listener will show suggestions within a popup.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showSuggestion</code>
 * @public
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#getShowSuggestion
 * @function
 */

/**
 * Setter for property <code>showSuggestion</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowSuggestion  new value for property <code>showSuggestion</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#setShowSuggestion
 * @function
 */


/**
 * Getter for property <code>enableScroll</code>.
 * Enable scroll bar display
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>enableScroll</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getEnableScroll
 * @function
 */

/**
 * Setter for property <code>enableScroll</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bEnableScroll  new value for property <code>enableScroll</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setEnableScroll
 * @function
 */


/**
 * Getter for property <code>forceGrowing</code>.
 * If set to true, the "More" button will always show.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>forceGrowing</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getForceGrowing
 * @function
 */

/**
 * Setter for property <code>forceGrowing</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bForceGrowing  new value for property <code>forceGrowing</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setForceGrowing
 * @function
 */


/**
 * Getter for property <code>sort</code>.
 * Allow only latest first sort when Sort is checked, otherwise display order in which data is received.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>sort</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getSort
 * @function
 */

/**
 * Setter for property <code>sort</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bSort  new value for property <code>sort</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setSort
 * @function
 */


/**
 * Getter for property <code>showFilterBar</code>.
 * Set timeline filterbar visibility
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showFilterBar</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getShowFilterBar
 * @function
 */

/**
 * Setter for property <code>showFilterBar</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowFilterBar  new value for property <code>showFilterBar</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setShowFilterBar
 * @function
 */


/**
 * Getter for property <code>showSearch</code>.
 * Set timeline search field visibility
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showSearch</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getShowSearch
 * @function
 */

/**
 * Setter for property <code>showSearch</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowSearch  new value for property <code>showSearch</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setShowSearch
 * @function
 */


/**
 * Getter for property <code>group</code>.
 * Set if timeline items need to be grouped by year
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>group</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getGroup
 * @function
 */

/**
 * Setter for property <code>group</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bGroup  new value for property <code>group</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setGroup
 * @function
 */


/**
 * Getter for property <code>groupBy</code>.
 * Set timeline group by field - Supports Date field only
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>groupBy</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getGroupBy
 * @function
 */

/**
 * Setter for property <code>groupBy</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sGroupBy  new value for property <code>groupBy</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setGroupBy
 * @function
 */


/**
 * Getter for property <code>enableDoubleSided</code>.
 * If set to true, timeline items will render on both sides
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>enableDoubleSided</code>
 * @public
 * @name sap.suite.ui.commons.Timeline#getEnableDoubleSided
 * @function
 */

/**
 * Setter for property <code>enableDoubleSided</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bEnableDoubleSided  new value for property <code>enableDoubleSided</code>
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setEnableDoubleSided
 * @function
 */


/**
 * Getter for aggregation <code>content</code>.<br/>
 * List of Timeline Items.
 * 
 * @return {sap.suite.ui.commons.TimelineItem[]}
 * @public
 * @name sap.suite.ui.commons.Timeline#getContent
 * @function
 */


/**
 * Inserts a content into the aggregation named <code>content</code>.
 *
 * @param {sap.suite.ui.commons.TimelineItem}
 *          oContent the content to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the content should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the content is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the content is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#insertContent
 * @function
 */

/**
 * Adds some content <code>oContent</code> 
 * to the aggregation named <code>content</code>.
 *
 * @param {sap.suite.ui.commons.TimelineItem}
 *            oContent the content to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#addContent
 * @function
 */

/**
 * Removes an content from the aggregation named <code>content</code>.
 *
 * @param {int | string | sap.suite.ui.commons.TimelineItem} vContent the content to remove or its index or id
 * @return {sap.suite.ui.commons.TimelineItem} the removed content or null
 * @public
 * @name sap.suite.ui.commons.Timeline#removeContent
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>content</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.TimelineItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.Timeline#removeAllContent
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.TimelineItem</code> in the aggregation named <code>content</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.TimelineItem}
 *            oContent the content whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.Timeline#indexOfContent
 * @function
 */
	

/**
 * Destroys all the content in the aggregation 
 * named <code>content</code>.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#destroyContent
 * @function
 */


/**
 * Getter for aggregation <code>filterList</code>.<br/>
 * sap.suite.ui.commons/TimelineFilterListItem
 * 
 * @return {sap.suite.ui.commons.TimelineFilterListItem[]}
 * @public
 * @name sap.suite.ui.commons.Timeline#getFilterList
 * @function
 */


/**
 * Inserts a filterList into the aggregation named <code>filterList</code>.
 *
 * @param {sap.suite.ui.commons.TimelineFilterListItem}
 *          oFilterList the filterList to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the filterList should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the filterList is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the filterList is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#insertFilterList
 * @function
 */

/**
 * Adds some filterList <code>oFilterList</code> 
 * to the aggregation named <code>filterList</code>.
 *
 * @param {sap.suite.ui.commons.TimelineFilterListItem}
 *            oFilterList the filterList to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#addFilterList
 * @function
 */

/**
 * Removes an filterList from the aggregation named <code>filterList</code>.
 *
 * @param {int | string | sap.suite.ui.commons.TimelineFilterListItem} vFilterList the filterList to remove or its index or id
 * @return {sap.suite.ui.commons.TimelineFilterListItem} the removed filterList or null
 * @public
 * @name sap.suite.ui.commons.Timeline#removeFilterList
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>filterList</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.TimelineFilterListItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.Timeline#removeAllFilterList
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.TimelineFilterListItem</code> in the aggregation named <code>filterList</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.TimelineFilterListItem}
 *            oFilterList the filterList whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.Timeline#indexOfFilterList
 * @function
 */
	

/**
 * Destroys all the filterList in the aggregation 
 * named <code>filterList</code>.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#destroyFilterList
 * @function
 */


/**
 * Getter for aggregation <code>suggestionItems</code>.<br/>
 * Items for suggestions
 * 
 * @return {sap.m.StandardListItem[]}
 * @public
 * @name sap.suite.ui.commons.Timeline#getSuggestionItems
 * @function
 */


/**
 * Inserts a suggestionItem into the aggregation named <code>suggestionItems</code>.
 *
 * @param {sap.m.StandardListItem}
 *          oSuggestionItem the suggestionItem to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the suggestionItem should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the suggestionItem is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the suggestionItem is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#insertSuggestionItem
 * @function
 */

/**
 * Adds some suggestionItem <code>oSuggestionItem</code> 
 * to the aggregation named <code>suggestionItems</code>.
 *
 * @param {sap.m.StandardListItem}
 *            oSuggestionItem the suggestionItem to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#addSuggestionItem
 * @function
 */

/**
 * Removes an suggestionItem from the aggregation named <code>suggestionItems</code>.
 *
 * @param {int | string | sap.m.StandardListItem} vSuggestionItem the suggestionItem to remove or its index or id
 * @return {sap.m.StandardListItem} the removed suggestionItem or null
 * @public
 * @name sap.suite.ui.commons.Timeline#removeSuggestionItem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>suggestionItems</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.m.StandardListItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.Timeline#removeAllSuggestionItems
 * @function
 */

/**
 * Checks for the provided <code>sap.m.StandardListItem</code> in the aggregation named <code>suggestionItems</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.m.StandardListItem}
 *            oSuggestionItem the suggestionItem whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.Timeline#indexOfSuggestionItem
 * @function
 */
	

/**
 * Destroys all the suggestionItems in the aggregation 
 * named <code>suggestionItems</code>.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#destroySuggestionItems
 * @function
 */


/**
 * Getter for aggregation <code>customFilter</code>.<br/>
 * Provide Custom Filter here
 * 
 * @return {sap.ui.core.Control}
 * @public
 * @name sap.suite.ui.commons.Timeline#getCustomFilter
 * @function
 */


/**
 * Setter for the aggregated <code>customFilter</code>.
 * @param {sap.ui.core.Control} oCustomFilter
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#setCustomFilter
 * @function
 */
	

/**
 * Destroys the customFilter in the aggregation 
 * named <code>customFilter</code>.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#destroyCustomFilter
 * @function
 */


/**
 * This event is getting triggered after selecting an item from filter list.
 *
 * @name sap.suite.ui.commons.Timeline#filterSelectionChange
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {sap.suite.ui.commons.TimelineFilterListItem} oControlEvent.getParameters.selectedItem filterClose event returns selected key value from filterList
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'filterSelectionChange' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself. 
 *  
 * This event is getting triggered after selecting an item from filter list.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#attachFilterSelectionChange
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'filterSelectionChange' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#detachFilterSelectionChange
 * @function
 */

/**
 * Fire event filterSelectionChange to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'selectedItem' of type <code>sap.suite.ui.commons.TimelineFilterListItem</code> filterClose event returns selected key value from filterList</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.Timeline#fireFilterSelectionChange
 * @function
 */


/**
 * Select Timeline Item
 *
 * @name sap.suite.ui.commons.Timeline#select
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {sap.suite.ui.commons.TimelineItem} oControlEvent.getParameters.selectedItem Selected TimelineItem
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'select' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself. 
 *  
 * Select Timeline Item
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#attachSelect
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'select' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#detachSelect
 * @function
 */

/**
 * Fire event select to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'selectedItem' of type <code>sap.suite.ui.commons.TimelineItem</code> Selected TimelineItem</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.Timeline#fireSelect
 * @function
 */


/**
 * Event fire when user add a new post
 *
 * @name sap.suite.ui.commons.Timeline#addPost
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.value post message
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'addPost' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself. 
 *  
 * Event fire when user add a new post
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#attachAddPost
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'addPost' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#detachAddPost
 * @function
 */

/**
 * Fire event addPost to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'value' of type <code>string</code> post message</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.Timeline#fireAddPost
 * @function
 */


/**
 * This event is fired when user types in the input and showSuggestion is set to true. Changing the suggestItems aggregation will show the suggestions within a popup.
 *
 * @name sap.suite.ui.commons.Timeline#suggest
 * @event
 * @since 1.26.1
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {string} oControlEvent.getParameters.suggestValue The current value which has been typed in the input.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'suggest' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself. 
 *  
 * This event is fired when user types in the input and showSuggestion is set to true. Changing the suggestItems aggregation will show the suggestions within a popup.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#attachSuggest
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'suggest' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#detachSuggest
 * @function
 */

/**
 * Fire event suggest to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'suggestValue' of type <code>string</code> The current value which has been typed in the input.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @protected
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#fireSuggest
 * @function
 */


/**
 * This event is fired when suggestionItem shown in suggestion popup are selected. This event is only fired when showSuggestion is set to true and there are suggestionItems shown in the suggestion popup.
 *
 * @name sap.suite.ui.commons.Timeline#suggestionItemSelected
 * @event
 * @since 1.26.1
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {sap.ui.core.Item} oControlEvent.getParameters.selectedItem This is the item selected in the suggestion popup.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'suggestionItemSelected' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself. 
 *  
 * This event is fired when suggestionItem shown in suggestion popup are selected. This event is only fired when showSuggestion is set to true and there are suggestionItems shown in the suggestion popup.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#attachSuggestionItemSelected
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'suggestionItemSelected' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#detachSuggestionItemSelected
 * @function
 */

/**
 * Fire event suggestionItemSelected to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'selectedItem' of type <code>sap.ui.core.Item</code> This is the item selected in the suggestion popup.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @protected
 * @since 1.26.1
 * @name sap.suite.ui.commons.Timeline#fireSuggestionItemSelected
 * @function
 */


/**
 * this event is fired when "More" button is clicked.
 *
 * @name sap.suite.ui.commons.Timeline#grow
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'grow' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself. 
 *  
 * this event is fired when "More" button is clicked.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#attachGrow
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'grow' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#detachGrow
 * @function
 */

/**
 * Fire event grow to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.Timeline#fireGrow
 * @function
 */


/**
 * event is fired when filter icon is clicked and filter open
 *
 * @name sap.suite.ui.commons.Timeline#filterOpen
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'filterOpen' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself. 
 *  
 * event is fired when filter icon is clicked and filter open
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.Timeline</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#attachFilterOpen
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'filterOpen' event of this <code>sap.suite.ui.commons.Timeline</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.Timeline#detachFilterOpen
 * @function
 */

/**
 * Fire event filterOpen to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.Timeline} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.Timeline#fireFilterOpen
 * @function
 */


/**
 * Get the current selected filter key
 *
 * @name sap.suite.ui.commons.Timeline#getCurrentFilter
 * @function
 * @type string
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Set the current selected filter key
 *
 * @name sap.suite.ui.commons.Timeline#setCurrentFilter
 * @function
 * @param {string} sSelectedItemKey
 *         Returns the TinelineFilterListItem
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * when set to true, the Add Post and Reply feature will be grayed out .
 *
 * @name sap.suite.ui.commons.Timeline#setSuspendSocialFeature
 * @function
 * @param {boolean} bBSuspend
 *         boolean value for suspend or not.
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * get the suspend social feature status
 *
 * @name sap.suite.ui.commons.Timeline#getSuspendSocailFeature
 * @function
 * @type boolean
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * set custom message
 *
 * @name sap.suite.ui.commons.Timeline#setCustomMessage
 * @function
 * @param {string} sMsg
 *         Message to be set
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * get the header bar control to customerize
 *
 * @name sap.suite.ui.commons.Timeline#getHeaderBar
 * @function
 * @type sap.m.Toolbar
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Get messagestrip
 *
 * @name sap.suite.ui.commons.Timeline#getMessageStrip
 * @function
 * @type sap.m.MessageStrip
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * to allow for UI layout change (public)
 *
 * @name sap.suite.ui.commons.Timeline#adjustUI
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/suite/ui/commons/Timeline.js
///**
// * This file defines behavior for the control,
// */
jQuery.sap.require("sap.m.library");
jQuery.sap.require("sap.ui.core.IconPool");
jQuery.sap.require("sap.ui.core.Icon");
jQuery.sap.require("sap.ui.core.delegate.ItemNavigation");
jQuery.sap.require("sap.suite.ui.commons.TimelineFilterListItem");
jQuery.sap.require("sap.ui.core.ResizeHandler");
jQuery.sap.require("sap.ui.Device");

sap.suite.ui.commons.Timeline.INTERNAL_MODEL_NAME = "sapsuiteuicommonsTimelineInternalModel";

sap.suite.ui.commons.Timeline.prototype.init = function() {
	this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	this._previousTarget = null;
	this._previousTabPreviousTarget = null;
	this._filterTarget = null;
	this._addTarget = null;
	this._shell = null;
	this._aRows = null;
	this._aDomRefs = null; 
	this._messageStrip = null;
	
	this._sapTabbable = null;
	this._moreButtonFound = false;
	this._pageSize = 10;
	this._addButtonFound = false;
	this._dummy = false;
	this._tabprevious = false;
	this._tabnext = false;
	this._moreTarget = null;
	this._saveTarget = null;
	this._previousShellTarget = null;
	this._previousLineItemsHeight = 0;
	this._showMorescrollLocation = 0;
	this._skipOnFocusIn = false; 
	this._previousShiftF6Target = null;
	this._outFocusTarget = null;
	this._outFocusTargetClassName = null;
	this._firstTimeSetFocus = true;
	this._headerBarFieldLength = 0;
	this._renderDblSided = false;
	this._maxTimeLineWidth = 685;
	this._groupByField = 'dateTime';
	sap.m.DisplayListItem.extend("sap.suite.ui.commons.DisplayListItemWithKey", {
		metadata : {
			properties : {
				"key" : {
					type : "string",
					defaultValue : ""
				},
			}
		},
		renderer : 'sap.m.DisplayListItemRenderer'
	});
	var that = this;
	// create an internal model.
	this._prevTargetId = "";
	this._groupByField = this.getGroupBy();
	this._internalModel = new sap.ui.model.json.JSONModel();
	this._finishLoading = true; //false;  change for cs 1570523249
	this.setModel(this._internalModel, sap.suite.ui.commons.Timeline.INTERNAL_MODEL_NAME);
	var oLocale = sap.ui.getCore().getConfiguration().getLanguage();
	this.resBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons", oLocale);
	this._emptyList = new sap.m.List();
	this._emptyList.setNoDataText(this.resBundle.getText('TIMELINE_NO_DATA'));
	this._filterIcon = new sap.m.Button(this.getId() + "-filter", {
		type : sap.m.ButtonType.Transparent,
		icon : "sap-icon://filter",
		tooltip : this.resBundle.getText("TIMELINE_FILTER_BY"),
		press : function(oEvent) {
			that._openFilterDialog();
		}
	});
	/*  per Social component, they will handle addIcon themselves
	this._addIcon = new sap.m.Button(this.getId() + "-add", {
    	type:sap.m.ButtonType.Transparent,
    	icon:"sap-icon://add",
    	tooltip : this.resBundle.getText("TIMELINE_ADD"),
    	press : function(oEvent) {			
			that._openAddDialog();
		}
    });
    */
	var oToolbarSpacer = new sap.m.ToolbarSpacer();

	this._headerBar = new sap.m.OverflowToolbar({
		id : this.getId() + "-filterToolBar",
		content : [oToolbarSpacer, this._filterIcon]
		});
		
	//if (this.getEnableBackendFilter())
	
	
		this._headerBar.setVisible(this.getShowFilterBar());

	//search feature for oData timeline items
	 this._searchField = new sap.m.SearchField(this.getId() + "-timelineSearch", {
		search: function(oEvent){
		var searchValue = oEvent.getSource().getValue();
		var oBindingInfo = that.getBindingInfo("content");
	
			var contains = sap.ui.model.FilterOperator.Contains; //filter options
			var modalEntities = that.getBinding('content').oEntityType.property; //get odata modal entities
			
			var columns = []; 
					
			//add filter columns - Search is only enabled on timeline item text, title and username
			// as we cannot search on date field
			columns.push(that.getBindingInfo('content').template.mBindingInfos.text.parts[0].path); 
			columns.push(that.getBindingInfo('content').template.mBindingInfos.title.parts[0].path);
			columns.push(that.getBindingInfo('content').template.mBindingInfos.userName.parts[0].path);
			
			//create filters based on the filter columns
			var filters = new sap.ui.model.Filter(columns.map(function(colName) {
						return new sap.ui.model.Filter(colName, contains, searchValue); }),
						false);
						
				//search
				that.getBinding("content").filter([filters]);
		
		}
	});
	
	
	this._headerBar.insertContent(oToolbarSpacer,1);
	this._headerBar.insertContent(this._filterIcon,2);
	
	var that = this; 


	this._messageStrip =  new sap.m.MessageStrip({
		close: function(oEvent) {
			this.setText("");
			if (that._lastHeaderBaRTabField !== null) {
				jQuery(that._lastHeaderBaRTabField).focus();
				oEvent.preventDefault();				
			}
		}
		});
	

	this._filterInfoText = new sap.m.Text({
		maxLines : 1,
		width : "100%"
	});
	this._headerInfoBar = new sap.m.Toolbar({
		id : this.getId() + "-filterInfoBar",
		content : [this._filterInfoText],
		design : sap.m.ToolbarDesign.Info,
		visible : false
	});
	
	this._customFilter = false;
	this._filterChange = false;
	this._contentChange = true;
	this._filterDialog = new sap.m.ResponsivePopover(this.getId() + "-popover_filter", {
		title : this.resBundle.getText("TIMELINE_FILTER_BY"),
		placement : sap.m.PlacementType.Auto,
		contentHeight : "15rem",
		contentWidth : "25rem"
	});

	var oDisplayListItemWithKey = new sap.suite.ui.commons.DisplayListItemWithKey({  
		key : "{key}",
		label : "{text}"
	});

	this._filterList = new sap.m.List(this.getId() + "-filterlist", {
		mode : sap.m.ListMode.SingleSelectMaster,
		items : {
			path : "/items",
			template : oDisplayListItemWithKey
		},
		selectionChange : function(oEvent) {
			that._searchField.setValue("");
		var oFilterText = that._filterList.getSelectedItem().getLabel();
		that._setFilterInfoText(oFilterText);
		if (that._filterList.getSelectedItem() && !that.getEnableBackendFilter()) {
				that._filterChange = true;
				that._filterText = oFilterText;
				that._resetDisplayItems(oFilterText);
			}
			that.fireFilterSelectionChange({selectedItem : that._filterList.getSelectedItem()}); // jul/17/2014
			that._currentFilterKey = that._filterList.getSelectedItem().getKey();
			that._filterDialog.close();
		}
	});

	this._filterText = this.resBundle.getText("TIMELINE_ALL");
	this._growing = false;
	if (this.getGrowing()) {
	
		this._growDisplayCount = this.getGrowingThreshold();  //max current display item count
		this._iItemCount = this.getGrowingThreshold();
		this._getMoreButton = new sap.m.Button(this.getId() + "-getmore", {
			text : this.resBundle.getText("TIMELINE_SHOW_MORE"),
			width : "100%",
			press : function() {
			
			if (document.getElementById(that.getId() + '-contentH'))	{
				that._showMorescrollLocation = document.getElementById(that.getId() + '-contentH').scrollLeft;
			} else {
				that._showMorescrollLocation = document.getElementById(that.getId() + '-content').scrollTop;
			}
				// fire the event
				that.fireGrow();
				that._iItemCount += that.getGrowingThreshold();
				var oldDisplayCount = that._growDisplayCount;
				that._growDisplayCount += that.getGrowingThreshold();
				if (that.oItemNavigation) {
					that.removeDelegate(that.oItemNavigation);
					that.oItemNavigation.destroy();
				}
				that._startItemNavigation();
				if (that._iItemCount > that.getMaxItemsCount()) {
					that._iItemCount = that.getMaxItemsCount();
				}
				var oBindingInfo = that.getBindingInfo("content");
				if (that._growing) {
					oBindingInfo.startIndex = 0;
					oBindingInfo.length = that._iItemCount;
					that.getBinding("content").getContexts(0, that._iItemCount);
					//that.updateAggregation("content");
				} else {
					that.rerender();
				}
			
				//focus on the last item preceding more button before growing was fired.
				jQuery.sap.delayedCall(300, that, function() {
					if (document.getElementById(that.getId() + '-contentH'))	{
						document.getElementById(that.getId() + '-contentH').scrollLeft =  that._showMorescrollLocation;
					} else {
						document.getElementById(that.getId() + '-content').scrollTop =	that._showMorescrollLocation ;
						}
		      });

			}
		});
	}
	
	// scrolling stuff
//	jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
//	this._oScroller = new sap.ui.core.delegate.ScrollEnablement(this, this.getId() + "-scroll", {
//		horizontal : false,
//		vertical : true,
//		zynga : false,
//		preventDefault : false,
//		nonTouchScrolling : "scrollbar"
//	});
//	this._scHeight = 0; //scroller container height
  this._scHeight = 400; //scroller container default height 400px
	this._height = 0;
	this._aFilterList = [];

// resize handler
/*	this.sResizeListenerId = null;
	if (jQuery.device.is.desktop) {
		this.sResizeListenerId = sap.ui.core.ResizeHandler.register(this, jQuery.proxy(this._performScrollChanges, this));
	} else {
		sap.ui.Device.orientation.attachHandler(this._performScrollChanges, this);
		sap.ui.Device.resize.attachHandler(this._performScrollChanges, this);
	}*/
}; // init

	
sap.suite.ui.commons.Timeline.prototype._createAddDialog = function(){
// add dialog
	var that = this;
	this._addDialog = new sap.m.Popover(this.getId() + "-popover_add", {
		title: this.resBundle.getText("TIMELINE_ADD_POST"),   
		placement: sap.m.PlacementType.Vertical,
		footer:  new sap.m.Bar({
         contentMiddle : [
				new sap.m.Button({
					text: this.resBundle.getText("TIMELINE_OK"),
				    //icon: "sap-icon://ok",
				    press: function () {
				      that._addDialog.close();
				      that._addPost();
				     
				    }
				  }),
				  new sap.m.Button({
				      text: this.resBundle.getText("TIMELINE_FILTER_CANCEL"),
				      //icon: "sap-icon://cancel",
				      press: function () {
				        that._addDialog.close();
				       
				      }
				    })
               ]
       }),
       contentHeight : "15rem",
	   contentWidth  : "15rem"
	});
    
   	this._addInput = new sap.m.TextArea({
		height: "15rem",
		width: "100%",
		liveChange: function (oEvent) {
			that._liveChange(oEvent);
		}

	}); 
};

sap.suite.ui.commons.Timeline.prototype._createSuggestionPopup = function(oInput) {
	var that = this;
	this._suggestionPopup = new sap.m.Popover(oInput.getId() + "-suggestion_popup", {
				showHeader : false,
				placement : sap.m.PlacementType.Bottom,
				contentWidth: "15rem",
				initialFocus : oInput
			}).attachAfterClose(function() {

			});
	this._overwritePopover(this._suggestionPopup, oInput);		
	this._suggestList = new sap.m.List(this.getId() + "-suggestlist", {
		showNoData: false,
		mode : sap.m.ListMode.SingleSelectMaster,

		selectionChange : function(oEvent) {
			var oItem = oEvent.getSource().getSelectedItem();
			that._suggestionPopup.close();
			var strInput = that._addInput.getValue();
			var insertVal = '';
			var desc = oItem.getDescription();
			if (desc.match(/\S+@\S+\.\S+/)) {  // if its an email address, get the first part of it
				insertVal =  "@" + desc.split('@')[0] + " ";
			} else {
				insertVal = "@" + desc + " ";
			}
			
			var newVal = that._getNewString(strInput, that._inputDiff.val, insertVal);
			that._addInput.setValue(newVal);
			that._oldAddInput = newVal;
			that.fireSuggestionItemSelected({
					//selectedItem: new sap.ui.core.Item({"text": oItem.getLabel(), "key": oItem.getValue()})
					selectedItem: oItem
			});
		}
	});	
	this._suggestionPopup.addContent(this._suggestList);	
};

sap.suite.ui.commons.Timeline.prototype._overwritePopover = function (oPopover, oInput) {
		// overwrite the internal properties to not to show the arrow in popover.
		oPopover._marginTop = 0;
		oPopover._marginLeft = 0;
		oPopover._marginRight = 0;
		oPopover._marginBottom = 0;
		oPopover._arrowOffset = 0;
		oPopover._offsets = [ "0 0", "0 0", "0 0", "0 0" ];
		oPopover._myPositions = [ "begin bottom", "begin center", "begin top", "end center" ];
		oPopover._atPositions = [ "begin top", "end center", "begin bottom", "begin center" ];

		oPopover.open = function() {
			this.openBy(oInput, false, true);
		};

		// remove animation from popover
		oPopover.oPopup.setAnimations(function($Ref, iRealDuration, fnOpened) {
			fnOpened();
		}, function($Ref, iRealDuration, fnClosed) {
			fnClosed();
		});
	};

sap.suite.ui.commons.Timeline.prototype._liveChange = function(oEvent) {
// only fire event when change is ^@ or \s@
	//should close popover if it is open
	if (this._suggestionPopup && this._suggestionPopup.isOpen()) {
		this._suggestionPopup.close();
	}
	
	var strInput = oEvent.getParameters().value;
	
	if (!this.getShowSuggestion()) {
		this._oldAddInput = strInput; 
		return;
	}
	
	//this._getCursorPosition(strInput, this._oldAddInput);
	var oInput = oEvent.getSource();
	this._inputDiff = this._getDiffWord(strInput, this._oldAddInput);
	this._lastInputOp = this._inputDiff.op;
//	if (this._lastInputOp == "A" || this._lastInputOp == "D") {
	if (this._inputDiff.val.match(/^@|\s@/g) && this._inputDiff.val.length > 1) {
			if (this._lastInputOp === "A") {
			var that = this;
			if (!this._suggestionPopup) {
				this._createSuggestionPopup(oInput);
			}
			this.fireSuggest({
					suggestValue: this._inputDiff.val
			});
	
	
			this._suggestList.destroyItems();
			var items = this.getSuggestionItems();
			
			for (var i=0; i<items.length; i++) {
				this._suggestList.addItem(new sap.m.StandardListItem({
					icon: items[i].getIcon(),
					title: items[i].getTitle(),
					description: items[i].getDescription()
				}));
			}
	
			
			this._suggestionPopup.openBy(oInput);			
		} else if (this._lastInputOp === "D") {
			//delete the whole words
			var newVal = this._getNewString(strInput, this._inputDiff.val, '');
			this._addInput.setValue(newVal);
			
		}

	} else if (this._suggestionPopup && this._inputDiff.val.length == 0) { // adding a space. should close the suggestion
		this._suggestionPopup.close();			
	}

	

	this._oldAddInput = strInput; 
};


sap.suite.ui.commons.Timeline.prototype._getCursorPosition = function(newStr, oldStr) {
	// not really accurate as in "aaaaa" situation. however, it may not matter. 
	// do we need a function to get a real position?

	if (newStr.length > oldStr.length) {
		//add
		this._lastInputOp = "A";
		for (var i=0; i<oldStr.length; i++) {
			if (newStr[i] != oldStr[i]){
				return i + 1;
			}
		}
		return newStr.length;
	} else {
		this._lastInputOp = "D";
		for (var i=0; i<newStr.length;  i++) {
			if (newStr[i] != oldStr[i]){
				return i;  
			}
		}
		return oldStr.length -1;
	}

};

sap.suite.ui.commons.Timeline.prototype._getDiffWord = function(newStr, oldStr) {
// compares the old string and new string, return the new string's diff words. If nstr words 
	var nwords = [];
	var owords = [];
	var op = "";
	if (newStr) {
		nwords = newStr.split(/\s|\r\n|\r|\n/g);
	}
	if (oldStr) {
		owords = oldStr.split(/\s|\r\n|\r|\n/g);
	}
	if (newStr.length < oldStr.length) {   // this is a delete
		op = "D";
		//this._lastInputOp = "D";
		for (var i=0; i<nwords.length; i++) {
			if (nwords[i] != owords[i]) {
				if (nwords[i] == owords[i+1]) {
					//deleting one word charactor, shouldn't matter
					return {val: "d", op: op};
				}
				else {
					return {val: nwords[i], op:op};
				}
			}
		}
		return {val: "d", op: op}; // delete the last one character, shouldn't matter
	} else {   // this is add
		op = "A";
		//this._lastInputOp = "A";
		if (nwords.length > owords.length) {
			return {val: nwords[nwords.length-1], op: op};
		}
		for (var i=0; i < owords.length; i++) {
			if (owords[i] != nwords[i]) {  // insert into existing words
				return {val: nwords[i], op: op};
			} 
		}
		return {val: " ", op: op}; // only space difference...
	}
}; 

sap.suite.ui.commons.Timeline.prototype._getNewString = function (oldStr, diff, insertStr) {
	var regi = new RegExp(diff + '$');
	return oldStr.replace(regi, insertStr);
};

//sap.suite.ui.commons.Timeline.prototype.getScrollDelegate = function() {
//	return this._oScroller;
//};
//
//sap.suite.ui.commons.Timeline.prototype.scrollTo = function(x, y, time) {
//	if (this._oScroller) {
//		if (this.getDomRef()) { // only if rendered
//			this._oScroller.scrollTo(x, y, time);
//		} else {
//			this._oScroller._scrollX = x; // remember for later rendering
//			this._oScroller._scrollY = y;
//		}
//	}
//	return this;
//};

//add post
sap.suite.ui.commons.Timeline.prototype._addPost = function(){
	
	var inputText = this._addInput.getValue();
    this.fireAddPost({
    		value: inputText,
    		mentions: this._mentions
    		});
	
};

/* requested by social component, they will handle add button and dialog
sap.suite.ui.commons.Timeline.prototype._openAddDialog = function() {
	if (!this._addDialog) {
		this._createAddDialog();
	}
	this._addInput.setValue('');
	this._oldAddInput = '';
	this._mentions = [];
	//this._addDialog.destroyContent();
	this._addDialog.addContent(this._addInput);
	this._addDialog.openBy(this._addIcon);

};
*/

sap.suite.ui.commons.Timeline.prototype._setSuggestionList = function() {
	//this._suggestList.updateAggregation("items", this.getSuggestionItems());
	this._suggestList.destroyItems();
	var items = this.getSuggestionItems();
	
	for (var i=0; i<items.length; i++) {
		this._suggestList.addItem(new sap.m.StandardListItem({
			icon: items[i].getIcon(),
			title: items[i].getTitle(),
			description: items[i].getDescription()
		}));
	}
};

sap.suite.ui.commons.Timeline.prototype._setFilterInfoText = function(oFilter) {
	var oFilterInfoText = this.resBundle.getText("TIMELINE_FILTER_INFO_BY", [oFilter]);
	this._filterInfoText.setText(oFilterInfoText);
	this._filterInfoText.setTooltip(oFilterInfoText);
	if (oFilter === this.resBundle.getText("TIMELINE_ALL")) {
		this._headerInfoBar.setVisible(false);
	} else {
		this._headerInfoBar.setVisible(true);
	}
	this._filterText = oFilter;
};

sap.suite.ui.commons.Timeline.prototype._setFilterList = function() {
	this._aFilterList = [];
	this._filteredItems = {};
	if (this.getEnableBackendFilter()) {
		this._headerBar.insertContent(this._searchField,0);
		
		var oFilterList = this.getFilterList();
		var oFL = [];
		oFilterList.forEach(function(oItem) {
			oFL.push({
				key : oItem.getKey(),
				text : oItem.getText()
			});
		});
		this._aFilterList = oFL;
		//this._backendFilterDataFetched = true;
	} else {
		var oItems = this.getContent();
		for (var i = 0; i < oItems.length; i++) {
			var key = oItems[i].getFilterValue();
			if (!key) {
				continue;
			}
			if (key in this._filteredItems) {
				this._filteredItems[key].push(oItems[i]);
			} else {
				var alist = [];
				alist.push(oItems[i]);
				this._filteredItems[key] = alist;
				this._aFilterList.push({
				    key : key,
					text : key
				});
			}
		};
	}; // if (this.getEnableBackendFilter()) { //} else {
	// sort the list
  if (!this.getEnableBackendFilter()){
	  this._aFilterList.sort(function(a, b) {
		  return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
	  });
	}
	// put in the all items first
	var emptyKey = "";
	if (this.getEnableAllInFilterItem() && !(this._aFilterList[0] && this._aFilterList[0].key == "")) {  
		this._aFilterList.unshift({
			key  : "",
			text : this.resBundle.getText("TIMELINE_ALL")
		});
	};

	var jsonModel = new sap.ui.model.json.JSONModel({
		items : this._aFilterList
	});
	this._filterList.setModel(jsonModel);

	// set the default selection - All
	if (this._currentFilterKey){
		this.setCurrentFilter(this._currentFilterKey);
	} else if (this.getEnableAllInFilterItem()) {	
	  	this._filterList.setSelectedItem(this._filterList.getItems()[0]);
	}
	
};  //_setFilterList

sap.suite.ui.commons.Timeline.prototype._resetFilter = function() {
//	if (this._aFilterList) {
	if (this._aFilterList.length !== 0 && !this.getEnableBackendFilter()) {	
		// set the default selection - All
		this._filterList.setSelectedItem(this._filterList.getItems()[0]);
		this._headerInfoBar.setVisible(false);

	};
};

sap.suite.ui.commons.Timeline.prototype._openFilterDialog = function() {

//	if (!this._aFilterList || ( this._contentChange && !this.getEnableBackendFilter())) { 	
	if (this._customFilter){
		this.getCustomFilter().openBy(this._filterIcon);
		this.fireFilterOpen();
		return;
	}
	this._setFilterList(); //reset filterList always in case of content change....
	if ((this.getEnableBackendFilter() && (this._aFilterList.length === 0)) || ( this._contentChange && !this.getEnableBackendFilter())) {
		//this._setFilterList();
		this._contentChange = false; // reset the flag
	}
	
	this._filterDialog.addContent(this._filterList);
	this._filterDialog.openBy(this._filterIcon);
	this.fireFilterOpen();
};

sap.suite.ui.commons.Timeline.prototype._resetDisplayItems = function(filter) {
	this.invalidate();
	var oItems = this.getContent();
	var dItems = [];
	if (filter === this.resBundle.getText("TIMELINE_ALL")) {
		dItems = oItems;
	} else {
		dItems = this._filteredItems[filter];
	}
	this._displayItems = dItems;

};

sap.suite.ui.commons.Timeline.prototype.setEnableSocial = function(flag){
	/* per request socail component, add icon will handle by social component
	if (flag) {
		this._headerBar.insertContent(this._addIcon, 0);
	} else {
		this._headerBar.removeContent(this._addIcon);
	}
	*/
	this.setProperty("enableSocial", flag);
	
};

//to fix for ipad/iphone scrolling issue
sap.suite.ui.commons.Timeline.prototype.setEnableScroll = function(scroll){
	 if (sap.ui.Device.system.desktop) {
	    this.setProperty("enableScroll", scroll);
	 } else {
	    this.setProperty("enableScroll", false);
	 }           
};

sap.suite.ui.commons.Timeline.prototype.setData = function(oData) {
	// return if no data is passed
	if (oData == undefined) {
		return;
	}
	var sPath = this._buildPath("/", sap.suite.ui.commons.Timeline.INTERNAL_MODEL_NAME);
	this._internalModel.setData(oData);
	this.setProperty("data", oData, true);
	 if (this.getGroup() && this.getGroupBy() != '') {//if grouping is enabled
	   
			 //if grouping is enabled we add groupHeaderFactory to the bind aggregation
			 this.bindAggregation("content", {
				path : sPath,
				sorter : this._getDefaultSorter('dateTime', this.getSortOldestFirst()), //get the sorter
				groupHeaderFactory: jQuery.proxy(this._getGroupHeader,this), //get groupheader
				factory : jQuery.proxy(this._defaultItemsFactory, this)
				});
	} else { //no grouping
	
		this.bindAggregation("content", {
		path : sPath,
		sorter : this._getDefaultSorter('dateTime', this.getSortOldestFirst()),
		factory : jQuery.proxy(this._defaultItemsFactory, this)
		});
	
	} //end group check
	this._displayItems = this.getContent();
	this._finishLoading = true;
	this._contentChange = true;
	this._iItemCount = this.getMaxItemsCount();
	return this;
};


//group header function
//This function creates a new timeline item for the group and adds to the content
sap.suite.ui.commons.Timeline.prototype._getGroupHeader = function(oContext) {
  //oContext in this case is - oContext = Object {key: 2016, title: 2016}
	var sKey = oContext.title; //get the group item 

var groupItem ;
 if (this.getSort()) {
		 groupItem =	new sap.suite.ui.commons.TimelineItem({
		 		    dateTime : new Date(sKey,1,1).getTime(),
		  			text : "GroupHeader",
		 			userName : sKey,
		 			title : this.resBundle.getText("TIMELINE_GROUP_TEXT") + " " +  sKey,
		 			icon : "sap-icon://arrow-down",
		 			_groupID: sKey
		     });
 }
 else
{
	 groupItem =	new sap.suite.ui.commons.TimelineItem({
		    dateTime : new Date().getTime(),
			text : "GroupHeader",
			userName : sKey,
			title : this.resBundle.getText("TIMELINE_GROUP_TEXT") + " " + sKey,
			icon : "sap-icon://arrow-down",
			_groupID: sKey
  });

}
	
	this.addAggregation("content", groupItem, false);
		return groupItem;
	
};

sap.suite.ui.commons.Timeline.prototype.addContentGroup = function(oContext) {
	var sKey = oContext.title;
	
	return true;
	
};


//this function is used in the grouping sorter
//returns a group object with key and title (eg: key:2016, title: 2016)
sap.suite.ui.commons.Timeline.prototype._getTimelineGroup = function(oContext) {
	var oDate = oContext.getProperty(this.sPath);
	if (oDate instanceof Date) {
		oDate = oDate;
	} else if (typeof oDate === "string") {
	// handle format /Date(milliseconds)/
	  if (oDate.indexOf("Date") != -1) {
	  	var iTime = oDate.substring(oDate.indexOf("(") + 1, oDate.indexOf(")"));
	  	oDate = new Date(parseInt(iTime));
	  } else {
		  return oDate;
	  }
	}	else {
		oDate = new Date(parseInt(oDate));
	}

if (oDate.getFullYear()) {
		var sKey = oDate.getFullYear();
					return {
						key: sKey,
						title: sKey || "No Specific Year"
					};
} else {
	var sKey = oContext.getProperty(this.sPath);
			return {
				key: sKey,
				title: sKey || "No Specific Year"
			};
}

};

sap.suite.ui.commons.Timeline.prototype._buildPath = function(sPath, sModelName) {
	var sCompletePath = sPath;
	if (sModelName) {
		sCompletePath = sModelName + ">" + sPath;
	}
	return sCompletePath;
};

sap.suite.ui.commons.Timeline.prototype._getDefaultSorter = function(property, order) {
	var descending = true;
	if (order) {
		descending = false;
	} else {
		descending = true;
	}
	
	if (this.getSort()) {
		return new sap.ui.model.Sorter(property, descending, this._getTimelineGroup);
	} else {
		return null;
	}
};

sap.suite.ui.commons.Timeline.prototype._defaultItemsFactory = function(sId, oContext) {
	var oOptions = {};
	oOptions.dateTime = oContext.getProperty("dateTime");
	oOptions.icon = oContext.getProperty("icon");
	oOptions.userName = oContext.getProperty("userName");
	oOptions.title = oContext.getProperty("title");
	oOptions.text = oContext.getProperty("text");
	oOptions.filterValue = oContext.getProperty("filterValue");
	var oTimelineItem = new sap.suite.ui.commons.TimelineItem(oOptions);
	if (oContext.getProperty("content")) {
		oTimelineItem.setEmbeddedControl(oContext.getProperty("content"));
	}
	return oTimelineItem;
};


//setter for group by
sap.suite.ui.commons.Timeline.prototype.setGroupBy = function(flag){
	this.setProperty("groupBy", flag);
	var oBinding = this.getBinding("content");
};

//exteded bindaggregation (for grouping)
sap.suite.ui.commons.Timeline.prototype.bindAggregation = function(name,Options) {
	if (name === 'content' && this.getGroup() && this.getGroupBy() != '') {	 //check if grouping is enabled
		Options.sorter =  this._getDefaultSorter(this.getGroupBy(), this.getSortOldestFirst()); //get the sorter and add to bindaggregation options
		Options.groupHeaderFactory = jQuery.proxy(this._getGroupHeader,this); //get group header factory and add to bindaggration options
	}
	return sap.ui.base.ManagedObject.prototype.bindAggregation.apply(this, [name,Options]);		 //apply bind aggregation
};


sap.suite.ui.commons.Timeline.prototype.onBeforeRendering = function() {
	
	
	//Hide/show Filterbar
	if (!this.getShowFilterBar()) {
		this._headerBar.setVisible(false);
	}
	
	//hide/show search field
	if (!this.getShowSearch()) {
		this._searchField.setVisible(false);
	}
	
	var oItems = this.getContent();
	if (this._filterChange) {
		oItems = this._displayItems;
	}
	this._filterChange = false; // reset the flag
	this._showMore = false;
	var oBindingInfo = this.getBindingInfo("content");
//	if ((this.getGrowing() && (oBindingInfo) && (oBindingInfo.model !== sap.suite.ui.commons.Timeline.INTERNAL_MODEL_NAME) && (this.getMaxItemsCount() > this._iItemCount))) {
	if ((this.getGrowing() && (oBindingInfo) && (oBindingInfo.model !== sap.suite.ui.commons.Timeline.INTERNAL_MODEL_NAME) && (this.getMaxItemsCount() > this._growDisplayCount))) {
		if ((this._filterText === this.resBundle.getText("TIMELINE_ALL")) || (this.getEnableBackendFilter())) {
			this._showMore = true;
		}
	} else if (this.getMaxItemsCount() > 0) {
		this._iItemCount = this.getMaxItemsCount();
	}
	if (this._iItemCount == 0) {
		this._iItemCount = this.getMaxItemsCount();
		this._showMore = false;
	}
	if (this.getForceGrowing()) {  //always show more button when social enable
		this._showMore = true;
	}
	this.setOutput(oItems);
	
	
};

sap.suite.ui.commons.Timeline.prototype.setShowFilterBar = function(flag){
	this.setProperty("showFilterBar", flag);
	
	if (flag) {
		this._headerBar.setVisible(true);
	} else {
		this._headerBar.setVisible(false);
	}
	
};

sap.suite.ui.commons.Timeline.prototype.setShowSearch = function(flag){
	/* per request socail component, add icon will handle by social component
	if (flag) {
		this._headerBar.insertContent(this._addIcon, 0);
	} else {
		this._headerBar.removeContent(this._addIcon);
	}
	*/
	this.setProperty("showSearch", flag);
	
	if (flag) {
		this._searchField.setVisible(true);
  } else {
		this._searchField.setVisible(false);
	}
	
};

sap.suite.ui.commons.Timeline.prototype.addContent = function(oContents) {
	this.addAggregation("content", oContents, false);
};


sap.suite.ui.commons.Timeline.prototype.setContent = function(oContents) {
	this.removeAllContent();
	var firstGroup  = true;
	var currentGroup = 0;
	for ( var i = 0; i < oContents.length; i++) {
		var oItem = oContents[i];
		if (oItem._isOfTypeTimelineItem && oItem._isOfTypeTimelineItem() == true) {
			if ((oItem.getEmbeddedControl() === null) && (oItem.getText() !== null)) {
				oItem.setEmbeddedControl(new sap.ui.commons.FormattedTextView({
					text : oItem.getText()
				}));
			}
			
		if (this.getGroup() && this.getGroupBy() != '' ) {  //if grouping is enabled 
				var newGroupValue = new Date(oItem.getDateTime()).getFullYear(); //get the year from timeline item
				if (newGroupValue == currentGroup) { //check if the current group is same as the current item group
					sap.suite.ui.commons.Timeline.prototype.addContent.apply(this, [oItem]); //add to the group
				} else { //if it is a new group
					var groupItem ;
					if (this.getSort()) { //sorting is enabled
					
						//create the group item 
							groupItem =	new sap.suite.ui.commons.TimelineItem({
					 		    dateTime : new Date(newGroupValue,1,1).getTime(), //jan 1st of the year
					  			text : "GroupHeader",
					 			userName : new Date(oItem.getDateTime()).getFullYear(),
					 			title : this.resBundle.getText("TIMELINE_GROUP_TEXT") + " " +  new Date(oItem.getDateTime()).getFullYear(),
					 			icon : "sap-icon://arrow-down",
					 			_groupID: new Date(oItem.getDateTime()).getFullYear()
							});
					} else {
						groupItem =	new sap.suite.ui.commons.TimelineItem({
				 		    dateTime : new Date().getTime(),
				  			text : "GroupHeader",
				 			userName : new Date(oItem.getDateTime()).getFullYear(),
				 			title : this.resBundle.getText("TIMELINE_GROUP_TEXT") + " " + new Date(oItem.getDateTime()).getFullYear(),
				 			icon : "sap-icon://arrow-down",
				 			_groupID: new Date(oItem.getDateTime()).getFullYear()
						});
						
					} 
					sap.suite.ui.commons.Timeline.prototype.addContent.apply(this, [groupItem]); //add the group item to content
					currentGroup = new Date(oItem.getDateTime()).getFullYear(); //set the current group variable
					sap.suite.ui.commons.Timeline.prototype.addContent.apply(this, [oItem]); // add the timeline item to content
				}
		} else { //if grouping is not enabled
					sap.suite.ui.commons.Timeline.prototype.addContent.apply(this, [oItem]);
			} //end group enable check
		}
	} //end timeline item loop
	
	this.setSort(true);
	this._displayItems = this.getContent();
	this._finishLoading = true;
	this._contentChange = true;
	this._resetFilter();
	this._iItemCount = this.getMaxItemsCount();
};

sap.suite.ui.commons.Timeline.prototype.sortBy = function(property, ascending) {
	if (ascending) {
		return function(a, b) {
			if (a.getProperty(property) > b.getProperty(property)) {
				return 1;
			} else if (a.getProperty(property) < b.getProperty(property)) {
				return -1;
			}
			return 0;
		};
	} else {
		return function(a, b) {
			if (a.getProperty(property) < b.getProperty(property)) {
				return 1;
			} else if (a.getProperty(property) > b.getProperty(property)) {
				return -1;
			}
			return 0;
		};
	}
};

sap.suite.ui.commons.Timeline.prototype.onAfterRendering = function() {
	var that = this;
	//resize handler to handle timeline responsive features
	if ((that.sResizeListenerId == null) && (jQuery.device.is.desktop)) {
					that.sResizeListenerId = sap.ui.core.ResizeHandler.register(that, jQuery.proxy(that._performResizeChanges, that));
	} else {
		sap.ui.Device.resize.attachHandler(jQuery.proxy(that._performResizeChanges, that), that);
	}

	if (this.getAxisOrientation() === sap.suite.ui.commons.TimelineAxisOrientation.Vertical && this.getEnableScroll()) {
		this.$().css("height", this._height);
		if (this.getEnableScroll()) { // only set height when we want scrolling
			this.$().find("#" + this.getId() + "-scroll").css("height", this._scHeight);
//			console.log(this._scHeight);
		}
	} 
	
//*to fix event grow binding issue - when click on more, scroll back to the top
	jQuery.sap.delayedCall(150, this, function() {
// 	jQuery.sap.delayedCall(500, this, function() {
		that._performUiChanges();
	
	this._startItemNavigation();
	});
  
	//set the panel class for overriding the panel background color
   this._setPanelParentCssClass(this);
};

/*  in case we want end of scroll event
sap.suite.ui.commons.Timeline.prototype.onScroll = function(oEvent) {
	//alert("scrolling");
	var oDiv = this.$().find("#" + this.getId() + "-content")[0];  //todo no need to search everytime
	if (oDiv.clientHeight + oDiv.scrollTop >= oDiv.scrollHeight) {
//		alert("scroll end");
	}
};
*/
//Start Belize change for panel
	// overriding the default translucent panel background color for belize theme
	
	sap.suite.ui.commons.Timeline.prototype._setPanelParentCssClass = function (oControl) {
	  var oParent = oControl.getParent();
	  if (!oParent) {
	    return;
	  }
	  if (oParent instanceof sap.m.Panel) {
	    oParent.addStyleClass("sapSuiteUiCommonsTimelinePanel");
	  } else {
	    this._setPanelParentCssClass(oParent);
	  }
	};
//	End Belize change for panel

/* Keyboard Handling */
sap.suite.ui.commons.Timeline.prototype._startItemNavigation = function(oEvent) {
	// Collect the dom references of the items
	var oFocusRef = this.getDomRef(),
	aRows = oFocusRef.getElementsByClassName("sapSuiteUiCommonsTimelineItemShell"),
	aDomRefs = [];

	for (var i = 0; i < oFocusRef.childNodes.length; i++) {
	//remove timeline1-filterInfoBar if timeline1-filterInfoBar display on ui
		if (oFocusRef.childNodes[i].id.indexOf("filterInfoBar") < 0) {
					aDomRefs.push(oFocusRef.childNodes[i]);
		}
	}
			
	// initialize the delegate add apply it to the control (only once)
	if (!this.oItemNavigation) {
		this.oItemNavigation = new sap.ui.core.delegate.ItemNavigation();
		this.addDelegate(this.oItemNavigation);
	}

	// After each rendering the delegate needs to be initialized as well.
	this.oItemNavigation.setRootDomRef(aRows);
	this._aRows = aRows; //save item level div
	this._aDomRefs = aDomRefs;
	this._sapTabbable = this.$().find(":sapTabbable");

    this._moreButtonFound = false;
 	this._addButtonFound = false;
 	this._addTarget = null;
 	this._filterTarget = null;
  	this._moreTarget = null;
  	this._lastMessageStripTabElem = null;
  	this._messageStripTabFields = [];  
  	this._messageStripIsAvailable = false;  
  	this._messageStripCloseButtonTarget = null;  
  	this._firstShell = null;
  	this._lastShell = null;
  	this._lastTab = null;
  	this._lastHeaderBaRTabField = null;
  	this._firstHeaderBaRTabField = null;  	
  	this._headerBarFieldLength = this.getHeaderBar().getContent().length;

	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (this._headerBarFieldLength >= 2) {
			if (this._sapTabbable[i].id == this.getHeaderBar().getContent()[this._headerBarFieldLength - 1].sId) {
				this._lastHeaderBaRTabField = this._sapTabbable[i];
				if (this._firstHeaderBaRTabField === null) {
					this._firstHeaderBaRTabField = this._sapTabbable[i];
				}
			}			
		}
		if (this._headerBarFieldLength >= 2) {
			if (this._sapTabbable[i].id == this.getHeaderBar().getContent()[1].sId) {
				if (this._firstHeaderBaRTabField === null) {
					this._firstHeaderBaRTabField = this._sapTabbable[i];
				}
			} 			
		}

		if (this._sapTabbable[i].id.indexOf("shell") >= 0 && this._firstShell == null) {
			this._firstShell = this._sapTabbable[i];
		}
		if (this._sapTabbable[i].id.indexOf("shell") >= 0) {
			this._lastShell = this._sapTabbable[i];
		}
		if (this._sapTabbable[i].id.indexOf("more") < 0) {
			this._lastTab = this._sapTabbable[i];
		}
		if (this._sapTabbable[i].id.indexOf("more") >= 0) {
			this._moreButtonFound = true;
			this._moreTarget = this._sapTabbable[i];
		}
		if (this._sapTabbable[i].id.indexOf("add") >= 0) { 
			this._addButtonFound = true;
			this._addTarget = this._sapTabbable[i];
		}
		if (this._sapTabbable[i].id.indexOf("filter") >= 0) {
			this._filterTarget = this._sapTabbable[i];
		}
		if (this._sapTabbable[i].className === "sapMMsgStripCloseButton") {
			this._messageStripCloseButtonTarget = this._sapTabbable[i];
		}
	}		
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (this._lastMessageStripTabElem == null && this.getMessageStrip().getText() != '') { 	
			if (this._sapTabbable[i].id.indexOf("add") >= 0) {
				continue;
			}
			if (this._sapTabbable[i].className === "sapMMsgStripCloseButton") {
				this._messageStripIsAvailable = true;
				this._lastMessageStripTabElem = this._sapTabbable[i];
				break;
			}
			if (this._sapTabbable[i].id.indexOf("shell") < 0 && this._sapTabbable[i].id.indexOf("filter") < 0) {
				this._messageStripTabFields.push(this._sapTabbable[i]);
			}	
			if (this._lastMessageStripTabElem == null && this._sapTabbable[i].className == "sapSuiteUiCommonsTimelineItemShell" && this._sapTabbable[i - 1]) {
				this._lastMessageStripTabElem = this._sapTabbable[i - 1];	
				break;
			}
		}
	}
	
	// set the array of dom nodes representing the items.
	this.oItemNavigation.setItemDomRefs(aDomRefs);
	// turn off the cycling
	this.oItemNavigation.setCycling(false);
	// set the page size - default with 10 items
	this._pageSize = this.getGrowingThreshold();
	if (this._pageSize == 0) {
		this._pageSize = 10;
	}
//	this._pageSize = 2; 
	this.oItemNavigation.setPageSize(this._pageSize);
};

sap.suite.ui.commons.Timeline.prototype._targetIdIsMessageStripTab = function(oEvent) {
	for (var i=0; i < this._messageStripTabFields.length; i++) {
		if (this._messageStripTabFields[i].id === oEvent.target.id ) {
			return true;
		}
	}
	return false;
};

sap.suite.ui.commons.Timeline.prototype.onsaphome = function(oEvent) {
	this._skipOnFocusIn = true; 
	this._setFocus(oEvent, this._aRows[0]);
	this._previousTarget = this._aRows[0];
	this._previousShellTarget = this._aRows[0]; //when shift+f6 from outside, we need use this value
};

sap.suite.ui.commons.Timeline.prototype.onsapend = function(oEvent) {
	this._skipOnFocusIn = true;
	this._setFocus(oEvent, this._aRows[this._aRows.length - 1]);
	this._previousTarget = this._aRows[this._aRows.length - 1];
	this._previousShellTarget = this._aRows[this._aRows.length - 1]; //when shift+f6 from outside, we need use this value
};

sap.suite.ui.commons.Timeline.prototype._setFocus = function(oEvent, id) {
	jQuery(id).focus();
	oEvent.preventDefault();
	oEvent.setMarked();	
};

sap.suite.ui.commons.Timeline.prototype.onsappagedown = function(oEvent) {
//page down on item level only	
	this._skipOnFocusIn = true;
	this._setPageDownUpFocus(oEvent, true);
};

sap.suite.ui.commons.Timeline.prototype.onsappageup = function(oEvent) {
//page up item level only
	this._skipOnFocusIn = true;
	this._setPageDownUpFocus(oEvent, false);
};

sap.suite.ui.commons.Timeline.prototype._setPageDownUpFocus = function(oEvent, down) {
	var focusInItemLevelFound = false;
	for (var i=0; i < this._aRows.length; i++) {
			if (this._aRows[i].id == oEvent.target.id ) {
				focusInItemLevelFound = true;
				break;
			}
	}
	if (focusInItemLevelFound == false) {
		this._setFocus(oEvent, oEvent.target);
		return;
	}
	
	var nextFocusIndex = 0;
	
	if (down) {
		nextFocusIndex = i + this._pageSize;
		if (nextFocusIndex >= this._aRows.length) {
			nextFocusIndex = this._aRows.length - 1;
		}
	} else {
		nextFocusIndex = i - this._pageSize;
		if (nextFocusIndex < 0) {
			nextFocusIndex = 0;
		}		
	}

	this._setFocus(oEvent, this._aRows[nextFocusIndex]);
	this._previousTarget = this._aRows[nextFocusIndex];
	this._previousShellTarget = this._aRows[nextFocusIndex]; //when shift+f6 from outside, we need use this value
};

sap.suite.ui.commons.Timeline.prototype.onsapup = function(oEvent) {
//arrow down only on item level
	this._skipOnFocusIn = true;
	this._setArrowUpLeftFocus(oEvent);
};

sap.suite.ui.commons.Timeline.prototype.onsapleft = function(oEvent) {
//arrow down only on item level
	this._skipOnFocusIn = true;
	this._setArrowUpLeftFocus(oEvent);
};

sap.suite.ui.commons.Timeline.prototype._setArrowUpLeftFocus = function(oEvent) {
	var j = 0;
	
	for (var i = 0; i < this._sapTabbable.length; i++) {
			if (this._sapTabbable[i].id == oEvent.target.id ) {
				j = i;
				break;
			}
	}	

	for (var i = j-1; i >= 0; i--) {
		if ((this._sapTabbable[i].id.indexOf("shell") >= 0 || this._sapTabbable[i].className.indexOf("sapSuiteUiCommonsTimelineGroupItemIcon")>=0) && this._sapTabbable[i].id != oEvent.target.id && this._shell != this._sapTabbable[i].id  && i < j) {
            this._shell = this._sapTabbable[i].id;
			this._previousTarget = this._sapTabbable[i];
			this._previousShellTarget = this._sapTabbable[i];
			this._setFocus(oEvent, this._sapTabbable[i]);
			break;
		}
	}	
};

sap.suite.ui.commons.Timeline.prototype.onsapdown = function(oEvent) {
//arrow down only on item level
	this._skipOnFocusIn = true;
	this._setArrowDownRightFocus(oEvent);
};

sap.suite.ui.commons.Timeline.prototype.onsapright = function(oEvent) {
//arrow down only on item level
	this._skipOnFocusIn = true;
	this._setArrowDownRightFocus(oEvent);
};

sap.suite.ui.commons.Timeline.prototype._setArrowDownRightFocus = function(oEvent) {
	if (oEvent.target.id.indexOf("shell") < 0 && oEvent.target.className.indexOf("sapSuiteUiCommonsTimelineGroupItemIcon") < 0)
 {
		this._setFocus(oEvent, this.$().find(oEvent.target));
		return;
	}					

	var j = 0;
	
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (this._sapTabbable[i].id == oEvent.target.id ) {
			j = i;
			break;
		}
	}	

	for (var i = 0; i < this._sapTabbable.length; i++) {
		if ((this._sapTabbable[i].id.indexOf("shell") >= 0 || this._sapTabbable[i].className.indexOf("sapSuiteUiCommonsTimelineGroupItemIcon")>=0) && this._sapTabbable[i].id != oEvent.target.id && this._shell != this._sapTabbable[i].id  && i > j) {
	        this._shell = this._sapTabbable[i].id;
			this._previousTarget = this._sapTabbable[i];
			this._previousShellTarget = this._sapTabbable[i];
			this._setFocus(oEvent, this._sapTabbable[i]);
			return;
		}
	}	
};

sap.suite.ui.commons.Timeline.prototype.onsaptabprevious = function(oEvent) {
	var lastInteractiveElement = null;
	this._tabprevious = true;
	if (!this._targetIdInHeaderBar(oEvent) && oEvent.target.id.indexOf("more") < 0 && oEvent.target.className !== "sapMMsgStripCloseButton") {
		if (!this._targetIdIsMessageStripTab(oEvent)) { 
			this._previousTabPreviousTarget = oEvent.target;			
		}
	}
	if (this.oItemNavigation) {
		this.removeDelegate(this.oItemNavigation);
		this.oItemNavigation.destroy();
	}
	this._startItemNavigation(); 
	var $Tabbables = this._sapTabbable;

	
	var prevFocusShellTarget = null;
	if (oEvent.target.id.indexOf("getmore") >= 0) {
		//to fix tabprevious focus issue when no timeline item data exist - no data 
		if (this._getFirstShellTarget() == null) {
			return;
		}
		if (this._previousTarget == null) {
			lastInteractiveElement = this._getLastInteractiveElementInItem(this._getFirstShellTarget());
			jQuery(lastInteractiveElement).focus();
		}
		else {
		    var shellTargetFound = false;
		    if (this._previousShellTarget != null) {
				for (var i = 0; i < this._sapTabbable.length; i++) {
					if (this._previousShellTarget.id ==  this._sapTabbable[i].id) {		
						lastInteractiveElement = this._getLastInteractiveElementInItem(this._sapTabbable[i]);
						this._previousTarget = lastInteractiveElement;
						this._setFocus(oEvent, lastInteractiveElement);
						shellTargetFound = true;
						return;
					}
				}
			}
			//focus on 1st shell if previous shell not found
			var lastInteractiveElement = null;
			if (!shellTargetFound) {
				for (var i = 0; i < this._sapTabbable.length; i++) {
					if (this._sapTabbable[i].id.indexOf("shell") >= 0 || this._sapTabbable[i].className.indexOf("sapSuiteUiCommonsTimelineGroupItemIcon")>=0) {
						prevFocusShellTarget = this._sapTabbable[i];
						lastInteractiveElement = this._getLastInteractiveElementInItem(this._getFirstShellTarget());
						this._previousTarget = lastInteractiveElement;
						this._previousShellTarget = this._sapTabbable[i];
						this._setFocus(oEvent, lastInteractiveElement);
						return;
					}
				}
			}
		}
		oEvent.preventDefault();
		oEvent.setMarked();
		return;
	}
	
	if (oEvent.target.id.indexOf("shell") >= 0) {
		if (this._messageStripIsAvailable) {  
			this._setFocus(oEvent, this._messageStripCloseButtonTarget);
			return;
		}
		if (this._lastHeaderBaRTabField !== null) {
			this._setFocus(oEvent, this._lastHeaderBaRTabField);
			return;			
		}
		//headerbar without button
		jQuery(this._firstShell).focus(); 

	}	
	if (oEvent.target.id == this._firstHeaderBaRTabField.id) {
		this._dummy = true; //assume will tab through dummy...
	}
};

sap.suite.ui.commons.Timeline.prototype._getLastInteractiveElementInItem = function(target) {

	if (target == null) {
		return;
	}
	
	var LastItemInteractiveElement = target;
	
	var j = 0; 
	
	//find the item using shell target
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (this._sapTabbable[i].id == target.id ) {
			j = i;
			break;
		}
	}	

	var nextShellTargetFound = false;
	var lastInteractiveElementIndex = 0;
	for (var i = 0; i <this._sapTabbable.length; i++) {
		if (this._sapTabbable[i].id.indexOf("shell") >= 0 && this._sapTabbable[i] != target  && i > j) {
			nextShellTargetFound = true;
			break;
		} else {
			LastItemInteractiveElement = this._sapTabbable[i];
			lastInteractiveElementIndex = i;
		}
	}
	//if only two item and focus on the 2nd item last interactive element and come back from 'more' button then we need to focus on 
	//the interactive element before more button
	if (LastItemInteractiveElement.id.indexOf("more") >= 0 && lastInteractiveElementIndex > 0) {
		LastItemInteractiveElement = this._sapTabbable[lastInteractiveElementIndex - 1];
	}
	
	return LastItemInteractiveElement;

};

sap.suite.ui.commons.Timeline.prototype._getFirstShellTarget = function() {

	var FirstShellTarget = null;

	//find the 1st item using shell target
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (this._sapTabbable[i].id.indexOf("shell") >= 0 || this._sapTabbable[i].className.indexOf("sapSuiteUiCommonsTimelineGroupItemIcon")>=0) {
			FirstShellTarget = this._sapTabbable[i];
			break;
		}
	}
	return FirstShellTarget;
};

sap.suite.ui.commons.Timeline.prototype._getItemShellTarget = function(target) {
	var itemsShellTarget = null;
	var contentLength = 0;

	if (target == null) {
		return itemsShellTarget;
	}
	if (target.id.indexOf("shell") >= 0) {
		return target;
	}
	var position = -1;
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (target.id ==  this._sapTabbable[i].id) {
			position = i;
			break;
		}
	}
	if (position >= 0) {
		for (var j = position - 1; j >= 0; j--) {
			if (this._sapTabbable[j].id.indexOf("shell") >= 0) {
				itemsShellTarget = this._sapTabbable[j];
				break;
			}
		}
	}
	return itemsShellTarget;
};

sap.suite.ui.commons.Timeline.prototype.onsaptabnext = function(oEvent) {

	this._tabnext = true;
	this._dummy = false;
	
	if (this.oItemNavigation) {
		this.removeDelegate(this.oItemNavigation);
		this.oItemNavigation.destroy();
	}
	this._startItemNavigation();
//headerbar
//oEvent.target.id point to current position
	for (var i = 0; i < this._headerBarFieldLength; i++) { //currently already focused on the last headerbar button. If the prev focus not in 1st shell
		if (oEvent.target.id === this.getHeaderBar().getContent()[i].sId && oEvent.target.id === this._lastHeaderBaRTabField.id) {
			if (!this._messageStripIsAvailable && this._previousShellTarget != null) {			
				for (var i = 0; i < this._sapTabbable.length; i++) { 
					if (this._previousShellTarget.id ==  this._sapTabbable[i].id) {
						this._setFocus(oEvent, this._sapTabbable[i]);
						return;
					}
				}
			}
		}
		if (oEvent.target.id === this.getHeaderBar().getContent()[i].sId) { //button in headerbar, let central handle the focus
			return;
		}
	}
	
	var oTargetPosition = -1;
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (oEvent.target.id ==  this._sapTabbable[i].id) {
			oTargetPosition = i;
			break;
		}
	}
	
	if (dataInMessageStrip && this._targetIdInHeaderBar(oEvent)) {
		return;
	}
	
	if (oEvent.target.className === "sapMMsgStripCloseButton" && this._previousShellTarget != null) {
		for (var i = 0; i < this._sapTabbable.length; i++) { //when click more, we need to find the new generated tab item
			if (this._previousShellTarget.id ==  this._sapTabbable[i].id) {
				this._setFocus(oEvent, this._sapTabbable[i]);
				return;
			}
		}
	}
		
	if (oEvent.target.id.indexOf("more") < 0 && !this._targetIdInHeaderBar(oEvent) && oEvent.target.id != "") {
		if (oTargetPosition == this._sapTabbable.length - 1) {
			this._setFocusOnMoreOrOutOfFocusArea(oEvent);
		}
		if (oTargetPosition < this._sapTabbable.length - 1 && this._sapTabbable[oTargetPosition + 1].id.indexOf("shell") >= 0) {
			this._setFocusOnMoreOrOutOfFocusArea(oEvent);
		}
	}
	
	var prevFocusShellTarget = null;
	if (this._targetIdIsLastHeaderBarBtn(oEvent) && this._previousTarget != null && oEvent.target != this._previousTarget) {
		if (this._messageStripIsAvailable) { 
			return;
		}
		if (this._previousTarget.id.indexOf("shell") >= 0) {
			var shellTargetFound = false;
			for (var i = 0; i < this._sapTabbable.length; i++) {
				if (this._previousTarget.id ==  this._sapTabbable[i].id) {
					this._setFocus(oEvent, this._sapTabbable[i]);
					return;
				}
			}
			if (!shellTargetFound) {
				for (var i = 0; i < this._sapTabbable.length; i++) {
					if (this._sapTabbable[i].id.indexOf("shell") >= 0) {
						prevFocusShellTarget = this._sapTabbable[i];
						break;
					}
				}
			} 
		} else {
			var shellTargetFound = false;
			if (this._previousShellTarget != null) {
				for (var i = 0; i < this._sapTabbable.length; i++) {
					if (this._previousShellTarget.id ==  this._sapTabbable[i].id) {
						this._setFocus(oEvent, this._sapTabbable[i]);
						shellTargetFound = true;
						return;
					}
				}
			}
			//focus on 1st shell if previous shell not found
			if (!shellTargetFound) {
				for (var i = 0; i < this._sapTabbable.length; i++) {
					if (this._sapTabbable[i].id.indexOf("shell") >= 0) {
						prevFocusShellTarget = this._sapTabbable[i];
						this._previousTarget = this._sapTabbable[i];
						this._previousShellTarget = this._sapTabbable[i];
						break;
					}
				}
			}
		}
		if (prevFocusShellTarget == null) {
			for (var i = 0; i < this._sapTabbable.length; i++) {
				if (this._sapTabbable[i].id.indexOf("shell") >= 0) {
					break;
				}
			}	
		}
		this._setFocus(oEvent, prevFocusShellTarget);
		return;
	}
		
	if (oEvent.target.id.indexOf("getmore") < 0 && !this._targetIdInHeaderBar(oEvent) && oEvent.target.className !== "sapMMsgStripCloseButton") {
		var dataInMessageStrip = false;
		//do not save messagestrip element in previous target
		for (var i = 0; i < this._messageStripTabFields.length; i++) {
			if (this._messageStripTabFields[i].id == oEvent.target.id) {
				dataInMessageStrip = true;
				break;
			}
		}
		if (!dataInMessageStrip) {
			this._previousTarget = oEvent.target;
			this._previousShellTarget = this._getItemShellTarget(oEvent.target);
		}
	}
 
};

sap.suite.ui.commons.Timeline.prototype._setFocusOnMoreOrOutOfFocusArea = function(oEvent) {
	if (!this._moreButtonFound) {
		jQuery(this._sapTabbable[this._sapTabbable.length - 1]).focus();
		this._dummy = true; //out of focus area flag
		this._previousTarget = oEvent.target;  
		this._previousShellTarget = this._getItemShellTarget(oEvent.target);
		return;
	}
	
	if (this._moreButtonFound) {
		this._previousTarget = oEvent.target;
		this._previousShellTarget = this._getItemShellTarget(oEvent.target);  
		this._setFocus(oEvent, this._moreTarget);
		return;
	}
};

sap.suite.ui.commons.Timeline.prototype._switchFocus = function(oEvent) {
	var itemShellTarget = this._getItemShellTarget(oEvent.target);
	var controlShellTarget = this._getItemShellTarget(this._saveTarget);
	//only control and item sit in the same item shell, then can toggle
	if (this._saveTarget != null && oEvent.target != null && itemShellTarget != controlShellTarget) {
	//save control target
		if (oEvent.target.id.indexOf("item") < 0 && oEvent.target.id.indexOf("shell") < 0) {
			this._saveTarget = oEvent.target;
		}
		return;
	}
	//at item level, toggle back to control
	if (oEvent.target.id.indexOf("item") >= 0 && oEvent.target.id.indexOf("shell") >= 0) {
		jQuery(oEvent.target).blur();
		jQuery(this._saveTarget).focus();
	}
	else {
	//at control level, toggle back to item
		if (itemShellTarget != null) {
			this._saveTarget = oEvent.target;
			jQuery(oEvent.target).blur();
			jQuery(itemShellTarget).focus();
		}
	}
};
sap.suite.ui.commons.Timeline.prototype.onkeydown = function(oEvent) {
		// toggle between control and item with F7
	
	this._skipOnFocusIn = false;
	this._firstTimeSetFocus = true;
	
	if (oEvent.ctrlKey || oEvent.shiftKey) {
		if (oEvent.which == jQuery.sap.KeyCodes.ARROW_DOWN || oEvent.which == jQuery.sap.KeyCodes.ARROW_UP) {
			 var currentFocusElement = document.activeElement;
			 if (currentFocusElement.className.indexOf('sapSuiteUiCommonsTimelineGroupItemIcon') >= 0) {
				 	console.log(currentFocusElement.id);
				 	var groupBtns = document.getElementsByClassName('sapSuiteUiCommonsTimelineGroupItemIcon');
				 	for (var i=0; i<groupBtns.length; i++) {
				 		     if (currentFocusElement.id == groupBtns[i].id) {
				 		    	 
				 		    	 
				 		    	 if (oEvent.which == jQuery.sap.KeyCodes.ARROW_UP) {
					 		    	 if (groupBtns[i-1] != undefined){
					 		    		 this._setFocus(oEvent, document.getElementById(groupBtns[i-1].id));
					 		    	 }
				 		    	 } else {
					 		    	 
					 		    	 if (groupBtns[i+1] != undefined){
					 		    		 this._setFocus(oEvent, document.getElementById(groupBtns[i+1].id));
					 		    	 }
				 		    	 }

				 		    	
				 		     }
				 	}
				 		
			 }
				
		}
	}
	
	if (oEvent.which == jQuery.sap.KeyCodes.F7 && !oEvent.isMarked()) {
//		this._dummy = false;
		this._skipOnFocusIn = true;
		this._switchFocus(oEvent);
		oEvent.preventDefault();
		oEvent.setMarked();
		return;
	}
	
};

sap.suite.ui.commons.Timeline.prototype.onsapspace = function(oEvent) {
	// if non 'getmore' button entered, then prevent scrolling when focus
/*	if (oEvent.target.id.indexOf("getmore") < 0) {
		oEvent.preventDefault();
		oEvent.setMarked();
		this.focus(); 
	}*/
};

sap.suite.ui.commons.Timeline.prototype.onfocusout = function(oEvent) {
	this._outFocusTarget = oEvent.target;
	this._outFocusTargetClassName = oEvent.target.className;

};

sap.suite.ui.commons.Timeline.prototype.onfocusin = function(oEvent) {
	//to prevent dump, when directlu click KPI timeline and no tabble fields
	if (!this._sapTabbable || this._sapTabbable.length < 1) {
		return;
	}
	

	//this block is code is added to set focus to group expand/collapse button
	var currentItem = this.$().find("#" + oEvent.target.id)[0];
	if (currentItem.getElementsByClassName('sapSuiteUiCommonsTimelineGroupItemIcon').length>0) {
		this._setFocus(oEvent, currentItem.getElementsByClassName('sapSuiteUiCommonsTimelineGroupItemIcon')[0]);
	}
	//*headerbar without tabble buttons
	if (this._firstHeaderBaRTabField == null) { 
		if (!this._dummy && this._previousTarget == null && !this._moreButtonFound && this._tabnext == false && oEvent.target.id == this._sapTabbable[this._sapTabbable.length - 1].id) {
			this._setFocusOnMoreAddFilterButton(oEvent);
			return;
		}
		return;
	}
	//***********************************************************************************************************************************************
	//for shift+f6, when enableSocial = "true", without more button, and only one tabble field in social toolbar (embedded control), since the social 
	//toolbar set fastgroup as true ("sap-ui-fastnavgroup"), so when shift+f6 entered will 
	//focus on the social toolbar first tab field i.e. 'Reply' buttton and then focus on item shell level when shift+f6 againl 	
	//For shift+tab, the focus will be on the first social tabble field and then focus on the next (up one) tabble timeline control field and then 
	//keep going up...	
	//when enableSocial="false", the focus will be on timeline control shell level when the shift+f6 entered 	
	//***********************************************************************************************************************************************

	if (this._skipOnFocusIn) {
		return;
	}

	//***********************************************************************************************************************************************	
	// with more button, this block of codes will be executed when,
	// tab and then shift+tab back from 'out of focus area'
	// f6 and then shift+f6 back from 'out of focus area'
	//***********************************************************************************************************************************************
	
	if (this._dummy && !this._targetIdInHeaderBar(oEvent) && this._previousTarget != null) {
		this._dummy = false;
		if (this._moreButtonFound) {
			this._setFocus(oEvent, this._moreTarget);
			return;
		}
		
	//***********************************************************************************************************************************************
	// when shift+f6 without social enable (no embedded control with F6 fast group), then shell oEvent.target == this._previousShellTarget
	// this block of codes will be executed when,
	// f6 out and shift f6 back
	// f6 to shell level and shift+f6
	//***********************************************************************************************************************************************
		if (oEvent.target.id.indexOf("shell") >= 0 && this._previousShellTarget !== null) { //tab next out of control area and come back with f6, should focus on shell level
			if (oEvent.target == this._firstShell) { //*this condition for shift+f6 and the last tab is shell
				this._setFocus(oEvent, this._previousShellTarget);
				this._tabprevious = false;
				return;					
			}
			
	//***********************************************************************************************************************************************
	// tab and arrow down and out timeline control focus area and shift tab back 
	// this block of codes will be executed when,
	// tab and tab out timeline ontrol focus area  and shift+tab
	//***********************************************************************************************************************************************
			if (oEvent.target == this._lastShell) { //for shift+tab
				var lastInteractiveElement = this._getLastInteractiveElementInItem(this._previousShellTarget);  //*tab out and shift+tab back
				this._setFocus(oEvent, lastInteractiveElement);
				this._tabprevious = false; 
				return;				
			}

		}
	
	//***********************************************************************************************************************************************		
	// tab out and shift+tab back. the last tab field is link instead of shell
	// f6 to first shell and shift+tab back...
	//***********************************************************************************************************************************************
		var lastInteractiveElement = this._getLastInteractiveElementInItem(this._previousTarget);
		this._setFocus(oEvent, lastInteractiveElement);
		return;
	}
		
	//without tab next, click on item, and then shift+tab back from 'out of focus area'
	if (this._dummy && !this._targetIdInHeaderBar(oEvent) && this._previousTarget == null) {
	//f6 to first shell and come back with shift+tab
		this._tabprevious = false;
		this._dummy = false;
		
	//***********************************************************************************************************************************************	
	// if focus back and the current position is not at more button
	// with more button, shift+f6 directly and then shift+f6 again, focus on more - required this block (continue 2nd back)
	//***********************************************************************************************************************************************	
		if (this._moreButtonFound && oEvent.target.id.indexOf("more") < 0) {
			this._setFocus(oEvent, this._moreTarget);
			return; 
		}
	}

	//***********************************************************************************************************************************************		
	// directly shift+f6 back
	//***********************************************************************************************************************************************	
	if (!this._dummy && this._previousTarget == null && this._moreButtonFound && this._tabnext == false && oEvent.target == this._firstShell) {
		if (this._moreButtonFound && oEvent.target.id.indexOf("more") < 0) {
			var outFocusShellTarget = null;
			//when directly shift+tab back
			if (this._outFocusTarget != null && oEvent.target.id.indexOf("shell") >= 0) {
				outFocusShellTarget = this._getItemShellTarget(this._outFocusTarget);	
				if (oEvent.target == outFocusShellTarget) { //shidt_tab
					return; 
				}
			}
			
			//skip this block of codes, when tab back and current focus field is 'more' button
			//with more button and shift+f6 directly from other control will stop here
/*			if (this._outFocusTarget !== this._moreTarget && this._outFocusTarget !== null) { //directly tab back - no tab field available in item shell
				this._setFocus(oEvent, this._moreTarget);
				alert(sap.ui.getCore().getCurrentFocusedControlId());
				alert("a9");
				return;				
			}*/

		}
	}
	//***********************************************************************************************************************************************	
	// tab out and shift+f6
	//***********************************************************************************************************************************************	
	if (!this._dummy && this._previousTarget !== null && this._moreButtonFound && oEvent.target == this._firstShell) {
		//*only shift+f6 from outside control to execute this block
		//*when repeat tab through 2nd time, do not execute this block, otherwise the focus woll be on 'more' button after messagestrip close button clicked
		if (this._outFocusTargetClassName !== "sapMMsgStripCloseButton" && this._outFocusTarget !== this._filterTarget) { //*only shift+f6 execute this bloack
			if (this._moreButtonFound && oEvent.target.id.indexOf("more") < 0) {
				var outFocusShellTarget = null;
				//when directly shift+tab back
				if (this._outFocusTarget != null && oEvent.target.id.indexOf("shell") >= 0) {
					outFocusShellTarget = this._getItemShellTarget(this._outFocusTarget);	
					if (oEvent.target == outFocusShellTarget) { //shidt_tab
						return; 
				 	}
				}
				//tab to more and tab back, when focus on 'more' skip this block
				if (this._outFocusTarget !== this._moreTarget) {
					this._setFocus(oEvent, this._moreTarget);
					return;					
				}
			}			
		}
	}
	
	//***********************************************************************************************************************************************	
	// directly shift+tab back
	//***********************************************************************************************************************************************	
/*	if (!this._dummy && this._previousTarget == null && this._moreButtonFound && this._tabnext == false && oEvent.target == this._lastShell) {
		if (this._moreButtonFound && oEvent.target.id.indexOf("more") < 0) {
			this._setFocus(oEvent, this._moreTarget);
			alert("a12");
			return;
		}
	}*/	

	//***********************************************************************************************************************************************
	//this block will be used when the enable social
	//directly shift+tab or shift+tab from 'out of focus' area; the last tab social toolbar and is "sap-ui-fastnavgroup"
	//***********************************************************************************************************************************************	
	//comment out - scroll back to top when click on the last button
/*	if (!this._dummy && this._previousTarget == null && !this._moreButtonFound && this._tabnext == false && oEvent.target.id == this._sapTabbable[this._sapTabbable.length - 1].id) {
		this._setFocusOnMoreAddFilterButton(oEvent);
		return;
	}*/

	//***********************************************************************************************************************************************
	//when directly shift+f6 from other control,
	//social is enable and there is no 'more' button and there are more than one tabble fields in social toolbar.
	//this block of codes will force the focus on shell level instead tabble field of item shell
	//**********************************************************************************************************************************************
	if (!this._dummy && this._previousTarget == null && !this._moreButtonFound && this._tabnext == false && this._firstTimeSetFocus == true &&  
//		oEvent.target.id.indexOf("filter") < 0) { //directl tab next and target id is filter, then skip this block
		!this._targetIdInHeaderBar(oEvent)) { //directl tab next and target id is filter, then skip this block
		var oTargetPosition = null;
		for (var i = 0; i < this._sapTabbable.length; i++) {
			if (oEvent.target.id ==  this._sapTabbable[i].id) {
				oTargetPosition = i;
				break; 
			}
		}
/*		var lastTabPosition = this._sapTabbable.length - 1;
		//to fixed scrolling issue when first time click on link or button
		if (oTargetPosition !== null && oTargetPosition < lastTabPosition) {
			this._firstTimeSetFocus = false;
			this._setFocus(oEvent, this._firstShell);
			return;
		}*/

	} 
};

sap.suite.ui.commons.Timeline.prototype._targetIdInHeaderBar = function(oEvent) {
	for (var i = 0; i < this._headerBarFieldLength; i++) { //currently already focused on the last headerbar button. If the prev focus not in 1st shell
		if (oEvent.target.id === this.getHeaderBar().getContent()[i].sId) { //button in headerbar, let central handle the focus
			return true;
		}
	}
	return false;
};

sap.suite.ui.commons.Timeline.prototype._targetIdIsLastHeaderBarBtn = function(oEvent) {
	if (oEvent.target.id === this._lastHeaderBaRTabField.id) {
		return true;
	}
	return false;
};

sap.suite.ui.commons.Timeline.prototype._targetIdIsFirstHeaderBarBtn = function(oEvent) {
	if (oEvent.target.id === this._firstHeaderBaRTabField.id) {
		return true;
	}
	return false;
};

sap.suite.ui.commons.Timeline.prototype._setFocusOnMoreAddFilterButton = function(oEvent) {
	this._tabprevious = false;
//focus on the 1st item last interactive element 
	var firstShellTarget = this._getFirstShellTarget();
	var lastInteractiveElement = this._getLastInteractiveElementInItem(firstShellTarget);
	this._previousTarget = lastInteractiveElement;
	this._previousShellTarget = firstShellTarget;
	this._setFocus(oEvent, lastInteractiveElement);
};

//Handle F6
sap.suite.ui.commons.Timeline.prototype.onsapskipforward = function(oEvent) {
	this._skipOnFocusIn = true;
	this._tabnext = false;
	this._dummy = true;
	if (this.oItemNavigation) {
		this.removeDelegate(this.oItemNavigation);
		this.oItemNavigation.destroy();
	}
	this._startItemNavigation();

//	if (oEvent.target.id.indexOf("add") < 0 && oEvent.target.id.indexOf("filter") < 0 && oEvent.target.id.indexOf("more") < 0 && oEvent.target.className !== "sapMMsgStripCloseButton") {
	if (!this._targetIdInHeaderBar(oEvent) && oEvent.target.id.indexOf("more") < 0 && oEvent.target.className !== "sapMMsgStripCloseButton") {
		if (!this._targetIdIsMessageStripTab(oEvent)) { 
			this._previousTabPreviousTarget = oEvent.target;	
		}	
	}
	
	if (oEvent.target.id.indexOf("more") >= 0) { //when hit more, then out of timeline control
		return;
	}

	
	if (oEvent.target.id.indexOf("shell") >= 0) {
		if (this._moreButtonFound) {
			this._setFocus(oEvent, this._moreTarget);
			return;
		}
		jQuery(this._sapTabbable[this._sapTabbable.length - 1]).focus();
		return;
	}

	if (oEvent.target.className === "sapMMsgStripCloseButton") {
		this._findNextF6ShellTarget(oEvent);
		return;
	}
	
//	if (oEvent.target.id.indexOf("shell") < 0 && oEvent.target.id.indexOf("add") < 0 && oEvent.target.id.indexOf("filter") < 0 && oEvent.target.id.indexOf("more") < 0) {
	if (oEvent.target.id.indexOf("shell") < 0 && !this._targetIdInHeaderBar(oEvent) && oEvent.target.id.indexOf("more") < 0) {
		var shellTarget = null;
		shellTarget = this._getItemShellTarget(oEvent.target);
		if (this._moreButtonFound) {
			this._setFocus(oEvent, this._moreTarget);
			return;
		}
		jQuery(this._sapTabbable[this._sapTabbable.length - 1]).focus();
		return;		
	}
		
/*	if (this._previousTarget == null && oEvent.target.id.indexOf("add") < 0 && oEvent.target.id.indexOf("filter") < 0) {
		if (this._addButtonFound) {
			this._setFocus(oEvent, this._addTarget);
			return;
		}
		if (this._filterTarget != null) {
			this._setFocus(oEvent, this._filterTarget);
			return;
		}
	}*/
	
	if (this._previousTarget == null && !this._targetIdInHeaderBar(oEvent)) { 
		this._setFocus(oEvent, this._firstHeaderBaRTabField);
		return;
	}	
	
//	if (oEvent.target.id.indexOf("add") >= 0 || oEvent.target.id.indexOf("filter") >= 0) {
	if (this._targetIdIsLastHeaderBarBtn(oEvent)) {
		if (this._messageStripIsAvailable) { 
			var nextTarget = null;
			for (var i=0; i < this._sapTabbable.length; i++) {
				if (this._sapTabbable[i].className == "sapMMsgStripCloseButton" ) {
					nextTarget = this._sapTabbable[i];
					break;
				}
			}
			if (nextTarget !== null) {
				this._setFocus(oEvent, this._sapTabbable[2]);
				return;			
			}
		}
		if (this._previousTarget == null) {
			var firstTarget = this._getFirstShellTarget();
			this._previousTarget = firstTarget;
			this._previousShellTarget = firstTarget; 
			this._setFocus(oEvent, firstTarget);
			return;
		}
	}
	
	var prevFocusShellTarget = null;
//	if ((oEvent.target.id.indexOf("filter") >= 0 || oEvent.target.id.indexOf("add") >= 0) && this._previousTarget != null && oEvent.target != this._previousTarget) {
	if (this._targetIdIsLastHeaderBarBtn(oEvent) && this._previousTarget != null && oEvent.target != this._previousTarget) {
		this._findNextF6ShellTarget(oEvent);
		return;		
	}	

};

sap.suite.ui.commons.Timeline.prototype._findNextF6ShellTarget = function(oEvent) {
	
	if (this._previousShellTarget != null) {
		for (var i = 0; i < this._sapTabbable.length; i++) {
			if (this._previousShellTarget.id ==  this._sapTabbable[i].id) {
				this._setFocus(oEvent, this._sapTabbable[i]);
				return;
			}
		}
	}

	//focus on 1st shell if previous shell not found
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (this._sapTabbable[i].id.indexOf("shell") >= 0) {
			this._previousShellTarget = this._sapTabbable[i];
			this._setFocus(oEvent, this._sapTabbable[i]);  
			break;
		}
	}
	
	if (this._previousTarget.id.indexOf("shell") >= 0) {
		for (var i = 0; i < this._sapTabbable.length; i++) {
			if (this._previousTarget.id ==  this._sapTabbable[i].id) {
				this._setFocus(oEvent, this._sapTabbable[i]);
				return;
			}
		}
	}			
	
	for (var i = 0; i < this._sapTabbable.length; i++) {
		if (this._sapTabbable[i].id.indexOf("shell") >= 0) {
			this._previousShellTarget = this._sapTabbable[i];  
			this._setFocus(oEvent, this._sapTabbable[i]);
			break;
		}
	}

};

sap.suite.ui.commons.Timeline.prototype._shiftf6NoDataFocus = function(oEvent) {
	//to fix focus issue when no timeline item data exist - no data 
	if (this._messageStripCloseButtonTarget !== null) {
		this._setFocus(oEvent, this._messageStripCloseButtonTarget);
		return;
	}
		
	if (this._firstHeaderBaRTabField != null) {
		this._setFocus(oEvent, this._firstHeaderBaRTabField);
		return;			
	}	
};

//Handle SHIFT+F6
sap.suite.ui.commons.Timeline.prototype.onsapskipback = function(oEvent) {
	this._skipOnFocusIn = true;
	this._dummy = true;
	if (this.oItemNavigation) {
		this.removeDelegate(this.oItemNavigation);
		this.oItemNavigation.destroy();
	}
	this._startItemNavigation(); 

	if (oEvent.target.id.indexOf("shell") >= 0) {
		this._previousShiftF6Target = oEvent.target; //save for shift back without more button and no focus before - for 2nd run
	}

	
	if (this._messageStripIsAvailable && oEvent.target.id.indexOf("shell") >= 0) {
		this._setFocus(oEvent, this._messageStripCloseButtonTarget);
		return;
	}
	if (oEvent.target.id.indexOf("shell") >= 0) { 
		if (this._messageStripCloseButtonTarget !== null) {
			this._setFocus(oEvent, this._messageStripCloseButtonTarget);
			return;
		}
			
		if (this._firstHeaderBaRTabField != null) {
			this._setFocus(oEvent, this._firstHeaderBaRTabField);
			return;			
		}
		jQuery(this._firstShell).focus(); 
		return;

	}
	
	if (oEvent.target.className === "sapMMsgStripCloseButton") {
		return;
	}
	
	if (oEvent.target.id.indexOf("shell") >= 0 && !this._targetIdInHeaderBar(oEvent)) {
		this._setFocus(oEvent, this._lastHeaderBaRTabField);
		return;
	};

	//to fix focus issue when no timeline item data exist - no data
	if (oEvent.target.classList.length >= 1) {
		var nofound = false;
		for (var i = 0; i < oEvent.target.classList.length - 1; i++) {
			if (oEvent.target.classList[i] === "sapMListNoData") {
				nofound = true;
				break;			
			}
		}
		if (nofound) {
			this._shiftf6NoDataFocus(oEvent);
			return;			
		}
	}
	//to fix focus issue when no timeline item data exist - no data
	if (oEvent.target.id.indexOf("nodata") >= 0) {
		if (this._getFirstShellTarget() === null) {
			this._shiftf6NoDataFocus(oEvent);
			return;
		}		
	}
	
	if (oEvent.target.id.indexOf("more") >= 0) {
		if (this._getFirstShellTarget() == null) {
			return;
		}
		
	};
	//*dcins-e
	if (oEvent.target.id.indexOf("more") >= 0 && this._previousTarget === null) {
		this._setFocus(oEvent, this._getFirstShellTarget());	
		return;
	};
	
	if (oEvent.target.id.indexOf("more") >= 0 && this._previousTarget !== null) {
		if (this._previousTarget.id.indexOf("shell") >= 0) {
			for (var i = 0; i < this._sapTabbable.length; i++) {
				if (this._previousTarget.id ==  this._sapTabbable[i].id) {
					this._setFocus(oEvent, this._sapTabbable[i]);
					return;
				}
			}
		}
		else {
			for (var i = 0; i < this._sapTabbable.length; i++) {
				if (this._previousTarget.id ==  this._sapTabbable[i].id) { 
					break;
				}
			}
			this._setFocus(oEvent, this._getItemShellTarget(this._sapTabbable[i]));
			return;
		}
	};
	
	if (oEvent.target.id.indexOf("shell") < 0 && !this._targetIdInHeaderBar(oEvent) && oEvent.target.id.indexOf("more") < 0) {
		if (this._previousTarget == null) {
			if (this._moreButtonFound) { 
				this._setFocus(oEvent, this._moreTarget);
				return;
			}
			lastInteractiveElement = this._getLastInteractiveElementInItem(this._getFirstShellTarget());
			jQuery(lastInteractiveElement).focus();
			return;
		}
	}
	
	var lastInteractiveElement = null;
	var prevFocusShellTarget = null;
	var ShellTarget = null;

	if (!this._targetIdInHeaderBar(oEvent) && oEvent.target.id.indexOf("more") < 0) {
		if (this._previousTarget == null) {
			lastInteractiveElement = this._getLastInteractiveElementInItem(this._getFirstShellTarget());
			jQuery(lastInteractiveElement).focus();
		}
		else {
			//always focus on shell level
		    var shellTargetFound = false;   	
		   	ShellTarget = this._getItemShellTarget(this._previousShellTarget);
		   	shellTargetFound = true;	   	
		   	if (shellTargetFound) { 
				prevFocusShellTarget = ShellTarget;
				jQuery(ShellTarget).focus();
				oEvent.preventDefault();
				oEvent.setMarked();
				return;						
		   	}

		}
		oEvent.preventDefault();
		oEvent.setMarked();
		return;	
	}
};

//sap.suite.ui.commons.Timeline.prototype.setAxisOrientation = function(axis) {
//	this.setProperty("axisOrientation", axis, true);
//};

//sap.suite.ui.commons.Timeline.prototype.setAxisOrientation = function(axis) {
//	this.setProperty("axisOrientation", axis, true);
//};

//Public method to adjust UI changes - for access
sap.suite.ui.commons.Timeline.prototype.adjustUI = function() {
	this._performUiChanges();
}

//method top perform UI Changes
sap.suite.ui.commons.Timeline.prototype._performUiChanges = function() {
	if (this.getAxisOrientation() === sap.suite.ui.commons.TimelineAxisOrientation.Vertical) { //if the orientation is vertical
		  if (this.getGroup() && this.getGroupBy() != '') { //if grouping is enabled
			  this._performUiChangesVGrp(); //perform ui changes for group
		  } else {
		  	this._performUiChangesV(); //regular timeline ui changes
		  }
	} else {
		this._performUiChangesH(); //horizontal timeline
	}
};

sap.suite.ui.commons.Timeline.prototype._performUiChangesH = function() {
//	var showIcons = this.getShowIcons();
	var jThis = this.$();
//	var liItems = jThis.find('.sapSuiteUiCommonsTimelineItemBox');
//	var contentMaxHeight = 0;
//	for (var i = 0; i < liItems.length; i++) {
//		var contentHeight = liItems[i].clientHeight;
//		if (contentMaxHeight < contentHeight){
//			contentMaxHeight = contentHeight;
//		}
//	}
//	contentMaxHeight = contentMaxHeight+50 // buffer for icon and bar space.  
	
	// escape dot as special char in the Fiori view IDs.
	var myId = this.getId();
	if (myId.indexOf("\.") != -1) { // there is a dot in the id.
	    myId = myId.replace( /(:|\.|\[|\])/g, "\\$1" ); // escape the ". and :" with "\\."
	}

	var _toolbarHeight = jThis.find("#" + myId + "-filterToolBar").outerHeight();
	var _infoBarHeight = jThis.find("#" + myId + "-filterInfoBar").outerHeight();
	
	var contentBox = jThis.find('.sapSuiteUiCommonsTimelineContentsH');
	
	var selfHeight = jThis.height();
	contentBox.css({
		'height' : selfHeight - (_toolbarHeight + _infoBarHeight)
	});
};

/* This function is used to perform UI Changes for Doublesided timeline in grouping mode*/
sap.suite.ui.commons.Timeline.prototype._performDoubleSidedChangesGroup = function() {
	var jThis = this.$();
	var showIcons = this.getShowIcons(); // showIcons set to true
	var ulItems = jThis.find('ul'); // find all the group UL elements
  var grpAlignmentLeft = 0;
	for (var j = 0; j < ulItems.length; j++) { //loop through timeline Groups UL
		var ulInd = j + 1;
		var grpItem;
		var ulElem = jThis.find(ulItems[j]); //find first ul
		var liItems = jThis.find(ulItems[j]).find('li'); //find first ul li elements

		ulElem.addClass('sapSuiteUiCommonsTimelineItemUL');//add timelineitemeven class
	
				var firstGroupLI = true; // this is used to check first Element of UL(group li element)
				var isOdd = true; //variable for checking element is odd/even
				var lineInd =0; 
				for (var i = 0; i < liItems.length; i++) { //loop through timeline items LI
					
				if(firstGroupLI) { // first li element of the UL
						  lineInd = lineInd + 1;
					  	firstGroupLI = false; // rest of the LI elements are normal timelineitems (Not grouped)
						  var liElem = jThis.find(liItems[i]); //find first LI
						  liElem.removeClass('sapSuiteUiCommonsTimelineItem'); //remove timelineitem class
						  liElem.addClass('sapSuiteUiCommonsTimelineItemGrp'); //add timelineitemgroup class
							
							var grpWrapper = liElem.find('.sapSuiteUiCommonsTimelineItemWrapperGrp'); //find the group item wrapper
							grpWrapper.removeClass('sapSuiteUiCommonsTimelineItemWrapperGrp'); //remove normal item wrapper
							grpWrapper.addClass('sapSuiteUiCommonsTimelineItemWrapperGrpDblSide'); // add doublesided grouping wrapper
							grpWrapper = liElem.find('.sapSuiteUiCommonsTimelineItemWrapperGrpDblSide'); //find doublesided grouping wrapper
							grpItem = grpWrapper; //assign doublesided grouping wrapper to local variable
							
							var grpWrapperBar = grpWrapper.find('.sapSuiteUiCommonsTimelineItemBar'); //find timelineitem bar
							grpWrapperBar.removeClass('sapSuiteUiCommonsTimelineItemBar'); // remove timeline item bar class
							grpWrapperBar.addClass('sapSuiteUiCommonsTimelineItemBarGrp'); // add timeline item grouping bar class		
							
							if (j>0){
									var prevulElem = jThis.find(ulItems[j-1]); //find first ul
									
									var prevULFirstLI = prevulElem.find('li').find('.sapSuiteUiCommonsTimelineItemWrapperGrpDblSide');
									
									if (prevULFirstLI != undefined) {
										//	var	PrevgrpWrapper = prevULFirstLI.find('.sapSuiteUiCommonsTimelineItemWrapperGrpDblSide');
											grpItem.css({
													'left' : prevULFirstLI.css('left') // add left attribute to group element to align with the even timeline items
											});
									}
							}
							
					/*		
						
							
							if (grpAlignmentLeft > 0){
								grpItem.css({
													'left' : grpAlignmentLeft+ 'px' // add left attribute to group element to align with the even timeline items
											});
							}*/
								
				} else { //timeline items of the group
						lineInd = lineInd + 1;
						var liElem = jThis.find(liItems[i]); //find first LI
					
						if (liElem[0] != undefined) {
							if (liElem[0].className == 'sapSuiteUiCommonsTimelineItem') { //check if the class is normal timelineitem (When timeline is loaded initially all the items of sapSuiteUiCommonsTimelineItem)
					
								liElem.removeClass('sapSuiteUiCommonsTimelineItem'); // remove regular timelineitem class
								if (!isOdd) {//if timelineitem is "even" - for even timeline items, in doublesided mode we need to move them to right side
									
									liElem.addClass('sapSuiteUiCommonsTimelineItemEven');//add timelineitemeven class
									var _PrevliElem = jThis.find(liItems[i-1]); //find previuos LI element (in this case odd timelineitem)
									
									liElem.css({
										'left' : (_PrevliElem.width() + 42)+ 'px' // add left attribue to move the element to the right
									});
									grpItem.css({
										'left' : (_PrevliElem.width() + 42)+ 'px' // add left attribute to group element to align with the even timeline items
									});
									grpAlignmentLeft = 	(_PrevliElem.width() + 42);
									isOdd = true; //next element is an odd timelineitem
								
								}  else { // if timeline item is "odd"
								
									isOdd = false; //next element is even timelineitem
									var _PrevliElem = jThis.find(liItems[i-1]); //find first LI
							

									liElem.addClass('sapSuiteUiCommonsTimelineItemOdd'); //add timelineitemodd class
								
									var liArrow = liElem.find('.sapSuiteUiCommonsTimelineItemArrow');
									liArrow.removeClass('sapSuiteUiCommonsTimelineItemArrow')
									liArrow.addClass('sapSuiteUiCommonsTimelineItemArrowOdd'); //add timelineitemodd class
									
								 if (showIcons) {	//timeline property for show icons is set to true
									 	var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemIcon'); // find the timelineitemicon of the the timelineitem
										liIcon.removeClass('sapSuiteUiCommonsTimelineItemIcon')
										liIcon.addClass('sapSuiteUiCommonsTimelineItemIconOdd'); //add timelineitemodd class
										
											grpItem.css({
													'left' : grpAlignmentLeft+ 'px' // add left attribute to group element to align with the even timeline items
											});
									
								 } else { //no icons
									 	var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemNoIcon'); // find the timelineitemicon of the the timelineitem
										liIcon.removeClass('sapSuiteUiCommonsTimelineItemNoIcon')
										liIcon.addClass('sapSuiteUiCommonsTimelineItemNoIconOdd'); //add timelineitemodd class
										
									 }
									
										var liBar = liElem.find('.sapSuiteUiCommonsTimelineItemBar');
										liBar.removeClass('sapSuiteUiCommonsTimelineItemBar')
										liBar.addClass('sapSuiteUiCommonsTimelineItemBarOdd'); //add timelineitemodd class
										
										
									} //end odd timelineitem odd
							} else { //end check timelineitem class (this happens when we resize timeline after the intial load)
								if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemEven') {
												var _PrevliElem = jThis.find(liItems[i-1]); //find first LI
											
												liElem.css({
													'left' : (_PrevliElem.width() + 42)+ 'px' // add left attribue to move the element to the right
												});
												
													grpItem.css({
																'left' : (_PrevliElem.width() + 42)+ 'px' // add left attribute to group element to align with the even timeline items
													});
								} //end timelineitemevenclass check
							} //end timelineitemclass check
					} //end timelineitem undefined check
				} //end timelineitem group check
				
			}//end group timelineitems loop
				
	} //end group loop
				
	}; 
	
/*This function is used to perform doublesided ui changes (No grouping) */
sap.suite.ui.commons.Timeline.prototype._performDoubleSidedChanges = function() {
		var jThis = this.$();
		var liItems = jThis.find('li');
		var showIcons = this.getShowIcons();
		var isOdd = true;
		
		var grpItems = jThis.find('sapSuiteUiCommonsTimelineItemGrp');
		
				 //add margin to first even timelineitem
					var firstEvenLi =  jThis.find('li:nth-child(2)');
					if (firstEvenLi[0]) {			
									firstEvenLi.css({
												'margin-top' : '40px'
											});
					}
					
					for (var i = 0; i < liItems.length; i++) { //loop through timeline items LI
					var lineInd = i + 1;
						var liElem = jThis.find('li:nth-child(' + lineInd + ')'); //find first LI
				
						if (liElem[0].className == 'sapSuiteUiCommonsTimelineItem') { //check if it is regular timeline item
								liElem.removeClass('sapSuiteUiCommonsTimelineItem'); // remove regular timelineitem class
								if (lineInd % 2 === 0) {//if timelineitem is "even"
										//liElem.addClass('sapSuiteUiCommonsTimelineItemEven');//add timelineitemeven class
										var _PrevliElem = jThis.find(liItems[i-1]); //find first LI
										liElem.addClass('sapSuiteUiCommonsTimelineItemEven');//add timelineitemeven class
										liElem.css({
											'left' : (_PrevliElem.width() + 52)+ 'px'
										});
										isOdd = true;
									} else {  // if timeline item is "odd"
										liElem.addClass('sapSuiteUiCommonsTimelineItemOdd'); //add timelineitemodd class
										
										
									
										var liArrow = liElem.find('.sapSuiteUiCommonsTimelineItemArrow');
										liArrow.removeClass('sapSuiteUiCommonsTimelineItemArrow')
										liArrow.addClass('sapSuiteUiCommonsTimelineItemArrowOdd'); //add timelineitemodd class
								    
										if (showIcons) {
											var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemIcon'); // find the timelineitemicon of the the timelineitem
											liIcon.removeClass('sapSuiteUiCommonsTimelineItemIcon')
											liIcon.addClass('sapSuiteUiCommonsTimelineItemIconOdd'); //add timelineitemodd class
										
											
										} else {
										 	var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemNoIcon'); // find the timelineitemicon of the the timelineitem
										 	liIcon.removeClass('sapSuiteUiCommonsTimelineItemNoIcon')
										 	liIcon.addClass('sapSuiteUiCommonsTimelineItemNoIconOdd'); //add timelineitemodd class
										
										}
											var liBar = liElem.find('.sapSuiteUiCommonsTimelineItemBar');
											liBar.removeClass('sapSuiteUiCommonsTimelineItemBar')
											liBar.addClass('sapSuiteUiCommonsTimelineItemBarOdd'); // add timelineitemodd class
										
									}  //end odd timelineitem odd
							}else { //end check timelineitem class
												if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemEven') {
													var _PrevliElem = jThis.find(liItems[i-1]); //find first LI
												//	liElem.addClass('sapSuiteUiCommonsTimelineItemEven');//add timelineitemeven class
													liElem.css({
														'left' : (_PrevliElem.width() + 42)+ 'px'
													});
									} //end check timelineitem class
							}
					}//end timelineitems loop
		};

/*This function is used for single sided timeline with grouping */
sap.suite.ui.commons.Timeline.prototype._performSingleSidedChangesGrp = function() {
	var jThis = this.$();
	var showIcons = this.getShowIcons();
	var ulItems = jThis.find('ul');
	
	
	for (var j = 0; j < ulItems.length; j++) { //loop through timeline Groups UL
		var ulInd = j + 1;
		
		var ulElem = jThis.find('ul:nth-child(' + ulInd + ')'); //find first ul
		var liItems = jThis.find('ul:nth-child(' + ulInd + ')').find('li'); //find first ul
		var firstGroupLI = true;
	
		for (var i = 0; i < liItems.length; i++) {  //loop through timeline items
			var liElem = jThis.find(liItems[i]);     //get timelineitem
			liElem.css({				//reset the margins to 0 (if toggled from show groups to no groups)
				'margin-top' :0 + 'px'
			});
			if(firstGroupLI) {	//first li item in group
				liElem.find('.sapSuiteUiCommonsTimelineItem'); //find normal timelineitem  class
				liElem.removeClass('sapSuiteUiCommonsTimelineItem');//remove normal timelineitem  class
				liElem.addClass('sapSuiteUiCommonsTimelineItemGrp');//add grouped timelineitem  class
				
				
				var grpWrapper = liElem.find('.sapSuiteUiCommonsTimelineItemBar'); //find timeline item bar
				grpWrapper.removeClass('sapSuiteUiCommonsTimelineItemBar'); //remove normal timeline item bar
				grpWrapper.addClass('sapSuiteUiCommonsTimelineItemBarGrp'); // add grouped timeline item bar
						
			
				var grpWrapper = liElem.find('.sapSuiteUiCommonsTimelineItemWrapperGrpDblSide'); //find grouped timeline wrapper (if toggled from show groups to no groups)
				grpWrapper.removeClass('sapSuiteUiCommonsTimelineItemWrapperGrpDblSide'); //remove grouped wrapper class
				grpWrapper.addClass('sapSuiteUiCommonsTimelineItemWrapperGrp'); // add single sided wrapper class
				grpWrapper = liElem.find('.sapSuiteUiCommonsTimelineItemWrapperGrp'); // find single sided wrapper class
				
				grpWrapper.css({
					'left' : '.5rem' //set the left (if toggling from double sided to single sided)
				});
				
				
				var grpWrapperBar = grpWrapper.find('.sapSuiteUiCommonsTimelineItemBar'); //find timelineitem bar
				grpWrapperBar.removeClass('sapSuiteUiCommonsTimelineItemBar'); // remove timelineitem bar class 
				grpWrapperBar.addClass('sapSuiteUiCommonsTimelineItemBarGrp'); //add timelineitem grouped bar class
					
				var grpIcon = grpWrapper.find('.sapUiBtn'); //find button
				grpIcon.addClass('sapSuiteUiCommonsTimelineGroupItemIcon'); //add grouped icon
				firstGroupLI = false; // next item is not group li
			} else { //not group LI
			if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemOdd') {//check if it is timelineitemodd class
				liElem.removeClass('sapSuiteUiCommonsTimelineItemOdd'); //remove odd class
				liElem.addClass('sapSuiteUiCommonsTimelineItem'); // add regular timelineclass
	
				var liArrow = liElem.find('.sapSuiteUiCommonsTimelineItemArrowOdd');
				liArrow.removeClass('sapSuiteUiCommonsTimelineItemArrowOdd')
				liArrow.addClass('sapSuiteUiCommonsTimelineItemArrow'); //add timelineitemodd class
					    
					 if (showIcons) {	
						var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemIconOdd'); // find the timelineitemicon of the the timelineitem
							liIcon.removeClass('sapSuiteUiCommonsTimelineItemIconOdd')
							liIcon.addClass('sapSuiteUiCommonsTimelineItemIcon'); //add timelineitemodd class
					 } else {
					 
						 	var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemNoIconOdd'); // find the timelineitemicon of the the timelineitem
							liIcon.removeClass('sapSuiteUiCommonsTimelineItemNoIconOdd')
							liIcon.addClass('sapSuiteUiCommonsTimelineItemNoIcon'); //add timelineitemodd class
							liIcon.css({
								left: '1.15rem'
							});
							liIcon.css({
								'margin-top': '0px'
							});
					 
					 }
							var liBar = liElem.find('.sapSuiteUiCommonsTimelineItemBarOdd');
							liBar.removeClass('sapSuiteUiCommonsTimelineItemBarOdd')
							liBar.addClass('sapSuiteUiCommonsTimelineItemBar'); //add timelineitemodd class
				
						
			} else if ( liElem[0].className ==  'sapSuiteUiCommonsTimelineItemEven') { //if timelineitem is even
						liElem.removeClass('sapSuiteUiCommonsTimelineItemEven');  //remove even timelineitem class
						liElem.addClass('sapSuiteUiCommonsTimelineItem'); //add regular timelineitemc lass
						
						var liBar = liElem.find('.sapSuiteUiCommonsTimelineItemBar');
						
						liBar.css({
							'margin-top': '0px'
						});
						
						var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemIcon');
						liIcon.css({
							'margin-top': '0px'
					});
							var liArrow = liElem.find('.sapSuiteUiCommonsTimelineItemArrow');
							
							liArrow.css({
							'margin-top': '0px'
					});
						
					}//end chheck if timelineitem is even
			else if ( liElem[0].className ==  'sapSuiteUiCommonsTimelineItemGrp') {
		
						var grpWrapper = liElem.find('.sapSuiteUiCommonsTimelineItemWrapperGrpDblSide');
						grpWrapper.removeClass('sapSuiteUiCommonsTimelineItemWrapperGrpDblSide');
						grpWrapper.addClass('sapSuiteUiCommonsTimelineItemWrapperGrp');
						grpWrapper = liElem.find('.sapSuiteUiCommonsTimelineItemWrapperGrp');
																			 
					
						grpWrapper.css({
							'left' : '.5rem'
						});
						
						var grpWrapperBar = grpWrapper.find('.sapSuiteUiCommonsTimelineItemBar');
						grpWrapperBar.removeClass('sapSuiteUiCommonsTimelineItemBar');
						grpWrapperBar.addClass('sapSuiteUiCommonsTimelineItemBarGrp');
				
							liElem.css({
								'margin-top' :0 + 'px'
							});
				} //end line item group check
				
			}//end of first li check
		}//end of li loop	
				
	}//end if UL Loop
	
	if (this._showMore) {
		if ( document.getElementById(this.getId() + '-showmore') != undefined) {
           document.getElementById(this.getId() + '-showmore').style.top = 'auto';
           document.getElementById(this.getId() + '-showmore').style.position = 'relative';
           document.getElementById(this.getId() + '-showmore').style.marginTop = '0px';
           jThis.find('.sapSuiteUiCommonsTimelineGetMoreBar').show();

		 }
    }
};

/*this function is used to perform single sided UI changes (no grouping, no doublesided) */
sap.suite.ui.commons.Timeline.prototype._performSingleSidedChanges = function() {
	var jThis = this.$();
	var liItems = jThis.find('li');
	var showIcons = this.getShowIcons();
	for (var i = 0; i < liItems.length; i++) {     //loop through timeline items
			var lineInd = i + 1;
			var liElem = jThis.find('li:nth-child(' + lineInd + ')');     //get timelineitem
			if (liElem[0] != undefined) {
		
				if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemOdd') { //check if it is timelineitemodd class
							liElem.removeClass('sapSuiteUiCommonsTimelineItemOdd'); //remove odd class
							liElem.addClass('sapSuiteUiCommonsTimelineItem'); // add regular timelineclass
							
							var liArrow = liElem.find('.sapSuiteUiCommonsTimelineItemArrowOdd');
							liArrow.removeClass('sapSuiteUiCommonsTimelineItemArrowOdd')
							liArrow.addClass('sapSuiteUiCommonsTimelineItemArrow'); //add timelineitemodd class
					
						 if (showIcons) {	
							 	var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemIconOdd'); // find the timelineitemicon of the the timelineitem
								liIcon.removeClass('sapSuiteUiCommonsTimelineItemIconOdd')
								liIcon.addClass('sapSuiteUiCommonsTimelineItemIcon'); //add timelineitemodd class
							
						 } else {
							 	var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemNoIconOdd'); // find the timelineitemicon of the the timelineitem
								liIcon.removeClass('sapSuiteUiCommonsTimelineItemNoIconOdd')
								liIcon.addClass('sapSuiteUiCommonsTimelineItemNoIcon'); //add timelineitemodd class
								}
								var liBar = liElem.find('.sapSuiteUiCommonsTimelineItemBarOdd');
								liBar.removeClass('sapSuiteUiCommonsTimelineItemBarOdd')
								liBar.addClass('sapSuiteUiCommonsTimelineItemBar'); //add timelineitemodd class
								
							
				} //end check if timelineitem is odd
				else if ( liElem[0].className ==  'sapSuiteUiCommonsTimelineItemEven') {//if timelineitem is even
						liElem.removeClass('sapSuiteUiCommonsTimelineItemEven');  //remove even timelineitem class
						liElem.addClass('sapSuiteUiCommonsTimelineItem'); //add regular timelineitemc lass		
						
						var liBar = liElem.find('.sapSuiteUiCommonsTimelineItemBar');
						
						liBar.css({
							'margin-top': '0px'
						});
						
						var liIcon = liElem.find('.sapSuiteUiCommonsTimelineItemIcon');
						liIcon.css({
							'margin-top': '0px'
					});
							var liArrow = liElem.find('.sapSuiteUiCommonsTimelineItemArrow');
							
							liArrow.css({
							'margin-top': '0px'
					});
				}//end chheck if timelineitem is even
			}
			
	}//end timelineitem looop
	if (this._showMore) {
           document.getElementById(this.getId() + '-showmore').style.top = 'auto';
           document.getElementById(this.getId() + '-showmore').style.position = 'relative';
           jThis.find('.sapSuiteUiCommonsTimelineGetMoreBar').show();
    }

};



//this method is used to perform UI Changes in group mode (singleSide)
sap.suite.ui.commons.Timeline.prototype._performUiChangesVGrp = function(groupID) {
	
	var showIcons = this.getShowIcons();
	var jThis = this.$();
	var ulItems = jThis.find('ul');
	var _outerWidth = jThis.outerWidth() + 50; //find parent width
	var _innerHeight = jThis.width(); // css height excluding buffer etc.

	//check if parent panel width can handle to display dobulesided timeline and double sided property is enabled
	if (_outerWidth >= this._maxTimeLineWidth && this.getEnableDoubleSided()) { 
		this._renderDblSided = true; //set local variable
		if (this.getGroup() && this.getGroupBy() != '') { //check if grouping is enabled
			this._performDoubleSidedChangesGroup(); //perform doublesided grouping UI changes
		} else {
		this._performDoubleSidedChanges(); //perform doublesided changes (no grouping)
		}
	} else { //no double sided
		if (jThis.find('li.sapSuiteUiCommonsTimelineItemOdd').length > 0) { //check if there are any doubled sided items(toggle from double sided)
			if (this.getGroup() && this.getGroupBy() != '') {  //check if grouping is enabled 
				this._performSingleSidedChangesGrp(); //perform singled sided grouping changes
			} else {
				this._performSingleSidedChanges(); //perform single sided UI changes (no grouping)
			}
		} else { //if coming for the first time
			this._performSingleSidedChangesGrp(); //perform singled ui changes (grouping)
		}
		this._renderDblSided = false; //reset doubled sided variable
	}
	
	
	for (var j = 0; j < ulItems.length; j++) { //loop through timeline Groups UL
		var ulInd = j + 1;
		
		var ulElem = jThis.find('ul:nth-child(' + ulInd + ')'); //find first ul
		var liItems = jThis.find('ul:nth-child(' + ulInd + ')').find('li'); //find first ul
	
		for (var i = 0; i < liItems.length; i++) { 
			var liElem = jThis.find(liItems[i]);     //get timelineitem
			
			var contentHeight = jThis.find(liElem).find('.sapSuiteUiCommonsTimelineItemBox').css('height');
			
			var offsetTop1 = 0;
			var offsetTop2 = 0;
			
			if (contentHeight !== undefined && parseInt(contentHeight.replace("px", "")) > 0) {
				offsetTop1 = jThis.find(liElem).find('.sapSuiteUiCommonsTimelineItemBox').offset().top;
				var liHeight = parseInt(contentHeight.replace("px", "")) + 23;// 10;
				if (i === (liItems.length - 1)) {
					liHeight += 28;// 15;
				}
				
				var liElem = jThis.find(liElem);
				
				if (groupID != undefined) {
					
					if (groupID == liElem.attr('groupID') && liElem.attr('nodeType') == 'GroupItem') {		
					// set the item div height
						jThis.find(liElem).css({
							'height' : liHeight + 'px'
						});
					}
					
				} else {
					jThis.find(liElem).css({
						'height' : liHeight + 'px'
					});
				}
				

				// set the bar/line height..
				var liBar = liBar;
				
				if (!this._renderDblSided) {//if doublesided
					if (liElem[0].className == 'sapSuiteUiCommonsTimelineItem') {
						liBar = jThis.find(liElem).find('.sapSuiteUiCommonsTimelineItemBar'); //get the line bar
					}
					if (!showIcons) { //if showIcons is false
						if (liBar) {
							//set bar styles
							liBar.css({
								'height' : (liHeight - 17) + 'px'
							});
						
							liBar.css({
								'top' : 30 + 'px'
							});
						}
					} else { // if showIcons is true
							if (liElem[0].className == 'sapSuiteUiCommonsTimelineItem') {
							liBar.css({
								'height' : (liHeight - 34) + 'px'
							});
						}
					}

			}
		}
		}
		
	}
		
	
		 this._performHeightChangesGrp();	
	    this._performScrollChangesGrp();
	  	
	  	
	  		 if (this._renderDblSided) {
						  if (this.getGroup() && this.getGroupBy() != '') {
							   this._performBarChangesGrp(groupID);
						   } else {
							   this._performBarChanges();
						   }
	  		 }
	
	
};

/*this function is normal timeline(single sided, no grouping)*/
sap.suite.ui.commons.Timeline.prototype._performUiChangesV = function () {
	var showIcons = this.getShowIcons();
	var jThis = this.$();

	var _outerWidth = jThis.outerWidth() + 50; //find parent width
	var _innerHeight = jThis.width(); // css height excluding buffer etc.
	//check if width can handle to display dobulesided timeline
	if (_outerWidth >= this._maxTimeLineWidth && this.getEnableDoubleSided()) {
		this._renderDblSided = true;
		if (this.getGroup() && this.getGroupBy() != '') {
			this._performDoubleSidedChangesGroup();
		} else {
			this._performDoubleSidedChanges();
		}
	} else {
		if (jThis.find('li.sapSuiteUiCommonsTimelineItemOdd').length > 0) {
			if (this.getGroup() && this.getGroupBy() != '') {
				this._performSingleSidedChangesGrp();
			} else {
				this._performSingleSidedChanges();
			}
		}
		this._renderDblSided = false;
	}


	var liItems = jThis.find('li');

	//loop through items
	for (var i = 0; i < liItems.length; i++) {
		var lineInd = i + 1;
		var contentHeight = jThis.find('li:nth-child(' + lineInd + ')').find('.sapSuiteUiCommonsTimelineItemBox').css('height');

		var offsetTop1 = 0;
		var offsetTop2 = 0;

		if (contentHeight !== undefined) {
			offsetTop1 = jThis.find('li:nth-child(' + lineInd + ')').find('.sapSuiteUiCommonsTimelineItemBox').offset().top;
			var liHeight = parseInt(contentHeight.replace("px", "")) + 23;// 10;
			if (i === (liItems.length - 1)) {
				liHeight += 28;// 15;
			}

			var liElem = jThis.find('li:nth-child(' + lineInd + ')');


			// set the item div height
			jThis.find('li:nth-child(' + lineInd + ')').css({
				'height': liHeight + 'px'
			});

			// set the bar/line height..
			var liBar = liBar;

			if (!this._renderDblSided) {//if doublesided
				if (liElem[0].className == 'sapSuiteUiCommonsTimelineItem') {
					liBar = jThis.find('li:nth-child(' + lineInd + ')').find('.sapSuiteUiCommonsTimelineItemBar'); //get the line bar
				}
				if (!showIcons) { //if showIcons is false
					if (liBar) {
						//set bar styles

						if (i < (liItems.length - 1)) {
							liBar.css({
								'height': (liHeight - 17) + 'px'
							});
							console.log(liHeight - 17);
							liBar.css({
								'top': 30 + 'px'
							});
						}
					}
				} else { // if showIcons is true
					if (liElem[0].className == 'sapSuiteUiCommonsTimelineItem') {
						liBar.css({
							'height': (liHeight - 34) + 'px'
						});
					}
				}
			}
		}
	}


	this._performHeightChanges();
	this._performScrollChanges();
	this._performBarChanges();

};


/* This function is used to calculate bar height in grouping mode */
sap.suite.ui.commons.Timeline.prototype._performBarChangesGrp = function(groupID){
	
	if (groupID == '' || groupID == undefined) { //only do it once 
		
		var showIcons = this.getShowIcons();
		var jThis = this.$();
		var ulItems = jThis.find('ul');
		
		
		var prevElementTop = 0;
		
		
		for (var j = 0; j < ulItems.length; j++) { //loop through timeline Groups UL
			var ulInd = j + 1;
			
			var ulElem = jThis.find('ul:nth-child(' + ulInd + ')'); //find first ul
			var liItems = jThis.find('ul:nth-child(' + ulInd + ')').find('li'); //find first ul

			var icons =[];
			var isOdd = true;
			for (var i = 1; i < liItems.length; i++) {
				var lineInd = i + 1;
				var liElem = jThis.find(liItems[i]);
				
				
				  if (showIcons) {
							if (liElem.find('.sapSuiteUiCommonsTimelineItemIconOdd').length > 0) {
								icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemIconOdd')); //get all the odd icons
							}
								
							if (liElem.find('.sapSuiteUiCommonsTimelineItemIcon').length > 0)	{
								icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemIcon')); //get all the odd icons
							}
					} else {
							if (liElem.find('.sapSuiteUiCommonsTimelineItemNoIconOdd').length > 0){
								icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemNoIconOdd')); //get all the odd icons
							}
								
							if (liElem.find('.sapSuiteUiCommonsTimelineItemNoIcon').length > 0){
								icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemNoIcon')); //get all the odd icons
							}
					}
				} //end items loop
			
			
				/*This block of code checks if the odd even timelineitem icons are overlapping each other 
          If they are we move timelineitem arrow and icon to the bottom of the timeline item */
				for (var icon=0; icon<icons.length - 1; icon++) {
			
					if (this.$().find(icons[icon + 1]).offset().top -  this.$().find(icons[icon]).offset().top < 0) {// check if they are overlapping 
						var iconObject = this.$().find(icons[icon]);
							var liObject = iconObject.closest('div').find('.sapSuiteUiCommonsTimelineItemBox');
					
							iconObject.css({
								'margin-top': (liObject.height() - 32) + 'px' // move the icon bottom of the timeline item
							});
							
							var arrowObject = iconObject.next().find('.sapSuiteUiCommonsTimelineItemArrow');
							arrowObject.css({
								'margin-top': (liObject.height() - 32) + 'px' //move arrow to the bottom
							});
							
							var barObject = iconObject.prev();
							barObject.css({
								'margin-top': (liObject.height() - 32) + 'px' //move bar to the botom
							});
					}
				}
				
				
				/* In order to draw timline bar in case of uneven odd/even timelineitems 
           we get all the icons and their Offset top location, and then sort them 
           based on theie offset location*/
           
				var sortedIcons =[];
				for (var icon=0; icon<icons.length; icon++) {
					var currIconTop = this.$().find(icons[icon]).offset().top; //get icon offset top
					var iconObject = {}; //create an object with icon details
					iconObject.id = this.$().find(icons[icon]).attr('id');  //get icon dom id
					iconObject.top = currIconTop; //icon offset top
					sortedIcons.push(iconObject); //push into array
					
				}
				
				
						sortedIcons.sort(function(a, b) { //sort them based on their offset top
								return parseFloat(a.top) - parseFloat(b.top);
						});
				
				
				for (var icon=0; icon<sortedIcons.length - 1; icon++) { //loop through sorted icons
						
						var iconObject = this.$().find("#" + sortedIcons[icon].id); //find the icon object
						var libar = iconObject.prev(); //find bar relative to the icon
						
						libar.css({
							'height' : (sortedIcons[icon+1].top - sortedIcons[icon].top) - 30  + 'px' //claculate height based on the current and previous icon top 
						});
					}
					
					if (sortedIcons.length > 0) {		//if last icon
							var iconObject = this.$().find("#" + sortedIcons[sortedIcons.length-1].id);
							var libar = iconObject.prev(); 
					//		libar.removeClass('sapSuiteUiCommonsTimelineItemBar')
								libar.removeClass('sapSuiteUiCommonsTimelineItemBarOdd')
									libar.removeClass('sapSuiteUiCommonsTimelineItemBarEven')
						//	libar.addClass('sapSuiteUiCommonsTimelineItemBarBottom'); //add timelineitemodd class
					}//end length check
				
		}//end UL loop		

	} //end first time check
	
};

//This function is used to setup bar hight
sap.suite.ui.commons.Timeline.prototype._performBarChanges = function(currentTop,icons)
{
 var showIcons = this.getShowIcons();
 var jThis = this.$();
 /*if (showIcons) //if show icons is true
 {*/
	var icons =[];
	
	
	var liItems = jThis.find('li');
	
	//loop through items
	for (var i = 0; i < liItems.length; i++) {
		var lineInd = i + 1;
		var liElem = jThis.find('li:nth-child(' + lineInd + ')');
		
		  if (showIcons) {
				if (liElem.find('.sapSuiteUiCommonsTimelineItemIconOdd').length > 0) {
					icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemIconOdd')); //get all the icons
				}
					
				if (liElem.find('.sapSuiteUiCommonsTimelineItemIcon').length > 0)	{
					icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemIcon')); //get all the icons
				}
		} else {
				if (liElem.find('.sapSuiteUiCommonsTimelineItemNoIconOdd').length > 0){
					icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemNoIconOdd')); //get all the icons
				}
					
				if (liElem.find('.sapSuiteUiCommonsTimelineItemNoIcon').length > 0)	{
					icons.push(liElem.find('.sapSuiteUiCommonsTimelineItemNoIcon')); //get all the icons
				}
		}
	}
	
	
	if (this._renderDblSided) {
			for (var icon=0; icon<icons.length - 1; icon++) {
				
				if (this.$().find(icons[icon + 1]).offset().top -  this.$().find(icons[icon]).offset().top < 15)
				{
					var iconObject = this.$().find(icons[icon]);
						var liObject = iconObject.closest('div').find('.sapSuiteUiCommonsTimelineItemBox');
				
						iconObject.css({
							'margin-top': (liObject.height() - 32) + 'px'
						});
						
						var arrowObject = iconObject.next().find('.sapSuiteUiCommonsTimelineItemArrow');
						arrowObject.css({
							'margin-top': (liObject.height() - 32) + 'px'
						});
						
						var barObject = iconObject.prev();
						barObject.css({
							'margin-top': (liObject.height() - 32) + 'px'
						});
				}
				
			
				
			}
	}
	
	var sortedIcons =[];
	for (var icon=0; icon<icons.length; icon++) {
		var currIconTop = this.$().find(icons[icon]).offset().top;
		var iconObject = {};
		iconObject.id = this.$().find(icons[icon]).attr('id');
		iconObject.top = currIconTop;
		sortedIcons.push(iconObject);
		
	}
	
	
			sortedIcons.sort(function(a, b) {
					return parseFloat(a.top) - parseFloat(b.top);
			});
	
	
	for (var icon=0; icon<sortedIcons.length - 1; icon++) {
			
			var iconObject = this.$().find("#" + sortedIcons[icon].id);
			var libar = iconObject.prev(); 
			
			libar.css({
				'height' : (sortedIcons[icon+1].top - sortedIcons[icon].top) - 30  + 'px'
			});
		}
		if (sortedIcons.length > 0) {		
				var iconObject = this.$().find("#" + sortedIcons[sortedIcons.length-1].id);
				var libar = iconObject.prev(); 
				//libar.removeClass('sapSuiteUiCommonsTimelineItemBar')
					libar.removeClass('sapSuiteUiCommonsTimelineItemBarOdd')
						libar.removeClass('sapSuiteUiCommonsTimelineItemBarEven')
			//	libar.addClass('sapSuiteUiCommonsTimelineItemBarBottom'); //add timelineitemodd class
		}
};


/* This function is used to calculate timlineitems margin top location in grouping mode */
sap.suite.ui.commons.Timeline.prototype._performHeightChangesGrp = function() {
	var jThis = this.$();
	var showIcons = this.getShowIcons();
	var ulItems = jThis.find('ul');
	
	
	var prevElementTop = 0;
	
	
	for (var j = 0; j < ulItems.length; j++) { //loop through timeline Groups UL
		var ulInd = j + 1;
		var ulElem = jThis.find('ul:nth-child(' + ulInd + ')'); //find first ul
		var liItems = jThis.find('ul:nth-child(' + ulInd + ')').find('li'); //find first ul

	
		var isOdd = true;
	
				var firstGroupLI = true;
				var evenMargins = 0;
				var oddMargins = 0;	
				var lineInd =0;
				for (var i = 0; i < liItems.length; i++) { //loop through timeline items LI
	
					 lineInd = lineInd + 1 ;
					 var liElem = jThis.find(liItems[i]);
		
					if (firstGroupLI && liElem[0].className != 'sapSuiteUiCommonsTimelineItemGrp'){ //if it is group line item

							liElem.css({//margins are zero for group line item
							'margin-left' : 0 + 'px',
							'margin-top' : 0 + 'px'
						});
						firstGroupLI = false;
						
					} else { //if is not group item
								if (liElem[0] != undefined) {
								
									if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemEven'){ //if an even timeline item
										var PrevliElem = jThis.find(liItems[i-2]); //get the previous even timeline item
										if (PrevliElem.offset() !== undefined)	{ //check if there is a previous timeline item, this will be undefined in the case of first even timeline item
										
											//	var PrevliElemTop = parseInt(PrevliElem.css('marginTop').replace("px", "")) ; //get the margin top of previous even timeline item
												var PrevliElemHeight = PrevliElem.css('height'); //get the height of the previous timeline item
												evenMargins = evenMargins +  	parseInt(PrevliElemHeight.replace("px", "")) ;  //add this to even margins variable
												liElem.css({
													'margin-left' : 0 + 'px',
													'margin-top' : evenMargins + 40
												});
												prevElementTop = evenMargins+ parseInt(liElem.css('height').replace("px", ""));
									  } else {
											liElem.css({
												'margin-left' : 0 + 'px',
												'margin-top' : evenMargins
											});
											prevElementTop = evenMargins;
										}
								}
								else if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemOdd') 	{
										var PrevliElem = jThis.find(liItems[i-2]);
											if (PrevliElem.offset() !== undefined) {
												var PrevliElemTop =parseInt(PrevliElem.css('marginTop').replace("px", "")) ;	
												var PrevliElemHeight = PrevliElem.css('height');
												oddMargins = oddMargins + 	parseInt(PrevliElemHeight.replace("px", "")) ;
												liElem.css({
													'margin-left' : 0 + 'px',
													'margin-top' : oddMargins
												});
										prevElementTop = oddMargins + parseInt(liElem.css('height').replace("px", ""));
									} else {
											liElem.css({
												'margin-left' : 0 + 'px',
												'margin-top' : oddMargins
											});
											prevElementTop = oddMargins;
										}
								
								}
								else if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemGrp' && this._renderDblSided) {
										var pul = ulInd - 1;
										var pliItems = jThis.find('ul:nth-child(' + pul + ')').find('li'); //find first ul
										if (pliItems.length > 0)	{
												var pliItem = jThis.find(pliItems[pliItems.length-1]);
											  if (pliItem.is(":visible")) {
													liElem.css({
													'margin-left' : 0 + 'px',
													'margin-top' : (parseInt(pliItem.css('marginTop').replace("px", "")) +  parseInt(pliItem.css('height').replace("px", "")) ) + 'px'
												});
											  }
									
										} else {
											liElem.css({
											'margin-left' : 0 + 'px',
											'margin-top' : 0 + 'px'
										});
								
								}
							}
							
					} // end check li elem defined or not
							
			}//end check if group item or not
	
	}//end li elements
	}//end ul elements
	
	
	//showmore button position.
	if (this._renderDblSided) {		
		if (this._showMore) {
		  if (this.getGroup() && this.getGroupBy() != '') {
			  var ulTop = parseInt(jThis.find('ul:nth-child(' + ulInd + ')').find('li:nth-child(1)').css('marginTop').replace('px',''));
			  var ulElments = jThis.find('ul:nth-child(' + ulInd + ')').find('li:nth-child(' + jThis.find('ul:nth-child(' + ulInd + ')').find('li').length + ')');
			  var lastElmTop = parseInt(jThis.find(ulElments).css('marginTop').replace('px',''));
			  var lastElmheight = jThis.find(ulElments).height();
			  document.getElementById(this.getId() + '-showmore').style.marginTop  = ( lastElmTop + lastElmheight     + 20) + 'px';
				document.getElementById(this.getId() + '-showmore').style.position = 'absolute';
			
				jThis.find('.sapSuiteUiCommonsTimelineGetMoreBar').hide();
		  }	 else {
		  	if (jThis.find('ul')[0].lastChild) {
						var lastElmTop = parseInt(jThis.find('li:nth-child(' + jThis.find('li').length +')').css('marginTop').replace('px',''));
						document.getElementById(this.getId() + '-showmore').style.top = (lastElmTop +  jThis.find('li:nth-child(' + jThis.find('li').length +')').height()       + 20) + 'px' ;
						document.getElementById(this.getId() + '-showmore').style.position = 'absolute';
						jThis.find('.sapSuiteUiCommonsTimelineGetMoreBar').hide();
				}

		  }
		}
	}
	
		var firstGroupLI = jThis.find('.sapSuiteUiCommonsTimelineItemGrp')[0];
		if (firstGroupLI != undefined) {
			firstGroupLI.style.marginTop  = 0 + 'px';
		}
	
	

};

//this function is to adjust timelineitem margins in dobule sided moded
sap.suite.ui.commons.Timeline.prototype._performHeightChanges = function () {
	var jThis = this.$();
	var oddMargins = 0;
	var evenMargins = 0;
	var liItems = jThis.find('li');
	for (var i = 0; i < liItems.length; i++) {


		var lineInd = i + 1;
		var liElem = jThis.find('li:nth-child(' + lineInd + ')');
		if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemEven') {
			var PrevliElem = jThis.find('li:nth-child(' + (lineInd - 2 ) + ')');
			if (PrevliElem.offset() !== undefined) {
				var PrevliElemTop = PrevliElem.offset().top;
				var PrevliElemHeight = PrevliElem.css('height');
				evenMargins = evenMargins + parseInt(PrevliElemHeight.replace("px", ""));
				liElem.css({
					'margin-left': 0 + 'px',
					'margin-top': evenMargins + 40
				});
			}
		} else if (liElem[0].className == 'sapSuiteUiCommonsTimelineItemOdd') {
			var PrevliElem = jThis.find('li:nth-child(' + (lineInd - 2 ) + ')');
			if (PrevliElem.offset() !== undefined) {
				var PrevliElemTop = PrevliElem.offset().top;
				var PrevliElemHeight = PrevliElem.css('height');
				oddMargins = oddMargins + parseInt(PrevliElemHeight.replace("px", ""));
				liElem.css({
					'margin-left': 0 + 'px',
					'margin-top': oddMargins
				});
			}
		} else {
			liElem.css({
				'margin-left': 0 + 'px',
				'margin-top': 0 + 'px'
			});

		}
	}


	//showmore button position.
	if (this._renderDblSided) {
		if (this._showMore) {
			if (jThis.find('ul')[0].lastChild) {
				var elemntTop = 0;
				var liItems = jThis.find('li');
				var ElemHeight = 0;
				for (var i = 0; i < liItems.length; i++) {
					var lineInd = i + 1;
					var liElem = jThis.find('li:nth-child(' + lineInd + ')');

					if (elemntTop < parseInt(liElem.css('margin-top').replace('px', '')) + parseInt(liElem.css('height').replace('px', ''))) {
						elemntTop = parseInt(liElem.css('margin-top').replace('px', '')) + parseInt(liElem.css('height').replace('px', ''));
					}
				}


				document.getElementById(this.getId() + '-showmore').style.top = (elemntTop + 20) + 'px';
				document.getElementById(this.getId() + '-showmore').style.position = 'absolute';
				jThis.find('.sapSuiteUiCommonsTimelineGetMoreBar').hide();
			}
		}
	}

};


//this function is added to handle timeline double sided respoviness
sap.suite.ui.commons.Timeline.prototype._performResizeChanges = function() {
  if (this.getGroup() && this.getGroupBy() != '') {
	  this._performUiChangesVGrp(); 
  } else {
	  this._performUiChangesV();
  }
	
};


sap.suite.ui.commons.Timeline.prototype._performScrollChangesGrp = function() {
	
	if (this.getAxisOrientation() === sap.suite.ui.commons.TimelineAxisOrientation.Vertical) {
	  var jThis = this.$();
	  var _outerHeight = jThis.parent().outerHeight();
	  var _innerHeight = jThis.parent().height(); // css height excluding buffer etc.
	  // get height of all the members elements other than timeline.
	  		var ulItems = jThis.find('ul');
		
	  		var ulElem = jThis.find( ulItems[ulItems.length-1]);
	  		var liItems = ulElem.find('li'); //find first ul
	  		
	  		
	  		var liElem = jThis.find(liItems[liItems.length-1]);
	  		
	  	  var ulHeight = liElem.offset().top;
		
	  	  
	  	  if (this._showMore) {
					var showMoreMargin = 	jThis.find('#' + this.getId() + '-showmore').css('margin-top');
				}		
				ulHeight = ulHeight + (ulItems.length * 32)  ;
				
				var myId = this.getId();
			  if (myId.indexOf("\.") != -1) { // there is a dot in the id.
			      myId = myId.replace( /(:|\.|\[|\])/g, "\\$1" ); // escape the ". and :" with "\\."
			  }
				
				 jThis.find("#" + myId + "-content").css({
           'height' : ulHeight + 40
				 });
				 
				 jThis.find("#" + myId + "-scroll").css({
           'height' : ulHeight
				 });
				 
				 jThis.css({
           'height' : ulHeight + 100
				 });
	  
	}
	
};

sap.suite.ui.commons.Timeline.prototype._performScrollChanges = function () {
	if (this.getAxisOrientation() === sap.suite.ui.commons.TimelineAxisOrientation.Vertical) {
		if (!this.getEnableScroll() && !this.getEnableDoubleSided()) {
			return;
		}
		// fix the height for scrolling.
		var jThis = this.$();
		var _outerHeight = jThis.parent().outerHeight();
		var _innerHeight = jThis.parent().height(); // css height excluding buffer etc.
		// get height of all the members elements other than timeline.
		var _elementsHeight = 0;
		var _elements = jThis.parent().children();
		for (var i = 0; i < _elements.length; i++) {
			var _elem = _elements[i];
			if (_elem.className != "sapSuiteUiCommonsTimeline") {
				_elementsHeight += _elem.clientHeight;
			}
		}
		var ElemHeight = 0;
		var liItems = jThis.find('li');
		var ElemHeight = 0;
		for (var i = 0; i < liItems.length; i++) {
			var lineInd = i + 1;
			var liElem = jThis.find('li:nth-child(' + lineInd + ')');
			ElemHeight = ElemHeight + liElem.height();
		}

		_outerHeight = _outerHeight - _elementsHeight;
		var _badSize = false;
		if (_innerHeight <= 50 || (_innerHeight - _elementsHeight) <= 50) { // at least 50px
			_badSize = true;
		}
		this._height = _outerHeight - 28;  // todo. when to really calculate?

		/*
		 * if (this._renderDblSided) { jThis.css({ 'height' : this._height }); }
		 */

		// escape dot as special char in the Fiori view IDs.
		var myId = this.getId();
		if (myId.indexOf("\.") != -1) { // there is a dot in the id.
			myId = myId.replace(/(:|\.|\[|\])/g, "\\$1"); // escape the ". and :" with "\\."
		}

		var _toolbarHeight = jThis.find("#" + myId + "-filterToolBar").outerHeight() + 28;
		var _infoBarHeight = jThis.find("#" + myId + "-filterInfoBar").outerHeight();
		if (_badSize) {
			this._scHeight = ElemHeight;
			jThis.find("#" + myId + "-content").css({
				'height': this._scHeight + 20
			});
			/*          if (this._showMore) {

			 jThis.css({
			 'height' : this._scHeight + 40
			 });
			 } else {
			 jThis.css({
			 'height' : this._scHeight + 20
			 });
			 }*/
			jThis.find("#" + myId + "-scroll").css({
				'height': this._scHeight
			});
		} else {
			this._scHeight = _outerHeight;// - (_toolbarHeight + _infoBarHeight);
			if (this.getEnableScroll()) {

				if (this._showMore) {

					if (jThis.find(document.getElementById(this.getId() + '-showmore')).css('top')) {

						if (parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('top').replace("px", "")) > 0) {
							jThis.find("#" + myId + "-content").css({
								'height': parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('top').replace("px", "")) // + 40
							});
							jThis.find("#" + myId + "-scroll").css({
								'height': parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('top').replace("px", ""))// +  _toolbarHeight + _infoBarHeight
							});
						}
					} else {

						jThis.find("#" + myId + "-content").css({
							'height': parseInt(jThis.find(liItems[liItems.length - 1]).offset().top) // + 20
						});
						jThis.find("#" + myId + "-scroll").css({
							'height': parseInt(jThis.find(liItems[liItems.length - 1]).offset().top) // + 20
						});
					}

				} else {

					if (!this._renderDblSided) {
						jThis.find("#" + myId + "-content").css({
							'height': ElemHeight // + 20
						});
						jThis.find("#" + myId + "-scroll").css({
							'height': ElemHeight // + 20
						});
					}
					else {

						var liElem = jThis.find(liItems[lineInd - 1]);
						if (liElem != undefined) {

							jThis.find("#" + myId + "-content").css({
								'height': parseInt(liElem.css('height').replace("px", "")) +
								parseInt(liElem.css("margin-top")) + 40
							});

							jThis.css({
								'height': jThis.find("#" + myId + "-content").height() + 20 + _toolbarHeight + _infoBarHeight
							});

						}


					}

				}


			} else {
				if (!this._renderDblSided) {

					jThis.find("#" + myId + "-content").css({
						'height': ElemHeight + 20
					});

					jThis.css({
						'height': ElemHeight + 40
					});

				} else {
					var oddMargins = 0;
					var evenMargins = 0;
					var liItems = jThis.find('li');
					var ElemHeight = 0;
					for (var i = 0; i < liItems.length; i++) {
						var lineInd = i + 1;
						var liElem = jThis.find('li:nth-child(' + lineInd + ')');
						ElemHeight = ElemHeight + liElem.height();
					}


					if (jThis.find(document.getElementById(this.getId() + '-showmore')).css('top')) {

						if (this.getGroup() && this.getGroupBy() != '') {
							jThis.find("#" + myId + "-content").css({
								'height': parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('height').replace("px", "")) +
								parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).offset().top)
							});
						} else {
							jThis.find("#" + myId + "-content").css({
								'height': parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('height').replace("px", "")) +
								parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('top').replace("px", ""))
							});

							jThis.css({
								'height': parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('height').replace("px", "")) +
								parseInt(jThis.find(document.getElementById(this.getId() + '-showmore')).css('top').replace("px", ""))
							});
						}

					} else {
						var liElem = jThis.find(liItems[lineInd - 1]);
						if (liElem != undefined) {

							jThis.find("#" + myId + "-content").css({
								'height': parseInt(liElem.css('height').replace("px", "")) +
								parseInt(liElem.css("margin-top")) + 40
							});

							jThis.css({
								'height': jThis.find("#" + myId + "-content").height() + 20 + _toolbarHeight + _infoBarHeight
							});

						}
					}
				}
			}
		}
	}
};

sap.suite.ui.commons.Timeline.prototype._performExpandCollapse = function(groupID,action,control)
{
	var jThis = this.$();
	var liItems = jThis.find('li[groupid="' + groupID + '"]');
	var showIcons = this.getShowIcons();
	for (var i = 0; i < liItems.length; i++) {     //loop through timeline items
			var lineInd = i + 1;
			var liElem = jThis.find(liItems[i]);     //get timelineitem
			if (groupID == liElem.attr('groupID') && liElem.attr('nodeType') == 'GroupItem') {
			
			
				if (liElem.is(':hidden')) {
					liElem.show();
				}	 else {
					liElem.hide();
					liElem.height(0);
				}
				
				if (i == liItems.length-1) {
					jThis.find(jThis.find(liElem).parent().next().children()[0]).css({
						'margin-top' : '0px'
					});
				}
			}
		}
	
	if (action == 'expand'){
		if (this.getGroup() && this.getGroupBy() != '') {
			this._performUiChangesVGrp(groupID);
		
		} else {
			this._performUiChangesV();
		}
	} else if (action == 'collapse') {
		
		if (this.getGroup() && this.getGroupBy() != '') {
			this._performUiChangesVGrp(groupID);
		
		}
	}
		

};

/*This function is used to get group li items in the timeline*/
sap.suite.ui.commons.Timeline.prototype._getGroupHeaderListItems = function(oItems) {
    return (oItems._textBox == 'GroupHeader');
};


sap.suite.ui.commons.Timeline.prototype.setOutput = function(oItems) {
	this._outputItem = [];
	var showIcons = this.getShowIcons();// if no icons property set... set _showIcons prop
	if (oItems.length > 1) {
	    if (this.getSort()) {
	    	oItems.sort(this.sortBy('dateTime', false));
		}
	}
	var displayItemCount = oItems.length;
	if (this._showMore && displayItemCount > this._growDisplayCount){
		displayItemCount = this._growDisplayCount; //this._iItemCount;
	}

	
	// make sure grouping field is a date, if not set the grouping to false
	if (this.getGroup() && this.getGroupBy() != '') {	//if grouping is enabled
	for (var i = 0; i < displayItemCount; i++) {  //loop through all timeline items
				var _item = oItems[i];
				var oDate = _item.getProperty('dateTime'); // get the timelineitem dateTime property
				if (typeof oDate != "string") { // check if this is a date or not
					oDate = oDate;
				} else {         // if it is not a date
					this.setGroup(false); //set the groupint to false
				}
		} // end loop items
	
		var sortGroupItems = [];
		console.log(oItems);
		var GrpFilterItems = oItems.filter(this._getGroupHeaderListItems);  // get group timeline item values  eg: 2016,2015,2014 etc
	
		for (var grp=0; grp< GrpFilterItems.length; grp++ ) { //loop through group items
			
			var group = GrpFilterItems[grp]; //get the group timelineitem
			var groupID = group.getUserName(); //get the year from timelineitem
			group._groupID = groupID; //set group timelineitem attributes
			group.setLayout(_position, "Right");
			var _position;
	
			if (!showIcons) {
					group._showIcons = false;
			}	else {
					group._showIcons = true;
			}
		
		this._outputItem.push(group); //add group timeline item to the outputItem array
		
		
				for (var i = 0; i < displayItemCount; i++) { //loop through all timelineitems
				
					var _item = oItems[i]; //get the items
				
					if (new Date(_item.getProperty('dateTime')).getFullYear() == groupID && _item._textBox != 'GroupHeader') { //check if it is not a group timelineitem
					
					var _position;
					if (!showIcons) {
						_item._showIcons = false;
					}else {
						_item._showIcons = true;
					}
					
					if (i == (oItems.length - 1)) {
						if (this._showMore) {
							_position = sap.suite.ui.commons.TimelineItemPosition.Middle;
						} else {
							_position = sap.suite.ui.commons.TimelineItemPosition.Bottom;
						}
					} else if (i == 0) {
						_position = sap.suite.ui.commons.TimelineItemPosition.Top;
					} else {
						_position = sap.suite.ui.commons.TimelineItemPosition.Middle;
					}
					
						_item._groupID = groupID;
					
					_item.setLayout(_position, "Right");
					this._outputItem.push(_item);
				 } //end grouptimeline item check
				} // end timelineitems loop
			} //end group timeline item loop
	
	} else {  // if grouping is not enabled
		
		for (var i = 0; i < displayItemCount; i++) {
		var _item = oItems[i];
		var _position;
		if (!showIcons) {
			_item._showIcons = false;
		}else {
			_item._showIcons = true;
		}
		if (i == (oItems.length - 1)) {
			if (this._showMore) {
				_position = sap.suite.ui.commons.TimelineItemPosition.Middle;
			} else {
				_position = sap.suite.ui.commons.TimelineItemPosition.Bottom;
			}
		} else if (i == 0) {
			_position = sap.suite.ui.commons.TimelineItemPosition.Top;
		} else {
			_position = sap.suite.ui.commons.TimelineItemPosition.Middle;
		}
		
		_item.setLayout(_position, "Right");
		this._outputItem.push(_item);
	}
	}
	
	

};


/* only get called when oData model... */
sap.suite.ui.commons.Timeline.prototype.refreshContent = function(sReason) {
	this._finishLoading = false;
	if (this.getEnableBusyIndicator()) {
		this.setBusy(true);
	}
	var oBindingInfo = this.getBindingInfo("content");
	var oBinding = this.getBinding("content");
	if (this.getGrowing() && (oBindingInfo) && (oBindingInfo.model !== sap.suite.ui.commons.Timeline.INTERNAL_MODEL_NAME) && (oBinding) && (oBinding.getModel())
			&& (oBinding.getModel().getDefaultCountMode() !== sap.ui.model.odata.CountMode.None)) {
		this._growing = true;
		this._iItemCount = this.getGrowingThreshold();
		this._growDisplayCount = this.getGrowingThreshold();
		oBinding.getContexts(0, this._iItemCount);
		oBindingInfo.length = this._iItemCount;
	} else {
		this.updateAggregation("content");
	}
	this._filterText = this.resBundle.getText("TIMELINE_ALL");
};

sap.suite.ui.commons.Timeline.prototype.updateContent = function(sReason) {
	if (this.getEnableBusyIndicator() && this.getBusy()) {
		this.setBusy(false);
	}
	var oBinding = this.getBinding("content");
	if (this._growing) {
		oBinding.getContexts(0, this._iItemCount);
	}
	this.updateAggregation("content");
	this._finishLoading = true;
	this._contentChange = true;
	if (!this.getEnableBackendFilter()) {
	  this._resetFilter();
	}
};



sap.suite.ui.commons.Timeline.prototype.updateFilterList = function() { // July/22/2014
	this.updateAggregation("filterList");
	this._setFilterList();
};


sap.suite.ui.commons.Timeline.prototype.refreshSuggestionItems = function(sReason) {
	this._suggestList.setBusy(true);
	this.updateAggregation("suggestionItems");  //this will call the update method
};

sap.suite.ui.commons.Timeline.prototype.updateSuggestionItems = function() {
	this.updateAggregation("suggestionItems");
	this._setSuggestionList(); 
	this._suggestList.setBusy(false);

	
};

sap.suite.ui.commons.Timeline.prototype.setSuspendSocialFeature = function(bSuspense){
	this._suspenseSocial = bSuspense;
	if (!this.getEnableSocial()) {
		// do nothing
		return;
	}
	if (bSuspense){
	//	this._addIcon.setEnabled(false);   /* change requested by social component
		var oItems = this.getContent();
		for (var i = 0; i < oItems.length; i++) {
			oItems[i]._replyLink.setEnabled(false);
		};
	} else {
	//	this._addIcon.setEnabled(true);   /* change requested by social component
		var oItems = this.getContent();
		for (var i = 0; i < oItems.length; i++) {
			oItems[i]._replyLink.setEnabled(true);
		};
	}
	this.invalidate();
};

sap.suite.ui.commons.Timeline.prototype.getSuspendSocialFeature = function(){
	return this._suspenseSocial;
};

sap.suite.ui.commons.Timeline.prototype.setCustomFilter = function(oFilter){
	if (oFilter){
		this._customFilter = true;
		this.setAggregation("customFilter", oFilter, true);

	} else {
		this._customFilter = false;
	}
};


sap.suite.ui.commons.Timeline.prototype.setCustomMessage = function(msg){
	this._filterInfoText.setText(msg);
	if (msg && msg.length > 0) {
		this._headerInfoBar.setVisible(true);
	} else {
		this._headerInfoBar.setVisible(false);
	}
	this.invalidate();   //otherwise, it doesn't re-render
};

sap.suite.ui.commons.Timeline.prototype.getHeaderBar = function() {
	return this._headerBar;
};

sap.suite.ui.commons.Timeline.prototype.getMessageStrip = function() {
	return this._messageStrip;
};

sap.suite.ui.commons.Timeline.prototype.exit = function() {
	if (this._emptyList) {
		this._emptyList.destroy();
		this._emptyList = undefined;
	}
	if (this._filterIcon) {
		this._filterIcon.destroy();
		this._filterIcon = undefined;
	}
	if (this._filterDialog) {
		this._filterDialog.destroy();
		this._filterDialog = undefined;
	}
	if (this._filterList) {
		this._filterList.destroy();
		this._filterList = undefined;
	}
	if (this._headerBar) {
		this._headerBar.destroy();
		this._headerBar = undefined;
	}
	if (this._filterInfoText) {
		this._filterInfoText.destroy();
		this._filterInfoText = undefined;
	}
	/*
	if (this._addIcon) {
		this._addIcon.destroy();
		this._addIcon = undefined;
	}
	*/
	if (this._addInput) {
		this._addInput.destroy();
		this._addInput = undefined;
	}	
	if (this._addDialog) {
		this._addDialog.destroy();
		this._addDialog = undefined;
	}	
	if (this._headerInfoBar) {
		this._headerInfoBar.destroy();
		this._headerInfoBar = undefined;
	}
	if (this._getMoreButton) {
		this._getMoreButton.destroy();
		this._getMoreButton = undefined;
	}
//	if (this._oScroller) {
//		this._oScroller.destroy();
//		this._oScroller = null;
//	}
	if (this.oItemNavigation) {
		this.removeDelegate(this.oItemNavigation);
		this.oItemNavigation.destroy();
	}
	if (this._suggestList) {
		this._suggestList.destroy();
		this._suggestList = undefined;
	}
	if (this._suggestionPopup) {
		this._suggestionPopup.destroy();
		this._suggestionPopup = undefined;
	}
	if(this._messageStrip){
		this._messageStrip.destroy();
		this._messageStrip = undefined;  
	}
	if(this._searchField){
		this._searchField.destroy();
		this._searchField = undefined;  
	}
	
	if (jQuery.device.is.desktop && this.sResizeListenerId) {
		sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
		this.sResizeListenerId = null;
	} else {
		sap.ui.Device.orientation.detachHandler(this._performScrollChanges, this);
		sap.ui.Device.resize.detachHandler(this._performScrollChanges, this);
	}
};

sap.suite.ui.commons.Timeline.prototype.setNoDataText = function(noDataText) {
	if ((noDataText !== null) && (noDataText !== undefined) && (noDataText !== "")) {
		this.setProperty("noDataText", noDataText, true);
		this._emptyList.setNoDataText(noDataText);
	} else {
		this._emptyList.setNoDataText(this.resBundle.getText('TIMELINE_NO_DATA'));
	}
};

sap.suite.ui.commons.Timeline.prototype.setShowHeaderBar = function(oShowHeaderBar) {
	this.setProperty("showHeaderBar", oShowHeaderBar, true);
	this._headerBar.setVisible(oShowHeaderBar);
};

sap.suite.ui.commons.Timeline.prototype.getMaxItemsCount = function() {
	

	var oBinding = this.getBinding("content");
	var len = this.getContent().length;
	if (oBinding) {  // todo: checking binding info?
		if (len < oBinding.getLength()){ //MaxItemCount might change if user use addContent method directly....
			return oBinding.getLength() || 0;
		}
	}
	return len;
};

sap.suite.ui.commons.Timeline.prototype.setGrowing = function(bGrowing) {
	if (this.getGrowing() != bGrowing) {
		this.setProperty("growing", bGrowing, !bGrowing);
	}
};



sap.suite.ui.commons.Timeline.prototype.setGrowingThreshold = function(growingThreshold) {
	this.setProperty("growingThreshold", growingThreshold, true);
	this._iItemCount = growingThreshold;
	this._growDisplayCount = growingThreshold;
};

sap.suite.ui.commons.Timeline.prototype.getCurrentFilter = function() {
  var selectedItem = this._filterList.getSelectedItem();
  if (selectedItem) {
  	return this._filterList.getSelectedItem().getKey();
	} else {
	  return null;
	}
};

sap.suite.ui.commons.Timeline.prototype.setCurrentFilter = function(selectedItemKey) {
	this._currentFilterKey = selectedItemKey;
	var items = this._filterList.getItems();
	if (this.getEnableBackendFilter() && (items.length === 0)) {
		this._setFilterList();
	} else {
		var selectedItem;
		for (var i = 0; i < items.length; i++) {
			if (selectedItemKey === items[i].getKey()) {
				selectedItem = items[i];
			};
		};
		if (selectedItem) {
			this._filterList.setSelectedItem(selectedItem);
			this._setFilterInfoText(selectedItem.getLabel());
			// this.fireFilterSelectionChange({selectedItem : selectedItem});
		}
		// this._currentFilterKey = selectedItemKey;
	}
};

sap.suite.ui.commons.Timeline.prototype.onclick = function(oEvent) {
	if (jQuery(oEvent.target).parents('.sapSuiteUiCommonsTimelineItemShell').length === 1) {
	  var selectedItemId;
	  if (this.getAxisOrientation() === sap.suite.ui.commons.TimelineAxisOrientation.Vertical){
		  selectedItemId = jQuery(oEvent.target).parents('.sapSuiteUiCommonsTimelineItem').attr('id');
	  }else {
		  selectedItemId = jQuery(oEvent.target).parents('.sapSuiteUiCommonsTimelineItemLiWrapperV').attr('id');
	  }
	  var selectedItem = sap.ui.core.Core().byId(selectedItemId);
		this.fireSelect({selectedItem : selectedItem});
	}
};