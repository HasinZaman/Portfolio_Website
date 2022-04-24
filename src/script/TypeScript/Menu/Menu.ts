let menu: JQuery;
let start: number = 0;
let height: number = 0;

let lastPos : number = 0;

function unWrap<T>(action :T | undefined | null) : T {
    if (action == null) {
        throw new Error("value is not defined");
    }

    return action;
}

function main() {
    menu = unWrap<JQuery>($("#menu"));
    start = unWrap<number>(
        unWrap<JQuery>($("#header")).height()
    ) - 10;
    height = unWrap<number>(menu.height()) - 5;

    menu.css("top", `${start + height}px`);
    menu.next().css("margin-top", `${height}px`);
}

main()
lastPos = start;
$(window).on("resize", () => {
    main();
})
$(document).on("ready", () => {
    main
})
$(document).on("scroll", (event: JQuery.Event) => {
    let currentPos : number = unWrap<number>($(document).scrollTop());
    let delta : number = lastPos - currentPos;

    menu.css("top", Math.max(start + height, currentPos - height));

    if(currentPos > start + height) {
        console.log("fixed menu")
        if(delta < 0){
            menu.css("transform", "translateY(-100%)");
        }
        else if(delta > 0){
            menu.css("transform", "translateY(100%) translateY(-13px)");
        }
    } else {
        menu.css("top", `${start + height}px`);
        menu.css("transform", "translateY(-100%)");
    }

    lastPos = currentPos;
})