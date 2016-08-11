let game;
let fonts = {};

function preload() {
    fonts['ken_bold'] = loadFont('assets/Kenney Bold.ttf');
}

function setup() {
    debugSetup();
    game = new Game(30, 10, 30);
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
    }
}

function mouseWheel(event) {
    handleDebugMouseWheel(event.delta);
    console.log(event);
}

function keyPressed() {
    switch(keyCode) {
        case 27:
            game.debug = (game.debug === true) ? false : true; 
            break;
    }
}