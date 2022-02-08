(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasController = void 0;
const Vector_1 = require("../SkillBalls/Vector");
class CanvasController {
    constructor(context, virtualSize, resolution) {
        this.context = context;
        this.size = virtualSize;
        this.resolution = resolution;
        this.scaleFactor = new Vector_1.Vector(resolution.x / virtualSize.x, resolution.y / virtualSize.y);
        //this.context.scale(10, 10);
    }
    static factory(canvasID, virtualSize, resolution) {
        let jQuery;
        let id;
        let context;
        if (typeof canvasID === "string") {
            jQuery = $(canvasID);
        }
        else {
            jQuery = canvasID;
        }
        if (jQuery[0] == undefined) {
            return undefined;
        }
        id = jQuery.attr("id");
        if (!CanvasController.instances.has(id)) {
            context = jQuery[0].getContext("2d");
            let tmp = new CanvasController(context, virtualSize, resolution);
            CanvasController.instances.set(id, tmp);
            //jQuery.css("width",`${tmp.resolution.x}px`);
            jQuery.attr("width", `${tmp.resolution.x}px`);
            //jQuery.css("height",`${tmp.resolution.y}px`);
            jQuery.attr("height", `${tmp.resolution.y}px`);
            //jQuery.css("transform",`scale(${1/tmp.scaleFactor.x},${1/tmp.scaleFactor.y})`);
        }
        return CanvasController.instances.get(id);
    }
    drawLine(start, end, width, colour) {
        this.context.lineWidth = width * this.scaleFactor.x;
        this.context.strokeStyle = colour;
        //console.log("line")
        //console.log(start);
        //console.log(end);
        this.context.beginPath();
        this.context.moveTo(start.x * 10, (this.size.y - start.y) * 10);
        this.context.lineTo(end.x * 10, (this.size.y - end.y) * 10);
        this.context.closePath();
        this.context.stroke();
    }
    clear() {
        this.context.clearRect(0, 0, this.resolution.x, this.resolution.y);
    }
}
exports.CanvasController = CanvasController;
CanvasController.instances = new Map();

},{"../SkillBalls/Vector":11}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLElem = exports.StyleAttr = exports.AttrVal = void 0;
class KeyValuePair {
    constructor(key, values) {
        this.key = key;
        this.values = [];
        for (let i1 = 0; i1 < values.length; i1++) {
            this.values.push(values[i1]);
        }
    }
    generate() {
        let valueStr = "";
        if (this.values.length === 0) {
            return "";
        }
        for (let i1 = 0; i1 < this.values.length; i1++) {
            valueStr += this.values[i1].generate();
        }
        return `${this.key}=\"${valueStr}\" `;
    }
}
class AttrVal {
    constructor(value) {
        this.value = value;
    }
    generate() {
        return this.value;
    }
}
exports.AttrVal = AttrVal;
class StyleAttr {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    generate() {
        return `${this.key}:${this.value};`;
    }
}
exports.StyleAttr = StyleAttr;
class HTMLElem {
    constructor(type) {
        this.type = type;
        this.attr = [new KeyValuePair("id", []), new KeyValuePair("class", [])];
        this.children = [];
    }
    get(key) {
        let tmp = this.attr.find(kvp => kvp.key === key);
        if (tmp == null) {
            tmp = new KeyValuePair(key, []);
            this.attr.push(tmp);
        }
        return tmp.values;
    }
    addChild(child) {
        this.children.push(child);
    }
    generate() {
        let childrentStr = "";
        let attrStr = "";
        for (let i1 = 0; i1 < this.children.length; i1++) {
            childrentStr += `${this.children[i1].generate()}\n`;
        }
        for (let i1 = 0; i1 < this.attr.length; i1++) {
            attrStr += `${this.attr[i1].generate()} `;
        }
        return `<${this.type} ${attrStr}>${childrentStr}</${this.type}>`;
    }
}
exports.HTMLElem = HTMLElem;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BezierCurve = void 0;
const Line_1 = require("./Line");
const Vector_1 = require("./Vector");
class BezierCurve {
    constructor(parameters) {
        this.parameters = [];
        if (parameters.length < 2) {
            throw new Error("parameters must have atleast size 2");
        }
        this.parameters = parameters;
    }
    getPoint(t) {
        if (t < 0 || 1 < t) {
            throw new Error("out of range [0,1]");
        }
        let line;
        let parameterTmp = Object.assign([], this.parameters);
        let linesTmp;
        while (parameterTmp.length > 1) {
            //create lines
            linesTmp = [];
            for (let i1 = 0; i1 < parameterTmp.length - 1; i1++) {
                linesTmp.push(new Line_1.Line(parameterTmp[i1], Vector_1.Vector.sub(parameterTmp[i1 + 1], parameterTmp[i1]), -1));
            }
            //update paramterTmp with new values at t
            parameterTmp = [];
            for (let i1 = 0; i1 < linesTmp.length; i1++) {
                parameterTmp.push(linesTmp[i1].getPoint(t));
            }
        }
        return parameterTmp[0];
    }
    getCenter() {
        return this.getPoint(0.5);
    }
    Clone() {
        let tmp = [];
        this.parameters.forEach(p => {
            tmp.push(p.clone());
        });
        return new BezierCurve(tmp);
    }
}
exports.BezierCurve = BezierCurve;

},{"./Line":8,"./Vector":11}],4:[function(require,module,exports){
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

},{"./Vector":11}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasController_1 = require("../CanvasController/CanvasController");
const Circle_1 = require("./Circle");
const Intercept_1 = require("./Intercept");
const ISkillBallGenerator_1 = require("./ISkillBallGenerator");
const Line_1 = require("./Line");
const SkillBall_1 = require("./SkillBall");
const Vector_1 = require("./Vector");
class OneBall extends ISkillBallGenerator_1.ISkillBallGenerator {
    generate(ballSize) {
        return [new SkillBall_1.SkillBall(1, ballSize.x / 2, new Vector_1.Vector((enviormentSize.x - ballSize.x) / 2, (enviormentSize.y - ballSize.y) / 2), Vector_1.Vector.mult(new Vector_1.Vector(1, 1), 100), 1, skillBox, "javascript")];
    }
}
class TwoBall extends ISkillBallGenerator_1.ISkillBallGenerator {
    generate(ballSize) {
        return [
            new SkillBall_1.SkillBall(1, ballSize.x / 2, new Vector_1.Vector((enviormentSize.x - ballSize.x) / 4, (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(0.5, 1), 100), 1, skillBox, "javascript"),
            new SkillBall_1.SkillBall(2, ballSize.x / 2, new Vector_1.Vector(3 * (enviormentSize.x - ballSize.x) / 4, 3 * (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(1, 0.5), 100), 1, skillBox, "css"),
        ];
    }
}
class ThreeBall extends ISkillBallGenerator_1.ISkillBallGenerator {
    generate(ballSize) {
        let tmp = [
            new SkillBall_1.SkillBall(1, ballSize.x / 2, new Vector_1.Vector((enviormentSize.x - ballSize.x) / 4, (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(0.5, 1), 100), 1, skillBox, "javascript"),
            new SkillBall_1.SkillBall(2, ballSize.x / 2, new Vector_1.Vector(3 * (enviormentSize.x - ballSize.x) / 4, 3 * (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(1, 0.5), 100), 1, skillBox, "css"),
            new SkillBall_1.SkillBall(3, ballSize.x / 2, new Vector_1.Vector(500, 300), Vector_1.Vector.mult(new Vector_1.Vector(1, 1), 100), 1, skillBox, "html")
        ];
        SkillBall_1.SkillBall.addEdge(tmp[0], tmp[1]);
        SkillBall_1.SkillBall.addEdge(tmp[1], tmp[2]);
        console.log(SkillBall_1.SkillBall.edgeList);
        return tmp;
    }
}
//enviorment
let skillBox = $("#skills div");
let enviormentSize;
let ballSize;
let timeDelta = 20; //s
let canvas;
//entites
let entites = [];
function start(skillBallGenerator) {
    reSize();
    skillBallGenerator.generate(ballSize).forEach(ball => entites.push(ball));
    console.log(entites);
    setTimeout(update, timeDelta);
}
function update() {
    //calculate ball physics
    let ignore = [];
    for (let i1 = 4; i1 < entites.length; i1++) {
        let ball = entites[i1];
        ignore.push(i1);
        let collisions = (0, Intercept_1.interceptChecks)(ball, entites, ignore);
        //bounces
        for (let i2 = 0; i2 < collisions.length; i2++) {
            if (collisions[i2] < 4) { //wall collision
                let wall = entites[collisions[i2]];
                ball.bounce(wall.gradient);
            }
            else { //ball collision
                let ballCollison = entites[collisions[i2]];
                let ballTangent = Vector_1.Vector.normalize(Vector_1.Vector.sub(ball.p, ballCollison.p));
                ballTangent = new Vector_1.Vector(ballTangent.y, -1 * ballTangent.x);
                //bounce current ball
                ball.bounce(ballTangent);
                //bounce with colliding ball
                ballCollison.bounce(ballTangent);
            }
            ball.move(timeDelta / 1000);
        }
    }
    //ball rendering
    for (let i1 = 4; i1 < entites.length; i1++) {
        let ball = entites[i1];
        //check if ball is within enviorment
        if (!boundaryCheck(ball)) {
            //update position
            let pos = randomBallPos(ball.radius, [i1]);
            ball.p.x = pos.x;
            ball.p.y = pos.y;
            ball.vel = Vector_1.Vector.mult(new Vector_1.Vector(Math.random(), Math.random()), Vector_1.Vector.dist(ball.vel));
            let radius = ball.radius;
            ball.setRadius(0);
            ball.setLerpRadius(radius, 1, null);
        }
        ball.move(timeDelta / 1000);
        render(ball);
    }
    canvas.clear();
    SkillBall_1.SkillBall.edgeList.forEach(edge => {
        canvas.drawLine(edge.ball1.getCenter(), edge.ball2.getCenter(), 1, "white");
    });
    //update after n time
    setTimeout(update, timeDelta);
}
function boundaryCheck(ball) {
    let bufferZone = 5;
    if (ball.p.x - ball.radius + bufferZone < 0 || enviormentSize.x < ball.p.x + ball.radius - bufferZone) {
        return false;
    }
    if (ball.p.y - ball.radius + bufferZone < 0 || enviormentSize.y < ball.p.y + ball.radius - bufferZone) {
        return false;
    }
    return true;
}
function randomBallPos(radius, ignore) {
    let circle;
    let pos = new Vector_1.Vector(0, 0);
    circle = new Circle_1.Circle(radius, pos);
    do {
        pos.x = Math.random() * enviormentSize.x;
        pos.y = Math.random() * enviormentSize.y;
    } while ((0, Intercept_1.interceptChecks)(circle, entites, ignore).length > 0);
    return pos;
}
function render(ball) {
    let tmp = Vector_1.Vector.sub(ball.p, new Vector_1.Vector(ballSize.x / 2, -1 * ballSize.y / 2));
    ball.element.css("transform", `translate(${tmp.x}px, ${enviormentSize.y - tmp.y}px) scale(${ball.scale})`);
}
function reSize() {
    enviormentSize = new Vector_1.Vector(skillBox.width(), skillBox.height());
    ballSize = new Vector_1.Vector(100, 100);
    canvas = CanvasController_1.CanvasController.factory($("#skills canvas"), new Vector_1.Vector(enviormentSize.x, enviormentSize.y), new Vector_1.Vector(enviormentSize.x * 10, enviormentSize.y * 10));
    let gradientPath = [new Vector_1.Vector(1, 0), new Vector_1.Vector(0, 1), new Vector_1.Vector(-1, 0), new Vector_1.Vector(0, -1)];
    let start = new Vector_1.Vector(0, 0);
    if (entites.length > 4) {
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                case 2:
                    entites[i] = new Line_1.Line(start, gradientPath[i], enviormentSize.x);
                    break;
                case 1:
                case 3:
                    entites[i] = new Line_1.Line(start, gradientPath[i], enviormentSize.y);
                    break;
            }
            start = entites[i].getPoint(entites[i].l);
        }
    }
    else {
        entites = [];
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                case 2:
                    entites.push(new Line_1.Line(start, gradientPath[i], enviormentSize.x));
                    break;
                case 1:
                case 3:
                    entites.push(new Line_1.Line(start, gradientPath[i], enviormentSize.y));
                    break;
            }
            start = entites[i].getPoint(entites[i].l);
        }
    }
}
$(window).on("load", () => {
    $(window).on('resize', reSize);
    start(new ThreeBall());
});

},{"../CanvasController/CanvasController":1,"./Circle":4,"./ISkillBallGenerator":6,"./Intercept":7,"./Line":8,"./SkillBall":10,"./Vector":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISkillBallGenerator = void 0;
class ISkillBallGenerator {
    generate(ballSize) {
        return [];
    }
}
exports.ISkillBallGenerator = ISkillBallGenerator;

},{}],7:[function(require,module,exports){
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

},{"./Circle":4,"./Line":8,"./Rect":9,"./Vector":11}],8:[function(require,module,exports){
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

},{"./Vector":11}],9:[function(require,module,exports){
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

},{"./Line":8,"./Vector":11}],10:[function(require,module,exports){
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

},{"../HTMLBuilder/HTMLBuilder":2,"./BezierCurve":3,"./Circle":4,"./Line":8,"./Vector":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    normalize() {
        let dist = Vector.dist(this);
        this.x = this.x / dist;
        this.y = this.y / dist;
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static mult(v, n) {
        return new Vector(v.x * n, v.y * n);
    }
    static div(v, n) {
        return new Vector(v.x / n, v.y / n);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }
    static dist(v) {
        return Math.sqrt(Vector.dot(v, v));
    }
    static normalize(v) {
        let dist = Vector.dist(v);
        return Vector.div(v, dist);
    }
    static projection(v, proj) {
        let v1 = proj;
        return Vector.mult(v1, Vector.dot(v, v1) / Vector.dot(v1, v1));
    }
}
exports.Vector = Vector;

},{}]},{},[5]);
