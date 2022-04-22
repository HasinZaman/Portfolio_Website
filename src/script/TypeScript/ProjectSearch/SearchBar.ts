import { Project, ProjectList } from "../DataBaseHandler/Project";
import { Tag, TagList } from "../DataBaseHandler/Tag";
import { AttrVal, HTMLElem, HTMLText, StyleAttr } from "../HTMLBuilder/HTMLBuilder";
import { generateProjects } from "./ProjectSearch";
import { getTagHTML } from "./TagGenerator";

let search = $("#portfolio #search input")

let tagFilters : Set<number> = new Set<number>();
let nameFilters: Set<string> = new Set<string>();
let deleteStack : (() => void)[] = []; 

function getSearchVal() : string {
    let tmp = search.val();
    if (tmp == null) {
        return "";
    }
    return tmp.toString();
}

function getProjects() : Project[] {
    let tags = TagList.getInstance().tags;

    return ProjectList.getInstance().project
        .filter((proj) => {//filter tags

            let linkedTags = TagList.getInstance().connections
                .filter(conn => {
                    return  tags[conn[0]].id == proj.tag.id ||
                            tags[conn[1]].id == proj.tag.id;
                })
                .map(conn => {
                    if(tags[conn[0]].tagType == 1) {
                        return tags[conn[1]];
                    }
                    return tags[conn[0]].id;
                })
                .filter((val, ind, arr) => {
                    return arr.indexOf(val) === ind
                })
                
            return Array.from(tagFilters)
                .map(id => {
                    return TagList.getInstance().getById(id)
                })
                .filter(tag => {
                    return tag != null
                })
                .every((tag) => {
                    if(tag == null){
                        return true
                    }
                    return linkedTags.indexOf(tag) > -1;
                })
        })
        .filter((proj) => {//filter by name/desc
            let filters = Array.from(nameFilters).map(val => val.toLowerCase());
            filters.push(getSearchVal().toLowerCase());

            return filters
                .every(name => {
                    return proj.tag.symbol.toLowerCase().includes(name)
                }) ||
                filters
                .every(name => {
                    return proj.description.toLowerCase().includes(name)
                })
        });
}

function updateSuggestions(){
    let searchVal : string = getSearchVal();

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
            onSuggestionClick(tag.symbol);
            generateProjects(getProjects());
        });
    })
}

function onSuggestionClick(filterStr: string) {
    addFilter(filterStr);
    search.val("");
    updateSuggestions();
}

function addFilter(filterStr : string) {
    let tags = TagList.getInstance().tags
        .filter((tag: Tag) => {//remove all projects from tag
            return tag.tagType != 1
        })
        .filter((tag: Tag) => {//find matching tags
            return tag.symbol.toLowerCase() === filterStr.toLowerCase()
        })
    
    if(tags.length === 0) {
        addNameFilter(filterStr);
        return ;
    }

    addTagFilter(tags[0]);
}

function addTagFilter(tag : Tag) {
    if(!tagFilters.has(tag.id)) {
        console.log("add tag:"+tag.symbol);
        tagFilters.add(tag.id);
        addTagToSearch(tag.symbol, tag.colour);
        deleteStack.push(()=> {
            tagFilters.delete(tag.id);
        })
    }
}

function addNameFilter(name : string) {
    if(!nameFilters.has(name)){
        console.log("add name:"+name);

        nameFilters.add(name);

        addTagToSearch(name, "FFFFFF");

        deleteStack.push(()=> {
            nameFilters.delete(name);
        })
    }
}

function addTagToSearch(content : string, colour : string) {
    $("#portfolio #search .searchBox").before(getTagHTML(content, colour).generate());
}

function deletePrevTag() {
    $("#portfolio #search .searchBox").prev().remove();
    let deleteClosure = deleteStack.pop();
    if(deleteClosure != null) {
        deleteClosure();
    }
}

export function main() {
    search.on("input", updateSuggestions);
    search.on("keydown", (e) => {
        if(e.key == "Enter") {
            addFilter(getSearchVal());
            search.val("");
            updateSuggestions();

            console.log(getProjects().map(proj => {
                proj.tag
            }))

            generateProjects(getProjects());
        }
        else if(e.key == "Backspace") {
            if(getSearchVal().length === 0) {
                deletePrevTag();
            }
            generateProjects(getProjects());
        }

    });
}
