export class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public clone() : Vector
    {
        return new Vector(this.x, this.y, this.z);
    }

    public normalize() : void {
        let dist = Vector.dist(this);

        this.x = this.x / dist;
        this.y = this.y / dist;
        this.z = this.z / dist;
    }

    public static add(v1:Vector, v2:Vector) : Vector
    {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    public static sub(v1:Vector, v2:Vector) : Vector
    {
        return Vector.add(v1, Vector.mult(v2, -1));
    }

    public static mult(v:Vector, n:number) : Vector
    {
        return new Vector(v.x * n, v.y * n, v.z * n);
    }
    
    public static div(v:Vector, n:number) : Vector
    {
        return new Vector(v.x / n, v.y / n, v.z / n);
    }
    
    public static dot(v1:Vector, v2:Vector) : number
    {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    public static cross(v1:Vector, v2:Vector) : Vector
    {
        return new Vector(
            v1.y*v2.z - v2.y*v1.z,
            v1.z*v2.x - v2.z*v1.x,
            v1.x*v2.y - v2.x*v1.y
        );
    }

    public static dist(v : Vector) : number
    {
        return Math.sqrt(Vector.dot(v, v));
    }

    public static normalize(v:Vector) : Vector {
        let dist = Vector.dist(v);
        return Vector.div(v, dist);
    }

    public static projection(v : Vector, proj : Vector) : Vector {
        let v1 : Vector = proj;
        return Vector.mult(v1, Vector.dot(v,v1)/Vector.dot(v1,v1));
    }
}