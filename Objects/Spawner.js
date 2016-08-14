class Spawner extends Sprite {
    constructor(row, col, tilesize) {
        super(col * tilesize, row * tilesize, tilesize, tilesize, '#ebeb4f');
        this.queue = [];
    }
}