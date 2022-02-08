"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
const Vector_1 = require("./Vector");
class Circle {
    constructor(radius, center) {
        this.radius = radius;
        this.p = center;
    }
    getPoint(t) {
        if (2 * Math.PI < t) {
            return this.getPoint(t % (2 * Math.PI));
        }
        if (t < 0) {
            return this.getPoint(0);
        }
        let tmp = new Vector_1.Vector(Math.cos(t), Math.sin(t));
        tmp = Vector_1.Vector.mult(tmp, this.radius);
        return Vector_1.Vector.add(this.p.clone(), tmp);
    }
    getCenter() {
        return this.p.clone();
    }
    getTangent(t) {
        return new Vector_1.Vector(-1 * Math.sin(t), Math.cos(t));
    }
}
exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map