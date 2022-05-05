import { Vector } from "../../Vector";
import { BezierCurve } from "../BezierCurve";
import { Line } from "../Line";
//test two point curve
{
    let testCount = 0;
    test(`Two Point Curve ${testCount++} - `, () => {
        let bezierCurve : BezierCurve = new BezierCurve([
            new Vector(0,0),
            new Vector(1,0)
        ]);

        let result : Vector;

        for(let i1 = 0; i1 < 1; i1+=0.5) {
            result = bezierCurve.getPoint(i1);
            expect(result.x).toBeCloseTo(i1);
            expect(result.y).toBeCloseTo(0);
        }
    })

    test(`Two Point Curve ${testCount++} - `, () => {
        let bezierCurve : BezierCurve = new BezierCurve([
            new Vector(0,0),
            new Vector(1,1)
        ]);

        let lineTest : Line = new Line(new Vector(0, 0), new Vector(1,1), 2);
        let actual : Vector;
        let expected : Vector;

        for(let i1 = 0; i1 < 1; i1+=0.5) {
            actual = bezierCurve.getPoint(i1);
            expected = lineTest.getPoint(i1);
            expect(actual.x).toBeCloseTo(expected.x);
            expect(actual.y).toBeCloseTo(expected.y);
        }
    })
}
//test three point curve
{
    let testCount = 0;
    test(`Three Point Curve ${testCount++} - `, () => {
        let bezierCurve : BezierCurve = new BezierCurve([
            new Vector(19.9,-0.4),
            new Vector(9.8,10),
            new Vector(-0.2, 0)
        ]);

        let result : Vector;

        result = bezierCurve.getPoint(0);
        expect(result.x).toBeCloseTo(19.9);
        expect(result.y).toBeCloseTo(-0.4);
        
        result = bezierCurve.getPoint(0.3);
        expect(result.x).toBeCloseTo(13.849);
        expect(result.y).toBeCloseTo(4.004);
        
        result = bezierCurve.getPoint(0.75);
        expect(result.x).toBeCloseTo(4.806);
        expect(result.y).toBeCloseTo(3.725);
        
        result = bezierCurve.getPoint(1);
        expect(result.x).toBeCloseTo(-0.2);
        expect(result.y).toBeCloseTo(0);
    })
}

//Error check
{
    //out of range error
    {
        let bezierCurve : BezierCurve = new BezierCurve([
            new Vector(0,0),
            new Vector(1,0)
        ]);

        for(let n1 = -1.5; n1 < 2; n1+=3){
            test(`Invalid range test at ${n1}`, () => {
                expect(() => {bezierCurve.getPoint(n1)}).toThrowError("out of range [0,1]");
            })
        }
    }

    //invalid construction
    {
        test(`Invalid construction`, () => {
            expect(() => {new BezierCurve([])}).toThrowError("parameters must have at least size 2");
        });
    }
}