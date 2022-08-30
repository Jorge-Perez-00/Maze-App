import { Component } from "react";

import Maze from './Maze';
import Timer from './Timer';
import Game from './Game';


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

            if ((row !== -1 && row !== this.state.rows) && (col !== -1 && col !== this.state.columns) && maze[row][col] !== -100) {
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
                <Game
                    player={this.state.player}
                    maze={this.state.maze}
                    mazeComplete={this.state.mazeComplete}
                    setPlayersNewPosition={this.setPlayersNewPosition}
                    rows={this.state.rows}
                    columns={this.state.columns}
                    createNewMaze={this.createNewMaze}

                />
        */
        let startButton;
        if (this.state.mazeComplete && !this.state.start && !this.state.wonGame) {
            startButton = <button onClick={this.setStart}>START</button>

        }
        else {
            startButton = <button className="disabled-button">START</button>

        }

        let gameMessage;
        if (this.state.gameMessage !== "" && this.state.start === false && this.state.mazeComplete) {
            gameMessage = <h1 className='gameMessage' >{this.state.gameMessage}</h1>
        }

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

                <div className="game-info-container" >
                    {this.state.start ? <Timer onZero={this.stopGame} /> : <h1 className="timer">0:00</h1>}
                    {startButton}
                    {this.state.wonGame ? <button onClick={this.createNewMaze} >New Maze</button> : <button className="disabled-button" >New Maze</button>}
                    {gameMessage}
                </div>
                
                
            </div>
         
        )
    }
}


export default SoloGame;