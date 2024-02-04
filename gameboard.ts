import { Card } from './card';  // Assuming you have a Card class
import { Drawable } from './drawable';


export class GameBoard implements Drawable{

  private level: number;
  public mode: number; // game mode
  public myCards: Card[];
  public shuffledCards: Card[];
  public lastHover : number | null;

  //matching logic
  public cardsFlipped : number;
  public matchPair : number[] ;
  public matchCounter : number;

  //tracking mouse
  public x : number; 
  public y : number;

  public time : number = 0;

  constructor(level: number, mode: number) {
    this.level = level;
    this.mode = mode;
    this.myCards = [];
    this.shuffledCards = [];
    this.x = 0;
    this.y = 0;

    this.lastHover = null;
    this.cardsFlipped = 0;
    this.matchPair = [];
    this.matchCounter = 0;
  }

  //accessor (this is kind of unessesary)
  public getGameMode(): number{
    return this.mode;
  }
  public getGameLevel(): number{
    return this.level;
  }

  //mutators
  public levelUp(){ 
    if(this.level < 15){
      this.level = this.level + 1;
    }
  }
  public levelDown(){
    if(this.level > 1){
      this.level = this.level - 1;
    }
  }

  public lerp(start: number, end: number, index: number, currentTime: number, duration: number): number {
    const progress = Math.min(1, (currentTime - index * 10) / duration);
    //console.log("lerp : " + start + (end - start) * progress);
    return start + (end - start) * progress;
  }

// ~~~~~~~~~~~~~ MAIN DRAW FUNCTION (the manager) ~~~~~~~~~~~~~~~~~~~~~
  draw(gc: CanvasRenderingContext2D){
    
    gc.fillStyle = 'darkgrey';
    gc.fillRect(0, 0, gc.canvas.width, gc.canvas.height);

    // wannabe global variables
    const canvasWidth: number = gc.canvas.width; 
    const canvasHeight: number = gc.canvas.height;
    const numCards: number = this.level * 2;
    const cardSize: number = 80 + 10; 


    if(this.mode == 1){ //START MODE
      //console.log("TRIGGER START MODE CENTRE OUTWARDS ANIMATION");
      this.drawStartMode(gc,canvasWidth, canvasHeight,numCards,cardSize);

    }else if( this.mode == 2){ //PLAY MODE
      // console.log("TRIGGER PLAY MODE SHUFFLE ANIMATION");
      this.drawPlayMode(gc,canvasWidth, canvasHeight,numCards,cardSize);
    }else if( this.mode == 3){ //WIN MODE
      console.log("TRIGGER WIN MODE JIGGLE ANIMATION");
      this.drawWinMode(gc,canvasWidth, canvasHeight,numCards,cardSize);
    }else if(this.mode == 4){ // PEEK MODE ( play mode without the covering)
      this.drawPlayModePEEK(gc,canvasWidth, canvasHeight,numCards,cardSize);
    }
  }

// ~~~~~~~~~~~~~~~~~~~~~~~~~ START MODE ~~~~~~~~~~~~~~~~~~~~~

