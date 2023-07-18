# Maestro test parser

This action will look for test results in a given folder, and then parse them into a string that can be sent to slack

## ENV variables 

<!-- ### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`. -->

### `SLACK_TOKEN`

**Required**
The Slack token with permissions to post to the channel - starts with xoxb- 
For more information checkout: https://api.slack.com/tutorials/tracks/getting-a-token

### `SLACK_CHANNEL`

**Required**
The channel ID of the place you want to post in - you can get this easily by visiting the channel in a browser and copying the last part of the URL (will be in Capitals)


## Outputs
### `message-string`
The test results parsed as a string that is used to send to slack

### `time`

The time we greeted you.

## Example usage

```yaml
- name: Parse maestro tests and send results to slack
        id: hello
        uses: brett-james-rocketlab/maestro-test-results-to-slack@main
        env:
          SLACK_CHANNEL: ${{ secrets.SLACK_CHANNEL }}
          SLACK_TOKEN: ${{ secrets.SLACK_TOKEN }}
```
