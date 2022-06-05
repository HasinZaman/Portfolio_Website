import {Matrix} from "../Matrix"

//test matrix creation

test("Matrix Construction: setVal 1", () => {
    let m: Matrix = new Matrix(1,1);

    m.setVal(0,0, 1)

    expect(m.getVal(0,0)).toBe(1);

    m.setVal(0,0, 23)

    expect(m.getVal(0,0)).toBe(23);
});

test("Matrix Construction: setVal 2", () => {
    let m: Matrix = new Matrix(2, 2);


    m.setVal(0, 0, 1);
    m.setVal(0, 1, 2);
    m.setVal(1, 0, 3);
    m.setVal(1, 1, 4);

    expect(m.getVal(0,0)).toBe(1);
    expect(m.getVal(0,1)).toBe(2);
    expect(m.getVal(1,0)).toBe(3);
    expect(m.getVal(1,1)).toBe(4);
})

test("Matrix Construction: invalid setVal", () => {
    let m: Matrix = new Matrix(1, 1);
    
    expect(() => {m.getVal(1, 0)}).toThrowError("column out of range");
    expect(() => {m.setVal(1, 0, 1)}).toThrowError("column out of range");
    expect(() => {m.getVal(-1, 0)}).toThrowError("column out of range");
    expect(() => {m.setVal(-1, 0, 1)}).toThrowError("column out of range");
    
    expect(() => {m.getVal(0, 1)}).toThrowError("row out of range");
    expect(() => {m.setVal(0, 1, 1)}).toThrowError("row out of range");
    expect(() => {m.getVal(0, -1)}).toThrowError("row out of range");
    expect(() => {m.setVal(0, -1, 1)}).toThrowError("row out of range");
})

test("Matrix Construction: setRow 1", () => {
    let m: Matrix = new Matrix(2, 2);

    m.setVal(0, 0, 0);
    m.setVal(0, 1, 0);
    m.setVal(1, 0, 0);
    m.setVal(1, 1, 0);


    m.setRow(0, [1, 2]);

    expect(m.getVal(0,0)).toBe(1);
    expect(m.getVal(1,0)).toBe(2);
    expect(m.getVal(0,1)).toBe(0);
    expect(m.getVal(1,1)).toBe(0);

    m.setRow(1, [3, 4]);

    expect(m.getVal(0,0)).toBe(1);
    expect(m.getVal(1,0)).toBe(2);
    expect(m.getVal(0,1)).toBe(3);
    expect(m.getVal(1,1)).toBe(4);
})

test("Matrix Construction: invalid setRow", () => {
    let m: Matrix = new Matrix(2, 2);

    expect(() => {m.setRow(0, [1])}).toThrowError("Invalid size");
    expect(() => {m.setRow(0, [1,2,3])}).toThrowError("Invalid size");
    expect(() => {m.setRow(-1, [1,2])}).toThrowError("row out of range");
    expect(() => {m.setRow(2, [1,2])}).toThrowError("row out of range");
})

test("Matrix Construction: setCol 1", () => {
    let m: Matrix = new Matrix(2, 2);

    m.setVal(0, 0, 0);
    m.setVal(0, 1, 0);
    m.setVal(1, 0, 0);
    m.setVal(1, 1, 0);

    m.setColumn(0, [1, 2]);

    expect(m.getVal(0,0)).toBe(1);
    expect(m.getVal(1,0)).toBe(0);
    expect(m.getVal(0,1)).toBe(2);
    expect(m.getVal(1,1)).toBe(0);

    m.setColumn(1, [3, 4]);

    expect(m.getVal(0,0)).toBe(1);
    expect(m.getVal(1,0)).toBe(3);
    expect(m.getVal(0,1)).toBe(2);
    expect(m.getVal(1,1)).toBe(4);
})

test("Matrix Construction: invalid setCol", () => {
    let m: Matrix = new Matrix(2, 2);

    expect(() => {m.setColumn(0, [1])}).toThrowError("Invalid size");
    expect(() => {m.setColumn(0, [1,2,3])}).toThrowError("Invalid size");
    expect(() => {m.setColumn(-1, [1,2])}).toThrowError("column out of range");
    expect(() => {m.setColumn(3, [1,2])}).toThrowError("column out of range");
})

//matrix string representation
test("Matrix toString", () => {
    let m : Matrix = new Matrix(2,2);

    m.setRow(0,[1,2]);
    m.setRow(1,[3,4]);

    expect(m.toString()).toBe("1 2 \n3 4 \n");
})

//matrix multiplication

test("Matrix Multiplication: 1", ()=> {
    let m1 : Matrix = new Matrix(2, 3);

    m1.setRow(0, [1, 2, 3]);
    m1.setRow(1, [4, 5, 6]);

    let m2 : Matrix = new Matrix(3, 2);

    m2.setRow(0, [10, 11]);
    m2.setRow(1, [20, 21]);
    m2.setRow(2, [30, 31]);

    let actualResult: Matrix = Matrix.mult(m1, m2);

    expect(actualResult.columnCount).toBe(2);
    expect(actualResult.rowCount).toBe(2);

    let expectResult: Matrix = new Matrix(2,2);
    expectResult.setRow(0, [140, 146]);
    expectResult.setRow(1, [320, 335]);

    for(let x = 0; x < 2; x++) {
        for(let y = 0; y < 2; y++) {
            expect(actualResult.getVal(x,y)).toBe(expectResult.getVal(x,y));
        }
    }
})

test("Matrix Multiplication: 2", ()=> {
    let m1 : Matrix = new Matrix(2, 2);

    m1.setRow(0, [3, 4]);
    m1.setRow(1, [2, 1]);

    let m2 : Matrix = new Matrix(2, 2);

    m2.setRow(0, [1, 5]);
    m2.setRow(1, [3, 7]);

    let actualResult: Matrix = Matrix.mult(m1, m2);
    
    expect(actualResult.columnCount).toBe(2);
    expect(actualResult.rowCount).toBe(2);

    let expectResult: Matrix = new Matrix(2,2);
    expectResult.setRow(0, [15, 43]);
    expectResult.setRow(1, [5, 17]);

    for(let x = 0; x < 2; x++) {
        for(let y = 0; y < 2; y++) {
            expect(actualResult.getVal(x,y)).toBe(expectResult.getVal(x,y));
        }
    }
})

test("Matrix Multiplication: invalid", ()=> {
    let m1 : Matrix = new Matrix(2, 1);

    m1.setRow(0, [1]);
    m1.setRow(1, [4]);

    let m2 : Matrix = new Matrix(3, 3);

    m2.setRow(0, [10, 11, 12]);
    m2.setRow(1, [20, 21, 22]);
    m2.setRow(2, [30, 31, 32]);

    expect(() => {Matrix.mult(m2, m1)}).toThrowError("m1 & m2 have invalid size");
})