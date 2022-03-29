import { Vector } from "./Vector";
import { Path } from "./Path";

/**
 * Circle class define methods and variables to create circle path
 * @extends {Path}
 */
export class Circle implements Path
{
    radius: number;
    p: Vector;

    /**
     * @constructor creates a circle path
     * @param {number} radius: radius of circle
     * @param {Vector} center: vector position of center of circle
     */
    constructor(radius:number, center : Vector)
    {
        this.radius = radius;
        this.p = center;
    }

    /**
     * getPoint method returns a vector position on circle
     * @param {number} t: postive number that defines a vector position on circle 
     * @returns {Vector} vector position on circle
     */
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

    /**
     * getCenter method returns center of circle path
     * @returns {Vector} center position of circle
     */
    public getCenter(): Vector {
        return this.p.clone();
    }

    /**
     * getTangent method gets the tangent at point getPoint(t)
     * @param {number} t: postive number that defines a vector position on circle 
     * @returns {Vector} vector slope of tangent line at getPoint(t)
     */
    public getTangent(t : number): Vector {
        return new Vector(-1 * Math.sin(t), Math.cos(t));
    }
}