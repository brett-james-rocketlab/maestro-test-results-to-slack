import fs from "fs";
import path from "path";
// import core from "@actions/core";
import { parseTest } from "./parseTest";
import { postToSlack } from "./postToSlack";
import { checkFilesInFolder } from "./helpers";
import alternativeUploadFileToSlack from "./helpers";

async function run() {
  try {
    // const localProjectWorkingPath = '/Users/brettjames/development/maestro-test-results-to-slack' // to fake a local testing spot
    const localProjectWorkingPath = process.env.GITHUB_WORKSPACE as string;
    console.log(
      `Our checked out repo location is at: ${localProjectWorkingPath} (normally only visible after actions/checkout) `
    );

    // console.log(`Greeting value is: ${core.getInput("who-to-greet")}`)
    // Disabled the below for local test running
    // const testFolder = core.getInput("test-results-folder") as string;

    const { TEST_RESULTS_FOLDER, INTRO_MESSAGE } = process.env;
    const testFolder =
      typeof TEST_RESULTS_FOLDER === "string" &&
      TEST_RESULTS_FOLDER.trim() !== ""
        ? TEST_RESULTS_FOLDER
        : "";

    // console.log(
    //   ` the root folder of the project should be.... ${rootDir}, while the testFolder is set as: ${testFolder}`
    // );
    const resultFolder = path.join(localProjectWorkingPath, testFolder);

    try {
      if (fs.existsSync(resultFolder)) {
        console.log(`${testFolder} exists.`);
      } else {
        console.log(`${testFolder} does not exist.`);
      }
    } catch (e) {
      throw new Error(
        `The folder defined as: ${testFolder} does not exist. unset TEST_RESULTS_FOLDER to check in the root folder or check if you need a / at the end`
      );
    }

    console.log(`the result folder is set as: ${resultFolder}`);

    // const data = await fs.promises.readdir(resultFolder);

    console.log("- Listing found files: ");
    const xmlFiles = checkFilesInFolder(resultFolder, "xml");

    if (xmlFiles.length > 0) {
      //   console.log("Found this test file result in your folder: ", xmlFiles);
      const resultText = parseTest(xmlFiles, resultFolder, INTRO_MESSAGE);
      console.log("Finished Parsing test results, we have: \n", resultText);

      //   Check we have all the variables needed
      //   const token = core.getInput("slack-token") || null;
      //   const channelID = core.getInput("slack-channel-id") || null;
      // process.env.GITHUB_WORKSPACE as string;

      const { SLACK_TOKEN, SLACK_CHANNEL, SLACK_THREAD_TS, SLACK_TS } =
        process.env;
      //   const token = core.getInput("slack-token") || null;
      //   const channelID = core.getInput("slack-channel-id") || null;
      if (SLACK_TOKEN == null || SLACK_CHANNEL == null) {
        console.log(
          "⚠️ Error: missing SLACK_TOKEN or SLACK_CHANNEL - please check your workflow file. and add them using with: env: SLACK_CHANNEL: "
        );
        throw new Error(
          "⚠️ Error: missing SLACK_TOKEN or SLACK_CHANNEL - please check your workflow file. and add them using with: env: SLACK_CHANNEL: "
        );
      }

      //  This will send a message to slack, and you can customise the styling.
      const testOptions = {
        token: SLACK_TOKEN,
        channelID: SLACK_CHANNEL,
        message: resultText,
        // messageBlock: { /* message block object */ },
        // thread_ts: SLACK_THREAD_TS,
        // ts: SLACK_TS,
      };
      const slackSendResults = await postToSlack(testOptions);

      let testresults_thread_ts = null;
      let can_send_pictures = false;

      if (slackSendResults && slackSendResults.ok) {
        testresults_thread_ts = slackSendResults.ts;
        can_send_pictures = true;
      } else {
        console.log(
          `slackSendResults failed, we got this back: ${slackSendResults}`
        );
      }

      console.log(
        `We have sent the test results to slack. Can we check for images now? ${can_send_pictures}, the thread_ts is: ${testresults_thread_ts}, we need this to post inside it.`
      );
      console.info(
        "This is where we'll look for images - make sure  your test runner saves to this folder. ",
        resultFolder
      );

      const testPictures = checkFilesInFolder(resultFolder, "png");
      if (testPictures.length > 0 && can_send_pictures) {
        console.log("We've checked - there are pictures to send", testPictures);
        for (const testPicture of testPictures) {
          const fileToSend = path.join(resultFolder, testPicture);
          const pictureOptions = {
            token: SLACK_TOKEN,
            baseFolder: resultFolder,
            channels: [SLACK_CHANNEL],
            // thread_ts: SLACK_THREAD_TS,
            thread_ts: testresults_thread_ts,
            filePath: fileToSend,
          };
          //   console.log(pictureOptions)
          console.log(`Sending ${testPicture}`);
          await alternativeUploadFileToSlack(pictureOptions);
        }

        console.info(
          "We are also going to check in this folder for videos",
          resultFolder
        );

        const testVideos = checkFilesInFolder(resultFolder, "mp4");
        if (testVideos.length > 0 && can_send_pictures) {
          console.log("There are video(s) to send", testVideos);
          for (const testVideo of testVideos) {
            const fileToSend = path.join(resultFolder, testVideo);
            const videoOptions = {
              token: SLACK_TOKEN,
              baseFolder: resultFolder,
              channels: [SLACK_CHANNEL],
              // thread_ts: SLACK_THREAD_TS,
              thread_ts: testresults_thread_ts,
              filePath: fileToSend,
            };
            //   console.log(pictureOptions)
            console.log(
              `Sending video: ${testVideo} - careful of size. (Slack can randomly fail above 20mb)`
            );
            await alternativeUploadFileToSlack(videoOptions);
          }

          //   postToSlack(pictureOptions);
          // const imagesUploaded = await uploadFilesToSlack(pictureOptions)
          // const result = await minimalFileSend(resultFolder+testPictures[0], testPictures[0])

          // const imageBlocks = constructSlackImageMarkdown(imagesUploaded)

          // To post as a markdown message
          // const pictureMessageOptions = {
          //     token: SLACK_TOKEN,
          //     channelID: SLACK_CHANNEL,
          //     message: imagesUploaded[0],
          //     // messageBlock:constructSlackImageMarkdown(imagesUploaded),
          //     thread_ts: SLACK_THREAD_TS,
          //     // ts: SLACK_TS,
          //   };
          // const pictureMessageOptions = {
          //     token: SLACK_TOKEN,
          //     channelID: SLACK_CHANNEL,
          //     // message: resultText,
          //     messageBlock:imageBlocks,
          //     thread_ts: SLACK_THREAD_TS,
          //     // ts: SLACK_TS,
          //   };
          //   const slackPictureUploadMessageResults = await postToSlack(pictureMessageOptions);
          //   console.log("We got there I think", slackPictureUploadMessageResults)

          // console.log(`The result after uploading pictures has been... ${imagesUploaded}`)
        }
      } else {
        console.log(
          "No XML files found to parse for testing - check your test-results-folder setting."
        );
      }
    }
  } catch (err) {
    console.log("Had an error while attempting to open the folder: " + err);
    throw new Error(`Couldn't open the folder: ${err}`);
  }

  console.log("Run() finished.");

  // If we want to set an output for future steps, we can do that here. Example.
  //     const time = new Date().toTimeString();
  //   core.setOutput("time", time);
}

run();
