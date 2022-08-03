const { google } = require("googleapis");
const url = require("url");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "client_secret.json");

const TOKEN_DIR = "secrets";
const TOKEN_PATH = path.join(__dirname, "youtube_secrets.json");


let keys = {
  redirect_uris: ["http://localhost:3000/oauth2callback"]
};

if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
  keys = keyFile.installed || keyFile.web;
}

//OAuth Class is used to authenticate request
class OAuth {
  constructor(options) {
    this._options = options || { scopes: [] };

    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error(invalidRedirectUri);
    }
    const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];
    const parts = new url.URL(redirectUri);

    this.oAuth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      redirectUri
    );
  }

  //getToken() is used to retrive the access and refresh token into a json file
  async getToken() {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(TOKEN_PATH, function(err, token) {
          if (err) {
            resolve(false);
          } else {
            resolve(JSON.parse(token));
          }
        });
      } catch (error) {
        resolve(false);
      }
    });
  }

  //authenticate() is used to authenticate every request with the help of access and refresh token
  async authenticate(scopes) {
    return new Promise(async (resolve, reject) => {
      const offLineTokens = await this.getToken();
      if (offLineTokens) {
        this.oAuth2Client.credentials = offLineTokens;
        resolve(this.oAuth2Client);
      } 
    });
  }
}

module.exports = new OAuth();
