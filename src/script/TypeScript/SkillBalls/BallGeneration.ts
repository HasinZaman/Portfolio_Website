import { Circle } from "./Circle";
import { interceptChecks } from "./Intercept";
import { Path } from "./Path";
import { Rect } from "./Rect";
import { SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

export interface IEnvironmentSettings {
    getEnvironmentSize:  () => Vector;
    getSkillBox:  () => JQuery;
}

export interface IBallSettings {
    getBallRadius: () => number;
    getSkills: () => string[],
    getConnections: () => number[][]
}

export function ballGenerate(environment : IEnvironmentSettings, ballInput : IBallSettings) : SkillBall[] {
    let tmp : SkillBall[] = [];

    let skillName : string[] = ballInput.getSkills();
    let skillConnections : number[][] = ballInput.getConnections();

    console.log(ballInput.getSkills())
    console.log(ballInput.getConnections())

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

export function randomBallPos(radius : number, space : Rect, ignore : number[], entites : Path[]) : Vector {
    let circle : Circle;
    let pos :  Vector = new Vector(0, 0);
    
    circle = new Circle(radius, pos);

    do{
        pos.x = Math.random() * space.getWidth();
        pos.y = Math.random() * space.getHeight();
    } while(interceptChecks(circle, entites, ignore).length > 0) ;

    return pos;
}