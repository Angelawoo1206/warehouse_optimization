sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover"
], function (jQuery, Controller, JSONModel, MessagePopover) {
    "use strict";
    return Controller.extend("sap.m.sample.SemanticPage.controller.Page", {

        onInit: function () {

            var oViewModel = new JSONModel({
                "planning": {
                    "id": "",
                    "name": "",
                    "order_count": "",
                    "start_date": "",
                    "end_data": ""
                        //                ,
                        //            "DueDate":""
                },
                "layout_id": "",
                "layout_name": "",
                "min_cost_total_cost": "",
                "min_time_total_cost": "",
                "slotting_parameter": 0.3


                //            ,
                //            "timeLeft":0
            });

            this.getView().setModel(oViewModel, "view");

            var oLaborParameter = new JSONModel({
                "dataset_id": 32081,
                "layout_id": 1,
                "parameter": {
                    "fte": {
                        "speed": 100,
                        "work_time": 8,
                        "max_overtime": 4,
                        "overtime_cost": 80
                    },
                    "temp": {
                        "speed": 75,
                        "cost": 50
                    },
                    "warehouse": {
                        "fte_count": 3,
                        "max_worker_count": 5
                    }
                },
                "max_days": 5,
                "max_cost": 3000
            });

            this.getView().setModel(oLaborParameter, "laborParameters");

            var oLaborResult = new JSONModel({
                "min_cost": {
                    "days": "",
                    "overtime": "",
                    "work_time_of_temporary": "",
                    "overtime_cost": "",
                    "temporary_cost": ""
                },
                "min_days": {
                    "days": "",
                    "overtime": "",
                    "work_time_of_temporary": "",
                    "overtime_cost": "",
                    "temporary_cost": ""
                }
            });

            this.getView().setModel(oLaborResult, "laborResult");

            var oSlottingResult = new JSONModel();
            this.getView().setModel(oSlottingResult, "slottingResult");


            var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
            var oMessageManager = sap.ui.getCore().getMessageManager();

            oMessageManager.registerMessageProcessor(oMessageProcessor);

            oMessageManager.addMessages(
                new sap.ui.core.message.Message({
                    message: "Something wrong happened",
                    type: sap.ui.core.MessageType.Error,
                    processor: oMessageProcessor
                })
            );
        },

        selectPlanningById: function (planningId) {
            var oModelData = this.getView().getModel("datasets").getData();
            var oViewModel = this.getView().getModel("view");
            var n_timeLeft = 0;
            var that = this;
            oModelData.forEach(function (planningItem) {
                if (planningId == planningItem.id) {
                    oViewModel.setProperty("/planning", JSON.parse(JSON.stringify(planningItem)));
                }
            });
            this.getView().setModel(oViewModel, "view");
        },

        selectLayoutById: function (layoutId) {
            var oLayoutData = this.getView().getModel("layouts").getData();
            var oViewModel = this.getView().getModel("view");
            var that = this;
            oLayoutData.forEach(function (layoutItem) {
                if (layoutId == layoutItem.id) {
                    oViewModel.setProperty("/layout_name", layoutItem.name);
                    sap.ui.controller("sap.m.sample.SemanticPage.SharedBlocks.slotting.SlottingOptimizationBlockController").draw(layoutItem.name, false);
                }
            });
            this.getView().setModel(oViewModel, "view");
        },

        onSelectPlanning: function (oEvent) {
            var planningId = oEvent.getSource().getSelectedItem().getKey();
            this.selectPlanningById(planningId);

            var comboBox_layout = this.byId("comboBox_layout");
            comboBox_layout.setEnabled(true);
        },

        onSelectLayout: function (oEvent) {
            var layoutId = oEvent.getSource().getSelectedItem().getKey();
            this.selectLayoutById(layoutId);

            var slottingSlider = this.byId("slider_slotting");
            slottingSlider.setEnabled(true);

            var slottingButton = this.byId("button_slotting");
            slottingButton.setEnabled(true);
        },

        onExcuteSlotting: function (oEvent) {
            var oViewModel = this.getView().getModel("view");
            var dataSet = oViewModel.getProperty("/planning/id");
            var layout = oViewModel.getProperty("/layout_id");
            var min_support = oViewModel.getProperty("/slotting_parameter");
            var slottingResult = this.getView().getModel("slottingResult");
            var that = this;
            var url = "http://10.58.184.194:8080/wo/rest/slotting?dataset_id=" + dataSet + "&layout_id=" + layout + "&min_support=" + min_support;
            $.ajax({
                type: "POST",
                url: url,
                success: function (data) {
                    slottingResult.setData(data);

                    sap.ui.controller("sap.m.sample.SemanticPage.SharedBlocks.slotting.SlottingOptimizationBlockController").bindingProductToLayout(data);

                    var slider_max_cost = that.byId("slider_max_cost");
                    slider_max_cost.setEnabled(true);

                    var slider_process_time = that.byId("slider_process_time");
                    slider_process_time.setEnabled(true);

                    var slider_fte_ot_pay = that.byId("slider_fte_ot_pay");
                    slider_fte_ot_pay.setEnabled(true);

                    var slider_temporary_pay = that.byId("slider_temporary_pay");
                    slider_temporary_pay.setEnabled(true);

                    var button_labor = that.byId("button_labor");
                    button_labor.setEnabled(true);
                }
            });
        },

        onExecuteLaborOptimization: function (oEvent) {
            var pageLayout = this.byId("ObjectPageLayout");
            var selectedSubSctionId = this.byId("labor").sId;
            pageLayout.setSelectedSection(selectedSubSctionId);
            var oViewModel = this.getView().getModel("view");
            var oLaborParameter = this.getView().getModel("laborParameters");
            var oLaborResult = this.getView().getModel("laborResult");

            var dataset_id = oViewModel.getProperty("/planning/id");
            oLaborParameter.setProperty("/dataset_id", dataset_id);

            var layout_id = oViewModel.getProperty("/layout_id");
            oLaborParameter.setProperty("/layout_id", layout_id);

            //-------------------call rest API
            var that = this;
            var url = "http://10.58.184.194:8080/wo/rest/labor",
                data = oLaborParameter.getData();
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                success: function (data) {
                    oLaborResult.setData(data);
                    var min_cost_overtime_cost = oLaborResult.getProperty("/min_cost/overtime_cost");
                    var min_cost_temporary_cost = oLaborResult.getProperty("/min_cost/temporary_cost");
                    oViewModel.setProperty("/min_cost_total_cost", min_cost_overtime_cost + min_cost_temporary_cost);

                    var min_time_overtime_cost = oLaborResult.getProperty("/min_days/overtime_cost");
                    var min_time_temporary_cost = oLaborResult.getProperty("/min_days/temporary_cost");
                    oViewModel.setProperty("/min_time_total_cost", min_time_overtime_cost + min_time_temporary_cost);

                    that.getView().setModel(oViewModel, "view");
                },
                "contentType": 'application/json; charset=UTF-8'
            });



            //-----------------------------


        },


        onPress: function (oEvent) {

            sap.m.MessageToast.show("Pressed custom button " + oEvent.getSource().getId());
        },

        onSemanticButtonPress: function (oEvent) {

            var sAction = oEvent.getSource().getMetadata().getName();
            sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");

            sap.m.MessageToast.show("Pressed: " + sAction);
        },
        onSemanticSelectChange: function (oEvent, oData) {
            var sAction = oEvent.getSource().getMetadata().getName();
            sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");

            var sStatusText = sAction + " by " + oEvent.getSource().getSelectedItem().getText();
            sap.m.MessageToast.show("Selected: " + sStatusText);
        },
        onPositionChange: function (oEvent) {
            sap.m.MessageToast.show("Positioned changed to " + oEvent.getParameter("newPosition"));
        },
        onMessagesButtonPress: function (oEvent) {

            var oMessagesButton = oEvent.getSource();
            if (!this._messagePopover) {
                this._messagePopover = new MessagePopover({
                    items: {
                        path: "message>/",
                        template: new MessagePopoverItem({
                            description: "{message>description}",
                            type: "{message>type}",
                            title: "{message>message}"
                        })
                    }
                });
                oMessagesButton.addDependent(this._messagePopover);
            }
            this._messagePopover.toggle(oMessagesButton);
        },

        onMultiSelectPress: function (oEvent) {
            if (oEvent.getSource().getPressed()) {
                sap.m.MessageToast.show("MultiSelect Pressed");
            } else {
                sap.m.MessageToast.show("MultiSelect Unpressed");
            };
        },

        getDateLeft: function (sDueDate) {
            var now = new Date();
            var dueDate = new Date(sDueDate);
            var dateLeft = Math.floor((dueDate.getTime() - now.getTime()) / (24 * 3600 * 1000));
            return dateLeft;
        }

    });

});