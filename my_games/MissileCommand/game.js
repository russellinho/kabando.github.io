// Textures/materials
var terrainMaterials = [
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/terrain.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/terrain.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/terrain.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/terrain.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/terrain.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/terrain.jpg'), side: THREE.DoubleSide} )
];

var cityMaterials = [
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/city.png'), transparent: true, opacity: 0, side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/city.png'), transparent: true, opacity: 0, side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/city.png'), transparent: true, opacity: 0, side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/city.png'), transparent: true, opacity: 0, side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/city.png'), transparent: true, opacity: 1, side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/city.png'), transparent: true, opacity: 0, side: THREE.DoubleSide} )
];

var siloMaterials = [
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/metal.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/metal.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/metal.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/metal.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/metal.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('https://russellinho.github.io/gamepic/metal.jpg'), side: THREE.DoubleSide} )
];

var terrainMaterial = new THREE.MeshFaceMaterial(terrainMaterials);
var cityMaterial = new THREE.MeshFaceMaterial(cityMaterials);
var siloMaterial = new THREE.MeshFaceMaterial(siloMaterials);

var scene;
var camera;
var renderer;
var cursorX = 0;
var cursorY = 0;
var sceneHUD;
var cameraHUD;
var sceneBkgd;
var cameraBkgd;
var scene;
var camera;
var renderer;
var cursorX = 0;
var cursorY = 0;
var sceneHUD;
var cameraHUD;
var sceneBkgd;
var cameraBkgd;

var hudBitmap;
var hudTexture;

//Global Arrays
var city = new Array(6);
var silo = new Array(3);
var enemyMissiles = new Array(10);
var highScore = 10000;

//Global variables
var currentScore = 0;
var currentLevel = 1;

var explosionAudio = new Audio('Audio/explosion.wav');
var launchAudio = new Audio('Audio/launch.wav');
var levelupAudio = new Audio('Audio/levelup.wav');
var gameOverAudio = new Audio('Audio/gameOver.wav');

var geo;

var mat;

// Terrain
var plane;
var plane1;
var plane2;
var plane3;

var lights;

// Holds the meshes for each missile
var siloMissile = new Array(3);
var siloMissileGeo;
var siloMissileMat;
var siloMissileVel = 0.08;
var spaceship = new SpaceShip();

// Missiles fired; resets every time it hits 10
var missilesDestroyed = 0;
var citiesRemaining = 6;

// Initialization variables, not important
var siloMeshIndex = 0;
var xCount = -6.5;

// Constant line material
var lineMat = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 3 });
// Explosions
var explosionMat = new THREE.MeshPhongMaterial({color: 0xFF8C00, wireframe: false});
var explosionGeo = new THREE.SphereGeometry(0.3,32,32);
var explosions = [];

// Spaceship
var spaceshipGeo;
var spaceshipGeo2;
var spaceshipMat;
var spaceshipMat2;
var spaceship;

document.onmousemove = function(e) {
    var v = new THREE.Vector3();
    v.set(( e.clientX / window.innerWidth * 1.5) * 2 - 1,-( e.clientY / window.innerHeight ) * 2 + 1,0.5);
    v.unproject( camera );
    var dir = v.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    cursorX = pos.x;
    cursorY = pos.y;
    var div = document.getElementsByTagName('canvas');
    div.onmouseover = function () {
        this.style.cursor="crosshair";
    };
}

// Handle mouse click
document.addEventListener('click', function(event) {
    // Get missile silo to launch missile from based on mouse position
    var s = decideSilo();
    var temp = new THREE.Mesh(siloMissileGeo, siloMissileMat);

    if (s == 0 && silo[0].missileCount > 0) {
        // Instantiate missile at silo
        temp.position.x = silo[0].location.X;
        temp.position.y = silo[0].location.Y;
        //temp.position.z = silo[0].location.z;
    } else if (s == 1 && silo[1].missileCount > 0) {
        // Instantiate missile at silo
        temp.position.x = silo[1].location.X;
        temp.position.y = silo[1].location.Y;
        //temp.position.z = silo[1].location.z;
    } else if (s == 2 && silo[2].missileCount > 0) {
        // Instantiate missile at silo
        temp.position.x = silo[2].location.X;
        temp.position.y = silo[2].location.Y;
        //temp.position.z = silo[2].location.z;
    }
    var yVal;
    if (cursorY < -1.5) {
        yVal = -1.5;
    } else {
        yVal = cursorY;
    }
    launchAudio.play();
    silo[s].fire(new Location(cursorX, yVal));

    // Add to active missiles
    siloMissile[s][silo[s].missileCount] = temp;
    scene.add(temp);
});

function setupScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth/1.5, window.innerHeight);
    renderer.setClearColor( 0x000000, 1 );
    renderer.autoClear = false;
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    // Lighting
    lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( -10, 10, 0 );
    lights[ 1 ].position.set( 10, 10, 0 );
    lights[ 2 ].position.set( 0, 10, -5 );

    lights[ 0 ].intensity = 3;
    lights[ 1 ].intensity = 3;
    lights[ 2 ].intensity = 3;

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );

    // Add base terrain
    geo = new THREE.BoxGeometry(16,0.5,5);
    mat = new THREE.MeshPhongMaterial({color: 0x0000FF, wireframe: false});
    plane = new THREE.Mesh(geo, terrainMaterial);
    scene.add(plane);

    // Add left side hill
    geo = new THREE.BoxGeometry(2,0.5,5);
    plane1 = new THREE.Mesh(geo,terrainMaterial);

    // Add middle hill
    geo = new THREE.BoxGeometry(2,0.5,5);
    plane2 = new THREE.Mesh(geo,terrainMaterial);

    // Add right side hill
    geo = new THREE.BoxGeometry(2,0.5,5);
    plane3 = new THREE.Mesh(geo,terrainMaterial);

    // Add turrets to the environment
    geo = new THREE.BoxGeometry(0.25,0.25,0.25);
    mat = new THREE.MeshPhongMaterial({color: 0x9400D3, wireframe: false});
    silo[0] = new MissileSilo(0);
    silo[0].mesh = new THREE.Mesh(geo,siloMaterial);
    silo[1] = new MissileSilo(1);
    silo[1].mesh = new THREE.Mesh(geo,siloMaterial);
    silo[2] = new MissileSilo(2);
    silo[2].mesh = new THREE.Mesh(geo,siloMaterial);

    // Add cities to the environment
    geo = new THREE.BoxGeometry(0.9,0.25,0.25);
    mat = new THREE.MeshPhongMaterial({color: 0x00FF00, wireframe: false});
    city[0] = new THREE.Mesh(geo,cityMaterial);
    city[0].isDestroyed = false;
    city[1] = new THREE.Mesh(geo,cityMaterial);
    city[1].isDestroyed = false;
    city[2] = new THREE.Mesh(geo,cityMaterial);
    city[2].isDestroyed = false;
    city[3] = new THREE.Mesh(geo,cityMaterial);
    city[3].isDestroyed = false;
    city[4] = new THREE.Mesh(geo,cityMaterial);
    city[4].isDestroyed = false;
    city[5] = new THREE.Mesh(geo,cityMaterial);
    city[5].isDestroyed = false;

    // Set city and silo positions
    city[0].position.x = -3.5;
    city[1].position.x = 3.5;
    city[2].position.x = -5;
    city[3].position.x = 5;
    city[4].position.x = -2;
    city[5].position.x = 2;
    city[0].position.y = -3.5;
    city[1].position.y = -3.5;
    city[2].position.y = -3.5;
    city[3].position.y = -3.5;
    city[4].position.y = -3.5;
    city[5].position.y = -3.5;

    silo[0].mesh.position.y = -3.1;
    silo[1].mesh.position.y = -3.1;
    silo[2].mesh.position.y = -3.1;
    silo[0].mesh.position.x = -6.5;
    silo[2].mesh.position.x = 6.5;

    plane.position.y = -4;
    plane1.position.y = -3.5;
    plane2.position.y = -3.5;
    plane3.position.y = -3.5;

    plane1.position.x = -6.5;
    plane3.position.x = 6.5;

    camera.position.z = 10;

    scene.add(plane1);
    scene.add(plane2);
    scene.add(plane3);

    for (var i = 0; i < silo.length; i++) {
        scene.add(silo[i].mesh);
        siloMissile[i] = new Array(10);
    }
    for (var i = 0; i < city.length; i++) {
        scene.add(city[i]);
    }

    xCount = -6.5;
    //Starting and enemy missile creation
    for (var i = 0; i < enemyMissiles.length; i++) {
        enemyMissiles[i] = new Missile(true,i,new Location(xCount,6),null);

        geo = new THREE.SphereGeometry(0.05,32,32);
        mat = new THREE.MeshPhongMaterial({color: 0xFF0000, wireframe: false});
        enemyMissiles[i].mesh = new THREE.Mesh(geo,mat);
        enemyMissiles[i].timer = 0;

        xCount += 1.3;
    }
    xCount = -6.5;
    // Set up silo missile
    siloMissileMat = new THREE.MeshPhongMaterial({color: 0xFFFF00, wireframe: false});
    siloMissileGeo = new THREE.SphereGeometry(0.05,32,32);

    // Set up spaceship
    spaceshipMat = new THREE.MeshBasicMaterial({color: 0xC0C0C0, wireframe: false});
    spaceshipGeo = new THREE.TorusGeometry(0.18,0.03,16,100);
    spaceshipMat2 = new THREE.MeshBasicMaterial({color: 0xC30000, wireframe: false});
    spaceshipGeo2 = new THREE.SphereGeometry(0.1,32,32);
    spaceship = new SpaceShip();
    spaceship.mesh = new THREE.Mesh(spaceshipGeo,spaceshipMat);
    spaceship.mesh2 = new THREE.Mesh(spaceshipGeo2,spaceshipMat2);
    spaceship.mesh.rotation.x = 90;
}

