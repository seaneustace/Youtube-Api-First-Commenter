const { google } = require("googleapis");
const oAuth = require("./oAuth");
const service = google.youtube('v3');
const fs = require('fs');
const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl"
];

// initialize the Youtube API library
const youtube = google.youtube({
  version: "v3",
  auth: oAuth.oAuth2Client
});

const getVideoCount = (channel_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        await oAuth.authenticate(scopes);
      
        const data = await service.channels.list({
            auth: oAuth.oAuth2Client,
            part: 'statistics',
            id: channel_id            
        })

        let count = 0
        if(data.data.items[0] != null){
            count = data.data.items[0].statistics.videoCount
        }

        resolve(count)
      } catch (err){
        console.log(err);
      }   
    });
};

const getLastVideoId = (channel_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        await oAuth.authenticate(scopes);
      
        const data = await service.search.list({
            auth: oAuth.oAuth2Client,
            part: 'snippet',
            channelId: channel_id,
            maxResults: 1,
            order: 'date',
            type: 'video'            
        })

        let video_id = "";
        if(data.data.items[0] != null){
            video_id = data.data.items[0].id.videoId;
        }

        resolve(video_id)
      } catch (err){
        console.log(err);
      }   
    });
}

const insertComment = (video_id, message) => {
    return new Promise(async (resolve, reject) => {
      try {
        await oAuth.authenticate(scopes);
      
        const data = await service.commentThreads.insert({
            auth: oAuth.oAuth2Client,
            "part": [
                "snippet"
              ],
            "resource": {
              "snippet": {
                "topLevelComment": {
                  "snippet": {
                    "videoId": video_id,
                    "textOriginal": message
                  }
                }
              }
            }
        });

        resolve(data.data)
      } catch (err){
        console.log(err);
      }   
    });
}



module.exports = {getVideoCount, getLastVideoId, insertComment}