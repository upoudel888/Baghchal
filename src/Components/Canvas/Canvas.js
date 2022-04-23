import './Canvas.css'


const Canvas = () => { //baghcha obj

    let nodes = Array.from(Array(25).keys());
    let paths = ['0-1', '1-2', '2-3', '3-4',
                 '5-6', '6-7', '7-8', '8-9',
                 '10-11', '11-12', '12-13', '13-14',
                 '15-16', '16-17', '17-18', '18-19',
                 '20-21', '21-22', '22-23', '23-24', //horizontal paths

                 '0-5', '5-10', '10-15', '15-20',  //vertical paths
                 '1-6', '6-11', '11-16', '16-21', 
                 '2-7', '7-12', '12-17', '17-22', 
                 '3-8', '8-13', '13-18', '18-23', 
                 '4-9', '9-14', '14-19', '19-24',

                 '0-6', '6-12', '12-18', '18-24', //diagonal paths (main diagonal)
                 '4-8', '8-12', '12-16', '16-20', //

                 '2-8','8-14','14-18','18-22',
                 '2-6','6-10','10-16','16-22'
                ]

    return ( 
        
        <div className="canvas-container">
            {
                nodes.map(node => {
                                return (<div className = {`Node Node-${String(node)}`} key = {node}></div>)
                            }) 

            }
            {      
                paths.map(path => {
                                return (<div className = {`Path Path-${String(path)}`} key = {paths.indexOf(path)}></div>)
                            }) 
            }
                            
                

        </div>
     );
}
 
export default Canvas;