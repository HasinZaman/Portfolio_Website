import { Vector } from "../../../Math/Vector"
import { Pyramid } from "../Pyramid"


let height = -1 * Math.sqrt(0.5);

let vertices : Vector[] = [
    new Vector(0,       0,      0),
    new Vector(0.5,     0.5,    height),
    new Vector(-0.5,    0.5,    height),
    new Vector(0.5,     -0.5,   height),
    new Vector(-0.5,    -0.5,   height)
]

let basePyramid : Vector[] = [
    vertices[0], vertices[1], vertices[2],
    vertices[0], vertices[2], vertices[4],
    vertices[0], vertices[4], vertices[3],
    vertices[0], vertices[3], vertices[1]
]

function vectorCheck(expected: Vector, actual: Vector) {
    expect(expected.x).toBeCloseTo(actual.x);
    expect(expected.y).toBeCloseTo(actual.y);
    expect(expected.z).toBeCloseTo(actual.z);
}

test("One level pyramid at (0, 0, 0)", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 1, 1, new Vector(0, 0, 0));

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        vectorCheck(actual, basePyramid[index]);
    })
})