import './Status.css'
const Status = ({statusArr}) => {
    return ( 
        <div className="game-status">
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
     );
}
 
export default Status;