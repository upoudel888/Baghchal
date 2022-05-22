import './App.css';
import React from 'react'
import { useState } from 'react'
import { Canvas,Status,Options } from './Components'



function App({ game }) {

  const [highlightPaths, setHightlightPaths] = useState([null]);
  const [highlightNodes, setHighlightNodes] = useState([null]);
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
        setHighlightNodes(game.updateWithGoat(pos))
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
        setHightlightPaths(arr1[0]);
        setHighlightNodes(arr1[1]);
        
      }
    //tigers turn  
    } else {
      //user clicks on a tiger to reveal positions it can move to 
      if (!game.isShowingSuggestions() && game.hasTigerAt(pos)) {
        arr1 = game.highlightPath(pos);
      }else if(game.isShowingSuggestions() && game.hasTigerAt(pos)){
        //user clicks on another tiger while suggestions for another tiger is being shown        
        if(!game.wasPreviousSelection(pos)){
          //true arguement to remove goats highlighted danger
          arr1 = game.highlightPath(pos,true);
        //clicking on the same tiger again cancels suggestions
        }else{
          arr1 = game.updateWithTiger(pos);
        }
      //user clicks where he was suggested to move the tiger
      //this also counters condition where user clicks the unsuggested node and 
      }else{   
        arr1 = game.updateWithTiger(pos);
        //highlight nodes where goats can be placed if available 
        if(game.hasAvailableGoats()){
          setTimeout(() => {
            setHighlightNodes(game.highlightNodes());
          }, 200);
        }        
      }
      
      setHightlightPaths(arr1[0]);
      setHighlightNodes(arr1[1]);
    }
    setBoardStatus(game.getBoardStatus());
    setIsOver(game.isOver());
  }

  const handleNewGame = () => {
    setTimeout(()=>{
      setHightlightPaths([null]);
      setHighlightNodes([null]);
      setIsOver(false);
      setHighlightNodes(game.startGame());
      setBoardStatus(game.getBoardStatus());
    },200);
  }

  return (
    <div className="baghchal-app">
      <Canvas handleClick={handleClick} highlightPaths={highlightPaths} highlightNodes={highlightNodes} statusArr = {boardStatus} isOver = {isOver} handleNewGame = {handleNewGame}/>
      <Options handleNewGame = {handleNewGame} boardStatus={boardStatus} isHovering = {isHoveringIcon} setIsHovering = {setIsHoveringIcon} setIsOver = {setIsOver} isOver = {isOver}/>     
      <Status statusArr = {boardStatus}></Status>
    </div>
  );
}

export default App;