sap.ui.define(["jquery.sap.global", "sap/ui/base/Object", "sap/m/MessagePopover", "sap/m/MessagePopoverItem", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/suite/ui/generic/template/lib/testableHelper"
], function(jQuery, BaseObject, MessagePopover, MessagePopoverItem, Filter, FilterOperator, testableHelper) {
	"use strict";
	
	Filter = testableHelper.observableConstructor(Filter, true);                        
	
	var oPersistentFilter = new Filter({
								path: "persistent",
								operator: FilterOperator.EQ,
								value1: false
							}); // exclude all messages that are persistent for frontend (i.e. transient for backend)
	var oValidationFilter = new Filter({
								path: "validation",
								operator: FilterOperator.EQ,
								value1: true
							}); // include all validation messages (i.e. frontend-messages)

	function getMethods(oCommonUtils, oController) {

		var oMessageButton = oController.byId("showMessages");
		var oMessagePopover = oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.MessagePopover");
		// Add message model as an own model with name msg
		oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "msg");
		var oItemBinding;
		var oEntityFilter; // fixed filter for the entity set of the component this instance belongs to. Will be ORed with a filter for the current binding path, oValidationFilter, and external filters
		(function(){
		    var oComponent = oController.getOwnerComponent();
		    oEntityFilter = new Filter({
				path: "target",
				operator: FilterOperator.EQ,
				value1: "/" + oComponent.getEntitySet()
			});		    
		    // Add message model as an own model with name msg
		    oItemBinding = oMessagePopover.getBinding("items");
			var oTemplatePrivate = oComponent.getModel("_templPriv");
			oTemplatePrivate.setProperty("/generic/messageCount", 0);
			var sMessageButtonTooltip = oCommonUtils.getText("MESSAGE_BUTTON_TOOLTIP_P", 0);
			oTemplatePrivate.setProperty("/generic/messageButtonTooltip", sMessageButtonTooltip);
			oItemBinding.attachChange(function() {
				var iCount = oItemBinding.getLength();
				oTemplatePrivate.setProperty("/generic/messageCount", iCount);
				sMessageButtonTooltip = oCommonUtils.getText(iCount === 1 ? "MESSAGE_BUTTON_TOOLTIP_S" : "MESSAGE_BUTTON_TOOLTIP_P", iCount);
				oTemplatePrivate.setProperty("/generic/messageButtonTooltip", sMessageButtonTooltip);
			});
		})();

		var aFilterProvider = []; //Callback functions registered by reuse components (or break-outs) that want to add their message filters
		var sCurrentBindingPath; // the binding path currently valid for the page this instance is responsible for
		var iCurrentCallCount = 0; // a counter which is increased each time sCurrentBinding path is changed
		var fnNewFilter; // function fnResolved (see below) with first parameter bound to iCurrentCallCount. Registered at Promises provided by external filter providers.
		var aCurrentFilters; // a list of filters currently set. They are combined by OR. The resulting filter will afterwards be ANDed with oPersistentFilter.
							// The result of this is used to filter the messages.

		// Adds one (external) filter or an array of (external) filters to aCurrentFilters
		// Returns whether filters have been changed
		function addAnExternalFilter(aExternalFilter){
			if (jQuery.isArray(aExternalFilter)) {
				if (aExternalFilter.length === 0){
					return false;
				}
				aCurrentFilters = aCurrentFilters.concat(aExternalFilter);
			} else {
				aCurrentFilters.push(aExternalFilter);
			}
			return true;
		}
		
		// Adapts the binding for the messages according to the current state of aCurrentFilters
		function fnAdaptBinding(){
			var oContextFilter = new Filter(aCurrentFilters, false /* filter conjunction OR instead of AND */ );
			var aFilters = [oContextFilter, oPersistentFilter];
			oItemBinding.filter(aFilters);
		}
		
		// This method is called when a Promise that has been provided by a filter provider is resolved.
		// iCallCount is the value of iCurrentCallCount that was valid when the Promise was prvided by the filter provider.
		// Note that the function does nothing when the iCurrentCallCount meanwhile has a different value (i.e. sCurrentBindingPath has meanwhile changed)
		// aExternalFilter is either a filter or an array of filters that should be added to the list of current filters.
		function fnResolved(iCallCount, aExternalFilter){
			if (iCallCount === iCurrentCallCount && addAnExternalFilter(aExternalFilter)){
				fnAdaptBinding(); // adapt the binding after the set of filters has been adapted
			}
		}
		
		// fnProvider is a filter provider which has been registered via registerMessageFilterProvider.
		// At each time registerMessageFilterProvider must be able to provide either
		// - a filter or
		// - an array of filters or
		// - or a Promise that resolves to a filter or an array of filters
		// This function calls fnProvider and ensures that the filter(s) provided by this call are added to aCurrentFilters.
		// In case the filters are provided asynchronously, it is also ensured that the changed filters will be applied afterwards.
		// Returns whether the filters have been changed (synchronously) 
		function addFilterFromProviderToCurrentFilter(fnProvider){
			var aExternalFilter = fnProvider();
			if (aExternalFilter instanceof Promise){
				aExternalFilter.then(fnNewFilter);
				return false;
			}
			return addAnExternalFilter(aExternalFilter);	
		}
		
		// Ensure that addFilterFromProviderToCurrentFilter is called for all registered filter providers
		function addExternalFiltersToCurrentFilter() {
			aFilterProvider.forEach(addFilterFromProviderToCurrentFilter);
		}

		// adapt the filters to a new binding path
		function adaptToContext(sBindingPath) {
			sCurrentBindingPath = sBindingPath;
			iCurrentCallCount++;
			fnNewFilter = fnResolved.bind(null, iCurrentCallCount);

			// Show messages for current context including all "property children" AND for
			// messages given for the entire entity set
			aCurrentFilters = [
				new Filter({
					path: "target",
					operator: FilterOperator.StartsWith,
					value1: sCurrentBindingPath
				}),
				oEntityFilter,
				oValidationFilter
			];
			addExternalFiltersToCurrentFilter(); //Check/add external filters
			fnAdaptBinding();
		}

		// register a new filter provider. In case a binding path alrerady has been set, the new provider is called immediately
		function registerMessageFilterProvider(fnProvider) {
			aFilterProvider.push(fnProvider);
			if (sCurrentBindingPath !== undefined && addFilterFromProviderToCurrentFilter(fnProvider)){
				fnAdaptBinding();
			}
		}
		
		var fnShowMessagePopoverImpl;
		function fnShowMessagePopover(){
			fnShowMessagePopoverImpl = fnShowMessagePopoverImpl || oMessagePopover.openBy.bind(oMessagePopover, oMessageButton);
			// workaround to ensure that oMessageButton is rendered when openBy is called
			setTimeout(fnShowMessagePopoverImpl, 0);
		}

		return {
			adaptToContext: adaptToContext,
			toggleMessagePopover: oMessagePopover.toggle.bind(oMessagePopover, oMessageButton),
			showMessagePopover: fnShowMessagePopover,
			registerMessageFilterProvider: registerMessageFilterProvider
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.MessageButtonHelper", {
		constructor: function(oCommonUtils, oController) {
			jQuery.extend(this, (testableHelper.testableStatic(getMethods, "MessageButtonHelper"))(oCommonUtils, oController));
		}
	});
});