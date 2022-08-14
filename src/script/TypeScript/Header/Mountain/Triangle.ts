import { Queue } from "queue-typescript";
import { Vector } from "../../Math/Vector";


export const equilateralTriangleHeight : number = Math.sqrt(1-0.5*0.5);

function triangle(start: Vector) : Vector[] {
    let vertices : Vector[] = new Array(3);

    vertices[0] = new Vector(0, 0, 0);

    vertices[1] = new Vector(0.5, 0, -1 * equilateralTriangleHeight);
    vertices[2] = new Vector(-0.5, 0, -1 * equilateralTriangleHeight);

    for(let i1 = 0; i1 < vertices.length; i1++) {
        vertices[i1] = Vector.add(vertices[i1], start);
    }

    return vertices;
}

export function triangleFractal(levels : number, start : Vector = new Vector(0,0,0)) : Vector[] {
    if (levels < 0 || levels %1 != 0) {
        throw new Error("Invalid level parameter. levels must be from 0 - postive infinity");
    }
    let tmp = start.clone();

    let vertices : Vector[] = [];

    let triangleStart : Queue<Vector> = new Queue<Vector>();
    triangleStart.append(tmp);
    
    let setVertices : Map<Vector, boolean> = new Map<Vector, boolean>();

    for(let i1 = 0; i1 < trianglesInFractal(levels); i1++) {
        let triangleVertices : Vector[] = triangle(triangleStart.dequeue());

        triangleVertices.forEach(vector => vertices.push(vector));

        let left = triangleVertices[2];
        let right = triangleVertices[1]

        if(!setVertices.has(right)) {
            setVertices.set(right, true);
            triangleStart.append(right);
        }

        if(!setVertices.has(left)) {
            setVertices.set(left, true);
            triangleStart.append(left);
        }
    }

    return vertices;
}

export function trianglesInFractal(levels : number) : number {
    return (levels * (levels + 1))/2;
}