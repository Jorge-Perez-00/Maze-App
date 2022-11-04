
import ArrowKeysImage from '../images/arrowkeys.png'
import Player2Keys from '../images/awsdkeys.png'
import agent from '../images/agent-character.png'
import builder from '../images/builder-character.png'
import player1 from '../images/p1-character.png'
import player2 from '../images/p2-character.png'
import wallcell from '../images/wallcell.png'
import exitcell from '../images/exitcell.png'
import openPath from '../images/open-path.png'
import agentPath from '../images/agent-path.png'

import '../css/Sidebar.css'

import Timer from './Timer';


function Sidebar(props) {

    const {mode, start, newMaze, gMessage, setStart, stopGame, createNewMaze, trainingInfo, multiplayerHost} = props;

    //console.log(trainingInfo.setMazeType)

    let startButton;
    if (!start && newMaze) {
        startButton = <button title={mode !== "Training" ? "Start game" : "Start training"} onClick={setStart} className="game-buttons left enabled-button">START</button>

    }
    else {
        startButton = <button className="game-buttons left disabled-button">START</button>

    }

    let gameMessage;
    if (gameMessage !== "" && !start && mode !== "Training") {
        gameMessage = <h1 className='gameMessage' >{gMessage}</h1>
    }


    return(
        <div className="sidebar-container">
            
            {(mode !== "Training" && mode !== "Multiplayer") &&
                <div className="game-info-childs child-one" >
                    {start && mode !== "Training" ? <Timer onZero={stopGame} /> : <div className="timer">0:00</div>}

                </div>
            }
           
            {mode !== "Multiplayer" ? 
                <div className="game-info-childs child-two" style={mode === "Training" ? { height: '76%' } : { height: '58%' }} >
                    {mode !== "Training" &&
                        <div className='control-card'>
                            <div className='control-card-child'>
                                <img src={ArrowKeysImage} alt="arrowkeys" className="control-image1" />
                                <h1 className='control-text'>- P1 controls</h1>
                            </div>
                        </div>
                    }

                    {mode === "player vs player" &&
                        <div className='control-card'>
                            <div className='control-card-child'>
                                <img src={Player2Keys} alt="arrowkeys" className="control-image2" />
                                <h1 className='control-text'>- P2 controls</h1>
                            </div>
                        </div>
                    }

                    <div className='maze-info-container'>
                        <div className='character-info'>
                            <h4 className='info-title'>Characters</h4>
                            <ul className='character-list'>
                                {mode === "Training" &&
                                    <li className='characters'>
                                        <img src={agent} alt="Agent" className='info-image' />
                                        <h4 className='info-name'>- Agent</h4>
                                    </li>
                                }
                                {mode === "Training" &&
                                    <li className='characters'>
                                        <img src={builder} alt="Builder" className='info-image' />
                                        <h4 className='info-name'>- Builder</h4>
                                    </li>
                                }
                                {mode !== "Training" &&
                                    <li>
                                        <img src={player1} alt="P1" className='info-image' />
                                        <h4 className='info-name'>- Player 1</h4>
                                    </li>
                                }

                                {mode === "player vs player" &&
                                    <li>
                                        <img src={player2} alt="P2" className='info-image' />
                                        <h4 className='info-name'>- Player 2</h4>
                                    </li>
                                }
                            </ul>

                        </div>

                        <div className='environment-info'>
                            <h4 className='info-title'>Environment</h4>

                            <ul className='environment-list'>
                                <li>
                                    <img src={openPath} alt="open cell" className='info-image' />
                                    <h4 className='info-name'>- Free Cell</h4>
                                </li>
                                <li>
                                    <img src={wallcell} alt="wall/trap cell" className='info-image' />
                                    <h4 className='info-name'>- Wall/Trap Cell</h4>
                                </li>
                                <li>
                                    <img src={exitcell} alt="exit cell" className='info-image' />
                                    <h4 className='info-name'>- Exit Cell</h4>
                                </li>
                                {mode === "Training" &&
                                    <li>
                                        <img src={agentPath} alt="path" className='info-image' />
                                        <h4 className='info-name'>- Agent's Path</h4>
                                    </li>
                                }

                            </ul>

                        </div>
                    </div>
                    {mode === "Training" &&
                        <div className='info-box'>
                            <h1 className='info-text'>Episodes: {trainingInfo.Episode}</h1>
                            <h1 className='info-text'>Epsilon: {trainingInfo.Epsilon}</h1>
                            {trainingInfo.mazeType === "show" ?
                                <h1 className='info-text'>Mode: Show Animation</h1> :
                                trainingInfo.mazeType === "hide" ?
                                    <h1 className='info-text'>Mode: Hide Animation</h1> :
                                    <h1 className='info-text'>Mode: ? </h1>
                            }
                        </div>
                    }

                </div> :
                <div className="game-info-childs child-two" style={{ height: '88%' }}>

                </div>

            }
            {mode === "Training" ? 
                <div className="game-info-childs child-three training" style={{ height: '10%' }}>
                    {trainingInfo.mazeType !== "show" && start && !trainingInfo.mazeInProgress ?
                        <button title="Show maze generation and training animation" onClick={trainingInfo.setMazeType} id={"show"} className='game-buttons left enabled-training-button'>SHOW</button> :
                        trainingInfo.mazeType === "show" ?
                            <button title="Show maze generation and training animation" className='game-buttons left frozen-training-button'>SHOW</button> :
                            <button className='game-buttons left disabled-button'>SHOW</button>

                    }
                    {trainingInfo.mazeType !== "hide" && start && !trainingInfo.mazeInProgress ?
                        <button title="Hide maze generation and training animation" onClick={trainingInfo.setMazeType} id={"hide"} className='game-buttons right enabled-training-button'>HIDE</button> :
                        trainingInfo.mazeType === "hide" ?
                            <button title="Hide maze generation and training animation" className='game-buttons right frozen-training-button'>HIDE</button> :
                            <button className='game-buttons right disabled-button'>HIDE</button>
                    }
                </div> : 
                mode === "Multiplayer" ? null : 
                    <div className="game-info-childs child-three">
                        {gameMessage}
                    </div>
            }

            
            
          
            {mode !== "Multiplayer" &&
                <div className="game-info-childs child-four" >
                    {startButton}
                    {newMaze ?
                        <button title="Generate a new random maze" onClick={createNewMaze} className="game-buttons right enabled-button" >NEW MAZE</button> :
                        <button className="game-buttons right disabled-button" >NEW MAZE</button>
                    }
                </div> 
            }

            {(mode === "Multiplayer" && multiplayerHost) ? 
                <div className="game-info-childs child-four" >
                    {startButton}
                    {newMaze ?
                        <button title="Generate a new random maze" onClick={createNewMaze} className="game-buttons right enabled-button" >NEW MAZE</button> :
                        <button className="game-buttons right disabled-button" >NEW MAZE</button>
                    }
                </div> : 
                <div className="game-info-childs child-four" >
                    <button className="game-buttons left disabled-button">START</button>
                    <button className="game-buttons right disabled-button" >NEW MAZE</button>
                </div>
            }
            

        </div>
    )
}


export default Sidebar;