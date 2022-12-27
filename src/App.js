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
import MessageBox from './components/MessageBox';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "",
      hover: "",

      matches: window.matchMedia("(max-width: 1000px)").matches,
      touchScreen: window.matchMedia("(pointer: coarse)").matches,
      showMessage: true

    }

  }

  componentDidMount() {
    const handler = e => this.setState({ matches: e.matches });
    window.matchMedia("(max-width: 1000px)").addEventListener('change', handler);
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
    if(this.state.mode === 'Multiplayer') {
      window.location.reload();
    }
    else {
      this.setState({
        mode: "",
      })
    }

    /*
    this.setState({
      mode: "",
    })
    */
  }


  closeMessageBox = () => {
    this.setState({
      showMessage: false,
    })
  }

  render() {

    //document.body.style.backgroundColor = "#121212"

    return (
      <div className="App">
        {this.state.mode === ""  && <Background hover={this.state.hover} />}

        <Title mode={this.state.mode} handleTitleClick={this.onTitleClick} />

        {/* {this.state.matches && (<h1 style={{color: "white"}}>Desktop Only</h1>)} */}
        {/* {!this.state.matches && (<h3 style={{ color: "white" }}>Big Screen</h3>)} */}

        {/* {this.state.touchScreen && (<h1 style={{ color: "white" }}>Touch Screen</h1>)}
        {!this.state.touchScreen && (<h3 style={{ color: "white" }}>No Touch Scren</h3>)} */}

        <MessageBox 
          open={this.state.showMessage && this.state.touchScreen}//(this.state.matches || this.state.touchScreen) && this.state.showMessage}
          message={"Desktop Only!"}
          buttons={[{ text: "Close", onClick: this.closeMessageBox }]}
        />

        <MessageBox 
          open={this.state.matches && !this.state.touchScreen}
          message={"Screen is too small!"}
          buttons={[]}
        />



        {this.state.mode === "" && <Modes disable={this.state.matches || this.state.touchScreen} setMode={this.setMode} handleHover={this.handleHover} handleMouseLeave={this.handleMouseLeave}  />}

        {this.state.mode === "Maze Training" && <MazeTraining/>}
        {this.state.mode === 'Solo Game' && <SoloGame/>}
        {this.state.mode === 'Player Vs Player' && <PlayerVsPlayer/>}
        {this.state.mode === 'Multiplayer' && <Multiplayer/>}

      </div>
    );
  }
}

export default App;
