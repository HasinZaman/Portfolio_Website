
//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex : string) : {r: number, g : number, b: number} {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
}

export function rgba(col : {r: number, g : number, b: number}, opacity : number ) : {r: number, g : number, b: number} {
    let calculate = (foreground : number, background : number) => {
        return foreground * opacity + (1 - opacity) * background
    }

    return {
        r : calculate(col.r, 0),
        g : calculate(col.g, 0),
        b : calculate(col.b, 0)
    }
}