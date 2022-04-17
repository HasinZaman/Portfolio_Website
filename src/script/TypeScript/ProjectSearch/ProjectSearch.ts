import { Project, ProjectList } from "../DataBaseHandler/Project";
import { Tag, TagList } from "../DataBaseHandler/Tag";
import { AttrVal, HTMLElem, HTMLText } from "../HTMLBuilder/HTMLBuilder";

function generateProjects(projects : Project[]) {
    $("#portfolio #results")

    let projectTags : {[key : number]: Tag[]}  = {}; 

    let tags = TagList.getInstance().tags;

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
                    projectTags[projectId] = [];
                }
                console.log(TagList.getInstance().tags[tagIndex])
                projectTags[projectId].push(TagList.getInstance().tags[tagIndex])
            }
        )

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

        let title = new HTMLElem("div");
        title.get("id").push(new AttrVal("title"));
        title.addChild(new HTMLText(project.name));

        let tags = new HTMLElem("div");
        tags.get("id").push(new AttrVal("tags"));

        projectTags[project.tag.id].forEach(
            projectTag => {
                let tag = new HTMLElem("div");
                tag.get("class").push(new AttrVal("tag"))
                tag.addChild(new HTMLText(projectTag.symbol)) 

                tags.addChild(tag);
            }
        );

        projectElem.addChild(start)
            .addChild(update)
            .addChild(desc)
            .addChild(title)
            .addChild(tags)
    });
}

ProjectList.getInstance()
    .update(
        () => {
            generateProjects(ProjectList.getInstance().project);
            console.log(ProjectList.getInstance().project);
        }
    )

