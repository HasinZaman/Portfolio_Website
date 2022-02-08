import { Vector } from "./Vector";

export interface Path{
    getPoint(t: number) : Vector
    getCenter() : Vector
}