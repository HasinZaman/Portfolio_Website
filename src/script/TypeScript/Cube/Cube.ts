import { AttrVal, HTMLElem } from "../HTMLBuilder/HTMLBuilder";
import { Generator } from "./CycleGroup";

/**
 * CubeFaces interface defines object of all faces relative to user perspective
 */
export interface CubeFaces {
    front : JQuery,
    back : JQuery,
    left : JQuery,
    right : JQuery,
    up : JQuery,
    down : JQuery,
}

/**
 * Cube class handles the creation and updating of HTML cube
 */
export class Cube {
    private cube : JQuery; 

    /**
     * rho handles 90 deg rotation of cube along y axis
     */
    private static rho = new Generator([3, 2, 0, 1, 4, 5]);
    /**
     * phi handles 90 deg rotation of cube along x axis
     */
    private static phi = new Generator([4, 5, 2, 3, 1, 0]);

    /**
     * JQuery of face div's of cube
     * @type {CubeFaces}
     */
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

    /**
     * front sets front most face
     * @param {string} val
     */
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

    /**
     * @constructor creates cube at cube
     * @param {JQuery} cube
     */
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