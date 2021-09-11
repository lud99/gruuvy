const fs = require("fs");
const ytdl = require("ytdl-core");
const path = require("path");

var shouldCancel = false;

const ffmpegTimemarkToSeconds = (timestamp) => {
    // "00:01:06.82"
    const hours = parseInt(timestamp.split(":")[0]);
    const minutes = parseInt(timestamp.split(":")[1]);
    const seconds = parseInt(timestamp.split(":")[2].slice(0, 2) /* ignore the milliseconds */);

    const totalTimeSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    return totalTimeSeconds;
}

module.exports.cancelDownload = () => {
    shouldCancel = true;
}

module.exports.download = (videoId, filename, onProgressCallback) => {
    return new Promise((resolve, reject) => {
        shouldCancel = false;
        
        const ffmpeg = require("fluent-ffmpeg");

        if (!fs.existsSync("./downloaded-mp3-files"))
            fs.mkdirSync("./downloaded-mp3-files");

        const onProgressIntervalMs = 2000;
        var lastProgressTimestamp = new Date().getTime();

        var stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`);

        const ffmpegAbsolutePath = path.join(__dirname, process.env.FFMPEG_BIN);

        var proc = new ffmpeg({ source: stream })
        proc.setFfmpegPath(ffmpegAbsolutePath);

        proc.audioCodec("libmp3lame");
        proc.on("error", err => {
            console.log(err);
            reject("error", err);
        })

        proc.on("progress", progress => {
            const timeSinceLastProgress = new Date().getTime() - lastProgressTimestamp;
             
            if (shouldCancel) {
                proc.ffmpegProc.stdin.write('q');
                return reject("cancel")
            }

            // Throttle the interval
            if (timeSinceLastProgress >= onProgressIntervalMs)
            {
                onProgressCallback(ffmpegTimemarkToSeconds(progress.timemark));
                lastProgressTimestamp = new Date().getTime();
            }            
        });

        proc.save("./downloaded-mp3-files/" + filename);

        proc.on('end', () => resolve());
    });
};