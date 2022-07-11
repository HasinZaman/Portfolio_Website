import { hexToRgb, rgba } from "../Colour/Colour";
import { AttrVal, HTMLElem, HTMLText, StyleAttr } from "../HTMLBuilder/HTMLBuilder";

/**
 * getTagHTML function generates html tag element for project tags list & tag search filter list
 * @param {string} content 
 * @param {string} colour 
 * @param {string} tagId 
 * @returns {HTMLElem} HTML element object of tag
 */
export function getTagHTML(content : string, colour : string, tagId : string | undefined | null = undefined) : HTMLElem {
    let htmlElem : HTMLElem = new HTMLElem("div")

    let col = `#${colour}`
    let bgCol = rgba(hexToRgb(col), 0.75);

    htmlElem.get("style").push(new StyleAttr("border-color", col));
    htmlElem.get("style").push(new StyleAttr("background-color", `rgb(${bgCol.r},${bgCol.g},${bgCol.b})`));
    htmlElem.get("class").push(new AttrVal("tag"));

    if(tagId != null) {
        htmlElem.get("id").push(new AttrVal(tagId));
    }

    htmlElem.addChild(new HTMLText(content));

    return htmlElem;
}