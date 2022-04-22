import { hexToRgb, rgba } from "../Colour/Colour";
import { AttrVal, HTMLElem, HTMLText, StyleAttr } from "../HTMLBuilder/HTMLBuilder";

export function getTagHTML(content : string, colour : string) : HTMLElem {
    let htmlElem : HTMLElem = new HTMLElem("div")

    let col = `#${colour}`
    let bgCol = rgba(hexToRgb(col), 0.75);

    htmlElem.get("style").push(new StyleAttr("border-color", col));
    htmlElem.get("style").push(new StyleAttr("background-color", `rgb(${bgCol.r},${bgCol.g},${bgCol.b})`));
    htmlElem.get("class").push(new AttrVal("tag"))
    htmlElem.addChild(new HTMLText(content));

    return htmlElem;
}