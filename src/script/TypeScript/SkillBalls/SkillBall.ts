import { AttrVal, HTMLElem, StyleAttr } from "../HTMLBuilder/HTMLBuilder";
import { BezierCurve } from "./BezierCurve";
import { Circle } from "./Circle";
import { Line } from "./Line";
import { Vector } from "./Vector";

/**
 * IRadiusAnimation is an interface that defines how a ball should animate
 */
interface IRadiusAnimation {
    /**
     * duration: the number of seconds for a given radius animation
     */
    duration : number;
    /**
     * time: The initial start time
     */
    time : number;
    /**
     * animationCurve: BezierCurve of rate of change of animation
     */
    animationCurve : BezierCurve;
    /**
     * target: final ball radius
     */
    target : number;
}

/**
 * Edge class defines data and methods related to lines between balls
 */
export class Edge {
    /**
     * svgJquery: HTML element that in which edges are drawn upon
     */
    private static svgJquery : JQuery = $("svg").parent();
    /**
     * svg: HTMLElem object that generates HTML DOM
     */
    private static svg : HTMLElem = new HTMLElem("svg");
    /**
     * size: Define the length and width of HTMLElem
     */
    private static size : Vector = new Vector(0, 0);

    /**
     * defaultWidth: Width of default edge between balls
     */
    static defaultWidth : number = 3;
    /**
     * focusedWidth: Width of focused edge
     * focused edge should be used to bring attention to certain edges
     */
    static focusedWidth : number = 10;
    
    /**
     * setSVGElemSize method sets the width and height of SVG object
     * @param {number} width
     * @param {number} height 
     */
    public static setSVGElemSize(width : number, height : number) {
        Edge.size.x = width;
        Edge.size.y = height;
        
        if(this.svg.get("width").length == 0) {
            this.svg.get("width").push(new AttrVal(width.toString()));
        }
        else {
            this.svg.get("width")[0].value = width.toString();
        }

        if(this.svg.get("height").length == 0) {
            this.svg.get("height").push(new AttrVal(height.toString()));
        }
        else {
            this.svg.get("height")[0].value = height.toString();
        }
        
    }

    /**
     * updateSVGElem updates edges on SVG element
     * @param edges array of edges that are being updated
     */
    public static updateSVGElem(edges : Edge[]) {
        Edge.svgJquery.html(Edge.svg.generate());
    }

    //connections
    /**
     * ball1: reference of ball of starting position
     */
    ball1 : SkillBall;
    /**
     * ball2: reference of ball of ending position
     */
    ball2 : SkillBall;

    //properties
    /**
     * width: width of edge between ball1 and ball2
     */
    width : number;
    
    //line Element
    /**
     * line: HTMLElem of edge
     */
    line : HTMLElem;

    /**
     * Edge constructor creates Edge instance
     * @constructor
     * @param {SkillBall} ball1: reference of starting ball
     * @param {SkillBall} ball2: reference of ending ball
     * @throws {Error} will throw error if ball1 and ball2 reference the same edge
     */
    constructor(ball1 : SkillBall, ball2 : SkillBall) {
        if(ball1.id == ball2.id) {
            throw Error("Edge cannot connect ball to itself")
        }
        if(ball1.id < ball2.id) {
            this.ball1 = ball1;
            this.ball2 = ball2;
        }
        else {
            this.ball2 = ball1;
            this.ball1 = ball2;
        }

        this.width = Edge.defaultWidth;

        let tmp : HTMLElem = new HTMLElem("line");
        let id : string = `line-${this.ball1.id}-${this.ball2.id}`;

        tmp.get("id").push(new AttrVal(id));

        this.line = new HTMLElem("line");

        this.line.get("style").push(new StyleAttr("stroke-width", this.width.toString()));

        this.line.get("x1").push(new AttrVal("0px"));
        this.line.get("y1").push(new AttrVal("0px"));
        this.line.get("x2").push(new AttrVal("0px"));
        this.line.get("y2").push(new AttrVal("0px"));

        this.updateLine();

        Edge.svg.addChild(this.line);
    }

    /**
     * updateLine method update attributes of line
     */
    public updateLine() : void {
        this.line.get("style")[0].value = this.width.toString();

        this.line.get("x1")[0].value = `${this.ball1.p.x}px`;
        this.line.get("y1")[0].value = `${Edge.size.y - this.ball1.p.y}px`;

        this.line.get("x2")[0].value = `${this.ball2.p.x}px`;
        this.line.get("y2")[0].value = `${Edge.size.y - this.ball2.p.y}px`;
    }
}

