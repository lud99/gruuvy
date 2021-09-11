

const { Client } = require('discord.js');
const dotenv = require('dotenv');

const client = new Client()

dotenv.config({ path: "./secret.env" });
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

const prefix = 'gr';

client.once('ready', () => {
    console.log('Gruuvy is online!');
});

client.on('message', message => {
    if (message.author.bot) return;

    var args = message.content.slice(prefix.length + 1).split(" ");
    const command = args.shift();

    args = args.join(" ");

    if (!message.content.startsWith(prefix)) return;

    if (command === "leave" ||  command === "stop") {
        leave(message, args);
    }
    else if (command === "queue") {
        addToQueue(message, args);
    }
    else if (command === "skip") {
        skip(message, args);
    }
    else if (command === "back") {
        back(message, args);
    }
    else if (command === "pause") {
        Queue.isPaused = true;
        playToVoiceChannel.voiceDispatcher().pause();
        message.channel.send(":pause_button:  Resumed song");
    }
    else if (command === "resume") {
        Queue.isPaused = false;
        playToVoiceChannel.voiceDispatcher().resume();
        message.channel.send(":play_pause: Resumed song");
    }
    else if (command === "loop") {
        skip(message, args);
    }
    else if (command === "clear") {
        clearQueue(message, args);
    }
    else if (command === "cancel") {
        cancelDownload(message, args);
    }
    else if (command === "remove") {
        removeFromQueue(message, args);
    }
    else if (command === "queuepos") {
        message.channel.send(Queue.getPosition());
    } else {
        message.channel.send(":interrobang: Unknown command");
    }
});

client.login(process.env.TOKEN);

/* 
todo
dont leave when loading next song - done
auto play new song if at the end of the queue, if a new song is added - done
delete temp audio files - done
looping
handle canceling a bit better

*/