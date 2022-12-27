
import '../css/MessageBox.css'

/*
function Button(props) {
    const { numKey, text, onClick} = props;

    return(
        <button onClick={onClick}>{text}</button>
    )
}
*/


function MessageBox(props) {

    const {open, message, buttons} =  props;

    return(
        <>
            {open && 
                <div className='message-box-container'>
                    <div className='background-box'>

                    </div>
                    <div className="messageBox">
                        <h1 className={"message-text"} >{message}</h1>
                        {buttons.map((button, index) => 
                            <button key={index} className={"message-button " + button.className} onClick={button.onClick}>{button.text}</button>
                        )}

                    </div>
                </div>
            }
        </>
    )
}


export default MessageBox;