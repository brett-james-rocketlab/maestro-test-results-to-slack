import fs from "fs";
import path from "path";
// import core from "@actions/core";
import { parseTest } from "./parseTest";
import { postToSlack } from "./postToSlack";

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
    const localProjectWorkingPath = process.env.GITHUB_WORKSPACE as string;
    console.log(
      `Our checked out repo location is at: ${localProjectWorkingPath} (normally only visible after actions/checkout) `
    );

    // console.log(`Greeting value is: ${core.getInput("who-to-greet")}`)
    // Disabled the below for local test running
    // const testFolder = core.getInput("test-results-folder") as string;

    
    const { TEST_RESULTS_FOLDER } = process.env
    const testFolder = (typeof TEST_RESULTS_FOLDER === "string" && TEST_RESULTS_FOLDER.trim() !== "")
    ? TEST_RESULTS_FOLDER
    : "";

    // console.log(
    //   ` the root folder of the project should be.... ${rootDir}, while the testFolder is set as: ${testFolder}`
    // );
    const resultFolder = path.join(localProjectWorkingPath, testFolder);

    try {
        if (fs.existsSync(resultFolder)) {
          console.log(`${testFolder} exists.`)
        } else {
          console.log(`${testFolder} does not exist.`)
        }
      } catch(e) {
        throw new Error(`The folder defined as: ${testFolder} does not exist. unset TEST_RESULTS_FOLDER to check in the root folder or check if you need a / at the end` );
      }

    console.log(`the result folder is set as: ${resultFolder}`);

    const data = await fs.promises.readdir(resultFolder);
    console.log("- Listing found files: ");

    const xmlFiles = data.filter(
      (file) => path.extname(file).toLowerCase() === ".xml"
    );

    if (xmlFiles.length > 0) {
      //   console.log("Found this test file result in your folder: ", xmlFiles);
      const resultText = parseTest(xmlFiles, resultFolder);
      console.log("at the end of it all, we have: ", resultText);

      //   Check we have all the variables needed
    //   const token = core.getInput("slack-token") || null;
    //   const channelID = core.getInput("slack-channel-id") || null;
    // process.env.GITHUB_WORKSPACE as string;

    const {SLACK_TOKEN, SLACK_CHANNEL, SLACK_THREAD_TS, SLACK_TS } = process.env
    //   const token = core.getInput("slack-token") || null;
    //   const channelID = core.getInput("slack-channel-id") || null;
      if (SLACK_TOKEN == null || SLACK_CHANNEL == null) {
        console.log(
          "⚠️ Error: missing SLACK_TOKEN or SLACK_CHANNEL - please check your workflow file. and add them using with: env: SLACK_CHANNEL: "
        );
        throw new Error("⚠️ Error: missing SLACK_TOKEN or SLACK_CHANNEL - please check your workflow file. and add them using with: env: SLACK_CHANNEL: " );
      }
      const options = {
        token: SLACK_TOKEN,
        channelID: SLACK_CHANNEL,
        message: resultText,
        // messageBlock: { /* message block object */ },
        thread_ts: SLACK_THREAD_TS,
        ts: SLACK_TS,
      };

      const slackSendResults = postToSlack(options);

      console.log("slackSendResults timestamp: ", slackSendResults);

    //   TODO: Check for pictures
    } else {
      console.log(
        "No XML files found to parse for testing - check your test-results-folder setting."
      );
    }
  } catch (err) {
    console.log("Had an error while attempting to open the folder: " + err);
    throw new Error(`Couldn't open the folder: ${err}` );
  }

  console.log("Run() finished.");

  // If we want to set an output for future steps, we can do that here. Example.
  //     const time = new Date().toTimeString();
  //   core.setOutput("time", time);
}

run();
