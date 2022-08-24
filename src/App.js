import { Component } from 'react';
import './App.css';
import Maze from'./components/Maze'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maze: [],
      agent: {x:0, y:0},
      createMaze: false,
      rows: 0,
      columns: 0,
    }
    this.agent = { x: 0, y: 0 };
    this.stack = [];
    this.firstDeadEnd = false;
    this.exitCell= {};
  }



  showAnimation = () => {
    this.timer = setInterval(() => {
      let newMaze = this.generateMaze();
      this.setState({ 
        maze: newMaze,  
        agent: this.agent,
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

    let neighbours = this.getNeighbours(position);

    let maze = [...this.state.maze];
    let totalRows = this.state.rows;
    let totalColumns = this.state.columns;

    for (let cell of neighbours) {
      if ((cell.x !== -1 && cell.x !== totalRows) && (cell.y !== -1 && cell.y !== totalColumns) && (maze[cell.x][cell.y] !== -100 ) && (cell.x !== previousPosition.x || cell.y !== previousPosition.y)) {
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
    let neighbours = this.getNeighbours(position);

    let valid_cells = [];
    let totalRows = this.state.rows;
    let totalColumns = this.state.columns;

    for(let cell of neighbours) {
      if ((cell.x !== -1 && cell.x !== totalRows) && (cell.y !== -1 && cell.y !== totalColumns) && (this.state.maze[cell.x][cell.y] === -100 ) && this.hasNoVisitedNeighbours(position, cell)) {
        valid_cells.push(cell)
      }
    }

    return valid_cells;
  }



  /**
   * 
   * @returns An updated maze board
   */
  generateMaze = () => {
    let newMaze = [...this.state.maze];

    console.log("Generating Maze...")

    if (newMaze[0][0] === -100) {
      let initial_cell = this.agent;
      this.stack.push(initial_cell);
      
    }


    //CHECK IF STACK IS EMPTTY
    if (this.stack.length !== 0) {
      let current_cell = this.stack.pop();

      //SET THE AGENT'S POSITION TO THE CURRENT/TOP CELL OF THE STACK
      this.agent = { ...current_cell };
      newMaze[current_cell.x][current_cell.y] = 1;

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
      /*
      else if (valid_cells.length === 0 && this.firstDeadEnd === false) {
        this.firstDeadEnd = true;
        //newMaze[current_cell.x][current_cell.y] = 100;
        this.exitCell = current_cell;

      }
      */
    }
    else {
      /*
        Makes sure that there is a path the leads to the last cell at the bottom right corner of the maze if the cell was not visited during the random maze generation process.
      */

      if(newMaze[this.state.rows - 1][this.state.columns - 1] !== 1) {
        newMaze[this.state.rows - 1][this.state.columns - 2] = 1;
        newMaze[this.state.rows - 1][this.state.columns - 3] = 1;
        newMaze[this.state.rows - 2][this.state.columns - 1] = 1;
        newMaze[this.state.rows - 3][this.state.columns - 1] = 1;
      }
      //SET THE EXIT OF THE MAZE
      newMaze[this.state.rows - 1][this.state.columns - 1] = 100;

      //Uncover the helper preset visited cells
      newMaze[this.state.rows - 4][this.state.columns - 1] = 1;
      newMaze[this.state.rows - 1][this.state.columns - 4] = 1;
      
      //Uncover the cells next to the helper visited cells so that the helper cells are connected to a path.
      newMaze[this.state.rows - 5][this.state.columns - 1] = 1;
      newMaze[this.state.rows - 6][this.state.columns - 1] = 1;
      newMaze[this.state.rows - 1][this.state.columns - 5] = 1;
      newMaze[this.state.rows - 1][this.state.columns - 6] = 1;
      
      //STOP INTERVAL
      clearInterval(this.timer);
    }
    return newMaze;
  }


  createBoard = () => {
    
    let setRows = 50;
    let setColumns = 50;

    let newMaze = new Array(setRows).fill(-100).map(() => new Array(setColumns).fill(-100));
   
    //Preset 2 cells as visited to help the random maze generation create a path to the final cell at the bottom right corner. 
    newMaze[setRows - 4][setColumns - 1] = 2;
    newMaze[setRows - 1][setColumns - 4] = 2;


    this.setState({
      maze: newMaze,
      createMaze: true,
      rows: setRows,
      columns: setColumns,
    })
  }


  render() {

    document.body.style.backgroundColor = "#121212"


    return (
      <div className="App">
        <h1 className='Title'>MAZE</h1>

        <button onClick={this.createBoard} >Create Board</button>
        <button onClick={this.showAnimation} >Generate Maze</button>
        <button onClick={() => {clearInterval(this.timer)}} >STOP</button>

        {this.state.createMaze && <Maze maze={this.state.maze} agent={this.agent}/>}

      </div>
    );
  }
}

export default App;
