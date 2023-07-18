"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const core_1 = __importDefault(require("@actions/core"));
const parseTest_1 = require("./parseTest");
const postToSlack_1 = require("./postToSlack");
console.log("Hello World! - about to start");
async function run() {
    try {
        // const dirnameString = __dirname;
        // console.log("in the function for Run()");
        // console.log(dirnameString);
        // const rootDir = dirnameString.split("_actions")[0];
        // Not needed anymore if we depend on GHA to checkout the repo
        // const rootDir = dirnameString.split("_actions")[0];
        // const localProjectWorkingPath = '/Users/brettjames/development/maestro-test-results-to-slack'
        const localProjectWorkingPath = process.env.GITHUB_WORKSPACE;
        console.log(`Our checked out repo location is at: ${localProjectWorkingPath} (only visible after actions/checkout) `);
        // console.log(`Greeting value is: ${core.getInput("who-to-greet")}`)
        // Disabled the below for local test running
        // const testFolder = core.getInput("test-results-folder") as string;
        const testFolder = "";
        // console.log(
        //   ` the root folder of the project should be.... ${rootDir}, while the testFolder is set as: ${testFolder}`
        // );
        const resultFolder = path_1.default.join(localProjectWorkingPath, testFolder);
        console.log(`the result folder is set as: ${resultFolder}`);
        const data = await fs_1.default.promises.readdir(resultFolder);
        console.log("- Found files: ");
        const xmlFiles = data.filter((file) => path_1.default.extname(file).toLowerCase() === ".xml");
        if (xmlFiles.length > 0) {
            //   console.log("Found this test file result in your folder: ", xmlFiles);
            const resultText = (0, parseTest_1.parseTest)(xmlFiles, resultFolder);
            console.log("at the end of it all, we have: ", resultText);
            //   Check we have all the variables needed
            const token = core_1.default.getInput("slack-token") || null;
            const channelID = core_1.default.getInput("slack-channel-id") || null;
            if (token == null || channelID == null) {
                console.log("Missing slack token or channel ID - please check your workflow file. and add them using with:");
                return;
            }
            const slackSendResults = (0, postToSlack_1.postToSlack)(resultText, token, channelID, "hello from the action");
            console.log("slackSendResults timestamp: ", slackSendResults);
        }
        else {
            console.log("No XML files found to parse for testing - check your test-results-folder setting.");
        }
    }
    catch (err) {
        console.log("Had an error while attempting to open the folder: " + err);
    }
    console.log("Run() finished....");
    // If we want to set an output for future steps, we can do that here. Example.
    //     const time = new Date().toTimeString();
    //   core.setOutput("time", time);
}
run();
