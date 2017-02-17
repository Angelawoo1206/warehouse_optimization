sap.ui.define([
	"webapp_2/controller/BaseController",
	"webapp_2/pathfinding/core/Grid",
    "webapp_2/thirdparty/js/RouteView"
], function (BaseController, Grid, View) {
    "use strict";

    return BaseController.extend("sap.m.sample.SemanticPage.SharedBlocks.route.RouteOptimizationBlockController", {

        gridSize: [84, 36], // number of nodes horizontally and vertically

        Controller: StateMachine.create({
            initial: 'none',
            events: [
                {
                    name: 'init',
                    from: 'none',
                    to: 'ready'
		        },
                {
                    name: 'search',
                    from: 'starting',
                    to: 'searching'
		        },
                {
                    name: 'pause',
                    from: 'searching',
                    to: 'paused'
		        },
                {
                    name: 'finish',
                    from: 'searching',
                    to: 'finished'
		        },
                {
                    name: 'resume',
                    from: 'paused',
                    to: 'searching'
		        },
                {
                    name: 'cancel',
                    from: 'paused',
                    to: 'ready'
		        },
                {
                    name: 'modify',
                    from: 'finished',
                    to: 'modified'
		        },
                {
                    name: 'reset',
                    from: '*',
                    to: 'ready'
		        },
                {
                    name: 'clear',
                    from: ['finished', 'modified'],
                    to: 'ready'
		        },
                {
                    name: 'start',
                    from: ['ready', 'modified', 'restarting'],
                    to: 'starting'
		        },
                {
                    name: 'restart',
                    from: ['searching', 'finished'],
                    to: 'restarting'
		        },
                {
                    name: 'dragStart',
                    from: ['ready', 'finished'],
                    to: 'draggingStart'
		        },
                {
                    name: 'dragEnd',
                    from: ['ready', 'finished'],
                    to: 'draggingEnd'
		        },
                {
                    name: 'drawWall',
                    from: ['ready', 'finished'],
                    to: 'drawingWall'
		        },
                {
                    name: 'eraseWall',
                    from: ['ready', 'finished'],
                    to: 'erasingWall'
		        },
                {
                    name: 'rest',
                    from: ['draggingStart', 'draggingEnd', 'drawingWall', 'erasingWall'],
                    to: 'ready'
		        },
		    ],
        }),

        onAfterRendering: function () {
            this.draw();
        },

        draw: function () {
            var numCols = this.gridSize[0],
                numRows = this.gridSize[1];
            this.grid = new Grid.Grid(numCols, numRows);
            var that = this;
            var draw_area = this.byId("draw_area_route").sId;
            if (!View.paper) {
                View.init({
                    numCols: numCols,
                    numRows: numRows,
                    draw_area: draw_area
                });

                View.generateGrid(function () {

                    that.setDefaultStartEndPos();
                    that.setDefaultLayout();
                    //this.setDefaultLayout(oLayout);
                    //this.bindEvents();
                    //this.transition(); // transit to the next state (ready)
                });
            }

        },

        /**
         * When initializing, this method will be called to set the positions
         * of start node and end node.
         * It will detect user's display size, and compute the best positions.
         */
        setDefaultStartEndPos: function () {
            var width, height,
                marginRight, availWidth,
                centerX, centerY,
                endX, endY,
                nodeSize = View.nodeSize;

            width = View.paper.width;
            height = View.paper.height;

            centerX = Math.ceil(width / 2 / 10);
            centerY = Math.floor(height / 2 / 10);

            this.setStartPos(centerX + 29, centerY);
            this.setEndPos(centerX - 30, centerY);
        },

        setStartPos: function (gridX, gridY) {
            this.startX = gridX;
            this.startY = gridY;
            View.setStartPos(gridX, gridY);
        },

        setEndPos: function (gridX, gridY) {
            this.endX = gridX;
            this.endY = gridY;
            View.setEndPos(gridX, gridY);
        },

        setDefaultLayout: function () {
            var width, height,
                marginRight, availWidth,
                centerX, centerY,
                endX, endY,
                nodeSize = View.nodeSize;

            width = View.paper.width;
            height = View.paper.height;

            centerX = Math.ceil(width / 2 / 10);
            centerY = Math.floor(height / 2 / 10);
            this.drawFlyingVLayout(centerX, centerY);
            this.clearAll();
        },

        drawTraditionalLayout: function (gridX, gridY) {
            var endX = gridX + 29,
                startX = gridX - 30,
                endY = gridY;
            for (var i = startX + 2; i <= endX - 2; i++) {
                for (var j = 2; j <= this.endY + 8; j++) {
                    if (i % 4 == 0 || i % 4 == 1) {
                        this.setWalkableAt(i, j, false);
                    }
                }
            }
        },
        drawFlyingVLayout: function (gridX, gridY) {
            this.drawTraditionalLayout(gridX, gridY);
            var sharpVX = this.startX + Math.round((this.endX - this.startX) / 2);
            var sharpVY = this.endY + 8;
            this.setWalkableAt(sharpVX, sharpVY, true);
            if (sharpVX % 4 == 0 || sharpVX % 4 == 2) {
                this.setWalkableAt(sharpVX + 1, sharpVY, true);
            } else {
                this.setWalkableAt(sharpVX - 1, sharpVY, true);
                sharpVX = sharpVX - 1;
            }


            var sharpVXR = sharpVX;
            var sharpVXL = sharpVX;
            while (sharpVY >= 2) {
                sharpVY = sharpVY - 4;
                sharpVXR = sharpVXR + 4;
                sharpVXL = sharpVXL - 4;

                this.setWalkableAt(sharpVXR, sharpVY, true);
                this.setWalkableAt(sharpVXR, sharpVY + 1, true);
                this.setWalkableAt(sharpVXR + 1, sharpVY, true);
                this.setWalkableAt(sharpVXR + 1, sharpVY + 1, true);

                this.setWalkableAt(sharpVXL, sharpVY, true);
                this.setWalkableAt(sharpVXL + 1, sharpVY, true);
                this.setWalkableAt(sharpVXL, sharpVY + 1, true);
                this.setWalkableAt(sharpVXL + 1, sharpVY + 1, true);
            };
        },

        setWalkableAt: function (gridX, gridY, walkable) {
            Grid.setWalkableAt(this.grid, gridX, gridY, walkable);
            View.setAttributeAt(this.grid, gridX, gridY, 'walkable', walkable);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            oView.bindElement({
                path: "/OutboundAnalysis",
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function (oEvent) {
                        oView.setBusy(true);
                    },
                    dataReceived: function (oEvent) {
                        oView.setBusy(false);
                    }
                }
            });

        },

        _onBindingChange: function (oEvent) {
            // No data for the binding
            if (!this.getView().getBindingContext()) {
                this.getRouter().getTargets().display("notFound");
            }
        },

        onShowResume: function (oEvent) {
            var oCtx = this.getView().getBindingContext();

            this.getRouter().navTo("planningProduct", {
                planningId: oCtx.getProperty("PlanningId")
            });
        },

        clearFootprints: function () {
            View.clearFootprints();
            View.clearPath();
        },
        clearAll: function () {
            this.clearFootprints();
            View.clearBlockedNodes();
        }
    });

});