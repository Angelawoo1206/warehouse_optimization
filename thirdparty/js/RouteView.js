sap.ui.define([
], function () {
    "use strict";
    /**
     * The pathfinding visualization.
     * It uses raphael.js to show the grids.
     */
    var View = {};
    var nodeSize = 12; // width and height of a single node, in pixel
    var nodeStyle = {
            normal: {
                fill: 'white',
                'stroke-opacity': 0.2, // the border
            },
            blocked: {
                fill: 'grey',
                'stroke-opacity': 0.2,
            },
            start: {
                fill: '#0d0',
                'stroke-opacity': 0.2,
            },
            end: {
                fill: '#e40',
                'stroke-opacity': 0.2,
            },
            opened: {
                fill: '#98fb98',
                'stroke-opacity': 0.2,
            },
            closed: {
                fill: '#afeeee',
                'stroke-opacity': 0.2,
            },
            failed: {
                fill: '#ff8888',
                'stroke-opacity': 0.2,
            },
            tested: {
                fill: '#e5e5e5',
                'stroke-opacity': 0.2,
            },
        },
        nodeColorizeEffect = {
            duration: 50,
        },
        nodeZoomEffect = {
            duration: 200,
            transform: 's1.2', // scale by 1.2x
            transformBack: 's1.0',
        },
        pathStyle = {
            stroke: 'yellow',
            'stroke-width': 3,
        },
        supportedOperations = ['opened', 'closed', 'tested'];
    View.init = function (opts) {
        this.numCols = opts.numCols;
        this.numRows = opts.numRows;
        this.paper = Raphael(opts.draw_area);
        //this.$stats       = $('#stats');
    };
    /**
     * Generate the grid asynchronously.
     * This method will be a very expensive task.
     * Therefore, in order to not to block the rendering of browser ui,
     * I decomposed the task into smaller ones. Each will only generate a row.
     */
    View.generateGrid = function (callback) {
        var i, j, x, y,
            rect,
            normalStyle,
            createRowTask, sleep, tasks,
            normalStyle = nodeStyle.normal,
            numCols = this.numCols,
            numRows = this.numRows,
            paper = this.paper,
            rects = rects = [];
        //$stats      = this.$stats;

        paper.setSize(numCols * nodeSize, numRows * nodeSize);

        createRowTask = function (rowId) {
            return function (done) {
                rects[rowId] = [];
                for (j = 0; j < numCols; ++j) {
                    x = j * nodeSize;
                    y = rowId * nodeSize;

                    rect = paper.rect(x, y, nodeSize, nodeSize);
                    rect.attr(normalStyle);
                    rects[rowId].push(rect);
                }
                done(null);
            };
        };

        sleep = function (done) {
            setTimeout(function () {
                done(null);
            }, 0);
        };

        tasks = [];
        for (i = 0; i < numRows; ++i) {
            tasks.push(createRowTask(i));
            tasks.push(sleep);
        }

        async.series(tasks, function () {
            if (callback) {
                callback();
            }
        });
    };
    View.setStartPos = function (gridX, gridY) {
        var coord = View.toPageCoordinate(gridX, gridY);
        if (!this.startNode) {
            this.startNode = this.paper.rect(
                    coord[0],
                    coord[1],
                    nodeSize,
                    nodeSize
                ).attr(nodeStyle.normal)
                .animate(nodeStyle.start, 1000);
        } else {
            this.startNode.attr({
                x: coord[0],
                y: coord[1]
            }).toFront();
        }
    };
    View.setFishboneLayout = function (gridX, gridY) {
        var coord = View.toPageCoordinate(gridX, gridY);
        if (!this.startNode) {
            this.startNode = this.paper.rect(
                    coord[0],
                    coord[1],
                    nodeSize,
                    nodeSize
                ).attr(nodeStyle.normal)
                .animate(nodeStyle.blocked, 1000);
        } else {
            this.startNode.attr({
                x: coord[0],
                y: coord[1]
            }).toFront();
        }
    };
    View.setEndPos = function (gridX, gridY) {
        var coord = View.toPageCoordinate(gridX, gridY);
        if (!this.endNode) {
            this.endNode = this.paper.rect(
                    coord[0],
                    coord[1],
                    nodeSize,
                    nodeSize
                ).attr(nodeStyle.normal)
                .animate(nodeStyle.end, 1000);
        } else {
            this.endNode.attr({
                x: coord[0],
                y: coord[1]
            }).toFront();
        }
    };
    /**
     * Set the attribute of the node at the given coordinate.
     */
    View.setAttributeAt = function (nodes, gridX, gridY, attr, value) {
        var color;
        switch (attr) {
        case 'walkable':
            color = value ? nodeStyle.normal.fill : nodeStyle.blocked.fill;
            this.setWalkableAt(nodes, gridX, gridY, value);
            break;
        case 'opened':
            this.colorizeNode(this.rects[gridY][gridX], nodeStyle.opened.fill);
            this.setCoordDirty(gridX, gridY, true);
            break;
        case 'closed':
            this.colorizeNode(this.rects[gridY][gridX], nodeStyle.closed.fill);
            this.setCoordDirty(gridX, gridY, true);
            break;
        case 'tested':
            color = (value === true) ? nodeStyle.tested.fill : nodeStyle.normal.fill;

            this.colorizeNode(this.rects[gridY][gridX], color);
            this.setCoordDirty(gridX, gridY, true);
            break;
        case 'parent':
            // XXX: Maybe draw a line from this node to its parent?
            // This would be expensive.
            break;
        default:
            console.error('unsupported operation: ' + attr + ':' + value);
            return;
        }
    };
    View.colorizeNode = function (node, color) {
        node.animate({
            fill: color
        }, nodeColorizeEffect.duration);
    };
    View.zoomNode = function (node) {
        node.toFront().attr({
            transform: this.nodeZoomEffect.transform,
        }).animate({
            transform: this.nodeZoomEffect.transformBack,
        }, this.nodeZoomEffect.duration);
    };
    View.setWalkableAt = function (nodes, gridX, gridY, value) {
        var node, i;
        var blockedNodes = new Array();
        for (var j = 0; j < 36; j++) {
            blockedNodes[j] = new Array();
        }
        if (!blockedNodes) {
            blockedNodes = this.blockedNodes = new Array(this.numRows);
            for (i = 0; i < this.numRows; ++i) {
                blockedNodes[i] = [];
            }
        }
        node = blockedNodes[gridY][gridX];
        if (value) {
            // clear blocked node
            if (node) {
                this.colorizeNode(node, this.rects[gridY][gridX].attr('fill'));
                this.zoomNode(node);
                setTimeout(function () {
                    node.remove();
                }, this.nodeZoomEffect.duration);
                blockedNodes[gridY][gridX] = null;
            }
        } else {
            // draw blocked node
            if (node) {
                return;
            }
            node = blockedNodes[gridY][gridX] = nodes.nodes[gridY][gridX];
            this.setBlockedNodePos(gridX, gridY);
            //this.colorizeNode(node, nodeStyle.blocked.fill);
            //this.zoomNode(node);
        }
    };
    View.setBlockedNodePos = function (gridX, gridY) {
        var coord = View.toPageCoordinate(gridX, gridY);
        var blockedNode = this.paper.rect(
                coord[0],
                coord[1],
                nodeSize,
                nodeSize
            ).attr(nodeStyle.blocked)
            .animate(nodeStyle.blocked, nodeColorizeEffect.duratio);
    };
    View.clearFootprints = function (nodes) {
        var i, x, y, coord, coords = this.getDirtyCoords();
        for (i = 0; i < coords.length; ++i) {
            coord = coords[i];
            x = coord[0];
            y = coord[1];
            this.rects[y][x].attr(this.nodeStyle.normal);
            this.setCoordDirty(x, y, false);
        }
    };
    View.clearBlockedNodes = function () {
        var i, j, blockedNodes = this.blockedNodes;
        if (!blockedNodes) {
            return;
        }
        for (i = 0; i < this.numRows; ++i) {
            for (j = 0; j < this.numCols; ++j) {
                if (blockedNodes[i][j]) {
                    blockedNodes[i][j].remove();
                    blockedNodes[i][j] = null;
                }
            }
        }
    };
    View.drawPath = function (path) {
        if (!path.length) {
            return;
        }
        var svgPath = this.buildSvgPath(path);
        this.path = this.paper.path(svgPath).attr(this.pathStyle);
    };
    /**
     * Given a path, build its SVG represention.
     */
    View.buildSvgPath = function (path) {
        var i, strs = [],
            size = this.nodeSize;

        strs.push('M' + (path[0][0] * size + size / 2) + ' ' +
            (path[0][1] * size + size / 2));
        for (i = 1; i < path.length; ++i) {
            strs.push('L' + (path[i][0] * size + size / 2) + ' ' +
                (path[i][1] * size + size / 2));
        }

        return strs.join('');
    };
    View.clearPath = function () {
        if (this.path) {
            this.path.remove();
        }
    };
    /**
     * Helper function to convert the page coordinate to grid coordinate
     */
    View.toGridCoordinate = function (pageX, pageY) {
        return [
            Math.floor(pageX / this.nodeSize),
            Math.floor(pageY / this.nodeSize)
        ];
    };
    /**
     * helper function to convert the grid coordinate to page coordinate
     */
    View.toPageCoordinate = function (gridX, gridY) {
        return [
            gridX * nodeSize,
            gridY * nodeSize
        ];
    };
    /*View.showStats = function(opts) {
        var texts = [
            'length: ' + Math.round(opts.pathLength * 100) / 100,
            'time: ' + opts.timeSpent + 'ms',
            'operations: ' + opts.operationCount
        ];
        $('#stats').show().html(texts.join('<br>'));
    };*/
    View.setCoordDirty = function (gridX, gridY, isDirty) {
        var x, y,
            numRows = this.numRows,
            numCols = this.numCols,
            coordDirty;

        if (this.coordDirty === undefined) {
            coordDirty = this.coordDirty = [];
            for (y = 0; y < numRows; ++y) {
                coordDirty.push([]);
                for (x = 0; x < numCols; ++x) {
                    coordDirty[y].push(false);
                }
            }
        }

        this.coordDirty[gridY][gridX] = isDirty;
    };
    View.getDirtyCoords = function () {
        var x, y,
            numRows = this.numRows,
            numCols = this.numCols,
            coordDirty = this.coordDirty,
            coords = [];

        if (coordDirty === undefined) {
            return [];
        }

        for (y = 0; y < numRows; ++y) {
            for (x = 0; x < numCols; ++x) {
                if (coordDirty[y][x]) {
                    coords.push([x, y]);
                }
            }
        }
        return coords;
    };
    return View;
}, true);