function distance(x1,x2,y1,y2) {
    return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
}

/**
 * Randomly decides the target of the enemy missile at creation.
 * Avoids targeting things that have already been destroyed.
 * @returns {Location}  The location of the target
 */
function decideTarget() {
    while (true) {
        var target = Math.floor(Math.random() * 9);
        if (target == 0) {
            if (silo[0].isDestroyed) {
                continue;
            } else {
                return silo[0].mesh.position;
            }
        } else if (target == 1) {
            if (city[0].isDestroyed) {
                continue;
            } else {
                return city[0].position;
            }
        } else if (target == 2) {
            if (city[1].isDestroyed) {
                continue;
            } else {
                return city[1].position;
            }
        } else if (target == 3) {
            if (city[2].isDestroyed) {
                continue;
            } else {
                return city[2].position;
            }
        } else if (target == 4) {
            if (silo[1].isDestroyed) {
                continue;
            } else {
                return silo[1].mesh.position;
            }
        } else if (target == 5) {
            if (city[3].isDestroyed) {
                continue;
            } else {
                return city[3].position;
            }
        } else if (target == 6) {
            if (city[4].isDestroyed) {
                continue;
            } else {
                return city[4].position;
            }
        } else if (target == 7) {
            if (city[5].isDestroyed) {
                continue;
            } else {
                return city[5].position;
            }
        } else if (target == 8) {
            if (silo[2].isDestroyed) {
                continue;
            } else {
                return silo[2].mesh.position;
            }
        }

    }
}

// Checks collisions between two points
function checkCollision(location1, location2, radius) {
    if (distance(location1.X, location2.X, location1.Y, location2.Y) <= 0.2 + radius) {
        return true;
    }
    return false;
}

