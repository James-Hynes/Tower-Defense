class Wall extends Sprite {
    constructor(row, col, tilesize) {
        super(col * tilesize, row * tilesize, tilesize, tilesize, '#868679');
    }
}