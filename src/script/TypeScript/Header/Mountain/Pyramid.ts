import { Matrix } from "../../Math/Matrix";
import { Vector } from "../../Math/Vector";
import { triangleFractal, trianglesInFractal } from "./Triangle";

/**
 * Face class handles the state and management of triangular faces on a pyramid
 */
class Face {
    private _normal: Vector;

    public get normal() : Vector {
        return this._normal.clone();
    }

    private _vertices: Vector[];

    public get vertices(): Vector[] {
        let tmp : Vector[] = [];

        this._vertices.forEach(val => tmp.push(val.clone()))

        return tmp;
    }

    public get silhouette(): Vector[] {
        let tmp : Vector[] = [];

        tmp.push(this._vertices[0].clone());//top most vertex

        tmp.push(this._vertices[this.rightMostVertexIndex()].clone());//rightmost vertex
        
        tmp.push(this._vertices[this._vertices.length - 1].clone());//leftmost vertex

        return tmp;
    }

    /**
     * rightMostVertexIndex method is used to find the second vertex of silhouette of face
     * 
     * 
     *       1st vertex
     *          /\
     *         /  \
     *        /    \
     *       /      \
     *      /        \
     *     /__________\
     * 3rd vertex     2nd vertex
     * 
     * 
     * @returns {number} index of vertex that stores the second vertex of silhouette
     */
    private rightMostVertexIndex() : number {
        let t : number = this._vertices.length / 3;//get number of triangles

        let n : number = -1 + Math.sqrt(1 + 8 * t);
        n /= 2;//get number of layers

        let nPrev : number = n - 1;

        let prevTriangles : number = nPrev * (nPrev + 1);
        prevTriangles /= 2;//numbers of triangles in the prev layer

        let index : number = prevTriangles * 3 + 1;//get index right most vertex in right most triangle on bottom layer

        return index;
    }

    /**
     * @constructor creates a triangular fractal face for pyramid
     * @param {Vector} start vector is the position of the top/tip vertex of the pyramid
     * @param {number} levels defines the number triangle levels on pyramid
     */
    public constructor(start: Vector, levels: number){
        this._normal = new Vector(0, 1, 0);

        this._vertices = triangleFractal(levels, start);
    }

    /**
     * translate method moves the face in 3d space
     * @param {Vector} delta 
     */
    public translate(delta : Vector) : void {
        for(let i1 = 0; i1 < this._vertices.length; i1++) {
            this._vertices[i1] = Vector.add(this._vertices[i1], delta);
        }
    }

    /**
     * matrixModify applies a transformation matrix on all the vertices of face
     * @param {Matrix} m
     */
    private matrixModify(m : Matrix) : void {
        let tmp : Vector = this._vertices[0].clone();

        this.translate(Vector.mult(tmp, -1));

        for(let i1 = 0; i1 < this._vertices.length; i1++) {
            this._vertices[i1] = Matrix.vectorMult(m, this._vertices[i1]);
        }

        this.translate(tmp);
    }

    /**
     * scale method applies a scale matrix transformation on vertices of face
     * @param {number} xScale 
     * @param {number} yScale 
     * @param {number} zScale 
     */
    public scale(xScale: number = 1, yScale: number = 1, zScale: number = 1) : void {
        this.matrixModify(Matrix.scale(xScale, yScale, zScale));
    }

    /**
     * rotate method applies a rotation matrix transformation on the Z & X axis
     * @param {number} pitch 
     * @param {number} yaw 
     */
    public rotate(pitch: number = 0, yaw: number = 0) : void{

        let rotationMatrix : Matrix = Matrix.mult(
                Matrix.rotationZ(yaw),
                Matrix.rotationX(pitch)
        )
        this.matrixModify(rotationMatrix);
        this._normal = Matrix.vectorMult(rotationMatrix, this._normal);
    }
}

/**
 * Pyramid class defines the management and state of vertices of a pyramid. This class is used in the generation of mountains on the header
 */
export class Pyramid {
    private _faces : Face[] = [];
    private center : Vector;

    /**
     * defaultAngle is the radian of the pitch required to make triangular faces of pyramid
     * 
     * Pyramid cross section along the ZX axis
     *         _______
     *        /|\     |
     *       /   \    |
     *      /  |  \   |<- h = sqrt(0.5) 
     *     /       \  |
     *    /    |    \ |
     *   /___________\|
     *   |     |
     *   |-----|<- b = 0.5
     * 
     * 
     *  defaultAngle = Math.atan2(b,h)
     */
    private static defaultAngle : number = 0.6154797086703873;

    /**
     * @constructor creates faces of Pyramid with specific characteristics
     * 
     * Pyramid cross section along the ZX axis
     *   start position ->________
     *                   /\      |
     *                  /__\     |
     *                 /\  /\    | <- height
     *             __ /__\/__\   |
     *            |  /\  /\  /\  |
     * 1 layer -> |_/__\/__\/__\_|
     *              |          |
     *              |__________| <- base width
     * 
     * @param {number} layers
     * @param {number} height
     * @param {number} base 
     * @param {Vector} start 
     */
    public constructor(layers: number, height: number, base: number, start: Vector) {
        this.center = start.clone();
        
        let defaultHeight : number = layers * Math.sqrt(0.5);
        let defaultBase : number = trianglesInFractal(layers) - trianglesInFractal(layers - 1);

        for(let i1 = 0; i1 < 4; i1++) {
            this._faces.push(new Face(this.center, layers));
            this._faces[i1].rotate(Pyramid.defaultAngle, Math.PI/2 * i1)

            this._faces[i1].scale(base / defaultBase, base / defaultBase, height/ defaultHeight);
        }
    }

    /**
     * getVertices method returns an array of all visible triangles required to draw pyramid
     * @param {Vector} cameraDirection direction vector of camera
     * @returns {Vector[]} array of Vectors that define triangles required to be drawn from specific camera orientation. The array can be partitioned in n equally sized partitions of visible faces. Each face partition is formatted in the following format: [v0, v1, v2, v3, v4, v5, ..., vn-2, vn-1, vn]; where (v0, v1, v2) are the triangles required to draw the silhouette for face & (v3, v4, v5)...(vn-2, vn-1, vn) are the triangles required to draw each level
     */
    public getTriangles(cameraDirection : Vector) : Vector[] {
        let visibleVectices : Vector[] = [];

        this._faces
            .filter(
                face => Vector.dot(face.normal, cameraDirection) <= 0
            )
            .forEach(
                face => {
                    face.silhouette.forEach(vertex => visibleVectices.push(vertex))
                    face.vertices.forEach(vertex => visibleVectices.push(vertex))
                }
            )

        return visibleVectices;
    }
}