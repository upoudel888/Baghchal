
class Baghchal{
    parent;
    board;
    tigers;
    goats;
    turn;

    prevSelection;                          // where user previously clicked to move the piece
    prevSuggestions;                        // where user was suggested to move to 

    constructor(){
        this.initialize();
    }
    
    initialize(){
        // 0's denote tigers
        // 1's denote goats
        // null means emptyPos
        this.board = [
            [0,null,null,null,0],
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,null,null,null,null],
            [0,null,null,null,0]
        ];
        
        this.tigers = {
            trapStatus : [0,0,0,0],                         // 1 means trapped  and 0 means not trapped
            pos : [0,4,20,24],                              // tigers spawn at four corners of the board
            validMoves : []

        };
        this.goats = {
            available: Array.from(Array(20).keys()),      // 20 goats in total
            onBoard  : [],
            eaten    : [],                                 // 0 goats eaten/captured at the beginning
            pos : [],
            validMoves: [],
        };
    
        this.turn = 1;                                      // 1 means goat
        this.prevSelection = -1;                            // no selection at the beginning
        this.prevSuggestions = [];                             
    }

    setParent(){
        this.parent = document.querySelector(".canvas-container");
    }
  
    getTurnStatus(){
        return this.turn;
    }

    isShowingSuggestions(){
        return this.prevSuggestions.length ? true : false;
    }
        
    getBoardStatus(){
        return [this.tigers,this.goats,this.turn];
    }
    
    hasTigerAt(pos){
        return this.board[Math.floor(pos/5)][pos%5] === 0;
    }

    hasGoatAt(pos){
        return this.board[Math.floor(pos/5)][pos%5] === 1;
    }

    isOver(){
        if(this.goats.eaten.length === 20 ) return 1;
        return this.tigers.trapStatus.reduce((a,b)=>a+b) === 4;   
    }

    wasPreviousSelection(pos){
        return this.prevSelection === pos;
    }
    
    startGame(){

        //removing tigers and goats of previous game if any   
        this.parent = document.querySelector(".canvas-container");
            //removing tigers
        let removeEle = document.querySelectorAll(".tiger");
        if(removeEle){
            removeEle.forEach((ele)=>this.parent.removeChild(ele));
        }
            //removing goats
        removeEle = document.querySelectorAll(".goat");
        if(removeEle){
            removeEle.forEach((ele)=>this.parent.removeChild(ele));
        }
        
        //now initialinzing a new board state
        this.initialize();

        //positioning four tigers at four corners
        let tigerPos = [0,4,20,24];
        tigerPos.forEach((pos)=>{
            //initializing 4 tigers on four corners of the board
            let elem = document.createElement('div');
            elem.classList.add('tiger',`tiger-${pos}`);
            elem.setAttribute('role','img');
            elem.setAttribute('aria-label','Tiger');
            elem.style.zIndex = 1;
            this.parent.appendChild(elem);

        });
        return this.highlightNodes();   
    }

    //to highlight nodes where AVAILABLE GOATS can be placed
    highlightNodes(){
        let possibleNodes = [];
        if(this.turn === 1){
            for(let i = 0; i<5; i++){
                for(let j = 0; j< 5; j++){
                    if(this.board[i][j]===null){
                        possibleNodes.push(i*5+j);
                    }
                }
            }
        }
        this.prevSuggestions = possibleNodes;
        return [[],possibleNodes,[]];
    }
    

    highlightPath(pos,chkTigerValidMoves = false){
        //if there's no goat or tiger at POS there's no need of highlighting path
        if(this.board[Math.floor(pos/5)][pos%5] === null) return [[],[]];

        // return parameters
        let possiblePaths = [];
        let possibleNodes = [];
        let endangeredGoats = [];

        //helpers
        let possibleMoves = [];
        if(pos%2 ===0){ 
            possibleMoves = [
                [pos-1,pos+1],              //       left        right
                [pos+5,pos+5-1,pos+5+1],    //top    top-left    top-right
                [pos-5,pos-5-1,pos-5+1],    //bottom bottom-left bottom-right
            ];
        }else{
            possibleMoves = [  
                [pos-1,pos+1],
                [pos+5],
                [pos-5]
            ];
        }

        //helpers
        let impossible= [
            [0,5,10,15,20],           // no path (from) this array of nodes
            [4,9,14,19,24]            //         ( to ) this array of nodes
        ]
        const pathNotExists = (pos,point)=>{
            return (impossible[0].includes(pos) && impossible[1].includes(point)) || (impossible[0].includes(point) && impossible[1].includes(pos))
        }
        const isInBoard = (pos)=>{
            return (Number(pos) >= 0 && Number(pos) <= 24)
        }

        //now we find possiblePaths and PossibleNodes
        for(let i in possibleMoves){
            for(let j in possibleMoves[i]){
                let point = possibleMoves[i][j];
                
                if(pathNotExists(pos,point)) continue;

                if(isInBoard(point)){
                    if(this.board[Math.floor(point/5)][point%5] ===null){
                        possibleNodes.push(point);
                        (pos<point)? possiblePaths.push(`${pos}-${point}`) : possiblePaths.push(`${point}-${pos}`);
                    }else{
                        //if it is tigers turn or we are checking valid moves using this.checkValidMovesTigers()
                        //then tigers can hop over a goat while capturing it
                        if((this.turn === 0 || chkTigerValidMoves)  && this.board[Math.floor(point/5)][point%5] === 1){

                            let goatPos = point;

                            //helper function
                            const updatePathWithJumps = (possibleJumps)=>{ 
                                for(let i in possibleJumps){
                                    let point1 = possibleJumps[i];
                                     
                                    if(pathNotExists(pos,point1)) continue;


                                    if(isInBoard(point1)){
                                        // if(pathNotExists(goatPos,point1)) continue;
                                        //if there's empty pos then the tiger can jump to capture
                                        if(this.board[Math.floor(point1/5)][point1%5] ===null){

                                            if(pathNotExists(goatPos,point1)) continue;

                                            possibleNodes.push(point1);
                                            // possibleNodes.push(goatPos);
                                            //path from pos to goatPos
                                            (pos<goatPos)? possiblePaths.push(`${pos}-${goatPos}`) : possiblePaths.push(`${goatPos}-${pos}`);
                                            //path from goatPos to point1
                                            (goatPos<point1)? possiblePaths.push(`${goatPos}-${point1}`) : possiblePaths.push(`${point1}-${goatPos}`);
        
                                            //show that the goat in middle is in danger
                                            endangeredGoats.push(goatPos);
                                        }
                                    }
                                }
                            }
                            
                            let possibleJumps = [];
                            switch(Number(i)){
                                case 0:
                                    possibleJumps = [goatPos-1,goatPos+1];
                                    updatePathWithJumps(possibleJumps);
                                    break;
                                case 1:
                                    if(pos%2 === 0){
                                        possibleJumps = [goatPos+5,goatPos+5-1,goatPos+5+1]
                                    }else{
                                        possibleJumps = [goatPos+5]
                                    }
                                    
                                    possibleJumps = [possibleJumps[j]];
                                    updatePathWithJumps(possibleJumps);
                                    break;

                                case 2:  
                                    if(pos%2 === 0){
                                        possibleJumps = [goatPos-5,goatPos-5-1,goatPos-5+1]
                                    }else{
                                        possibleJumps = [goatPos-5]
                                    }
                                    possibleJumps = [possibleJumps[j]];
                                    updatePathWithJumps(possibleJumps);
                                    break;
                                default:
                            }
                        }        
                    }
                }
            }
        }
        this.prevSelection = pos;
        this.prevSuggestions = possibleNodes;
        return [possiblePaths,possibleNodes,endangeredGoats];
    }

    hasAvailableGoats(){
        return this.goats.available.length ? true : false;
    }

    updateWithGoat(pos){

        //if goats are available for insertion in Nodes simply put them
        //else (if there are goats on board) then move them         
        if(this.hasAvailableGoats()){
            //if user presses elsewhere from where he was suggested
            if(!this.prevSuggestions.includes(pos)) return [[],this.prevSuggestions,[]];
    
            //putting goat on the board
            let elem = document.createElement('div');
            elem.classList.add('goat',`goat-${pos}`);
            elem.style.marginTop = `${Math.floor(pos/5)*8}rem`;
            elem.style.marginLeft = `${(pos%5)*8}rem`;
            elem.style.zIndex = 1;
            this.parent.appendChild(elem);
    
            //updating this.board
            this.board[Math.floor(pos/5)][Math.floor(pos%5)] = 1;
    
            //updating this.goats
            this.goats.onBoard.push(this.goats.available.pop());
            this.goats.pos.push(pos);

        }else{
            if(this.goats.onBoard.length){
                //cancel suggestions
                if(this.prevSelection === pos || !this.prevSuggestions.includes(pos)){
                    this.prevSuggestions = [];
                    this.prevSelection = -1;                
                    return [[],[],[]];
                }

                //updating this.board
                this.board[Math.floor(pos/5)][pos%5] = 1;
                this.board[Math.floor(this.prevSelection/5)][this.prevSelection%5] = null;

                //updating DOM    
                let goat1 = document.querySelector(`.goat-${this.prevSelection}`);
                goat1.style.marginLeft = `${(pos%5)*8}rem`;
                goat1.style.marginTop =`${Math.floor(pos/5)*8}rem` ;

                //updating this.goat.pos
                this.goats.pos.splice(this.goats.pos.indexOf(this.prevSelection),1);
                this.goats.pos.push(pos);
         
                // then you rename the class
                goat1.classList.remove(`goat-${this.prevSelection}`);
                goat1.classList.add(`goat-${pos}`);
            }
        }

        //checking for trapped tigers
        this.computeValidMovesTigers();
        
        this.prevSuggestions = [];
        this.prevSelection = -1;
        this.turn = 0;               // toggle turns

        return [[],[],[]]; // highlightedNodes disappear
    }

    updateWithTiger(pos){
        //cancel suggestions if user click where he previously clicked
        if(this.prevSelection === pos || !this.prevSuggestions.includes(pos)){
            this.prevSuggestions = [];
            this.prevSelection = -1;
            return [[],[],[]];
        }
        
        //updating this.board
        this.board[Math.floor(pos/5)][pos%5] = 0;
        this.board[Math.floor(this.prevSelection/5)][this.prevSelection%5] = null;
        

        let tiger1 = document.querySelector(`.tiger-${this.prevSelection}`);
        //normal movement
        let factor1 = Math.abs(this.prevSelection-pos) ;
        let factor2 = Math.abs(pos - this.prevSelection);

        
        //*****straight movement*****          ********diagonal movement******

        if(factor1 === 1 || factor2 === 5 || factor1 === 4 || factor2 === 6){             // normal manuevering movements
            tiger1.style.marginLeft = `${(pos%5)*8}rem`;
            tiger1.style.marginTop =`${Math.floor(pos/5)*8}rem` ;

        }else if(factor1 === 2 || factor2 === 10 || factor1 === 8 || factor2 === 12){    //jump to capture movement           
            tiger1.style.marginLeft = `${(pos%5)*8}rem`;
            tiger1.style.marginTop =`${Math.floor(pos/5)*8}rem` ;

            //removing the captured goat
            let removePos = -1;
            if(factor1 === 2){                          //straight capture
                if(pos > this.prevSelection){
                    removePos = pos-1;
                }else{
                    removePos = pos+1;
                }
            }else if(factor2 === 10){                   //straight capture
                if(pos > this.prevSelection){
                    removePos = pos-5;
                }else{
                    removePos = pos+5;
                }
            }else if(factor1 === 8){                     //diagonal capture
                if(pos > this.prevSelection){
                    removePos = pos-4;
                }else{
                    removePos = pos+4;
                }
            }else{
                if(pos > this.prevSelection){           //diagonal capture
                    removePos = pos-6;
                }else{
                    removePos = pos+6;
                }

            }
            
            let removeEle = document.querySelector(`.goat-${removePos}`);
            this.parent.removeChild(removeEle);
            this.goats.eaten.push(this.goats.onBoard.pop());
            this.board[Math.floor(removePos/5)][removePos%5] = null; 
            
            //updating this.goats.pos
            this.goats.pos.splice(this.goats.pos.indexOf(removePos),1);

        }

        //updating this.tigers.pos
        this.tigers.pos.splice(this.tigers.pos.indexOf(this.prevSelection),1);
        this.tigers.pos.push(pos);
         
        // then you rename the class
        tiger1.classList.remove(`tiger-${this.prevSelection}`);
        tiger1.classList.add(`tiger-${pos}`);
         
        //checking for trapped tigers
        this.computeValidMovesTigers();

        this.prevSuggestions = [];
        this.prevSelection = -1;
        this.turn = 1;

        return [[],[],[]];
    }

    computeValidMovesTigers(){
        // clearing previous valid moves
        this.tigers.validMoves = [];
        // calculating new valid moves
        for(let i in this.tigers.pos){
            // highlight path return [[Path],[Nodes],[dangerPos]]
            let tempArr = this.highlightPath(this.tigers['pos'][i],true);
            // tempArr[1].lenght === 0 means there are no valid moves left for that tigers
            // i.e it is trapped
            this.tigers['trapStatus'][i] = tempArr[1].length ? 0 : 1;
    
            this.tigers.validMoves.push(tempArr[1])
        }
    }
    
    computeValidMovesGoats(){
        this.goats.validMoves = [];
        for(let i in this.goats.pos){
            //highlight path return [[Path],[Nodes],[dangerPos]]
            let tempArr = this.highlightPath(this.goats['pos'][i],true);
            this.goats.validMoves.push(tempArr[1])
        }
    }

    // getValidMovesTigers(){
    //     let arr = [];
    //     for(let i in this.tigers.pos){
            
    //     }
    //     for(let i in this.goats.pos){

    //     }
    // }
}

export default Baghchal;