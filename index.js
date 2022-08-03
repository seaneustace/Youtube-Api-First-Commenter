const prompt = require("prompt-sync")({ sigint: true });
const youtube = require('./youtube');
const dataJson = require('./data');

var lastVideoID = "";

(async () => {
    const channel_id = prompt("Channel ID: ");

    lastVideoID = await youtube.getLastVideoId(channel_id);

    while(true){
        let videoID = await youtube.getLastVideoId(channel_id);
        
        if(lastVideoID !== videoID){            
            console.log(`New video: https://www.youtube.com/watch?v=${videoID}`);
            const data = await youtube.insertComment(videoID, dataJson.commentMessage);

            if(data.isPublic == true){
                console.log("Comment Added to the Video");
            }
            return;
        }
        console.log("No newly uploaded");
        await new Promise(resolve => setTimeout(resolve, dataJson.delayTime));
    }

})();