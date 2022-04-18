/**
 * Tag is class that stores the values related to Tag tags
 */
export class Tag{
    private id_: number = 0;
    private colour_: string = "";
    private symbol_: string = "";
    private tagType_: number = 0;
    
    public get id() {
        return this.id_;
    }
    
    public get colour() {
        return this.colour_;
    }

    public set colour(value: string) {
        let valueTmp = value.replace(/^\#+/g, '');

        if (valueTmp.length != 6) {
            return;
        }

        let validCheck = valueTmp.split("")
            .every(
                (char) => {
                    return "0123456789abcdef".indexOf(char.toLocaleLowerCase()) != -1
                }
            )

        if (validCheck){
            this.colour_ = valueTmp;
        }
        
        
    }

    public get symbol() {
        return this.symbol_;
    }

    public get tagType() {
        return this.tagType_;
    }

    /**
     * constructor for Tag 
     * @param {number} id: integer representation of id of object
     * @param {string} colour: hexadecimal representation of tag
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
 * Tag List is a singleton pattern of all Tags stored on Database
 */
export class TagList{
    private static instance : TagList;

    /**
     * {[key: number]: Tag } tags_: Dictionary of all tags id -> Tag
     */
    private tags_ : { [key: number]: Tag } = {};
    private keys : number[] = [];
    private connections_ : number[][] = [];

    /**
     * tags getter returns array of tags 
     */
    public get tags() : Tag[] {
        let tags: Tag[] = [];
        
        for(let i = 0; i < this.keys.length; i++){
            tags.push(this.tags_[this.keys[i]])
        }

        return tags;
    }

    /**
     * skills getter returns array of the index of all skill
     */
    public get skills() : number[] {
        let indexes : number[] = [];

        this.tags.forEach(
            (tag, index) => {
                if(tag.tagType == 0) {
                    indexes.push(index);
                }
            }
        )

        return indexes;
    }

    /**
     * projects getter returns array of the index of all project tags
     */
    public get projects() : number[] {
        let indexes : number[] = [];

        this.tags.forEach(
            (tag, index) => {
                if(tag.tagType == 1) {
                    indexes.push(index);
                }
            }
        )

        return indexes;
    }

    /**
     * connections getter returns a 2d array of the connections between tags. let a connection be represented as connections[x][y]; then connections[x] is the list of all the connections that start from tags[x] and connections[x][y] is end point connection tags[y] (tags[x] -> tags[y])
     */
    get connections() : number[][] {
        let map : { [key: number]: number } = {};

        //map tag id -> tag index in tags array
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
     * private constructor creates instance of TagList
     */
    private constructor() {
        this.tags_ = {}
        this.connections_ = []
    }

    /**
     * getInstance method returns an instance of TagList singleton
     * @param {() => void} listener: function that is called after database information is retrieved
     * @returns reference to TagList
     */
    public static getInstance(listener: () => void = () => {}) : TagList {
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
    public getById(id: number) : Tag | undefined {
        return this.tags_[id];
    }

    /**
     * update method gets list of Tag and organizational tags from database
     * @param {() => void} listener: function that is called after database information is retrieved
     */
    public update(listener: () => void) {
        $.ajax({
            type: "POST",
            url: "get_data",
            headers: {
                'Content-Type': 'application/json'
            },
            data : JSON.stringify(["tag", "related"])
        }).done(function( dataRaw ) {
            if (dataRaw.length != 2) {
                throw Error("Expect one value")
            }
            let tagJson = JSON.parse(dataRaw[0])["data"];
            let connectionsJson = JSON.parse(dataRaw[1])["data"];

            for (let i = 0; i < tagJson.length; i++) {
                TagList.getInstance().updateTag(tagJson[i]["id"], tagJson[i]["colour"], tagJson[i]["symbol"], tagJson[i]["tag_type"]);
            }

            for (let i = 0; i < connectionsJson.length; i++) {
                TagList.getInstance().updateConnection(connectionsJson[i]["tag_1"], connectionsJson[i]["tag_2"])
            }
            listener();
        })
    }

    /**
     * updateTag method update tag with specific id
     * @param {number} id: id of tag tag that will be updated
     * @param {string} colour 
     * @param {string} symbol 
     * @param {number} tagType 
     */
    public updateTag(id: number, colour: string, symbol: string, tagType: number) {
        if (!this.tags_.hasOwnProperty(id)){
            this.keys.push(id);
            this.keys = this.keys.sort((a, b) => {return a - b;});
        }
        this.tags_[id] = new Tag(id, colour, symbol, tagType);
        
    }

    /**
     * updateConnection connection between two tag tags
     * @param id1 
     * @param id2
     */
    public updateConnection(id1: number, id2: number) {
        if (!this.tags_.hasOwnProperty(id1) || !this.tags_.hasOwnProperty(id2)){
            return;
        }

        //sort connections
        //check if id1, id2 exist

        this.connections_.push([id1, id2])
    }

    /**
     * resets a tags and connections relationship
     */
    public reset() {
        this.tags_ = {}
        this.connections_ = []
    }
}