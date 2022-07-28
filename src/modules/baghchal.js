
class Baghchal{
    parent;
    board;
    tigers;
    goats;
    turn;

    prevSelection;                          // where user previously clicked to move the piece
    prevSuggestions;                        // where user was suggested to move to 

    moveHistory;


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
            trapStatus  : [0,0,0,0],                         // 1 means trapped  and 0 means not trapped
            friendlyTrap : [0,0,0,0],
            pos         : [0,4,20,24],                              // tigers spawn at four corners of the board
            validMoves  : []

        };
        this.goats = {
            available   : Array.from(Array(20).keys()),      // 20 goats in total
            onBoard     : [],
            pos         : [],
            eaten       : [],                                 // 0 goats eaten/captured at the beginning
            validMoves  : [],
            endangered  : [],
        };
    
        this.turn = 1;                                      // 1 means goat
        this.prevSelection = -1;                            // no selection at the beginning
        this.prevSuggestions = [];  
        this.moveHistory = [];                           
    }

    setParent(){
        this.parent = document.querySelector(".canvas-container-inner");
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
        if(this.goats.eaten.length === 5 ) return 1;
        //if it is goat's turn and there are no valid moves
        if(this.goats.validMoves.length === 0 && this.turn ) return 2;
        if(this.tigers.trapStatus.reduce((a,b)=>a+b) === 4) return 3;
        return 0;   
    }

    wasPreviousSelection(pos){
        return this.prevSelection === pos;
    }
    
    startGame(){

        //removing tigers and goats of previous game if any   
        this.parent = document.querySelector(".canvas-container-inner");
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

        //get valid moves of goats and tigers
        this.getValidMoves();

        return this.highlightNodes();   
    }

    //to highlight nodes where AVAILABLE GOATS can be placed
    highlightNodes(computingValidMoves = false){
        let possibleNodes = [];
        if(this.turn === 1 || computingValidMoves){
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
                [pos+5,pos+5-1,pos+5+1],    //bottom bottom-left bottom-right
                [pos-5,pos-5-1,pos-5+1],    //top    top-left    top-right
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

                                            if(chkTigerValidMoves){
                                                possibleNodes.push(`X-${goatPos}-${point1}`);
                                            }else{
                                                possibleNodes.push(point1);
                                            }

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
                                    break;
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
            elem.style.marginTop = `${Math.floor(pos/5)*21.5}%`;
            elem.style.marginLeft = `${(pos%5)*21.5}%`;
                
            elem.style.zIndex = 1;
            this.parent.appendChild(elem);
    
            //updating this.board
            this.board[Math.floor(pos/5)][Math.floor(pos%5)] = 1;
    
            //updating this.goats
            this.goats.onBoard.push(this.goats.available.pop());
            this.goats.pos.push(pos);

            //updating moveHistory
            this.moveHistory.push(`g-${pos}`);

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
                goat1.style.marginLeft = `${(pos%5)*21.5}%`;
                goat1.style.marginTop =`${Math.floor(pos/5)*21.5}%`;

                //updating this.goat.pos
                this.goats.pos.splice(this.goats.pos.indexOf(this.prevSelection),1);
                this.goats.pos.push(pos);
         
                // then you rename the class
                goat1.classList.remove(`goat-${this.prevSelection}`);
                goat1.classList.add(`goat-${pos}`);
                
                //updating moveHistory
                this.moveHistory.push(`g-${this.prevSelection}-${pos}`);
            }
        }

        this.computeValidMovesTigers();
        this.computeValidMovesGoats();
        
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
            tiger1.style.marginLeft = `${(pos%5)*21.5}%`;
            tiger1.style.marginTop =`${Math.floor(pos/5)*21.5}%`;
            //updating moveHistory
            this.moveHistory.push(`t-${this.prevSelection}-${pos}`);

        }else if(factor1 === 2 || factor2 === 10 || factor1 === 8 || factor2 === 12){    //jump to capture movement           
            tiger1.style.marginLeft = `${(pos%5)*21.5}%`;
            tiger1.style.marginTop =`${Math.floor(pos/5)*21.5}%`;

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
            //updating this.board
            this.board[Math.floor(removePos/5)][removePos%5] = null; 
            //updating this.goats
            this.goats.eaten.push(this.goats.onBoard.pop());
            this.goats.pos.splice(this.goats.pos.indexOf(removePos),1);

            //updating moveHistory
            this.moveHistory.push(`t-${this.prevSelection}-X-${removePos}-${pos}`);

        }

        //updating this.tigers
        this.tigers.pos.splice(this.tigers.pos.indexOf(this.prevSelection),1);
        this.tigers.pos.push(pos);
         
        // then you rename the class
        tiger1.classList.remove(`tiger-${this.prevSelection}`);
        tiger1.classList.add(`tiger-${pos}`);

        this.computeValidMovesGoats();
        this.computeValidMovesTigers();
         
        this.prevSuggestions = [];
        this.prevSelection = -1;
        this.turn = 1;

        return [[],[],[]];
    }

    getValidMoves(){
        
        this.computeValidMovesGoats();
        this.computeValidMovesTigers();
        //for goats
        if(this.turn){
            return this.goats.validMoves;
        }else{
            return this.tigers.validMoves;
        }
    }

    computeValidMovesTigers(){
        // clearing previous valid moves
        this.tigers.validMoves = [];
        this.tigers.friendlyTrap = [];
        this.goats.endangered = [];
        // calculating new valid moves
        for(let i in this.tigers.pos){
            // highlight path return [[Path],[Nodes],[dangerPos]]
            let tempArr = this.highlightPath(this.tigers['pos'][i],true);
            // tempArr[1].lenght === 0 means there are no valid moves left for that tigers
            // i.e it is trapped
            this.tigers['trapStatus'][i] = tempArr[1].length ? 0 : 1;
        
            if(tempArr[2].length){
                this.goats['endangered'].push(...tempArr[2]);
            }

            //writing in proper format
            let moves =  tempArr[1].map((move)=>`t-${this.tigers['pos'][i]}-${move}`)
            this.tigers.validMoves.push(...moves)
        }
        //now checking for friendly traps
        for(let i = 0; i< 4 ; i++){
            if(this.tigers['trapStatus'][i]===1){
                let checkPos = this.getNeighbours(this.tigers['pos'][i],1);
                
                let trapStatus = 1;
                for(let index in checkPos){
                    let pos1 = checkPos[index];
                    if(this.board[Math.floor(pos1/5)][pos1%5] === 0){
                        let nearbyTigerPos = this.tigers['pos'].indexOf(pos1);
                        if(this.tigers['friendlyTrap'][this.tigers['pos'].indexOf(nearbyTigerPos)] === 1 ) continue;
                        //if the nearbyTiger is not trapped then the tiger at "pos" is friendly trapped
                        if(this.tigers['trapStatus'][nearbyTigerPos]){
                            trapStatus = 0;
                        }else{
                            trapStatus = 1;
                        }
                    }
                }
                this.tigers['friendlyTrap'][i] = trapStatus;
            }else{
                this.tigers['friendlyTrap'][i] = 0;
            }
        }
    }
 
    computeValidMovesGoats(){
        this.goats.validMoves = [];
        if(this.goats.available.length){
            let tempArr = this.highlightNodes(true);
            let moves = tempArr[1].map((move)=>`g-${move}`);
            this.goats.validMoves.push(...moves);
        }else{
            for(let i in this.goats.pos){
                let tempArr = this.highlightPath(this.goats['pos'][i],false);
                
                let moves = tempArr[1].map((move)=>`g-${this.goats['pos'][i]}-${move}`)
                this.goats.validMoves.push(...moves);
            }
        }
    }

    makeMove(move){
        // [turn,from,X,deletePos,to]
        let tempArr = move.split('-');
        let [from,to] = [Number(tempArr[1]),Number(tempArr[tempArr.length - 1])];
        let enumTurn = {
            'g':1,
            't':0
        }

        //updating this.board
        this.board[Math.floor(from/5)][from%5] = null;
        this.board[Math.floor(to/5)][to%5] = enumTurn[tempArr[0]];

        //updating this.tigers and this.goats

        if(from === to){ // goats are available and are being placed on board
            this.goats.onBoard.push(this.goats.available.pop());
            this.goats.pos.push(from);


        //goats and tigers are maneuvering
        }else{
            
            //normal maneuvering
            if(enumTurn[tempArr[0]]){
                this.goats.pos.splice(this.goats.pos.indexOf(from),1);
                this.goats.pos.push(to);
            }else{
                this.tigers.pos.splice(this.tigers.pos.indexOf(from),1);
                this.tigers.pos.push(to);
            }

            //removing middle goat when tigers jumps to capture
            if(tempArr.length > 3){
                let deletePos = Number(tempArr[3]);
                this.board[Math.floor(deletePos/5)][deletePos%5] = null;
                // updating this.goats
                this.goats.eaten.push(this.goats.onBoard.pop());
                this.goats.pos.splice(this.goats.pos.indexOf(deletePos),1);
                this.goats.endangered.splice(this.goats.pos.indexOf(deletePos),1);
            }  
        }
        this.turn = Number(!enumTurn[tempArr[0]]);

        //updating moveHistory
        this.moveHistory.push(move)
    }
    
    
    
    undoMove(move){
        // [turn,from,X,deletePos,to]
        let tempArr = move.split('-');
        let [from,to] = [Number(tempArr[1]),Number(tempArr[tempArr.length - 1])];
        let enumTurn = {
            'g':1,
            't':0
        }
        //updating this.board
        this.board[Math.floor(from/5)][from%5] = enumTurn[tempArr[0]];
        this.board[Math.floor(to/5)][to%5] = null;


        //updating this.goats
        if(from === to){ 
            this.goats.available.push(this.goats.onBoard.pop());
            this.goats.pos.splice(this.goats.pos.indexOf(from),1);
            //goats and tigers are maneuvering
        }else{
            
            //normal maneuvering
            if(enumTurn[tempArr[0]]){
                this.goats.pos.splice(this.goats.pos.indexOf(to),1);
                this.goats.pos.push(from);
            }else{
                this.tigers.pos.splice(this.tigers.pos.indexOf(to),1);
                this.tigers.pos.push(from);
            }
            
            //removing middle goat when tigers jumps to capture
            if(tempArr.length > 3){
                let deletePos = Number(tempArr[3]);
                this.board[Math.floor(deletePos/5)][deletePos%5] = 1;
                // updating this.goats
                this.goats.onBoard.push(this.goats.eaten.pop());
                this.goats.pos.push(deletePos);
                this.goats.endangered.splice(this.goats.endangered.indexOf(deletePos),1);    
            }
        }
        //updating moveHistory
        this.moveHistory.splice(this.moveHistory.lastIndexOf(move),1);    
    }

    //  spread opreator creates a new array
    // this way we don't send a mutated array(reacted doesn't detect it)
    // instead a new array is sent and react can detected change
    
    getMoveHistory(){
        return [...this.moveHistory];
    }

    showBoard(){
        console.log(this.board);
    }

    


    checkRepetition(depth=3){
        if(depth === 15) return 0;
    
        let startSplitAdd = this.moveHistory.length - depth * 4 ;
        let arr1 = this.moveHistory.slice(startSplitAdd,startSplitAdd+depth*2);
        let arr2 = this.moveHistory.slice(startSplitAdd+depth*2);

        // if moves happen in unidirectional cycles
        if(JSON.stringify(arr1) === JSON.stringify(arr2)){
            return 1;
        }

        // for the moves that pulsate
    
        //every element must have length 3 for them to normally maneuver
        //or else the game state will change due to (goat capture t-1-X-2-3 or goat placement g-1 )
        if((!arr1.every((elem)=>elem.split('-').length===3) || !arr2.every((elem)=>elem.split('-').length===3) )){  
            return 0;
        }
    
        let finalPos = arr2.length-1;
        for(let i = 0; i < (finalPos)/2; i = i + 2){
            [arr2[i],arr2[finalPos-i-1]] = [arr2[finalPos-i-1],arr2[i]];
            [arr2[i+1],arr2[finalPos-i]] = [arr2[finalPos-i],arr2[i+1]];
        }
        arr2 = arr2.map(elem => {
            let tempArr = elem.split('-');
            [tempArr[1],tempArr[tempArr.length-1]] = [tempArr[tempArr.length-1],tempArr[1]];
            return tempArr.join('-');
        })
    
        if(JSON.stringify(arr1)===JSON.stringify(arr2)){
            return depth;
        }else{
            return this.checkRepetition(depth+1);
        }   
    }

    //evaluation function for minMax
    //goat is the maximizing player
    scoreBoard(){
        let score = 0;

        let noOfTrapped = this.tigers.trapStatus.reduce((a,b)=>a+b);
        let friendlyTrapCount = this.tigers.friendlyTrap.reduce((a,b)=>a+b);

        if(this.isOver()){
            
            switch(this.isOver()){
                //tigers win
                case 1:
                case 2:
                    score = -1000;
                    break;
                //goats win
                case 3: 
                    score = 1000;
                    break;
                default:
                    break;
            }
        }else if(this.checkRepetition()){
            let tempArr = this.countInaccessible();
            
            // this.turn === 1 means it was tigers turn previously
            if(this.turn){

                // if other tigers are trapped then go for the draw
                if((noOfTrapped - friendlyTrapCount) >= 2 && ((this.goats.eaten.length - tempArr[0]) < 2 )){
                    score = -1000;
                }else{
                    score = score + 700;
                }   
            }else{
                // if 3 or more goats are eaten then go for the draw
                // goats eaten - inaccessible to tigers
                if(this.goats.eaten.length - tempArr[0] >= 3 && (noOfTrapped-friendlyTrapCount) <= 2){
                    score = 1000;
                }else{
                    score = score - 700;
                }
            }
        }else{

            //reward the trap only if no goats are endangered
            if(!this.goats.endangered.length){
                if(friendlyTrapCount === noOfTrapped){
                    score = score + noOfTrapped * 100;
                }else{
                    score = score +   noOfTrapped * 250;
                }
            }else{
                score = score + noOfTrapped * 10;
            }
            //accounting the inaccessible position for goats and tigers in the score
            if(this.goats.onBoard.length >= 8){
                //inaccessibleToTigers
                let noAccTigers = this.countInaccessible(0);
                //if a goat was not sacrificed for it then inaccessible positions to tigers aren't rewarded
                if(this.moveHistory[this.moveHistory.length-1].split('-').length !== 4 && !this.goats.endangered.length){
                    score = score + 200 * noAccTigers;          
                }else{
                    score = score + 50 * noAccTigers;
                }

                if(this.goats.onBoard.length >= 18){
                    score = score - 150 * this.countInaccessible(1);
                    //friendly traps are highliy favourable when
                    //no goats are eaten
                    //or noOfEatenGoats == noOfPositionsUnfavourable for tigers
                    if(!this.goats.eaten.length || !this.goats.endangered.length){
                        score += friendlyTrapCount * 20;
                    }
                    this.computeValidMovesTigers();
                    
                    if(this.tigers.validMoves.length <= 2){
                        score -= 50;
                    }
                }         
            }
            
                
            
            score = score -  this.goats.eaten.length * 200;
            if(this.goats.onBoard >= 17  && this.goats.eaten.length <= 2){
                score = score -   70 * this.goats.endangered.length ;
            }else{
                score = score - 40 * this.goats.endangered.length;
            }
        }
        return score;
    }

    //counts no. of positions where tigers or goats cannot move to
    // player 1 is goat and 0 is tiger
    countInaccessible(evalPlayer){

        //[[positions],[evaluations],[dependents]]
      let evaluatedPosTigers = [[],[],[]];
      let evaluatedPosGoats = [[],[],[]]
      for(let i = 0; i < 5 ; i++){
        for(let j = 0 ; j < 5 ; j++){
            if(evalPlayer){
                if(this.board[i][j]=== null && !evaluatedPosGoats[0].includes(i*5+j)){
                    this.evaluateGoats(i*5+j,evaluatedPosGoats);
                }
            }else{
                if(this.board[i][j]=== null && !evaluatedPosTigers[0].includes(i*5+j)){
                    this.evaluateTigerInaccessible(i*5+j,evaluatedPosTigers);  
                }
            }
        }
      }
      let unreachable = 0;
      if(evalPlayer){
        unreachable = evaluatedPosGoats[1].reduce( (a,b) => Number(a)+Number(b));
      }else{
        unreachable = evaluatedPosTigers[1].reduce( (a,b) => Number(a)+Number(b));
      }
      return unreachable;
    }
  
    //evaluate position where goats cannot move to
   evaluateGoats(pos,evaluatedPos){
        let possibleChecks = this.getNeighbours(pos,1);
        let verdict = true;
        for(let position in possibleChecks){
            let pos1 = possibleChecks[position]
            let boardElem = this.board[Math.floor(pos1/5)][pos1 %5] ; 
            if( boardElem === 0 ) continue;
            if(boardElem === 1){
                evaluatedPos[0].push(pos1);
                evaluatedPos[1].push(false);
                return false;
            }
            if(boardElem === null && !evaluatedPos[2].includes(pos1)){
                if(evaluatedPos[0].includes(pos1)){
                    verdict =  evaluatedPos[1][evaluatedPos[0].indexOf(pos1)]
                }
                if(evaluatedPos[2].includes(pos1)){
                    continue;
                }else{
                    evaluatedPos[2].push(pos);
                    verdict = this.evaluateGoats(pos1,evaluatedPos);
                    evaluatedPos[2].pop();
                }
            }
            
        }
        if(!verdict){
            evaluatedPos[0].push(pos);
            evaluatedPos[1].push(false);
            return false;
        }

        evaluatedPos[0].push(pos);
        evaluatedPos[1].push(true);
        return true;
    };



    //evaluate position where tigers cannot move to
    evaluateTigers(pos,evaluatedPos){
  
      let possibleChecks = this.getNeighbours(pos,2);
      
  
      for( let dir in possibleChecks ){
          //if both positions in the direction (dir) are inaccessible 
          //verdict is true
          let verdict = true;
          for( let i in possibleChecks[dir]){
              let pos1 = possibleChecks[dir][i];
              let boardElem = this.board[Math.floor(pos1/5)][pos1%5];
              if(boardElem === 1) continue;
              if(boardElem === 0){
                  evaluatedPos[0].push(pos);
                  evaluatedPos[1].push(false);
                  return false;
              } 
              if(boardElem === null && !evaluatedPos[2].includes(pos)){
                  if(evaluatedPos[0].includes(pos1)){
                      verdict = evaluatedPos[1][evaluatedPos[0].indexOf(pos1)]
                  }
                  if(evaluatedPos[2].includes(pos1)){
                      continue;
                  }else{
                      //accessiblility of pos now depends on the accessibility of pos1
                      evaluatedPos[2].push(pos);
                      verdict = this.evaluateTigers(pos1,evaluatedPos);
                      evaluatedPos[2].pop();
                  }
              } 
          }
          if(!verdict){
              evaluatedPos[0].push(pos);
              evaluatedPos[1].push(false);
              return false;
          } 
      }
  
      //if all neighbouring positions are inaccessible then the pos is inaccessible too
      evaluatedPos[0].push(pos);
      evaluatedPos[1].push(true);
      return true;
  
    }

    evaluateTigerInaccessible(pos,evaluatedPos){
        let possibleChecks = this.getNeighbours(pos,2);
        let adjNeighbours = possibleChecks.map(ele => ele[0]);
        let inAccessible = true;
        inAccessible = adjNeighbours.every( (pos,index) =>{
            let playerAtPos = this.board[Math.floor(pos/5)][pos%5];
            if( playerAtPos === 1 && !this.goats.endangered.includes(pos)){
                if(possibleChecks[index].length === 2){
                    let pos1 = possibleChecks[index][1];
                    let playerAtJumpPos = this.board[Math.floor(pos1/5)][pos1%5];
                    if(playerAtJumpPos !== 0){
                        return true;
                    }else{
                        return false;
                    }
                }
                return true;
            }else{
                return false;
            }
        });
        evaluatedPos[0].push(pos);
        evaluatedPos[1].push(inAccessible);
    }

    
    getNeighbours(pos,depth=1){
        let possibleMoves = [];
        if(pos%2 ===0){ 
            possibleMoves = [
                [pos-1,pos+1],              //       left        right
                [pos+5,pos+5-1,pos+5+1],    //bottom bottom-left bottom-right
                [pos-5,pos-5-1,pos-5+1],    //top    top-left    top-right
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
        
        for(let i in possibleMoves){
            possibleMoves[i] = possibleMoves[i].filter(pos1 =>{
                let test1 = isInBoard(pos1);
                let test2 = pathNotExists(pos1,pos);
                return test1 && !test2;
            })
        }
        possibleMoves = possibleMoves.reduce((a,b) => [...a,...b]);
        if(depth===2){
            const pairSimilar = (pos,pos1)=>{
                let factor = pos1 - pos;
                let pair = pos1 + factor;
                if(isInBoard(pair) && !pathNotExists(pos1,pair)){
                    return [pos1,pair];
                }else{
                    return [pos1]
                }
            }
            possibleMoves = possibleMoves.map(a => pairSimilar(pos,a));
        }
        return possibleMoves;
    }
}

export default Baghchal;