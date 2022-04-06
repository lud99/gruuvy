

const { Client } = require('discord.js');
const dotenv = require('dotenv');

const client = new Client();
const fs = require("fs")

dotenv.config({ path: "./secrets.env" });
dotenv.config({ path: "./config.env" });

const Queue = require("./Queue")
const playToVoiceChannel = require("./playToVoiceChannel")

const addToQueue = require("./commands/addToQueue");
const leave = require("./commands/leave");
const skip = require("./commands/skip");
const back = require("./commands/back");
const clearQueue = require("./commands/clearQueue");
const cancelDownload = require("./commands/cancelDownload");
const removeFromQueue = require("./commands/removeFromQueue");

// only install once
console.log(fs.statSync(require('ffmpeg-static')));
if (fs.existsSync(fs.statSync(require('ffmpeg-static')) || !fs.statSync(require('ffmpeg-static')).isFile())) {
    require("ffmpeg-static/install")
}

var pathToFfmpeg = require('ffmpeg-static');
console.log("FFMPEG PATH", pathToFfmpeg);

const prefix = 'gr ';

client.once('ready', () => {
    console.log('Gruuvy is online!');
});

const generateHelp = () => {
    const command = (cmd, description, args = "", exampleArgs = "") => {
        if (cmd.split("|").length > 1)
            var exampleCmd = cmd.split("|")[0];
        else
            var exampleCmd = cmd;

        return `\`\`\`${prefix}${cmd}${args ? ` <${(typeof args == "string" ? args : args.join(", "))}>` : ""}, example: ${prefix}${exampleCmd} ${exampleArgs}\`\`\`${description}\n\n`;
    }
    
    var s = command("", "Adds a song to the end of the queue", ["Video to search for", "Video url", "Video id"], "among us drip remix");
    s += command("leave | stop", "Leaves the current channel and cleares the song queue");
    s += command("queue", "Displays all the songs in the queue");
    s += command("next", "Skips to the next song in the queue");
    s += command("skip", "Skips to a song in the queue", ["Song position in queue"], "3");
    s += command("back", "Goes back the previous song in the queue");
    s += command("pause", "Pauses the playback");
    s += command("resume", "Resumes the playback");
    s += command("loop", "Loops the track, queue or nothing", ["none", "track", "queue"], "track");
    s += command("clear", "Clears the entire queue of songs");
    s += command("remove", "Removes a specific song from the queue (The first song is at position 1)", "Song position in queue", "1");
    s += command("help", "duh");

    return s;
}

client.on('message', message => {
    if (message.author.bot) return;

    var args = message.content.slice(prefix.length).split(" ");

    var everythingAfterArgs = args.join(" ");

    const command = args.shift();

    args = args.join(" ");

    if (!message.content.startsWith(prefix)) return;

    if (command === "leave" ||  command === "stop") {
        leave(message, args);
    }
    else if (command === "queue") {
        addToQueue(message, args);
    }
    else if (command === "skip" || command === "next") {
        skip(message, args);
    }
    else if (command === "back") {
        back(message, args);
    }
    else if (command === "pause") {
        Queue.isPaused = true;
        if (playToVoiceChannel.voiceDispatcher())
            playToVoiceChannel.voiceDispatcher().pause();
        message.channel.send(":pause_button: Paused song");
    }
    else if (command === "resume") {
        Queue.isPaused = false;
        if (playToVoiceChannel.voiceDispatcher())
            playToVoiceChannel.voiceDispatcher().resume();
        message.channel.send(":play_pause: Resumed song");
    }
    else if (command === "loop") {
        if (args == "none" || args == "track" || args == "queue")
            Queue.loopMode = args;
        else
            return message.channel.send(":red_circle: Invalid argument for looping command");

        if (args == "none")
        message.channel.send(":repeat_one: Turned off looping");
        if (args == "track")
            message.channel.send(":repeat: Looping track");
        if (args == "queue")
        message.channel.send(":repeat_one: Looping queue");
    }
    else if (command === "loopmode") {
        message.channel.send(Queue.loopMode);
    }
    else if (command === "clear") {
        clearQueue(message, args);
    }
    else if (command === "cancel") {
        //cancelDownload(message, args);
    }
    else if (command === "remove") {
        removeFromQueue(message, args);
    }
    else if (command === "queuepos") {
        message.channel.send(Queue.getPosition());
    } else if (command === "help") {

        message.channel.send(generateHelp());
    } else {
        // interpret it as a song
        addToQueue(message, everythingAfterArgs);
        //message.channel.send(":interrobang: Unknown command");
    }
});

client.login(process.env.GRUUVY_BOT_TOKEN);

/* 
todo
dont leave when loading next song - done
auto play new song if at the end of the queue, if a new song is added - done
delete temp audio files - done
looping
handle canceling a bit better

*/