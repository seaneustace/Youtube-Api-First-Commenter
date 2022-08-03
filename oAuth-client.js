const { google } = require("googleapis");
const http = require("http");
const url = require("url");
const opn = require("open");
const destroyer = require("server-destroy");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "client_secret.json");

const TOKEN_DIR = "secrets";
const TOKEN_PATH = path.join(__dirname, "youtube_secrets.json");


let keys = {
  redirect_uris: ["http://localhost:3000"]
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

  //storeToken() is used to store the access and refresh token into a json file
  async storeToken(token) {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
      if (err) throw err;
      console.log("Token stored to " + TOKEN_PATH);
    });
    console.log("Token stored to " + TOKEN_PATH);
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
      } else {
        this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: scopes.join(" ")
        });

        const server = http
          .createServer(async (req, res) => {
            try {
              if (true) {
                const qs = new url.URL(req.url, "http://localhost:3000")
                  .searchParams;
                res.end(
                  "Authentication successful! Please return to the console."
                );
                server.destroy();
                const { tokens } = await this.oAuth2Client.getToken(
                  qs.get("code")
                );
                this.oAuth2Client.credentials = tokens;
                await this.storeToken(tokens);
                resolve(this.oAuth2Client);
              }
            } catch (e) {
              reject(e);
            }
          })
          .listen(3000, () => {
            opn(this.authorizeUrl, { wait: false }).then(cp => cp.unref());
          });
        destroyer(server);
      }
    });
  }
}

module.exports = new OAuth();
