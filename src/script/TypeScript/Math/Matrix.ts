export class Matrix {
    private values : number[];


    private dim : number[];
    public get columnCount(): number {
        return this.dim[1];
    };
    public get rowCount(): number {
        return this.dim[0];
    };

    public static mult(m1: Matrix, m2: Matrix) : Matrix {
        if(!(m1.columnCount == m2.rowCount /*&& m1.rowCount == m2.columnCount*/)) {
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