import { Project } from "../DataBaseHandler/Project";
import { updateProject } from "./ProjectListGenerator";

let selected : number = 0;
let sortAlgorithms : ((projects: Project[]) => Project[])[] = [
    //sort by name
    (projects : Project[]) : Project[] => {
        return projects.sort((proj1, proj2) => {
            return proj1.name < proj2.name ? -1 : 1
        })
    },
    //sort by start date
    (projects : Project[]) : Project[] => {
        return projects.sort((proj1, proj2) => {
            return proj2.startUnix - proj1.startUnix
        })
    },
    //sort by last update date
    (projects : Project[]) : Project[] => {
        return projects.sort((proj1, proj2) => {
            return proj2.updateUnix - proj1.updateUnix
        })
    }
];

/**
 * getVal function retrieves name of sortBy function
 * @returns 
 */
function getVal() : string {
    let tmp = $("#portfolio #columns select.sortBy").val();
    if (tmp == null) {
        return "";
    }
    return tmp.toString();
}

/**
 * select functions updates project order based on selected sortby function string
 * @param {string} selectedCategory 
 */
function select(selectedCategory : string) {
    switch(selectedCategory) {
        case "name":
            selected = 0;
            break;
        case "start":
            selected = 1;
            break;
        case "update":
            selected = 2;
            break;
    }

    $("#portfolio #columns .selected").removeClass("selected");
    $(`#portfolio #columns >#${selectedCategory}`).addClass("selected");
    $("#portfolio #columns select.sortBy").val(selectedCategory);
    updateProject();
}

/**
 * sort functions sorts an array of projects based on selected sort algorithm
 * @param {Project[]} projects 
 * @returns {Project[]} array of sorted projects
 */
export function sort(projects : Project[]) : Project[] {
    return sortAlgorithms[selected](projects);
}

/**
 * main function initializes project order
 */
export function main() {
    select("name");
    $("#portfolio #columns #name").on("click", () => {select("name")});
    $("#portfolio #columns #start").on("click", () => {select("start")});
    $("#portfolio #columns #update").on("click", () => {select("update")});
    $("#portfolio #columns select.sortBy").on("change", () => {select(getVal())});
}