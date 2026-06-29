import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Mon Cataloggue de voitures</h1>
        <Mycars />
      </div>
    )
  }
}

export default App
