import { Component } from "react";

import Maze from './Maze';
import Sidebar from './Sidebar'
import Agent from './Agent'


class MazeTraining extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            agent2: {},
            maze: [],
            path: new Set(),
            mazeComplete: false,
            rows: 30,
            columns: 30,
            start: false,
            createNewMaze: 0,
            start: false,
            gameMessage: "",
        }
    }


    resetPath = () => {
        this.setState({
            path: new Set()
        })
    }

    setPath = (stringPosition) => {
        let copyPath = new Set(this.state.path);

        copyPath.add(stringPosition)

        this.setState({
            path: copyPath,
        })
    }

    /*
    setAgent = (position) => {
        this.setState({
            agent: position,
        })

    }
    */
    setAgent = (position, stringPosition) => {
        let copyPath = new Set(this.state.path);

        copyPath.add(stringPosition)
        //console.log(copyPath)

        this.setState({
            agent: position,
            path: copyPath,

        })

    }

    setAgent2 = (position) => {
        this.setState({
            agent2: position,
        })

    }


    setMazeInfo = (maze) => {
        this.setState({
            maze: maze,
            mazeComplete: true,
        })
    }

    setStart = () => {
        this.setState({
            //player: { x: 0, y: 0 },
            //player2: { x: 0, y: 0 },
            agent: { x: 0, y: 0 },

            start: true,
        })
    }

    createNewMaze = () => {
        this.setState({
            createNewMaze: this.state.createNewMaze === 0 ? 1 : 0,
            //player: {},
            //player2: {},
            agent: {},
            mazeComplete: false,
            gameMessage: "",
            wonGame: false,
        })
    }

    render() {
        return(
            <div className="main-container">

                <Agent 
                    start={this.state.start}
                    maze={this.state.maze}
                    setAgent={this.setAgent}
                    setPath={this.setPath}
                    resetPath={this.resetPath}
                />


                <Maze
                    key={this.state.createNewMaze}
                    agent={this.state.agent}
                    path={this.state.path}
                    setMazeInfo={this.setMazeInfo}
                    rows={this.state.rows}
                    columns={this.state.columns}
                    start={this.state.start}
                />

                <Sidebar
                    mode={"maze training"}
                    mazeComplete={this.state.mazeComplete}
                    start={this.state.start}
                    wonGame={this.state.wonGame}
                    gMessage={this.state.gameMessage}
                    setStart={this.setStart}
                    createNewMaze={this.createNewMaze}
                />
            </div>
        )
    }
}


export default MazeTraining;