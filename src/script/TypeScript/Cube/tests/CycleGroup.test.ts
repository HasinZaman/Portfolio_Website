import {Generator} from "../CycleGroup"


function testGroup<T>(actual : T[], expected : T[]) {
    expect(actual.length).toBe(expected.length);

    for(let i1 = 0; i1 < 4; i1++) {
        expect(actual[i1]).toBe(expected[i1]);
    }
}

test(`addition mod 4 cyclic group`, () => {
    let cyclicGroup : Generator = new Generator([1, 2, 3, 0]);

    let actual = cyclicGroup.next(["a","b","c","d"]);
    let expected = ["d", "a", "b", "c"];

    testGroup(actual, expected);
})


test(`addition mod 4 cyclic group: identity`, () => {
    let cyclicGroup : Generator = new Generator([1, 2, 3, 0]);

    let state = ["a","b","c","d"];

    for(let i1 = 0; i1 < 4; i1++) {
        state = cyclicGroup.next(state);
    }

    testGroup(state, state);
})

test(`reflect points of pentagon along y axis`, () => {
    //
    //      1            1   
    //    /   \        /   \
    //   5     2      2     5
    //   |     |  =>  |     |
    //   4_____3      3_____4
    // 1 => 1
    // 2 => 5
    // 3 => 4
    // 4 => 3
    // 5 => 2
    let state : number[] = [1,2,3,4,5]

    let generator : Generator = new Generator([0, 4, 3, 2, 1])

    //reflect once
    state = generator.next(state)

    testGroup(state, [1, 5, 4, 3, 2])

    //reflect back to identity
    state = generator.next(state)

    testGroup(state, [1, 2, 3, 4, 5])
})

test(`create invalid generator`, ()=>{
    
    //out of range error
    expect(
        () => {
            new Generator([5])
        }
    )
    .toThrowError("Invalid operation");

    
    //double visit
    expect(
        () => {
            new Generator([0,0])
        }
    )
    .toThrowError("Invalid operation");
})

test(`Invalid state`, () => {
    let generator : Generator = new Generator([1, 0]);

    expect(
        () => {
            generator.next([1,2,3])
        }
    )
    .toThrowError("state has an invalid size");
    
    expect(
        () => {
            generator.next([])
        }
    )
    .toThrowError("state has an invalid size");
    
    expect(
        () => {
            generator.next([1])
        }
    )
    .toThrowError("state has an invalid size");
})