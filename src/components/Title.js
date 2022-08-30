




function Title(props) {
    const {feature} = props;


    return(
        <h1 className='Title'>
            {feature === 'solo' ? "MAZE GAME: SOLO" : "MAZE"}
        </h1>
    )

}


export default Title;