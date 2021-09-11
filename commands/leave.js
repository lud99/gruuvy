const playToVoiceChannel = require("../playToVoiceChannel");

const Queue = require("../Queue")

module.exports = (message, args) => {
    const voiceChannel = message.member.voice.channel;
    voiceChannel.leave();

    if (playToVoiceChannel.voiceChannel())
        playToVoiceChannel.voiceChannel().leave();

    Queue.clearQueue();
}