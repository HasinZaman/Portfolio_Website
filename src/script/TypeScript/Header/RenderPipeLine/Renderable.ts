import { Vector } from "../../Math/Vector";

/**
 * Renderable interface defines methods and states that would be required in order to render an object
 */
export interface Renderable {
    /**
     * getTriangles method returns an array of triangles that would be visible
     */
    getTriangles : (cameraDir: Vector, cameraPos: Vector) => Vector[]
}