import _ from 'lodash';
var move = null;
function findBestMove(game){
    let gs = _.cloneDeep(game);
    move = null;
    let validArr = gs.getValidMoves();
    findMoveMinMax(gs,validArr,4);
    return move
}

var score    = null;
function findMoveMinMax(gs,validArr,depth = 2){

    if(depth === 0){
        return gs.scoreBoard();
    }

    if(gs.getTurnStatus()){
        let maxScore = -1000;
        for(let i in validArr){
            gs.makeMove(validArr[i]);
            score = findMoveMinMax(gs,gs.getValidMoves(),depth-1);
            if(score > maxScore){
                maxScore = score;
                if(depth === 4){
                    move = validArr[i];
                }
            }
            
            gs.undoMove(validArr[i]);
        }
        return maxScore;
    }else{
        let minScore = 1000;
        for(let i in validArr){
            gs.makeMove(validArr[i]);
            score = findMoveMinMax(gs,gs.getValidMoves(),depth-1);
            if(score < minScore){
                minScore = score;
                if(depth === 4){
                    move = validArr[i];
                }
            }
            gs.undoMove(validArr[i]);
        }
        return minScore;
    } 
}



export default findBestMove;