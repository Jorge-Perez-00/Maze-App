import { Component } from "react";

import Maze from './Maze';
import Sidebar from './Sidebar'


class MazeTraining extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            maze: [],
            path: new Set(),
            mazeComplete: false,
            rows: 30,
            columns: 30,
            start: true,
            newMaze: false,
            createNewMaze: 0,
            mazeType: "none",
            mazeInProgress: false,
            gameMessage: "",
            trainingInfo: {
                EPISODES: 0,
                EPSILON: 0,
            }


        }
        this.invalid_value = -99999;

        this.EPISODE = 0;
        this.EPS = 50;
        this.q_table = new Array(this.state.rows).fill(0).map(() => new Array(this.state.columns).fill(0).map(() => new Array(4).fill(0)));
        this.path = new Set();
        this.samePathCount = 0;


        this.QVALUE_CHANGES = 0;
        this.EPISODES_WITH_NO_QVALUE_CHANGES = 0;
    }

    showQValues = (div) => {
        let coordinates = div.target.id.split("-");
        let position = {x: parseInt(coordinates[0],10), y: parseInt(coordinates[1],10)}
        console.log(position);
        console.log("UP:", this.q_table[position.x][position.y][0])
        console.log("DOWN:", this.q_table[position.x][position.y][1])
        console.log("LEFT:", this.q_table[position.x][position.y][2])
        console.log("RIGHT:", this.q_table[position.x][position.y][3])


    }

    /*
        FUNCTION THAT WILL SETUP THE Q_TABLE WHEN THE COMPONENT IS MOUNTED.
        ALL ACTIONS IN THE QTABLE THAT LEAD THE AGENT TO GO OUTSIDE THE MAZE WILL BE SET TO AN "invalid_value" WHICH IS JUST THE LARGE NEGATIVE NUMBER -99999.
        THE SAME "invalid_value" IS USED DURING TRAINING TO PREVENT THE AGENT FROM TAKING ANY ACTION THAT WILL LEAD IT OUTSIDE THE MAZE.
    */
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

    setMazeType = (event) => {
        const type = event.target.id;
        console.log(type)
        this.setState({
            mazeType: type,
            newMaze: true
        })
    }
    

    setMazeInfo = (maze) => {
        this.setState({
            maze: maze,
            mazeComplete: true,
            newMaze: true,
            mazeInProgress: false,
        })
    }

    setStart = () => {
        this.setState({
            agent: { x: 0, y: 0 },
            start: true,
            newMaze: false,
            mazeInProgress: true,
        })

        if(this.state.mazeType === "hide") {
            console.log("TRAINING WITH NO ANIMATION...");
            this.start = setTimeout(() => {
                this.Train_No_Animation()
            }, 1)
        }
        else if(this.state.mazeType === "show") {
            console.log("TRAINING WITH ANIMATION...");
            this.interval = setInterval(() => {
                this.Train_Animation();
            }, 30)
        }
     
    }

    createNewMaze = () => {
        //RESET ALL VARIABLES USED TO HELP TRAIN THE AGENT
        this.EPISODE = 0;
        this.EPS = 50;
        this.q_table = new Array(this.state.rows).fill(0).map(() => new Array(this.state.columns).fill(0).map(() => new Array(4).fill(0)));
        this.samePathCount = 0;
        this.setupTable();


        this.setState({
            createNewMaze: this.state.createNewMaze === 0 ? 1 : 0,
            agent: {},
            mazeComplete: false,
            gameMessage: "",
            newMaze: false,
            start: false,
            mazeInProgress: true,
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

    Train_No_Animation = () => {

        const maze = this.state.maze;
        //let rows = this.state.rows;
        //let cols = this.state.cols;
        let q_table = this.q_table;

        let noUpdates = false;
        //let foundExit;
        while(!noUpdates) {
            //console.log("First while loop")
            let agent = {x:0, y:0};
            while(maze[agent.x][agent.y] !== 1000) {
                //console.log("Second while loop")

                //GET ACTION BASED ON THE AGENT'S CURRENT POSITION
                let action = this.get_Action(agent);
                //console.log(action)

                //GET NEW POSITION AFTER TAKING 'action'
                let new_position = this.take_action(agent, action);

                let current_value = q_table[agent.x][agent.y][action];

                let reward = maze[new_position.x][new_position.y];
                let max_value = this.getMaxQValue(new_position, action);

                q_table[agent.x][agent.y][action] = current_value + 1 * (reward + (1 * max_value) - current_value);

                if (current_value !== q_table[agent.x][agent.y][action] && maze[agent.x][agent.y] !== -9999) {
                    this.QVALUE_CHANGES++;
                }

                agent = new_position;
                /*
                if(agent.x === rows - 1 && agent.y === cols - 1) {
                    foundExit = true;
                }
                */
              
            }
            //WHEN EXIT HAS BEEN REACHED DO...
            if (this.QVALUE_CHANGES === 0) {
                this.EPISODES_WITH_NO_QVALUE_CHANGES++;
            }
            else {
                this.EPISODES_WITH_NO_QVALUE_CHANGES = 0;
            }

            if(this.EPISODES_WITH_NO_QVALUE_CHANGES === 100) {
                noUpdates = true;
            }
            this.QVALUE_CHANGES = 0;

            if (q_table[0][0][1] <= 0 && q_table[0][0][3] <= 0) {
                if (this.EPISODE % 10 === 0) {
                    this.EPS = 75;
                }
                else if (this.EPISODE < 50) {
                    this.EPS = 10;
                }
                else if (this.EPISODE < 100) {
                    this.EPS = 25;
                }
                else {
                    this.EPS = 50;
                }
            }
            else {
                this.EPS = 90;
            }

            this.EPISODE++;
            /* DEBUGGING...
            console.log(this.EPISODE);
            console.log("EPISODES WITH NO QVALUE CHANGES COUNT: ", this.EPISODES_WITH_NO_QVALUE_CHANGES);
            */
        }
        //WHEN NO QVALUES HAVE CHANGED DO...
        
        clearTimeout(this.start);
        this.BEST_PATH();
    }




    Train_Animation = () => {      
        let agent = { x: 0, y: 0 };
        const maze = this.state.maze;
        let q_table = this.q_table;

        let EPISODE_ENDED = false;
        this.path = new Set();
        while(!EPISODE_ENDED) {

            //GET ACTION BASED ON THE AGENT'S CURRENT POSITION
            let action = this.get_Action(agent);

            //GET NEW POSITION AFTER TAKING 'action'
            let new_position = this.take_action(agent, action);

            let current_value = q_table[agent.x][agent.y][action];

            let reward = maze[new_position.x][new_position.y];
            let max_value = this.getMaxQValue(new_position, action);

            q_table[agent.x][agent.y][action] = current_value + 1 * (reward + (1 * max_value) - current_value);

            if (current_value !== q_table[agent.x][agent.y][action] && maze[agent.x][agent.y] !== -9999) {
                this.QVALUE_CHANGES++;
                //console.log("VALUE IN Q_TABLE HAS CHANGED")
            }
            else {
                //console.log("VALUE IN Q_TABLE HAS NOT CHANGED")
            }
            //setPath(agent.x.toString() + agent.y.toString())
            this.path.add(agent.x.toString() + '-' + agent.y.toString());

            agent = new_position;
            if(agent.x === this.state.rows - 1 && agent.y === this.state.columns - 1) {
                EPISODE_ENDED = true;
            }
            //CALL PARENT FUNCTION THAT UPDATES AGENT'S POSITION
            //this.setAgent(agent, visited.x.toString() + '-' + visited.y.toString());


        }//WHILE LOOP

        //WHEN EXIT HAS BEEN REACHED DO...
        if (this.QVALUE_CHANGES === 0) {
            this.EPISODES_WITH_NO_QVALUE_CHANGES++;
        }
        else {
            this.EPISODES_WITH_NO_QVALUE_CHANGES = 0;
        }
     
        /*
        if (this.EPISODES_WITH_NO_QVALUE_CHANGES === 100) {
            clearInterval(this.interval);
        }
        */

        this.QVALUE_CHANGES = 0;

        if (q_table[0][0][1] <= 0 && q_table[0][0][3] <= 0) {
            if (this.EPISODE % 10 === 0) {
                this.EPS = 75;
            }
            else if (this.EPISODE < 50) {
                this.EPS = 10;
            }
            else if (this.EPISODE < 100) {
                this.EPS = 25;
            }
            else {
                this.EPS = 50;
            }
        }
        else {
            this.EPS = 90;
        }

        this.EPISODE++;
        
        
        /* DEBUGGING...
        console.log(this.EPISODE);
        console.log("EPISODES WITH NO QVALUE CHANGES COUNT: ", this.EPISODES_WITH_NO_QVALUE_CHANGES);
        console.log(this.path);
        */
        if (this.EPISODES_WITH_NO_QVALUE_CHANGES === 100) {
            clearInterval(this.interval);           
            this.BEST_PATH();
        }
        else {
            this.setState({
                path: this.path,
            })
        }

    }

    BEST_PATH = () => {
        this.setState({
            agent: {x:0, y:0},
            path: new Set(),
        })

        console.log("SHOWING BEST PATH...")
        this.BEST_PATH_INTERVAL = setInterval(() => {
            this.SHOW_BEST_PATH();
        },75)
    }

    /*
        FUNCTION THAT WILL SHOWCASE THE BEST PATH AFTER TRAINING IS DONE WITH THE HELP OF setInterval.
    */
    SHOW_BEST_PATH = () => {

        let agent = {...this.state.agent};
        const maze = this.state.maze;

        if (maze[agent.x][agent.y] !== 1000) {

            //GET ACTION BASED ON THE AGENT'S CURRENT POSITION
            //let action = this.get_Action(position);

            let max_actions = this.get_all_max_actions(agent);
            let index = Math.floor(Math.random() * max_actions.length);
            let action = max_actions[index];

            //GET NEW POSITION AFTER TAKING 'action'
            let new_position = this.take_action(agent, action);
           

            let visited = agent;

            agent = new_position;
            //CALL PARENT FUNCTION THAT UPDATES AGENT'S POSITION
            this.setAgent(agent, visited.x.toString() + '-' + visited.y.toString());


        }
        else {
            clearInterval(this.BEST_PATH_INTERVAL);
            this.setState({
                newMaze: true,
                mazeInProgress: false,
            })
        }


    }


    render() {
        return(
            <div className="main-container">
                <Maze
                    key={this.state.createNewMaze}
                    mode={this.state.mazeType}
                    agent={this.state.agent}
                    path={this.state.path}
                    rows={this.state.rows}
                    columns={this.state.columns}
                    start={this.state.start}
                    setMazeInfo={this.setMazeInfo}
                    showQValues={this.showQValues}
                />

                <Sidebar
                    mode={"Training"}
                    mazeComplete={this.state.mazeComplete}
                    start={this.state.start}
                    newMaze={this.state.newMaze}
                    gMessage={this.state.gameMessage}
                    setStart={this.setStart}
                    createNewMaze={this.createNewMaze}
                    trainingInfo={{Episode: this.EPISODE, Epsilon: this.EPS, mazeType: this.state.mazeType, mazeInProgress: this.state.mazeInProgress, setMazeType: this.setMazeType}}
                />
            </div>
        )
    }
}


export default MazeTraining;