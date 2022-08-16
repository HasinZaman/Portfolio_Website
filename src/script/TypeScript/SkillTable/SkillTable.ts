import { hexToRgb, rgba } from "../Colour/Colour";
import { Tag, TagList } from "../DataBaseHandler/Tag";
import { AttrVal, HTMLElem, HTMLText, StyleAttr } from "../HTMLBuilder/HTMLBuilder";
import { setSearch } from "../ProjectSearch/SearchBar";
import { Vector } from "../Math/Vector";


let tiles : number[] = []
let tableDim : Vector = new Vector(0, 0);

let selected = -1;

const ALL : string = "All";

/**
 * getTile method returns Tile in grid
 * @param {Number} x x position on grid
 * @param {Number} y y position on grid
 * @param {Vector} dim width and height of 2d grid 
 * @param {T[]} grid array of tiles in grid
 * @param {T} nullVal default null tile value 
 * @returns {T} Tile at (x,y) in grid
 */
function getTile<T>(x : number, y : number, dim : Vector, grid : T[], nullVal : T) : T {
    if (x < 0 || dim.x <= x) {
        return nullVal;
    }

    if(y < 0|| dim.y <= y) {
        return nullVal;
    }

    return grid[x + y * dim.x]
}

/**
 * prepareTiles method generates HTML for all skill tiles
 */
function prepareTiles() {
    //get all tags
    let tags = TagList.getInstance()
        .tags
        .filter(
            (tag)=> {
                return tag.tagType === 0
            }
        );

    let target = $("#skills > div").first();

    let skillsHTML : HTMLElem = new HTMLElem("div");

    tableDim.x = Math.floor((target.width() ?? 0) / 100);
    tableDim.y = tags.length / tableDim.x;
    if(tableDim.y % 1 != 0) {
        tableDim.y = Math.ceil(tableDim.y);
    }

    tiles = new Array<number>(tableDim.x * tableDim.y).fill(-1);

    tags = TagList.getInstance().tags;

    let i2 = 0;

    //turn all tags => html tiles
    for(let i1 = 0; i1 < tags.length; i1++) {
        if (tags[i1].tagType === 0) {
            tiles[i2++] = i1;

            let skill : Tag = tags[i1];

            let elem : HTMLElem = new HTMLElem("div");
            elem.get("id").push(new AttrVal(toId(skill.symbol)));
            elem.get("class").push(new AttrVal("skill"));

            let img : HTMLElem = new HTMLElem("img");
            img.endTag = false;
            img.get("src").push(new AttrVal(`src\\media\\img\\icons\\${skill.symbol.replace("#","Sharp")}_icon.svg`))
            img.get("alt").push(new AttrVal(`${skill.symbol} icon`))

            let text : HTMLElem = new HTMLElem("div");
            text.addChild(new HTMLText(`${skill.symbol}`));

            elem.addChild(img);
            elem.addChild(text);

            skillsHTML.addChild(elem);
        }
    }

    //filling array with empty tiles
    for(i2++; i2 <= tiles.length; i2++) {
        let elem : HTMLElem = new HTMLElem("div");
        elem.get("class").push(new AttrVal("skill"));

        skillsHTML.addChild(elem);
    }

    target.html(skillsHTML.generateChildren());

    //added functionality to all tags
    for(let i1 = 0; i1 < tags.length; i1++) {
        if (tags[i1].tagType === 0) {
            let tag = tags[i1];
            
            $(`#skills div #${toId(tag.symbol)}.skill`).on("click", ()=> {
                setSearch([tag.symbol])
                $("#portfolio")[0].scrollIntoView();
            })
        }
    }
}

/**
 * updateBorder is a utility method that updates the borders of selected tile
 * @param id 
 * @param width 
 * @param edge 
 */
function updateBorder(id : string, width: number, edge : number) {
    let edgeMap : {[key : number] : string} = {0 : "bottom", 1 : "right", 2: "top", 3: "left"};

    $(`#${id}`).css(`border-${edgeMap[edge]}-width`, `${width}px`)
}

