import { Component } from 'react'
import './App.css'

import Vegeta from './components/Vegeta';
import Goku from './components/Goku';

class App extends Component {

  render () {
    return (
      <div className="container text-center">
        <h1>Goku vs Vegeta</h1>
        <div className="row">
          <Vegeta name="Vegeta" />
          <Goku name="Goku" />
        </div>
      </div>
    )
  }
}

export default App
