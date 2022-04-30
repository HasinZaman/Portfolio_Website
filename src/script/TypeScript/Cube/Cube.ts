import { AttrVal, HTMLElem } from "../HTMLBuilder/HTMLBuilder";
import { Generator } from "./CycleGroup";

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

    private static rho = new Generator([3, 2, 0, 1, 4, 5]);//y axis rotation
    private static phi = new Generator([4, 5, 2, 3, 1, 0]);//x axis rotation

    public get faces() : CubeFaces {
        let _faces : JQuery[] = [
            this.cube.find(".front"),
            this.cube.find(".back"),
            this.cube.find(".left"),
            this.cube.find(".right"),
            this.cube.find(".up"),
            this.cube.find(".down"),
        ]
        switch (this.cube.attr("front")) {
            case "front":
                break;
            case "back":
                for(let i1 = 0; i1 < 2; i1++) {
                    _faces = Cube.rho.next(_faces);
                }
                break;
            case "left":
                for(let i1 = 0; i1 < 1; i1++) {
                    _faces = Cube.rho.next(_faces);
                }
                break;
            case "right":
                for(let i1 = 0; i1 < 3; i1++) {
                    _faces = Cube.rho.next(_faces);
                }
                break;
            case "up":
                for(let i1 = 0; i1 < 3; i1++) {
                    _faces = Cube.phi.next(_faces);
                }
                break;
            case "down":
                for(let i1 = 0; i1 < 0; i1++) {
                    _faces = Cube.phi.next(_faces);
                }
                break;
        }

        return {
            front : _faces[0],
            back : _faces[1],
            left : _faces[2],
            right : _faces[3],
            up : _faces[4],
            down : _faces[5],
        };
    }

    public set front(val : string) {
        switch(val) {
            case "front":
                this.cube.attr("front", "front");
                break;
            case "back":
                this.cube.attr("front", "back");
                break;
            case "left":
                this.cube.attr("front", "left");
                break;
            case "right":
                this.cube.attr("front", "right");
                break;
            case "up":
                this.cube.attr("front", "up");
                break;
            case "down":
                this.cube.attr("front", "down");
                break;
        }
    }

    constructor(cube: JQuery) {
        let cubeHTML : HTMLElem = new HTMLElem("");

        ["front", "back", "left", "right", "up", "down"].forEach(
            (faceClass) => {
                let face : HTMLElem = new HTMLElem("div");
                face.get("class").push(new AttrVal(faceClass));

                cubeHTML.addChild(face);
            }
        )

        cube.html(cubeHTML.generateChildren());
        cube.addClass("cube");
        cube.attr("front", "front")
        
        this.cube = cube;
    }

}