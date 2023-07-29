import fs from "fs";

export function logData({ url, method }, res, next) {
    const fileName = "logs.txt";
    fs.appendFile(fileName, `${url} - ${method}  at ${Date().toString()}\n`, (error, data) => {
        if (error) {
            console.log("errror", error?.message);
        }
    });
    next()
}