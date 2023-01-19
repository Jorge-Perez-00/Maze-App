
import '../css/Title.css'

function Title(props) {
    const {mode, handleTitleClick} = props;

    let cardNumber;
    if (mode === 'Maze Training') {
        cardNumber = 0;
    }
    else if(mode === 'Solo Game') {
        cardNumber = 1;
    }
    else if (mode === 'Player Vs Player') {
        cardNumber = 2;
    }
    else if (mode === 'Multiplayer') {
        cardNumber = 3;
    }
    

    return(
        <div title="Go to homepage" className="title-container" onClick={mode !== "" ? handleTitleClick : null}>
            <h1 className={mode === "" ? 'Title homepage-title' : 'Title modes-title title' + `${cardNumber}`} onClick={mode !== "" ? handleTitleClick : null}>
            {mode === 'Solo Game' ? "MAZE GAME: SOLO" : 
            mode === 'Player Vs Player' ? "MAZE GAME: PLAYER VS PLAYER" :
            mode === 'Maze Training' ? "MAZE: REINFORCEMENT LEARNING" :
            mode === 'Multiplayer' ? "MAZE: MULTIPLAYER" : "MAZE"}
            </h1>
        </div>
       
    )

}

export default Title;