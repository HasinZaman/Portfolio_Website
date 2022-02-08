"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasController = void 0;
const Vector_1 = require("../SkillBalls/Vector");
class CanvasController {
    constructor(context, virtualSize, resolution) {
        this.context = context;
        this.size = virtualSize;
        this.resolution = resolution;
        this.scaleFactor = new Vector_1.Vector(resolution.x / virtualSize.x, resolution.y / virtualSize.y);
        //this.context.scale(10, 10);
    }
    static factory(canvasID, virtualSize, resolution) {
        let jQuery;
        let id;
        let context;
        if (typeof canvasID === "string") {
            jQuery = $(canvasID);
        }
        else {
            jQuery = canvasID;
        }
        if (jQuery[0] == undefined) {
            return undefined;
        }
        id = jQuery.attr("id");
        if (!CanvasController.instances.has(id)) {
            context = jQuery[0].getContext("2d");
            let tmp = new CanvasController(context, virtualSize, resolution);
            CanvasController.instances.set(id, tmp);
            //jQuery.css("width",`${tmp.resolution.x}px`);
            jQuery.attr("width", `${tmp.resolution.x}px`);
            //jQuery.css("height",`${tmp.resolution.y}px`);
            jQuery.attr("height", `${tmp.resolution.y}px`);
            //jQuery.css("transform",`scale(${1/tmp.scaleFactor.x},${1/tmp.scaleFactor.y})`);
        }
        return CanvasController.instances.get(id);
    }
    drawLine(start, end, width, colour) {
        this.context.lineWidth = width * this.scaleFactor.x;
        this.context.strokeStyle = colour;
        //console.log("line")
        //console.log(start);
        //console.log(end);
        this.context.beginPath();
        this.context.moveTo(start.x * 10, (this.size.y - start.y) * 10);
        this.context.lineTo(end.x * 10, (this.size.y - end.y) * 10);
        this.context.closePath();
        this.context.stroke();
    }
    clear() {
        this.context.clearRect(0, 0, this.resolution.x, this.resolution.y);
    }
}
exports.CanvasController = CanvasController;
CanvasController.instances = new Map();
//# sourceMappingURL=CanvasController.js.map