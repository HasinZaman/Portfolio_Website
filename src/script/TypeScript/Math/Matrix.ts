import { Vector } from "./Vector";

/**
 * Matrix class defines methods and variables to create Matrix
 */
export class Matrix {
    private values : number[];

    private dim : number[];

    public get columnCount(): number {
        return this.dim[1];
    };

    public get rowCount(): number {
        return this.dim[0];
    };

    /**
     * add method returns a matrix with the sum of two matrixes
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @returns {Matrix} Matrix with the sum of m1 + m2
     */
    public static add(m1: Matrix, m2: Matrix) : Matrix {
        if(!(m1.rowCount == m2.rowCount && m1.columnCount == m2.columnCount)) {
            throw new Error("m1 & m2 have invalid size");
        }

        let result : Matrix = new Matrix(m1.rowCount, m1.columnCount);

        for(let i1 = 0; i1 < result.values.length; i1++) {
            result.values[i1] = m1.values[i1] + m2.values[i1];
        }

        return result;
    }

    /**
     * sub method returns a matrix with the difference of two matrixes
     * @param {Matrix} m1 
     * @param {Matrix} m2 
     * @returns {Matrix} Matrix with the difference of m1-m2
     */
    public static sub(m1: Matrix, m2: Matrix) : Matrix {
        return this.add(m1, this.mult(m2, -1));
    }

    /**
     * mult method returns the Matrix of the product of a scalar value or another matrix
     * @param {Matrix} v1
     * @param {Matrix | number} v2
     * @return {Matrix} Matrix product of v1 * v2
     */
    public static mult(v1: Matrix, v2: Matrix | number) : Matrix {

        if(typeof v2 === "number") {
            return this.scalarMult(v1, v2);
        }

        return this.matrixMult(v1, v2);
    }

    /**
     * matrixMult method multiplies two matrixes
     * @param {Matrix} m1 
     * @param {Matrix} m2 
     * @returns {Matrix} Matrix product of two matrixes
     */
    private static matrixMult(m1: Matrix, m2: Matrix) : Matrix {
        if(!(m1.columnCount == m2.rowCount)) {
            throw new Error("m1 & m2 have invalid size");
        }

        let result : Matrix = new Matrix(m1.rowCount, m2.columnCount);

        for(let x = 0; x < result.columnCount; x++) {

            let colTmp = m2.getColumn(x);

            for(let y = 0; y < result.rowCount; y++) {
                let sum: number = 0;

                let rowTmp = m1.getRow(y);

                for(let i1 = 0; i1 < rowTmp.length; i1++) {
                    sum += rowTmp[i1] * colTmp[i1];
                }

                result.setVal(x, y, sum);
            }
        }

        return result;
    }

    /**
     * scalarMult method returns the product of a matrix and a scalar number
     * @param {Matrix} m1 
     * @param {number} s 
     * @returns {Matrix} Matrix product of Matrix and scalar value
     */
    private static scalarMult(m1: Matrix, s: number) : Matrix {
        let result : Matrix = new Matrix(m1.rowCount, m1.columnCount);

        for(let i1 = 0; i1 < result.values.length; i1++) {
            result.values[i1] = m1.values[i1] * s;
        }

        return result;
    }

    /**
     * vectorMult method returns the vector product of a matrix and vector
     * @param {Matrix} m1 
     * @param {Vector} v 
     * @returns {Vector} Vector product of Matrix and Vector
     */
    public static vectorMult(m1: Matrix, v: Vector) : Vector {
        let m2 : Matrix = new Matrix(3, 1);
        m2.setRow(0, [v.x]);
        m2.setRow(1, [v.y]);
        m2.setRow(2, [v.z]);

        let result: Matrix = Matrix.mult(m1, m2);

        return new Vector(result.getVal(0, 0), result.getVal(0, 1), result.getVal(0, 2));
    }

    /**
     * rotationX method generates rotation matrix around the x axis
     * @param {number} theta 
     * @returns Rotation matrix around the x axis
     */
    public static rotationX(theta: number) : Matrix {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [1, 0, 0]);
        m.setRow(1, [0, cos, -1 * sin]);
        m.setRow(2, [0, sin, cos]);

