import { Line } from "./Line";
import { Path } from "./Path";
import { Vector } from "./Vector";

export class BezierCurve implements Path {

    parameters : Vector[] = [];

    public constructor(parameters : Vector[])
    {
        if(parameters.length < 2) {
            throw new Error("parameters must have atleast size 2");
        }
        this.parameters = parameters;
    }

    public getPoint(t: number): Vector {
        if(t < 0 || 1 < t) {
            throw new Error("out of range [0,1]");
        }

        let line : Line;

        let parameterTmp : Vector[] = Object.assign([], this.parameters);
        let linesTmp : Line[];

        while(parameterTmp.length > 1) {
            //create lines
            linesTmp = [];

            for(let i1 : number = 0; i1 < parameterTmp.length - 1; i1++) {
                linesTmp.push(new Line(
                    parameterTmp[i1],
                    Vector.sub(parameterTmp[i1 + 1], parameterTmp[i1]),
                    -1
                ));
            }

            //update paramterTmp with new values at t
            parameterTmp = [];
            for(let i1 : number = 0; i1 < linesTmp.length; i1++) {
                parameterTmp.push(linesTmp[i1].getPoint(t));
            }
        }

        return parameterTmp[0];
    }

    public getCenter(): Vector {
        return this.getPoint(0.5);
    }

    public Clone() : BezierCurve{
        let tmp : Vector[] = [];
        this.parameters.forEach(p => {
            tmp.push(p.clone());
        });
        
        return new BezierCurve(tmp);
    }
}