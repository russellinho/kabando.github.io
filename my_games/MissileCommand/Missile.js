/**
 * Missile Object constructor
 * @param isEnemy If the missile is friendly or not
 * @param num The missile's number OR Silo number
 * @param loc The x,y coordinates of the missile
 * @param target The end goal for the missile
 */
function Missile(isEnemy, num, loc, target) {

    this.siloNum;
    this.missileNumber;
    this.currentLocation;
    this.isEnemy = isEnemy;
    this.speed;
    this.target;
    this.launched;
    this.active = false;
    this.levelLastFired = 0;

    if (isEnemy) {
        this.missileNumber = num;
        this.speed = currentLevel * 10;
        this.currentLocation = loc;
        this.target = target;
        this.launched = false;
    } else {
        this.siloNum = num;
        this.launched = false;
        this.currentLocation = loc;
    }

}

/**
 * Changes the missile's state to launched. Only possible for friendly missiles.
 * Gives the missile a target to go towards.
 * @param loc The missile's target coordinates
 */
Missile.prototype.launch = function(loc) {
    this.target = loc;
    this.launched = true;
    this.active = true;
}

/**
 * Moves the missile towards it's target
 */
Missile.prototype.move = function() {

    //Get the direction vector
    var directionVector = new vector(this.target.X - this.currentLocation.X, this.target.Y - this.currentLocation.Y);
    directionVector = normalize(directionVector);

    var spd = siloMissileVel;
    if (this.isEnemy) spd = (siloMissileVel / 2) + ((currentLevel - 1) * 0.01);
    directionVector.x *= spd;
    directionVector.y *= spd;

    this.currentLocation.X += directionVector.x;
    this.currentLocation.Y += directionVector.y;

}
