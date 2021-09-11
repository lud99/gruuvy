const Queue = require("./Queue");
const downloadYoutubeMp3 = require("./downloadMp3");

var voiceDispatcher;
var currentVoiceChannel;

const ytdl = require("ytdl-core")

var isLoadingSong = false;

const playToVoiceChannel = async (commandChannel, voiceChannel) => {
    const video = Queue.getCurrentEntry();
    if (!video)
        return commandChannel.send(":interrobang: No song in queue to play");

    const filename = video.videoId + ".mp3";
    // console.log("Fetching video", video.title);
    // try {
    //     isLoadingSong = true;
    //     loadingMessage = await commandChannel.send(`:hourglass: Loading song ${video.title}... 0% completed`);

    //     try {
    //         await downloadYoutubeMp3.download(video.videoId, filename, async secondsDone => {
    //             const percentageDone = secondsDone / (video.duration * 60 /* convert duration to seconds */) * 100;
    
    //             console.log(`${percentageDone.toFixed(1)}% done`);
    
    //             await loadingMessage.edit(`:hourglass: Loading song ${video.title}... ${percentageDone.toFixed(1)}% done`);
    //         });   
    //     } catch (error) {
    //         if (error == "cancel") {
    //             return await loadingMessage.edit(`:x: The download was canceled for ${video.title}`);
    //         }
    //     }
    
    //     loadingMessage.edit(`:white_check_mark: Playing song ${video.title}!`);
    // } catch (error) {
    //     console.log("Error fetching youtube video!", error);
    //     return;
    // }

    // console.log("Downloaded video", filename);

    // isLoadingSong = false;

    commandChannel.send(`:white_check_mark: Playing song ${video.title}!`);

    // Join the voice channel and play song
    voiceChannel.join().then(connection => {
        currentVoiceChannel = voiceChannel;

        voiceDispatcher = connection.play(ytdl(`https://www.youtube.com/watch?v=${video.id}`, { quality: "lowestaudio" }));

        voiceDispatcher.on("speaking", (speaking) => {
            if (speaking || Queue.isPaused) return;
            
            console.log("Song finished playing");
            const couldSkipToNextSong = Queue.skip();
            if (!couldSkipToNextSong) {
                //voiceChannel.leave();
                Queue.isFinished = true;
            } else {
                playToVoiceChannel(commandChannel, voiceChannel);
            }
        });
    }).catch(err => console.log(err));
};

module.exports.play = playToVoiceChannel;
module.exports.isLoadingSong = isLoadingSong;
module.exports.voiceDispatcher = () => voiceDispatcher;
module.exports.voiceChannel = () => currentVoiceChannel;