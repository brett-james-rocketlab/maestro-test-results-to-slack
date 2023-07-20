# Maestro test parser

This action will look for test results in a given folder, and then parse them into a string that can be sent to slack

Sending a message to your slack instance requires a slack token and channel ID.
It also requires the bot to have chat:write permissions. 
It uses the following api call:
https://api.slack.com/methods/chat.postMessage

Uploading files requires the files.write permission scope. For more information checkout: https://api.slack.com/scopes/files:write

The typical workflow is to check for a test file, and if we get results from there then check for pictures or videos to upload, and attach them to the initial message that has the test results on slack.

## ENV variables 


### `SLACK_TOKEN`

**Required**
The Slack token with permissions to post to the channel - starts with xoxb- 
For more information checkout: https://api.slack.com/tutorials/tracks/getting-a-token

### `SLACK_CHANNEL`

**Required**
The channel ID of the place you want to post in - you can get this easily by visiting the channel in a browser and copying the last part of the URL (will be in Capitals)


## Example usage

```yaml
- name: Parse maestro tests and send results to slack
        id: test-results
        uses: brett-james-rocketlab/maestro-test-results-to-slack@main
        env:
          SLACK_CHANNEL: ${{ secrets.SLACK_CHANNEL }}
          SLACK_TOKEN: ${{ secrets.SLACK_TOKEN }}
```

Or if you have a test folder you've previously generated and want to use, add the TEST_RESULTS_FOLDER env variable.
In the example below, it would be assumed that inside the projects root folder, we then look in the MaestroTests/TestResults folder for the test results, and pictures to send.

```yaml
- name: Parse maestro tests and send results to slack
        id: test-results
        uses: brett-james-rocketlab/maestro-test-results-to-slack@main
        env:
          SLACK_CHANNEL: ${{ secrets.SLACK_CHANNEL }}
          SLACK_TOKEN: ${{ secrets.SLACK_TOKEN }}
          TEST_RESULTS_FOLDER: MaestroTests/TestResults/
```

