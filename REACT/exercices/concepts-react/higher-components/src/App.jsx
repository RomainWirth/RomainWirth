import { Component } from 'react'

import './App.css'
import Vegeta from './components/Vegeta.jsx'

class App extends Component {


  render() {
    return (
      <div className="container text-center">
        <h1>Goku vs Vegeta</h1>
        <hr />
        <div className="row">
          <Vegeta />
        </div>
      </div>
    )
  }
}

export default App
