"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptCheck = exports.interceptChecks = exports.rayCheck = exports.rayChecks = void 0;
const Line_1 = require("./Line");
const Circle_1 = require("./Circle");
const Rect_1 = require("./Rect");
const Vector_1 = require("./Vector");
class Intercept {
    constructor(exists, t1, t2) {
        this.exists = exists;
        this.t1 = t1;
        this.t2 = t2;
    }
}
function rayChecks(ray, colliders) {
    for (let i1 = 0; i1 < colliders.length; i1++) {
        if (rayCheck(ray, colliders[i1]) >= 0) {
            return i1;
        }
    }
    return -1;
}
exports.rayChecks = rayChecks;
function rayCheck(ray, p) {
    console.log("Ray Check");
    console.log(p);
    let intercept = getIntercept(ray, p);
    if (intercept.exists) {
        return getIntercept(ray, p).t1;
    }
    return -1;
}
exports.rayCheck = rayCheck;
function interceptChecks(p1, paths, ignoreIndex) {
    let tmp = [];
    for (let i = 0; i < paths.length; i++) {
        if (!ignoreIndex.includes(i)) {
            if (interceptCheck(p1, paths[i])) {
                tmp.push(i);
            }
        }
    }
    return tmp;
}
exports.interceptChecks = interceptChecks;
function interceptCheck(p1, p2) {
    let line;
    let i;
    if (p1 instanceof Line_1.Line && p2 instanceof Line_1.Line) {
        let i = LineLineIntercept(p1, p2);
        return i.exists;
    }
    else if (p1 instanceof Line_1.Line) {
        line = p1;
        if (p2 instanceof Circle_1.Circle) {
            i = LineCircleIntercept(line, p2);
        }
        else {
            i = LineRectIntercept(line, p2);
        }
        return i.exists;
    }
    else if (p2 instanceof Line_1.Line) {
        line = p2;
        if (p1 instanceof Circle_1.Circle) {
            i = LineCircleIntercept(line, p1);
        }
        else {
            i = LineRectIntercept(line, p1);
        }
        return i.exists;
    }
    let dist = Vector_1.Vector.sub(p2.getCenter(), p1.getCenter());
    line = new Line_1.Line(p1.getCenter(), Vector_1.Vector.normalize(dist), Vector_1.Vector.dist(dist));
    let t1 = getIntercept(line, p1);
    let t2 = getIntercept(line, p2);
    return t2.t1 <= t1.t1 && t1.exists && t2.exists;
}
exports.interceptCheck = interceptCheck;
function getIntercept(line, p) {
    if (p instanceof Line_1.Line) {
        return LineLineIntercept(line, p);
    }
    else if (p instanceof Circle_1.Circle) {
        return LineCircleIntercept(line, p);
    }
    else if (p instanceof Rect_1.Rect) {
        return LineRectIntercept(line, p);
    }
    throw new Error("Error");
}
function LineLineIntercept(l1, l2) {
    let tmp = new Intercept(true, 0, 0);
    let v1, v2;
    v1 = l1.gradient;
    v2 = l2.gradient;
    /*
        let n1 : number = v1.x * v2.y - v2.x * v1.y;
    
        if(n1 == 0) {
            //check if paralel
            tmp.exists = false;
        }
        else
        {
            tmp.t1 = (l2.p.x * v2.y + l1.p.y * v2.x) - (v2.x * l2.p.x + v2.y * l1.p.x)
            tmp.t1 /= n1;
    
            if(0 <= tmp.t1 && tmp.t1 <= l1.l) {
                if(v2.x != 0) {
                    tmp.t2 = (l1.getPoint(tmp.t1).x - l2.p.x) / v2.x;
                }
                else {
                    tmp.t2 = (l1.getPoint(tmp.t1).y - l2.p.y) / v2.y;
                }
    
                if(0 <= tmp.t2 && tmp.t2 <= l2.l) {
                    tmp.exists = false;
                }
            }
            else
            {
                tmp.exists = false;
            }
            
        }
        */
    if (l2.gradient.x * l1.gradient.y != l1.gradient.x * l2.gradient.y && l2.gradient.x != 0) {
        tmp.t1 = (l2.gradient.y * (l1.p.x - l2.p.x) + l2.gradient.x * (l2.p.y - l1.p.y)) / (l2.gradient.x * l1.gradient.y - l1.gradient.x * l2.gradient.y);
        tmp.t2 = (l1.gradient.y * (l1.p.x - l2.p.x) + l1.gradient.x * (l2.p.y - l1.p.y)) / (l2.gradient.x * l1.gradient.y - l1.gradient.x * l2.gradient.y);
    }
    else if (l2.gradient.x == 0 && l1.gradient.x != 0 && l2.gradient.y != 0) {
        tmp.t1 = (l2.p.x - l1.p.x) / l1.gradient.x;
        tmp.t2 = (-l1.p.x * l1.gradient.y + l1.gradient.x * l1.p.y - l1.gradient.x * l2.p.y + l2.p.x * l1.gradient.y) / (l1.gradient.x * l2.gradient.y);
    }
    else {
        tmp.exists = false;
    }
    if (!(0 <= tmp.t1 && tmp.t1 <= l1.l)) {
        tmp.exists = false;
    }
    else if (!(0 <= tmp.t2 && tmp.t2 <= l2.l)) {
        tmp.exists = false;
    }
    return tmp;
}
function LineCircleIntercept(l, c) {
    let tmp = new Intercept(true, 0, 0);
    let xDelta = c.p.x - l.p.x;
    let yDelta = c.p.y - l.p.y;
    let a1 = Math.pow(l.gradient.x, 2) + Math.pow(l.gradient.y, 2);
    let b1 = -2 * (xDelta * l.gradient.x + yDelta * l.gradient.y);
    let c1 = Math.pow(xDelta, 2) + Math.pow(yDelta, 2) - Math.pow(c.radius, 2);
    if (c.radius != 0 && 0 <= Math.pow(b1, 2) - 4 * a1 * c1) {
        tmp.t1 = (-1 * b1 - Math.sqrt(Math.pow(b1, 2) - 4 * a1 * c1)) / (2 * a1);
        if (0 <= tmp.t1) {
            //place holder for t2 calculation
        }
        else {
            //place holder for t2 calculation
            tmp.t1 = (-1 * b1 + Math.sqrt(Math.pow(b1, 2) - 4 * a1 * c1)) / (2 * a1);
        }
    }
    else {
        tmp.exists = false;
    }
    if (!(0 <= tmp.t1 && tmp.t1 <= l.l)) {
        tmp.exists = false;
    }
    return tmp;
}
function LineRectIntercept(l, r) {
    let tmp = new Intercept(false, 0, 0);
    for (let i1 = 0; i1 < 4; i1++) {
        tmp = LineLineIntercept(l, r.getEdge(i1));
        if (tmp.exists) {
            break;
        }
    }
    return tmp;
}
//# sourceMappingURL=Intercept.js.map