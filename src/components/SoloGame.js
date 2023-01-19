import { Component } from "react";

import Maze from './Maze';
import Sidebar from './Sidebar'
import MessageBox from "./MessageBox";

import MAZE_MUSIC from '../audios/maze.mp3'
import CONCLUSION_SOUND from '../audios/conclusion.mp3'


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
            showMessage: false,
            newMaze: true,

        }

        this.mazeMusic = new Audio(MAZE_MUSIC);
        this.conclusionSound = new Audio(CONCLUSION_SOUND);

    }

    componentWillUnmount() {
        if (this.mazeMusic.currentTime !== 0) {
            this.stopMusic();
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

    removeMessageBox = () => {
        this.setState({
            showMessage: false,
        })
    }

    /*----------------------------GAME SECTION--------------------------------*/

    /*
        Handles all key presses when playing the Maze game modes
    */
    handleOnKeyDown = (event) => {
        
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
                this.setState({
                    player: PlayerPosition,
                    gameMessage: (row === this.state.rows - 1 && col === this.state.columns - 1) ? "You Won!" : "",
                    showMessage: true,
                    start: (row === this.state.rows - 1 && col === this.state.columns - 1) ? false : true,
                    newMaze: (row === this.state.rows - 1 && col === this.state.columns - 1) ? true : false,
                })
                if (row === this.state.rows - 1 && col === this.state.columns - 1) {
                    this.stopMusic();
                }

            }
            //console.log(event.key);

        }
    }

    setStart = () => {
        this.setState({
            player: { x: 0, y: 0 },
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
            createMaze: this.state.createMaze === 0 ? 1 : 0,
            player: {},
            gameMessage: "",
        })
    }

    stopMusic = () => {
        this.mazeMusic.pause();
        this.mazeMusic.currentTime = 0;

        this.conclusionSound.currentTime = 0;
        this.conclusionSound.play();
    }


    render(){

        return(
            <div className="main-container">

                <MessageBox
                    open={this.state.gameMessage !== "" && this.state.showMessage}
                    message={this.state.gameMessage}
                    buttons={[{ text: "Close", onClick: this.removeMessageBox, className: "enabled" }]}
                />

                <Maze 
                    mode={"hide"}
                    key={this.state.createMaze}
                    player={this.state.player} 
                    setMazeInfo={this.setMazeInfo}
                    handleOnKeyDown={this.handleOnKeyDown} 
                    //handleOnKeyUp={this.handleOnKeyUp}
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