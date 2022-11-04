import trainingImage from '../images/training-preview.png'
import soloMazeImage from '../images/solomaze-preview.png'
import pvpImage from '../images/pvp-preview.png'
import unknownImage from '../images/preview.png'
import '../css/Modes.css'

function Modes(props) {

    let { setMode, handleHover, handleMouseLeave } = props;

    
   

    const modes = [
        { image: trainingImage, title: "Maze Training", text: "Take a closer look at how a random maze is generated and view how an Agent uses Reinforcement Learning to find the best path in any randomly generated maze." },
        { image: soloMazeImage, title: "Solo Game", text: "Race against time and do your best to find the exit of the maze before the time runs out." },
        { image: pvpImage, title: "Player Vs Player", text: "Offline Multiplayer mode where two players can race against each other to find the exit of the maze." },
        //{ image: unknownImage, title: "Player Vs Agent", text: "?" },
        { image: unknownImage, title: "Multiplayer", text: "In progress..." }
    ]



    return(
        <div className="mode-container">
            {/*<button className='mode disabled' >Maze Training</button>
            <button onClick={setMode} id='solo' className='mode active'>Solo Game</button>
            <button className='mode disabled'>Player Vs Agent</button>*/}
            {modes.map((mode, modeID) => 
                <div key={modeID} id={mode.title} className={mode.text === "?" ? "mode-card disabled" : "mode-card card" + `${modeID}` } onMouseEnter={handleHover} onMouseLeave={handleMouseLeave} onClick={mode.text === "?" ? null : setMode}>
                    <img id={mode.title} onClick={setMode} className='mode-image' src={mode.image} alt="mode image"/>
                    <h1 id={mode.title} onClick={setMode} className='mode-title'>{mode.title}</h1>
                    <p id={mode.title} onClick={setMode} className='mode-text'>{mode.text}</p>
                </div>    
            )}
        
        </div>
    )

}

export default Modes;