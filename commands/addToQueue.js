const Queue = require("../Queue");

const YoutubeApi = require("../YoutubeApi");
const { MessageEmbed, Presence } = require('discord.js');

const Utils = require("../utils");

const playToVoiceChannel = require("../playToVoiceChannel")

module.exports = async (message, args) => {
    var queueWasFinished = false;

    if (args) {
        const videoDetails = await Utils.getVideoDetailsFromCommand(args);
        if (!videoDetails)
            return message.channel.send(":cry: Found no song :cry:");
        
        if (Queue.getQueue().length == 0)
            await message.channel.send(`:notes: Found the song **${videoDetails.title}**! It will be played now :notes:`);   
        else
            await message.channel.send(`:notes: Found the song **${videoDetails.title}**! It will be played once the previous song finishes :notes:`);   
    
        Queue.addToQueue(videoDetails);

        if (Queue.isFinished) {
            Queue.skip();

            Queue.isFinished = false;

            queueWasFinished = true;
        }
    }

    await Utils.sendQueueEmbed(message.channel);

    // If the added song is the only in the queue
    if (args && (Queue.getQueue().length == 1 || queueWasFinished))
    {
        // Play the song
        const voiceChannel = message.member.voice.channel;
        playToVoiceChannel.play(message.channel, voiceChannel);
    }
} 