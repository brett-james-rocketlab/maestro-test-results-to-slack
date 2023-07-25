import fetch from "node-fetch-cjs";
import {
  slackOptions,
  slackPostMessageOptions,
  slackPostMessageResponse,
} from "./types";

/**
 * Posts a string based message to slack.
 * @param {object} options An object containing the following properties:
 *   - token: xoxb- style token
 *   - channelID: channel id to post to
 *   - message: plain text string
 *   - messageBlock: A json object that represents a slack message block
 *   - thread_ts: a timestamp of a thread to post to, will add to a message in the thread
 *   - ts: update an existing message
 * @returns {any}
 */
export async function postToSlack(options: slackOptions) {
  const { token, channelID, message, messageBlock, attachments, thread_ts, ts } = options;

  if (messageBlock) {
    const itemCount = messageBlock.length || 0;
    console.log(`In the MessageBlock defined, there are ${itemCount} items.`);
  }

  // Do blocks if we can instead of text.
  try {
    let slackOptions: slackPostMessageOptions = {
      channel: channelID,
    };

    if (message) {
      slackOptions["text"] = message;
    }

    if (messageBlock) {
      slackOptions["blocks"] = messageBlock;
    }

    if (attachments) {
        slackOptions["attachments"] = attachments;
      }

    // The default api url to send to
    let apiUrl = "https://slack.com/api/chat.postMessage";

    // Checking for extra things to send
    if (thread_ts) {
      // handle thread_ts
      slackOptions["thread_ts"] = thread_ts;
    }

    if (ts) {
      // ts is the timestamp of the message object that comes back
      slackOptions["ts"] = ts;
      apiUrl = "https://slack.com/api/chat.update";
    }
    // console.log(slackOptions);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(slackOptions),
    });
    // console.log(`We sent this extraOptions: ${extraOptions.thread_ts}`)

    const responseData = await response.json();
    // console.log(
    //   `Message sending results after sending to :${apiUrl}`,
    //   responseData
    // );
    return responseData as slackPostMessageResponse;
  } catch (error) {
    console.error("Error sending message, crashing after this:", error);
    throw new Error(`Error sending message: ${error}`);
    // return 2; // Indicate failure, silent or crash is needed?
  }
}
