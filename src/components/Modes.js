

function Modes(props) {

    let {setMode} = props;

    return(
        <div className="mode-container">
            <button className='mode disabled' >Maze Training</button>
            <button onClick={setMode} id='solo' className='mode active'>Solo Game</button>
            <button className='mode disabled'>Player Vs Agent</button>
        </div>
    )

}

export default Modes;