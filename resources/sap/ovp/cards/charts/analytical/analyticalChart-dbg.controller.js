(function () {
	"use strict";
	/*global sap, jQuery */

	sap.ui.controller("sap.ovp.cards.charts.analytical.analyticalChart", {
		onInit: function () {
			
			var vizFrame = this.getView().byId("analyticalChart");
			if (vizFrame) {
				sap.ovp.cards.charts.VizAnnotationManager.formatChartAxes(vizFrame);
				}
				this.bFlag = true;
		},
		onBeforeRendering : function() {
			if (this.bCardProcessed) {
				return;
			}
			sap.ovp.cards.charts.VizAnnotationManager.validateCardConfiguration(this);
			var vizFrame = this.getView().byId("analyticalChart");
			var bubbleText = this.getView().byId("bubbleText");
			var chartTitle = this.getView().byId("ovpCT");
			var bubbleSizeText = sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("BUBBLESIZE");
			var navigation;
			/*var navigation = vizFrame.getModel('ovpCardProperties').getProperty("/navigation");
			if (navigation == "chartNav") {
				vizFrame.attachBrowserEvent("click", this.onHeaderClick.bind(this));
			} else {
				sap.ovp.cards.charts.VizAnnotationManager.getSelectedDataPoint(vizFrame, this);
			}*/
			if (!vizFrame) {
				jQuery.sap.log.error(sap.ovp.cards.charts.VizAnnotationManager.constants.ERROR_NO_CHART +
						": (" + this.getView().getId() + ")");
			} else {
				navigation = vizFrame.getModel('ovpCardProperties').getProperty("/navigation");
				if (navigation == "chartNav") {
					vizFrame.attachBrowserEvent("click", this.onHeaderClick.bind(this));
				} else {
					sap.ovp.cards.charts.VizAnnotationManager.getSelectedDataPoint(vizFrame, this);
				}
//				vizFrame.addEventDelegate(this.busyDelegate, vizFrame);
				var handler = vizFrame.getParent();
				
				sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(vizFrame,handler,chartTitle);
				if (bubbleText != undefined) {
					var feeds = vizFrame.getFeeds();
					jQuery.each(feeds,function(i,v){
						if (feeds[i].getUid() == "bubbleWidth") {
							bubbleText.setText(bubbleSizeText + " " + feeds[i].getValues());
						}
					});
				}
				sap.ovp.cards.charts.VizAnnotationManager.hideDateTimeAxis(vizFrame);
				var binding = vizFrame.getParent().getBinding("data");
				
				this._handleKPIHeader();
				
				if (binding.getPath()) {
					binding.attachDataReceived(jQuery.proxy(this.onDataReceived, this));
					binding.attachDataRequested(jQuery.proxy(this.onDataRequested, this));
				} else {
					var noDataDiv = sap.ui.xmlfragment("sap.ovp.cards.charts.generic.noData");
					var cardContainer = this.getCardContentContainer();
					cardContainer.removeAllItems();
					cardContainer.addItem(noDataDiv);
				}
			}
			this.bCardProcessed = true;
		},
		onDataReceived: function(oEvent) {
			var vizFrame = this.getView().byId("analyticalChart");
			var handler = vizFrame.getParent();
			var chartScaleTitle = this.getView().byId("ovpScaleUnit");
			var vizData = oEvent ? oEvent.getParameter('data') : null;
			sap.ovp.cards.charts.VizAnnotationManager.setChartScaleTitle(vizFrame,vizData,handler,chartScaleTitle);
			if (this.bFlag == true) {
//			vizFrame.addEventDelegate(this.freeDelegate, vizFrame);
			this.bFlag = false;
			} else {
				setTimeout(function(){
					vizFrame.setBusy(false);
					},0);
			}
			sap.ovp.cards.charts.VizAnnotationManager.checkNoData(oEvent, this.getCardContentContainer(), vizFrame);
		},
		onDataRequested : function() {
			var vizFrame = this.getView().byId("analyticalChart");
//			vizFrame.removeEventDelegate(this.freeDelegate, vizFrame);
			vizFrame.setBusy(true);
		},
		
		getCardItemsBinding: function() {
            var vizFrame = this.getView().byId("analyticalChart");
            return vizFrame.getParent().getBinding("data");
        }
	});
})();
