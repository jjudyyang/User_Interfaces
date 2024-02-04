import { Drawable } from "./drawable"

/*
1: 5 points 
2: 7 points
3: 6 points
4: 10 points
5: 4 points
*/

export class Star implements Drawable{
    constructor(public x: number, public y: number,public starNumber: number) {}

    draw(gc: CanvasRenderingContext2D) {
        gc.save();
        gc.translate(this.x, this.y); 
        gc.scale(0.8, 0.8);

        //this line makes it not work for some reason
        gc.strokeStyle = "#000000"; // star outline
        gc.lineWidth = 2;

        let points: number = 0;
        
        if(this.starNumber == 5) { //5 point star
            gc.fillStyle = "#fcff06";
            points = 5;
        }else if(this.starNumber == 6) {
            gc.fillStyle = "#fcff06";  
            points = 7;
        }
        else if(this.starNumber == 7) {
            gc.fillStyle = "#fe8c00"; 
            points = 6;
        }
        else if(this.starNumber == 8) {
            gc.fillStyle = "#f1ba16";
            points = 10; 
        }
        else if(this.starNumber == 9) {
            gc.fillStyle = "#ece695";
            points = 4;
        }

        //draw the star based on how many points
        gc.beginPath();

        for (let i = 0; i < points * 2; i++) {

            let radius: number = 0;
                if (i % 2 === 0) {
                    radius = 40;
                } else {
                    radius = 10;
                }
            const angle = (i * Math.PI) / points;
            const x = radius * Math.sin(angle);
            const y = radius * Math.cos(angle);
            gc.lineTo(x, y);

        }
        
        gc.closePath();
        gc.fill();
        gc.stroke();
        gc.restore();

    } 

}

