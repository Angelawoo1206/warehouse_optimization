(function() {
	"use strict";
	jQuery.sap.require("sap.ui.comp.smartfield.SmartField");
	jQuery.sap.require("sap.suite.ui.generic.template.extensionAPI.UIMode");
	jQuery.sap.require("sap/ui/model/Context");
	sap.ui.require("sap/suite/ui/generic/template/extensionAPI/UIMode");
	jQuery.sap.declare("sap.suite.ui.generic.template.AnalyticalListPage.util.AnnotationHelper");
	sap.suite.ui.generic.template.AnalyticalListPage.util.AnnotationHelper = {
		getDetailEntitySet: function(oContext) {
			var o = oContext.getObject();
			var oModel = oContext.getModel();
			var oMetaModel = oModel.getProperty("/metaModel");
			return oMetaModel.createBindingContext(oMetaModel.getODataEntitySet(o, true));
		},
		// resolvePresentationVariant: function(oContext) {
		// 	var oParameter = oContext.getObject();
		// 	var oModel = oContext.getModel();
		// 	var oMetaModel = oModel.getProperty("/metaModel");
		// 	var oEntitySet = oMetaModel.getODataEntitySet(oParameter.entitySet);
		// 	var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
		// 	var sAnnotationPath = oEntityType.$path + "/com.sap.vocabularies.UI.v1.PresentationVariant"
		// 		+ (oParameter.settings && oParameter.settings.presentationVariantQualifier ? "#" + oParameter.settings.presentationVariantQualifier : "");
		// 	return oMetaModel.createBindingContext(sAnnotationPath);
		// },
		resolveMetaModelPath: function(oContext) {
			var sPath = oContext.getObject();
			var oModel = oContext.getModel();
			var oMetaModel = oModel.getProperty("/metaModel");
			return oMetaModel.createBindingContext(sPath);
		},
		/* The context definition for the ALP:
			1.	Check if there is a PresentationVariant (PV) qualifier in the parameter model
				yes) Choose the PV
				no) Check if there is a default PV and choose if it exists
			2. Was a PV found in 1.
				yes) Follow the Visualizations to LineItem and Chart or use default if not found
				no) use LineItem and Chart default annotations
		*/
		createWorkingContext: function(oContext) {
			var oParameter = oContext.getObject(),
				oSettings = oParameter.settings,
				oModel = oContext.getModel(),
				oMetaModel = oModel.getProperty("/metaModel"),
				oEntitySet = oMetaModel.getODataEntitySet(oParameter.entitySet),
				oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType),
				sAnnotationPath = "",
				oWorkingContext = {};
			/* Find SelectionPresentationVariant */
			sAnnotationPath = oEntityType.$path + "/com.sap.vocabularies.UI.v1.PresentationVariant" + (oSettings && oSettings.qualifier ? "#" + oSettings.qualifier : "");
			oWorkingContext.presentationVariant = oMetaModel.getObject(sAnnotationPath);
			oWorkingContext.presentationVariantPath = sAnnotationPath;
			oWorkingContext.presentationVariantQualifier = sAnnotationPath.split("#")[1] || "";
			// If a qualifier was specified but no presentation variant exists for that qualifier or indirectly
			// through the SelectionPresentationVaraiant with qualifier it is a wrong qualifier
			if (oSettings.qualifier && !oWorkingContext.presentationVariant) {
				var e = new Error("Error in manifest.json: No PresentationVariant found for qualifier: "
						+ oSettings.qualifier, "./manifest.json");
				throw e;
			}
			/* Determine LineItem and Chart via PV */
			if (oWorkingContext.presentationVariant && oWorkingContext.presentationVariant.Visualizations) {
				oWorkingContext.presentationVariant.Visualizations.forEach(function(visualization) {
					/* get rid of the @ and put a / in front */
					var sPath = "/" + visualization.AnnotationPath.slice(1);
					if (sPath.indexOf("com.sap.vocabularies.UI.v1.LineItem") > -1) {
						sAnnotationPath = oEntityType.$path + sPath;
						oWorkingContext.lineItem = oMetaModel.getObject(sAnnotationPath);
						oWorkingContext.lineItemPath = sAnnotationPath;
						oWorkingContext.lineItemQualifier = sAnnotationPath.split("#")[1] || "";
					}
					if (sPath.indexOf("com.sap.vocabularies.UI.v1.Chart") > -1) {
						sAnnotationPath = oEntityType.$path + sPath;
						oWorkingContext.chart = oMetaModel.getObject(sAnnotationPath);
						oWorkingContext.chartPath = sAnnotationPath;
						oWorkingContext.chartQualifier = sAnnotationPath.split("#")[1] || "";
					}
				});
			}
			/* Fall back to defaults without qualifier */
			if (!oWorkingContext.lineItem) {
				sAnnotationPath = oEntityType.$path + "/com.sap.vocabularies.UI.v1.LineItem";
				oWorkingContext.lineItem = oMetaModel.getObject(sAnnotationPath);
				oWorkingContext.lineItemPath = sAnnotationPath;
				oWorkingContext.lineItemQualifier = "";
			}
			if (!oWorkingContext.chart) {
				sAnnotationPath = oEntityType.$path + "/com.sap.vocabularies.UI.v1.Chart";
				oWorkingContext.chart = oMetaModel.getObject(sAnnotationPath);
				oWorkingContext.chartPath = sAnnotationPath;
				oWorkingContext.chartQualifier = "";
			}

			oModel.setProperty("/workingContext", oWorkingContext);
			return "/workingContext";
		},
		/**
		 * [hasDeterminingActionsForALP To check if determiningActions are defined in manifest or annotations]
		 * @param  {[String]}  aTableTerm   [Records of table actions from annotations]
		 * @param  {[String]}  aChartTerm   [Records of chart actions from annotations]
		 * @param  {[String]}  sEntitySet   [Entity set Records]
		 * @param  {Object}  oManifestExt [Extensions from manifest]
		 * @return {Boolean}              [Returns status of determining actions to the xml]
		 */
		hasDeterminingActionsForALP: function(aTableTerm, aChartTerm, sEntitySet, oManifestExt) {
			if (sEntitySet && oManifestExt && oManifestExt["sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage"] &&
				sap.suite.ui.generic.template.js.AnnotationHelper._hasCustomDeterminingActionsInListReport(sEntitySet, oManifestExt["sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage"]["sap.ui.generic.app"])) { //Check for AnalyticalListPage
				return true;
			}
			//To bring determining buttons of table from annotations
			for (var iRecord = 0; iRecord < aTableTerm.length; iRecord++) {
				if ((aTableTerm[iRecord].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || aTableTerm[iRecord].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") &&
					aTableTerm[iRecord].Determining && aTableTerm[iRecord].Determining.Bool === "true") {
					return true;
				}
			}
			//To bring determining buttons of chart from annotations
			for (var iRecord = 0; iRecord < aChartTerm.length; iRecord++) {
				if ((aChartTerm[iRecord].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || aChartTerm[iRecord].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") &&
					aChartTerm[iRecord].Determining && aChartTerm[iRecord].Determining.Bool === "true") {
					return true;
				}
			}
			return false;
		}
	};

	sap.suite.ui.generic.template.AnalyticalListPage.util.AnnotationHelper.getDetailEntitySet.requiresIContext = true;
})();
