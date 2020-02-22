!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.threePathfinding={})}(this,function(e){var t=function(){};t.roundNumber=function(e,t){var r=Math.pow(10,t);return Math.round(e*r)/r},t.sample=function(e){return e[Math.floor(Math.random()*e.length)]},t.distanceToSquared=function(e,t){var r=e.x-t.x,n=e.y-t.y,o=e.z-t.z;return r*r+n*n+o*o},t.isPointInPoly=function(e,t){for(var r=!1,n=-1,o=e.length,i=o-1;++n<o;i=n)(e[n].z<=t.z&&t.z<e[i].z||e[i].z<=t.z&&t.z<e[n].z)&&t.x<(e[i].x-e[n].x)*(t.z-e[n].z)/(e[i].z-e[n].z)+e[n].x&&(r=!r);return r},t.isVectorInPolygon=function(e,t,r){var n=1e5,o=-1e5,i=[];return t.vertexIds.forEach(function(e){n=Math.min(r[e].y,n),o=Math.max(r[e].y,o),i.push(r[e])}),!!(e.y<o+.5&&e.y>n-.5&&this.isPointInPoly(i,e))},t.triarea2=function(e,t,r){return(r.x-e.x)*(t.z-e.z)-(t.x-e.x)*(r.z-e.z)},t.vequal=function(e,t){return this.distanceToSquared(e,t)<1e-5},t.scaleEndpoint=function(e,t,r){var n=new THREE.Vector3;n.subVectors(e,t);var o=n.length(),i=.6;o>2*r&&(i=1-r/o);var s=e.clone();e.addVectors(t,n.multiplyScalar(i)),t.addVectors(s,n.negate()),e.x=this.roundNumber(e.x,2),e.y=this.roundNumber(e.y,2),e.z=this.roundNumber(e.z,2),t.x=this.roundNumber(t.x,2),t.y=this.roundNumber(t.y,2),t.z=this.roundNumber(t.z,2)};var r=function(e){this.content=[],this.scoreFunction=e};r.prototype.push=function(e){this.content.push(e),this.sinkDown(this.content.length-1)},r.prototype.pop=function(){var e=this.content[0],t=this.content.pop();return this.content.length>0&&(this.content[0]=t,this.bubbleUp(0)),e},r.prototype.remove=function(e){var t=this.content.indexOf(e),r=this.content.pop();t!==this.content.length-1&&(this.content[t]=r,this.scoreFunction(r)<this.scoreFunction(e)?this.sinkDown(t):this.bubbleUp(t))},r.prototype.size=function(){return this.content.length},r.prototype.rescoreElement=function(e){this.sinkDown(this.content.indexOf(e))},r.prototype.sinkDown=function(e){for(var t=this.content[e];e>0;){var r=(e+1>>1)-1,n=this.content[r];if(!(this.scoreFunction(t)<this.scoreFunction(n)))break;this.content[r]=t,this.content[e]=n,e=r}},r.prototype.bubbleUp=function(e){for(var t=this.content.length,r=this.content[e],n=this.scoreFunction(r);;){var o=e+1<<1,i=o-1,s=null,a=void 0;if(i<t&&(a=this.scoreFunction(this.content[i]))<n&&(s=i),o<t&&this.scoreFunction(this.content[o])<(null===s?n:a)&&(s=o),null===s)break;this.content[e]=this.content[s],this.content[s]=r,e=s}};var n=function(){};n.init=function(e){for(var t=0;t<e.length;t++){var r=e[t];r.f=0,r.g=0,r.h=0,r.cost=1,r.visited=!1,r.closed=!1,r.parent=null}},n.cleanUp=function(e){for(var t=0;t<e.length;t++){var r=e[t];delete r.f,delete r.g,delete r.h,delete r.cost,delete r.visited,delete r.closed,delete r.parent}},n.heap=function(){return new r(function(e){return e.f})},n.search=function(e,t,r){this.init(e);var n=this.heap();for(n.push(t);n.size()>0;){var o=n.pop();if(o===r){for(var i=o,s=[];i.parent;)s.push(i),i=i.parent;return this.cleanUp(s),s.reverse()}o.closed=!0;for(var a=this.neighbours(e,o),h=0,u=a.length;h<u;h++){var c=a[h];if(!c.closed){var l=o.g+c.cost,p=c.visited;if(!p||l<c.g){if(c.visited=!0,c.parent=o,!c.centroid||!r.centroid)throw new Error("Unexpected state");c.h=c.h||this.heuristic(c.centroid,r.centroid),c.g=l,c.f=c.g+c.h,p?n.rescoreElement(c):n.push(c)}}}}return[]},n.heuristic=function(e,t){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)+Math.abs(e.z-t.z)},n.neighbours=function(e,t){for(var r=[],n=0;n<t.neighbours.length;n++)r.push(e[t.neighbours[n]]);return r};var o=function(){};o.buildZone=function(e){var r=this,n=this._buildNavigationMesh(e),o={};n.vertices.forEach(function(e){e.x=t.roundNumber(e.x,2),e.y=t.roundNumber(e.y,2),e.z=t.roundNumber(e.z,2)}),o.vertices=n.vertices;var i=this._buildPolygonGroups(n);return o.groups=new Array(i.length),i.forEach(function(e,n){var i=new Map;e.forEach(function(e,t){i.set(e,t)});var s=new Array(e.length);e.forEach(function(e,n){var a=[];e.neighbours.forEach(function(e){return a.push(i.get(e))});var h=[];e.neighbours.forEach(function(t){return h.push(r._getSharedVerticesInOrder(e,t))});var u=new THREE.Vector3(0,0,0);u.add(o.vertices[e.vertexIds[0]]),u.add(o.vertices[e.vertexIds[1]]),u.add(o.vertices[e.vertexIds[2]]),u.divideScalar(3),u.x=t.roundNumber(u.x,2),u.y=t.roundNumber(u.y,2),u.z=t.roundNumber(u.z,2),s[n]={id:n,neighbours:a,vertexIds:e.vertexIds,centroid:u,portals:h}}),o.groups[n]=s}),o},o._buildNavigationMesh=function(e){return e.mergeVertices(),this._buildPolygonsFromGeometry(e)},o._buildPolygonGroups=function(e){var t=[],r=function(e){e.neighbours.forEach(function(t){void 0===t.group&&(t.group=e.group,r(t))})};e.polygons.forEach(function(e){void 0!==e.group?t[e.group].push(e):(e.group=t.length,r(e),t.push([e]))});for(var n=-1,o=0,i=0,s=t.length;i<s;++i){var a=t[i].length;a>o&&(o=a,n=i)}return n>=0?[t[n]]:t},o._buildPolygonNeighbours=function(e,t){var r=new Set,n=t[e.vertexIds[1]],o=t[e.vertexIds[2]];return t[e.vertexIds[0]].forEach(function(t){t!==e&&(n.includes(t)||o.includes(t))&&r.add(t)}),n.forEach(function(t){t!==e&&o.includes(t)&&r.add(t)}),r},o._buildPolygonsFromGeometry=function(e){for(var t=this,r=[],n=e.vertices,o=new Array(n.length),i=0;i<n.length;i++)o[i]=[];return e.faces.forEach(function(e){var t={vertexIds:[e.a,e.b,e.c],neighbours:null};r.push(t),o[e.a].push(t),o[e.b].push(t),o[e.c].push(t)}),r.forEach(function(e){e.neighbours=t._buildPolygonNeighbours(e,o)}),{polygons:r,vertices:n}},o._getSharedVerticesInOrder=function(e,t){var r=e.vertexIds,n=r[0],o=r[1],i=r[2],s=t.vertexIds,a=s.includes(n),h=s.includes(o),u=s.includes(i);return a&&h&&u?Array.from(r):a&&h?[n,o]:h&&u?[o,i]:a&&u?[i,n]:(console.warn("Error processing navigation mesh neighbors; neighbors with <2 shared vertices found."),[])};var i=function(){this.portals=[]};i.prototype.push=function(e,t){void 0===t&&(t=e),this.portals.push({left:e,right:t})},i.prototype.stringPull=function(){var e,r,n,o=this.portals,i=[],s=0,a=0,h=0;r=o[0].left,n=o[0].right,i.push(e=o[0].left);for(var u=1;u<o.length;u++){var c=o[u].left,l=o[u].right;if(t.triarea2(e,n,l)<=0){if(!(t.vequal(e,n)||t.triarea2(e,r,l)>0)){i.push(r),r=e=r,n=e,a=s=a,h=s,u=s;continue}n=l,h=u}if(t.triarea2(e,r,c)>=0){if(!(t.vequal(e,r)||t.triarea2(e,n,c)<0)){i.push(n),r=e=n,n=e,a=s=h,h=s,u=s;continue}r=c,a=u}}return 0!==i.length&&t.vequal(i[i.length-1],o[o.length-1].left)||i.push(o[o.length-1].left),this.path=i,i};var s,a=function(){this.zones={}};a.createZone=function(e){return e.isGeometry?console.warn("[three-pathfinding]: Use THREE.BufferGeometry, not THREE.Geometry, to create zone."):e=(new THREE.Geometry).fromBufferGeometry(e),o.buildZone(e)},a.prototype.setZoneData=function(e,t){this.zones[e]=t},a.prototype.getRandomNode=function(e,r,n,o){if(!this.zones[e])return new THREE.Vector3;n=n||null,o=o||0;var i=[];return this.zones[e].groups[r].forEach(function(e){n&&o?t.distanceToSquared(n,e.centroid)<o*o&&i.push(e.centroid):i.push(e.centroid)}),t.sample(i)||new THREE.Vector3},a.prototype.getClosestNode=function(e,r,n,o){void 0===o&&(o=!1);var i=this.zones[r].vertices,s=null,a=Infinity;return this.zones[r].groups[n].forEach(function(r){var n=t.distanceToSquared(r.centroid,e);n<a&&(!o||t.isVectorInPolygon(e,r,i))&&(s=r,a=n)}),s},a.prototype.findPath=function(e,r,o,s,a,h,u){void 0===a&&(a=null),void 0===h&&(h=null),void 0===u&&(u=1.2);var c=this.zones[o].groups[s],l=this.zones[o].vertices;if(a||(a=this.getClosestNode(e,o,s,!0)),h||(h=this.getClosestNode(r,o,s,!0)),!a||!h)return null;var p=n.search(c,a,h),d=function(e,t){for(var r=0;r<e.neighbours.length;r++)if(e.neighbours[r]===t.id)return e.portals[r]},f=new i;f.push(e);for(var v=0;v<p.length;v++){var g=p[v+1];if(g){var E=d(p[v],g),y=l[E[0]].clone(),T=l[E[1]].clone();t.scaleEndpoint(y,T,u),f.push(y,T)}}f.push(r),f.stringPull();var b=f.path.map(function(e){return new THREE.Vector3(e.x,e.y,e.z)});return b.shift(),b},a.prototype.getGroup=(s=new THREE.Plane,function(e,r,n){if(void 0===n&&(n=!1),!this.zones[e])return null;for(var o=null,i=Math.pow(50,2),a=this.zones[e],h=0;h<a.groups.length;h++)for(var u=0,c=a.groups[h];u<c.length;u+=1){var l=c[u];if(n&&(s.setFromCoplanarPoints(a.vertices[l.vertexIds[0]],a.vertices[l.vertexIds[1]],a.vertices[l.vertexIds[2]]),Math.abs(s.distanceToPoint(r))<.01&&t.isPointInPoly([a.vertices[l.vertexIds[0]],a.vertices[l.vertexIds[1]],a.vertices[l.vertexIds[2]]],r)))return h;var p=t.distanceToSquared(l.centroid,r);p<i&&(o=h,i=p)}return o}),a.prototype.getGroupNode=function(){var e=new THREE.Plane;return function(r,n,o){if(void 0===o&&(o=50),!this.zones[r])return null;for(var i=this.zones[r].vertices,s=null,a=-1,h=Math.pow(o,2),u=this.zones[r],c=0;c<u.groups.length;c++)for(var l=0,p=u.groups[c];l<p.length;l+=1){var d=p[l];if(e.setFromCoplanarPoints(i[d.vertexIds[0]],i[d.vertexIds[1]],i[d.vertexIds[2]]),Math.abs(e.distanceToPoint(n))<.01&&t.isPointInPoly([i[d.vertexIds[0]],i[d.vertexIds[1]],i[d.vertexIds[2]]],n))return{groupId:c,node:d,closed:!1};var f=t.distanceToSquared(d.centroid,n);f<h&&(s=d,a=c,h=f)}return s&&(triangle=[i[s.vertexIds[0]],i[s.vertexIds[1]],i[s.vertexIds[2]]]),{groupId:a,node:s,closed:!0,closeTriangle:null}}}(),a.prototype.clampStep=function(){var e,t,r=new THREE.Vector3,n=new THREE.Plane,o=new THREE.Triangle,i=new THREE.Vector3,s=new THREE.Vector3;return function(a,h,u,c,l,p){var d=this.zones[c].vertices,f=this.zones[c].groups[l],v=[u],g={};g[u.id]=0,e=void 0,s.set(0,0,0),t=Infinity,n.setFromCoplanarPoints(d[u.vertexIds[0]],d[u.vertexIds[1]],d[u.vertexIds[2]]),n.projectPoint(h,r),i.copy(r);for(var E=v.pop();E;E=v.pop()){o.set(d[E.vertexIds[0]],d[E.vertexIds[1]],d[E.vertexIds[2]]),o.closestPointToPoint(i,r),r.distanceToSquared(i)<t&&(e=E,s.copy(r),t=r.distanceToSquared(i));var y=g[E.id];if(!(y>2))for(var T=0;T<E.neighbours.length;T++){var b=f[E.neighbours[T]];b.id in g||(v.push(b),g[b.id]=y+1)}}return p.copy(s),e}}();var h={PLAYER:new THREE.Color(15631215).convertGammaToLinear(2.2).getHex(),TARGET:new THREE.Color(14469912).convertGammaToLinear(2.2).getHex(),PATH:new THREE.Color(41903).convertGammaToLinear(2.2).getHex(),WAYPOINT:new THREE.Color(41903).convertGammaToLinear(2.2).getHex(),CLAMPED_STEP:new THREE.Color(14472114).convertGammaToLinear(2.2).getHex(),CLOSEST_NODE:new THREE.Color(4417387).convertGammaToLinear(2.2).getHex()},u=function(e){function t(){var t=this;e.call(this),this._playerMarker=new THREE.Mesh(new THREE.SphereGeometry(.25,32,32),new THREE.MeshBasicMaterial({color:h.PLAYER})),this._targetMarker=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,.3),new THREE.MeshBasicMaterial({color:h.TARGET})),this._nodeMarker=new THREE.Mesh(new THREE.BoxGeometry(.1,.8,.1),new THREE.MeshBasicMaterial({color:h.CLOSEST_NODE})),this._stepMarker=new THREE.Mesh(new THREE.BoxGeometry(.1,1,.1),new THREE.MeshBasicMaterial({color:h.CLAMPED_STEP})),this._pathMarker=new THREE.Object3D,this._pathLineMaterial=new THREE.LineBasicMaterial({color:h.PATH,linewidth:2}),this._pathPointMaterial=new THREE.MeshBasicMaterial({color:h.WAYPOINT}),this._pathPointGeometry=new THREE.SphereBufferGeometry(.08),this._markers=[this._playerMarker,this._targetMarker,this._nodeMarker,this._stepMarker,this._pathMarker],this._markers.forEach(function(e){e.visible=!1,t.add(e)})}return e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t,t.prototype.setPath=function(e){for(;this._pathMarker.children.length;)this._pathMarker.children[0].visible=!1,this._pathMarker.remove(this._pathMarker.children[0]);e=[this._playerMarker.position].concat(e);for(var t=new THREE.Geometry,r=0;r<e.length;r++)t.vertices.push(e[r].clone().add(new THREE.Vector3(0,.2,0)));this._pathMarker.add(new THREE.Line(t,this._pathLineMaterial));for(var n=0;n<e.length-1;n++){var o=new THREE.Mesh(this._pathPointGeometry,this._pathPointMaterial);o.position.copy(e[n]),o.position.y+=.2,this._pathMarker.add(o)}return this._pathMarker.visible=!0,this},t.prototype.setPlayerPosition=function(e){return this._playerMarker.position.copy(e),this._playerMarker.visible=!0,this},t.prototype.setTargetPosition=function(e){return this._targetMarker.position.copy(e),this._targetMarker.visible=!0,this},t.prototype.setNodePosition=function(e){return this._nodeMarker.position.copy(e),this._nodeMarker.visible=!0,this},t.prototype.setStepPosition=function(e){return this._stepMarker.position.copy(e),this._stepMarker.visible=!0,this},t.prototype.reset=function(){for(;this._pathMarker.children.length;)this._pathMarker.children[0].visible=!1,this._pathMarker.remove(this._pathMarker.children[0]);return this._markers.forEach(function(e){e.visible=!1}),this},t}(THREE.Object3D);e.Pathfinding=a,e.PathfindingHelper=u});
//# sourceMappingURL=three-pathfinding.umd.js.map
