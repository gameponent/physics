var Body = require('./body');
var geom = require('geom');

function World(options) {
    this.gravity = options.gravity || 0;
    this.bodies = [];
}

World.prototype.createBody = function (options) {
    var body = new Body({
        pos: options.pos || new geom.Point(),
        hitbox: options.hitbox || new geom.Rect(),
        dynamic: options.dynamic || false
    });

    body.addAcceleration({x: 0, y: gravity}));
    this.bodies.push(body);

    return body;
};


World.prototype.step = function(options) {
    var delta = options.delta;
    
    this.bodies.forEach(function (body) {
        body.step(delta, this.bodies);
    });

    this.bodies = this.bodies.filter(function (body) {
        return body.enable;
    });
};

module.exports = World;