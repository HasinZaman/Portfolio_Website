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

    private static defaultAngle : number = Math.atan2(0.5, Math.sqrt(0.5));

    public constructor(layers: number, heightScale: number, baseScale: number, position: Vector) {
        this.center = position.clone();

        for(let i1 = 0; i1 < 4; i1++) {
            this._faces.push(new Face(this.center, layers));
            this._faces[i1].rotate(Pyramid.defaultAngle, Math.PI/2 * i1)
            this._faces[i1].scale(baseScale, baseScale, heightScale);
        }
    }

    public getVertices(cameraDirection : Vector) : Vector[] {
        let visibleVectices : Vector[] = [];

        this._faces
            .filter(
                face => Vector.dot(face.normal, cameraDirection) <= 0
            )
            .forEach(
                face => face.vertices.forEach(vertex => {visibleVectices.push(vertex)})
            )

        return visibleVectices;
    }
}