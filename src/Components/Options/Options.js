import './Options.css'
import { GiChecklist } from "react-icons/gi";
import { useState } from 'react';


const Options = ({handleNewGame,boardStatus,setIsOver,isOver}) => {
    let turnClass =  'turn unveal';
    // turnstatus is -1 at the very beginning
    if(boardStatus[2] === -1){
        turnClass = 'turn hide'
    }    
    if(isOver){
        turnClass = 'turn hide';
    }
    if(boardStatus[1]['onBoard'].length || boardStatus[1]['available'].length !== 20 ){
        if(!isOver){
            turnClass = `${turnClass} clickable`;
        }
    }
    

    const [isHovering,setIsHovering]= useState(false);

    const handleFormSubmit = (e)=>{
        e.preventDefault();
        console.log(e.target);
        handleNewGame();
    }

    return ( 
        <div className="options">

            {/* turn and giveUp button appearing in the side of canvas */}
            <div className={turnClass}> 
                <span className="title-name">Turn</span><br />
                { boardStatus[2] ? <div className="disp-goat" role = 'img' aria-label = 'GOAT'></div>
                            :<div className="disp-tiger" role = 'img' aria-label = 'TIGER'></div>}       
                <button className = "give-up-btn"  onClick={()=>{setIsOver(true)}}>Give Up  </button>
            </div>

            {/* list of options */}
            <div className="buttons">
                
                <form action="" className="options-form" onSubmit={event => handleFormSubmit(event)}>
                    <ul>
                        <li> 
                            <input type="checkbox" name = "vsPlayer2" value = "vsPlayer2"/>
                            <label htmlFor="vsPlayer2">Vs Player2</label>
                            
                        </li>
                        <li> 
                            <input type="checkbox" name = "vsComp" value = "vsComp"/>
                            <label htmlFor="vsComp">Vs Computer</label>
                            <ul>
                                <li>
                                    <input type="checkbox" name = "vsCompTiger" value = "vsCompTiger"/>
                                    <label htmlFor="vsCompTiger">Vs Tiger</label>
                                </li>
                                <li>
                                    <input type="checkbox" name = "vsCompGoat" value = "vsCompGoat"/>
                                    <label htmlFor="vsCompGoat">Vs Goat</label>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <input type="submit" className = 'new-game-btn' value = 'New Game'/>
                    {/* <button className = "new-game-btn" onClick={handleNewGame}>New Game</button> */}
                </form>
                
                <div className="rules-btn" >
                    <div className="rules" onMouseEnter={()=>{setIsHovering(true)}} onMouseLeave={()=>{setIsHovering(false)}} onClick = {()=>{alert("Work in progress")}}>
                        { (isHovering) ? <GiChecklist color = 'rgb(13, 179, 185)' size='45px'/> : <GiChecklist color = 'white' size='43px'/>}
                    </div>
                    <span className = "title-name">Rules</span>
                </div>
            </div>
        </div>
     );
};
 
export default Options;