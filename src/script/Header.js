(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLText = exports.HTMLElem = exports.StyleAttr = exports.AttrVal = void 0;
/**
 * KeyValuePair defines variables and methods for html element attr
*/
class KeyValuePair {
    /**
     * @constructor creates a KeyValuePair
     * @param {string} key: key name
     * @param {AttrVal[]} values: array of attribute values for key
     */
    constructor(key, values) {
        this.key = key;
        this.values = [];
        for (let i1 = 0; i1 < values.length; i1++) {
            this.values.push(values[i1]);
        }
    }
    /**
     * generate method turns KeyValuePair into string attr for HTML elements
     * @returns {string} string format of KeyValuePair for HTML elements
     */
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
/**
 * AttrVal class defines AttrVal for KeyValuePair
 */
class AttrVal {
    /**
     * @constructor creates an instance of AttrVal
     * @param {string} value
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * generate method returns string representation of AttrVal
     * @returns {string} string format of AttrVal
     */
    generate() {
        return this.value;
    }
}
exports.AttrVal = AttrVal;
/**
 * StyleAttr class defines attributes of element styles
 */
class StyleAttr {
    /**
     * @constructor creates instance of StyleAttr
     * @param {string} key: style name
     * @param {string} value: style value
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    /**
     * generate method returns string representation of AttrVal
     * @returns {string} string format of AttrVal
     */
    generate() {
        return `${this.key}:${this.value};`;
    }
}
exports.StyleAttr = StyleAttr;
/**
 * HTMLElem class define variables and methods required to create HTML DOM elements
 */
class HTMLElem {
    /**
     * @constructor creates a new instance of HTMLElem
     * @param {string} tagname: tagname of HTML element
     */
    constructor(tagname) {
        this.tagname = tagname;
        this.attr = [new KeyValuePair("id", []), new KeyValuePair("class", [])];
        this.children = [];
    }
    /**
     * get return a array of references to values
     * @param {string} key: name of attr
     * @returns {AttrVal[]} array of AttrVal
     */
    get(key) {
        let tmp = this.attr.find(kvp => kvp.key === key);
        if (tmp == null) {
            tmp = new KeyValuePair(key, []);
            this.attr.push(tmp);
        }
        return tmp.values;
    }
    /**
     * addChild adds an HTML child Element
     * @param {HTMLElem} child
     */
    addChild(child) {
        this.children.push(child);
        return this;
    }
    /**
     * generate method returns string representation of HTMLElem
     * @returns {string} string format of HTMLElem
     */
    generate() {
        let attrStr = "";
        for (let i1 = 0; i1 < this.attr.length; i1++) {
            attrStr += `${this.attr[i1].generate()} `;
        }
        return `<${this.tagname} ${attrStr}>${this.generateChildren()}</${this.tagname}>`;
    }
    /**
     * generateChildren method returns string representation of child content of HTMLElem
     * @returns {string} string format of child HTMLElem
     */
    generateChildren() {
        let childrenStr = "";
        for (let i1 = 0; i1 < this.children.length; i1++) {
            childrenStr += `${this.children[i1].generate()}\n`;
        }
        return `${childrenStr}`;
    }
}
exports.HTMLElem = HTMLElem;
/**
 * HTMLText class defines HTML text element and method to create text content in HTMLElem
 */
class HTMLText extends HTMLElem {
    /**
     * @constructor creates a new instance of HTMLText
     * @param {string} text
     */
    constructor(text) {
        super("");
        this.text = text;
    }
    /**
     * get does nothing
     * @param {string} key: name of attr
     * @returns {AttrVal[]} empty array
     */
    get(key) {
        throw new Error("Invalid get call");
    }
    /**
     * addChild does nothing
     * @param {HTMLElem} child
     */
    addChild(child) {
        throw new Error("Invalid addChild call");
    }
    /**
     * generate method returns string representation of HTMLText
     * @returns {string} string format of HTMLText
     */
    generate() {
        return this.text;
    }
}
exports.HTMLText = HTMLText;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sky_1 = require("./Stars/Sky");
(0, Sky_1.main)();

},{"./Stars/Sky":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const Line_1 = require("../../Math/Paths/Line");
const Vector_1 = require("../../Math/Vector");
const Star_1 = require("./Star");
const StarGeneration_1 = require("./StarGeneration");
let stars = $("#header #starSystem");
let constellations = $("#header svg");
let environmentSize = new Vector_1.Vector(stars.width(), stars.height());
;
let starSize = new Vector_1.Vector(5, 5);
;
let timeDelta = 20; //ms
//entities
let entities = [];
function start(environmentSettings, starSettings) {
    reSize();
    entities = [];
    (0, StarGeneration_1.starGenerate)(environmentSettings, starSettings).forEach(star => {
        entities.push(star);
        render(star);
    });
    setTimeout(update, timeDelta);
}
function update() {
    //calculate star physics
    // for(let i1 : number = 4; i1 < entities.length; i1++) {
    //     let star = entities[i1] as Star;
    //     star.move(timeDelta / 1000);
    // }
    //ball rendering
    //let boundary = new Rect(environmentSize.x, environmentSize.y, 0, new Vector(0, 0));
    for (let i1 = 4; i1 < entities.length; i1++) {
        //let star = entities[i1] as Star;
        //check if ball is within environment
        // if(!boundaryCheck(star)) {
        //     //update position
        //     let pos : Vector = randomPos(
        //         star.radius,
        //         boundary,
        //         [i1],
        //         entities
        //     );
        //     star.p.x = pos.x;
        //     star.p.y = pos.y;
        //     star.vel = Vector.mult(
        //         Vector.normalize(
        //             new Vector(
        //                 Math.random(),
        //                 Math.random()
        //             )
        //         ),
        //         Vector.dist(star.vel)
        //     );
        // }
        // render(star);
    }
    //edge rendering
    Star_1.Star.edgeList.forEach(edge => {
        edge.updateLine();
    });
    Star_1.Edge.updateSVGElem(Star_1.Star.edgeList);
    //update after n time
    setTimeout(update, timeDelta);
}
/**
 * render method updates the DOM of all entities in environment
 * @param {Star} star
 */
function render(star) {
    let tmp = Vector_1.Vector.sub(star.p, new Vector_1.Vector(starSize.x / 2, -1 * starSize.y / 2));
    star.element.css("left", `${tmp.x / environmentSize.x * 100}%`);
    star.element.css("bottom", `${tmp.y / environmentSize.y * 100}%`);
}
function reSize() {
    environmentSize = new Vector_1.Vector(stars.width(), stars.height());
    Star_1.Edge.setSVGElemSize(environmentSize.x, environmentSize.y);
    let gradientPath = [new Vector_1.Vector(1, 0), new Vector_1.Vector(0, 1), new Vector_1.Vector(-1, 0), new Vector_1.Vector(0, -1)];
    let start = new Vector_1.Vector(0, 0);
    if (entities.length > 4) {
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                case 2:
                    entities[i] = new Line_1.Line(start, gradientPath[i], environmentSize.x);
                    break;
                case 1:
                case 3:
                    entities[i] = new Line_1.Line(start, gradientPath[i], environmentSize.y);
                    break;
            }
            start = entities[i].getPoint(entities[i].l);
        }
    }
    else {
        entities = [];
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                case 2:
                    entities.push(new Line_1.Line(start, gradientPath[i], environmentSize.x));
                    break;
                case 1:
                case 3:
                    entities.push(new Line_1.Line(start, gradientPath[i], environmentSize.y));
                    break;
            }
            start = entities[i].getPoint(entities[i].l);
        }
    }
}
function main() {
    let tmp = () => {
        let environmentSettings = {
            size: environmentSize,
            skyJquery: stars,
        };
        let ballSettings = {
            defaultRadius: starSize.x / 2,
            count: (3 / (200 * 200)) * environmentSize.x * environmentSize.y
        };
        start(environmentSettings, ballSettings);
    };
    $(window).on("load", tmp);
}
exports.main = main;

},{"../../Math/Paths/Line":9,"../../Math/Vector":11,"./Star":4,"./StarGeneration":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Star = exports.Edge = void 0;
const HTMLBuilder_1 = require("../../HTMLBuilder/HTMLBuilder");
const BezierCurve_1 = require("../../Math/Paths/BezierCurve");
const Circle_1 = require("../../Math/Paths/Circle");
const Line_1 = require("../../Math/Paths/Line");
const Vector_1 = require("../../Math/Vector");
/**
 * Edge class defines data and methods related to lines between balls
 */
class Edge {
    /**
     * Edge constructor creates Edge instance
     * @constructor
     * @param {Star} star1: reference of starting ball
     * @param {Star} star2: reference of ending ball
     * @throws {Error} will throw error if ball1 and ball2 reference the same edge
     */
    constructor(star1, star2) {
        if (star1.id == star2.id) {
            throw Error("Edge cannot connect ball to itself");
        }
        if (star1.id < star2.id) {
            this.star1 = star1;
            this.star2 = star2;
        }
        else {
            this.star2 = star1;
            this.star1 = star2;
        }
        this.width = Edge.defaultWidth;
        let tmp = new HTMLBuilder_1.HTMLElem("line");
        let id = `line-${this.star1.id}-${this.star2.id}`;
        tmp.get("id").push(new HTMLBuilder_1.AttrVal(id));
        this.line = new HTMLBuilder_1.HTMLElem("line");
        this.line.get("style").push(new HTMLBuilder_1.StyleAttr("stroke-width", this.width.toString()));
        this.line.get("x1").push(new HTMLBuilder_1.AttrVal("0px"));
        this.line.get("y1").push(new HTMLBuilder_1.AttrVal("0px"));
        this.line.get("x2").push(new HTMLBuilder_1.AttrVal("0px"));
        this.line.get("y2").push(new HTMLBuilder_1.AttrVal("0px"));
        this.updateLine();
        Edge.svg.addChild(this.line);
    }
    /**
     * setSVGElemSize method sets the width and height of SVG object
     * @param {number} width
     * @param {number} height
     */
    static setSVGElemSize(width, height) {
        Edge.size.x = width;
        Edge.size.y = height;
        if (Edge.svg.get("width").length == 0) {
            Edge.svg.get("width").push(new HTMLBuilder_1.AttrVal(width.toString()));
        }
        else {
            Edge.svg.get("width")[0].value = width.toString();
        }
        if (Edge.svg.get("height").length == 0) {
            Edge.svg.get("height").push(new HTMLBuilder_1.AttrVal(height.toString()));
        }
        else {
            Edge.svg.get("height")[0].value = height.toString();
        }
    }
    /**
     * updateSVGElem updates edges on SVG element
     * @param edges array of edges that are being updated
     */
    static updateSVGElem(edges) {
        Edge.svgJquery.html(Edge.svg.generateChildren());
        Edge.svgJquery.attr("height", Edge.svg.get("height")[0].value);
        Edge.svgJquery.attr("width", Edge.svg.get("width")[0].value);
    }
    /**
     * updateLine method update attributes of line
     */
    updateLine() {
        this.line.get("style")[0].value = this.width.toString();
        this.line.get("x1")[0].value = `${this.star1.p.x}px`;
        this.line.get("y1")[0].value = `${Edge.size.y - this.star1.p.y}px`;
        this.line.get("x2")[0].value = `${this.star2.p.x}px`;
        this.line.get("y2")[0].value = `${Edge.size.y - this.star2.p.y}px`;
    }
}
exports.Edge = Edge;
/**
 * svgJquery: HTML element that in which edges are drawn upon
 */
Edge.svgJquery = $("#header #constellation");
/**
 * svg: HTMLElem object that generates HTML DOM
 */
Edge.svg = new HTMLBuilder_1.HTMLElem("svg");
/**
 * size: Define the length and width of HTMLElem
 */
Edge.size = new Vector_1.Vector(0, 0);
/**
 * defaultWidth: Width of default edge between balls
 */
Edge.defaultWidth = 3;
/**
 * SkillBall class handles data related to skill balls in environment
 * @extends {Circle}
 */
class Star extends Circle_1.Circle {
    /**
     * constructor creates Skill Ball
     * @constructor
     * @param {number} id: id of skill ball
     * @param {number} radius: initial radius of skill ball
     * @param {Vector} start: vector position of start position
     * @param {Vector} initialVelocity: initial velocity of skill ball
     * @param {number} mass: mass of skill ball
     * @param {JQuery} environment: JQuery object that references the HTML physics ball environment
     * @param {string} iconName: name of skill ball
     */
    constructor(id, radius, start, initialVelocity, environment) {
        let radiusTmp = radius * (Math.random() + 0.5);
        super(radiusTmp, start);
        /**
         * radiusAnim: cached values of playing animation
         */
        this.radiusAnim = null;
        //connected balls
        /**
         * connections: array of connections that link balls
         */
        this.connections = [];
        this.initialRadius = radiusTmp;
        this.id = id;
        this.vel = initialVelocity;
        this.scale = 1;
        this.element = this.buildHTML(environment);
        this.movementLine = new Line_1.Line(this.p, this.vel, -1);
        this.setRadius(0);
        this.setRadiusAnimation(radius * 0.5, 0.5, Star.creationAnimation);
    }
    /**
     * creationAnimation: Static const that defines default creation animation curve
     */
    static get creationAnimation() {
        return new BezierCurve_1.BezierCurve([
            new Vector_1.Vector(0, 0),
            new Vector_1.Vector(1, 0),
            new Vector_1.Vector(0.1, 1.5),
            new Vector_1.Vector(1, 1)
        ]);
    }
    ;
    /**
     * defaultAnimation: Static const that defines default animation curve
     */
    static get defaultAnimation() {
        return new BezierCurve_1.BezierCurve([
            new Vector_1.Vector(0, 0),
            new Vector_1.Vector(1, 1)
        ]);
    }
    ;
    /**
     * addEdge method adds an edge between ball1 and ball2
     * @param {Star} ball1
     * @param {Star} ball2
     */
    static addEdge(ball1, ball2) {
        let edge = new Edge(ball1, ball2);
        if (this.edgeList.length == 0) {
            this.edgeList.push(edge);
            ball1.connections.push(edge);
            ball2.connections.push(edge);
            return;
        }
        let id1, id2;
        id1 = edge.star1.id;
        id2 = edge.star2.id;
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
            if (edgeTmp.star1.id == id1) {
                if (edgeTmp.star2.id == id2) {
                    return;
                }
                //first half
                if (id2 < edgeTmp.star2.id) {
                    end = pointer;
                } //second half
                else {
                    start = pointer;
                }
            }
            else if (id1 < edgeTmp.star1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        if (edgeTmp.star1.id == id1 && edgeTmp.star2.id == id2) {
            return;
        }
        ball1.connections.push(edge);
        ball2.connections.push(edge);
        this.edgeList.splice(start + 1, 0, edge);
    }
    /**
     * findEdge method finds edge that connects ball1 and ball2.
     * Order of ball1 and ball2 does not matter
     * @param {Star | number} ball1: reference or id of ball
     * @param {Star | number} ball2: reference or id of ball
     * @returns {Edge | null} Edge is returned if it exists else, null is returned
     */
    static findEdge(ball1, ball2) {
        if (this.edgeList.length == 0) {
            return null;
        }
        let id1, id2;
        if (ball1 instanceof Star) {
            id1 = ball1.id;
        }
        else {
            id1 = ball1;
        }
        if (ball2 instanceof Star) {
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
            if (edgeTmp.star1.id == id1) {
                if (edgeTmp.star2.id == id2) {
                    return edgeTmp;
                }
                //first half
                if (id2 < edgeTmp.star2.id) {
                    end = pointer;
                } //second half
                else {
                    start = pointer;
                }
            }
            else if (id1 < edgeTmp.star1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        if (edgeTmp.star1.id == id1 && edgeTmp.star2.id == id2) {
            return edgeTmp;
        }
        return null;
    }
    /**
     * utility method to create HTML DOM required to make Skill Ball in environment
     * @param {JQuery} environment: JQuery object that references the HTML physics ball environment
     * @returns {JQuery} JQuery object that references HTML DOM of skill ball
     */
    buildHTML(environment) {
        let elem = new HTMLBuilder_1.HTMLElem("div");
        elem.get("style").push(new HTMLBuilder_1.StyleAttr("width", `${this.radius * 2}px`));
        elem.get("style").push(new HTMLBuilder_1.StyleAttr("height", `${this.radius * 2}px`));
        let duration = 60;
        elem.get("style").push(new HTMLBuilder_1.StyleAttr("animation-duration", `${60 * Math.random() + 60}s`));
        elem.get("style").push(new HTMLBuilder_1.StyleAttr("animation-delay", `${60 * Math.random()}s`));
        let getDir = () => {
            if (Math.random() < 0.5) {
                return "reverse";
            }
            else {
                return "normal";
            }
        };
        elem.get("style").push(new HTMLBuilder_1.StyleAttr("animation-direction", `${getDir()}`));
        elem.get("class").push(new HTMLBuilder_1.AttrVal("star"));
        elem.get("id").push(new HTMLBuilder_1.AttrVal(`star-${this.id}`));
        //create dom
        environment.append(elem.generate());
        let tmp = environment.find(`#star-${this.id}`);
        ;
        return tmp;
    }
    /**
     * setRadiusAnimation method sets radius based on animationCurve
     * @param {number} radius: new radius of skill ball
     * @param {number | null} duration: number of seconds for a radius interpolate animation
     * @param {BezierCurve | null | undefined} animationCurve: animation curve interpolation
     * @returns {boolean} boolean whether animation has been set
     */
    setRadiusAnimation(radius, duration, animationCurve) {
        if (radius < 0) {
            return false;
        }
        let animation;
        if (animationCurve == null) {
            animation = Star.defaultAnimation.Clone();
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
    /**
     * setRadius sets the radius of skill ball
     * @deprecated
     * @param {number} radius: new radius of skill ball
     * @returns: boolean if new radius is set
     */
    setRadius(radius) {
        if (radius < 0) {
            return false;
        }
        this.radius = radius;
        this.scale = radius / this.initialRadius;
        return true;
    }
    /**
     * updateRadius method updates radius based on timeDelta and radius animation curve
     * @param {number} timeDelta: delta time used to calculate new radius
     */
    updateRadius(timeDelta) {
        if (this.radiusAnim == null) {
            return;
        }
        let deltaRadius = Math.abs(this.radius - this.radiusAnim.target);
        if (deltaRadius > 0.01) {
            this.radiusAnim.time += timeDelta;
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
    /**
     * toString returns a string of Skill Ball
     * @returns {String} string representation of skill ball
     */
    toString() {
        return `radius:${this.radius}\np:${this.p.x},${this.p.y}\ndir:${this.vel.x},${this.vel.y}`;
    }
    /**
     * move method moves ball
     * @param {number} deltaTime: delta time used to calculate new ball position & ball radius
     */
    move(deltaTime) {
        this.movementLine.p = this.p;
        this.movementLine.gradient = this.vel;
        this.p = this.movementLine.getPoint(deltaTime);
        //update radius
        this.updateRadius(deltaTime);
    }
    /**
     * destroy method handles the deconstruction of SkillBall
     */
    destroy() {
        let edge;
        for (let i1 = Star.edgeList.length - 1; i1 >= 0; i1--) {
            edge = Star.edgeList[i1];
            if (edge.star1.id == this.id || edge.star2.id == this.id) {
                Star.edgeList.splice(i1, 1);
            }
        }
    }
}
exports.Star = Star;
/**
 * edgeList: static array of all edges
 */
Star.edgeList = [];

},{"../../HTMLBuilder/HTMLBuilder":1,"../../Math/Paths/BezierCurve":6,"../../Math/Paths/Circle":7,"../../Math/Paths/Line":9,"../../Math/Vector":11}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomPos = exports.starGenerate = void 0;
const Circle_1 = require("../../Math/Paths/Circle");
const Intercept_1 = require("../../Math/Paths/Intercept");
const Rect_1 = require("../../Math/Paths/Rect");
const Vector_1 = require("../../Math/Vector");
const Star_1 = require("./Star");
/**
 * ballGenerate function sets up environment and skill balls
 * @param {IEnvironmentSettings} environment
 * @param {IBallSettings} starSettings
 * @returns {Star[]} array of generated skill balls
 */
function starGenerate(environment, starSettings) {
    let tmp = [];
    console.log(environment);
    console.log(starSettings);
    for (let i1 = 0; i1 < starSettings.count; i1++) {
        tmp.push(new Star_1.Star(i1, starSettings.defaultRadius, randomPos(starSettings.defaultRadius, new Rect_1.Rect(environment.size.x, environment.size.y, 0, new Vector_1.Vector(0, 0)), [], tmp), Vector_1.Vector.mult(Vector_1.Vector.normalize(new Vector_1.Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)), 1), environment.skyJquery));
    }
    return tmp;
}
exports.starGenerate = starGenerate;
/**
 * randomBallPos returns a random valid position to generate a skill ball
 * @param {number} radius: minimum distance between position vector and entities
 * @param {Rect} space: Rect define the settings of environment and valid range
 * @param {number[]} ignore: array of indexes of entities that are ignored from intercept checks
 * @param {Path[]} entities: list of entities in the system
 * @returns {Vector} vector position of valid position
 */
function randomPos(radius, space, ignore, entities) {
    let circle;
    let pos = new Vector_1.Vector(0, 0);
    circle = new Circle_1.Circle(radius * 1.5, pos);
    do {
        pos.x = Math.random() * (space.width - radius) + radius;
        pos.y = Math.random() * (space.height - radius) + radius;
    } while ((0, Intercept_1.interceptChecks)(circle, entities, ignore).length > 0 && boundaryCheck(circle, space));
    return pos;
}
exports.randomPos = randomPos;
function boundaryCheck(star, system) {
    let bufferZone = -5;
    if (star.p.x - star.radius + bufferZone < 0 || system.width < star.p.x + star.radius - bufferZone) {
        return false;
    }
    if (star.p.y - star.radius + bufferZone < 0 || system.height < star.p.y + star.radius - bufferZone) {
        return false;
    }
    return true;
}

},{"../../Math/Paths/Circle":7,"../../Math/Paths/Intercept":8,"../../Math/Paths/Rect":10,"../../Math/Vector":11,"./Star":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BezierCurve = void 0;
const Line_1 = require("./Line");
const Vector_1 = require("../Vector");
/**
 * BezierCurve class defines a point and methods required to make a bezier curve
 * @extends {Path}
 */
class BezierCurve {
    /**
     * @constructor Constructor creates BezierCurve object
     * @param parameters
     */
    constructor(parameters) {
        /**
         * parameters is an array of positions that define bezier curve
         */
        this.parameters = [];
        if (parameters.length < 2) {
            throw new Error("parameters must have at least size 2");
        }
        this.parameters = parameters;
    }
    /**
     * getPoint method get a point from bezier curve
     * @param {number} t: number [0:1] define a point on bezier curve
     * @returns {Vector} vector position of bezier curve at t
     */
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
            //update parameterTmp with new values at t
            parameterTmp = [];
            for (let i1 = 0; i1 < linesTmp.length; i1++) {
                parameterTmp.push(linesTmp[i1].getPoint(t));
            }
        }
        return parameterTmp[0];
    }
    /**
     * getCenter method returns the center point of bezier curve
     * @returns {Vector} vector position of bezier curve at t
     */
    getCenter() {
        return this.getPoint(0.5);
    }
    /**
     * Clone method creates a deep copy of BezierCurve object
     * @returns {BezierCurve} deep copy of BezierCurve
     */
    Clone() {
        let tmp = [];
        this.parameters.forEach(p => {
            tmp.push(p.clone());
        });
        return new BezierCurve(tmp);
    }
}
exports.BezierCurve = BezierCurve;

},{"../Vector":11,"./Line":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
const Vector_1 = require("../Vector");
/**
 * Circle class define methods and variables to create circle path
 * @extends {Path}
 */
class Circle {
    /**
     * @constructor creates a circle path
     * @param {number} radius: radius of circle
     * @param {Vector} center: vector position of center of circle
     */
    constructor(radius, center) {
        this.radius = radius;
        this.p = center;
    }
    /**
     * getPoint method returns a vector position on circle
     * @param {number} t: postive number that defines a vector position on circle
     * @returns {Vector} vector position on circle
     */
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
    /**
     * getCenter method returns center of circle path
     * @returns {Vector} center position of circle
     */
    getCenter() {
        return this.p.clone();
    }
    /**
     * getTangent method gets the tangent at point getPoint(t)
     * @param {number} t: postive number that defines a vector position on circle
     * @returns {Vector} vector slope of tangent line at getPoint(t)
     */
    getTangent(t) {
        return new Vector_1.Vector(-1 * Math.sin(t), Math.cos(t));
    }
}
exports.Circle = Circle;

},{"../Vector":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptCheck = exports.interceptChecks = exports.rayCheck = exports.rayChecks = void 0;
const Line_1 = require("./Line");
const Circle_1 = require("./Circle");
const Rect_1 = require("./Rect");
const Vector_1 = require("../Vector");
/**
 * Intercept class defines the variables that are can be used to derive vector position of intercepts
 */
class Intercept {
    /**
     * @constructor creates an intercept object
     * @param {boolean} exists: boolean whether an intercept exists
     * @param {number} t1: t value of intercept on path 1
     * @param {number} t2: t value of intercept on path 2
     */
    constructor(exists, t1, t2) {
        this.exists = exists;
        this.t1 = t1;
        this.t2 = t2;
    }
}
/**
 * rayChecks returns index of the first collider the ray has an intercept with
 * @param {Line} ray: line that is used to determine ray
 * @param {Path[]} colliders: array of paths that will be intercept checked with the inputted ray
 * @returns {number} index of the first collider the ray hits
 */
function rayChecks(ray, colliders) {
    for (let i1 = 0; i1 < colliders.length; i1++) {
        if (rayCheck(ray, colliders[i1]) >= 0) {
            return i1;
        }
    }
    return -1;
}
exports.rayChecks = rayChecks;
/**
 * rayCheck returns the position on ray of an intercept between Path and Ray
 * @param {Line} ray: Line of ray
 * @param {Path} p: path that will be checked against ray
 * @returns {number} position on ray where the ray and path intercept or -1 if there is not intersection
 */
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
/**
 * interceptChecks finds all the colliders that intersect with p1
 * @param {Path} path: path that will be used to be checked against colliders
 * @param {Path[]} colliders: array of colliders that will be checked against path
 * @param {number[]} ignoreIndex: array of index of colliders that won't be checked
 * @returns {number[]} array of indexes colliders that intersect path
 */
function interceptChecks(path, colliders, ignoreIndex) {
    let tmp = [];
    for (let i = 0; i < colliders.length; i++) {
        if (!ignoreIndex.includes(i)) {
            if (interceptCheck(path, colliders[i])) {
                tmp.push(i);
            }
        }
    }
    return tmp;
}
exports.interceptChecks = interceptChecks;
/**
 * interceptCheck checks if two paths intercept
 * @param {Path} p1
 * @param {Path} p2
 * @returns {boolean} boolean if an intercept exists
 */
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
/**
 * getIntercept returns Intercept between a line a path
 * @param {Line} line: line that is checked against path
 * @param {Path} p: path that is checked against line
 * @returns {Intercept} intercept of line and p
 */
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
/**
 * LineLineIntercept returns the intercept of two lines
 * @param {Line} l1
 * @param {Line} l2
 * @returns {Intercept} intercept of two lines
 */
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
/**
 * LineLineIntercept returns the intercept of line and circle
 * @param {Line} l
 * @param {Circle} c
 * @returns {Intercept} Intercept object of line and circle
 */
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
/**
 * LineLineIntercept returns the intercept of line and rect
 * @param {Line} l
 * @param {Rect} r
 * @returns {Intercept} Intercept object of line and rect
 */
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

},{"../Vector":11,"./Circle":7,"./Line":9,"./Rect":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
const Vector_1 = require("../Vector");
/**
 * Line class define methods and variables to create line path
 * @extends {Path}
 */
class Line {
    /**
     * @constructor creates Line object
     * @param {Vector} p: start position of line
     * @param {Vector} gradient: gradient of line
     * @param {number} length: length of line. length < 0 means an infinite length
     */
    constructor(p, gradient, length) {
        this.p = p;
        this.gradient = gradient;
        this.l = length;
    }
    /**
     * pointExist checks if a vector exists on the line
     * @param {Vector} v: position vector
     * @returns {boolean} boolean if position vector exists on the line
     */
    pointExist(v) {
        let t1 = (v.x - this.p.x) / this.gradient.x;
        let t2 = (v.y - this.p.y) / this.gradient.y;
        if (this.l < 0) {
            return t1 === t2;
        }
        return t1 == t2 && 0 <= t1 && t1 <= this.l;
    }
    /**
     * getPoint gets a vector on line
     * @param {number} t: position on line
     * @returns {Vector} vector position on line
     */
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
    /**
     * getCenter returns the center of line
     * @returns {Vector} center of line or start point of line if length is infinite
     */
    getCenter() {
        if (0 < this.l) {
            return this.p.clone();
        }
        return this.getPoint(this.l / 2);
    }
}
exports.Line = Line;

},{"../Vector":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
const Line_1 = require("./Line");
const Vector_1 = require("../Vector");
/**
 * Rect class define methods and variables required for a rectangle
 * @implements {Path}
 */
class Rect {
    /**
     * @constructor creates a Rect object
     * @param {number} width: width of rectangle
     * @param {number} height: height of rectangle
     * @param {number} rotation: rotation of rectangle. rotation is defined in terms of radians
     * @param {Vector} startPoint: Vector that defines the first vertices
     */
    constructor(width, height, rotation, startPoint) {
        this.perimeter = 0;
        this.edges = [new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0), new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0), new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0), new Line_1.Line(new Vector_1.Vector(0, 0), new Vector_1.Vector(0, 0), 0)];
        this.width_ = width;
        this.height_ = height;
        this.start_ = startPoint;
        this.theta = rotation;
        this.generateEdges();
    }
    get width() {
        return this.width_;
    }
    set width(value) {
        this.width_ = value;
        this.generateEdges();
    }
    get height() {
        return this.height_;
    }
    set height(value) {
        this.height_ = value;
        this.generateEdges();
    }
    get rot() {
        return this.theta;
    }
    set rot(rotation) {
        this.theta = rotation;
        this.generateEdges();
    }
    get start() {
        return this.start_;
    }
    set start(value) {
        this.start_ = value;
        this.generateEdges();
    }
    /**
     * getEdge returns a line of an edge from Rect
     *
     * 3  <--e2--  2
     * |           ᐱ
     * e3          |
     * |           e1
     * ᐯ           |
     * 0   --e0--> 1
     *
     * @param {number} edgeId: id of edge that will be retrieved
     * @returns {Line} line representation of edge
     */
    getEdge(edgeId) {
        if (edgeId < 0 || 4 <= edgeId) {
            throw new Error();
        }
        let tmp = this.edges[edgeId];
        return new Line_1.Line(tmp.p, tmp.gradient, tmp.l);
    }
    /**
     * getPoint method returns points from Rect
     * @param {number} t: distance from start vector
     * @returns {Vector} position vector on rect of t
     */
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
    /**
     * getCenter method returns the center of Rect
     * @returns {Vector} position vector of center of rect
     */
    getCenter() {
        let p1 = this.edges[0].getPoint(this.edges[0].l / 2);
        let p2 = this.edges[1].getPoint(this.edges[1].l / 2);
        p1 = Vector_1.Vector.add(p1, Vector_1.Vector.mult(this.edges[0].p, -1));
        p2 = Vector_1.Vector.add(p2, Vector_1.Vector.mult(this.edges[1].p, -1));
        return Vector_1.Vector.add(this.start_, Vector_1.Vector.add(p1, p2));
    }
    /**
     * generateEdges method generates edges based on start position, width, height and rotation of Rect
     */
    generateEdges() {
        let l1 = 0;
        let dir;
        let p = this.start_;
        let angle = this.theta;
        for (let i1 = 0; i1 < 4; i1++) {
            switch (i1) {
                case 0:
                case 2:
                    l1 = this.width_;
                    break;
                case 1:
                case 3:
                    l1 = this.height_;
                    break;
            }
            dir = new Vector_1.Vector(Math.cos(angle), Math.sin(angle));
            this.edges[i1] = new Line_1.Line(p, dir, l1);
            p = this.edges[i1].getPoint(this.edges[i1].l);
            angle += Math.PI / 2;
        }
        this.perimeter = 2 * this.width_ + 2 * this.height_;
    }
}
exports.Rect = Rect;

},{"../Vector":11,"./Line":9}],11:[function(require,module,exports){
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

},{}]},{},[2]);
