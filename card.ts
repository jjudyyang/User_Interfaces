import { Drawable } from "./drawable";

import { Cat } from './cat';
import { Star } from './stars';
import { Bullseye } from './bullseye';

import { Yellowhover } from './yellowhover';

/*
0 - cat 1
1 - cat 2
2 - cat 3
3 - cat 4
4 - cat 5
5 - star 1
6 - star 2
7 - star 3
8 - star 4
9 - star 5
10 - bulleye 1
11 - bulleye 2
12 - bulleye 3
13 - bulleye 4
14 - bulleye 5
*/

//map of cards ( (imageNumber, is matched) position1, position 2)

let cardSize : number = 90;

export class Card{

    //360 
    public rotationAngle = 0;

    constructor(
        public x : number,
        public y: number, 
        public index: number, //image
        public isHovered: boolean = false,  
        public isFlipped: boolean = false, 
        public isMatched: boolean = false,
        public isSpin: boolean = false,
        public isPeek: boolean = false
        ) {
        }

    static copyFrom(original: Card): Card {
        return new Card(original.x, original.y, original.index);
    }
    static destroy(): void {
        
    }

    drawCardStartMode(drawX: number, drawY: number, gc : CanvasRenderingContext2D){

        //update card coordinates
        this.x = drawX;
        this.y = drawY;

        gc.fillStyle = "#000000"; //white boarder
        gc.fillRect(drawX, drawY, cardSize, cardSize);
        gc.fillStyle = "#FFFFFF"; // blue square
        gc.fillRect(this.x+2, this.y+2, cardSize-4, cardSize-4);
        this.drawImagesOnToCard(gc);//draw image
    }

    drawCardPlayMode(drawX: number, drawY: number, gc : CanvasRenderingContext2D){
        //console.log("draw card PLAY mode ");
        //update card coordinates
        this.x = drawX;
        this.y = drawY;

        if(!this.isSpin){
            //this is blue background
            gc.fillStyle = "#000000"; // black border
            gc.fillRect(this.x, this.y, cardSize, cardSize);
            gc.fillStyle = "#FFFFFF"; // white border
            gc.fillRect(this.x + 1, this.y + 1, cardSize - 2, cardSize - 2);
            gc.fillStyle = "#a4d2e1"; // light blue
            gc.fillRect(this.x+6, this.y+6, cardSize - 12, cardSize - 12);
            //end of blue background
        }

        //flipping logic of card
        if( this.isFlipped && !this.isMatched){
            gc.fillStyle = "#000000";
            gc.fillRect(this.x, this.y, cardSize, cardSize);

            gc.fillStyle = "#FFFFFF";
            gc.fillRect(this.x+2, this.y+2, cardSize-4, cardSize-4);
            this.drawImagesOnToCard(gc); 
        }else if(!this.isFlipped
            && !this.isMatched){
            gc.fillStyle = "#000000"; // black border
            gc.fillRect(this.x, this.y, cardSize, cardSize);
            gc.fillStyle = "#FFFFFF"; // white border
            gc.fillRect(this.x + 1, this.y + 1, cardSize - 2, cardSize - 2);
            gc.fillStyle = "#a4d2e1"; // light blue
            gc.fillRect(this.x+6, this.y+6, cardSize - 12, cardSize - 12);
          }

        
         //spin 360 animation
        if(this.isSpin && this.rotationAngle < (Math.PI * 2)){
            this.rotationAngle += (Math.PI / 180) * 5; // Increment rotation angle (convert to radians)
            gc.translate(this.x + cardSize / 2, this.y + cardSize / 2); // Translate to the center of the card
            gc.rotate(this.rotationAngle); // Rotate the card
            gc.translate(-(this.x + cardSize / 2), -(this.y + cardSize / 2)); // Translate back to the original position

            // Draw the card as usual
            gc.fillStyle = "#000000"; // black border
            gc.fillRect(this.x, this.y, cardSize, cardSize);
            gc.fillStyle = "#FFFFFF"; // white border
            gc.fillRect(this.x + 2, this.y + 2, cardSize - 4, cardSize - 4);
            gc.fillStyle = "#FFFFFF"; // white border
            this.drawImagesOnToCard(gc);
            gc.fillStyle = 'rgba(128, 128, 128, 0.5)';
            gc.fillRect(this.x, this.y, cardSize, cardSize);
            // Reset transformation for other drawings
            gc.setTransform(1, 0, 0, 1, 0, 0); 
        } 
        else if(this.isMatched){ //if card is matched MUTED COLORS
            gc.fillStyle = "#000000"; // black border
            gc.fillRect(this.x, this.y, cardSize, cardSize);
            gc.fillStyle = "#FFFFFF"; // white border
            gc.fillRect(this.x+2, this.y+2, cardSize-4, cardSize-4);
            gc.fillStyle = "#FFFFFF"; // white border
            this.drawImagesOnToCard(gc);
            gc.fillStyle = 'rgba(128, 128, 128, 0.5)';
            gc.fillRect(this.x, this.y, cardSize, cardSize);
          }  
  
          //yellow hover on only face down cards
          if( this.isHovered 
            && !this.isFlipped
            && !this.isMatched){
            const hover = new Yellowhover(this.x, this.y); 
            hover.draw(gc);
          }

          //peek only on face down cards
          if( this.isPeek 
            && !this.isFlipped
            && !this.isMatched){
                
            //reveal underside of card
            gc.fillStyle = "#000000";
            gc.fillRect(this.x, this.y, cardSize, cardSize);

            gc.fillStyle = "#FFFFFF";
            gc.fillRect(this.x+2, this.y+2, cardSize-4, cardSize-4);
            //draws the image of the card
            this.drawImagesOnToCard(gc); 
          }
    }

    drawCardPeekMode(drawX: number, drawY: number, gc : CanvasRenderingContext2D){
        //console.log("draw card PEEK mode ");
        //update coordinates
        this.x = drawX;
        this.y = drawY;

        //peek
        gc.fillStyle = "#000000";
        gc.fillRect(this.x, this.y, cardSize, cardSize);

        gc.fillStyle = "#FFFFFF";
        gc.fillRect(this.x+2, this.y+2, cardSize-4, cardSize-4);
        //draws the image of the card
       this.drawImagesOnToCard(gc); 

    }

    drawCardWinMode(drawX: number, drawY: number, gc : CanvasRenderingContext2D){
        this.x = drawX;
        this.y = drawY;

        gc.fillStyle = "#000000";
        gc.fillRect(this.x, this.y, cardSize, cardSize);
        
        gc.fillStyle = "#FFFFFF";
        gc.fillRect(this.x+2, this.y+2, cardSize-4, cardSize-4);
        //draws the image of the card
        this.drawImagesOnToCard(gc); 

    }

    drawImagesOnToCard(gc : CanvasRenderingContext2D){
        //draw index (image) on card
        let newX : number = this.x + 45;
        let newY : number = this.y + 45;

        if(this.index == 0 || this.index == 1 || this.index == 2 || this.index == 3 || this.index == 4){
            const myCat = new Cat(newX, newY+5,this.index); // +5 to center the cat
            myCat.draw(gc);
          }else if(this.index == 5 || this.index == 6 || this.index == 7 || this.index == 8 || this.index == 9){
            const myStar = new Star(newX, newY,this.index);
            myStar.draw(gc);
          }
          else if(this.index == 10 || this.index == 11 || this.index == 12 || this.index == 13 || this.index == 14){
            const myCircle = new Bullseye(newX, newY, this.index);
            myCircle.draw(gc);
        }
    }
}
