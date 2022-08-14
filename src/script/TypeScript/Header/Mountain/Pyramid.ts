import { Matrix } from "../../Math/Matrix";
import { Vector } from "../../Math/Vector";
import { triangleFractal } from "./Triangle";

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

    public constructor(start: Vector, levels: number){
        this._normal = new Vector(0, 1, 0);

        this._vertices = triangleFractal(levels, start);
    }

    private translate(delta : Vector) : void {
        for(let i1 = 0; i1 < this._vertices.length; i1++) {
            this._vertices[i1] = Vector.add(this._vertices[i1], delta);
        }
    }

    private matrixModify(m : Matrix) {
        let tmp : Vector = this._vertices[0].clone();

        this.translate(Vector.mult(tmp, -1));

        for(let i1 = 0; i1 < this._vertices.length; i1++) {
            this._vertices[i1] = Matrix.vectorMult(m, this._vertices[i1]);
        }

        this.translate(tmp);
    }

    public scale(xScale: number = 1, yScale: number = 1, zScale: number = 1) {
        this.matrixModify(Matrix.scale(xScale, yScale, zScale));
    }

    public rotate(pitch: number = 0, yaw: number = 0){

        let rotationMatrix : Matrix = Matrix.mult(
                Matrix.rotationZ(yaw),
                Matrix.rotationX(pitch)
        )
        this.matrixModify(rotationMatrix);
        this._normal = Matrix.vectorMult(rotationMatrix, this._normal);
    }
}

export class Pyramid {
    private _faces : Face[] = [];
    private center : Vector;

    private static defaultAngle : number = 0.6154797086703873;

    public constructor(layers: number, heightScale: number, baseScale: number, position: Vector) {
        this.center = position.clone();
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

    public getVertices(cameraDirection : Vector) : Vector[] {
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