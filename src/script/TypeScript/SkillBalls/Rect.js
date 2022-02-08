"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
const Line_1 = require("./Line");
const Vector_1 = require("./Vector");
class Rect {
    constructor(width, height, rotation, startPoint) {
        this.perimeter = 0;
        this.edges = [new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0), new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0), new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0), new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0)];
        this.width = width;
        this.height = height;
        this.start = startPoint;
        this.theta = rotation;
        this.generateEdges();
    }
    getWidth() {
        return this.width;
    }
    setWidth(width) {
        this.width = width;
        this.generateEdges();
    }
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        this.height = height;
        this.generateEdges();
    }
    getRot() {
        return this.theta;
    }
    setRot(rotation) {
        this.theta = rotation;
        this.generateEdges();
    }
    getStart() {
        return this.start;
    }
    setStart(start) {
        this.start = start;
        this.generateEdges();
    }
    getEdge(edgeId) {
        if (edgeId < 0 || 4 <= edgeId) {
            throw new Error();
        }
        let tmp = this.edges[edgeId];
        return new Line_1.Line(tmp.p, tmp.gradient, tmp.l);
    }
    getPoint(t) {
        let dist = t % this.perimeter;
        for (let i1 = 0; i1 < 4; i1++) {
            if (dist < this.edges[i1].l) {
                return this.edges[i1].getPoint(dist);
            }
            dist -= this.edges[i1].l;
        }
        return new Vector_1.Vector(0, 0);
    }
    getCenter() {
        let p1 = this.edges[0].getPoint(this.edges[0].l / 2);
        let p2 = this.edges[1].getPoint(this.edges[1].l / 2);
        p1 = Vector_1.Vector.add(p1, Vector_1.Vector.mult(this.edges[0].p, -1));
        p2 = Vector_1.Vector.add(p2, Vector_1.Vector.mult(this.edges[1].p, -1));
        return Vector_1.Vector.add(this.start, Vector_1.Vector.add(p1, p2));
    }
    generateEdges() {
        let l1 = 0;
        let dir;
        let p = this.start;
        let angle = this.theta;
        for (let i1 = 0; i1 < 4; i1++) {
            switch (i1) {
                case 0:
                case 2:
                    l1 = this.width;
                    break;
                case 1:
                case 3:
                    l1 = this.height;
                    break;
            }
            dir = new Vector_1.Vector(Math.cos(angle), Math.sin(angle));
            this.edges[i1] = new Line_1.Line(p, dir, l1);
            p = this.edges[i1].getPoint(this.edges[i1].l);
            angle += Math.PI / 2;
        }
        this.perimeter = 2 * this.width + 2 * this.height;
    }
}
exports.Rect = Rect;
//# sourceMappingURL=Rect.js.map