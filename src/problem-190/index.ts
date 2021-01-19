import {blue, bold, green, yellow} from "chalk";

const factorial = (num: number): number => {
    if (num === 0) return 1;
    return num * factorial(num - 1);
};

const generateVariousDoubleOnesMatrix = (length: number, onesLeft: number = 2): number[][] => {
    if (length <= 0) return [];
    if (length === 1) return onesLeft > 0 ? [[1]] : [[0]];
    if (onesLeft <= 0) return [new Array(length).fill(0)];
    let matrix: number[][] = [];
    if (onesLeft === 1) {
        for (let i = 0; i < length; i++) {
            const currentOption = new Array(length).fill(0);
            currentOption[i] = 1;
            matrix.push(currentOption);
        }
    } else {
        const zeroBeginningMatrix = generateVariousDoubleOnesMatrix(length - 1, onesLeft);
        const oneBeginningMatrix = generateVariousDoubleOnesMatrix(length - 1, onesLeft - 1);
        matrix = [
            ...(length <= 2 && onesLeft >= 2 ? [] : zeroBeginningMatrix.map(array => [0, ...array])),
            ...oneBeginningMatrix.map(array => [1, ...array]),
        ];
    }
    return matrix;
};

const generateMutationMatrix = (size: number) => {
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

const verifySumCondition = (tuple: number[]) => {
    const sum = Math.round(tuple.reduce((a, b) => a + b));
    if (sum !== tuple.length) {
        throw new Error(`Sum condition is not applied! sum: ${sum} m: ${tuple.length} tuple: ${tuple}`);
    }
};

const calculateP = (tuple: number[]) =>
    tuple.reduce((previous, current, index) => previous * (current ** (index + 1)));

const getBestTuple = (tuple: number[], payment: number, indent = '', exact = 20): number[] => {
    if (exact === 0) return tuple;
    let bestTuple = [...tuple];
    let bestP = calculateP(bestTuple);
    let foundBetterTuple = false;

    const mutationMatrix = generateMutationMatrix(bestTuple.length);
    for (const mutation of mutationMatrix) {
        const currentTuple = [...tuple];
        for (let i = 0; i < mutation.length; i++) {
            if (mutation[i] !== 0) {
                currentTuple[i] += payment * mutation[i];
            }
        }

        const currentP = calculateP(currentTuple);
        console.log(`${indent}${currentTuple} - ${blue(currentP)}`);

        if (currentP > bestP) {
            bestTuple = currentTuple;
            bestP = currentP;
            foundBetterTuple = true;
            console.log(green(`${indent}found better P! it is ${currentP}`));
        }
    }

    if (!foundBetterTuple) console.log(yellow(`${indent}didn't find a better tuple than ${tuple}`));
    return getBestTuple(bestTuple, foundBetterTuple ? payment : payment / 2, indent + (foundBetterTuple ? '' : ' '), exact - 1);
};

export const run = (): void => {
    let tuple: number[] = [1, 1, 1, 1, 1, 1];
    let bestP = calculateP(tuple);

    const currentPayment = 1 / 10;

    if (currentPayment < 1) {
        const currentTuple = getBestTuple(tuple, currentPayment, ' ');
        const currentP = calculateP(currentTuple);
        console.log(bold(`${currentTuple} - ${blue(currentP)}`));

        if (currentP > bestP) {
            tuple = currentTuple;
            bestP = currentP;
            console.log(bold(green(`found significantly better P! it is ${bestP}`)));
        }

        verifySumCondition(tuple);
    }

    console.log(tuple);
};