sap.ui.define([
	"webapp_2/controller/BaseController",
	"webapp_2/pathfinding/core/Grid",
    "webapp_2/thirdparty/js/View"
], function (BaseController, Grid, View) {
	"use strict";

	return BaseController.extend("sap.m.sample.SemanticPage.SharedBlocks.slotting.SlottingOptimizationBlockController", {

		gridSize: [84, 36], // number of nodes horizontally and vertically

		Controller: StateMachine.create({
		    initial: 'none',
		    events: [
		        {
		            name: 'init',
		            from: 'none',
		            to:   'ready'
		        },
		        {
		            name: 'search',
		            from: 'starting',
		            to:   'searching'
		        },
		        {
		            name: 'pause',
		            from: 'searching',
		            to:   'paused'
		        },
		        {
		            name: 'finish',
		            from: 'searching',
		            to:   'finished'
		        },
		        {
		            name: 'resume',
		            from: 'paused',
		            to:   'searching'
		        },
		        {
		            name: 'cancel',
		            from: 'paused',
		            to:   'ready'
		        },
		        {
		            name: 'modify',
		            from: 'finished',
		            to:   'modified'
		        },
		        {
		            name: 'reset',
		            from: '*',
		            to:   'ready'
		        },
		        {
		            name: 'clear',
		            from: ['finished', 'modified'],
		            to:   'ready'
		        },
		        {
		            name: 'start',
		            from: ['ready', 'modified', 'restarting'],
		            to:   'starting'
		        },
		        {
		            name: 'restart',
		            from: ['searching', 'finished'],
		            to:   'restarting'
		        },
		        {
		            name: 'dragStart',
		            from: ['ready', 'finished'],
		            to:   'draggingStart'
		        },
		        {
		            name: 'dragEnd',
		            from: ['ready', 'finished'],
		            to:   'draggingEnd'
		        },
		        {
		            name: 'drawWall',
		            from: ['ready', 'finished'],
		            to:   'drawingWall'
		        },
		        {
		            name: 'eraseWall',
		            from: ['ready', 'finished'],
		            to:   'erasingWall'
		        },
		        {
		            name: 'rest',
		            from: ['draggingStart', 'draggingEnd', 'drawingWall', 'erasingWall'],
		            to  : 'ready'
		        },
		    ],
		}),

		onInit: function() {
			this.blockedNodes = new Array();
	        for(var j=0;j<36;j++) {
	            this.blockedNodes[j] = new Array();
	        }
		},

		onAfterRendering: function() {
			this.draw();
		},

		draw: function() {
			var numCols = this.gridSize[0],
            numRows = this.gridSize[1];
            this.grid = new Grid.Grid(numCols, numRows);
            var that = this;
	        var draw_area = this.byId("draw_area").sId;
	        if(!View.paper) {
	        	View.init({
		            numCols: numCols,
		            numRows: numRows,
		            draw_area: draw_area
		        });

		        View.generateGrid(function() {
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
	    setDefaultStartEndPos: function() {
	        var width, height,
	            marginRight, availWidth,
	            centerX, centerY,
	            endX, endY,
	            nodeSize = View.nodeSize;

	        width  = View.paper.width;
	        height = View.paper.height;

	        centerX = Math.ceil(width / 2 / 10);
	        centerY = Math.floor(height / 2 / 10);

	        this.setStartPos(centerX + 29, centerY);
	        this.setEndPos(centerX - 30, centerY);
	    },

	    setStartPos: function(gridX, gridY) {
	        this.startX = gridX;
	        this.startY = gridY;
	        View.setStartPos(gridX, gridY);
	    },

	    setEndPos: function(gridX, gridY) {
	        this.endX = gridX;
	        this.endY = gridY;
	        View.setEndPos(gridX, gridY);
	    },

	    setDefaultLayout: function() {
	    	var width, height,
	            marginRight, availWidth,
	            centerX, centerY,
	            endX, endY,
	            nodeSize = View.nodeSize;

	        width  = View.paper.width;
	        height = View.paper.height;

	        centerX = Math.ceil(width / 2 / 10);
	        centerY = Math.floor(height / 2 / 10);
	        this.drawFishboneLayout(centerX, centerY);
	        this.clearAll();
	    },

	    drawTraditionalLayout: function(gridX, gridY) {
	     	var endX = gridX + 29,
	     		startX = gridX - 30,
	     		endY = gridY;
	        for(var i=startX+2; i<=endX-2;i++) {
                for(var j=2;j<=this.endY+8;j++) {
                    if(i%4==0 ||i%4==1) {
                        this.setWalkableAt(i, j, false);
                    }
                }
	        }
	    },
	    drawFlyingVLayout:function(gridX, gridY) {
	        this.drawTraditionalLayout(gridX, gridY);
	        var endX = gridX + 29,
	     		startX = gridX - 30,
	     		endY = gridY;
	        var sharpVX = gridX - 27;
	        var sharpVY = endY - 17;
	        var sharpVXR= sharpVX;
	        var sharpVXL= sharpVX;  
	        this.setWalkableAt(sharpVX, sharpVY, true);
	        for(var i=0; i<26; i++) {
        		if(i%4 === 0) {
	                this.setWalkableAt(sharpVX + i, sharpVY + i, true);
	                this.setWalkableAt(sharpVX + i, sharpVY + i + 1, true);
	                this.setWalkableAt(sharpVX + i + 1, sharpVY + i + 1, true);
	                this.setWalkableAt(sharpVX + i + 1, sharpVY + i + 2, true);
	                sharpVXR = sharpVX + i;
	                sharpVXL = sharpVY + i;
	                this.setWalkableAt(sharpVX - i + 53, sharpVY + i, true);
	                this.setWalkableAt(sharpVX - i + 53, sharpVY + i + 1, true);
	                this.setWalkableAt(sharpVX - i + 52, sharpVY + i + 1, true);
	                this.setWalkableAt(sharpVX - i + 52, sharpVY + i + 2, true);
	        	}
	        }
	    },

	    drawFishboneLayout: function(gridX, gridY) {
	    	var endX = gridX + 29,
	     		startX = gridX - 30,
	     		endY = gridY - 16;
	        var startXZ = 23;
	        var startYZ = 2;
	        for (var i=0; i <= 20; i++) {
	            for (var j=0; j<= 26; j++) {
	                if (j % 4 === 0) {
	                    if (j >= i) {
	                        this.setWalkableAt(startX + i + 2, endY + j + 1, false);
	                        this.setWalkableAt(startX + i + 2, endY + j + 2, false);
	                        this.setWalkableAt(startX + i + 3, endY + j + 2, false);
	                    }
	                }
	            }
	            for (var j=0; j<=i; j++) {
	                if (i % 4 === 0) {
	                    this.setWalkableAt(startX + i + 2, endY + j - 2, false);
	                    this.setWalkableAt(startX + i + 3, endY + j - 2, false);
	                    this.setWalkableAt(startX + i + 3, endY + j - 1, false);
	                }
	            }
	        }
	        for (var i=24; i <= 44; i++) {
	            for (var j=24; j<=68-i; j++) {
	                if (j % 4 === 0) {
	                    this.setWalkableAt(startX + j + 10, endY + i - 26, false);
	                    this.setWalkableAt(startX + j + 10, endY + i - 25, false);
	                    this.setWalkableAt(startX + j + 11, endY + i - 26, false);
	                }
	            }
	        }
	        for (var i=0; i<=25; i++) {
                this.setWalkableAt(startX + 26, endY + i -2, false);
                this.setWalkableAt(startX + 27, endY + i -2, false);
                this.setWalkableAt(startX + 30, endY + i -2, false);
                this.setWalkableAt(startX + 31, endY + i -2, false);
	        }
	        startXZ = startX + 34;
	        startYZ = endY + 22;
	        for (var i=0; i<=5; i++) {
	            this.setWalkableAt(startXZ, startYZ, false);
	            if (i === 0) {
	                this.setWalkableAt(startXZ, startYZ + 4, false);
	                for (var j=1; j<=21; j++) {
	                    this.setWalkableAt(startXZ + j, startYZ, false);
	                    this.setWalkableAt(startXZ + j, startYZ - 1, false);
	                    this.setWalkableAt(startXZ + j, startYZ + 4, false);
	                    this.setWalkableAt(startXZ + j, startYZ + 3, false);
	                }
	            } else {
	                for (var j=1; j<=17; j++) {
	                    if (startXZ + j < 77) {
	                        this.setWalkableAt(startXZ + j, startYZ - 1, false);
	                        this.setWalkableAt(startXZ + j, startYZ, false);
	                    }
	                }
	            }
	            startXZ += 4;
	            startYZ -= 4;
	        }
	    },

	    setWalkableAt: function(gridX, gridY, walkable) {
	    	
	    	Grid.setWalkableAt(this.grid, gridX, gridY, walkable);

	    	if (walkable) {
	    		this.blockedNodes[gridY][gridX] = View.setAttributeAt(this.grid, gridX, gridY, 'walkable', walkable, this.blockedNodes);
	    	} else {
	    		this.blockedNodes[gridY][gridX] = View.setAttributeAt(this.grid, gridX, gridY, 'walkable', walkable);
	    	}
	    },

		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oView.bindElement({
				path : "/OutboundAnalysis",
				events : {
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

		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		onShowResume : function (oEvent) {
			var oCtx = this.getView().getBindingContext();

			this.getRouter().navTo("planningProduct", {
				planningId : oCtx.getProperty("PlanningId")
			});
		},

		clearFootprints: function() {
	        View.clearFootprints();
	        View.clearPath();
	    },
	    clearAll: function() {
	        this.clearFootprints();
	        View.clearBlockedNodes();
	    }
	});

});
