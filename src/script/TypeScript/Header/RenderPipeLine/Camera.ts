import { HTMLElem } from "../../HTMLBuilder/HTMLBuilder";
import { Matrix } from "../../Math/Matrix";
import { interceptCheck } from "../../Math/Paths/Intercept";
import { Line } from "../../Math/Paths/Line";
import { Rect } from "../../Math/Paths/Rect";
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
        return this._rot;
    }
    public set rot(q : Quaternion) {
        this._rot.w = q.w;
        this._rot.x = q.x;
        this._rot.y = q.y;
        this._rot.z = q.z;
    }

    private _width: number = 1;

    public get width(): number {
        return this._width;
    }
    public set width(val: number) {
        if(val <= 0) {
            throw new Error("Width must be greater than 0");
        }
        this._width = val;
    }

    private _height : number = 1;

    public get height(): number {
        return this._height;
    }
    public set height(val: number) {
        if(val <= 0) {
            throw new Error("Height must be greater than 0");
        }
        this._height = val;
    }

    public get forwardVector() : Vector {
        return Matrix.vectorMult(this._rot.rotMatrix, new Vector(1, 0, 0));
    }
    public get normalVector(): Vector {
        return Matrix.vectorMult(this._rot.rotMatrix, new Vector(0, 0, 1));
    }

    /**
     * constructor defines characteristics of camera
     * @param {number} width 
     * @param {number} height 
     */
    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    /**
     * draw method gets a set of svg draw instructions to render a scene
     * @param {Renderable[]} scene is an array of Renderable objects that will be rendered
     * @param {{width: number, height: number}} screenSize is object that defines the screen size
     * @returns 
     */
    public draw(scene: Renderable[], screenSize : {width: number, height: number}): HTMLElem {
        let triangles: Vector[][] = [];
        let source: Map<Vector[], Renderable> = new Map<Vector[], Renderable>();

        let screenPos: Map<Vector, Vector> = new Map<Vector, Vector>()

        scene.forEach(obj => {
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
        let unwrap = (val: Vector | undefined) : Vector => {
            if(val !== undefined) {
                return val;
            }

            throw new Error("Failed to unwrap");
        }

        triangles = triangles.filter(//filter out triangles not visible
            triangle => {
                let tmp : Rect = new Rect(
                    this.width,
                    this.height,
                    0,
                    Vector.sub(
                        new Vector(0,0),
                        Vector.div(
                            new Vector(this.width, this.height),
                            2
                        )
                    )
                )

                for(let i1 = 0; i1 < 3; i1++) {

                    let start = unwrap(screenPos.get(triangle[i1 % 3]));
                    let end = unwrap(screenPos.get(triangle[(i1 + 1) % 3]));

                    {
                        let inXRange = this.width/-2 <= start.x && start.x <= this.width/2;
                        let inYRange = this.height/-2 <= start.y && start.y <= this.height/2;

                        if(inXRange && inYRange) {
                            return true;
                        }
                    }

                    {
                        let line = new Line(start, Vector.sub(end, start).normalize(), Vector.dist(Vector.sub(end, start)));

                        if(interceptCheck(tmp, line)){
                            return true;
                        }
                    }
                }

                return false;
            }
        ).sort(//sort triangles based on dist from camera
            (t1: Vector[], t2: Vector[]) => {
                return min(t2) - min(t1)
            }
        )
        triangles.forEach(//re map triangle from 0,0)-screen size
            triangle => {
                triangle.forEach(
                    vertex => {
                        let tmp = unwrap(screenPos.get(vertex));

                        let topLeft = Vector.div(new Vector(-1 * this.width, -1 * this.height), 2);

                        tmp = Vector.sub(tmp, topLeft);

                        tmp.x = tmp.x / this.width * screenSize.width
                        tmp.y = tmp.y / this.height * screenSize.height

                        //flip y
                        tmp.y = screenSize.height - tmp.y;

                        screenPos.set(vertex, tmp);
                    }
                )
            }
        )
        
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
        return new Vector(v.y, v.z);
    }

    private perspective(v: Vector): Vector {
        throw new Error("Method not implemented")
    }
}