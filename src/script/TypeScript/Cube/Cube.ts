import { AttrVal, HTMLElem } from "../HTMLBuilder/HTMLBuilder";

interface CubeFaces {
    front : JQuery,
    back : JQuery,
    left : JQuery,
    right : JQuery,
    up : JQuery,
    down : JQuery,
}

class Cube {
    private cube : JQuery; 
    constructor(cube: JQuery) {
        let cubeHTML : HTMLElem = new HTMLElem("div");

        ["front", "back", "left", "right", "up", "down"].forEach(
            (faceClass) => {
                let face : HTMLElem = new HTMLElem("div");
                face.get("class").push(new AttrVal(faceClass));

                cubeHTML.addChild(face);
            }
        )

        cube.html(cubeHTML.generate());
        cube.addClass("cube");
        cube.attr("front", "front")
        
        this.cube = cube;
    }
}