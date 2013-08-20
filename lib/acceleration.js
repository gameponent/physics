var count = 0;
var Velocity = require('./velocity');

function Acceleration(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.id = count;
    count++;
}

Acceleration.prototype.step = function (options) {
    var velocity = options.velocity;
    var delta = options.delta;

    return new Velocity({
        x: velocity.x + (int) (delta * this.x),
        y: velocity.y + (int) (delta * this.y)
    });
};

Acceleration.sum = function(options) {
    var result = new Acceleration();

    options.accelerations.forEach(function (acceleration) {
        result.x += acceleration.x;
        result.y += acceleration.y;

    });

    return result;
};

module.exports = Acceleration;