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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.generateProjects = void 0;
const Project_1 = require("../DataBaseHandler/Project");
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const SearchBar_1 = require("./SearchBar");
const TagGenerator_1 = require("./TagGenerator");
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
exports.generateProjects = generateProjects;
function main() {
    Project_1.ProjectList.getInstance()
        .update(() => {
        generateProjects(Project_1.ProjectList.getInstance().project);
    });
    (0, SearchBar_1.main)();
}
exports.main = main;

},{"../DataBaseHandler/Project":2,"../DataBaseHandler/Tag":3,"../HTMLBuilder/HTMLBuilder":4,"./SearchBar":6,"./TagGenerator":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.setSearch = void 0;
const Project_1 = require("../DataBaseHandler/Project");
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const ProjectSearch_1 = require("./ProjectSearch");
const TagGenerator_1 = require("./TagGenerator");
let search = $("#portfolio #search input");
let tagFilters = new Set();
let nameFilters = new Set();
let deleteStack = [];
function setSearch(filters) {
    reset();
    filters.forEach(filter => {
        addFilter(filter);
    });
    (0, ProjectSearch_1.generateProjects)(getProjects());
}
exports.setSearch = setSearch;
function reset() {
    deleteStack.forEach(del => {
        deletePrevTag();
    });
    search.val("");
}
function getSearchVal() {
    let tmp = search.val();
    if (tmp == null) {
        return "";
    }
    return tmp.toString();
}
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
            (0, ProjectSearch_1.generateProjects)(getProjects());
        });
    });
}
function onSuggestionClick(filterStr) {
    addFilter(filterStr);
    search.val("");
    updateSuggestions();
}
function addFilter(filterStr) {
    let tags = Tag_1.TagList.getInstance().tags
        .filter((tag) => {
        return tag.tagType != 1;
    })
        .filter((tag) => {
        return tag.symbol.toLowerCase() === filterStr.toLowerCase();
    });
    if (tags.length === 0) {
        addNameFilter(filterStr);
        return;
    }
    addTagFilter(tags[0]);
}
function addTagFilter(tag) {
    if (!tagFilters.has(tag.id)) {
        tagFilters.add(tag.id);
        addTagToSearch(tag.symbol, tag.colour);
        deleteStack.push(() => {
            tagFilters.delete(tag.id);
        });
    }
}
function addNameFilter(name) {
    if (!nameFilters.has(name)) {
        nameFilters.add(name);
        addTagToSearch(name, "FFFFFF");
        deleteStack.push(() => {
            nameFilters.delete(name);
        });
    }
}
function addTagToSearch(content, colour) {
    $("#portfolio #search .searchBox").before((0, TagGenerator_1.getTagHTML)(content, colour).generate());
}
function deletePrevTag() {
    $("#portfolio #search .searchBox").prev().remove();
    let deleteClosure = deleteStack.pop();
    if (deleteClosure != null) {
        deleteClosure();
    }
}
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
        (0, ProjectSearch_1.generateProjects)(getProjects());
        if (!tmpAdd) {
            nameFilters.delete(tmpSearch);
        }
    });
}
exports.main = main;

},{"../DataBaseHandler/Project":2,"../DataBaseHandler/Tag":3,"../HTMLBuilder/HTMLBuilder":4,"./ProjectSearch":5,"./TagGenerator":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagHTML = void 0;
const Colour_1 = require("../Colour/Colour");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
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

},{"../Colour/Colour":1,"../HTMLBuilder/HTMLBuilder":4}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const Colour_1 = require("../Colour/Colour");
const Tag_1 = require("../DataBaseHandler/Tag");
const HTMLBuilder_1 = require("../HTMLBuilder/HTMLBuilder");
const SearchBar_1 = require("../ProjectSearch/SearchBar");
const Vector_1 = require("../SkillBalls/Vector");
let tiles = [];
let tableDim = new Vector_1.Vector(0, 0);
let selected = -1;
function getTile(x, y, dim, grid, nullVal) {
    if (x < 0 || dim.x <= x) {
        return nullVal;
    }
    if (y < 0 || dim.y <= y) {
        return nullVal;
    }
    return grid[x + y * dim.x];
}
function prepareTiles() {
    var _a;
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
    for (let i1 = 0; i1 < tags.length; i1++) {
        if (tags[i1].tagType === 0) {
            tiles[i2++] = i1;
            let skill = tags[i1];
            let elem = new HTMLBuilder_1.HTMLElem("div");
            elem.get("id").push(new HTMLBuilder_1.AttrVal(toId(skill.symbol)));
            elem.get("class").push(new HTMLBuilder_1.AttrVal("skill"));
            let img = new HTMLBuilder_1.HTMLElem("img");
            img.get("src").push(new HTMLBuilder_1.AttrVal(`src\\media\\img\\icons\\${skill.symbol.replace("#", "Sharp")}_icon.svg`));
            img.get("alt").push(new HTMLBuilder_1.AttrVal(`${skill.symbol} icon`));
            let text = new HTMLBuilder_1.HTMLElem("div");
            text.addChild(new HTMLBuilder_1.HTMLText(`${skill.symbol}`));
            elem.addChild(img);
            elem.addChild(text);
            skillsHTML.addChild(elem);
        }
    }
    for (i2++; i2 <= tiles.length; i2++) {
        let elem = new HTMLBuilder_1.HTMLElem("div");
        elem.get("class").push(new HTMLBuilder_1.AttrVal("skill"));
        skillsHTML.addChild(elem);
    }
    target.html(skillsHTML.generateChildren());
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
function updateBorder(id, width, edge) {
    let edgeMap = { 0: "bottom", 1: "right", 2: "top", 3: "left" };
    $(`#${id}`).css(`border-${edgeMap[edge]}-width`, `${width}px`);
}
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
            if (!currentTile) {
                for (let i = 0; i < 4; i++) {
                    updateBorder(toId(tag.symbol), 0, i);
                }
                continue;
            }
            if (tag == undefined) {
                continue;
            }
            //left
            if (!getTile(x - 1, y, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 3);
            }
            else {
                updateBorder(toId(tag.symbol), 0, 3);
            }
            //right
            if (!getTile(x + 1, y, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 1);
            }
            else {
                updateBorder(toId(tag.symbol), 0, 1);
            }
            //top
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
function toId(str) {
    return str.replace(" ", "-")
        .replace("#", "Sharp");
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
            select(i1);
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
    $(`#skills > nav > #all`).on("click", () => {
        select(-1);
    });
    $(`#skills > nav > #all`).on("mouseenter", () => {
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
    $(`#skills > nav > #all`).on("mouseleave", () => {
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
function select(idIndex) {
    selected = idIndex;
    $("#skills > nav .selected").removeClass("selected");
    let tags = Tag_1.TagList.getInstance().tags;
    let connections = Tag_1.TagList.getInstance().connections;
    let col;
    let timeStamp = new Date().getTime();
    //select all
    if (idIndex === -1) {
        $(`#skills > nav > #all`).addClass("selected");
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
        let id = `#skills > nav > #${toId(tags[idIndex].symbol)}`;
        col = (0, Colour_1.rgba)((0, Colour_1.hexToRgb)(`#${tags[idIndex].colour}`), 0.75);
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
function main() {
    $(window).on('resize', () => {
        //createSkills();
        prepareTiles();
        createOrganizationButton();
        select(-1);
    });
    Tag_1.TagList.getInstance()
        .update(() => {
        //createSkills();
        prepareTiles();
        createOrganizationButton();
        select(-1);
    });
}
exports.main = main;

},{"../Colour/Colour":1,"../DataBaseHandler/Tag":3,"../HTMLBuilder/HTMLBuilder":4,"../ProjectSearch/SearchBar":6,"../SkillBalls/Vector":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectSearch_1 = require("./ProjectSearch/ProjectSearch");
const SkillTable_1 = require("./SkillTable/SkillTable");
(0, SkillTable_1.main)();
(0, ProjectSearch_1.main)();

},{"./ProjectSearch/ProjectSearch":5,"./SkillTable/SkillTable":9}]},{},[10]);