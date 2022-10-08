import { AttrVal, HTMLElem } from "../../HTMLBuilder/HTMLBuilder";
import { Matrix } from "../../Math/Matrix";
import { Quaternion } from "../../Math/Quaternion";
import { Vector } from "../../Math/Vector";
import { Renderable } from "../RenderPipeLine/Renderable";

/**
 *  Star is a class handles the state of triangles required to render a single star
 * 
 * 
 *  where,
 *      v00, v01, v10, v11 are the vertex of triangle
 * 
 *      t0, t1 are the triangles of star
 *      t0 = [v00, v01, v11]
 *      t1 = [v00, v11, v10]
 * 
 *      (cx, cy) are the central point of the star & vertex are defined in local space relative to (cx, cy)
 * 
 *  v10____________v11
 *    |           /|
 *    | t0       / |
 *    |         /  |
 *    |        /   |
 *    |       /    |
 *    |      /     |
 *    |     X<─┐   |
 *    |    /   |   |
 *    |   /(cx, cy)|
 *    |  /         |
 *    | /       t1 |
 *    |/___________|
 *  v00            v01
 */
export class Star implements Renderable {
    private static get defaultSize() : number{
        return 1;
    }

    private _pos: Vector = new Vector(0, 0);

    public get pos(): Vector {
        return this._pos;
    }
    public set pos(val: Vector) {
        this._pos = val;
    }

    private _rot: number = 0;

    public get rot(): number {
        return this._rot;
    }
    public set rot(val: number) {
        this._rot = val % (Math.PI * 2);
        this.rotMatrix = Matrix.rotationX(this._rot);
    }

    private rotMatrix: Matrix = Matrix.rotationX(0);

    private _size: number = 1;
    
    public get size(): number {
        return this._size;
    }
    public set size(val: number) {
        if(val < 0) {
            throw new Error("size must be greater than 0");
        }

        this._size = val;
    }

    private _normal: Vector;

    private get v00(): Vector {
        return Vector.add(
            Vector.mult(
                Matrix.vectorMult(
                    this.rotMatrix,
                    new Vector(0, -1, -1)
                ),
                this.size/2
            ),
            this.pos
        );
    }
    private get v01(): Vector {
        return Vector.add(
            Vector.mult(
                Matrix.vectorMult(
                    this.rotMatrix,
                    new Vector(0, -1, 1)
                ),
                this.size/2
            ),
        this.pos);
    }
    private get v10(): Vector {
        return Vector.add(
            Vector.mult(
                Matrix.vectorMult(
                    this.rotMatrix,
                    new Vector(0, 1, -1)
                ),
                this.size/2
            ),
            this.pos
        );
    }
    private get v11(): Vector {
        return Vector.add(
            Vector.mult(
                Matrix.vectorMult(
                    this.rotMatrix,
                    new Vector(0, 1, 1)
                ),
                this.size/2
            ),
            this.pos
        );
    }

    public constructor(pos: Vector, rot: number, size: number = Star.defaultSize, normal: Vector) {
        this.pos = pos;
        this.rot = rot;
        this.size = size;
        this._normal = normal;
    }

    public getTriangles(cameraDir: Vector, cameraPos: Vector): Vector[] {
        let pointingTowardsCamera = Vector.dot(this._normal, cameraDir) < 0;
        let inFrontOfCamera = Vector.dot(Vector.sub(this.pos, cameraPos).normalize(), cameraDir) > 0;

        if(!pointingTowardsCamera || !inFrontOfCamera) {
            // console.info(
            //     "FAIL\n",
            //     "normal:", this._normal, "\n",
            //     "cameraDir:", cameraDir, "\n",
            //     "pointingTowardsCamera:", pointingTowardsCamera, "\n",
            //     "starPos:", this.pos, "\n",
            //     "rel Pos:", Vector.sub(this.pos, cameraPos),"\t normalized:", Vector.sub(this.pos, cameraPos).normalize(), "\n",
            //     "inFrontOfCamera:", inFrontOfCamera
            // );
            return [];
        }

        // console.info(
        //     "Star Vertices",
        //     [this.v00, this.v10, this.v11, this.v00, this.v11, this.v01].map(
        //         v => Vector.add(
        //                 Matrix.vectorMult(
        //                     Matrix.rotationX(this.rot),
        //                     v
        //                 ),
        //                 this.pos
        //             )
        //         )
        // )

        return [this.v00, this.v10, this.v11, this.v00, this.v11, this.v01];
    }
    public draw(screenTriangle: { t0: Vector; t1: Vector; t2: Vector; }, originalSpaceTriangle: { t0: Vector; t1: Vector; t2: Vector; }): HTMLElem {
        let triangle = [screenTriangle.t0, screenTriangle.t1, screenTriangle.t2]
        let instruction: HTMLElem = new HTMLElem("polygon");

        let points: AttrVal[] = instruction.get("points");
        
        triangle.forEach(p => {
            points.push(new AttrVal(`${p.x},${p.y} `))
        })
        
        instruction.get("fill")
            .push(new AttrVal("white"));
        instruction.get("stroke")
            .push(new AttrVal("White"));
        instruction.get("stroke-width")
            .push(new AttrVal("0.5"));

        return instruction;
    }

}