// game logic
function update() {
    if (currentScore > highScore) highScore = currentScore;
    // Handle spaceship
    // Launch spaceship if timer is 0
    if (spaceship.timer == 0 && !spaceship.launched) {
        // Spawn the spaceship
        scene.add(spaceship.mesh);
        scene.add(spaceship.mesh2);
        spaceship.mesh.position.x = spaceship.location.X;
        spaceship.mesh.position.y = spaceship.location.Y;
        spaceship.mesh2.position.x = spaceship.location.X;
        spaceship.mesh2.position.y = spaceship.location.Y;
        spaceship.launched = true;
    } else if (spaceship.timer != 0 && !spaceship.launched) {
        spaceship.timer--;
    }
    // Update position if spaceship is launched
    if (spaceship.launched && !spaceship.isDestroyed) {
        spaceship.location.X -= spaceship.speed;
        spaceship.mesh.position.x = spaceship.location.X;
        spaceship.mesh.position.y = spaceship.location.Y;
        spaceship.mesh2.position.x = spaceship.location.X;
        spaceship.mesh2.position.y = spaceship.location.Y;
    }
    // Reset timer if next level is started
    if (spaceship.lastLevel != currentLevel - 1) {
        scene.remove(spaceship.mesh);
        scene.remove(spaceship.mesh2);
        spaceship.lastLevel++;
        spaceship.reset();
        spaceship.launched = false;
        spaceship.location = new Location(7.5,2);
        spaceship.mesh.position.x = spaceship.location.X;
        spaceship.mesh.position.y = spaceship.location.Y;
        spaceship.mesh2.position.x = spaceship.location.X;
        spaceship.mesh2.position.y = spaceship.location.Y;
    }

    // Continually update player missiles
    for (var i = 0; i < silo.length; i++) {
        for (var j = siloMissile[i].length - 1; j >= 0; j--) {
            // Update missile position
            if (silo[i].missiles[j].launched && silo[i].missiles[j].active) {
                // Check for collisions
                if (checkCollision(silo[i].missiles[j].target,silo[i].missiles[j].currentLocation,0)) {
                    scene.remove(siloMissile[i][j]);
                    silo[i].missiles[j].active = false;
                    //Create explosion
                    var explosionX = silo[i].missiles[j].target.X;
                    var explosionY = silo[i].missiles[j].target.Y;
                    explosions.push(new Explosion(new Location(explosionX, explosionY)));
                    // Create explosion mesh
                    explosions[explosions.length - 1].mesh = new THREE.Mesh(explosionGeo,explosionMat);
                    explosions[explosions.length - 1].mesh.position.x = explosions[explosions.length - 1].currentLocation.X;
                    explosions[explosions.length - 1].mesh.position.y = explosions[explosions.length - 1].currentLocation.Y;
                    scene.add(explosions[explosions.length - 1].mesh);
                } else {
                    silo[i].missiles[j].move();
                    siloMissile[i][j].position.x = silo[i].missiles[j].currentLocation.X;
                    siloMissile[i][j].position.y = silo[i].missiles[j].currentLocation.Y;
                }
            }
        }
    }
    // Handle enemy missiles
    for (var i = 0; i < enemyMissiles.length; i++) {
        // Check which enemy missiles need to fire from timer, reset timer if 0
        if (enemyMissiles[i].timer == 0) {
            enemyMissiles[i].timer = Math.floor((Math.random() * 1000)+1);
        }
        // Decrement timer
        if (!enemyMissiles[i].launched) enemyMissiles[i].timer--;
        // If the timer is 0 and hasn't yet fired for this level, then fire the enemy missile
        if (enemyMissiles[i].timer == 0 && enemyMissiles[i].levelLastFired == currentLevel - 1) {
            // Select a target for the enemy missile
            var tar = decideTarget();
            var tarLoc = new Location(tar.x, tar.y);
            // Launch the enemy missile
            enemyMissiles[i].launch(tarLoc);
            enemyMissiles[i].levelLastFired++;
            scene.add(enemyMissiles[i].mesh);
        }
        // Update enemy missile position
        if (enemyMissiles[i].launched) {
            // Line trail
            enemyMissiles[i].geo = new THREE.Geometry();
            enemyMissiles[i].geo.vertices.push(new THREE.Vector3(xCount + (1.3 * i),6,0));

            enemyMissiles[i].move();
            enemyMissiles[i].mesh.position.x = enemyMissiles[i].currentLocation.X;
            enemyMissiles[i].mesh.position.y = enemyMissiles[i].currentLocation.Y;

            enemyMissiles[i].geo.vertices.push(new THREE.Vector3(enemyMissiles[i].currentLocation.X,enemyMissiles[i].currentLocation.Y,0));
            scene.remove(enemyMissiles[i].line);
            enemyMissiles[i].line = new THREE.Line(enemyMissiles[i].geo,lineMat);
            scene.add(enemyMissiles[i].line);
        }
        // Check if enemy missile has reached target; if it has, then destroy the missile and the house/silo
        if (enemyMissiles[i].launched && checkCollision(enemyMissiles[i].target,enemyMissiles[i].currentLocation,0)) {
            // Destroy the building that was hit
            if (enemyMissiles[i].target.X == silo[0].location.X) {
                silo[0].isDestroyed = true;
                scene.remove(silo[0].mesh);
                silo[0].missileCount = 0;
            } else if (enemyMissiles[i].target.X == silo[1].location.X) {
                silo[1].isDestroyed = true;
                scene.remove(silo[1].mesh);
                silo[1].missileCount = 0;
            } else if (enemyMissiles[i].target.X == silo[2].location.X) {
                silo[2].isDestroyed = true;
                scene.remove(silo[2].mesh);
                silo[2].missileCount = 0;
            } else if (enemyMissiles[i].target.X == city[0].position.x) {
                if (!city[0].isDestroyed) {
                    city[0].isDestroyed = true;
                    scene.remove(city[0]);
                    citiesRemaining--;
                }
            } else if (enemyMissiles[i].target.X == city[1].position.x) {
                if (!city[1].isDestroyed) {
                    city[1].isDestroyed = true;
                    scene.remove(city[1]);
                    citiesRemaining--;
                }
            } else if (enemyMissiles[i].target.X == city[2].position.x) {
                if (!city[2].isDestroyed) {
                    city[2].isDestroyed = true;
                    scene.remove(city[2]);
                    citiesRemaining--;
                }
            } else if (enemyMissiles[i].target.X == city[3].position.x) {
                if (!city[3].isDestroyed) {
                    city[3].isDestroyed = true;
                    scene.remove(city[3]);
                    citiesRemaining--;
                }
            } else if (enemyMissiles[i].target.X == city[4].position.x) {
                if (!city[4].isDestroyed) {
                    city[4].isDestroyed = true;
                    scene.remove(city[4]);
                    citiesRemaining--;
                }
            } else if (enemyMissiles[i].target.X == city[5].position.x) {
                if (!city[5].isDestroyed) {
                    city[5].isDestroyed = true;
                    scene.remove(city[5]);
                    citiesRemaining--;
                }
            }

            // Remove missile and create explosion
            var explosionX = enemyMissiles[i].target.X;
            var explosionY = enemyMissiles[i].target.Y;
            scene.remove(enemyMissiles[i].mesh);
            scene.remove(enemyMissiles[i].line);
            enemyMissiles[i].launched = false;
            enemyMissiles[i].target = null;
            enemyMissiles[i].currentLocation = new Location(xCount + (1.3 * i), 6);

            explosions.push(new Explosion(new Location(explosionX, explosionY)));
            // Create explosion mesh
            explosions[explosions.length - 1].mesh = new THREE.Mesh(explosionGeo,explosionMat);
            explosions[explosions.length - 1].mesh.position.x = explosions[explosions.length - 1].currentLocation.X;
            explosions[explosions.length - 1].mesh.position.y = explosions[explosions.length - 1].currentLocation.Y;
            scene.add(explosions[explosions.length - 1].mesh);
            missilesDestroyed++;
        }
    }

    // Check collisions between silo missile and enemy missile
    for (var i = 0; i < silo.length; i++) {
        for (var j = siloMissile[i].length - 1; j >= 0; j--) {
            //Missile-Missile
            if (!silo[i].missiles[j].launched || !silo[i].missiles[j].active) continue;
            for (var k = 0; k < enemyMissiles.length; k++) {
                if (enemyMissiles[k].launched && checkCollision(silo[i].missiles[j].currentLocation, enemyMissiles[k].currentLocation, 0)) {
                    // Destroy enemy missile
                    missilesDestroyed++;
                    var explosionX = 0;
                    var explosionY = 0;
                    scene.remove(enemyMissiles[k].mesh);
                    scene.remove(enemyMissiles[k].line);
                    enemyMissiles[k].launched = false;
                    enemyMissiles[k].target = null;
                    explosionX = (silo[i].missiles[j].currentLocation.X + enemyMissiles[k].currentLocation.X) / 2.0;
                    explosionY = (silo[i].missiles[j].currentLocation.Y + enemyMissiles[k].currentLocation.Y) / 2.0;
                    enemyMissiles[k].currentLocation = new Location(xCount + (1.3 * k), 6);
                    //Destroy silo missile
                    scene.remove(siloMissile[i][j]);
                    silo[i].missiles[j].active = false;

                    currentScore += 25 * currentLevel;
                    launchAudio.pause();
                    explosionAudio.play();
                    launchAudio.load();

                    //Create explosion
                    explosions.push(new Explosion(new Location(explosionX, explosionY)));
                    // Create explosion mesh
                    explosions[explosions.length - 1].mesh = new THREE.Mesh(explosionGeo, explosionMat);
                    explosions[explosions.length - 1].mesh.position.x = explosions[explosions.length - 1].currentLocation.X;
                    explosions[explosions.length - 1].mesh.position.y = explosions[explosions.length - 1].currentLocation.Y;
                    scene.add(explosions[explosions.length - 1].mesh);
                }
            }
            // Missile-spaceship
            if (!spaceship.isDestroyed && checkCollision(spaceship.location,silo[i].missiles[j].currentLocation,0.1)) {
                // Destroy spaceship
                scene.remove(spaceship.mesh);
                scene.remove(spaceship.mesh2);
                spaceship.isDestroyed = true;
                currentScore += 200;
                // Destroy silo missile
                scene.remove(siloMissile[i][j]);
                silo[i].missiles[j].active = false;
                //Create explosion
                var explosionX = spaceship.location.X;
                var explosionY = spaceship.location.Y;
                explosions.push(new Explosion(new Location(explosionX, explosionY)));
                // Create explosion mesh
                explosions[explosions.length - 1].mesh = new THREE.Mesh(explosionGeo,explosionMat);
                explosions[explosions.length - 1].mesh.position.x = explosions[explosions.length - 1].currentLocation.X;
                explosions[explosions.length - 1].mesh.position.y = explosions[explosions.length - 1].currentLocation.Y;
                scene.add(explosions[explosions.length - 1].mesh);
            }
        }
    }

    //Missile-Explosion collisions and handle explosion timers
    for (var k = 0; k < explosions.length; k++) {
        // Decrement explosion timer
        explosions[k].timer--;
        // Check if explosion still exists, if not then remove it and skip it
        if (explosions[k].timer <= 0) {
            // Destroy explosion
            scene.remove(explosions[k].mesh);
            explosions.shift();
            k--;
            continue;
        }
        for (var z = 0; z < enemyMissiles.length; z++) {
            if (enemyMissiles[z].launched && checkCollision(enemyMissiles[z].currentLocation,explosions[k].currentLocation,0.3)) {
                // Destroy enemy missile
                missilesDestroyed++;
                var explosionX = 0;
                var explosionY = 0;
                scene.remove(enemyMissiles[z].mesh);
                scene.remove(enemyMissiles[z].line);
                enemyMissiles[z].launched = false;
                enemyMissiles[z].target = null;
                explosionX = (enemyMissiles[z].currentLocation.X + explosions[k].currentLocation.X) / 2.0;
                explosionY = (enemyMissiles[z].currentLocation.Y + explosions[k].currentLocation.Y) / 2.0;
                enemyMissiles[z].currentLocation = new Location(xCount + (1.3 * z), 6);
                currentScore += (25 * currentLevel);
                launchAudio.pause();
                explosionAudio.play();
                launchAudio.load();
                //Create explosion
                explosions.push(new Explosion(new Location(explosionX, explosionY)));
                // Create explosion mesh
                explosions[explosions.length - 1].mesh = new THREE.Mesh(explosionGeo,explosionMat);
                explosions[explosions.length - 1].mesh.position.x = explosions[explosions.length - 1].currentLocation.X;
                explosions[explosions.length - 1].mesh.position.y = explosions[explosions.length - 1].currentLocation.Y;
                scene.add(explosions[explosions.length - 1].mesh);
            }
        }
        // Explosion-spaceship collision
        if (!spaceship.isDestroyed && checkCollision(spaceship.location,explosions[k].currentLocation,0.1)) {
            // Destroy spaceship
            scene.remove(spaceship.mesh);
            scene.remove(spaceship.mesh2);
            spaceship.isDestroyed = true;
            currentScore += 200;
            //Create explosion
            var explosionX = spaceship.location.X;
            var explosionY = spaceship.location.Y;
            explosions.push(new Explosion(new Location(explosionX, explosionY)));
            // Create explosion mesh
            explosions[explosions.length - 1].mesh = new THREE.Mesh(explosionGeo,explosionMat);
            explosions[explosions.length - 1].mesh.position.x = explosions[explosions.length - 1].currentLocation.X;
            explosions[explosions.length - 1].mesh.position.y = explosions[explosions.length - 1].currentLocation.Y;
            scene.add(explosions[explosions.length - 1].mesh);
        }
    }
    if (missilesDestroyed == 10) {
        //currentLevel++;
        missilesDestroyed = 0;
        nextLevel(1);
    }
    if (citiesRemaining == 0) {
        gameOver();
    }
    updateHUD();
}

