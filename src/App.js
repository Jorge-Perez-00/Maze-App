import { Component } from 'react';
import './App.css';

//COMPONENTS
import Title from './components/Title'
import Modes from './components/Modes'

import SoloGame from './components/SoloGame'
import PlayerVsPlayer from './components/PlayerVsPlayer';
import MazeTraining from './components/MazeTraining';
import Background from './components/Background';
import Multiplayer from './components/Multiplayer';


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
    console.log("ID HOVER: ", event.target.id);
    this.setState({
      hover: event.target.id
    })
  }

  handleMouseLeave = () => {
    this.setState({
      hover: ""
    })
  }


  onTitleClick = () => {
    //console.log("CLICKED ON TITLE...")
    this.setState({
      mode: "",
    })
  }

  render() {

    //document.body.style.backgroundColor = "#121212"

    return (
      <div className="App">
        {this.state.mode === ""  && <Background hover={this.state.hover} />}

        <Title mode={this.state.mode} handleTitleClick={this.onTitleClick} />


        {this.state.mode === "" && <Modes setMode={this.setMode} handleHover={this.handleHover} handleMouseLeave={this.handleMouseLeave}  />}

        {this.state.mode === "Maze Training" && <MazeTraining/>}
        {this.state.mode === 'Solo Game' && <SoloGame/>}
        {this.state.mode === 'Player Vs Player' && <PlayerVsPlayer/>}
        {this.state.mode === 'Multiplayer' && <Multiplayer/>}

      </div>
    );
  }
}

export default App;
