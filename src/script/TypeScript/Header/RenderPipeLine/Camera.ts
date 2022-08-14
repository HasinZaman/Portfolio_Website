import { Matrix } from "../../Math/Matrix";
import { Vector } from "../../Math/Vector";

export class camera {
    private _pos: Matrix = new Matrix(4, 1);//vector (x,y,z,1)

    public get pos(): Vector {
        return new Vector(this._pos.getVal(0, 0), this._pos.getVal(0,1), this._pos.getVal(0, 2));
    }
    public set pos(newPos : Vector) {
        this._pos.setColumn(0, [newPos.x, newPos.y, newPos.z, 1]);
    }

    private _rot: Matrix = new Matrix(4, 1);//quaternion rotation of forward direction
    
    public get eulerRot(): Vector {
        throw new Error("Method not implemented");
    }
    public set eulerRot(newRot : Vector) {
        throw new Error("Method not implemented");
    }
    
    public get quaternionRot(): Matrix {
        throw new Error("Method not implemented");
    }
    public set quaternionRot(newRot : Matrix) {
        throw new Error("Method not implemented");
    }

    public get forwardVector() : Vector {
        throw new Error("Method not implemented");
    }
    public get normalVector(): Vector {
        throw new Error("Method not implemented");
    }

    public constructor() {
    }
}