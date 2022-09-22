import { Component } from "react";

import Maze from './Maze';
import Sidebar from './Sidebar'


class MazeTraining extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            maze: [],
            previousPath: new Set(),
            path: new Set(),
            mazeComplete: false,
            rows: 30,
            columns: 30,
            start: false,
            newMaze: false,
            createNewMaze: 0,
            start: false,
            gameMessage: "",


        }
        this.invalid_value = -99999;

        this.EPISODE = 0;
        this.EPS = 50;
        this.q_table = new Array(this.state.rows).fill(0).map(() => new Array(this.state.columns).fill(0).map(() => new Array(4).fill(0)));
        this.previousPath = new Set();
        this.samePathCount = 0;
    }

    setupTable = () => {
        for (let row = 0; row < this.state.rows; row++) {
            for (let col = 0; col < this.state.columns; col++) {

                //Moving UP at the the first row is invalid.
                if (row === 0) {
                    this.q_table[row][col][0] = this.invalid_value;
                }

                //Moving LEFT at the first column is invalid.
                if (col === 0) {
                    this.q_table[row][col][2] = this.invalid_value;
                }

                //Moving DOWN at the final row is invalid.
                if (row === this.state.rows - 1) {
                    this.q_table[row][col][1] = this.invalid_value;
                }

                //Moving RIGHT at the final column is invalid.
                if (col === this.state.columns - 1) {
                    this.q_table[row][col][3] = this.invalid_value;
                }
            }
        }
    }

    componentDidMount() {
        this.setupTable();
    }


    resetPath = () => {
        if(this.previousPath.size === this.state.path.size) {
            this.samePathCount += 1;
        }
        else {
            this.samePathCount = 0;
        }
        console.log("samePathCount: ", this.samePathCount);
        
        //SAVE CURRENT PATH ONTO ANOTHER SET VARIABLE
        this.previousPath = new Set(this.state.path);

        this.setState({
            previousPath: this.previousPath,
            path: new Set(),
            agent: {x:0, y:0}
        })
    }

    /*
        Set AGENT'S NEW POSITION AND UPDATE CURRENT PATH
    */
    setAgent = (position, stringPosition) => {
        let newPath = new Set(this.state.path);
        newPath.add(stringPosition)
    
        this.setState({
            agent: position,
            path: newPath,

        })

    }

    setMazeInfo = (maze) => {
        this.setState({
            maze: maze,
            mazeComplete: true,
            newMaze: true,
        })
    }

    setStart = () => {
        this.setState({
            agent: { x: 0, y: 0 },
            start: true,
            newMaze: false,
        })
        this.startTraining();
    }

    createNewMaze = () => {
        //RESET ALL VARIABLES USED TO HELP TRAIN THE AGENT
        this.EPISODE = 0;
        this.EPS = 50;
        this.q_table = new Array(this.state.rows).fill(0).map(() => new Array(this.state.columns).fill(0).map(() => new Array(4).fill(0)));
        this.previousPath = new Set();
        this.samePathCount = 0;
        this.setupTable();


        this.setState({
            createNewMaze: this.state.createNewMaze === 0 ? 1 : 0,
            agent: {},
            mazeComplete: false,
            gameMessage: "",
            newMaze: false,
            start: false,
            previousPath: new Set(),
            path: new Set(),

        })
    }

    startTraining = () => {
        this.interval = setInterval(() => {
            this.Train();
        }, 10)
    }
    

    /*  
        AGENT TRAINING SECTION........................................................
    */



    /*
        Return an array of actions that will not take the agent outside the maze.
    */
    get_valid_actions = (position) => {
        let valid_actions = [];

        for (let index = 0; index < 4; index++) {
            //let nP = take_action(position, index);
            if (this.q_table[position.x][position.y][index] !== this.invalid_value) {
                valid_actions.push(index)
            }
        }
        return valid_actions;
    }

    /*
        Return an array that contains all the actions with the same max value.
    */
    get_all_max_actions = (position) => {
        let maxActions = [];

        let max = -14999;
        let action;

        for (let index = 0; index < 4; index++) {
            if (this.q_table[position.x][position.y][index] > max) {
                max = this.q_table[position.x][position.y][index];
                action = index;
            }
        }
        maxActions.push(action);
        for (let action = 0; action < 4; action++) {
            if (this.q_table[position.x][position.y][action] === max) {
                maxActions.push(action);
            }
        }

        return maxActions;
    }


    /*
        Return a random valid action or an action with the higher future value.
    */
    get_Action = (position) => {
        let action;
        let number = Math.floor(Math.random() * 100);


        if (number < this.EPS) {
            let valid_actions = this.get_valid_actions(position);
            let index = Math.floor(Math.random() * valid_actions.length);
            action = valid_actions[index];
        }
        else {

            let max_actions = this.get_all_max_actions(position);
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
    take_action = (position, action) => {
        let newPosition = { ...position };

        //UP
        if (action === 0) {
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



    getMaxQValue = (position, action) => {
        let maxValue = -9999;
        let actionToOldPosition;
        if (action === 0) {
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
        for (let action = 0; action < 4; action++) {
            if (this.q_table[position.x][position.y][action] > maxValue && action !== actionToOldPosition) {
                maxValue = this.q_table[position.x][position.y][action];
            }
        }

        return maxValue;
    }


    /*
        FUNCTION THATS IN CHARGE OF TRAINING THE AGENT
    */
    Train = () => {
        //console.log("Training Agent...");
        let agent = {...this.state.agent};
        let maze = this.state.maze;
        let q_table = this.q_table;

        if (maze[agent.x][agent.y] !== 1000) {
            console.log("TRAINING...")

            //GET ACTION BASED ON THE AGENT'S CURRENT POSITION
            let action = this.get_Action(agent);

            //GET NEW POSITION AFTER TAKING 'action'
            let new_position = this.take_action(agent, action);

            let current_value = q_table[agent.x][agent.y][action];

            let reward = maze[new_position.x][new_position.y];
            let max_value = this.getMaxQValue(new_position, action);

            q_table[agent.x][agent.y][action] = current_value + 1 * (reward + (1 * max_value) - current_value);

            let visited = agent;
            //setPath(agent.x.toString() + agent.y.toString())
            agent = new_position;
            //CALL PARENT FUNCTION THAT UPDATES AGENT'S POSITION
            this.setAgent(agent, visited.x.toString() + '-' + visited.y.toString());
        }
        else {
            this.EPISODE++;
            console.log("EPISODE: ", this.EPISODE, "EPSILON: ", this.EPS)
            
           
            if(this.samePathCount > 10) {
                clearInterval(this.interval)
                console.log("Same path for 10 EPISODES");
                this.setState({
                    //start: false,
                    newMaze: true,
                })
            }
            else {
                this.resetPath();
            }

            /*
            if (q_table[0][0][1] > 0 || q_table[0][0][3] > 0) {
                console.log("SHOWCASING BEST PATH...")
                //showPath = true;
                clearInterval(this.interval);



                
                this.intervalMax = setInterval(() => {
                    this.maxPath();
                }, 200)
                
            }
            else {
                //    this.resetPath();
                
            }
            */
            if (this.EPS !== 0) {
                if (this.EPS === 100) {
                    this.EPS = 50;
                }
                else {
                    this.EPS = this.EPS - 10;

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

    




    render() {
        return(
            <div className="main-container">
                <Maze
                    key={this.state.createNewMaze}
                    mode={"Training"}
                    agent={this.state.agent}
                    previousPath={this.state.previousPath}
                    path={this.state.path}
                    setMazeInfo={this.setMazeInfo}
                    rows={this.state.rows}
                    columns={this.state.columns}
                    start={this.state.start}
                />

                <Sidebar
                    mode={"maze training"}
                    mazeComplete={this.state.mazeComplete}
                    start={this.state.start}
                    newMaze={this.state.newMaze}
                    gMessage={this.state.gameMessage}
                    setStart={this.setStart}
                    createNewMaze={this.createNewMaze}
                />
            </div>
        )
    }
}


export default MazeTraining;