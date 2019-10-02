class Laser {
    constructor(x, y) {
        this.color = '#e01131';
        this.pos = createVector(x, y);
        this.destinationPoint = createVector(x, y);
    }
    
    display() {
        push();
        strokeWeight(3);
        stroke(this.color);
        line(this.pos.x, this.pos.y, this.destinationPoint.x, this.destinationPoint.y);
        pop();
    }
}
