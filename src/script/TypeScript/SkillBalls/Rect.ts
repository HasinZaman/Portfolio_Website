import { Line } from "./Line";
import { Path } from "./Path";
import { Vector } from "./Vector";

/**
 * Rect class define methods and variables required for a rectangle
 * @implements {Path}
 */
export class Rect implements Path
{
    // 3  <--e2--  2
    // |           ᐱ
    // e3          |
    // |           e1
    // ᐯ           |
    // 0   --e0--> 1
    //
    // Rect pivots on 0 vertices
    private width_: number;
    get width() : number {
        return this.width_;
    }
    set width(value : number) {
        this.width_ = value;
        this.generateEdges();
    }

    private height_: number;
    get height() : number {
        return this.height_;
    }
    set height(value : number) {
        this.height_ = value;
        this.generateEdges();
    }

    private theta : number;
    get rot() : number {
        return this.theta;
    }
    set rot(rotation : number) {
        this.theta = rotation;
        this.generateEdges();
    }

    private perimeter : number = 0;

    private start_ : Vector;
    get start() : Vector {
        return this.start_;
    }
    set start(value : Vector) {
        this.start_ = value;
        this.generateEdges();
    }
    
    private edges : Line[] = [new Line(new Vector(0,0),new Vector(0,0),0), new Line(new Vector(0,0),new Vector(0,0),0), new Line(new Vector(0,0),new Vector(0,0),0), new Line(new Vector(0,0),new Vector(0,0),0)];
    
    /**
     * @constructor creates a Rect object
     * @param {number} width: width of rectangle 
     * @param {number} height: height of rectangle
     * @param {number} rotation: rotation of rectangle. rotation is defined in terms of radians
     * @param {Vector} startPoint: Vector that defines the first vertices
     */
    constructor (width : number, height : number, rotation : number, startPoint : Vector) {
        this.width_ = width;
        this.height_ = height;
        this.start_ = startPoint;
        this.theta = rotation;

        this.generateEdges();
    }

    /**
     * getEdge returns a line of an edge from Rect
     * 
     * 3  <--e2--  2
     * |           ᐱ
     * e3          |
     * |           e1
     * ᐯ           |
     * 0   --e0--> 1
     * 
     * @param {number} edgeId: id of edge that will be retrieved
     * @returns {Line} line representation of edge
     */
    public getEdge(edgeId : number) : Line {
        if(edgeId < 0 || 4 <= edgeId)
        {
            throw new Error();
        }
        
        let tmp : Line = this.edges[edgeId];

        return new Line(tmp.p, tmp.gradient, tmp.l);
    }

    /**
     * getPoint method returns points from Rect
     * @param {number} t: distance from start vector 
     * @returns {Vector} position vector on rect of t 
     */
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

    /**
     * getCenter method returns the center of Rect
     * @returns {Vector} position vector of center of rect
     */
    public getCenter(): Vector {
        let p1 : Vector = this.edges[0].getPoint(this.edges[0].l/2);
        let p2 : Vector = this.edges[1].getPoint(this.edges[1].l/2);

        p1 = Vector.add(p1, Vector.mult(this.edges[0].p, -1));
        p2 = Vector.add(p2, Vector.mult(this.edges[1].p, -1));

        return Vector.add(this.start_, Vector.add(p1, p2));
    }

    /**
     * generateEdges method generates edges based on start position, width, height and rotation of Rect
     */
    private generateEdges() : void {
        let l1 : number = 0;
        let dir : Vector;
        let p : Vector = this.start_;

        let angle = this.theta;

        for(let i1 : number = 0; i1 < 4; i1++)
        {
            switch(i1)
            {
                case 0:
                case 2:
                    l1 = this.width_;
                    break;
                case 1:
                case 3:
                    l1 = this.height_;
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

        this.perimeter = 2 * this.width_ + 2 * this.height_;
    }
}