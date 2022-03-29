import { Vector } from "./Vector";
import { Path } from "./Path";

/**
 * Line class define methods and variables to create line path
 * @extends {Path}
 */
export class Line implements Path {
    
    p: Vector;
    gradient: Vector;
    l : number;//negative number define an infinite line
    
    /**
     * @constructor creates Line object
     * @param {Vector} p: start position of line
     * @param {Vector} gradient: gradient of line
     * @param {number} length: length of line. length < 0 means an infinite length
     */
    constructor(p: Vector, gradient: Vector, length : number) {
        this.p = p;
        this.gradient = gradient;
        this.l = length;
    }

    /**
     * pointExist checks if a vector exists on the line
     * @param {Vector} v: position vector
     * @returns {boolean} boolean if position vector exists on the line
     */
    public pointExist(v: Vector) : boolean {
        let t1 = (v.x - this.p.x) / this.gradient.x;
        let t2 = (v.y - this.p.y) / this.gradient.y;

        if(this.l < 0) {
            return t1 === t2;
        }

        return t1 == t2 && 0 <= t1 && t1 <= this.l;
    }

    /**
     * getPoint gets a vector on line
     * @param {number} t: position on line
     * @returns {Vector} vector position on line
     */
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

    /**
     * getCenter returns the center of line
     * @returns {Vector} center of line or start point of line if length is infinite
     */
    public getCenter(): Vector {
        if(0 < this.l) {
            return this.p.clone();
        }
        return this.getPoint(this.l/2)
    }
}