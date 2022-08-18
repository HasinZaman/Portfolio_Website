import { HTMLElem } from "../../HTMLBuilder/HTMLBuilder";
import { Matrix } from "../../Math/Matrix";
import { Quaternion } from "../../Math/Quaternion";
import { Vector } from "../../Math/Vector";
import { Renderable } from "./Renderable";

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

    public draw(objs: Renderable[]): HTMLElem {
        let triangles: Vector[][] = [];
        let source: Map<Vector[], Renderable> = new Map<Vector[], Renderable>();

        let screenPos: Map<Vector, Vector> = new Map<Vector, Vector>()

        objs.forEach(obj => {
            let objTriangles: Vector[] = obj.getTriangles(this.rot.dirVector, this.pos);

            if(objTriangles.length % 3 !== 0) {
                throw new Error("Invalid triangles");
            }

            for(let i1 = 0; i1 < objTriangles.length; i1+=3) {
                let triangle : Vector[] = [];
                
                for(let i2 = 0; i2 < 3; i2++) {
                    let v: Vector = Matrix.vectorMult(//rotate base on camera rotation
                        this._rot.rotMatrix,
                        Vector.sub(objTriangles[i1+i2], this.pos)//move vertex-camera.pos
                    );
                    triangle.push(
                        v
                    );

                    //turn vertex 3D => screen pos 2D                    
                    screenPos.set(v, this.orthogonal(v))
                }

                triangles.push(triangle);
                source.set(triangle, obj);
            }
        })
        
        let min = (t: Vector[]) : number => {
            let min : number = t[0].y;

            t.forEach(v => {
                if(v.y < min) {
                    min = v.y;
                }
            })
            return min;
        }

        //sort triangles based on dist from camera
        triangles.sort((t1: Vector[], t2: Vector[]) => {return min(t2) - min(t1)})
        
        //get instructions

        let instructions: HTMLElem = new HTMLElem("g");
        

        triangles.forEach(
            triangle => {
                let r: Renderable | undefined = source.get(triangle);
                let inst: HTMLElem | undefined = r?.draw(triangle[0], triangle[1], triangle[2], screenPos);

                if(inst == undefined) {
                    throw new Error("Undefined error");
                }

                instructions.addChild(inst);
            })
        
        return instructions;
    }

    private orthogonal(v: Vector): Vector {
        return new Vector(v.x, v.y);
    }

    private perspective(v: Vector): Vector {
        throw new Error("Method not implemented")
    }
}