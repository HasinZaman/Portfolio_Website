import { Circle } from "../Circle";
import { Line } from "../Line";
import { Rect } from "../Rect";
import { rayChecks, rayCheck, interceptChecks, interceptCheck } from "../Intercept";
import { Vector } from "../Vector";


//line line intercept
{
    //parallel line test 1
    {
        let gradient : Vector = new Vector(1, 0);
        let dist : number = 10;

        let line1 : Line = new Line(new Vector(0,0), gradient, dist);
        let line2 : Line = new Line(new Vector(0,1), gradient, dist);

        test("Parallel 1", () => {
            expect(interceptCheck(line1, line2)).toBe(false);
        });
    }

    //parallel line test 2
    {
        let gradient : Vector = new Vector(0, 1);
        let dist : number = 10;

        let line1 : Line = new Line(new Vector(1,0), gradient, dist);
        let line2 : Line = new Line(new Vector(0,0), gradient, dist);

        test("Parallel 2", () => {
            expect(interceptCheck(line1, line2)).toBe(false);
        });
    }

    //parallel line test 3
    {
        let gradient : Vector = new Vector(1, 1);
        let dist : number = 10;

        let line1 : Line = new Line(new Vector(0,0), gradient, dist);
        let line2 : Line = new Line(new Vector(0,1), gradient, dist);

        test("Parallel 3", () => {
            expect(interceptCheck(line1, line2)).toBe(false);
        });
    }

    //perpendicular intersection 1
    {
        let dist : number = 10;

        let line1 : Line = new Line(new Vector(-1,0), new Vector(1, 0), dist);
        let line2 : Line = new Line(new Vector(0,-1), new Vector(0, 1), dist);
        
        test("perpendicular 1", () => {
            expect(interceptCheck(line1, line2)).toBe(true);
        });
    }

    //perpendicular intersection 2
    {
        let dist : number = 10;

        let line1 : Line = new Line(new Vector(-1, -1), new Vector(1, 1), dist);
        let line2 : Line = new Line(new Vector(-1, 1), new Vector(1, -1), dist);
        
        test("perpendicular 2", () => {
            expect(interceptCheck(line1, line2)).toBe(true);
        });
    }

    //generic intersection 1
    {
        let dist : number = 10;

        let line1 : Line = new Line(new Vector(0, 1), new Vector(1, 1), dist);
        let line2 : Line = new Line(new Vector(0, -2), new Vector(1, 2), dist);
        
        test("generic intersection 1", () => {
            expect(interceptCheck(line1, line2)).toBe(true);
        });
    }
    //generic intersection 2
    {
        let dist : number = 10;

        let line1 : Line = new Line(new Vector(0, 1), new Vector(1, 1), dist);
        let line2 : Line = new Line(new Vector(0, -2), new Vector(0, 1), dist);
        
        test("generic intersection 2", () => {
            expect(interceptCheck(line1, line2)).toBe(true);
        });
    }
}

