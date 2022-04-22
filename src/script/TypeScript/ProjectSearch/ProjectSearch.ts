import { Project, ProjectList } from "../DataBaseHandler/Project";
import { Tag, TagList } from "../DataBaseHandler/Tag";
import { AttrVal, HTMLElem, HTMLText } from "../HTMLBuilder/HTMLBuilder";
import { main } from "./SearchBar";
import { getTagHTML } from "./TagGenerator";

export function generateProjects(projects : Project[]) {
    let target = $("#portfolio #results")

    let projectTags : {[key : number]: Set<Tag>}  = {}; 

    let tags = TagList.getInstance().tags;

    let projectsHTML : HTMLElem = new HTMLElem("");

    TagList.getInstance().connections
        .filter(
            (conn) => {
                return (tags[conn[0]].tagType == 1 || tags[conn[1]].tagType == 1) && //check if one tags is project
                tags[conn[0]].tagType != tags[conn[1]].tagType;//check if both aren't tags aren't project
            }
        )
        .forEach(
            (conn) => {
                let projectId : number;
                let tagIndex : number;

                if(tags[conn[0]].tagType == 1){
                    projectId = TagList.getInstance().tags[conn[0]].id;
                    tagIndex = conn[1];
                }
                else {// implied: tags[conn[1]].tagType == 1
                    projectId = TagList.getInstance().tags[conn[1]].id;
                    tagIndex = conn[0];
                }
                if(!projectTags.hasOwnProperty(projectId)) {
                    projectTags[projectId] = new Set();
                }
                projectTags[projectId].add(TagList.getInstance().tags[tagIndex])
            }
        )

    //Create html element for each project
    projects.forEach(project => {
        let projectElem = new HTMLElem("div")

        let start = new HTMLElem("div")
        start.get("id").push(new AttrVal("start"));
        start.addChild(new HTMLText(`${project.start}`));

        let update = new HTMLElem("div");
        update.get("id").push(new AttrVal("update"));
        update.addChild(new HTMLText(`${project.update}`))

        let desc = new HTMLElem("div");
        desc.get("id").push(new AttrVal("desc"));
        desc.addChild(new HTMLText(project.description));

        let name = new HTMLElem("a");
        name.get("id").push(new AttrVal("name"));
        name.get("href").push(new AttrVal(project.link));
        name.addChild(new HTMLText(project.name));

        let tags = new HTMLElem("div");
        tags.get("id").push(new AttrVal("tags"));

        if(projectTags.hasOwnProperty(project.tag.id)) {
            projectTags[project.tag.id].forEach(
                projectTag => {
                    tags.addChild(getTagHTML(projectTag.symbol, projectTag.colour));
                }
            );
        }

        projectElem.addChild(start)
            .addChild(update)
            .addChild(desc)
            .addChild(name)
            .addChild(tags)
        projectsHTML.addChild(projectElem);
    });

    target.html(projectsHTML.generateChildren())
}

ProjectList.getInstance()
    .update(
        () => {
            generateProjects(ProjectList.getInstance().project);
        }
    )

main();