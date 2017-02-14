sap.ui.define([], function() {
    "user strict";
    var Node = {};
    Node.Node = function(x, y, walkable) {
        /**
         * The x coordinate of the node on the grid.
         * @type number
         */
        this.x = x;
        /**
         * The y coordinate of the node on the grid.
         * @type number
         */
        this.y = y;
        /**
         * Whether this node can be walked through.
         * @type boolean
         */
        this.walkable = (walkable === undefined ? true : walkable);
        return this;

    };
    return Node;
 }, true);
