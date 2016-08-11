class Tile {
    constructor(row, col, tilesize, occupier) {
        this.gridPos = [row, col];
        this.row = row;
        this.col = col;
        this.tilesize = tilesize;
        
        this.occupiers = [];
        this.occupied = false;
        
        if(occupier !== undefined) {
            this.addOccupier(occupier);
        }
    }
    
    addOccupier(t) {
        switch(t) {
            case 'destination':
                this.occupiers.push(new Destination(this.row, this.col, this.tilesize));
                break;
            case 'wall':
                this.occupiers.push(new Wall(this.row, this.col, this.tilesize));
                break;
            case 'tower':
                this.occupiers.push(new Tower(this.row, this.col, this.tilesize));
                break;
            case 'spawner':
                this.occupiers.push(new Spawner(this.row, this.col, this.tilesize));
                break;
        }
        this.occupied = true;
    }
    
    removeOccupier(occupier) {
        this.occupiers.splice(this.occupiers.indexOf(occupier), 1);
        
        if(this.occupiers.length === 0) {
            this.occupied = false;
        }
    }
    
    clearOccupiers() {
        this.occupiers = [];
        this.occupied = false;
    }
    
    getDistanceFromCorner() {
        return ((this.col > (game.map.width / 2)) ? game.map.width - this.col : this.col) + ((this.row > (game.map.height / 2)) ? game.map.height - this.row : this.row);
    }
    
    getDistanceFromTile(row, col) {
        // skip sqrt
        return (((col - this.col) * (col - this.col)) + ((row - this.row) * (row - this.row)));
    }
    
    display() {
        this.occupiers.forEach((o) => o.display());
    }
    
    update() {
        this.occupiers.forEach((o) => o.update());
    }
}