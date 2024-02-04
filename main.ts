import {
  SKEvent,
  SKKeyboardEvent,
  SKMouseEvent,
  setSKDrawCallback,
  setSKEventListener,
  startSimpleKit,
} from "simplekit/canvas-mode"; // taken from lecture

//note: levels are exact!
//game images are 0 - 14 - because of array manipulation

//local imports
import { GameBoard } from "./gameboard";
import { Card } from "./card";

function insideHitTestRectangle( //CHANGE
  mouseX: number,
  mouseY: number,
  cardX: number,
  cardY: number,
  width: number,
  height: number
) {
  return (mouseX >= cardX) && (mouseX <= cardX + width) && (mouseY >= cardY) && (mouseY <= cardY + height);
}

//starting level and starting mode
let myLevel: number = 1;
let gameMode: number = 1;

//generate cards function
function createCards( gameBoard: GameBoard ) {
  let pairs : number = gameBoard.getGameLevel();

  gameBoard.myCards.splice(0, gameBoard.myCards.length); // delete old game board cards if they exist

  
  const tempRandomArray: number[] = []; //random array
  let randomNum;
  for (let i = 0; i < pairs; i++){ 
    do{
      randomNum = Math.floor(Math.random() * 15); //gets rid of duplicates
    }while (tempRandomArray.includes(randomNum));
    tempRandomArray.push(randomNum);
  } 

  for(let j = 0 ; j < pairs ; j++){ //add to game board cards 
    const card1 = new Card(80 , 80, tempRandomArray[j]);
    const card2 = new Card(80 , 80, tempRandomArray[j]);
    gameBoard.myCards.push(card1);
    gameBoard.myCards.push(card2); //NEED TO ADD SEPERATLY!
  }
}



