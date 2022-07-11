
/**
 * unWrap function converts T | undefined | null into T
 * @param {T | undefined | null} action 
 * @returns {T} generic object that isn't null or undefined 
 */
export function unWrap<T>(action :T | undefined | null) : T {
    if (action == null) {
        throw new Error("value is not defined");
    }

    return action;
}

/**
 * MenuLogic Class handles the state and logic required to manage menu on different screen sizes
 */
export class MenuLogic {

    static menu: JQuery;
    static start: number;
    static height: number;
    static windowWidth : number;
    static lastPos : number;

    public static mobileLogic : MenuLogic;
    
    public static desktopLogic: MenuLogic;

    startLogic : (currentPos : number) => void;
    scrollLogic : (currentPos : number, delta : number) => void;

    /**
     * @constructor defines closures required for the handling menu
     * @param {(currentPos : number) => void} startLogic initialization logic 
     * @param {(currentPos : number, delta : number) => void} scrollLogic On scroll update logic
     */
    public constructor(startLogic: (currentPos : number) => void, scrollLogic: (currentPos : number, delta : number) => void) {
        this.startLogic = startLogic;
        this.scrollLogic = scrollLogic;
    }

    /**
     * logic method returns correct logic based on device
     * @return {MenuLogic} menu logic object based on user device
     */
    static get logic() : MenuLogic {
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches)
        {
            return MenuLogic.mobileLogic;
        }
        return MenuLogic.desktopLogic;
    }

    /**
     * main method handles the state of menu
     */
    public static main() {
        let currentPos : number = unWrap<number>($(document).scrollTop());
        MenuLogic.menu = unWrap<JQuery>($("#menu"));
        MenuLogic.start = unWrap<number>(
            unWrap<JQuery>($("#header")).height()
        ) - 10;
        MenuLogic.height = 44.4;

        MenuLogic.menu.css("top", `${MenuLogic.start + MenuLogic.height}px`);
        MenuLogic.menu.next().css("margin-top", `${MenuLogic.height}px`);

        MenuLogic.windowWidth = unWrap<number>($(window).width());

        MenuLogic.logic.startLogic(currentPos);
    }


    /**
     * initialize method handles the initialization of menu page load
     */
    public static initialize() {
        MenuLogic.main()
        MenuLogic.lastPos = MenuLogic.start;

        $(window).on("resize", () => {
            MenuLogic.main();
        })

        $(document).on("ready", () => {
            MenuLogic.main()
        })

        $(document).on("scroll", (event: JQuery.Event) => {
            let currentPos : number = unWrap<number>($(document).scrollTop());
            let delta : number = MenuLogic.lastPos - currentPos;

            MenuLogic.menu.css("top", Math.max(MenuLogic.start + MenuLogic.height, currentPos - MenuLogic.height));
            
            MenuLogic.logic.scrollLogic(currentPos, delta);

            MenuLogic.lastPos = currentPos;
        })
    }
}