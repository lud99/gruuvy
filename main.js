

const { Client } = require('discord.js');
const dotenv = require('dotenv');

const client = new Client()

dotenv.config({ path: "./secret.env" });
dotenv.config({ path: "./config.env" });

const Queue = require("./Queue")

const addToQueue = require("./commands/addToQueue");
const leave = require("./commands/leave");
const skip = require("./commands/skip");
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

    if (command === "leave") {
        leave(message, args);
    }
    if (command === "queue") {
        addToQueue(message, args);
    }
    if (command === "skip") {
        skip(message, args);
    }
    if (command === "clear") {
        clearQueue(message, args);
    }
    if (command === "cancel") {
        cancelDownload(message, args);
    }
    if (command === "remove") {
        removeFromQueue(message, args);
    }
    if (command === "queuepos") {
        message.channel.send(Queue.getPosition());
    }
});

client.login(process.env.TOKEN);

/* 
todo
dont leave when loading next song
auto play new song if at the end of the queue, if a new song is added
delete temp audio files
looping
handle canceling a bit better

*/