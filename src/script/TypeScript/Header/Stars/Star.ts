import { AttrVal, HTMLElem, StyleAttr } from "../../HTMLBuilder/HTMLBuilder";
import { BezierCurve } from "../../Math/Paths/BezierCurve";
import { Circle } from "../../Math/Paths/Circle";
import { Line } from "../../Math/Paths/Line";
import { Vector } from "../../Math/Vector";

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
    private static svgJquery : JQuery = $("#header #constellation");
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
     * setSVGElemSize method sets the width and height of SVG object
     * @param {number} width
     * @param {number} height 
     */
    public static setSVGElemSize(width : number, height : number) {
        Edge.size.x = width;
        Edge.size.y = height;
        
        if(Edge.svg.get("width").length == 0) {
            Edge.svg.get("width").push(new AttrVal(width.toString()));
        }
        else {
            Edge.svg.get("width")[0].value = width.toString();
        }

        if(Edge.svg.get("height").length == 0) {
            Edge.svg.get("height").push(new AttrVal(height.toString()));
        }
        else {
            Edge.svg.get("height")[0].value = height.toString();
        }
        
    }

    /**
     * updateSVGElem updates edges on SVG element
     * @param edges array of edges that are being updated
     */
    public static updateSVGElem(edges : Edge[]) {
        Edge.svgJquery.html(Edge.svg.generateChildren());
        Edge.svgJquery.attr("height", Edge.svg.get("height")[0].value)
        Edge.svgJquery.attr("width", Edge.svg.get("width")[0].value)
    }

    //connections
    /**
     * ball1: reference of ball of starting position
     */
    star1 : Star;
    /**
     * ball2: reference of ball of ending position
     */
    star2 : Star;

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
     * @param {Star} star1: reference of starting ball
     * @param {Star} star2: reference of ending ball
     * @throws {Error} will throw error if ball1 and ball2 reference the same edge
     */
    constructor(star1 : Star, star2 : Star) {
        if(star1.id == star2.id) {
            throw Error("Edge cannot connect ball to itself")
        }

        if(star1.id < star2.id) {
            this.star1 = star1;
            this.star2 = star2;
        }
        else {
            this.star2 = star1;
            this.star1 = star2;
        }

        this.width = Edge.defaultWidth;

        let tmp : HTMLElem = new HTMLElem("line");
        let id : string = `line-${this.star1.id}-${this.star2.id}`;

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

        this.line.get("x1")[0].value = `${this.star1.p.x}px`;
        this.line.get("y1")[0].value = `${Edge.size.y - this.star1.p.y}px`;

        this.line.get("x2")[0].value = `${this.star2.p.x}px`;
        this.line.get("y2")[0].value = `${Edge.size.y - this.star2.p.y}px`;
    }
}

/**
 * SkillBall class handles data related to skill balls in environment
 * @extends {Circle}
 */
export class Star extends Circle
{
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
     * vel: physics value used to represent velocity of ball
     */
    vel : Vector;
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
     * @param {Star} ball1
     * @param {Star} ball2  
     */
    static addEdge(ball1 : Star, ball2 : Star) : void {
        let edge : Edge = new Edge(ball1, ball2);

        if(this.edgeList.length == 0) {
            this.edgeList.push(edge);
            ball1.connections.push(edge);
            ball2.connections.push(edge);
            return;
        }
        
        let id1, id2;
        
        id1 = edge.star1.id;
        id2 = edge.star2.id;

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
            if(edgeTmp.star1.id == id1){
                if(edgeTmp.star2.id == id2){
                    return ;
                }

                //first half
                if(id2 < edgeTmp.star2.id) {
                    end = pointer;
                }//second half
                else {
                    start = pointer;
                }
            }
            else if(id1 < edgeTmp.star1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        

        if(edgeTmp.star1.id == id1 && edgeTmp.star2.id == id2){
            return ;
        }

        ball1.connections.push(edge);
        ball2.connections.push(edge);

        this.edgeList.splice(start+1, 0, edge);
    }

    /**
     * findEdge method finds edge that connects ball1 and ball2.
     * Order of ball1 and ball2 does not matter
     * @param {Star | number} ball1: reference or id of ball
     * @param {Star | number} ball2: reference or id of ball 
     * @returns {Edge | null} Edge is returned if it exists else, null is returned
     */
    static findEdge(ball1 : Star | number, ball2 : Star | number) : Edge | null {
        if(this.edgeList.length == 0) {
            return null;
        }
        
        let id1, id2;
        
        if(ball1 instanceof Star) {
            id1 = ball1.id;
        }
        else {
            id1 = ball1 as number;
        }

        if(ball2 instanceof Star) {
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
            if(edgeTmp.star1.id == id1){
                if(edgeTmp.star2.id == id2){
                    return edgeTmp;
                }

                //first half
                if(id2 < edgeTmp.star2.id) {
                    end = pointer;
                }//second half
                else {
                    start = pointer;
                }
            }
            else if(id1 < edgeTmp.star1.id) {
                end = pointer;
            }
            else {
                start = pointer;
            }
        }
        edgeTmp = this.edgeList[start];
        
        if(edgeTmp.star1.id == id1 && edgeTmp.star2.id == id2){
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
    constructor(id : number, radius : number, start : Vector, initialVelocity : Vector, environment : JQuery) {
        let radiusTmp : number = radius * (Math.random() + 0.5);
        super(radiusTmp, start);

        this.initialRadius = radiusTmp;

        this.id = id;
        this.vel = initialVelocity;
        this.scale = 1;

        this.element = this.buildHTML(environment);

        this.movementLine = new Line(this.p, this.vel, -1);

        this.setRadius(0);
        this.setRadiusAnimation(radius * 0.5, 0.5, Star.creationAnimation);
    }

    /**
     * utility method to create HTML DOM required to make Skill Ball in environment 
     * @param {JQuery} environment: JQuery object that references the HTML physics ball environment
     * @returns {JQuery} JQuery object that references HTML DOM of skill ball
     */
    private buildHTML(environment : JQuery) : JQuery {
        let elem : HTMLElem = new HTMLElem("div");

        elem.get("style").push(new StyleAttr("width",`${this.radius*2}px`));
        elem.get("style").push(new StyleAttr("height",`${this.radius*2}px`));

        let duration = 60;

        elem.get("style").push(
            new StyleAttr(
                "animation-duration",
                `${
                    60*Math.random()+60
                }s`
            )
        );
        elem.get("style").push(
            new StyleAttr(
                "animation-delay",
                `${
                    60*Math.random()
                }s`
            )
        );
        
        let getDir = () => {
            if(Math.random() < 0.5) {
                return "reverse"
            }
            else {
                return "normal"
            }
        }

        elem.get("style").push(new StyleAttr("animation-direction", `${getDir()}`));

        elem.get("class").push(new AttrVal("star"));
        elem.get("id").push(new AttrVal(`star-${this.id}`));
        //create dom
        environment.append(elem.generate());
        let tmp : JQuery = environment.find(`#star-${this.id}`);;

        return tmp;
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

        if(animationCurve == null) {
            animation = Star.defaultAnimation.Clone();
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
        for(let i1 = Star.edgeList.length - 1; i1 >= 0; i1--) {
            edge = Star.edgeList[i1];
            
            if(edge.star1.id == this.id || edge.star2.id == this.id) {
                Star.edgeList.splice(i1, 1);
            }
        }
    }
}