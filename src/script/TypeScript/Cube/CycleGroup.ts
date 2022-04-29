export class Generator{
    private operation : number[];

    constructor(operation : number[]) {
        if(!Generator.validOperation(operation)) {
            throw new Error("Invalid operation");
        }

        this.operation = operation;
    }

    public next<T>(state : T[]) : T[] {
        if(state.length != this.operation.length) {
            throw new Error("state has an invalid size");
        }

        let nextState : T[] = new Array(state.length);
        
        this.operation.forEach((next, index) => {
            nextState[next] = state[index]
        });

        return nextState;
    }

    private static validOperation(operation : number[]) : boolean {
        let tmp : boolean[] = new Array(operation.length).fill(false);

        for(let i1 = 0; i1 < operation.length; i1++) {
            let next = operation[i1];

            //next value out of range
            if(next < 0 || tmp.length < next) {
                return false;
            }

            //double visit of index
            if(tmp[next]) {
                return false;
            }

            tmp[next] = true;
        }

        return true;
    }
}