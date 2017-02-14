jQuery.sap.registerPreloadedModules({
"name":"sap/ushell/plugins/rta/Component-preload",
"version":"2.0",
"modules":{
	"sap/ushell/plugins/rta/Component.js":function(){sap.ui.define(["sap/ui/core/Component", 
	"sap/ui/model/resource/ResourceModel", 
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"], function(
		Component,
		ResourceModel,
		MessageBox,
		BusyIndicator ) {

	"use strict";

	/*global jQuery, sap, localStorage, window */

	var sComponentName = "sap.ushell.plugins.rta";

	var RTAPlugin = sap.ui.core.Component.extend("sap.ushell.plugins.rta.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererCreated' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		},

		init: function () {
			var that = this;
			this.i18n = this.getModel("i18n").getResourceBundle();
			this._getRenderer().fail(function (sErrorMessage) {
				jQuery.sap.log.error(sErrorMessage, undefined, sComponentName);
			})
			.done(function (oRenderer) {

				var oAppLifeCycleService = sap.ushell.Container.getService("AppLifeCycle");
				
				/**
				 * Check if we are in a SAPUI5 application not on the Shell 
				 * and then check for RTA restart
				 */
				oAppLifeCycleService.attachAppLoaded(function (oEvent) {
					
					var bUI5App = that._checkUI5App();
					
					if (bUI5App && !oEvent.mParameters.homePage) {
						that._checkRestartRTA();
					}
				});

				/**
				 * Event handler for the "Adapt" button of the RTA FLP Plugin
				 * Checks the supported browsers and starts the RTA
				 * @param  {sap.ui.base.Event} oEvent the button click event
				 * @private
				 */
				var _fOnAdapt = function(oEvent) {
					var bSupportedBrowser = ((sap.ui.Device.browser.msie && sap.ui.Device.browser.version > 10) || sap.ui.Device.browser.webkit || sap.ui.Device.browser.firefox);
					
					if (!bSupportedBrowser) {
						MessageBox.error(that.i18n.getText("MSG_UNSUPPORTED_BROWSER"), {
							title: that.i18n.getText("ERROR_TITLE"),
							onClose: null
						});
					} else {
						window.setTimeout(function() {
							that._switchToAdaptionMode();
						},0);
					}
				};
				//Button will only be added once even when more instances of this component are created
				oRenderer.addActionButton("sap.ushell.ui.launchpad.ActionItem", {
					id: "RTA_Plugin_ActionButton",
					text: that.i18n.getText("RTA_BUTTON_TEXT"),
					icon: "sap-icon://wrench",
					press: _fOnAdapt
				}, true, false, [oRenderer.LaunchpadState.App]);
			});
		},

		exit: function () {
			if (this._oShellContainer && this._onRendererCreated) {
				this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
			}
		},

		/**
		 * Check if we are in a SAPUI5 application
		 * @private
		 * @returns {Boolean} if we are in a SAPUI5 application
		 */
		_checkUI5App: function() {
			var oCurrentApplication = this._getCurrentRunningApplication();
			var bUI5App = oCurrentApplication && oCurrentApplication.applicationType === "UI5";
			return bUI5App;
		},
		
		/**
		 * Checks if RTA needs to be restarted, e.g after 'Reset to default'
		 * @private
		 */
		_checkRestartRTA: function() {
			var bRestart = !!window.localStorage.getItem("sap.ui.rta.restart");
			
			if (bRestart) {
				window.localStorage.removeItem("sap.ui.rta.restart");
				this._switchToAdaptionMode();
			}
		},

		/**
		 * Gets the current root application
		 * @private
		 */
		_getCurrentRunningApplication: function() {
			var oAppLifeCycleService = sap.ushell.Container.getService("AppLifeCycle");
			var oApp = oAppLifeCycleService.getCurrentApplication();

			return oApp;
		},

		/**
		 * Leaves the RTA adaption mode and destroys the RTA
		 * @private
		 */
		_switchToDefaultMode: function() {
			if (this._oRTA) {
				this._oRTA.destroy();
				this._oRTA = null;
			}
		},

		/**
		 * Turns on the adaption mode of the RTA FLP plugin
		 * @private
		 */
		_switchToAdaptionMode: function() {
			var that = this;
			var bUI5App = this._checkUI5App();
			
			if (!bUI5App) {
				MessageBox.error(this.i18n.getText("MSG_UNSUPPORTED_APP"), {
					title: this.i18n.getText("ERROR_TITLE"),
					onClose: null
				});
				return;
			}
			var oCurrentRunningApp = this._getCurrentRunningApplication();
			var oRootControl = oCurrentRunningApp.componentInstance.getAggregation("rootControl");
			
			// Start Runtime Authoring
			if (!this._oRTA) {
				BusyIndicator.show(0);
				//load it on demand
				sap.ui.getCore().loadLibraries(["sap.ui.dt","sap.ui.rta"], {async: true}).then(function(){
					sap.ui.require(["sap/ui/rta/RuntimeAuthoring"], function(RuntimeAuthoring) {
						try {
							that._oRTA = new RuntimeAuthoring({
								rootControl: oRootControl
							});
	
							that._oRTA.attachEvent('start', function() {
								BusyIndicator.hide();
							}, that);
	
							that._oRTA.attachEvent('failed', function() {
								BusyIndicator.hide();
								that._switchToDefaultMode();
								MessageBox.error(this.i18n.getText("MSG_ADAPTUI_FAILED"), {
									title: this.i18n.getText("ERROR_TITLE"),
									onClose: null
								});
							}, that);
	
							that._oRTA.start();
	
							that._oRTA.attachEvent('stop', that._switchToDefaultMode, that);
						} catch (oError) {
							BusyIndicator.hide();
							jQuery.sap.log.error("exception occured while starting sap.ui.rta", oError);
							that._switchToDefaultMode();
							MessageBox.error(that.i18n.getText("MSG_ADAPTUI_FAILED"), {
								title: that.i18n.getText("ERROR_TITLE"),
								onClose: null
							});
						}
					});
				});
			}
		}
	});
	return RTAPlugin;

}, /* bExport= */true);
},
	"sap/ushell/plugins/rta/i18n/i18n.properties":'# Resource bundle for runtime authoring ushell plug-in\r\n# __ldi.translation.uuid=0fd1c390-0b51-11e5-b939-0800200c9a66\r\n\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Adapt UI\r\n#XTIT\r\nERROR_TITLE=Error\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP Plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=You are using an unsupported browser; use Chrome or Internet Explorer > 10\r\n#XMSG: Error Message when Adapt UI could not be started\r\nMSG_ADAPTUI_FAILED=Failed to start Adapt UI\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Unsupported Browser\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_ar.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u062A\\u0647\\u064A\\u0626\\u0629 \\u0648\\u0627\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645\r\n#XTIT\r\nERROR_TITLE=\\u062E\\u0637\\u0623\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=\\u0628\\u0631\\u0646\\u0627\\u0645\\u062C RTA FLP \\u0625\\u0636\\u0627\\u0641\\u064A\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u0623\\u0646\\u062A \\u062A\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0645\\u0633\\u062A\\u0639\\u0631\\u0636\\u064B\\u0627 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645\\u061B \\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 Chrome \\u0623\\u0648 Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u0645\\u0633\\u062A\\u0639\\u0631\\u0636 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u062A\\u0647\\u064A\\u0626\\u0629 \\u0648\\u0627\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0645\\u062F\\u0639\\u0648\\u0645\\u0629 \\u0641\\u0642\\u0637 \\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_bg.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u0410\\u0434\\u0430\\u043F\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u0438 \\u0438\\u043D\\u0442\\u0435\\u0440\\u0444\\u0435\\u0439\\u0441\r\n#XTIT\r\nERROR_TITLE=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP Plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u0418\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0442\\u0435 \\u043D\\u0435\\u043F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D \\u0431\\u0440\\u0430\\u0443\\u0437\\u044A\\u0440; \\u0438\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 Chrome \\u0438\\u043B\\u0438 Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u041D\\u0435\\u043F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D \\u0431\\u0440\\u0430\\u0443\\u0437\\u044A\\u0440\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u0410\\u0434\\u0430\\u043F\\u0442\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 UI \\u0441\\u0435 \\u043F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430 \\u0441\\u0430\\u043C\\u043E \\u0437\\u0430 SAPUI5 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_ca.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Ajustar IU\r\n#XTIT\r\nERROR_TITLE=Error\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Connector FLP RTA\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=No s\'admet el vostre navegador; utilitzeu Chrome o Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=No s\'admet el navegador\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=L\'ajustament d\'IU nom\\u00E9s se suporta per a aplicacions SAPUI5\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_cs.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Upravit UI\r\n#XTIT\r\nERROR_TITLE=Chyba\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA-FLP-Plug-In\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=V\\u00E1\\u0161 prohl\\u00ED\\u017Ee\\u010D nen\\u00ED podporov\\u00E1n; pou\\u017Eijte Chrome nebo Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Prohl\\u00ED\\u017Ee\\u010D nen\\u00ED podporov\\u00E1n\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u00DAprava UI je podporov\\u00E1na jen u aplikac\\u00ED SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_da.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Tilpas UI\r\n#XTIT\r\nERROR_TITLE=Fejl\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA-FLP-plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Din browser underst\\u00F8ttes ikke; anvend Chrome eller Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Browser underst\\u00F8ttes ikke\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI-tilpasning underst\\u00F8ttes kun for SAPUI5-applikationer\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_de.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=UI anpassen\r\n#XTIT\r\nERROR_TITLE=Fehler\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA-FLP-Plug-In\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Ihr Browser wird nicht unterst\\u00FCtzt; verwenden Sie Chrome oder Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Browser wird nicht unterst\\u00FCtzt\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI-Anpassung wird nur f\\u00FCr SAPUI5-Anwendungen unterst\\u00FCtzt.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_el.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE UI\r\n#XTIT\r\nERROR_TITLE=\\u03A3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP Plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u03A4\\u03BF \\u03C0\\u03C1\\u03CC\\u03B3\\u03C1\\u03B1\\u03BC\\u03BC\\u03B1 \\u03C0\\u03B5\\u03C1\\u03B9\\u03AE\\u03B3\\u03B7\\u03C3\\u03B7\\u03C2 \\u03C0\\u03BF\\u03C5 \\u03C7\\u03C1\\u03B7\\u03C3\\u03B9\\u03BC\\u03BF\\u03C0\\u03BF\\u03B9\\u03B5\\u03AF\\u03C4\\u03B5 \\u03B4\\u03B5\\u03BD \\u03C5\\u03C0\\u03BF\\u03C3\\u03C4\\u03B7\\u03C1\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9, \\u03C7\\u03C1\\u03B7\\u03C3\\u03B9\\u03BC\\u03BF\\u03C0\\u03BF\\u03B9\\u03AE\\u03C3\\u03C4\\u03B5 Chrome \\u03AE Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u039C\\u03B7 \\u03A5\\u03C0\\u03BF\\u03C3\\u03C4\\u03B7\\u03C1\\u03B9\\u03B6\\u03CC\\u03BC\\u03B5\\u03BD\\u03BF \\u03A0\\u03C1\\u03CC\\u03B3\\u03C1/\\u03BC\\u03B1 \\u03A0\\u03B5\\u03C1\\u03B9\\u03AE\\u03B3\\u03B7\\u03C3\\u03B7\\u03C2\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE \\u03C4\\u03BF\\u03C5 UI \\u03C5\\u03C0\\u03BF\\u03C3\\u03C4\\u03B7\\u03C1\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9 \\u03BC\\u03CC\\u03BD\\u03BF \\u03B3\\u03B9\\u03B1 \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AD\\u03C2 SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_en.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Adapt UI\r\n#XTIT\r\nERROR_TITLE=Error\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP Plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=You are using an unsupported browser; use Chrome or Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Unsupported Browser\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Adaptation of UI is only supported for SAPUI5 applications.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_es.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Ajustar IU\r\n#XTIT\r\nERROR_TITLE=Error\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Plug-in FLP RTA\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=No se admite su navegador; utilice Chrome o Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=No se admite el navegador\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=El ajuste de la IU solo se admite para las aplicaciones SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_et.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Kohanda UI\r\n#XTIT\r\nERROR_TITLE=T\\u00F5rge\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP lisandmoodul\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Kasutate toetuseta brauserit. Kasutage Chrome\'i v\\u00F5i Internet Explorerit > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Toetuseta brauser\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI kohandamist toetatakse ainult SAPUI5 rakenduste puhul.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_fi.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Mukauta UI\r\n#XTIT\r\nERROR_TITLE=Virhe\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP-plug-in\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Selaintasi ei tueta, k\\u00E4yt\\u00E4 Chromea tai Internet Exploreria > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Selaintasi ei tueta\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI-mukautusta tuetaan vain SAPUI5-sovelluksille.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_fr.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Adapter IU\r\n#XTIT\r\nERROR_TITLE=Erreur\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Plug-In FLP RTA\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Votre navigateur n\'est pas support\\u00E9 ; utilisez Chrome ou Internet Explorer > 10.\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Navigateur non support\\u00E9\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=L\'adaptation de l\'IU n\'est support\\u00E9e que pour les applications SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_hi.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u090F\\u0921\\u093E\\u092A\\u094D\\u091F\\u0930 UI\r\n#XTIT\r\nERROR_TITLE=\\u0924\\u094D\\u0930\\u0941\\u091F\\u093F\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP \\u092A\\u094D\\u0932\\u0917\\u0907\\u0928\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u0906\\u092A \\u0905\\u0938\\u092E\\u0930\\u094D\\u0925\\u093F\\u0924 \\u092C\\u094D\\u0930\\u093E\\u0909\\u091C\\u093C\\u0930 \\u0915\\u093E \\u0909\\u092A\\u092F\\u094B\\u0917 \\u0915\\u0930\\u0947 \\u0930\\u0939\\u0947 \\u0939\\u0948\\u0902; \\u0915\\u094D\\u0930\\u094B\\u092E \\u092F\\u093E \\u0907\\u0902\\u091F\\u0930\\u0928\\u0947\\u091F \\u090F\\u0915\\u094D\\u0938\\u092A\\u094D\\u0932\\u094B\\u0930\\u0930 \\u0915\\u093E \\u0909\\u092A\\u092F\\u094B\\u0917 \\u0915\\u0930\\u0947\\u0902 > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u0905\\u0938\\u092E\\u0930\\u094D\\u0925\\u093F\\u0924 \\u092C\\u094D\\u0930\\u093E\\u0909\\u091C\\u093C\\u0930\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI \\u0915\\u093E \\u0905\\u0928\\u0941\\u0915\\u0942\\u0932\\u0928 \\u0915\\u0947\\u0935\\u0932 SAPUI5 \\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0938\\u092E\\u0930\\u094D\\u0925\\u093F\\u0924 \\u0939\\u0948.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_hr.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Prilagodi korisni\\u010Dko su\\u010Delje\r\n#XTIT\r\nERROR_TITLE=Gre\\u0161ka\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP plug-in\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Koristite nepodr\\u017Eani pretra\\u017Eiva\\u010D; koristite Chrome ili Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Nepodr\\u017Eani pretra\\u017Eiva\\u010D\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Uskla\\u0111enje korisni\\u010Dkog su\\u010Delja podr\\u017Eano je samo za SAPUI5 aplikacije.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_hu.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=UI illeszt\\u00E9se\r\n#XTIT\r\nERROR_TITLE=Hiba\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP plug-in\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=A b\\u00F6ng\\u00E9sz\\u0151 nem t\\u00E1mogatott; haszn\\u00E1ljon Chrome-ot vagy 10-esn\\u00E9l \\u00FAjabb verzi\\u00F3j\\u00FA Internet Explorert\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=A b\\u00F6ng\\u00E9sz\\u0151 nem t\\u00E1mogatott\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=A UI-illeszt\\u00E9s csak SAPUI5-alkalmaz\\u00E1sok eset\\u00E9n t\\u00E1mogatott.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_it.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Adatta UI\r\n#XTIT\r\nERROR_TITLE=Errore\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Plug-In RTA FLP\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Il tuo browser non viene supportato; utilizza Chrome o Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Browser non supportato\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Adattamento UI supportato solo per applicazioni SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_iw.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u05D4\\u05EA\\u05D0\\u05DD \\u05DE\\u05DE\\u05E9\\u05E7 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9\r\n#XTIT\r\nERROR_TITLE=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Plug-In \\u05E9\\u05DC RTA FLP\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u05D0\\u05EA\\u05D4 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D3\\u05E4\\u05D3\\u05E4\\u05DF \\u05E9\\u05D0\\u05D9\\u05E0\\u05D5 \\u05E0\\u05EA\\u05DE\\u05DA; \\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1-Chrome \\u05D0\\u05D5 \\u05D1\\u05D2\\u05E8\\u05E1\\u05EA Internet Explorer \\u05D4\\u05D2\\u05D1\\u05D5\\u05D4\\u05D4 \\u05DE-10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u05D3\\u05E4\\u05D3\\u05E4\\u05DF \\u05E9\\u05DC\\u05D0 \\u05E0\\u05EA\\u05DE\\u05DA\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u05D4\\u05EA\\u05D0\\u05DE\\u05D4 \\u05E9\\u05DC \\u05DE\\u05DE\\u05E9\\u05E7 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05E0\\u05EA\\u05DE\\u05DB\\u05EA \\u05E8\\u05E7 \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9 SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_ja.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=UI \\u9069\\u5FDC\r\n#XTIT\r\nERROR_TITLE=\\u30A8\\u30E9\\u30FC\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP \\u30D7\\u30E9\\u30B0\\u30A4\\u30F3\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u30B5\\u30DD\\u30FC\\u30C8\\u5BFE\\u8C61\\u5916\\u306E\\u30D6\\u30E9\\u30A6\\u30B6\\u3092\\u4F7F\\u7528\\u3057\\u3066\\u3044\\u307E\\u3059\\u3002Chrome \\u307E\\u305F\\u306F Internet Explorer > 10 \\u3092\\u4F7F\\u7528\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u30B5\\u30DD\\u30FC\\u30C8\\u5BFE\\u8C61\\u5916\\u306E\\u30D6\\u30E9\\u30A6\\u30B6\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI \\u306E\\u9069\\u5FDC\\u306F SAPUI5 \\u30A2\\u30D7\\u30EA\\u30B1\\u30FC\\u30B7\\u30E7\\u30F3\\u3067\\u306E\\u307F\\u30B5\\u30DD\\u30FC\\u30C8\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_kk.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=UI \\u0431\\u0435\\u0439\\u0456\\u043C\\u0434\\u0435\\u0443\r\n#XTIT\r\nERROR_TITLE=\\u049A\\u0430\\u0442\\u0435\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP \\u043F\\u043B\\u0430\\u0433\\u0438\\u043D\\u0456\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u0411\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440\\u0433\\u0435 \\u049B\\u043E\\u043B\\u0434\\u0430\\u0443 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u043C\\u0435\\u0439\\u0434\\u0456; Chrome \\u043D\\u0435\\u043C\\u0435\\u0441\\u0435 Internet Explorer > 10 \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u044B\\u04A3\\u044B\\u0437\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u0411\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440\\u0433\\u0435 \\u049B\\u043E\\u043B\\u0434\\u0430\\u0443 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u043C\\u0435\\u0439\\u0434\\u0456\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI \\u0431\\u0435\\u0439\\u043C\\u0456\\u043D\\u0434\\u0435\\u0443\\u0456\\u043D\\u0435 \\u0442\\u0435\\u043A SAPUI5 \\u049B\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440\\u044B\\u043D\\u0434\\u0430 \\u049B\\u043E\\u043B\\u0434\\u0430\\u0443 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u0435\\u0434\\u0456.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_ko.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=UI \\uC801\\uC6A9\r\n#XTIT\r\nERROR_TITLE=\\uC624\\uB958\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP \\uD50C\\uB7EC\\uADF8\\uC778\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\uC9C0\\uC6D0\\uB418\\uC9C0 \\uC54A\\uB294 \\uBE0C\\uB77C\\uC6B0\\uC800\\uB97C \\uC0AC\\uC6A9 \\uC911\\uC785\\uB2C8\\uB2E4. Chrome \\uB610\\uB294 Internet Explorer 10 \\uC774\\uC0C1\\uC744 \\uC0AC\\uC6A9\\uD558\\uC2ED\\uC2DC\\uC624.\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\uC9C0\\uC6D0\\uB418\\uC9C0 \\uC54A\\uB294 \\uBE0C\\uB77C\\uC6B0\\uC800\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI\\uC758 \\uC801\\uC6A9\\uC740 SAPUI5 \\uC5B4\\uD50C\\uB9AC\\uCF00\\uC774\\uC158\\uC744 \\uC704\\uD574\\uC11C\\uB9CC \\uC9C0\\uC6D0\\uB429\\uB2C8\\uB2E4.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_lt.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Adaptuoti UI\r\n#XTIT\r\nERROR_TITLE=Klaida\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP priedas\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=J\\u016Bs naudojate nepalaikom\\u0105 nar\\u0161ykl\\u0119. Naudokite \\u201EChrome\\u201C arba \\u201EInternet Explorer\\u201C\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Nepalaikoma nar\\u0161ykl\\u0117\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Tik SAPUI5 taikomosios programos palaiko UI adaptavim\\u0105.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_lv.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Adapt\\u0113t UI\r\n#XTIT\r\nERROR_TITLE=K\\u013C\\u016Bda\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP spraudnis\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=J\\u016Bs izmantojat neatbalst\\u012Btu p\\u0101rl\\u016Bku; izmantojiet Chrome vai Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Neatbalst\\u012Bts p\\u0101rl\\u016Bks\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI adapt\\u0113\\u0161ana ir atbalst\\u012Bta tikai SAPUI5 lietojumprogramm\\u0101s.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_ms.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Menyesuaikan UI\r\n#XTIT\r\nERROR_TITLE=Ralat\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Pasang Masak RTA FLP\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Anda menggunakan pelayar tidak disokong; gunakan Chrome atau Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Pelayar Tidak Disokong\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Penyesuaian UI hanya disokong untuk aplikasi SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_nl.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=UI aanpassen\r\n#XTIT\r\nERROR_TITLE=Fout\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA-FLP-plug-in\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Uw browser wordt niet ondersteund; gebruik Chrome of Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Browser wordt niet ondersteund\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI-aanpassing wordt alleen voor SAPUI5-applicaties ondersteund\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_no.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Tilpass UI\r\n#XTIT\r\nERROR_TITLE=Feil\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP-plug-in\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Nettleseren din st\\u00F8ttes ikke. Bruk Chrome eller Internet Explorer > 10.\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Nettleser st\\u00F8ttes ikke\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI-tilpasning st\\u00F8ttes bare for SAPUI5-applikasjoner\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_pl.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Dostosowanie IU\r\n#XTIT\r\nERROR_TITLE=B\\u0142\\u0105d\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Plug-in RTA FLP\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Przegl\\u0105darka nie jest obs\\u0142ugiwana; u\\u017Cyj przegl\\u0105darki Chrome lub Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Przegl\\u0105darka nie jest obs\\u0142ugiwana\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Dostosowanie IU jest obs\\u0142ugiwane tylko dla aplikacji SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_pt.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Ajustar IU\r\n#XTIT\r\nERROR_TITLE=Erro\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Plug-in FLP RTA\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=O seu browser n\\u00E3o \\u00E9 suportado; utiize Chrome ou Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=O browser n\\u00E3o \\u00E9 suportado\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=O ajuste IU s\\u00F3 \\u00E9 suportado para aplica\\u00E7\\u00F5es SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_ro.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Ajustare UI\r\n#XTIT\r\nERROR_TITLE=Eroare\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=Plug-in RTA FLP\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Utiliza\\u0163i un browser nesuportat; utiliza\\u0163i Chrome sau Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Browser nesuportat\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Adaptare UI este suportat\\u0103 numai pt.aplica\\u0163ii SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_ru.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u0410\\u0434\\u0430\\u043F\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C UI\r\n#XTIT\r\nERROR_TITLE=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=\\u041F\\u043B\\u0430\\u0433\\u0438\\u043D RTA FLP\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u0411\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440 \\u043D\\u0435 \\u043F\\u043E\\u0434\\u0434\\u0435\\u0440\\u0436\\u0438\\u0432\\u0430\\u0435\\u0442\\u0441\\u044F; \\u0438\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 Chrome \\u0438\\u043B\\u0438 Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u0411\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440 \\u043D\\u0435 \\u043F\\u043E\\u0434\\u0434\\u0435\\u0440\\u0436\\u0438\\u0432\\u0430\\u0435\\u0442\\u0441\\u044F\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u0410\\u0434\\u0430\\u043F\\u0442\\u0430\\u0446\\u0438\\u044F UI \\u043F\\u043E\\u0434\\u0434\\u0435\\u0440\\u0436\\u0438\\u0432\\u0430\\u0435\\u0442\\u0441\\u044F \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0434\\u043B\\u044F \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0439 SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_sh.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Prilagodi korisni\\u010Dki interfejs\r\n#XTIT\r\nERROR_TITLE=Gre\\u0161ka\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Koristite nepodr\\u017Eani pretra\\u017Eiva\\u010D; koristite Chrome ili Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Nepodr\\u017Eani pretra\\u017Eiva\\u010D\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Prilago\\u0111avanje korisni\\u010Dkog interfejsa podr\\u017Eano je samo za SAPUI5 aplikacije.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_sk.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Prisp\\u00F4sobi\\u0165 UI\r\n#XTIT\r\nERROR_TITLE=Chyba\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP Plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=V\\u00E1\\u0161 prehliada\\u010D nie je podporovan\\u00FD; pou\\u017Eite Chrome alebo Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Prehliada\\u010D nie je podporovan\\u00FD\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u00DAprava UI je podporovan\\u00E1 len pre aplik\\u00E1cie SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_sl.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Prilagoditev UV\r\n#XTIT\r\nERROR_TITLE=Napaka\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA-FLP-vti\\u010Dnik\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Va\\u0161 brskalnik ni podprt; uporabite Chrome ali Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Brskalnik ni podprt\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UV-prilagoditev je podprta le za aplikacije SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_sv.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Anpassa UI\r\n#XTIT\r\nERROR_TITLE=Fel\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP-plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Er webbl\\u00E4sare medges ej - anv\\u00E4nd Chrome eller Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Webbl\\u00E4sare medges ej\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI-anpassning medges endast f\\u00F6r SAPUI5-applikationer.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_th.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u0E1B\\u0E23\\u0E31\\u0E1A UI\r\n#XTIT\r\nERROR_TITLE=\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP Plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u0E04\\u0E38\\u0E13\\u0E01\\u0E33\\u0E25\\u0E31\\u0E07\\u0E43\\u0E0A\\u0E49\\u0E1A\\u0E23\\u0E32\\u0E27\\u0E40\\u0E0B\\u0E2D\\u0E23\\u0E4C\\u0E17\\u0E35\\u0E48\\u0E44\\u0E21\\u0E48\\u0E23\\u0E2D\\u0E07\\u0E23\\u0E31\\u0E1A; \\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E43\\u0E0A\\u0E49 Chrome \\u0E2B\\u0E23\\u0E37\\u0E2D Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u0E1A\\u0E23\\u0E32\\u0E27\\u0E40\\u0E0B\\u0E2D\\u0E23\\u0E4C\\u0E17\\u0E35\\u0E48\\u0E44\\u0E21\\u0E48\\u0E23\\u0E2D\\u0E07\\u0E23\\u0E31\\u0E1A\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u0E01\\u0E32\\u0E23\\u0E1B\\u0E23\\u0E31\\u0E1A UI \\u0E43\\u0E0A\\u0E49\\u0E44\\u0E14\\u0E49\\u0E01\\u0E31\\u0E1A\\u0E41\\u0E2D\\u0E1E\\u0E1E\\u0E25\\u0E34\\u0E40\\u0E04\\u0E0A\\u0E31\\u0E19\\u0E02\\u0E2D\\u0E07 SAPUI5 \\u0E40\\u0E17\\u0E48\\u0E32\\u0E19\\u0E31\\u0E49\\u0E19\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_tr.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=UI uyarla\r\n#XTIT\r\nERROR_TITLE=Hata\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP eklentisi\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Taray\\u0131c\\u0131n\\u0131z desteklenmiyor; Chrome veya Internet Explorer > 10 kullan\\u0131n\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Taray\\u0131c\\u0131 desteklenmiyor\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=UI uyarlamas\\u0131 yaln\\u0131z SAPUI5 uygulamalar\\u0131 i\\u00E7in destekleniyor.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_uk.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u0410\\u0434\\u0430\\u043F\\u0442\\u0443\\u0432\\u0430\\u0442\\u0438 \\u0456\\u043D\\u0442\\u0435\\u0440\\u0444\\u0435\\u0439\\u0441 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430\r\n#XTIT\r\nERROR_TITLE=\\u041F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0430\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=\\u041F\\u043B\\u0430\\u0433\\u0456\\u043D RTA FLP\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u0412\\u0438 \\u0432\\u0438\\u043A\\u043E\\u0440\\u0438\\u0441\\u0442.\\u0431\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440, \\u044F\\u043A\\u0438\\u0439 \\u043D\\u0435 \\u043F\\u0456\\u0434\\u0442\\u0440\\u0438\\u043C\\u0443\\u0454\\u0442\\u044C\\u0441\\u044F; \\u0441\\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0430\\u0439\\u0442\\u0435\\u0441\\u044C Chrome \\u0447\\u0438 Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u0411\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440, \\u044F\\u043A\\u0438\\u0439 \\u043D\\u0435 \\u043F\\u0456\\u0434\\u0442\\u0440\\u0438\\u043C\\u0443\\u0454\\u0442\\u044C\\u0441\\u044F\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u0410\\u0434\\u0430\\u043F\\u0442\\u0430\\u0446\\u0456\\u044F \\u0456\\u043D\\u0442\\u0435\\u0440\\u0444\\u0435\\u0439\\u0441\\u0443 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 \\u043F\\u0456\\u0434\\u0442\\u0440\\u0438\\u043C\\u0443\\u0454\\u0442\\u044C\\u0441\\u044F \\u0442\\u0456\\u043B\\u044C\\u043A\\u0438 \\u0434\\u043B\\u044F \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0456\\u0432 SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_vi.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=Thi\\u0301ch \\u01B0\\u0301ng UI\r\n#XTIT\r\nERROR_TITLE=L\\u00F4\\u0303i\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=RTA FLP Plugin\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=Tri\\u0323nh duy\\u00EA\\u0323t ma\\u0300 ba\\u0323n \\u0111ang du\\u0300ng kh\\u00F4ng \\u0111\\u01B0\\u01A1\\u0323c h\\u00F4\\u0303 tr\\u01A1\\u0323, ha\\u0303y du\\u0300ng Chrome ho\\u0103\\u0323c Internet Explorer > 10\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=Tri\\u0300nh duy\\u00EA\\u0323t kh\\u00F4ng \\u0111\\u01B0\\u01A1\\u0323c h\\u00F4\\u0303 tr\\u01A1\\u0323\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=Chi\\u0309 h\\u00F4\\u0303 tr\\u01A1\\u0323 \\u0111i\\u00EA\\u0300u chi\\u0309nh giao di\\u00EA\\u0323n ng\\u01B0\\u01A1\\u0300i du\\u0300ng \\u0111\\u00F4\\u0301i v\\u01A1\\u0301i ca\\u0301c \\u01B0\\u0301ng du\\u0323ng SAPUI5.\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_zh_CN.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u8C03\\u6574 UI\r\n#XTIT\r\nERROR_TITLE=\\u9519\\u8BEF\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=ABAP \\u8FD0\\u884C\\u65F6\\u5206\\u6790 Fiori \\u5FEB\\u901F\\u542F\\u52A8\\u677F\\u63D2\\u4EF6\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u5F53\\u524D\\u4F7F\\u7528\\u7684\\u6D4F\\u89C8\\u5668\\u4E0D\\u53D7\\u652F\\u6301\\uFF1B\\u4F7F\\u7528 Chrome \\u6216\\u7248\\u672C 10 \\u4EE5\\u4E0A\\u7684 Internet Explorer\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u4E0D\\u652F\\u6301\\u7684\\u6D4F\\u89C8\\u5668\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u4EC5\\u5BF9 SAPUI5 \\u5E94\\u7528\\u7A0B\\u5E8F\\u624D\\u652F\\u6301 UI \\u8C03\\u6574\\u3002\r\n',
	"sap/ushell/plugins/rta/i18n/i18n_zh_TW.properties":'\r\n# Copyright (c) 2015 SAP SE, All Rights Reserved\r\n\r\n#XTIT\r\nRTA_BUTTON_TEXT=\\u8ABF\\u6574\\u4F7F\\u7528\\u8005\\u4ECB\\u9762\r\n#XTIT\r\nERROR_TITLE=\\u932F\\u8AA4\r\n\r\n#XTIT: Application title of the FLP plugin in app descriptor\r\nAPP_TITLE=ABAP \\u57F7\\u884C\\u6642\\u671F\\u5206\\u6790 SAP Fiori launchpad Plug-In\r\n\r\n#XMSG: Error Message when using unsupported Browser\r\nMSG_UNSUPPORTED_BROWSER=\\u60A8\\u6B63\\u5728\\u4F7F\\u7528\\u4E0D\\u652F\\u63F4\\u7684\\u700F\\u89BD\\u5668\\uFF1B\\u8ACB\\u4F7F\\u7528 Chrome \\u6216\\u7248\\u672C\\u5927\\u65BC 10 \\u7684 Internet Explorer\r\n#XTIT: Title of the ErrorMessage Window\r\nTIT_UNSUPPORTED_BROWSER=\\u4E0D\\u652F\\u63F4\\u7684\\u700F\\u89BD\\u5668\r\n#XMSG: Error Message - RTA is only supported in SAPUI5 Applications\r\nMSG_UNSUPPORTED_APP=\\u50C5 SAPUI5 \\u61C9\\u7528\\u7A0B\\u5F0F\\u652F\\u63F4\\u4F7F\\u7528\\u8005\\u4ECB\\u9762\\u8ABF\\u6574\r\n',
	"sap/ushell/plugins/rta/manifest.json":'{\n\t"_version": "1.1.0",\n\n\t"sap.app": {\n\t\t"_version": "1.1.0",\n\t\t"i18n": "i18n/i18n.properties",\n\t\t"id": "sap.ushell.plugins.rta",\n\t\t"title": "{{APP_TITLE}}",\n\t\t"type": "component",\n\t\t"applicationVersion": {\n\t\t\t"version": "1.0.0"\n\t\t},\n\t\t"ach": "CA-UI5-FL-RTA"\n\t},\n\n\t"sap.ui": {\n\t\t"_version": "1.1.0",\n\t\t"technology": "UI5",\n\t\t"supportedThemes": [\n\t\t\t"sap_hcb",\n\t\t\t"sap_bluecrystal"\n\t\t],\n\t\t"deviceTypes": {\n\t\t\t"desktop": true,\n\t\t\t"tablet": false,\n\t\t\t"phone": false\n\t\t}\n\t},\n\n\t"sap.ui5": {\n\t\t"_version": "1.1.0",\n\t\t"contentDensities": {\n\t\t\t"compact": true,\n\t\t\t"cozy": false\n\t\t},\n\t\t"dependencies": {\n\t\t\t"minUI5Version": "1.30.1",\n\t\t\t"libs": {\n\t\t\t\t"sap.ui.core": {\n\t\t\t\t\t"minVersion": "1.30.1"\n\t\t\t\t},\n\t\t\t\t"sap.m": {\n\t\t\t\t\t"minVersion": "1.30.1"\n\t\t\t\t},\n\t\t\t\t"sap.ui.dt": {\n\t\t\t\t\t"minVersion": "1.30.1",\n\t\t\t\t\t"lazy": true\n\t\t\t\t},\n\t\t\t\t"sap.ui.rta": {\n\t\t\t\t\t"minVersion": "1.30.1",\n\t\t\t\t\t"lazy": true\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t"models": {\n\t\t\t"i18n": {\n\t\t\t\t"type": "sap.ui.model.resource.ResourceModel",\n\t\t\t\t"uri": "i18n/i18n.properties"\n\t\t\t}\n\t\t}\n\t}\n}'
}});