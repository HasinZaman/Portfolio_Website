import { Circle } from "../../Math/Paths/Circle";
import { interceptChecks } from "../../Math/Paths/Intercept";
import { Path } from "../../Math/Paths/Path";
import { Rect } from "../../Math/Paths/Rect";
import { Vector } from "../../Math/Vector";
import { Star } from "./Star";

/**
 * IEnvironmentSettings is an interface that defines key setting for an environment
 */
export interface IEnvironmentSettings {
    size: Vector;
    skyJquery: JQuery;
}

/**
 * IBallSettings is an interface that defines key setting for skill balls in an environment
 */
export interface IStarSettings {
    defaultRadius: number;
    count: number;
}

/**
 * ballGenerate function sets up environment and skill balls
 * @param {IEnvironmentSettings} environment 
 * @param {IBallSettings} starSettings 
 * @returns {Star[]} array of generated skill balls
 */
export function starGenerate(environment : IEnvironmentSettings, starSettings : IStarSettings) : Star[] {
    let tmp : Star[] = [];

    console.log(environment);
    console.log(starSettings);

    for(let i1 = 0; i1 < starSettings.count; i1++) {
        tmp.push(new Star(
            i1,
            starSettings.defaultRadius,
            randomPos(
                starSettings.defaultRadius,
                new Rect(environment.size.x, environment.size.y, 0, new Vector(0,0)),
                [],
                tmp
            ),
            Vector.mult(Vector.normalize(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)), 1),
            environment.skyJquery
        ));
    }
    
    return tmp;
}

/**
 * randomBallPos returns a random valid position to generate a skill ball
 * @param {number} radius: minimum distance between position vector and entities
 * @param {Rect} space: Rect define the settings of environment and valid range
 * @param {number[]} ignore: array of indexes of entities that are ignored from intercept checks
 * @param {Path[]} entities: list of entities in the system
 * @returns {Vector} vector position of valid position
 */
export function randomPos(radius : number, space : Rect, ignore : number[], entities : Path[]) : Vector {
    let circle : Circle;
    let pos :  Vector = new Vector(0, 0);
    
    circle = new Circle(radius * 1.5, pos);

    do{
        pos.x = Math.random() * (space.width - radius) + radius;
        pos.y = Math.random() * (space.height - radius) + radius;
    } while(interceptChecks(circle, entities, ignore).length > 0 && boundaryCheck(circle, space)) ;

    return pos;
}


function boundaryCheck(star : Circle, system : Rect) : boolean {
    let bufferZone = -5;
    if(star.p.x - star.radius + bufferZone < 0 || system.width < star.p.x + star.radius - bufferZone)
    {
        return false;
    }

    if(star.p.y - star.radius + bufferZone < 0 || system.height < star.p.y + star.radius - bufferZone)
    {
        return false;
    }

    return true;
}