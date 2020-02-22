class Utils {

  static roundNumber (value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  static sample (list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  static distanceToSquared (a, b) {

    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;

    return dx * dx + dy * dy + dz * dz;

  }

  //+ Jonas Raoni Soares Silva
  //@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
  static isPointInPoly (poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].z <= pt.z && pt.z < poly[j].z) || (poly[j].z <= pt.z && pt.z < poly[i].z)) && (pt.x < (poly[j].x - poly[i].x) * (pt.z - poly[i].z) / (poly[j].z - poly[i].z) + poly[i].x) && (c = !c);
    return c;
  }

  static isVectorInPolygon (vector, polygon, vertices) {

    // reference point will be the centroid of the polygon
    // We need to rotate the vector as well as all the points which the polygon uses

    var lowestPoint = 100000;
    var highestPoint = -100000;

    var polygonVertices = [];

    polygon.vertexIds.forEach((vId) => {
      lowestPoint = Math.min(vertices[vId].y, lowestPoint);
      highestPoint = Math.max(vertices[vId].y, highestPoint);
      polygonVertices.push(vertices[vId]);
    });

    if (vector.y < highestPoint + 0.5 && vector.y > lowestPoint - 0.5 &&
      this.isPointInPoly(polygonVertices, vector)) {
      return true;
    }
    return false;
  }

  static triarea2 (a, b, c) {
    var ax = b.x - a.x;
    var az = b.z - a.z;
    var bx = c.x - a.x;
    var bz = c.z - a.z;
    return bx * az - ax * bz;
  }

  static vequal (a, b) {
    return this.distanceToSquared(a, b) < 0.00001;
  }

  static scaleEndpoint(a,b,r){
    let sub = new THREE.Vector3();
    sub.subVectors(a,b);
    let len = sub.length();
    let f = 0.6;
    if(len>r*2){
      f = 1-r/len;
    }
    let aa = a.clone();
    a.addVectors( b, sub.multiplyScalar(f));
    b.addVectors( aa, sub.negate());
    a.x = this.roundNumber(a.x, 2);
    a.y = this.roundNumber(a.y, 2);
    a.z = this.roundNumber(a.z, 2);
    b.x = this.roundNumber(b.x, 2);
    b.y = this.roundNumber(b.y, 2);
    b.z = this.roundNumber(b.z, 2);
 }

}

export { Utils };
