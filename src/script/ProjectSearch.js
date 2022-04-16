(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectList = exports.Project = void 0;
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
    constructor(id, primaryTag, start, update, desc, link) {
        this._id = id;
        this._primaryTag = primaryTag;
        this._start = start;
        this._update = update;
        this._desc = desc;
        this._link = link;
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
    get project() {
        return this._projects;
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
        this._projects = [
            new Project(0, 1, { year: 2014, month: 2 }, { year: 2020, month: 2 }, "short description", "https://google.com"),
            new Project(1, 5, { year: 2018, month: 10 }, { year: 2022, month: 11 }, "short description #2", "https://google.com")
        ];
        listener();
    }
}
exports.ProjectList = ProjectList;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("../DataBaseHandler/Project");
Project_1.ProjectList.getInstance()
    .update(() => {
    console.log(Project_1.ProjectList.getInstance().project);
});

},{"../DataBaseHandler/Project":1}]},{},[2]);
