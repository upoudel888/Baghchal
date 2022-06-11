import _ from 'lodash';
var move = null;
function findBestMove(game){
    let gs = _.cloneDeep(game);
    let validArr = gs.getValidMoves();
    // findMoveMinMax(gs,validArr,4);
    // findMoveNegaMax(gs,validArr,4);
    if(validArr){
        findMoveNegaMaxAlphaBeta(gs,validArr,-1000,1000,4);
    }

    return move
}

var score    = null;

//minMax implementation to find the best move

// function findMoveMinMax(gs,validArr,depth = 2){

//     if(depth === 0){
//         return gs.scoreBoard();
//     }

//     if(gs.getTurnStatus()){
//         let maxScore = -1000;
//         for(let i in validArr){
//             gs.makeMove(validArr[i]);
//             score = findMoveMinMax(gs,gs.getValidMoves(),depth-1);
//             if(score > maxScore){
//                 maxScore = score;
//                 if(depth === 4){
//                     move = validArr[i];
//                 }
//             }
            
//             gs.undoMove(validArr[i]);
//         }
//         return maxScore;
//     }else{
//         let minScore = 1000;
//         for(let i in validArr){
//             gs.makeMove(validArr[i]);
//             score = findMoveMinMax(gs,gs.getValidMoves(),depth-1);
//             if(score < minScore){
//                 minScore = score;
//                 if(depth === 4){
//                     move = validArr[i];
//                 }
//             }
//             gs.undoMove(validArr[i]);
//         }
//         return minScore;
//     } 
// }


// negamax implementation to find next best move
// function findMoveNegaMax(gs,validArr,depth = 2){

//     if(depth === 0){
//         let multiplier = gs.getTurnStatus() ? 1 : -1;
//         return multiplier * gs.scoreBoard();
//     }

//     let maxScore = -1000;
//     for(let i in validArr){
//         gs.makeMove(validArr[i]);
//         score = -findMoveNegaMax(gs,gs.getValidMoves(),depth-1);
//         if(score > maxScore){
//             maxScore = score;
//             if(depth === 4){
//                 move = validArr[i];
//             }
//         }
//         gs.undoMove(validArr[i]);
//     }
//     return maxScore;
// }


//min max with alpha beta pruning
                                            //currentmax, currentmin
function findMoveNegaMaxAlphaBeta(gs,validArr,alpha,beta,depth = 2){

    if(depth === 0 || gs.isOver()){
        let multiplier = gs.getTurnStatus() ? 1 : -1;
        return multiplier * gs.scoreBoard();
    }

    let maxScore = -Infinity;
    for(let i in validArr){
        gs.makeMove(validArr[i]);
        //gs.makeMove toggles turn
        //so 1 means tiger
        //and 0 means goat
        // this block makes sure to choose branch with lowest depth to gameOver
        if(gs.getTurnStatus()){
            score = -depth-findMoveNegaMaxAlphaBeta(gs,gs.getValidMoves(),-beta,-alpha,depth-1);
        }else{
            score = depth-findMoveNegaMaxAlphaBeta(gs,gs.getValidMoves(),-beta,-alpha,depth-1);
        }
        
        
        if(score > maxScore){
            maxScore = score;
            if(depth === 4){
                move = validArr[i];
            }
        }
        gs.undoMove(validArr[i]);
        if(maxScore > alpha) alpha = maxScore;
        if(alpha >= beta) break;
    }
    return maxScore;
}



export default findBestMove;