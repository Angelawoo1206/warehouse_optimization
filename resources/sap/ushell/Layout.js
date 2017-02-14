(function(){"use strict";jQuery.sap.declare("sap.ushell.Layout");var C=function(s){this.init(s);};C.prototype={settings:null,tileWidth:0,tileHeight:0,tileMargin:0,curTouchMatrixCords:null,tilesInRow:null,groupsList:null,item:null,matrix:null,tiles:null,collisionLeft:false,startGroup:null,currentGroup:null,endGroup:null,init:function(s){this.curTouchMatrixCords={column:null,row:null};this.endGroup=null;this.item=null;this.matrix=null;this.tiles=null;this.collisionLeft=false;this.startGroup=null;this.currentGroup=null;this.groupsList=null;this.settings=this.settings||s;jQuery.extend(this,this.settings);this.tileWidth=this.thisLayout.styleInfo.tileWidth;this.tileHeight=this.thisLayout.styleInfo.tileHeight;this.tileMargin=this.thisLayout.styleInfo.tileMarginWidth;this.aExcludedControlClass=this.aExcludedControlClass||[];this.reorderElementsCallback=this.reorderElementsCallback||function(){};this.rightToLeft=sap.ui.getCore().getConfiguration().getRTL();},moveDraggable:function(m,a){var i=this.detectCollision(m,a);if(i){this.changePlaceholder();}},changePlaceholder:function(){var c=this.currentGroup;var t=(this.endGroup!==this.currentGroup);if(t){var a=this.thisLayout.getGroupTiles(this.currentGroup);if(this.currentGroup===this.startGroup){a=a.slice(0);a.splice(a.indexOf(this.item),1);}this.tiles=this.thisLayout.getGroupTiles(this.endGroup).slice(0);if(this.startGroup===this.endGroup){this.tiles.splice(this.tiles.indexOf(this.item),1);}this.matrix=this.thisLayout.organizeGroup(this.tiles);this.endGroup.getInnerContainerDomRef().appendChild(this.item.getDomRef());this.currentGroup=this.endGroup;if(this.thisLayout.isAnimationsEnabled()){this.thisLayout.initGroupDragMode(this.endGroup);var b=this.thisLayout.organizeGroup(a);this.thisLayout.renderLayoutGroup(c,b);}}this.removeExcludedElementsFromMatrix(this.aExcludedControlClass);var d=this.tiles||this.thisLayout.getGroupTiles(this.endGroup).slice(0);var n;if(this.matrix[this.curTouchMatrixCords.row]&&typeof this.matrix[this.curTouchMatrixCords.row][this.curTouchMatrixCords.column]=="object"){var r=this.matrix[this.curTouchMatrixCords.row][this.curTouchMatrixCords.column];var e=d.indexOf(r);var f=d.indexOf(this.item);if(this.rightToLeft){this.collisionLeft=!this.collisionLeft;}if(f>-1&&f<e){r=d[e+1];}if(r===this.item){if(t){this.reorderElementsCallback({currentGroup:c,endGroup:this.endGroup,tiles:this.tiles,item:this.item});this.reorderTilesView(d,this.endGroup);this.reorderTilesInDom();if(this.thisLayout.isAnimationsEnabled()){this.thisLayout.renderLayoutGroup(this.endGroup,this.matrix);}}return;}n=this.changeTilesOrder(this.item,r,d,this.matrix);if(n){this.reorderElementsCallback({currentGroup:c,endGroup:this.endGroup,tiles:this.tiles,item:this.item});this.reorderTilesView(n,this.endGroup);this.reorderTilesInDom();if(this.thisLayout.isAnimationsEnabled()){this.thisLayout.renderLayoutGroup(this.endGroup,this.matrix);}}return;}var m=this.findTileToPlaceAfter(this.matrix,d);if(d[m+1]==this.item){return;}if(d[m+1]){r=d[m+1];}else if(this.currentGroup.getShowPlaceholder()){r=d[0];}n=this.changeTilesOrder(this.item,r,d,this.matrix);if(n){this.reorderElementsCallback({currentGroup:c,endGroup:this.endGroup,tiles:this.tiles,item:this.item});this.reorderTilesView(n,this.endGroup);this.reorderTilesInDom();if(this.thisLayout.isAnimationsEnabled()){this.thisLayout.renderLayoutGroup(this.endGroup,this.matrix);}}},reorderTilesInDom:function(){var j=this.item.getDomRef(),s=jQuery(j).index(),a=jQuery(j).closest(".sapUshellTilesContainer-sortable"),d=this.calcDestIndexInGroup(),b=jQuery(this.endGroup.getDomRef()).find(".sapUshellTilesContainer-sortable"),c=b.find(".sapUshellTile");a.find(c[s]).remove();c=b.find(".sapUshellTile");b[0].insertBefore(j,c[d]);},calcDestIndexInGroup:function(){var l,t=0,i,j,I=false;for(i=0;i<this.matrix.length&&!I;i++){for(j=0;j<this.matrix[i].length;j++){if(this.matrix[i][j]!=undefined){if(this.item.sId!==this.matrix[i][j].sId){if(l!==this.matrix[i][j].sId){l=this.matrix[i][j].sId;t++;}}else{I=true;break;}}}}return t;},layoutStartCallback:function(e){this.init();this.item=sap.ui.getCore().byId(e.id);this.tilesInRow=this.thisLayout.getTilesInRow();this.groupsList=this.thisLayout.getGroups();this.startGroup=this.currentGroup=this.item.getParent();},layoutEndCallback:function(){if(!this.tiles){return{tile:this.item};}var r={srcGroup:this.startGroup,dstGroup:this.endGroup,tile:this.item,dstTileIndex:this.tiles.indexOf(this.item),tileMovedFlag:true};return r;},compareArrays:function(a,b){if(a.length!==b.length){return false;}for(var i=0;i<a.length;i++){if(a[i]!==b[i]){return false;}}return true;},reorderTilesView:function(t,g){this.tiles=t;this.matrix=this.thisLayout.organizeGroup(t);},changeTilesOrder:function(i,r,t,m){var n=t.slice(0);var d=n.indexOf(i);if(d>-1){n.splice(d,1);}if(r){n.splice(n.indexOf(r),0,this.item);}else{n.push(i);}if(this.currentGroup==this.endGroup){if(this.compareArrays(t,n)){return false;}var a=this.thisLayout.organizeGroup(n);var c=this.thisLayout.getTilePositionInMatrix(i,m);var b=this.thisLayout.getTilePositionInMatrix(i,a);if((c.row==b.row)&&(c.col==b.col)){return false;}}this.tiles=n;this.currentGroup=this.endGroup;return n;},setMatrix:function(n){this.matrix=n;},findTileToPlaceAfter:function(c,t){var x=(this.thisLayout.rightToLeft)?0:this.curTouchMatrixCords.column,I=(this.thisLayout.rightToLeft)?1:-1,m=0,r=c[0].length;for(var i=this.curTouchMatrixCords.row;i>=0;i--){for(var j=x;j>=0&&j<r;j+=I){if(!c[i]||typeof c[i][j]!="object"){continue;}var a=t.indexOf(c[i][j]);m=a>m?a:m;}x=c[0].length-1;}return m||(t.length-1);},detectCollision:function(m,a){var r,b,c,d=false;for(var i=0;i<this.groupsList.length;i++){var e=this.groupsList[i].getInnerContainerDomRef();r=e.getBoundingClientRect();b=!(r.right<m||r.left>m);c=!(r.bottom<a||r.top>a);if(b&&c){d=this.groupsList[i];break;}}var f=jQuery.extend({},this.curTouchMatrixCords);if(!d||d.getIsGroupLocked()){return false;}if(d){this.matrix=this.matrix||this.thisLayout.organizeGroup(this.thisLayout.getGroupTiles(d));var o=this.rightToLeft?(r.right+(-1)*m):(r.left*(-1)+m),g=(r.top*(-1)+a)/(this.tileHeight+this.tileMargin),h=o/(this.tileWidth+this.tileMargin);f={row:Math.floor(g),column:Math.floor(h)};}if((d===this.endGroup)&&(f.column===this.curTouchMatrixCords.column)&&(f.row===this.curTouchMatrixCords.row)){return false;}if(sap.ui.getCore().getConfiguration().getRTL()){this.collisionLeft=(this.curTouchMatrixCords.column-f.column)>0;}else{this.collisionLeft=(f.column-this.curTouchMatrixCords.column)>0;}if(f.column===this.curTouchMatrixCords.column){this.collisionLeft=false;}jQuery.extend(this.curTouchMatrixCords,f);this.endGroup=d;return true;},removeExcludedElementsFromMatrix:function(e){if(!e.length){return;}var n=this.matrix.map(function(r){return r.map(function(i){var a=e.some(function(c){return i instanceof c;});return(a)?undefined:i;});});this.setMatrix(n);},setExcludedControl:function(c){if(c){this.aExcludedControlClass.push(c);}},setReorderTilesCallback:function(f){if(typeof f==="function"){this.reorderElementsCallback=f;}}};var L=function(){};L.prototype={_initDeferred:jQuery.Deferred(),init:function(c){var t=function(){var s=this.getStyleInfo(this.container);if(s.tileWidth>0){this.isInited=true;this.reRenderGroupsLayout();this.layoutEngine=new C({thisLayout:this});this._initDeferred.resolve();return;}setTimeout(t,100);}.bind(this);this.cfg=c||this.cfg;this.cfg.animationsEnabled=!!this.cfg.animationsEnabled;this.minTilesinRow=2;this.container=this.cfg.container||document.getElementById('dashboardGroups');t();return this.getInitPromise();},getInitPromise:function(){return this._initDeferred.promise();},isAnimationsEnabled:function(){return this.cfg.animationsEnabled;},getLayoutEngine:function(){return this.layoutEngine;},getStyleInfo:function(c){var t=document.createElement('div'),a=c.getAttribute('id');c=a?document.getElementById(a):c;t.className="sapUshellTile";t.setAttribute('style','position: absolute; visibility: hidden;');c.appendChild(t);var b=window.getComputedStyle(t);var i={"tileMarginHeight":parseFloat(b.marginBottom,10)+parseFloat(b.marginTop,10),"tileMarginWidth":parseFloat(b.marginLeft,10)+parseFloat(b.marginRight,10),"tileWidth":t.offsetWidth,"tileHeight":t.offsetHeight,"containerWidth":c.offsetWidth-(c.style.marginLeft?parseFloat(c.style.marginLeft,10):0)};t.parentNode.removeChild(t);return i;},getGroups:function(){return this.cfg.getGroups();},getTilesInRow:function(i){return this.tilesInRow;},setTilesInRow:function(t){this.tilesInRow=t;},checkPlaceForTile:function(t,m,a,l,i){if(typeof m[a.y]==="undefined"){m.push(new Array(m[0].length));}if(typeof m[a.y+1]==="undefined"){m.push(new Array(m[0].length));}if(typeof m[a.y][a.x]!=="undefined"){return false;}var p=jQuery.extend({},a);if(i||!t.getLong()){return[p];}var c=[p];if(t.getLong()){if((a.x+1)>=m[0].length||(typeof m[p.y][p.x+1]!=="undefined")){return false;}c.push({y:p.y,x:p.x+1});}return c;},placeTile:function(t,m,c){for(var i=0;i<c.length;i++){m[c[i].y][c[i].x]=t;}},getTilePositionInMatrix:function(t,m){for(var r=0;r<m.length;r++){for(var c=0;c<m[0].length;c++){if(m[r][c]==t){return{row:r,col:c};}}}return false;},fillRowsInLine:function(m,t,s,e,I){if(!t.length){return 0;}var p=[],c,i;var a=e||s;for(i=s;i<=a&&t.length;i++){for(var j=0;j<m[0].length&&t.length;j++){c=this.checkPlaceForTile(t[0],m,{x:j,y:i},e,I);if(c){this.placeTile(t[0],m,c);p.push(t.shift());}}}var b=1,h=1;for(i=0;i<p.length;i++){b=h>b?h:b;}return b;},organizeGroup:function(t,I){var a=t.slice(0);var b=[];var c=0;b.push(new Array(I?Math.floor(this.tilesInRow/2):this.tilesInRow));while(a.length){var l=this.fillRowsInLine(b,a,c,undefined,I);c++;if(l<=1){continue;}this.fillRowsInLine(b,a,c,c+l-2);c+=(l-1)||1;}if(this.rightToLeft){for(var i=0;i<b.length;i++){b[i].reverse();}}b=this.cleanRows(b);return b;},cleanRows:function(t){var d=false;for(var r=t.length-1;r>0&&!d;r--){for(var c=0;c<t[r].length&&!d;c++){if(typeof t[r][c]==="object"){d=true;}}if(!d){t.pop();}}return t;},setGroupsLayout:function(g,m){var i;if(this.cfg.isLockedGroupsCompactLayoutEnabled&&g.getIsGroupLocked()&&m.length>0){var p=g.getDomRef().parentElement;if(this.cfg.isLockedGroupsCompactLayoutEnabled()){var t=m[0].length;if(this.rightToLeft){for(i=m[0].length-1;i>=0;i--){if(!m[0][i]){t=(m[0].length-1)-i;break;}}}else{for(i=0;i<m[0].length;i++){if(!m[0][i]){t=i;break;}}}var c=t>0?t*(this.styleInfo.tileWidth+this.styleInfo.tileMarginWidth)+this.styleInfo.tileMarginWidth:0;g.getDomRef().style.width="auto";p.style.width=c+"px";p.style.display="inline-block";}else{g.getDomRef().style.width="";p.style.width="";p.style.display="";}}},calcTilesInRow:function(c,t,a){var b=Math.floor(c/(t+a));b=(b<this.minTilesinRow?this.minTilesinRow:b);return b;},getGroupTiles:function(g){var t=g.getTiles();if(g.getShowPlaceholder()){t.push(g.oPlusTile);}return t;},reRenderGroupsLayout:function(g){if(!this.isInited){return;}var s=this.getStyleInfo(this.container);if(!s.tileWidth){return;}this.styleInfo=s;this.tilesInRow=this.calcTilesInRow(s.containerWidth,s.tileWidth,s.tileMarginWidth);g=g||this.getGroups();for(var i=0;i<g.length;i++){var t=this.getGroupTiles(g[i]);var a=this.organizeGroup(t);this.setGroupsLayout(g[i],a);}},initDragMode:function(){this.initGroupDragMode(this.layoutEngine.currentGroup);},endDragMode:function(){var g=this.getGroups();for(var i=0;i<g.length;i++){var a=g[i].$();if(!a.hasClass("sapUshellInDragMode")){continue;}a.removeClass("sapUshellInDragMode sapUshellEnableTransition");var t=this.getGroupTiles(g[i]);for(var j=0;j<t.length;j++){t[j].$().removeAttr("style");}a.find('.sapUshellInner').removeAttr("style");}},initGroupDragMode:function(g){if(g.$().hasClass("sapUshellInDragMode")){return;}var t=this.getGroupTiles(g);var a=this.organizeGroup(t);g.$().addClass("sapUshellInDragMode");this.renderLayoutGroup(g,a);setTimeout(function(){g.$().addClass("sapUshellEnableTransition");});},calcTranslate:function(r,c){var t=c*(this.styleInfo.tileWidth+this.styleInfo.tileMarginWidth);var a=r*(this.styleInfo.tileHeight+this.styleInfo.tileMarginHeight);if(this.layoutEngine.rightToLeft){t=-t;}return{x:t,y:a};},renderLayoutGroup:function(g,a){var h=a.length*(this.styleInfo.tileHeight+this.styleInfo.tileMarginHeight);g.$().find('.sapUshellInner').height(h);var c;for(var i=0;i<a.length;i++){for(var j=0;j<a[i].length;j++){if(c==a[i][j]){continue;}else{c=a[i][j];}if(typeof c=="undefined"){break;}var t=this.calcTranslate(i,j);var b="translate("+t.x+"px,"+t.y+"px) translatez(0)";a[i][j].getDomRef().style.transform=b;}}}};sap.ushell.Layout=new L();})();