function shuffleCards( gameBoard: GameBoard ){

  gameBoard.shuffledCards.splice(0, gameBoard.shuffledCards.length); //delete old game board cards if they exist 
  const cards = gameBoard.myCards.slice(0, gameBoard.getGameLevel() * 2); // extract cards from myCards 

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  //deep copy myCards array and its coordinates to shuffleCards
  for (let i = 0; i < cards.length; i++) {
    const copiedCard = Card.copyFrom(gameBoard.myCards[i]); 
    gameBoard.shuffledCards[i] = copiedCard;
  }

  //MODIFY myCards array to have the ORGINAL coordinates of cards ( since it regnerates anyways)
  

  for (let i = 0; i < cards.length; i++) {
    //swaps index in shuffle cards
    gameBoard.shuffledCards[i].index = cards[i].index; 
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ CREATE GAME BOARD + CARDS! ~~~~~~~~~~~~~~~~~~~~~

const gameBoard = new GameBoard(myLevel, gameMode); //new game board starts at level 1
console.log("board created!");

createCards(gameBoard);
console.log("cards created!");


function printCards( gameBoard : GameBoard){
  console.log("----SHUFFLED---- ");

  for(let i = 0; i < gameBoard.getGameLevel() * 2 ;i++){
    console.log( i +
    " img: "+ gameBoard.shuffledCards[i].index +
    " coord: (" + gameBoard.shuffledCards[i].x +
    ", " + gameBoard.shuffledCards[i].y + (")"
    + " " + gameBoard.shuffledCards[i].isHovered 
    + " " + gameBoard.shuffledCards[i].isFlipped
    + " " + gameBoard.shuffledCards[i].isMatched
    )
    )
  }

  console.log("----my cards array---- ");
  for(let i = 0; i < gameBoard.getGameLevel() * 2 ;i++){
    console.log( i +
    " img: "+ gameBoard.myCards[i].index +
    " coord: (" + gameBoard.myCards[i].x +
    ", " + gameBoard.myCards[i].y + (")"
    + " " + gameBoard.myCards[i].isHovered 
    + " " + gameBoard.myCards[i].isFlipped
    + " " + gameBoard.myCards[i].isMatched
    )
    )
  }
  console.log("------------- ");
}

// ~~~~~~~~~~~~~ get card from coordinates ~~~~~~~~~~~~~~~~~~~~~
function getCard(mouseX: number, mouseY: number, gameBoard: GameBoard): number {
  for (let i = 0; i < gameBoard.getGameLevel() * 2; i++) {
    // Check if gameBoard.shuffledCards[i] is defined
    if (gameBoard.shuffledCards[i]) {
      const x = gameBoard.shuffledCards[i].x; // coordinate of that card
      const y = gameBoard.shuffledCards[i].y;

      // Check if x and y are defined before comparing
      if (
        x !== undefined &&
        y !== undefined &&
        mouseX >= x &&
        mouseX <= x + 90 &&
        mouseY >= y &&
        mouseY <= y + 90
      ) {
        return i; // index of the card in deck
      }
    }
  }
  return -1;
}

// ~~~~~~~~~~~~~ event handler - aka COMMAND INTERPRETER ~~~~~~~~~~~~~~~~~~~~~
let gestureStartX: number = 0;
let gestureStartY : number = 0;

function handleEvent(e: SKEvent){
  let pressTimer: any; 
  

  switch (e.type){
    case "mousedown":
      //console.log("mousedo");
      if(e instanceof SKMouseEvent){
        gestureStartX = e.x;
        gestureStartY = e.y;
        //console.log(gestureStartX + " , " + gestureStartY );
      }
    break;

    case "mouseup":
      //console.log("mousedup");
      if(e instanceof SKMouseEvent){
        //console.log(e.x + " , " + e.y );
        //console.log(gestureStartX + " , " + gestureStartY );

        if(gestureStartY - e.y > 50  && Math.abs(gestureStartX - e.x) < 10) { //vertial drag
          //console.log("vertical");
          for( let i = 0; i < gameBoard.shuffledCards.length; i++){
            const dx = gameBoard.shuffledCards[i].x;
            const dy = gameBoard.shuffledCards[i].y;
            
            if (insideHitTestRectangle(e.x, e.y, dx, dy, 90, 90)) {
    
              let currentCard = getCard(e.x, e.y, gameBoard);
              //peek the current card
              //console.log("peek this one: " + currentCard );
              gameBoard.shuffledCards[currentCard].isPeek = true;

              // Set a timeout to hide the peeked card after 500ms
              setTimeout(() => {
                gameBoard.shuffledCards[currentCard].isPeek = false;
              }, 500);
            }

          }

        }

      }

    break;

    case "mousemove":
    const { x: mouseX, y: mouseY } = e as SKMouseEvent;

    let isMouseOverCard = false; // Flag to track if the mouse is over any card

    for (let i = 0; i < gameBoard.myCards.length; i++) {
        const dx = gameBoard.myCards[i].x;
        const dy = gameBoard.myCards[i].y;

        if (insideHitTestRectangle(mouseX, mouseY, dx, dy, 90, 90)) {
            let currentCard = getCard(mouseX, mouseY, gameBoard);

            if (gameBoard.lastHover !== currentCard) {
                // Unhover the last card if it exists
                if (gameBoard.lastHover !== null) {
                    gameBoard.shuffledCards[gameBoard.lastHover].isHovered = false;
                }

                if (currentCard > -1) {
                    gameBoard.lastHover = currentCard;
                    gameBoard.shuffledCards[currentCard].isHovered = true;
                    isMouseOverCard = true;
                }
            } else {
                // If the mouse is within the hit square, maintain hover state
                isMouseOverCard = true;
            }
        }
    }

    // Unhover the last card if the mouse is not over any card
    if (!isMouseOverCard && gameBoard.lastHover !== null) {
        gameBoard.shuffledCards[gameBoard.lastHover].isHovered = false;
        gameBoard.lastHover = null;
    }

    break; // break mouse move

    case "click":
      const { x:clickX, y:clickY } = e as SKMouseEvent;
        for (let i = 0; i < gameBoard.myCards.length; i++) {
          const dx = gameBoard.myCards[i].x;
          const dy = gameBoard.myCards[i].y;

            if (gameBoard.mode == 2) {
              if ( insideHitTestRectangle(clickX, clickY, dx, dy, 90, 90) ) {

                let currentCard = getCard(clickX, clickY, gameBoard);
                console.log("clicked: " + currentCard);

                //open or close card
                if(gameBoard.shuffledCards[currentCard].isFlipped == true){
                  //card open -> CARD CLOSE
                  gameBoard.shuffledCards[currentCard].isFlipped = false;
                  gameBoard.cardsFlipped = gameBoard.cardsFlipped - 1;
                  
                  // Remove CARD CLOSED from the array
                  const indexToRemove = gameBoard.matchPair.indexOf(currentCard);
                  if (indexToRemove !== -1) {
                    gameBoard.matchPair.splice(indexToRemove, 1);
                  }
                  console.log("card " + currentCard + " is closed: " + gameBoard.matchPair );
                }
                else if(gameBoard.shuffledCards[currentCard].isFlipped == false){
                  //card closed -> CARD OPEN
                  if(gameBoard.cardsFlipped < 2 && gameBoard.cardsFlipped >= 0){
                    gameBoard.shuffledCards[currentCard].isFlipped = true;
                    gameBoard.cardsFlipped = gameBoard.cardsFlipped + 1;

                    //ADD currentCard OPENed to match array
                    gameBoard.matchPair.push(currentCard);
                    
                    console.log("card " + currentCard + " is open " + gameBoard.matchPair);
                  }
                }  
                //if two cards are open, check if they are matched
                if(gameBoard.cardsFlipped == 2){
                  //console.log("check for match! RN");
                  let cardA = gameBoard.shuffledCards[gameBoard.matchPair[0]].index;
                  let cardB = gameBoard.shuffledCards[gameBoard.matchPair[1]].index;
                  console.log("a: " + cardA + " b: "  + cardB);
                  if(cardA == cardB){

                    console.log("TRIGGER 360 ANIMATION");
                    gameBoard.shuffledCards[gameBoard.matchPair[0]].isSpin = true;
                    gameBoard.shuffledCards[gameBoard.matchPair[1]].isSpin = true;
                    
                    //set the cards to matched
                    gameBoard.shuffledCards[gameBoard.matchPair[0]].isMatched = true;
                    gameBoard.shuffledCards[gameBoard.matchPair[1]].isMatched = true;

                    //set the cards to unflipped
                    gameBoard.shuffledCards[gameBoard.matchPair[0]].isFlipped = false;
                    gameBoard.shuffledCards[gameBoard.matchPair[1]].isFlipped = false;

                    //reset match pair array + card flip counter
                    gameBoard.matchPair.splice(0, 2);
                    gameBoard.cardsFlipped = 0;

                    //increment match counter
                    gameBoard.matchCounter = gameBoard.matchCounter + 1;
        
                  }else{
                    //console.log("not a match");
                  }
                  //go to WIN mode
                  if(gameBoard.matchCounter == gameBoard.getGameLevel()){
                    gameBoard.matchCounter = 0;
                    gameBoard.mode = 3;
                  }
                }
                
            }
        }

      }//end of click for loop

    break; //click
    
    case "keydown":
      if (e instanceof SKKeyboardEvent) {
        //Start Mode
        if(gameBoard.getGameMode() == 1){ 
          if(e.key == " ") { 
            gameBoard.time = 0;
            gameBoard.mode = 2;
            shuffleCards(gameBoard);
            printCards(gameBoard);
          }
          else if(e.key =="+" && gameBoard.getGameLevel() < 15 ){ // have to press shift + (levels are EXACT)
            gameBoard.time = 0;
            gameBoard.levelUp();
            createCards(gameBoard);
          }else if(e.key =="-" && gameBoard.getGameLevel() > 1){
            gameBoard.time = 0;
            gameBoard.levelDown();
            createCards(gameBoard);
          }

        }
        //Play Mode
        else if( gameBoard.getGameMode() == 2){ 
          if(e.key == "q"){
            gameBoard.mode = 1; 
            gameBoard.time = Date.now();
            gameBoard.cardsFlipped = 0; //reset the flips
            createCards(gameBoard);
            break;
          }
          if( e.key == "x"){
            pressTimer = setTimeout(() =>{ gameBoard.mode = 4; },200);}
          }
        //Win Mode
          else if( gameBoard.getGameMode() == 3){ // Win Mode
          
          if( e.key == " " ){ 
            if(gameBoard.getGameLevel() < 15){
              gameBoard.levelUp(); // if at 15 it just stays at 15
            }
            gameBoard.matchCounter = 0; //reset match counter
            gameBoard.mode = 1 ; //back to start
            createCards(gameBoard);
          }
        }
      }
      break; //keydown

      case "keyup":
        if (e instanceof SKKeyboardEvent) {
          if ( gameBoard.getGameMode() == 4){ // THIS IS PEEK MODE! (4)
            clearTimeout(pressTimer); // clear press timer?
            if(e.key =="x"){ //if x is release, go back to play mode
              gameBoard.mode = 2;
            }
          }
      }//end of keyboard event
      break; //keyup

  }
}

// set the event handler
setSKEventListener(handleEvent);

//callbackTimerDemo(); //choose a demto to run?
startSimpleKit(); //creates full page canvas

//this function literally just draws what is going on
setSKDrawCallback((gc: CanvasRenderingContext2D) => {
  gameBoard.draw(gc); // draw the game board depending on mode! (animations done in here)
});



