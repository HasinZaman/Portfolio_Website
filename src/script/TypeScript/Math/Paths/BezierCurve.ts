import { Line } from "./Line";
import { Path } from "./Path";
import { Vector } from "../Vector";

/**
 * BezierCurve class defines a point and methods required to make a bezier curve
 * @extends {Path}
 */
export class BezierCurve implements Path {

    /**
     * parameters is an array of positions that define bezier curve
     */
    parameters : Vector[] = [];

    /**
     * @constructor Constructor creates BezierCurve object
     * @param parameters 
     */
    public constructor(parameters : Vector[])
    {
        if(parameters.length < 2) {
            throw new Error("parameters must have at least size 2");
        }
        this.parameters = parameters;
    }

    /**
     * getPoint method get a point from bezier curve
     * @param {number} t: number [0:1] define a point on bezier curve
     * @returns {Vector} vector position of bezier curve at t
     */
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

            //update parameterTmp with new values at t
            parameterTmp = [];
            for(let i1 : number = 0; i1 < linesTmp.length; i1++) {
                parameterTmp.push(linesTmp[i1].getPoint(t));
            }
        }

        return parameterTmp[0];
    }

    /**
     * getCenter method returns the center point of bezier curve
     * @returns {Vector} vector position of bezier curve at t
     */
    public getCenter(): Vector {
        return this.getPoint(0.5);
    }

    /**
     * Clone method creates a deep copy of BezierCurve object
     * @returns {BezierCurve} deep copy of BezierCurve
     */
    public Clone() : BezierCurve{
        let tmp : Vector[] = [];
        this.parameters.forEach(p => {
            tmp.push(p.clone());
        });
        
        return new BezierCurve(tmp);
    }
}