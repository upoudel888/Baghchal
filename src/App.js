import './App.css';
import React from 'react'
import { useState } from 'react'
import { Canvas,Status,Options } from './Components'
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
                                                  available: Array.from(Array(20).keys()),      // 24 goats in total
                                                  onBoard  : [],
                                                  eaten    : [],                                 // 0 goats eaten/captured at the beginning
                                                  pos      :  []
                                                },-1]);
  const [isOver,setIsOver] = useState(false);
  //for rulesIcon in Options component to change color of svg upon hovering
  const [isHoveringIcon,setIsHoveringIcon]= useState(false);


  const handleClick = (pos) => {
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
      //this also counters condition where user clicks the unsuggested node m
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

    game.showBoard();

    findBestMove(game);
  }

  const handleNewGame = () => {
    setTimeout(()=>{
      setHighlightElems([[],[],[]]);
      setIsOver(false);
      setHighlightElems(game.startGame());
      setBoardStatus(game.getBoardStatus());
    },200);
  }

  return (
    <div className="baghchal-app">
      <Canvas handleClick={handleClick} statusArr = {boardStatus} isOver = {isOver} handleNewGame = {handleNewGame} highlightElems = {highlightElems}/>
      <Options handleNewGame = {handleNewGame} boardStatus={boardStatus} isHovering = {isHoveringIcon} setIsHovering = {setIsHoveringIcon} setIsOver = {setIsOver} isOver = {isOver}/>     
      <Status statusArr = {boardStatus}></Status>
    </div>
  );
}

export default App;
