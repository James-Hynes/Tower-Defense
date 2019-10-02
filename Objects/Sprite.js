class Sprite {
    constructor(x, y, w, h, c) {
        this.pos = createVector(x, y);
        this.size = createVector(w, h);
        
        this.color = c;
        
        this.speed = createVector(0, 0);
    }
    
    update() {
        this.pos.add(this.speed);
    }
    
    display() {
        push();
        fill(this.color);
        translate(this.pos.x, this.pos.y);
        rect(0, 0, this.size.x, this.size.y);
        pop();
    }
}