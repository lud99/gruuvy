const Queue = require("../Queue");

const YoutubeApi = require("../YoutubeApi");
const { MessageEmbed } = require('discord.js');

const Utils = require("../utils");
const playToVoiceChannel = require("../playToVoiceChannel");

module.exports = async (message, arg) => {
    const success = Queue.back();

    if (!success)
        return message.channel.send(":red_circle: Can't go back, at the start of the queue");

    playToVoiceChannel.voiceDispatcher().pause();

    await Utils.sendQueueEmbed(message.channel);

    // Play the song
    const voiceChannel = message.member.voice.channel;
    playToVoiceChannel.play(message.channel, voiceChannel);
}