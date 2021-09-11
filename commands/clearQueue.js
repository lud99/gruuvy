const Queue = require("../Queue")

const playToVoiceChannel = require("../playToVoiceChannel")

module.exports = async (message, args) => {
    Queue.clearQueue();
    message.channel.send(":wastebasket: Cleared queue");

    playToVoiceChannel.voiceChannel().leave();
}