/**
 * previewTiles method updates of all tiles that need preview border
 * @param {Number[]} selectedTiles Array of all tiles that need a preview border
 */
function previewTiles(selectedTiles : number[]) {
    let tags = TagList.getInstance().tags;
    let targetTiles : boolean[] = new Array<boolean>(tiles.length);

    for(let i1 = 0; i1 < tiles.length; i1++) {
        targetTiles[i1] = selectedTiles.lastIndexOf(tiles[i1]) != -1;
    }

    for(let x = 0; x < tableDim.x; x++) {
        for (let y = 0; y < tableDim.y; y++) {

            let tag = tags[getTile(x, y, tableDim, tiles, -1)];
            let currentTile = getTile(x,y,tableDim, targetTiles, false);

            if(tag == undefined){
                continue;
            }

            //update border to 0 
            if(!currentTile) {
                for(let i = 0; i < 4; i++) {
                    updateBorder(toId(tag.symbol), 0, i);
                }
                continue;
            }

            //update borders

            //left border
            if(!getTile(x-1, y, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 3)
            }
            else {
                updateBorder(toId(tag.symbol), 0, 3)
            }

            //right border
            if(!getTile(x+1, y, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 1)
            }
            else {
                updateBorder(toId(tag.symbol), 0, 1)
            }

            //top border
            if(!getTile(x, y-1, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 2)
            }
            else {
                updateBorder(toId(tag.symbol), 0, 2)
            }

            //bottom
            if(!getTile(x, y+1, tableDim, targetTiles, false)) {
                updateBorder(toId(tag.symbol), 5, 0)
            }
            else {
                updateBorder(toId(tag.symbol), 0, 0)
            }
        }
    }
}

/**
 * toId is a utility method that converts a tag name into an id
 * @param {string} str 
 * @returns {string} id of str
 */
function toId(str : string) : string {
    return str.replace(" ", "-")
        .replace("#","Sharp")
}

/**
 * createOrganizationButton method creates html for organizational buttons that reside underneath skill tables
 */
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

    htmlBuilder.addChild(createVal(ALL, "FFF"));

    let tagList = TagList.getInstance();

    let tags : Tag[] = tagList.tags;
    let connections : number[][] = tagList.connections
    .filter((conn : number[]) => {
        return (tags[conn[0]].tagType == 2) != (tags[conn[1]].tagType == 2) &&
            (tags[conn[0]].tagType != 1 && tags[conn[1]].tagType != 1)
    });

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
        else if(tag2.tagType == 2) {
            tmp = tag2;
            catagoriesTmp[conn[1]] = true;
        }
        else {
            continue;
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
            selectOrganizationalGroup(i1);
        })

        $(id).on("mouseenter", () => {
            let tagList = TagList.getInstance();
            let connection = tagList.connections;
            let tags = tagList.tags;

            let idToIndexMap :{[key: number] : number} = {}; 
            for(let i1 = 0; i1 < tags.length; i1++) {
                idToIndexMap[tags[i1].id] = i1;
            }

            let targetTiles : number[] = [];

            tags
                .filter((tag) => {
                    return tag.tagType === 0 &&
                    connection.some((conn) => {
                        return (conn[0] == i1 && conn[1] == idToIndexMap[tag.id]) ||
                            (conn[0] == idToIndexMap[tag.id] && conn[1] == i1);
                    })
                })
                .forEach((tag) => {
                    targetTiles.push(idToIndexMap[tag.id]);
                })
            
            previewTiles(targetTiles)
        })
        
        $(id).on("mouseleave", () => {
            let tagList = TagList.getInstance();
            let connection = tagList.connections;
            let tags = tagList.tags;

            let idToIndexMap :{[key: number] : number} = {}; 
            for(let i1 = 0; i1 < tags.length; i1++) {
                idToIndexMap[tags[i1].id] = i1;
            }

            let targetTiles : number[] = [];

            tags
                .filter((tag) => {
                    return tag.tagType === 0 &&
                    connection.some((conn) => {
                        return (conn[0] == selected && conn[1] == idToIndexMap[tag.id]) ||
                            (conn[0] == idToIndexMap[tag.id] && conn[1] == selected);
                    })
                })
                .forEach((tag) => {
                    targetTiles.push(idToIndexMap[tag.id]);
                })
            
            previewTiles(targetTiles)
        })

        $(id).css("border-color", tags[i1].colour);
    }
    $(`#skills > nav > #${ALL}`).on("click", () => {
        selectOrganizationalGroup(-1);
    })

    $(`#skills > nav > #${ALL}`).on("mouseenter", () => {
        let tagList = TagList.getInstance();
        let connection = tagList.connections;
        let tags = tagList.tags;

        let idToIndexMap :{[key: number] : number} = {}; 
        for(let i1 = 0; i1 < tags.length; i1++) {
            idToIndexMap[tags[i1].id] = i1;
        }

        let targetTiles : number[] = [];

        tags
        .forEach((tag) => {
            targetTiles.push(idToIndexMap[tag.id]);
        })
        
        previewTiles(targetTiles)
    })

    $(`#skills > nav > #${ALL}`).on("mouseleave", () => {
        let tagList = TagList.getInstance();
        let connection = tagList.connections;
        let tags = tagList.tags;

        let idToIndexMap :{[key: number] : number} = {}; 
        for(let i1 = 0; i1 < tags.length; i1++) {
            idToIndexMap[tags[i1].id] = i1;
        }

        let targetTiles : number[] = [];

        tags
            .filter((tag) => {
                return tag.tagType === 0 &&
                connection.some((conn) => {
                    return (conn[0] == selected && conn[1] == idToIndexMap[tag.id]) ||
                        (conn[0] == idToIndexMap[tag.id] && conn[1] == selected);
                })
            })
            .forEach((tag) => {
                targetTiles.push(idToIndexMap[tag.id]);
            })
        
        previewTiles(targetTiles)
    })
}

