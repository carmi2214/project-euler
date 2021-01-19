import {bgYellowBright, black, green} from "chalk";

type MutationNumber = 0 | 1 | -1;

const factorial = (num: number): number => {
    if (num === 0) return 1;
    return num * factorial(num - 1);
};

const generateVariousDoubleOnesMatrix = (length: number, onesLeft: number = 2): MutationNumber[][] => {
    if (length <= 0) return [];
    if (length === 1) return onesLeft > 0 ? [[1]] : [[0]];
    if (onesLeft <= 0) return [new Array<MutationNumber>(length).fill(0)];
    let matrix: MutationNumber[][] = [];
    if (onesLeft === 1) {
        for (let i = 0; i < length; i++) {
            const currentOption = new Array<MutationNumber>(length).fill(0);
            currentOption[i] = 1;
            matrix.push(currentOption);
        }
    } else {
        const zeroBeginningMatrix = generateVariousDoubleOnesMatrix(length - 1, onesLeft);
        const oneBeginningMatrix = generateVariousDoubleOnesMatrix(length - 1, onesLeft - 1);
        matrix = [
            ...(length <= 2 && onesLeft >= 2 ? [] : zeroBeginningMatrix.map(array => [0, ...array])),
            ...oneBeginningMatrix.map(array => [1, ...array]),
        ] as MutationNumber[][];
    }
    return matrix;
};

const generateMutationMatrix = (size: number): MutationNumber[][] => {
    const variousDoubleOnesMatrix = generateVariousDoubleOnesMatrix(size);
    const variousDoubleOnesMatrixDuplicate = variousDoubleOnesMatrix.map(array => array.slice());
    for (let i = 0; i < variousDoubleOnesMatrix.length; i++) {
        const firstOneIndex = variousDoubleOnesMatrix[i].indexOf(1);
        const secondOneIndex = variousDoubleOnesMatrix[i].lastIndexOf(1);
        variousDoubleOnesMatrix[i][firstOneIndex] = -1;
        variousDoubleOnesMatrixDuplicate[i][secondOneIndex] = -1;
    }

    return [...variousDoubleOnesMatrix, ...variousDoubleOnesMatrixDuplicate];
};

const applyMutation = (tuple: number[], payment: number, mutation: MutationNumber[]): number[] => {
    const mutatedTuple = [...tuple];
    for (let i = 0; i < mutation.length; i++) {
        if (mutation[i] !== 0) {
            mutatedTuple[i] += payment * mutation[i];
        }
    }

    return mutatedTuple;
};

const verifySumCondition = (tuple: number[]) => {
    const sum = Math.round(tuple.reduce((a, b) => a + b));
    if (sum !== tuple.length) {
        throw new Error(`Sum condition is not applied! sum: ${sum} m: ${tuple.length} tuple: ${tuple}`);
    }
};

const calculateP = (tuple: number[]) =>
    tuple.reduce((previous, current, index) => previous * (current ** (index + 1)));

const getBestTuple = (tuple: number[], mutationMatrix: MutationNumber[][], payment: number, precisionLevel: number): number[] => {
    if (precisionLevel === 0) return tuple;
    let bestTuple = [...tuple];
    let bestP = calculateP(bestTuple);
    let foundBetterTuple = false;

    for (const mutation of mutationMatrix) {
        const currentTuple = applyMutation(tuple, payment, mutation);
        const currentP = calculateP(currentTuple);

        if (currentP > bestP) {
            bestTuple = currentTuple;
            bestP = currentP;
            foundBetterTuple = true;
        }
    }

    const nextPayment = foundBetterTuple ? payment : payment / 10;
    return getBestTuple(bestTuple, mutationMatrix, nextPayment, precisionLevel - 1);
};

export const run = (): void => {
    const payment = 1 / 10;
    const minimumTupleSize = 2;
    const maximumTupleSize = 15;
    const precisionLevel = 80;

    let sumOfP = 0;

    for (let tupleSize = minimumTupleSize; tupleSize <= maximumTupleSize; tupleSize++) {
        const currentTuple: number[] = new Array(tupleSize).fill(1);
        const mutationMatrix = generateMutationMatrix(currentTuple.length);

        const bestTuple = getBestTuple(currentTuple, mutationMatrix, payment, precisionLevel);
        const currentP = calculateP(bestTuple);

        verifySumCondition(bestTuple);
        sumOfP += currentP;

        console.log(bestTuple);
        console.log(`P = ${green(currentP)}\n`);
    }

    console.log(`Sum of all P's: ${bgYellowBright(black(sumOfP))}`);
    console.log(`size is between ${minimumTupleSize} and ${maximumTupleSize}.`);
    console.log(`payment is ${payment}`);
    console.log(`precisionLevel is ${precisionLevel}`);
};