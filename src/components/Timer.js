import { Component } from "react";



class Timer extends Component {

    
    constructor(props) {
        super(props);
        this.state = {
            timer: new Date(0,0,0,0,1,0),
        }

    }
    

    
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setTime();
        }, 1000)
    }

   componentWillUnmount() {
       clearInterval(this.timer);

    }
   

    setTime = () => {
        let newTimer = new Date(this.state.timer.valueOf());

        newTimer.setSeconds(newTimer.getSeconds() - 1);        
        console.log("ONE SECOND")
        
        this.setState({
            timer: newTimer
        })
        

        let checkTime = Math.abs(newTimer.getTime());        

        //console.log(checkTime === 2209057200000)
        if(checkTime === 2209057200000) {
            this.props.onZero();
            console.log("TIMER HIT ZERO")
        }

    }


    
   render() {
        return(
            <h1 className="timer">{this.state.timer.toString().slice(20,24)}</h1>
        )
    }
    
}




export default Timer;