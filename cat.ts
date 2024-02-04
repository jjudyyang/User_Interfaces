import { Drawable } from "./drawable";

/*
yellow cat
orange cat (side eye left)
blue cat (side eye right)
teal cat
grey cat
*/

export class Cat implements Drawable {
    constructor(public x: number, public y: number,public colourNumber: number) {
    }

    draw(gc: CanvasRenderingContext2D) {
        gc.save();
        gc.translate(this.x, this.y);
        gc.scale(0.75, 0.75);

        if (this.colourNumber == 0) {
            gc.fillStyle = "#5b7c59";
            gc.strokeStyle = "#5b7c59";
            gc.lineWidth = 8;
        }
        else if(this.colourNumber == 1) { //orange cat
            gc.fillStyle = "#f4b548";
            gc.strokeStyle = "#f4b548";
            gc.lineWidth = 8;
        }
        else if(this.colourNumber == 2) { //grey cat
            gc.fillStyle = "#bb9778";
            gc.strokeStyle = "#bb9778";
            gc.lineWidth = 8;
        }
        else if(this.colourNumber == 3) { //black cat
            gc.fillStyle = "#1f1728";
            gc.strokeStyle = "#1f1728";
            gc.lineWidth = 8;
        }
        else if(this.colourNumber == 4) { //purple blue cat
            gc.fillStyle = "#aeb6e2";
            gc.strokeStyle = "#aeb6e2";
            gc.lineWidth = 8;
        }
        
        // head white outline
        gc.beginPath();
        gc.arc(0, 0, 40, 0, 2 * Math.PI);
        gc.stroke();
    
        // ears
        gc.beginPath();
        // left
        gc.moveTo(-40, -48);
        gc.lineTo(-8, -36);
        gc.lineTo(-35, -14);
        gc.closePath();
        // right
        gc.moveTo(40, -48);
        gc.lineTo(8, -36);
        gc.lineTo(35, -14);
        gc.closePath();
        gc.stroke();
        gc.fill();
    
        // head
        gc.beginPath();
        gc.arc(0, 0, 40, 0, 2 * Math.PI);
        gc.fill();
    
        // whites of eyes
        gc.strokeStyle = "black";
        gc.fillStyle = "white";
        gc.lineWidth = 1;
        gc.beginPath();
        // left
        gc.ellipse(-16, -9, 8, 14, 0, 0, Math.PI * 2);
        gc.fill();
        gc.stroke();
        // right
        gc.beginPath();
        gc.ellipse(16, -9, 8, 14, 0, 0, Math.PI * 2);
        gc.fill();
        gc.stroke();

        // need to change depending on cat 

        if(this.colourNumber == 2) {
            // eyeballs go left (minus 4)
            gc.fillStyle = "black";
            gc.beginPath();
            // left
            gc.arc(-20, -9, 5, 0, Math.PI * 2);
            gc.fill();
            // right
            gc.beginPath();
            gc.arc(12, -9, 5, 0, Math.PI * 2);
            gc.fill();
        }
        else if(this.colourNumber == 3) {
            //eyeballs go right (add 4)
            gc.fillStyle = "black";
            gc.beginPath();
            // left
            gc.arc(-12, -9, 5, 0, Math.PI * 2);
            gc.fill();
            // right
            gc.beginPath();
            gc.arc(20, -9, 5, 0, Math.PI * 2);
            gc.fill();
        }
        else{
            // eyeballs
            gc.fillStyle = "black";
            gc.beginPath();
            // left
            gc.arc(-16, -9, 5, 0, Math.PI * 2);
            gc.fill();
            // right
            gc.beginPath();
            gc.arc(16, -9, 5, 0, Math.PI * 2);
            gc.fill();
        }  
        
        gc.restore();
      }
}