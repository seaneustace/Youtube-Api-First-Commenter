# Youtube-Api-First-Commenter
Checks a channelID for a newly uploaded video and posts a comment as soon as a video goes live.

## Initializing
Install node.js

```
sudo apt install nodejs
sudo apt install npm
  ```

# Obtain Oauth Credentials https://console.cloud.google.com/apis/dashboard

Download and import client_secret.json

```
client_secret.json
```

# Data.js

```
module.exports = {
    delayTime: 200,
    commentMessage: "Sample Comment for test"
}
```

## Run

```
node oAuth-initiator-client.js
node index.js
Channel ID: <ChannelID>
```

## Output

```
No newly uploaded
No newly uploaded
No newly uploaded
Comment Added to the Video
```
