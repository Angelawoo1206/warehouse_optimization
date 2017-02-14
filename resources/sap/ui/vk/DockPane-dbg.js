sap.ui.define([
	"jquery.sap.global", "./library", "sap/ui/core/Control", "./DockContainer"
], function(jQuery, library, Control, DockContainer) {
	var DockPane = Control.extend("sap.ui.vk.DockPane", {
		metadata: {
			library: "sap.ui.vk",
			publicMethods: [
				"getDomElement",
				"setMinimumWidth",
				"getMinimumWidth",
				"setMinimumHeight",
				"getMinimumHeight",
				"setMinimumSize",
				"close",
				"resize",
				"update",
				"addTab",
				"removeTab",
				"bringTabToFront"
			],
			
			properties: {
				/**
				 * Width of the Viewer control
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "auto"
				},
				/**
				 * Height of the Viewer control
				 */
				height: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "auto"
				}
			},
			
			events: {
				size: {
					parameters: {
						newSize: {
							type: "object"
						}
					}
				},
				
				close: {
				}
			},
			aggregations : {

				/**
				 * Child Controls within the layout.
				 */
				content : {type : "sap.ui.core.Control", multiple : false, singularName : "content"}
			}
		},
		
		constructor: function(dm, x, y, w, h, title, fixed) {
			Control.apply(this);
			
			if (typeof DockPane._counter == 'undefined') {
				DockPane._counter = 0;
			}
			this._id = "DockPane_" + DockPane._counter;
			DockPane._counter++;

			var elem = document.createElement("div");
			elem.setAttribute("id", this._id);
			elem.style.position = "absolute";
			elem.style.left = x + "px";
			elem.style.top = y + "px";
			elem.style.width = w + "px";
			elem.style.height = h + "px";
			elem.style.backgroundColor = "darkgrey";
			elem.style.zIndex = 50;
			elem.style.overflow = "hidden";
			
			this._elem = elem;
			this._manager = dm;
			this._parent = null;
			this._movable = (fixed === undefined || fixed == false) ? true : false;
			this._minWidth = 64;
			this._minHeight = 64;
			this._width = w;
			this._height = h;
			this._resizable = true;
			
			this._text = (title != null) ? title : ("" + this._id);
			
			this._tabs = [];
			this._activeTab = this;
			this._tabParent = null;
			this._telem = [];
			this._tcontent = [];
			
			this._hasBorder = false;
			this._hasTabs = false;
			
			if (this._movable) {
				var title = document.createElement("div");
				title.setAttribute("id", this._id + "_title");
				title.style.position = "absolute";
				title.style.left = 0;
				title.style.top = 0;
				title.style.width = "100%";
				title.style.height = "25px";
				title.style.boxSizing = "border-box";
				title.style.padding = "3px 4px";
				title.style.backgroundColor = "black";
				title.style.color = "white";
				title.style.cursor = "default";
				title.style.userSelect = "none";
				title.style.overflow = "hidden";
				title.innerHTML = this._text;
				elem.appendChild(title);
				this._title = title;
				
				var btnClose = document.createElement("div");
				btnClose.setAttribute("id", this._id + "_close");
				btnClose.style.position = "absolute";
				btnClose.style.right = "4px";
				btnClose.style.top = "4px";
				btnClose.style.width = "18px";
				btnClose.style.height = "18px";
				btnClose.style.backgroundColor = "red";
				btnClose.style.opacity = 0.5;
				btnClose.style.textAlign = "center";
				btnClose.innerHTML = "X";
				this._title.appendChild(btnClose);
				this._btnClose = btnClose;
				
				var border = document.createElement("div");
				border.setAttribute("id", this._id + "_border");
				border.style.position = "absolute";
				border.style.left = 0;
				border.style.top = 0;
				border.style.width = "100%";
				border.style.height = "100%";
				border.style.boxSizing = "border-box";
				border.style.zIndex = 10;
				border.style.pointerEvents = "none";
				this._border = border;
				
				// Border resize regions
				var b_t = document.createElement("div");
				b_t.style.position = "absolute";
				b_t.style.left = "8px";
				b_t.style.top = 0;
				b_t.style.right = "8px";
				b_t.style.height = "8px";
				b_t.style.cursor = "ns-resize";
				border.appendChild(b_t);
				
				var b_b = document.createElement("div");
				b_b.style.position = "absolute";
				b_b.style.left = "8px";
				b_b.style.bottom = 0;
				b_b.style.right = "8px";
				b_b.style.height = "8px";
				b_b.style.cursor = "ns-resize";
				border.appendChild(b_b);
				
				var b_l = document.createElement("div");
				b_l.style.position = "absolute";
				b_l.style.left = 0;
				b_l.style.top = "8px";
				b_l.style.width = "8px";
				b_l.style.bottom = "8px";
				b_l.style.cursor = "ew-resize";
				border.appendChild(b_l);
				
				var b_r = document.createElement("div");
				b_r.style.position = "absolute";
				b_r.style.right = 0;
				b_r.style.top = "8px";
				b_r.style.width = "8px";
				b_r.style.bottom = "8px";
				b_r.style.cursor = "ew-resize";
				border.appendChild(b_r);
				
				var b_tl = document.createElement("div");
				b_tl.style.position = "absolute";
				b_tl.style.left = 0;
				b_tl.style.top = 0;
				b_tl.style.width = "8px";
				b_tl.style.height = "8px";
				b_tl.style.cursor = "nwse-resize";
				border.appendChild(b_tl);
				
				var b_tr = document.createElement("div");
				b_tr.style.position = "absolute";
				b_tr.style.right = 0;
				b_tr.style.top = 0;
				b_tr.style.width = "8px";
				b_tr.style.height = "8px";
				b_tr.style.cursor = "nesw-resize";
				border.appendChild(b_tr);

				var b_bl = document.createElement("div");
				b_bl.style.position = "absolute";
				b_bl.style.left = 0;
				b_bl.style.bottom = 0;
				b_bl.style.width = "8px";
				b_bl.style.height = "8px";
				b_bl.style.cursor = "nesw-resize";
				border.appendChild(b_bl);
				
				var b_br = document.createElement("div");
				b_br.style.position = "absolute";
				b_br.style.right = 0;
				b_br.style.bottom = 0;
				b_br.style.width = "8px";
				b_br.style.height = "8px";
				b_br.style.cursor = "nwse-resize";
				border.appendChild(b_br);
			}
			
			var tabBox = document.createElement("div");
			tabBox.setAttribute("id", this._id + "_tabbox");
			tabBox.style.position = "absolute";
			tabBox.style.left = 0;
			tabBox.style.right = 0;
			tabBox.style.bottom = 0;
			tabBox.style.height = "24px";
			tabBox.style.overflow = "hidden";
			this._tabBox = tabBox;
			
			var content = document.createElement("div");
			content.setAttribute("id", this._id + "_content");
			content.style.position = "absolute";
			content.style.left = 0;
			content.style.top = this._movable ? "25px" : "0";
			content.style.right = 0;
			content.style.bottom = 0;
			content.style.boxSizing = "border-box";
			content.style.backgroundColor = this._movable ? "lightgrey" : "grey";
			content.style.border = "1px solid darkgrey";
			content.style.overflow = "hidden";
			//content.innerHTML = "Content: " + this._id;
			elem.appendChild(content);
			this._content = content;
			
			this.update();
			dm.addDockPane(this);
		}
	});
	
	DockPane.prototype.setContent = function(content) {
		this.setAggregation("content", content);
		this.renderContent();
	};
	
	DockPane.prototype.renderContent = function() {
		if (this._manager.isRendered()) {
			var content = this.getAggregation("content");
			if (content != null) {
				sap.ui.getCore().getRenderManager().render(content, this._content);				
			}
		}
	};
	
	DockPane.prototype.destroy = function() {
		this._manager.removeDockPane(this);
	};
	
	DockPane.prototype.getDomElement = function() {
		return this._elem;
	};
	
	DockPane.prototype.setMinimumWidth = function(w) {
		this._minWidth = w;
		if (this._parent != null) {
			this._parent.update();
		} else {
			this.update();
		}
	};
	
	DockPane.prototype.getMinimumWidth = function() {
		return this._minWidth;
	};
	
	DockPane.prototype.setMinimumHeight = function(h) {
		this._minHeight = h;
		if (this._parent != null) {
			this._parent.update();
		} else {
			this.update();
		}
	};
	
	DockPane.prototype.getMinimumHeight = function() {
		return this._minHeight;
	};
	
	DockPane.prototype.setMinimumSize = function(w, h) {
		this._minWidth = w;
		this._minHeight = h;
		if (this._parent != null) {
			this._parent.update();
		} else {
			this.update();
		}
	};
	
	DockPane.prototype.close = function() {
		if (this._parent != null) {
			this._manager.undock(this);
		}
		this._manager.removeDockPane(this);
	};
	
	DockPane.prototype._saveSize = function() {
		this._floatW = this._elem.offsetWidth;
		this._floatH = this._elem.offsetHeight;
	};
	
	DockPane.prototype._restoreSize = function() {
		this.resize(this._floatW, this._floatH);
	};
	
	DockPane.prototype.resize = function(w, h) {
		this._elem.style.width = w + "px";
		this._elem.style.height = h + "px";
		this._updateTabs(w);
	};
	
	DockPane.prototype.update = function() {
		// Shadow and border
		if (this._parent == null) {
			this._elem.style.boxShadow = "2px 6px 20px 3px rgba(0,0,0,0.5)";
			this._elem.style.borderTopLeftRadius = "6px";
			this._elem.style.borderTopRightRadius = "6px";		
			if (this._border != null && !this._hasBorder) {
				this._elem.appendChild(this._border);
				this._hasBorder = true;
			}
		} else {
			this._elem.style.boxShadow = "";
			this._elem.style.borderRadius = "0";
			if (this._border != null && this._hasBorder) {
				this._elem.removeChild(this._border);
				this._hasBorder = false;
			}
		}
		
		// Tab area
		if (this._tcontent.length > 0) {
			this._content.style.bottom = "24px";
			this._content.style.borderBottom = "0";
			for (var i = 0; i < this._tcontent.length; i++) {
				var tcontent = this._tcontent[i];
				tcontent.style.bottom = "24px";
				tcontent.style.borderBottom = "0";
			}
		} else {
			this._content.style.bottom = 0;
			this._content.style.borderBottom = "1px solid darkgrey";
		}
		
		this._updateTabs();
	};
	
	DockPane.prototype._updateTabs = function(_w) {
		if (this._tabs.length > 0) {
			if (!this._hasTabs) {
				this._hasTabs = true;
				this._elem.appendChild(this._tabBox);
			}
			
			var count = this._telem.length;
			var w = 0;
			if (_w == undefined) {
				_w = this._tabBox.offsetWidth;
			}
			
			// Update tab buttons layout and style
			var tabw = (_w - 2) / count;
			for (var i = 0; i < count; i++) {
				var elem = this._telem[i];
				var active = ((i == 0 && this._activeTab == this) ||
							(i > 0 && this._activeTab == this._tabs[i - 1]));
				elem.style.position = "absolute";
				elem.style.left = w + "px";
				elem.style.top = 0;
				if (i == count - 1) {
					tabw = this._tabBox.offsetWidth - w;
				}
				elem.style.width = tabw + "px";
				elem.style.height = "24px";
				elem.style.boxSizing = "border-box";
				elem.style.overflow = "hidden";
				elem.style.padding = "0 4px";
				elem.style.backgroundColor = active ? "lightgrey" : "darkgrey";
				elem.style.border = "1px solid grey";
				elem.style.fontWeight = active ? "bold" : "normal";
				
				if (active) {
					elem.style.borderTop = "0";
				}
				
				var tcontent = (i == 0) ? this._content : this._tcontent[i - 1];				
				tcontent.style.visibility = (active) ? "visible" : "hidden";
				
				if (active) {
					this._title.innerHTML = elem.innerHTML;
				}
				w += tabw;
			}
		} else if (this._movable) {
			if (this._hasTabs) {
				this._hasTabs = false;
				this._elem.removeChild(this._tabBox);
			}
			this._content.style.visibility = "visible";
			this._title.innerHTML = this._text;
		}
	};
	
	DockPane.prototype.addTab = function(cp) {
		// Create tabbed layout
		if (this._tabs.length == 0) {
			var t1 = document.createElement("div");
			t1.innerHTML = this._text;
			this._tabBox.appendChild(t1);
			this._telem.push(t1);
		} else if (this._tabs.indexOf(cp) >= 0) {
			return;
		}
		
		// Add cp to my tab list
		this._tabs.push(cp);
		var t2 = document.createElement("div");
		t2.innerHTML = cp._text;
		this._tabBox.appendChild(t2);
		this._telem.push(t2);
		this._tcontent.push(cp._content);
		this._activeTab = cp;
		cp._tabParent = this;		
		cp._elem.removeChild(cp._content);
		this._elem.appendChild(cp._content);
		cp._saveSize();
		cp._elem.style.display = "none";
		
		// Migrate cp's tabs to my tab list
		var count = cp._tabs.length;		
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				this._tabs.push(cp._tabs[i]);
				cp._tabBox.removeChild(cp._telem[i + 1]);
				this._tabBox.appendChild(cp._telem[i + 1]);
				this._telem.push(cp._telem[i + 1]);
				this._tcontent.push(cp._tabs[i]._content);
				cp._tabs[i]._tabParent = this;
				cp._elem.removeChild(cp._tabs[i]._content);
				this._elem.appendChild(cp._tabs[i]._content);
			}
			cp._tabs = [];
			cp._tcontent = [];
			cp._telem = [];
		}
		
		this.update();
	};
	
	DockPane.prototype._removeSelfMigrate = function() {
		var count = this._tabs.length;
		if (count > 0) {
			var parent = this._parent;
			var pw = this._elem.offsetWidth, ph = this._elem.offsetHeight;	
			var newParent = this._tabs[0];
			newParent._elem.style.top = this._elem.offsetTop + "px";
			newParent._elem.style.left = this._elem.offsetLeft + "px";
			
			this.removeTab(newParent);
			
			for (var i = 1; i < count; i++) {
				var tab = this._tabs[0];
				this.removeTab(tab);
				newParent.addTab(tab);
			}
			
			// Replace a docked pane with newParent
			if (parent != null) {
				if (parent._left == this) {
					parent._left = newParent;
				} else if (parent._right == this) {
					parent._right = newParent;
				}
				parent._elem.removeChild(this._elem);
				this._manager._elem.appendChild(this._elem);
				this._parent = null;
				this._manager._elem.removeChild(newParent._elem);
				parent._elem.appendChild(newParent._elem);
				newParent._parent = parent;
				newParent._elem.style.width = pw + "px";
				newParent._elem.style.height = ph + "px";
				
				this._restoreSize();
				parent.update();
				newParent.update();
				this.update();
			}
		}
	};
	
	DockPane.prototype.removeTab = function(cp) {
		if (cp == this) {
			this._removeSelfMigrate();
			return;
		}
	
		var index = this._tabs.indexOf(cp);
		if (index >= 0) {
			this._tabBox.removeChild(this._telem[index + 1]);
			this._tabs.splice(index, 1);
			this._telem.splice(index + 1, 1);
			var tcontent = this._tcontent[index];
			tcontent.style.bottom = 0;
			tcontent.style.borderBottom = "1px solid darkgrey";
			cp._elem.appendChild(tcontent);
			cp._tabParent = null;
			this._tcontent.splice(index, 1);
			cp._elem.style.display = "inherit";
			cp._restoreSize();
			
			if (this._tabs.length == 0) {
				this._activeTab = this;
				this._tabBox.removeChild(this._telem[0]);
				this._telem = [];
			} else {
				if (index == 0) {
					this._activeTab = this;
				} else {
					this._activeTab = this._tabs[index - 1];
				}
			}			
			this.update();
		}
	};
	
	DockPane.prototype.bringTabToFront = function(cp) {
		if (cp == this || this._tabs.indexOf(cp) >= 0) {
			this._activeTab = cp;
			this.update();
		}
	};
	
	return DockPane;
}, true);
