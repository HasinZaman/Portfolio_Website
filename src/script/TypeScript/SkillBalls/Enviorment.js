"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasController_1 = require("../CanvasController/CanvasController");
const Circle_1 = require("./Circle");
const Intercept_1 = require("./Intercept");
const ISkillBallGenerator_1 = require("./ISkillBallGenerator");
const Line_1 = require("./Line");
const SkillBall_1 = require("./SkillBall");
const Vector_1 = require("./Vector");
class OneBall extends ISkillBallGenerator_1.ISkillBallGenerator {
    generate(ballSize) {
        return [new SkillBall_1.SkillBall(1, ballSize.x / 2, new Vector_1.Vector((enviormentSize.x - ballSize.x) / 2, (enviormentSize.y - ballSize.y) / 2), Vector_1.Vector.mult(new Vector_1.Vector(1, 1), 100), 1, skillBox, "javascript")];
    }
}
class TwoBall extends ISkillBallGenerator_1.ISkillBallGenerator {
    generate(ballSize) {
        return [
            new SkillBall_1.SkillBall(1, ballSize.x / 2, new Vector_1.Vector((enviormentSize.x - ballSize.x) / 4, (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(0.5, 1), 100), 1, skillBox, "javascript"),
            new SkillBall_1.SkillBall(2, ballSize.x / 2, new Vector_1.Vector(3 * (enviormentSize.x - ballSize.x) / 4, 3 * (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(1, 0.5), 100), 1, skillBox, "css"),
        ];
    }
}
class ThreeBall extends ISkillBallGenerator_1.ISkillBallGenerator {
    generate(ballSize) {
        let tmp = [
            new SkillBall_1.SkillBall(1, ballSize.x / 2, new Vector_1.Vector((enviormentSize.x - ballSize.x) / 4, (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(0.5, 1), 100), 1, skillBox, "javascript"),
            new SkillBall_1.SkillBall(2, ballSize.x / 2, new Vector_1.Vector(3 * (enviormentSize.x - ballSize.x) / 4, 3 * (enviormentSize.y - ballSize.y) / 4), Vector_1.Vector.mult(new Vector_1.Vector(1, 0.5), 100), 1, skillBox, "css"),
            new SkillBall_1.SkillBall(3, ballSize.x / 2, new Vector_1.Vector(500, 300), Vector_1.Vector.mult(new Vector_1.Vector(1, 1), 100), 1, skillBox, "html")
        ];
        SkillBall_1.SkillBall.addEdge(tmp[0], tmp[1]);
        SkillBall_1.SkillBall.addEdge(tmp[1], tmp[2]);
        console.log(SkillBall_1.SkillBall.edgeList);
        return tmp;
    }
}
//enviorment
let skillBox = $("#skills div");
let enviormentSize;
let ballSize;
let timeDelta = 20; //s
let canvas;
//entites
let entites = [];
function start(skillBallGenerator) {
    reSize();
    skillBallGenerator.generate(ballSize).forEach(ball => entites.push(ball));
    console.log(entites);
    setTimeout(update, timeDelta);
}
function update() {
    //calculate ball physics
    let ignore = [];
    for (let i1 = 4; i1 < entites.length; i1++) {
        let ball = entites[i1];
        ignore.push(i1);
        let collisions = (0, Intercept_1.interceptChecks)(ball, entites, ignore);
        //bounces
        for (let i2 = 0; i2 < collisions.length; i2++) {
            if (collisions[i2] < 4) { //wall collision
                let wall = entites[collisions[i2]];
                ball.bounce(wall.gradient);
            }
            else { //ball collision
                let ballCollison = entites[collisions[i2]];
                let ballTangent = Vector_1.Vector.normalize(Vector_1.Vector.sub(ball.p, ballCollison.p));
                ballTangent = new Vector_1.Vector(ballTangent.y, -1 * ballTangent.x);
                //bounce current ball
                ball.bounce(ballTangent);
                //bounce with colliding ball
                ballCollison.bounce(ballTangent);
            }
            ball.move(timeDelta / 1000);
        }
    }
    //ball rendering
    for (let i1 = 4; i1 < entites.length; i1++) {
        let ball = entites[i1];
        //check if ball is within enviorment
        if (!boundaryCheck(ball)) {
            //update position
            let pos = randomBallPos(ball.radius, [i1]);
            ball.p.x = pos.x;
            ball.p.y = pos.y;
            ball.vel = Vector_1.Vector.mult(new Vector_1.Vector(Math.random(), Math.random()), Vector_1.Vector.dist(ball.vel));
            let radius = ball.radius;
            ball.setRadius(0);
            ball.setLerpRadius(radius, 1, null);
        }
        ball.move(timeDelta / 1000);
        render(ball);
    }
    canvas.clear();
    SkillBall_1.SkillBall.edgeList.forEach(edge => {
        canvas.drawLine(edge.ball1.getCenter(), edge.ball2.getCenter(), 1, "white");
    });
    //update after n time
    setTimeout(update, timeDelta);
}
function boundaryCheck(ball) {
    let bufferZone = 5;
    if (ball.p.x - ball.radius + bufferZone < 0 || enviormentSize.x < ball.p.x + ball.radius - bufferZone) {
        return false;
    }
    if (ball.p.y - ball.radius + bufferZone < 0 || enviormentSize.y < ball.p.y + ball.radius - bufferZone) {
        return false;
    }
    return true;
}
function randomBallPos(radius, ignore) {
    let circle;
    let pos = new Vector_1.Vector(0, 0);
    circle = new Circle_1.Circle(radius, pos);
    do {
        pos.x = Math.random() * enviormentSize.x;
        pos.y = Math.random() * enviormentSize.y;
    } while ((0, Intercept_1.interceptChecks)(circle, entites, ignore).length > 0);
    return pos;
}
function render(ball) {
    let tmp = Vector_1.Vector.sub(ball.p, new Vector_1.Vector(ballSize.x / 2, -1 * ballSize.y / 2));
    ball.element.css("transform", `translate(${tmp.x}px, ${enviormentSize.y - tmp.y}px) scale(${ball.scale})`);
}
function reSize() {
    enviormentSize = new Vector_1.Vector(skillBox.width(), skillBox.height());
    ballSize = new Vector_1.Vector(100, 100);
    canvas = CanvasController_1.CanvasController.factory($("#skills canvas"), new Vector_1.Vector(enviormentSize.x, enviormentSize.y), new Vector_1.Vector(enviormentSize.x * 10, enviormentSize.y * 10));
    let gradientPath = [new Vector_1.Vector(1, 0), new Vector_1.Vector(0, 1), new Vector_1.Vector(-1, 0), new Vector_1.Vector(0, -1)];
    let start = new Vector_1.Vector(0, 0);
    if (entites.length > 4) {
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                case 2:
                    entites[i] = new Line_1.Line(start, gradientPath[i], enviormentSize.x);
                    break;
                case 1:
                case 3:
                    entites[i] = new Line_1.Line(start, gradientPath[i], enviormentSize.y);
                    break;
            }
            start = entites[i].getPoint(entites[i].l);
        }
    }
    else {
        entites = [];
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                case 2:
                    entites.push(new Line_1.Line(start, gradientPath[i], enviormentSize.x));
                    break;
                case 1:
                case 3:
                    entites.push(new Line_1.Line(start, gradientPath[i], enviormentSize.y));
                    break;
            }
            start = entites[i].getPoint(entites[i].l);
        }
    }
}
$(window).on("load", () => {
    $(window).on('resize', reSize);
    start(new ThreeBall());
});
//# sourceMappingURL=Enviorment.js.map