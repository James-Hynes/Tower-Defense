class Spawner extends Sprite {
    constructor(row, col, tilesize) {
        super(col * tilesize, row * tilesize, tilesize, tilesize, '#ebeb4f');
        this.queue = [];
        
        this.enemyDelay = millis();
        this.queueDelay = millis();
    }
    
    update() {
        if(this.queue.length > 0) {
           if(millis() - this.enemyDelay >= this.queue[0].delay) {
                if(this.queue[0].numEnemies <= 0) {
                    if(millis() - this.queueDelay >= this.queue[0].queueDelay) {
                        this.queue.shift();
                        this.queueDelay = millis();
                    }
                } else {
                    game.enemies.push(new Enemy(this.pos.x + (game.tilesize / 2), this.pos.y + (game.tilesize / 2), 10, 10, [29, 182, 200], 5));
                    this.queue[0].numEnemies--;
                    this.queueDelay = millis();
                }
                this.enemyDelay = millis();
            }
        } else {
            this.enemyDelay = millis(); 
            this.queueDelay = millis();
        }
    }
}

//class EnemyQueue {
//    constructor() {
//        this.
//    }
//}