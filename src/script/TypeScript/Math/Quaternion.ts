import { Interpolation } from "./Interpolation";
import { Matrix } from "./Matrix";
import { Vector } from "./Vector";

export class Quaternion extends Matrix {

    /**
     * interpolation static method is a higher order function that returns a interpolation function 
     * @param {Interpolation<number>} wAlgorithm: interpolation function to be used on the w axis
     * @param {Interpolation<number>} xAlgorithm: interpolation function to be used on the x axis
     * @param {Interpolation<number>} yAlgorithm: interpolation function to be used on the y axis
     * @param {Interpolation<number>} zAlgorithm: interpolation function to be used on the z axis
     * @returns {Interpolation<Quaternion>} interpolation function that takes a number and interpolates between different quaternions
     */
     public static interpolation(wAlgorithm: Interpolation<number>, xAlgorithm: Interpolation<number>, yAlgorithm: Interpolation<number>, zAlgorithm: Interpolation<number>) : Interpolation<Quaternion> {
        return (n: number): Quaternion => {
            let final = new Quaternion();

            final.w = wAlgorithm(n);
            final.x = xAlgorithm(n);
            final.y = yAlgorithm(n);
            final.z = zAlgorithm(n);

            return final;
        }
    }

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
        let sum = 0;

        for(let i = 0; i < this.rowCount; i++) {
            let val = this.getVal(0, i);
            sum+=val*val
        }

        return Math.sqrt(sum);
    }
    
    /**
     * constructor generates a quaternion at (1,0,0,0). Where q = (w,x,y,z). The quaternion is represented by a 1 by 4 matrix.
     */
    public constructor() {
        super(4, 1);

        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    }
    
    /**
     * setDir method defines a quaternion using a rotation vector an angle that rotates around the rotation vector
     * @param {Vector} rotationVec 
     * @param {number} angle is a number in radians
     */
    public setDir(rotationVec: Vector, angle: number) {
        rotationVec = rotationVec.normalize();

        let w : number;
        let x : number;
        let y : number;
        let z : number;

        //convert angle: [0, 2*Pi] -> [-1, 1]
        {
            let tmp = angle % (2 * Math.PI);//angle = [0, 2*pi]
            
            tmp /= 2 * Math.PI;//angle = [0, 1]

            tmp -= 0.5;//angle = [-0.5, 0.5]

            tmp *= 2;//angle = [-1, 1]

            w = tmp;
        }

        //uses w to find x,y,z
        {
            /* 
            let q be normalized quaternion

            q = (w,x,y,z)

            let q' be the initial non normalized quaternion

            q' = (w',x',y',z')

            let w be q.w value & is derived in the previous section
            let x',y',z' be known

            therefore,
            ||q|| = 1
            ||q'|| = (w'^2 + x'^2 + y'^2 + z'^2)^0.5
            
            1: w = w' * ||q'||^(-1)
            2: x = x' * ||q'||^(-1)
            3: y = y' * ||q'||^(-1)
            4: z = z' * ||q'||^(-1)
            
            therefore, from equation 1
            w = w' * ||q'||^(-1)
            or, w * ||q'|| = w'
            or, w * (w'^2 + x'^2 + y'^2 + z'^2)^0.5 = w'
            or, w^2 * (w'^2 + x'^2 + y'^2 + z'^2) = w'^2
            or, w^2 * w'^2 + w^2 * (x'^2 + y'^2 + z'^2) = w'^2
            or, w^2 * (x'^2 + y'^2 + z'^2) = w'^2 - w^2 * w'^2
            or, w^2 * (x'^2 + y'^2 + z'^2) = w'^2 * (1 - w^2)
            or, w^2 * (x'^2 + y'^2 + z'^2) * (1 - w^2)^(-1) = w'^2
            or, (w^2 * (x'^2 + y'^2 + z'^2) * (1 - w^2)^(-1))^0.5 = w'
            or, w'= (w^2 * (x'^2 + y'^2 + z'^2) * (1 - w^2)^(-1))^0.5

            since, w' has now been derived. Therefore, ||q'|| can be calculated & the remaining unknowns can be derived from equations 2-4.
            
            since there is a discontinuous at w = 1
            then, lim w -> 0 then x = 0, y = 0, z = 0
            */
            if(1 - w*w === 0) {
                x = 0;
                y = 0;
                z = 0;
            }
            else {
                let tmp = Math.sqrt(
                    w*w * (rotationVec.x * rotationVec.x + rotationVec.y * rotationVec.y + rotationVec.z * rotationVec.z) / (1 - w*w))

                tmp = Math.sqrt(rotationVec.x * rotationVec.x + rotationVec.y * rotationVec.y + rotationVec.z * rotationVec.z + tmp * tmp);
                

                x = rotationVec.x / tmp;
                y = rotationVec.y / tmp;
                z = rotationVec.z / tmp;
            }
        }

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
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