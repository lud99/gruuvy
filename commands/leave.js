const playToVoiceChannel = require("../playToVoiceChannel");

const Queue = require("../Queue")

module.exports = (message, args) => {
    if (playToVoiceChannel.voiceChannel())
        playToVoiceChannel.voiceChannel().leave();
    else {
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel) 
            voiceChannel.leave();
    
    }

    Queue.clearQueue();
}