/**
 * select method handles the preview of organizational groups
 * @param {number} organizationalGroupIndex 
 */
function selectOrganizationalGroup(organizationalGroupIndex : number) {
    selected = organizationalGroupIndex;
    
    $("#skills > nav .selected").removeClass("selected");

    let tags = TagList.getInstance().tags;
    let connections : number[][] = TagList.getInstance().connections;

    let col : {r: number, g : number, b: number};

    let timeStamp = new Date().getTime();

    //select all
    if (organizationalGroupIndex === -1) {
        $(`#skills > nav > #${ALL}`).addClass("selected")
        col = {r: 0, g : 17, b: 28};
        
        setTimeout(() => {
            $("#skills > div .skill").removeClass("selected");

            connections.forEach((conn) => {
                $(`#skills > div #${toId(tags[conn[0]].symbol)}`).addClass("selected");
                $(`#skills > div #${toId(tags[conn[1]].symbol)}`).addClass("selected");
            });

        }, 500);
    }
    //select catagories
    else {
        $("#skills > div .skill").removeClass("selected");

        let id = `#skills > nav > #${toId(tags[organizationalGroupIndex].symbol)}`;
        
        col = rgba(hexToRgb(`#${tags[organizationalGroupIndex].colour}`), 0.75);

        $(id).addClass("selected")
        
        connections
        .filter((conn) => {
            return conn[0] == organizationalGroupIndex || conn[1] == organizationalGroupIndex
        })
        .forEach((conn) => {
            let id : number;
    
            if(conn[0] != organizationalGroupIndex) {
                id = conn[0]
            } else {
                id = conn[1]
            }
            $(`#skills > div #${toId(tags[id].symbol)}`).addClass("selected")
        });
    }

    let newBg = new HTMLElem("div");

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

/**
 * main method handles the initialization of skill tables
 */
export function main() {
    $(window).on('resize', () => {
        //createSkills();
        prepareTiles();
        createOrganizationButton();
        selectOrganizationalGroup(-1);
    })
    
    TagList.getInstance()
        .update(() => {
            //createSkills();
            prepareTiles();
            createOrganizationButton();
            selectOrganizationalGroup(-1);
        }
    )
}