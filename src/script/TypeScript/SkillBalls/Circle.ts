import { Vector } from "./Vector";
import { Path } from "./Path";

export class Circle implements Path
{
    radius: number;
    p: Vector;

    constructor(radius:number, center : Vector)
    {
        this.radius = radius;
        this.p = center;
    }

    public getPoint(t: number) : Vector {
        if(2 * Math.PI < t)
        {
            return this.getPoint(t % (2 * Math.PI));
        }

        if(t < 0)
        {
            return this.getPoint(0);
        }

        let tmp = new Vector(Math.cos(t), Math.sin(t));

        tmp = Vector.mult(tmp, this.radius);

        return Vector.add(this.p.clone(), tmp);
    }

    public getCenter(): Vector {
        return this.p.clone();
    }

    public getTangent(t : number): Vector {
        return new Vector(-1 * Math.sin(t), Math.cos(t));
    }
}