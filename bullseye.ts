import { Drawable } from "./drawable";

/* do in terms of how many circles (stroke outline has color)
1 - 3 circles
2 - 4 circles
3 - 5 circles
4 - 4 circles
5 - 3 circles
*/

export class Bullseye implements Drawable {

    constructor(public x: number, public y: number, public bullsEyeNumber: number) {
    }

    draw(gc: CanvasRenderingContext2D){
        gc.save();
        gc.translate(this.x, this.y);
        gc.scale(0.9, 0.9);
        
        if (this.bullsEyeNumber ==10) {
            gc.fillStyle = "#f19215"; 
            gc.strokeStyle = "#000000";
            gc.lineWidth = 2;
            gc.beginPath();
            gc.arc(0, 0, 40, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 28, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#ebcc99";
            gc.beginPath();
            gc.arc(0, 0, 23, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 13, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#000100";
            gc.beginPath();
            gc.arc(0, 0, 8, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();
        }
        else if(this.bullsEyeNumber == 11) {
            gc.fillStyle = "#d9bb41";
            gc.strokeStyle = "#000000";
            gc.lineWidth = 2;
            gc.beginPath();
            gc.arc(0, 0, 40, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 28, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#7fc1e2";
            gc.beginPath();
            gc.arc(0, 0, 23, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 13, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#000100";
            gc.beginPath();
            gc.arc(0, 0, 8, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

        }
        else if(this.bullsEyeNumber == 12) { //blue evil eye
            gc.fillStyle = "#3128c7"; //blue
            gc.strokeStyle = "#000000";
            gc.lineWidth = 2;
            gc.beginPath();
            gc.arc(0, 0, 40, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 28, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#7fc1e2";
            gc.beginPath();
            gc.arc(0, 0, 23, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 13, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#000100";
            gc.beginPath();
            gc.arc(0, 0, 8, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();
        }
        else if(this.bullsEyeNumber == 13) { 
            gc.fillStyle = "#79d153"; //green
            gc.strokeStyle = "#000000";
            gc.lineWidth = 2;
            gc.beginPath();
            gc.arc(0, 0, 40, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 28, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#c8e6b8";
            gc.beginPath();
            gc.arc(0, 0, 23, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 13, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#000100";
            gc.beginPath();
            gc.arc(0, 0, 8, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();
        }
        else if(this.bullsEyeNumber == 14) { 
            gc.fillStyle = "#7e4fd8"; //purple
            gc.strokeStyle = "#000000";
            gc.lineWidth = 2;
            gc.beginPath();
            gc.arc(0, 0, 40, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 28, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#c3adef";
            gc.beginPath();
            gc.arc(0, 0, 23, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#f3f6ea";
            gc.beginPath();
            gc.arc(0, 0, 13, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();

            gc.fillStyle = "#000100";
            gc.beginPath();
            gc.arc(0, 0, 8, 0, 2 * Math.PI);
            gc.stroke();
            gc.fill();
        }

        gc.restore();

    }

}