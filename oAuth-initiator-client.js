const oAuth = require('./oAuth-client');
const fs = require('fs');

try {
  fs.unlinkSync('./youtube_secrets.json');
} catch (err){
  console.log(err.message);
}

const scopes = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/userinfo.profile"
];


oAuth.authenticate(scopes);