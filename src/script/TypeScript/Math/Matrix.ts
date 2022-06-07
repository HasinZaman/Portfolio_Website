import { Vector } from "./Vector";

export class Matrix {
    private values : number[];

    private dim : number[];
    public get columnCount(): number {
        return this.dim[1];
    };
    public get rowCount(): number {
        return this.dim[0];
    };

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

    public static sub(m1: Matrix, m2: Matrix) : Matrix {
        return this.add(m1, this.mult(m2, -1));
    }

    public static mult(v1: Matrix, v2: Matrix | number) : Matrix {

        if(typeof v2 === "number") {
            return this.scalarMult(v1, v2);
        }

        return this.matrixMult(v1, v2);
    }

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

    private static scalarMult(m1: Matrix, s: number) : Matrix {
        let result : Matrix = new Matrix(m1.rowCount, m1.columnCount);

        for(let i1 = 0; i1 < result.values.length; i1++) {
            result.values[i1] = m1.values[i1] * s;
        }

        return result;
    }

    public static vectorMult(m1: Matrix, v: Vector) : Vector {
        let m2 : Matrix = new Matrix(3, 1);
        m2.setRow(0, [v.x]);
        m2.setRow(1, [v.y]);
        m2.setRow(2, [v.z]);

        let result: Matrix = Matrix.mult(m1, m2);

        return new Vector(result.getVal(0, 0), result.getVal(0, 1), result.getVal(0, 2));
    }

    public static rotationX(theta: number) : Matrix {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [1, 0, 0]);
        m.setRow(1, [0, cos, -1 * sin]);
        m.setRow(2, [0, sin, cos]);

        return m;
    }

    public static rotationY(theta: number) : Matrix {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [cos, 0, sin]);
        m.setRow(1, [0, 1, 0]);
        m.setRow(2, [-1 * sin, 0, cos]);

        return m;
    }

    public static rotationZ(theta: number) : Matrix {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [cos, -1 * sin, 0]);
        m.setRow(1, [sin, cos, 0]);
        m.setRow(2, [0, 0, 1]);

        return m;
    }

    public static scale(xScale: number = 1, yScale: number = 1, zScale: number = 1) {
        let m : Matrix = new Matrix(3, 3);

        m.setRow(0, [xScale, 0, 0]);
        m.setRow(0, [0, yScale, 0]);
        m.setRow(0, [0, 0, zScale]);

        return m;
    }

    constructor(rows: number, columns: number) {
        this.dim = [rows, columns];

        this.values = new Array<number>(this.rowCount * this.columnCount).fill(0);
    }

    public getVal(x: number, y: number) : number {
        if(x < 0 || this.columnCount <= x) {
            throw new Error("column out of range");
        }

        if(y < 0 || this.rowCount <= y) {
            throw new Error("row out of range");
        }

        return this.values[x + this.columnCount * y];
    }

    public setVal(x: number, y: number, val : number) : void {
        if(x < 0 || this.columnCount <= x) {
            throw new Error("column out of range");
        }

        if(y < 0 || this.rowCount <= y) {
            throw new Error("row out of range");
        }

        this.values[x + this.columnCount * y] = val;
    }

    public getRow(row: number): number[] {
        let vals : number[] = new Array(this.columnCount);

        for(let x = 0; x < this.columnCount; x++) {
            vals[x] = this.getVal(x, row);
        }
        
        return vals;
    }

    public setRow(row: number, values: number[]) {
        if(values.length != this.columnCount) {
            throw new Error("Invalid size")
        }

        for(let x = 0; x < this.columnCount; x++) {
            this.setVal(x, row, values[x]);
        }
    }

    public getColumn(column: number): number[] {
        let vals : number[] = new Array(this.rowCount);

        for(let y = 0; y < this.rowCount; y++) {
            vals[y] = this.getVal(column, y);
        }
        
        return vals;
    }

    public setColumn(col: number, values: number[]) {
        if(values.length != this.rowCount) {
            throw new Error("Invalid size")
        }

        for(let y = 0; y < this.rowCount; y++) {
            this.setVal(col, y, values[y]);
        }
    }

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