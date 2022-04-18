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

    private _projects : {[key:number] : Project};

    private get keys() : number[] {
        return TagList.getInstance().projects;
    }

    public get project() : Project[]{
        let projects : Project[] = [];

        this.keys.forEach(key => {
            projects.push(this._projects[key])
        })
        return projects;
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
        TagList.getInstance()
        .update( () => {
            $.ajax({
                type: "POST",
                url: "get_data",
                headers: {
                    'Content-Type': 'application/json'
                },
                data : JSON.stringify(["project"])
            }).done(function( dataRaw ) {
                if (dataRaw.length != 1) {
                    throw Error("Expect one value")
                }
                let projectJson = JSON.parse(dataRaw[0])["data"];
                let tags = TagList.getInstance().tags;
                for (let i = 0; i < projectJson.length; i++) {
                    let tmp = projectJson[i];

                    ProjectList.getInstance()
                        .updateProject(
                            tags.findIndex(
                                (tag : Tag) => {
                                    return tag.id == tmp["Tag"]
                                }
                            ),
                            new Date(tmp["Start"][0], tmp["Start"][1]),
                            new Date(tmp["Update"][0], tmp["Update"][1]),
                            tmp["Description"],
                            tmp["link"]
                        );
                }
                listener();
            })
        })
    }

    public updateProject(primaryTag : number, start : Date, update : Date, desc : string, link : string) {
        this._projects[primaryTag] = new Project(primaryTag, start, update, desc, link);
    }
}