function setupHUD() {
    var width = window.innerWidth/1.5;
    var height = window.innerHeight;

    // var width = 1024;
    // var height = 512;

    var hudCanvas = document.createElement('canvas');
    hudCanvas.width = width;
    hudCanvas.height = height;

    hudBitmap = hudCanvas.getContext('2d');
    hudBitmap.font = "Normal 40px Arial";
    hudBitmap.textAlight = 'center';
    hudBitmap.fillStyle = "rgba(0,245,0,1)";

    hudBitmap.fillText('Score: ' + currentScore, width*.05, height*.05);
    hudBitmap.fillText('High-Score: ' + highScore, width*.38, height*.05);
    hudBitmap.fillText('Level: ' + currentLevel, width*.8, height*.05);


    hudBitmap.fillStyle = "rgba(245,245,245,1)";
    // hudBitmap.fillText('' + silo[0].missileCount, 140, 940);
    // hudBitmap.fillText('' + silo[1].missileCount, 670, 940);
    // hudBitmap.fillText('' + silo[2].missileCount, 1200, 940);

    hudBitmap.fillText('' + silo[0].missileCount, width*.1, height*.95);
    hudBitmap.fillText('' + silo[1].missileCount, width*.48, height*.95);
    hudBitmap.fillText('' + silo[2].missileCount, width*.88, height*.95);

    hudBitmap.lineWidth = 10;

    hudBitmap.strokeStyle="green";
    hudBitmap.moveTo(1,1);
    hudBitmap.lineTo(width - 1,1);
    hudBitmap.stroke();

    hudBitmap.strokeStyle="green";
    hudBitmap.moveTo(1,1);
    hudBitmap.lineTo(1,height - 1);
    hudBitmap.stroke();

    hudBitmap.strokeStyle="green";
    hudBitmap.moveTo(1,height - 1);
    hudBitmap.lineTo(width - 1,height - 1);
    hudBitmap.stroke();

    hudBitmap.strokeStyle="green";
    hudBitmap.moveTo(width - 1,1);
    hudBitmap.lineTo(width - 1,height - 1);
    hudBitmap.stroke();

    cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );

    sceneHUD = new THREE.Scene();
    hudTexture = new THREE.Texture(hudCanvas)
    hudTexture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
    material.transparent = true;

    var planeGeometry = new THREE.PlaneGeometry( width, height );
    var plane = new THREE.Mesh( planeGeometry, material );
    sceneHUD.add( plane );
}

