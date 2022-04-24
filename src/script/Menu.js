(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
let menu;
let start = 0;
let height = 0;
let lastPos = 0;
function unWrap(action) {
    if (action == null) {
        throw new Error("value is not defined");
    }
    return action;
}
function main() {
    menu = unWrap($("#menu"));
    start = unWrap(unWrap($("#header")).height()) - 10;
    height = unWrap(menu.height()) - 5;
    menu.css("top", `${start + height}px`);
    menu.next().css("margin-top", `${height}px`);
}
main();
lastPos = start;
$(window).on("resize", () => {
    main();
});
$(document).on("ready", () => {
    main;
});
$(document).on("scroll", (event) => {
    let currentPos = unWrap($(document).scrollTop());
    let delta = lastPos - currentPos;
    menu.css("top", Math.max(start + height, currentPos - height));
    if (currentPos > start + height - 10) {
        console.log("fixed menu");
        if (delta < 0) {
            menu.css("transform", "translateY(-100%)");
        }
        else if (delta > 0) {
            menu.css("transform", "translateY(100%) translateY(-13px)");
        }
    }
    else {
        menu.css("top", `${start + height}px`);
        menu.css("transform", "translateY(-100%)");
    }
    lastPos = currentPos;
});

},{}]},{},[1]);
