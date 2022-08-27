

function Maze(props) {

    let {maze, agent, ArrowKeyHandler} = props;

    return(
        <div className="maze-container" tabIndex={0} onKeyDown={ArrowKeyHandler}>
            {maze?.map((row, rowID) =>
                <div key={rowID} className={"rows"}>
                    {row?.map((value, cellID) =>
                        <div key={cellID} className={`cell ${value === 100 ? "Goal" : value === 1 ? "Path" : ""}`}>
                            {
                                (agent.x === rowID && agent.y === cellID) ? <h2>A</h2> : null
                            }
                        </div>
                    )}
                </div>
            )}
        </div>
       
    )
}


export default Maze;