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

test("One level pyramid at (0, 0, 0), with base of (1,1) and height of 1", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 1, 1, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        vectorCheck(actual, basePyramid[index]);
    })
})

test("One level pyramid at (1, 5, -7), with base of (1,1) and height of 1", () => {
    let start : Vector = new Vector(1, 5, -7);

    let pyramid : Pyramid = new Pyramid(1, 1, 1, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        vectorCheck(actual, Vector.add(basePyramid[index], start));
    })
})

test("One level pyramid at (0, 0, 0), with base of (2,2) and height of 1", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 1, 2, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        let expected : Vector = basePyramid[index].clone();
        expected.x *= 2;
        expected.y *= 2;
        vectorCheck(actual, expected);
    })
})

test("One level pyramid at (0, 0, 0), with base of (2,2) and height of 2", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 2, 2, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        vectorCheck(actual, Vector.mult(basePyramid[index], 2));
    })
})

test("One level pyramid at (0, 0, 0), with base of (3,3) and height of 27", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 27, 3, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        let expected : Vector = basePyramid[index].clone();
        expected.x *= 3;
        expected.y *= 3;
        expected.z *= 27;
        vectorCheck(actual, expected);
    })
})

test("One level pyramid at (2, 7, 7), with base of (2,2) and height of 2", () => {
    let start : Vector = new Vector(2, 7, 7);

    let pyramid : Pyramid = new Pyramid(1, 2, 2, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    expect(v.length).toBe(3 * 4); 

    v.forEach((actual: Vector, index: number) => {
        let expected : Vector = Vector.add(Vector.mult(basePyramid[index], 2), start)
        vectorCheck(actual, expected);
    })
})