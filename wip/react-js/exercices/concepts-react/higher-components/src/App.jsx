import { Component } from 'react'

import './App.css'
import Vegeta from './components/Vegeta.jsx'
import Goku from './components/Goku.jsx'

import { VEGETA, GOKU } from './const/index.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      vegeta: 100,
      goku: 100,
      resetKey: 0,
      currentTurn: VEGETA
    }
  }

  reduceHealthPoint = (name, hit) => {
    const characterToUpdate = name === GOKU ? 'vegeta' : 'goku';
    const nextTurn = name === GOKU ? VEGETA : GOKU;

    this.setState({
      [characterToUpdate]: this.state[characterToUpdate] - hit,
      currentTurn: nextTurn
    });
  }

  reserGame = () => {
    this.setState({
      vegeta: 100,
      goku: 100,
      resetKey: this.state.resetKey + 1
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Goku vs Vegeta</h1>
        <button className="btn btn-primary mb-3" onClick={this.reserGame}>Reset Game</button>
        <hr />
        <div className="row">
          <Vegeta 
            key={`vegeta-${this.state.resetKey}`}
            name="Vegeta" 
            healthPoint={this.state.vegeta} 
            reduceHealthPoint={this.reduceHealthPoint}
            isMyTurn={this.state.currentTurn === VEGETA}
          />
          <Goku 
            key={`goku-${this.state.resetKey}`}
            name="Goku" 
            healthPoint={this.state.goku} 
            reduceHealthPoint={this.reduceHealthPoint}
            isMyTurn={this.state.currentTurn === GOKU}
          />
        </div>
      </div>
    )
  }
}

export default App
