import { randomFloatGenerator, randomIntGenerator, randomStringGenerator } from "../../Math/Random/Random";
import { Vector } from "../../Math/Vector";
import { Camera } from "../RenderPipeLine/Camera";
import { Pyramid } from "./Pyramid";

let svgCanvas = $("section#header > svg");

let cameraMountainRange : Camera = new Camera(1, 1, 0.5, 100);

let seed = "u3JBP^>hEm";

/**
 * main function generates  mountain range on call & binds generation on window resize
 */
export function main() {
    cameraMountainRange.pos = new Vector(-2, 0, 0);

    let initializeRange = () => {
        let tmp = generateMountainRange(getWidth(), getHeight(), seed);

        let inst = cameraMountainRange.draw(
            tmp,
            {width: getWidth(), height: getHeight()}
        );

        svgCanvas.html(inst.generate());
    }
    
    initializeRange();
    $(window).on("resize", initializeRange);
}

/**
 * generateMountainRange function creates a procedural mountain range
 * @param {number} width: width of svg environment
 * @param {number} height: height of svg environment
 * @param {string | number} seed: random seed to start generation process
 * @returns 
 */
function generateMountainRange(width:number, height:number, seed: string | number) : Pyramid[] {
    width = getWidth()
    height = getHeight();

    svgCanvas.attr("viewBox", `0 0 ${width} ${height}`);

    cameraMountainRange.width = width;

    let tmp: Pyramid[] = [];

    //use seed to generate random strings => to be used to initialize other random number generators
    let seedGenerator = randomStringGenerator(seed, 10, 10);

    //random rotation of pyramid
    let rotNext = () : number => {
        let next = randomFloatGenerator(seedGenerator());

        return next() * Math.PI * 2;
    }

    //random layer count of pyramids
    let layerNext = randomIntGenerator(seedGenerator(), 1, 2);

    //random base width of pyramid
    let minBase = 150;
    let maxBase = minBase * 3;
    let baseNext = () : number => {
        let next = randomFloatGenerator(seedGenerator());

        return next() * (maxBase - minBase) + minBase
    }

    //random height of pyramid
    let minHeight = 0.25;
    let maxHeight = 0.75;
    let groundLevel = -0.5;
    let heightNext = () : number => {
        let next = randomFloatGenerator(seedGenerator());

        return next() * (maxHeight - minHeight) + minHeight
    }


    //random y position (x-axis in 2d space)
    //generate from (0,0) and osculate generation for pyramids where y>0 & y<0
    let direction = -1;
    let lastX = [0,0]
    let minDist = 100;
    let maxDist = 200;
    let posNextY = (): number => {
        let yNext = () => {
            let next = randomFloatGenerator(seedGenerator());
            return next() * (maxDist - minDist) + minDist + minBase/2;
        }

        direction *= -1;

        return direction * yNext();
    }

    {//generate central pyramid
        let heightTmp = maxHeight;
        tmp.push(new Pyramid(layerNext(), heightTmp, baseNext(), new Vector(0, 0, heightTmp + groundLevel), rotNext()))
        maxHeight *= 0.75
    }
    
    //generate sibling pyramids
    while(width/-2 < lastX[0] || lastX[1] < width/2) {
        let y = posNextY();
        switch (direction) {
            case -1:
                y+= lastX[0];
                lastX[0] = y;
                break;
            case 1:
                y+= lastX[1];
                lastX[1] = y;
                break;
        }

        {
            let heightTmp = heightNext();    
            tmp.push(new Pyramid(layerNext(), heightTmp, baseNext(), new Vector(tmp.length * maxBase * 1.5, y, heightTmp + groundLevel), rotNext()))
        }
    }

    return tmp;
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