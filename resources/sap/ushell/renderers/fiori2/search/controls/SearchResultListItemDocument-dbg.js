// iteration 0 : Holger
/* global sap,window,jQuery */

(function() {
    "use strict";

    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchResultListItem');

    sap.ushell.renderers.fiori2.search.controls.SearchResultListItem.extend("sap.ushell.renderers.fiori2.search.controls.SearchResultListItemDocument", {
        // the control API:
        // metadata: {
        //     properties: {
        //
        //     },
        //     aggregations: {
        //
        //     }
        // },

        // init: function() {
        //     var that = this;
        // },

        renderer: function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            oControl._renderer(oRm);
        },


        _renderTitleContainer: function(oRm) {
            var that = this;

            oRm.write('<div class="sapUshellSearchResultListItem-TitleAndImageContainer">');
            oRm.write('<div class="sapUshellSearchResultListItem-TitleContainer">');

            that._renderCheckbox(oRm);

            /// /// Title
            var titleURL = that.getTitleUrl();
            var titleLink = that.getAggregation("_titleLink");
            titleLink.setHref(titleURL);
            titleLink.setText("DOCUMENT: " + that.getTitle());

            if (titleURL.length == 0) {
                titleLink.setEnabled(false);
            }

            oRm.renderControl(titleLink);

            /// /// Object Type
            var typeText = that.getAggregation("_typeText");
            typeText.setText(that.getType());
            oRm.renderControl(typeText);

            oRm.write('</div>');

            that._renderImageForPhone(oRm);

            oRm.write('</div>');
        },

        _renderImageAttribute: function(oRm) {
            var that = this;

            if (!that.getImageUrl()) {
                return;
            }

            oRm.write('<div class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-ImageAttribute');
            if (!that.getImageUrl()) {
                oRm.write(' sapUshellSearchResultListItem-ImageAttributeHidden');
            }
            oRm.write('">');
            oRm.write('<div class="sapUshellSearchResultListItem-ImageContainer">');

            if (that.getImageUrl()) {
                oRm.write('<img class="sapUshellSearchResultListItem-Image" src="');
                oRm.write(that.getImageUrl());
                oRm.write('">');
            }

            oRm.write('<div class="sapUshellSearchResultListItem-ImageContainerAlignmentHelper"></div>');
            oRm.write('</div>');
            oRm.write('</div>');
        }


    });
})();
