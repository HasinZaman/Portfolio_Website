import { SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

export interface ISkillBallGenerator {
    (ballRadius : number, enviormentSize : Vector, skillBox : JQuery) : SkillBall[]
}