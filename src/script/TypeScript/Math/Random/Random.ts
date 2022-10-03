const defaultA = 46199;
const defaultC = 378401;
const defaultM = 605009;

type randomNumberGenerator<T> = () => T;

/**
 * randomIntGenerator function returns a linear congruential generator function that returns a random int between range
 * @param {number | string} seed
 * @param {number} min: minimum int outputted from generator function
 * @param {number} max: maximum int outputted from generator function
 * @param {number} a: multiplier
 * @param {number} c: offset
 * @param {number} m: modulus 
 * @returns {randomNumberGenerator<number>}
 */
export function randomIntGenerator(seed: number | string, min: number, max: number, a: number = defaultA, c: number = defaultC, m: number = defaultM) : randomNumberGenerator<number> {
    if(m < 0) {
        throw new Error("modulus must be greater than")
    }

    a = a % m;
    c = c % m;

    if(max < min) {
        throw new Error("Invalid min and max value");
    }

    let seedNum : number = rawToUseableSeed(seed);

    let state = seedNum % m;
    
    return  (): number => {
        let nextState = (a * state + c) % m;

        state = nextState;

        return  (nextState % (max - min + 1)) + min;
    }
}

/**
 * randomFloatGenerator function returns a linear congruential generator function that returns a random float between 0 - 1
 * @param {number | string} seed
 * @param {number} a: multiplier
 * @param {number} c: offset
 * @param {number} m: modulus 
 * @returns {randomNumberGenerator<number>}
 */
export function randomFloatGenerator(seed: number | string, a: number = defaultA, c: number = defaultC, m: number = defaultM) : randomNumberGenerator<number> {
    if(m < 0) {
        throw new Error("modulus must be greater than")
    }

    a = a % m;
    c = c % m;

    let seedNum : number = rawToUseableSeed(seed);

    let state = seedNum % m;
    
    return  (): number => {
        let nextState = (a * state + c) % m;

        state = nextState;

        return nextState/m;
    }
}

/**
 * randomStringGenerator function returns a linear congruential generator function that returns a random string
 * @param {number} min: min string length
 * @param {number} max: max string length
 * @param {number | string} seed
 * @param {number} a: multiplier
 * @param {number} c: offset
 * @param {number} m: modulus 
 * @returns {randomNumberGenerator<number>}
 */
export function randomStringGenerator(seed: number | string, min: number, max: number) : randomNumberGenerator<string> {
    if (min < 0 || max < min) {
        throw new Error(`Invalid string lengths: "${min}", "${max}" are not valid lengths;`)
    }

    let seedNext = randomIntGenerator(seed, 0, 100);

    return () : string => {
        let stringSizeGen = randomIntGenerator(seedNext(), min, max);
        let randomChar = randomIntGenerator(seedNext(), 33, 126);

        let strLength = stringSizeGen();

        let tmp = "";

        for(let i1 = 0; i1 < strLength; i1++) {
            let charCode = randomChar();

            tmp+= String.fromCharCode(charCode);
        }

        return tmp;
    }
}

function rawToUseableSeed(seed: number | string) : number {
    if(typeof(seed) == 'string') {
        return seedToNumber(seed);
    }
    return seed;
}

function seedToNumber(seedStr: string) {
    let tmp: string = "";

    for(let i1 = 0; i1 < seedStr.length; i1++) {
        let char = seedStr.charAt(i1);

        let code = char.charCodeAt(0);

        tmp+=code.toString();
    }
    
    return Number.parseInt(tmp);
}