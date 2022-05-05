import { interceptChecks } from "../../Math/Paths/Intercept";
import { Line } from "../../Math/Paths/Line";
import { Path } from "../../Math/Paths/Path";
import { Rect } from "../../Math/Paths/Rect";
import { Vector } from "../../Math/Vector";
import { Edge, Star } from "./Star";
import { IEnvironmentSettings, IStarSettings, randomPos, starGenerate } from "./StarGeneration";

let stars : JQuery = $("#header #starSystem");
let constellations : JQuery = $("#header svg");

let environmentSize : Vector = new Vector(stars.width() as number, stars.height() as number);;
let starSize : Vector  = new Vector(5, 5);;

let timeDelta : number = 20;//ms

//entities
let entities : Path[] = []

function start(environmentSettings : IEnvironmentSettings, starSettings : IStarSettings){
    reSize();

    entities = []

    starGenerate(environmentSettings, starSettings).forEach(
        star => {
            entities.push(star);
            render(star);
        }
    );

    setTimeout(update, timeDelta);
}

function update() : void {

    //calculate star physics
    // for(let i1 : number = 4; i1 < entities.length; i1++) {
    //     let star = entities[i1] as Star;
        
    //     star.move(timeDelta / 1000);
    // }

    //ball rendering
    //let boundary = new Rect(environmentSize.x, environmentSize.y, 0, new Vector(0, 0));
    for(let i1 = 4; i1 < entities.length; i1++)
    {
        //let star = entities[i1] as Star;

        //check if ball is within environment
        // if(!boundaryCheck(star)) {
        //     //update position
        //     let pos : Vector = randomPos(
        //         star.radius,
        //         boundary,
        //         [i1],
        //         entities
        //     );

        //     star.p.x = pos.x;
        //     star.p.y = pos.y;

        //     star.vel = Vector.mult(
        //         Vector.normalize(
        //             new Vector(
        //                 Math.random(),
        //                 Math.random()
        //             )
        //         ),
        //         Vector.dist(star.vel)
        //     );
            
        // }

        // render(star);
    }
    
    //edge rendering
    Star.edgeList.forEach(edge => {
        edge.updateLine();
    });

    Edge.updateSVGElem(Star.edgeList);

    //update after n time
    setTimeout(update, timeDelta);
}

/**
 * render method updates the DOM of all entities in environment
 * @param {Star} star 
 */
function render(star : Star) : void {
    let tmp : Vector = Vector.sub(star.p, new Vector(starSize.x/2, -1 * starSize.y/2));
    star.element.css("left", `${tmp.x/environmentSize.x * 100}%`);
    star.element.css("bottom", `${tmp.y / environmentSize.y * 100}%`);
}

function reSize() : void {

    environmentSize = new Vector(stars.width() as number, stars.height() as number);

    Edge.setSVGElemSize(environmentSize.x, environmentSize.y);

    let gradientPath : Vector[] = [new Vector(1, 0),new Vector(0, 1),new Vector(-1, 0),new Vector(0, -1)]
    let start : Vector = new Vector(0,0);

    if(entities.length > 4) {
        for(let i : number = 0; i < 4; i++) {
            switch(i) {
                case 0:
                case 2:
                    entities[i] = new Line(start,  gradientPath[i],   environmentSize.x);
                    break;
                case 1:
                case 3:
                    entities[i] = new Line(start,  gradientPath[i],   environmentSize.y);
                    break;
            }
            
            start = entities[i].getPoint((entities[i] as Line).l);
        }
    }
    else {
        entities = []
        for(let i : number = 0; i < 4; i++) {
            switch(i) {
                case 0:
                case 2:
                    entities.push(new Line(start,  gradientPath[i],   environmentSize.x))
                    break;
                case 1:
                case 3:
                    entities.push(new Line(start,  gradientPath[i],   environmentSize.y))
                    break;
            }
            
            start = entities[i].getPoint((entities[i] as Line).l);
        }
    }
}

export function main() {
    let tmp = () => {
        let environmentSettings:IEnvironmentSettings = {
            size: environmentSize,
            skyJquery: stars,
        };
    
        let ballSettings:IStarSettings = {
            defaultRadius: starSize.x / 2,
            count: (3 / (200 * 200) ) * environmentSize.x * environmentSize.y
        }

        start(environmentSettings, ballSettings);
    }

    $(window).on("load", tmp)
}