"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
console.log("Hello World! - about to start");
async function run() {
    try {
        const dirnameString = __dirname;
        console.log("in the function for Run()");
        console.log(dirnameString);
        // const rootDir = dirnameString.split("_actions")[0];
        // Env checking way:
        const localProjectWorkingPath = process.env.GITHUB_WORKSPACE;
        console.log(`Our checked out repo location is at: ${localProjectWorkingPath} (only visible after actions/checkout) `);
        const rootDir = dirnameString.split("_actions")[0];
        // const testFolder = core.getInput("test-results-folder") as string;
        const testFolder = "";
        console.log(` the root folder of the project should be.... ${rootDir}, while the testFolder is set as: ${testFolder}`);
        const resultFolder = path_1.default.join(rootDir, testFolder);
        console.log(`the result folder is set as: ${resultFolder}`);
        const data = await fs_1.default.promises.readdir(resultFolder);
        console.log("- Found files: ");
        const xmlFiles = data.filter((file) => path_1.default.extname(file).toLowerCase() === ".xml");
        if (xmlFiles.length > 0) {
            console.log("There is XML files in the folder given");
        }
        else {
            console.log("No XML files found to parse for testing - check your test-results-folder setting.");
        }
    }
    catch (err) {
        console.log("Had an error while attempting to open the folder: " + err);
    }
    console.log("Run() finished....");
}
run();
