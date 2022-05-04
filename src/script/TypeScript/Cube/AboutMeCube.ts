import { Cube } from "./Cube";
import { CubeFace } from "./CubeFace";

let cube : Cube = new Cube($(".cube"));

let faceQueue : CubeFace[] = [
    new CubeFace("Studying Computer Science & Mathematics at University of Ottawa", "uOttawa.png"),
    new CubeFace("Second Place Winner of 2022 DeFi-Hackathon","DeFi2022.png", () => {
        $("#portfolio #search input").val("Speed Run Verification")
        let e = $.Event('keydown');
        e.key = "Enter";
        $("#portfolio #search input").trigger(e);
        $("#portfolio #search input")[0].scrollIntoView();
    }),
    //new CubeFace("3", "3"),
    //new CubeFace("4", "4")
];

let faceOrderQueue : number[] = shuffle([0, 1, 2, 3, 4, 5]);

let currentFace = 0;

function shuffle<T>(array : T[]) : T[] {
    let stack : T[] = [...array];

    let shuffled : T[] = [];

    while(stack.length > 0) {
        let i = Math.floor(Math.random() * stack.length);

        shuffled.push(stack[i]);
        
        stack.splice(i, 1);
    }

    return shuffled;
}


function start() {
    //initialize cube faces
    let faces = cube.faces;
    [faces.front, faces.right, faces.back, faces.left].forEach((face, i1) => {
        faceQueue[i1 % faceQueue.length].updateFace(face);
    })

    //currentFace = 1;
    setTimeout(
        update,
        4500
    )
}

function update() {
    currentFace = (currentFace+1) % faceQueue.length;

    let face : JQuery;

    switch(currentFace) {
        case 0:
            cube.front = "front";
            face = cube.faces.back;
            break;
        case 1:
            cube.front = "right";
            face = cube.faces.left;
            break;
        case 2:
            cube.front = "back";
            face = cube.faces.front;
            break;
        case 3:
            cube.front = "left";
            face = cube.faces.right;
            break;
        default:
            throw new Error("Invalid state")
    }

    faceQueue[(currentFace + 1) % faceQueue.length].updateFace(face);

    setTimeout(
        update,
        4500
    )
}

start();