  drawStartMode(gc: CanvasRenderingContext2D,canvasWidth: number, canvasHeight: number, numCards: number, cardSize:number) {

    const cardsPerRow: number = Math.floor((canvasWidth - 100) / cardSize); 
    const remainingSquares: number = numCards % cardsPerRow; 
    const remainingRowSize: number = remainingSquares * cardSize + (remainingSquares - 1) * 10;
    const startX: number = (canvasWidth - Math.min(remainingRowSize, canvasWidth)) / 2;
    const startY: number = (canvasHeight - Math.ceil(numCards / cardsPerRow) * cardSize + (Math.ceil(numCards / cardsPerRow) - 1) * 10) / 2;

    if(this.time == 0){
      this.time = Date.now(); // set this once (reset later)
    }
    
    //console.log("start: " + this.time + "current time " +  Date.now());
    const animationDuration = 500;  // Duration of the animation in milliseconds

    //card start animation
    const centerX = canvasWidth/2 - 45; // adjust for center
    const centerY = canvasHeight/2 - 45;
    //console.log(centerX+" , "+ centerY);
    
// *****************  draws the squares from myCards array ***************** //
    for (let i = 0; i < numCards; i++) {

        const row: number = Math.floor(i / cardsPerRow);
        const col: number = i % cardsPerRow;

        if (row === Math.floor((numCards - remainingSquares) / cardsPerRow)) {
            // Center the squares in the remaining row
            this.x = startX + col * (cardSize + 10);
        } else {
            // Center the squares in the non-remaining rows
            const nonRemainingRowSize: number = cardsPerRow * cardSize + (cardsPerRow - 1) * 10;
            const rowStartX: number = (canvasWidth - nonRemainingRowSize) / 2;
            this.x = rowStartX + col * (cardSize + 10);
        }
        this.y = startY + row * (cardSize + 10); // Adjusted for the 10px gap?
        
        // draw the text!
      if (i == 0){ 
        gc.font = '24px sans-serif';
        gc.fillStyle = 'white';
        const text = this.level === 1 ? '1 pair: Press SPACE to play' : `${this.level} pairs: Press SPACE to play`;
        const textWidth = gc.measureText(text).width;
        const tempX = (gc.canvas.width - textWidth) / 2;
        gc.fillText(text, tempX, this.y - 30);
      }

      // Calculate the progress of the animation (0 to 1)
      const progress = Math.min(1, (Date.now() - this.time) / animationDuration);

      // Calculate the current position
      const currentX = centerX + (this.x - centerX) * progress;
      const currentY = centerY + (this.y - centerY) * progress;

      //get card to draw itself!
        
      this.myCards[i].drawCardStartMode(currentX , currentY , gc); 

    }
  }

// ~~~~~~~~~~~~~~~~~~~~~~~~~ PLAY AND PEAK MODE ~~~~~~~~~~~~~~~~~~~~~

  drawPlayMode(gc: CanvasRenderingContext2D,canvasWidth: number, canvasHeight: number, numCards: number, cardSize:number){

    // How many cards can fit in one line
    const cardsPerRow: number = Math.floor((canvasWidth - 100) / cardSize);

    const remainingSquares: number = numCards % cardsPerRow;
    const remainingRowSize: number = remainingSquares * cardSize + (remainingSquares - 1) * 10;

    const startX: number = (canvasWidth - Math.min(remainingRowSize, canvasWidth)) / 2;
    const startY: number = (canvasHeight - Math.ceil(numCards / cardsPerRow) * cardSize + (Math.ceil(numCards / cardsPerRow) - 1) * 10) / 2;

    

// *****************  This loop draws the squares ***************** //
    for (let i = 0; i < numCards; i++) {

        const row: number = Math.floor(i / cardsPerRow);
        const col: number = i % cardsPerRow;

        if (row === Math.floor((numCards - remainingSquares) / cardsPerRow)) {
            // Center the squares in the remaining row
            this.x = startX + col * (cardSize + 10);
        } else {
            // Center the squares in the non-remaining rows
            const nonRemainingRowSize: number = cardsPerRow * cardSize + (cardsPerRow - 1) * 10;
            const rowStartX: number = (canvasWidth - nonRemainingRowSize) / 2;
            this.x = rowStartX + col * (cardSize + 10);
        }
        this.y = startY + row * (cardSize + 10); // Adjusted for the 10px gap

        this.shuffledCards[i].drawCardPlayMode(this.x, this.y, gc);
    }

  }//end of draw play mode

