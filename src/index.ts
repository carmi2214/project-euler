import { red } from "chalk";
import {run} from "./problem-190";

try {
    run();
} catch (error) {
    console.error(red(error.message))
}
