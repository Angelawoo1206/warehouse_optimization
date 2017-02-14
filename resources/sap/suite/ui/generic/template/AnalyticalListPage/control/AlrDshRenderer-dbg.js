sap.ui.define(["jquery.sap.global", "sap/ui/core/RenderManager"],
    function(jQuery, RenderManager) {
    "use strict";

    var AlrDshRenderer = {
    };

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     * 
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     */
    AlrDshRenderer.render = function(oRm, oControl){        
        jQuery.sap.require("sap.ui.core.RenderManager");
        
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addStyle("width", oControl.getWidth());        
        oRm.addStyle("height", oControl.getHeight());
        oRm.addClass("sapZenDshDsh");
        oRm.writeStyles();
        oRm.writeClasses();
            
        oRm.write(">");

        var $oldContent = sap.ui.core.RenderManager.findPreservedContent(oControl.DSH_ROOT_NODE_ID);
        
        if ( $oldContent.length === 1) {
            oRm.write($oldContent[0].outerHTML);
            
            var $preserveArea = sap.ui.core.RenderManager.getPreserveAreaRef();
            $preserveArea.remove($oldContent);
                        
            oControl.addEventDelegate({
                onAfterRendering:function(ev) {
                    ev.srcControl.removeEventDelegate(this);
                    ev.srcControl.refreshCrosstab(true);
                    ev.srcControl.updateDshContainerHeight();
                    ev.srcControl.addResizeHandler();
                }
            });
        } else {
            oRm.write("<div id=\"" + oControl.DSH_ROOT_NODE_ID + "\" data-sap-ui-preserve=\"" + oControl.DSH_ROOT_NODE_ID + "\" ");
            oRm.write("style=\"");
            oRm.write("width:100%;");
            oRm.write("height:100%;");   
            oRm.write("\">");
            oRm.write("</div>");            
        }
        oRm.write("</div>");
    };

    return AlrDshRenderer;

}, /* bExport= */ true);
