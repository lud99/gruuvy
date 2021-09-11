const downloadYoutubeMp3 = require("../downloadMp3");

const Queue = require("../Queue");

module.exports = async (message, arg) => {
    downloadYoutubeMp3.cancelDownload();

    const entry = Queue.getCurrentEntry();

    Queue.removeFromQueue(entry);

    console.log("Canceled download");

    // const queueNr = parseInt(arg) - 1;
    // if (!queueNr) return message.channel.send("Invalid queue entry specified, it needs to be a number");

    // if (!Queue.removeFromQueueByIndex(queueNr))
    //     return message.channel.send("Invalid queue entry specified, it doesn't exist");
}