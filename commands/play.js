const play = (message) => {
    console.log("Play!");

    const voiceChannel = message.member.voice.channel;
    voiceChannel.join().then(connection =>{
        
    }).catch(err => console.log(err));
}

module.exports = play;