/**
 * KeyValuePair defines variables and methods for html element attr
*/
class KeyValuePair {
    key : string;
    values : AttrVal[];

    /**
     * @constructor creates a KeyValuePair
     * @param {string} key: key name
     * @param {AttrVal[]} values: array of attribute values for key
     */
    constructor(key : string, values : AttrVal[]) {
        this.key = key;
        this.values = [];

        for(let i1 = 0; i1 < values.length; i1++)
        {
            this.values.push(values[i1]);
        }
    }

    /**
     * generate method turns KeyValuePair into string attr for HTML elements
     * @returns {string} string format of KeyValuePair for HTML elements
     */
    public generate() : string {
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
    private attr : KeyValuePair[];
    private children : HTMLElem[];

    /**
     * @constructor creates a new instance of HTMLElem
     * @param {string} tagname: tagname of HTML element
     */
    constructor(tagname : string){
        this.tagname = tagname;
        this.attr = [new KeyValuePair("id", []), new KeyValuePair("class", [])];
        this.children = [];
    }

    /**
     * get return a array of references to values
     * @param {string} key: name of attr
     * @returns {AttrVal[]} array of AttrVal
     */
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

    /**
     * addChild adds an HTML child Element
     * @param {HTMLElem} child 
     */
    public addChild(child : HTMLElem) {
        this.children.push(child);
    }


    /**
     * generate method returns string representation of HTMLElem
     * @returns {string} string format of HTMLElem
     */
    public generate() : string
    {
        let attrStr : string = "";

        for(let i1 : number = 0; i1 < this.attr.length; i1++)
        {
            attrStr += `${this.attr[i1].generate()} `;
        }

        return `<${this.tagname} ${attrStr}>${this.generateChildren()}</${this.tagname}>`;
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
    public addChild(child : HTMLElem) {
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