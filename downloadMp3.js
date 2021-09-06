var YoutubeMp3Downloader = require("youtube-mp3-downloader");

const download = (videoId, onProgressCallback) => {
    return new Promise((resolve, reject) => {
        const YD = new YoutubeMp3Downloader({
            "ffmpegPath": process.env.FFMPEG_BIN,        // FFmpeg binary location
            "outputPath": "./temp-files",    // Output file location (default: the home directory)
            "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
            "queueParallelism": 2,                  // Download parallelism (default: 1)
            "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
            "allowWebm": false                      // Enable download from WebM sources (default: false)
        });

        YD.download("XqZsoesa55w");

        YD.on("finished", (err, data) => {
            if (err) return reject(err);

            resolve(data);
        });

        YD.on("error", (err) => {
            reject(err);
        });

        YD.on("progress", onProgressCallback);
    });
};