import { Vector } from "../../../Math/Vector";
import { equilateralTriangleHeight, triangleFractal } from "../Triangle";

//Triangle Fractal generation tests
{
    let testCount : number = 0;
    test(`Invalid Fractal ${testCount++}`, () => {
        expect(() => {triangleFractal(-1)}).toThrowError("Invalid level parameter. levels must be from 0 - postive infinity");
    })
    
    test(`Invalid Fractal ${testCount++}`, () => {
        expect(() => {triangleFractal(-2.5)}).toThrowError("Invalid level parameter. levels must be from 0 - postive infinity");
    })
    
    test(`Invalid Fractal ${testCount++}`, () => {
        expect(() => {triangleFractal(2.5)}).toThrowError("Invalid level parameter. levels must be from 0 - postive infinity");
    })
    
    test(`Invalid Fractal ${testCount++}`, () => {
        expect(() => {triangleFractal(1/3)}).toThrowError("Invalid level parameter. levels must be from 0 - postive infinity");
    })
}

test("One triangle at (0,0,0)", () => {
    let v : Vector[] = triangleFractal(1);

    expect(Vector.equal(v[0], new Vector(0, 0, 0))).toBe(true);
    expect(Vector.equal(v[1], new Vector( 0.5, 0, -1 * equilateralTriangleHeight))).toBe(true);
    expect(Vector.equal(v[2], new Vector(-0.5, 0, -1 * equilateralTriangleHeight))).toBe(true);
})

test("One triangle at (1,1,1)", () => {
    let start : Vector = new Vector(1,1,1);
    let v : Vector[] = triangleFractal(1, start);
    
    expect(Vector.equal(v[0], Vector.add(new Vector(0, 0, 0), start))).toBe(true);
    expect(Vector.equal(v[1], Vector.add(new Vector( 0.5, 0, -1 * equilateralTriangleHeight), start))).toBe(true);
    expect(Vector.equal(v[2], Vector.add(new Vector(-0.5, 0, -1 * equilateralTriangleHeight), start))).toBe(true);
})

test("One triangle at (25,-23,12)", () => {
    let start : Vector = new Vector(25,-23,12);
    let v : Vector[] = triangleFractal(1, start);

    expect(Vector.equal(v[0], Vector.add(new Vector(0, 0, 0), start))).toBe(true);
    expect(Vector.equal(v[1], Vector.add(new Vector( 0.5, 0, -1 * equilateralTriangleHeight), start))).toBe(true);
    expect(Vector.equal(v[2], Vector.add(new Vector(-0.5, 0, -1 * equilateralTriangleHeight), start))).toBe(true);
})

test("Two level fractal triangle at (0,0,0)", () => {
    let start : Vector = new Vector(0,0,0)

    let expected : Vector[] = [
        new Vector(0, 0, 0), new Vector(0.5, 0, -1 * equilateralTriangleHeight), new Vector(-0.5, 0, -1 * equilateralTriangleHeight),
        
        new Vector(0.5, 0, -1 * equilateralTriangleHeight), new Vector(1, 0, -2 * equilateralTriangleHeight), new Vector(0, 0, -2 * equilateralTriangleHeight),
        new Vector(-0.5, 0, -1 * equilateralTriangleHeight), new Vector(0, 0, -2 * equilateralTriangleHeight), new Vector(-1, 0, -2 * equilateralTriangleHeight),
    ];

    expected.forEach((val, i1) => {
        expected[i1] = Vector.add(start, val);
    })

    let v : Vector[] = triangleFractal(2, start);


    expect(v.length).toBe(expected.length);

    v.forEach(
        (vector : Vector, i) => {
            expect(vector.x).toBeCloseTo(expected[i].x)
            expect(vector.y).toBeCloseTo(expected[i].y)
            expect(vector.z).toBeCloseTo(expected[i].z)
        }
    )
})


test("Two level fractal triangle at (25,-23,12)", () => {
    let start : Vector = new Vector(25,-23,12)

    let expected : Vector[] = [
        new Vector(0, 0, 0), new Vector(0.5, 0, -1 * equilateralTriangleHeight), new Vector(-0.5, 0, -1 * equilateralTriangleHeight),
        
        new Vector(0.5, 0, -1 * equilateralTriangleHeight), new Vector(1, 0, -2 * equilateralTriangleHeight), new Vector(0, 0, -2 * equilateralTriangleHeight),
        new Vector(-0.5, 0, -1 * equilateralTriangleHeight), new Vector(0, 0, -2 * equilateralTriangleHeight), new Vector(-1, 0, -2 * equilateralTriangleHeight),
    ];

    expected.forEach((val, i1) => {
        expected[i1] = Vector.add(start, val);
    })

    let v : Vector[] = triangleFractal(2, start);


    expect(v.length).toBe(expected.length);

    v.forEach(
        (vector : Vector, i) => {
            expect(vector.x).toBeCloseTo(expected[i].x)
            expect(vector.y).toBeCloseTo(expected[i].y)
            expect(vector.z).toBeCloseTo(expected[i].z)
        }
    )
})