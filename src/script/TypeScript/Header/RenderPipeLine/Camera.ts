import { Matrix } from "../../Math/Matrix";
import { Quaternion } from "../../Math/Quaternion";
import { Vector } from "../../Math/Vector";

export class camera {
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