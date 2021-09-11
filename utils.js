const { MessageEmbed } = require('discord.js');
const YoutubeApi = require("./YoutubeApi");
const { scrapeResults } = require("./ScrapeYoutube")
const Queue = require("./Queue");

class Utils {
    static createId(length = 6, chars = "abcdefghijklmnopqrstuvwxyz1234567890") {
        let result = "";

        for (let i = 0; i < length; i++)
            result += chars[(Math.random() * chars.length) | 0];

        return result;
    }

    static getVideoId(url) {
        function parseQuery(queryString) {
            var query = {};
            var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return query;
        }

        url = url.split(" ").join(""); // remove spaces

        if (!this.isValidHttpUrl(url))
            return;

        const hostname = new URL(url).hostname.replace("www.", "");

        if (hostname === "youtube.com" || hostname === "youtu.be") {
            if (hostname === "youtube.com") {
                return parseQuery(new URL(url).search).v;
            }
            if (hostname === "youtu.be")
                return new URL(url).pathname.replace("/", "");
        }

        // Wasn't a youtube url
        return;
    }

    static now = () => {
        var today = new Date();
        var offset = today.getTimezoneOffset(); // - today.stdTimezoneOffset()
        var d = new Date();
        d.setMinutes(d.getMinutes() + offset);
        return d.getTime();
    }

    static isValidYoutubeURL(url) {
        return this.getVideoId(url) != null;
    }

    static isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    // https://stackoverflow.com/a/66494926 for future reference
    static randomColor(string) {
        let stringUniqueHash = [...string].reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
    }

    static async getVideoDetailsFromCommand(arg) {
        // Fetch the youtube video
        var videoId;

        // 1. Youtube URL
        if (Utils.isValidYoutubeURL(arg)) {
            videoId = Utils.getVideoId(arg);
        } 
        // 2. Youtube video title
        else {
            const searchResults = await scrapeResults(arg);
            if (!searchResults[0]) return;

            videoId = searchResults[0].id;
        }

        // Get title, thumbnail etc.
        return await YoutubeApi.getVideoDetails(videoId);
    }

    static async sendSongEmbed(channel, videoDetails) {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(videoDetails.title)
            .setURL(`https://www.youtube.com/watch?v=${videoDetails.id}`)
            .setAuthor(videoDetails.channel)
            .addFields(
                { name: 'Duration', value: `${videoDetails.duration.toFixed(1)} minutes` },
            )
            .setImage(videoDetails.thumbnail.url)
            .setTimestamp()

        await channel.send(embed);
    } 

    static async sendQueueEmbed(channel) {
        if (Queue.getQueue().length == 0) {
            channel.send("There are no songs in the queue. Add songs with ```.queue song name``` or ```.play song name```");
            return false;
        }
       
        const songs = Queue.getQueue().map((entry, i) => {
            var title = entry.title;
            if (i == Queue.getPosition()) {
                if (!Queue.isFinished && Queue.isPaused)
                    title = `(Paused) ` + title;
                else
                    title = "(Playing) " + title;
            }
            else if (i == Queue.getPosition() + 1)
                title = `(Next) ` + title;
            else
                title = `(${i + 1}) ` + title; 
    
            return {
                name: title,
                value: `[Link to video](https://www.youtube.com/watch?v=${entry.id})\nDuration: ${entry.duration.toFixed(1)} minutes`
            };
        });

        const current = Queue.getCurrentEntry();
        if (!current) return channel.send(":interrobang: No current queue entry");

        var state = "Playing";
        if (Queue.isPaused) 
            state = "Paused";
        else if (Queue.isFinished) 
            state = "Finished";

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(state)
            .setTitle(`Queued songs (${Queue.getQueue().length})`)
            .addFields(songs)
            .setImage(current.thumbnail.url)
            .setTimestamp()
    
        await channel.send(embed);
        return true;
    }

    static async sendSingleSongEmblem(channel, video) {    
        var success = false;

        const sendEmblem = async () => {
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(video.title)
                .setURL(`https://www.youtube.com/watch?v=${video.id}`)
                .setAuthor(video.channel)
                .addFields(
                    { name: 'Duration', value: `${video.duration.toFixed(1)} minutes` },
                )
                .setImage(video.thumbnail.url)
                .setTimestamp()

            await channel.send(embed);
        }

        if (video.duration > Queue.maxSongDurationMinutes) {
            await channel.send(`:no_entry_sign: The song is too long. Max duration is ${Queue.maxSongDurationMinutes} minutes :no_entry_sign:`);
            success = false;
        } else {
            await channel.send(":notes: Found the song! :notes:"); 
            success = true;
        }

        await sendEmblem();
        return success;
    }
}

module.exports = Utils;