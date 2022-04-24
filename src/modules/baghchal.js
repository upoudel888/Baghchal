
class Baghchal{
    parent;
    board;
    tigers;
    goats;
    turn;

    prevSelection;                          // where user previously clicked to move the piece
    prevSuggestions;                        //where user was suggested to move to 

    constructor(){
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
            pos : [0,4,20,24],       // tigers spawn at four corners of the board
            trapStatus : [1,1,1,1]   //1 means not trapped  and 0 means trapped
        };
        this.goats = {
            available: Array.from(Array(25).keys()),      // 24 goats in total
            onBoard  : [],
            eaten    : []                                 // 0 goats eaten/captured at the beginning
        };

        this.turn = 1;                                    // no selection at the beginning
        this.prevSelection = -1;
        this.prevSuggestions = [];                          
    }

    setParent(){
        this.parent = document.querySelector(".canvas-container");
    }
    //if all goats are eaten or if all tigers are trapped
    isGameOver(){
        return this.goats.eaten.length === 20 || this.tigers.trapStatus.every(stat => stat===0)
    }

    getTurnStatus(){
        return this.turn;
    }

    isShowingSuggestions(){
        return this.prevSuggestions.length ? true : false;
    }

    hasAvailableGoats(){
        return this.goats.available.length ? true : false;
    }

    hasTigerAt(pos){
        return this.board[Math.floor(pos/5)][pos%5] === 0;
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
        return possibleNodes;
    }

    startGame(){

        this.parent = document.querySelector(".canvas-container");

        //initializing 4 tigers on four corners of the board
        let elem = document.createElement('div');
        elem.textContent = 'T';
        elem.classList.add('tiger','tiger-0');
        this.parent.appendChild(elem);
        document.querySelector('.Node-0').style.zIndex = 2; //onClick is on Nodes only not on tigers
        document.querySelector('.Node-0').style.opacity = 0; //onClick is on Nodes only not on tigers
        
        elem = document.createElement('div');
        elem.textContent = 'T';
        elem.classList.add('tiger','tiger-4');
        this.parent.appendChild(elem);
        document.querySelector('.Node-4').style.zIndex = 2;
        document.querySelector('.Node-4').style.opacity = 0;
        
        
        elem = document.createElement('div');
        elem.textContent = 'T';
        elem.classList.add('tiger','tiger-20');
        this.parent.appendChild(elem);
        document.querySelector('.Node-20').style.zIndex = 2;
        document.querySelector('.Node-20').style.opacity = 0;
        
        
        elem = document.createElement('div');
        elem.textContent = 'T';
        elem.classList.add('tiger','tiger-24');
        this.parent.appendChild(elem);
        document.querySelector('.Node-24').style.zIndex = 2;
        document.querySelector('.Node-24').style.opacity = 0;

        return this.highlightNodes();   
    }

    

    highlightPath(pos){
        console.log(this.board);
        //if there's no goat or tiger at POS there's no need of highlighting path
        if(this.board[Math.floor(pos/5)][pos%5] === null) return [[],[]];

        // return params
        let possiblePaths = [];
        let possibleNodes = [pos];

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
            [4,9,14,19,24]            //         (to  ) this array of nodes
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
                        //if it is tigers turn then tigers can hop over a goat while capturing it
                        if(this.turn === 0 && this.board[Math.floor(point/5)][point%5] !== 0){
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
                                            possibleNodes.push(point1);
                                            possibleNodes.push(goatPos);
                                            //path from pos to goatPos
                                            (pos<goatPos)? possiblePaths.push(`${pos}-${goatPos}`) : possiblePaths.push(`${goatPos}-${pos}`);
                                            //path from goatPos to point1
                                            (goatPos<point1)? possiblePaths.push(`${goatPos}-${point1}`) : possiblePaths.push(`${point1}-${goatPos}`);
        
                                            //show that the goat in middle is in danger
                                            document.querySelector(`.goat-${goatPos}`).classList.add('highlight-danger');
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
        console.log(this.prevSuggestions);
        return [possiblePaths,possibleNodes];
    }


    updateWithGoat(pos){
        //if user presses elsewhere from where he was suggested
        if(!this.prevSuggestions.includes(pos)) return this.prevSuggestions;

        //putting goat on the board
        let elem = document.createElement('div');
        elem.textContent = 'G';
        elem.classList.add('goat',`goat-${pos}`);
        elem.style.marginTop = `${Math.floor(pos/5)*8}rem`;
        elem.style.marginLeft = `${(pos%5)*8}rem`;
        this.parent.appendChild(elem);

        //updating this.board
        this.board[Math.floor(pos/5)][Math.floor(pos%5)] = 1;

        //updating this.goats
        this.goats.onBoard.push(this.goats.available.pop());
        
        this.prevSuggestions = [];
        this.turn = 0;               // toggle turns
        return this.prevSuggestions; // highlightedNodes disappear
    }

    updateWithTiger(pos){
        

        //cancel suggestions
        if(this.prevSelection === pos || !this.prevSuggestions.includes(pos)){
            this.prevSuggestions = [];
            this.prevSelection = -1;
            let goatsInDanger = document.querySelectorAll('.highlight-danger');
            if(goatsInDanger){
                goatsInDanger.forEach(goat => goat.classList.remove('highlight-danger'));
            }
            return [[],[]];
        }
        

        //updating this.board
        this.board[Math.floor(pos/5)][pos%5] = 0;
        this.board[Math.floor(this.prevSelection/5)][this.prevSelection%5] = null;
        

        let tiger1 = document.querySelector(`.tiger-${this.prevSelection}`);

        //*****linear movement*****
           
        //normal movement
        let factor1 = Math.abs(this.prevSelection-pos) ;
        let factor2 = Math.abs(pos - this.prevSelection);

        if(factor1 === 1 || factor2 === 5){
            tiger1.style.marginLeft = `${(pos%5)*8}rem`;
            tiger1.style.marginTop =`${Math.floor(pos/5)*8}rem` ;

            //if user decides not to capture the goat 
            let goatsInDanger = document.querySelectorAll('.highlight-danger');
            if(goatsInDanger){
                goatsInDanger.forEach(goat => goat.classList.remove('highlight-danger'));
            }
        
                   // left-right      up-down       jump
        }else if(factor1 === 2 || factor2 === 10){    //jump to capture movement
            tiger1.style.marginLeft = `${(pos%5)*8}rem`;
            tiger1.style.marginTop =`${Math.floor(pos/5)*8}rem` ;

            //removing the captured goat
            
            let removePos = -1;
            if(factor1 === 2){
                if(pos > this.prevSelection){
                    removePos = pos-1;
                }else{
                    removePos = pos+1;
                }
            }
            if(factor2 === 10){
                if(pos > this.prevSelection){
                    removePos = pos-5;
                }else{
                    removePos = pos+5;
                }
            }
            let removeEle = document.querySelector(`.goat-${removePos}`);
            this.parent.removeChild(removeEle);
            this.goats.eaten.push(this.goats.onBoard.pop());
            this.board[Math.floor(removePos/5)][removePos%5] = null;

        //****digonal movement */    
        }else{ 
            tiger1.style.marginLeft = `${(pos%5)*8}rem`;
            tiger1.style.marginTop =`${Math.floor(pos/5)*8}rem` ;
        }
        //animation runs here
        // then you rename the class
        tiger1.classList.remove(`tiger-${this.prevSelection}`);
        tiger1.classList.add(`tiger-${pos}`);
        document.querySelector(`.Node-${pos}`).style.zIndex =2; 
        document.querySelector(`.Node-${pos}`).style.opacity =0; 
        //the you resize the node
        document.querySelector(`.Node-${this.prevSelection}`).style.zIndex =1; 
        document.querySelector(`.Node-${this.prevSelection}`).style.opacity =1; 

        this.prevSuggestions = [];
        this.prevSelection = -1;

        this.turn = 1;

        return [[],[]];
    }



}

export default Baghchal;