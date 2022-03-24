import { Skill, SkillList } from "../DataBaseHandler/Skill";
import { ballGenerate, randomBallPos, IEnvironmentSettings, IBallSettings } from "./BallGeneration";
import { initializeInfoBox } from "./InfoBox";
import { interceptChecks } from "./Intercept";
import { Line } from "./Line";
import { Path } from "./Path";
import { Rect } from "./Rect";
import { Edge, SkillBall } from "./SkillBall";
import { Vector } from "./Vector";

//environment
let skillBox : JQuery = $("#skills div:first");

let environmentSize : Vector;
let ballSize : Vector;

let timeDelta : number = 20;//ms

//entities
let entities : Path[] = []


function start(environmentSettings : IEnvironmentSettings, ballSettings:IBallSettings) {
    reSize();
    /*let environmentSettings:IEnvironmentSettings = {
        getEnvironmentSize: function (){
            return environmentSize;
        },
        getSkillBox: function() {
            return skillBox;
        },
    };
    let ballSettings:IBallSettings = {
        getBallRadius: function () {
            return ballSize.x / 2;
        },
        getSkills: function () {
            return ["HTML", "CSS", "JS"]
        },
        getConnections: function() {
            return [[0,1], [1,0], [1,2]]
        }
    }*/
    ballGenerate(environmentSettings, ballSettings).forEach(ball => entities.push(ball));

    initializeInfoBox();

    console.log(entities);


    setTimeout(update, timeDelta);
}

function update() : void {
    //calculate ball physics
    let ignore : number[] = [];
    for(let i1 : number = 4; i1 < entities.length; i1++) {
        let ball = entities[i1] as SkillBall;
        ignore.push(i1);
        let collisions : number[] = interceptChecks(ball, entities, ignore);
        //bounces
        for(let i2 : number = 0; i2 < collisions.length; i2++) {
            if(collisions[i2] < 4) {//wall collision
                let wall : Line = entities[collisions[i2]] as Line;
                ball.bounce(wall.gradient);
            }
            else {//ball collision
                let ballCollision : SkillBall = entities[collisions[i2]] as SkillBall;
                let ballTangent : Vector = Vector.normalize(Vector.sub(ball.p, ballCollision.p));
                ballTangent = new Vector(ballTangent.y, -1*ballTangent.x);
                
                //bounce current ball
                ball.bounce(ballTangent);

                //bounce with colliding ball
                ballCollision.bounce(ballTangent);
                
            }

            ball.move(timeDelta / 1000);
        }
    }

    //ball rendering
    for(let i1 = 4; i1 < entities.length; i1++)
    {
        let ball = entities[i1] as SkillBall;

        //check if ball is within environment
        if(!boundaryCheck(ball)) {
            //update position
            let pos : Vector = randomBallPos(
                ball.radius,
                new Rect(environmentSize.x, environmentSize.y, 0, new Vector(0, 0)),
                [i1],
                entities);

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
    if(ball.p.x - ball.radius + bufferZone < 0 || environmentSize.x < ball.p.x + ball.radius - bufferZone)
    {
        return false;
    }

    if(ball.p.y - ball.radius + bufferZone < 0 || environmentSize.y < ball.p.y + ball.radius - bufferZone)
    {
        return false;
    }

    return true;
}

function render(ball : SkillBall) : void
{
    let tmp : Vector = Vector.sub(ball.p, new Vector(ballSize.x/2, -1 * ballSize.y/2));
    ball.element.css("transform", `translate(${tmp.x}px, ${environmentSize.y - tmp.y}px) scale(${ball.scale})`);
}

function reSize() : void {
    environmentSize = new Vector(skillBox.width() as number, skillBox.height() as number);
    ballSize = new Vector(100, 100);

    Edge.setSVGElemSize(environmentSize.x, environmentSize.y);

    let gradientPath : Vector[] = [new Vector(1, 0),new Vector(0, 1),new Vector(-1, 0),new Vector(0, -1)]
    let start : Vector = new Vector(0,0);

    if(entities.length > 4) {
        for(let i : number = 0; i < 4; i++) {
            switch(i) {
                case 0:
                case 2:
                    entities[i] = new Line(start,  gradientPath[i],   environmentSize.x);
                    break;
                case 1:
                case 3:
                    entities[i] = new Line(start,  gradientPath[i],   environmentSize.y);
                    break;
            }
            
            start = entities[i].getPoint((entities[i] as Line).l);
        }
    }
    else {
        entities = []
        for(let i : number = 0; i < 4; i++) {
            switch(i) {
                case 0:
                case 2:
                    entities.push(new Line(start,  gradientPath[i],   environmentSize.x))
                    break;
                case 1:
                case 3:
                    entities.push(new Line(start,  gradientPath[i],   environmentSize.y))
                    break;
            }
            
            start = entities[i].getPoint((entities[i] as Line).l);
        }
    }
}

$(window).on("load", () => {
    $(window).on('resize', reSize);

    SkillList.getInstance(() => {
        let environmentSettings:IEnvironmentSettings = {
            getEnvironmentSize: function (){
                return environmentSize;
            },
            getSkillBox: function() {
                return skillBox;
            },
        };
        console.log(SkillList.getInstance().skills)
        console.log(SkillList.getInstance().connections)
        let ballSettings:IBallSettings = {
            getBallRadius: function () {
                return ballSize.x / 2;
            },
            getSkills: function () {
                let tmp = Object.assign([], SkillList.getInstance().skills);
                return tmp.map((val:Skill) => {return val.symbol})
            },
            getConnections: function() {
                let tmp = Object.assign([], SkillList.getInstance().connections);
                return tmp;
            }
        }

        start(environmentSettings, ballSettings);
    })
})