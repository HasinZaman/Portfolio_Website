import { Line } from "./Line";
import { Path } from "./Path";
import { Vector } from "./Vector";

export class Rect implements Path
{
    // 3  <--e2--  2
    // |           ᐱ
    // e3          |
    // |           e1
    // ᐯ           |
    // 0   --e0--> 1
    //
    // Rect pivots on 0 vertice
    private width: number;
    private height: number;
    private theta : number;

    private perimeter : number = 0;

    private start : Vector;
    
    private edges : Line[] = [new Line(new Vector(0,0),new Vector(0,0),0), new Line(new Vector(0,0),new Vector(0,0),0), new Line(new Vector(0,0),new Vector(0,0),0), new Line(new Vector(0,0),new Vector(0,0),0)];
    
    constructor (width : number, height : number, rotation : number, startPoint : Vector) {
        this.width = width;
        this.height = height;
        this.start = startPoint;
        this.theta = rotation;

        this.generateEdges();
    }

    public getWidth() : number {
        return this.width;
    }
    public setWidth(width : number) : void {
        this.width = width;
        this.generateEdges();
    }

    public getHeight() : number {
        return this.height;
    }
    public setHeight(height : number) : void {
        this.height = height;
        this.generateEdges();
    }

    public getRot() : number {
        return this.theta;
    }
    public setRot(rotation : number) : void {
        this.theta = rotation;
        this.generateEdges();
    }

    public getStart() : Vector {
        return this.start;
    }
    public setStart(start : Vector) : void {
        this.start = start;
        this.generateEdges();
    }

    public getEdge(edgeId : number) {
        if(edgeId < 0 || 4 <= edgeId)
        {
            throw new Error();
        }
        
        let tmp : Line = this.edges[edgeId];

        return new Line(tmp.p, tmp.gradient, tmp.l);
    }

    public getPoint(t: number) : Vector {
        let dist = t % this.perimeter;
        
        for(let i1 : number = 0; i1 < 4; i1++)
        {
            if(dist < this.edges[i1].l)
            {
                return this.edges[i1].getPoint(dist);
            }
            
            dist -= this.edges[i1].l;
        }

        return new Vector(0, 0);
    }

    public getCenter(): Vector {
        let p1 : Vector = this.edges[0].getPoint(this.edges[0].l/2);
        let p2 : Vector = this.edges[1].getPoint(this.edges[1].l/2);

        p1 = Vector.add(p1, Vector.mult(this.edges[0].p, -1));
        p2 = Vector.add(p2, Vector.mult(this.edges[1].p, -1));

        return Vector.add(this.start, Vector.add(p1, p2));
    }

    private generateEdges() : void {
        let l1 : number = 0;
        let dir : Vector;
        let p : Vector = this.start;

        let angle = this.theta;

        for(let i1 : number = 0; i1 < 4; i1++)
        {
            switch(i1)
            {
                case 0:
                case 2:
                    l1 = this.width;
                    break;
                case 1:
                case 3:
                    l1 = this.height;
                    break;
            }
            dir = new Vector
                (
                    Math.cos(angle),
                    Math.sin(angle)
                );
            
            this.edges[i1] = new Line(p,dir,l1);

            p = this.edges[i1].getPoint(this.edges[i1].l);
            angle += Math.PI / 2;
        }

        this.perimeter = 2 * this.width + 2 * this.height;
    }
}