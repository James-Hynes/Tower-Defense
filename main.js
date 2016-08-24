let game;
let fonts = {};
let images = {};

function preload() {
    fonts['ken_bold'] = loadFont('assets/Kenney Bold.ttf');
    fonts['ken_pixel'] = loadFont('assets/Kenney Pixel.ttf');
    fonts['ken_space'] = loadFont('assets/Kenney Space.ttf');
    images['blue_button01'] = loadImage('assets/blue_button01.png');
}

function setup() {
//    debugSetup();
    game = new Game(40, 15, 30);
}

function draw() {
    clear();
    START_BLOCK('gameLoop');
    game.display();
    game.update();
    END_BLOCK('gameLoop');
    
    if(game.debug) {
        drawTable();
    }
}

function mouseReleased() {
    if(game.debug) {
        handleDebugMouseRelease();
    }
}

function mousePressed() {
    if(game.debug) {
        handleDebugMousePress(); 
    } else {
        game.start();
    }
}

function mouseWheel(event) {
    handleDebugMouseWheel(event.delta);
}

function keyPressed() {
    switch(keyCode) {
        case 27:
            game.debug = (game.debug === true) ? false : true; 
            break;
    }
}