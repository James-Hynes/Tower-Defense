class Tower extends Sprite {
    constructor(row, col, tilesize) {
        super(col * tilesize, row * tilesize, tilesize, tilesize, '#9c30bc');
        
        this.row = row;
        this.col = col;
        this.tilesize = tilesize;
        
        this.damage = 1;
        this.fireRate = 300;
        
        this.frames = millis();
        this.range = 200;
        
        this.tilesInRange = this.getTilesInRange();
        
        game.lasers.push(new Laser(this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2), 0, 0));
        this.laser = game.lasers[game.lasers.length - 1];
        
    }
    
    display() {
        push();
        fill(this.color);
        translate(this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2));
        noStroke();
        ellipse(0, 0, this.size.x, this.size.y);
        pop();
    }
    
    getTilesInRange() {
        let numTilesPerDirection = Math.ceil(((this.range - (this.tilesize / 2)) / this.tilesize) / 2);
        console.log(numTilesPerDirection);
        let tiles = [];
        for(let row = Math.max(0, this.row - numTilesPerDirection ); row < Math.min(game.map.height, this.row + numTilesPerDirection + 1); row++) {
            for(let col = Math.max(0, this.col - numTilesPerDirection ); col < Math.min(game.map.width, this.col + numTilesPerDirection + 1); col++) {
                if(!(row === this.row && col === this.col)) {
                    tiles.push([row, col].toString());
                }
            }
        }
        return tiles;
    }
    
    getClosestEnemy() {
        let closest = Number.POSITIVE_INFINITY;
        let enemy = game.enemies.filter((e) => {
            if(this.tilesInRange.indexOf(e.findGridPos().toString()) !== -1) {
                let dist = e.findDistanceFromDestination();
                if(closest > dist) {
                    if((Math.hypot(this.pos.x + (this.size.x / 2) - e.pos.x + (e.size.x / 2), (this.pos.y + (this.size.y / 2) - e.pos.y + (e.size.y / 2))) <= ( (this.range / 2)  + (e.size.x / 2) ))) {
                        closest = dist;
                        return true;
                    }
                }
                return false;  
            }
        }, this);
        if(enemy.length > 0) {
            return enemy[0];
        }
        return undefined;
    }
    
    update() {
        let enemy = this.getClosestEnemy();
        if(enemy) {
            enemy.getHit((this.damage / this.fireRate) * 60);
            this.laser.destinationPoint.x = enemy.pos.x;         
            this.laser.destinationPoint.y = enemy.pos.y;
        } else {
            this.laser.destinationPoint.x = this.laser.pos.x;            
            this.laser.destinationPoint.y = this.laser.pos.y;
        }
    }
}