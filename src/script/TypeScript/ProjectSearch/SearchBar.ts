import { Project, ProjectList } from "../DataBaseHandler/Project";
import { Tag, TagList } from "../DataBaseHandler/Tag";
import { AttrVal, HTMLElem, HTMLText } from "../HTMLBuilder/HTMLBuilder";
import { updateProject } from "./ProjectListGenerator";
import { getTagHTML } from "./TagGenerator";

let search = $("#portfolio #search input")

let tagFilters : Set<number> = new Set<number>();
let nameFilters: Set<string> = new Set<string>();
let deleteStack : (() => void)[] = []; 

/**
 * setSearch function adds filters to search
 * @param {string[]} filters array of strings that will be added to filter array
 */
export function setSearch(filters: string[]) {
    //remove all filters
    reset();

    //add filters
    filters.forEach(filter => {
        addFilter(filter);
    });
    
    updateProject();
}

/**
 * reset function removes all filters
 */
function reset() {
    deleteStack.forEach(del => {
        deletePrevTag();
    });

    search.val("");
}

/**
 * getSearchVal function gets text input value from search bar
 * @returns {string} text input value from search bar
 */
function getSearchVal() : string {
    let tmp = search.val();
    if (tmp == null) {
        return "";
    }
    return tmp.toString();
}

/**
 * getProjects function gets a array of projects that fulfills name, description and tag filters
 * @returns {Project[]} Array project that passes filter tests
 */
export function getProjects() : Project[] {
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

/**
 * updateSuggestions function updates suggestion box based on current incomplete search value data
 */
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
            updateProject();
        });
    })
}

/**
 * onSuggestionClick function adds filter based on selected suggestion
 * @param {string} filterStr filter search string
 */
function onSuggestionClick(filterStr: string) {
    addFilter(filterStr);
    search.val("");
    updateSuggestions();
}

/**
 * addFilter function adds filter string into an array of filters
 * @param {String} filterStr filter search string
 */
function addFilter(filterStr : string) {
    //find all tags that match filter string
    let tags = TagList.getInstance().tags
        .filter((tag: Tag) => {//remove all projects from tag
            return tag.tagType != 1
        })
        .filter((tag: Tag) => {//find matching tags
            return tag.symbol.toLowerCase() === filterStr.toLowerCase()
        })
    
    //if not tags match filter then add name/desc filter
    if(tags.length === 0) {
        addNameFilter(filterStr);
        return ;
    }

    //add first matching tag filter
    addTagFilter(tags[0]);
}

/**
 * addTagFilter function adds tag as filter
 * @param {Tag} tag 
 */
function addTagFilter(tag : Tag) {
    if(!tagFilters.has(tag.id)) {
        tagFilters.add(tag.id);
        addTagToSearch(tag.symbol, tag.colour);
        deleteStack.push(()=> {
            tagFilters.delete(tag.id);
        })
    }
}

/**
 * addNameFilter function adds string as name/description filter
 * @param {string} name 
 */
function addNameFilter(name : string) {
    if(!nameFilters.has(name)){
        nameFilters.add(name);

        addTagToSearch(name, "FFFFFF");

        deleteStack.push(()=> {
            nameFilters.delete(name);
        })
    }
}

/**
 * addTagToSearch function adds active filter to search bar
 * @param {string} content 
 * @param {string} colour 
 */
function addTagToSearch(content : string, colour : string) {
    $("#portfolio #search .searchBox").before(getTagHTML(content, colour).generate());
}

/**
 * deletePrevTag function deletes the last filter that was added
 */
function deletePrevTag() {
    $("#portfolio #search .searchBox").prev().remove();

    //get last filter
    let deleteClosure = deleteStack.pop();

    if(deleteClosure != null) {
        deleteClosure();
    }
}

/**
 * main function handles the initialization and update of searchbar
 */
export function main() {
    search.on("input", updateSuggestions);
    search.on("keydown", (e) => {
        let tmpSearch = getSearchVal();

        if(e.key == "Enter") {//add new tag
            addFilter(tmpSearch);
            search.val("");
            updateSuggestions();
        }
        else if(e.key == "Backspace" && tmpSearch.length === 0) {//remove last tag
            deletePrevTag();
        }

        //temporarily add current search value to name filter
        let tmpAdd : boolean = nameFilters.has(tmpSearch);

        if(!tmpAdd) {
            nameFilters.add(tmpSearch);
        }

        updateProject();
        
        if(!tmpAdd) {
            nameFilters.delete(tmpSearch);
        }
    });
}
