import './Options.css'
import { GiChecklist } from "react-icons/gi";


const Options = ({handleNewGame,turnStatus,isHovering,setIsHovering}) => {
    return ( 
        <div className="options">
            <div className="turn"> 
                <span className="title-name">Turn</span><br />
                { turnStatus ? <div className="disp-goat" role = 'img' aria-label = 'GOAT'></div>
                            :<div className="disp-tiger" role = 'img' aria-label = 'TIGER'></div>}       
                <button className = "give-up-btn"  onClick={()=>{alert("Work in progess")}}>Give Up  </button>
            </div>
            <div className="buttons">
                <button className = "new-game-btn" onClick={handleNewGame}>New Game</button>
                {/* <button className = "vs-user-btn"  onClick={()=>{alert("Currently playiing vs player 2")}}>Vs Player2  </button>
                <button className = "vs-comp-btn"  onClick={()=>{alert("Work in progess")}}>Vs Computer </button> */}
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