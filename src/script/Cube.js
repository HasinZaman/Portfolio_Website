(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const CycleGroup_1 = require("./CycleGroup");
/*
    "0": front,
    "1": back,
    "2": left,
    "3": right,
    "4": up,
    "5": down,
*/
class Cube {
    constructor(cube) {
        let cubeHTML = new HTMLBuilder_1.HTMLElem("");
        ["front", "back", "left", "right", "up", "down"].forEach((faceClass) => {
            let face = new HTMLBuilder_1.HTMLElem("div");
            face.get("class").push(new HTMLBuilder_1.AttrVal(faceClass));
            cubeHTML.addChild(face);
        });
        cube.html(cubeHTML.generateChildren());
        cube.addClass("cube");
        cube.attr("front", "front");
        this.cube = cube;
    }
    get faces() {
        let _faces = [
            this.cube.find(".front"),
            this.cube.find(".back"),
            this.cube.find(".left"),
            this.cube.find(".right"),
            this.cube.find(".up"),
            this.cube.find(".down"),
        ];
        switch (this.cube.attr("front")) {
            case "front":
                break;
            case "back":
                for (let i1 = 0; i1 < 2; i1++) {
                    _faces = Cube.rho.next(_faces);
                }
                break;
            case "left":
                for (let i1 = 0; i1 < 1; i1++) {
                    _faces = Cube.rho.next(_faces);
                }
                break;
            case "right":
                for (let i1 = 0; i1 < 3; i1++) {
                    _faces = Cube.rho.next(_faces);
                }
                break;
            case "up":
                for (let i1 = 0; i1 < 3; i1++) {
                    _faces = Cube.phi.next(_faces);
                }
                break;
            case "down":
                for (let i1 = 0; i1 < 0; i1++) {
                    _faces = Cube.phi.next(_faces);
                }
                break;
        }
        return {
            front: _faces[0],
            back: _faces[1],
            left: _faces[2],
            right: _faces[3],
            up: _faces[4],
            down: _faces[5],
        };
    }
    set front(val) {
        switch (val) {
            case "front":
                this.cube.attr("front", "front");
                break;
            case "back":
                this.cube.attr("front", "back");
                break;
            case "left":
                this.cube.attr("front", "left");
                break;
            case "right":
                this.cube.attr("front", "right");
                break;
            case "up":
                this.cube.attr("front", "up");
                break;
            case "down":
                this.cube.attr("front", "down");
                break;
        }
    }
}
Cube.rho = new CycleGroup_1.Generator([3, 2, 0, 1, 4, 5]); //y axis rotation
Cube.phi = new CycleGroup_1.Generator([4, 5, 2, 3, 1, 0]); //x axis rotation
let cube = new Cube($(".cube"));
let faces = cube.faces;
faces.front.text("front");
faces.back.text("back");
faces.left.text("left");
faces.right.text("right");
faces.up.text("up");
faces.down.text("down");
cube.front = "up";
console.log(cube.faces);

},{"../HTMLBuilder/HTMLBuilder":3,"./CycleGroup":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
class Generator {
    constructor(operation) {
        if (!Generator.validOperation(operation)) {
            throw new Error("Invalid operation");
        }
        this.operation = operation;
    }
    next(state) {
        if (state.length != this.operation.length) {
            throw new Error("state has an invalid size");
        }
        let nextState = new Array(state.length);
        this.operation.forEach((next, index) => {
            nextState[next] = state[index];
        });
        return nextState;
    }
    static validOperation(operation) {
        let tmp = new Array(operation.length).fill(false);
        for (let i1 = 0; i1 < operation.length; i1++) {
            let next = operation[i1];
            //next value out of range
            if (next < 0 || tmp.length < next) {
                return false;
            }
            //double visit of index
            if (tmp[next]) {
                return false;
            }
            tmp[next] = true;
        }
        return true;
    }
}
exports.Generator = Generator;

},{}],3:[function(require,module,exports){
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

},{}]},{},[1]);