function updateHUD() {
    var width = window.innerWidth/1.5;
    var height = window.innerHeight;
    // var width = 1024;
    // var height = 512;

    hudBitmap.clearRect(0, 0, width, height);

    hudBitmap.fillStyle = "rgba(0,245,0,1)";

    hudBitmap.fillText('Score: ' + currentScore, width*.05, height*.05);
    hudBitmap.fillText('High-Score: ' + highScore, width*.38, height*.05);
    hudBitmap.fillText('Level: ' + currentLevel, width*.8, height*.05);

    hudBitmap.fillStyle = "rgba(245,245,245,1)";
    // hudBitmap.fillText('' + silo[0].missileCount, 140, 940);
    // hudBitmap.fillText('' + silo[1].missileCount, 670, 940);
    // hudBitmap.fillText('' + silo[2].missileCount, 1200, 940);

    hudBitmap.fillText('' + silo[0].missileCount, width*.1, height*.95);
    hudBitmap.fillText('' + silo[1].missileCount, width*.48, height*.95);
    hudBitmap.fillText('' + silo[2].missileCount, width*.88, height*.95);

    hudTexture.needsUpdate = true;
}

/**
 * Sets up the background image
 */
function setupBackground() {
    var loader = new THREE.TextureLoader();
    var texture = loader.load("https://russellinho.github.io/gamepic/space.png");
    var backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 0),
        new THREE.MeshBasicMaterial({
            map: texture
        }));

    backgroundMesh.material.depthTest = false;

    sceneBkgd = new THREE.Scene();
    cameraBkgd = new THREE.Camera();

    sceneBkgd.add(cameraBkgd);
    sceneBkgd.add(backgroundMesh);
}

/**
 * Renders the scenes
 * @suppress
 */
function render() {
    renderer.clear();
    renderer.render(sceneBkgd, cameraBkgd);
    renderer.render(scene,camera);
    renderer.render(sceneHUD, cameraHUD);
}

// update, render, repeat
var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
};

function main() {
    setupScene();
    setupHUD();
    setupBackground();
    GameLoop();
}
