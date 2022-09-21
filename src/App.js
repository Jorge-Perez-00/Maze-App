import { Component } from 'react';
import './App.css';

//COMPONENTS
import Title from './components/Title'
import Modes from './components/Modes'

import SoloGame from './components/SoloGame'
import PlayerVsPlayer from './components/PlayerVsPlayer';
import MazeTraining from './components/MazeTraining';
import Background from './components/Background';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "",
      hover: "",
    }

  }


  setMode = (event) => {
    this.setState({
      mode: event.target.id,
      hover: ""
    })
  
  }

  handleHover = (event) => {
    this.setState({
      hover: event.target.id
    })
  }

  handleMouseLeave = () => {
    this.setState({
      hover: ""
    })
  }

  render() {

    //document.body.style.backgroundColor = "#121212"

    return (
      <div className="App">
        <Background hover={this.state.hover} />

        <Title feature={this.state.mode} />


        {this.state.mode === "" && <Modes setMode={this.setMode} handleHover={this.handleHover} handleMouseLeave={this.handleMouseLeave}  />}

        {this.state.mode === "Maze Training" && <MazeTraining/>}
        {this.state.mode === 'Solo Game' && <SoloGame/>}
        {this.state.mode === 'PVP Game' && <PlayerVsPlayer/>}

      </div>
    );
  }
}

export default App;
