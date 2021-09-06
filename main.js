

const Discord = require('discord.js');
const Intents = Discord.Intents;
const dotenv = require('dotenv');

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const prefix = '.';

dotenv.config({ path: "./secret.env" });
dotenv.config({ path: "./config.env" });

client.once('ready', () => {
    console.log('Gruuvy is online!');
});

const play = require("./commands/play");

client.on('message', message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix)) return;

    // Not an url. Do normal commands
    if (command === "p") {
        play(message, command);
    }
    
});

client.login(process.env.TOKEN);