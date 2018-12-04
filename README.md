# three-pathfinding

[![Latest NPM release](https://img.shields.io/npm/v/three-pathfinding.svg)](https://www.npmjs.com/package/three-pathfinding)
[![Minzipped size](https://badgen.net/bundlephobia/minzip/three-pathfinding)](https://bundlephobia.com/result?p=three-pathfinding)
[![License](https://img.shields.io/npm/l/three-pathfinding.svg)](https://github.com/donmccurdy/three-pathfinding/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/donmccurdy/three-pathfinding.svg?branch=master)](https://travis-ci.com/donmccurdy/three-pathfinding)

Navigation mesh toolkit for ThreeJS, based on [PatrolJS](https://github.com/nickjanssen/PatrolJS). Computes paths between points on a 3D nav mesh, supports multiple zones, and clamps movement vectors for FPS controls. To learn how to create a navigation mesh using Blender, see [Creating a Nav Mesh](https://www.donmccurdy.com/2017/08/20/creating-a-nav-mesh-for-a-webvr-scene/).

Thanks to [Nick Janssen](https://github.com/nickjanssen) for creating [PatrolJS](https://github.com/nickjanssen/PatrolJS), which was the basis for this library.

![screenshot](https://user-images.githubusercontent.com/1848368/34424850-d79e5a24-ebf4-11e7-87c4-afc75cdc41bd.png)

## Introduction

Traditionally games and 3D apps used waypoints to help their AI agents navigate. This is bad and has a lot of problems, but is generally easier to implement than navigation meshes. Navmeshes are far more accurate, faster, and take into account the size of the AI agent (e.g. tanks require move space to maneuver than soldiers).

For a thorough introduction to Navigation mesh pathfinding, see AI Blog's article, [Fixing Pathfinding Once and For All](https://web.archive.org/web/20110807104022/http://www.ai-blog.net:80/archives/000152.html).

## Quickstart

### Installation

```
npm install --save three-pathfinding
```

### Creating a Navigation Mesh

This library does not build navigation meshes for you — instead, create a navigation mesh using [Blender](https://youtu.be/v4d_6ZCGlAg?t=6m8s), [Recast](https://github.com/recastnavigation/recastnavigation) ([CLI](https://github.com/but0n/recastCLI.js)), or another tool.

Currently, this library does not accept the custom navigation mesh file formats created by tools like Recast.
Instead, you will need to export the navigation mesh to a 3D model format (like OBJ or glTF) and then load it
with one of the three.js loaders, like THREE.OBJLoader or THREE.GLTFLoader. The library accepts a [THREE.BufferGeometry](https://threejs.org/docs/#api/core/BufferGeometry) instance.

### Example

Loading a mesh from a `.gltf` file:

```js
// For ES6, see: https://github.com/mrdoob/three.js/issues/9562
// CommonJS
const THREE = window.THREE = require('three');
require('three/examples/js/loaders/GLTFLoader.js');

let navmesh;

const loader = new THREE.GLTFLoader();
loader.load( 'navmesh.gltf', ({scene}) => {
    scene.traverse((node) => {
        if (node.isMesh) navmesh = node;
    });
}, undefined, (e) => {
    console.error(e);
});
```

Initializing the library, creating a level, and finding a path:

```js
// ES6
import { Pathfinding } from 'three-pathfinding';
// CommonJS
const { Pathfinding } = require('three-pathfinding');
// UMD
const Pathfinding = window.threePathfinding.Pathfinding;

// Create level.
const pathfinding = new Pathfinding();
const ZONE = 'level1';
pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry));

// Find path from A to B.
const groupID = pathfinding.getGroup(ZONE, a);
const path = pathfinding.findPath(a, b, ZONE, groupID);
```

### Running the demo locally

```
git clone https://github.com/donmccurdy/three-pathfinding.git
cd three-pathfinding

npm install
npm run dev
```

The demo will start at http://localhost:9966/demo/.

## API

<!--- API BEGIN --->

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Pathfinding][1]
    -   [setZoneData][2]
    -   [getRandomNode][3]
    -   [getClosestNode][4]
    -   [findPath][5]
    -   [getGroup][6]
    -   [clampStep][7]
    -   [createZone][8]
-   [PathfindingHelper][9]
    -   [setPath][10]
    -   [setPlayerPosition][11]
    -   [setTargetPosition][12]
    -   [setNodePosition][13]
    -   [setStepPosition][14]
    -   [reset][15]
-   [Zone][16]
-   [Group][17]
-   [Node][18]

## Pathfinding

Defines an instance of the pathfinding module, with one or more zones.

### setZoneData

Sets data for the given zone.

**Parameters**

-   `zoneID` **[string][19]**
-   `zone` **[Zone][20]**

### getRandomNode

Returns a random node within a given range of a given position.

**Parameters**

-   `zoneID` **[string][19]**
-   `groupID` **[number][21]**
-   `nearPosition` **THREE.Vector3**
-   `nearRange` **[number][21]**

Returns **[Node][22]**

### getClosestNode

Returns the closest node to the target position.

**Parameters**

-   `position` **THREE.Vector3**
-   `zoneID` **[string][19]**
-   `groupID` **[number][21]**
-   `checkPolygon` **[boolean][23]**  (optional, default `false`)

Returns **[Node][22]**

### findPath

Returns a path between given start and end points. If a complete path
cannot be found, will return the nearest endpoint available.

**Parameters**

-   `startPosition` **THREE.Vector3** Start position.
-   `targetPosition` **THREE.Vector3** Destination.
-   `zoneID` **[string][19]** ID of current zone.
-   `groupID` **[number][21]** Current group ID.

Returns **[Array][24]&lt;THREE.Vector3>** Array of points defining the path.

### getGroup

Returns closest node group ID for given position.

**Parameters**

-   `zoneID` **[string][19]**
-   `position` **THREE.Vector3**

Returns **[number][21]**

### clampStep

Clamps a step along the navmesh, given start and desired endpoint. May be
used to constrain first-person / WASD controls.

**Parameters**

-   `start` **THREE.Vector3**
-   `end` **THREE.Vector3** Desired endpoint.
-   `node` **[Node][22]**
-   `zoneID` **[string][19]**
-   `groupID` **[number][21]**
-   `endTarget` **THREE.Vector3** Updated endpoint.

Returns **[Node][22]** Updated node.

### createZone

(Static) Builds a zone/node set from navigation mesh geometry.

**Parameters**

-   `geometry` **THREE.BufferGeometry**

Returns **[Zone][20]**

## PathfindingHelper

**Extends THREE.Object3D**

Helper for debugging pathfinding behavior.

### setPath

**Parameters**

-   `path`

Returns **this**

### setPlayerPosition

**Parameters**

-   `position` **THREE.Vector3**

Returns **this**

### setTargetPosition

**Parameters**

-   `position` **THREE.Vector3**

Returns **this**

### setNodePosition

**Parameters**

-   `position` **THREE.Vector3**

Returns **this**

### setStepPosition

**Parameters**

-   `position` **THREE.Vector3**

Returns **this**

### reset

Hides all markers.

Returns **this**

## Zone

Defines a zone of interconnected groups on a navigation mesh.

**Properties**

-   `groups` **[Array][24]&lt;[Group][25]>**

## Group

Defines a group within a navigation mesh.

## Node

Defines a node (or polygon) within a group.

**Properties**

-   `id` **[number][21]**
-   `neighbours` **[Array][24]&lt;[number][21]>** IDs of neighboring nodes.
-   `centroid` **THREE.Vector3**
-   `portals` **[Array][24]&lt;[Array][24]&lt;[number][21]>>** Array of portals, each defined by two vertex IDs.
-   `closed` **[boolean][23]**
-   `cost` **[number][21]**

[1]: #pathfinding

[2]: #setzonedata

[3]: #getrandomnode

[4]: #getclosestnode

[5]: #findpath

[6]: #getgroup

[7]: #clampstep

[8]: #createzone

[9]: #pathfindinghelper

[10]: #setpath

[11]: #setplayerposition

[12]: #settargetposition

[13]: #setnodeposition

[14]: #setstepposition

[15]: #reset

[16]: #zone

[17]: #group

[18]: #node

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[20]: #zone

[21]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[22]: #node

[23]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[24]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[25]: #group
<!--- API END --->

## Thanks to

* [PatrolJS](https://github.com/nickjanssen/PatrolJS)
* [bgrin's astar library](https://github.com/bgrins/javascript-astar)
* [Digesting Duck's Simple Stupid Funnel Algorithm](http://digestingduck.blogspot.jp/2010/03/simple-stupid-funnel-algorithm.html)
* [Recastnavigation's level mesh](https://github.com/memononen/recastnavigation)
* [Constrained Movement Along Navmesh pt. 3](http://digestingduck.blogspot.com/2010/07/constrained-movement-along-navmesh-pt-3.html?m=1)
