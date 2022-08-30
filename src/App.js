import { Component } from 'react';
import './App.css';

//COMPONENTS
import Title from './components/Title'
import Modes from './components/Modes'

import SoloGame from './components/SoloGame'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "",
      
    }

  }


  setMode = (event) => {
    this.setState({
      mode: event.target.id
    })
  
  }

  

  render() {

    document.body.style.backgroundColor = "#121212"

    return (
      <div className="App">
        <Title feature={this.state.mode} />
        {this.state.mode === "" && <Modes setMode={this.setMode} />}

        
        {this.state.mode === 'solo' && <SoloGame/>}
       

      </div>
    );
  }
}

export default App;
