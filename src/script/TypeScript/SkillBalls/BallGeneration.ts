import { Circle } from "./Circle";
import { interceptChecks } from "./Intercept";
import { Path } from "./Path";
import { Rect } from "./Rect";
import { SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

let skills : string[] = ["html", "css", "javascript"];
let connections : number[][] = [[0, 1], [1, 2]];

export function ballGenerate(ballRadius : number, enviormentSize : Vector, skillBox : JQuery) : SkillBall[] {
    let tmp : SkillBall[] = [];

    for(let i1 = 0; i1 < skills.length; i1++) {
        tmp.push(new SkillBall(
            i1,
            ballRadius,
            randomBallPos(
                ballRadius,
                new Rect(enviormentSize.x, enviormentSize.y,0, new Vector(0,0)),
                [],
                tmp),
            Vector.mult(Vector.normalize(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)), 100),
            1,
            skillBox,
            skills[i1]
        ));
    }

    connections.forEach(index => {
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