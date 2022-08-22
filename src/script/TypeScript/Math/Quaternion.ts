import { Matrix } from "./Matrix";
import { Vector } from "./Vector";

export class Quaternion extends Matrix {

    public get w() : number {
        return this.getVal(0, 0);
    }
    public set w(val : number) { 
        this.setVal(0, 0, val);
    }

    public get x() : number {
        return this.getVal(0, 1);
    }
    public set x(val : number) { 
        this.setVal(0, 1, val);
    }
    
    public get y() : number {
        return this.getVal(0, 2);
    }
    public set y(val : number) { 
        this.setVal(0, 2, val);
    }
    
    public get z() : number {
        return this.getVal(0, 3);
    }
    public set z(val : number) { 
        this.setVal(0, 3, val);
    }

    public get dirVector(): Vector {
        return Matrix.vectorMult(this.rotMatrix, new Vector(1, 0, 0));
    }
    public set dirVector(v1: Vector) {
        let v0: Vector = new Vector(1, 0, 0);
        v1 = v1.normalize();
        
        let cross: Vector = Vector.cross(v0, v1);
        cross.normalize();

        let w : number = Math.sqrt(Math.pow(Vector.dist(v0), 2) * Math.pow(Vector.dist(v1), 2)) + Vector.dot(v0, v1);

        this.w = w;
        this.x = cross.x;
        this.y = cross.y;
        this.z = cross.z;

        this.normalize();
    }

    public get rotMatrix(): Matrix {
        let m : Matrix = new Matrix(3,3);

        m.setRow(0, [
            1 - 2 * (this.y * this.y + this.z * this.z),
                2 * (this.x * this.y - this.w * this.z),
                2 * (this.w * this.y + this.x * this.z)
        ]);
        m.setRow(1, [
                2 * (this.x * this.y + this.w * this.z),
            1 - 2 * (this.x * this.x + this.z * this.z),
                2 * (this.y * this.z - this.w * this.x)
        ]);
        m.setRow(2, [
            2 * (this.x * this.z - this.w * this.y),
            2 * (this.w * this.x + this.y * this.z),
        1 - 2 * (this.x * this.x + this.y * this.y)
        ]);

        return m;
    }

    private get dist() : number {
        return Math.sqrt(this.w*this.w + this.x*this.x + this.y*this.y + this.z*this.z);
    }
    
    public constructor() {
        super(4, 1);

        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    }
    
    public setDir(rotationVec: Vector, angle: number) {
        let w : number;
        let x : number;
        let y : number;
        let z : number;

        //convert angle: [0, 2*Pi] -> [-1, 1]
        {
            let tmp = angle % (2 * Math.PI);
            tmp /= 2 * Math.PI;

            tmp -= 1;

            w = tmp;
        }

        //uses w to find x,y,z
        {
            // x' = x / (x + y + z + w)
            // y' = y / (x + y + z + w)
            // z' = z / (x + y + z + w)
            // w' * (x + y + z + w) = w
            // w' * x + w' * y + w' * z + w' * w = w
            // w' * x + w' * y + w' * z = w - w' * w
            // w' * x + w' * y + w' * z = w * (1 - w')
            // (w' * x + w' * y + w' * z) / (1 - w') = w
            // w = (w' * x + w' * y + w' * z) / (1 - w')

            let tmp = (w * rotationVec.x + w * rotationVec.y + w * rotationVec.z) / (1 - w);

            tmp = rotationVec.x + rotationVec.y + rotationVec.z + tmp;

            x = rotationVec.x / tmp;
            y = rotationVec.y / tmp;
            z = rotationVec.z / tmp;
        }

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        this.normalize();
    }

    public normalize() : Quaternion {
        let dist : number = this.dist;

        this.w /= dist;
        this.x /= dist;
        this.y /= dist;
        this.z /= dist;

        return this;
    }
}