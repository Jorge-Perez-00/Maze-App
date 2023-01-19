import { Component } from "react";


class Timer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            timer: 59,
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
       let newTime = this.state.timer;
       newTime = newTime - 1;


       this.setState({
            timer: newTime
       })

       if(newTime === 0) {
            this.props.onZero();

        }

    }
    
   render() {
        return(
            <div className="timer">{`0:${this.state.timer < 10 ? "0" + this.state.timer.toString() : this.state.timer.toString() }`}</div>
            )
    }
    
}

export default Timer;