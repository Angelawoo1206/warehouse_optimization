jQuery.sap.declare("sap.zen.crosstab.dragdrop.DragDropHandler");jQuery.sap.require("sap.zen.crosstab.dragdrop.DragDropUtils");jQuery.sap.require("sap.zen.crosstab.dragdrop.DragDropAreaRenderer");jQuery.sap.require("sap.zen.crosstab.dragdrop.DragDropHoverManager");jQuery.sap.require("sap.zen.crosstab.dragdrop.MemberDragDropHandler");jQuery.sap.require("sap.zen.crosstab.TextConstants");jQuery.sap.require("sap.zen.crosstab.utils.Utils");
sap.zen.crosstab.dragdrop.DragDropHandler=function(c,d){"use strict";var t=this;var D;var o;var a;var m;var p;this.initDragDrop=function(F){var i=d.insertmembercommand&&d.insertmembercommand.length>0;sap.zen.Dispatcher.instance.registerUnhandledDropHandler(c.getId(),c.onUnhandledDrop);sap.zen.Dispatcher.instance.registerDragDropCancelHandler(c.getId(),c.onEscKeyPressed);this.registerCrosstabAsDropHandler();a=new sap.zen.crosstab.dragdrop.DragDropHoverManager(c);D=new sap.zen.crosstab.dragdrop.DragDropUtils(c);o=new sap.zen.crosstab.dragdrop.DragDropAreaRenderer(c);if(i){m=new sap.zen.crosstab.dragdrop.MemberDragDropHandler(c,d,D,o,a);}p=c.getHeaderInfo().setupPivotCell();a.init(D);D.init(a);o.init(p,D);if(i){m.init(p);}if(p){this.enableDimHeaderNonPivotCells();this.enableDimHeaderPivotCell();if(!F){o.renderDimHeaderDropAreas();this.enableDimHeaderDropAreas();}}this.addExternalDimensionDropAreasIfOnlyMeasures();};this.addExternalDimensionDropAreasIfOnlyMeasures=function(){var C;var A;D.setOnlyMeasuresMode(false);if(sap.zen.crosstab.utils.Utils.isDispatcherAvailable()){if(sap.zen.Dispatcher.instance.isInterComponentDragDropEnabled()&&c.getHeaderInfo().hasOnlyMeasureStructure()){D.setOnlyMeasuresMode(true);C=c.getTableCell(0,0);if(C){A=o.createExternalDimDropAreasForMemberCell(C);this.makeAboveAreaDroppable(A.oJqAboveArea,"sapzencrosstab-rowAboveCellDropArea");this.makeBeforeAreaDroppable(A.oJqBeforeArea,"sapzencrosstab-columnBeforeCellDropArea");}}}};this.returnFromDimHeaderDropAccept=function(C,A,e){C.setRevertDrop(e);sap.zen.Dispatcher.instance.setDropAccepted(C.getId(),A);return A;};function b(e){var P;var i;var j;var C;C=a.getCellFromJqCell(this);P=sap.zen.Dispatcher.instance.getDragDropPayload();if(c.isBlocked()||!P||P&&P.oDragDropInfo.bIsMemberDrag){return t.returnFromDimHeaderDropAccept(C,false,true);}if(!D.checkAcceptExternalDimension(P)){return t.returnFromDimHeaderDropAccept(C,false,true);}if(!D.checkDroppableInArea($(this),D.determineValidHeaderRect())){return t.returnFromDimHeaderDropAccept(C,false,false);}j=c.getHeaderInfo().getDimensionInfoByRowCol(C);if(D.isExternalDropOnNonRemovableStructure(j,P)){return t.returnFromDimHeaderDropAccept(C,false,true);}if(D.isDragFromOtherCrosstab(P)){return t.returnFromDimHeaderDropAccept(C,false,true);}if(!D.checkAcceptCrossComponent(P)){return t.returnFromDimHeaderDropAccept(C,false,true);}if(P.oDragDropInfo){i=P.oDragDropInfo;if(j.sDimensionName===i.sDimensionName){return t.returnFromDimHeaderDropAccept(C,false,true);}}else{return t.returnFromDimHeaderDropAccept(C,false,true);}return t.returnFromDimHeaderDropAccept(C,true,false);}function h(e,u){var s;var i;var j;var k;var P;if(D.checkDropAllowedOnCrosstabElement(e)){P=sap.zen.Dispatcher.instance.getDragDropPayload();if(P&&P.oDragDropInfo){k=a.getCellFromJqCell(this);s=P.oDragDropInfo.sDimensionName;i=c.getHeaderInfo().getDimensionInfoByRowCol(k);j=i.sDimensionName;if(s&&s.length>0&&j&&j.length>0){if(s!==j){var C=d.swapdimensionscommand.replace("__DIMENSION_NAME__",s);C=C.replace("__WITH_DIMENSION_NAME__",j);c.getUtils().executeCommandAction(C);}}}D.resetDragDrop();}}this.getTextForDragGhostCell=function(C,e,M){var T=null;var s;if(e.bIsMeasureStructure===true){T=M;}else{if(C.isSplitPivotCell()===true){if(e.sAxisName==="ROWS"){s=c.getHeaderInfo().getDimensionInfoByCol(C.getTableCol());}else if(e.sAxisName==="COLS"){s=c.getHeaderInfo().getDimensionInfoByRow(C.getTableRow());}if(s){if(s.sAttributeName){T=s.sAttributeText;}else{T=s.sDimensionText;}}else{T=C.getText();}}else{T=C.getText();}}if(!T||T&&T.length===0){T=e.sDimensionText;}return T;};this.getDragGhostCellHtml=function(C,e,M){var T;var j;var J;var w;var H;var W;j=$('#'+C.getId());if(!e.bIsStructure){J=$('#'+C.getId()+"_cellLayoutDiv");w=J.outerWidth();W=w+"px";}else{W="100%";}T=this.getTextForDragGhostCell(C,e,M);H="<td class=\""+j.attr("class")+" sapzencrosstab-DragHeaderCell"+"\">";H+="<div style=\"width: "+W+"\">"+T+"</div></td>";return H;};this.createDimHeaderCellDragObject=function(e,j){var J=null;var T=null;var i=0;var C;var H;var M;var l;var s;var w;var k;var P;if(j.bIsMeasureStructure===true){M=c.getPropertyBag().getText(sap.zen.crosstab.TextConstants.MEASURE_STRUCTURE_TEXT_KEY);l=1;}else{l=e.length;}H="<table id=\""+c.getId()+"_dragghost\" style=\"z-index: 9999;border-collapse: collapse\" class=\"sapzencrosstab-DimensionHeaderArea\"><tbody>";H+=D.getDeleteDragGhostCellRowHtml(j.sAxisName==="ROWS"?e.length:1);if(j.sAxisName==="ROWS"){C=e[0];k=$('#'+C.getId()).outerHeight();H+="<tr style=\"height: "+k+"px\">";for(i=0;i<l;i++){C=e[i];H+=this.getDragGhostCellHtml(C,j,M);}H+="</tr>";}else if(j.sAxisName==="COLS"){for(i=0;i<l;i++){C=e[i];k=$('#'+C.getId()).outerHeight();H+="<tr style=\"height: "+k+"px\">";H+=this.getDragGhostCellHtml(C,j,M);H+="</tr>";}}H+="</tbody></table>";J=$(H);P=sap.zen.Dispatcher.instance.createDragDropPayload(c.getId());P.oDragDropInfo=D.buildDimensionDragDropInfo(j);sap.zen.Dispatcher.instance.setDragDropPayload(P);c.setDragAction(true);return J;};function f(e){var C;var j;var i;var k;var T;var l=[];C=a.getCellFromJqCell(this);if(C){D.setCurrentJqDragCell($(this));i=c.getHeaderInfo().getDimensionInfoByRowCol(C);l=c.getHeaderInfo().getCellsWithSameDimension(C);D.saveRevertCellPosInfo(C,l);j=t.createDimHeaderCellDragObject(l,i);D.setCursorAt(C,j);}return j;}this.makeAboveAreaDroppable=function(j,C){var A=D.getAreaInfo(j);var H=function(e,u){var k;if(D.checkDropAllowedOnCrosstabElement(e)){if(D.isOnlyMeasuresMode()===true){k={};k.sDragDimensionName=D.getDimensionNameDromDragDropPayload();k.sDropAxisName="COLS";k.iDropAxisIndex=0;}else{k=D.getCellInfoFromDropArea(e,"droparea_above");if(k){if(k.sDropAxisName==="ROWS"&&c.getTableMaxDimHeaderRow()===0){k.sDropAxisName="COLS";k.iDropAxisIndex=0;}}}if(k){t.sendInsertDimensionCommand(k);}D.resetDragDrop();}};var i=function(e){return D.checkGenericDimMoveToAreasAccept(j,e,A.oDimInfo,A.oCell,"droparea_above",false);};D.makeDropAreaDroppable(j,C,i,H);};this.makeBelowAreaDroppable=function(j,C){var A=D.getAreaInfo(j);var H=function(e,u){var k;if(D.checkDropAllowedOnCrosstabElement(e)){k=D.getCellInfoFromDropArea(e,"droparea_below");if(k){if(k.bDropCellIsBottomRight===true){k.sDropAxisName="COLS";k.iDropAxisIndex=c.getHeaderInfo().getNumberOfDimensionsOnColsAxis();}else{k.iDropAxisIndex++;}t.sendInsertDimensionCommand(k);}D.resetDragDrop();}};var i=function(e){return D.checkGenericDimMoveToAreasAccept(j,e,A.oDimInfo,A.oCell,"droparea_below",false);};D.makeDropAreaDroppable(j,C,i,H);};this.makeBeforeAreaDroppable=function(j,C){var A=D.getAreaInfo(j);var H=function(e,u){var k;if(D.checkDropAllowedOnCrosstabElement(e)){if(D.isOnlyMeasuresMode()===true){k={};k.sDragDimensionName=D.getDimensionNameDromDragDropPayload();k.sDropAxisName="ROWS";k.iDropAxisIndex=0;}else{k=D.getCellInfoFromDropArea(e,"droparea_before");if(k){if(k.sDropAxisName==="COLS"&&c.getTableMaxDimHeaderCol()===0){k.sDropAxisName="ROWS";k.iDropAxisIndex=0;}}}if(k){t.sendInsertDimensionCommand(k);}D.resetDragDrop();}};var i=function(e){return D.checkGenericDimMoveToAreasAccept(j,e,A.oDimInfo,A.oCell,"droparea_before",false);};D.makeDropAreaDroppable(j,C,i,H);};this.makeAfterAreaDroppable=function(j,C){var A=D.getAreaInfo(j);var H=function(e,u){var k;if(D.checkDropAllowedOnCrosstabElement(e)){k=D.getCellInfoFromDropArea(e,"droparea_after");if(k){if(k.bDropCellIsBottomRight===true){k.sDropAxisName="ROWS";k.iDropAxisIndex=c.getHeaderInfo().getNumberOfDimensionsOnRowsAxis();}else{k.iDropAxisIndex++;}t.sendInsertDimensionCommand(k);}D.resetDragDrop();}};var i=function(e){var r=D.checkGenericDimMoveToAreasAccept(j,e,A.oDimInfo,A.oCell,"droparea_after",true);return r;};D.makeDropAreaDroppable(j,C,i,H);};this.enableDimHeaderDropAreas=function(){var j=$('#'+c.getId());var C=null;var B=null;var A=null;var e=null;var i=null;var k=null;C="sapzencrosstab-columnBeforeCellDropArea";B=j.find("."+C);$.each(B,function(l,n){t.makeBeforeAreaDroppable($(n),C);});C="sapzencrosstab-columnAfterCellDropArea";A=j.find("."+C);$.each(A,function(l,n){t.makeAfterAreaDroppable($(n),C);});C="sapzencrosstab-columnAfterCellDropAreaWithSort";e=j.find("."+C);$.each(e,function(l,n){t.makeAfterAreaDroppable($(n),C);});C="sapzencrosstab-rowAboveCellDropArea";i=j.find("."+C);$.each(i,function(l,n){t.makeAboveAreaDroppable($(n),C);});C="sapzencrosstab-rowBelowCellDropArea";k=j.find("."+C);$.each(k,function(l,n){t.makeBelowAreaDroppable($(n),C);});};this.getPivotCellAreaFromMouseCoordinates=function(e,C){var A=null;var i=$('#'+C.getId()+"_dragarea_cols")[0];var r=i.getBoundingClientRect();var x=e.clientX-r.left;var y=e.clientY-r.top;var B=x*r.height/r.width;if(c.getPropertyBag().isRtl()){B=r.height-B;}y>B?A="ROWS":A="COLS";return A;};function g(e){var A;var C;var r;var i=null;var j;var J;var k;k=a.getCellFromJqCell(this);C=k.getTableCol();r=k.getTableRow();A=t.getPivotCellAreaFromMouseCoordinates(e,k);if(A==="ROWS"){j=c.getHeaderInfo().getDimensionInfoByCol(C);}else if(A==="COLS"){j=c.getHeaderInfo().getDimensionInfoByRow(r);}i=c.getHeaderInfo().getCellsWithSameDimensionByDimInfo(j);D.saveRevertCellPosInfo(k,i,A);J=t.createDimHeaderCellDragObject(i,j);D.setCursorAt(k,J);return J;}this.makeSplitPivotCellDraggable=function(C,j){o.renderSplitPivotCellDragAreas(C,j);D.makeCellDraggable(j,g);};this.enableDimHeaderNonPivotCells=function(){var r=0;var C=0;var M=p.getTableRow();var i=p.getTableCol();var e=null;var j=c.getDimensionHeaderArea().getColCnt();var k=c.getDimensionHeaderArea().getRowCnt();var J=null;while(C<i){e=c.getTableCellWithColSpan(M,C);if(e){J=$('#'+e.getId());D.makeCellDraggable(J,f);D.makeCellDroppable(J,b,h);C=C+e.getColSpan();}}while(r<M){e=c.getTableCellWithRowSpan(r,i);if(e){J=$('#'+e.getId());D.makeCellDraggable(J,f);D.makeCellDroppable(J,b,h);r=r+e.getRowSpan();}}};this.isNonSplitPivotCellDragDropEnabled=function(){var e=true;if(p&&!p.isSplitPivotCell()){if(p.getScalingAxis()==="COLS"){e=c.getHeaderInfo().hasDimensionsOnRowsAxis();}else if(p.getScalingAxis()==="ROWS"){e=c.getHeaderInfo().hasDimensionsOnColsAxis();}}return e;};this.enableDimHeaderPivotCell=function(){var j;if(p){j=$('#'+p.getId());if(p.isPivotCell()===true&&p.isSplitPivotCell()===true){this.makeSplitPivotCellDraggable(p,j);}else{if(this.isNonSplitPivotCellDragDropEnabled()){D.makeCellDraggable(j,f);D.makeCellDroppable(j,b,h);}}}};this.onUnhandledDrop=function(e,u,P){var i;var I=false;var j=false;if(sap.zen.Dispatcher.instance.isDragDropCanceled()){return;}if(!P){sap.zen.Dispatcher.instance.setDragDropCanceled(true);return;}if(D.checkMouseInRenderSizeDiv(e)===true){sap.zen.Dispatcher.instance.setDragDropCanceled(true);}else{i=P.oDragDropInfo;if(i.bIsMemberDrag){m.removeMember(e,u,i);}else{I=i.bIsStructure;j=i.bIsRemoveStructureAllowed;if(I&&!j){sap.zen.Dispatcher.instance.setDragDropCanceled(true);}else{if(i.sDimensionName&&i.sDimensionName.length>0){var C=d.removedimensioncommand.replace("__DIMENSION_NAME__",i.sDimensionName);c.getUtils().executeCommandAction(C);}else{sap.zen.Dispatcher.instance.setDragDropCanceled(true);}}}}};this.onEscKeyPressed=function(){var j;sap.zen.Dispatcher.instance.setDragDropCanceled(true);j=D.getCurrentJqDragCell();if(j){j.draggable().trigger("mouseup");}else{D.resetDragDrop();}a.cleanupDropCells();a.cleanupDropAreas();};this.repositionDropAreasForHeaderScrolling=function(){o.repositionDropAreasForHeaderScrolling();};this.sendInsertDimensionCommand=function(C){var s=d.insertdimensioncommand;if(C&&s&&s.length>0){s=s.replace("__DIMENSION_NAME__",C.sDragDimensionName);s=s.replace("__AXIS__",C.sDropAxisName);s=s.replace("__AXIS_INDEX__",C.iDropAxisIndex);c.getUtils().executeCommandAction(s);}};this.registerCrosstabAsDropHandler=function(){var j;j=$('#'+c.getId());if(!j.hasClass("ui-droppable")){j.droppable({greedy:true,accept:function(e){return true;},drop:function(e,u){if(!e.buttons){sap.zen.Dispatcher.instance.onUnhandledDrop(e,u);}}});}};}