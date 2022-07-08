import './Status.css'
import React, { useEffect, useContext} from 'react'
import { Link } from 'react-router-dom';
import {GiGoat,GiTigerHead } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { RiComputerFill } from "react-icons/ri";

import { useState,useRef } from 'react';
import { IconContext } from 'react-icons';
import _ from 'lodash';

import BaghchalContext from '../../BaghchalContext';

const Status = () => {
    const {statusArr,handleNewGame,isOver,isDraw,setMode,moveHistory} = useContext(BaghchalContext);
    
    const [userOptions,setUserOptions] = useState({
                                                                //[hovering,selected]
                                                    'vsPlayer2' : [false,true],           //0
                                                    'vsComp'    : [false,false],          //1
                                                    'vsTiger'   : [false,false],          //2
                                                    'vsGoat'    : [false,false]           //3
                                                });
    const [optionClass,setOptionClass] = useState({
            "innerIconsStyle" : {size:'1.3rem' ,style : {zIndex : -1 , marginTop : 6}},
            'vsPlayer2' : 'vsPlayer2 active-btn',                 
            'vsComp'    : 'vsComp',            
                                        //for inner text
            'vsTiger'   : ['vsTiger no-click','title-name no-click'],          
            'vsGoat'    : ['vsGoat no-click','title-name no-click'] 

    });

                                                
    var enumKey = {
        '0' : 'vsPlayer2',
        '1' : 'vsComp',
        '2' : 'vsTiger',
        '3' : 'vsGoat'
    }
    const handleHoverOptn = (key,boolVal)=>{
        //making a copy to change
        let userOptn = JSON.parse(JSON.stringify(userOptions));
        userOptn[enumKey[key]][0] = boolVal;
        setUserOptions(userOptn);
    }
    
    const manageClassName = (userOptn)=>{
        let temp = _.cloneDeep(optionClass);

        if(userOptn['vsPlayer2'][1]){

            temp['vsPlayer2'] = 'vsPlayer2 active-btn';
            
            temp['vsComp'] = 'vsComp';
            temp['vsTiger'] = ['vsComp no-click','title-name no-click'];
            temp['vsGoat'] = ['vsComp no-click','title-name no-click'];
            
        }
        if(userOptn['vsComp'][1]){
            temp['innerIconsStyle'] = {size:'1.3rem' ,style : {zIndex : -1 ,marginTop : 6}};
            temp['vsComp'] = 'vsComp active-btn';

            temp['vsPlayer2'] = 'vsPlayer2';
            temp['vsTiger'] = ['vsTiger active-btn','title-name'];
            temp['vsGoat'] = ['vsGoat','title-name'];
            
        }else{
            temp['innerIconsStyle'] = {size:'1.3rem' ,style : {zIndex : -1 ,marginTop : 6},color: 'rgb(68,68,68)'};
            temp['vsComp'] = 'vsComp';
            temp['vsTiger'] = ['vsTiger no-click','title-name no-click'];
            temp['vsGoat'] = ['vsGoat no-click','title-name no-click'];
        }

        if(userOptn['vsGoat'][1]){
            temp['vsGoat'] = ['vsGoat active-btn','title-name'];
            temp['vsTiger'] = ['vsTiger','title-name'];
        }
        if(userOptn['vsTiger'][1])
        {
            temp['vsTiger'] = ['vsTiger active-btn','title-name'];
            temp['vsGoat'] = ['vsGoat','title-name'];

        }
        setUserOptions(userOptn)
        setOptionClass(temp);
    }
    const handleClickOptn = (key)=>{
        let userOptn = JSON.parse(JSON.stringify(userOptions));
        for(let key1 in userOptn){
            if(enumKey[key]===key1){
                //change selected to true
                userOptn[key1][1] = true;  
            }else{
                if(enumKey[key] !== 'vsPlayer2' && key1 === 'vsComp') continue;
                if(enumKey[key] === 'vsComp' && key1 === 'vsTiger'){
                    userOptn[key1] = [false,true];
                }else{
                    userOptn[key1] = [false,false];
                }
            }
        }

        setUserOptions(userOptn);
        manageClassName(userOptn);
        setMode([userOptn['vsPlayer2'][1],userOptn['vsTiger'][1],userOptn['vsGoat'][1]]);   
    }



    
    //for flipping of the status-form-container
    let statusClass = 'status-form-container show-score';
    let  buttonClass = 'new-game-btn hidden'
    if(statusArr[2] === -1){
        statusClass = 'status-form-container'
        buttonClass = 'new-game-btn';
    }    
    if(isOver || isDraw){
        statusClass = 'status-form-container';
        buttonClass = 'new-game-btn';
    }


    //creating a ref to scroll to bottom of the move History
    const movesParent =  useRef(null);
    const scrollToBottom = ()=>{
        const domNode = movesParent.current;
        if(domNode){
            domNode.scrollTop = domNode.scrollHeight;
        }
    }
    useEffect(()=>{
        scrollToBottom();
    },[moveHistory]);


    return ( 
        <React.Fragment>

            

            <div className={statusClass}>
                <div className="status-form-container-inner">
     
                    <div className="user-options">
                    <IconContext.Provider value = {{size:'1.3rem' ,style : {zIndex : -1 ,marginTop : 6}}}>
                        {/* vs Player2 */}
                        <div className="click-btn">
                            <div className={optionClass["vsPlayer2"]} 
                                onMouseEnter={()=>{handleHoverOptn('0',true)}} 
                                onMouseLeave={()=>{handleHoverOptn('0',false)}} 
                                onClick = {()=>{handleClickOptn('0')}}>
                                    {/* if hovering or button is active */}
                                { (userOptions['vsPlayer2'][0] || userOptions['vsPlayer2'][1]) ? <FaUser color = 'rgb(13, 179, 185)'/> : <FaUser color = 'white'/>}
                            </div>
                            <span className = "title-name">VS Player2</span>
                        </div>

                        {/* vs computer */}
                        <div className="click-btn">
                            <div className={optionClass["vsComp"]} 
                                onMouseEnter={()=>{handleHoverOptn('1',true)}} 
                                onMouseLeave={()=>{handleHoverOptn('1',false)}} 
                                onClick = {()=>{handleClickOptn('1')}}>
                                { (userOptions['vsComp'][0] || userOptions['vsComp'][1]) ? <RiComputerFill color = 'rgb(13, 179, 185)'/> : <RiComputerFill color = 'white'/>}
                            </div>
                            <span className = "title-name">VS Computer</span>
                        </div>
                        <IconContext.Provider value = {optionClass['innerIconsStyle']}>
                            <div className="click-btn">
                                <div className={optionClass["vsTiger"][0]} 
                                    onMouseEnter={()=>{handleHoverOptn('2',true)}} 
                                    onMouseLeave={()=>{handleHoverOptn('2',false)}} 
                                    onClick = {()=>{handleClickOptn('2')}}>
                                    { (userOptions['vsTiger'][0] || userOptions['vsTiger'][1]) ? <GiTigerHead color = 'rgb(13, 179, 185)'/> : <GiTigerHead/>}
                                </div>
                                <span className = {optionClass["vsTiger"][1]}>VS Tiger</span>
                            </div>
                            {/* vs Goat */}
                            <div className="click-btn ">
                                <div className={optionClass["vsGoat"][0]}
                                    onMouseEnter={()=>{handleHoverOptn('3',true)}} 
                                    onMouseLeave={()=>{handleHoverOptn('3',false)}} 
                                    onClick = {()=>{handleClickOptn('3')}}>
                                    { (userOptions['vsGoat'][0] || userOptions['vsGoat'][1]) ? <GiGoat color = 'rgb(13, 179, 185)'/> : <GiGoat/>}
                                </div>
                                <span className = {optionClass["vsGoat"][1]}>VS Goat</span>
                            </div>
                        </IconContext.Provider>
                        <Link to = '/baghchal'>
                            <button className = {buttonClass} onClick={handleNewGame}>New Game</button>
                        </Link>
                        
                    </IconContext.Provider>
                    </div>


                    <div className="game-status">
                        
                        <div className="status-main">
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

                    
                        <div className="move-history">
                            <span className='title-name'>Moves <br /></span>
                            <div className="histories" ref = {movesParent}>
                                {
                                    moveHistory.map((move,index) => {
                                        return <React.Fragment key = {index}>{move} <br/></React.Fragment>
                                    })
                                }
                            </div>

                        </div>
                    </div>        
                </div>
            </div>

            

        </React.Fragment>
     );
}
 
export default Status;