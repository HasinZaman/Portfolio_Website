import { Vector } from "./Vector";
import { Path } from "./Path";

export class Line implements Path {
    
    p: Vector;
    gradient: Vector;
    l : number;//negative number define an infinte line
    
    constructor(p: Vector, gradient: Vector, length : number) {
        this.p = p;
        this.gradient = gradient;
        this.l = length;
    }

    public pointExist(v: Vector) : boolean {
        let t1 = (v.x - this.p.x) / this.gradient.x;
        let t2 = (v.y - this.p.y) / this.gradient.y;

        if(this.l < 0) {
            return t1 === t2;
        }

        return t1 == t2 && 0 <= t1 && t1 <= this.l;
    }

    public getPoint(t: number) : Vector
    {
        if(0 <= this.l) {
            if(this.l < t)
            {
                return this.getPoint(t % this.l);
            }

            if(t <= 0)
            {
                return this.p.clone();
            }
        }
        
        return Vector.add(this.p, Vector.mult(this.gradient, t));
    }

    public getCenter(): Vector {
        if(0 < this.l) {
            return this.p.clone();
        }
        return this.getPoint(this.l/2)
    }
}