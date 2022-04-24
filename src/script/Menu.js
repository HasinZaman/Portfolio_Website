(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MenuLogic_1 = require("./MenuLogic");
let mobileLogic = new MenuLogic_1.MenuLogic(() => {
    console.log("mobile");
    let updateMenu = () => {
        let currentPos = (0, MenuLogic_1.unWrap)($(document).scrollTop());
        if ($("#menu").hasClass("selected")) {
            $("body").css("overflow", "hidden");
            if (currentPos < MenuLogic_1.MenuLogic.start + MenuLogic_1.MenuLogic.height) {
                MenuLogic_1.MenuLogic.menu.css("transform", `translateY(-${MenuLogic_1.MenuLogic.menu.css("top")}) translateY(-30px)`);
            }
            else {
                MenuLogic_1.MenuLogic.menu.css("transform", `translateY(0%)`);
            }
            MenuLogic_1.MenuLogic.menu.css("padding-bottom", `100%`);
            $("#menu img").css("transform", `translateX(${MenuLogic_1.MenuLogic.windowWidth / 2}px) translateX(-50%)`);
            $("#menu img").attr("src", `src\\media\\img\\icons\\Cross_icon.svg`);
        }
        else {
            $("body").css("overflow", "");
            $("#menu img").css("transform", "");
            MenuLogic_1.MenuLogic.menu.css("transform", "");
            MenuLogic_1.MenuLogic.menu.css("padding-bottom", ``);
            $("#menu img").attr("src", `src\\media\\img\\icons\\Menu_icon.svg`);
        }
    };
    $("#menu").removeClass("selected");
    updateMenu();
    $("#menu img").off("touchend click");
    $("#menu img").on("touchend click", () => {
        $("#menu").toggleClass("selected");
        updateMenu();
    });
    $("#menu a").off("touchend click");
    $("#menu a").on("touchend click", event => {
        $((0, MenuLogic_1.unWrap)($(event.target).attr("href")))[0].scrollIntoView();
        $("#menu").removeClass("selected");
        updateMenu();
    });
}, (currentPos, delta) => {
    if ($("#menu").hasClass("selected")) {
        return;
    }
    if (currentPos > MenuLogic_1.MenuLogic.start + MenuLogic_1.MenuLogic.height) {
        if (delta < 0) {
            MenuLogic_1.MenuLogic.menu.css("transform", "translateY(-100%)");
        }
        else if (delta > 0) {
            MenuLogic_1.MenuLogic.menu.css("transform", "translateY(100%) translateY(-13px)");
        }
    }
    else {
        MenuLogic_1.MenuLogic.menu.css("top", `${MenuLogic_1.MenuLogic.start + MenuLogic_1.MenuLogic.height}px`);
        MenuLogic_1.MenuLogic.menu.css("transform", "translateY(-100%)");
    }
});
let desktopLogic = new MenuLogic_1.MenuLogic(() => {
    $("body").css("overflow", "");
}, (currentPos, delta) => {
    if (currentPos > MenuLogic_1.MenuLogic.start + MenuLogic_1.MenuLogic.height) {
        if (delta < 0) {
            MenuLogic_1.MenuLogic.menu.css("transform", "translateY(-100%)");
        }
        else if (delta > 0) {
            MenuLogic_1.MenuLogic.menu.css("transform", "translateY(100%) translateY(-13px)");
        }
    }
    else {
        MenuLogic_1.MenuLogic.menu.css("top", `${MenuLogic_1.MenuLogic.start + MenuLogic_1.MenuLogic.height}px`);
        MenuLogic_1.MenuLogic.menu.css("transform", "translateY(-100%)");
    }
});
MenuLogic_1.MenuLogic.mobileLogic = mobileLogic;
MenuLogic_1.MenuLogic.desktopLogic = desktopLogic;
MenuLogic_1.MenuLogic.initialize();

},{"./MenuLogic":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLogic = exports.unWrap = void 0;
function unWrap(action) {
    if (action == null) {
        throw new Error("value is not defined");
    }
    return action;
}
exports.unWrap = unWrap;
class MenuLogic {
    constructor(startLogic, scrollLogic) {
        this.startLogic = startLogic;
        this.scrollLogic = scrollLogic;
    }
    static get logic() {
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
            return MenuLogic.mobileLogic;
        }
        return MenuLogic.desktopLogic;
    }
    static main() {
        let currentPos = unWrap($(document).scrollTop());
        MenuLogic.menu = unWrap($("#menu"));
        MenuLogic.start = unWrap(unWrap($("#header")).height()) - 10;
        MenuLogic.height = 44.4;
        MenuLogic.menu.css("top", `${MenuLogic.start + MenuLogic.height}px`);
        MenuLogic.menu.next().css("margin-top", `${MenuLogic.height}px`);
        MenuLogic.windowWidth = unWrap($(window).width());
        MenuLogic.logic.startLogic(currentPos);
    }
    static initialize() {
        MenuLogic.main();
        MenuLogic.lastPos = MenuLogic.start;
        $(window).on("resize", () => {
            MenuLogic.main();
        });
        $(document).on("ready", () => {
            MenuLogic.main();
        });
        $(document).on("scroll", (event) => {
            let currentPos = unWrap($(document).scrollTop());
            let delta = MenuLogic.lastPos - currentPos;
            MenuLogic.menu.css("top", Math.max(MenuLogic.start + MenuLogic.height, currentPos - MenuLogic.height));
            MenuLogic.logic.scrollLogic(currentPos, delta);
            MenuLogic.lastPos = currentPos;
        });
    }
}
exports.MenuLogic = MenuLogic;

},{}]},{},[1]);
