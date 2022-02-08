import { AttrVal, HTMLElem } from "../HTMLBuilder/HTMLBuilder";
import { BezierCurve } from "./BezierCurve";
import { Circle } from "./Circle";
import { Line } from "./Line";
import { Vector } from "./Vector";

interface IRadiusAnimation {
    duration : number;
    time : number;
    animationCurve : BezierCurve;
    target : number;
}

export class Edge {
    ball1 : SkillBall;
    ball2 : SkillBall;

    constructor(ball1 : SkillBall, ball2 : SkillBall) {
        if(ball1.id < ball2.id) {
            this.ball1 = ball1;
            this.ball2 = ball2;
        }
        else {
            this.ball2 = ball1;
            this.ball1 = ball2;
        }
    }
}

export class SkillBall extends Circle
{
    static mediaImageFolder : string = "src\\media\\img\\icons"

    static creationAnimation : BezierCurve = new BezierCurve([
        new Vector(0,0),
        new Vector(1,0),
        new Vector(0.1,1.5),
        new Vector(1,1)
    ]);
    static defaultAnimation : BezierCurve = new BezierCurve([
        new Vector(0,0),
        new Vector(1,1)
    ]);

    //id
    id : number;

    //cached values
    intialRadius : number;
    radiusAnim : IRadiusAnimation | null = null;

    //physics
    slowCond : boolean = true;
    vel : Vector;
    mass : number;
    private movementLine : Line;

    //css values
    scale : number;

    //DOM refrence
    element : JQuery;
    iconName : string;

    //connected balls
    connections : number[] = [];
    static edgeList : Edge[] = [];

