import { Vector } from "../SkillBalls/Vector";

export class CanvasController{
    
    private static instances = new Map<string, CanvasController>();

    public static factory(canvasID : string | JQuery, virtualSize : Vector, resolution : Vector) : CanvasController | undefined{
        
        let jQuery : JQuery;
        let id : string;
        let context : CanvasRenderingContext2D;

        if(typeof canvasID === "string") {
            jQuery = $(canvasID);
        }
        else {
            jQuery = canvasID;
        }

        if(jQuery[0] == undefined)
        {
            return undefined;
        }

        id = jQuery.attr("id") as string;

        if(!CanvasController.instances.has(id)) {
            context = (jQuery[0] as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;

            let tmp : CanvasController = new CanvasController(context, virtualSize, resolution);

            CanvasController.instances.set(id, tmp);

            //jQuery.css("width",`${tmp.resolution.x}px`);
            jQuery.attr("width",`${tmp.resolution.x}px`)
            //jQuery.css("height",`${tmp.resolution.y}px`);
            jQuery.attr("height",`${tmp.resolution.y}px`)
            
            //jQuery.css("transform",`scale(${1/tmp.scaleFactor.x},${1/tmp.scaleFactor.y})`);
        }

        return CanvasController.instances.get(id) as CanvasController;
    }

    private context: CanvasRenderingContext2D;

    private size : Vector;
    private resolution : Vector;
    private scaleFactor : Vector;

    private constructor(context : CanvasRenderingContext2D, virtualSize : Vector, resolution : Vector) {
        this.context = context;
        
        this.size = virtualSize;
        this.resolution = resolution;
        this.scaleFactor = new Vector(resolution.x / virtualSize.x, resolution.y / virtualSize.y);

        //this.context.scale(10, 10);
    }

    public drawLine(start : Vector, end : Vector, width : number, colour : string) : void {
        this.context.lineWidth = width * this.scaleFactor.x;
        this.context.strokeStyle = colour;

        //console.log("line")
        //console.log(start);
        //console.log(end);

        this.context.beginPath();
        this.context.moveTo(start.x * 10,   (this.size.y - start.y) * 10);
        this.context.lineTo(end.x * 10,     (this.size.y - end.y) * 10);
        this.context.closePath();
        
        this.context.stroke();
    }
    
    public clear() : void {
        this.context.clearRect(0, 0, this.resolution.x, this.resolution.y);
    }
}