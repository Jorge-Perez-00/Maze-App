




function Title(props) {
    const {feature} = props;


    return(
        <h1 className='Title'>
            {feature === 'Solo Game' ? "MAZE GAME: SOLO" : 
            feature === 'PVP Game' ? "MAZE GAME: Player Vs Player" : "MAZE"}
        </h1>
    )

}


export default Title;