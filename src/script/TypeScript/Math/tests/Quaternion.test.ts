import { Matrix } from "../Matrix";
import { Quaternion } from "../Quaternion";
import { Vector } from "../Vector";

function matrixCheck(expected: Matrix, actual: Matrix) {
    expect(expected.rowCount).toBe(actual.rowCount);
    expect(expected.columnCount).toBe(actual.columnCount);

    for(let y = 0; y < expected.rowCount; y++) {
        for(let x = 0; x < expected.columnCount; x++) {
            expect(expected.getVal(x, y)).toBeCloseTo(actual.getVal(x, y));
        }
    }
}

function vectorCheck(expected: Vector, actual: Vector) {
    expect(actual.x).toBeCloseTo(expected.x);
    expect(actual.y).toBeCloseTo(expected.y);
    expect(actual.z).toBeCloseTo(expected.z);
}

test("Rotation matrix & direction vector check at Quaternion(1, 0, 0, 0)", () => {
    let q : Quaternion = new Quaternion();
    
    q.x = 0;
    q.y = 0;
    q.z = 0;
    q.w = 1;

    q.normalize();

    expect(q.x).toBe(0);
    expect(q.y).toBe(0);
    expect(q.z).toBe(0);
    expect(q.w).toBe(1);

    let expectedRotMatrix : Matrix = new Matrix(3, 3);

    expectedRotMatrix.setRow(0, [1, 0, 0]);
    expectedRotMatrix.setRow(1, [0, 1, 0]);
    expectedRotMatrix.setRow(2, [0, 0, 1]);

    matrixCheck(expectedRotMatrix, q.rotMatrix);

    let expectedDirVector: Vector = Matrix.vectorMult(expectedRotMatrix, new Vector(1, 0, 0));
    vectorCheck(expectedDirVector, q.dirVector)
})

test("Rotation matrix & direction vector check at Quaternion(-0.5281095941123474, 0, 0.849176222351104, 0)", () => {
    let q : Quaternion = new Quaternion();
    
    q.x = 0;
    q.y = 0.849176222351104;
    q.z = 0;
    q.w = -0.5281095941123474;

    q.normalize();

    expect(q.x).toBeCloseTo(0);
    expect(q.y).toBeCloseTo(0.849176222351104);
    expect(q.z).toBeCloseTo(0);
    expect(q.w).toBeCloseTo(-0.5281095941123474);

    let expectedRotMatrix : Matrix = new Matrix(3, 3);

    expectedRotMatrix.setRow(0, [-0.44220051321298337, 0, -0.8969162202313959]);
    expectedRotMatrix.setRow(1, [0, 1, 0]);
    expectedRotMatrix.setRow(2, [0.8969162202313959, 0, -0.44220051321298337]);

    matrixCheck(expectedRotMatrix, q.rotMatrix);

    let expectedDirVector: Vector = Matrix.vectorMult(expectedRotMatrix ,new Vector(1, 0, 0));
    vectorCheck(expectedDirVector, q.dirVector)
})

test("Rotation matrix & direction vector check at Quaternion(-0.5281582070780787, -0.5171549110972854, 0.32809828015456405, -0.588176185155133)", () => {
    let q : Quaternion = new Quaternion();
    
    q.x = -0.5171549110972854;
    q.y =  0.32809828015456405;
    q.z = -0.588176185155133;
    q.w = -0.5281582070780787;

    q.normalize();

    expect(q.x).toBeCloseTo(-0.5171549110972854);
    expect(q.y).toBeCloseTo( 0.32809828015456405);
    expect(q.z).toBeCloseTo(-0.588176185155133);
    expect(q.w).toBeCloseTo(-0.5281582070780787);

    let expectedRotMatrix : Matrix = new Matrix(3, 3);

    expectedRotMatrix.setRow(0, [0.09280058755194376, -0.9606554326041299,   0.2617808067032152]);
    expectedRotMatrix.setRow(1, [0.28194488498610665, -0.22680085371137304, -0.9322384108080741]);
    expectedRotMatrix.setRow(2, [0.95493200427055800,  0.16032003169898773,  0.2498046329751521]);

    matrixCheck(expectedRotMatrix, q.rotMatrix);

    let expectedDirVector: Vector = Matrix.vectorMult(expectedRotMatrix ,new Vector(1, 0, 0));
    vectorCheck(expectedDirVector, q.dirVector)
})