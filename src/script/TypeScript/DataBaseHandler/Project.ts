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
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(this._start);
    }
    public get startUnix() : number {
        return this._start.getTime();
    }

    private _update : Date;

    public get update() : string {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(this._update);
    }
    public get updateUnix() : number {
        return this._update.getTime();
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

    private _updating: boolean = false;
    public get updating(): boolean {
        return this._updating;
    }
    private set updating(val: boolean) {
        this._updating = val;
    }

    private dataCache : String| undefined = undefined;
    private tagCheck:boolean = false;

    private callbackFunctions: (()=> void)[] = [() => {this.updating = false}];

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
     * updateCallbackFunctions method adds a listener to the end of callback function stack
     * @param {() => void} listener
     */
    private updateCallbackFunctions(listener: () => void) {
        this.callbackFunctions.push(listener)
    }

    /**
     * runCallbacks method calls and pops every closure stored in callbackFunctions
     */
    private runCallbacks() {
        let i1 = 0;
        while (0 < this.callbackFunctions.length) {
            let callback = this.callbackFunctions.pop();

            if (callback != undefined) {
                callback();
            }
        }
        this.callbackFunctions = [() => {this.updating = false}];
    }


    /**
     * update method gets list of Skill and organizational tags from database
     * @param {() => void} listener: function that is called after database information is retrieved
     */
    public update(listener: () => void) {

        this.updateCallbackFunctions(listener);
        if (!this.updating) {
            this.tagCheck = false;
            
            TagList.getInstance()
                .update(
                    () => {
                        this.tagCheck = true;
                        
                        if (this.tagCheck && this.dataCache != undefined) {
                            this.updateProjectList(this.dataCache);
                        }
                    }
                )

            $.ajax({
                type: "POST",
                url: "get_data",
                headers: {
                    'Content-Type': 'application/json'
                },
                data : JSON.stringify(["projects"])
            }).done((dataRaw) => {
                if (dataRaw.length != 1) {
                    throw Error("Expect one value")
                }

                this.dataCache=dataRaw;

                if (this.tagCheck && this.dataCache != undefined) {
                    this.updateProjectList(this.dataCache);
                }
            }).fail(
                () => {
                    setTimeout(
                        () => {
                            this.updating = false;

                            ProjectList.getInstance()
                                .update(()=>{})
                        },
                        1000
                    );  
                }
            );
                
            this.updating = true;
        }
    }

    private updateProjectList(dataRaw: String) {
        let projectJson = JSON.parse(dataRaw[0])["data"];
        let tags = TagList.getInstance().tags;

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
                .updateProject(
                    tags.findIndex(
                        (tag: Tag) => {
                            return tag.id == tmp["Tag"];
                        }
                    ),
                    new Date(tmp["Start"]),
                    new Date(tmp["Update"]),
                    tmp["Description"],
                    tmp["link"]
                );
        }
        this.runCallbacks();

        this.dataCache = undefined;
        this.updating = false;
    }

    public updateProject(primaryTag : number, start : Date, update : Date, desc : string, link : string) {
        this._projects[primaryTag] = new Project(primaryTag, start, update, desc, link);
    }
}