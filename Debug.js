let mode = undefined;
let blocks = {};

function START_BLOCK(block) {
    blocks[block] = [performance.now()];
}

function END_BLOCK(block) {
    blocks[block].push(performance.now() - blocks[block][0]);
}

function drawTable() {
    var keys = Object.keys(blocks);
    var tableWidth = 500,
        tableHeight = Object.keys(blocks).length * 50;
    
    push();
    stroke(0);
    rectMode(CORNER);
    fill(68, 70, 118, 200);
    rect(width - tableWidth, 0, width, tableHeight);
    for(var i = 0; i < 3; i++) {
        line(width - i * (tableWidth / 3), 0, width - i * (tableWidth / 3), tableHeight);
    } 
    
    fill(255);
    textAlign(CENTER);
    text('Block Name', width - ((tableWidth / 3) * 2.5), (tableHeight / keys.length) - 20);
    text('Block Percent', width - ((tableWidth / 3) * 1.5), (tableHeight / keys.length) - 20);
    text('Block Time', width - ((tableWidth / 3) / 2), (tableHeight / keys.length) - 20);

    for(var i = 1; i < keys.length; i++) {
        line(width, i * (tableHeight / keys.length), width - tableWidth, i * (tableHeight / keys.length));
        text(keys[i], width - (tableWidth / 3) * 2.5, (i + 1) * (tableHeight / keys.length) - 20);
        text(`${Math.trunc((blocks[keys[i]][1] / blocks['gameLoop'][1]) * 100)}%`, width - (tableWidth / 3) * 1.5, (i + 1) * (tableHeight / keys.length) - 20);
        text(`${(blocks[keys[i]][1]).toFixed(4)}ms`, width - (tableWidth / 3) / 2, (i + 1) * (tableHeight / keys.length) - 20);
    }
    
    pop();
}

function handleDebugMousePress() {
    let selectedTile = game.map.getTileByGridPos(Math.floor(mouseY / game.map.tilesize), Math.floor(mouseX / game.map.tilesize));
    
    if(selectedTile === undefined) {
        return false;
    }
    
    if(mouseButton === RIGHT) {
        if(game.map.destinationTilePos === undefined) {
            selectedTile.addOccupier('destination');
            game.map.destinationTilePos = selectedTile.gridPos;
        } else {
            game.map.tiles[game.map.destinationTilePos[0]][game.map.destinationTilePos[1]].clearOccupiers();
            selectedTile.addOccupier('destination');
            game.map.destinationTilePos = selectedTile.gridPos;
        }
    } else if(mouseButton === LEFT) {
        if(keyIsDown(17)) {
            console.log(selectedTile.occupiers);
            if(selectedTile.occupiers[0] instanceof Wall && selectedTile.occupiers.length === 1) {
                selectedTile.addOccupier('tower');
                return false;
            }
        }
        if(!selectedTile.occupied) {
            mode = 'add';
        } else {
            mode = 'remove';
        }
    } else {
        game.enemies.push(new Enemy(mouseX, mouseY, 10, 10, [29, 182, 200], 10));
    }
}

function handleDebugMouseRelease() {
    mode = undefined;
    game.map.createGridPaths();
}

function handleDebugMouseWheel(delta) {
    for(let i = 0; i < Math.floor(Math.abs(delta) / 100); i++) {
        game.enemies.push(new Enemy(mouseX, mouseY, 10, 10, [29, 182, 200], 10));
    }
}

function addWall() {
    if((mouseX >= 0 && mouseX <= (game.map.width * game.map.tilesize)) && (mouseY >= 0 && mouseY <= (game.map.height * game.map.tilesize))) {
        let selectedTile = game.map.getTileByGridPos(Math.floor(mouseY / game.map.tilesize), Math.floor(mouseX / game.map.tilesize));
        
        if(selectedTile === undefined) {
            return false;
        }
        
        if(selectedTile.gridPos.toString() !== game.map.destinationTilePos.toString() && !selectedTile.occupied) {
            selectedTile.addOccupier('wall');                  
        }
    }
}

function removeWall() {
    if((mouseX >= 0 && mouseX <= (game.map.width * game.map.tilesize)) && (mouseY >= 0 && mouseY <= (game.map.height * game.map.tilesize))) {
        let selectedTile = game.map.getTileByGridPos(Math.floor(mouseY / game.map.tilesize), Math.floor(mouseX / game.map.tilesize));
        
        if(selectedTile === undefined) {
            return false;
        }
        
        if(selectedTile.gridPos.toString() !== game.map.destinationTilePos.toString()) {
            selectedTile.clearOccupiers();                  
        }
    }
}

function addWallsToTowerRange(row, col) {
    for(let tile of game.map.getTileByGridPos(row, col).occupiers[1].tilesInRange) {
        game.map.getTileByGridPos(...JSON.parse(`[${tile}]`)).addOccupier('wall');
    }
}

function debugSetup() {
    document.getElementById('defaultCanvas0').addEventListener('contextmenu', function(e) {
        if (e.button === 2) {
            e.preventDefault();
            return false;
        }
    }, false);
}

function debugUpdate() {
    if(mouseIsPressed && mouseButton === LEFT) {
        if(mode === 'add') {
            addWall();
        } else if(mode === 'remove') {
            removeWall();
        }
    }
}

