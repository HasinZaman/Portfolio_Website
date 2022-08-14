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

    //expected : (1 for silhouette + 1 for shape)triangles * 3 vertices per triangle * 4 faces
    expect(v.length).toBe(2 * 3 * 4);

    for(let face = 0; face < 4; face++) {
        for(let i1 = 0; i1 < 2; i1++) {
            for(let i2 = 0; i2 < 3; i2++) {
                let actual : Vector = v[i2 + i1 * 3 + 6 * face];
                let expected : Vector = basePyramid[3 * face + i2].clone();

                vectorCheck(actual, expected);
            }
        }
    }
})

test("One level pyramid at (1, 5, -7), with base of (1,1) and height of 1", () => {
    let start : Vector = new Vector(1, 5, -7);

    let pyramid : Pyramid = new Pyramid(1, 1, 1, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    //expected : (1 for silhouette + 1 for shape)triangles * 3 vertices per triangle * 4 faces
    expect(v.length).toBe(2 * 3 * 4);

    for(let face = 0; face < 4; face++) {
        for(let i1 = 0; i1 < 2; i1++) {
            for(let i2 = 0; i2 < 3; i2++) {
                let actual : Vector = v[i2 + i1 * 3 + 6 * face];
                let expected : Vector = basePyramid[3 * face + i2].clone();

                vectorCheck(actual, Vector.add(expected, start));
            }
        }
    }
})

test("One level pyramid at (0, 0, 0), with base of (2,2) and height of 1", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 1, 2, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    //expected : (1 for silhouette + 1 for shape)triangles * 3 vertices per triangle * 4 faces
    expect(v.length).toBe(2 * 3 * 4);
    
    for(let face = 0; face < 4; face++) {
        for(let i1 = 0; i1 < 2; i1++) {
            for(let i2 = 0; i2 < 3; i2++) {
                let actual : Vector = v[i2 + i1 * 3 + 6 * face];
                let expected : Vector = basePyramid[3 * face + i2].clone();

                expected.x *= 2;
                expected.y *= 2;

                vectorCheck(actual, expected);
            }
        }
    }
})

test("One level pyramid at (0, 0, 0), with base of (2,2) and height of 2", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 2, 2, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    //expected : (1 for silhouette + 1 for shape)triangles * 3 vertices per triangle * 4 faces
    expect(v.length).toBe(2 * 3 * 4);

    for(let face = 0; face < 4; face++) {
        for(let i1 = 0; i1 < 2; i1++) {
            for(let i2 = 0; i2 < 3; i2++) {
                let actual : Vector = v[i2 + i1 * 3 + 6 * face];
                let expected : Vector = basePyramid[3 * face + i2].clone();

                vectorCheck(actual, Vector.mult(expected, 2));
            }
        }
    }
})

test("One level pyramid at (0, 0, 0), with base of (3,3) and height of 27", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(1, 27, 3, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    //expected : (1 for silhouette + 1 for shape)triangles * 3 vertices per triangle * 4 faces
    expect(v.length).toBe(2 * 3 * 4);

    for(let face = 0; face < 4; face++) {
        for(let i1 = 0; i1 < 2; i1++) {
            for(let i2 = 0; i2 < 3; i2++) {
                let actual : Vector = v[i2 + i1 * 3 + 6 * face];
                let expected : Vector = basePyramid[3 * face + i2].clone();
                
                expected.x *= 3;
                expected.y *= 3;
                expected.z *= 27;
                
                vectorCheck(actual, expected);
            }
        }
    }
})

test("One level pyramid at (2, 7, 7), with base of (2,2) and height of 2", () => {
    let start : Vector = new Vector(2, 7, 7);

    let pyramid : Pyramid = new Pyramid(1, 2, 2, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    //expected : (1 for silhouette + 1 for shape)triangles * 3 vertices per triangle * 4 faces
    expect(v.length).toBe(2 * 3 * 4);

    for(let face = 0; face < 4; face++) {
        for(let i1 = 0; i1 < 2; i1++) {
            for(let i2 = 0; i2 < 3; i2++) {
                let actual : Vector = v[i2 + i1 * 3 + 6 * face];
                let expected : Vector = basePyramid[3 * face + i2].clone();
                
                vectorCheck(actual, Vector.add(Vector.mult(expected, 2), start));
            }
        }
    }
})

test("Two level Pyramid at (0, 0, 0), with default settings", () => {
    let start : Vector = new Vector(0, 0, 0);

    let pyramid : Pyramid = new Pyramid(2, 1, 1, start);

    let v : Vector[] = pyramid.getVertices(new Vector(0, 0, -1));

    //expected : (1 for silhouette + 3 for shape)triangles * 3 vertices per triangle * 4 faces
    expect(v.length).toBe(4 * 3 * 4);

    for(let face = 0; face < 4; face++) {//checking silhouette vertices
        for(let i1 = 0; i1 < 3; i1++) {
            let actual : Vector = v[i1 + (4) * 3 * face];
            let expected : Vector = basePyramid[3 * face + i1].clone();

            vectorCheck(actual, Vector.mult(expected, 2));
        }
    }
})