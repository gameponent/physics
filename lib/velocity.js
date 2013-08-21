'use strict';

var geom = require('geom');
var count = 0;

function Velocity(options) {
    options = options || {};
    this.id = count;
    count++;
    this.x = options.x || 0;
    this.y = options.y || 0;
}

Velocity.prototype.step = function (options) {
    var point = options.point;
    var delta = options.delta;

    return new geom.Point({
        x: point.x + parseInt(delta * this.x, 10),
        y: point.y + parseInt(delta * this.y, 10)
    });
};

module.exports = Velocity;