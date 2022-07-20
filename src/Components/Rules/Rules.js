import './Rules.css'
import React,{useState} from 'react'
import { ImCross} from "react-icons/im";
import { Link } from 'react-router-dom';


import MetaDecorator from '../../utils/MetaDecorator';
import img1 from '../../assets/trapped.jpg'
import img2 from '../../assets/jump.jpg'

const Rules = () => {
    const [isHoveringCross,setIsHoveringCross]= useState(false);

    let rules = {
        'rules-title' : "Baghchal Board Game",
        'briefing'    : `Baghchal (Tiger and Goat game) is a classic Nepalese two player board game. Baghchal
                        board is a 5 X 5 grid with 25 nodes interconnected with each other through edges.
                        "Bagh" means "Tiger" and "Chal" means "To-move".
                        Two players, one playing Tiger and the other playing Goats,
                        compete in a mind game of Baghchal. `,
        'Tiger and Goat Game Rules'    : {
                        "Player Goat"   : [
                                            `Player-Goat is provided with 20 goats all of which must be placed strategically on the board.
                                            It is only when all the 20 goats are placed on the board, Player-Goat is allowed to maneuver the goats
                                            along the edges/paths.`,
                                            `Player-Goat must be mindful not to let tigers capture the goats.`,
                                            `Player-Goat wins when all the tigers are trapped i.e. when every tiger has no valid moves left.`
                                        ],
                                    
                        "Player Tiger"   : [`In the beginning, four tigers are spawnned at four coners of the board.
                                            Player-Goat places their goats on the board and tries to corner and trap the tigers.`,
                                            `Player-Tiger must aim to capture the goats.`,
                                            `Player-Tiger wins when 5 goats are captured.`
                                        ]
                                    
                        },
        'draw-title title-name' : 'Draw',
        'draw-briefing briefing' : `3 fold repetition rule has been implemented. If both players make redundant moves there are chances of draw.`
        

    }
    const enumImage = {
        'Goat' : "disp-goat",
        'Tiger' : "disp-tiger"
    }
    const imagePaths = [[img2,'Jump to capture'],[img1,'Trapped Tiger']];
    const metaTag = {
        'title' :  'Baghchal Game Rules',
        'description' : `Baghchal Rules.Tigers aim to capture goats while goats aim to trap the tigers. 
        Play against a Baghchal Engine to improve your Baghchal Strategy.`,
        'link' : '/baghchal/rules'
    }

    return ( 
        <div className={`rules-container`}>
            <MetaDecorator title = {metaTag.title} description = {metaTag.description} link = {metaTag.link}/>
            <div className="cross" 
                onMouseEnter={()=>{setIsHoveringCross(true)}} 
                onMouseLeave={()=>{setIsHoveringCross(false)}}>
                <Link to = '/baghchal'>
                    { (isHoveringCross) ? <ImCross color = 'rgb(13, 179, 185)'/> : <ImCross color = 'white'/>}
                </Link>
            </div>
            {
                Object.keys(rules).map((key,index) =>{
                    if(typeof(rules[key])==='string'){
                        return key==='rules-title' ?
                                <h2 className={key} key = {index}>{rules[key]}</h2>
                               : 
                                <div className={key} key= {index}>{rules[key]}</div>
                        
                    }else{
                        return (
                            Object.keys(rules[key]).map((keyIn,indexIn)=>{
                                return (
                                    <React.Fragment key = {indexIn}>
                                        {
                                            keyIn === "Player Goat" && <h2 className="rules-title" key = {indexIn}> {key}</h2> 
                                        }
                                        <h2 className="title-name" key = {`title-${indexIn}`}> {keyIn}</h2>
                                        <div className="description-container" key = {`des-${indexIn}`}>
                                            <div className={enumImage[keyIn.split(" ")[1]]} role = 'img' aria-label = 'GOAT' key = {`img-${indexIn}`}></div>
                                            <div className="obj-description" key = {`desInner-${indexIn}`}>
                                                {
                                                    rules[key][keyIn].map((info,indexInfo)=>{
                                                        return (
                                                            <React.Fragment key = {indexInfo}>{info}<br/><br/></React.Fragment>
                                                        )
                                                    })
                                                
                                                }
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        )
                    }
                })
            }
            <div className="img-eg">
                {
                    imagePaths.map((img,index)=>{
                        return (
                            <div className = 'img-eg-inner' key = {index}>
                                <img src={img[0]} alt={img[1]} key = {img[1]}/>
                                <div className = 'title-name' key = {index}>{img[1]}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}
 
export default Rules;