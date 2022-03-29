import { Circle } from "./Circle";
import { interceptChecks } from "./Intercept";
import { Path } from "./Path";
import { Rect } from "./Rect";
import { SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

/**
 * IEnvironmentSettings is an interface that defines key setting for an environment
 */
export interface IEnvironmentSettings {
    getEnvironmentSize:  () => Vector;
    getSkillBox:  () => JQuery;
}

/**
 * IBallSettings is an interface that defines key setting for skill balls in an environment
 */
export interface IBallSettings {
    getBallRadius: () => number;
    getSkills: () => string[],
    getConnections: () => number[][]
}

/**
 * ballGenerate function sets up environment and skill balls
 * @param {IEnvironmentSettings} environment 
 * @param {IBallSettings} ballInput 
 * @returns {SkillBall[]} array of generated skill balls
 */
export function ballGenerate(environment : IEnvironmentSettings, ballInput : IBallSettings) : SkillBall[] {
    let tmp : SkillBall[] = [];

    let skillName : string[] = ballInput.getSkills();
    let skillConnections : number[][] = ballInput.getConnections();

    for(let i1 = 0; i1 < skillName.length; i1++) {
        tmp.push(new SkillBall(
            i1,
            ballInput.getBallRadius(),
            randomBallPos(
                ballInput.getBallRadius(),
                new Rect(environment.getEnvironmentSize().x, environment.getEnvironmentSize().y,0, new Vector(0,0)),
                [],
                tmp),
            Vector.mult(Vector.normalize(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)), 100),
            1,
            environment.getSkillBox(),
            skillName[i1]
        ));
    }

    skillConnections.forEach(index => {
        SkillBall.addEdge(tmp[index[0]], tmp[index[1]])
    });
    
    console.log(SkillBall.edgeList);
    
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
export function randomBallPos(radius : number, space : Rect, ignore : number[], entities : Path[]) : Vector {
    let circle : Circle;
    let pos :  Vector = new Vector(0, 0);
    
    circle = new Circle(radius, pos);

    do{
        pos.x = Math.random() * space.width;
        pos.y = Math.random() * space.height;
    } while(interceptChecks(circle, entities, ignore).length > 0) ;

    return pos;
}