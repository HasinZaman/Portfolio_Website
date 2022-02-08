"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
const Vector_1 = require("./Vector");
class Line {
    constructor(p, gradient, length) {
        this.p = p;
        this.gradient = gradient;
        this.l = length;
    }
    pointExist(v) {
        let t1 = (v.x - this.p.x) / this.gradient.x;
        let t2 = (v.y - this.p.y) / this.gradient.y;
        if (this.l < 0) {
            return t1 === t2;
        }
        return t1 == t2 && 0 <= t1 && t1 <= this.l;
    }
    getPoint(t) {
        if (0 <= this.l) {
            if (this.l < t) {
                return this.getPoint(t % this.l);
            }
            if (t <= 0) {
                return this.p.clone();
            }
        }
        return Vector_1.Vector.add(this.p, Vector_1.Vector.mult(this.gradient, t));
    }
    getCenter() {
        if (0 < this.l) {
            return this.p.clone();
        }
        return this.getPoint(this.l / 2);
    }
}
exports.Line = Line;
//# sourceMappingURL=Line.js.map