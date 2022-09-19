import { Component } from "react";

import Maze from './Maze';
import Sidebar from './Sidebar'


class SoloGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            maze: [],
            player: {},
            rows: 30,
            columns: 30,
            createMaze: 0,

            start: true,
            gameMessage: "",
            newMaze: true,

        }

    }

   
    setPlayersNewPosition = (position) => {
        this.setState({
            player: position,
        })
    }

    setMazeInfo = (maze) => {
        this.setState({
            maze: maze,
            start: false,
        })
    }

    /*----------------------------GAME SECTION--------------------------------*/


    /*
            Handles all key presses when playing the Maze game modes
          */
    ArrowKeyHandler = (event) => {
        
        if (this.state.start) {
            const maze = this.state.maze;
            let PlayerPosition = { ...this.state.player }

            if (event.key === "ArrowUp") {
                PlayerPosition.x--;
            }
            else if (event.key === "ArrowDown") {
                PlayerPosition.x++;

            }
            else if (event.key === "ArrowLeft") {
                PlayerPosition.y--;

            }
            else if (event.key === "ArrowRight") {
                PlayerPosition.y++;

            }

            let row = PlayerPosition.x;
            let col = PlayerPosition.y;

            if ((row !== -1 && row !== this.state.rows) && (col !== -1 && col !== this.state.columns) /*&& maze[row][col] !== -9999*/) {
                this.setState({
                    player: PlayerPosition,
                    gameMessage: (row === this.state.rows - 1 && col === this.state.columns - 1) ? "You Won!" : "",
                    start: (row === this.state.rows - 1 && col === this.state.columns - 1) ? false : true,
                    newMaze: (row === this.state.rows - 1 && col === this.state.columns - 1) ? true : false,
                })

            }
            console.log(event.key);

        }
    }

    setStart = () => {
        this.setState({
            player: { x: 0, y: 0 },
            start: true,
            newMaze: false,
        })
    }

    stopGame = () => {
        this.setState({
            start: false,
            newMaze: true,
            gameMessage: "You ran out of time! You lost!",
        })
    }

    createNewMaze = () => {
        this.setState({
            createMaze: this.state.createMaze === 0 ? 1 : 0,
            player: {},
            gameMessage: "",
        })
    }


    render(){

        return(
            <div className="main-container">
                <Maze 
                    key={this.state.createMaze}
                    player={this.state.player} 
                    setMazeInfo={this.setMazeInfo}
                    ArrowKeyHandler={this.ArrowKeyHandler} 
                    rows={this.state.rows} 
                    columns={this.state.columns}
                    start={this.state.start}
                />

                
                <Sidebar 
                    start={this.state.start} 
                    newMaze={this.state.newMaze} 
                    gMessage={this.state.gameMessage}
                    setStart={this.setStart} 
                    stopGame={this.stopGame} 
                    createNewMaze={this.createNewMaze}
                />
                
            </div>
         
        )
    }
}


export default SoloGame;