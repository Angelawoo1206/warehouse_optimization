sap.ui.define(["sap/ovp/ui/DashboardLayoutRearrange","sap/ovp/ui/DashboardLayoutModel"],function(R,D){"use strict";var a=16;var M=320;var C=8;var b=function(u){this.aCards=null;this.dashboardLayoutModel=new D(u);this.layoutDomId="";this.oLayoutCtrl={};this.componentDomId="";this.ROW_HEIGHT_PX=16;this.oLayoutData={layoutWidthPx:1680,contentWidthPx:1600,colCount:5,colWidthPx:M,rowHeightPx:a,marginPx:this.convertRemToPx(3)-C};this.lastTriggeredColWidth=0.0;};b.prototype.setLayout=function(l){this.oLayoutCtrl=l;this.layoutDomId=l.getId();this.componentDomId=this.layoutDomId.split("--")[0];};b.prototype.getDashboardLayoutModel=function(){return this.dashboardLayoutModel;};b.prototype.updateCardVisibility=function(c){this.dashboardLayoutModel.updateCardVisibility(c);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);this._setCardsCssValues(this.aCards);this.layoutCards();};b.prototype.updateLayoutData=function(d){if(this.oLayoutData.layoutWidthPx===d){return this.oLayoutData;}var i=this.oLayoutData.marginPx,e=0,s=320,m=1024,c=C,n=d+i;this.oLayoutData.layoutWidthPx=d;if(n<=s){i=this.convertRemToPx(0.5)-c;e=sap.ui.Device.system.desktop?16:0;}else if(n<=m){i=this.convertRemToPx(1)-c;e=sap.ui.Device.system.desktop?8:0;}else{i=this.convertRemToPx(3)-c;}if(i!==this.oLayoutData.marginPx){this.oLayoutData.marginPx=i;jQuery(".sapUshellEasyScanLayout").css({"margin-left":i+"px"});}this.oLayoutData.contentWidthPx=d-i-e;this.oLayoutData.colCount=Math.floor(this.oLayoutData.contentWidthPx/M);if(this.oLayoutData.colCount===0){this.oLayoutData.colCount=1;}this.oLayoutData.colWidthPx=this.oLayoutData.contentWidthPx/this.oLayoutData.colCount;return this.oLayoutData;};b.prototype.getRearrange=function(s){var d={containerSelector:".sapUshellEasyScanLayoutInner",wrapper:".sapUshellEasyScanLayout",draggableSelector:".easyScanLayoutItemWrapper",placeHolderClass:"easyScanLayoutItemWrapper-placeHolder",cloneClass:"easyScanLayoutItemWrapperClone",moveTolerance:10,switchModeDelay:500,isTouch:!sap.ui.Device.system.desktop,debug:false,aCards:this.aCards,layoutUtil:this,rowHeight:this.oLayoutData.rowHeightPx,colWidth:this.oLayoutData.colWidthPx};return new R(jQuery.extend(d,s));};b.prototype.calculateContainerHeight=function(){var c=this.dashboardLayoutModel.iColCount;var m=[];function f(e){return e.dashboardLayout.column===i;}function d(e,g,j){return e.dashboardLayout.row===Math.max.apply(Math,j.map(function(k){return k.dashboardLayout.row;}));}for(var i=1;i<=c;i++){var A=this.aCards.filter(f);if(!!A){var o=A.filter(d)[0];if(!!o){m.push(+(o.dashboardLayout.top.split('px')[0])+ +(o.dashboardLayout.height.split('px')[0]));}}}var h=Math.max.apply(Math,m.map(function(e){return e;}));return h;};b.prototype.resizeLayout=function(w){var B=this.oLayoutData.colCount;var t=false;if(this.oLayoutData.layoutWidthPx!==w){this.updateLayoutData(w);t=Math.abs(this.lastTriggeredColWidth-this.oLayoutData.colWidthPx)>this.convertRemToPx(0.5);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);var i=0;for(i=0;i<this.aCards.length;i++){this.setCardCssValues(this.aCards[i]);var $=jQuery("#"+this.getCardDomId(this.aCards[i].id));$.css({top:this.aCards[i].dashboardLayout.top,left:this.aCards[i].dashboardLayout.left,width:this.aCards[i].dashboardLayout.width,height:this.aCards[i].dashboardLayout.height});if(B!==this.oLayoutData.colCount||t){this._triggerCardResize(this.aCards[i].dashboardLayout,$);}}if(t){this.lastTriggeredColWidth=this.oLayoutData.colWidthPx;}}};b.prototype.buildLayout=function(w){var l={};if(!w){return l;}this.updateLayoutData(w);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);this._setCardsCssValues(this.aCards);l=this.dashboardLayoutModel.extractCurrentLayoutVariant();return l;};b.prototype.getCards=function(c){if(this.aCards&&this.oLayoutData.colCount===c){return this.aCards;}this._setColCount(c);this.aCards=this.dashboardLayoutModel.getCards(c);this._setCardsCssValues(this.aCards);return this.aCards;};b.prototype.resetToManifest=function(){this.aCards=[];this.dashboardLayoutModel.resetToManifest();this.buildLayout(this.oLayoutData.layoutWidthPx);this.layoutCards();};b.prototype.getCardDomId=function(c){return this.layoutDomId+"--"+c;};b.prototype.getCardId=function(c){var d="";if(c){d=c.split("--")[2];}return d;};b.prototype.getCardByPositionPx=function(p){var r=Math.floor(p.top/this.oLayoutData.rowHeightPx)+1;var c=Math.floor(p.left/this.oLayoutData.colWidthPx)+1;var g={row:r,column:c};return this.dashboardLayoutModel.getCardByGridPos(g);};b.prototype.getCardsByArea=function(c,r){var g={};var o=this.getCardByPositionPx(c);var t={};if(r){t.column=Math.round(c.x/this.oLayoutData.colWidthPx);t.row=Math.round(c.y/this.oLayoutData.rowHeightPx);}else{t.column=Math.floor(c.x/this.oLayoutData.colWidthPx)+1;t.row=Math.floor(c.y/this.oLayoutData.rowHeightPx)+1;}if(t.column>1){t.column=1;}if(t.row>1){t.row=1;}if(o){g.x1=o.dashboardLayout.column;g.y1=o.dashboardLayout.row;}else{g.x1=t.column;g.y1=t.row;}g.x2=Math.ceil(c.width/this.oLayoutData.colWidthPx)+g.x1-1;g.y2=Math.ceil(c.height/this.oLayoutData.rowHeightPx)+g.y1-1;var d={cards:this.dashboardLayoutModel.getCardsByGrid(g),upperLeftEdge:this._mapGridToPositionPx({column:g.x1,row:g.y1}),upperLeftGridCell:{column:g.x1,row:g.y1},cardUpperLeft:o,touchPointCell:this._mapGridToPositionPx(t),touchPointGridCell:t};return d;};b.prototype.moveCardToGrid=function(f,g,p){var t=this.dashboardLayoutModel.moveCardToGrid(this.getCardId(f),g,p);if(t.length>0){this._positionCards(t);}this.oLayoutCtrl.fireAfterDragEnds();if(!this.dashboardLayoutModel.validateGrid()){this.dashboardLayoutModel.undoLastChange();}var c=this.calculateContainerHeight();jQuery(".sapUshellEasyScanLayoutInner").css({"height":c+"px","z-index":"1"});};b.prototype.isCardAutoSpan=function(c){return this.dashboardLayoutModel.getCardById(c).dashboardLayout.autoSpan;};b.prototype.setAutoCardSpanHeight=function(e,c,h){var l;var s=c;if(!s&&e&&e.target.parentElement){s=e.target.parentElement.parentElement.id.split("--")[1];}var H=h;if(!H&&e){H=e.size.height;}if(this.isCardAutoSpan(s)){var r=Math.ceil(H/this.getRowHeightPx());l=this.dashboardLayoutModel.resizeCard(s,{rowSpan:r,colSpan:1},false);this._sizeCard(l.resizeCard);this._positionCards(l.affectedCards);}};b.prototype.addColumnInTable=function(c,o){var $=jQuery("#"+c);if(o.colSpan>=1){if(jQuery($).find("tr").length!=0){var t=sap.ui.getCore().byId(jQuery($).find(".sapMList").attr("id"));var d=t.getAggregation("columns");var e=o.colSpan;var I=e+1;for(var i=0;i<6;i++){if(d[i]){if(i<=I){d[i].setStyleClass("sapTableColumnShow").setVisible(true);}else{d[i].setStyleClass("sapTableColumnHide").setVisible(false);}}}t.rerender();}}};b.prototype.getItemHeight=function(g,c,f){if(!!g){var A=g.getView().byId(c);var h=0;if(!!A){if(f){if(A.getItems()[0]&&A.getItems()[0].getDomRef()){h=A.getItems()[0].getDomRef().offsetHeight;}}else{if(c==='ovpCountFooter'){h=A.getDomRef().parentNode.offsetHeight;}else{h=A.getDomRef().offsetHeight;}}}return h;}};b.prototype._sizeCard=function(c){if(!c){return;}var $=jQuery("#"+this.getCardDomId(c.id));var d=$.children().first().attr("id");c.dashboardLayout.width=c.dashboardLayout.colSpan*this.oLayoutData.colWidthPx+"px";c.dashboardLayout.height=c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx+"px";$.css({width:c.dashboardLayout.width,height:c.dashboardLayout.height});if((c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx)>368||this.bRecreate){var l=sap.ui.getCore().byId(jQuery($).find(".sapMList").attr("id"));try{if(this.bRecreate){c.dashboardLayout.colSpan=this.bRecreate.colSpan;c.dashboardLayout.rowSpan=this.bRecreate.rowSpan;c.dashboardLayout.width=c.dashboardLayout.colSpan*this.oLayoutData.colWidthPx+"px";c.dashboardLayout.height=c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx+"px";$.css({width:c.dashboardLayout.width,height:c.dashboardLayout.height});if(c.template==="sap.ovp.cards.table"){this.addColumnInTable(this.getCardDomId(c.id),this.bRecreate);}else{l.rerender();}this.bRecreate=null;}var o=sap.ui.getCore().byId(d).getComponentInstance();if(o){var g=o.getAggregation("rootControl").getController();if(g){var h=this.getItemHeight(g,'ovpCardHeader');var f=this.getItemHeight(g,'ovpCountFooter');var i=this.getItemHeight(g,'toolbar');jQuery($).find(".sapOvpWrapper").css({height:((c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx)-(h+f+16))+"px"});var L,A;if(c.template==="sap.ovp.cards.list"){L=this.getItemHeight(g,'ovpList',true);A=this.getItemHeight(g,'ovpCardContentContainer')-i;}else if(c.template==="sap.ovp.cards.table"){L=this.getItemHeight(g,'ovpTable',true);A=this.getItemHeight(g,'ovpCardContentContainer')-L-i;}if(L){var n=Math.floor(A/L);var r=A%L;var B=l.getBindingInfo("items");if(r===0||r>4){var e=g.getView().byId("ovpCountFooter");if(e){e.getDomRef().parentElement.classList.add("sapOvpFixedLayoutFooter");}}if(r<=16){B.length=n;}else{B.length=n+1;}l.getBinding("items").refresh();}}else{jQuery.sap.log.warning("OVP resize: no controller found for "+d);}}}catch(j){jQuery.sap.log.warning("OVP resize: "+d+" catch "+j.toString());}}this._triggerCardResize(c.dashboardLayout,$);var k=this.calculateContainerHeight();jQuery(".sapUshellEasyScanLayoutInner").css({"height":k+"px","z-index":"1"});};b.prototype._triggerCardResize=function(c,$){if(c.autoSpan||!c.visible){return;}c.iRowHeightPx=this.getRowHeightPx();c.iCardHeightPx=c.iRowHeightPx*c.rowSpan;c.containerLayout="resizable";var d=$.children().first().attr("id");try{var o=sap.ui.getCore().byId(d).getComponentInstance();if(o){var g=o.getAggregation("rootControl").getController();if(g){g.resizeCard(c);}else{jQuery.sap.log.warning("OVP resize: no controller found for "+d);}}}catch(e){jQuery.sap.log.warning("OVP resize: "+d+" catch "+e.toString());}};b.prototype._positionCards=function(c){if(!c){return;}var i=0;var p={};for(i=0;i<c.length;i++){if(!c[i].dashboardLayout.visible){continue;}p=this._mapGridToPositionPx(c[i].dashboardLayout);c[i].dashboardLayout.top=p.top;c[i].dashboardLayout.left=p.left;var $=jQuery("#"+this.getCardDomId(c[i].id));$.css({top:p.top,left:p.left});}};b.prototype.layoutCards=function(c){var d=c||this.aCards;var i=0;var p={};for(i=0;i<d.length;i++){if(!d[i].dashboardLayout.visible){continue;}p=this._mapGridToPositionPx(d[i].dashboardLayout);d[i].dashboardLayout.top=p.top;d[i].dashboardLayout.left=p.left;d[i].dashboardLayout.width=d[i].dashboardLayout.colSpan*this.oLayoutData.colWidthPx+"px";d[i].dashboardLayout.height=d[i].dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx+"px";var $=jQuery("#"+this.getCardDomId(d[i].id));$.css({top:p.top,left:p.left,width:d[i].dashboardLayout.width,height:d[i].dashboardLayout.height});this._triggerCardResize(d[i].dashboardLayout,$);}};b.prototype.resizeCard=function(c,s){var l=this.dashboardLayoutModel.resizeCard(this.getCardId(c),s,true);this._sizeCard(l.resizeCard);this._positionCards(l.affectedCards);this.oLayoutCtrl.fireAfterDragEnds();if(!this.dashboardLayoutModel.validateGrid()){this.dashboardLayoutModel.undoLastChange();}};b.prototype._sortCardsByCol=function(c){c.sort(function(d,e){if(d.dashboardLayout.column&&d.dashboardLayout.row&&d.dashboardLayout.column===e.dashboardLayout.column){if(d.dashboardLayout.row<e.dashboardLayout.row){return-1;}else if(d.dashboardLayout.row>e.dashboardLayout.row){return 1;}}else if(d.dashboardLayout.column){return d.dashboardLayout.column-e.dashboardLayout.column;}else{return 0;}});};b.prototype._sortCardsByRow=function(c){c.sort(function(d,e){if(d.dashboardLayout.column&&d.dashboardLayout.row&&d.dashboardLayout.row===e.dashboardLayout.row){if(d.dashboardLayout.column<e.dashboardLayout.column){return-1;}else if(d.dashboardLayout.column>e.dashboardLayout.column){return 1;}}else if(d.dashboardLayout.row){return d.dashboardLayout.row-e.dashboardLayout.row;}else{return 0;}});};b.prototype._mapGridToPositionPx=function(g){var p={top:(g.row-1)*this.getRowHeightPx()+"px",left:(g.column-1)*this.getColWidthPx()+"px"};return p;};b.prototype.mapPositionToGrid=function(p){var g={};var c={};c.y1=Math.floor((p.top+1)/this.oLayoutData.rowHeightPx)+1;c.x1=Math.floor((p.left+1)/this.oLayoutData.colWidthPx)+1;g=this._mapGridToPositionPx({column:c.x1,row:c.y1});g.gridCoordX=c.x1;g.gridCoordY=c.y1;return g;};b.prototype.getPixelPerRem=function(){var f=parseFloat(getComputedStyle(document.documentElement).fontSize);return f;};b.prototype._getCardComponentDomId=function(c){return this.componentDomId+"--"+c;};b.prototype._getCardController=function(c){var o=null;var d=sap.ui.getCore().byId(this._getCardComponentDomId(c));if(d){o=d.getComponentInstance().getAggregation("rootControl").getController();}return o;};b.prototype._setCardsCssValues=function(c){var i=0;for(i=0;i<c.length;i++){this.setCardCssValues(c[i]);}};b.prototype.setCardCssValues=function(c){c.dashboardLayout.top=((c.dashboardLayout.row-1)*this.oLayoutData.rowHeightPx)+"px";c.dashboardLayout.left=((c.dashboardLayout.column-1)*this.oLayoutData.colWidthPx)+"px";c.dashboardLayout.width=(c.dashboardLayout.colSpan*this.oLayoutData.colWidthPx)+"px";c.dashboardLayout.height=(c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx)+"px";};b.prototype.convertRemToPx=function(v){var c=v;if(typeof v==="string"||v instanceof String){c=v.length>0?parseInt(v.split("rem")[0],10):0;}return c*this.getPixelPerRem();};b.prototype.convertPxToRem=function(v){var c=v;if(typeof v==="string"||v instanceof String){c=v.length>0?parseFloat(v.split("px")[0],10):0;}return c/this.getPixelPerRem();};b.prototype.getLayoutWidthPx=function(){return this.oLayoutData.colCount*this.oLayoutData.colWidthPx;};b.prototype.getColWidthPx=function(){return this.oLayoutData.colWidthPx;};b.prototype.getRowHeightPx=function(){return this.oLayoutData.rowHeightPx;};b.prototype._setColCount=function(c){this.oLayoutData.colCount=c;};b.prototype.getDropSimData=function(f){var p=true;var g={};var c=[];var d=[];var i=0;var r=this.oLayoutData.rowHeightPx;var e=this.oLayoutData.colWidthPx;var o=this.dashboardLayoutModel.getCardById(this.getCardId(f.id));var t={column:Math.round(f.left/e),row:Math.round(f.top/r)};var T=true;t.row=(t.row<1)?0:t.row;t.column=(t.column<0)?0:t.column;var h=o?o.dashboardLayout.colSpan:0;if(t.column+h>(this.oLayoutData.colCount)){t.column=this.oLayoutData.colCount-h;}if(t.column+h<this.oLayoutData.colCount){T=false;}var j={left:(t.column)*e,top:(t.row)*r};var k=j.top;if(j.left>this.oLayoutData.colCount*e){j.left=this.oLayoutData.colCount*e;}if(o){g.y1=t.row+1;g.x1=t.column+1;g.y2=g.y1+o.dashboardLayout.rowSpan-1;g.x2=g.x1+o.dashboardLayout.colSpan-1;c=this.dashboardLayoutModel.getCardsByGrid(g,this.getCardId(f.id));for(i=0;i<c.length;i++){d.push(this.getCardDomId(c[i].id));}}for(i=0;i<c.length;i++){if((c[i].dashboardLayout.row-1)*r<k){k=(c[i].dashboardLayout.row-1)*r;}}if(f.top<k-16){p=false;}if(T){p=false;}return{cellPos:j,coveredCardIds:d,pushHorizontal:p};};b.prototype.setRecreateCard=function(r){this.bRecreate=r;};return b;},true);
