


import { Component } from "react";

import Maze from './Maze';
import Sidebar from './Sidebar'


class PlayerVsPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            maze: [],
            player: {},
            player2: {},
            rows: 30,
            columns: 30,
            createNewMaze: 0,

            start: true,
            gameMessage: "",
            newMaze: true,

        }

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
            let PlayerPosition = { ...this.state.player};
            let Player2Position = {...this.state.player2};

            let p1 = false;
            let p2 = false;

            if(event.key === "w") {
                p2 = true;
                Player2Position.x--;
            }
            else if(event.key === "s") {
                p2 = true;
                Player2Position.x++;
            }
            else if (event.key === "a") {
                p2 = true;
                Player2Position.y--;
            }
            else if (event.key === "d") {
                p2 = true;
                Player2Position.y++;
            }



            if (event.key === "ArrowUp") {
                p1 = true;
                PlayerPosition.x--;
            }
            else if (event.key === "ArrowDown") {
                p1 = true;
                PlayerPosition.x++;

            }
            else if (event.key === "ArrowLeft") {
                p1 = true;
                PlayerPosition.y--;

            }
            else if (event.key === "ArrowRight") {
                p1 = true;
                PlayerPosition.y++;

            }

            let p1_row = PlayerPosition.x;
            let p1_col = PlayerPosition.y;

            if ((p1_row !== -1 && p1_row !== this.state.rows) && (p1_col !== -1 && p1_col !== this.state.columns) && maze[p1_row][p1_col] !== -9999 && p1) {
                console.log(PlayerPosition)
                this.setState({
                    player: PlayerPosition,
                    gameMessage: (p1_row === this.state.rows - 1 && p1_col === this.state.columns - 1) ? "Player 1 Won!" : "",
                    start: (p1_row === this.state.rows - 1 && p1_col === this.state.columns - 1) ? false : true,
                    newMaze: (p1_row === this.state.rows - 1 && p1_col === this.state.columns - 1) ? true : false,
                })

            }

            let p2_row = Player2Position.x;
            let p2_col = Player2Position.y;

            if ((p2_row !== -1 && p2_row !== this.state.rows) && (p2_col !== -1 && p2_col !== this.state.columns) && maze[p2_row][p2_col] !== -9999 && p2) {

                this.setState({
                    player2: Player2Position,
                    gameMessage: (p2_row === this.state.rows - 1 && p2_col === this.state.columns - 1) ? "Player 2 Won!" : "",
                    start: (p2_row === this.state.rows - 1 && p2_col === this.state.columns - 1) ? false : true,
                    newMaze: (p2_row === this.state.rows - 1 && p2_col === this.state.columns - 1) ? true : false,
                })

            }

            //console.log(event.key);

        }
    }

    setStart = () => {
        this.setState({
            player: { x:0, y:0 },
            player2: { x:0, y:0 },
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
            createNewMaze: this.state.createNewMaze === 0 ? 1 : 0,
            player: {},
            player2: {},
            gameMessage: "",
        })
    }


    render() {

        return (
            <div className="main-container">
                <Maze
                    mode={"hide"}
                    key={this.state.createNewMaze}
                    player={this.state.player}
                    player2={this.state.player2}
                    setMazeInfo={this.setMazeInfo}
                    ArrowKeyHandler={this.ArrowKeyHandler}
                    rows={this.state.rows}
                    columns={this.state.columns}
                    start={this.state.start}
                />


                <Sidebar
                    mode={"player vs player"}
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


export default PlayerVsPlayer;