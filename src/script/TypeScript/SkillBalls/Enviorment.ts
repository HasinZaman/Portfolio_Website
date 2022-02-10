import { ballGenerate, randomBallPos } from "./BallGeneration";
import { Circle } from "./Circle";
import { initializeInfoBox } from "./InfoBox";
import { interceptChecks } from "./Intercept";
import { ISkillBallGenerator } from "./ISkillBallGenerator";
import { Line } from "./Line";
import { Path } from "./Path";
import { Rect } from "./Rect";
import { Edge, SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

//enviorment
let skillBox : JQuery = $("#skills div:first");

let enviormentSize : Vector;
let ballSize : Vector;

let timeDelta : number = 20;//ms

//entites
let entites : Path[] = []


function start(skillBallGenerator : ISkillBallGenerator) {
    reSize();

    skillBallGenerator(ballSize.x / 2, enviormentSize, skillBox).forEach(ball => entites.push(ball));

    initializeInfoBox();

    console.log(entites);


    setTimeout(update, timeDelta);
}

function update() : void {
    //calculate ball physics
    let ignore : number[] = [];
    for(let i1 : number = 4; i1 < entites.length; i1++) {
        let ball = entites[i1] as SkillBall;
        ignore.push(i1);
        let collisions : number[] = interceptChecks(ball, entites, ignore);
        //bounces
        for(let i2 : number = 0; i2 < collisions.length; i2++) {
            if(collisions[i2] < 4) {//wall collision
                let wall : Line = entites[collisions[i2]] as Line;
                ball.bounce(wall.gradient);
            }
            else {//ball collision
                let ballCollison : SkillBall = entites[collisions[i2]] as SkillBall;
                let ballTangent : Vector = Vector.normalize(Vector.sub(ball.p, ballCollison.p));
                ballTangent = new Vector(ballTangent.y, -1*ballTangent.x);
                
                //bounce current ball
                ball.bounce(ballTangent);

                //bounce with colliding ball
                ballCollison.bounce(ballTangent);
                
            }

            ball.move(timeDelta / 1000);
        }
    }

    //ball rendering
    for(let i1 = 4; i1 < entites.length; i1++)
    {
        let ball = entites[i1] as SkillBall;

        //check if ball is within enviorment
        if(!boundaryCheck(ball)) {
            //update position
            let pos : Vector = randomBallPos(
                ball.radius,
                new Rect(enviormentSize.x, enviormentSize.y, 0, new Vector(0, 0)),
                [i1],
                entites);

            ball.p.x = pos.x;
            ball.p.y = pos.y;

            ball.vel = Vector.mult(new Vector(Math.random(),Math.random()), Vector.dist(ball.vel));
            
            let radius = ball.radius;
            ball.setRadius(0)
            ball.setLerpRadius(radius, 1, null);
        }

        ball.move(timeDelta / 1000);
        render(ball);
    }
    
    //edge rendering
    SkillBall.edgeList.forEach(edge => {
        edge.updateLine();
    });

    Edge.updateSVGElem(SkillBall.edgeList);

    //update after n time
    setTimeout(update, timeDelta);
}

function boundaryCheck(ball : SkillBall) : boolean {
    let bufferZone = 5;
    if(ball.p.x - ball.radius + bufferZone < 0 || enviormentSize.x < ball.p.x + ball.radius - bufferZone)
    {
        return false;
    }

    if(ball.p.y - ball.radius + bufferZone < 0 || enviormentSize.y < ball.p.y + ball.radius - bufferZone)
    {
        return false;
    }

    return true;
}

function render(ball : SkillBall) : void
{
    let tmp : Vector = Vector.sub(ball.p, new Vector(ballSize.x/2, -1 * ballSize.y/2));
    ball.element.css("transform", `translate(${tmp.x}px, ${enviormentSize.y - tmp.y}px) scale(${ball.scale})`);
}

function reSize() : void {
    enviormentSize = new Vector(skillBox.width() as number, skillBox.height() as number);
    ballSize = new Vector(100, 100);

    Edge.setSVGElemSize(enviormentSize.x, enviormentSize.y);

    let gradientPath : Vector[] = [new Vector(1, 0),new Vector(0, 1),new Vector(-1, 0),new Vector(0, -1)]
    let start : Vector = new Vector(0,0);

    if(entites.length > 4) {
        for(let i : number = 0; i < 4; i++) {
            switch(i) {
                case 0:
                case 2:
                    entites[i] = new Line(start,  gradientPath[i],   enviormentSize.x);
                    break;
                case 1:
                case 3:
                    entites[i] = new Line(start,  gradientPath[i],   enviormentSize.y);
                    break;
            }
            
            start = entites[i].getPoint((entites[i] as Line).l);
        }
    }
    else {
        entites = []
        for(let i : number = 0; i < 4; i++) {
            switch(i) {
                case 0:
                case 2:
                    entites.push(new Line(start,  gradientPath[i],   enviormentSize.x))
                    break;
                case 1:
                case 3:
                    entites.push(new Line(start,  gradientPath[i],   enviormentSize.y))
                    break;
            }
            
            start = entites[i].getPoint((entites[i] as Line).l);
        }
    }
}

$(window).on("load", () => {
    $(window).on('resize', reSize);
    start(ballGenerate);
})