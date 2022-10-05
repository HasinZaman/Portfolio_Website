(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LinkedList {
    constructor(...values) {
        this._head = this._tail = null;
        this._length = 0;
        if (values.length > 0) {
            values.forEach((value) => {
                this.append(value);
            });
        }
    }
    *iterator() {
        let currentItem = this._head;
        while (currentItem) {
            yield currentItem.value;
            currentItem = currentItem.next;
        }
    }
    [Symbol.iterator]() {
        return this.iterator();
    }
    get head() {
        return this._head ? this._head.value : null;
    }
    get tail() {
        return this._tail ? this._tail.value : null;
    }
    get length() {
        return this._length;
    }
    // Adds the element at a specific position inside the linked list
    insert(val, previousItem, checkDuplicates = false) {
        if (checkDuplicates && this.isDuplicate(val)) {
            return false;
        }
        let newItem = new LinkedListItem(val);
        let currentItem = this._head;
        if (!currentItem) {
            return false;
        }
        else {
            while (true) {
                if (currentItem.value === previousItem) {
                    newItem.next = currentItem.next;
                    newItem.prev = currentItem;
                    currentItem.next = newItem;
                    if (newItem.next) {
                        newItem.next.prev = newItem;
                    }
                    else {
                        this._tail = newItem;
                    }
                    this._length++;
                    return true;
                }
                else {
                    if (currentItem.next) {
                        currentItem = currentItem.next;
                    }
                    else {
                        // can't locate previousItem
                        return false;
                    }
                }
            }
        }
    }
    // Adds the element at the end of the linked list
    append(val, checkDuplicates = false) {
        if (checkDuplicates && this.isDuplicate(val)) {
            return false;
        }
        let newItem = new LinkedListItem(val);
        if (!this._tail) {
            this._head = this._tail = newItem;
        }
        else {
            this._tail.next = newItem;
            newItem.prev = this._tail;
            this._tail = newItem;
        }
        this._length++;
        return true;
    }
    // Add the element at the beginning of the linked list
    prepend(val, checkDuplicates = false) {
        if (checkDuplicates && this.isDuplicate(val)) {
            return false;
        }
        let newItem = new LinkedListItem(val);
        if (!this._head) {
            this._head = this._tail = newItem;
        }
        else {
            newItem.next = this._head;
            this._head.prev = newItem;
            this._head = newItem;
        }
        this._length++;
        return true;
    }
    remove(val) {
        let currentItem = this._head;
        if (!currentItem) {
            return;
        }
        if (currentItem.value === val) {
            this._head = currentItem.next;
            this._head.prev = null;
            currentItem.next = currentItem.prev = null;
            this._length--;
            return currentItem.value;
        }
        else {
            while (true) {
                if (currentItem.value === val) {
                    if (currentItem.next) { // special case for last element
                        currentItem.prev.next = currentItem.next;
                        currentItem.next.prev = currentItem.prev;
                        currentItem.next = currentItem.prev = null;
                    }
                    else {
                        currentItem.prev.next = null;
                        this._tail = currentItem.prev;
                        currentItem.next = currentItem.prev = null;
                    }
                    this._length--;
                    return currentItem.value;
                }
                else {
                    if (currentItem.next) {
                        currentItem = currentItem.next;
                    }
                    else {
                        return;
                    }
                }
            }
        }
    }
    removeHead() {
        let currentItem = this._head;
        // empty list
        if (!currentItem) {
            return;
        }
        // single item list
        if (!this._head.next) {
            this._head = null;
            this._tail = null;
            // full list
        }
        else {
            this._head.next.prev = null;
            this._head = this._head.next;
            currentItem.next = currentItem.prev = null;
        }
        this._length--;
        return currentItem.value;
    }
    removeTail() {
        let currentItem = this._tail;
        // empty list
        if (!currentItem) {
            return;
        }
        // single item list
        if (!this._tail.prev) {
            this._head = null;
            this._tail = null;
            // full list
        }
        else {
            this._tail.prev.next = null;
            this._tail = this._tail.prev;
            currentItem.next = currentItem.prev = null;
        }
        this._length--;
        return currentItem.value;
    }
    first(num) {
        let iter = this.iterator();
        let result = [];
        let n = Math.min(num, this.length);
        for (let i = 0; i < n; i++) {
            let val = iter.next();
            result.push(val.value);
        }
        return result;
    }
    toArray() {
        return [...this];
    }
    isDuplicate(val) {
        let set = new Set(this.toArray());
        return set.has(val);
    }
}
exports.LinkedList = LinkedList;
class LinkedListItem {
    constructor(val) {
        this.value = val;
        this.next = null;
        this.prev = null;
    }
}
exports.LinkedListItem = LinkedListItem;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linked_list_typescript_1 = require("linked-list-typescript");
class Queue extends linked_list_typescript_1.LinkedList {
    constructor(...values) {
        super(...values);
    }
    get front() {
        return this.head;
    }
    enqueue(val) {
        this.append(val);
    }
    dequeue() {
        return this.removeHead();
    }
}
exports.Queue = Queue;

},{"linked-list-typescript":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLText = exports.HTMLElem = exports.StyleAttr = exports.AttrVal = void 0;
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
        this.attr = new Map();
        this.endTag = true;
        this.tagname = tagname;
        this.attr.set("id", []);
        this.attr.set("class", []);
        this.children = [];
    }
    /**
     * get return a array of references to values
     * @param {string} key: name of attr
     * @returns {AttrVal[]} array of AttrVal
     */
    get(key) {
        if (!this.attr.has(key)) {
            this.attr.set(key, []);
        }
        let data = this.attr.get(key);
        if (data !== undefined) {
            return data;
        }
        throw new Error("Invalid state");
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
        this.attr.forEach((values, key) => attrStr += `${this.attrGenerate(key, values)} `);
        if (this.endTag) {
            return `<${this.tagname} ${attrStr}>${this.generateChildren()}</${this.tagname}>`;
        }
        return `<${this.tagname} ${attrStr}>`;
    }
    /**
     * attrGenerate method generates string that represent an attribute of an HTML element
     * @returns {string} string format of an attribute of an HTML element
     */
    attrGenerate(key, values) {
        let valueStr = "";
        if (values.length === 0) {
            return "";
        }
        for (let i1 = 0; i1 < values.length; i1++) {
            valueStr += values[i1].generate();
        }
        return `${key}=\"${valueStr}\" `;
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sky_1 = require("./Stars/Sky");
const MountainRange_1 = require("./Mountain/MountainRange");
(0, Sky_1.main)();
(0, MountainRange_1.main)();

},{"./Mountain/MountainRange":5,"./Stars/Sky":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const Random_1 = require("../../Math/Random/Random");
const Vector_1 = require("../../Math/Vector");
const Camera_1 = require("../RenderPipeLine/Camera");
const Pyramid_1 = require("./Pyramid");
let svgCanvas = $("section#header > svg");
let cameraMountainRange = new Camera_1.Camera(1, 1, 0.5, 100);
let seed = "u3JBP^>hEm";
function main() {
    cameraMountainRange.pos = new Vector_1.Vector(-2, 0, 0);
    let initializeRange = () => {
        let tmp = generateMountainRange(getWidth(), getHeight(), seed);
        let inst = cameraMountainRange.draw(tmp, { width: getWidth(), height: getHeight() });
        svgCanvas.html(inst.generate());
    };
    initializeRange();
    $(window).on("resize", initializeRange);
}
exports.main = main;
function generateMountainRange(width, height, seed) {
    width = getWidth();
    height = getHeight();
    svgCanvas.attr("viewBox", `0 0 ${width} ${height}`);
    cameraMountainRange.width = width;
    let tmp = [];
    let seedGenerator = (0, Random_1.randomStringGenerator)(seed, 10, 10);
    //random rotation
    let rotNext = () => {
        let next = (0, Random_1.randomFloatGenerator)(seedGenerator());
        return next() * Math.PI * 2;
    };
    //random layerCount
    let layerNext = (0, Random_1.randomIntGenerator)(seedGenerator(), 1, 2);
    //random base
    let minBase = 150;
    let maxBase = minBase * 3;
    let baseNext = () => {
        let next = (0, Random_1.randomFloatGenerator)(seedGenerator());
        return next() * (maxBase - minBase) + minBase;
    };
    //random height
    let minHeight = 0.25;
    let maxHeight = 0.75;
    let groundLevel = -0.5;
    let heightNext = () => {
        let next = (0, Random_1.randomFloatGenerator)(seedGenerator());
        return next() * (maxHeight - minHeight) + minHeight;
    };
    let direction = -1;
    let lastX = [0, 0];
    let minDist = 100;
    let maxDist = 200;
    let posNextY = () => {
        let yNext = () => {
            let next = (0, Random_1.randomFloatGenerator)(seedGenerator());
            return next() * (maxDist - minDist) + minDist + minBase / 2;
        };
        direction *= -1;
        return direction * yNext();
    };
    { //central pyramid
        let heightTmp = maxHeight;
        tmp.push(new Pyramid_1.Pyramid(layerNext(), heightTmp, baseNext(), new Vector_1.Vector(0, 0, heightTmp + groundLevel), rotNext()));
        maxHeight *= 0.75;
    }
    while (width / -2 < lastX[0] || lastX[1] < width / 2) {
        let y = posNextY();
        switch (direction) {
            case -1:
                y += lastX[0];
                lastX[0] = y;
                break;
            case 1:
                y += lastX[1];
                lastX[1] = y;
                break;
        }
        {
            let heightTmp = heightNext();
            tmp.push(new Pyramid_1.Pyramid(layerNext(), heightTmp, baseNext(), new Vector_1.Vector(tmp.length * maxBase * 1.5, y, heightTmp + groundLevel), rotNext()));
        }
    }
    return tmp;
}
function getWidth() {
    let tmp = svgCanvas.width();
    if (tmp !== undefined) {
        return tmp;
    }
    throw new Error();
}
function getHeight() {
    let tmp = svgCanvas.height();
    if (tmp !== undefined) {
        return tmp;
    }
    throw new Error();
}

},{"../../Math/Random/Random":19,"../../Math/Vector":20,"../RenderPipeLine/Camera":8,"./Pyramid":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyramid = void 0;
const HTMLBuilder_1 = require("../../HTMLBuilder/HTMLBuilder");
const Matrix_1 = require("../../Math/Matrix");
const Vector_1 = require("../../Math/Vector");
const Triangle_1 = require("./Triangle");
/**
 * Face class handles the state and management of triangular faces on a pyramid
 */
class Face {
    /**
     * @constructor creates a triangular fractal face for pyramid
     * @param {Vector} start vector is the position of the top/tip vertex of the pyramid
     * @param {number} levels defines the number triangle levels on pyramid
     */
    constructor(start, levels) {
        this._normal = new Vector_1.Vector(0, 1, 0);
        this._vertices = (0, Triangle_1.triangleFractal)(levels, start);
    }
    get normal() {
        return this._normal.clone();
    }
    get vertices() {
        let tmp = [];
        this._vertices.forEach(val => tmp.push(val.clone()));
        return tmp;
    }
    get silhouette() {
        let tmp = [];
        tmp.push(this._vertices[0].clone()); //top most vertex
        tmp.push(this._vertices[this.rightMostVertexIndex()].clone()); //rightmost vertex
        tmp.push(this._vertices[this._vertices.length - 1].clone()); //leftmost vertex
        return tmp;
    }
    /**
     * rightMostVertexIndex method is used to find the second vertex of silhouette of face
     *
     *
     *       1st vertex
     *          /\
     *         /  \
     *        /    \
     *       /      \
     *      /        \
     *     /__________\
     * 3rd vertex     2nd vertex
     *
     *
     * @returns {number} index of vertex that stores the second vertex of silhouette
     */
    rightMostVertexIndex() {
        let t = this._vertices.length / 3; //get number of triangles
        let n = -1 + Math.sqrt(1 + 8 * t);
        n /= 2; //get number of layers
        let nPrev = n - 1;
        let prevTriangles = nPrev * (nPrev + 1);
        prevTriangles /= 2; //numbers of triangles in the prev layer
        let index = prevTriangles * 3 + 1; //get index right most vertex in right most triangle on bottom layer
        return index;
    }
    /**
     * translate method moves the face in 3d space
     * @param {Vector} delta
     */
    translate(delta) {
        for (let i1 = 0; i1 < this._vertices.length; i1++) {
            this._vertices[i1] = Vector_1.Vector.add(this._vertices[i1], delta);
        }
    }
    /**
     * matrixModify applies a transformation matrix on all the vertices of face
     * @param {Matrix} m
     */
    matrixModify(m) {
        let tmp = this._vertices[0].clone();
        this.translate(Vector_1.Vector.mult(tmp, -1));
        for (let i1 = 0; i1 < this._vertices.length; i1++) {
            this._vertices[i1] = Matrix_1.Matrix.vectorMult(m, this._vertices[i1]);
        }
        this.translate(tmp);
    }
    /**
     * scale method applies a scale matrix transformation on vertices of face
     * @param {number} xScale
     * @param {number} yScale
     * @param {number} zScale
     */
    scale(xScale = 1, yScale = 1, zScale = 1) {
        this.matrixModify(Matrix_1.Matrix.scale(xScale, yScale, zScale));
    }
    /**
     * rotate method applies a rotation matrix transformation on the Z & X axis
     * @param {number} pitch
     * @param {number} yaw
     */
    rotate(pitch = 0, yaw = 0) {
        let rotationMatrix = Matrix_1.Matrix.mult(Matrix_1.Matrix.rotationZ(yaw), Matrix_1.Matrix.rotationX(pitch));
        this.matrixModify(rotationMatrix);
        this._normal = Matrix_1.Matrix.vectorMult(rotationMatrix, this._normal);
    }
}
/**
 * Pyramid class defines the management and state of vertices of a pyramid. This class is used in the generation of mountains on the header
 */
class Pyramid {
    /**
     * @constructor creates faces of Pyramid with specific characteristics
     *
     * Pyramid cross section along the ZX axis
     *   start position ->________
     *                   /\      |
     *                  /__\     |
     *                 /\  /\    | <- height
     *             __ /__\/__\   |
     *            |  /\  /\  /\  |
     * 1 layer -> |_/__\/__\/__\_|
     *              |          |
     *              |__________| <- base width
     *
     * @param {number} layers
     * @param {number} height
     * @param {number} base
     * @param {Vector} start
     */
    constructor(layers = Pyramid.defaultLayers, height = Pyramid.defaultHeight, base = Pyramid.defaultBase, start = Pyramid.defaultStart, rotation = Pyramid.defaultRotation) {
        this._faces = [];
        this._center = start.clone();
        let defaultHeight = layers * Math.sqrt(0.5);
        let defaultBase = (0, Triangle_1.trianglesInFractal)(layers) - (0, Triangle_1.trianglesInFractal)(layers - 1);
        for (let i1 = 0; i1 < 4; i1++) {
            this._faces.push(new Face(this._center, layers));
            this._faces[i1].rotate(Pyramid.defaultAngle, Math.PI / 2 * i1);
            this._faces[i1].scale(base / defaultBase, base / defaultBase, height / defaultHeight);
            this._faces[i1].rotate(0, rotation);
        }
    }
    static get defaultLayers() {
        return 1;
    }
    static get defaultHeight() {
        return 1;
    }
    static get defaultBase() {
        return 1;
    }
    static get defaultStart() {
        return new Vector_1.Vector(0, 0, 0);
    }
    static get defaultRotation() {
        return 0;
    }
    /**
     * getVertices method returns an array of all visible triangles required to draw pyramid
     * @param {Vector} cameraDirection direction vector of camera
     * @returns {Vector[]} array of Vectors that define triangles required to be drawn from specific camera orientation. The array can be partitioned in n equally sized partitions of visible faces. Each face partition is formatted in the following format: [v0, v1, v2, v3, v4, v5, ..., vn-2, vn-1, vn]; where (v0, v1, v2) are the triangles required to draw the silhouette for face & (v3, v4, v5)...(vn-2, vn-1, vn) are the triangles required to draw each level
     */
    getTriangles(cameraDir, cameraPos) {
        let visibleVectices = [];
        this._faces
            .filter(face => Vector_1.Vector.dot(face.normal, cameraDir) < 0)
            .forEach(face => {
            let silhouette = face.silhouette;
            if (silhouette.some(v => Vector_1.Vector.dot(Vector_1.Vector.sub(v, cameraPos).normalize(), cameraDir) > 0)) {
                face.silhouette.forEach(vertex => visibleVectices.push(vertex));
                if (face.vertices.length > 3) {
                    face.vertices.forEach(vertex => visibleVectices.push(Vector_1.Vector.add(vertex, Vector_1.Vector.mult(face.normal.clone(), 0.0001))));
                }
            }
        });
        return visibleVectices;
    }
    /**
     * draw method provides a set of HTMLElem required to draw pyramid
     * @param {{t0: Vector, t1: Vector, t2: Vector}} screenTriangle
     * @param {{t0: Vector, t1: Vector, t2: Vector}} originalSpaceTriangle
     * @returns
     */
    draw(screenTriangle, originalSpaceTriangle) {
        let screenTriangleTmp = [screenTriangle.t0, screenTriangle.t1, screenTriangle.t2];
        let originalSpaceTriangleTmp = [originalSpaceTriangle.t0, originalSpaceTriangle.t1, originalSpaceTriangle.t2];
        let instruction = new HTMLBuilder_1.HTMLElem("polygon");
        //instruction.endTag = false;
        let points = instruction.get("points");
        for (let i1 = 0; i1 < 3; i1++) {
            let p = screenTriangleTmp[i1];
            points.push(new HTMLBuilder_1.AttrVal(`${p.x},${p.y} `));
        }
        let isSilhouette = () => {
            return this._faces.some(face => {
                if (face.vertices.length <= 3) {
                    return true;
                }
                let silhouette = face.silhouette;
                return silhouette.every((vertex, index) => {
                    return Vector_1.Vector.equal(vertex, originalSpaceTriangleTmp[index]);
                });
            });
        };
        if (isSilhouette()) {
            instruction.get("fill")
                .push(new HTMLBuilder_1.AttrVal("#000000"));
        }
        else {
            instruction.get("fill")
                .push(new HTMLBuilder_1.AttrVal("none"));
        }
        instruction.get("stroke")
            .push(new HTMLBuilder_1.AttrVal("White"));
        instruction.get("stroke-width")
            .push(new HTMLBuilder_1.AttrVal("2"));
        return instruction;
    }
}
exports.Pyramid = Pyramid;
/**
 * defaultAngle is the radian of the pitch required to make triangular faces of pyramid
 *
 * Pyramid cross section along the ZX axis
 *         _______
 *        /|\     |
 *       /   \    |
 *      /  |  \   |<- h = sqrt(0.5)
 *     /       \  |
 *    /    |    \ |
 *   /___________\|
 *   |     |
 *   |-----|<- b = 0.5
 *
 *
 *  defaultAngle = Math.atan2(b,h)
 */
Pyramid.defaultAngle = 0.6154797086703873;

},{"../../HTMLBuilder/HTMLBuilder":3,"../../Math/Matrix":12,"../../Math/Vector":20,"./Triangle":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trianglesInFractal = exports.triangleFractal = exports.equilateralTriangleHeight = void 0;
const queue_typescript_1 = require("queue-typescript");
const Vector_1 = require("../../Math/Vector");
/**
 * equilateralTriangleHeight constant defines the height of a triangle
 */
exports.equilateralTriangleHeight = Math.sqrt(1 - 0.5 * 0.5);
/**
 * triangle function find the Vectors required in order to create triangle at start vector
 * @param {Vector} start
 * @returns {Vector[]} Three Vectors required to make a Triangle on the XZ plane
 */
function triangle(start) {
    let vertices = new Array(3);
    vertices[0] = new Vector_1.Vector(0, 0, 0);
    vertices[1] = new Vector_1.Vector(0.5, 0, -1 * exports.equilateralTriangleHeight);
    vertices[2] = new Vector_1.Vector(-0.5, 0, -1 * exports.equilateralTriangleHeight);
    for (let i1 = 0; i1 < vertices.length; i1++) {
        vertices[i1] = Vector_1.Vector.add(vertices[i1], start);
    }
    return vertices;
}
/**
 * triangleFractal function finds the vectors required to make a triangular fractal on the XZ plane
 *
 *   start position ->
 *                   /\
 *                  /__\
 *                 /\  /\
 *             __ /__\/__\
 *            |  /\  /\  /\
 * 1 level -> |_/__\/__\/__\
 * @param {number} levels
 * @param {Vector} start
 * @returns {Vector[]} array of Vectors that define triangles required to be draw the triangleFractal. The array is formatted in the form: [v0, v1, v2, ..., vn-2, vn-1, vn]; where (v0, v1, v2) ... (vn-2, vn-1, vn) define vertices required to make triangle.
 */
function triangleFractal(levels, start = new Vector_1.Vector(0, 0, 0)) {
    if (levels < 0 || levels % 1 != 0) {
        throw new Error("Invalid level parameter. levels must be from 0 - postive infinity");
    }
    let tmp = start.clone();
    let vertices = [];
    let triangleStart = new queue_typescript_1.Queue();
    triangleStart.append(tmp);
    let setVertices = new Map();
    for (let i1 = 0; i1 < trianglesInFractal(levels); i1++) {
        let triangleVertices = triangle(triangleStart.dequeue());
        triangleVertices.forEach(vector => vertices.push(vector));
        let left = triangleVertices[2];
        let right = triangleVertices[1];
        if (!setVertices.has(right)) {
            setVertices.set(right, true);
            triangleStart.append(right);
        }
        if (!setVertices.has(left)) {
            setVertices.set(left, true);
            triangleStart.append(left);
        }
    }
    return vertices;
}
exports.triangleFractal = triangleFractal;
/**
 * trianglesInFractal function finds the number of triangles defined by [triangleFractal]{@link triangleFractal}  function with a certain number of levels
 * @param {number} levels
 * @returns {number} number of triangles
 */
function trianglesInFractal(levels) {
    return (levels * (levels + 1)) / 2;
}
exports.trianglesInFractal = trianglesInFractal;

},{"../../Math/Vector":20,"queue-typescript":2}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const HTMLBuilder_1 = require("../../HTMLBuilder/HTMLBuilder");
const Matrix_1 = require("../../Math/Matrix");
const Intercept_1 = require("../../Math/Paths/Intercept");
const Line_1 = require("../../Math/Paths/Line");
const Rect_1 = require("../../Math/Paths/Rect");
const Quaternion_1 = require("../../Math/Quaternion");
const Vector_1 = require("../../Math/Vector");
class Camera {
    /**
     * constructor defines characteristics of camera
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height, nearClipping, farClipping) {
        this._pos = new Matrix_1.Matrix(4, 1); //vector (x,y,z,1)
        this._rot = new Quaternion_1.Quaternion(); //quaternion rotation of forward direction [w, x, y, z]
        this._width = 1;
        this._height = 1;
        this._nearClipping = 1;
        this._farClipping = 2;
        this.width = width;
        this.height = height;
        this.nearClipping = nearClipping;
        this.farClipping = farClipping;
    }
    get pos() {
        return new Vector_1.Vector(this._pos.getVal(0, 0), this._pos.getVal(0, 1), this._pos.getVal(0, 2));
    }
    set pos(newPos) {
        this._pos.setColumn(0, [newPos.x, newPos.y, newPos.z, 1]);
    }
    get rot() {
        return this._rot;
    }
    set rot(q) {
        this._rot.w = q.w;
        this._rot.x = q.x;
        this._rot.y = q.y;
        this._rot.z = q.z;
    }
    get width() {
        return this._width;
    }
    set width(val) {
        if (val <= 0) {
            throw new Error("Width must be greater than 0");
        }
        this._width = val;
    }
    get height() {
        return this._height;
    }
    set height(val) {
        if (val <= 0) {
            throw new Error("Height must be greater than 0");
        }
        this._height = val;
    }
    get nearClipping() {
        return this._nearClipping;
    }
    set nearClipping(val) {
        if (val < 0) {
            throw new Error("Near clipping plane must be greater than 0");
        }
        if (this.farClipping <= val) {
            throw new Error("near clipping plane cannot be greater than far clipping plane");
        }
        this._nearClipping = val;
    }
    get farClipping() {
        return this._farClipping;
    }
    set farClipping(val) {
        if (val <= this.nearClipping) {
            throw new Error(`Far clipping plane must be greater than near clipping plane ${this.nearClipping}`);
        }
        this._farClipping = val;
    }
    get forwardVector() {
        return Matrix_1.Matrix.vectorMult(this._rot.rotMatrix, new Vector_1.Vector(1, 0, 0));
    }
    get normalVector() {
        return Matrix_1.Matrix.vectorMult(this._rot.rotMatrix, new Vector_1.Vector(0, 0, 1));
    }
    /**
     * draw method gets a set of svg draw instructions to render a scene
     * @param {Renderable[]} scene is an array of Renderable objects that will be rendered
     * @param {{width: number, height: number}} screenSize is object that defines the screen size
     * @returns
     */
    draw(scene, screenSize) {
        let triangles = [];
        let source = new Map();
        let relativePosToScreenPosMap = new Map();
        let relativePosToOriginalPosMap = new Map();
        scene.forEach(renderable => {
            let objTriangles = renderable.getTriangles(this.rot.dirVector, this.pos);
            if (objTriangles.length % 3 !== 0) {
                throw new Error("Invalid triangles");
            }
            for (let i1 = 0; i1 < objTriangles.length; i1 += 3) {
                let triangle = [];
                for (let i2 = 0; i2 < 3; i2++) {
                    let v = Matrix_1.Matrix.vectorMult(//rotate base on camera rotation
                    this._rot.rotMatrix, Vector_1.Vector.sub(objTriangles[i1 + i2], this.pos) //move vertex-camera.pos
                    );
                    triangle.push(v);
                    //turn vertex 3D => screen pos 2D
                    {
                        let tmp = this.orthogonal(v);
                        relativePosToScreenPosMap.set(v, tmp);
                    }
                    relativePosToOriginalPosMap.set(v, objTriangles[i1 + i2]);
                }
                triangles.push(triangle);
                source.set(triangle, renderable);
            }
        });
        let max = (t) => {
            let max = t[0].x;
            t.forEach(v => {
                if (v.x > max) {
                    max = v.x;
                }
            });
            return max;
        };
        let unwrap = (val) => {
            if (val !== undefined) {
                return val;
            }
            throw new Error("Failed to unwrap");
        };
        triangles = triangles.filter(//filter out triangles not visible
        //filter out triangles not visible
        triangle => {
            let tmp = new Rect_1.Rect(1, 1, 0, new Vector_1.Vector(-1, -1));
            for (let i1 = 0; i1 < 3; i1++) {
                let start = unwrap(relativePosToScreenPosMap.get(triangle[i1 % 3]));
                let end = unwrap(relativePosToScreenPosMap.get(triangle[(i1 + 1) % 3]));
                { //check start point is in the viewing rect
                    let inXRange = (-1 < start.x) && (start.x < 1);
                    let inYRange = (-1 < start.y) && (start.y < 1);
                    if (inXRange && inYRange) {
                        return true;
                    }
                }
                { //checking if the line from start & end point intersect the viewing rect
                    let dir = Vector_1.Vector.sub(end, start);
                    let line = new Line_1.Line(start, dir.normalize(), Vector_1.Vector.dist(dir));
                    if ((0, Intercept_1.interceptCheck)(tmp, line)) {
                        return true;
                    }
                }
            }
            { //checking if points of rect in the triangle
                for (let x = -1; x <= 1; x += 2) {
                    for (let y = -1; x <= 1; x += 2) {
                        let point = new Vector_1.Vector(x, y);
                        if (this.pointInTriangle(triangle, point)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }).sort(//sort triangles based on dist from camera
        (t1, t2) => {
            return max(t2) - max(t1);
        });
        triangles.forEach(//re map triangle from (0,0)-screen size
        //re map triangle from (0,0)-screen size
        triangle => {
            triangle.forEach(vertex => {
                let tmp = unwrap(relativePosToScreenPosMap.get(vertex));
                tmp.x = (tmp.x + 1) / 2;
                tmp.y = (tmp.y + 1) / 2;
                tmp.x = tmp.x * screenSize.width;
                tmp.y = tmp.y * screenSize.height;
                relativePosToScreenPosMap.set(vertex, tmp);
            });
        });
        //get instructions
        let instructions = new HTMLBuilder_1.HTMLElem("g");
        triangles.forEach(triangle => {
            let r = source.get(triangle);
            let inst = r === null || r === void 0 ? void 0 : r.draw({
                t0: unwrap(relativePosToScreenPosMap.get(triangle[0])),
                t1: unwrap(relativePosToScreenPosMap.get(triangle[1])),
                t2: unwrap(relativePosToScreenPosMap.get(triangle[2]))
            }, {
                t0: unwrap(relativePosToOriginalPosMap.get(triangle[0])),
                t1: unwrap(relativePosToOriginalPosMap.get(triangle[1])),
                t2: unwrap(relativePosToOriginalPosMap.get(triangle[2]))
            });
            if (inst == undefined) {
                throw new Error("Undefined error");
            }
            instructions.addChild(inst);
        });
        return instructions;
    }
    /**
     * pointInTriangle method is a utility method to check if a point in n dimensional point exists in the plane of an n dimensional triangle
     * @param {Vector[]} triangle vertices of a triangle
     * @param {Vector} point is a vector that is being checked to be in triangle
     * @returns {boolean}
     */
    pointInTriangle(triangle, point) {
        let subTrianglesVectors = [];
        for (let i1 = 0; i1 < 3; i1++) {
            subTrianglesVectors.push([triangle[i1 % 3], triangle[(i1 + 1) % 3], point]);
        }
        let triangleSideLength = triangle.map((point, index) => {
            return Vector_1.Vector.dist(Vector_1.Vector.sub(point, triangle[(index + 1) % 3]));
        });
        let areaCalc = (a, b, c) => {
            return 0.25 * Math.sqrt((a + (b + c)) *
                (c - (a - b)) *
                (c + (a - b)) *
                (a + (b - c)));
        };
        let area = 0;
        subTrianglesVectors.map((triangle) => {
            let dists = [];
            for (let i1 = 0; i1 < 3; i1++) {
                dists.push(Vector_1.Vector.dist(Vector_1.Vector.sub(triangle[i1 % 3], triangle[(i1 + 1) % 3])));
            }
            return dists.sort().reverse();
            ;
        }).forEach((triangleSideLength) => {
            area += areaCalc(triangleSideLength[0], triangleSideLength[1], triangleSideLength[2]);
        });
        return areaCalc(triangleSideLength[0], triangleSideLength[1], triangleSideLength[2]) + 0.0000001 >= area;
    }
    /**
     * orthogonal method converts a vector in 3d space onto an 2d plane using an orthogonal projection
     * @param {Vector} v
     * @returns {Vector} 2d vector of orthogonal projection of v on plane. Such that the returned 2d vector exists from [[-1,-1],[1,1]]
     */
    orthogonal(v) {
        let vector = new Matrix_1.Matrix(4, 1);
        vector.setColumn(0, [v.y, v.z, v.x, 1]);
        let r = this.width / 2;
        let l = -1 * r;
        let t = this.height / 2;
        let b = -1 * t;
        let n = this.nearClipping;
        let f = this.farClipping;
        let orthogonalMatrix = new Matrix_1.Matrix(4, 4);
        orthogonalMatrix.setRow(0, [2 / (r - l), 0, 0, -1 * (r + l) / (r - l)]);
        orthogonalMatrix.setRow(1, [0, -2 / (t - b), 0, -1 * (t + b) / (t - b)]);
        orthogonalMatrix.setRow(2, [0, 0, -2 / (f - n), -1 * (f + n) / (f - n)]);
        orthogonalMatrix.setRow(3, [0, 0, 0, 1]);
        let tmp = Matrix_1.Matrix.mult(orthogonalMatrix, vector);
        return new Vector_1.Vector(tmp.getVal(0, 0), tmp.getVal(0, 1));
    }
    /**
     * perspective method converts a vector in 3d space onto an 2d plane using an perspective projection
     * @param {Vector} v
     * @returns {Vector} 2d vector of perspective projection of v on plane
     */
    perspective(v) {
        let vector = new Matrix_1.Matrix(4, 1);
        vector.setColumn(0, [v.y, v.z, v.x, 1]);
        let r = this.width / 2;
        let l = -1 * r;
        let t = this.height / 2;
        let b = -1 * t;
        let n = this.nearClipping;
        let f = this.farClipping;
        let perspectiveMatrix = new Matrix_1.Matrix(4, 4);
        perspectiveMatrix.setRow(0, [2 * n / (r - l), 0, (r + l), 0]);
        perspectiveMatrix.setRow(1, [0, 2 * n / (t - b), (t + b) / (t - b), 0]);
        perspectiveMatrix.setRow(2, [0, 0, -1 * (f + n) / (f - n), -2 * f * n / (f - n)]);
        perspectiveMatrix.setRow(3, [0, 0, -1, 0]);
        let tmp = Matrix_1.Matrix.mult(perspectiveMatrix, vector);
        let scale = tmp.getVal(0, 3);
        for (let i1 = 0; i1 < 3; i1++) {
            let val = tmp.getVal(0, i1);
            tmp.setVal(0, i1, val / scale);
        }
        return new Vector_1.Vector(tmp.getVal(0, 0), tmp.getVal(0, 1));
    }
}
exports.Camera = Camera;

},{"../../HTMLBuilder/HTMLBuilder":3,"../../Math/Matrix":12,"../../Math/Paths/Intercept":15,"../../Math/Paths/Line":16,"../../Math/Paths/Rect":17,"../../Math/Quaternion":18,"../../Math/Vector":20}],9:[function(require,module,exports){
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

},{"../../Math/Paths/Line":16,"../../Math/Vector":20,"./Star":10,"./StarGeneration":11}],10:[function(require,module,exports){
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
        let getDir = () => {
            if (Math.random() < 0.5) {
                return "reverse";
            }
            else {
                return "normal";
            }
        };
        let loadInTime = 900 * Math.random() + 100; //ms
        elem.get("style")
            .push(new HTMLBuilder_1.StyleAttr("animation", `loadIn ` +
            `${loadInTime}ms `));
        //console.log(`twinkle ${60*Math.random()+60}s ${60*Math.random()} infinite ${getDir()}`)
        elem.get("class").push(new HTMLBuilder_1.AttrVal("star"));
        elem.get("id").push(new HTMLBuilder_1.AttrVal(`star-${this.id}`));
        //create dom
        environment.append(elem.generate());
        let tmp = environment.find(`#star-${this.id}`);
        ;
        setTimeout(() => {
            tmp.css("animation", `twinkle ` +
                `${60 * Math.random() + 60}s ` +
                `infinite ` +
                `${getDir()}`);
        }, loadInTime);
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

},{"../../HTMLBuilder/HTMLBuilder":3,"../../Math/Paths/BezierCurve":13,"../../Math/Paths/Circle":14,"../../Math/Paths/Line":16,"../../Math/Vector":20}],11:[function(require,module,exports){
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
    /**
     * todo
     * Generate stars in a circular pattern around center of screen
     *      defined using circular coordinates
     *      (r, theta) = r * (cos(theta), sin(theta))
     *
     * environment of generation should be radius from center to corner of screen
     *
     * stars should not overlap
     *
     * stars should be generated using rect svg rather
     */
    let tmp = [];
    //console.log(environment);
    //console.log(starSettings);
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

},{"../../Math/Paths/Circle":14,"../../Math/Paths/Intercept":15,"../../Math/Paths/Rect":17,"../../Math/Vector":20,"./Star":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
const Vector_1 = require("./Vector");
/**
 * Matrix class defines methods and variables to create Matrix
 */
class Matrix {
    /**
     * @constructor creates an instance of Matrix
     * @param {number} rows
     * @param {number} columns
     */
    constructor(rows, columns) {
        this.dim = [rows, columns];
        this.values = new Array(this.rowCount * this.columnCount).fill(0);
    }
    get columnCount() {
        return this.dim[1];
    }
    ;
    get rowCount() {
        return this.dim[0];
    }
    ;
    /**
     * add method returns a matrix with the sum of two matrixes
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @returns {Matrix} Matrix with the sum of m1 + m2
     */
    static add(m1, m2) {
        if (!(m1.rowCount == m2.rowCount && m1.columnCount == m2.columnCount)) {
            throw new Error("m1 & m2 have invalid size");
        }
        let result = new Matrix(m1.rowCount, m1.columnCount);
        for (let i1 = 0; i1 < result.values.length; i1++) {
            result.values[i1] = m1.values[i1] + m2.values[i1];
        }
        return result;
    }
    /**
     * sub method returns a matrix with the difference of two matrixes
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @returns {Matrix} Matrix with the difference of m1-m2
     */
    static sub(m1, m2) {
        return this.add(m1, this.mult(m2, -1));
    }
    /**
     * mult method returns the Matrix of the product of a scalar value or another matrix
     * @param {Matrix} v1
     * @param {Matrix | number} v2
     * @return {Matrix} Matrix product of v1 * v2
     */
    static mult(v1, v2) {
        if (typeof v2 === "number") {
            return this.scalarMult(v1, v2);
        }
        return this.matrixMult(v1, v2);
    }
    /**
     * matrixMult method multiplies two matrixes
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @returns {Matrix} Matrix product of two matrixes
     */
    static matrixMult(m1, m2) {
        if (!(m1.columnCount == m2.rowCount)) {
            throw new Error("m1 & m2 have invalid size");
        }
        let result = new Matrix(m1.rowCount, m2.columnCount);
        for (let x = 0; x < result.columnCount; x++) {
            let colTmp = m2.getColumn(x);
            for (let y = 0; y < result.rowCount; y++) {
                let sum = 0;
                let rowTmp = m1.getRow(y);
                for (let i1 = 0; i1 < rowTmp.length; i1++) {
                    sum += rowTmp[i1] * colTmp[i1];
                }
                result.setVal(x, y, sum);
            }
        }
        return result;
    }
    /**
     * scalarMult method returns the product of a matrix and a scalar number
     * @param {Matrix} m1
     * @param {number} s
     * @returns {Matrix} Matrix product of Matrix and scalar value
     */
    static scalarMult(m1, s) {
        let result = new Matrix(m1.rowCount, m1.columnCount);
        for (let i1 = 0; i1 < result.values.length; i1++) {
            result.values[i1] = m1.values[i1] * s;
        }
        return result;
    }
    /**
     * vectorMult method returns the vector product of a matrix and vector
     * @param {Matrix} m1
     * @param {Vector} v
     * @returns {Vector} Vector product of Matrix and Vector
     */
    static vectorMult(m1, v) {
        let m2 = new Matrix(3, 1);
        m2.setRow(0, [v.x]);
        m2.setRow(1, [v.y]);
        m2.setRow(2, [v.z]);
        let result = Matrix.mult(m1, m2);
        return new Vector_1.Vector(result.getVal(0, 0), result.getVal(0, 1), result.getVal(0, 2));
    }
    /**
     * rotationX method generates rotation matrix around the x axis
     * @param {number} theta
     * @returns Rotation matrix around the x axis
     */
    static rotationX(theta) {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        let m = new Matrix(3, 3);
        m.setRow(0, [1, 0, 0]);
        m.setRow(1, [0, cos, -1 * sin]);
        m.setRow(2, [0, sin, cos]);
        return m;
    }
    /**
     * rotationY method generates rotation matrix around the y axis
     * @param {number} theta
     * @returns Rotation matrix around the y axis
     */
    static rotationY(theta) {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        let m = new Matrix(3, 3);
        m.setRow(0, [cos, 0, sin]);
        m.setRow(1, [0, 1, 0]);
        m.setRow(2, [-1 * sin, 0, cos]);
        return m;
    }
    /**
     * rotationZ method generates rotation matrix around the z axis
     * @param {number} theta
     * @returns Rotation matrix around the z axis
     */
    static rotationZ(theta) {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        let m = new Matrix(3, 3);
        m.setRow(0, [cos, -1 * sin, 0]);
        m.setRow(1, [sin, cos, 0]);
        m.setRow(2, [0, 0, 1]);
        return m;
    }
    /**
     * scale method generates scaling matrix
     * @param {number} xScale
     * @param {number} yScale
     * @param {number} zScale
     * @returns {Matrix} scale matrix
     */
    static scale(xScale = 1, yScale = 1, zScale = 1) {
        let m = new Matrix(3, 3);
        m.setRow(0, [xScale, 0, 0]);
        m.setRow(1, [0, yScale, 0]);
        m.setRow(2, [0, 0, zScale]);
        return m;
    }
    /**
     * getVal method gets value from matrix at specific coordinate
     * @param {number} x
     * @param {number} y
     * @returns {number} matrix value at (x,y)
     */
    getVal(x, y) {
        if (x < 0 || this.columnCount <= x) {
            throw new Error("column out of range");
        }
        if (y < 0 || this.rowCount <= y) {
            throw new Error("row out of range");
        }
        return this.values[x + this.columnCount * y];
    }
    /**
     * setVal method updates value of matrix at (x,y)
     * @param {number} x
     * @param {number} y
     * @param {number} val
     */
    setVal(x, y, val) {
        if (x < 0 || this.columnCount <= x) {
            throw new Error("column out of range");
        }
        if (y < 0 || this.rowCount <= y) {
            throw new Error("row out of range");
        }
        this.values[x + this.columnCount * y] = val;
    }
    /**
     * getRow method returns an array of a row in matrix
     * @param {number} row
     * @returns {number[]} array of numbers in a row
     */
    getRow(row) {
        let vals = new Array(this.columnCount);
        for (let x = 0; x < this.columnCount; x++) {
            vals[x] = this.getVal(x, row);
        }
        return vals;
    }
    /**
     * setRow method updates row in matrix
     * @param {number} row
     * @param {number[]} values
     */
    setRow(row, values) {
        if (values.length != this.columnCount) {
            throw new Error("Invalid size");
        }
        for (let x = 0; x < this.columnCount; x++) {
            this.setVal(x, row, values[x]);
        }
    }
    /**
     * getColumn method returns an array of a column in matrix
     * @param {number} column
     * @returns {number[]} array of numbers in a column
     */
    getColumn(column) {
        let vals = new Array(this.rowCount);
        for (let y = 0; y < this.rowCount; y++) {
            vals[y] = this.getVal(column, y);
        }
        return vals;
    }
    /**
     * setColumn method updates column in matrix
     * @param {number} column
     * @param {number[]} values
     */
    setColumn(column, values) {
        if (values.length != this.rowCount) {
            throw new Error("Invalid size");
        }
        for (let y = 0; y < this.rowCount; y++) {
            this.setVal(column, y, values[y]);
        }
    }
    /**
     * toString method converts matrix into string representation
     * @returns {string} string representation of Matrix
     */
    toString() {
        let tmp = "";
        for (let y = 0; y < this.rowCount; y++) {
            for (let x = 0; x < this.columnCount; x++) {
                tmp += `${this.getVal(x, y)} `;
            }
            tmp += "\n";
        }
        return tmp;
    }
    /**
     * clone method creates a deep copy of matrix
     * @returns {Matrix} Deep copy of Matrix
     */
    clone() {
        let tmp = new Matrix(this.rowCount, this.columnCount);
        this.values.forEach((val, i) => tmp.values[i] = val);
        return tmp;
    }
}
exports.Matrix = Matrix;

},{"./Vector":20}],13:[function(require,module,exports){
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

},{"../Vector":20,"./Line":16}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
const Vector_1 = require("../Vector");
/**
 * Circle class defines methods and variables to create circle path
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

},{"../Vector":20}],15:[function(require,module,exports){
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
function interceptChecks(path, colliders, ignoreIndex = []) {
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

},{"../Vector":20,"./Circle":14,"./Line":16,"./Rect":17}],16:[function(require,module,exports){
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

},{"../Vector":20}],17:[function(require,module,exports){
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

},{"../Vector":20,"./Line":16}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaternion = void 0;
const Matrix_1 = require("./Matrix");
const Vector_1 = require("./Vector");
class Quaternion extends Matrix_1.Matrix {
    /**
     * interpolation static method is a higher order function that returns a interpolation function
     * @param {Interpolation<number>} wAlgorithm: interpolation function to be used on the w axis
     * @param {Interpolation<number>} xAlgorithm: interpolation function to be used on the x axis
     * @param {Interpolation<number>} yAlgorithm: interpolation function to be used on the y axis
     * @param {Interpolation<number>} zAlgorithm: interpolation function to be used on the z axis
     * @returns {Interpolation<Quaternion>} interpolation function that takes a number and interpolates between different quaternions
     */
    static interpolation(wAlgorithm, xAlgorithm, yAlgorithm, zAlgorithm) {
        return (n) => {
            let final = new Quaternion();
            final.w = wAlgorithm(n);
            final.x = xAlgorithm(n);
            final.y = yAlgorithm(n);
            final.z = zAlgorithm(n);
            return final;
        };
    }
    get w() {
        return this.getVal(0, 0);
    }
    set w(val) {
        this.setVal(0, 0, val);
    }
    get x() {
        return this.getVal(0, 1);
    }
    set x(val) {
        this.setVal(0, 1, val);
    }
    get y() {
        return this.getVal(0, 2);
    }
    set y(val) {
        this.setVal(0, 2, val);
    }
    get z() {
        return this.getVal(0, 3);
    }
    set z(val) {
        this.setVal(0, 3, val);
    }
    get dirVector() {
        return Matrix_1.Matrix.vectorMult(this.rotMatrix, new Vector_1.Vector(1, 0, 0));
    }
    set dirVector(v1) {
        let v0 = new Vector_1.Vector(1, 0, 0);
        v1 = v1.normalize();
        let cross = Vector_1.Vector.cross(v0, v1);
        cross.normalize();
        let w = Math.sqrt(Math.pow(Vector_1.Vector.dist(v0), 2) * Math.pow(Vector_1.Vector.dist(v1), 2)) + Vector_1.Vector.dot(v0, v1);
        this.w = w;
        this.x = cross.x;
        this.y = cross.y;
        this.z = cross.z;
        this.normalize();
    }
    get rotMatrix() {
        let m = new Matrix_1.Matrix(3, 3);
        m.setRow(0, [
            1 - 2 * (this.y * this.y + this.z * this.z),
            2 * (this.x * this.y - this.w * this.z),
            2 * (this.w * this.y + this.x * this.z)
        ]);
        m.setRow(1, [
            2 * (this.x * this.y + this.w * this.z),
            1 - 2 * (this.x * this.x + this.z * this.z),
            2 * (this.y * this.z - this.w * this.x)
        ]);
        m.setRow(2, [
            2 * (this.x * this.z - this.w * this.y),
            2 * (this.w * this.x + this.y * this.z),
            1 - 2 * (this.x * this.x + this.y * this.y)
        ]);
        return m;
    }
    get dist() {
        let sum = 0;
        for (let i = 0; i < this.rowCount; i++) {
            let val = this.getVal(0, i);
            sum += val * val;
        }
        return Math.sqrt(sum);
    }
    /**
     * constructor generates a quaternion at (1,0,0,0). Where q = (w,x,y,z). The quaternion is represented by a 1 by 4 matrix.
     */
    constructor() {
        super(4, 1);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    }
    /**
     * setDir method defines a quaternion using a rotation vector an angle that rotates around the rotation vector
     * @param {Vector} rotationVec
     * @param {number} angle is a number in radians
     */
    setDir(rotationVec, angle) {
        rotationVec = rotationVec.normalize();
        let w;
        let x;
        let y;
        let z;
        //convert angle: [0, 2*Pi] -> [-1, 1]
        {
            let tmp = angle % (2 * Math.PI); //angle = [0, 2*pi]
            tmp /= 2 * Math.PI; //angle = [0, 1]
            tmp -= 0.5; //angle = [-0.5, 0.5]
            tmp *= 2; //angle = [-1, 1]
            w = tmp;
        }
        //uses w to find x,y,z
        {
            /*
            let q be normalized quaternion

            q = (w,x,y,z)

            let q' be the initial non normalized quaternion

            q' = (w',x',y',z')

            let w be q.w value & is derived in the previous section
            let x',y',z' be known

            therefore,
            ||q|| = 1
            ||q'|| = (w'^2 + x'^2 + y'^2 + z'^2)^0.5
            
            1: w = w' * ||q'||^(-1)
            2: x = x' * ||q'||^(-1)
            3: y = y' * ||q'||^(-1)
            4: z = z' * ||q'||^(-1)
            
            therefore, from equation 1
            w = w' * ||q'||^(-1)
            or, w * ||q'|| = w'
            or, w * (w'^2 + x'^2 + y'^2 + z'^2)^0.5 = w'
            or, w^2 * (w'^2 + x'^2 + y'^2 + z'^2) = w'^2
            or, w^2 * w'^2 + w^2 * (x'^2 + y'^2 + z'^2) = w'^2
            or, w^2 * (x'^2 + y'^2 + z'^2) = w'^2 - w^2 * w'^2
            or, w^2 * (x'^2 + y'^2 + z'^2) = w'^2 * (1 - w^2)
            or, w^2 * (x'^2 + y'^2 + z'^2) * (1 - w^2)^(-1) = w'^2
            or, (w^2 * (x'^2 + y'^2 + z'^2) * (1 - w^2)^(-1))^0.5 = w'
            or, w'= (w^2 * (x'^2 + y'^2 + z'^2) * (1 - w^2)^(-1))^0.5

            since, w' has now been derived. Therefore, ||q'|| can be calculated & the remaining unknowns can be derived from equations 2-4.
            
            since there is a discontinuous at w = 1
            then, lim w -> 0 then x = 0, y = 0, z = 0
            */
            if (1 - w * w === 0) {
                x = 0;
                y = 0;
                z = 0;
            }
            else {
                let tmp = Math.sqrt(w * w * (rotationVec.x * rotationVec.x + rotationVec.y * rotationVec.y + rotationVec.z * rotationVec.z) / (1 - w * w));
                tmp = Math.sqrt(rotationVec.x * rotationVec.x + rotationVec.y * rotationVec.y + rotationVec.z * rotationVec.z + tmp * tmp);
                x = rotationVec.x / tmp;
                y = rotationVec.y / tmp;
                z = rotationVec.z / tmp;
            }
        }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * normalize method converts quaternion such that ||q|| = 1
     * @returns {Quaternion} reference to self
     */
    normalize() {
        let dist = this.dist;
        this.w /= dist;
        this.x /= dist;
        this.y /= dist;
        this.z /= dist;
        return this;
    }
}
exports.Quaternion = Quaternion;

},{"./Matrix":12,"./Vector":20}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomStringGenerator = exports.randomFloatGenerator = exports.randomIntGenerator = void 0;
const defaultA = 46199;
const defaultC = 378401;
const defaultM = 605009;
/**
 * randomIntGenerator function returns a linear congruential generator function that returns a random int between range
 * @param {number | string} seed
 * @param {number} min: minimum int outputted from generator function
 * @param {number} max: maximum int outputted from generator function
 * @param {number} a: multiplier
 * @param {number} c: offset
 * @param {number} m: modulus
 * @returns {randomNumberGenerator<number>}
 */
function randomIntGenerator(seed, min, max, a = defaultA, c = defaultC, m = defaultM) {
    if (m < 0) {
        throw new Error("modulus must be greater than");
    }
    a = a % m;
    c = c % m;
    if (max < min) {
        throw new Error("Invalid min and max value");
    }
    let seedNum = rawToUseableSeed(seed);
    let state = seedNum % m;
    return () => {
        let nextState = (a * state + c) % m;
        state = nextState;
        return (nextState % (max - min + 1)) + min;
    };
}
exports.randomIntGenerator = randomIntGenerator;
/**
 * randomFloatGenerator function returns a linear congruential generator function that returns a random float between 0 - 1
 * @param {number | string} seed
 * @param {number} a: multiplier
 * @param {number} c: offset
 * @param {number} m: modulus
 * @returns {randomNumberGenerator<number>}
 */
function randomFloatGenerator(seed, a = defaultA, c = defaultC, m = defaultM) {
    if (m < 0) {
        throw new Error("modulus must be greater than");
    }
    a = a % m;
    c = c % m;
    let seedNum = rawToUseableSeed(seed);
    let state = seedNum % m;
    return () => {
        let nextState = (a * state + c) % m;
        state = nextState;
        return nextState / m;
    };
}
exports.randomFloatGenerator = randomFloatGenerator;
/**
 * randomStringGenerator function returns a linear congruential generator function that returns a random string
 * @param {number} min: min string length
 * @param {number} max: max string length
 * @param {number | string} seed
 * @param {number} a: multiplier
 * @param {number} c: offset
 * @param {number} m: modulus
 * @returns {randomNumberGenerator<number>}
 */
function randomStringGenerator(seed, min, max) {
    if (min < 0 || max < min) {
        throw new Error(`Invalid string lengths: "${min}", "${max}" are not valid lengths;`);
    }
    let seedNext = randomIntGenerator(seed, 0, 100);
    return () => {
        let stringSizeGen = randomIntGenerator(seedNext(), min, max);
        let randomChar = randomIntGenerator(seedNext(), 33, 126);
        let strLength = stringSizeGen();
        let tmp = "";
        for (let i1 = 0; i1 < strLength; i1++) {
            let charCode = randomChar();
            tmp += String.fromCharCode(charCode);
        }
        return tmp;
    };
}
exports.randomStringGenerator = randomStringGenerator;
function rawToUseableSeed(seed) {
    if (typeof (seed) == 'string') {
        return seedToNumber(seed);
    }
    return seed;
}
function seedToNumber(seedStr) {
    let tmp = "";
    for (let i1 = 0; i1 < seedStr.length; i1++) {
        let char = seedStr.charAt(i1);
        let code = char.charCodeAt(0);
        tmp += code.toString();
    }
    return Number.parseInt(tmp);
}

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
/**
 * Vector class defines methods and variables to create 3d/2d vector
 */
class Vector {
    /**
     * @constructor creates Vector class
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * clone method creates a deep copy of Vector
     * @returns {Vector} deep copy of Vector
     */
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    /**
     * normalize method turns Vector into a vector with a magnitude of 1
     * @returns {Vector} method returns self
     */
    normalize() {
        let dist = Vector.dist(this);
        this.x = this.x / dist;
        this.y = this.y / dist;
        this.z = this.z / dist;
        return this;
    }
    /**
     * add method returns vector with sum of two vectors
     * V = v1 + v2
     * @param {Vector} v1
     * @param {Vector} v2
     * @returns {Vector} Vector with the sum of v1 + v2
     */
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    /**
     * sub method returns the vector with difference of two vectors
     * V = v1 - v2
     * @param {Vector} v1
     * @param {Vector} v2
     * @returns {Vector} Vector with the difference of v1 - v2
     */
    static sub(v1, v2) {
        return Vector.add(v1, Vector.mult(v2, -1));
    }
    /**
     * mult method returns the vector product of scalar multiplication
     * V = n * v
     * @param {Vector} v
     * @param {number} n
     * @returns {Vector} Vector with the product of n * v1
     */
    static mult(v, n) {
        return new Vector(v.x * n, v.y * n, v.z * n);
    }
    /**
     * div method returns the vector quotient of scalar multiplication
     * V = n^-1 * v
     * @param {Vector} v
     * @param {number} n
     * @returns {Vector} Vector with the product of n^-1 * v
     */
    static div(v, n) {
        return new Vector(v.x / n, v.y / n, v.z / n);
    }
    /**
     * dot method returns the dot product of two vectors
     * @param {Vector} v1
     * @param {Vector} v2
     * @returns {number} dot product of v1 and v2
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    /**
     * cross method returns the cross product of two vectors
     * @param {Vector} v1
     * @param {Vector} v2
     * @returns {Vector} cross product of v1 and v2
     */
    static cross(v1, v2) {
        return new Vector(v1.y * v2.z - v2.y * v1.z, v1.z * v2.x - v2.z * v1.x, v1.x * v2.y - v2.x * v1.y);
    }
    /**
     * dist method returns the magnitude of a vector
     * @param {Vector} v
     * @returns {number} magnitude of a vector
     */
    static dist(v) {
        return Math.sqrt(Vector.dot(v, v));
    }
    /**
     * normalize method return a normalized vector without manipulating input vector
     * @param {Vector} v
     * @returns normalized vector of v
     */
    static normalize(v) {
        return v.clone().normalize();
    }
    /**
     * projection method returns a vector projected on a target vector
     * @param {Vector} v vector that will be projected on projection vector
     * @param {Vector} proj vector that will be projected on
     * @returns {Vector} projected vector
     */
    static projection(v, proj) {
        let v1 = proj;
        return Vector.mult(v1, Vector.dot(v, v1) / Vector.dot(v1, v1));
    }
    /**
     * equal method returns a boolean of whether two vectors are equivalent
     * @param {Vector} v1
     * @param {Vector} v2
     * @returns {boolean} boolean of whether v1 == v2
     */
    static equal(v1, v2, threshold = 0.00001) {
        return Math.abs(v1.x - v2.x) < threshold &&
            Math.abs(v1.y - v2.y) < threshold &&
            Math.abs(v1.z - v2.z) < threshold;
    }
    /**
     * interpolation static method is a higher order function that returns a interpolation function
     * @param {Interpolation<number>} xAlgorithm: interpolation function to be used on the x axis
     * @param {Interpolation<number>} yAlgorithm: interpolation function to be used on the y axis
     * @param {Interpolation<number>} zAlgorithm: interpolation function to be used on the z axis
     * @returns {Interpolation<Vector>} interpolation function that takes a number and interpolates between different Vector
     */
    static interpolation(xAlgorithm, yAlgorithm, zAlgorithm) {
        return (n) => {
            return new Vector(xAlgorithm(n), yAlgorithm(n), zAlgorithm(n));
        };
    }
}
exports.Vector = Vector;

},{}]},{},[4]);
