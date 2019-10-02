class Enemy extends Sprite {
    constructor(x, y, w, h, c, hp) {
        super(x, y, w, h, c);
        this.initializedPos = createVector(x, y);
        this.maxHealth = hp;
        this.health = hp;
    }
    
    findDistanceFromDestination() {
        let destinationTilePosition = [game.map.destinationTilePos[0] * game.tilesize, game.map.destinationTilePos[1] * game.tilesize];
        return (Math.pow(destinationTilePosition[1] - this.pos.x, 2) + Math.pow(destinationTilePosition[0] - this.pos.y), 2); // distance formula w/o sqrt
    }
    
    findGridPos() {
        let gridX = Math.floor( (this.pos.x - (12.5) * ((this.speed.x > 0) ? 1 : -1)) / game.map.tilesize);
        gridX = (gridX > game.map.width - 1) ? game.map.width - 1 : gridX;
        gridX = (gridX < 0) ? 0 : gridX;
        let gridY = Math.floor( (this.pos.y - (12.5) * ((this.speed.y > 0) ? 1 : -1)) / game.map.tilesize);
        gridY = ((gridY > game.map.height - 1) ? game.map.height - 1 : gridY);
        gridY = (gridY < 0) ? 0: gridY;
        return [gridY, gridX];
    }
    
    findNextMovement() {
        let currTile = this.findGridPos();
        let nextTile = game.map.gridpaths[currTile.toString()];
        if(nextTile === undefined) {
            game.removeEnemy(this);
            return false;
        } else if(nextTile === false) {
            game.lives--;
            game.removeEnemy(this);
            return false;
        }
        this.speed.x = 1 * (parseInt(nextTile[1]) - parseInt(currTile[1]));
        this.speed.y = 1 * (parseInt(nextTile[0]) - parseInt(currTile[0]));
    }
    
    getHit(damage) {
        this.health -= damage;
        if(this.health <= 0) {
            game.removeEnemy(this);
            game.addMoney(this.maxHealth);
        }
    }
    
    update() {
        this.findNextMovement();
        this.pos.add(this.speed);
    }
    
    display() {
        push();
        fill(this.color);
        translate(this.pos.x, this.pos.y);
        ellipseMode(CENTER);
        ellipse(0, 0, this.size.x, this.size.y);
        fill(0);
        rect(-10, -15, 20, 5);
        fill(255, 0, 0);
        rect(-10, -15, map(this.health, 0, this.maxHealth, 0, 20), 5);
        pop();
    }
}