    static addEdge(ball1 : SkillBall, ball2 : SkillBall) : void {
        let tmp : Edge = new Edge(ball1, ball2);

        if(this.edgeList.length == 0) {
            this.edgeList.push(tmp);
            return;
        }
        
        let id1, id2;
        
        id1 = tmp.ball1.id;
        id2 = tmp.ball2.id;

        if(id1 == id2) {
            return;
        }

        let start : number = 0;
        let end : number = this.edgeList.length - 1;
        let pointer : number;
        let edgeTmp : Edge;
        while(end - start < 0) {
            pointer = start + Math.floor((end - start)/2);
            
            edgeTmp = this.edgeList[pointer];
            if(edgeTmp.ball1.id == id1){
                if(edgeTmp.ball2.id == id2){
                    return ;
                }

                //first half
                if(id2 < edgeTmp.ball2.id) {
                    end = pointer;
                }//secodn half
                else {
                    start = pointer;
                }
            }
            else if(id1 < edgeTmp.ball1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        
        if(edgeTmp.ball1.id == id1 && edgeTmp.ball2.id == id2){
            return ;
        }
        this.edgeList.splice(start+1, 0, tmp);
    }
    static findEdge(ball1 : SkillBall | number, ball2 : SkillBall | number) : Edge | null {
        if(this.edgeList.length == 0) {
            return null;
        }
        
        let id1, id2;
        
        if(ball1 instanceof SkillBall) {
            id1 = ball1.id;
        }
        else {
            id1 = ball1 as number;
        }

        if(ball2 instanceof SkillBall) {
            id2 = ball2.id;
        }
        else {
            id2 = ball2 as number;
        }

        if(id2 < id1) {
            let tmp : number = id1;
            id1 = id2;
            id2 = tmp;
        }

        let start : number = 0;
        let end : number = this.edgeList.length - 1;
        let pointer : number;
        let edgeTmp : Edge;
        while(end - start < 0) {
            pointer = start + Math.floor((end - start)/2);
            
            edgeTmp = this.edgeList[pointer];
            if(edgeTmp.ball1.id == id1){
                if(edgeTmp.ball2.id == id2){
                    return edgeTmp;
                }

                //first half
                if(id2 < edgeTmp.ball2.id) {
                    end = pointer;
                }//secodn half
                else {
                    start = pointer;
                }
            }
            else if(id1 < edgeTmp.ball1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        
        if(edgeTmp.ball1.id == id1 && edgeTmp.ball2.id == id2){
            return edgeTmp;
        }

        return null;
    }

    constructor(id : number, radius : number, start : Vector, intialVelocity : Vector, mass : number, environment : JQuery, iconName : string) {
        super(radius, start);

        this.intialRadius = radius;

        this.id = id;
        this.vel = intialVelocity;
        this.mass = mass;
        this.scale = 1;
        this.iconName = iconName

        this.element = this.buidHTML(this.id, this.iconName, environment);

        this.movementLine = new Line(this.p, this.vel, -1);

        this.setRadius(0);
        this.setLerpRadius(radius * 0.5, 0.5, SkillBall.creationAnimation);
    }

    private buidHTML(id : number, iconName : string, environment : JQuery) : JQuery {
        let elem : HTMLElem = new HTMLElem("div");
        let image : HTMLElem = new HTMLElem("img");

        let ballId : AttrVal[] = elem.get("id");
        ballId.push(new AttrVal(`ball-${id}`));

        let ballclass : AttrVal[] = elem.get("class");
        ballclass.push(new AttrVal("ball"));

        let imageLocation : AttrVal[] = image.get("src");
        imageLocation.push(new AttrVal(`${SkillBall.mediaImageFolder}\\${iconName}_icon.svg`))

        elem.addChild(image);

        //create dom
        environment.append(elem.generate());
        let tmp : JQuery = environment.find(`#ball-${id}`);;

        //setting functionality
        let skillBall : SkillBall = this;

        tmp.on("click", function() {
            skillBall.onClick();
        })
        
        tmp.on("mouseenter", function() {
            skillBall.onMouseEnter();
        })
        
        tmp.on("mouseleave", function() {
            skillBall.onMouseLeave();
        })

        return tmp;
    }

    private onMouseEnter() : void {
        this.setLerpRadius(this.intialRadius, 0.25, null);
        this.slowCond = false;
    }
    
    private onMouseLeave() : void {
        this.setLerpRadius(this.intialRadius * 0.5, 0.25, null);
        this.slowCond = true;
    }

    private onClick() : void {
        this.foo("click",this.id,this.iconName)
    }

    public foo(action : string, id : number, iconName : string) {
        console.log(`${action}:${id}-${iconName}`);
    }

    public bounce(collisionPlane  : Vector) : void
    {
        let parallel : Vector = collisionPlane;
        
        let orthogonal : Vector = new Vector(parallel.y, -1 * parallel.x);
        
        let v1 : Vector = Vector.mult(Vector.projection(this.vel, orthogonal), -1);
        let v2 : Vector = Vector.projection(this.vel, parallel);
        
        this.vel = Vector.add(v1, v2);
    }

    public setLerpRadius(radius : number, duration : number | null, animationCurve : BezierCurve | null | undefined) : boolean {
        if(radius < 0) {
            return false;
        }

        let animation : BezierCurve;

        if(animationCurve == null || animationCurve == undefined) {
            animation = SkillBall.defaultAnimation.Clone();
        }
        else {
            animation = animationCurve.Clone();
        }

        let durationTmp : number;

        if(duration == null || duration == undefined) {
            durationTmp = 1;
        }
        else {
            durationTmp = duration;
        }

        let delta : number = radius - this.radius;
        let start : number = this.radius;

        animation.parameters.forEach(p => {
            p.y = start + delta * p.y;
        });

        this.radiusAnim = {
            duration : durationTmp,
            time : 0,
            animationCurve : animation,
            target : radius
        }

        return true;
    }

    public setRadius(radius : number) : boolean {
        if(radius < 0) {
            return false;
        }

        this.radius = radius;
        this.scale = radius / this.intialRadius;
        return true;
    }

    private updateRadius(time : number) : void {
        if(this.radiusAnim == null) {
            return;
        }

        let deltaRadius = Math.abs(this.radius - this.radiusAnim.target);

        if(deltaRadius > 0.01) {
            this.radiusAnim.time+= time;

            let pos : number = this.radiusAnim.time / this.radiusAnim.duration;

            if(pos > 1) {
                this.radius = this.radiusAnim.target;
                return;
            }

            this.setRadius(this.radiusAnim.animationCurve.getPoint(pos).y);
        }
        else {
            this.radiusAnim = null;
        }
    }

    public toString() : string {
        return `radius:${this.radius}\np:${this.p.x},${this.p.y}\ndir:${this.vel.x},${this.vel.y}`
    }

    public move(time : number) {
        if(!this.slowCond) {
            time = time/4;
        }
        this.movementLine.p = this.p;
        this.movementLine.gradient = this.vel;

        this.p = this.movementLine.getPoint(time);

        //update radius
        this.updateRadius(time);
    }


    public destroy() : void {
        let edge : Edge;
        for(let i1 = SkillBall.edgeList.length - 1; i1 >= 0; i1--) {
            edge = SkillBall.edgeList[i1];
            
            if(edge.ball1.id == this.id || edge.ball2.id == this.id) {
                SkillBall.edgeList.splice(i1, 1);
            }
        }
    }
}