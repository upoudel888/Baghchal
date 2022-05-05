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
                                                },1]);
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
        if (!game.isShowingSuggestions() && !game.hasTigerAt(pos)) {
          
          arr1 = game.highlightPath(pos);        
        } else {
          arr1 = game.updateWithGoat(pos);        
        }
        setHightlightPaths(arr1[0]);
        setHighlightNodes(arr1[1]);
        
      }
  
    //tigers turn  
    } else {
      if (!game.isShowingSuggestions() && game.hasTigerAt(pos)) {
        arr1 = game.highlightPath(pos);        
      } else {
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
  }

  const handleNewGame = () => {
    setHightlightPaths([null]);
    setHighlightNodes([null]);
    setHighlightNodes(game.startGame());
    setBoardStatus(game.getBoardStatus());
  }

  return (
    <div className="baghchal-app">
      <Canvas handleClick={handleClick} highlightPaths={highlightPaths} highlightNodes={highlightNodes} statusArr = {boardStatus}/>
      <Options handleNewGame = {handleNewGame} turnStatus={boardStatus[2]} isHovering = {isHoveringIcon} setIsHovering = {setIsHoveringIcon}/>     
      <Status statusArr = {boardStatus}></Status>
    </div>
  );
}

export default App;
