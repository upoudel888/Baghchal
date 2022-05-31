import './Options.css'
import { GiChecklist } from "react-icons/gi";
import { useState } from 'react';


const Options = ({handleNewGame,boardStatus,setIsOver,isOver}) => {
    
    

    const [isHovering,setIsHovering]= useState(false);

    

    return ( 
        <div className="options">

            {/* turn and giveUp button appearing in the side of canvas */}
            

            {/* list of options */}
            <div className="buttons">
                
                
                

            </div>
        </div>
     );
};
 
export default Options;