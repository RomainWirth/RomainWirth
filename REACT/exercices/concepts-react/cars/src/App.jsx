import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars'

class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
    colorTitle: 'green'
  }

  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} colorTitle={this.state.colorTitle} />
      </div>
    )
  }
}

export default App
