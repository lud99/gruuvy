var queue = [];
var currentPosition = 0;

module.exports.clearQueue = () => {
    queue = [];
    currentPosition = 0;
}

module.exports.getQueue = () => queue;
module.exports.getPosition = () => currentPosition;

module.exports.addToQueue = videoDetails => {
    queue.push(videoDetails);
}

module.exports.removeFromQueue = videoDetails => {
    const index = queue.findIndex(entry => entry.id == videoDetails.id);
    if (!index)
        return false;

    queue.splice(index, 1);
    return true;
}

module.exports.removeFromQueueByIndex = index => {
    if (index < 0 || index > queue.length)
       return false;

    queue.splice(index, 1);

    // It can happen that the queue position is no longer valid if the array is changed, so in that case fix it
    if (currentPosition >= queue.length)
        currentPosition = queue.length - 1;
    if (currentPosition < 0)
        currentPosition = 0;

    return true;
}

module.exports.skip = (nr = 1) => {
    if (currentPosition >= queue.length - nr)
        return false;

    module.exports.isPaused = false;
    module.exports.isFinished = false;

    currentPosition += nr;
    return true;
}

module.exports.skipTo = (nr = 0) => {
    if (nr >= queue.length)
        return false;

    module.exports.isPaused = false;
    module.exports.isFinished = false;

    currentPosition = nr;
    return true;
}

module.exports.back = (nr = 1) => {
    if (currentPosition - nr < 0)
        return false;

    module.exports.isPaused = false;
    module.exports.isFinished = false;

    currentPosition -= nr;
    return true;
}

module.exports.getCurrentEntry = () => {
    if (queue.length == 0) return;
    if (currentPosition < 0 || currentPosition >= queue.length)
        return false;

    return queue[currentPosition];
}

module.exports.isPaused = false;
module.exports.isFinished = false;
module.exports.maxSongDurationMinutes = 30; 