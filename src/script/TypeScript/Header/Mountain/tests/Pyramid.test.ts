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
    vertices[0], vertices[1], vertices[3],
    vertices[0], vertices[2], vertices[1],
    vertices[0], vertices[4], vertices[2],
    vertices[0], vertices[3], vertices[4]
]

function vectorCheck(expected: Vector, actual: Vector) {
    expect(expected.x).toBeCloseTo(actual.x);
    expect(expected.y).toBeCloseTo(actual.y);
    expect(expected.z).toBeCloseTo(actual.z);
}

test("One level pyramid at (0, 0, 0)", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(2, 1, 1, start);

    let expected : Vector[] = [
        new Vector(0,   0,      0),
        new Vector(0.5, height, 0.5),
        new Vector(-0.5,height, 0.5),
        new Vector(0.5, height, -0.5),
        new Vector(-0.5,height, -0.5)
    ]

    let v : Vector[] = pyramid.getVertices(new Vector(0, -1, 0));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        console.log(actual);
        vectorCheck(actual, basePyramid[index]);
    })
})