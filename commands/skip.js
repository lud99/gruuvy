const Queue = require("../Queue");

const YoutubeApi = require("../YoutubeApi");
const { MessageEmbed } = require('discord.js');

const Utils = require("../utils");
const playToVoiceChannel = require("../playToVoiceChannel");

module.exports = async (message, arg) => {
    const success = Queue.skip();

    if (!success)
        return message.channel.send("Can't skip, already at end of the queue");

    playToVoiceChannel.voiceDispatcher().pause();

    await Utils.sendQueueEmbed(message.channel);

    // Play the song
    const voiceChannel = message.member.voice.channel;
    playToVoiceChannel.play(message.channel, voiceChannel);
}