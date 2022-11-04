import {SQSHandler} from "aws-lambda";

export const main: SQSHandler = (event) => {
    console.log(event);
}