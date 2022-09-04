
import { useEffect } from "react";


function Agent(props) {
    const {start, maze} = props;

    const rows = 30;
    const cols = 30;

    let q_table = new Array(rows).fill(0).map(() => new Array(cols).fill(0).map(() => new Array(4).fill(0)) );

    //let Arr = new Array(rows).fill(new Array(cols).fill(new Array(4).fill(0)));

    console.log(q_table[0][0][3])
    //console.log(Arr[0][0][3])

    let agent = {x:0, y:0};

    let EPISODES = 0;
    
    function Train() {
        console.log("Training Agent...");


    }


    useEffect(() => {
        if(start) {
            console.log("START IS TRUE IN AGENT COMPONENT")
            test();
        }
    }, [start])


    let number = 1;
    let interval = null;
    
    function test() {

        interval = setInterval(() => {
           test2();
        }, 100)
        
    }

    function test2() {
        console.log(number);
        if (number === 100) {
            clearInterval(interval);
        }
        number++;

    }
    /*
    componentDidMount = () => {
        if(this.props.start) {
            console.log("START IS TRUE IN AGENT COMPONENT")
        }
    }
    */




   
    return(null)
    
}



export default Agent;