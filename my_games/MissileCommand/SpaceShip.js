/**
 * Spaceship object
 * @constructor
 */
function SpaceShip() {
    this.speed = 0.06;
    this.location = new Location(7.5, 2);
    this.timer = Math.floor(Math.random() * 500);
    this.lastLevel = 0;
    this.launched = false;
    this.isDestroyed = false;
}

/**
 * Function to reset the Spaceship's timer
 */
SpaceShip.prototype.reset = function() {
    this.timer = Math.floor(Math.random() * 500);
    this.isDestroyed = false;
}
