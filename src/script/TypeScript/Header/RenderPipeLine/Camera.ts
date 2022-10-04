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

    private _nearClipping : number = 1;
    public get nearClipping(): number {
        return this._nearClipping;
    }
    public set nearClipping(val: number) {
        if(val < 0) {
            throw new Error("Near clipping plane must be greater than 0")
        }
        if(this.farClipping <= val) {
            throw new Error("near clipping plane cannot be greater than far clipping plane")
        }
        this._nearClipping = val;
    }

    private _farClipping : number = 2;
    public get farClipping() : number {
        return this._farClipping;
    }
    public set farClipping(val: number) {
        if(val <= this.nearClipping) {
            throw new Error(`Far clipping plane must be greater than near clipping plane ${this.nearClipping}`);
        }
        this._farClipping = val;

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
    public constructor(width: number, height: number, nearClipping: number, farClipping: number) {
        this.width = width;
        this.height = height;
        this.nearClipping = nearClipping;
        this.farClipping = farClipping;
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

        let relativePosToScreenPosMap: Map<Vector, Vector> = new Map<Vector, Vector>()
        let relativePosToOriginalPosMap: Map<Vector, Vector> = new Map<Vector, Vector>()

        scene.forEach(renderable => {
            let objTriangles: Vector[] = renderable.getTriangles(this.rot.dirVector, this.pos);

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
                    {
                        let tmp = this.orthogonal(v);

                        relativePosToScreenPosMap.set(v, tmp);
                    }

                    relativePosToOriginalPosMap.set(v, objTriangles[i1+i2]);
                    
                }

                triangles.push(triangle);
                source.set(triangle, renderable);
            }
        })
        
        let max = (t: Vector[]) : number => {
            let max : number = t[0].x;

            t.forEach(v => {
                if(v.x > max) {
                    max = v.x;
                }
            })
            return max;
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
                    1,
                    1,
                    0,
                    new Vector(-1, -1)
                )

                for(let i1 = 0; i1 < 3; i1++) {

                    let start = unwrap(relativePosToScreenPosMap.get(triangle[i1 % 3]));
                    let end = unwrap(relativePosToScreenPosMap.get(triangle[(i1 + 1) % 3]));
                    {//check start point is in the viewing rect
                        let inXRange = (-1 < start.x) && (start.x < 1);
                        let inYRange = (-1 < start.y) && (start.y < 1);

                        if(inXRange && inYRange) {
                            return true;
                        }
                    }
                    {//checking if the line from start & end point intersect the viewing rect
                        let dir = Vector.sub(
                            end,
                            start
                        );

                        let line = new Line(
                            start,
                            dir.normalize(),
                            Vector.dist(dir)
                        );

                        if(interceptCheck(tmp, line)){
                            return true;
                        }
                    }
                }
                
                {//checking if points of rect in the triangle
                    for(let x = -1; x <= 1; x+=2) {
                        for(let y = -1; x <= 1; x+=2) {
                            let point = new Vector(x, y);

                            if(this.pointInTriangle(triangle, point)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        ).sort(//sort triangles based on dist from camera
            (t1: Vector[], t2: Vector[]) => {
                return max(t2) - max(t1)
            }
        )

        triangles.forEach(//re map triangle from (0,0)-screen size
            triangle => {
                triangle.forEach(
                    vertex => {
                        let tmp = unwrap(relativePosToScreenPosMap.get(vertex));

                        tmp.x = (tmp.x + 1)/2;
                        tmp.y = (tmp.y + 1)/2;

                        tmp.x = tmp.x * screenSize.width;
                        tmp.y = tmp.y * screenSize.height;
                        
                        relativePosToScreenPosMap.set(vertex, tmp);
                    }
                )
            }
        )
        
        //get instructions
        let instructions: HTMLElem = new HTMLElem("g");
        triangles.forEach(
            triangle => {
                
                let r: Renderable | undefined = source.get(triangle);

                let inst: HTMLElem | undefined = r?.draw(
                    {
                        t0: unwrap(relativePosToScreenPosMap.get(triangle[0])),
                        t1: unwrap(relativePosToScreenPosMap.get(triangle[1])),
                        t2: unwrap(relativePosToScreenPosMap.get(triangle[2]))
                    },
                    {
                        t0: unwrap(relativePosToOriginalPosMap.get(triangle[0])),
                        t1: unwrap(relativePosToOriginalPosMap.get(triangle[1])),
                        t2: unwrap(relativePosToOriginalPosMap.get(triangle[2]))
                    }                    
                );

                if(inst == undefined) {
                    throw new Error("Undefined error");
                }

                instructions.addChild(inst);
            })
            
        return instructions;
    }
    /**
     * pointInTriangle method is a utility method to check if a point in n dimensional point exists in the plane of an n dimensional triangle
     * @param {Vector[]} triangle vertices of a triangle
     * @param {Vector} point is a vector that is being checked to be in triangle
     * @returns {boolean}
     */
    private pointInTriangle(triangle: Vector[], point: Vector) : boolean {
        let subTrianglesVectors : Vector[][] = [];

        for(let i1 = 0; i1 < 3; i1++) {
            subTrianglesVectors.push([triangle[i1 % 3], triangle[(i1 + 1) % 3], point]);
        }

        let triangleSideLength : number[]  = triangle.map(
            (point: Vector, index: number) => {
                return Vector.dist(Vector.sub(point, triangle[(index + 1) % 3]));
            }
        )

        let areaCalc = (a: number, b: number, c: number) : number => {
            return 0.25 * Math.sqrt(
                (a + (b + c)) *
                (c - (a - b)) *
                (c + (a - b)) *
                (a + (b - c))
            );
        }

        let area = 0;
        
       subTrianglesVectors.map(
            (triangle: Vector[]) => {
                let dists : number[] = [];
                for(let i1 = 0; i1 < 3; i1++) {
                    dists.push(Vector.dist(Vector.sub(triangle[i1 % 3], triangle[(i1 + 1) % 3])));
                }
                return dists.sort().reverse();;
            }
        ).forEach(
            (triangleSideLength: number[]) => {
                area+= areaCalc(triangleSideLength[0], triangleSideLength[1], triangleSideLength[2])
            }
        )
        
        return areaCalc(triangleSideLength[0], triangleSideLength[1], triangleSideLength[2]) + 0.0000001 >= area;
    }

    /**
     * orthogonal method converts a vector in 3d space onto an 2d plane using an orthogonal projection
     * @param {Vector} v 
     * @returns {Vector} 2d vector of orthogonal projection of v on plane. Such that the returned 2d vector exists from [[-1,-1],[1,1]]
     */
    private orthogonal(v: Vector): Vector {
        let vector : Matrix = new Matrix(4,1);
        vector.setColumn(0, [v.y, v.z, v.x, 1]);

        let r = this.width/2;
        let l = -1 * r;

        let t = this.height/2;
        let b = -1*t;

        let n = this.nearClipping;
        let f = this.farClipping;

        let orthogonalMatrix : Matrix = new Matrix(4, 4);
        orthogonalMatrix.setRow(0, [2/(r - l), 0, 0, -1 * (r + l)/(r - l)]);
        orthogonalMatrix.setRow(1, [0, -2/(t - b), 0, -1 * (t + b)/(t - b)]);
        orthogonalMatrix.setRow(2, [0, 0,-2/(f - n), -1 * (f + n)/(f - n)]);
        orthogonalMatrix.setRow(3, [0, 0, 0, 1]);

        let tmp = Matrix.mult(orthogonalMatrix, vector);

        return new Vector(tmp.getVal(0, 0), tmp.getVal(0, 1));
    }

    /**
     * perspective method converts a vector in 3d space onto an 2d plane using an perspective projection
     * @param {Vector} v 
     * @returns {Vector} 2d vector of perspective projection of v on plane
     */
    private perspective(v: Vector): Vector {
        let vector : Matrix = new Matrix(4,1);
        vector.setColumn(0, [v.y, v.z, v.x, 1]);

        let r = this.width/2;
        let l = -1 * r;

        let t = this.height/2;
        let b = -1*t;

        let n = this.nearClipping;
        let f = this.farClipping;

        let perspectiveMatrix : Matrix = new Matrix(4, 4);
        perspectiveMatrix.setRow(0, [2 * n / (r - l), 0, (r + l), 0]);
        perspectiveMatrix.setRow(1, [0, 2 * n / (t - b), (t + b) / (t - b), 0]);
        perspectiveMatrix.setRow(2, [0, 0, -1 * (f + n) / (f - n), -2 * f * n / (f - n)]);
        perspectiveMatrix.setRow(3, [0, 0, -1, 0]);
        
        let tmp = Matrix.mult(perspectiveMatrix, vector);

        let scale = tmp.getVal(0, 3);

        for(let i1 = 0; i1 < 3; i1++) {
            let val = tmp.getVal(0, i1);
            tmp.setVal(0, i1, val/scale);
        }

        return new Vector(tmp.getVal(0, 0), tmp.getVal(0, 1));
    }
}