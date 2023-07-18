import fetch from 'node-fetch';

/**
 * Posts a string based message to slack.
 * @param {any} token:string
 * @param {any} channelID:string
 * @param {any} message:string
 * @param {any} messageBlock:any
 * @returns {any}
 */
export async function postToSlack(
  token: string,
  channelID: string,
  messageBlock: any,
  message: string
) {
  const itemCount = parseInt(messageBlock) || 0;
  console.log(`In the MessageBlock, there are ${itemCount} items.`);

  // Do blocks if we can instead of text.
  try {
    console.log("Sending message to slack via POST...")
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel: channelID,
        text: message,
      }),
    });

    const responseData = await response.json();
    console.log("Message sending results:", responseData);
    return responseData.ts as string;
  } catch (error) {
    console.error("Error sending message:", error);
  }

  return "hello!";
}

async function postMessageToSlack(
  token: string,
  channelID: string,
  message: string
) {
  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel: channelID,
        text: message,
      }),
    });

    const responseData = await response.json();

    console.log("Message sent:", responseData);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