/**
 * SkillBall class handles data related to skill balls in environment
 * @extends {Circle}
 */
export class SkillBall extends Circle
{

    /**
     * mediaImageFolder: Static const that defines location of icons
     */
    public static readonly mediaImageFolder: string = "src\\media\\img\\icons"

    /**
     * creationAnimation: Static const that defines default creation animation curve
     */
    public static get creationAnimation(): BezierCurve {
        return new BezierCurve([
            new Vector(0,0),
            new Vector(1,0),
            new Vector(0.1,1.5),
            new Vector(1,1)
        ])
    };

    /**
     * defaultAnimation: Static const that defines default animation curve
     */
    public static get defaultAnimation(): BezierCurve {
        return new BezierCurve([
            new Vector(0,0),
            new Vector(1,1)
        ])
    };

    //id
    /**
     * id: unique of number skill ball
     */
    id : number;

    //cached values
    /**
     * initialRadius: cached value radius before animation
     */
    initialRadius : number;
    /**
     * radiusAnim: cached values of playing animation
     */
    radiusAnim : IRadiusAnimation | null = null;

    //physics
    /**
     * slowCond: defines whether the ball is traveling in slow motion
     */
    slowCond : boolean = true;
    /**
     * vel: physics value used to represent velocity of ball
     */
    vel : Vector;
    /**
     * mass: physics value used to represent mass of ball
     */
    mass : number;
    /**
     * movementLine: cached Line object used to find next ball position
     */
    private movementLine : Line;

    //css values
    /**
     * scale: scale defines the size of ball
     */
    scale : number;

    //DOM reference
    /**
     * element: reference to ball DOM
     */
    element : JQuery;
    /**
     * iconName: name of icon
     */
    iconName : string;

    //connected balls
    /**
     * connections: array of connections that link balls
     */
    connections : Edge[] = [];
    /**
     * edgeList: static array of all edges
     */
    static edgeList : Edge[] = [];

    /**
     * addEdge method adds an edge between ball1 and ball2
     * @param {SkillBall} ball1
     * @param {SkillBall} ball2  
     */
    static addEdge(ball1 : SkillBall, ball2 : SkillBall) : void {
        let edge : Edge = new Edge(ball1, ball2);

        if(this.edgeList.length == 0) {
            this.edgeList.push(edge);
            ball1.connections.push(edge);
            ball2.connections.push(edge);
            return;
        }
        
        let id1, id2;
        
        id1 = edge.ball1.id;
        id2 = edge.ball2.id;

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
                }//second half
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

        ball1.connections.push(edge);
        ball2.connections.push(edge);

