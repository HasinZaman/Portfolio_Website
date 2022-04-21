import { Tag, TagList } from "../DataBaseHandler/Tag";
import { AttrVal, HTMLElem, HTMLText } from "../HTMLBuilder/HTMLBuilder";

let search = $("#portfolio #search input")

function updateSuggestions(){
    let searchVal : string = (() : string => {
        let tmp = search.val();
        if (tmp == null) {
            return "";
        }
        return tmp.toString();
    })();

    let suggestionArea = $("#portfolio #search .suggestions");

    if(searchVal.length == 0) {
        suggestionArea.css("display", "none");
    }
    else {
        suggestionArea.css("display", "block");
    }

    let suggestionsHTML : HTMLElem = new HTMLElem("div");
    let commonSubString : HTMLElem = new HTMLElem("b");

    commonSubString.addChild(new HTMLText(searchVal.toUpperCase()));

    let tags = TagList.getInstance().tags.filter((tag) => {
        if(searchVal.length == 0 || searchVal.length > tag.symbol.length) {
            return false;
        }

        return searchVal.toLowerCase() == tag.symbol.substring(0, searchVal.length).toLowerCase();
    })
    .sort((a : Tag, b : Tag) : number => {
        return a.symbol.length - b.symbol.length;
    });

    if(tags.length == 0) {
        suggestionArea.css("display", "none");
    }

    tags.forEach((tag) => {
        let suggestionHTML : HTMLElem = new HTMLElem("div");
        suggestionHTML.get("id").push(new AttrVal(`${tag.id}`))
        suggestionHTML.addChild(commonSubString);

        suggestionHTML.addChild(new HTMLText(tag.symbol.substring(searchVal.length)));

        suggestionsHTML.addChild(suggestionHTML);
    })

    suggestionArea.html(suggestionsHTML.generateChildren());

    tags.forEach((tag) => {
        $(`#portfolio #search .suggestions #${tag.id}`).on("click", ()=> {
            console.log(`${tag.symbol}`);
        });
    })
}

export function main() {
    search.on("input", updateSuggestions);
    search.on("keydown", (e) => {
        console.log(search.val())
        console.log(e);
    });
}
