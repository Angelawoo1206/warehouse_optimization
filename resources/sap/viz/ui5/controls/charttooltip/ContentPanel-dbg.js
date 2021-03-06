/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define([
    'sap/ui/core/Control',
    'sap/ui/layout/VerticalLayout',
    'sap/ui/layout/HorizontalLayout',
    'sap/m/Label',
    'sap/m/Text',
    'sap/m/ObjectNumber'
], function(
    Control,
    VerticalLayout,
    HorizontalLayout,
    Label,
    Text,
    ObjectNumber
) {
    "use strict";

    var ContentPanel = Control.extend("sap.viz.ui5.controls.charttooltip.ContentPanel", {
        metadata: {
            properties: {}
        },

        renderer: {
            render: function(oRm, oControl) {
                var sId = oControl.getId();
                oRm.write('<div');
                oRm.writeAttribute("id", sId);
                oRm.addClass("viz-controls-chartTooltip-contentPanel");
                oRm.writeClasses();
                oRm.write('>');
                oRm.renderControl(oControl._oPanel);
                oRm.write('</div>');
            }
        }
    });

    ContentPanel.prototype.init = function() {
        this._oPanel = new VerticalLayout({});
    };

    ContentPanel.prototype.setContent = function(data) {
        var oPanel = this._oPanel;
        oPanel.destroyContent();
        var first = true;
        var that = this;
        data.forEach(function(item, i) {
            if (item.type) {
                var label = new Label({
                    text: item.name
                });
                label.addStyleClass("viz-controls-chartTooltip-label");
                var value, dimValue, msrValue, hl;
                var colonLabel = new Label({
                    text: ":"
                });
                colonLabel.addStyleClass("viz-controls-chartTooltip-separator");

                if (item.type.toLowerCase() === "dimension") {
                    var dimText;
                    var itemValue = item.value;
                    if (data.timeDimensions && data.timeDimensions.indexOf(i) > -1) {
                        //Time Dimension
                        if (itemValue.time && itemValue.time.legnth > itemValue.day.length) {
                            dimText = itemValue.time;
                        } else {
                            dimText = itemValue.day;
                        }
                    } else {
                        dimText = itemValue;
                    }
                    dimText = (dimText == null) ? that._getNoValueLabel() : dimText;
                    dimValue = new Text({
                        text: dimText
                    });
                    dimValue.addStyleClass("viz-controls-chartTooltip-dimension-value");
                    value = dimValue;
                } else if (item.type.toLowerCase() === "measure") {
                    var msrText = item.value || that._getNoValueLabel();
                    msrValue = new ObjectNumber({
                        number: msrText,
                        unit: item.unit
                    });
                    msrValue.addStyleClass("viz-controls-chartTooltip-measure-value");
                    value = msrValue;
                }
                hl = new HorizontalLayout({
                    content: [label, colonLabel, value]
                });
                if (!first) {
                    hl.addStyleClass("sapUI5TooltipRowSpacing");
                } else {
                    first = false;
                }
                oPanel.addContent(hl);
            }
        });
    };

    ContentPanel.prototype.exit = function() {
        if (this._oPanel) {
            this._oPanel.destroy();
            this._oPanel = null;
        }
    };

    ContentPanel.prototype._getNoValueLabel = function(){
        return sap.viz.extapi.env.Language.getResourceString("IDS_ISNOVALUE");
    };

    return ContentPanel;
});
