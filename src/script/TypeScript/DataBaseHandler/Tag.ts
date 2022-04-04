/**
 * Skill is class that stores the values related to Skill tags
 */
export class Tag{
    private id_: number = 0;
    private colour_: string = "";
    private symbol_: string = "";
    private tagType_: number = 0;
    
    get id() {
        return this.id_;
    }
    
    get colour() {
        return this.colour_;
    }

    set colour(value: string) {
        if (value.length != 6) {
            return;
        }

        let chars = value.split("");
        
        for(let i = 0; i < chars.length; i++) {
            if ("0123456789abcdef".indexOf(chars[i].toLowerCase()) == -1) {
                return;
            }
        }

        this.colour_ = value;
    }

    get symbol() {
        return this.symbol_;
    }

    get tagType() {
        return this.tagType_;
    }

    /**
     * constructor for Skill 
     * @param {number} id: integer representation of id of object
     * @param {string} colour: hexadecimal representation of skill
     * @param {string} symbol: name of symbol string 
     * @param {number} tagType: tagType represents type of tag
     */
    constructor(id: number, colour: string, symbol: string, tagType: number){
        this.id_ = id;
        this.colour = colour;
        this.symbol_ = symbol;
        this.tagType_ = tagType;
    }
}

/**
 * Skill List is a singleton pattern of all Skills stored on Database
 */
export class TagList{
    private static instance : TagList;

    /**
     * {[key: number]: Tag } skills_: Dictionary of all skills id -> Tag
     */
    private skills_ : { [key: number]: Tag } = {};
    private keys : number[] = [];
    private connections_ : number[][] = [];

    /**
     * skills getter returns array of tags 
     */
    get skills() : Tag[] {
        let skills: Tag[] = [];
        
        for(let i = 0; i < this.keys.length; i++){
            skills.push(this.skills_[this.keys[i]])
        }

        return skills;
    }

    /**
     * connections getter returns a 2d array of the connections between tags. let a connection be represented as connections[x][y]; then connections[x] is the list of all the connections that start from skills[x] and connections[x][y] is end point connection skills[y] (skills[x] -> skills[y])
     */
    get connections() : number[][] {
        let map : { [key: number]: number } = {};

        //map tag id -> tag index in skills array
        for (let i = 0; i < this.keys.length; i++) {
            map[this.keys[i]] = i;
        }

        let connectionsTmp : number[][] = [];
        for (let i = 0; i < this.connections_.length; i++){
            let edge:number[] = this.connections_[i];
            connectionsTmp.push([map[edge[0]],map[edge[1]]]);
        }
        return connectionsTmp;
    }

    /**
     * private constructor creates instance of SkillList
     */
    private constructor() {
        this.skills_ = {}
        this.connections_ = []
    }

    /**
     * getInstance method returns an instance of SkillList singleton
     * @param {() => void} listener: function that is called after database information is retrieved
     * @returns reference to SkillList
     */
    public static getInstance(listener: () => void = () => {}) : TagList {
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
    public update(listener: () => void) {
        $.ajax({
            type: "POST",
            url: "get_data",
            headers: {
                'Content-Type': 'application/json'
            },
            data : JSON.stringify(["skill", "related"])
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
            console.log(TagList.instance.connections_);
            console.log(TagList.instance.skills_);
            console.log(TagList.instance.keys);
            listener();
        })
    }

    /**
     * updateSkill method update skill with specific id
     * @param {number} id: id of skill tag that will be updated
     * @param {string} colour 
     * @param {string} symbol 
     * @param {number} tagType 
     */
    public updateSkill(id: number, colour: string, symbol: string, tagType: number) {
        if (!this.skills_.hasOwnProperty(id)){
            this.keys.push(id);
            this.keys = this.keys.sort((a, b) => {return a - b;});
        }
        this.skills_[id] = new Tag(id, colour, symbol, tagType);
        
    }

    /**
     * updateConnection connection between two skill tags
     * @param id1 
     * @param id2
     */
    public updateConnection(id1: number, id2: number) {
        if (!this.skills_.hasOwnProperty(id1) || !this.skills_.hasOwnProperty(id2)){
            return;
        }

        //sort connections
        //check if id1, id2 exist

        this.connections_.push([id1, id2])
    }

    /**
     * resets a skills and connections relationship
     */
    public reset() {
        this.skills_ = {}
        this.connections_ = []
    }
}