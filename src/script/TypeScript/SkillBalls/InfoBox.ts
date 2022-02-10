
export interface InfoBoxData {
    name : string,
    date : Date,
    description : string
}

export function initializeInfoBox() : void {
    $("#skills .infoBox nav #close").on("click", () => {
        $("#skills .infoBox").removeClass("active");
    })
}

export function openInfoBox(skillName : string) : void {
    $("#skills .infoBox").addClass("active");

    $("#skills .infoBox h2").text(skillName.toUpperCase())

    //insert data reterival system
    let tmpDate1 = new Date();
    tmpDate1.setFullYear(2020, 12);
    
    let tmpDate2 = new Date();
    tmpDate1.setFullYear(2012, 8);

    let first : InfoBoxData = {
        name :"project 1",
        date : tmpDate1,
        description : "This is project 1 and this is a description"
    }
    let last : InfoBoxData = {
        name :"project 2",
        date : tmpDate2,
        description : "This is project 2 and this is a description"
    }

    updateInfoBox($("#skills .infoBox .skillInfo").first(),first);
    updateInfoBox($("#skills .infoBox .skillInfo").last(),last);
}

function updateInfoBox(target : JQuery, data : InfoBoxData) {
    target.find(".projectName").text(data.name);
    target.find(".date").text(data.date.toLocaleString("en-US", {month:"long", year:"numeric"}));
    target.find(".description").text(data.description);
    
    target.find(".readMore").on("click", () => {console.log(`${data.name}-click`)})
}