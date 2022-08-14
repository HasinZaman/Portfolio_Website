import { Queue } from "queue-typescript";
import { Vector } from "../../Math/Vector";

/**
 * equilateralTriangleHeight constant defines the height of a triangle
 */
export const equilateralTriangleHeight : number = Math.sqrt(1 - 0.5*0.5);

/**
 * triangle function find the Vectors required in order to create triangle at start vector
 * @param {Vector} start 
 * @returns {Vector[]} Three Vectors required to make a Triangle on the XZ plane
 */
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

/**
 * triangleFractal function finds the vectors required to make a triangular fractal on the XZ plane
 * 
 *   start position ->
 *                   /\
 *                  /__\
 *                 /\  /\
 *             __ /__\/__\
 *            |  /\  /\  /\
 * 1 level -> |_/__\/__\/__\
 * @param {number} levels 
 * @param {Vector} start 
 * @returns {Vector[]} array of Vectors that define triangles required to be draw the triangleFractal. The array is formatted in the form: [v0, v1, v2, ..., vn-2, vn-1, vn]; where (v0, v1, v2) ... (vn-2, vn-1, vn) define vertices required to make triangle.
 */
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

/**
 * trianglesInFractal function finds the number of triangles defined by [triangleFractal]{@link triangleFractal}  function with a certain number of levels
 * @param {number} levels 
 * @returns {number} number of triangles
 */
export function trianglesInFractal(levels : number) : number {
    return (levels * (levels + 1))/2;
}