/**
 * Vector class defines methods and variables to create 3d/2d vector
 */
export class Vector {
    x: number;
    y: number;
    z: number;

    /**
     * @constructor creates Vector class
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x: number, y: number, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * clone method creates a deep copy of Vector
     * @returns {Vector} deep copy of Vector
     */
    public clone() : Vector
    {
        return new Vector(this.x, this.y, this.z);
    }

    /**
     * normalize method turns Vector into a vector with a magnitude of 1
     * @returns {Vector} method returns self
     */
    public normalize() : Vector {
        let dist = Vector.dist(this);

        this.x = this.x / dist;
        this.y = this.y / dist;
        this.z = this.z / dist;

        return this;
    }

    /**
     * add method returns vector with sum of two vectors
     * V = v1 + v2
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector} Vector with the sum of v1 + v2
     */
    public static add(v1:Vector, v2:Vector) : Vector
    {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * sub method returns the vector with difference of two vectors 
     * V = v1 - v2
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector} Vector with the difference of v1 - v2
     */
    public static sub(v1:Vector, v2:Vector) : Vector
    {
        return Vector.add(v1, Vector.mult(v2, -1));
    }

    /**
     * mult method returns the vector product of scalar multiplication
     * V = n * v
     * @param {Vector} v 
     * @param {number} n 
     * @returns {Vector} Vector with the product of n * v1
     */
    public static mult(v:Vector, n:number) : Vector
    {
        return new Vector(v.x * n, v.y * n, v.z * n);
    }
    
    /**
     * div method returns the vector quotient of scalar multiplication
     * V = n^-1 * v
     * @param {Vector} v 
     * @param {number} n 
     * @returns {Vector} Vector with the product of n^-1 * v
     */
    public static div(v:Vector, n:number) : Vector
    {
        return new Vector(v.x / n, v.y / n, v.z / n);
    }
    
    /**
     * dot method returns the dot product of two vectors
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {number} dot product of v1 and v2
     */
    public static dot(v1:Vector, v2:Vector) : number
    {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * cross method returns the cross product of two vectors
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector} cross product of v1 and v2
     */
    public static cross(v1:Vector, v2:Vector) : Vector
    {
        return new Vector(
            v1.y*v2.z - v2.y*v1.z,
            v1.z*v2.x - v2.z*v1.x,
            v1.x*v2.y - v2.x*v1.y
        );
    }

    /**
     * dist method returns the magnitude of a vector
     * @param {Vector} v 
     * @returns {number} magnitude of a vector
     */
    public static dist(v : Vector) : number
    {
        return Math.sqrt(Vector.dot(v, v));
    }

    /**
     * normalize method return a normalized vector without manipulating input vector
     * @param {Vector} v 
     * @returns normalized vector of v
     */
    public static normalize(v:Vector) : Vector {
        return v.clone().normalize();
    }

    /**
     * projection method returns a vector projected on a target vector
     * @param {Vector} v vector that will be projected on projection vector
     * @param {Vector} proj vector that will be projected on
     * @returns {Vector} projected vector
     */
    public static projection(v : Vector, proj : Vector) : Vector {
        let v1 : Vector = proj;
        return Vector.mult(v1, Vector.dot(v,v1)/Vector.dot(v1,v1));
    }
}