(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagList = exports.Tag = void 0;
/**
 * Skill is class that stores the values related to Skill tags
 */
class Tag {
    /**
     * constructor for Skill
     * @param {number} id: integer representation of id of object
     * @param {string} colour: hexadecimal representation of skill
     * @param {string} symbol: name of symbol string
     * @param {number} tagType: tagType represents type of tag
     */
    constructor(id, colour, symbol, tagType) {
        this.id_ = 0;
        this.colour_ = "";
        this.symbol_ = "";
        this.tagType_ = 0;
        this.id_ = id;
        this.colour = colour;
        this.symbol_ = symbol;
        this.tagType_ = tagType;
    }
    get id() {
        return this.id_;
    }
    get colour() {
        return this.colour_;
    }
    set colour(value) {
        let valueTmp = value.replace(/^\#+/g, '');
        if (valueTmp.length != 6) {
            return;
        }
        let validCheck = valueTmp.split("")
            .every((char) => {
            console.log(`char:${char} | ${"0123456789abcdef".indexOf(char.toLocaleLowerCase())}`);
            return "0123456789abcdef".indexOf(char.toLocaleLowerCase()) != -1;
        });
        if (validCheck) {
            this.colour_ = valueTmp;
        }
    }
    get symbol() {
        return this.symbol_;
    }
    get tagType() {
        return this.tagType_;
    }
}
exports.Tag = Tag;
/**
 * Skill List is a singleton pattern of all Skills stored on Database
 */
class TagList {
    /**
     * private constructor creates instance of SkillList
     */
    constructor() {
        /**
         * {[key: number]: Tag } skills_: Dictionary of all skills id -> Tag
         */
        this.skills_ = {};
        this.keys = [];
        this.connections_ = [];
        this.skills_ = {};
        this.connections_ = [];
    }
    /**
     * skills getter returns array of tags
     */
    get tags() {
        let skills = [];
        for (let i = 0; i < this.keys.length; i++) {
            skills.push(this.skills_[this.keys[i]]);
        }
        return skills;
    }
    /**
     * connections getter returns a 2d array of the connections between tags. let a connection be represented as connections[x][y]; then connections[x] is the list of all the connections that start from skills[x] and connections[x][y] is end point connection skills[y] (skills[x] -> skills[y])
     */
    get connections() {
        let map = {};
        //map tag id -> tag index in skills array
        for (let i = 0; i < this.keys.length; i++) {
            map[this.keys[i]] = i;
        }
        let connectionsTmp = [];
        for (let i = 0; i < this.connections_.length; i++) {
            let edge = this.connections_[i];
            connectionsTmp.push([map[edge[0]], map[edge[1]]]);
        }
        return connectionsTmp;
    }
    /**
     * getInstance method returns an instance of SkillList singleton
     * @param {() => void} listener: function that is called after database information is retrieved
     * @returns reference to SkillList
     */
    static getInstance(listener = () => { }) {
        if (!TagList.instance) {
            TagList.instance = new TagList();
            TagList.instance.update(listener);
        }
        return TagList.instance;
    }
    /**
     * update method gets list of Skill and organizational tags from database
     * @param {() => void} listener: function that is called after database information is retrieved
     */
    update(listener) {
        $.ajax({
            type: "POST",
            url: "get_data",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(["skill", "related"])
        }).done(function (dataRaw) {
            if (dataRaw.length != 2) {
                throw Error("Expect one value");
            }
            let skillJson = JSON.parse(dataRaw[0])["data"];
            let connectionsJson = JSON.parse(dataRaw[1])["data"];
            for (let i = 0; i < skillJson.length; i++) {
                TagList.getInstance().updateSkill(skillJson[i]["id"], skillJson[i]["colour"], skillJson[i]["symbol"], skillJson[i]["tag_type"]);
            }
            for (let i = 0; i < connectionsJson.length; i++) {
                TagList.getInstance().updateConnection(connectionsJson[i]["tag_1"], connectionsJson[i]["tag_2"]);
            }
            listener();
        });
    }
    /**
     * updateSkill method update skill with specific id
     * @param {number} id: id of skill tag that will be updated
     * @param {string} colour
     * @param {string} symbol
     * @param {number} tagType
     */
    updateSkill(id, colour, symbol, tagType) {
        if (!this.skills_.hasOwnProperty(id)) {
            this.keys.push(id);
            this.keys = this.keys.sort((a, b) => { return a - b; });
        }
        this.skills_[id] = new Tag(id, colour, symbol, tagType);
    }
    /**
     * updateConnection connection between two skill tags
     * @param id1
     * @param id2
     */
    updateConnection(id1, id2) {
        if (!this.skills_.hasOwnProperty(id1) || !this.skills_.hasOwnProperty(id2)) {
            return;
        }
        //sort connections
        //check if id1, id2 exist
        this.connections_.push([id1, id2]);
    }
    /**
     * resets a skills and connections relationship
     */
    reset() {
        this.skills_ = {};
        this.connections_ = [];
    }
}
exports.TagList = TagList;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
function toId(str) {
    return str.replace(" ", "-")
        .replace("#", "Sharp");
}
function createSkills() {
    var _a;
    let target = $("#skills > div").first();
    let skillsHTML = new HTMLBuilder_1.HTMLElem("div");
    let tags = Tag_1.TagList.getInstance()
        .tags
        .filter((tag) => {
        return tag.tagType === 0;
    });
    tags.forEach((skill) => {
        let elem = new HTMLBuilder_1.HTMLElem("div");
        elem.get("id").push(new HTMLBuilder_1.AttrVal(toId(skill.symbol)));
        elem.get("class").push(new HTMLBuilder_1.AttrVal("skill"));
        let img = new HTMLBuilder_1.HTMLElem("img");
        img.get("src").push(new HTMLBuilder_1.AttrVal(`src\\media\\img\\icons\\${skill.symbol}_icon.svg`));
        img.get("alt").push(new HTMLBuilder_1.AttrVal(`${skill.symbol} icon`));
        let text = new HTMLBuilder_1.HTMLElem("div");
        text.addChild(new HTMLBuilder_1.HTMLText(`${skill.symbol}`));
        elem.addChild(img);
        elem.addChild(text);
        skillsHTML.addChild(elem);
    });
    let rowCount = Math.floor(((_a = target.width()) !== null && _a !== void 0 ? _a : 0) / 100);
    if ((tags.length / rowCount) % 1 != 0) {
        let fillerCount = Math.floor((1 - ((tags.length / rowCount) % 1)) * rowCount);
        for (let i1 = 0; i1 < fillerCount; i1++) {
            let elem = new HTMLBuilder_1.HTMLElem("div");
            elem.get("class").push(new HTMLBuilder_1.AttrVal("skill"));
            skillsHTML.addChild(elem);
        }
    }
    target.html(skillsHTML.generateChildren());
}
function createOrganizationButton() {
    let target = $("#skills > nav").first();
    let htmlBuilder = new HTMLBuilder_1.HTMLElem("div");
    let createVal = (symbol, colour) => {
        let htmlBuilder = new HTMLBuilder_1.HTMLElem("div");
        htmlBuilder.get("id")
            .push(new HTMLBuilder_1.AttrVal(toId(symbol)));
        let container = new HTMLBuilder_1.HTMLElem("span");
        let text = new HTMLBuilder_1.HTMLText(symbol);
        container.addChild(text);
        htmlBuilder.addChild(container);
        document.styleSheets[0].addRule(`#skills > nav > #${toId(symbol)}::after`, `background-color: #${colour};`);
        return htmlBuilder;
    };
    htmlBuilder.addChild(createVal("all", "FFF"));
    let tagList = Tag_1.TagList.getInstance();
    let tags = tagList.tags;
    let connections = tagList.connections;
    let catagoriesTmp = new Array(tags.length).fill(false);
    for (let i1 = 0; i1 < connections.length; i1++) {
        let conn = connections[i1];
        let tag1 = tags[conn[0]];
        let tag2 = tags[conn[1]];
        let tmp;
        //both tags are organizational
        if (tag1.tagType == tag2.tagType && tag1.tagType == 2) {
            continue;
        }
        if (catagoriesTmp[conn[0]] || catagoriesTmp[conn[1]]) {
            continue;
        }
        if (tag1.tagType == 2) {
            tmp = tag1;
            catagoriesTmp[conn[0]] = true;
        }
        else {
            tmp = tag2;
            catagoriesTmp[conn[1]] = true;
        }
        htmlBuilder.addChild(createVal(tmp.symbol, tmp.colour));
    }
    target.html(htmlBuilder.generateChildren());
    for (let i1 = 0; i1 < catagoriesTmp.length; i1++) {
        if (!catagoriesTmp[i1]) {
            continue;
        }
        let id = `#skills > nav > #${toId(tags[i1].symbol)}`;
        $(id).on("click", () => {
            select(i1);
        });
        $(id).css("border-color", tags[i1].colour);
    }
    $(`#skills > nav > #all`).on("click", () => {
        select(-1);
    });
}
//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
}
function rgba(col, opacity) {
    let calculate = (foreground, background) => {
        return foreground * opacity + (1 - opacity) * background;
    };
    return {
        r: calculate(col.r, 0),
        g: calculate(col.g, 0),
        b: calculate(col.b, 0)
    };
}
function deSelect() {
    $("#skills > nav .selected").removeClass("selected");
    $("#skills > div .skill").removeClass("selected");
}
function select(idIndex) {
    deSelect();
    let tags = Tag_1.TagList.getInstance().tags;
    let connections = Tag_1.TagList.getInstance().connections;
    let col;
    if (idIndex === -1) {
        $(`#skills > nav > #all`).addClass("selected");
        col = { r: 0, g: 0, b: 0 };
        connections.forEach((conn) => {
            $(`#skills > div #${toId(tags[conn[0]].symbol)}`).addClass("selected");
            $(`#skills > div #${toId(tags[conn[1]].symbol)}`).addClass("selected");
        });
    }
    else {
        let id = `#skills > nav > #${toId(tags[idIndex].symbol)}`;
        col = rgba(hexToRgb(`#${tags[idIndex].colour}`), 0.75);
        $(id).addClass("selected");
        connections
            .filter((conn) => {
            return conn[0] == idIndex || conn[1] == idIndex;
        })
            .forEach((conn) => {
            let id;
            if (conn[0] != idIndex) {
                id = conn[0];
            }
            else {
                id = conn[1];
            }
            $(`#skills > div #${toId(tags[id].symbol)}`).addClass("selected");
        });
    }
    let newBg = new HTMLBuilder_1.HTMLElem("div");
    let timeStamp = new Date().getTime();
    newBg.get("id").push(new HTMLBuilder_1.AttrVal(`bg-${timeStamp}`));
    newBg.get("class").push(new HTMLBuilder_1.AttrVal("bg"));
    newBg.get("style").push(new HTMLBuilder_1.StyleAttr("background-color", `rgb(${col.r}, ${col.g}, ${col.b})`));
    $(`#skills > div`).append(newBg.generate());
    setTimeout(() => {
        $(`#skills > div`).css("background-color", `rgb(${col.r}, ${col.g}, ${col.b})`);
        setTimeout(() => {
            $(`#skills > div #bg-${timeStamp}`).remove();
        }, 500 * 0.1);
    }, 500 * 0.9);
}
$(window).on('resize', () => {
    createSkills();
    createOrganizationButton();
    select(-1);
});
let tags = Tag_1.TagList.getInstance();
tags.update(() => {
    createSkills();
    createOrganizationButton();
    select(-1);
});

},{"../DataBaseHandler/Tag":1,"../HTMLBuilder/HTMLBuilder":2}]},{},[3]);