import './App.css';
import React from 'react'
import { useState } from 'react'
import { Canvas,Status} from './Components'
import findBestMove from './modules/smartMove';



function App({ game }) {

  //highlightElems = [[highlightPaths],[HightlightNodes],[endangeredNodes]]
  // all of them used to direct user with suggestions
  const [highlightElems,setHighlightElems] = useState([[],[],[]]);
  const [boardStatus,setBoardStatus] = useState([{
                                                  pos : [0,4,20,24],       // tigers spawn at four corners of the board
                                                  trapStatus : [0,0,0,0]   //1 means trapped  and 0 means not trapped
                                                },
                                                {
                                                  available: Array.from(Array(20).keys()),      // 20 goats in total
                                                  onBoard  : [],
                                                  eaten    : [],                                 // 0 goats eaten/captured at the beginning
                                                  pos      :  []
                                                },-1]);                                         // turn Status (-1 signifies game not started)
  const [isOver,setIsOver] = useState(0);
  const [isDraw,setIsDraw] = useState(false);
  const [moveHistory,setMoveHistory] = useState([]);

  const [vsPlayer2,setVsPlayer2] = useState(false);
  const [vsCompGoat,setVsCompGoat] = useState(false);
  const [vsCompTiger,setVsCompTiger] = useState(false);

  const isAIturn = (turn)=>{
    if(vsPlayer2) return 0;
    if(vsCompGoat && turn===1) return 1;
    if(vsCompTiger && turn===0) return 1;
    return 0;
  }                      
  const handleClick = (pos,clicker = 1) => {  //1 means user and 0 means AI
    if(game.isOver()) return;
    if(isAIturn(game.getTurnStatus()) && clicker === 1) return;
    //array used to Highlight Nodes and Vertices later on
    let arr1 = [];
    //goats turn
    if (game.getTurnStatus() === 1){
      //first empty nodes are filled with available Goats
      if(game.hasAvailableGoats()){
        arr1 = game.updateWithGoat(pos);
      //once we run out of Goats then we start moving them like tigers
      }else{    
        //read comments of tigers turn below for better understanding            
        if (!game.isShowingSuggestions() && game.hasGoatAt(pos)) {
          arr1 = game.highlightPath(pos);        
        } else if(game.isShowingSuggestions() && game.hasGoatAt(pos)) {
            arr1 = game.wasPreviousSelection(pos) ? game.updateWithGoat(pos) : game.highlightPath(pos);  
        }else{
          arr1 = game.updateWithGoat(pos);
        }
      }
      setHighlightElems(arr1);
    //tigers turn  
    } else {
      //user clicks on a tiger to reveal positions it can move to 
      if (!game.isShowingSuggestions() && game.hasTigerAt(pos)) {
        arr1 = game.highlightPath(pos);
      }else if(game.isShowingSuggestions() && game.hasTigerAt(pos)){
        //user clicks on another tiger while suggestions for another tiger is being shown        
        if(!game.wasPreviousSelection(pos)){
          arr1 = game.highlightPath(pos);
        //clicking on the same tiger again cancels suggestions
        }else{
          arr1 = game.updateWithTiger(pos);
        }
      //user clicks where he was suggested to move the tiger
      //this block also handles condition where user clicks the unsuggested node 
      }else{   
        arr1 = game.updateWithTiger(pos);
        //highlight nodes where goats can be placed if available 
        if(game.hasAvailableGoats()){
          setTimeout((arr1) => {
            arr1 = game.highlightNodes();
            setHighlightElems(arr1);
          }, 200);
        }        
      }
      setHighlightElems(arr1);
    }

    setBoardStatus(game.getBoardStatus());
    setIsOver(game.isOver());

    
    setTimeout(()=>{
      //if AI is playing
      if(!vsPlayer2){
        if(vsCompGoat && game.getTurnStatus()){
          //finding the next best move using minMax
          let move = findBestMove(game);
          // obtained moves are in the form:
          if(!move) alert("There was an issue .. help me with a SC");
          // g-0 i.e place a goat in 0
          // g-1-2 i.e move the goat in pos-1 to pos-2
          // t-1-2 i.e move the tiger in pos-1 to pos-2
          // t-1-X-2-3 i.e jump the tiger in pos-1 to pos-3 and capture goat in pos-2
          let tempArr = move.split('-');
          //simply put the goat in the position
          if(tempArr.length === 2){
            setTimeout(()=>{
              handleClick(Number(tempArr[1]),0);
            },200);
          }else{
            //move goat from one position to another
            
            //first highlight the possible position
            setTimeout(()=>{
              handleClick(Number(tempArr[1]),0);
            },200);
            //then move the goat afterwards
            setTimeout(()=>{
              handleClick(Number(tempArr[tempArr.length-1]),0);
            },400);
          }
        }
        if(vsCompTiger && !game.getTurnStatus()){
          let move = findBestMove(game);
          if(!move) alert("There was an issue.. help me with a SC ");
          let tempArr = move.split('-');
          //move tiger from one position to another
          setTimeout(()=>{
            handleClick(Number(tempArr[1]),0);
          },200);
          setTimeout(()=>{
            handleClick(Number(tempArr[tempArr.length-1]),0);
          },400);
        }
      }
    },215);
    setMoveHistory(game.getMoveHistory());
    if(!game.isOver() && game.checkRepetition()){
      setIsDraw(true);
    }
  }
  
  const handleNewGame = () => {

    setHighlightElems([[],[],[]]);
    setMoveHistory([]);
    setIsOver(false);
    setIsDraw(false);
    setHighlightElems(game.startGame());
    setBoardStatus(game.getBoardStatus());
    if(vsCompGoat){
      setTimeout(()=>{
          let move = findBestMove(game);
          var
          tempArr =  move.split('-');
          handleClick(Number(tempArr[tempArr.length - 1]),0);
      },200);
    }

  }

  const setMode = (modeArr) =>{
    setVsPlayer2(modeArr[0]);
    setVsCompTiger(modeArr[1]);
    setVsCompGoat(modeArr[2]);
  }

  return (
    <div className="baghchal-app">
      <Canvas
        handleClick={handleClick} 
        statusArr = {boardStatus} 
        isOver = {isOver} 
        setIsOver = {setIsOver} 
        handleNewGame = {handleNewGame} 
        highlightElems = {highlightElems} 
        isDraw = {isDraw}/>
      <Status 
        statusArr = {boardStatus} 
        handleNewGame = {handleNewGame} 
        isOver = {isOver} 
        isDraw = {isDraw} 
        setMode = {setMode} 
        moveHistory = {moveHistory}/>
    </div>
  );
}

export default App;
