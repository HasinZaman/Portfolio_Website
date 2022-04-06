import { Tag, TagList } from "../DataBaseHandler/Tag";
import { AttrVal, HTMLElem, HTMLText, StyleAttr } from "../HTMLBuilder/HTMLBuilder";


function toId(str : string) : string {
    return str.replace(" ", "-")
        .replace("#","Sharp")
}

//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex : string) : {r: number, g : number, b: number} {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
}

function rgba(col : {r: number, g : number, b: number}, opacity : number ) : {r: number, g : number, b: number} {
    let calculate = (foreground : number, background : number) => {
        return foreground * opacity + (1 - opacity) * background
    }

    return {
        r : calculate(col.r, 0),
        g : calculate(col.g, 0),
        b : calculate(col.b, 0)
    }
}

function createSkills() {
    let target = $("#skills > div").first();
    
    let skillsHTML : HTMLElem = new HTMLElem("div");

    let tags = 
    TagList.getInstance()
    .tags
    .filter(
        (tag)=> {
            return tag.tagType === 0
        }
    );

    tags.forEach(
        (skill : Tag) => {
            let elem : HTMLElem = new HTMLElem("div");
            elem.get("id").push(new AttrVal(toId(skill.symbol)));
            elem.get("class").push(new AttrVal("skill"));

            let img : HTMLElem = new HTMLElem("img");
            img.get("src").push(new AttrVal(`src\\media\\img\\icons\\${skill.symbol}_icon.svg`))
            img.get("alt").push(new AttrVal(`${skill.symbol} icon`))

            let text : HTMLElem = new HTMLElem("div");
            text.addChild(new HTMLText(`${skill.symbol}`));

            elem.addChild(img);
            elem.addChild(text);

            skillsHTML.addChild(elem);
        }
    );

    let rowCount = Math.floor((target.width() ?? 0) / 100); 
    if((tags.length / rowCount) % 1 != 0) {
        let fillerCount = Math.floor((1 - ((tags.length / rowCount) % 1)) * rowCount);

        for(let i1 = 0; i1 < fillerCount; i1++) {
            let elem : HTMLElem = new HTMLElem("div");
            elem.get("class").push(new AttrVal("skill"));

            skillsHTML.addChild(elem);
        }
    }
    

    target.html(skillsHTML.generateChildren());
}

function createOrganizationButton() {
    let target = $("#skills > nav").first();
    let htmlBuilder : HTMLElem = new HTMLElem("div");

    let createVal = (symbol : string, colour : string) => {
        let htmlBuilder = new HTMLElem("div");
        htmlBuilder.get("id")
            .push(new AttrVal(toId(symbol)))
        
        let container = new HTMLElem("span");
        let text = new HTMLText(symbol);
        container.addChild(text);

        htmlBuilder.addChild(container)


        document.styleSheets[0].addRule(`#skills > nav > #${toId(symbol)}::after`,`background-color: #${colour};`);

        return htmlBuilder;
    };

    htmlBuilder.addChild(createVal("all", "FFF"));

    let tagList = TagList.getInstance();

    let tags : Tag[] = tagList.tags;
    let connections : number[][] = tagList.connections;

    let catagoriesTmp = new Array<boolean>(tags.length).fill(false);

    for (let i1 = 0; i1 < connections.length; i1++) {
        let conn = connections[i1];

        let tag1 = tags[conn[0]];
        let tag2 = tags[conn[1]];

        let tmp : Tag;

        //both tags are organizational
        if(tag1.tagType == tag2.tagType && tag1.tagType == 2) {
            continue;
        }

        if(catagoriesTmp[conn[0]] || catagoriesTmp[conn[1]]) {
            continue;
        }

        if(tag1.tagType == 2) {
            tmp = tag1;
            catagoriesTmp[conn[0]] = true;
        }
        else {
            tmp = tag2;
            catagoriesTmp[conn[1]] = true;
        }

        htmlBuilder.addChild(createVal(tmp.symbol, tmp.colour))
    }
    
    target.html(htmlBuilder.generateChildren());

    for(let i1 = 0; i1 < catagoriesTmp.length; i1++) {
        if(!catagoriesTmp[i1]) {
            continue;
        }

        let id = `#skills > nav > #${toId(tags[i1].symbol)}`;
        
        $(id).on("click", () => {
            select(i1);
        })

        $(id).css("border-color", tags[i1].colour);
    }
    $(`#skills > nav > #all`).on("click", () => {
        select(-1);
    })
}

function deSelect() {
    $("#skills > nav .selected").removeClass("selected")
    $("#skills > div .skill").removeClass("selected")
}

function select(idIndex : number) {

    deSelect();

    let tags = TagList.getInstance().tags;
    let connections : number[][] = TagList.getInstance().connections;

    let col : {r: number, g : number, b: number};

    if (idIndex === -1) {
        $(`#skills > nav > #all`).addClass("selected")
        col = {r: 0, g : 0, b: 0};
        connections.forEach((conn) => {
            $(`#skills > div #${toId(tags[conn[0]].symbol)}`).addClass("selected")
            $(`#skills > div #${toId(tags[conn[1]].symbol)}`).addClass("selected")
        })
    }
    else {
        let id = `#skills > nav > #${toId(tags[idIndex].symbol)}`;
        
        col = rgba(hexToRgb(`#${tags[idIndex].colour}`), 0.75);

        $(id).addClass("selected")
        
        connections
        .filter((conn) => {
            return conn[0] == idIndex || conn[1] == idIndex
        })
        .forEach((conn) => {
            let id : number;
    
            if(conn[0] != idIndex) {
                id = conn[0]
            } else {
                id = conn[1]
            }
            $(`#skills > div #${toId(tags[id].symbol)}`).addClass("selected")
        });
    }
   
    let newBg = new HTMLElem("div");
    let timeStamp = new Date().getTime();

    newBg.get("id").push(new AttrVal(`bg-${timeStamp}`))
    newBg.get("class").push(new AttrVal("bg"))
    newBg.get("style").push(new StyleAttr("background-color",`rgb(${col.r}, ${col.g}, ${col.b})`));

    $(`#skills > div`).append(newBg.generate());

    setTimeout(() => {
        $(`#skills > div`).css("background-color", `rgb(${col.r}, ${col.g}, ${col.b})`)

        setTimeout(() => {
            $(`#skills > div #bg-${timeStamp}`).remove();
        }, 500 * 0.1);

    }, 500 * 0.9);

}

$(window).on('resize', () => {
    createSkills();
    createOrganizationButton();
    select(-1);
})

TagList.getInstance()
    .update(() => {
        createSkills();
        createOrganizationButton();
        select(-1);
    }
)
