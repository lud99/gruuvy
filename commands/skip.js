const Queue = require("../Queue");

const YoutubeApi = require("../YoutubeApi");

const mathjs = require("mathjs")

const Utils = require("../utils");
const playToVoiceChannel = require("../playToVoiceChannel");

// gr random
// user info
// play playlists

module.exports = async (message, arg) => {
    var queueNr;
    try {
        queueNr = mathjs.evaluate(arg)
    } catch (error) {
        return message.channel.send(":red_circle: " + error);
    }
    
    queueNr -= 1;
    queueNr = Math.round(queueNr);

    if (queueNr < 0)
        return message.channel.send(":red_circle: Can't use negative numbers");

    if (isNaN(queueNr)) {
        if (!Queue.skip())
            return message.channel.send(":red_circle: Can't skip, already at end of the queue");
    } else {
        if (!Queue.skipTo(queueNr))
            return message.channel.send(":red_circle: Can't skip, no song exists at position " + (queueNr + 1));
    }

    if (isNaN(queueNr))
        await message.channel.send("Skipped to the next song");
    else
        await message.channel.send("Skipped to song number " + (queueNr + 1));

    playToVoiceChannel.setIngoreStopSpeaking(true);
    playToVoiceChannel.voiceDispatcher().pause();

    await Utils.sendQueueEmbed(message.channel);

    // Play the song
    const voiceChannel = message.member.voice.channel;
    playToVoiceChannel.play(message.channel, voiceChannel);
}