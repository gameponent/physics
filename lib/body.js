'use strict';

var geom = require('geom');
var Velocity = require('./velocity');
var Acceleration = require('./acceleration');
var count = 0;

function Body(options) {
    options = options || {};
    this.pos = options.pos || new geom.Point();
    if ((this.pos instanceof geom.Point) === false) {
        this.pos = new geom.Point(this.pos);
    }
    this.id = count;
    count++;
    this.accelerations = [];
    this.velocity = new Velocity();
    this.hitboxSpecs = options.hitbox || new geom.Rect();
    if ((this.hitboxSpecs instanceof geom.Rect) === false) {
        this.hitboxSpecs = new geom.Rect(this.hitboxSpecs);
    }
    this.hitbox = new geom.Rect({
        left: this.pos.x + this.hitboxSpecs.x,
        top: this.pos.y + this.hitboxSpecs.y,
        width: this.hitboxSpecs.width,
        height: this.hitboxSpecs.height
    });
    this.dynamic = options.dynamic || false;
    this.enable = true;
    this.listener = options.listener || null;
}

Body.prototype.addAcceleration = function (options) {
    var acceleration = options.acceleration;

    if (acceleration instanceof Acceleration) {
        this.accelerations.push(acceleration);
    } else {
        this.accelerations.push(new Acceleration(acceleration));
    }
};

Body.prototype.collide = function (options) {
    var body = options.body;
    var nextHitbox = options.nextHitbox;

    if (this.velocity.y > 0 && nextHitbox.intersectTop({rect: body.hitbox})) {
        if (this.listener === null || this.listener.onCollideTop({body: body})) {
            this.velocity.y = 0;
            this.pos.y = body.hitbox.bottom() - this.hitbox.height / 2;
        }
    } else if (this.velocity.y < 0 && nextHitbox.intersectBottom({rect: body.hitbox})) {
        if (this.listener === null || this.listener.onCollideBottom({body: body})) {
            this.velocity.y = 0;
            this.pos.y = body.hitbox.top + this.hitbox.height / 2;
        }
    } else if (this.velocity.x < 0 && nextHitbox.intersectLeft({rect: body.hitbox})) {
        if (this.listener === null || this.listener.onCollideLeft({body: body})) {
            this.velocity.x = 0;
            this.pos.x = body.hitbox.left + body.hitbox.width;
        }
    } else if (this.velocity.x > 0 && nextHitbox.intersectRight({rect: body.hitbox})) {
        if (this.listener === null || this.listener.onCollideRight({body: body})) {
            this.velocity.x = 0;
            this.pos.x = body.hitbox.left - this.hitbox.width / 2;
        }
    }
};

Body.prototype.step = function (options) {
    var delta = options.delta;
    var bodies = options.bodies;

    if (this.dynamic === true) {
        var acceleration = Acceleration.sum({accelerations: this.accelerations});
        this.velocity = acceleration.step({velocity: this.velocity, delta: delta});
    }
    var nextPos = this.velocity.step({point: this.pos, delta: delta});
    var nextHitbox = this.hitbox.copy();
    nextHitbox.left = nextPos.x + this.hitboxSpecs.left;
    nextHitbox.top = nextPos.y + this.hitboxSpecs.top;
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
        var that = this;

        bodies.forEach(function (body) {
            console.log(nextHitbox, body.hitbox);
            if (body.id !== that.id
                    && body.hitbox !== null
                    && Math.abs(nextHitbox.left - body.hitbox.left) <= nextHitbox.width + body.hitbox.width
                    && Math.abs(nextHitbox.top - body.hitbox.top) <= nextHitbox.height + body.hitbox.height) {
                that.collide({body: body, nextHitbox: nextHitbox});
            }
        });
    }

    this.pos = this.velocity.step({point: this.pos, delta: delta});

    if (this.hitbox !== null) {
        this.hitbox.left = this.pos.x + this.hitboxSpecs.top;
        this.hitbox.top = this.pos.y + this.hitboxSpecs.top;
    }
};

Body.prototype.setHitbox = function (options) {
    var hitbox = options.hitbox;

    this.hitboxSpecs = hitbox;
    this.hitbox.width = hitbox.width;
    this.hitbox.height = hitbox.height;

};

module.exports = Body;