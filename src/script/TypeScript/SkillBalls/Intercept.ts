import { Line } from "./Line";
import { Circle } from "./Circle";
import { Rect } from "./Rect";
import { Path } from "./Path";
import { Vector } from "./Vector";

class Intercept
{
    exists : boolean
    t1 : number;
    t2 : number;

    constructor(exists : boolean, t1 : number, t2 : number) {
        this.exists = exists;
        this.t1 = t1;
        this.t2 = t2;
    }
}

export function rayChecks(ray : Line, colliders : Path[]) : number {
    for(let i1 : number = 0; i1 < colliders.length; i1++)
    {
        if (rayCheck(ray, colliders[i1]) >= 0) {
            return i1;
        }
    }
    return -1;
}

export function rayCheck(ray : Line, p : Path) : number {
    console.log("Ray Check")
    console.log(p)
    let intercept : Intercept = getIntercept(ray, p);

    if(intercept.exists) {
        return getIntercept(ray, p).t1;
    }

    return -1;
}

export function interceptChecks(p1 : Path, paths : Path[], ignoreIndex : number[]) : number[] {
    let tmp : number[] = [];
    for(let i : number = 0; i < paths.length; i++)
    {
        if(!ignoreIndex.includes(i)) {
            if(interceptCheck(p1, paths[i])) {
                tmp.push(i);
            }
        }
    }
    return tmp;
}

export function interceptCheck(p1 : Path, p2 : Path) : boolean {
    let line : Line;
    let i : Intercept;

    if(p1 instanceof Line && p2 instanceof Line)
    {
        let i = LineLineIntercept(p1 as Line, p2 as Line);
        return i.exists;
    }
    else if(p1 instanceof Line) {
        line = p1;
        if(p2 instanceof Circle) {
            i = LineCircleIntercept(line, p2 as Circle);
        }
        else {
            i = LineRectIntercept(line, p2 as Rect);
        }
        return i.exists;
    }
    else if(p2 instanceof Line) {
        line = p2;

        if(p1 instanceof Circle) {
            i = LineCircleIntercept(line, p1 as Circle);
        }
        else {
            i = LineRectIntercept(line, p1 as Rect);
        } 
        return i.exists;
    }
    let dist : Vector = Vector.sub(p2.getCenter(), p1.getCenter());
    
    line = new Line
    (
        p1.getCenter(),
        Vector.normalize(dist),
        Vector.dist(dist)
    );
    
    let t1 : Intercept = getIntercept(line, p1);
    let t2 : Intercept = getIntercept(line, p2);

    return t2.t1 <= t1.t1 && t1.exists && t2.exists;
}

function getIntercept(line : Line, p : Path) : Intercept {
    if(p instanceof Line) {
        return LineLineIntercept(line, p as Line);
    }
    else if(p instanceof Circle) {
        return LineCircleIntercept(line, p as Circle);
    }
    else if(p instanceof Rect) {
        return LineRectIntercept(line, p as Rect);
    }
    throw new Error("Error");
}
function LineLineIntercept(l1 : Line, l2 : Line) : Intercept {
    let tmp : Intercept = new Intercept(true, 0, 0);

    let v1, v2 : Vector;
    v1 = l1.gradient;
    v2 = l2.gradient;

/*
    let n1 : number = v1.x * v2.y - v2.x * v1.y;

    if(n1 == 0) {
        //check if paralel
        tmp.exists = false;
    }
    else
    {
        tmp.t1 = (l2.p.x * v2.y + l1.p.y * v2.x) - (v2.x * l2.p.x + v2.y * l1.p.x)
        tmp.t1 /= n1;

        if(0 <= tmp.t1 && tmp.t1 <= l1.l) {
            if(v2.x != 0) {
                tmp.t2 = (l1.getPoint(tmp.t1).x - l2.p.x) / v2.x;
            }
            else {
                tmp.t2 = (l1.getPoint(tmp.t1).y - l2.p.y) / v2.y;
            }

            if(0 <= tmp.t2 && tmp.t2 <= l2.l) {
                tmp.exists = false;
            }
        }
        else
        {
            tmp.exists = false;
        }
        
    }
    */
   
    if(l2.gradient.x*l1.gradient.y!=l1.gradient.x*l2.gradient.y && l2.gradient.x!=0) {
        tmp.t1 = (l2.gradient.y*(l1.p.x - l2.p.x) + l2.gradient.x*(l2.p.y - l1.p.y))/(l2.gradient.x*l1.gradient.y - l1.gradient.x*l2.gradient.y);

        tmp.t2 = (l1.gradient.y*(l1.p.x - l2.p.x) + l1.gradient.x*(l2.p.y - l1.p.y))/(l2.gradient.x*l1.gradient.y - l1.gradient.x*l2.gradient.y);
    }
    else if(l2.gradient.x == 0 && l1.gradient.x!=0 && l2.gradient.y!=0) {
        tmp.t1 = (l2.p.x - l1.p.x)/l1.gradient.x;
        tmp.t2 = (-l1.p.x*l1.gradient.y + l1.gradient.x*l1.p.y - l1.gradient.x*l2.p.y + l2.p.x*l1.gradient.y)/(l1.gradient.x*l2.gradient.y);
    }
    else {
        tmp.exists = false;
    }

    if(!(0 <= tmp.t1 && tmp.t1 <= l1.l)) {
        tmp.exists = false;
    }
    else if(!(0 <= tmp.t2 && tmp.t2 <= l2.l)) {
        tmp.exists = false;
    }
    
    return tmp;
}

function LineCircleIntercept(l : Line, c : Circle) : Intercept {
    let tmp : Intercept = new Intercept(true, 0, 0);

    let xDelta = c.p.x - l.p.x;
    let yDelta = c.p.y - l.p.y;

    let a1 = Math.pow(l.gradient.x, 2) + Math.pow(l.gradient.y, 2);
    let b1 = -2 * (xDelta*l.gradient.x + yDelta*l.gradient.y);
    let c1 = Math.pow(xDelta, 2) + Math.pow(yDelta, 2) - Math.pow(c.radius, 2); 
    

    if(c.radius != 0 && 0 <= Math.pow(b1,2) - 4 * a1 * c1){
        
        tmp.t1 = (-1 * b1 - Math.sqrt(Math.pow(b1,2) - 4 * a1 * c1)) / (2 * a1);

        if(0 <= tmp.t1)
        {
            //place holder for t2 calculation
        }
        else
        {
            //place holder for t2 calculation
            tmp.t1 = (-1 * b1 + Math.sqrt(Math.pow(b1,2) - 4 * a1 * c1)) / (2 * a1);
            
        }
    }
    else{
        tmp.exists = false;
    }
    
    if(!(0 <= tmp.t1 && tmp.t1 <= l.l)) {
        tmp.exists = false;
    }
    
    return tmp;
}

function LineRectIntercept(l : Line, r : Rect) {
    let tmp : Intercept = new Intercept(false, 0, 0);
    for(let i1 : number = 0; i1 < 4; i1++)
    {
        tmp = LineLineIntercept(l, r.getEdge(i1));
        
        if(tmp.exists) {
            break;
        }
    }
    return tmp;
}