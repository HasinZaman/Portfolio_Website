(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgba = exports.hexToRgb = void 0;
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
exports.hexToRgb = hexToRgb;
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
exports.rgba = rgba;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectList = exports.Project = void 0;
const Tag_1 = require("./Tag");
/**
 * Project class stores the values related to a project
 */
class Project {
    /**
     * Constructor creates Project
     * @param id
     * @param primaryTag
     * @param start
     * @param update
     * @param desc
     * @param link
     */
    constructor(primaryTag, start, update, desc, link) {
        this._primaryTag = primaryTag;
        this._start = start;
        this._update = update;
        this._desc = desc;
        this._link = link;
    }
    get name() {
        return this.tag.symbol;
    }
    get colour() {
        return this.tag.colour;
    }
    get tag() {
        return Tag_1.TagList.getInstance().tags[this._primaryTag];
    }
    get start() {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(this._start);
    }
    get startUnix() {
        return this._start.getTime();
    }
    get update() {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(this._update);
    }
    get updateUnix() {
        return this._update.getTime();
    }
    get description() {
        return this._desc;
    }
    get link() {
        return this._link;
    }
}
exports.Project = Project;
/**
 * ProjectList is a singleton pattern of all projects stored on Database
 */
class ProjectList {
    constructor() {
        this.updateWait = false;
        this.callbackFunctions = [() => { this.updateWait = false; }];
        this._projects = [];
    }
    get keys() {
        return Tag_1.TagList.getInstance().projects;
    }
    get project() {
        let projects = [];
        this.keys.forEach(key => {
            projects.push(this._projects[key]);
        });
        return projects;
    }
    /**
     * getInstance method returns an instance of ProjectList singleton
     * @param {() => void} listener: function that is called after database information is retrieved
     * @returns reference to ProjectList
     */
    static getInstance(listener = () => { }) {
        if (!ProjectList.instance) {
            ProjectList.instance = new ProjectList();
            ProjectList.instance.update(listener);
        }
        return ProjectList.instance;
    }
    /**
     * updateCallbackFunctions method adds a listener to the end of callback function stack
     * @param {() => void} listener
     */
    updateCallbackFunctions(listener) {
        this.callbackFunctions.push(listener);
    }
    /**
     * runCallbacks method calls and pops every closure stored in callbackFunctions
     */
    runCallbacks() {
        let i1 = 0;
        while (0 < this.callbackFunctions.length) {
            let callback = this.callbackFunctions.pop();
            if (callback != undefined) {
                callback();
            }
        }
        this.callbackFunctions = [() => { this.updateWait = false; }];
    }
    /**
     * update method gets list of Skill and organizational tags from database
     * @param {() => void} listener: function that is called after database information is retrieved
     */
    update(listener) {
        Tag_1.TagList.getInstance()
            .update(() => {
            this.updateCallbackFunctions(listener);
            if (!this.updateWait) {
                $.ajax({
                    type: "POST",
                    url: "get_data",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(["projects"])
                }).done((dataRaw) => {
                    if (dataRaw.length != 1) {
                        throw Error("Expect one value");
                    }
                    let projectJson = JSON.parse(dataRaw[0])["data"];
                    let tags = Tag_1.TagList.getInstance().tags;
                    for (let i = 0; i < projectJson.length; i++) {
                        let tmp = projectJson[i];
                        if (tmp["Update"] == "null") {
                            let date = new Date();
                            let day = date.getDate();
                            let month = date.getMonth() + 1;
                            let year = date.getFullYear();
                            tmp["Update"] = year + "-" + month + "-" + day;
                        }
                        ProjectList.getInstance()
                            .updateProject(tags.findIndex((tag) => {
                            return tag.id == tmp["Tag"];
                        }), new Date(tmp["Start"]), new Date(tmp["Update"]), tmp["Description"], tmp["link"]);
                    }
                    this.runCallbacks();
                });
                this.updateWait = true;
            }
        });
    }
    updateProject(primaryTag, start, update, desc, link) {
        this._projects[primaryTag] = new Project(primaryTag, start, update, desc, link);
    }
}
exports.ProjectList = ProjectList;

},{"./Tag":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagList = exports.Tag = void 0;
/**
 * Tag is class that stores the values related to Tag tags
 */
class Tag {
    /**
     * constructor for Tag
     * @param {number} id: integer representation of id of object
     * @param {string} colour: hexadecimal representation of tag
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
 * Tag List is a singleton pattern of all Tags stored on Database
 */
class TagList {
    /**
     * private constructor creates instance of TagList
     */
    constructor() {
        /**
         * {[key: number]: Tag } tags_: Dictionary of all tags id -> Tag
         */
        this.tags_ = {};
        this.keys = [];
        this.connections_ = [];
        this.lastUpdate = Date.now();
        this.updateWait = false;
        this.callbackFunctions = [() => { this.updateWait = false; }];
        this.tags_ = {};
        this.connections_ = [];
    }
    /**
     * tags getter returns array of tags
     */
    get tags() {
        let tags = [];
        for (let i = 0; i < this.keys.length; i++) {
            tags.push(this.tags_[this.keys[i]]);
        }
        return tags;
    }
    /**
     * skills getter returns array of the index of all skill
     */
    get skills() {
        let indexes = [];
        this.tags.forEach((tag, index) => {
            if (tag.tagType == 0) {
                indexes.push(index);
            }
        });
        return indexes;
    }
    /**
     * projects getter returns array of the index of all project tags
     */
    get projects() {
        let indexes = [];
        this.tags.forEach((tag, index) => {
            if (tag.tagType == 1) {
                indexes.push(index);
            }
        });
        return indexes;
    }
    /**
     * connections getter returns a 2d array of the connections between tags. let a connection be represented as connections[x][y]; then connections[x] is the list of all the connections that start from tags[x] and connections[x][y] is end point connection tags[y] (tags[x] -> tags[y])
     */
    get connections() {
        let map = {};
        //map tag id -> tag index in tags array
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
     * getInstance method returns an instance of TagList singleton
     * @param {() => void} listener: function that is called after database information is retrieved
     * @returns reference to TagList
     */
    static getInstance(listener = () => { }) {
        if (!TagList.instance) {
            TagList.instance = new TagList();
            TagList.instance.update(listener);
        }
        return TagList.instance;
    }
    /**
     * getById method gets tag from
     * @param id
     * @returns
     */
    getById(id) {
        return this.tags_[id];
    }
    /**
     * updateCallbackFunctions method adds a listener to the end of callback function stack
     * @param {() => void} listener
     */
    updateCallbackFunctions(listener) {
        this.callbackFunctions.push(listener);
    }
    /**
     * runCallbacks method calls and pops every closure stored in callbackFunctions
     */
    runCallbacks() {
        let i1 = 0;
        while (0 < this.callbackFunctions.length) {
            let callback = this.callbackFunctions.pop();
            if (callback != undefined) {
                callback();
            }
        }
        this.callbackFunctions = [() => { this.updateWait = false; }];
    }
    /**
     * update method gets list of Tag and organizational tags from database
     * @param {() => void} listener: function that is called after database information is retrieved
     */
    update(listener) {
        this.updateCallbackFunctions(listener);
        if (!this.updateWait) {
            $.ajax({
                type: "POST",
                url: "get_data",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(["tag", "related"])
            }).done((dataRaw) => {
                if (dataRaw.length != 2) {
                    throw Error("Expect one value");
                }
                let tagJson = JSON.parse(dataRaw[0])["data"];
                let connectionsJson = JSON.parse(dataRaw[1])["data"];
                for (let i = 0; i < tagJson.length; i++) {
                    TagList.getInstance().updateTag(tagJson[i]["id"], tagJson[i]["colour"], tagJson[i]["symbol"], tagJson[i]["tag_type"]);
                }
                for (let i = 0; i < connectionsJson.length; i++) {
                    TagList.getInstance().updateConnection(connectionsJson[i]["tag_1"], connectionsJson[i]["tag_2"]);
                }
                this.runCallbacks();
            });
            this.updateWait = true;
        }
    }
    /**
     * updateTag method update tag with specific id
     * @param {number} id: id of tag tag that will be updated
     * @param {string} colour
     * @param {string} symbol
     * @param {number} tagType
     */
    updateTag(id, colour, symbol, tagType) {
        if (!this.tags_.hasOwnProperty(id)) {
            this.keys.push(id);
            this.keys = this.keys.sort((a, b) => { return a - b; });
        }
        this.tags_[id] = new Tag(id, colour, symbol, tagType);
    }
    /**
     * updateConnection connection between two tag tags
     * @param id1
     * @param id2
     */
    updateConnection(id1, id2) {
        if (!this.tags_.hasOwnProperty(id1) || !this.tags_.hasOwnProperty(id2)) {
            return;
        }
        //sort connections
        //check if id1, id2 exist
        this.connections_.push([id1, id2]);
    }
    /**
     * resets a tags and connections relationship
     */
    reset() {
        this.tags_ = {};
        this.connections_ = [];
    }
}
exports.TagList = TagList;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = void 0;
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const SearchBar_1 = require("./SearchBar");
const SortBy_1 = require("./SortBy");
const TagGenerator_1 = require("./TagGenerator");
/**
 * generateProjects method generates HTML for a set of input projects
 * @param {Project[]} projects
 */
function generateProjects(projects) {
    let target = $("#portfolio #results");
    let projectTags = {};
    let tags = Tag_1.TagList.getInstance().tags;
    let projectsHTML = new HTMLBuilder_1.HTMLElem("");
    Tag_1.TagList.getInstance().connections
        .filter((conn) => {
        return (tags[conn[0]].tagType == 1 || tags[conn[1]].tagType == 1) && //check if one tags is project
            tags[conn[0]].tagType != tags[conn[1]].tagType; //check if both aren't tags aren't project
    })
        .forEach((conn) => {
        let projectId;
        let tagIndex;
        if (tags[conn[0]].tagType == 1) {
            projectId = Tag_1.TagList.getInstance().tags[conn[0]].id;
            tagIndex = conn[1];
        }
        else { // implied: tags[conn[1]].tagType == 1
            projectId = Tag_1.TagList.getInstance().tags[conn[1]].id;
            tagIndex = conn[0];
        }
        if (!projectTags.hasOwnProperty(projectId)) {
            projectTags[projectId] = new Set();
        }
        projectTags[projectId].add(Tag_1.TagList.getInstance().tags[tagIndex]);
    });
    //Create html element for each project
    projects.forEach(project => {
        let projectElem = new HTMLBuilder_1.HTMLElem("div");
        let start = new HTMLBuilder_1.HTMLElem("div");
        start.get("id").push(new HTMLBuilder_1.AttrVal("start"));
        start.addChild(new HTMLBuilder_1.HTMLText(`${project.start}`));
        let update = new HTMLBuilder_1.HTMLElem("div");
        update.get("id").push(new HTMLBuilder_1.AttrVal("update"));
        update.addChild(new HTMLBuilder_1.HTMLText(`${project.update}`));
        let desc = new HTMLBuilder_1.HTMLElem("div");
        desc.get("id").push(new HTMLBuilder_1.AttrVal("desc"));
        desc.addChild(new HTMLBuilder_1.HTMLText(project.description));
        let readMore = new HTMLBuilder_1.HTMLElem("a");
        readMore.get("href").push(new HTMLBuilder_1.AttrVal(`\\${project.name.split(" ").join("_")}`));
        readMore.addChild(new HTMLBuilder_1.HTMLText("read more"));
        desc.addChild(readMore);
        let name = new HTMLBuilder_1.HTMLElem("a");
        name.get("id").push(new HTMLBuilder_1.AttrVal("name"));
        name.get("href").push(new HTMLBuilder_1.AttrVal(`\\${project.name.split(" ").join("_")}`));
        name.addChild(new HTMLBuilder_1.HTMLText(project.name));
        let tags = new HTMLBuilder_1.HTMLElem("div");
        tags.get("id").push(new HTMLBuilder_1.AttrVal("tags"));
        if (projectTags.hasOwnProperty(project.tag.id)) {
            projectTags[project.tag.id].forEach(projectTag => {
                tags.addChild((0, TagGenerator_1.getTagHTML)(projectTag.symbol, projectTag.colour, projectTag.id.toString()));
            });
        }
        projectElem.addChild(start)
            .addChild(update)
            .addChild(desc)
            .addChild(name)
            .addChild(tags);
        projectsHTML.addChild(projectElem);
    });
    target.html(projectsHTML.generateChildren());
    Tag_1.TagList.getInstance().tags
        .forEach(tag => {
        $(`#portfolio #results #${tag.id}.tag`).on("click", () => {
            (0, SearchBar_1.setSearch)([tag.symbol]);
            $("#portfolio #search")[0].scrollIntoView();
        });
    });
}
/**
 * updateProject method updates portfolio project list
 */
function updateProject() {
    generateProjects((0, SortBy_1.sort)((0, SearchBar_1.getProjects)()));
}
exports.updateProject = updateProject;

},{"../DataBaseHandler/Tag":3,"../HTMLBuilder/HTMLBuilder":4,"./SearchBar":8,"./SortBy":9,"./TagGenerator":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const Project_1 = require("../DataBaseHandler/Project");
const ProjectListGenerator_1 = require("./ProjectListGenerator");
const SearchBar_1 = require("./SearchBar");
const SortBy_1 = require("./SortBy");
/**
 * main function initializes search bar & the list of portfolio projects
 */
function main() {
    Project_1.ProjectList.getInstance()
        .update(() => {
        (0, ProjectListGenerator_1.updateProject)();
    });
    (0, SearchBar_1.main)();
    (0, SortBy_1.main)();
}
exports.main = main;

},{"../DataBaseHandler/Project":2,"./ProjectListGenerator":6,"./SearchBar":8,"./SortBy":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.getProjects = exports.setSearch = void 0;
const Project_1 = require("../DataBaseHandler/Project");
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const ProjectListGenerator_1 = require("./ProjectListGenerator");
const TagGenerator_1 = require("./TagGenerator");
let search = $("#portfolio #search input");
let tagFilters = new Set();
let nameFilters = new Set();
let deleteStack = [];
/**
 * setSearch function adds filters to search
 * @param {string[]} filters array of strings that will be added to filter array
 */
function setSearch(filters) {
    //remove all filters
    reset();
    //add filters
    filters.forEach(filter => {
        addFilter(filter);
    });
    (0, ProjectListGenerator_1.updateProject)();
}
exports.setSearch = setSearch;
/**
 * reset function removes all filters
 */
function reset() {
    deleteStack.forEach(del => {
        deletePrevTag();
    });
    search.val("");
}
/**
 * getSearchVal function gets text input value from search bar
 * @returns {string} text input value from search bar
 */
function getSearchVal() {
    let tmp = search.val();
    if (tmp == null) {
        return "";
    }
    return tmp.toString();
}
/**
 * getProjects function gets a array of projects that fulfills name, description and tag filters
 * @returns {Project[]} Array project that passes filter tests
 */
function getProjects() {
    let tags = Tag_1.TagList.getInstance().tags;
    return Project_1.ProjectList.getInstance().project
        .filter((proj) => {
        let linkedTags = Tag_1.TagList.getInstance().connections
            .filter(conn => {
            return tags[conn[0]].id == proj.tag.id ||
                tags[conn[1]].id == proj.tag.id;
        })
            .map(conn => {
            if (tags[conn[0]].tagType == 1) {
                return tags[conn[1]];
            }
            return tags[conn[0]].id;
        })
            .filter((val, ind, arr) => {
            return arr.indexOf(val) === ind;
        });
        return Array.from(tagFilters)
            .map(id => {
            return Tag_1.TagList.getInstance().getById(id);
        })
            .filter(tag => {
            return tag != null;
        })
            .every((tag) => {
            if (tag == null) {
                return true;
            }
            return linkedTags.indexOf(tag) > -1;
        });
    })
        .filter((proj) => {
        let filters = Array.from(nameFilters).map(val => val.toLowerCase());
        filters.push(getSearchVal().toLowerCase());
        return filters
            .every(name => {
            return proj.tag.symbol.toLowerCase().includes(name);
        }) ||
            filters
                .every(name => {
                return proj.description.toLowerCase().includes(name);
            });
    });
}
exports.getProjects = getProjects;
/**
 * updateSuggestions function updates suggestion box based on current incomplete search value data
 */
function updateSuggestions() {
    let searchVal = getSearchVal();
    let suggestionArea = $("#portfolio #search .suggestions");
    if (searchVal.length == 0) {
        suggestionArea.css("display", "none");
    }
    else {
        suggestionArea.css("display", "block");
    }
    let suggestionsHTML = new HTMLBuilder_1.HTMLElem("div");
    let commonSubString = new HTMLBuilder_1.HTMLElem("b");
    commonSubString.addChild(new HTMLBuilder_1.HTMLText(searchVal.toUpperCase()));
    let tags = Tag_1.TagList.getInstance().tags.filter((tag) => {
        if (searchVal.length == 0 || searchVal.length > tag.symbol.length) {
            return false;
        }
        return searchVal.toLowerCase() == tag.symbol.substring(0, searchVal.length).toLowerCase();
    })
        .sort((a, b) => {
        return a.symbol.length - b.symbol.length;
    });
    if (tags.length == 0) {
        suggestionArea.css("display", "none");
    }
    tags.forEach((tag) => {
        let suggestionHTML = new HTMLBuilder_1.HTMLElem("div");
        suggestionHTML.get("id").push(new HTMLBuilder_1.AttrVal(`${tag.id}`));
        suggestionHTML.addChild(commonSubString);
        suggestionHTML.addChild(new HTMLBuilder_1.HTMLText(tag.symbol.substring(searchVal.length)));
        suggestionsHTML.addChild(suggestionHTML);
    });
    suggestionArea.html(suggestionsHTML.generateChildren());
    tags.forEach((tag) => {
        $(`#portfolio #search .suggestions #${tag.id}`).on("click", () => {
            onSuggestionClick(tag.symbol);
            (0, ProjectListGenerator_1.updateProject)();
        });
    });
}
/**
 * onSuggestionClick function adds filter based on selected suggestion
 * @param {string} filterStr filter search string
 */
function onSuggestionClick(filterStr) {
    addFilter(filterStr);
    search.val("");
    updateSuggestions();
}
/**
 * addFilter function adds filter string into an array of filters
 * @param {String} filterStr filter search string
 */
function addFilter(filterStr) {
    //find all tags that match filter string
    let tags = Tag_1.TagList.getInstance().tags
        .filter((tag) => {
        return tag.tagType != 1;
    })
        .filter((tag) => {
        return tag.symbol.toLowerCase() === filterStr.toLowerCase();
    });
    //if not tags match filter then add name/desc filter
    if (tags.length === 0) {
        addNameFilter(filterStr);
        return;
    }
    //add first matching tag filter
    addTagFilter(tags[0]);
}
/**
 * addTagFilter function adds tag as filter
 * @param {Tag} tag
 */
function addTagFilter(tag) {
    if (!tagFilters.has(tag.id)) {
        tagFilters.add(tag.id);
        addTagToSearch(tag.symbol, tag.colour);
        deleteStack.push(() => {
            tagFilters.delete(tag.id);
        });
    }
}
/**
 * addNameFilter function adds string as name/description filter
 * @param {string} name
 */
function addNameFilter(name) {
    if (!nameFilters.has(name)) {
        nameFilters.add(name);
        addTagToSearch(name, "FFFFFF");
        deleteStack.push(() => {
            nameFilters.delete(name);
        });
    }
}
/**
 * addTagToSearch function adds active filter to search bar
 * @param {string} content
 * @param {string} colour
 */
function addTagToSearch(content, colour) {
    $("#portfolio #search .searchBox").before((0, TagGenerator_1.getTagHTML)(content, colour).generate());
}
/**
 * deletePrevTag function deletes the last filter that was added
 */
function deletePrevTag() {
    $("#portfolio #search .searchBox").prev().remove();
    //get last filter
    let deleteClosure = deleteStack.pop();
    if (deleteClosure != null) {
        deleteClosure();
    }
}
/**
 * main function handles the initialization and update of searchbar
 */
function main() {
    search.on("input", updateSuggestions);
    search.on("keydown", (e) => {
        let tmpSearch = getSearchVal();
        if (e.key == "Enter") { //add new tag
            addFilter(tmpSearch);
            search.val("");
            updateSuggestions();
        }
        else if (e.key == "Backspace" && tmpSearch.length === 0) { //remove last tag
            deletePrevTag();
        }
        //temporarily add current search value to name filter
        let tmpAdd = nameFilters.has(tmpSearch);
        if (!tmpAdd) {
            nameFilters.add(tmpSearch);
        }
        (0, ProjectListGenerator_1.updateProject)();
        if (!tmpAdd) {
            nameFilters.delete(tmpSearch);
        }
    });
}
exports.main = main;

},{"../DataBaseHandler/Project":2,"../DataBaseHandler/Tag":3,"../HTMLBuilder/HTMLBuilder":4,"./ProjectListGenerator":6,"./TagGenerator":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.sort = void 0;
const ProjectListGenerator_1 = require("./ProjectListGenerator");
let selected = 0;
let sortAlgorithms = [
    //sort by name
    (projects) => {
        return projects.sort((proj1, proj2) => {
            return proj1.name < proj2.name ? -1 : 1;
        });
    },
    //sort by start date
    (projects) => {
        return projects.sort((proj1, proj2) => {
            return proj2.startUnix - proj1.startUnix;
        });
    },
    //sort by last update date
    (projects) => {
        return projects.sort((proj1, proj2) => {
            return proj2.updateUnix - proj1.updateUnix;
        });
    }
];
/**
 * getVal function retrieves name of sortBy function
 * @returns
 */
function getVal() {
    let tmp = $("#portfolio #columns select.sortBy").val();
    if (tmp == null) {
        return "";
    }
    return tmp.toString();
}
/**
 * select functions updates project order based on selected sortby function string
 * @param {string} selectedCategory
 */
function select(selectedCategory) {
    switch (selectedCategory) {
        case "name":
            selected = 0;
            break;
        case "start":
            selected = 1;
            break;
        case "update":
            selected = 2;
            break;
    }
    $("#portfolio #columns .selected").removeClass("selected");
    $(`#portfolio #columns >#${selectedCategory}`).addClass("selected");
    $("#portfolio #columns select.sortBy").val(selectedCategory);
    (0, ProjectListGenerator_1.updateProject)();
}
/**
 * sort functions sorts an array of projects based on selected sort algorithm
 * @param {Project[]} projects
 * @returns {Project[]} array of sorted projects
 */
function sort(projects) {
    return sortAlgorithms[selected](projects);
}
exports.sort = sort;
/**
 * main function initializes project order
 */
function main() {
    select("name");
    $("#portfolio #columns #name").on("click", () => { select("name"); });
    $("#portfolio #columns #start").on("click", () => { select("start"); });
    $("#portfolio #columns #update").on("click", () => { select("update"); });
    $("#portfolio #columns select.sortBy").on("change", () => { select(getVal()); });
}
exports.main = main;

},{"./ProjectListGenerator":6}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagHTML = void 0;
const Colour_1 = require("../Colour/Colour");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
/**
 * getTagHTML function generates html tag element for project tags list & tag search filter list
 * @param {string} content
 * @param {string} colour
 * @param {string} tagId
 * @returns {HTMLElem} HTML element object of tag
 */
function getTagHTML(content, colour, tagId = undefined) {
    let htmlElem = new HTMLBuilder_1.HTMLElem("div");
    let col = `#${colour}`;
    let bgCol = (0, Colour_1.rgba)((0, Colour_1.hexToRgb)(col), 0.75);
    htmlElem.get("style").push(new HTMLBuilder_1.StyleAttr("border-color", col));
    htmlElem.get("style").push(new HTMLBuilder_1.StyleAttr("background-color", `rgb(${bgCol.r},${bgCol.g},${bgCol.b})`));
    htmlElem.get("class").push(new HTMLBuilder_1.AttrVal("tag"));
    if (tagId != null) {
        htmlElem.get("id").push(new HTMLBuilder_1.AttrVal(tagId));
    }
    htmlElem.addChild(new HTMLBuilder_1.HTMLText(content));
    return htmlElem;
}
exports.getTagHTML = getTagHTML;

},{"../Colour/Colour":1,"../HTMLBuilder/HTMLBuilder":4}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const Colour_1 = require("../Colour/Colour");
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const SearchBar_1 = require("../ProjectSearch/SearchBar");
const Vector_1 = require("../Math/Vector");
let tiles = [];
let tableDim = new Vector_1.Vector(0, 0);
let selected = -1;
const ALL = "All";
/**
 * getTile method returns Tile in grid
 * @param {Number} x x position on grid
 * @param {Number} y y position on grid
 * @param {Vector} dim width and height of 2d grid
 * @param {T[]} grid array of tiles in grid
 * @param {T} nullVal default null tile value
 * @returns {T} Tile at (x,y) in grid
 */
function getTile(x, y, dim, grid, nullVal) {
    if (x < 0 || dim.x <= x) {
        return nullVal;
    }
    if (y < 0 || dim.y <= y) {
        return nullVal;
    }
    return grid[x + y * dim.x];
}
/**
 * prepareTiles method generates HTML for all skill tiles
 */
function prepareTiles() {
    var _a;
    //get all tags
    let tags = Tag_1.TagList.getInstance()
        .tags
        .filter((tag) => {
        return tag.tagType === 0;
    });
    let target = $("#skills > div").first();
    let skillsHTML = new HTMLBuilder_1.HTMLElem("div");
    tableDim.x = Math.floor(((_a = target.width()) !== null && _a !== void 0 ? _a : 0) / 100);
    tableDim.y = tags.length / tableDim.x;
    if (tableDim.y % 1 != 0) {
        tableDim.y = Math.ceil(tableDim.y);
    }
    tiles = new Array(tableDim.x * tableDim.y).fill(-1);
    tags = Tag_1.TagList.getInstance().tags;
    let i2 = 0;
    //turn all tags => html tiles
    for (let i1 = 0; i1 < tags.length; i1++) {
        if (tags[i1].tagType === 0) {
            tiles[i2++] = i1;
            let skill = tags[i1];
            let elem = new HTMLBuilder_1.HTMLElem("div");
            elem.get("id").push(new HTMLBuilder_1.AttrVal(toId(skill.symbol)));
            elem.get("class").push(new HTMLBuilder_1.AttrVal("skill"));
            let img = new HTMLBuilder_1.HTMLElem("img");
            img.endTag = false;
            img.get("src").push(new HTMLBuilder_1.AttrVal(`src\\media\\img\\icons\\${skill.symbol.replace("#", "Sharp")}_icon.svg`));
            img.get("alt").push(new HTMLBuilder_1.AttrVal(`${skill.symbol} icon`));
            let text = new HTMLBuilder_1.HTMLElem("div");
            text.addChild(new HTMLBuilder_1.HTMLText(`${skill.symbol}`));
            elem.addChild(img);
            elem.addChild(text);
            skillsHTML.addChild(elem);
        }
    }
    //filling array with empty tiles
    for (i2++; i2 <= tiles.length; i2++) {
        let elem = new HTMLBuilder_1.HTMLElem("div");
        elem.get("class").push(new HTMLBuilder_1.AttrVal("skill"));
        skillsHTML.addChild(elem);
    }
    target.html(skillsHTML.generateChildren());
    //added functionality to all tags
    for (let i1 = 0; i1 < tags.length; i1++) {
        if (tags[i1].tagType === 0) {
            let tag = tags[i1];
            $(`#skills div #${toId(tag.symbol)}.skill`).on("click", () => {
                (0, SearchBar_1.setSearch)([tag.symbol]);
                $("#portfolio")[0].scrollIntoView();
            });
        }
    }
}
/**
 * updateBorder is a utility method that updates the borders of selected tile
 * @param id
 * @param width
 * @param edge
 */
function updateBorder(id, width, edge) {
    let edgeMap = { 0: "bottom", 1: "right", 2: "top", 3: "left" };
    $(`#${id}`).css(`border-${edgeMap[edge]}-width`, `${width}px`);
}
/**
 * previewTiles method updates of all tiles that need preview border
 * @param {Number[]} selectedTiles Array of all tiles that need a preview border
 */
function previewTiles(selectedTiles) {
    let tags = Tag_1.TagList.getInstance().tags;
    let targetTiles = new Array(tiles.length);
    for (let i1 = 0; i1 < tiles.length; i1++) {
        targetTiles[i1] = selectedTiles.lastIndexOf(tiles[i1]) != -1;
    }
    for (let x = 0; x < tableDim.x; x++) {
        for (let y = 0; y < tableDim.y; y++) {
            let tag = tags[getTile(x, y, tableDim, tiles, -1)];
            let currentTile = getTile(x, y, tableDim, targetTiles, false);
            if (tag == undefined) {
                continue;
            }
            //update border to 0 
            if (!currentTile) {
                for (let i = 0; i < 4; i++) {
                    updateBorder(toId(tag.symbol), 0, i);
                }
                continue;
            }
            //update borders
            //left border
            if (!getTile(x - 1, y, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 3);
            }
            else {
                updateBorder(toId(tag.symbol), 0, 3);
            }
            //right border
            if (!getTile(x + 1, y, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 1);
            }
            else {
                updateBorder(toId(tag.symbol), 0, 1);
            }
            //top border
            if (!getTile(x, y - 1, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 2);
            }
            else {
                updateBorder(toId(tag.symbol), 0, 2);
            }
            //bottom
            if (!getTile(x, y + 1, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 0);
            }
            else {
                updateBorder(toId(tag.symbol), 0, 0);
            }
        }
    }
}
/**
 * toId is a utility method that converts a tag name into an id
 * @param {string} str
 * @returns {string} id of str
 */
function toId(str) {
    return str.replace(" ", "-")
        .replace("#", "Sharp");
}
/**
 * createOrganizationButton method creates html for organizational buttons that reside underneath skill tables
 */
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
    htmlBuilder.addChild(createVal(ALL, "FFF"));
    let tagList = Tag_1.TagList.getInstance();
    let tags = tagList.tags;
    let connections = tagList.connections
        .filter((conn) => {
        return (tags[conn[0]].tagType == 2) != (tags[conn[1]].tagType == 2) &&
            (tags[conn[0]].tagType != 1 && tags[conn[1]].tagType != 1);
    });
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
        else if (tag2.tagType == 2) {
            tmp = tag2;
            catagoriesTmp[conn[1]] = true;
        }
        else {
            continue;
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
            selectOrganizationalGroup(i1);
        });
        $(id).on("mouseenter", () => {
            let tagList = Tag_1.TagList.getInstance();
            let connection = tagList.connections;
            let tags = tagList.tags;
            let idToIndexMap = {};
            for (let i1 = 0; i1 < tags.length; i1++) {
                idToIndexMap[tags[i1].id] = i1;
            }
            let targetTiles = [];
            tags
                .filter((tag) => {
                return tag.tagType === 0 &&
                    connection.some((conn) => {
                        return (conn[0] == i1 && conn[1] == idToIndexMap[tag.id]) ||
                            (conn[0] == idToIndexMap[tag.id] && conn[1] == i1);
                    });
            })
                .forEach((tag) => {
                targetTiles.push(idToIndexMap[tag.id]);
            });
            previewTiles(targetTiles);
        });
        $(id).on("mouseleave", () => {
            let tagList = Tag_1.TagList.getInstance();
            let connection = tagList.connections;
            let tags = tagList.tags;
            let idToIndexMap = {};
            for (let i1 = 0; i1 < tags.length; i1++) {
                idToIndexMap[tags[i1].id] = i1;
            }
            let targetTiles = [];
            tags
                .filter((tag) => {
                return tag.tagType === 0 &&
                    connection.some((conn) => {
                        return (conn[0] == selected && conn[1] == idToIndexMap[tag.id]) ||
                            (conn[0] == idToIndexMap[tag.id] && conn[1] == selected);
                    });
            })
                .forEach((tag) => {
                targetTiles.push(idToIndexMap[tag.id]);
            });
            previewTiles(targetTiles);
        });
        $(id).css("border-color", tags[i1].colour);
    }
    $(`#skills > nav > #${ALL}`).on("click", () => {
        selectOrganizationalGroup(-1);
    });
    $(`#skills > nav > #${ALL}`).on("mouseenter", () => {
        let tagList = Tag_1.TagList.getInstance();
        let connection = tagList.connections;
        let tags = tagList.tags;
        let idToIndexMap = {};
        for (let i1 = 0; i1 < tags.length; i1++) {
            idToIndexMap[tags[i1].id] = i1;
        }
        let targetTiles = [];
        tags
            .forEach((tag) => {
            targetTiles.push(idToIndexMap[tag.id]);
        });
        previewTiles(targetTiles);
    });
    $(`#skills > nav > #${ALL}`).on("mouseleave", () => {
        let tagList = Tag_1.TagList.getInstance();
        let connection = tagList.connections;
        let tags = tagList.tags;
        let idToIndexMap = {};
        for (let i1 = 0; i1 < tags.length; i1++) {
            idToIndexMap[tags[i1].id] = i1;
        }
        let targetTiles = [];
        tags
            .filter((tag) => {
            return tag.tagType === 0 &&
                connection.some((conn) => {
                    return (conn[0] == selected && conn[1] == idToIndexMap[tag.id]) ||
                        (conn[0] == idToIndexMap[tag.id] && conn[1] == selected);
                });
        })
            .forEach((tag) => {
            targetTiles.push(idToIndexMap[tag.id]);
        });
        previewTiles(targetTiles);
    });
}
/**
 * select method handles the preview of organizational groups
 * @param {number} organizationalGroupIndex
 */
