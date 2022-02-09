import { SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

export interface ISkillBallGenerator {
    (ballSize : Vector, enviormentSize : Vector, skillBox : JQuery) : SkillBall[]
}