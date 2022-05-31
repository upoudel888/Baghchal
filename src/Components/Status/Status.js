import './Status.css'
import React from 'react'
import { GiChecklist,GiGoat,GiTiger,GiTigerHead } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { RiComputerFill } from "react-icons/ri";

import { useState } from 'react';
import { IconContext } from 'react-icons';

const Status = ({statusArr,handleNewGame,isOver}) => {

    const [isHovering,setIsHovering]= useState(false);
    const [userOptions,setUserOptions] = useState({
                                                                //[hovering,selected]
                                                    'vsPlayer2' : [false,true],         //0
                                                    'vsComp'    : [false,false],        //1
                                                    'vsTiger'   : [false,false],        //2
                                                    'vsGoat'    : [false,false]         //3
                                                });

                                                
    var enumKey = {
        '0' : 'vsPlayer2',
        '1' : 'vsComp',
        '2' : 'vsTiger',
        '3' : 'vsGoat'
    }
    const handleHoverOptn = (key,boolVal)=>{
        let userOptn = JSON.parse(JSON.stringify(userOptions));
        userOptn[enumKey[key]][0] = boolVal;
        setUserOptions(userOptn);
    }
    
    const handleClickOptn = (key)=>{
        let userOptn = JSON.parse(JSON.stringify(userOptions));
    
        switch(key){
            case '0':
                alert('vsPlayer2 is being selected');
                break;
            case '1':
                alert('vsComp is being selected');
                break;
            case '2':
                alert('vsTiger is being selected');
                break;
            case '3':
                alert('vsGoat is being selected');
                break;
            default:
                break;

        }
    }


    const handleFormSubmit = (e)=>{
        e.preventDefault();
        console.log(e.target);
        handleNewGame();
    }

    let statusClass = 'status-form-container show-score';
    if(statusArr[2] === -1){
        statusClass = 'status-form-container'
    }    
    if(isOver){
        statusClass = 'status-form-container';
    }


    return ( 
        <React.Fragment>
            <div className="rules-btn" >
                    <div className="rules" onMouseEnter={()=>{setIsHovering(true)}} onMouseLeave={()=>{setIsHovering(false)}} onClick = {()=>{alert("Work in progress")}}>
                        { (isHovering) ? <GiChecklist color = 'rgb(13, 179, 185)' size='45px'/> : <GiChecklist color = 'white' size='43px'/>}
                    </div>
                    <span className = "title-name">Rules</span>
            </div>

            <div className={statusClass}>
                <div className="status-form-container-inner">
                        
                    <div className="user-options">
                    <IconContext.Provider value = {{size:'1.3rem' ,style : {marginTop : 6}}}>
                        {/* vs Player2 */}
                        <div className="click-btn">
                            <div className="vsPlayer2 click-btn-inner " 
                                onMouseEnter={()=>{handleHoverOptn('0',true)}} 
                                onMouseLeave={()=>{handleHoverOptn('0',false)}} 
                                onClick = {()=>{handleClickOptn('0')}}>
                                { (userOptions['vsPlayer2'][0]) ? <FaUser color = 'rgb(13, 179, 185)'/> : <FaUser color = 'white'/>}
                            </div>
                            <span className = "title-name">VS Player2</span>
                        </div>

                        {/* vs computer */}
                        <div className="click-btn">
                            <div className="vsComp click-btn-inner " 
                                onMouseEnter={()=>{handleHoverOptn('1',true)}} 
                                onMouseLeave={()=>{handleHoverOptn('1',false)}} 
                                onClick = {()=>{handleClickOptn('1')}}>
                                { (userOptions['vsComp'][0]) ? <RiComputerFill color = 'rgb(13, 179, 185)'/> : <RiComputerFill color = 'white'/>}
                            </div>
                            <span className = "title-name">VS Computer</span>
                        </div>
                        {/* vs Tiger */}
                        <div className="click-btn no-click">
                            <div className="vsTiger click-btn-inner " 
                                onMouseEnter={()=>{handleHoverOptn('2',true)}} 
                                onMouseLeave={()=>{handleHoverOptn('2',false)}} 
                                onClick = {()=>{handleClickOptn('2')}}>
                                { (userOptions['vsTiger'][0]) ? <GiTigerHead color = 'rgb(13, 179, 185)'/> : <GiTigerHead color = 'white'/>}
                            </div>
                            <span className = "title-name no-click">VS Tiger</span>
                        </div>
                        {/* vs Goat */}
                        <div className="click-btn ">
                            <div className="vsGoat click-btn-inner " 
                                onMouseEnter={()=>{handleHoverOptn('3',true)}} 
                                onMouseLeave={()=>{handleHoverOptn('3',false)}} 
                                onClick = {()=>{handleClickOptn('3')}}>
                                { (userOptions['vsGoat'][0]) ? <GiGoat color = 'rgb(13, 179, 185)'/> : <GiGoat color = 'white'/>}
                            </div>
                            <span className = "title-name no-click">VS Goat</span>
                        </div>
                    </IconContext.Provider>
                    <button className = "new-game-btn" onClick={handleNewGame}>New Game</button>
                        
                    </div>


                    <div className="game-status">
                        <div className="status">
                            <span className="title-name">Goats Available </span><br />
                            <span className="display-numbers">{statusArr[1]['available'].length} / 20</span>           
                        </div>
                        <div className="status">
                            <span className="title-name">Goats on board</span><br />
                            <span className="display-numbers">{statusArr[1]['onBoard'].length} </span><br />
                        </div>
                        <div className="status">
                            <span className="title-name">Goats Captured</span><br />
                            <span className="display-numbers">{statusArr[1]['eaten'].length} / 20</span><br />
                        </div>
                        <div className="status">
                            <span className="title-name">Tigers Trapped</span><br />
                            <span className="display-numbers"> {statusArr[0]['trapStatus'].reduce((a,b)=>(a+b))} / 4</span><br />
                        </div>   
                    </div>        
                </div>
            </div>

            

        </React.Fragment>
     );
}
 
export default Status;