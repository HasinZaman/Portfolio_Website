/**
 * AttrVal class defines AttrVal for KeyValuePair
 */
export class AttrVal{
    value : string;

    /**
     * @constructor creates an instance of AttrVal
     * @param {string} value
     */
    constructor(value : string) {
        this.value = value;
    }

    /**
     * generate method returns string representation of AttrVal
     * @returns {string} string format of AttrVal
     */
    public generate() : string {
        return this.value;
    }
}

/**
 * StyleAttr class defines attributes of element styles
 */
export class StyleAttr {
    key : string;
    value : string;

    /**
     * @constructor creates instance of StyleAttr
     * @param {string} key: style name
     * @param {string} value: style value
     */
    constructor(key : string, value : string) {
        this.key = key;
        this.value = value;
    }

    /**
     * generate method returns string representation of AttrVal
     * @returns {string} string format of AttrVal
     */
    public generate() : string
    {
        return `${this.key}:${this.value};`;
    }
    
}

/**
 * HTMLElem class define variables and methods required to create HTML DOM elements
 */
export class HTMLElem{

    private tagname : string;
    private attr : Map<String, AttrVal[]> = new Map<String, AttrVal[]>()
    private children : HTMLElem[];
    public endTag : boolean = true;

    /**
     * @constructor creates a new instance of HTMLElem
     * @param {string} tagname: tagname of HTML element
     */
    constructor(tagname : string) {
        this.tagname = tagname;

        this.attr.set("id", []);
        this.attr.set("class", []);

        this.children = [];
    }

    /**
     * get return a array of references to values
     * @param {string} key: name of attr
     * @returns {AttrVal[]} array of AttrVal
     */
    public get(key : string) : AttrVal[] {
        if(!this.attr.has(key)) {
            this.attr.set(key, [])
        }

        let data : AttrVal[] | undefined = this.attr.get(key);

        if(data !== undefined) {
            return data;
        }
        throw new Error("Invalid state");
    }

    /**
     * addChild adds an HTML child Element
     * @param {HTMLElem} child 
     */
    public addChild(child : HTMLElem) : HTMLElem {
        this.children.push(child);

        return this;
    }


    /**
     * generate method returns string representation of HTMLElem
     * @returns {string} string format of HTMLElem
     */
    public generate() : string
    {
        let attrStr : string = "";

        this.attr.forEach((values: AttrVal[], key: String) => attrStr += `${this.attrGenerate(key, values)} `);

        if(this.endTag) {
            return `<${this.tagname} ${attrStr}>${this.generateChildren()}</${this.tagname}>`;
        }

        return `<${this.tagname} ${attrStr}>`;
    }

    /**
     * attrGenerate method generates string that represent an attribute of an HTML element
     * @returns {string} string format of an attribute of an HTML element
     */
    public attrGenerate(key: String, values: AttrVal[]) : string {
        let valueStr : string = "";

        if(values.length === 0) {
            return "";
        }
        for(let i1 = 0; i1 < values.length; i1++)
        {
            valueStr+=values[i1].generate();
        }
        return `${key}=\"${valueStr}\" `
    }

    /**
     * generateChildren method returns string representation of child content of HTMLElem
     * @returns {string} string format of child HTMLElem
     */
    public generateChildren() : string {
        let childrenStr : string = "";

        for(let i1 : number = 0; i1 < this.children.length; i1++)
        {
            childrenStr += `${this.children[i1].generate()}\n`;
        }

        return `${childrenStr}`;
    }
}

/**
 * HTMLText class defines HTML text element and method to create text content in HTMLElem
 */
export class HTMLText extends HTMLElem {
    public text : string;

    /**
     * @constructor creates a new instance of HTMLText
     * @param {string} text
     */
     constructor(text : string){
        super("");

        this.text = text;
    }

    /**
     * get does nothing
     * @param {string} key: name of attr
     * @returns {AttrVal[]} empty array
     */
    public get(key : string) : AttrVal[]
    {
        throw new Error("Invalid get call")
    }

     /**
      * addChild does nothing
      * @param {HTMLElem} child 
      */
    public addChild(child : HTMLElem) : HTMLElem {
        throw new Error("Invalid addChild call")
    }


    /**
     * generate method returns string representation of HTMLText
     * @returns {string} string format of HTMLText
     */
     public generate() : string
     {
        return this.text;
     }

}