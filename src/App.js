import './App.css';
import React from 'react'
import { useEffect, useState } from 'react'
import { Canvas,Status } from './Components'


function App({ game }) {

  const [highlightPaths, setHightlightPaths] = useState([null]);
  const [highlightNodes, setHighlightNodes] = useState([null]);
  const [boardStatus,setBoardStatus] = useState([{
                                                  pos : [0,4,20,24],       // tigers spawn at four corners of the board
                                                  trapStatus : [1,1,1,1]   //1 means not trapped  and 0 means trapped
                                                },
                                                {
                                                  available: Array.from(Array(25).keys()),      // 24 goats in total
                                                  onBoard  : [],
                                                  eaten    : []                                 // 0 goats eaten/captured at the beginning
                                                },1]);

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
    setHighlightNodes(game.startGame());
  }

  return (
    <div className="App">
      <Canvas handleClick={handleClick} highlightPaths={highlightPaths} highlightNodes={highlightNodes} />
      <Status statusArr = {boardStatus}></Status>
      <button onClick={handleNewGame}>NewGame</button>
    </div>
  );
}

export default App;
