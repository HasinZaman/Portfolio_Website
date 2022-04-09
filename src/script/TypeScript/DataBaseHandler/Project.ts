/**
 * Project class stores the values related to a project
 */
export class Project{
    private _id : number;
    private _primaryTag : number;
    private _start : {year: number, month : number};
    private _update : {year: number, month : number};
    private _desc : string;
    private _link : string;

    /**
     * Constructor creates Project
     * @param id 
     * @param primaryTag 
     * @param start 
     * @param update 
     * @param desc 
     * @param link 
     */
    constructor (id : number, primaryTag : number, start : {year: number, month : number}, update : {year: number, month : number}, desc : string, link : string) {
        this._id = id;
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
        
        this._projects = [
            new Project(0, 1, {year: 2014, month: 2}, {year: 2020, month: 2}, "short description", "https://google.com"),
            new Project(1, 5, {year: 2018, month: 10}, {year: 2022, month: 11}, "short description #2", "https://google.com")
        ];

        listener();
    }
}