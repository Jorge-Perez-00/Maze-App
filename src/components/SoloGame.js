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
        this.timeInterval = null;
        this.finished = true;

        this.keyState = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };

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
    handleOnKeyDown = (event) => {
        //clearTimeout(this.timeInterval);
        
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
                    start: (row === this.state.rows - 1 && col === this.state.columns - 1) ? false : true,
                    newMaze: (row === this.state.rows - 1 && col === this.state.columns - 1) ? true : false,
                })

            }
            //console.log(event.key);

        }



        /*
        if(this.finished) {
            clearTimeout(this.timeInterval)
            this.finished = false;
            //console.log(event.key);
            this.timeInterval = setTimeout(() => {
                //console.log(event.key);
                this.finished = true; 
            }, 100) 
        }
        */

        /*
        console.log("KEY DOWN: ", event.key);
        this.keyState[event.key] = true;
        */
    }

    /*
    handleOnKeyUp = (event) => {
        console.log("KEY UP: ", event.key);
        this.keyState[event.key] = false;
    }*/

    setStart = () => {
        this.setState({
            player: { x: 0, y: 0 },
            start: true,
            newMaze: false,
        })
        /*
        setTimeout(() => {
            this.gameLoop();
        },1)
        */
    }

    /*
    gameLoop = () => {

        const maze = this.state.maze;
        let PlayerPosition = { ...this.state.player }

        if(this.keyState["ArrowUp"] === true) {
            PlayerPosition.x--;
        }

        if(this.keyState["ArrowDown"] === true) {
            PlayerPosition.x++;
        }

        if(this.keyState["ArrowLeft"] === true) {
            PlayerPosition.y--;
        }

        if(this.keyState["ArrowRight"] === true) {
            PlayerPosition.y++;
        }


        let row = PlayerPosition.x;
        let col = PlayerPosition.y;

        if ((row !== -1 && row !== this.state.rows) && (col !== -1 && col !== this.state.columns) && maze[row][col] !== -9999) {
            this.setState({
                player: PlayerPosition,
                gameMessage: (row === this.state.rows - 1 && col === this.state.columns - 1) ? "You Won!" : "",
                start: (row === this.state.rows - 1 && col === this.state.columns - 1) ? false : true,
                newMaze: (row === this.state.rows - 1 && col === this.state.columns - 1) ? true : false,
            })

        }
        console.log("gameLoop running...");
        setTimeout(this.gameLoop, 150);
    }
    */


    stopGame = () => {
        this.setState({
            start: false,
            newMaze: true,
            gameMessage: "Out of time! You lost!",
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
                    mode={"hide"}
                    key={this.state.createMaze}
                    player={this.state.player} 
                    setMazeInfo={this.setMazeInfo}
                    handleOnKeyDown={this.handleOnKeyDown} 
                    handleOnKeyUp={this.handleOnKeyUp}
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