import { Vector } from "../../Vector";

//addition test
{
    //test 0 + 0
    {
        let v1 = new Vector(0,0);

        let sum = Vector.add(v1, v1);

        test("Addition test 1: 0 + 0", () => {
            expect(sum.x == 0 && sum.y == 0).toBe(true);
        });
    }
    //test v1 + v2
    {
        let v1 = new Vector(-23, 54);
        let v2 = new Vector(232, 23);

        let sum = Vector.add(v1, v2);

        test("Addition test 2: (-23, 54) + (232, 23)", () => {
            expect(sum.x == v1.x + v2.x && sum.y == v1.y + v2.y).toBe(true);
        });
    }
}

//subtraction test
{
    //test 0 - 0
    {
        let v1 = new Vector(0,0);

        let sum = Vector.sub(v1, v1);

        test("Subtraction test 1: 0 - 0", () => {
            expect(sum.x == 0 && sum.y == 0).toBe(true);
        });
    }
    //test v1 - v2
    {
        let v1 = new Vector(-23, 54);
        let v2 = new Vector(232, 23);

        let sum = Vector.sub(v1, v2);

        test("Subtraction test 2: (-23, 54) - (232, 23)", () => {
            expect(sum.x == v1.x - v2.x && sum.y == v1.y - v2.y).toBe(true);
        });
    }
}

//scalar multiplication test
{
    //test 0 * v1
    {
        let v1 = new Vector(1,1);

        let product = Vector.mult(v1, 0);

        test("Scalar multiplication 1: 0 * 0", () => {
            expect(product.x == 0 && product.y == 0).toBe(true);
        });
    }
    //test n * v1
    {
        let n = 23;
        let v1 = new Vector(-23, 54);

        let product = Vector.mult(v1, n);

        test("Scalar multiplication 2: 23 * (232, 23)", () => {
            expect(product.x == n * v1.x && product.y == n * v1.y).toBe(true);
        });
    }
}

//scalar division test
{
    //test n^-1 * v1
    {
        let n = 23;
        let v1 = new Vector(-23, 54);

        let quotient = Vector.div(v1, n);

        test("Scalar multiplication 2: 23^-1 * (-23, 54)", () => {
            expect(quotient.x == v1.x / n && quotient.y == v1.y / n).toBe(true);
        });
    }
}

//dot product test
{
    //test v1 * v2
    {
        let v1 : Vector = new Vector(0, 0);
        let v2 : Vector = new Vector(0, 0);

        let product : number = Vector.dot(v1, v2);

        test(`dot product test 1: (${v1.x}, ${v1.y}) * (${v2.x}, ${v2.y})`, () => {
            expect(product == v1.x * v2.x + v1.y * v2.y).toBe(true);
        });
    }

    //test v1 * v2
    {
        let v1 : Vector = new Vector(23, -53);
        let v2 : Vector = new Vector(78, 234);

        let product : number = Vector.dot(v1, v2);

        test(`dot product test 2: (${v1.x}, ${v1.y}) * (${v2.x}, ${v2.y})`, () => {
            expect(product == v1.x * v2.x + v1.y * v2.y).toBe(true);
        });
    }

    //test v1 * v2 = cos (theta)
    {
        let v1 : Vector = new Vector(0, 1);
        let v2 : Vector = new Vector(1, 0);

        let product : number = Vector.dot(v1, v2);

        test(`dot product test 3: (${v1.x}, ${v1.y}) * (${v2.x}, ${v2.y})`, () => {
            expect(product == 0).toBe(true);
        });
    }

    //test v1 * v2 = cos (theta)
    {
        let v1 : Vector = new Vector(1, 0);
        let v2 : Vector = new Vector(1, 0);

        let product : number = Vector.dot(v1, v2);

        test(`dot product test 4: (${v1.x}, ${v1.y}) * (${v2.x}, ${v2.y})`, () => {
            expect(product == 1).toBe(true);
        });
    }

    //test v1 * v2 = cos (theta)
    {
        let v1 : Vector = new Vector(1, 0);
        let v2 : Vector = new Vector(1, 0);

        let product : number = Vector.dot(v1, v2);

        test(`dot product test 5: (${v1.x}, ${v1.y}) * (${v2.x}, ${v2.y})`, () => {
            expect(product == 1).toBe(true);
        });
    }

    //test v1 * v2 = cos (theta)
    {
        let v1 : Vector = new Vector(1, 0);
        let v2 : Vector = Vector.normalize(new Vector(1, 1));

        let product : number = Vector.dot(v1, v2);

        test(`dot product test 6: (${v1.x}, ${v1.y}) * (${v2.x}, ${v2.y})`, () => {
            expect(Math.abs(product - Math.cos(Math.PI/4)) <= 0.0000001).toBe(true);
        });
    }
}

