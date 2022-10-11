import { Vector } from "../../Math/Vector";
import { Camera } from "../RenderPipeLine/Camera";
import { randomStarDistribution } from "./StarGeneration";

let svgCanvas = $("section#header > svg");
let layer = $("section#header > svg > g#starSystem");

let camera : Camera = new Camera(1, 1, 0.5, 100);

let seed = "Sfe-x24"

export function main() {
    //camera initialize
    camera.width = getWidth();
    camera.height = getHeight();
    camera.pos = new Vector(-2, Math.cos(Math.PI / 2) * getWidth() / 2, Math.sin(Math.PI / 2) * getHeight() / 2);
    
    //generate stars
    let stars = randomStarDistribution(camera.width, camera.height, seed);
    
    //star update
    let theta = 0;
    let starUpdate = (delta: number) => {
        theta = (theta + delta) % (Math.PI * 2);

        camera.pos = new Vector(-2, Math.cos(theta) * camera.width / 2, Math.sin(theta) * camera.width / 2);

        let tmp = 2 * Math.PI - (theta + (3 * Math.PI/2)) % (Math.PI * 2);

        camera.rot.w = Math.cos(tmp/2);
        camera.rot.x = Math.sin(tmp/2);

        let inst = camera.draw(
            stars,
            {width: getWidth(), height: getHeight()}
        );

        layer.html(inst.generateChildren());
    }

    starUpdate(0.001);
    $(window).on(
        "resize",
        () => {
            camera.width = getWidth();
            camera.height = getHeight();
            
            stars = randomStarDistribution(camera.width, camera.height, seed);

            starUpdate(0)
        }
    );

    let deltaTime = 1000/30;
    let update = () => {
        starUpdate(0.00025);
        setTimeout(update, deltaTime);
    }
    setTimeout(update, deltaTime);
}

function getWidth() : number {
    let tmp = svgCanvas.width();
    if(tmp !== undefined) {
        return tmp;
    }
    throw new Error();
}
function getHeight() : number {
    let tmp = svgCanvas.height();
    if(tmp !== undefined) {
        return tmp;
    }
    throw new Error();
}