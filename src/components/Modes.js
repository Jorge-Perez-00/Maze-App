import trainingImage from '../images/training-preview.png'
import soloMazeImage from '../images/solomaze-preview.png'
import pvpImage from '../images/pvp-preview.png'
import multiplayerImage from '../images/multiplayer-preview.png'
import unknownImage from '../images/preview.png'
import '../css/Modes.css'

function Modes(props) {

    let { disable, setMode, handleHover, handleMouseLeave } = props;

    
   

    const modes = [
        { image: trainingImage, title: "Maze Training", text: "Take a closer look at how a random maze is generated and view how an Agent uses Reinforcement Learning to find the best path in any randomly generated maze." },
        { image: soloMazeImage, title: "Solo Game", text: "Race against time and do your best to find the exit of the maze before the time runs out." },
        { image: pvpImage, title: "Player Vs Player", text: "Offline multiplayer mode where two players can race against each other to find the exit of the maze." },
        { image: multiplayerImage, title: "Multiplayer", text: "Online multiplayer mode where 4 players race against each other in a random generated maze. The player that finds the exit wins the game." }
    ]



    return(
        <div className="mode-container">
            {/*<button className='mode disabled' >Maze Training</button>
            <button onClick={setMode} id='solo' className='mode active'>Solo Game</button>
            <button className='mode disabled'>Player Vs Agent</button>*/}
            {modes.map((mode, modeID) => 
                <div key={modeID} className='card-item'>
                    <div id={mode.title} className={disable === true ? "mode-card disabled" : "mode-card card" + `${modeID}`} onMouseEnter={handleHover} onMouseLeave={handleMouseLeave} onClick={disable === true ? null : setMode}>
                        <div className='mode-image-container'>
                            <img id={mode.title} onClick={disable === true ? null : setMode} className='mode-image' src={mode.image} alt="mode image" />
                        </div>
                        <div className='mode-text-container'>
                            <h1 id={mode.title} onClick={disable === true ? null : setMode} className='mode-title'>{mode.title}</h1>
                            <p id={mode.title} onClick={disable === true ? null : setMode} className='mode-text'>{mode.text}</p>
                        </div>
                    </div>   
                </div>
                 
            )}
        
        </div>
    )

}

export default Modes;