//line circle intercept
{
    //tangent Line Horizontal
    {
        let l : Line;
        let c : Circle;
        let dist : number = 100;

        let lineStart : Vector = new Vector(-1*dist/2, -1);
        let circleCenter : Vector = new Vector(0,0);

        for(let radius : number = 1; radius < 2; radius++) {

            for(; lineStart.y < 2; lineStart.y++) {//line y = y1
                //sphere position
                for(let y2 : number = -1; y2 <= 2; y2+=2) {
                    circleCenter.y = lineStart.y + y2 * radius;
                    for(let x2 : number = -1; x2 < 2; x2++) {
                        circleCenter.x = x2 * dist/4;

                        l = new Line(lineStart, new Vector(1,0), dist);
                        c = new Circle(radius, circleCenter);

                        test(`tangent Line Horizontal at l(p=(${l.p.x},${l.p.y}), g=(${l.gradient.x},${l.gradient.y}))\tc(${circleCenter.x},${circleCenter.y},${radius})`, () => {
                            expect(interceptCheck(l, c)).toBe(true);
                        });
                    }
                }
            }
        }
    }
    //tangent line Vertical
    {
        let l : Line;
        let c : Circle;
        let dist : number = 100;

        let lineStart : Vector = new Vector(dist/2, -1);
        let circleCenter : Vector = new Vector(0,0);

        for(let radius : number = 1; radius < 2; radius++) {

            for(; lineStart.x < 2; lineStart.x++) {//line y = y1
                //sphere position
                for(let x2 : number = -1; x2 <= 2; x2+=2) {
                    circleCenter.y = lineStart.x + x2 * radius;
                    for(let y2 : number = -1; y2 < 2; y2++) {
                        circleCenter.y = y2 * dist/4;

                        l = new Line(lineStart, new Vector(1,0), dist);
                        c = new Circle(radius, circleCenter);

                        test(`tangent Line Vertical at (x = ${lineStart.y}\tc(${circleCenter.x},${circleCenter.y},${radius})`, () => {
                            expect(interceptCheck(l, c)).toBe(true);
                        });
                    }
                }
            }
        }
    }
    //tangent line diagonal
    {
        let tmpVector : Vector = new Vector(Math.sqrt(1/2), -1 * Math.sqrt(1/2));
        let dist : number = 100;
        let l : Line = new Line(new Vector(-10, -10), new Vector(1,1), dist);
        let c : Circle;

        for(let radius : number = 1; radius < 2; radius++) {
            
            for(let i : number = -1; i <= 2; i+=2) {
                c = new Circle(radius, Vector.mult(tmpVector, i * radius));

                test(`tangent Line diagonal at (y=x\tc(${c.p.x},${c.p.y},${radius})`, () => {
                    expect(interceptCheck(l, c)).toBe(true);
                });
            }
        }
    }

    //line from center Horizontal
    {
        let dist : number = 100;

        let l : Line
        let c : Circle;

        for(let i : number = -1; i < 2; i+=2) {

            l = new Line(new Vector(0,0), new Vector(i, 0), dist);
            c = new Circle(1, new Vector(0,0));

            //center
            test(`center horizontal at l(y = 0)\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });

            //vertical offset
            l = new Line(new Vector(0,0.5), new Vector(i, 0), dist);
            test(`offset horizontal at l(y = 0.5)\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });
        }
    }
    //line from center Vertical
    {
        let dist : number = 100;

        let l : Line
        let c : Circle;

        for(let i : number = -1; i < 2; i+=2) {

            l = new Line(new Vector(0, 0), new Vector(0, i), dist);
            c = new Circle(1, new Vector(0,0));

            //center
            test(`center vertical at l(x = 0)\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });

            //horizontal offset
            l = new Line(new Vector(0.5, 0), new Vector(i, 0), dist);
            test(`offset vertical at l(x = 0.5)\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });
        }
    }
    //line from center diagonal
    {
        let dist : number = 100;

        let l : Line
        let c : Circle;

        for(let i : number = -1; i < 2; i+=2) {

            l = new Line(new Vector(0, 0), new Vector(i, i), dist);
            c = new Circle(1, new Vector(0,0));

            //center
            test(`center vertical at l(x = 0)\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });

            //horizontal offset
            l = new Line(new Vector(0.5, 0), new Vector(i, i), dist);
            test(`offset vertical at l(x = 0.5)\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });
        }
    }

    //generic line Horizontal
    {
        let dist : number = 100;

        let l : Line =  new Line(new Vector(dist/2 * -1, 0), new Vector(1, 0), dist);
        let c : Circle = new Circle(1, new Vector(0, 0));

        for(let y = 0; y < 2; y++) {
            l.p.y = y * 0.5;

            test(`generic line Horizontal at l(p=(${l.p.x},${l.p.y})\tg=(${l.gradient.x},${l.gradient.y}))\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });
        }
    }
    //generic line Vertical
    {
        let dist : number = 100;

        let l : Line =  new Line(new Vector(0, dist/2 * -1), new Vector(0, 1), dist);
        let c : Circle = new Circle(1, new Vector(0, 0));

        for(let x = 0; x < 2; x++) {
            l.p.x = x * 0.5;

            test(`generic line vertical at l(p=(${l.p.x},${l.p.y})\tg=(${l.gradient.x},${l.gradient.y}))\tc(${c.p.x},${c.p.y})`, () => {
                expect(interceptCheck(l, c)).toBe(true);
            });
        }
    }
    //generic line diagonal
    {
        let dist : number = 100;

        let l : Line = new Line(new Vector(0,0), new Vector(1,1), dist);
        let c : Circle = new Circle(1, new Vector(0, 0));

        l.p = new Vector(-1, -1);

        test(`generic line diagonal at l(p=(${l.p.x},${l.p.y})\tg=(${l.gradient.x},${l.gradient.y}))\tc(${c.p.x},${c.p.y})`, () => {
            expect(interceptCheck(l, c)).toBe(true);
        });

        l.p = new Vector(-1.5, -1);

        test(`generic line diagonal at l(p=(${l.p.x},${l.p.y})\tg=(${l.gradient.x},${l.gradient.y}))\tc(${c.p.x},${c.p.y})`, () => {
            expect(interceptCheck(l, c)).toBe(true);
        });
    }

    //no intercept Horizontal
    {
        let dist : number = 100;

        let l : Line = new Line(new Vector(-1 * dist / 2, dist), new Vector(1, 0), dist);
        let c : Circle = new Circle(1, new Vector(0, 0));

        for(let i = -1; i < 2; i+=2) {
            l.p.y *= i;

            test(`No intercept horizontal`, () => {
                expect(interceptCheck(l, c)).toBe(false);
            });
        }
    }
    //no intercept Vertical
    {
        let dist : number = 100;

        let l : Line = new Line(new Vector(dist, -1 * dist / 2), new Vector(0, 1), dist);
        let c : Circle = new Circle(1, new Vector(0, 0));

        for(let i = -1; i < 2; i+=2) {
            l.p.x *= i;

            test(`No intercept horizontal`, () => {
                expect(interceptCheck(l, c)).toBe(false);
            });
        }
    }
    //no intercept diagonal
    {
        let dist : number = 100;

        let l : Line = new Line(new Vector(-1 * dist / 4, -1 * dist / 4), new Vector(1, 1), dist);
        let c : Circle = new Circle(1, new Vector(0, 0));

        for(let i = -1; i < 2; i+=2) {
            l.p.x *= i;
            l.p.y *= i;

            test(`No intercept horizontal`, () => {
                expect(interceptCheck(l, c)).toBe(false);
            });
        }
    }
}

//line rect intercept
{
    //slice through edge
    {
        let r : Rect = new Rect(1, 1, 0, new Vector(0, 0));
        let l : Line;

        l = new Line(new Vector(-1, 0), new Vector(1,0), 100);
        test(`rect edge test 1`, () => {
            expect(interceptCheck(l, r)).toBe(true);
        });
        
        l = new Line(new Vector(1,-1), new Vector(0,1), 100);
        test(`rect edge test 2`, () => {
            expect(interceptCheck(l, r)).toBe(true);
        });
        
        l = new Line(new Vector(2,1), new Vector(-1,0), 100);
        test(`rect edge test 3`, () => {
            expect(interceptCheck(l, r)).toBe(true);
        });
        
        l = new Line(new Vector(0,2), new Vector(0,-1), 100);
        test(`rect edge test 4`, () => {
            expect(interceptCheck(l, r)).toBe(true);
        });
    }
    //corner intercept
    {
        let r : Rect = new Rect(1, 1, 0, new Vector(0, 0));
        let l : Line;

        l = new Line(new Vector(-1, -1), new Vector(1, 1), 1.5);
        test("corner intercept test 1", () => {
            expect(interceptCheck(l,r)).toBe(true);
        });
        
        l = new Line(new Vector(2, 2), new Vector(-1, -1), 1.5);
        test("corner intercept test 2", () => {
            expect(interceptCheck(l,r)).toBe(true);
        });
    }
    //generic intercept
    {
        let r : Rect = new Rect(1, 1, 0, new Vector(0, 0));
        let l : Line;

        l = new Line(new Vector(-1, 0.5), new Vector(1, 0), 1.5);
        test("generic intercept test 1", () => {
            expect(interceptCheck(l,r)).toBe(true);
        });

        l = new Line(new Vector(-0.1, 0.1), new Vector(1, 1), 0.5);
        test("generic intercept test 2", () => {
            expect(interceptCheck(l,r)).toBe(true);
        });
    }

    //no intercept
    {
        let r : Rect = new Rect(1, 1, 0, new Vector(0, 0));
        let l : Line;

        l = new Line(new Vector(0,-1), new Vector(1,0), 100);
        test("no intercept test 1", () => {
            expect(interceptCheck(l,r)).toBe(false);
        });

        l = new Line(new Vector(0,-1), new Vector(0,1), 100);
        test("no intercept test 2", () => {
            expect(interceptCheck(l,r)).toBe(false);
        });

        l = new Line(new Vector(1, -1), new Vector(1, 1), 100);
        test("no intercept test 3", () => {
            expect(interceptCheck(l,r)).toBe(false);
        });
    }
}

//ray check
{

}

//group checks
{
  
}