"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLElem = exports.StyleAttr = exports.AttrVal = void 0;
class KeyValuePair {
    constructor(key, values) {
        this.key = key;
        this.values = [];
        for (let i1 = 0; i1 < values.length; i1++) {
            this.values.push(values[i1]);
        }
    }
    generate() {
        let valueStr = "";
        if (this.values.length === 0) {
            return "";
        }
        for (let i1 = 0; i1 < this.values.length; i1++) {
            valueStr += this.values[i1].generate();
        }
        return `${this.key}=\"${valueStr}\" `;
    }
}
class AttrVal {
    constructor(value) {
        this.value = value;
    }
    generate() {
        return this.value;
    }
}
exports.AttrVal = AttrVal;
class StyleAttr {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    generate() {
        return `${this.key}:${this.value};`;
    }
}
exports.StyleAttr = StyleAttr;
class HTMLElem {
    constructor(type) {
        this.type = type;
        this.attr = [new KeyValuePair("id", []), new KeyValuePair("class", [])];
        this.children = [];
    }
    get(key) {
        let tmp = this.attr.find(kvp => kvp.key === key);
        if (tmp == null) {
            tmp = new KeyValuePair(key, []);
            this.attr.push(tmp);
        }
        return tmp.values;
    }
    addChild(child) {
        this.children.push(child);
    }
    generate() {
        let childrentStr = "";
        let attrStr = "";
        for (let i1 = 0; i1 < this.children.length; i1++) {
            childrentStr += `${this.children[i1].generate()}\n`;
        }
        for (let i1 = 0; i1 < this.attr.length; i1++) {
            attrStr += `${this.attr[i1].generate()} `;
        }
        return `<${this.type} ${attrStr}>${childrentStr}</${this.type}>`;
    }
}
exports.HTMLElem = HTMLElem;
//# sourceMappingURL=HTMLBuilder.js.map