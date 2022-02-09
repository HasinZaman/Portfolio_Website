import { SkillBall } from "./SkillBall";
import { Vector } from "./Vector";


export function ballGenerate(ballSize : Vector, enviormentSize : Vector, skillBox : JQuery) : SkillBall[] {
    let tmp = [
        new SkillBall(1, ballSize.x / 2 , new Vector((enviormentSize.x - ballSize.x)/4, (enviormentSize.y - ballSize.y)/4), Vector.mult(new Vector(0.5,1), 100), 1, skillBox, "javascript"),
        new SkillBall(2, ballSize.x / 2 , new Vector(3*(enviormentSize.x - ballSize.x)/4, 3*(enviormentSize.y - ballSize.y)/4), Vector.mult(new Vector(1,0.5), 100), 1, skillBox, "css"),
        new SkillBall(3, ballSize.x / 2 , new Vector(500, 300), Vector.mult(new Vector(1,1), 100), 1, skillBox, "html")
    ];

    SkillBall.addEdge(tmp[0],tmp[1])
    SkillBall.addEdge(tmp[1],tmp[2])
    console.log(SkillBall.edgeList);
    return tmp;
}