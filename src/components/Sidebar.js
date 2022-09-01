
import ArrowKeysImage from '../images/arrowkeys.png'
import player1 from '../images/p1-character.png'
import wallcell from '../images/wallcell.png'
import exitcell from '../images/exitcell.png'

import '../css/Sidebar.css'

import Timer from './Timer';


function Sidebar(props) {

    const {mazeComplete, start, wonGame, gMessage, setStart, stopGame, createNewMaze, setAgent} = props;

    
    let startButton;
    if (mazeComplete && !start && !wonGame) {
        startButton = <button onClick={setStart} className="game-buttons">START</button>

    }
    else {
        startButton = <button className="game-buttons disabled-button">START</button>

    }

    let gameMessage;
    if (gameMessage !== "" && start === false && mazeComplete) {
        gameMessage = <h1 className='gameMessage' >{gMessage}</h1>
    }


    return(
        <div className="sidebar-container">

            <div className="game-info-childs child-one" >
                {start ? <Timer onZero={stopGame} /> : <div className="timer">0:00</div>}

            </div>

            <div className="game-info-childs child-two" >
                <div className='info-card'>
                    <div className='info-card-child'>
                        <img src={ArrowKeysImage} alt="arrowkeys" className="control-image" />
                        <h1 className='control-text'>- P1 controls</h1>
                    </div>
                </div>

                <div className='maze-info-container'>
                    <div className='character-info'>
                        <h4 className='info-title'>Characters</h4>
                        <div className='maze-info-card'>
                            <img src={player1} alt="P1" className='info-image'/>
                            <h4 className='info-name'>- Player 1</h4>
                        </div>
                    </div>

                    <div className='environment-info'>
                        <h4 className='info-title'>Environment</h4>
                        <div className='maze-info-card'>
                            <img src={wallcell} alt="wall/trap cell" className='info-image' />
                            <h4 className='info-name'>- Wall/Trap Cell</h4>
                        </div>
                        <div className='maze-info-card'>
                            <img src={exitcell} alt="exit cell" className='info-image' />
                            <h4 className='info-name'>- Exit Cell</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="game-info-childs child-three">
                {gameMessage}
            </div>

            <div className="game-info-childs child-four" >
                {startButton}
                {wonGame ?
                    <button onClick={createNewMaze} className="game-buttons" >New Maze</button> :
                    <button className="game-buttons disabled-button" >New Maze</button>
                }
            </div>

        </div>
    )
}


export default Sidebar;