  drawPlayModePEEK(gc: CanvasRenderingContext2D,canvasWidth: number, canvasHeight: number, numCards: number, cardSize:number){

    const cardsPerRow: number = Math.floor((canvasWidth - 100) / cardSize);
    const remainingSquares: number = numCards % cardsPerRow;
    const remainingRowSize: number = remainingSquares * cardSize + (remainingSquares - 1) * 10;

    const startX: number = (canvasWidth - Math.min(remainingRowSize, canvasWidth)) / 2;
    const startY: number = (canvasHeight - Math.ceil(numCards / cardsPerRow) * cardSize + (Math.ceil(numCards / cardsPerRow) - 1) * 10) / 2;

// *****************  This loop draws the squares ***************** //
    for (let i = 0; i < numCards; i++) {
        const row: number = Math.floor(i / cardsPerRow);
        const col: number = i % cardsPerRow;

        if (row === Math.floor((numCards - remainingSquares) / cardsPerRow)) {
            // Center the squares in the remaining row
            this.x = startX + col * (cardSize + 10);
        } else {
            // Center the squares in the non-remaining rows
            const nonRemainingRowSize: number = cardsPerRow * cardSize + (cardsPerRow - 1) * 10;
            const rowStartX: number = (canvasWidth - nonRemainingRowSize) / 2;
            this.x = rowStartX + col * (cardSize + 10);
        }

        this.y = startY + row * (cardSize + 10); // Adjusted for the 10px gap
        this.shuffledCards[i].drawCardPeekMode(this.x, this.y, gc);
    }
  }//end of peek

  // ~~~~~~~~~~~~~~~~~~~~~~~~~ WIN MODE ~~~~~~~~~~~~~~~~~~~~~

  drawWinMode(gc: CanvasRenderingContext2D,canvasWidth: number, canvasHeight: number, numCards: number, cardSize:number){
    //draw jiggling cards!'const cardsPerRow: number = Math.floor((canvasWidth - 100) / cardSize);
   
    const cardsPerRow: number = Math.floor((canvasWidth - 100) / cardSize);
    const remainingSquares: number = numCards % cardsPerRow;
    const remainingRowSize: number = remainingSquares * cardSize + (remainingSquares - 1) * 10;

    const startX: number = (canvasWidth - Math.min(remainingRowSize, canvasWidth)) / 2;
    const startY: number = (canvasHeight - Math.ceil(numCards / cardsPerRow) * cardSize + (Math.ceil(numCards / cardsPerRow) - 1) * 10) / 2;

    //animation specs
    const frequency = 0.007;  // Adjust this value to control the speed of the jiggle
    const amplitude = 10;     // Adjust this value to control the height of the jiggle
    const currentTime = Date.now(); // Get the current time

// *****************  This loop draws the squares ***************** //
    for (let i = 0; i < numCards; i++) {

      
        const row: number = Math.floor(i / cardsPerRow);
        const col: number = i % cardsPerRow;

        if (row === Math.floor((numCards - remainingSquares) / cardsPerRow)) {
            // Center the squares in the remaining row
            this.x = startX + col * (cardSize + 10);
        } else {
            // Center the squares in the non-remaining rows
            const nonRemainingRowSize: number = cardsPerRow * cardSize + (cardsPerRow - 1) * 10;
            const rowStartX: number = (canvasWidth - nonRemainingRowSize) / 2;
            this.x = rowStartX + col * (cardSize + 10);
        }

        this.y = startY + row * (cardSize + 10); // Adjusted for the 10px gap

        // draw the text if first iteration
        if (i == 0){ 
          gc.font = '24px sans-serif';
          gc.fillStyle = 'white';
          const text = "you finished! press SPACE to continue";
          const textWidth = gc.measureText(text).width;
          const tempX = (gc.canvas.width - textWidth) / 2;
          gc.fillText(text, tempX, this.y - 50);
        }

        // Apply sine function to the y coordinate for continuous jiggle
        this.y = startY + row * (cardSize + 10) + amplitude * Math.sin(frequency * (currentTime - i * 50));
        this.shuffledCards[i].drawCardWinMode(this.x, this.y, gc);
    }

  }

} //end of game board 
