import './Canvas.css'
import React,{useContext} from 'react'
import Rules from '../Rules/Rules.js'
import { Link } from 'react-router-dom';

import BaghchalContext  from '../../BaghchalContext';
import MetaDecorator from '../../utils/MetaDecorator';



const Canvas = ({showRules,isHomePage}) => { 

   
    const {handleClick,statusArr,isOver,setIsOver,handleNewGame,highlightElems,isDraw,isAIturn} =  useContext(BaghchalContext);

    let turnClass =  'turn unveal';
    // turnstatus is -1 at the very beginning
    if(statusArr[2] === -1){
        turnClass = 'turn hide'
    }    
    if(isOver){
        turnClass = 'turn hide';
    }
    if(statusArr[1]['onBoard'].length || statusArr[1]['available'].length !== 20 ){
        if(!isOver){
            turnClass = `${turnClass} clickable`;
        }
    }
    let [highlightPaths,highlightNodes,endangeredNodes] = highlightElems;
    let nodes = Array.from(Array(25).keys());
    let paths = ['0-1', '1-2', '2-3', '3-4',                        //horizontal paths
                 '5-6', '6-7', '7-8', '8-9',
                 '10-11', '11-12', '12-13', '13-14',
                 '15-16', '16-17', '17-18', '18-19',
                 '20-21', '21-22', '22-23', '23-24', 

                 '0-5', '5-10', '10-15', '15-20',                   //vertical paths
                 '1-6', '6-11', '11-16', '16-21', 
                 '2-7', '7-12', '12-17', '17-22', 
                 '3-8', '8-13', '13-18', '18-23', 
                 '4-9', '9-14', '14-19', '19-24',

                 '0-6', '6-12', '12-18', '18-24',                   //diagonal paths (main diagonal)
                 '4-8', '8-12', '12-16', '16-20', 

                 '2-8','8-14','14-18','18-22',                      //diagonal path (other digonal)
                 '2-6','6-10','10-16','16-22'
                ];

    
                        // turn ? goat.pos : tiger.pos
    let focusableNodes = (statusArr[2]) ? statusArr[1]['pos'] : statusArr[0]['pos'];
    // if it is goats turn and user has goats available
    // then the nodes with goats on them are no longer focusable
    if(statusArr[1]['available'].length && statusArr[2]){
        focusableNodes = [];
    }

    var overLayClass = isOver || isDraw || showRules ? 'baghchal-overlay overlay-visible scale-in-center' : "baghchal-overlay overlay-visible";
    let winnerTextClass = isOver || isDraw ? 'winner-text  wobble-hor-top' : "winner-text";
    let winnerClass = 'winner';
    if(isOver){

        winnerClass = statusArr[2] ? 'winner winner-Tiger' : 'winner winner-Goat';
        switch(isOver){
            case 1:
            case 2:
                winnerClass = 'winner winner-Tiger';
                break;
            case 3: 
                winnerClass = 'winner winner-Goat';
                break;
            default:
                break;
        }
    }
    const metaTag = {
        'title' : "Bagchal",
        'description' : `Bagchal (Tiger and goat game) is a traditional Nepalese Board game. Play Bagchal online. See Bagchal rules
        and play with Bagchal-AI to build your own Bagchal strategy. Bagchal board. Baghchal online. Baghchal rules. 
        Bagh-chal online, Bagchal online, Baghchal online`,
        'link':'/Baghchal'
    }
    return ( 
        
        <React.Fragment>
            <MetaDecorator title = {metaTag.title} description={metaTag.description} link = {metaTag.link}/>
        <div className="canvas-container">
            <div className="canvas-container-inner">
                {
                    nodes.map(node => {
                                let classname = `Node Node-${String(node)}`;
                                
                                // added class pointer-cursor to show it's focusable
                                if(highlightNodes.includes(node)){
                                    classname = `Node Node-${String(node)} highlight-safe pointer-cursor`; 
                                }
                                //if the node has tiger/goat on in then the Zindex NODE need's to be changes
                                // so that click events get detected
                                if(focusableNodes.includes(node)){
                                    classname = `Node Node-${String(node)} highlight-safe pointer-cursor1`;
                                }
                                if(endangeredNodes.includes(node)){
                                    classname = `Node Node-${String(node)} highlight-danger`;
                                }
                            
                                return (
                                    <div className = {classname} key = {node} onClick = {()=>{handleClick(node)}}></div>   
                                )
                                }) 

                }
                {      

                    paths.map(path => {
                                    let classname = `Path Path-${String(path)}`;
                                    if(highlightPaths.includes(path)){
                                        classname = `${classname} highlight-safe`;
                                    }
                                    return (<div className = {classname} key = {paths.indexOf(path)} ></div>)
                                }) 
                }
                <div className={turnClass}> 
                    <span className="title-name">Turn</span>
                    { statusArr[2] ? <div className="disp-goat" role = 'img' aria-label = 'GOAT'></div>
                                :<div className="disp-tiger" role = 'img' aria-label = 'TIGER'></div>}       
                    <button className = {isAIturn ? "give-up-btn no-click1" : 'give-up-btn' }  onClick={()=>{setIsOver(true)}}>Give Up  </button>
                </div>
            </div>
            
            
            {
                isOver 
                ? 
                <div className={overLayClass}>
                    <div className={winnerClass} role="img" aria-label={winnerClass}></div>
                    <div className={winnerTextClass}>{winnerClass.split('-')[1]}s Won ! </div>
                    <Link to='/baghchal'>
                        <button className="play-again-btn" onClick={()=>{
                            handleNewGame();
                        }}>Play Again</button>
                    </Link>
                </div>
                : ''
            }
            {
                isDraw
                ?
                <div className={overLayClass}>
                    <div className="draw-container">
                        <div className='winner winner-Tiger' role="img" aria-label='tiger'></div>
                        <div className='winner winner-Goat' role="img" aria-label='goat'></div>
                    </div>
                    <div className={winnerTextClass}>Draw </div>
                    <Link to='/baghchal'>
                        <button className="play-again-btn" onClick={()=>{
                            handleNewGame();
                        }}>Play Again</button>
                    </Link>
                </div>
                : ''
            }
            {
                
                showRules 
                ? 
                <div className={overLayClass}>
                    <Rules isHomePage = {isHomePage}/> 
                </div>
                : ' '
            }
                
            
        </div>


        

        </React.Fragment>

                

            
     );
}
 
export default Canvas;