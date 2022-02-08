"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillBall = exports.Edge = void 0;
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const BezierCurve_1 = require("./BezierCurve");
const Circle_1 = require("./Circle");
const Line_1 = require("./Line");
const Vector_1 = require("./Vector");
class Edge {
    constructor(ball1, ball2) {
        if (ball1.id < ball2.id) {
            this.ball1 = ball1;
            this.ball2 = ball2;
        }
        else {
            this.ball2 = ball1;
            this.ball1 = ball2;
        }
    }
}
exports.Edge = Edge;
class SkillBall extends Circle_1.Circle {
    constructor(id, radius, start, intialVelocity, mass, environment, iconName) {
        super(radius, start);
        this.radiusAnim = null;
        //physics
        this.slowCond = true;
        //connected balls
        this.connections = [];
        this.intialRadius = radius;
        this.id = id;
        this.vel = intialVelocity;
        this.mass = mass;
        this.scale = 1;
        this.iconName = iconName;
        this.element = this.buidHTML(this.id, this.iconName, environment);
        this.movementLine = new Line_1.Line(this.p, this.vel, -1);
        this.setRadius(0);
        this.setLerpRadius(radius * 0.5, 0.5, SkillBall.creationAnimation);
    }
    static addEdge(ball1, ball2) {
        let tmp = new Edge(ball1, ball2);
        if (this.edgeList.length == 0) {
            this.edgeList.push(tmp);
            return;
        }
        let id1, id2;
        id1 = tmp.ball1.id;
        id2 = tmp.ball2.id;
        if (id1 == id2) {
            return;
        }
        let start = 0;
        let end = this.edgeList.length - 1;
        let pointer;
        let edgeTmp;
        while (end - start < 0) {
            pointer = start + Math.floor((end - start) / 2);
            edgeTmp = this.edgeList[pointer];
            if (edgeTmp.ball1.id == id1) {
                if (edgeTmp.ball2.id == id2) {
                    return;
                }
                //first half
                if (id2 < edgeTmp.ball2.id) {
                    end = pointer;
                } //secodn half
                else {
                    start = pointer;
                }
            }
            else if (id1 < edgeTmp.ball1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        if (edgeTmp.ball1.id == id1 && edgeTmp.ball2.id == id2) {
            return;
        }
        this.edgeList.splice(start + 1, 0, tmp);
    }
    static findEdge(ball1, ball2) {
        if (this.edgeList.length == 0) {
            return null;
        }
        let id1, id2;
        if (ball1 instanceof SkillBall) {
            id1 = ball1.id;
        }
        else {
            id1 = ball1;
        }
        if (ball2 instanceof SkillBall) {
            id2 = ball2.id;
        }
        else {
            id2 = ball2;
        }
        if (id2 < id1) {
            let tmp = id1;
            id1 = id2;
            id2 = tmp;
        }
        let start = 0;
        let end = this.edgeList.length - 1;
        let pointer;
        let edgeTmp;
        while (end - start < 0) {
            pointer = start + Math.floor((end - start) / 2);
            edgeTmp = this.edgeList[pointer];
            if (edgeTmp.ball1.id == id1) {
                if (edgeTmp.ball2.id == id2) {
                    return edgeTmp;
                }
                //first half
                if (id2 < edgeTmp.ball2.id) {
                    end = pointer;
                } //secodn half
                else {
                    start = pointer;
                }
            }
            else if (id1 < edgeTmp.ball1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        if (edgeTmp.ball1.id == id1 && edgeTmp.ball2.id == id2) {
            return edgeTmp;
        }
        return null;
    }
    buidHTML(id, iconName, environment) {
        let elem = new HTMLBuilder_1.HTMLElem("div");
        let image = new HTMLBuilder_1.HTMLElem("img");
        let ballId = elem.get("id");
        ballId.push(new HTMLBuilder_1.AttrVal(`ball-${id}`));
        let ballclass = elem.get("class");
        ballclass.push(new HTMLBuilder_1.AttrVal("ball"));
        let imageLocation = image.get("src");
        imageLocation.push(new HTMLBuilder_1.AttrVal(`${SkillBall.mediaImageFolder}\\${iconName}_icon.svg`));
        elem.addChild(image);
        //create dom
        environment.append(elem.generate());
        let tmp = environment.find(`#ball-${id}`);
        ;
        //setting functionality
        let skillBall = this;
        tmp.on("click", function () {
            skillBall.onClick();
        });
        tmp.on("mouseenter", function () {
            skillBall.onMouseEnter();
        });
        tmp.on("mouseleave", function () {
            skillBall.onMouseLeave();
        });
        return tmp;
    }
    onMouseEnter() {
        this.setLerpRadius(this.intialRadius, 0.25, null);
        this.slowCond = false;
    }
    onMouseLeave() {
        this.setLerpRadius(this.intialRadius * 0.5, 0.25, null);
        this.slowCond = true;
    }
    onClick() {
        this.foo("click", this.id, this.iconName);
    }
    foo(action, id, iconName) {
        console.log(`${action}:${id}-${iconName}`);
    }
    bounce(collisionPlane) {
        let parallel = collisionPlane;
        let orthogonal = new Vector_1.Vector(parallel.y, -1 * parallel.x);
        let v1 = Vector_1.Vector.mult(Vector_1.Vector.projection(this.vel, orthogonal), -1);
        let v2 = Vector_1.Vector.projection(this.vel, parallel);
        this.vel = Vector_1.Vector.add(v1, v2);
    }
    setLerpRadius(radius, duration, animationCurve) {
        if (radius < 0) {
            return false;
        }
        let animation;
        if (animationCurve == null || animationCurve == undefined) {
            animation = SkillBall.defaultAnimation.Clone();
        }
        else {
            animation = animationCurve.Clone();
        }
        let durationTmp;
        if (duration == null || duration == undefined) {
            durationTmp = 1;
        }
        else {
            durationTmp = duration;
        }
        let delta = radius - this.radius;
        let start = this.radius;
        animation.parameters.forEach(p => {
            p.y = start + delta * p.y;
        });
        this.radiusAnim = {
            duration: durationTmp,
            time: 0,
            animationCurve: animation,
            target: radius
        };
        return true;
    }
    setRadius(radius) {
        if (radius < 0) {
            return false;
        }
        this.radius = radius;
        this.scale = radius / this.intialRadius;
        return true;
    }
    updateRadius(time) {
        if (this.radiusAnim == null) {
            return;
        }
        let deltaRadius = Math.abs(this.radius - this.radiusAnim.target);
        if (deltaRadius > 0.01) {
            this.radiusAnim.time += time;
            let pos = this.radiusAnim.time / this.radiusAnim.duration;
            if (pos > 1) {
                this.radius = this.radiusAnim.target;
                return;
            }
            this.setRadius(this.radiusAnim.animationCurve.getPoint(pos).y);
        }
        else {
            this.radiusAnim = null;
        }
    }
    toString() {
        return `radius:${this.radius}\np:${this.p.x},${this.p.y}\ndir:${this.vel.x},${this.vel.y}`;
    }
    move(time) {
        if (!this.slowCond) {
            time = time / 4;
        }
        this.movementLine.p = this.p;
        this.movementLine.gradient = this.vel;
        this.p = this.movementLine.getPoint(time);
        //update radius
        this.updateRadius(time);
    }
    destroy() {
    }
}
exports.SkillBall = SkillBall;
SkillBall.mediaImageFolder = "src\\media\\img\\icons";
SkillBall.creationAnimation = new BezierCurve_1.BezierCurve([
    new Vector_1.Vector(0, 0),
    new Vector_1.Vector(1, 0),
    new Vector_1.Vector(0.1, 1.5),
    new Vector_1.Vector(1, 1)
]);
SkillBall.defaultAnimation = new BezierCurve_1.BezierCurve([
    new Vector_1.Vector(0, 0),
    new Vector_1.Vector(1, 1)
]);
SkillBall.edgeList = [];
//# sourceMappingURL=SkillBall.js.map