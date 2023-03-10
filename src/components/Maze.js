import { Component } from "react";



class Maze extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //maze: [],
            maze: new Array(this.props.rows).fill(-9999).map(() => new Array(this.props.columns).fill(-9999)),
            builder: {},
            createMaze: false,
            rows: this.props.rows,
            columns: this.props.columns,
            start: false,
            gameMessage: "",
            clicked: false,
        }

        //MAZE BUILDER AGENT
        this.builder = { x: 0, y: 0 };
        //CELL STACK THAT HELPS THE MAZE BUILDER BUILD A RANDOM MAZE
        this.stack = [];

        this.Maze = new Array(this.props.rows).fill(-9999).map(() => new Array(this.props.columns).fill(-9999));

    }

    
    componentDidMount() {
     
        //SHOW MAZE GENERATION FOR THE TRAINING MODE
        if(this.props.mode === "show") {
            //console.log("GENERATING MAZE WITH ANIMATION...");
            this.timeout = setTimeout(() => {
                this.Maze[this.props.rows - 4][this.props.columns - 1] = 2;
                this.Maze[this.props.rows - 1][this.props.columns - 4] = 2;

                this.startGeneration();
            }, 1)
            
        }
        //HIDE MAZE GENERATION FOR ALL GAME MODES
        if(this.props.mode === "hide") {
            //console.log("GENERATING MAZE WITHOUT ANIMATION...");
            this.generateMazeBTS();
        }
        //console.log("maze running...")
       
    }


    componentWillUnmount() {
        clearTimeout(this.timeout);
    }
    

    startGeneration = () => {

        this.timer = setInterval(() => {
            let newMaze = this.generateMaze();
            let row = this.state.rows - 1;
            let column = this.state.columns - 1;

            //this.props.setAgentsPosition(this.agent);
            
            this.setState({
                maze: newMaze,
                builder: this.builder,
                mazeComplete: newMaze[row][column] === 1000 ? true : false,
            });
            
        }, 10)

    }




    /*
      Returns an array of all the neighbours of the cell 'position' (TOP CELL, BOTTOM CELL, LEFT CELL, RIGHT CELL)
    */
    getNeighbours = (position) => {
        //TOP CELL
        let topCell = { ...position };
        topCell.x--;

        //BOTTOM CELL
        let bottomCell = { ...position };
        bottomCell.x++;

        //LEFT CELL
        let leftCell = { ...position };
        leftCell.y--;

        //RIGHT CELL
        let rightCell = { ...position };
        rightCell.y++;

        return [topCell, bottomCell, leftCell, rightCell];
    }


    /*
      Returns false if any of the neighbouring cells of 'position' has already been visited.
  
      Returns true if 'position' has no visited neighbours.
    */
    hasNoVisitedNeighbours = (previousPosition, position) => {
        let maze = this.Maze;


        let neighbours = this.getNeighbours(position);

        //let maze = [...this.state.maze];
        let totalRows = this.state.rows;
        let totalColumns = this.state.columns;

        for (let cell of neighbours) {
            if ((cell.x !== -1 && cell.x !== totalRows) && (cell.y !== -1 && cell.y !== totalColumns) && (maze[cell.x][cell.y] !== -9999) && (cell.x !== previousPosition.x || cell.y !== previousPosition.y)) {
                return false;
            }
        }

        return true;
    }

    /*
      Returns an array of valid neighbouring cells at the current 'position'
      A neighbour cell is valid if:
      - It is not a cell outside the maze.
      - It has not been visited yet
      - If the unvisited neighbour cell also has no unvisited neighbours.
    */
    checkNeighbours = (position) => {
        let maze = this.Maze;

        let neighbours = this.getNeighbours(position);

        let valid_cells = [];
        let totalRows = this.state.rows;
        let totalColumns = this.state.columns;

        for (let cell of neighbours) {
            if ((cell.x !== -1 && cell.x !== totalRows) && (cell.y !== -1 && cell.y !== totalColumns) && (/*this.state.*/maze[cell.x][cell.y] === -9999) && this.hasNoVisitedNeighbours(position, cell)) {
                valid_cells.push(cell)
            }
        }

        return valid_cells;
    }



    generateMazeBTS = () => {
        //console.log("Generating Maze Behind the Scenes...")
        let newMaze = this.Maze;

        //SETUP MAZE
        newMaze[this.props.rows - 4][this.props.columns - 1] = 2;
        newMaze[this.props.rows - 1][this.props.columns - 4] = 2;

        //SETUP STACK
        this.stack.push(this.builder);

        while(this.stack.length !== 0) {
            let current_cell = this.stack.pop();

            //SET THE AGENT'S POSITION TO THE CURRENT/TOP CELL OF THE STACK
            this.builder = { ...current_cell };
            newMaze[current_cell.x][current_cell.y] = -1;

            /*
            GET AN ARRAY OF ALL THE UNVISITED NEIGHBOURS THAT ALSO HAS NO UNVISTED NEIGHBOURS OF ITS OWN, EXCLUDING THE current_cell
            EMPTY ARRAY = NO VALID NEIGHBOURS TO MOVE TO
            NON EMPTY ARRAY = VALID NEIGHBOURS/CELLS TO MOVE TO. (AT LEAST 1 VALID CELL TO MOVE ON TO)
            */
            let valid_cells = this.checkNeighbours(current_cell);
            if (valid_cells.length !== 0) {
                this.stack.push(current_cell);

                let randomMove = Math.floor(Math.random() * valid_cells.length);

                this.stack.push(valid_cells[randomMove]);

            }
        }

        if (newMaze[this.state.rows - 1][this.state.columns - 1] !== -1) {
            newMaze[this.state.rows - 1][this.state.columns - 2] = -1;
            newMaze[this.state.rows - 1][this.state.columns - 3] = -1;
            newMaze[this.state.rows - 2][this.state.columns - 1] = -1;
            newMaze[this.state.rows - 3][this.state.columns - 1] = -1;
        }
        //SET THE EXIT OF THE MAZE
        newMaze[this.state.rows - 1][this.state.columns - 1] = 1000;

        //Uncover the helper preset visited cells
        newMaze[this.state.rows - 4][this.state.columns - 1] = -1;
        newMaze[this.state.rows - 1][this.state.columns - 4] = -1;

        //Uncover the cells next to the helper visited cells so that the helper cells are connected to a path.
        newMaze[this.state.rows - 5][this.state.columns - 1] = -1;
        newMaze[this.state.rows - 6][this.state.columns - 1] = -1;
        newMaze[this.state.rows - 1][this.state.columns - 5] = -1;
        newMaze[this.state.rows - 1][this.state.columns - 6] = -1;


        this.builder = {};
        
        //SET A NEGATIVE VALUE TO ALL DEADENDS IN THE MAZE
        this.setRandomOpenCells();

        if(!this.props.multiplayerMaze) {
            this.setState({
                maze: newMaze,
            }) 
        }
        
        
        //console.log("FINISHED BUILDING MAZE")
        //PARENT FUNCTION CALLBACK
        //THIS CALL WILL SEND THE RANDOM COMPLETED MAZE BACK TO THE PARENT
        this.props.setMazeInfo(newMaze)
    }

    /**
     * 
     * @returns An updated maze board
     */
    generateMaze = () => {
        //let newMaze = [...this.state.maze];

        let newMaze = this.Maze;

        //console.log("Generating Maze...")

        if (newMaze[0][0] === -9999) {
            let initial_cell = this.builder;
            this.stack.push(initial_cell);

        }


        //CHECK IF STACK IS EMPTTY
        if (this.stack.length !== 0) {
            let current_cell = this.stack.pop();

            //SET THE AGENT'S POSITION TO THE CURRENT/TOP CELL OF THE STACK
            this.builder = { ...current_cell };
            newMaze[current_cell.x][current_cell.y] = -1;

            /*
            GET AN ARRAY OF ALL THE UNVISITED NEIGHBOURS THAT ALSO HAS NO UNVISTED NEIGHBOURS OF ITS OWN, EXCLUDING THE current_cell
            EMPTY ARRAY = NO VALID NEIGHBOURS TO MOVE TO
            NON EMPTY ARRAY = VALID NEIGHBOURS/CELLS TO MOVE TO. (AT LEAST 1 VALID CELL TO MOVE ON TO)
            */
            let valid_cells = this.checkNeighbours(current_cell);
            if (valid_cells.length !== 0) {
                this.stack.push(current_cell);

                let randomMove = Math.floor(Math.random() * valid_cells.length);

                this.stack.push(valid_cells[randomMove]);

            }
        }
        else {
            /*
              Makes sure that there is a path the leads to the last cell at the bottom right corner of the maze if the cell was not visited during the random maze generation process.
            */

            if (newMaze[this.state.rows - 1][this.state.columns - 1] !== -1) {
                newMaze[this.state.rows - 1][this.state.columns - 2] = -1;
                newMaze[this.state.rows - 1][this.state.columns - 3] = -1;
                newMaze[this.state.rows - 2][this.state.columns - 1] = -1;
                newMaze[this.state.rows - 3][this.state.columns - 1] = -1;
            }
            //SET THE EXIT OF THE MAZE
            newMaze[this.state.rows - 1][this.state.columns - 1] = 1000;

            //Uncover the helper preset visited cells
            newMaze[this.state.rows - 4][this.state.columns - 1] = -1;
            newMaze[this.state.rows - 1][this.state.columns - 4] = -1;

            //Uncover the cells next to the helper visited cells so that the helper cells are connected to a path.
            newMaze[this.state.rows - 5][this.state.columns - 1] = -1;
            newMaze[this.state.rows - 6][this.state.columns - 1] = -1;
            newMaze[this.state.rows - 1][this.state.columns - 5] = -1;
            newMaze[this.state.rows - 1][this.state.columns - 6] = -1;


            this.builder = {};
            //this.props.setMazeInfo(/*{x:0, y:0},*/ newMaze)

            //STOP INTERVAL
            clearInterval(this.timer);

            //SET A NEGATIVE VALUE TO ALL DEADENDS IN THE MAZE
            this.setRandomOpenCells();

            //THIS CALL WILL SEND THE RANDOM COMPLETED MAZE BACK TO THE PARENT
            this.props.setMazeInfo(newMaze)

        }
        return newMaze;
    }

    setRandomOpenCells = () => {
        //console.log("SETTING RANDOM OPEN CELLS")
        let cells = [];

        let maze = this.Maze;
        let rows = this.state.rows;
        let cols = this.state.columns;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let position = { x: row, y: col };
                if(maze[position.x][position.y] === -9999) {
                    let neighbours = this.countNeighbours(position);
                    if(neighbours >= 3) {
                        cells.push(position);
                    }

                }
            }
        }

        for(let count = 0; count < 10; count++) {
            let index = Math.floor(Math.random() * cells.length);
            let cell = cells[index];
            maze[cell.x][cell.y] = -1; 
        }


    }

    countNeighbours = (position) => {
        let maze = this.Maze;

        let neighbours = this.getNeighbours(position);
        let totalNeighbours = 0;
        let totalRows = this.state.rows;
        let totalColumns = this.state.columns;
     
        for (let cell of neighbours) {
            if ((cell.x !== -1 && cell.x !== totalRows) && (cell.y !== -1 && cell.y !== totalColumns) && (maze[cell.x][cell.y] !== -9999)) {
                totalNeighbours++;
            }
        }

        return totalNeighbours;
    }

    showMessage = () => {
        this.setState({
            clicked: false,
        })
        //console.log("Maze lost its focus!");
    }

    deleteMessage = () => {
        this.setState({
            clicked: true, 
        })

        
    }

    


    render() {

        let message;
        
        if(!this.state.clicked && this.props.start && !this.props.agent) {
            message = 
            <>
                <div className="maze-message-background">

                </div>
                <h1 className="click-message" >CLICK MAZE TO MOVE</h1>
            </>
        }
        
        
       

        //PROPS CHARACTERS
        let agent = this.props.agent ? this.props.agent : {};
        let player = this.props.player ? this.props.player : {};
        let player2 = this.props.player2 ? this.props.player2 : {}; 
        let player3 = this.props.player3 ? this.props.player3 : {}; 
        let player4 = this.props.player4 ? this.props.player4 : {}; 
        let countdown = this.props.countdown ? this.props.countdown : 0;

        let path = this.props.path ? this.props.path : new Set();
       

        //PROP FUNCTIONS
        let handleOnKeyDown = this.props.handleOnKeyDown ? this.props.handleOnKeyDown : null;
        let handleOnKeyUp = this.props.handleOnKeyUp ? this.props.handleOnKeyUp : null;

        let maze = this.props.multiplayerMaze ? this.props.multiplayerMaze : this.state.maze;
        return (
            <div className="maze-container" tabIndex={-1} onKeyDown={handleOnKeyDown} onKeyUp={handleOnKeyUp} onClick={this.deleteMessage} onBlur={!this.props.agent ? this.showMessage : null} >

                {maze.map((row, rowID) =>
                    <div key={rowID} className={"rows"}>
                        {row.map((value, cellID) =>
                            <div key={cellID} id={rowID.toString() + "-" + cellID.toString()} onClick={this.props.showQValues} className={`cell ${value === 1000 ? "Goal" : value === -1 ? "Path" : value === -500 ? "Path" : ""}`}>
                               
                                {
                                    ((path.has(rowID.toString() + '-' + cellID.toString()) && this.state.maze[rowID][cellID] !== -9999) && <h2 className="player agent-path"></h2>)

                                }
                                { (this.state.builder.x === rowID && this.state.builder.y === cellID) ? <h2 className="player builder">B</h2> : null }
                                { (agent.x === rowID && agent.y === cellID) ? <h2 className="player agent">A</h2> : null }
                                { (player4.x === rowID && player4.y === cellID) ? 
                                    <h2 className={`player p4 ${player4.player ? player4.player : ""}`}>P4
                                        {player4.player && player4.player === 'you' ? <div className="playerBox">You</div> : null}
                                    </h2> : null}
                                
                                { (player3.x === rowID && player3.y === cellID) ? 
                                    <h2 className={`player p3 ${player3.player ? player3.player : ""}`}>P3
                                        {player3.player && player3.player === 'you' ? <div className="playerBox">You</div> : null}
                                    </h2> : null}
                                
                                { (player2.x === rowID && player2.y === cellID) ? 
                                    <h2 className={`player p2 ${player2.player ? player2.player : ""}`}>P2
                                        {player2.player && player2.player === 'you' ? <div className="playerBox">You</div> : null}
                                    </h2> : null}
                                
                                { (player.x === rowID && player.y === cellID) ? 
                                    <h2 className={`player p1 ${player.player ? player.player : ""}`}>P1
                                        {player.player && player.player === 'you' ? <div className="playerBox">You</div> : null}
                                    </h2> : null }

                            </div>
                        )}
                    </div>
                )}
                {message}
                {countdown !== 0 && 
                <>
                    <div className="maze-message-background">

                    </div>
                    <div className="multiplayer-countdown-container">
                        <h1 className="multiplayer-countdown" >{countdown}</h1>
                    </div>
                </>}
            </div>
        )
    }
    
}


export default Maze;