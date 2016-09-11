class Game {
    constructor(w, h, tilesize) {
        this.tilesize = tilesize;
        this.map = new Map(w, h, tilesize);
        this.debug = false;
        this.enemies = [];
        this.lasers = [];
        
        this.wave = 0;
        this.money = 0;
        this.lives = 100;
        
        createCanvas(windowWidth, windowHeight);
        
//        this.start();
    }
    
    display() {
        if(this.wave > 0) {
            START_BLOCK('Draw Map');
            this.map.display();
            END_BLOCK('Draw Map');
            START_BLOCK('Draw Enemies');
            this.enemies.forEach((e) => e.display() );
            END_BLOCK('Draw Enemies');
            START_BLOCK('Draw Lasers');
            this.lasers.forEach((b) => b.display() );
            END_BLOCK('Draw Lasers'); 
            this.drawLevelInfo();
        }
    }
    
    drawLevelInfo() {
        let r = (this.map.width * this.tilesize),
            b = (this.map.height * this.tilesize);
        
        push();
        textAlign(CENTER);
        textSize(15);
        textFont(fonts['ken_space']);
        strokeWeight(3);
        fill(0);
        
        // text(`Wave - ${this.wave}`, ((windowWidth - r) / 2) + r, 35);
        // text(`Money - ${this.money}`, ((windowWidth - r) / 2) + r, 70);
        // text(`Lives - ${this.lives}`, ((windowWidth - r) / 2) + r, 105);
        
        pop();
    }

    checkEndWave() {
        if(this.enemies.length > 0) {
            return false;
        }
        let spawners = this.map.getAllSpawners();

        for(let spawner of Object.keys(spawners)) {
            if(spawners[spawner].queue.length > 0) {
                return false;
            }
        }

        return true;
    }
    
    update() {
        if(this.wave > 0) {
            START_BLOCK('Enemy Logic');
            this.enemies.forEach((e) => e.update() );
            if(this.checkEndWave()) {this.nextWave();}
            END_BLOCK('Enemy Logic');
            START_BLOCK('Debug Handling');
            debugUpdate();
            END_BLOCK('Debug Handling'); 
        }
    }

    start(w, h, t) {
        if(w) this.map.width = w;
        if(h) this.map.height = h;
        if(t) { this.map.tilesize = t; this.tilesize = t; }
        this.map.generateNewLevel();
        this.nextWave();
    }
    
    removeEnemy(e) {
        this.enemies.splice(this.enemies.indexOf(e), 1);
    }
    
    addMoney(amt) {
        this.money += amt;
    }

    nextWave() {
        this.wave++;
        let spawners = game.map.getAllSpawners();
        let numSpawners = Object.keys(spawners).length;
        for(let i = 0; i < (Math.floor(((this.wave) * 5) / numSpawners)); i++) {
            for(let spawn in spawners) {
                spawners[spawn].queue.push({numEnemies: 1, delay: Math.floor(random(400, 600)), queueDelay: 1000});
            }
        }
        
    }
}