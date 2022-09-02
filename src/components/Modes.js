import soloMazeImage from '../images/solomaze-preview.png'
import '../css/Modes.css'

function Modes(props) {

    let {setMode} = props;


    const modes = [
        {image: soloMazeImage, title: "Maze Training", text: "?" },
        { image: soloMazeImage, title: "Solo Game", text: "Play against time and do your best to find the exit of the maze before the time runs out." },
        { image: soloMazeImage, title: "PVP Game", text: "?" },
        { image: soloMazeImage, title: "Player Vs Agent", text: "?" },
        { image: soloMazeImage, title: "Multiplayer", text: "?" }
    ]



    return(
        <div className="mode-container">
            {/*<button className='mode disabled' >Maze Training</button>
            <button onClick={setMode} id='solo' className='mode active'>Solo Game</button>
            <button className='mode disabled'>Player Vs Agent</button>*/}
            {modes.map((mode, modeID) => 
                <div key={modeID} id={mode.title} className={mode.text === "?" ? "mode-card disabled" : "mode-card" } onClick={mode.text === "?" ? null : setMode}>
                    <img id={mode.title} onClick={setMode} className='mode-image' src={mode.image} alt="mode image"/>
                    <h1 id={mode.title} onClick={setMode} className='mode-title'>{mode.title}</h1>
                    <p id={mode.title} onClick={setMode} className='mode-text'>{mode.text}</p>
                </div>    
            )}
        
        </div>
    )

}

export default Modes;