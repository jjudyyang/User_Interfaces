import {Drawable} from "./drawable";

export class Yellowhover implements Drawable {
    constructor(public x: number, public y: number) {}
    setPosition(x: number, y: number){
    this.x = x;
    this.y = y;
    }
    draw(gc: CanvasRenderingContext2D) {
        if(this.x != 0 && this.y != 0){
            this.setPosition(this.x, this.y);
            gc.lineWidth = 6;
            gc.strokeStyle = "yellow";
            gc.strokeRect(this.x-3 , this.y-3 , 96, 96);
        }
    } 
}