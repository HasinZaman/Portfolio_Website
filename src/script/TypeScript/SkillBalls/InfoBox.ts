
export function initializeInfoBox() : void {
    $("#skills .infoBox nav #close").on("click", () => {
        $("#skills .infoBox").removeClass("active");
    })
}

export function openInfoBox() : void {
    $("#skills .infoBox").addClass("active");
}

