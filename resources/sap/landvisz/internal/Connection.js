/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

sap.landvisz.internal.Connection=function(){};
sap.landvisz.internal.Connection.init=function(){this.setting={showLog:true,animationSpeed:10};this.initialized=false;this.initialRow=0;this.initialCol=0;this.allConnections=[];this.clvConnections=[];this.sourceDoneList={};this.targetDoneList={};this.nodeDoneList={};this.sourceConnectionMatrix={};this.targetConnectionMatrix={};this.connectionMatrix={};this.topPostions={};this.connectedNodesLayout={};this.svgForConnections=null;this.isConnectionEntity=false;this.isSystemEntity=false;};
sap.landvisz.internal.Connection.hideConnections=function(){if(this.svgForConnections){jQuery(this.svgForConnections.canvas).hide();}};
sap.landvisz.internal.Connection.getConnectedNodesLayoutTrack=function(c){if(c.length>0){this.allConnections=c;if(jQuery.isEmptyObject(this.connectedNodesLayout)){for(var i=0;i<this.allConnections.length;i++){this.getAllTargets(this.allConnections[i].getSource());this.getAllSources(this.allConnections[i].getSource());}}var n={};n.row=this.initialRow;n.col=this.initialCol;var a;var b;var f=true;for(var k in this.sourceConnectionMatrix){this.connectionMatrix[k]=[];this.connectionMatrix[k].sources=this.sourceConnectionMatrix[k];this.connectionMatrix[k].targets=this.targetConnectionMatrix[k];if(!this.connectedNodesLayout[k]&&f==true){this.connectedNodesLayout[k]=n;a=this.connectionMatrix[k];b=k;f=false;}}this.assignIndexToConnectedNodes(a,b);}return this.connectedNodesLayout;};
sap.landvisz.internal.Connection.assignIndexToConnectedNodes=function(n,k){if(n.targets.length>0)this.assignTargetIndex(k);if(n.sources.length>0)this.assignSourceIndex(k)};
sap.landvisz.internal.Connection.assignTargetIndex=function(n){var a=this.connectionMatrix[n];var r=this.connectedNodesLayout[n].row;var c=this.connectedNodesLayout[n].col;var t;for(var i=0;i<a.targets.length;i++){t=this.connectionMatrix[a.targets[i]];if(i==0)c++;else{r++;if(t&&t.targets.length>0)c=c+t.targets.length-1;}var b={};b.row=r;b.col=c;if(!this.connectedNodesLayout[a.targets[i]])this.connectedNodesLayout[a.targets[i]]=b;if(t)this.assignIndexToConnectedNodes(t,a.targets[i]);}};
sap.landvisz.internal.Connection.assignSourceIndex=function(n){var a=this.connectionMatrix[n];var r=this.connectedNodesLayout[n].row;var c=this.connectedNodesLayout[n].col;for(var i=0;i<a.sources.length;i++){if(!this.connectedNodesLayout[a.sources[i]]){c--;r++;var b={};b.row=r;b.col=c;this.connectedNodesLayout[a.sources[i]]=b;if(this.connectionMatrix[a.targets[i]])this.assignIndexToConnectedNodes(this.connectionMatrix[a.targets[i]],a.targets[i]);}}};
sap.landvisz.internal.Connection.getAllTargets=function(s){var t=[];if(!this.sourceDoneList[s]){this.sourceDoneList[s]=true;for(var j=0;j<this.allConnections.length;j++){if(s==this.allConnections[j].getSource()){t.push(this.allConnections[j].getTarget());}}this.targetConnectionMatrix[s]=t;}};
sap.landvisz.internal.Connection.getAllSources=function(s){var a=[];if(!this.targetDoneList[s]){this.targetDoneList[s]=true;for(var j=0;j<this.allConnections.length;j++){if(s==this.allConnections[j].getTarget()){a.push(this.allConnections[j].getSource());}}this.sourceConnectionMatrix[s]=a;}};
sap.landvisz.internal.Connection.getConnectedNodesLayout=function(c){if(c.length>0){this.allConnections=c;if(jQuery.isEmptyObject(this.connectedNodesLayout)){for(var i=0;i<this.allConnections.length;i++){this.getSourceTargetConnections(this.allConnections[i].getSource());this.getTargetSourceConnections(this.allConnections[i].getTarget());}for(var k in this.sourceConnectionMatrix){this.connectionMatrix[k]=jQuery.merge(jQuery.merge([],this.sourceConnectionMatrix[k]),this.targetConnectionMatrix[k]);}var n={};n.row=this.initialRow;n.col=this.initialCol;for(var k in this.connectionMatrix){if(this.connectionMatrix[k].length==1){this.connectedNodesLayout[k]=n;this.nodeDoneList[k]=true;if(!this.topPostions[this.initialRow]){this.topPostions[this.initialRow]=[];}this.topPostions[this.initialRow].push(this.initialCol);this.findConnectedNodes(k);break;}}}}return this.connectedNodesLayout;};
sap.landvisz.internal.Connection.getAllConnections=function(){if(this.allConnections.length==0){jQuery(this.connectionsData).find('CONNECTION').each(function(){var c=this.parseSingleConnection(jQuery(this));this.allConnections.push(c);});}return this.allConnections;};
sap.landvisz.internal.Connection.parseSingleConnection=function(c){var p={};jQuery(c).children('DATA').each(function(){var a=jQuery(this).attr('property');var v=jQuery.trim(jQuery(this).attr('value'));switch(a.toUpperCase()){case'CONNECTION-UUID':p.uuid=v;break;case'CONNECTION-TYPE':p.type=v;break;case'TEXT':p.text=v;break;case'SOURCE-ENTITY-UUID':p.source=v;break;case'TARGET-ENTITY-UUID':p.target=v;break;}});return p;};
sap.landvisz.internal.Connection.getSourceTargetConnections=function(s){var a=[];if(!this.sourceDoneList[s]){this.sourceDoneList[s]=true;for(var j=0;j<this.allConnections.length;j++){if(s==this.allConnections[j].getSource()){a.push(this.allConnections[j].getTarget());this.getSourceTargetConnections(this.allConnections[j].getTarget());}}this.sourceConnectionMatrix[s]=a;}};
sap.landvisz.internal.Connection.getTargetSourceConnections=function(t){var a=[];if(!this.targetDoneList[t]){this.targetDoneList[t]=true;for(var j=0;j<this.allConnections.length;j++){if(t==this.allConnections[j].getTarget()){a.push(this.allConnections[j].getSource());this.getTargetSourceConnections(this.allConnections[j].getSource());}}this.targetConnectionMatrix[t]=a;}};
sap.landvisz.internal.Connection.findConnectedNodes=function(n){var a=this.connectionMatrix[n];var c=0;var r=this.connectedNodesLayout[n].row;var b=this.connectedNodesLayout[n].col;var d=[];for(var i=0;i<a.length;i++){if(!this.nodeDoneList[a[i]]){d[c]=a[i];c++;}}c=a.length-d.length;for(var i=0;i<d.length;i++){c++;if(c==1){b++;}else{if(c==2){if(r!=0){var e=b;var f=r-1;if(a.length>2&&!this.inTopPosition(f,e)){r--;}}b++;}else if(c>=3){r++;}}var g={};g.row=r;g.col=b;this.connectedNodesLayout[d[i]]=g;this.nodeDoneList[d[i]]=true;if(!this.topPostions[r]){this.topPostions[r]=[];}this.topPostions[r].push(b);var h=this.findConnectedNodes(d[i]);r=h;}return r;};
sap.landvisz.internal.Connection.inTopPosition=function(r,c){if(this.topPostions[r]){for(var i=0;i<this.topPostions[r].length;i++){if(this.topPostions[r][i]==c){return true;}}}return false;};
sap.landvisz.internal.Connection.renderConnections=function(s,c,t){for(var i=0;i<this.allConnections.length;i++){var a=this.allConnections[i];a.sourceEntity=this.getEntity(s,c,this.allConnections[i].getSource());a.targetEntity=this.getEntity(s,c,this.allConnections[i].getTarget());this.clvConnections.push(a);}if(this.clvConnections.length==0)return;var e=this.svgForConnections.append("marker").attr("id","endMarker").attr("viewBox","0 0 10 10").attr("markerWidth",10).attr("markerHeight",3).attr("refX",7).attr("refY",4).attr("orient","auto").attr("markerUnits","strokeWidth");e.append("path").attr("d","M0,0 L10,4 L0,8 z");for(var i=0;i<this.clvConnections.length;i++){this.drawConnection(this.clvConnections[i],t);}};
sap.landvisz.internal.Connection.getEntity=function(s,c,a){var b;this.isConnectionEntity=false;this.isSystemEntity=false;for(var i=0;i<c.length;i++){b=c[i].getConnectionId();if(a==b)return jQuery.sap.byId(c[i].getId());}for(var i=0;i<s.length;i++){b=s[i].getSystemId();if(a==b)return jQuery.sap.byId(s[i].getId());}};
sap.landvisz.internal.Connection.drawConnection=function(c,t){var s=c.sourceEntity;var a=c.targetEntity;var b=this.getX(s);var d=this.getY(s);var e=this.getX(a);var f=this.getY(a);var g=c.getSource();var h=c.getTarget();var i=this.connectedNodesLayout[g];var j=this.connectedNodesLayout[h];var k=null;if(j.row==i.row){k=this.svgForConnections.append("line");if(t==sap.landvisz.ConnectionLine.Arrow){b=b+122;e=e-122;k.attr("marker-end","url(#endMarker)");}k.attr("x1",b);k.attr("y1",d);k.attr("x2",e);k.attr("y2",f);k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);}else if(j.col==i.col){k=this.svgForConnections.append("line");if(t==sap.landvisz.ConnectionLine.Arrow){d=d+95;f=f-95;k.attr("marker-end","url(#endMarker)");}k.attr("x1",b);k.attr("y1",d);k.attr("x2",e);k.attr("y2",f);k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);}else if(j.col>i.col){if(j.row<i.row){k=this.svgForConnections.append("line");if(t==sap.landvisz.ConnectionLine.Arrow){b=b+95;k.attr("marker-end","url(#endMarker)");}k.attr("x1",b);k.attr("y1",d);k.attr("x2",e);k.attr("y2",d);k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);k=this.svgForConnections.append("line");if(t==sap.landvisz.ConnectionLine.Arrow){f=f+95;k.attr("marker-end","url(#endMarker)");}k.attr("x1",e);k.attr("y1",d);k.attr("x2",e);k.attr("y2",f);k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);}else{k=this.svgForConnections.append("line");if(t==sap.landvisz.ConnectionLine.Arrow){d=d+95;k.attr("marker-end","url(#endMarker)");}k.attr("x1",b);k.attr("y1",d);k.attr("x2",b);k.attr("y2",f);k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);k=this.svgForConnections.append("line");if(t==sap.landvisz.ConnectionLine.Arrow){e=e-122;k.attr("marker-end","url(#endMarker)");}k.attr("x1",b);k.attr("y1",f);k.attr("x2",e);k.attr("y2",f);k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);}}else{k=this.svgForConnections.append("line");k.transition();k.attr("x1",b);k.attr("y1",d);k.attr("x2",e);k.attr("y2",d);k.attr("marker-end","url(#endMarker)");k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);k.attr("x1",b);k=this.svgForConnections.append("line");k.transition();k.attr("x1",e);k.attr("y1",d);k.attr("x2",e);k.attr("y2",f);k.attr("marker-end","url(#endMarker)");k.attr("stroke","#999");k.attr("stroke-width",2);k.transition().duration(1500).delay(1000);}};
sap.landvisz.internal.Connection.getX=function(e){var s=parseInt(e.css('left'));var a=e[0].clientWidth;return s+(a/2);};
sap.landvisz.internal.Connection.getY=function(e){var s=parseInt(e.css('top'));var a=e[0].clientHeight;return s+(a/2);};
sap.landvisz.internal.Connection.getTargetXMiddle=function(t){var a=parseInt(t.css('left'));var b=t.outerWidth();if(t.hasClass('clv_entity_container')){return(a+26+((b-26)/2));}else if(t.hasClass('networkConnectionEntity')){var c=parseInt(t.parent().css('left'));return(c+a+(b/2));}else{return null;}};
sap.landvisz.internal.Connection.getTargetYCenter=function(t){var a=parseInt(t.css('top'));var b=t.outerHeight();if(t.hasClass('clv_entity_container')){return(a+32+((b-32)/2));}else if(t.hasClass('networkConnectionEntity')){var c=parseInt(t.parent().css('top'));return(c+a+(b/2));}else{return null;}};
sap.landvisz.internal.Connection.showConnections=function(){if(this.svgForConnections){jQuery(this.svgForConnections.canvas).show();}};
sap.landvisz.internal.Connection.destroyConnections=function(){if(this.svgForConnections){this.svgForConnections.canvas.remove();this.svgForConnections=null;}};
sap.landvisz.internal.Connection.getConnectedNodes=function(n){var c=[];for(var i=0;i<this.allConnections.length;i++){if(n==this.allConnections[i].source){c.push(this.allConnections[i].target);}else if(n==this.allConnections[i].target){c.push(this.allConnections[i].source);}}return c;};
sap.landvisz.internal.Connection.deinitialize=function(){if(this.initialized){if(this.svgForConnections){this.svgForConnections.canvas.remove();this.svgForConnections=null;}this.allConnections=[];this.clvConnections=[];this.sourceDoneList={};this.targetDoneList={};this.nodeDoneList={};this.sourceConnectionMatrix={};this.targetConnectionMatrix={};this.connectionMatrix={};this.topPostions={};this.connectedNodesLayout={};this.initialized=false;}};
sap.landvisz.internal.Connection.getBoxViewConnectedNodesLayout=function(c){var f={};var t=[];var a={};if(c.length>0){this.allConnections=c;for(var i=0;i<this.allConnections.length;i++){var e=false;for(var b in f){if(this.allConnections[i].getSource()==b){e=true;break;}}if(!e){f[this.allConnections[i].getSource()]={};}}for(var b in f){var s=[];for(var j=0;j<this.allConnections.length;j++){if(b==this.allConnections[j].getSource()){var d=[];for(var k=0;k<this.allConnections.length;k++){if(this.allConnections[j].getTarget()==this.allConnections[k].getTarget())d.push(this.allConnections[k].getSource());}var g={};if(d.length>1){if(t.length>0){var h=false;for(var i=0;i<t.length;i++){for(var l in t[i]){if(this.allConnections[j].getTarget()==l){h=true;}}if(h){break;}}if(!h){g[this.allConnections[j].getTarget()]=d;t.push(g);}}else{g[this.allConnections[j].getTarget()]=d;t.push(g);}}else{g[this.allConnections[j].getTarget()]={};s.push(g);}}}f[b].secondLevelEntities=s;}a.maxColumnCount=0;for(var b in f){var s=f[b].secondLevelEntities;a[b]={};a[b].row=this.initialRow;a[b].col=this.initialCol;a[b].colspan=s.length>0?s.length:1;for(var i=0;i<s.length;i++){for(var l in s[i]){a[l]={};a[l].row=this.initialRow+1;a[l].col=this.initialCol+i;}}this.initialCol+=a[b].colspan;}a.thirdLevelEntitiesCount=t.length;for(var i=0;i<t.length;i++){for(var b in t[i]){a[b]={};a[b].row=this.initialRow+2;a[b].col=0;if(t[i][b].length==2){var m=a[t[i][b][0]].col;var n=a[t[i][b][0]].col+a[t[i][b][0]].colspan-1;var o=a[t[i][b][1]].col;var p=a[t[i][b][1]].col+a[t[i][b][1]].colspan-1;if(m<o){a[b].col=(n+o)/2;}else{a[b].col=(p+m)/2;}}else{for(var j=0;j<t[i][b].length;j++){var q=a[t[i][b][j]].col+a[t[i][b][j]].colspan-1;if(a[b].col<q)a[b].col=q;}a[b].col=a[b].col/2;}}}a.maxColumnCount=this.initialCol;}return a;};
