class Game {
    constructor(w, h, tilesize) {
        this.tilesize = tilesize;
        this.map = new Map(w, h, tilesize);
        this.debug = false;
        this.enemies = [];
        this.lasers = [];
        
        this.wave = -1;
        this.money = 0;
        this.lives = 100;
        
        this.introTextDisplayInfo = {ypos: 0, maxy: 125, rot: 0, dir: ((TWO_PI * 2) - (QUARTER_PI / 4) * ((Math.random() < 0.5) ? 1 : -1))};
        createCanvas(windowWidth, windowHeight);
    }
    
    display() {
        if(this.wave >= 0) {
            START_BLOCK('Draw Map');
            this.map.display();
            END_BLOCK('Draw Map');
            START_BLOCK('Draw Enemies');
            this.enemies.forEach((e) => e.display() );
            END_BLOCK('Draw Enemies');
            START_BLOCK('Draw Lasers');
            this.lasers.forEach((b) => b.display() );
            END_BLOCK('Draw Lasers'); 
        } else {
            this.drawIntroText();
        }
    }
    
    drawIntroText() {
        push();
        textSize(50);
        textFont(fonts['ken_bold']);
        textAlign(CENTER);
        this.introTextDisplayInfo['ypos'] = lerp(this.introTextDisplayInfo['ypos'], this.introTextDisplayInfo['maxy'], 0.05);
        this.introTextDisplayInfo['rot'] = lerp(this.introTextDisplayInfo['rot'], this.introTextDisplayInfo['dir'], 0.03);
        translate(windowWidth / 2, this.introTextDisplayInfo['ypos']);
        rotate(this.introTextDisplayInfo['rot']);
        text('TOWER DEFENSE', 0, 0);
        if(this.introTextDisplayInfo['maxy'] - this.introTextDisplayInfo['ypos'] <= 0.03) {
            textSize(23);
            text('Proof of Concept', 0, 40);
        }
        pop();
    }
    
    update() {
        if(this.wave >= 0) {
            START_BLOCK('Enemy Logic');
            this.enemies.forEach((e) => e.update() );
            END_BLOCK('Enemy Logic');
            START_BLOCK('Debug Handling');
            debugUpdate();
            END_BLOCK('Debug Handling'); 
        }
        
    }
    
    start() {
        this.map.generateNewLevel();
        this.wave = 1;
    }
    
    removeEnemy(e) {
        this.enemies.splice(this.enemies.indexOf(e), 1);
    }
}