function selectOrganizationalGroup(organizationalGroupIndex) {
    selected = organizationalGroupIndex;
    $("#skills > nav .selected").removeClass("selected");
    let tags = Tag_1.TagList.getInstance().tags;
    let connections = Tag_1.TagList.getInstance().connections;
    let col;
    let timeStamp = new Date().getTime();
    //select all
    if (organizationalGroupIndex === -1) {
        $(`#skills > nav > #${ALL}`).addClass("selected");
        col = { r: 0, g: 17, b: 28 };
        setTimeout(() => {
            $("#skills > div .skill").removeClass("selected");
            connections.forEach((conn) => {
                $(`#skills > div #${toId(tags[conn[0]].symbol)}`).addClass("selected");
                $(`#skills > div #${toId(tags[conn[1]].symbol)}`).addClass("selected");
            });
        }, 500);
    }
    //select catagories
    else {
        $("#skills > div .skill").removeClass("selected");
        let id = `#skills > nav > #${toId(tags[organizationalGroupIndex].symbol)}`;
        col = (0, Colour_1.rgba)((0, Colour_1.hexToRgb)(`#${tags[organizationalGroupIndex].colour}`), 0.75);
        $(id).addClass("selected");
        connections
            .filter((conn) => {
            return conn[0] == organizationalGroupIndex || conn[1] == organizationalGroupIndex;
        })
            .forEach((conn) => {
            let id;
            if (conn[0] != organizationalGroupIndex) {
                id = conn[0];
            }
            else {
                id = conn[1];
            }
            $(`#skills > div #${toId(tags[id].symbol)}`).addClass("selected");
        });
    }
    let newBg = new HTMLBuilder_1.HTMLElem("div");
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
/**
 * main method handles the initialization of skill tables
 */
function main() {
    $(window).on('resize', () => {
        //createSkills();
        prepareTiles();
        createOrganizationButton();
        selectOrganizationalGroup(-1);
    });
    Tag_1.TagList.getInstance()
        .update(() => {
        //createSkills();
        prepareTiles();
        createOrganizationButton();
        selectOrganizationalGroup(-1);
    });
}
exports.main = main;

},{"../Colour/Colour":1,"../DataBaseHandler/Tag":3,"../HTMLBuilder/HTMLBuilder":4,"../Math/Vector":5,"../ProjectSearch/SearchBar":8}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectSearch_1 = require("./ProjectSearch/ProjectSearch");
const SkillTable_1 = require("./SkillTable/SkillTable");
(0, SkillTable_1.main)();
(0, ProjectSearch_1.main)();

},{"./ProjectSearch/ProjectSearch":7,"./SkillTable/SkillTable":11}]},{},[12]);
