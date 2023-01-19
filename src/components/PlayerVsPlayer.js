
import { Component } from "react";

import Maze from './Maze';
import Sidebar from './Sidebar'
import MessageBox from './MessageBox';

import MAZE_MUSIC from '../audios/maze.mp3'
import CONCLUSION_SOUND from '../audios/conclusion.mp3'

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
            showMessage: false,
            newMaze: true,

        }

        this.mazeMusic = new Audio(MAZE_MUSIC);
        this.conclusionSound = new Audio(CONCLUSION_SOUND);

    }

    componentWillUnmount() {
        if(this.mazeMusic.currentTime !== 0 ) {
            this.stopMusic();
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
    handleOnKeyDown = (event) => {

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

                this.setState({
                    player: PlayerPosition,
                    gameMessage: (p1_row === this.state.rows - 1 && p1_col === this.state.columns - 1) ? "Player 1 Won!" : "",
                    showMessage: true,
                    start: (p1_row === this.state.rows - 1 && p1_col === this.state.columns - 1) ? false : true,
                    newMaze: (p1_row === this.state.rows - 1 && p1_col === this.state.columns - 1) ? true : false,
                })
                if (p1_row === this.state.rows - 1 && p1_col === this.state.columns - 1) {
                    this.stopMusic();
                }

            }

            let p2_row = Player2Position.x;
            let p2_col = Player2Position.y;

            if ((p2_row !== -1 && p2_row !== this.state.rows) && (p2_col !== -1 && p2_col !== this.state.columns) && maze[p2_row][p2_col] !== -9999 && p2) {

                this.setState({
                    player2: Player2Position,
                    gameMessage: (p2_row === this.state.rows - 1 && p2_col === this.state.columns - 1) ? "Player 2 Won!" : "",
                    showMessage: true,
                    start: (p2_row === this.state.rows - 1 && p2_col === this.state.columns - 1) ? false : true,
                    newMaze: (p2_row === this.state.rows - 1 && p2_col === this.state.columns - 1) ? true : false,
                })
                if (p2_row === this.state.rows - 1 && p2_col === this.state.columns - 1) {
                    this.stopMusic();
                }

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

        this.mazeMusic.currentTime = 0;
        this.mazeMusic.play();
    }

    stopGame = () => {
        this.setState({
            start: false,
            newMaze: true,
            gameMessage: "Out of time! You lost!",
            showMessage: true,
        })
        this.stopMusic();
    }

    createNewMaze = () => {
        this.setState({
            createNewMaze: this.state.createNewMaze === 0 ? 1 : 0,
            player: {},
            player2: {},
            gameMessage: "",
        })
    }

    removeMessageBox = () => {
        this.setState({
            showMessage: false,
        })
    }

    stopMusic = () => {
        this.mazeMusic.pause();
        this.mazeMusic.currentTime = 0;

        this.conclusionSound.currentTime = 0;
        this.conclusionSound.play();
    }


    render() {

        return (
            <div className="main-container">

                <MessageBox 
                    open={this.state.gameMessage !== "" && this.state.showMessage}
                    message={this.state.gameMessage}
                    buttons={[{ text: "Close", onClick: this.removeMessageBox, className: "enabled" }]}
                />

                <Maze
                    mode={"hide"}
                    key={this.state.createNewMaze}
                    player={this.state.player}
                    player2={this.state.player2}
                    setMazeInfo={this.setMazeInfo}
                    handleOnKeyDown={this.handleOnKeyDown}
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