/**
 * MissileSilo object constructor
 * @param num The silo number
 */
function MissileSilo(num) {
    this.number = num;
    this.location;
    this.missileCount = 10;
    this.missiles = new Array(10);
    this.isDestroyed = false;

    if (this.number == 1) {
        this.location = new Location(0,-3.1);	//Hardcode
    } else if (this.number == 2) {
        this.location = new Location(6.5,-3.1);	//Hardcode
    } else {
        this.location = new Location(-6.5,-3.1);    //Hardcode
    }
    for (var i = 0; i < 10; i++) {
        this.missiles[i] = new Missile(false,this.number,new Location(this.location.X,this.location.Y),null);
    }
}

/**
 * Launches a missile at the target location
 * @param loc The target x,y coordinates
 */
MissileSilo.prototype.fire = function(loc) {

    if (this.missileCount == 0) return;

    this.missileCount--;
    this.missiles[this.missileCount].launch(loc);
}