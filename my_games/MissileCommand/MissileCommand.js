/**
 * MissileCommand game
 * @author Nicholas Anthony
 * @author Russell Creswell
 */


/**
 * Resets the variables and continues to the next level
 */
function nextLevel(reset) {
    currentLevel++;

    launchAudio.pause();
    explosionAudio.pause();
    levelupAudio.play();
    launchAudio.load();
    explosionAudio.load();

    missilesDestroyed = 0;

    if (reset == 1) {
        calculateBonusScore();
    } else {
        currentScore = 0;
        for (var i = 0; i < city.length; i++) {
            if (city[i].isDestroyed) {
                city[i].isDestroyed = false;
                scene.add(city[i]);
                citiesRemaining++;
            }
        }
        xCount = -6.5;
        for (var i = 0; i < enemyMissiles.length; i++) {
            scene.remove(enemyMissiles[i].mesh);
            scene.remove(enemyMissiles[i].line);
            enemyMissiles[i] = new Missile(true,i,new Location(xCount,6),null);

            geo = new THREE.SphereGeometry(0.05,32,32);
            mat = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: false});
            enemyMissiles[i].mesh = new THREE.Mesh(geo,mat);
            enemyMissiles[i].timer = 0;

            xCount += 1.3;
        }
        xCount = -6.5;
    }

    //Clear out and reset the silos
    for (var i = 0; i < 3; i++) {
        silo[i].isDestroyed = false;
        silo[i].missileCount = 10;
        scene.add(silo[i].mesh);
        //silo[i].missiles = null;
        for (var j = 0; j < 10; j++) {
            scene.remove(siloMissile[i][j]);
            silo[i].missiles[j] = new Missile(false,silo[i].number,new Location(silo[i].location.X,silo[i].location.Y),null);
        }
    }

    if (currentLevel % 3 == 1) {
        for (var i = 0; i < city.length; i++) {
            if (city[i].isDestroyed) {
                city[i].isDestroyed = false;
                scene.add(city[i]);
                citiesRemaining++;
            }
        }
    }
}

/**
 * Calculates the bonus score recieved at the end of each level
 */
function calculateBonusScore() {

    //Bonus for cities
    for (var i = 0; i < city.length; i++) {
        if (!city[i].isDestroyed) {
            currentScore += 200;
        }
    }

    //Bonus for missiles
    for (var i = 0; i < silo.length; i++) {
        if (silo[i].isDestroyed) {
            continue;
        }
        currentScore += (silo[i].missileCount * 5);
    }
}

/**
 * Decides which missile silo to launch from
 * @param x The x coordinate of the target location
 * @returns {*} The index of the silo to launch from
 */
function decideSilo() {

    var currentSilo = -1;

    if (cursorX < -2) {
        if (silo[0].missileCount != 0 && !silo[0].isDestroyed) {
            currentSilo = 0;
        } else if (silo[1].missileCount != 0 && !silo[1].isDestroyed) {
            currentSilo = 1;
        } else if (silo[2].missileCount != 0 && !silo[2].isDestroyed) {
            currentSilo = 2;
        } else {
            return -1;
        }
    } else if (cursorX >= -2 && cursorX <= 2) {
        if (silo[1].missileCount != 0 && !silo[1].isDestroyed) {
            currentSilo = 1;
        } else if (silo[0].missileCount != 0 && !silo[0].isDestroyed) {
            currentSilo = 0;
        } else if (silo[2].missileCount != 0 && !silo[2].isDestroyed) {
            currentSilo = 2;
        } else {
            return -1;
        }
    } else {
        if (silo[2].missileCount != 0 && !silo[2].isDestroyed) {
            currentSilo = 2;
        } else if (silo[1].missileCount != 0 && !silo[1].isDestroyed) {
            currentSilo = 1;
        } else if (silo[0].missileCount != 0 && !silo[0].isDestroyed) {
            currentSilo = 0;
        } else {
            return -1;
        }
    }
    return currentSilo;
}

function gameOver() {
    launchAudio.pause();
    explosionAudio.pause();
    gameOverAudio.play();
//    gameOverAudio.load();
    if (confirm('Would you like to play again?')) {
        currentLevel = 0;
        nextLevel(0);
    } else {
        window.close();
    }
}
