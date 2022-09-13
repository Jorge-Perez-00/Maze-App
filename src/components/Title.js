




function Title(props) {
    const {feature} = props;


    return(
        <h1 className='Title'>
            {feature === 'Solo Game' ? "MAZE GAME: SOLO" : 
            feature === 'PVP Game' ? "MAZE GAME: PLAYER VS PLAYER" :
            feature === 'Maze Training' ? "MAZE: REINFORCEMENT LEARNING" : "MAZE"}
        </h1>
    )

}


export default Title;