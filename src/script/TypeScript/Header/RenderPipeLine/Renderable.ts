import { HTMLElem } from "../../HTMLBuilder/HTMLBuilder";
import { Vector } from "../../Math/Vector";


/**
 * Renderable interface defines methods and states that would be required in order to render an object
 */
export interface Renderable {
    /**
     * getTriangles method returns an array of triangles that would be visible. The method is very similar to what a vertex shader.
     * @param {Vector} cameraDir
     * @param {Vector} cameraPos
     * @returns {Vector[]}
     */
    getTriangles : (cameraDir: Vector, cameraPos: Vector) => Vector[];

    /**
     * draw method returns an HTMLElem to be inserted into an svg element to generate an image
     */
    draw: (tmp: Vector[]) => HTMLElem
}