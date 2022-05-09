import './Canvas.css'


const Canvas = ({handleClick,highlightPaths,highlightNodes,statusArr,isOver,handleNewGame}) => { 

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

    let overLayClass = isOver ? 'baghchal-overlay overlay-visible' : "baghchal-overlay";
    let winnerTextClass = isOver ? 'winner-text  wobble-hor-top' : "winner-text";
    let winnerClass = 'winner';
    if(isOver){
        //One of the players win
        if( statusArr[1]['eaten'].length === 20){
            winnerClass = 'winner winner-Tiger';
        }else if(statusArr[0]['trapStatus'].reduce((a,b)=>a+b) === 4){
            winnerClass = 'winner winner-Goat';
        //gameover by surrender
        //Player with current turn loses 
        }else{        
            winnerClass = statusArr[2] ? 'winner winner-Tiger' : 'winner winner-Goat';
        }
    }



    
    return ( 
        
        <div className="canvas-container">
            {
                nodes.map(node => {
                            let classname = `Node Node-${String(node)}`;
                            if(highlightNodes.includes(node) || focusableNodes.includes(node)){
                                classname = `Node Node-${String(node)} pointer-cursor`;
                                if(highlightNodes.includes(node)){
                                    classname = `Node Node-${String(node)} highlight-safe pointer-cursor`;
                                }
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
            {
                
                <div className={overLayClass}>
                    <div className={winnerClass} role="img" aria-label={winnerClass}></div>
                    <div className={winnerTextClass}>{winnerClass.split('-')[1]}s Won ! </div>
                    <button className="play-again-btn" onClick={handleNewGame}>Play Again</button>
                </div>
            }
        
        </div>
                

            
     );
}
 
export default Canvas;