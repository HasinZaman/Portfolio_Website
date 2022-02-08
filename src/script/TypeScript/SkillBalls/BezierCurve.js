"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BezierCurve = void 0;
const Line_1 = require("./Line");
const Vector_1 = require("./Vector");
class BezierCurve {
    constructor(parameters) {
        this.parameters = [];
        if (parameters.length < 2) {
            throw new Error("parameters must have atleast size 2");
        }
        this.parameters = parameters;
    }
    getPoint(t) {
        if (t < 0 || 1 < t) {
            throw new Error("out of range [0,1]");
        }
        let line;
        let parameterTmp = Object.assign([], this.parameters);
        let linesTmp;
        while (parameterTmp.length > 1) {
            //create lines
            linesTmp = [];
            for (let i1 = 0; i1 < parameterTmp.length - 1; i1++) {
                linesTmp.push(new Line_1.Line(parameterTmp[i1], Vector_1.Vector.sub(parameterTmp[i1 + 1], parameterTmp[i1]), -1));
            }
            //update paramterTmp with new values at t
            parameterTmp = [];
            for (let i1 = 0; i1 < linesTmp.length; i1++) {
                parameterTmp.push(linesTmp[i1].getPoint(t));
            }
        }
        return parameterTmp[0];
    }
    getCenter() {
        return this.getPoint(0.5);
    }
    Clone() {
        let tmp = [];
        this.parameters.forEach(p => {
            tmp.push(p.clone());
        });
        return new BezierCurve(tmp);
    }
}
exports.BezierCurve = BezierCurve;
//# sourceMappingURL=BezierCurve.js.map