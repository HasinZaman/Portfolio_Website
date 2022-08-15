import { Matrix } from "../../Math/Matrix";
import { Quaternion } from "../../Math/Quaternion";
import { Vector } from "../../Math/Vector";

export class Camera {
    private _pos: Matrix = new Matrix(4, 1);//vector (x,y,z,1)

    public get pos(): Vector {
        return new Vector(this._pos.getVal(0, 0), this._pos.getVal(0,1), this._pos.getVal(0, 2));
    }
    public set pos(newPos : Vector) {
        this._pos.setColumn(0, [newPos.x, newPos.y, newPos.z, 1]);
    }

    private _rot: Quaternion = new Quaternion();//quaternion rotation of forward direction [w, x, y, z]

    public get rot(): Quaternion {
        return this._rot.clone() as Quaternion;
    }

    public set rot(q : Quaternion) {
        this._rot = q;
    }

    public get forwardVector() : Vector {
        return Matrix.vectorMult(this._rot.rotMatrix, new Vector(1, 0, 0));
    }
    public get normalVector(): Vector {
        return Matrix.vectorMult(this._rot.rotMatrix, new Vector(0, 0, 1));
    }

    public constructor() {
    }
}