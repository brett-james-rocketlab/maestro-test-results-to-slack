export interface slackOptions {
    token: string, 
    channelID: string, 
    message?: string, 
    messageBlock?: object, 
    thread_ts?: string, 
    ts?: string
  }

//   The actual Slack POST request
export interface slackPostMessageOptions {
    // token: string, 
    channel: string, 
    attachments?: string, 
    blocks?: object, 
    text?: string,
    thread_ts?: string, 
    ts?: string
  }