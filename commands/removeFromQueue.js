const downloadYoutubeMp3 = require("../downloadMp3");
const playToVoiceChannel = require("../playToVoiceChannel");

const Queue = require("../Queue");
const Utils = require("../utils");

module.exports = async (message, arg) => {
    const queueNr = parseInt(arg) - 1;

    if (isNaN(queueNr)) return message.channel.send(":red_circle: Invalid queue entry specified, it needs to be a number");

    const currentQueuePos = Queue.getPosition();

    if (!Queue.removeFromQueueByIndex(queueNr))
        return message.channel.send(":red_circle: Invalid queue entry specified, it doesn't exist");

    if (Queue.getQueue().length == 0) {
        playToVoiceChannel.voiceChannel().leave();

        message.channel.send(":ballot_box_with_check: All songs have been removed, the queue is empty");
    } else {
        await Utils.sendQueueEmbed(message.channel);
    }

    // If removing the current song
    if (currentQueuePos == queueNr && Queue.getQueue().length != 0) {
        // Then play the next in the queue
        const voiceChannel = message.member.voice.channel;
        playToVoiceChannel.play(message.channel, voiceChannel);
    }
}