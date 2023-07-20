import fs from "fs";
import fetch from "node-fetch-cjs";
import path from "path";
import {
  imageSlackOptions,
  slackFileUploadResponse,
  slackImageUploadOptions,
  slackOptions,
  slackPostMessageOptions,
  slackPostMessageResponse,
} from "./types";
import { createMultipartFormData } from "./helpers";

// Note: I've found that nodes multipart form data handling is not that great,
// so I have needed to build custom boundarys and formdata to make it work for slack.

/**
 * Posts a an image to slack. The default behaviour without a channel ID is to just upload the image and return the URL.
 * @param {object} options An object containing the following properties:
 *   - token: xoxb- style token
 *   - channelID: channel id to post to
 *   - message: plain text string
 *   - messageBlock: A json object that represents a slack message block
 *   - thread_ts: a timestamp of a thread to post to, will add to a message in the thread
 *   - ts: update an existing message
 * @returns {any}
 */
export async function uploadFilesToSlack(options: imageSlackOptions) {
  const { token, channelID, filePaths, baseFolder, title, thread_ts  } = options;
  console.log(options, "options is here")
  const imageUrls: string[] = [];

  console.log(filePaths);
  
  for (const filePath of filePaths) {
    try {
      const fileLocation = path.join(baseFolder, filePath);
      // const formOptions = {
      //   imageLocation,
      //   channelID: SLACK_CHANNEL,
      //   imagePaths: testPictures,
      //   baseFolder: resultFolder,
      //   // message: 'Preparing to send a picture...',
      //   // messageBlock: { /* message block object */ },
      //   thread_ts: SLACK_THREAD_TS,
      // };

      // Create a multipart form data object that contains the file inside it
      const { boundary, body } = await createMultipartFormData(fileLocation, options);
      const headers = {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("https://slack.com/api/files.upload", {
        method: "POST",
        headers: headers,
        body: body,
      });

      const data: slackFileUploadResponse = await response.json();

      if (data.ok) {
        console.log("Picture safely uploaded.");
        imageUrls.push(data.file.url_private);
      } else {
        console.log(
          `Potentially something went wrong with the response in uploading a picture: ${data}`
        );
      }
    } catch (error) {
      console.error("Error uploading a picture:", error);
    }
  }
  return imageUrls;
}

