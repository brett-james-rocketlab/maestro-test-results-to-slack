"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToSlack = void 0;
/**
 * Posts a string based message to slack.
 * @param {any} token:string
 * @param {any} channelID:string
 * @param {any} message:string
 * @param {any} messageBlock:any
 * @returns {any}
 */
async function postToSlack(token, channelID, messageBlock, message) {
    const itemCount = parseInt(messageBlock) || 0;
    console.log(`In the MessageBlock, there are ${itemCount} items.`);
    // Do blocks if we can instead of text.
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
        return responseData.ts;
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
    return "hello!";
}
exports.postToSlack = postToSlack;
async function postMessageToSlack(token, channelID, message) {
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
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
}
