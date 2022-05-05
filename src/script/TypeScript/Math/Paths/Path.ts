import { Vector } from "../Vector";

/**
 * Path interface define the required methods to define a path in 2 dimensions
 */
export interface Path{
    /**
     * getPoint method should return a Vector on the path
     * @param {number} t: distance from start point of path 
     * @returns {Vector} position vector of at t
     */
    getPoint(t: number) : Vector
    /**
     * getCenter method returns center point of Path. The get center method is essential for collision detection
     * @returns {Vector} position vector of center of path
     */
    getCenter() : Vector
}