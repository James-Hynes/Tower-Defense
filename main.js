let game;
let fonts = {};
let images = {};

function setup() {
    game = new Game(40, 15, 30);
    game.start();
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