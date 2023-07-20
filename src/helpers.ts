import fs from "fs";
import path from "path";
import fetch from "node-fetch-cjs";
import FormData from 'form-data'; // TODO: Move away from this to use GOT instead, or if you can assume Node18 native fetch.

export function safeTestUnits(item: any): boolean {
  // Check that there is none, even if it doesn't exist
  const itemCount = parseInt(item) || 0;

  return itemCount === 0 ? true : false;
}

export function checkFilesInFolder(
  folder: string,
  extension: string
): string[] {
  // TODO: add a blacklist for files to not match?
  // const data = await fs.promises.readdir(folder);
  const data = fs.readdirSync(folder);
  //   TODO: Allow extension to be an array for multiple image types
  const foundFiles = data.filter(
    (file) => path.extname(file).toLowerCase() === `.${extension}`
  );
  return foundFiles;
}

// Warning: This is functional but alternatives should be used to manually making a multipart form data object.
export async function createMultipartFormData(
  filePath: string,
  formAttributes?: object
) {
  // export function createMultipartFormData(filePath: string, options: formAttributeOptions)) {
  // This is intended mainly for uploading files due to it being so particular in formatting.
  const { channelID, filePaths, baseFolder, title, thread_ts } = formAttributes;
    //   TODO: This has troubles with the boundary. I have been able to get it to run with uploading an image, but sometimes the filetype is wrong
  console.log(
    "We have the following options: ",
    formAttributes,
    ", and the following thread_ts: ",
    thread_ts
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(`The file '${filePath}' does not exist.`);
  }
  const boundary = "--------------------------" + Date.now().toString(16);
  const fileName = filePath.split("/").pop();
  const contentType = getContentType(fileName);
  const extension = fileName.split(".").pop()?.toLowerCase();
  //   const fileStream = await fs.createReadStream(filePath); // This is not resolving for me
  const fileData = fs.readFileSync(filePath);

  const formData = [];

  // In theory it's not needed when you have it in the header
  // formData.push(`--${boundary}`);
  // formData.push('Content-Disposition: form-data; name="token"');
  // formData.push('');
  // formData.push(token);

  if (channelID) {
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="channels"');
    formData.push("");
    formData.push(channelID);
  }

  if (title) {
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="title"');
    formData.push("");
    formData.push(title);
  }

  if (thread_ts) {
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="thread_ts"');
    formData.push("");
    formData.push(thread_ts);
  }

  //   formData.push(`--${boundary}`);
  //   formData.push('Content-Disposition: form-data; name="filetype"');
  //   formData.push("");
  //   formData.push(extension);

  formData.push(`--${boundary}`);
  formData.push(
    `Content-Disposition: form-data; name="file"; filename="${fileName}";"`
    // `Content-Disposition: form-data; name="file"; filename="${fileName}"; extension="${extension}"`
  );
  formData.push(`Content-Type: ${contentType}`);
  formData.push("");
  formData.push(fileData);

  formData.push(`--${boundary}--`);

  return {
    boundary,
    body: formData.join("\r\n"),
  };
}

export async function minimalFileSend(file, filename) {
  const slackToken = 'YOUR_SLACK_API_TOKEN';
  const slackUploadURL = 'https://slack.com/api/files.upload';

  const fileBuffer = fs.readFileSync(file);
  const fileBlob = new Blob([fileBuffer], { type: 'application/octet-stream' });

  const formData = new FormData();

  const { SLACK_CHANNEL, SLACK_THREAD_TS } = process.env
  formData.append('file', fileBlob, filename);
  formData.append('channels', SLACK_CHANNEL); 
  formData.append('thread_ts', SLACK_THREAD_TS);

  try {
    const response = await fetch(slackUploadURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${slackToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('File uploaded successfully:', data.file.url_private);
    } else {
      console.error('Error uploading the file:', response.statusText);
    }
  } catch (error) {
    console.error('Error uploading the file:', error);
  }
}

export default async function alternativeUploadFileToSlack(options: slackOptions): Promise<Response> {
    const { token, channels, filePath, thread_ts, text_message } = options;
    
    if (!token || !channels || channels.length === 0) {
        throw new Error('Slack token or channels not provided.');
    }

    if (!fs.existsSync(filePath)) {
        throw new Error('File not found: ' + filePath);
    }

    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (error) => {
        throw new Error('Error reading file: ' + error.message);
    });

    const form = new FormData();
    form.append('token', token);
    form.append('thread_ts', thread_ts);
    form.append('channels', channels.join(','));
    form.append('file', fileStream);

    const url = 'https://slack.com/api/files.upload';
    const headers = form.getHeaders();

    try {
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: form,
        });

        // console.log("working with the response: ", response)

        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Error uploading file: ' + error.message);
    }
}




export function constructSlackImageMarkdown(imageUrls: string[]) {
  // TODO: In the current state, private urls of images won't work with markdown (error_download_failed),
  // blocking usage of this for formatted messages that have uploaded images.
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Here is your picture...",
      },
    },
    {
      type: "image",
      image_url: imageUrls[0],
      alt_text: "first image",
    },
  ];
  /*const blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "Here are the pictures...",
          },
        },
        {
          type: 'image',
          image_url: imageUrls[0],
          alt_text: 'Image 1',
        },
        {
          type: 'image',
          image_url: imageUrls[0],
          alt_text: 'Image 2 (faked)',
        },
        {
          type: 'image',
          image_url: imageUrls[0],
          alt_text: 'Uploaded Picture',
        },
      ];
      */

  return blocks;
}

export function getContentType(fileName: string) {
  if (!fileName) {
    return "application/octet-stream";
  }

  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}
