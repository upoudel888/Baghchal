import './App.css';
import React from 'react'
import { useEffect, useState } from 'react'
import { Canvas } from './Components'

function App({ game }) {

  const [highlightPaths, setHightlightPaths] = useState([null]);
  const [highlightNodes, setHighlightNodes] = useState([null])

  const handleClick = (pos) => {

    //goats turn
    if (game.getTurnStatus() === 1) {
      if (game.isShowingSuggestions()) {
        setHighlightNodes(game.updateWithGoat(pos));
        //set DOM turn here ---->
      } else {
        //highiight positions for goats too
      }
      //tigers turn
    } else {
      if (!game.isShowingSuggestions()) {
        let arr1 = game.highlightPath(pos);
        setHightlightPaths(arr1[0]);
        setHighlightNodes(arr1[1]);
      } else {
        let arr1 = game.updateWithTiger(pos);
        setHightlightPaths(arr1[0]);
        setHighlightNodes(arr1[1]);
        //set DOM turn here --->
        setTimeout(() => {
          setHighlightNodes(game.highlightNodes());
        }, 200);
      }
    }
  }

  const handleNewGame = () => {
    setHighlightNodes(game.startGame());
  }

  return (
    <div className="App">
      <Canvas handleClick={handleClick} highlightPaths={highlightPaths} highlightNodes={highlightNodes} />
      <button onClick={handleNewGame}>NewGame</button>
    </div>
  );
}

export default App;
