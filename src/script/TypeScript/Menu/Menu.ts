import { MenuLogic, unWrap } from "./MenuLogic";

let mobileLogic : MenuLogic = new MenuLogic(
    () => {
        console.log("mobile")
        
        let updateMenu = () => {
            let currentPos: number = unWrap<number>($(document).scrollTop());
            //open menu logic
            if ($("#menu").hasClass("selected")) {
                //stop scrolling
                $("body").css("overflow", "hidden");
                
                //set menu to top of screen
                if(currentPos < MenuLogic.start + MenuLogic.height) {
                    MenuLogic.menu.css("transform", `translateY(-${MenuLogic.menu.css("top")}) translateY(-30px)`);
                }
                else {
                    MenuLogic.menu.css("transform", `translateY(0%)`);
                }
                MenuLogic.menu.css("padding-bottom", `100%`);

                //set menu to full screen
                $("#menu img").css("transform",`translateX(${MenuLogic.windowWidth/2}px) translateX(-50%)`);

                $("#menu img").attr("src",`src\\media\\img\\icons\\Cross_icon.svg`);
            }
            //closed menu logic
            else {
                $("body").css("overflow", "");

                $("#menu img").css("transform","")
                MenuLogic.menu.css("transform", "");
                MenuLogic.menu.css("padding-bottom", ``)
                
                $("#menu img").attr("src",`src\\media\\img\\icons\\Menu_icon.svg`);
            }
        }

        $("#menu").removeClass("selected")
        
        updateMenu();
        
        $("#menu img").off("touchend click")
        $("#menu img").on("touchend click", () => {
            $("#menu").toggleClass("selected");
            updateMenu();
        })

        $("#menu a").off("touchend click")
        $("#menu a").on("touchend click", event => {
            $(unWrap($(event.target).attr("href")))[0].scrollIntoView();
            $("#menu").removeClass("selected");
            updateMenu();
        })
    },
    (currentPos : number, delta : number) => {
        //scroll logic
        if($("#menu").hasClass("selected")) {
            return ;
        }
        if(currentPos > MenuLogic.start + MenuLogic.height) {
            if(delta < 0) {
                MenuLogic.menu.css("transform", "translateY(-100%)");
            }
            else if(delta > 0) {
                MenuLogic.menu.css("transform", "translateY(100%) translateY(-13px)");
            }
        } else {
            MenuLogic.menu.css("top", `${MenuLogic.start + MenuLogic.height}px`);
            MenuLogic.menu.css("transform", "translateY(-100%)");
        }
    }
);

let desktopLogic : MenuLogic = new MenuLogic(
    () => {
        $("body").css("overflow", "");
    },
    (currentPos : number, delta : number) => {
        if(currentPos > MenuLogic.start + MenuLogic.height) {
            if(delta < 0) {
                MenuLogic.menu.css("transform", "translateY(-100%)");
            }
            else if(delta > 0) {
                MenuLogic.menu.css("transform", "translateY(100%) translateY(-13px)");
            }
        } else {
            MenuLogic.menu.css("top", `${MenuLogic.start + MenuLogic.height}px`);
            MenuLogic.menu.css("transform", "translateY(-100%)");
        }
    }
);

MenuLogic.mobileLogic = mobileLogic;
MenuLogic.desktopLogic = desktopLogic;

MenuLogic.initialize();