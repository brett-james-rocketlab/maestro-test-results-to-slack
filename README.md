# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

### `slack-token`

**Required**
The Slack token with permissions to post to the channel - starts with xoxb- 
For more information checkout: https://api.slack.com/tutorials/tracks/getting-a-token'
## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/maestro-test-results-to-slack
with:
  test-results-folder: 'MaestroTests/TestResults'
  who-to-greet: 'Mona the Octocat'
```
