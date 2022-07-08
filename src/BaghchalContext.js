import { createContext,useState,useRef,useEffect } from "react";

import Baghchal from './modules/baghchal';
import findBestMove from './modules/smartMove';


const BaghchalContext = createContext();

export function BaghchalProvider({children}){

    const game = useRef(0);
    useEffect(()=>{
        game.current = new Baghchal();
    },[])
    //highlightElems = [[highlightPaths],[HightlightNodes],[endangeredNodes]]
    // all of them used to direct user with suggestions
    const [highlightElems,setHighlightElems] = useState([[],[],[]]);
    const [statusArr,setStatusArr] = useState([{
                                                    pos : [0,4,20,24],       // tigers spawn at four corners of the board
                                                    trapStatus : [0,0,0,0]   //1 means trapped  and 0 means not trapped
                                                    },
                                                    {
                                                    available: Array.from(Array(20).keys()),      // 20 goats in total
                                                    onBoard  : [],
                                                    eaten    : [],                                 // 0 goats eaten/captured at the beginning
                                                    pos      :  []
                                                    },-1]);                                         // turn Status (-1 signifies game not started)
    const [isAIturn,setIsAIturn] = useState(false);     //to regulate onClick and giveUp btn clicking when AI's turn                                           
    const [isOver,setIsOver] = useState(0);
    const [isDraw,setIsDraw] = useState(false);

    const [moveHistory,setMoveHistory] = useState([]);


    const [vsPlayer2,setVsPlayer2] = useState(false);
    const [vsCompGoat,setVsCompGoat] = useState(false);
    const [vsCompTiger,setVsCompTiger] = useState(false);


    const checkAIturn = (turn)=>{
        if(vsPlayer2) return false;
        if(vsCompGoat && turn===1) return true;
        if(vsCompTiger && turn===0) return true;
        return false;
    }     
    
    
    const handleClick = (pos,clicker = 1) => {  //1 means user and 0 means AI
        if(game.current.isOver()) return;
        if(isAIturn && clicker === 1) return;
        //array used to Highlight Nodes and Vertices later on
        let arr1 = [];
        //goats turn
        if (game.current.getTurnStatus() === 1){
        //first empty nodes are filled with available Goats
        if(game.current.hasAvailableGoats()){
            arr1 = game.current.updateWithGoat(pos);
        //once we run out of Goats then we start moving them like tigers
        }else{    
            //read comments of tigers turn below for better understanding            
            if (!game.current.isShowingSuggestions() && game.current.hasGoatAt(pos)) {
            arr1 = game.current.highlightPath(pos);        
            } else if(game.current.isShowingSuggestions() && game.current.hasGoatAt(pos)) {
                arr1 = game.current.wasPreviousSelection(pos) ? game.current.updateWithGoat(pos) : game.current.highlightPath(pos);  
            }else{
            arr1 = game.current.updateWithGoat(pos);
            }
        }
        
        //tigers turn  
        } else {
        //user clicks on a tiger to reveal positions it can move to 
        if (!game.current.isShowingSuggestions() && game.current.hasTigerAt(pos)) {
            arr1 = game.current.highlightPath(pos);
        }else if(game.current.isShowingSuggestions() && game.current.hasTigerAt(pos)){
            //user clicks on another tiger while suggestions for another tiger is being shown        
            if(!game.current.wasPreviousSelection(pos)){
            arr1 = game.current.highlightPath(pos);
            //clicking on the same tiger again cancels suggestions
            }else{
            arr1 = game.current.updateWithTiger(pos);
            }
        //user clicks where he was suggested to move the tiger
        //this block also handles condition where user clicks the unsuggested node 
        }else{   
            arr1 = game.current.updateWithTiger(pos);
            //highlight nodes where goats can be placed if available 
            setTimeout((arr1) => {
            if(game.current.hasAvailableGoats()){
                arr1 = game.current.highlightNodes();
                setHighlightElems(arr1);
            }        
            }, 300);
        }
        }
        setMoveHistory(game.current.getMoveHistory());
        setHighlightElems(arr1);
        setStatusArr(game.current.getBoardStatus());
        setIsOver(game.current.isOver());
        setIsAIturn(checkAIturn(game.current.getTurnStatus()));
        setTimeout(()=>{
        if(!game.current.isOver() && game.current.checkRepetition()){
            setIsDraw(true);
        }
        },250);

        setTimeout(()=>{
        //if AI is playing
        if(!vsPlayer2){
            if(vsCompGoat && game.current.getTurnStatus()){
            //finding the next best move using minMax
            let move = findBestMove(game.current);
            // obtained moves are in the form:
            if(!move) alert("There was an issue .. help me with a SC");
            // g-0 i.e place a goat in 0
            // g-1-2 i.e move the goat in pos-1 to pos-2
            // t-1-2 i.e move the tiger in pos-1 to pos-2
            // t-1-X-2-3 i.e jump the tiger in pos-1 to pos-3 and capture goat in pos-2
            let tempArr = move.split('-');
            //simply put the goat in the position
            if(tempArr.length === 2){
                setTimeout(()=>{
                handleClick(Number(tempArr[1]),0);
                },215);
            }else{
                //move goat from one position to another
                
                //first highlight the possible position
                setTimeout(()=>{
                handleClick(Number(tempArr[1]),0);
                },215);
                //then move the goat afterwards
                setTimeout(()=>{
                handleClick(Number(tempArr[tempArr.length-1]),0);
                },430);
            }
            }
            if(vsCompTiger && !game.current.getTurnStatus()){
            let move = findBestMove(game.current);
            if(!move) alert("There was an issue.. help me with a SC ");
            let tempArr = move.split('-');
            //move tiger from one position to another
            setTimeout(()=>{
                handleClick(Number(tempArr[1]),0);
            },215);
            setTimeout(()=>{
                handleClick(Number(tempArr[tempArr.length-1]),0);
            },430);
            }
        }
        },215);
        
    }
    
    const handleNewGame = () => {

        setHighlightElems([[],[],[]]);
        setMoveHistory([]);
        setIsOver(false);
        setIsDraw(false);
        setHighlightElems(game.current.startGame());
        setStatusArr(game.current.getBoardStatus());
        setIsAIturn(checkAIturn(game.current.getTurnStatus()));
        
        if(vsCompGoat){
        setTimeout(()=>{
            let move = findBestMove(game.current);
            var
            tempArr =  move.split('-');
            handleClick(Number(tempArr[tempArr.length - 1]),0);
        },200);
        }

    }

    const setMode = (modeArr) =>{
        setVsPlayer2(modeArr[0]);
        setVsCompTiger(modeArr[1]);
        setVsCompGoat(modeArr[2]);
    }



    return (
        <BaghchalContext.Provider value = {{
            handleClick,
            statusArr,
            isOver,
            setIsOver,
            handleNewGame,
            highlightElems,
            isDraw,
            isAIturn,
            setMode,
            moveHistory
        }}>
            {children}
        </BaghchalContext.Provider>
    )
}

export default BaghchalContext;
