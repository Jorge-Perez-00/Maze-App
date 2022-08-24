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
    this.visited = new Set();
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



  hasNoVisitedNeighbours = (previousPosition, position) => {

    let neighbours = this.getNeighbours(position);
    /*
    //UP
    let tempCellOne = { ...position };
    tempCellOne.x--;

    //DOWN
    let tempCellTwo = { ...position };
    tempCellTwo.x++;

    //LEFT
    let tempCellThree = { ...position };
    tempCellThree.y--;

    //RIGHT
    let tempCellFour = { ...position };
    tempCellFour.y++;
    */
    let maze = [...this.state.maze];
    let totalRows = this.state.rows;
    let totalColumns = this.state.columns;

    for(let cell of neighbours) {
      if ((cell.x !== -1 && cell.x !== totalRows) && (cell.y !== -1 && cell.y !== totalColumns) && (maze[cell.x][cell.y] === 1) && (cell.x !== previousPosition.x || cell.y !== previousPosition.y)) {
        return false;
      }
    }

    return true;

    /*
    if ((tempCellOne.x !== -1 && tempCellOne.x !== totalRows) && (maze[tempCellOne.x][tempCellOne.y] === 1) && (tempCellOne.x !== previousPosition.x || tempCellOne.y !== previousPosition.y )) {
      return false;
    }
    else if ((tempCellTwo.x !== -1 && tempCellTwo.x !== totalRows) && (maze[tempCellTwo.x][tempCellTwo.y] === 1) && (tempCellTwo.x !== previousPosition.x || tempCellTwo.y !== previousPosition.y)) {
      return false;
    }
    else if ((tempCellThree.y !== -1 && tempCellThree.y !== totalColumns) && (maze[tempCellThree.x][tempCellThree.y] === 1) && (tempCellThree.x !== previousPosition.x || tempCellThree.y !== previousPosition.y)) {
      return false;
    }
    else if ((tempCellFour.y !== -1 && tempCellFour.y !== totalColumns) && (maze[tempCellFour.x][tempCellFour.y] === 1) && (tempCellFour.x !== previousPosition.x || tempCellFour.y !== previousPosition.y)) {
      return false;
    }
    else {
      return true;
    }

    */
  }
    

  getNeighbours = (position) => {
    let ListOfNeighbours = [];

    //TOP CELL
    let tempCellOne = { ...position };
    tempCellOne.x--;

    //DOWN CELL
    let tempCellTwo = { ...position };
    tempCellTwo.x++;

    //LEFT CELL
    let tempCellThree = { ...position };
    tempCellThree.y--;

    //RIGHT CELL
    let tempCellFour = { ...position };
    tempCellFour.y++;

    ListOfNeighbours.push(tempCellOne);
    ListOfNeighbours.push(tempCellTwo);
    ListOfNeighbours.push(tempCellThree);
    ListOfNeighbours.push(tempCellFour);

    return ListOfNeighbours;

  }


  checkNeighbours = (position) => {
    let neighbours = this.getNeighbours(position);
    let valid_cells = [];
    /*
    //UP
    let tempCellOne = { ...position };
    tempCellOne.x--;

    //DOWN
    let tempCellTwo = { ...position };
    tempCellTwo.x++;

    //LEFT
    let tempCellThree = { ...position };
    tempCellThree.y--;

    //RIGHT
    let tempCellFour = { ...position };
    tempCellFour.y++;
    */

    let totalRows = this.state.rows;
    let totalColumns = this.state.columns;

    for(let cell of neighbours) {
      if ((cell.x !== -1 && cell.x !== totalRows) && (cell.y !== -1 && cell.y !== totalColumns) && (this.state.maze[cell.x][cell.y] !== 1) && this.hasNoVisitedNeighbours(position, cell)) {
        valid_cells.push(cell)
      }
    }

    

    
    /*
    if ((tempCellOne.x !== -1 && tempCellOne.x !==  totalRows) &&  (this.state.maze[tempCellOne.x][tempCellOne.y] !== 1) && this.hasNoVisitedNeighbours(position, tempCellOne)) {

      valid_cells.push(tempCellOne);
    }

    
    if ((tempCellTwo.x !== -1 && tempCellTwo.x !== totalRows) && (this.state.maze[tempCellTwo.x][tempCellTwo.y] !== 1) && this.hasNoVisitedNeighbours(position, tempCellTwo)) {

      valid_cells.push(tempCellTwo);
    }

    
    if ((tempCellThree.y !== -1 && tempCellThree.y !== totalColumns) && (this.state.maze[tempCellThree.x][tempCellThree.y] !== 1) && this.hasNoVisitedNeighbours(position, tempCellThree)) {

      valid_cells.push(tempCellThree);
    }

    if ((tempCellFour.y !== -1 && tempCellFour.y !== totalColumns) && (this.state.maze[tempCellFour.x][tempCellFour.y] !== 1) && this.hasNoVisitedNeighbours(position, tempCellFour)) {

      valid_cells.push(tempCellFour);

    }
    */

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
        //newMaze[current_cell.x][current_cell.y] = 1;

        let randomMove = Math.floor(Math.random() * valid_cells.length);

        this.stack.push(valid_cells[randomMove]);

      }
      else {
        //newMaze[current_cell.x][current_cell.y] = 1;
      }

    }
    else {
      newMaze[this.state.rows - 1][this.state.columns - 1] = 100;

      //STOP INTERVAL FROM RUNNING
      clearInterval(this.timer);
    }
    //console.log("X:", agentPosition.x, "Y:", agentPosition.y);
    return newMaze;
  }


  createBoard = () => {
    //let copy = [...this.state.board];
    //const newBoard = new Array(10).fill(0).map(() => new Array(10).fill(0));

    if (this.visited.size !== 0) {
      this.visited = new Set();
    }

    let setRows = 50;
    let setColumns = 50;

    let newMaze = new Array(setRows).fill(-100).map(() => new Array(setColumns).fill(-100));

    //newMaze[2][0] = 1;
    //newMaze[0][2] = 1;
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
