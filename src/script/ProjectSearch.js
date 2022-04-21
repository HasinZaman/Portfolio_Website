(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    get update() {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(this._update);
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
        this._projects = [];
    }
    get keys() {
        return Tag_1.TagList.getInstance().projects;
    }
    get project() {
        let projects = [];
        console.log(this.keys);
        this.keys.forEach(key => {
            projects.push(this._projects[key]);
        });
        console.log(projects);
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
     * update method gets list of Skill and organizational tags from database
     * @param {() => void} listener: function that is called after database information is retrieved
     */
    update(listener) {
        Tag_1.TagList.getInstance()
            .update(() => {
            $.ajax({
                type: "POST",
                url: "get_data",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(["project"])
            }).done(function (dataRaw) {
                if (dataRaw.length != 1) {
                    throw Error("Expect one value");
                }
                let projectJson = JSON.parse(dataRaw[0])["data"];
                let tags = Tag_1.TagList.getInstance().tags;
                for (let i = 0; i < projectJson.length; i++) {
                    let tmp = projectJson[i];
                    ProjectList.getInstance()
                        .updateProject(tags.findIndex((tag) => {
                        return tag.id == tmp["Tag"];
                    }), new Date(tmp["Start"][0], tmp["Start"][1]), new Date(tmp["Update"][0], tmp["Update"][1]), tmp["Description"], tmp["link"]);
                }
                listener();
            });
        });
    }
    updateProject(primaryTag, start, update, desc, link) {
        this._projects[primaryTag] = new Project(primaryTag, start, update, desc, link);
    }
}
exports.ProjectList = ProjectList;

},{"./Tag":2}],2:[function(require,module,exports){
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
     * update method gets list of Tag and organizational tags from database
     * @param {() => void} listener: function that is called after database information is retrieved
     */
    update(listener) {
        $.ajax({
            type: "POST",
            url: "get_data",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(["tag", "related"])
        }).done(function (dataRaw) {
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
            listener();
        });
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("../DataBaseHandler/Project");
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const SearchBar_1 = require("./SearchBar");
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
        let name = new HTMLBuilder_1.HTMLElem("a");
        name.get("id").push(new HTMLBuilder_1.AttrVal("name"));
        name.get("href").push(new HTMLBuilder_1.AttrVal(project.link));
        name.addChild(new HTMLBuilder_1.HTMLText(project.name));
        let tags = new HTMLBuilder_1.HTMLElem("div");
        tags.get("id").push(new HTMLBuilder_1.AttrVal("tags"));
        if (projectTags.hasOwnProperty(project.tag.id)) {
            projectTags[project.tag.id].forEach(projectTag => {
                let tag = new HTMLBuilder_1.HTMLElem("div");
                tag.get("class").push(new HTMLBuilder_1.AttrVal("tag"));
                tag.addChild(new HTMLBuilder_1.HTMLText(projectTag.symbol));
                tags.addChild(tag);
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
}
Project_1.ProjectList.getInstance()
    .update(() => {
    generateProjects(Project_1.ProjectList.getInstance().project);
});
(0, SearchBar_1.main)();

},{"../DataBaseHandler/Project":1,"../DataBaseHandler/Tag":2,"../HTMLBuilder/HTMLBuilder":3,"./SearchBar":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
let search = $("#portfolio #search input");
function getSearchVal() {
    let tmp = search.val();
    if (tmp == null) {
        return "";
    }
    return tmp.toString();
}
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
            console.log(`${tag.symbol}`);
        });
    });
}
function addFilter(filterStr) {
    throw new Error("addFilter method not implemented");
}
function addTagFilter(tagId) {
    throw new Error("addTagFilter method not implemented");
}
function addNameFilter(name) {
    throw new Error("addNameFilter method not implemented");
}
function deletePrevTag() {
}
function main() {
    search.on("input", updateSuggestions);
    search.on("keydown", (e) => {
        console.log(e.key);
        if (e.key == "Enter") {
            addFilter(getSearchVal());
        }
        else if (e.key == "Backspace") {
            if (getSearchVal().length === 0) {
                deletePrevTag();
            }
        }
    });
}
exports.main = main;

},{"../DataBaseHandler/Tag":2,"../HTMLBuilder/HTMLBuilder":3}]},{},[4]);
