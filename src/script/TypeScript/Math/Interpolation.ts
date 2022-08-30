export type Interpolation<T> = (n: number) => T;

export function lerpFunc(y0: number, y1: number): Interpolation<number> {
    let slope = (y1 - y0);

    return (n: number) : number => {
        return slope * n + y0;
    }
}