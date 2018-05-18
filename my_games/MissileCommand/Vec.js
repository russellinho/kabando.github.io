/**
 * Parts of vector class derived from content given to us for the exercises.
 */

//constructor
function vector(x, y){
    this.x = x;
    this.y = y;
}

//flip function
function flip(v){
    v.x = -v.x;
}

//scale function
function scale(c,v) {
    return(new vector(c*v.x,c*v.y));
}

//normalize function
function normalize(v) {
    var lenDenom = 1/Math.sqrt(dot(v,v));
    return(scale(lenDenom,v));
}

//dot function
function dot(v1,v2) {
    return(v1.x*v2.x + v1.y*v2.y);
}