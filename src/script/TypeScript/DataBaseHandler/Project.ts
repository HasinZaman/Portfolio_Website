import { Tag, TagList } from "./Tag";

/**
 * Project class stores the values related to a project
 */
export class Project{
    private _primaryTag : number;

    public get name() : string {
        return this.tag.symbol;
    }

    public get colour() : string {
        return this.tag.colour;
    }

    public get tag() : Tag {
        return TagList.getInstance().tags[this._primaryTag];
    }

    private _start : Date;

    public get start() : string {

        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(this._start);
    }

    private _update : Date;

    public get update() : string {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(this._update);
    }

    private _desc : string;

    public get description() : string {
        return this._desc;
    }

    private _link : string;

    public get link() : string {
        return this._link;
    }

    /**
     * Constructor creates Project
     * @param id 
     * @param primaryTag 
     * @param start 
     * @param update 
     * @param desc 
     * @param link 
     */
    constructor (primaryTag : number, start : Date, update : Date, desc : string, link : string) {
        this._primaryTag = primaryTag;
        this._start = start;
        this._update = update;
        this._desc = desc;
        this._link = link;
    }
}

/**
 * ProjectList is a singleton pattern of all projects stored on Database
 */
export class ProjectList {
    private static instance : ProjectList;

    private _projects : Project[];

    public get project() : Project[]{
        return this._projects;
    }

    private constructor() {
        this._projects = [];
    }

    /**
     * getInstance method returns an instance of ProjectList singleton
     * @param {() => void} listener: function that is called after database information is retrieved
     * @returns reference to ProjectList
     */
    public static getInstance(listener: () => void = () => {}) : ProjectList {
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
    public update(listener: () => void) {
        
        /*
        $.ajax({
            type: "POST",
            url: "get_data",
            headers: {
                'Content-Type': 'application/json'
            },
            data : JSON.stringify(["project"])
        }).done(function( dataRaw ) {
            if (dataRaw.length != 2) {
                throw Error("Expect one value")
            }
            let skillJson = JSON.parse(dataRaw[0])["data"];
            let connectionsJson = JSON.parse(dataRaw[1])["data"];

            for (let i = 0; i < skillJson.length; i++) {
                TagList.getInstance().updateSkill(skillJson[i]["id"], skillJson[i]["colour"], skillJson[i]["symbol"], skillJson[i]["tag_type"]);
            }

            for (let i = 0; i < connectionsJson.length; i++) {
                TagList.getInstance().updateConnection(connectionsJson[i]["tag_1"], connectionsJson[i]["tag_2"])
            }
            listener();
        })
        */

        TagList.getInstance().update(() => {
            this._projects = [
                new Project(1, new Date(2014, 2), new Date(2020, 2), "short description", "https://google.com"),
                new Project(2, new Date(2018, 10), new Date(2022, 11), "short description #2", "https://google.com")
            ];
    
            listener();
        })
    }
}