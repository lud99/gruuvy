const Queue = require("../Queue");

const YoutubeApi = require("../YoutubeApi");
const { MessageEmbed, Presence } = require('discord.js');

const Utils = require("../utils");

const playToVoiceChannel = require("../playToVoiceChannel")

module.exports = async (message, args) => {
    var queueWasFinished = false;

    console.log(args, args.length)

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel && args)
        return message.channel.send(":microphone: You need to be in a voice channel")

    if (args) {
        const videoDetails = await Utils.getVideoDetailsFromCommand(args);
        if (!videoDetails)
            return message.channel.send(":cry: Found no song");
        
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
        playToVoiceChannel.play(message.channel, voiceChannel);
    }
} 