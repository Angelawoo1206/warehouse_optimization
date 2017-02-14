(function () {
    "use strict";
    /*global sap, jQuery */

    sap.ui.controller("sap.ovp.cards.list.List", {
        counter: 0,
        arrayLength: 0,
        minMaxModel: {},
        onInit: function () {
            this.counter = 0;
            this.minMaxModel = new sap.ui.model.json.JSONModel();
            this.minMaxModel.setData({
                minValue: 1,
                maxValue: -1
            });
            this.getView().setModel(this.minMaxModel, "minMaxModel");
        },

        onListItemPress: function (oEvent) {
            var aNavigationFields = this.getEntityNavigationEntries(oEvent.getSource().getBindingContext(), this.getCardPropertiesModel().getProperty("/annotationPath"));
            this.doNavigation(oEvent.getSource().getBindingContext(), aNavigationFields[0]);
        },

        /**
         * This function loops through context values and gets
         * the Max & Min Value for the card in 'this'
         * context(ie different for different cards)
         * Requirement: In case of global filters applied context changes and Max and Min should also change
         * Drawback : Max and Min are calculated for each list Items again considering all items in context.
         * */
        _getMinMaxObjectFromContext: function () {
            this.counter++;
            var oEntityType = this.getEntityType(),
                sAnnotationPath = this.getCardPropertiesModel().getProperty("/annotationPath"),
                aRecords = oEntityType[sAnnotationPath],
                context = this.getMetaModel().createBindingContext(oEntityType.$path + "/" + sAnnotationPath),
                minMaxObject = {
                    minValue: 1,
                    maxValue: -1
                };

            //Case 1:  In case of percentage
            if (sap.ovp.cards.AnnotationHelper.isFirstDataPointPercentageUnit(context, aRecords)) {
                minMaxObject.minValue = 0;
                minMaxObject.maxValue = 100;
                return minMaxObject;
            }

            //Case 2: Otherwise
            var dataPointValue = sap.ovp.cards.AnnotationHelper.getFirstDataPointValue(context, aRecords),
                barList = this.getView().byId("ovpList"),
                listItems = barList.getBinding("items"),
                itemsContextsArray = listItems.getCurrentContexts();
            for (var i = 0; i < itemsContextsArray.length; i++) {
                var currentItemValue = parseInt(itemsContextsArray[i].getObject()[dataPointValue], 10);
                if (currentItemValue < minMaxObject.minValue) {
                    minMaxObject.minValue = currentItemValue;
                } else if (currentItemValue > minMaxObject.maxValue){
                    minMaxObject.maxValue = currentItemValue;
                }
            }
            return minMaxObject;
        },

        /**
         *  this function
         *  1.updates both min and max values in 'this' context
         *  and
         *  2.then updates the model attached to that particular card
         *  3.then refreshes the model to affect the changes
         *  */
        _updateMinMaxModel: function () {
            var minMaxObject = this._getMinMaxObjectFromContext();
            this.minMaxModel.setData({
                minValue: minMaxObject.minValue,
                maxValue: minMaxObject.maxValue
            });
            this.minMaxModel.refresh();
            return minMaxObject;
        },

        /**
         * this function call update method and return the value.
         * */
        returnBarChartValue: function (value) {
            var minMaxObject = this._updateMinMaxModel();
            //parseInt return values b/w (-1,1) as 0
            var iValue = parseInt(value, 10);
            // In case of values are not between (-1,1) show value as is
            if (iValue !== 0) {
                return iValue;
                // If max Value is less than Zero and Values is between (-1,1) then show minimal value in negative
            } else if (minMaxObject.maxValue <= 0) {
                return -0.5;
                // If min Value is more than Zero and Values is between (-1,1) then show minimal value in positive
            } else if (minMaxObject.minValue >= 0) {
                return 0.5;
            }
            //If both Max is greater than 0 and min is less than Zero ,Show value as it is.
            return iValue;

        },

        /**
         * Gets the card items binding object for the count footer
         */
        getCardItemsBinding: function() {
            var list = this.getView().byId("ovpList");
            return list.getBinding("items");
        }

    });
})();
