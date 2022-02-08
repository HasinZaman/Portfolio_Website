
class KeyValuePair {
    key : string;
    values : AttrVal[];

    constructor(key : string, values : AttrVal[]) {
        this.key = key;
        this.values = [];

        for(let i1 = 0; i1 < values.length; i1++)
        {
            this.values.push(values[i1]);
        }
    }

    public generate() : string
    {
        let valueStr : string = "";
        if(this.values.length === 0) {
            return "";
        }
        for(let i1 = 0; i1 < this.values.length; i1++)
        {
            valueStr+=this.values[i1].generate();
        }
        return `${this.key}=\"${valueStr}\" `
    }
}

export class AttrVal{
    value : string;

    constructor(value : string)
    {
        this.value = value;
    }

    public generate() : string
    {
        return this.value;
    }
}

export class StyleAttr{
    key : string;
    value : string;
    constructor(key : string, value : string)
    {
        this.key = key;
        this.value = value;
    }

    public generate() : string
    {
        return `${this.key}:${this.value};`;
    }
    
}

export class HTMLElem{

    private type : string;
    private attr : KeyValuePair[];
    private children : HTMLElem[];

    constructor(type : string){
        this.type = type;
        this.attr = [new KeyValuePair("id", []), new KeyValuePair("class", [])];
        this.children = [];
    }

    public get(key : string) : AttrVal[]
    {
        let tmp = this.attr.find(kvp => kvp.key === key);

        if(tmp == null)
        {
            tmp = new KeyValuePair(key, []);
            this.attr.push(tmp);
        }

        return tmp.values;
    }

    public addChild(child : HTMLElem) {
        this.children.push(child);
    }

    public generate() : string
    {
        let childrentStr : string = "";
        let attrStr : string = "";

        for(let i1 : number = 0; i1 < this.children.length; i1++)
        {
            childrentStr += `${this.children[i1].generate()}\n`;
        }

        for(let i1 : number = 0; i1 < this.attr.length; i1++)
        {
            attrStr += `${this.attr[i1].generate()} `;
        }

        return `<${this.type} ${attrStr}>${childrentStr}</${this.type}>`;
    }
}