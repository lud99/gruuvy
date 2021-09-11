const playToVoiceChannel = require("../playToVoiceChannel");

module.exports = (message, args) => {
    const voiceChannel = message.member.voice.channel;
    voiceChannel.leave();

    if (playToVoiceChannel.voiceChannel())
        playToVoiceChannel.voiceChannel().leave();
}