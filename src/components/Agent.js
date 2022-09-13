
import { useEffect } from "react";


function Agent(props) {
    const {start, maze, setAgent, setPath, resetPath} = props;

    
    const rows = 30;
    const cols = 30;
    const invalid_value = -99999;

    

    let q_table = new Array(rows).fill(0).map(() => new Array(cols).fill(0).map(() => new Array(4).fill(0)) );

    //let Arr = new Array(rows).fill(new Array(cols).fill(new Array(4).fill(0)));

    /*
        Set all the unvalid actions in the q-table to a large negative value before the agent 
        starts training.
        
        In this case the unvalid actions are the actions that take the training agent 
        outside the maze.
    */
    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            
            //Moving UP at the the first row is invalid.
            if(row === 0) {
                q_table[row][col][0] = invalid_value;
            }

            //Moving LEFT at the first column is invalid.
            if(col === 0) {
                q_table[row][col][2] = invalid_value;
            }

            //Moving DOWN at the final row is invalid.
            if(row === rows - 1) {
                q_table[row][col][1] = invalid_value;
            }

            //Moving RIGHT at the final column is invalid.
            if (col === cols - 1) {
                q_table[row][col][3] = invalid_value;
            }
        }
    }
    let agent = {x:0, y:0};

    let EPISODES = 0;
    let EPSILON = 100;

    /*
        Return an array of actions that will not take the agent outside the maze.
    */
    function get_valid_actions(position) {
        let valid_actions = [];

        for(let index = 0; index < 4; index++) {
            //let nP = take_action(position, index);
            if (q_table[position.x][position.y][index] !== invalid_value) {
                valid_actions.push(index)
            }
        }
        return valid_actions;
    }

    /*
        Return an array that contains all the actions with the same max value.
    */
    function get_all_max_actions(position) {
        let maxActions = [];

        let max = -14999;
        let action;

        for(let index = 0; index < 4; index++) {
            //let nP = take_action(position, index);
            if (q_table[position.x][position.y][index] > max /*&& maze[nP.x][nP.y] !== -100*/) {
                max = q_table[position.x][position.y][index];
                action = index;
            }
        }
        maxActions.push(action);
        for (let action = 0; action < 4; action++) {
            //let nP = take_action(position, action);
            if (q_table[position.x][position.y][action] === max /*&& maze[nP.x][nP.y] !== -100*/) {
                maxActions.push(action);
            }
        }

        return maxActions;
    }

  
    /*
        Return a random valid action or an action with the higher future value.
    */
    function get_Action(position) {
        
        let action;
        let number = Math.floor(Math.random() * 100);

        
        if(number < EPSILON) {
            let valid_actions = get_valid_actions(position);
            let index = Math.floor(Math.random() * valid_actions.length);
            action = valid_actions[index];
        }
        else{
            
            let max_actions = get_all_max_actions(position);
            let index = Math.floor(Math.random() * max_actions.length);
            action = max_actions[index];

        }
        
        /*
        return # action.
        0 = UP
        1 = DOWN
        2 = LEFT
        3 = RIGHT
        */  
        return action;
        
    }


    /*
        RETURN THE NEW POSITION COORDINATES BASED ON 'action'
        'action' can equal = 0 | 1 | 2 | 3
            0 = MOVE UP A CELL 
            1 = MOVE DOWN A CELL
            2 = MOVE LEFT A CELL
            3 = MOVE RIGHT A CELL
    */
    function take_action(position, action) {
        let newPosition = {...position};

        //UP
        if(action === 0) {
            newPosition.x--;
        }
        //DOWN
        else if (action === 1) {
            newPosition.x++;
        }
        //LEFT
        else if (action === 2) {
            newPosition.y--;
        }
        //RIGHT
        else if (action === 3) {
            newPosition.y++;
        }

        return newPosition;
    }

    let episode = 0;

    function getMaxQValue(position, action) {
        let maxValue = -9999;
        let actionToOldPosition;
        if(action === 0) {
            actionToOldPosition = 1;
        }
        else if (action === 1) {
            actionToOldPosition = 0;
        }
        else if (action === 2) {
            actionToOldPosition = 3;
        }
        else if (action === 3) {
            actionToOldPosition = 2;
        }
        for(let action = 0; action < 4; action++) {
            //let tempPosition = take_action(newPosition)
            if(q_table[position.x][position.y][action] > maxValue && action !== actionToOldPosition) {
                maxValue = q_table[position.x][position.y][action];
            }
        }

        return maxValue;
    }

    let showPath =  false;

    /*
        FUNCTION THATS IN CHARGE OF TRAINING THE AGENT
    */
    function Train() {
        //console.log("Training Agent...");

        if(maze[agent.x][agent.y] !== 1000) {
                console.log("TRAINING...")
                //GET ACTION BASED ON THE AGENT'S CURRENT POSITION
                let action = get_Action(agent);

                //GET NEW POSITION AFTER TAKING 'action'
                let new_position = take_action(agent, action);

                let current_value = q_table[agent.x][agent.y][action];

                let reward = maze[new_position.x][new_position.y];
                let max_value = getMaxQValue(new_position, action);

                q_table[agent.x][agent.y][action] = current_value + 1 * (reward + (1 * max_value) - current_value);

                let visited = agent;
                //setPath(agent.x.toString() + agent.y.toString())
                agent = new_position;
                //CALL PARENT FUNCTION THAT UPDATES AGENT'S POSITION
                setAgent(agent, visited.x.toString() + '-' + visited.y.toString());
        }
        else {
                episode++;
                console.log("EPISODE: ", episode, "EPSILON: ", EPSILON)
                //moves++;
                agent = { x: 0, y: 0 }
                setAgent(agent);
                resetPath();

                if(q_table[agent.x][agent.y][1] > 0 || q_table[agent.x][agent.y][3] > 0) {
                    console.log("SHOWCASING BEST PATH...")
                    showPath = true;
                    clearInterval(interval);
                    interval = setInterval(() => {
                        maxPath();
                    },200)
                }

                
                if (EPSILON !== 0) {
                    if(EPSILON === 100) {
                        EPSILON = 50;
                    }
                    else {
                        EPSILON = EPSILON - 10;

                    }
                }

                console.log("0 0")
                for (let index = 0; index < 4; index++) {
                    console.log(index, ":", q_table[0][0][index]);
                }

                console.log("0 1")
                for (let index = 0; index < 4; index++) {
                    console.log(index, ":", q_table[0][1][index]);
                }
                console.log("1 0")
                for (let index = 0; index < 4; index++) {
                    console.log(index, ":", q_table[1][0][index]);
                }
            
        }      
    }

    function maxPath() {
        console.log("BEST PATH...")
        if (maze[agent.x][agent.y] !== 1000) {
            let action;

            let max = -9999999999;
            for(let index = 0; index < 4; index++) {
                if(q_table[agent.x][agent.y][index] > max) {
                    max = q_table[agent.x][agent.y][index];
                    action = index;
                }
            }

            let new_position = take_action(agent, action);


            agent = new_position;
            //CALL PARENT FUNCTION THAT UPDATES AGENT'S POSITION
            setAgent(agent);


        }
        else {
            /*
            agent = {x:0, y:0}
            setAgent(agent);
            */
           clearInterval(interval);
        }
    }


    useEffect(() => {
        if(start) {
            console.log("START IS TRUE IN AGENT COMPONENT")
            console.log('CHECK DEADEND IN AGENT COMPONENT',maze[0][0])
            startTraining();
        }
    }, [start])


    let number = 1;
    let interval = null;
    

    function startTraining() {
        interval = setInterval(() => {
            Train();
        }, 10)
    }

    return(null)
    
}



export default Agent;