        this.edgeList.splice(start+1, 0, edge);
    }

    /**
     * findEdge method finds edge that connects ball1 and ball2.
     * Order of ball1 and ball2 does not matter
     * @param {SkillBall | number} ball1: reference or id of ball
     * @param {SkillBall | number} ball2: reference or id of ball 
     * @returns {Edge | null} Edge is returned if it exists else, null is returned
     */
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
                }//second half
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

    /**
     * constructor creates Skill Ball
     * @constructor
     * @param {number} id: id of skill ball
     * @param {number} radius: initial radius of skill ball
     * @param {Vector} start: vector position of start position
     * @param {Vector} initialVelocity: initial velocity of skill ball
     * @param {number} mass: mass of skill ball
     * @param {JQuery} environment: JQuery object that references the HTML physics ball environment
     * @param {string} iconName: name of skill ball
     */
    constructor(id : number, radius : number, start : Vector, initialVelocity : Vector, mass : number, environment : JQuery, iconName : string) {
        super(radius, start);

        this.initialRadius = radius;

        this.id = id;
        this.vel = initialVelocity;
        this.mass = mass;
        this.scale = 1;
        this.iconName = iconName

        this.element = this.buildHTML(environment);

        this.movementLine = new Line(this.p, this.vel, -1);

        this.setRadius(0);
        this.setRadiusAnimation(radius * 0.5, 0.5, SkillBall.creationAnimation);
    }

    /**
     * utility method to create HTML DOM required to make Skill Ball in environment 
     * @param {JQuery} environment: JQuery object that references the HTML physics ball environment
     * @returns {JQuery} JQuery object that references HTML DOM of skill ball
     */
    private buildHTML(environment : JQuery) : JQuery {
        let elem : HTMLElem = new HTMLElem("div");
        let image : HTMLElem = new HTMLElem("img");

        let ballId : AttrVal[] = elem.get("id");
        ballId.push(new AttrVal(`ball-${this.id}`));

        let ballClass : AttrVal[] = elem.get("class");
        ballClass.push(new AttrVal("ball"));

        let imageLocation : AttrVal[] = image.get("src");
        imageLocation.push(new AttrVal(`${SkillBall.mediaImageFolder}\\${this.iconName}_icon.svg`))

        elem.addChild(image);

        //create dom
        environment.append(elem.generate());
        let tmp : JQuery = environment.find(`#ball-${this.id}`);;

        //setting functionality
        let skillBall : SkillBall = this;

        tmp.on("click", function() {
            //openInfoBox(skillBall.iconName);
        })
        
        tmp.on("mouseenter", function() {
            skillBall.onMouseEnter();
        })
        
        tmp.on("mouseleave", function() {
            skillBall.onMouseLeave();
        })

        return tmp;
    }

    /**
     * onMouseEnter method defines skill ball behavior when mouse begins to hover on skill ball
     */
    private onMouseEnter() : void {
        this.setRadiusAnimation(this.initialRadius, 0.25, null);
        this.slowCond = false;

        this.connections.forEach(edge => {
            edge.width = Edge.focusedWidth;
        });
    }
    
    /**
     * onMouseLeave method defines skill ball behavior when mouse stops hovering on skill ball
     */
    private onMouseLeave() : void {
        this.setRadiusAnimation(this.initialRadius * 0.5, 0.25, null);
        this.slowCond = true;

        this.connections.forEach(edge => {
            edge.width = Edge.defaultWidth;
        });
    }

    /**
     * onClick method defines skill ball behavior when mouse clicks on skill ball
     */
    private onClick() : void {
        //this.foo("click",this.id,this.iconName)
    }

    /**
     * bounce updates skill ball velocity based on bounce plane
     * @param {Vector} collisionPlane direction of plane in which a bounce occurs
     */
    public bounce(collisionPlane  : Vector) : void
    {
        let parallel : Vector = collisionPlane;
        
        let orthogonal : Vector = new Vector(parallel.y, -1 * parallel.x);
        
        let v1 : Vector = Vector.mult(Vector.projection(this.vel, orthogonal), -1);
        let v2 : Vector = Vector.projection(this.vel, parallel);
        
        this.vel = Vector.add(v1, v2);
    }

    /**
     * setRadiusAnimation method sets radius based on animationCurve
     * @param {number} radius: new radius of skill ball
     * @param {number | null} duration: number of seconds for a radius interpolate animation
     * @param {BezierCurve | null | undefined} animationCurve: animation curve interpolation
     * @returns {boolean} boolean whether animation has been set
     */
    public setRadiusAnimation(radius : number, duration : number | null, animationCurve : BezierCurve | null | undefined) : boolean {
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

    /**
     * setRadius sets the radius of skill ball
     * @deprecated
     * @param {number} radius: new radius of skill ball 
     * @returns: boolean if new radius is set
     */
    public setRadius(radius : number) : boolean {
        if(radius < 0) {
            return false;
        }

        this.radius = radius;
        this.scale = radius / this.initialRadius;
        return true;
    }

    /**
     * updateRadius method updates radius based on timeDelta and radius animation curve
     * @param {number} timeDelta: delta time used to calculate new radius
     */
    private updateRadius(timeDelta : number) : void {
        if(this.radiusAnim == null) {
            return;
        }

        let deltaRadius = Math.abs(this.radius - this.radiusAnim.target);

        if(deltaRadius > 0.01) {
            this.radiusAnim.time+= timeDelta;

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

    /**
     * toString returns a string of Skill Ball
     * @returns {String} string representation of skill ball
     */
    public toString() : string {
        return `radius:${this.radius}\np:${this.p.x},${this.p.y}\ndir:${this.vel.x},${this.vel.y}`
    }

    /**
     * move method moves ball
     * @param {number} deltaTime: delta time used to calculate new ball position & ball radius
     */
    public move(deltaTime : number) {
        if(!this.slowCond) {
            deltaTime = deltaTime/4;
        }
        this.movementLine.p = this.p;
        this.movementLine.gradient = this.vel;

        this.p = this.movementLine.getPoint(deltaTime);

        //update radius
        this.updateRadius(deltaTime);
    }

    /**
     * destroy method handles the deconstruction of SkillBall
     */
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