import { Vector } from "../../Math/Vector";
import { triangleFractal } from "./Triangle";

class Face {
    private _normal: Vector;

    public get normal() : Vector {
        return this._normal.clone();
    }

    private set normal(val :  Vector) {
        this._normal = val;
    }

    _vertices: Vector[];

    public get vertices(): Vector[] {
        let tmp : Vector[] = [];

        this._vertices.forEach(val => tmp.push(val.clone()))

        return tmp;
    }

    public constructor(start: Vector, levels: number){
        this._normal = new Vector(0, 1, 0);

        this._vertices = triangleFractal(levels, new Vector(0,0,0));
    }

    public scale(xScale : number = 1, yScale : number = 1) {

    }

    public rotate(roll: number = 0, pitch: number = 0, yaw: number = 0){

    }
}

class Pyramid {
    private faces : Face[] = [];
}