jQuery.sap.declare("sap.ushell.components.tiles.sbtilecontent");
sap.ui.define( [
                "sap/suite/ui/commons/TileContent",
                "sap/suite/ui/commons/TileContentRenderer",
                "sap/ui/core/Control"
                ], function(TileContent, Renderer, Control) {
    "use strict";

    var timestamp = Control.extend( "numeric.TileContent_Timestamp", {
        ontap: function(e) {
            if (this.getParent().getRefreshOption()) {
                e.preventDefault();
                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                this.getParent().fireRefresh();
            }
        },
        renderer: function(r, c) {
            r.write("<div");
            r.writeElementData(c);
            r.addClass("sapSuiteTileCntFtrTxt");
            if (c.getParent().getRefreshOption()) {
              r.addClass("sapMLnk");
            }
            //r.addClass(c.getParent().getSize());
            r.writeClasses();
            r.addStyle("position", "absolute"); 
            r.addStyle(r.getConfiguration().getRTL() ? "left" : "right", "auto");
            r.writeStyles();
            r.write(">");
            var ts = c.getParent().getTimestamp();
            if (ts) {
                if (!c.getParent().getRefreshOption()) {
                    r.writeEscaped(ts);
                } else if (r.getConfiguration().getRTL()) {
                    r.writeEscaped(ts + "\u2009");
                    r.writeIcon("sap-icon://refresh", "sapSuiteCmpTileUnitInner");
                } else {
                    r.writeIcon("sap-icon://refresh", "sapSuiteCmpTileUnitInner");
                    r.writeEscaped("\u2009" + ts);
                }
            }
            r.write("</div>");
        }
    } );

    return TileContent.extend( "sap.ushell.components.tiles.sbtilecontent", {
        metadata: {
            properties: {
                timestamp: {type: "string"},
                refreshOption: {type: "boolean"}
            },
            events: {
                refresh: {}
            }
        },
        init: function() {
            this.addDependent(this._oTimestamp = new timestamp());
        },
        getAltText: function() {
            var a = TileContent.prototype.getAltText.apply(this, arguments);
            if (this.getTimestamp()) {
                a += (a === "" ? "" : "\n") + this.getTimestamp();
            }
            return a;
        },
        renderer: {
            renderFooter: function(r, c) {
                Renderer.renderFooter.apply(this, arguments);
                r.renderControl(c._oTimestamp);
            }
        }
    } );
}, true );