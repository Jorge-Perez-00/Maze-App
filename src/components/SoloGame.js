import { Component } from "react";

import Maze from './Maze';
import Timer from './Timer';
import Sidebar from './Sidebar'


class SoloGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            maze: [],
            player: {},
            mazeComplete: false,
            rows: 30,
            columns: 30,
            createNewMaze: 0,

            start: false,
            gameMessage: "",
            wonGame: false,

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
            //player: position,
            mazeComplete: true,
        })
    }

    /*----------------------------GAME SECTION--------------------------------*/


    /*
            Handles all key presses when playing the Maze game modes
          */
    ArrowKeyHandler = (event) => {
        /*
        if (!this.state.start && event.key === " " && !this.state.wonGame) {
            this.setStart();
            console.log("SPACE BAR")
        }
        */

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

            if ((row !== -1 && row !== this.state.rows) && (col !== -1 && col !== this.state.columns) && maze[row][col] !== -9999) {
                //this.props.setPlayersNewPosition(PlayerPosition);

                this.setState({
                    player: PlayerPosition,
                    gameMessage: (row === this.state.rows - 1 && col === this.state.columns - 1) ? "You Won!" : "",
                    start: (row === this.state.rows - 1 && col === this.state.columns - 1) ? false : true,
                    wonGame: (row === this.state.rows - 1 && col === this.state.columns - 1) ? true : false,
                })

            }
            console.log(event.key);

        }
    }

    setStart = () => {
        this.setState({
            player: { x: 0, y: 0 },
            start: true,
        })
    }

    stopGame = () => {
        this.setState({
            start: false,
            gameMessage: "You ran out of time! You lost!",
        })
    }

    createNewMaze = () => {
        this.setState({
            createNewMaze: this.state.createNewMaze === 0 ? 1 : 0,
            player: {},
            mazeComplete: false,
            gameMessage: "",
            wonGame: false,
        })
    }


    render(){

        /*
        let startButton;
        if (this.state.mazeComplete && !this.state.start && !this.state.wonGame) {
            startButton = <button onClick={this.setStart} className="game-buttons">START</button>

        }
        else {
            startButton = <button className="game-buttons disabled-button">START</button>

        }

        let gameMessage;
        if (this.state.gameMessage !== "" && this.state.start === false && this.state.mazeComplete) {
            gameMessage = <h1 className='gameMessage' >{this.state.gameMessage}</h1>
        }
        */

        return(
            <div className="main-container">
                <Maze 
                    key={this.state.createNewMaze}
                    player={this.state.player} 
                    setMazeInfo={this.setMazeInfo}
                    ArrowKeyHandler={this.ArrowKeyHandler} 
                    rows={this.state.rows} 
                    columns={this.state.columns}
                    start={this.state.start}
                />

                
                <Sidebar 
                    mazeComplete={this.state.mazeComplete}
                    start={this.state.start} 
                    wonGame={this.state.wonGame} 
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