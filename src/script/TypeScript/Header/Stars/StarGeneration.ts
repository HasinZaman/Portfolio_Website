import { randomFloatGenerator, randomIntGenerator, randomStringGenerator } from "../../Math/Random/Random";
import { Vector } from "../../Math/Vector";
import { Star } from "./Star";


/**
 * randomStarDistribution creates a random star-y sky
 * @param {number} width: width of sky
 * @param {number} height: height of sky 
 * @param {string | number} seed: random seed to start generation process
 * @returns {Star[]} array of star objects
 */
export function randomStarDistribution(width:number, height:number, seed: string | number) : Star[] {
    let stars = []
    let seedNext = randomStringGenerator(seed, 10, 10);

    let radMax = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    let rad = 0;

    let radIncrementNext;
    {
        let minIncrRad = 50;
        let maxIncrRad = 100;
        let next = randomFloatGenerator(seedNext());

        radIncrementNext = () => {
            return next() * (maxIncrRad - minIncrRad) + minIncrRad;
        }
    }

    let rotNext; 
    {
        let next = randomFloatGenerator(seedNext())

        rotNext = () => {
            return next() * Math.PI/2;
        }
    }

    let posVariance;
    {
        let minVar = 20;
        let maxVar = 50;

        let signNext = randomIntGenerator(seedNext(),0,1);
        let next = randomFloatGenerator(seedNext());

        posVariance = () => {
            return new Vector(
                (2 * signNext() - 1) * (next() * (maxVar - minVar) + minVar),
                (2 * signNext() - 1) * (next() * (maxVar - minVar) + minVar)
            )
        }
    }

    let sizeNext;
    {
        let minSize = 1;
        let maxSize = 7.5;

        let next = randomFloatGenerator(seedNext());

        sizeNext = () => {
            return next() * (maxSize - minSize) + minSize
        }
    }

    let offsetNext;
    {
        let next = randomFloatGenerator(seedNext());

        offsetNext = () => next() * Math.PI * rad * 2;
    }


    rad = 150;    
    let offset = offsetNext();
    //generate rings
    while(rad < radMax) {
        rad += radIncrementNext();

        let next = getPoints(rad, offset);
        let result : readonly [boolean, Vector] = next();

        //generate a single ring
        while(result[0]) {
            let point;
            {
                let tmp = polarToCartesian(result[1]);
                point = new Vector(0, tmp.x, tmp.y)
            }
            let variance;
            {
                let tmp = posVariance();
                variance = new Vector(0, tmp.x, tmp.y);
            }
    
            stars.push(new Star(Vector.add(variance, point), rotNext(), sizeNext(), new Vector(-1, 0, 0)))
            result = next();
        }
        offset = offsetNext();
    }
    

    return stars;
}

/**
 * getPoints is a utility function that returns an iterator of all points in a circle
 * @param {number} radius: radius of circle
 * @param {number} offset
 * @returns {(): readonly [boolean, Vector]} function that returns a readonly tuple. In the format [boolean: next point exists, vector: position]
 */
function getPoints(radius: number, offset: number = 0) : () => readonly [boolean, Vector] {
    let starCount :number;
    {
        let length = Math.PI * 2 * radius;

        let starsPerDist = 100;

        starCount = length / starsPerDist;
    }

    let deltaTheta =( Math.PI * 2) / starCount;
    let theta = 0;

    return () : readonly [boolean, Vector] => {
        if(theta > Math.PI * 2) {
            return [false, new Vector(0, 0)];
        }

        let tmpTheta = (theta + offset) % (Math.PI * 2);

        let pos : Vector = new Vector(
            radius,
            tmpTheta
        );
        
        theta += deltaTheta;
        return [true, pos]
    };
}

function polarToCartesian(polar: Vector): Vector {
    let rad = polar.x;
    let theta = polar.y;

    return new Vector(rad * Math.cos(theta), rad * Math.sin(theta));
}