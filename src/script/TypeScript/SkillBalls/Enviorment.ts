import { CanvasController } from "../CanvasController/CanvasController";
import { Circle } from "./Circle";
import { interceptChecks } from "./Intercept";
import { ISkillBallGenerator } from "./ISkillBallGenerator";
import { Line } from "./Line";
import { Path } from "./Path";
import { Rect } from "./Rect";
import { SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

class OneBall extends ISkillBallGenerator {
    generate(ballSize : Vector) : SkillBall[]
    {
        return [new SkillBall(1, ballSize.x / 2 , new Vector((enviormentSize.x - ballSize.x)/2, (enviormentSize.y - ballSize.y)/2), Vector.mult(new Vector(1,1), 100), 1, skillBox, "javascript")];
    }
}
class TwoBall extends ISkillBallGenerator {
    generate(ballSize : Vector) : SkillBall[]
    {
        return [
            new SkillBall(1, ballSize.x / 2 , new Vector((enviormentSize.x - ballSize.x)/4, (enviormentSize.y - ballSize.y)/4), Vector.mult(new Vector(0.5,1), 100), 1, skillBox, "javascript"),
            new SkillBall(2, ballSize.x / 2 , new Vector(3*(enviormentSize.x - ballSize.x)/4, 3*(enviormentSize.y - ballSize.y)/4), Vector.mult(new Vector(1,0.5), 100), 1, skillBox, "css"),
        ];
    }
}
class ThreeBall extends ISkillBallGenerator {
    generate(ballSize : Vector) : SkillBall[]
    {
        let tmp = [
            new SkillBall(1, ballSize.x / 2 , new Vector((enviormentSize.x - ballSize.x)/4, (enviormentSize.y - ballSize.y)/4), Vector.mult(new Vector(0.5,1), 100), 1, skillBox, "javascript"),
            new SkillBall(2, ballSize.x / 2 , new Vector(3*(enviormentSize.x - ballSize.x)/4, 3*(enviormentSize.y - ballSize.y)/4), Vector.mult(new Vector(1,0.5), 100), 1, skillBox, "css"),
            new SkillBall(3, ballSize.x / 2 , new Vector(500, 300), Vector.mult(new Vector(1,1), 100), 1, skillBox, "html")
        ];

        SkillBall.addEdge(tmp[0],tmp[1])
        SkillBall.addEdge(tmp[1],tmp[2])
        console.log(SkillBall.edgeList);
        return tmp;
    }
}

//enviorment
let skillBox : JQuery = $("#skills div");

let enviormentSize : Vector;
let ballSize : Vector;

let timeDelta : number = 20;//s

let canvas : CanvasController;

//entites
let entites : Path[] = []


function start(skillBallGenerator : ISkillBallGenerator) {
    reSize();

    skillBallGenerator.generate(ballSize).forEach(ball => entites.push(ball));

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
            let pos : Vector = randomBallPos(ball.radius, [i1]);

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
    
    canvas.clear();
    SkillBall.edgeList.forEach(edge => {
        canvas.drawLine(
            edge.ball1.getCenter(),
            edge.ball2.getCenter(),
            1,
            "white"
        )
    });
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

function randomBallPos(radius : number, ignore : number[]) : Vector {
    let circle : Circle;
    let pos :  Vector = new Vector(0, 0);
    circle = new Circle(radius, pos);

    do{
        pos.x = Math.random() * enviormentSize.x;
        pos.y = Math.random() * enviormentSize.y;
    } while(interceptChecks(circle, entites, ignore).length > 0) ;

    return pos;
}

function render(ball : SkillBall) : void
{
    let tmp : Vector = Vector.sub(ball.p, new Vector(ballSize.x/2, -1 * ballSize.y/2));
    ball.element.css("transform", `translate(${tmp.x}px, ${enviormentSize.y - tmp.y}px) scale(${ball.scale})`);
}

function reSize() : void {
    enviormentSize = new Vector(skillBox.width() as number, skillBox.height() as number);
    ballSize = new Vector(100, 100);

    canvas = CanvasController.factory($("#skills canvas"), new Vector(enviormentSize.x, enviormentSize.y), new Vector(enviormentSize.x * 10, enviormentSize.y * 10)) as CanvasController;

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
    start(new ThreeBall());
})