        return m;
    }

    /**
     * rotationY method generates rotation matrix around the y axis
     * @param {number} theta 
     * @returns Rotation matrix around the y axis
     */
    public static rotationY(theta: number) : Matrix {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [cos, 0, sin]);
        m.setRow(1, [0, 1, 0]);
        m.setRow(2, [-1 * sin, 0, cos]);

        return m;
    }

    /**
     * rotationZ method generates rotation matrix around the z axis
     * @param {number} theta 
     * @returns Rotation matrix around the z axis
     */
    public static rotationZ(theta: number) : Matrix {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [cos, -1 * sin, 0]);
        m.setRow(1, [sin, cos, 0]);
        m.setRow(2, [0, 0, 1]);

        return m;
    }

    /**
     * scale method generates scaling matrix
     * @param {number} xScale 
     * @param {number} yScale 
     * @param {number} zScale 
     * @returns {Matrix} scale matrix
     */
    public static scale(xScale: number = 1, yScale: number = 1, zScale: number = 1) {
        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [xScale, 0, 0]);
        m.setRow(1, [0, yScale, 0]);
        m.setRow(2, [0, 0, zScale]);

        return m;
    }

    /**
     * @constructor creates an instance of Matrix
     * @param {number} rows
     * @param {number} columns 
     */
    constructor(rows: number, columns: number) {
        this.dim = [rows, columns];

        this.values = new Array<number>(this.rowCount * this.columnCount).fill(0);
    }

    /**
     * getVal method gets value from matrix at specific coordinate
     * @param {number} x 
     * @param {number} y 
     * @returns {number} matrix value at (x,y)
     */
    public getVal(x: number, y: number) : number {
        if(x < 0 || this.columnCount <= x) {
            throw new Error("column out of range");
        }

        if(y < 0 || this.rowCount <= y) {
            throw new Error("row out of range");
        }

        return this.values[x + this.columnCount * y];
    }

    /**
     * setVal method updates value of matrix at (x,y)
     * @param {number} x 
     * @param {number} y 
     * @param {number} val
     */
    public setVal(x: number, y: number, val : number) : void {
        if(x < 0 || this.columnCount <= x) {
            throw new Error("column out of range");
        }

        if(y < 0 || this.rowCount <= y) {
            throw new Error("row out of range");
        }

        this.values[x + this.columnCount * y] = val;
    }

    /**
     * getRow method returns an array of a row in matrix
     * @param {number} row 
     * @returns {number[]} array of numbers in a row
     */
    public getRow(row: number): number[] {
        let vals : number[] = new Array(this.columnCount);

        for(let x = 0; x < this.columnCount; x++) {
            vals[x] = this.getVal(x, row);
        }
        
        return vals;
    }

    /**
     * setRow method updates row in matrix
     * @param {number} row 
     * @param {number[]} values 
     */
    public setRow(row: number, values: number[]) {
        if(values.length != this.columnCount) {
            throw new Error("Invalid size")
        }

        for(let x = 0; x < this.columnCount; x++) {
            this.setVal(x, row, values[x]);
        }
    }

    /**
     * getColumn method returns an array of a column in matrix
     * @param {number} column 
     * @returns {number[]} array of numbers in a column
     */
    public getColumn(column: number): number[] {
        let vals : number[] = new Array(this.rowCount);

        for(let y = 0; y < this.rowCount; y++) {
            vals[y] = this.getVal(column, y);
        }
        
        return vals;
    }

    /**
     * setColumn method updates column in matrix
     * @param {number} column 
     * @param {number[]} values 
     */
    public setColumn(column: number, values: number[]) {
        if(values.length != this.rowCount) {
            throw new Error("Invalid size")
        }

        for(let y = 0; y < this.rowCount; y++) {
            this.setVal(column, y, values[y]);
        }
    }

    /**
     * toString method converts matrix into string representation
     * @returns {string} string representation of Matrix
     */
    public toString(): string {
        let tmp : string = "";

        for (let y = 0; y < this.rowCount; y++) {
            for(let x = 0; x < this.columnCount; x++) {
                tmp+= `${this.getVal(x, y)} `;
            }
            tmp +="\n";
        }

        return tmp;
    }
}