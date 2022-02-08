_rotation =
{
    "0": { "Transform" : "", "back": "back"},
    "1": { "Transform": "rotateY(180deg)", "back": "front" },
    "2": { "Transform": "rotateY(90deg)", "back": "right" },
    "3": { "Transform": "rotateY(270deg)", "back": "left" },
    "4": { "Transform": "rotateX(-90deg)", "back": "down" },
    "5": { "Transform": "rotateX(90deg)", "back": "up" },
}


function forwardFace(cube, faceId)
{
    cube.attr("front", faceId)
    cube.css("transform", _rotation[faceId.toString()]["Transform"])
}

function getBack(cube)
{
    return cube.find("." + _rotation[cube.attr("front")]["back"])
}