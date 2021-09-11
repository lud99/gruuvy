const Queue = require("../Queue")

module.exports = async (message, args) => {
    Queue.clearQueue();
    message.channel.send("Cleared queue");
}