//cross product test
{
    let testCount = 0;
    //cross product v1 X v2
    {
        let v1 : Vector = new Vector(23, 48);
        let v2 : Vector = new Vector(52, 32);

        let product : number = Vector.cross(v1, v2);

        test(`Cross product test ${testCount++}: (${v1.x}, ${v1.y}) X (${v2.x}, ${v2.y})`, () => {
            expect(product).toBe(v1.x * v2.y - v2.x * v1.y);
        });
    }

    //cross product v1 X v2
    {
        let v1 : Vector = new Vector(1, 0);
        let v2 : Vector = new Vector(0, 1);

        let product : number = Vector.cross(v1, v2);

        test(`Cross product test ${testCount++}: (${v1.x}, ${v1.y}) X (${v2.x}, ${v2.y})`, () => {
            expect(product).toBe(1);
        });
    }

    //cross product v1 X v2
    {
        let v1 : Vector = new Vector(1, 0);
        let v2 : Vector = new Vector(1, 0);

        let product : number = Vector.cross(v1, v2);

        test(`Cross product test ${testCount++}: (${v1.x}, ${v1.y}) X (${v2.x}, ${v2.y})`, () => {
            expect(product == 0).toBe(true);
        });
    }

    //cross product v1 X v2
    {
        let v1 : Vector = new Vector(1, 0);
        let v2 : Vector = Vector.normalize(new Vector(1, 1));

        let product : number = Vector.dot(v1, v2);

        test(`Cross product test ${testCount++}: (${v1.x}, ${v1.y}) X (${v2.x}, ${v2.y})`, () => {
            expect(Math.abs(product - Math.sin(Math.PI/4)) <= 0.0000001).toBe(true);
        });
    }
}

//distance test
{
    let testCount = 0;
    //distance 0 vector
    {
        let v1 : Vector = new Vector(0, 0);

        let dist : number = Vector.dist(v1);

        test(`Distance test ${testCount++} : ||(${v1.x},${v1.y})||`, () => {
            expect(dist).toBe(0);
        });
    }

    //distance v1
    {
        let v1 : Vector = new Vector(1, 0);

        let dist : number = Vector.dist(v1);

        test(`Distance test ${testCount++} : ||(${v1.x},${v1.y})||`, () => {
            expect(dist).toBe(1);
        });
    }
    
    //distance v1
    {
        let v1 : Vector = new Vector(Math.cos(Math.PI/6), Math.sin(Math.PI/6));

        let dist : number = Vector.dist(v1);

        test(`Distance test ${testCount++} : ||(${v1.x},${v1.y})||`, () => {
            expect(dist).toBe(1);
        });
    }
    
    //distance v1
    {
        let v1 : Vector = new Vector(-23, 22);

        let dist : number = Vector.dist(v1);

        test(`Distance test ${testCount++} : ||(${v1.x},${v1.y})||`, () => {
            expect(dist).toBe(Math.sqrt(Math.pow(v1.x,2) + Math.pow(v1.y, 2)));
        });
    }

    //distance v1 = distance v2
    {
        let v1 : Vector = new Vector(-23, -23);
        let v2 : Vector = new Vector(23, 23);

        let dist1 : number = Vector.dist(v1);
        let dist2 : number = Vector.dist(v2);

        test(`Distance test ${testCount++} : ||(${v1.x},${v1.y})||`, () => {
            expect(dist1).toBe(dist2);
        });
    }
}

//normalization test
{
    let testCount = 0;
    //normalize v1
    {
        let v1 : Vector = new Vector(23, 0);

        let norm : Vector = Vector.normalize(v1);

        test(`Normalize test ${testCount++} : (${v1.x},${v1.y})`, () => {
            expect(norm.x == 1 && norm.y == 0).toBe(true)
        })
    }

    //normalize v1
    {
        let v1 : Vector = new Vector(23, 23);

        let norm : Vector = Vector.normalize(v1);

        let theta : number = Math.PI/4;
        let threshold : number = 0.000001

        test(`Normalize test ${testCount++} : (${v1.x},${v1.y})`, () => {
            expect(Math.abs(norm.x - Math.cos(theta)) < threshold && Math.abs(norm.y - Math.sin(theta)) < threshold).toBe(true)
        })
    }
}

//projection test
{
    let testCount = 0;
    //projection on x axis
    {
        let v1 = new Vector(1, 0);
        let v2 = new Vector(23, 0);

        let proj : Vector = Vector.projection(v2, v1);

        test(`Projection test ${testCount++} :  (${v2.x}, ${v2.y}) onto (${v1.x}, ${v1.y})`, () => {
            expect(proj.x == 23 && proj.y == 0).toBe(true);
        });
    }

    //projection v1 on v2
    {
        let v1 = new Vector(1, 2);
        let v2 = new Vector(3, -8);

        let proj : Vector = Vector.projection(v2, v1);

        test(`Projection test ${testCount++} :  (${v2.x}, ${v2.y}) onto (${v1.x}, ${v1.y})`, () => {
            expect(proj.x == -13/5 && proj.y == -26/5).toBe(true);
        });
    }
}