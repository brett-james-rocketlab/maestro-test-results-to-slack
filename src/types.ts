export interface baseslackOptions {
    token: string, 
    channelID: string, 
  }

  export interface slackOptions extends baseslackOptions {
    message?: string, 
    messageBlock?: object, 
    attachments?: object,
    thread_ts?: string, 
    ts?: string
  }

  export interface imageSlackOptions extends baseslackOptions {
    filePaths: Array<string>, 
    basefolder: string,
    title?: string,
    thread_ts?: string, 
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

  export interface slackImageUploadOptions {
    // token: string, 
    channels?: string, 
    file?: any,
    filename?: string,
    filetype?: string,
    initial_comment?: string,
    thread_ts?: string, 
    text?: string,
    title?: string  
}  

export interface slackPostMessageResponse {
    ok: boolean;
    channel: string;
    ts: string;
    message: {
      bot_id: string;
      type: string;
      text: string;
      user: string;
      ts: string;
      app_id: string;
      blocks: any[]; // Update the type of blocks if known
      team: string;
      bot_profile: {
        id: string;
        app_id: string;
        name: string;
        icons: any; // Update the type of icons if known
        deleted: boolean;
        updated: number;
        team_id: string;
      };
      thread_ts: string;
      parent_user_id: string;
    };
}

export interface slackFileUploadResponse {
    ok: boolean;
    file: {
      id: string;
      created: number;
      timestamp: number;
      name: string;
      title: string;
      mimetype: string;
      filetype: string;
      pretty_type: string;
      user: string;
      editable: boolean;
      size: number;
      mode: string;
      is_external: boolean;
      external_type: string;
      is_public: boolean;
      public_url_shared: boolean;
      display_as_bot: boolean;
      username: string;
      url_private: string;
      url_private_download: string;
      thumb_64: string;
      thumb_80: string;
      thumb_360: string;
      thumb_360_w: number;
      thumb_360_h: number;
      thumb_480: string;
      thumb_480_w: number;
      thumb_480_h: number;
      thumb_160: string;
      image_exif_rotation: number;
      original_w: number;
      original_h: number;
      permalink: string;
      permalink_public: string;
      comments_count: number;
      is_starred: boolean;
      shares: {
        private: {
          [key: string]: {
            reply_users: string[];
            reply_users_count: number;
            reply_count: number;
            ts: string;
          }[];
        };
      };
      channels: string[];
      groups: string[];
      ims: string[];
      has_rich_preview: boolean;
    };
  }