/**
 * Skill is class that stores the values related to
 */
export class Skill{
    private id_: number;
    private colour_: string;
    private symbol_: string;
    private tagType_: number;

    get id() {
        return this.id_;
    }

    get colour() {
        return this.colour_;
    }

    get symbol() {
        return this.symbol_;
    }

    get tagType() {
        return this.tagType_;
    }

    constructor(id: number, colour: string, symbol: string, tagType: number){
        this.id_ = id;
        this.colour_ = colour;
        this.symbol_ = symbol;
        this.tagType_ = tagType;
    }
}

export class SkillList{
    private static instance : SkillList;


    private skills_ : { [key: number]: Skill } = {};
    private keys : number[] = [];
    private connections_ : number[][] = [];


    get skills() : Skill[] {
        let skills: Skill[] = [];
        
        for(let i = 0; i < this.keys.length; i++){
            skills.push(this.skills_[this.keys[i]])
        }

        return skills;
    }

    get connections() : number[][] {
        let map : { [key: number]: number } = {};

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


    private constructor() {
        this.skills_ = {}
        this.connections_ = []
    }

    public static getInstance(listener: () => void = () => {}) : SkillList {
        if (!SkillList.instance) {
            SkillList.instance = new SkillList();
            SkillList.instance.update(listener);
        }
        return SkillList.instance;
    }

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
                SkillList.getInstance().updateSkill(skillJson[i]["id"], skillJson[i]["colour"], skillJson[i]["symbol"], skillJson[i]["tag_type"]);
            }

            for (let i = 0; i < connectionsJson.length; i++) {
                SkillList.getInstance().updateConnection(connectionsJson[i]["tag_1"], connectionsJson[i]["tag_2"])
            }
            console.log(SkillList.instance.connections_);
            console.log(SkillList.instance.skills_);
            console.log(SkillList.instance.keys);
            listener();
        })
    }

    public updateSkill(id: number, colour: string, symbol: string, tagType: number) {
        if (!this.skills_.hasOwnProperty(id)){
            this.keys.push(id);
            this.keys = this.keys.sort((a, b) => {return a - b;});
        }
        this.skills_[id] = new Skill(id, colour, symbol, tagType);
        
    }

    public updateConnection(id1: number, id2: number) {
        if (!this.skills_.hasOwnProperty(id1) || !this.skills_.hasOwnProperty(id2)){
            return;
        }

        //sort connections
        //check if id1, id2 exist

        this.connections_.push([id1, id2])
    }

    public restart() {
        this.skills_ = {}
        this.connections_ = []
    }
}