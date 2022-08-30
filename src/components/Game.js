import { Component } from "react";
import React from "react";
import Timer from "./Timer";


class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
            start: false,
            gameMessage: "",
            wonGame: false,
        }
        this.focusRef = React.createRef();
    }


    componentDidMount() {
        this.setFocus();
        //this.focusRef.current.focus();
    }

    setFocus = () => {
        this.focusRef.current.focus();
    }

    /*
        Handles all key presses when playing the Maze game modes
      */
    ArrowKeyHandler = (event) => {
        if(!this.state.start && event.key === " " && !this.state.wonGame) {
            this.setStart();
            console.log("SPACE BAR")
        }

        if (this.state.start) {
            const maze = this.props.maze;
            let PlayerPosition = { ...this.props.player }

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

            if ((row !== -1 && row !== this.props.rows) && (col !== -1 && col !== this.props.columns) && maze[row][col] !== -100) {
                this.props.setPlayersNewPosition(PlayerPosition);
                
                this.setState({
                    gameMessage: (row === this.props.rows - 1 && col === this.props.columns - 1) ? "You Won!" : "",
                    start: (row === this.props.rows - 1 && col === this.props.columns - 1) ? false : true,
                    wonGame: (row === this.props.rows - 1 && col === this.props.columns - 1) ? true : false,
                })
                
            }
            console.log(event.key);

        }
    }

    setStart = () => {
        this.props.setPlayersNewPosition({x:0, y:0});
        this.setState({
            start: true,
        })
    }

    stopGame = () => {
        this.setState({
            start: false,
            gameMessage: "You ran out of time! You lost!",
        })
    }

    newMaze = () => {
        this.setState({
            gameMessage: "",
            wonGame: false,
        })
        this.setFocus();
        this.props.createNewMaze();
    }

    render() {
        let mazeComplete = this.props.mazeComplete;

        let startButton;
        if(mazeComplete && !this.state.start && !this.state.wonGame) {
            startButton = <button onClick={this.setStart}>START</button>

        }
        else {
            startButton = <button className="disabled">START</button>

        }

        let gameMessage;
        if(this.state.gameMessage !== "" && this.state.start === false && mazeComplete) {
            gameMessage = <h1 className='gameMessage' >{this.state.gameMessage}</h1>
        }



        return(
            <div className="game-container" >
                <div ref={this.focusRef} tabIndex={-1} onKeyDown={this.ArrowKeyHandler}>
                    <h1>randomeogheoifjeoif</h1>
                </div>
                {this.state.start ? <Timer onZero={this.stopGame} /> : <h1 className="timer">0:00</h1>}
                <button  /*ref = {this.focusRef}*/ onClick={(mazeComplete && !this.state.start && !this.state.wonGame) ? this.setStart : null} className={(mazeComplete && !this.state.start && !this.state.wonGame) ? "" : "disabled"} >START</button>
                {this.state.wonGame ? <button onClick={this.newMaze} >New Maze</button> : <button className="disabled" >New Maze</button> }
                {gameMessage}
            </div>
        )
    }
}

export default Game;