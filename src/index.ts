import fs from "fs";
import path from "path";

console.log("Hello World! - about to start")

async function run() {
    const dirnameString = __dirname;
    console.log("in the function")
    console.log(dirnameString)
    // const rootDir = dirnameString.split("_actions")[0];
    const rootDir = dirnameString.split("_actions")[0];
    console.log(` the root folder of the project should be.... ${rootDir}`)

    console.log("Folder completed....")
    
}

run();